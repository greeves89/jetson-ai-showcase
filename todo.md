# Jetson AI-Showcase — Demo-Testsystem

Ziel: Der Jetson ist ein geiles, immer-laufendes Demo-/Testsystem.

## Erledigt
- [x] Webapp-Fundament (FastAPI, HTTPS, Apple-UI), deployt auf https://<jetson-ip>:8443
- [x] Live-Systemmonitor (tegrastats)
- [x] LLM-Chat (llama3.2:3b, 100% GPU)
- [x] Gesichtserkennung (YuNet, geneigt + Landmarks)
- [x] Objekterkennung (YOLOX/OpenCV-DNN, live über Webcam)
- [x] Business-Nutzen je Demo
- [x] Security: Allowlist, Limits, Origin-Check, Inferenz-Lock

## In Arbeit
- [x] Auto-Start beim Booten (systemd-user-Dienst, Restart=always)

## Als Nächstes (Demos scharf schalten)
- [x] Bildmodell anlernen (Teachable Machine) — LIVE
- [x] RAG (nomic-embed + llama3.2) — LIVE
- [ ] Agent (LangGraph + langchain-ollama)
- [ ] Whisper (faster-whisper, Audio-Upload)

## Schwerer Build (eigene Session)
- [ ] Face-Swap (onnxruntime-gpu + insightface)
- [ ] Bildgenerierung (PyTorch Jetson + diffusers)
