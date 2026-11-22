# Prüfbericht Runde 4: Dirk (38, Busfahrer, Handy, 15 Minuten Pause)

Testadresse https://192.168.178.83:8443, 22.11.2026. Ein headless Chrome, Viewport 390x844, Hell und Dunkel, Erstbesuch mit Willkommens-Fenster. Bilder in `docs/runde4/dirk-bilder/` (rund 30 Screenshots, die genannten alle angesehen, dazu eine PDF-Seite per `pdftoppm -r 60`). Zwei Sprachmodell-Anfragen gestellt (die erste brach ich mit dem Schließen des Browsers ab, die zweite lief durch). Keine Meldung "Zu viele Anfragen".

## Gesamtnote: 7,5 von 10

Für einen Menschen mit knapper Pause ist die Oberfläche auf dem Handy erstaunlich gut: kein Seitenüberlauf, große Touch-Ziele, klare Kacheln, Dunkelmodus sauber. Was bremst: Die versprochene Zeit (15 Minuten) hält der Weg nicht, der Chat braucht im Test über zwei Minuten und liefert eine sachlich falsche Antwort ohne Warnung zum Thema, und die Hilfe zum besseren Fragen ist auf Büro und Schule zugeschnitten, nicht auf den Alltag.

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit fürs Alter | 8 | Kurze Sätze, Merkkästen "Das nimmst du mit"; "Token", "Temperatur", "Kontextfenster" schon auf der dritten Seite (`genki`) |
| 2 | Einstieg und Führung | 8 | Willkommens-Fenster mit sechs klaren Kacheln, "Ich will KI verstehen" führt sofort zu "Empfohlen für dich" (1 Klick, 1,0 s) |
| 3 | Lernwirkung | 7,5 | Merksätze gut, aber Zeit pro Seite real länger als angegeben (Seite `daten` 1146 Wörter, Höhe 13.000 px bei `prompting`) |
| 4 | Motivation und Spaß | 8 | Bilderspiel steht ganz oben auf der Seite, Regler und Schieber laden zum Spielen ein |
| 5 | Labore und Interaktion | 6,5 | Chat: erstes Wort nach rund 65 s, Antwort fertig nach 130 s, 5,1 Token pro Sekunde |
| 6 | Videos | 7,5 | Video startet sofort, Kapitelliste, Untertitel; Schalter "Untertitel an/aus" mehrdeutig |
| 7 | Navigation und Orientierung | 8 | Suche findet "ChatGPT", "Prompt", "Pause", "Betrug" mit Begriffserklärung; Menü auf dem Handy aufgeräumt |
| 8 | Vertrauen und Sicherheit | 8 | "Ohne Anmeldung", Hinweis "Antwort kann falsch sein" an jeder Chat-Antwort |
| 9 | Barrierefreiheit und Bedienbarkeit | 8 | Kein Seitenüberlauf (390 von 390 px), Touch-Ziele fast alle über 44 px (Ausnahme "Built with Llama", 41 px hoch), Kontrast in Hell und Dunkel gut |
| 10 | Fehlerfälle | 8 | Leere Chat-Eingabe: "Schreib zuerst eine Frage."; unbekannte Adresse freundlich; Wartehinweis vorhanden, aber zu optimistisch |

## Befunde nach Schwere

### Blocker
Keine.

