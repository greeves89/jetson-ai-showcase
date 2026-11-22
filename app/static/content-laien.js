/* Seite "Ist das sicher? Was wird gespeichert?" in einfacher Sprache, zusätzliche Alltagsbegriffe im Glossar und die
   Suchwörter (Synonyme) für die Suche im Menü. Die Seite ersetzt NICHT die Datenschutzerklärung auf der Hauptseite des Autors
   (module.json: seite.datenschutz_url), sie erklärt nur in Alltagssprache, was hier technisch passiert. */
(function () {

const S = {};

S["sicherheit-einfach"] = {
  nav: "Ist das sicher?", typ: "lektion", gruppe: "Der Rechner dahinter", titel: "Ist das sicher? Was wird gespeichert?", symbol: "shield-check",
  widget: "einwilligung-verwalten", widgetTitel: "Deine Zustimmungen",
  rechtslinks: true,
  kurz: "In Alltagssprache: Was diese Seite auf deinem Gerät ablegt, was mit Kamera, Mikrofon und eingetippten Texten passiert und was du selbst in der Hand hast.",
  abschnitte: [
    {h: "Die kurze Antwort",
     kurz: "Du brauchst kein Konto. Kamerabilder und Aufnahmen werden nicht gespeichert. Eingefügte Texte bleiben höchstens kurz im Arbeitsspeicher.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "user-check", text: "Kein Konto", sub: "Kostenlos, ohne Anmeldung"},
      {icon: "camera", text: "Kein Foto gespeichert", sub: "Bild und Ton nur zum Auswerten"},
      {icon: "clock", text: "Texte nur kurz", sub: "Danach vergisst sie der Rechner"}]},
     p: [
      "Das KI-Labor ist ein Lernangebot. Du kannst alles ausprobieren, ohne dich anzumelden und ohne etwas zu bezahlen. Auf dem Rechner dahinter wird nichts dauerhaft abgelegt, was du aufnimmst oder eintippst. Damit du genau weißt, was das heißt, steht es hier Punkt für Punkt.",
    ]},
    {h: "Was auf deinem Gerät gespeichert wird", id: "browser-eintraege",
     kurz: "Einige kleine Merkzettel im Browser und ein Cookie. Keine Werbung, keine Verfolgung. Nur das Cookie geht bei jedem Aufruf mit, die Merkzettel bleiben bei dir.",
     p: [
      "Damit die Seite funktioniert und sich merkt, was du eingestellt hast, legt sie ein paar kleine Einträge in deinem Browser ab. Ein [[cookie|Cookie]] gehört dazu und einige Einträge im [[localstorage|lokalen Speicher]]. Sie enthalten keine Namen und keine Texte von dir, und sie dienen nicht der Werbung.",
     ],
     tabelle: {
      beschriftung: "Was die Seite in deinem Browser ablegt",
      kopf: ["Name", "Wofür", "Wie lange"],
      zeilen: [
       ["`kl_s` (Cookie)", "Ordnet deine Beispiele und eingefügten Texte deiner Sitzung zu, damit sie nicht bei anderen Besuchern landen.", "Bis zu 24 Stunden. Die Daten dahinter verfallen schon nach 30 Minuten ohne Aktivität."],
       ["`kl-merken`", "Merkt, dass du erlaubt hast, deinen Lernfortschritt zu speichern. Ohne dieses Ja werden `kl-gelesen` und `kl-zuletzt` nicht angelegt, der Fortschritt gilt dann nur, bis du die Seite neu lädst. Du schaltest es im Willkommens-Fenster oder in der Fußzeile („Fortschritt merken“) um.", "Bis du es ausschaltest oder die Daten deines Browsers löschst."],
       ["`kl-willkommen`", "Merkt, dass du das Willkommens-Fenster schon gesehen hast, damit es nicht noch einmal kommt. Es enthält keine Angabe zu dir.", "Bis du die Daten deines Browsers löschst."],
       ["`kl-gelesen`", "Nur mit deinem Ja (`kl-merken`): Merkt, welche Seiten du bis zum Ende gelesen oder deren Quiz du abgeschlossen hast (der grüne Haken im Menü, die Prozentanzeige).", "Bis du „Fortschritt merken“ ausschaltest, auf der Startseite „Fortschritt löschen“ wählst oder die Daten deines Browsers löschst."],
       ["`kl-zuletzt`", "Nur mit deinem Ja (`kl-merken`): Merkt die Seite und die Stelle, an der du zuletzt gelesen hast (für „Weiter, wo du aufgehört hast“).", "Bis du die Daten deines Browsers löschst oder den Fortschritt löschst."],
       ["`kl-weg`", "Merkt, wenn du auf der Startseite einen Weg wählst (Schüler:in, Lehrende, KI verstehen, IT, Betrieb, Eltern): ein einziges Wort, das du selbst ausdrücklich wählst, kein Alter, keine Nummer. Ein Link wie `/?weg=schule` wirkt, ohne dass etwas gespeichert wird.", "Bis du die Auswahl aufhebst oder die Daten deines Browsers löschst."],
       ["`kl-mathe`", "Merkt, ob du den Schalter „Mit Mathe“ eingeschaltet hast.", "Bis du die Daten deines Browsers löschst."],
       ["`kl-hilfe`", "Nur mit deinem Ja (`kl-merken`): Merkt, dass du den Lesehinweis auf einer Lektion schon gesehen hast. Ohne Ja gilt das nur für diesen Tab (sessionStorage).", "Bis du die Daten deines Browsers löschst oder den Tab schließt."],
       ["`kl-nav-offen`", "Merkt, welche Menügruppen du aufgeklappt hast.", "Bis du die Daten deines Browsers löschst."],
       ["`kl-lesemodus`", "Merkt, ob du „Kurz lesen“ oder „Genau lesen“ gewählt hast.", "Bis du die Daten deines Browsers löschst."],
       ["`kl-einwilligung`", "Merkt, dass du der Kamera oder dem Mikrofon zugestimmt hast, damit die Frage nicht jedes Mal kommt. Die Zustimmung zur Gesichtserkennung wird nur bis zum Schließen des Tabs gemerkt.", "Bis du die Einwilligung widerrufst oder die Daten deines Browsers löschst."],
      ],
     },
     merke: "Du kannst das alles jederzeit selbst löschen: in den Einstellungen deines Browsers unter „Websitedaten“ oder „Cookies und Websitedaten“. Danach fängt die Seite wieder von vorn an."},
    {h: "Kamera und Mikrofon",
     kurz: "Kamera, Mikro und Gesicht ab 16 Jahren, Jüngere nur mit Einverständnis der Eltern, kein Alterscheck. Erst fragt dich diese Seite, dann dein Browser. Nichts wird gespeichert, und du kannst jederzeit stoppen.",
     p: [
      "Kamera und Mikrofon schalten sich nie von allein ein. Vor dem ersten Start zeigt dir die Seite eine kurze Erklärung, und du musst ausdrücklich zustimmen. Danach fragt dich noch dein Browser. Beide Fragen kannst du mit „Nein“ beantworten, die Beispielbilder und Beispieldaten funktionieren auch ohne Kamera und Mikrofon.",
     ], liste: [
      "**Alter:** Kamera, Mikrofon und Gesicht sind ab 16 Jahren gedacht. Jüngere nutzen sie nur mit Einverständnis der Eltern. Die Seite prüft kein Alter und fragt auch nicht danach. Im Unterricht brauchst du diese Labore nicht.",
      "**Gesichtserkennung:** Hier entstehen aus Gesichtern Zahlenlisten, mit denen man Gesichter wiedererkennen kann. Das sind besonders geschützte Daten. Darum fragt die Seite ausdrücklich mit einem Kontrollkästchen, das du selbst anklicken musst. Die Zustimmung gilt nur für die laufende Sitzung. Nutze nur dein eigenes Gesicht oder Personen, die zugestimmt haben, ab 16 Jahren, jüngere mit Einverständnis der Eltern.",
      "**Objekte:** Jedes Kamerabild geht nur für einen Augenblick an den Rechner dieser Seite. Er wertet es aus und schickt das Ergebnis zurück. Das Bild selbst wird nicht gespeichert.",
      "**Anlernen:** Der Rechner merkt sich für etwa 30 Minuten Zahlenwerte aus deinen Beispielbildern, nicht die Bilder selbst. Danach vergisst er sie, und andere Besucher sehen sie nie.",
      "**Pixel und Filter:** Das Bild bleibt in deinem Browser und wird gar nicht verschickt.",
      "**Sprache zu Text:** Die Aufnahme geht einmal an den Rechner. Er schreibt sie als Text auf und schickt den Text zurück. Die Aufnahme wird nicht gespeichert.",
      "**Stoppen:** Mit dem Stopp-Knopf oder indem du die Seite verlässt. Dann ist die Kamera sofort aus.",
     ]},
    {h: "Texte, die du eintippst",
     kurz: "Chat-Fragen und Dokumente werden auf dem Rechner dieser Seite verarbeitet. Ein KI-Dienst in der Cloud ist nicht beteiligt.",
     p: [
      "Alles, was du im Chat, in der RAG-Werkstatt oder beim Agenten eintippst, wird auf dem kleinen Rechner hinter dieser Seite verarbeitet. Das Sprachmodell läuft dort selbst, ein KI-Dienst in der Cloud ist nicht beteiligt. Auf dem Weg zum Rechner laufen deine Texte wie jede Verbindung über Vermittler: einen Server bei IONOS und den Tunneldienst von Cloudflare. Wir speichern sie nicht. Einzelheiten zu IONOS und Cloudflare stehen in der Datenschutzerklärung.",
      "Chat-Fragen werden nicht aufbewahrt. Texte, die du in die RAG-Werkstatt einfügst, bleiben für deine Sitzung im Arbeitsspeicher und verfallen nach 30 Minuten Ruhe. Andere Besucher sehen sie nicht.",
     ],
     alltag: "Gib trotzdem keine echten Namen, Passwörter, Kundendaten oder Gesundheitsdaten ein. Das gilt bei jedem Programm im Netz. Zum Ausprobieren reichen erfundene Beispiele, und die Seite bringt eigene mit."},
    {h: "Was der Server technisch sieht",
     kurz: "Wie jede Webseite sieht der Server technische Angaben zur Verbindung. Sie dienen dem Betrieb und dem Schutz vor Überlastung.",
     p: [
      "Wenn du eine Seite abrufst, sieht der Server technische Angaben wie deine Internetadresse und den Zeitpunkt. Das ist bei jeder Webseite so. Es dient dazu, die Seite auszuliefern und zu verhindern, dass einzelne Besucher den kleinen Rechner überlasten. Einzelheiten dazu und deine Rechte stehen in der Datenschutzerklärung.",
     ]},
    {h: "Was diese Seite nicht ist",
     kurz: "Diese Seite ist eine Erklärung in Alltagssprache. Verbindlich sind Impressum und Datenschutzerklärung.",
     p: [
      "Die Seite hier erklärt dir in einfachen Worten, was technisch passiert. Sie ersetzt nicht die Datenschutzerklärung. Dort stehen, wer verantwortlich ist, auf welcher Grundlage Daten verarbeitet werden und wie du deine Rechte nutzt, etwa auf Auskunft oder Löschung. Die Links dazu findest du unten.",
     ]},
  ],
  mitnehmen: [
    "Kein Konto, keine Bezahlung, keine Werbung.",
    "Kamera und Mikrofon starten nur, wenn du ausdrücklich zustimmst, und lassen sich jederzeit stoppen.",
    "Bilder und Aufnahmen werden nicht gespeichert. Texte verfallen nach 30 Minuten Ruhe.",
  ],
  weiter: ["start", "recht", "hardware"],
};

