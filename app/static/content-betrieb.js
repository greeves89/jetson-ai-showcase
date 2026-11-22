/* Seite "Deine Entscheidung": Endseite des Betriebspfads (Rolle "beruf"). Sechs Fragen zum Abhaken (widget "checkliste",
   Seitenfeld checkliste, siehe widgets-prognose.js), dazu Hinweis zum Drucken und der Weg zum Kontakt.
   Kontakt: Hauptseite des Betreibers (module.json seite.autor_url), dort der Abschnitt Kontakt. Keine Preise, keine Zusagen. */
(function () {

const S = {};

S["betrieb-entscheidung"] = {
  nav: "Deine Entscheidung", typ: "lektion", gruppe: "KI im Betrieb", titel: "Deine Entscheidung: sechs Fragen vor dem Start", symbol: "clipboard-check",
  widget: "checkliste", widgetTitel: "Sechs Fragen zum Abhaken", widgetSymbol: "list-checks",
  checkliste: {
    lead: "Gehe die Fragen durch. Jedes Nein ist eine Aufgabe, die du vor dem Start erledigst.",
    punkte: [
      {frage: "Ist das Problem in einem Satz beschrieben?", hilfe: "Zum Beispiel: Wir verlieren jede Woche zwei Stunden mit dem Schreiben von Angeboten."},
      {frage: "Gibt es einen Ausgangswert und ein Ziel?", hilfe: "Wie lange dauert es heute, und was wäre ein Erfolg?"},
      {frage: "Sind Daten und Rechtsgrundlage geklärt?", hilfe: "Welche Daten gehen in das System, und darf das so geschehen? Echte Kundendaten gehören nicht in dieses Labor."},
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
    {h: "Drucken oder als PDF speichern",
     kurz: "Der Druckdialog deines Browsers genügt. Die Haken werden nicht gespeichert.",
     p: [
      "Über den Knopf oben öffnest du den Druckdialog deines Browsers. Dort kannst du die Seite ausdrucken oder als PDF speichern. Die Haken bleiben nur auf deinem Bildschirm, sie werden nicht gespeichert und nicht gesendet. Hake vor dem Drucken ab, was geklärt ist.",
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
  weiter: ["ki-einfuehrung", "kosten-energie", "recht", "sicherheit-einfach"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "KI im Betrieb", seiten: ["betrieb-entscheidung"] }],
});
})();