### Hoch
1. **Chat: Wartezeit weit über der Ansage.** Seite `chat`, Abschnitt "Live ausprobieren". Nach dem Senden stand nach rund 15 s: "Du bist als Nächster dran. Geschätzte Wartezeit: etwa 10 Sekunden." (`13b-chat-lauf.png`). Das erste Wort erschien erst nach rund 65 s, die ganze Antwort nach 130 s (333 Token, 5,1 Token pro Sekunde). Beim ersten Versuch (Modell nicht geladen) stand "Das Modell wird geladen, das dauert beim ersten Mal bis zu einer Minute. Bisher 8 s" (`13-chat-lauf.png`), erstes Wort nach rund 50 s. Einschränkung: Weitere Prüfer teilten sich den Jetson, die Warteschlange war also vermutlich echt. Trotzdem: Die Schätzung stimmte nicht, und für 15 Minuten Pause sind zwei Minuten Warten ein Drittel des Budgets. Der Hinweis sollte ehrlich "bis zu 2 Minuten" sagen und eine kurze Beispielfrage anbieten.
2. **Der Chat liefert zu einer Alltagsfrage eine falsche Antwort, ohne dass das Labor es aufgreift.** Frage: "Wie lange darf ich als Busfahrer am Stück fahren, bevor ich Pause machen muss?" Antwort: "keine einheitlichen Richtlinien", Tabellen mit 5 bis 8 Stunden, "EU-Vorschrift: nicht länger als 10 Stunden ohne Pausen", Regeln "je nach Landkreis" (`14b-chat-antwort.png`). Das ist falsch (EU-Regel: nach 4,5 Stunden Lenkzeit 45 Minuten Pause). Der Standardhinweis "Sie kann falsch sein, prüfe Wichtiges" steht da, aber ein Berufsfahrer, der Lenk- und Ruhezeiten falsch glaubt, bekommt ein echtes Problem. Es fehlt ein Lernmoment direkt unter der Antwort ("So prüfst du so eine Antwort: Quelle suchen, Behörde fragen"), der auf `quellen-pruefen` oder `llm-grenzen` verlinkt. Hier läge die beste Lerngelegenheit der ganzen Seite.
3. **"15 Minuten" wird nicht eingehalten und ist für Dirk nicht auffindbar.** Auf der Startseite heißt die Kachel "In 15 Minuten" mit dem Zusatz "Für Entscheider" und "Was KI einem Betrieb bringt". Ein Busfahrer erkennt sich darin nicht wieder. Die Kachel "Neu hier?" (3 Schritte, "ca. 3 Min Lesen, plus Video 2:40, plus Labor ca. 9 Min", also rund 15 Minuten) führt nach dem Klick auf "Hier anfangen" nicht auf eine Seite, sondern scrollt nur nach unten zu "Neu hier? So fängst du an" (`05-neuhier-0.png`). Erst der zweite Klick öffnet Schritt 1. Danach landet man im Pfad "Verstehen", der laut Startseite "9 Schritte, ca. 11 Min Lesen, plus Video 12:24, plus Labor ca. 27 Min" dauert, also rund 50 Minuten. Die Angabe der "Neu hier"-Kachel (14 Minuten) und der Pfad, in den sie führt, passen nicht zusammen.

### Mittel
4. **Hilfe zu "bessere Fragen an ChatGPT" ist auf Büro und Schule zugeschnitten.** Suche "Prompt" ergibt zuerst "Prompt-Werkstatt" und "Gute Fragen stellen" (Medienkompetenz, Schule), dann "Gut fragen" (Sprache). Die Seite `prompting` hat Beispiele "Mail an einen Kunden", "Protokoll zusammenfassen", "Angebote vergleichen" und ist auf dem Handy rund 13.100 px hoch (15 Bildschirme). Die Seite `prompts-fuer-schueler` nennt "Klasse 8", "Referat", "Nachhilfelehrer". Es gibt keine kurze Karte "Fünf Regeln für gute Fragen" mit Alltagsbeispielen (Reiseplan, Einkauf, Schreiben an eine Behörde, Krankenkasse). Für 15 Minuten Pause zu lang. Der Weg: Suche "Prompt" (2 Klicks, rund 8 Sekunden) bis zur Seite, dann Scrollen.
5. **Schalter "Untertitel an / Untertitel aus" ist mehrdeutig.** Seite `karte`, unter dem Video (`06-video.png`, `07-untertitel.png`): Im Ausgangszustand zeigte der Schalter "Untertitel an" und die Untertitel liefen sichtbar. Nach dem Klick steht "Untertitel aus" und die Zeile verschwindet. Das Label beschreibt den Zustand, liest sich aber wie die Handlung. Besser: "Untertitel einschalten" und "Untertitel ausschalten" oder einen Schalter mit sichtbarem Zustand.
6. **Chat-Seite: Eingabe liegt tief unter einem Textblock.** Auf dem Handy (`11-chat.png`) sieht man zuerst nur "Modell laden"; Eingabefeld und Beispielfragen erscheinen erst nach Scrollen. Wer die Pause im Stehen mit einer Hand nutzt, sucht den Anfang der Aufgabe. Die Beispielfragen ("Erkläre in zwei Sätzen, was ein Token ist", "Schreibe einen Satz über Roboter") sind technisch, keine Alltagsfragen.
7. **Video-Kapitelliste schiebt Inhalt weit nach unten.** Bei Seiten mit 6 bis 10 Kapiteln (`karte`: 6, `prompts-fuer-schueler`: 10) steht erst die Liste, dann "Ausprobieren". Die Zeile "Weitere Kapitel: nach unten scrollen" erklärt das, aber die Reihenfolge Video, Kapitelliste, Hinweise, Erklärung kostet auf dem Handy rund 1,5 Bildschirme, bevor der erste Inhalt kommt (`08-karte-teil0.png`).

