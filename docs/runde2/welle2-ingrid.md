# Prüfrunde 2, Welle 2: Ingrid (68, Rentnerin, Tablet)

Datum 22.11.2026. Geprüft gegen https://192.168.178.83:8443 (Jetson im LAN), Chrome headless über Playwright, Fenster 820x1180 mit Touch und Browser-Zoom 125 Prozent (entspricht 656x944 CSS-Pixeln, Skalierung 1,25). Erstbesuch mit Willkommens-Fenster (`?willkommen=1`). Rolle gewählt: "Ich will KI verstehen". Screenshots in /tmp/welle2-ingrid/. Nur Lesen und Browser, nichts geändert. Das Sprachmodell wurde nur zweimal angefragt (mit Pause), die Meldung "freier Speicher" kam nicht, keine Ratenbegrenzung.

## Kurzfassung

Gesamtnote 7,0 von 10. Die drei Zielaufgaben sind lösbar, die dritte und zweite sogar schnell. Die Inhalte zu Betrug und Datenschutz sind für Ingrid sehr gut und ehrlich. Gebremst wird sie von drei Dingen: Die passenden Seiten zu Betrug (Bereich Medienkompetenz) stehen nicht in ihrem Rollenpfad, das Sprachmodell-Labor widerspricht der Lehrseite und braucht 86 Sekunden für eine Antwort, und viele Beispiele und Fachwörter sind für Schüler oder Technikleute geschrieben.

## Willkommens-Fenster

Beschreibung (Screenshot 01-start.png): Ein weißes, abgerundetes Fenster über der abgedunkelten Startseite. Überschrift "Willkommen im KI-Labor", darunter "Für wen darf es sein? Dann zeige ich dir den passenden Einstieg." Sechs Kacheln in zwei Spalten: Ich bin Schüler:in, Ich unterrichte, Ich will KI verstehen, Ich arbeite in der IT, Ich entscheide im Betrieb, Ich bin Elternteil. Jede Kachel hat ein Symbol, eine Fettzeile und eine kurze Erklärzeile. Darunter ein Schalter "Meinen Lernfortschritt in diesem Browser merken" (standardmäßig aus), der Knopf "Später", ein Schließen-Kreuz oben rechts und der Satz "Nichts wird gesendet, deine Wahl bleibt nur in deinem Browser."

Was erwartet, was passiert (Zusatzfrage 1): Ich erwartete eine Auswahl, die zu mir passt, und das stimmt. Die Rolle "Ich will KI verstehen" fand ich in unter 5 Sekunden, ein Tipp. Danach wurde die Startseite sofort umgebaut. Bewertung:
- Gut: große Kacheln (mehr als 60 Pixel hoch), klare Sprache, kein Fachwort, kein Zwang (Später, Kreuz).
- Schwach: Die Kachel "Ich bin Schüler:in" ist vorab hervorgehoben (blauer Rand), obwohl ich keine Schülerin bin. Man könnte meinen, das sei die Empfehlung. Die zweite Zeile dort ("Kamera, Mikro und Gesicht ab 16, im Schulpfad nicht nötig") ist die einzige mit Fachbegriff-Last, die anderen sind einfacher.
- Schwach: Ich wähle "Ich will KI verstehen", oben steht danach "Ich bin: neugierig". Das ist ein anderes Wort als meine Wahl und wirkt wie ein Fehler, ich habe nicht "neugierig" gesagt.
- Schwach: Es gibt keine Kachel für "Ich bin älter und unsicher", "Senioren" oder "Ich will mich vor Betrug schützen". Das ist meine Hauptsorge, und ich muss sie selbst im Menü finden.

## Startseite nach der Rollenwahl (02-nach-rolle.png)

Oben eine Kopfleiste: Logo "KI-Labor", ein Knopf "Ich bin: neugierig", ein Suchfeld "Seiten suchen" und ein Menü-Knopf. Darunter "KI verstehen, Schritt für Schritt", "Sieben kurze Seiten führen durch die Grundlagen. Ohne Vorwissen.", zwei Kennzeichen "Kostenlos" und "Ohne Anmeldung", ein grüner Punkt mit "Der Rechner ist bereit und frei. Gerade zu 0 Prozent ausgelastet." und "Empfohlen für dich" mit drei großen Karten (Schritt 1 bis 3 von 7: Was ist KI?, Maschinelles Lernen, Neuronale Netze), jede mit Zeitangabe und dem Knopf "Öffnen". Darunter "Weitere Wege: Rolle wählen, Lernpfade, alle Bereiche" und eine Fußzeile mit "Ist das sicher?", "Ab wann?", "Was ist ein Jetson?".

