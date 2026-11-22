# Prüfrunde 2: Schüler Klasse 12 (Mehmet, 17, Laptop 1440x900)

Getestet am 22.11.2026 gegen https://192.168.178.83:8443, Chromium headless, Playwright mit den Hilfen aus tests/browser.mjs. Screenshots liegen in /tmp/runde2-klasse12/ (start.png, nn-spirale1.png, nn-spirale3.png, chat-jetson.png, chat-leer.png, tokens.png, embed.png, einw.png, quiz.png, suche.png). Die Ratenbegrenzung ("Zu viele Anfragen") ist nicht aufgetreten. Pro Zeit lief höchstens eine Sprachmodell-Anfrage.

Meine Rolle: Ich will für das Abi-Seminar KI (Neuronale Netze, LLM, RAG, Bias) verstehen und prüfe, ob das fachlich stimmt und tief genug ist.

## 1. Was ich gemacht habe (Schritt, Seite, Erwartung, Ergebnis)

| Schritt | Seite | Erwartung | Ergebnis |
|---|---|---|---|
| Startseite lesen | / | in 30 s klar, wo ich anfange | Drei Wege: "Neu hier" (3 Schritte, 10 Min), "Für Entscheider" (15 Min), "Alle Bereiche". Nichts für Schule, Abitur oder Studium. 61 Seiten im Menü. |
| Grundlagen lesen | /karte, /ml, /neuronale-netze, /training, /bewertung, /verzerrung-ethik | sauberes Fachwissen | Gut gebaut, siehe Abschnitt 3. |
| Sprache/RAG lesen | /tokens-sprachmodelle, /llm-grenzen, /finetuning-oder-rag, /rag-embedding, /rag-ueberblick | Mechanismen, nicht nur Schlagworte | Tokens, Embedding, Attention, Pretraining/Finetuning/RLHF stehen drin. |
| Lab 1 | Neuronale Netze: "Kreis im Kreis", dann "Spirale" | Verstehen, was Schichten bringen | Kreis, 1 Schicht, 4 Neuronen: nach rund 5.000 Schritten Verlust 0,01, 39 von 40 Testpunkten richtig. Spirale, 1 Schicht, 4 Neuronen: nach 7.032 Schritten Verlust 0,56, nur 26 von 40 Testpunkten. Spirale, 3 Schichten, 8 Neuronen: nach 30.000 Schritten Verlust 0,00, 39 von 40. Das Lab belegt also genau das, was der Text behauptet. |
| Lab 2 | Sprachmodelle: Token-Zerleger | echte Zerlegung | "Donaudampfschifffahrtsgesellschaft" wird in 13 Token geschnitten (D, ona, ud, amp, fs, ch, if, ff, ah, rt, sg, es, ellschaft). "12.10.2025 3,5 kg" ergibt 11 Token, "2025" wird zu "202" und "5". Das ist der echte Zerleger des Modells, nicht gespielt. |
| Lab 3 | Embeddings | Nähe nach Sinn | Satz "Mein Auto springt morgens nicht an." landet bei 0,76 beim Parkplatz-Satz, aber 0,74 bei "Stau", 0,73 bei "Das Protokoll wird bis morgen verteilt." und 0,70 bei "Morgen soll es regnen". Siehe Befund F3. |
| Lab 4 | Sprachmodell im Chat | Modell live erleben | Erste Frage: 31 s, erstes Token nach 15,9 s, 3,2 Token/s. Zweite Frage: 8,6 Token/s. Anzeige "Warten auf das erste Token" erklärt die Pause. |
| Lab 5 | Bewertung (Konfusionsmatrix) | stimmen die Zahlen? | 252/333 = 75,7 % Precision, 252/300 = 84,0 % Recall, 871/1000 = 87,1 % Genauigkeit. Alles korrekt gerechnet. |
| Video | Neuronale Netze | Länge, Untertitel, Verweis | 79,9 s, Untertitelspur Deutsch, 6 Kapitelmarken mit Zeitstempel, Verweistext zum Ende ("Der Verweis am Ende der Folge meint diese Seite"). Ich habe Bild und Ton im headless-Lauf nicht beurteilt, nur Metadaten, Kapitel und Verweis geprüft. |
| Quiz | Neuronale Netze, Frage 1 | Feedback | Antwort wird sofort erklärt ("Richtig. Das Gewicht legt fest, ..."). Die Fragen sind verständlich, aber leicht, siehe Abschnitt 4. Eine falsche Antwort habe ich nicht durchgespielt. |
| Suche | Seitensuche, 9 Begriffe | Alltagswörter finden | Treffer für "bias", "transformer", "halluzination", "datenschutz". Kein Treffer für "backpropagation" (obwohl /training "Rückpropagierung" erklärt) und "Gehirn". "wer haftet" liefert unpassende Seiten (Bild als Zahlen, Auffälliges finden). "chatgpt" liefert Begriffe (Wortschatz, Prompt) statt der Chat-Seite. |
| Fehler 1 | Chat, "Senden" ohne Text | freundlicher Hinweis | Es passiert nichts sichtbar. Keine Meldung, kein Fokus aufs Feld. |
| Fehler 2 | Gesicht, Kamera starten, ohne Einwilligung | Hinweis | Dialog mit Wozu, Wohin, Was bleibt, Stoppen, ab 16 Jahren. Nach "Ohne Kamera weitermachen": "Du hast nicht eingewilligt. Das ist in Ordnung. Du kannst mit den Beispielbildern weitermachen." Vorbildlich. |
| Konsole | alle Seiten | keine Fehler | Keine Konsolen- oder Netzwerkfehler. |

