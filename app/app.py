#!/usr/bin/env python3
"""Jetson Demo-Hub: kleine Webapp, die auf dem Jetson Orin Nano laeuft und mehrere
KI-Demos zum Anfassen zeigt. Live-Systemmonitor aus tegrastats (RAM/GPU/Strom),
LLM-Chat ueber das lokale Ollama. Weitere Demos (Whisper, YOLO, Face-Swap) werden
als Kacheln gefuehrt und schrittweise scharf geschaltet.

Start:  uvicorn app:app --host 0.0.0.0 --port 8000
Keine Fremddienste ausser dem lokalen Ollama (127.0.0.1:11434).
"""
import ast
import asyncio
import json
import operator
import re
import subprocess
import threading
import time
from pathlib import Path

import base64
import os
import secrets
import socket
from urllib.parse import urlparse

# Schutz vor Dekompressionsbomben: OpenCV lehnt Bilder mit mehr Pixeln als 1920x1080 ab.
# Muss VOR dem Import von cv2 gesetzt sein.
os.environ.setdefault("OPENCV_IO_MAX_IMAGE_PIXELS", str(1920 * 1080))

import cv2
import numpy as np
import httpx
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.datastructures import MutableHeaders

from app import agent_werkzeuge, speicher
from app.sicherheit import Belegt, sicherheitskoepfe, Sitzungen, Warteschlange, begrenzt, origin_ok, sitzungs_kennung, umgebung_zahl

HIER = Path(__file__).resolve().parent
OLLAMA = "http://127.0.0.1:11434"
CHAT_MODELL = "llama3.2:3b"
# Nur diese Modelle duerfen geladen/angesprochen werden (verhindert beliebige Ollama-Pulls / SSRF)
ERLAUBTE_MODELLE = {"llama3.2:3b", "nomic-embed-text"}
TOKEN_TRENNER = "\u2063"        # unsichtbares Zeichen zwischen Tokens, damit die Oberflaeche sie einzeln zeigen kann
MAX_NACHRICHT = 4000          # Zeichen pro Chat-Anfrage
MAX_FRAME_BYTES = 2_000_000   # ~2 MB pro Webcam-Frame (480x360 JPEG ist weit darunter)


def _oeffentliche_url():
    """Basisadresse fuer canonical, og:url und Sitemap (Umgebungsvariable OEFFENTLICHE_URL), sonst leer."""
    roh = os.environ.get("OEFFENTLICHE_URL", "").strip().rstrip("/")
    try:
        u = urlparse(roh)
        if u.scheme in ("http", "https") and u.hostname and not u.path and not u.query:
            return roh
    except ValueError:
        pass
    return ""


_OEFFENTLICHE_URL = _oeffentliche_url()


def _erlaubte_hosts():
    """Hostnamen, unter denen die App erreichbar sein darf (Schutz vor DNS-Rebinding).
    Eigene IPs und Name werden beim Start ermittelt; weitere per SHOWCASE_ALLOWED_HOSTS (kommagetrennt)."""
    hosts = {"localhost", "127.0.0.1", "[::1]", "testserver"}
    name = socket.gethostname()
    hosts.update({name, name + ".local"})
    try:
        aus = subprocess.run(["hostname", "-I"], capture_output=True, text=True, timeout=3).stdout
        hosts.update(aus.split())
    except Exception:
        pass
    hosts.update(h.strip() for h in os.environ.get("SHOWCASE_ALLOWED_HOSTS", "").split(",") if h.strip())
    if _OEFFENTLICHE_URL:
        hosts.add(urlparse(_OEFFENTLICHE_URL).hostname)
    return sorted(hosts)


def _origin_ok(headers) -> bool:
    """Zustandsaendernde Endpunkte verlangen einen Origin-Header, der zum Host passt (Regel in app/sicherheit.py).
    Der Host selbst ist per TrustedHostMiddleware auf die Allowlist begrenzt."""
    return origin_ok(headers)


def _ist_jpeg_dataurl(s) -> bool:
    return isinstance(s, str) and s.startswith("data:image/jpeg;base64,")


# Oeffentlicher Betrieb (OEFFENTLICH=1): zusaetzlich Ratenbegrenzung je Besucher. Intern aus, damit Tests nicht bremsen.
_OEFFENTLICH = os.environ.get("OEFFENTLICH") == "1"
# Die automatische API-Dokumentation (/docs, /redoc, /openapi.json) listet alle Pfade: aus, ausser KL_API_DOKU=1 (nur LAN-Tests).
_API_DOKU = os.environ.get("KL_API_DOKU") == "1" and not _OEFFENTLICH
app = FastAPI(title="Jetson Demo-Hub", **({} if _API_DOKU else {"docs_url": None, "redoc_url": None, "openapi_url": None}))
app.add_middleware(TrustedHostMiddleware, allowed_hosts=_erlaubte_hosts())
# Einstellbar ueber Umgebungsvariablen (siehe docs/veroeffentlichung.md):
#   SITZUNG_TTL_S      Zeitlimit je Sitzung: Anlern-Beispiele und RAG-Texte verfallen nach so vielen Sekunden Ruhe (Standard 1800)
#   LLM_PARALLEL       gleichzeitige Sprachmodell-Antworten (Chat, RAG-Frage, Agent), Standard 2 (Speicher und GPU sind knapp)
#   LLM_WARTEND_MAX    wie viele Besucher dahinter warten duerfen, Standard 6; weitere bekommen sofort "ausgelastet"
#   LLM_WARTEZEIT_S    laengste Wartezeit in der Schlange, Standard 90
_sitzungen = Sitzungen(ttl_s=umgebung_zahl("SITZUNG_TTL_S", 1800, 60), maximal=200)
LLM_PARALLEL = int(umgebung_zahl("LLM_PARALLEL", 2))
_llm = Warteschlange(LLM_PARALLEL, int(umgebung_zahl("LLM_WARTEND_MAX", 6, 0)), umgebung_zahl("LLM_WARTEZEIT_S", 90, 5))
WS_MAX = 6                     # gleichzeitige Kameraverbindungen
_ws_aktiv = 0


def _zustand(request):
    """Zustand dieses Besuchers (Anlern-Beispiele, RAG-Abschnitte): getrennt je Cookie-Sitzung, Ablauf nach 30 Minuten."""
    return _sitzungen.holen(sitzungs_kennung(request))


def _zu_viele(request, name, maximal, fenster=60.0):
    return _OEFFENTLICH and begrenzt(request, name, maximal, fenster)


ZU_VIELE = {"fehler": "Du hast gerade sehr schnell hintereinander gefragt. Warte etwa eine Minute, dann geht es weiter.", "limit": True}
BELEGT_TEXT = ("Der Rechner ist gerade ausgelastet, weil viele Menschen das Labor nutzen. "
               "Du hast nichts falsch gemacht. Versuch es gleich noch einmal.")
WIEDERHOLEN_S = 8


def _belegt_antwort():
    """Wird zurueckgegeben, wenn weder ein Platz noch ein Warteplatz frei ist (vor Beginn des Antwortstroms)."""
    return JSONResponse({"fehler": BELEGT_TEXT, "belegt": True, "wiederholen_s": WIEDERHOLEN_S}, status_code=503,
                        headers={"Retry-After": str(WIEDERHOLEN_S)})


async def _mit_platz(request, strom):
    """Fuehrt den Antwortstrom `strom` (asynchroner Generator) erst aus, wenn in der Warteschlange ein Platz frei ist.
    Der Platz wird erst nach dem letzten Stueck freigegeben (auch bei Abbruch). Besucher, die warten, fragen ihre
    Platznummer ueber GET /api/warteschlange ab."""
    try:
        async with _llm.platz(sitzungs_kennung(request)):
            async for stueck in strom:
                yield stueck
    except Belegt:
        yield "[" + BELEGT_TEXT + "]"


@app.get("/api/warteschlange")
def warteschlange(request: Request):
    """Belegung der Sprachmodelle und Platznummer des Aufrufers (meine_position: 0 = wartet nicht, 1 = als Naechster dran)."""
    return JSONResponse(_llm.stand(sitzungs_kennung(request)), headers={"Cache-Control": "no-store"})


def _ollama_fehler(text):
    """Macht eine Fehlermeldung von Ollama fuer Besucher verstaendlich."""
    t = (text or "").lower()
    if speicher.bei_ladefehler(text):
        return "Dem Jetson fehlt gerade freier Speicher, um das Sprachmodell zu laden. Versuch es in einem Moment noch einmal."
    if "not found" in t:
        return "Das Modell ist auf dem Jetson nicht vorhanden."
    return "Das Sprachmodell antwortet gerade nicht."


