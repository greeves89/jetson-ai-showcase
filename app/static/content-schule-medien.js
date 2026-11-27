/* Seiten "Für die Schule", Teil 2: sieben Unterrichtseinheiten zur Medienkompetenz (je 45 Minuten, Klasse 8, ohne Kamera)
   und das Paket für den Elternabend.
   Aufbau wie die drei KI-Stunden in content-schule.js (Lernziele, Zeitplan, Aufgaben mit Operatoren und Anforderungsbereich,
   Lösungshinweise, gestufte Hilfen, Differenzierung, Tafelbild, Reflexion, Quiz). Die Operatoren stehen in der Tabelle der
   Seite schule-lehrkraefte. scripts/materialien_bauen.mjs baut daraus Arbeitsblätter und Lösungsblätter (PDF).
   Fakten nur aus den Seiten des Strangs Medienkompetenz (content-medien.js), aus content-eltern.js, docs/jugendpaedagogik.md
   und docs/videos-schule.md. Das Video je Einheit liegt auf der Medienseite und dient als Einstieg (dort bereits eingebunden).
   Beispiele sind erfunden, keine realen Personen, keine Anleitung zum Fälschen. Keine Kamera, kein Mikrofon. */
(function () {

const S = {};

const AUFGABEN_HINWEIS = "Jede Aufgabe beginnt mit einem Operator, das Kürzel zeigt den Bereich (I bis III). Tabelle: {{schule-lehrkraefte|Handreichung}}.";

/** Baut eine Einheit im Aufbau der KI-Stunden aus einer kurzen Beschreibung (alle Texte stehen in den Aufrufen unten). */
function einheit(c) {
  const aufg = c.aufgaben.map((a, i) => `**Aufgabe ${i + 1}, ${a.ort} (${a.sozial}, ${a.niveau}):** ${a.text}`)
    .concat([`**Zusatz für Schnelle (${c.zusatz.sozial}, ${c.zusatz.niveau}):** ${c.zusatz.text}`]);
  const tipps = c.aufgaben.flatMap((a, i) => [`**Tipp 1 zu Aufgabe ${i + 1}:** ${a.tipps[0]}`, `**Tipp 2 zu Aufgabe ${i + 1}:** ${a.tipps[1]}`]);
  const ab = [
    {h: "Der Zeitplan", kurz: "Einstieg 5, Erarbeitung 20, Sicherung 10, Reflexion 10 Minuten.",
     visual: {typ: "zeitachse", punkte: [
      {t: "5 Min", text: "Einstieg", icon: "lightbulb"},
      {t: "20 Min", text: "Erarbeitung", icon: c.icon},
      {t: "10 Min", text: "Sicherung", icon: "clipboard-check"},
      {t: "10 Min", text: "Reflexion", icon: "message-circle"}]},
     p: c.zeitP, alltag: c.vorbereitung},
    Object.assign({h: "Einstieg (5 Minuten)"}, c.einstieg),
    Object.assign({h: "Erarbeitung (20 Minuten)"}, c.erarbeitung),
    {h: "Arbeitsblatt: die Aufgaben", kurz: "Drei Aufgaben und ein Zusatz, gedruckt auf dem vierseitigen Arbeitsblatt (zuerst die Aufgaben, danach Quiz, Nachdenken, Zusatz und Legende).",
     visual: {typ: "raster", spalten: 3, zellen: c.aufgaben.map((a, i) => ({icon: a.icon, text: "Aufgabe " + (i + 1), sub: a.ort}))},
     p: [AUFGABEN_HINWEIS], liste: aufg},
    {h: "Lösungshinweise", kurz: c.loesKurz, visual: c.loesVisual, liste: c.loesungen},
    {h: "Gestufte Hilfen", kurz: "Zwei Tipps je Aufgabe, auch als Hilfekarten im Lösungsblatt: Tipp 1 zuerst, Tipp 2 nur bei Bedarf.",
     visual: {typ: "raster", spalten: 2, zellen: [{icon: "lightbulb", text: "Tipp 1", sub: "gibst du zuerst"}, {icon: "key-round", text: "Tipp 2", sub: "nur bei Bedarf"}]},
     liste: tipps},
    {h: "Differenzierung: leicht und schwer", kurz: "Leichte Wege geben Sätze vor, schwere verlangen eigene Begründungen.",
     visual: {typ: "vergleich",
      links: {titel: "Leichter", icon: "smile", farbe: "gruen", punkte: c.diff.leichtPunkte},
      rechts: {titel: "Schwerer", icon: "flame", farbe: "orange", punkte: c.diff.schwerPunkte}},
     liste: [`**Leichter:** ${c.diff.leicht}`, `**Schwerer:** ${c.diff.schwer}`]},
    Object.assign({h: "Sicherung (10 Minuten): das Tafelbild"}, c.sicherung),
    {h: "Reflexion (10 Minuten)", kurz: c.reflexionKurz, muster: c.reflexionMuster,
     visual: {typ: "skala", links: c.skala[0], rechts: c.skala[1], marker: 0.5, label: c.skala[2]},
     liste: c.reflexion},
  ];
  return {
    nav: c.nav, typ: "lektion", gruppe: "Für die Schule", titel: c.titel, symbol: c.symbol,
    downloads: c.downloads,
    lernziele: c.lernziele, kurz: c.kurz, zusammenfassung: c.zusammenfassung,
    abschnitte: ab, mitnehmen: c.mitnehmen, quiz: c.quiz, weiter: c.weiter,
  };
}

const blaetter = (k, nr) => [
  {text: "Arbeitsblatt Medien " + nr, sub: "4 Seiten A4, mit Quiz, für die Klasse", href: `/static/materialien/arbeitsblatt-medien-${nr}.pdf`},
  {text: "Lösungsblatt Medien " + nr, sub: "3 Seiten A4, nur für Lehrkräfte, mit Plänen für Einzel- und Doppelstunde und Hilfekarten zum Ausschneiden", href: `/static/materialien/loesung-medien-${nr}.pdf`},
];

/* ------------------------------------------------------------------ Einheit 1 */
S["medien-stunde-1"] = einheit({
  nav: "Medien 1: Echt oder KI?", titel: "Medien-Einheit 1: Echt oder KI? Bilder sortieren und begründen", symbol: "images", icon: "images",
  downloads: blaetter("", 1).concat([{text: "Kartenset Echt oder KI?", sub: "für die Klasse: 12 Bildkarten, 2 Seiten A4, zum Ausschneiden. Eine Elternfassung mit Auflösung für zu Hause gibt es auf den Elternseiten", href: "/static/materialien/bildkarten-echt-oder-ki.pdf"}]),
  lernziele: [
    "Du kannst Bilder nach Hinweisen sortieren: wahrscheinlich echt, wahrscheinlich KI, unklar.",
    "Du kannst Warnzeichen bei KI-Bildern nennen und am Bild zeigen.",
    "Du kannst erklären, warum Herkunft und Kontext mehr bringen als genaues Hinsehen.",
  ],
  kurz: "45 oder 90 Minuten für Klasse 8, ohne Kamera und ohne Gerät: Die Klasse sortiert zwölf Bildkarten und begründet ihr Urteil.",
  zusammenfassung: "Medien-Einheit 1 für Klasse 8: Echt oder KI? Die Klasse sortiert ein Set aus zwölf Bildkarten (echte Fotos und KI-Bilder), sucht Hinweise und lernt, warum es keine sichere Erkennung gibt. Mit Zeitplan, Aufgaben, Lösungshinweisen, Tafelbild und druckbarem Kartenset.",
  zeitP: ["Vierergruppen, ein ausgedrucktes Kartenset je Gruppe (Download oben). Es braucht kein Gerät, Kamera und Mikrofon bleiben aus. Das Video steht oben auf dieser Seite, es liegt auch auf der Seite {{echt-oder-ki|Echt oder KI?}}"],
  vorbereitung: "Vorbereitung: Kartenset zweimal ausdrucken und ausschneiden. Die Auflösung steht nur im Lösungsblatt, gib sie erst in der Sicherung bekannt.",
  einstieg: {
    kurz: "Video ansehen, etwa 2,5 Minuten, dann die Frage: Wie sicher bist du bei einem Bild?",
    visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "video", text: "Video ansehen", sub: "etwa 2,5 Minuten"},
      {icon: "circle-help", text: "Frage", sub: "Wie sicher bist du?"},
      {icon: "hand", text: "Handzeichen", sub: "für die Reflexion", farbe: "gruen"}]},
    p: ["Zeige das Video oben auf dieser Seite (es liegt auch auf der Seite {{echt-oder-ki|Echt oder KI?}}) und frage danach: Wer ist sicher, dass er KI-Bilder erkennt? Merke dir die Handzeichen, die Frage kommt in der Reflexion zurück."]},
  erarbeitung: {
    kurz: "Drei Schritte: Karten sortieren (7 Minuten), Hinweise suchen (7 Minuten), Prüfweg wählen (6 Minuten).",
    visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "layout-grid", text: "Sortieren", sub: "drei Stapel"},
      {icon: "search", text: "Hinweise", sub: "am Bild zeigen"},
      {icon: "route", text: "Prüfweg", sub: "Herkunft, Kontext", farbe: "gruen"}]},
    p: ["Das Set hat zwölf nummerierte Karten. Unter ihnen sind echte Fotos mit freier Lizenz und mit einem Bildmodell erzeugte Bilder. Karten tragen nur eine Nummer, die Lösung steht im Lösungsblatt."]},
  aufgaben: [
    {ort: "Karten sortieren", sozial: "Gruppe zu viert", niveau: "Basis", icon: "layout-grid", tipps: ["Sortiere zuerst nach deinem Gefühl, ohne lange zu überlegen.", "Bist du unsicher, lege die Karte auf den Stapel „unklar“. Das ist erlaubt."],
     text: "**Ordne zu** (II) jede der zwölf Karten einem von drei Stapeln: wahrscheinlich echt, wahrscheinlich KI oder unklar. Schreibe dafür die Kartennummern je Stapel auf."},
    {ort: "Hinweise suchen", sozial: "Partnerarbeit", niveau: "Standard", icon: "search", tipps: ["Schau auf Licht, Spiegelungen, Hintergrund und Schrift im Bild.", "Frage dich: Könnte auch ein echtes Foto diese Stelle haben?"],
     text: "**Beschreibe** (I) bei zwei Karten, die du für KI hältst, welche Stelle dich zweifeln lässt. Zeige sie am Bild. Dann **erkläre** (II), warum diese Stelle allein kein Beweis ist."},
    {ort: "Prüfweg", sozial: "Einzelarbeit", niveau: "Herausforderung", icon: "route", tipps: ["Drei Prüfwege: Quelle suchen, Bild rückwärts suchen, Kontext prüfen.", "Schreibe das Urteil mit „wahrscheinlich“ auf, nicht mit „sicher“."],
     text: "**Beurteile** (III) bei einer unklaren Karte, wie sicher dein Urteil ist. **Entwickle** (III) dazu einen Prüfweg ohne genaues Hinsehen: Welche drei Fragen zu Herkunft und Kontext stellst du?"},
  ],
  zusatz: {sozial: "Einzelarbeit", niveau: "Herausforderung", text: "**Vergleiche** (II) deine Stapel mit denen einer anderen Gruppe und **begründe** (III), bei welcher Karte ihr euch uneins seid."},
  loesKurz: "Gute KI-Bilder sind oft fehlerfrei, echte Fotos haben manchmal Fehler: Nur Herkunft und Kontext helfen.",
  loesVisual: {typ: "matrix", x: ["Es ist echt", "Es ist KI"], y: ["Ich sage: echt", "Ich sage: KI"], xtitel: "Was es wirklich ist", ytitel: "Was du sagst",
   zellen: [[{text: "Richtig", ton: "gut"}, {text: "Reingefallen", ton: "schlecht"}], [{text: "Falscher Verdacht", ton: "schlecht"}, {text: "Richtig", ton: "gut"}]]},
  loesungen: [
    "**Zu Aufgabe 1, Ordne zu (II):** Die Stapel sind Einschätzungen, keine Fakten. Einige Karten liegen normalerweise falsch. Löse erst nach Aufgabe 3 mit dem Lösungsblatt auf.",
    "**Zu Aufgabe 2, Beschreibe (I) und Erkläre (II):** Eine gute Beschreibung nennt Stelle und Beobachtung, zum Beispiel Spiegelung, Licht oder Hintergrund. Die Erklärung nennt den Grund: Ein Fehler ist ein Hinweis, aber kein Beweis, denn auch echte Fotos sind manchmal verwackelt oder bearbeitet, und gute KI-Bilder sind oft fehlerfrei.",
    "**Zu Aufgabe 3, Beurteile (III) und Entwickle (III):** Gut ist ein Urteil mit Wahrscheinlichkeit statt „sicher“. Ein guter Prüfweg fragt: Wer hat das Bild zuerst veröffentlicht? Was zeigt die Rückwärtssuche? Berichten andere darüber?",
    "**Zum Zusatz, Vergleiche (II) und Begründe (III):** Unterschiede zeigen, dass gute Bilder Gruppen auseinanderbringen. Das ist das Lernziel, nicht ein Fehler der Gruppen.",
  ],
  diff: {
    leichtPunkte: ["Nur die Karten 1 bis 6", "Satz zur Karte ergänzen", "Stapel „unklar“ ist erlaubt"],
    schwerPunkte: ["Alle zwölf Karten", "Prüfweg für jede unklare Karte", "Urteil mit Wahrscheinlichkeit"],
    leicht: "Nur die Karten 1 bis 6 verteilen. Bei **Beschreibe** (I) bleiben: „Ich halte Karte ___ für KI, weil ___.“",
    schwer: "Alle zwölf Karten, dazu **beurteile** (III) die Sicherheit jedes Urteils in Prozent und gib zu jedem Urteil an, welche Quelle du zuerst prüfen würdest und warum.",
  },
  sicherung: {
    kurz: "Hinweise sammeln, Herkunft prüfen, Wahrscheinlichkeit schätzen: Echt oder KI ist selten ein Ja oder Nein.",
    visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "search", text: "Hinweise sammeln", sub: "am Bild"},
      {icon: "route", text: "Herkunft prüfen", sub: "Quelle, Kontext"},
      {icon: "scale", text: "Schätzen", sub: "wahrscheinlich, nicht sicher", farbe: "gruen"}]},
    p: ["Löse die Karten mit dem Lösungsblatt auf und zähle, wie viele Gruppen alle richtig hatten. Ergebnis an die Tafel: Wer überall richtig lag, hatte Glück oder Übung, das Prinzip bleibt Prüfen."],
    merke: "Echt oder KI ist selten ein Ja oder Nein. Du sammelst Hinweise und schätzt die Wahrscheinlichkeit."},
  reflexionMuster: [["Meist war die Sicherheit am Anfang höher als die Trefferquote", "Veränderung: vom Bauchgefühl zu Hinweisen, Herkunft und Wahrscheinlichkeit", "Offene Frage, die Begründung zählt"], ["Auch echte Beweise verlieren dann an Wert", "Wer alles anzweifelt, kann nichts mehr klären, das nützt den Fälschern", "Besser: abgestuft prüfen und Wahrscheinlichkeiten schätzen"], ["Eigenes Beispiel, der Weg zählt", "Prüfweg: Wer hat es zuerst veröffentlicht? Was zeigt die Rückwärtssuche? Berichten andere darüber?", "Das Urteil mit „wahrscheinlich“ formulieren"]],
  reflexionKurz: "Drei Fragen: Sicherheit, Folgen, Prüfen im Alltag.",
  skala: ["unsicher", "sicher", "Wie sicher bist du jetzt bei Bildern?"],
  reflexion: [
    "Wie sicher warst du am Anfang, wie sicher bist du jetzt? Was hat sich verändert?",
    "Was passiert, wenn man überall Fälschungen vermutet und auch echte Beweise nicht mehr glaubt?",
    "Welches Bild aus deinem Alltag würdest du als Nächstes prüfen, und wie?",
  ],
  mitnehmen: [
    "Sichere Erkennung gibt es nicht. Du sammelst Hinweise und schätzt ab.",
    "Ein Fehler im Bild ist ein Hinweis auf KI, aber kein Beweis. Ein sauberes Bild beweist nicht, dass es echt ist.",
    "Herkunft und Kontext prüfen schlägt genaues Hinsehen.",
  ],
  quiz: [
    {frage: "Ein Bild im Chat zeigt eine perfekte Berglandschaft ohne jeden Fehler. Was folgt daraus?",
     optionen: ["Nichts Sicheres: Auch gute KI-Bilder sind oft fehlerfrei", "Es ist ein echtes Foto, denn KI macht immer wieder sichtbare Fehler", "Es ist sicher KI, denn echte Fotos sind nie so sauber", "Es ist stark bearbeitet, aber auf jeden Fall echt"],
     richtig: 0, abschnitt: "Lösungshinweise",
     erklaerung: "Fehlerfreiheit beweist nichts. Darum zählen Herkunft und Kontext."},
    {frage: "Ein Bild einer angeblichen Überschwemmung wird im Klassenchat geteilt. Es wirkt echt, aber du bist unsicher. Welcher Schritt bringt am meisten?",
     optionen: ["Den Bildrand vergrößern und nach Fehlern an Händen suchen", "Die Dateigröße mit anderen Fotos vergleichen", "Auf die Zahl der Likes unter dem Beitrag achten", "Klären, wer das Bild zuerst veröffentlicht hat und wo"],
     richtig: 3, abschnitt: "Lösungshinweise",
     erklaerung: "Die Herkunft lässt sich auch bei einem perfekten Bild prüfen. Likes sagen nichts über echt oder KI."},
    {frage: "Du hast ein Bild geprüft: Die Quelle passt, der Ort stimmt, nichts wirkt auffällig. Wie formulierst du dein Urteil?",
     optionen: ["Das ist sicher echt, denn ich habe alles geprüft", "Wahrscheinlich echt, weil Quelle und Kontext passen", "Das lässt sich nie beurteilen, also sage ich nichts", "Es ist KI, denn ein Bild ganz ohne Fehler ist immer verdächtig"],
     richtig: 1, abschnitt: "Sicherung (10 Minuten): das Tafelbild",
     erklaerung: "Du schätzt eine Wahrscheinlichkeit und nennst den Grund. „Nie beurteilen“ hilft dir nicht weiter."},
  ],
  weiter: ["echt-oder-ki", "medien-stunde-2", "schule-lehrkraefte", "quellen-pruefen"],
});

