/* Seite "KI zu Hause: Was Eltern wissen sollten" (Gruppe Medienkompetenz). Du-Form, bildzentriert nach docs/visuals.md.
   Nur belegte Aussagen: Seite "Ist das sicher?" (content-laien.js), "Information für Eltern" (content-schule.js),
   Medienseiten (content-medien.js), Chat-Aufruf in app/app.py (kein eigener Filter vor dem Sprachmodell).
   Die Seite schule-eltern bleibt der Brief für den Schuleinsatz (Sie-Form) und verweist hierher.
   Enthält außerdem die Seiten "Zusammen ausprobieren" (Anleitung für zwei) und "Bildschirmzeit". */
(function () {

const S = {};

S["eltern-zuhause"] = {
  nav: "Eltern zu Hause", typ: "lektion", gruppe: "Medienkompetenz", titel: "KI zu Hause: Was Eltern wissen sollten", symbol: "users",
  rechtslinks: true,
  downloads: [{text: "Kartenset Echt oder KI?", sub: "12 Bildkarten, 2 Seiten A4, zum Ausschneiden und gemeinsam Raten", href: "/static/materialien/bildkarten-echt-oder-ki.pdf"}],
  lernziele: [
    "Du kannst sagen, was das Labor speichert und was nicht.",
    "Du kannst erklären, warum jüngere Kinder Kamera und Gesicht nur mit dir nutzen sollten.",
    "Du kannst drei Gespräche mit deinem Kind beginnen: Echt oder KI, Quellen prüfen, Hausaufgaben fair.",
  ],
  kurz: "Ist das KI-Labor sicher für Kinder? Hier steht, was es speichert, wo die Grenzen liegen und wie ihr es zu Hause gemeinsam nutzt.",
  zusammenfassung: "Hinweise für Eltern zum Einsatz des kostenlosen KI-Labors zu Hause: kein Konto, keine Werbung, Eingaben werden nicht dauerhaft gespeichert. Kamera, Mikrofon und Gesicht sind ab 16 Jahren gedacht, die Seite prüft das Alter nicht. Das Sprachmodell erfindet manchmal Antworten, deshalb gemeinsam nutzen. Drei Gespräche mit dem Kind und Experimente ohne Kamera. Kein Rechtsrat.",
  abschnitte: [
    {h: "Ist das Labor sicher für Kinder?",
     kurz: "Zum Lernen und Ausprobieren ja: kein Konto, keine Werbung, Eingaben werden nicht dauerhaft gespeichert.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "user-check", text: "Kein Konto", sub: "keine Anmeldung"},
      {icon: "ban", text: "Keine Werbung", sub: "keine Profile"},
      {icon: "clock", text: "Texte nur kurz", sub: "30 Minuten Ruhe, dann weg"}]},
     p: [
      "Das Labor ist ein Lernangebot. Dein Kind braucht kein Konto und gibt keinen Namen an. Chat-Fragen werden nicht aufbewahrt. Texte, die es in die RAG-Werkstatt einfügt, bleiben für die Sitzung im Arbeitsspeicher und verfallen nach 30 Minuten Ruhe.",
      "Im Browser liegen ein kleines Cookie und einige Merkzettel, zum Beispiel welche Seiten gelesen sind. Sie enthalten keine Namen und keine Texte. Auf dem Weg zum Rechner laufen die Eingaben über Vermittler (ein Server bei IONOS und der Tunneldienst von Cloudflare). Der Rechner speichert sie nicht.",
     ],
     merke: "Sicher heißt hier: wenig Daten, keine Werbung. Es heißt nicht, dass jede Antwort des Chats passt. Mehr dazu im nächsten Abschnitt."},
    {h: "Kamera, Mikrofon und Gesicht",
     kurz: "Ab 16 Jahren gedacht. Die Seite prüft das Alter nicht, darum begleitest du Jüngere.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "camera", text: "Kamera", sub: "nur nach Zustimmung"},
      {icon: "mic", text: "Mikrofon", sub: "nur nach Zustimmung"},
      {icon: "scan-face", text: "Gesicht", sub: "ab 16 Jahren"}]},
     p: [
      "Kamera und Mikrofon schalten sich nie von allein ein. Erst fragt die Seite, dann der Browser. Bilder und Aufnahmen werden nicht gespeichert. Bei der Gesichtserkennung entstehen aus Gesichtern Zahlenlisten. Das sind besonders geschützte Daten. Darum gibt es dort ein eigenes Kontrollkästchen.",
      "Die Seite fragt nicht nach dem Alter und prüft es nicht. Jüngere Kinder nutzen diese Labore deshalb nur, wenn du einverstanden bist und dabei bist.",
      "Im öffentlichen Betrieb laufen auch Kamerabilder und Aufnahmen über dieselben Vermittler wie Texte: einen Server bei IONOS und den Tunneldienst von Cloudflare. Der Rechner dahinter speichert sie nicht. Das Gesichts-Labor arbeitet nur mit der Kamera, Beispielbilder gibt es dort nicht. Wer keine Kamera will, nimmt die Experimente.",
     ],
     merke: "Kein Alterscheck heißt: Du bist der Alterscheck."},
    {h: "Was das Sprachmodell kann und was nicht",
     kurz: "Es erklärt und formuliert gut, erfindet aber auch. Einen Jugendschutzfilter, auf den du dich verlassen kannst, gibt es nicht.",
     visual: {typ: "vergleich",
      links: {titel: "Kann gut", icon: "circle-check", farbe: "gruen", punkte: ["Etwas einfach erklären", "Texte formulieren", "Ideen sammeln", "Fragen geduldig beantworten"]},
      rechts: {titel: "Kann nicht", icon: "triangle-alert", farbe: "orange", punkte: ["Sicher wissen, was stimmt", "Belege garantieren", "Kindgerechte Antworten garantieren"]},
      urteil: "Deshalb gemeinsam nutzen"},
     p: [
      "Ein Sprachmodell wählt Wort für Wort, was wahrscheinlich als Nächstes kommt. Das klingt oft überzeugend, auch wenn es falsch ist. Manchmal nennt es Quellen, die es nicht gibt. Das Modell im Labor ist klein und weiß weniger als große Modelle.",
      "Das Labor schaltet keinen eigenen Filter vor das Modell. Eine Frage deines Kindes geht direkt an das Sprachmodell Llama 3.2. Ob eine Antwort zum Alter passt, kann niemand vorher garantieren. Sitz deshalb dabei, wenn ihr den Chat nutzt.",
     ],
     alltag: "Stell dir einen belesenen Gast am Tisch vor, der immer sofort und selbstsicher antwortet, auch wenn er etwas nicht weiß. Man hört gern zu, aber man prüft nach. Der Vergleich hinkt an einer Stelle: Ein Gast merkt manchmal selbst, dass er unsicher ist. Das Modell klingt immer gleich sicher."},
    {h: "Drei Gespräche mit deinem Kind",
     kurz: "Echt oder KI, Quellen prüfen, Hausaufgaben fair. Jedes Gespräch beginnt mit einer Frage, nicht mit einem Verbot.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "eye", text: "Echt oder KI?", sub: "woran erkennst du es"},
      {icon: "search", text: "Quellen prüfen", sub: "stimmt das wirklich"},
      {icon: "book-open", text: "Hausaufgaben", sub: "was war von dir"}]},
     p: [
      "**Echt oder KI?** Schaut zusammen ein Bild oder einen Clip an und fragt: Woran würdest du das prüfen? Die Seite {{echt-oder-ki|Echt oder KI?}} zeigt Warnzeichen und Prüfwege, das Kartenset oben zum Ausdrucken eignet sich zum gemeinsamen Raten. Vereinbart auch ein Codewort für Notfallanrufe. Stimmen lassen sich nachbauen, ein Codewort hilft gegen jede Fälschung.",
      "**Quellen prüfen.** Lass dein Kind den Chat etwas fragen, das es gut kennt, zum Beispiel sein Hobby. Wo liegt der Chat daneben? Mehr dazu auf der Seite {{quellen-pruefen|Quellen prüfen}}.",
      "**Hausaufgaben fair.** Fragt: Was hast du selbst gemacht, was die KI? Wie schreibst du das auf? Die Seite {{ki-hausaufgaben-fair|KI bei Hausaufgaben}} erklärt den Unterschied zwischen Helfen und Abnehmen und hat einen eigenen Abschnitt für Eltern.",
      "Alle drei Gespräche als Anleitung für zwei, mit Gesprächsfragen: {{zusammen-ausprobieren|Zusammen ausprobieren}}. Zum Thema Handy und Bildschirm: {{bildschirmzeit|Bildschirmzeit}}.",
     ]},
    {h: "Die Kamera braucht dein Kind nicht",
     kurz: "Alle Experimente laufen ohne Kamera und Mikrofon. Fang dort an.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "chart-scatter", text: "Punkte-Labor", sub: "Lernen sehen"},
      {icon: "message-square", text: "Chat", sub: "Frage und Antwort"},
      {icon: "bug", text: "Fehler-Spiel", sub: "wo KI danebenliegt"},
      {icon: "split", text: "Prompt-Vergleich", sub: "bessere Fragen"},
      {icon: "volume-2", text: "Text zu Sprache", sub: "Stimme hören"},
      {icon: "network", text: "Netz-Spielplatz", sub: "ein Netz lernt"}]},
     p: [
      "Auf der Seite {{experimente|Experimente}} stehen Labore, die ohne Kamera und Mikrofon auskommen. Dein Kind setzt Punkte, stellt Fragen und sucht Fehler der KI. Das reicht, um zu verstehen, wie KI arbeitet.",
      "Der Chat läuft auf einem kleinen Rechner und braucht manchmal einen Moment. Wenn viel los ist, wartet ihr kurz.",
     ]},
    {h: "So richtest du es zu Hause ein",
     kurz: "Gemeinsam öffnen, Experimente wählen, Kamera aus lassen, danach reden.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "laptop", text: "Gemeinsam öffnen", sub: "ein Gerät, ihr zwei"},
      {icon: "flask-conical", text: "Experimente", sub: "ohne Kamera"},
      {icon: "eye-off", text: "Kamera aus", sub: "Zustimmung verweigern"},
      {icon: "messages-square", text: "Danach reden", sub: "was war überraschend", farbe: "gruen"}]},
     p: [
      "Setz dich zu deinem Kind und öffnet die Seite auf einem Gerät. Tippt keine echten Namen, Adressen oder privaten Dinge ein. Erfundene Beispiele reichen zum Üben.",
      "Möchtest du Kamera und Mikrofon für die Seite ganz sperren, stell sie in den Websiteeinstellungen deines Browsers auf „Blockieren“. Eine schon erteilte Zustimmung nimmst du auf der Seite {{sicherheit-einfach|Ist das sicher?}} zurück. Dort kannst du auch alles löschen, was die Seite im Browser ablegt.",
     ],
     merke: "Ein Gerät, zwei Personen, ohne Kamera. Das ist der einfachste sichere Anfang."},
    {h: "Fragen und Kontakt",
     kurz: "Fragen zum Labor und zum Datenschutz beantwortet der Betreiber. Verbindlich sind Datenschutzerklärung und Impressum.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "file-text", text: "Datenschutz", sub: "was verarbeitet wird"},
      {icon: "mail", text: "Impressum", sub: "Kontakt des Betreibers"},
      {icon: "handshake", text: "Du fragst", sub: "bei Unklarem", farbe: "gruen"}]},
     p: [
      "Die Datenschutzerklärung steht auf der Hauptseite des Betreibers: [daniel-alisch.site/datenschutz](https://daniel-alisch.site/datenschutz). Dort stehen auch deine Rechte, zum Beispiel auf Auskunft oder Löschung. Die Kontaktdaten findest du im Impressum, die Links stehen unten auf dieser Seite.",
      "Arbeitet dein Kind im Unterricht mit dem Labor, steht in der {{schule-eltern|Information für Eltern}}, was die Schule dabei tut. Diese Seite hier ist keine Rechtsberatung.",
     ]},
  ],
  mitnehmen: [
    "Das Labor braucht kein Konto, zeigt keine Werbung und speichert Eingaben nicht dauerhaft.",
    "Kamera, Mikrofon und Gesicht sind ab 16 gedacht. Die Seite prüft das Alter nicht, du begleitest Jüngere.",
    "Das Sprachmodell erfindet manchmal Antworten und hat keinen Filter, auf den du dich verlassen kannst. Nutzt es gemeinsam.",
  ],
  grenzen: [
    "Keine Rechtsberatung. Verbindlich sind Impressum und Datenschutzerklärung des Betreibers.",
    "Wie alt dein Kind sein muss, damit es Kamera oder Gesicht nutzen darf, entscheidest du. Die Seite stellt es nicht fest.",
  ],
  quiz: [
    {frage: "Dein Kind ist 12 und will die Gesichtserkennung ausprobieren. Was gilt im Labor?",
     optionen: ["Die Seite prüft das Alter und sperrt die Funktion", "Die Seite prüft kein Alter, ab 16 gedacht, Jüngere mit deinem Einverständnis", "Die Funktion ist für alle ohne Einschränkung gedacht", "Die Funktion läuft nur mit einem Konto der Eltern"],
     richtig: 1, erklaerung: "Die Seite fragt nicht nach dem Alter und prüft es nicht. Kamera, Mikrofon und Gesicht sind ab 16 gedacht, Jüngere nutzen sie nur mit Einverständnis der Eltern."},
    {frage: "Warum solltest du beim Chat mit dem Sprachmodell dabei sein?",
     optionen: ["Weil Antworten erfunden sein können und kein Filter sie prüft", "Weil der Chat jede Eingabe dauerhaft speichert und verkauft", "Weil das Modell ohne Aufsicht keine Antwort geben würde", "Weil der Chat ohne ein Konto der Eltern nicht startet"],
     richtig: 0, erklaerung: "Das Modell klingt überzeugend, auch wenn es falsch liegt, und das Labor schaltet keinen eigenen Filter davor. Gemeinsam nutzen und nachprüfen ist der Schutz."},
    {frage: "Was ist ein guter Einstieg, wenn dein Kind keine Kamera nutzen soll?",
     optionen: ["Die Kamera erlauben und später wieder ausschalten", "Erst ein Konto anlegen und die Kamera sperren", "Die Experimente, sie laufen ohne Kamera und Mikrofon", "Nur Gesichtserkennung, weil sie am meisten zeigt"],
     richtig: 2, erklaerung: "Alle Experimente kommen ohne Kamera und Mikrofon aus. Dein Kind lernt dort, wie KI arbeitet und wo sie danebenliegt."},
  ],
  weiter: ["zusammen-ausprobieren", "sicherheit-einfach", "experimente", "echt-oder-ki", "quellen-pruefen", "ki-hausaufgaben-fair", "bildschirmzeit", "schule-eltern"],
};

