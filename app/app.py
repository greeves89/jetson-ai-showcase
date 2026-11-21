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

import cv2
import numpy as np
import httpx
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse

HIER = Path(__file__).resolve().parent
OLLAMA = "http://127.0.0.1:11434"
CHAT_MODELL = "llama3.2:3b"
# Nur diese Modelle duerfen geladen/angesprochen werden (verhindert beliebige Ollama-Pulls / SSRF)
ERLAUBTE_MODELLE = {"llama3.2:3b", "qwen3:4b", "qwen3:8b", "qwen2.5:7b-instruct", "nomic-embed-text"}
MAX_NACHRICHT = 4000          # Zeichen pro Chat-Anfrage
MAX_FRAME_BYTES = 2_000_000   # ~2 MB pro Webcam-Frame (480x360 JPEG ist weit darunter)


def _origin_ok(headers) -> bool:
    """Einfacher Schutz gegen fremde Seiten: Origin muss zum eigenen Host passen (oder fehlen, z. B. curl)."""
    origin = headers.get("origin")
    if not origin:
        return True
    host = headers.get("host", "")
    try:
        from urllib.parse import urlparse
        return urlparse(origin).netloc == host
    except Exception:
        return False

app = FastAPI(title="Jetson Demo-Hub")

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


def _erkenne_objekte(img):
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
    for i in np.where(conf > 0.5)[0]:
        cx, cy = xy[i]
        bw, bh = wh[i]
        boxes.append([int((cx - bw / 2) / r), int((cy - bh / 2) / r), int(bw / r), int(bh / r)])
        confs.append(float(conf[i]))
        clss.append(int(cls[i]))
    idx = cv2.dnn.NMSBoxes(boxes, confs, 0.5, 0.45) if boxes else []
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


def _verarbeite_frame(roh, modus):
    """Dekodiert, begrenzt die Groesse, erkennt und kodiert zurueck. Laeuft im Threadpool."""
    t0 = time.time()
    arr = np.frombuffer(roh, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        return None
    h, w = img.shape[:2]
    if w > 1280 or h > 720:                         # Schutz gegen zu grosse Frames
        s = min(1280 / w, 720 / h)
        img = cv2.resize(img, (int(w * s), int(h * s)))
    with _inferenz_lock:
        anzahl = _erkenne_objekte(img) if modus == "objekt" else _erkenne_gesichter(img)
    ok, jpg = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 70])
    return json.dumps({
        "bild": "data:image/jpeg;base64," + base64.b64encode(jpg).decode(),
        "anzahl": int(anzahl),
        "ms": round((time.time() - t0) * 1000),
        "modus": modus,
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
@app.post("/api/chat")
async def chat(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "ungueltiger Origin"}, status_code=403)
    daten = await req.json()
    nachricht = (daten.get("nachricht") or "").strip()
    modell = daten.get("modell") or CHAT_MODELL
    if not nachricht:
        return JSONResponse({"fehler": "leere Nachricht"}, status_code=400)
    if len(nachricht) > MAX_NACHRICHT:
        return JSONResponse({"fehler": "Nachricht zu lang"}, status_code=400)
    if modell not in ERLAUBTE_MODELLE:
        return JSONResponse({"fehler": "Modell nicht erlaubt"}, status_code=400)

    async def strom():
        start = time.time()
        tokens = 0
        payload = {
            "model": modell,
            "messages": [{"role": "user", "content": nachricht}],
            "stream": True,
            "think": False,
        }
        puffer = ""          # fuer das Herausfiltern der <think>-Bloecke
        denk_fertig = False
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(300.0, connect=10.0)) as c:
                async with c.stream("POST", f"{OLLAMA}/api/chat", json=payload) as r:
                    async for zeile in r.aiter_lines():
                        if not zeile.strip():
                            continue
                        obj = json.loads(zeile)
                        stueck = obj.get("message", {}).get("content", "")
                        if stueck:
                            tokens += 1
                            if denk_fertig:
                                yield stueck
                            else:
                                puffer += stueck
                                if "</think>" in puffer:
                                    rest = puffer.split("</think>", 1)[1].lstrip()
                                    denk_fertig = True
                                    if rest:
                                        yield rest
                                elif "<think>" not in puffer and len(puffer) > 16:
                                    denk_fertig = True
                                    yield puffer
                        if obj.get("done"):
                            if not denk_fertig and puffer:
                                yield puffer.replace("<think>", "").replace("</think>", "").strip()
                            dauer = time.time() - start
                            rate = tokens / dauer if dauer > 0 else 0
                            yield f"\n\n---\n{tokens} Tokens in {dauer:.1f}s ({rate:.1f} Tok/s)"
        except Exception as e:
            yield f"\n[Fehler: {e}]"

    return StreamingResponse(strom(), media_type="text/plain; charset=utf-8")