/* ------------------------------------------------------------------ Einheit 2 */
S["medien-stunde-2"] = einheit({
  nav: "Medien 2: Quellen prüfen", titel: "Medien-Einheit 2: Quellen prüfen, eine Behauptung gegenprüfen", symbol: "check", icon: "search",
  downloads: blaetter("", 2),
  lernziele: [
    "Du kannst eine Behauptung an drei Quellen gegenprüfen.",
    "Du kannst mit Seitwärtslesen herausfinden, wer hinter einer Seite steckt.",
    "Du kannst erklären, warum ein Chatbot als Quelle nicht reicht.",
  ],
  kurz: "45 oder 90 Minuten für Klasse 8: Die Klasse prüft eine Behauptung mit drei Quellen und übt Seitwärtslesen.",
  zusammenfassung: "Medien-Einheit 2 für Klasse 8: Quellen prüfen. Eine Behauptung wird an drei Quellen gegengeprüft: Chat-Antwort, ein Beitrag und eine Behörden- oder Fachseite. Seitwärtslesen und die vier Züge Stopp, Urheber, andere Berichte, Zurückverfolgen. Mit Aufgaben und Lösungshinweisen.",
  zeitP: ["Vierergruppen, ein Gerät je Gruppe mit Browser. Die Chat-Frage braucht das Sprachmodell, die Gruppen fragen versetzt. Das Video steht oben auf dieser Seite, es liegt auch auf der Seite {{quellen-pruefen|Quellen prüfen}}."],
  vorbereitung: "Vorbereitung: Wähle eine Behauptung, die du in einer verlässlichen Quelle belegen kannst, und teste vorher, was der Chat dazu antwortet. Lege einen Beitrag ohne Autor und eine Behörden- oder Fachseite zum Thema bereit.",
  einstieg: {
    kurz: "Video ansehen, etwa 2,5 Minuten, dann die Frage: Eine Meldung im Klassenchat, was tust du zuerst?",
    visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "video", text: "Video ansehen", sub: "etwa 2,5 Minuten"},
      {icon: "message-circle", text: "Klassenchat", sub: "Meldung kommt an"},
      {icon: "hand", text: "Stopp", sub: "erst denken", farbe: "gruen"}]},
    p: ["Zeige das Video oben auf dieser Seite (es liegt auch auf der Seite {{quellen-pruefen|Quellen prüfen}}). Frage danach: Wer leitet Meldungen sofort weiter? Das erste Wort der vier Züge ist Stopp."]},
  erarbeitung: {
    kurz: "Drei Schritte: Chat fragen (6 Minuten), seitwärts lesen (8 Minuten), Gegenprobe (6 Minuten).",
    visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "message-circle", text: "Chat", sub: "Behauptung fragen"},
      {icon: "files", text: "Seitwärts lesen", sub: "neuer Tab"},
      {icon: "circle-check", text: "Gegenprobe", sub: "drei Quellen", farbe: "gruen"}]},
    p: ["Chat: Seite {{chat|Sprachmodell im Chat}}. Zum Prüfen helfen {{quellen-pruefen|Quellen prüfen}} und {{llm-grenzen|Grenzen von Sprachmodellen}}. Die Gruppe prüft eine Behauptung der Lehrkraft."]},
  aufgaben: [
    {ort: "Behauptung und Chat", sozial: "Gruppe zu viert", niveau: "Basis", icon: "message-circle", tipps: ["Stelle die Frage ganz einfach: Stimmt es, dass …?", "Schreibe einen Satz der Antwort wörtlich ab."],
     text: "**Nenne** (I) die Behauptung der Lehrkraft und die Antwort des Chats dazu. Frage dafür im Labor-Chat, ob die Behauptung stimmt, und schreibe einen Satz der Antwort ab."},
    {ort: "Seitwärts lesen", sozial: "Partnerarbeit", niveau: "Standard", icon: "files", tipps: ["Markiere den Namen der Seite und suche ihn in einem neuen Tab.", "Frage: Was hat diese Stelle davon, dass ich es glaube?"],
     text: "**Beschreibe** (I) bei einem Beitrag ohne Autor, wer dahintersteckt. Öffne dafür einen neuen Tab und suche den Namen der Seite. Dann **erkläre** (II), welches Interesse die Seite haben kann."},
    {ort: "Gegenprobe", sozial: "Einzelarbeit", niveau: "Herausforderung", icon: "circle-check", tipps: ["Prüfe bei jeder Quelle Urheber, Datum und ob sie selbst recherchiert hat.", "Drei Seiten, die voneinander abschreiben, zählen als eine Quelle."],
     text: "**Überprüfe** (III) die Behauptung an drei Quellen: Chat, Beitrag, Behörden- oder Fachseite. **Beurteile** (III), welche Quelle am verlässlichsten ist, und stütze dein Urteil auf Gründe."},
  ],
  zusatz: {sozial: "Einzelarbeit", niveau: "Herausforderung", text: "**Entwickle** (III) eine Merkkarte mit den vier Zügen Stopp, Urheber, andere Berichte, Zurückverfolgen und **vergleiche** (II) sie mit der Karte einer anderen Gruppe."},
  loesKurz: "Der Chat ist ein Wegweiser, keine Quelle: Das Original suchst du selbst.",
  loesVisual: {typ: "ablauf", paket: false, schritte: [
    {icon: "hand", text: "Stopp", sub: "erste Reaktion"},
    {icon: "user-round", text: "Urheber", sub: "wer, wozu?"},
    {icon: "copy", text: "Andere Berichte", sub: "unabhängig"},
    {icon: "undo-2", text: "Zurückverfolgen", sub: "zum Original", farbe: "gruen"}]},
  loesungen: [
    "**Zu Aufgabe 1, Nenne (I):** Genannt wird, was der Chat tatsächlich geantwortet hat, ob richtig oder falsch. Beides ist brauchbar: Der Chat ist ein Einstieg, kein Beleg. Die Antworten wechseln, teste die Frage vorher selbst.",
    "**Zu Aufgabe 2, Beschreibe (I) und Erkläre (II):** Gut ist, wenn die Gruppe die Seite verlässt und woanders nachsieht, wer sie betreibt. Das Interesse kann informieren, verkaufen, überzeugen oder Klicks sammeln. Das macht eine Quelle nicht automatisch unglaubwürdig.",
    "**Zu Aufgabe 3, Überprüfe (III) und Beurteile (III):** Das Urteil nennt Gründe: Urheber, Datum, eigene Recherche. Eine Behörden- oder Fachseite mit Datum ist meist verlässlicher als ein Beitrag ohne Autor. Fehlt jede Datumsangabe, ist das selbst ein Warnzeichen.",
    "**Zum Zusatz, Entwickle (III) und Vergleiche (II):** Die Karte nennt die vier Züge in eigenen Worten. Beim Vergleich fällt auf, welche Züge alle Gruppen nennen.",
  ],
  diff: {
    leichtPunkte: ["Quellen sind vorgegeben", "Lückensatz zur Quelle", "Nur zwei Quellen prüfen"],
    schwerPunkte: ["Eigene Quellen suchen", "Datum und Original klären", "Urteil mit Begründung"],
    leicht: "Die Lehrkraft legt die drei Quellen bereit. Bei **Nenne** (I) und **Beschreibe** (I) bleiben: „Die Quelle ist ___, sie will ___.“",
    schwer: "Die Gruppe sucht selbst zwei weitere Quellen, **begründet** (III) das Ergebnis und **beurteilt** (III), ob die Quellen unabhängig sind.",
  },
  sicherung: {
    kurz: "Nicht auf der Seite bleiben: Urheber klären, andere Berichte suchen, zum Original zurückgehen.",
    visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "message-circle", text: "Behauptung", sub: "Chat, Beitrag"},
      {icon: "files", text: "Seitwärts lesen", sub: "Quelle prüfen"},
      {icon: "circle-check", text: "Urteil", sub: "mit Grund", farbe: "gruen"}]},
    p: ["Sammle an der Tafel, welche Quelle am verlässlichsten war und warum. Halte fest: Eine Behauptung wird nicht wahrer, weil sie oft auftaucht. Es zählt, ob die Berichte selbst recherchiert haben."],
    merke: "Nicht auf der Seite nach Beweisen suchen, dass die Seite stimmt. Woanders nachsehen."},
  reflexionMuster: [["Eigene Erfahrung, es gibt keine Musterantwort", "Vor dem Weiterleiten Quelle, Datum und unabhängige Bestätigung prüfen", "Im Zweifel nicht weiterleiten"], ["Wer verdient oder gewinnt etwas: Klicks, Werbung, Stimmen, Aufmerksamkeit", "Das kann Überschrift und Auswahl der Fakten beeinflussen", "Interesse heißt nicht falsch, aber genauer prüfen"], ["Chat: Ideen sammeln, Begriffe erklären lassen, Suchwörter finden", "Original: Zahlen, Zitate, Namen und Quellen prüfen", "Der Chat kann Quellen erfinden, darum nie als Beleg angeben"]],
  reflexionKurz: "Drei Fragen: Weitergeben, Interesse, Chat als Quelle.",
  skala: ["glaube schnell", "prüfe immer", "Wo stehst du jetzt?"],
  reflexion: [
    "Welche Meldung hast du zuletzt weitergeleitet? Würdest du sie jetzt prüfen?",
    "Wer hat ein Interesse daran, dass du eine Meldung glaubst?",
    "Wofür nutzt du den Chat, und wofür suchst du das Original?",
  ],
  mitnehmen: [
    "Nicht auf der Seite bleiben: Neuen Tab öffnen und nachsehen, was andere über die Quelle sagen.",
    "Prüfe Urheber, Datum und Interesse, und suche Berichte, die selbst recherchiert haben.",
    "Ein Chatbot ist ein Wegweiser und keine Quelle. Das Original suchst du selbst.",
  ],
  quiz: [
    {frage: "Drei Webseiten melden dieselbe Nachricht. Du findest heraus, dass zwei von der ersten abgeschrieben haben. Wie viele Quellen hast du?",
     optionen: ["Drei, weil es drei verschiedene Webseiten mit Namen sind", "Keine, weil Abschreiben immer verboten ist", "Eine, weil zwei nicht selbst recherchiert haben", "Zwei, weil eine Seite immer das Original ist"],
     richtig: 2, abschnitt: "Lösungshinweise",
     erklaerung: "Nicht die Anzahl zählt, sondern die Unabhängigkeit: Haben die Berichte selbst recherchiert?"},
    {frage: "Du kennst eine Webseite nicht und willst prüfen, ob du ihr trauen kannst. Was bedeutet Seitwärtslesen?",
     optionen: ["In einem neuen Tab nachsehen, was andere über die Seite sagen", "Den Text quer überfliegen und nur die Überschriften lesen", "Auf der Seite selbst nach Belegen für ihre Glaubwürdigkeit suchen", "Die Seite mit der Übersetzungsfunktion in eine andere Sprache bringen"],
     richtig: 0, abschnitt: "Erarbeitung (20 Minuten)",
     erklaerung: "Profis öffnen einen neuen Tab und suchen den Namen der Seite oder des Autors."},
    {frage: "Ein Chat nennt für deine These eine Quelle mit Titel, Autor und Jahr. Wie gehst du vor?",
     optionen: ["Ich übernehme sie, weil sie so genau und sicher klingt", "Ich frage den Chat, ob er sich bei der Quelle sicher ist", "Ich übernehme sie nur, wenn das Jahr noch ganz aktuell ist", "Ich suche das Original und streiche sie, wenn es fehlt"],
     richtig: 3, abschnitt: "Lösungshinweise",
     erklaerung: "Ein Sprachmodell kann Quellen erfinden. Nur das Original zählt."},
  ],
  weiter: ["quellen-pruefen", "medien-stunde-3", "llm-grenzen", "schule-lehrkraefte"],
});

