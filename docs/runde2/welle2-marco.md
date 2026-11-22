# Prüfrunde 2, Welle 2: Marco (41, Elektriker mit eigener Firma, Handy abends)

Prüfung am 22.11.2026 gegen https://192.168.178.83:8443, Chromium headless, Handy 390x844, über tests/browser.mjs mit starte({willkommen: true}). Screenshots liegen in /tmp/welle2-marco/. Dunkles Farbschema (Standard des Harness).

Einschränkung: Der Harness legt den Kontext ohne Touch an (hasTouch fehlt). Ich habe mit Klicks gearbeitet, echtes Antippen und Wischen nicht geprüft. Touch-Ziele habe ich nur an der Größe im Bild beurteilt.

Rahmen: 20 Minuten am Abend, praktisch, ungeduldig bei Fachwörtern. Geschätzte Lese- und Wartezeit insgesamt: etwa 18 Minuten (Lesen aus Wortzahlen geschätzt, Wartezeiten und Klicks gemessen).

## Willkommens-Fenster

- Erscheint sofort beim Erstbesuch, volle Breite, Überschrift "Willkommen im KI-Labor", darunter "Für wen darf es sein? Dann zeige ich dir den passenden Einstieg."
- Sechs Rollenkacheln im 2x3-Raster, jede mit Icon, einer Titelzeile und einem Halbsatz: Schüler:in, Lehrende, "Ich will KI verstehen" (Die Grundlagen, Schritt für Schritt), IT, Betrieb, Elternteil.
- Darunter ein Schalter "Meinen Lernfortschritt in diesem Browser merken" (aus), ein Knopf "Später", ein Kleingedrucktes "Nichts wird gesendet, deine Wahl bleibt nur in deinem Browser." und oben ein Schließen-Kreuz.
- Die erste Kachel (Schüler:in) hat schon einen blauen Fokusring. Das wirkt wie eine Vorauswahl, obwohl nichts gewählt ist.
- Die Kachel Schüler:in hat als einzige einen zweiten Absatz (Kamera ab 16). Die Kacheln sind dadurch unterschiedlich hoch (179 gegenüber 126 Pixel).
- Die Kachel "Ich entscheide im Betrieb" passt zu mir als Firmeninhaber besser als "Ich will KI verstehen". Ich habe wie vorgegeben "Ich will KI verstehen" gewählt. Als Handwerker hätte ich zwei Sekunden gezögert, welche Kachel meine ist.

Zusatzfrage 1: Ich habe eine Rolle gewählt und erwartet, dass ich zu etwas Praktischem komme. Passiert ist: Die Startseite wechselt auf "KI verstehen, Schritt für Schritt" mit Schritt 1 von 7. Zeit bis dahin: 3,2 Sekunden ab Seitenaufruf, 1 Klick. Das Fenster schließt von selbst, kein zweiter Bestätigungsklick nötig. Gut. Beim zweiten Öffnen über das Rollenschild oben steht statt "Später" der Knopf "Schließen". Der Schalter für den Lernfortschritt bleibt ohne Erklärung, was "merken" im Browser bedeutet (die Erklärung steht erst auf "Ist das sicher?").

## Startseite nach der Rollenwahl

- Oben ein Rollenschild "neugierig" (Marco hat sich nicht als "neugierig" bezeichnet, das Wort ist die interne Benennung der Rolle und wirkt für einen 41 Jahre alten Firmeninhaber wie ein kleines Etikett).
- Kopf: "KI verstehen, Schritt für Schritt. Sieben kurze Seiten führen durch die Grundlagen. Ohne Vorwissen." Zwei Plaketten "Kostenlos" und "Ohne Anmeldung", dann eine grüne Statuszeile "Der Rechner ist bereit und frei. Gerade zu 0 Prozent ausgelastet."
- Dann "Empfohlen für dich": drei große Karten (Was ist KI?, Maschinelles Lernen, Neuronale Netze), je mit "Schritt x von 7", einem Satz, "ca. 4 Min" und einem Knopf "Öffnen".
- Darunter "Weitere Wege": Ist das sicher?, Ab wann? (16 Jahre), Was ist ein Jetson?
- Wirkung: Ich weiß in 30 Sekunden, was ich tun soll: Auf "Öffnen" bei Schritt 1 tippen. Das ist klar geführt. Aber der Weg ist für mich reines Theorie-Programm. Ein Handwerksbeispiel oder "Was bringt mir das?" steht nirgends auf der ersten Bildschirmseite.
- Die Statuszeile zum Rechner ("0 Prozent ausgelastet") ist für mich ein Fachwort ohne Nutzen. Sie sagt aber freundlich, dass es läuft.

