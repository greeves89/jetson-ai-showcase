/* Inhalte des KI-Labors: Seiten, Glossar, Landkarte, Branchen.
   Markierungen in Texten:
     **fett**          [[schluessel]] oder [[schluessel|Anzeige]]  Glossarbegriff mit Erklaerung beim Daraufzeigen
     {{seiten-id|Text}} Link auf eine andere Seite              `code`  Schreibmaschinenschrift  */
window.INHALT = {

gruppen: [
  {name: "Start", seiten: ["start"]},
  {name: "Grundlagen", seiten: ["karte", "ml", "genki", "robotik", "business"]},
  {name: "Sehen", seiten: ["gesicht", "objekt", "anlernen"]},
  {name: "Sprache", seiten: ["chat", "whisper"]},
  {name: "Wissen und RAG", seiten: ["rag"]},
  {name: "Agenten", seiten: ["agent"]},
  {name: "Daten und Prognosen", seiten: []},
  {name: "KI im Betrieb", seiten: []},
  {name: "Business-Use-Cases", seiten: []},
  {name: "Der Rechner dahinter", seiten: ["hardware"]},
],

faehigkeiten: {
  sehen: "Sehen", sprache: "Sprache", erzeugen: "Erzeugen", wissen: "Wissen", handeln: "Handeln",
},

seiten: {

start: {
  nav: "Start", typ: "start", titel: "KI verstehen, indem du sie ausprobierst", symbol: "start",
  kurz: "Hier erlebst du [[ki|künstliche Intelligenz]] live: Fragen stellen, Bilder erkennen lassen, Sprache verstehen. Alles läuft auf einem kleinen Spezialrechner, den du dabei arbeiten siehst. Kostenlos und ohne Anmeldung.",
  anfangen: [
    {id: "karte", h: "Verstehen, was KI ist", p: "Eine Landkarte der Begriffe, in etwa zwei Minuten gelesen."},
    {id: "chat", h: "Selbst ausprobieren", p: "Stelle einem Sprachmodell eine Frage und sieh Wort für Wort, wie es antwortet. Dafür brauchst du keine Kamera."},
    {id: "business", h: "Sehen, was es im Alltag bringt", p: "Beispiele aus Betrieben und die drei Fragen, die vor jedem Einsatz stehen."},
  ],
  entscheider: {
    titel: "In 15 Minuten: Was bringt KI meinem Betrieb?",
    lead: "Vier feste Seiten für alle, die entscheiden müssen und keine Technik lernen wollen. Die Zeiten sind Richtwerte.",
    schritte: [
      {id: "karte", h: "Was ist KI, und was nicht?", min: 2},
      {id: "chat", h: "Ein Sprachmodell selbst befragen", min: 5},
      {id: "business", h: "Wo KI im Betrieb hilft", min: 3},
      {id: "ki-einfuehrung", h: "Wie du den Einstieg planst", min: 5},
    ],
  },
  jetson: "Ein Jetson ist ein kleiner Spezialrechner für KI-Rechnungen, etwa so groß wie eine Handfläche. Er braucht wenig Strom und steht hier im Hintergrund, damit du bei jedem Versuch siehst, was er gerade tut.",
  pfad: [
    {id: "karte", h: "Was ist KI überhaupt?", p: "Eine Landkarte der Begriffe: [[ki|künstliche Intelligenz]], [[ml|maschinelles Lernen]], [[dl|Deep Learning]], generative KI, Robotik."},
    {id: "ml", h: "Wie lernt eine Maschine?", p: "Du setzt Punkte auf eine Fläche und siehst, wie ein Modell daraus Regeln ableitet."},
    {id: "gesicht", h: "Sehen: Gesichter und Objekte", p: "Deine Webcam, der Jetson rechnet, du siehst jeden Schritt der Verarbeitung mit seiner Zeit."},
    {id: "chat", h: "Sprache: Chat, Dokumente, Agenten", p: "Ein Sprachmodell wählt Wort für Wort. Du stellst die [[temperatur|Zufälligkeit]] ein und siehst die einzelnen [[token|Tokens]]."},
    {id: "business", h: "Wo hilft das im Alltag einer Firma?", p: "Branchen, Einsatzfelder und die drei Fragen, die vor jedem Einsatz stehen sollten."},
  ],
  bereiche: {
    "Grundlagen": {symbol: "karte", satz: "Was KI ist, wie Maschinen lernen und wo die Grenzen liegen."},
    "Sehen": {symbol: "gesicht", satz: "Wie ein Computer Bilder versteht: Gesichter, Objekte und eigene Modelle."},
    "Sprache": {symbol: "chat", satz: "Sprachmodelle im Chat, Sprache zu Text und gutes Fragen."},
    "Wissen und RAG": {symbol: "rag", satz: "Antworten aus eigenen Dokumenten, vom Embedding bis zur Messung."},
    "Agenten": {symbol: "agent", satz: "Modelle, die planen, Werkzeuge nutzen und Aufgaben erledigen."},
    "Daten und Prognosen": {symbol: "trending-up", satz: "Entscheidungsbäume, Zeitreihen und Auffälliges in Zahlen."},
    "KI im Betrieb": {symbol: "gauge", satz: "Vom Prototyp zum Betrieb: Kosten, Energie und Einführung."},
    "Business-Use-Cases": {symbol: "business", satz: "Konkrete Einsätze aus Fertigung, Handel, Büro und Sicherheit."},
    "Der Rechner dahinter": {symbol: "hardware", satz: "Der kleine Rechner hinter allem, mit Messwerten in Echtzeit und der Antwort auf: Ist das sicher?"},
  },
  datenschutz: "Kamera und Mikrofon starten nur, wenn du zustimmst. Bilder und Aufnahmen werden nicht gespeichert. Texte, die du ins Dokumenten-Labor einfügst, bleiben kurz im Arbeitsspeicher und verfallen nach 30 Minuten Ruhe.",
},

/* ------------------------------------------------------------------ Grundlagen */

karte: {
  typ: "lektion", gruppe: "Grundlagen", nr: 1, titel: "Was ist KI?", symbol: "karte", video: "was-ist-ki",
  lernziele: ["Du kannst in zwei Sätzen erklären, was KI ist und was nicht.", "Du kannst KI, maschinelles Lernen und Deep Learning einordnen.", "Du kannst an einem Beispiel zeigen, warum die meiste KI nur eine Aufgabe gut kann."],
  kurz: "Ein Oberbegriff, unter dem sehr verschiedene Verfahren stecken. Diese Karte sortiert sie.",
  widget: "landkarte",
  abschnitte: [
    {h: "Die kürzeste Definition",
     kurz: "KI löst Aufgaben, die sonst Denken brauchen. Der Begriff ist alt, die Technik wechselte mehrmals.",
     visual: {typ: "zeitachse", punkte: [
      {t: "1956", text: "Der Begriff entsteht", icon: "book-open"},
      {t: "1997", text: "Schachcomputer schlägt Weltmeister", icon: "trophy"},
      {t: "2012", text: "Tiefe Netze gewinnen Bilderkennung", icon: "image"},
      {t: "2017", text: "Transformer erscheint", icon: "layers"},
      {t: "2022", text: "Chatbots für alle", icon: "message-square"}]},
     p: [
      "[[ki|Künstliche Intelligenz]] ist Software, die Aufgaben löst, für die wir sonst menschliches Denken brauchen: etwas erkennen, Sprache verstehen, eine Entscheidung treffen, etwas Neues erzeugen. Der Begriff stammt aus den 1950er Jahren. Die Technik dahinter hat sich seitdem mehrmals grundlegend geändert.",
    ]},
    {h: "Die meiste KI ist spezialisiert",
     kurz: "Die meisten Systeme können genau ihre Aufgabe. Eine KI, die alles kann, ist ein Forschungsziel.",
     visual: {typ: "skala", links: "Eine Aufgabe", rechts: "Alles wie ein Mensch", marker: 0.08, label: "Heutige KI"},
     p: [
      "Die meisten Systeme können genau ihre Aufgabe: Gesichter finden, ein Brettspiel spielen. Große Sprachmodelle sind breiter einsetzbar, denn dasselbe Modell fasst zusammen, übersetzt und schreibt Code. Eine allgemeine Intelligenz, die alles kann, was ein Mensch kann, ist das nicht. Wenn jemand von allgemeiner KI spricht, meint er ein Forschungsziel, kein Produkt.",
    ]},
    {h: "So hängen die Begriffe zusammen",
     kurz: "Regeln schreibt ein Mensch, ein lernendes System findet sie selbst in Beispielen.",
     visual: {typ: "vergleich",
      links: {titel: "Regelbasiert", icon: "list-checks", farbe: "grau", punkte: ["Mensch schreibt Wenn-dann", "Lernt nichts dazu", "Gut bei stabilen Regeln"]},
      rechts: {titel: "Maschinelles Lernen", icon: "brain-circuit", farbe: "akzent", punkte: ["Muster aus Beispielen", "Regeln stecken im Modell", "Gut bei Mustern"]}},
     p: [
      "Die Karte oben zeigt die Verschachtelung. Jeder innere Bereich ist eine Spezialisierung des äußeren: [[ml|Maschinelles Lernen]] ist ein Teil der KI, [[dl|Deep Learning]] ein Teil des maschinellen Lernens, generative KI ein Teil von Deep Learning. Regelbasierte Systeme sind der ältere Weg, und die Robotik steht daneben, weil sie KI als Baustein nutzt, aber auch Mechanik und Regelungstechnik braucht.",
      "Tippe auf einen Bereich, dann siehst du rechts, was er bedeutet und wo du ihn in diesem Labor ausprobieren kannst.",
    ]},
    {h: "Fünf Bereiche statt vieler Fachwörter",
     kurz: "Frag nach dem Bereich, nicht nach dem Verfahren: Sehen, Sprache, Wissen, Handeln, Erzeugen.",
     visual: {typ: "raster", spalten: 5, zellen: [
      {icon: "eye", text: "Sehen", sub: "Bilder lesen"},
      {icon: "message-square", text: "Sprache", sub: "Text und Ton"},
      {icon: "book-open", text: "Wissen", sub: "Nachschlagen"},
      {icon: "wrench", text: "Handeln", sub: "Werkzeuge nutzen"},
      {icon: "wand-sparkles", text: "Erzeugen", sub: "Text, Bild, Ton"}]},
     p: [
      "Wer wissen will, was eine KI für ihn tun kann, fragt besser nach dem Einsatzbereich als nach dem Verfahren:",
    ], liste: [
      "**Sehen:** Bilder und Videos auswerten. Labor {{gesicht|Gesichter}}, {{objekt|Objekte}}, {{anlernen|Anlernen}}.",
      "**Sprache:** Text und Ton verstehen und formulieren. Labor {{chat|Chat}} und {{whisper|Sprache zu Text}}.",
      "**Wissen:** gezielt in eigenen Dokumenten nachschlagen und Quellen nennen. Labor {{rag|RAG}}.",
      "**Handeln:** Werkzeuge benutzen und in Schritten vorgehen. Labor {{agent|Agent}} und {{robotik|Robotik}}.",
      "**Erzeugen:** neue Texte, Bilder und Töne herstellen. Labor {{chat|Chat}}.",
    ]},
  ],
  mitnehmen: [
    "KI ist ein Sammelbegriff, kein einzelnes Verfahren.",
    "Die meiste KI ist auf eine Aufgabe spezialisiert. Sprachmodelle sind breiter, aber keine allgemeine Intelligenz.",
    "Maschinelles Lernen ist der wichtigste Teil, aber nicht der einzige.",
  ],
  weiter: ["ml", "genki", "robotik"],
},

ml: {
  typ: "lektion", gruppe: "Grundlagen", nr: 2, titel: "Maschinelles Lernen", symbol: "ml", video: "maschinelles-lernen",
  lernziele: ["Du kannst erklären, warum eine Maschine aus Beispielen lernt, statt Regeln zu bekommen.", "Du kannst Training und Inferenz unterscheiden.", "Du kannst sagen, was passiert, wenn die Beispiele schlecht sind."],
  kurz: "Statt Regeln zu schreiben, zeigst du Beispiele. Das Verfahren findet das Muster selbst.",
  widget: "knn",
  abschnitte: [
    {h: "Lernen statt programmieren",
     kurz: "Du zeigst Beispiele mit Etikett, das Verfahren findet das Muster. Es steckt danach als Zahlen im Modell.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "mail", text: "Beispiele", sub: "Spam oder nicht"},
      {icon: "sliders-horizontal", text: "Verfahren", sub: "sucht Unterschiede"},
      {icon: "brain-circuit", text: "Modell", sub: "Muster als Zahlen", farbe: "gruen"}]},
     p: [
      "Ein Spamfilter mit festen Regeln („enthält das Wort Gewinn, dann Spam“) ist schnell überholt. Ein lernendes Verfahren bekommt stattdessen viele E-Mails, jede mit dem Etikett „Spam“ oder „kein Spam“, und findet selbst heraus, woran man beide unterscheidet. Die Regeln stecken danach im [[modell|Modell]], als eine große Menge Zahlen.",
    ]},
    {h: "Zwei Phasen: Training und Inferenz",
     kurz: "Training passiert einmal und ist teuer. Inferenz passiert ständig und ist günstig.",
     visual: {typ: "vergleich",
      links: {titel: "Training", icon: "graduation-cap", farbe: "orange", punkte: ["Viele Beispiele", "Rechenintensiv", "Einmal, im Rechenzentrum"]},
      rechts: {titel: "Inferenz", icon: "zap", farbe: "gruen", punkte: ["Neue Daten rein", "Vorhersage raus", "Ständig, auch auf dem Jetson"]}},
     p: [
      "Beim [[training|Training]] sieht das Verfahren viele Beispiele und stellt sein Modell so ein, dass es sie möglichst oft richtig trifft. Das ist rechenintensiv und passiert einmal, meist in einem Rechenzentrum.",
      "Bei der [[inferenz|Inferenz]] bekommt das fertige Modell neue Daten und liefert eine Vorhersage. Das ist vergleichsweise billig und passiert ständig, zum Beispiel hier auf dem Jetson, wenn er dein Kamerabild auswertet.",
    ]},
    {h: "Drei Arten zu lernen",
     kurz: "Mit Antworten, ohne Antworten oder durch Belohnung: Das Verfahren hängt von den Daten ab.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "tag", text: "Überwacht", sub: "Beispiel mit Etikett"},
      {icon: "boxes", text: "Unüberwacht", sub: "Gruppen selbst finden"},
      {icon: "trophy", text: "Bestärkend", sub: "Belohnung oder Strafe"}]},
     p: [], liste: [
      "**Überwachtes Lernen:** Die Beispiele kommen mit der richtigen Antwort, etwa ein Foto mit dem [[label|Etikett]] „Katze“. Daraus lernt das Modell, neue Fotos zuzuordnen. Das Spielfeld oben arbeitet so.",
      "**Unüberwachtes Lernen:** Es gibt nur Daten, keine Antworten. Das Verfahren sucht selbst Gruppen und Auffälligkeiten, etwa Kundengruppen mit ähnlichem Verhalten.",
      "**Bestärkendes Lernen:** Ein Agent probiert Dinge aus und bekommt Belohnung oder Strafe. So lernen Systeme Spiele und die Steuerung von Robotern.",
    ]},
    {h: "Ähnlichkeit als Rechnung",
     kurz: "Jedes Bild wird zu einer Zahlenliste. Ähnliche Bilder liegen im Zahlenraum nah beieinander.",
     visual: {typ: "zahlen", kacheln: [
      {wert: "2", label: "Zahlen je Punkt im Spielfeld", icon: "chart-scatter"},
      {wert: "1000", label: "Zahlen je Bild im Anlern-Labor", icon: "image"}]},
     p: [
      "Damit ein Computer Bilder vergleichen kann, wird jedes Bild in eine Liste von Zahlen übersetzt, ein [[embedding|Embedding]]. Ähnliche Bilder bekommen ähnliche Zahlen und liegen im Zahlenraum nah beieinander.",
      "Das Spielfeld oben zeigt das mit zwei Zahlen pro Punkt, also auf einer Fläche. Ein neuer Punkt bekommt die Klasse, die unter seinen nächsten Nachbarn am häufigsten vorkommt ([[knn|k nächste Nachbarn]]). Im Labor {{anlernen|Bildmodell anlernen}} passiert dasselbe, nur mit 1000 Zahlen pro Bild statt zwei.",
    ]},
    {h: "Wo es schiefgeht",
     kurz: "Ein Modell, das Beispiele auswendig lernt, versagt bei neuen Daten. Darum wird mit ungesehenen Daten geprüft.",
     visual: {typ: "matrix", xtitel: "Daten", ytitel: "Modell", x: ["Bekannt", "Neu"], y: ["Versteht Muster", "Lernt auswendig"], zellen: [
      [{text: "gut", ton: "gut"}, {text: "gut", ton: "gut"}],
      [{text: "gut", ton: "gut"}, {text: "schlecht", ton: "schlecht"}]]},
     p: [
      "Daten sind das Produkt. Ein Modell lernt nur, was in den Beispielen steckt. Sind sie einseitig, ist es das Modell auch.",
      "[[ueberanpassung|Überanpassung]] heißt, dass ein Modell die Beispiele auswendig lernt, statt das Muster zu verstehen. Dann ist es bei bekannten Daten perfekt und bei neuen schlecht. Darum prüft man immer mit Daten, die das Modell vorher nie gesehen hat. Du kannst das oben nachstellen: Stelle k auf 1 und setze einzelne Ausreißer. Die Grenze wird zackig und folgt jedem Zufall.",
    ]},
  ],
  mitnehmen: [
    "Ein Modell besteht aus Zahlen, die im Training aus Beispielen entstehen.",
    "Training passiert einmal und ist teuer, Inferenz passiert ständig und ist günstig.",
    "Die Qualität der Beispiele bestimmt die Qualität des Modells.",
  ],
  weiter: ["anlernen", "objekt", "genki"],
},