/* ------------------------------------------------------------------ Einheit 3 */
S["medien-stunde-3"] = einheit({
  nav: "Medien 3: Fake News und Deepfakes", titel: "Medien-Einheit 3: Fake News und Deepfakes, einen Fall analysieren", symbol: "triangle-alert", icon: "file-search",
  downloads: blaetter("", 3),
  lernziele: [
    "Du kannst an einem Fall zeigen, wie eine Falschmeldung entsteht.",
    "Du kannst erklären, warum sie sich schnell verbreitet und wem sie nutzen kann.",
    "Du kannst an einem Dilemma zu einer KI-Stimme beurteilen, was erlaubt ist und welche Gegenmaßnahme hilft.",
  ],
  kurz: "45 oder 90 Minuten für Klasse 8, ohne Kamera: Ein erfundener Fall zeigt Entstehung und Nutzen, ein Dilemma zu einer KI-Stimme die Frage nach Einwilligung und Schaden.",
  zusammenfassung: "Medien-Einheit 3 für Klasse 8: Fake News und Deepfakes. Die Klasse analysiert einen erfundenen Fall (eine Cheap Fake) nach Entstehung, Verbreitung und Nutzen und beurteilt ein Dilemma zu einer KI-erzeugten Stimme: Einwilligung, Persönlichkeitsrecht, Schaden, Gegenmaßnahmen. Beide Fälle sind erfunden, es gibt keine Anleitung zum Fälschen. Mit Hinweisen für den Fall, dass jemand betroffen ist.",
  zeitP: ["Vierergruppen, kein Gerät nötig. Das Video steht oben auf dieser Seite, es liegt auch auf der Seite {{fake-news-deepfakes|Fake News und Deepfakes}}. Der Fall ist erfunden, es gibt keine Anleitung zum Fälschen."],
  vorbereitung: "Vorbereitung: Lies auf der Seite den Abschnitt „Wenn es dich selbst trifft“. Nenne bei Bedarf Hilfe: Nummer gegen Kummer (116 111), JUUUPORT.",
  einstieg: {
    kurz: "Video ansehen, etwa 2,5 Minuten, dann die Frage: Was ist der Unterschied zwischen Irrtum und Absicht?",
    visual: {typ: "vergleich",
     links: {titel: "Falschinformation", icon: "circle-help", farbe: "akzent", punkte: ["Falsch", "Ohne böse Absicht"]},
     rechts: {titel: "Desinformation", icon: "triangle-alert", farbe: "orange", punkte: ["Falsch", "Mit Absicht verbreitet"]}},
    p: ["Zeige das Video oben auf dieser Seite (es liegt auch auf der Seite {{fake-news-deepfakes|Fake News und Deepfakes}}). Schreibe die beiden Begriffe an die Tafel und frage, warum die Unterscheidung für die Reaktion wichtig ist."]},
  erarbeitung: {
    kurz: "Drei Schritte: Entstehung klären (6 Minuten), Nutzen und Verbreitung (8 Minuten), Dilemma zu einer KI-Stimme (6 Minuten).",
    visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "file-search", text: "Entstehung", sub: "was ist echt?"},
      {icon: "share-2", text: "Nutzen", sub: "wem hilft es?"},
      {icon: "audio-lines", text: "KI-Stimme", sub: "Dilemma, was hilft?", farbe: "gruen"}]},
    p: ["Der Fall und das Dilemma stehen im Arbeitsblatt, beide sind erfunden. Sie brauchen nur Papier und den Text. Gruppen, die fertig sind, lesen auf der Seite den Abschnitt „Was du tust, wenn du eine Fälschung siehst“."]},
  aufgaben: [
    {ort: "Entstehung", sozial: "Gruppe zu viert", niveau: "Basis", icon: "file-search", tipps: ["Trenne: Was ist ein echtes Foto, was ist die falsche Zeile darunter?", "Ein altes Bild mit neuer Bildunterschrift braucht keine KI."],
     text: "**Nenne** (I) die echten und die falschen Teile des folgenden Falls und **beschreibe** (I), wie die Meldung entstanden sein kann. Fall: Im Klassenchat kreist ein Foto einer eingestürzten Turnhalle mit der Zeile „Heute Nacht bei uns passiert“. Das Foto ist Jahre alt und zeigt einen anderen Ort."},
    {ort: "Nutzen und Verbreitung", sozial: "Partnerarbeit", niveau: "Standard", icon: "share-2", tipps: ["Wie fühlst du dich, wenn du das Foto siehst? Was machst du dann?", "Denke an Klicks, Aufmerksamkeit oder Schaden als mögliches Ziel."],
     text: "**Erkläre** (II), warum sich die Meldung schnell verbreitet und wem sie nutzen kann. **Vergleiche** (II) dazu zwei Möglichkeiten: Das Foto wird aus Versehen gepostet, oder es wird mit Absicht gepostet. Was ist in beiden gleich, was ist anders?"},
    {ort: "Dilemma KI-Stimme", sozial: "Einzelarbeit", niveau: "Herausforderung", icon: "audio-lines", tipps: ["Frage dich: Wurde die Person gefragt? Wie fühlt sie sich, wenn die ganze Klasse die Nachricht hört?", "Prüfe drei Sichten: Einwilligung, Rechte der Person, möglicher Schaden. Ein „Scherz“ ändert daran nichts."],
     text: "**Beurteile** (III) das folgende Dilemma: Ist das ein Scherz, und welche Gegenmaßnahme (nicht teilen, kurz prüfen, melden oder ruhig nachfragen) hilft am meisten? Dilemma: Ein Mitschüler baut mit einer KI die Stimme eines anderen Mitschülers nach und schickt als „Scherz“ eine Sprachnachricht in den Klassenchat, in der der andere etwas Peinliches sagt. Er wurde nicht gefragt. Wäge Einwilligung, Persönlichkeitsrecht und Schaden gegeneinander ab. Die Nachricht ist erfunden, niemand aus der Klasse ist gemeint."},
  ],
  zusatz: {sozial: "Einzelarbeit", niveau: "Herausforderung", text: "**Entwickle** (III) eine ruhige Nachricht für den Klassenchat in zwei Sätzen, die auf die Falschmeldung hinweist, ohne jemanden bloßzustellen."},
  loesKurz: "Viele Fälschungen brauchen keine KI. Nicht weiterleiten ist die stärkste Gegenmaßnahme.",
  loesVisual: {typ: "ablauf", paket: false, schritte: [
    {icon: "image", text: "Altes Bild", sub: "echt"},
    {icon: "type", text: "Neue Zeile", sub: "falsch", farbe: "orange"},
    {icon: "share-2", text: "Geteilt", sub: "Gefühle treiben an"},
    {icon: "ban", text: "Nicht weiterleiten", sub: "hilft am meisten", farbe: "gruen"}]},
  loesungen: [
    "**Zu Aufgabe 1, Nenne (I) und Beschreibe (I):** Echt ist das Foto, falsch sind Ort und Zeitpunkt in der Zeile. Das ist eine Cheap Fake: ein echtes Bild mit falscher Bildunterschrift, dafür braucht man keine KI. Die Beschreibung nennt die Schritte vom alten Bild zur neuen Zeile. Erst Aufgabe 3 arbeitet mit einem KI-erzeugten Medium.",
    "**Zu Aufgabe 2, Erkläre (II) und Vergleiche (II):** Starke Gefühle wie Schreck machen Teilen leicht, und Empfehlungssysteme zeigen, was Reaktionen bekommt. Nutzen kann Aufmerksamkeit, Klicks oder Schaden sein. Beim Vergleich zählt: Foto und Folgen sind in beiden Fällen gleich (Schreck, Weiterleiten), verschieden sind die Absicht und die richtige Reaktion. Aus Versehen gepostet ist es Falschinformation und eine freundliche Richtigstellung reicht, mit Absicht ist es Desinformation und Melden hilft.",
    "**Zu Aufgabe 3, Beurteile (III):** Das Urteil nennt seine Gründe, das Begründen gehört zum Beurteilen. Erwartet wird: Mit einer KI lässt sich eine Stimme nachbauen, die nie gesagt hat, was sie sagt (ein Deepfake). Ohne Einwilligung der Person ist das kein Scherz: Die Stimme gehört zur Person, ihr Persönlichkeitsrecht kann verletzt sein, und die Nachricht kann bloßstellen und Schaden anrichten, auch wenn niemand das beabsichtigt hat. Es zählt die Wirkung, nicht nur die Absicht. Bei den Gegenmaßnahmen passt hier Nicht weiterleiten, dazu Beweise sichern und melden. Eine Gegenposition („war doch nur Spaß“) darf aufgenommen und mit diesen Gründen beantwortet werden. Es geht ums Abwägen, nicht um Paragrafen, kein Rechtsrat. Wie sicher sich solche Fälschungen erkennen lassen, siehe Sicherung.",
    "**Zum Zusatz, Entwickle (III):** Eine gute Nachricht sagt, was man gefunden hat, und verweist auf den Faktencheck: „Ich habe dazu nichts gefunden, hier ist der Faktencheck.“",
  ],
  diff: {
    leichtPunkte: ["Fall ist vorbereitet", "Lückensatz zur Entstehung", "Nur Aufgabe 1 und 2"],
    schwerPunkte: ["Eigenen Fall ausdenken", "Maßnahmen gewichten", "Nachricht schreiben und prüfen"],
    leicht: "Bei **Nenne** (I) und **Beschreibe** (I) bleiben: „Das Foto ist ___, die Zeile ist ___.“ Eine Liste mit vier Maßnahmen und die drei Sichten (Einwilligung, Rechte, Schaden) liegen bereit.",
    schwer: "Die Gruppe denkt sich einen eigenen Fall mit anderem Ort aus, **beurteilt** (III) die Maßnahmen nach Wirkung und stellt eine Rangfolge auf.",
  },
  sicherung: {
    kurz: "Fälschungen leben von Gefühlen und Teilen. Prüfen, nicht weiterleiten und notfalls melden.",
    visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "triangle-alert", text: "Meldung", sub: "löst Gefühl aus"},
      {icon: "search", text: "Kurz prüfen", sub: "eine Minute"},
      {icon: "shield-check", text: "Nicht teilen", sub: "oder melden", farbe: "gruen"}]},
    p: ["Fasse zusammen: Wer eine Fälschung teilt, um sich aufzuregen, verbreitet sie trotzdem. Fälschungen echter Menschen verletzen Rechte, auch als Spaß mit Mitschülern oder Lehrkräften. Bei KI-Stimmen und KI-Videos gibt es Hinweise (etwa seltsame Betonung oder Details, die nicht stimmen), aber keine sichere Erkennung. Gute Fälschungen fallen nicht auf, darum zählen Herkunft und Kontext wie in Medien 1 und 2."],
    merke: "Nicht jede falsche Meldung ist eine Lüge. Aber jede, die du weiterleitest, trägt deinen Namen."},
  reflexionMuster: [["Eigene Erfahrung, es gibt keine Musterantwort", "Starke Gefühle sind ein Warnsignal: erst prüfen, dann teilen", "Prüffragen: Quelle, Datum, Bestätigung durch andere"], ["Man vertraut Freunden und prüft weniger", "Meldungen verbreiten sich schnell und ohne Einordnung", "Eine Richtigstellung erreicht selten alle, die die Meldung gesehen haben"], ["Eltern, Lehrkraft, Vertrauenslehrkraft oder Schulsozialarbeit", "Beratung: Nummer gegen Kummer (116 111), JUUUPORT", "Beweise sichern und den Inhalt bei der Plattform melden"]],
  reflexionKurz: "Drei Fragen: Gefühle, Gruppenchat, Hilfe.",
  skala: ["leite schnell weiter", "prüfe erst", "Wo stehst du jetzt?"],
  reflexion: [
    "Welche Meldung hat dich zuletzt wütend oder ängstlich gemacht? Hast du sie geteilt?",
    "Warum sind Gruppenchats für Falschmeldungen besonders heikel?",
    "Wen kannst du ansprechen, wenn jemand ein gefälschtes Bild von dir verbreitet?",
  ],
  mitnehmen: [
    "Viele Fälschungen brauchen keine KI: falscher Zusammenhang, altes Bild, erfundene Seite.",
    "Falschmeldungen leben von Gefühlen und Teilen. Nicht weiterleiten ist die stärkste Gegenmaßnahme.",
    "Fälschungen echter Menschen verletzen Rechte. Wenn es dich trifft: sichern, Hilfe holen, melden.",
  ],
  quiz: [
    {frage: "Ein echtes Foto von einer Demo aus dem Jahr 2015 wird mit der Behauptung geteilt, es sei von gestern. Wie nennt man das?",
     optionen: ["Einen Deepfake, weil eine KI das Bild verändert hat", "Eine Cheap Fake, weil ein echtes Bild falsch eingesetzt wird", "Satire, weil sie niemanden ernsthaft täuschen soll", "Einen Algorithmus, weil das Bild automatisch verbreitet wird"],
     richtig: 1, abschnitt: "Lösungshinweise",
     erklaerung: "Cheap Fakes brauchen keine KI: Ein echtes Bild bekommt einen falschen Zusammenhang."},
    {frage: "Eine empörende Falschmeldung verbreitet sich binnen einer Stunde in vielen Gruppenchats. Was erklärt das am besten?",
     optionen: ["Falschmeldungen sind technisch meist besser gemacht als echte", "Plattformen wollen sie absichtlich möglichst weit verbreiten", "Gefühle machen Teilen leicht, und Feeds zeigen Beliebtes zuerst", "Sie sind kürzer als echte Meldungen und werden schneller gelesen"],
     richtig: 2, abschnitt: "Erarbeitung (20 Minuten)",
     erklaerung: "Der Feed ist nach Reaktionen gebaut, nicht nach Wahrheit. Das ist ein Nebeneffekt."},
    {frage: "Ein Mitschüler baut mit einer KI die Stimme eines anderen nach und schickt als „Scherz“ eine Sprachnachricht in den Klassenchat. Der andere wurde nicht gefragt. Was ist das?",
     optionen: ["Ein Deepfake ohne Einwilligung, der Rechte verletzen kann", "Ein harmloser Spaß, solange die Klasse darüber lacht", "Erlaubt, weil die Stimme nur nachgebaut und nicht aufgenommen wurde", "Nur ein Problem, wenn die Nachricht im Netz öffentlich steht"],
     richtig: 0, abschnitt: "Lösungshinweise",
     erklaerung: "Eine nachgebaute Stimme ohne Einwilligung ist ein Deepfake. Der Scherz ändert nichts: Sie kann Persönlichkeitsrechte verletzen und Schaden anrichten."},
  ],
  weiter: ["fake-news-deepfakes", "medien-stunde-4", "quellen-pruefen", "schule-lehrkraefte"],
});