## Menü beim Start (Zusatzfrage 2)

Nach dem Antippen des Menü-Knopfs sehe ich beim Start:
- 7 Einträge, 1 Gruppenzeile: Start, Was ist KI? (Einsteiger), Maschinelles Lernen (Einsteiger), Daten, Neuronale Netze, Training, Sprachmodelle, und darunter eingeklappt "Alle Bereiche".
- Das ist aufgeräumt, ohne Scrollen auf dem Handy. Das ist ein großer Fortschritt gegenüber einer langen Liste.
- Klappe ich "Alle Bereiche" auf, kommen 12 Gruppen (Grundlagen, Medienkompetenz, Sprache, Experimente, Sehen, Wissen und RAG, Agenten, Daten und Prognosen, KI im Betrieb, Business-Use-Cases, Der Rechner dahinter, Für die Schule). Hinter den Gruppen stehen zusammen 88 Seitenlinks im Dokument. Hier ist es dann wieder viel, und die Gruppennamen "Wissen und RAG" und "Agenten" sind für mich Fachwörter.
- Fünf Punkte, die ich erwarten würde: Was ist KI, Gut fragen, Beispiele aus dem Betrieb, Ist das sicher, Suche. Drei davon sind im Startmenü nicht sichtbar, ich musste suchen.
- Nie anklicken würde ich: Neuronale Netze, Training, Daten (im Startmenü), "Wissen und RAG", "Agenten", "Der Rechner dahinter", "Für die Schule".
- In meinem Startmenü fehlt "Gut fragen". Gerade das wollte ich. Der Weg "Ich will KI verstehen" führt über Maschinelles Lernen, Neuronale Netze, Training, bevor ich zu Prompts komme (Schritt 6 oder später).
- Die Suche oben ("Seiten suchen") ist immer sichtbar und tippt sich im Menü schnell.

## Zielaufgaben (Zusatzfrage 3)

| Aufgabe | Gelöst? | Klicks | Zeit | Wo gesucht |
|---|---|---|---|---|
| 1. Das Wichtigste in 20 Minuten verstehen | Teilweise | Rolle 1, Öffnen 1, Video starten 1 = 3 | Karte + Video etwa 5 Minuten, Gesamtweg bis Chat und Gut fragen etwa 12 Minuten | Startseite, Karte "Was ist KI?" |
| 2. Beispiel aus dem Handwerk | Ja, aber dünn | Menü 1, Suche tippen, 1 Treffer antippen = 2 | 15 Sekunden bis zur Seite | Suche "Handwerk" |
| 3. ChatGPT besser fragen | Ja | Menü 1, Suche tippen, 1 Treffer = 2 | 15 Sekunden bis zur Seite, 10 bis 12 Minuten bis alles gelesen und ausprobiert | Suche "ChatGPT besser fragen" |

### Aufgabe 1: das Wichtigste verstehen
- Seite "Was ist KI?" (/karte): 457 Wörter in "Kurz lesen", 675 in "Genau lesen". Auf dem Handy 5615 Pixel hoch. Oben steht "ca. 1 Min", die Startseite versprach "ca. 4 Min". Das ist widersprüchlich. Gelesen habe ich sie in etwa 3 Minuten.
- Video "Was ist KI?": Dauer 1:23, deutsche Untertitel eingeschaltet, Kapitelliste mit fünf Marken (0:00, 0:10, 0:24, 0:39, 1:00). Ich konnte vor- und zurückspringen, das Video endet sauber ohne Absturz.
- Verständlichkeit: Die Folge nennt "wahrnehmen, verstehen, entscheiden und erzeugen", dann "Maschinelles Lernen, Deep Learning, Generative KI", also vier Fachwörter in 30 Sekunden. Meine Erklärung in drei Sätzen nach dem Video: "KI ist ein Sammelbegriff für Programme, die Aufgaben lösen, für die man sonst denken muss. Die älteste Form arbeitet mit festen Wenn-dann-Regeln. Moderne KI lernt aus Beispielen." Das ist richtig und reicht für den Anfang. Den Unterschied zwischen Deep Learning und Generativer KI könnte ich nicht erklären.
- Untertitel am Handy: Auf dem Bild bei 0:30 liegen die Untertitel genau über den Textzeilen im Video ("Das funktioniert, solange ein Mensch..." überdeckt "Kunde nei..."). Das stört das Lesen. Belege: video-karte-30s.png.
- Das Video am Ende: Der Hinweis "Der Verweis am Ende der Folge meint diese Seite" steht unter dem Video. Am Ende selbst fand ich ein dunkles Standbild ohne eine erkennbare Aufforderung. Ich verstehe den Verweis nur, weil ich den Satz unter dem Video gelesen habe.
- Die Seite sagt "Du bist schon auf dieser Seite." in einem Abschnitt. Das ist verwirrend.

