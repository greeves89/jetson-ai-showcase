# Prüfrunde 2, Welle 2: Hakan (45, Vater eines 14-Jährigen, Laptop 1440x900)

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443 (Jetson im LAN), headless Chrome über tests/browser.mjs, Rolle im Willkommens-Fenster: "Ich bin Elternteil". Screenshots: /tmp/welle2-hakan/. Es wurde nichts am Code geändert.

Meine Rolle: Ich will am Wochenende mit meinem Sohn etwas ausprobieren, ihm zeigen, dass man KI-Antworten nicht blind glaubt, und wissen, wie man Hausaufgaben mit KI fair hält. Das "Mitspieler-Szenario" habe ich so gespielt: zwei Durchgänge am selben Gerät mit gleichem Startwert, einmal als Sohn (rät, immer Antwort 1), einmal als Vater (wechselt die Antworten).

Sprachmodell: drei Anfragen an den Chat, jeweils eine zur Zeit. Hinweis zur Ehrlichkeit: Die erste Anfrage habe ich durch eine zu kurze Wartezeit meines Skripts nach 1,5 s abgebrochen (Browser geschlossen) und sofort danach die nächste gestellt, die Anfragen können sich also kurz überlappt haben. "Freier Speicher" und "Zu viele Anfragen" kamen nicht vor.

## 1. Willkommens-Fenster, Startseite, Menü

Willkommens-Fenster (Beleg 01-start.png): Titel "Willkommen im KI-Labor", Frage "Für wen darf es sein?", sechs Kacheln (Schüler:in, Unterrichte, KI verstehen, IT, Betrieb, Elternteil), dazu "Meinen Lernfortschritt in diesem Browser merken" und "Später". Die Kachel "Ich bin Elternteil" trägt den Untertitel "Sicher und verständlich". Das trifft, was ich erwartet habe. Nach der Wahl lag die Seite sofort passend da, ca. 1,6 s im Skript (keine Seitenneuladung). Oben rechts steht "Ich bin: Elternteil" und lässt sich ändern.

Eine Kleinigkeit: Die Kacheln stehen zweimal im DOM (auch versteckt auf der Startseite). Für Menschen unsichtbar, für Screenreader und Tests irritierend (mein erster Klick lief ins Leere).

Startseite für Eltern (02-nach-rolle.png): Überschrift "KI im Alltag deiner Kinder", Untertitel "Was ist sicher, was passiert mit Daten, woran erkennst du Erfundenes?", zwei Plaketten "Kostenlos" und "Ohne Anmeldung", Statuszeile des Rechners ("bereit und frei, 0 Prozent ausgelastet"), drei Empfehlungskarten (Ist das sicher?, Datenschutz im Alltag, Echt oder KI?), eingeklappt "Weitere Wege", darunter drei Infokarten (Kamera ab 16, "Ab wann?", "Was ist ein Jetson?"). Aufgeräumt und ruhig.

Menü beim Start, Zählung: Gruppe "Für dich" mit 7 Einträgen (Start, Ist das sicher?, Datenschutz im Alltag, Echt oder KI?, Info Eltern, KI und Hausaufgaben, Gute Fragen stellen) plus ein eingeklappter Knopf "Alle Bereiche". Dazu Suchfeld und Fortschrittsbalken "Noch nichts gelesen". Sichtbar also 1 Gruppe, 7 Seiten, 1 Aufklapper, 1 Suche. Das ist nicht überladen. Hinter "Alle Bereiche" liegen elf weitere Gruppen (Medienkompetenz, Sicherheit, Für die Schule, Experimente, Grundlagen, Sehen, Sprache, Wissen und RAG, Agenten, Daten und Prognosen, KI im Betrieb) mit rund 90 Einträgen. Ordentlich versteckt.

Fünf Punkte, die ich erwarte: Start, Ist das sicher?, Echt oder KI?, KI und Hausaufgaben, Experimente. Der letzte fehlt im Eltern-Menü (siehe Zielaufgabe 1). Nie angeklickt hätte ich: Sehen/Wissen und RAG/Agenten/Daten und Prognosen/KI im Betrieb (Technikbegriffe ohne Nutzen für mich als Vater).