/* ------------------------------------------------------------------ Einheit 4 */
S["medien-stunde-4"] = einheit({
  nav: "Medien 4: KI und Hausaufgaben", titel: "Medien-Einheit 4: KI und Hausaufgaben, Klassenregeln entwickeln", symbol: "pencil", icon: "scale",
  downloads: blaetter("", 4),
  lernziele: [
    "Du kannst mit der Faustfrage entscheiden, ob KI dir hilft oder Arbeit abnimmt.",
    "Du kannst KI-Hilfe so angeben, dass sie nachvollziehbar ist.",
    "Du kannst Regeln vorschlagen: erlaubt, genannt, verboten.",
  ],
  kurz: "45 oder 90 Minuten für Klasse 8, ohne Gerät: Die Klasse entwickelt Regelvorschläge für KI bei Hausaufgaben.",
  zusammenfassung: "Medien-Einheit 4 für Klasse 8: KI und Hausaufgaben. Die Klasse sortiert Beispiele nach erlaubt, genannt und verboten, übt die Faustfrage und die Angabe von KI-Hilfe und entwickelt Regelvorschläge. Welche Regeln gelten, entscheidet die Schule.",
  zeitP: ["Vierergruppen, kein Gerät nötig. Das Video steht oben auf dieser Seite, es liegt auch auf der Seite {{ki-hausaufgaben-fair|KI bei Hausaufgaben}}. Die Regeln der Schule gehen vor: Die Ergebnisse der Klasse sind Vorschläge."],
  vorbereitung: "Vorbereitung: Kläre vorher, was an deiner Schule zu KI bei Hausaufgaben gilt. Was erlaubt ist, entscheidet die Schule oder Lehrkraft, nicht die Technik.",
  einstieg: {
    kurz: "Video ansehen, etwa 2,5 Minuten, dann die Faustfrage: Hast du danach mehr verstanden, oder nur etwas abgegeben?",
    visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "video", text: "Video ansehen", sub: "etwa 2,5 Minuten"},
      {icon: "circle-help", text: "Faustfrage", sub: "mehr verstanden?"},
      {icon: "hand", text: "Handzeichen", sub: "Wer nutzt KI?", farbe: "gruen"}]},
    p: ["Zeige das Video oben auf dieser Seite (es liegt auch auf der Seite {{ki-hausaufgaben-fair|KI bei Hausaufgaben}}). Schreibe die Faustfrage an die Tafel. Frage ohne Vorwurf, wer KI schon für Hausaufgaben nutzt."]},
  erarbeitung: {
    kurz: "Drei Schritte: Beispiele sortieren (6 Minuten), Faustfrage anwenden (8 Minuten), Klassenregeln schreiben (6 Minuten).",
    visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "list-checks", text: "Sortieren", sub: "erlaubt, genannt, verboten"},
      {icon: "circle-help", text: "Faustfrage", sub: "hilft oder nimmt ab?"},
      {icon: "pen-line", text: "Regeln", sub: "für die Klasse", farbe: "gruen"}]},
    p: ["Die Gruppen arbeiten auf Papier. Die Faustregel von der Seite: erst selbst versuchen, dann KI fragen, dann prüfen und in eigenen Worten aufschreiben."]},
  aufgaben: [
    {ort: "Beispiele sortieren", sozial: "Gruppe zu viert", niveau: "Basis", icon: "list-checks", tipps: ["Denke an Erklären lassen, Abfragen lassen, Fertiglösung holen.", "Eine Hilfe, die du offen angibst, ist selten ein Problem."],
     text: "**Nenne** (I) fünf Möglichkeiten, KI bei Hausaufgaben zu nutzen. Ordne sie als Vorschlag: erlaubt, erlaubt mit Angabe oder verboten."},
    {ort: "Faustfrage und Angabe", sozial: "Partnerarbeit", niveau: "Standard", icon: "circle-help", tipps: ["Wer macht in dem Beispiel das Denken, du oder die KI?", "Eine Angabe nennt Werkzeug, Datum und wofür du es genutzt hast."],
     text: "**Erkläre** (II) bei zwei Beispielen mit der Faustfrage, ob KI hilft oder abnimmt. Dann **beschreibe** (I) in einem Satz, wie du die KI-Hilfe in deiner Hausaufgabe angibst."},
    {ort: "Klassenregeln", sozial: "Einzelarbeit", niveau: "Herausforderung", icon: "pen-line", tipps: ["Eine Regel ist kurz und prüfbar, zum Beispiel „Ich gebe an, wofür ich KI genutzt habe“.", "Frage dich bei jeder Regel: Ist sie für alle fair?"],
     text: "**Entwickle** (III) drei Regelvorschläge für deine Klasse zu erlaubt, genannt und verboten. **Begründe** (III), warum die Regeln fair sind."},
  ],
  zusatz: {sozial: "Einzelarbeit", niveau: "Herausforderung", text: "**Beurteile** (III), welche Frage an die Lehrkraft für eure Klasse am wichtigsten ist: Welche Aufgaben darf ich mit KI-Hilfe machen? Wie kennzeichne ich die Nutzung? Was passiert, wenn ich etwas übernommen habe?"},
  loesKurz: "Es kommt nicht auf das Werkzeug an, sondern darauf, wer das Denken macht und ob du es offen sagst.",
  loesVisual: {typ: "kreis", mitte: "Fair",
   knoten: [{icon: "pencil", text: "Selbst versuchen"}, {icon: "bot", text: "KI fragen"}, {icon: "search", text: "Prüfen"}, {icon: "notebook-pen", text: "Eigene Worte"}]},
  loesungen: [
    "**Zu Aufgabe 1, Nenne (I):** Genannt werden fünf Beispiele, zum Beispiel Stoff erklären lassen, abfragen lassen, Rechenweg prüfen, Gliederung vorschlagen, fertige Lösung holen. Die Zuordnung ist ein Vorschlag, die Schule entscheidet.",
    "**Zu Aufgabe 2, Erkläre (II) und Beschreibe (I):** Hilft: Du versuchst selbst und vergleichst dann. Nimmt ab: Du holst direkt die Lösung, es fehlt der Lernschritt. Eine Angabe könnte lauten: „Für die Gliederung habe ich ein KI-Programm (Name, Datum) befragt. Den Text habe ich selbst geschrieben.“",
    "**Zu Aufgabe 3, Entwickle (III) und Begründe (III):** Gute Regeln sind kurz, prüfbar und für alle gleich. Beispiel: Verschwiegene Hilfe ist Täuschung, offen angegebene Hilfe ist selten ein Problem. Verboten ist, KI-Text als eigene Leistung abzugeben.",
    "**Zum Zusatz, Beurteile (III):** Es gibt keine richtige Antwort, zählt die Begründung. Die Fragen vorab zu stellen schützt beide Seiten.",
  ],
  diff: {
    leichtPunkte: ["Beispiele sind vorgegeben", "Angabe als Lückensatz", "Nur eine Regel"],
    schwerPunkte: ["Eigene Beispiele finden", "Grenzfälle besprechen", "Drei Regeln begründen"],
    leicht: "Eine Liste mit Beispielen liegt bereit. Bei **Nenne** (I) und **Beschreibe** (I) bleiben: „Ich habe ___ genutzt, um ___.“",
    schwer: "Die Gruppe sucht einen Grenzfall, **begründet** (III), warum er schwer zu entscheiden ist, und **beurteilt** (III), welche Regel ihn klärt.",
  },
  sicherung: {
    kurz: "Erst selbst versuchen, dann KI fragen, dann prüfen und in eigenen Worten aufschreiben.",
    visual: {typ: "kreis", mitte: "Fair",
     knoten: [{icon: "pencil", text: "Selbst versuchen"}, {icon: "bot", text: "KI fragen"}, {icon: "search", text: "Prüfen"}, {icon: "notebook-pen", text: "Eigene Worte"}]},
    p: ["Sammle die Regelvorschläge der Gruppen an der Tafel. Streiche gemeinsam, was mit den Regeln der Schule nicht geht. Gib an, was die Klasse als Regelvorschlag an die Schule geben kann."],
    merke: "KI darf dir helfen, es zu verstehen. Das Verstehen selbst kann sie dir nicht abnehmen."},
  reflexionMuster: [["Prüfstein für Verstehen: Kann ich es mit eigenen Worten ohne Hilfe erklären?", "Wenn nicht, wurde nur abgegeben und nicht gelernt", "Dann noch einmal selbst versuchen oder die Erklärung nachvollziehen"], ["Offenheit schützt vor dem Vorwurf der Täuschung", "Die Lehrkraft kann den eigenen Anteil richtig einschätzen", "Man übt saubere Quellenangaben"], ["Eine klare Aussage, wann KI erlaubt ist und wann nicht", "Wie die Nutzung angegeben werden soll", "Eine Ansprechperson bei Unsicherheit"]],
  reflexionKurz: "Drei Fragen: Lernen, Angabe, Vertrauen.",
  skala: ["unsicher bei den Regeln", "sicher bei den Regeln", "Wie klar sind dir die Regeln?"],
  reflexion: [
    "Könntest du das, was du heute mit KI gemacht hast, morgen ohne Handy erklären?",
    "Warum schützt dich die Angabe von KI-Hilfe selbst?",
    "Was brauchst du von deiner Lehrkraft, damit die Regeln klar sind?",
  ],
  mitnehmen: [
    "Frage dich: Hast du danach mehr verstanden, oder nur etwas abgegeben?",
    "Erst selbst versuchen, dann KI fragen, dann prüfen, dann in eigenen Worten aufschreiben.",
    "Die Regeln legt deine Schule fest. Im Zweifel vorher fragen und die Hilfe angeben.",
  ],
  quiz: [
    {frage: "Ein Schüler lässt eine KI seinen Aufsatz schreiben und gibt ihn ab. Wann ist das Täuschung?",
     optionen: ["Immer, schon wenn er die KI überhaupt benutzt hat", "Nur, wenn die Aufgabe besonders schwer gewesen ist", "Nur, wenn die Lehrkraft die KI-Nutzung bemerkt hat", "Wenn er ihn als eigene Leistung ausgibt und es verschweigt"],
     richtig: 3, abschnitt: "Lösungshinweise",
     erklaerung: "Täuschung heißt: etwas als eigene Leistung abgeben, das nicht von dir ist, und es verschweigen."},
    {frage: "Du sollst ein Gedicht deuten und willst die KI nutzen, um wirklich etwas zu lernen. Welche Reihenfolge ist am besten?",
     optionen: ["Die KI deuten lassen, abschreiben und dann abgeben", "Erst selbst versuchen, dann KI fragen, prüfen, neu formulieren", "Erst die KI fragen, danach selbst einen Versuch starten", "Alles prüfen lassen, bevor man selbst etwas geschrieben hat"],
     richtig: 1, abschnitt: "Sicherung (10 Minuten): das Tafelbild",
     erklaerung: "Wer erst selbst versucht, behält das Denken. Wer die Reihenfolge umdreht, lernt weniger."},
    {frage: "An deiner Schule gibt es keine ausdrückliche Regel zur KI-Nutzung bei Hausaufgaben. Was heißt das für dich?",
     optionen: ["Alles ist erlaubt, weil nichts verboten wurde", "Alles ist verboten, was nicht ausdrücklich erlaubt ist", "Du fragst vorab nach, was für diese Aufgabe gilt", "Nur Texte sind verboten, alles andere ist erlaubt"],
     richtig: 2, abschnitt: "Lösungshinweise",
     erklaerung: "Keine Regel heißt nicht, dass alles erlaubt ist. Frage nach, am besten vorab."},
  ],
  weiter: ["ki-hausaufgaben-fair", "medien-stunde-5", "prompts-fuer-schueler", "schule-lehrkraefte"],
});

