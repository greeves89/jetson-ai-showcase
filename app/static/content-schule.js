/* Seiten "Für die Schule": Einstieg, drei 45-Minuten-Stunden für Klasse 8, Handreichung für Lehrkräfte, Infos für Schulleitung und Eltern.
   Grundlage: docs/jugendpaedagogik.md (Sichtung vom 22.11.2026), docs/schreibleitfaden.md, docs/visuals.md.
   Fakten zu Daten und Betrieb nur aus app/app.py, app/sicherheit.py, docs/ und content-rechtliches.js.
   Die Seiten für Schulleitung und Eltern sind keine Rechtsberatung und ersetzen nicht die Datenschutzerklärung des Betreibers.
   Alle Aufgaben kommen ohne Kamera, Mikrofon und Gesichtserkennung aus. Punkte-Labor (Seite ml), Netz-Spielplatz (Seite
   neuronale-netze) und Risiko-Spiel (Seite llm-grenzen) rechnen im Browser des Geräts; nur Chat und Prompt-Werkstatt
   brauchen das Sprachmodell auf dem Rechner des Labors. */
(function () {

const S = {};

/* ------------------------------------------------------------------ Gemeinsame Bausteine der zehn Stundenseiten
   Eine Quelle: Die drei KI-Stunden (unten) und die sieben Medien-Einheiten (content-schule-medien.js, lädt danach) hängen
   daraus je einen Abschnitt "Einzelstunde oder Doppelstunde" und "Lehrplanbezug" an. Dieselben Daten lesen die
   Handreichung (Tabellen) und scripts/materialien_bauen.mjs (Lösungsblatt): Feld doppel und KLSchule.lehrplan. */
const satz = (t) => (/[.!?]$/.test(String(t).trim()) ? String(t).trim() : String(t).trim() + ".");

/** KMK-Kompetenzbereiche je Einheit (Vorschlag des Labors, keine amtliche Zuordnung). */
const LEHRPLAN = {
  "schule-stunde-1": ["KI 1: Was ist KI?", "Analysieren und Reflektieren; Problemlösen und Handeln"],
  "schule-stunde-2": ["KI 2: Wie lernt ein Computer?", "Analysieren und Reflektieren; Problemlösen und Handeln"],
  "schule-stunde-3": ["KI 3: Echt oder erfunden?", "Suchen, Verarbeiten und Aufbewahren; Analysieren und Reflektieren"],
  "medien-stunde-1": ["Medien 1: Echt oder KI?", "Analysieren und Reflektieren; Suchen, Verarbeiten und Aufbewahren"],
  "medien-stunde-2": ["Medien 2: Quellen prüfen", "Suchen, Verarbeiten und Aufbewahren"],
  "medien-stunde-3": ["Medien 3: Fake News und Deepfakes", "Analysieren und Reflektieren; Schützen und sicher Agieren"],
  "medien-stunde-4": ["Medien 4: KI und Hausaufgaben", "Produzieren und Präsentieren; Analysieren und Reflektieren"],
  "medien-stunde-5": ["Medien 5: Datenschutz im Alltag", "Schützen und sicher Agieren"],
  "medien-stunde-6": ["Medien 6: Gute Fragen stellen", "Produzieren und Präsentieren; Problemlösen und Handeln"],
  "medien-stunde-7": ["Medien 7: KI in deinem Alltag", "Analysieren und Reflektieren"],
};

/** Phasen von Einzelstunde (45) und Doppelstunde (90), für alle zehn Einheiten gleich. */
const PHASEN = [
  {phase: "Einstieg", einzel: "5 Minuten", min: 10},
  {phase: "Erarbeitung", einzel: "20 Minuten", min: 30},
  {phase: "Quiz", einzel: "Hausaufgabe oder Folgestunde", min: 10},
  {phase: "Sicherung", einzel: "10 Minuten", min: 15},
  {phase: "Reflexion und Nachdenken", einzel: "10 Minuten mündlich im Plenum, schriftlich zu Hause", min: 15},
  {phase: "Abschluss", einzel: "in der Reflexion enthalten", min: 10},
];
const PHASEN_TEXT = {
  "Quiz": "Einzelarbeit am Arbeitsblatt, danach gemeinsame Auflösung mit den Erklärungen im Lösungsblatt.",
  "Reflexion und Nachdenken": "Die Fragen „Zum Nachdenken“ schriftlich allein oder zu zweit, dann Austausch. Eigene Frage und Merksatz zum Schluss.",
  "Abschluss": "Ergebnisse vorstellen, Lernziele auf dem Blatt ankreuzen, offene Fragen sammeln.",
};
const doppelZeilen = () => PHASEN.map((p) => [p.phase, p.einzel, p.min + " Minuten"]).concat([["Summe", "45 Minuten", "90 Minuten"]]);
const doppelTabelle = (beschriftung) => ({beschriftung, kopf: ["Phase", "Einzelstunde (45 Minuten)", "Doppelstunde (90 Minuten)"], zeilen: doppelZeilen()});
const DOPPEL_VISUAL = {typ: "vergleich",
  links: {titel: "Einzelstunde, 45 Minuten", icon: "clock", farbe: "akzent", punkte: ["Einstieg, Aufgaben, Sicherung", "Reflexion mündlich im Plenum", "Quiz und Nachdenken als Hausaufgabe"]},
  rechts: {titel: "Doppelstunde, 90 Minuten", icon: "clock", farbe: "gruen", punkte: ["Aufgaben mit 30 statt 20 Minuten", "Quiz in der Stunde", "Nachdenken schriftlich, dann Austausch"]}};

/** Abschnitt "Einzelstunde oder Doppelstunde" einer Einheit. doppel = die 90-Minuten-Phasen mit Text, das Lösungsblatt liest sie von hier. */
function doppelAbschnitt(ab) {
  const kurz = (anfang) => ab.find((a) => a.h.startsWith(anfang)).kurz;
  const zeit = ab.find((a) => a.h === "Der Zeitplan").visual.punkte.map((p) => p.t);
  if (zeit.join("|") !== "5 Min|20 Min|10 Min|10 Min") throw new Error("Zeitplan der Einheit passt nicht zur Doppelstunde: " + zeit.join(", "));
  if (PHASEN.reduce((n, p) => n + p.min, 0) !== 90) throw new Error("Doppelstunde ergibt nicht 90 Minuten");
  const was = {
    "Einstieg": satz(kurz("Einstieg")) + " Dazu genug Zeit für das Gespräch an der Tafel.",
    "Erarbeitung": "Die Aufgaben 1 bis 3 des Arbeitsblatts (20 Minuten in der Einzelstunde, hier 30), Hilfekarten nach Bedarf, Zusatz für Schnelle.",
    "Sicherung": satz(kurz("Sicherung")) + " Tafelbild gemeinsam entwickeln.",
  };
  return {h: "Einzelstunde oder Doppelstunde",
    kurz: "45 oder 90 Minuten mit denselben Blättern: In 45 Minuten bleiben Quiz und schriftliches Nachdenken als Hausaufgabe, in 90 Minuten läuft alles in der Stunde.",
    visual: DOPPEL_VISUAL,
    p: ["Das Arbeitsblatt ist in beiden Fällen dasselbe, die Minuten auf dem Blatt gelten für die Einzelstunde. Das Lösungsblatt enthält beide Pläne mit allen Schritten."],
    tabelle: doppelTabelle("Zwei Pläne für dieselben Blätter"),
    doppel: PHASEN.map((p) => ({phase: p.phase, min: p.min, was: was[p.phase] || PHASEN_TEXT[p.phase]}))};
}

/** Abschnitt "Lehrplanbezug" einer Einheit: KMK-Kompetenzbereiche, Länderlehrplan bleibt Sache der Lehrkraft. */
function lehrplanAbschnitt(id) {
  const bereiche = LEHRPLAN[id][1];
  return {h: "Lehrplanbezug",
    kurz: "KMK-Kompetenzbereiche: " + bereiche + ". Passende Themen im Lehrplan Informatik oder Medienbildung des eigenen Bundeslandes sucht die Lehrkraft selbst.",
    p: ["Die Einheit knüpft an diese Kompetenzbereiche der KMK-Strategie „Bildung in der digitalen Welt“ an: " + bereiche + ". Das ist ein Vorschlag des Labors, keine amtliche Zuordnung.",
      "Welche Inhalte und Kompetenzen im Lehrplan Informatik oder Medienbildung des eigenen Bundeslandes dazu passen, wurde für kein Bundesland geprüft und bleibt Sache der Lehrkraft. Das Labor macht dazu keine Länderangaben. Die Tabelle aller Einheiten steht in der {{schule-lehrkraefte|Handreichung}}, Abschnitt Lehrplanbezug."]};
}
/** Setzt die Doppelstunde an den Anfang der Abschnitte und den Lehrplanbezug hinter den Zeitplan (einmal je Seite). */
function ergaenzeEinheit(seite, id) {
  const ab = seite.abschnitte;
  if (ab.some((a) => a.h === "Einzelstunde oder Doppelstunde")) return;
  // Doppelstunde ganz oben (direkt unter den Download-Karten im Seitenkopf), Lehrplanbezug hinter dem Zeitplan
  ab.splice(0, 0, doppelAbschnitt(ab));
  ab.splice(2, 0, lehrplanAbschnitt(id));
}
window.KLSchule = {lehrplan: LEHRPLAN, doppelZeilen, doppelTabelle, ergaenzeEinheit};

/* ------------------------------------------------------------------ Einstieg */
S["schule-start"] = {
  nav: "Schule: Einstieg", typ: "lektion", gruppe: "Für die Schule", titel: "KI im Unterricht: Einstieg für Klassen und Lehrkräfte", symbol: "school",
  lernziele: [
    "Du kannst in zwei Sätzen sagen, was das KI-Labor ist und wie eine Unterrichtsstunde damit abläuft.",
    "Du weißt, wie viele Geräte gleichzeitig arbeiten können und warum Vierergruppen sinnvoll sind.",
    "Du weißt, welche Labore im Unterricht gebraucht werden und welche nicht.",
  ],
  kurz: "Kostenlos und ohne Konto: drei Stunden für Klasse 8 und die Technik, die dafür nötig ist.",
  zusammenfassung: "Das KI-Labor ist ein kostenloses Lernangebot zu künstlicher Intelligenz auf Deutsch. Für Klasse 8 gibt es drei Stunden von je 45 Minuten, die ohne Konto, Kamera und Mikrofon auskommen. Der Klassenlink lautet /?weg=schule.",
  abschnitte: [
    {h: "Was das Labor ist",
     kurz: "Ein Lernangebot zum Ausprobieren: Du verstehst KI, indem du Punkte setzt, ein Netz trainierst und ein Sprachmodell fragst.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "user-check", text: "Ohne Konto", sub: "kostenlos für alle"},
      {icon: "mouse", text: "Ausprobieren", sub: "statt nur lesen"},
      {icon: "shield-check", text: "Ohne Kamera", sub: "im Unterricht nicht nötig"}]},
     p: [
      "Das KI-Labor ist ein Lernangebot von Daniel Alisch. Du probierst aus, wie [[ki|künstliche Intelligenz]] funktioniert. Es läuft auf einem einzigen kleinen Rechner, ohne externe KI-Dienste. Mehr dazu: {{ueber|Über das KI-Labor}}.",
     ],
     merke: "Es ist ein Lernprojekt. Es zeigt, wie KI arbeitet. Es ist kein Werkzeug für Hausaufgaben."},
    {h: "Der Ablauf in drei Stunden",
     kurz: "Drei Stunden zu je 45 Minuten für Klasse 8, jeweils mit Einstieg, Erarbeitung, Sicherung und Reflexion.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "lightbulb", text: "KI 1", sub: "Was ist KI?"},
      {icon: "brain-circuit", text: "KI 2", sub: "Wie lernt sie?"},
      {icon: "search", text: "KI 3", sub: "Echt oder erfunden?", farbe: "gruen"}]},
     liste: [
      "{{schule-stunde-1|KI 1}}: Was ist KI? Punkte-Labor und Prompting.",
      "{{schule-stunde-2|KI 2}}: Wie lernt ein Computer? Punkte-Labor und Netz-Spielplatz.",
      "{{schule-stunde-3|KI 3}}: Echt oder erfunden? Halluzinationen und Quellenprüfung.",
      "Medienkompetenz: sieben weitere Einheiten, beginnend mit {{medien-stunde-1|Medien 1: Echt oder KI?}}, und ein Paket für den {{elternabend|Elternabend}}.",
     ]},
    {h: "Der Klassenlink",
     kurz: "Der Klassenlink öffnet das Labor im Schulweg und speichert nichts.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "link", text: "Klassenlink", sub: "/?weg=schule"},
      {icon: "layout-grid", text: "Schulweg", sub: "Seiten für die Stunden"},
      {icon: "users", text: "Gruppen", sub: "vier Personen", farbe: "gruen"}]},
     p: [
      "Hänge `/?weg=schule` an die Adresse des Labors und gib den Link weiter: an die Tafel, in die Lernplattform oder als QR-Code.",
     ]},
    {h: "Technik: so viele Geräte gehen",
     kurz: "Vierergruppen, höchstens 7 Geräte gleichzeitig, denn der Rechner beantwortet nur wenige Sprachmodell-Anfragen gleichzeitig.",
     visual: {typ: "zahlen", kacheln: [
      {wert: "4", label: "Personen je Gruppe", icon: "users"},
      {wert: "7", label: "Geräte höchstens", icon: "laptop"},
      {wert: "kurz", label: "Wartezeit bei Chat", icon: "hourglass"}]},
     p: [
      "Chat und Prompt-Werkstatt brauchen das Sprachmodell. Der kleine Rechner beantwortet höchstens zwei Anfragen gleichzeitig, weitere warten (bis zu 6 Plätze, bis zu 90 Sekunden). Dann erscheint ein Hinweis wie „Du bist Nr. 2“, und wenn alles belegt ist, „Der Rechner ist gerade ausgelastet“. Darum: Vierergruppen, ein Gerät je Gruppe, höchstens 7 Geräte gleichzeitig (28 Personen passen genau). Punkte-Labor, Netz-Spielplatz und Risiko-Spiel rechnen im Browser.",
     ],
     alltag: "Wie zwei Kopierer in der Schule: Sie drucken gleichzeitig, wer wartet, kommt trotzdem dran, aber bei zu vielen Wartenden heißt es: später noch einmal versuchen."},
    {h: "Daten: kein Konto, nichts dauerhaft gespeichert",
     kurz: "Kein Konto, keine Abfrage von Name, Alter oder Klasse, keine dauerhafte Speicherung der Eingaben.",
     visual: {typ: "vergleich",
      links: {titel: "Wird nicht verlangt", icon: "ban", farbe: "gruen", punkte: ["Konto, Name, E-Mail", "Alter oder Klasse", "Werbung oder Statistik"]},
      rechts: {titel: "Technisch nötig", icon: "database", farbe: "orange", punkte: ["Sitzungs-Cookie kl_s", "Verbindungsdaten des Servers", "Merkzettel im Browser"]}},
     p: [
      "Das Labor legt keine Profile an, hat keine Werbung und keine Besucherstatistik, Chat-Fragen werden nicht aufbewahrt.",
      "Technisch nötig sind das Sitzungs-Cookie `kl_s`, kleine Merkzettel im Browser und die Verbindungsdaten des Servers. Mehr: {{sicherheit-einfach|Ist das sicher? Was wird gespeichert?}}.",
      "Gib im Chat keine echten Namen, Adressen oder privaten Dinge ein.",
     ],
     merke: "Stand: 22.11.2026. Verbindlich sind Impressum und Datenschutzerklärung des Betreibers, sie sind unten in der Fußzeile verlinkt."},
    {h: "Was ihr nicht braucht",
     kurz: "Kamera, Mikrofon und Gesichtserkennung sind im Unterricht nicht nötig und nicht vorgesehen.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "camera", text: "Kamera", sub: "nicht nötig"},
      {icon: "mic", text: "Mikrofon", sub: "nicht nötig"},
      {icon: "scan-face", text: "Gesichtserkennung", sub: "nicht vorgesehen"}]},
     p: [
      "Alle Aufgaben laufen ohne Kamera und Mikrofon, bitte lasst die Labore dazu im Menü in der Klasse aus. Das Gesichts-Labor ist laut Hinweis erst ab 16 Jahren gedacht, jüngere nur mit Einverständnis der Eltern. Im Chat steht der Hinweis „Unter 16: bitte gemeinsam mit einer erwachsenen Person“. Im Unterricht seid ihr mit der Lehrkraft dabei, sie ist diese erwachsene Person.",
      "Für eine Vorführung durch die Lehrkraft haben vier Kamera-Labore je eine Unterrichtsidee für 45 Minuten: {{bild-schuetzen|Bild schützen}}, {{koerperhaltung|Körperhaltung}}, {{text-lesen|Text auf Papier lesen}} und {{fingeralphabet|Fingeralphabet}}. Sie gehören nicht zu den drei Stunden. Was dabei zu beachten ist, steht in {{schule-faecher|Welche Fächer passen?}}.",
     ]},
  ],
  mitnehmen: [
    "Das Labor ist kostenlos, braucht kein Konto und speichert keine Eingaben dauerhaft.",
    "Vierergruppen, höchstens 7 Geräte gleichzeitig, kurze Wartezeiten einplanen.",
    "Kamera, Mikrofon und Gesichtserkennung bleiben im Unterricht aus. Die Aufgaben brauchen sie nicht.",
  ],
  grenzen: [
    "Das Labor ist ein einzelner kleiner Rechner. Bei vielen gleichzeitigen Sprachmodell-Anfragen entstehen Wartezeiten.",
    "Das Sprachmodell ist klein und macht Fehler. Das ist Teil von KI 3, aber keine Musterlösung für Hausaufgaben.",
  ],
  weiter: ["schule-stunde-1", "schule-lehrkraefte", "schule-schulleitung", "schule-eltern"],
};

