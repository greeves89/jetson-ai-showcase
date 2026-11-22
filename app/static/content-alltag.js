/* Weg "In 15 Minuten: das Wichtigste" für Berufstätige und Alltagsmenschen (Rolle "erwachsene"): fünf kurze Seiten ohne Video und ohne Labor,
   damit die angezeigte Zeit (Lesezeit der sichtbaren Texte) wirklich unter 15 Minuten bleibt. Der Pfad "alltag-15" steht in content-laien.js.
   Aussagen zu Betrug stammen aus der Seite "Falscher Anruf" (Polizeiliche Kriminalprävention, BSI, abgerufen am 22.11.2026),
   Aussagen zum Datenschutz aus der Seite "Ist das sicher?". Beispiele sind erfunden.
   Diese Datei steht zuletzt in module.json: unten setzt sie die Rollenfelder ("rollen") und die Hinweise für Fachleute
   auf Seiten, die in anderen Dateien definiert sind. */
(function () {

const S = {};
const ROLLE = ["erwachsene"];

S["alltag-ki-kurz"] = {
  nav: "KI in 2 Minuten", typ: "lektion", gruppe: "Alltag in 15 Minuten", titel: "KI in 2 Minuten: Was ist das?", symbol: "sparkles", rollen: ["erwachsene", "betrieb"],
  kurz: "Was KI ist, wo du ihr täglich begegnest und wo sie danebenliegt. Zwei Minuten, ohne Fachwörter.",
  zusammenfassung: "KI ist Software, die Aufgaben löst, für die sonst Denken nötig ist. Sie lernt aus Beispielen. Chatbots wählen Wort für Wort, was wahrscheinlich als Nächstes kommt, und klingen auch dann sicher, wenn sie irren.",
  abschnitte: [
    {h: "Was KI ist",
     kurz: "KI ist Software, die Aufgaben löst, für die wir sonst Denken brauchen: Sprache verstehen, Bilder erkennen, Texte schreiben.",
     p: [
      "[[ki|Künstliche Intelligenz]] ist Software, die Aufgaben löst, für die wir sonst Denken brauchen. Sie lernt aus sehr vielen Beispielen, statt dass jemand jede Regel einzeln aufschreibt.",
      "Die meiste KI kann genau eine Sache gut. Ein Programm, das Fotos sortiert, schreibt keine Briefe.",
     ]},
    {h: "Wo du ihr schon begegnest",
     kurz: "Übersetzer, Sprachassistenten und Chatbots wie ChatGPT beruhen auf KI.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "languages", text: "Übersetzer", sub: "Text in andere Sprache"},
      {icon: "mic", text: "Sprachassistent", sub: "Sprache wird zu Text"},
      {icon: "message-square", text: "Chatbot", sub: "schreibt Antworten"}]},
     p: [
      "Ein Chatbot wie [[chatgpt|ChatGPT]] beruht auf einem Sprachmodell. Es wählt Wort für Wort, was wahrscheinlich als Nächstes kommt. Daher kann es erklären, zusammenfassen und formulieren.",
     ]},
    {h: "Wo sie danebenliegt",
     kurz: "Ein Chatbot klingt auch dann sicher, wenn er sich irrt. Wichtiges prüfst du nach.",
     visual: {typ: "vergleich",
      links: {titel: "Kann gut", icon: "circle-check", farbe: "gruen", punkte: ["Erklären", "Formulieren", "Ideen sammeln"]},
      rechts: {titel: "Kann nicht", icon: "triangle-alert", farbe: "orange", punkte: ["Sicher wissen", "Belege garantieren"]}},
     p: [
      "Das Modell kennt Muster in Texten, keine Wahrheit. Es erfindet manchmal Zahlen, Namen und Quellen und schreibt sie im selben ruhigen Ton wie richtige Antworten.",
     ],
     merke: "Klingt sicher heißt nicht: stimmt. Bei allem mit Folgen prüfst du nach."},
  ],
  mitnehmen: [
    "KI löst Aufgaben, für die sonst Denken nötig ist, und lernt dafür aus Beispielen.",
    "Ein Chatbot wählt Wort für Wort und klingt auch bei Fehlern sicher.",
    "Wichtiges prüfst du immer gegen eine zweite Quelle.",
  ],
  weiter: ["alltag-chat", "karte", "ml", "llm-grenzen"],
};

