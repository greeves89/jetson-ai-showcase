/* Seiten "KI für Schulen: Was gibt es und wie fange ich an?" und "In 7 Schritten starten" (Gruppe "Für die Schule").
   Neutrale Orientierung. Preise und Förderstände stehen nur mit Quelle und Abrufdatum (22.11.2026) im Abschnitt "Quellen und Stand";
   was nicht belegt werden konnte, steht als "Preis auf Anfrage beim Anbieter" oder "Stand beim Schulträger erfragen".
   Kein Rechtsrat. Keine Produktempfehlung. Keine Kunden-, Schul- oder Personennamen. */
(function () {

const S = {};

S["ki-schule-ueberblick"] = {
  nav: "KI für Schulen: Überblick", typ: "lektion", gruppe: "Für die Schule", titel: "KI für Schulen: Was gibt es und wie fange ich an?", symbol: "school",
  kurz: "Welche Wege es gibt, KI an einer Schule einzusetzen, was sie grob kosten, wo ihre Grenzen liegen und worauf Sie beim Kauf achten.",
  zusammenfassung: "Orientierung für Lehrkräfte, Schulleitungen, Eltern und Schulträger: vier Wege zu KI an Schulen (Angebote der Länder, kommerzielle Bildungsangebote, Selbstbetrieb auf eigener Hardware, Fortbildung), ein Kriterien-Check für den Kauf und der belegte Stand der Förderung. Mit Quellen und Abrufdatum 22.11.2026. Kein Rechtsrat.",
  lernziele: [
    "Sie kennen die vier Wege, KI an einer Schule einzusetzen, und ihre Vor- und Nachteile.",
    "Sie wissen, welche Fragen Sie vor einem Kauf stellen (Datenschutz, Alter, Kosten, Ausstieg).",
    "Sie wissen, wo Sie den aktuellen Stand zu Förderung und Preisen erfragen."
  ],
  abschnitte: [
    {h: "Vier Wege auf einen Blick",
     kurz: "Land, Kaufangebot, Eigenbetrieb, Fortbildung: Die Wege schließen sich nicht aus und lassen sich kombinieren.",
     visual: {typ: "raster", spalten: 2, zellen: [
      {icon: "landmark", text: "Angebot des Landes", sub: "meist kostenfrei für Schulen"},
      {icon: "building-2", text: "Kaufangebot", sub: "Lizenz bei einem Anbieter"},
      {icon: "server", text: "Selbstbetrieb", sub: "eigene Hardware, offene Software"},
      {icon: "graduation-cap", text: "Fortbildung", sub: "Wissen für das Kollegium"}]},
     p: [
      "KI an der Schule heißt meist: ein Chatprogramm, das Texte schreibt, erklärt und Aufgaben vorschlägt. Die Frage ist, wer es betreibt und wer die Daten verantwortet.",
      "Diese Seite ordnet die Wege neutral. Sie nennt Anbieter nur, wenn es dafür eine Quelle gibt, und Preise nur mit Quelle und Datum. Ohne Beleg steht dort \"Preis auf Anfrage beim Anbieter\". Eine Empfehlung für ein Produkt gibt diese Seite nicht."
     ],
     alltag: "Es ist wie bei der Schulverpflegung. Das Land kann ein Angebot bereitstellen, ein Caterer kann liefern, oder die Schule kocht selbst. Alle drei Wege können gut sein. Sie unterscheiden sich in Kosten, Aufwand und darin, wer die Verantwortung trägt."},

    {h: "Weg 1: Angebote der Länder",
     kurz: "Mehrere Länder stellen Schulen einen KI-Assistenten bereit, der für die Schule kostenfrei ist. Der Stand unterscheidet sich je Land.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "landmark", text: "Länder", sub: "beauftragen"},
      {icon: "building-2", text: "Betreiber", sub: "entwickelt und betreibt"},
      {icon: "school", text: "Schulleitung", sub: "schaltet frei"},
      {icon: "users", text: "Lehrkräfte", sub: "nutzen und geben frei"}]},
     p: [
      "Der KI-Chatbot \"telli\" wurde im Auftrag der Länder vom FWU (Institut für Film und Bild) entwickelt. Seit Mai 2026 heißt er \"AIS.chat\", das FWU nennt markenrechtliche Gründe. Laut Schulministerium NRW ändert sich nur der Name, Funktionen und Nutzerdaten bleiben. Ihre Landesseiten können noch den alten Namen nennen.",
      "Belegt ist: Baden-Württemberg stellt ihn seit dem 13. Oktober 2025 allen Schulen bereit, Nordrhein-Westfalen seit Dezember 2025, Bayern seit Dezember 2025. Bayern ergänzt KI-Funktionen in der Lernplattform ByCS. Für Schulen ist die Nutzung nach den Angaben von Nordrhein-Westfalen und Bayern kostenfrei.",
      "Zum Datenschutz sagen die Länder: Eingaben werden nicht zum Training der Modelle genutzt. Nordrhein-Westfalen nennt Betrieb der Modelle in der EU und eine pseudonymisierte Anmeldung über den Dienst VIDIS. Personenbezogene Daten gehören trotzdem nicht in die Eingabe. Die Schulleitung muss die Schule registrieren und den Auftragsverarbeitungsvertrag annehmen. Schülerinnen und Schüler nutzen den Dienst erst, wenn die Lehrkraft sie freigeschaltet hat.",
      "Kritik gibt es auch. Ein Verband privater Bildungsanbieter (EdTech-Verband) wirft dem staatlichen Angebot Wettbewerbsverzerrung und fehlende Kostentransparenz vor. Er warnt außerdem vor einem zentralen Dienst als einzigem Ausfallpunkt (Bericht vom 10. Mai 2026). Das ist die Sicht des Verbands, keine Feststellung."
     ],
     merke: "Fragen Sie zuerst Ihre Schulaufsicht oder Ihren Schulträger, ob Ihr Land schon ein Angebot hat. Es kostet die Schule meist nichts.",
     tabelle: {beschriftung: "Länderangebote, belegter Stand (Quellen unten)", kopf: ["Land", "Was", "Beleg"],
      zeilen: [
       ["Baden-Württemberg", "Chatbot für alle Schulen über SCHULE@BW, Freischaltung durch die Schulleitung, Start 13.10.2025", "Landesregierung, 13.10.2025"],
       ["Nordrhein-Westfalen", "Chatbot für Lehrkräfte, Schüler nach Freischaltung, kostenfrei, Start ab 05.12.2025", "Schulministerium, 04.12.2025"],
       ["Bayern", "KI-Funktionen in ByCS und Chatbot, kostenfrei, ab Dezember 2025", "Kultusministerium, 28.11.2025"],
       ["Andere Länder", "Stand je Land verschieden, Berichte nennen weitere Länder. Bitte beim Land oder Schulträger erfragen.", "Siehe Quellen"]]}},

    {h: "Weg 2: Kommerzielle Bildungsangebote",
     kurz: "Große und spezialisierte Anbieter haben Schul- und Bildungsvarianten. Lizenz, Altersgrenze und Datenschutz unterscheiden sich stark.",
     visual: {typ: "raster", spalten: 2, zellen: [
      {icon: "users", text: "Microsoft Copilot Chat", sub: "für Schüler ab 13, in Bildungslizenzen"},
      {icon: "globe", text: "Gemini (Google)", sub: "in Workspace for Education, jedes Alter"},
      {icon: "file-text", text: "ChatGPT for Teachers", sub: "nur US-Lehrkräfte, nicht für Schüler"},
      {icon: "school", text: "Fobizz", sub: "Anbieter für Schulen, Preis auf Anfrage"}]},
     p: [
      "**Microsoft Copilot Chat.** Laut Microsoft (August 2025) ist er für Schülerinnen und Schüler ab 13 Jahren verfügbar und als Chat ohne Zusatzkosten Teil von Microsoft 365 für Bildungseinrichtungen. Die Administration muss die Altersgruppe der Konten setzen. Nach Microsoft werden Eingaben nicht zum Training der Basismodelle genutzt. Ein Nutzerbericht von 2026 nennt einen noch laufenden Rollout in Europa. Eine kostenpflichtige Vollversion gibt es zusätzlich, Preis auf Anfrage beim Anbieter.",
      "**Gemini von Google.** Laut Google-Hilfe sind Gemini und NotebookLM in allen Workspace-for-Education-Versionen ohne Zusatzkosten enthalten und für Nutzer jeden Alters verfügbar. Für Nutzer unter 18 gelten strengere Inhaltsrichtlinien. Daten werden laut Google nicht manuell geprüft und nicht zum Training genutzt. Die Administration steuert den Zugriff.",
      "**ChatGPT (OpenAI).** \"ChatGPT for Teachers\" gilt laut OpenAI nur für verifizierte Lehrkräfte an US-amerikanischen Schulen, ist bis Juni 2028 kostenlos und \"nicht für Schüler:innen vorgesehen\". Für deutsche Schulen ist es also kein Angebot. Zu \"ChatGPT Edu\" konnten wir keine belastbaren Bedingungen für Schulen belegen: Preis, Altersgrenze und Datenschutz bitte direkt erfragen.",
      "**Fobizz.** Ein deutscher Anbieter mit Fortbildungen und KI-Werkzeugen für Lehrkräfte. Eine aktuelle Preisliste konnten wir nicht belegen: Preis auf Anfrage beim Anbieter. Der Anbieter veröffentlicht Vertragsunterlagen zur Auftragsverarbeitung, deren Inhalt Ihre Datenschutzbeauftragte prüfen sollte.",
      "Weitere Anbieter gibt es. Diese Seite zählt nur auf, was wir an der Quelle prüfen konnten. Sie ist keine Marktübersicht."
     ],
     merke: "Gratis in einer Bildungslizenz heißt nicht automatisch: freigegeben. Altersgrenze, Auftragsverarbeitung und Einwilligungen klärt die Schule trotzdem selbst."},

    {h: "Weg 3: Selbstbetrieb auf eigener Hardware",
     kurz: "Lokale Modelle auf Mini-PC, Jetson oder Schulserver: Die Daten bleiben im Haus, aber Betrieb und Qualität liegen bei Ihnen.",
     visual: {typ: "vergleich",
      links: {titel: "Vorteile", icon: "circle-check", farbe: "gruen", punkte: ["Daten bleiben im eigenen Netz", "Läuft auch ohne Internet", "Keine Lizenz je Nutzer", "Technik zum Anfassen für den Unterricht"]},
      rechts: {titel: "Grenzen", icon: "shield-alert", farbe: "orange", punkte: ["Nur kleine Modelle auf kleiner Hardware", "Antworten oft schwächer als bei großen Diensten", "Wartung, Updates, Konten bei Ihnen", "Verantwortung für Datenschutz bleibt bei der Schule"]},
      urteil: "Lohnt sich vor allem als Lernprojekt oder bei strengen Datenschutzvorgaben."},
     p: [
      "Offene Software wie Ollama und Open WebUI betreibt lokale Sprachmodelle mit Chatoberfläche. Hochschulen setzen Open WebUI schon ein, etwa die Universitäten Jena und Freiburg (jeweils eigene Dokumentation). Belastbare Erfahrungsberichte aus Schulen konnten wir nicht finden.",
      "Zur Hardware: Der NVIDIA Jetson Orin Nano Super Developer Kit, wie er im KI-Labor läuft, kostete bei der Vorstellung im Dezember 2024 laut NVIDIA 249 US-Dollar. Händlerpreise in Euro, Lieferbarkeit und Preisänderungen konnten wir nicht prüfen. Das Gerät schafft kleine Modelle. Große Klassen gleichzeitig bedienen oder die Qualität großer Dienste erreichen kann es nicht. Mini-PC und Schulserver bieten mehr Leistung, kosten aber auch mehr. Preis: Angebot beim Händler einholen.",
      "Wichtig: Lokal heißt nicht automatisch datenschutzkonform. Konten, Protokolle, Updates und Netzwerkverbindungen der Software müssen Sie prüfen. Und jemand muss das System dauerhaft pflegen, auch in den Ferien und bei Sicherheitslücken."
     ],
     alltag: "Selbst kochen gibt Ihnen die Kontrolle über die Zutaten. Es verlangt aber Küche, Zeit und jemanden, der putzt. Ob sich das für 30 oder für 600 Essen lohnt, ist eine Rechenfrage."},

    {h: "Weg 4: Fortbildung und Beratung",
     kurz: "Wissen entscheidet, ob KI im Unterricht hilft. Fortbildungen und Beratung gibt es von verschiedenen Anbietern.",
     p: [
      "Fortbildungen und Beratung bieten Landesinstitute, Medienzentren, freie Träger und Firmen an. Fragen Sie zuerst Ihr Land: Nordrhein-Westfalen verlangt etwa einen KI-Selbstlernkurs, bevor Lehrkräfte den Landes-Chatbot nutzen, und kündigte kostenlose Schulungen an (Stand der Quelle: 04.12.2025).",
      "Preise für Fortbildungen sind sehr verschieden: Preis auf Anfrage beim jeweiligen Anbieter. Achten Sie auf Praxisnähe, Datenschutzanteil und darauf, ob Ihre Schule danach selbstständig weitermachen kann."
     ]},

    {h: "Die Wege im Vergleich",
     kurz: "Kosten, Aufwand und Datenkontrolle unterscheiden sich. Die Tabelle zeigt die Tendenz, nicht jeden Einzelfall.",
     visual: {typ: "matrix", x: ["Angebot des Landes", "Kaufangebot", "Selbstbetrieb"], y: ["Kosten", "Aufwand", "Datenkontrolle"],
      zellen: [
       [{text: "meist kostenfrei", ton: "gut"}, {text: "Lizenz oder inklusive", ton: "neutral"}, {text: "Gerät plus Zeit", ton: "neutral"}],
       [{text: "gering", ton: "gut"}, {text: "mittel", ton: "neutral"}, {text: "hoch", ton: "schlecht"}],
       [{text: "Vertrag über Land", ton: "neutral"}, {text: "Vertrag prüfen", ton: "neutral"}, {text: "im Haus, Pflicht bei Ihnen", ton: "gut"}]]},
     p: [
      "Die meisten Schulen starten mit dem Weg 1 oder einem Angebot, das ihr Schulträger schon lizenziert hat. Selbstbetrieb passt, wenn eine technikbegeisterte Person das Projekt dauerhaft trägt oder Daten das Haus nicht verlassen dürfen."
     ]},

    {h: "Förderung: Was belegt ist",
     kurz: "DigitalPakt 2.0 ist beschlossen. KI ist darin kein eigener Fördergegenstand. Den Stand für Ihre Schule kennt der Schulträger.",
     visual: {typ: "zahlen", kacheln: [
      {wert: "5 Mrd. €", label: "Volumen, je zur Hälfte Bund und Länder", icon: "coins"},
      {wert: "5 Jahre", label: "Laufzeit", icon: "calendar"},
      {wert: "1.1.2026", label: "Inkrafttreten, rückwirkend", icon: "file-signature"}]},
     p: [
      "Nach der Meldung des Bundesbildungsministeriums vom 19. August 2026 hat der DigitalPakt 2.0 ein Volumen von 5 Milliarden Euro, je zur Hälfte von Bund und Ländern, über fünf Jahre. Die Vereinbarung gilt rückwirkend ab 1. Januar 2026. Förderfähig sind laut Meldung unter anderem mobile Endgeräte, Schulnetzwerke, WLAN, Schulserver, digitale Ausstattung von Unterrichtsräumen und Lehr- und Lernplattformen.",
      "KI ist dort kein eigener Fördergegenstand. Sie wird nur im Zusammenhang mit der Fortbildung von Lehrkräften genannt. Ob und wie Ihre Schule Mittel abrufen kann, regeln die Länder. Aktuellen Stand beim Schulträger erfragen.",
      "Beispiel Bayern: Das Medien- und KI-Budget gibt es je Schülerin und Schüler für die Jahre 2024 bis 2026, je nach Schulart in unterschiedlicher Höhe. Antragsberechtigt sind die Schulaufwandsträger. Die Antragsfrist für 2026 lief bis 31. Oktober 2026. Ab 2027 soll das Budget laut Kultusministerium in den Zuschuss zur schulischen IT-Infrastruktur übergehen. Fragen Sie Ihren Schulträger nach dem aktuellen Stand."
     ]},

    {h: "Worauf achten beim Kauf",
     kurz: "Neun Fragen, die Sie jedem Anbieter schriftlich stellen. Fehlt eine Antwort, ist das selbst eine Antwort.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "file-signature", text: "Auftragsverarbeitung", sub: "Vertrag liegt vor"},
      {icon: "map-pin", text: "Serverstandort", sub: "EU, wo genau"},
      {icon: "users", text: "Alter unter 16", sub: "Zugang und Einwilligung"},
      {icon: "database", text: "Trainingsdaten", sub: "Eingaben fürs Training?"},
      {icon: "coins", text: "Kosten 3 Jahre", sub: "mit allen Zusatzposten"},
      {icon: "headset", text: "Support", sub: "wer hilft, wie schnell"},
      {icon: "refresh-cw", text: "Ausstieg", sub: "Daten raus, Vertrag kündbar"},
      {icon: "ear", text: "Barrierefreiheit", sub: "Bedienung für alle"},
      {icon: "wifi-off", text: "Offline-Betrieb", sub: "geht es ohne Internet"}]},
     p: [
      "**Datenschutz und Auftragsverarbeitung.** Gibt es einen Vertrag nach Art. 28 DSGVO? Prüft ihn Ihre Datenschutzbeauftragte? **Serverstandort.** In der EU? Werden Daten an Unterauftragnehmer in Drittländern gegeben?",
      "**Alterszugang unter 16.** Welche Altersgrenze setzt der Anbieter? Reicht sie für Ihre Klassen? Wer holt Einwilligungen ein? **Trainingsdaten.** Werden Eingaben zum Training genutzt? Lässt sich das abschalten oder ist es vertraglich ausgeschlossen?",
      "**Kosten über 3 Jahre.** Lizenz je Nutzer, Einrichtung, Schulung, Preisanpassung, Hardware, Arbeitszeit der Administration. **Support.** Ansprechperson, Reaktionszeit, Sprache. **Ausstiegsmöglichkeit.** Können Sie Daten exportieren und kündigen, ohne Chats und Material zu verlieren?",
      "**Barrierefreiheit.** Bedienbarkeit mit Screenreader und Tastatur, einfache Sprache, Vorlesefunktion. **Offline-Betrieb.** Wichtig bei schlechtem Netz oder strengen Vorgaben. Ohne Internet laufen nur lokale Lösungen."
     ],
     merke: "Verlassen Sie sich nicht auf Werbetext. Lassen Sie sich jede Antwort schriftlich geben und von der Datenschutzbeauftragten prüfen."},

    {h: "Quellen und Stand",
     kurz: "Alle Angaben mit Quelle. Abgerufen am 22.11.2026. Preise und Fristen ändern sich, prüfen Sie vor einer Entscheidung neu.",
     liste: [
      "DigitalPakt 2.0, Bundesbildungsministerium, Meldung vom 19.08.2026: bmbfsfj.bund.de/bmbfsfj/aktuelles/pressemitteilungen/digitalpakt-2-0-startet-am-1-september-293650 (abgerufen 22.11.2026)",
      "telli in Nordrhein-Westfalen, Schulministerium, 04.12.2025: schulministerium.nrw/04122025-bereitstellung-des-laendergemeinsamen-ki-chatbots-telli (abgerufen 22.11.2026)",
      "Umbenennung in AIS.chat, FWU, Pressemitteilung vom 07.05.2026: fwu.de/wp-content/uploads/2026/05/PM-Aus-tellli-wird-AIS.chat_.pdf, und Schulministerium NRW: schulministerium.nrw/18052026-umbenennung-des-laendergemeinsamen-ki-chatbotstelli-wird-aischat (Schulministerium gelesen, FWU-Meldung nur über Suchergebnis, abgerufen 22.11.2026)",
      "KI für alle in Bayern, Kultusministerium, Pressemitteilung vom 28.11.2025: km.bayern.de/meldung/ki-fuer-alle-bayern-stellt-neue-ki-systeme-fuer-alle-schulen-bereit (abgerufen 22.11.2026)",
      "Medien- und KI-Budget Bayern: km.bayern.de/gestalten/foerderprogramme/medien-und-ki-budget, Budget 2024 bis 2026, Antragsfrist 2026 bis 31.10.2026, Übergang ab 2027 laut Kultusministerium (gelesen, abgerufen 22.11.2026)",
      "KI-Chatbot für Schulen in Baden-Württemberg, Landesregierung, 13.10.2025: baden-wuerttemberg.de/de/service/presse/pressemitteilung/pid/ki-chatbot-fuer-schulen-geht-an-den-start-1 (abgerufen 22.11.2026)",
      "Kritik des EdTech-Verbands, news4teachers.de, 10.05.2026: news4teachers.de/2026/05/edtech-verband-greift-staatlichen-ki-chatbot-telli-scharf-an-wettbewerbsverzerrung-zu-lasten-der-unternehmen-und-schulen/ (abgerufen 22.11.2026)",
      "Microsoft 365 Copilot Chat für Schüler ab 13, Microsoft Tech Community, 06.08.2025, aktualisiert 21.08.2025: techcommunity.microsoft.com/blog/educationblog/microsoft-365-copilot-chat-for-students-13/4440370 (abgerufen 22.11.2026)",
      "Gemini und NotebookLM für Bildungseinrichtungen, Google-Hilfe: knowledge.workspace.google.com/admin/getting-started/editions/quickstart-guide-to-gemini-and-gemini-notebook-for-education (abgerufen 22.11.2026)",
      "ChatGPT for Teachers, OpenAI-Hilfe: help.openai.com/de-de/articles/12844995-chatgpt-for-teachers (abgerufen 22.11.2026)",
      "Jetson Orin Nano Super, NVIDIA-Blog, Dezember 2024: blogs.nvidia.com/blog/jetson-generative-ai-supercomputer (abgerufen 22.11.2026)",
      "Open WebUI an der Universität Jena: uni-jena.de/en/425975/openwebui (nur über Suchergebnis geprüft, abgerufen 22.11.2026)",
      "Nicht belegt, daher ohne Zahl: aktuelle Preise von Fobizz, Microsoft Copilot (kostenpflichtig) und ChatGPT Edu, Altersgrenzen von ChatGPT Edu, Händlerpreise in Euro für Hardware, Förderbeträge je Schule."
     ]},

    {h: "Hinweis",
     kurz: "Diese Seite ist keine Rechtsberatung und keine Kaufempfehlung.",
     p: [
      "Die Seite gibt Überblick und Begriffe. Sie ersetzt keine Rechtsberatung und keine Prüfung durch Ihre Datenschutzbeauftragte, Ihre Schulleitung und Ihren Schulträger. Es gilt das Recht Ihres Landes. Der Stand ist der 22.11.2026. Angaben können sich seitdem geändert haben."
     ]}
  ],
  mitnehmen: [
    "Es gibt vier Wege: Angebot des Landes, Kaufangebot, Selbstbetrieb und Fortbildung. Sie lassen sich kombinieren.",
    "Fragen Sie zuerst Land und Schulträger. Länderangebote kosten die Schule meist nichts, und KI ist im DigitalPakt 2.0 kein eigener Fördergegenstand.",
    "Vor jedem Kauf: Auftragsverarbeitung, Standort, Alter, Trainingsdaten, Kosten über drei Jahre, Support, Ausstieg schriftlich klären."
  ],
  quiz: [
    {frage: "Ihre Schule will KI nutzen und hat kein Budget. Was ist der sinnvolle erste Schritt?",
     optionen: ["Beim Schulträger und Land nach einem bestehenden Angebot fragen", "Sofort eine Schullizenz bei einem Anbieter kaufen", "Einen eigenen Server beschaffen und selbst betreiben", "Warten, bis alle Eltern ausdrücklich zugestimmt haben"],
     richtig: 0, erklaerung: "Mehrere Länder stellen Schulen KI-Assistenten kostenfrei bereit. Das prüft man vor jedem Kauf und vor jedem Eigenbau."},
    {frage: "Was gilt für lokale Modelle auf eigener Hardware?",
     optionen: ["Sie sind automatisch datenschutzkonform und wartungsfrei", "Sie liefern immer bessere Antworten als große Dienste", "Daten bleiben im Haus, Betrieb und Qualität sind Ihre Aufgabe", "Sie brauchen keinen Vertrag und keine Datenschutzprüfung"],
     richtig: 2, erklaerung: "Lokal schützt vor Datenabfluss in die Cloud. Konten, Updates und Antwortqualität bleiben aber Aufgabe der Schule. Kleine Modelle sind meist schwächer."},
    {frage: "Was sagt die belegte Quelle zum DigitalPakt 2.0 und KI?",
     optionen: ["KI ist ein eigener Fördergegenstand mit festem Betrag", "KI wird nur im Zusammenhang mit Lehrkräftefortbildung genannt", "KI-Lizenzen sind ausdrücklich ausgeschlossen", "Die Förderung gilt nur für Schulen mit eigenem Server"],
     richtig: 1, erklaerung: "Laut Bundesmeldung vom 19.08.2026 ist KI kein eigener Fördergegenstand. Den Stand für Ihre Schule kennt der Schulträger."}
  ],
  weiter: ["ki-schule-einstieg", "schule-start", "schule-lehrkraefte", "schule-schulleitung", "schule-eltern", "selbst-bauen"]
};

