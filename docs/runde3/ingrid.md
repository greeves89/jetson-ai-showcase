# Prüfrunde 3: Ingrid (68, Rentnerin, Tablet, große Schrift)

Datum 22.11.2026. Geprüft gegen https://192.168.178.83:8443 mit Chrome headless über Playwright (tests/browser.mjs, starte mit willkommen). Fenster 820x1180 bei Browser-Zoom 125 Prozent, also 656x944 CSS-Pixel. Zusätzlich Zoom 200 Prozent (410x590), Dunkelmodus und Tastatur. 36 Screenshots gemacht und angesehen, 20 davon liegen in `docs/runde3/ingrid-bilder/`. PDFs heruntergeladen und mit pdftoppm -r 60 geöffnet. Das Sprachmodell wurde einmal angefragt (danach mehr als 10 Sekunden Pause), keine Ratenbegrenzung. Chromium lief zweimal ohne Fehlermeldung der Seite von selbst zu (Mac gleichzeitig von anderen Prüfern belastet); ich habe es wiederholt und werte das nicht als Seitenfehler.

## 1. Gesamtnote und Raster

Gesamtnote 7,8 von 10 (Vorrunde 7,0). Der größte Hebel der Vorrunde ist erledigt: Wer "Ich will KI verstehen" wählt, bekommt jetzt zuerst "Echt oder KI?" und "Fake News und Deepfakes". Es bremsen jetzt die Schulbeispiele in den Texten, das Chat-Labor und ein paar blasse oder winzige Stellen.

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter | 7 | Kurze Sätze, aber Schulbeispiele bleiben ("Kunstunterricht", "Mitschüler", "Gerücht in der Klasse", Klassenarbeit). Auf "Was ist KI?" stehen Transformer, Deep Learning, Generative KI ohne Hilfe. "Rückwärtssuche" nennt weiter keinen Dienst. |
| 2 | Einstieg und Führung | 9 | Rollenfenster in 5 Sekunden, Startseite heißt "Neun kurze Seiten: erst Betrug erkennen, dann die Grundlagen". Schritt 2 ist "Echt oder KI?". Chip heißt jetzt wie meine Wahl. |
| 3 | Lernwirkung | 8 | Drei-Satz-Erklärung gelingt für KI, Anruf mit Geldwunsch, Datenspeicherung. Quiz erklärt jede Antwort und zeigt die richtige. Das Chat-Labor verwirrt eher. |
| 4 | Motivation und Spaß | 7 | Mengenbild, Symbolketten, farbiges k-NN-Feld mit Linien zu den Nachbarn sind schön. Kein Erfolgsmoment, kein Bezug zu meinem Alltag im Labor. |
| 5 | Labore und Interaktion | 6,5 | k-NN: 3 Taps, 0,6 s, funktioniert. Chat: 10,5 s bis zum ersten Zeichen (mit Wartebalken), 71 s für 531 Token, rohe Sternchen im Text, Rat nicht auf meine Frage zugeschnitten. |
| 6 | Videos | 7,5 | Tippen in die Bildmitte startet jetzt das Video (Vorrunde nicht). Untertitel an, 15 Cues. Abzüge: Titelbild mit abgeschnittenem rotem Text unter der Steuerleiste, Kapitelliste zeigt 5 von 9 Kapiteln ohne Hinweis zum Scrollen, kein "Nächstes Video". |
| 7 | Navigation und Orientierung | 8 | Menü "Für dich" mit 7 Zeilen, Suche filtert das Menü, Betrug, Enkeltrick, Schockanruf, Phishing, Fake Anruf finden Treffer. Abzüge: "falscher Polizist" und "Glossar" finden nichts; Fuß zeigt Pfad "Unterricht vorbereiten"; Menüknopf ohne Wort. |
| 8 | Vertrauen und Sicherheit | 8,5 | "Nichts wird gesendet", sichtbare Zustimmungen, ehrliche Fußzeile, 16+ klar. Abzug: Chat-Hinweis klein und grau, und das PDF-Kopfzeilen-Platzhalterwort "Lizenz: noch festzulegen" wirkt unfertig. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7,5 | Fließtext 17 px, Karten-Knöpfe 44 px, Fokusring 3 px, Esc schließt das Fenster, kein Querscrollen bei 200 Prozent. Abzüge: Metatexte und Fußzeile nur 13 px, Radio-Kreise im Quiz 13 px, Suchfeld zeigt bei 200 Prozent nur "Seite", blasse "Widerrufen"-Knöpfe. |
| 10 | Fehlerfälle | 8 | "Schreib zuerst eine Frage." in Orange, Suche ohne Treffer mit Beispielwörtern, falsches Quiz ohne Strafe. Abzug: Beispielwörter bei "falscher Polizist" passen nicht zum Thema. |