const glossar = {
  cookie: ["Cookie", "Eine winzige Textdatei, die eine Webseite in deinem Browser ablegt. Hier merkt sie sich nur eine zufällige Sitzungsnummer, damit deine Beispiele nicht bei anderen landen. Sie enthält keinen Namen."],
  localstorage: ["Lokaler Speicher", "Ein kleiner Bereich im Browser, in dem eine Seite Einstellungen ablegt, etwa welche Seiten du gelesen hast. Er bleibt auf deinem Gerät und wird nicht an den Server geschickt."],
  chatgpt: ["ChatGPT", "Ein bekannter Chatbot. Er beruht auf einem großen Sprachmodell. Das Labor zeigt dasselbe Prinzip mit einem kleineren Modell, das auf dem Rechner dieser Seite läuft: Es wählt Wort für Wort das nächste Stück."],
  backpropagation: ["Backpropagation (Rückpropagierung)", "Das Rechenverfahren beim Training eines Netzes. Es geht vom Fehler am Ausgang rückwärts durch die Schichten und berechnet, wie stark jedes Gewicht am Fehler beteiligt war. Danach wird jedes Gewicht ein kleines Stück angepasst."],
  deepfake: ["Deepfake", "Ein Bild, Video oder eine Stimme, die eine KI so verändert oder neu erzeugt hat, dass es echt wirkt, obwohl die Szene nie stattgefunden hat. Prüfe die Quelle, bevor du so etwas glaubst oder weiterschickst."],
  assistent: ["KI-Assistent", "Ein Programm, dem du in normaler Sprache Aufgaben gibst, zum Beispiel einen Text zu schreiben oder etwas nachzuschlagen. Meist steckt ein Sprachmodell dahinter, manchmal mit Werkzeugen (Agent)."],
};