# ---------- Modell laden mit Fortschritt (Ollama pull) ----------
@app.get("/api/pull")
async def pull(request: Request, modell: str = CHAT_MODELL):
    if not _origin_ok(request.headers):
        return JSONResponse({"fehler": "ungueltiger Origin"}, status_code=403)
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
    await ws.accept()
    try:
        while True:
            daten = await ws.receive_text()      # dataURL "data:image/jpeg;base64,...."
            if len(daten) > MAX_FRAME_BYTES:
                continue
            roh = base64.b64decode(daten.split(",", 1)[-1])
            ergebnis = await asyncio.to_thread(_verarbeite_frame, roh, modus)
            if ergebnis:
                await ws.send_text(ergebnis)
    except WebSocketDisconnect:
        pass
    except Exception:
        try:
            await ws.close()
        except Exception:
            pass


# ---------- Bildmodell anlernen (Teachable Machine: Embeddings + kNN) ----------
_embed_pfad = HIER / "models" / "mobilenet_embed.onnx"
_embed_net = cv2.dnn.readNetFromONNX(str(_embed_pfad)) if _embed_pfad.exists() else None
_teach = {}                      # label -> Liste von Embeddings (np.array), geteilter Demo-Zustand
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


def _teach_sample(dataurl, label):
    img = _decode_dataurl(dataurl)
    if img is None:
        return None
    vec = _embedding(img)
    with _teach_lock:
        if label not in _teach and len(_teach) >= MAX_LABELS:
            return {k: len(v) for k, v in _teach.items()}      # Label-Limit erreicht
        lst = _teach.setdefault(label, [])
        if len(lst) < MAX_SAMPLES:
            lst.append(vec)
        return {k: len(v) for k, v in _teach.items()}


def _teach_classify(dataurl, k=3):
    img = _decode_dataurl(dataurl)
    if img is None:
        return {"label": None, "conf": 0.0}
    vec = _embedding(img)
    with _teach_lock:
        paare = [(float(np.dot(vec, s)), label) for label, vs in _teach.items() for s in vs]
    if not paare:
        return {"label": None, "conf": 0.0}
    paare.sort(reverse=True)
    top = paare[:k]
    from collections import Counter
    counts = Counter(l for _, l in top)
    label, cnt = counts.most_common(1)[0]
    sims = [s for s, l in top if l == label]
    return {"label": label, "conf": round(sum(sims) / len(sims), 3), "stimmen": cnt, "k": len(top)}


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
    if len(d["bild"]) > MAX_FRAME_BYTES:
        return JSONResponse({"fehler": "Bild zu gross"}, status_code=413)
    counts = await asyncio.to_thread(_teach_sample, d["bild"], label)
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
    if len(d["bild"]) > MAX_FRAME_BYTES:
        return JSONResponse({"fehler": "Bild zu gross"}, status_code=413)
    return JSONResponse(await asyncio.to_thread(_teach_classify, d["bild"]))


@app.post("/api/teach/reset")
async def teach_reset(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    with _teach_lock:
        _teach.clear()
    return JSONResponse({"ok": True})


# ---------- RAG: Fragen an eigene Dokumente (nomic-embed + llama3.2, alles lokal) ----------
_rag = []                        # Liste (text, vec), geteilter Demo-Zustand
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
    r = await client.post(f"{OLLAMA}/api/embeddings", json={"model": EMBED_MODELL, "prompt": text})
    v = np.array(r.json().get("embedding", []), dtype=np.float32)
    n = np.linalg.norm(v)
    return v / n if n > 0 else v


@app.post("/api/rag/upload")
async def rag_upload(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    d = await req.json()
    text = d.get("text") or ""
    if not text.strip():
        return JSONResponse({"fehler": "kein Text"}, status_code=400)
    if len(text) > RAG_MAX_TEXT:
        return JSONResponse({"fehler": "Text zu gross"}, status_code=413)
    stuecke = _chunk(text)[:RAG_MAX_CHUNKS]
    async with httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=10.0)) as c:
        neu = [(s, await _embed_async(c, s)) for s in stuecke]
    with _rag_lock:
        frei = max(0, RAG_MAX_CHUNKS - len(_rag))
        _rag.extend(neu[:frei])
        gesamt = len(_rag)
    return JSONResponse({"chunks": min(len(neu), frei), "gesamt": gesamt})


