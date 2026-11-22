# Prüfbericht Runde 5: Lotte, 14, Klasse 8, iPhone SE (375x667)

Geprüft am 23.11.2026 gegen https://192.168.178.83:8443, headless Chromium, Viewport 375x667, Hell und Dunkel. 34 Screenshots in /tmp/r5-lotte/ (nicht im Repo), alle angesehen. Zwei PDFs per pdftoppm geöffnet, eine Druckansicht per page.pdf() erzeugt. Eine Sprachmodell-Anfrage gestellt, nicht wiederholt.

## Gesamtnote: 8,2

| Kriterium | Note | Beleg in einem Satz |
|---|---|---|
| 1 Verständlichkeit fürs Alter | 8,5 | Kurz-Lesen-Modus, "Ein Prompt ist deine Frage an die KI", Alltagsbeispiele; Chat-Antwort und Ausfall-Karte dagegen länger |
| 2 Einstieg und Führung | 8,5 | Rollenwahl, Schüler-Startseite mit "Zum Ausprobieren" sofort klar; Willkommens-Fenster füllt das ganze SE-Display |
| 3 Lernwirkung | 8,0 | Prompt-Seite mit Dreischritt-Grafik, Quiz mit Sofort-Feedback; der Chat im Labor liefert ein schlechtes Beispiel |
| 4 Motivation und Spaß | 8,5 | "Echt oder KI?" ist ein echtes Spiel mit Punktestand und Foto-Auflösung |
| 5 Labore und Interaktion | 7,5 | Spiel stark; Chat: Eingabe weit unten, 54 s bis zur Antwort, Antwort inhaltlich schwach |
| 6 Videos | 8,0 | Untertitel an, Kapitelsprung funktioniert; 2:31 lang, Bildtext im Video auf dem SE sehr klein |
| 7 Navigation und Orientierung | 8,5 | Suche, Menü, Zurück-Taste, "Begriff erklärt" bei Suche; Enter in der Suche öffnet nichts |
| 8 Vertrauen und Sicherheit | 8,5 | Hinweise zu Kamera, 16+, Hausaufgaben und "Antwort kann falsch sein" klar; "Ab wann? ... kein Alterscheck" ist Fließtext in der Fußzeile |
| 9 Barrierefreiheit und Bedienbarkeit | 7,5 | Prompt-Beispiele laufen waagerecht aus dem Bild; mehrere Text-Links nur 16 bis 18 px hoch |
| 10 Fehlerfälle | 9,0 | Ausfall-Karte mit "Das liegt nicht an dir", Selbst-Wiederholung, 404 mit Auswegen, leere Eingabe mit Hinweis |

Würde ich es weiterempfehlen? Ja, an Mitschüler, vor allem wegen "Echt oder KI?". Den Chat würde ich nicht als Erstes zeigen.

## Befunde

### Blocker
Keine.

