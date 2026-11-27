/* Seite "Deine Entscheidung": Endseite des Betriebspfads (Rolle "beruf"). Sechs Fragen zum Abhaken (widget "checkliste",
   Seitenfeld checkliste, siehe widgets-prognose.js), dazu Hinweis zum Drucken und der Weg zum Kontakt.
   Kontakt: Hauptseite des Betreibers (module.json seite.autor_url), dort der Abschnitt Kontakt. Keine Preise, keine Zusagen. */
(function () {

const S = {};

S["betrieb-entscheidung"] = {
  nav: "Deine Entscheidung", typ: "lektion", gruppe: "KI im Betrieb", titel: "Deine Entscheidung: sechs Fragen vor dem Start", symbol: "clipboard-check",
  widget: "checkliste", widgetTitel: "Sechs Fragen zum Abhaken", widgetSymbol: "list-checks",
  downloads: [{text: "Entscheidungshilfe für den Betrieb", sub: "1 Seite A4 mit Kästchen, Notizfeld und QR-Code, zum Ausdrucken", href: "/static/materialien/entscheidungshilfe-betrieb.pdf"}],
  checkliste: {
    lead: "Gehe die Fragen durch. Jedes Nein ist eine Aufgabe, die du vor dem Start erledigst.",
    punkte: [
      {frage: "Ist das Problem in einem Satz beschrieben?", hilfe: "Zum Beispiel: Wir verlieren jede Woche zwei Stunden mit dem Schreiben von Angeboten."},
      {frage: "Gibt es einen Ausgangswert und ein Ziel?", hilfe: "Wie lange dauert es heute, und was wäre ein Erfolg?"},
      {frage: "Sind Daten und Rechtsgrundlage geklärt?", hilfe: "Welche Daten gehen in das System, und darf das so geschehen? Echte Kundendaten gehören nicht in dieses Labor. Mit Schweigepflicht (Steuerberatung, Anwaltschaft, Ärzte) gelten zusätzliche Regeln, siehe den Abschnitt „Berufsgeheimnis und Mandantendaten“ weiter unten. Gesundheitsdaten sind besondere Kategorien nach Art. 9 DSGVO und besonders geschützt."},
      {frage: "Ist ein Verantwortlicher benannt, und prüft jemand die Ergebnisse?", hilfe: "Die KI irrt. Eine Person prüft, bevor etwas hinausgeht."},
      {frage: "Sind Betroffene, Datenschutz und Betriebsrat informiert?", hilfe: "Früh einbinden spart späteres Umbauen."},
      {frage: "Gibt es einen Rückfall, und weißt du, wann du stoppst?", hilfe: "Was passiert, wenn das System ausfällt oder nicht hält, was es verspricht?"},
    ],
  },
  lernziele: [
    "Du kannst sechs Fragen nennen, die vor einem KI-Einsatz geklärt sein sollten.",
    "Du kannst sagen, welche davon bei dir noch offen sind.",
    "Du kannst entscheiden: starten, nachbessern oder lassen.",
  ],
  kurz: "Zum Schluss des Betriebspfads: sechs Fragen zum Abhaken, was jetzt ansteht und wohin du dich mit Fragen wenden kannst.",
  zusammenfassung: "Endseite des Betriebspfads: sechs Fragen vor dem Start eines KI-Einsatzes (Problem, Ziel, Daten, Verantwortung, Betroffene, Rückfall) zum Abhaken, Hinweis zum Drucken per Browser, drei mögliche Entscheidungen und der Weg zur Kontaktseite des Betreibers.",
  abschnitte: [
    {h: "Was du jetzt entscheidest",
     kurz: "Starten, nachbessern oder lassen: Alle drei sind gute Ergebnisse, wenn du sie begründen kannst.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "rocket", text: "Starten", sub: "alle sechs Fragen mit Ja", farbe: "gruen"},
      {icon: "wrench", text: "Nachbessern", sub: "einzelne Fragen offen", farbe: "orange"},
      {icon: "circle-x", text: "Lassen", sub: "Nutzen nicht belegbar", farbe: "rot"}]},
     p: [
      "Bei lauter Ja startest du mit einem kleinen Pilot, mit Ausgangswert, Ziel und Abbruchregel. Bei einzelnen Nein erledigst du zuerst diese Aufgaben. Und wenn du den Nutzen nicht in einem Satz begründen kannst, ist Lassen die richtige Entscheidung. Eine Entscheidung gegen KI ist keine Niederlage.",
      "Zur Einordnung der Kosten hilft die Seite {{kosten-energie|Kosten und Energie}} mit einer gekennzeichneten Beispielrechnung. Die Regeln stehen auf {{recht|Recht und Regeln}}, die Fragen zu den Daten auf {{sicherheit-einfach|Ist das sicher?}}.",
     ]},
    {h: "Berufsgeheimnis und Mandantendaten",
     kurz: "Mit Schweigepflicht (Steuerberatung, Rechtsanwaltschaft, Ärzte) gehören Mandanten- und Patientendaten nicht in dieses Labor. Im eigenen Betrieb sind Vertrag, Standort und Verschwiegenheit vorher zu klären.",
     p: [
      "Frage 3 verlangt, Daten und Rechtsgrundlage zu klären. Gesundheitsdaten gehören nach Art. 9 DSGVO zu den besonderen Kategorien und sind grundsätzlich besonders geschützt. Für Berufsgeheimnisträger heißt das mehr als Datenschutz: Wer fremde Geheimnisse unbefugt offenbart, kann sich nach § 203 StGB strafbar machen. Externe Dienstleister, auch KI-Dienste, brauchen deshalb vor dem ersten echten Fall einen Vertrag, der sie zur Verschwiegenheit verpflichtet und nur die nötige Kenntnis erlaubt (für Steuerberatung siehe § 62a StBerG, für den Datenschutz Art. 28 DSGVO). Dazu gehören die Fragen nach dem Standort der Verarbeitung und danach, ob Eingaben zum Training verwendet werden.",
      "Die Einzelheiten mit Quellen stehen auf {{sicherheit-einfach|Ist das sicher?}} im Abschnitt „Berufsgeheimnis und Mandantendaten“. Ein Beispiel für ein Steuerbüro mit erfundenen Daten steht auf {{uc-buero-dokumente|Fragen an Dokumente}}, für Praxen und Therapeuten gibt es {{praxis-gesundheit|KI in der Arztpraxis}}. Das ist keine Rechtsberatung.",
     ]},
    {h: "Drucken oder als PDF speichern",
     kurz: "Am besten das PDF oben: eine Seite A4 mit Kästchen und Notizfeld. Der Druckdialog deines Browsers geht auch, die Haken bleiben nur in dieser Sitzung.",
     p: [
      "Die Entscheidungshilfe gibt es als [PDF mit einer Seite](/static/materialien/entscheidungshilfe-betrieb.pdf), mit Kästchen, Notizfeld und QR-Code. Sie steht oben auf dieser Seite zum Herunterladen.",
      "Wer die Haken am Bildschirm setzen will: Über den Knopf oben öffnest du den Druckdialog deines Browsers. Dort kannst du die Seite ausdrucken oder als PDF speichern. Die Haken bleiben in deinem Browser, nur in dieser Sitzung oder mit „Fortschritt merken“ auch beim nächsten Besuch. Sie werden nicht gesendet. Hake vor dem Drucken ab, was geklärt ist.",
     ]},
    {h: "Fragen und Kontakt",
     kurz: "Bei Fragen zum Labor und zur Einführung hilft die Kontaktseite des Betreibers.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "clipboard-check", text: "Fragen geklärt", sub: "oder offen"},
      {icon: "mail", text: "Kontakt", sub: "über die Hauptseite"},
      {icon: "handshake", text: "Gespräch", sub: "über dein Vorhaben", farbe: "gruen"}]},
     p: [
      "Das KI-Labor ist ein kostenloses Lernangebot und ersetzt keine Beratung für deinen Betrieb. Wenn du über ein konkretes Vorhaben sprechen möchtest, findest du den Betreiber über die [Kontaktseite auf daniel-alisch.site](https://daniel-alisch.site/#contact). Schreib bitte keine vertraulichen Betriebsdaten in die erste Nachricht.",
     ]},
  ],
  mitnehmen: [
    "Sechs Fragen genügen vor dem Start: Problem, Ziel, Daten, Verantwortung, Betroffene, Rückfall.",
    "Jedes Nein ist eine Aufgabe, kein Grund zum Aufgeben.",
    "Starten, nachbessern und lassen sind gleichwertige Ergebnisse.",
  ],
  weiter: ["ki-einfuehrung", "kosten-energie", "kamera-grenzen", "recht", "sicherheit-einfach", "praxis-gesundheit"],
};

