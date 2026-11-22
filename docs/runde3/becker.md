# Runde 3: Frau Becker (Lehrerin Klasse 8, Laptop 1366x768)

Prüfung am 22.11.2026 gegen https://192.168.178.83:8443, Chrome headless, Viewport 1366x768, überwiegend hell, Dunkelmodus an drei Seiten. Alle sechs Arbeits- und sechs Lösungsblätter (KI 1 bis 3, Medien 1 bis 7), Kartenset und beide Elternabend-Blätter habe ich heruntergeladen, mit pdftoppm -r 60 in Bilder gewandelt und angesehen. Screenshots und PDFs liegen in /private/tmp/claude-501/-Users-danielalisch-GitHub-AI-Employee/49812d33-aa02-4b52-b074-6cdeedcf20b0/scratchpad/b3/ (Bilder 01 bis 15, Unterordner pdf/). Sprachmodell: zwei Anfragen (die zweite lief nach 10 Sekunden Pause, sie stand 55 Sekunden in der Warteschlange hinter meiner ersten und lieferte dann). "Zu viele Anfragen" kam nie. Konsolenfehler: keine.

## 1. Gesamtnote: 7,8 von 10 (Vorrunde 6,5)

Das ist ein großer Sprung. Ich lande als Lehrerin nach einem Klick auf der Seite "Für morgen im Unterricht", habe pro Einheit ein druckbares Arbeitsblatt und ein Lösungsblatt mit Plan für Einzel- und Doppelstunde, und das Sprachmodell läuft. Zur 9 fehlen: eine geklärte Lizenz auf den Blättern ("Lizenz: noch festzulegen"), eine Schulleitungsseite, die die Hosting-Frage beantwortet, und Blätter, die zwischen Einzel- und Doppelstunde nicht erst durch Nachlesen im Lösungsblatt unterscheidbar werden.

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter | 8 | Blätter klar: Operatoren (Nenne, Beschreibe, Erkläre) mit Tabelle, Niveau-Symbole, Selbsteinschätzung "sicher, fast, noch nicht". Seite sagt "Du" zu Lehrkräften, Schulleitung "Sie", Elternblatt "Sie": jetzt konsequent je Zielgruppe. Rest: "Seite ml", "Heuristik", "Temperatur" in den Laboren. |
| 2 | Einstieg und Führung | 9 | Willkommens-Fenster, Klick auf "Ich unterrichte", sofort "Für morgen im Unterricht" mit allen 14 Einheiten, Menü "Für dich" (01-willkommen.png, 02-start-lehrende.png). Vorrunde: größter Bruch, jetzt gelöst. |
| 3 | Lernwirkung | 8 | Arbeitsblatt, Quiz mit drei Fragen, "Zum Nachdenken", Merksatz, Hilfekarten, Differenzierung leicht/schwer, Tafelbild. Aufgabenhöhe nach Operatorbereich I bis III gestuft. |
| 4 | Motivation und Spaß | 7 | Punkte-Labor mit Rückmeldung in einem Satz (11-ml-punkte.png), Kartenset mit Fotos zum Ausschneiden. Die Prompt-Werkstatt bietet nur Büro-Beispiele (Kundenmail, Angebote, Protokoll), das motiviert Klasse 8 kaum. |
| 5 | Labore und Interaktion | 7 | Punkte-Labor sehr gut. Prompt-Werkstatt lief, 78 Sekunden bis zur Antwort, davon rund 60 in der Warteschlange (12-prompt-werkstatt.png). Bei 7 Gruppen gleichzeitig kritisch (siehe Doppelstunde unten). |
| 6 | Videos | 8 | Nicht neu geprüft, Stand der Vorrunde (Untertitel, Kapitelmarken). Videos mit Zeit-Kapiteln auf ml und prompting weiterhin da. |
| 7 | Navigation und Orientierung | 7 | "Für dich" kurz und passend. Aber "Info Schulleitung", "Info Eltern" und "Schule: Einstieg" fehlen in "Für dich", obwohl sie auf der Startseite stehen. Suche findet "Arbeitsblatt" und "Schulleitung", aber nicht "Doppelstunde", "Stundenplanung" oder "drucken", und "PDF" nur RAG-Seiten. |
| 8 | Vertrauen und Sicherheit | 7 | Alle Blätter tragen im Kopf "Lizenz: noch festzulegen". Schulleitungsseite unverändert: Hosting nur "Weiterleitung laut Planung", kein Auftragsverarbeitungsvertrag genannt, kein Ausdruck. Gut: Elternblatt mit klaren Aussagen (kein Konto, Kamera aus). |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Skip-Link, Fokusring sichtbar, Download-Buttons groß (442x95 Pixel). Im Dunkelmodus ist der Fokusring der Menüpunkte schwach (14-dunkel-fokus.png). Vor dem Inhalt liegen ca. 30 Menüpunkte im Tab-Weg. Blätter: Schrift in schwarzweiß gut lesbar, Kontrast gut. |
| 10 | Fehlerfälle | 7 | Warteschlange ehrlich ("Du bist Nr. 2 in der Warteschlange", dann "Das Modell schreibt …"). Ausfall des Modells diesmal nicht aufgetreten und deshalb nicht erneut geprüft. Suche ohne Treffer: "Dazu habe ich nichts gefunden. Probiere zum Beispiel: Chat, Datenschutz …" (09-suche.png). Plan B für Stationen mit Sprachmodell steht weiter nicht im Blatt. |

