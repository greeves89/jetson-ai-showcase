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
    {h: "Was auf deinem Gerät gespeichert wird",
     kurz: "Vier kleine Merkzettel im Browser und ein Cookie. Keine Werbung, keine Verfolgung.",
     p: [
      "Damit die Seite funktioniert und sich merkt, was du eingestellt hast, legt sie ein paar kleine Einträge in deinem Browser ab. Ein [[cookie|Cookie]] gehört dazu und einige Einträge im [[localstorage|lokalen Speicher]]. Sie enthalten keine Namen und keine Texte von dir, und sie dienen nicht der Werbung.",
     ],
     tabelle: {
      beschriftung: "Was die Seite in deinem Browser ablegt",
      kopf: ["Name", "Wofür", "Wie lange"],
      zeilen: [
       ["`kl_s` (Cookie)", "Ordnet deine Beispiele und eingefügten Texte deiner Sitzung zu, damit sie nicht bei anderen Besuchern landen.", "Bis zu 24 Stunden. Die Daten dahinter verfallen schon nach 30 Minuten ohne Aktivität."],
       ["`kl-besucht`", "Merkt, welche Seiten du schon gelesen hast (der grüne Haken im Menü).", "Bis du die Daten deines Browsers löschst."],
       ["`kl-nav-offen`", "Merkt, welche Menügruppen du aufgeklappt hast.", "Bis du die Daten deines Browsers löschst."],
       ["`kl-lesemodus`", "Merkt, ob du „Kurz lesen“ oder „Genau lesen“ gewählt hast.", "Bis du die Daten deines Browsers löschst."],
       ["`kl-einwilligung`", "Merkt, dass du der Kamera oder dem Mikrofon zugestimmt hast, damit die Frage nicht jedes Mal kommt. Die Zustimmung zur Gesichtserkennung wird nur bis zum Schließen des Tabs gemerkt.", "Bis du die Einwilligung widerrufst oder die Daten deines Browsers löschst."],
      ],
     },
     merke: "Du kannst das alles jederzeit selbst löschen: in den Einstellungen deines Browsers unter „Websitedaten“ oder „Cookies und Websitedaten“. Danach fängt die Seite wieder von vorn an."},
    {h: "Kamera und Mikrofon",
     kurz: "Erst fragt dich diese Seite, dann dein Browser. Nichts wird gespeichert, und du kannst jederzeit stoppen.",
     p: [
      "Kamera und Mikrofon schalten sich nie von allein ein. Vor dem ersten Start zeigt dir die Seite eine kurze Erklärung, und du musst ausdrücklich zustimmen. Danach fragt dich noch dein Browser. Beide Fragen kannst du mit „Nein“ beantworten, die Beispielbilder und Beispieldaten funktionieren auch ohne Kamera und Mikrofon.",
     ], liste: [
      "**Gesichtserkennung und Anlernen:** Hier entstehen aus Gesichtern Zahlenlisten, mit denen man Gesichter wiedererkennen kann. Das sind besonders geschützte Daten. Darum fragt die Seite ausdrücklich mit einem Kontrollkästchen, das du selbst anklicken musst. Die Zustimmung gilt nur für die laufende Sitzung. Nutze nur dein eigenes Gesicht oder Personen, die zugestimmt haben, ab 16 Jahren, jüngere mit Einverständnis der Eltern.",
      "**Objekte:** Jedes Kamerabild geht nur für einen Augenblick an den Rechner dieser Seite. Er wertet es aus und schickt das Ergebnis zurück. Das Bild selbst wird nicht gespeichert.",
      "**Anlernen:** Der Rechner merkt sich für etwa 30 Minuten Zahlenwerte aus deinen Beispielbildern, nicht die Bilder selbst. Danach vergisst er sie, und andere Besucher sehen sie nie.",
      "**Pixel und Filter:** Das Bild bleibt in deinem Browser und wird gar nicht verschickt.",
      "**Sprache zu Text:** Die Aufnahme geht einmal an den Rechner. Er schreibt sie als Text auf und schickt den Text zurück. Die Aufnahme wird nicht gespeichert.",
      "**Stoppen:** Mit dem Stopp-Knopf oder indem du die Seite verlässt. Dann ist die Kamera sofort aus.",
     ]},
    {h: "Texte, die du eintippst",
     kurz: "Chat-Fragen und eingefügte Dokumente laufen auf dem Rechner dieser Seite, nicht bei einem großen Anbieter im Netz.",
     p: [
      "Alles, was du im Chat, im Dokumenten-Labor oder beim Agenten eintippst, wird auf dem kleinen Rechner hinter dieser Seite verarbeitet. Das Sprachmodell läuft dort selbst. Deine Texte gehen nicht an einen Cloud-Dienst.",
      "Chat-Fragen werden nicht aufbewahrt. Texte, die du ins Dokumenten-Labor einfügst, bleiben für deine Sitzung im Arbeitsspeicher und verfallen nach 30 Minuten Ruhe. Andere Besucher sehen sie nicht.",
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
  quelle: ["=lizenzen", "=llm-grenzen", "=rag-ueberblick", "=recht"],
  quellen: ["=lizenzen", "=llm-grenzen", "=rag-ueberblick", "=recht"],
  zitieren: ["=lizenzen", "=llm-grenzen", "=recht"],
  /* Fälschungen und Medien */
  fake: ["=llm-grenzen", "=genki", "=verzerrung-ethik", "=recht"],
  "fake news": ["=llm-grenzen", "=genki", "=verzerrung-ethik", "=empfehlungen"],
  fakenews: ["=llm-grenzen", "=genki", "=verzerrung-ethik", "=empfehlungen"],
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
  spiel: ["=ml", "=agenten-planung", "=robotik"],
  spiele: ["=ml", "=agenten-planung", "=robotik"],
  game: ["=ml", "=agenten-planung", "=robotik"],
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

INHALT.registriere({
  seiten: S,
  glossar,
  gruppen: [{ name: "Der Rechner dahinter", seiten: ["sicherheit-einfach"] }],
});
})();
