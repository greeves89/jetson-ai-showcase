# KI-Labor auf dem Jetson

Ein Lernsystem für künstliche Intelligenz, das komplett auf einem **NVIDIA Jetson Orin Nano** läuft. Man liest nicht
nur, wie KI funktioniert, man probiert es aus und sieht dabei, was der Rechner gerade tut. Alles lokal, ohne Cloud.

- **Lektionen** erklären die Grundlagen von null, mit Beispielen aus dem Alltag, Vergleichstabellen, Merksätzen und
  einem Selbsttest. Siehe [`docs/lehrplan.md`](docs/lehrplan.md).
- **Labore** laufen live auf dem Jetson: Gesichts- und Objekterkennung über die eigene Webcam, Bildmodell anlernen,
  Sprachmodell, RAG, Agent mit Werkzeugen, Sprache zu Text, Text zu Sprache. Jedes Labor zeigt die Verarbeitung in
  Schritten mit ihren Zeiten und erklärt sie in einfachen Sätzen.
- **Interaktive Bausteine** machen Konzepte greifbar: neuronales Netz im Browser, Gradientenabstieg, k nächste
  Nachbarn, Token-Würfel, Regelkreis-Simulator, Konfusionsmatrix, Bedeutungskarte der Embeddings und mehr.
- **Videoreihen** (Remotion mit Stimme) erklären die Themen in 70 bis 100 Sekunden, siehe [`videos/`](videos/README.md).
- **Business-Use-Cases** mit fertigen Beispieldaten zum Starten per Klick.

Es ist ein Lernprojekt. Es läuft intern im Heimnetz. Zur Veröffentlichung siehe
[`docs/veroeffentlichung.md`](docs/veroeffentlichung.md).

## Warum der Jetson
Echte CUDA-GPU bei wenigen Watt, 24 Stunden am Tag. Die Grenze ist der Speicher: CPU und GPU teilen sich 8 GB.
Deshalb laufen kleine Modelle, und der Dateicache wird aktiv freigegeben (`app/speicher.py`). Der Jetson spielt seine
Stärke als Vision-, Audio- und Edge-Knoten aus, nicht als Rechner für große Sprachmodelle.

## Aufbau
```
app/app.py            FastAPI-Backend: Live-Werte, Chat, Modell laden, Webcam-WebSocket, Anlernen, RAG, Agent, Whisper
app/lab_*.py          weitere Labor-Module (Router), werden beim Start automatisch eingebunden
app/sicherheit.py     Origin-Prüfung, Ratenbegrenzung, Sitzungen je Besucher
app/speicher.py       Speicherwächter für den gemeinsamen CPU/GPU-Speicher
app/index.html        schlanke Hülle der Oberfläche
app/static/           app.js (Kern, Router, Glossar), content*.js (Lerninhalte), widgets*.js, demos*.js, module.json
app/static/beispiele/ fertige Beispieldaten der Business-Use-Cases
videos/               Remotion-Projekt für die Erklärvideos
docs/                 Lehrplan, Schreibleitfaden, Baustein- und Videoskizzen, Veröffentlichungsplan, Lizenzen
scripts/              Einrichtung (setup.sh), Autostart (systemd), Hilfsprogramme
tests/                Browser-Tests (Chrome, Fake-Webcam), Rauchtest über alle Seiten
```
Neue Seiten kommen als Datei `app/static/content-<thema>.js` dazu und werden in `app/static/module.json`
eingetragen. Die Schnittstelle für Bausteine steht im Kopfkommentar von `app/static/app.js`.

## Einrichten (auf dem Jetson)
Voraussetzungen: JetPack 6 (CUDA 12.6, Python 3.10, OpenCV aus JetPack), Ollama mit `llama3.2:3b` und
`nomic-embed-text`. Es ist kein Root nötig, pip wird per `get-pip.py --user` eingerichtet.

```bash
git clone <repo> ~/jetson-ai-showcase && cd ~/jetson-ai-showcase
bash scripts/setup.sh            # Pakete, Gesichts-/Objekt-/Merkmalsmodelle, Whisper, Piper-Stimmen, Zertifikat
bash scripts/install-service.sh  # Autostart als systemd-Benutzerdienst
```
Dann im Netz öffnen: `https://<jetson-ip>:8443` (selbstsigniertes Zertifikat, die Warnung einmal bestätigen; Browser
geben die Kamera nur bei HTTPS frei).

Hinweis zu numpy: Es muss `numpy<2` bleiben, sonst bricht das OpenCV aus JetPack.

## Entwickeln
```bash
cd tests && npm install && cd ..
export LABOR_URL=https://<jetson-ip>:8443
tests/deploy.sh                       # Arbeitskopie auf den Jetson spielen (rsync)
node tests/smoke.mjs                  # alle Seiten öffnen: Konsolenfehler, tote Links, leere Seiten
node tests/screenshot.mjs rag         # Screenshot einer Seite nach tests/ausgabe/
```
Weitere Tests unter `tests/` bedienen die Labore und Bausteine wirklich (Fake-Webcam über `FAKE_VIDEO`,
Fake-Mikrofon über `FAKE_AUDIO`).

## Sicherheit
- POST und WebSocket verlangen einen passenden `Origin`; der `Host` ist auf bekannte Adressen begrenzt.
- Größen- und Mengenlimits an allen Eingängen, nur JPEG für Bilder, feste Modell-Allowlist.
- Zustand (Anlern-Beispiele, RAG-Texte) ist je Besucher getrennt und läuft nach 30 Minuten ab.
- Mit `OEFFENTLICH=1` kommt eine Ratenbegrenzung je Besucher dazu. Gleichzeitige Chats und Kameraverbindungen sind
  immer begrenzt.
- Kamerabilder, Audio und Texte werden nur im Arbeitsspeicher verarbeitet und nicht gespeichert.

## Lizenzen
Stimmen und Beispielfotos mit Quellen und Lizenzen: [`docs/lizenzen.md`](docs/lizenzen.md) und
`app/static/beispiele/QUELLEN.md`.
