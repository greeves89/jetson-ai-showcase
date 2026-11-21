/* Strang "Wissen und RAG": sechs Lektionen, die RAG von Grund auf erklaeren.
   Reihenfolge am Ende der Datei: erst die sechs Lektionen, dann das Labor "rag". */
(function () {
const S = {};

/* ====================================================================== 1 Ueberblick */
S["rag-ueberblick"] = {
  nav: "RAG im Überblick", typ: "lektion", gruppe: "Wissen und RAG", titel: "RAG im Überblick", symbol: "rag",
  videos: ["rag-ueberblick"],
  kurz: "Ein Sprachmodell kennt deine Dokumente nicht. RAG löst das, indem es vor jeder Antwort in ihnen nachschlägt. Diese Seite zeigt das Ganze in einem Bild, die nächsten Seiten gehen jeden Schritt durch.",
  abschnitte: [
    {h: "Das Problem: Das Modell war nicht dabei", p: [
      "Ein [[modell|Sprachmodell]] hat beim Training sehr viel Text gelesen. Dein Handbuch, dein Vertrag und das Protokoll von gestern waren nicht dabei. Fragst du danach, hat es zwei Möglichkeiten: zugeben, dass es das nicht weiß, oder etwas Plausibles erfinden. Das Zweite passiert oft. Man nennt es [[halluzination|Halluzination]].",
      "Dazu kommt ein zweites Problem. Auch das Wissen, das im Modell steckt, ist ein Schnappschuss vom Zeitpunkt des Trainings. Wer fragt, was heute in der Preisliste steht, bekommt bestenfalls den Stand von irgendwann.",
    ], alltag: [
      "Stell dir zwei Prüfungen vor. In der ersten musst du alles aus dem Kopf wissen. Fehlt dir etwas, rätst du. In der zweiten, einer Open-Book-Prüfung, darfst du ins Buch schauen. Du musst nicht mehr alles wissen, aber du musst schnell die richtige Seite finden und sie richtig lesen.",
      "RAG macht aus der ersten Prüfung die zweite. Der Vergleich hinkt an einer Stelle: Das Modell blättert nicht selbst. Eine Suche legt ihm die aufgeschlagenen Seiten vor.",
    ]},
    {h: "Die Grundidee: erst nachschlagen, dann antworten", p: [
      "[[rag|RAG]] steht für Retrieval-Augmented Generation, auf Deutsch etwa: Antworten erzeugen, ergänzt durch Nachschlagen. Der Ablauf hat zwei Hälften. Zuerst sucht ein Programm in deinen Dokumenten die Stellen, die zur Frage passen (Retrieval). Dann bekommt das Sprachmodell die Frage zusammen mit diesen Stellen und formuliert eine Antwort (Generation).",
      "Das Wissen liegt dabei nicht im Modell, sondern in deinen Dokumenten. Du kannst sie austauschen, ergänzen und löschen, ohne am Modell etwas zu ändern.",
    ], alltag: [
      "Eine Bibliothek mit Auskunftsperson. Du fragst: Was gilt bei einer Kündigung in der Probezeit? Die Auskunftsperson kennt nicht alles auswendig. Sie geht ins Regal, holt drei passende Bücher, legt sie aufgeschlagen auf den Tisch und fasst für dich zusammen, mit Seitenangabe.",
      "Die Qualität hängt an zwei Dingen: Findet sie die richtigen Bücher, und fasst sie sauber zusammen? Genau diese zwei Teile hat RAG.",
    ]},
    {h: "Die Pipeline in einem Bild", p: [
      "Es gibt zwei Phasen. Die erste läuft vorab und immer dann, wenn sich Dokumente ändern. Die zweite läuft bei jeder Frage. Zusammen heißen die Schritte [[pipeline|Pipeline]]: Das Ergebnis eines Schritts ist die Eingabe des nächsten.",
    ], liste: [
      "**Vorbereitung 1, Aufbereiten:** Text aus PDF, Word oder Webseiten holen, Kopfzeilen und Müll entfernen.",
      "**Vorbereitung 2, Zerlegen:** Den Text in kleine, sinnvolle Stücke teilen ([[chunk|Chunks]]). Mehr dazu auf der Seite {{rag-chunking|Chunking}}.",
      "**Vorbereitung 3, Vektorisieren:** Jedes Stück wird zu einer Liste von Zahlen, die seine Bedeutung beschreibt. Siehe {{rag-embedding|Vektorisieren und Embeddings}}.",
      "**Vorbereitung 4, Speichern:** Stücke, Zahlen und Herkunft kommen in einen [[index|Index]], das ist die durchsuchbare Ablage.",
      "**Abfrage 1, Suchen:** Die Frage wird genauso in Zahlen verwandelt. Die Stücke mit der größten Nähe sind die Treffer. Siehe {{rag-suche|Suchen}}.",
      "**Abfrage 2, Sortieren (optional):** Die besten Kandidaten werden noch einmal genauer geprüft, siehe {{rag-reranking|Reranking}}.",
      "**Abfrage 3, Antworten:** Die Treffer gehen mit der Frage an das Sprachmodell. Es antwortet und nennt die Quelle.",
    ], tabelle: {
      beschriftung: "Jeder Schritt hat seine eigenen Fehlerquellen",
      kopf: ["Schritt", "Läuft wann", "Typischer Fehler"],
      zeilen: [
        ["Aufbereiten", "einmal, bei Änderung", "Text aus dem PDF ist durcheinander, Tabellen sind zerrissen"],
        ["Zerlegen", "einmal, bei Änderung", "Die Antwort liegt halb im einen, halb im anderen Stück"],
        ["Vektorisieren", "einmal, bei Änderung", "Falsches Modell oder zu langer Text, Bedeutung verwischt"],
        ["Suchen", "bei jeder Frage", "Der richtige Absatz liegt auf Platz 12 statt auf Platz 2"],
        ["Antworten", "bei jeder Frage", "Das Modell überliest die Fundstelle oder ergänzt aus eigenem Wissen"],
      ],
    }, merke: "Gute Antworten entstehen zuerst durch gute Treffer. Das Modell kann nur verwerten, was die Suche ihm vorlegt."},
    {h: "Was das Modell am Ende bekommt", p: [
      "Im Kern ist es ein gewöhnlicher Prompt mit drei Teilen: einer Anweisung, den Fundstellen und deiner Frage. Die Anweisung lautet sinngemäß: Antworte nur mit den folgenden Auszügen. Steht die Antwort nicht darin, sage das und nenne die Quelle.",
      "Der Satz „nur mit den Auszügen“ ist wichtig. Ohne ihn mischt das Modell gern eigenes Halbwissen dazu. Die Quellenangabe macht die Antwort prüfbar: Du öffnest die Fundstelle und siehst, ob es stimmt. Das ist der eigentliche Gewinn gegenüber einem Chat ohne Dokumente.",
    ], alltag: [
      "Eine Journalistin darf nur aus den vorgelegten Akten schreiben und belegt jeden Satz mit dem Aktenzeichen. Ihr Chefredakteur kann jede Behauptung nachschlagen. Fehlt die Akte, schreibt sie „dazu liegt nichts vor“, statt etwas zu vermuten. Genau das verlangst du vom Modell.",
    ]},
    {h: "Wann RAG die richtige Wahl ist", p: [
      "Es gibt drei Wege, einem Modell Wissen zu geben. Der erste ist ein langer Prompt: Du kopierst alles Wichtige in die Frage. Der zweite ist RAG. Der dritte ist die Feinabstimmung (Fine-Tuning): Das Modell wird mit eigenen Beispielen nachtrainiert.",
      "Als Faustregel gilt: Fakten gehören ins Dokument, Verhalten und Stil gehören ins Modell. Ein langer Prompt genügt, wenn die gesamte Wissensmenge klein ist, zum Beispiel ein paar Seiten, und sich selten ändert. Er wird teuer und unscharf, wenn du bei jeder Frage hunderte Seiten mitschickst. Das [[kontext|Kontextfenster]] ist begrenzt, jede mitgeschickte Seite kostet Rechenzeit, und Modelle gehen mit sehr langen Texten oft weniger sorgfältig um.",
    ], tabelle: {
      beschriftung: "Drei Wege, Wissen ins Spiel zu bringen",
      kopf: ["Weg", "Wo das Wissen steckt", "Gut für", "Schwach bei"],
      zeilen: [
        ["Langer Prompt", "in jeder einzelnen Anfrage", "kleine, stabile Wissensmengen, schnelle Versuche", "viel Text, häufigen Änderungen, Kosten je Anfrage"],
        ["RAG", "in deinen Dokumenten, außerhalb des Modells", "große oder wechselnde Wissensbestände, Quellenangabe, Zugriffsrechte", "Fragen über die ganze Sammlung, schlechte Quellen"],
        ["Fine-Tuning", "in den Zahlen des Modells", "Tonfall, Format, feste Arbeitsweise", "aktuellen Fakten, Nachweis der Quelle, schnellem Ändern"],
      ],
    }, alltag: [
      "Kochen. Ein Rezeptbuch aufschlagen ist RAG: Du schaust nach, was in der Küche steht, und kannst das Buch jederzeit austauschen. Ein Kochkurs ist Fine-Tuning: Danach sitzen die Handgriffe, aber die genauen Mengen von Omas Kuchen hast du nicht gelernt. Alle Rezepte auf einen Zettel zu kopieren ist der lange Prompt: Bei drei Rezepten praktisch, bei dreihundert nicht mehr lesbar.",
    ]},
    {h: "Was RAG nicht löst", p: [
      "RAG ist kein Wundermittel. Fünf Grenzen solltest du kennen:",
    ], liste: [
      "**Schlechte Quellen:** Steht im Dokument Veraltetes oder Falsches, kommt es mit Quellenangabe zurück. RAG macht schlechtes Material nicht besser.",
      "**Fragen über alles:** „Was sind die häufigsten Beschwerden der letzten Jahre?“ Die Suche liefert wenige Stellen, keine Gesamtübersicht. Dafür braucht man Auswertung in Daten.",
      "**Rechnen und Logik:** Ein Sprachmodell rechnet nicht verlässlich. Dafür gibt es Werkzeuge, siehe {{agent|Agent}}.",
      "**Widersprüche:** Sagen zwei Dokumente Verschiedenes, entscheidet das Modell nicht zuverlässig, welches gilt.",
      "**Fehlende Rechte:** Ein RAG-System, das jedem alles zeigt, ist ein Datenleck mit freundlicher Oberfläche.",
    ], alltag: [
      "Fragst du die Auskunftsperson in der Bibliothek nach dem Durchschnitt aller Mietpreise in allen Büchern, bringt sie dir drei Bücher mit Beispielen. Ausrechnen muss jemand anderes. Wer eine Gesamtübersicht braucht, braucht ein anderes Werkzeug.",
    ]},
    {h: "So nutzt du diese Reihe", p: [
      "Die folgenden fünf Seiten folgen der Pipeline: {{rag-embedding|Vektorisieren}}, {{rag-chunking|Zerlegen}}, {{rag-suche|Suchen}}, {{rag-reranking|Nachsortieren}} und {{rag-bewertung|Messen}}. Jede Seite erklärt den Schritt von null, mit einem Alltagsbild und mit den Stolpersteinen, die man aus Erfahrung kennt.",
      "Wenn du sehen willst, wie das auf dem Jetson abläuft, öffne die {{rag|RAG-Werkstatt}}. Sie zerlegt deinen Text, bettet ihn mit nomic-embed-text ein, sucht und lässt llama3.2:3b antworten. Hintergründe zu Sprachmodellen findest du bei {{genki|Generative KI}}, zum Begriff der Ähnlichkeit bei {{ml|Maschinelles Lernen}}, und ein Modell zum Ausprobieren im {{chat|Chat-Labor}}.",
    ]},
  ],
  mitnehmen: [
    "RAG lässt ein Sprachmodell erst in deinen Dokumenten nachschlagen und dann antworten, mit Quelle.",
    "Die Antwort ist nur so gut wie die gefundenen Stellen: Suche und Aufbereitung entscheiden mehr als das Modell.",
    "Fakten gehören ins Dokument, Verhalten und Stil ins Modell. RAG ersetzt weder Prüfen noch gute Quellen.",
  ],
  quiz: [
    {frage: "Was passiert bei RAG zuerst, wenn du eine Frage stellst?",
      optionen: ["Das Modell wird mit deinen Dokumenten nachtrainiert", "Eine Suche holt passende Stellen aus deinen Dokumenten", "Das Modell antwortet aus dem Gedächtnis und die Suche prüft später", "Alle Dokumente werden in die Frage kopiert"],
      richtig: 1, erklaerung: "Erst wird nachgeschlagen, dann antwortet das Modell auf Grundlage der Fundstellen. Nachtrainiert wird dabei nichts."},
    {frage: "Eine Firma will, dass ihr Assistent jede Woche die neue Preisliste kennt und die Quelle nennt. Was passt am besten?",
      optionen: ["Fine-Tuning nach jeder Änderung", "Nichts, das Modell weiß es schon", "Ein größeres Modell kaufen", "RAG mit der Preisliste als Dokument"],
      richtig: 3, erklaerung: "Wechselndes Faktenwissen mit Quellenangabe ist der Normalfall für RAG. Das Dokument wird ausgetauscht, das Modell bleibt gleich."},
    {frage: "Das Modell liefert eine falsche Antwort, obwohl die richtige Stelle im Dokument steht. Was prüfst du zuerst?",
      optionen: ["Ob die Suche die richtige Stelle überhaupt gefunden hat", "Ob das Modell zu klein ist", "Ob die Frage zu höflich formuliert war", "Ob der Computer neu gestartet werden muss"],
      richtig: 0, erklaerung: "Meist liegt es an den Treffern. Legt die Suche die falschen Stellen vor, kann auch ein gutes Modell nichts Richtiges daraus machen."},
    {frage: "Welche Frage ist für RAG schlecht geeignet?",
      optionen: ["Wo steht die Kündigungsfrist im Vertrag?", "Welche Schritte hat die Wartungsanleitung für Pumpe 3?", "Wie viele Beschwerden gab es insgesamt in den letzten fünf Jahren pro Monat?", "Was bedeutet Fehlercode E-17 laut Handbuch?"],
      richtig: 2, erklaerung: "Zählen und Auswerten über die ganze Sammlung ist keine Nachschlage-Aufgabe. RAG findet einzelne Stellen, es rechnet nicht über alles."},
    {frage: "Wofür ist die Anweisung „Antworte nur mit den folgenden Auszügen“ im Prompt gut?",
      optionen: ["Sie macht die Antwort schneller", "Sie verhindert, dass das Modell eigenes Halbwissen beimischt", "Sie ersetzt die Suche", "Sie schaltet die Quellenangabe ab"],
      richtig: 1, erklaerung: "Ohne diese Grenze ergänzt das Modell gern aus Gewohnheit. Mit ihr bleibt die Antwort an den Quellen und ist prüfbar."},
  ],
  weiter: ["rag-embedding", "rag", "finetuning-oder-rag", "llm-grenzen"],
};

/* ====================================================================== 2 Embeddings */
S["rag-embedding"] = {
  nav: "Embeddings", typ: "lektion", gruppe: "Wissen und RAG", titel: "Vektorisieren und Embeddings", symbol: "rag",
  widget: "rag-bedeutungskarte", videos: ["rag-embedding", "rag-embedding-beachten"],
  kurz: "Wie bringt man einen Computer dazu, Bedeutung zu vergleichen? Man übersetzt Text in Zahlen, sodass ähnlicher Sinn nah beieinander liegt. Diese Seite erklärt das von null und zeigt, worauf du achten musst.",
  abschnitte: [
    {h: "Der Stadtplan: Nähe als Zahlen", p: [
      "Fang mit einer Karte an. Jeder Ort auf einem Stadtplan lässt sich mit zwei Zahlen beschreiben: wie weit nach Osten, wie weit nach Norden. Mit diesen zwei Zahlen kann ein Computer etwas Sinnvolles tun. Er rechnet Entfernungen aus und sagt, welche Bäckerei dir am nächsten liegt. Von Bäckereien muss er nichts verstehen.",
      "Diesen Trick nutzt man für Text. Man gibt jedem Textstück eine Position. Stücke mit ähnlicher Bedeutung bekommen Positionen nah beieinander, verschiedene liegen weit auseinander. Dann wird aus „Welcher Text passt zu meiner Frage?“ die Aufgabe „Welche Punkte liegen am nächsten?“.",
    ], alltag: [
      "Auf dem Stadtplan liegen Bahnhof und Busbahnhof nah beieinander, der Friedhof am Stadtrand ist weit weg. Niemand musste dem Plan erklären, was ein Bahnhof ist. Die Nähe steckt in den Koordinaten.",
      "Der Vergleich hinkt bei der Zahl der Koordinaten: Ein Stadtplan braucht zwei, eine Karte der Bedeutung deutlich mehr.",
    ]},
    {h: "Was ein Vektor ist", p: [
      "Eine geordnete Liste von Zahlen heißt [[vektor|Vektor]]. Die Koordinaten (3, 5) sind ein Vektor mit zwei Einträgen. Jeder Platz in der Liste steht immer für dieselbe Eigenschaft: Die erste Zahl bedeutet stets Ost-West, die zweite stets Nord-Süd. Nur dann kann man zwei Vektoren miteinander vergleichen.",
      "Ein Vektor muss keinen Ort beschreiben. Er kann ein Profil sein.",
    ], alltag: [
      "Eine Eisdiele bewertet jede Sorte auf drei Skalen von 0 bis 10: süß, fruchtig, cremig. Zitrone bekommt (4, 9, 1), Himbeere (5, 9, 2), Nuss (6, 1, 9). Zitrone und Himbeere haben fast dasselbe Profil und liegen nah beieinander. Nuss liegt weit weg.",
      "Damit hast du Embeddings von Eissorten gebaut, mit drei Dimensionen. Wer „etwas Ähnliches wie Zitrone“ sucht, rechnet nach, welche Sorte dem Profil am nächsten kommt. Die Werte sind ausgedacht, das Prinzip ist echt.",
    ]},
    {h: "Was ein Embedding-Modell tut", p: [
      "Bei den Eissorten hat ein Mensch die drei Skalen festgelegt. Bei Text geht das nicht: Es gäbe zu viele Eigenschaften, und niemand kann sie von Hand bewerten. Deshalb übernimmt ein eigenes neuronales Netz die Aufgabe, das [[embedding|Embedding]]-Modell. Es bekommt einen Text und gibt einen Vektor zurück. Das Modell in diesem Labor heißt nomic-embed-text und liefert 768 Zahlen je Text.",
      "Ein Embedding-Modell schreibt keine Antworten. Es misst nur, wo ein Text auf der Karte der Bedeutung liegt.",
      "Wie hat es das gelernt? Grob so: Man zeigt dem Modell riesige Textmengen. Die Grundannahme lautet, dass Wörter und Sätze, die in ähnlichen Zusammenhängen vorkommen, Ähnliches bedeuten. Beim Training werden Texte, die zusammengehören, zum Beispiel eine Frage und ihre Antwort, so eingestellt, dass ihre Vektoren nah beieinander liegen. Texte ohne Zusammenhang sollen weit auseinander liegen. Nach sehr vielen solcher Beispiele hat das Netz eine Karte gelernt, auf der Sinn Nähe bedeutet.",
    ], alltag: [
      "Lückentext: „Zum Frühstück trinke ich einen ___.“ Kaffee, Tee und Kakao passen, Reifen nicht. Wer viele solche Sätze gelesen hat, weiß, dass Kaffee und Tee verwandt sind, ohne dass es ihm jemand erklärt hat. Das Modell lernt aus dem Zusammenhang, nicht aus einem Wörterbuch.",
    ], merke: "Ein Embedding ist die Position eines Textes auf einer gelernten Bedeutungskarte. Nähe heißt ähnlicher Sinn, nicht ähnliche Buchstaben."},
    {h: "Ähnlichkeit messen", p: [
      "Wie misst man, ob zwei Punkte nah beieinander liegen? Es gibt zwei übliche Wege. Der erste ist der Abstand, die Luftlinie zwischen den Punkten. Der zweite ist die [[cosinus|Kosinus-Ähnlichkeit]]. Sie schaut nicht auf die Entfernung, sondern auf die Richtung der beiden Vektoren.",
      "Bei Text ist die Richtung meist wichtiger als die Länge des Vektors. Ein langer und ein kurzer Text über dasselbe Thema sollen als ähnlich gelten. Deshalb nutzen die meisten Systeme den Kosinus. Sein Wert liegt zwischen -1 und 1. Bei Texten liegen echte Werte meist im oberen Teil dieses Bereichs.",
      "Wichtig: Es gibt keinen festen Wert, ab dem etwas „ähnlich genug“ ist. 0,7 kann bei einem Modell sehr gut sein und bei einem anderen mittelmäßig. Du vergleichst Treffer untereinander. Eine Schwelle musst du an deinem eigenen Material ausprobieren.",
    ], alltag: [
      "Zwei Wanderer starten am selben Ort. Der eine geht langsam, der andere schnell, beide nach Nordosten. Ihre Richtung ist gleich, auch wenn sie nach einer Stunde verschieden weit gekommen sind. Der Kosinus sagt dafür 1. Gehen sie in entgegengesetzte Richtungen, ist er -1, im rechten Winkel zueinander 0.",
    ], tabelle: {
      beschriftung: "Drei Wege, Nähe auszurechnen",
      kopf: ["Maß", "Was es misst", "Gut zu wissen"],
      zeilen: [
        ["Kosinus-Ähnlichkeit", "Winkel zwischen zwei Vektoren, also die Richtung", "Der Standard für Text. Hoher Wert heißt ähnlich."],
        ["Abstand (Luftlinie)", "Entfernung zwischen den Punkten", "Kleiner Wert heißt ähnlich. Bei normierten Vektoren ordnet er die Treffer wie der Kosinus."],
        ["Skalarprodukt", "Mischung aus Richtung und Länge", "Bei normierten Vektoren gleich dem Kosinus und sehr schnell zu rechnen."],
      ],
    }},
    {h: "Dimensionen: warum 768 Zahlen", p: [
      "Die Zahl der Einträge heißt [[dimension|Dimension]]. Unser Modell hat 768. Das sind 768 Eigenschaften, wie bei der Eisdiele, nur sehr viel mehr. Man darf sich die einzelnen Zahlen aber nicht als „Süße“ oder „Freundlichkeit“ vorstellen. Das Modell hat sich seine Eigenschaften selbst ausgedacht, und die meisten haben keinen Namen. Erst alle Zahlen zusammen tragen die Bedeutung.",
      "Mehr Dimensionen können feinere Unterschiede festhalten. Sie kosten aber Speicher und Rechenzeit. Ein Rechenbeispiel: Bei vier Bytes je Zahl brauchen 768 Zahlen gut 3 Kilobyte pro Textstück. Eine Million Stücke brauchen dann gut 3 Gigabyte, nur für die Vektoren.",
      "Zeichnen kann man 768 Dimensionen nicht. Für eine Bedeutungskarte wie die oben werden die Punkte auf zwei Dimensionen gedrückt. Dabei geht Information verloren. Die Karte ist eine Skizze: Was dort nah liegt, ist meist auch in Wirklichkeit nah, aber nicht immer.",
    ], alltag: [
      "Ein Sommelier beschreibt einen Wein mit Dutzenden Merkmalen: Säure, Gerbstoffe, Frucht, Körper und mehr. Kein einzelnes Merkmal sagt „das ist ein Riesling“. Erst das ganze Profil erlaubt es, zwei Weine zu vergleichen. So ist es auch mit den 768 Zahlen.",
    ]},
    {h: "Worauf du achten musst: Passung", p: [
      "Embeddings sind keine Zauberei. Sie folgen Regeln, die man kennen muss. Die wichtigste: Dokumente und Fragen müssen mit demselben Modell eingebettet werden. Jedes Modell hat seine eigene Karte.",
    ], alltag: [
      "Zwei Stadtpläne von verschiedenen Verlagen. Auf dem einen ist die Koordinate (3, 5) der Bahnhof, auf dem anderen ein Parkplatz am Stadtrand. Misst du den Abstand zwischen einem Punkt vom ersten und einem vom zweiten Plan, kommt Unsinn heraus. Dasselbe gilt schon für zwei Versionen desselben Modells.",
    ], tabelle: {
      beschriftung: "Stolpersteine bei der Passung",
      kopf: ["Stolperstein", "Was passiert", "Was du tust"],
      zeilen: [
        ["Verschiedene Modelle für Dokumente und Fragen", "Die Vektoren sind nicht vergleichbar, Treffer wirken zufällig", "Immer dasselbe Modell in derselben Version"],
        ["Modellwechsel", "Der ganze Index passt nicht mehr zur neuen Karte", "Alle Dokumente neu einbetten, Index neu aufbauen"],
        ["Falsche Sprache oder Fachgebiet", "Texte in schwach vertretener Sprache oder Fachjargon landen ungenau", "Mit eigenen Beispielfragen testen, bei gemischten Sprachen ein mehrsprachiges Modell nehmen"],
        ["Text zu lang", "Jedes Modell hat eine Obergrenze. Der Rest wird abgeschnitten oder verwischt", "Vorher in Stücke teilen, siehe {{rag-chunking|Chunking}}"],
        ["Zusatz vor dem Text", "Manche Modelle erwarten einen Vorsatz wie „Frage“ oder „Dokument“", "In der Beschreibung des Modells nachlesen"],
      ],
    }},
    {h: "Worauf du achten musst: Schwächen", p: [
      "Embeddings sind gut für Sinn und schwach bei allem, wo es auf den genauen Wortlaut ankommt. Eigennamen, Artikelnummern, Fehlercodes, Versionsnummern und Zahlen tragen wenig „Bedeutung“, aber viel Genauigkeit. Das Modell kann „E-4711“ und „E-4712“ für fast gleich halten, obwohl es für dich zwei verschiedene Fehler sind.",
      "Auch die Textlänge zählt. Ein Embedding presst einen ganzen Text in eine einzige Zahlenliste. Je länger der Text ist und je mehr Themen er mischt, desto mehr verwischt sie. Darum bettet man kleine, thematisch einheitliche Stücke ein.",
      "Ein technisches Detail ist die [[normalisierung|Normalisierung]]. Viele Systeme skalieren jeden Vektor auf die Länge 1. Dann ist der Kosinus eine einfache Multiplikation mit Aufsummieren, und die Suche wird schnell. Wichtig ist nur, dass Dokumente und Fragen gleich behandelt werden.",
    ], alltag: [
      "Ein Ersatzteillager. „Bremsbelag für Kleinwagen“ findet man über den Sinn. „Teil 4711-B“ ist eine genaue Nummer. Zwei Nummern, die sich in einer Ziffer unterscheiden, sind für den Mechaniker völlig verschiedene Teile, für eine Bedeutungskarte fast dasselbe. Darum ergänzt man die Suche um eine Stichwortsuche, siehe {{rag-suche|Suchen}}.",
    ]},
    {h: "Betrieb: Datenschutz, Kosten, Pflege", p: [
      "Zum Einbetten wird dein Text an ein Modell geschickt. Hier gibt es drei praktische Fragen:",
    ], liste: [
      "**Datenschutz:** Läuft das Modell auf deinem eigenen Gerät, wie hier auf dem Jetson, verlässt nichts das Haus. Bei einem Dienst in der Cloud gehen deine Texte dorthin. Dann müssen Vertrag, Standort und Speicherung geklärt sein. Auch die Vektoren selbst sind Daten aus dem Text: Aus ihnen lässt sich Inhalt zumindest teilweise ableiten. Behandle sie wie die Originale. Das ist keine Rechtsberatung.",
      "**Kosten und Geschwindigkeit:** Einbetten ist viel billiger als eine Antwort zu schreiben, summiert sich aber bei vielen Dokumenten. Dokumente bettest du einmal ein, die Frage bei jeder Anfrage. Miss die Zeit mit deinen eigenen Texten in der {{rag|RAG-Werkstatt}}.",
      "**Pflege:** Ändert sich ein Dokument, muss sein Vektor neu berechnet werden. Sonst sucht die Frage in einer veralteten Karte. Gelöschte Dokumente müssen auch aus dem [[index|Index]]. Wechselst du das Modell, bettest du alles neu ein.",
    ], merke: "Wer ein Embedding-Modell wählt, wählt für den ganzen Index mit. Ein Wechsel kostet eine komplette Neuberechnung."},
  ],
  mitnehmen: [
    "Ein Embedding ist eine Liste von Zahlen, die einen Text auf einer Bedeutungskarte platziert: Nähe heißt ähnlicher Sinn.",
    "Dokumente und Fragen brauchen dasselbe Modell, und bei einem Modellwechsel muss der ganze Index neu berechnet werden.",
    "Embeddings sind schwach bei Zahlen, Codes und Eigennamen. Dort hilft zusätzlich eine Stichwortsuche.",
  ],
  quiz: [
    {frage: "Was bedeutet es, wenn zwei Texte ein ähnliches Embedding haben?",
      optionen: ["Sie enthalten dieselben Wörter", "Sie sind gleich lang", "Sie haben ähnliche Bedeutung", "Sie stammen aus demselben Dokument"],
      richtig: 2, erklaerung: "Das Modell hat gelernt, dass Sinn Nähe bedeutet. Gleiche Wörter sind dafür weder nötig noch ausreichend."},
    {frage: "Du tauschst das Embedding-Modell gegen ein neues aus. Was musst du tun?",
      optionen: ["Alle Dokumente neu einbetten", "Nur die Fragen mit dem neuen Modell einbetten", "Nichts, die alten Vektoren bleiben gültig", "Die Dokumente löschen und die Fragen behalten"],
      richtig: 0, erklaerung: "Jedes Modell hat seine eigene Karte. Alte Vektoren passen nicht zu den neuen, also muss der gesamte Index neu entstehen."},
    {frage: "Warum ist der Kosinus bei Texten oft besser als der reine Abstand?",
      optionen: ["Er funktioniert nur bei kurzen Texten", "Er ist immer genauer", "Er braucht keine Zahlen", "Er schaut auf die Richtung, nicht auf die Länge des Vektors"],
      richtig: 3, erklaerung: "Ein langer und ein kurzer Text über dasselbe Thema zeigen in dieselbe Richtung. Der Kosinus bewertet das als ähnlich."},
    {frage: "Eine Wissensbasis enthält viele Fehlercodes wie E-4711 und E-4712. Was ist wahrscheinlich?",
      optionen: ["Die Embeddings unterscheiden sie sehr zuverlässig", "Die Embeddings halten sie leicht für ähnlich, eine Stichwortsuche hilft", "Embeddings können keine Zahlen speichern", "Die Codes müssen übersetzt werden"],
      richtig: 1, erklaerung: "Codes tragen wenig Bedeutung, aber genauen Wortlaut. Dort ist die Stichwortsuche stark, und beides zusammen ist am besten."},
    {frage: "Was gehört zum Datenschutz beim Einbetten?",
      optionen: ["Nichts, Zahlen sind immer anonym", "Nur die Fragen schützen, nicht die Dokumente", "Klären, wohin der Text beim Einbetten geschickt wird, und die Vektoren wie die Originale behandeln", "Die Vektoren öffentlich ablegen, weil man sie nicht lesen kann"],
      richtig: 2, erklaerung: "Der Text geht an das Modell, und aus Vektoren lässt sich Inhalt zumindest teilweise ableiten. Lokale Modelle halten die Daten im Haus."},
  ],
  weiter: ["rag-chunking", "rag", "ml"],
};

/* ====================================================================== 3 Chunking */
S["rag-chunking"] = {
  nav: "Chunking", typ: "lektion", gruppe: "Wissen und RAG", titel: "Chunking: Text in sinnvolle Stücke teilen", symbol: "rag",
  widget: "rag-chunk-labor", videos: ["rag-chunking"],
  kurz: "Ein Dokument ist zu groß, um es als Ganzes zu suchen. Also teilst du es in Stücke. Wo du schneidest, entscheidet mit darüber, ob die Suche später die richtige Stelle findet.",
  abschnitte: [
    {h: "Warum man Text überhaupt zerlegt", p: [
      "Ein Handbuch mit 300 Seiten lässt sich nicht als Ganzes einbetten und auch nicht als Ganzes an ein Modell schicken. Dafür gibt es zwei Gründe. Der erste ist die Länge: Embedding-Modelle und [[kontext|Kontextfenster]] haben Obergrenzen. Der zweite ist die Genauigkeit: Ein Vektor für 300 Seiten wäre ein verwaschener Durchschnitt aus hundert Themen. Er würde zu fast keiner konkreten Frage gut passen.",
      "Deshalb zerlegt man Text in [[chunk|Chunks]], also Stücke. Jedes Stück bekommt einen eigenen Vektor. Die Suche findet dann nicht „das Handbuch“, sondern „den Absatz über den Filterwechsel“.",
    ], alltag: [
      "Ein Kochbuch ist in Rezepte geteilt. Wer Spaghetti Carbonara sucht, schlägt das Rezept auf und liest nicht das ganze Buch. Das Stichwortverzeichnis am Ende verweist auf Seiten, nicht auf das Buch insgesamt. Chunks sind die Rezepte und Seiten, auf die der Index zeigt.",
      "Wo der Vergleich hinkt: Ein Kochbuch ist von Menschen sauber in Rezepte geteilt. Bei Fließtext, PDF-Seiten und Protokollen musst du selbst entscheiden, wo ein Schnitt hinkommt.",
    ]},
    {h: "Was ein guter Chunk ist", p: [
      "Ein guter Chunk behandelt eine Sache und ist für sich verständlich. Wer ihn allein liest, ohne die Seiten davor und danach, versteht, worum es geht. Das ist die wichtigste Regel. Alles Weitere sind Mittel, sie zu erreichen.",
      "Das Gegenstück ist ein Chunk, der mit „Dies gilt auch dann nicht, wenn …“ beginnt. Das Modell sieht später nur dieses Stück und weiß nicht, worauf sich „dies“ bezieht.",
    ], alltag: [
      "Du schreibst Karteikarten zum Lernen. Eine Karte mit „Siehe oben“ hilft nichts, sobald sie einzeln in der Hand liegt. Eine gute Karte trägt eine Überschrift, eine Aussage und alles, was man zum Verstehen braucht.",
    ], merke: "Ein guter Chunk behandelt eine Sache und ist für sich allein verständlich."},
    {h: "Strategien im Vergleich", p: [
      "Es gibt mehrere Wege zu schneiden. Keiner ist immer der beste. Die Tabelle zeigt die gängigen, vom einfachsten zum aufwendigsten.",
    ], tabelle: {
      beschriftung: "Sechs Strategien zum Zerlegen",
      kopf: ["Strategie", "So schneidet sie", "Stärke", "Schwäche"],
      zeilen: [
        ["Feste Länge", "alle N Zeichen oder Tokens, egal was dort steht", "einfach, gleichmäßig, überall einsetzbar", "schneidet mitten durch Sätze und Gedanken"],
        ["Nach Absatz", "an Leerzeilen", "Absätze sind meist ein Gedanke", "sehr kurze oder sehr lange Absätze"],
        ["Nach Satz", "an Satzenden, mehrere Sätze gebündelt", "nie mitten im Satz", "Zusammenhang über Sätze hinweg geht verloren"],
        ["Nach Struktur", "an Überschriften, Kapiteln, Listenpunkten", "folgt der Gliederung des Autors", "braucht saubere Struktur, Abschnitte sind unterschiedlich lang"],
        ["Rekursiv", "erst am größten Trenner (Kapitel), passt es nicht, am nächstkleineren (Absatz, Satz, Wort)", "hält Stücke in der Zielgröße und schneidet möglichst an natürlichen Stellen", "etwas mehr Konfiguration"],
        ["Semantisch", "schneidet, wo sich das Thema ändert, gemessen an Embeddings", "Stücke folgen dem Sinn", "braucht Rechenzeit, Ergebnis schwer vorhersagbar"],
      ],
    }, alltag: [
      "Ein Brot schneidest du in gleich dicke Scheiben (feste Länge), solange du nur essen willst. Soll es eine Platte mit Belag werden, schneidest du an der Form des Brotes und nach dem Belag (Struktur). Der Brotschneider im Supermarkt wählt eine Dicke und schneidet überall gleich, ob da eine Kruste ist oder nicht. Er ist schnell, aber blind für das Brot.",
    ]},
    {h: "Wie groß sollen die Stücke sein?", p: [
      "Es gibt keine allgemein richtige Größe. Es gibt zwei Seiten, zwischen denen du abwägst.",
    ], liste: [
      "**Zu klein:** Das Stück enthält die Antwort nur zur Hälfte. Der Zusammenhang fehlt („Er muss bis Freitag zahlen“, aber wer?). Die Suche findet Fragmente, und das Modell bekommt zu wenig, um sauber zu antworten.",
      "**Zu groß:** Das Stück enthält die Antwort und viel anderes. Der Vektor wird unschärfer, die Treffer werden ungenauer. Außerdem füllt jedes große Stück das Kontextfenster und kostet Rechenzeit, und das Modell muss die Nadel im Heuhaufen selbst finden.",
    ], alltag: [
      "Das Stichwortverzeichnis eines Sachbuchs. Verweist es auf „Seite 5 bis 120“, hilft es nicht. Verweist es auf einzelne Wörter ohne Zusammenhang, auch nicht. Gut ist die Seite oder der Absatz, in dem das Thema erklärt wird.",
      "Als Anfang nutzt man oft einige hundert Wörter je Stück. In der {{rag|RAG-Werkstatt}} sind es etwa 800 Zeichen. Das ist ein Ausgangspunkt, kein Gesetz. Teste mit echten Fragen, ob die Antwort meist in einem Stück liegt.",
    ]},
    {h: "Überlappung: Stücke, die sich teilen", p: [
      "Beim Schneiden kann eine Aussage genau auf der Grenze liegen. Gegen dieses Problem hilft die [[ueberlappung|Überlappung]]: Der Anfang jedes Stücks wiederholt das Ende des vorigen, zum Beispiel die letzten zwei Sätze. So steht jeder Gedanke, der an einer Grenze liegt, zumindest in einem der beiden Stücke ganz.",
      "Überlappung hilft vor allem bei fester Länge und bei durchgehendem Fließtext. Sie hilft wenig, wenn du ohnehin an Überschriften schneidest, denn dort endet ein Thema wirklich. Sie hat einen Preis: Mehr Stücke, mehr Speicher, mehr Rechenzeit beim Einbetten. Außerdem können dieselben Sätze doppelt unter den Treffern stehen und Platz im Kontext verschwenden.",
    ], alltag: [
      "Ein Film wird in Szenen geschnitten. Würde der Schnitt immer exakt am Satzende liegen, fehlte dir manchmal der Halbsatz, der den Witz erklärt. Darum zeigt die Vorschau am Anfang der nächsten Folge die letzten Sekunden der vorigen noch einmal. Das ist Überlappung: Man sieht die Grenze noch einmal von der anderen Seite.",
    ]},
    {h: "Besondere Inhalte: Tabellen, Listen, Code, PDFs", p: [
      "Fließtext ist der einfache Fall. In Firmendokumenten stehen oft Dinge, die sich schlecht schneiden lassen.",
    ], liste: [
      "**Tabellen:** Eine Zeile ohne Kopfzeile ist wertlos („12, 40, 7“). Behalte Spaltenüberschriften bei jedem Stück oder wandle jede Zeile in einen Satz um: „Pumpe 3: Wartung alle 6 Monate.“",
      "**Listen:** Ein Listenpunkt allein verliert den Satz davor („Folgende Unterlagen bringen Sie mit:“). Die Einleitung gehört zu jedem Punkt oder die Liste bleibt zusammen.",
      "**Code:** Schneide an Funktionen oder Klassen, nicht nach Zeichenzahl. Ein halbierter Funktionsrumpf ist kein Code mehr.",
      "**PDFs:** Der Text hat oft Kopf- und Fußzeilen, die auf jeder Seite stehen, Spalten, die durcheinander gelesen werden, und Silbentrennung. Prüfe vor dem Zerlegen, wie der Text tatsächlich aussieht.",
      "**Gescannte Dokumente:** Ein Scan ist ein Bild. Der Text muss erst per [[ocr|Texterkennung]] gelesen werden. Fehler dort (aus „rn“ wird „m“) setzen sich in jedem späteren Schritt fort.",
    ], alltag: [
      "Ein Fahrplan hängt als Tabelle am Bahnhof: Zeilen für Haltestellen, Spalten für Uhrzeiten. Wer nur einen Streifen mit Zeiten ausschneidet, hat Zahlen ohne Haltestellenname. Mit Kopf- und Randspalte wird derselbe Ausschnitt lesbar.",
    ]},
    {h: "Metadaten: Herkunft mitführen", p: [
      "Jedes Stück sollte seine Herkunft kennen: Dokumentname, Kapitel, Seite, Datum, vielleicht Autor und Gültigkeit. Diese [[metadaten|Metadaten]] werden mit dem Stück im Index gespeichert. Sie haben drei Aufgaben: Du kannst die Quelle in der Antwort nennen, du kannst die Suche einschränken („nur Dokumente aus diesem Jahr“), und du kannst Stücke gezielt austauschen, wenn sich ein Dokument ändert.",
      "Ein einfacher Trick zahlt sich oft aus: Stelle jedem Stück die Überschrift des Kapitels voran, bevor du es einbettest. Aus „Die Frist beträgt vier Wochen.“ wird „Kündigung von Mietverträgen: Die Frist beträgt vier Wochen.“ Der Vektor trägt jetzt das Thema mit.",
    ], alltag: [
      "Jede Karteikarte trägt oben Fach, Kapitel und Datum. Wenn du eine Karte findest, weißt du, woher sie kommt und wie alt sie ist. Wirft dir jemand einen losen Zettel auf den Tisch, kannst du das nicht beurteilen.",
    ]},
    {h: "Wenn die Antwort über eine Grenze reicht", p: [
      "Trotz aller Sorgfalt gibt es Fragen, deren Antwort in zwei benachbarten Stücken steht. Dann hilft eine von drei Maßnahmen.",
    ], liste: [
      "**Überlappung erhöhen**, damit die Grenzstelle in beiden Stücken steht.",
      "**Nachbarn mitholen:** Findet die Suche ein Stück, werden das davor und das danach ebenfalls an das Modell gegeben. Das Modell sieht den Zusammenhang.",
      "**Klein suchen, groß antworten:** Man sucht in kleinen, genauen Stücken, gibt aber dem Modell den größeren Abschnitt, aus dem das Stück stammt (Elternabschnitt).",
    ], alltag: [
      "Du schlägst im Lexikon einen Begriff nach und findest die Definition am Ende der Seite. Der Satz „Das gilt nur für Kinder unter 12“ steht oben auf der nächsten Seite. Ein guter Leser blättert um. Die Nachbarn-Variante macht genau das für das Modell: Sie legt die nächste Seite gleich daneben.",
    ], merke: "Wer Chunking verbessert, verbessert die Suche, ohne am Modell etwas zu ändern. Es ist oft der günstigste Hebel."},
  ],
  mitnehmen: [
    "Text wird in Stücke geteilt, weil Modelle Längengrenzen haben und ein Vektor für viel Text zu unscharf wird.",
    "Ein guter Chunk behandelt eine Sache und ist allein verständlich. Zu klein verliert Kontext, zu groß verwässert den Treffer.",
    "Struktur, Überlappung und Metadaten (Quelle, Kapitel, Datum) entscheiden, ob die Antwort später gefunden und belegt werden kann.",
  ],
  quiz: [
    {frage: "Warum bettet man nicht einfach das ganze Handbuch als einen Vektor ein?",
      optionen: ["Weil Vektoren nur Zahlen zwischen 0 und 1 enthalten dürfen", "Weil ein Vektor für sehr viel Text verwaschen ist und zu keiner konkreten Frage gut passt", "Weil Handbücher keinen Text enthalten", "Weil die Suche sonst zu schnell wäre"],
      richtig: 1, erklaerung: "Ein Vektor für hundert Themen ist ein Durchschnitt. Kleine, einheitliche Stücke liefern genauere Treffer. Dazu kommen Längengrenzen der Modelle."},
    {frage: "Die Chunks sind sehr klein, und die Antworten wirken oft unvollständig. Was ist die wahrscheinlichste Ursache?",
      optionen: ["Der Index ist zu groß", "Das Embedding-Modell hat zu viele Dimensionen", "Die Frage ist zu lang", "Die Stücke sind zu klein, der nötige Zusammenhang fehlt"],
      richtig: 3, erklaerung: "Zu kleine Stücke tragen oft nur einen Halbsatz. Der Treffer sieht gut aus, enthält aber nicht die ganze Antwort."},
    {frage: "Wann bringt Überlappung am meisten?",
      optionen: ["Wenn du ohnehin an Kapitelgrenzen schneidest", "Wenn der Text nur aus Tabellen besteht", "Bei durchgehendem Fließtext mit fester Länge, wo ein Schnitt mitten durch einen Gedanken gehen kann", "Nie, sie macht immer alles schlechter"],
      richtig: 2, erklaerung: "Bei festen Schnitten liegen Aussagen oft auf einer Grenze. Überlappung stellt sicher, dass sie in einem Stück ganz vorkommen. Sie kostet aber Speicher und kann Doppeltreffer erzeugen."},
    {frage: "Was ist bei einer Tabelle im Dokument besonders wichtig?",
      optionen: ["Jede Zeile wird getrennt mit Kopfzeile oder als Satz gespeichert, damit Zahlen ihre Bedeutung behalten", "Sie wird komplett weggelassen", "Sie wird als Bild eingebettet", "Die Zahlen werden gerundet"],
      richtig: 0, erklaerung: "Zahlen ohne Spaltenüberschrift sind für Suche und Modell unlesbar. Mit Kopfzeile oder Satzform behalten sie ihren Sinn."},
    {frage: "Wozu dienen Metadaten wie Kapitel und Datum am Chunk?",
      optionen: ["Sie machen die Vektoren kleiner", "Sie ermöglichen Quellenangabe, Filter und gezieltes Aktualisieren", "Sie ersetzen das Embedding", "Sie beschleunigen das Sprachmodell"],
      richtig: 1, erklaerung: "Metadaten sagen, woher ein Stück kommt. So kannst du Quellen nennen, die Suche einschränken und bei Änderungen gezielt Stücke austauschen."},
  ],
  weiter: ["rag-suche", "rag-embedding", "rag"],
};

/* ====================================================================== 4 Suche */
S["rag-suche"] = {
  nav: "Suchen", typ: "lektion", gruppe: "Wissen und RAG", titel: "Suchen: Stichwort, Vektor und Hybrid", symbol: "rag",
  widget: "rag-suche-vergleich", videos: ["rag-keywordsuche", "rag-hybridsuche"],
  kurz: "Es gibt zwei Arten, Stücke zu finden: nach Wörtern und nach Bedeutung. Jede hat ihre eigenen Stärken. Die beste Suche nutzt oft beide.",
  abschnitte: [
    {h: "Zwei Arten zu suchen", p: [
      "Eine Suche muss aus vielen Stücken die wenigen holen, die zu einer Frage passen. Dafür gibt es zwei grundverschiedene Methoden. Die erste vergleicht Wörter: Kommen die Wörter aus der Frage im Text vor? Die zweite vergleicht Bedeutung: Meint der Text dasselbe wie die Frage, auch wenn er andere Wörter benutzt?",
    ], alltag: [
      "Im Telefonbuch schlägst du „Meier, Hans“ auf und findest genau diesen Namen. Das ist Wortsuche, exakt und schnell. Bei einer guten Buchhändlerin sagst du dagegen: „Ich suche etwas Spannendes für den Urlaub, nicht zu blutig.“ Sie versteht, was du meinst, auch wenn das Wort „Urlaubskrimi“ nie fällt. Das ist Bedeutungssuche.",
      "Beide Fähigkeiten sind nützlich. Wer eine Teilenummer sucht, will das Telefonbuch. Wer eine Empfehlung sucht, will die Buchhändlerin.",
    ]},
    {h: "Stichwortsuche von null", p: [
      "Die einfachste Stichwortsuche zählt, wie oft die Wörter der Frage im Text vorkommen. Das funktioniert, hat aber Mängel. Das Wort „der“ kommt überall vor und sagt nichts. Ein langer Text enthält schon deshalb mehr Treffer, weil er lang ist. Und das hundertste „Pumpe“ im selben Text macht ihn nicht hundertmal passender.",
      "Das gängige Verfahren [[bm25|BM25]] behebt das mit drei Ideen. Erstens: Seltene Wörter zählen mehr als häufige. „Dichtungsring“ trennt Texte gut, „und“ nicht. Zweitens: Kommt ein Wort immer wieder vor, steigt der Wert nur noch langsam. Drittens: Der Wert wird nach der Länge des Textes angepasst, damit kurze Texte nicht benachteiligt werden und lange nicht bevorzugt. Das Ergebnis ist ein Punktwert je Text. Die Texte mit den meisten Punkten stehen oben. Mehr steckt im Kern nicht dahinter.",
    ], alltag: [
      "Stell dir eine Gruppe von Fachleuten vor, die Texte nach einem Stichwort durchsehen. Hört ein Fachmann das Wort „Dichtungsring“, horcht er auf, denn das Wort ist selten und sagt etwas. Hört er „der“ oder „und“, überhört er es. Und wenn ein Text zwanzigmal „Dichtungsring“ sagt, ist er wahrscheinlich über Dichtungsringe, aber nicht zwanzigmal mehr als einer, der es fünfmal sagt.",
    ], merke: "Stichwortsuche findet Texte, in denen die Wörter der Frage vorkommen, und gewichtet seltene Wörter stärker."},
    {h: "Vektorsuche: Sinn statt Wörter", p: [
      "Die Vektorsuche nutzt die Embeddings aus {{rag-embedding|Vektorisieren und Embeddings}}. Die Frage wird in einen Vektor verwandelt. Gesucht werden die Stücke, deren Vektoren dem der Frage am nächsten liegen, gemessen mit der [[cosinus|Kosinus-Ähnlichkeit]]. Sie braucht keine gemeinsamen Wörter.",
      "So findet die Frage „Darf ich mein Auto im Hof abstellen?“ den Abschnitt „Parken von Fahrzeugen auf dem Betriebsgelände“. Kein Wort stimmt überein, der Sinn schon. Für Menschen, die in Alltagssprache fragen, ist das ein großer Gewinn. Der Preis: Die Suche ist ungenau bei allem, was genau gleich sein muss.",
    ], alltag: [
      "Du sagst im Restaurant: „Ich suche etwas Italienisches.“ Der Kellner empfiehlt Pizza, Pasta und Tiramisu, obwohl du keines dieser Wörter genannt hast. Er sucht nach Nähe im Sinn, nicht nach Wörtern. Bei „Tisch 14, Bestellnummer 9187“ hilft ihm das nicht weiter. Dort braucht er den genauen Zettel.",
    ]},
    {h: "Wo jede Methode gewinnt und verliert", p: [
      "Die Tabelle zeigt typische Fälle. Sie verteilt keine Noten, sondern zeigt, wofür sich welche Methode eignet.",
    ], tabelle: {
      beschriftung: "Stichwort gegen Vektor an typischen Fragen",
      kopf: ["Fall", "Beispiel", "Stichwort", "Vektor"],
      zeilen: [
        ["Synonyme", "Frage „Auto abstellen“, Text „Fahrzeug parken“", "verliert, kein gemeinsames Wort", "gewinnt, gleicher Sinn"],
        ["Fachwörter", "Frage „Hydraulikzylinder“, Text mit genau diesem Wort", "gewinnt, seltenes Wort", "meist gut, bei sehr seltenen Wörtern unsicher"],
        ["Fehlercodes", "Frage „E-4711“", "gewinnt, exakte Zeichenfolge", "verliert, ähnliche Codes wirken gleich"],
        ["Eigennamen", "Frage „Müller GmbH“", "gewinnt, genauer Name", "oft schwach, Name trägt wenig Sinn"],
        ["Zahlen", "Frage „Frist 14 Tage“", "gewinnt, wenn die Zahl im Text steht", "schwach, 14 und 30 wirken ähnlich"],
        ["Tippfehler", "Frage „Kündgung“", "verliert, außer mit Fehlertoleranz", "meist robust, Sinn bleibt erkennbar"],
        ["Mehrsprachigkeit", "Frage deutsch, Text englisch", "verliert, andere Wörter", "gewinnt, wenn das Modell mehrsprachig ist"],
        ["Lange, vage Fragen", "„Wie gehe ich vor, wenn ein Kunde reklamiert?“", "findet nur wortgleiche Stellen", "gewinnt, findet den Sinn"],
      ],
    }, alltag: [
      "Ein Kundenservice hat zwei Kollegen. Der eine kennt alle Ticketnummern auswendig und findet sofort „Ticket 48213“, versteht aber keine Umschreibungen. Die andere versteht jede Beschwerde und findet das passende Thema, würde aber bei zwei ähnlichen Ticketnummern danebenliegen. Gute Teams holen beide dazu.",
    ]},
    {h: "Hybridsuche: beide zusammen", p: [
      "Bei der [[hybridsuche|Hybridsuche]] laufen beide Methoden gleichzeitig. Jede liefert eine eigene Rangliste. Danach werden die Ranglisten zusammengeführt.",
      "Das Problem dabei: Die Punktwerte sind nicht vergleichbar. BM25 liefert Werte wie 12,4, der Kosinus Werte wie 0,81. Man kann sie nicht einfach addieren. Der gängige Ausweg ist die [[rangfusion|Rangfusion]] (englisch Reciprocal Rank Fusion). Sie schaut nur auf die Platzierung, nicht auf die Punkte. Jede Platzierung bringt Punkte, und zwar umso mehr, je weiter oben sie liegt: Platz 1 mehr als Platz 2 und so weiter. Üblich ist die Formel „1 geteilt durch (60 plus Platz)“. Die Punkte aus beiden Ranglisten werden addiert.",
      "Ein Beispiel. Text X steht bei der Stichwortsuche auf Platz 1, bei der Vektorsuche gar nicht in der Liste: Er bekommt 1 geteilt durch 61, das sind etwa 0,0164. Text Y steht in beiden Listen auf Platz 2: Er bekommt zweimal 1 geteilt durch 62, das sind etwa 0,0323. Y gewinnt, weil beide Methoden ihn für gut halten.",
    ], alltag: [
      "Zwei Jurorinnen bewerten Bewerbungen. Die eine vergibt Punkte von 1 bis 100, die andere Noten von 1 bis 6. Man kann die Zahlen nicht addieren. Man kann aber jede bitten, eine Rangliste zu machen, und dann Platz 1 mit Platz 1 verrechnen. Wer bei beiden weit oben steht, gewinnt.",
    ], merke: "Hybridsuche verbindet Wort und Sinn. Die Rangfusion addiert Platzierungen statt Punktwerten, weil die Punkte der beiden Methoden nicht vergleichbar sind."},
    {h: "Gewichtung und Trefferzahl", p: [
      "Bei der Hybridsuche kannst du Gewichte vergeben: Zählt die Stichwortsuche gleich viel wie die Vektorsuche oder mehr? Wer viele Codes und Eigennamen hat, gibt dem Stichwort mehr. Wer Fragen in Alltagssprache erwartet, dem Vektor. Die richtige Mischung findest du nicht durch Nachdenken, sondern durch Messen mit echten Fragen, siehe {{rag-bewertung|RAG messen und verbessern}}.",
      "Die zweite Stellschraube ist die Trefferzahl, im Englischen [[topk|top-k]]. Sie legt fest, wie viele Stücke an das Modell gehen. Zu wenige, und die richtige Stelle fehlt vielleicht. Zu viele, und das Modell wird von Nebensächlichem abgelenkt und der Kontext läuft voll. Üblich sind einige wenige Treffer, in der Praxis meist drei bis zehn. Du stellst es so ein, dass die richtige Stelle fast immer dabei ist, ohne dass der Rest stört.",
    ], alltag: [
      "Du gehst in die Bibliothek und trägst Bücher zum Schreibtisch. Bringst du nur eines, fehlt vielleicht das richtige. Bringst du dreißig, findest du nichts mehr. Fünf bis zehn sind oft ein guter Stapel: genug Auswahl, noch lesbar.",
    ]},
    {h: "Filter: erst eingrenzen, dann suchen", p: [
      "Oft weißt du schon etwas über die gesuchte Stelle: aus welchem Dokument, welcher Abteilung, welchem Jahr, in welcher Sprache. Mit [[metadaten|Metadaten]] kannst du die Suche darauf beschränken. Das ist schneller und genauer, weil das Material kleiner ist. Und es verhindert, dass ein alter Vertrag aus 2015 neben dem aktuellen unter den Treffern landet.",
      "Filter sind auch ein Sicherheitsmittel: Wer nur Dokumente seiner Abteilung sehen darf, bekommt auch nur dort gesucht. Mehr dazu auf der Seite {{rag-bewertung|RAG messen und verbessern}}.",
    ], alltag: [
      "In der Bibliothek gehst du zuerst ins richtige Regal, zum Beispiel Medizin, und suchst erst dort. Du blätterst nicht alle Bücher des Hauses durch. Das Regal ist der Filter, die Suche macht den Rest.",
    ]},
    {h: "Die Frage selbst verbessern", p: [
      "Nutzer fragen oft knapp und verkürzt. „Und für Kinder?“ ist ohne die Frage davor unverständlich. Eine Vektorsuche findet damit nichts. Deshalb wird die Frage vor der Suche manchmal umformuliert: Ein Sprachmodell macht aus dem Gesprächsverlauf eine eigenständige Frage („Was kostet die Jahreskarte für Kinder?“). Eine zweite Technik zerlegt eine lange Frage in mehrere Teilfragen, die einzeln gesucht werden.",
      "Auch das lässt sich messen: Wird die Trefferquote damit besser, bleibt es. Sonst kostet es nur Zeit und eine zusätzliche Fehlerquelle.",
    ], alltag: [
      "Du fragst am Schalter: „Was kostet die Jahreskarte?“ Die Antwort: „Zwanzig Euro.“ Dann: „Und für Kinder?“ Der Mitarbeiter versteht, weil er das Gespräch kennt. Eine Suchmaschine kennt das Gespräch nicht. Sie braucht die vollständige Frage, die das Modell ihr erst formulieren muss.",
    ]},
  ],
  mitnehmen: [
    "Stichwortsuche (BM25) findet Wörter und gewichtet seltene Wörter stärker. Vektorsuche findet Sinn. Jede gewinnt dort, wo die andere verliert.",
    "Die Hybridsuche führt beide Ranglisten über die Platzierung zusammen, nicht über die Punktwerte. Gewicht und Trefferzahl stellst du am eigenen Material ein.",
    "Filter über Metadaten und eine umformulierte Frage machen die Suche genauer, bevor ein Reranker ins Spiel kommt.",
  ],
  quiz: [
    {frage: "Ein Nutzer sucht nach dem Fehlercode „E-4711“. Welche Methode ist hier meist zuverlässiger?",
      optionen: ["Vektorsuche, weil sie den Sinn versteht", "Beide gleich gut", "Stichwortsuche, weil sie die genaue Zeichenfolge findet", "Keine von beiden"],
      richtig: 2, erklaerung: "Codes tragen Genauigkeit, keine Bedeutung. Embeddings halten ähnliche Codes leicht für gleich, die Stichwortsuche findet genau den einen."},
    {frage: "Die Frage lautet „Darf ich das Auto im Hof abstellen?“, der Text sagt „Parken auf dem Betriebsgelände“. Wer findet ihn?",
      optionen: ["Nur die Vektorsuche", "Nur die Stichwortsuche", "Keine, es gibt kein gemeinsames Wort", "Beide, weil beide den Sinn verstehen"],
      richtig: 0, erklaerung: "Der Text teilt kein Wort mit der Frage. Die Vektorsuche vergleicht Bedeutung und findet ihn trotzdem."},
    {frage: "Warum addiert die Rangfusion Platzierungen statt Punktwerte?",
      optionen: ["Weil Platzierungen genauer sind", "Weil Vektoren keine Punkte haben", "Weil das Addieren schneller geht als das Sortieren", "Weil die Punktwerte der beiden Methoden nicht vergleichbar sind"],
      richtig: 3, erklaerung: "BM25-Werte und Kosinus-Werte haben ganz andere Größenordnungen. Die Platzierung ist die gemeinsame Sprache beider Listen."},
    {frage: "In einer Rangfusion steht Text A in beiden Listen auf Platz 3, Text B nur in einer Liste auf Platz 1. Wer liegt typischerweise vorn?",
      optionen: ["B, weil Platz 1 am meisten wert ist", "A, weil er von beiden Methoden gestützt wird und zweimal Punkte bekommt", "Beide gleichauf", "Das hängt vom Zufall ab"],
      richtig: 1, erklaerung: "Zweimal etwa 1 geteilt durch 63 ist mehr als einmal 1 geteilt durch 61. Wer von beiden Seiten gelobt wird, rückt nach vorn."},
    {frage: "Was bewirkt ein Metadatenfilter wie „nur Dokumente aus diesem Jahr“?",
      optionen: ["Er macht das Embedding-Modell besser", "Er ersetzt die Vektorsuche", "Er verkleinert den Suchraum, die Suche wird schneller und genauer", "Er ändert die Antwort des Modells direkt"],
      richtig: 2, erklaerung: "Der Filter schränkt vor der Suche ein, was überhaupt in Frage kommt. Das spart Zeit und verhindert Treffer aus der falschen Ecke."},
  ],
  weiter: ["rag-reranking", "rag-chunking", "rag"],
};

/* ====================================================================== 5 Reranking */
S["rag-reranking"] = {
  nav: "Reranking", typ: "lektion", gruppe: "Wissen und RAG", titel: "Reranking: erst grob, dann genau", symbol: "rag",
  widget: "rag-rerank-labor", videos: ["rag-reranking"],
  kurz: "Die erste Suche muss schnell sein und sortiert deshalb grob. Ein Reranker liest die besten Kandidaten noch einmal genau und stellt die Reihenfolge richtig.",
  abschnitte: [
    {h: "Das Alltagsbild: Vorauswahl und Gespräch", p: [
      "Eine Firma bekommt 200 Bewerbungen auf eine Stelle. Niemand führt 200 Gespräche. Zuerst wird anhand der Unterlagen schnell aussortiert, vielleicht bleiben 15 übrig. Mit diesen führt man Gespräche, nimmt sich Zeit und urteilt genauer. Am Ende stehen drei Namen oben.",
      "Genau so arbeitet eine zweistufige Suche. Die erste Stufe ist schnell und grob. Die zweite ist langsam und genau, aber nur für wenige Kandidaten.",
    ], alltag: [
      "In der Vorauswahl sieht man Lebenslauf, Abschluss, Stichworte. Das reicht, um Offensichtliches auszusortieren. Es reicht nicht, um zwischen den besten fünf zu entscheiden: Wer kann wirklich das, was die Stelle braucht? Das zeigt sich erst im Gespräch, wenn man Frage und Antwort zusammen erlebt.",
    ]},
    {h: "Warum die erste Suche nur grob sortiert", p: [
      "Bei der Vektorsuche wird jedes Stück einmal vorab in einen Vektor verwandelt, und zwar ohne die Frage zu kennen. Die Frage wird später ebenfalls allein in einen Vektor verwandelt. Beide begegnen sich nie. Verglichen werden nur zwei Zahlenlisten. Dabei geht Information verloren: Ein ganzer Absatz wird auf eine einzige Liste zusammengedrückt.",
      "Der Vorteil dieses Vorgehens ist die Geschwindigkeit. Die Vektoren der Stücke liegen fertig im [[index|Index]]. Eine Frage braucht nur eine Berechnung, danach wird verglichen, und das geht auch bei Millionen Stücken in Sekundenbruchteilen. Der Preis ist die Genauigkeit: Oft liegt die richtige Stelle unter den ersten zwanzig Treffern, aber nicht ganz oben.",
    ], alltag: [
      "Der Steckbrief eines Bewerbers ist wie ein Vektor: Er ist fertig, bevor jemand die Stellenanzeige gelesen hat, und er wurde nie auf diese bestimmte Stelle zugeschnitten. Deshalb passt er mal gut, mal nur ungefähr.",
    ]},
    {h: "Was ein Reranker anders macht", p: [
      "Ein [[reranker|Reranker]] bekommt die Frage und einen Kandidaten zusammen und liest beide gemeinsam. Er sieht, wie die Wörter der Frage zu den Wörtern des Textes passen, und gibt einen Punktwert dafür, wie gut der Text die Frage beantwortet. Das ist genauer, weil Frage und Text direkt aufeinander bezogen werden und nicht nur ihre Zusammenfassungen verglichen werden.",
      "Der Preis ist die Rechenzeit. Für jeden Kandidaten läuft ein eigener Durchgang mit der konkreten Frage. Das kann man nicht vorab erledigen, denn die Frage kennt man erst, wenn sie gestellt wird. Deshalb arbeitet der Reranker nie auf dem ganzen Bestand, sondern nur auf den Treffern der ersten Suche.",
    ], alltag: [
      "Im Gespräch sitzen Bewerberin und Fragender zusammen am Tisch. Er stellt die konkrete Frage der Stelle und hört, wie sie darauf antwortet. Das ist aufwendig, pro Person eine halbe Stunde. Dafür sieht man, ob sie passt, und nicht nur, ob der Lebenslauf so aussieht.",
    ], merke: "Die erste Suche vergleicht zwei Zusammenfassungen. Der Reranker liest Frage und Text gemeinsam. Das ist genauer und langsamer."},
    {h: "Bauarten von Rerankern", p: [
      "Es gibt zwei verbreitete Arten, einen Reranker zu bauen.",
    ], tabelle: {
      beschriftung: "Zwei Bauarten im Vergleich",
      kopf: ["Bauart", "So arbeitet sie", "Stärke", "Schwäche"],
      zeilen: [
        ["Cross-Encoder", "Ein kleines Netz, das nur für diese Aufgabe trainiert ist. Es liest Frage und Text zusammen und gibt eine Zahl aus.", "schnell für ein Netz dieser Art, jeder Durchlauf liefert direkt einen Punktwert, gut messbar", "muss man als eigenes Modell bereitstellen, schwächer bei Fachgebieten, für die es nicht trainiert wurde"],
        ["Sprachmodell als Bewerter", "Ein normales Sprachmodell bekommt Frage und Text und wird gebeten, die Passung zu bewerten oder die Kandidaten zu ordnen.", "kein zusätzliches Modell nötig, flexibel, kann Begründungen liefern", "langsamer, kleine Modelle bewerten unzuverlässig, die Ausgabe schwankt"],
      ],
    }},
    {h: "Der zweistufige Ablauf", p: [
      "Die erste Stufe holt viele Kandidaten, die zweite wählt wenige aus. Typisch ist ein Verhältnis wie: Die Suche liefert die besten 20 bis 50 Stücke, der Reranker sortiert sie neu, und die obersten 3 bis 5 gehen an das Sprachmodell. Die genauen Zahlen hängen von deinem Material ab.",
      "Das Prinzip dahinter: Die erste Stufe soll vor allem nichts Wichtiges verpassen (breit fangen). Die zweite soll das Wichtige nach oben bringen (genau sortieren). Ein Beispiel: Die richtige Fundstelle liegt nach der Suche auf Platz 9. Ohne Reranker würde sie, bei einer Begrenzung auf die besten fünf, gar nicht an das Modell gehen. Mit Reranker steigt sie auf Platz 1.",
    ], alltag: [
      "Beim Fischen wirfst du zuerst ein weites Netz aus, das alles Essbare fängt, auch Beifang. Danach sortierst du am Tisch mit der Hand aus, was in die Pfanne kommt. Das Netz muss groß sein, damit nichts fehlt, aber es sortiert nicht fein. Die Handarbeit ist langsam, aber sie ist treffsicher.",
    ]},
    {h: "Kosten und Wartezeit", p: [
      "Ein Reranker kostet Zeit. Bei 30 Kandidaten sind das 30 Durchgänge, die jeweils Frage und Text lesen. Auf einem kleinen Gerät wie dem Jetson merkt man das, vor allem, wenn ein Sprachmodell der Bewerter ist. Die Wartezeit steigt mit der Zahl der Kandidaten und der Länge der Stücke.",
      "Auf dem Jetson steht llama3.2:3b zur Verfügung. Es kann als Bewerter dienen, ist aber ein kleines Modell. Je kleiner das Modell, desto größer die Gefahr, dass es Kandidaten falsch einschätzt oder bei gleicher Eingabe unterschiedliche Zahlen liefert. Ob sich das lohnt, zeigt nur eine Messung an deinen Daten, siehe {{rag-bewertung|RAG messen und verbessern}}.",
      "Drei Hebel halten die Kosten im Rahmen. Erstens weniger Kandidaten, solange die richtige Stelle noch dabei ist. Zweitens kürzere Stücke, denn kurze Texte sind schneller gelesen. Drittens Ergebnisse zwischenspeichern, wenn dieselbe Frage öfter kommt. Und: Miss die Antwortzeit mit und ohne Reranker, bevor du ihn fest einbaust.",
    ], alltag: [
      "Ein Gespräch dauert pro Person eine halbe Stunde. Bei 15 Bewerbern sind das siebeneinhalb Stunden. Bei 200 wären es hundert Stunden, das ist nicht mehr machbar. Deshalb gibt es die Vorauswahl. Genau dieselbe Rechnung gilt für den Reranker.",
    ]},
    {h: "Wann es sich lohnt und woran du es erkennst", p: [
      "Ein Reranker lohnt sich, wenn die richtige Fundstelle zwar gefunden wird, aber nicht oben steht. Das erkennst du nur mit einem Testset: einer Liste echter Fragen mit der bekannten Fundstelle, siehe {{rag-bewertung|RAG messen und verbessern}}. Dann zählst du, wie oft die richtige Stelle unter den besten 20 liegt und wie oft unter den besten 3. Ist der erste Wert deutlich höher, hilft ein Reranker. Er kann die Lücke füllen.",
      "Liegt die richtige Stelle gar nicht unter den ersten 20, hilft ein Reranker nicht. Er sortiert nur, was die Suche liefert. Dann liegt das Problem früher: in den Stücken, im Embedding-Modell oder in der Frage. Das Problem muss man dort beheben.",
    ], alltag: [
      "Beim Arzt: Wenn die Patientin schon im Wartezimmer sitzt, aber die Ärztin sie nicht als Erste aufruft, hilft eine bessere Reihenfolge. Sitzt sie aber gar nicht im Haus, hilft keine Reihenfolge der Welt.",
    ], merke: "Ein Reranker verbessert die Reihenfolge, nicht den Fund. Er hilft nur, wenn die richtige Stelle unter den Kandidaten ist."},
    {h: "Weitere Verbesserungen im Umfeld", p: [
      "Neben dem Reranker gibt es drei Mittel, die an derselben Stelle der Kette ansetzen:",
    ], liste: [
      "**Frage umschreiben:** Eine knappe oder mehrdeutige Frage wird vorab zu einer vollständigen Frage gemacht. Das hilft der ersten Suche, siehe {{rag-suche|Suchen}}.",
      "**Kontext erweitern:** Zu jedem Treffer kommen die Nachbarn oder der Elternabschnitt dazu, damit der Zusammenhang erhalten bleibt, siehe {{rag-chunking|Chunking}}.",
      "**Treffer zusammenfassen oder kürzen:** Bei langen Treffern werden Nebensätze und Wiederholungen entfernt, bevor das Modell sie bekommt. Das spart Platz im Kontext, birgt aber das Risiko, dass etwas Wichtiges fehlt.",
    ], alltag: [
      "Vor dem Gespräch schickt die Personalabteilung dem Fragenden eine Zusammenfassung zu jedem Bewerber, aber auch die Lebensläufe als Anhang. Die Zusammenfassung spart Zeit. Der Anhang schützt davor, dass in der Zusammenfassung etwas Wichtiges fehlt.",
    ]},
  ],
  mitnehmen: [
    "Die erste Suche vergleicht fertige Vektoren und ist schnell, aber grob. Ein Reranker liest Frage und Text gemeinsam und ist genauer, aber langsam.",
    "Der Ablauf lautet: viele Kandidaten holen, wenige genau sortieren, die besten an das Modell geben.",
    "Ein Reranker verbessert nur die Reihenfolge. Fehlt die richtige Stelle unter den Kandidaten, liegt das Problem früher.",
  ],
  quiz: [
    {frage: "Warum kann ein Reranker nicht die ganze Sammlung durchsehen?",
      optionen: ["Weil er keine Texte lesen kann", "Weil er für jeden Text einen eigenen Durchgang mit der Frage braucht, das wäre viel zu langsam", "Weil er nur Zahlen versteht", "Weil er nur englische Texte kennt"],
      richtig: 1, erklaerung: "Der Reranker liest Frage und Text gemeinsam. Das lässt sich nicht vorab erledigen und wäre bei vielen Stücken zu aufwendig. Er arbeitet nur auf den Kandidaten der ersten Suche."},
    {frage: "Was unterscheidet einen Reranker von der Vektorsuche?",
      optionen: ["Er nutzt keine Texte", "Er vergleicht nur fertige Vektoren", "Er ersetzt das Sprachmodell", "Er liest Frage und Text zusammen und bewertet die Passung direkt"],
      richtig: 3, erklaerung: "Die Vektorsuche vergleicht zwei unabhängig entstandene Zahlenlisten. Der Reranker sieht beide Texte zugleich und ist deshalb genauer."},
    {frage: "Die richtige Fundstelle steht bei 80 von 100 Testfragen unter den ersten 20 Treffern, aber nur bei 40 unter den ersten 3. Was hilft?",
      optionen: ["Ein Reranker, weil die Stelle gefunden, aber nicht oben sortiert wird", "Ein größeres Sprachmodell", "Das Embedding-Modell abschalten", "Weniger Dokumente"],
      richtig: 0, erklaerung: "Die Lücke zwischen beiden Werten zeigt, dass die Stelle gefunden wird, aber zu weit unten liegt. Genau das behebt ein Reranker."},
    {frage: "Die richtige Stelle liegt bei vielen Fragen nicht einmal unter den ersten 50 Treffern. Wird ein Reranker das Problem lösen?",
      optionen: ["Ja, er findet die Stelle woanders", "Ja, wenn man ihn mehrfach laufen lässt", "Nein, er sortiert nur die Kandidaten, die er bekommt", "Nur mit einem größeren Index"],
      richtig: 2, erklaerung: "Ohne die Stelle unter den Kandidaten kann der Reranker sie nicht nach oben bringen. Dann musst du Stücke, Embeddings oder Frage verbessern."},
    {frage: "Wie hältst du die Wartezeit eines Rerankers im Rahmen?",
      optionen: ["Mehr Kandidaten prüfen", "Die Frage länger machen", "Den Reranker vor die Suche setzen", "Weniger und kürzere Kandidaten, und häufige Fragen zwischenspeichern"],
      richtig: 3, erklaerung: "Die Zeit wächst mit der Zahl und Länge der Kandidaten. Weniger, kürzere und zwischengespeicherte Durchgänge sparen sie."},
  ],
  weiter: ["rag-bewertung", "rag-suche", "rag"],
};

/* ====================================================================== 6 Bewertung */
S["rag-bewertung"] = {
  nav: "RAG messen", typ: "lektion", gruppe: "Wissen und RAG", titel: "RAG messen und verbessern", symbol: "rag",
  widget: "rag-test-labor", videos: ["rag-bewertung"],
  kurz: "Ein RAG-System, das bei drei Beispielfragen gut klingt, ist noch nicht gut. Mit einem kleinen Testset siehst du, wo es wirklich steht, und weißt, was du als Nächstes verbesserst.",
  abschnitte: [
    {h: "Warum Gefühl nicht reicht", p: [
      "Du stellst dem System drei Fragen, die Antworten sind gut, und du hältst es für fertig. Dann fragt ein Kollege etwas anderes, und die Antwort ist falsch. Das ist der Normalfall: Mit wenigen Beispielen siehst du nur, dass es manchmal funktioniert, nicht wie oft.",
      "Dazu kommt ein zweiter Effekt. Jede Änderung, ob größere Stücke, ein anderes Modell oder ein Reranker, macht einige Fragen besser und andere schlechter. Ohne Messung weißt du nicht, ob unterm Strich etwas gewonnen wurde.",
    ], alltag: [
      "Ein Fußballtrainer, der nach einem Spiel sagt „Es lief gut“, kann nicht wissen, ob das Training etwas gebracht hat. Er schaut auf Zahlen: Torschüsse, gewonnene Zweikämpfe, Ballbesitz. Dann vergleicht er Wochen miteinander und sieht, was sich verändert hat.",
    ]},
    {h: "Ein kleines Testset bauen", p: [
      "Ein Testset ist eine Liste von Fragen, bei denen du die richtige Fundstelle kennst. Du brauchst keine Tausende: Schon einige Dutzend Fragen zeigen Muster. Wichtig ist, dass sie echt sind.",
    ], liste: [
      "**Echte Fragen sammeln:** aus Mails, Anrufen, Tickets oder von Kolleginnen und Kollegen. Nicht aus dem Kopf des Entwicklers, der weiß, wo die Antwort steht.",
      "**Je Frage die Fundstelle notieren:** Dokument und Abschnitt, in dem die Antwort steht. Dazu die erwartete Antwort in einem Satz.",
      "**Verschiedene Arten mischen:** kurze und lange Fragen, Fragen mit Codes oder Zahlen, Fragen in Alltagssprache, Fragen mit Tippfehlern.",
      "**Fragen ohne Antwort aufnehmen:** Zu einigen Fragen steht nichts in den Dokumenten. Richtig ist dann die Antwort „Dazu finde ich nichts“.",
      "**Das Set festhalten:** Es bleibt gleich, solange du vergleichst. Neue Fragen kommen dazu, alte werden nicht stillschweigend ausgetauscht.",
    ], alltag: [
      "Eine Klassenarbeit hat Aufgaben und einen Lösungsschlüssel. Ohne Schlüssel kannst du die Arbeit nicht korrigieren. Das Testset ist der Schlüssel für dein System: Du siehst, ob es die richtige Stelle gefunden hat, und nicht bloß, dass es antwortet.",
    ]},
    {h: "Kennzahlen für die Suche", p: [
      "Die Suche prüfst du getrennt von der Antwort. Denn wenn schon die falschen Stücke vorliegen, kann das Modell nichts retten. Zwei einfache Kennzahlen reichen für den Anfang. Die [[trefferquote|Trefferquote]] sagt, ob die Stelle überhaupt vorkommt. Der Rang sagt, wie weit oben sie steht. Zusammen zeigen sie, ob die Suche das Wichtige findet und ob ein Reranker etwas verbessern kann, siehe {{rag-reranking|Reranking}}.",
    ], tabelle: {
      beschriftung: "Zwei Kennzahlen für die Suche",
      kopf: ["Kennzahl", "Die Frage dahinter", "So rechnest du", "Beispiel"],
      zeilen: [
        ["Trefferquote in den ersten k", "Liegt die richtige Fundstelle unter den ersten k Treffern?", "Anzahl der Fragen mit Treffer in den ersten k, geteilt durch alle Fragen", "40 von 50 Fragen haben die Stelle in den ersten 5. Quote 0,8, also 80 Prozent"],
        ["Rang der ersten richtigen Fundstelle", "Auf welchem Platz taucht sie zum ersten Mal auf?", "Je Frage 1 geteilt durch den Rang, dann der Durchschnitt (englisch Mean Reciprocal Rank)", "Rang 1 gibt 1, Rang 2 gibt 0,5, Rang 4 gibt 0,25. Hoher Durchschnitt heißt: meist ganz oben"],
      ],
    }, merke: "Miss die Suche und die Antwort getrennt. Sonst weißt du nicht, ob das Modell oder die Suche schuld ist."},
    {h: "Kennzahlen für die Antwort", p: [
      "Auch wenn die Suche stimmt, kann die Antwort falsch sein. Dafür gibt es vier Fragen, die du je Testfrage beantwortest:",
    ], liste: [
      "**Richtigkeit:** Stimmt die Antwort mit der erwarteten überein?",
      "**[[antworttreue|Antworttreue]]:** Steht jede Aussage der Antwort tatsächlich im vorgelegten Kontext, oder hat das Modell etwas dazu erfunden?",
      "**Vollständigkeit:** Fehlt etwas Wichtiges, das im Kontext stand?",
      "**Quelle:** Zeigt die Antwort auf die richtige Fundstelle?",
      "**Fragen ohne Antwort:** Steht nichts in den Dokumenten, ist das Eingeständnis „Dazu finde ich nichts“ richtig. Ein System, das dort trotzdem antwortet, halluziniert.",
      "**Wer bewertet:** Zuerst ein Mensch, gut für den Anfang und für die wichtigsten Fragen. Später kann ein Sprachmodell vorbewerten. Das ist schnell, aber nicht unfehlbar, deshalb prüfen Menschen Stichproben.",
    ], alltag: [
      "Ein Lehrer korrigiert eine Aufsatzaufgabe mit Quellenpflicht: Stimmen die Fakten? Steht jede Behauptung in der Quelle? Fehlt Wichtiges? Passt die Quellenangabe? Das sind vier verschiedene Fragen. Ein Aufsatz kann bei einer gut und bei einer anderen schlecht abschneiden.",
    ]},
    {h: "Typische Fehlerbilder und ihre Ursachen", p: [
      "Wenn eine Antwort falsch ist, hilft eine feste Reihenfolge beim Suchen der Ursache: Stand die richtige Stelle in den Treffern? Wenn nein, liegt es an Aufbereitung, Stücken oder Suche. Wenn ja, liegt es am Prompt oder am Modell.",
    ], tabelle: {
      beschriftung: "Fehlerbild, Ursache, Prüfung",
      kopf: ["Fehlerbild", "Wahrscheinliche Ursache", "Was du prüfst"],
      zeilen: [
        ["Die Antwort bezieht sich auf einen falschen Abschnitt", "falscher Chunk wurde gefunden, Frage und Text passen nur ungefähr", "Trefferliste ansehen, Stücke und Suche testen, Filter einsetzen"],
        ["Die Antwort ist unvollständig", "Chunk zu klein oder an der falschen Stelle geschnitten", "Größe und Überlappung ändern, Nachbarn mitholen"],
        ["Die Antwort nennt Veraltetes", "Quelle veraltet oder alte und neue Fassung liegen nebeneinander", "Metadaten (Datum, Gültigkeit), alte Fassungen löschen, Index aktualisieren"],
        ["Die Stelle stand im Kontext, aber das Modell sagt etwas anderes", "Modell ignoriert den Kontext oder ergänzt aus eigenem Wissen", "Anweisung schärfen, weniger und kürzere Treffer, größeres Modell testen"],
        ["Die Antwort passt nicht zur Frage", "Frage mehrdeutig oder ohne Zusammenhang gestellt", "Frage umschreiben, Rückfrage einbauen"],
        ["Die Codes oder Namen werden verwechselt", "Embeddings sind bei genauen Zeichenfolgen schwach", "Hybridsuche einsetzen, siehe {{rag-suche|Suchen}}"],
        ["Antwort trotz fehlender Quelle", "Modell hat keine Anweisung, bei fehlenden Stellen zu verweigern", "Prompt ergänzen, Fragen ohne Antwort im Testset prüfen"],
      ],
    }},
    {h: "In welcher Reihenfolge du verbesserst", p: [
      "Fange vorn in der Kette an. Fehler dort wirken auf alles, was danach kommt. Eine bewährte Reihenfolge:",
    ], liste: [
      "**Zuerst Daten und Chunking:** Ist der Text sauber? Sind die Stücke sinnvoll? Sind Metadaten da? Ist die Quelle aktuell?",
      "**Dann die Suche:** Hybrid statt nur Vektor, Trefferzahl, Filter, Frage umschreiben.",
      "**Dann Reranking:** Wenn die Stelle gefunden, aber nicht oben ist.",
      "**Zuletzt Modell und Prompt:** Andere Anweisung, anderes Modell. Das ist die teuerste Änderung und löst am seltensten die Ursache.",
    ], alltag: [
      "In der Autowerkstatt prüft man bei einem Ruckeln zuerst Reifen, Luftdruck und Zündkerzen und erst dann den Motor. Vorne in der Kette sind die Fehler billig zu finden und billig zu beheben. Ein neuer Motor ist die teuerste Lösung für ein Problem, das oft an den Reifen lag.",
    ], merke: "Ändere immer nur eine Sache und miss danach neu. Wer fünf Dinge gleichzeitig ändert, weiß nicht, welches geholfen hat."},
    {h: "Datenschutz und Zugriffsrechte", p: [
      "Ein RAG-System macht Dokumente auffindbar. Das ist sein Zweck, aber auch sein Risiko. Frage dich vor dem Betrieb: Wer darf welche Dokumente sehen? Sieht eine Mitarbeiterin im Vertrieb über die Suche Personalakten, nur weil beides im selben Index liegt?",
      "Die Regel lautet: Rechte werden vor der Suche geprüft, nicht nach der Antwort. Die Suche filtert die Stücke nach den Rechten der fragenden Person (über Metadaten), bevor irgendetwas an das Modell geht. Ein Satz im Prompt wie „Zeige keine vertraulichen Inhalte“ ist kein Schutz, denn Modelle lassen sich umgehen.",
      "Auch Protokolle zählen: Fragen und Antworten können personenbezogene Daten enthalten. Lege fest, was gespeichert wird, wie lange und wer es lesen darf. Läuft das Modell auf eigener Hardware wie hier, bleiben die Daten im Haus. Das ist keine Rechtsberatung. Bei Personendaten solltest du die Datenschutzstelle einbeziehen.",
    ], alltag: [
      "In einer Bibliothek gibt es einen Magazinbereich, den nur Mitarbeiter betreten. Die Auskunftsperson holt keine Bücher aus dem Magazin, wenn der Besucher dort nichts zu suchen hat. Sie prüft das, bevor sie losgeht. Sie fragt nicht erst nach, nachdem sie die Bücher gelesen hat.",
    ]},
    {h: "Betrieb: aktuell bleiben und lernen", p: [
      "Ein RAG-System ist nach dem Start nicht fertig. Dokumente ändern sich, neue kommen hinzu, alte werden ungültig.",
    ], liste: [
      "**Aktualisieren:** Lege fest, wie geänderte Dokumente in den Index kommen (automatisch bei Änderung oder regelmäßig) und wie gelöschte verschwinden. Veraltete Stücke sind eine häufige Fehlerquelle.",
      "**Versionen festhalten:** Notiere, mit welchem Embedding-Modell und welchen Chunk-Einstellungen der Index gebaut wurde. Bei Änderungen baust du ihn neu und vergleichst mit dem Testset.",
      "**Protokolle auswerten:** Welche Fragen kommen? Bei welchen gab es keine Treffer? Wo klickt jemand auf „Antwort war falsch“? Das sind die besten neuen Testfragen.",
      "**Rückmeldung einholen:** Ein Daumen hoch oder runter neben jeder Antwort liefert Daten. Wer Fehler meldet, soll das ohne Aufwand tun können.",
    ], alltag: [
      "Eine Bibliothek kauft ständig neue Bücher und sondert alte aus. Die Auskunftsperson muss die Neuzugänge im Katalog finden, und ein Buch von 1990 mit überholten Gesetzen darf nicht mehr im Regal stehen. Pflege heißt hier: Katalog und Regal bleiben deckungsgleich.",
    ], merke: "Messen ist keine einmalige Aktion. Das Testset begleitet jede Änderung, und die Protokolle liefern die nächsten Testfragen."},
  ],
  mitnehmen: [
    "Ein Testset aus echten Fragen mit bekannter Fundstelle zeigt, wo das System steht. Miss Suche (Trefferquote, Rang) und Antwort (Richtigkeit, Antworttreue, Vollständigkeit) getrennt.",
    "Verbessere von vorn nach hinten: Daten und Chunking, dann Suche, dann Reranking, zuletzt Modell. Ändere immer nur eine Sache.",
    "Rechte werden vor der Suche geprüft, nicht nach der Antwort. Aktualisierung und Protokolle gehören zum Betrieb.",
  ],
  quiz: [
    {frage: "Warum misst man die Suche getrennt von der Antwort?",
      optionen: ["Weil es schneller geht", "Weil Suche und Antwort nichts miteinander zu tun haben", "Weil die Antwort nicht messbar ist", "Weil man sonst nicht weiß, ob die Suche oder das Modell den Fehler verursacht"],
      richtig: 3, erklaerung: "Ist schon die Suche falsch, kann das Modell nichts retten. Nur getrennt gemessen erkennst du, wo du ansetzen musst."},
    {frage: "Bei 50 Testfragen liegt die richtige Fundstelle 40 Mal unter den ersten 5 Treffern. Wie hoch ist die Trefferquote in den ersten 5?",
      optionen: ["40 Prozent", "50 Prozent", "80 Prozent", "90 Prozent"],
      richtig: 2, erklaerung: "40 geteilt durch 50 ergibt 0,8, also 80 Prozent."},
    {frage: "Das Modell sagt etwas, das nicht im vorgelegten Kontext steht. Welche Eigenschaft fehlt?",
      optionen: ["Antworttreue", "Trefferquote", "Geschwindigkeit", "Normalisierung"],
      richtig: 0, erklaerung: "Antworttreue heißt, dass jede Aussage der Antwort im Kontext belegt ist. Hier hat das Modell etwas dazuerfunden."},
    {frage: "Die Ergebnisse sind schlecht. Womit fängst du an zu verbessern?",
      optionen: ["Mit einem größeren Sprachmodell", "Mit Daten und Chunking, also dem Anfang der Kette", "Mit dem Reranker, weil er am meisten bringt", "Mit einem längeren Prompt"],
      richtig: 1, erklaerung: "Fehler am Anfang der Kette wirken auf alles Folgende, und sie sind meist am günstigsten zu beheben. Das Modell kommt zuletzt."},
    {frage: "Ein Mitarbeiter soll nur Dokumente seiner Abteilung finden. Wo setzt du die Zugriffsprüfung an?",
      optionen: ["Im Prompt: „Zeige keine vertraulichen Inhalte“", "Gar nicht, Embeddings sind anonym", "Nach der Antwort, indem man sie liest", "Vor der Suche, als Filter nach den Rechten der fragenden Person"],
      richtig: 3, erklaerung: "Was gar nicht erst in die Treffer kommt, kann nicht durchsickern. Ein Prompt-Satz lässt sich umgehen, ein Filter vor der Suche nicht auf diese Weise."},
  ],
  weiter: ["rag", "rag-reranking", "llm-grenzen", "finetuning-oder-rag"],
};

/* ====================================================================== Glossar */
const glossar = {
  pipeline: ["Pipeline", "Eine Kette von Schritten, bei der das Ergebnis eines Schritts die Eingabe des nächsten ist. Bei RAG: aufbereiten, zerlegen, vektorisieren, speichern, suchen, antworten."],
  vektor: ["Vektor", "Eine geordnete Liste von Zahlen. Jeder Platz steht immer für dieselbe Eigenschaft, sodass man zwei Vektoren vergleichen kann, zum Beispiel Koordinaten auf einer Karte."],
  dimension: ["Dimension", "Die Zahl der Einträge eines Vektors. Das Embedding-Modell dieses Labors liefert 768 Zahlen je Text, hat also 768 Dimensionen."],
  normalisierung: ["Normalisierung", "Jeder Vektor wird auf die Länge 1 skaliert. Dann reicht zum Vergleichen eine einfache Multiplikation mit Aufsummieren, und die Suche wird schnell."],
  chunk: ["Chunk", "Ein Stück Text, in das ein Dokument für die Suche zerlegt wird. Jedes Stück bekommt einen eigenen Vektor und wird einzeln gefunden."],
  ueberlappung: ["Überlappung", "Der Anfang eines Stücks wiederholt das Ende des vorigen. So steht ein Gedanke an der Schnittstelle in mindestens einem Stück ganz."],
  metadaten: ["Metadaten", "Zusatzangaben zu einem Stück: Dokument, Kapitel, Seite, Datum, Abteilung. Sie dienen der Quellenangabe, dem Filtern und dem gezielten Aktualisieren."],
  ocr: ["Texterkennung (OCR)", "Verfahren, das aus dem Bild eines Dokuments, etwa einem Scan, Text macht. Ohne sie ist ein Scan für die Suche nur ein Bild."],
  index: ["Index", "Die durchsuchbare Ablage: Stücke mit Vektoren, Herkunft und Metadaten. Die Suche arbeitet auf ihm, nicht auf den Originaldokumenten."],
  bm25: ["BM25", "Verbreitetes Verfahren der Stichwortsuche. Seltene Wörter zählen mehr, häufige Wiederholung wirkt nur schwach, und die Textlänge wird ausgeglichen."],
  hybridsuche: ["Hybridsuche", "Stichwortsuche und Vektorsuche laufen zusammen. Ihre Ranglisten werden zu einer gemeinsamen Liste verbunden."],
  rangfusion: ["Rangfusion", "Zwei Ranglisten werden über die Platzierungen zusammengeführt: Jeder Platz bringt Punkte, oben mehr als unten, und die Punkte werden addiert."],
  topk: ["Top-k", "Die Zahl der Treffer, die die Suche an das Sprachmodell weitergibt. Zu wenige lassen die richtige Stelle fehlen, zu viele lenken ab."],
  reranker: ["Reranker", "Ein Modell, das Frage und Kandidat gemeinsam liest und die Treffer genauer neu sortiert. Genauer als die erste Suche, aber langsamer."],
  trefferquote: ["Trefferquote", "Der Anteil der Testfragen, bei denen die richtige Fundstelle unter den ersten k Treffern liegt."],
  antworttreue: ["Antworttreue", "Jede Aussage der Antwort steht tatsächlich im vorgelegten Kontext. Ein Modell, das etwas dazuerfindet, verletzt sie."],
};

INHALT.registriere({
  seiten: S,
  glossar,
  gruppen: [{ name: "Wissen und RAG", seiten: ["rag-ueberblick", "rag-embedding", "rag-chunking", "rag-suche", "rag-reranking", "rag-bewertung"] }],
});
/* Das Labor "rag" steht nach den Lektionen. */
const g = INHALT.gruppen.find((x) => x.name === "Wissen und RAG");
g.seiten = ["rag-ueberblick", "rag-embedding", "rag-chunking", "rag-suche", "rag-reranking", "rag-bewertung", "rag"];
})();
