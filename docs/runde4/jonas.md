# Prüfbericht Jonas (13, Klasse 8, Familien-PC 1920x1080), Runde 4

Getestet am 22.11.2026 gegen https://192.168.178.83:8443, headless Chromium, Viewport 1920x1080. Erstbesuch mit Willkommens-Fenster, dann Hell und Dunkel. Eine Sprachmodell-Anfrage. Screenshots liegen in `docs/runde4/jonas-bilder/` (alle mit dem Read-Werkzeug angesehen, mehr als 10).

## Gesamtnote: 8,4 von 10

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit fürs Alter | 8 | Kurze Sätze, Glossar-Treffer "Prompt" nutzt aber "Sprachmodell"; Chat-Antwort mit "Benutzer an einen Computer" |
| 2 | Einstieg und Führung | 9 | Willkommens-Fenster, Rolle "Schüler:in", Startseite mit sechs Karten (01, 02) |
| 3 | Lernwirkung | 8 | Spiel liefert nach jeder Karte "Woran du es sehen konntest" (05), Quiz erklärt jede Antwort (15) |
| 4 | Motivation und Spaß | 9 | Spiel mit Zähler, Ergebnis "8 von 12" mit Aufschlüsselung (06), "Noch einmal" |
| 5 | Labore und Interaktion | 8 | Chat läuft sauber, aber 21,3 s bis zum ersten Zeichen (17, 18) |
| 6 | Videos | 8 | Kapitelliste, Dauer sichtbar; Video nicht vollständig angesehen, Startbild schwarz (12) |
| 7 | Navigation und Orientierung | 8 | Suche findet "Prompt" sofort mit Erklärung (07); Quiz zum Labor schwer zu finden |
| 8 | Vertrauen und Sicherheit | 9 | Altersangabe und "nichts gespeichert" auf Startseite, im Spiel und im Ergebnis |
| 9 | Barrierefreiheit | 8 | Fokusrahmen sichtbar (21), Tastatur 1 und 2 im Spiel, Dunkelmodus gut lesbar (19) |
| 10 | Fehlerfälle | 8 | Echte 404-Seite unter /gibtsnicht; unbekannte Hash-Adresse landet still auf der Startseite (20) |

## Zielaufgaben

1. **"Echt oder KI?" durchspielen: gelöst.** Wege: Rolle Schüler:in, Menü "Echt oder KI?", scrollen, dann je Karte Antwort plus "Weiter". Rund 26 Klicks, mein Durchlauf mit Skript 40 s, ein Kind schätzungsweise 2 bis 3 Minuten. Ergebnis "8 von 12, Echte Fotos 3 von 6, KI-Bilder 5 von 6" mit Lernhinweis und Knopf "Noch einmal" (06).
2. **Was ist ein Prompt: gelöst, aber über Umwege.** Suche "prompt" liefert oben die Erklärung (2 Aktionen, unter 10 s, 07). Die Schüler-Lektion "Gute Fragen stellen" nennt das Wort "Prompt" nur einmal in einem Link ("Gut fragen: Prompts schreiben"). Die Karte "Prompt-Vergleich" auf der Schüler-Startseite führt zur Büro-Seite "Gut fragen: Prompts schreiben" mit Kunden-Mail und Angebotsvergleich (12). Über den Chat: Frage "Was ist ein Prompt?" gestellt, Antwort nach 43 s, korrekt, aber lang (18).
3. **Quiz zu einem Labor: gelöst, aber nicht auf dem naheliegenden Weg.** Punkte-Labor (`/ml`), Chat und Objekt-Labor haben kein Quiz. Quiz gibt es zum Beispiel auf "Gut fragen: Prompts schreiben" (5 Fragen). Von der Startseite: Karte "Prompt-Vergleich", scrollen, 5 Antworten, rund 8 Klicks. Sofortige Rückmeldung je Frage, am Ende "0 von 5 richtig" mit "Noch einmal" (15). Das Quiz ist aber thematisch für Büro-Erwachsene.

## Befunde

### Blocker
Keine.

### Hoch
- **H1: Schüler-Karte "Prompt-Vergleich" führt auf eine Büro-Seite.** Startseite Schüler, Abschnitt "Zum Ausprobieren". Ziel zeigt Vorlagen "Mail an einen Kunden", "Angebote vergleichen", "Kundendaten in einen Cloud-Chat" im Quiz (12, 14, 15). Für einen Achtklässler fremd. Es fehlt eine Schüler-Vorlage (Referat, Hausaufgabe).
- **H2: Quiz hängt nicht am Labor.** Punkte-Labor, Chat und Objekt-Labor haben kein Quiz; die Seiten mit Quiz sind andere Seiten. Wer "Labor, dann Quiz" erwartet, findet keins (Scan über 45 Seiten).

