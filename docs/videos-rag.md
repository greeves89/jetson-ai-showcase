# Videos im Strang "Wissen und RAG"

Acht Folgen, je 70 bis 100 Sekunden. Gebaut werden sie später (Animation, eine Stimme). Die IDs stehen in `videos` der Seiten in `app/static/content-rag.js`.

Regeln für alle Folgen:
- Sprechtext in der Du-Form, kurze Sätze, ohne Zeichen, die man nicht spricht (keine Pfeile, Klammern, Gedankenstriche). Zahlen sind ausgeschrieben.
- Bilder sind animierte Diagramme in der Gestaltung des Labors. Keine Stockfotos, keine Kundendaten, keine echten Namen.
- Richtwert für das Tempo: etwa 2,5 Wörter pro Sekunde. Die reine Sprechzeit liegt bei 60 bis 80 Sekunden, dazu kommen kurze Pausen zwischen den Szenen, in denen die Animation wirkt. Die Länge der Szenen ist ein Vorschlag und wird beim Schnitt an die Stimme angepasst.
- Kürzel wie BM25 werden im Sprechtext ausgeschrieben, damit die Stimme sie richtig liest.
- Jede Folge endet mit einem Satz, der auf die passende Lernseite verweist.

---

## rag-ueberblick: RAG in einer Minute

Seite: `rag-ueberblick`. Länge: etwa 90 Sekunden.
Kernaussage: RAG lässt ein Sprachmodell erst in deinen Dokumenten nachschlagen und dann mit Quelle antworten.
Alltagsbeispiel: Open-Book-Prüfung und Bibliothek mit Auskunftsperson.

1. Szene, 0 bis 12 s. Bild: Ein Prüfungstisch, auf dem nur ein Blatt mit der Frage liegt. Rechts eine Figur mit leerer Sprechblase. Sprechtext: "Ein Sprachmodell hat sehr viel gelesen. Aber nicht dein Handbuch. Nicht deinen Vertrag. Nicht das Protokoll von gestern. Fragst du danach, rät es."
2. Szene, 12 bis 24 s. Bild: Dasselbe Bild, jetzt klappt ein Buch auf dem Tisch auf, die Figur blättert. Sprechtext: "Stell dir stattdessen eine Prüfung vor, bei der du ins Buch schauen darfst. Du musst nicht alles wissen. Du musst die richtige Seite finden und sie richtig lesen. Genau das macht RAG."
3. Szene, 24 bis 42 s. Bild: Ein Dokument links zerfällt in Textstreifen. Jeder Streifen verwandelt sich in eine kurze Zahlenreihe und fliegt in ein Regal mit Schubladen. Sprechtext: "Zuerst bereitest du die Dokumente vor. Der Text wird in kleine Stücke geteilt. Jedes Stück wird zu einer Liste von Zahlen, die seine Bedeutung beschreibt. Alle Stücke landen in einem Index, so heißt die durchsuchbare Ablage."
4. Szene, 42 bis 58 s. Bild: Eine Frage erscheint oben, wird zur Zahlenreihe und fliegt in das Regal. Drei Schubladen leuchten auf. Sprechtext: "Dann stellst du eine Frage. Auch sie wird zu Zahlen. Die Stücke, die der Frage am nächsten liegen, sind die Treffer."
5. Szene, 58 bis 74 s. Bild: Die drei Treffer wandern als Karten zur Figur. Sie schreibt eine Antwort, darunter eine Fußnote mit Dokumentname. Sprechtext: "Die Treffer gehen zusammen mit deiner Frage an das Modell. Es antwortet nur mit diesen Stücken und nennt die Quelle. Du kannst jede Aussage nachschlagen."
6. Szene, 74 bis 90 s. Bild: Das Regal bekommt ein Warnschild, die Karten werden grau und unscharf. Sprechtext: "RAG ist kein Wundermittel. Sind die Quellen schlecht oder findet die Suche die falschen Stellen, wird auch die Antwort schlecht. Darum schauen wir uns jeden Schritt einzeln an. Fang auf der Seite RAG im Überblick an."

---

## rag-embedding: Wie aus Text Zahlen werden