/* ------------------------------------------------------------------ Einheit 5 */
S["medien-stunde-5"] = einheit({
  nav: "Medien 5: Datenschutz im Alltag", titel: "Medien-Einheit 5: Datenschutz im Alltag, App-Rechte und Datenspuren", symbol: "shield-check", icon: "shield-check",
  downloads: blaetter("", 5),
  lernziele: [
    "Du kannst nennen, welche Daten Apps nebenbei über dich sammeln.",
    "Du kannst entscheiden, welche Freigaben eine App für ihren Zweck braucht.",
    "Du kannst als Faustregel sagen, was du keinem Chatbot eingibst.",
  ],
  kurz: "45 oder 90 Minuten für Klasse 8, ohne Kamera und Mikrofon: Die Klasse prüft App-Rechte und eigene Datenspuren.",
  zusammenfassung: "Medien-Einheit 5 für Klasse 8: Datenschutz im Alltag. Die Klasse sammelt Datenspuren, entscheidet über App-Freigaben für Kamera, Mikrofon und Standort an erfundenen Beispiel-Apps und entwickelt eine Faustregel für Chatbots. Ohne Kamera, kein Zeigen privater Einstellungen.",
  zeitP: ["Einzel- und Partnerarbeit, kein Gerät nötig. Das Video steht oben auf dieser Seite, es liegt auch auf der Seite {{datenschutz-im-alltag|Datenschutz im Alltag}}. Niemand muss eigene Einstellungen oder Apps zeigen."],
  vorbereitung: "Vorbereitung: Die Stunde ist ein Überblick und keine Rechtsberatung. Bei der Einwilligung gilt nach der Seite: In Deutschland liegt die Grenze bei 16 Jahren für Online-Dienste, darunter sind die Eltern beteiligt.",
  einstieg: {
    kurz: "Video ansehen, etwa 2,5 Minuten, dann die Frage: Welche Daten entstehen, wenn du eine App öffnest?",
    visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "clock", text: "Wie lange", sub: "du ein Video siehst"},
      {icon: "map-pin", text: "Wo", sub: "du dich befindest"},
      {icon: "smartphone", text: "Womit", sub: "welches Gerät"}]},
    p: ["Zeige das Video oben auf dieser Seite (es liegt auch auf der Seite {{datenschutz-im-alltag|Datenschutz im Alltag}}). Sammle an der Tafel, was Apps nebenbei sammeln. Frage: Ist das immer schlimm? Nein, Navigation braucht den Standort."]},
  erarbeitung: {
    kurz: "Drei Schritte: Datenspuren sammeln (6 Minuten), App-Rechte prüfen (8 Minuten), Chatbot-Regel (6 Minuten).",
    visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "route", text: "Datenspuren", sub: "was entsteht?"},
      {icon: "toggle-right", text: "App-Rechte", sub: "was ist nötig?"},
      {icon: "message-square", text: "Chatbot", sub: "was nie rein?", farbe: "gruen"}]},
    p: ["Alles auf Papier. Wer fertig ist, liest auf {{sicherheit-einfach|Ist das sicher?}}, was dieses Labor speichert und was nicht."]},
  aufgaben: [
    {ort: "Datenspuren", sozial: "Einzelarbeit", niveau: "Basis", icon: "route", tipps: ["Denke an Zeit, Ort, Gerät und was du ansiehst.", "Daten entstehen auch, wenn du nichts eintippst."],
     text: "**Nenne** (I) fünf Daten, die eine App deiner Wahl nebenbei über dich sammeln kann, ohne dass du sie eintippst. Du musst keine App und keine Einstellung zeigen."},
    {ort: "App-Rechte", sozial: "Partnerarbeit", niveau: "Standard", icon: "toggle-right", tipps: ["Frage bei jeder Freigabe: Braucht die App das für das, was ich tun will?", "Nur beim Verwenden der App ist oft die bessere Wahl beim Standort."],
     text: "**Vergleiche** (II), welche Freigaben (Kamera, Mikrofon, Standort, Kontakte) eine Taschenlampen-App und eine Navigations-App für ihren Zweck brauchen. **Beschreibe** (I), wo du Freigaben zurücknimmst."},
    {ort: "Chatbot-Regel", sozial: "Einzelarbeit", niveau: "Herausforderung", icon: "message-square", tipps: ["Würdest du es öffentlich aufhängen? Wenn nein, tippe es nicht ein.", "Eine Postkarte kann jeder lesen, ein Brief nicht."],
     text: "**Entwickle** (III) eine Faustregel, was du keinem Chatbot eingibst, mit drei Beispielen. **Begründe** (III), warum du Eingaben wie eine Postkarte behandelst."},
  ],
  zusatz: {sozial: "Einzelarbeit", niveau: "Herausforderung", text: "**Überprüfe** (III) die Seite „Ist das sicher?“ im Labor: Welche Angaben zu Daten stehen dort, welche Frage bleibt für dich offen?"},
  loesKurz: "Daten entstehen auch nebenbei. Gib Freigaben nur, wenn die App sie für ihren Zweck braucht.",
  loesVisual: {typ: "matrix", x: ["Taschenlampe", "Navigation"], y: ["Standort", "Kontakte"],
   zellen: [[{text: "nicht nötig", ton: "schlecht"}, {text: "nötig", ton: "gut"}], [{text: "nicht nötig", ton: "schlecht"}, {text: "nicht nötig", ton: "schlecht"}]]},
  loesungen: [
    "**Zu Aufgabe 1, Nenne (I):** Genannt werden zum Beispiel wie lange du ein Video siehst, wo du dich befindest, welches Gerät du nutzt, was du likest oder teilst und welche Vorlieben die App ableitet. Wichtig ist, dass du weißt, was gesammelt wird, und Nein sagen kannst.",
    "**Zu Aufgabe 2, Vergleiche (II) und Beschreibe (I):** Die Navigations-App braucht den Standort, die Taschenlampe keine Freigabe von Standort und Kontakten. Zurücknehmen kannst du Freigaben jederzeit in den Einstellungen des Geräts, prüfe sie ab und zu.",
    "**Zu Aufgabe 3, Entwickle (III) und Begründe (III):** Eine gute Regel: Gib nur ein, was dich nicht blamiert, wenn es später jemand liest. Dazu zählen Passwörter, Adressen, Fotos von anderen, Gesundheitsangaben und Daten, die nicht dir gehören. Bei vielen Chatbots werden Eingaben gespeichert.",
    "**Zum Zusatz, Überprüfe (III):** Die Seite sagt: Kein Konto, keine externen KI-Dienste, Eingaben werden nach den Angaben des Labors nur im Arbeitsspeicher verarbeitet. Eine offene Frage ist zulässig, die Datenschutzerklärung des Betreibers ist verbindlich.",
  ],
  diff: {
    leichtPunkte: ["Datenarten sind vorgegeben", "Tabelle zum Ankreuzen", "Nur Aufgabe 1 und 2"],
    schwerPunkte: ["Eigene Beispiel-App entwerfen", "Zweck und Rechte abwägen", "Regel mit Begründung"],
    leicht: "Eine Liste mit Datenarten liegt bereit (Zeit, Ort, Gerät, Vorlieben). Bei **Nenne** (I) und **Beschreibe** (I) bleiben und ankreuzen, was zu welcher App passt.",
    schwer: "Die Gruppe entwirft eine eigene erfundene App, **vergleicht** (II) Zweck und gewünschte Rechte und **beurteilt** (III), welche Freigabe sie nicht geben würde.",
  },
  sicherung: {
    kurz: "Mehr Daten entstehen, als du eintippst: Frage bei jeder Freigabe nach dem Zweck.",
    visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "smartphone", text: "App fragt", sub: "Kamera, Standort"},
      {icon: "circle-help", text: "Zweck?", sub: "braucht sie das?"},
      {icon: "toggle-right", text: "Ja oder Nein", sub: "jederzeit änderbar", farbe: "gruen"}]},
    p: ["Sammle an der Tafel die Faustregeln der Klasse für Chatbots. Verbinde mit dem Labor: Das KI-Labor braucht kein Konto, Kamera und Mikrofon schalten sich nie von allein ein."],
    merke: "Was du in ein Eingabefeld tippst, behandle wie eine Postkarte, nicht wie einen Brief."},
  reflexionMuster: [["Eigene Erfahrung, es gibt keine Musterantwort", "Gründe: Zeitdruck, lange Texte, ohne Zustimmung geht es nicht weiter", "Besser: Auswahl prüfen und nicht nötige Freigaben ablehnen"], ["Eigene Auswahl, etwa Kontakte, Standort oder Mikrofon", "Maßstab: Braucht die App das für ihren Zweck?", "Weg: Einstellungen des Geräts"], ["Passwörter, Adresse, Namen anderer, Peinliches", "Unklar ist, wer Eingaben später sieht oder speichert", "Faustregel: nichts eingeben, was nicht öffentlich werden dürfte"]],
  reflexionKurz: "Drei Fragen: Nein sagen, Passwörter, Chat.",
  skala: ["gebe schnell frei", "prüfe jede Freigabe", "Wo stehst du jetzt?"],
  reflexion: [
    "Wann hast du zuletzt auf „Akzeptieren“ geklickt, ohne zu lesen?",
    "Welche Freigabe würdest du heute zurücknehmen?",
    "Was würdest du einem Chatbot nie schreiben, und warum nicht?",
  ],
  mitnehmen: [
    "Apps sammeln mehr, als du eintippst: Nutzung, Standort, Gerät, Vorlieben.",
    "Gib Kamera, Mikrofon und Standort nur frei, wenn die App sie für ihren Zweck braucht, und nimm die Freigabe zurück, wenn nicht mehr.",
    "Behandle Chatbot-Eingaben wie eine Postkarte. Keine Passwörter, Adressen oder Daten anderer.",
  ],
  quiz: [
    {frage: "Eine Taschenlampen-App möchte auf deine Kontakte zugreifen. Was ist die beste Reaktion?",
     optionen: ["Ablehnen, denn die App braucht sie nicht für ihren Zweck", "Erlauben, es ist ja nur eine kleine App ohne jedes Risiko", "Erlauben und die App nach einer Woche wieder löschen", "Eine Freundin fragen, ob sie die Freigabe erteilt hat"],
     richtig: 0, abschnitt: "Lösungshinweise",
     erklaerung: "Frage bei jeder Freigabe: Braucht die App das für das, was ich tun will?"},
    {frage: "Du übst mit einem Chatbot für eine Klassenarbeit. Welche Eingabe lässt du besser weg?",
     optionen: ["Eine Frage zum Stoff der nächsten Klassenarbeit", "Die Bitte, einen schweren Begriff einfacher zu erklären", "Dein Passwort für den Account und die Adresse deiner Familie", "Ein selbst ausgedachtes Beispiel mit erfundenen Namen"],
     richtig: 2, abschnitt: "Lösungshinweise",
     erklaerung: "Gib nichts ein, das dich blamiert, wenn es später jemand liest."},
    {frage: "Vor drei Monaten hast du einer App den Zugriff auf dein Mikrofon erlaubt. Jetzt willst du das zurücknehmen. Was stimmt?",
     optionen: ["Das geht nur, wenn du die App löschst und neu installierst", "Das geht jederzeit in den Einstellungen des Geräts", "Das geht nur, wenn deine Eltern es für dich ändern", "Das geht nicht, denn eine erteilte Freigabe gilt dauerhaft"],
     richtig: 1, abschnitt: "Erarbeitung (20 Minuten)",
     erklaerung: "Die Freigabe lässt sich jederzeit in den Einstellungen zurücknehmen. Prüfe sie ab und zu."},
  ],
  weiter: ["datenschutz-im-alltag", "medien-stunde-6", "sicherheit-einfach", "schule-lehrkraefte"],
});

