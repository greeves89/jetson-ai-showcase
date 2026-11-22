# Prüfbericht Thomas (50, Vater eines 16-Jährigen, Laptop 1440x900), Runde 4

Getestet am 22.11.2026 gegen https://192.168.178.83:8443, headless Chrome, Viewport 1440x900, Hell und Dunkel. Erstbesuch mit Willkommens-Fenster (`?willkommen=1`), dann Rolle "Ich bin Elternteil". Eine Sprachmodell-Anfrage. 21 Screenshots in `docs/runde4/thomas-bilder/`, alle mit dem Read-Werkzeug angesehen. Das Kartenset-PDF wurde mit `pdftoppm -r 60` geöffnet (2 Seiten A4).

## Gesamtnote: 8,3 von 10

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit | 8 | Kurze Sätze, aber fast alle Seiten sprechen das Kind mit "du" an; für Eltern nur einzelne Abschnitte (Hausaufgaben-Seite: "Für Eltern: nachfragen statt kontrollieren") |
| 2 | Einstieg und Führung | 9 | Willkommens-Fenster mit Rolle Elternteil, Startseite "KI im Alltag deiner Kinder" mit drei passenden Karten (02, 03) |
| 3 | Lernwirkung | 8 | Prüfwege klar (Seitwärtslesen, Gegenprobe, Chatbot ist Wegweiser, keine Quelle), vier Quizfragen je Seite (04, 06) |
| 4 | Motivation und Spaß | 9 | Spiel mit Rückmeldung "Woran du es sehen konntest", Ergebnis "4 von 12" mit Einordnung (11, 13) |
| 5 | Labore und Interaktion | 8 | Spiel und Chat laufen; Chat zeigt Wartehinweis, aber Antwort dauerte spürbar (18, 19) |
| 6 | Videos | 8 | Kapitelliste mit Zeiten und Verweis, ich habe sie nur gesichtet, nicht ganz angesehen (04, 12) |
| 7 | Navigation und Orientierung | 8 | Suche findet alles, rankt für Eltern aber Schulseiten vor der besten Seite (15) |
| 8 | Vertrauen und Sicherheit | 9 | "Ab 16, kein Alterscheck", "nicht gespeichert", Hinweis "Antwort kann falsch sein" im Chat (01, 13, 18) |
| 9 | Barrierefreiheit | 8 | Tastatur 1 und 2 im Spiel, Fokusrahmen sichtbar, Dunkelmodus sauber (20, 21); Hinweiszeile klein (13,5 px, grau) |
| 10 | Fehlerfälle | 9 | 404 mit zwei Wegen und Vorschlägen "Oder probiere", auch im Dunkelmodus (21) |

Würde ich es weiterempfehlen? Ja, an andere Eltern mit einer Einschränkung: Ich würde den Link direkt auf "Zusammen ausprobieren" oder "Echt oder KI?" setzen, weil man sich sonst durch Schulmaterial sucht.

## Zielaufgaben

1. **Wie prüft man KI-Antworten?** Erfolg. Weg: Sidebar "Quellen prüfen" (nach Rolle Elternteil 1 Klick, ca. 5 s). Die Seite liefert vier Züge (Stopp, Urheber, andere Berichte, zurückverfolgen), den Satz "Ein Chatbot ist ein Wegweiser und keine Quelle" und ein Quiz (04). Zweiter Fund: "Zusammen ausprobieren", Experiment 2 "Eine KI-Antwort gemeinsam prüfen". Über die Suche "Antworten prüfen" (2 Klicks, 15) stehen aber zuerst Schulseiten, "Quellen prüfen" erst an dritter Stelle.
2. **Regeln für KI bei Hausaufgaben.** Erfolg in 1 Klick, ca. 5 s: "KI und Hausaufgaben". Klare Matrix (angeben/nicht angeben gegen Regeln erlauben/verbieten, 08), "Fragen an deine Lehrkraft", Abschnitt "Für Eltern: vereinbaren, nachfragen, angeben". Die Seite sagt ehrlich: Die Regeln legt die Schule fest (kein fertiger Regelsatz fürs Elternhaus).
3. **"Echt oder KI?" mit dem Sohn.** Erfolg. Seite öffnen (1 Klick), Spiel mit 12 Karten: 12 Antworten plus 12 Weiter, also 24 Klicks, 16 s im Eiltempo, ohne Lesen. Jede Karte erklärt die Lösung (11). Ergebnis 4 von 12 (Wert des Testlaufs, abwechselnd geraten) mit Einordnung "Weniger als Raten. Das passiert vielen." und Link zu "Quellen prüfen" (13). Für zwei Personen gibt es zusätzlich das druckbare Kartenset (PDF, 2 Seiten, saubere Karten 1 bis 12, 14).

## Befunde

**Blocker**: keine.

