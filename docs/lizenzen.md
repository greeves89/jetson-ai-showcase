# Lizenzen der Sprachausgabe

Das Labor "Text zu Sprache" nutzt Piper (lokal, ONNX, CPU) mit deutschen Stimmen aus der Sammlung
`rhasspy/piper-voices` auf Hugging Face. Die Modelldateien liegen nicht in diesem Repo, sondern im
Benutzerverzeichnis des Geräts (`~/.local/share/piper-voices`). `scripts/setup.sh` lädt sie bei Bedarf.

Die Lizenz steht in der jeweiligen Modellkarte (`MODEL_CARD`) neben der Stimme.

| Stimme im Labor | Modell | Quelle der Aufnahmen | Lizenz | Namensnennung |
|---|---|---|---|---|
| Thorsten | `de_DE-thorsten-medium` | Thorsten-Voice (github.com/thorstenMueller/Thorsten-Voice) | CC0 | nicht verlangt, wird aber gern gesehen |
| Thorsten (hohe Qualität) | `de_DE-thorsten-high` | Thorsten-Voice | CC0 | wie oben |
| Kerstin | `de_DE-kerstin-low` | rhasspy/dataset-voice-kerstin (github.com/rhasspy/dataset-voice-kerstin) | CC0 | nicht verlangt |

Modellquelle: https://huggingface.co/rhasspy/piper-voices/tree/main/de/de_DE

## Bewusst nicht aufgenommen

- `pavoque`: CC BY-NC-SA 4.0 (nicht kommerziell, Weitergabe unter gleichen Bedingungen).
- `eva_k`, `karlsson`, `ramona`: Die Modellkarte verweist nur auf den M-AILABS-Datensatz ("See URL") und nennt keine
  Lizenz. Ohne eindeutige Angabe in der Karte werden sie nicht verwendet.

## Software

- Piper (`piper-tts`, Python-Paket der Open Home Foundation, github.com/OHF-Voice/piper1-gpl, Nachfolger von rhasspy/piper), GPL-3.0. Piper bringt
  espeak-ng für die Lautschrift mit, ebenfalls GPL. Das Labor ruft beides nur als Bibliothek auf dem Gerät auf.
- onnxruntime, MIT.

Hinweis: Stimmen sind Aufnahmen echter Menschen. Das Labor erzeugt keine geklonten Stimmen.
Vor einem Einsatz außerhalb des Labors Lizenz und Einwilligung der Sprecherin oder des Sprechers prüfen.