## 2. Zielaufgaben

### Aufgabe 1: Experiment für Vater und Sohn finden und spielen
Gelöst, aber nicht auf dem naheliegenden Weg.
- Im Eltern-Menü gibt es keinen Eintrag "Experimente". Weg A über das Menü: "Alle Bereiche" aufklappen, Gruppe "Experimente" aufklappen, "Experimente" anklicken: 3 Klicks. Weg B über die Suche: "Experiment" eintippen, ein Klick auf den ersten Treffer "Experimente": 2 Handlungen. Der Treffer steht an erster Stelle, gut.
- Die Seite "Experimente, leicht erklärt" nennt: "Alle Experimente laufen ohne Kamera und ohne Mikrofon." Neun Karten, jede mit "OHNE KAMERA" oder "MIT BEISPIELBILDERN" markiert und "ca. 4 Min". Das ist genau meine Frage (Labore ohne Kamera) und sofort beantwortet. Gut.
- Suche mit meinen Alltagswörtern: "Vater Sohn" liefert nichts, "zusammen ausprobieren" liefert Sprachmodell im Chat und Gut fragen, "Spiel" liefert Experimente zuerst. Es gibt also keinen Hinweis "zu zweit".
- Abfolge im Skript: Startseite, Rolle, Experimente, "Starten" beim Punkte-Labor, rund 4,3 s. Mit Lesen und Überlegen rechne ich als Vater realistisch mit unter zwei Minuten.
- Schwäche: "Starten" beim Punkte-Labor führt auf die ganze Lektion "Maschinelles Lernen" mit Erklärvideo oben (89 s) und dem Spielfeld erst darunter. Ich musste scrollen, um zu "Ausprobieren" zu kommen. Eine Karte "Starten", die erst ein Video zeigt, hält ihr Wort nur halb.

Gespielt habe ich zwei Labore.
1. Punkte-Labor (Lektion Maschinelles Lernen): vier blaue Punkte links, vier orange rechts gesetzt, ein grüner in die Mitte, "Entscheidungsfläche zeigen" an. Ergebnis: das Feld färbt sich blau links und orange rechts, eine grobe Trennlinie entsteht (09-punkte-flaeche.png). Die Statuszeile erklärt: "Du hast 8 Punkte gesetzt. Fahre mit dem Zeiger über das Feld: Der Rechner sucht dann die 5 nächsten Punkte und lässt sie abstimmen." Verständlich, funktioniert sofort. Aber: Zu zweit hat das keine Struktur. Es gibt keine Aufgabe ("Setz Punkte so, dass der Computer sich irrt"), kein Ziel, keinen Wettbewerb. Wir hätten nach zwei Minuten aufgehört. Dazu Fachwörter wie "k (Nachbarn)" und "Entscheidungsfläche" ohne Erklärung am Regler.
2. "Erkenne die Risiken" (Fehler-Spiel, Seite "Grenzen und Risiken von Sprachmodellen"): zehn Karten, kein Sprachmodell nötig, kein Jetson-Verbrauch. Das Spiel hat einen Startwert ("Gleicher Startwert, gleiche Karten in gleicher Reihenfolge") und am Ende "Dieselbe Runde noch einmal". Das ist die beste Vater-Sohn-Mechanik im ganzen Labor, auch wenn sie so nicht beworben wird: Beide geben denselben Startwert ein (ich: 4711), jeder spielt für sich, dann vergleicht man. Meine zwei Durchgänge: Sohn (rät) 3 von 10, Vater (wechselt) 3 von 10. Die Auswertung nach Art ("Erfundene Antworten 0 von 3, Prompt-Injection 1 von 3, Datenschutz 0 von 2, Wer prüft? 2 von 2") und "Das verwechselst du noch" ist lehrreich, die Erklärung nach jeder Karte mit "Was du tun würdest" ebenfalls. Streng gesehen:
   - Auf jeder richtig beantworteten Karte erscheint unter "Richtig." das Wort "null" (13-spiel-feedback.png, in beiden Runden bei jeder richtigen Karte reproduziert). Ein sichtbarer Fehler, der gerade beim Erfolgserlebnis stört. Ursache vermutlich ein `null` als Kindelement im Rückmelde-Block (app/static/widgets-sprache.js, Funktion waehle: `ok ? null : ...`), nur gemeldet, nicht geändert.
   - Die Karten kommen aus dem Büroalltag (Preisliste, Skript mit Zugangsdaten, Zahlungserinnerung an Kunden, Überweisungen unter 10.000 Euro). Für einen 14-Jährigen ist das fremd. Der Text sagt es selbst: "Zehn Karten aus dem Arbeitsalltag mit Sprachmodellen". Als Vater fand ich das spannend, mein Sohn würde abwinken.
   - Es gibt keinen gemeinsamen Spielstand und keinen Vergleich im Gerät, man vergleicht die "x von 10" selbst.