S["zusammen-ausprobieren"] = {
  nav: "Zusammen ausprobieren", typ: "lektion", gruppe: "Medienkompetenz", titel: "Zusammen ausprobieren: Anleitung für zwei", symbol: "users",
  downloads: [{text: "Kartenset Echt oder KI?", sub: "12 Bildkarten, 2 Seiten A4, für Experiment 3", href: "/static/materialien/bildkarten-echt-oder-ki.pdf"}],
  lernziele: [
    "Du kannst mit deinem Kind drei Experimente von je etwa zehn Minuten durchführen.",
    "Du kannst nach jedem Experiment ein Gespräch beginnen, ohne zu belehren.",
    "Du kannst sagen, was ihr dabei über die Grenzen von KI erfahren habt.",
  ],
  kurz: "Drei Experimente für zwei Personen, je etwa zehn Minuten, alle ohne Kamera. Zu jedem eine Gesprächsfrage. Ein Gerät, zwei Stühle.",
  zusammenfassung: "Anleitung für Eltern und Kind, die drei Experimente des KI-Labors gemeinsam ausprobieren: ein Fehler-Spiel mit gleichem Startwert zum Vergleichen, eine KI-Antwort gemeinsam gegen eine zweite Quelle prüfen und das Kartenset Echt oder KI zum Raten. Mit Gesprächsfragen. Ohne Kamera.",
  abschnitte: [
    {h: "So geht es",
     kurz: "Ein Gerät, zwei Personen, etwa dreißig Minuten. Kein Konto, keine Kamera.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "flask-conical", text: "Experiment 1", sub: "Fehler-Spiel, 10 Min"},
      {icon: "search", text: "Experiment 2", sub: "Antwort prüfen, 10 Min"},
      {icon: "printer", text: "Experiment 3", sub: "Kartenset raten, 10 Min"},
      {icon: "messages-square", text: "Reden", sub: "was war überraschend", farbe: "gruen"}]},
     p: [
      "Setzt euch an ein Gerät, am besten nebeneinander. Ihr braucht keine Anmeldung und keine Kamera. Tippt keine echten Namen oder privaten Dinge ein. Die Reihenfolge ist egal, auch ein Experiment pro Tag reicht.",
      "Eure Rollen sind gleich: Ihr ratet beide, ihr irrt euch beide. Wer zuerst erklärt, warum er so entschieden hat, bekommt den Punkt. Das Ziel ist nicht Gewinnen, sondern ein Gespräch.",
     ]},
    {h: "Experiment 1: Das Fehler-Spiel mit gleichem Startwert",
     kurz: "Beide geben denselben Startwert ein und spielen dieselben zehn Karten. Danach vergleicht ihr.",
     p: [
      "Öffnet {{llm-grenzen|Grenzen von Sprachmodellen}} und scrollt zum Fehler-Spiel. Gebt beide denselben Startwert ein, zum Beispiel 4711. Der Startwert legt fest, welche zehn Karten kommen und in welcher Reihenfolge. Ihr bekommt also dieselben Karten, spielt aber getrennt, einer nach dem anderen.",
      "Bei jeder Karte entscheidet ihr: Hat die KI hier recht, oder erfindet sie etwas? Danach zeigt das Spiel, was stimmte, und am Ende, bei welcher Art von Fehlern ihr noch danebenliegt. Vergleicht eure Ergebnisse.",
     ],
     liste: [
      "Bei welcher Karte lagen wir verschieden? Warum haben wir so entschieden?",
      "Woran habt ihr erkannt, dass die KI etwas erfindet? Oder woran hättet ihr es erkennen können?",
      "Würdest du der KI beim nächsten Mal mehr oder weniger glauben?",
     ]},
    {h: "Experiment 2: Eine KI-Antwort gemeinsam prüfen",
     kurz: "Das Kind fragt den Chat nach etwas, das es gut kennt. Ihr prüft die Antwort gegen eine zweite Quelle.",
     p: [
      "Öffnet den {{chat|Chat}}. Das Kind wählt ein Thema, in dem es sich auskennt: das Lieblingsspiel, ein Tier, ein Hobby, der eigene Verein. Es stellt eine Frage dazu. Der Chat braucht manchmal einen Moment, wenn viel los ist.",
      "Jetzt prüft ihr die Antwort gemeinsam: Was stimmt, was nicht? Sucht eine zweite Quelle, ein Buch, eine Seite von Kenntnisreichen. Die Fünf-Schritte-Karte auf {{quellen-pruefen|Quellen prüfen}} hilft dabei. Meist liegt der Chat bei Einzelheiten daneben: Zahlen, Namen, Jahre.",
     ],
     liste: [
      "Wo lag der Chat richtig und wo falsch? Wie hast du es gemerkt?",
      "Warum klingt die Antwort trotzdem sicher?",
      "Was machst du, wenn du das Thema nicht kennst?",
     ]},
    {h: "Experiment 3: Echt oder KI? mit dem Kartenset",
     kurz: "Karten ausdrucken, ausschneiden, nebeneinander legen und gemeinsam sortieren.",
     p: [
      "Das {{echt-oder-ki|Kartenset Echt oder KI?}} hat zwölf Bildkarten auf zwei A4-Seiten. Ihr findet es oben auf dieser Seite zum Herunterladen. Druckt es aus und schneidet die Karten aus. Sortiert sie gemeinsam in zwei Stapel: echt und KI-erzeugt. Jeder begründet laut.",
      "Die Auflösung steht im Lösungsblatt. Schaut sie erst an, wenn ihr euch geeinigt habt. Wichtig: Es gibt keine sichere Erkennung. Oft hilft nur die Herkunft, nicht das Bild.",
     ],
     liste: [
      "Woran habt ihr eure Entscheidung festgemacht? War es verlässlich?",
      "Was würdest du tun, wenn du so ein Bild in einer Gruppe siehst?",
      "Welches Codewort vereinbaren wir für Notfallanrufe?",
     ]},
    {h: "Danach reden",
     kurz: "Eine offene Frage zum Schluss reicht. Nicht belehren, zuhören.",
     p: [
      "Frag zum Abschluss: Was hat dich überrascht? Was würdest du anderen erzählen? Wann hilft dir KI, und wann lässt du sie lieber weg? Hört zu und lasst Antworten stehen. Mehr Gesprächsanlässe findest du auf {{eltern-zuhause|KI zu Hause}}.",
     ]},
  ],
  mitnehmen: [
    "Ein Gerät, zwei Personen, keine Kamera: das reicht für drei Experimente.",
    "Gleicher Startwert heißt gleiche Karten, so lässt sich vergleichen.",
    "Das Gespräch danach ist wichtiger als das Ergebnis.",
  ],
  quiz: [
    {frage: "Wozu dient der gleiche Startwert im Fehler-Spiel?",
     optionen: ["Beide bekommen dieselben Karten und können ihre Entscheidungen vergleichen", "Er verbessert die Antworten der KI", "Er schaltet die Kamera ein", "Er speichert den Spielstand auf dem Server"],
     richtig: 0, erklaerung: "Der Startwert legt die Kartenfolge fest. Mit demselben Wert spielt ihr dieselben Karten und könnt Unterschiede besprechen."},
    {frage: "Der Chat nennt eine Zahl zu einem Thema, das dein Kind gut kennt. Was ist ein guter nächster Schritt?",
     optionen: ["Die Zahl glauben, weil der Chat sicher klingt", "Eine zweite Quelle suchen und die Zahl vergleichen", "Den Chat dieselbe Frage so lange stellen, bis die Zahl passt", "Das Thema künftig nicht mehr anfassen"],
     richtig: 1, erklaerung: "Ein Sprachmodell klingt auch dann sicher, wenn es sich irrt. Eine zweite Quelle zeigt, ob die Zahl stimmt."},
    {frage: "Warum begründet ihr beim Kartenset eure Entscheidung laut?",
     optionen: ["Damit der Punkt an den Schnelleren geht", "Weil die Karten sonst nicht ausgewertet werden können", "Damit ihr merkt, woran ihr eure Entscheidung festmacht und ob das verlässlich ist", "Weil das Lösungsblatt es verlangt"],
     richtig: 2, erklaerung: "Im Begründen zeigt sich, ob ihr auf Hinweise oder auf ein Bauchgefühl vertraut. Das ist der Lerneffekt."},
  ],
  weiter: ["eltern-zuhause", "llm-grenzen", "chat", "quellen-pruefen", "echt-oder-ki", "ki-hausaufgaben-fair"],
};