### Aufgabe 2: Beispiel aus dem Handwerk
- Suche "Handwerk" liefert zwei Treffer: Handwerk und Baustelle (Gruppe Business-Use-Cases). Gut, eindeutig.
- Suche "Elektriker" liefert nur "Recht und Regeln" (Gruppe Grundlagen). Das ist am Thema vorbei. Das Wort "Elektriker" findet den Handwerksbeitrag nicht.
- Suche "Betrug" liefert "Auffälliges finden" und "Echt oder KI?". Passt halbwegs.
- Seite "Im Handwerk: Angebot, Baustellenfoto, Rechnungen": 430 Wörter, 4431 Pixel hoch, ca. 1 Min laut Kopf. Drei Alltagsaufgaben: Angebot aus einer Notiz vom Aufmaß oder Sprachmemo, Baustellenfoto prüfen, Rechnungen sortieren. Dazu eine Checkliste "In 3 Schritten bei dir" mit dem Rat, nicht mit echten Kundendaten zu testen.
- Das ist genau mein Alltag, besonders "Preise, Mengen, Termin prüfst du selbst" und "Sie lenkt den Blick. Die Fachkraft beurteilt." (ehrlich und beruhigend, kein Heilsversprechen).
- Lücke: Kein Labor und kein Video auf dieser Seite. Die drei Beispiele sind nur Grafiken mit Stichwörtern. Probieren kann ich es dort nicht. Verwiesen wird auf Chat, Objekterkennung, RAG, doch ohne den Satz "Probier das Angebot jetzt aus".
- Ein echtes Elektrohandwerk-Beispiel (Prüfprotokoll, Materialliste, Fehlersuche) gibt es nicht. "Handwerk" bleibt allgemein.

### Aufgabe 3: ChatGPT besser fragen
- Die Suche nach "ChatGPT besser fragen" liefert als ersten Treffer "Gut fragen" (Sprache), dann "Sprachmodelle", "Gute Fragen stellen" (Medienkompetenz, für Schüler) und drei weitere. Der Treffer ist richtig, aber die Liste mit sechs Seiten ist mehr, als ich auf dem Handy brauche.
- Seite "Gut fragen: Prompts schreiben": 1159 Wörter im Kurzmodus, 12.618 Pixel hoch (etwa 15 Bildschirmseiten), laut Kopf "ca. 1 Min". Das ist eine Zeitangabe, die nicht stimmt (ehrlich: etwa 6 bis 8 Minuten).
- Zwei Videos (Folge 1: 1:21, Folge 2: "drei Beispiele aus dem Büro", 1:15).
- Die Seite liefert die gesuchte Antwort in einem Satz: "Rolle, Aufgabe, Kontext, Beispiele, Format und Grenzen sind die Checkliste für gute Prompts." und "Was fehlt, erfindet das Modell." Das ist brauchbar und ich würde es mir merken. Aber es steht ganz unten im Kasten "Das nimmst du mit". Der Weg dahin geht an einem langen Labor vorbei.
- Ich könnte als Marco sagen: "Schreib dem Modell, wer du bist, was du willst, was es nicht erfinden darf."

## Labor: "Gut fragen", Vorher gegen Nachher

