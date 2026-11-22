# Prüfrunde 3: alle Personas, komplette UX und UI (22.11.2026)

Gleiche Regeln, gleiches Raster (zehn Kriterien, je 1 bis 10, streng, mit Beleg) und gleiche Persona-Definitionen wie in
`docs/pruefrunde-2-plan.md` und `docs/runde2/welle2-personas.md`. Lies beide Dateien zuerst, dazu den früheren Bericht deiner
Persona in `docs/runde2/` (Datei `welle2-<name>.md` bzw. `klasse8.md`, `klasse10.md`, `klasse12.md`, `didaktik.md`), damit du
prüfen kannst, was sich gebessert hat und was nicht. Dein Bericht geht nach `docs/runde3/<name>.md`.

## Neu seit der letzten Runde (gezielt prüfen)
- Willkommens-Fenster mit Rollenwahl (unscharfer Hintergrund, schließbar), Startseite und Menü je Rolle ("Für dich" kurz, "Alle Bereiche" zugeklappt).
- Schule: KI 1 bis 3, Medien 1 bis 7, Elternabend, Handreichung, Schulleitung. Startseite "Für morgen" bei Lehrenden.
- Arbeitsblätter und Lösungsblätter als PDF (Download-Karten oben auf den Seiten, drei Seiten, Quiz, Operatoren, QR-Code, Doppelstunden-Plan). Lade sie herunter und öffne sie wirklich (pdftoppm -r 60 -png, dann ansehen).
- Kartenset "Echt oder KI?", Elternabend-Infoblatt.
- Links in Texten, Code-Blöcke auf "Selbst bauen", Download-Dateinamen, Datenschutz-Aussagen.

## Pflicht: UX UND UI komplett sichten
Nicht nur Aufgaben lösen, sondern die Oberfläche beurteilen: Layout und Gleichmäßigkeit (Abstände, Ausrichtung, Kartenraster), Typografie und Lesbarkeit,
Kontrast (Hell und Dunkel), Icons, Bildqualität, Animationen, Ladezustände und Wartezeiten, Leerzustände, Fehlermeldungen, Textmenge,
Konsistenz der Namen und Muster zwischen Seiten, Mobil- und Desktopverhalten (Viewport deiner Persona), Tastaturbedienung. Mache mindestens
8 echte Screenshots (Playwright, Viewport der Persona) und sieh sie dir mit dem Read-Werkzeug an. Nenne jeden Befund mit Seite, Abschnitt und Screenshot-Datei.

## Bericht (Deutsch, echte Umlaute, keine Emojis, keine Gedankenstriche)
1. Gesamtnote 1 bis 10 und Raster mit zehn Noten und Beleg.
2. Vergleich zur Vorrunde: was besser, was gleich, was schlechter.
3. UX- und UI-Befunde, nach Schwere (Blocker, hoch, mittel, klein).
4. Zielaufgaben der Persona: gelöst? Klicks, Sekunden.
5. Würdest du es empfehlen (zwei Sätze)? Die drei größten Lücken Richtung 10.
Keine Code-Änderungen, kein Commit, kein Deploy. Nur in docs/runde3/ schreiben. Testadresse https://192.168.178.83:8443 (nicht die öffentliche Domain).

## Schonen
Mac: ein headless Chromium, am Ende schließen. Jetson: höchstens eine Sprachmodell-Anfrage, danach 10 Sekunden warten; bei "Zu viele Anfragen" 60 Sekunden warten und im Bericht erwähnen. Playwright über tests/browser.mjs (starte({einwilligung, willkommen})).