genki: {
  typ: "lektion", gruppe: "Grundlagen", nr: 3, titel: "Generative KI", symbol: "genki", video: "generative-ki",
  lernziele: ["Du kannst erklären, wie ein Sprachmodell Stück für Stück das nächste Wort auswählt.", "Du kannst sagen, was die Temperatur verändert und warum ein Modell trotzdem Falsches schreibt.", "Du kannst erklären, warum ein Modell nur begrenzt viel Text im Blick hat."],
  kurz: "Ein Sprachmodell wählt Wort für Wort das nächste Stück. Aus vielen kleinen Würfen entsteht ein Text.",
  widget: "tokens",
  abschnitte: [
    {h: "Ein Sprachmodell rät das nächste Stück",
     kurz: "Das Modell wählt immer nur das nächste Token und wiederholt das, bis die Antwort steht.",
     visual: {typ: "token", stuecke: ["Der", " Him", "mel", " ist", " heute", " kla", "r", "."], unter: "Beispielzerlegung, echte Modelle teilen anders"},
     p: [
      "Ein großes Sprachmodell macht im Kern eines: Es berechnet, welches [[token|Token]] als nächstes am wahrscheinlichsten folgt, wählt eines aus und wiederholt das. Ganze Antworten entstehen so Stück für Stück. Dass dabei sinnvolle Texte herauskommen, liegt daran, dass das Modell im [[training|Training]] riesige Textmengen gesehen hat und die Zusammenhänge der Sprache abbildet.",
    ]},
    {h: "Wie zufällig darf es sein",
     kurz: "Die Temperatur legt fest, wie stark das wahrscheinlichste Token bevorzugt wird.",
     visual: {typ: "skala", links: "Vorhersehbar", rechts: "Abwechslungsreich", marker: 0.2, label: "Fakten: niedrige Temperatur"},
     p: [
      "Das Modell liefert keine einzelne Antwort, sondern für jedes Token eine Wahrscheinlichkeit. Die [[temperatur|Temperatur]] bestimmt, wie stark der Favorit bevorzugt wird. Niedrig: vorhersehbar und wiederholbar, gut für Fakten. Hoch: abwechslungsreich, aber auch fehleranfälliger.",
      "Oben kannst du das mit Beispielwerten durchspielen. Danach probierst du es im {{chat|Chat-Labor}} mit einem echten Modell.",
    ]},
    {h: "Das Gedächtnis hat ein Limit",
     kurz: "Das Modell sieht nur, was im Kontextfenster steht. Alles andere gibt es für es nicht.",
     visual: {typ: "schichten", richtung: "verschachtelt", ebenen: [
      {icon: "scan", text: "Kontextfenster", sub: "begrenzt"},
      {icon: "file-text", text: "Mitgeschickte Dokumente"},
      {icon: "messages-square", text: "Bisherige Unterhaltung"},
      {icon: "message-square", text: "Deine Frage"}]},
     p: [
      "Das Modell sieht nur, was im [[kontext|Kontextfenster]] steht: die bisherige Unterhaltung und alles, was mitgeschickt wird. Was draußen bleibt, existiert für das Modell nicht. Deshalb fügt man gezielt Wissen in den Kontext ein, statt zu hoffen, dass es im Modell steckt.",
    ]},
    {h: "Plausibel ist nicht wahr",
     kurz: "Gegen erfundene Antworten hilft RAG: erst nachschlagen, dann antworten und die Quelle nennen.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "message-square", text: "Frage"},
      {icon: "search", text: "Suche", sub: "in eigenen Dokumenten"},
      {icon: "file-text", text: "Fundstellen"},
      {icon: "circle-check", text: "Antwort", sub: "mit Quelle", farbe: "gruen"}]},
     p: [
      "Weil das Modell Wahrscheinliches fortsetzt, kann es Falsches überzeugend formulieren, eine [[halluzination|Halluzination]]. Ein Gegenmittel ist [[rag|RAG]]: Erst wird in eigenen Dokumenten nachgeschlagen, dann antwortet das Modell auf Grundlage der Fundstellen und nennt sie als Quelle. Das probierst du im {{rag|RAG-Labor}}.",
    ]},
    {h: "Bilder aus Rauschen",
     kurz: "Diffusion startet mit Rauschen und entfernt es Schritt für Schritt, gelenkt von deiner Beschreibung.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "tv", text: "Rauschen", sub: "plus Beschreibung"},
      {icon: "sparkles", text: "Schritt 1", sub: "etwas weniger Rauschen"},
      {icon: "sparkles", text: "Schritt n", sub: "Umrisse erscheinen"},
      {icon: "image", text: "Bild", farbe: "gruen"}]},
     p: [
      "Bildgeneratoren arbeiten meist mit [[diffusion|Diffusion]]. Das Modell hat gelernt, aus verrauschten Bildern das Rauschen Schritt für Schritt zu entfernen. Startet man mit reinem Rauschen und einer Textbeschreibung, entsteht daraus Schritt für Schritt ein neues Bild.",
    ]},
  ],
  mitnehmen: [
    "Ein Sprachmodell sagt immer nur das nächste Token voraus.",
    "Die Temperatur steuert, wie mutig es wählt.",
    "Was nicht im Kontext steht, weiß das Modell nicht. Darum gibt es RAG.",
  ],
  weiter: ["chat", "rag", "agent"],
},