Seite: `rag-embedding`. Länge: etwa 90 Sekunden.
Kernaussage: Ein Embedding setzt einen Text als Punkt auf eine Karte der Bedeutung, und Nähe heißt ähnlicher Sinn.
Alltagsbeispiel: Stadtplan und Eisdiele.

1. Szene, 0 bis 14 s. Bild: Ein einfacher Stadtplan mit Bahnhof, Busbahnhof und Friedhof. Zwei Koordinaten werden zu jedem Ort eingeblendet. Sprechtext: "Auf einem Stadtplan hat jeder Ort zwei Zahlen: wie weit nach Osten, wie weit nach Norden. Bahnhof und Busbahnhof liegen nah beieinander, der Friedhof weit weg. Dafür muss der Plan nichts über Bahnhöfe wissen."
2. Szene, 14 bis 28 s. Bild: Drei Eissorten als Balkengruppen mit den Skalen süß, fruchtig, cremig. Zitrone und Himbeere sehen fast gleich aus, Nuss ganz anders. Sprechtext: "Das geht auch mit Eis. Jede Sorte bekommt drei Werte: süß, fruchtig, cremig. Zitrone und Himbeere sind fast gleich. Nuss ist ganz anders. Eine Liste von Zahlen, die etwas beschreibt, heißt Vektor."
3. Szene, 28 bis 46 s. Bild: Ein Satz in der Mitte, daneben ein Netz mit vielen Knoten, rechts eine lange Zahlenreihe. Sprechtext: "Bei Text kann niemand die Werte von Hand festlegen. Das macht ein Embedding-Modell. Es bekommt einen Satz und gibt eine lange Liste von Zahlen zurück. In diesem Labor sind es siebenhundertachtundsechzig."
4. Szene, 46 bis 62 s. Bild: Eine zweidimensionale Karte, auf der Sätze als Punkte erscheinen. Sätze über Essen sammeln sich oben links, Sätze über Autos unten rechts. Sprechtext: "Gelernt hat das Modell aus riesigen Textmengen. Wer in ähnlichen Zusammenhängen vorkommt, bekommt ähnliche Zahlen. So entsteht eine Karte der Bedeutung. Was ähnlich klingt, liegt nah beieinander, auch mit ganz anderen Wörtern."
5. Szene, 62 bis 78 s. Bild: Zwei Pfeile vom selben Punkt, ihr Winkel wird als Bogen markiert. Daneben der Wert eins, null und minus eins. Sprechtext: "Wie nah zwei Punkte sind, misst man oft mit dem Kosinus. Er schaut auf die Richtung der Pfeile. Gleiche Richtung ergibt eins. Ein rechter Winkel ergibt null."
6. Szene, 78 bis 90 s. Bild: Die Karte, auf der eine neue Frage als leuchtender Punkt landet und die nächsten Punkte aufleuchten. Sprechtext: "Deine Frage wird genauso zum Punkt. Die nächsten Nachbarn sind die Treffer. Mehr dazu auf der Seite Vektorisieren und Embeddings."

---

## rag-embedding-beachten: Embeddings, die vier Stolpersteine

Seite: `rag-embedding`. Länge: etwa 80 Sekunden.
Kernaussage: Embeddings funktionieren nur, wenn Modell, Sprache, Textlänge und Wortlaut zusammenpassen.
Alltagsbeispiel: Zwei Stadtpläne von verschiedenen Verlagen, Ersatzteillager mit Teilenummern.

