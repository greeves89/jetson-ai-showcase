"""Labor "Text zu Sprache": lokale Sprachausgabe mit Piper (ONNX, laeuft auf der CPU).

Endpunkte
  GET  /api/tts/stimmen   freigegebene, auf dem Geraet vorhandene Stimmen
  POST /api/tts           {text, stimme, tempo} -> WAV (base64) plus Lautschrift und Zeiten

Die Modelldateien liegen nicht im Repo, sondern in ~/.local/share/piper-voices (scripts/setup.sh laedt sie,
Quellen und Lizenzen stehen in docs/lizenzen.md). Es werden weder Texte noch Audiodaten gespeichert oder geloggt.
"""
import asyncio
import base64
import io
import os
import re
import time
import wave
from pathlib import Path

import numpy as np
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.sicherheit import begrenzt, origin_ok

router = APIRouter()

VOICE_DIR = Path(os.environ.get("PIPER_VOICE_DIR", str(Path.home() / ".local/share/piper-voices")))
MAX_ZEICHEN = 500
TEMPO_MIN, TEMPO_MAX = 0.7, 1.5
MAX_PHONEME_ZEICHEN = 600
MIN_FREI_MB = 400            # darunter wird keine Stimme geladen (Chat-Modell belegt den Speicher)
MAX_GELADEN = 2              # zwei Stimmen gleichzeitig im Speicher, die aelteste wird verdraengt
SATZPAUSE_S = 0.2            # Piper selbst setzt zwischen Saetzen keine Pause

# Feste Liste: nur diese IDs sind erlaubt, der Dateiname kommt nie aus der Anfrage.
# Nur Stimmen mit freier Lizenz (siehe docs/lizenzen.md).
STIMMEN = {
    "thorsten": {"datei": "de_DE-thorsten-medium", "name": "Thorsten",
                 "beschreibung": "Männliche Stimme, mittlere Qualität. Klingt klar und ruhig."},
    "kerstin": {"datei": "de_DE-kerstin-low", "name": "Kerstin",
                "beschreibung": "Weibliche Stimme, einfachere Qualität. Rechnet sehr schnell."},
    "thorsten-hoch": {"datei": "de_DE-thorsten-high", "name": "Thorsten (hohe Qualität)",
                      "beschreibung": "Dieselbe Sprecherstimme, größeres Modell. Klingt voller, rechnet länger."},
}

_sperre = asyncio.Lock()     # immer nur eine Synthese (Speicher, Rechenkerne)
_geladen = {}                # id -> PiperVoice, in Ladereihenfolge


def _vorhanden(sid: str) -> bool:
    d = STIMMEN[sid]["datei"]
    return (VOICE_DIR / (d + ".onnx")).is_file() and (VOICE_DIR / (d + ".onnx.json")).is_file()


def _frei_mb() -> int:
    try:
        for zeile in open("/proc/meminfo"):
            if zeile.startswith("MemAvailable:"):
                return int(zeile.split()[1]) // 1024
    except Exception:
        pass
    return 10_000


def _stimme_laden(sid: str):
    """Gibt (Stimme, lade_s) zurueck; lade_s ist None, wenn die Stimme schon im Speicher war."""
    if sid in _geladen:
        return _geladen[sid], None
    if not _vorhanden(sid):
        raise FileNotFoundError(sid)
    if _frei_mb() < MIN_FREI_MB:
        raise MemoryError(sid)
    from piper import PiperVoice
    t0 = time.time()
    while len(_geladen) >= MAX_GELADEN:
        _geladen.pop(next(iter(_geladen)))
    stimme = PiperVoice.load(str(VOICE_DIR / (STIMMEN[sid]["datei"] + ".onnx")))
    _geladen[sid] = stimme
    return stimme, round(time.time() - t0, 2)


def _saetze_zeichen(saetze) -> str:
    """Lautschrift je Satz, Saetze mit ' | ' getrennt, auf MAX_PHONEME_ZEICHEN gekuerzt."""
    s = " | ".join("".join(p) for p in saetze)
    return s if len(s) <= MAX_PHONEME_ZEICHEN else s[: MAX_PHONEME_ZEICHEN - 1].rstrip() + "…"