async def _speicher_bereit():
    """Vor dem Laden eines Modells genug freien RAM sicherstellen (Dateicache freigeben, falls noetig)."""
    await asyncio.to_thread(speicher.sicherstellen, 2800)
_STATIC_DIR = HIER / "static"
(_STATIC_DIR / "videos").mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(_STATIC_DIR)), name="static")

# Labor-Erweiterungen: jede Datei app/lab_*.py mit einem Objekt `router` (FastAPI APIRouter) wird eingebunden.
# Ein fehlerhaftes Modul darf den Start nicht verhindern.
import importlib
for _modul in sorted(_f.stem for _f in HIER.glob("lab_*.py")):
    try:
        app.include_router(importlib.import_module("app." + _modul).router)
        print("Labor-Modul geladen:", _modul)
    except Exception as _e:                                   # noqa: BLE001
        print("Labor-Modul fehlgeschlagen:", _modul, repr(_e))

# Gesichtserkennung: YuNet (robust bei geneigten/seitlichen Gesichtern, liefert Landmarks),
# Haar-Cascade nur als Rueckfall, falls das YuNet-Modell fehlt.
_yunet_pfad = HIER / "models" / "face_detection_yunet_2023mar.onnx"
_yunet = (cv2.FaceDetectorYN.create(str(_yunet_pfad), "", (320, 320), 0.7)
          if hasattr(cv2, "FaceDetectorYN") and _yunet_pfad.exists() else None)
_cascade = cv2.CascadeClassifier(str(HIER / "models" / "haarcascade_frontalface_default.xml"))


def _erkenne_gesichter(img):
    """Zeichnet Rahmen (und bei YuNet Landmarks) ein und gibt die Anzahl zurueck."""
    if _yunet is not None:
        h, w = img.shape[:2]
        _yunet.setInputSize((w, h))
        _, faces = _yunet.detect(img)
        if faces is None:
            return 0
        for f in faces:
            x, y, bw, bh = f[:4].astype(int)
            cv2.rectangle(img, (x, y), (x + bw, y + bh), (0, 185, 118), 3)
            cv2.putText(img, "Gesicht", (x, max(y - 9, 16)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 185, 118), 2)
            for i in range(4, 14, 2):                       # 5 Landmarks: Augen, Nase, Mundwinkel
                cv2.circle(img, (int(f[i]), int(f[i + 1])), 2, (255, 190, 0), -1)
        return len(faces)
    grau = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gesichter = _cascade.detectMultiScale(grau, scaleFactor=1.15, minNeighbors=5, minSize=(60, 60))
    for (x, y, w, h) in gesichter:
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 185, 118), 3)
        cv2.putText(img, "Gesicht", (x, max(y - 9, 16)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 185, 118), 2)
    return len(gesichter)


# Objekterkennung: YOLOX-tiny (COCO 80 Klassen) ueber OpenCV-DNN, kein PyTorch noetig
_yolox_pfad = HIER / "models" / "yolox_tiny.onnx"
_yolox = cv2.dnn.readNetFromONNX(str(_yolox_pfad)) if _yolox_pfad.exists() else None
COCO_DE = ["Person", "Fahrrad", "Auto", "Motorrad", "Flugzeug", "Bus", "Zug", "LKW", "Boot", "Ampel",
           "Hydrant", "Stoppschild", "Parkuhr", "Bank", "Vogel", "Katze", "Hund", "Pferd", "Schaf", "Kuh",
           "Elefant", "Baer", "Zebra", "Giraffe", "Rucksack", "Schirm", "Handtasche", "Krawatte", "Koffer",
           "Frisbee", "Ski", "Snowboard", "Ball", "Drachen", "Schlaeger", "Handschuh", "Skateboard",
           "Surfbrett", "Tennisschlaeger", "Flasche", "Weinglas", "Tasse", "Gabel", "Messer", "Loeffel",
           "Schale", "Banane", "Apfel", "Sandwich", "Orange", "Brokkoli", "Karotte", "Hotdog", "Pizza",
           "Donut", "Kuchen", "Stuhl", "Sofa", "Topfpflanze", "Bett", "Esstisch", "Toilette", "TV", "Laptop",
           "Maus", "Fernbedienung", "Tastatur", "Handy", "Mikrowelle", "Ofen", "Toaster", "Spuele",
           "Kuehlschrank", "Buch", "Uhr", "Vase", "Schere", "Teddybaer", "Foehn", "Zahnbuerste"]
_YX_GRIDS = None  # einmal berechnete Gitter/Strides fuer das YOLOX-Decoding


def _yolox_gitter():
    global _YX_GRIDS
    if _YX_GRIDS is None:
        grids, strides = [], []
        for s in (8, 16, 32):
            g = 640 // s
            xv, yv = np.meshgrid(np.arange(g), np.arange(g))
            grid = np.stack((xv, yv), 2).reshape(-1, 2)
            grids.append(grid)
            strides.append(np.full((grid.shape[0], 1), s))
        _YX_GRIDS = (np.concatenate(grids, 0), np.concatenate(strides, 0))
    return _YX_GRIDS


def _erkenne_objekte(img, schwelle=0.5):
    if _yolox is None:
        return 0
    H, W = img.shape[:2]
    r = min(640 / W, 640 / H)
    nw, nh = int(W * r), int(H * r)
    padded = np.full((640, 640, 3), 114, np.uint8)
    padded[:nh, :nw] = cv2.resize(img, (nw, nh))
    blob = cv2.dnn.blobFromImage(padded, 1.0, (640, 640), swapRB=True)  # YOLOX: RGB, keine Skalierung
    _yolox.setInput(blob)
    out = _yolox.forward()[0]                       # (8400, 85)
    grids, strides = _yolox_gitter()
    xy = (out[:, 0:2] + grids) * strides
    wh = np.exp(out[:, 2:4]) * strides
    scores = out[:, 4:5] * out[:, 5:]
    cls = scores.argmax(1)
    conf = scores.max(1)
    boxes, confs, clss = [], [], []
    for i in np.where(conf > schwelle)[0]:
        cx, cy = xy[i]
        bw, bh = wh[i]
        boxes.append([int((cx - bw / 2) / r), int((cy - bh / 2) / r), int(bw / r), int(bh / r)])
        confs.append(float(conf[i]))
        clss.append(int(cls[i]))
    idx = cv2.dnn.NMSBoxes(boxes, confs, schwelle, 0.45) if boxes else []
    anzahl = 0
    for i in np.array(idx).flatten():
        x, y, w, h = boxes[i]
        name = COCO_DE[clss[i]] if clss[i] < len(COCO_DE) else "?"
        cv2.rectangle(img, (x, y), (x + w, y + h), (0, 165, 255), 2)
        cv2.putText(img, "%s %.0f%%" % (name, confs[i] * 100), (x, max(y - 7, 14)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 165, 255), 2)
        anzahl += 1
    return anzahl


# Die cv2-Modelle (YuNet/YOLOX/Haar) sind geteilte native Objekte und nicht threadsicher.
# Da _verarbeite_frame im Threadpool laeuft (mehrere Webcam-Clients), wird die Inferenz
# mit diesem Lock serialisiert — verhindert Race Conditions / vermischte Ergebnisse.
_inferenz_lock = threading.Lock()


def _verarbeite_frame(roh, modus, schwelle=0.5):
    """Dekodiert, begrenzt die Groesse, erkennt und kodiert zurueck. Laeuft im Threadpool.
    Misst jeden Schritt einzeln, damit die Oberflaeche zeigen kann, wo die Zeit bleibt."""
    t0 = time.time()
    arr = np.frombuffer(roh, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        return None
    h, w = img.shape[:2]
    if w > 1280 or h > 720:                         # Schutz gegen zu grosse Frames
        s = min(1280 / w, 720 / h)
        img = cv2.resize(img, (int(w * s), int(h * s)))
        h, w = img.shape[:2]
    t1 = time.time()
    with _inferenz_lock:
        t2 = time.time()
        anzahl = _erkenne_objekte(img, schwelle) if modus == "objekt" else _erkenne_gesichter(img)
    t3 = time.time()
    ok, jpg = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 70])
    t4 = time.time()
    return json.dumps({
        "bild": "data:image/jpeg;base64," + base64.b64encode(jpg).decode(),
        "anzahl": int(anzahl),
        "ms": round((t4 - t0) * 1000),
        "modus": modus,
        "zeiten": {"dekodieren": round((t1 - t0) * 1000, 1), "warten": round((t2 - t1) * 1000, 1),
                   "erkennen": round((t3 - t2) * 1000, 1), "kodieren": round((t4 - t3) * 1000, 1)},
        "bytes_ein": len(roh), "bytes_aus": int(len(jpg)), "breite": int(w), "hoehe": int(h),
        "schwelle": schwelle,
    })

