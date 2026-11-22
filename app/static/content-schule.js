/* Seiten "Für die Schule": Einstieg, drei 45-Minuten-Stunden für Klasse 8, Handreichung für Lehrkräfte, Infos für Schulleitung und Eltern.
   Grundlage: docs/jugendpaedagogik.md (Sichtung vom 22.11.2026), docs/schreibleitfaden.md, docs/visuals.md.
   Fakten zu Daten und Betrieb nur aus app/app.py, app/sicherheit.py, docs/ und content-rechtliches.js.
   Die Seiten für Schulleitung und Eltern sind keine Rechtsberatung und ersetzen nicht die Datenschutzerklärung des Betreibers.
   Alle Aufgaben kommen ohne Kamera, Mikrofon und Gesichtserkennung aus. Punkte-Labor (Seite ml), Netz-Spielplatz (Seite
   neuronale-netze) und Risiko-Spiel (Seite llm-grenzen) rechnen im Browser des Geräts; nur Chat und Prompt-Werkstatt
   brauchen das Sprachmodell auf dem Rechner des Labors. */
(function () {

const S = {};

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
      {icon: "lightbulb", text: "Stunde 1", sub: "Was ist KI?"},
      {icon: "brain-circuit", text: "Stunde 2", sub: "Wie lernt sie?"},
      {icon: "search", text: "Stunde 3", sub: "Echt oder erfunden?", farbe: "gruen"}]},
     liste: [
      "{{schule-stunde-1|Stunde 1}}: Was ist KI? Punkte-Labor und Prompting.",
      "{{schule-stunde-2|Stunde 2}}: Wie lernt ein Computer? Punkte-Labor und Netz-Spielplatz.",
      "{{schule-stunde-3|Stunde 3}}: Echt oder erfunden? Halluzinationen und Quellenprüfung.",
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
     kurz: "Vierergruppen, höchstens 7 Geräte gleichzeitig, denn der Rechner beantwortet Sprachmodell-Anfragen nacheinander.",
     visual: {typ: "zahlen", kacheln: [
      {wert: "4", label: "Personen je Gruppe", icon: "users"},
      {wert: "7", label: "Geräte höchstens", icon: "laptop"},
      {wert: "kurz", label: "Wartezeit bei Chat", icon: "hourglass"}]},
     p: [
      "Chat und Prompt-Werkstatt brauchen das Sprachmodell. Der kleine Rechner antwortet nacheinander, bei vielen Anfragen erscheint ein Hinweis wie „Du bist Nr. 2“. Darum: Vierergruppen, ein Gerät je Gruppe, höchstens 7 Geräte gleichzeitig (28 Personen passen genau). Punkte-Labor, Netz-Spielplatz und Risiko-Spiel rechnen im Browser.",
     ],
     alltag: "Wie ein Kopierer in der Schule: Er druckt ein Blatt nach dem anderen, wer wartet, kommt trotzdem dran."},
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
      "Alle Aufgaben laufen ohne Kamera und Mikrofon, bitte lasst die Labore dazu im Menü in der Klasse aus. Das Gesichts-Labor ist laut Hinweis erst ab 16 Jahren gedacht, jüngere nur mit Einverständnis der Eltern.",
     ]},
  ],
  mitnehmen: [
    "Das Labor ist kostenlos, braucht kein Konto und speichert keine Eingaben dauerhaft.",
    "Vierergruppen, höchstens 7 Geräte gleichzeitig, kurze Wartezeiten einplanen.",
    "Kamera, Mikrofon und Gesichtserkennung bleiben im Unterricht aus. Die Aufgaben brauchen sie nicht.",
  ],
  grenzen: [
    "Das Labor ist ein einzelner kleiner Rechner. Bei vielen gleichzeitigen Sprachmodell-Anfragen entstehen Wartezeiten.",
    "Das Sprachmodell ist klein und macht Fehler. Das ist Teil der Stunde 3, aber keine Musterlösung für Hausaufgaben.",
  ],
  weiter: ["schule-stunde-1", "schule-lehrkraefte", "schule-schulleitung", "schule-eltern"],
};