Eindruck: Sehr klar. In 30 Sekunden weiß ich, was ich tun soll: oben auf "Öffnen". Gut: große Schrift (Fließtext 17 CSS-Pixel, Überschrift 34), viel Luft, ein einziger Knopf je Karte. Auffällig: "Der Rechner ... zu 0 Prozent ausgelastet" ist für mich Technik-Rauschen. "Was ist ein Jetson?" in der Fußzeile ist für mich uninteressant.

## Menü beim Start (Zusatzfrage 2)

Bei Tablet-Breite mit Zoom 125 Prozent liegt das Menü hinter dem Knopf oben rechts (Kreis mit drei Strichen). Das ist für mich nicht selbsterklärend, aber der Knopf ist groß. Nach dem Öffnen (03-menue.png) sehe ich 7 Einträge in einer Gruppe "Für dich": Start, Was ist KI?, Maschinelles Lernen, Daten, Neuronale Netze, Training, Sprachmodelle. Dazu die eingeklappte Gruppe "Alle Bereiche" (1 Zeile). Zwei Einträge tragen das grüne Zeichen "Einsteiger". Das sind 8 sichtbare Zeilen, eine Gruppe, plus der Fortschrittsbalken "Noch nichts gelesen". Das ist nicht überladen.

Klappe ich "Alle Bereiche" auf (04-alle-bereiche.png), kommen 12 weitere Bereiche: Grundlagen, Medienkompetenz, Sprache, Experimente, Sehen, Wissen und RAG, Agenten, Daten und Prognosen, KI im Betrieb, Business-Use-Cases, Der Rechner dahinter, Für die Schule. Jeder Bereich ist wieder einklappbar mit eigenen Seiten. Das ist aufgeräumt, aber für mich auch ein Labyrinth.

Welche fünf Punkte würde ich erwarten? Was ist KI, Wie erkenne ich Fälschungen und Betrug, Meine Daten und Sicherheit, Beispiele aus dem Alltag, Hilfe/Glossar. Davon stehen nur "Was ist KI?" und (versteckt) die Betrugsseite zur Verfügung.

Nie anklicken würde ich: Neuronale Netze, Training, Sprachmodelle, Daten, Agenten, Wissen und RAG, Der Rechner dahinter. Das sind für mich Fachwörter ohne Bild im Kopf.

Der Fehler im Aufbau: Die Seiten, die zu meiner Angst passen (Echt oder KI?, Fake News und Deepfakes, Datenschutz im Alltag, KI in deinem Alltag), stehen im Bereich "Medienkompetenz" und tauchen nicht in meinem Pfad "Für dich" auf. Mein Rollenpfad führt direkt in Maschinelles Lernen, Neuronale Netze, Training und Sprachmodelle, also genau dorthin, wo ich nicht hinwill.

## Zielaufgaben (Zusatzfrage 3)

### Aufgabe 1: Was KI ist, in einfachen Worten. Gelöst.
- Weg: Startseite, Karte "Was ist KI?" antippen, 1 Tap, Seite in rund 1 Sekunde da. Danach Video angesehen (siehe unten). Kein Suchen nötig, das ist stark.
- Die Seite hat ein Mengenbild (Kreise ineinander: Künstliche Intelligenz, Maschinelles Lernen, Deep Learning, Generative KI, daneben Regelbasierte Systeme und Robotik), eine kurze Definition ("Software, die Aufgaben löst, die sonst menschliches Denken brauchen") und "Das nimmst du mit".
- Meine Erklärung in drei Sätzen, wie ich sie als Ingrid sagen würde: "KI ist ein Sammelbegriff für Programme, die Aufgaben lösen, für die man sonst denken muss, zum Beispiel ein Navi oder ein Chatbot. Das meiste, was es heute gibt, kann nur eine einzige Sache gut. Es gibt Regelwerke, die ein Mensch schreibt, und lernende Systeme, die aus Beispielen selbst die Regeln finden." Das gelingt mir, aber nur, weil der Text einfach ist. Die Fachwörter Deep Learning und Generative KI bleiben bei mir leer.
- Schwach: Auf der Seite steht "ca. 1 Min", auf der Startkarte "ca. 4 Min". Das Video allein dauert 1:23. Bei 468 Wörtern, mit Bildern und Spielfeld, sind 4 Minuten ehrlicher. Das macht unsicher.
- Schwach: Der Satz "Du bist schon auf dieser Seite." unter der Begriffskarte verwirrt, ich weiß nicht, was er will.

