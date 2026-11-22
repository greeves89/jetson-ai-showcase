/* Seite "KI zu Hause: Was Eltern wissen sollten" (Gruppe Medienkompetenz). Sie-Form (Eltern sind die Leserschaft), bildzentriert nach docs/visuals.md.
   Nur belegte Aussagen: Seite "Ist das sicher?" (content-laien.js), "Information für Eltern" (content-schule.js),
   Medienseiten (content-medien.js), Chat-Aufruf in app/app.py (kein eigener Filter vor dem Sprachmodell).
   Die Seite schule-eltern bleibt der Brief für den Schuleinsatz (ebenfalls Sie-Form) und verweist hierher.
   Das Kartenset für zwei (/static/materialien/kartenset-eltern.pdf, mit Auflösung und Spielregeln für zwei) liefert das Materialienpaket.
   Enthält außerdem die Seiten "Zusammen ausprobieren" (Anleitung für zwei) und "Bildschirmzeit". */
(function () {

const S = {};

S["eltern-zuhause"] = {
  nav: "Eltern zu Hause", typ: "lektion", gruppe: "Medienkompetenz", titel: "KI zu Hause: Was Eltern wissen sollten", symbol: "users", rollen: ["eltern"],
  rechtslinks: true,
  downloads: [{text: "Kartenset für zwei (mit Auflösung)", sub: "Für Eltern und Kinder", href: "/static/materialien/kartenset-eltern.pdf"}],
  lernziele: [
    "Sie können sagen, was das Labor speichert und was nicht.",
    "Sie können erklären, warum jüngere Kinder Kamera und Gesicht nur mit Ihnen nutzen sollten.",
    "Sie können drei Gespräche mit Ihrem Kind beginnen: Echt oder KI, Quellen prüfen, Hausaufgaben fair.",
  ],
  kurz: "Ist das KI-Labor sicher für Kinder? Hier steht, was es speichert, wo die Grenzen liegen und wie Sie es zu Hause gemeinsam nutzen. Für Kinder unter 16 empfehlen wir, den Chat gemeinsam mit einer erwachsenen Person zu nutzen; Kamera, Mikrofon und Gesicht ab 16.",
  zusammenfassung: "Hinweise für Eltern zum Einsatz des kostenlosen KI-Labors zu Hause: kein Konto, keine Werbung, Eingaben werden nicht dauerhaft gespeichert. Kamera, Mikrofon und Gesicht sind ab 16 Jahren gedacht, die Seite prüft das Alter nicht. Für Kinder unter 16 wird empfohlen, den Chat gemeinsam mit einer erwachsenen Person zu nutzen, denn das Sprachmodell erfindet manchmal Antworten. Drei Gespräche mit dem Kind, Sätze zum Sagen und Experimente ohne Kamera. Kein Rechtsrat.",
  abschnitte: [
    {h: "Ist das Labor sicher für Kinder?",
     kurz: "Zum Lernen und Ausprobieren ja: kein Konto, keine Werbung, Eingaben werden nicht dauerhaft gespeichert.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "user-check", text: "Kein Konto", sub: "keine Anmeldung"},
      {icon: "ban", text: "Keine Werbung", sub: "keine Profile"},
      {icon: "clock", text: "Texte nur kurz", sub: "30 Minuten Ruhe, dann weg"}]},
     p: [
      "Das Labor ist ein Lernangebot. Ihr Kind braucht kein Konto und gibt keinen Namen an. Chat-Fragen werden nicht aufbewahrt. Texte, die es in die RAG-Werkstatt einfügt, bleiben für die Sitzung im Arbeitsspeicher und verfallen nach 30 Minuten Ruhe.",
      "Im Browser liegen ein kleines Cookie und einige Merkzettel, zum Beispiel welche Seiten gelesen sind. Sie enthalten keine Namen und keine Texte. Auf dem Weg zum Rechner laufen die Eingaben über Vermittler (ein Server bei IONOS und der Tunneldienst von Cloudflare). Der Rechner speichert sie nicht.",
     ],
     merke: "Sicher heißt hier: wenig Daten, keine Werbung. Es heißt nicht, dass jede Antwort des Chats passt. Mehr dazu im nächsten Abschnitt."},
    {h: "Kamera, Mikrofon und Gesicht",
     kurz: "Kamera, Mikrofon und Gesicht ab 16 Jahren. Für Kinder unter 16 empfehlen wir, den Chat gemeinsam mit einer erwachsenen Person zu nutzen. Die Seite prüft das Alter nicht, darum begleiten Sie Jüngere.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "camera", text: "Kamera", sub: "nur nach Zustimmung"},
      {icon: "mic", text: "Mikrofon", sub: "nur nach Zustimmung"},
      {icon: "scan-face", text: "Gesicht", sub: "ab 16 Jahren"}]},
     p: [
      "Kamera und Mikrofon schalten sich nie von allein ein. Erst fragt die Seite, dann der Browser. Bilder und Aufnahmen werden nicht gespeichert. Bei der Gesichtserkennung entstehen aus Gesichtern Zahlenlisten. Das sind besonders geschützte Daten. Darum gibt es dort ein eigenes Kontrollkästchen.",
      "Die Seite fragt nicht nach dem Alter und prüft es nicht. Jüngere Kinder nutzen diese Labore deshalb nur, wenn Sie einverstanden sind und dabei sind.",
      "Im öffentlichen Betrieb laufen auch Kamerabilder und Aufnahmen über dieselben Vermittler wie Texte: einen Server bei IONOS und den Tunneldienst von Cloudflare. Der Rechner dahinter speichert sie nicht. Das Gesichts-Labor arbeitet nur mit der Kamera, Beispielbilder gibt es dort nicht. Wer keine Kamera will, nimmt die Experimente.",
     ],
     merke: "Kein Alterscheck heißt: Sie sind der Alterscheck."},
    {h: "Was das Sprachmodell kann und was nicht",
     kurz: "Es erklärt und formuliert gut, erfindet aber auch. Einen Jugendschutzfilter, auf den Sie sich verlassen können, gibt es nicht. Kinder unter 16 nutzen den Chat am besten mit einer erwachsenen Person.",
     visual: {typ: "vergleich",
      links: {titel: "Kann gut", icon: "circle-check", farbe: "gruen", punkte: ["Etwas einfach erklären", "Texte formulieren", "Ideen sammeln", "Fragen geduldig beantworten"]},
      rechts: {titel: "Kann nicht", icon: "triangle-alert", farbe: "orange", punkte: ["Sicher wissen, was stimmt", "Belege garantieren", "Kindgerechte Antworten garantieren"]},
      urteil: "Deshalb gemeinsam nutzen"},
     p: [
      "Ein Sprachmodell wählt Wort für Wort, was wahrscheinlich als Nächstes kommt. Das klingt oft überzeugend, auch wenn es falsch ist. Manchmal nennt es Quellen, die es nicht gibt. Das Modell im Labor ist klein und weiß weniger als große Modelle.",
      "Das Labor schaltet keinen eigenen Filter vor das Modell. Eine Frage Ihres Kindes geht direkt an das Sprachmodell Llama 3.2. Ob eine Antwort zum Alter passt, kann niemand vorher garantieren. Für Kinder unter 16 empfehlen wir deshalb, den Chat gemeinsam mit einer erwachsenen Person zu nutzen. Sitzen Sie dabei, wenn Sie den Chat nutzen.",
     ],
     alltag: "Stellen Sie sich einen belesenen Gast am Tisch vor, der immer sofort und selbstsicher antwortet, auch wenn er etwas nicht weiß. Man hört gern zu, aber man prüft nach. Der Vergleich hinkt an einer Stelle: Ein Gast merkt manchmal selbst, dass er unsicher ist. Das Modell klingt immer gleich sicher."},
    {h: "Drei Gespräche mit Ihrem Kind",
     kurz: "Echt oder KI, Quellen prüfen, Hausaufgaben fair. Jedes Gespräch beginnt mit einer Frage, nicht mit einem Verbot.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "eye", text: "Echt oder KI?", sub: "woran erkennt man es"},
      {icon: "search", text: "Quellen prüfen", sub: "stimmt das wirklich"},
      {icon: "book-open", text: "Hausaufgaben", sub: "was war von Ihrem Kind"}]},
     p: [
      "**Echt oder KI?** Schauen Sie zusammen ein Bild oder einen Clip an und fragen Sie: Woran würdest du das prüfen? Die Seite {{echt-oder-ki|Echt oder KI?}} zeigt Warnzeichen und Prüfwege, das Kartenset für zwei oben eignet sich zum gemeinsamen Raten. Vereinbaren Sie auch ein Codewort für Notfallanrufe. Stimmen lassen sich nachbauen, ein Codewort hilft gegen jede Fälschung. Was bei falschen Anrufen gilt, steht auf {{falscher-anruf|Falscher Anruf, Enkeltrick, Schockanruf}}. Das ist auch für die Großeltern wichtig.",
      "**Quellen prüfen.** Lassen Sie Ihr Kind den Chat etwas fragen, das es gut kennt, zum Beispiel sein Hobby. Wo liegt der Chat daneben? Mehr dazu auf der Seite {{quellen-pruefen|Quellen prüfen}}.",
      "**Hausaufgaben fair.** Fragen Sie: Was hast du selbst gemacht, was die KI? Wie schreibst du das auf? Die Seite {{ki-hausaufgaben-fair|KI bei Hausaufgaben}} erklärt den Unterschied zwischen Helfen und Abnehmen und hat einen eigenen Abschnitt für Eltern.",
      "Alle drei Gespräche als Anleitung für zwei, mit Gesprächsfragen: {{zusammen-ausprobieren|Zusammen ausprobieren}}. Zum Thema Handy und Bildschirm: {{bildschirmzeit|Bildschirmzeit}}.",
     ]},
    {h: "Was Sie Ihrem Kind sagen können",
     kurz: "Kurze Sätze, die Sie übernehmen können. Sie nehmen Druck heraus und laden zum Fragen ein.",
     liste: [
      "„Die KI klingt immer sicher, auch wenn sie sich irrt. Darum prüfen wir wichtige Sachen noch einmal.“",
      "„Wenn dir etwas komisch vorkommt oder Angst macht, sag es mir. Du bekommst keinen Ärger.“",
      "„Wir tippen keine echten Namen, Adressen oder Passwörter ein.“",
      "„Kamera und Mikrofon nutzen wir nur zusammen.“",
     ]},
    {h: "Die Kamera braucht Ihr Kind nicht",
     kurz: "Alle Experimente laufen ohne Kamera und Mikrofon. Fangen Sie dort an.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "chart-scatter", text: "Punkte-Labor", sub: "Lernen sehen"},
      {icon: "message-square", text: "Chat", sub: "Frage und Antwort"},
      {icon: "bug", text: "Fehler-Spiel", sub: "wo KI danebenliegt"},
      {icon: "split", text: "Prompt-Vergleich", sub: "bessere Fragen"},
      {icon: "volume-2", text: "Text zu Sprache", sub: "Stimme hören"},
      {icon: "network", text: "Netz-Spielplatz", sub: "ein Netz lernt"}]},
     p: [
      "Auf der Seite {{experimente|Experimente}} stehen Labore, die ohne Kamera und Mikrofon auskommen. Ihr Kind setzt Punkte, stellt Fragen und sucht Fehler der KI. Das reicht, um zu verstehen, wie KI arbeitet.",
      "Der Chat läuft auf einem kleinen Rechner. Wenn viel los ist, warten Sie bis zu zwei Minuten auf die Antwort.",
     ]},
    {h: "So richten Sie es zu Hause ein",
     kurz: "Gemeinsam öffnen, Experimente wählen, Kamera aus lassen, danach reden.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "laptop", text: "Gemeinsam öffnen", sub: "ein Gerät, Sie zwei"},
      {icon: "flask-conical", text: "Experimente", sub: "ohne Kamera"},
      {icon: "eye-off", text: "Kamera aus", sub: "Zustimmung verweigern"},
      {icon: "messages-square", text: "Danach reden", sub: "was war überraschend", farbe: "gruen"}]},
     p: [
      "Setzen Sie sich zu Ihrem Kind und öffnen Sie die Seite auf einem Gerät. Tippen Sie keine echten Namen, Adressen oder privaten Dinge ein. Erfundene Beispiele reichen zum Üben.",
      "Möchten Sie Kamera und Mikrofon für die Seite ganz sperren, stellen Sie sie in den Websiteeinstellungen Ihres Browsers auf „Blockieren“. Eine schon erteilte Zustimmung nehmen Sie auf der Seite {{sicherheit-einfach|Ist das sicher?}} zurück. Dort können Sie auch alles löschen, was die Seite im Browser ablegt.",
     ],
     merke: "Ein Gerät, zwei Personen, ohne Kamera. Das ist der einfachste sichere Anfang."},
    {h: "Fragen und Kontakt",
     kurz: "Fragen zum Labor und zum Datenschutz beantwortet der Betreiber. Verbindlich sind Datenschutzerklärung und Impressum.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "file-text", text: "Datenschutz", sub: "was verarbeitet wird"},
      {icon: "mail", text: "Impressum", sub: "Kontakt des Betreibers"},
      {icon: "handshake", text: "Sie fragen", sub: "bei Unklarem", farbe: "gruen"}]},
     p: [
      "Die Datenschutzerklärung steht auf der Hauptseite des Betreibers: [daniel-alisch.site/datenschutz](https://daniel-alisch.site/datenschutz). Dort stehen auch Ihre Rechte, zum Beispiel auf Auskunft oder Löschung. Die Kontaktdaten finden Sie im Impressum, die Links stehen unten auf dieser Seite.",
      "Arbeitet Ihr Kind im Unterricht mit dem Labor, steht in der {{schule-eltern|Information für Eltern}}, was die Schule dabei tut. Diese Seite hier ist keine Rechtsberatung.",
     ]},
  ],
  mitnehmen: [
    "Das Labor braucht kein Konto, zeigt keine Werbung und speichert Eingaben nicht dauerhaft.",
    "Kamera, Mikrofon und Gesicht sind ab 16 gedacht. Die Seite prüft das Alter nicht, Sie begleiten Jüngere.",
    "Das Sprachmodell erfindet manchmal Antworten und hat keinen Filter, auf den Sie sich verlassen können. Kinder unter 16 nutzen den Chat mit einer erwachsenen Person.",
  ],
  grenzen: [
    "Keine Rechtsberatung. Verbindlich sind Impressum und Datenschutzerklärung des Betreibers.",
    "Wie alt Ihr Kind sein muss, damit es Kamera oder Gesicht nutzen darf, entscheiden Sie. Die Seite stellt es nicht fest.",
  ],
  quiz: [
    {frage: "Ihr Kind ist 12 und will die Gesichtserkennung ausprobieren. Was gilt im Labor?",
     optionen: ["Die Seite prüft das Alter und sperrt die Funktion", "Die Seite prüft kein Alter, ab 16 gedacht, Jüngere mit Ihrem Einverständnis", "Die Funktion ist für alle ohne Einschränkung gedacht", "Die Funktion läuft nur mit einem Konto der Eltern"],
     richtig: 1, erklaerung: "Die Seite fragt nicht nach dem Alter und prüft es nicht. Kamera, Mikrofon und Gesicht sind ab 16 gedacht, Jüngere nutzen sie nur mit Einverständnis der Eltern."},
    {frage: "Warum sollten Sie beim Chat mit dem Sprachmodell dabei sein?",
     optionen: ["Weil Antworten erfunden sein können und kein Filter sie prüft", "Weil der Chat jede Eingabe dauerhaft speichert und verkauft", "Weil das Modell ohne Aufsicht keine Antwort geben würde", "Weil der Chat ohne ein Konto der Eltern nicht startet"],
     richtig: 0, erklaerung: "Das Modell klingt überzeugend, auch wenn es falsch liegt, und das Labor schaltet keinen eigenen Filter davor. Gemeinsam nutzen und nachprüfen ist der Schutz."},
    {frage: "Was ist ein guter Einstieg, wenn Ihr Kind keine Kamera nutzen soll?",
     optionen: ["Die Kamera erlauben und später wieder ausschalten", "Erst ein Konto anlegen und die Kamera sperren", "Die Experimente, sie laufen ohne Kamera und Mikrofon", "Nur Gesichtserkennung, weil sie am meisten zeigt"],
     richtig: 2, erklaerung: "Alle Experimente kommen ohne Kamera und Mikrofon aus. Ihr Kind lernt dort, wie KI arbeitet und wo sie danebenliegt."},
  ],
  weiter: ["zusammen-ausprobieren", "falscher-anruf", "sicherheit-einfach", "experimente", "echt-oder-ki", "quellen-pruefen", "ki-hausaufgaben-fair", "bildschirmzeit", "schule-eltern"],
};