# ---------- Live-Systemwerte aus tegrastats ----------
_letzte_zeile = {"roh": "", "zeit": 0.0}


def _tegrastats_leser():
    """Haelt dauerhaft eine tegrastats-Instanz offen und merkt sich die letzte Zeile."""
    while True:
        try:
            p = subprocess.Popen(
                ["tegrastats", "--interval", "1000"],
                stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True,
            )
            for zeile in p.stdout:
                _letzte_zeile["roh"] = zeile.strip()
                _letzte_zeile["zeit"] = time.time()
        except Exception:
            time.sleep(2)
        else:
            time.sleep(2)


def _parse_tegrastats(z):
    d = {}
    m = re.search(r"RAM (\d+)/(\d+)MB", z)
    if m:
        d["ram_mb"], d["ram_max_mb"] = int(m.group(1)), int(m.group(2))
    m = re.search(r"SWAP (\d+)/(\d+)MB", z)
    if m:
        d["swap_mb"], d["swap_max_mb"] = int(m.group(1)), int(m.group(2))
    m = re.search(r"GR3D_FREQ (\d+)%", z)
    if m:
        d["gpu_pct"] = int(m.group(1))
    m = re.search(r"CPU \[([^\]]+)\]", z)
    if m:
        kerne = [int(x) for x in re.findall(r"(\d+)%@", m.group(1))]
        d["cpu_pct"] = round(sum(kerne) / len(kerne)) if kerne else 0
    m = re.search(r"tj@([\d.]+)C", z) or re.search(r"gpu@([\d.]+)C", z)
    if m:
        d["temp_c"] = round(float(m.group(1)), 1)
    m = re.search(r"VDD_IN (\d+)mW", z)
    if m:
        d["power_w"] = round(int(m.group(1)) / 1000, 1)
    return d


@app.get("/api/stats")
def stats():
    d = _parse_tegrastats(_letzte_zeile["roh"])
    d["frisch"] = (time.time() - _letzte_zeile["zeit"]) < 4
    d["warteschlange"] = {"aktiv": _llm.aktiv, "wartend": _llm.wartend, "parallel": _llm.parallel}
    # geladene Modelle aus Ollama
    try:
        r = httpx.get(f"{OLLAMA}/api/ps", timeout=2)
        d["modelle_geladen"] = [m["name"] for m in r.json().get("models", [])]
    except Exception:
        d["modelle_geladen"] = []
    return JSONResponse(d)


@app.get("/api/models")
def models():
    try:
        r = httpx.get(f"{OLLAMA}/api/tags", timeout=4)
        return JSONResponse({"modelle": [m["name"] for m in r.json().get("models", [])]})
    except Exception as e:
        return JSONResponse({"modelle": [], "fehler": str(e)})


# ---------- LLM-Chat ueber lokales Ollama ----------
KURZ_PROMPT = "Antworte in höchstens 5 Sätzen in einfacher Sprache."
KURZ_MAX_TOKEN = 300
@app.post("/api/chat")
async def chat(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "ungueltiger Origin"}, status_code=403)
    if _zu_viele(req, "chat", 20):
        return JSONResponse(ZU_VIELE, status_code=429)
    if _llm.voll():
        return _belegt_antwort()
    try:
        daten = await req.json()
    except Exception:
        daten = None
    if not isinstance(daten, dict):
        return JSONResponse({"fehler": "ungueltige Anfrage"}, status_code=400)
    nachricht = daten.get("nachricht")
    nachricht = nachricht.strip() if isinstance(nachricht, str) else ""
    modell = daten.get("modell") or CHAT_MODELL
    if not nachricht:
        return JSONResponse({"fehler": "leere Nachricht"}, status_code=400)
    if len(nachricht) > MAX_NACHRICHT:
        return JSONResponse({"fehler": "Nachricht zu lang"}, status_code=400)
    if modell not in ERLAUBTE_MODELLE:
        return JSONResponse({"fehler": "Modell nicht erlaubt"}, status_code=400)

    try:
        temperatur = max(0.0, min(2.0, float(daten.get("temperatur", 0.7))))
    except (TypeError, ValueError):
        temperatur = 0.7

    # "Kurz antworten" (Schalter am Chat-Feld): nur der Wert true zaehlt, alles andere gilt als aus. Begrenzt Saetze und Laenge.
    kurz = daten.get("kurz") is True

    async def strom_innen():
        await _speicher_bereit()
        start = time.time()
        tokens = 0
        payload = {
            "model": modell,
            "messages": ([{"role": "system", "content": KURZ_PROMPT}] if kurz else []) + [{"role": "user", "content": nachricht}],
            "stream": True,
            "options": {"temperature": temperatur, "num_gpu": speicher.gpu_schichten(), "num_batch": speicher.LLM_BATCH, **({"num_predict": KURZ_MAX_TOKEN} if kurz else {})},
        }
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(300.0, connect=10.0)) as c:
                async with c.stream("POST", f"{OLLAMA}/api/chat", json=payload) as r:
                    async for zeile in r.aiter_lines():
                        if not zeile.strip():
                            continue
                        obj = json.loads(zeile)
                        if obj.get("error"):
                            yield "\n[" + _ollama_fehler(obj["error"]) + "]"
                            return
                        stueck = obj.get("message", {}).get("content", "")
                        if stueck:
                            tokens += 1
                            yield stueck + TOKEN_TRENNER
                        if obj.get("done"):
                            dauer = time.time() - start
                            rate = tokens / dauer if dauer > 0 else 0
                            yield f"\n\n---\n{tokens} Tokens in {dauer:.1f}s ({rate:.1f} Tok/s), Temperatur {temperatur:g}"
        except Exception as e:
            yield f"\n[Fehler: {e}]"

    return StreamingResponse(_mit_platz(req, strom_innen()), media_type="text/plain; charset=utf-8")


# ---------- Modell laden mit Fortschritt (Ollama pull) ----------
@app.post("/api/pull")
async def pull(request: Request):
    if not _origin_ok(request.headers):
        return JSONResponse({"fehler": "ungueltiger Origin"}, status_code=403)
    try:
        modell = (await request.json()).get("modell") or CHAT_MODELL
    except Exception:
        modell = CHAT_MODELL
    if modell not in ERLAUBTE_MODELLE:
        return JSONResponse({"fehler": "Modell nicht erlaubt"}, status_code=400)

    async def strom():
        try:
            async with httpx.AsyncClient(timeout=None) as c:
                async with c.stream("POST", f"{OLLAMA}/api/pull",
                                    json={"model": modell, "stream": True}) as r:
                    async for zeile in r.aiter_lines():
                        if not zeile.strip():
                            continue
                        o = json.loads(zeile)
                        total = o.get("total") or 0
                        done = o.get("completed") or 0
                        pct = round(done / total * 100) if total else None
                        yield "data: " + json.dumps({"status": o.get("status", ""), "pct": pct}) + "\n\n"
            yield "data: " + json.dumps({"status": "fertig", "pct": 100, "done": True}) + "\n\n"
        except Exception as e:
            yield "data: " + json.dumps({"status": f"Fehler: {e}", "done": True}) + "\n\n"

    return StreamingResponse(strom(), media_type="text/event-stream")


# ---------- Webcam-Pipeline: Browser-Frame -> Jetson -> annotiert zurueck ----------
@app.websocket("/ws/vision")
async def ws_vision(ws: WebSocket):
    # Schutz gegen Cross-Site-WebSocket-Hijacking: Origin muss zum Host passen
    if not _origin_ok(ws.headers):
        await ws.close(code=1008)
        return
    modus = ws.query_params.get("modus", "gesicht")
    if modus not in ("gesicht", "objekt"):
        modus = "gesicht"
    global _ws_aktiv
    if _ws_aktiv >= WS_MAX:
        await ws.close(code=1013)      # Server ausgelastet, spaeter erneut versuchen
        return
    _ws_aktiv += 1
    await ws.accept()
    schwelle = 0.5
    try:
        while True:
            daten = await ws.receive_text()      # dataURL "data:image/jpeg;base64,..." oder Steuer-JSON
            if len(daten) > MAX_FRAME_BYTES:
                continue
            if daten.startswith("{"):            # Steuernachricht, z. B. {"schwelle": 0.35}
                try:
                    schwelle = max(0.1, min(0.9, float(json.loads(daten).get("schwelle", schwelle))))
                except Exception:
                    pass
                continue
            if not _ist_jpeg_dataurl(daten):
                continue
            roh = base64.b64decode(daten.split(",", 1)[-1])
            ergebnis = await asyncio.to_thread(_verarbeite_frame, roh, modus, schwelle)
            if ergebnis:
                await ws.send_text(ergebnis)
    except WebSocketDisconnect:
        pass
    except Exception:
        try:
            await ws.close()
        except Exception:
            pass
    finally:
        _ws_aktiv -= 1


