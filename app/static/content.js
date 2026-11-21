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
  {name: "Erzeugen", seiten: ["bild", "faceswap"]},
  {name: "Daten und Prognosen", seiten: []},
  {name: "KI im Betrieb", seiten: []},
  {name: "Business-Use-Cases", seiten: []},
  {name: "Der Jetson", seiten: ["hardware"]},
],

faehigkeiten: {
  sehen: "Sehen", sprache: "Sprache", erzeugen: "Erzeugen", wissen: "Wissen", handeln: "Handeln",
},

seiten: {

start: {
  nav: "Start", typ: "start", titel: "KI verstehen, indem du sie ausprobierst", symbol: "start",
  kurz: "Dieses Labor läuft auf einem kleinen Computer in diesem Netz, dem Jetson. Du lernst, was hinter den Begriffen steckt, und siehst bei jedem Versuch, was der Rechner gerade tut.",
  pfad: [
    {id: "karte", h: "Was ist KI überhaupt?", p: "Eine Landkarte der Begriffe: künstliche Intelligenz, maschinelles Lernen, Deep Learning, generative KI, Robotik."},
    {id: "ml", h: "Wie lernt eine Maschine?", p: "Du setzt Punkte auf eine Fläche und siehst, wie ein Modell daraus Regeln ableitet."},
    {id: "gesicht", h: "Sehen: Gesichter und Objekte", p: "Deine Webcam, der Jetson rechnet, du siehst jeden Schritt der Verarbeitung mit seiner Zeit."},
    {id: "chat", h: "Sprache: Chat, Dokumente, Agenten", p: "Ein Sprachmodell wählt Wort für Wort. Du stellst die Zufälligkeit ein und siehst die einzelnen Tokens."},
    {id: "business", h: "Wo hilft das im Alltag einer Firma?", p: "Branchen, Einsatzfelder und die drei Fragen, die vor jedem Einsatz stehen sollten."},
  ],
  datenschutz: "Kamerabilder werden nur für die Berechnung im Arbeitsspeicher gehalten und nicht gespeichert. Texte, die du ins RAG-Labor einfügst, bleiben im Speicher des Jetson und verschwinden beim Neustart.",
},

/* ------------------------------------------------------------------ Grundlagen */

karte: {
  typ: "lektion", gruppe: "Grundlagen", nr: 1, titel: "Was ist KI?", symbol: "karte", video: "was-ist-ki",
  kurz: "Ein Oberbegriff, unter dem sehr verschiedene Verfahren stecken. Diese Karte sortiert sie.",
  widget: "landkarte",
  abschnitte: [
    {h: "Die kürzeste Definition", p: [
      "[[ki|Künstliche Intelligenz]] ist Software, die Aufgaben löst, für die wir sonst menschliches Denken brauchen: etwas erkennen, Sprache verstehen, eine Entscheidung treffen, etwas Neues erzeugen. Der Begriff stammt aus den 1950er Jahren. Die Technik dahinter hat sich seitdem mehrmals grundlegend geändert.",
    ]},
    {h: "Alle heutige KI ist spezialisiert", p: [
      "Jedes System kann genau seine Aufgabe: Gesichter finden, Text fortsetzen, ein Brettspiel spielen. Eine Maschine, die alles kann, was ein Mensch kann, gibt es nicht. Wenn jemand von allgemeiner KI spricht, meint er ein Forschungsziel, kein Produkt.",
    ]},
    {h: "So hängen die Begriffe zusammen", p: [
      "Die Karte oben zeigt die Verschachtelung. Jeder innere Bereich ist eine Spezialisierung des äußeren: [[ml|Maschinelles Lernen]] ist ein Teil der KI, [[dl|Deep Learning]] ein Teil des maschinellen Lernens, generative KI ein Teil von Deep Learning. Regelbasierte Systeme sind der ältere Weg, und die Robotik steht daneben, weil sie KI als Baustein nutzt, aber auch Mechanik und Regelungstechnik braucht.",
      "Tippe auf einen Bereich, dann siehst du rechts, was er bedeutet und wo du ihn in diesem Labor ausprobieren kannst.",
    ]},
    {h: "Fünf Fähigkeiten statt vieler Fachwörter", p: [
      "Wer wissen will, was eine KI für ihn tun kann, fragt besser nach der Fähigkeit als nach dem Verfahren:",
    ], liste: [
      "**Sehen:** Bilder und Videos auswerten. Labor {{gesicht|Gesichter}}, {{objekt|Objekte}}, {{anlernen|Anlernen}}.",
      "**Sprache:** Text und Ton verstehen und formulieren. Labor {{chat|Chat}} und {{whisper|Sprache zu Text}}.",
      "**Wissen:** gezielt in eigenen Dokumenten nachschlagen und Quellen nennen. Labor {{rag|RAG}}.",
      "**Handeln:** Werkzeuge benutzen und in Schritten vorgehen. Labor {{agent|Agent}} und {{robotik|Robotik}}.",
      "**Erzeugen:** neue Texte, Bilder und Töne herstellen. Labor {{chat|Chat}} und {{bild|Bilder}}.",
    ]},
  ],
  mitnehmen: [
    "KI ist ein Sammelbegriff, kein einzelnes Verfahren.",
    "Heutige KI ist immer auf eine Aufgabe spezialisiert.",
    "Maschinelles Lernen ist der wichtigste Teil, aber nicht der einzige.",
  ],
  weiter: ["ml", "genki", "robotik"],
},

ml: {
  typ: "lektion", gruppe: "Grundlagen", nr: 2, titel: "Maschinelles Lernen", symbol: "ml", video: "maschinelles-lernen",
  kurz: "Statt Regeln zu schreiben, zeigst du Beispiele. Das Verfahren findet das Muster selbst.",
  widget: "knn",
  abschnitte: [
    {h: "Lernen statt programmieren", p: [
      "Ein Spamfilter mit festen Regeln („enthält das Wort Gewinn, dann Spam“) ist schnell überholt. Ein lernendes Verfahren bekommt stattdessen viele E-Mails, jede mit dem Etikett „Spam“ oder „kein Spam“, und findet selbst heraus, woran man beide unterscheidet. Die Regeln stecken danach im [[modell|Modell]], als eine große Menge Zahlen.",
    ]},
    {h: "Zwei Phasen: Training und Inferenz", p: [
      "Beim [[training|Training]] sieht das Verfahren viele Beispiele und stellt sein Modell so ein, dass es sie möglichst oft richtig trifft. Das ist rechenintensiv und passiert einmal, meist in einem Rechenzentrum.",
      "Bei der [[inferenz|Inferenz]] bekommt das fertige Modell neue Daten und liefert eine Vorhersage. Das ist vergleichsweise billig und passiert ständig, zum Beispiel hier auf dem Jetson, wenn er dein Kamerabild auswertet.",
    ]},
    {h: "Drei Arten zu lernen", p: [], liste: [
      "**Überwachtes Lernen:** Die Beispiele kommen mit der richtigen Antwort, etwa ein Foto mit dem [[label|Etikett]] „Katze“. Daraus lernt das Modell, neue Fotos zuzuordnen. Das Spielfeld oben arbeitet so.",
      "**Unüberwachtes Lernen:** Es gibt nur Daten, keine Antworten. Das Verfahren sucht selbst Gruppen und Auffälligkeiten, etwa Kundengruppen mit ähnlichem Verhalten.",
      "**Bestärkendes Lernen:** Ein Agent probiert Dinge aus und bekommt Belohnung oder Strafe. So lernen Systeme Spiele und die Steuerung von Robotern.",
    ]},
    {h: "Ähnlichkeit als Rechnung", p: [
      "Damit ein Computer Bilder vergleichen kann, wird jedes Bild in eine Liste von Zahlen übersetzt, ein [[embedding|Embedding]]. Ähnliche Bilder bekommen ähnliche Zahlen und liegen im Zahlenraum nah beieinander.",
      "Das Spielfeld oben zeigt das mit zwei Zahlen pro Punkt, also auf einer Fläche. Ein neuer Punkt bekommt die Klasse, die unter seinen nächsten Nachbarn am häufigsten vorkommt ([[knn|k nächste Nachbarn]]). Im Labor {{anlernen|Bildmodell anlernen}} passiert dasselbe, nur mit 1000 Zahlen pro Bild statt zwei.",
    ]},
    {h: "Wo es schiefgeht", p: [
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
  kurz: "Ein Sprachmodell wählt Wort für Wort das nächste Stück. Aus vielen kleinen Würfen entsteht ein Text.",
  widget: "tokens",
  abschnitte: [
    {h: "Ein Sprachmodell rät das nächste Stück", p: [
      "Ein großes Sprachmodell macht im Kern eines: Es berechnet, welches [[token|Token]] als nächstes am wahrscheinlichsten folgt, wählt eines aus und wiederholt das. Ganze Antworten entstehen so Stück für Stück. Dass dabei sinnvolle Texte herauskommen, liegt daran, dass das Modell im [[training|Training]] riesige Textmengen gesehen hat und die Zusammenhänge der Sprache abbildet.",
    ]},
    {h: "Wie zufällig darf es sein", p: [
      "Das Modell liefert keine einzelne Antwort, sondern für jedes Token eine Wahrscheinlichkeit. Die [[temperatur|Temperatur]] bestimmt, wie stark der Favorit bevorzugt wird. Niedrig: vorhersehbar und wiederholbar, gut für Fakten. Hoch: abwechslungsreich, aber auch fehleranfälliger.",
      "Oben kannst du das mit Beispielwerten durchspielen. Danach probierst du es im {{chat|Chat-Labor}} mit einem echten Modell.",
    ]},
    {h: "Das Gedächtnis hat ein Limit", p: [
      "Das Modell sieht nur, was im [[kontext|Kontextfenster]] steht: die bisherige Unterhaltung und alles, was mitgeschickt wird. Was draußen bleibt, existiert für das Modell nicht. Deshalb fügt man gezielt Wissen in den Kontext ein, statt zu hoffen, dass es im Modell steckt.",
    ]},
    {h: "Plausibel ist nicht wahr", p: [
      "Weil das Modell Wahrscheinliches fortsetzt, kann es Falsches überzeugend formulieren, eine [[halluzination|Halluzination]]. Ein Gegenmittel ist [[rag|RAG]]: Erst wird in eigenen Dokumenten nachgeschlagen, dann antwortet das Modell auf Grundlage der Fundstellen und nennt sie als Quelle. Das probierst du im {{rag|RAG-Labor}}.",
    ]},
    {h: "Bilder aus Rauschen", p: [
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
  kurz: "Eine Maschine mit Körper: Sie misst, entscheidet und bewegt sich, und das viele Male pro Sekunde.",
  widget: "regelkreis",
  abschnitte: [
    {h: "Ein Roboter ist KI mit Körper", p: [
      "Robotik verbindet drei Dinge: [[sensor|Sensoren]], die die Umgebung messen (Kamera, Abstandssensor, Drehgeber), eine Steuerung, die entscheidet, und [[aktor|Aktoren]], die handeln (Motoren, Greifer). KI ist meist der Teil, der aus Sensordaten eine Entscheidung macht. Der Rest ist Mechanik und Regelungstechnik.",
    ]},
    {h: "Der Regelkreis", p: [
      "Wahrnehmen, entscheiden, handeln, und wieder von vorn. Jede Runde nutzt das Ergebnis der letzten. Man nennt das einen [[regelkreis|Regelkreis]].",
      "Im Simulator oben fährt ein Roboter zum Ziel. Setze Hindernisse mit einem Klick. Schalte dann die Wahrnehmung aus, dann fährt er blind. Erhöhe die Verzögerung, dann reagiert er auf Messungen von gestern. So siehst du, warum Roboter schnelle Rechner am Gerät brauchen.",
    ]},
    {h: "Warum der Rechner am Roboter sitzt", p: [
      "Ein Roboter muss in Millisekunden reagieren und darf bei einem Netzausfall nicht stehen bleiben. Deshalb läuft die KI direkt am Gerät, man spricht von [[edge|Edge-Computing]]. Der Jetson ist dafür gebaut: viel Rechenleistung für neuronale Netze bei wenig Strom.",
      "Die {{objekt|Objekterkennung}} in diesem Labor ist genau der Wahrnehmungsschritt, den ein Roboter ständig ausführt.",
    ]},
    {h: "Arten von Robotern", p: [], liste: [
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
  kurz: "Wo KI heute Arbeit abnimmt, wann lokal sinnvoll ist und welche Fragen vor dem Einsatz stehen.",
  widget: "bereiche",
  abschnitte: [
    {h: "Lokal oder in der Cloud", p: [
      "Dieses Labor läuft ohne Cloud. Das ist eine Entscheidung mit Vor- und Nachteilen:",
    ], liste: [
      "**Datenschutz:** Lokal verlassen Bilder, Töne und Texte das Haus nicht. In der Cloud brauchst du Vertrag und Prüfung.",
      "**Reaktionszeit:** Lokal gibt es keinen Netzweg. Für Kamera und Roboter entscheidet das.",
      "**Kosten:** Lokal zahlst du einmal für das Gerät, in der Cloud laufend nach Nutzung.",
      "**Leistung:** Cloud-Dienste können deutlich größere Modelle betreiben als ein kleines Gerät.",
    ]},
    {h: "Drei Fragen vor jedem Einsatz", p: [], liste: [
      "**Welche Entscheidung** soll die KI treffen oder vorbereiten?",
      "**Welche Daten** braucht sie, und dürfen wir sie nutzen?",
      "**Wer prüft** das Ergebnis, und was passiert bei einem Fehler?",
    ]},
    {h: "Vom Versuch zum Betrieb", p: [
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
  kurz: "Der Jetson findet Gesichter in deinem Kamerabild, auch wenn du den Kopf neigst.",
  abschnitte: [
    {h: "Drei Stufen, die man oft verwechselt", p: [
      "Erstens: erkennen, dass ein Gesicht im Bild ist (Detektion). Zweitens: das Gesicht einer bestimmten Person wiedererkennen (Identifikation). Drittens: den Ausdruck deuten. Dieses Labor macht nur die erste Stufe. Es findet Gesichter und markiert sie. Es speichert nichts und weiß nicht, wer du bist.",
    ]},
    {h: "Was im Hintergrund passiert", p: [], liste: [
      "Dein Browser macht ein Bild aus der Kamera, verkleinert es auf 480 mal 360 Pixel und verpackt es als JPEG.",
      "Das Bild reist über eine WebSocket-Verbindung zum Jetson.",
      "Der Jetson entpackt es und gibt es an das Modell [[yunet|YuNet]], ein kleines neuronales Netz für Gesichter.",
      "Das Netz liefert Rahmen, eine [[konfidenz|Konfidenz]] und fünf [[landmark|Landmarken]]: beide Augen, die Nase und die Mundwinkel.",
      "Der Jetson zeichnet das ein und schickt das Bild zurück. Die farbigen Streifen über dem Bild zeigen, wie lange jeder Schritt dauert.",
    ]},
    {h: "Warum Neigen früher Probleme machte", p: [
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
  kurz: "Der Jetson benennt, was er im Bild sieht, und markiert jedes Objekt mit einem Rahmen.",
  abschnitte: [
    {h: "Ein Blick reicht", p: [
      "Hier läuft YOLOX, ein Verfahren aus der [[yolo|YOLO]]-Familie. Das Netz betrachtet das ganze Bild einmal und sagt gleichzeitig, wo Objekte sind und was sie sind. Deshalb ist es schnell genug für Video.",
    ]},
    {h: "Rahmen, Klasse, Sicherheit", p: [
      "Für jedes Objekt liefert das Netz einen Rahmen, eine Klasse aus 80 Alltagsklassen (Person, Tasse, Laptop, Stuhl und so weiter) und eine [[konfidenz|Konfidenz]]: wie sicher es sich ist.",
      "Der Regler **Schwelle** legt fest, ab welcher Konfidenz ein Rahmen angezeigt wird. Niedrig: mehr Treffer, aber auch mehr Fehlalarme. Hoch: weniger Fehlalarme, dafür werden Objekte übersehen. Diese Abwägung gibt es bei jeder Erkennung, auch in der Fertigung. Probiere es live aus.",
    ]},
    {h: "Doppelte Rahmen aufräumen", p: [
      "Das Netz meldet dasselbe Objekt oft mehrfach mit leicht versetzten Rahmen. Ein Aufräumschritt, die [[nms|Non-Maximum Suppression]], behält den sichersten und wirft überlappende weg.",
    ]},
    {h: "Wie schnell ist das", p: [
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
  kurz: "Zeige dem Jetson Beispiele, und er erkennt sie danach selbst. In einer halben Minute, ohne Training.",
  abschnitte: [
    {h: "Was beim Aufnehmen passiert", p: [
      "Halte den Knopf einer Klasse gedrückt, dann nimmt der Jetson mehrmals pro Sekunde Beispiele auf. Jedes Bild geht durch ein vortrainiertes neuronales Netz (MobileNet). Heraus kommt eine Liste von 1000 Zahlen, ein [[embedding|Embedding]]. Sie wird mit dem Namen deiner Klasse gespeichert. Mehr passiert nicht.",
    ]},
    {h: "Was beim Erkennen passiert", p: [
      "Ein neues Bild wird ebenfalls zu 1000 Zahlen. Der Jetson misst den Abstand zu allen gespeicherten Beispielen und lässt die drei ähnlichsten abstimmen ([[knn|k nächste Nachbarn]]). Die Balken zeigen, wie ähnlich das aktuelle Bild jeder Klasse ist. Nichts im Netz wird dabei verändert. Deshalb ist es sofort einsatzbereit.",
    ]},
    {h: "So werden die Ergebnisse besser", p: [], liste: [
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
  kurz: "Ein Modell mit etwa drei Milliarden Parametern antwortet lokal auf der GPU. Du siehst jedes Token.",
  abschnitte: [
    {h: "Was du hier steuern kannst", p: [
      "**Tokens zeigen** färbt die Antwort Stück für Stück ein. Jedes farbige Stück ist ein Token, das das Modell einzeln gewählt hat. Wörter bestehen oft aus mehreren Tokens, häufige Wörter aus einem.",
      "Die **Temperatur** wirkt auf die nächste Antwort. Stelle sie auf 0 und stelle dieselbe Frage zweimal: Die Antworten sind fast gleich. Stelle sie auf 1,5, dann weichen sie ab und werden unzuverlässiger.",
    ]},
    {h: "Was auf dem Jetson passiert", p: [
      "Beim ersten Start wird das [[modell|Modell]] von der SSD in den Arbeitsspeicher geladen. Das Modell hat etwa drei Milliarden [[parameter|Parameter]] und belegt rund 2 GB auf der Platte. Danach rechnet die [[gpu|GPU]] jedes Token. In der Seitenleiste steigen dabei GPU-Last und Leistung.",
    ]},
    {h: "Warum es kleiner ist als bekannte Chatbots", p: [
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
  kurz: "Das Modell kennt deine Dokumente nicht. Also sucht der Jetson erst die passenden Stellen und antwortet dann nur damit.",
  abschnitte: [
    {h: "Das Problem", p: [
      "Ein Sprachmodell weiß nur, was es im Training gesehen hat. Deine Verträge, Handbücher und Notizen gehören nicht dazu. Würdest du trotzdem fragen, würde es raten.",
    ]},
    {h: "Die Lösung in vier Schritten", p: [], liste: [
      "**Zerlegen:** Der Text wird in Abschnitte von etwa 800 Zeichen geteilt.",
      "**Einbetten:** Jeder Abschnitt wird zu einer Zahlenliste ([[embedding|Embedding]]), hier mit dem Modell nomic-embed-text.",
      "**Suchen:** Deine Frage wird genauso eingebettet. Die Abschnitte mit der größten Ähnlichkeit ([[cosinus|Kosinus]]) sind die Treffer.",
      "**Antworten:** Die Treffer und deine Frage gehen an das Sprachmodell, mit der Anweisung, nur damit zu antworten und die Quelle zu nennen.",
    ]},
    {h: "Schau auf die Scores", p: [
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
  kurz: "Ein Sprachmodell, das selbst entscheidet, wann es ein Werkzeug braucht, und in Schritten zur Antwort kommt.",
  abschnitte: [
    {h: "Ein Agent ist ein Modell mit Werkzeugen", p: [
      "Ein [[agent|Agent]] bekommt zusätzlich zur Frage eine Liste von [[werkzeug|Werkzeugen]] beschrieben, hier: **rechne**, **uhrzeit** und **dokumentsuche**. Statt sofort zu antworten, kann er einen Werkzeugaufruf ausgeben. Der Jetson führt ihn aus und gibt das Ergebnis zurück. Das Modell entscheidet dann, ob es weiter arbeitet oder antwortet.",
    ]},
    {h: "Die Schleife", p: [], liste: [
      "Frage und Werkzeugliste gehen an das Modell.",
      "Das Modell antwortet entweder mit einem Werkzeugaufruf oder mit dem Ergebnis.",
      "Bei einem Aufruf führt der Jetson das Werkzeug aus und hängt das Ergebnis an die Unterhaltung.",
      "Das Modell sieht das Ergebnis und entscheidet neu. Nach höchstens fünf Runden endet die Schleife.",
    ]},
    {h: "Worauf du achten solltest", p: [
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
  kurz: "Sprich in dein Mikrofon, und der Jetson schreibt mit. Das Modell läuft lokal, ohne Cloud.",
  abschnitte: [
    {h: "Wie aus Ton Text wird", p: [
      "Dein Browser nimmt Ton auf und schickt ihn an den Jetson. Dort zerlegt Whisper den Ton in kurze Fenster, wandelt sie in ein Bild der Frequenzen um (ein Spektrogramm) und lässt ein neuronales Netz daraus Text vorhersagen, Token für Token, ähnlich wie ein Sprachmodell.",
    ]},
    {h: "Was du beobachten kannst", p: [
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
  typ: "labor", gruppe: "Erzeugen", titel: "Bilder erzeugen", symbol: "bild", demo: null, status: "bald",
  kurz: "Aus einer Beschreibung entsteht ein Bild. Auf dem Jetson ist das möglich, aber langsam.",
  abschnitte: [
    {h: "Wie Diffusion funktioniert", p: [
      "Beim Training nimmt man echte Bilder und fügt ihnen Schritt für Schritt Rauschen hinzu, bis nur noch Rauschen übrig ist. Das Modell lernt die Umkehrung: aus einem verrauschten Bild ein etwas weniger verrauschtes zu machen. Eine Textbeschreibung steuert, in welche Richtung das Rauschen verschwindet.",
      "Beim Erzeugen startet man mit reinem Rauschen und wiederholt den Schritt, oft 4 bis 50 Mal. Dabei zeichnet sich Schritt für Schritt ein Bild ab.",
    ]},
    {h: "Warum hier noch keine Demo läuft", p: [
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
  weiter: ["genki", "faceswap"],
},

faceswap: {
  nav: "Face-Swap", typ: "labor", gruppe: "Erzeugen", titel: "Face-Swap und Deepfakes", symbol: "faceswap", demo: null, status: "bald",
  kurz: "Ein Gesicht in einem Bild durch ein anderes ersetzen. Eindrucksvoll und riskant zugleich.",
  abschnitte: [
    {h: "So funktioniert es", p: [
      "Ein Gesichtsdetektor findet das Gesicht und seine Landmarken. Ein zweites Netz (zum Beispiel inswapper) erhält die Identitätsmerkmale der Quellperson und setzt sie in die Pose und Beleuchtung der Zielperson. Ein Nachbearbeitungsschritt gleicht Farbe und Rand an.",
    ]},
    {h: "Chancen und Risiken", p: [
      "Dieselbe Technik ermöglicht Avatare und Anonymisierung in Videos, aber auch gefälschte Aufnahmen echter Personen. Darum gilt: nur mit Einwilligung der gezeigten Person, und erzeugte Inhalte kennzeichnen.",
    ]},
    {h: "Stand in diesem Labor", p: [
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
  weiter: ["bild", "gesicht"],
},

/* ------------------------------------------------------------------ Jetson */

hardware: {
  nav: "Hardware", typ: "lektion", gruppe: "Der Jetson", titel: "Der Jetson und seine Hardware", symbol: "hardware", widget: "hardware",
  kurz: "Ein kleiner Computer mit GPU, gebaut für KI am Gerät. Hier siehst du live, was er gerade tut.",
  abschnitte: [
    {h: "Was ist ein Jetson", p: [
      "Der NVIDIA Jetson Orin Nano ist ein Computer im Kartenformat. Er hat einen Prozessor mit sechs Kernen und eine [[gpu|GPU]], die viele einfache Rechnungen gleichzeitig ausführt. Genau das brauchen neuronale Netze. Er nimmt dabei nur wenige Watt auf.",
    ]},
    {h: "Gemeinsamer Speicher", p: [
      "CPU und GPU teilen sich denselben Arbeitsspeicher von 8 GB. Ein Modell, das 5 GB braucht, lässt kaum Platz für das Betriebssystem. Das ist der Grund, warum hier kleine Modelle laufen und immer nur eins zur Zeit geladen ist. Der Speicher in der Anzeige oben ist die wichtigste Grenze.",
    ]},
    {h: "Was die Anzeigen bedeuten", p: [], liste: [
      "**GPU:** wie ausgelastet der Grafikprozessor ist. Er steigt, wenn ein Modell rechnet.",
      "**Arbeitsspeicher:** belegt von Betriebssystem, Programmen und geladenen Modellen.",
      "**CPU:** Auslastung der sechs Prozessorkerne, im Mittel.",
      "**Leistung:** Strom, den das Board gerade aufnimmt, ohne Netzteilverluste.",
      "**Temperatur:** der heißeste Messpunkt des Chips. Bei zu hoher Temperatur taktet er herunter.",
    ]},
    {h: "Warum Edge-Geräte wichtig sind", p: [
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