## 2. Vergleich zur Vorrunde

Besser:
- Rollenpfad "Ich will KI verstehen" enthält jetzt Echt oder KI?, Fake News und Deepfakes (02-start-rolle.png, 03-menue.png). Sprachmodelle, Training und Tokens sind raus aus "Für dich".
- Chip oben zeigt "Ich will KI verstehen" statt "Ich bin: neugierig". Die Schüler-Kachel ist nicht mehr vorgewählt (01-willkommen.png).
- Suche kennt Enkeltrick, Schockanruf, Phishing, Fake Anruf (Vorrunde: Enkeltrick null Treffer).
- Zeitangaben sind einheitlich: Karte und Seite sagen beide "ca. 1 Min Lesen, plus Video 1:24, plus Labor ca. 3 Min".
- Video startet per Tipp auf die Bildmitte. Chat zeigt eine Wartezeit-Leiste "Warten auf das erste Token" (16b-chat-10s.png).
- Quiz zeigt bei falscher Antwort die richtige grün (11-quiz-falsch.png).
- Beispiel "Rückwärtssuche": jetzt mit Satz, dass es Dienste in Suchmaschinen gibt (aber weiter ohne Namen).

Gleich:
- Schulbeispiele in meinen Pfadseiten. Der Satz "Du liest gerade kurz ..." (35 Wörter) auf jeder Seite. "Du bist schon auf dieser Seite." auf Was ist KI?.
- Seite "Ist das sicher?": erst Zustimmungs-Kasten, die kurze Antwort danach (13-sicher-oben.png). Fußhinweis "Pfad 'Unterricht vorbereiten', Schritt 16 von 17" bleibt.
- Die Chat-Antwort bleibt lang und unpassend. Meldungen "Widerrufen" bleiben blass.

Schlechter oder neu:
- Rohe Markdown-Sternchen (**fett**) im Chat-Text (17-chat-fertig.png).
- Neuer Kasten "Weiter, wo du aufgehört hast" sagt zugleich "Noch nichts gelesen (85 Seiten)" und zwei Knöpfe im abweichenden Stil (siehe Befunde).
- Das PDF-Kopfzeilenfeld "Lizenz: noch festzulegen" ist neu sichtbar.

## 3. UX- und UI-Befunde

### Blocker
Keine.

### Hoch
1. Chat-Labor, Seite /chat, Abschnitt "Live ausprobieren", 17-chat-fertig.png: Antworten zeigen rohe Sternchen ("**Kontaktiere eine Vertrauensperson**"). Auf meine Frage ("Mein Enkel ruft an und braucht dringend Geld. Ist das eine KI-Stimme?") riet das Modell am Ende zu "Kinder- und Jugendhilfe" und sagte nichts von Auflegen und Zurückrufen, wie es die Lehrseite fordert. Der Hinweis "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." steht klein und grau (13 px) unter dem Feld. Es fehlt eine betrugstaugliche Beispielfrage unter den drei Vorschlägen (Token, Roboter, Jetson). Wartezeit 71 s für 531 Token (7,5 Token pro Sekunde), erstes Zeichen nach etwa 10 s bei nicht geladenem Modell. Zielgruppe Rentnerin: der Chat ist die sichtbarste Stelle, an der falscher Betrugsrat entstehen kann.
2. Pfadseiten in "Für dich" sind für Schüler geschrieben. Seite /echt-oder-ki, Abschnitt "Prüfwege", "Mehr dazu", 09-stimmen-offen.png: "Beispiel aus dem Alltag: Ein Gerücht in der Klasse ...". Weitere Treffer in der Suche der Seiten: Kunstunterricht, Mitschüler (Echt oder KI?), Mitschüler und Lehrkräfte (Fake News), Klassenarbeit (Quellen prüfen). Für mich nicht aus dem Alltag.
3. Seite /sicherheit-einfach, Fuß, Abschnitt "Nächste Seite im Pfad": "Pfad 'Unterricht vorbereiten', Schritt 16 von 17" und "Recht und Regeln im Überblick", obwohl meine Rolle "KI verstehen" ist. Der Pfad folgt nicht der Rolle (Seite wurde von der Startseite über "Mehr dazu" geöffnet).

