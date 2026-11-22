# Prüfrunde 4: frische Personas, komplette UX und UI (22.11.2026)

Vierzehn neue Personen, die das Labor noch nie gesehen haben (alle Namen erfunden). Ziel: Gesamtnote mindestens 8,5 je Person. Du hast keinen früheren Bericht; urteile frisch, streng und mit Beleg. Lies zuerst `docs/pruefrunde-2-plan.md` (Raster mit zehn Kriterien, je 1 bis 10, Regeln, Schonen von Mac und Jetson). Dein Bericht geht nach `docs/runde4/<name>.md`. Keine Code-Änderungen, kein Commit, kein Deploy. Testadresse https://192.168.178.83:8443 (nicht die öffentliche Domain).

## Pflicht
- Bediene das Labor selbst im Browser (Playwright, `tests/browser.mjs`, `starte({einwilligung, willkommen})`; für den echten Erstbesuch auch einmal mit Willkommens-Fenster), im Viewport deiner Person. Mindestens 10 Screenshots, alle mit dem Read-Werkzeug ansehen.
- Sichte UX UND UI komplett: Erstbesuch und Willkommens-Fenster, Rollenwahl, Startseite, Menü und Suche, Lernseiten (Text, Bilder, Videos, Quiz), Labore, Chat (die Antwort kann langsam sein, weil der Jetson bei Speichermangel weniger GPU nutzt; werte Wartezeit und Hinweise, nicht nur das Ergebnis), Downloads (PDFs wirklich öffnen: `pdftoppm -r 60 -png`), Fehlerfälle, Hell und Dunkel, Tastatur, Typografie, Abstände, Kontrast, Konsistenz, Textmenge.
- Löse die Zielaufgaben deiner Person (unten) und nenne Klicks und Sekunden.
- Bericht (Deutsch, echte Umlaute, keine Emojis, keine Gedankenstriche): Gesamtnote und Raster, Befunde nach Schwere (Blocker, hoch, mittel, klein) mit Seite, Abschnitt und Screenshot, Zielaufgaben, Empfehlung in zwei Sätzen, die drei größten Lücken Richtung 10.
- Mac: ein headless Chromium, nur eigene Prozesse beenden, niemals pkill auf alle Chrome-Prozesse. Jetson: höchstens eine Sprachmodell-Anfrage, danach 10 Sekunden Pause; bei "Zu viele Anfragen" 60 Sekunden warten.

## Personen
**Schüler:innen**
- **Jonas, 13, Klasse 8, Familien-PC (1920x1080).** Liest schnell und überfliegt. Aufgaben: (1) Spiele "Echt oder KI?" durch. (2) Finde heraus, was ein Prompt ist. (3) Finde das Quiz zu einem Labor und mach es.
- **Aylin, 15, Klasse 10, iPhone (390x844).** Nutzt TikTok und ChatGPT täglich, hat Referat über KI. Aufgaben: (1) Finde Material fürs Referat mit Quellen. (2) Erkläre in drei Sätzen, wie ein Sprachmodell Text erzeugt. (3) Finde, ob du das Labor für Hausaufgaben nutzen darfst.
- **Felix, 17, Klasse 12, Abitur Informatik, Laptop (1440x900).** Will Mathe und Quellen. Aufgaben: (1) Finde die Rechnung zum Training eines Neurons. (2) Finde Weiterlesen zu Embeddings oder Fairness. (3) Finde den Weg für die Oberstufe.

**Lehrende**
- **Herr Schulz, 52, Gymnasiallehrer Mathe/Physik, iPad (820x1180).** Unterrichtet fast nur Doppelstunden, wenig KI-Erfahrung. Aufgaben: (1) Plane eine Doppelstunde (90 Minuten) zu KI. (2) Lade Arbeitsblatt und Lösung und beurteile sie für den Druck. (3) Finde, wie die Schüler die Aufgaben ohne eigene Kamera lösen.
- **Frau Okafor, 31, Referendarin Informatik und Ethik, Laptop (1366x768).** Will Medienkompetenz-Einheiten. Aufgaben: (1) Finde eine Einheit zu Fake News und Deepfakes. (2) Prüfe Operatoren, Differenzierung und Hilfekarten. (3) Finde den Lehrplanbezug.
- **Frau Demir, 58, Schulleiterin, Desktop (1440x900).** Entscheiderin. Aufgaben: (1) Finde die Information für die Schulleitung (Datenschutz, Kosten, Verantwortung). (2) Finde das Material für einen Elternabend. (3) Finde, wer das Labor betreibt und wie du Kontakt aufnimmst.

**Erwachsene**
- **Gerda, 74, Rentnerin, Smartphone (390x844), größte Schrift (Zoom 150 Prozent).** Angst vor Betrug. Aufgaben: (1) Verstehe, was KI ist. (2) Finde, wie du einen falschen Anruf erkennst. (3) Finde, ob das Labor etwas über dich speichert.
- **Dirk, 38, Busfahrer, Handy (390x844), 15 Minuten in der Pause.** Aufgaben: (1) Lerne das Wichtigste in 15 Minuten. (2) Frage den Chat etwas aus deinem Alltag. (3) Finde, wie du bessere Fragen an ChatGPT stellst.

**IT und Technik**
- **Jana, 26, Data-Analystin, Laptop (1440x900).** Aufgaben: (1) Finde die Erklärung zu Embeddings und probiere das Labor. (2) Finde Modell, Kontextlänge und Grenzen. (3) Prüfe zwei fachliche Aussagen auf Richtigkeit.
- **Ralf, 47, IT-Leiter Mittelstand, Desktop (1920x1080).** Prüft, ob so etwas im Betrieb nachbaubar ist. Aufgaben: (1) Finde Anleitung, Quellcode und Hardwareliste. (2) Finde Sicherheit und Datenschutz (Ports, Daten, Logs). (3) Finde Fehlersuche.

**Entscheider im Betrieb**
- **Heike, 55, Inhaberin Steuerbüro, Laptop (1366x768).** Datenschutz ist ihr wichtig. Aufgaben: (1) Finde in 15 Minuten, was KI im Büro bringt. (2) Finde, ob du Mandantendaten eingeben darfst. (3) Finde die Entscheidungshilfe zum Abhaken.
- **Mehmet, 39, Betriebsleiter Metallbau, Desktop (1440x900).** Aufgaben: (1) Finde die Qualitätsprüfung per Kamera und starte das Beispiel. (2) Rechne Kosten für ein Kameraprojekt. (3) Finde Grenzen und Risiken.

**Eltern**
- **Svenja, 36, Mutter (9 und 13), Handy (390x844).** Aufgaben: (1) Finde, ob das Labor für ihre Kinder sicher ist. (2) Finde ein Experiment zum gemeinsamen Ausprobieren. (3) Finde etwas zur Bildschirmzeit.
- **Thomas, 50, Vater (16), Laptop (1440x900).** Aufgaben: (1) Finde, wie man KI-Antworten prüft. (2) Finde Regeln für KI bei den Hausaufgaben. (3) Spiele "Echt oder KI?" mit deinem Sohn.