## 2. Fachliche Stichproben (mindestens 6, Seite und Zitat)

Richtig und gut:

1. Neuronale Netze, Quiz und Text: "Ein Netz hat 3 Eingaben, 4 Neuronen in der Zwischenschicht und 1 Ausgabeneuron" gleich 21 Parameter (12 Gewichte, 4 Verschiebungen, 4 Gewichte, 1 Verschiebung). Richtig. Ebenso "78 500 Parameter" bei 28 mal 28 Eingaben und 100 Neuronen (784 mal 100 plus 100). Richtig.
2. Neuronale Netze: "Würde jede Schicht nur multiplizieren und addieren, ließen sich alle Schichten zu einer einzigen zusammenfassen. Erst die Aktivierung dazwischen macht mehrere Schichten sinnvoll." Das ist genau der Kern, den man im Seminar braucht, und er steht richtig da.
3. Wie ein Modell lernt: "Dieses Gefälle heißt Gradient. Er zeigt bergauf, also geht man in die Gegenrichtung." und "Rückpropagierung ... rechnet vom Fehler am Ausgang rückwärts durch die Schichten". Richtig, auch die Lernrate als Einstellung "vor dem Training, kein Ergebnis des Lernens".
4. Sprachmodelle: "Zahlen ... werden in Blöcke von höchstens drei Ziffern geschnitten" und "Wortschatz mit 128.256 Einträgen". Habe ich im Lab nachgeprüft ("2025" wird "202" und "5"). Richtig. Auch "Das Modell sieht keine Buchstaben, sondern Stücke. Darum verzählt es sich": Mein Test bestätigt es. Das Modell antwortete auf "Wie oft kommt r in Erdbeere vor?" mit "dreimal" (es sind zwei).
5. Bewertung: Konfusionsmatrix und Kennzahlen stimmen (siehe oben). Der Hinweis, dass ein Modell, das nie Alarm schlägt, bei seltenen Ereignissen "fast immer richtig und trotzdem wertlos" ist, ist korrekt und seminarreif.
6. Finetuning oder RAG: "'RAG verhindert Halluzinationen.' Es senkt sie ... Findet die Suche die falschen Stellen, antwortet das Modell trotzdem falsch, nur mit Quelle." Fachlich sauber, und ehrlicher als viele Artikel.

Ungenau oder angreifbar (Das würde mir im Seminar auffallen):