S["bildschirmzeit"] = {
  nav: "Bildschirmzeit", typ: "lektion", gruppe: "Medienkompetenz", titel: "Bildschirmzeit: kurz und ehrlich", symbol: "smartphone",
  lernziele: [
    "Du kannst sagen, warum es keine einzelne richtige Zahl für alle Kinder gibt.",
    "Du kannst mit deinem Kind Regeln vereinbaren, statt sie nur zu verordnen.",
    "Du kannst sagen, wo die Seite endet und wo andere Stellen weiterhelfen.",
  ],
  kurz: "Wie viel Bildschirm ist in Ordnung? Hier steht, was sich ehrlich sagen lässt, was nicht, und wo du Rat bekommst. Keine Medizin und keine Versprechen.",
  zusammenfassung: "Kurzer, ehrlicher Überblick für Eltern zur Bildschirmzeit: Es gibt keine einheitliche richtige Zahl, Inhalt und Begleitung zählen, Regeln gemeinsam vereinbaren. Verweise auf WHO-Empfehlung für Kinder unter fünf Jahren, klicksafe und den Mediennutzungsvertrag. Keine medizinische Beratung.",
  abschnitte: [
    {h: "Was sich ehrlich sagen lässt",
     kurz: "Eine Zahl für alle gibt es nicht. Alter, Inhalt und Begleitung zählen mehr als die Stoppuhr.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "clock", text: "Dauer", sub: "ein Faktor von mehreren"},
      {icon: "tv", text: "Inhalt", sub: "Lernen, Spielen, Scrollen"},
      {icon: "users", text: "Begleitung", sub: "allein oder zusammen"}]},
     p: [
      "Empfehlungen unterscheiden sich nach Alter. Für Kinder unter fünf Jahren empfiehlt die Weltgesundheitsorganisation (WHO) wenig Bildschirmzeit, bei Kleinkindern möglichst gar keine, dafür mehr Bewegung und Schlaf. Für ältere Kinder und Jugendliche gibt es keine einzelne wissenschaftlich belegte Grenze, die für alle passt.",
      "Wichtig sind: Was wird am Bildschirm getan? Wird dabei gelernt, gespielt, gechattet oder endlos gescrollt? Sind Schlaf, Bewegung, Schule und Freunde im Gleichgewicht? Und ist jemand dabei, der mit dem Kind spricht?",
     ],
     merke: "Nicht nur die Minuten zählen, sondern auch, was in der Zeit passiert und was dafür ausfällt."},
    {h: "Was die Seite nicht sagen kann",
     kurz: "Sie ist keine medizinische oder pädagogische Beratung. Bei Sorgen hilft eine Beratungsstelle.",
     p: [
      "Wie sich Bildschirmzeit auf ein einzelnes Kind auswirkt, kann diese Seite nicht beurteilen. Sie nennt keine Grenzwerte und verspricht nichts. Wenn dein Kind sich stark zurückzieht, schlecht schläft oder Streit um das Gerät dominiert, sprich mit der Kinderärztin, dem Kinderarzt oder einer Beratungsstelle.",
      "Auch das KI-Labor ist nur ein Beispiel für Bildschirmzeit. Die Experimente dauern wenige Minuten und eignen sich gut für gemeinsame Zeit, siehe {{zusammen-ausprobieren|Zusammen ausprobieren}}. Sie ersetzen keine Regeln für Handy, Spiele und soziale Netze.",
     ]},
    {h: "Regeln gemeinsam vereinbaren",
     kurz: "Regeln, die das Kind mit aushandelt, halten länger als verordnete.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "messages-square", text: "Sprechen", sub: "was ist wichtig"},
      {icon: "handshake", text: "Vereinbaren", sub: "schriftlich festhalten"},
      {icon: "eye", text: "Nachsehen", sub: "nach ein paar Wochen"}]},
     p: [
      "Setzt euch zusammen und legt fest: Wann sind Geräte aus, zum Beispiel beim Essen und vor dem Schlafen? Welche Apps sind erlaubt? Was passiert bei Verstößen? Haltet es schriftlich fest und schaut nach ein paar Wochen, ob es passt.",
      "Als Vorlage gibt es den kostenlosen Mediennutzungsvertrag von klicksafe und SCHAU HIN!. Gilt eine Regel für das Kind, gilt sie auch für dich: Vorbild wirkt stärker als Verbot.",
     ]},
    {h: "Weiterlesen",
     kurz: "Quellen und Hilfe, abgerufen am 22.11.2026.",
     liste: [
      "WHO: [Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age](https://www.who.int/publications/i/item/9789241550536), 2019, abgerufen am 22.11.2026.",
      "klicksafe: [Wie lange darf mein Kind an Handy und PC?](https://www.klicksafe.de/eltern), abgerufen am 22.11.2026.",
      "klicksafe und SCHAU HIN!: [Mediennutzungsvertrag](https://www.mediennutzungsvertrag.de/), abgerufen am 22.11.2026.",
      "Beratung für Kinder, Jugendliche und Eltern: [Nummer gegen Kummer](https://www.nummergegenkummer.de/), abgerufen am 22.11.2026.",
     ]},
  ],
  mitnehmen: [
    "Es gibt keine einzelne richtige Zahl für alle. Alter, Inhalt und Begleitung zählen.",
    "Vereinbart Regeln gemeinsam und haltet sie schriftlich fest.",
    "Bei Sorgen: Kinderarzt oder Beratungsstelle fragen, nicht diese Seite.",
  ],
  grenzen: ["Keine medizinische, pädagogische oder rechtliche Beratung. Quellen am 22.11.2026 geprüft, Inhalte der verlinkten Stellen können sich ändern."],
  quiz: [
    {frage: "Was sagt diese Seite zur richtigen Bildschirmzeit?",
     optionen: ["Es gibt eine feste Zahl, die für alle Kinder gilt", "Eine Zahl für alle gibt es nicht, Alter, Inhalt und Begleitung zählen", "Bildschirmzeit ist grundsätzlich schädlich und sollte entfallen", "Sie ist nur für Kinder über zwölf ein Thema"],
     richtig: 1, erklaerung: "Außer für kleine Kinder gibt es keine einzelne belegte Grenze. Es kommt darauf an, was getan wird und wer dabei ist."},
    {frage: "Wie gehst du am besten mit Regeln um?",
     optionen: ["Streng allein festlegen, damit es keine Diskussion gibt", "Gar keine Regeln, das Kind lernt es allein", "Gemeinsam vereinbaren, aufschreiben und nach einigen Wochen prüfen", "Nur beim ersten Streit besprechen"],
     richtig: 2, erklaerung: "Regeln, die das Kind mit aushandelt, werden eher eingehalten. Aufschreiben und Prüfen hält sie lebendig."},
    {frage: "Dein Kind schläft schlecht und zieht sich zurück. Was ist sinnvoll?",
     optionen: ["Mit Kinderärztin, Kinderarzt oder Beratungsstelle sprechen", "Warten, bis es von allein vorbeigeht", "Diese Seite nach einem Grenzwert fragen", "Das KI-Labor sperren und nichts weiter tun"],
     richtig: 0, erklaerung: "Die Seite kann keinen Einzelfall beurteilen. Bei solchen Anzeichen helfen Fachleute weiter."},
  ],
  weiter: ["eltern-zuhause", "zusammen-ausprobieren", "ki-hausaufgaben-fair", "sicherheit-einfach"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "Medienkompetenz", seiten: ["eltern-zuhause", "zusammen-ausprobieren", "bildschirmzeit"] }],
});
})();