/* ------------------------------------------------------------------ Einheit 6 */
S["medien-stunde-6"] = einheit({
  nav: "Medien 6: Gute Fragen stellen", titel: "Medien-Einheit 6: Gute Fragen stellen, Prompts verbessern", symbol: "message-square", icon: "pen-line",
  downloads: blaetter("", 6),
  lernziele: [
    "Du kannst eine Frage mit Rolle, Aufgabe, Material, Format und Grenzen formulieren.",
    "Du kannst Antworten auf eine knappe und eine bessere Frage vergleichen.",
    "Du kannst eine Antwort der KI prüfen, bevor du sie benutzt.",
  ],
  kurz: "45 oder 90 Minuten für Klasse 8, in Einzelarbeit und ohne Kamera: Die Prompt-Werkstatt zeigt, wie eine bessere Frage die Antwort verändert.",
  zusammenfassung: "Medien-Einheit 6 für Klasse 8: Gute Fragen stellen. Alle schreiben zuerst eine Frage auf Papier und verbessern sie mit den fünf Bausteinen. In der Prompt-Werkstatt vergleicht die Gruppe die Antworten auf beide Fassungen. Einzelarbeit, ohne Kamera.",
  zeitP: ["Einzelarbeit: Jede und jeder schreibt zuerst auf Papier. Gesendet wird in der Prompt-Werkstatt am Gruppengerät, nacheinander und versetzt, denn der Rechner beantwortet höchstens zwei Anfragen gleichzeitig, weitere warten der Reihe nach (bei mehr als etwa sieben Geräten wird es zäh). Das Video steht oben auf dieser Seite, es liegt auch auf der Seite {{prompts-fuer-schueler|Gute Fragen an die KI stellen}}."],
  vorbereitung: "Vorbereitung: Probiere „Beide senden“ in der Prompt-Werkstatt (Seite prompting) mit einer eigenen Frage aus. Gruppen, die warten, schreiben schon die nächste Frage auf Papier.",
  einstieg: {
    kurz: "Video ansehen, etwa 2,5 Minuten, dann die Frage: Was bestellst du im Imbiss, wenn du nur „Döner“ sagst?",
    visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "video", text: "Video ansehen", sub: "etwa 2,5 Minuten"},
      {icon: "message-circle", text: "Döner", sub: "ohne Angaben"},
      {icon: "message-square", text: "Mit Angaben", sub: "ohne Zwiebeln, scharf", farbe: "gruen"}]},
    p: ["Zeige das Video oben auf dieser Seite (es liegt auch auf der Seite {{prompts-fuer-schueler|Gute Fragen an die KI stellen}}). Das Modell ergänzt Fehlendes mit dem Üblichen. Je mehr du sagst, was du willst, desto besser trifft es."]},
  erarbeitung: {
    kurz: "Drei Schritte: Frage schreiben (6 Minuten), Antworten vergleichen (8 Minuten), prüfen und nachfragen (6 Minuten).",
    visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "pencil", text: "Frage schreiben", sub: "auf Papier"},
      {icon: "split", text: "Vergleichen", sub: "Beide senden"},
      {icon: "search", text: "Prüfen", sub: "Zahlen, Namen", farbe: "gruen"}]},
    p: ["Prompt-Werkstatt: Seite {{prompting|Gut fragen: Prompts schreiben}}. Die fünf Bausteine stehen auf {{prompts-fuer-schueler|Gute Fragen an die KI stellen}}. Die Antworten wechseln, bewerte die Begründung."]},
  aufgaben: [
    {ort: "Frage schreiben", sozial: "Einzelarbeit", niveau: "Basis", icon: "pencil", tipps: ["Beginne mit einem Schulthema, das du gut kennst.", "Rolle, Aufgabe, Material, Format, Grenzen: Welche Bausteine fehlen noch?"],
     text: "**Nenne** (I) die fünf Bausteine einer guten Frage. Schreibe dann auf Papier eine knappe Frage zu einem Schulthema (Prompt A) und eine bessere Fassung mit mindestens zwei Bausteinen (Prompt B)."},
    {ort: "Antworten vergleichen", sozial: "Einzelarbeit", niveau: "Standard", icon: "split", tipps: ["Lege beide Antworten nebeneinander und markiere, was nur in einer steht.", "Welcher Baustein hat die Antwort verändert?"],
     text: "**Vergleiche** (II) in der Prompt-Werkstatt die Antworten auf Prompt A und Prompt B. Drücke dafür „Beide senden“. **Erkläre** (II), welcher Baustein die Antwort am meisten verändert hat."},
    {ort: "Prüfen und nachfragen", sozial: "Einzelarbeit", niveau: "Herausforderung", icon: "search", tipps: ["Prüfe Zahlen, Namen und Behauptungen, die du weitergeben würdest.", "Eine Nachfrage kann lauten: Kürzer, in drei Sätzen. Oder: Was könnte an deiner Antwort falsch sein?"],
     text: "**Überprüfe** (III) in der besseren Antwort eine Zahl oder einen Namen. **Entwickle** (III) eine Nachfrage, die die Antwort besser macht, und **beurteile** (III), ob du die Antwort abgeben würdest."},
  ],
  zusatz: {sozial: "Einzelarbeit", niveau: "Herausforderung", text: "**Begründe** (III), warum der Zusatz „Gib mir nur einen Hinweis, nicht die Lösung“ ein guter Teil einer Frage bei Hausaufgaben ist."},
  loesKurz: "Eine bessere Frage sagt, was fehlen würde. Das Modell rät sonst, und ein sicherer Ton beweist nichts.",
  loesVisual: {typ: "raster", spalten: 5, zellen: [
    {icon: "user", text: "Rolle", sub: "wer ist die KI?"}, {icon: "target", text: "Aufgabe", sub: "was genau?"}, {icon: "file-text", text: "Material", sub: "womit?"},
    {icon: "list", text: "Format", sub: "wie aussehen?"}, {icon: "ban", text: "Grenzen", sub: "was vermeiden?"}]},
  loesungen: [
    "**Zu Aufgabe 1, Nenne (I):** Rolle, Aufgabe, Material, Format, Grenzen. Nicht immer alle, aber meist zwei bis drei. Eine gute Frage nennt auch das Niveau, dann passt die Sprache.",
    "**Zu Aufgabe 2, Vergleiche (II) und Erkläre (II):** Meist ist Antwort B genauer und passt besser zu Form und Niveau. Die Erklärung nennt den Baustein: Ein Modell hat kein Bild von dir und ergänzt Fehlendes mit dem Wahrscheinlichen. Es gibt keine Musterantwort, die Antworten wechseln.",
    "**Zu Aufgabe 3, Überprüfe (III), Entwickle (III) und Beurteile (III):** Gut geprüft heißt: Zahl oder Name in einer zweiten Quelle suchen. Das Urteil sagt, ob die Antwort brauchbar ist, und nennt den Grund. Wer etwas nicht erklären kann, hat es nicht verstanden: Dann hilft Nachfragen mehr als Abschreiben.",
    "**Zum Zusatz, Begründe (III):** Der Zusatz hält das Denken bei dir: Die KI gibt einen Anstoß und nimmt die Lösung nicht vorweg.",
  ],
  diff: {
    leichtPunkte: ["Prompt A ist vorgegeben", "Nur einen Baustein ergänzen", "Lückensatz zur Antwort"],
    schwerPunkte: ["Prompt B von null schreiben", "Alle fünf Bausteine nutzen", "Zwei Nachfragen testen"],
    leicht: "Prompt A ist vorgegeben, du ergänzt nur einen Baustein, etwa das Format. Bei **Nenne** (I) bleiben: „Die Antwort B ist besser, weil ___.“",
    schwer: "Prompt B mit allen fünf Bausteinen schreiben, zwei Nachfragen testen und **beurteilen** (III), welche die Antwort stärker verbessert.",
  },
  sicherung: {
    kurz: "Die erste Antwort ist ein Entwurf: nachfragen, prüfen, erst dann nutzen.",
    visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "pencil", text: "Frage mit Bausteinen", sub: "Rolle, Format, Grenzen"},
      {icon: "message-circle", text: "Antwort", sub: "Entwurf"},
      {icon: "search", text: "Prüfen", sub: "dann nutzen", farbe: "gruen"}]},
    p: ["Sammle an der Tafel, welche Bausteine am meisten verändert haben. Verbinde mit KI 1 der KI-Reihe: Ein genauer Prompt lässt weniger Raum zum Raten."],
    merke: "Erst prüfen, dann nutzen. Was du nicht erklären kannst, hast du nicht verstanden."},
  reflexionMuster: [["Eigene Auswahl: Ziel, Niveau, Länge, Format oder Beispiel", "Fehlt der Baustein, muss das Modell raten", "Eine Nachfrage verbessert die Antwort"], ["Erst selbst versuchen, dann Rückmeldung holen", "Nach Erklärungen oder Übungsaufgaben fragen, nicht nach der fertigen Lösung", "Die Antwort prüfen und in eigenen Worten wiedergeben"], ["Zahlen, Namen und Quellen", "Eine zweite unabhängige Quelle suchen", "Ein sicherer Ton ist kein Beweis"]],
  reflexionKurz: "Drei Fragen: Bausteine, Trainer, Prüfen.",
  skala: ["knappe Fragen", "klare Fragen", "Wie fragst du künftig?"],
  reflexion: [
    "Welchen Baustein vergisst du am häufigsten?",
    "Wie nutzt du die KI als Trainer statt als Lösungsmaschine?",
    "Was prüfst du, bevor du eine Antwort weitergibst?",
  ],
  mitnehmen: [
    "Das Modell ergänzt Fehlendes mit dem Üblichen. Sag, was du willst, in welchem Format und für welches Niveau.",
    "Nutze die KI als Trainer: erklären, abfragen, Feedback geben. Die Arbeit bleibt bei dir.",
    "Frage nach, wenn die Antwort nicht passt, und prüfe Zahlen, Namen und Quellen, bevor du sie benutzt.",
  ],
  quiz: [
    {frage: "Du willst für ein Referat eine Erklärung zur Windkraft. Welcher Prompt bekommt meist die bessere Antwort?",
     optionen: ["Erkläre Windkraft, so ausführlich und schwer wie möglich", "Sag alles, was du über Energie und Windkraft weißt", "Windkraft, bitte schnell und möglichst kurz antworten", "Erkläre Windkraft für Klasse 9 in sechs Sätzen"],
     richtig: 3, abschnitt: "Lösungshinweise",
     erklaerung: "Die bessere Frage nennt Länge und Niveau. Das Modell muss weniger raten."},
    {frage: "Die erste Antwort der KI ist zu allgemein. Was machst du?",
     optionen: ["Nachfragen, etwa: Gib ein Beispiel aus dem Fußball", "Die Frage in Großbuchstaben noch einmal senden", "Die Antwort so übernehmen, denn mehr kann das Modell nicht", "Ein anderes Thema wählen, bei dem es besser klappt"],
     richtig: 0, abschnitt: "Erarbeitung (20 Minuten)",
     erklaerung: "Die erste Antwort ist ein Entwurf, eine Nachfrage macht sie besser."},
    {frage: "Die KI nennt für dein Referat eine Jahreszahl in sehr sicherem Ton. Was tust du?",
     optionen: ["Ich übernehme sie, denn der sichere Ton spricht für sie", "Ich frage die KI, ob sie die Zahl wirklich weiß", "Ich suche die Zahl in einer zweiten, unabhängigen Quelle", "Ich lasse die Zahl weg und schreibe gar nichts dazu"],
     richtig: 2, abschnitt: "Lösungshinweise",
     erklaerung: "Ein sicherer Ton beweist nichts. Prüfe Zahlen, Namen und Quellen."},
  ],
  weiter: ["prompts-fuer-schueler", "medien-stunde-7", "prompting", "chat"],
});