/* ------------------------------------------------------------------ Stunde 1 */
S["schule-stunde-1"] = {
  nav: "Stunde 1: Was ist KI?", typ: "lektion", gruppe: "Für die Schule", titel: "Stunde 1: Was ist KI? Erkennen, Lernen, Entscheiden", symbol: "presentation",
  lernziele: [
    "Du kannst an drei Beispielen aus deinem Alltag erklären, wo KI etwas erkennt und entscheidet.",
    "Du kannst im Punkte-Labor zeigen, dass ein Modell aus Beispielen lernt und nicht aus festen Regeln.",
    "Du kannst einen Prompt so verbessern, dass die Antwort des Sprachmodells besser passt.",
  ],
  kurz: "45 Minuten für Klasse 8, ohne Kamera: Einstieg 5, Erarbeitung 20, Sicherung 10, Reflexion 10.",
  zusammenfassung: "Stunde 1 von 3 für Klasse 8: Was ist KI? Die Klasse erlebt im Punkte-Labor, dass ein Modell aus Beispielen lernt, und verbessert in der Prompt-Werkstatt eine Frage an ein Sprachmodell. Mit Zeitplan, Aufgaben, Lösungshinweisen und Tafelbild.",
  abschnitte: [
    {h: "Zum Ausdrucken",
     kurz: "Arbeitsblatt für die Klasse und Lösungsblatt für dich, jeweils als PDF mit QR-Code zu dieser Seite.",
     visual: {typ: "raster", spalten: 2, zellen: [
      {icon: "file-text", text: "Arbeitsblatt", sub: "1 Seite A4, für die Klasse"},
      {icon: "circle-check", text: "Lösungsblatt", sub: "2 Seiten, für dich"}]},
     p: [
      "[Arbeitsblatt Stunde 1 (PDF)](/static/materialien/arbeitsblatt-stunde-1.pdf)",
      "[Lösungsblatt Stunde 1 (PDF)](/static/materialien/loesung-stunde-1.pdf)"
     ]},
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
     kurz: "Drei Aufgaben für die Gruppe, die auf ein Blatt passen.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "chart-scatter", text: "Aufgabe 1", sub: "Punkte lernen lassen"},
      {icon: "sliders-horizontal", text: "Aufgabe 2", sub: "k verändern"},
      {icon: "pen-line", text: "Aufgabe 3", sub: "Prompt verbessern"}]},
     liste: [
      "**Aufgabe 1, Punkte-Labor:** Setze mit Blau etwa zehn Punkte in die linke und mit Orange etwa zehn Punkte in die rechte Hälfte. Fahre mit der Maus über eine freie Stelle in der Mitte. Wie entscheidet das Labor? Schreibe es in einem Satz auf.",
      "**Aufgabe 2, Punkte-Labor:** Schalte „Entscheidungsfläche zeigen“ ein und verändere den Regler k (Nachbarn) von 1 bis 15. Was passiert mit der Grenze zwischen den Farben? Setze dann einen blauen Punkt mitten in die orangefarbene Gruppe. Was ändert sich bei k gleich 1 und bei k gleich 9?",
      "**Aufgabe 3, Prompt-Werkstatt:** Wähle eine Aufgabe aus dem Alltag und drücke „Beide senden“. Vergleiche die Antworten von Prompt A (kurz) und Prompt B (ausführlich). Welche passt besser? Ändere Prompt A so, dass er fast so gut wird wie Prompt B.",
      "**Zusatz für Schnelle:** Drücke „Beispieldaten“ im Punkte-Labor und setze drei eigene Punkte an Stellen, an denen die Entscheidung schwerfällt. Begründe, warum sie schwerfällt.",
     ]},
    {h: "Lösungshinweise",
     kurz: "Das Labor entscheidet nach den nächsten Beispielen, ein knapper Prompt lässt dem Modell Raum zum Raten.",
     visual: {typ: "vergleich",
      links: {titel: "Punkte-Labor", icon: "chart-scatter", farbe: "akzent", punkte: ["Nächste Nachbarn stimmen ab", "Kleines k: unruhige Grenze", "Großes k: ruhige Grenze"]},
      rechts: {titel: "Prompt-Werkstatt", icon: "pen-line", farbe: "gruen", punkte: ["Rolle, Ziel, Form nennen", "Was fehlt, wird geraten", "Antwort prüfen"]}},
     liste: [
      "**Zu Aufgabe 1:** Das Labor nimmt die Farbe der Mehrheit unter den Punkten, die dem Mauspunkt am nächsten liegen. Es braucht keine Regel wie „links ist blau“: Beispiele statt Regeln, das Kernbild von maschinellem Lernen.",
      "**Zu Aufgabe 2:** Bei kleinem k folgt die Grenze jedem einzelnen Punkt und wird unruhig, bei großem k wird sie glatter. Ein falsch gesetzter Punkt stört bei k gleich 1 stark, bei größerem k kaum, die Mehrheit überstimmt ihn.",
      "**Zu Aufgabe 3:** Prompt B nennt meist Rolle, Ziel, Ton und Form, daran liegt der Unterschied. Es gibt keine Musterantwort, die Antworten des Modells wechseln. Zählt die Begründung der Gruppe.",
      "**Zum Zusatz:** Schwer fällt die Entscheidung dort, wo beide Farben gemischt liegen. Dort hat das Modell zu wenig klare Beispiele.",
     ]},
    {h: "Differenzierung: leicht und schwer",
     kurz: "Leichte Wege geben Sätze vor, schwere Wege verlangen eigene Begründungen.",
     visual: {typ: "vergleich",
      links: {titel: "Leichter", icon: "smile", farbe: "gruen", punkte: ["Knopf „Beispieldaten“ nutzen", "Lückensatz zur Entscheidung", "Prompt A nur um eine Angabe ergänzen"]},
      rechts: {titel: "Schwerer", icon: "flame", farbe: "orange", punkte: ["Eigene Daten mit drei Farben", "Entscheidungsfläche deuten", "Neuen Prompt von null schreiben"]}},
     liste: [
      "**Leichter:** Start mit „Beispieldaten“, Satz ergänzen: „Das Labor entscheidet nach ___, weil ___.“ Bei Aufgabe 3 nur eine Angabe in Prompt A ergänzen, etwa den Ton.",
      "**Schwerer:** Drei Farben, die sich überlappen: Wo macht die Fläche Fehler? Bei Aufgabe 3 einen neuen Prompt mit Rolle, Ziel, Kontext, Format und Grenzen schreiben.",
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
    {frage: "Was tut das Punkte-Labor, wenn du mit der Maus eine freie Stelle ansteuerst?",
     optionen: ["Es liest vorher geschriebene Regeln für jede Farbe nach", "Es sucht die nächsten Beispielpunkte und nimmt die Mehrheitsfarbe", "Es fragt einen Server im Netz nach der richtigen Farbe", "Es würfelt so lange, bis zufällig eine Farbe passt"],
     richtig: 1, erklaerung: "Das Labor vergleicht mit den nächsten Beispielen und lässt sie abstimmen. Eine feste Regel gibt es nicht."},
    {frage: "Warum entscheidet ein Modell mit zu wenigen Beispielen oft schlecht?",
     optionen: ["Es kennt nur, was in den Beispielen steckt, und rät sonst", "Es wird dann zu schnell und überspringt das Lernen", "Es lernt von selbst die fehlenden Beispiele dazu", "Es braucht für wenige Beispiele einen größeren Rechner"],
     richtig: 0, erklaerung: "Ein Modell hat kein Wissen außerhalb seiner Beispiele. Wo sie fehlen, wird die Entscheidung unsicher."},
    {frage: "Wann hilft ein längerer Prompt besonders?",
     optionen: ["Immer, weil mehr Wörter die Antwort klüger machen", "Nur, wenn der Text viele Fachwörter enthält", "Wenn sonst Ziel, Ton oder Form der Antwort offen blieben", "Wenn man das Modell damit schneller antworten lässt"],
     richtig: 2, erklaerung: "Länge allein hilft nicht. Es zählt, dass der Prompt sagt, was fehlen würde: Ziel, Ton und Form."},
  ],
  weiter: ["schule-stunde-2", "ml", "prompting", "karte"],
};