S["zusammen-ausprobieren"] = {
  nav: "Zusammen ausprobieren", typ: "lektion", gruppe: "Medienkompetenz", titel: "Zusammen ausprobieren: Anleitung für zwei", symbol: "users", rollen: ["eltern"],
  downloads: [{text: "Kartenset für zwei (mit Auflösung)", sub: "Für Eltern und Kinder, für Experiment 3", href: "/static/materialien/kartenset-eltern.pdf"}],
  lernziele: [
    "Sie können mit Ihrem Kind drei Experimente von je etwa zehn Minuten durchführen.",
    "Sie können nach jedem Experiment ein Gespräch beginnen, ohne zu belehren.",
    "Sie können sagen, was Sie dabei über die Grenzen von KI erfahren haben.",
  ],
  kurz: "Drei Experimente für zwei Personen, je etwa zehn Minuten, alle ohne Kamera und auch für Kinder gut geeignet. Zu jedem eine Gesprächsfrage. Ein Gerät, zwei Stühle. Für Kinder unter 16 empfehlen wir, den Chat gemeinsam mit einer erwachsenen Person zu nutzen; Kamera, Mikrofon und Gesicht ab 16.",
  zusammenfassung: "Anleitung für Eltern und Kind, die drei Experimente des KI-Labors gemeinsam auszuprobieren: das Punkte-Labor (wie lernt ein Computer, was eine Katze ist?), eine KI-Antwort gemeinsam gegen eine zweite Quelle prüfen und das Kartenset Echt oder KI zum Raten, mit Auflösung für Eltern. Mit Gesprächsfragen. Ohne Kamera.",
  abschnitte: [
    {h: "So geht es",
     kurz: "Ein Gerät, zwei Personen, etwa dreißig Minuten. Kein Konto, keine Kamera.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "chart-scatter", text: "Experiment 1", sub: "Punkte-Labor, 10 Min"},
      {icon: "search", text: "Experiment 2", sub: "Antwort prüfen, 10 Min"},
      {icon: "printer", text: "Experiment 3", sub: "Kartenset raten, 10 Min"},
      {icon: "messages-square", text: "Reden", sub: "was war überraschend", farbe: "gruen"}]},
     p: [
      "Setzen Sie sich an ein Gerät, am besten nebeneinander. Sie brauchen keine Anmeldung und keine Kamera. Tippen Sie keine echten Namen oder privaten Dinge ein. Die Reihenfolge ist egal, auch ein Experiment pro Tag reicht.",
      "Ihre Rollen sind gleich: Sie raten beide, Sie irren sich beide. Wer zuerst erklärt, warum er so entschieden hat, bekommt den Punkt. Das Ziel ist nicht Gewinnen, sondern ein Gespräch.",
     ]},
    {h: "Experiment 1: Das Punkte-Labor, was ist eine Katze?",
     kurz: "Sie setzen Punkte in zwei Farben, als wären es Katzen und Hunde, und sehen, wie der Computer neue Punkte einsortiert.",
     p: [
      "Öffnen Sie {{ml|Maschinelles Lernen}} und suchen Sie das Spielfeld. Setzen Sie abwechselnd Punkte in zwei Farben. Stellen Sie sich vor: Eine Farbe sind Katzen, die andere Hunde, und jeder Punkt ist ein Tier mit zwei Messwerten, zum Beispiel Ohrenlänge und Gewicht. Der Computer sieht nur diese Zahlen, keine Tiere.",
      "Setzen Sie dann einen neuen Punkt mitten zwischen beide Farben. Welcher Farbe ordnet der Computer ihn zu? Probieren Sie aus, was passiert, wenn Sie nur sehr wenige Beispiele zeigen oder wenn alle Katzen auf einer Seite liegen. So lernt auch ein Computer: aus Beispielen, nicht aus einer Erklärung.",
     ],
     liste: [
      "Warum hat der Computer den Punkt so eingeordnet? Was hat er gesehen, und was nicht?",
      "Was wäre, wenn wir nur Beispiele von Katzen mit langen Ohren zeigen?",
      "Woran erkennst du selbst eine Katze? Würde das auch ein Computer können?",
     ]},
    {h: "Experiment 2: Eine KI-Antwort gemeinsam prüfen",
     kurz: "Das Kind fragt den Chat nach etwas, das es gut kennt. Sie prüfen die Antwort gegen eine zweite Quelle.",
     p: [
      "Öffnen Sie den {{chat|Chat}}. Das Kind wählt ein Thema, in dem es sich auskennt: das Lieblingsspiel, ein Tier, ein Hobby, der eigene Verein. Es stellt eine Frage dazu. Der Chat braucht manchmal einen Moment: Wenn viel los ist, warten Sie bis zu zwei Minuten.",
      "Jetzt prüfen Sie die Antwort gemeinsam: Was stimmt, was nicht? Suchen Sie eine zweite Quelle, ein Buch, eine Seite von Kenntnisreichen. Die Fünf-Schritte-Karte auf {{quellen-pruefen|Quellen prüfen}} hilft dabei. Meist liegt der Chat bei Einzelheiten daneben: Zahlen, Namen, Jahre.",
     ],
     liste: [
      "Wo lag der Chat richtig und wo falsch? Wie hast du es gemerkt?",
      "Warum klingt die Antwort trotzdem sicher?",
      "Was machst du, wenn du das Thema nicht kennst?",
     ]},
    {h: "Experiment 3: Echt oder KI? mit dem Kartenset",
     kurz: "Kartenset für zwei herunterladen, ausschneiden, nebeneinander legen und gemeinsam sortieren. Die Auflösung steht dabei.",
     p: [
      "Das Kartenset für zwei finden Sie oben auf dieser Seite zum Herunterladen, mit Auflösung und Spielregeln für zwei. Drucken Sie es aus und schneiden Sie die Karten aus. Sortieren Sie sie gemeinsam in zwei Stapel: echt und KI-erzeugt. Jeder begründet laut. Danach schauen Sie in die Auflösung.",
      "Lieber am Bildschirm? Das Online-Bilderspiel auf {{echt-oder-ki|Echt oder KI?}} löst sofort auf. Wichtig: Es gibt keine sichere Erkennung. Oft hilft nur die Herkunft, nicht das Bild.",
     ],
     liste: [
      "Woran habt ihr eure Entscheidung festgemacht? War es verlässlich?",
      "Was würdest du tun, wenn du so ein Bild in einer Gruppe siehst?",
      "Welches Codewort vereinbaren wir für Notfallanrufe?",
     ]},
    {h: "Was Sie Ihrem Kind sagen können",
     kurz: "Drei Sätze, die Druck herausnehmen: Wir probieren etwas aus. Die KI darf sich irren. Du darfst widersprechen.",
     liste: [
      "„Wir probieren etwas aus. Keiner muss gewinnen.“",
      "„Die KI darf sich irren. Genau das suchen wir.“",
      "„Du darfst mir widersprechen, auch wenn ich Erwachsener bin.“",
     ]},
    {h: "Danach reden",
     kurz: "Eine offene Frage zum Schluss reicht. Nicht belehren, zuhören.",
     p: [
      "Fragen Sie zum Abschluss: Was hat dich überrascht? Was würdest du anderen erzählen? Wann hilft dir KI, und wann lässt du sie lieber weg? Hören Sie zu und lassen Sie Antworten stehen. Mehr Gesprächsanlässe finden Sie auf {{eltern-zuhause|KI zu Hause}}.",
     ]},
  ],
  mitnehmen: [
    "Ein Gerät, zwei Personen, keine Kamera: das reicht für drei Experimente.",
    "Ein Computer lernt aus Beispielen. Zeigen Sie wenige oder einseitige, und er irrt sich.",
    "Das Gespräch danach ist wichtiger als das Ergebnis.",
  ],
  quiz: [
    {frage: "Was zeigt das Punkte-Labor?",
     optionen: ["Ein Computer lernt aus Beispielen und ordnet Neues nach ihnen ein", "Ein Computer weiß von selbst, was eine Katze ist", "Der Computer braucht dafür die Kamera", "Der Computer lernt nur aus einer Erklärung in Worten"],
     richtig: 0, erklaerung: "Das Verfahren sieht nur die gesetzten Punkte und ordnet neue nach ihnen ein. Mit wenigen oder einseitigen Beispielen irrt es sich."},
    {frage: "Der Chat nennt eine Zahl zu einem Thema, das Ihr Kind gut kennt. Was ist ein guter nächster Schritt?",
     optionen: ["Die Zahl glauben, weil der Chat sicher klingt", "Eine zweite Quelle suchen und die Zahl vergleichen", "Den Chat dieselbe Frage so lange stellen, bis die Zahl passt", "Das Thema künftig nicht mehr anfassen"],
     richtig: 1, erklaerung: "Ein Sprachmodell klingt auch dann sicher, wenn es sich irrt. Eine zweite Quelle zeigt, ob die Zahl stimmt."},
    {frage: "Warum begründen Sie beim Kartenset Ihre Entscheidung laut?",
     optionen: ["Damit der Punkt an den Schnelleren geht", "Weil die Karten sonst nicht ausgewertet werden können", "Damit Sie merken, woran Sie Ihre Entscheidung festmachen und ob das verlässlich ist", "Weil die Auflösung es verlangt"],
     richtig: 2, erklaerung: "Im Begründen zeigt sich, ob Sie auf Hinweise oder auf ein Bauchgefühl vertrauen. Das ist der Lerneffekt."},
  ],
  weiter: ["eltern-zuhause", "ml", "chat", "quellen-pruefen", "echt-oder-ki", "falscher-anruf", "ki-hausaufgaben-fair"],
};