1. Szene, 0 bis 12 s. Bild: Zwei Stadtpläne nebeneinander, in jedem ein Punkt mit denselben Koordinaten, aber an ganz verschiedenen Orten. Sprechtext: "Erster Stolperstein: das Modell. Zwei Stadtpläne von verschiedenen Verlagen haben verschiedene Koordinaten. Dieselbe Zahl heißt auf jedem etwas anderes."
2. Szene, 12 bis 26 s. Bild: Dokumentpunkte in Blau, ein Fragepunkt in Orange von anderem Modell, weit abseits. Sprechtext: "Darum brauchen Dokumente und Fragen immer dasselbe Modell, in derselben Version. Wechselst du das Modell, passt der alte Index nicht mehr. Dann musst du alles neu einbetten."
3. Szene, 26 bis 40 s. Bild: Ein sehr langer Textstreifen wird in einen einzigen Punkt gepresst, der verschwommen wird. Sprechtext: "Zweiter Stolperstein: die Länge. Ein Embedding fasst einen ganzen Text in einer Zahlenliste zusammen. Je länger und bunter der Text, desto verwaschener wird sie. Darum teilt man ihn vorher in Stücke."
4. Szene, 40 bis 54 s. Bild: Eine Weltkarte mit Sprachen, ein Fachwort-Wolke, einzelne Punkte bleiben grau. Sprechtext: "Dritter Stolperstein: Sprache und Fachgebiet. Ein Modell versteht gut, was es oft gesehen hat. Seltene Sprachen und Fachjargon liegen ungenauer. Teste mit eigenen Fragen und nimm bei gemischten Sprachen ein mehrsprachiges Modell."
5. Szene, 54 bis 68 s. Bild: Zwei Teilenummern, die sich in einer Ziffer unterscheiden, werden auf der Karte fast übereinander gelegt. Sprechtext: "Vierter Stolperstein: genaue Zeichen. Namen, Codes und Zahlen tragen wenig Bedeutung, aber viel Genauigkeit. Zwei Teilenummern mit einer anderen Ziffer sind für das Modell fast dasselbe. Hier hilft zusätzlich eine Stichwortsuche."
6. Szene, 68 bis 80 s. Bild: Eine Checkliste mit vier Häkchen und einem Schloss für Datenschutz. Sprechtext: "Und noch etwas: Zum Einbetten geht dein Text an ein Modell. Läuft es bei dir, bleibt er im Haus. Läuft es in der Cloud, musst du das klären. Vektoren behandelst du wie die Originale."

---

## rag-chunking: Text in sinnvolle Stücke teilen

Seite: `rag-chunking`. Länge: etwa 90 Sekunden.
Kernaussage: Ein guter Chunk behandelt eine Sache und ist allein verständlich, zu klein verliert Zusammenhang, zu groß verwässert den Treffer.
Alltagsbeispiel: Kochbuch, Karteikarten, Stichwortverzeichnis.

1. Szene, 0 bis 12 s. Bild: Ein dickes Kochbuch klappt auf, die Rezepte sind farbige Blöcke. Ein Finger zeigt auf einen Block. Sprechtext: "Ein Kochbuch ist in Rezepte geteilt. Wer Carbonara sucht, liest nicht das ganze Buch, sondern ein Rezept. Genau so teilt man Dokumente für die Suche in Stücke, die Chunks heißen."
2. Szene, 12 bis 28 s. Bild: Ein langer Textstreifen wird in gleich lange Stücke geschnitten. Eine Schere schneidet mitten durch einen Satz. Sprechtext: "Der einfachste Weg ist die feste Länge. Alle paar hundert Zeichen ein Schnitt. Das ist schnell, aber es schneidet mitten durch Sätze und Gedanken."
3. Szene, 28 bis 44 s. Bild: Derselbe Text, diesmal bricht er an Absätzen und Überschriften. Die Stücke haben verschiedene Längen und passen zu den Themen. Sprechtext: "Besser ist es, an Absätzen und Überschriften zu schneiden. Das folgt der Gliederung des Textes. Dazu gibt es rekursive und semantische Verfahren, die an möglichst natürlichen Stellen schneiden."
4. Szene, 44 bis 60 s. Bild: Drei Karteikarten. Links eine winzige Karte mit Halbsatz, Mitte eine passende, rechts eine riesige Karte voller Text. Sprechtext: "Die Größe zählt. Zu kleine Stücke tragen nur einen Halbsatz, der Zusammenhang fehlt. Zu große Stücke enthalten viel anderes, und der Treffer wird ungenau. Gut ist eine Karteikarte, die für sich allein verständlich ist."
5. Szene, 60 bis 76 s. Bild: Zwei Stücke, deren Enden sich überlagern. Ein Satz an der Grenze leuchtet in beiden. Sprechtext: "Liegt eine Aussage genau auf der Grenze, hilft die Überlappung. Das Ende des einen Stücks wiederholt sich am Anfang des nächsten. So steht der Gedanke mindestens einmal ganz da."
6. Szene, 76 bis 90 s. Bild: Eine Tabelle, die in Zeilen zerfällt, jede Zeile bekommt die Kopfzeile aufgesetzt. Dazu ein Etikett mit Quelle, Kapitel, Datum. Sprechtext: "Bei Tabellen gehört die Kopfzeile zu jeder Zeile. Und jedes Stück merkt sich, woher es kommt: Dokument, Kapitel, Datum. So kannst du später die Quelle nennen. Mehr dazu auf der Seite Chunking."

