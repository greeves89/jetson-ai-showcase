# Prüfbericht Aylin (15, Klasse 10, iPhone 390x844), Runde 4

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443, headless Chromium im Viewport 390x844, Hell und Dunkel, Erstbesuch mit Willkommens-Fenster. Screenshots (über 20, alle angesehen) liegen in `docs/runde4/bilder-aylin/`.

## Gesamtnote: 7,4 von 10

Das Labor wirkt auf dem Handy sauber und ist für eine 15-Jährige gut lesbar. Es verliert Punkte, weil Aylins Kernaufgabe (Referat mit Quellen) nur halb gelöst wird und die Frage nach der Hausaufgaben-Nutzung des Labors selbst nirgends beantwortet ist.

| Kriterium | Note | Beleg |
|---|---|---|
| 1 Verständlichkeit | 8 | Kurze Sätze, Alltagsbeispiele (Handy-Wortvorschlag, Handyverbot-Erörterung). Quellenangaben dagegen fast nur englische Fachaufsätze. |
| 2 Einstieg und Führung | 8 | Willkommens-Fenster mit sechs Rollen, "Schüler:in" führt direkt zu "Experimente" (01, 02). Danach fehlt eine Spur zum Referat. |
| 3 Lernwirkung | 7 | Seite "Wie ein Sprachmodell gebaut ist" erklärt Token, Aufmerksamkeit, Vortraining gut. Der Chat selbst lieferte Falsches (siehe hoch 1). |
| 4 Motivation, Spaß | 8 | "Echt oder KI?" (13, 14, 15) mit Sofort-Feedback und Ergebnis "6 von 12, etwa wie Raten, das ist normal" ist gut gemacht. |
| 5 Labore, Interaktion | 7 | Chat funktioniert, Wartezeit wird erklärt. Erste Antwort kam nach rund 25 s, ganze Antwort 41 s. |
| 6 Videos | 7 | Kapitelliste, Untertitelspur vorhanden (1 track), 1:14 bis 2:31 Minuten. Kein Posterbild, die Vorschau ist ein Standbild mit Mini-Titel. |
| 7 Navigation | 7 | Suche und Menü sind übersichtlich, aber Referat-Material liegt tief (Menü, Alle Bereiche, Medienkompetenz). Unbekannte Adresse zeigt still die Startseite. |
| 8 Vertrauen, Sicherheit | 8 | "Ist das sicher?" ist klar, "Ab wann?" steht auf der Startseite. Aylin ist unter 16: Kamera-Labore sind für sie ohnehin nicht der Weg, das Labor sagt aber nicht ausdrücklich, was für sie geht. |
| 9 Barrierefreiheit | 7 | Kein horizontales Scrollen auf acht geprüften Seiten, Dunkelmodus sauber (16, 17), Tastaturreihenfolge sinnvoll. Viele Textlinks nur 18 bis 20 px hoch. |
| 10 Fehlerfälle | 8 | Leere Frage: "Schreib zuerst eine Frage." (22). Speichermangel: freundlicher Text mit "Noch einmal versuchen" (07). Unbekannte Seite ohne Hinweis. |

## Befunde

### Blocker
Keine.