robotik: {
  typ: "lektion", gruppe: "Grundlagen", nr: 4, titel: "Robotik", symbol: "robotik", video: "robotik",
  lernziele: ["Du kannst den Regelkreis aus Wahrnehmen, Entscheiden und Handeln beschreiben.", "Du kannst erklären, welche Rolle KI im Roboter hat.", "Du kannst sagen, warum der Rechner oft direkt am Roboter sitzt."],
  kurz: "Eine Maschine mit Körper: Sie misst, entscheidet und bewegt sich, und das viele Male pro Sekunde.",
  widget: "regelkreis",
  abschnitte: [
    {h: "Ein Roboter ist KI mit Körper",
     kurz: "Sensoren messen, die Steuerung entscheidet, Aktoren handeln. KI liefert meist die Entscheidung.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "camera", text: "Sensoren", sub: "messen"},
      {icon: "brain-circuit", text: "Steuerung", sub: "entscheidet"},
      {icon: "cog", text: "Aktoren", sub: "Motor, Greifer", farbe: "gruen"}]},
     p: [
      "Robotik verbindet drei Dinge: [[sensor|Sensoren]], die die Umgebung messen (Kamera, Abstandssensor, Drehgeber), eine Steuerung, die entscheidet, und [[aktor|Aktoren]], die handeln (Motoren, Greifer). KI ist meist der Teil, der aus Sensordaten eine Entscheidung macht. Der Rest ist Mechanik und Regelungstechnik.",
    ]},
    {h: "Der Regelkreis",
     kurz: "Jede Runde nutzt das Ergebnis der letzten, viele Male pro Sekunde.",
     visual: {typ: "kreis", mitte: "Regelkreis", knoten: [
      {icon: "scan-eye", text: "Wahrnehmen"},
      {icon: "brain-circuit", text: "Entscheiden"},
      {icon: "wrench", text: "Handeln"}]},
     p: [
      "Wahrnehmen, entscheiden, handeln, und wieder von vorn. Jede Runde nutzt das Ergebnis der letzten. Man nennt das einen [[regelkreis|Regelkreis]].",
      "Im Simulator oben fährt ein Roboter zum Ziel. Setze Hindernisse mit einem Klick. Schalte dann die Wahrnehmung aus, dann fährt er blind. Erhöhe die Verzögerung, dann reagiert er auf Messungen von gestern. So siehst du, warum Roboter schnelle Rechner am Gerät brauchen.",
    ]},
    {h: "Warum der Rechner am Roboter sitzt",
     kurz: "Ein Roboter muss in Millisekunden reagieren und bei Netzausfall weiterlaufen. Darum rechnet er am Gerät.",
     visual: {typ: "vergleich",
      links: {titel: "Am Gerät (Edge)", icon: "cpu", farbe: "gruen", punkte: ["Reaktion in Millisekunden", "Läuft ohne Netz", "Wenig Strom"]},
      rechts: {titel: "Im Rechenzentrum", icon: "cloud", farbe: "orange", punkte: ["Netzweg kostet Zeit", "Netzausfall stoppt ihn"]}},
     p: [
      "Ein Roboter muss in Millisekunden reagieren und darf bei einem Netzausfall nicht stehen bleiben. Deshalb läuft die KI direkt am Gerät, man spricht von [[edge|Edge-Computing]]. Der Jetson ist dafür gebaut: viel Rechenleistung für neuronale Netze bei wenig Strom.",
      "Die {{objekt|Objekterkennung}} in diesem Labor ist genau der Wahrnehmungsschritt, den ein Roboter ständig ausführt.",
    ]},
    {h: "Arten von Robotern",
     kurz: "Vom festen Arm bis zum Humanoiden: Die Bauformen unterscheiden sich in Beweglichkeit und Einsatzort.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "factory", text: "Industrie", sub: "Arme, fest montiert"},
      {icon: "truck", text: "Mobil", sub: "fahren selbständig"},
      {icon: "plane", text: "Drohnen", sub: "Inspektion, Vermessung"},
      {icon: "sparkles", text: "Service", sub: "Reinigung, Transport"},
      {icon: "bot", text: "Humanoid", sub: "noch viel Forschung"}]},
     p: [], liste: [
      "**Industrieroboter:** Arme in der Fertigung, meist fest montiert.",
      "**Mobile Roboter:** fahren selbständig durch Lager und Fabriken.",
      "**Drohnen:** fliegende Plattformen für Inspektion und Vermessung.",
      "**Serviceroboter:** übernehmen Reinigung oder Transport in Gebäuden.",
      "**Humanoide Roboter:** menschenähnlicher Körper, noch viel Forschung und Erprobung.",
    ]},
  ],
  mitnehmen: [
    "Roboter arbeiten im Kreis aus Wahrnehmen, Entscheiden und Handeln.",
    "KI liefert meist die Entscheidung aus Sensordaten.",
    "Schnelle Reaktion verlangt Rechenleistung direkt am Gerät.",
  ],
  weiter: ["objekt", "hardware", "business"],
},

business: {
  typ: "lektion", gruppe: "Grundlagen", nr: 5, titel: "KI im Business", symbol: "business", video: "ki-im-business",
  lernziele: ["Du kannst drei Aufgaben nennen, bei denen KI im Betrieb Arbeit abnimmt.", "Du kannst lokal und Cloud gegenüberstellen.", "Du kannst die drei Fragen nennen, die vor jedem Einsatz stehen."],
  kurz: "Wo KI heute Arbeit abnimmt, wann lokal sinnvoll ist und welche Fragen vor dem Einsatz stehen.",
  widget: "bereiche",
  abschnitte: [
    {h: "Wo KI heute Arbeit abnimmt",
     kurz: "Sichten, zählen, nachschlagen, protokollieren, vorsortieren, entwerfen: Das sind die häufigsten Aufgaben.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "scan-search", text: "Teile prüfen", sub: "Sichtprüfung"},
      {icon: "warehouse", text: "Bestand zählen", sub: "Lager, Regal"},
      {icon: "file-search", text: "Dokumente befragen", sub: "mit Quelle"},
      {icon: "mic", text: "Besprechungen", sub: "protokollieren"},
      {icon: "phone", text: "Anfragen", sub: "vorsortieren"},
      {icon: "pen-line", text: "Entwürfe", sub: "Mails, Texte"}]},
     p: [
      "Die Auswahl oben zeigt, welche Branche welche Aufgabe hat und welches Labor dazu passt.",
    ]},
    {h: "Lokal oder in der Cloud",
     kurz: "Lokal bleiben Daten im Haus und die Antwort ist schnell. Die Cloud bietet größere Modelle.",
     visual: {typ: "vergleich",
      links: {titel: "Lokal", icon: "cpu", farbe: "akzent", punkte: ["Daten bleiben im Haus", "Kein Netzweg", "Einmal zahlen", "Kleinere Modelle"]},
      rechts: {titel: "Cloud", icon: "cloud", farbe: "orange", punkte: ["Vertrag und Prüfung", "Netzweg nötig", "Zahlung nach Nutzung", "Große Modelle"]}},
     p: [
      "Dieses Labor läuft ohne Cloud. Das ist eine Entscheidung mit Vor- und Nachteilen:",
    ], liste: [
      "**Datenschutz:** Lokal verlassen Bilder, Töne und Texte das Haus nicht. In der Cloud brauchst du Vertrag und Prüfung.",
      "**Reaktionszeit:** Lokal gibt es keinen Netzweg. Für Kamera und Roboter entscheidet das.",
      "**Kosten:** Lokal zahlst du einmal für das Gerät, in der Cloud laufend nach Nutzung.",
      "**Leistung:** Cloud-Dienste können deutlich größere Modelle betreiben als ein kleines Gerät.",
    ]},
    {h: "Drei Fragen vor jedem Einsatz",
     kurz: "Entscheidung, Daten, Kontrolle: Diese drei Fragen müssen vor dem Start beantwortet sein.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "scale", text: "Entscheidung", sub: "Was soll die KI treffen?"},
      {icon: "database", text: "Daten", sub: "Brauchen wir, dürfen wir?"},
      {icon: "user-check", text: "Prüfung", sub: "Wer kontrolliert, wer haftet?"}]},
     p: [], liste: [
      "**Welche Entscheidung** soll die KI treffen oder vorbereiten?",
      "**Welche Daten** braucht sie, und dürfen wir sie nutzen?",
      "**Wer prüft** das Ergebnis, und was passiert bei einem Fehler?",
    ]},
    {h: "Vom Versuch zum Betrieb",
     kurz: "Ein Pilot mit echten Daten zeigt schneller als jede Folie, ob ein Verfahren trägt.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "flask-conical", text: "Pilot", sub: "echte Daten"},
      {icon: "ruler", text: "Messen", sub: "gegen heute"},
      {icon: "user-check", text: "Mensch prüft mit"},
      {icon: "circle-check", text: "Betrieb", sub: "Qualität beobachten", farbe: "gruen"}]},
     p: [
      "Ein Pilot mit echten Daten zeigt schneller als jede Präsentation, ob ein Verfahren trägt. Miss das Ergebnis gegen den heutigen Ablauf, lass einen Menschen mitprüfen und beobachte, ob die Qualität im Alltag hält. Dieses Labor eignet sich, um Ideen vorab greifbar zu machen: Zeig sie Kolleginnen und Kollegen live, bevor du Budget beantragst.",
    ]},
  ],
  mitnehmen: [
    "Gute Einsatzfelder haben klare Aufgaben, genug Daten und einen Menschen, der prüft.",
    "Lokal lohnt sich bei sensiblen Daten und schneller Reaktion.",
    "Fang klein an und miss gegen den heutigen Ablauf.",
  ],
  weiter: ["gesicht", "chat", "agent"],
},

