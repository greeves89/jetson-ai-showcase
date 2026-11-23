/* Seite "Das kleine Modell irrt: drei geprüfte Fälle" (Gruppe Medienkompetenz). Lehrfall zum Nachprüfen von Chat-Antworten.
   "Das sagte das Modell" nennt nur die Art des Fehlers, kein erfundenes Zitat. "Das stimmt wirklich" nennt je Fall die Quelle, am 23.11.2026 abgerufen:
   Verordnung (EG) Nr. 561/2006 auf eur-lex.europa.eu (Art. 2, 4, 6, 7, 8), Polizeiliche Kriminalprävention (polizei-beratung.de), eigene Rechnung. */
(function () {

const S = {};

S["chat-irrt"] = {
  nav: "Wenn der Chat irrt", typ: "lektion", gruppe: "Medienkompetenz", titel: "Das kleine Modell irrt: drei geprüfte Fälle", symbol: "triangle-alert", rollen: ["schule", "erwachsene", "eltern"],
  lernziele: [
    "Du kannst an drei Fällen zeigen, wie ein kleines Sprachmodell sicher klingt und trotzdem danebenliegt.",
    "Du kannst eine Behauptung in drei Schritten prüfen: notieren, Quelle suchen, vergleichen.",
    "Du kannst sagen, bei welchen Fragen ein Chat allein nie genügt.",
  ],
  kurz: "Drei Fälle, in denen das kleine Modell typisch danebenliegt, jeweils mit der geprüften richtigen Antwort und der Quelle: Lenkzeiten, Enkeltrick, eine Rechnung.",
  zusammenfassung: "Drei Lehrfälle zum Prüfen von Chat-Antworten: Lenk- und Ruhezeiten nach der EU-Verordnung 561/2006 (9 Stunden täglich, 45 Minuten Pause nach 4,5 Stunden, 11 Stunden Ruhezeit), der Rat der Polizei beim Enkeltrick und Schockanruf (auflegen, zurückrufen, 110) und eine nachgerechnete Zahl (0,634). Dazu drei Schritte zum Prüfen.",
  abschnitte: [
    {h: "Wo du es im Chat siehst",
     kurz: "Im Chat steht unter jeder Antwort ein Prüfhinweis. Er führt auf diese Seite. Das Modell ist klein und klingt trotzdem immer gleich sicher.",
     p: [
      "Im {{chat|Chat}} läuft ein kleines Sprachmodell auf dem Rechner dieses Labors. Es ist schnell und privat, weiß aber weniger als große Dienste und erfindet öfter. Darum erscheint unter den Antworten ein Hinweis zum Prüfen mit einem Link auf diese Seite.",
      "Die drei Fälle unten sind typische Fehler, die beim Testen des Labors aufgefallen sind. Es sind keine Zitate, sondern die Art des Fehlers. Die richtige Antwort steht jeweils daneben, mit Quelle.",
     ]},
    {h: "So prüfst du in drei Schritten",
     kurz: "Behauptung notieren, die Stelle suchen, die zuständig ist, und vergleichen. Stimmt es nicht überein, gilt die Quelle.",
     visual: {typ: "ablauf", paket: false, schritte: [
      {icon: "pen-line", text: "1. Notieren", sub: "Zahl, Name, Frist"},
      {icon: "search", text: "2. Stelle suchen", sub: "Gesetz, Behörde, Hersteller"},
      {icon: "scale", text: "3. Vergleichen", sub: "bei Abweichung gilt die Quelle", farbe: "gruen"}]},
     p: [
      "Erstens schreibst du auf, was die Antwort behauptet: die Zahl, die Frist, den Namen der Stelle. Zweitens suchst du die Stelle, die dafür zuständig ist, etwa das Gesetz selbst, eine Behörde oder den Hersteller. Drittens vergleichst du. Weichen beide ab, gilt die Quelle.",
      "Warum eine zweite Quelle nötig ist und wie du die Quelle selbst auf Vertrauenswürdigkeit prüfst, steht auf {{quellen-pruefen|Quellen prüfen}}.",
     ],
     merke: "Je größer die Folgen, desto weniger reicht ein Chat allein."},
    {h: "Fall 1: Lenk- und Ruhezeiten",
     kurz: "Der Chat behauptet oft, es gebe keine feste Grenze, und nennt Verbände, die er nicht belegen kann. Richtig: 9 Stunden Lenkzeit, nach 4,5 Stunden mindestens 45 Minuten Pause.",
     visual: {typ: "vergleich",
      links: {titel: "Das sagte das Modell", icon: "bot", farbe: "orange", punkte: ["Es gebe keine feste Grenze", "Erfundene Verbände als Quelle", "Andere Pausenzeiten"]},
      rechts: {titel: "Das stimmt wirklich", icon: "file-text", farbe: "gruen", punkte: ["9 Stunden Tageslenkzeit", "45 Minuten nach 4,5 Stunden", "11 Stunden Ruhezeit"]}},
     p: [
      "**Das sagte das Modell (typischer Fehler):** Auf die Frage, wie lange ein Berufsfahrer am Stück fahren darf, behauptet das kleine Modell gern, es gebe keine feste Vorgabe, und nennt Organisationen, die eine Pause empfehlen. Die Zeiten weichen von der Regel ab, und die genannten Stellen lassen sich nicht belegen.",
      "**Das stimmt wirklich:** Die Verordnung (EG) Nr. 561/2006 gilt nach Artikel 2 für die Güterbeförderung mit Fahrzeugen über 3,5 t zulässiger Höchstmasse und für die Personenbeförderung mit Fahrzeugen für mehr als neun Personen einschließlich Fahrer. Sie nennt auch Ausnahmen, prüfe, ob dein Fahrzeug darunter fällt. Für kleinere Fahrzeuge gelten andere Regeln, frag die zuständige Stelle.",
     ],
     tabelle: {
      beschriftung: "Was die Verordnung (EG) Nr. 561/2006 sagt, geprüft am 23.11.2026",
      kopf: ["Regel", "Wert", "Fundstelle"],
      zeilen: [
       ["Tägliche Lenkzeit", "höchstens 9 Stunden, höchstens zweimal pro Woche bis zu 10 Stunden", "Artikel 6 Absatz 1"],
       ["Wöchentliche Lenkzeit", "höchstens 56 Stunden", "Artikel 6 Absatz 2"],
       ["Fahrtunterbrechung", "nach 4,5 Stunden Lenkdauer mindestens 45 Minuten am Stück, sofern keine Ruhezeit folgt. Ersatz möglich durch 15 Minuten, danach 30 Minuten", "Artikel 7"],
       ["Tägliche Ruhezeit", "regelmäßig mindestens 11 Stunden, reduziert mindestens 9 Stunden, aber weniger als 11", "Artikel 4 Buchstabe g, Artikel 8 Absatz 2"],
      ]},
     merke: "Bei Arbeits-, Lenk- und Ruhezeiten zählt der Gesetzestext, nicht der Chat. Quelle: [Verordnung (EG) Nr. 561/2006 auf EUR-Lex](https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32006R0561), abgerufen am 23.11.2026."},
    {h: "Fall 2: Enkeltrick und Schockanruf",
     kurz: "Der Chat hält es für möglich, dass der Anrufer echt ist, und lässt das Gespräch weiterlaufen. Die Polizei rät: auflegen, selbst zurückrufen, bei Verdacht 110.",
     visual: {typ: "vergleich",
      links: {titel: "Das sagte das Modell", icon: "bot", farbe: "orange", punkte: ["Anrufer könnte echt sein", "Gespräch weiterführen", "Auflegen und 110 fehlen"]},
      rechts: {titel: "Die Polizei rät", icon: "siren", farbe: "gruen", punkte: ["Sofort auflegen", "Unter bekannter Nummer zurückrufen", "Bei Verdacht die 110"]}},
     p: [
      "**Das sagte das Modell (typischer Fehler):** Auf die Frage, was zu tun ist, wenn ein angeblicher Enkel am Telefon Geld braucht, hält das Modell es für möglich, dass der Anrufer echt ist, schlägt Fragen zum Weiterreden vor und lässt Auflegen, Zurückrufen und die 110 weg. Das Gespräch geht weiter, und der Druck bleibt.",
      "**Das stimmt wirklich:** Die Polizei rät bei Schockanrufen, sofort aufzulegen. Das sei nicht unhöflich. Sie rät, die Person oder eine Vertrauensperson unter einer bekannten Telefonnummer zu erreichen und nicht unter der Nummer des Anrufs, bei Verdacht sofort die 110 zu wählen und niemals Geld oder Wertgegenstände an Unbekannte zu übergeben. Beim Enkeltrick heißt es: Die jeweilige Person unter der bekannten Nummer anrufen und sich den Sachverhalt bestätigen lassen.",
      "Die ganze Seite dazu: {{falscher-anruf|Falscher Anruf, Enkeltrick, Schockanruf}}. Quellen: [Polizei: Schockanruf](https://www.polizei-beratung.de/themen-und-tipps/betrug/schockanrufe/) und [Polizei: Enkeltrick](https://www.polizei-beratung.de/themen-und-tipps/betrug/enkeltrick/), abgerufen am 23.11.2026.",
     ],
     merke: "Bei Geldforderungen am Telefon: auflegen, zurückrufen, bei Verdacht 110. Dafür braucht es keinen Chat."},
    {h: "Fall 3: Eine Rechnung",
     kurz: "Kleine Modelle rechnen schlecht und nennen trotzdem eine glatte Zahl. Nachgerechnet ergibt das Beispiel unten 0,634, nicht den Wert, den das Modell nannte.",
     p: [
      "**Das sagte das Modell (typischer Fehler):** Bei der Aufgabe, die Ausgabe eines Neurons mit der Sigmoid-Funktion auszurechnen, nannte das Modell in einem Test den Wert 0,855. Die Zahl klang sicher und folgte nicht aus der Rechnung.",
      "**Das stimmt wirklich:** Aufgabe: x1 = 1,2, x2 = 2,5, Gewichte w1 = 0,5 und w2 = −0,3, Verschiebung b = 0,7, Ausgabe σ(w1·x1 + w2·x2 + b). Schritt für Schritt, mit dem Taschenrechner nachgerechnet:",
     ],
     code: [{titel: "Nachgerechnet, Zeile für Zeile", text: "w1 · x1 = 0,5 · 1,2 = 0,6\nw2 · x2 = −0,3 · 2,5 = −0,75\nSumme = 0,6 − 0,75 + 0,7 = 0,55\ne^(−0,55) ≈ 0,577\nσ(0,55) = 1 / (1 + 0,577) ≈ 0,634"}],
     alltag: "Beim Wechselgeld im Laden rechnest du nach, auch wenn die Kasse eine Zahl anzeigt. Bei einem Chat gilt dasselbe: Das Modell rät die Zahl Stück für Stück, es rechnet nicht.",
     merke: "Zahlen aus dem Chat rechnest du selbst nach. Die Quelle ist hier die Rechnung. Wie das Neuron funktioniert, steht auf {{neuronale-netze|Neuronale Netze}}."},
    {h: "Weiterlesen",
     kurz: "Quellen, abgerufen am 23.11.2026.",
     liste: [
      "EUR-Lex: [Verordnung (EG) Nr. 561/2006](https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32006R0561) zur Harmonisierung bestimmter Sozialvorschriften im Straßenverkehr, abgerufen am 23.11.2026.",
      "Polizeiliche Kriminalprävention: [Schockanruf](https://www.polizei-beratung.de/themen-und-tipps/betrug/schockanrufe/), abgerufen am 23.11.2026.",
      "Polizeiliche Kriminalprävention: [Enkeltrick](https://www.polizei-beratung.de/themen-und-tipps/betrug/enkeltrick/), abgerufen am 23.11.2026.",
      "Warum Sprachmodelle erfinden: {{llm-grenzen|Grenzen von Sprachmodellen}}.",
     ]},
  ],
  mitnehmen: [
    "Ein kleines Modell klingt sicher, auch wenn Zahlen, Quellen oder Ratschläge nicht stimmen.",
    "Prüfen in drei Schritten: Behauptung notieren, zuständige Stelle suchen, vergleichen.",
    "Bei Regeln mit Folgen und bei Geldforderungen gilt die Quelle oder die Polizei, nicht der Chat.",
  ],
  grenzen: [
    "Die Fälle beschreiben typische Fehler, keine Zitate. Das Modell kann beim nächsten Mal anders antworten, auch richtig.",
    "Die Lenkzeit-Tabelle nennt nur die Regeln, die am 23.11.2026 im Wortlaut geprüft wurden. Sie ist keine Rechtsberatung. Für deinen Fall frag die zuständige Stelle.",
  ],
  quiz: [
    {frage: "Wie lange darf ein Lkw-Fahrer nach der Verordnung (EG) Nr. 561/2006 lenken, bevor eine Pause nötig ist?",
     optionen: ["Sechs Stunden, danach mindestens 15 Minuten Pause", "Neun Stunden, danach mindestens eine Stunde Pause", "Viereinhalb Stunden, danach mindestens 45 Minuten Pause", "Vier Stunden, danach mindestens 20 Minuten Pause"],
     richtig: 2, erklaerung: "Artikel 7 verlangt nach viereinhalb Stunden Lenkdauer eine Unterbrechung von mindestens 45 Minuten, sofern keine Ruhezeit folgt."},
    {frage: "Ein angeblicher Enkel ruft an und braucht dringend Geld. Was rät die Polizei?",
     optionen: ["Ihn weiterreden lassen und die Nummer im Display prüfen", "Einen kleinen Betrag überweisen, damit er Ruhe gibt", "Vorsorglich der Bank die Kontodaten am Telefon nennen", "Auflegen und unter der bekannten Nummer zurückrufen"],
     richtig: 3, erklaerung: "Die Polizei rät, sofort aufzulegen und die Person unter einer bekannten Nummer anzurufen. Bei Verdacht wählst du die 110."},
    {frage: "Das Modell nennt 0,855 als Ergebnis einer Rechnung. Was ist ein guter nächster Schritt?",
     optionen: ["Die Zahl übernehmen, weil das Modell sicher klingt", "Die Rechnung selbst nachrechnen, am besten Schritt für Schritt", "Dieselbe Frage so lange stellen, bis 0,855 wieder kommt", "Die Zahl runden, damit sie ungefähr stimmt"],
     richtig: 1, erklaerung: "Kleine Modelle raten Zahlen Stück für Stück. Nachrechnen zeigt, ob sie stimmt. Im Beispiel ergibt die Rechnung etwa 0,634."},
  ],
  weiter: ["quellen-pruefen", "llm-grenzen", "falscher-anruf", "alltag-chat", "chat"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "Medienkompetenz", seiten: ["chat-irrt"] }],
});

