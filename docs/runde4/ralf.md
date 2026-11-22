# Prüfbericht Runde 4: Ralf (47, IT-Leiter Mittelstand, Desktop 1920x1080)

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443, ein headless Chromium (Playwright, `tests/browser.mjs`), hell und dunkel, Erstbesuch mit Willkommens-Fenster. 14 Screenshots in `docs/runde4/ralf-bilder/`, davon die Bilder 01, 02, 03, 05, 06-lizenzen, 07-brauchst-kurz, 07-fehler-kurz, 08, 12, 13, 14 mit dem Read-Werkzeug angesehen. Zusätzlich Seitentexte, HTTP-Kopfzeilen, `openapi.json` und das Repo (`docs/selbst-aufbauen.md`, `scripts/`, `app/app.py`) gelesen. Jetson: keine Sprachmodell-Anfrage gestellt, keine Ratenbegrenzung. Ralfs Aufgaben brauchen weder Chat noch Video noch PDF, deshalb habe ich diese Teile nicht geprüft. Dazu gilt hier keine Aussage.

## Gesamtnote: 7,9 von 10 (Ziel 8,5 nicht erreicht)

Die Aufbauanleitung ist für ein Lernprojekt ungewöhnlich ehrlich und brauchbar: nummerierte Befehle mit Kopieren-Knopf, "braucht sudo" mit Begründung, festgenagelte Ollama-Version, 15 Zeilen Fehlertabelle, offener Hinweis, dass nur ein Gerät getestet ist. Für einen IT-Leiter, der entscheidet, ob er das im Betrieb nachbaut, fehlen aber drei Dinge: eine Code-Lizenz, ein Sicherheits- und Betriebskapitel (Ports, Daten, Logs) und eine echte Stückliste.

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für die Zielperson | 8,5 | Technische Sprache stimmt, Befehle sind erklärt, keine Floskeln. Kurz lesen verdichtet zu Stichwörtern. |
| 2 | Einstieg und Führung | 9,0 | Willkommen: "Ich arbeite in der IT" (1 Klick) zeigt sofort Selbst aufbauen, Hardware, Modelle und Lizenzen, Quellcode (`02-nach-rolle-it.png`). |
| 3 | Lernwirkung | 8,0 | Quiz mit vier sinnvollen Fragen (check.sh, CUDA0-Puffer, Llama-Lizenz) und Rückmeldung mit Begründung. Reihenfolge der Antworten wechselt bei jedem Laden. |
| 4 | Motivation und Spaß | 7,5 | Sachlich, Ablaufgrafik "Der Weg in sechs Schritten" hilft. Nichts zum Ausprobieren auf der Aufbauseite selbst. |
| 5 | Labore und Interaktion | 8,0 | Hardware-Labor zeigt GPU, Speicher, CPU, Leistung, Temperatur live (`14-hardware-dunkel.png`). Kopieren-Knopf liefert den kompletten Block in die Zwischenablage und zeigt "Kopiert." (`12-kopieren-dunkel.png`). |
| 6 | Videos | nicht geprüft | Für Ralfs Aufgaben nicht nötig. |
| 7 | Navigation und Orientierung | 8,5 | Suche "Quellcode" findet Selbst aufbauen und Lizenzen (`03-suche-quellcode.png`). "Ports", "Logs", "Stückliste" finden nichts. |
| 8 | Vertrauen und Sicherheit | 6,5 | Datenschutztexte gut, aber keine Aussage zu Logs, Ports, Auslieferungs-Härtung. Code ohne Lizenz. Siehe Befunde 1 bis 4. |
| 9 | Barrierefreiheit und Bedienbarkeit | 8,5 | Skip-Link, sichtbarer Fokusrahmen (3 px) bei Tab, Kontrast hell und dunkel gut. |
| 10 | Fehlerfälle | 8,5 | Unbekannte Adresse zeigt "Seite nicht gefunden" mit Links (`11-404-dunkel.png`, Test per Skript, Bild nicht angesehen). Fehlertabelle deckt 15 reale Fälle ab. |

Weiterempfehlung: Mit Einschränkung ja, als Lern- und Vorführgerät im Heimnetz. Für einen Betrieb nicht ohne Klärung von Lizenz und Härtung.

## Befunde nach Schwere

### Blocker
Keine für das Lernziel. Für den Betrieb im Unternehmen gilt Befund 1 als Ausschlusskriterium.

