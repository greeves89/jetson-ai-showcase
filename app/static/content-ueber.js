/* Seite "Über das Labor": wer dahintersteht, was das Labor ist, wie die Labore arbeiten und wo die Grenzen liegen.
   Nur Fakten aus README.md und docs/. Die Adresse des Autors steht in module.json (seite.autor_url) und in der Fußzeile.
   seo_bauen.mjs beschreibt die Seite im JSON-LD als AboutPage mit dem Autor als Person.
   zusammenfassung: zitierfähige Kurzfassung (2 bis 3 Sätze) für den Rohtext nach dem h1; ohne das Feld leitet
   seo_bauen.mjs sie aus merke, mitnehmen und den Abschnitten ab. */
(function () {

const S = {};

S.ueber = {
  nav: "Über das Labor", typ: "lektion", gruppe: "Der Rechner dahinter", titel: "Über das KI-Labor", symbol: "info",
  ueberSeite: true,
  kurz: "Wer hinter dem KI-Labor steht, was es ist, wie die Labore arbeiten und wo die Grenzen liegen.",
  zusammenfassung: "Das KI-Labor ist ein kostenloses Lernangebot zu künstlicher Intelligenz auf Deutsch, ohne Anmeldung. Es läuft lokal auf einem NVIDIA Jetson Orin Nano, der nur wenige Watt aufnimmt, und nutzt keine externen KI-Dienste. Gebaut hat es Daniel Alisch als Lernprojekt.",
  abschnitte: [
    {h: "Wer dahintersteht",
     kurz: "Das KI-Labor ist ein Projekt von Daniel Alisch. Mehr über ihn steht auf seiner Hauptseite daniel-alisch.site.",
     p: [
      "Daniel Alisch hat das KI-Labor als Lernprojekt gebaut. Es soll zeigen, wie künstliche Intelligenz funktioniert, und zwar so, dass man es selbst ausprobieren kann. Die Hauptseite `daniel-alisch.site` ist unten in der Fußzeile verlinkt. Dort stehen auch Impressum und Datenschutzerklärung.",
     ]},
    {h: "Was das Labor ist",
     kurz: "Ein kostenloses Lernangebot ohne Anmeldung. Alles läuft auf einem einzigen kleinen Rechner, ohne Cloud.",
     visual: {typ: "raster", spalten: 3, zellen: [
      {icon: "user-check", text: "Ohne Anmeldung", sub: "kostenlos nutzbar"},
      {icon: "cpu", text: "Jetson Orin Nano", sub: "wenige Watt"},
      {icon: "shield-check", text: "Ohne Cloud", sub: "keine externen KI-Dienste"}]},
     p: [
      "Das KI-Labor läuft komplett auf einem {{hardware|NVIDIA Jetson Orin Nano}}. Das ist ein Computer im Kartenformat mit einer [[gpu|GPU]], der nur wenige Watt aufnimmt. Sprachmodell, Bilderkennung, Spracherkennung und Sprachausgabe rechnen auf diesem Gerät selbst. Es gibt keine Verbindung zu externen KI-Diensten.",
      "Du brauchst kein Konto und bezahlst nichts. Kamerabilder, Mikrofonaufnahmen und eingetippte Texte werden nur im Arbeitsspeicher verarbeitet und nicht dauerhaft gespeichert. Die Einzelheiten stehen auf der Seite {{sicherheit-einfach|Ist das sicher? Was wird gespeichert?}}.",
     ],
     merke: "Das KI-Labor ist ein Lernprojekt. Es läuft auf einem einzigen kleinen Rechner, nicht in einem Rechenzentrum."},
    {h: "Wie die Seiten aufgebaut sind",
     kurz: "Lektionen erklären, Labore lassen dich ausprobieren, Videos und Selbsttests helfen beim Wiederholen.",
     liste: [
      "**Lektionen** erklären die Grundlagen von null, mit Beispielen aus dem Alltag, Vergleichstabellen, Merksätzen und einem kurzen Selbsttest.",
      "**Labore** laufen live auf dem Jetson: Gesichts- und Objekterkennung über die eigene Webcam, ein Bildmodell anlernen, ein Sprachmodell befragen, Dokumente durchsuchen (RAG), ein Agent mit Werkzeugen, Sprache zu Text und Text zu Sprache.",
      "**Interaktive Bausteine** machen Begriffe greifbar, zum Beispiel ein neuronales Netz im Browser oder der Gradientenabstieg.",
      "**Erklärvideos** fassen Themen in 70 bis 100 Sekunden zusammen.",
      "**Business-Use-Cases** zeigen Beispiele aus Betrieben, mit fertigen Beispieldaten zum Starten per Klick.",
     ]},
    {h: "Wie die Labore arbeiten",
     kurz: "Jedes Labor zeigt die Verarbeitung in Schritten, mit der Zeit für jeden Schritt.",
     p: [
      "Wenn du ein Labor startest, schickt dein Browser die Eingabe an den Jetson. Dort rechnet das Modell, und das Ergebnis kommt zurück. Das Labor zeigt dir dabei die einzelnen Schritte und wie lange jeder gedauert hat. Auf der Seite {{hardware|Hardware}} siehst du live, wie stark der Rechner gerade ausgelastet ist.",
      "Kamera und Mikrofon schalten sich nie von allein ein. Vorher fragt dich die Seite, danach dein Browser. Wer nichts freigeben will, nimmt die mitgelieferten Beispielbilder und Beispieldaten.",
     ]},
  ],
  mitnehmen: [
    "Das KI-Labor ist kostenlos, braucht keine Anmeldung und läuft lokal auf einem Jetson Orin Nano.",
    "Es nutzt keine externen KI-Dienste. Eingaben werden nur im Arbeitsspeicher verarbeitet.",
    "Kleine Modelle auf kleiner Hardware: gut zum Verstehen, nicht für den Ernstfall.",
  ],
  grenzen: [
    "Der Jetson hat 8 GB Speicher für CPU und GPU zusammen. Deshalb laufen hier kleine Modelle, und große Sprachmodelle wie in Cloud-Diensten passen nicht darauf.",
    "Kleine Modelle machen mehr Fehler. Antworten des Sprachmodells können falsch oder erfunden sein, prüfe Wichtiges selbst.",
    "Es ist ein einzelnes Gerät. Nur zwei Sprachmodell-Antworten laufen gleichzeitig, bei Andrang wartest du in einer Warteschlange.",
    "Das Labor ist ein Lernangebot und keine Beratung. Für einen echten Einsatz im Betrieb braucht es eigene Prüfung von Daten, Recht und Sicherheit.",
  ],
  weiter: ["start", "hardware", "sicherheit-einfach"],
};

INHALT.registriere({
  seiten: S,
  gruppen: [{ name: "Der Rechner dahinter", seiten: ["ueber"] }],
});

/* Startseite: zitierfähige Kurzfassung für den Rohtext (seo_bauen.mjs, nach dem h1) */
if (INHALT.seiten.start && !INHALT.seiten.start.zusammenfassung) {
  INHALT.seiten.start.zusammenfassung = "Das KI-Labor ist ein kostenloses Lernangebot zu künstlicher Intelligenz auf Deutsch, ohne Anmeldung. Es läuft lokal auf einem NVIDIA Jetson Orin Nano und nutzt keine externen KI-Dienste. Zu den Themen gibt es Erklärungen, Versuche zum Ausprobieren, Erklärvideos und kurze Selbsttests.";
}
})();
