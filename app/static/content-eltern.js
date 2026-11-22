/* Seite "KI zu Hause: Was Eltern wissen sollten" (Gruppe Medienkompetenz). Du-Form, bildzentriert nach docs/visuals.md.
   Nur belegte Aussagen: Seite "Ist das sicher?" (content-laien.js), "Information für Eltern" (content-schule.js),
   Medienseiten (content-medien.js), Chat-Aufruf in app/app.py (kein eigener Filter vor dem Sprachmodell).
   Die Seite schule-eltern bleibt der Brief für den Schuleinsatz (Sie-Form) und verweist hierher.
   Eintrag in module.json (content) steht noch aus. */
(function () {

const S = {};

S["eltern-zuhause"] = {
  nav: "Eltern zu Hause", typ: "lektion", gruppe: "Medienkompetenz", titel: "KI zu Hause: Was Eltern wissen sollten", symbol: "users",
  rechtslinks: true,
  lernziele: [
    "Du kannst sagen, was das Labor speichert und was nicht.",
    "Du kannst erklären, warum jüngere Kinder Kamera und Gesicht nur mit dir nutzen sollten.",
    "Du kannst drei Gespräche mit deinem Kind beginnen: Echt oder KI, Quellen prüfen, Hausaufgaben fair.",
  ],
  kurz: "Ist das KI-Labor sicher für Kinder? Hier steht, was es speichert, wo die Grenzen liegen und wie ihr es zu Hause gemeinsam nutzt.",
  zusammenfassung: "Hinweise für Eltern zum Einsatz des kostenlosen KI-Labors zu Hause: kein Konto, keine Werbung, Eingaben werden nicht dauerhaft gespeichert. Kamera, Mikrofon und Gesicht sind ab 16 Jahren gedacht, die Seite prüft das Alter nicht. Das Sprachmodell erfindet manchmal Antworten, deshalb gemeinsam nutzen. Drei Gespräche mit dem Kind und Experimente ohne Kamera. Kein Rechtsrat.",
  abschnitte: [
    {h: "Ist das Labor sicher für Kinder?",
     kurz: "Zum Lernen und Ausprobieren ja: kein Konto, keine Werbung, Eingaben werden nicht dauerhaft gespeichert.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "user-check", text: "Kein Konto", sub: "keine Anmeldung"},
      {icon: "ban", text: "Keine Werbung", sub: "keine Profile"},
      {icon: "clock", text: "Texte nur kurz", sub: "30 Minuten Ruhe, dann weg"}]},
     p: [
      "Das Labor ist ein Lernangebot. Dein Kind braucht kein Konto und gibt keinen Namen an. Chat-Fragen werden nicht aufbewahrt. Texte, die es in die RAG-Werkstatt einfügt, bleiben für die Sitzung im Arbeitsspeicher und verfallen nach 30 Minuten Ruhe.",
      "Im Browser liegen ein kleines Cookie und einige Merkzettel, zum Beispiel welche Seiten gelesen sind. Sie enthalten keine Namen und keine Texte. Auf dem Weg zum Rechner laufen die Eingaben über Vermittler (ein Server bei IONOS und der Tunneldienst von Cloudflare). Der Rechner speichert sie nicht.",
     ],
     merke: "Sicher heißt hier: wenig Daten, keine Werbung. Es heißt nicht, dass jede Antwort des Chats passt. Mehr dazu im nächsten Abschnitt."},
    {h: "Kamera, Mikrofon und Gesicht",
     kurz: "Ab 16 Jahren gedacht. Die Seite prüft das Alter nicht, darum begleitest du Jüngere.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "camera", text: "Kamera", sub: "nur nach Zustimmung"},
      {icon: "mic", text: "Mikrofon", sub: "nur nach Zustimmung"},
      {icon: "scan-face", text: "Gesicht", sub: "ab 16 Jahren"}]},
     p: [
      "Kamera und Mikrofon schalten sich nie von allein ein. Erst fragt die Seite, dann der Browser. Bilder und Aufnahmen werden nicht gespeichert. Bei der Gesichtserkennung entstehen aus Gesichtern Zahlenlisten. Das sind besonders geschützte Daten. Darum gibt es dort ein eigenes Kontrollkästchen.",
      "Die Seite fragt nicht nach dem Alter und prüft es nicht. Jüngere Kinder nutzen diese Labore deshalb nur, wenn du einverstanden bist und dabei bist.",
     ],
     merke: "Kein Alterscheck heißt: Du bist der Alterscheck."},
    {h: "Was das Sprachmodell kann und was nicht",
     kurz: "Es erklärt und formuliert gut, erfindet aber auch. Einen Jugendschutzfilter, auf den du dich verlassen kannst, gibt es nicht.",
     visual: {typ: "vergleich",
      links: {titel: "Kann gut", icon: "circle-check", farbe: "gruen", punkte: ["Etwas einfach erklären", "Texte formulieren", "Ideen sammeln", "Fragen geduldig beantworten"]},
      rechts: {titel: "Kann nicht", icon: "triangle-alert", farbe: "orange", punkte: ["Sicher wissen, was stimmt", "Belege garantieren", "Kindgerechte Antworten garantieren"]},
      urteil: "Deshalb gemeinsam nutzen"},
     p: [
      "Ein Sprachmodell wählt Wort für Wort, was wahrscheinlich als Nächstes kommt. Das klingt oft überzeugend, auch wenn es falsch ist. Manchmal nennt es Quellen, die es nicht gibt. Das Modell im Labor ist klein und weiß weniger als große Modelle.",
      "Das Labor schaltet keinen eigenen Filter vor das Modell. Eine Frage deines Kindes geht direkt an das Sprachmodell Llama 3.2. Ob eine Antwort zum Alter passt, kann niemand vorher garantieren. Sitz deshalb dabei, wenn ihr den Chat nutzt.",
     ],
     alltag: "Stell dir einen belesenen Gast am Tisch vor, der immer sofort und selbstsicher antwortet, auch wenn er etwas nicht weiß. Man hört gern zu, aber man prüft nach. Der Vergleich hinkt an einer Stelle: Ein Gast merkt manchmal selbst, dass er unsicher ist. Das Modell klingt immer gleich sicher."},
    {h: "Drei Gespräche mit deinem Kind",
     kurz: "Echt oder KI, Quellen prüfen, Hausaufgaben fair. Jedes Gespräch beginnt mit einer Frage, nicht mit einem Verbot.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "eye", text: "Echt oder KI?", sub: "woran erkennst du es"},
      {icon: "search", text: "Quellen prüfen", sub: "stimmt das wirklich"},
      {icon: "book-open", text: "Hausaufgaben", sub: "was war von dir"}]},
     p: [
      "**Echt oder KI?** Schaut zusammen ein Bild oder einen Clip an und fragt: Woran würdest du das prüfen? Die Seite {{echt-oder-ki|Echt oder KI?}} zeigt Warnzeichen und Prüfwege. Vereinbart auch ein Codewort für Notfallanrufe. Stimmen lassen sich nachbauen, ein Codewort hilft gegen jede Fälschung.",
      "**Quellen prüfen.** Lass dein Kind den Chat etwas fragen, das es gut kennt, zum Beispiel sein Hobby. Wo liegt der Chat daneben? Mehr dazu auf der Seite {{quellen-pruefen|Quellen prüfen}}.",
      "**Hausaufgaben fair.** Fragt: Was hast du selbst gemacht, was die KI? Wie schreibst du das auf? Die Seite {{ki-hausaufgaben-fair|KI bei Hausaufgaben}} erklärt den Unterschied zwischen Helfen und Abnehmen.",
     ]},
    {h: "Die Kamera braucht dein Kind nicht",
     kurz: "Alle Experimente laufen ohne Kamera und Mikrofon. Fang dort an.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "chart-scatter", text: "Punkte-Labor", sub: "Lernen sehen"},
      {icon: "message-square", text: "Chat", sub: "Frage und Antwort"},
      {icon: "bug", text: "Fehler-Spiel", sub: "wo KI danebenliegt"},
      {icon: "split", text: "Prompt-Vergleich", sub: "bessere Fragen"},
      {icon: "volume-2", text: "Text zu Sprache", sub: "Stimme hören"},
      {icon: "network", text: "Netz-Spielplatz", sub: "ein Netz lernt"}]},
     p: [
      "Auf der Seite {{experimente|Experimente}} stehen Labore, die ohne Kamera und Mikrofon auskommen. Dein Kind setzt Punkte, stellt Fragen und sucht Fehler der KI. Das reicht, um zu verstehen, wie KI arbeitet.",
      "Der Chat läuft auf einem kleinen Rechner und braucht manchmal einen Moment. Wenn viel los ist, wartet ihr kurz.",
     ]},
    {h: "So richtest du es zu Hause ein",
     kurz: "Gemeinsam öffnen, Experimente wählen, Kamera aus lassen, danach reden.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "laptop", text: "Gemeinsam öffnen", sub: "ein Gerät, ihr zwei"},
      {icon: "flask-conical", text: "Experimente", sub: "ohne Kamera"},
      {icon: "eye-off", text: "Kamera aus", sub: "Zustimmung verweigern"},
      {icon: "messages-square", text: "Danach reden", sub: "was war überraschend", farbe: "gruen"}]},
     p: [
      "Setz dich zu deinem Kind und öffnet die Seite auf einem Gerät. Tippt keine echten Namen, Adressen oder privaten Dinge ein. Erfundene Beispiele reichen zum Üben.",
      "Möchtest du Kamera und Mikrofon für die Seite ganz sperren, stell sie in den Websiteeinstellungen deines Browsers auf „Blockieren“. Eine schon erteilte Zustimmung nimmst du auf der Seite {{sicherheit-einfach|Ist das sicher?}} zurück. Dort kannst du auch alles löschen, was die Seite im Browser ablegt.",
     ],
     merke: "Ein Gerät, zwei Personen, ohne Kamera. Das ist der einfachste sichere Anfang."},
    {h: "Fragen und Kontakt",
     kurz: "Fragen zum Labor und zum Datenschutz beantwortet der Betreiber. Verbindlich sind Datenschutzerklärung und Impressum.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "file-text", text: "Datenschutz", sub: "was verarbeitet wird"},
      {icon: "mail", text: "Impressum", sub: "Kontakt des Betreibers"},
      {icon: "handshake", text: "Du fragst", sub: "bei Unklarem", farbe: "gruen"}]},
     p: [
      "Die Datenschutzerklärung steht auf der Hauptseite des Betreibers: [daniel-alisch.site/datenschutz](https://daniel-alisch.site/datenschutz). Dort stehen auch deine Rechte, zum Beispiel auf Auskunft oder Löschung. Die Kontaktdaten findest du im Impressum, die Links stehen unten auf dieser Seite.",
      "Arbeitet dein Kind im Unterricht mit dem Labor, steht in der {{schule-eltern|Information für Eltern}}, was die Schule dabei tut. Diese Seite hier ist keine Rechtsberatung.",
     ]},
  ],
  mitnehmen: [
    "Das Labor braucht kein Konto, zeigt keine Werbung und speichert Eingaben nicht dauerhaft.",
    "Kamera, Mikrofon und Gesicht sind ab 16 gedacht. Die Seite prüft das Alter nicht, du begleitest Jüngere.",
    "Das Sprachmodell erfindet manchmal Antworten und hat keinen Filter, auf den du dich verlassen kannst. Nutzt es gemeinsam.",
  ],
  grenzen: [
    "Keine Rechtsberatung. Verbindlich sind Impressum und Datenschutzerklärung des Betreibers.",
    "Wie alt dein Kind sein muss, damit es Kamera oder Gesicht nutzen darf, entscheidest du. Die Seite stellt es nicht fest.",
  ],
  quiz: [
    {frage: "Dein Kind ist 12 und will die Gesichtserkennung ausprobieren. Was gilt im Labor?",
     optionen: ["Die Seite prüft das Alter und sperrt die Funktion", "Die Seite prüft kein Alter, ab 16 gedacht, Jüngere mit deinem Einverständnis", "Die Funktion ist für alle ohne Einschränkung gedacht", "Die Funktion läuft nur mit einem Konto der Eltern"],
     richtig: 1, erklaerung: "Die Seite fragt nicht nach dem Alter und prüft es nicht. Kamera, Mikrofon und Gesicht sind ab 16 gedacht, Jüngere nutzen sie nur mit Einverständnis der Eltern."},
    {frage: "Warum solltest du beim Chat mit dem Sprachmodell dabei sein?",
     optionen: ["Weil Antworten erfunden sein können und kein Filter sie prüft", "Weil der Chat jede Eingabe dauerhaft speichert und verkauft", "Weil das Modell ohne Aufsicht keine Antwort geben würde", "Weil der Chat ohne ein Konto der Eltern nicht startet"],
     richtig: 0, erklaerung: "Das Modell klingt überzeugend, auch wenn es falsch liegt, und das Labor schaltet keinen eigenen Filter davor. Gemeinsam nutzen und nachprüfen ist der Schutz."},
    {frage: "Was ist ein guter Einstieg, wenn dein Kind keine Kamera nutzen soll?",
     optionen: ["Die Kamera erlauben und später wieder ausschalten", "Erst ein Konto anlegen und die Kamera sperren", "Die Experimente, sie laufen ohne Kamera und Mikrofon", "Nur Gesichtserkennung, weil sie am meisten zeigt"],
     richtig: 2, erklaerung: "Alle Experimente kommen ohne Kamera und Mikrofon aus. Dein Kind lernt dort, wie KI arbeitet und wo sie danebenliegt."},
  ],
  weiter: ["sicherheit-einfach", "experimente", "echt-oder-ki", "quellen-pruefen", "ki-hausaufgaben-fair", "schule-eltern"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "Medienkompetenz", seiten: ["eltern-zuhause"] }],
});
})();