/* ------------------------------------------------------------------ Stunde 2 */
S["schule-stunde-2"] = {
  nav: "Stunde 2: Wie lernt ein Computer?", typ: "lektion", gruppe: "Für die Schule", titel: "Stunde 2: Wie lernt ein Computer? Daten, Training, Fehler", symbol: "brain-circuit",
  lernziele: [
    "Du kannst erklären, warum die Qualität der Daten bestimmt, wie gut ein Modell entscheidet.",
    "Du kannst am Netz-Spielplatz zeigen, dass Training ein Kreislauf aus Vorhersagen, Fehler messen und Nachjustieren ist.",
    "Du kannst beschreiben, was ein Netz tun muss, damit es ein schwieriges Muster lernt.",
  ],
  kurz: "45 Minuten für Klasse 8: Daten, Training und Fehler erlebst du im Punkte-Labor und im Netz-Spielplatz.",
  zusammenfassung: "Stunde 2 von 3 für Klasse 8: Wie lernt ein Computer? Die Klasse arbeitet mit dem Punkte-Labor und dem Netz-Spielplatz, beide ohne Kamera. Sie sieht, wie Daten und Fehler das Lernen verändern und warum Netze Zwischenschichten brauchen.",
  abschnitte: [
    {h: "Zum Ausdrucken",
     kurz: "Arbeitsblatt für die Klasse und Lösungsblatt für dich, jeweils als PDF mit QR-Code zu dieser Seite.",
     visual: {typ: "raster", spalten: 2, zellen: [
      {icon: "file-text", text: "Arbeitsblatt", sub: "1 Seite A4, für die Klasse"},
      {icon: "circle-check", text: "Lösungsblatt", sub: "2 Seiten, für dich"}]},
     p: [
      "[Arbeitsblatt Stunde 2 (PDF)](/static/materialien/arbeitsblatt-stunde-2.pdf)",
      "[Lösungsblatt Stunde 2 (PDF)](/static/materialien/loesung-stunde-2.pdf)"
     ]},
    {h: "Der Zeitplan",
     kurz: "Wieder 45 Minuten: Einstieg 5, Erarbeitung 20, Sicherung 10, Reflexion 10.",
     visual: {typ: "zeitachse", punkte: [
      {t: "5 Min", text: "Einstieg", icon: "lightbulb"},
      {t: "20 Min", text: "Erarbeitung", icon: "mouse"},
      {t: "10 Min", text: "Sicherung", icon: "clipboard-check"},
      {t: "10 Min", text: "Reflexion", icon: "message-circle"}]},
     p: [
      "Beide Labore rechnen im Browser, die Gruppen können gleichzeitig arbeiten. Die Stunde baut auf {{schule-stunde-1|Stunde 1}} auf.",
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
     liste: [
      "**Aufgabe 1, Punkte-Labor:** Drücke „Beispieldaten“ und schalte „Entscheidungsfläche zeigen“ ein. Setze einen Punkt in der falschen Farbe mitten in eine Gruppe. Stelle k auf 1, dann auf 9. Wo entsteht ein Fehler? Wie sieht die Fläche rund um den falschen Punkt aus?",
      "**Aufgabe 2, Netz-Spielplatz:** Wähle „Zwei Wolken“, starte das Training mit 0 Zwischenschichten und notiere die Zahl der richtigen Punkte. Wiederhole das mit dem „Schachbrett“. Was fällt auf? Baue dann eine Zwischenschicht mit vier Neuronen ein und trainiere erneut.",
      "**Aufgabe 3, Netz-Spielplatz:** Stelle die Lernrate sehr klein, dann sehr groß. Beobachte den Verlust (die Kurve). Bei welcher Einstellung lernt das Netz stabil? Schreibe in zwei Sätzen auf, was die Lernrate steuert.",
      "**Zusatz für Schnelle:** Wähle die „Spirale“. Wie viele Schichten und Neuronen brauchst du, damit mehr als 90 von 100 Punkten stimmen? Vergleiche die Trainings- und die Testkurve.",
     ]},
    {h: "Lösungshinweise",
     kurz: "Falsche Beispiele schaden bei kleinem k stark, schwierige Muster brauchen Zwischenschichten.",
     visual: {typ: "matrix", x: ["Zwei Wolken", "Schachbrett"], y: ["Ohne Schicht", "Mit Schicht"],
      zellen: [[{text: "gelingt", ton: "gut"}, {text: "scheitert", ton: "schlecht"}],
               [{text: "gelingt", ton: "gut"}, {text: "gelingt", ton: "gut"}]]},
     liste: [
      "**Zu Aufgabe 1:** Bei k gleich 1 entscheidet allein der nächste Punkt, um den falschen Punkt bildet sich eine Insel in der falschen Farbe. Bei k gleich 9 überstimmen die richtigen Nachbarn den Fehler. Lehre: Fehler in den Trainingsdaten wirken mal stärker, mal schwächer.",
      "**Zu Aufgabe 2:** Zwei Wolken trennt eine gerade Linie, das schafft ein Netz ohne Zwischenschicht. Das Schachbrett braucht eine gebogene Grenze: Ohne Zwischenschicht bleibt die Trefferquote nahe der Hälfte, erst eine Zwischenschicht mit mehreren Neuronen biegt die Grenze.",
      "**Zu Aufgabe 3:** Eine sehr kleine Lernrate lässt das Netz kaum vorankommen, eine sehr große lässt den Verlust springen, das Netz findet keine stabile Lösung. Die Lernrate steuert die Schrittgröße beim Nachjustieren.",
      "**Zum Zusatz:** Fällt die Trainingskurve weiter, während die Testkurve steigt, hat das Netz die Beispiele eher auswendig gelernt ([[ueberanpassung|Überanpassung]]), vor allem mit sehr vielen Neuronen und wenigen Daten.",
     ]},
    {h: "Differenzierung: leicht und schwer",
     kurz: "Leichte Wege geben Einstellungen vor, schwere verlangen eigene Vermutungen.",
     visual: {typ: "vergleich",
      links: {titel: "Leichter", icon: "smile", farbe: "gruen", punkte: ["Einstellungen sind vorgegeben", "Lückentext zum Ergebnis", "Nur Aufgabe 1 und 2"]},
      rechts: {titel: "Schwerer", icon: "flame", farbe: "orange", punkte: ["Erst vermuten, dann testen", "Kurven deuten", "Spirale und Zusatzaufgabe"]}},
     liste: [
      "**Leichter:** Die Lehrkraft nennt die Einstellungen, etwa „Schachbrett, 1 Schicht, 4 Neuronen“. Die Gruppe ergänzt: „Ohne Zwischenschicht stimmen nur etwa ___ Punkte, weil ___.“",
      "**Schwerer:** Erst eine Vermutung aufschreiben („Mit zwei Neuronen reicht es für das Schachbrett“), dann prüfen und Trainings- und Testkurve unterscheiden.",
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
    {frage: "Ein Netz ohne Zwischenschicht lernt das Schachbrett nicht. Was hilft meist?",
     optionen: ["Mehr Trainingsschritte laufen lassen, ohne etwas zu ändern", "Mindestens eine Zwischenschicht mit mehreren Neuronen einbauen", "Die Lernrate auf null stellen, damit nichts schiefgeht", "Nur noch Punkte einer Farbe zum Training benutzen"],
     richtig: 1, erklaerung: "Ohne Zwischenschicht kann das Netz nur eine gerade Grenze ziehen. Das Schachbrett braucht eine gebogene."},
    {frage: "Was zeigt der Verlust im Netz-Spielplatz?",
     optionen: ["Wie viele Neuronen das Netz im Training verloren hat", "Wie lange das Training schon läuft, in Sekunden", "Wie weit die Vorhersagen vom richtigen Ergebnis entfernt sind", "Wie viele Punkte du selbst gesetzt hast"],
     richtig: 2, erklaerung: "Der Verlust misst den Fehler. Das Training versucht, ihn Schritt für Schritt kleiner zu machen."},
    {frage: "Ein falsch gefärbter Punkt liegt mitten in der anderen Gruppe. Was folgt daraus?",
     optionen: ["Nichts, denn Modelle erkennen falsche Beispiele immer selbst", "Das Modell wird dadurch automatisch genauer", "Das Modell kann dort falsch entscheiden, vor allem bei kleinem k", "Das Modell löscht den Punkt nach dem Training von allein"],
     richtig: 2, erklaerung: "Das Modell kann nicht wissen, dass der Punkt ein Fehler ist. Bei k gleich 1 zählt er voll."},
  ],
  weiter: ["schule-stunde-3", "neuronale-netze", "training", "daten"],
};

/* ------------------------------------------------------------------ Stunde 3 */
S["schule-stunde-3"] = {
  nav: "Stunde 3: Echt oder erfunden?", typ: "lektion", gruppe: "Für die Schule", titel: "Stunde 3: Echt oder erfunden? KI prüfen", symbol: "search",
  lernziele: [
    "Du kannst erklären, warum ein Sprachmodell Dinge erfinden kann, die überzeugend klingen.",
    "Du kannst eine Antwort in drei Schritten prüfen: Quelle, zweite Quelle, Datum.",
    "Du kannst begründen, wann du einer KI-Antwort nicht allein vertrauen solltest.",
  ],
  kurz: "45 Minuten für Klasse 8: Du testest, wie ein Sprachmodell erfindet, und prüfst Antworten.",
  zusammenfassung: "Stunde 3 von 3 für Klasse 8: Echt oder erfunden? Die Klasse testet im Chat, wie ein Sprachmodell Antworten erfindet (Halluzination), spielt das Risiko-Spiel und übt die Quellenprüfung in drei Schritten. Ohne Kamera, mit Zeitplan, Aufgaben und Lösungshinweisen.",
  abschnitte: [
    {h: "Zum Ausdrucken",
     kurz: "Arbeitsblatt für die Klasse und Lösungsblatt für dich, jeweils als PDF mit QR-Code zu dieser Seite.",
     visual: {typ: "raster", spalten: 2, zellen: [
      {icon: "file-text", text: "Arbeitsblatt", sub: "1 Seite A4, für die Klasse"},
      {icon: "circle-check", text: "Lösungsblatt", sub: "2 Seiten, für dich"}]},
     p: [
      "[Arbeitsblatt Stunde 3 (PDF)](/static/materialien/arbeitsblatt-stunde-3.pdf)",
      "[Lösungsblatt Stunde 3 (PDF)](/static/materialien/loesung-stunde-3.pdf)"
     ]},
    {h: "Der Zeitplan",
     kurz: "Einstieg 5, Erarbeitung 20, Sicherung 10, Reflexion 10 Minuten.",
     visual: {typ: "zeitachse", punkte: [
      {t: "5 Min", text: "Einstieg", icon: "lightbulb"},
      {t: "20 Min", text: "Erarbeitung", icon: "search"},
      {t: "10 Min", text: "Sicherung", icon: "clipboard-check"},
      {t: "10 Min", text: "Reflexion", icon: "message-circle"}]},
     p: [
      "Der Chat braucht das Sprachmodell: Die Gruppen stellen die Frage zeitlich versetzt, kurze Wartezeiten einplanen. Das Risiko-Spiel rechnet im Browser. Die Stunde baut auf {{schule-stunde-2|Stunde 2}} auf.",
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
     liste: [
      "**Aufgabe 1, Chat:** Frage das Sprachmodell nach dem erfundenen Fall der Lehrkraft, zum Beispiel „Wer hat das Buch ‚Titel‘ geschrieben und wann erschien es?“. Schreibe die Antwort auf. Gab das Modell zu, nichts zu wissen, oder erfand es etwas Überzeugendes?",
      "**Aufgabe 2, Risiko-Spiel:** Spielt die Karten durch. Entscheidet bei jeder Karte: Stimmt oder erfunden? Notiert, bei welchen Karten ihr falsch lagt und woran ihr es hättet erkennen können.",
      "**Aufgabe 3, Prüfen:** Nimm eine Behauptung aus Aufgabe 1. Prüfe sie in drei Schritten: Wer ist die Quelle? Gibt es eine zweite, unabhängige Quelle? Von wann ist die Information? Schreibe das Ergebnis in drei Sätzen auf.",
      "**Zusatz für Schnelle:** Formuliere eine Regel für deine Klasse: „Bevor ich eine KI-Antwort weitergebe, prüfe ich ___.“ Vergleicht die Regeln der Gruppen.",
     ]},
    {h: "Lösungshinweise",
     kurz: "Ein Modell klingt sicher und erfindet trotzdem, prüfen heißt: Quelle, zweite Quelle, Datum.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "user-round", text: "Quelle", sub: "Wer sagt das?"},
      {icon: "copy", text: "Zweite Quelle", sub: "unabhängig"},
      {icon: "calendar", text: "Datum", sub: "noch aktuell?", farbe: "gruen"}]},
     liste: [
      "**Zu Aufgabe 1:** Beide Ergebnisse lehren etwas: Erfindet das Modell Autor und Jahr, ist das eine [[halluzination|Halluzination]], sagt es „kenne ich nicht“, hat es richtig reagiert. Die Antworten wechseln, teste den Fall vorher selbst.",
      "**Zu Aufgabe 2:** Jede Karte hat eine Auflösung mit Erklärung. Typisch für Erfundenes: sehr genaue Zahlen und Aktenzeichen ohne Beleg und ein selbstsicherer Ton.",
      "**Zu Aufgabe 3:** Gut geprüft heißt: Quelle mit Namen, zweite Quelle, Datum. Bei Büchern helfen ein Bibliothekskatalog oder die Seite des Verlags. Das Modell um Bestätigung zu bitten ist keine Prüfung, es bestätigt oft die eigene Antwort.",
      "**Zum Zusatz:** Gute Regeln sind kurz und prüfbar, zum Beispiel „Zahlen und Namen immer in einer zweiten Quelle suchen“.",
     ]},
    {h: "Differenzierung: leicht und schwer",
     kurz: "Leichte Wege geben Prüffragen vor, schwere Wege verlangen eigene Recherche.",
     visual: {typ: "vergleich",
      links: {titel: "Leichter", icon: "smile", farbe: "gruen", punkte: ["Prüffragen sind vorgegeben", "Antwort mit Lückentext", "Fall ist bereits ausgewählt"]},
      rechts: {titel: "Schwerer", icon: "flame", farbe: "orange", punkte: ["Eigene Frage ausdenken", "Zwei Quellen vergleichen", "Eigene Regel begründen"]}},
     liste: [
      "**Leichter:** Die drei Prüffragen stehen auf einer Karte, die Gruppe füllt „Die Antwort ist ___, weil ___.“ aus.",
      "**Schwerer:** Die Gruppe sucht selbst eine Behauptung, die ein Modell erfunden haben könnte, prüft sie mit zwei Quellen und bewertet deren Verlässlichkeit.",
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
    {frage: "Warum erfindet ein Sprachmodell manchmal Quellen?",
     optionen: ["Es will die Nutzer absichtlich täuschen und gewinnen", "Es sucht im Netz und tippt dabei manchmal falsch", "Es erfindet nur dann, wenn man sehr unfreundlich fragt", "Es setzt Wörter nach Wahrscheinlichkeit zusammen und prüft nichts"],
     richtig: 3, erklaerung: "Das Modell erzeugt Text, der plausibel klingt. Ob er stimmt, prüft es nicht."},
    {frage: "Woran erkennst du am besten, dass eine Quelle verlässlich ist?",
     optionen: ["Der Text klingt sicher und enthält keine Fehler", "Mehrere unabhängige Quellen sagen dasselbe", "Der Beitrag hat viele Likes und wurde oft geteilt", "Er steht ganz oben in den Suchergebnissen"],
     richtig: 1, erklaerung: "Unabhängige Quellen, die dasselbe sagen, sind ein gutes Zeichen. Likes und Platz in der Suche sagen nichts über Wahrheit."},
    {frage: "Das Modell nennt ein Buch mit Autor und Jahr. Was tust du zuerst?",
     optionen: ["Ich glaube es, weil Autor und Jahr genannt sind", "Ich frage das Modell, ob es sich sicher ist", "Ich suche das Buch in einem Bibliothekskatalog", "Ich frage nochmal und nehme die häufigste Antwort"],
     richtig: 2, erklaerung: "Ein Katalog ist eine unabhängige Quelle. Das Modell bestätigt oft seine eigene Antwort."},
  ],
  weiter: ["echt-oder-ki", "quellen-pruefen", "llm-grenzen", "chat", "verzerrung-ethik"],
};

/* ------------------------------------------------------------------ Handreichung */
S["schule-lehrkraefte"] = {
  nav: "Handreichung Lehrkräfte", typ: "lektion", gruppe: "Für die Schule", titel: "Handreichung für Lehrkräfte", symbol: "graduation-cap",
  lernziele: [
    "Du kannst eine Stunde in zehn Minuten vorbereiten.",
    "Du kannst Fachbegriffe und die häufigsten Schülerfragen kurz beantworten.",
    "Du erkennst typische Stolperstellen, bevor sie im Unterricht auftreten.",
  ],
  kurz: "Checkliste, Fachbegriffe, Kurzantworten und Stolperstellen für die drei Stunden in Klasse 8.",
  zusammenfassung: "Handreichung für Lehrkräfte zu den drei KI-Stunden in Klasse 8: Lernziele nach den Stufen Verstehen, Anwenden, Erstellen und Bewerten, Vorbereitung, Fachbegriffe, häufige Schülerfragen mit Antworten, Stolperstellen und Quellen zum Weiterlesen.",
  abschnitte: [
    {h: "Arbeitsblätter und Lösungen",
     kurz: "Für jede Stunde ein Arbeitsblatt und ein Lösungsblatt zum Ausdrucken.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "file-text", text: "Stunde 1", sub: "Arbeitsblatt und Lösung"},
      {icon: "file-text", text: "Stunde 2", sub: "Arbeitsblatt und Lösung"},
      {icon: "file-text", text: "Stunde 3", sub: "Arbeitsblatt und Lösung"}]},
     p: [
      "Stunde 1: [Arbeitsblatt](/static/materialien/arbeitsblatt-stunde-1.pdf) und [Lösungsblatt](/static/materialien/loesung-stunde-1.pdf)",
      "Stunde 2: [Arbeitsblatt](/static/materialien/arbeitsblatt-stunde-2.pdf) und [Lösungsblatt](/static/materialien/loesung-stunde-2.pdf)",
      "Stunde 3: [Arbeitsblatt](/static/materialien/arbeitsblatt-stunde-3.pdf) und [Lösungsblatt](/static/materialien/loesung-stunde-3.pdf)"
     ]},
    {h: "Was die Klasse am Ende kann",
     kurz: "Vier Stufen, verteilt auf die drei Stunden, angelehnt an gängige Kompetenzrahmen.",
     visual: {typ: "raster", spalten: 4, zellen: [
      {icon: "brain", text: "Verstehen", sub: "Stunde 1 und 2"},
      {icon: "mouse", text: "Anwenden", sub: "alle Stunden"},
      {icon: "pencil", text: "Erstellen", sub: "Stunde 1 und 3"},
      {icon: "scale", text: "Bewerten", sub: "Stunde 3"}]},
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
    {h: "Vorbereitung in zehn Minuten",
     kurz: "Link testen, Labore ausprobieren, Gruppen bilden, Aufgaben kopieren.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "link", text: "Link testen", sub: "/?weg=schule"},
      {icon: "mouse", text: "Selbst probieren", sub: "Labore der Stunde"},
      {icon: "users", text: "Gruppen", sub: "vier Personen", farbe: "gruen"}]},
     liste: [
      "Klassenlink am Unterrichtsgerät öffnen: Lädt das Labor?",
      "Labore der Stunde ausprobieren, für Stunde 3 den erfundenen Fall im Chat testen.",
      "Vierergruppen bilden, ein Gerät je Gruppe, höchstens 7 Geräte gleichzeitig.",
      "Aufgaben aus „Arbeitsblatt: die Aufgaben“ kopieren oder auf der Lernplattform ablegen.",
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
       ["Warum dauert das so lange?", "Der Rechner ist klein und antwortet nacheinander."],
       ["Wie viele Daten braucht man?", "Im Punkte-Labor reichen wenige Dutzend, echte Bilderkennung braucht viel mehr."],
      ],
     }},
    {h: "Stolperstellen",
     kurz: "Typische Probleme im Unterricht und wie du sie umgehst.",
     visual: {typ: "vergleich",
      links: {titel: "Häufig", icon: "triangle-alert", farbe: "orange", punkte: ["Alle drücken gleichzeitig auf Senden", "KI wird vermenschlicht", "Chat-Antwort wird als Lösung gesehen"]},
      rechts: {titel: "Besser", icon: "circle-check", farbe: "gruen", punkte: ["Gruppen versetzt starten", "Von Rechnen statt Denken sprechen", "Antwort als Vorschlag prüfen"]}},
     tabelle: {
      beschriftung: "Stolperstellen",
      kopf: ["Problem", "So gehst du damit um"],
      zeilen: [
       ["Wartezeit", "Gruppen versetzt starten, Wartenden eine Zusatzaufgabe geben."],
       ["Vermenschlichen", "Statt „die KI weiß“ sagen: „das Modell berechnet“."],
       ["Musterlösung im Chat", "Antworten wechseln: die Begründung der Gruppe bewerten, nicht den Wortlaut."],
       ["Geräte", "Mit der Maus am genauesten, Laptop oder Tablet vor Handy."],
       ["Eingaben", "Keine Namen, Adressen oder privaten Dinge tippen lassen."],
       ["Kamera-Labore", "Nicht für den Unterricht, vorher laut sagen."],
       ["Lehrplanbezug", "Für kein Bundesland geprüft, an die Vorgaben der Schule anpassen."],
      ],
     }},
    {h: "Weiterlesen",
     kurz: "Quellen zu Kompetenzrahmen, Datenschutz in der Schule und Sprachmodellen im Unterricht.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "book-open", text: "Kompetenzen", sub: "Uni Münster"},
      {icon: "shield-check", text: "Datenschutz", sub: "Kultusministerium"},
      {icon: "languages", text: "Sprachmodelle", sub: "Uni Potsdam"}]},
     liste: [
      "Universität Münster, „KI-Kompetenzen“: `uni-muenster.de/imperia/md/content/ifpol/broschure_ki-kompetenzen.pdf`",
      "UNESCO, KI-Kompetenzrahmen für Lernende (Titel auf unesco.org suchen).",
      "Bayerisches Kultusministerium, Datenschutz an Schulen: `km.bayern.de/recht/datenschutz-an-schulen` (andere Länder haben eigene Regeln).",
      "Universität Potsdam, Sprachbasierte KI-Tools für die Schule: `uni-potsdam.de/de/medienbildung/transfer-1/sprachbasierte-ki-tools-fuer-die-schule`",
      "Im Labor: {{karte|Was ist KI?}}, {{llm-grenzen|Grenzen und Risiken von Sprachmodellen}} und {{verzerrung-ethik|Fairness, Verzerrung und Verantwortung}}.",
     ]},
  ],
  mitnehmen: [
    "Die drei Stunden decken Verstehen, Anwenden, Erstellen und Bewerten ab. Alle kommen ohne Kamera aus.",
    "Gruppen von vier, höchstens 7 Geräte, versetzt starten: So bleibt die Wartezeit kurz.",
    "Antworten des Modells sind Vorschläge. Bewerte die Begründung der Klasse, nicht den Wortlaut.",
  ],
  grenzen: [
    "Das Labor ersetzt keine Datenschutzprüfung der Schule. Siehe {{schule-schulleitung|Info für die Schulleitung}}.",
  ],
  weiter: ["schule-start", "schule-stunde-1", "schule-stunde-2", "schule-stunde-3"],
};