Bedient: Vorlage "Mail an einen Kunden" (Standard), Temperatur 0,3, "Beide senden".
- Der erste Token kam nach 1,0 bis 1,4 Sekunden. Gut, ich sehe sofort, dass etwas passiert.
- Zwei Läufe, bis beide Antworten fertig waren: 62 Sekunden (zweiter Lauf). Die Antwort auf "Vorher" brauchte rund 35 bis 40 Sekunden für 272 bis 300 Token, "Nachher" danach etwa 28 Sekunden für 148 Token. Die Anzeige bricht bei 300 Token ab, mitten im Satz ("Wir danken Ihnen für Ihre Ged"). Der Hinweis dazu steht klein darunter, ich habe ihn erst beim zweiten Lauf gelesen.
- Während Antwort 1 läuft, steht bei Antwort 2 "Die Antwort erscheint hier" und der Knopf "Beide senden" ist grau. Ein Fortschrittsbalken fehlt, nur der Satz "Das Modell schreibt ...". Eine Minute Warten am Handy ist am Abend lang. Es lässt sich nicht erkennen, dass beide nacheinander laufen, außer wenn man den Hinweis "Die Fragen laufen nacheinander" weiter oben gelesen hat.
- Lernwirkung: Der Unterschied zwischen "Vorher" und "Nachher" ist in meinen Läufen klein. Die "Vorher"-Antwort war schon lang und enthielt das Datum und den Grund, weil schon die vage Vorlage Daten mitliefert. Ich sehe, dass "Nachher" kürzer ist, nicht deutlich besser. Der Lerneffekt "Der gute Prompt ist besser" ist nur halb belegt. Die Erkennung "5 von 5 Bausteinen" funktioniert, die Seite sagt selbst, dass sie nur Stichwörter sucht.
- Die Antworten enthalten Fehler: "unsere ursprüngliche Liefertermine", "Wir entschuldigen sich", "40 Ordner und 2 Regalen". Ein Unternehmer erkennt das sofort. Es passt zum Hinweis "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." und zur Prüfliste ("Ton passt, Form eingehalten, Nichts erfunden, Vollständig"), die ich nicht abgehakt habe, weil nichts erklärt, wann ich sie nutze.

## Labor: Sprachmodell im Chat (mit meinem Fach)

Frage: "Ich bin Elektriker. Erkläre einem Kunden in drei Sätzen, was ein FI-Schalter macht."
- Erster Lauf (Zwischenstand): "Ein FI-Schalter (Fest-Induktiver Schalter) ist ...". Zweiter Lauf: "(Fest- und Intervallschalter)". Dritter Lauf: "(Fest- oder Integrierter Schalter) ... eine Art elektrische Sicherheitseinrichtung, die den Stromverbrauch eines Geräts so einschränkt, dass er nicht über einen bestimmten Wert hinausgeht ... in das Maschinenelement integriert".
- Alle drei Antworten sind fachlich falsch. Ein FI (Fehlerstrom-Schutzschalter) schaltet bei Fehlerstrom ab, er begrenzt keinen Stromverbrauch. Das Modell erfindet drei verschiedene Abkürzungen.
- Das ist für mich das stärkste Erlebnis auf der ganzen Seite: Das Labor beweist, wie ein kleines Modell selbstsicher Unsinn erzählt. Nur: Die Seite macht daraus nichts. Kein Hinweis "Prüfe es mit deinem Fachwissen", kein Beispiel, das genau das zeigt.
- Zeit: erster Token nach 1,1 bis 3,2 Sekunden, ganze Antwort 22,2 Sekunden, 6,0 Tokens pro Sekunde. Die Statuszeile ("Token 22: Das Modell wählt gerade das nächste Wort. Aktuelles Tempo: 8,4 Tokens pro Sekunde. GPU: 99 Prozent.") ist für mich zu technisch, aber lässt sich ignorieren.
- "Freier Speicher": Die Meldung kam bei mir nicht, in allen Läufen ging die Anfrage durch. Ich habe die Anfragen mit mindestens 5 bis 10 Sekunden Pause gestellt.

## Quiz

- Quiz "Teste dich" am Ende von "Gut fragen": 5 Fragen mit je 4 Antworten, direkte Rückmeldung nach jeder Antwort mit einem Satz Begründung, am Ende "5 von 5 richtig."
- Gut: sofortige grüne Markierung und Erklärung ("Richtig. Eingaben verlassen bei Cloud-Diensten dein Haus. Regeln der Firma und Datenschutz kommen zuerst ...").
- Schwach: Die richtigen Antworten sind teils offensichtlich (Frage 4 "Welches Fehlerbild": Widersprüchlich). Ein Knopf "nochmal" oder ein Gesamtergebnis, das gemerkt wird, fiel mir nicht auf. Die Seite am Handy ist so lang, dass das Quiz erst nach etwa 12.000 Pixeln Scrollen erscheint.
- Ein Fehlversuch (falsche Antwort) habe ich in dieser Prüfung nicht geprüft.