Fazit zur Frage "Macht es gemeinsam Spaß und lehrt es etwas?": Ja beim Startwert-Kartenspiel, mit Abstrichen. Beim Punkte-Labor lehrt es etwas (Nachbarn stimmen ab), macht zu zweit aber kaum Spaß. Als Vater-Sohn-Angebot fehlt eine ausdrückliche Anleitung "Zu zweit probieren".

Zusätzlich Chat-Labor (Sprachmodell im Chat) als "KI-Antworten prüfen"-Übung: Ich habe gefragt "Wer hat 1998 die Fußball-Weltmeisterschaft gewonnen und wie ging das Finale aus?" und das ist mir nicht gelungen, ich wollte nur sehen, was das kleine Modell (llama3.2:3b) macht. Ergebnis, 16,3 s und 142 Tokens (19-chat-antwort.png): Frankreich, 3:0 gegen Brasilien (stimmt), Ort Stade de France (stimmt), aber "ein Tor für Zidane und ein Eigentor von Djalma Santos", was nicht stimmt. Zweite Anfrage, gleiche Frage, 17,3 s: "Parc des Princes in Paris", "Tore von David Trezeguet", "Wiederholungsfinale gegen Dänemark", "mit einem einzigen Spieler über einen gesamten Jahr und 11 Monate" (20-chat-antwort2.png), bis zum Unsinn. Das ist ein Glücksfall für meinen Zweck: Mein Sohn und ich vergleichen mit Wikipedia und sehen, dass die Antwort zugleich richtig klingt und teils erfunden ist. Das Labor selbst nutzt diese Chance nicht: Unter dem Chat steht nur "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." Die Seite verlinkt auf "Lizenzen" und "Gut fragen", nicht auf "Quellen prüfen", "Echt oder KI?" oder "Grenzen". Es fehlt der Satz "Prüft diese Antwort jetzt gemeinsam" mit dem Weg dahin.

### Aufgabe 2: Wie prüft man KI-Antworten?
Gelöst. Suche "stimmt das" liefert als Erstes "Quellen prüfen", dann "Echt oder KI?". Suche "KI-Antwort prüfen" findet dagegen nur "Stunde 3: Echt oder erfunden?" und die Lehrkräfte-Handreichung, nicht die Seite "Quellen prüfen". Suche "Quellen" ordnet "Lizenzen und Quellen" und "Grenzen" vor "Quellen prüfen" (an letzter Stelle). Die Trefferreihenfolge ist also unzuverlässig. Über das Eltern-Menü (Echt oder KI?) geht es in einem Klick; "Quellen prüfen" steht nicht im Eltern-Menü, erst über "Alle Bereiche, Medienkompetenz" (3 Klicks) oder als "Nächste Seite im Pfad" am Ende von "Echt oder KI?".

### Aufgabe 3: Hausaufgaben mit KI fair machen
Gelöst, Menü "Für dich" enthält "KI und Hausaufgaben" direkt (1 Klick). Suche "Hausaufgaben" findet die Seite an fünfter Stelle nach Gut fragen, Grenzen, Sprachmodell im Chat und Recht und Regeln. Ohne Menü wäre sie schlecht zu finden.

## 3. Die drei Seiten als Gesprächsstoff für mich als Vater

