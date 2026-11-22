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
  assistent: ["KI-Assistent", "Ein Programm, dem du in normaler Sprache Aufgaben gibst, zum Beispiel einen Text zu schreiben oder etwas nachzuschlagen. Meist steckt ein Sprachmodell dahinter, manchmal mit Werkzeugen (Agent)."],
};

INHALT.synonyme = {
  chatgpt: ["chat", "sprachmodell", "generative ki", "prompt"],
  gpt: ["chat", "sprachmodell", "generative ki"],
  copilot: ["chat", "agent", "sprachmodell"],
  "ki-assistent": ["chat", "agent", "prompt", "sprachmodell"],
  assistent: ["chat", "agent", "prompt"],
  chatbot: ["chat", "sprachmodell", "agent"],
  datenschutz: ["dsgvo", "personenbezogen", "recht", "gespeichert", "sicher"],
  dsgvo: ["datenschutz", "personenbezogen", "recht"],
  privatsphaere: ["datenschutz", "personenbezogen", "gespeichert"],
  sicher: ["sicherheit", "datenschutz", "gespeichert", "cookie"],
  sicherheit: ["sicher", "datenschutz", "gespeichert", "agenten-sicherheit"],
  cookie: ["gespeichert", "datenschutz", "localstorage"],
  foto: ["bild", "pixel", "kamera", "objekt", "gesicht"],
  fotos: ["bild", "pixel", "kamera", "objekt", "gesicht"],
  bilder: ["bild", "pixel", "kamera", "objekt"],
  kamera: ["bild", "gesicht", "objekt", "webcam"],
  handy: ["kamera", "bild", "smartphone", "edge"],
  smartphone: ["kamera", "bild", "edge"],
  halluzination: ["erfunden", "falsch", "grenzen", "unsinn"],
  halluzinieren: ["halluzination", "erfunden", "falsch", "grenzen"],
  erfinden: ["halluzination", "erfunden", "falsch"],
  luegen: ["halluzination", "erfunden", "falsch"],
  firma: ["unternehmen", "business", "betrieb"],
  betrieb: ["unternehmen", "business", "mlops"],
  unternehmen: ["firma", "business", "betrieb"],
  handwerk: ["angebot", "rechnung", "baustelle"],
  angebot: ["handwerk", "rechnung", "text"],
  rechnung: ["handwerk", "angebot", "dokument"],
  dokumente: ["rag", "dokument", "pdf"],
  pdf: ["dokument", "rag"],
  preis: ["kosten", "energie"],
  geld: ["kosten", "energie"],
  strom: ["energie", "kosten", "watt"],
  stimme: ["sprache", "audio", "whisper", "sprachausgabe"],
  mikrofon: ["sprache", "audio", "whisper"],
  vorlesen: ["sprachausgabe", "tts", "stimme"],
  uebersetzen: ["sprache", "sprachmodell"],
  lernen: ["training", "maschinelles lernen", "modell"],
  roboter: ["robotik", "agent"],
  gesichtserkennung: ["gesicht", "biometrisch", "kamera"],
};
/* Beliebte Suchen: Vorschläge, wenn nichts gefunden wird */
INHALT.sucheVorschlaege = ["Chat", "Datenschutz", "Bilder", "Dokumente", "Agent", "Kosten"];

/* Einsteigerseiten: im Menü mit "Einsteiger" markiert, im Seitenkopf als "Für Einsteiger" */
for (const id of ["karte", "ml", "genki", "business", "gesicht", "objekt", "chat"]) if (INHALT.seiten[id]) INHALT.seiten[id].anfaenger = true;

INHALT.registriere({
  seiten: S,
  glossar,
  gruppen: [{ name: "Der Rechner dahinter", seiten: ["sicherheit-einfach"] }],
});
})();
