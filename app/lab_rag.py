"""Labor "RAG-Werkstatt": Server-Teil der fuenf Bausteine (Bedeutungskarte, Chunk-Labor, Suche, Rerank, Testlabor).

Endpunkte
  POST /api/embed       {texte:[..], art?} -> {dimension, vektoren, ms}            Embeddings mit nomic-embed-text
  POST /api/rerank      {frage, kandidaten:[..], temperatur?} -> {ergebnisse, gesamt_ms, modell, hinweis}
                        llama3.2:3b bewertet jeden Kandidaten nacheinander von 0 bis 10
  POST /api/projektion  {texte:[..]} -> {punkte:[{x, y, naechste, vektor_anfang}]}  legt Texte in die 2D-Karte des Korpus

Die Karte (Mittelwert und zwei Hauptachsen) steht in app/static/daten/rag-korpus.json, erzeugt von
scripts/rag_korpus_bauen.py. Es werden weder Texte noch Ergebnisse gespeichert oder geloggt.
"""
import asyncio
import json
import time
from pathlib import Path

import httpx
import numpy as np
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app import speicher
from app.sicherheit import begrenzt, origin_ok

router = APIRouter()

OLLAMA = "http://127.0.0.1:11434"
EMBED_MODELL = "nomic-embed-text"
BEWERTER = "llama3.2:3b"
KORPUS = Path(__file__).resolve().parent / "static" / "daten" / "rag-korpus.json"

MAX_TEXTE, MAX_ZEICHEN = 64, 2000
MAX_KANDIDATEN, MAX_KANDIDAT_ZEICHEN, MAX_FRAGE_ZEICHEN = 12, 1200, 500
MAX_BYTES = 160_000
# nomic-embed-text kennt Aufgabenkennungen: Fragen und Dokumente bekommen verschiedene Vorsilben.
VORSILBEN = {"frage": "search_query: ", "dokument": "search_document: ", None: ""}
_embed_sperre = asyncio.Semaphore(2)
_bewerter_sperre = asyncio.Lock()      # immer nur ein Bewertungslauf (Speicher, GPU)

HINWEIS_RERANK = ("Bewertet wird mit einem kleinen Sprachmodell (llama3.2:3b), nicht mit einem eigens trainierten "
                  "Cross-Encoder. Die Werte können schwanken und liegen nicht immer richtig.")

_karte = {"daten": None}


def _fehler(text):
    t = (text or "").lower()
    if "allocate" in t or "cuda" in t or "out of memory" in t:
        return "Dem Jetson fehlt gerade freier Speicher für das Modell. Versuch es in einem Moment noch einmal."
    if "not found" in t:
        return "Das Modell ist auf dem Jetson nicht vorhanden."
    return "Das Modell antwortet gerade nicht. Versuch es gleich noch einmal."


async def _lesen(request: Request, limit: int = MAX_BYTES):
    """Liest den JSON-Rumpf mit Pruefungen. Gibt (dict, None) oder (None, Antwort) zurueck."""
    if not origin_ok(request.headers):
        return None, JSONResponse({"fehler": "Origin"}, status_code=403)
    try:
        if int(request.headers.get("content-length") or 0) > limit:
            raise ValueError
        roh = await request.body()
        if len(roh) > limit:
            raise ValueError
    except ValueError:
        return None, JSONResponse({"fehler": "Die Anfrage ist zu groß."}, status_code=413)
    try:
        daten = json.loads(roh.decode("utf-8"))
        if not isinstance(daten, dict):
            raise ValueError
    except Exception:
        return None, JSONResponse({"fehler": "Die Anfrage ist kein gültiges JSON."}, status_code=400)
    return daten, None


def _texte_pruefen(daten):
    """Gibt (liste, None) oder (None, Antwort) zurueck."""
    texte = daten.get("texte")
    if not isinstance(texte, list) or not texte or not all(isinstance(t, str) for t in texte):
        return None, JSONResponse({"fehler": "Schick eine Liste mit Texten."}, status_code=400)
    if len(texte) > MAX_TEXTE:
        return None, JSONResponse({"fehler": "Zu viele Texte. Erlaubt sind höchstens %d." % MAX_TEXTE}, status_code=413)
    if any(len(t) > MAX_ZEICHEN for t in texte):
        return None, JSONResponse({"fehler": "Ein Text ist zu lang. Erlaubt sind höchstens %d Zeichen." % MAX_ZEICHEN},
                                  status_code=413)
    if any(not t.strip() for t in texte):
        return None, JSONResponse({"fehler": "Leere Texte lassen sich nicht einbetten."}, status_code=400)
    return texte, None