/* Suchwörter: Alltagsbegriffe und Jugendsprache führen auf passende Seiten. Schlüssel ohne Umlaute und klein geschrieben
   (Umlaut: ae, oe, ue). Mehrere Wörter als Schlüssel gelten als eine Wortgruppe. "=seiten-id" lenkt gezielt auf eine Seite,
   die Reihenfolge in der Liste ist die Rangfolge; Wörter in der Liste zählen als Synonym für den Seitentext. */
INHALT.synonyme = {
  /* Chat und Assistenten */
  quellcode: ["=selbst-bauen", "=lizenzen"],
  kaufen: ["=selbst-bauen", "=hardware"],
  einkaufsliste: ["=selbst-bauen", "=hardware"],
  "jetson kaufen": ["=selbst-bauen", "=hardware"],
  anleitung: ["=selbst-bauen"],
  chatgpt: ["=chat", "=genki", "=tokens-sprachmodelle", "=prompting", "sprachmodell"],
  gpt: ["=chat", "=tokens-sprachmodelle", "=genki"],
  copilot: ["=chat", "=agenten-grundlagen", "=prompting"],
  "ki-assistent": ["=chat", "=agenten-grundlagen", "=prompting"],
  assistent: ["=chat", "=agenten-grundlagen", "=prompting"],
  chatbot: ["=chat", "=tokens-sprachmodelle", "=agenten-grundlagen"],
  alexa: ["=whisper", "=sprachausgabe", "=chat"],
  siri: ["=whisper", "=sprachausgabe", "=chat"],
  sprachassistent: ["=whisper", "=sprachausgabe", "=chat"],
  /* Schule und Lernen */
  hausaufgabe: ["=prompting", "=llm-grenzen", "=chat", "=recht"],
  hausaufgaben: ["=prompting", "=llm-grenzen", "=chat", "=recht"],
  schule: ["=prompting", "=llm-grenzen", "=karte", "=chat"],
  schueler: ["=karte", "=prompting", "=llm-grenzen"],
  schummeln: ["=llm-grenzen", "=recht", "=verzerrung-ethik", "=prompting"],
  spicken: ["=llm-grenzen", "=recht", "=verzerrung-ethik"],
  plagiat: ["=recht", "=llm-grenzen", "=lizenzen"],
  referat: ["=prompting", "=llm-grenzen", "=lizenzen", "=chat"],
  praesentation: ["=prompting", "=llm-grenzen", "=lizenzen"],
  lernen: ["=ml", "=training", "=neuronale-netze", "=karte"],
  quelle: ["=quellen-pruefen", "=lizenzen", "=llm-grenzen", "=rag-ueberblick", "=recht"],
  quellen: ["=quellen-pruefen", "=lizenzen", "=llm-grenzen", "=rag-ueberblick", "=recht"],
  zitieren: ["=lizenzen", "=llm-grenzen", "=recht"],
  /* Fälschungen und Medien */
  fake: ["=llm-grenzen", "=genki", "=verzerrung-ethik", "=recht"],
  "fake news": ["=fake-news-deepfakes", "=llm-grenzen", "=genki", "=verzerrung-ethik", "=empfehlungen"],
  fakenews: ["=fake-news-deepfakes", "=llm-grenzen", "=genki", "=verzerrung-ethik", "=empfehlungen"],
  desinformation: ["=llm-grenzen", "=genki", "=verzerrung-ethik"],
  deepfake: ["=genki", "=llm-grenzen", "=recht", "=verzerrung-ethik", "=gesicht"],
  deepfakes: ["=genki", "=llm-grenzen", "=recht", "=verzerrung-ethik", "=gesicht"],
  /* Apps und Plattformen */
  tiktok: ["=empfehlungen", "=gesicht", "=verzerrung-ethik", "=cnn-intuition"],
  instagram: ["=empfehlungen", "=gesicht", "=verzerrung-ethik", "=bild-als-zahlen"],
  snapchat: ["=gesicht", "=cnn-intuition", "=bild-als-zahlen", "=objekt"],
  "snapchat-filter": ["=gesicht", "=cnn-intuition", "=bild-als-zahlen", "=objekt"],
  "snapchat filter": ["=gesicht", "=cnn-intuition", "=bild-als-zahlen", "=objekt"],
  filter: ["=cnn-intuition", "=bild-als-zahlen", "=gesicht"],
  youtube: ["=empfehlungen", "=verzerrung-ethik", "=whisper"],
  netflix: ["=empfehlungen", "=verzerrung-ethik"],
  spotify: ["=empfehlungen", "=sprachausgabe", "=verzerrung-ethik"],
  musik: ["=empfehlungen", "=sprachausgabe", "=lizenzen"],
  empfehlung: ["=empfehlungen", "=rag-suche"],
  google: ["=rag-suche", "=rag-ueberblick", "=chat"],
  suchmaschine: ["=rag-suche", "=rag-ueberblick", "=chat"],
  /* Handy und Gesicht */
  "handy entsperren": ["=gesicht", "=verzerrung-ethik", "=recht", "=sicherheit-einfach"],
  "gesichtserkennung am handy": ["=gesicht", "=verzerrung-ethik", "=recht", "=sicherheit-einfach"],
  "face id": ["=gesicht", "=verzerrung-ethik", "=recht"],
  gesichtserkennung: ["=gesicht", "=uc-sicherheit-zutritt", "=verzerrung-ethik", "=recht"],
  entsperren: ["=gesicht", "=sicherheit-einfach", "=recht"],
  handy: ["=gesicht", "=objekt", "=bild-als-zahlen", "=hardware"],
  smartphone: ["=gesicht", "=objekt", "=bild-als-zahlen", "=hardware"],
  foto: ["=bild-als-zahlen", "=gesicht", "=objekt", "=cnn-intuition"],
  fotos: ["=bild-als-zahlen", "=gesicht", "=objekt", "=cnn-intuition"],
  bilder: ["=bild-als-zahlen", "=cnn-intuition", "=objekt", "=genki"],
  "bilder malen": ["=genki", "=bild-als-zahlen", "=cnn-intuition"],
  "bild erzeugen": ["=genki", "=bild-als-zahlen", "=cnn-intuition"],
  "bilder erzeugen": ["=genki", "=bild-als-zahlen", "=cnn-intuition"],
  kamera: ["=gesicht", "=objekt", "=bild-als-zahlen", "=sicherheit-einfach"],
  video: ["=objekt", "=gesicht", "=uc-logistik-zaehlen"],
  navi: ["=agenten-planung", "=robotik", "=agenten-grundlagen"],
  spiel: ["=experimente", "=ml", "=llm-grenzen", "=agenten-planung", "=robotik"],
  spiele: ["=experimente", "=ml", "=llm-grenzen", "=agenten-planung", "=robotik"],
  game: ["=experimente", "=ml", "=llm-grenzen", "=agenten-planung", "=robotik"],
  spielfeld: ["=experimente", "=ml", "=neuronale-netze", "=llm-grenzen"],
  experiment: ["=experimente", "=ml", "=chat", "=prompting"],
  experimente: ["=experimente", "=ml", "=chat", "=prompting"],
  ausprobieren: ["=experimente", "=chat", "=ml", "=prompting"],
  "selbst ausprobieren": ["=experimente", "=chat", "=ml"],
  quiz: ["=karte", "=ml", "=llm-grenzen", "=bewertung", "=neuronale-netze"],
  selbsttest: ["=karte", "=ml", "=llm-grenzen", "=bewertung"],
  auto: ["=objekt", "=uc-logistik-zaehlen", "=uc-sicherheit-baustelle"],
  /* Gehirn, Netze, Training */
  gehirn: ["=neuronale-netze", "=ml", "=training", "neuron"],
  neuron: ["=neuronale-netze", "=training", "=cnn-intuition"],
  backpropagation: ["=training", "=neuronale-netze", "rueckpropagierung"],
  backprop: ["=training", "=neuronale-netze", "backpropagation", "rueckpropagierung"],
  rueckpropagierung: ["=training", "=neuronale-netze", "backpropagation"],
  roboter: ["=robotik", "=agenten-grundlagen", "=agent"],
  /* Verantwortung, Recht, Datenschutz */
  "wer haftet": ["=recht", "=verzerrung-ethik", "=agenten-sicherheit", "=ki-einfuehrung"],
  haftung: ["=recht", "=verzerrung-ethik", "=agenten-sicherheit", "=ki-einfuehrung"],
  haftet: ["=recht", "=verzerrung-ethik", "=agenten-sicherheit"],
  verantwortung: ["=verzerrung-ethik", "=recht", "=agenten-sicherheit"],
  urheberrecht: ["=recht", "=lizenzen", "=llm-grenzen"],
  copyright: ["=recht", "=lizenzen", "=llm-grenzen"],
  lizenz: ["=lizenzen", "=recht"],
  datenschutz: ["=recht", "=sicherheit-einfach", "=daten", "dsgvo", "personenbezogen"],
  dsgvo: ["=recht", "=sicherheit-einfach", "datenschutz", "personenbezogen"],
  privatsphaere: ["=sicherheit-einfach", "=recht", "datenschutz", "personenbezogen"],
  sicher: ["=sicherheit-einfach", "=agenten-sicherheit", "=recht", "gespeichert"],
  sicherheit: ["=sicherheit-einfach", "=agenten-sicherheit", "=recht", "gespeichert"],
  passwort: ["=sicherheit-einfach", "=agenten-sicherheit"],
  cookie: ["=sicherheit-einfach", "gespeichert", "localstorage"],
  /* Fehler und Grenzen */
  halluzination: ["=llm-grenzen", "=chat", "erfunden", "falsch"],
  halluzinieren: ["=llm-grenzen", "=chat", "halluzination", "erfunden"],
  erfinden: ["=llm-grenzen", "halluzination", "erfunden"],
  luegen: ["=llm-grenzen", "halluzination", "erfunden"],
  /* Betrug und Antworten prüfen */
  betrug: ["=echt-oder-ki", "=fake-news-deepfakes", "=datenschutz-im-alltag", "=quellen-pruefen"],
  betrugsmasche: ["=echt-oder-ki", "=fake-news-deepfakes", "=datenschutz-im-alltag", "betrug"],
  enkeltrick: ["=echt-oder-ki", "=fake-news-deepfakes", "=quellen-pruefen", "betrug", "stimme"],
  "enkel trick": ["=echt-oder-ki", "=fake-news-deepfakes", "=quellen-pruefen", "betrug", "stimme"],
  schockanruf: ["=echt-oder-ki", "=fake-news-deepfakes", "=quellen-pruefen", "betrug", "stimme"],
  phishing: ["=echt-oder-ki", "=fake-news-deepfakes", "=datenschutz-im-alltag", "betrug"],
  "fake anruf": ["=echt-oder-ki", "=fake-news-deepfakes", "=quellen-pruefen", "betrug", "stimme"],
  "ki antwort pruefen": ["=quellen-pruefen", "=echt-oder-ki", "=llm-grenzen", "=schule-stunde-3"],
  "antwort pruefen": ["=quellen-pruefen", "=echt-oder-ki", "=llm-grenzen", "=schule-stunde-3"],
  "quellen pruefen": ["=quellen-pruefen", "=echt-oder-ki", "=lizenzen"],
  faktencheck: ["=quellen-pruefen", "=echt-oder-ki", "=fake-news-deepfakes"],
  /* Betrieb: Handwerk, Wirtschaftlichkeit, Qualität, Lager */
  elektriker: ["=uc-handwerk", "handwerk", "angebot", "rechnung"],
  handwerker: ["=uc-handwerk", "handwerk", "angebot", "rechnung"],
  roi: ["=kosten-energie", "=ki-einfuehrung", "=business", "amortisation", "kosten"],
  wirtschaftlichkeit: ["=kosten-energie", "=ki-einfuehrung", "=business", "amortisation", "kosten"],
  rentabilitaet: ["=kosten-energie", "=ki-einfuehrung", "=business", "amortisation", "kosten"],
  qualitaetspruefung: ["=uc-fertigung-sichtpruefung", "=uc-fertigung-sortieren", "=anomalien", "ausschuss"],
  qualitaetskontrolle: ["=uc-fertigung-sichtpruefung", "=uc-fertigung-sortieren", "=anomalien", "ausschuss"],
  "zaehlen im lager": ["=uc-logistik-zaehlen", "=uc-handel-regal", "=objekt"],
  "lager zaehlen": ["=uc-logistik-zaehlen", "=uc-handel-regal", "=objekt"],
  /* Büro und Betrieb */
  firma: ["=ki-einfuehrung", "=business", "=mlops"],
  unternehmen: ["=ki-einfuehrung", "=business", "=mlops"],
  betrieb: ["=mlops", "=ki-einfuehrung", "=business"],
  handwerk: ["=uc-handwerk", "angebot", "rechnung", "baustelle"],
  angebot: ["=uc-handwerk", "=prompting", "=uc-buero-dokumente"],
  rechnung: ["=uc-handwerk", "=uc-buero-dokumente", "=rag-ueberblick"],
  dokumente: ["=uc-buero-dokumente", "=rag-ueberblick", "=rag", "pdf"],
  pdf: ["=uc-buero-dokumente", "=rag-ueberblick", "=rag"],
  excel: ["=tabellen-ml", "=daten", "=uc-buero-dokumente"],
  tabelle: ["=tabellen-ml", "=daten"],
  mail: ["=prompting", "=uc-buero-dokumente", "=agenten-sicherheit"],
  email: ["=prompting", "=uc-buero-dokumente", "=agenten-sicherheit"],
  "e-mail": ["=prompting", "=uc-buero-dokumente", "=agenten-sicherheit"],
  protokoll: ["=uc-buero-protokoll", "=whisper"],
  besprechung: ["=uc-buero-protokoll", "=whisper"],
  uebersetzen: ["=chat", "=whisper", "=tokens-sprachmodelle"],
  vektorisierung: ["=rag-embedding", "embedding", "vektorisieren", "bedeutungskarte"],
  vektorisieren: ["=rag-embedding", "embedding", "vektorisierung", "bedeutungskarte"],
  einbetten: ["=rag-embedding", "embedding", "vektorisieren"],
  einbettung: ["=rag-embedding", "embedding", "vektorisieren"],
  vektor: ["=rag-embedding", "vektorsuche"],
  vektoren: ["=rag-embedding", "vektorsuche"],
  /* Kosten, Technik */
  preis: ["=kosten-energie", "kosten", "energie"],
  kosten: ["=kosten-energie", "=ki-einfuehrung"],
  geld: ["=kosten-energie", "=ki-einfuehrung"],
  strom: ["=kosten-energie", "=hardware", "watt"],
  wetter: ["=zeitreihen", "=ml", "=neuronale-netze"],
  stimme: ["=whisper", "=sprachausgabe", "=chat"],
  sprache: ["=chat", "=whisper", "=sprachausgabe", "=tokens-sprachmodelle"],
  mikrofon: ["=whisper", "=sprachausgabe", "=sicherheit-einfach"],
  vorlesen: ["=sprachausgabe", "stimme"],
};
/* Beliebte Suchen: Vorschläge, wenn nichts gefunden wird */
INHALT.sucheVorschlaege = ["Chat", "Datenschutz", "Hausaufgaben", "Bilder", "Roboter", "Kosten"];

