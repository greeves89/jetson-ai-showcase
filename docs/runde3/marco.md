# Prüfrunde 3: Marco (41, Elektriker mit eigener Firma, Handy abends, 20 Minuten)

Prüfung am 22.11.2026 gegen https://192.168.178.83:8443, Chrome headless, Viewport 390x844, über tests/browser.mjs (starte mit willkommen true, einwilligung false). Dunkel als Standard, ein Durchgang in Hell. Rolle gewählt: "Ich entscheide im Betrieb" (passt zu einem Firmeninhaber; in Runde 2 hatte ich "Ich will KI verstehen" gewählt, dessen Startseite ich diesmal ebenfalls angesehen habe). Screenshots (22 Stück) liegen in docs/runde3/marco-bilder/.

Einschränkung: Der Harness arbeitet ohne Touch. Antippen und Wischen sind nicht geprüft, Touch-Ziele nur nach Größe (Tab-Reihenfolge: 44 Pixel hohe Knöpfe).

Hinweise zur Last: Der Jetson meldete beim ersten Prompt-Labor-Lauf und beim ersten Chat-Lauf "Dem Jetson fehlt gerade freier Speicher, um das Sprachmodell zu laden" (kein "Zu viele Anfragen"). Die Statuszeile auf der Startseite sagte zeitgleich "Gerade viel los: Es laufen schon Fragen." Andere Prüfer liefen parallel. Ein Lauf nach 60 Sekunden Pause scheiterte noch einmal gleich, der dritte Chat-Lauf ging durch (38 Sekunden inklusive Modell laden). Zusätzlich war der Server einmal rund eine Minute nicht erreichbar (ERR_CONNECTION_REFUSED), danach wieder da. Das werte ich nicht als Seitenfehler. Das Prompt-Labor "Vorher gegen Nachher" habe ich deshalb in Runde 3 nicht mit Ergebnis gesehen, nur die Fehlerführung und das Layout.

## 1. Gesamtnote und Raster

