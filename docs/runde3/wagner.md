# Prüfrunde 3: Herr Wagner (Informatiklehrer Oberstufe)

Prüfung am 22.11.2026, Chromium über tests/browser.mjs, Desktop 1440x900, überwiegend dunkel, Stichproben hell, gegen https://192.168.178.83:8443. Screenshots (24 Dateien, davon 2 PDF-Seitenübersichten) liegen in `docs/runde3/wagner-bilder/`. Sprachmodell-Anfragen: eine (Chat, Beispielfrage), sie scheiterte mit "Dem Jetson fehlt gerade freier Speicher" (siehe Befund 9). Keine Ratenbegrenzung. Nicht geprüft: Tokenizer, Bedeutungskarte mit Einbetten, Whisper, Kamera-Labore mit laufender Kamera, Mobilansicht.

## 1. Gesamtnote: 7,0 von 10 (Vorrunde 6,5)

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für Oberstufe | 7 | Klare Sprache, Rechenbeispiel korrekt. Training nennt weiter "Päckchen" statt Mini-Batch (0 Treffer für "Mini-Batch", "Backprop", "stochastisch" auf /training). |
| 2 | Einstieg und Führung | 7 | Rollenfenster und Menü je Rolle deutlich besser (siehe 3). Für Oberstufe/Informatik weiter keine Rolle und keine Spur, alles "Klasse 8". |
| 3 | Lernwirkung | 7 | Mathe-Block, Quizrechnungen und Labore tragen. Mathematik nur auf einer Seite. |
| 4 | Motivation | 8 | Netz-Spielplatz, Bewertungs-Labor und Trainingslandschaft sind stark (Screenshots 15, 16). |
| 5 | Labore und Interaktion | 8 | Netz, Bewertung, Training laufen ohne Server. Chat in dieser Runde nicht prüfbar (Speicherfehler), Fehlerführung aber gut. |
| 6 | Videos | 6 | 1:08 bis 1:26 je Folge, Untertitel an, aber kein Transkript, Steuerleiste überdeckt Bildtext (Screenshot 16). |
| 7 | Navigation und Orientierung | 7 | Menü je Rolle sehr gut (13 statt 25 sichtbare Punkte). Schalter "Mit Mathe" weiter bei 2701 px, Suche nach "Formel" findet ihn nicht. |
| 8 | Vertrauen und Sicherheit | 7 | Datenschutz-Aussagen klar, Quellen auf Schulseiten vorhanden, aber nicht klickbar. Blätter tragen "Lizenz: noch festzulegen". Quellen für Fairness und Embeddings fehlen weiter. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Skip-Link, sichtbarer Fokus (3 px), Schalter per Tastatur, Hell und Dunkel lesbar. Menü scrollt innen mit abgeschnittener Gruppenüberschrift. |
| 10 | Fehlerfälle | 8 | Leeres Senden im Chat meldet jetzt "Schreib zuerst eine Frage." (Screenshot 12). Modellfehler mit "Noch einmal versuchen" (Screenshot 14). |

## 2. Vergleich zur Vorrunde

Besser:
- Willkommens-Fenster mit sechs Rollen, unscharfem Hintergrund, Schließen-Kreuz und "Später" (Screenshot 01). Wahl "Ich unterrichte" führt zu "Für morgen im Unterricht" und einem Menü "Für dich" mit 13 Einträgen, "Alle Bereiche" zugeklappt (Screenshots 02, 03). Der Menü-Befund der Vorrunde (wichtige Gruppen unter der Falz) ist erledigt.
- Arbeits- und Lösungsblätter als PDF, je 3 Seiten A4, mit Quiz, Operatoren, QR-Code, Doppelstunden-Plan (Screenshots 09, 20, 21). Vorrunde: "kein Arbeitsblatt als PDF".
- Quellen mit Abrufdatum auf Schulseiten (Handreichung "Weiterlesen", Operatoren mit RLP, IQB, Bildungsplan BW), Gender Shades (2018) und NIST-Bericht (2019, 189 Algorithmen) auf /verzerrung-ethik genannt. Fachlich stimmt das.
- Leeres Senden im Chat gibt Rückmeldung (Vorrunde: keine).
- Code-Blöcke auf "Selbst bauen" haben Kopieren-Knopf und Kennzeichnung "braucht sudo" (Screenshot 18).

Gleich:
- "Mit Mathe" existiert auf genau einer von 86 Seiten (/neuronale-netze), weiter ohne Block auf /training, /bewertung, /rag-embedding, /tokens-sprachmodelle.
- Schalter liegt bei 2701 px unter dem Seitenanfang, hinter dem Lab (Screenshot 06 bzw. 07).
- Keine Weiterlesen-Abschnitte auf /verzerrung-ethik und /rag-embedding (Aufgabe 2 weiter nicht gelöst).
- Kein Sek-II-Material, Rolle "Ich unterrichte" bedient Klasse 8.
- Quiz einmalig, richtige Antwort oft die längste (siehe PDF-Quiz KI 2: Fragen 1 bis 3 jeweils die längste Antwort richtig).