S["alltag-chat"] = {
  nav: "Chat nutzen und prüfen", typ: "lektion", gruppe: "Alltag in 15 Minuten", titel: "Einen Chatbot nutzen und die Antwort prüfen", symbol: "message-square", rollen: ROLLE,
  kurz: "Eine Frage stellen, die Antwort prüfen, bevor du ihr traust. Das Labor hat dafür einen Chat.",
  zusammenfassung: "Im Chat des Labors stellst du eine Alltagsfrage. Bei viel Betrieb dauert die Antwort bis zu zwei Minuten. Du prüfst sie gegen eine zweite Quelle und fragst bei Regeln mit Folgen die zuständige Stelle.",
  abschnitte: [
    {h: "Eine Frage stellen",
     kurz: "Öffne den Chat, tippe eine Alltagsfrage, drücke Enter. Bei viel Betrieb dauert die Antwort bis zu zwei Minuten.",
     p: [
      "Öffne den {{chat|Chat}}, lade das Modell und tippe eine Frage, zum Beispiel: „Gib mir drei Ideen für ein schnelles Abendessen mit Kartoffeln.“ Beim ersten Mal lädt das Modell, das dauert bis zu einer Minute.",
      "Der Chat läuft auf einem kleinen Rechner. Ist viel los, wartest du in einer Schlange, und die Antwort braucht bis zu zwei Minuten. Lies in der Zeit schon die nächste Seite.",
     ]},
    {h: "Die Antwort prüfen",
     kurz: "Merken, was behauptet wird. Gegenprüfen. Bei Folgen die zuständige Stelle fragen.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "eye", text: "Merken", sub: "was wird behauptet"},
      {icon: "search", text: "Gegenprüfen", sub: "zweite Quelle"},
      {icon: "phone", text: "Nachfragen", sub: "bei Folgen die Stelle", farbe: "gruen"}]},
     p: [
      "Zuerst merkst du dir, was die Antwort behauptet: Zahlen, Namen, Fristen. Dann suchst du eine zweite Quelle, am besten die Seite der Behörde, des Herstellers oder der Verbraucherzentrale. Stimmen beide überein, ist das ein gutes Zeichen.",
      "Bei Regeln mit Folgen, etwa Arbeits- und Ruhezeiten, Fristen oder der Dosierung eines Medikaments, genügt das nicht. Ein kleines Modell kann sich hier irren. Frage die zuständige Stelle.",
     ],
     merke: "Je größer die Folgen, desto weniger reicht ein Chatbot allein."},
    {h: "Mehr dazu",
     kurz: "Wie du Quellen prüfst, steht auf {{quellen-pruefen|Quellen prüfen}}. Warum Modelle erfinden, auf {{llm-grenzen|Grenzen von Sprachmodellen}}.",
     p: [
      "Fünf Schritte zum Quellen-Prüfen findest du auf {{quellen-pruefen|Quellen prüfen}}. Warum Sprachmodelle manchmal erfinden, erklärt {{llm-grenzen|Grenzen von Sprachmodellen}}.",
     ]},
  ],
  mitnehmen: [
    "Eine Alltagsfrage reicht für den Anfang. Geduld: bis zu zwei Minuten bei viel Betrieb.",
    "Zahlen, Namen und Fristen prüfst du gegen eine zweite Quelle.",
    "Bei Regeln mit Folgen fragst du die zuständige Stelle.",
  ],
  weiter: ["alltag-betrug", "chat", "quellen-pruefen", "llm-grenzen"],
};