/* Einsteigerseiten: im Menü mit "Einsteiger" markiert, im Seitenkopf als "Für Einsteiger" */
for (const id of ["karte", "ml", "genki", "business", "gesicht", "objekt", "chat"]) if (INHALT.seiten[id]) INHALT.seiten[id].anfaenger = true;

/* ---------- Lernplattform: Lernpfade, Wege, Hinweise (gelesen von app.js) ----------
   lernpfade   benannte Pfade. stufe 1 bis 4 (Verstehen, Anwenden, Erstellen, Bewerten, Kompetenzrahmen in docs/jugendpaedagogik.md)
               oder rolle ("schule", "lehrende", "erwachsene", "technik", "beruf", "eltern"). Seiten-IDs, die es (noch) nicht gibt, werden still übergangen.
   kameraSeiten  Labore mit Kamera, Mikrofon oder Gesicht: im Weg "schule" im Menü und in Pfaden gekennzeichnet, nie im Schulpfad empfohlen.
   alterHinweis  der Satz zu 16+ (Startseite, Seite "Ist das sicher?"); die Seite prüft kein Alter.
   lernzieleErgaenzung  Lernziele für Seiten aus Dateien, in denen kein Feld "lernziele" steht (Seitenfeld hat Vorrang). */
INHALT.lernpfade = [
  {id: "verstehen", stufe: 1, name: "Verstehen", kurz: "Was KI ist, wie sie lernt und woran sie scheitert. Ohne Vorkenntnisse.",
   seiten: ["karte", "ml", "genki", "daten", "neuronale-netze", "training", "tokens-sprachmodelle", "bild-als-zahlen", "cnn-intuition"]},
  {id: "anwenden", stufe: 2, name: "Anwenden", kurz: "KI selbst benutzen: fragen, hören, sehen, nachschlagen, Aufgaben abgeben.",
   seiten: ["chat", "prompting", "prompts-fuer-schueler", "whisper", "objekt", "rag-ueberblick", "agenten-grundlagen", "finetuning-oder-rag", "empfehlungen"]},
  {id: "erstellen", stufe: 3, name: "Erstellen", kurz: "Eigene Bausteine bauen: Bildmodell anlernen, Dokumente durchsuchen, Agenten planen.",
   seiten: ["anlernen", "tabellen-ml", "zeitreihen", "rag-embedding", "rag-chunking", "rag-suche", "rag-reranking", "agenten-planung", "mcp-werkzeuge", "mlops"]},
  {id: "bewerten", stufe: 4, name: "Bewerten", kurz: "Grenzen erkennen, Ergebnisse prüfen, Verantwortung tragen.",
   seiten: ["llm-grenzen", "echt-oder-ki", "quellen-pruefen", "fake-news-deepfakes", "bewertung", "verzerrung-ethik", "anomalien", "agenten-sicherheit", "rag-bewertung", "recht", "datenschutz-im-alltag", "kosten-energie"]},
  {id: "erwachsene", rolle: "erwachsene", name: "KI verstehen, Schritt für Schritt", kurz: "Erst Betrug erkennen, dann die Grundlagen: Daten, Lernen, Netze, Sprachmodelle und Dokumentensuche. Ohne Vorwissen.",
   seiten: ["karte", "echt-oder-ki", "fake-news-deepfakes", "ml", "neuronale-netze", "daten", "training", "tokens-sprachmodelle", "rag-ueberblick"]},
  {id: "schule-einstieg", rolle: "schule", name: "Schule: Einstieg", kurz: "Erst ausprobieren, dann prüfen und fair nutzen. Alles ohne Kamera und Mikrofon.",
   seiten: ["experimente", "echt-oder-ki", "ki-hausaufgaben-fair", "prompts-fuer-schueler", "schueler-alltag-ki", "ml", "quellen-pruefen", "datenschutz-im-alltag"]},
  {id: "schule-vertiefung", rolle: "schule", name: "Schule: Vertiefung", kurz: "Wie Daten, Netze und Training zusammenspielen, mit Rechnen und Ausprobieren.",
   seiten: ["daten", "neuronale-netze", "training", "bewertung", "bild-als-zahlen", "cnn-intuition", "verzerrung-ethik"]},
  {id: "beruf", rolle: "beruf", name: "KI im Betrieb", kurz: "Nutzen, Kosten, Risiken und Einführung, mit Beispielen aus der Praxis. Die ersten vier Schritte sind der Überblick „In 15 Minuten“, dann folgt das Beispiel aus dem Handwerk.",
   seiten: ["karte", "chat", "business", "ki-einfuehrung", "uc-handwerk", "kosten-energie", "mlops", "recht", "verzerrung-ethik", "uc-buero-dokumente"]},
  {id: "lehrende", rolle: "lehrende", name: "Unterricht vorbereiten", kurz: "Handreichung, Stundenverläufe und Informationen für Schulleitung und Eltern.",
   seiten: ["schule-lehrkraefte", "schule-start", "schule-stunde-1", "schule-stunde-2", "schule-stunde-3", "schule-schulleitung", "schule-eltern", "sicherheit-einfach", "recht"]},
];
INHALT.lernpfade.push(
  {id: "eltern", rolle: "eltern", name: "Für Eltern", kurz: "Wie KI im Alltag von Kindern vorkommt, was mit Daten passiert und wie ihr darüber sprecht. Zum Ausprobieren zusammen, ohne Kamera.",
   seiten: ["eltern-zuhause", "karte", "experimente", "quellen-pruefen", "ki-hausaufgaben-fair", "datenschutz-im-alltag", "sicherheit-einfach"]},
  {id: "technik", rolle: "technik", name: "Selbst tüfteln", kurz: "Vom Rechner dahinter über Lernen und Netze bis zu Dokumentensuche und Agenten.",
   seiten: ["selbst-bauen", "hardware", "ml", "neuronale-netze", "rag-ueberblick", "agenten-grundlagen"]},
);
INHALT.kameraSeiten = ["gesicht", "objekt", "anlernen", "whisper", "faceswap", "uc-sicherheit-zutritt"];
/* Menü und Startseite je Rolle (gelesen von app.js, nur Darstellung im Browser).
   menue.fuerDich     je Rolle höchstens sechs Seiten: der Block "Für dich" im Menü, aufgeklappt.
   menue.reihenfolge  je Rolle die Gruppen im zugeklappten Block "Alle Bereiche", die genannten zuerst; "Sicherheit" ist eine Sammelgruppe (menue.sammel).
   startRollen        je Rolle Überschrift, ein Satz, die Blöcke der Startseite (experimente, morgen, minuten, empfohlen, repo) und die Karten:
                      empfohlen/morgen [{id, satz, h?}] mit einem kurzen Satz; "ohne" gilt, wenn keine Rolle gewählt ist. */