/* ------------------------------------------------------------------ Einheit 7 */
S["medien-stunde-7"] = einheit({
  nav: "Medien 7: KI in deinem Alltag", titel: "Medien-Einheit 7: KI in deinem Alltag, Poster-Runde", symbol: "smartphone", icon: "layout-dashboard",
  downloads: blaetter("", 7),
  lernziele: [
    "Du kannst fünf Stellen in deinem Tag nennen, an denen KI arbeitet.",
    "Du kannst erklären, wie ein Feed oder eine Playlist grob entscheidet.",
    "Du kannst deinen Feed bewusst beeinflussen.",
  ],
  kurz: "45 oder 90 Minuten für Klasse 8, ohne Gerät: Die Gruppen zeichnen Poster zu KI in ihrem Tag und beurteilen sie in einer Runde.",
  zusammenfassung: "Medien-Einheit 7 für Klasse 8: Wo steckt KI in meinem Tag? Die Gruppen gestalten ein Poster, erklären, wie ein Feed entscheidet, und beurteilen in einer Poster-Runde, was wirklich KI ist. Kein Video nötig, ohne Kamera.",
  zeitP: ["Vierergruppen, ein Blatt A3 und Stifte je Gruppe, kein Gerät nötig. Grundlage ist die Seite {{schueler-alltag-ki|KI in deinem Alltag}}. Diese Einheit hat kein Video, der Einstieg läuft über die Beispiele."],
  vorbereitung: "Vorbereitung: A3-Blätter, Stifte und Klebepunkte bereitlegen. Hänge die fertigen Poster im Raum auf, für die Runde.",
  einstieg: {
    kurz: "Die Frage an die Klasse: Wo steckt KI schon in deinem Tag? Beispiele an der Tafel sammeln.",
    visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "video", text: "Feed", sub: "Videos für dich"},
      {icon: "music", text: "Playlist", sub: "Songs für dich"},
      {icon: "smile", text: "Filter", sub: "Effekte im Gesicht"},
      {icon: "languages", text: "Übersetzer", sub: "Text in andere Sprache"},
      {icon: "type", text: "Tastatur", sub: "sagt Wörter voraus"},
      {icon: "gamepad-2", text: "Spiele", sub: "Gruppen nach Können"}]},
    p: ["Sammle Beispiele und frage: Woran erkennst du, dass es KI ist? Nicht alles, was schlau wirkt, ist KI: Manche Spielgegner folgen festen Regeln. KI hat aus Beispielen gelernt."]},
  erarbeitung: {
    kurz: "Drei Schritte: Poster zeichnen (6 Minuten), Feed erklären (8 Minuten), Poster-Runde (6 Minuten).",
    visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "layout-dashboard", text: "Poster", sub: "Mein Tag mit KI"},
      {icon: "radio", text: "Feed", sub: "wie er entscheidet"},
      {icon: "route", text: "Runde", sub: "Poster ansehen", farbe: "gruen"}]},
    p: ["Poster: ein Zeitstrahl von morgens bis abends mit KI-Stellen. Die Runde geht reihum, jede Gruppe klebt Punkte an Beispiele, bei denen sie zweifelt, ob es KI ist."]},
  aufgaben: [
    {ort: "Mein Tag", sozial: "Gruppe zu viert", niveau: "Basis", icon: "layout-dashboard", tipps: ["Gehe deinen Tag durch: Aufstehen, Schulweg, Pause, Freizeit.", "Denke an Feed, Playlist, Filter, Übersetzer und Tastatur."],
     text: "**Nenne** (I) fünf Stellen in deinem Tag, an denen KI arbeitet, und zeichne sie auf einem Poster als Zeitstrahl von morgens bis abends."},
    {ort: "Wie der Feed entscheidet", sozial: "Partnerarbeit", niveau: "Standard", icon: "radio", tipps: ["Ein Feed zählt, was du ansiehst, likest, teilst und wie lange du bleibst.", "Suche in deiner App einen Knopf wie „Nicht interessiert“."],
     text: "**Erkläre** (II), woran ein Feed oder eine Playlist erkennt, was dir gefällt. **Beschreibe** (I) eine Einstellung, mit der du den Feed lenkst."},
    {ort: "Poster-Runde", sozial: "Gruppe zu viert", niveau: "Herausforderung", icon: "route", tipps: ["KI hat aus Beispielen gelernt, eine feste Regel hat jemand aufgeschrieben.", "Frage bei jedem Beispiel: Wer hat hier die Regeln gemacht?"],
     text: "**Beurteile** (III) an einem fremden Poster, ob alle Beispiele wirklich KI sind. Gib zu jedem Urteil den Grund an und nenne das Beispiel, bei dem du zweifelst: Hat die Software aus Beispielen gelernt, oder folgt sie festen Regeln?"},
  ],
  zusatz: {sozial: "Einzelarbeit", niveau: "Herausforderung", text: "**Entwickle** (III) eine Regel für deinen eigenen Feed in einem Satz und **vergleiche** (II) sie mit der Regel deiner Sitznachbarin oder deines Sitznachbarn."},
  loesKurz: "Ein Feed rät, was dich festhält, nicht, was gut für dich ist. Du kannst ihn lenken.",
  loesVisual: {typ: "ablauf", paket: true, schritte: [
    {icon: "eye", text: "Du siehst an", sub: "likest, teilst"},
    {icon: "brain-circuit", text: "Modell schätzt", sub: "was dich festhält"},
    {icon: "radio", text: "Feed zeigt mehr", sub: "vom Gleichen", farbe: "orange"}]},
  loesungen: [
    "**Zu Aufgabe 1, Nenne (I):** Genannt werden fünf Stellen, zum Beispiel Feed, Playlist, Kamerafilter, Übersetzer, Tastaturvorschläge, Spielgegner. Das sind dieselben Verfahren wie im Labor, nur groß und im Hintergrund.",
    "**Zu Aufgabe 2, Erkläre (II) und Beschreibe (I):** Plattformen erklären öffentlich, dass Empfehlungen auf Signalen beruhen: was du ansiehst, likest, teilst oder kommentierst, Angaben zum Video und Geräteeinstellungen. Der Feed sagt, was dich wahrscheinlich festhält. Einstellungen: „Nicht interessiert“, „Weniger davon“, Verlauf zurücksetzen.",
    "**Zu Aufgabe 3, Beurteile (III):** Der Unterschied: Hat die Software aus Beispielen gelernt, oder hat jemand die Regeln aufgeschrieben? Bei manchen Beispielen weiß man es nicht, denn Anbieter erklären das oft nicht genau. Dieses Ergebnis ist zulässig.",
    "**Zum Zusatz, Entwickle (III) und Vergleiche (II):** Gute Regeln sind kurz, zum Beispiel „Ich wähle bei Videos, die ich nicht mehr sehen will, immer Nicht interessiert.“",
  ],
  diff: {
    leichtPunkte: ["Beispiele sind vorgegeben", "Poster mit Symbolen", "Satz zum Feed ergänzen"],
    schwerPunkte: ["Eigene Beispiele finden", "KI oder Regel begründen", "Feed-Regel prüfen"],
    leicht: "Eine Bildkarte mit sechs Beispielen liegt bereit. Bei **Nenne** (I) und **Beschreibe** (I) bleiben: „Der Feed zeigt mir ___, weil ___.“",
    schwer: "Die Gruppe sucht Beispiele, bei denen unklar ist, ob KI im Spiel ist, und **beurteilt** (III), was man dafür wissen müsste.",
  },
  sicherung: {
    kurz: "KI steckt dort, wo aus Daten gelernt wird: im Feed, in Playlists, Filtern, Übersetzern und Tastaturen.",
    visual: {typ: "kreis", mitte: "Mein Tag",
     knoten: [{icon: "eye", text: "Du handelst"}, {icon: "database", text: "Daten entstehen"}, {icon: "brain-circuit", text: "Modell lernt"}, {icon: "radio", text: "Vorschlag"}]},
    p: ["Ordne die Posterbeispiele den vier Stationen des Kreises zu. Halte fest: Nicht alles, was schlau wirkt, ist KI, und dein Feed ist kein Schicksal."],
    merke: "Dein Feed ist kein Schicksal. Du kannst ihn beeinflussen, bewusst oder durch Einstellungen."},
  reflexionMuster: [["Eigene Erfahrung, es gibt keine Musterantwort", "Der Feed verstärkt, was man ansieht und wie lange man bleibt", "Gegensteuern: bewusst anders klicken, „Nicht interessiert“ wählen"], ["Der Feed lernt aus dem neuen Verhalten und wird breiter und unruhiger", "Er passt dann weniger genau auf dich, weil er weniger Muster findet", "Das zeigt: Dein Verhalten steuert den Feed"], ["Konkrete Änderung, die man heute umsetzen kann: „Nicht interessiert“ wählen, Zeitlimit setzen, Empfehlungen prüfen", "Wichtig ist ein Schritt, den man wirklich tut"]],
  reflexionKurz: "Drei Fragen: Feed, Gewohnheit, Einstellungen.",
  skala: ["Feed bestimmt mich", "ich bestimme den Feed", "Wer steuert wen?"],
  reflexion: [
    "Hast du schon einmal gemerkt, dass dein Feed zu einem Thema abdriftet?",
    "Wie wäre dein Feed, wenn du nur noch Neues anschauen würdest?",
    "Welche Einstellung änderst du heute?",
  ],
  mitnehmen: [
    "KI steckt in Feeds, Playlists, Filtern, Übersetzern und Tastaturen: überall, wo aus Daten gelernt wird.",
    "Ein Feed rät, was dich festhält, nicht, was gut für dich ist.",
    "Du kannst Empfehlungen lenken: Nicht interessiert wählen, Themen filtern, Verlauf zurücksetzen.",
  ],
  quiz: [
    {frage: "Woran erkennst du, dass eine Software KI nutzt und nicht nur feste Regeln?",
     optionen: ["Sie wirkt besonders schlau und antwortet sehr schnell", "Sie hat aus Beispielen gelernt, statt Regeln abzuarbeiten", "Sie läuft auf einem Smartphone und braucht Internet", "Sie wirbt mit dem Wort KI oder einem Sternsymbol"],
     richtig: 1, abschnitt: "Lösungshinweise",
     erklaerung: "Der Unterschied: aus Beispielen gelernt oder von Hand geschriebene Regeln."},
    {frage: "Ein Kurzvideo-Feed zeigt dir plötzlich fast nur noch Videos zu einem Thema. Wonach wählt der Feed vor allem aus?",
     optionen: ["Danach, was deine Lehrkraft für dich empfiehlt", "Danach, was für dich gerade am gesündesten ist", "Danach, welche Videos schon seit den meisten Jahren online sind", "Danach, was du ansiehst, likest und wie lange du bleibst"],
     richtig: 3, abschnitt: "Erarbeitung (20 Minuten)",
     erklaerung: "Der Feed rät, was dich wahrscheinlich festhält. Das erklärt, warum er zu einem Thema abdriften kann."},
    {frage: "Du willst ein Thema im Feed nicht mehr sehen. Was hilft am meisten?",
     optionen: ["Nicht interessiert wählen und bewusst anders klicken", "Das Thema ansehen, um dem Feed zu zeigen, dass es nervt", "Nichts tun, denn der Feed entscheidet ganz allein", "Das Handy für eine Stunde ausschalten und neu starten"],
     richtig: 0, abschnitt: "Lösungshinweise",
     erklaerung: "Du kannst dem Feed beibringen, was du nicht sehen willst."},
  ],
  weiter: ["schueler-alltag-ki", "elternabend", "schule-lehrkraefte", "ml"],
});