**Hoch**
- Kartenset-PDF ist auf Schule zugeschnitten: Kopfzeile "Medien-Einheit 1. Karten ausschneiden und je Gruppe ein Set austeilen. Die Auflösung steht nur im Lösungsblatt der Lehrkraft." (14-kartenset-1). Ein Vater zu Hause hat kein Lösungsblatt, die Auflösung gibt es nur im Spiel unter "Alle zwölf Karten im Überblick". Auf der Elternseite und bei "Zusammen ausprobieren" wird das PDF aber als Elternmaterial angeboten. Eltern-Variante mit Lösung auf Seite 3 fehlt.
- Zwei Spieler sind nicht vorgesehen: Das Spiel hat nur einen Zähler, "Mit Freunden spielen: zählt, wer mehr richtig hat" ist ein Satz, keine Funktion (10, 13). Für Vater und Sohn fehlen zwei Namen oder ein gemeinsamer Startwert wie beim Fehler-Spiel.

**Mittel**
- Suche für Eltern: "Antworten prüfen" listet zuerst "KI 3", "Medien 2", Elternabend, Handreichung Lehrkräfte (15). Das passende Elternmaterial steht nicht oben. Treffer-Snippet bei "Eltern zu Hause" zeigt nur "Bildschirmzeit." (16-eltern-zuhause) und sagt nichts über den Inhalt; bei "Quellen prüfen" steht "Das Video steht oben auf dieser Seite, es liegt auch auf der Seite Quellen prüfen" (Selbstverweis, sinnlos im Snippet).
- Alle Lernseiten sind an das Kind gerichtet ("Wem kannst du glauben?", "Frag sie"). Ein Elternteil muss die Perspektive selbst umdrehen. Eine Leiste "Was heißt das für euch zu Hause?" fehlt auf "Quellen prüfen" und "Echt oder KI?".
- Matrix "Wann es zum Problem wird" nennt "Du gibst es nicht an, Regeln erlauben es: Meist unproblematisch" (08). Als Aussage an ein Kind heikel, weil Lehrkräfte oft Angabe verlangen; besser "Meist unproblematisch, aber frag nach, ob Angabe nötig ist".
- Chat-Antwort langsam: Der Chat zeigte direkt "Du bist als Nächster dran. Geschätzte Wartezeit: etwa 10 Sekunden." (18), die Antwort stand aber erst deutlich später da. Genaue Zeit bis zum ersten Zeichen nicht sauber messbar (mein Messfühler fand das Textfeld nicht); gesamt lief der Test 128 s. Während der Wartezeit zeigt die Oberfläche "Stopp", sonst keine Fortschrittsanzeige.
- Das Chat-Beispiel einer Vater-Frage ergab eine brauchbare Liste (Quelle prüfen, alternative Quellen, Formel prüfen), die Antwort enthält aber allgemeine Floskeln ("Das ist ein großes Thema!") und läuft ohne den Hinweis, dass für Mathe Nachrechnen der beste Test ist (19).

**Klein**
- Im Spiel stehen Bild und Knöpfe auf 1440x900 erst nach etwa 400 Pixel Scrollen im Blick (09, 10); Kopf der Seite (Titel, Lernziele) schiebt das Spiel nach unten.
- Tasten 1 und 2 im Spiel wirken nur, wenn ein Knopf Fokus hat (Taste ohne Fokus: nichts). Der Hinweis darunter erwähnt das nicht.
- Hinweiszeile "Tastatur: 1 für Echt..." 13,5 px, Grau auf Weiß, grenzwertig (Kontrast im Dunkelmodus rgb(174,174,178) auf Schwarz ist in Ordnung).
- Vollseiten-Screenshot (04, 06) zeigt Diagramme leer, weil sie erst beim Scrollen erscheinen; beim Hinscrollen sind sie da (07, 08). Kein Fehler, nur kurzes Aufblenden.
- Willkommens-Fenster in Hell wirkt grau-transparent, Karten und Hintergrund haben wenig Abstand (02).
- Sidebar-Status wechselt zwischen "Rechner live und frei" und "Rechner live, gerade viel los", ohne dass klar ist, was das für die eigene Wartezeit heißt (18, 20).

## Empfehlung
Das Labor ist für Eltern gut nutzbar: Rolle wählen, drei passende Karten, in einem Klick bei Quellenprüfung, Hausaufgaben und Spiel. Mit einem Eltern-Kartenset samt Lösung, einem Zwei-Spieler-Modus und einer besseren Eltern-Suche käme es an eine 9.

## Die drei größten Lücken Richtung 10
1. **Elternfassung des Kartensets** (Lösungsseite, Spieltext ohne "je Gruppe") und ein Zwei-Spieler-Modus im Spiel (Namen, gemeinsamer Startwert).
2. **Elternperspektive auf den Kernseiten**: Kasten "Für euch zu Hause" auf "Quellen prüfen", "Echt oder KI?" und "KI und Hausaufgaben" mit zwei Sätzen Gesprächsanlass; Suche bevorzugt bei Rolle Elternteil Elternseiten und zeigt echte Textauszüge.
3. **Chat-Wartezeit und Erwartung**: sichtbarer Fortschritt oder Schätzung bis zum ersten Zeichen, und eine passende Beispielfrage für Eltern ("Prüfe diese Antwort mit mir") statt der Technikfragen.