### Aufgabe 2: Betrug mit KI-Stimmen oder Bildern erkennen. Gelöst, in 3 Taps über die Suche.
- Weg A (Suche): Suchfeld antippen, "Betrug" tippen, nach rund 1 Sekunde Treffer "Echt oder KI?" (in Medienkompetenz) und "Auffälliges finden" (Daten und Prognosen, falsch für mich). Tippen auf "Echt oder KI?": Seite offen. Insgesamt 3 Aktionen, etwa 2 bis 3 Sekunden. "Fake Anruf" findet dieselbe Seite. "Stimme klonen" findet "Sprachausgabe" und "Echt oder KI?".
- Suche mit meinen Alltagswörtern: "Betrug" gut. "Fake Anruf" gut. "Enkeltrick": null Treffer (Seite sagt "Dazu habe ich nichts gefunden" mit Vorschlägen Chat, Datenschutz, Hausaufgaben, Bilder, Roboter, Kosten, keiner davon passt zu Betrug). "Fake-Bild erkennen": null Treffer. "falsche Stimme": zehn Treffer, darunter Neuronale Netze, Fairness und Verantwortung, RAG messen und Protokoll aus Sprache, das meiste Rauschen, "Echt oder KI?" steht aber oben. Der Enkeltrick ist DAS Wort, das eine Rentnerin kennt, und er fehlt im Suchwortschatz.
- Weg B (Menü): Menü, "Alle Bereiche", "Medienkompetenz", "Echt oder KI?": 4 Taps, wenn man weiß, dass es unter Medienkompetenz liegt. Ohne Suche hätte ich vermutlich zuerst bei "Was ist KI?" weitergemacht und das Thema nie gefunden.
- Inhalt der Seite "Echt oder KI?" (10-echt-oder-ki.png, 820 Wörter): Sehr gut für mich. Abschnitt "Stimmen: Klonen braucht wenig Material" mit vier Symbolen (Anruf, Druck, Auflegen, Klarheit) und dem Rat "auflegen und über die bekannte Nummer zurückrufen". Unter "Mehr dazu" der Hinweis auf Zeitdruck, Geheimhaltung, Bitte um Geld oder Codes, und die Anregung eines Familien-Codeworts: "Das kostet nichts und hilft gegen jede Fälschung." Das ist eine Antwort, die ich weitergeben kann. Ebenso ehrlich: "Niemand erkennt KI-Inhalte sicher, auch Profis nicht."
- Meine Drei-Satz-Erklärung: "Ich kann am Klang nicht sicher erkennen, ob eine Stimme echt ist. Wenn jemand am Telefon Geld will und es eilig macht, lege ich auf und rufe die Person unter der Nummer zurück, die ich kenne. Mit meiner Familie vereinbare ich ein Codewort." Das habe ich verstanden und behalten.
- Schwach: Das Beispiel "Mehr dazu" im Abschnitt Texte nennt Kunstunterricht und Mitschüler. Für eine 68-Jährige falsch gewählt, es wurde für Schüler geschrieben. Das Wort "Rückwärtssuche" (ein Bild hochladen und Treffer ansehen) ist ohne Erklärung nicht umsetzbar, es wird kein Dienst und kein Schritt genannt.
- Schwach: Die Betrugsstimme ist der kürzeste Abschnitt, Bilder und Texte bekommen mehr Raum. Auch der Rat für Bilder ("Hände, Schrift, Spiegelungen") ist für mich schwer zu prüfen, es gibt dazu kein einziges Beispielbild auf der Seite.
- Und: Die Seite widerspricht dem Chat-Labor (siehe Labore).