Gesamtnote: **7,0 von 10** (Vorrunde 7,5). Der Inhalt und die Führung sind besser geworden. Auf dem Handy mit meiner gewählten Rolle bricht aber das Layout: Auf jeder Seite ist die Breite um 41 Pixel zu groß, rechts wird Inhalt abgeschnitten. Das drückt die Note.

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit | 7 | Kurze Sätze, Kernsätze und Grafiken. Fachwörter (Token, Temperatur, Prompt-Bausteine, Reranking) ohne Alltagsvergleich an der Stelle. Handwerk-Seite sehr verständlich. |
| 2 | Einstieg und Führung | 8 | Willkommens-Fenster klar (3 Sekunden, 1 Klick). Rolle "Betrieb" führt zu "In 15 Minuten" mit vier nummerierten Seiten und Zeitangabe je Seite. Abzug: Rollenschild und Karten durch das Überlauf-Problem abgeschnitten. |
| 3 | Lernwirkung | 7 | Nach "Was ist KI?" und dem Video erkläre ich es in drei Sätzen. "Gut fragen" liefert die Merkregel (Rolle, Aufgabe, Kontext, Format, Grenzen). Der Chat zeigte mit dem FI-Schalter wieder Unsinn, die Seite macht daraus keine Lehre. |
| 4 | Motivation und Spaß | 7 | Live-Chat überzeugt (Fehler fällt mir als Fachmann sofort auf). Zwei Fehlermeldungen "kein freier Speicher" hintereinander bremsen. |
| 5 | Labore und Interaktion | 6 | Prompt-Labor: Beschriftung Vorher/Nachher steht gestapelt über dem ersten Feld (12-prompt-labor-1.png). Chat: Modellstatus widerspricht sich (grün "im Speicher" neben Knopf "Modell laden", dann "nicht im Speicher"). Antwort kam aber (24,1 Sekunden, 5,6 Tokens pro Sekunde). |
| 6 | Videos | 8 | 1:24, Kapitelliste, Untertitel jetzt unter dem Bild statt im Bild (25-hell-video30.png): behoben gegenüber Runde 2. Video 398 Pixel breit bei 390 Viewport. |
| 7 | Navigation und Orientierung | 6 | Menü "Für dich" sehr gut (6 Einträge, Alle Bereiche zugeklappt). Aber: Suchfeld nur 84 Pixel breit (zeigt "ker" von "Elektriker"), Menüknopf rechts abgeschnitten, Menü links angeschnitten ("ür dich"). "Gut fragen" fehlt im Betriebsmenü und im Betriebspfad. |
| 8 | Vertrauen und Sicherheit | 8 | "Deine Zustimmungen" mit Widerrufen oben auf "Ist das sicher?", Altersgrenze und Cookie klar im Fuß. Die Frage "Darf ich Kundendaten eingeben?" beantwortet die Sicherheitsseite weiterhin nicht (kein Treffer für Kundendaten, Firmendaten, personenbezogen). |
| 9 | Barrierefreiheit und Bedienbarkeit | 6 | Tab-Reihenfolge sinnvoll, sichtbarer Fokusring (3 Pixel) an Knöpfen, "Zum Inhalt springen" vorhanden, Knöpfe 44 Pixel. Abzüge: Suchfeld ohne sichtbaren Fokusring (outline none), Eingabefeld im Chat und Karten abgeschnitten, Suchfeld zu schmal zum Lesen. |
| 10 | Fehlerfälle | 8 | "Dem Jetson fehlt gerade freier Speicher ..." in Bernstein mit "Noch einmal versuchen" (Chat, Lauf 1; Screenshot 18-chat-fertig.png zeigt den späteren erfolgreichen Lauf, die Fehlermeldung sah ich nur im Text) und im Labor (14-prompt-ergebnis-1.png) "Diesmal gab es keine Antwort. Die Meldung oben sagt, woran es lag." Freundlich. Abzug: Die Meldung steht im Labor doppelt und die Leerfelder darunter wirken wie ein Fehler im Layout. |

## 2. Vergleich zur Vorrunde

Besser:
- Willkommens-Fenster: Kacheln jetzt gleich hoch (kein zweiter Absatz mehr nur bei Schüler:in), kein Fokusring auf der ersten Kachel, Fokus auf der Überschrift (01-willkommen.png). In Hell gut lesbar (23-hell-willkommen.png).
- Rollenschild heißt jetzt wie meine Kachel ("Ich entscheide im Betrieb"), nicht mehr "neugierig".
- Startseite je Rolle: Betrieb zeigt "In 15 Minuten" mit vier Seiten und ehrlicher Summe ("Zusammen: ca. 4 Min Lesen, plus Video 4:00, plus Labor ca. 9 Min"). Empfohlen: Handwerk an erster Stelle. Das ist mein Alltag, ein Klick bis dorthin.
- Menü: "Für dich" mit sechs Einträgen (Start, Handwerk, Dokumente befragen, Sichtprüfung, KI im Business, KI einführen, Kosten und Energie), "Alle Bereiche" zugeklappt.
- Suche: "Elektriker" findet jetzt Handwerk (Runde 2: "Recht und Regeln"). "Angebot" findet Handwerk als ersten Treffer, "Kundendaten" liefert Recht und Regeln, Gut fragen, Grenzen, Ist das sicher.
- Untertitel im Video überdecken den Bildtext nicht mehr.
- Seite "Du bist schon auf dieser Seite" ist nicht mehr aufgefallen.
- Fehlertexte beim Speichermangel klar und mit Handlungshinweis.

