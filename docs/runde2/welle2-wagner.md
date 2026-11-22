# Prüfrunde 2, Welle 2: Herr Wagner (Informatiklehrer Oberstufe)

Prüfung am 22.11.2026, 15:33 bis 15:55 Uhr (Browser: Chromium über tests/browser.mjs, Desktop 1440x900, dunkles Farbschema), gegen https://192.168.178.83:8443. Die Seite wurde währenddessen weiterentwickelt: um 15:33 hatte das Menü 75 Seiten und 12 Gruppen, um 15:50 76 Seiten und 13 Gruppen (neu: "Experimente" zwischen "Start" und "Grundlagen"). Alle Befunde unten gelten für den jeweils genannten Zeitpunkt. Screenshots liegen in /tmp/welle2-wagner/. Sprachmodell-Anfragen: drei, nacheinander, mit Pause; keine Ratenbegrenzung aufgetreten. Nicht geprüft: Tokenizer-Werkzeug, Bedeutungskarte (Einbetten), Objekt-Labor mit Beispielbildern, Whisper (Zeitgründe).

## 1. Willkommens-Fenster (Zusatzfrage 1)
Mit ?willkommen=1 erscheint ein Fenster "Willkommen im KI-Labor" mit sechs Rollen, unscharfem Hintergrund und Schalter "Meinen Lernfortschritt in diesem Browser merken". Ich erwartete als Informatiklehrer eine Rolle "Lehrkraft Informatik / Sek II". Es gibt nur "Ich unterrichte" (Untertext "Themen und Material für Lehrende") und "Ich arbeite in der IT". Ich wählte "Ich unterrichte" (1 Klick). Ergebnis: Startseite mit Block "Dein Weg: Unterricht", Klassenlink und Pfad "Unterricht vorbereiten" (9 Seiten, ca. 12 Min). Beide Pfade sind auf Klasse 8 zugeschnitten (Handreichung: "drei Stunden in Klasse 8"). Für Oberstufe liefert die Rolle nichts. Positiv: "Später" und das Schließen-Kreuz sind vorhanden, der Satz "Nichts wird gesendet" steht dabei.
Technischer Hinweis zum Test: Der Text "Ich unterrichte" kommt zweimal vor (Dialog und Startseite dahinter), ein Klick ohne Eingrenzung scheitert.

## 2. Menü (Zusatzfrage 2)
- Startseite (15:33, 1440x900): 12 Gruppen, nur "Start" offen mit 1 Eintrag. Sichtbar ohne Scrollen: 10 Gruppenköpfe plus 1 Link. "Für die Schule" und "Medienkompetenz" liegen unterhalb der Falz, der Menübereich scrollt (Höhe 573 von 667 px), ein Hinweis darauf fehlt, die Kachel "Rechner live" verdeckt den Rand. Gerade die Gruppe, die ein Lehrer sucht, ist verborgen.
- Lektionsseite /neuronale-netze: 2 Gruppen offen (Start, Grundlagen), 12 Links sichtbar, die übrigen 10 Gruppen nur nach Scrollen. Nach dem Öffnen einer Gruppe schließt sich die andere (Akkordeon).
- Gesamt: 76 Seiten (15:50). Das ist für ein Menü viel, aber durch Gruppen beherrschbar.
- Fünf Punkte, die ich erwarte: Grundlagen, Neuronale Netze, Training, Bewertung, Embeddings/RAG. Nie anklicken würde ich: Business-Use-Cases, "Für die Schule" (Klasse 8), KI im Betrieb.
- Die Suche filtert das Menü live (ca. 0,75 s) und zeigt Begriffskarten (Neuron, Gradient, Backpropagation, Transformer, Kosinus), das ist für Fachbegriffe gut.