def _rechnen(sid: str, text: str, tempo: float):
    """Blockierend, laeuft in einem Thread. Gibt (Ergebnis, None) oder (None, (Meldung, Status)) zurueck."""
    try:
        stimme, lade_s = _stimme_laden(sid)
    except FileNotFoundError:
        return None, ("Diese Stimme ist auf dem Gerät nicht installiert.", 503)
    except MemoryError:
        return None, ("Gerade ist zu wenig Speicher frei, um die Stimme zu laden. Versuch es später noch einmal.", 503)
    except Exception:
        return None, ("Die Stimme konnte nicht geladen werden.", 500)
    try:
        from piper.voice import SynthesisConfig
        konfig = SynthesisConfig(length_scale=1.0 / tempo)
        # Piper erlaubt die beiden Phasen getrennt: phonemize (Text -> Lautschrift) und
        # phoneme_ids_to_audio (Lautschrift -> Klang). So lassen sich beide Zeiten einzeln messen.
        t0 = time.perf_counter()
        saetze = [s for s in stimme.phonemize(text) if s]
        phonemisierung_ms = (time.perf_counter() - t0) * 1000
        if not saetze:
            return None, ("Aus diesem Text ließ sich keine Sprache erzeugen. Schreib ein paar Wörter.", 400)
        t1 = time.perf_counter()
        teile = []
        rate = stimme.config.sample_rate
        pause = np.zeros(int(rate * SATZPAUSE_S / tempo), dtype=np.float32)
        for i, ph in enumerate(saetze):
            audio = stimme.phoneme_ids_to_audio(stimme.phonemes_to_ids(ph), konfig)
            teile.append(np.asarray(audio, dtype=np.float32).reshape(-1))
            if i < len(saetze) - 1:
                teile.append(pause)
        synthese_ms = (time.perf_counter() - t1) * 1000
        roh = np.concatenate(teile)
        spitze = float(np.max(np.abs(roh))) if roh.size else 0.0
        if spitze > 1e-8:
            roh = roh / spitze                      # wie Piper selbst (normalize_audio)
        pcm = (np.clip(roh, -1.0, 1.0) * 32767).astype(np.int16)
        puffer = io.BytesIO()
        with wave.open(puffer, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(rate)
            w.writeframes(pcm.tobytes())
    except Exception:
        return None, ("Die Sprachausgabe ist fehlgeschlagen. Versuch es noch einmal.", 500)
    audio_s = len(pcm) / rate
    normal = re.sub(r"\s+", " ", text).strip()
    return {
        "wav_b64": base64.b64encode(puffer.getvalue()).decode("ascii"),
        "abtastrate": rate,
        "audio_s": round(audio_s, 2),
        "rechen_s": round((phonemisierung_ms + synthese_ms) / 1000, 3),
        "zeichen": len(text),
        "stimme": sid,
        "phoneme": _saetze_zeichen(saetze),
        "saetze": len(saetze),
        # Piper bereitet den Text nicht selbst auf (Zahlen, Abkuerzungen liest espeak-ng); erkennbar ist nur
        # das Bereinigen von Leerraum. Gleicht der Text dem Original, bleibt das Feld leer.
        "normalisiert": normal if normal != text else None,
        "lade_s": lade_s,
        "zeiten": {"phonemisierung_ms": round(phonemisierung_ms, 1), "synthese_ms": round(synthese_ms, 1)},
    }, None


@router.get("/api/tts/stimmen")
def tts_stimmen():
    return JSONResponse({"stimmen": [
        {"id": sid, "name": v["name"], "beschreibung": v["beschreibung"]}
        for sid, v in STIMMEN.items() if _vorhanden(sid)
    ], "max_zeichen": MAX_ZEICHEN, "tempo_min": TEMPO_MIN, "tempo_max": TEMPO_MAX})


@router.post("/api/tts")
async def tts_api(request: Request):
    if not origin_ok(request.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    if begrenzt(request, "tts", 20, 60):
        return JSONResponse({"fehler": "Zu viele Anfragen. Warte eine Minute."}, status_code=429)
    try:
        if int(request.headers.get("content-length") or 0) > 8192:
            raise ValueError
        roh = await request.body()
        if len(roh) > 8192:
            raise ValueError
    except ValueError:
        return JSONResponse({"fehler": "Die Anfrage ist zu groß."}, status_code=413)
    try:
        import json
        daten = json.loads(roh.decode("utf-8"))
        if not isinstance(daten, dict):
            raise ValueError
    except Exception:
        return JSONResponse({"fehler": "Die Anfrage ist kein gültiges JSON."}, status_code=400)
    text = daten.get("text")
    if not isinstance(text, str) or not text.strip():
        return JSONResponse({"fehler": "Schreib zuerst einen Text."}, status_code=400)
    if len(text) > MAX_ZEICHEN:
        return JSONResponse({"fehler": "Der Text ist zu lang. Erlaubt sind höchstens %d Zeichen." % MAX_ZEICHEN},
                            status_code=413)
    sid = daten.get("stimme")
    if not isinstance(sid, str) or sid not in STIMMEN:
        return JSONResponse({"fehler": "Unbekannte Stimme."}, status_code=400)
    tempo = daten.get("tempo", 1.0)
    if isinstance(tempo, bool) or not isinstance(tempo, (int, float)) or not (TEMPO_MIN <= tempo <= TEMPO_MAX):
        return JSONResponse({"fehler": "Das Tempo muss zwischen 0,7 und 1,5 liegen."},
                            status_code=400)
    async with _sperre:
        ergebnis, fehler = await asyncio.to_thread(_rechnen, sid, text, float(tempo))
    if fehler:
        return JSONResponse({"fehler": fehler[0]}, status_code=fehler[1])
    return JSONResponse(ergebnis)