/* ------------------------------------------------------------------ Stunde 1 */
S["schule-stunde-1"] = {
  nav: "KI 1: Was ist KI?", typ: "lektion", gruppe: "Für die Schule", titel: "KI 1: Was ist KI? Erkennen, Lernen, Entscheiden", symbol: "presentation",
  downloads: [
    {text: "Arbeitsblatt KI 1", sub: "4 Seiten A4, mit Quiz, für die Klasse", href: "/static/materialien/arbeitsblatt-stunde-1.pdf"},
    {text: "Lösungsblatt KI 1", sub: "3 Seiten A4, nur für Lehrkräfte, mit Plänen für Einzel- und Doppelstunde und Hilfekarten zum Ausschneiden", href: "/static/materialien/loesung-stunde-1.pdf"},
  ],
  lernziele: [
    "Du kannst an drei Beispielen aus deinem Alltag erklären, wo KI etwas erkennt und entscheidet.",
    "Du kannst im Punkte-Labor zeigen, dass ein Modell aus Beispielen lernt und nicht aus festen Regeln.",
    "Du kannst einen Prompt so verbessern, dass die Antwort des Sprachmodells besser passt.",
  ],
  kurz: "45 oder 90 Minuten für Klasse 8, ohne Kamera. Die Einzelstunde: Einstieg 5, Erarbeitung 20, Sicherung 10, Reflexion 10.",
  zusammenfassung: "KI 1 von 3 für Klasse 8: Was ist KI? Die Klasse erlebt im Punkte-Labor, dass ein Modell aus Beispielen lernt, und verbessert in der Prompt-Werkstatt eine Frage an ein Sprachmodell. Mit Zeitplan, Aufgaben, Lösungshinweisen und Tafelbild.",
  abschnitte: [
    {h: "Der Zeitplan",
     kurz: "Vier Phasen in 45 Minuten: Einstieg 5, Erarbeitung 20, Sicherung 10, Reflexion 10.",
     visual: {typ: "zeitachse", punkte: [
      {t: "5 Min", text: "Einstieg", icon: "lightbulb"},
      {t: "20 Min", text: "Erarbeitung", icon: "mouse"},
      {t: "10 Min", text: "Sicherung", icon: "clipboard-check"},
      {t: "10 Min", text: "Reflexion", icon: "message-circle"}]},
     p: [
      "Vierergruppen, ein Gerät je Gruppe, Klassenlink aus der {{schule-start|Einstiegsseite}}. Kamera und Mikrofon bleiben aus.",
     ]},
    {h: "Einstieg (5 Minuten)",
     kurz: "Die Frage an die Klasse: Wo steckt KI schon in deinem Tag?",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "music", text: "Musik", sub: "Vorschläge für dich"},
      {icon: "languages", text: "Übersetzer", sub: "Text in andere Sprache"},
      {icon: "mail", text: "Spamfilter", sub: "sortiert Mails"},
      {icon: "type", text: "Autokorrektur", sub: "ergänzt Wörter"},
      {icon: "video", text: "Videofeed", sub: "sortiert Clips"},
      {icon: "speech", text: "Sprachassistent", sub: "versteht dich"}]},
     p: [
      "Sortiere die Beispiele aus Bild und Klasse an der Tafel in drei Spalten: erkennen, lernen, entscheiden. Frage: Woher weiß das Programm, was es tun soll? Das Wort „programmiert“ greifst du in der Sicherung wieder auf.",
     ]},
    {h: "Erarbeitung (20 Minuten)",
     kurz: "Zwei Stationen: Punkte-Labor (12 Minuten) und Prompt-Werkstatt (8 Minuten), die Gruppen starten versetzt.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "chart-scatter", text: "Punkte-Labor", sub: "Seite ml"},
      {icon: "pen-line", text: "Prompt-Werkstatt", sub: "Seite prompting"},
      {icon: "notebook-pen", text: "Notizen", sub: "fürs Tafelbild", farbe: "gruen"}]},
     p: [
      "Punkte-Labor: Seite {{ml|Maschinelles Lernen}}, rechnet im Browser. Prompt-Werkstatt: Seite {{prompting|Gut fragen: Prompts schreiben}}, schickt zwei Fragen an das Sprachmodell, darum nicht alle Gruppen gleichzeitig auf „Beide senden“. Die Stichpunkte der Gruppen dienen später als Tafelbild.",
     ]},
    {h: "Arbeitsblatt: die Aufgaben",
     kurz: "Drei Aufgaben für die Gruppe, gedruckt auf dem vierseitigen Arbeitsblatt (zuerst die Aufgaben, danach Quiz, Nachdenken, Zusatz und Legende).",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "chart-scatter", text: "Aufgabe 1", sub: "Punkte lernen lassen"},
      {icon: "sliders-horizontal", text: "Aufgabe 2", sub: "k verändern"},
      {icon: "pen-line", text: "Aufgabe 3", sub: "Prompt verbessern"}]},
     p: [
      "Jede Aufgabe beginnt mit einem Operator, also einem Arbeitsauftrag wie „Beschreibe“. Das Kürzel dahinter zeigt den Anforderungsbereich (I, II oder III). Die Tabelle steht in der {{schule-lehrkraefte|Handreichung}}.",
      "Zusätzlich steht an jeder Aufgabe die Sozialform und das Niveau: Basis, Standard oder Herausforderung.",
     ],
     liste: [
      "**Aufgabe 1, Punkte-Labor (Gruppe zu viert, Basis):** **Beschreibe** (I), wie das Labor in der Mitte entscheidet, und schreibe es in einem Satz auf. Setze dafür mit Blau etwa zehn Punkte in die linke und mit Orange etwa zehn Punkte in die rechte Hälfte. Fahre mit der Maus über eine freie Stelle in der Mitte.",
      "**Aufgabe 2, Punkte-Labor (Partnerarbeit, Standard):** **Beschreibe** (I), was mit der Grenze zwischen den Farben passiert, wenn du den Regler k (Nachbarn) von 1 bis 15 verschiebst. Schalte dafür „Entscheidungsfläche zeigen“ ein. Setze dann einen blauen Punkt mitten in die orangefarbene Gruppe und **erkläre** (II), was sich bei k gleich 1 und bei k gleich 9 ändert.",
      "**Aufgabe 3, Prompt-Werkstatt (Gruppe zu viert, Herausforderung):** **Vergleiche** (II) die Antworten von Prompt A (kurz) und Prompt B (ausführlich). Wähle dafür eine Aufgabe aus dem Alltag und drücke „Beide senden“. **Beurteile** (III), welche Antwort besser passt, und **entwickle** (III) eine Fassung von Prompt A, die fast so gut wird wie Prompt B.",
      "**Zusatz für Schnelle (Einzelarbeit, Herausforderung):** **Begründe** (III), warum die Entscheidung im Punkte-Labor schwerfällt. Drücke dafür „Beispieldaten“ und setze drei eigene Punkte an Stellen, an denen die Entscheidung schwerfällt.",
     ]},
    {h: "Lösungshinweise",
     kurz: "Das Labor entscheidet nach den nächsten Beispielen, ein knapper Prompt lässt dem Modell Raum zum Raten.",
     visual: {typ: "vergleich",
      links: {titel: "Punkte-Labor", icon: "chart-scatter", farbe: "akzent", punkte: ["Nächste Nachbarn stimmen ab", "Kleines k: unruhige Grenze", "Großes k: ruhige Grenze"]},
      rechts: {titel: "Prompt-Werkstatt", icon: "pen-line", farbe: "gruen", punkte: ["Rolle, Ziel, Form nennen", "Was fehlt, wird geraten", "Antwort prüfen"]}},
     liste: [
      "**Zu Aufgabe 1, Beschreibe (I):** Eine gute Antwort nennt, dass das Labor die Farbe der Mehrheit unter den Punkten nimmt, die dem Mauspunkt am nächsten liegen. Sie braucht keine Regel wie „links ist blau“: Beispiele statt Regeln, das Kernbild von maschinellem Lernen.",
      "**Zu Aufgabe 2, Beschreibe (I) und Erkläre (II):** Beschreiben heißt hier, die Beobachtung festzuhalten: Bei kleinem k folgt die Grenze jedem einzelnen Punkt und wird unruhig, bei großem k wird sie glatter. Erklären heißt, den Grund zu nennen: Ein falsch gesetzter Punkt stört bei k gleich 1 stark, bei größerem k kaum, die Mehrheit überstimmt ihn.",
      "**Zu Aufgabe 3, Vergleiche (II), Beurteile (III), Entwickle (III):** Der Vergleich nennt Unterschiede, meist ist Prompt B genauer: Er nennt Rolle, Ziel, Ton und Form. Das Urteil sagt, welche Antwort besser passt, und stützt sich auf diese Unterschiede. Der neue Prompt A ergänzt mindestens eine der fehlenden Angaben. Es gibt keine Musterantwort, die Antworten des Modells wechseln. Zählt die Begründung der Gruppe.",
      "**Zum Zusatz, Begründe (III):** Eine gute Begründung nennt den Grund: Schwer fällt die Entscheidung dort, wo beide Farben gemischt liegen. Dort hat das Modell zu wenig klare Beispiele.",
     ]},
    {h: "Gestufte Hilfen",
     kurz: "Zu jeder Aufgabe zwei Tipps, auch als Hilfekarten im Lösungsblatt: Tipp 1 gibst du zuerst, Tipp 2 nur bei Bedarf.",
     visual: {typ: "raster", spalten: 2, zellen: [
      {icon: "lightbulb", text: "Tipp 1", sub: "gibst du zuerst"},
      {icon: "key-round", text: "Tipp 2", sub: "nur bei Bedarf"}]},
     liste: [
      "**Tipp 1 zu Aufgabe 1:** Schau, welche Punkte in der Nähe des Mauspunkts liegen.",
      "**Tipp 2 zu Aufgabe 1:** Zähle, welche Farbe unter den nächsten Punkten öfter vorkommt.",
      "**Tipp 1 zu Aufgabe 2:** Ziehe den Regler langsam und beobachte die Grenze.",
      "**Tipp 2 zu Aufgabe 2:** Vergleiche k gleich 1 mit k gleich 9: Wie viele Nachbarn stimmen jeweils ab?",
      "**Tipp 1 zu Aufgabe 3:** Lies beide Antworten nebeneinander: Was steht nur in Prompt B?",
      "**Tipp 2 zu Aufgabe 3:** Rolle, Ziel, Ton, Form: Welche dieser Angaben fehlt in Prompt A?",
     ]},
    {h: "Differenzierung: leicht und schwer",
     kurz: "Leichte Wege geben Sätze vor, schwere Wege verlangen eigene Begründungen.",
     visual: {typ: "vergleich",
      links: {titel: "Leichter", icon: "smile", farbe: "gruen", punkte: ["Knopf „Beispieldaten“ nutzen", "Lückensatz zur Entscheidung", "Prompt A nur um eine Angabe ergänzen"]},
      rechts: {titel: "Schwerer", icon: "flame", farbe: "orange", punkte: ["Eigene Daten mit drei Farben", "Entscheidungsfläche deuten", "Neuen Prompt von null schreiben"]}},
     liste: [
      "**Leichter:** Start mit „Beispieldaten“. Bei den Operatoren **Nenne** (I) und **Beschreibe** (I) bleiben: Satz ergänzen: „Das Labor entscheidet nach ___, weil ___.“ Bei Aufgabe 3 nur eine Angabe in Prompt A ergänzen, etwa den Ton.",
      "**Schwerer:** Mit **Begründe** (III) und **Beurteile** (III) arbeiten: Drei Farben, die sich überlappen: Wo macht die Fläche Fehler, und warum? Bei Aufgabe 3 einen neuen Prompt mit Rolle, Ziel, Kontext, Format und Grenzen schreiben.",
     ]},
    {h: "Sicherung (10 Minuten): das Tafelbild",
     kurz: "Erkennen, Lernen, Entscheiden: Ein Kreislauf aus Beispielen, Muster, Entscheidung und Prüfung.",
     visual: {typ: "kreis", mitte: "KI",
      knoten: [
       {icon: "images", text: "Beispiele sammeln"},
       {icon: "shapes", text: "Muster finden"},
       {icon: "signpost", text: "Entscheiden"},
       {icon: "circle-check", text: "Prüfen, verbessern"}]},
     p: [
      "Zeichne den Kreis an die Tafel. Die Gruppen ordnen ihre Notizen zu: Punkte setzen ist Beispiele sammeln, das Abstimmen der Nachbarn ist Muster nutzen, die Farbe an der Mausstelle ist die Entscheidung. Hat jemand dem Labor die Regel „links ist blau“ gesagt? Nein, es hat sie aus den Beispielen abgeleitet.",
     ],
     merke: "Ein Modell lernt Muster aus Beispielen. Wer die Beispiele auswählt, bestimmt, was es lernt."},
    {h: "Reflexion (10 Minuten)",
     muster: [["Beispiele: Videovorschläge, Spamfilter, Autokorrektur, Playlists", "Gut: spart Zeit. Kritisch: Du siehst nicht, nach welchen Beispielen entschieden wurde", "Offene Frage: Zählt, dass die Begründung stimmig ist"], ["Das Modell kennt nur diese Ecke und entscheidet dort sicher", "Für alle anderen Bereiche rät es, die Entscheidungen werden schlecht", "Schiefe Beispiele führen zu schiefen Entscheidungen"], ["Das Modell rät, was im Prompt fehlt", "Es wirkt klug, weil es plausible Wörter wählt, nicht weil es dich versteht", "Rolle, Ziel, Ton und Form zu nennen lässt weniger Raum zum Raten"]],
     kurz: "Drei Fragen: zwei Minuten in der Gruppe, dann eine Runde im Plenum.",
     visual: {typ: "skala", links: "wenig verstanden", rechts: "gut verstanden", marker: 0.5, label: "Eigene Einschätzung per Handzeichen"},
     liste: [
      "Wo im Alltag hat KI schon über dich „entschieden“? Warst du damit einverstanden?",
      "Was würde passieren, wenn alle Beispiele im Punkte-Labor aus nur einer Ecke kämen?",
      "Warum ist ein guter Prompt wichtig, obwohl das Modell „klug“ wirkt?",
     ]},
  ],
  mitnehmen: [
    "KI lernt aus Beispielen. Sie bekommt keine fertige Regel eingebaut.",
    "Mit den Beispielen ändert sich die Entscheidung. Wenige oder schiefe Beispiele führen zu falschen Entscheidungen.",
    "Ein Sprachmodell rät, was fehlt. Ein genauer Prompt lässt weniger Raum zum Raten.",
  ],
  quiz: [
    {frage: "Du fährst im Punkte-Labor mit der Maus über eine freie Stelle, und das Feld wird orange. Woher kommt diese Entscheidung?",
     optionen: ["Aus einer Regel, die jemand für diese Stelle vorher festgelegt hat", "Aus einer Anfrage an einen Server, der die richtige Farbe kennt", "Aus den Farben der nächsten gesetzten Punkte, die dort abstimmen", "Aus einem Zufallswert, der so lange wiederholt wird, bis es passt"],
     richtig: 2, abschnitt: "Erarbeitung (20 Minuten)",
     erklaerung: "Das Labor vergleicht mit den nächsten Beispielen und lässt sie abstimmen. Eine feste Regel gibt es nicht."},
    {frage: "Ein Modell lernt nur mit Fotos von Hunden auf Rasen. Dann bekommt es ein Foto von einem Hund im Schnee. Was ist wahrscheinlich?",
     optionen: ["Es ist unsicher, weil Schnee in seinen Beispielen fehlt", "Es erkennt den Hund sicher, weil Hunde überall gleich aussehen", "Es lernt den Schnee beim Ansehen des Fotos von selbst dazu", "Es braucht dafür nur einen schnelleren Rechner statt mehr Beispiele"],
     richtig: 0, abschnitt: "Sicherung (10 Minuten): das Tafelbild",
     erklaerung: "Ein Modell kennt nur, was in seinen Beispielen steckt. Wo sie fehlen, wird die Entscheidung unsicher oder falsch."},
    {frage: "Dein Prompt lautet nur „Schreib was über Wale“. Die Antwort ist zu lang und zu schwer. Was ist der beste nächste Schritt?",
     optionen: ["Den gleichen Prompt noch einmal senden, bis die Antwort passt", "Fachwörter ergänzen, damit das Modell klüger antwortet", "Den Prompt kürzen, weil kurze Prompts immer genauer sind", "Ziel, Ton und Form nennen, etwa: in fünf Sätzen für Klasse 8"],
     richtig: 3, abschnitt: "Lösungshinweise",
     erklaerung: "Das Modell rät, was im Prompt fehlt. Wer Ziel, Ton und Form nennt, lässt weniger Raum zum Raten."},
  ],
  weiter: ["schule-stunde-2", "ml", "prompting", "karte"],
};