/* ------------------------------------------------------------------ Schulleitung */
S["schule-schulleitung"] = {
  nav: "Info Schulleitung", typ: "lektion", gruppe: "Für die Schule", titel: "Information für die Schulleitung", symbol: "landmark",
  lernziele: [
    "Sie wissen, was das KI-Labor ist und welche Daten dabei verarbeitet werden.",
    "Sie wissen, wer verantwortlich ist und wo die Datenschutzerklärung steht.",
    "Sie wissen, welche Fragen die Schule selbst klären muss.",
  ],
  kurz: "Was das Angebot ist, welche Daten verarbeitet werden, wer verantwortlich ist und was Ihre Schule selbst entscheidet. Kein Rechtsrat.",
  zusammenfassung: "Information in einfacher Sprache für Schulleitungen zum KI-Labor: kostenloses Angebot ohne Konto, welche Daten verarbeitet werden und welche nicht, Verantwortlicher und Hosting, Kamera und Mikrofon im Unterricht nicht vorgesehen. Die Schule entscheidet über den Einsatz und klärt die Rechtsgrundlage. Kein Rechtsrat, Stand 22.11.2026.",
  abschnitte: [
    {h: "Das Angebot in Kürze",
     kurz: "Ein kostenloses Lernangebot zu künstlicher Intelligenz, ohne Konto und ohne Anmeldung.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "coins", text: "Kostenlos", sub: "für alle"},
      {icon: "user-check", text: "Kein Konto", sub: "keine Anmeldung"},
      {icon: "school", text: "Klasse 8", sub: "drei Stunden"}]},
     p: [
      "Das KI-Labor ist ein Lernprojekt von Daniel Alisch: drei Unterrichtsstunden zu je 45 Minuten für Klasse 8, ohne Kamera und Mikrofon. Diese Seite ist eine Information in einfacher Sprache, kein Rechtsrat. Stand: 22.11.2026.",
     ]},
    {h: "Welche Daten verarbeitet werden",
     kurz: "Wenige technische Daten, kein Konto, keine Namen, keine Abfrage von Alter oder Klasse.",
     visual: {typ: "vergleich",
      links: {titel: "Wird verarbeitet", icon: "database", farbe: "orange", punkte: ["Verbindungsdaten (Adresse, Zeit)", "Sitzungs-Cookie kl_s", "Eingegebene Texte, kurz im Speicher"]},
      rechts: {titel: "Wird nicht verarbeitet", icon: "ban", farbe: "gruen", punkte: ["Name, E-Mail, Konto", "Alter oder Klasse", "Werbung, Besucherstatistik"]}},
     p: [
      "Wie bei jeder Webseite sieht der Server Verbindungsdaten wie Internetadresse und Uhrzeit (Betrieb, Schutz vor Überlastung). Die Aufbewahrungsdauer der Protokolle ist nicht festgelegt, bitte fragen Sie den Betreiber.",
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
      "`daniel-alisch.site/impressum` und `daniel-alisch.site/datenschutz`, auch in der Fußzeile jeder Seite. Bei fehlenden Angaben wenden Sie sich an den Betreiber.",
     ]},
    {h: "Hosting und Betrieb",
     kurz: "Das Labor läuft auf einem kleinen Rechner des Betreibers, ohne externe KI-Dienste.",
     visual: {typ: "ablauf", paket: true, schritte: [
      {icon: "laptop", text: "Gerät der Klasse", sub: "Browser"},
      {icon: "cloud", text: "Weiterleitung", sub: "laut Planung"},
      {icon: "server", text: "Rechner im Labor", sub: "Jetson", farbe: "gruen"}]},
     p: [
      "Alle Berechnungen laufen auf einem NVIDIA Jetson Orin Nano: Sprachmodell, Bilderkennung und Sprachausgabe rechnen dort selbst. Für die öffentliche Erreichbarkeit ist nach dem Planungsstand vom 22.11.2026 eine Weiterleitung über einen Server und einen Tunnel eines Netzanbieters vorgesehen. Dienstleister und Verträge nennt die Datenschutzerklärung, oder fragen Sie den Betreiber.",
     ]},
    {h: "Kamera und Mikrofon",
     kurz: "Im Unterrichtseinsatz sind Kamera, Mikrofon und Gesichtserkennung nicht vorgesehen und nicht nötig.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "camera", text: "Kamera", sub: "nicht vorgesehen"},
      {icon: "mic", text: "Mikrofon", sub: "nicht vorgesehen"},
      {icon: "scan-face", text: "Gesichtserkennung", sub: "nicht vorgesehen"}]},
     p: [
      "Die drei Stunden brauchen weder Kamera noch Mikrofon. Weitere Versuche im Menü starten nur nach ausdrücklicher Zustimmung, sind für den Unterricht nicht vorgesehen, und die Handreichung weist Lehrkräfte darauf hin. Die Gesichtserkennung ist laut Hinweis im Labor erst ab 16 Jahren gedacht, jüngere nur mit Einverständnis der Eltern.",
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
    "Speicherdauer der Server-Protokolle und die Dienstleister der öffentlichen Weiterleitung stehen hier nicht abschließend. Fragen Sie den Betreiber.",
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
      "Die Klasse arbeitet in Vierergruppen an einem Gerät. Ihr Kind lernt auch, dass KI Fehler macht und erfindet, und übt, Antworten nicht blind zu glauben.",
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
  weiter: ["sicherheit-einfach", "schule-start", "ueber"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{name: "Für die Schule", seiten: ["schule-start", "schule-stunde-1", "schule-stunde-2", "schule-stunde-3", "schule-lehrkraefte", "schule-schulleitung", "schule-eltern"]}],
});
})();
