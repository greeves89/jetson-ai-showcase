# Prüfrunde 2: Ziel "Eins-A-Lernplattform" (Plan, 22.11.2026)

Ziel des Betreibers: Das KI-Labor soll eine erstklassige, kostenlose Lernplattform für unerfahrene Menschen sein, ausdrücklich auch für Schülerinnen und Schüler. Diese Runde prüft das, bewertet streng und liefert einen priorisierten Aktionsplan. Es wird nichts am Code geändert.

## Prüfer
Welle 1 (parallel): Schüler Klasse 8 (13 bis 14, Handy), Schüler Klasse 10 (15 bis 16, Handy), Schüler Klasse 12 (17 bis 18, Laptop), Didaktik-Fachprüfer (Lehrplan, Lernwirksamkeit, Aufbau).
Welle 2 (parallel, frisch): Rentnerin am Tablet, Betriebsinhaber am Desktop, Lehrerin mit Tastatur und Datenschutzblick (unterrichtet Klasse 8, will das Labor im Unterricht nutzen: 28 Kinder, Schul-WLAN, Schulgeräte, Datenschutz der Schule, Lehrerhandreichung, Unterrichtsstunde in 45 Minuten), Erwachsener Quereinsteiger am Laptop (kein Vorwissen, will "KI verstehen" in 30 Minuten).

## Aufgaben je Prüfer
Jeder Prüfer bedient das Labor selbst im Browser (Playwright, siehe tests/browser.mjs und tests/laien.mjs), nicht nur Screenshots werten. Pflichtweg: Startseite, "Neu hier", mindestens 3 Lernseiten (eine Grundlagen, eine RAG oder Sprache, eine mit Labor), mindestens 2 Labore selbst bedienen, 1 Video ansehen (Dauer, Untertitel, Verständlichkeit des Verweises am Ende), 1 Quiz lösen, Suche mit Alltagswörtern, eine Fehlersituation herbeiführen (Kamera ablehnen, leere Eingabe).

## Bewertungsraster (je 1 bis 10, streng, mit Beleg)
1. Verständlichkeit für das Alter (Sprache, Satzlänge, Fachwörter)
2. Einstieg und Führung (weiß ich in 30 Sekunden, was ich tue?)
3. Lernwirkung (habe ich etwas verstanden und kann es erklären? Prüfung per eigener Erklärung in 3 Sätzen)
4. Motivation und Spaß (Bilder, Ausprobieren, Erfolgserlebnis)
5. Labore und Interaktion (funktioniert, sinnvolles Feedback, Wartezeiten)
6. Videos (Länge, Tempo, Position, Verweise)
7. Navigation und Orientierung (Menü, Suche, Zurück, Fortschritt)
8. Vertrauen und Sicherheit (Datenschutz verständlich, Kamera/Mikro, Altersgrenze 16+)
9. Barrierefreiheit und Bedienbarkeit (Touch-Ziele, Tastatur, Kontrast, Schriftgröße)
10. Fehlerfälle (freundlich, Handlungshinweis)
Gesamtnote = ehrlicher Eindruck, nicht Mittelwert. Zusätzlich: "Würde ich es weiterempfehlen?" mit Begründung, und die drei größten Lücken Richtung Eins-A.

## Regeln
- Nur Lesen und Browser: keine Code-Änderungen, kein Commit, kein Deploy. Schreiben nur in docs/runde2/<name>.md.
- Testadresse: LABOR_URL=https://192.168.178.83:8443 (Jetson im LAN). Nicht gegen die öffentliche Domain testen.
- Jetson schonen: höchstens eine Sprachmodell-Anfrage gleichzeitig je Prüfer, nach jeder 5 bis 10 Sekunden warten; Kamera/Mikro nur mit den Fake-Geräten aus tests/browser.mjs. Ratenbegrenzung (alle Prüfer teilen eine IP): bei "Zu viele Anfragen" 60 Sekunden warten, im Bericht erwähnen, aber nicht als Seitenfehler werten.
- Mac schonen: ein Chromium je Prüfer, headless, am Ende schließen.
- Texte im Bericht: Deutsch, echte Umlaute, keine Emojis, keine Gedankenstriche. Belege mit Seite/Schritt, keine erfundenen Messwerte.

## Auswertung
Nach beiden Wellen: Zusammenführung in docs/runde2/00-zusammenfassung.md (Noten je Prüfer, gemeinsame Befunde, Blocker, Aktionsplan mit Priorität A/B/C und Aufwand). Danach Umsetzung in Paketen mit getrennten Dateien und erneute Prüfung durch frische Prüfer, bis die Gesamtnote je Prüfer mindestens 8,5 erreicht.

## Rechtlicher Punkt (nur melden)
Das Labor weist 16+ aus. Für unter 16 Jahre (Art. 8 DSGVO) sind die Einwilligungen für Kamera, Mikro und Gesichtserkennung rechtlich zu klären. Die Schüler-Prüfer sollen nur beschreiben, ob sie die Hinweise bemerken und verstehen. Eine Rechtsbewertung folgt separat.
