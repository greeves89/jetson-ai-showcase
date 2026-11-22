# Prüfbericht Jana (26, Data-Analystin, Laptop 1440x900), Runde 4

Getestet am 22.11.2026 gegen https://192.168.178.83:8443, headless Chromium, Viewport 1440x900. Erstbesuch mit Willkommens-Fenster (Rolle "Ich arbeite in der IT"), danach Hell und Dunkel. Eine Sprachmodell-Anfrage (Chat), ein Einbettungsaufruf, ein Tokenizer-Lauf. Screenshots in `docs/runde4/jana-bilder/` (18 Stück, alle mit dem Read-Werkzeug angesehen). Ein Bild (19) zeigt einen verschobenen Seitenrahmen, vermutlich durch mein Skript verursacht (siehe Befund K3).

## Gesamtnote: 8,7 von 10

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit | 9 | Kurze Sätze, Fachwörter wie Kosinus oder Token werden an Alltagsbildern erklärt (Stadtplan, Eissorten), Formel und Zahlenbeispiel optional (04, 05) |
| 2 | Einstieg und Führung | 9 | Willkommens-Fenster mit sechs Rollen, IT-Startseite mit "Selbst aufbauen", "Hardware", "Modelle und Lizenzen", Repo-Link (01, 02) |
| 3 | Lernwirkung | 9 | Drei-Sätze-Test bestanden (siehe Aufgabe 1), Quiz mit Begründung je Antwort (17) |
| 4 | Motivation und Spaß | 8 | Bedeutungskarte mit eigenem Satz ist ein echtes Erfolgserlebnis (07); der Chat-Lauf ist lang (12) |
| 5 | Labore und Interaktion | 9 | Karte, Tokenizer und Chat funktionieren, ehrliche Rückmeldung auch bei Fehlschlag (siehe Aufgabe 1 und 3) |
| 6 | Videos | 8 | Dauer 2:45, Kapitelliste mit Zeitmarken, Untertitel-Schalter, Hinweis, was der Verweis am Ende meint (04). Ich habe die Videos nicht abgespielt, Note vorläufig |
| 7 | Navigation und Orientierung | 8 | Suche zeigt Glossar plus Textauszüge (14); "Kontextlänge" findet nichts (13) |
| 8 | Vertrauen und Sicherheit | 9 | Altersangabe, "Antwort eines KI-Modells. Sie kann falsch sein", Built with Llama, Lizenztabelle (01, 12) |
| 9 | Barrierefreiheit | 9 | Sprunglink als erster Tab-Stopp, sichtbarer Fokusrahmen (15), Dunkelmodus gut lesbar (08, 16) |
| 10 | Fehlerfälle | 9 | Leerer Chat: "Schreib zuerst eine Frage." (10); 404 mit Startseite und Suche (18); Ladehinweis mit Sekundenzähler (11) |

Weiterempfehlen: ja, an Kolleginnen, die KI-Grundlagen mit nachvollziehbaren Zahlen wollen. Die Seiten sagen offen, wo das Modell irrt, und das Labor führt es im Chat vor.

## Zielaufgaben