/* ------------------------------------------------------------------ Labor: Sehen */

gesicht: {
  nav: "Gesichter", typ: "labor", gruppe: "Sehen", titel: "Gesichtserkennung", symbol: "gesicht", demo: "webcam-gesicht",
  lernziele: ["Du kannst die drei Stufen von Gesichtserkennung unterscheiden.", "Du kannst beschreiben, welche Schritte im Hintergrund laufen.", "Du kannst erklären, warum Gesichter beim Datenschutz besonders heikel sind."],
  kurz: "Der Jetson findet Gesichter in deinem Kamerabild, auch wenn du den Kopf neigst.",
  abschnitte: [
    {h: "Drei Stufen, die man oft verwechselt",
     kurz: "Dieses Labor erkennt nur, dass ein Gesicht da ist. Wer es ist, weiß es nicht.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "scan-face", text: "Erkennen", sub: "Gesicht im Bild", farbe: "gruen"},
      {icon: "user-check", text: "Identifizieren", sub: "wer ist es", farbe: "grau"},
      {icon: "smile", text: "Ausdruck deuten", farbe: "grau"}]},
     p: [
      "Erstens: erkennen, dass ein Gesicht im Bild ist (Detektion). Zweitens: das Gesicht einer bestimmten Person wiedererkennen (Identifikation). Drittens: den Ausdruck deuten. Dieses Labor macht nur die erste Stufe. Es findet Gesichter und markiert sie. Es speichert nichts und weiß nicht, wer du bist.",
    ]},
    {h: "Was im Hintergrund passiert",
     kurz: "Das Bild reist zum Jetson, ein kleines Netz findet Gesichter, das markierte Bild kommt zurück.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "camera", text: "Kamerabild", sub: "480 mal 360, JPEG"},
      {icon: "wifi", text: "WebSocket", sub: "zum Jetson"},
      {icon: "brain-circuit", text: "YuNet", sub: "Rahmen, Landmarken"},
      {icon: "scan-face", text: "Eingezeichnet", sub: "zurück zum Browser", farbe: "gruen"}]},
     p: [], liste: [
      "Dein Browser macht ein Bild aus der Kamera, verkleinert es auf 480 mal 360 Pixel und verpackt es als JPEG.",
      "Das Bild reist über eine WebSocket-Verbindung zum Jetson.",
      "Der Jetson entpackt es und gibt es an das Modell [[yunet|YuNet]], ein kleines neuronales Netz für Gesichter.",
      "Das Netz liefert Rahmen, eine [[konfidenz|Konfidenz]] und fünf [[landmark|Landmarken]]: beide Augen, die Nase und die Mundwinkel.",
      "Der Jetson zeichnet das ein und schickt das Bild zurück. Die farbigen Streifen über dem Bild zeigen, wie lange jeder Schritt dauert.",
    ]},
    {h: "Warum Neigen früher Probleme machte",
     kurz: "Ein neuronales Netz hat Gesichter in vielen Lagen gelernt. Ältere Verfahren kennen nur die Frontalansicht.",
     visual: {typ: "vergleich",
      links: {titel: "Ältere Verfahren", icon: "grid-3x3", farbe: "grau", punkte: ["Feste Helligkeitsmuster", "Nur von vorn"]},
      rechts: {titel: "Neuronales Netz", icon: "brain-circuit", farbe: "gruen", punkte: ["Viele Lagen gelernt", "Kopf neigen ist ok"]}},
     p: [
      "Ältere Verfahren suchen feste Helligkeitsmuster und sehen nur Gesichter von vorn. Ein neuronales Netz hat Gesichter in vielen Lagen gelernt und kommt damit besser zurecht. Genau das siehst du, wenn du den Kopf drehst oder neigst.",
    ]},
  ],
  business: {
    text: "Zutritt und Anwesenheit ohne Cloud, Personenzählung im Laden oder Foyer, Aufmerksamkeitsmessung an Displays.",
    beispiele: ["Türsystem, das erkennt, ob jemand davorsteht", "Besucherzählung ohne Identifikation"],
  },
  grenzen: [
    "Schlechtes Licht, Masken und sehr kleine Gesichter senken die Trefferquote.",
    "Gesichter finden ist nicht Personen erkennen. In einem echten Einsatz brauchst du eine Rechtsgrundlage und eine Datenschutzprüfung.",
  ],
  weiter: ["objekt", "anlernen"],
},

objekt: {
  nav: "Objekte", typ: "labor", gruppe: "Sehen", titel: "Objekterkennung", symbol: "objekt", demo: "webcam-objekt",
  lernziele: ["Du kannst erklären, was Rahmen, Klasse und Sicherheit bei der Objekterkennung bedeuten.", "Du kannst mit der Schwelle Treffer und Fehlalarme abwägen.", "Du kannst sagen, warum doppelte Rahmen aufgeräumt werden müssen."],
  kurz: "Der Jetson benennt, was er im Bild sieht, und markiert jedes Objekt mit einem Rahmen.",
  abschnitte: [
    {h: "Ein Blick reicht",
     kurz: "Das Netz betrachtet das ganze Bild einmal und sagt zugleich, wo etwas ist und was es ist.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "image", text: "Ganzes Bild", sub: "ein Durchgang"},
      {icon: "brain-circuit", text: "YOLOX"},
      {icon: "scan-search", text: "Ort und Klasse", sub: "gleichzeitig", farbe: "gruen"}]},
     p: [
      "Hier läuft YOLOX, ein Verfahren aus der [[yolo|YOLO]]-Familie. Das Netz betrachtet das ganze Bild einmal und sagt gleichzeitig, wo Objekte sind und was sie sind. Deshalb ist es schnell genug für Video.",
    ]},
    {h: "Rahmen, Klasse, Sicherheit",
     kurz: "Jedes Objekt bekommt einen Rahmen, eine von 80 Klassen und eine Konfidenz zwischen 0 und 1.",
     visual: {typ: "quelle", src: "/static/beispiele/fotos/handel-tassen-tisch.jpg", alt: "Mehrere Tassen auf einem Tisch", unter: "Beispielfoto: Pro Objekt entstehen Rahmen, Klasse und Konfidenz"},
     p: [
      "Für jedes Objekt liefert das Netz einen Rahmen, eine Klasse aus 80 Alltagsklassen (Person, Tasse, Laptop, Stuhl und so weiter) und eine [[konfidenz|Konfidenz]]: wie sicher es sich ist.",
    ]},
    {h: "Die Schwelle: Treffer gegen Fehlalarme",
     kurz: "Ab welcher Konfidenz ein Rahmen erscheint, bestimmst du. Niedrig findet mehr, hoch irrt weniger.",
     visual: {typ: "skala", links: "Mehr Treffer, mehr Fehlalarme", rechts: "Weniger Fehlalarme, mehr übersehen", marker: 0.5, label: "Regler Schwelle"},
     p: [
      "Der Regler **Schwelle** legt fest, ab welcher Konfidenz ein Rahmen angezeigt wird. Niedrig: mehr Treffer, aber auch mehr Fehlalarme. Hoch: weniger Fehlalarme, dafür werden Objekte übersehen. Diese Abwägung gibt es bei jeder Erkennung, auch in der Fertigung. Probiere es live aus.",
    ]},
    {h: "Doppelte Rahmen aufräumen",
     kurz: "Das Netz meldet ein Objekt oft mehrfach. Die Aufräumung behält nur den sichersten Rahmen.",
     visual: {typ: "vergleich",
      links: {titel: "Vorher", icon: "layers", farbe: "orange", punkte: ["Mehrere Rahmen je Objekt", "Leicht versetzt"]},
      rechts: {titel: "Nach NMS", icon: "square", farbe: "gruen", punkte: ["Sicherster Rahmen bleibt", "Überlappende fallen weg"]}},
     p: [
      "Das Netz meldet dasselbe Objekt oft mehrfach mit leicht versetzten Rahmen. Ein Aufräumschritt, die [[nms|Non-Maximum Suppression]], behält den sichersten und wirft überlappende weg.",
    ]},
    {h: "Wie schnell ist das",
     kurz: "Hier rechnet der Prozessor mit OpenCV. Das Erkennen braucht den größten Teil der Zeit.",
     visual: {typ: "schichten", richtung: "stapel", ebenen: [
      {icon: "layout-dashboard", text: "Labor im Browser"},
      {icon: "brain", text: "YOLOX", sub: "Modell"},
      {icon: "workflow", text: "OpenCV", sub: "heute genutzt"},
      {icon: "cpu", text: "Prozessor", sub: "GPU mit TensorRT möglich"}]},
     p: [
      "Das Modell läuft hier bewusst einfach über OpenCV auf dem Prozessor. Der Streifen über dem Bild zeigt, dass das Erkennen den größten Teil der Zeit braucht. Auf der GPU des Jetson ließe sich das mit TensorRT deutlich beschleunigen.",
    ]},
  ],
  business: {
    text: "Zählen und Prüfen am Band, Lager- und Regalkontrolle, Flächen- und Verkehrsmonitoring, Sicherheit auf Baustellen.",
    beispiele: ["Paletten im Lager zählen", "Prüfen, ob Schutzausrüstung getragen wird"],
  },
  grenzen: [
    "Das Modell kennt nur seine 80 Klassen. Alles andere wird übersehen oder falsch benannt.",
    "Ungewöhnliche Blickwinkel, Verdeckung und Gegenlicht erhöhen Fehler.",
  ],
  weiter: ["anlernen", "robotik"],
},