/* Seite "Kameraprüfung: Grenzen, Haftung, Taktzeit, Datenschutz" (Gruppe KI im Betrieb). Zahlen in der Taktzeit-Rechnung sind erfunden und gekennzeichnet.
   Rechtliche Hinweise nur als Fragen zum Klären, keine Rechtsberatung. Quellen am 22.11.2026 abgerufen. */
S["kamera-grenzen"] = {
  nav: "Kameraprüfung: Grenzen", typ: "lektion", gruppe: "KI im Betrieb", titel: "Kameraprüfung: Grenzen, Haftung, Taktzeit, Datenschutz", symbol: "scan-search", rollen: ["betrieb"],
  lernziele: [
    "Du kannst vier Grenzen einer Kameraprüfung nennen: Licht, Glanz, Varianten, Fehlerquote.",
    "Du kannst sagen, wen du zur Haftung fragst, statt sie selbst zu beurteilen.",
    "Du kannst eine Taktzeit prüfen und sagen, was bei Bildern von Beschäftigten zu klären ist.",
  ],
  kurz: "Was eine Kamera in der Qualitätsprüfung nicht kann, wer bei durchgelassenen Fehlteilen gefragt werden muss, ob sie in den Takt passt und was bei Bildern von Mitarbeitenden gilt. Keine Rechtsberatung.",
  zusammenfassung: "Überblick für Betriebe, die eine Kameraprüfung erwägen: Grenzen (Licht, Glanz, Varianten, Fehlerquote), Haftung als Frage an Versicherung, Hersteller und Kunden, eine Beispielrechnung zur Taktzeit mit erfundenen Zahlen, Datenschutz und Mitbestimmung bei Bildern von Beschäftigten als Punkte zum Klären. Die Beispielbilder im Labor sind gezeichnet.",
  abschnitte: [
    {h: "Wo die Kamera an Grenzen kommt",
     kurz: "Licht, Glanz, neue Varianten und eine Fehlerquote, die ohne Testmenge nichts aussagt.",
     visual: {typ: "raster", spalten: 4, zellen: [
      {icon: "sun", text: "Licht", sub: "Aufbau abschirmen"},
      {icon: "sparkles", text: "Glanz", sub: "Metall spiegelt"},
      {icon: "shapes", text: "Varianten", sub: "neue Teile, neue Fehler"},
      {icon: "percent", text: "Fehlerquote", sub: "Testmenge nennen"}]},
     p: [
      "Die Beispiele im Labor sind gezeichnet, keine echten Teile (für das Beispiel brauchst du keine Kamera). Echte Teile glänzen, spiegeln und haben Fehler an beliebiger Stelle. Auf {{uc-fertigung-sichtpruefung|Sichtprüfung}} stehen die Stolpersteine im Einzelnen.",
      "**Licht:** Ändert sich das Licht (Sonne durchs Fenster, andere Lampe), ändert sich das Bild. **Glanz:** Spiegelungen verdecken Kratzer oder täuschen welche vor. **Varianten:** Eine neue Charge, ein neues Werkzeug oder eine neue Fehlerart kennt das System nicht und ordnet sie nach Ähnlichkeit ein, oft falsch. **Fehlerquote:** Eine Quote ohne Zahl der Testbilder sagt wenig. Im Labor-Beispiel wurden 11 von 12 Testbildern richtig zugeordnet: Ein einziger Fehler fällt bei so wenigen Bildern stark ins Gewicht.",
      "Teuer ist die Richtung: Ein Ausschussteil, das als Gutteil durchgeht, wiegt schwerer als ein Gutteil im Ausschussfach. Darum zieht ein Mensch weiter Stichproben, vor allem aus dem Gut-Fach.",
     ],
     tabelle: {
      beschriftung: "Grenzen und Gegenmittel",
      kopf: ["Grenze", "Was passiert", "Gegenmittel"],
      zeilen: [
       ["Licht", "Bild und Urteil schwanken", "Abgeschirmter Aufbau mit festem Licht"],
       ["Glanz", "Spiegelungen täuschen Fehler vor oder verdecken sie", "Beleuchtung und Winkel im Pilot mit echten Teilen testen"],
       ["Varianten", "Neue Teile und Fehlerarten werden falsch eingeordnet", "Neue Fehler sammeln, nachlernen, Stichproben"],
       ["Fehlerquote", "Zahl ohne Testmenge täuscht", "Testmenge und Fehlerart nennen, mit eigenen Teilen messen"],
      ]},
     merke: "Ob die Kamera für deine Teile reicht, zeigt nur ein Pilot mit deinen Teilen am echten Platz."},
    {h: "Wer haftet, wenn ein Fehlteil durchrutscht?",
     kurz: "Das ist eine Frage des Einzelfalls und keine für diese Seite. Frage Versicherung, Hersteller und Kunden, bevor die Kamera die Prüfung ersetzt.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "shield-check", text: "Versicherung", sub: "ist das gedeckt"},
      {icon: "building-2", text: "Hersteller", sub: "was wird zugesagt"},
      {icon: "handshake", text: "Kunde", sub: "was ist vorgeschrieben"}]},
     p: [
      "Wer haftet, hängt vom Vertrag und vom Einzelfall ab. Diese Seite beurteilt das nicht. Sie nennt Fragen, die du vor dem Einsatz schriftlich klärst:",
     ],
     liste: [
      "**Versicherung:** Sind Schäden durch Fehlteile aus einer automatischen Prüfung durch die Betriebs- und Produkthaftpflicht gedeckt? Gelten Bedingungen an die Prüfung?",
      "**Hersteller des Systems:** Welche Erkennungsquote wird unter welchen Bedingungen (Licht, Teile, Geschwindigkeit) schriftlich zugesagt? Was gilt bei Fehlern?",
      "**Kunde:** Welche Prüfvorgaben und Normen gelten für das Teil? Ist eine automatische Prüfung erlaubt, und was muss dokumentiert werden?",
      "**Intern:** Wer gibt Teile frei, wer zieht Stichproben, und wer entscheidet bei Zweifeln? Die Verantwortung bleibt bei Menschen.",
     ]},
    {h: "Taktzeit: passt die Prüfung in den Takt?",
     kurz: "Aufnahme, Auswertung und Aussortieren müssen kürzer sein als der Takt. Beispielrechnung mit erfundenen Zahlen, miss im Pilot mit deiner Anlage.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "camera", text: "Aufnahme", sub: "Teil steht, Licht an"},
      {icon: "cpu", text: "Auswertung", sub: "Urteil Gut oder Ausschuss"},
      {icon: "arrow-right-left", text: "Aussortieren", sub: "Weiche schaltet"}]},
     p: [
      "Beispielrechnung, alle Werte erfunden: Die Linie fertigt 10 Teile pro Minute, also ein Teil alle 6 Sekunden. Die Aufnahme braucht 0,5 Sekunden, die Auswertung 0,5 Sekunden, die Weiche 1 Sekunde. Zusammen sind das 2 Sekunden und damit weniger als der Takt von 6 Sekunden. Es bleiben 4 Sekunden Reserve.",
      "Bei 30 Teilen pro Minute (Takt 2 Sekunden) bliebe keine Reserve. Dann hilft eine schnellere Auswertung, eine zweite Kamera oder eine Prüfung in Stichproben statt jedes Teils. Die Zeiten für deine Anlage misst du im Pilot. Zahlen aus diesem Beispiel sind keine Messwerte.",
     ]},
    {h: "Datenschutz bei Bildern von Beschäftigten",
     kurz: "Sind Hände, Gesichter oder Namensschilder zu sehen, sind es personenbezogene Daten. Datenschutz und Betriebsrat früh einbinden.",
     p: [
      "Am besten zeigen die Bilder nur Teile. Sind Beschäftigte erkennbar, sind das personenbezogene Daten im Sinne von Art. 4 Nr. 1 DSGVO. Für Beschäftigtendaten gilt § 26 BDSG, dessen Reichweite seit dem EuGH-Urteil vom 30.03.2023 (C-34/21) umstritten ist. Zusätzlich kann Art. 6 DSGVO die Grundlage sein (Stand 27.11.2026). Der Betriebsrat hat nach § 87 Abs. 1 Nr. 6 BetrVG mitzubestimmen bei der Einführung und Anwendung technischer Einrichtungen, die dazu bestimmt sind, das Verhalten oder die Leistung der Arbeitnehmer zu überwachen.",
      "Ob das auf dein Vorhaben zutrifft, klärst du früh mit der oder dem Datenschutzbeauftragten und dem Betriebsrat, auch die Rechtsgrundlage für Beschäftigtendaten. Eine Kamera, die nur Teile prüft, ist etwas anderes als eine, die ein Prüfergebnis einer Person zuordnet. Müssen Beschäftigte im Bild bleiben, zeigt {{bild-schuetzen|Bild schützen}}, wie Gesichter unkenntlich werden. Haltung und Gang am Arbeitsplatz zu messen ist ein eigener, heikler Fall, siehe {{koerperhaltung|Körperhaltung}}. Das ist keine Rechtsberatung.",
      "Quellen, abgerufen am 22.11.2026: [Art. 4 DSGVO](https://dsgvo-gesetz.de/art-4-dsgvo/), [§ 26 BDSG](https://www.gesetze-im-internet.de/bdsg_2018/__26.html), [§ 87 BetrVG](https://www.gesetze-im-internet.de/betrvg/__87.html).",
     ]},
    {h: "Kosten rechnen", id: "kosten-rechnen",
     kurz: "Eine Beispielrechnung für Kameraprojekte steht auf {{kosten-energie|Kosten und Energie}}, Abschnitt „Kameraprojekte rechnen anders“.",
     p: [
      "Kamera, Licht, Halterung, Einrichtung, Pflege und der Vergleich mit der Handprüfung stehen mit erfundenen Zahlen auf {{kosten-energie|Kosten und Energie}}.",
     ]},
  ],
  mitnehmen: [
    "Licht, Glanz, Varianten und Fehlerquote sind die Grenzen. Ein Pilot mit eigenen Teilen zeigt, ob es reicht.",
    "Zur Haftung fragst du Versicherung, Hersteller und Kunden schriftlich. Diese Seite beurteilt sie nicht.",
    "Aufnahme, Auswertung und Aussortieren müssen in den Takt passen. Bilder von Beschäftigten klärst du mit Datenschutz und Betriebsrat.",
  ],
  grenzen: ["Keine Rechtsberatung. Die Beispielbilder im Labor sind gezeichnet. Alle Zahlen der Taktzeit-Rechnung sind erfunden."],
  quiz: [
    {frage: "Ein Anbieter nennt 99 Prozent Erkennung. Was fragst du zuerst?",
     optionen: ["Wie viele Testbilder, welche Fehlerarten und unter welchem Licht gemessen wurde", "Ob die Zahl auch auf der Verpackung steht", "Ob der Rechner eine Kamera mitbringt", "Nichts, 99 Prozent genügen"],
     richtig: 0, erklaerung: "Eine Quote ohne Testmenge, Fehlerarten und Bedingungen sagt wenig. Bei wenigen Testbildern fällt ein einziger Fehler stark ins Gewicht."},
    {frage: "Die Linie läuft mit einem Teil alle 2 Sekunden. Aufnahme, Auswertung und Weiche brauchen zusammen 2 Sekunden. Was folgt?",
     optionen: ["Es passt mit viel Reserve", "Es gibt keine Reserve, du brauchst Tempo oder Stichproben", "Die Kamera ist zu schlecht", "Die Taktzeit ist unwichtig"],
     richtig: 1, erklaerung: "Die Prüfung darf nicht länger dauern als der Takt, und Reserve ist nötig. Hier hilft schnellere Auswertung, eine zweite Kamera oder Stichprobe."},
    {frage: "Auf den Bildern sind Hände der Prüfenden zu sehen. Was tust du?",
     optionen: ["Nichts, Hände sind keine Daten", "Mit Datenschutz und Betriebsrat klären, ob das zulässig ist, oder den Bildausschnitt auf die Teile begrenzen", "Die Bilder nur nachts aufnehmen", "Die Bilder in die Cloud laden"],
     richtig: 1, erklaerung: "Erkennbare Beschäftigte machen Bilder zu personenbezogenen Daten. Am besten zeigen die Bilder nur Teile, sonst wird früh geklärt."},
  ],
  weiter: ["uc-fertigung-sichtpruefung", "kosten-energie", "betrieb-entscheidung", "recht", "bewertung"],
};