S["ki-schule-einstieg"] = {
  nav: "In 7 Schritten starten", typ: "lektion", gruppe: "Für die Schule", titel: "KI an der Schule: In 7 Schritten starten", symbol: "school",
  kurz: "Von der Zielfrage bis zur Entscheidung: sieben Schritte, eine Checkliste und ein Zeitplan als Vorschlag.",
  zusammenfassung: "Sieben Schritte für den Start mit KI an einer Schule: Ziel klären, Schulleitung, Datenschutzbeauftragte und Schulträger einbinden, Rechtsgrundlage und Einwilligungen klären, kleine Pilotklasse, Lehrkräfte schulen, Regeln für Schüler, auswerten und entscheiden. Mit Checkliste und Zeitplan als Vorschlag. Kein Rechtsrat.",
  lernziele: [
    "Sie kennen die sieben Schritte und ihre Reihenfolge.",
    "Sie wissen, wen Sie wann einbinden müssen.",
    "Sie können mit der Checkliste prüfen, ob Ihre Schule bereit für den Start ist."
  ],
  abschnitte: [
    {h: "Der Weg im Überblick",
     kurz: "Sieben Schritte, klein anfangen, früh die richtigen Menschen einbinden, am Ende bewusst entscheiden.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "target", text: "1 Ziel", sub: "Fach, Aufgabe"},
      {icon: "users", text: "2 Einbinden", sub: "Leitung, Datenschutz, Träger"},
      {icon: "scale", text: "3 Recht", sub: "Grundlage, Einwilligung"},
      {icon: "flask-conical", text: "4 Pilot", sub: "eine Klasse"},
      {icon: "graduation-cap", text: "5 Schulung", sub: "Lehrkräfte"},
      {icon: "scroll-text", text: "6 Regeln", sub: "fair nutzen"},
      {icon: "circle-check", text: "7 Entscheiden", sub: "auswerten", farbe: "gruen"}]},
     p: [
      "Die Reihenfolge ist Absicht. Wer zuerst ein Werkzeug kauft und dann nach dem Ziel fragt, kauft oft das Falsche. Welche Werkzeuge es gibt, steht auf der Seite {{ki-schule-ueberblick|KI für Schulen: Was gibt es und wie fange ich an?}}."
     ]},

    {h: "Schritt 1 bis 3: Klären und absichern",
     kurz: "Zuerst Ziel, dann die richtigen Menschen, dann die rechtliche Grundlage. Erst danach kommen Kinder ins Spiel.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "target", text: "1 Ziel und Fach", sub: "eine konkrete Aufgabe"},
      {icon: "users", text: "2 Einbinden", sub: "Leitung, Datenschutz, Träger"},
      {icon: "scale", text: "3 Rechtsgrundlage", sub: "Einwilligungen klären"}]},
     p: [
      "**1. Ziel und Fach klären.** Was soll besser werden? Zum Beispiel: Texte überarbeiten in Deutsch, Aufgabenvarianten in Mathematik, Quellenprüfung in Gesellschaftslehre. Schreiben Sie ein Ziel in einem Satz auf. Ein Ziel wie \"wir wollen irgendwas mit KI\" trägt nicht.",
      "**2. Schulleitung, Datenschutzbeauftragte und Schulträger einbinden.** Die Schulleitung verantwortet den Einsatz. Die Datenschutzbeauftragte prüft Dienste und Verträge. Der Schulträger kennt vorhandene Lizenzen und mögliche Förderung. Die Seite {{schule-schulleitung|Info für die Schulleitung}} fasst zusammen, was die Leitung wissen sollte.",
      "**3. Rechtsgrundlage und Einwilligungen klären.** Für Dienste mit personenbezogenen Daten braucht die Schule eine Rechtsgrundlage nach Art. 6 DSGVO. Bei Einwilligungen Minderjähriger sind die Eltern beteiligt, die Schwelle liegt bei 16 Jahren (Art. 8 DSGVO). Dazu kommen Altersgrenzen der Anbieter und Landesvorgaben. Diese Seite ist keine Rechtsberatung: Entscheiden müssen Schule, Datenschutzbeauftragte und Schulaufsicht. Mehr für Eltern: {{schule-eltern|Info für Eltern}}."
     ],
     alltag: "Vor einer Klassenfahrt klärt man Ziel, Aufsicht und Einverständniserklärungen, bevor der Bus fährt. Bei KI ist es dasselbe, nur mit Datenschutz statt Busfahrplan."},

    {h: "Schritt 4 bis 5: Klein anfangen, Menschen befähigen",
     kurz: "Eine Pilotklasse mit einer kleinen Aufgabe, dazu eine Schulung für die beteiligten Lehrkräfte.",
     visual: {typ: "vergleich",
      links: {titel: "Pilotklasse", icon: "flask-conical", farbe: "akzent", punkte: ["eine Klasse, ein Fach", "eine kleine, klare Aufgabe", "ohne personenbezogene Eingaben", "Beobachtung durch die Lehrkraft"]},
      rechts: {titel: "Schulung", icon: "graduation-cap", farbe: "gruen", punkte: ["Wie funktioniert KI grob", "Fehler und Erfindungen erkennen", "Datenschutz im Alltag", "Ideen für den Unterricht"]}},
     p: [
      "**4. Pilotklasse und kleine Aufgabe.** Starten Sie klein: eine Klasse, ein Fach, wenige Stunden. Eine Aufgabe könnte sein, einen eigenen Text vom KI-Assistenten kritisch kommentieren zu lassen und die Hinweise zu bewerten. Geben Sie keine Namen und keine persönlichen Daten ein. Fertige Stunden für Klasse 8 finden Sie unter {{schule-start|KI in der Schule: Start}}.",
      "**5. Lehrkräfte schulen.** Wer KI im Unterricht einsetzt, muss ihre Fehler kennen: erfundene Quellen, Verzerrungen, selbstsichere Irrtümer. Nutzen Sie vorhandene Angebote Ihres Landes oder Schulträgers. Für den Einstieg hilft {{schule-lehrkraefte|Handreichung für Lehrkräfte}}."
     ]},

    {h: "Schritt 6 bis 7: Regeln und Entscheidung",
     kurz: "Klare Regeln für faire Nutzung, dann auswerten und bewusst entscheiden: weiter, anpassen oder lassen.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "scroll-text", text: "Regeln", sub: "mit der Klasse"},
      {icon: "search", text: "Beobachten", sub: "was hilft, was stört"},
      {icon: "clipboard-check", text: "Auswerten", sub: "Ziel erreicht?"},
      {icon: "circle-check", text: "Entscheiden", sub: "weiter, ändern, lassen", farbe: "gruen"}]},
     p: [
      "**6. Regeln für Schüler: fair nutzen.** Legen Sie mit der Klasse fest: Wofür ist KI erlaubt, wann muss ich sie angeben, was prüfe ich selbst nach, was gebe ich nie ein. Regeln, die Schüler mitgestalten, werden eher beachtet. Zum Fairplay bei Hausaufgaben gibt es Material im Strang Medienkompetenz.",
      "**7. Auswerten und entscheiden.** Nach dem Pilot fragen Sie: Wurde das Ziel aus Schritt 1 erreicht? Was sagen Lehrkräfte und Schüler? Gab es Datenschutzprobleme? Was kostet der Weiterbetrieb über drei Jahre? Danach gibt es drei ehrliche Antworten: ausweiten, anpassen oder aufhören. Aufhören ist ein gültiges Ergebnis."
     ],
     merke: "Ein Pilot, der nichts verändern darf, ist keiner. Planen Sie die Entscheidung vor dem Start ein."},

    {h: "Checkliste zum Abhaken",
     kurz: "Zehn Punkte. Wenn Sie sie alle mit Ja beantworten, sind Sie startklar.",
     liste: [
      "Wir haben ein Ziel in einem Satz aufgeschrieben (Fach, Aufgabe, Klasse).",
      "Die Schulleitung unterstützt das Vorhaben.",
      "Die Datenschutzbeauftragte hat den Dienst und den Vertrag geprüft.",
      "Der Schulträger ist informiert und hat Lizenzen und Förderung geprüft.",
      "Die Rechtsgrundlage ist geklärt, nötige Einwilligungen liegen vor.",
      "Die Altersgrenze des Anbieters passt zu unseren Klassen.",
      "Die Pilotklasse und die Aufgabe sind festgelegt.",
      "Die beteiligten Lehrkräfte sind geschult.",
      "Die Klasse hat Regeln für faire Nutzung vereinbart.",
      "Zeitpunkt und Kriterien für die Entscheidung stehen fest."
     ],
     p: [
      "Haken Sie diese Punkte im Kopf oder auf Papier ab. Die Seite speichert nichts."
     ]},

    {h: "Zeitplan: ein Vorschlag",
     kurz: "Rund ein Halbjahr vom Ziel bis zur Entscheidung. Passen Sie den Plan an Ihre Schule an.",
     visual: {typ: "zeitachse", punkte: [
      {t: "Wochen 1 bis 2", text: "Ziel klären, Leitung einbinden", icon: "target"},
      {t: "Wochen 3 bis 6", text: "Datenschutz und Recht klären", icon: "scale"},
      {t: "Wochen 7 bis 10", text: "Lehrkräfte schulen", icon: "graduation-cap"},
      {t: "Wochen 11 bis 18", text: "Pilot mit Regeln", icon: "flask-conical"},
      {t: "Wochen 19 bis 20", text: "Auswerten, entscheiden", icon: "circle-check"}]},
     p: [
      "Das ist ein Vorschlag, keine Vorgabe. Genehmigungen, Verträge und Schulungstermine dauern je nach Schulträger und Land länger. Planen Sie mit Puffern und beginnen Sie die Datenschutzprüfung früh."
     ]},

    {h: "Wo es weitergeht",
     kurz: "Hilfe für Lehrkräfte, Schulleitung und Eltern, dazu Hintergrund zu den Wegen und Preisen.",
     p: [
      "Fertige Stunden für den Unterricht: {{schule-start|KI in der Schule: Start}}. Praxis für Lehrkräfte: {{schule-lehrkraefte|Handreichung für Lehrkräfte}}. Für die Leitung: {{schule-schulleitung|Info für die Schulleitung}}. Für Eltern: {{schule-eltern|Info für Eltern}}. Wer selbst betreiben will: {{selbst-bauen|Selbst auf einem Jetson aufbauen}}. Die Wege, Kriterien und Quellen stehen auf {{ki-schule-ueberblick|KI für Schulen: Was gibt es und wie fange ich an?}}."
     ]},

    {h: "Hinweis",
     kurz: "Diese Seite ist keine Rechtsberatung.",
     p: [
      "Die Schritte sind eine Orientierung. Sie ersetzen keine Rechtsberatung und keine Entscheidung von Schulleitung, Datenschutzbeauftragter, Schulträger und Schulaufsicht. Es gilt das Recht Ihres Landes. Stand: 22.11.2026."
     ]}
  ],
  mitnehmen: [
    "Erst Ziel, dann Werkzeug: sieben Schritte vom Ziel bis zur Entscheidung.",
    "Binden Sie Schulleitung, Datenschutzbeauftragte und Schulträger früh ein, vor dem ersten Einsatz mit Kindern.",
    "Starten Sie mit einer Pilotklasse und planen Sie die Entscheidung (weiter, anpassen, lassen) von Anfang an ein."
  ],
  quiz: [
    {frage: "Womit beginnt der Einstieg laut den sieben Schritten?",
     optionen: ["Mit dem Kauf einer Schullizenz für alle", "Mit einem klaren Ziel für Fach und Aufgabe", "Mit der Freigabe für die ganze Schule", "Mit dem Aufbau eines eigenen Servers"],
     richtig: 1, erklaerung: "Das Ziel bestimmt, welches Werkzeug passt. Wer mit dem Kauf beginnt, kauft oft das Falsche."},
    {frage: "Warum startet man mit einer Pilotklasse?",
     optionen: ["Weil es für eine Klasse keine Datenschutzfragen gibt", "Weil große Klassen KI grundsätzlich nicht nutzen dürfen", "Weil das Land genau eine Klasse vorschreibt", "Weil man klein lernt, was hilft und was stört"],
     richtig: 3, erklaerung: "Ein kleiner Versuch zeigt Nutzen und Probleme, bevor viele Menschen und viel Geld beteiligt sind. Datenschutz bleibt auch im Pilot Pflicht."},
    {frage: "Was gehört zur Auswertung am Ende?",
     optionen: ["Ob das Ziel erreicht wurde und was der Betrieb über drei Jahre kostet", "Nur wie viele Schüler das Werkzeug ausprobiert haben", "Nur ob der Anbieter eine neue Version veröffentlicht hat", "Nur ob die Lehrkräfte den Dienst sympathisch finden"],
     richtig: 0, erklaerung: "Entscheidend sind Zielerreichung, Rückmeldungen, Datenschutz und die Kosten über mehrere Jahre."}
  ],
  weiter: ["ki-schule-ueberblick", "schule-start", "schule-lehrkraefte", "schule-schulleitung", "schule-eltern", "selbst-bauen"]
};

INHALT.registriere({ seiten: S, gruppen: [{ name: "Für die Schule", seiten: ["ki-schule-ueberblick", "ki-schule-einstieg"] }] });
})();