const NEU_SYN = {
  lehrfall: ["=chat-irrt", "=quellen-pruefen", "=llm-grenzen"],
  "ki irrt": ["=chat-irrt", "=llm-grenzen", "=quellen-pruefen"],
  irrt: ["=chat-irrt", "=llm-grenzen", "=quellen-pruefen"],
  irrtum: ["=chat-irrt", "=llm-grenzen", "=quellen-pruefen"],
  "falsche antwort": ["=chat-irrt", "=quellen-pruefen", "=llm-grenzen"],
  "falsche antworten": ["=chat-irrt", "=quellen-pruefen", "=llm-grenzen"],
  halluzination: ["=chat-irrt", "=llm-grenzen", "=chat"],
  lenkzeit: ["=chat-irrt", "=alltag-chat", "=quellen-pruefen"],
  lenkzeiten: ["=chat-irrt", "=alltag-chat", "=quellen-pruefen"],
  busfahrer: ["=chat-irrt", "=alltag-chat", "=quellen-pruefen"],
  lkw: ["=chat-irrt", "=quellen-pruefen"],
  pausen: ["=chat-irrt", "=alltag-chat", "=quellen-pruefen"],
  ruhezeit: ["=chat-irrt", "=quellen-pruefen"],
  ruhezeiten: ["=chat-irrt", "=quellen-pruefen"],
  fahrer: ["=chat-irrt", "=quellen-pruefen"],
};
for (const [k, ids] of Object.entries(NEU_SYN)) INHALT.synonyme[k] = [...new Set([...ids, ...(INHALT.synonyme[k] || [])])];
})();
