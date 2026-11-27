/* Labor Körperhaltung: Skelett, Gelenkwinkel, Bewegungs-Spiegel, Haltung am Schreibtisch, Pose nachmachen.
   Registrierung wie am Ende von content.js beschrieben. Die Seite hängt sich in Gruppe "Sehen" hinter "Hände und Gesichter",
   in die Kameraseiten (Kennzeichnung im Menü) und in die "weiter"-Verweise der Nachbarseiten ein (siehe unten).
   Zahlen zur Geschwindigkeit sind auf dem Jetson gemessen (Ausgangslage dieser Datei: docs/bausteine-sehen-agenten.md, Abschnitt Körperhaltung). */
(function () {

const seiten = {

"koerperhaltung": {
  nav: "Körperhaltung", typ: "labor", gruppe: "Sehen", titel: "Körperhaltung: Skelett im Kamerabild", symbol: "person-standing", demo: "webcam-koerperhaltung",
  lernziele: [
    "Du kannst erklären, wie aus 33 Punkten ein Skelett wird und wie daraus Winkel und Zähler entstehen.",
    "Du kannst sagen, warum ein Skelett aus dem Kamerabild keine Diagnose ist und wo es danebenliegt.",
    "Du kannst begründen, warum Haltungsdaten personenbezogen sein können, auch wenn kein Gesicht zu sehen ist.",
  ],
  kurz: "Der Jetson legt ein Skelett aus 33 Punkten über dich: Schultern, Ellbogen, Hände, Hüfte, Knie, Füße. Du siehst die Winkel live, kannst Kniebeugen zählen lassen und Posen nachmachen. Es sind Schätzungen aus Punkten im Bild und keine Diagnose.",
  abschnitte: [
    {h: "Ein Strichmännchen aus Zahlen",
     kurz: "Ein Netz setzt Punkte auf Gelenke. Alles Weitere sind einfache Rechnungen mit diesen Punkten.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "camera", text: "Kamerabild", sub: "480 mal 360, JPEG"},
      {icon: "scan", text: "Person finden", sub: "Rahmen und Körpermitte"},
      {icon: "person-standing", text: "33 Punkte", sub: "Gelenke mit Sicherheit"},
      {icon: "list-checks", text: "Regeln", sub: "Winkel, Zähler, Hinweise", farbe: "gruen"}]},
     p: [
      "Die [[pose|Posenschätzung]] sucht Schlüsselpunkte am Körper: Nase und Ohren, Schultern, Ellbogen, Handgelenke, Hüften, Knie, Knöchel und Füße. Jeder Punkt ist ein Zahlenpaar im Bild, dazu schätzt das Modell, wie sicher es sich ist, dass der Punkt wirklich zu sehen ist. Blasse Linien im Bild bedeuten: unsicher.",
      "Aus den Punkten rechnet der Jetson dann selbst: den Winkel am Ellbogen, am Knie und an der Hüfte, die Neigung des Oberkörpers, ob eine Schulter höher steht. Dafür reichen einfache Geometrie und ein paar feste Regeln. Das Netz liefert nur die Punkte.",
     ], alltag: "Stell dir eine Holzpuppe mit Gelenken vor, die jemand für dich in genau deine Haltung biegt. Du siehst nur Gelenke und Stäbe, kein Gesicht, keine Kleidung. Trotzdem erkennst du, ob die Puppe sich bückt oder die Arme hebt. Der Vergleich hinkt: Die Puppe weiß, wo ihre Gelenke sind. Der Jetson schätzt es aus einem flachen Bild.",
     merke: "Das Skelett ist eine Schätzung aus Punkten. Wer es sieht, sieht keine Person, nur ihre Haltung."},
    {h: "So entsteht das Skelett",
     kurz: "Erst wird die Person gefunden, dann wird ihr Ausschnitt gerade gedreht und ein zweites Netz setzt die Punkte.",
     visual: {typ: "ablauf", schritte: [
      {icon: "scan-search", text: "Personenfinder", sub: "alle 15 Bilder"},
      {icon: "crosshair", text: "Ausschnitt", sub: "gerade gedreht"},
      {icon: "grid-3x3", text: "Punktenetz", sub: "256 mal 256 Pixel"},
      {icon: "activity", text: "Glätten", sub: "weniger Zittern", farbe: "gruen"}]},
     p: [
      "Zwei Netze arbeiten nacheinander. Der Personenfinder sucht Personen im Bild und liefert zwei Hilfspunkte: die Mitte der Hüfte und einen Punkt, der Größe und Neigung des Körpers festlegt. Um die Person wird ein Quadrat gelegt und so gedreht, dass sie aufrecht steht. Das zweite Netz bekommt nur diesen Ausschnitt und setzt 33 Punkte hinein. Danach rechnet der Jetson die Punkte zurück in das Kamerabild.",
      "Damit es schnell genug für Video bleibt, sucht der Jetson nicht in jedem Bild neu. Der Ausschnitt folgt den Punkten des letzten Bildes. Den Personenfinder ruft er nur noch, wenn die Person verloren ist, und etwa alle 15 Bilder, um weitere Personen zu zählen. Ausgewertet wird nur die größte Person. Weitere sieht das Labor, rechnet sie aber nicht durch.",
      "Rohe Punkte zittern von Bild zu Bild um ein paar Pixel. Ein [[glaetten|Glättungsfilter]] mischt das vorige Bild bei langsamer Bewegung stark dazu und bei schneller kaum, damit schnelle Bewegungen nicht hinterherhinken. Das Bild wird außerdem gespiegelt zurückgeschickt, wie im Spiegel: Dein linker Arm ist links.",
      "Gemessen auf dem Jetson: Ein Bild auszuwerten dauert im Mittel etwa 35 Millisekunden, mit drei von sechs Rechenkernen und ohne Übertragung (Messung im Testlauf, die seltene Suche nach der Person kostet rund 43 Millisekunden zusätzlich). Im Labor selbst, mit Bildübertragung im Heimnetz, kamen bei uns je nach Last 11 bis 15 Bilder pro Sekunde an. Die beiden Netze belegen zusammen rund 76 Megabyte Arbeitsspeicher. Sie werden erst beim ersten Bild geladen und nach zwei Minuten ohne Bild wieder freigegeben, damit der Chat den Speicher behält.",
     ], tabelle: {
      beschriftung: "Was der Jetson in einem Bild rechnet",
      kopf: ["Schritt", "Aufgabe", "Wie oft"],
      zeilen: [
        ["Personenfinder", "Person und Körpermitte finden", "bei Verlust und etwa alle 15 Bilder"],
        ["Punktenetz", "33 Punkte im gedrehten Ausschnitt", "in jedem Bild"],
        ["Glätten", "Zittern der Punkte dämpfen", "in jedem Bild"],
        ["Regeln", "Winkel, Zähler, Hinweise, Ähnlichkeit", "in jedem Bild, sehr schnell"],
      ],
    }},
    {h: "Winkel und Zähler: aus Punkten wird Rückmeldung",
     kurz: "Drei Punkte ergeben einen Winkel. Ein Zähler mit zwei Schwellen macht daraus Wiederholungen.",
     visual: {typ: "vergleich",
      links: {titel: "Ein Schwellenwert", icon: "triangle-alert", farbe: "orange", punkte: ["Winkel wackelt um die Grenze", "Zähler springt mehrfach"]},
      rechts: {titel: "Zwei Schwellen", icon: "check", farbe: "gruen", punkte: ["Unten unter 110 Grad", "Oben über 160 Grad", "Dazwischen zählt nichts"]}},
     p: [
      "Der [[gelenkwinkel|Gelenkwinkel]] am Knie entsteht aus drei Punkten: Hüfte, Knie, Knöchel. 180 Grad heißt gestreckt, 90 Grad ist ein rechter Winkel. Genauso rechnet der Jetson am Ellbogen und an der Hüfte.",
      "Bei der Kniebeuge zählt eine Wiederholung erst, wenn das Knie unter 110 Grad kommt und danach wieder über 160. Das nennt man [[hysterese|Hysterese]]. Ohne sie würde ein Winkel, der um die Grenze wackelt, bei jedem Zittern eine neue Wiederholung melden. Kommt das Knie nur bis 125 Grad, zählt nichts und der Jetson sagt: Knie weiter beugen.",
      "Dieselbe Idee steckt in Arme heben (Winkel an der Schulter), Armkreisen (die Drehung der Handgelenke um die Schultern wird aufaddiert, 330 Grad sind ein Kreis) und Seitneigung (Neigung des Oberkörpers von der Senkrechten). Alle Rückmeldungen sind einfache Sätze wie Knie weiter beugen oder Hebe beide Arme gleich hoch.",
     ], alltag: "Ein Thermostat schaltet die Heizung bei 20 Grad ein und erst bei 22 Grad wieder aus. Läge beides bei 21, würde sie bei jedem Lüften klicken. Die zwei Schwellen im Zähler tun dasselbe.",
     tabelle: {
      beschriftung: "Übungen im Bewegungs-Spiegel",
      kopf: ["Übung", "Gemessen wird", "Gezählt wird, wenn"],
      zeilen: [
        ["Kniebeuge", "mittlerer Kniewinkel", "unter 110 Grad und danach über 160 Grad"],
        ["Arme heben", "Winkel Hüfte, Schulter, Ellbogen", "über 140 Grad und danach unter 35 Grad"],
        ["Armkreisen", "Drehung der Hand um die Schulter", "330 Grad aufgesummt"],
        ["Seitneigung", "Oberkörper gegen die Senkrechte", "über 15 Grad und danach unter 6 Grad"],
      ],
    }},
    {h: "Haltung am Schreibtisch: warum die Seite anders gerechnet wird",
     kurz: "Das Modell sieht ein flaches Bild. Was in der Tiefe passiert, zeigt nur die Seitenansicht.",
     visual: {typ: "vergleich",
      links: {titel: "Von vorn", icon: "user", farbe: "akzent", punkte: ["Schiefe Schultern sichtbar", "Neigung zur Seite sichtbar", "Kopf vor: nicht erkennbar"]},
      rechts: {titel: "Von der Seite", icon: "move-right", farbe: "orange", punkte: ["Kopf vor den Schultern sichtbar", "Schultern liegen übereinander", "Nähere Seite verdeckt die andere"]}},
     p: [
      "Das Netz setzt Punkte in ein zweidimensionales Bild. Die Tiefe fehlt. Von vorn sieht man darum nicht, ob der Kopf vor den Schultern steht: Nase und Brustbein liegen in einer Linie, egal wie weit der Kopf nach vorn wandert. Erst von der Seite siehst du den Abstand zwischen Ohr und Schulter. Dafür sieht man schiefe Schultern nur von vorn, von der Seite liegen beide übereinander.",
      "Der Jetson schätzt deshalb zuerst, aus welcher Ansicht er dich sieht. Er vergleicht dafür die Schulterbreite mit der Länge des Rumpfes (oder, wenn die Hüften verdeckt sind, mit dem Abstand von Schulter zu Ohr). Je nach Ansicht prüft er andere Regeln: von vorn Schulterhöhe, Neigung des Oberkörpers und des Kopfes, von der Seite den Winkel zwischen Schulter und Ohr. Bei einer schrägen Ansicht bittet er dich, dich ganz zur Kamera oder ganz zur Seite zu drehen. Die Schwellen sind grobe Faustregeln dieser Seite und stammen nicht aus einer Studie.",
      "Er mittelt außerdem über etwa zwei Sekunden und nimmt den mittleren Wert, damit ein Wimpernschlag oder ein Ausreißer keinen Hinweis auslöst. Die Hinweise sind freundlich gemeint: Dein Kopf steht etwas vor den Schultern. Richte dich ein Stück auf, wenn es sich gut anfühlt. Das ist keine Diagnose. Ob eine Haltung gut oder schlecht für dich ist, kann ein Bild nicht zeigen.",
     ], alltag: "Ein Schattenbild an der Wand zeigt dir von vorn nur, wie breit jemand ist. Ob er den Kopf vorstreckt, siehst du erst, wenn er sich seitlich ins Licht dreht. Auch die Wand weiß nichts über Schmerzen oder Gesundheit.",
     merke: "Ein Hinweis zur Haltung ist eine Beobachtung über Punkte im Bild. Er ersetzt weder einen Arzt noch eine Physiotherapeutin."},
    {h: "Pose nachmachen",
     kurz: "Eine Zielpose wird als Umriss gezeigt. Die Ähnlichkeit ist ein Mittelwert über acht Arm- und Beinabschnitte.",
     visual: {typ: "ablauf", schritte: [
      {icon: "target", text: "Zielpose", sub: "Hände hoch, T, Baum"},
      {icon: "ruler", text: "Richtung je Abschnitt", sub: "acht Stück"},
      {icon: "gauge", text: "Ähnlichkeit", sub: "0 bis 100 Prozent", farbe: "gruen"}]},
     p: [
      "Der helle Umriss im Bild ist die Zielpose, an deinem Körper ausgerichtet. Für jeden der acht Abschnitte (Oberarm, Unterarm, Oberschenkel, Unterschenkel, links und rechts) vergleicht der Jetson die Richtung mit der Zielpose. Null Grad Abweichung geben volle Punkte, ab 45 Grad gibt es keine. Die Zahl ist der Mittelwert der sichtbaren Abschnitte. Sind weniger als sechs sichtbar, gibt es keine Zahl.",
      "Als geschafft zählt die Pose, wenn die Ähnlichkeit gut eine Sekunde über 80 Prozent bleibt. Danach musst du sie lösen, bevor die nächste zählt. Bei der Baumpose ist es egal, auf welchem Bein du stehst. Die Zahl sagt nur, wie ähnlich die Richtungen sind. Wie gut du die Pose hältst, bewertet sie nicht.",
     ], alltag: "Das ist wie das Spiel Twister mit einer Schablone: Die Schablone zeigt, wo die Hand hin soll. Wer nah dran ist, bekommt einen Punkt. Wie sicher du dabei stehst, sieht die Schablone nicht."},
    {h: "Wo das Skelett danebenliegt",
     kurz: "Verdeckung, weite Kleidung und ungewöhnliche Körper machen Punkte unsicher. Die Zahl dazu steht im Bild als blasse Linie.",
     visual: {typ: "raster", spalten: 4, zellen: [
      {icon: "eye-off", text: "Verdeckung", sub: "Tisch, Tasche, Hantel"},
      {icon: "layers", text: "Kleidung", sub: "weit, dunkel, Mantel"},
      {icon: "sun", text: "Licht", sub: "Gegenlicht, Dunkelheit"},
      {icon: "users", text: "Körper", sub: "Kinder, Rollstuhl, Prothesen"}]},
     p: [
      "Verdeckte Punkte rät das Modell. Ein Tisch, eine Hantelstange oder die andere Schulter in der Seitenansicht machen sie unsicherer. In unseren Tests mit Einzelfotos blieben Punkte hinter einer Hantel oder hinter dem anderen Bein blass. Genau dafür gibt es die Sicherheit: Punkte darunter werden im Bild blass gezeichnet und in keiner Rechnung benutzt.",
      "Weite Kleidung versteckt die Umrisse von Hüfte und Knie. Gegenlicht und Dunkelheit nehmen dem Netz die Kanten. Ungewöhnliche Haltungen wie ein Kopfstand oder Yoga am Boden liegen weit weg von den Bildern, an denen solche Modelle meist gelernt werden.",
      "Ob das Modell bei Kindern, bei Menschen im Rollstuhl oder mit Prothesen schlechter arbeitet, haben wir hier nicht gemessen. Die Modellkarte gibt dazu keine Zahlen an. Probiere es, wenn du magst, und achte auf blasse Punkte und wackelnde Linien. Ein Skelett, das bei einem Körper danebenliegt, ist ein Fehler des Modells und kein Fehler des Körpers. Auch bei gutem Bild bleibt die Zahl eine Schätzung.",
      "Das Labor wertet nur eine Person aus, die größte im Bild. Eine zweite Person direkt davor oder dahinter kann das Skelett stören.",
     ], merke: "Blasse Punkte sind ein Zeichen, dass das Modell unsicher ist. Wer ihnen trotzdem folgt, folgt einer Vermutung."},
    {h: "Gang und Haltung sind personenbezogen",
     kurz: "Ein Skelett zeigt kein Gesicht. Trotzdem können Haltung und Bewegung eine Person verraten und ihr Verhalten sichtbar machen.",
     visual: {typ: "vergleich",
      links: {titel: "Was das Skelett nicht zeigt", icon: "eye-off", farbe: "gruen", punkte: ["Kein Gesicht", "Keine Kleidung", "Keinen Namen"]},
      rechts: {titel: "Was es doch verrät", icon: "activity", farbe: "orange", punkte: ["Gang und Haltung", "Wann jemand wo steht", "Wie lange jemand sitzt"]}},
     p: [
      "Ein Skelett ist keine Identifikation. Es kann aber helfen, eine Person wiederzuerkennen: Gang, Körperbau und Gewohnheiten sind recht persönlich. Und wer über Wochen aufzeichnet, wie lange jemand am Platz sitzt, wie oft er aufsteht und wie schnell er hebt, hat ein Verhaltensprofil, auch ohne Gesicht.",
      "Darum gelten für Aufnahmen und Auswertungen die Regeln für personenbezogene Daten. Wer aus der Haltung auf die Gesundheit schließt, verarbeitet möglicherweise Gesundheitsdaten, und die sind besonders geschützt (Art. 9 DSGVO). Am Arbeitsplatz hat in Deutschland der Betriebsrat bei technischen Einrichtungen mitzubestimmen, die Verhalten oder Leistung überwachen können (§ 87 BetrVG). Arbeitgeber, die die Haltung Beschäftigter automatisch beurteilen, brauchen also gute Gründe, Transparenz und meist eine Vereinbarung.",
      "Bei Kindern gilt besondere Vorsicht. Eine Sportnote oder eine Haltungsnote, die ein Programm aus dem Kamerabild berechnet, ist ungeeignet: Für kindliche Körper ist das Modell nicht geprüft, und eine Bewertung gehört in Menschenhand. Systeme, die Lernende bewerten, können nach der KI-Verordnung der EU außerdem zu den Hochrisiko-Anwendungen zählen. Fotografieren oder Filmen anderer braucht ihre Zustimmung (Recht am eigenen Bild). Das ist ein Überblick und keine Rechtsberatung.",
      "In diesem Labor gilt der Vertrag aller Kamera-Labore: Das Bild wird nur im Arbeitsspeicher ausgewertet, gezeichnet und verworfen. Es wird nichts gespeichert und nichts mitgeschrieben. Der Zustand deiner Sitzung (Zähler, Glättung) endet mit der Verbindung. Mit deinen Bildern wird nichts trainiert.",
     ], merke: "Kein Gesicht heißt nicht anonym. Haltung, Gang und Gewohnheiten können eine Person und ihr Verhalten sichtbar machen."},
    {h: "Wo es im Alltag vorkommt",
     kurz: "Von der Reha-App bis zur Animation: Dieselbe Technik, aber ganz verschiedene Folgen, wenn etwas schiefgeht.",
     visual: {typ: "raster", spalten: 4, zellen: [
      {icon: "heart-pulse", text: "Reha-Apps", sub: "Übungen zählen"},
      {icon: "trophy", text: "Sportanalyse", sub: "Technik, Tempo"},
      {icon: "video", text: "Animation", sub: "Bewegung ohne Anzug"},
      {icon: "siren", text: "Sturzerkennung", sub: "Alarm bei Liegen"}]},
     p: [
      "In Physiotherapie-Apps zählt das Handy Wiederholungen und meldet, wenn das Knie zu wenig gebeugt war. Beim Sport hilft die Analyse, Bewegungen zu vergleichen, etwa den Armschwung. In Film und Spielen ersetzt sie teure Anzüge, mit denen Bewegungen sonst aufgenommen werden. In Pflege und Betreuung soll die Sturzerkennung Alarm geben, wenn jemand liegen bleibt.",
      "Die Folgen eines Fehlers sind sehr verschieden. Ein falscher Zähler in der Reha-App ärgert. Ein verpasster Sturz kann gefährlich sein, ein Fehlalarm kostet Vertrauen. Darum gehört bei Gesundheit und Sicherheit immer ein Mensch in die Schleife, und die Zahlen sind eine Hilfe, kein Urteil.",
     ], tabelle: {
      beschriftung: "Einsatz, Nutzen und Risiko im Vergleich",
      kopf: ["Einsatz", "Was gemessen wird", "Was schiefgehen kann"],
      zeilen: [
        ["Reha- und Übungs-Apps", "Gelenkwinkel, Wiederholungen", "falscher Zähler; fehlende Anpassung an den Körper"],
        ["Sportanalyse", "Winkel, Tempo, Bewegungsbahnen", "Verdeckung; Kleidung; Zahlen wirken genauer, als sie sind"],
        ["Animation und Spiele", "Haltung ohne Anzug", "Zittern; Hände und Füße ungenau"],
        ["Sturzerkennung", "Lage und Bewegung der Person", "Fehlalarm; verpasster Sturz; dauernde Überwachung"],
        ["Ergonomie am Arbeitsplatz", "Haltung über Stunden", "Verhaltensprofil; Druck auf Beschäftigte"],
      ],
    }},
    {h: "Für Lehrkräfte: eine Unterrichtsidee für 45 Minuten",
     kurz: "Ein freiwilliges Experiment am Lehrkräfte-Rechner mit Diskussion. Es werden keine Kinder bewertet und nichts aufgezeichnet.",
     visual: {typ: "ablauf", schritte: [
      {icon: "message-square", text: "Einstieg", sub: "10 Minuten"},
      {icon: "person-standing", text: "Ausprobieren", sub: "15 Minuten"},
      {icon: "search", text: "Fehler finden", sub: "10 Minuten"},
      {icon: "scale", text: "Bewerten", sub: "10 Minuten"}]},
     p: [
      "Einstieg (10 Minuten): Zeige die Seite ohne Kamera und frage: Was kann man aus einem Strichmännchen ablesen, was nicht? Sammelt Ideen an der Tafel. Prüfe vorher die Hinweise zu Alter und Eltern der Seite (ab 16 Jahren, Jüngere nur mit Einverständnis).",
      "Ausprobieren (15 Minuten): Eine freiwillige Person oder die Lehrkraft stellt sich vor die Kamera, nur sie ist im Bild. Probiert das Skelett, drei Kniebeugen, eine Pose nachmachen. Wer nicht mitmachen will, bleibt außerhalb des Bildes. Niemand wird bewertet.",
      "Fehler finden (10 Minuten): Haltet die Arme hinter den Rücken, setzt euch hin, dreht euch zur Seite, dreht die Kamera ins Gegenlicht. Wann werden Punkte blass, wann springt das Skelett? Notiert Beobachtungen in einer Tabelle.",
      "Bewerten (10 Minuten): Diskutiert in Gruppen: Darf ein Fitnessstudio, ein Arbeitgeber oder eine Schule die Haltung aufzeichnen? Wer sollte zustimmen? Wo wäre ein Nutzen, wo ein Risiko? Haltet je einen Satz fest. Als Ausgangspunkt dienen die Seiten {{verzerrung-ethik|Verzerrung und Ethik}} und {{recht|Recht und KI}}.",
     ]},
  ],
  mitnehmen: [
    "Das Netz liefert 33 Punkte mit einer Sicherheit je Punkt. Winkel, Zähler und Hinweise sind einfache Regeln über diese Punkte.",
    "Ein Skelett ist keine Diagnose und keine Identifikation. Gang und Haltung können trotzdem personenbezogen sein.",
    "Von der Seite zeigt das Bild, ob der Kopf vorsteht, von vorn, ob eine Schulter höher steht. Verdeckte Punkte sind unsicher und werden blass gezeichnet.",
  ],
  quiz: [
    {frage: "Beim Zählen der Kniebeugen gibt es zwei Schwellen: unter 110 Grad und über 160 Grad. Wozu dient die zweite?", optionen: ["Sie macht die Kniebeuge schwerer", "Der Zähler springt nicht bei jedem Zittern des Winkels, sondern erst nach einer ganzen Bewegung", "Sie misst die Hüfte", "Sie spart Strom"], richtig: 1, erklaerung: "Das nennt man Hysterese. Mit einer einzigen Schwelle würde ein Winkel, der um die Grenze wackelt, mehrere Wiederholungen melden."},
    {frage: "Warum kann der Jetson von vorn nicht sicher sagen, ob dein Kopf vor den Schultern steht?", optionen: ["Weil die Kamera zu schlecht ist", "Weil das Bild flach ist und die Tiefe fehlt: Von vorn liegen Nase und Brustbein in einer Linie", "Weil er nur Gesichter sieht", "Weil das Modell Kopfhaltung nicht kennt"], richtig: 1, erklaerung: "Die Punkte liegen in einem flachen Bild. Wie weit der Kopf nach vorn ragt, zeigt erst die Seitenansicht."},
    {frage: "Im Bild ist ein Bein blass gezeichnet. Was heißt das?", optionen: ["Das Bein ist verletzt", "Das Modell ist bei diesen Punkten unsicher, zum Beispiel wegen Verdeckung", "Die Kamera ist schmutzig", "Das Bein gehört zu einer zweiten Person"], richtig: 1, erklaerung: "Blasse Punkte liegen unter der Sicherheitsschwelle. Sie werden in keiner Rechnung benutzt."},
    {frage: "Ein Betrieb will mit Kameras die Haltung seiner Beschäftigten über Wochen beurteilen. Was stimmt?", optionen: ["Ohne Gesicht ist es immer anonym und deshalb frei", "Haltung und Verhalten können personenbezogen sein, in Deutschland hat der Betriebsrat mitzubestimmen", "Das Modell kennt die Gesundheit der Menschen", "Es ist in der EU überall Pflicht"], richtig: 1, erklaerung: "Ein Skelett ohne Gesicht kann trotzdem ein Verhaltensprofil ergeben. Technik, die Verhalten oder Leistung überwachen kann, ist mitbestimmungspflichtig. Das ist ein Überblick, keine Rechtsberatung."},
    {frage: "Was sagt die Ähnlichkeit in der Pose-Übung?", optionen: ["Wie gut du die Pose hältst und wie gesund du bist", "Wie nah die Richtungen deiner Arme und Beine an der Zielpose liegen", "Wie sicher das Modell deinen Namen kennt", "Wie schnell du die Pose machst"], richtig: 1, erklaerung: "Der Jetson vergleicht die Richtung von acht Abschnitten mit der Zielpose und mittelt. Mehr sagt die Zahl nicht."},
    {frage: "Ein Programm soll Kindern im Sportunterricht eine Haltungsnote aus dem Kamerabild geben. Was ist die beste Antwort?", optionen: ["Gut, das ist objektiv", "Besser nicht: Das Modell ist für kindliche Körper nicht belegt, Bewertung von Lernenden gehört in Menschenhand", "Nur wenn die Note automatisch an die Eltern geht", "Nur nachts"], richtig: 1, erklaerung: "Ein Skelett kann bei Kindern danebenliegen, und die Bewertung von Lernenden durch KI ist heikel. Eine Beobachtung ersetzt kein Urteil."},
  ],
  business: {
    text: "Übungen mit Rückmeldung in Reha und Training, Ergonomie-Hinweise am Arbeitsplatz auf freiwilliger Basis, Bewegungsanalyse im Sport, Sturzerkennung in der Betreuung. Immer mit Einwilligung, Transparenz und einem Menschen, der entscheidet.",
    beispiele: ["Reha: Kniebeuge zählen und Hinweis geben, wenn das Knie zu wenig beugt", "Büro: freiwillige Haltungsübung, deren Ergebnis nur die Person selbst sieht"],
  },
  grenzen: [
    "Verdeckte Punkte werden geraten. Das Modell zeigt sie blass, die Regeln benutzen sie nicht.",
    "Aus einem flachen Bild lässt sich die Tiefe nur grob schätzen: Der Kopf vor den Schultern ist nur von der Seite erkennbar.",
    "Wie gut das Modell bei Kindern, im Rollstuhl oder mit Prothesen arbeitet, ist hier nicht gemessen worden.",
    "Eine Haltung, die auf dem Bild gerade aussieht, sagt nichts über Schmerzen oder Gesundheit.",
  ],
  weiter: ["hand-gesicht", "bild-als-zahlen", "cnn-intuition", "vision-aufgaben", "verzerrung-ethik", "recht", "uc-sicherheit-baustelle"],
},

};

