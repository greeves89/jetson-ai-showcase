/* Labor "Text auf Papier lesen" (Seiten-ID text-lesen): Lektion mit Kamera-Labor, Texterkennung (OCR) auf dem Jetson.
   Registrierung wie am Ende von content.js beschrieben. Die Datei steht in module.json nach content-sehen-agenten.js, weil sie
   die Gruppe "Sehen" und die "weiter"-Verweise der Nachbarseiten ergaenzt (so bleiben die Aenderungen in dieser Datei). */
(function () {

const seiten = {

"text-lesen": {
  nav: "Text auf Papier lesen", typ: "labor", gruppe: "Sehen", titel: "Text auf Papier lesen", symbol: "gesicht", demo: "webcam-ocr",
  lernziele: ["Du kannst die drei Schritte nennen, mit denen ein Computer Text im Bild liest.", "Du kannst erklären, warum Texterkennung 0 und O oder rn und m verwechselt.", "Du kannst sagen, was beim Abfotografieren von Briefen, Rechnungen und Büchern zu beachten ist."],
  kurz: "Halte ein Blatt mit gedrucktem Text in die Kamera. Der Jetson findet das Blatt, zieht es gerade, liest Zeile für Zeile und zeigt dir den Text, die Beträge und Termine darin, mit Warnung bei unsicheren Wörtern.",
  abschnitte: [
    {h: "Lesen heißt: finden, raten, zusammensetzen",
     kurz: "Ein Computer liest nicht wie du. Er sucht Zeilen, rät Zeichen und baut daraus Wörter.",
     visual: {typ: "ablauf", schritte: [
      {icon: "camera", text: "Kamerabild", sub: "Pixel"},
      {icon: "scan-line", text: "Blatt gerade", sub: "Perspektive"},
      {icon: "rows-3", text: "Zeilen", sub: "finden"},
      {icon: "type", text: "Zeichen", sub: "raten"},
      {icon: "file-text", text: "Sauberer Text", sub: "mit Sicherheit", farbe: "gruen"}]},
     p: [
      "Für den Computer ist dein Blatt eine Tabelle aus Helligkeitswerten, wie im Labor {{bild-als-zahlen|Pixel-Labor}}. Er weiß nicht, dass dort Wörter stehen. Die Fachleute nennen das Verfahren [[ocr|Texterkennung (OCR)]]. Es arbeitet in Stufen, und jede Stufe kann sich irren.",
      "Zuerst sucht der Jetson das Blatt im Bild und zieht es gerade. Dann findet er die Textzeilen. Danach rät ein Netz für jede Zeile, welche Zeichen darin stehen. Am Ende setzt Regelwerk daraus lesbaren Text zusammen. Im Labor oben siehst du alle vier Stufen: links dein Kamerabild, rechts das gerade gezogene Blatt mit einem Rahmen um jedes Wort.",
     ], alltag: "Stell dir vor, du liest eine Speisekarte im Halbdunkel. Erst suchst du die Karte, dann die Zeile mit dem Gericht, dann entziffert dein Blick Buchstabe für Buchstabe. Wenn ein Wort unklar ist, rätst du aus dem Zusammenhang. Der Computer macht dasselbe, nur ohne Zusammenhang: Er sieht jede Zeile für sich."},
    {h: "Schritt 1: Das Blatt finden und gerade ziehen",
     kurz: "Papier ist heller als der Tisch. Aus dem hellen Viereck wird ein gerades Rechteck.",
     visual: {typ: "vergleich",
      links: {titel: "Schräg im Bild", icon: "camera", farbe: "orange", punkte: ["Linien laufen zusammen", "Buchstaben unten größer", "Zeilen kippen"]},
      rechts: {titel: "Gerade gezogen", icon: "scan-line", farbe: "gruen", punkte: ["Zeilen waagerecht", "Gleiche Buchstabengröße", "Leichter zu lesen"]}},
     p: [
      "Der Jetson sucht im Kamerabild ein großes, helles Viereck mit vier Ecken. Findet er eins, rechnet er die Perspektive heraus: Das schräge Viereck wird zu einem Rechteck, als würdest du von oben darauf schauen. Man nennt das [[entzerren|Entzerren]]. Findet er kein Blatt, liest er das ganze Bild.",
      "Steht der Text auf dem Kopf oder quer, merkt er das auch: Er liest ein paar Zeilen in beiden Lagen und behält die, bei der er sich sicherer ist. Das siehst du im Hinweis über dem gelesenen Text.",
     ], alltag: "Scanner-Apps am Handy machen dasselbe. Du fotografierst einen Zettel von schräg oben, und die App zeigt dir ein gerades, weißes Blatt. Der Vergleich hinkt an einer Stelle: Ein Scanner-Gerät braucht das nicht, weil das Blatt dort flach auf dem Glas liegt."},
    {h: "Schritt 2 und 3: Zeilen finden, Zeichen raten",
     kurz: "Ein Netz markiert jede Zeile. Ein zweites rät für jeden Streifen der Zeile ein Zeichen.",
     visual: {typ: "ablauf", schritte: [
      {icon: "rows-3", text: "Zeilenfinder", sub: "ein Rahmen je Zeile"},
      {icon: "scan-line", text: "Zeile ausschneiden", sub: "48 Pixel hoch"},
      {icon: "type", text: "Zeichen raten", sub: "Streifen für Streifen"},
      {icon: "layers", text: "Doppelte weg", sub: "CTC", farbe: "gruen"}]},
     p: [
      "Der Zeilenfinder ist ein kleines Netz. Es bekommt das gerade Blatt und markiert alle Stellen, an denen Text steht. Jede Zeile wird ausgeschnitten und auf dieselbe Höhe gebracht. Ein zweites Netz, der Erkenner, schiebt dann einen schmalen Streifen über die Zeile und rät für jeden Streifen ein Zeichen oder „nichts“.",
      "Weil ein Buchstabe mehrere Streifen breit ist, kommt derselbe Buchstabe mehrfach vor. Ein Verfahren namens [[ctc|CTC]] streicht die Wiederholungen und die „nichts“-Streifen. Übrig bleibt der Text der Zeile. Zu jedem Zeichen gibt das Netz auch eine Sicherheit an. Daraus berechnet das Labor die Sicherheit je Wort.",
      "Das Netz kennt die deutschen Zeichen ä, ö, ü, Ä, Ö, Ü, ß und das Euro-Zeichen. Ein reines Englisch-Modell würde „Äpfel“ nicht als solches lesen können.",
     ]},
    {h: "Schritt 4: Aus Zeichen wird sauberer Text",
     kurz: "Reihenfolge, Silbentrennung, Mehrheitsentscheid und Karten kommen aus festen Regeln, nicht aus dem Netz.",
     visual: {typ: "raster", spalten: 2, zellen: [
      {icon: "list-ordered", text: "Lesereihenfolge", sub: "oben nach unten, Spalten nacheinander"},
      {icon: "link", text: "Silbentrennung", sub: "„inner-“ und „halb“ werden „innerhalb“"},
      {icon: "repeat", text: "Mehrheitsentscheid", sub: "mehrere Bilder, kein Flackern"},
      {icon: "list-checks", text: "Karten", sub: "Betrag, Datum, Uhrzeit, E-Mail, Telefon"}]},
     p: [
      "Das Netz liefert Zeilen. Regeln ordnen sie: Zeilen von oben nach unten, bei zwei Spalten erst die linke, dann die rechte. Endet eine Zeile mit „inner-“ und die nächste beginnt klein mit „halb“, wird daraus „innerhalb“. „Ein- und Ausgang“ bleibt dagegen getrennt, weil dort „und“ folgt.",
      "Das Kamerabild wackelt, und jedes Bild ergibt eine leicht andere Lesung. Das Labor liest deshalb mehrmals und nimmt je Zeile den Text, der am häufigsten und am sichersten vorkommt. Erst wenn sich der Text mehrere Bilder lang nicht mehr ändert, zeigt das Labor „Text steht stabil“. Zeilen, die sich nicht verändert haben, liest es nicht noch einmal. Das spart den größten Teil der Rechenzeit: Das erste Lesen eines Blattes mit zwölf Zeilen dauert auf dem Jetson gemessen etwa 1,3 bis 2,5 Sekunden, je nachdem, wie stark er gerade ausgelastet ist. Die späteren Lesungen brauchen weniger.",
      "Aus dem fertigen Text sucht eine feste Regel Beträge, Prozentangaben, Datum, Uhrzeit, E-Mail-Adressen, Telefonnummern und IBAN. Eine KI ist daran nicht beteiligt. Deshalb sind die Karten genau so sicher wie der Text, aus dem sie kommen. Ein gelesenes „1.234,56 €“ wird eine Betragskarte, ein gelesenes „l.234,56 €“ (mit kleinem L) nicht.",
     ], merke: "Das Netz rät Zeichen. Alles danach, von der Reihenfolge bis zu den Karten, sind einfache Regeln, die du nachprüfen kannst.",
     tabelle: {
      beschriftung: "Wer macht was im Labor",
      kopf: ["Schritt", "Wer macht es", "Kann sich irren, weil"],
      zeilen: [
        ["Blatt finden", "Regel mit OpenCV (Helligkeit, Kanten)", "das Blatt kaum heller als der Tisch ist"],
        ["Zeilen finden", "Netz (Zeilenfinder)", "die Schrift sehr klein oder verschmiert ist"],
        ["Zeichen lesen", "Netz (Erkenner)", "Zeichen sich ähneln, etwa 0 und O"],
        ["Silbentrennung, Reihenfolge", "Regeln", "Spalten ungewöhnlich stehen"],
        ["Karten (Betrag, Datum, ...)", "Regeln", "im gelesenen Text schon ein Fehler steckt"],
      ]}},
    {h: "Warum Texterkennung sich irrt",
     kurz: "Manche Zeichen sehen für das Netz fast gleich aus. Schlechtes Licht und kleine Schrift machen es schlimmer.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "hash", text: "0 oder O", sub: "Null und Buchstabe"},
      {icon: "type", text: "l, 1 oder I", sub: "drei senkrechte Striche"},
      {icon: "text", text: "rn oder m", sub: "zwei Buchstaben, ein Klecks"}]},
     p: [
      "Die klassischen Verwechslungen sind 0 und O, 1, l und großes I sowie rn und m. Auch ß und B, 5 und S oder das Komma und der Punkt in Beträgen gehören dazu. Der Mensch löst das über den Zusammenhang: In „Gr0ße“ erkennst du die Null als O, weil das Wort sonst keinen Sinn hat. Das Netz sieht zwar die ganze Zeile, versteht den Sinn des Textes aber nicht.",
      "Dazu kommen Störungen im Bild: Schatten, Spiegelungen auf Glanzpapier, Unschärfe, Knicke, Schrift, die durch die Rückseite scheint. Und die Größe: Je weniger Pixel ein Buchstabe hat, desto mehr Fehler. Das Labor wertet bis zu 960 Pixel Bildbreite aus, mehr würde das Lesen zu langsam machen.",
     ], tabelle: {
      beschriftung: "Häufige Verwechslungen und was hilft",
      kopf: ["Verwechslung", "Beispiel", "Was hilft"],
      zeilen: [
        ["0 und O", "Gr0ße statt Größe", "Zusammenhang prüfen, Zahlen am Papier nachsehen"],
        ["1, l und I", "Hal1o statt Hallo", "Wörter mit Fragezeichen prüfen"],
        ["rn und m", "Arn statt Am", "näher heran, mehr Licht"],
        ["ß und B", "Straße oder StraBe", "Wort im Zusammenhang lesen"],
        [", und .", "1.234,56 oder 1,234.56", "Beträge immer am Beleg gegenprüfen"],
      ]}},
    {h: "Handschrift und andere schwere Fälle",
     kurz: "Gedruckte Buchstaben sind gleichmäßig. Handschrift ist es nicht.",
     visual: {typ: "vergleich",
      links: {titel: "Druckschrift", icon: "type", farbe: "gruen", punkte: ["Jeder Buchstabe sieht gleich aus", "Gleichmäßige Abstände", "Gerade Zeilen"]},
      rechts: {titel: "Handschrift", icon: "pen-line", farbe: "orange", punkte: ["Jede Hand anders", "Buchstaben verbunden", "Zeilen wellen sich"]}},
     p: [
      "Das Modell im Labor ist für gedruckte Schrift trainiert. Bei Handschrift liegt es oft daneben, auch bei sauberer Schreibschrift. Das liegt daran, dass jede Hand anders schreibt, Buchstaben ineinander laufen und die Zeilen nicht gerade sind. Eine Arztschrift auf einem Rezept liest manchmal nicht einmal die Apothekerin. Für Handschrift gibt es eigene Modelle, und auch die machen deutlich mehr Fehler als bei Druck.",
      "Weitere schwere Fälle sind alte Fraktur-Schrift, sehr schräg gehaltene Blätter, glänzendes Papier mit Spiegelung, Tabellen mit vielen Linien, Formeln und bunte Hintergründe hinter dem Text.",
     ], alltag: "Eine Postbotin liest Straßennamen auf Briefen. Gedruckte Adressen gehen schnell, eine krakelige Handschrift verlangsamt sie. Hilft nichts mehr, fragt sie nach. Das Labor kann nicht nachfragen. Es zeigt dir nur an, wo es unsicher ist."},
    {h: "Vorlesen: Hilfe für Menschen, die schlecht sehen",
     kurz: "Kamera, Text und Stimme zusammen ergeben ein Hilfsmittel. Der Fehler wird mitgelesen.",
     visual: {typ: "ablauf", schritte: [
      {icon: "camera", text: "Zettel in die Kamera"},
      {icon: "file-text", text: "Text lesen", sub: "mit Sicherheit"},
      {icon: "volume-2", text: "Vorlesen", sub: "Sprachausgabe", farbe: "gruen"}]},
     p: [
      "Der Knopf „Vorlesen“ schickt den gelesenen Text an das Labor {{sprachausgabe|Text zu Sprache}}. Dort spricht ihn eine KI-Stimme. Für Menschen mit Sehbehinderung oder Leseschwäche ist so etwas im Alltag ein echtes Hilfsmittel: Zettel, Medikamentenpackung oder Speisekarte lassen sich vorlesen.",
      "Der Haken: Wer nicht sehen kann, kann den Text auch nicht nachprüfen. Liest das Netz „Gr0ße 42“, hört man „Große 42“ oder etwas Schlimmeres. Gute Hilfsmittel sagen deshalb an, wenn sie unsicher sind, und lassen sich wiederholen. Auch bei Medikamenten, Beträgen und Terminen gilt: Wichtiges prüft ein Mensch.",
     ], merke: "Vorlesen macht Text zugänglich. Es ersetzt aber nicht das Nachprüfen, vor allem bei Zahlen."},
    {h: "Briefe, Rechnungen, Bücher: Datenschutz und Urheberrecht",
     kurz: "Wer ein Dokument fotografiert, gibt Daten weiter. Und nicht jedes Buch darf man einscannen.",
     visual: {typ: "vergleich",
      links: {titel: "Hier im Labor", icon: "lock", farbe: "gruen", punkte: ["Bild nur im Arbeitsspeicher", "Nichts gespeichert, nichts protokolliert", "Kein Training mit deinen Bildern"]},
      rechts: {titel: "Manche Cloud-Apps", icon: "cloud", farbe: "orange", punkte: ["Bild geht zum Anbieter", "Speicherung je nach Anbieter", "Nutzung zur Verbesserung möglich"]}},
     p: [
      "Briefe und Rechnungen enthalten Namen, Adressen, Kontonummern und manchmal Gesundheitsdaten. Das sind [[personenbezogen|personenbezogene Daten]], oft auch sensible. Hier im Labor bleibt jedes Bild nur im Arbeitsspeicher des Jetson, wird ausgewertet und verworfen. Der gelesene Text steht nur in deinem Browser. Nur wenn du auf „Vorlesen“ klickst, geht der Text zum Jetson und wieder zurück, ohne gespeichert zu werden.",
      "Bei Scanner-Apps und Cloud-Diensten ist das nicht immer so. Das Bild verlässt dein Gerät, und was der Anbieter damit tut, steht in seinen Bedingungen. Im Betrieb braucht es dafür einen Vertrag zur Auftragsverarbeitung und die Frage, ob Kundendaten überhaupt in die Cloud dürfen. Das ist ein Überblick und keine Rechtsberatung.",
      "Für Bücher gilt das Urheberrecht. Einzelne Kopien für den eigenen Gebrauch sind oft erlaubt. Ein ganzes Buch abzufotografieren, die Seiten weiterzugeben oder ins Netz zu stellen, ist es in der Regel nicht. Für den Unterricht gelten eigene, engere Grenzen. Im Zweifel frag die Bibliothek, die Schule oder den Verlag. Auch das ist keine Rechtsberatung.",
     ]},
    {h: "Für den Unterricht: 45 Minuten",
     kurz: "Eine Stunde, in der Schülerinnen und Schüler Fehler selbst provozieren und benennen.",
     visual: {typ: "ablauf", schritte: [
      {icon: "camera", text: "Ausprobieren", sub: "10 Minuten"},
      {icon: "triangle-alert", text: "Fehler suchen", sub: "15 Minuten"},
      {icon: "message-square", text: "Besprechen", sub: "10 Minuten"},
      {icon: "shield-check", text: "Datenschutz", sub: "10 Minuten", farbe: "gruen"}]},
     p: [
      "Vorbereitung: Gedruckte Zettel mit Text, eine Speisekarte, ein Blatt mit Handschrift, ein Blatt mit Spiegelung (Glanzpapier). Keine echten Briefe, Rechnungen oder Schulunterlagen mit Namen. Alles gehört den Schülern selbst oder ist ausgedacht.",
      "Ablauf: Zehn Minuten halten die Lernenden verschiedene Zettel in die Kamera. Dann sammeln sie 15 Minuten Fehler: Welche Wörter sind unterstrichen? Welche Verwechslung kommt vor? Wann ist das Ergebnis besser, wann schlechter? Danach besprecht ihr, was das Labor kann und was nicht. Zum Schluss geht es um Datenschutz: Was steht auf einem Brief, und wer darf es sehen? Wer es zu Hause mit der eigenen Kamera nutzt, braucht die Einwilligung der Eltern bei Kindern unter 16 Jahren.",
     ]},
  ],
  mitnehmen: [
    "Texterkennung arbeitet in Stufen: Blatt finden, Zeilen finden, Zeichen raten, mit Regeln auswerten. Jede Stufe kann sich irren.",
    "Hohe Sicherheit heißt nicht, dass der Text stimmt. Zahlen, Beträge und Termine prüft immer ein Mensch am Papier.",
    "Dokumente sind sensibel. Frag bei jeder Scanner-App, wohin das Bild geht, und scanne keine Bücher oder Briefe, die dir nicht gehören.",
  ],
  quiz: [
    {frage: "Das Labor liest „Gr0ße 42“ statt „Größe 42“. Was ist passiert?", optionen: ["Das Netz hat die Zeichen 0 und O verwechselt", "Die Kamera ist kaputt", "Der Text stand wirklich so auf dem Blatt", "Der Jetson war zu langsam"], richtig: 0, erklaerung: "Null und großes O sehen sich sehr ähnlich. Das Netz liest jede Zeile für sich und hat keinen Zusammenhang, der den Fehler auffängt. Darum sind solche Wörter unterstrichen und tragen ein Fragezeichen."},
    {frage: "Wofür dient der Schritt „Blatt gerade ziehen“?", optionen: ["Er macht das Bild schöner", "Er rechnet die Schräge heraus, damit die Zeilen waagerecht stehen", "Er löscht den Hintergrund", "Er übersetzt den Text"], richtig: 1, erklaerung: "Aus dem schrägen Viereck wird ein Rechteck. Gerade Zeilen kann der Erkenner viel besser lesen."},
    {frage: "Wer findet im Labor den Betrag „1.234,56 €“ im Text?", optionen: ["Ein Sprachmodell, das den Text versteht", "Der Zeilenfinder", "Eine feste Regel, die nach Zahlen mit Komma und Euro-Zeichen sucht", "Der Browser"], richtig: 2, erklaerung: "Die Karten kommen aus Regeln. Deshalb sind sie nur so sicher wie der gelesene Text, und ein falsch gelesenes Zeichen kann die Karte verhindern."},
    {frage: "Warum liest das Labor mehrere Bilder nacheinander, bevor es „Text steht stabil“ zeigt?", optionen: ["Damit der Strom nicht ausfällt", "Weil jedes Bild leicht anders ist und die Mehrheit der Lesungen Fehler ausgleicht", "Weil der Jetson sonst ausgeht", "Das ist nur Show"], richtig: 1, erklaerung: "Kleine Bewegungen und Rauschen verändern jede Lesung. Wenn mehrere Lesungen denselben Text ergeben, ist er verlässlicher als eine einzelne."},
    {frage: "Was ist bei Rechnungen und Briefen in Cloud-Scanner-Apps besonders wichtig?", optionen: ["Nichts, die Bilder sind immer anonym", "Das Bild verlässt dein Gerät, du musst wissen, was der Anbieter damit macht", "Die App liest nur Zahlen", "Cloud-Apps lesen Handschrift immer richtig"], richtig: 1, erklaerung: "Briefe enthalten persönliche Daten. Wohin das Bild geht und ob es gespeichert wird, steht in den Bedingungen des Anbieters. Im Betrieb braucht es oft einen Vertrag zur Auftragsverarbeitung."},
    {frage: "Eine blinde Person nutzt eine App, die Medikamentenpackungen vorliest. Was ist die größte Gefahr?", optionen: ["Die Stimme klingt nach Roboter", "Ein Lesefehler fällt nicht auf, weil sie den Text nicht prüfen kann", "Die App braucht Strom", "Die Packung wird beschädigt"], richtig: 1, erklaerung: "Ein Fehler wie 0,5 statt 5 wird mit vorgelesen. Gute Hilfsmittel sagen an, wenn sie unsicher sind, und es bleibt wichtig, Wichtiges von einem Menschen prüfen zu lassen."},
  ],
  business: {
    text: "Belege, Lieferscheine und Formulare lassen sich per Kamera erfassen, statt sie abzutippen. Die Auswertung sucht Beträge, Daten und Rechnungsnummern. Ein Mensch prüft die Werte, bevor sie in die Buchhaltung gehen.",
    beispiele: ["Büro: Eingangsrechnungen erfassen, Beträge und Daten vorschlagen", "Lager: Lieferscheine und Etiketten lesen", "Empfang: Besuchszettel und Formulare in Text umwandeln"],
  },
  grenzen: [
    "Handschrift liest das Labor nicht zuverlässig, auch bei sauberer Schrift.",
    "Fraktur, Schmuckschriften und sehr kleine Schrift liest es kaum oder gar nicht. Buchstaben sollten im Bild mindestens etwa 15 Pixel hoch sein.",
    "Glanzpapier mit Spiegelung, Knicke und Schatten zerreißen Zeilen. Lege das Blatt flach und vermeide direktes Licht.",
    "Tabellen, Formeln und Mehrspaltiges liest es zeilenweise. Die Struktur einer Tabelle geht verloren.",
    "Ein Blatt, das kaum heller als der Tisch ist, wird nicht als Blatt erkannt. Dann liest das Labor das ganze Bild, schräg und kleiner.",
    "Hohe Sicherheit ist kein Beweis für Richtigkeit: Ein sicher gelesenes Wort kann falsch sein.",
  ],
  weiter: ["sprachausgabe", "rag-ueberblick", "uc-buero-dokumente", "bild-als-zahlen", "hand-gesicht", "recht"],
},

};