F1. Was ist KI? (/karte): "Heutige KI ist immer auf eine Aufgabe spezialisiert." und "Jedes System kann genau seine Aufgabe." Für klassische Systeme stimmt das, für Sprachmodelle nicht mehr: Dasselbe Llama im Chat zählt, übersetzt, schreibt Code und fasst zusammen. Die Seite widerspricht damit dem eigenen Labor. Für 2026 ist die Aussage so falsch. Richtiger wäre: Es gibt keine allgemeine Intelligenz, aber Basismodelle sind vielseitig.
F2. Grenzen (/llm-grenzen): "Es wählt das wahrscheinlichste nächste Token, auch wenn ihm das Wissen fehlt." Das widerspricht der Seite Generative KI und dem Temperaturregler, wo gerade nicht immer das wahrscheinlichste, sondern gezogen wird. Außerdem: "Stelle die Temperatur niedrig" als Mittel gegen Halluzination. Niedrige Temperatur macht Antworten gleichförmiger, nicht richtiger. Und "Ein 'Ich weiß es nicht' ist im Training seltener als eine Antwort, also ist es auch im Ergebnis seltener" ist eine plausible, aber ungeprüfte Behauptung ohne Beleg.
F3. Embeddings (/rag-embedding): "Nähe heißt ähnlicher Sinn, nicht ähnliche Buchstaben." In meinem Versuch lag "morgens" (Auto springt nicht an) mit 0,73 fast gleichauf mit dem Parkplatz-Satz (0,76), der Protokoll-Satz nur wegen des Wortstamms "morgen". Die Live-Erklärung nennt selbst "Gemeinsame Wörter: auto". Die Werte liegen eng beieinander (0,69 bis 0,76), die Trennschärfe ist gering. Das Lab ist ehrlich, der Merksatz ist zu stark. Ein echter Hinweis wäre: Embeddings mischen Wortähnlichkeit und Bedeutung, Kosinuswerte sind nur als Rangfolge brauchbar (das steht zum Teil im Text, wird im Lab aber nicht gezeigt).
F4. Neuronale Netze: "Mit einer Zwischenschicht aus zwei Neuronen klappt es." Für das XOR-artige Beispiel stimmt das, für "Kreis im Kreis" braucht man mehr (mindestens drei, damit ein geschlossenes Gebiet entsteht). Das Lab bietet "Kreis im Kreis" mit 4 Neuronen an, der Text sagt zwei. Kleiner Widerspruch.
F5. Bewertung: Die Überschrift lautet "Warum '95 Prozent richtig' täuschen kann", die Grafik darunter zeigt "99 % richtig, ohne je Alarm". Zahl passt nicht zur Überschrift.
F6. Fairness (/verzerrung-ethik): "Untersuchungen zu Gesichtserkennung haben gezeigt, dass die Fehlerquote ... unterschiedlich ausfallen kann." Keine Studie genannt, die Werte 1, 2, 9 Prozent sind als "Beispielwerte" gekennzeichnet (gut), aber ich kann es nicht nachschlagen. Für ein Seminar brauche ich den Namen der Studie.

## 3. Tiefe: "Genau lesen" und "Mehr dazu"

- Kurzmodus zeigt nur Kernsätze (Neuronale Netze: 6.559 Zeichen, Genau lesen 12.863). In "Mehr dazu" steht pro Abschnitt der eigentliche Erklärtext, ein Alltagsbeispiel und ein "Merke". Die Beispiele sind klug gewählt und nennen oft selbst die Grenze ("Der Vergleich hinkt bei ...").
- Für Klasse 12 ist das Niveau eine solide Mittelstufe plus. Es fehlen die Dinge, die ein Seminar hören will: kein Rechenbeispiel zur Backpropagation (keine Ableitung, keine Kettenregel), keine Formel für den Verlust (Mittelwert der quadrierten Fehler, Kreuzentropie), kein Softmax (obwohl "Wahrscheinlichkeiten für jedes Stück" erwähnt wird), bei Attention keine Query/Key/Value-Idee und keine Erwähnung, dass ein Sprachmodell nur nach links schaut, kein Wort zu Skalierung, Datenmenge oder Trainingskosten in Zahlen, bei Bias keine Fairnessmaße (Demographic Parity, Equalized Odds) und kein Zielkonflikt zwischen ihnen.
- Es gibt keinen "Für Neugierige"-Zweig, der in die Mathematik geht. Wer tiefer will, steht an der Wand.
- Alltagsbeispiele (Pizzeria, Ampel, Handwerker) sind für 17 stellenweise zu kindlich, aber die Fachbegriffe stehen daneben und werden richtig benutzt. Das stört mich nicht, es hilft beim Erklären.