### Aufgabe 3: Speichert das Labor etwas über mich? Gelöst, 1 Tap, aber mit Scrollen.
- Weg: Auf der Startseite ganz nach unten in die Fußzeile scrollen, dort steht "Ist das sicher? Kamera und Mikrofon starten nur, wenn du zustimmst. Mehr dazu". 1 Tap auf "Mehr dazu", Seite "Ist das sicher? Was wird gespeichert?" in rund 1 Sekunde, etwa 5 bis 10 Sekunden inklusive Scrollen und Suchen. Über die Suche "speichert" ist die Seite ebenfalls der erste Treffer.
- Die kurze Antwort (nach etwa 1,5 Bildschirmen Scrollen): "Kein Konto", "Kein Foto gespeichert", "Texte nur kurz" (nach 30 Minuten Ruhe vergessen). "Du brauchst kein Konto. Kamerabilder und Aufnahmen werden nicht gespeichert." Im Kasten "Deine Zustimmungen" ist sichtbar, ob ich zugestimmt habe (Kamera, Mikrofon, Gesichtserkennung: alle "Nicht zugestimmt") mit Knopf "Widerrufen". Das schafft Vertrauen.
- Fußzeile jeder Seite sagt es ehrlich, inklusive Sitzungs-Cookie kl_s und gemerktem Lernfortschritt.
- Schwach: Die Antwort steht nicht in der ersten Bildschirmhöhe. Oben steht eine Beschreibung in Alltagssprache, dann kommt das Einwilligungs-Kästchen, die eigentliche Antwort "Die kurze Antwort" erst darunter. Ich hätte die drei Sätze zuerst erwartet.
- Schwach: Unten auf der Seite steht "Pfad 'Unterricht vorbereiten', Seite 8 von 9". Ich bereite keinen Unterricht vor. Auch die Fußnote "Weiter geht es" führt mich nach "Recht und Regeln" und "Der Jetson und seine Hardware", beides nicht für mich.
- Schwach: "Widerrufen" in drei grauen Knöpfen, solange nichts zugestimmt ist. Diese Knöpfe sind blass (deaktiviert), wirken kaputt.

Zeit und Klicks gesamt: Aufgabe 1: 1 Tap, ca. 1 Sekunde. Aufgabe 2: 3 Aktionen, ca. 3 Sekunden. Aufgabe 3: 1 Tap plus Scrollen, ca. 10 Sekunden. Alle drei zusammen unter 1 Minute reine Bedienzeit, Lesen und Video nicht mitgezählt.

## Labor (Pflicht: eins, hier zwei bedient)