## 2. Vergleich zur Vorrunde

Besser:
- Arbeitsblatt als PDF: gelöst (Vorrunde: größte Lücke). 3 Seiten A4, Download-Karte direkt oben auf jeder Lektionsseite, Dateiname "ki-labor-arbeitsblatt-stunde-1.pdf" (sauber), auch gesammelt in der Handreichung (6 Karten).
- Lösungsblatt, Elternabend-Infoblatt, Kartenset: neu und brauchbar.
- Einstieg: Rollenwahl führt direkt zum Material, Menü "Für dich" mit 12 statt 75 Punkten, kein Doppelblock Rollenwahl.
- Sprachmodell läuft, Statusleiste ehrlich ("Rechner live, gerade viel los" statt "frei" bei Last).

Gleich:
- Schulleitungsseite: gleicher Inhalt, "laut Planung", Verantwortlicher Daniel Alisch, kein Ausdruck.
- Fachwörter in den Laboren, Seitenlänge bei "Genau lesen" (Stunde 1: 8162 Pixel).

Schlechter oder neu auffällig:
- Veraltete Aussagen auf der Seite: Stunde 1 sagt "drei Aufgaben, die auf ein Blatt passen", Handreichung sagt "Eine DIN-A4-Seite" und "Aufgaben kopieren", die PDFs haben aber drei Seiten.

## 3. UX- und UI-Befunde

### Blocker
Keine.