## Suche, Fehlerfälle, Vertrauen

- Suche mit Alltagswörtern: "Handwerk" gut, "ChatGPT besser fragen" gut, "Betrug" mittel, "Elektriker" schlecht (Treffer "Recht und Regeln").
- Leere Eingabe im Chat: Ein Klick auf "Senden" zeigt in orange "Schreib zuerst eine Frage." und hebt das Feld hervor. Freundlich, aber die Farbe Orange auf Dunkelgrau ist klein und leicht zu übersehen.
- Kamera ablehnen (Seite Objekte): Der Dialog "Darf die Seite deine Kamera nutzen?" nennt oben in blau "Nutzbar ab 16 Jahren. Jüngere nur mit Einverständnis der Eltern. Die Seite prüft dein Alter nicht." und erklärt in fünf Blöcken Wozu, Wohin, Was bleibt, Stoppen, Kosten. Nach "Ohne Kamera weitermachen": "Du hast die Kamera nicht freigegeben. Das ist in Ordnung. Du kannst mit den Beispielbildern weitermachen ..." und der Link "Noch einmal versuchen". Freundlich, ehrlich, mit Handlungshinweis. Der Dialog ist am Handy so hoch, dass der Knopf "Einverstanden" am unteren Rand angeschnitten ist und gescrollt werden muss.
- "Ist das sicher?" (1270 Wörter, ca. 6 Min): beginnt mit "Die kurze Antwort": Kein Konto, Kein Foto gespeichert, Texte nur kurz. Danach eine Tabelle mit Cookie und Speichereinträgen. Als Unternehmer will ich wissen, ob ich Kundendaten eingeben darf: Die Antwort ist "Texte nur kurz, danach vergisst sie der Rechner", aber der Rat "keine echten Kundendaten" steht auf der Handwerk-Seite, nicht hier. Eine Tabelle am Handy ist eng.

## Zusatzfrage 4: Wo ist zu viel Text?

Die drei textlastigsten Stellen:
1. "Gut fragen: Prompts schreiben" (/prompting): 1159 Wörter im Kurzmodus, 12.618 Pixel, Abschnitte nach dem Labor ("Beispiele zeigen wirkt stark", "Schritt für Schritt denken lassen", "Typische Fehlerbilder", "Testen, Vorlagen pflegen und Datenschutz"). Für einen Abend am Handy zu viel.
2. "Gute Fragen an die KI stellen" (/prompts-fuer-schueler): 1292 Wörter, 10.514 Pixel, Abschnitt "Warum die Frage so viel ausmacht" mit Fließtext trotz "Kurz lesen".
3. "Ist das sicher? Was wird gespeichert?" (/sicherheit-einfach): 1270 Wörter, Abschnitt mit der Cookie-Tabelle.

Gut gelöst: Die Handwerk-Seite und "Was ist KI?" arbeiten mit Grafiken und kurzen Kernsätzen. "Kurz lesen" versus "Genau lesen" ist eine kluge Idee, nur bei "Gut fragen" und "Ist das sicher?" bleibt "Kurz" immer noch lang.