1. Maschinelles Lernen, "Ausprobieren" (k-nächste-Nachbarn, 16-ml-Lab, 17 bis 19): Seite über Startkarte 2, 1 Tap. Das Spielfeld ist am Anfang leer, ich muss "Beispieldaten" antippen, dann "Entscheidungsfläche zeigen", dann ins Feld tippen. Das waren 3 Taps in 3 Sekunden. Das Ergebnis ist ein farbiges Feld mit Punkten und dem Satz "Der Punkt unter deinem Zeiger hat unter seinen 5 nächsten Nachbarn 1 Punkt in Blau, 1 Punkt in Orange und 3 Punkte in Grün. Die Mehrheit gewinnt: Grün." Funktioniert sofort, kein Warten. Hübsch. Aber: Ich weiß nicht, wofür das gut ist. "Farbe des nächsten Punkts" und "k (Nachbarn)" sind für mich ein Rätsel. Und "unter deinem Zeiger" passt nicht zum Tablet, ich habe keinen Zeiger, ich tippe. Der Zusammenhang zum Text ("Spam oder nicht") ist nicht hergestellt, ich sehe Punkte, nicht E-Mails. Nach 2 Minuten hätte ich es zugemacht.
2. "Sprachmodell im Chat" (21 bis 23): Zu erreichen über Menü, Alle Bereiche, Sprache, Sprachmodell im Chat: 4 Taps. Oben "Modell llama3.2:3b, im Speicher, Modell laden", ich weiß nicht, was "Modell laden" tut und ob ich es drücken muss (ich musste nicht). Fehlerfall: Ich tippte "Senden" mit leerem Feld, Antwort: "Schreib zuerst eine Frage." in orange direkt unter dem Knopf, Eingabefeld bleibt fokussiert. Das ist freundlich und klar.
   Ich fragte "Wie erkenne ich einen Anruf mit einer KI-Stimme, die so tut wie mein Enkel?". Erste Anfrage: Der Text begann nach 1,1 Sekunden, ich stoppte die Messung zu früh. Zweite Anfrage mit demselben Text: Die Antwort lief insgesamt 86,1 Sekunden (693 Token, 8,1 Token pro Sekunde), mit dem Knopf "Stopp" als Option. Ich hätte nach etwa 20 Sekunden aufgegeben, wenn der Text nicht schon sichtbar gewachsen wäre, das Mitlaufen hilft aber. Meldung "freier Speicher" gab es nicht.
   Die Antwort selbst ist problematisch: "Achse und Tonfall: ... die gleiche Achse wie ein Mensch", das Wort "Achse" ist Unsinn. Sie rät: "Wenn jemand aus dem Nichts anruft und sagt, dass er dein Enkel sei, ist das wahrscheinlich eine KI-Stimme." und "Achte darauf, ob die Stimme zu perfekt klingt". Das ist sachlich falsch und widerspricht der Lehrseite, die sagt, der Klang beweise nichts. Ein Hinweis "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." steht da, aber in kleiner grauer Schrift unter der Blase. Eine Rentnerin, die dem Chat glaubt, nimmt den falschen Rat mit. Für eine Lernplattform mit dem Schwerpunkt "KI-Fehler erkennen" könnte man das als Lehrstück nutzen, aber dazu fehlt der Hinweis auf der Seite.
   Und: Die Antwort ist 693 Token lang für eine Frage, ein Mensch liest das nicht.

Dritter Versuch (Fehlerfall Suche): "xyzabc" liefert "Dazu habe ich nichts gefunden. Probiere zum Beispiel: Chat, Datenschutz, Hausaufgaben, Bilder, Roboter, Kosten." Freundlich, mit Handlungshinweis (Beispielbegriffe). Alles gut.

## Video (Pflicht: eins)

Video "Was ist KI?" auf der Seite /karte, Dauer 1:23 (83,8 Sekunden). Es hat deutsche Untertitel, standardmäßig an (track default), ein Titelbild und eine Kapitelliste (0:00 Was ist KI?, 0:10 Vier Fähigkeiten, 0:24 Regelbasierte KI, 0:39 Ineinander gesetzt, 1:00 KI mit Körper, 1:10 Die Landkarte), die Kapitelmarken sind große Zeilen (44 Pixel hoch). Ich tippte aufs Dreieck, es spielte sofort (3 Sekunden später bei 2,5 Sekunden). Ein Tipp in die Mitte des Bildes startete es nicht, nur das kleine Dreieck unten links (Touch-Ziel klein). Der Autostart ist aus, das ist gut.
- Position: Direkt unter dem Seitenkopf, vor dem Lesen. Gut.
- Tempo und Länge: 83 Sekunden, kurz. Gut für mich.
- Untertitel: laufen als weißer Text über dem Bild. Am Ende (Kapitel "Die Landkarte", Screenshot 08-video-ende) überdecken die Untertitel die letzten beiden Zeilen "Wissen" und "Handeln" der Grafik. Sichtbarer Fehler, 07/08.
- Verweis am Ende: Die Schlusskarte sagt "Nächste Videos: Lernen, Erzeugen, Robotik und Einsatz im Business". Unter dem Video steht erklärend "Der Verweis am Ende der Folge meint diese Seite: Unten stehen die Abschnitte zur Folge." Der Verweis im Video selbst ist also an die Seite gebunden und erklärt, was gemeint ist. Das ist verständlich, aber der Satz unter dem Video ist ein Hilfstext, den man erst lesen muss. Ein Knopf "Weiter zur nächsten Folge" am Videoende wäre klarer.
- Sprecherstimme: "KI-erzeugt" gekennzeichnet, gut. Die Stimme selbst habe ich nicht gehört (headless), nur Untertitel gelesen, also keine Bewertung des Tons.
- Auf der Seite "Echt oder KI?" gibt es ein längeres Video (Kapitel bis 2:04, etwa 2:30). Es wurde nicht abgespielt, nur die Kapitelliste gelesen.