const glossar = {
  gelenkwinkel: ["Gelenkwinkel", "Der Winkel zwischen zwei Knochenstrecken an einem Gelenk, aus drei Punkten berechnet, zum Beispiel Hüfte, Knie und Knöchel. 180 Grad heißt gestreckt."],
  hysterese: ["Hysterese", "Eine Schaltschwelle mit zwei Werten, einem zum Einschalten und einem anderen zum Ausschalten. Sie verhindert, dass etwas bei jedem kleinen Wackeln hin und her springt."],
  glaetten: ["Glättungsfilter", "Ein Verfahren, das schwankende Messwerte beruhigt, indem es frühere Werte mit einrechnet. Bei schneller Bewegung rechnet es das Frühere weniger ein, damit nichts hinterherhinkt."],
};

INHALT.registriere({ seiten, glossar, gruppen: [] });

/* Einhängen in die Nachbarschaft (diese Datei lädt nach content-laien.js und den Strängen Sehen und Betrieb) */
const sehen = INHALT.gruppen.find((g) => g.name === "Sehen");
if (sehen && !sehen.seiten.includes("koerperhaltung")) {
  const i = sehen.seiten.indexOf("hand-gesicht");
  sehen.seiten.splice(i >= 0 ? i + 1 : sehen.seiten.length, 0, "koerperhaltung");
}
INHALT.kameraSeiten = (INHALT.kameraSeiten || []).concat(INHALT.kameraSeiten && INHALT.kameraSeiten.includes("koerperhaltung") ? [] : ["koerperhaltung"]);
const pfad = (INHALT.lernpfade || []).find((p) => p.id === "anwenden");
if (pfad && !pfad.seiten.includes("koerperhaltung")) pfad.seiten.splice(Math.max(0, pfad.seiten.indexOf("objekt") + 1), 0, "koerperhaltung");
for (const id of ["hand-gesicht", "vision-aufgaben", "cnn-intuition", "bild-als-zahlen", "uc-sicherheit-baustelle"]) {
  const s = INHALT.seiten[id];
  if (s && Array.isArray(s.weiter) && !s.weiter.includes("koerperhaltung")) s.weiter.push("koerperhaltung");
}

})();