### Mittel
- **M1: Spielfläche liegt unter dem Falz.** Seite "Echt oder KI?", Abschnitt "Das Bilderspiel": bei 1080 Pixel Höhe sieht man nur "Karte 1 von 12" und die Bildoberkante (03). Antwortknöpfe erst nach Scrollen (04). Ein Sprungknopf "Spiel starten" im Seitenkopf fehlt, obwohl "Zum Ausprobieren" als Chip da ist.
- **M2: Chat: 21,3 s bis zum ersten Zeichen.** Während der Wartezeit steht nur "Du bist als Nächster dran. Gleich geht es los." und ein Stopp-Knopf (17). Das ist ehrlich, aber ohne Zeitangabe oder Erklärung, warum es dauert. Danach 4,5 Tokens pro Sekunde, 194 Tokens, also 43 s gesamt. Zur Einordnung: Rechner war gleichzeitig durch weitere Prüfer belastet.
- **M3: Chat-Antwort zu lang und zu fachlich für ein Kind.** "Ein Prompt ist eine Anweisung ... der von einem Benutzer an einen Computer ... gesendet wird" und "KI- und NLP-Forschung" (18). Beispiel-Vorschläge im Chat fragen nicht nach Alltagsdingen eines 13-Jährigen.
- **M4: "Prompt" wird auf der Schüler-Lektion nie erklärt.** Seite "Gute Fragen an die KI stellen": das Wort steht einmal in einem Verweis. Wer "Prompt" gehört hat, findet hier keine Gleichung "Prompt = deine Frage an die KI".
- **M5: Menüende abgeschnitten.** Seitenmenü bei geöffnetem Bereich "Medienkompetenz": letzter Eintrag unter der Statusleiste halb sichtbar (03).

### Klein
- **K1: Grammatikfehler** in der Schüler-Startseite, Karte "KI und Hausaufgaben": "Wann KI beim Lernen hilft und wann sie schummeln ist." (02).
- **K2: Seitenkopf zeigt "Medienkompetenz · " mit hängendem Punkt**, wenn keine Lektionsnummer folgt (03, 08).
- **K3: Unbekannte Hash-Adresse** (`/#/gibtsnicht`) zeigt still die Startseite ohne Hinweis (20); die Pfad-Adresse zeigt eine korrekte 404-Seite.
- **K4: Videofenster zeigt vor dem Start ein schwarzes Bild** (12), kein Vorschaubild.
- **K5: Schreibweise "Prompts" in Seitentiteln, "Fragen" in Menü** (Gut fragen / Gute Fragen stellen / Gut fragen: Prompts schreiben): drei Namen für verwandte Seiten.
- **K6: Textmenge im Modus "Genau lesen"** rund 11.000 Zeichen auf der Spiel-Seite; "Kurz lesen" ist als Standard gut.

### Positiv
Willkommens-Fenster ist klar und schließbar (01). Altersangabe 16+ und Datenschutzhinweis erscheinen, ohne zu stören. Spiel: Tastatur 1 und 2, Quellenangabe je Foto, ehrliche Aussage "keine sichere Erkennung". Druckmaterial: Kartenset (2 Seiten) und Arbeitsblatt (3 Seiten, QR-Code, Niveaustufen) öffnen sauber und sind druckbar (`bildkarten-echt-oder-ki-1.png`, `arbeitsblatt-medien-1-1.png`). Dunkelmodus: gute Kontraste (19, 20). Konsolenfehler: keine.

## Empfehlung
Das Labor trägt Jonas gut durch Spiel, Begriffssuche und Quiz; ich würde es meinem Freund schicken. Für Note 9 fehlen eine Schüler-Fassung des Prompt-Labors, ein Quiz direkt am Labor und eine kürzere, kindgerechte Chat-Wartezeit.

## Die drei größten Lücken Richtung 10
1. Schüler-Prompt-Seite mit Vorlagen aus der Schule (Referat, Mathe, Gaming), eine kurze Erklärung "Prompt = deine Frage an die KI" ganz oben, Quiz ohne Kundendaten.
2. Quiz oder "Teste dich" direkt unter jedem Labor (Punkte-Labor, Chat, Objekte) oder ein klarer Link "Quiz zu diesem Labor".
3. Spiel "Echt oder KI?" direkt sichtbar (Spielfläche ganz oben oder Sprungknopf), und der Chat: kindgerechte Beispielfragen, kurze Antworten, Zeitangabe in der Warteschlange.