## 3. Zielaufgaben (Zusatzfrage 3)
1. Neuron-Rechnung mit Formel: gelöst, aber nur mit Vorwissen. Weg: Suche "Neuron" (Klick ins Feld, tippen), Klick "Neuronale Netze", dann Mathe-Schalter. Der Schalter "Mit Mathe" liegt etwa 2870 px unter dem Seitenanfang, hinter dem Lab, ohne Hinweis im Kopf. Wer nicht weiß, dass er existiert, findet die Formel nicht: Suche "Formel" liefert "Wie Netze sehen" und "Suchen", suche "Mathe" liefert irrelevante Seiten. Ohne Suche: Menü, Grundlagen, Neuronale Netze, scrollen, Schalter, scrollen zum Block: 4 Klicks plus zwei lange Scrollwege, etwa 90 Sekunden beim ersten Mal. Beleg Formel: "y = f(w1·x1 + w2·x2 + … + wn·xn + b)", Rechenbeispiel x1 = 2, x2 = 3, w1 = 0,5, w2 = −1, b = 1: "0,5·2 + (−1)·3 + 1 = −1", Ergebnis 0. Stimmt.
2. Weiterlesen/Quellen zu Fairness oder Embeddings: nicht gelöst. /verzerrung-ethik und /rag-embedding haben keinen Abschnitt Weiterlesen oder Quellen (geprüft im Modus "Genau lesen", plus Suche nach "Weiterlesen"). Nur das Fußzeilen-Wort "Lizenzen und Quellen" führt zur Lizenzseite, die Bildmaterial und Technik, aber keine Fachliteratur belegt. Abschnitte mit Quellen gibt es nur auf Medienkompetenz- und Schulseiten (z. B. /echt-oder-ki mit C2PA, Liang et al. 2023 "GPT detectors are biased against non-native English writers", Chesney/Citron 2019; /ki-schule-ueberblick mit Abrufdatum). Dort fehlen aber klickbare Links (0 externe Links, URLs als Klartext, z. B. auf /schule-lehrkraefte).
3. Labor ohne Kamera im Kurs: weitgehend ja. Ohne Kamera funktionieren Netz-Spielplatz, Training-Landschaft, Bewertungs-Labor, Tokenizer, Chat, RAG-Seiten. Gesichts-Labor braucht Kamera; bei Ablehnung erscheint ein freundlicher Text mit Verweis auf das Objekt-Labor mit Beispielbildern (nicht von mir bedient). Der Einwilligungsdialog ist ausführlich ("Nutzbar ab 16 Jahren. Jüngere nur mit Einverständnis der Eltern. Die Seite prüft dein Alter nicht."), mit nicht vorbelegtem Haken.

## 4. Fachliche Prüfung (12 Aussagen, 5 Seiten)
Richtig:
1. /neuronale-netze, Mit Mathe: Summe 0,5·2 + (−1)·3 + 1 = −1, Neuron meldet 0. Korrekt.
2. /neuronale-netze, Quizfrage 3: 3 Eingaben, 4 Zwischenneuronen, 1 Ausgabe: 3·4+4 + 4·1+1 = 21. Rückmeldung rechnet es vor. Korrekt.
3. /neuronale-netze: "Ein Neuron zieht nur eine gerade Linie. Mit Zwischenschicht und Aktivierung entstehen gebogene Grenzen." Korrekt. Das Lab stützt es (Kreis im Kreis: 35 von 40 Testpunkten nach ca. 420 Schritten, Spirale mit 4 Neuronen nach 7428 Schritten nur 26 von 40, ehrlich nicht gelöst).
4. /rag-embedding: "gut 3 KB je Textstück, 4 Byte je Zahl", "gut 3 GB für eine Million Stücke" (768·4 = 3072 Byte). Korrekt.
5. /rag-embedding: Kosinus -1 bis 1, bei normierten Vektoren ordnet der Abstand wie der Kosinus, Skalarprodukt gleich Kosinus. Korrekt.
6. /bewertung: 97,2 % Genauigkeit, Precision 90/108 = 83,3 %, Recall 90 %. Korrekt. Das Lab liefert bei Start 87,1 % / 75,7 % / 84,0 % bei 252/48/81/619, nachgerechnet richtig. Bei "Immer unauffällig" zeigt es Precision "keine Angabe" (0 Alarme), mathematisch sauber.
7. /tokens-sprachmodelle: Wortschatz 128.256 (Llama 3), Zahlen in Blöcken von höchstens drei Ziffern, 3 Mrd. Parameter · 2 Byte = 6 GB, quantisiert rund 2 GB. Korrekt.
8. /training: "Gradient ... zeigt bergauf, also geht man in die Gegenrichtung." Korrekt.