Gemeinsam: Jede Seite hat ein Erklärvideo (2:29 bei Quellen prüfen, bis 2:04 Kapitel bei den anderen), Kernsätze mit "Mehr dazu", "Das nimmst du mit", vier Quizfragen, Pfad-Verweis. Sprache ist durchgehend "du" und an Jugendliche gerichtet. Auf keiner der drei Seiten kommen Wörter wie Eltern, Kind, gemeinsam, zusammen, Sohn vor (ich habe gesucht, Ergebnis: leer bei "Echt oder KI?" und "Quellen prüfen", nur eine zufällige Textstelle bei Hausaufgaben).

"Echt oder KI?" (817 Wörter): Ehrliche Ausgangslage ("Niemand erkennt KI-Inhalte sicher"), Bilder, Texte, Stimmen, drei Prüfwege (Woher, Rückwärtssuche, Kontext), Warnung vor Erkennungsprogrammen, Tipp bei Geldwunsch am Telefon (auflegen, zurückrufen). Für mich als Vater echter Gesprächsstoff, besonders die Stimmen-Karte (Familien-Notruf mit geklonter Stimme) und die Aussage zu Erkennungsprogrammen. Keine Aufgabe, die ich mit dem Sohn machen könnte (keine Bilder zum Raten, keine zwei Bilder "echt oder KI?"), obwohl der Titel das verspricht. Das Video beginnt mit "Zwei Bilder", die Seite selbst hat aber keine Übung mit Bildern. Das ist die größte Enttäuschung bei dieser Seite.

"KI und Hausaufgaben fair" (833 Wörter): Die Leitfrage "Hast du danach mehr verstanden, oder hast du nur etwas abgegeben?" ist der beste Satz für ein Gespräch mit dem Sohn. Gegenüberstellung "Hilft beim Lernen" und "Nimmt die Arbeit ab", Tabelle "Du gibst es an / nicht an" gegen "Regeln erlauben es", Angabe der KI-Hilfe (Werkzeug, Datum, Wofür, Eigenanteil), Fragen an die Lehrkraft. Sehr brauchbar. Fehlt: Was tue ich als Elternteil (nicht kontrollieren, sondern Fragen stellen), eine Mustervereinbarung für zuhause, ein Hinweis, wie ich einen KI-Text meines Sohnes erkenne ohne Misstrauen, und wann ich ihm die Hilfe verbiete. Die Seite redet nur mit dem Schüler, nicht mit mir.

"Quellen prüfen" (813 Wörter): Vier Züge (Stopp, Urheber, andere Berichte, zurückverfolgen), Seitwärtslesen, "drei Blogs, aber nur eine Quelle", Datumsfalle, "Chatbot als Quelle?". Das passt hervorragend zu meinem Chat-Experiment oben. Quiz mit sinnvollen Distraktoren, Rückmeldung nach jeder Frage nennt den Grund (23-quiz.png). Mein Probelauf: 3 von 4 richtig, Frage 2 absichtlich falsch, die Rückmeldung erklärt "Kopien erhöhen die Zahl der Seiten, aber nicht die Zahl der Belege". Gut.

Gesprächsstoff gesamt: ja, aber zu Schülerinnen und Schülern gesprochen. Ich muss die Seiten selbst in eine Familienrunde übersetzen.

Weitere Beobachtungen zu den Eltern-Seiten:
- Erster Schritt des Pfades "Neu hier" für Eltern ist "Information für Eltern" (schule-eltern). Der Text lautet "Ihre Klasse arbeitet im Unterricht mit dem KI-Labor. Hier lesen Sie ..." (Sie-Form, Elternbrief der Schule). Für mich als privaten Nutzer ist das falsch: Mein Sohn arbeitet im Unterricht gar nicht damit. Danach steht dieselbe Seite mit "Das nimmst du mit" im Du-Ton. Ton und Zielgruppe brechen mitten auf der Seite.
- Zeitangaben: "Echt oder KI?" zeigt "ca. 1 Min", obwohl das Video allein über zwei Minuten läuft und die Seite 817 Wörter hat. Fast jede Seite hat "ca. 1 Min". Das ist irreführend und mindert Vertrauen.
- Textlastigste Stellen (Frage 4): (1) "Echt oder KI?" im Pfad (Abschnitte Bilder, Texte, Stimmen, Programme, 817 Wörter, bei "Genau lesen" mehr), (2) "KI und Hausaufgaben fair", Abschnitt "Wann es zum Problem wird" mit der Vier-Felder-Tabelle und dem anschließenden Fließtext, (3) "Grenzen und Risiken von Sprachmodellen" mit acht Abschnitten (901 Wörter). Mit "Kurz lesen" als Standard ist das gut abgefedert.