# ---------- Bildmodell anlernen (Teachable Machine: Embeddings + kNN) ----------
_embed_pfad = HIER / "models" / "mobilenet_embed.onnx"
_embed_net = cv2.dnn.readNetFromONNX(str(_embed_pfad)) if _embed_pfad.exists() else None
# Anlern-Beispiele liegen je Besucher in _zustand(request)["teach"]
_teach_lock = threading.Lock()
MAX_LABELS = 10                  # Obergrenzen gegen Speicher-DoS
MAX_SAMPLES = 50


def _decode_dataurl(dataurl):
    roh = base64.b64decode(dataurl.split(",", 1)[-1])
    return cv2.imdecode(np.frombuffer(roh, np.uint8), cv2.IMREAD_COLOR)


def _embedding(img):
    blob = cv2.dnn.blobFromImage(img, 1 / 255.0, (224, 224),
                                 (0.485 * 255, 0.456 * 255, 0.406 * 255), swapRB=True)
    with _inferenz_lock:
        _embed_net.setInput(blob)
        v = _embed_net.forward().flatten().astype(np.float32)
    n = np.linalg.norm(v)
    return v / n if n > 0 else v


def _teach_sample(dataurl, label, teach):
    img = _decode_dataurl(dataurl)
    if img is None:
        return None
    vec = _embedding(img)
    with _teach_lock:
        if label not in teach and len(teach) >= MAX_LABELS:
            return {k: len(v) for k, v in teach.items()}      # Label-Limit erreicht
        lst = teach.setdefault(label, [])
        if len(lst) < MAX_SAMPLES:
            lst.append(vec)
        return {k: len(v) for k, v in teach.items()}


def _teach_classify(dataurl, teach, k=3):
    img = _decode_dataurl(dataurl)
    if img is None:
        return {"label": None, "conf": 0.0}
    vec = _embedding(img)
    with _teach_lock:
        paare = [(float(np.dot(vec, s)), label) for label, vs in teach.items() for s in vs]
    if not paare:
        return {"label": None, "conf": 0.0}
    paare.sort(reverse=True)
    top = paare[:k]
    from collections import Counter
    counts = Counter(l for _, l in top)
    label, cnt = counts.most_common(1)[0]
    sims = [s for s, l in top if l == label]
    scores = {}
    for sim, l in paare:                              # beste Aehnlichkeit je Klasse fuer die Balkenanzeige
        scores[l] = max(scores.get(l, -1.0), sim)
    return {"label": label, "conf": round(sum(sims) / len(sims), 3), "stimmen": cnt, "k": len(top),
            "scores": {l: round(v, 3) for l, v in scores.items()}, "dimension": int(len(vec))}


@app.post("/api/teach/sample")
async def teach_sample(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    if _embed_net is None:
        return JSONResponse({"fehler": "Embedding-Modell fehlt"}, status_code=503)
    d = await req.json()
    label = (d.get("label") or "").strip()[:40]
    if not label or not d.get("bild"):
        return JSONResponse({"fehler": "label/bild fehlt"}, status_code=400)
    if len(d["bild"]) > MAX_FRAME_BYTES or not _ist_jpeg_dataurl(d["bild"]):
        return JSONResponse({"fehler": "nur JPEG bis 2 MB"}, status_code=413)
    counts = await asyncio.to_thread(_teach_sample, d["bild"], label, _zustand(req)["teach"])
    return JSONResponse({"counts": counts or {}})


@app.post("/api/teach/classify")
async def teach_classify(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    if _embed_net is None:
        return JSONResponse({"fehler": "Embedding-Modell fehlt"}, status_code=503)
    d = await req.json()
    if not d.get("bild"):
        return JSONResponse({"fehler": "bild fehlt"}, status_code=400)
    if len(d["bild"]) > MAX_FRAME_BYTES or not _ist_jpeg_dataurl(d["bild"]):
        return JSONResponse({"fehler": "nur JPEG bis 2 MB"}, status_code=413)
    return JSONResponse(await asyncio.to_thread(_teach_classify, d["bild"], _zustand(req)["teach"]))


@app.post("/api/teach/reset")
async def teach_reset(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    with _teach_lock:
        _zustand(req)["teach"].clear()
    return JSONResponse({"ok": True})


# ---------- RAG: Fragen an eigene Dokumente (nomic-embed + llama3.2, alles lokal) ----------
# RAG-Abschnitte liegen je Besucher in _zustand(request)["rag"] als Liste (text, vektor)
_rag_lock = threading.Lock()
RAG_MAX_TEXT = 300_000
RAG_MAX_CHUNKS = 300
EMBED_MODELL = "nomic-embed-text"


def _chunk(text, groesse=800):
    stuecke, puffer = [], ""
    for absatz in re.split(r"\n\s*\n", text.strip()):
        absatz = absatz.strip()
        if not absatz:
            continue
        if len(puffer) + len(absatz) < groesse:
            puffer = (puffer + "\n" + absatz) if puffer else absatz
        else:
            if puffer:
                stuecke.append(puffer)
            while len(absatz) > groesse:
                stuecke.append(absatz[:groesse])
                absatz = absatz[groesse:]
            puffer = absatz
    if puffer:
        stuecke.append(puffer)
    return stuecke


async def _embed_async(client, text):
    # num_gpu 0: Auf dem Jetson liefert nomic-embed-text (F16) auf der GPU fuer manche Saetze nur Nullvektoren,
    # dann findet die Suche stillschweigend nichts. Auf der CPU sind die Vektoren zuverlaessig.
    r = await client.post(f"{OLLAMA}/api/embeddings",
                          json={"model": EMBED_MODELL, "prompt": text, "options": {"num_gpu": 0}})
    if r.status_code != 200:
        raise RuntimeError(_ollama_fehler(r.text))
    v = np.array(r.json().get("embedding", []), dtype=np.float32)
    n = np.linalg.norm(v)
    if n == 0:
        raise RuntimeError("Das Embedding-Modell hat für diesen Text keinen Vektor geliefert. Versuch einen anderen Satz.")
    return v / n


@app.post("/api/rag/upload")
async def rag_upload(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    if _zu_viele(req, "rag-upload", 10):
        return JSONResponse(ZU_VIELE, status_code=429)
    d = await req.json()
    text = d.get("text") or ""
    if not text.strip():
        return JSONResponse({"fehler": "kein Text"}, status_code=400)
    if len(text) > RAG_MAX_TEXT:
        return JSONResponse({"fehler": "Text zu gross"}, status_code=413)
    stuecke = _chunk(text)[:RAG_MAX_CHUNKS]
    await _speicher_bereit()
    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=10.0)) as c:
            neu = [(s, await _embed_async(c, s)) for s in stuecke]
    except RuntimeError as e:
        return JSONResponse({"fehler": str(e)}, status_code=503)
    rag = _zustand(req)["rag"]
    with _rag_lock:
        frei = max(0, RAG_MAX_CHUNKS - len(rag))
        rag.extend(neu[:frei])
        gesamt = len(rag)
    return JSONResponse({"chunks": min(len(neu), frei), "gesamt": gesamt,
                         "dimension": int(len(neu[0][1])) if neu else 0,
                         "vorschau": [t[:110] for t, _ in neu[:12]]})


async def _rag_suche(c, frage, rag, k=4):
    t0 = time.time()
    qv = await _embed_async(c, frage)
    embed_ms = round((time.time() - t0) * 1000)
    with _rag_lock:
        treffer = sorted(((float(np.dot(qv, v)), t) for t, v in rag), reverse=True)[:k]
        gesamt = len(rag)
    return qv, treffer, embed_ms, gesamt


@app.post("/api/rag/search")
async def rag_search(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    if _llm.voll():
        return _belegt_antwort()
    d = await req.json()
    frage = (d.get("frage") or "").strip()[:1000]
    if not frage:
        return JSONResponse({"fehler": "keine Frage"}, status_code=400)
    rag = _zustand(req)["rag"]
    with _rag_lock:
        leer = not rag
    if leer:
        return JSONResponse({"fehler": "noch keine Dokumente eingelesen"}, status_code=400)
    await _speicher_bereit()
    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=10.0)) as c:
            qv, treffer, embed_ms, gesamt = await _rag_suche(c, frage, rag)
    except RuntimeError as e:
        return JSONResponse({"fehler": str(e)}, status_code=503)
    return JSONResponse({"dimension": int(len(qv)), "embed_ms": embed_ms, "abschnitte": gesamt,
                         "treffer": [{"rang": i + 1, "score": round(sc, 3), "text": t}
                                     for i, (sc, t) in enumerate(treffer)]})


@app.post("/api/rag/ask")
async def rag_ask(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    if _zu_viele(req, "rag-ask", 15):
        return JSONResponse(ZU_VIELE, status_code=429)
    if _llm.voll():
        return _belegt_antwort()
    d = await req.json()
    frage = (d.get("frage") or "").strip()[:1000]
    if not frage:
        return JSONResponse({"fehler": "keine Frage"}, status_code=400)
    rag = _zustand(req)["rag"]
    with _rag_lock:
        leer = not rag
    if leer:
        return JSONResponse({"fehler": "noch keine Dokumente eingelesen"}, status_code=400)

    async def strom():
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0)) as c:
            await _speicher_bereit()
            try:
                qv = await _embed_async(c, frage)
            except RuntimeError as e:
                yield "[" + str(e) + "]"
                return
            with _rag_lock:
                treffer = sorted(((float(np.dot(qv, v)), t) for t, v in rag), reverse=True)[:4]
            kontext = "\n\n".join("[%d] %s" % (i + 1, t) for i, (_, t) in enumerate(treffer))
            system = ("Beantworte die Frage ausschliesslich mit dem gegebenen Kontext und zitiere "
                      "Belege als [Nummer]. Reicht der Kontext nicht, sage das ehrlich. Antworte auf Deutsch.")
            payload = {"model": CHAT_MODELL, "stream": True, "options": {"num_gpu": speicher.gpu_schichten(), "num_batch": speicher.LLM_BATCH}, "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": "Kontext:\n%s\n\nFrage: %s" % (kontext, frage)}]}
            try:
                async with c.stream("POST", f"{OLLAMA}/api/chat", json=payload) as r:
                    async for zeile in r.aiter_lines():
                        if not zeile.strip():
                            continue
                        o = json.loads(zeile)
                        if o.get("error"):
                            yield "\n[" + _ollama_fehler(o["error"]) + "]"
                            return
                        st = o.get("message", {}).get("content", "")
                        if st:
                            yield st
                quellen = " · ".join("[%d] %s…" % (i + 1, t[:60].strip()) for i, (_, t) in enumerate(treffer))
                yield "\n\n---\nQuellen: " + quellen
            except Exception as e:
                yield "\n[Fehler: %s]" % e

    return StreamingResponse(_mit_platz(req, strom()), media_type="text/plain; charset=utf-8")