S["bildschirmzeit"] = {
  nav: "Bildschirmzeit", typ: "lektion", gruppe: "Medienkompetenz", titel: "Bildschirmzeit: kurz und ehrlich", symbol: "smartphone", rollen: ["eltern"],
  lernziele: [
    "Sie können sagen, warum es keine einzelne richtige Zahl für alle Kinder gibt.",
    "Sie können mit Ihrem Kind Regeln vereinbaren, statt sie nur zu verordnen.",
    "Sie können sagen, wo die Seite endet und wo andere Stellen weiterhelfen.",
  ],
  kurz: "Wie viel Bildschirm ist in Ordnung? Hier steht, was sich ehrlich sagen lässt, was nicht, und wo Sie Rat bekommen. Keine Medizin und keine Versprechen.",
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
      "Wie sich Bildschirmzeit auf ein einzelnes Kind auswirkt, kann diese Seite nicht beurteilen. Sie nennt keine Grenzwerte und verspricht nichts. Wenn Ihr Kind sich stark zurückzieht, schlecht schläft oder Streit um das Gerät dominiert, sprechen Sie mit der Kinderärztin, dem Kinderarzt oder einer Beratungsstelle.",
      "Auch das KI-Labor ist nur ein Beispiel für Bildschirmzeit. Die Experimente dauern wenige Minuten und eignen sich gut für gemeinsame Zeit, siehe {{zusammen-ausprobieren|Zusammen ausprobieren}}. Sie ersetzen keine Regeln für Handy, Spiele und soziale Netze.",
     ]},
    {h: "Regeln gemeinsam vereinbaren",
     kurz: "Regeln, die das Kind mit aushandelt, halten länger als verordnete.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "messages-square", text: "Sprechen", sub: "was ist wichtig"},
      {icon: "handshake", text: "Vereinbaren", sub: "schriftlich festhalten"},
      {icon: "eye", text: "Nachsehen", sub: "nach ein paar Wochen"}]},
     p: [
      "Setzen Sie sich zusammen und legen Sie fest: Wann sind Geräte aus, zum Beispiel beim Essen und vor dem Schlafen? Welche Apps sind erlaubt? Was passiert bei Verstößen? Halten Sie es schriftlich fest und schauen Sie nach ein paar Wochen, ob es passt.",
      "Als Vorlage gibt es den kostenlosen Mediennutzungsvertrag von klicksafe und SCHAU HIN!. Gilt eine Regel für das Kind, gilt sie auch für Sie: Vorbild wirkt stärker als Verbot.",
     ]},
    {h: "Was Sie Ihrem Kind sagen können",
     kurz: "Sätze, die ein Gespräch öffnen, statt ein Verbot auszusprechen.",
     liste: [
      "„Was machst du gerade am liebsten am Handy? Zeig es mir.“",
      "„Lass uns zusammen aufschreiben, wann die Geräte aus sind. Du darfst mitentscheiden.“",
      "„Wenn dich etwas online ärgert oder erschreckt, komm zu mir. Du bekommst keinen Ärger.“",
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
    "Vereinbaren Sie Regeln gemeinsam und halten Sie sie schriftlich fest.",
    "Bei Sorgen: Kinderarzt oder Beratungsstelle fragen, nicht diese Seite.",
  ],
  grenzen: ["Keine medizinische, pädagogische oder rechtliche Beratung. Quellen am 22.11.2026 geprüft, Inhalte der verlinkten Stellen können sich ändern."],
  quiz: [
    {frage: "Was sagt diese Seite zur richtigen Bildschirmzeit?",
     optionen: ["Es gibt eine feste Zahl, die für alle Kinder gilt", "Eine Zahl für alle gibt es nicht, Alter, Inhalt und Begleitung zählen", "Bildschirmzeit ist grundsätzlich schädlich und sollte entfallen", "Sie ist nur für Kinder über zwölf ein Thema"],
     richtig: 1, erklaerung: "Außer für kleine Kinder gibt es keine einzelne belegte Grenze. Es kommt darauf an, was getan wird und wer dabei ist."},
    {frage: "Wie gehen Sie am besten mit Regeln um?",
     optionen: ["Streng allein festlegen, damit es keine Diskussion gibt", "Gar keine Regeln, das Kind lernt es allein", "Gemeinsam vereinbaren, aufschreiben und nach einigen Wochen prüfen", "Nur beim ersten Streit besprechen"],
     richtig: 2, erklaerung: "Regeln, die das Kind mit aushandelt, werden eher eingehalten. Aufschreiben und Prüfen hält sie lebendig."},
    {frage: "Ihr Kind schläft schlecht und zieht sich zurück. Was ist sinnvoll?",
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