anlernen: {
  typ: "labor", gruppe: "Sehen", titel: "Bildmodell anlernen", symbol: "anlernen", demo: "teach",
  lernziele: ["Du kannst beschreiben, was beim Aufnehmen und beim Erkennen im Labor passiert.", "Du kannst drei Wege nennen, wie das angelernte Modell besser wird."],
  kurz: "Zeige dem Jetson Beispiele, und er erkennt sie danach selbst. In einer halben Minute, ohne Training.",
  abschnitte: [
    {h: "Was beim Aufnehmen passiert",
     kurz: "Jedes Beispiel wird zu 1000 Zahlen und mit dem Klassennamen gespeichert. Mehr geschieht nicht.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "camera", text: "Beispielbild", sub: "mehrmals pro Sekunde"},
      {icon: "brain-circuit", text: "MobileNet", sub: "vortrainiert"},
      {icon: "binary", text: "1000 Zahlen", sub: "Embedding"},
      {icon: "save", text: "Speichern", sub: "mit Klassenname", farbe: "gruen"}]},
     p: [
      "Halte den Knopf einer Klasse gedrückt, dann nimmt der Jetson mehrmals pro Sekunde Beispiele auf. Jedes Bild geht durch ein vortrainiertes neuronales Netz (MobileNet). Heraus kommt eine Liste von 1000 Zahlen, ein [[embedding|Embedding]]. Sie wird mit dem Namen deiner Klasse gespeichert. Mehr passiert nicht.",
    ]},
    {h: "Was beim Erkennen passiert",
     kurz: "Ein neues Bild wird verglichen, die drei ähnlichsten Beispiele stimmen ab. Das Netz bleibt unverändert.",
     visual: {typ: "zahlen", kacheln: [
      {wert: "1000", label: "Zahlen je Bild", icon: "binary"},
      {wert: "3", label: "ähnlichste Beispiele stimmen ab", icon: "users"},
      {wert: "0", label: "Änderungen am Netz", icon: "lock"}]},
     p: [
      "Ein neues Bild wird ebenfalls zu 1000 Zahlen. Der Jetson misst den Abstand zu allen gespeicherten Beispielen und lässt die drei ähnlichsten abstimmen ([[knn|k nächste Nachbarn]]). Die Balken zeigen, wie ähnlich das aktuelle Bild jeder Klasse ist. Nichts im Netz wird dabei verändert. Deshalb ist es sofort einsatzbereit.",
    ]},
    {h: "So werden die Ergebnisse besser",
     kurz: "Vielfalt schlägt Menge: wenige Beispiele aus vielen Lagen helfen mehr als viele gleiche.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "images", text: "10 bis 20", sub: "Beispiele je Klasse"},
      {icon: "sun", text: "Variieren", sub: "Winkel, Abstand, Licht"},
      {icon: "ban", text: "Klasse „nichts“", sub: "leerer Hintergrund"}]},
     p: [], liste: [
      "10 bis 20 Beispiele pro Klasse reichen für den Anfang.",
      "Variiere Winkel, Abstand und Licht, sonst lernt das Modell nur diese eine Haltung.",
      "Eine Klasse „nichts“ mit leerem Hintergrund hilft, Fehlalarme zu vermeiden.",
    ]},
  ],
  business: {
    text: "Qualitätsprüfung und Sortierung ohne Data Scientist: Mitarbeitende zeigen gute und schlechte Teile, das System prüft danach selbst.",
    beispiele: ["Gutteil und Ausschuss unterscheiden", "Bauteile nach Typ sortieren"],
  },
  grenzen: [
    "Das Netz wurde für Alltagsobjekte trainiert. Kleine Unterschiede wie Kratzer sieht es oft nicht. Dafür braucht man Fine-Tuning mit mehr Daten.",
    "Die Beispiele gelten für alle Besucher gemeinsam. Wer „Zurücksetzen“ drückt, löscht sie für alle.",
  ],
  weiter: ["ml", "objekt"],
},

/* ------------------------------------------------------------------ Labor: Sprache */

chat: {
  typ: "labor", gruppe: "Sprache", titel: "Sprachmodell im Chat", symbol: "chat", demo: "chat",
  lernziele: ["Du kannst im Chat Einstellungen wie die Temperatur ändern und die Wirkung beschreiben.", "Du kannst erklären, was auf dem Jetson passiert, wenn du eine Frage stellst.", "Du kannst sagen, warum dieses Modell kleiner ist als bekannte Chatbots."],
  kurz: "Ein Modell mit etwa drei Milliarden Parametern antwortet lokal auf der GPU. Du siehst jedes Token.",
  abschnitte: [
    {h: "Was du hier steuern kannst",
     kurz: "Jedes farbige Stück ist ein Token, das das Modell einzeln gewählt hat.",
     visual: {typ: "token", stuecke: ["Hal", "lo", ",", " wie", " kann", " ich", " hel", "fen", "?"], unter: "Beispielzerlegung, echte Modelle teilen anders"},
     p: [
      "**Tokens zeigen** färbt die Antwort Stück für Stück ein. Jedes farbige Stück ist ein Token, das das Modell einzeln gewählt hat. Wörter bestehen oft aus mehreren Tokens, häufige Wörter aus einem.",
      "Die **Temperatur** wirkt auf die nächste Antwort. Stelle sie auf 0 und stelle dieselbe Frage zweimal: Die Antworten sind fast gleich. Stelle sie auf 1,5, dann weichen sie ab und werden unzuverlässiger.",
    ]},
    {h: "Was auf dem Jetson passiert",
     kurz: "Das Modell wird einmal in den Speicher geladen, danach rechnet die GPU jedes Token.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "hard-drive", text: "SSD", sub: "rund 2 GB"},
      {icon: "memory-stick", text: "Arbeitsspeicher", sub: "beim ersten Start"},
      {icon: "microchip", text: "GPU", sub: "rechnet Token"},
      {icon: "message-square", text: "Antwort", sub: "Stück für Stück", farbe: "gruen"}]},
     p: [
      "Beim ersten Start wird das [[modell|Modell]] von der SSD in den Arbeitsspeicher geladen. Das Modell hat etwa drei Milliarden [[parameter|Parameter]] und belegt rund 2 GB auf der Platte. Danach rechnet die [[gpu|GPU]] jedes Token. In der Seitenleiste steigen dabei GPU-Last und Leistung.",
    ]},
    {h: "Warum es kleiner ist als bekannte Chatbots",
     kurz: "Das kleine Modell ist sofort da und privat, weiß aber weniger und irrt öfter.",
     visual: {typ: "vergleich",
      links: {titel: "Jetson, drei Mrd. Parameter", icon: "cpu", farbe: "akzent", punkte: ["Sofort verfügbar", "Privat", "Weiß weniger", "Mehr Fehler"]},
      rechts: {titel: "Große Dienste", icon: "cloud", farbe: "orange", punkte: ["Viel mehr Parameter", "Im Rechenzentrum", "Weiß mehr"]}},
     p: [
      "Die großen Dienste nutzen Modelle mit sehr viel mehr Parametern auf Rechenzentren. Ein kleines Modell auf dem Jetson ist sofort verfügbar und privat, weiß aber weniger und macht mehr Fehler. Frag es nach etwas Speziellem, dann siehst du die Grenze. Beispiel: Frag nach dem „Jetson“. Das Modell hält ihn gern für die Zeichentrickserie.",
    ]},
  ],
  business: {
    text: "Ein interner Assistent für Entwürfe, Zusammenfassungen und Fragen, ohne dass Firmeninhalte das Haus verlassen.",
    beispiele: ["Mail-Entwürfe", "Zusammenfassung eines langen Textes"],
  },
  grenzen: [
    "Kleine Modelle erfinden häufiger Fakten ([[halluzination|Halluzination]]). Prüfe wichtige Aussagen.",
    "Der Kontext ist begrenzt. Dieses Labor merkt sich keine frühere Unterhaltung.",
  ],
  weiter: ["genki", "rag", "agent"],
},

rag: {
  nav: "RAG", typ: "labor", gruppe: "Wissen und RAG", titel: "RAG: Fragen an eigene Dokumente", symbol: "rag", demo: "rag",
  lernziele: ["Du kannst erklären, warum ein Sprachmodell deine Dokumente nicht kennt.", "Du kannst die vier Schritte von der Frage bis zur Antwort nennen.", "Du kannst an den Scores ablesen, wie gut eine gefundene Stelle passt."],
  kurz: "Das Modell kennt deine Dokumente nicht. Also sucht der Jetson erst die passenden Stellen und antwortet dann nur damit.",
  abschnitte: [
    {h: "Das Problem",
     kurz: "Deine Dokumente stecken nicht im Modell. Ohne Nachschlagen würde es raten.",
     visual: {typ: "vergleich",
      links: {titel: "Ohne RAG", icon: "circle-help", farbe: "rot", punkte: ["Modell kennt Dokumente nicht", "Es rät"]},
      rechts: {titel: "Mit RAG", icon: "book-open", farbe: "gruen", punkte: ["Erst nachschlagen", "Antwort mit Quelle"]}},
     p: [
      "Ein Sprachmodell weiß nur, was es im Training gesehen hat. Deine Verträge, Handbücher und Notizen gehören nicht dazu. Würdest du trotzdem fragen, würde es raten.",
    ]},
    {h: "Die Lösung in vier Schritten",
     kurz: "Zerlegen, einbetten, suchen, antworten. Das Modell sieht nur die passenden Stellen.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "scissors", text: "Zerlegen", sub: "etwa 800 Zeichen"},
      {icon: "binary", text: "Einbetten", sub: "Zahlenliste"},
      {icon: "search", text: "Suchen", sub: "größte Ähnlichkeit"},
      {icon: "message-square", text: "Antworten", sub: "nur mit Treffern", farbe: "gruen"}]},
     p: [], liste: [
      "**Zerlegen:** Der Text wird in Abschnitte von etwa 800 Zeichen geteilt.",
      "**Einbetten:** Jeder Abschnitt wird zu einer Zahlenliste ([[embedding|Embedding]]), hier mit dem Modell nomic-embed-text.",
      "**Suchen:** Deine Frage wird genauso eingebettet. Die Abschnitte mit der größten Ähnlichkeit ([[cosinus|Kosinus]]) sind die Treffer.",
      "**Antworten:** Die Treffer und deine Frage gehen an das Sprachmodell, mit der Anweisung, nur damit zu antworten und die Quelle zu nennen.",
    ]},
    {h: "Schau auf die Scores",
     kurz: "Ein hoher Score heißt ähnlich. Ist die Antwort falsch, standen meist die falschen Abschnitte oben.",
     visual: {typ: "skala", links: "0 unverwandt", rechts: "1 sehr ähnlich", marker: 0.8, label: "Score eines Treffers (Beispiel)"},
     p: [
      "Jeder Treffer hat einen Wert zwischen 0 und 1. Je höher, desto ähnlicher ist der Abschnitt zur Frage. Ist die Antwort falsch, liegt es meistens an der Suche und nicht am Modell: Dann standen die falschen Abschnitte oben. Genau deshalb zeigt dir das Labor die Treffer, bevor es antwortet.",
    ]},
  ],
  business: {
    text: "Fragen an Verträge, Handbücher und Wissensbasen mit Quellenangabe. Vertrauliche Dokumente bleiben auf dem Gerät.",
    beispiele: ["Wo steht die Kündigungsfrist?", "Welche Schritte hat die Wartungsanleitung?"],
  },
  grenzen: [
    "Die Antwort ist nur so gut wie die gefundenen Abschnitte. Fehlt etwas im Text, kann das Modell es nicht belegen.",
    "Dieses Labor hält höchstens 300 Abschnitte im Speicher und vergisst alles beim Neustart.",
  ],
  weiter: ["agent", "genki"],
},

