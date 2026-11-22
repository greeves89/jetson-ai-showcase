/* Seite "Experimente, leicht erklärt": Raster der Labore ohne Kamera und Mikrofon. Die Liste INHALT.experimente steht hier einmal
   und wird von der Seite selbst und vom Start der Rolle "Schule" (app.js, experimenteRaster) benutzt.
   Felder je Eintrag: id (vorhandene Seite), titel, satz (ein Satz in einfacher Sprache), symbol (lucide), hinweis (optional, kurzer Zusatz). */
(function () {

INHALT.experimente = [
  {id: "ml", titel: "Punkte-Labor", symbol: "chart-scatter", satz: "Setze bunte Punkte und sieh, wie der Computer neue Punkte einsortiert."},
  {id: "chat", titel: "Chat", symbol: "message-square", satz: "Stell einem Sprachmodell eine Frage und sieh Wort für Wort, wie es antwortet."},
  {id: "prompting", titel: "Prompt-Vergleich", symbol: "split", satz: "Gleiche Frage, zwei Formulierungen: Welche Antwort ist besser?"},
  {id: "objekt", titel: "Objekte erkennen", symbol: "scan-search", satz: "Der Computer benennt, was auf einem Bild zu sehen ist.", hinweis: "Mit Beispielbildern"},
  {id: "sprachausgabe", titel: "Text zu Sprache", symbol: "volume-2", satz: "Schreib einen Satz und hör, wie eine Computerstimme ihn spricht."},
  {id: "neuronale-netze", titel: "Netz-Spielplatz", symbol: "network", satz: "Baue ein kleines Netz und schau zu, wie es lernt."},
  {id: "bild-als-zahlen", titel: "Pixel-Labor", symbol: "grid-3x3", satz: "Ein Bild besteht aus Zahlen. Verändere sie und sieh, was passiert."},
  {id: "empfehlungen", titel: "Empfehlungs-Labor", symbol: "thumbs-up", satz: "So kommt ein Video oder Lied in deinen Feed."},
  {id: "llm-grenzen", titel: "Fehler-Spiel", symbol: "bug", satz: "Finde heraus, wo eine KI überzeugend danebenliegt."},
];

INHALT.registriere({
  seiten: {
    experimente: {
      nav: "Experimente", typ: "lektion", gruppe: "Experimente", titel: "Experimente, leicht erklärt", symbol: "flask-conical",
      kurz: "Probiere aus, wie KI arbeitet. Alle Experimente laufen ohne Kamera und ohne Mikrofon.",
      experimente: true,
      lernziele: ["Du kannst ein Experiment aussuchen und selbst ausprobieren.", "Du kannst mit eigenen Worten sagen, was dabei passiert ist."],
      abschnitte: [
        {h: "So gehst du vor",
         kurz: "Such dir ein Experiment aus, probiere es zwei Minuten aus und beschreibe dann, was passiert ist.",
         visual: {typ: "ablauf", schritte: [
          {icon: "hand", text: "Aussuchen", sub: "Ein Experiment antippen"},
          {icon: "flask-conical", text: "Ausprobieren", sub: "Zwei Minuten spielen"},
          {icon: "message-square", text: "Erklären", sub: "Mit eigenen Worten"}]},
         p: ["Jedes Experiment hat oben das Labor zum Ausprobieren und darunter eine kurze Erklärung. Du musst nichts installieren und dich nirgends anmelden."]},
        {h: "Was du dabei beachten solltest",
         kurz: "Gib keine echten Namen, Passwörter oder privaten Daten ein. Zum Üben reichen erfundene Beispiele.",
         p: ["Der Chat läuft auf einem kleinen Rechner und braucht manchmal einen Moment. Wenn viel los ist, wartest du kurz. Die Antworten einer KI können falsch sein, prüfe sie also nach."]},
      ],
      mitnehmen: ["Eine KI lernt aus Beispielen, nicht aus Regeln.", "Zum Verstehen hilft Ausprobieren mehr als Lesen.", "Antworten einer KI prüfst du nach."],
      weiter: ["echt-oder-ki", "ki-hausaufgaben-fair", "prompts-fuer-schueler"],
    },
  },
  gruppen: [{name: "Experimente", seiten: ["experimente"], nach: "Start"}],
});

})();