/* ------------------------------------------------------------------ Stunde 2 */
S["schule-stunde-2"] = {
  nav: "KI 2: Wie lernt ein Computer?", typ: "lektion", gruppe: "Für die Schule", titel: "KI 2: Wie lernt ein Computer? Daten, Training, Fehler", symbol: "brain-circuit",
  downloads: [
    {text: "Arbeitsblatt KI 2", sub: "4 Seiten A4, mit Quiz, für die Klasse", href: "/static/materialien/arbeitsblatt-stunde-2.pdf"},
    {text: "Lösungsblatt KI 2", sub: "3 Seiten A4, nur für Lehrkräfte, mit Plänen für Einzel- und Doppelstunde und Hilfekarten zum Ausschneiden", href: "/static/materialien/loesung-stunde-2.pdf"},
  ],
  lernziele: [
    "Du kannst erklären, warum die Qualität der Daten bestimmt, wie gut ein Modell entscheidet.",
    "Du kannst am Netz-Spielplatz zeigen, dass Training ein Kreislauf aus Vorhersagen, Fehler messen und Nachjustieren ist.",
    "Du kannst beschreiben, was ein Netz tun muss, damit es ein schwieriges Muster lernt.",
  ],
  kurz: "45 oder 90 Minuten für Klasse 8: Daten, Training und Fehler erlebst du im Punkte-Labor und im Netz-Spielplatz.",
  zusammenfassung: "KI 2 von 3 für Klasse 8: Wie lernt ein Computer? Die Klasse arbeitet mit dem Punkte-Labor und dem Netz-Spielplatz, beide ohne Kamera. Sie sieht, wie Daten und Fehler das Lernen verändern und warum Netze Zwischenschichten brauchen.",
  abschnitte: [
    {h: "Der Zeitplan",
     kurz: "Wieder 45 Minuten: Einstieg 5, Erarbeitung 20, Sicherung 10, Reflexion 10.",
     visual: {typ: "zeitachse", punkte: [
      {t: "5 Min", text: "Einstieg", icon: "lightbulb"},
      {t: "20 Min", text: "Erarbeitung", icon: "mouse"},
      {t: "10 Min", text: "Sicherung", icon: "clipboard-check"},
      {t: "10 Min", text: "Reflexion", icon: "message-circle"}]},
     p: [
      "Beide Labore rechnen im Browser, die Gruppen können gleichzeitig arbeiten. Die Stunde baut auf {{schule-stunde-1|KI 1}} auf.",
     ]},
    {h: "Einstieg (5 Minuten)",
     kurz: "Wie lernst du, einen Hund von einer Katze zu unterscheiden, und woher weiß es ein Computer?",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "images", text: "Viele Bilder", sub: "mit Etikett"},
      {icon: "brain-circuit", text: "Modell", sub: "stellt sich ein"},
      {icon: "circle-check", text: "Vorhersage", sub: "bei neuem Bild", farbe: "gruen"}]},
     p: [
      "Kleine Kinder lernen durch Zeigen: „Das ist ein Hund.“ Ein Computer bekommt viele Beispiele mit Etikett ([[label|Label]]) und stellt sich selbst ein, das ist [[training|Training]]. Schreibe an die Tafel: Daten, Training, Fehler.",
     ],
     alltag: "Beim Fußballtraining wiederholst du einen Schuss, siehst, wo der Ball landet, und korrigierst. Ein Netz macht dasselbe mit Zahlen."},
    {h: "Erarbeitung (20 Minuten)",
     kurz: "Zwei Stationen: Daten im Punkte-Labor (8 Minuten), Netz im Spielplatz (12 Minuten).",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "chart-scatter", text: "Punkte-Labor", sub: "Daten und Fehler"},
      {icon: "network", text: "Netz-Spielplatz", sub: "Training und Schichten"},
      {icon: "notebook-pen", text: "Notizen", sub: "für die Sicherung", farbe: "gruen"}]},
     p: [
      "Punkte-Labor: Seite {{ml|Maschinelles Lernen}}. Netz-Spielplatz: Seite {{neuronale-netze|Neuronale Netze von Grund auf}}, mit Punktmenge, kleinem Netz und Entscheidungsfläche, die sich live verändert. Schnelle Gruppen lesen auf {{daten|Daten, der Rohstoff}} den Abschnitt zur Datenqualität.",
     ]},
    {h: "Arbeitsblatt: die Aufgaben",
     kurz: "Drei Aufgaben zu Daten, Netz und Lernrate.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "chart-scatter", text: "Aufgabe 1", sub: "Falsche Beispiele"},
      {icon: "network", text: "Aufgabe 2", sub: "Schichten bauen"},
      {icon: "gauge", text: "Aufgabe 3", sub: "Lernrate prüfen"}]},
     p: [
      "Jede Aufgabe beginnt mit einem Operator, also einem Arbeitsauftrag wie „Beschreibe“. Das Kürzel dahinter zeigt den Anforderungsbereich (I, II oder III). Die Tabelle steht in der {{schule-lehrkraefte|Handreichung}}.",
      "Zusätzlich steht an jeder Aufgabe die Sozialform und das Niveau: Basis, Standard oder Herausforderung.",
     ],
     liste: [
      "**Aufgabe 1, Punkte-Labor (Gruppe zu viert, Basis):** **Beschreibe** (I), wo ein Fehler entsteht und wie die Fläche rund um den falschen Punkt aussieht. Drücke dafür „Beispieldaten“ und schalte „Entscheidungsfläche zeigen“ ein. Setze einen Punkt in der falschen Farbe mitten in eine Gruppe. Stelle k (die Zahl der nächsten Punkte, die abstimmen) auf 1, dann auf 9, und **vergleiche** (II) beide Flächen.",
      "**Aufgabe 2, Netz-Spielplatz (Partnerarbeit, Standard):** **Nenne** (I) die Zahl der richtigen Punkte bei „Zwei Wolken“ und beim „Schachbrett“, jeweils mit 0 Zwischenschichten, und **vergleiche** (II) beide Werte. Starte dafür das Training und notiere die Zahl. Baue dann eine Zwischenschicht mit vier Neuronen ein, trainiere erneut und **erkläre** (II), was sich ändert.",
      "**Aufgabe 3, Netz-Spielplatz (Gruppe zu viert, Herausforderung):** **Begründe** (III), bei welcher Einstellung der Lernrate das Netz stabil lernt. Stelle dafür die Lernrate sehr klein, dann sehr groß und beobachte den Verlust (die Kurve). **Erkläre** (II) in zwei Sätzen, was die Lernrate steuert.",
      "**Zusatz für Schnelle (Einzelarbeit, Herausforderung):** **Entwickle** (III) für die „Spirale“ ein Netz, das mehr als 90 Prozent der Testpunkte richtig trifft (im Labor: mehr als 36 von 40 Testpunkten, es steht unter „Treffer Test“). Probiere dafür Schichten und Neuronen aus und **vergleiche** (II) die Trainings- und die Testkurve.",
     ]},
    {h: "Lösungshinweise",
     kurz: "Falsche Beispiele schaden bei kleinem k stark, schwierige Muster brauchen Zwischenschichten.",
     visual: {typ: "matrix", x: ["Zwei Wolken", "Schachbrett"], y: ["Ohne Schicht", "Mit Schicht"],
      zellen: [[{text: "gelingt", ton: "gut"}, {text: "scheitert", ton: "schlecht"}],
               [{text: "gelingt", ton: "gut"}, {text: "gelingt", ton: "gut"}]]},
     liste: [
      "**Zu Aufgabe 1, Beschreibe (I) und Vergleiche (II):** Eine gute Beschreibung nennt: Bei k gleich 1 entscheidet allein der nächste Punkt, um den falschen Punkt bildet sich eine Insel in der falschen Farbe. Der Vergleich ergänzt: Bei k gleich 9 überstimmen die richtigen Nachbarn den Fehler. Lehre: Fehler in den Trainingsdaten wirken mal stärker, mal schwächer.",
      "**Zu Aufgabe 2, Nenne (I), Vergleiche (II), Erkläre (II):** Genannt werden zwei Zahlen ohne Erklärung. Der Vergleich stellt sie gegenüber: Zwei Wolken trennt eine gerade Linie, das schafft ein Netz ohne Zwischenschicht. Die Erklärung nennt den Grund: Das Schachbrett braucht eine gebogene Grenze, ohne Zwischenschicht bleibt die Trefferquote nahe der Hälfte, erst eine Zwischenschicht mit mehreren Neuronen biegt die Grenze.",
      "**Zu Aufgabe 3, Begründe (III) und Erkläre (II):** Eine gute Begründung sagt, warum eine Einstellung stabil lernt und andere nicht: Eine sehr kleine Lernrate lässt das Netz kaum vorankommen, eine sehr große lässt den Verlust springen, das Netz findet keine stabile Lösung. Die Erklärung hält fest: Die Lernrate steuert die Schrittgröße beim Nachjustieren.",
      "**Zum Zusatz, Entwickle (III) und Vergleiche (II):** Das Ergebnis ist eine Einstellung (Schichten, Neuronen), bei der das Labor mehr als 36 von 40 Testpunkten richtig zählt (über 90 Prozent). Beim Vergleich der Kurven gilt: Fällt die Trainingskurve weiter, während die Testkurve steigt, hat das Netz die Beispiele eher auswendig gelernt ([[ueberanpassung|Überanpassung]]), vor allem mit sehr vielen Neuronen und wenigen Daten.",
     ]},
    {h: "Gestufte Hilfen",
     kurz: "Zu jeder Aufgabe zwei Tipps, auch als Hilfekarten im Lösungsblatt: Tipp 1 gibst du zuerst, Tipp 2 nur bei Bedarf.",
     visual: {typ: "raster", spalten: 2, zellen: [
      {icon: "lightbulb", text: "Tipp 1", sub: "gibst du zuerst"},
      {icon: "key-round", text: "Tipp 2", sub: "nur bei Bedarf"}]},
     liste: [
      "**Tipp 1 zu Aufgabe 1:** Setze den falschen Punkt in die Mitte einer Gruppe und schau, welche Farbe um ihn herum entsteht.",
      "**Tipp 2 zu Aufgabe 1:** Bei k gleich 1 entscheidet nur der nächste Punkt, bei k gleich 9 stimmen neun Nachbarn ab.",
      "**Tipp 1 zu Aufgabe 2:** Schau, ob eine gerade Linie die Punkte trennen kann.",
      "**Tipp 2 zu Aufgabe 2:** Eine Zwischenschicht lässt die Grenze eine Biegung machen.",
      "**Tipp 1 zu Aufgabe 3:** Beobachte die Kurve bei jeder Einstellung: Fällt sie ruhig oder springt sie?",
      "**Tipp 2 zu Aufgabe 3:** Die Lernrate bestimmt, wie groß jeder Schritt beim Nachjustieren ist.",
     ]},
    {h: "Differenzierung: leicht und schwer",
     kurz: "Leichte Wege geben Einstellungen vor, schwere verlangen eigene Vermutungen.",
     visual: {typ: "vergleich",
      links: {titel: "Leichter", icon: "smile", farbe: "gruen", punkte: ["Einstellungen sind vorgegeben", "Lückentext zum Ergebnis", "Nur Aufgabe 1 und 2"]},
      rechts: {titel: "Schwerer", icon: "flame", farbe: "orange", punkte: ["Erst vermuten, dann testen", "Kurven deuten", "Spirale und Zusatzaufgabe"]}},
     liste: [
      "**Leichter:** Die Lehrkraft nennt die Einstellungen, etwa „Schachbrett, 1 Schicht, 4 Neuronen“. Die Gruppe bleibt bei **Nenne** (I) und **Beschreibe** (I) und ergänzt: „Ohne Zwischenschicht stimmen nur etwa ___ Punkte, weil ___.“",
      "**Schwerer:** Erst eine Vermutung aufschreiben („Mit zwei Neuronen reicht es für das Schachbrett“), dann prüfen, **begründen** (III) und **beurteilen** (III), ob sie stimmt, und Trainings- und Testkurve unterscheiden.",
     ]},
    {h: "Sicherung (10 Minuten): das Tafelbild",
     kurz: "Training ist ein Kreislauf: vorhersagen, Fehler messen, nachjustieren, wiederholen.",
     visual: {typ: "kreis", mitte: "Training",
      knoten: [
       {icon: "target", text: "Vorhersagen"},
       {icon: "ruler", text: "Fehler messen"},
       {icon: "sliders-horizontal", text: "Nachjustieren"},
       {icon: "repeat", text: "Wiederholen"}]},
     p: [
      "Zeichne den Kreis und ordne die Notizen zu. „Fehler messen“ heißt im Netz-Spielplatz Verlust, „Nachjustieren“ ändert die Gewichte der Verbindungen (Details: {{training|Wie ein Modell lernt}}). Verbinde mit Stunde 1: Die Beispiele sind die Daten, mit schlechten Daten lernt auch das beste Netz nichts Gutes.",
     ],
     merke: "Gute Daten und ein passendes Netz machen ein Modell stark. Fehlt eins davon, wird es schwach."},
    {h: "Reflexion (10 Minuten)",
     muster: [["Das Modell entscheidet bei bestimmten Gruppen oder Fällen auffällig schlechter", "Die Beispiele mit der Wirklichkeit vergleichen: Fehlen Gruppen, dominiert eine Gruppe?", "Mit neuen Beispielen testen, die nicht im Training vorkamen"], ["Gesundheit: eher nein, denn 5 Fehler auf 100 Fälle können schwere Folgen haben, ein Mensch muss prüfen", "Videoauswahl: eher ja, ein Fehler hat kaum Folgen", "Entscheidend ist, was ein Fehler kostet, nicht nur die Quote"], ["Das Modell trägt keine Verantwortung, es rechnet nur", "Verantwortlich sind Menschen: wer die Daten auswählt, das Modell einsetzt und die Entscheidung nutzt", "Wichtig sind prüfbare Entscheidungen und ein Weg für Einspruch"]],
     kurz: "Drei Fragen: Fehler in Daten, Grenzen von Netzen, Verantwortung für die Beispiele.",
     visual: {typ: "skala", links: "wenig sicher", rechts: "sehr sicher", marker: 0.5, label: "Wie sicher bist du bei Daten, Training, Fehler?"},
     liste: [
      "Woran würdest du merken, dass die Trainingsdaten eines Modells schief sind?",
      "Ein Netz stimmt zu 95 Prozent. Reicht dir das, wenn es um deine Gesundheit geht? Und bei der Auswahl eines Videos?",
      "Wer ist verantwortlich, wenn ein Modell wegen schiefer Beispiele jemanden benachteiligt?",
     ]},
  ],
  mitnehmen: [
    "Lernen heißt vorhersagen, Fehler messen, nachjustieren und wiederholen.",
    "Die Daten bestimmen, was ein Modell kann. Falsche oder einseitige Beispiele führen zu falschen Entscheidungen.",
    "Für schwierige Muster braucht ein Netz Zwischenschichten. Ein Neuron allein zieht nur eine gerade Grenze.",
  ],
  quiz: [
    {frage: "Im Netz-Spielplatz sollen Punkte wie auf einem Schachbrett getrennt werden, aber das Netz hat keine Zwischenschicht. Was hilft meist?",
     optionen: ["Das Training länger laufen lassen, ohne am Netz etwas zu ändern", "Eine Zwischenschicht mit mehreren Neuronen hinzufügen", "Die Lernrate auf null setzen, damit das Netz stabil bleibt", "Nur noch Punkte einer Farbe zum Training verwenden"],
     richtig: 1, abschnitt: "Lösungshinweise",
     erklaerung: "Ohne Zwischenschicht kann das Netz nur eine gerade Grenze ziehen. Das Schachbrett braucht eine gebogene."},
    {frage: "Im Netz-Spielplatz sinkt der Verlust von Schritt zu Schritt. Was bedeutet das?",
     optionen: ["Das Netz hat Neuronen verloren und rechnet deshalb weniger", "Das Training läuft inzwischen kürzer als am Anfang", "Die Zahl der Trainingspunkte hat sich verringert", "Die Vorhersagen liegen näher am richtigen Ergebnis"],
     richtig: 3, abschnitt: "Sicherung (10 Minuten): das Tafelbild",
     erklaerung: "Der Verlust misst den Fehler. Das Training versucht, ihn Schritt für Schritt kleiner zu machen."},
    {frage: "Beim Beschriften hat jemand einen Punkt mitten in der anderen Gruppe falsch gefärbt. Was kann passieren?",
     optionen: ["Bei kleinem k kann es dort falsch entscheiden, der Punkt zählt voll", "Das Modell merkt den Fehler und färbt den Punkt selbst um", "Das Modell wird genauer, weil ein Ausreißer es zum Lernen zwingt", "Nichts, denn Modelle ignorieren jeden Punkt, der allein in der Gruppe liegt"],
     richtig: 0, abschnitt: "Lösungshinweise",
     erklaerung: "Das Modell kann nicht wissen, dass der Punkt ein Fehler ist. Bei k gleich 1 zählt er voll."},
  ],
  weiter: ["schule-stunde-3", "neuronale-netze", "training", "daten"],
};

