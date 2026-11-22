# Prüfrunde 5: zehn frische Personas, komplette UX und UI (23.11.2026)

Zehn neue Personen, die das Labor noch nie gesehen haben (alle Namen erfunden). Ziel: Gesamtnote mindestens 8,5 je Person. Du hast keinen früheren Bericht; urteile frisch, streng und mit Beleg. Lies zuerst `docs/pruefrunde-2-plan.md` (Raster mit zehn Kriterien, je 1 bis 10, Regeln, Schonen von Mac und Jetson). Dein Bericht geht nach `docs/runde5/<name>.md`. Keine Code-Änderungen, kein Commit, kein Deploy. Testadresse https://192.168.178.83:8443 (nicht die öffentliche Domain).

## Pflicht
- Bediene das Labor selbst im Browser (Playwright, `tests/browser.mjs`, `starte({einwilligung, willkommen})`; für den echten Erstbesuch auch einmal mit Willkommens-Fenster), im Viewport deiner Person. Mindestens 10 Screenshots, alle mit dem Read-Werkzeug ansehen.
- Sichte UX UND UI komplett: Erstbesuch und Willkommens-Fenster, Rollenwahl, Startseite, Menü und Suche, Lernseiten (Text, Bilder, Videos, Quiz), Labore, Chat (die Antwort kann langsam sein; werte Wartehinweis, Schätzung und Ausfall-Karte, nicht nur das Ergebnis), Downloads (PDFs wirklich öffnen: `pdftoppm -r 60 -png`), Druckansicht (`page.emulateMedia({media:"print"})`, `page.pdf()`), Fehlerfälle, Hell und Dunkel, Tastatur, Typografie, Abstände, Kontrast, Konsistenz, Textmenge.
- Löse die Zielaufgaben deiner Person (unten) und nenne Klicks und Sekunden.
- Bericht (Deutsch, echte Umlaute, keine Emojis, keine Gedankenstriche): Gesamtnote und Raster, Befunde nach Schwere (Blocker, hoch, mittel, klein) mit Seite, Abschnitt und Screenshot, Zielaufgaben, Empfehlung in zwei Sätzen, die drei größten Lücken Richtung 10.
- Mac: ein headless Chromium, nur eigene Prozesse beenden, niemals pkill auf alle Chrome-Prozesse. Jetson: höchstens eine Sprachmodell-Anfrage, danach 10 Sekunden Pause; bei "Zu viele Anfragen" 60 Sekunden warten. Fünf Personen prüfen gleichzeitig: bei Wartezeit im Chat nicht mehrfach wiederholen.

## Personen
**Schüler:innen**
- **Lotte, 14, Klasse 8, iPhone SE (375x667).** Liest ungern. Aufgaben: (1) Finde heraus, was ein Prompt ist und probiere ihn im Chat. (2) Spiele "Echt oder KI?" und zähle deine Treffer. (3) Finde Hilfe für ein Referat.
- **Burak, 16, Klasse 11, Laptop (1440x900).** Interessiert an Programmieren. Aufgaben: (1) Finde die Rechnung zu einem Neuron. (2) Finde, wie das Labor technisch läuft. (3) Finde den Weg für Oberstufe und Abitur.

**Lehrende**
- **Frau Hansen, 57, Lehrerin Mathe und Biologie, Laptop (1366x768).** Wenig technikaffin, Doppelstunden. Aufgaben: (1) Plane eine Doppelstunde. (2) Drucke Arbeitsblatt und Lösung (öffne die PDFs, beurteile Druckqualität, Doppelstunde). (3) Finde den Lehrplanbezug.
- **Herr Kowalski, 61, Schulleiter, Desktop (1440x900).** Entscheider. Aufgaben: (1) Finde die Informationen zu Datenschutz, Kosten und Verantwortung. (2) Finde das Material für den Elternabend. (3) Finde Kontakt und Betreiber.

**Erwachsene**
- **Anneliese, 71, Rentnerin, Tablet (820x1180), Zoom 150 Prozent.** Angst vor Betrug. Aufgaben: (1) Verstehe, wie du einen falschen Anruf erkennst. (2) Verstehe, was KI ist. (3) Finde, ob das Labor etwas über dich speichert.
- **Sven, 33, Paketfahrer, Handy (390x844), 15 Minuten Pause.** Aufgaben: (1) Lerne das Wichtigste in 15 Minuten. (2) Frage den Chat etwas aus deinem Alltag und prüfe die Antwort. (3) Finde, wie du bessere Fragen stellst.

**IT und Betrieb**
- **Pavel, 35, Systemadministrator, Desktop (1920x1080).** Aufgaben: (1) Finde Betrieb und Sicherheit (Ports, Logs, Köpfe: prüfe die HTTP-Köpfe mit curl -skI). (2) Finde Anleitung, Stückliste und Fehlersuche. (3) Prüfe zwei fachliche Aussagen auf Richtigkeit.
- **Dr. Weber, 46, Inhaber einer Zahnarztpraxis, Laptop (1366x768).** Berufsgeheimnis ist ihm wichtig. Aufgaben: (1) Finde, was KI in der Praxis bringt. (2) Finde, ob du Patientendaten eingeben darfst. (3) Finde die Entscheidungshilfe zum Abhaken und drucke sie.

**Eltern**
- **Christina, 38, Mutter (10 und 14), Handy (390x844).** Aufgaben: (1) Finde, ob das Labor für ihre Kinder sicher ist (inklusive Chat und Altersorientierung). (2) Finde ein Experiment zum gemeinsamen Ausprobieren und drucke das Kartenset für zwei. (3) Finde etwas zur Bildschirmzeit.
- **Kai, 42, Vater (12 und 15), Laptop (1440x900).** Aufgaben: (1) Finde, wie man KI-Antworten prüft. (2) Finde Regeln für KI bei den Hausaufgaben. (3) Spiele "Echt oder KI?" mit deinen Kindern.