### Hoch
1. **Lizenz offen.** Jedes Arbeits-, Lösungs- und Elternblatt zeigt rechts im Kopf "Lizenz: noch festzulegen" (arbeitsblatt-1-1.png, elternabend-infoblatt-1.png). Ich weiß nicht, ob ich kopieren, an Kolleginnen weitergeben oder in der Schul-Cloud ablegen darf.
2. **Einzelstunde und Doppelstunde sind nur im Lösungsblatt erklärt.** Das Arbeitsblatt hat 3 Seiten: Seite 1 Aufgaben (20 Minuten), Seite 2 Quiz und Nachdenken, Seite 3 Merksatz, Zusatz, Operatortabelle (arbeitsblatt-1-1/2/3.png). Im Kopf steht "Aufgaben 20 Minuten, mit Quiz und Nachdenken eine Doppelstunde". Erst das Lösungsblatt sagt: Einzelstunde reicht der Zeitplan oben, Quiz und Nachdenken als Hausaufgabe (loesung-1-1.png). Auf der Download-Karte und beim Drucken steht das nicht. Ich drucke sonst 28 mal 3 Seiten (84 Seiten), obwohl ich in der Einzelstunde nur Seite 1 brauche. Vorschlag: Karte "Einzelstunde: Seite 1, Quiz als Hausaufgabe Seite 2" und zwei kleine Zusatzknöpfe.
3. **Doppelstunden-Zeit passt nicht ganz zum Blatt.** Das Blatt sagt "Aufgaben 20 Minuten", der Doppelstunden-Plan gibt dafür 30 Minuten (Erarbeitung 30, loesung-1-1.png). Das erklärt das Blatt nicht. Dazu kommen 7 Gruppen im Prompt-Werkstatt-Teil: In meinem Test lagen 60 Sekunden Warteschlange vor der Antwort, in der Einzelstunde sind für die Station 8 Minuten vorgesehen. Ein Hinweis "wenn nicht alle drankommen: Aufgabe 3 als Hausaufgabe oder Vorabbeispiele" fehlt.
4. **Schulleitungsseite beantwortet nicht die erste Frage.** "Hosting: Weiterleitung laut Planung" und kein Satz zu Auftragsverarbeitung (05-schule-schulleitung.png, Text). Keine PDF-Kurzfassung, obwohl es für Eltern eines gibt. Eine Lehrerin kann das so nicht in die Schulleitung tragen.

### Mittel
5. **Prompt-Werkstatt passt nicht zur Aufgabe.** Arbeitsblatt Aufgabe 3 verlangt "eine Aufgabe aus dem Alltag" (arbeitsblatt-1-1.png). Die Werkstatt bietet fünf Büro-Aufgaben: Mail an einen Kunden, Protokoll zusammenfassen, Angebote vergleichen, Anfragen sortieren, Text einfach erklären (12-prompt-werkstatt.png). Nur die letzte passt für Klasse 8. Die Beispielantwort enthielt zudem "Montag, den 18.." und "40 Ordner und 2 Regalen" (ein Rechtschreibfehler und eine Zahlenform, die auffällt).
6. **Menü "Für dich" ist unvollständig.** Es fehlen Info Schulleitung, Info Eltern, Schule: Einstieg (02-start-lehrende.png). Wer von dort Aufgabe 3 sucht, muss "Alle Bereiche" öffnen oder auf der Startseite scrollen (die Karte liegt in der vierten Reihe, unter dem Falz bei 768 Pixeln).
7. **Suche kennt Alltagswörter nicht.** "Doppelstunde", "Stundenplanung", "drucken" liefern "Dazu habe ich nichts gefunden"; "PDF" liefert nur RAG-Seiten, nicht die Arbeitsblätter. "Arbeitsblatt", "Lösungsblatt", "Schulleitung", "Elternabend", "Kartenset" funktionieren.
8. **Lesezeit widerspricht sich.** Startseite: Karte "ca. 5 Min Lesen"; Seite im Kurzmodus: "ca. 1 Min Lesen" (03-schule-stunde-1.png gegen 06-ki1-mit-rolle.png). Dazu Kurz oder Genau lesen: bei Rolle "Ich unterrichte" steht "Genau lesen" schon an, Seite 8162 Pixel lang.
9. **Seitenumbruch im Arbeitsblatt Medien 1.** Die Überschrift "Quiz: Was hast du verstanden?" mit Erklärzeile steht unten auf Seite 1, die Fragen beginnen oben auf Seite 2 (arbeitsblatt-medien-1-1.png, -2.png). In KI 1 beginnt Seite 2 sauber mit dem Quiz, das Problem trat nur in Medien 1 auf.
10. **Kartenset: 12 Karten, 2 Seiten.** Für 7 Gruppen sind 14 Seiten zu drucken, ohne Hinweis "farbig, einseitig". Karten haben Rahmen zum Ausschneiden, die Fotos sind gut (bildkarten-echt-oder-ki-1.png). Die Auflösung steht nur im Lösungsblatt, gut.
11. **Dunkelmodus.** Fokusring im Menü dünn und dunkelblau auf dunkel (14-dunkel-fokus.png), schwer zu sehen.