1. **Embeddings erklären und Labor ausprobieren: gelöst.** Weg A (Suche): Feld "Seiten suchen", "Embedding" tippen, Treffer "Embeddings" anklicken, 2 Aktionen, etwa 5 Sekunden. In der Suche steht zuerst eine Glossarerklärung und danach die Seiten mit Textauszug (14). Weg B (Menü): Alle Bereiche, Wissen und RAG, Embeddings, 3 Klicks. Labor: Abschnitt "Ausprobieren", eigenen Satz ("Mein Auto springt morgens nicht an.") in das Feld, "Einbetten", Ergebnis nach höchstens 8 Sekunden (07). Ergebnis: Punkt 1 auf der Karte, fünf Nachbarn mit Kosinuswerten 0,76 bis 0,69. Die Live-Erklärung nennt ehrlich, dass der Satz zwischen Themen liegt und dass die Karte nur eine zweidimensionale Skizze ist. Meine Erklärung in drei Sätzen, nur aus der Seite: Ein Embedding-Modell macht aus einem Text eine Liste von 768 Zahlen. Ähnlicher Sinn liegt meist nah beieinander, gemessen mit dem Kosinus, also der Richtung der Vektoren. Dokumente und Fragen brauchen dasselbe Modell, und bei Zahlen, Codes und Eigennamen ist die Methode schwach.
2. **Modell, Kontextlänge, Grenzen: gelöst, aber auf drei Seiten verteilt.** Modell: Chat-Seite zeigt "llama3.2:3b" (12); Lizenzen nennen Llama 3.2 3B, nomic-embed-text, Whisper base, Thorsten-Stimme. Kontextlänge: nur auf "Hardware" (Abschnitt "Das Sprachmodell, das hier läuft"): Modell gebaut für 131 072 Token, im Labor auf 4096 eingestellt, Q4_K_M, q8_0-Cache. Die Seite "Wie ein Sprachmodell gebaut ist" sagt dagegen nur "hängt vom Modell und von der Einstellung ab" und bietet 128.000 als Beispielfenster. Grenzen: Seite "Grenzen" (Halluzination, Stichtag, Prompt-Injection, Kosten, Prüfpflicht) und der Chat selbst. Rund 4 Klicks, etwa 60 Sekunden, mit Suche "Kontext" statt "Kontextlänge" (siehe M1).
3. **Zwei fachliche Aussagen prüfen: beide richtig, ich fand keinen Fachfehler.** Geprüft habe ich vier:
   - Hardware: "Llama 3.2 mit 3,2 Milliarden Parametern, bis 131 072 Token Kontext gebaut, im Labor 4096". Stimmt mit der Modellkarte (3,21 Mrd., 128K).
   - Embeddings, "Mit Mathe": `a = (1,2,2)`, `b = (2,1,2)`, `a·b = 8`, `‖a‖ = ‖b‖ = 3`, `cos = 8/9 ≈ 0,889`; Abstand `√2 ≈ 1,414`; bei Länge 1 gilt `‖a − b‖² = 2 − 2·cos`. Alles nachgerechnet, korrekt. Die Aussage "Skalarprodukt gleich Kosinus bei normierten Vektoren" stimmt ebenfalls. Der Speicherbeispielwert 1 Mio · 768 · 4 Byte ≈ 3,07 GB stimmt.
   - Sprachmodelle: "Zahlen werden in Blöcke von höchstens drei Ziffern geschnitten, Wortschatz 128.256". Im Tokenizer-Labor bestätigt: "2025" wird zu "202" und "5", "Hausratversicherung" zu sechs Stücken (08), Wortschatzgröße passt zu Llama 3.
   - Chat: Die Seite kündigt an, das Modell halte den Jetson für eine Zeichentrickserie. Live bestätigt (12), inklusive erfundener Episodentitel. Das ist keine Seiten-, sondern eine Modellaussage, und sie belegt die Grenzen-Seite.
   Kleine fachliche Nuance (siehe K2): Das Quiz fragt, warum der Kosinus "oft besser als der reine Abstand" sei. Die Seite selbst sagt, dass beide bei normierten Vektoren dieselbe Reihenfolge ergeben. Die Quizantwort ist für unnormierte Vektoren richtig, die Frage lässt das offen.

## Befunde

### Blocker
Keine.

### Hoch
Keine.

### Mittel
- **M1: Suche kennt "Kontextlänge" nicht.** Startseite, Suchfeld. "Kontextlänge" und "context window" liefern 0 Treffer mit der Meldung "Dazu habe ich nichts gefunden" (13); "Kontext" findet 22 Seiten. Wer das deutsche Fachwort oder die englische Schreibweise nutzt, sieht nichts. Vorschlag: Synonyme "Kontextlänge", "Kontextfenster", "context window", "context length" auf "tokens-sprachmodelle" und "hardware" legen.
- **M2: Konkrete Kontextlänge des Labors steht nur auf der Hardware-Seite.** "Wie ein Sprachmodell gebaut ist", Abschnitt "Größe, kleine Modelle und das Kontextfenster": "hängt vom Modell und von der Einstellung ab", Tokenizer-Karte mit 128.000 Beispielwert. Die Chat-Seite nennt Modell und Größe, aber weder 4096 noch was bei Überschreitung passiert. Ein Verweis von Chat und Sprachmodelle auf den Hardware-Abschnitt würde Aufgabe 2 auf einen Klick verkürzen.
- **M3: Formel und Quellen erst nach "Mehr dazu" oder "Genau lesen".** Embeddings-Seite im Standardmodus "Kurz lesen": Kosinusformel und Zahlenbeispiel fehlen im sichtbaren Text, "Weiterlesen" ist eingeklappt (05). Der Hinweis zum Umschalten steht im Text, aber unscheinbar. Für Lesende mit Vorwissen wäre ein sichtbarer Hinweis "Formel: Genau lesen" am Abschnitt hilfreicher.
- **M4: Lesezeit-Angabe wirkt zu klein.** Embeddings-Seite, Kopf: "ca. 1 Min Lesen, plus Video 2:45, plus Labor ca. 3 Min" bei 9 Abschnitten und 5 Quizfragen (04). Die Sprachmodell-Seite mit vergleichbarem Umfang sagt "ca. 10 Min". Im Modus "Genau lesen" ist der Wert nicht zu erkennen. Die Zahl stimmt vermutlich nur für den Kurzmodus und sollte das benennen.
- **M5: Chat-Lauf dauert 53 Sekunden für eine einfache Frage.** Chat, Frage "Was ist ein Jetson?": 5,9 s bis zum ersten Token (Modell wurde geladen), danach 5,9 Tokens pro Sekunde, 314 Tokens (12). Der Wartehinweis ist gut ("Das Modell wird geladen, das dauert beim ersten Mal bis zu einer Minute. Bisher 4 s … Mit Stopp kannst du abbrechen.", 11) und der Abschlusstext erklärt die Zeit. Die Antwort ist lang für eine Lernseite; eine Kürzung per Beispielfrage ("in zwei Sätzen") wäre schneller und würde die Wartezeit senken. Der Rechner war zeitweise durch weitere Prüfer belastet (Seitenleiste "gerade viel los").

