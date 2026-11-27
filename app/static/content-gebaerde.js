/* Labor "Fingeralphabet" (Seite fingeralphabet, Gruppe Sehen). Format: docs/schreibleitfaden.md und docs/visuals.md.
   Die Messzahlen in der Tabelle kommen aus dem Block MESSUNG unten: Ihn schreibt scripts/gebaerde_vorlagen_bauen.py aus derselben
   Messung, die in app/static/daten/gebaerde-vorlagen.json steht (tests/gebaerde_test.py prüft, dass beides übereinstimmt).
   Keine Namen von Personen oder Firmen, keine Fotos. Der Text behauptet nicht, dass Gebärdensprache übersetzt wird. */
(function () {

/*MESSUNG:BEGIN*/
const MESSUNG = {"sicher": ["A", "B", "G", "I", "K", "L", "M", "S", "T", "W", "X", "Y"], "unsicher": [["C", "D"], ["D", "O"], ["E", "S"], ["F", "C"], ["H", "N"], ["N", "H"], ["O", "C"], ["P", "K"], ["Q", "T"], ["R", "U"], ["U", "R"], ["V", "U"]]};
/*MESSUNG:ENDE*/

const sicher = MESSUNG.sicher || [];
const unsicher = MESSUNG.unsicher || [];
const unsicherText = unsicher.map(([z, nachbar]) => z + " (mit " + nachbar + ")");
const NICHT = ["J", "Z", "Ä", "Ö", "Ü", "ß", "Sch"];

const seiten = {

"fingeralphabet": {
  nav: "Fingeralphabet", typ: "labor", gruppe: "Sehen", titel: "Fingeralphabet: Buchstaben mit der Hand", symbol: "hand", demo: "webcam-gebaerde",
  lernziele: [
    "Du kannst sagen, was das Fingeralphabet ist und warum es nicht die Gebärdensprache ist.",
    "Du kannst erklären, wie aus 21 Handpunkten eine Handform wird und wie sicher das Labor dabei ist.",
    "Du kannst nennen, was das Labor nicht kann: Gebärdensprache übersetzen, bewegte Zeichen lesen und jede Hand gleich gut erkennen.",
  ],
  kurz: "Zeige der Kamera Buchstaben des deutschen Fingeralphabets, und das Labor baut daraus Wörter. Oder tippe ein Wort, und die Hand zeigt es dir Buchstabe für Buchstabe.",
  zusammenfassung: "Labor zum deutschen Fingeralphabet in beide Richtungen. Erkennen: Die Kamera sieht eine Hand, ein Handmodell liefert 21 Punkte, daraus werden Merkmale gerechnet und mit selbst gebauten Handform-Vorlagen verglichen. Wer eine Form etwa 0,8 Sekunden hält, bestätigt einen Buchstaben. Zeigen: Ein Wort wird Buchstabe für Buchstabe als gezeichnete Hand gezeigt, dazu das ganze Alphabet und eine Übung mit Rückmeldung. Das Fingeralphabet ist nicht die Deutsche Gebärdensprache, und das Labor übersetzt keine Gebärdensprache. J, Z, Ä, Ö, Ü, ß und Sch werden nicht erkannt. Die Vorlagen sind Modelle, an echten Händen wurde die Erkennung nicht gemessen. Bilder bleiben im Arbeitsspeicher, nichts wird gespeichert.",
  abschnitte: [
    {h: "Was das Fingeralphabet ist",
     kurz: "Jeder Buchstabe hat eine Handform. So buchstabierst du Namen und Fremdwörter mit einer Hand.",
     visual: {typ: "ablauf", schritte: [
      {icon: "type", text: "Name", sub: "zum Beispiel Lena"},
      {icon: "list-checks", text: "Buchstaben", sub: "L, E, N, A"},
      {icon: "hand", text: "Handformen", sub: "eine nach der anderen", farbe: "gruen"}]},
     p: [
      "Das Fingeralphabet gibt jedem Buchstaben eine Handform. Wer „Lena“ buchstabiert, zeigt nacheinander die Formen für L, E, N und A. Im deutschen Alphabet sind es etwa dreißig Formen: die 26 Buchstaben, Ä, Ö, Ü, ß und Sch.",
      "Gehörlose und schwerhörige Menschen nutzen es vor allem für Namen, Orte und Wörter, für die es noch keine eigene Gebärde gibt. Hörende lernen es oft zuerst, weil es überschaubar ist.",
    ], alltag: "Am Telefon buchstabierst du deinen Nachnamen: „M wie Martha“. Das Fingeralphabet macht dasselbe mit der Hand. Der Vergleich hinkt an einer Stelle: Am Telefon ersetzt du Buchstaben durch andere Wörter, hier durch Handformen."},
    {h: "Fingeralphabet und Gebärdensprache sind nicht dasselbe",
     kurz: "Die Deutsche Gebärdensprache (DGS) ist eine eigene Sprache. Das Fingeralphabet ist nur ein Hilfsmittel darin.",
     visual: {typ: "vergleich",
      links: {titel: "Fingeralphabet", icon: "hand", farbe: "grau", punkte: ["Buchstabe für Buchstabe", "Überträgt Deutsch auf die Hand", "Für Namen und Fremdwörter"]},
      rechts: {titel: "Gebärdensprache (DGS)", icon: "languages", farbe: "gruen", punkte: ["Eigene Grammatik", "Hände, Mimik, Raum, Bewegung", "Eine vollständige Sprache"]}},
     p: [
      "Die [[dgs|Deutsche Gebärdensprache]] hat eigenen Wortschatz und eigene Grammatik. Sie baut nicht auf dem Deutschen auf. Eine Gebärde entsteht aus Handform, Ort, Bewegung und Mimik zusammen. Das Fingeralphabet dagegen überträgt die deutsche Schreibweise auf die Hand, Buchstabe für Buchstabe.",
      "Dieses Labor liest nur Handformen. **Es übersetzt keine Gebärdensprache und versteht keine Gebärden.** Mit dem Labor lässt sich kein Gespräch in DGS verstehen. Wer Gebärdensprache lernen will, lernt sie am besten bei gehörlosen Lehrenden und gemeinsam mit gehörlosen Menschen. Sie sind die Fachleute für ihre Sprache.",
      "Wo du anfangen kannst (Quellen geprüft am 27.11.2026): Der [Deutsche Gehörlosen-Bund](https://gehoerlosenbund.de/) führt auf seiner Seite eine Liste von Gebärdensprachschulen und weist darauf hin, dass viele Volkshochschulen DGS-Kurse anbieten. Das Forschungsprojekt [DGS-Korpus der Universität Hamburg](https://www.sign-lang.uni-hamburg.de/dgs-korpus/) dokumentiert die Sprache und stellt ein Wörterbuch bereit.",
    ], merke: "Das Fingeralphabet ist ein Werkzeug für Namen und Fremdwörter. Die Gebärdensprache ist eine ganze Sprache."},
    {h: "So liest das Labor eine Handform",
     kurz: "Hand finden, 21 Punkte setzen, Merkmale rechnen, mit Vorlagen vergleichen. Ein Netz liest keine Buchstaben.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "camera", text: "Kamerabild", sub: "480 mal 360"},
      {icon: "scan", text: "Hand finden", sub: "Handfläche im Bild"},
      {icon: "grid-3x3", text: "21 Punkte", sub: "Gelenke und Spitzen"},
      {icon: "list-checks", text: "Merkmale", sub: "Finger, Daumen, Lage"},
      {icon: "hand", text: "Buchstabe", sub: "mit Sicherheit", farbe: "gruen"}]},
     p: [
      "Zuerst findet ein Netz die Hand und setzt die 21 [[handpunkte|Handpunkte]], so wie im Labor {{hand-gesicht|Hände und Gesichter}}. Danach arbeitet kein Netz mehr. Aus den Punkten rechnet das Labor Merkmale: Wie gestreckt ist jeder Finger? Wo liegt die Daumenspitze zu den anderen Fingerspitzen? Wie weit sind die Spitzen voneinander entfernt, und sind zwei Finger gekreuzt? In welche Richtung zeigt die Hand?",
      "Alle Maße sind auf die Handgröße bezogen, die Drehung der Hand im Bild ändert die meisten nicht, und sie sehen bei linker und rechter Hand gleich aus. Jede Vorlage hat dieselben Merkmale. Je kleiner der gewichtete [[merkmalsabstand|Abstand]] zu einer Vorlage ist, desto ähnlicher ist die Handform. Aus den Abständen zu allen Vorlagen wird eine Sicherheit. Liegt sie unter 60 Prozent, sagt das Labor „nicht sicher“ und übernimmt nichts.",
      "Ein Buchstabe zählt, wenn du die Form etwa 0,8 Sekunden ruhig hältst. Fünf Bilder werden dafür zusammen angesehen, damit ein einzelnes Fehlbild nichts ändert. Leerzeichen und Löschen sind Gesten: eine ganz offene Hand und eine Faust mit dem Daumen nach unten. Die Gesten laufen durch dieselbe Erkennung wie die Buchstaben.",
    ], alltag: "Eine Ziffer erkennst du an Merkmalen: oben ein Bogen, unten ein Strich, eine Schlaufe. Das Labor macht es mit Fingern: Welche sind gestreckt, wo liegt der Daumen? Der Vergleich hinkt: Du hast die Merkmale aus Erfahrung gelernt. Dem Labor hat sie ein Mensch aufgeschrieben."},
    {h: "Woher die Vorlagen kommen",
     kurz: "Es gibt keine Fotosammlung und kein trainiertes Buchstabennetz. Die Vorlagen sind aus der Beschreibung des Alphabets nachgebaut.",
     visual: {typ: "ablauf", schritte: [
      {icon: "book-open", text: "Beschreibung", sub: "des Alphabets"},
      {icon: "sliders-horizontal", text: "Handmodell", sub: "Gelenkwinkel"},
      {icon: "grid-3x3", text: "21 Punkte", sub: "je Buchstabe"},
      {icon: "hand", text: "Zeigen und Erkennen", sub: "dieselben Daten", farbe: "gruen"}]},
     p: [
      "Das Labor lernt nichts aus deinen Bildern. Besucherdaten dienen nie als Trainingsmaterial, und im Repository liegen keine Handfotos. Stattdessen ist ein einfaches Handmodell nach der Beschreibung des deutschen Einhand-Fingeralphabets eingestellt: Beugewinkel für jedes Fingergelenk, Lage des Daumens, Drehung der Hand. Daraus entstehen die 21 Punkte je Buchstabe.",
      "Dieselbe Punktdatei zeichnet die Hände auf der Seite und dient der Erkennung als Vergleich. So können Zeigen und Erkennen nicht auseinanderlaufen. Ein Test prüft, dass jede Vorlage von der eigenen Erkennung richtig erkannt wird, auch gespiegelt, gedreht und mit zufälligem Rauschen auf den Punkten.",
      "Was das bedeutet: Die Vorlagen sind Modelle, keine Messungen an echten Händen. Eine echte Hand sieht anders aus als das Modell, und das Handnetz setzt die Punkte nicht perfekt. Wie gut das mit echten Händen klappt, ist nicht gemessen. Das kann nur Ausprobieren zeigen.",
    ], merke: "Die Erkennung wurde nur an den Vorlagen geprüft. Ob deine Hand erkannt wird, siehst du selbst im Labor."},
    {h: "Was sicher geht, was unsicher ist und was fehlt",
     kurz: "Die Tabelle zeigt, welche Handformen sich im Test gut trennen ließen und welche ähnlich sind.",
     visual: {typ: "zahlen", kacheln: [
      {wert: String(sicher.length), label: "im Test sicher", icon: "circle-check"},
      {wert: String(unsicher.length), label: "im Test unsicher", icon: "triangle-alert"},
      {wert: String(NICHT.length), label: "nicht erkannt", icon: "circle-x"}]},
     p: [
      "Gemessen wurde an den Vorlagen: Jede Handform wurde 40 Mal als Variante erzeugt, mit gestreuten Fingerwinkeln (Streuung etwa 14 Grad), Rauschen auf den Punkten und leichter Drehung, und dann erkannt. „Sicher“ heißt: Mindestens 85 von 100 Varianten wurden richtig bestimmt. Das sagt, wie leicht sich die Handformen untereinander verwechseln lassen. Es sagt nicht, wie gut echte Hände erkannt werden.",
      "Nicht erkannt werden J, Z, Ä, Ö, Ü, ß und Sch. J und Z werden durch eine Bewegung gezeigt, Ä, Ö, Ü und ß sind A, O, U und S mit einer kurzen Bewegung nach unten, und Sch ist dieselbe Handform wie die Geste für das Leerzeichen. Eine einzelne Handform sagt bei diesen Zeichen nicht genug. Sie sind im Alphabet und im Teil „Wort zeigen“ als Bewegung zu sehen, und beim Wort lesen tippst du sie ein.",
    ], tabelle: {
      beschriftung: "Erkennung im Test an den Vorlagen (Simulation mit Streuung, nicht an echten Händen gemessen)",
      kopf: ["Gruppe", "Zeichen"],
      zeilen: [
        ["Im Test sicher", sicher.join(", ") + ", dazu die Gesten Leerzeichen und Löschen"],
        ["Im Test unsicher (in Klammern: der Nachbar, mit dem sie verwechselt werden)", unsicherText.join(", ")],
        ["Nicht erkannt", "J, Z, Ä, Ö, Ü, ß, Sch (Bewegung oder keine eigene Handform)"],
      ],
    }},
    {h: "Zeigen: vom Wort zur Hand",
     kurz: "Tippe ein Wort, die Hand zeigt es Buchstabe für Buchstabe. Mit Wiederholen, Tempo und dem ganzen Alphabet.",
     visual: {typ: "raster", spalten: 4, zellen: [
      {icon: "scan-search", text: "Wort lesen", sub: "Kamera"},
      {icon: "target", text: "Üben", sub: "mit Rückmeldung"},
      {icon: "type", text: "Wort zeigen", sub: "ohne Kamera"},
      {icon: "book-open", text: "Alphabet", sub: "zum Nachschlagen"}]},
     p: [
      "Unter dem Kamerabild liegen vier Bereiche. In „Wort lesen“ baust du mit der Kamera ein Wort. In „Üben“ nennt dir die Seite einen Buchstaben oder ein Wort, du zeigst es, und die Seite sagt dir, wie nah du an der Vorlage bist und was du ändern kannst, zum Beispiel einen Finger strecken. „Wort zeigen“ und „Alphabet“ brauchen keine Kamera.",
      "Die gezeichneten Hände entstehen aus denselben 21 Punkten wie die Vorlagen der Erkennung. Beim Wechsel von einem Buchstaben zum nächsten gleitet die Hand ruhig in die neue Form. Mit „Langsam“ hast du mehr Zeit, mit „Wiederholen“ siehst du das Wort noch einmal. Bei J, Z, den Umlauten und ß läuft die Bewegung mit, bei J und Z mit einer Spur.",
    ]},
    {h: "Linkshänder und gespiegelte Hände",
     kurz: "Die Erkennung liest linke und rechte Hand. Die Zeichnungen lassen sich spiegeln.",
     visual: {typ: "vergleich",
      links: {titel: "Erkennung", icon: "scan-search", farbe: "gruen", punkte: ["Linke und rechte Hand", "Auch gespiegelt", "Kein Umschalten nötig"]},
      rechts: {titel: "Zeichnung", icon: "hand", farbe: "akzent", punkte: ["Zeigt eine Hand", "Schalter spiegelt sie", "Für Linkshänder"]}},
     p: [
      "Die Merkmale sind so gewählt, dass sie sich beim Spiegeln nicht ändern. Ob du mit links oder rechts buchstabierst, die Erkennung liest beides. Ein Test spiegelt jede Vorlage und prüft, dass dasselbe herauskommt. Auch Hand und Handrücken zur Kamera sehen für die Merkmale gleich aus.",
      "Die Zeichnungen zeigen eine Hand. Mit dem Schalter „Linkshänder“ spiegelst du alle Zeichnungen, damit sie zu deiner Hand passen. Das Zeigen gilt dann für alle Wörter, die Alphabetkarten und die Übung.",
    ]},
    {h: "Grenzen und Fehler",
     kurz: "Verdeckte Finger, ähnliche Handformen und Fäuste sind schwer. Das Labor sagt dann lieber „nicht sicher“.",
     visual: {typ: "raster", spalten: 4, zellen: [
      {icon: "eye-off", text: "Verdeckung", sub: "Finger hinter der Hand"},
      {icon: "layers", text: "Ähnlich", sub: "M und N, U und R"},
      {icon: "hand", text: "Fäuste", sub: "A, S, E, T"},
      {icon: "sun", text: "Licht", sub: "Gegenlicht, Schatten"}]},
     p: [
      "Das Handnetz setzt auch dann 21 Punkte, wenn Finger verdeckt sind. Es schätzt sie. Zeigt ein Finger zur Kamera, sieht er im Bild kurz aus, und die Streckung wird falsch gelesen.",
      "Manche Buchstaben unterscheiden sich nur durch kleine Dinge. Bei M und N liegen drei oder zwei Finger über dem Daumen. Bei U, V und R unterscheidet sich nur, ob die Finger zusammen, gespreizt oder gekreuzt sind. Bei den Fäusten A, S und E entscheidet die Lage des Daumens. Dabei ist der Unterschied oft kleiner als die Ungenauigkeit der Punkte. In der Tabelle oben siehst du, welche Paare das Labor schon in der Simulation verwechselt.",
      "Mehrere Hände im Bild: Das Labor liest nur eine. Handschuhe, Gegenlicht und eine Hand, die nah an der Kamera die ganze Fläche füllt, machen die Punkte ungenauer. Ob Hände unterschiedlicher Hautfarbe, Größe und Form gleich gut erkannt werden, wurde hier nicht gemessen. Wer ungewöhnliche Hände hat, etwa mit fehlenden oder steifen Fingern, wird oft schlechter erkannt, weil das Modell solche Formen selten gesehen hat. Das ist ein Grund mehr, Handformen nicht als Prüfung eines Menschen zu verwenden.",
    ], merke: "Wenn das Labor „nicht sicher“ sagt, ist das keine Panne, sondern die richtige Antwort."},
    {h: "Datenschutz und Recht",
     kurz: "Bilder bleiben im Arbeitsspeicher, nichts wird gespeichert, auch nicht, was du buchstabierst.",
     visual: {typ: "ablauf", schritte: [
      {icon: "camera", text: "Bild", sub: "kurz im Speicher"},
      {icon: "hand", text: "Handpunkte", sub: "werden gerechnet"},
      {icon: "trash-2", text: "Verworfen", sub: "nichts gespeichert", farbe: "gruen"}]},
     p: [
      "Jedes Bild geht für einen Augenblick an den Jetson, wird ausgewertet, gezeichnet und verworfen. Es wird nichts auf die Platte geschrieben und nichts protokolliert, auch nicht, welche Buchstaben du zeigst. Das Wort steht nur in deinem Browser. Nur wenn du „Vorlesen“ drückst, geht das Wort einmal zum Sprechen an den Jetson und wird dort ebenfalls nicht gespeichert.",
      "Das Labor erkennt keine Personen und merkt sich keine Handdaten. Zeigen kann das Kamerabild trotzdem mehr als deine Hand. Halte sie vor eine ruhige Wand. Sind andere Personen im Bild, frag vorher: Für Fotos und Videos von Menschen gilt das Recht am eigenen Bild. Das gilt besonders, wenn jemand in Gebärdensprache spricht. Filme niemanden ohne seine Erlaubnis.",
      "Wie bei den anderen Kamera-Laboren fragt die Seite vor dem Start nach deiner Einwilligung. Sie ist für Menschen ab 16 Jahren gedacht, Jüngere nur mit Einverständnis der Eltern, und die Seite prüft das Alter nicht. Mehr dazu steht auf der Seite {{sicherheit-einfach|Ist das sicher?}}. Das ist eine Information und keine Rechtsberatung.",
    ]},
    {h: "Barrierefreiheit als Chance, ohne falsche Versprechen",
     kurz: "Das Fingeralphabet kann Brücken bauen. Technik ersetzt dabei weder Dolmetscher noch den Kontakt zu Gehörlosen.",
     p: [
      "Wer das Fingeralphabet kann, kann einen Namen oder ein Fremdwort mit einer gehörlosen Person klären, auch ohne Stift. Das ist ein kleiner, echter Gewinn. Eine Seite, die Handformen zeigt und liest, macht den Einstieg leichter und lässt dich üben.",
      "Es gibt Forschung zur automatischen Übersetzung von Gebärdensprache. Sie ist weit davon entfernt, ein Gespräch verlässlich zu übersetzen, denn dazu gehören Mimik, Raum und Grammatik, die eine einzelne Handform nicht fasst. Dieses Labor tut so etwas nicht. Wo Technik für gehörlose Menschen entwickelt wird, sollten gehörlose Menschen mitentscheiden. So lautet eine Grundforderung der Selbstvertretung: nichts über uns ohne uns.",
    ]},
    {h: "Für Lehrkräfte: eine Stunde mit 45 Minuten",
     kurz: "Von der eigenen Hand zur Frage, was Technik hier kann und was nicht.",
     p: [
      "Ablauf: Zuerst (5 Minuten) lassen sich alle ihren Namen zeigen, im Teil „Wort zeigen“. Dann (10 Minuten) lernen Paare je fünf Buchstaben mit dem Alphabet und üben sie sich gegenseitig vor. Danach (10 Minuten) probiert jede Gruppe das Erkennen aus, an einem Gerät mit Kamera. Wer keine Kamera nutzen will oder darf, übt mit „Wort zeigen“ und „Alphabet“, auch das ist eine volle Teilnahme. Dann (10 Minuten) wertet die Klasse aus: Welche Buchstaben wurden sicher erkannt, welche nicht? Passt das zur Tabelle? Zum Schluss (10 Minuten) geht es um die Frage, warum das Fingeralphabet nicht die Gebärdensprache ist und was eine Einladung an eine gehörlose Referentin oder einen gehörlosen Referenten bringen würde.",
      "Hinweise: Sitzen gehörlose oder schwerhörige Lernende in der Klasse, fragt vorher, ob und wie sie mitwirken möchten. Niemand wird als Beispiel vorgeführt. Kamera ab 16 Jahren, bei Jüngeren mit Einverständnis der Eltern, die Seite prüft das Alter nicht. Eine Beobachtungsaufgabe: Welche zwei Buchstaben verwechselt das Labor am häufigsten, und woran liegt das?",
    ]},
  ],
  mitnehmen: [
    "Das Fingeralphabet überträgt Buchstaben auf die Hand. Die Deutsche Gebärdensprache ist eine eigene Sprache, und das Labor übersetzt sie nicht.",
    "Aus 21 Handpunkten werden Merkmale, die das Labor mit Vorlagen vergleicht. Unter 60 Prozent Sicherheit sagt es „nicht sicher“.",
    "Die Vorlagen sind aus der Beschreibung nachgebaut, nicht aus Besucherdaten gelernt. Ob echte Hände gut erkannt werden, zeigt nur das Ausprobieren.",
  ],
  quiz: [
    {frage: "Was ist das Fingeralphabet?",
     optionen: ["Eine eigene Sprache mit eigener Grammatik", "Eine Handform für jeden Buchstaben, vor allem für Namen und Fremdwörter", "Eine Übersetzung der Gebärdensprache in Text", "Eine Geheimschrift für Hörende"],
     richtig: 1, erklaerung: "Das Fingeralphabet überträgt Buchstaben auf die Hand. Die Deutsche Gebärdensprache dagegen ist eine eigene Sprache, die das Labor nicht übersetzt."},
    {frage: "Woher kommen die Handform-Vorlagen im Labor?",
     optionen: ["Aus Fotos, die Besucher aufgenommen haben", "Aus einem Netz, das mit Handbildern trainiert wurde", "Sie sind nach der Beschreibung des Alphabets nachgebaut", "Sie kommen aus einem Online-Lexikon mit Videos"],
     richtig: 2, erklaerung: "Ein einfaches Handmodell ist nach der Beschreibung eingestellt. Besucherbilder dienen nie als Trainingsdaten."},
    {frage: "Das Labor zeigt „nicht sicher“. Was ist gemeint?",
     optionen: ["Die Kamera ist kaputt", "Die Sicherheit liegt unter der Schwelle, deshalb wird nichts übernommen", "Der Buchstabe gehört nicht zum Alphabet", "Du darfst den Buchstaben nicht zeigen"],
     richtig: 1, erklaerung: "Liegt die Sicherheit unter 60 Prozent, übernimmt das Labor keinen Buchstaben. Besser keine Antwort als eine falsche."},
    {frage: "Warum werden J und Z nicht erkannt?",
     optionen: ["Weil sie zu selten vorkommen", "Weil sie durch eine Bewegung gezeigt werden und eine einzelne Handform nicht reicht", "Weil das Labor nur Vokale kennt", "Weil die Kamera zu langsam ist"],
     richtig: 1, erklaerung: "J und Z entstehen durch die Bewegung der Hand. Das Labor wertet einzelne Handformen aus. Es zeigt die Zeichen aber im Alphabet mit Bewegung."},
    {frage: "Was passiert mit deinen Kamerabildern im Labor?",
     optionen: ["Sie werden einen Monat gespeichert", "Sie dienen dem Training des Modells", "Sie werden ausgewertet und verworfen, nichts wird gespeichert", "Sie gehen an eine Cloud"],
     richtig: 2, erklaerung: "Jedes Bild liegt nur kurz im Arbeitsspeicher des Jetson. Auch das gebaute Wort wird nicht gespeichert."},
    {frage: "Du buchstabierst mit der linken Hand. Was gilt?",
     optionen: ["Das Labor erkennt nur die rechte Hand", "Das Labor liest beide Hände, und die Zeichnungen lassen sich spiegeln", "Du musst dem Labor die Hand vorher melden", "Du musst die Kamera spiegeln"],
     richtig: 1, erklaerung: "Die Merkmale ändern sich beim Spiegeln nicht. Für die Zeichnungen gibt es den Schalter für Linkshänder."},
  ],
  grenzen: [
    "Das Labor übersetzt keine Gebärdensprache. Es liest einzelne Handformen des Fingeralphabets.",
    "J, Z, Ä, Ö, Ü, ß und Sch werden nicht erkannt, weil sie sich bewegen oder keine eigene Handform haben.",
    "Die Vorlagen sind Modelle. Die Messung gilt für die Vorlagen und nicht für echte Hände.",
    "Ähnliche Formen wie M und N, U und R oder die Fäuste A, S und E werden leicht verwechselt. Verdeckte Finger, Gegenlicht und Handschuhe machen es schwerer.",
    "Es wird nur eine Hand gelesen. Ob alle Hände gleich gut erkannt werden, wurde nicht gemessen.",
  ],
  get weiter() { return ["hand-gesicht", "text-lesen", "sprachausgabe", "bild-als-zahlen", "sicherheit-einfach", "verzerrung-ethik"].filter((id) => window.INHALT.seiten[id]); },
},

};

