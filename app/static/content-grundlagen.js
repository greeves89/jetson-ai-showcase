/* Strang Grundlagen-Vertiefung: Daten, neuronale Netze, Training, Bewertung, Verzerrung und Ethik, Recht.
   Baut auf den Seiten "karte" und "ml" auf. Bausteine: siehe docs/bausteine-grundlagen.md,
   Videoskizzen: docs/videos-grundlagen.md. */
window.INHALT.registriere({

seiten: {

daten: {
  typ: "lektion", gruppe: "Grundlagen", titel: "Daten, der Rohstoff", nav: "Daten", symbol: "ml",
  kurz: "Ein Modell kann nur lernen, was in seinen Daten steckt. Was zählt als Datum, wie sieht gute Qualität aus, und wie viel braucht man?",
  widget: "datenqualitaet",
  videos: ["daten-rohstoff"],
  abschnitte: [
    {h: "Was für eine KI als Datum gilt", p: [
      "Fast alles, was sich festhalten lässt, kann ein Datum sein: eine Tabellenzeile, ein Foto, ein Satz, eine Tonaufnahme, die Temperatur einer Maschine im Sekundentakt. Für ein Modell ist all das am Ende eine Menge Zahlen. Ein Foto besteht aus Helligkeitswerten, ein Text aus Wortstücken, ein Ton aus Schwingungen.",
      "Die Daten sind deshalb der eigentliche Rohstoff. Das [[ml|Verfahren]] ist oft fertig aus dem Regal. Was ein Projekt unverwechselbar macht und gelingen oder scheitern lässt, sind die Daten, die du hineingibst.",
    ], alltag: [
      "Denk an eine Karteikarte beim Hausarzt. Auf ihr stehen Name, Alter, Gewicht, Blutdruck und handschriftliche Notizen. Das sind verschiedene Arten von Daten auf einem Blatt: Zahlen, Kategorien und freier Text.",
      "Der Vergleich trägt, bis es um Menge geht. Eine Karteikarte beschreibt einen Menschen. Ein Modell braucht viele Karten, damit es Muster findet statt Einzelfälle.",
    ]},
    {h: "Merkmale und Etiketten", p: [
      "Jedes Beispiel wird durch [[merkmal|Merkmale]] beschrieben. Das sind die Eigenschaften, an denen sich das Modell orientiert. Beim überwachten Lernen kommt das [[label|Etikett]] dazu: die richtige Antwort, die das Modell vorhersagen soll.",
    ], alltag: [
      "Ein Gebrauchtwagen-Inserat zeigt beides. Baujahr, Kilometerstand, Marke und Zustand sind die Merkmale. Der Verkaufspreis ist das Etikett. Wer viele Inserate mit Preis gesehen hat, kann bei einem neuen Auto den Preis schätzen. Ein Modell macht dasselbe, nur mit sehr vielen Inseraten und ohne Bauchgefühl.",
      "Der Vergleich hinkt an einer Stelle: Ein Mensch weiß, dass ein Unfallschaden wichtig ist, auch wenn er nicht im Inserat steht. Ein Modell kennt nur die Merkmale, die ihm vorliegen.",
    ], merke: "Merkmale sind die Eingabe, das Etikett ist die gesuchte Antwort. Ohne passende Merkmale kann auch das beste Verfahren nichts finden."},
    {h: "Strukturierte und unstrukturierte Daten", p: [
      "[[strukturiert|Strukturierte Daten]] haben ein festes Raster: Spalten mit Namen, Zeilen mit Werten, wie in einer Tabelle. [[unstrukturiert|Unstrukturierte Daten]] haben keines. Bei Bildern, Texten und Tönen steckt die Information im Inhalt selbst.",
      "Für Tabellen reichen oft einfache Verfahren. Bei Bildern, Sprache und Ton setzt man meist [[dl|tiefe Netze]] ein. Sie leiten die Merkmale selbst aus den Rohdaten ab.",
    ], tabelle: {
      beschriftung: "Datenarten im Vergleich",
      kopf: ["Datenart", "Beispiel", "Was das Modell sieht", "Typische Aufgabe"],
      zeilen: [
        ["Tabelle", "Bestellungen, Messwerte je Zeile", "Zahlen und Kategorien in Spalten", "Preis schätzen, Kündigung vorhersagen"],
        ["Bild", "Foto eines Werkstücks", "Helligkeitswerte je Bildpunkt", "Fehler erkennen, Objekte zählen"],
        ["Text", "E-Mail, Vertrag", "Folge von Wortstücken", "Sortieren, zusammenfassen, beantworten"],
        ["Ton", "Aufnahme eines Gesprächs", "Schwingungen über die Zeit", "Sprache in Text umwandeln"],
        ["Messreihe", "Temperatur einer Maschine", "Werte in zeitlicher Folge", "Ausfälle früh erkennen"],
      ],
    }},
    {h: "Datenqualität: Müll hinein, Müll heraus", p: [
      "Ein Modell kann nicht prüfen, ob seine Daten stimmen. Es lernt, was da ist. Vier Probleme begegnen dir dabei immer wieder:",
    ], liste: [
      "**Fehler:** falsch erfasste Werte, vertauschte Spalten, ein Preis in der falschen Einheit, ein falsches Etikett.",
      "**Lücken:** fehlende Werte. Sie sind selten zufällig. Fehlt der Wert immer bei einer bestimmten Gruppe, lernt das Modell diese Gruppe schlechter.",
      "**[[dublette|Dubletten]]:** dasselbe Beispiel mehrfach. Das Modell gewichtet es dadurch zu stark. Steckt dieselbe Zeile in Training und Test, sieht das Testergebnis besser aus, als es ist.",
      "**[[verzerrung|Verzerrung]]:** Die Daten bilden die Wirklichkeit einseitig ab. Mehr dazu auf der Seite {{verzerrung-ethik|Fairness und Verzerrung}}.",
    ], alltag: "Stell dir ein Rezept vor, bei dem jemand Salz und Zucker verwechselt hat. Der beste Koch bekommt daraus keinen guten Kuchen. Das Modell ist der Koch, die Daten sind die Zutaten. Der Fehler liegt nicht im Handwerk, sondern in dem, was auf dem Tisch steht."},
    {h: "Wie viel Daten reichen?", p: [
      "Eine feste Zahl gibt es nicht. Sie hängt von der Aufgabe, vom Verfahren und von der Streuung der Fälle ab. Eine brauchbare Faustregel lautet: Vielfalt vor Menge. Tausend fast gleiche Fotos bringen weniger als hundert, die verschiedene Lichtverhältnisse, Blickwinkel und Hintergründe zeigen.",
      "Teste deshalb früh mit wenigen Daten, schau dir die Fehler an und sammle gezielt das, was fehlt. Das ist meist billiger als blind mehr vom Gleichen zu sammeln.",
    ], alltag: "Wer Autofahren lernt und tausendmal dieselbe leere Straße bei Sonne abfährt, besteht trotzdem keine Prüfung bei Nebel, Regen und Stadtverkehr. Zehn Fahrstunden mit wechselnden Bedingungen helfen mehr."},
    {h: "Trainings-, Validierungs- und Testdaten", p: [
      "Man teilt die Daten in drei Teile. Mit den [[trainingsdaten|Trainingsdaten]] lernt das Modell. Die [[validierung|Validierungsdaten]] dienen zum Einstellen und Vergleichen. Die [[testdaten|Testdaten]] bleiben bis zum Schluss unberührt und zeigen, wie gut das Modell bei Neuem ist.",
      "Würde man auf den Trainingsdaten messen, könnte das Modell die Beispiele einfach auswendig gelernt haben. Das nennt man [[ueberanpassung|Überanpassung]]. Erst Daten, die es nie gesehen hat, verraten die Wahrheit.",
    ], alltag: "Üben heißt: Aufgaben aus dem Buch rechnen und die Lösungen nachsehen. Die Probeklausur zeigt dir, wo du stehst, und du darfst danach noch nachlernen. Die echte Klausur zählt einmal. Hättest du ihre Fragen vorher gekannt, wäre die Note wertlos.",
      tabelle: {
        beschriftung: "Drei Töpfe für drei Zwecke",
        kopf: ["Teil", "Alltagsbild", "Wofür", "Wie oft benutzt"],
        zeilen: [
          ["Training", "Üben mit Lösungen", "Das Modell stellt seine Zahlen ein", "Sehr oft"],
          ["Validierung", "Probeklausur", "Einstellungen vergleichen, Abbruch entscheiden", "Immer wieder"],
          ["Test", "Echte Klausur", "Ehrliche Endnote vor dem Einsatz", "Einmal"],
        ],
      }},
    {h: "Datenschutz-Basics", p: [
      "Sobald Daten sich auf eine Person beziehen lassen, sind sie [[personenbezogen|personenbezogen]]: Namen, Fotos, Stimmen, aber auch Kombinationen wie Wohnort, Alter und Beruf. Dafür gelten Regeln. Drei Grundgedanken helfen bei jedem Projekt:",
    ], liste: [
      "**Zweck:** Du sammelst Daten für einen bestimmten Zweck und nutzt sie nicht still für etwas anderes.",
      "**Sparsamkeit:** Du erhebst nur, was du wirklich brauchst. Was du nicht hast, kann nicht verloren gehen.",
      "**Kontrolle:** Du weißt, wo die Daten liegen, wer sie sieht und wann sie gelöscht werden.",
    ], alltag: "Ein Sportverein hat eine Mitgliederliste, um Beiträge einzuziehen. Dieselbe Liste an einen Händler zu geben, der Werbung schicken will, ist etwas anderes. Der Zweck ist ein anderer, und die Mitglieder haben dem nicht zugestimmt. Die Grundzüge der Regeln findest du auf der Seite {{recht|Recht und Regeln}}."},
    {h: "Datenpflege ist Dauerarbeit", p: [
      "Mit dem ersten Training ist die Arbeit nicht fertig. Die Welt ändert sich: Neue Produkte erscheinen, Kunden verhalten sich anders, ein Sensor wird getauscht. Daten, die gestern gut waren, passen nach einem Jahr womöglich nicht mehr zur Wirklichkeit. Das Modell wird dann schleichend schlechter, ohne dass jemand eine Fehlermeldung sieht.",
      "Darum gehören zu jedem Einsatz klare Zuständigkeiten: Wer prüft die Qualität, wer ergänzt neue Fälle, wer löscht Altes? Eine Datenpflege, die nebenbei läuft, fällt bei Zeitdruck als Erstes weg.",
    ], alltag: "Ein Adressbuch, das zehn Jahre niemand angefasst hat, ist voller alter Nummern und Umzüge. Es sieht noch vollständig aus und führt trotzdem ins Leere."},
  ],
  mitnehmen: [
    "Merkmale sind die Eingabe, das Etikett ist die gesuchte Antwort. Beides kommt aus den Daten.",
    "Vielfalt und Qualität zählen mehr als reine Menge. Prüfen darfst du nur mit Daten, die das Modell nie gesehen hat.",
    "Personenbezogene Daten brauchen einen Zweck und Sparsamkeit, und Datenpflege hört nie auf.",
  ],
  quiz: [
    {frage: "Was ist bei einem Gebrauchtwagen-Inserat das Etikett?",
     optionen: ["Das Foto des Autos","Der Kilometerstand","Der Verkaufspreis, den das Modell vorhersagen soll","Der Name des Verkäufers"],
     richtig: 2, erklaerung: "Das Etikett ist die gesuchte Antwort. Kilometerstand, Baujahr und Zustand sind Merkmale, aus denen das Modell den Preis ableitet."},
    {frage: "Ein Team hat 5000 fast gleiche Fotos und 200 sehr verschiedene. Was nützt dem Modell voraussichtlich mehr?",
     optionen: ["Die 200 verschiedenen, weil sie mehr Fälle abdecken","Die 5000 gleichen, weil Menge immer gewinnt","Beides ist gleich nützlich","Keine von beiden, Fotos taugen nicht"],
     richtig: 0, erklaerung: "Vielfalt vor Menge: Viele fast gleiche Beispiele bringen wenig Neues. Entscheidend ist, dass die Fälle im Einsatz vorkommen."},
    {frage: "Warum darf man ein Modell nicht mit seinen Trainingsdaten bewerten?",
     optionen: ["Weil die Daten dann gelöscht werden","Weil das Modell sonst langsamer wird","Weil Trainingsdaten immer falsch sind","Weil es sie auswendig gelernt haben könnte und das Ergebnis zu gut aussieht"],
     richtig: 3, erklaerung: "Auswendiglernen nennt man Überanpassung. Ehrlich wird die Prüfung nur mit Daten, die das Modell vorher nie gesehen hat."},
    {frage: "In deinen Daten fehlen Werte fast nur bei einer bestimmten Kundengruppe. Was ist das Risiko?",
     optionen: ["Keines, Lücken gleichen sich aus", "Das Modell lernt diese Gruppe schlechter und behandelt sie womöglich schlechter", "Das Modell wird schneller", "Die Daten werden automatisch ergänzt"],
     richtig: 1, erklaerung: "Lücken sind selten zufällig. Fehlt etwas systematisch bei einer Gruppe, ist das Modell dort ungenauer."},
    {frage: "Du hast Kundendaten für Rechnungen erhoben und willst sie jetzt für Werbung nutzen. Was gilt als Faustregel?",
     optionen: ["Erlaubt, Daten gehören der Firma", "Der Zweck ändert sich, also musst du neu prüfen, ob das zulässig ist", "Erlaubt, wenn die Daten alt sind", "Nur verboten, wenn sie Namen enthalten"],
     richtig: 1, erklaerung: "Daten werden für einen Zweck erhoben. Eine neue Nutzung braucht eine eigene Prüfung, im Zweifel Rat von der Datenschutzstelle."},
  ],
  weiter: ["neuronale-netze", "bewertung", "recht"],
},

"neuronale-netze": {
  typ: "lektion", gruppe: "Grundlagen", titel: "Neuronale Netze von Grund auf", nav: "Neuronale Netze", symbol: "ml",
  kurz: "Hinter vielen KI-Anwendungen steckt ein Netz aus winzigen Rechenstellen. Wie entscheidet eine davon, und was entsteht, wenn man viele verschaltet?",
  widget: "netz-spielplatz",
  videos: ["neuronale-netze-erklaert"],
  abschnitte: [
    {h: "Ein Neuron ist ein kleiner Entscheider", p: [
      "Ein künstliches [[neuron|Neuron]] hat mit einer Nervenzelle nur die Grundidee gemeinsam. Es ist eine kleine Rechenstelle: Sie bekommt mehrere Zahlen herein, rechnet damit und gibt eine Zahl heraus. Mehr nicht. Die Leistung entsteht erst, wenn man sehr viele davon zusammenschaltet.",
    ], alltag: [
      "Ein Team stimmt ab, ob ihr abends grillt. Jede Person gibt eine Stimme: Wetter gut, Zeit da, Lust da. Nicht alle Stimmen zählen gleich. Wer den Grill besitzt und einkauft, hat mehr Gewicht als jemand, dem es egal ist.",
      "Genau das macht ein Neuron. Die Stimmen sind die Eingaben, das Gewicht je Stimme ist der Einfluss. Am Ende steht eine Entscheidung. Der Vergleich hinkt bei der Zahlenform: Ein Neuron gibt nicht nur Ja oder Nein aus, sondern oft einen Wert dazwischen.",
    ]},
    {h: "Eingaben, Gewichte, Summe, Schwelle", p: [
      "Der Ablauf ist immer gleich. Jede Eingabe wird mit ihrem [[gewicht|Gewicht]] multipliziert. Alle Ergebnisse werden addiert. Zur Summe kommt eine feste Zahl, die Verschiebung, hinzu. Dann folgt die [[aktivierung|Aktivierung]]: Sie legt fest, wie stark das Neuron meldet.",
      "Die einfachste Aktivierung ist eine Schwelle. Liegt die Summe darüber, meldet das Neuron „ja“, sonst „nein“. Weiche Formen geben stattdessen einen gleitenden Wert aus. Wichtig ist: Gewichte und Verschiebung sind die Zahlen, die beim [[training|Training]] eingestellt werden.",
    ], alltag: "Eine Fußgängerampel zeigt Grün, sobald genug Wartezeit abgelaufen ist und kein Auto kommt. Es gibt eine Schwelle: Unter ihr bleibt es rot, darüber wird es grün. Die Schwelle zu verschieben ändert, wie schnell die Ampel umspringt. Im Neuron übernimmt die Verschiebung genau diese Rolle.",
      merke: "Ein Neuron berechnet: Eingaben mal Gewichte, Summe, Verschiebung, Aktivierung. Das Lernen besteht darin, die Gewichte zu finden."},
    {h: "Schichten: Merkmale aus Merkmalen", p: [
      "Ein einzelnes Neuron kann nur eine gerade Trennlinie ziehen. Viele Aufgaben brauchen mehr. Deshalb ordnet man Neuronen in [[schicht|Schichten]]: Die Ausgaben einer Schicht sind die Eingaben der nächsten.",
      "So baut die zweite Schicht auf dem auf, was die erste gefunden hat. Das ist der Kern der Sache: Merkmale entstehen aus Merkmalen. Bei einem Foto erkennen frühe Schichten oft einfache Dinge wie Kanten, spätere setzen daraus Formen zusammen, noch spätere ganze Gegenstände.",
    ], alltag: "Ein Postsortierzentrum arbeitet in Stufen. Erst wird nach Größe getrennt, dann nach Postleitzahlbereich, dann nach Straße. Keine Stufe kennt das ganze Ziel. Jede macht einen einfachen Schritt auf dem Ergebnis der vorigen."},
    {h: "Warum mehrere Schichten mehr können", p: [
      "Würde jede Schicht nur multiplizieren und addieren, ließen sich alle Schichten zu einer einzigen zusammenfassen. Erst die Aktivierung dazwischen macht mehrere Schichten sinnvoll. Sie bricht die Geradlinigkeit auf, und das Netz kann gebogene, verschlungene Grenzen zwischen Klassen ziehen.",
      "Ein bekanntes Beispiel: Zwei Gruppen von Punkten liegen so, dass keine Gerade sie trennt. Ein Neuron scheitert. Mit einer Zwischenschicht aus zwei Neuronen klappt es. Probiere das im Baustein oben aus.",
    ], tabelle: {
      beschriftung: "Was Schichten verändern",
      kopf: ["Aufbau", "Was das Netz zeichnen kann", "Beispiel"],
      zeilen: [
        ["Ein Neuron", "Eine gerade Trennlinie", "Ist es warm genug für ein Eis?"],
        ["Eine Zwischenschicht", "Mehrere Linien, die sich zu Flächen verbinden", "Zwei getrennte Bereiche derselben Klasse"],
        ["Viele Schichten", "Verschachtelte, sehr feine Muster", "Gesichter, Sprache, Schrift"],
      ],
    }},
    {h: "Parameter zählen und was „tief“ heißt", p: [
      "Alle Gewichte und Verschiebungen zusammen heißen [[parameter|Parameter]]. Ein winziges Netz mit 3 Eingaben, einer Schicht aus 4 Neuronen und einem Ausgabeneuron hat 21 davon: 12 Gewichte und 4 Verschiebungen in der ersten Schicht, 4 Gewichte und 1 Verschiebung in der zweiten.",
      "Das wächst schnell. Eine einzige Schicht aus 100 Neuronen, die ein Bild von 28 mal 28 Punkten bekommt, hat schon 78 500 Parameter. Echte Bildmodelle haben Millionen, große Sprachmodelle viele Milliarden.",
      "„Tief“ in [[dl|Deep Learning]] heißt einfach: viele Schichten hintereinander. Mehr Schichten erlauben feinere Muster, brauchen aber mehr Daten und mehr Rechenzeit.",
    ], alltag: "Ein Mosaik aus 100 Steinen zeigt grob ein Bild. Eines aus 100 000 Steinen zeigt Gesichter. Mit mehr einstellbaren Teilen steigt, wie fein das Netz sein Muster zeichnen kann. Der Vergleich hinkt: Mehr Teile helfen nur, wenn genug Beispiele da sind, sie sinnvoll einzustellen."},
    {h: "Warum sie wie Blackboxes wirken", p: [
      "Wenn du auf ein Netz schaust, siehst du Millionen Zahlen. Keine einzelne davon bedeutet „Katze“ oder „Fehler“. Das Wissen ist über viele Gewichte verteilt. Darum lässt sich oft nur schwer sagen, warum ein Netz so entschieden hat. Man nennt das eine [[blackbox|Blackbox]].",
      "Es gibt Werkzeuge, die zeigen, worauf das Netz geachtet hat, etwa welche Bildbereiche eine Entscheidung geprägt haben. Sie geben Hinweise, aber keine vollständige Erklärung.",
    ], alltag: "Ein erfahrener Handwerker hört am Klang eines Motors, was kaputt ist. Fragst du ihn, warum, sagt er: „Klingt falsch.“ Das Wissen ist da, aber nicht in Regeln zerlegt. Ein Netz verhält sich ähnlich, nur ohne Erfahrung im Umgang mit Überraschungen."},
    {h: "Stärken, Schwächen und die Verbindung zu den Modellen", p: [
      "Netze sind stark, wenn es viele Beispiele gibt und die Muster sich schwer als Regeln aufschreiben lassen: Bilder, Sprache, Ton. Sie sind schwach, wenn Daten knapp sind, wenn man jede Entscheidung begründen muss oder wenn ein Fall weit von den Trainingsdaten abweicht. Bei Tabellen mit wenigen Merkmalen sind einfache Verfahren oft besser und billiger.",
      "Ein Netz kennt nur, was in den Trainingsdaten vorkam. Zeigst du ihm etwas völlig Fremdes, antwortet es trotzdem, oft mit hoher Sicherheit und falsch. Es sagt nicht „das kenne ich nicht“, solange man ihm das nicht eigens beibringt.",
    ], alltag: "Ein Fahrschüler, der nur auf einer Übungsstrecke gefahren ist, steht vor einer Kreuzung im Stadtverkehr. Er handelt nach dem, was er kennt, und merkt nicht, dass die Lage anders ist. Ein Netz verhält sich bei fremden Eingaben ähnlich."},
    {h: "Die Verbindung zu den Modellen im Labor", p: [
      "Die Seite {{ml|Maschinelles Lernen}} hat gezeigt, dass ein Modell aus Zahlen besteht. Ein neuronales Netz ist eine Bauart davon. Auch das Sprachmodell im {{chat|Chat}} ist ein sehr großes Netz, das im Kern das nächste Wortstück vorhersagt. Wie die Gewichte eingestellt werden, steht auf der Seite {{training|Wie ein Modell lernt}}.",
      "Auch die Objekt- und Gesichtserkennung im Labor laufen auf Netzen. Dort siehst du, wie schnell ein fertiges Netz auf dem Jetson rechnet, obwohl es Millionen Parameter hat. Die Rechenarbeit passiert beim Auswerten nur einmal vorwärts durch alle Schichten.",
    ], alltag: "Ein gelernter Handwerker braucht für den Handgriff Sekunden, obwohl die Ausbildung Jahre gedauert hat. Training ist die Ausbildung, das Auswerten der Handgriff."},
  ],
  mitnehmen: [
    "Ein Neuron bildet eine gewichtete Summe seiner Eingaben und entscheidet per Aktivierung, wie stark es meldet.",
    "Schichten bauen Merkmale aus Merkmalen auf. Erst die Aktivierung dazwischen macht mehrere Schichten wertvoll.",
    "Netze haben Millionen bis Milliarden Parameter und sind schwer zu erklären. Sie glänzen bei Bildern, Sprache und Ton.",
  ],
  quiz: [
    {frage: "Im Team-Beispiel zählt die Stimme des Grillbesitzers mehr. Was entspricht das im Neuron?",
     optionen: ["Ein größeres Gewicht auf dieser Eingabe", "Eine zusätzliche Schicht", "Eine niedrigere Lernrate", "Ein größeres Foto"],
     richtig: 0, erklaerung: "Das Gewicht legt fest, wie stark eine Eingabe die Summe beeinflusst. Beim Lernen werden diese Gewichte angepasst."},
    {frage: "Warum braucht ein Netz zwischen den Schichten eine Aktivierung?",
     optionen: ["Damit es schneller läuft","Damit das Netz weniger Parameter hat","Damit mehrere Schichten nicht auf eine einzige Rechnung zusammenschrumpfen","Damit es Bilder versteht"],
     richtig: 2, erklaerung: "Ohne Aktivierung wäre alles nur Multiplizieren und Addieren, und beliebig viele Schichten könnten nicht mehr als eine. Die Aktivierung erlaubt gebogene Grenzen."},
    {frage: "Ein Netz hat 3 Eingaben, 4 Neuronen in der Zwischenschicht und 1 Ausgabeneuron. Wie viele Parameter hat es?",
     optionen: ["8", "12", "21", "100"],
     richtig: 2, erklaerung: "Erste Schicht: 3 mal 4 Gewichte plus 4 Verschiebungen gleich 16. Zweite Schicht: 4 Gewichte plus 1 Verschiebung gleich 5. Zusammen 21."},
    {frage: "Was bedeutet „tief“ bei Deep Learning?",
     optionen: ["Das Netz liegt auf einem tiefen Speicher","Das Netz braucht keine Daten","Das Netz versteht Texte tiefgründiger","Das Netz hat viele Schichten hintereinander"],
     richtig: 3, erklaerung: "Tief bezeichnet die Zahl der Schichten. Mehr Schichten erlauben feinere Muster, kosten aber Daten und Rechenzeit."},
    {frage: "Warum nennt man Netze oft Blackboxes?",
     optionen: ["Weil sie in schwarzen Gehäusen laufen", "Weil ihr Wissen auf Millionen Gewichte verteilt ist und sich schwer in Regeln erklären lässt", "Weil sie ihre Daten verstecken", "Weil sie nur nachts rechnen"],
     richtig: 1, erklaerung: "Keine einzelne Zahl bedeutet etwas Greifbares. Wissen steckt im Zusammenspiel. Erklärwerkzeuge liefern Hinweise, aber keine vollständige Begründung."},
  ],
  weiter: ["training", "bewertung", "chat"],
},

training: {
  typ: "lektion", gruppe: "Grundlagen", titel: "Wie ein Modell lernt", nav: "Training", symbol: "ml",
  kurz: "Ein Modell startet mit zufälligen Zahlen und ist anfangs schlecht. Wie wird daraus ein brauchbares, ohne dass jemand die Zahlen von Hand setzt?",
  widget: "gradient-abstieg",
  videos: ["training-gradientenabstieg"],
  abschnitte: [
    {h: "Zuerst muss man den Fehler messen", p: [
      "Lernen braucht eine Rückmeldung: Wie falsch lag das Modell? Dafür gibt es eine Zahl, den [[verlust|Verlust]]. Er wird aus den Vorhersagen und den richtigen Antworten berechnet. Null heißt perfekt, je größer, desto schlechter.",
      "Das Ziel des Trainings ist dann klar und rechenbar: die Gewichte so einstellen, dass der Verlust über alle Trainingsbeispiele möglichst klein wird.",
    ], alltag: [
      "Beim Darts zählt die Entfernung zur Mitte. Ein Pfeil knapp daneben ist besser als einer an der Wand. Der Verlust ist diese Entfernung, gemittelt über viele Würfe.",
      "Der Vergleich hat eine Grenze: Beim Darts siehst du, in welche Richtung du korrigieren musst. Das Modell muss das für Millionen Gewichte gleichzeitig herausfinden.",
    ]},
    {h: "Der Kreislauf: vorhersagen, messen, nachjustieren", p: [
      "Jede Trainingsrunde läuft gleich ab. Das Modell sagt für Beispiele etwas voraus. Der Verlust zeigt, wie weit es daneben lag. Dann wird jedes Gewicht ein kleines Stück in die Richtung verschoben, die den Verlust senkt. Danach beginnt die nächste Runde.",
      "Wie man diese Richtung für alle Gewichte effizient bekommt, regelt ein Rechenverfahren namens Rückpropagierung. Es rechnet vom Fehler am Ausgang rückwärts durch die Schichten und stellt fest, wie viel jedes Gewicht dazu beigetragen hat. Du musst die Mathematik nicht kennen, um das Prinzip zu nutzen.",
    ], alltag: "Beim Abschmecken einer Suppe probierst du, merkst „zu fade“, gibst eine Prise Salz zu und probierst wieder. Du machst keinen großen Sprung, sondern kleine Korrekturen, bis es passt. Training ist dasselbe, nur mit sehr vielen Zutaten gleichzeitig."},
    {h: "Gradientenabstieg: im Nebel ins Tal", p: [
      "Stell dir den Verlust als Landschaft vor. Jede Kombination von Gewichten ist ein Ort, die Höhe ist der Verlust. Das Ziel liegt im tiefsten Tal. Das Modell sieht die Landschaft nicht, es spürt nur das Gefälle direkt unter seinen Füßen. Dieses Gefälle heißt [[gradient|Gradient]]. Er zeigt bergauf, also geht man in die Gegenrichtung.",
      "Dieses Verfahren heißt Gradientenabstieg. Es braucht keine Karte. Es braucht nur an jedem Ort die Frage: Wo geht es hier bergab?",
    ], alltag: "Du wanderst im dichten Nebel und willst ins Tal. Du siehst nichts, spürst aber mit den Füßen, wohin der Boden abfällt. Du machst einen kleinen Schritt bergab, prüfst wieder und gehst weiter. Irgendwann steht der Boden flach, und du bist unten.",
      merke: "Gradientenabstieg heißt: Schritt für Schritt in die Richtung gehen, in der der Fehler am stärksten sinkt."},
    {h: "Die Lernrate: wie groß ist der Schritt?", p: [
      "Die [[lernrate|Lernrate]] bestimmt die Schrittweite. Sie ist eine Einstellung, die du vor dem Training wählst, kein Ergebnis des Lernens. Sie entscheidet oft, ob das Training überhaupt klappt.",
    ], tabelle: {
      beschriftung: "Lernrate im Nebel-Bild",
      kopf: ["Lernrate", "Was passiert", "Bild"],
      zeilen: [
        ["Viel zu groß", "Der Fehler springt hin und her oder wächst", "Du springst über das Tal und landest am gegenüberliegenden Hang"],
        ["Passend", "Der Fehler sinkt gleichmäßig", "Du gehst zügig und sicher nach unten"],
        ["Viel zu klein", "Es sinkt, aber extrem langsam", "Du setzt Zentimeterschritte und kommst nie an"],
      ],
    }},
    {h: "Epochen und Päckchen", p: [
      "Eine [[epoche|Epoche]] ist ein vollständiger Durchlauf durch alle Trainingsdaten. Meist braucht ein Modell viele davon. Es sieht jedes Beispiel mehrmals und verbessert sich jedes Mal ein wenig.",
      "Bei großen Datenmengen rechnet man nicht alles auf einmal. Man nimmt kleine Päckchen, schätzt daraus das Gefälle und macht einen Schritt. Das ist ungenauer als ein Blick auf alles, aber viel schneller und funktioniert gut. Der Zufall der Päckchen hilft sogar, nicht in kleinen Mulden hängen zu bleiben.",
    ], alltag: "Vokabeln lernst du nicht, indem du das ganze Buch einmal liest. Du gehst Kartenstapel immer wieder durch. Jede Runde ist eine Epoche, jeder kleine Stapel ein Päckchen."},
    {h: "Überanpassung und Frühstopp", p: [
      "Der Verlust auf den Trainingsdaten sinkt fast immer weiter. Das heißt nicht, dass das Modell besser wird. Irgendwann lernt es Zufälle und Eigenheiten der Beispiele auswendig. Das ist [[ueberanpassung|Überanpassung]]. Auf neuen Daten wird es dann wieder schlechter.",
      "Deshalb beobachtet man den Verlust auf den Validierungsdaten, die nicht zum Lernen dienen. Steigt er, während der Trainingsverlust weiter fällt, ist der Punkt erreicht. Man hält an und nimmt den besten Stand. Das nennt man [[fruehstopp|Frühstopp]].",
    ], alltag: "Wer für eine Klausur alle alten Aufgaben samt Lösungen auswendig lernt, ist bei diesen perfekt. Kommt eine neue Aufgabe, fehlt das Verständnis. Die Übungsaufgaben sind das Training, die neue Aufgabe zeigt, ob du gelernt oder nur gepaukt hast."},
    {h: "Rechenaufwand und warum GPUs helfen", p: [
      "Jede Runde besteht aus sehr vielen einfachen Rechnungen: Zahlen multiplizieren und addieren, millionenfach. Sie hängen kaum voneinander ab und lassen sich gleichzeitig erledigen. Genau dafür ist eine [[gpu|GPU]] gebaut, die tausende Rechenwerke parallel nutzt. Ein normaler Prozessor hat wenige, dafür flexible Kerne.",
      "Darum läuft Training meist auf GPUs, und deshalb kann auch der Jetson Netze flott auswerten. Beim Auswerten, der [[inferenz|Inferenz]], ist der Aufwand viel kleiner als beim Training.",
    ], alltag: "Eine Pizzeria mit einem Meisterkoch, der jede Pizza komplett zubereitet, ist langsamer als eine Küche mit hundert Helfern, die je einen Handgriff machen. Die Helfer sind einfach, aber es sind viele. So arbeitet eine GPU."},
    {h: "Vortraining, Feinabstimmung, Kosten und Energie", p: [
      "Große Modelle trainiert man selten von null. Beim [[vortraining|Vortraining]] lernt ein Modell auf riesigen, allgemeinen Datenmengen die Grundlagen. Bei der [[feinabstimmung|Feinabstimmung]] passt man es mit wenigen, gezielten Beispielen an eine Aufgabe an. Das spart Zeit, Daten und Rechenleistung.",
      "Training kostet Rechenzeit und damit Strom. Je größer das Modell und je mehr Daten, desto mehr. Das Vortraining sehr großer Modelle ist aufwendig und liegt bei wenigen Anbietern. Eine Feinabstimmung kleinerer Modelle ist dagegen oft mit überschaubarem Aufwand machbar. Konkrete Zahlen hängen stark von Modell und Hardware ab und sollten für jedes Projekt neu geschätzt werden.",
    ], alltag: "Ein gelernter Koch muss für ein neues Restaurant nicht noch einmal Kochen lernen. Er lernt die Speisekarte. Vortraining ist die Ausbildung, Feinabstimmung die Einarbeitung."},
  ],
  mitnehmen: [
    "Der Verlust misst den Fehler. Training heißt, die Gewichte so zu verschieben, dass er sinkt.",
    "Gradientenabstieg geht in kleinen Schritten bergab. Die Lernrate legt die Schrittweite fest, zu groß und zu klein schaden beide.",
    "Beobachte die Validierungsdaten, um Überanpassung zu erkennen. Vortraining plus Feinabstimmung spart Aufwand.",
  ],
  quiz: [
    {frage: "Was misst der Verlust?",
     optionen: ["Wie viele Daten verloren gingen","Wie viele Parameter das Modell hat","Wie lange das Training dauert","Wie weit die Vorhersagen des Modells von den richtigen Antworten entfernt sind"],
     richtig: 3, erklaerung: "Der Verlust ist die Fehlerzahl, die beim Training klein werden soll. Wie die Entfernung zur Mitte beim Darts."},
    {frage: "Die Lernrate ist viel zu groß gewählt. Was ist wahrscheinlich?",
     optionen: ["Das Modell lernt sehr schnell und sehr genau", "Der Fehler springt hin und her, weil die Schritte über das Tal hinausschießen", "Das Modell ändert sich gar nicht", "Das Modell wird kleiner"],
     richtig: 1, erklaerung: "Zu große Schritte überspringen das Tal. Zu kleine dauern ewig. Die richtige Mitte findet man durch Ausprobieren."},
    {frage: "Der Trainingsverlust sinkt weiter, der Validierungsverlust steigt seit einiger Zeit. Was tust du?",
     optionen: ["Anhalten und den besten Stand nehmen, das Modell passt sich zu sehr an","Weitertrainieren, Training zählt am meisten","Die Validierungsdaten löschen","Die Lernrate verdoppeln"],
     richtig: 0, erklaerung: "Das ist das typische Zeichen für Überanpassung. Der Frühstopp nimmt den Stand mit dem besten Validierungsergebnis."},
    {frage: "Warum helfen GPUs beim Training?",
     optionen: ["Sie haben mehr Speicherplatz für Fotos","Sie verstehen Sprache besser","Sie erledigen sehr viele einfache Rechnungen gleichzeitig","Sie machen das Modell kleiner"],
     richtig: 2, erklaerung: "Training besteht aus Millionen gleichartiger Multiplikationen und Additionen, die parallel laufen können."},
    {frage: "Was ist der Vorteil von Vortraining plus Feinabstimmung?",
     optionen: ["Man braucht keine Daten mehr", "Man startet nicht bei null und kommt mit wenigen gezielten Beispielen und weniger Rechenaufwand zum Ziel", "Das Modell ist danach fehlerfrei", "Das Modell braucht keine GPU mehr"],
     richtig: 1, erklaerung: "Das Grundwissen ist schon da. Die Feinabstimmung ergänzt nur, was für deine Aufgabe fehlt."},
  ],
  weiter: ["bewertung", "neuronale-netze", "ml"],
},

bewertung: {
  typ: "lektion", gruppe: "Grundlagen", titel: "Wie gut ist ein Modell?", nav: "Bewertung", symbol: "check",
  kurz: "„95 Prozent richtig“ klingt nach einem guten Modell. Warum die Zahl allein täuschen kann, und welche Kennzahlen mehr sagen.",
  widget: "konfusionsmatrix",
  videos: ["bewertung-konfusionsmatrix"],
  abschnitte: [
    {h: "Warum „95 Prozent richtig“ täuschen kann", p: [
      "Die [[genauigkeit|Genauigkeit]] gibt den Anteil richtiger Antworten an. Sie ist leicht zu verstehen, aber sie wird unbrauchbar, wenn ein Ereignis selten ist. Ein Modell, das immer „alles in Ordnung“ sagt, liegt dann fast immer richtig und ist trotzdem wertlos.",
      "Rechenbeispiel: Von 1000 geprüften Fällen sind 10 echt auffällig. Ein Modell, das nie Alarm schlägt, hat 990 von 1000 richtig, also 99 Prozent. Gefunden hat es nichts.",
    ], alltag: [
      "Ein Rauchmelder, der nie piept, ist an 364 von 365 Tagen im Jahr „richtig“, weil es nur an einem Tag brennt. Du würdest ihn trotzdem nicht aufhängen.",
      "Ähnlich bei der Sicherheitskontrolle am Flughafen. Fast alle Koffer sind harmlos. Eine Anlage, die alles durchwinkt, hat nahezu 100 Prozent Genauigkeit und ist unbrauchbar.",
    ]},
    {h: "Die Konfusionsmatrix: vier Fälle", p: [
      "Wer wissen will, wie ein Modell wirklich liegt, zählt die Fälle nach zwei Fragen: Was war es wirklich, und was hat das Modell gesagt? Daraus entstehen vier Felder. Das ist die [[konfusionsmatrix|Konfusionsmatrix]].",
    ], tabelle: {
      beschriftung: "Vier Felder am Beispiel Spamfilter",
      kopf: ["Fall", "Wirklich", "Modell sagt", "Bedeutung"],
      zeilen: [
        ["Richtig positiv", "Spam", "Spam", "Treffer: Spam wurde aussortiert"],
        ["Falsch positiv", "Kein Spam", "Spam", "Fehlalarm: eine gute Mail ist im Spamordner"],
        ["Falsch negativ", "Spam", "Kein Spam", "Übersehen: Spam landet im Posteingang"],
        ["Richtig negativ", "Kein Spam", "Kein Spam", "Treffer: gute Mail kommt an"],
      ],
    }, merke: "„Positiv“ heißt nur: Das Modell schlägt an. Ob das gut oder schlecht ist, hängt von der Aufgabe ab.",
      alltag: "Ein medizinischer Schnelltest kennt dieselben vier Fälle: positiv und richtig, positiv und falsch, negativ und richtig, negativ und falsch. Wer sich nur einen Prozentwert merkt, übersieht, welcher Fehler wie oft vorkommt."},
    {h: "Durchgerechnet: ein Spamfilter", p: [
      "Beispielzahlen, die nur zum Rechnen dienen: Ein Filter prüft 1000 Mails. 100 sind Spam, 900 sind gute Mails. Er erwischt 90 der Spammails (richtig positiv) und übersieht 10 (falsch negativ). Von den guten Mails stuft er 18 fälschlich als Spam ein (falsch positiv), 882 gehen richtig durch (richtig negativ).",
      "Die Genauigkeit beträgt (90 + 882) von 1000, also 97,2 Prozent. Das klingt hervorragend. Die Matrix zeigt aber, dass 18 gute Mails weggefiltert wurden und 10 Spammails durchkamen.",
    ], alltag: "Stell dir vor, die 18 aussortierten Mails enthalten eine Bewerbung und eine Rechnung mit Frist. Der Prozentwert sagt nichts darüber, wie schlimm das ist. Erst die Matrix zeigt, wo die Fehler stecken, und deine Aufgabe zeigt, welche davon weh tun."},
    {h: "Precision und Recall in Worten", p: [
      "Zwei Fragen lassen sich getrennt beantworten.",
    ], liste: [
      "**[[precision|Precision]]:** Wenn das Modell anschlägt, wie oft stimmt das? Im Beispiel 90 von 108 Alarmen, also gut 83 Prozent. Niedrig bedeutet viele Fehlalarme.",
      "**[[recall|Recall]]:** Von allen echten Fällen, wie viele findet das Modell? Im Beispiel 90 von 100, also 90 Prozent. Niedrig bedeutet, dass viel übersehen wird.",
    ], alltag: "Du fischst mit einem Netz nach Forellen. Recall fragt: Wie viele der Forellen im See hast du gefangen? Precision fragt: Wie viele Fische im Netz sind wirklich Forellen? Ein sehr weites Netz fängt alle Forellen und viel Beifang. Ein enges Netz fängt nur Forellen, aber wenige.",
      tabelle: {
        beschriftung: "Kennzahlen im Überblick",
        kopf: ["Kennzahl", "Frage in Worten", "Im Spamfilter-Beispiel"],
        zeilen: [
          ["Genauigkeit", "Wie oft liegt das Modell insgesamt richtig?", "97,2 Prozent"],
          ["Precision", "Wie viele Alarme stimmen?", "gut 83 Prozent"],
          ["Recall", "Wie viele echte Fälle werden gefunden?", "90 Prozent"],
        ],
      }},
    {h: "Die Schwelle: Fehlalarme gegen Übersehenes", p: [
      "Viele Modelle geben keine feste Antwort, sondern einen Wert, etwa „Schimmel zu 70 Prozent wahrscheinlich“. Wo du die Grenze für „Alarm“ ziehst, ist die [[schwelle|Schwelle]]. Senkst du sie, schlägt das Modell öfter an: Recall steigt, Precision sinkt. Hebst du sie, ist es umgekehrt.",
      "Es gibt keine allgemein richtige Schwelle. Sie hängt davon ab, was ein Fehler kostet.",
    ], alltag: [
      "Ein Prüfdienst bewertet Fotos von Wänden auf Schimmel. Beispielzahlen: 20 von 200 Wänden sind betroffen. Bei niedriger Schwelle findet das Modell 19 davon, schlägt aber bei 30 gesunden Wänden grundlos an. Bei hoher Schwelle findet es nur 14 und warnt bei 3 gesunden Wänden.",
      "Welche Einstellung passt? Ist ein Prüfbesuch billig und übersehener Schimmel teuer, wählst du die niedrige Schwelle. Ist jeder Besuch aufwendig, nimmst du die höhere. Die Technik liefert nur die Auswahl, die Folgen bewertest du.",
    ]},
    {h: "Nur mit ungesehenen Daten testen", p: [
      "Jede Kennzahl sagt nur etwas, wenn sie auf Daten berechnet wird, die das Modell nie gesehen hat. Auf Trainingsdaten sehen fast alle Modelle gut aus, weil sie die Beispiele kennen. Darum bleiben Testdaten bis zum Schluss unberührt (siehe {{daten|Daten, der Rohstoff}}).",
      "Achte außerdem darauf, dass die Testdaten dem echten Einsatz ähneln. Ein Modell, das mit Fotos aus dem Labor getestet wurde, kann in der Halle mit schlechtem Licht deutlich schlechter sein.",
    ], alltag: "Wer die Fahrprüfung nur auf dem leeren Übungsplatz ablegt, weiß danach nicht, wie er im Berufsverkehr fährt. Die Prüfung muss dem echten Einsatz ähneln."},
    {h: "Der Vergleich mit dem heutigen Ablauf", p: [
      "Eine Zahl wie „90 Prozent Recall“ ist erst nützlich, wenn du weißt, was ohne Modell passiert. Diese Vergleichsmarke heißt [[baseline|Baseline]]. Das kann ein einfaches Verfahren sein, eine feste Regel oder der heutige Ablauf mit Menschen.",
      "Prüfen zwei Menschen heute 85 von 100 Fällen richtig, ist ein Modell mit 90 interessant. Schafft ein einfacher Zähler schon 88, lohnt der Aufwand womöglich nicht. Miss den Vergleich auf denselben Daten und mit denselben Kennzahlen.",
    ], alltag: "Ein neues Navi mit „95 Prozent pünktlich“ klingt gut. Wenn du aber mit der alten Landkarte genauso pünktlich ankommst, hat sich nichts verbessert."},
    {h: "Der Mensch in der Schleife", p: [
      "Kein Modell trifft immer. Deshalb entscheidet man, was mit unsicheren Fällen passiert. Ein verbreitetes Muster: Das Modell erledigt klare Fälle selbst, unklare gehen an eine Person ([[mensch-schleife|Mensch in der Schleife]]). Die Personen werten die Ergebnisse aus, und aus ihren Korrekturen entstehen neue Trainingsdaten.",
      "Die Gesamtleistung des Ablaufs zählt, nicht nur die des Modells: Wie viele Fälle gehen an Menschen, wie viele Fehler schlüpfen durch, und wie schnell fällt Schlechtes auf?",
    ], alltag: "An einer Selbstbedienungskasse läuft der Einkauf meist von allein. Bei Alkohol oder einem Fehler kommt eine Mitarbeiterin dazu und entscheidet. Der Ablauf funktioniert, weil klar ist, wann sie gerufen wird."},
  ],
  mitnehmen: [
    "Bei seltenen Ereignissen täuscht die Genauigkeit. Die Konfusionsmatrix zeigt die vier Fälle und damit, wo Fehler stecken.",
    "Precision fragt, wie viele Alarme stimmen. Recall fragt, wie viele echte Fälle gefunden werden. Die Schwelle verschiebt das Gleichgewicht.",
    "Teste mit ungesehenen Daten, vergleiche mit dem heutigen Ablauf und plane, wer unklare Fälle entscheidet.",
  ],
  quiz: [
    {frage: "Von 1000 Fällen sind 10 auffällig. Ein Modell sagt immer „unauffällig“. Was stimmt?",
     optionen: ["Genauigkeit 50 Prozent, Recall 100 Prozent","Genauigkeit 99 Prozent, Recall 0 Prozent","Genauigkeit 99 Prozent, Recall 100 Prozent","Genauigkeit 0 Prozent, Recall 0 Prozent"],
     richtig: 1, erklaerung: "990 von 1000 sind richtig, aber kein einziger echter Fall wird gefunden. Bei seltenen Ereignissen ist Recall wichtiger als Genauigkeit."},
    {frage: "Was ist ein falsch negativer Fall beim Spamfilter?",
     optionen: ["Eine gute Mail landet im Spamordner","Eine Spammail wird aussortiert","Eine gute Mail kommt an","Eine Spammail kommt in den Posteingang"],
     richtig: 3, erklaerung: "Falsch negativ heißt: Es war ein echter Fall, das Modell hat ihn übersehen. Die gute Mail im Spamordner ist dagegen falsch positiv."},
    {frage: "Ein Modell hat hohe Precision und niedrigen Recall. Was bedeutet das?",
     optionen: ["Wenn es anschlägt, stimmt es meist, aber es übersieht viele echte Fälle","Es schlägt oft an, aber meist unnötig","Es liegt bei allem richtig","Es lernt zu langsam"],
     richtig: 0, erklaerung: "Hohe Precision: wenige Fehlalarme. Niedriger Recall: viele echte Fälle werden nicht gefunden."},
    {frage: "Du senkst die Schwelle. Was ändert sich in der Regel?",
     optionen: ["Precision und Recall steigen beide","Recall steigt, Precision sinkt, weil das Modell öfter anschlägt","Nichts, die Schwelle ist nur Optik","Recall sinkt, Precision steigt"],
     richtig: 1, erklaerung: "Mit niedrigerer Schwelle fängst du mehr echte Fälle, nimmst aber auch mehr Fehlalarme in Kauf."},
    {frage: "Warum braucht man eine Baseline?",
     optionen: ["Damit das Modell schneller trainiert","Um Daten zu löschen","Um zu sehen, ob das Modell besser ist als das, was ohnehin schon läuft","Um die Schwelle festzulegen"],
     richtig: 2, erklaerung: "Eine Kennzahl allein hat keinen Maßstab. Erst der Vergleich mit dem heutigen Ablauf oder einer einfachen Regel zeigt den Nutzen."},
  ],
  weiter: ["verzerrung-ethik", "training", "daten"],
},

"verzerrung-ethik": {
  typ: "lektion", gruppe: "Grundlagen", titel: "Fairness, Verzerrung und Verantwortung", nav: "Fairness und Verantwortung", symbol: "info",
  kurz: "Ein Modell wiederholt, was in seinen Daten steckt, auch das Unfaire. Wie entsteht das, wie erkennst du es, und wer trägt die Verantwortung?",
  videos: ["verzerrung-fairness"],
  abschnitte: [
    {h: "Was Verzerrung bedeutet", p: [
      "Ein Modell lernt Muster aus Beispielen. Es kann nicht unterscheiden, welche Muster erwünscht und welche unfair sind. Bilden die Beispiele die Wirklichkeit einseitig ab oder haben Menschen früher unfair entschieden, übernimmt das Modell das. Diese Schlagseite heißt [[verzerrung|Verzerrung]]. Im Englischen sagt man Bias.",
      "Wichtig: Ein Modell hat keine Absicht. Das Problem liegt in den Daten, in der Aufgabe und im Einsatz, also an Stellen, die Menschen gestalten.",
    ], alltag: "Eine Umfrage, die nur morgens vor einem Bahnhof stattfindet, erreicht Pendler. Wer abends arbeitet oder zu Hause bleibt, kommt nicht vor. Die Ergebnisse sind sauber ausgezählt und trotzdem schief. Das Zählen war korrekt, die Auswahl nicht."},
    {h: "Vier Wege, auf denen Verzerrung entsteht", p: [
      "Die Quellen lassen sich grob in vier Gruppen sortieren. Meist wirken mehrere zusammen.",
    ], tabelle: {
      beschriftung: "Quellen von Verzerrung",
      kopf: ["Quelle", "Was passiert", "Beispiel"],
      zeilen: [
        ["Daten", "Gruppen sind unterschiedlich gut vertreten oder erfasst", "Wenige Fotos älterer Menschen im Trainingsbestand"],
        ["Auswahl", "Die Stichprobe entsteht auf einem Weg, der manche ausschließt", "Befragung nur online"],
        ["Etiketten", "Die „richtigen“ Antworten stammen von Menschen mit Vorurteilen oder Fehlern", "Frühere Einstellungsentscheidungen als Maßstab"],
        ["Rückkopplung", "Die Ausgabe des Modells beeinflusst, welche Daten später entstehen", "Mehr Kontrollen in einem Viertel führen zu mehr Funden dort, was wieder mehr Kontrollen auslöst"],
      ],
    }, merke: "Ein Modell, das auf der Vergangenheit lernt, schreibt die Vergangenheit fort. Das ist ohne Gegensteuern nicht neutral."},
    {h: "Beispiel Bewerberauswahl", p: [
      "Ein Unternehmen lässt ein Modell Bewerbungen vorsortieren. Als Etikett dienen frühere Einstellungen: „eingeladen“ oder „abgelehnt“. Waren frühere Entscheidungen einseitig, lernt das Modell diese Einseitigkeit. Es erkennt Muster in Lebensläufen, die mit früheren Auswahlen zusammenhingen, etwa bestimmte Hochschulen, Berufswege oder Lücken im Lebenslauf.",
      "Das Modell nimmt dann Menschen aus dem Rennen, ohne dass jemand es so wollte. Weil es schnell und in Menge arbeitet, wiederholt sich der Fehler tausendfach.",
    ], alltag: "Ein Personalchef, der seit Jahren Menschen einstellt, die ihm ähnlich sind, bildet ein Muster. Gibt man einem Neuling seine Akten und sagt „lerne daraus“, übernimmt der Neuling das Muster samt Vorurteil."},
    {h: "Beispiel Kreditscoring und Stellvertretermerkmale", p: [
      "Auch wenn man ein sensibles Merkmal wie Herkunft oder Geschlecht weglässt, kann ein Modell es über Stellvertreter rekonstruieren. Postleitzahl, Vorname oder Einkaufsverhalten hängen oft mit solchen Merkmalen zusammen. Das Modell nutzt sie, weil sie in den Daten Vorhersagekraft haben.",
      "Das Weglassen eines Merkmals genügt also nicht. Man muss die Ergebnisse nach Gruppen ansehen und fragen, ob einzelne Gruppen systematisch schlechter wegkommen.",
    ], alltag: "Ein Versicherer verzichtet darauf, nach der Herkunft zu fragen, rechnet aber mit der Wohngegend. Wenn bestimmte Gruppen in bestimmten Gegenden wohnen, kommt die Information durch die Hintertür herein."},
    {h: "Beispiel Gesichtserkennung", p: [
      "Untersuchungen zu Gesichtserkennung haben gezeigt, dass die Fehlerquote zwischen Personengruppen unterschiedlich ausfallen kann, zum Beispiel nach Hautfarbe und Geschlecht. Eine häufige Ursache sind Trainingsdaten, in denen manche Gruppen deutlich seltener vorkommen.",
      "Eine Gesamtgenauigkeit verdeckt das. Liegt sie hoch, aber eine kleine Gruppe wird oft falsch erkannt, merkt es nur, wer die Ergebnisse getrennt nach Gruppen auswertet. Hat eine Fehlentscheidung Folgen, etwa eine falsche Verdächtigung, trifft sie diese Gruppe überproportional.",
    ]},
    {h: "Erklärbarkeit und Transparenz", p: [
      "Wer von einer Entscheidung betroffen ist, will wissen, warum. Bei Netzen ist das schwer, weil sie [[blackbox|Blackboxes]] sind. Die Anforderung bleibt trotzdem bestehen: Je folgenreicher die Entscheidung, desto mehr Begründung braucht sie.",
      "Mehrere Hebel helfen. Bei wichtigen Entscheidungen kann man einfachere, besser erklärbare Verfahren wählen. Man kann festhalten, welche Daten und welche Version eines Modells entschieden haben. Und man kann Betroffenen sagen, dass ein Modell beteiligt war und an wen sie sich wenden können.",
    ], alltag: "Ein Arzt, der „Sie haben das, weil das Gerät es sagt“ antwortet, überzeugt niemanden. Er nennt Messwerte und Gründe. Ähnlich erwartet man von einem System, dass sich Entscheidungen nachvollziehen lassen."},
    {h: "Verantwortung und menschliche Entscheidung", p: [
      "Ein Modell kann nicht haften. Verantwortlich sind Menschen und Organisationen: die, die es einsetzen, und die, die es liefern. Wer ein Modell in einen Ablauf einbaut, trägt Verantwortung für die Folgen, auch wenn er das Modell nicht selbst gebaut hat.",
      "Deshalb gehört vor den Einsatz die Klärung: Wer wird informiert, wenn etwas schiefgeht? Wer darf ein Ergebnis überstimmen? Wo wird festgehalten, was entschieden wurde? Ohne diese Antworten bleibt bei einem Fehler unklar, wer ihn beheben muss.",
      "Hat eine Entscheidung Folgen für Menschen, etwa bei Einstellung, Kredit, Leistung oder Überwachung, sollte ein Modell vorbereiten und nicht allein entscheiden. Die Person, die es überstimmen kann, braucht dazu Zeit, Wissen und die Erlaubnis. Sonst drückt sie nur auf „Bestätigen“. Für bestimmte Entscheidungen verlangt das Recht sogar menschliche Beteiligung. Mehr dazu auf der Seite {{recht|Recht und Regeln}}.",
    ], alltag: "In einem Flugzeug steuert der Autopilot, doch die Pilotin trägt die Verantwortung und kann jederzeit eingreifen. Sie ist geschult und hat die Befugnis. Genau so sollte es beim Einsatz von Modellen sein, die über Menschen mitentscheiden."},
    {h: "Prüfen vor dem Einsatz: eine Fragenliste", p: [
      "Diese Fragen helfen vor jedem Einsatz, besonders bei Entscheidungen über Menschen:",
    ], liste: [
      "Wofür genau wird das Modell eingesetzt, und welche Folgen hat ein Fehler für wen?",
      "Woher stammen die Daten, und wer fehlt darin?",
      "Wurden die Ergebnisse getrennt nach Gruppen ausgewertet, und gibt es auffällige Unterschiede?",
      "Welche Stellvertretermerkmale könnten sensible Merkmale ersetzen?",
      "Können Betroffene erfahren, dass ein Modell beteiligt war, und Einspruch einlegen?",
      "Wer entscheidet im Zweifel, und kann diese Person das Ergebnis wirklich überstimmen?",
      "Wie wird das Modell nach dem Start beobachtet, und wer greift bei Auffälligkeiten ein?",
    ], alltag: "Ein Pilot geht vor jedem Flug eine Checkliste durch, obwohl er das Flugzeug kennt. Die Liste ersetzt keine Erfahrung, sie verhindert, dass im Alltag Wichtiges untergeht."},
  ],
  mitnehmen: [
    "Ein Modell wiederholt Muster aus seinen Daten, auch unfaire. Verzerrung entsteht durch Daten, Auswahl, Etiketten und Rückkopplung.",
    "Ein Merkmal wegzulassen reicht nicht, denn Stellvertreter schleichen sich ein. Ergebnisse gehören nach Gruppen ausgewertet.",
    "Menschen und Organisationen tragen die Verantwortung. Bei Folgen für Menschen entscheidet ein Mensch, der wirklich überstimmen kann.",
  ],
  quiz: [
    {frage: "Ein Modell sortiert Bewerbungen vor und lernt aus früheren Einstellungen. Was ist das Risiko?",
     optionen: ["Es lernt zu langsam","Es kann keine Texte lesen","Es übernimmt Einseitigkeiten früherer Entscheidungen","Es braucht keine Daten"],
     richtig: 2, erklaerung: "Die früheren Entscheidungen sind das Etikett. Waren sie einseitig, lernt das Modell diese Einseitigkeit mit."},
    {frage: "Ein Kreditmodell bekommt kein Geschlecht und keine Herkunft, benachteiligt aber trotzdem eine Gruppe. Warum kann das passieren?",
     optionen: ["Weil Stellvertretermerkmale wie die Postleitzahl die Information mittragen","Weil das Modell Absicht hat","Weil weniger Daten immer unfair sind","Weil Banken das so wollen"],
     richtig: 0, erklaerung: "Merkmale hängen oft zusammen. Das Modell nutzt, was Vorhersagekraft hat, auch wenn das ein Stellvertreter ist."},
    {frage: "Ein Gesichtserkenner hat insgesamt 98 Prozent Genauigkeit. Was lässt sich daraus sicher sagen?",
     optionen: ["Alle Gruppen werden gleich gut erkannt", "Nichts über einzelne Gruppen, dafür muss man getrennt auswerten", "Das Modell ist fair", "Das Modell braucht keine Kontrolle"],
     richtig: 1, erklaerung: "Eine Gesamtzahl kann Unterschiede zwischen Gruppen verdecken. Erst die getrennte Auswertung zeigt sie."},
    {frage: "Was meint Rückkopplung bei Verzerrung?",
     optionen: ["Das Modell gibt Rückmeldung an den Nutzer","Das Modell löscht Daten","Das Modell wird im Kreis trainiert","Die Ausgabe des Modells beeinflusst, welche Daten später entstehen, und verstärkt so das Muster"],
     richtig: 3, erklaerung: "Beispiel: Mehr Kontrollen an einem Ort bringen dort mehr Funde, die wieder mehr Kontrollen begründen. Das Muster schaukelt sich auf."},
    {frage: "Wer ist für Fehler eines eingesetzten Modells verantwortlich?",
     optionen: ["Die Menschen und Organisationen, die es einsetzen und liefern","Niemand, es ist ein Zufall","Das Modell selbst","Nur die Person, die das Ergebnis liest"],
     richtig: 0, erklaerung: "Ein Modell kann nicht haften. Die Zuständigkeit muss vor dem Einsatz geklärt sein."},
  ],
  weiter: ["recht", "bewertung", "daten"],
},

recht: {
  typ: "lektion", gruppe: "Grundlagen", titel: "Recht und Regeln im Überblick", nav: "Recht und Regeln", symbol: "info",
  kurz: "Welche Regeln gelten, wenn du KI einsetzt? Ein Überblick über die Grundgedanken, ausdrücklich keine Rechtsberatung.",
  videos: ["recht-ueberblick"],
  abschnitte: [
    {h: "Wichtig vorab: keine Rechtsberatung", p: [
      "Diese Seite erklärt Begriffe und Grundgedanken. Sie ersetzt keine Rechtsberatung. Gesetze ändern sich, Auslegungen ebenfalls, und im Einzelfall kommt es auf die Umstände an. Für ein echtes Projekt sprichst du mit der Datenschutzbeauftragten oder einer Anwältin, und du prüfst aktuelle, offizielle Quellen.",
    ], merke: "Diese Seite ist keine Rechtsberatung. Verbindlich sind nur die Gesetzestexte und die Auskunft von Fachleuten."},
    {h: "Datenschutz-Grundverordnung in Grundzügen", p: [
      "Die [[dsgvo|Datenschutz-Grundverordnung]] gilt in der Europäischen Union für den Umgang mit [[personenbezogen|personenbezogenen Daten]]. Das sind Angaben, die sich auf eine Person beziehen lassen: Name, Foto, Stimme, Kennzahl, auch Kombinationen von Merkmalen. Sie gilt, sobald solche Daten verarbeitet werden, auch beim Training oder Betrieb eines Modells.",
      "Die Grundidee: Du darfst solche Daten nur verarbeiten, wenn du dafür eine Rechtsgrundlage hast, etwa eine Einwilligung, einen Vertrag oder ein berechtigtes Interesse. Ohne Grundlage ist die Verarbeitung nicht erlaubt.",
    ], alltag: "Ein Handwerksbetrieb darf die Adresse eines Kunden speichern, um die Rechnung zu schicken. Das ist durch den Vertrag gedeckt. Derselbe Betrieb darf die Adresse nicht einfach an Werbefirmen weitergeben."},
    {h: "Die zentralen Grundsätze", p: [
      "Ein paar Grundsätze ziehen sich durch alle Projekte:",
    ], tabelle: {
      beschriftung: "Datenschutzgrundsätze in einfacher Sprache",
      kopf: ["Grundsatz", "Bedeutung", "Beispiel im KI-Projekt"],
      zeilen: [
        ["[[zweckbindung|Zweckbindung]]", "Daten werden für einen festgelegten Zweck erhoben und nicht für anderes genutzt", "Kundendaten aus Verträgen nicht still zum Training eines Werbemodells verwenden"],
        ["[[datenminimierung|Datenminimierung]]", "Nur so viel wie nötig", "Gesichter unkenntlich machen, wenn nur Personen gezählt werden sollen"],
        ["Transparenz", "Betroffene erfahren, was mit ihren Daten geschieht", "Hinweisschild und verständliche Datenschutzinformation"],
        ["Richtigkeit", "Daten sollen stimmen und aktuell sein", "Falsche Etiketten korrigieren"],
        ["Speicherbegrenzung", "Daten nur so lange wie nötig", "Löschfristen für Trainings- und Protokolldaten"],
        ["Sicherheit", "Schutz vor Verlust und fremdem Zugriff", "Zugriffsrechte, Verschlüsselung"],
      ],
    }, alltag: "Du gibst dem Handwerker den Wohnungsschlüssel, damit er die Heizung repariert. Er soll nur diese Wohnung betreten (Zweck), nur das Nötige anfassen (Minimierung), und den Schlüssel danach zurückgeben (Speicherbegrenzung). Genau so gehst du mit Daten um."},
    {h: "Dienstleister und Rechte Betroffener", p: [
      "Setzt du einen externen Dienst ein, der in deinem Auftrag Daten verarbeitet, liegt eine [[auftragsverarbeitung|Auftragsverarbeitung]] vor. Dafür braucht es einen Vertrag, der festlegt, was der Dienstleister darf. Du bleibst für die Daten verantwortlich. Werden Daten außerhalb der EU verarbeitet, gelten zusätzliche Anforderungen.",
      "Betroffene haben Rechte. Dazu gehören grob: Auskunft, was über sie gespeichert ist, Berichtigung falscher Daten, Löschung unter bestimmten Bedingungen und Widerspruch. Außerdem gibt es einen Schutz davor, dass Entscheidungen mit erheblicher Wirkung ausschließlich automatisiert fallen, mit Ausnahmen. Für riskante Verarbeitungen kann eine Datenschutz-Folgenabschätzung nötig sein.",
    ], alltag: "Gibst du Wäsche in eine Reinigung, bleibt es deine Wäsche. Die Reinigung darf sie nur so behandeln, wie ihr es abgesprochen habt. Mit Auftragsverarbeitern ist es ähnlich: Sie arbeiten nach deiner Weisung, du haftest für das Ergebnis mit."},
    {h: "Die EU-KI-Verordnung: Risiko bestimmt die Pflichten", p: [
      "Die EU-KI-Verordnung regelt den Einsatz von KI-Systemen mit einem risikobasierten Ansatz. Je größer das Risiko für Menschen und Grundrechte, desto strenger die Regeln. Sie unterscheidet grob vier Stufen.",
    ], tabelle: {
      beschriftung: "Risikostufen im Überblick",
      kopf: ["Stufe", "Grundgedanke", "Beispiele (grob)"],
      zeilen: [
        ["Verboten", "Praktiken, die als unannehmbar gelten", "Bestimmte Formen von Social Scoring, gezielte Manipulation verletzlicher Gruppen"],
        ["Hochrisiko", "Erlaubt, aber mit strengen Pflichten", "KI in Personalauswahl, Kreditwürdigkeit, Bildung, kritischer Infrastruktur"],
        ["Transparenzpflichten", "Nutzer sollen wissen, dass sie mit KI zu tun haben", "Chatbots, künstlich erzeugte Bilder und Videos"],
        ["Minimales Risiko", "Kaum zusätzliche Pflichten", "Spamfilter, einfache Spielelemente"],
      ],
    }},
    {h: "Pflichten wachsen mit dem Risiko", p: [
      "Bei Hochrisiko-Systemen verlangt die Verordnung unter anderem ein Risikomanagement, geprüfte Datenqualität, Dokumentation, Protokollierung, menschliche Aufsicht und Genauigkeit sowie Robustheit. Für Anbieter kommen weitere Pflichten hinzu als für Betreiber, die ein Produkt nur einsetzen. Auch für sehr große, vielseitige Modelle gibt es eigene Vorgaben.",
      "Fristen, Einzelheiten und ergänzende Leitlinien ändern sich noch. Deshalb steht hier nur das Prinzip. Für ein Projekt prüfst du die aktuelle Fassung und aktuelle Hinweise der zuständigen Stellen. Dazu zählt auch, ob dein Einsatz überhaupt unter eine Stufe fällt und ob die Beschäftigten ausreichend geschult sind.",
    ], alltag: "Ein Elektriker braucht für eine Steckdose weniger Prüfungen als für einen Aufzug oder eine Hochspannungsleitung. Je größer der mögliche Schaden, desto strenger die Vorschriften. Die KI-Verordnung folgt demselben Gedanken."},
    {h: "Urheberrecht: offene Fragen", p: [
      "Zwei Fragen sind noch nicht überall geklärt. Erstens: Dürfen urheberrechtlich geschützte Werke zum Training von Modellen genutzt werden, und unter welchen Bedingungen? Zweitens: Wem gehören Inhalte, die ein Modell erzeugt, und wann entsteht überhaupt ein Schutz? Dazu kommen Fälle, in denen Ausgaben geschützten Werken ähneln.",
      "Gerichte und Gesetzgeber beschäftigen sich damit, und die Lage kann je nach Land verschieden sein. Für den Alltag heißt das: Prüfe bei geschützten Inhalten, woher die Daten stammen und welche Lizenzen gelten. Kennzeichne erzeugte Inhalte, wo es gefordert wird, und lass Wichtiges prüfen.",
    ], alltag: "Ein Koch lernt aus hundert Kochbüchern und entwickelt eigene Rezepte. Das ist erlaubt. Ob dasselbe gilt, wenn ein Modell Millionen Bücher verarbeitet und Texte im Stil bestimmter Autoren schreibt, ist genau die offene Frage. Der Vergleich hinkt, weil ein Modell Texte in einem Umfang aufnimmt, den kein Mensch schaffen würde."},
    {h: "Im Betrieb: Dokumentation und Zuständigkeiten", p: [
      "Gute Ordnung hilft bei Recht und Praxis gleichermaßen. Halte fest, wofür ein System eingesetzt wird, welche Daten es nutzt, welche Version läuft, wer es betreut und wie Fehler gemeldet werden. Ein Verzeichnis der Verarbeitungen, eine kurze Beschreibung je Modell und klare Ansprechpartner reichen für den Anfang weit.",
      "Lege fest, wer Auskunftsanfragen beantwortet, wer Vorfälle meldet und wer ein Modell abschalten darf. Das Abschalten ist wichtig: Ein System, das man nicht stoppen kann, ist ein Risiko.",
    ], alltag: "Ein Hausmeister weiß, wo der Hauptschalter und das Wasserventil sind. Das steht in einem Plan an der Tür. Bei einem Rohrbruch sucht niemand erst."},
  ],
  grenzen: [
    "Diese Seite ist keine Rechtsberatung und kann keine Prüfung des Einzelfalls ersetzen.",
    "Gesetze, Fristen und Auslegungen ändern sich. Prüfe immer aktuelle, offizielle Quellen und frage Fachleute.",
    "Hier fehlen bewusst Paragrafen, Strafhöhen und Fristen, weil sie sich ändern.",
  ],
  mitnehmen: [
    "Personenbezogene Daten brauchen eine Rechtsgrundlage, einen Zweck und Sparsamkeit. Dienstleister brauchen einen Auftragsvertrag.",
    "Die EU-KI-Verordnung ordnet Systeme nach Risiko. Je höher es ist, desto mehr Pflichten gelten. Einzelheiten ändern sich, also immer aktuelle Quellen prüfen.",
    "Urheberrecht bei Trainingsdaten und erzeugten Inhalten ist teils offen. Dokumentation und klare Zuständigkeiten helfen im Betrieb.",
  ],
  quiz: [
    {frage: "Was sind personenbezogene Daten?",
     optionen: ["Nur Name und Adresse","Daten, die eine Person selbst veröffentlicht","Nur Daten, die ein Mensch eingibt","Alle Angaben, die sich auf eine Person beziehen lassen, auch Foto, Stimme oder Kombinationen von Merkmalen"],
     richtig: 3, erklaerung: "Entscheidend ist, ob man eine Person damit erkennen oder erreichen kann, direkt oder über Kombinationen."},
    {frage: "Was heißt Zweckbindung?",
     optionen: ["Daten werden nur gesammelt, wenn man sie verkaufen will","Daten müssen zweimal gespeichert werden","Daten werden für einen festgelegten Zweck erhoben und nicht still für etwas anderes verwendet","Nur Behörden dürfen Daten nutzen"],
     richtig: 2, erklaerung: "Wer Daten für Rechnungen erhebt, darf sie nicht ohne Weiteres für Werbung oder Modelltraining verwenden. Der neue Zweck braucht eine eigene Prüfung."},
    {frage: "Was bedeutet risikobasierter Ansatz der KI-Verordnung?",
     optionen: ["Je höher das Risiko für Menschen und Grundrechte, desto strenger die Pflichten","Jede KI muss gleich streng geprüft werden","Nur große Firmen müssen etwas tun","Risiko wird durch Abstimmung festgelegt"],
     richtig: 0, erklaerung: "Die Verordnung ordnet Systeme grob in Stufen ein, von verboten über Hochrisiko bis minimal. Die Pflichten wachsen mit der Stufe."},
    {frage: "Du nutzt einen externen Dienst, der in deinem Auftrag Kundendaten verarbeitet. Was brauchst du in der Regel?",
     optionen: ["Nichts, der Dienst ist selbst verantwortlich", "Einen Vertrag zur Auftragsverarbeitung", "Eine Genehmigung des Finanzamts", "Eine Kopie der Daten für den Dienst"],
     richtig: 1, erklaerung: "Du bleibst verantwortlich. Der Vertrag legt fest, was der Dienst mit den Daten darf."},
    {frage: "Wie solltest du mit den Fragen zum Urheberrecht bei Trainingsdaten umgehen?",
     optionen: ["Sie sind eindeutig geklärt, kein Handlungsbedarf","Alles Erzeugte gehört automatisch dir","Sie sind teils offen: Herkunft und Lizenzen prüfen, Rat einholen, aktuelle Rechtslage beachten","Jede Nutzung ist verboten"],
     richtig: 2, erklaerung: "Rechtslage und Rechtsprechung entwickeln sich. Prüfe Quellen und Lizenzen und lass Wichtiges rechtlich bewerten."},
  ],
  weiter: ["verzerrung-ethik", "daten", "business"],
},

},

glossar: {
  merkmal: ["Merkmal", "Eine Eigenschaft eines Beispiels, an der sich ein Modell orientiert, etwa Baujahr und Kilometerstand eines Autos."],
  strukturiert: ["Strukturierte Daten", "Daten in einem festen Raster, etwa Tabellen mit benannten Spalten."],
  unstrukturiert: ["Unstrukturierte Daten", "Daten ohne festes Raster, etwa Bilder, freier Text und Ton. Die Information steckt im Inhalt."],
  dublette: ["Dublette", "Ein Beispiel, das mehrfach in den Daten steckt. Es verzerrt das Training und macht Tests zu gut."],
  verzerrung: ["Verzerrung (Bias)", "Eine systematische Schlagseite im Modell, die aus einseitigen Daten, Etiketten oder Auswahl entsteht und bestimmte Gruppen benachteiligen kann."],
  trainingsdaten: ["Trainingsdaten", "Der Teil der Daten, mit dem das Modell seine Zahlen einstellt."],
  validierung: ["Validierungsdaten", "Daten zum Vergleichen und Einstellen während des Trainings. Das Modell lernt nicht direkt daraus."],
  testdaten: ["Testdaten", "Daten, die bis zum Schluss unberührt bleiben und die ehrliche Endnote vor dem Einsatz liefern."],
  personenbezogen: ["Personenbezogene Daten", "Angaben, die sich auf eine Person beziehen lassen, etwa Name, Foto, Stimme oder eine Kombination von Merkmalen."],
  neuron: ["Neuron", "Eine kleine Rechenstelle im Netz: Eingaben mal Gewichte, Summe, Verschiebung, Aktivierung."],
  gewicht: ["Gewicht", "Eine Zahl, die festlegt, wie stark eine Eingabe in ein Neuron zählt. Gewichte werden beim Training eingestellt."],
  aktivierung: ["Aktivierung", "Die Regel, mit der ein Neuron aus seiner Summe die Ausgabe macht, zum Beispiel eine Schwelle oder ein gleitender Wert."],
  schicht: ["Schicht", "Eine Gruppe von Neuronen, die nebeneinander rechnen. Die Ausgaben einer Schicht sind die Eingaben der nächsten."],
  blackbox: ["Blackbox", "Ein System, dessen innere Entscheidung sich schwer nachvollziehen lässt, obwohl man Ein- und Ausgabe sieht."],
  verlust: ["Verlust", "Eine Zahl, die misst, wie weit die Vorhersagen des Modells von den richtigen Antworten entfernt sind. Training soll sie senken."],
  gradient: ["Gradient", "Die Richtung des stärksten Anstiegs des Verlusts. Man geht in die Gegenrichtung, um ihn zu senken."],
  lernrate: ["Lernrate", "Schrittweite beim Nachjustieren der Gewichte. Zu groß springt man über das Ziel, zu klein dauert es ewig."],
  epoche: ["Epoche", "Ein vollständiger Durchlauf durch alle Trainingsdaten."],
  fruehstopp: ["Frühstopp", "Das Training anhalten, sobald der Fehler auf den Validierungsdaten wieder steigt, und den besten Stand nehmen."],
  vortraining: ["Vortraining", "Erstes, breites Training eines Modells auf sehr großen allgemeinen Datenmengen."],
  feinabstimmung: ["Feinabstimmung", "Zusätzliches, kurzes Training eines vortrainierten Modells mit gezielten Beispielen für eine Aufgabe."],
  genauigkeit: ["Genauigkeit", "Der Anteil aller Antworten, die richtig sind. Bei seltenen Ereignissen irreführend."],
  konfusionsmatrix: ["Konfusionsmatrix", "Tabelle mit den vier Fällen richtig positiv, falsch positiv, falsch negativ und richtig negativ."],
  precision: ["Precision", "Von allen Alarmen des Modells der Anteil, der wirklich stimmt."],
  recall: ["Recall", "Von allen echten Fällen der Anteil, den das Modell findet."],
  schwelle: ["Schwelle", "Der Wert, ab dem ein Modell „Alarm“ meldet. Senken: mehr Funde und mehr Fehlalarme."],
  baseline: ["Baseline", "Vergleichsmarke: das Ergebnis des heutigen Ablaufs oder eines einfachen Verfahrens, an dem man ein Modell misst."],
  "mensch-schleife": ["Mensch in der Schleife", "Ein Ablauf, in dem das Modell vorbereitet und Menschen unklare oder folgenreiche Fälle entscheiden."],
  dsgvo: ["Datenschutz-Grundverordnung", "EU-Regelwerk für den Umgang mit personenbezogenen Daten. Es verlangt unter anderem Rechtsgrundlage, Zweckbindung und Transparenz."],
  zweckbindung: ["Zweckbindung", "Daten dürfen nur für den Zweck genutzt werden, für den sie erhoben wurden."],
  datenminimierung: ["Datenminimierung", "Es werden nur so viele personenbezogene Daten erhoben, wie für den Zweck nötig sind."],
  auftragsverarbeitung: ["Auftragsverarbeitung", "Ein Dienstleister verarbeitet Daten nach deiner Weisung. Dafür braucht es einen Vertrag, die Verantwortung bleibt bei dir."],
},

gruppen: [
  {name: "Grundlagen", seiten: ["daten", "neuronale-netze", "training", "bewertung", "verzerrung-ethik", "recht"]},
],

});