### Hoch
1. **Der öffentliche Quellcode hat keine Lizenz.** Seite `/selbst-bauen`, Abschnitt "Lizenzen" (nur in Genau lesen, `13-quiz-dunkel.png`): "Die Lizenz des Codes legt der Betreiber noch fest. Bis dahin gilt keine ausdrückliche Erlaubnis zur Weitergabe." Im Repo gibt es keine `LICENSE`-Datei (geprüft per `ls`). Wer das Repo für den Betrieb klont, hat rechtlich keine Nutzungsgrundlage. Das steht sogar so auf der Seite, aber erst nach dem Aufklappen. Empfehlung: eine Lizenz festlegen (MIT oder Apache-2.0) und in Kurz lesen in einem Satz nennen.
2. **Kein Betriebskapitel zu Ports, Daten und Logs.** Seite `/sicherheit-einfach` ist eine Verbraucherseite (Cookies, Kamera, "Kundendaten nein"). Ralfs Fragen bleiben offen: Welche Ports hören? (Nur "Port 8443" und "leite den Port nicht ins Internet weiter" auf `/selbst-bauen`. Dass Ollama nur auf 127.0.0.1:11434 liegt, steht nur im Repo-Dokument.) Was loggt der Dienst und wie lange? Auf der Seite steht nur "Der Server sieht Internetadresse und Zeitpunkt" ohne Dauer. Das einzige Log-Kommando (`journalctl --user -u jetson-showcase`) steht nur in `docs/selbst-aufbauen.md`, Zeile 211, nicht auf der Seite. Suche "Logs" und "Ports" ergibt null Treffer. Empfehlung: Abschnitt "Betrieb und Sicherheit" auf `/selbst-bauen` mit Portliste, Datenort (RAM, keine Platte), Logquelle, Aufbewahrung, Updatepfad.
3. **Die Auslieferung ist nicht gehärtet, und die Seite sagt das nicht.** Geprüft per `curl -I` gegen den Dienst: keine HSTS-, CSP-, X-Frame-Options- oder nosniff-Kopfzeile, `server: uvicorn` sichtbar. `/docs`, `/redoc` und `/openapi.json` sind offen und listen 27 Pfade, darunter `/api/pull`, `/api/rag/reset`, `/api/teach/reset`. `scripts/jetson-showcase.service` bindet auf `0.0.0.0:8443` mit selbstsigniertem Zertifikat, kein Reverse-Proxy. Schreibende Pfade sind per Origin-Prüfung geschützt (`app/app.py`, `/api/pull`, Modell-Allowlist), aber der Betreiber erfährt auf der Seite nichts darüber. Nur ein Prüfer-Befund aus Kopfzeilen und `openapi.json`, kein Angriffstest. Für den Heimnetzbetrieb vertretbar, für den Mittelstand nicht ohne Hinweis. Empfehlung: Doku-Pfade im öffentlichen Betrieb abschalten, Sicherheitsköpfe setzen oder den Betrieb hinter nginx beschreiben.
4. **Standardmodus Kurz lesen versteckt genau das, was Ralf sucht.** `/selbst-bauen` in Kurz lesen (`07-brauchst-kurz.png`): "Die Befehle zum Kopieren", "Wo du die Anleitung findest", "Wenn etwas nicht klappt" zeigen nur je einen Satz und "Mehr dazu". Die Befehle erscheinen erst nach Genau lesen (`08-befehle-genau.png`), die 15-Zeilen-Fehlertabelle auch. Im Kurzmodus sieht die Fehlersuche nur aus wie vier Stichpunkte. Dazu der Satz "Die wichtigsten Befehle stehen schon oben", obwohl oben keine stehen. Wegweiser, die ins Leere zeigen, kosten Vertrauen. Empfehlung: auf Rolle IT standardmäßig Genau lesen, oder den Satz streichen.

### Mittel
5. **Keine echte Hardwareliste.** Die Seite "Hardware" (`14-hardware-dunkel.png`) ist ein Messwert-Labor, keine Einkaufsliste. Die Liste steht als sechs Kacheln auf `/selbst-bauen` ("Jetson Orin Nano Developer Kit, 8 GB, Super", NVMe, zweiter Rechner, Netzwerk, Terminal-Kenntnisse, Zeit) und hat keinen Preis, keinen Bezug, keine Netzteil- und Kühlungsangabe. Der Preis (249 US-Dollar laut NVIDIA, Stand 17.12.2024) und der Satz "achte auf Kühlung, welche Lösung passt, steht nicht belegt hier" stehen nur in Genau lesen. Die Kachel "Terminal-Kenntnisse" und "Zeit für den Aufbau" sind keine Hardware. Empfehlung: eine Tabelle mit Teil, Anforderung, Richtpreis, Stand-Datum.
6. **Lesezeit widerspricht sich.** Startseite (Rolle IT): "Selbst aufbauen ca. 8 Min Lesen". Kopf der Seite: "ca. 1 Min Lesen" (Kurz lesen). Genau lesen hat rund 13.000 Zeichen. Die Zahl hängt am Modus, aber die Startseite nennt den Wert für Genau lesen ohne Hinweis. Wer 1 Minute sieht, plant einen halben bis ganzen Tag nicht mit.
7. **Teststand nur ein Gerät, aber erst spät sichtbar.** "Aufgebaut ist das Labor bisher nur auf einem einzigen Gerät, ein frischer Jetson ist noch nicht von Dritten getestet worden" steht erst tief im Genau-lesen-Text (Abschnitt "Wo du die Anleitung findest"). Das ist die wichtigste Zeile für jemanden, der nachbauen will. Sie gehört in den Kopf der Seite.
8. **Quellcode-Kachel nur über die Rolle.** Wer die Rolle nicht wählt, findet "Quellcode auf GitHub" nicht auf der Startseite. Gefunden habe ich Links ins Repo nur im Text von `/selbst-bauen` und der Kachel der IT-Rolle. Suche "GitHub" findet "Über das Labor" und "Selbst aufbauen". Ein fester Link "Quellcode" in der Fußzeile fehlt.
9. **Testgerät läuft mit mehr Modellen als dokumentiert.** `/api/models` listet sechs Modelle (u. a. qwen3:8b, qwen2.5:7b-instruct), die Anleitung zwei (`llama3.2:3b`, `nomic-embed-text`). Eine Seite für Nachbauer sollte sagen, welche zusätzlichen Modelle das Labor kennt und ob sie nötig sind. Der Befund beruht nur auf der Modellliste, nicht auf der Bedienung.