S["alltag-betrug"] = {
  nav: "Betrug erkennen", typ: "lektion", gruppe: "Alltag in 15 Minuten", titel: "Betrug am Telefon und mit KI: das Wichtigste", symbol: "phone-call", rollen: ["erwachsene", "eltern"],
  kurz: "Auflegen, selbst zurückrufen, bei Verdacht 110. Eine bekannte Stimme beweist nichts, denn KI kann Stimmen nachbauen.",
  zusammenfassung: "Bei einem verdächtigen Anruf mit Geldwunsch: auflegen, unter einer selbst bekannten Nummer zurückrufen, bei Verdacht die 110 wählen. Laut BSI reichen mitunter wenige Sekunden Aufnahme für eine gefälschte Stimme. Ein Codewort in der Familie hilft.",
  abschnitte: [
    {h: "Drei Schritte",
     kurz: "Erstens auflegen. Zweitens selbst zurückrufen. Drittens bei Verdacht die 110 wählen.",
     visual: {typ: "ablauf", schritte: [
      {icon: "phone", text: "1. Auflegen", sub: "sofort", farbe: "orange"},
      {icon: "phone-call", text: "2. Zurückrufen", sub: "Nummer, die du kennst"},
      {icon: "siren", text: "3. Polizei", sub: "bei Verdacht die 110", farbe: "gruen"}]},
     p: [
      "Die Polizei rät bei Schockanrufen, sofort aufzulegen. Das ist nicht unhöflich. Dann rufst du die Person selbst an, unter einer Nummer, die du schon hattest, nicht unter der Nummer im Display. Sie kann gefälscht sein.",
      "Gib niemals Geld oder Wertsachen an Unbekannte, auch nicht an angebliche Polizisten. Die Polizei bittet am Telefon nicht um Wertsachen.",
     ],
     merke: "Auflegen. Selbst zurückrufen. Bei Verdacht 110."},
    {h: "Warum KI es schwerer macht",
     kurz: "Eine Stimme lässt sich nachbauen. Laut BSI reichen mitunter wenige Sekunden Aufnahme.",
     p: [
      "Mit KI lassen sich Stimmen nachbauen. Laut BSI reichen dafür mitunter wenige Sekunden Aufnahme. Eine bekannte Stimme beweist darum nichts. Der Rückruf klärt es.",
     ]},
    {h: "Das Codewort",
     kurz: "Vereinbart in der Familie ein Kennwort. Wer in Not anruft und es nicht kennt, ist nicht die Person.",
     p: [
      "Die Polizei empfiehlt ein Kennwort für den Notfall. Wählt ein Wort, das nicht im Internet steht, und sagt es euch persönlich. Mehr dazu, Beispiele und Quellen: {{falscher-anruf|Falscher Anruf, Enkeltrick, Schockanruf}}.",
     ]},
  ],
  mitnehmen: [
    "Auflegen, selbst zurückrufen, bei Verdacht die 110 wählen.",
    "Eine vertraute Stimme beweist nichts.",
    "Ein Codewort in der Familie schützt auch gegen gute Fälschungen.",
  ],
  grenzen: ["Hinweise der Polizei und des BSI, abgerufen am 22.11.2026, keine Rechtsberatung. Einzelnachweise stehen auf der Seite Falscher Anruf."],
  weiter: ["prompts-alltag", "falscher-anruf", "echt-oder-ki", "fake-news-deepfakes"],
};

S["prompts-alltag"] = {
  nav: "Gute Fragen im Alltag", typ: "lektion", gruppe: "Alltag in 15 Minuten", titel: "Gute Fragen an die KI: die Alltagskarte", symbol: "list-checks", rollen: ["erwachsene", "schule"],
  kurz: "Wer, Was, Wie: drei Bausteine, drei Beispiele zum Kopieren und ein Satz zum Prüfen.",
  zusammenfassung: "Eine gute Frage sagt, in welcher Rolle die KI antwortet (Wer), was sie tun soll (Was) und wie die Antwort aussehen soll (Wie). Drei Alltagsbeispiele: Einkauf, Brief an die Vermieterin, Urlaubsplan. Zum Schluss ein Satz, der ans Prüfen erinnert.",
  abschnitte: [
    {h: "Drei Bausteine", offen: true,
     kurz: "Wer antwortet, was soll sie tun, wie soll es aussehen?",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "user-round", text: "Wer", sub: "Rolle der KI"},
      {icon: "pencil", text: "Was", sub: "die Aufgabe"},
      {icon: "list", text: "Wie", sub: "Form und Länge"}]},
     p: [
      "**Wer:** In welcher Rolle soll die KI antworten, zum Beispiel als Reiseberater? **Was:** Die Aufgabe in einem Satz, mit allem, was sie wissen muss. **Wie:** Liste, drei Sätze, einfache Sprache?",
     ]},
    {h: "Drei Beispiele zum Kopieren", offen: true,
     kurz: "Einkauf, Brief an die Vermieterin, Urlaubsplan. Ersetze die Angaben durch deine.",
     liste: [
      "**Einkauf:** „Du bist Ernährungsberaterin. Plane fünf günstige Abendessen für zwei Erwachsene und zwei Kinder. Schreibe die Einkaufsliste dazu, sortiert nach Supermarktabteilung.“",
      "**Brief:** „Du hilfst mir beim Schreiben. Schreibe einen höflichen, sachlichen Brief an meine Vermieterin: Die Heizung im Wohnzimmer ist seit zwei Wochen kalt, ich bitte um einen Reparaturtermin. Maximal 120 Wörter, Sie-Form.“",
      "**Urlaub:** „Du bist Reiseberater. Plane drei Tage Hamburg für zwei Erwachsene und ein Kind (7 Jahre), wenig Fußwege. Gib mir je Tag Vormittag und Nachmittag als Liste.“",
     ]},
    {h: "Dann prüfen", offen: true,
     kurz: "Hänge diesen Satz an: „Sag mir am Ende, was du nicht sicher weißt und was ich selbst nachprüfen sollte.“",
     p: [
      "Hänge an jede Frage: „Sag mir am Ende, was du nicht sicher weißt und was ich selbst nachprüfen sollte.“ Das Modell kann sich auch dann irren. Der Satz erinnert dich ans Prüfen, er ersetzt es nicht. Wie du prüfst, steht auf {{alltag-chat|Chat nutzen und prüfen}}.",
     ]},
  ],
  mitnehmen: [
    "Wer, Was, Wie: Rolle, Aufgabe, Form.",
    "Erfundene Beispiele reichen zum Üben. Gib keine privaten Daten ein.",
    "Antworten prüfst du immer selbst.",
  ],
  weiter: ["alltag-sicher", "prompting", "prompts-schule", "alltag-chat"],
};