## 4. Quellen und Weiterlesen

Das ist die größte Lücke für mich. Ich habe die Seiten und die Inhaltsdateien nach "Weiterlesen", Literatur, arXiv, Autorennamen durchsucht: nichts. Die Seite "Lizenzen und Quellen" ist eine reine Lizenzliste (Llama, Ollama, OpenCV, Fotos), keine Fachquellen. Es gibt keine Verweise auf Originalarbeiten (Transformer 2017 wird genannt, aber ohne Titel oder Autoren), keine Studien zur Gesichtserkennung, keine Lehrbücher, keine Links zu Erklärungen mit Mathematik. Auf den Seiten steht kein Datum und kein Stand. Als Urheber steht nur "ein Projekt von Daniel Alisch" ohne Qualifikation. Das ist für eine Seminararbeit keine zitierfähige Quelle.

## 5. Labore: erklären sie oder beeindrucken sie nur?

Sie erklären. Stärken: Das Netz-Lab lässt mich Schichten, Neuronen, Aktivierung und Lernrate verstellen und zeigt Trainings- gegen Testverlust (das ist Überanpassung zum Anfassen). Der Token-Zerleger nutzt den echten Zerleger des Modells. Das Konfusionsmatrix-Lab rechnet richtig. Die Generative-KI-Seite kennzeichnet ihre Demo ehrlich: "Beispielwerte ... kein echtes Modell".
Schwächen: Im Netz-Lab liegen die Regler oben, das Ergebnisbild erst nach dem Scrollen (bei 1440x900 sehe ich beim Training nicht Regler und Grenze zugleich, siehe nn-spirale3.png). Das Chat-Lab hat einen kleinen Antwortkasten, die Live-Erklärung liegt unterhalb. Das Chat-Modell ist langsam (erstes Token nach 15,9 s) und halluziniert erwartungsgemäß: "Was ist ein Jetson?" ergibt eine Familie aus "Die Jetsons" (das sagt die Seite sogar selbst voraus, und das ist ein guter Moment). Aus dem Chat-Lab erfahre ich nicht, warum es "dreimal" statt "zweimal" sagt, außer ich lese die Tokens-Seite. Die Verbindung wird nicht angeboten.

## 6. Was habe ich verstanden (3 Sätze)

Ein neuronales Netz besteht aus Neuronen, die gewichtete Summen bilden und per Aktivierung entscheiden. Ohne die nichtlineare Aktivierung ließen sich alle Schichten zu einer zusammenfassen, deshalb kann ein Netz erst damit gebogene Grenzen lernen, und beim Training werden die Gewichte per Gradientenabstieg so verschoben, dass der Verlust sinkt. Ein Sprachmodell zerlegt Text in Token, macht daraus Embeddings, gewichtet per Attention, welche Token füreinander wichtig sind, und sagt Token für Token das nächste voraus; es ist auf plausible, nicht auf wahre Texte trainiert, deshalb halluziniert es, und RAG senkt das nur, weil es passende Textstellen mitgibt. Bias entsteht aus Daten, Auswahl, Etiketten und Rückkopplung, das Weglassen eines Merkmals genügt wegen Stellvertretern nicht, und Fehlerraten muss man nach Gruppen getrennt ansehen.

## 7. Würde ich es im Seminar als Quelle nennen?

Als Fachquelle: nein. Gründe: keine Quellenangaben und keine Literatur, kein Datum und keine Version, Autor ohne ausgewiesene Fachkompetenz, und fachliche Ungenauigkeiten (F1 bis F6), von denen F1 und F2 inhaltlich falsch bzw. irreführend sind. Eine Lehrkraft fragt nach Primärquellen und streicht das.
Als Veranschaulichung: ja. In einer Präsentation würde ich das Netz-Lab (Spirale, 1 gegen 3 Schichten) und den Token-Zerleger zeigen und im Text auf Originalquellen verweisen, die ich woanders suche. Das Lab nutze ich, die Seite zitiere ich nicht.
Weiterempfehlen: ja, für den Einstieg und zum Üben, nicht zum Belegen.

