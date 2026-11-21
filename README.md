# Jetson AI-Showcase

Eine lokale Demo-Webapp für den **NVIDIA Jetson Orin Nano Super** (JetPack 6, CUDA 12.6),
die die Bandbreite dessen zeigt, was die kleine Edge-GPU kann — klassisches ML, generative KI,
RAG und Agenten. Jede Demo lädt ihr Modell selbst (mit Fortschrittsanzeige), bringt eine
Schritt-für-Schritt-Anleitung mit und läuft **komplett offline** auf dem Gerät.

Gedacht als **interne Demo-Einheit im eigenen Netz** — mehrere Besucher öffnen die Seite im
Browser, nutzen ihre **eigene Webcam**, und die Bilder werden zum Jetson geschickt, dort
gerechnet und das Ergebnis zurückgespielt. Clients brauchen nichts außer einem Browser.

> Kein Produktionssystem, keine Härtung für das öffentliche Internet — bewusst LAN-only.

## Warum der Jetson (und nicht Mac mini / Pi)

- **Echte CUDA-GPU** bei ~7–25 W, läuft 24/7 — ideal für Dauer-Inferenz am Rand.
- **8 GB geteilter Speicher** ist der Begrenzer: Modelle laufen **nacheinander**, eins zur Zeit.
- **829 GB NVMe frei** — Speicherplatz ist reichlich, nur RAM ist knapp.
- Nicht geeignet für große agentische LLMs (dafür steht ein Mac mini bereit); der Jetson
  spielt seine Stärke als **Vision-/Audio-/Edge-Knoten** aus.

## Use-Case-Katalog

Status: **live** = in dieser App lauffähig · **geplant** = Anleitung vorhanden, wird schrittweise scharfgeschaltet.

### 1 — Klassisches ML (Vision & Audio)
| Use Case | Modell/Stack | Speicher | Status |
|---|---|---|---|
| Gesichtserkennung über Browser-Webcam | OpenCV Haar | ~0 (CPU) | **live** |
| Objekterkennung | YOLOX-tiny (OpenCV-DNN) | ~0 (CPU) | **live** |
| Pose-/Hand-Tracking | YOLOv8-pose / MediaPipe | ~0,5 GB | geplant |
| Sprache zu Text | faster-whisper (small/base) | ~1 GB | geplant |
| Bildklassifikation | MobileNet/ResNet (onnx) | ~0,2 GB | geplant |

### 2 — Generative KI
| Use Case | Modell/Stack | Speicher | Status |
|---|---|---|---|
| LLM-Chat | llama3.2:3b via Ollama | 2 GB | **live** |
| Vision-Sprachmodell (Bild beschreiben) | llava / qwen2.5-vl via Ollama | ~4–6 GB | geplant |
| Bildgenerierung | SDXL-Turbo / SD1.5 (diffusers) | ~4–6 GB | geplant |
| Text zu Sprache | Piper TTS | ~0,1 GB | geplant |
| Face-Swap (live, über Webcam-Pipeline) | insightface + inswapper_128 (onnxruntime-gpu) | ~1 GB | geplant (experimentell) |

### 3 — RAG & Agenten
| Use Case | Modell/Stack | Speicher | Status |
|---|---|---|---|
| RAG über eigene Dokumente | nomic-embed-text + llama3.2:3b | ~3 GB | **live** |
| Agent mit Werkzeugen | LangGraph + langchain-ollama (qwen3 Tool-Calling) | 2,5 GB | geplant |

### 4 — Edge-Dauerbetrieb (der eigentliche Langzeitwert)
| Use Case | Nutzen |
|---|---|
| 24/7 Präsenz-/Personenerkennung | Kamera-Node ohne Cloud |
| Lokaler Embedding-Server | Dauerdienst fürs Second Brain |
| Wake-Word / Voice-Node | immer-an Aufnahme für die Sprachschicht |

## Architektur

```
Browser (eigene Webcam, getUserMedia)
   │  JPEG-Frames über WebSocket (wss)
   ▼
Jetson — FastAPI (HTTPS, selbstsigniert)
   ├─ /api/stats     Live-Systemwerte aus tegrastats (RAM/GPU/Strom/Temp)
   ├─ /api/pull      Modell laden mit Fortschritt (Ollama pull, SSE)
   ├─ /api/chat      LLM-Antwort im Stream (Ollama)
   └─ /ws/vision     Frame rein → OpenCV → annotiert zurück
   │
   └─ Ollama (127.0.0.1:11434), lokale Modelle
```

HTTPS ist Pflicht, weil Browser die Webcam nur in einem sicheren Kontext freigeben
(`https://` oder `localhost`, nicht `http://LAN-IP`).

## Einrichten (auf dem Jetson)

```bash
git clone <repo> ~/jetson-ai-showcase && cd ~/jetson-ai-showcase
bash scripts/setup.sh      # pip (user), FastAPI-Stack, Haar-Cascade, selbstsigniertes Cert
bash scripts/start.sh      # startet uvicorn auf https://0.0.0.0:8443
```

Dann im Netz öffnen: `https://<jetson-ip>:8443` (einmalige Zertifikatswarnung bestätigen).

## Voraussetzungen

- JetPack 6 / CUDA 12.6, Python 3.10, OpenCV (aus JetPack), Ollama mit `qwen3:4b`.
- Keine Systempakete nötig: pip wird per `get-pip.py --user` gebootstrappt.

## Aufbau

```
app/app.py        FastAPI-Backend (Monitor, Chat, Modell-Laden, Webcam-WebSocket)
app/index.html    Showcase-Oberfläche (eine Datei, keine Build-Kette)
scripts/          Setup und Start
```