---

## rag-keywordsuche: Stichwortsuche, das Telefonbuch der KI

Seite: `rag-suche`. Länge: etwa 80 Sekunden.
Kernaussage: Die Stichwortsuche findet Wörter genau und gewichtet seltene Wörter stärker, sie versteht aber keine Umschreibungen.
Alltagsbeispiel: Telefonbuch und Fachleute, die auf seltene Wörter horchen.

1. Szene, 0 bis 12 s. Bild: Ein aufgeschlagenes Telefonbuch, ein Finger fährt auf den Namen Meier. Sprechtext: "Im Telefonbuch suchst du einen Namen und findest genau diesen Namen. Das ist Stichwortsuche. Sie ist schnell und exakt, solange du das richtige Wort kennst."
2. Szene, 12 bis 28 s. Bild: Ein Absatz, in dem die Wörter der Frage gelb markiert werden. Zähler zählen mit. Sprechtext: "Die Grundidee ist einfach: Kommen die Wörter der Frage im Text vor? Die Suche zählt sie. Ein Text mit vielen passenden Wörtern steht oben."
3. Szene, 28 bis 44 s. Bild: Ein Wort wie der in einer Wolke, daneben Dichtungsring mit großem Gewicht. Die Wörter wachsen oder schrumpfen. Sprechtext: "Aber nicht jedes Wort zählt gleich. Das Wort der steht überall und sagt nichts. Das Wort Dichtungsring ist selten und sagt viel. Die Suche gibt seltenen Wörtern mehr Gewicht. Das gängige Verfahren dafür heißt B M fünfundzwanzig."
4. Szene, 44 bis 58 s. Bild: Eine Kurve, die erst steil ansteigt und dann flach wird, darunter ein langer und ein kurzer Text mit gleichem Rang. Sprechtext: "Zwei weitere Regeln: Ein Wort, das zwanzigmal vorkommt, ist nicht zwanzigmal wichtiger als eins, das fünfmal vorkommt. Und lange Texte werden nicht bevorzugt, nur weil sie lang sind."
5. Szene, 58 bis 70 s. Bild: Zwei Suchen: Fehlercode E-4711 findet sofort den richtigen Absatz, Auto abstellen findet nichts, weil im Text Fahrzeug parken steht. Sprechtext: "Stark ist diese Suche bei Fehlercodes, Namen und Zahlen. Schwach ist sie bei Umschreibungen. Wer Auto abstellen fragt, findet nicht den Absatz über das Parken von Fahrzeugen."
6. Szene, 70 bis 80 s. Bild: Ein Fragezeichen über dem Wort Sinn, daneben die Bedeutungskarte. Sprechtext: "Dafür gibt es die Suche nach Bedeutung. Beide zusammen sehen wir im nächsten Video."

---

## rag-hybridsuche: Stichwort und Bedeutung zusammen

Seite: `rag-suche`. Länge: etwa 90 Sekunden.
Kernaussage: Die Hybridsuche führt die Ranglisten von Stichwort und Vektor über die Platzierung zusammen, wer in beiden vorn liegt, gewinnt.
Alltagsbeispiel: Kellner, der Italienisches empfiehlt, und zwei Jurorinnen mit verschiedenen Bewertungen.