S["alltag-sicher"] = {
  nav: "Datenschutz in 2 Minuten", typ: "lektion", gruppe: "Alltag in 15 Minuten", titel: "Ist das sicher? Die Kurzfassung", symbol: "shield-check", rollen: ROLLE,
  kurz: "Was das Labor speichert, was du nirgends eintippen solltest und wo die ganze Antwort steht.",
  zusammenfassung: "Das Labor braucht kein Konto, speichert keine Kamerabilder und Aufnahmen, und eingetippte Texte verfallen nach 30 Minuten Ruhe. Passwörter, Kontodaten und Daten anderer gehören in keinen Chatbot. Die ausführliche Antwort steht auf Ist das sicher?",
  abschnitte: [
    {h: "Was das Labor tut",
     kurz: "Kein Konto, keine gespeicherten Bilder und Aufnahmen, Texte nur kurz im Arbeitsspeicher.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "user-check", text: "Kein Konto", sub: "ohne Anmeldung"},
      {icon: "camera", text: "Keine Bilder gespeichert", sub: "nur zum Auswerten"},
      {icon: "clock", text: "Texte nur kurz", sub: "30 Minuten Ruhe, dann weg"}]},
     p: [
      "Du brauchst kein Konto. Kamerabilder und Aufnahmen werden nicht gespeichert. Eingefügte Texte bleiben im Arbeitsspeicher und verfallen nach 30 Minuten Ruhe.",
     ]},
    {h: "Was du nirgends eintippst",
     kurz: "Passwörter, PINs, Kontodaten, Gesundheitsdaten und Daten anderer Menschen. Im Labor reichen erfundene Beispiele.",
     p: [
      "Gib in keinen Chatbot Passwörter, PINs, Kontodaten oder Gesundheitsdaten ein, auch nicht die anderer Menschen. Im Labor genügen erfundene Beispiele. Bei anderen Diensten lies vorher, ob Eingaben zum Training verwendet werden und wo die Daten liegen.",
     ],
     merke: "Erfundene Beispiele reichen zum Üben."},
    {h: "Die ganze Antwort",
     kurz: "Alle Einträge im Browser, Kamera, Mikrofon und was der Server sieht: {{sicherheit-einfach|Ist das sicher?}}.",
     p: [
      "Die ausführliche Antwort, mit Tabelle der Browser-Einträge, steht auf {{sicherheit-einfach|Ist das sicher?}}. Tipps für den Alltag: {{datenschutz-im-alltag|Datenschutz im Alltag}}.",
     ]},
  ],
  mitnehmen: [
    "Kein Konto, keine gespeicherten Bilder, Texte nur kurz.",
    "Passwörter, Kontodaten und Gesundheitsdaten gehören in keinen Chatbot.",
    "Die ganze Antwort steht auf der Seite Ist das sicher?",
  ],
  weiter: ["sicherheit-einfach", "datenschutz-im-alltag", "alltag-ki-kurz"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "Alltag in 15 Minuten", seiten: ["alltag-ki-kurz", "alltag-chat", "alltag-betrug", "prompts-alltag", "alltag-sicher"], nach: "Start" }],
});