## Quiz (Pflicht: eins)

Quiz "Teste dich" am Ende von "Echt oder KI?", 4 Fragen. Alle vier mit je 1 Tap beantwortet, 4 Taps in 4,8 Sekunden (inklusive Wartezeit, die Aufgabe selbst brauchte mich länger, Lesen nicht gemessen). Feedback kommt sofort unter jeder Frage: "Richtig. ..." oder "Nicht ganz. ..." mit Begründung. Am Ende steht "4 von 4 richtig." Die falsche Antwort (24-quiz-falsch.png) wurde mit "Nicht ganz. Fehlerfreiheit beweist nichts. ..." korrigiert, keine Strafe, keine Sperre. Das ist ein sehr gutes Quiz: Die Frage 3 ("Eine vertraute Stimme ruft an und verlangt dringend Geld, niemand soll davon wissen. Was tust du?") ist genau meine Lage. Die Auswahl-Kreise sind winzig (13 Pixel), aber die ganze Zeile (46 Pixel hoch) ist antippbar. Ein kleines Manko: Die Antwort wird sofort gewertet, ich kann nicht umentscheiden, das ist für Lernen ok.

## Zusatzfrage 4: Wie viel Text ist zu viel? Die drei textlastigsten Stellen

1. "Echt oder KI?", ganze Seite (820 Wörter in Kurzansicht, im "Genau lesen" deutlich mehr) und die Reihenfolge Bilder, Texte, Stimmen, Prüfwege, Erkennungsprogramme. Die Stimmen kommen erst als dritter Abschnitt, nach rund 2 Bildschirmen. Ich hätte sie zuerst erwartet.
2. "Sprachmodelle" (/tokens-sprachmodelle), 1034 Wörter in der Kurzansicht: Token, Kontextfenster, Kosten pro Token, "Donaudampfschifffahrtsgesellschaft". Das ist ein Fachbuch, kein Einstieg, und steht doch als Schritt 7 im Pfad "KI verstehen" und als vorletzter Punkt im Menü "Für dich".
3. "Ist das sicher? Was wird gespeichert?", sechs Abschnitte hinter "Mehr dazu", dazu die Fußzeile jeder Seite (ein 60-Wörter-Absatz über Cookies, Arbeitsspeicher und kl_s). Das Wichtigste (kein Konto, nichts gespeichert) ist kurz, das Umfeld nicht.
Dazu auf jeder Seite der Satz "Du liest gerade kurz: Du siehst die Kernsätze. Mit 'Mehr dazu' klappst du Einzelnes auf, ..." (35 Wörter), der immer wieder kommt, auch nach dem dritten Mal.

## Bewertung nach dem Zehn-Punkte-Raster