@app.post("/api/rag/reset")
async def rag_reset(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    with _rag_lock:
        _zustand(req)["rag"].clear()
    return JSONResponse({"ok": True})


# ---------- Agent mit Werkzeugen (ReAct-Schleife ueber Ollama-Tool-Calling) ----------
_AGENT_TOOLS = [
    {"type": "function", "function": {"name": "rechne", "description": "Berechnet einen arithmetischen Ausdruck, z. B. 23*19+5.",
     "parameters": {"type": "object", "properties": {"ausdruck": {"type": "string"}}, "required": ["ausdruck"]}}},
    {"type": "function", "function": {"name": "uhrzeit", "description": "Gibt aktuelles Datum und Uhrzeit zurueck.",
     "parameters": {"type": "object", "properties": {}}}},
    {"type": "function", "function": {"name": "dokumentsuche", "description": "Durchsucht die im RAG eingelesenen Dokumente nach einem Begriff.",
     "parameters": {"type": "object", "properties": {"begriff": {"type": "string"}}, "required": ["begriff"]}}},
]
_OPS = {ast.Add: operator.add, ast.Sub: operator.sub, ast.Mult: operator.mul,
        ast.Div: operator.truediv, ast.Pow: operator.pow, ast.USub: operator.neg, ast.Mod: operator.mod}


def _safe_calc(expr):
    if len(expr) > 100:
        raise ValueError("Ausdruck zu lang")

    def ev(n):
        if isinstance(n, ast.Constant):
            if isinstance(n.value, bool) or not isinstance(n.value, (int, float)):
                raise ValueError("nur Zahlen erlaubt")
            return n.value
        if isinstance(n, ast.BinOp):
            l, r = ev(n.left), ev(n.right)
            if isinstance(n.op, ast.Pow) and (abs(r) > 100 or abs(l) > 1e6):
                raise ValueError("Exponent/Basis zu gross")
            res = _OPS[type(n.op)](l, r)
            if isinstance(res, (int, float)) and abs(res) > 1e100:
                raise ValueError("Ergebnis zu gross")
            return res
        if isinstance(n, ast.UnaryOp):
            return _OPS[type(n.op)](ev(n.operand))
        raise ValueError("nicht erlaubt")
    return ev(ast.parse(expr, mode="eval").body)


def _tool_ausfuehren(name, args, rag, szenario=None):
    if name == "rechne":
        try:
            return str(_safe_calc(str(args.get("ausdruck", ""))))
        except Exception as e:
            return "Fehler: %s" % e
    if name == "uhrzeit":
        import datetime as _dt
        tage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"]
        jetzt = _dt.datetime.now()
        return "%s, %s" % (tage[jetzt.weekday()], jetzt.strftime("%d.%m.%Y %H:%M"))
    if name == "dokumentsuche":
        begriff = str(args.get("begriff", "")).lower()
        with _rag_lock:
            treffer = [t for t, _ in rag if begriff in t.lower()][:2]
        return "\n".join(treffer) if treffer else "nichts gefunden (keine Dokumente eingelesen?)"
    zusatz = agent_werkzeuge.ausfuehren(szenario, name, args)
    if zusatz is not None:
        return zusatz
    return "unbekanntes Werkzeug"


@app.post("/api/agent/ask")
async def agent_ask(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    if _zu_viele(req, "agent", 15):
        return JSONResponse(ZU_VIELE, status_code=429)
    if _llm.voll():
        return _belegt_antwort()
    d = await req.json()
    frage = (d.get("frage") or "").strip()[:1000]
    if not frage:
        return JSONResponse({"fehler": "keine Frage"}, status_code=400)

    rag = _zustand(req)["rag"]
    # Szenarien bringen eigene Werkzeuge und einen eigenen Systemtext mit (Beispiel-Katalog), nur aus der Allowlist
    szenario = d.get("szenario") if d.get("szenario") in agent_werkzeuge.SZENARIEN else None
    # Szenario: NUR dessen Werkzeuge (ein 3B-Modell verheddert sich bei sieben Werkzeugen), sonst die Standardwerkzeuge
    werkzeuge = agent_werkzeuge.definitionen(szenario) if szenario else _AGENT_TOOLS

    async def strom():
        messages = [
            {"role": "system", "content": agent_werkzeuge.system(szenario) or
             "Du bist ein Agent mit Werkzeugen (rechne, uhrzeit, dokumentsuche). "
             "Nutze Werkzeuge, wenn sie helfen, und antworte am Ende knapp auf Deutsch."},
            {"role": "user", "content": frage}]
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0)) as c:
            await _speicher_bereit()
            for _ in range(5):
                r = await c.post(f"{OLLAMA}/api/chat",
                                 json={"model": CHAT_MODELL, "messages": messages, "tools": werkzeuge, "stream": False,
                                       "options": {"temperature": 0, "num_gpu": speicher.gpu_schichten(), "num_batch": speicher.LLM_BATCH}})      # Werkzeugwahl soll reproduzierbar sein
                if r.status_code != 200:
                    try:
                        fehler = r.json().get("error", "")
                    except Exception:                                        # noqa: BLE001
                        fehler = ""
                    yield "\n[Fehler] " + _ollama_fehler(fehler)
                    return
                m = r.json().get("message", {})
                tcs = m.get("tool_calls") or []
                if tcs:
                    messages.append(m)
                    for tc in tcs:
                        fn = tc["function"]["name"]
                        args = tc["function"].get("arguments", {}) or {}
                        yield "[Werkzeug] %s(%s)" % (fn, json.dumps(args, ensure_ascii=False))
                        erg = _tool_ausfuehren(fn, args, rag, szenario)
                        yield "  ->  %s\n" % erg.replace("\n", " ")[:160]
                        messages.append({"role": "tool", "content": erg})
                    continue
                yield "\n[Antwort] " + (m.get("content") or "")
                return
            yield "\n[Abbruch nach 5 Schritten]"

    return StreamingResponse(_mit_platz(req, strom()), media_type="text/plain; charset=utf-8")