### Klein
12. Download-Karten in der Handreichung sechsmal untereinander, ohne Trennung nach Stunde (04-schule-lehrkraefte.png). 
13. In Medien 1 steht das Kartenset als dritte Karte allein in einer Zeile mit Leerraum rechts, Titel bricht um (13-dunkel-medien1.png). Auf Elternabend brechen "Leitfaden und Fragen für Lehrkräfte" um, die Karten werden ungleich hoch (15-dunkel-elternabend.png).
14. Namen uneinheitlich: Menü "Medien 1: Echt oder KI?", Seitentitel "Medien-Einheit 1: Echt oder KI? Bilder sortieren und begründen", Blatt "Arbeitsblatt Medien 1". Menü "KI 1: Was ist KI?", Seitentitel "KI 1: Was ist KI? Erkennen, Lernen, Entscheiden".
16. Willkommens-Fenster: Kachel "Ich bin Schüler:in" ist höher als die anderen, weil ihr Zusatzsatz mehr Zeilen braucht (01-willkommen.png).
17. Startseite-Titel "Für morgen im Unterricht" und gleich darunter die Zwischenüberschrift "Für morgen": doppelt (02-start-lehrende.png).
18. Leerzustand Punkte-Labor: graue leere Fläche mit Hinweis darunter, nichts Einladendes (10-ml-labor.png). Auf 768 Pixeln Höhe ist das Spielfeld nur zur Hälfte sichtbar, wenn der Regler im Blick ist (11-ml-punkte.png).
19. QR-Codes und Links in den Blättern zeigen auf ki-labor.daniel-alisch.site (öffentliche Domain), nicht auf eine Schuladresse. Ob das Schulnetz die Domain öffnet, steht nirgends.

### Was auf den Blättern gut ist
- Kopf mit Name, Datum, QR-Code, Zeit, Niveau-Symbolen und Selbsteinschätzung (arbeitsblatt-1-1.png).
- Schriftgröße und Zeilenabstand gut lesbar, schwarzweiß druckbar, A4, saubere Schreiblinien (2 Zeilen je Aufgabe sind für Klasse 8 knapp, bei Aufgaben mit "Beurteile und entwickle" zu wenig).
- Lösungsblatt: Zeitplan 45 Minuten, Zeitplan 90 Minuten (10+30+10+15+15+10 = 90), Hinweise zu Aufgaben, Quiz-Lösungen, Differenzierung, Hilfekarten zum Ausschneiden, Tafelbild, Reflexionsfragen (loesung-1-1/2/3.png).
- Elternabend: Infoblatt in Sie-Form auf einer Seite, Leitfaden mit Gesprächszeit und Fragen/Antworten.

## 4. Zielaufgaben

1. **Material für 45 Minuten:** gelöst. Willkommens-Fenster, "Ich unterrichte", Karte "KI 1: Was ist KI?", fertig: 2 Klicks, ca. 15 Sekunden bis zur Seite (Ladezeit der Seite 0,4 bis 1,1 Sekunden). Seite hat Zeitplan, Labor-Links, Quiz, Differenzierung, Download. Vorbereitung in 10 Minuten realistisch, wenn ich vorher Punkte-Labor und Prompt-Werkstatt einmal ausprobiere.
2. **Arbeitsblatt zum Ausdrucken:** gelöst, 3 Klicks (Rolle, KI 1, "Herunterladen"), ca. 20 Sekunden. Download-Klick liefert "ki-labor-arbeitsblatt-stunde-1.pdf", 273 KB, 3 Seiten A4. Lücke: keine Aussage, was ich für die Einzelstunde drucken soll (Befund 2) und keine Lizenz (Befund 1). Lösungsblatt ebenfalls vorhanden.
3. **Datenschutz für die Schulleitung:** gelöst mit Einschränkung. Startseite, Karte "Info Schulleitung" nach Scrollen, 2 Klicks, ca. 30 Sekunden (Suche "Schulleitung" ebenfalls 2 Klicks). Brauchbar: kein Konto, keine Namen, Cookie kl_s, "Die Schule klärt die Rechtsgrundlage". Nicht brauchbar: Hosting "laut Planung", kein Vertrag, kein PDF zum Mitnehmen (Befund 4).