Schwächen und Fehler:
9. Chat-Labor (Jetson, 15:47): Die Beispielfrage "Erkläre in zwei Sätzen, was ein Token ist." lieferte eine Antwort über Zugangs-Tokens (Authentifizierung, "Zugangskontrolle"), mehr als zwei Sätze (102 Tokens, 5,8 Tokens/s, erstes Token nach 7,0 s wegen Modellladen). Der Hinweis "Antwort eines KI-Modells. Sie kann falsch sein" steht da, aber ausgerechnet die vorgeschlagene Beispielfrage ist ein Fehlschlag, und die Seite lehrt dasselbe Thema korrekt auf /tokens-sprachmodelle.
10. Chat-Labor bei Temperatur 0: Frage "Nenne die Formel der Kosinus-Ähnlichkeit in einem Satz." ergab zweimal wortgleich "cos(A - B) = cos A * cos B + sin A * sin B", das ist das Additionstheorem, nicht die Kosinus-Ähnlichkeit (a·b / (|a||b|)). Die Reproduzierbarkeit bei T=0 stimmt, der Inhalt ist falsch. Für den Unterricht ein guter Beleg für Halluzination, sollte aber als geführtes Beispiel vorkommen und nicht zufällig auffallen.
11. /training: Vereinfachte oder fehlende Fachbegriffe. "Päckchen" statt Mini-Batch, "Rückpropagierung" statt Backpropagation (die Suche kennt Backpropagation, der Text nutzt die deutsche Form), stochastischer Gradientenabstieg nie genannt, keine Update-Regel w ← w − η·∇L, obwohl die Seite die Lernrate erklärt. Kein "Mit Mathe"-Block.
12. /rag-embedding: Die Bedeutungskarte "hält nur 14 Prozent der Unterschiede fest", das Verfahren (PCA, t-SNE, UMAP) wird nicht genannt. Die Grundannahme "Wörter in ähnlichen Zusammenhängen bedeuten Ähnliches" wird ohne Namen (Distributionelle Hypothese) und ohne Quelle gegeben.
Weitere Lücken: /bewertung ohne Formeln für Precision/Recall, F1, ROC. /neuronale-netze erklärt die Schwelle als Stufenfunktion, nutzt im Lab aber tanh/ReLU/Sigmoid; der Begriff "Schwelle" vermischt sich mit "Aktivierung". Fairness-Seite: Gesichtserkennungs-Fehlerquoten sind als "Beispielwerte" gekennzeichnet (ehrlich), aber ohne Studienverweis (z. B. Gender Shades) und ohne Metriken (Demographic Parity, Equalized Odds).

## 5. Schalter "Mit Mathe"
- Er existiert auf genau einer von 76 Seiten (/neuronale-netze, einmal, DOM-Zählung auf allen Menüseiten). Auf /training, /bewertung, /rag-embedding, /tokens-sprachmodelle, /ml und /karte: kein Schalter. Dort, wo ein Oberstufenkurs die Mathematik braucht (Gradientenabstieg, Precision/Recall, Kosinus), ist nichts hinterlegt.
- Technisch sauber: role="switch", aria-checked, per Leertaste bedienbar, Zustand bleibt nach Neuladen erhalten (localStorage). Der Block ist farblich abgesetzt (violett), gut lesbar, Formel in Monoschrift, Rechenbeispiel verständlich.
- Auffindbarkeit schlecht (siehe Aufgabe 1). Kein Hinweis in Lernzielen, Kopfzeile oder Suche.

## 6. Quiz
5 Fragen je Seite, einmalig beantwortbar (nach der Wahl gesperrt, kein "Nochmal"). Die Rückmeldung ist inhaltlich gut: bei falscher Antwort wird erklärt und gerechnet ("Erste Schicht: 3 mal 4 Gewichte plus 4 Verschiebungen gleich 16 ..."). Abschluss "1 von 5 richtig." Schwächen: (a) Distraktoren oft trivial ("Ein größeres Foto", "Weil sie nur nachts rechnen", "Es braucht keine Daten"); (b) die richtige Antwort ist häufig die längste (Quizfragen 2 und 5 auf /neuronale-netze, Fairness-Quiz), Testkluge lösen es ohne Wissen; (c) kein zweiter Versuch, kein Fortschrittsmerker pro Frage. Sehr gut: Rechenfragen (Parameter zählen, 99 % Genauigkeit bei 10 von 1000).