agent: {
  nav: "Agent", typ: "labor", gruppe: "Agenten", titel: "Agent mit Werkzeugen", symbol: "agent", demo: "agent",
  lernziele: ["Du kannst erklären, was einen Agenten von einem Chat unterscheidet.", "Du kannst die Schleife aus Denken, Werkzeug und Ergebnis an einem Beispiel verfolgen.", "Du kannst sagen, worauf du bei Agenten achten solltest."],
  kurz: "Ein Sprachmodell, das selbst entscheidet, wann es ein Werkzeug braucht, und in Schritten zur Antwort kommt.",
  abschnitte: [
    {h: "Ein Agent ist ein Modell mit Werkzeugen",
     kurz: "Das Modell entscheidet selbst, ob es ein Werkzeug aufruft oder antwortet.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "sigma", text: "rechne", sub: "Zahlen, einfache Zeichen"},
      {icon: "clock", text: "uhrzeit", sub: "aktuelle Zeit"},
      {icon: "file-search", text: "dokumentsuche", sub: "in den Dokumenten"}]},
     p: [
      "Ein [[agent|Agent]] bekommt zusätzlich zur Frage eine Liste von [[werkzeug|Werkzeugen]] beschrieben, hier: **rechne**, **uhrzeit** und **dokumentsuche**. Statt sofort zu antworten, kann er einen Werkzeugaufruf ausgeben. Der Jetson führt ihn aus und gibt das Ergebnis zurück. Das Modell entscheidet dann, ob es weiter arbeitet oder antwortet.",
    ]},
    {h: "Die Schleife",
     kurz: "Aufruf, Ergebnis, neue Entscheidung. Nach höchstens fünf Runden endet die Schleife.",
     visual: {typ: "kreis", mitte: "max. 5 Runden", knoten: [
      {icon: "brain-circuit", text: "Modell entscheidet"},
      {icon: "wrench", text: "Werkzeug läuft"},
      {icon: "file-text", text: "Ergebnis zurück"}]},
     p: [], liste: [
      "Frage und Werkzeugliste gehen an das Modell.",
      "Das Modell antwortet entweder mit einem Werkzeugaufruf oder mit dem Ergebnis.",
      "Bei einem Aufruf führt der Jetson das Werkzeug aus und hängt das Ergebnis an die Unterhaltung.",
      "Das Modell sieht das Ergebnis und entscheidet neu. Nach höchstens fünf Runden endet die Schleife.",
    ]},
    {h: "Worauf du achten solltest",
     kurz: "Kleine Modelle greifen manchmal daneben. Darum zeigt das Labor jeden Schritt und begrenzt den Rechner.",
     visual: {typ: "vergleich",
      links: {titel: "Risiko", icon: "triangle-alert", farbe: "rot", punkte: ["Falsches Werkzeug", "Erfundene Eingaben"]},
      rechts: {titel: "Schutz", icon: "shield-check", farbe: "gruen", punkte: ["Jeder Schritt sichtbar", "Rechner nur für Zahlen"]}},
     p: [
      "Kleine Modelle wählen manchmal das falsche Werkzeug oder erfinden Eingaben. Darum zeigt das Labor jeden Schritt. Werkzeuge sind der Punkt, an dem ein Agent echten Schaden anrichten könnte. Deshalb ist der Rechner hier streng begrenzt: Er versteht nur Zahlen und einfache Rechenzeichen.",
    ]},
  ],
  business: {
    text: "Abläufe, bei denen mehrere Systeme nacheinander gefragt werden müssen: Auftragsstatus nachschlagen, Preis berechnen, Antwort formulieren.",
    beispiele: ["Ticket vorsortieren", "Bestellstatus abfragen und Kunden informieren"],
  },
  grenzen: [
    "Je mächtiger die Werkzeuge, desto wichtiger sind Grenzen und Freigaben durch einen Menschen.",
    "Mehrere Schritte multiplizieren Fehler: Ein falscher Zwischenschritt zieht die Antwort mit.",
  ],
  weiter: ["rag", "robotik"],
},

whisper: {
  typ: "labor", gruppe: "Sprache", titel: "Sprache zu Text", symbol: "whisper", demo: "whisper",
  lernziele: ["Du kannst beschreiben, wie aus Ton Text wird.", "Du kannst beobachten, wo die Spracherkennung Fehler macht."],
  kurz: "Sprich in dein Mikrofon, und der Jetson schreibt mit. Das Modell läuft lokal, ohne Cloud.",
  abschnitte: [
    {h: "Wie aus Ton Text wird",
     kurz: "Ton wird in kurze Fenster zerlegt, zu einem Frequenzbild und von einem Netz in Text übersetzt.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "mic", text: "Mikrofon", sub: "im Browser"},
      {icon: "audio-lines", text: "Fenster", sub: "kurze Ausschnitte"},
      {icon: "chart-no-axes-column", text: "Spektrogramm", sub: "Bild der Frequenzen"},
      {icon: "brain-circuit", text: "Netz", sub: "Token für Token"},
      {icon: "captions", text: "Text", farbe: "gruen"}]},
     p: [
      "Dein Browser nimmt Ton auf und schickt ihn an den Jetson. Dort zerlegt Whisper den Ton in kurze Fenster, wandelt sie in ein Bild der Frequenzen um (ein Spektrogramm) und lässt ein neuronales Netz daraus Text vorhersagen, Token für Token, ähnlich wie ein Sprachmodell.",
    ]},
    {h: "Was du beobachten kannst",
     kurz: "Ist die Rechenzeit kürzer als die Aufnahme, hält das Modell mit Live-Untertiteln mit.",
     visual: {typ: "balken", titel: "Beispielwerte: schneller als Echtzeit", einheit: "s", zeilen: [
      {label: "Aufnahme", wert: 10, farbe: "akzent"},
      {label: "Rechenzeit", wert: 4, farbe: "gruen"}]},
     p: [
      "Die Anzeige trennt Aufnahmedauer und Rechenzeit. Ist die Rechenzeit kürzer als die Aufnahme, ist das Modell schneller als Echtzeit. Wenn nicht, kann es für Live-Untertitel nicht mithalten.",
    ]},
  ],
  business: {
    text: "Besprechungen protokollieren, Diktate, Untertitel und Telefonate durchsuchbar machen, ohne Aufnahmen an einen Cloud-Dienst zu geben.",
    beispiele: ["Protokoll einer Besprechung", "Diktat im Außendienst"],
  },
  grenzen: [
    "Dialekt, Hintergrundlärm und Fachbegriffe erhöhen Fehler. Namen und Zahlen immer prüfen.",
    "Das Modell erkennt nicht, wer spricht.",
  ],
  weiter: ["chat", "rag"],
},

/* ------------------------------------------------------------------ Labor: Erzeugen */

bild: {
  versteckt: true, typ: "labor", gruppe: "Erzeugen", titel: "Bilder erzeugen", symbol: "bild", demo: null, status: "bald",
  lernziele: ["Du kannst in Schritten beschreiben, wie Diffusion aus Rauschen ein Bild formt."],
  kurz: "Aus einer Beschreibung entsteht ein Bild. Auf dem Jetson ist das möglich, aber langsam.",
  abschnitte: [
    {h: "Wie Diffusion funktioniert",
     kurz: "Das Training verrauscht echte Bilder und lernt die Umkehrung. Die Beschreibung lenkt, wohin das Rauschen verschwindet.",
     visual: {typ: "vergleich",
      links: {titel: "Training", icon: "graduation-cap", farbe: "orange", punkte: ["Echtes Bild", "Rauschen kommt dazu", "Modell lernt die Umkehr"]},
      rechts: {titel: "Erzeugen", icon: "wand-sparkles", farbe: "gruen", punkte: ["Reines Rauschen", "Rauschen schrittweise weg", "Text lenkt das Bild"]}},
     p: [
      "Beim Training nimmt man echte Bilder und fügt ihnen Schritt für Schritt Rauschen hinzu, bis nur noch Rauschen übrig ist. Das Modell lernt die Umkehrung: aus einem verrauschten Bild ein etwas weniger verrauschtes zu machen. Eine Textbeschreibung steuert, in welche Richtung das Rauschen verschwindet.",
    ]},
    {h: "Erzeugen in Schritten",
     kurz: "Derselbe Entrauschungsschritt läuft 4 bis 50 Mal, bis ein Bild dasteht.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "tv", text: "Rauschen", sub: "plus Beschreibung"},
      {icon: "sparkles", text: "Schritt 1", sub: "etwas weniger Rauschen"},
      {icon: "sparkles", text: "Schritt n", sub: "Umrisse erscheinen"},
      {icon: "image", text: "Bild", farbe: "gruen"}]},
     p: [
      "Beim Erzeugen startet man mit reinem Rauschen und wiederholt den Schritt, oft 4 bis 50 Mal. Dabei zeichnet sich Schritt für Schritt ein Bild ab.",
    ]},
    {h: "Warum hier noch keine Demo läuft",
     kurz: "Bildmodelle brauchen viel Speicher, und der ist auf dem Jetson geteilt.",
     visual: {typ: "zahlen", kacheln: [
      {wert: "8 GB", label: "gemeinsamer Speicher für alles", icon: "memory-stick"},
      {wert: "4 bis 50", label: "Rechenschritte je Bild", icon: "layers"}]},
     p: [
      "Bildmodelle brauchen PyTorch in einer Jetson-Fassung und viel Speicher. Auf dem Jetson mit 8 GB gemeinsamem Speicher teilen sich Modell und System den Platz. Diese Demo ist noch nicht eingebaut. Der Text hier erklärt das Prinzip, damit du es nachvollziehen kannst.",
    ]},
  ],
  business: {
    text: "Produktbilder, Varianten und Entwürfe für Marketing und Design, ohne Bilddaten an einen Dienst zu geben.",
    beispiele: ["Moodboards", "Produktvarianten"],
  },
  grenzen: [
    "Urheberrecht und Markenrecht sind bei erzeugten Bildern nicht abschließend geklärt. Prüfe den Einsatz vorab.",
  ],
  weiter: ["genki"],
},