/* Suchwörter für die neuen Seiten (Schlüssel ohne Umlaute, siehe content-laien.js) */
const NEU_SYN = {
  "15 minuten": ["=alltag-ki-kurz", "=alltag-chat", "=prompts-alltag"],
  pause: ["=alltag-ki-kurz", "=alltag-chat", "=prompts-alltag"],
  schnell: ["=alltag-ki-kurz", "=prompts-alltag"],
  alltag: ["=alltag-ki-kurz", "=prompts-alltag", "=alltag-chat"],
  "gute fragen": ["=prompts-alltag", "=prompting", "=prompts-schule"],
  "bessere fragen": ["=prompts-alltag", "=prompting", "=prompts-schule"],
  einkauf: ["=prompts-alltag"],
  urlaub: ["=prompts-alltag"],
  vermieter: ["=prompts-alltag"],
  brief: ["=prompts-alltag", "=prompting"],
  "antworten pruefen": ["=alltag-chat", "=quellen-pruefen", "=llm-grenzen", "=eltern-zuhause"],
  kinder: ["=eltern-zuhause", "=zusammen-ausprobieren", "=bildschirmzeit", "=sicherheit-einfach"],
  sicher: ["=alltag-sicher", "=sicherheit-einfach", "=eltern-zuhause"],
  betrug: ["=alltag-betrug", "=falscher-anruf", "=echt-oder-ki", "=fake-news-deepfakes"],
  /* Büro und Berufsgeheimnis */
  mandanten: ["=sicherheit-einfach", "=betrieb-entscheidung", "=uc-buero-dokumente", "=recht"],
  mandant: ["=sicherheit-einfach", "=betrieb-entscheidung", "=uc-buero-dokumente", "=recht"],
  schweigepflicht: ["=sicherheit-einfach", "=betrieb-entscheidung", "=recht", "=uc-buero-dokumente"],
  berufsgeheimnis: ["=sicherheit-einfach", "=betrieb-entscheidung", "=recht", "=uc-buero-dokumente"],
  steuerberater: ["=uc-buero-dokumente", "=sicherheit-einfach", "=betrieb-entscheidung", "=recht"],
  steuerbuero: ["=uc-buero-dokumente", "=sicherheit-einfach", "=betrieb-entscheidung"],
  kanzlei: ["=sicherheit-einfach", "=uc-buero-dokumente", "=betrieb-entscheidung"],
  belege: ["=uc-buero-dokumente", "=uc-handwerk"],
  "datenschutz buero": ["=sicherheit-einfach", "=uc-buero-dokumente", "=recht", "=betrieb-entscheidung"],
  mitarbeiter: ["=kamera-grenzen", "=recht", "=uc-sicherheit-zutritt", "=sicherheit-einfach"],
  /* Kamera in der Fertigung */
  qualitaet: ["=kamera-grenzen", "=uc-fertigung-sichtpruefung", "=bewertung"],
  sichtpruefung: ["=uc-fertigung-sichtpruefung", "=kamera-grenzen"],
  "kamera mitarbeiter": ["=kamera-grenzen", "=recht", "=uc-sicherheit-zutritt"],
  haftung: ["=kamera-grenzen", "=recht", "=agenten-sicherheit"],
  taktzeit: ["=kamera-grenzen", "=uc-fertigung-sichtpruefung"],
  betriebsrat: ["=kamera-grenzen", "=betrieb-entscheidung", "=recht"],
  /* Technik und Betrieb */
  ports: ["=betrieb-sicherheit", "=selbst-bauen"],
  port: ["=betrieb-sicherheit", "=selbst-bauen"],
  logs: ["=betrieb-sicherheit", "=selbst-bauen", "=sicherheit-einfach"],
  log: ["=betrieb-sicherheit", "=selbst-bauen", "=sicherheit-einfach"],
  protokoll: ["=betrieb-sicherheit", "=sicherheit-einfach"],
  betrieb: ["=betrieb-sicherheit", "=betrieb-entscheidung", "=ki-einfuehrung"],
  sicherheit: ["=betrieb-sicherheit", "=sicherheit-einfach", "=alltag-sicher"],
  sicherheitskoepfe: ["=betrieb-sicherheit"],
  aufbewahrung: ["=betrieb-sicherheit", "=sicherheit-einfach"],
  stueckliste: ["=selbst-bauen", "=hardware"],
  /* Kontextlänge */
  kontextlaenge: ["=tokens-sprachmodelle", "=hardware", "=chat"],
  kontextfenster: ["=tokens-sprachmodelle", "=hardware", "=chat"],
  "context window": ["=tokens-sprachmodelle", "=hardware", "=chat"],
  "context length": ["=tokens-sprachmodelle", "=hardware", "=chat"],
  "token limit": ["=tokens-sprachmodelle", "=hardware", "=chat"],
  tokenlimit: ["=tokens-sprachmodelle", "=hardware", "=chat"],
  fenster: ["=tokens-sprachmodelle", "=hardware", "=chat"],
  4096: ["=hardware", "=chat", "=tokens-sprachmodelle"],
  /* Eltern */
  hausaufgaben: ["=ki-hausaufgaben-fair", "=eltern-zuhause", "=zusammen-ausprobieren"],
  eltern: ["=eltern-zuhause", "=zusammen-ausprobieren", "=bildschirmzeit", "=sicherheit-einfach"],
  handy: ["=bildschirmzeit", "=eltern-zuhause"],
};
/* Bestehende Einträge bleiben: die neuen Seiten stehen davor, der Rest folgt (Duplikate entfallen) */
for (const [k, ids] of Object.entries(NEU_SYN)) INHALT.synonyme[k] = [...new Set([...ids, ...(INHALT.synonyme[k] || [])])];