## Bewertung nach dem Zehn-Punkte-Raster

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit | 7 | Kurze Sätze, aber "Maschinelles Lernen", "Deep Learning", "Token", "Temperatur", "RAG", "Reranking" ohne Alltagsvergleich. Unterstrichene Begriffe mit ? helfen, ich habe sie aber nur bemerkt, weil der Hinweis es sagt. |
| 2 | Einstieg und Führung | 8 | Willkommens-Fenster klar, Rolle in 3 Sekunden, Startseite mit eindeutigem "Öffnen". Abzug: Der Weg "Ich will KI verstehen" ist Theorie, kein Nutzen für mich, und die Rollen-Etikette "neugierig" wirkt fremd. |
| 3 | Lernwirkung | 7 | Nach Karte und Video kann ich KI in drei Sätzen erklären. Nach "Gut fragen" kann ich sagen: Rolle, Kontext, Format, Grenzen. Das Labor zeigt den Unterschied Vorher/Nachher nur schwach. |
| 4 | Motivation und Spaß | 7 | Chat mit Live-Token ist spannend, der FI-Schalter-Fehler überzeugt. Wartezeit von rund 60 Sekunden im Prompt-Labor und der abgeschnittene Satz bremsen. |
| 5 | Labore und Interaktion | 7 | Funktionieren zuverlässig, erster Token in 1 bis 3 Sekunden, Status sichtbar. Beide Antworten nacheinander dauern über eine Minute, Abbruch bei 300 Token mitten im Satz, Vorher/Nachher-Unterschied klein. |
| 6 | Videos | 8 | Kurz (1:23, 1:21, 1:15), Untertitel an, Kapitelmarken, sprunghaft bedienbar. Abzüge: Untertitel überdecken Bildtext am Handy, Verweis am Ende nur im Text unter dem Video, viele Fachwörter pro Minute. |
| 7 | Navigation und Orientierung | 7 | Startmenü mit 7 Einträgen ist vorbildlich, Suche immer sichtbar, Zurück-Knopf "Zur Startseite". Abzüge: Zeitangaben widersprüchlich (ca. 1 Min gegenüber 4 Min), "Schritt von 7" gegenüber "Seite von 9" im Pfad, Suche findet "Elektriker" nicht, "Gut fragen" fehlt im Startmenü. |
| 8 | Vertrauen und Sicherheit | 8 | Freundlicher Einwilligungsdialog mit Altersgrenze 16+ ganz oben, "kein Foto gespeichert", Widerruf möglich. Abzug: Antwort auf "Darf ich Kundendaten eingeben?" steht nicht an der Stelle, an der ich sie suche. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Große Knöpfe (Rollenkacheln 126 bis 179 Pixel hoch, Schließen 44 Pixel, "Öffnen" gut zu treffen), gute Lesbarkeit. Nicht geprüft: echtes Touch, Tastatur am Handy. Orange Hinweistext klein, Einwilligungsdialog am Handy angeschnitten, Quiz-Radios klein. |
| 10 | Fehlerfälle | 8 | "Schreib zuerst eine Frage.", Kamera ablehnen freundlich mit "Noch einmal versuchen". Der Fehlerhinweis ist unauffällig. |

Gesamtnote (ehrlicher Eindruck, nicht Mittelwert): **7,5 von 10.**

Der Rollenaufbau und das aufgeräumte Startmenü sind deutlich spürbar besser. Zur Eins-A-Note fehlen für mich die Praxisnähe und das Tempo am Handy.

## Zusatzfrage 5: Empfehlen?

Ja, mit Einschränkung. Empfehlen würde ich es neugierigen Kleinunternehmern, die einmal ohne Anmeldung und ohne Kosten sehen wollen, was ein Sprachmodell kann und wo es danebenliegt. Ich würde zwei Sätze sagen: "Probier den Chat aus und stell ihm eine Frage aus deinem Fach, dann siehst du in 20 Sekunden, wie gut und wie falsch so eine KI sein kann. Lies danach nur 'Gut fragen' und die Seite 'Im Handwerk', der Rest ist Theorie."

## Was hat mich gefreut

- Das Startmenü mit sieben Einträgen und dem eingeklappten "Alle Bereiche", ohne Scrollen auf dem Handy.
- Die Rollenwahl: ein Tipp, dann bin ich auf einer Startseite mit "Schritt 1 von 7" und einem "Öffnen"-Knopf.
- Der Chat: erster Token nach 1 bis 3 Sekunden, ich sehe, wie das Modell Wort für Wort schreibt, und es lässt sich mit einer Frage aus meinem Beruf ausprobieren. Dass er beim FI-Schalter dreimal Unsinn erzählt, war für mich der lehrreichste Moment.
- Die Handwerk-Seite: "Preise, Mengen, Termin prüfst du selbst" und "Sie lenkt den Blick. Die Fachkraft beurteilt." Ehrlich, keine Heilsversprechen.
- Das Quiz mit sofortiger Begründung, und der Hinweis "Prüfe Wichtiges" überall.
- Der Einwilligungsdialog: Altersgrenze oben, fünf klare Blöcke, freundliche Reaktion auf "Ohne Kamera weitermachen".
- Die Suche findet "Handwerk" und "ChatGPT besser fragen" sofort.