faceswap: {
  nav: "Face-Swap", versteckt: true, typ: "labor", gruppe: "Erzeugen", titel: "Face-Swap und Deepfakes", symbol: "faceswap", demo: null, status: "bald",
  lernziele: ["Du kannst erklären, wie Face-Swap funktioniert, und Chancen und Risiken nennen."],
  kurz: "Ein Gesicht in einem Bild durch ein anderes ersetzen. Eindrucksvoll und riskant zugleich.",
  abschnitte: [
    {h: "So funktioniert es",
     kurz: "Erst Gesicht und Landmarken finden, dann die Merkmale der Quellperson einsetzen und angleichen.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "scan-face", text: "Erkennen", sub: "Gesicht, Landmarken"},
      {icon: "user", text: "Merkmale", sub: "der Quellperson"},
      {icon: "arrow-right-left", text: "Einsetzen", sub: "Pose, Licht des Ziels"},
      {icon: "sliders-horizontal", text: "Angleichen", sub: "Farbe, Rand", farbe: "gruen"}]},
     p: [
      "Ein Gesichtsdetektor findet das Gesicht und seine Landmarken. Ein zweites Netz (zum Beispiel inswapper) erhält die Identitätsmerkmale der Quellperson und setzt sie in die Pose und Beleuchtung der Zielperson. Ein Nachbearbeitungsschritt gleicht Farbe und Rand an.",
    ]},
    {h: "Chancen und Risiken",
     kurz: "Dieselbe Technik trägt Avatare und Fälschungen. Darum nur mit Einwilligung und mit Kennzeichnung.",
     visual: {typ: "vergleich",
      links: {titel: "Chancen", icon: "thumbs-up", farbe: "gruen", punkte: ["Avatare für Schulungen", "Gesichter anonymisieren", "Lippen bei Übersetzung"]},
      rechts: {titel: "Risiken", icon: "triangle-alert", farbe: "rot", punkte: ["Gefälschte Aufnahmen", "Schaden für Betroffene"]},
      urteil: "Nur mit Einwilligung, Inhalte kennzeichnen."},
     p: [
      "Dieselbe Technik ermöglicht Avatare und Anonymisierung in Videos, aber auch gefälschte Aufnahmen echter Personen. Darum gilt: nur mit Einwilligung der gezeigten Person, und erzeugte Inhalte kennzeichnen.",
    ]},
    {h: "Stand in diesem Labor",
     kurz: "Die Demo ist noch nicht eingebaut. Es fehlen Technik und klare Regeln für gespeicherte Fotos.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "clock", text: "Noch keine Demo"},
      {icon: "cpu", text: "GPU-Laufzeit nötig", sub: "onnxruntime"},
      {icon: "shield-alert", text: "Foto würde gespeichert", sub: "ohne Regeln: nein"}]},
     p: [
      "Die Demo ist noch nicht eingebaut. Sie bräuchte onnxruntime mit GPU-Unterstützung für den Jetson und würde, anders als die übrigen Labore, ein Foto einer Person speichern. Das tun wir hier nicht ohne klare Regeln. Die Erklärung dient dem Verständnis der Technik.",
    ]},
  ],
  business: {
    text: "Anonymisierung von Gesichtern in Videos, Avatare für Schulungsclips, synchronisierte Lippenbewegungen bei Übersetzungen.",
    beispiele: ["Unkenntlich machen von Personen in Aufnahmen"],
  },
  grenzen: [
    "Gefälschte Aufnahmen können Menschen schaden. Setze die Technik nur mit Einwilligung ein.",
  ],
  weiter: ["gesicht"],
},

/* ------------------------------------------------------------------ Jetson */

hardware: {
  nav: "Hardware", typ: "lektion", gruppe: "Der Rechner dahinter", titel: "Der Jetson und seine Hardware", symbol: "hardware", widget: "hardware",
  lernziele: ["Du kannst erklären, was ein Jetson ist und wofür er gut ist.", "Du kannst sagen, warum der gemeinsame Speicher die Modellgröße begrenzt.", "Du kannst die Anzeigen für Auslastung, Speicher und Strom deuten.", "Du kannst begründen, warum Rechnen direkt am Gerät (Edge) Vorteile hat."],
  kurz: "Ein kleiner Computer mit GPU, gebaut für KI am Gerät. Hier siehst du live, was er gerade tut.",
  abschnitte: [
    {h: "Was ist ein Jetson",
     kurz: "Ein Computer im Kartenformat mit sechs Kernen und einer GPU, die wenige Watt braucht.",
     visual: {typ: "zahlen", kacheln: [
      {wert: "6", label: "Prozessorkerne", icon: "cpu"},
      {wert: "8 GB", label: "gemeinsamer Speicher", icon: "memory-stick"},
      {wert: "wenige W", label: "Stromaufnahme", icon: "zap"}]},
     p: [
      "Der NVIDIA Jetson Orin Nano ist ein Computer im Kartenformat. Er hat einen Prozessor mit sechs Kernen und eine [[gpu|GPU]], die viele einfache Rechnungen gleichzeitig ausführt. Genau das brauchen neuronale Netze. Er nimmt dabei nur wenige Watt auf.",
    ]},
    {h: "Gemeinsamer Speicher",
     kurz: "CPU und GPU teilen sich 8 GB. Ein großes Modell lässt dem Betriebssystem kaum Platz.",
     visual: {typ: "schichten", richtung: "stapel", ebenen: [
      {icon: "brain", text: "Geladenes Modell", sub: "immer nur eins"},
      {icon: "cpu", text: "CPU und GPU", sub: "rechnen im selben Speicher"},
      {icon: "memory-stick", text: "Gemeinsamer Speicher", sub: "8 GB für alles"}]},
     p: [
      "CPU und GPU teilen sich denselben Arbeitsspeicher von 8 GB. Ein Modell, das 5 GB braucht, lässt kaum Platz für das Betriebssystem. Das ist der Grund, warum hier kleine Modelle laufen und immer nur eins zur Zeit geladen ist. Der Speicher in der Anzeige oben ist die wichtigste Grenze.",
    ]},
    {h: "Was die Anzeigen bedeuten",
     kurz: "Fünf Werte zeigen, wie ausgelastet der Jetson ist und wie viel Spielraum bleibt.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "microchip", text: "GPU", sub: "Auslastung"},
      {icon: "memory-stick", text: "Speicher", sub: "belegt"},
      {icon: "cpu", text: "CPU", sub: "sechs Kerne"},
      {icon: "zap", text: "Leistung", sub: "Stromaufnahme"},
      {icon: "thermometer", text: "Temperatur", sub: "heißester Punkt"}]},
     p: [], liste: [
      "**GPU:** wie ausgelastet der Grafikprozessor ist. Er steigt, wenn ein Modell rechnet.",
      "**Arbeitsspeicher:** belegt von Betriebssystem, Programmen und geladenen Modellen.",
      "**CPU:** Auslastung der sechs Prozessorkerne, im Mittel.",
      "**Leistung:** Strom, den das Board gerade aufnimmt, ohne Netzteilverluste.",
      "**Temperatur:** der heißeste Messpunkt des Chips. Bei zu hoher Temperatur taktet er herunter.",
    ]},
    {h: "Warum Edge-Geräte wichtig sind",
     kurz: "Wer Daten am Entstehungsort auswertet, spart Netz und Wartezeit und hält Sensibles vor Ort.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "camera", text: "Sensor", sub: "Daten entstehen"},
      {icon: "cpu", text: "Jetson", sub: "rechnet vor Ort"},
      {icon: "circle-check", text: "Ergebnis", sub: "kurze Wege", farbe: "gruen"}]},
     p: [
      "Wer Kamerabilder, Sprache oder Maschinendaten direkt am Entstehungsort auswertet, spart Netzwerk, Wartezeit und kann sensible Daten vor Ort lassen. Das ist die Idee hinter [[edge|Edge-Computing]].",
    ]},
  ],
  mitnehmen: [
    "Der Jetson rechnet neuronale Netze effizient auf einer GPU.",
    "Der gemeinsame Speicher von 8 GB begrenzt die Modellgröße.",
    "Lokal bedeutet: keine Cloud, kurze Wege, Daten bleiben vor Ort.",
  ],
  weiter: ["chat", "objekt", "business"],
},

},