## 7. Videos
Neuronale Netze 1:19, Embeddings zwei Folgen 1:26 und 1:19, Fairness 1:08. 1920x1080, Untertitel Deutsch standardmäßig an, Kapitelliste mit Zeitmarken (6 Kapitel in 79 s, rund 13 Sekunden je Kapitel: für Oberstufe zu schnell, gut als Einstieg). Sprecherstimme KI-erzeugt, kenntlich gemacht. Verweis am Ende erklärt ("Der Verweis am Ende der Folge meint diese Seite"). Standbild vor dem Start zeigt "Schichten" (Kapitel 4) statt des Anfangs. Mit dem klebrigen Kopf (Kurz/Genau lesen) wird der Seitentitel beim Scrollen teilweise überdeckt (Screenshot 21).

## 8. Labore
- Netz-Spielplatz (/neuronale-netze): sehr gut. Punktmengen, Zwischenschichten 0 bis 3, Neuronen 1 bis 8, Aktivierung tanh/ReLU/Sigmoid, Lernrate, Verlustkurve für Training und Test, Hohle Testpunkte. Läuft ohne Server, ca. 700 Schritte pro Sekunde. Fehlt: Anzeige der Gewichte als Zahlen, Hinweis "Probiere 0 Zwischenschichten bei Kreis im Kreis".
- Bewertungs-Labor: sehr gut, vier Szenarien, Schwelle, Anteil echter Fälle, Konfusionsmatrix, Kennzahlen stimmen nachgerechnet.
- Chat-Labor: funktioniert, T-Regler, "Tokens zeigen". Keine Wahrscheinlichkeiten je Token, kein Top-p/Top-k, keine Seed-Angabe. Leeres Senden: keine Rückmeldung (keine Meldung, nichts passiert), das ist freundlich-still, aber ohne Hinweis. Antwortzeit gemessen: Modell geladen 3,6 s für 30 Tokens (8,4 Tokens/s).

## 9. Textlastigste Stellen (Zusatzfrage 4)
1. /rag-chunking im Modus "Genau lesen": 1346 Wörter. Nahezu gleich: /kosten-energie (1361), /tabellen-ml (1260), /agenten-sicherheit (1221).
2. /prompting (1208) und /daten (1169): lange Erklärtexte mit je einem "Beispiel aus dem Alltag" pro Abschnitt.
3. Startseite (1030 Wörter): sechs Rollenkarten, Neu-hier-Pfad, 15-Minuten-Pfad, vier Lernstufen, "Nach Rolle" untereinander, bei der der erste Satz zu "KI verstehen" erst nach dem Scrollen kommt. Für Wagner ist der Alltagsvergleich je Abschnitt (Stadtplan, Eisdiele, Darts, Suppe, Nebel) zu viel und zu gleichförmig; dafür ist der Standardmodus "Kurz lesen" (ca. 1 Minute) gut gewählt. Die Seiten /gesicht, /objekt, /chat, /whisper haben 266 bis 432 Wörter und sind leicht.

## 10. Bewertung nach dem Zehn-Punkte-Raster
1. Verständlichkeit für das Alter (hier: für Oberstufe): 6. Sprache klar, Sätze kurz, aber Fachbegriffe oft eingedeutscht und Alltagsvergleiche überwiegen.
2. Einstieg und Führung: 7. Rollenwahl und Pfade gut, aber nur Klasse 8 für Lehrkräfte, keine Sek-II-Spur.
3. Lernwirkung: 7. Rechenbeispiele und Quizrückmeldung stark. Eigene Erklärung in drei Sätzen: Neuron = gewichtete Summe plus Verschiebung, durch Aktivierung zu Ausgabe, Training verschiebt Gewichte gegen den Gradienten des Verlusts, Schichten brauchen Nichtlinearität. Das habe ich nach Lab und Text sicher erklärt.
4. Motivation und Spaß: 8. Netz-Spielplatz und Bewertungs-Labor sind ausgezeichnet.
5. Labore und Interaktion: 8. Funktionieren, schnell, Feedback sinnvoll. Chat nur für Demo geeignet.
6. Videos: 6. Kurz, untertitelt, sauber. Für Oberstufe zu flüchtig, kein Transkript.
7. Navigation und Orientierung: 6. Suche gut, Begriffskarten gut. Menü verbirgt "Für die Schule" und "Medienkompetenz" unter der Falz, Mathe-Schalter versteckt, neue Gruppe "Experimente" erschien mitten im Test.
8. Vertrauen und Sicherheit: 8. Einwilligung ausführlich, 16+ klar, Hinweis "Antwort kann falsch sein". Quellen für Fachaussagen fehlen aber, das untergräbt das Vertrauen eines Fachlehrers.
9. Barrierefreiheit und Bedienbarkeit: 7. Schalter und Dialoge per Tastatur/ARIA vernünftig; Kopfzeile überdeckt Titel; kein Tastaturtest der Labore durchgeführt.
10. Fehlerfälle: 7. Kamera ablehnen: freundlich mit Alternative. Leere Eingabe im Chat: keine Meldung.

