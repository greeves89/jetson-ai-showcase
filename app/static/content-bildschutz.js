/* Strang Sehen: Labor "Bild schützen: freistellen und verpixeln" (Seiten-ID bild-schuetzen, Demo webcam-bildschutz in demo-bildschutz.js,
   Server app/lab_bildschutz.py). Registrierung wie am Ende von content.js beschrieben. Alle Zahlen zum Jetson sind gemessen
   (Rechnung allein, ohne Browser und Netz, Bild 480 Pixel breit); Aussagen zu Verfahren und Recht sind bewusst vorsichtig und mit dem Hinweis
   "keine Rechtsberatung" versehen. Keine echten Personen, keine Namen von Firmen oder Kunden. */
(function () {

const seiten = {

"bild-schuetzen": {
  nav: "Bild schützen", typ: "labor", gruppe: "Sehen", titel: "Bild schützen: freistellen und verpixeln", symbol: "gesicht", demo: "webcam-bildschutz",
  lernziele: [
    "Du kannst erklären, was eine Maske ist und warum sie am Rand ausfranst.",
    "Du kannst drei Fälle nennen, in denen das Freistellen scheitert.",
    "Du kannst sagen, warum ein deckender Balken sicherer ist als ein Mosaik oder ein Weichzeichner.",
    "Du kannst in einfachen Worten sagen, was für Fotos von anderen Menschen gilt, und weißt, dass das keine Rechtsberatung ist.",
  ],
  kurz: "Der Jetson trennt dich vom Hintergrund und macht Gesichter unkenntlich. Du siehst, wie eine Maske aussieht, wo sie versagt und warum ein Mosaik weniger schützt, als es aussieht.",
  abschnitte: [
    {h: "Zwei Aufgaben, ein Kamerabild",
     kurz: "Freistellen trennt Person und Hintergrund. Verpixeln macht Gesichter unkenntlich. Beides läuft hier am selben Bild.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "camera", text: "Kamerabild", sub: "480 Pixel breit"},
      {icon: "scissors", text: "Freistellen", sub: "Maske, neuer Hintergrund"},
      {icon: "eye-off", text: "Verpixeln", sub: "Gesichter finden, verdecken"},
      {icon: "image", text: "Ergebnis", sub: "geht zurück an dich", farbe: "gruen"}]},
     p: [
      "Mit dem Umschalter wählst du eine der beiden Aufgaben. Beim Freistellen sucht ein Netz die Person im Bild und ersetzt alles andere: durch einen unscharfen Hintergrund, eine Farbe oder ein Muster, das der Jetson selbst rechnet. Beim Verpixeln sucht das Gesichtsnetz {{gesicht|YuNet}} alle Gesichter und macht sie mit Mosaik, Weichzeichner oder schwarzem Balken unkenntlich.",
      "Das Bild links bleibt dein unverändertes Kamerabild. Es verlässt deinen Browser nur Bild für Bild auf dem Weg zum Jetson und kommt verändert zurück. Es wird nichts gespeichert. Der Jetson wertet jedes Bild aus und vergisst es sofort.",
    ]},
    {h: "Was eine Maske ist",
     kurz: "Eine Maske ist ein Graustufenbild. Jeder Pixel sagt, wie sicher das Netz ist, dass er zur Person gehört.",
     visual: {typ: "skala", links: "0 Hintergrund", rechts: "255 Person", marker: 0.5, label: "grau: das Netz ist unsicher"}, p: [
      "Wähle im Labor „Nur die Maske“. Du siehst ein Schwarzweißbild: Weiß heißt, das Netz ist sicher, dass dort die Person ist. Schwarz heißt Hintergrund. Alles dazwischen ist eine Zahl zwischen null und eins, also eine Wahrscheinlichkeit. Die [[maske|Maske]] ist keine Entscheidung, sie ist eine Schätzung für jeden einzelnen Pixel.",
      "Aus der Maske macht der Jetson das Ergebnis: Wo die Maske hell ist, bleibt dein Bild. Wo sie dunkel ist, kommt der neue Hintergrund. Dazwischen mischt er beide, je nach Grauwert. Das ist die ganze Zauberei. Das Netz selbst ist rund 6 Megabyte groß und rechnet auf dem Jetson etwa 25 Millisekunden je Bild (gemessen, nur die Rechnung).",
      "Die Aufgabe heißt {{vision-aufgaben|Segmentierung}}: Statt eines Rahmens um die Person bekommst du die genaue Form.",
    ], alltag: [
      "Stell dir vor, du schneidest mit der Schere eine Person aus einem Foto aus und klebst sie auf ein anderes. Die Papierschablone, die dabei übrig bleibt, ist die Maske. Das Netz zeichnet diese Schablone für jedes Bild neu und in Bruchteilen von Sekunden.",
      "Der Vergleich hinkt an einer Stelle: Eine Schere schneidet scharf. Das Netz kann nur sagen, wie sicher es sich ist. Am Rand eines Haarschopfs ist es oft gar nicht sicher.",
    ], merke: "Eine Maske ist ein Graustufenbild mit Wahrscheinlichkeiten. Sie ist eine Schätzung, kein Schnitt."},
    {h: "Warum der Rand ausfranst",
     kurz: "Das Netz sieht ein kleines Bild. Ein Haar ist dünner als ein Pixel der Maske.",
     visual: {typ: "vergleich",
      links: {titel: "Harter Rand", icon: "square", farbe: "orange", punkte: ["Jeder Pixel: Person oder nicht", "Treppen am Rand", "Alter Hintergrund blitzt auf"]},
      rechts: {titel: "Weicher Rand", icon: "layers", farbe: "gruen", punkte: ["Übergang über mehrere Pixel", "Kleine Fehler verschwimmen", "Haare wirken natürlicher"]}}, p: [
      "Das Netz bekommt das Kamerabild auf 192 mal 192 Pixel verkleinert. Seine Maske hat darum nur 192 mal 192 Punkte und wird danach auf die Bildgröße hochgerechnet. Ein einzelnes Haar ist auf dem Bild oft nur ein bis zwei Pixel breit, ein Punkt der Maske deckt mehr als zwei Pixel ab. Feine Dinge gehen dabei verloren: Haarsträhnen, Finger vor einem unruhigen Hintergrund, Fusseln am Pullover.",
      "Probiere den Regler Kantenweichheit. Bei null entscheidet jeder Pixel hart: Person oder nicht. Der Rand sieht aus wie eine Treppe. Je höher die Stufe, desto weicher geht der Rand in den neuen Hintergrund über. Das versteckt Fehler, macht aber auch echte Kanten unscharf. Deshalb gibt es keine beste Einstellung, nur eine, die zu deinem Bild passt.",
      "Zwischen zwei Bildern mischt der Jetson die Maske mit der des Bildes davor. Das beruhigt flackernde Ränder. Bei schnellen Bewegungen zieht die Maske dadurch kurz nach, ein Hauch Geisterbild am Arm. Ist der Jetson gerade stark ausgelastet, rechnet er das Netz in manchen Bildern nicht neu und nimmt die letzte Maske, damit das Video flüssig bleibt.",
    ], alltag: "Ein Mosaik aus Fliesen kann keine feine Kurve legen. Je größer die Fliese, desto mehr Treppen. Eine Maske mit 192 mal 192 Fliesen kann ein Haar nicht nachlegen, sie kann es nur grob andeuten."},
    {h: "Wo das Freistellen scheitert",
     kurz: "Glas, Haare und ähnliche Farben sind die drei klassischen Fehlerquellen. Probiere sie selbst aus.",
     visual: {typ: "raster", spalten: 4, zellen: [
      {icon: "droplets", text: "Glas", sub: "Hintergrund scheint durch"},
      {icon: "wand-sparkles", text: "Haare", sub: "dünn und halbdurchsichtig"},
      {icon: "image", text: "Gleiche Farbe", sub: "Pullover wie Wand"},
      {icon: "users", text: "Mehrere", sub: "wer gehört dazu?"}]}, p: [
      "**Glas:** Durch ein Glas oder eine Brille sieht man den Hintergrund. Für die Maske ist ein Glas Hintergrund oder Person, sie kennt kein „halb“ im Sinne von durchsichtig. Halte ein Glas vor dich und beobachte, was passiert.",
      "**Haare:** Lockige oder abstehende Haare sind fein und lassen Licht durch. Die Maske schneidet sie ab oder lässt Hintergrund zwischen den Strähnen stehen.",
      "**Ähnliche Farbe:** Trägst du eine Jacke in der Farbe der Wand, fehlt dem Netz der Kontrast. Dann sind auch Form und Umriss unsicherer, und die Maske wird grauer.",
      "**Dinge in der Hand:** Eine Tasse, ein Buch oder eine Puppe gehört für uns zur Person, für das Netz oft nicht. Das Netz sucht Menschen, nicht alles, was sie halten.",
      "Das Netz zeigt nie eine Fehlermeldung. Es liefert immer eine Maske, auch eine schlechte. Du musst selbst hinsehen.",
    ], merke: "Ein Freistellen ohne Fehlermeldung ist nicht fehlerfrei. Prüfe den Rand, vor allem bei Haaren und Glas."},
    {h: "Videokonferenz und Greenscreen",
     kurz: "Dein Zimmer unscharf oder ein Strand dahinter: Das ist dieselbe Maske. Ein Greenscreen arbeitet anders.",
     visual: {typ: "vergleich",
      links: {titel: "Greenscreen", icon: "square", farbe: "gruen", punkte: ["Schlüssel ist die Farbe", "Sehr genau am Rand", "Braucht Wand und Licht"]},
      rechts: {titel: "KI-Maske", icon: "scan-face", farbe: "akzent", punkte: ["Schlüssel ist die Form", "Funktioniert im Zimmer", "Fehler bei Haar und Glas"]}}, p: [
      "Videoprogramme, die deinen Hintergrund unscharf machen oder austauschen, arbeiten mit einer Maske wie hier. Oft rechnet sie dein eigener Rechner oder dein Handy, damit das Bild nicht erst weggeschickt werden muss. Ob das bei einem bestimmten Programm so ist, steht in seinen Datenschutzangaben.",
      "Beim [[greenscreen|Greenscreen]] ist es anders. Dort wird eine einfarbige Wand gefilmt, und alles, was grün ist, wird durchsichtig gemacht. Das Verfahren heißt Chroma-Key und braucht keine KI. Es ist sehr genau, solange die Wand gleichmäßig beleuchtet ist und niemand etwas Grünes trägt. Im Labor kannst du Einfarbig mit Grün wählen: Das sieht aus wie ein Greenscreen, nur dass das Netz die Person findet und nicht die Farbe.",
    ], tabelle: {
      beschriftung: "Greenscreen und KI-Maske im Vergleich",
      kopf: ["", "Greenscreen", "KI-Maske"],
      zeilen: [["Woran erkennt es die Person?", "An der Farbe der Wand", "An der Form, die das Netz gelernt hat"], ["Was braucht es?", "Wand, gleichmäßiges Licht", "Ein Netz und Rechenleistung"], ["Wo versagt es?", "Grüne Kleidung, Schatten, Falten in der Wand", "Haare, Glas, ähnliche Farben"], ["Wie sicher ist der Rand?", "Meist sehr gut", "Eine Schätzung je Pixel"]],
    }},
    {h: "Gesichter unkenntlich machen",
     kurz: "Erst findet der Jetson jedes Gesicht, dann verdeckt er es. Was er nicht findet, bleibt sichtbar.",
     visual: {typ: "ablauf", schritte: [
      {icon: "scan-face", text: "Gesicht finden", sub: "YuNet"},
      {icon: "scan", text: "Rahmen größer", sub: "Stirn, Haare, Ohren"},
      {icon: "grid-3x3", text: "Verdecken", sub: "Mosaik, Weichzeichner, Balken", farbe: "gruen"}]}, p: [
      "Das Gesichtsnetz liefert Rahmen um die Gesichter. Der Rahmen sitzt eng, Stirn, Haaransatz und Ohren fehlen oft. Darum macht der Jetson ihn vor dem Verdecken größer. Zusätzlich sucht er mit einer niedrigeren Schwelle als im Gesichts-Labor, denn hier ist ein Fehlalarm harmlos und ein übersehenes Gesicht nicht.",
      "Wird ein Gesicht in einem Bild kurz nicht gefunden, bleibt sein letzter Rahmen noch vier Bilder lang verdeckt. Sonst blitzt es zwischendurch auf. Das Labor zeigt es an, wenn das passiert.",
      "Die Grenze: Seitlich gedrehte, sehr kleine, stark geneigte oder verdeckte Gesichter findet das Netz schlechter. Was es nicht findet, wird nicht verdeckt. Wer ein Foto schützen will, schaut sich das Ergebnis immer selbst an.",
      "Das Verpixeln rechnet auf dem Jetson etwa 13 bis 22 Millisekunden je Bild, das Freistellen etwa 45 bis 55 (gemessen, nur die Rechnung, ohne Browser und Netz).",
    ]},
    {h: "Verpixeln ist nicht immer sicher",
     kurz: "Ein Mosaik und ein Weichzeichner verstecken ein Gesicht für dein Auge. Für ein Programm bleibt oft etwas übrig. Ein deckender Balken lässt nichts übrig.",
     visual: {typ: "vergleich",
      links: {titel: "Mosaik, Weichzeichner", icon: "grid-3x3", farbe: "orange", punkte: ["Information bleibt, nur vergröbert", "Programme können teils zuordnen", "Reicht für Zufallsblicke"]},
      rechts: {titel: "Deckender Balken", icon: "square", farbe: "gruen", punkte: ["Keine Bildinformation darunter", "Nichts zurückzuholen", "Sieht hässlicher aus"]}}, p: [
      "Ein Mosaik ersetzt viele Pixel durch wenige Kästchen. Das Labor zählt es dir vor. In einem Testbild hatte ein Gesicht 945 Pixel und nach einem Mosaik mit 14 Blöcken quer noch 252 Farbwerte. Das ist weniger, aber nicht null. Ein Weichzeichner löscht gar keine Werte, er vermischt sie nur. Der Balken lässt genau einen Wert übrig: Schwarz.",
      "Forschende haben gezeigt, dass Programme verpixelte oder verwischte Gesichter in Versuchen oft noch richtigen Personen zuordnen können, vor allem wenn die Auswahl klein ist, zum Beispiel eine bekannte Gruppe. Auch Texte hinter einem Mosaik lassen sich teilweise wieder lesbar machen. Das Mosaik ist also kein Beweis, dass niemand etwas erkennt. Das Labor führt so eine Entschlüsselung nicht vor. Du kannst hier nur prüfen, was dein eigenes Auge noch erkennt.",
      "Der Regler Blockgröße zeigt dir, wie viele Kästchen ein Gesicht hat. Stelle ihn von fein nach grob und achte darauf, ab welcher Stufe du selbst dich nicht mehr erkennst. Das ist deine eigene Beobachtung und kein Messwert. Andere Menschen, andere Gesichter und ein Programm können eine andere Grenze haben.",
      "Ein Balken schützt nur, wenn er fest ins Bild eingebrannt wird. In manchen Dateien und Programmen bleibt das Original darunter als eigene Ebene oder als kleine Vorschau in den Dateiangaben erhalten. Speichere das Ergebnis neu als flaches Bild, oder mache eine Bildschirmaufnahme, bevor du es verschickst.",
    ], merke: "Sicher ist, was nicht mehr im Bild steht. Ein deckender Balken ist sicherer als Mosaik und Weichzeichner."},
    {h: "Recht am eigenen Bild: Fotos von anderen",
     kurz: "Fotos von Menschen darfst du meist nicht einfach ins Netz stellen. Verpixeln hilft, ersetzt aber keine Einwilligung. Keine Rechtsberatung.",
     visual: {typ: "ablauf", schritte: [
      {icon: "camera", text: "Foto machen", sub: "meist erlaubt"},
      {icon: "users", text: "Fragen", sub: "Einwilligung holen"},
      {icon: "shield-check", text: "Veröffentlichen", sub: "nur mit Einwilligung oder Schutz", farbe: "gruen"}]}, p: [
      "In Deutschland hat jede Person ein Recht am eigenen Bild. Grob gilt: Ein Foto, auf dem jemand zu erkennen ist, darfst du in der Regel nur verbreiten oder ins Netz stellen, wenn diese Person eingewilligt hat. Es gibt Ausnahmen, etwa für Menschen, die nur zufällig im Hintergrund stehen, oder für Versammlungen. Ob eine Ausnahme passt, ist oft Auslegungssache. Dazu kommt der Datenschutz: Ein Foto mit erkennbaren Menschen ist eine personenbezogene Angabe.",
      "Bei Kindern und Jugendlichen gilt es genauer. Für Fotos von Minderjährigen holen Schulen und Vereine in der Regel eine schriftliche Einwilligung der Sorgeberechtigten ein. Ältere Jugendliche sollten zusätzlich selbst gefragt werden. Ein Klassenfoto auf der öffentlichen Schulwebsite ist deshalb nichts, was eine Lehrkraft oder ein Elternteil mal eben hochlädt.",
      "Verpixeln ist ein Schutz, aber kein Ersatz für die Frage. Ob jemand auch ohne Gesicht erkennbar bleibt, hängt von Kleidung, Ort, Haaren und dem Umfeld des Fotos ab. Im Zweifel fragst du die Person, oder du veröffentlichst das Foto nicht. Das ist ein Überblick und keine Rechtsberatung. Bei einem konkreten Fall helfen die Schulleitung, der Datenschutzbeauftragte oder eine Beratungsstelle.",
      "Mehr zum Recht findest du auf der Seite {{recht|Recht und Regeln}}, zum Alltag auf {{datenschutz-im-alltag|Datenschutz im Alltag}} und zur Frage, was dieses Labor selbst speichert, auf {{sicherheit-einfach|Ist das sicher?}}.",
    ]},
    {h: "Deepfakes: nur ein kurzer Bezug",
     kurz: "Wer Personen ausschneiden und Gesichter finden kann, hat zwei Bausteine einer Fälschung.",
     p: [
      "Für viele Fälschungen braucht es dieselben Bausteine, die du hier siehst: ein Gesicht finden, die Person ausschneiden, etwas anderes einsetzen. Das Labor zeigt nur diese ersten Schritte, keine Fälschung. Wie Fälschungen entstehen und was du tun kannst, wenn du eine siehst oder selbst betroffen bist, steht auf der Seite {{fake-news-deepfakes|Fake News und Deepfakes}}. Dein Auge trainierst du im Spiel {{echt-oder-ki|Echt oder KI?}}.",
    ]},
    {h: "Für Lehrkräfte: eine Stunde zu Bildschutz und Recht am eigenen Bild",
     kurz: "45 Minuten: Maske sehen, Verpixeln prüfen, über Einwilligung sprechen.",
     liste: [
      "**Vorbereitung (vorab):** Das Labor ist ab 16 Jahren gedacht. Mit jüngeren Klassen führst du es selbst vor: eigene Kamera, nur du im Bild. Die Klasse beobachtet und stellt Fragen.",
      "**Einstieg (5 Minuten):** Frage: Habt ihr schon einmal ein Foto gesehen, auf dem jemand verpixelt war? Warum?",
      "**Maske (10 Minuten):** Wähle „Nur die Maske“. Die Klasse beschreibt, was sie sieht. Dann Glas oder Haare ins Bild: Wo versagt es? Die Klasse sammelt Vermutungen, du prüfst sie live.",
      "**Verpixeln (10 Minuten):** Gesichter unkenntlich machen, Blockgröße von fein nach grob. Auftrag: Ab welcher Stufe erkennt ihr die Person nicht mehr? Danach Balken zeigen und fragen, was darunter noch steht.",
      "**Recht (10 Minuten):** Fallbeispiele: Klassenfoto auf der Schulwebsite, Foto vom Schulhof in einer Chatgruppe, Foto vom Sportfest. Die Klasse klärt, wen sie fragen müsste und wie. Verweis auf die Schulordnung und die Schulleitung.",
      "**Abschluss (5 Minuten):** Drei Merksätze auf die Tafel. Die Quizfragen unten als Exit-Ticket.",
     ]},
  ],
  mitnehmen: [
    "Eine Maske ist ein Graustufenbild mit einer Wahrscheinlichkeit je Pixel. Am Rand, bei Haaren und bei Glas ist sie unsicher.",
    "Ein Mosaik und ein Weichzeichner lassen Information im Bild. Ein deckender Balken lässt keine übrig. Was der Jetson nicht als Gesicht findet, bleibt sichtbar.",
    "Fotos von anderen brauchen in der Regel ihre Einwilligung, bei Minderjährigen die der Sorgeberechtigten. Verpixeln ersetzt das nicht. Das ist keine Rechtsberatung.",
  ],
  quiz: [
    {frage: "Was zeigt die Maske, wenn du im Labor „Nur die Maske“ wählst?", optionen: ["Ein Foto ohne Hintergrund", "Für jeden Pixel, wie sicher das Netz ist, dass er zur Person gehört", "Die Umrisse als dünne Linie", "Alle Gesichter im Bild"], richtig: 1, erklaerung: "Die Maske ist ein Graustufenbild: weiß heißt sicher Person, schwarz Hintergrund, grau unsicher."},
    {frage: "Warum franst das Haar am Rand oft aus?", optionen: ["Das Netz sieht ein kleines Bild und seine Maske ist grober als ein einzelnes Haar", "Haare sind zu dunkel", "Die Kamera ist kaputt", "Das Netz mag keine Frisuren"], richtig: 0, erklaerung: "Die Maske hat nur 192 mal 192 Punkte, ein Haar ist oft dünner als ein Punkt. Feine Strähnen gehen verloren."},
    {frage: "Welcher Weg macht ein Gesicht am sichersten unkenntlich?", optionen: ["Ein feines Mosaik", "Ein leichter Weichzeichner", "Ein deckender, fest eingebrannter Balken", "Ein Filter, der das Gesicht heller macht"], richtig: 2, erklaerung: "Beim Balken steht keine Bildinformation mehr im Bild. Mosaik und Weichzeichner lassen vergröberte Information übrig, die sich teils erraten lässt."},
    {frage: "Was unterscheidet einen Greenscreen von der KI-Maske?", optionen: ["Beide brauchen eine grüne Wand", "Der Greenscreen erkennt die Person an der Form, die KI an der Farbe", "Es gibt keinen Unterschied", "Der Greenscreen erkennt an der Farbe der Wand, die KI an der Form der Person"], richtig: 3, erklaerung: "Der Greenscreen macht die Wandfarbe durchsichtig. Die KI-Maske schätzt, welche Pixel zur Person gehören, und braucht keine Wand."},
    {frage: "Eine Lehrkraft will ein Klassenfoto auf die öffentliche Schulwebsite stellen. Was ist der vorsichtige Weg?", optionen: ["Einfach hochladen, es ist ja nur die Klasse", "Gesichter verpixeln, dann braucht es nie eine Frage", "Vorher die Einwilligung der Sorgeberechtigten einholen oder das Foto nicht veröffentlichen", "Das Foto in den Chat der Eltern stellen statt auf die Website"], richtig: 2, erklaerung: "Bei Minderjährigen holt man in der Regel eine Einwilligung ein. Verpixeln hilft, ersetzt die Frage aber nicht. Keine Rechtsberatung."},
    {frage: "Der Jetson findet ein Gesicht im Bild nicht. Was passiert mit ihm?", optionen: ["Es wird trotzdem verpixelt", "Es bleibt sichtbar", "Das Labor meldet einen Fehler", "Das Gesicht wird automatisch schwarz"], richtig: 1, erklaerung: "Verdeckt wird nur, was gefunden wird. Seitlich gedrehte, sehr kleine oder verdeckte Gesichter werden schlechter gefunden. Schau dir das Ergebnis immer selbst an."},
  ],
  business: {
    text: "Produktfotos freistellen, Gesichter in Aufnahmen aus Werkshallen, Baustellen oder Pausenhöfen unkenntlich machen, Hintergrund in Videokonferenzen. Bei Gesichtern in Aufnahmen vorab klären, ob und wie lange sie überhaupt gespeichert werden dürfen und wer zugestimmt hat.",
    beispiele: ["Produktfoto ohne den unruhigen Hallenhintergrund", "Fotos für die Dokumentation, auf denen Beschäftigte nicht erkennbar sein sollen"],
  },
  grenzen: [
    "Haare, Glas, ähnliche Farben und Dinge in der Hand bringen die Maske durcheinander. Das Netz meldet keinen Fehler, es liefert immer eine Maske.",
    "Gesichter, die der Jetson nicht findet, bleiben sichtbar: seitlich, sehr klein, stark geneigt oder verdeckt.",
    "Mosaik und Weichzeichner sind kein sicherer Schutz gegen ein Programm. Nur ein fest eingebrannter, deckender Balken lässt nichts übrig.",
    "Das Bild links bleibt unverändert. Das Labor zeigt, wie Schutz funktioniert. Ein fertig geschütztes Foto erzeugt es nicht.",
  ],
  weiter: ["gesicht", "hand-gesicht", "fake-news-deepfakes", "echt-oder-ki", "recht", "sicherheit-einfach"],
},

};

const glossar = {
  maske: ["Maske", "Ein Graustufenbild in der Größe des Kamerabilds. Jeder Pixel trägt eine Zahl, die sagt, wie sicher das Netz ist, dass er zur Person gehört. Weiß ist Person, Schwarz Hintergrund."],
  greenscreen: ["Greenscreen", "Eine einfarbig grüne Wand hinter der Person. Eine Software macht alles Grüne durchsichtig und setzt dort einen anderen Hintergrund ein. Das Verfahren heißt Chroma-Key und braucht keine KI."],
};

window.INHALT.registriere({
  seiten,
  glossar,
  gruppen: [{ name: "Sehen", seiten: ["bild-schuetzen"] }],
});

/* Reihenfolge in der Navigation: direkt hinter den Gesichts- und Hand-Laboren. */
const gSehen = window.INHALT.gruppen.find((x) => x.name === "Sehen");
const nach = gSehen.seiten.indexOf("hand-gesicht");
gSehen.seiten = gSehen.seiten.filter((id) => id !== "bild-schuetzen");
gSehen.seiten.splice(nach >= 0 ? nach + 1 : gSehen.seiten.length, 0, "bild-schuetzen");

})();