1. Szene, 0 bis 12 s. Bild: Ein Restaurant, ein Gast sagt "etwas Italienisches". Auf dem Tisch erscheinen Pizza, Pasta, Tiramisu. Sprechtext: "Du sagst im Restaurant: Ich suche etwas Italienisches. Der Kellner empfiehlt Pizza und Pasta, obwohl du keins dieser Wörter genannt hast. Das ist Suche nach Bedeutung."
2. Szene, 12 bis 26 s. Bild: Zwei Spalten. Links die Stichwortsuche mit Rangliste, rechts die Vektorsuche mit anderer Rangliste. Einige Texte stehen nur links oder nur rechts. Sprechtext: "Beide Methoden haben ihre Stärken. Die Stichwortsuche trifft genaue Wörter. Die Vektorsuche trifft den Sinn. Bei der Hybridsuche laufen beide, und jede liefert eine eigene Rangliste."
3. Szene, 26 bis 42 s. Bild: BM25-Punkte wie zwölf Komma vier und Kosinus wie null Komma einundachtzig, durchgestrichenes Pluszeichen dazwischen. Sprechtext: "Die Punkte beider Listen kann man nicht addieren. Die eine rechnet in Zehnern, die andere in Bruchteilen von eins. Also schaut man nur auf die Platzierung."
4. Szene, 42 bis 62 s. Bild: Eine Punktetafel. Platz eins bekommt viele Punkte, Platz zwei weniger, und so weiter. Text X steht in einer Liste auf Platz eins, Text Y in beiden auf Platz zwei. Sprechtext: "Jede Platzierung bringt Punkte, oben mehr, unten weniger. Die Punkte aus beiden Listen werden addiert. Steht ein Text nur in einer Liste ganz oben, bekommt er einmal viele Punkte. Steht ein anderer in beiden auf Platz zwei, bekommt er zweimal ordentlich Punkte, und der gewinnt."
5. Szene, 62 bis 78 s. Bild: Zwei Regler. Einer für Stichwort, einer für Vektor, daneben ein Eimer mit der Aufschrift top k. Sprechtext: "Du kannst festlegen, welche Methode mehr zählt. Viele Codes und Namen: mehr Stichwort. Fragen in Alltagssprache: mehr Vektor. Und du bestimmst, wie viele Treffer ans Modell gehen. Zu wenige, und die Antwort fehlt. Zu viele, und das Modell wird abgelenkt."
6. Szene, 78 bis 90 s. Bild: Ein Regal mit Etiketten für Abteilung und Jahr, die Suche läuft nur im markierten Fach. Sprechtext: "Und mit Filtern grenzt du vorher ein, etwa auf ein Jahr oder eine Abteilung. Wie du das alles misst, zeigt die Seite Suchen und später die Seite zur Bewertung."

---

## rag-reranking: Erst grob, dann genau

Seite: `rag-reranking`. Länge: etwa 85 Sekunden.
Kernaussage: Ein Reranker liest Frage und Kandidat gemeinsam und stellt die Reihenfolge der besten Treffer genauer, kostet aber Zeit.
Alltagsbeispiel: Vorauswahl von Bewerbungen, dann Gespräche.

1. Szene, 0 bis 12 s. Bild: Ein Stapel mit zweihundert Mappen, ein großer Trichter, unten kommen fünfzehn heraus. Sprechtext: "Zweihundert Bewerbungen, eine Stelle. Niemand führt zweihundert Gespräche. Also sortiert man zuerst nach den Unterlagen aus. Fünfzehn bleiben übrig."
2. Szene, 12 bis 26 s. Bild: Zwei Personen im Gespräch, daneben eine Uhr, die schnell vorrückt. Sprechtext: "Mit diesen fünfzehn führst du Gespräche. Das dauert, aber es zeigt, wer wirklich passt. Genau so arbeitet eine zweistufige Suche."
3. Szene, 26 bis 42 s. Bild: Die Textstreifen mit ihren Vektoren im Regal, die Frage als Punkt. Pfeile gehen nur zu Zahlenreihen, nicht zu den Texten. Sprechtext: "Die erste Suche vergleicht nur fertige Zahlenlisten. Der Text und die Frage begegnen sich nie. Das ist schnell, auch bei Millionen Stücken. Aber es ist grob. Die richtige Stelle liegt oft nur auf Platz neun."
4. Szene, 42 bis 60 s. Bild: Ein Kandidat und die Frage werden zusammen in einen Rahmen gelegt, ein Lesezeichen leuchtet bei den passenden Wörtern, ein Punktwert erscheint. Sprechtext: "Ein Reranker liest die Frage und den Text gemeinsam. Er sieht, wie sie zusammenpassen, und vergibt einen Punktwert. Das ist genauer, braucht aber für jeden Kandidaten einen eigenen Durchgang."
5. Szene, 60 bis 76 s. Bild: Eine Rangliste mit zwanzig Zeilen, die sich neu sortiert. Die Zeile auf Platz neun gleitet nach oben auf Platz eins. Sprechtext: "Darum holt die Suche erst zwanzig oder fünfzig Kandidaten. Der Reranker sortiert sie neu. Die besten drei bis fünf gehen an das Sprachmodell. Die Stelle von Platz neun steht jetzt ganz oben."
6. Szene, 76 bis 85 s. Bild: Eine Waage mit Uhr auf der einen und Treffsicherheit auf der anderen Seite. Sprechtext: "Das kostet Wartezeit. Ob es sich lohnt, zeigt ein Test mit echten Fragen. Dazu mehr im nächsten Video."

