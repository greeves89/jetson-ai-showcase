/* Seite "Falscher Anruf, Enkeltrick, Schockanruf": Schutz vor Telefonbetrug in einfacher Sprache.
   Aussagen aus Polizeilicher Kriminalprävention (polizei-beratung.de), Verbraucherzentrale und BSI, alle am 22.11.2026 abgerufen.
   Nur belegbare Aussagen zu KI-Stimmen. Keine Telefonnummern außer 110. Beispiele sind erfunden. */
window.INHALT.registriere({

gruppen: [{ name: "Medienkompetenz", seiten: ["falscher-anruf"] }],

seiten: {

"falscher-anruf": {
  nav: "Falscher Anruf", typ: "lektion", gruppe: "Medienkompetenz", titel: "Falscher Anruf, Enkeltrick, Schockanruf: so schützen Sie sich", symbol: "phone-call", rollen: ["erwachsene", "eltern"], anrede: "sie",
  kurz: "Auflegen, selbst zurückrufen, bei Verdacht die 110 wählen. Dazu ein Codewort in der Familie und was Sie über KI-Stimmen wissen müssen. Die Kurzfassung heißt „Betrug erkennen“.",
  zusammenfassung: "Bei einem verdächtigen Anruf mit Geldwunsch: erstens auflegen, zweitens die Person unter einer Nummer zurückrufen, die Sie selbst kennen, drittens bei Verdacht die Polizei unter 110 informieren. Ein Codewort in der Familie hilft. Laut BSI reichen für eine gefälschte Stimme mitunter wenige Sekunden Aufnahme.",
  lernziele: [
    "Sie können die drei Schritte nennen: auflegen, zurückrufen, bei Verdacht 110.",
    "Sie können Enkeltrick, Schockanruf und falschen Polizisten an ihrem Muster erkennen.",
    "Sie können erklären, warum eine vertraute Stimme am Telefon kein Beweis ist.",
  ],
  abschnitte: [
    {h: "Das Wichtigste in drei Schritten",
     kurz: "Erstens auflegen. Zweitens selbst zurückrufen, unter einer Nummer, die Sie kennen. Drittens bei Verdacht die Polizei unter 110 informieren.",
     visual: {typ: "ablauf", schritte: [
      {icon: "phone", text: "1. Auflegen", sub: "sofort, ohne Erklärung", farbe: "orange"},
      {icon: "phone-call", text: "2. Zurückrufen", sub: "unter einer Nummer, die Sie kennen"},
      {icon: "siren", text: "3. Polizei", sub: "bei Verdacht die 110 wählen", farbe: "gruen"}]},
     p: [
      "Die Polizei rät bei Schockanrufen, sofort aufzulegen. So gewinnen Sie Zeit zum Durchatmen. Das ist nicht unhöflich.",
      "Dann rufen Sie die Person selbst an, über eine Nummer, die Sie schon hatten. Nutzen Sie nicht die Wahlwiederholung und nicht die Nummer, die der Anrufer genannt hat. Die Nummer im Display kann gefälscht sein.",
      "Wenn Ihnen ein Anruf verdächtig vorkommt, wählen Sie die 110. Auch wenn Sie schon Geld oder Wertsachen hergegeben haben, gehen Sie zur Polizei und erstatten Anzeige. Das kann jedem passieren.",
     ],
     merke: "Auflegen. Selbst zurückrufen. Bei Verdacht 110. Nie Geld oder Wertsachen an Unbekannte geben."},
    {h: "Die Maschen: Enkeltrick, Schockanruf, falscher Polizist",
     kurz: "Alle drei arbeiten mit Druck und Angst. Die Täter wollen, dass Sie schnell handeln und mit niemandem sprechen.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "users", text: "Enkeltrick", sub: "angeblicher Verwandter braucht Bargeld"},
      {icon: "triangle-alert", text: "Schockanruf", sub: "angeblicher Unfall, Kaution"},
      {icon: "shield-check", text: "Falscher Polizist", sub: "Wertsachen sollen in Sicherheit"}]},
     p: [
      "Enkeltrick: Jemand gibt sich als Enkel, Verwandter oder Bekannter aus und bittet kurzfristig um Bargeld, zum Beispiel wegen eines Unfalls oder eines Kaufs. Oft kommt Zeitdruck dazu, manchmal rufen die Täter mehrmals an. Inzwischen schreiben sie auch über Messenger wie WhatsApp.",
      "Schockanruf: Eine erfundene dramatische Geschichte soll Sie erschrecken, damit Sie nicht mehr nachdenken. Falscher Polizist: Der Anrufer sagt, er sei von der Polizei, und will Geld oder Wertsachen angeblich in Sicherheit bringen.",
      "Dazu gilt: Die Polizei wird Sie niemals telefonisch bitten, Wertsachen herauszugeben. Das schreibt die Verbraucherzentrale.",
     ],
     tabelle: {
      beschriftung: "Woran Sie das Muster erkennen",
      kopf: ["Masche", "Das sagt der Anrufer", "Das tun Sie"],
      zeilen: [
        ["Enkeltrick", "Ich bin es, ich brauche dringend Geld.", "Auflegen und die Person unter ihrer bekannten Nummer anrufen"],
        ["Schockanruf", "Es ist etwas Schlimmes passiert, sofort zahlen.", "Auflegen, durchatmen, eine Vertrauensperson anrufen"],
        ["Falscher Polizist", "Wir bringen Ihre Wertsachen in Sicherheit.", "Nichts übergeben, auflegen, selbst die 110 wählen"],
      ]},
     alltag: "Ein Anrufer sagt: Oma, ich hatte einen Unfall, ich brauche heute noch 8.000 Euro, sag keinem etwas. Das Muster ist immer gleich: Eile, ein Geheimnis und Bargeld."},
    {h: "KI-Stimmen: Warum eine bekannte Stimme nichts beweist",
     kurz: "Eine Stimme lässt sich mit KI nachbauen. Laut BSI reichen mitunter wenige Sekunden Aufnahme. Darum zählt der Rückruf, nicht der Klang.",
     visual: {typ: "ablauf", schritte: [
      {icon: "mic", text: "Kurze Aufnahme", sub: "mitunter wenige Sekunden"},
      {icon: "bot", text: "KI baut die Stimme nach", sub: "klingt vertraut", farbe: "orange"},
      {icon: "phone-call", text: "Ihr Rückruf", sub: "klärt es, der Klang nicht", farbe: "gruen"}]},
     p: [
      "Mit künstlicher Intelligenz lassen sich Stimmen nachbauen. Laut BSI reichen dafür mitunter schon wenige Sekunden Stimmaufnahme, und Anrufe oder Audios von Bekannten können mithilfe von KI einfach und schnell gefälscht werden.",
      "Das BSI nennt mögliche Anzeichen: falsch ausgesprochene Wörter, eine ungewohnte Sprechweise oder Verzögerungen im Gespräch. Verlassen Sie sich nicht darauf. Eine gute Fälschung hat diese Fehler vielleicht nicht.",
      "Darum gilt dieselbe Regel wie immer: auflegen und zurückrufen. Sie können auch eine Frage stellen, die nur die echte Person beantworten kann, zum Beispiel zu einer privaten Erinnerung. Wie sich Fälschungen bei Bildern und Texten verhalten, steht auf der Seite {{echt-oder-ki|Echt oder KI?}}.",
     ],
     merke: "Die Stimme beweist nichts. Der Rückruf unter einer bekannten Nummer klärt es."},
    {h: "Das Familien-Codewort",
     kurz: "Vereinbaren Sie mit Familie und Freunden ein Kennwort. Wer anruft und in Not ist, nennt es. Wer es nicht kennt, ist nicht die Person.",
     visual: {typ: "kreis", mitte: "Codewort", knoten: [
      {icon: "users", text: "Gemeinsam wählen"}, {icon: "key-round", text: "Nur persönlich sagen"}, {icon: "ear", text: "Beim Anruf fragen"}, {icon: "phone", text: "Fehlt es: auflegen"}]},
     p: [
      "Die Polizei empfiehlt, mit Familie und Freunden ein Kennwort zur Identifizierung am Telefon zu vereinbaren. Das kostet nichts. Es funktioniert auch dann, wenn die Stimme täuschend echt klingt.",
      "Wählen Sie ein Wort, das niemand erraten kann und das nicht im Internet steht. Sagen Sie es sich persönlich, nicht per Nachricht. Alle in der Familie sollten es kennen, auch die Älteren. Wenn jemand in Not anruft und das Wort nicht kennt, legen Sie auf und rufen zurück.",
     ]},
    {h: "Wenn es schon passiert ist",
     kurz: "Nicht schämen. Sofort die Polizei informieren und Anzeige erstatten. Notieren Sie, was Sie noch wissen.",
     p: [
      "Wer auf solche Anrufe hereinfällt, ist nicht dumm. Die Täter sind geübt und bauen gezielt Druck auf. Wenden Sie sich bei einem Betrugsschaden in jedem Fall an die Polizei und erstatten Sie Anzeige.",
      "Die Verbraucherzentrale rät, Zeit, Name des Anrufers und genannte Kontodaten zu notieren und den Anruf zu melden, auch online. Wenn Sie Geld überwiesen haben, rufen Sie sofort Ihre Bank an. Sprechen Sie mit jemandem, dem Sie vertrauen, und warnen Sie Verwandte und Nachbarn.",
     ]},
    {h: "Checkliste: Das tue ich, wenn das Telefon klingelt",
     kurz: "Sechs Sätze zum Merken. Schreiben Sie sie auf einen Zettel neben das Telefon.",
     liste: [
      "Ich bleibe ruhig. Eile ist ein Warnzeichen.",
      "Ich gebe keine Zahlen, Namen oder Kontodaten am Telefon heraus.",
      "Ich lege auf, wenn es um Geld, Wertsachen oder ein Geheimnis geht.",
      "Ich rufe die Person unter einer Nummer zurück, die ich selbst kenne.",
      "Ich gebe nie Geld oder Wertsachen an Unbekannte, auch nicht an angebliche Polizisten.",
      "Ich wähle bei Verdacht die 110 und erzähle jemandem davon.",
     ]},
    {h: "Weiterlesen",
     kurz: "Quellen, geprüft am 22.11.2026: [Polizei: Schockanruf](https://www.polizei-beratung.de/themen-und-tipps/betrug/schockanrufe/), [Polizei: Enkeltrick](https://www.polizei-beratung.de/themen-und-tipps/betrug/enkeltrick/), [Verbraucherzentrale: Falsche Polizisten am Telefon](https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/abzocke/vorsicht-falsche-polizisten-am-telefon-12273).",
     liste: [
      "Polizeiliche Kriminalprävention: [Schockanruf: So schützen Sie sich vor Telefonbetrug](https://www.polizei-beratung.de/themen-und-tipps/betrug/schockanrufe/), abgerufen am 22.11.2026.",
      "Polizeiliche Kriminalprävention: [Enkeltrick Betrug](https://www.polizei-beratung.de/themen-und-tipps/betrug/enkeltrick/), abgerufen am 22.11.2026.",
      "Polizeiliche Kriminalprävention: [Falscher Polizist](https://www.polizei-beratung.de/themen-und-tipps/betrug/betrug-durch-falsche-polizisten/), abgerufen am 22.11.2026.",
      "Polizeiliche Kriminalprävention: [Vorsicht Betrug: Bedrohungen durch KI](https://www.polizei-beratung.de/aktuelles/detailansicht/betrug-mit-hilfe-von-kuenstlicher-intelligenz/), abgerufen am 22.11.2026.",
      "Verbraucherzentrale: [Vorsicht: Falsche Polizisten am Telefon](https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/abzocke/vorsicht-falsche-polizisten-am-telefon-12273), abgerufen am 22.11.2026.",
      "Bundesamt für Sicherheit in der Informationstechnik (BSI): [Biometrie: Vom Einloggen per Fingerabdruck bis zu Täuschungen durch Deepfakes](https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Technologien_sicher_gestalten/Biometrie/biometrie.html), abgerufen am 22.11.2026.",
      "Wie Sie solche Quellen in einem Referat angeben, steht auf der Seite {{referat|die Seite zum Referat über KI}}. Drei geprüfte Fälle, in denen ein Chat beim Enkeltrick danebenliegt: {{chat-irrt|Wenn der Chat irrt}}.",
     ]},
  ],
  mitnehmen: [
    "Auflegen, selbst zurückrufen, bei Verdacht die 110 wählen.",
    "Eine vertraute Stimme beweist nichts, denn Stimmen lassen sich mit KI nachbauen.",
    "Ein Codewort in der Familie schützt auch dann, wenn die Stimme echt klingt.",
  ],
  grenzen: [
    "Die Seite gibt Hinweise der Polizei und der Verbraucherzentrale wieder. Sie ist keine Rechtsberatung.",
    "Maschen ändern sich. Aktuelle Warnungen stehen auf polizei-beratung.de.",
    "Das Chat-Labor ist kein Betrugsberater. Ein kleines Sprachmodell kann hier falsch antworten. Halten Sie sich an die drei Schritte auf dieser Seite.",
  ],
  quiz: [
    {frage: "Ein Anrufer sagt, Ihr Enkel hatte einen Unfall und braucht sofort Bargeld. Was tun Sie zuerst?",
     optionen: ["Ich frage, wie viel Geld gebraucht wird und wann", "Ich nenne dem Anrufer meine Kontonummer zur Hilfe", "Ich lege auf und rufe meinen Enkel selbst an", "Ich warte, bis der Anrufer noch einmal anruft"],
     richtig: 2, erklaerung: "Auflegen und unter einer bekannten Nummer zurückrufen klärt es. Wer am Telefon bleibt, steht weiter unter dem Druck der Täter."},
    {frage: "Die Stimme am Telefon klingt genau wie Ihre Tochter. Was sagt das aus?",
     optionen: ["Nichts Sicheres, denn Stimmen lassen sich mit KI nachbauen", "Sie ist es sicher, so echt klingt keine Fälschung", "Es ist eine Fälschung, echte Stimmen klingen anders", "Sie ist es, wenn im Display die richtige Nummer steht"],
     richtig: 0, erklaerung: "Laut BSI reichen mitunter wenige Sekunden Aufnahme für eine Fälschung. Auch die Nummer im Display lässt sich fälschen. Nur der Rückruf unter einer bekannten Nummer klärt es."},
    {frage: "Ein angeblicher Polizist will Ihre Wertsachen zur Sicherheit abholen. Was ist richtig?",
     optionen: ["Ich gebe sie mit, einem Polizisten darf man vertrauen", "Ich gebe die Hälfte mit und behalte den Rest", "Ich lasse mir die Dienstnummer nennen und gebe sie dann mit", "Ich gebe nichts heraus, lege auf und wähle selbst die 110"],
     richtig: 3, erklaerung: "Die Polizei bittet niemals telefonisch um Wertsachen. Eine genannte Dienstnummer lässt sich ebenso erfinden. Wählen Sie die 110 selbst."},
  ],
  weiter: ["alltag-betrug", "chat-irrt", "echt-oder-ki", "fake-news-deepfakes", "sicherheit-einfach", "quellen-pruefen"],
},

},
});