## 8. Bewertung nach Raster (1 bis 10, streng)

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit fürs Alter | 8 | Sprache klar, Fachwörter erklärt und richtig benutzt, Grenzen der Vergleiche genannt. Abzug: einige Alltagsbeispiele sehr kindlich, Satz "Der Vergleich hinkt" wiederholt sich. |
| 2 | Einstieg und Führung | 6,5 | Startseite klar, aber für mich kein Pfad. "Neu hier" und "Entscheider" passen nicht zu Abi/Studium. 61 Menüpunkte ohne Empfehlung, was ich für das Seminar lese. |
| 3 | Lernwirkung | 7,5 | Kernideen sitzen (Aktivierung, Gradient, Token, Bias). Quizfragen sind zu leicht (Frage 1 nach dem "größeren Gewicht"), keine Transferaufgabe, keine Formeln. |
| 4 | Motivation und Spaß | 7,5 | Spirale lösen ist ein echtes Erfolgserlebnis, der Zerleger macht Spaß. Wenig, was mich als Informatik-Interessierten herausfordert. |
| 5 | Labore und Interaktion | 8,5 | Echte Modelle, ehrliche Kennzeichnung, richtige Zahlen. Abzug: Regler und Ergebnis nicht gleichzeitig sichtbar, Chat langsam (erstes Token nach 15,9 s). |
| 6 | Videos | 6,5 | 80 s, Untertitel, Kapitel, Verweis auf die Seite sind vorhanden. Bild und Ton nicht von mir geprüft (headless), daher vorsichtig. Für Tiefe zu kurz. |
| 7 | Navigation und Orientierung | 7 | Menü, Häkchen für besuchte Seiten, "Weiter geht es". Suche hat Lücken: "backpropagation", "Gehirn" leer, "wer haftet" und "chatgpt" liefern Unpassendes. |
| 8 | Vertrauen und Sicherheit | 8,5 | Einwilligung vorbildlich: Zweck, Weg, Speicherung, Widerruf, ab 16, nicht vorangekreuzt. "Ohne Cloud" und "Es wird nichts gespeichert" ist klar. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Skip-Link, Tastatur, Fokus laut Testskripten da. Von mir nicht vollständig geprüft (keine Kontrastmessung). Screenreader liest die Bilder doppelt ("Eingabe 1 verbunden mit Neuron A" erscheint als Textblock zweimal). |
| 10 | Fehlerfälle | 7 | Einwilligung ablehnen vorbildlich. Aber leeres "Senden" im Chat ohne jede Rückmeldung. Rate-Limit nicht getestet (nicht aufgetreten). |

Gesamtnote (ehrlicher Eindruck, kein Mittelwert): 7,5 von 10. Handwerklich und didaktisch stark, fachlich meist richtig und für Einsteiger sehr gut. Für den Anspruch "Eins-A für Schüler der Oberstufe" fehlen Quellen, Tiefe und ein Pfad für mich.

## 9. Die drei größten Lücken Richtung Eins-A (aus meiner Sicht)

1. Quellen und Weiterlesen: pro Lektion 3 bis 5 Primär- und Lehrquellen (Transformer-Paper, Studie zur Gesichtserkennung, Lehrbuch/Video mit Mathematik), Stand-Datum, Autoren- und Qualitätsangabe, "So zitierst du diese Seite".
2. Tiefe-Stufe "Mathe dazu": Verlustfunktion, Backpropagation mit einem durchgerechneten kleinen Netz, Softmax, Attention-Rechnung, Fairnessmaße. Eigener Aufklappbereich, damit Einsteiger nicht erschlagen werden.
3. Fachliche Korrekturen F1 bis F6, vor allem "Heutige KI ist immer auf eine Aufgabe spezialisiert" und die Halluzinations-Erklärung (wahrscheinlichstes Token, Temperatur), und die Suche (Synonyme wie Backpropagation, Haftung, ChatGPT).