## Einzel- und Doppelstunde: taugen die Blätter?

- **Einzelstunde (45 Minuten):** Ja, mit Aufwand. Der Zeitplan auf der Seite und im Lösungsblatt ist stimmig (5, 20, 10, 10). Ich drucke Seite 1 (Aufgaben), gebe Quiz und Nachdenken als Hausaufgabe (Seite 2). Seite 3 (Merksatz, Zusatz, Operatoren) fällt weg oder wird zur Tafel. Das erfahre ich erst im Lösungsblatt, nicht auf der Download-Karte. Die Aufgaben 1 bis 3 mit Zeitangaben (12 plus 8 Minuten) bleiben im Rahmen, solange die Stationen nicht warten (Prompt-Werkstatt: Warteschlange bei 7 Gruppen).
- **Doppelstunde (90 Minuten):** Ja, gut. Der Plan im Lösungsblatt (Einstieg 10, Aufgaben 30, Quiz 10, Sicherung 15, Nachdenken 15, Abschluss 10) nutzt alle drei Seiten, Seite 2 (Quiz, Nachdenken) und Seite 3 (Merksatz, Zusatz) passen genau dort hinein. Das Blatt ist für die Doppelstunde eigentlich gebaut, die Einzelstunde ist die Kurzfassung.
- **Medien-Einheiten (ohne Gerät):** Medien 1 braucht nur Kartenset und Blatt, das ist für Einzelstunde und Doppelstunde bei schwachem WLAN die sicherste Wahl.
- **Zusammenfassung:** Das Material taugt für beide Fälle. Es fehlt eine deutliche Wahl "Einzelstunde" oder "Doppelstunde" auf der Seite und ein Druckhinweis.

## 5. Empfehlung

Ja, ich würde es an Kolleginnen weitergeben: Es gibt pro Einheit ein Blatt, eine Lösung mit Plan für Einzel- und Doppelstunde, ohne Anmeldung und ohne Kamera, und ich bin in zwei Klicks beim Material. Prüft vorher die Lizenz auf den Blättern, ob die Schule die Adresse öffnen kann, und haltet für die Prompt-Werkstatt einen Plan B bereit.

Die drei größten Lücken Richtung 10:
1. **Lizenz und Weitergabe klären:** "Lizenz: noch festzulegen" im Kopf aller 20 Blätter ersetzen (zum Beispiel CC BY 4.0 mit Namensnennung), Satz "Darf kopiert und verteilt werden" auf die Download-Karten.
2. **Einzel- und Doppelstunde sichtbar trennen:** Download-Karte mit "Einzelstunde: Seite 1 und 2" und "Doppelstunde: alle 3 Seiten", Blattköpfe angleichen (20 oder 30 Minuten), veraltete Sätze ("auf ein Blatt", "Eine DIN-A4-Seite") korrigieren, Suche um "Doppelstunde", "Stundenplanung", "drucken" erweitern.
3. **Schulleitung und Stationen absichern:** Hosting-Satz mit festen Aussagen (Standort, Vertrag, Löschfrist) und ein Ein-Seiten-PDF für die Schulleitung, Info Schulleitung ins Menü "Für dich", Prompt-Werkstatt mit Alltagsbeispielen für Klasse 8 und einem Plan B für Wartezeiten bei 7 Gruppen.

## Nicht geprüft
Kamera-Labore (im Schulpfad bewusst aus), Screenreader, echtes Schul-WLAN, Ausfall des Sprachmodells (lief diesmal), Quizseiten in den Lektionen (nur die Quiz auf den PDFs), Video neu abspielen.