### Klein
- **K1: Karte mit Linien zu weit entfernten Punkten.** Embeddings, Labor, nach "Einbetten" (07): Die Verbindungslinien vom neuen Punkt führen zu weit gestreuten Punkten (Wetter, Büro). Die Live-Erklärung warnt davor, aber nur unterhalb der Karte. Ein kurzer Hinweis direkt unter der Karte ("Linien zeigen 768-dimensionale Nähe, nicht die Entfernung auf der Karte") würde Verwirrung vermeiden.
- **K2: Quizfrage 3 lässt die Normierung offen.** Siehe oben unter Aufgabe 3, "Teste dich".
- **K3: Seitenrahmen verschoben beim Scrollen per Skript.** Bild 19: Beim Anspringen der Überschrift "Weiterlesen" mit `scrollIntoView` im Modus "Genau lesen" liegt der Rahmen um etwa 210 Pixel nach unten versetzt, darüber leere Fläche. Vermutlich Folge meines Skripts, nicht nachgestellt mit der Maus. Bitte bei Gelegenheit prüfen.
- **K4: "Noch nichts gelesen" ändert sich nicht.** Seitenleiste, Fortschrittsbalken bleibt auf allen Besuchen leer, solange "Lernfortschritt merken" aus ist. Ohne Hinweis wirkt das wie ein Defekt.
- **K5: Weiterlesen der Embeddings-Seite ohne Modellkarte.** Drei Aufsätze (Mikolov 2013, Sentence-BERT 2019, RAG 2020), aber nicht das im Labor benutzte nomic-embed-text; die Modellkarte steht nur auf "Lizenzen und Quellen".
- **K6: Alternative Antwortreihenfolge im Quiz wechselt bei jedem Laden.** Gut gegen Raten, kann aber beim Wiederholen irritieren. Kein Fehler.

## Hell und Dunkel, Tastatur, Typografie
Beide Themen sauber, Kontrast im Dunkelmodus gut (08, 16, 17), Quizzustände nutzen Text plus Farbe ("Deine Wahl, falsch", "Richtig"). Tab: erster Stopp "Zum Inhalt springen", dann Suche, dann Menü; Fokusrahmen deutlich (15). Typografie ruhig, Abstände gleichmäßig, Zeilenlänge angenehm. Konsolenfehler: keine.

## Empfehlung
Das Labor ist für Einsteigerinnen mit Datenhintergrund fachlich sauber und ehrlich, die Embeddings-Seite samt Karte ist das Stück, das ich Kolleginnen schicken würde. Vor einer 9 fehlen vor allem Auffindbarkeit (Synonyme, Verweise auf die Kontextlänge) und ein sichtbarer Weg zu Formel und Quellen.

## Die drei größten Lücken Richtung 10
1. **Auffindbarkeit der Fachbegriffe:** Synonyme in der Suche (Kontextlänge, context window) und ein Verweis zwischen Chat, Sprachmodell-Seite und Hardware-Abschnitt mit den 4096 Token.
2. **Tiefe auf Wunsch sichtbar:** Formel, Quellen und Modellkarte am Abschnitt anzeigen oder deutlich auf "Genau lesen" verweisen; Lesezeit je Modus angeben.
3. **Wartezeit im Chat kürzen und rahmen:** kürzere Beispielantworten, sichtbare Geschwindigkeitsangabe schon beim Laden, und nach der Jetson-Halluzination ein direkter Hinweis "Das ist erfunden: prüfe es".