## 4. Video, Quiz, Fehlerfälle

- Video "Quellen prüfen": Dauer 2:29 (149 s), deutsche Untertitel als Spur vorhanden (`subtitles de`), neun Kapitel mit Zeitmarken zum Anklicken, Hinweis "Sprecherstimme KI-erzeugt" mit Link zu Lizenzen. Das Verweis-Satzstück "Der Verweis am Ende der Folge meint diese Seite" ist hilfreich. Mängel: Am Ende (2:23) überdecken die Untertitel den Bildtext des Merksatz-Bildes (21-video-ende.png, die Untertitelzeile liegt über der Karte "Nichts gefunden? Dann nicht teilen."). Mit Untertiteln an wird das Schlussbild unlesbar.
- Quiz: vier Fragen, sofortige Rückmeldung mit Begründung, am Ende "3 von 4 richtig". Verständlich.
- Fehlerfälle: Leere Eingabe im Chat: "Schreib zuerst eine Frage." (freundlich, mit klarem Handlungshinweis). Suche ohne Treffer: "Dazu habe ich nichts gefunden. Probiere zum Beispiel: Chat, Datenschutz, Hausaufgaben, Bilder, Roboter, Kosten" (sehr gut). Nicht vorhandene Adresse: HTTP 404 mit "Seite nicht gefunden. Diese Adresse gibt es im KI-Labor nicht. Zur Startseite" (ordentlich, mit Link). Kamera abgelehnt habe ich nicht getestet, weil meine Aufgaben ohne Kamera auskommen und das für mich als Vater der Beweis ist, dass "ohne Kamera" auch stimmt.
- Tastatur und Lesbarkeit: Tab-Reihenfolge Zum Inhalt springen, Suche, Start, Neu hier (sinnvoll, Fokusrahmen 3 px, nur beim Suchfeld "outline none" mit eigener Rahmung sichtbar), Fließtext 17 px.
- Konsole: keine Fehlermeldungen in den Skriptläufen.

## 5. Bewertung nach dem Zehn-Punkte-Raster

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter | 8 | Kurze Sätze, Du-Ton, Fachwörter erklärt. Abzug: "k (Nachbarn)", "Entscheidungsfläche", "Injection" ohne Hilfe am Ort. |
| 2 | Einstieg und Führung | 6,5 | Rollenfenster und Elternstartseite sind klar. Aber: Kein "Experimente" im Eltern-Menü, "Quellen prüfen" fehlt dort ebenfalls, erster Pfadschritt ist ein Schul-Elternbrief im Sie-Ton. |
| 3 | Lernwirkung | 7 | Eigene Erklärung in drei Sätzen: "KI klingt sicher, auch wenn sie danebenliegt. Ich prüfe Herkunft, Datum und eine zweite, unabhängige Quelle, und Hausaufgaben mit KI gebe ich als Hilfe an, nicht als eigene Leistung." Das trage ich vor allem wegen der Chat-Antworten und des Quiz davon, nicht wegen der Labor-Anleitungen. |
| 4 | Motivation und Spaß | 5,5 | Startwert-Kartenspiel macht zu zweit Spaß, Punkte-Labor ohne Ziel nicht, Inhalte sind büroorientiert, keine Zwei-Personen-Anleitung, kein Wettbewerb, kein Erfolgserlebnis jenseits "3 von 10". |
| 5 | Labore und Interaktion | 6,5 | Punkte-Labor und Risiko-Spiel funktionieren, Chat 16 bis 17 s für eine Antwort (erstes Token nach 0,8 bis 1,2 s) ist ok und wird live erklärt. Abzug: sichtbares "null" bei jeder richtigen Karte, "Starten" führt zur Lektion statt zum Labor. |
| 6 | Videos | 7 | 2:29, Kapitel, Untertitel, Hinweis auf KI-Stimme, Verweis. Untertitel überdecken am Ende Bildtext. Zeitangabe "ca. 1 Min" auf Seiten mit Video passt nicht. |
| 7 | Navigation und Orientierung | 6,5 | Suche mit Nachbarschaft-Treffern und "nichts gefunden"-Hilfe gut, aber Trefferreihenfolge unzuverlässig ("Quellen" findet "Quellen prüfen" zuletzt, "KI-Antwort prüfen" gar nicht). Zurück-Knopf und Pfad-Verweise vorhanden, Fortschrittsbalken "Noch nichts gelesen". |
| 8 | Vertrauen und Sicherheit | 8 | "Kostenlos, ohne Anmeldung", "Ab wann? Kamera, Mikro und Gesicht ab 16" gleich auf der Elternstartseite, Experimente ausdrücklich ohne Kamera, Hinweis "Antwort eines KI-Modells. Sie kann falsch sein", "Built with Llama". Abzug: "Jüngere nur mit Einverständnis der Eltern, kein Alterscheck" ist ehrlich, aber ich erfahre nicht, was ich als Vater konkret tun soll. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7,5 | Skip-Link, Fokus sichtbar, 17 px, Tasten 1 bis 3 im Spiel. Abzug: Untertitel-Überlagerung, Doppel-DOM der Rollenkacheln. |
| 10 | Fehlerfälle | 8,5 | Leere Eingabe, Suche ohne Treffer, 404: alle freundlich mit Handlungshinweis. |

