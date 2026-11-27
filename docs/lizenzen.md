# Lizenzen der Sprachausgabe

Das Labor "Text zu Sprache" nutzt Piper (lokal, ONNX, CPU) mit deutschen Stimmen aus der Sammlung
`rhasspy/piper-voices` auf Hugging Face. Die Modelldateien liegen nicht in diesem Repo, sondern im
Benutzerverzeichnis des Geräts (`~/.local/share/piper-voices`). `scripts/setup.sh` lädt sie bei Bedarf.

Die Lizenz steht in der jeweiligen Modellkarte (`MODEL_CARD`) neben der Stimme.

| Stimme im Labor | Modell | Quelle der Aufnahmen | Lizenz | Namensnennung |
|---|---|---|---|---|
| Thorsten | `de_DE-thorsten-medium` | Thorsten-Voice (github.com/thorstenMueller/Thorsten-Voice) | CC0 | nicht verlangt, wird aber gern gesehen |

Modellquelle: https://huggingface.co/rhasspy/piper-voices/tree/main/de/de_DE

## Bewusst nicht aufgenommen

- `thorsten-high` und `kerstin-low` (entfernt am 22.11.2026): Die Aufnahmen sind CC0, die Modelle sind aber aus Ausgangsmodellen
  mit nicht gewerblichen Trainingsdaten weitertrainiert (thorsten-high aus lessac, Blizzard-2013-Lizenz nur für Forschung;
  kerstin-low aus ryan, RyanSpeech unter CC BY-NC-SA 4.0). Siehe die jeweilige Modellkarte.

- `pavoque`: CC BY-NC-SA 4.0 (nicht kommerziell, Weitergabe unter gleichen Bedingungen).
- `eva_k`, `karlsson`, `ramona`: Die Modellkarte verweist nur auf den M-AILABS-Datensatz ("See URL") und nennt keine
  Lizenz. Ohne eindeutige Angabe in der Karte werden sie nicht verwendet.

## Bildmodelle

Die Bildmodelle liegen nicht im Repo. `scripts/modelle_laden.sh` holt sie aus dem OpenCV Zoo (github.com/opencv/opencv_zoo) nach `app/models/`.
Die Lizenz je Modell steht auf der Seite Lizenzen und Quellen (`app/static/content-rechtliches.js`) und in der Modellkarte im Zoo.

| Modell | Labor | Lizenz | Quelle |
|---|---|---|---|
| `human_segmentation_pphumanseg_2023mar.onnx` (PP-HumanSeg, ca. 6 MB) | Bild schützen (Freistellen) | Apache-2.0 (LICENSE-Datei im Zoo-Ordner, Modell aus PaddleHub) | opencv_zoo/models/human_segmentation_pphumanseg |
| `face_detection_yunet_2023mar.onnx` (YuNet) | Gesichter, Bild schützen (Verpixeln) | MIT | opencv_zoo/models/face_detection_yunet |
## Körperhaltung (Kamera-Labor)

Das Labor "Körperhaltung" nutzt zwei Modelle aus dem OpenCV Zoo (github.com/opencv/opencv_zoo), beide Apache-2.0, beide aus
Google MediaPipe (BlazePose) nach ONNX umgewandelt. `scripts/modelle_laden.sh` lädt sie nach `app/models/` (nicht im Repo).

| Datei | Aufgabe | Lizenz |
|---|---|---|
| `person_detection_mediapipe_2023mar.onnx` | findet Personen und die Körpermitte | Apache-2.0 |
| `pose_estimation_mediapipe_2023mar.onnx` | 33 Körperpunkte je Person | Apache-2.0 |

Die Vor- und Nachverarbeitung in `app/lab_koerper.py` folgt dem Ablauf der Referenzcodes des OpenCV Zoo und ist eigenständig neu geschrieben.
Die Modellkarten nennen keine Zahlen zur Genauigkeit bei Kindern, im Rollstuhl oder bei Prothesen; das Labor sagt das auf der Seite offen.

## Software

- Piper (`piper-tts`, Python-Paket der Open Home Foundation, github.com/OHF-Voice/piper1-gpl, Nachfolger von rhasspy/piper), GPL-3.0. Piper bringt
  espeak-ng für die Lautschrift mit, ebenfalls GPL. Das Labor ruft beides nur als Bibliothek auf dem Gerät auf.
- onnxruntime, MIT (PyPI-Metadaten; wird von `piper-tts` als Abhängigkeit gezogen).
- Webserver und Hilfspakete aus `requirements.txt` (Lizenztexte am 27.11.2026 an den Projekten gelesen): uvicorn, websockets und httpx
  stehen unter BSD-3-Clause (encode/uvicorn, python-websockets/websockets, encode/httpx auf GitHub),
  NumPy ebenfalls unter BSD-3-Clause (numpy/numpy). Die Seite `lizenzen` im Labor führt sie in der Komponententabelle.
- Remotion (nur für die Erklärvideos, nicht im Labor): eigene Lizenz, kostenlos für Einzelpersonen und Firmen mit bis zu drei Personen,
  sonst Company License (remotion.dev/docs/license/pricing, Stand 27.11.2026). Die Sprecherstimme der Videos kommt von ElevenLabs
  (Nutzungsbedingungen des Anbieters).

Hinweis: Stimmen sind Aufnahmen echter Menschen. Das Labor erzeugt keine geklonten Stimmen.
Vor einem Einsatz außerhalb des Labors Lizenz und Einwilligung der Sprecherin oder des Sprechers prüfen.

# Icons der Oberfläche

- lucide (npm-Paket `lucide-static` 1.77.0, https://lucide.dev), ISC-Lizenz, Copyright Lucide Icons and Contributors.
  `scripts/icons_bauen.mjs` übernimmt eine Auswahl von rund 340 Icons als `app/static/icons.json` (nur der innere SVG-Inhalt).
  Der Lizenztext der ISC-Lizenz steht im Paket (`LICENSE`) und erlaubt Nutzung und Weitergabe unter Beibehaltung des Hinweises.