Gleich:
- Zeitangaben "ca. 1 Min Lesen" auf Seiten mit 1100 bis 1300 Wörtern (Gut fragen: 1136 Wörter, 12.210 Pixel; Kosten und Energie: 1320 Wörter, 12.098 Pixel; KI einführen: 800 Wörter, 9.194 Pixel). Der Seitenkopf nennt weiter "1 Min Lesen" und nennt Labor und Video getrennt.
- Antworten des Modells zum FI-Schalter weiter fachlich falsch (diesmal "Fusionsschalter", "Heizelemente", "Flammgas"), ohne dass die Seite das als Lehre nutzt.
- Handwerk-Seite ohne Labor und Video; "Probiere das Prinzip im Labor" ohne Link an der Stelle.
- Sicherheitsseite beantwortet die Kundendaten-Frage nicht.
- "Gut fragen" auf dem Handy 15 Bildschirmseiten lang, Quiz ganz unten.

Schlechter:
- Horizontaler Überlauf auf allen Seiten bei Rolle "Betrieb" (siehe Blocker 1). In Runde 2 nicht bemerkt.
- Modellstatus im Chat widersprüchlich (neu bemerkt).

## 3. UX- und UI-Befunde nach Schwere

### Blocker
1. **Seitenbreite 431 statt 390 Pixel auf allen Seiten (Rolle "Ich entscheide im Betrieb").** Gemessen: documentElement.scrollWidth 431 bei Viewport 390 auf Start, Handwerk, Gut fragen, Was ist KI?, Ist das sicher?, Chat, Business, KI einführen, Kosten und Energie. Ursache sichtbar: Das lange Rollenschild in der Kopfleiste ("Ich entscheide im Betrieb", 203 Pixel breit) schiebt Suche und Menüknopf aus dem Bild. Folgen: Menüknopf rechts abgeschnitten, Suchfeld nur 84 Pixel breit (zeigt nur "Sei" beziehungsweise "ker"), Karten, Videos (398 Pixel), "Kurz lesen / Genau lesen"-Schalter ("Genau lese"), Fließtext ("Angebot a", "Stape", "wa"), Statuszeile und Eingabefeld im Chat laufen rechts aus dem Bild. Menü links angeschnitten ("ür dich", Logo am Rand). Bei "Ich will KI verstehen" sind es 6 Pixel, bei Elternteil und Lehrende 0. Belege: 02-start-betrieb.png, 03-menue.png, 04-menue-alle.png, 07-schritt1.png, 09-suche-elektriker.png, 10-handwerk-oben.png, 10-handwerk-1.png, 15-chat-oben.png, 18-chat-fertig.png. Für jemanden mit meiner Rolle ist das Handy-Erlebnis damit kaputt.

### Hoch
2. **Betriebsmenü und Betriebspfad ohne "Gut fragen".** Meine dritte Aufgabe verlangt Suche. Die Links /prompting stehen auf Chat, Business, KI einführen und Handwerk nicht. Ausnahme: versteckte Liste "Alle Bereiche" auf der Startseite. Beleg: Linkprüfung, Menü 03-menue.png.
3. **Zeitangaben nicht ehrlich.** Seitenkopf "ca. 1 Min Lesen" bei 1136 Wörtern und 12.210 Pixeln (Gut fragen), 1320 Wörtern (Kosten und Energie). Startseite: "Zusammen: ca. 4 Min Lesen" für vier Seiten, die zusammen über 2400 Wörter haben.
4. **Prompt-Labor, Beschriftung Vorher/Nachher.** Beide Beschriftungen ("Vorher Prompt A", "Nachher Prompt B") stehen gestapelt über dem ersten Feld, das zweite Feld hat keine eigene Beschriftung. Beleg: 12-prompt-labor-1.png, 12-prompt-labor-2.png. Man weiß nicht, welches Feld Vorher ist.
5. **Chat: Modellstatus widersprüchlich.** Oben grün "im Speicher" neben dem Knopf "Modell laden" (15-chat-oben.png), später im Text "nicht im Speicher" und die Fehlermeldung "fehlt freier Speicher". Für Laien unklar, was ich tun soll.
6. **Kundendaten-Frage unbeantwortet.** "Ist das sicher?" (19-sicher-oben.png) beantwortet Konto, Foto, Cookie. Die Frage eines Betriebs, ob Kundendaten ins Labor dürfen, steht nur auf der Handwerk-Seite ("nicht mit echten Kundendaten") und in "Das nimmst du mit" unter Gut fragen.