Gesamtnote: **6,8 von 10.** Ein solides, ehrliches Lernlabor mit guten Einzelseiten, das als Eltern-Angebot noch nicht fertig ist: Es spricht Jugendliche an, nicht mich, und es hat keine Anleitung zum gemeinsamen Ausprobieren.

Würde ich es weiterempfehlen? Ja, eingeschränkt, an andere technikaffine Eltern von Jugendlichen ab 13, wenn sie mit ein bisschen Eigeninitiative arbeiten. Grund: Die Inhalte (Quellen prüfen, Hausaufgaben fair, Risiko-Spiel) sind sachlich gut und kostenlos ohne Anmeldung, und das Experimentieren ohne Kamera ist glaubwürdig. Ohne Anleitung für zu zweit würde ich es aber nicht als "Programm für die Familie" empfehlen.

Die drei größten Lücken Richtung Eins-A:
1. Ein echter Eltern-Pfad für gemeinsames Arbeiten: Seite "Zusammen ausprobieren" im Eltern-Menü mit drei Aufgaben für zwei Personen (Risiko-Spiel mit gleichem Startwert und Vergleich, Chat-Frage mit Faktencheck gegen eine Quelle, Punkte-Labor mit Ziel "bring den Computer dazu, sich zu irren"), je ca. 10 Minuten, mit Gesprächsfragen für den Vater. Dazu "Experimente" und "Quellen prüfen" ins Eltern-Menü und den Schul-Elternbrief aus dem Pfad "Neu hier" nehmen (oder in Du-Ton für Privatnutzer fassen).
2. Aus Chat-Antworten eine Prüfübung machen: Unter dem Chat ein Knopf oder Link "Antwort prüfen" mit Verweis auf "Quellen prüfen" und eine Fünf-Schritte-Karte (Behauptung markieren, Quelle suchen, Datum, zweite Quelle). In "Echt oder KI?" fehlt eine Bild-Übung, die der Titel und das Video ("Zwei Bilder") versprechen. In "KI und Hausaufgaben" fehlt ein Abschnitt für Eltern.
3. Kleine Fehler beseitigen, die Vertrauen kosten: Wort "null" im Risiko-Spiel, Untertitel über dem Schlussbild, "ca. 1 Min" bei Seiten mit Video, Trefferreihenfolge der Suche (Quellen prüfen zuerst bei "Quellen" und "KI-Antwort prüfen"), "Starten" bei Experimenten direkt ins Spielfeld statt in die Lektion, Risiko-Karten mit Alltags- und Schulbeispielen für Jugendliche zusätzlich zum Büroalltag.

## 6. Antworten auf die fünf Zusatzfragen