### Mittel
4. Seite /sicherheit-einfach, oben, 13-sicher-oben.png: Das Wichtigste ("Kein Konto, kein Foto gespeichert, Texte nur kurz") steht erst unter dem Zustimmungs-Kasten, nach rund einer Bildschirmhöhe. Die drei "Widerrufen"-Knöpfe sind blass (deaktiviert) und wirken kaputt, solange nichts zugestimmt ist.
5. Startseite nach "Weiter lesen"-Kasten (zeigt sich, sobald ich schon Seiten geöffnet habe, 41-knn-Lauf, Startseite): "Noch nichts gelesen (85 Seiten)" neben "Du warst zuletzt bei 'Maschinelles Lernen'". Die Knöpfe "In diesem Browser merken" und "Fortschritt löschen" haben eckige graue Rahmen, ganz anders als die runden Knöpfe sonst, und brechen unschön in zwei Zeilen um.
6. Video-Titelbild, Seite /echt-oder-ki, Abschnitt "Erklärvideo", 31-dunkel-echt.png: Ein roter Schriftzug "Eine Herkunft: nur eine Behauptung" liegt halb unter der Steuerleiste (dunkelrot auf Schwarz, schlecht lesbar). Im Dunkelmodus ist das Titelbild hell auf dunkler Seite.
7. Kapitelliste unter dem Video: scrollt in einem 224 px hohen Kasten, zeigt 5 von 9 Kapiteln, kein sichtbarer Hinweis (Schatten oder Pfeil). Wer nicht scrollt, sieht "Dein Plan" nie.
8. Suche, Seitenmenü: "falscher Polizist" und "Glossar" liefern "Dazu habe ich nichts gefunden" mit den Beispielwörtern Chat, Datenschutz, Hausaufgaben, Bilder, Roboter, Kosten (alle ohne Bezug zu Betrug). Im Menü zeigt die Suche zusätzlich einen leeren grauen Balken unter dem Fortschritt (leeres Ergebnisfeld, 24 px hoch; 05-suche-enkeltrick.png).
9. Bei 200 Prozent Zoom schrumpft das Suchfeld auf "Seite" (24-zoom200-menue.png, 20-zoom200-start.png). Die Rolle als Chip frisst Platz. Das Menü-Symbol (drei Striche) hat weiter kein Wort daneben.
10. "Echt oder KI?" bleibt textlastig: 1549 Wörter in "Genau lesen", die Stimmen (mein Thema) kommen als dritter Block nach rund 2 Bildschirmen (08-echt-s3300.png). Kein Beispielbild von echten KI-Fehlern, nur Symbolkarten. Das Kartenset "Echt oder KI?" (12 Bildkarten) wäre dafür ideal, hängt aber nur an der Schulseite Medien 1. Von meiner Seite aus gibt es keinen Link.
11. PDFs: Alle drei geprüften (Kartenset 2 S., Elternabend-Infoblatt 1 S., Arbeitsblatt Medien 1 mit 3 S.) sind sauber gesetzt, Raster gleichmäßig, QR-Codes vorhanden. Aber die Kopfzeile jeder Seite sagt rechts "Lizenz: noch festzulegen". Das wirkt unfertig. Das Infoblatt ist an Eltern von Klasse-8-Kindern gerichtet ("Ihre Klasse lernt ...") und für mich als Oma nur halb passend.

### Klein
12. Rollenfenster: Zweitzeilen 13 px (01-willkommen.png), Kachel "Ich bin Schüler:in" mit längster Zusatzzeile; Schließen-Kreuz ist in der Tab-Reihenfolge ganz am Ende (nach "Später" geht der Fokus erst auf "Zum Inhalt springen", dann auf das Kreuz).
13. Menü: "Maschinelles Lernen", "Daten", "Neuronale Netze" haben dasselbe Symbol (drei Punkte im Diagramm), die Zeilen unterscheiden sich nur im Text (03-menue.png).
14. "Du liest gerade kurz: ..." (35 Wörter, jede Seite). "Du bist schon auf dieser Seite." (Was ist KI?, unterhalb der Begriffskarte, 40-karte-1100.png) ist unklar.
15. Chat: Modell-Etikett "im Speicher" wird nach dem Laden zu einem überhohen grünen Oval (56 px statt etwa 26 px, 16b-chat-10s.png), "Modell laden" bleibt daneben stehen und wirkt wie eine offene Pflicht.
16. Startseite, Fuß, 12-start-fuss.png: "Mehr dazu" bricht mitten im Link auf zwei Zeilen um, und derselbe Linktext steht auf jeder Seite für Verschiedenes.
17. k-NN-Labor: weiter "Zeiger" und "klicke ins Feld" auf einem Tablet; die Gedankenbrücke "Spam oder nicht" steht erst weiter unten.
18. Quiz: Radio-Kreise nur 13 px, die ganze Zeile (46 px) ist antippbar. Gut genug, aber optisch klein.
19. Links: In "Weiter geht es" zeigen die Links auf `#/quellen-pruefen`, andere auf `/fake-news-deepfakes`. Funktioniert, aber zwei Schreibweisen.