### Klein
10. Der Kopieren-Knopf schiebt beim Klick ("Kopiert." erscheint links) den Knopf nach links (`12-kopieren-dunkel.png`, Block 3). Layoutsprung.
11. Antwortreihenfolge im Quiz wechselt bei jedem Laden. Für Wiederholung gut, für Lehrkräfte, die auf "Antwort 3" verweisen, schlecht.
12. Der erste Tab-Stopp nach dem Skip-Link springt in die Suche, die den Fokus nur mit einem Schatten zeigt (`outline none`, Rahmen sichtbar in `03-suche-quellcode.png`). Kein Mangel, nur uneinheitlich zu den 3-px-Umrandungen der übrigen Elemente.
13. In den Vollseiten-Screenshots erscheinen die Bildkacheln "Das brauchst du" und "Wenn etwas nicht klappt" leer (`05-selbst-bauen-voll.png`). Beim Scrollen sind sie gefüllt (`07-brauchst-kurz.png`, `07-fehler-kurz.png`). Das ist ein Nachladen beim Sichtbarwerden, kein Fehler im Betrieb, wird aber ein Drucker- oder Archivierungswerkzeug als leere Fläche zeigen.
14. Die Konsole meldet auf der 404-Seite einen 404-Fehler (erwartbar).

## Zielaufgaben

1. **Anleitung, Quellcode, Hardwareliste finden: gelöst, etwa 20 Sekunden, 3 Klicks.**
   - Willkommens-Fenster, "Ich arbeite in der IT" (1 Klick, 2 s): Startseite mit vier Kacheln.
   - "Selbst aufbauen, Öffnen" (Klick 2): Anleitung mit Schrittgrafik und Quizfragen.
   - "Genau lesen" (Klick 3): Befehle zum Kopieren, Einkaufsliste mit Preis, Fehlertabelle.
   - Quellcode: Kachel "Repo öffnen" (1 Klick von der Startseite). Beide GitHub-Adressen (Repo und `docs/selbst-aufbauen.md`) liefern HTTP 200.
   - Hardwareliste: nur halb gelöst, siehe Befund 5. Es gibt Kacheln, aber keine Stückliste mit Preisen und Kühlung.
2. **Sicherheit und Datenschutz (Ports, Daten, Logs): nur teilweise gelöst, rund 40 Sekunden, 3 Klicks (Menü, "Ist das sicher?", Genau lesen).**
   - Daten: gut. Tabelle aller Browser-Einträge mit Zweck und Dauer, Texte verfallen nach 30 Minuten, kein KI-Dienst in der Cloud, Vermittler IONOS und Cloudflare genannt.
   - Ports: nur "Port 8443" und "nicht im Router weiterleiten". Keine Liste, Ollama-Bindung nicht genannt.
   - Logs: nichts. Suche "Logs" und "Protokoll" ohne Treffer.
3. **Fehlersuche: gelöst, 3 Klicks, 15 Sekunden.** Menü, "Selbst aufbauen", Genau lesen: Tabelle "Fehlersuche, alle 15 Zeilen" mit Symptom, Ursache, Lösung, inklusive der Fallen "Invalid host header", "Port 8443 belegt", "CUDA0 buffer", "numpy<2", "pkill trifft die eigene Shell". Sehr gut. Es fehlt eine Zeile für "Dienst läuft, aber keine Antwort" mit dem Log-Kommando.

## Empfehlung in zwei Sätzen

Das Labor taugt als ehrlich beschriebenes, sauber nachbaubares Lern- und Vorführgerät im Heimnetz. Für den Betrieb im Mittelstand fehlen eine Code-Lizenz, ein Kapitel zu Ports, Daten und Logs und die Härtung der Auslieferung.

## Die drei größten Lücken Richtung 10

1. Code-Lizenz festlegen und sichtbar machen (Befund 1).
2. Kapitel "Betrieb und Sicherheit" mit Portliste, Datenort, Logs, Aufbewahrung und Hinweis auf geschlossene Doku-Pfade und Sicherheitsköpfe (Befunde 2 und 3).
3. Stückliste mit Preis und Stand, Teststand "ein Gerät" und Befehle auch im Kurzmodus oder per Standard Genau lesen für die IT-Rolle (Befunde 4, 5, 7).