/* Seite "Betrieb und Sicherheit des Labors" für IT und Nachbauer. Belegt aus scripts/jetson-showcase.service, docs/selbst-aufbauen.md,
   docs/veroeffentlichung.md, app/app.py, app/sicherheit.py und einer Prüfung auf dem Referenzgerät am 22.11.2026 (ss -tlnp, journalctl, journald.conf). */
S["betrieb-sicherheit"] = {
  nav: "Betrieb und Sicherheit", typ: "lektion", gruppe: "Der Rechner dahinter", titel: "Betrieb und Sicherheit des Labors", symbol: "server", rollen: ["technik"], lesemodus: "ausfuehrlich",
  lernziele: [
    "Du kannst sagen, welche Ports das Labor braucht und wie du sie prüfst.",
    "Du weißt, wo die Daten liegen, was geloggt wird und wer die Aufbewahrung festlegt.",
    "Du kennst die Schutzmaßnahmen der App und was du für den Betrieb im Firmennetz selbst ergänzt.",
  ],
  kurz: "Ports, Datenort, Logs, Aufbewahrung, Schutzmaßnahmen und Updates des Labors, so wie sie am Referenzgerät sind. Mit Befehlen zum Nachprüfen.",
  zusammenfassung: "Betriebshandbuch in Kurzform für den Nachbau auf einem Jetson Orin Nano: Port 8443 für die Oberfläche, Ollama soll nur lokal auf 11434 hören (am Referenzgerät aktuell offen), ausgehender Tunnel nur im öffentlichen Betrieb über einen Proxy-Server und Cloudflare. Alle Daten bleiben auf dem Gerät, Sitzungen im Arbeitsspeicher, keine Datenbank. Zugriffsprotokoll mit Adresse, Pfad und Status im Journal, Aufbewahrung vom Betreiber festzulegen. Origin-Prüfung, Host-Erlaubnisliste, Ratenbegrenzung, Sicherheitsköpfe.",
  abschnitte: [
    {h: "Teststand", offen: true,
     kurz: "Nur ein Gerät getestet: Jetson Orin Nano Developer Kit (Super), 8 GB, Ollama 0.12.3. Ein frischer Jetson ist noch nicht von Dritten getestet.",
     p: [
      "Alles auf dieser Seite beschreibt dieses eine Gerät und den Code im Repo. Prüfe es auf deinem Gerät nach, statt es zu übernehmen. Die Schritte zum Aufbau stehen auf {{selbst-bauen|Selbst aufbauen}}.",
     ]},
    {h: "Ports", offen: true,
     kurz: "Nach außen braucht das Labor nur 8443. Ollama (11434) soll nur lokal hören, am Referenzgerät tut es das aktuell nicht. Ein Tunnel verbindet ausgehend, ohne Portfreigabe.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "lock", text: "8443", sub: "HTTPS der App"},
      {icon: "cpu", text: "11434", sub: "Ollama, soll nur lokal hören"},
      {icon: "cloud", text: "Tunnel", sub: "nur ausgehend"}]},
     p: [
      "Der Dienst startet mit `uvicorn --host 0.0.0.0 --port 8443` und selbstsigniertem Zertifikat (`scripts/jetson-showcase.service`). Er hört also auf allen Schnittstellen. Leite den Port nicht im Router ins Internet weiter. Das Labor spricht Ollama unter `http://127.0.0.1:11434` an. Der Standard von Ollama passt dazu, setze `OLLAMA_HOST` nicht (docs/selbst-aufbauen.md). Im öffentlichen Betrieb läuft `cloudflared` als Tunnel nur ausgehend, ohne Portfreigabe (docs/veroeffentlichung.md).",
      "**Ollama soll nur lokal hören.** Prüfe es mit dem Befehl unten: Die Zeile für 11434 muss `127.0.0.1:11434` zeigen. Steht dort `0.0.0.0:11434` oder `*:11434`, ist Ollama aus dem Netz erreichbar, ohne Anmeldung. Am Referenzgerät hört Ollama aktuell auf allen Schnittstellen (`OLLAMA_HOST=0.0.0.0`). Das ist ein bekannter offener Punkt des Betreibers. Er ist mit `ss -tlnp` belegt und von einem Rechner im selben Netz nachprüfbar. Was die Seite hier verlangt, erfüllt das Referenzgerät an dieser Stelle also noch nicht.",
      "Weitere Dienste auf dem Gerät: prüfe mit `ss -tlnp`. Sie gehören nicht zum Labor und fallen in deine eigene Absicherung.",
     ],
     code: [{titel: "Lauschende Ports und Prozesse", text: "ss -tlnp"}, {titel: "Nur Ollama: Hört es auf 127.0.0.1?", text: "ss -tlnp | grep 11434"}],
     tabelle: {
      beschriftung: "Ports des Labors",
      kopf: ["Port", "Dienst", "Erwartung"],
      zeilen: [
       ["8443/TCP", "Labor (uvicorn, HTTPS)", "Hört auf allen Schnittstellen, nicht im Router weiterleiten"],
       ["11434/TCP", "Ollama", "Soll: nur 127.0.0.1 (Standard von Ollama). Am Referenzgerät aktuell auf allen Schnittstellen, offener Punkt des Betreibers. Prüfen mit ss -tlnp"],
       ["Tunnel", "cloudflared, nur öffentlicher Betrieb", "Ausgehende Verbindung, keine Portfreigabe"],
      ]},
     merke: "Prüfe mit ss -tlnp, dass 11434 nur auf 127.0.0.1 hört. Am Referenzgerät tut es das noch nicht."},
    {h: "Der öffentliche Weg: Proxy-Server und Cloudflare", offen: true,
     kurz: "Im öffentlichen Betrieb laufen Eingaben über einen Proxy-Server (nginx) und den Tunnel von Cloudflare. Dort endet die Verschlüsselung. HSTS und Indexierung gibt es nur mit OEFFENTLICH=1.",
     p: [
      "Besucher erreichen das Labor nicht direkt. Der Weg läuft über einen nginx-Proxy auf einem Server im Netz des Betreibers und den Tunneldienst von Cloudflare zum Jetson (Skizze: {{architektur|Wie das Labor aufgebaut ist}}). Wie bei jedem Proxy und Tunneldienst endet die Verschlüsselung bei den Vermittlern. Sie sehen den Datenverkehr, der Jetson speichert die Eingaben nicht. Wer das Labor im Firmenbetrieb nutzt, nimmt die beiden Vermittler in seine Risikobewertung auf. Die Seite {{sicherheit-einfach|Ist das sicher?}} nennt sie in einfacher Sprache.",
      "**HSTS und Indexierung am Gerät:** Der Dienst setzt `Strict-Transport-Security` und `index, follow` nur im öffentlichen Modus (`OEFFENTLICH=1`). Das Referenzgerät läuft im öffentlichen Modus, deshalb sendet auch der LAN-Port 8443 diese Köpfe. Das schadet im Heimnetz nicht: Browser ignorieren HSTS bei einem Zertifikatsfehler, wie ihn das selbstsignierte Zertifikat auslöst. Ein Nachbau im reinen Heimnetz startet ohne `OEFFENTLICH=1` und sendet beides nicht.",
     ]},
    {h: "Datenort", offen: true,
     kurz: "Alles liegt auf dem Jetson. Sitzungen und Eingaben im Arbeitsspeicher, keine Datenbank. Modelle auf der SSD.",
     p: [
      "Das Labor und seine Modelle liegen auf dem Jetson, die Modelle auf der SSD. Sitzungen (Anlern-Beispiele, RAG-Texte) leben im Arbeitsspeicher und verfallen nach 30 Minuten Ruhe (`SITZUNG_TTL_S`, Standard 1800 Sekunden). Es gibt keine Datenbank. Kamerabilder und Aufnahmen werden nicht gespeichert. Nach einem Neustart des Dienstes sind alle Sitzungen weg.",
      "**Backup:** Für Nutzerdaten ist keines nötig, denn es gibt keine Datenbank und nichts wird dauerhaft gespeichert. Sichere nur, was du selbst angepasst hast, zum Beispiel die Dienstdatei und die Umgebungsdatei.",
     ]},
    {h: "Logs", offen: true,
     kurz: "Das Zugriffsprotokoll von uvicorn steht im Journal: Adresse der Gegenstelle, Methode, Pfad, Status. Eingabetexte stehen nicht darin.",
     p: [
      "Der Dienst läuft als systemd-Benutzerdienst. Die Anleitung nennt `journalctl --user -u jetson-showcase`. Auf dem Referenzgerät zeigt dieser Befehl nichts an, dort funktioniert die Abfrage über die Einheit (Benutzer in der Gruppe `adm`). Beide Befehle stehen unten.",
      "Geloggt wird das Zugriffsprotokoll von uvicorn: je Anfrage die Adresse der Gegenstelle mit Port, Methode, Pfad und Status, zum Beispiel `GET /api/stats 200 OK`. Bei Zugriff über einen Vermittler steht dessen Adresse darin. Eingegebene Texte stehen in Anfragen, die per POST gesendet werden, und nicht in der Adresse, deshalb erscheinen sie nicht im Protokoll. Außer einer Meldung beim Start (geladene Module) schreibt die App selbst nichts ins Log. Internetadressen sind personenbezogene Daten. Prüfe mit deiner Datenschutzstelle, ob und wie lange du sie aufbewahren darfst.",
     ],
     code: [
      {titel: "Letzte 50 Zeilen (Anleitung)", text: "journalctl --user -u jetson-showcase -n 50 --no-pager"},
      {titel: "Dasselbe über die Einheit (Referenzgerät)", text: "journalctl _SYSTEMD_USER_UNIT=jetson-showcase.service -n 50 --no-pager"},
      {titel: "Speicherbedarf des Journals", text: "journalctl --disk-usage"},
     ]},
    {h: "Aufbewahrung", offen: true,
     kurz: "Eine feste Frist ist nicht eingestellt. Auf dem Referenzgerät liegt das Journal im Arbeitsspeicher und ist nach einem Neustart weg. Die Frist legt der Betreiber fest.",
     p: [
      "Auf dem Referenzgerät gilt die Voreinstellung von journald (`Storage=auto`, keine Einträge in `/etc/systemd/journald.conf`). Es gibt dort kein Verzeichnis `/var/log/journal`, das Journal liegt unter `/run/log/journal` im Arbeitsspeicher und ist nach einem Neustart weg. Am 22.11.2026 belegte es 141,3 MB. Eine feste Aufbewahrungsfrist ist nicht eingestellt.",
      "Wie lange Logs liegen bleiben sollen, legt der Betreiber fest. In `journald.conf` stellst du das mit `Storage`, `SystemMaxUse` und `MaxRetentionSec` ein (man journald.conf).",
     ]},
    {h: "Schutzmaßnahmen der App", offen: true,
     kurz: "Origin-Prüfung, Erlaubnisliste für Hostnamen, Ratenbegrenzung im öffentlichen Betrieb, Einwilligung vor Kamera und Mikrofon, keine Speicherung, Sicherheitsköpfe.",
     p: [
      "Die App schützt sich an mehreren Stellen (app/app.py, app/sicherheit.py, docs/veroeffentlichung.md):",
     ],
     liste: [
      "**Origin-Prüfung:** Zustandsändernde Anfragen (POST, WebSocket) verlangen einen Origin, der zum Host passt. Fehlt er, wird abgelehnt.",
      "**Host-Erlaubnisliste:** Nur eigene Adressen und Namen sind zugelassen, weitere über `SHOWCASE_ALLOWED_HOSTS`. Das schützt vor DNS-Rebinding. Andernfalls erscheint „Invalid host header“.",
      "**Ratenbegrenzung:** Mit `OEFFENTLICH=1` gilt eine Begrenzung je Besucher. Höchstens 2 Sprachmodell-Antworten laufen gleichzeitig (Chat, RAG-Frage, Agent). Dahinter warten bis zu 6 Besucher höchstens 90 Sekunden, weitere bekommen sofort „ausgelastet“. Bei mehr als 6 gleichzeitigen Kameraverbindungen wird die nächste abgewiesen.",
      "**Modell-Erlaubnisliste:** Nur `llama3.2:3b` und `nomic-embed-text` lassen sich über die App laden. Was Ollama auf dem Gerät sonst noch installiert hat, kann in der Modellliste der App auftauchen, laden lässt es sich darüber nicht.",
      "**Einwilligung und keine Speicherung:** Kamera und Mikrofon starten erst nach Zustimmung, Bilder und Aufnahmen werden nicht gespeichert.",
      "**Sicherheitsköpfe:** Jede Antwort trägt `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, eine Content-Security-Policy, `Referrer-Policy` und `Permissions-Policy`. `Strict-Transport-Security` kommt nur im öffentlichen Betrieb (`OEFFENTLICH=1`) über HTTPS dazu, weil es im Heimnetz mit selbstsigniertem Zertifikat Besucher aussperren würde. Am Referenzgerät, das im öffentlichen Modus läuft, ist der Kopf auch im LAN zu sehen.",
      "**API-Dokumentation:** `/docs`, `/redoc` und `/openapi.json` sind aus. Nur im Heimnetz lassen sie sich mit `KL_API_DOKU=1` einschalten, im öffentlichen Betrieb nie.",
     ]},
    {h: "Was du für den Firmenbetrieb ergänzt", offen: true,
     kurz: "Die App bringt keinen Reverse-Proxy und keine Anmeldung mit. Für ein Firmennetz sind Zugriffsbeschränkung, Anmeldung und eine Aufbewahrungsregel Sache des Betreibers.",
     p: [
      "Der Dienst bindet selbst an `0.0.0.0:8443` mit selbstsigniertem Zertifikat. Es gibt keinen Reverse-Proxy und keine Nutzerverwaltung. Beschränke den Zugriff im Netz (Firewall, VLAN) oder setze einen Proxy mit Anmeldung davor. Lege Aufbewahrung der Logs, Zuständigkeiten und Updates fest. Wer wie das Referenzgerät öffentlich über einen Proxy-Server und Cloudflare erreichbar ist, nimmt diese Vermittler in die Risikobewertung auf (siehe „Der öffentliche Weg“). Die Lizenz des Codes ist noch nicht festgelegt, siehe {{selbst-bauen|Selbst aufbauen}}.",
     ]},
    {h: "Updates", offen: true,
     kurz: "Repo aktualisieren, setup.sh ausführen, Dienst neu starten. Ein Neustart beendet laufende Chats.",
     p: [
      "Der Ablauf steht in docs/selbst-aufbauen.md. Ein Neustart beendet laufende Chats und Verbindungen. Prüfe danach mit `scripts/check.sh`.",
     ],
     code: [{titel: "Update", text: "cd ~/jetson-ai-showcase\ngit pull\nbash scripts/setup.sh\nsystemctl --user restart jetson-showcase\nbash scripts/check.sh"}]},
  ],
  mitnehmen: [
    "Nur ein Gerät ist getestet. Prüfe jede Angabe auf deinem Gerät.",
    "Nach außen braucht das Labor nur 8443. Ollama soll nur lokal hören (prüfen mit ss -tlnp), am Referenzgerät hört es aktuell auf allen Schnittstellen.",
    "Daten bleiben auf dem Jetson, im Journal stehen Adresse, Pfad und Status. Die Aufbewahrung legt der Betreiber fest.",
  ],
  grenzen: ["Beschreibt den Code im Repo und das Referenzgerät am 22.11.2026, kein Sicherheitsgutachten und keine Rechtsberatung."],
  weiter: ["architektur", "selbst-bauen", "hardware", "lizenzen", "sicherheit-einfach"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "KI im Betrieb", seiten: ["betrieb-entscheidung", "kamera-grenzen"] }, { name: "Der Rechner dahinter", seiten: ["betrieb-sicherheit"] }],
});
})();