# ============================================================ Whisper (Sprache zu Text)
# Modell: faster-whisper (CTranslate2) auf der CPU mit int8. CTranslate2 aus pip hat auf dem Jetson keine
# CUDA-Unterstuetzung (get_cuda_device_count() == 0), deshalb CPU. "base" rechnet auf dem Orin Nano deutlich
# schneller als Echtzeit; per Umgebungsvariable WHISPER_MODELL=small laesst sich ein genaueres Modell waehlen.
WHISPER_MODELL = os.environ.get("WHISPER_MODELL", "base")
WHISPER_MAX_BYTES = 2_000_000        # ~2 MB: eine Minute Opus/AAC liegt weit darunter
WHISPER_MAX_SEKUNDEN = 60.0
WHISPER_MIN_FREI_MB = 700            # darunter wird das Modell nicht geladen (Chat-Modell belegt den Speicher)
WHISPER_TYPEN = {"audio/webm", "audio/ogg", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/wav", "audio/x-wav", "audio/mpeg"}
_whisper_modell = None
_whisper_lade_s = None
_whisper_sperre = asyncio.Lock()     # nur eine Transkription zur selben Zeit (Speicher, 6 Kerne)


def _mem_frei_mb() -> int:
    try:
        for zeile in open("/proc/meminfo"):
            if zeile.startswith("MemAvailable:"):
                return int(zeile.split()[1]) // 1024
    except Exception:
        pass
    return 10_000


def _whisper_laden():
    global _whisper_modell, _whisper_lade_s
    if _whisper_modell is None:
        if _mem_frei_mb() < WHISPER_MIN_FREI_MB:
            raise MemoryError("zu wenig freier Speicher")
        from faster_whisper import WhisperModel
        t0 = time.time()
        _whisper_modell = WhisperModel(WHISPER_MODELL, device="cpu", compute_type="int8", cpu_threads=4)
        _whisper_lade_s = round(time.time() - t0, 2)
        return _whisper_lade_s
    return None


def _whisper_rechnen(daten: bytes, sprache):
    """Laeuft im Arbeitsthread. Gibt (ergebnis, fehlertext) zurueck. Audio bleibt im Arbeitsspeicher."""
    import io
    t0 = time.time()
    try:
        lade_s = _whisper_laden()
    except MemoryError:
        return None, ("Zu wenig freier Speicher für das Sprachmodell. Beende zuerst ein anderes Labor "
                      "(zum Beispiel den Chat) und versuch es erneut.", 503)
    except Exception:
        return None, ("Das Sprachmodell konnte nicht geladen werden. Beim ersten Start braucht der Jetson "
                      "eine Internetverbindung, um es herunterzuladen.", 503)
    try:
        from faster_whisper.audio import decode_audio
        audio = decode_audio(io.BytesIO(daten), sampling_rate=16000)
    except Exception:
        return None, ("Die Aufnahme konnte nicht gelesen werden. Versuch es noch einmal.", 415)
    audio_s = len(audio) / 16000.0
    if audio_s > WHISPER_MAX_SEKUNDEN + 0.5:
        return None, ("Die Aufnahme ist zu lang. Erlaubt sind %d Sekunden." % WHISPER_MAX_SEKUNDEN, 413)
    if audio_s < 0.3:
        return None, ("Die Aufnahme ist zu kurz.", 400)
    try:
        t1 = time.time()
        segs, info = _whisper_modell.transcribe(audio, language=sprache, beam_size=1, vad_filter=True,
                                                condition_on_previous_text=False)
        segmente = [{"start": round(s.start, 2), "ende": round(s.end, 2), "text": s.text.strip()} for s in segs]
        rechen_s = time.time() - t1
    except Exception:
        return None, ("Die Erkennung ist fehlgeschlagen. Versuch es noch einmal.", 500)
    return {
        "text": " ".join(s["text"] for s in segmente if s["text"]).strip(),
        "sprache": info.language,
        "sprache_wahrscheinlichkeit": round(float(info.language_probability), 3),
        "audio_s": round(audio_s, 2),
        "rechen_s": round(rechen_s, 2),
        "lade_s": lade_s,                 # nur gesetzt, wenn das Modell bei dieser Anfrage erst geladen wurde
        "modell": "whisper-" + WHISPER_MODELL + " (int8, CPU)",
        "segmente": segmente,
    }, None


@app.post("/api/whisper")
async def whisper_api(req: Request, sprache: str = "auto"):
    """Rohe Audio-Bytes im Body (Content-Type z. B. audio/webm oder audio/mp4), optional ?sprache=de|en|auto."""
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    typ = (req.headers.get("content-type") or "").split(";")[0].strip().lower()
    if typ not in WHISPER_TYPEN:
        return JSONResponse({"fehler": "Dieses Audioformat wird nicht unterstützt."}, status_code=415)
    if sprache not in ("auto", "de", "en"):
        return JSONResponse({"fehler": "Unbekannte Sprache."}, status_code=400)
    try:
        if int(req.headers.get("content-length") or 0) > WHISPER_MAX_BYTES:
            raise ValueError
        teile, gesamt = [], 0
        async for stueck in req.stream():
            gesamt += len(stueck)
            if gesamt > WHISPER_MAX_BYTES:
                raise ValueError
            teile.append(stueck)
    except ValueError:
        return JSONResponse({"fehler": "Die Aufnahme ist zu groß (höchstens 2 MB)."}, status_code=413)
    daten = b"".join(teile)
    if not daten:
        return JSONResponse({"fehler": "Keine Audiodaten empfangen."}, status_code=400)
    async with _whisper_sperre:
        ergebnis, fehler = await asyncio.to_thread(_whisper_rechnen, daten, None if sprache == "auto" else sprache)
    if fehler:
        return JSONResponse({"fehler": fehler[0]}, status_code=fehler[1])
    ergebnis["bytes"] = len(daten)
    return JSONResponse(ergebnis)


@app.get("/api/videos")
def api_videos():
    """Manifest der Erklaervideos; ohne gebaute Videos eine leere Liste (statt 404)."""
    ordner = _STATIC_DIR / "videos"
    try:
        manifest = json.loads((ordner / "manifest.json").read_text(encoding="utf-8"))
    except Exception:
        return JSONResponse({"videos": []})
    # nur Videos anbieten, deren Datei wirklich da ist (das Manifest kann dem Rendern vorauslaufen)
    fertig = [v for v in manifest.get("videos", []) if (ordner / f"{v.get('id', '')}.mp4").is_file()]
    return JSONResponse({"videos": fertig})


# ---------------------------------------------------------------------------------------------------------
# Seiten unter echten Adressen (/<id>), Fragmente fuer Suchmaschinen, robots.txt, sitemap.xml.
# Die Fragmente erzeugt scripts/seo_bauen.mjs nach app/static/seo/. Der Server setzt sie in die Oberflaeche ein;
# die JavaScript-Oberflaeche ersetzt sie beim Start. Intern (ohne OEFFENTLICH=1) steht ueberall "nicht indexieren".
# ---------------------------------------------------------------------------------------------------------
_SEO_DIR = _STATIC_DIR / "seo"
_seo_stand = {"stamp": None, "daten": None}
_FREIE_ADRESSEN = ("http://", "https://")


class _RobotsKopf:
    """Reiner ASGI-Wrapper: setzt X-Robots-Tag, wo die Antwort keinen eigenen hat (intern ueberall, sonst nur /api/)."""

    def __init__(self, anwendung):
        self.anwendung = anwendung

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.anwendung(scope, receive, send)
        pfad = scope.get("path", "")

        async def senden(nachricht):
            if nachricht["type"] == "http.response.start":
                kopf = MutableHeaders(scope=nachricht)
                if "x-robots-tag" not in kopf and (not _OEFFENTLICH or pfad.startswith(("/api/", "/ws/"))):
                    kopf["X-Robots-Tag"] = "noindex, nofollow"
                if pfad.startswith("/static/") and nachricht.get("status") in (200, 206, 304) and "cache-control" not in kopf:
                    if b"v=" in scope.get("query_string", b""):      # Versionsparameter (?v=<Stand>): aendert sich mit jedem Stand
                        kopf["Cache-Control"] = "public, max-age=31536000, immutable"
                    elif pfad.endswith(_MEDIEN):
                        kopf["Cache-Control"] = "public, max-age=86400"
                    else:
                        kopf["Cache-Control"] = "no-cache"           # immer mit ETag nachfragen
            await send(nachricht)

        await self.anwendung(scope, receive, senden)


app.add_middleware(_RobotsKopf)


class _NurUeberProxy:
    """Die Transportadresse (Cloudflare-Tunnel) soll nur ueber den eigenen Proxy erreichbar sein, nicht direkt:
    sonst waere dieselbe Seite unter zwei Adressen im Netz (doppelter Inhalt, Umgehung der Bot-Regeln).
    Aktiv nur mit KL_TRANSPORT_HOST und KL_PROXY_KEY; der Proxy sendet den Schluessel im Header X-KL-Proxy."""

    def __init__(self, anwendung):
        self.anwendung = anwendung
        self.host = os.environ.get("KL_TRANSPORT_HOST", "").strip().lower()
        self.schluessel = os.environ.get("KL_PROXY_KEY", "").strip()

    async def __call__(self, scope, receive, send):
        if self.host and self.schluessel and scope["type"] in ("http", "websocket"):
            kopf = {k.decode("latin-1").lower(): v.decode("latin-1") for k, v in scope.get("headers", [])}
            if kopf.get("host", "").split(":")[0].lower() == self.host and not secrets.compare_digest(
                    kopf.get("x-kl-proxy", ""), self.schluessel):
                if scope["type"] == "websocket":
                    await send({"type": "websocket.close", "code": 1008})
                    return
                await send({"type": "http.response.start", "status": 403,
                            "headers": [(b"content-type", b"text/plain; charset=utf-8"), (b"x-robots-tag", b"noindex, nofollow")]})
                await send({"type": "http.response.body", "body": "Diese Adresse ist nur ueber ki-labor.daniel-alisch.site erreichbar.".encode()})
                return
        await self.anwendung(scope, receive, send)


app.add_middleware(_NurUeberProxy)

_MEDIEN = (".mp4", ".jpg", ".jpeg", ".png", ".webp", ".mp3", ".wav", ".vtt", ".ico")


class _Kompression:
    """gzip fuer Text (Seiten, JS, CSS, JSON, XML); nicht fuer Medien (schon komprimiert), /api/ (Streams) und Bereichsanfragen."""

    def __init__(self, anwendung):
        self.anwendung = anwendung
        self.gzip = GZipMiddleware(anwendung, minimum_size=1024)

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            pfad = scope.get("path", "")
            bereich = any(k == b"range" for k, _ in scope.get("headers", []))
            if not bereich and not pfad.startswith(("/api/", "/ws/")) and not pfad.endswith(_MEDIEN):
                return await self.gzip(scope, receive, send)
        return await self.anwendung(scope, receive, send)


app.add_middleware(_Kompression)


class _Sicherheitskoepfe:
    """Aeusserste Schicht: setzt die Sicherheitskoepfe auf jede Antwort (Seiten, API, Statisches, Fehlerseiten).
    Regeln und Richtlinie: app/sicherheit.py, Erklaerung: docs/betrieb-sicherheit.md."""

    def __init__(self, anwendung):
        self.anwendung = anwendung

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.anwendung(scope, receive, send)
        kopf_in = {k.decode("latin-1").lower(): v.decode("latin-1") for k, v in scope.get("headers", [])}
        https = scope.get("scheme") == "https" or kopf_in.get("x-forwarded-proto", "").split(",")[0].strip().lower() == "https"
        koepfe = sicherheitskoepfe(_OEFFENTLICH, https)

        async def senden(nachricht):
            if nachricht["type"] == "http.response.start":
                kopf = MutableHeaders(scope=nachricht)
                for name, wert in koepfe:
                    kopf[name] = wert
                if kopf.get("content-type", "").startswith("text/html") and "cache-control" not in kopf:
                    kopf["Cache-Control"] = "no-cache"
            await send(nachricht)

        await self.anwendung(scope, receive, senden)


app.add_middleware(_Sicherheitskoepfe)


def _seo_daten():
    """Index, Navigation, Fragmente und Autorenangaben; neu gelesen, wenn sich eine Datei geaendert hat."""
    dateien = list(_SEO_DIR.glob("*")) + [_STATIC_DIR / "module.json"]
    stamp = max((int(f.stat().st_mtime_ns) for f in dateien if f.is_file()), default=0)
    if _seo_stand["stamp"] == stamp and _seo_stand["daten"] is not None:
        return _seo_stand["daten"]
    def lesen(name, standard):
        try:
            return json.loads((_SEO_DIR / name).read_text(encoding="utf-8"))
        except Exception:
            return standard
    index = lesen("index.json", {"seiten": {}, "reihenfolge": []})
    try:
        module = json.loads((_STATIC_DIR / "module.json").read_text(encoding="utf-8"))
    except Exception:
        module = {}
    seite = module.get("seite", {})
    # Dateien, die die Oberflaeche beim Start nacheinander nachlaedt: der Browser holt sie vorab parallel (preload)
    vorab = [("style", f) for f in module.get("css", [])] + [("script", f) for f in module.get("content", []) + module.get("module", [])]
    vorab = [(art, f) for art, f in vorab if isinstance(f, str) and re.fullmatch(r"[A-Za-z0-9_.-]+", f) and (_STATIC_DIR / f).is_file()]
    def text(name):
        try:
            return (_SEO_DIR / name).read_text(encoding="utf-8")
        except Exception:
            return ""
    fragmente = {i: text(i + ".html") for i in index.get("seiten", {}) if re.fullmatch(r"[a-z0-9-]+", i)}
    daten = {"index": index, "nav": text("nav.html"), "fragmente": fragmente, "seite": seite if isinstance(seite, dict) else {}, "vorab": vorab}
    _seo_stand.update(stamp=stamp, daten=daten)
    return daten


def _basis_url(request):
    """Basis fuer canonical und Sitemap: OEFFENTLICHE_URL, sonst die (per Host-Allowlist geprueft) aufgerufene Adresse."""
    return _OEFFENTLICHE_URL or str(request.base_url).rstrip("/")


def _frei(url):
    return url if isinstance(url, str) and url.startswith(_FREIE_ADRESSEN) else ""


def _fuss_html(seite):
    from html import escape
    autor = escape(str(seite.get("autor") or "").strip())
    url = _frei(seite.get("autor_url"))
    teile = []
    if autor:
        name = f'<a href="{escape(url)}" rel="author">{autor}</a>' if url else autor
        links = []
        for schluessel, beschriftung in (("impressum_url", "Impressum"), ("datenschutz_url", "Datenschutz")):
            ziel = _frei(seite.get(schluessel))
            if ziel:
                links.append(f'<a href="{escape(ziel)}">{beschriftung}</a>')
        teile.append("<p>Ein Projekt von " + name + ("".join(" <span aria-hidden=\"true\">·</span> " + l for l in links)) + "</p>")
    teile.append(
        '<p class="fuss-klein">Dies ist ein Lernprojekt. Kamerabilder, Mikrofonaufnahmen und eingegebene Texte werden nur im '
        "Arbeitsspeicher verarbeitet und nicht dauerhaft gespeichert. Technisch notwendig sind das Sitzungs-Cookie "
        "<code>kl_s</code> (ordnet Beispiele und Texte deiner Sitzung zu, die Daten verfallen nach 30 Minuten) und der im Browser gemerkte Lernfortschritt. "
        '<a href="/sicherheit-einfach">Ist das sicher? Was wird gespeichert?</a></p>'
    )
    # Pflichtangabe der Llama 3.2 Community License (1.b.i) schon im Server-HTML, nicht erst per JavaScript
    teile.append('<p class="fuss-lizenz"><a href="/lizenzen">Lizenzen und Quellen</a> <span aria-hidden="true">·</span> '
                 '<span class="fuss-llama">Built with Llama</span></p>')
    return "".join(teile)


def _json_ld_text(text):
    """JSON-Text fuer ein script-Element: <, > und & maskieren, damit nichts das Element verlassen kann."""
    return text.replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")


def _oberflaeche(request, seiten_id, status=200):
    """Die Oberflaeche fuer eine Seite: Titel, Meta-Angaben, JSON-LD, Navigation und Inhalt als Rohtext eingesetzt."""
    from html import escape
    daten = _seo_daten()
    info = daten["index"].get("seiten", {}).get(seiten_id)
    seite = daten["seite"]
    gefunden = info is not None
    if gefunden:
        titel, beschr, ueberschrift = info["titel"], info["beschreibung"], info["ueberschrift"]
        inhalt = daten["fragmente"].get(seiten_id, "")
    else:
        titel, beschr, ueberschrift = "Seite nicht gefunden · KI-Labor", "Diese Seite gibt es im KI-Labor nicht.", "Seite nicht gefunden"
        inhalt = ('<div class="seitenbreite"><h1>Seite nicht gefunden</h1><p class="lead">Diese Adresse gibt es im KI-Labor nicht.</p>'
                  '<p><a href="/">Zur Startseite</a></p></div>')
    basis = _basis_url(request)
    adresse = basis + ("/" if seiten_id == "start" or not gefunden else "/" + seiten_id)
    indexieren = _OEFFENTLICH and gefunden
    robots = "index, follow" if indexieren else "noindex, nofollow"
    autor = str(seite.get("autor") or "").strip()
    kopf = [f'<meta name="description" content="{escape(beschr)}">', f'<meta name="robots" content="{robots.replace(", ", ",")}">']
    if autor:
        kopf.append(f'<meta name="author" content="{escape(autor)}">')
    if gefunden:
        kopf.append(f'<link rel="canonical" href="{escape(adresse)}">')
        og = [("og:title", titel), ("og:description", beschr), ("og:type", "website" if seiten_id == "start" else "article"),
              ("og:url", adresse), ("og:locale", "de_DE"), ("og:site_name", "KI-Labor")]
        kopf += [f'<meta property="{k}" content="{escape(v)}">' for k, v in og]
        bild = basis + info["bild"] if info.get("bild") else ""
        if bild:
            kopf += [f'<meta property="og:image" content="{escape(bild)}">', '<meta property="og:image:type" content="image/png">',
                     '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">',
                     f'<meta property="og:image:alt" content="{escape(info.get("bild_alt", ""))}">']
        kopf.append('<meta name="twitter:card" content="summary_large_image">')
        if bild:
            kopf += [f'<meta name="twitter:image" content="{escape(bild)}">', f'<meta name="twitter:image:alt" content="{escape(info.get("bild_alt", ""))}">']
        kopf += [f'<link rel="alternate" hreflang="de" href="{escape(adresse)}">', f'<link rel="alternate" hreflang="x-default" href="{escape(adresse)}">']
        if _OEFFENTLICH:
            kopf.append(f'<link rel="alternate" type="text/plain" href="{escape(basis)}/llms.txt" title="llms.txt">')
        if info.get("ld"):
            ld_text = json.dumps(info["ld"], ensure_ascii=False).replace("__BASIS__", json.dumps(basis)[1:-1])
            kopf.append('<script type="application/ld+json">' + _json_ld_text(ld_text) + "</script>")
    stamp = max((int(f.stat().st_mtime) for f in _STATIC_DIR.glob("*") if f.is_file()), default=0)
    kopf += [f'<link rel="preload" as="{art}" href="/static/{f}?v={stamp}">' for art, f in daten.get("vorab", [])]
    werte = {
        "V": str(stamp), "TITEL": escape(titel), "KOPF": "\n".join(kopf),
        "SEITE": '<div class="marke"><div class="logo"></div><div><b>KI-Labor</b><span>kostenlos, live ausprobieren</span></div></div>' + daten["nav"],
        "INHALT": inhalt + '\n<noscript><p class="noscript-hinweis">Die interaktiven Teile des KI-Labors brauchen JavaScript.</p></noscript>',
        "FUSS": _fuss_html(seite),
    }
    html = re.sub(r"__(V|TITEL|KOPF|SEITE|INHALT|FUSS)__", lambda m: werte[m.group(1)],
                  (HIER / "index.html").read_text(encoding="utf-8"))
    antwort = HTMLResponse(html, status_code=status, headers={"Cache-Control": "no-cache", "X-Robots-Tag": robots})
    if not request.cookies.get("kl_s"):
        antwort.set_cookie("kl_s", secrets.token_hex(16), httponly=True, samesite="lax", secure=True, max_age=86400)
    return antwort


@app.get("/googlee103461f6717de5d.html")
def google_bestaetigung():
    """Inhaberbestaetigung der Search Console (Datei muss dauerhaft erreichbar bleiben)."""
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse("google-site-verification: googlee103461f6717de5d.html",
                             headers={"Cache-Control": "no-cache"}, media_type="text/html")


# KI-Crawler und Suchmaschinen, die ausdruecklich willkommen sind (eigene Gruppe, weil sie die allgemeine ersetzt)
_KI_CRAWLER = ("GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "CCBot", "Applebot-Extended")


@app.api_route("/robots.txt", methods=["GET", "HEAD"])
def robots_txt(request: Request):
    from fastapi.responses import PlainTextResponse
    if _OEFFENTLICH:
        regeln = "Allow: /\nDisallow: /api/\nDisallow: /ws/\n"
        gruppen = ["User-agent: *\n" + regeln] + [f"User-agent: {name}\n{regeln}" for name in _KI_CRAWLER]
        text = "\n".join(gruppen) + f"\nSitemap: {_basis_url(request)}/sitemap.xml\n"
    else:
        text = "User-agent: *\nDisallow: /\n"
    return PlainTextResponse(text, headers={"Cache-Control": "no-cache"})


def _seo_datei(request, name, medientyp):
    """Eine von scripts/seo_bauen.mjs erzeugte Vorlage (sitemap.xml, llms.txt, llms-full.txt) mit der Basisadresse; intern 404."""
    from fastapi.responses import Response
    if not _OEFFENTLICH:
        return JSONResponse({"fehler": "Nicht gefunden"}, status_code=404)
    try:
        text = (_SEO_DIR / name).read_text(encoding="utf-8")
    except Exception:
        return JSONResponse({"fehler": "Nicht gefunden"}, status_code=404)
    from html import escape
    basis = _basis_url(request)
    text = text.replace("__BASIS__", escape(basis) if medientyp == "application/xml" else basis)
    return Response(text, media_type=medientyp, headers={"Cache-Control": "no-cache"})


@app.api_route("/sitemap.xml", methods=["GET", "HEAD"])
def sitemap_xml(request: Request):
    return _seo_datei(request, "sitemap.xml", "application/xml")


@app.api_route("/llms.txt", methods=["GET", "HEAD"])
def llms_txt(request: Request):
    return _seo_datei(request, "llms.txt", "text/plain; charset=utf-8")


@app.api_route("/llms-full.txt", methods=["GET", "HEAD"])
def llms_full_txt(request: Request):
    return _seo_datei(request, "llms-full.txt", "text/plain; charset=utf-8")


# IndexNow (Bing, Yandex, Seznam; ChatGPT Search nutzt den Bing-Index): die Schluesseldatei /<Schluessel>.txt belegt,
# dass Meldungen von scripts/indexnow.mjs vom Betreiber stammen. Schluessel nur aus der Umgebungsvariablen INDEXNOW_KEY
# (8 bis 128 Zeichen, Buchstaben, Ziffern, Bindestrich), nie im Repo. Nur oeffentlich; sonst gibt es die Route nicht (404).
_INDEXNOW_KEY = os.environ.get("INDEXNOW_KEY", "").strip()
if not re.fullmatch(r"[A-Za-z0-9-]{8,128}", _INDEXNOW_KEY):
    _INDEXNOW_KEY = ""

if _OEFFENTLICH and _INDEXNOW_KEY:
    @app.get(f"/{_INDEXNOW_KEY}.txt", include_in_schema=False)
    def indexnow_schluessel():
        from fastapi.responses import PlainTextResponse
        return PlainTextResponse(_INDEXNOW_KEY, headers={"Cache-Control": "no-cache", "X-Robots-Tag": "noindex"})


@app.api_route("/", methods=["GET", "HEAD"], response_class=HTMLResponse)
def index(request: Request):
    return _oberflaeche(request, "start")


@app.api_route("/{pfad:path}", methods=["GET", "HEAD"], include_in_schema=False)
def seitenadresse(pfad: str, request: Request):
    """Jede bekannte Seiten-ID unter /<id>; alles andere 404. /api/, /ws/ und /static/ bleiben unberuehrt (JSON-404)."""
    if pfad.startswith(("api/", "ws/", "static/")):
        return JSONResponse({"fehler": "Nicht gefunden"}, status_code=404)
    kennung = pfad[:-1] if pfad.endswith("/") else pfad
    if re.fullmatch(r"[a-z0-9-]+", kennung) and kennung in _seo_daten()["index"].get("seiten", {}):
        if kennung == "start" or kennung != pfad:      # /start und /id/ gehen auf die saubere Adresse
            ziel = "/" if kennung == "start" else "/" + kennung
            return RedirectResponse(ziel + (("?" + request.url.query) if request.url.query else ""), status_code=301)
        return _oberflaeche(request, kennung)
    return _oberflaeche(request, "", status=404)


@app.on_event("startup")
def _start():
    threading.Thread(target=_tegrastats_leser, daemon=True).start()
    threading.Thread(target=speicher.waechter, daemon=True).start()