### Hoch
1. **Gute Beispiel-Prompts sind auf dem Handy nicht lesbar.** Seite "Gute Fragen stellen, mit Schulbeispielen" (/#/prompts-schule), Modus "Genau lesen", Abschnitt Aufgabe 1 bis 3, Kästen "Guter Prompt". Der Text steht in einer einzigen Zeile (`white-space: pre`), der Kasten ist 343 px breit, der Inhalt 1808 px (Aufgabe 1), 1671 px (Aufgabe 2), 2058 px (Aufgabe 3). Man sieht nur "Ich halte ein Referat über Windkraft, 5 M" und muss seitlich wischen. Das ist genau der Lerninhalt der Seite ("zum Kopieren"). Der schlechte Prompt passt in die Zeile, der gute nicht, der Vergleich geht verloren. Screenshot 32-aufgabe1-genau.png, 33-prompt-scroll.png. Kopieren funktioniert, lesen nicht.
2. **Druckansicht im Modus "Kurz lesen" enthält die Beispiele nicht.** /#/prompts-schule per `emulateMedia print`: 3 Seiten, aber die aufgeklappten Inhalte ("Mehr dazu", die Beispiel-Prompts) fehlen, es bleiben nur die Kernsätze und das Quiz (pdftotext geprüft). Die Seite verspricht "zum Kopieren", der Ausdruck enthält nichts zum Kopieren. Datei druck-1.png.

### Mittel
3. **Chat-Eingabe liegt eine Bildschirmhöhe unter dem Seitenanfang.** /#/chat: Das Textfeld beginnt bei etwa 880 px Seitenhöhe, davor "Modell laden", Tag-Zeile und Erklärtext. Wer von "Starten" kommt, sieht oben ein "Modell laden"-Feld und muss suchen. Screenshots 11-chat.png, 12-chat-eingabe.png.
4. **Chat-Antwort im Test falsch und verwirrend.** Frage "Was ist ein Prompt? Erkläre es mir kurz für die 8. Klasse." Antwort: "...eine kurze Anleitung oder Frage, die jemanden auffordert, etwas zu tun oder zu erfinden", dazu der Satz "Ich habe jetzt meine Antworten aufgezeichnet". Das Labor warnt ehrlich darunter ("Das kleine Modell irrt bei Erklärungen zur KI oft", Link auf Tokens-Seite, "Woran würdest du merken, dass das falsch ist?"). Für Lotte wirkt das, als sei sie schuld. Pädagogisch gut gelöst, aber der Konflikt Frage ("Was ist ein Prompt") gegen schwaches Modell bleibt. Screenshot 14-chat-fertig.png.
5. **Wartezeit im Chat: nur "bis zu einer Minute", keine echte Schätzung.** Ablauf: 1,5 s "Das Modell wird geladen ... Bisher 1 s", bei 10 s Ausfall-Karte "Dem Jetson fehlt gerade freier Speicher ... Das liegt nicht an dir", Countdown "Ich versuche es in 16 Sekunden automatisch noch einmal, genau einmal", Antwort nach insgesamt 54 s (162 Token in 26,3 s). Die Karte ist freundlich und hat einen Knopf "Noch einmal versuchen", aber die Wartezeit insgesamt war nicht absehbar. Für eine Vierzehnjährige in der Pause zu lang. Screenshots 13-chat-1500.png, 13-chat-10000.png, 13-chat-20000.png.
6. **Willkommens-Fenster auf dem SE zu hoch.** /?willkommen=1: sechs Karten, davon die erste mit vier Zeilen Zusatztext ("Kamera, Mikro und Gesicht ab 16, im Schulpfad nicht nötig."), dazu Schalter "Meinen Lernfortschritt ... merken" und "Später entscheiden". Nichts davon passt auf einen Bildschirm, "Später entscheiden" und der Datenschutz-Satz erst nach Scrollen im Fenster. Das Schließen-X oben rechts ist da, Escape schließt auch. Für jemanden, der ungern liest, viel Text vor dem ersten Klick. Screenshots 01, 03.
7. **Quiz-Antwortfelder haben auf dem Handy einen kleinen, ausgegrauten Radio-Punkt über dem Text.** /#/prompts-schule, "Teste dich": Das Auswahlkreischen (13x13 px) steht allein in einer Zeile über der Antwort, wirkt deaktiviert. Die ganze Karte (295x97 px) ist klickbar und gibt sofort Rückmeldung (grün mit "Richtig."), also kein Bedienproblem, aber unklar gestaltet. Screenshots 28-quiz.png, 28b-quiz-gewaehlt.png.

### Klein
8. **Enter in der Suche tut nichts.** Startseite, "Prompt" getippt, Enter: Die Suche schließt, die Startseite erscheint, kein Treffer wird geöffnet. Die Treffer selbst sind sehr gut ("Begriff erklärt: Prompt" ganz oben). Screenshots 05, 06.
9. **Kleine Links.** "Lizenzen und Quellen" 16 bis 18 px hoch, "Mehr dazu" im Chat 17 px hoch, Quellen-Links im Fließtext 18 bis 20 px. Unter 40 px, auf dem SE schwer zu treffen (Messung per getBoundingClientRect, Seiten Start, /#/echt-oder-ki, /#/chat, /#/prompts-schule).
10. **Symbol-Verwechslung.** In den Suchergebnissen hat "Quellen prüfen" ein Häkchen-Symbol. Das Labor nutzt das Häkchen sonst für "schon gelesen" (Fortschritt "Noch nichts gelesen" steht direkt darüber). Screenshot 19-suche-referat.png.
11. **Video-Bild auf dem SE klein.** Die Folien im Video (Schrift im Bild, "Echt oder KI?" oben links) sind bei 343 px Breite kaum lesbar, Vollbild nötig. Untertitel sind standardmäßig an, das hilft. 31-video-laeuft.png.
12. **Ergebnisseite von "Echt oder KI?" hat viel Text.** Nach 12 Karten steht "8 von 12 richtig", dann ein vierzeiliger Absatz ("Herkunft prüfen schlägt Hinsehen: ...") und drei Zusatzknöpfe. Für Lotte würde ein Satz reichen. 18-spiel-ende.png.

### Was gut ist (zur Einordnung)
- Schüler-Startseite (04-start-schueler.png): Überschrift "Experimente, leicht erklärt", Karten "OHNE KAMERA", Zeitangaben ("ca. 1 Min Lesen"), Hausaufgaben-Satz gleich oben.
- Kurz lesen / Genau lesen: 431 gegen 800 Wörter auf der Prompt-Seite, ohne Seitenwechsel. Das passt genau auf "liest ungern".
- Dunkelmodus (24, 25, 26, 27): Kontrast gut, Warntext "Schreib zuerst eine Frage." gut lesbar. Kein waagerechter Überlauf auf Start, Chat, Echt oder KI, Referat, Karte (alle 0 px).
- Tastatur: Fokus startet im Willkommens-Fenster auf dem Titel, Tab geht durch die Karten, Escape schließt und stellt den Fokus auf die Seite.
- Karten-PDF "Echt oder KI?" (2 Seiten A4, 2,2 MB, Bilder sauber, "Stand 22.11.2026") und Arbeitsblatt Medien 1 (4 Seiten, Namensfeld, Hakenkästchen, QR-Code) sind druckfähig; 0,1 s Ladezeit.
- Konsolenfehler und fehlgeschlagene Anfragen in allen Läufen: keine.

## Zielaufgaben

1. **Was ist ein Prompt, im Chat probieren.**
   - Erklärung: Startseite, Suche antippen, "Prompt" tippen: 2 Klicks, etwa 5 Sekunden bis zur Kurzerklärung "Begriff erklärt: Prompt. Die Eingabe an ein Sprachmodell ...". Dritter Klick auf "Gut fragen" bringt die Prompt-Werkstatt mit Dreischritt-Grafik. Etwa 15 Sekunden.
   - Chat: Von der Schüler-Startseite Karte "Chat" mit "Starten", dann zum Textfeld scrollen (etwa 880 px), Frage tippen, "Senden". 3 Klicks plus Scrollen und Tippen, etwa 25 Sekunden bis zum Absenden. Antwort nach 54 Sekunden, davon etwa 20 Sekunden Ausfall-Karte mit automatischer Wiederholung.
   - Erreicht, aber der Chat belohnt sie schwach (Befund 4, 5).
2. **"Echt oder KI?" spielen und Treffer zählen.** Schüler-Startseite, Abschnitt "Empfohlen für dich", "Öffnen": 2 Klicks, dann zum Spielfeld scrollen. 12 Karten, je ein Klick auf "Echt" oder "KI" und ein Klick auf "Weiter": 24 Klicks. Skriptlauf 12,6 Sekunden, ein Mensch braucht realistisch 2 bis 3 Minuten. Ergebnis beim Test: 8 von 12 richtig (Echte Fotos 4 von 6, KI-Bilder 4 von 6), die Zählung oben auf der Karte ("Karte 1 von 12, 1 richtig") lief mit. Die Foto-Auflösung nach jeder Karte mit Quelle ist sehr gut. Die Knöpfe sind 141x56 px, gut tippbar.
3. **Hilfe für ein Referat.** Suche, "Referat" tippen: 2 Klicks, etwa 5 Sekunden, erster Treffer "Referat. So wird dein Referat gut belegt." Seite "Für dein Referat über KI": Gliederung in sechs Teilen, Quellen (klicksafe, bpb), Zitieranleitung, Checkliste. Dritter Klick, etwa 10 Sekunden. Sehr gut gelöst, auf dem Handy gut lesbar.

## Empfehlung

Das Labor ist für eine Achtklässlerin spürbar gut gemacht: kurze Sätze, ein echtes Spiel, freundliche Fehlerkarten. Vor 8,5 müssen die zwei Lesbarkeits- und Druckfehler der Prompt-Seite weg (Beispiele umbrechen, Beispiele auch im Ausdruck) und der Chat auf dem Handy direkter werden.

## Die drei größten Lücken Richtung 10

1. **Beispiel-Prompts umbrechen lassen** (`white-space: pre-wrap` in den Prompt-Kästen auf schmalen Schirmen) und im Ausdruck immer mitdrucken, auch im Kurz-Modus (Befund 1, 2).
2. **Chat auf dem Handy: Eingabefeld direkt nach der Überschrift, kurze Zeitangabe statt "bis zu einer Minute", Beispielfrage zum Ausprobieren vorn** (Befund 3, 5), dazu eine Beispielfrage, bei der das kleine Modell gut antwortet.
3. **Weniger Text vor dem ersten Klick und am Ende der Spiele:** Willkommens-Fenster auf einen Bildschirm kürzen (Datenschutz-Satz einklappen), Spiel-Ergebnis auf einen Satz, Enter in der Suche öffnet den ersten Treffer, Text-Links mit größerer Tippfläche (Befund 6, 8, 9, 12).