/* ====================================================================== Glossar */
glossar: {
  ki: ["Künstliche Intelligenz", "Software, die Aufgaben löst, für die man sonst menschliches Denken braucht, etwa Erkennen, Verstehen, Entscheiden oder Erzeugen."],
  ml: ["Maschinelles Lernen", "Verfahren, bei denen ein Computer Muster aus Beispieldaten selbst findet, statt dass ein Mensch Regeln schreibt."],
  dl: ["Deep Learning", "Maschinelles Lernen mit neuronalen Netzen aus vielen Schichten. Es leitet aus Rohdaten wie Pixeln oder Text selbst Merkmale ab."],
  modell: ["Modell", "Das Ergebnis des Trainings: eine große Menge Zahlen, die festlegt, wie aus einer Eingabe eine Ausgabe wird."],
  parameter: ["Parameter", "Eine einstellbare Zahl im Modell. Moderne Sprachmodelle haben Milliarden davon."],
  training: ["Training", "Die Lernphase. Das Verfahren sieht viele Beispiele und stellt die Zahlen des Modells so ein, dass die Ausgaben möglichst oft stimmen."],
  inferenz: ["Inferenz", "Die Anwendungsphase. Das fertige Modell bekommt neue Daten und liefert eine Vorhersage. Das passiert hier auf dem Jetson."],
  label: ["Etikett (Label)", "Die richtige Antwort zu einem Beispiel, etwa „Katze“ zu einem Foto. Überwachtes Lernen braucht Beispiele mit Etikett."],
  embedding: ["Embedding", "Eine Liste von Zahlen, die den Inhalt eines Bildes oder Textes beschreibt. Ähnliche Inhalte haben ähnliche Zahlenlisten."],
  knn: ["k nächste Nachbarn", "Ein neues Beispiel bekommt die Klasse, die unter seinen k ähnlichsten bekannten Beispielen am häufigsten vorkommt."],
  ueberanpassung: ["Überanpassung", "Das Modell hat die Trainingsbeispiele auswendig gelernt, statt das Muster zu verstehen. Bei neuen Daten versagt es."],
  token: ["Token", "Ein Wortstück, mit dem ein Sprachmodell rechnet. Ein Wort besteht aus einem oder mehreren Tokens, häufige Wörter oft aus einem."],
  temperatur: ["Temperatur", "Regler für Zufälligkeit. Niedrig: das wahrscheinlichste Token gewinnt fast immer. Hoch: auch unwahrscheinlichere Tokens kommen vor."],
  kontext: ["Kontextfenster", "Der Text, den das Modell bei einer Antwort sehen kann: Frage, bisherige Unterhaltung und mitgeschickte Dokumente. Seine Größe ist begrenzt."],
  halluzination: ["Halluzination", "Eine Antwort, die überzeugend klingt, aber nicht stimmt. Sie entsteht, weil das Modell Wahrscheinliches fortsetzt und keine Fakten nachschlägt."],
  rag: ["RAG", "Retrieval-Augmented Generation: Erst relevante Textstellen in eigenen Dokumenten suchen, dann das Sprachmodell auf dieser Grundlage antworten lassen."],
  cosinus: ["Kosinus-Ähnlichkeit", "Maß für die Ähnlichkeit zweier Zahlenlisten. 1 heißt gleiche Richtung, also sehr ähnlich. Werte nahe 0 heißen unverwandt."],
  diffusion: ["Diffusion", "Verfahren zur Bilderzeugung: Ein Modell lernt, Rauschen schrittweise aus Bildern zu entfernen. Startet man mit Rauschen, entsteht ein neues Bild."],
  sensor: ["Sensor", "Misst etwas aus der Umgebung: Kamera, Abstandssensor, Drehgeber, Mikrofon."],
  aktor: ["Aktor", "Setzt eine Entscheidung in Bewegung um: Motor, Greifer, Ventil."],
  regelkreis: ["Regelkreis", "Wahrnehmen, entscheiden, handeln und wieder von vorn. Jede Runde nutzt das Ergebnis der vorigen."],
  edge: ["Edge-Computing", "Die Rechnung passiert direkt am Gerät statt in einem entfernten Rechenzentrum. Das spart Zeit und hält Daten vor Ort."],
  gpu: ["GPU", "Grafikprozessor. Er rechnet sehr viele einfache Rechnungen gleichzeitig. Das ist genau, was neuronale Netze brauchen."],
  yolo: ["YOLO", "You Only Look Once. Eine Familie von Objekterkennern, die das ganze Bild in einem Durchgang auswerten und deshalb schnell sind."],
  konfidenz: ["Konfidenz", "Wie sicher sich das Modell bei einem Ergebnis ist, als Wert zwischen 0 und 1. Ein hoher Wert heißt nicht, dass es stimmt."],
  nms: ["Non-Maximum Suppression", "Aufräumschritt, der von mehreren überlappenden Rahmen um dasselbe Objekt nur den sichersten behält."],
  yunet: ["YuNet", "Ein kleines neuronales Netz zur Gesichtserkennung. Es liefert Rahmen, Konfidenz und fünf Gesichtspunkte."],
  landmark: ["Landmarke", "Markanter Punkt im Gesicht. Hier fünf: beide Augen, Nasenspitze, beide Mundwinkel."],
  agent: ["Agent", "Ein Sprachmodell, das Werkzeuge aufrufen kann und in Schritten arbeitet, bis die Aufgabe gelöst ist."],
  werkzeug: ["Werkzeug", "Eine Funktion, die der Agent aufrufen darf, etwa rechnen, suchen oder eine Datenbank abfragen."],
},

/* ====================================================================== Landkarte */
landkarte: {
  ki: {titel: "Künstliche Intelligenz", seite: "karte",
    text: "Der Oberbegriff für Software, die Aufgaben löst, die sonst menschliches Denken brauchen. Alles, was hier folgt, ist ein Teil davon oder arbeitet damit.",
    bsp: "Beispiele: ein Navi, das Staus umfährt, eine Kamera, die Gesichter findet, ein Chatbot."},
  regel: {titel: "Regelbasierte Systeme", seite: "karte",
    text: "Menschen schreiben Wenn-dann-Regeln auf, das System führt sie aus. Es lernt nichts dazu. Das war lange der Hauptweg der KI und ist bei klaren, stabilen Regeln bis heute oft die bessere Wahl.",
    bsp: "Beispiel: ein Beratungsprogramm, das nach festen Regeln Fragen stellt und Empfehlungen ableitet."},
  ml: {titel: "Maschinelles Lernen", seite: "ml",
    text: "Statt Regeln zu schreiben, zeigt man Beispiele. Ein Verfahren findet das Muster selbst und speichert es im Modell.",
    bsp: "Probiere es aus: Lektion Maschinelles Lernen mit dem Punktespielfeld und das Labor Bildmodell anlernen."},
  dl: {titel: "Deep Learning", seite: "objekt",
    text: "Maschinelles Lernen mit neuronalen Netzen aus vielen Schichten. Sie leiten aus Rohdaten wie Pixeln, Ton oder Text selbst die wichtigen Merkmale ab. Das hat Bilderkennung und Sprache seit etwa 2012 stark verbessert.",
    bsp: "Probiere es aus: Labor Gesichtserkennung und Objekterkennung. Beide nutzen tiefe Netze."},
  gen: {titel: "Generative KI", seite: "genki",
    text: "Deep-Learning-Modelle, die neue Inhalte erzeugen: Text, Bilder, Ton, Code. Große Sprachmodelle gehören dazu.",
    bsp: "Probiere es aus: Lektion Generative KI und das Labor Sprachmodell im Chat."},
  robotik: {titel: "Robotik", seite: "robotik",
    text: "Maschinen mit Körper. Sensoren messen, eine Steuerung entscheidet, Motoren handeln. KI ist dabei ein wichtiger Baustein, aber nicht dasselbe wie Robotik.",
    bsp: "Probiere es aus: Lektion Robotik mit dem Regelkreis-Simulator."},
},

/* ====================================================================== Branchen */
bereiche: [
  {name: "Fertigung", aufgabe: "Teile auf Fehler prüfen, bevor sie weiterlaufen", f: ["sehen"],
   verfahren: "Bildklassifikation oder Objekterkennung auf Kamerabildern, direkt an der Linie.",
   warum: "Eine Kamera ermüdet nicht und prüft jedes Teil gleich. Die Entscheidung fällt in Millisekunden, deshalb läuft das Modell am Gerät.",
   labor: ["anlernen", "objekt"],
   frage: "Wie viele fehlerhafte Teile dürfen durchrutschen, und wer schaut sich Verdachtsfälle an?"},
  {name: "Logistik und Lager", aufgabe: "Pakete zählen, Paletten finden, Wege planen", f: ["sehen", "handeln"],
   verfahren: "Objekterkennung zum Zählen und Lokalisieren, Planungsverfahren für die Routen mobiler Roboter.",
   warum: "Bestand und Position ändern sich ständig. Kameras liefern den aktuellen Stand ohne manuelle Zählung.",
   labor: ["objekt", "robotik"],
   frage: "Wie genau muss die Zählung sein, und was passiert bei Verdeckung?"},
  {name: "Handel", aufgabe: "Regale auffüllen, Kundenströme verstehen", f: ["sehen"],
   verfahren: "Objekterkennung für Regalbestände, Personenzählung ohne Identifikation.",
   warum: "Leere Regale kosten Umsatz. Anonyme Zählungen zeigen, wann viel los ist.",
   labor: ["objekt", "gesicht"],
   frage: "Reicht die Zählung ohne Gesichter, und wissen Kundinnen und Kunden davon?"},
  {name: "Gesundheit", aufgabe: "Bilder auswerten und Auffälliges markieren", f: ["sehen"],
   verfahren: "Bildklassifikation und Segmentierung als zweite Meinung für Fachpersonal.",
   warum: "Das Modell entscheidet nicht, es lenkt den Blick auf Stellen, die man prüfen sollte.",
   labor: ["anlernen"],
   frage: "Wer trägt die Verantwortung, und ist die Software als Medizinprodukt zugelassen?"},
  {name: "Büro und Wissen", aufgabe: "Dokumente befragen, Besprechungen protokollieren, Entwürfe schreiben", f: ["sprache", "wissen", "erzeugen"],
   verfahren: "Sprachmodelle, RAG für eigene Dokumente, Spracherkennung für Protokolle.",
   warum: "Viel Arbeit besteht aus Suchen, Lesen und Formulieren. Das lässt sich unterstützen, wenn Quellen sichtbar bleiben.",
   labor: ["chat", "rag", "whisper"],
   frage: "Welche Dokumente dürfen in die Suche, und wer darf was finden?"},
  {name: "Sicherheit und Zutritt", aufgabe: "Anwesenheit feststellen, Bereiche überwachen", f: ["sehen"],
   verfahren: "Gesichts- und Personenerkennung.",
   warum: "Lokale Auswertung hält Videodaten im Haus und reagiert ohne Netzweg.",
   labor: ["gesicht"],
   frage: "Gibt es eine Rechtsgrundlage, und was wird wie lange gespeichert?"},
  {name: "Kundenservice", aufgabe: "Anfragen beantworten, Tickets vorsortieren", f: ["sprache", "handeln", "wissen"],
   verfahren: "Sprachmodell mit Zugriff auf eine Wissensbasis und Werkzeuge (Agent).",
   warum: "Viele Anfragen wiederholen sich. Ein Agent kann Status nachschlagen und Antworten vorbereiten.",
   labor: ["agent", "rag"],
   frage: "Ab wann übernimmt ein Mensch, und woran erkennt das System diesen Punkt?"},
],

};

/* Erweiterungsdateien (content-*.js) melden ihre Seiten so an:
     INHALT.registriere({
       seiten: { "meine-seite": { ... } },                       // wie in INHALT.seiten
       glossar: { schluessel: ["Titel", "Erklaerung"] },
       gruppen: [{ name: "Labor: Wissen", seiten: ["meine-seite"], nach: "Labor: Sprache" }],  // nach: optional, Gruppe davor
     });
   Seitenfelder zusaetzlich zu den oben genannten:
     abschnitte[].alltag   Text oder Liste von Texten: "Beispiel aus dem Alltag" (Kasten)
     abschnitte[].merke    Merksatz (Kasten)
     abschnitte[].tabelle  { beschriftung, kopf: [..], zeilen: [[..], ..] }  Vergleichstabelle (erste Spalte = Zeilenkopf)
     quiz                  [{ frage, optionen: [..], richtig: Index, erklaerung }]  Selbsttest am Seitenende
     videos                ["video-id", ..]  Videoreihe (nur gebaute Videos erscheinen)  */
window.INHALT.registriere = function (e) {
  const I = window.INHALT;
  Object.assign(I.seiten, e.seiten || {});
  Object.assign(I.glossar, e.glossar || {});
  for (const g of e.gruppen || []) {
    let ziel = I.gruppen.find((x) => x.name === g.name);
    if (!ziel) {
      ziel = { name: g.name, seiten: [] };
      const nach = g.nach ? I.gruppen.findIndex((x) => x.name === g.nach) : -1;
      if (nach >= 0) I.gruppen.splice(nach + 1, 0, ziel); else I.gruppen.push(ziel);
    }
    for (const id of g.seiten || []) if (!ziel.seiten.includes(id)) ziel.seiten.push(id);
  }
};
