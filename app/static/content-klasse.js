/* Seiten "Klassenmodus": klassenmodus (Lehrkräfte), klasse-mitmachen (Schüler), klasse-wand (Beamer).
   Technik: app/lab_klasse.py (WebSocket /ws/klasse, nur Arbeitsspeicher), Oberfläche: demo-klasse.js, Gestaltung: klasse.css.
   Alle Zahlen und Regeln stehen so in app/lab_klasse.py (Konstanten oben). Zugriffsprotokolle des Webservers: Stand 27.11.2026,
   siehe docs/betrieb-sicherheit.md. Keine Rechtsberatung. In dieser Funktion arbeitet keine KI, es sind Zähler und Auswahlwerte. */
window.INHALT.registriere({

gruppen: [{ name: "Für die Schule", seiten: ["klassenmodus", "klasse-mitmachen", "klasse-wand"] }],

glossar: {
  pseudonym: ["Pseudonym", "Ein Zufallsname wie \"Roter Fuchs\". Er steht für eine Person, ohne zu verraten, wer es ist. Im Klassenmodus gilt er nur für eine Sitzung."],
  hmac: ["Signatur (HMAC)", "Ein Siegel aus einer Rechenvorschrift und einem geheimen Schlüssel. Wer das Protokoll ändert, ohne den Schlüssel zu kennen, kann kein passendes Siegel erzeugen."],
},

seiten: {

"klassenmodus": {
  nav: "Klassenmodus", typ: "labor", gruppe: "Für die Schule", titel: "Klassenmodus: gemeinsam abstimmen, ohne Namen",
  symbol: "users", widget: "klasse-lehrkraft", widgetZuerst: true, widgetTitel: "Sitzung für Ihre Klasse", widgetSymbol: "presentation",
  demo: "klasse-nachweis-pruefen",
  kurz: "Sie starten eine Sitzung mit Code. Die Klasse macht auf dem eigenen Gerät mit, die Wand zeigt nur Summen. Ohne Konto, ohne Namen, mit Löschprotokoll.",
  zusammenfassung: "Klassenmodus des KI-Labors für Lehrkräfte: eine Sitzung mit Kurzcode ohne Konto, Zufallsnamen statt Namen, Abstimmungen, Skalen, Schätzfragen, Quizfragen aus den Lektionen, Echt oder KI und Prompt-Vergleich, Ergebnis nur als Summe an der Wand, kleine-Zahlen-Schutz, Speicherung nur im Arbeitsspeicher, Löschung nach höchstens zwei Stunden oder per Knopf, signiertes Löschprotokoll, Hinweise für Schulleitung und Eltern, Ablauf einer 45-Minuten-Stunde.",
  lernziele: [
    "Sie können eine Sitzung starten, die Klasse beitreten lassen und eine Aufgabe auf der Wand auswerten.",
    "Sie können Schulleitung und Eltern in einfachen Worten sagen, welche Daten der Klassenmodus verarbeitet und welche nicht.",
    "Sie können die Sitzung löschen und das Löschprotokoll aufbewahren oder prüfen lassen.",
  ],
  abschnitte: [
    {h: "So läuft eine Sitzung",
     kurz: "Fünf Schritte, alle ohne Anmeldung.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "play", text: "Starten", sub: "Code und Schlüssel"},
      {icon: "smartphone", text: "Beitreten", sub: "Klasse tippt den Code"},
      {icon: "target", text: "Aufgabe", sub: "Abstimmung, Quiz, Tipp"},
      {icon: "chart-bar", text: "Wand", sub: "Nur Summen", farbe: "gruen"},
      {icon: "trash-2", text: "Löschen", sub: "Protokoll"}]},
     liste: [
      "Drücken Sie oben auf \"Sitzung starten\". Es erscheint ein Code mit acht Zeichen in zwei Vierergruppen (zum Beispiel ABCD-EFGH), den Sie an die Tafel schreiben.",
      "Die Klasse öffnet {{klasse-mitmachen|die Seite zum Mitmachen}} und gibt den Code ein. Jede Person bekommt einen Zufallsnamen. Der Code steht nie in einer Internetadresse.",
      "Öffnen Sie \"Wand öffnen\" auf dem Beamer. Dort sehen alle, wie viele dabei sind, und später die Summen. Die Wand kann nichts steuern.",
      "Wählen Sie eine Aufgabe und starten Sie sie. Die Klasse tippt auf dem eigenen Gerät. Sie sehen nur, wie viele schon geantwortet haben.",
      "Drücken Sie \"Ergebnis zeigen\". Erst jetzt erscheint die Verteilung. So schaut niemand bei den anderen ab.",
      "Am Ende: \"Sitzung beenden und löschen\". Sie bekommen ein Löschprotokoll zum Speichern oder Drucken.",
     ],
     merke: "Die Klasse schickt nur Auswahlwerte, nie Text. Darum braucht der Klassenmodus keine Moderation."},
    {h: "Welche Aufgaben es gibt",
     kurz: "Sieben Arten. Fragetexte kommen aus den Lektionen dieses Labors, nicht vom Server.",
     tabelle: {
      beschriftung: "Aufgabenarten im Klassenmodus",
      kopf: ["Art", "Was die Klasse tippt", "Woher der Inhalt kommt"],
      zeilen: [
       ["Ja oder Nein", "Ja oder Nein", "Sie stellen die Frage mündlich"],
       ["Auswahl A bis F", "Ein Buchstabe, zwei bis sechs Möglichkeiten", "Die Frage steht an der Tafel"],
       ["Skala 1 bis 5", "Eine Zahl von 1 bis 5", "Sie nennen die Aussage mündlich"],
       ["Schätzfrage", "Eine ganze Zahl in Ihrem Bereich", "Sie nennen die Frage mündlich, die richtige Zahl tragen Sie ein"],
       ["Quiz einer Lektion", "Die Antwort auf eine Frage des Selbsttests", "Dieselben Quizfragen wie auf der jeweiligen Seite, zum Beispiel {{medien-stunde-1|Medien 1}}"],
       ["Echt oder KI?", "Echt oder KI zu einem Bild", "Die zwölf Karten der Seite {{echt-oder-ki|Echt oder KI?}}"],
       ["Prompt-Vergleich", "Welcher von zwei Prompts ist besser", "Die Schul-Beispiele der {{prompts-schule|Prompt-Werkstatt}}, links und rechts zufällig getauscht"],
      ],
     }},
    {h: "Was die Wand zeigt und was nicht",
     kurz: "Nur Summen, erst nach Ihrem Knopfdruck, und kleine Zahlen bleiben verborgen.",
     p: [
      "Vor dem Ergebnis sehen alle nur: \"7 von 23 haben geantwortet\". Nach \"Ergebnis zeigen\" erscheint die Verteilung als Balken. Ein Feld mit einer oder zwei Antworten bleibt verdeckt, zusätzlich das kleinste sichtbare Feld, und die Gesamtzahl wird nicht mehr genannt. Sonst ließe sich aus dem Fortschritt (\"7 von 23\") und den sichtbaren Feldern ausrechnen, wer allein anders gewählt hat. Mittelwert und Median gibt es erst ab fünf Antworten und nie, wenn ein Feld verdeckt ist. Bei weniger als drei Antworten insgesamt zeigt die Wand gar nichts.",
      "Der Dienst merkt sich nicht, wer was gewählt hat. Je Aufgabe gibt es einen Zähler pro Antwort und eine Liste, wer schon geantwortet hat, ohne die Antwort. Eine Antwort ist endgültig. Darum gibt es auch nichts, was Sie einsehen oder exportieren könnten.",
     ],
     alltag: "Wie eine Abstimmung mit verdeckten Zetteln in einer Urne: Man sieht, wie viele Zettel drin sind, und zählt am Ende. Welcher Zettel von wem stammt, weiß niemand. Der Vergleich hinkt an einer Stelle: Wenn nur drei Personen abstimmen und alle gleich, wissen alle drei, was die anderen gewählt haben. Das lässt sich bei so kleinen Gruppen nicht vermeiden.",
     merke: "Je kleiner die Gruppe, desto weniger Schutz bietet jede Zusammenfassung. Der Klassenmodus ist für Klassen gedacht, nicht für Dreiergruppen."},
    {h: "Was verarbeitet wird, für Schulleitung und Datenschutzbeauftragte",
     kurz: "Auswahlwerte und ein Zufallsname, nur im Arbeitsspeicher. Außerhalb der Anwendung fällt trotzdem etwas an.",
     tabelle: {
      beschriftung: "Datenfluss im Klassenmodus (Stand 27.11.2026)",
      kopf: ["Was", "Wo", "Wie lange"],
      zeilen: [
       ["Auswahlwerte als Zähler, Zufallsnamen, Zahl der Teilnehmenden", "Arbeitsspeicher des Rechners, nicht auf Platte, keine Datenbank", "Höchstens 2 Stunden, nach 20 Minuten ohne Aktion, oder sofort per Knopf"],
       ["Code, Lehrer-Schlüssel, Wiederverbindungs-Schlüssel", "Code im Arbeitsspeicher, Schlüssel nur als Prüfwert; im Browser nur im Tab (sessionStorage)", "Wie die Sitzung, im Browser bis zum Schließen des Tabs"],
       ["Löschprotokoll (Hash der Sitzung, Zahlen, Prüfergebnisse, Signatur)", "Arbeitsspeicher, Kopie bei der Lehrkraft", "Eine Stunde im Dienst, danach nur bei der Lehrkraft"],
       ["IP-Adresse, Uhrzeit und aufgerufene Adresse (nicht der Code)", "Zugriffsprotokoll des Webservers vor dem Labor", "Täglich rotiert, derzeit bis zu 14 Tage aufgehoben"],
       ["Verbindung zum Labor", "Cloudflare als Transportdienst (siehe Datenschutzerklärung des Betreibers)", "Nach dessen Bedingungen"],
      ],
     },
     p: [
      "Der Klassenmodus kennt keine Namen, keine Klassen und keine Geräte-Kennungen. Er setzt kein eigenes Cookie und nutzt das technisch notwendige Sitzungs-Cookie des Labors nicht (es entsteht beim Aufruf jeder Seite des Labors und steht in der Datenschutzerklärung). Die Auswahlwerte lassen sich nach unserer Einschätzung keiner Person zuordnen, weil der Dienst nicht speichert, wer was gewählt hat. Eine Einwilligung der Schülerinnen und Schüler halten wir deshalb nicht für nötig. Das gilt nicht für die IP-Adresse im Zugriffsprotokoll des Webservers. Sie fällt bei jedem Aufruf einer Internetseite an, also auch hier. Rechtsgrundlage für den Betrieb ist das berechtigte Interesse an einem sicheren Dienst (Art. 6 Abs. 1 Buchstabe f DSGVO). Näheres steht in der Datenschutzerklärung des Betreibers.",
      "Stimmen Sie den Einsatz mit der Schulleitung und der oder dem Datenschutzbeauftragten Ihrer Schule ab. Dies ist keine Rechtsberatung. Ob und wie Online-Dienste im Unterricht genutzt werden dürfen, regelt Ihr Bundesland.",
     ],
     merke: "Das Löschprotokoll gilt für die Anwendung. Es löscht keine Zugriffsprotokolle des Webservers und keine Daten bei Cloudflare."},
    {h: "Muster-Satz für den Elternbrief",
     kurz: "Zum Kopieren und Anpassen.",
     code: [
      {titel: "Elternbrief (Muster)", text: "Am [Datum] nutzen wir im Unterricht das KI-Labor (ki-labor.daniel-alisch.site) im Klassenmodus. Die Kinder brauchen dafür kein Konto und geben keinen Namen ein. Sie bekommen einen Zufallsnamen und wählen nur zwischen vorgegebenen Antworten. Der Dienst speichert nichts auf einer Festplatte, löscht die Sitzung spätestens nach zwei Stunden und stellt der Lehrkraft ein Löschprotokoll aus. Wie bei jedem Aufruf einer Internetseite wird die IP-Adresse kurz im Zugriffsprotokoll des Betreibers erfasst. Fragen beantwortet die Schulleitung."},
     ],
     p: ["Weitere Texte für Eltern und Schulleitung stehen auf den Seiten {{elternabend|Elternabend}} und {{schule-schulleitung|Für die Schulleitung}}."]},
    {h: "Eine 45-Minuten-Stunde",
     kurz: "Ein Vorschlag, der ohne Vorbereitung auskommt.",
     tabelle: {
      beschriftung: "Ablauf (anpassbar)",
      kopf: ["Minuten", "Was passiert", "Aufgabe im Klassenmodus"],
      zeilen: [
       ["0 bis 5", "Sitzung starten, Code an die Tafel, alle treten bei", "Warteansicht der Wand mit den Zufallsnamen"],
       ["5 bis 12", "Einstiegsfrage: Wie sicher erkennst du KI-Bilder?", "Skala 1 bis 5, dann Ergebnis zeigen"],
       ["12 bis 28", "Vier Karten aus {{echt-oder-ki|Echt oder KI?}}", "Echt oder KI, jede Karte mit Lösung zeigen und die Hinweise besprechen"],
       ["28 bis 38", "Welcher Prompt ist besser?", "Prompt-Vergleich aus der {{prompts-schule|Prompt-Werkstatt}}"],
       ["38 bis 43", "Kurzer Check", "Eine Quizfrage einer Lektion"],
       ["43 bis 45", "Abschluss: Sitzung beenden und löschen", "Protokoll speichern, Zähler der aktiven Sitzungen fällt"],
      ],
     }},
    {h: "Missbrauch und Grenzen",
     kurz: "Was den Dienst schützt, und was er nicht kann.",
     p: [
      "Der Code hat acht Zeichen aus 25 gut unterscheidbaren, das sind rund 150 Milliarden Möglichkeiten. Die Eingabe verzeiht Kleinbuchstaben, Leerzeichen und den Bindestrich. Je Netzbereich nimmt der Dienst höchstens 20 Beitritte oder falsche Eingaben je Minute an, auch mit richtigem Code: Eine Klasse mit 40 Kindern ist in zwei bis drei Minuten drin, ein Angreifer kommt je Netzbereich auf höchstens 1200 Versuche pro Stunde. Bei 20 laufenden Sitzungen trifft er damit je Netzbereich und Stunde mit einer Wahrscheinlichkeit von etwa 1,6 zu 10 Millionen. Wer viele Netzbereiche gleichzeitig nutzt, vervielfacht das, es bleibt aber winzig. Nach 15 falschen Eingaben in zehn Minuten sperrt der Dienst weitere Versuche von diesem Anschluss. Als Anschluss gilt eine Einzeladresse, bei IPv6 das ganze Netz des Anschlusses (/64), und nur eine Adresse, die der eigene Proxy des Labors meldet. Mitgeschickte Adress-Kopfzeilen zählen nicht. Dazu gibt es eine Obergrenze für alle zusammen: ab 30 falschen Eingaben je Minute oder 300 je Stunde werden falsche Eingaben verzögert und abgewiesen. Ein richtiger Code kommt immer durch, auch dann. Fehlt dem Betreiber die Einrichtung des Proxys, lehnt der Klassenmodus Sitzungen ab, statt alle Besucher einer Adresse zuzuordnen. Jede falsche Eingabe wird zusätzlich gebremst. Eine Sitzung fasst höchstens 40 Personen, der Dienst höchstens 20 Sitzungen gleichzeitig, ein Anschluss höchstens drei. Jede Nachricht wird auf dem Server geprüft: nur erlaubte Zahlen, nur kurze Nachrichten, nur Anfragen von der eigenen Seite. Die Lehrkraft sieht keine IP-Adressen.",
      "Grenzen: Wer den Code kennt, kann beitreten. Geben Sie ihn darum erst im Unterricht bekannt und löschen Sie am Ende. Einzelne Teilnehmende lassen sich nicht ausschließen, nur die ganze Sitzung löschen. Mehrfach-Beitritt lässt sich nicht vollständig verhindern: Je Netzwerkadresse nimmt der Dienst höchstens 3 Geräte auf (für ein Schulnetz stellen Sie 10 oder 40 ein), aber wer mehrere Geräte oder Adressen hat, kann mehrfach stimmen. Anonym heißt hier auch: nicht gegen Manipulation gesichert. Wer in der Klasse bewusst Unsinn antwortet, verfälscht die Summe. Bei sehr kleinen Gruppen schützt auch die Verdeckung nur begrenzt. Der Klassenmodus ist ein Lernwerkzeug und kein Prüfungsverfahren.",
     ]},
    {h: "Das Löschprotokoll, und was es belegt",
     kurz: "Fünf Einzelprüfungen, eine Signatur und eine öffentliche Prüfseite.",
     p: [
      "Beim Löschen werden die geheimen Felder der Sitzung überschrieben und der Speicher freigegeben. Danach prüft der Dienst fünf Dinge: Die Sitzung ist nicht mehr abrufbar. Kein Register enthält noch einen Eintrag. Das Sitzungsobjekt wird von nichts mehr gehalten. In den Dateien des Dienstes steht weder der Code noch die Sitzungskennung. Der Logger des Dienstes hat nichts mit Code oder Kennung geschrieben. Das Ergebnis jeder Prüfung steht im Protokoll, dazu nur Zahlen (Teilnehmende, Antworten, Aufgaben), der Hash der Sitzung statt des Codes, Start und Ende in UTC, die Dienstversion und eine Signatur ({{hmac|HMAC}} mit SHA-256).",
      "Die Sitzung steht im Protokoll als SHA-256 des Codes, die Lehrkraft kann es also nachrechnen, und die Prüfseite kann Code und Protokoll abgleichen. Die Signatur belegt, dass dieser Dienst das Protokoll ausgestellt hat und nichts daran geändert wurde, und sie wird 30 Tage lang bestätigt (die Frist steht im Protokoll). Sie belegt nicht allein, dass gelöscht wurde: Die Einzelprüfungen fährt der Dienst selbst. Ist der Signaturschlüssel nicht fest eingestellt (Umgebungsvariable KL_NACHWEIS_SCHLUESSEL, siehe {{selbst-bauen|Selbst aufbauen}}), entsteht er bei jedem Start neu. Dann lässt sich das Protokoll nur bis zum nächsten Neustart prüfen. Das steht im Protokoll selbst.",
      "Python kann Arbeitsspeicher nicht garantiert mit Nullen füllen. Die geheimen Felder werden überschrieben, Texte aus Nachrichten räumt die Speicherbereinigung ab. Ein Abbild des Arbeitsspeichers, das mitten in einer Sitzung gezogen wurde, könnte sie noch enthalten. Ein öffentlicher Zähler zeigt, wie viele Sitzungen gerade laufen. Er fällt nach dem Löschen sichtbar zurück. Das ist Absicht (Beweisbild): Der Zähler nennt nur die Zahl, keine Zeiten und keine Codes.",
     ],
     merke: "Ein Protokoll ohne Prüfung ist eine Behauptung. Darum können Sie es auf /klasse/nachweis prüfen lassen, auch ohne JavaScript. Dabei wird nichts gespeichert."},
  ],
  mitnehmen: [
    "Der Klassenmodus braucht kein Konto und keinen Namen. Die Klasse schickt nur Auswahlwerte.",
    "Die Wand zeigt erst nach Ihrem Knopfdruck eine Summe, und kleine Felder bleiben verdeckt.",
    "Alles liegt nur im Arbeitsspeicher und endet nach höchstens zwei Stunden oder sofort per Knopf.",
    "Das Löschprotokoll belegt die Löschung in der Anwendung. IP-Adressen in Zugriffsprotokollen bleiben außen vor und gehören in die Abstimmung mit der Schulleitung.",
  ],
  quiz: [
    {frage: "Was merkt sich der Klassenmodus über die Antwort einer einzelnen Schülerin?", optionen: ["Name und Antwort, damit die Lehrkraft sie sieht", "Nichts, was die Antwort mit einer Person verbindet: nur Zähler je Antwort und wer schon geantwortet hat", "Die Antwort, verbunden mit der IP-Adresse", "Die Antwort, bis das Schuljahr endet"], richtig: 1, erklaerung: "Der Dienst führt nur einen Zähler je Antwort und eine Liste, wer schon geantwortet hat. Welche Antwort von wem kommt, wird nicht gespeichert."},
    {frage: "Warum zeigt die Wand bei zwei Antworten kein Ergebnis?", optionen: ["Weil zwei Antworten zu wenig Rechenzeit brauchen", "Weil sonst leicht zu erraten wäre, wer was gewählt hat", "Weil der Beamer nur ab drei Balken funktioniert", "Weil die Lehrkraft das Ergebnis vorher prüfen muss"], richtig: 1, erklaerung: "Bei sehr kleinen Zahlen lässt sich eine Person leicht erraten. Darum gibt es erst ab drei Antworten ein Ergebnis, und kleine Felder bleiben verdeckt."},
    {frage: "Wie lange läuft eine Sitzung höchstens?", optionen: ["Eine Woche", "Bis die Lehrkraft den Browser schließt", "Zwei Stunden, nach 20 Minuten ohne Aktion schon früher", "Zehn Minuten"], richtig: 2, erklaerung: "Nach höchstens zwei Stunden oder 20 Minuten ohne Aktion löscht der Dienst die Sitzung von selbst. Die Lehrkraft kann auch jederzeit sofort löschen."},
    {frage: "Was belegt die Signatur im Löschprotokoll?", optionen: ["Dass der Dienst das Protokoll ausgestellt hat und es nicht verändert wurde", "Dass auch Cloudflare nichts mehr gespeichert hat", "Dass kein Zugriffsprotokoll des Webservers mehr existiert", "Dass die Schule rechtlich alles richtig gemacht hat"], richtig: 0, erklaerung: "Die Signatur schützt das Protokoll vor Änderungen. Zugriffsprotokolle des Webservers und Daten bei Cloudflare liegen außerhalb der Anwendung und sind davon nicht erfasst."},
    {frage: "Was gehört trotz Klassenmodus in die Abstimmung mit der Schulleitung?", optionen: ["Nichts, der Klassenmodus ist rechtlich unbedenklich", "Dass IP-Adressen im Zugriffsprotokoll des Webservers anfallen und wie lange", "Der Name jedes Kindes", "Die Farbe der Wand"], richtig: 1, erklaerung: "Der Dienst selbst speichert keine Namen. Die IP-Adresse fällt aber bei jedem Aufruf im Zugriffsprotokoll an. Das gehört ehrlich in die Abstimmung."},
  ],
  weiter: ["klasse-mitmachen", "klasse-wand", "schule-lehrkraefte", "schule-schulleitung", "elternabend", "echt-oder-ki", "prompts-schule", "datenschutz-im-alltag"],
},

"klasse-mitmachen": {
  nav: "Mitmachen in der Klasse", typ: "labor", gruppe: "Für die Schule", titel: "Mitmachen: Code eingeben und abstimmen",
  symbol: "smartphone", widget: "klasse-schueler", widgetZuerst: true, widgetTitel: "Gib den Code ein", widgetSymbol: "users",
  kurz: "Gib den Code deiner Lehrkraft ein. Du bekommst einen Zufallsnamen, tippst deine Antwort und siehst, was die Klasse denkt. Ohne Namen.",
  zusammenfassung: "Seite für Schülerinnen und Schüler zum Mitmachen im Klassenmodus: Code eingeben, Zufallsname, Antworten per Auswahl, Ergebnis der Klasse, was mit den Antworten passiert, Hilfe bei Problemen.",
  abschnitte: [
    {h: "So machst du mit",
     kurz: "Drei Schritte.",
     liste: [
      "Gib oben den Code ein, den deine Lehrkraft zeigt. Er hat acht Zeichen, zum Beispiel ABCD-EFGH. Groß und klein ist egal.",
      "Du bekommst einen Zufallsnamen, zum Beispiel \"Roter Fuchs\". Das ist nicht dein Name. Er gilt nur für diese Stunde.",
      "Wenn eine Aufgabe erscheint, tippe deine Antwort und drücke \"Antwort abschicken\". Danach ist sie endgültig.",
     ],
     p: ["Die Lehrkraft zeigt irgendwann das Ergebnis der ganzen Klasse. Bei manchen Aufgaben siehst du dann auch, welche Antwort richtig war und was du getippt hast."]},
    {h: "Was mit deinen Antworten passiert",
     kurz: "Nichts, was zu dir führt.",
     p: [
      "Du gibst keinen Namen und keinen Text ein, nur eine Auswahl. Der Dienst zählt, wie oft jede Antwort gewählt wurde. Er speichert nicht, wer was gewählt hat. Auch die Lehrkraft sieht nur die Summen.",
      "Alles liegt nur im Arbeitsspeicher eines Rechners und wird nach der Stunde gelöscht, spätestens nach zwei Stunden. Auf deinem Gerät merkt sich der Browser nur in diesem Tab, dass du dabei bist. Schließt du den Tab, ist es weg.",
      "Wie bei jeder Internetseite sieht der Betreiber deine IP-Adresse kurz in seinen Zugriffsprotokollen. Das ist kein Teil des Klassenmodus, sondern gilt für jeden Aufruf einer Seite. Fragen dazu beantwortet deine Lehrkraft.",
     ],
     merke: "Gib den Code nicht an Menschen weiter, die nicht in deiner Klasse sind. Wer ihn kennt, kann mitmachen."},
    {h: "Wenn etwas nicht klappt",
     kurz: "Die häufigsten Fälle.",
     tabelle: {
      beschriftung: "Probleme und Lösungen",
      kopf: ["Was du siehst", "Was du tun kannst"],
      zeilen: [
       ["Diesen Code gibt es nicht", "Prüfe die acht Zeichen. Es gibt kein O, keine 0, kein I und kein L. Nach drei Fehlversuchen schließt die Verbindung, nach vielen sperrt der Dienst deinen Anschluss kurz."],
       ["Von deinem Anschluss sind schon 3 Geräte in dieser Sitzung", "Aus Schutz vor Mehrfachstimmen nimmt der Dienst je Netzwerkadresse zunächst nur 3 Geräte auf. Sag es deiner Lehrkraft, sie kann das für ein Schulnetz erhöhen."],
       ["Die Sitzung ist voll", "Es können 40 Personen mitmachen. Frag deine Lehrkraft."],
       ["Die Verbindung ist weg", "Warte einen Moment. Die Seite verbindet sich allein neu und du bleibst \"Roter Fuchs\", solange der Tab offen ist."],
       ["Die Sitzung ist zu Ende", "Die Lehrkraft hat gelöscht oder die Zeit ist abgelaufen. Frag nach einem neuen Code."],
      ],
     }},
  ],
  mitnehmen: [
    "Du brauchst nur den Code. Es gibt keinen Namen und kein Konto.",
    "Deine Antwort ist endgültig, und niemand sieht, was du gewählt hast.",
    "Nach der Stunde wird alles gelöscht.",
  ],
  quiz: [
    {frage: "Was sieht die Lehrkraft von deiner Antwort?", optionen: ["Deinen Namen und deine Antwort", "Nur die Summe aller Antworten", "Dein Gerät und deine Antwort", "Nichts, auch keine Summe"], richtig: 1, erklaerung: "Die Lehrkraft sieht, wie viele geantwortet haben, und später die Verteilung aller Antworten. Wer was gewählt hat, weiß niemand."},
    {frage: "Was tust du, wenn der Code nicht klappt?", optionen: ["Du probierst so lange, bis es klappt", "Du prüfst die acht Zeichen und fragst im Zweifel deine Lehrkraft", "Du erfindest einen Code", "Du lädst die Seite hundertmal neu"], richtig: 1, erklaerung: "Zu viele falsche Eingaben sperren den Anschluss für einige Minuten. Genaues Hinsehen und Nachfragen geht schneller."},
  ],
  weiter: ["klassenmodus", "klasse-wand", "echt-oder-ki", "prompts-schule", "datenschutz-im-alltag"],
},

"klasse-wand": {
  nav: "Klassenwand", typ: "labor", gruppe: "Für die Schule", titel: "Die Wand für den Beamer",
  symbol: "presentation", widget: "klasse-wand", widgetZuerst: true, widgetTitel: "Wand", widgetSymbol: "presentation",
  kurz: "Die Wand zeigt Code, wer dabei ist und die Summen der Klasse in großer Schrift. Sie kann nichts steuern und zeigt nie, wer was gewählt hat.",
  zusammenfassung: "Wand-Ansicht des Klassenmodus für den Beamer: Warteansicht mit Code, Fortschritt, Ergebnis als Balken, Vollbild.",
  abschnitte: [
    {h: "So benutzen Sie die Wand",
     kurz: "Sie öffnet sich mit einem Klick von der Seite des Klassenmodus aus.",
     liste: [
      "Starten Sie auf {{klassenmodus|Klassenmodus}} eine Sitzung und drücken Sie \"Wand öffnen\". Die Wand öffnet sich in einem neuen Tab und kennt Code und Schlüssel aus Ihrem Browser.",
      "Ziehen Sie den Tab auf den Beamer und drücken Sie \"Vollbild\".",
      "Öffnen Sie die Wand in einem anderen Browser, tragen Sie Code und Schlüssel von Hand ein. Beides steht nie in der Adresse.",
     ]},
    {h: "Was die Wand zeigt und was nie",
     kurz: "Sicher für den Blick der ganzen Klasse.",
     tabelle: {
      beschriftung: "Wand im Überblick",
      kopf: ["Phase", "Die Wand zeigt", "Die Wand zeigt nie"],
      zeilen: [
       ["Warten", "Adresse, Code, Zahl der Teilnehmenden, Zufallsnamen", "Wer sich hinter einem Namen verbirgt"],
       ["Aufgabe offen", "Frage, Bild oder Texte, \"7 von 23 haben geantwortet\"", "Zwischenstände der Antworten"],
       ["Ergebnis", "Balken je Antwort, richtige Antwort, ab 5 Antworten Mittelwert oder Median (nur wenn kein Feld verdeckt ist)", "Einzelne Antworten, verdeckte Felder, Namen"],
      ],
     },
     merke: "Auch die Zufallsnamen verschwinden von der Wand, sobald die erste Aufgabe läuft."},
  ],
  mitnehmen: [
    "Die Wand ist nur zum Anschauen. Gesteuert wird auf der Seite des Klassenmodus.",
    "Code und Schlüssel stehen nie in der Adresse.",
  ],
  weiter: ["klassenmodus", "klasse-mitmachen"],
},

},

});