/* ------------------------------------------------------------------ Stunde 3 */
S["schule-stunde-3"] = {
  nav: "KI 3: Echt oder erfunden?", typ: "lektion", gruppe: "Für die Schule", titel: "KI 3: Echt oder erfunden? KI prüfen", symbol: "search",
  downloads: [
    {text: "Arbeitsblatt KI 3", sub: "4 Seiten A4, mit Quiz, für die Klasse", href: "/static/materialien/arbeitsblatt-stunde-3.pdf"},
    {text: "Lösungsblatt KI 3", sub: "3 Seiten A4, nur für Lehrkräfte, mit Plänen für Einzel- und Doppelstunde und Hilfekarten zum Ausschneiden", href: "/static/materialien/loesung-stunde-3.pdf"},
  ],
  lernziele: [
    "Du kannst erklären, warum ein Sprachmodell Dinge erfinden kann, die überzeugend klingen.",
    "Du kannst eine Antwort in drei Schritten prüfen: Quelle, zweite Quelle, Datum.",
    "Du kannst begründen, wann du einer KI-Antwort nicht allein vertrauen solltest.",
  ],
  kurz: "45 oder 90 Minuten für Klasse 8: Du testest, wie ein Sprachmodell erfindet, und prüfst Antworten.",
  zusammenfassung: "KI 3 von 3 für Klasse 8: Echt oder erfunden? Die Klasse testet im Chat, wie ein Sprachmodell Antworten erfindet (Halluzination), spielt das Risiko-Spiel und übt die Quellenprüfung in drei Schritten. Ohne Kamera, mit Zeitplan, Aufgaben und Lösungshinweisen.",
  abschnitte: [
    {h: "Der Zeitplan",
     kurz: "Einstieg 5, Erarbeitung 20, Sicherung 10, Reflexion 10 Minuten.",
     visual: {typ: "zeitachse", punkte: [
      {t: "5 Min", text: "Einstieg", icon: "lightbulb"},
      {t: "20 Min", text: "Erarbeitung", icon: "search"},
      {t: "10 Min", text: "Sicherung", icon: "clipboard-check"},
      {t: "10 Min", text: "Reflexion", icon: "message-circle"}]},
     p: [
      "Der Chat braucht das Sprachmodell: Die Gruppen stellen die Frage zeitlich versetzt, kurze Wartezeiten einplanen. Das Risiko-Spiel rechnet im Browser. Die Stunde baut auf {{schule-stunde-2|KI 2}} auf.",
     ],
     alltag: "Vorbereitung für die Lehrkraft: Denke dir einen Buchtitel mit Autor aus und suche kurz im Netz, ob es das wirklich nicht gibt. Diesen Fall gibst du später der Klasse."},
    {h: "Einstieg (5 Minuten)",
     kurz: "Zwei Aussagen an der Tafel, eine stimmt, eine ist erfunden: Die Klasse stimmt ab und begründet.",
     visual: {typ: "vergleich",
      links: {titel: "Aussage A", icon: "circle-help", farbe: "akzent", punkte: ["Klingt sicher", "Hat eine Zahl", "Nennt einen Namen"]},
      rechts: {titel: "Aussage B", icon: "circle-help", farbe: "orange", punkte: ["Klingt sicher", "Hat eine Zahl", "Nennt einen Namen"]},
      urteil: "Beide klingen gleich. Eine ist erfunden."},
     p: [
      "Denke dir zwei gleich gebaute Sätze zu einem Thema der Klasse aus (Verein, Serie), einer stimmt, einer ist erfunden. Die Klasse merkt: Am Klang erkennt man es nicht.",
     ]},
    {h: "Erarbeitung (20 Minuten)",
     kurz: "Drei Schritte: erfundene Frage im Chat (8 Minuten), Risiko-Spiel (6 Minuten), Antwort prüfen (6 Minuten).",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "message-circle", text: "Chat", sub: "erfundene Frage"},
      {icon: "triangle-alert", text: "Risiko-Spiel", sub: "Stimmt oder erfunden"},
      {icon: "search", text: "Prüfen", sub: "Quelle, zweite Quelle, Datum", farbe: "gruen"}]},
     p: [
      "Chat: Seite {{chat|Sprachmodell im Chat}}. Risiko-Spiel: {{llm-grenzen|Grenzen und Risiken von Sprachmodellen}}. Zum Prüfen helfen {{echt-oder-ki|Echt oder KI?}} und {{quellen-pruefen|Quellen prüfen}}.",
     ]},
    {h: "Arbeitsblatt: die Aufgaben",
     kurz: "Drei Aufgaben: erfinden lassen, im Spiel entscheiden, eine Antwort prüfen.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "message-circle", text: "Aufgabe 1", sub: "Erfundene Frage"},
      {icon: "triangle-alert", text: "Aufgabe 2", sub: "Risiko-Spiel"},
      {icon: "file-search", text: "Aufgabe 3", sub: "Antwort prüfen"}]},
     p: [
      "Jede Aufgabe beginnt mit einem Operator, also einem Arbeitsauftrag wie „Beschreibe“. Das Kürzel dahinter zeigt den Anforderungsbereich (I, II oder III). Die Tabelle steht in der {{schule-lehrkraefte|Handreichung}}.",
      "Zusätzlich steht an jeder Aufgabe die Sozialform und das Niveau: Basis, Standard oder Herausforderung.",
     ],
     liste: [
      "**Aufgabe 1, Chat (Gruppe zu viert, Basis):** **Beschreibe** (I), wie das Sprachmodell auf den erfundenen Fall der Lehrkraft antwortet: Gab es zu, nichts zu wissen, oder erfand es etwas Überzeugendes? Frage dafür das Modell, zum Beispiel „Wer hat das Buch ‚Titel‘ geschrieben und wann erschien es?“. Schreibe die Antwort auf.",
      "**Aufgabe 2, Risiko-Spiel (Partnerarbeit, Standard):** **Nenne** (I) die Karten, bei denen du falsch lagst, und **erkläre** (II), woran du es hättest erkennen können. Spiele dafür die Karten durch und entscheide bei jeder Karte: Stimmt oder erfunden?",
      "**Aufgabe 3, Prüfen (Einzelarbeit, Herausforderung):** **Überprüfe** (III) eine Behauptung aus Aufgabe 1 in drei Schritten: Wer ist die Quelle? Gibt es eine zweite, unabhängige Quelle? Von wann ist die Information? Schreibe das Ergebnis in drei Sätzen auf.",
      "**Zusatz für Schnelle (Einzelarbeit, Herausforderung):** **Entwickle** (III) eine Regel für deine Klasse: „Bevor ich eine KI-Antwort weitergebe, prüfe ich ___.“ **Vergleiche** (II) sie mit den Regeln der anderen Gruppen.",
     ]},
    {h: "Lösungshinweise",
     kurz: "Ein Modell klingt sicher und erfindet trotzdem, prüfen heißt: Quelle, zweite Quelle, Datum.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "user-round", text: "Quelle", sub: "Wer sagt das?"},
      {icon: "copy", text: "Zweite Quelle", sub: "unabhängig"},
      {icon: "calendar", text: "Datum", sub: "noch aktuell?", farbe: "gruen"}]},
     liste: [
      "**Zu Aufgabe 1, Beschreibe (I):** Beschrieben wird, was das Modell tatsächlich geantwortet hat. Beide Ergebnisse lehren etwas: Erfindet das Modell Autor und Jahr, ist das eine [[halluzination|Halluzination]], sagt es „kenne ich nicht“, hat es richtig reagiert. Die Antworten wechseln, teste den Fall vorher selbst.",
      "**Zu Aufgabe 2, Nenne (I) und Erkläre (II):** Genannt werden die Karten mit falscher Einschätzung. Die Erklärung nutzt die Auflösung der Karte. Typisch für Erfundenes: sehr genaue Zahlen und Aktenzeichen ohne Beleg und ein selbstsicherer Ton.",
      "**Zu Aufgabe 3, Überprüfe (III):** Gut geprüft heißt: Quelle mit Namen, zweite Quelle, Datum, und am Ende steht ein Ergebnis. Bei Büchern helfen ein Bibliothekskatalog oder die Seite des Verlags. Das Modell um Bestätigung zu bitten ist keine Prüfung, es bestätigt oft die eigene Antwort.",
      "**Zum Zusatz, Entwickle (III) und Vergleiche (II):** Gute Regeln sind kurz und prüfbar, zum Beispiel „Zahlen und Namen immer in einer zweiten Quelle suchen“. Beim Vergleich fällt auf, welche Regeln mehrere Gruppen nennen.",
     ]},
    {h: "Gestufte Hilfen",
     kurz: "Zu jeder Aufgabe zwei Tipps, auch als Hilfekarten im Lösungsblatt: Tipp 1 gibst du zuerst, Tipp 2 nur bei Bedarf.",
     visual: {typ: "raster", spalten: 2, zellen: [
      {icon: "lightbulb", text: "Tipp 1", sub: "gibst du zuerst"},
      {icon: "key-round", text: "Tipp 2", sub: "nur bei Bedarf"}]},
     liste: [
      "**Tipp 1 zu Aufgabe 1:** Lies die Antwort genau: Steht dort ein Autor und ein Jahr?",
      "**Tipp 2 zu Aufgabe 1:** Hat das Modell etwas zugegeben oder etwas Überzeugendes erfunden?",
      "**Tipp 1 zu Aufgabe 2:** Erfundenes klingt oft sehr genau und sehr sicher.",
      "**Tipp 2 zu Aufgabe 2:** Achte auf genaue Zahlen und Aktenzeichen ohne Beleg.",
      "**Tipp 1 zu Aufgabe 3:** Die drei Fragen: Quelle, zweite Quelle, Datum.",
      "**Tipp 2 zu Aufgabe 3:** Bei Büchern helfen ein Bibliothekskatalog oder die Seite des Verlags.",
     ]},
    {h: "Differenzierung: leicht und schwer",
     kurz: "Leichte Wege geben Prüffragen vor, schwere Wege verlangen eigene Recherche.",
     visual: {typ: "vergleich",
      links: {titel: "Leichter", icon: "smile", farbe: "gruen", punkte: ["Prüffragen sind vorgegeben", "Antwort mit Lückentext", "Fall ist bereits ausgewählt"]},
      rechts: {titel: "Schwerer", icon: "flame", farbe: "orange", punkte: ["Eigene Frage ausdenken", "Zwei Quellen vergleichen", "Eigene Regel begründen"]}},
     liste: [
      "**Leichter:** Die drei Prüffragen stehen auf einer Karte. Die Gruppe bleibt bei **Nenne** (I) und **Beschreibe** (I) und füllt „Die Antwort ist ___, weil ___.“ aus.",
      "**Schwerer:** Die Gruppe sucht selbst eine Behauptung, die ein Modell erfunden haben könnte, prüft sie mit zwei Quellen, **begründet** (III) das Ergebnis und **beurteilt** (III) die Verlässlichkeit der Quellen.",
     ]},
    {h: "Sicherung (10 Minuten): das Tafelbild",
     kurz: "Eine KI-Antwort ist ein Vorschlag, kein Beweis: erst prüfen, dann weitergeben.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "message-circle", text: "KI-Antwort", sub: "Vorschlag"},
      {icon: "search", text: "Prüfen", sub: "Quelle, zweite, Datum"},
      {icon: "circle-check", text: "Weitergeben", sub: "oder verwerfen", farbe: "gruen"}]},
     p: [
      "Fasse zusammen: Ein Sprachmodell setzt Wörter nach Wahrscheinlichkeit zusammen und prüft keine Fakten. Auch Bilder und Stimmen lassen sich künstlich erzeugen ([[deepfake|Deepfake]]), siehe {{echt-oder-ki|Echt oder KI?}}.",
     ],
     merke: "Je wichtiger die Antwort, desto genauer prüfst du sie."},
    {h: "Reflexion (10 Minuten)",
     muster: [["Eigene Erfahrung, es gibt keine Musterantwort", "Gut ist eine Antwort mit Folge (etwa weitergeleitet oder falsch gelernt) und einem künftigen Prüfschritt", "Prüfschritt: eine zweite unabhängige Quelle suchen"], ["Fair: Ideen sammeln, etwas erklären lassen, Rückmeldung holen, wenn die Schule es erlaubt und du es angibst", "Unfair: fertigen Text als eigene Leistung abgeben oder Quellen ungeprüft übernehmen", "Maßstab: Habe ich es danach selbst verstanden, und sage ich offen, was die KI getan hat?"], ["Passwörter, Adresse, Telefonnummer, Daten und Fotos anderer Personen", "Alles, was dich blamiert, wenn es später jemand liest", "Auch bei gut gemeinten Diensten verlässt du dich nur auf die Zusage des Betreibers"]],
     kurz: "Drei Fragen zum Alltag: Hausaufgaben, Soziale Medien, Verantwortung.",
     visual: {typ: "skala", links: "vertraue schnell", rechts: "prüfe immer", marker: 0.5, label: "Wo stehst du jetzt?"},
     liste: [
      "Wann hast du zuletzt etwas im Netz geglaubt, ohne es zu prüfen? Was ist passiert?",
      "Was ist fair, wenn du ein Sprachmodell für die Hausaufgaben nutzt, und was nicht?",
      "Was solltest du nie in einen Chat eintippen, auch nicht in einen gut gemeinten?",
     ]},
  ],
  mitnehmen: [
    "Ein Sprachmodell kann überzeugend erfinden. Der Ton sagt nichts über die Wahrheit.",
    "Prüfen heißt: Quelle nennen, zweite unabhängige Quelle suchen, Datum ansehen.",
    "Das Modell zu fragen, ob es stimmt, ersetzt keine Prüfung.",
  ],
  quiz: [
    {frage: "Du bittest ein Sprachmodell um Belege und bekommst drei Quellenangaben mit Autor und Jahr. Eine davon gibt es nicht. Woran liegt das?",
     optionen: ["Es wollte dich absichtlich täuschen, um zu gewinnen", "Es hat im Netz gesucht und sich beim Abschreiben vertippt", "Es reiht passende Wörter aneinander, ohne Fakten zu prüfen", "Es erfindet nur dann, wenn die Frage sehr unfreundlich gestellt ist"],
     richtig: 2, abschnitt: "Lösungshinweise",
     erklaerung: "Das Modell erzeugt Text, der plausibel klingt. Ob er stimmt, prüft es nicht."},
    {frage: "Zwei Meldungen zum selben Ereignis: Die eine hat 10.000 Likes, die andere wird von zwei weiteren unabhängigen Stellen bestätigt. Wem traust du eher?",
     optionen: ["Der mit den Likes, weil schon so viele Menschen sie gut finden", "Der bestätigten, weil unabhängige Quellen dasselbe sagen", "Der, die sich sicherer anhört und keine Fehler enthält", "Der, die in den Suchergebnissen weiter oben steht"],
     richtig: 1, abschnitt: "Sicherung (10 Minuten): das Tafelbild",
     erklaerung: "Unabhängige Quellen, die dasselbe sagen, sind ein gutes Zeichen. Likes und ein Platz in der Suche sagen nichts über Wahrheit."},
    {frage: "Das Modell nennt dir ein Buch mit Autor und Jahr, das du im Referat angeben willst. Was tust du zuerst?",
     optionen: ["Ich übernehme es, weil Autor und Jahr so genau sind", "Ich frage das Modell, ob es sich ganz sicher ist", "Ich frage mehrmals nach und nehme die häufigste Antwort", "Ich suche das Buch in einem Katalog oder bei einem Verlag"],
     richtig: 3, abschnitt: "Lösungshinweise",
     erklaerung: "Ein Katalog ist eine unabhängige Quelle. Das Modell bestätigt oft nur seine eigene Antwort."},
  ],
  weiter: ["echt-oder-ki", "quellen-pruefen", "llm-grenzen", "chat", "verzerrung-ethik"],
};