/* ------------------------------------------------------------------ Elternabend */
S["elternabend"] = {
  nav: "Elternabend", typ: "lektion", gruppe: "Für die Schule", titel: "Elternabend: Info-Blatt, Gesprächsleitfaden, Fragen und Antworten", symbol: "users",
  downloads: [
    {text: "Info-Blatt für Eltern", sub: "1 Seite A4, Sie-Form, zum Austeilen", href: "/static/materialien/elternabend-infoblatt.pdf"},
    {text: "Leitfaden und Fragen für Lehrkräfte", sub: "1 Seite A4, nur für Lehrkräfte", href: "/static/materialien/elternabend-leitfaden.pdf"},
  ],
  lernziele: [
    "Sie können Eltern in fünf Minuten erklären, was die Klasse mit KI und Medienkompetenz macht.",
    "Sie können die häufigsten Fragen von Eltern kurz und ehrlich beantworten.",
    "Sie wissen, wo die Grenzen liegen: kein Rechtsrat, die Schule entscheidet.",
  ],
  kurz: "Ein Info-Blatt zum Austeilen, ein Gesprächsleitfaden für zehn Minuten und Antworten auf typische Elternfragen.",
  zusammenfassung: "Paket für den Elternabend zu KI und Medienkompetenz in Klasse 8: Info-Blatt (eine Seite A4, Sie-Form), Gesprächsleitfaden für Lehrkräfte und Fragen mit Antworten. Alle Angaben stammen aus den Seiten des KI-Labors, Stand 22.11.2026, kein Rechtsrat.",
  abschnitte: [
    {h: "Das Info-Blatt für Eltern",
     kurz: "Eine Seite A4 zum Austeilen: Worum es geht, was Ihr Kind tut, welche Daten, was zu Hause hilft.",
     visual: {typ: "raster", spalten: 4, zellen: [
      {icon: "school", text: "Worum", sub: "Medienkompetenz"},
      {icon: "mouse", text: "Was", sub: "Ihr Kind tut"},
      {icon: "shield-check", text: "Daten", sub: "nur technisch nötig"},
      {icon: "house", text: "Zu Hause", sub: "drei Gespräche"}]},
     liste: [
      "**Worum es geht:** Ihre Kinder lernen in sieben Einheiten (gedacht ab Klasse 8), KI zu erkennen, Quellen zu prüfen und KI fair zu nutzen: Echt oder KI, Quellen prüfen, Fake News und Deepfakes, KI und Hausaufgaben, Datenschutz, gute Fragen und KI im Alltag.",
      "**Was Ihr Kind tut:** Es sortiert Bildkarten, prüft Behauptungen, entwickelt Regeln für Hausaufgaben und schreibt bessere Fragen an ein Sprachmodell. Alle Aufgaben kommen ohne Kamera und Mikrofon aus.",
      "**Welche Daten:** Das KI-Labor braucht kein Konto, zeigt keine Werbung und speichert Chat-Eingaben nicht dauerhaft. Technisch nötig sind ein kleines Cookie, einige Merkzettel im Browser und die üblichen Verbindungsdaten des Servers. Verbindlich ist die Datenschutzerklärung des Betreibers.",
      "**Zu Hause:** Reden Sie mit Ihrem Kind über drei Fragen: „Woran würdest du das prüfen?“, „Was hast du selbst gemacht, was die KI?“, „Wo hast du zuletzt auf Akzeptieren geklickt?“ Vereinbaren Sie ein Codewort für Notfallanrufe, denn Stimmen lassen sich nachbauen.",
      "**Wichtig:** Ob und wie das Labor im Unterricht eingesetzt wird, entscheidet die Schule. Dieses Blatt ist kein Rechtsrat.",
     ]},
    {h: "Der Gesprächsleitfaden",
     kurz: "Zehn Minuten am Elternabend: Begrüßung, Beispiel, Datenfragen, Fragen, Abschluss.",
     visual: {typ: "zeitachse", punkte: [
      {t: "2 Min", text: "Begrüßung", icon: "hand"},
      {t: "3 Min", text: "Beispiel", icon: "images"},
      {t: "2 Min", text: "Daten", icon: "shield-check"},
      {t: "3 Min", text: "Fragen", icon: "messages-square"}]},
     liste: [
      "**Begrüßung (2 Minuten):** Nennen Sie das Ziel: Die Kinder sollen KI verstehen, nicht nur benutzen. Das Labor ist ein Lernangebot, kein Werkzeug für Hausaufgaben.",
      "**Beispiel (3 Minuten):** Zeigen Sie zwei Bildkarten aus dem Kartenset `bildkarten-echt-oder-ki.pdf` (Download auf der Seite Medien 1, Abschnitt Zum Ausdrucken) und fragen Sie die Eltern, welche echt ist. Die Eltern merken: Sichere Erkennung gibt es nicht, darum üben die Kinder das Prüfen.",
      "**Daten (2 Minuten):** Sagen Sie klar: kein Konto, keine Namensabfrage, keine dauerhafte Speicherung der Eingaben. Kamera und Mikrofon sind im Unterricht nicht vorgesehen. Verweisen Sie auf die Datenschutzerklärung.",
      "**Fragen (3 Minuten):** Beantworten Sie mit der Tabelle unten. Was Sie nicht wissen, sagen Sie offen und verweisen an die Schulleitung oder den Betreiber.",
      "**Abschluss:** Geben Sie das Info-Blatt aus und nennen Sie die Seite für zu Hause: KI zu Hause, Was Eltern wissen sollten.",
     ]},
    {h: "Fragen und Antworten",
     kurz: "Acht Fragen von Eltern, jeweils mit einer Kurzantwort aus den Seiten des Labors.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "shield", text: "Ist das sicher?", sub: "wenig Daten"},
      {icon: "camera", text: "Kamera?", sub: "nicht im Unterricht"},
      {icon: "pencil", text: "Hausaufgaben?", sub: "Schule entscheidet"}]},
     tabelle: {
      beschriftung: "Fragen von Eltern",
      kopf: ["Frage", "Kurzantwort"],
      zeilen: [
       ["Ist das Labor sicher für Kinder?", "Zum Lernen ja: kein Konto, keine Werbung, Chat-Eingaben werden nicht dauerhaft gespeichert. Es heißt nicht, dass jede Antwort des Chats passt."],
       ["Wird mein Kind gefilmt oder aufgenommen?", "Nein. Im Unterricht werden weder Kamera noch Mikrofon noch Gesichtserkennung genutzt."],
       ["Welche Daten werden gespeichert?", "Ein kleines Sitzungs-Cookie, Merkzettel im Browser ohne Namen und Texte, Verbindungsdaten des Servers. Einzelheiten: Datenschutzerklärung."],
       ["Darf mein Kind damit Hausaufgaben machen?", "Das Labor dient dem Verstehen. Was bei Hausaufgaben erlaubt ist, legt die Schule fest. Im Zweifel vorher fragen und die Hilfe angeben."],
       ["Gibt es einen Jugendschutzfilter?", "Nein, das Labor schaltet keinen eigenen Filter vor das Sprachmodell. Jüngere nutzen den Chat nur in Begleitung."],
       ["Muss mein Kind etwas anmelden oder angeben?", "Nein. Es gibt kein Konto und keine Abfrage von Name, Alter oder Klasse."],
       ["Was ist mit Deepfakes und Mobbing?", "Die Einheit zeigt keine Anleitung zum Fälschen. Betroffene sichern Beweise und holen Hilfe, zum Beispiel bei der Nummer gegen Kummer (116 111) oder JUUUPORT."],
       ["Wer ist verantwortlich?", "Betreiber ist Daniel Alisch, Impressum und Datenschutzerklärung stehen auf daniel-alisch.site. Über den Einsatz an Ihrer Schule entscheidet die Schule."],
      ],
     }},
  ],
  mitnehmen: [
    "Das Info-Blatt passt auf eine Seite und verspricht nicht mehr, als die Seiten des Labors belegen.",
    "Sichere Erkennung von KI-Bildern gibt es nicht. Darum üben die Kinder das Prüfen.",
    "Kein Rechtsrat: Die Schule entscheidet über den Einsatz, die Datenschutzerklärung des Betreibers ist verbindlich.",
  ],
  grenzen: [
    "Keine Rechtsberatung. Stand 22.11.2026.",
    "Das Labor hat keinen Jugendschutzfilter, auf den man sich verlassen kann. Siehe {{eltern-zuhause|KI zu Hause}}.",
  ],
  weiter: ["schule-eltern", "eltern-zuhause", "schule-schulleitung", "medien-stunde-1"],
};

/* Erklärvideo je Einheit (Medien 7 hat keines) und die gemeinsamen Abschnitte Einzelstunde oder Doppelstunde und Lehrplanbezug (content-schule.js). */
const VIDEO = {1: "echt-oder-ki", 2: "quellen-pruefen", 3: "fake-news-deepfakes", 4: "ki-hausaufgaben-fair", 5: "datenschutz-im-alltag", 6: "prompts-fuer-schueler"};
for (let n = 1; n <= 7; n++) {
  const id = "medien-stunde-" + n;
  if (VIDEO[n]) S[id].videos = [VIDEO[n]];
  window.KLSchule.ergaenzeEinheit(S[id], id);
}

INHALT.registriere({
  seiten: S,
  gruppen: [{name: "Für die Schule", seiten: ["medien-stunde-1", "medien-stunde-2", "medien-stunde-3", "medien-stunde-4", "medien-stunde-5", "medien-stunde-6", "medien-stunde-7", "elternabend"]}],
});
})();