### Mittel
7. Suchfeld ohne sichtbaren Fokusring (outline none), und zu schmal, um die Eingabe zu lesen (84 Pixel). Trefferliste bei "ChatGPT besser fragen" enthält Elternabend und Handreichung Lehrkräfte, bei "Prompt" doppelte Einträge (Gut fragen dreimal, Grenzen zweimal, Handreichung zweimal). Beleg: 09-suche-elektriker.png, Suchlauf.
8. Fehlermeldung "freier Speicher" im Prompt-Labor erscheint für beide Antworten doppelt, darunter zwei große leere Felder mit dem Satz "Diesmal gab es keine Antwort. Die Meldung oben sagt, woran es lag." (14-prompt-ergebnis-1.png). Kürzer und einmal reicht.
9. Prompt-Labor ist 3500 Pixel hoch (1208 bis 4780), vier Bildschirme. Eine Mail zu schreiben kostet mich viel Scrollen am Handy.
10. Handwerk-Seite: drei Beispiele nur als Grafik. Kein Labor, kein Video, kein Elektro-Beispiel (Prüfprotokoll, Materialliste). Beleg: 10-handwerk-1.png, 10-handwerk-3.png.
11. Videos: Untertitel unter dem Bild gut, aber das Video ist 398 Pixel breit, und die Spur steht auf "hidden" (die Zeile unter dem Bild kommt aus der Seite). Verweis am Ende nur als Text unter dem Video ("Der Verweis am Ende der Folge meint diese Seite").
12. Hell: Rollenkacheln und Karten gut lesbar (23, 24). Die Auslastungszeile in Hell hat einen hellen Kasten ohne Rand, zart, aber lesbar. Text im Kasten "Gerade viel los ..." läuft rechts ab (24-hell-start.png).

### Klein
13. Arbeitsblatt Medien 6 (PDF, drei Seiten, QR-Code, Operatoren, Quiz) wirkt aufgeräumt (am6-1.png). In der Kopfzeile steht "Lizenz: noch festzulegen". Das ist ein offener Platzhalter. Es richtet sich an Schüler, nicht an mich.
14. Quiz: richtige und falsche Antwort mit farbigem Rahmen und einem Satz Rückmeldung ("Nicht ganz. Das Modell füllt Lücken mit Plausiblem..."). Gut. Kein Gesamtergebnis oder "Nochmal" gesehen.
15. Fußbereich (28-fuss.png): Text läuft rechts ab (Teil des Überlaufs), drei Zeilen kleiner Fließtext, aber lesbar.
16. Statuszeile "Der Rechner ist bereit und frei. Gerade zu 0 Prozent ausgelastet." bleibt ein Fachwort ohne Nutzen für mich, wirkt aber vertrauensbildend.
17. Tab-Reihenfolge am Seitenanfang: Zum Inhalt springen, Rolle, Menü, Suche, Zurück, Kurz lesen, Genau lesen, Lernziele. Sinnvoll.

## 4. Zielaufgaben

| Aufgabe | Gelöst? | Klicks | Zeit | Weg |
|---|---|---|---|---|
| 1. Das Wichtigste in 20 Minuten verstehen | Ja, mit Führung | Rolle 1, "Mit Schritt 1 starten" 1, Video 1 = 3 | 1,6 Sekunden bis Seite 1; Pfad "In 15 Minuten" laut Seite 9 Minuten Labor plus 4 Minuten Video plus Lesen | Startseite Betrieb |
| 2. Beispiel aus dem Handwerk | Ja | Rolle 1, "Öffnen" bei Handwerk 1 = 2 (oder Suche "Elektriker": 2 Klicks plus Tippen) | etwa 5 Sekunden bis zur Seite | Startseite, Karte "Handwerk" |
| 3. ChatGPT besser fragen | Ja, nur über Suche | Menü 1, Suche antippen 1, "ChatGPT besser fragen" tippen, Treffer 1 = 3 | etwa 15 Sekunden bis zur Seite | Suche (kein Link im Betriebspfad) |