## Was hat genervt

- Das Prompt-Labor braucht etwa eine Minute für zwei Antworten, schneidet die erste bei 300 Token mitten im Satz ab, und der Unterschied zwischen Vorher und Nachher ist klein.
- Zeitangaben stimmen nicht: "ca. 1 Min" bei Seiten mit über 1000 Wörtern (/prompting, 12.618 Pixel), "ca. 4 Min" auf der Startseite für "Was ist KI?", das oben "ca. 1 Min" nennt.
- "Gut fragen" ist 15 Bildschirmseiten lang. Die Kernaussage steht ganz unten. Das Quiz liegt noch dahinter.
- Auf meinem Weg "Ich will KI verstehen" kommt "Gut fragen" und "Handwerk" nicht vor. Nutzen sehe ich erst nach Suche.
- Suche "Elektriker" liefert "Recht und Regeln".
- Untertitel überdecken den Bildtext im Video am Handy.
- Die Rolle heißt im Rollenschild "neugierig", das habe ich so nie gesagt.
- Fachwörter wie Token, Temperatur, Reranking, RAG, "GPU: 99 Prozent" ohne Alltagsvergleich an der Stelle, wo sie auftauchen.
- Die Handwerk-Seite hat weder Labor noch Video, ich kann nichts ausprobieren.

## Die drei größten Lücken Richtung Eins-A

1. **Praxisweg für Betriebe ab der Startseite.** Zielaufgaben 2 und 3 brauchen jeweils eine Suche. Sinnvoll wäre unter "Ich will KI verstehen" oder "Ich entscheide im Betrieb" ein Abschnitt "Für den Alltag im Betrieb": Gut fragen, Handwerk, Ist das sicher, und die Handwerk-Seite mit einem eigenen Mini-Labor (Angebot aus einer Notiz) und einem Video.
2. **Seiten für Handy und Abend kürzen, Zeitangaben ehrlich machen.** "Gut fragen" und "Gute Fragen an die KI stellen" sollten im Kurzmodus auf etwa 400 Wörter und ein Ergebnisfeld oben kommen ("Merke: Rolle, Kontext, Format, Grenzen"), Zeitangaben aus der Wortzahl ableiten, Startseite und Kopf müssen dieselbe Zahl nennen (4 gegenüber 1 Minute, 7 gegenüber 9 Seiten).
3. **Labor, das den Lerneffekt zeigt.** Das Prompt-Labor sollte einen deutlich schlechteren "Vorher"-Prompt haben (eine Zeile), die Antworten nicht mitten im Satz abschneiden oder den Abbruch gut sichtbar machen und die Wartezeit mit Fortschritt erklären. Der FI-Schalter-Fehler im Chat wäre ein ideales Beispiel für "Prüfe mit deinem Fachwissen": als Beispielfrage anbieten, mit Hinweis, was das Modell falsch gemacht hat.

Weitere Kleinigkeiten (Priorität B/C): Suche mit Berufswörtern (Elektriker, Maurer, Handwerker, Kundendaten) ergänzen, Untertitel am Handy in den schwarzen Randbereich legen, "Du bist schon auf dieser Seite." entfernen, "neugierig" im Rollenschild durch die gewählte Kachelbeschriftung ersetzen, im Willkommens-Fenster den Fokusring nicht auf die erste Kachel setzen, Antwort auf "Darf ich Kundendaten eingeben?" auf "Ist das sicher?" nach oben holen.

## Hinweise zur Prüfung

- Keine Ratenbegrenzung ("Zu viele Anfragen") und keine Meldung "freier Speicher" aufgetreten. Alle Sprachmodell-Anfragen liefen einzeln mit mindestens 5 bis 10 Sekunden Pause, insgesamt vier Läufe im Prompt-Labor, drei im Chat.
- Das Quiz wurde nur mit den richtigen Antworten durchgespielt. Ein Fehlversuch, die Genau-lesen-Ansicht von "Gut fragen" und das zweite Video wurden nicht geprüft.
- Wortzahlen stammen aus dem Seitentext im Browser (innerText), Seitenhöhen in Pixeln bei Breite 390.
- Die Screenshots im Vollbild zeigen einzelne Blöcke schwarz (verzögertes Nachladen der Grafiken beim Vollseitenfoto). Beim normalen Scrollen waren sie da, kein Seitenfehler.