Kleinere Punkte: leere Eingabe im Chat beantworten, Regler und Ergebnis im Netz-Lab gleichzeitig sichtbar halten, Quizfragen auf Anwendungsniveau erweitern.

## 10. Altersweiche (Zusatzfrage des Betreibers)

Die Frage: Einstiegsfrage "Wer bist du? Schule, Beruf, neugierig" bzw. Altersstufe, mit eigener Startseite je Gruppe.

Meine Antwort als 17-Jähriger: Eine feste Weiche mit getrennten Startseiten brauche ich nicht. Ein Pfad nach Ziel würde mir aber sehr helfen. Das ist etwas anderes als eine Altersabfrage.

Warum keine Weiche nach Alter oder Gruppe:
- "Schule" fühlt sich für mich nach Kinderkram an. Ich würde nach einer Schublade "Schule" eher gehen, wenn dort nur Vereinfachtes steht. Ich bin nicht "Schüler", ich will für ein Seminar Neuronale Netze, LLM, RAG und Bias verstehen.
- Die Plattform wirbt mit "ohne Anmeldung" und "Kamera nur mit deiner Zustimmung". Eine Frage nach Alter oder Beruf am Anfang wirkt dagegen wie Datensammeln, und die Altersgrenze 16+ steht schon im Einwilligungsdialog. Eine zusätzliche Altersangabe ohne klaren Zweck senkt das Vertrauen.
- Mehrere Startseiten heißen mehrfach pflegen und mehrfach korrigieren. Die Inhalte (Neuronale Netze, Tokens) sind für alle gleich, nur die Reihenfolge und Tiefe unterscheiden sich.
- Wer die Falsche wählt, merkt es nicht und bleibt in der falschen Schublade.

Was stattdessen reicht, wenn die Navigation besser ist:
- Auf der einen Startseite eine Zeile "Wofür bist du hier?" mit Auswahl nach Ziel, nicht nach Person: "KI verstehen von Grund auf", "Für Abitur oder Studium", "Für meinen Betrieb", "Nur mal ausprobieren". Jede Wahl führt zu einem Lernpfad, nicht zu einer eigenen Seite. Merken nur lokal und freiwillig, jederzeit änderbar.
- Auf jeder Lektion der Schalter "Kurz lesen / Genau lesen" gibt es schon. Ergänzen um "Mit Mathe", dann entscheidet der Lernende selbst über die Tiefe, ohne einsortiert zu werden.

Was auf MEINER Startseite (Pfad "Abitur und Studium") stehen müsste:
1. Reihenfolge in sechs Schritten, jeweils mit Zeitangabe: Neuronale Netze, Wie ein Modell lernt, Sprachmodelle, Embeddings, RAG im Überblick, Fairness und Verantwortung. Dahinter Grenzen als Pflichtlektüre.
2. Ein Satz, worauf der Pfad vorbereitet: "Das brauchst du für Seminararbeit und Referat: Begriffe, Mechanismus, Grenzen."
3. Pro Lektion ein Kasten "Fachbegriffe" (Gewicht, Verlustfunktion, Gradient, Token, Embedding, Attention, Halluzination, Bias) zum Nachschlagen, plus Link zur Glossar-Suche.
4. Pro Lektion "Quellen und Weiterlesen" mit echten Primärquellen und dem Stand der Seite.
5. Ein Knopf "Mit Mathe": Verlust, Backpropagation durchgerechnet, Softmax, Attention.
6. Eine Seite "So nutzt du das Labor für ein Referat": welche Labore sich als Demo eignen, wie man sie zitiert, welche Aussagen man gegenprüfen soll (siehe F1 bis F6).
7. Ein Selbsttest "Kann ich das erklären?" mit freier Erklärung in drei Sätzen statt reiner Multiple-Choice.
8. Ein klarer Hinweis zur Altersgrenze 16+ und zu Kamera/Mikrofon schon auf der Startseite, damit ich vor einem Klassenverband nicht überrascht werde.