async def _einbetten(texte, art=None):
    """Normalisierte Vektoren (float32-Matrix) fuer die Texte. Wirft RuntimeError mit lesbarer Meldung."""
    await asyncio.to_thread(speicher.sicherstellen, 2800)
    vor = VORSILBEN.get(art, "")
    try:
        async with _embed_sperre:
            async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=10.0)) as c:
                r = await c.post(f"{OLLAMA}/api/embed", json={
                    "model": EMBED_MODELL, "input": [vor + t for t in texte],
                    # CPU statt GPU: das Modell (F16) liefert auf der GPU des Jetson fuer manche Saetze nur Nullen.
                    "options": {"num_gpu": 0}})
    except httpx.HTTPError:
        raise RuntimeError("Der Jetson ist gerade nicht erreichbar.")
    if r.status_code != 200:
        raise RuntimeError(_fehler(r.text))
    m = np.array(r.json().get("embeddings", []), dtype=np.float32)
    if m.ndim != 2 or m.shape[0] != len(texte):
        raise RuntimeError("Die Einbettung ist fehlgeschlagen.")
    n = np.linalg.norm(m, axis=1, keepdims=True)
    if not np.all(np.isfinite(n)) or np.any(n < 1e-6):
        raise RuntimeError("Für einen der Texte konnte das Modell keine Zahlen berechnen. Formuliere ihn anders.")
    return m / n


@router.post("/api/embed")
async def embed_api(request: Request):
    daten, fehler = await _lesen(request)
    if fehler:
        return fehler
    if begrenzt(request, "embed", 60, 60):
        return JSONResponse({"fehler": "Zu viele Anfragen. Warte eine Minute."}, status_code=429)
    texte, fehler = _texte_pruefen(daten)
    if fehler:
        return fehler
    art = daten.get("art")
    if art not in VORSILBEN:
        return JSONResponse({"fehler": "Unbekannte Art."}, status_code=400)
    t0 = time.perf_counter()
    try:
        m = await _einbetten(texte, art)
    except RuntimeError as e:
        return JSONResponse({"fehler": str(e)}, status_code=503)
    return JSONResponse({"dimension": int(m.shape[1]),
                         "vektoren": [[round(float(v), 5) for v in z] for z in m],
                         "ms": round((time.perf_counter() - t0) * 1000)})


def _prompt(frage, text):
    return ("Du bist ein strenger Prüfer. Lies den Text und die Frage.\n\n"
            "Text: " + text + "\nFrage: " + frage + "\n\n"
            "Gib an, wie genau der Text die Frage beantwortet, als ganze Zahl von 0 bis 10. "
            "Ein Text, der nur dasselbe Thema hat, bekommt höchstens 4. "
            "Ein Text mit der gesuchten Angabe bekommt 8 bis 10. "
            'Antworte als JSON: {"score": Zahl}')


async def _bewerte_einen(client, frage, text, temperatur):
    """Gibt (score, ms). Bei unlesbarer Ausgabe ein zweiter Versuch, danach RuntimeError."""
    t0 = time.perf_counter()
    for _ in range(2):
        optionen = {"temperature": temperatur, "num_predict": 24, "num_gpu": speicher.LLM_GPU_SCHICHTEN}
        if temperatur == 0:
            optionen["seed"] = 0
        r = await client.post(f"{OLLAMA}/api/chat", json={
            "model": BEWERTER, "stream": False, "format": "json", "options": optionen,
            "messages": [{"role": "user", "content": _prompt(frage, text)}],
        })
        if r.status_code != 200:
            raise RuntimeError(_fehler(r.text))
        try:
            inhalt = json.loads(r.json()["message"]["content"])
            score = float(inhalt["score"])
            if score != score or score < 0 or score > 10:
                raise ValueError
            return round(score, 1), round((time.perf_counter() - t0) * 1000)
        except Exception:
            continue
    raise RuntimeError("Das Modell hat keine lesbare Bewertung geliefert.")