const glossar = {
  ctc: ["CTC", "Verfahren, mit dem ein Netz Zeichen aus einer Zeile liest, ohne vorher zu wissen, wo ein Buchstabe anfängt. Wiederholungen und „nichts“ werden am Ende gestrichen."],
  entzerren: ["Entzerren", "Ein schräg fotografiertes Blatt wird so umgerechnet, dass es wie von oben aufgenommen aussieht. Danach sind die Zeilen waagerecht."],
  personenbezogen: ["Personenbezogene Daten", "Angaben, mit denen sich eine Person erkennen lässt, etwa Name, Adresse, Kontonummer oder Telefonnummer. Sie stehen auf fast jedem Brief und jeder Rechnung."],
};

INHALT.registriere({ seiten, glossar });

/* Nachbarschaft: Das Labor steht in der Gruppe Sehen direkt hinter Hände und Gesichter und wird von dort und vom Objekt-Labor verlinkt. */
const gSehen = INHALT.gruppen.find((x) => x.name === "Sehen");
if (gSehen && !gSehen.seiten.includes("text-lesen")) {
  const i = gSehen.seiten.indexOf("hand-gesicht");
  gSehen.seiten.splice(i >= 0 ? i + 1 : gSehen.seiten.length, 0, "text-lesen");
}
for (const id of ["hand-gesicht", "objekt", "bild-als-zahlen"]) {
  const s = INHALT.seiten[id];
  if (s && Array.isArray(s.weiter) && !s.weiter.includes("text-lesen")) s.weiter.push("text-lesen");
}

})();