Gesamtnote (Eindruck, nicht Mittelwert): 6,5 von 10. Für den Einstieg und Klasse 8 stark, für einen Oberstufenkurs fachlich dünn belegt: Quellen fehlen, Mathe nur auf einer Seite.

## 11. Fünf Zusatzfragen, kurz
1. Rolle: "Ich unterrichte" gewählt, erwartet war eine Rolle für Oberstufe/Informatik; Ergebnis Klasse-8-Pfad.
2. Menü: nicht überladen (12 bis 13 Gruppen, 75 bis 76 Seiten), aber wichtige Gruppen unter der Falz.
3. Aufgaben: 1 gelöst (mit Mühe), 2 nicht gelöst, 3 gelöst (mit Einschränkung).
4. Text: siehe Abschnitt 9.
5. Empfehlung: Ja, mit Vorbehalt, siehe unten.

## 12. Was hat mich gefreut
- Netz-Spielplatz und Bewertungs-Labor sind didaktisch und technisch erstklassig, die Zahlen stimmen nachgerechnet.
- Quizrückmeldungen rechnen vor und erklären.
- Kenntlichmachung des Kleinmodells (3 Mrd. Parameter, "kann falsch sein"), ehrliche "Beispielwerte"-Kennzeichnung.
- Suche mit Begriffskarten (Neuron, Gradient, Backpropagation, Transformer).
- Einwilligungsdialog zur Kamera ist vorbildlich klar.

## 13. Was hat genervt
- Der Schalter "Mit Mathe" ist auf einer einzigen Seite und ungefähr 2870 px weit unten.
- Keine Quellen und keine Literatur bei den technischen Lektionen, Quellen im Klartext ohne Links dort, wo es sie gibt.
- Kein Arbeitsblatt als PDF (Suche "PDF" und "Arbeitsblatt" liefert nur Seiten, kein Download), Lehrkraft-Material nur für Klasse 8.
- Chat-Beispielfrage liefert falsche Antwort (Token als Zugangstoken), die Kosinus-Formel ist falsch.
- Quiz einmalig, richtige Antwort oft die längste.
- Menü: wichtige Gruppen verdeckt; Gruppe "Experimente" kam im Lauf der Prüfung hinzu.

## 14. Empfehlung und drei größte Lücken Richtung Eins-A
Würde ich es empfehlen? Ja, an Kolleginnen und Kollegen der Mittelstufe und für den Einstieg in Oberstufenkurse als Experimentierkasten, mit zwei Sätzen: "Netz-Spielplatz und Bewertungs-Labor erklären Neuron, Schichten, Schwelle, Precision und Recall besser als manches Lehrbuch. Quellen und Formeln musst du selbst ergänzen."
Lücken:
1. Quellen und Weiterlesen für jede technische Lektion (Neuronale Netze, Training, Bewertung, Embeddings, Fairness, Sprachmodelle), klickbar, mit Jahr und Autor (z. B. Vaswani et al. 2017, Mikolov et al. 2013, Buolamwini/Gebru 2018).
2. "Mit Mathe" ausbauen und auffindbar machen: Schalter oben neben "Kurz/Genau lesen", Blöcke auf /training (Update-Regel), /bewertung (Formeln, F1), /rag-embedding (Kosinus), /tokens-sprachmodelle (Softmax, Temperatur), Hinweis in der Suche.
3. Material für Sek II: Rolle "Informatik Oberstufe", Pfad mit Lehrplanbezug, Arbeitsblatt als PDF, korrekte Fachbegriffe (Mini-Batch, Backpropagation, Hyperparameter), geprüfte Chat-Beispiele statt der Token-Frage.