INHALT.menue = {
  fuerDich: {
    schule: ["experimente", "chat", "echt-oder-ki", "ki-hausaufgaben-fair", "prompts-fuer-schueler", "karte"],
    lehrende: ["schule-lehrkraefte", "schule-stunde-1", "schule-stunde-2", "schule-stunde-3", "schule-schulleitung", "schule-eltern"],
    erwachsene: ["karte", "echt-oder-ki", "fake-news-deepfakes", "ml", "daten", "neuronale-netze"],
    technik: ["selbst-bauen", "hardware", "lizenzen", "rag-ueberblick", "agenten-grundlagen"],
    beruf: ["uc-handwerk", "uc-buero-dokumente", "uc-fertigung-sichtpruefung", "business", "ki-einfuehrung", "kosten-energie"],
    eltern: ["eltern-zuhause", "karte", "experimente", "quellen-pruefen", "ki-hausaufgaben-fair", "sicherheit-einfach"],
  },
  reihenfolge: {
    schule: ["Experimente", "Medienkompetenz", "Grundlagen"],
    lehrende: ["Für die Schule", "Medienkompetenz", "Grundlagen"],
    erwachsene: ["Grundlagen", "Medienkompetenz", "Sprache"],
    technik: ["Der Rechner dahinter", "Wissen und RAG", "Agenten", "Sprache", "Sehen"],
    beruf: ["KI im Betrieb", "Business-Use-Cases", "Sicherheit"],
    eltern: ["Medienkompetenz", "Sicherheit", "Für die Schule"],
  },
  sammel: {Sicherheit: ["sicherheit-einfach", "datenschutz-im-alltag", "agenten-sicherheit", "recht"]},
};
INHALT.startRollen = {
  ohne: {h1: "KI verstehen, indem du sie ausprobierst", satz: "Frag eine [[ki|KI]], lass Bilder erkennen, höre Sprache. Kostenlos und ohne Anmeldung."},
  schule: {h1: "Experimente, leicht erklärt", satz: "Probiere aus, wie KI arbeitet. Ohne Kamera und ohne Anmeldung.",
    bloecke: ["experimente", "empfohlen"],
    empfohlen: [
      {id: "echt-oder-ki", satz: "Woran du Fälschungen von KI erkennst."},
      {id: "ki-hausaufgaben-fair", satz: "Wann KI beim Lernen hilft und wann sie schummeln ist."},
      {id: "prompts-fuer-schueler", satz: "So fragst du, damit die Antwort brauchbar wird."}]},
  lehrende: {h1: "Für morgen im Unterricht", satz: "Drei Stunden, Handreichung und Info für die Schulleitung, sofort einsetzbar.",
    bloecke: ["morgen"],
    morgen: [
      {id: "schule-stunde-1", satz: "45 Minuten ohne Kamera, mit Aufgaben und Lösungen."},
      {id: "schule-stunde-2", satz: "Daten, Training und Fehler zum Anfassen."},
      {id: "schule-stunde-3", satz: "Erfundenes erkennen und Quellen prüfen."},
      {id: "schule-lehrkraefte", satz: "Checkliste, Fachbegriffe und Kurzantworten."},
      {id: "schule-schulleitung", satz: "Daten, Verantwortung und was die Schule entscheidet."}]},
  erwachsene: {h1: "KI verstehen, Schritt für Schritt", satz: "Neun kurze Seiten: erst Betrug erkennen, dann die Grundlagen. Ohne Vorwissen.",
    bloecke: ["empfohlen"], pfad: "erwachsene",
    empfohlen: [
      {id: "karte", satz: "Eine Landkarte der Begriffe in zwei Minuten."},
      {id: "echt-oder-ki", satz: "Woran du Fälschungen, falsche Anrufe und Betrug erkennst."},
      {id: "fake-news-deepfakes", satz: "Wie Falschmeldungen entstehen und was du dagegen tust."},
      {id: "ml", satz: "Statt Regeln zeigst du Beispiele, das Verfahren lernt daraus."},
      {id: "neuronale-netze", satz: "Wie ein Netz aus kleinen Rechenstellen entscheidet."},
      {id: "daten", satz: "Ein Modell lernt nur, was in seinen Daten steckt."},
      {id: "training", satz: "Wie ein Modell Schritt für Schritt besser wird."},
      {id: "tokens-sprachmodelle", satz: "Wie aus Text ein Modell wird, das Fragen beantwortet."},
      {id: "rag-ueberblick", satz: "Antworten aus eigenen Dokumenten."}]},
  technik: {h1: "Die Technik dahinter", satz: "Selbst aufbauen, Hardware ansehen, Modelle und Quellcode prüfen.",
    bloecke: ["empfohlen", "repo"],
    empfohlen: [
      {id: "selbst-bauen", satz: "Einkaufsliste, Befehle zum Kopieren und häufige Fehler. Der Aufbau dauert einen halben bis ganzen Tag."},
      {id: "hardware", satz: "Der Rechner dahinter, mit Messwerten live."},
      {id: "lizenzen", h: "Modelle und Lizenzen", satz: "Welche Modelle hier laufen und unter welcher Lizenz."}],
    repo: {titel: "Quellcode auf GitHub", satz: "Das Repo ist öffentlich, mit Anleitung und Vorab-Check.", href: "https://github.com/greeves89/jetson-ai-showcase", knopf: "Repo öffnen"}},
  beruf: {h1: "Was KI deinem Betrieb bringt", satz: "Einsatzfälle aus der Praxis und der Überblick in 15 Minuten.",
    bloecke: ["minuten", "empfohlen"],
    empfohlen: [
      {id: "uc-handwerk", satz: "Angebot, Baustellenfoto und Rechnung: Schreibarbeit im Handwerk."},
      {id: "uc-buero-dokumente", satz: "Fragen an Dokumente, mit Quelle beantwortet."},
      {id: "uc-service-bestellung", satz: "Ein Agent beantwortet Bestellfragen mit Werkzeugen."},
      {id: "uc-fertigung-sichtpruefung", satz: "Ausschuss mit wenigen Beispielbildern erkennen."}]},
  eltern: {h1: "KI im Alltag deiner Kinder", satz: "Was ist sicher, was passiert mit Daten, woran erkennst du Erfundenes?",
    bloecke: ["empfohlen"],
    empfohlen: [
      {id: "eltern-zuhause", satz: "Ist das Labor sicher für Kinder? Was ihr zu Hause wissen solltet."},
      {id: "experimente", satz: "Zusammen ausprobieren, ganz ohne Kamera."},
      {id: "quellen-pruefen", satz: "Wem man glauben kann: ein Gespräch mit dem Kind."},
      {id: "sicherheit-einfach", satz: "Was gespeichert wird und was nicht."}]},
};
INHALT.alterHinweis = "Kamera, Mikro und Gesicht ab 16 Jahren, Jüngere nur mit Einverständnis der Eltern, kein Alterscheck.";
/* Willkommens-Fenster (laien.js): einmal beim ersten Besuch der Startseite. Die Knopftexte kommen aus den Wegen in app.js (WEGE.titel). */
INHALT.willkommen = {
  titel: "Willkommen im KI-Labor",
  satz: "Für wen darf es sein? Dann zeige ich dir den passenden Einstieg.",
  spaeter: "Später",
  schliessen: "Schließen",
  hinweis: "Nichts wird gesendet, deine Wahl bleibt nur in deinem Browser.",
  merken: "Meinen Lernfortschritt in diesem Browser merken",
  kamera: {schule: "Kamera, Mikro und Gesicht ab 16, im Schulpfad nicht nötig."},
};
INHALT.lernzieleErgaenzung = {
  "uc-fertigung-sichtpruefung": ["Du kannst beschreiben, wie wenige Beispielbilder reichen, um Gutteile von Ausschuss zu trennen.", "Du kannst sagen, warum gleiche Aufnahmebedingungen wichtig sind.", "Du kannst erklären, warum ein Mensch Stichproben zieht."],
  "uc-fertigung-sortieren": ["Du kannst erklären, wie Teile aus wenigen Beispielen nach Typ sortiert werden.", "Du kannst sagen, was die Kamera liefert und was der Betrieb selbst leisten muss."],
  "uc-logistik-zaehlen": ["Du kannst erklären, wie Objekterkennung Fahrzeuge zählt.", "Du kannst sagen, warum kleine und verdeckte Objekte fehlen.", "Du kannst planen, wie ein Pilot mit Handzählung prüft, ob die Zahl reicht."],
  "uc-handel-regal": ["Du kannst sagen, was Objekterkennung am Regal kann und was nicht.", "Du kannst erklären, warum erst der Vergleich mit einem Soll aus der Zahl einen Hinweis macht.", "Du kannst den Datenschutz bei Kameras im Laden ansprechen."],
  "uc-gesundheit-auffaellig": ["Du kannst erklären, wie eine Zweitmeinung durch KI funktioniert, ohne selbst zu entscheiden.", "Du kannst sagen, warum ein übersehener Fall schwerer wiegt als eine unnötige Meldung.", "Du kannst beschreiben, wo die Verantwortung bleibt."],
  "uc-buero-dokumente": ["Du kannst erklären, wie ein System Fragen aus Dokumenten mit Quelle beantwortet.", "Du kannst mit einer Fangfrage Erfundenes erkennen.", "Du kannst sagen, warum Aktualität und Zugriffsrechte zählen."],
  "uc-buero-protokoll": ["Du kannst beschreiben, wie Sprache lokal zu Text wird.", "Du kannst sagen, welche Stellen im Entwurf immer zu prüfen sind.", "Du kannst nennen, was vor einer Aufnahme geklärt sein muss."],
  "uc-service-bestellung": ["Du kannst erklären, wie ein Agent mit Werkzeugen Bestellfragen beantwortet.", "Du kannst lesende und handelnde Werkzeuge unterscheiden.", "Du kannst am Schrittverlauf erkennen, ob der Agent das richtige Werkzeug nahm."],
  "uc-sicherheit-zutritt": ["Du kannst Detektion und Identifikation unterscheiden.", "Du kannst nennen, was bei Gesichtern vor der Technik geklärt sein muss.", "Du kannst sagen, was das Beispiel zeigt und warum es nichts speichert."],
  "uc-sicherheit-baustelle": ["Du kannst erklären, was ein Personenmodell erkennt und was nicht.", "Du kannst sagen, warum Erkanntwerden kein Beweis für Schutz ist.", "Du kannst nennen, was Personenerkennung am Arbeitsplatz rechtlich braucht."],
  "uc-handwerk": ["Du kannst drei Aufgaben im Handwerk nennen, bei denen KI Schreibarbeit abnimmt.", "Du kannst sagen, warum Angebote und Rechnungen vor dem Versenden geprüft werden."],
  "sicherheit-einfach": ["Du kannst sagen, was die Seite in deinem Browser speichert.", "Du kannst erklären, was mit Kamera, Mikrofon und eingetippten Texten passiert.", "Du kannst deine Zustimmungen selbst widerrufen und deine Daten löschen."],
  "ueber": ["Du kannst sagen, wer hinter dem KI-Labor steht und wie es betrieben wird.", "Du kannst erklären, wie die Labore arbeiten und wo ihre Grenzen liegen."],
  "lizenzen": ["Du kannst nachlesen, welche Modelle, Stimmen und Fotos hier laufen und unter welcher Lizenz.", "Du kannst KI-erzeugte Inhalte im Labor erkennen."],
};

INHALT.registriere({
  seiten: S,
  glossar,
  gruppen: [{ name: "Der Rechner dahinter", seiten: ["sicherheit-einfach"] }],
});
})();