Schlechter:
- Nichts Wesentliches. Neu und unschön: Quellen als Klartext in Code-Schrift mit Silbentrennung mitten in der URL (Screenshot 10), obwohl Links in Texten neu sind.

## 3. UX- und UI-Befunde nach Schwere

### Blocker
Keine.

### Hoch
1. Quellen nicht klickbar. /schule-lehrkraefte, Abschnitt "Weiterlesen" (Screenshot 10): URLs stehen als Code-Text, "uni-" bricht mitten im Hostnamen um, kein Link (0 externe Links in Weiterlesen auf allen drei geprüften Quellenseiten, /ki-schule-ueberblick und /echt-oder-ki ebenfalls). Die Kachelleiste darüber (Kompetenzen, Datenschutz, Sprachmodelle) sieht wie Schaltflächen aus, führt aber nirgends hin. Eine Lehrkraft kopiert die URL von Hand. Dazu: UNESCO-Eintrag "Titel auf unesco.org suchen", also ohne Adresse.
2. Fachliche Lektionen ohne Quellen. /verzerrung-ethik und /rag-embedding haben keinen Abschnitt Weiterlesen (Abschnittsliste geprüft, Suche nach "Weiterlesen" und "Literatur"). Gender Shades steht ohne Autorennamen (Buolamwini, Gebru) und ohne Link. Dasselbe für /neuronale-netze, /training, /bewertung, /tokens-sprachmodelle.
3. "Mit Mathe" nicht auffindbar und nur auf einer Seite. Schalter bei y = 2701 px (/neuronale-netze, Screenshot 06), nicht neben "Kurz lesen / Genau lesen" im Kopf. Suche "Formel" liefert nur "Wie Netze sehen", Suche "Mathe" liefert "Training" (dort gibt es keinen Mathe-Block). Wer den Schalter einschaltet, sieht keine Veränderung an der Stelle des Schalters, der Block erscheint rund 1000 px weiter unten im Abschnitt "Eingaben, Gewichte, Summe, Schwelle" (Screenshot 08, Block violett, y = 3673).
4. Kein Material für Oberstufe/Informatik. Rolle "Ich unterrichte" führt zum Klasse-8-Paket, Menü und Handreichung sagen "drei Stunden für Klasse 8". Training nennt "Päckchen" statt Mini-Batch, keine Update-Regel, /bewertung ohne F1 und ohne Formeln für Precision und Recall (0 Treffer "F1", "Formel").

### Mittel
5. Blätter tragen in der Kopfzeile "Lizenz: noch festzulegen" (alle fünf geprüften PDF, Screenshots 20, 21). Eine Lehrkraft weiß nicht, ob sie kopieren und weitergeben darf. Auf /schule-lehrkraefte gibt es dazu keinen Hinweis (Suche nach Lizenz, vervielfältigen, CC: 0 Treffer).
6. Lösungsblatt KI 3, Abschnitt "Quiz: richtige Antworten": Satzzeichen fehlen zwischen Antwort und Erklärung, z. B. "prüft nichts Das Modell erzeugt Text" und "sagen dasselbe Unabhängige Quellen". Auf dem Papier wirkt das wie Tippfehler.
7. Arbeitsblatt KI 2, Aufgabe 1: "Stelle k auf 1, dann auf 9", ohne dass k auf dem Blatt erklärt wird. Das Blatt ist für sich allein nicht verständlich.
8. Quiz-Distraktoren weiter zu leicht, richtige Antwort oft die längste (Blatt KI 2, Fragen 1 bis 3, Screenshot 20).
9. Chat-Labor: Beim Start der Beispielfrage "Erkläre in zwei Sätzen, was ein Token ist." kam "Dem Jetson fehlt gerade freier Speicher, um das Sprachmodell zu laden." (6 s bis zur Meldung, Screenshot 14). Die Meldung ist freundlich und hat "Noch einmal versuchen", steht aber doppelt (im Verlauf und in der Live-Erklärung darunter) und die Live-Erklärung zeigt zusätzlich einen halben Zeitbalken "5,2 s". Ob die Antwort jetzt fachlich stimmt (Vorrunde: Zugangs-Token), konnte ich deshalb nicht erneut prüfen. Grund vermutlich parallele Last durch andere Prüfer. Zugleich ein Hinweis für Unterricht mit 28 Personen: Ladefehler sind wahrscheinlich.
10. Lesezeit-Anzeige passt nicht zum Modus: /verzerrung-ethik zeigt "ca. 1 Min Lesen", obwohl im Modus "Genau lesen" 1644 Wörter stehen. Stundenseiten (/schule-stunde-1) zeigen ebenfalls "ca. 1 Min Lesen" für eine 45-Minuten-Einheit (Screenshot 09).
11. Videos: kein Transkript (Untertitel Deutsch, Standard an). Im Trainingsvideo überdeckt die Steuerleiste im Standbild die Beschriftungen "Zu groß", "Passend", "Zu klein" (Screenshot 16). Kapitelliste im Kopf bei 1:08 bis 1:26 für Oberstufe zu schnell.
12. Menü: In geöffneten Gruppen scrollt das Menü innen, die Überschrift "Einstieg" wird oben angeschnitten (Screenshots 09 und 18), auf Lehrseiten ohne gespeicherte Rolle fehlt der Block "Für dich", dafür steht "Alle Bereiche" offen mit 13 Gruppen.
13. Suche: "Neuron Formel" ergibt keinen Treffer (Screenshot 04), "Neuron" allein eine Begriffskarte plus drei Seiten (Screenshot 04b). Mehrwortsuche verhält sich wie UND ohne Hinweis.