const glossar = {
  dgs: ["Deutsche Gebärdensprache (DGS)", "Die Sprache der gehörlosen Gemeinschaft in Deutschland. Sie hat eigenen Wortschatz und eigene Grammatik. Sie ist keine Übertragung des Deutschen in Handzeichen."],
  fingeralphabet: ["Fingeralphabet", "Eine Handform für jeden Buchstaben. Es dient zum Buchstabieren von Namen und Fremdwörtern und ist nicht die Gebärdensprache selbst."],
  merkmalsabstand: ["Merkmalsabstand", "Eine Zahl dafür, wie weit zwei Handformen auseinanderliegen. Sie entsteht aus Unterschieden in Merkmalen wie der Streckung der Finger. Je kleiner sie ist, desto ähnlicher sind die Formen."],
};

window.INHALT.registriere({ seiten, glossar });

/* Einbinden in die vorhandenen Seiten, ohne deren Dateien zu ändern: Menü (Gruppe Sehen), Lernpfad, Kamera-Kennzeichnung, Verweise. */
const I = window.INHALT;
const sehen = I.gruppen.find((g) => g.name === "Sehen");
if (sehen) {
  sehen.seiten = sehen.seiten.filter((id) => id !== "fingeralphabet");
  const i = sehen.seiten.indexOf("hand-gesicht");
  sehen.seiten.splice(i >= 0 ? i + 1 : sehen.seiten.length, 0, "fingeralphabet");
}
if (Array.isArray(I.kameraSeiten) && !I.kameraSeiten.includes("fingeralphabet")) I.kameraSeiten.push("fingeralphabet");
const pfad = (I.lernpfade || []).find((p) => p.id === "anwenden");
if (pfad && !pfad.seiten.includes("fingeralphabet")) { const k = pfad.seiten.indexOf("objekt"); pfad.seiten.splice(k >= 0 ? k + 1 : pfad.seiten.length, 0, "fingeralphabet"); }
for (const id of ["hand-gesicht", "sprachausgabe", "bild-als-zahlen"]) {
  const s = I.seiten[id];
  if (s && Array.isArray(s.weiter) && !s.weiter.includes("fingeralphabet")) s.weiter.push("fingeralphabet");
}

})();