### Hoch
1. **Chat liefert für ein Referat sachlich Falsches, ohne dass es auffällt.** Frage: "Erkläre mir in drei einfachen Sätzen, wie du als Sprachmodell Text erzeugst." Antwort (08-chat-fertig): Das Modell nutze "Maskernetz (Masked Language Modeling)" und lese "ein Netzwerk von Verbindungen zwischen Wörtern". Das ist falsch, Llama erzeugt Text Token für Token nach Wahrscheinlichkeit. Der Hinweis "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." steht in einer kleinen grauen Box unter der Antwort. Für Aylin, die das Referat daraus bauen würde, ist das die größte Gefahr. Empfehlung: Bei Erklärfragen zur KI selbst einen sichtbaren Link "Geprüfte Erklärung: Wie ein Sprachmodell gebaut ist" direkt unter die Antwort setzen.
2. **Quellen für ein Referat sind schwer nutzbar.** Seite "Weiterlesen" (04-weiterlesen): hinter "Mehr dazu" eingeklappt, bei `llm-grenzen` zwei englische Aufsätze (arXiv, 2022 und 2023). Bei den Schülerseiten `quellen-pruefen`, `echt-oder-ki`, `ki-hausaufgaben-fair` und `prompts-fuer-schueler` steht nur "Quellen zu dieser Seite." mit reinen Literaturangaben ohne Link, ohne Abrufdatum und ohne "So zitierst du diese Seite" (das gibt es nur auf Seiten wie `karte`, `tokens-sprachmodelle`, `llm-grenzen`). Die deutsche Quelle klicksafe ist genannt, aber nicht verlinkt. Es gibt kein "Referat-Material"-Bündel.
3. **Die Frage "Darf ich das Labor für Hausaufgaben nutzen?" wird nicht beantwortet.** `ki-hausaufgaben-fair` erklärt gut, wie man KI-Hilfe angibt und dass "die Regeln deine Schule festlegt". `sicherheit-einfach` und die Startseite erwähnen Schule und Hausaufgaben im Zusammenhang mit dem Labor selbst nicht. Zusätzlich zeigt die Suche nach "Hausaufgaben" das Labor-Hausaufgabenthema, aber die Lehrkräfte-Einheit `medien-stunde-4` ("45 Minuten für Klasse 8", "Lösungsblatt nur für Lehrkräfte") gleich daneben, was für Schüler verwirrt.

### Mittel
4. **Unbekannte Adresse zeigt still die Startseite** (`/#/gibt-es-nicht`, 21). Keine Meldung "Seite nicht gefunden", kein Weg zurück zur Suche.
5. **Menü bleibt offen, wenn die Adresse wechselt** (Menü öffnen, dann Seite per Link wechseln, 11): Der Menü-Layer deckt die neue Seite ab, bis man ihn selbst schließt. Zurück-Taste des Browsers löst das gleiche aus.
6. **Wartezeit im Chat**: Erste Wörter nach rund 25 s (Modell lädt), Gesamtzeit 41 s für 94 Token. Die Anzeige "Der Jetson rechnet seit 5 s … Mit Stopp kannst du abbrechen." (07-chat-1s) ist gut, sie erklärt aber nicht, dass ein Modell geladen wird. Beim Erstversuch kam sofort "Dem Jetson fehlt gerade freier Speicher" (07-chat-fertig), freundlich, mit Knopf.
7. **Suche findet nach Seitennamen, nicht nach Inhalt**: "Referat" liefert "Gut fragen, Grenzen, Sprachmodell im Chat, Lizenzen und Quellen, Gute Fragen stellen" (05), aber nicht die Seite zu Hausaufgaben, auf der "Schreib das Referat" steht. Ergebnisliste ohne Textauszug, darunter eine leere graue Zeile unter dem Fortschrittsbalken.
8. **Bilderspiel liegt unter dem Falz**: Auf dem Handy sieht man beim Öffnen von `echt-oder-ki` (12, 13) nur Titel, Kartenset-Download und die Überschrift. Das Spiel, das den Spaß ausmacht, beginnt erst nach dem Scrollen. Das Kartenset-PDF (Dateigröße 2,1 MB) ist ein Lehrer-Material ("Medien-Einheit 1") auf einer Schülerseite.
9. **Wirkung der Seitenüberschrift auf dem Handy**: Die Kopfzeile "Sprache · ca. 1 Min Lesen, plus Video 1:14, plus Labor ca. 3 Min" bricht mit einem einzelnen "Min" in die letzte Zeile (09, 13). Gleiches auf der Startseite (16).
10. **Medienkompetenz liegt zwei Ebenen tief**: Aylin braucht Menü, Alle Bereiche, Medienkompetenz (10). Die Startseite "Schüler:in" zeigt zwar "Empfohlen für dich" mit drei Medienseiten, die Referat-relevanten (`quellen-pruefen`) fehlen dort.