1. Verständlichkeit für das Alter: 7. Satzlänge und Sprache sind gut, die Kernsätze kurz. Fachwörter ohne Erklärung: Inferenz, Merkmalsraum, Überanpassung, Token, Transformer, Rückwärtssuche, Deep Learning, Generative KI. Beispiele aus dem Schulalltag (Kunstunterricht, Mitschüler, Hausaufgaben).
2. Einstieg und Führung: 8. Willkommens-Fenster und Startseite führen in 30 Sekunden zu "Öffnen". Abzug: Der Rollenpfad führt Ingrid in Technikseiten, "Ich bin: neugierig" passt nicht zur Wahl, Schüler-Kachel vorausgewählt.
3. Lernwirkung: 7. Ich kann "KI" und "Anruf mit Geldwunsch" mit eigenen Worten erklären. Bei Maschinellem Lernen und Chat-Labor nicht.
4. Motivation und Spaß: 6. Schöne Bildsprache (Symbolketten, Mengenbild, farbiges k-NN-Feld), große Karten. Aber das Labor erzeugt bei mir keinen Aha-Effekt, kein Erfolgserlebnis ("geschafft"), kein Bezug zu meinem Alltag.
5. Labore und Interaktion: 6. k-NN funktioniert und reagiert sofort, ist für mich ohne Bezug. Chat: Fehlermeldung freundlich, aber 86 Sekunden für 693 Token, und die Antwort ist fachlich falsch und widerspricht der Lehrseite. Der Hinweis "Modell laden" ist unklar.
6. Videos: 7. Kurz (1:23), Untertitel an, Kapitelliste, Autostart aus, Quelle der Stimme gekennzeichnet. Abzüge: Untertitel überdecken Grafikzeilen am Ende, Tippen auf das Bild startet nicht, kein "Nächstes Video" als Knopf, Verweis am Ende nur über den Zusatztext verständlich.
7. Navigation und Orientierung: 7. Schlankes Menü (8 Zeilen, 1 Gruppe), gute Suche für "Betrug". Aber: Betrugsseiten im versteckten Bereich Medienkompetenz, Suche kennt "Enkeltrick" nicht, "Noch nichts gelesen" bleibt nach drei gelesenen Seiten stehen (Lernfortschritt ist standardmäßig aus, ohne Hinweis am Balken), und die Seite "Ist das sicher?" zeigt mir den Pfad "Unterricht vorbereiten". Menü-Knopf hat nur drei Striche, kein Wort "Menü".
8. Vertrauen und Sicherheit: 8. Sehr stark: "Nichts wird gesendet" im Willkommens-Fenster, Seite "Ist das sicher?" mit sichtbaren, widerrufbaren Zustimmungen, ehrliche Fußzeile mit Cookie, 16+ klar benannt. Abzüge: Die kurze Antwort kommt erst nach Scrollen, und der Chat gibt unprüfbare falsche Ratschläge zum Thema Betrug, was dem Vertrauen widerspricht.
9. Barrierefreiheit und Bedienbarkeit: 7. Fließtext 17 CSS-Pixel (bei Zoom 125 Prozent 21 Pixel), Überschrift 34, Quiz-Zeilen 46 Pixel hoch, Karten-Knöpfe 44 Pixel. Abzüge: Zeitmarken im Video 13 Pixel, Fußzeilen-Links (Impressum, Datenschutz, Lizenzen und Quellen, nur 16 Pixel hoch) und die Video-Steuerleiste sind klein; blasse deaktivierte Knöpfe ("Widerrufen"); hellgrauer Zusatztext auf hellem Grund (zum Beispiel "Antwort eines KI-Modells ...", Zeitangaben).
10. Fehlerfälle: 8. Leeres Senden: "Schreib zuerst eine Frage." Suche ohne Treffer: freundlicher Satz mit Beispielwörtern. Falsche Quizantwort: erklärend. Abzug: Der Hinweis nach der Nicht-Fundstelle bietet keinen Weg zu meinem Thema, "Enkeltrick" führt ins Leere.

Gesamtnote: 7,0. Ehrlicher Eindruck, kein Mittelwert (der Mittelwert liegt bei 7,1): Die Plattform tut für mich genau dort viel, wo ich hinwollte (Betrug, Datenschutz), aber sie schickt mich nicht dorthin, und mit dem Labor allein hätte ich nichts verstanden.

## Zusatzfrage 5: Empfehlung

Ja, mit Einschränkung: an Freundinnen und Bekannte ab 60, die verunsichert sind und KI ohne Anmeldung ansehen wollen. Meine zwei Sätze: "Such auf dem Tablet das Wort 'Betrug' und lies die Seite 'Echt oder KI?', da steht, was du bei einem Anruf mit Geldwunsch tust. Alles andere ist ein Experiment für Neugierige, glaub dem Chat dort nichts ungeprüft."

## Was hat mich gefreut

- Die Seite "Echt oder KI?" gibt mir einen Satz, den ich merke: erst auflegen, dann über die bekannte Nummer zurückrufen. Dazu das Codewort in der Familie. Ehrlich ("Sichere Erkennung gibt es nicht").
- Die Suche findet "Betrug" und "Fake Anruf" sofort.
- Die Karte "Was ist KI?" gleich oben, ein Tap, keine Anmeldung.
- Die Seite "Ist das sicher?" mit sichtbaren Zustimmungen und der ehrlichen Fußzeile.
- Das Quiz: sofortiges Feedback, nie beschämend, Frage 3 trifft meine Lage genau.
- Das Willkommens-Fenster zwingt nichts auf (Später, Kreuz) und erklärt, dass nichts gesendet wird.