@app.post("/api/rag/ask")
async def rag_ask(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    d = await req.json()
    frage = (d.get("frage") or "").strip()[:1000]
    if not frage:
        return JSONResponse({"fehler": "keine Frage"}, status_code=400)
    with _rag_lock:
        leer = not _rag
    if leer:
        return JSONResponse({"fehler": "noch keine Dokumente eingelesen"}, status_code=400)

    async def strom():
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0)) as c:
            qv = await _embed_async(c, frage)
            with _rag_lock:
                treffer = sorted(((float(np.dot(qv, v)), t) for t, v in _rag), reverse=True)[:4]
            kontext = "\n\n".join("[%d] %s" % (i + 1, t) for i, (_, t) in enumerate(treffer))
            system = ("Beantworte die Frage ausschliesslich mit dem gegebenen Kontext und zitiere "
                      "Belege als [Nummer]. Reicht der Kontext nicht, sage das ehrlich. Antworte auf Deutsch.")
            payload = {"model": CHAT_MODELL, "stream": True, "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": "Kontext:\n%s\n\nFrage: %s" % (kontext, frage)}]}
            try:
                async with c.stream("POST", f"{OLLAMA}/api/chat", json=payload) as r:
                    async for zeile in r.aiter_lines():
                        if not zeile.strip():
                            continue
                        st = json.loads(zeile).get("message", {}).get("content", "")
                        if st:
                            yield st
                quellen = " · ".join("[%d] %s…" % (i + 1, t[:60].strip()) for i, (_, t) in enumerate(treffer))
                yield "\n\n---\nQuellen: " + quellen
            except Exception as e:
                yield "\n[Fehler: %s]" % e

    return StreamingResponse(strom(), media_type="text/plain; charset=utf-8")


@app.post("/api/rag/reset")
async def rag_reset(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    with _rag_lock:
        _rag.clear()
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


def _tool_ausfuehren(name, args):
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
            treffer = [t for t, _ in _rag if begriff in t.lower()][:2]
        return "\n".join(treffer) if treffer else "nichts gefunden (keine Dokumente eingelesen?)"
    return "unbekanntes Werkzeug"


@app.post("/api/agent/ask")
async def agent_ask(req: Request):
    if not _origin_ok(req.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    d = await req.json()
    frage = (d.get("frage") or "").strip()[:1000]
    if not frage:
        return JSONResponse({"fehler": "keine Frage"}, status_code=400)

    async def strom():
        messages = [
            {"role": "system", "content": "Du bist ein Agent mit Werkzeugen (rechne, uhrzeit, dokumentsuche). "
             "Nutze Werkzeuge, wenn sie helfen, und antworte am Ende knapp auf Deutsch."},
            {"role": "user", "content": frage}]
        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0)) as c:
            for _ in range(5):
                r = await c.post(f"{OLLAMA}/api/chat",
                                 json={"model": CHAT_MODELL, "messages": messages, "tools": _AGENT_TOOLS, "stream": False})
                m = r.json().get("message", {})
                tcs = m.get("tool_calls") or []
                if tcs:
                    messages.append(m)
                    for tc in tcs:
                        fn = tc["function"]["name"]
                        args = tc["function"].get("arguments", {}) or {}
                        yield "[Werkzeug] %s(%s)" % (fn, json.dumps(args, ensure_ascii=False))
                        erg = _tool_ausfuehren(fn, args)
                        yield "  ->  %s\n" % erg.replace("\n", " ")[:160]
                        messages.append({"role": "tool", "content": erg})
                    continue
                yield "\n[Antwort] " + (m.get("content") or "")
                return
            yield "\n[Abbruch nach 5 Schritten]"

    return StreamingResponse(strom(), media_type="text/plain; charset=utf-8")


@app.get("/", response_class=HTMLResponse)
def index():
    return (HIER / "index.html").read_text(encoding="utf-8")


@app.on_event("startup")
def _start():
    threading.Thread(target=_tegrastats_leser, daemon=True).start()