/* ------------------------------------------------------------------ Handreichung */
S["schule-lehrkraefte"] = {
  nav: "Handreichung Lehrkräfte", typ: "lektion", gruppe: "Für die Schule", titel: "Handreichung für Lehrkräfte", symbol: "graduation-cap",
  lernziele: [
    "Sie können eine Stunde in zehn Minuten vorbereiten.",
    "Sie können Fachbegriffe und die häufigsten Schülerfragen kurz beantworten.",
    "Sie erkennen typische Stolperstellen, bevor sie im Unterricht auftreten.",
  ],
  kurz: "Checkliste, Fachbegriffe, Kurzantworten, Stolperstellen und Lehrplanbezug für die drei KI-Stunden und die sieben Medien-Einheiten in Klasse 8.",
  zusammenfassung: "Handreichung für Lehrkräfte zu den drei KI-Stunden und den sieben Medien-Einheiten in Klasse 8: Lernziele nach den Stufen Verstehen, Anwenden, Erstellen und Bewerten, Übersicht der Medien-Einheiten, Pläne für Einzel- und Doppelstunde (45 oder 90 Minuten), Lehrplanbezug und Bezug zur KMK-Strategie, Kamera und Mikrofon am Schulgerät sperren, Anpassung für Klasse 7 und 9, Vorbereitung, Fachbegriffe, häufige Schülerfragen mit Antworten, Stolperstellen und Quellen zum Weiterlesen.",
  downloads: [
    {text: "Arbeitsblatt KI 1", sub: "KI 1, für die Klasse", href: "/static/materialien/arbeitsblatt-stunde-1.pdf"},
    {text: "Lösungsblatt KI 1", sub: "KI 1, nur für Lehrkräfte", href: "/static/materialien/loesung-stunde-1.pdf"},
    {text: "Arbeitsblatt KI 2", sub: "KI 2, für die Klasse", href: "/static/materialien/arbeitsblatt-stunde-2.pdf"},
    {text: "Lösungsblatt KI 2", sub: "KI 2, nur für Lehrkräfte", href: "/static/materialien/loesung-stunde-2.pdf"},
    {text: "Arbeitsblatt KI 3", sub: "KI 3, für die Klasse", href: "/static/materialien/arbeitsblatt-stunde-3.pdf"},
    {text: "Lösungsblatt KI 3", sub: "KI 3, nur für Lehrkräfte", href: "/static/materialien/loesung-stunde-3.pdf"},
  ],
  abschnitte: [
    {h: "Was die Klasse am Ende kann",
     kurz: "Vier Stufen, verteilt auf die drei Stunden, angelehnt an gängige Kompetenzrahmen.",
     visual: {typ: "raster", spalten: 4, zellen: [
      {icon: "brain", text: "Verstehen", sub: "KI 1 und 2"},
      {icon: "mouse", text: "Anwenden", sub: "alle Stunden"},
      {icon: "pencil", text: "Erstellen", sub: "KI 1 und 3"},
      {icon: "scale", text: "Bewerten", sub: "KI 3"}]},
     tabelle: {
      beschriftung: "Nach den drei Stunden (kein offizielles Dokument eines Kultusministeriums)",
      kopf: ["Stufe", "Die Schülerinnen und Schüler können"],
      zeilen: [
       ["Verstehen", "erklären, dass KI aus Beispielen lernt, und Daten, Training und Fehler benennen"],
       ["Anwenden", "Punkte-Labor, Netz-Spielplatz und Chat bedienen und Ergebnisse beschreiben"],
       ["Erstellen", "eigene Beispieldaten setzen und einen besseren Prompt schreiben"],
       ["Bewerten", "KI-Antworten prüfen und begründen, wann sie nicht reichen"],
      ],
     }},
    {h: "Die sieben Medien-Einheiten",
     kurz: "Sieben weitere Einheiten zur Medienkompetenz, je 45 oder 90 Minuten, mit Arbeitsblatt und Lösungsblatt wie bei den KI-Stunden.",
     visual: {typ: "zahlen", kacheln: [
      {wert: "7", label: "Einheiten", icon: "layers"},
      {wert: "45 / 90", label: "Minuten", icon: "clock"},
      {wert: "6", label: "mit Erklärvideo", icon: "play"}]},
     p: [
      "Die Medien-Einheiten laufen wie KI 1 bis 3: Einstieg, Erarbeitung, Sicherung und Reflexion, dazu Quiz und Nachdenken. Operatoren, Hilfekarten, Differenzierung, Lehrplanbezug und der Plan für die Doppelstunde gelten dort genauso. Sechs der sieben Einheiten beginnen mit einem Erklärvideo, Medien 7 hat keines. Alle Aufgaben kommen ohne Kamera und Mikrofon aus.",
      "Passend dazu gibt es ein Paket für den {{elternabend|Elternabend}}: Info-Blatt, Gesprächsleitfaden und Antworten auf Elternfragen.",
     ],
     tabelle: {
      beschriftung: "Die Medien-Einheiten im Überblick",
      kopf: ["Einheit", "Ziel", "Zeit", "Gerät"],
      zeilen: [
       ["{{medien-stunde-1|Medien 1: Echt oder KI?}}", "Bilder nach Hinweisen sortieren und das Urteil begründen", "45 oder 90 Minuten", "keins, ausgedrucktes Kartenset"],
       ["{{medien-stunde-2|Medien 2: Quellen prüfen}}", "Eine Behauptung an drei Quellen gegenprüfen, Seitwärtslesen", "45 oder 90 Minuten", "ein Gerät je Gruppe mit Browser"],
       ["{{medien-stunde-3|Medien 3: Fake News und Deepfakes}}", "Einen erfundenen Fall analysieren und ein Dilemma zu einer KI-Stimme beurteilen", "45 oder 90 Minuten", "keins"],
       ["{{medien-stunde-4|Medien 4: KI und Hausaufgaben}}", "Regeln für KI bei Hausaufgaben vorschlagen", "45 oder 90 Minuten", "keins"],
       ["{{medien-stunde-5|Medien 5: Datenschutz im Alltag}}", "App-Rechte und eigene Datenspuren prüfen", "45 oder 90 Minuten", "keins"],
       ["{{medien-stunde-6|Medien 6: Gute Fragen stellen}}", "Fragen mit Rolle, Aufgabe, Material, Format und Grenzen schreiben", "45 oder 90 Minuten", "Prompt-Werkstatt am Gruppengerät, höchstens 7 Geräte"],
       ["{{medien-stunde-7|Medien 7: KI in deinem Alltag}}", "Zeigen, wo KI im Alltag arbeitet und wie ein Feed entscheidet", "45 oder 90 Minuten", "keins, Papier A3"],
      ],
     }},
    {h: "Operatoren in den Aufgaben",
     kurz: "Jede Aufgabe beginnt mit einem Operator. Das Kürzel zeigt, wie anspruchsvoll sie ist: I nennen und beschreiben, II erklären, zuordnen und vergleichen, III begründen und beurteilen.",
     visual: {typ: "schichten", richtung: "stapel", ebenen: [
      {icon: "scale", text: "Bereich III", sub: "Transfer und Bewertung: begründen, beurteilen, überprüfen, entwickeln"},
      {icon: "network", text: "Bereich II", sub: "Reorganisation: erklären, zuordnen, vergleichen"},
      {icon: "list", text: "Bereich I", sub: "Reproduktion: nennen, beschreiben"}]},
     p: [
      "Operatoren sind Verben, die sagen, was die Antwort enthalten soll. Je Stunde kommt mindestens ein Operator aus jedem der drei Anforderungsbereiche vor. Das Kürzel steht in Klammern hinter dem Operator, auf dem Arbeitsblatt steht dazu eine Legende mit den Operatoren dieses Blatts, im Lösungsblatt der Erwartungshorizont.",
      "Die Zuordnung gilt als Orientierung. Die Quellen ordnen einzelne Operatoren je nach Bundesland und Fach leicht unterschiedlich zu, manche Operatoren reichen über zwei Bereiche (zum Beispiel beschreiben von I bis II, beurteilen von II bis III). Welcher Bereich gefordert ist, hängt auch von der Aufgabe ab. Quellen: siehe „Weiterlesen“.",
     ],
     tabelle: {
      beschriftung: "Operatoren in den Arbeitsblättern (vereinfacht für Klasse 8)",
      kopf: ["Operator", "Das sollst du tun", "Bereich"],
      zeilen: [
       ["Nenne", "Gib etwas ohne Erklärung an: Wort, Zahl oder kurzer Satz.", "I"],
       ["Beschreibe", "Gib einen Sachverhalt sachlich, in eigenen Worten und ganzen Sätzen wieder.", "I"],
       ["Erkläre", "Mach etwas verständlich: Nenne den Grund, ergänze ein Beispiel.", "II"],
       ["Ordne zu", "Stelle Dinge in einen vorgegebenen Zusammenhang, zum Beispiel in Gruppen, und sage kurz, warum sie dorthin gehören.", "II"],
       ["Vergleiche", "Finde Gemeinsamkeiten und Unterschiede und stelle sie gegenüber.", "II"],
       ["Begründe", "Führe einen Sachverhalt auf Gründe oder Zusammenhänge zurück.", "III"],
       ["Beurteile", "Bilde dir ein eigenes Urteil mit Fachwissen und begründe es.", "III"],
       ["Überprüfe", "Miss eine Aussage an Fakten und decke Lücken oder Widersprüche auf.", "III"],
       ["Entwickle", "Entwirf nach vorgegebenen Bedingungen eine eigene Lösung.", "III"],
      ],
     }},
    {h: "So sind die Arbeitsblätter aufgebaut",
     kurz: "Vier Seiten DIN A4, schwarzweiß druckbar: zuerst Ziele und Aufgaben mit Schreibzeilen, danach Quiz, Nachdenken, Zusatz und Legende, dazu QR-Code.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "target", text: "Ziele", sub: "Heute kannst du"},
      {icon: "layers", text: "Niveau", sub: "Basis bis Herausforderung"},
      {icon: "lightbulb", text: "Tipps", sub: "Hilfekarten bei Ihnen"}]},
     liste: [
      "**Kopf:** Thema, Zeit, Lernziele („Heute kannst du ...“). Am Ende kreuzen die Schülerinnen und Schüler je Ziel „sicher“, „fast“ oder „noch nicht“ an.",
      "**Aufgaben:** Sozialform (Einzelarbeit, Partnerarbeit, Gruppe zu viert) und Niveau (Basis, Standard, Herausforderung) stehen an jeder Aufgabe, das Niveau als ein bis drei Kästchen, nicht als Farbe.",
      "**Hilfen:** Die Tipps stehen nicht auf dem Schülerblatt, sondern als Hilfekarten im Lösungsblatt. Geben Sie Tipp 1 zuerst und Tipp 2 nur bei Bedarf weiter.",
      "**Lesbarkeit:** serifenlose Schrift, 13 Punkt, großzügiger Zeilenabstand, linksbündig, Platz zum Schreiben.",
      "**Lösungsblatt:** Es ist nur für Lehrkräfte gedacht und enthält beide Zeitpläne, Lösungen, Erwartungshorizont, Hilfekarten und Tafelbild. Geben Sie es nicht an die Klasse weiter.",
     ]},
    {h: "Einzelstunde oder Doppelstunde",
     kurz: "Dasselbe Material, zwei Pläne: Einzelstunde mit mündlicher Reflexion, Quiz und Nachdenken zu Hause. Doppelstunde mit allem in der Stunde.",
     visual: DOPPEL_VISUAL,
     p: [
      "Das Arbeitsblatt hat vier Seiten: zuerst die Aufgaben, danach Quiz, Nachdenken, Zusatz, Merksatz und die Legende der Operatoren. Die Minuten bei den Aufgaben auf dem Blatt gelten für die Einzelstunde. Das Lösungsblatt enthält beide Zeitpläne.",
     ],
     tabelle: doppelTabelle("Zwei Pläne für dieselben Blätter"),
    },
    {h: "Vorbereitung in zehn Minuten",
     kurz: "Link testen, Labore ausprobieren, Gruppen bilden, Arbeitsblatt kopieren.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "link", text: "Link testen", sub: "/?weg=schule"},
      {icon: "mouse", text: "Selbst probieren", sub: "Labore der Stunde"},
      {icon: "users", text: "Gruppen", sub: "vier Personen", farbe: "gruen"}]},
     liste: [
      "Klassenlink am Unterrichtsgerät öffnen: Lädt das Labor?",
      "Labore der Stunde ausprobieren, für KI 3 den erfundenen Fall im Chat testen.",
      "Vierergruppen bilden, ein Gerät je Gruppe, höchstens 7 Geräte gleichzeitig.",
      "Das Arbeitsblatt (4 Seiten) kopieren oder auf der Lernplattform ablegen, das Lösungsblatt nur für sich behalten.",
      "Infos weitergeben: {{schule-schulleitung|Schulleitung}} und {{schule-eltern|Eltern}}.",
      "Regeln der Schule zu KI-Diensten prüfen, die Schule entscheidet.",
     ]},
    {h: "Fachbegriffe in einfachen Worten",
     kurz: "Zehn Wörter der drei Stunden, jeweils in einem Satz erklärt.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "database", text: "Daten", sub: "Beispiele mit Etikett"},
      {icon: "brain-circuit", text: "Modell", sub: "Zahlen, die gelernt wurden"},
      {icon: "message-square", text: "Prompt", sub: "Eingabe an das Modell"}]},
     tabelle: {
      beschriftung: "Fachbegriffe",
      kopf: ["Begriff", "Einfach erklärt"],
      zeilen: [
       ["[[ki|KI]]", "Programme, die Muster aus Daten lernen und damit erkennen oder entscheiden."],
       ["[[modell|Modell]]", "Ergebnis des Lernens: viele Zahlen, die festlegen, wie entschieden wird."],
       ["[[training|Training]]", "Einstellen des Modells an vielen Beispielen."],
       ["[[label|Label]]", "Etikett zu einem Beispiel, etwa „blau“ oder „Spam“."],
       ["[[knn|k nächste Nachbarn]]", "Punkte-Labor: Die k nächsten Beispiele stimmen über die Farbe ab."],
       ["[[verlust|Verlust]]", "Maß für den Fehler, soll beim Training sinken."],
       ["[[lernrate|Lernrate]]", "Schrittgröße beim Nachjustieren."],
       ["[[ueberanpassung|Überanpassung]]", "Beispiele auswendig gelernt, bei neuen Fällen falsch."],
       ["[[prompt|Prompt]]", "Eingabe, mit der man ein Sprachmodell etwas fragt."],
       ["[[halluzination|Halluzination]]", "Das Modell erfindet etwas Plausibles, das nicht stimmt."],
      ],
     }},
    {h: "Häufige Schülerfragen",
     kurz: "Acht Fragen, die in der Klasse fast immer kommen, mit Kurzantwort.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "brain", text: "Denkt KI?", sub: "Sie rechnet"},
      {icon: "messages-square", text: "ChatGPT?", sub: "anderes System"},
      {icon: "eraser", text: "Merkt sie sich was?", sub: "nicht dauerhaft"}]},
     tabelle: {
      beschriftung: "Schülerfragen",
      kopf: ["Frage", "Kurzantwort"],
      zeilen: [
       ["Denkt die KI wirklich?", "Nicht wie ein Mensch: Sie rechnet und findet Muster."],
       ["Ist das ChatGPT?", "Nein, das Labor nutzt ein kleines Sprachmodell, große Dienste laufen in Rechenzentren. Die Grundidee ist ähnlich."],
       ["Hausaufgaben damit machen?", "Das Labor dient dem Verstehen, das Modell macht Fehler, die Regeln der Schule gelten."],
       ["Merkt sich die KI, was ich schreibe?", "Chat-Fragen werden nicht aufbewahrt, Dokumenten-Texte verfallen nach 30 Minuten. Das Modell lernt nicht aus Eingaben."],
       ["Warum antwortet sie jedes Mal anders?", "Das Modell wählt unter passenden Wörtern, höhere Temperatur macht es bunter."],
       ["Kann die KI lügen?", "Sie erfindet ohne Absicht, falsch kann es trotzdem sein."],
       ["Warum dauert das so lange?", "Der Rechner ist klein und beantwortet nur zwei Fragen gleichzeitig, die anderen warten."],
       ["Wie viele Daten braucht man?", "Im Punkte-Labor reichen wenige Dutzend, echte Bilderkennung braucht viel mehr."],
      ],
     }},
    {h: "Stolperstellen",
     kurz: "Typische Probleme im Unterricht und wie Sie sie umgehen.",
     visual: {typ: "vergleich",
      links: {titel: "Häufig", icon: "triangle-alert", farbe: "orange", punkte: ["Alle drücken gleichzeitig auf Senden", "KI wird vermenschlicht", "Chat-Antwort wird als Lösung gesehen"]},
      rechts: {titel: "Besser", icon: "circle-check", farbe: "gruen", punkte: ["Gruppen versetzt starten", "Von Rechnen statt Denken sprechen", "Antwort als Vorschlag prüfen"]}},
     tabelle: {
      beschriftung: "Stolperstellen",
      kopf: ["Problem", "So gehen Sie damit um"],
      zeilen: [
       ["Wartezeit", "Gruppen versetzt starten, Wartenden eine Zusatzaufgabe geben."],
       ["Vermenschlichen", "Statt „die KI weiß“ sagen: „das Modell berechnet“."],
       ["Musterlösung im Chat", "Antworten wechseln: die Begründung der Gruppe bewerten, nicht den Wortlaut."],
       ["Geräte", "Mit der Maus am genauesten, Laptop oder Tablet vor Handy."],
       ["Eingaben", "Keine Namen, Adressen oder privaten Dinge tippen lassen."],
       ["Kamera-Labore", "Nicht für den Unterricht, vorher laut sagen. Die Kamera lässt sich im Browser sperren, siehe Abschnitt Kamera und Mikrofon am Schulgerät sperren. Für eine Vorführung am Lehrergerät beschreiben vier Labore je eine Unterrichtsidee, siehe {{schule-faecher|Welche Fächer passen?}}."],
       ["Lehrplanbezug", "Die Anknüpfung an die KMK-Strategie steht im Abschnitt Lehrplanbezug und auf jeder Einheit. Ein Fachlehrplan wurde für kein Bundesland geprüft, passen Sie es an die Vorgaben der Schule an."],
      ],
     }},
    {h: "Kamera und Mikrofon am Schulgerät sperren",
     kurz: "Im Unterricht bleiben Kamera und Mikrofon aus. Sperren Sie sie zusätzlich im Browser, dann schaltet sie auch ein versehentlicher Klick nicht ein.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "camera", text: "Kamera", sub: "bleibt aus"},
      {icon: "mic", text: "Mikrofon", sub: "bleibt aus"},
      {icon: "shield-check", text: "Browser", sub: "sperrt zusätzlich"}]},
     p: [
      "Das Labor schaltet Kamera und Mikrofon nie von allein ein: Erst fragt die Seite nach ausdrücklicher Zustimmung, dann der Browser (siehe {{sicherheit-einfach|Ist das sicher?}}). Die Aufgaben der Einheiten brauchen beides nicht.",
     ],
     liste: [
      "**Nur für diese Seite:** Das Symbol links in der Adresszeile öffnen, die Website-Einstellungen aufrufen und Kamera und Mikrofon auf „Blockieren“ stellen. Die Bezeichnungen unterscheiden sich je nach Browser.",
      "**Für alle Seiten eines Geräts:** In den Einstellungen des Browsers unter Datenschutz oder Website-Einstellungen lässt sich der Zugriff auf Kamera und Mikrofon grundsätzlich verbieten.",
      "**Für alle Geräte der Schule:** Verwaltet die Schule ihre Geräte zentral, kann die Systembetreuung Kamera und Mikrofon im Browser für alle Geräte sperren. Fragen Sie dort nach.",
      "**Klassenlink:** Er öffnet den Schulweg, dessen Kacheln mit „Ohne Kamera“ gekennzeichnet sind.",
     ]},
    {h: "Lehrplanbezug und KMK-Strategie",
     kurz: "Die Einheiten knüpfen an die sechs Kompetenzbereiche der KMK-Strategie „Bildung in der digitalen Welt“ an. Das ist keine amtliche Zuordnung.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "search", text: "Suchen", sub: "Verarbeiten, Aufbewahren"},
      {icon: "shield-check", text: "Schützen", sub: "und sicher Agieren"},
      {icon: "scale", text: "Analysieren", sub: "und Reflektieren"}]},
     p: [
      "Die Kultusministerkonferenz (KMK) beschreibt in der Strategie „Bildung in der digitalen Welt“ vom 8. Dezember 2016 sechs Kompetenzbereiche: Suchen, Verarbeiten und Aufbewahren; Kommunizieren und Kooperieren; Produzieren und Präsentieren; Schützen und sicher Agieren; Problemlösen und Handeln; Analysieren und Reflektieren.",
      "Die Tabelle ist ein Vorschlag des Labors, wo die Einheiten anknüpfen. Sie ist kein Dokument eines Kultusministeriums. Ob und wo eine Einheit in den Lehrplan Ihres Landes und Faches (Informatik, Medienbildung) passt, prüfen Sie selbst. Quelle: KMK, `kmk.org/aktuelles-1/artikelansicht/strategie-bildung-in-der-digitalen-welt.html`, abgerufen am 22.11.2026.",
      "Die Bildungsministerkonferenz hat am 16. Oktober 2026 die „Aktualisierung des KMK-Kompetenzrahmens Bildung in der digitalen Welt im Kontext Künstlicher Intelligenz“ beschlossen (kmk.org, Abschnitt „Bildung in der digitalen Welt“, abgerufen am 27.11.2026). Was sich dadurch im Einzelnen ändert, haben wir nicht geprüft. Die Bereichsnamen in der Tabelle stammen aus der Strategie von 2016 und gelten als Vorschlag des Labors. Für das Arbeiten mit KI in der Schule gibt es außerdem die „Handlungsempfehlung für die Bildungsverwaltung zum Umgang mit Künstlicher Intelligenz in schulischen Bildungsprozessen“ der KMK vom 10. Oktober 2024.",
     ],
     tabelle: {
      beschriftung: "Vorschlag zur Zuordnung",
      kopf: ["Einheit", "Anknüpfung an Kompetenzbereiche"],
      zeilen: Object.values(LEHRPLAN),
     }},
    {h: "Fachbezug",
     kurz: "Welche Fächer passen und wo Sie Ihren Landeslehrplan finden.",
     p: [
      "Welche Fächer passen? Siehe {{schule-faecher|Fächer}}.",
      "Den Lehrplan Ihres Bundeslandes finden Sie über den Bildungsserver Ihres Landes. Eine Übersicht aller Länder mit Verweisen auf die Lehrpläne führt der Deutsche Bildungsserver (`bildungsserver.de/lehrplaene-400-de.html`), eine weitere die Kultusministerkonferenz (`kmk.org/downloads-dokumente/rechtsvorschriften-/-lehrplaene/uebersicht-lehrplaene.html`), beide abgerufen am 23.11.2026. Die Zuordnung der Einheiten zu Ihrem Lehrplan nehmen Sie selbst vor.",
     ]},
    {h: "Für Klasse 7 und 9 anpassen",
     kurz: "Die Blätter sind für Klasse 8 geschrieben. Für Klasse 7 kürzen Sie, für Klasse 9 erweitern Sie.",
     visual: {typ: "vergleich",
      links: {titel: "Klasse 7: kürzen", icon: "scissors", farbe: "gruen", punkte: ["Basis und Standard", "Hilfekarten von Anfang an", "Quiz gemeinsam lösen"]},
      rechts: {titel: "Klasse 9: erweitern", icon: "flame", farbe: "orange", punkte: ["Zusatz für alle", "Begründungen schriftlich", "Eigene Recherche"]}},
     tabelle: {
      beschriftung: "Vorschläge, in diesen Klassenstufen nicht erprobt",
      kopf: ["Klasse", "So passen Sie an"],
      zeilen: [
       ["Klasse 7", "Nur Aufgaben mit Niveau Basis und Standard bearbeiten, Herausforderung und Zusatz streichen oder gemeinsam an der Tafel lösen. Hilfekarten (Tipp 1 und 2) gleich austeilen. Das Quiz in der Klasse gemeinsam lösen statt allein. Bei den Operatoren des Bereichs III die Aufgabe mündlich vorbesprechen."],
       ["Klasse 9", "Aufgaben mit Niveau Herausforderung und den Zusatz für alle verlangen, Begründungen in ganzen Sätzen schreiben lassen. Bei KI 3 und Medien 2 eine aktuelle Meldung selbst recherchieren lassen. Das Quiz als Selbsttest vor der Stunde nutzen, die Reflexion schriftlich mit einem Beispiel aus dem eigenen Alltag."],
      ],
     }},
    {h: "Weiterlesen",
     kurz: "Quellen zu Kompetenzrahmen, Datenschutz in der Schule und Sprachmodellen im Unterricht.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "book-open", text: "Kompetenzen", sub: "KMK"},
      {icon: "shield-check", text: "Datenschutz", sub: "Kultusministerium"},
      {icon: "languages", text: "Sprachmodelle", sub: "Uni Potsdam"}]},
     liste: [
      "Kultusministerkonferenz, Aktualisierung des Kompetenzrahmens „Bildung in der digitalen Welt“ im Kontext Künstlicher Intelligenz (Beschluss der Bildungsministerkonferenz vom 16.10.2026) und Handlungsempfehlung zum Umgang mit KI (Beschluss vom 10.10.2024): `kmk.org/downloads-dokumente/beschluesse-und-veroeffentlichungen/bildung-in-der-digitalen-welt.html`, abgerufen am 27.11.2026.",
      "Kultusministerkonferenz, Strategie „Bildung in der digitalen Welt“ (8. Dezember 2016): `kmk.org/aktuelles-1/artikelansicht/strategie-bildung-in-der-digitalen-welt.html`, abgerufen am 22.11.2026. Dort stehen die sechs Kompetenzbereiche.",
      "UNESCO, KI-Kompetenzrahmen für Lernende (Titel auf unesco.org suchen).",
      "Bayerisches Kultusministerium, Datenschutz an Schulen: `km.bayern.de/recht/datenschutz-an-schulen` (andere Länder haben eigene Regeln).",
      "Universität Potsdam, Sprachbasierte KI-Tools für die Schule: `uni-potsdam.de/de/medienbildung/transfer-1/sprachbasierte-ki-tools-fuer-die-schule`",
      "**Operatoren, Quelle 1:** Hinweise zur Verwendung von Operatoren im Fach Informatik, zusammengestellt für eine Fortbildung am 3.6.2013 (PL Speyer), Bildungsserver Rheinland-Pfalz: `bildung.rlp.de/fileadmin/user_upload/informatik.bildung.rlp.de/Abitur/OperatorenInformatik_RS092013.pdf`, abgerufen am 22.11.2026. Definitionen und Bereiche von nennen, beschreiben, erklären, vergleichen, beurteilen, überprüfen, entwickeln.",
      "**Operatoren, Quelle 2:** Gemeinsame Abituraufgabenpools der Länder, Grundstock von Operatoren Deutsch (Stand 05.01.2026), IQB: `iqb.hu-berlin.de/media/documents/D_Grundstock_von_Operatoren_uFqEtHs.pdf`, abgerufen am 22.11.2026. Dort steht auch, dass keine strikte Zuordnung eines Operators zu einem Bereich erfolgt.",
      "**Operatoren, Quelle 3:** Operatoren im Bildungsplan 2016 Baden-Württemberg (Reproduktion, Reorganisation, Transfer und Bewertung), `lehrerfortbildung-bw.de/u_mks/kunst/gym/bp2016/fb4/3_oper/operatoren_30_05_15_spo.pdf`, abgerufen am 22.11.2026. Die Quellen 1 und 2 stammen aus der Oberstufe (Informatik, Deutsch), Quelle 3 aus dem Fach Kunst. Eine eigene Liste für Informatik in Klasse 8 war nicht dabei. Die Definitionen sind für Klasse 8 vereinfacht. Die Zuordnung kann je Bundesland und Fach leicht abweichen.",
      "**Operatoren, Quelle 4:** Hessisches Kultusministerium, Operatoren Datenverarbeitung (Landesabitur 2027), `kultus.hessen.de/sites/kultus.hessen.de/files/2026-08/la27-operatoren-dvwi.pdf`, abgerufen am 22.11.2026. Dort steht ordnen, einordnen und zuordnen im Bereich II („Sachverhalte begründet in einen genannten Zusammenhang stellen“). Daher steht „Ordne zu“ hier im Bereich II.",
      "**Gestaltung der Arbeitsblätter, Quellen:** Kriterienliste der TU Dresden (`bildungsportal.sachsen.de/opal/oer/4UW2UJeUWT4k`), Goethe-Institut (Arbeitsblätter für den Unterricht), Universität Frankfurt (Skript zu Arbeitsblättern), ISB Bayern (Kurzhandreichung zur Gestaltung von Arbeitsblättern), PH Niederösterreich (Methoden zur Differenzierung), Universität Halle (Kriterienkatalog Textdokument analog), BFIT-Bund (Leitfaden barrierefreie Textgestaltung), legasthenie.at (Fonts-Broschüre), LMU München (Lernzirkel mit QR-Stationen), PH St. Gallen (Sammelmappe mit QR-Codes). Recherchestand 22.11.2026, die Titel auf den Seiten der Einrichtungen suchen.",
      "Stundenmaterial zur Medienkompetenz: sieben Einheiten von {{medien-stunde-1|Medien 1: Echt oder KI?}} bis {{medien-stunde-7|Medien 7: KI in deinem Alltag}}, dazu der {{elternabend|Elternabend}}. Operatoren und Aufbau der Blätter gelten dort genauso.",
      "Im Labor: {{karte|Was ist KI?}}, {{llm-grenzen|Grenzen und Risiken von Sprachmodellen}} und {{verzerrung-ethik|Fairness, Verzerrung und Verantwortung}}.",
     ]},
  ],
  mitnehmen: [
    "Die drei Stunden decken Verstehen, Anwenden, Erstellen und Bewerten ab. Alle kommen ohne Kamera aus.",
    "Gruppen von vier, höchstens 7 Geräte, versetzt starten: So bleibt die Wartezeit kurz.",
    "Antworten des Modells sind Vorschläge. Bewerten Sie die Begründung der Klasse, nicht den Wortlaut.",
  ],
  grenzen: [
    "Das Labor ersetzt keine Datenschutzprüfung der Schule. Siehe {{schule-schulleitung|Info für die Schulleitung}}.",
  ],
  weiter: ["schule-start", "schule-stunde-1", "schule-stunde-2", "schule-stunde-3", "medien-stunde-1", "elternabend"],
};

