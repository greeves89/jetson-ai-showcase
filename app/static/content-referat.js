/* Seite "Für dein Referat über KI": Gliederung, beste Seiten des Labors, deutschsprachige Quellen, Zitiervorlage.
   Alle externen Links sind am 22.11.2026 per Statuscode geprüft (200) und abgerufen. Wikipedia nur mit Hinweis. */
window.INHALT.registriere({

gruppen: [{ name: "Medienkompetenz", seiten: ["referat"] }],

seiten: {

"referat": {
  nav: "Referat", typ: "lektion", gruppe: "Medienkompetenz", titel: "Für dein Referat über KI", symbol: "presentation",
  kurz: "Gliederung, die besten Seiten des Labors, deutsche Quellen und eine Vorlage zum Zitieren. So wird dein Referat gut belegt.",
  zusammenfassung: "Für ein Referat über KI brauchst du eine Gliederung, mehrere Quellen und eine saubere Angabe mit Abrufdatum. Das Labor erklärt zum Verstehen und ist als einzige Quelle nicht genug. Die Seite zeigt eine Gliederung, deutschsprachige Quellen von klicksafe, bpb, Bundesregierung und Verbraucherzentrale und eine Zitiervorlage.",
  lernziele: [
    "Du kannst ein Referat über KI in sechs Teile gliedern.",
    "Du kannst Quellen mit Titel, Betreiber, Jahr und Abrufdatum angeben.",
    "Du kannst sagen, warum das Labor und der Chat nicht deine einzige Quelle sein sollten.",
  ],
  abschnitte: [
    {h: "Eine Gliederung für fünf bis zehn Minuten",
     kurz: "Einstieg, Was ist KI, Wie lernt sie, Wo steckt sie im Alltag, Grenzen, Fazit. Dazu am Ende die Quellen.",
     visual: {typ: "ablauf", schritte: [
      {icon: "lightbulb", text: "1. Einstieg", sub: "ein Beispiel aus deinem Alltag"},
      {icon: "brain-circuit", text: "2. Was ist KI?", sub: "und was nicht"},
      {icon: "graduation-cap", text: "3. Wie lernt sie?", sub: "aus Beispielen"},
      {icon: "smartphone", text: "4. Im Alltag", sub: "Feed, Übersetzer, Filter"},
      {icon: "triangle-alert", text: "5. Grenzen", sub: "Fehler, Verzerrung", farbe: "orange"},
      {icon: "circle-check", text: "6. Fazit", sub: "und Quellen", farbe: "gruen"}]},
     p: [
      "Beginne mit einem Beispiel, das alle kennen, etwa dem Wortvorschlag auf dem Handy. Dann erklärst du in zwei Sätzen, was KI ist, und danach, wie sie aus Beispielen lernt. Im vierten Teil zeigst du zwei oder drei Stellen im Alltag. Teil fünf nennt Grenzen: Fehler, Verzerrung durch Daten, erfundene Antworten. Am Ende steht dein Fazit in drei Sätzen.",
      "Plane pro Teil etwa eine Minute. Für jeden Teil brauchst du eine Quelle, die du angeben kannst.",
     ],
     merke: "Sechs Teile, je etwa eine Minute, jeder Teil mit einer Quelle."},
    {h: "Die besten Seiten des Labors für dein Thema",
     kurz: "Zum Verstehen und zum Ausprobieren: Landkarte, Punkte-Labor, Sprachmodelle, Grenzen, Alltag und Quellen prüfen.",
     p: [
      "Diese Seiten helfen dir bei den sechs Teilen. Sie erklären und lassen dich ausprobieren. Als Beleg für Fakten nimmst du zusätzlich eine Quelle aus dem nächsten Abschnitt.",
     ],
     liste: [
      "Einstieg und Was ist KI: {{karte|Eine Landkarte der KI}} und {{ml|Maschinelles Lernen}}.",
      "Wie lernt sie: {{daten|Daten}} und {{training|Wie ein Modell lernt}}.",
      "Sprachmodelle: {{tokens-sprachmodelle|Wie ein Sprachmodell gebaut ist}} und der {{chat|Chat}}.",
      "Im Alltag: {{schueler-alltag-ki|KI in deinem Alltag}}.",
      "Grenzen: {{llm-grenzen|Grenzen von Sprachmodellen}} und {{echt-oder-ki|Echt oder KI?}}.",
      "Quellen prüfen: {{quellen-pruefen|Quellen prüfen}} und {{ki-hausaufgaben-fair|KI bei Hausaufgaben}}.",
     ]},
    {h: "Deutschsprachige Quellen",
     kurz: "Gute Startpunkte: [klicksafe](https://www.klicksafe.de/kuenstliche-intelligenz), [bpb](https://www.bpb.de/lernen/bewegtbild-und-politische-bildung/555997/was-ist-ki-und-welche-formen-von-ki-gibt-es/), [Bundesregierung](https://www.bundesregierung.de/breg-de/aktuelles/faq-kuenstliche-intelligenz-2458970) und [Verbraucherzentrale](https://www.verbraucherzentrale.de/wissen/digitale-welt/apps-und-software/kuenstliche-intelligenz-funktionsweise-anwendungsgebiete-und-risiken-89112).",
     p: [
      "Diese Seiten sind auf Deutsch, haben einen erkennbaren Betreiber und sind für alle frei lesbar. Alle Links wurden am 22.11.2026 geprüft. Trage beim Zitieren dein eigenes Abrufdatum ein.",
     ],
     liste: [
      "klicksafe (EU-Initiative für Medienkompetenz): [Künstliche Intelligenz](https://www.klicksafe.de/kuenstliche-intelligenz), Themenseite.",
      "Bundeszentrale für politische Bildung (bpb): [Was ist KI und welche Formen von KI gibt es?](https://www.bpb.de/lernen/bewegtbild-und-politische-bildung/555997/was-ist-ki-und-welche-formen-von-ki-gibt-es/) und [Begriffe rund um KI](https://www.bpb.de/lernen/digitale-bildung/werkstatt/580724/begriffe-rund-um-ki/).",
      "Bundesregierung: [Fragen und Antworten zu Künstlicher Intelligenz](https://www.bundesregierung.de/breg-de/aktuelles/faq-kuenstliche-intelligenz-2458970).",
      "Verbraucherzentrale: [Künstliche Intelligenz: Funktionsweise, Anwendungsgebiete und Risiken](https://www.verbraucherzentrale.de/wissen/digitale-welt/apps-und-software/kuenstliche-intelligenz-funktionsweise-anwendungsgebiete-und-risiken-89112) und [KI-Chatbots im Überblick](https://www.verbraucherzentrale.de/wissen/digitale-welt/apps-und-software/kichatbots-im-ueberblick-was-sie-ueber-chatgpt-gemini-copilot-wissen-sollten-89125).",
      "Wikipedia: [Künstliche Intelligenz](https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz). Gut zum Einlesen, aber jeder kann die Seite ändern. Nutze sie nur als Start, zitiere lieber die Quellen am Seitenende und frag deine Lehrkraft, ob sie Wikipedia akzeptiert.",
     ]},
    {h: "So gibst du Quellen an",
     kurz: "Betreiber oder Autor, Titel der Seite, Jahr, Adresse und das Datum, an dem du sie gelesen hast.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "user-round", text: "Autor oder Betreiber", sub: "Wer hat es veröffentlicht?"},
      {icon: "file-text", text: "Titel der Seite", sub: "genau so, wie er dasteht"},
      {icon: "calendar-days", text: "Jahr und Abrufdatum", sub: "wann du es gelesen hast"}]},
     p: [
      "Auf Webseiten ändert sich der Inhalt. Darum gehört das Abrufdatum dazu: der Tag, an dem du die Seite gelesen hast. Dein Lehrer oder deine Lehrerin kann eine bestimmte Form verlangen. Frag danach. Diese Vorlage ist ein Vorschlag.",
     ],
     code: [
      {titel: "Vorlage", text: "Betreiber oder Autor: „Titel der Seite“, Jahr, Adresse, abgerufen am TT.MM.JJJJ."},
      {titel: "Beispiel", text: "Bundeszentrale für politische Bildung: „Was ist KI und welche Formen von KI gibt es?“, https://www.bpb.de/lernen/bewegtbild-und-politische-bildung/555997/was-ist-ki-und-welche-formen-von-ki-gibt-es/, abgerufen am 22.11.2026."},
     ],
     alltag: "Eine Quellenangabe ist wie eine Wegbeschreibung. Wer dein Referat liest, soll mit ihr zu derselben Stelle finden."},
    {h: "So nutzt du das Labor als Quelle",
     kurz: "Als Hilfe zum Verstehen ja, als einzige Quelle nein. Gib den Seitennamen und das Abrufdatum an.",
     visual: {typ: "vergleich",
      links: {titel: "So geht es", icon: "circle-check", punkte: ["Erst im Labor verstehen, dann belegen", "Seitenname und Abrufdatum angeben", "Mindestens eine zweite Quelle nennen"], farbe: "gruen"},
      rechts: {titel: "So nicht", icon: "octagon-alert", punkte: ["Das Labor als einzige Quelle", "Chat-Antworten als Fakten abschreiben", "Ohne Datum und Seitenname zitieren"], farbe: "orange"}},
     p: [
      "Das Labor ist ein Lernprojekt einer Einzelperson. Es erklärt, damit du etwas verstehst, und nennt am Seitenende seine Quellen. Nimm für deine Fakten lieber diese Originalquellen oder die Seiten oben.",
      "Wenn du das Labor trotzdem angibst, schreib den Seitennamen und das Datum auf. Beispiel: KI-Labor, „Wie ein Modell lernt“, https://ki-labor.daniel-alisch.site/training, abgerufen am TT.MM.JJJJ. Die Antworten im Chat zitierst du nicht als Beleg. Ein kleines Modell kann sich irren. Wie du KI-Hilfe angibst, steht auf {{ki-hausaufgaben-fair|KI bei Hausaufgaben}}.",
     ],
     merke: "Das Labor hilft dir beim Verstehen. Belegen musst du mit anderen Quellen."},
    {h: "Checkliste vor dem Vortrag",
     kurz: "Sechs Fragen, bevor du das Referat abgibst oder hältst.",
     liste: [
      "Habe ich jeden Teil mit mindestens einer Quelle belegt?",
      "Stehen bei jeder Quelle Betreiber, Titel, Jahr, Adresse und Abrufdatum?",
      "Habe ich Zahlen und Namen in einer zweiten Quelle nachgeprüft?",
      "Kann ich jeden Satz mit eigenen Worten erklären?",
      "Habe ich KI-Hilfe angegeben, wenn ich welche genutzt habe?",
      "Weiß ich, was meine Lehrkraft für Quellen und KI erlaubt?",
     ]},
  ],
  mitnehmen: [
    "Gliedere in sechs Teile und belege jeden mit einer Quelle.",
    "Gib Betreiber, Titel, Jahr, Adresse und Abrufdatum an.",
    "Das Labor ist zum Verstehen da. Als einzige Quelle reicht es nicht.",
  ],
  grenzen: [
    "Die Vorlage ist ein Vorschlag. Was deine Schule verlangt, geht vor.",
    "Die Links sind am 22.11.2026 geprüft. Seiten im Netz können sich ändern oder verschwinden.",
  ],
  weiter: ["quellen-pruefen", "ki-hausaufgaben-fair", "prompts-schule", "llm-grenzen"],
},

},
});