### Klein
11. Tippfehler auf der Startseite (03, Kachel "KI und Hausaufgaben"): "wann sie schummeln ist" statt "Schummeln".
12. `prompts-fuer-schueler`: Überschrift "Fünf Bausteine", im Bild sechs (Rolle, Aufgabe, Material, Format, Grenzen, Niveau), Text nennt nur fünf.
13. Inline-Links und "Mehr dazu"-Zeilen sind nur 18 bis 20 px hoch (Messung auf sieben Seiten), die Zielgröße für Touch ist knapp.
14. Videos ohne Posterbild, Standbild zeigt Mini-Beschriftung in Blau, auf dem Handy kaum lesbar (06, 17).
15. Häkchen-Symbol bei "Quellen prüfen" im Menü (09) sieht aus wie "gelesen", ist aber nur das Seitensymbol, während oben "Noch nichts gelesen" steht.
16. Die Quellenlisten sind unterschiedlich ("geprüft am 22.11.2026" bei einigen Seiten, bei anderen nicht).

## Zielaufgaben

1. **Material fürs Referat mit Quellen**: Teilweise gelöst. Weg: Start, Menü, Alle Bereiche, Medienkompetenz, "Quellen prüfen" (4 Klicks, ca. 25 s) oder Suche "Quellen" (2 Klicks, ca. 10 s). Danach "Weiterlesen", "Mehr dazu" (2 Klicks). Zu finden sind brauchbare Seiten und englische Fachquellen, aber keine verlinkten deutschen Quellen und keine Zitierhilfe auf den Schülerseiten.
2. **Drei Sätze, wie ein Sprachmodell Text erzeugt**: Gelöst über `tokens-sprachmodelle` (Suche "Sprachmodell", 3 Klicks, ca. 20 s, Lesen 2 Min): Der Text wird in Stücke (Token) zerlegt, die Stücke werden zu Zahlen, und das Modell berechnet Stück für Stück, welches Stück mit welcher Wahrscheinlichkeit als Nächstes kommt, trainiert durch Verdecken und Raten. Der Chat dagegen lieferte die falsche Erklärung (hoch 1).
3. **Darf ich das Labor für Hausaufgaben nutzen?**: Nicht eindeutig gelöst. `ki-hausaufgaben-fair` (Suche "Hausaufgaben", 2 Klicks, ca. 15 s) beantwortet die allgemeine Frage: Frag deine Lehrkraft, gib die Hilfe an, die Schule entscheidet. Dass das Labor ein Lernangebot ist und ob seine Antworten für Hausaufgaben taugen, steht nirgends.

Zusatz: "Echt oder KI?" durchgespielt, 12 Karten in 11,5 s (automatisch, Aylin bräuchte etwa 1 Minute), Ergebnis 6 von 12.

## Empfehlung

Für den Alltag einer Schülerin ein gutes Lernangebot mit klarer Sprache, ich würde es empfehlen, solange eine Lehrkraft die Quellen mitprüft. Vor einem Referat taugt es erst, wenn Quellen verlinkt und gebündelt sind und der Chat nicht unkommentiert Falsches erklärt.

## Die drei größten Lücken Richtung 10

1. Referat-Weg: eine Seite "Für dein Referat" mit verlinkten, überwiegend deutschen Quellen, Zitiervorlage und Abrufdatum auf jeder Schülerseite, statt eingeklappter Literaturlisten.
2. Chat-Verlässlichkeit: bei Fragen zur KI selbst oder bei Fakten ein sichtbarer Hinweis mit Link zur geprüften Erklärung, plus Ansage "Modell wird geladen" bei der ersten Wartezeit.
3. Klarheit für Schüler: eine kurze Antwort "Darf ich das für Hausaufgaben nutzen?" auf der Startseite der Schüler-Rolle, Lehrer-Material (Lösungsblatt, 45-Minuten-Einheiten) in der Suche für Schüler zurückstellen, eine echte "Seite nicht gefunden"-Ansicht und Suche mit Textauszügen.