/* ------------------------------------------------------------------ Schulleitung */
S["schule-schulleitung"] = {
  nav: "Info Schulleitung", typ: "lektion", gruppe: "Für die Schule", titel: "Information für die Schulleitung", symbol: "landmark",
  downloads: [
    {text: "Zum Mitnehmen: Infoblatt Schulleitung", sub: "2 Seiten A4, Sie-Form, für Datenschutzbeauftragte und Schulträger", href: "/static/materialien/schulleitung-infoblatt.pdf"},
  ],
  lernziele: [
    "Sie wissen, was das KI-Labor ist und welche Daten dabei verarbeitet werden.",
    "Sie wissen, wer verantwortlich ist und wo die Datenschutzerklärung steht.",
    "Sie wissen, welche Fragen die Schule selbst klären muss.",
  ],
  kurz: "Was das Angebot ist, welche Daten verarbeitet werden, wer verantwortlich ist und was Ihre Schule selbst entscheidet. Kein Rechtsrat.",
  zusammenfassung: "Information in einfacher Sprache für Schulleitungen zum KI-Labor: kostenloses Angebot ohne Konto, welche Daten verarbeitet werden und welche nicht, Verantwortlicher und Hosting, Kamera und Mikrofon im Unterricht nicht vorgesehen. Die Schule entscheidet über den Einsatz und klärt die Rechtsgrundlage. Kein Rechtsrat, Stand 22.11.2026.",
  abschnitte: [
    {h: "Was entscheidet die Schule?",
     kurz: "Ob und wie das Labor eingesetzt wird, entscheidet die Schule. Der Betreiber stellt es kostenlos und ohne Vertrag bereit.",
     p: [
      "Die Schule entscheidet, ob das Labor im Unterricht läuft, welche Rechtsgrundlage sie dafür nutzt, ob Eltern vorab informiert werden und welche Endgeräte dafür gedacht sind. Der Betreiber beschreibt die Daten, trifft diese Entscheidung aber nicht. Das Infoblatt oben fasst die Fakten für Ihre Datenschutzbeauftragte oder Ihren Datenschutzbeauftragten zusammen.",
     ]},
    {h: "Das Angebot in Kürze",
     kurz: "Ein kostenloses Lernangebot zu künstlicher Intelligenz, ohne Konto und ohne Anmeldung.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "coins", text: "Kostenlos", sub: "für alle"},
      {icon: "user-check", text: "Kein Konto", sub: "keine Anmeldung"},
      {icon: "school", text: "Klasse 8", sub: "drei Stunden"}]},
     p: [
      "Das KI-Labor ist ein Lernprojekt von Daniel Alisch: drei Unterrichtsstunden zu je 45 Minuten für Klasse 8, ohne Kamera und Mikrofon. Diese Seite ist eine Information in einfacher Sprache, kein Rechtsrat. Stand: 22.11.2026.",
      "Im Chat steht der Hinweis „Unter 16: bitte gemeinsam mit einer erwachsenen Person“. Im Unterricht übernimmt die Lehrkraft diese Rolle, die Gruppen arbeiten unter ihrer Aufsicht.",
     ]},
    {h: "Welche Daten verarbeitet werden",
     kurz: "Wenige technische Daten, kein Konto, keine Namen, keine Abfrage von Alter oder Klasse.",
     visual: {typ: "vergleich",
      links: {titel: "Wird verarbeitet", icon: "database", farbe: "orange", punkte: ["Verbindungsdaten (Adresse, Zeit)", "Sitzungs-Cookie kl_s", "Eingegebene Texte, kurz im Speicher"]},
      rechts: {titel: "Wird nicht verarbeitet", icon: "ban", farbe: "gruen", punkte: ["Name, E-Mail, Konto", "Alter oder Klasse", "Werbung, Besucherstatistik"]}},
     p: [
      "Wie bei jeder Webseite sieht der Server Verbindungsdaten wie Internetadresse und Uhrzeit (Betrieb, Schutz vor Überlastung). Wie lange diese Protokolle aufbewahrt werden, steht im Abschnitt Betrieb und Verträge: Auf Anfrage beim Betreiber.",
      "Technisch nötig ist das Sitzungs-Cookie `kl_s` (bis zu 24 Stunden gültig, die Daten dahinter verfallen nach 30 Minuten ohne Aktivität). Einstellungen und Lernfortschritt merkt sich der Browser auf dem Gerät der Schülerin oder des Schülers.",
      "Chat-Texte verarbeitet ein Sprachmodell auf dem Rechner des Labors, externe KI-Dienste sind nicht angebunden. Chat-Fragen werden nicht aufbewahrt, Schülerinnen und Schüler werden angewiesen, keine echten personenbezogenen Daten einzugeben.",
     ],
     merke: "Nur technisch nötige Daten, Einzelheiten in der Datenschutzerklärung des Betreibers."},
    {h: "Wer verantwortlich ist",
     kurz: "Verantwortlicher ist Daniel Alisch, Impressum und Datenschutzerklärung stehen auf seiner Hauptseite.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "user", text: "Betreiber", sub: "Daniel Alisch"},
      {icon: "file-text", text: "Impressum", sub: "daniel-alisch.site"},
      {icon: "shield-check", text: "Datenschutz", sub: "Erklärung des Betreibers", farbe: "gruen"}]},
     p: [
      "[Impressum](https://daniel-alisch.site/impressum) und [Datenschutzerklärung](https://daniel-alisch.site/datenschutz) des Betreibers, auch in der Fußzeile jeder Seite. Kontakt: [Kontaktabschnitt auf daniel-alisch.site](https://daniel-alisch.site/#contact). Bei fehlenden Angaben wenden Sie sich an den Betreiber.",
     ]},
    {h: "Hosting und Betrieb",
     kurz: "Das Labor läuft auf einem kleinen Rechner des Betreibers, ohne externe KI-Dienste.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "laptop", text: "Gerät der Klasse", sub: "Browser"},
      {icon: "cloud", text: "Weiterleitung", sub: "Server und Tunnel"},
      {icon: "server", text: "Rechner im Labor", sub: "Jetson", farbe: "gruen"}]},
     p: [
      "Alle Berechnungen laufen auf einem NVIDIA Jetson Orin Nano: Sprachmodell, Bilderkennung und Sprachausgabe rechnen dort selbst. Die öffentliche Adresse leitet die Verbindung über einen Server bei IONOS und den Tunneldienst von Cloudflare zu diesem Rechner. Was daraus für Verträge und Protokolle folgt, steht im nächsten Abschnitt.",
     ]},
    {h: "Betrieb und Verträge",
     kurz: "Kostenlos, ohne Vertrag, ohne Zusage zur Verfügbarkeit. Was nicht belegt ist, beantwortet der Betreiber auf Anfrage.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "coins", text: "Kostenlos", sub: "ohne Vertrag"},
      {icon: "server", text: "Verfügbarkeit", sub: "ohne Zusage"},
      {icon: "mail", text: "Offene Fragen", sub: "auf Anfrage"}]},
     p: [
      "Diese Übersicht nennt nur, was auf den Seiten des Labors und in der Datenschutzerklärung beschrieben ist. Alles andere steht als „Auf Anfrage beim Betreiber“ da, damit nichts behauptet wird, was sich nicht belegen lässt. Kein Rechtsrat.",
     ],
     tabelle: {
      beschriftung: "Betrieb und Verträge im Überblick (Stand 22.11.2026)",
      kopf: ["Thema", "Stand"],
      zeilen: [
       ["Kosten", "Kostenlos, ohne Vertrag, ohne Zusage zur Verfügbarkeit."],
       ["Betreiber", "Daniel Alisch. Impressum und Datenschutzerklärung stehen auf `daniel-alisch.site`."],
       ["Wo das Labor läuft", "Auf einem NVIDIA Jetson Orin Nano im Heimnetz des Betreibers. Sprachmodell, Bilderkennung und Sprachausgabe rechnen dort selbst, externe KI-Dienste sind nicht angebunden."],
       ["Weg zum Rechner", "Die öffentliche Adresse läuft über einen Server bei IONOS und den Tunneldienst von Cloudflare."],
       ["Aufbewahrung der Server-Protokolle", "Auf Anfrage beim Betreiber. Der Server sieht Verbindungsdaten wie Internetadresse und Uhrzeit."],
       ["Auftragsverarbeitung mit IONOS und Cloudflare", "Auf Anfrage beim Betreiber. Die Dienstleister nennt die Datenschutzerklärung."],
       ["Verfügbarkeit und Ausfälle", "Keine Zusage. Es ist ein einzelner kleiner Rechner, bei vielen Anfragen entstehen Wartezeiten."],
       ["Wenn das Angebot eingestellt wird", "Auf Anfrage beim Betreiber. Eine Zusage zur Dauer gibt es nicht. Die Arbeitsblätter lassen sich als PDF herunterladen und ausdrucken."],
       ["Nutzungsrechte am Unterrichtsmaterial", "Auf Anfrage beim Betreiber."],
      ],
     },
     p: [
      "Fragen stellen Sie dem Betreiber über die Kontaktangaben im [Impressum](https://daniel-alisch.site/impressum) oder im [Kontaktabschnitt](https://daniel-alisch.site/#contact) der Betreiberseite, auch in der Fußzeile jeder Seite verlinkt. Ob Ihre Schule für den Einsatz einen Vertrag oder eine Auftragsverarbeitung braucht, klärt sie selbst mit der oder dem Datenschutzbeauftragten.",
     ]},
    {h: "Kamera und Mikrofon",
     kurz: "Im Unterrichtseinsatz sind Kamera, Mikrofon und Gesichtserkennung nicht vorgesehen und nicht nötig.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "camera", text: "Kamera", sub: "nicht vorgesehen"},
      {icon: "mic", text: "Mikrofon", sub: "nicht vorgesehen"},
      {icon: "scan-face", text: "Gesichtserkennung", sub: "nicht vorgesehen"}]},
     p: [
      "Die drei Stunden brauchen weder Kamera noch Mikrofon. Weitere Versuche im Menü starten nur nach ausdrücklicher Zustimmung, sind für den Unterricht nicht vorgesehen, und die Handreichung weist Lehrkräfte darauf hin. Die Gesichtserkennung ist laut Hinweis im Labor erst ab 16 Jahren gedacht, jüngere nur mit Einverständnis der Eltern. Eine Altersprüfung gibt es nicht.",
      "Am Schulgerät lässt sich die Kamera zusätzlich im Browser sperren, für alle Geräte auch über die Systembetreuung der Schule. Eine Anleitung steht in der {{schule-lehrkraefte|Handreichung}}, Abschnitt Kamera und Mikrofon am Schulgerät sperren.",
     ]},
    {h: "Was Ihre Schule selbst entscheidet",
     kurz: "Ob und wie das Labor eingesetzt wird und welche Rechtsgrundlage gilt, entscheidet die Schule.",
     visual: {typ: "matrix", x: ["Betreiber", "Schule"], y: ["Angebot", "Einsatz"],
      zellen: [[{text: "Bietet das Labor an", ton: "neutral"}, {text: "Wählt es aus", ton: "neutral"}],
               [{text: "Beschreibt die Daten", ton: "neutral"}, {text: "Klärt Rechtsgrundlage", ton: "gut"}]]},
     p: [
      "Der Betreiber stellt das Labor bereit und beschreibt die Daten. Rechtsgrundlage nach Datenschutz-Grundverordnung und Landesvorgaben klärt die Schule, im Zweifel mit der oder dem Datenschutzbeauftragten.",
     ],
     liste: [
      "Wer entscheidet über den Einsatz im Unterricht?",
      "Welche Rechtsgrundlage nutzt die Schule, was verlangt das Landesrecht?",
      "Sollen die Eltern vorab informiert werden? Eine Kurzinfo liegt vor: {{schule-eltern|Info für Eltern}}.",
      "Wie wird die Nutzung dokumentiert?",
     ]},
  ],
  mitnehmen: [
    "Kostenlos, kein Konto, keine Namen. Nur technisch nötige Daten werden verarbeitet.",
    "Verantwortlicher ist Daniel Alisch. Impressum und Datenschutzerklärung sind verlinkt. Stand: 22.11.2026.",
    "Kamera und Mikrofon sind im Unterricht nicht vorgesehen. Die Schule entscheidet über den Einsatz und klärt die Rechtsgrundlage.",
  ],
  grenzen: [
    "Keine Rechtsberatung. Die Datenschutzerklärung des Betreibers ist verbindlich.",
    "Speicherdauer der Server-Protokolle, Verträge mit den Dienstleistern und das Vorgehen bei einer Einstellung des Angebots stehen hier nicht. Fragen Sie den Betreiber.",
    "Eine Prüfung nach dem Recht eines bestimmten Bundeslandes ist nicht erfolgt.",
  ],
  weiter: ["schule-start", "sicherheit-einfach", "ueber", "lizenzen"],
};