### Klein
14. Willkommens-Fenster: Kachel "Ich bin Schüler:in" ist höher als die Nachbarn wegen des Zusatzsatzes (Screenshot 01), die Reihe wirkt ungleich.
15. Chat, Bereich unter den Beispielfragen: Beschriftung "Antwort" klebt ohne Abstand unter den Chips (Screenshot 12), darüber ein leerer Streifen im Modellkopf.
16. Selbst bauen: Zusatztext unter "2. Leistungsmodus umstellen" hat anderen Einzug als der Text bei Schritt 1 (Screenshot 18).
17. Arbeitsblatt KI 2: Seite 3 halb leer, Aufgabe 6 beginnt oben auf Seite 3 und trennt sich von 4 und 5 (Screenshot 20).
18. Doppelte Textfassung: "Eingaben (Zahlen), Gewichte (mal) ..." erscheint zusätzlich zur Grafik als Textliste (Lesehilfe), im Genau-Modus doppelt.

## 4. Zielaufgaben

1. Neuron-Rechnung mit Formel: gelöst, 4 Klicks (Suchfeld, Treffer "Neuronale Netze", Schalter "Mit Mathe", zum Abschnitt scrollen), rund 60 Sekunden mit Vorwissen. Ohne Vorwissen unverändert schwer (Befund 3). Fachlich korrekt: y = f(w1·x1 + ... + wn·xn + b), Beispiel 0,5·2 + (−1)·3 + 1 = −1, Ergebnis 0.
2. Weiterlesen/Quellen zu Fairness oder Embeddings: nicht gelöst. Es gibt keinen Abschnitt auf beiden Seiten. Quellen auf Schulseiten gefunden (zwei Klicks über das Menü), dort aber als Klartext (Befund 1).
3. Labor ohne Kamera im Kurs: gelöst, 2 Klicks (Start Lehrende, "Für morgen" mit KI 1 bis 3 "ohne Kamera", Handreichung "Kamera-Labore: Nicht für den Unterricht, vorher laut sagen"). Netz-Spielplatz, Training, Bewertung, Chat, Tokenizer brauchen keine Kamera. Gesichts-Labor: Seite zeigt zuerst nur "Kamera starten" (Screenshot 19).

## 5. Fachliche Stichproben (neu in dieser Runde)

Richtig: Arbeitsblatt KI 2, Quiz Frage 3 (Antwort C), Lösungsblatt KI 3 Quizlösungen (D, B, C) und Zeitpläne (45 Minuten: 5+20+10+10, 90 Minuten: 10+30+10+15+15+10 stimmen). Bewertungs-Labor: 87,1 % Genauigkeit bei Start, Kennzahlen konsistent. Gender Shades (2018), NIST 2019 mit 189 Algorithmen: Angaben stimmen. Weiter richtig: Mathe-Beispiel Neuron.
Unklar oder zu verbessern: "Eine niedrige Temperatur macht Antworten gleichförmiger, aber nicht richtiger" (/llm-grenzen) ist richtig und gut formuliert. "Schwelle" wird auf /neuronale-netze weiter mit Aktivierung vermischt (Stufenfunktion im Text, tanh/ReLU/Sigmoid im Lab). Chat-Antwort zur Kosinus-Ähnlichkeit (Vorrunde falsch) wegen Speicherfehler nicht erneut geprüft.

## 6. Empfehlung

Ja, für Mittelstufe und als Experimentierkasten im Oberstufenkurs: "Netz-Spielplatz und Bewertungs-Labor erklären Neuron, Schichten, Precision und Recall besser als manches Lehrbuch, und die PDF-Blätter sind in fünf Minuten einsatzbereit. Quellen und Formeln für die Sek II musst du noch selbst ergänzen."

Die drei größten Lücken Richtung 10:
1. Quellen überall und klickbar: Weiterlesen für jede technische Lektion (Vaswani 2017, Mikolov 2013, Buolamwini/Gebru 2018), echte Links statt Code-Text, Lizenz der Blätter klären statt "noch festzulegen".
2. "Mit Mathe" nach oben neben "Kurz/Genau lesen" und auf /training (Update-Regel, Mini-Batch), /bewertung (Formeln, F1), /rag-embedding (Kosinus), /tokens-sprachmodelle (Softmax, Temperatur); Hinweis in der Suche.
3. Sek-II-Spur: Rolle oder Schalter "Informatik Oberstufe" mit Lehrplanbezug, Arbeitsblatt mit Formelaufgaben, korrekte Fachbegriffe, Chat-Beispiele fest geprüft und Chat-Ladefehler im Klassensatz abfedern.