Gut gelungen (Auswahl): Layout und Kartenraster auf der Startseite (gleichmäßige Abstände, ein Knopf je Karte, 02-start-rolle.png). Kontrast hell und dunkel in Ordnung (Text 95,95,100 auf Hellgrau, Dunkelmodus ohne Lesefehler, 31-dunkel-echt.png). Kein Querscrollen bei 200 Prozent. Animierte Schrittkette ("Drei Prüfwege") bleibt ruhig. Ladezeit der Seiten rund 0,9 s. Keine Konsolenfehler in den geprüften Seiten.

## 4. Zielaufgaben

| Aufgabe | Gelöst | Weg | Klicks | Zeit |
|---|---|---|---|---|
| 1. Was ist KI in einfachen Worten | Ja | Startseite, Karte "Was ist KI?", Öffnen. Mengenbild, "Du bist schon auf dieser Seite" verwirrt, Fachwörter Transformer, Deep Learning bleiben leer | 1 Tippen | rund 1 s bis Seite (910 ms), Video 1:24 |
| 2. Betrug mit KI-Stimmen oder Bildern erkennen | Ja | Startseite, Schritt 2 "Echt oder KI?", Öffnen. Alternativ Suche "Betrug", "Enkeltrick" oder "Fake Anruf" (Treffer in Medienkompetenz). Erklärung: "Bei Druck und Geldwünschen erst auflegen, dann über einen bekannten Weg nachfragen", dazu Codewort | 1 Tippen (Suche: 3) | rund 1 s bis Seite, Lesen etwa 5 Minuten |
| 3. Speichert das Labor etwas über mich | Ja | Startseite, Fuß, "Ist das sicher? ... Mehr dazu". Oder Suche "speichert" (Treffer unter anderem "Ist das sicher?") | 1 Tippen plus Scrollen | rund 1 s bis Seite, 10 s bis zur Antwort. Antwort selbst klar: kein Konto, kein Foto gespeichert, Texte nach 30 Minuten vergessen |

Meine Drei-Satz-Erklärung für Aufgabe 2: "Eine Stimme am Telefon kann nachgebaut sein, ich höre das nicht sicher. Wenn jemand Geld will und es eilig macht, lege ich auf und rufe die Nummer an, die ich kenne. Mit der Familie sprechen wir ein Codewort ab." Das gelingt aus dem Text, nicht aus dem Chat.

## 5. Empfehlung und die drei größten Lücken

Ja, ich würde es Bekannten ab 60 empfehlen: Wer die Startseite aufmacht, landet in zwei Tippern bei "Echt oder KI?" und versteht, was bei einem Anruf mit Geldwunsch zu tun ist. Für den Chat gilt weiter: nicht blind glauben.

Die drei größten Lücken Richtung 10:
1. Das Chat-Labor für meine Rolle absichern: Markdown richtig darstellen, eine Beispielfrage "Mein Enkel ruft an und will Geld" mit geprüfter Antwort anbieten, Warnhinweis gut sichtbar machen, Antworten kürzen, Wartezeit ("rund eine Minute") nennen.
2. Pfadseiten auf Erwachsene zuschneiden: Schulbeispiele (Kunstunterricht, Mitschüler, Klasse, Klassenarbeit) durch Alltag Erwachsener ersetzen, Fachwörter auf "Was ist KI?" erklären, "Rückwärtssuche" mit einem Beispiel nennen, Pfadhinweis im Fuß an die Rolle binden, Kartenset "Echt oder KI?" von der Seite "Echt oder KI?" aus verlinken, "Lizenz: noch festzulegen" in den PDFs ersetzen.
3. Kleine Lesbarkeitsstellen: Metatexte und Fuß von 13 auf mindestens 15 px, blasse "Widerrufen"-Knöpfe klar erklären oder ausblenden, Antwort der Seite "Ist das sicher?" vor den Zustimmungs-Kasten, Kapitelliste mit Scroll-Hinweis, Titelbild-Text nicht unter die Steuerleiste, "falscher Polizist" und "Glossar" in die Suche, leeres graues Feld unter dem Menü-Fortschritt entfernen.