1. Rolle im Willkommens-Fenster: Erwartet habe ich eine Kurzauswahl und danach eine passende Startseite. Passiert ist genau das: sechs Kacheln, "Ich bin Elternteil" mit dem Untertitel "Sicher und verständlich", danach die Elternstartseite "KI im Alltag deiner Kinder". Die Wahl wirkt sofort und lässt sich oben rechts ändern. Kleiner Mangel: Die Kacheln liegen doppelt im DOM.
2. Menü: Nicht überladen. Beim Start 1 Gruppe ("Für dich") mit 7 Einträgen, 1 Aufklapper "Alle Bereiche" (11 weitere Gruppen, rund 90 Einträge, eingeklappt). Erwartet hätte ich: Start, Ist das sicher?, Echt oder KI?, KI und Hausaufgaben, Experimente. Nie anklicken würde ich: Sehen, Wissen und RAG, Agenten, Daten und Prognosen, KI im Betrieb.
3. Zielaufgaben: (1) Experiment gelöst, 2 Handlungen über die Suche oder 3 Klicks über das Menü, ca. 4 s im Skript; Gesuchtes lag nicht im Eltern-Menü. (2) KI-Antworten prüfen gelöst: 1 Klick auf "Echt oder KI?", 3 Klicks bis "Quellen prüfen" oder über die Suche "stimmt das". (3) Hausaufgaben gelöst: 1 Klick im Menü. Gesucht habe ich zuerst in der Suche und im Eltern-Menü.
4. Textlastigste Stellen: "Echt oder KI?", Abschnitte Bilder, Texte, Stimmen (817 Wörter); "KI und Hausaufgaben fair", Abschnitt "Wann es zum Problem wird" (833 Wörter); "Grenzen und Risiken von Sprachmodellen", acht Abschnitte (901 Wörter). Dazu die Seite "Information für Eltern" mit Sie-Text.
5. Empfehlung: Ja, an technikaffine Eltern von 13- bis 16-Jährigen. Zwei Sätze: "Kostenlos, ohne Anmeldung, und die Experimente laufen ohne Kamera. Nehmt 'Quellen prüfen' und das Risiko-Kartenspiel mit demselben Startwert und vergleicht, wer öfter richtig liegt."

## 7. Was hat mich gefreut

- Die Experiment-Seite sagt gleich "ohne Kamera und ohne Mikrofon", das beantwortet meine Sorge in einem Satz.
- Das Risiko-Kartenspiel mit Startwert und "Dieselbe Runde noch einmal" ist eine echte Zwei-Personen-Mechanik, mit Erklärung nach jeder Karte und Auswertung nach Art.
- Das Chat-Experiment liefert unbeabsichtigt den besten Beleg: zwei Antworten auf dieselbe Frage, beide überzeugend, beide teils falsch. Dazu sieht man Token-Geschwindigkeit live.
- "Hast du danach mehr verstanden, oder hast du nur etwas abgegeben?" als Leitfrage bei den Hausaufgaben.
- Quiz mit Begründung statt nur "falsch".
- Freundliche Fehlerfälle (leere Frage, Suche ohne Treffer, 404).
- Elternstartseite nennt Kosten, Anmeldung und Alter gleich oben.

## 8. Was hat genervt

- Das Wort "null" unter jedem "Richtig." im Risiko-Spiel.
- Kein "Experimente" und kein "Quellen prüfen" im Eltern-Menü, dafür der Schul-Elternbrief ("Ihre Klasse arbeitet im Unterricht ...") als erster Schritt für mich als Privatperson.
- Die Seiten reden nur mit dem Jugendlichen, nie mit mir als Vater; keine Anleitung zum gemeinsamen Machen.
- "Echt oder KI?" ohne Bild-Übung, obwohl das Video mit "Zwei Bilder" beginnt.
- Punkte-Labor ohne Aufgabe und Ziel; "Starten" landet erst in einer Video-Lektion.
- "ca. 1 Min" bei Seiten mit über zwei Minuten Video.
- Untertitel verdecken das Schlussbild des Videos.
- Suchtreffer: "Quellen" und "KI-Antwort prüfen" führen nicht zuerst auf "Quellen prüfen".
- Risiko-Karten nur aus dem Büroalltag (Preislisten, Zahlungserinnerungen), nichts aus Schule oder Freizeit.