## Was hat genervt

- Mein Rollenpfad führt zu Neuronale Netze, Training, Sprachmodelle, aber die Betrugsseiten stehen versteckt unter "Alle Bereiche".
- "Ich bin: neugierig" statt meiner gewählten Rolle, und "Ich bin Schüler:in" vorab markiert.
- "Enkeltrick" findet nichts.
- Chat-Labor: 86 Sekunden Wartezeit und eine Antwort, die falsch ist und der Lehrseite widerspricht ("Achse", "wenn jemand ... anruft, ist das wahrscheinlich eine KI-Stimme").
- Das k-NN-Labor hat keinen Bezug zu meinem Alltag, spricht von "Zeiger" auf einem Tablet.
- Untertitel verdecken am Videoende zwei Zeilen der Grafik.
- Zeitangaben widersprechen sich (Startkarte "ca. 4 Min", Seite "ca. 1 Min").
- Auf der Seite "Ist das sicher?" steht mein Pfad "Unterricht vorbereiten".
- Der immer wiederkehrende Hilfstext "Du liest gerade kurz ..." und der Satz "Du bist schon auf dieser Seite.".
- Fortschrittsbalken "Noch nichts gelesen" bleibt, ohne zu sagen, dass das Merken ausgeschaltet ist.

## Würde ich es weiterempfehlen? Begründung

Bedingt ja, wegen der drei Inhaltsseiten (Was ist KI?, Echt oder KI?, Ist das sicher?), die für Menschen wie mich echten Nutzen haben und ehrlich geschrieben sind. Ohne Anleitung ("such nach Betrug") würde eine Bekannte von mir aber im Rollenpfad bei Neuronalen Netzen hängen bleiben.

## Die drei größten Lücken Richtung Eins-A

1. Rolle "Ich will KI verstehen" bzw. eine Rolle "Ich will mich vor Betrug schützen" muss die Seiten Echt oder KI?, Fake News und Deepfakes, Datenschutz im Alltag und KI in deinem Alltag im Pfad "Für dich" zeigen, vor Neuronale Netze und Training. Suchwörter ergänzen: Enkeltrick, Schockanruf, falscher Polizist, Phishing, Telefonbetrug, Fake-Bild. "Ich bin: neugierig" durch die gewählte Rolle ersetzen.
2. Das Chat-Labor braucht für Laien eine Betrugs-Übung, die stimmt (vorbereitete Frage mit geprüfter Antwort oder ein sichtbarer Warnhinweis "Dieser Chat kann falsch liegen, siehe 'Echt oder KI?'"), eine Wartezeit-Anzeige ("rund eine Minute") und kürzere Antworten. Das k-NN-Labor braucht eine Alltagsgeschichte (Spam-Mail statt Punkte) und Touch-Sprache ("tippe" statt "Zeiger").
3. Texte und Hilfen auf Ingrid zuschneiden: Fachwörter beim ersten Auftreten erklären (Rückwärtssuche mit Beispiel und Dienst), Beispiele aus dem Alltag Erwachsener statt Schule, die kurze Antwort auf "Ist das sicher?" als erster Block, Zeitangaben vereinheitlichen, Untertitel-Überdeckung beheben (Untertitel oben oder Grafik ausweichen), Fußzeilen-Links und Zeitmarken vergrößern, Pfadhinweis im Fuß der Seite an die Rolle anpassen.

## Hinweise zur Prüfung

- Alle Screenshots sind Playwright-Aufnahmen bei 820x1180 (Zoom 125 Prozent); die Vollseiten-Aufnahmen zeigen einige Grafiken leer, weil sie erst beim Scrollen eingeblendet werden. Das ist ein Messartefakt, die Grafiken erscheinen beim echten Scrollen (11-Stimme.png).
- Videoton wurde nicht gehört (headless), Untertitel und Bild schon.
- Kamera und Mikrofon wurden nicht gestartet, die Einwilligungsansicht wurde nicht geöffnet (nicht Teil von Ingrids Zielaufgaben).
- Ratenbegrenzung und "freier Speicher": nicht aufgetreten.