### Klein
8. "Built with Llama" ist 41 px hoch (unter 44 px Touch-Ziel).
9. Die Zeile "Du liest gerade kurz: ..." wiederholt sich auf jeder Seite (rund 40 Wörter), nach dem ersten Mal überflüssig.
10. Auf `genki` Kandidatenliste "22,0 %" mit Komma-Null: unnötige Stelle für Laien.
11. Ein Vollseiten-Screenshot zeigte leere Karten (`08-karte-teil1.png`): Das ist ein Testartefakt (Inhalte erscheinen erst beim Scrollen), im echten Scrollen alles sichtbar (`09-begriffe-scroll.png`). Kein Seitenfehler.

## Was gut ist
- Willkommens-Fenster: sechs Kacheln, klare Texte, "Später entscheiden", Datenschutz-Satz am Ende (`01-erst.png`).
- Startseite auf dem Handy aufgeräumt, Zeitangaben je Seite, Hell und Dunkel gleich gut (`19-dunkel-start.png`).
- Suche mit Begriffserklärung vor den Seiten (`17-suche.png`).
- Leere Eingabe wird freundlich abgefangen (`22-leere-eingabe.png`).
- "Echt oder KI?" beginnt direkt mit dem Spiel, Tastaturhinweis steht dabei (`23-echt-oder-ki.png`); Kartenset-PDF öffnet sauber, 2 Seiten A4, lesbar (`25-pdf-bildkarten-1.png`).
- Quiz zu jedem Labor vorhanden (`daten`, 5 Fragen, Pfeiltasten und Enter).

## Zielaufgaben

1. **Das Wichtigste in 15 Minuten lernen.** Geschafft nur teilweise. Startseite, "Hier anfangen" (Scroll, 1 Klick), Schritt 1 "Verstehen, was KI ist" (2. Klick, 1,7 s). Danach "Weiter geht es" durch `karte`, `ml`, `genki`, `daten` in 4 weiteren Klicks (insgesamt 6 Klicks, rund 5 Sekunden Ladezeit gesamt). Lesen plus Video plus Labor laut Anzeige 14 bis 15 Minuten für die ersten drei Seiten, danach läuft der Pfad weiter (9 Schritte, rund 50 Minuten). Mein Fazit: In 15 Minuten kommt man durch `karte` (Video 1:24 und Merksätze), `falscher-anruf` und `chat`, aber das Labor lenkt nicht dorthin.
2. **Chat etwas aus dem Alltag fragen.** Geschafft. Frage zu Lenkzeiten. Erstes Wort nach rund 65 Sekunden, fertig nach 130 Sekunden, Antwort sachlich falsch (siehe Befund 2). Klicks von der Startseite: Suche oder Menü, Seite `chat`, Textfeld, Enter: 4 Aktionen, rund 12 Sekunden bis zur Frage.
3. **Bessere Fragen an ChatGPT.** Geschafft in 2 Klicks und rund 8 Sekunden (Suche "Prompt", "Gut fragen"). Inhalt gut (sechs Bausteine, Vorher/Nachher-Vergleich), aber zu lang und Beispiele nicht aus dem Alltag.

## Empfehlung
Als Weiterempfehlung an Kolleginnen und Kollegen: ja, mit einer Einschränkung. Wer 15 Minuten hat, sollte direkt `falscher-anruf`, `karte` und den Chat bekommen, und der Chat muss die Wartezeit ehrlich nennen und eine falsche Antwort als Lernmoment nutzen.

## Die drei größten Lücken Richtung 10
1. **Echter 15-Minuten-Weg für Berufstätige ohne Unternehmensbezug**, mit einer Startkachel, die genau diesen Weg öffnet (heute "Hier anfangen" scrollt nur, "In 15 Minuten" heißt "Für Entscheider").
2. **Chat ehrlich und lehrreich**: realistische Wartezeit ("bis zu 2 Minuten"), Alltags-Beispielfragen, nach jeder Antwort ein Prüfhinweis mit Link zu `quellen-pruefen`.
3. **Kurze Prompt-Karte für den Alltag** (eine Seite, fünf Regeln, drei Alltagsbeispiele) statt der Büro- und Schulseiten.