---

## rag-bewertung: Gut ist, was du misst

Seite: `rag-bewertung`. Länge: etwa 95 Sekunden.
Kernaussage: Mit einem kleinen Testset aus echten Fragen misst du Suche und Antwort getrennt und verbesserst von vorn nach hinten.
Alltagsbeispiel: Klassenarbeit mit Lösungsschlüssel, Autowerkstatt.

1. Szene, 0 bis 12 s. Bild: Ein Chatfenster, drei gute Antworten mit grünen Häkchen, dann eine vierte mit rotem Kreuz. Sprechtext: "Drei Fragen, drei gute Antworten. Fertig? Nein. Dann fragt jemand etwas anderes, und die Antwort ist falsch. Mit wenigen Beispielen siehst du nur, dass es manchmal klappt."
2. Szene, 12 bis 28 s. Bild: Eine Tabelle mit Spalten Frage, Fundstelle, erwartete Antwort, die Zeile für Zeile gefüllt wird. Sprechtext: "Darum baust du ein Testset. Du sammelst echte Fragen und notierst bei jeder, wo die Antwort steht. Einige Dutzend reichen für den Anfang. Nimm auch Fragen auf, auf die es keine Antwort gibt."
3. Szene, 28 bis 46 s. Bild: Eine Rangliste, in der die richtige Fundstelle farbig ist. Daneben wächst ein Balken für die Trefferquote auf achtzig Prozent. Sprechtext: "Dann misst du die Suche. Wie oft liegt die richtige Stelle unter den ersten fünf Treffern? Vierzig von fünfzig Fragen heißt achtzig Prozent. Und auf welchem Platz steht sie? Je weiter oben, desto besser."
4. Szene, 46 bis 62 s. Bild: Ein Antworttext, jede Aussage hat einen Faden, der zur Fundstelle führt. Ein loser Faden endet im Leeren. Sprechtext: "Dann misst du die Antwort. Stimmt sie? Steht jede Aussage wirklich im vorgelegten Text? Fehlt etwas Wichtiges? Eine Aussage ohne Beleg heißt: Das Modell hat etwas erfunden."
5. Szene, 62 bis 80 s. Bild: Eine Kette mit vier Gliedern: Daten, Suche, Reranking, Modell. Ein Pfeil wandert von links nach rechts. Sprechtext: "Beim Verbessern fängst du vorn an. Erst Daten und Stücke, dann die Suche, dann der Reranker, zuletzt das Modell. Wie in der Werkstatt: erst die Reifen prüfen, dann den Motor. Und ändere immer nur eine Sache."
6. Szene, 80 bis 95 s. Bild: Ein Schloss an einem Regal, daneben ein Kalender mit Haken und eine Protokollliste. Sprechtext: "Und denk an die Rechte. Wer was finden darf, wird vor der Suche geprüft, nicht danach. Halte die Dokumente aktuell und lies die Protokolle. Sie liefern deine nächsten Testfragen."