@router.post("/api/rerank")
async def rerank_api(request: Request):
    daten, fehler = await _lesen(request)
    if fehler:
        return fehler
    if begrenzt(request, "rerank", 60, 60):
        return JSONResponse({"fehler": "Zu viele Anfragen. Warte eine Minute."}, status_code=429)
    frage, kand = daten.get("frage"), daten.get("kandidaten")
    if not isinstance(frage, str) or not frage.strip():
        return JSONResponse({"fehler": "Stell zuerst eine Frage."}, status_code=400)
    if len(frage) > MAX_FRAGE_ZEICHEN:
        return JSONResponse({"fehler": "Die Frage ist zu lang."}, status_code=413)
    if not isinstance(kand, list) or not kand or not all(isinstance(k, str) and k.strip() for k in kand):
        return JSONResponse({"fehler": "Schick eine Liste mit Kandidaten."}, status_code=400)
    if len(kand) > MAX_KANDIDATEN:
        return JSONResponse({"fehler": "Zu viele Kandidaten. Erlaubt sind höchstens %d." % MAX_KANDIDATEN},
                            status_code=413)
    if any(len(k) > MAX_KANDIDAT_ZEICHEN for k in kand):
        return JSONResponse({"fehler": "Ein Kandidat ist zu lang."}, status_code=413)
    temperatur = daten.get("temperatur", 0)
    if isinstance(temperatur, bool) or not isinstance(temperatur, (int, float)) or not 0 <= temperatur <= 1:
        return JSONResponse({"fehler": "Die Temperatur muss zwischen 0 und 1 liegen."}, status_code=400)
    await asyncio.to_thread(speicher.sicherstellen, 2800)
    t0 = time.perf_counter()
    erg = []
    try:
        async with _bewerter_sperre:
            async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0)) as c:
                for i, text in enumerate(kand):
                    score, ms = await _bewerte_einen(c, frage, text, float(temperatur))
                    erg.append({"index": i, "score": score, "ms": ms})
    except RuntimeError as e:
        return JSONResponse({"fehler": str(e)}, status_code=503)
    except httpx.HTTPError:
        return JSONResponse({"fehler": "Der Jetson ist gerade nicht erreichbar."}, status_code=503)
    return JSONResponse({"ergebnisse": erg, "gesamt_ms": round((time.perf_counter() - t0) * 1000),
                         "modell": BEWERTER, "temperatur": float(temperatur), "hinweis": HINWEIS_RERANK})


def _karte_laden():
    """Laedt Mittelwert, Achsen und Satzvektoren der Karte (einmal, aus der Korpusdatei)."""
    if _karte["daten"] is None:
        k = json.loads(KORPUS.read_text(encoding="utf-8"))
        kk = k["karte"]
        _karte["daten"] = {
            "mittel": np.array(kk["mittelwert"], dtype=np.float32),
            "achsen": np.array(kk["achsen"], dtype=np.float32),
            "vekt": np.array([s["vektor"] for s in k["saetze"]], dtype=np.float32),
        }
    return _karte["daten"]


@router.post("/api/projektion")
async def projektion_api(request: Request):
    daten, fehler = await _lesen(request)
    if fehler:
        return fehler
    if begrenzt(request, "projektion", 60, 60):
        return JSONResponse({"fehler": "Zu viele Anfragen. Warte eine Minute."}, status_code=429)
    texte, fehler = _texte_pruefen(daten)
    if fehler:
        return fehler
    try:
        karte = await asyncio.to_thread(_karte_laden)
    except Exception:
        return JSONResponse({"fehler": "Die Karte ist auf dem Gerät nicht vorhanden."}, status_code=503)
    try:
        m = await _einbetten(texte, None)
    except RuntimeError as e:
        return JSONResponse({"fehler": str(e)}, status_code=503)
    xy = (m - karte["mittel"]) @ karte["achsen"].T
    aehn = m @ karte["vekt"].T
    punkte = []
    for i in range(len(texte)):
        reihenfolge = np.argsort(-aehn[i])[:5]
        punkte.append({
            "x": round(float(xy[i, 0]), 4), "y": round(float(xy[i, 1]), 4),
            "naechste": [{"index": int(j), "aehnlichkeit": round(float(aehn[i, j]), 4)} for j in reihenfolge],
            "vektor_anfang": [round(float(v), 4) for v in m[i, :48]],
        })
    return JSONResponse({"dimension": int(m.shape[1]), "punkte": punkte})