Aufgabe 1: Seite "Was ist KI?" (5413 Pixel), Video 1:24 mit Kapitelliste (6 Marken). Meine drei Sätze: KI ist ein Sammelbegriff für Software, die Aufgaben löst, für die man sonst denken muss. Die älteste Form läuft mit festen Wenn-dann-Regeln. Moderne KI lernt aus Beispielen. Das trägt. Ob ich 20 Minuten brauche: Der Betriebspfad ist mit "ca. 4 Min Lesen" zu knapp angesetzt, in Wahrheit etwa 25 Minuten.

Aufgabe 2: Die Handwerk-Seite hat vier Grafiken (Angebot aus Notiz, Baustellenfoto Kann/Kann nicht, Rechnungen sortieren) und eine Dreischritt-Checkliste. "Sie lenkt den Blick. Die Fachkraft beurteilt." und "Preise, Mengen, Termin prüfst du selbst" sind ehrlich und genau mein Alltag.

Aufgabe 3: "Gut fragen" liefert die Antwort: "Rolle, Aufgabe, Kontext, Beispiele, Format und Grenzen sind die Checkliste für gute Prompts" und "Was fehlt, erfindet das Modell." Der Satz steht aber erst nach etwa 9.300 Pixeln. Das Prompt-Labor konnte ich wegen "fehlt freier Speicher" nicht durchspielen.

Chat mit meinem Fach: "Ich bin Elektriker. Erkläre einem Kunden in drei Sätzen, was ein FI-Schalter macht." Antwort nach 24,1 Sekunden (134 Tokens, 5,6 Tokens pro Sekunde): "FI-Schalter (Fusionsschalter) ... aufgrund von Hitze ... Heizelemente ... Flammgas ... explosive Mischung aus Wasserstoff und Luft". Fachlich falsch und sogar gefährlich klingend. Ein FI schaltet bei Fehlerstrom ab. Das ist für mich der stärkste Moment der Seite, sie macht aber nichts daraus. Der Hinweis "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." steht klein darunter.

## 5. Empfehlen?

Ja, mit Einschränkung: Als Kleinunternehmer würde ich es empfehlen, weil es kostenlos und ohne Anmeldung ist, die Rolle "Betrieb" zu Handwerk und Ablauf führt und der Chat in einer Frage zeigt, wie selbstsicher so ein Modell falschliegen kann. Auf dem Handy müsste vorher der Überlauf behoben sein, sonst wirkt es kaputt.

Die drei größten Lücken Richtung 10:
1. **Mobil-Layout reparieren (Blocker 1).** Rollenschild in der Kopfleiste kürzen oder umbrechen, Seitenbreite nie über Viewport, Suchfeld mit lesbarer Breite und Fokusring. Dann prüfen bei allen sechs Rollen und allen Seiten (scrollWidth gleich clientWidth).
2. **Praxisweg für den Betrieb vervollständigen.** "Gut fragen" und "Ist das sicher?" mit Kundendaten-Antwort in den Betriebspfad und ins Menü "Für dich". Handwerk mit einem kleinen Labor (Angebot aus einer Notiz, mit erfundenen Daten) und einem Elektro-Beispiel. Den FI-Schalter als ausdrückliche Übung "Prüfe die Antwort mit deinem Fachwissen" anbieten.
3. **Ehrliche Zeitangaben und kürzere Handy-Seiten.** Kopf, Pfadsumme und Startseite aus der Wortzahl berechnen. "Gut fragen", "Kosten und Energie" und "KI einführen" im Kurzmodus auf rund 400 Wörter und Ergebnis oben ("Merke: Rolle, Aufgabe, Kontext, Format, Grenzen"). Prompt-Labor mit klaren Feldbeschriftungen und halber Höhe, Speicherfehler einmal und kurz melden.