/* ---------- Rollen: "rollen" gewichtet die Suchtreffer (app.js). Gesetzt wird nur, wo die Seite noch kein Feld hat. ---------- */
const ROLLEN = {
  eltern: ["eltern-zuhause", "zusammen-ausprobieren", "bildschirmzeit"],
  schule: ["referat", "prompts-schule"],
  betrieb: ["betrieb-entscheidung", "kamera-grenzen", "kosten-energie", "ki-einfuehrung", "recht"],
  technik: ["betrieb-sicherheit", "selbst-bauen"],
};
for (const [rolle, ids] of Object.entries(ROLLEN)) for (const id of ids) if (INHALT.seiten[id] && !INHALT.seiten[id].rollen) INHALT.seiten[id].rollen = [rolle];
for (const id of Object.keys(INHALT.seiten)) if (/^uc-/.test(id) && !INHALT.seiten[id].rollen) INHALT.seiten[id].rollen = ["betrieb"];
const MEHRERE = {"sicherheit-einfach": ["eltern", "betrieb", "schule"], "falscher-anruf": ["erwachsene", "eltern"], "prompting": ["betrieb"]};
for (const [id, r] of Object.entries(MEHRERE)) if (INHALT.seiten[id]) INHALT.seiten[id].rollen = r;
/* app.js kennt den Weg des Betriebs als "beruf" (WEGE): jede Seite mit "betrieb" trägt auch "beruf" */
for (const sd of Object.values(INHALT.seiten)) if (Array.isArray(sd.rollen) && sd.rollen.includes("betrieb") && !sd.rollen.includes("beruf")) sd.rollen = [...sd.rollen, "beruf"];

/* ---------- Wissensseiten für Fachleute: Quellen und Formel im Kurz-Modus sichtbar ----------
   "Weiterlesen" bleibt aufgeklappt. Abschnitte mit "Mit Mathe"-Block nennen den Schalter im Kurztext. */
for (const id of ["neuronale-netze", "training", "bewertung", "rag-embedding", "tokens-sprachmodelle"]) {
  const sd = INHALT.seiten[id];
  if (!sd) continue;
  for (const a of sd.abschnitte || []) {
    if (a.h === "Weiterlesen") a.offen = true;
    else if (a.mathe && a.mathe.p && a.mathe.p.length && a.kurz && !/Mit Mathe/.test(a.kurz)) a.kurz += " Die Formel steht unter „Mit Mathe“.";
  }
}
})();
