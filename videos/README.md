# Erklärvideos

Fünf vertonte, animierte Erklärvideos (Deutsch, 1920x1080, 30 fps) zu den Grundlagen der KI. Gebaut mit Remotion (React). Die Webapp bindet die fertigen Dateien aus `app/static/videos/` ein und liest `manifest.json` für die Kapitelsprünge.

| Id | Thema |
|---|---|
| `was-ist-ki` | Begriffe und Landkarte der KI |
| `maschinelles-lernen` | Training, Inferenz, Lernarten, Überanpassung |
| `generative-ki` | Tokens, Temperatur, Halluzination, RAG |
| `robotik` | Regelkreis, Jetson am Roboter |
| `ki-im-business` | Einsatzfelder und drei Fragen vor dem Einsatz |

## Aufbau

- `texte/<id>.json`: Sprechtext als Daten, Sätze je Szene. Jede Szene ist ein Kapitel.
- `src/szenen/<id>.jsx`: Animationen je Szene. Sie hängen an den gemessenen Satzzeiten der Stimme.
- `src/plan/<id>.json`: Zeitplan (wird von `npm run ton` erzeugt, eingecheckt).
- `aussprache.json`: Wörter, die die Stimme falsch liest, in Lautschrift im Klartext.
- `stimme.mjs`, `musik.mjs`: Stimme, Musik per Code, Mischung auf -16 LUFS, Untertitel, Manifest.
- `render.mjs`, `stills.mjs`: Render und Standbilder zur Sichtprüfung.

## Installation

```bash
cd videos
npm install          # lädt Remotion; der Chrome-Download landet in node_modules
```

Außerdem nötig: `ffmpeg`/`ffprobe` und für die Kontaktbögen ImageMagick (`montage`).

## Ablauf

```bash
npm run ton                         # Stimme, Zeitplan, Musik, Mischung, VTT, manifest.json
npm run ton -- schaetzen            # nur Zeitplan aus Schätzung, ohne Stimme (kostenlos, für die Bildprüfung)
npm run stills -- <id>              # Standbilder je Satz plus Kontaktbogen in arbeit/stills/<id>/
npm run render -- <id>              # mp4, jpg, vtt nach out/ und ../app/static/videos/
```

`npm run ton -- <id> [<id> ...]` vertont nur einzelne Videos. Pflicht vor jedem vollen Render: Standbilder ansehen und Fehler beheben.

## Credits (ElevenLabs)

- Modell `eleven_v4`, Stimme George, Sprache `de`. Der API-Schlüssel wird nur aus `~/.elevenlabs/key` gelesen und nie ausgegeben oder gespeichert.
- Jeder Satz wird einmal bezahlt: Zwischenspeicher nach Text-Hash in `stimme-cache/` (nicht eingecheckt). Geänderte Sätze kosten neu, unveränderte nichts.
- Die Obergrenze neuer Zeichen je Lauf steht in `ZEICHEN_MAX` (Standard 15000). `stimme-cache/verbrauch.tsv` zählt mit.
- Alle fünf Videos zusammen umfassen etwa 5.000 Zeichen.

## Ergebnisdateien

Je Video `<id>.mp4` (H.264 und AAC, faststart, höchstens 15 MB), `<id>.jpg` (Vorschaubild), `<id>.vtt` (Untertitel). `mp4` und `jpg` sind nicht eingecheckt (`.gitignore`), `vtt` und `manifest.json` schon.