/* ------------------------------------------------------------------ Eltern */
S["schule-eltern"] = {
  nav: "Info Eltern", typ: "lektion", gruppe: "Für die Schule", titel: "Information für Eltern", symbol: "users",
  lernziele: [
    "Sie wissen, was Ihr Kind im KI-Labor im Unterricht macht.",
    "Sie wissen, welche Daten verarbeitet werden und welche nicht.",
    "Sie wissen, an wen Sie sich bei Fragen wenden können.",
  ],
  kurz: "Ihre Klasse arbeitet im Unterricht mit dem KI-Labor. Hier lesen Sie in einfacher Sprache, was dabei passiert und was nicht.",
  zusammenfassung: "Kurzinfo für Eltern in einfacher Sprache: Die Klasse nutzt das kostenlose KI-Labor im Unterricht. Es braucht kein Konto, es gibt keine Kamera und kein Mikrofon im Unterricht. Eingaben werden nicht dauerhaft gespeichert. Stand 22.11.2026, kein Rechtsrat.",
  abschnitte: [
    {h: "Zu Hause?",
     kurz: "Diese Seite ist der Brief für den Einsatz in der Schule. Für zu Hause gibt es eine eigene Seite.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "school", text: "Schule", sub: "dieser Brief"},
      {icon: "house", text: "Zu Hause?", sub: "eigene Seite für Eltern", farbe: "gruen"}]},
     p: [
      "Sie möchten wissen, ob das Labor zu Hause sicher ist, was Ihr Kind dort tun kann und wie Sie darüber sprechen? Das steht auf der Seite {{eltern-zuhause|KI zu Hause: Was Eltern wissen sollten}}. Der Brief hier beschreibt den Einsatz im Unterricht.",
     ]},
    {h: "Worum es geht",
     kurz: "Ihr Kind lernt im Unterricht mit dem KI-Labor, wie künstliche Intelligenz funktioniert.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "school", text: "Im Unterricht", sub: "drei Stunden"},
      {icon: "coins", text: "Kostenlos", sub: "für alle"},
      {icon: "user-check", text: "Kein Konto", sub: "keine Anmeldung"}]},
     p: [
      "Das KI-Labor ist ein kostenloses Lernangebot von Daniel Alisch. Ihre Klasse nutzt es in drei Unterrichtsstunden. Stand: 22.11.2026, kein Rechtsrat, die Datenschutzerklärung bleibt verbindlich.",
     ]},
    {h: "Was Ihr Kind tut",
     kurz: "Ihr Kind setzt Punkte, lässt ein kleines Netz lernen, stellt Fragen an ein Sprachmodell und prüft Antworten.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "chart-scatter", text: "Punkte setzen", sub: "Lernen sehen"},
      {icon: "network", text: "Netz trainieren", sub: "Fehler sehen"},
      {icon: "search", text: "Antworten prüfen", sub: "Quellen vergleichen", farbe: "gruen"}]},
     p: [
      "Die Klasse arbeitet in Vierergruppen an einem Gerät. Im Chat gilt der Hinweis „Unter 16: gemeinsam mit einer erwachsenen Person“. Im Unterricht ist das die Lehrkraft. Ihr Kind lernt auch, dass KI Fehler macht und erfindet, und übt, Antworten nicht blind zu glauben.",
     ]},
    {h: "Was mit Daten passiert",
     kurz: "Kein Konto, keine Namensabfrage, keine dauerhafte Speicherung der Eingaben.",
     visual: {typ: "vergleich",
      links: {titel: "Nicht verlangt", icon: "ban", farbe: "gruen", punkte: ["Konto oder Anmeldung", "Name oder E-Mail", "Alter oder Klasse"]},
      rechts: {titel: "Technisch nötig", icon: "database", farbe: "orange", punkte: ["Kleines Sitzungs-Cookie", "Verbindungsdaten des Servers", "Merkzettel im Browser"]}},
     p: [
      "Das Labor legt keine Profile an, hat keine Werbung und keine Besucherstatistik, Chat-Fragen werden nicht aufbewahrt. Technisch nötig sind ein kleines Sitzungs-Cookie und die üblichen Verbindungsdaten des Servers. Einzelheiten: `daniel-alisch.site/datenschutz`. Bitte keine echten Namen oder privaten Dinge eintippen.",
     ]},
    {h: "Kamera und Mikrofon",
     kurz: "Im Unterricht werden weder Kamera noch Mikrofon noch Gesichtserkennung verwendet.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "camera", text: "Kamera", sub: "nicht im Unterricht"},
      {icon: "mic", text: "Mikrofon", sub: "nicht im Unterricht"},
      {icon: "scan-face", text: "Gesichtserkennung", sub: "nicht im Unterricht"}]},
     p: [
      "Alle Aufgaben kommen ohne Kamera und Mikrofon aus. Versuche damit im Labor starten nur nach ausdrücklicher Zustimmung und sind für den Unterricht nicht vorgesehen. Zu Hause entscheiden Sie. Die Gesichtserkennung ist laut Hinweis im Labor erst ab 16 Jahren gedacht, jüngere nur mit Ihrem Einverständnis.",
     ]},
    {h: "Fragen und Kontakt",
     kurz: "Bei Fragen zum Unterricht hilft die Lehrkraft, Fragen zum Labor beantwortet der Betreiber.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "graduation-cap", text: "Lehrkraft", sub: "Fragen zum Unterricht"},
      {icon: "landmark", text: "Schule", sub: "Entscheidung über Einsatz"},
      {icon: "mail", text: "Betreiber", sub: "Fragen zum Labor", farbe: "gruen"}]},
     p: [
      "Ob und wie das Labor eingesetzt wird, entscheidet die Schule, bei Fragen wenden Sie sich an die Lehrkraft oder die Schulleitung. Die Kontaktdaten des Betreibers stehen im Impressum auf `daniel-alisch.site/impressum`.",
     ],
     merke: "Ihr Kind kann das Labor auch zu Hause kostenlos nutzen. Die Seite {{sicherheit-einfach|Ist das sicher? Was wird gespeichert?}} erklärt es in einfachen Worten."},
  ],
  mitnehmen: [
    "Das Labor ist kostenlos und braucht kein Konto.",
    "Im Unterricht werden keine Kamera, kein Mikrofon und keine Gesichtserkennung benutzt.",
    "Eingaben werden nicht dauerhaft gespeichert. Details stehen in der Datenschutzerklärung des Betreibers, Stand 22.11.2026.",
  ],
  grenzen: [
    "Keine Rechtsberatung. Verbindlich sind Impressum und Datenschutzerklärung des Betreibers.",
    "Die Schule entscheidet über den Einsatz im Unterricht.",
  ],
  weiter: ["eltern-zuhause", "sicherheit-einfach", "schule-start", "ueber"],
};

for (const id of ["schule-stunde-1", "schule-stunde-2", "schule-stunde-3"]) window.KLSchule.ergaenzeEinheit(S[id], id);

INHALT.registriere({
  seiten: S,
  gruppen: [{name: "Für die Schule", seiten: ["schule-start", "schule-stunde-1", "schule-stunde-2", "schule-stunde-3", "schule-lehrkraefte", "schule-schulleitung", "schule-eltern"]}],
});
})();
