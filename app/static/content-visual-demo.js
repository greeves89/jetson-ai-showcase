/* Bildsprache: Beispielseite mit einem Bild je Typ (Dokumentation und Test fuer visuals.js, Spezifikation docs/visuals.md).
   Die Seite steht nicht in der Navigation (versteckt) und nicht in der Sitemap; erreichbar unter /visual-demo.
   Alle Zahlen sind Beispielwerte zur Veranschaulichung, keine Messungen. */
(function () {
window.INHALT.registriere({
  seiten: {
    "visual-demo": {
      versteckt: true, typ: "lektion", gruppe: "Bildsprache", titel: "Bildsprache: ein Beispiel je Bildtyp", nav: "Bildsprache", symbol: "bild",
      kurz: "Jeder Abschnitt dieser Seite zeigt einen Bildtyp mit KI-Inhalt. Die Seite dient als Vorlage und als Test für Autorinnen und Autoren.",
      abschnitte: [
        {h: "Ablauf: vom Kamerabild zum Ergebnis",
         kurz: "Ein Datenpaket wandert durch die Stationen. Jede Station leuchtet kurz auf, wenn das Paket sie erreicht.",
         visual: {typ: "ablauf", schritte: [
           {icon: "camera", text: "Kamera", sub: "liefert ein Bild"},
           {icon: "sliders-horizontal", text: "Vorverarbeitung", sub: "Größe, Helligkeit"},
           {icon: "brain-circuit", text: "Modell", sub: "erkennt Objekte"},
           {icon: "circle-check", text: "Ergebnis", sub: "Name und Ort", farbe: "gruen"},
         ], paket: true},
         p: ["Felder: `schritte` mit `icon`, `text`, optional `sub` und `farbe`. Mit `paket: false` entfällt das wandernde Paket.",
             "Auf schmalen Bildschirmen steht der Ablauf senkrecht."]},

        {h: "Kreislauf: wahrnehmen, entscheiden, handeln",
         kurz: "Ein Agent läuft im Kreis: Er nimmt wahr, entscheidet, handelt und lernt aus dem Ergebnis.",
         visual: {typ: "kreis", mitte: "Agentenschleife", knoten: [
           {icon: "scan-eye", text: "Wahrnehmen"},
           {icon: "brain-circuit", text: "Entscheiden"},
           {icon: "wrench", text: "Handeln"},
           {icon: "graduation-cap", text: "Lernen"},
         ]},
         p: ["Felder: `knoten` mit `icon` und `text` (zwei bis sechs), optional `mitte`. Ein Punkt umrundet den Kreis, die Station im Takt leuchtet auf."]},

        {h: "Vergleich: lokal gegen Cloud",
         kurz: "Zwei Wege, ein Modell zu betreiben. Entscheidend ist, wo die Daten entstehen und wie schnell die Antwort kommen muss.",
         visual: {typ: "vergleich",
           links: {titel: "Lokal auf dem Jetson", icon: "cpu", farbe: "akzent", punkte: ["Daten bleiben im Haus", "Antwort in Millisekunden", "Feste Hardwarekosten", "Modellgröße begrenzt"]},
           rechts: {titel: "Cloud-Dienst", icon: "cloud", farbe: "orange", punkte: ["Sehr große Modelle", "Kosten pro Anfrage", "Daten verlassen das Haus", "Netz nötig"]},
           urteil: "Für Kamerabilder im Betrieb zählen meist Tempo und Datenschutz."},
         p: ["Felder: `links` und `rechts` mit `titel`, `icon`, `farbe` und `punkte`, optional `urteil`. Kurze Stichworte statt Sätze."]},

        {h: "Balken: Wartezeit im Netz und am Gerät",
         kurz: "Die Balken wachsen beim Sichtbarwerden. So lässt sich auf einen Blick sehen, was kürzer dauert.",
         visual: {typ: "balken", titel: "Wartezeit pro Bild (Beispielwerte)", einheit: "ms", zeilen: [
           {label: "Cloud über Mobilfunk", wert: 420, farbe: "rot"},
           {label: "Cloud über Glasfaser", wert: 180, farbe: "orange"},
           {label: "Jetson im Haus", wert: 35, farbe: "gruen"},
         ]},
         p: ["Felder: `zeilen` mit `label`, `wert`, optional `max`, `einheit` und `farbe`; `titel` und `einheit` gelten für das ganze Bild. Dezimalzahlen erscheinen mit Komma."]},

        {h: "Schichten: KI, Lernen, Tiefes Lernen",
         kurz: "Ineinander gelegte Ebenen zeigen, was in was steckt: Jedes Feld ist eine Teilmenge des äußeren.",
         visual: {typ: "schichten", richtung: "verschachtelt", ebenen: [
           {icon: "sparkles", text: "Künstliche Intelligenz", sub: "alles, was Aufgaben intelligent löst"},
           {icon: "chart-scatter", text: "Maschinelles Lernen", sub: "lernt aus Beispielen"},
           {icon: "network", text: "Deep Learning", sub: "viele Schichten künstlicher Neuronen"},
           {icon: "wand-sparkles", text: "Generative KI", sub: "erzeugt Text, Bild, Ton"},
         ]},
         p: ["Felder: `ebenen` mit `text`, `sub`, `icon`; `richtung` ist `verschachtelt` (die erste Ebene ist die äußerste) oder `stapel`."]},

        {h: "Stapel: von der Hardware bis zur Anwendung",
         kurz: "Als Stapel gezeichnet liegt oben, was der Mensch sieht, und unten, worauf alles ruht.",
         visual: {typ: "schichten", richtung: "stapel", ebenen: [
           {icon: "layout-dashboard", text: "Anwendung", sub: "Oberfläche"},
           {icon: "brain", text: "Modell", sub: "Gewichte"},
           {icon: "workflow", text: "Laufzeit", sub: "Framework"},
           {icon: "cog", text: "Treiber", sub: "CUDA"},
           {icon: "microchip", text: "Hardware", sub: "GPU und Speicher"},
         ]},
         p: ["Gleicher Bildtyp, andere `richtung`. Die untere Ebene ist breiter, weil sie trägt."]},

        {h: "Raster: Einsatzfelder im Betrieb",
         kurz: "Gleichrangige Beispiele nebeneinander. Das Raster passt seine Spalten der Breite an.",
         visual: {typ: "raster", spalten: 3, zellen: [
           {icon: "scan-search", text: "Qualität", sub: "Sichtprüfung am Band"},
           {icon: "warehouse", text: "Lager", sub: "Bestand zählen"},
           {icon: "car", text: "Verkehr", sub: "Fahrzeuge zählen"},
           {icon: "stethoscope", text: "Gesundheit", sub: "Bilder vorsortieren"},
           {icon: "store", text: "Handel", sub: "Regale prüfen"},
           {icon: "file-text", text: "Büro", sub: "Dokumente sortieren"},
         ]},
         p: ["Felder: `zellen` mit `icon`, `text`, optional `sub`; `spalten` legt die Spaltenzahl fest."]},

        {h: "Zahlen: Kennzahlen eines Tests",
         kurz: "Große Zahlen zählen beim Sichtbarwerden hoch. Die erste Kachel ist die wichtigste und fällt größer aus.",
         visual: {typ: "zahlen", kacheln: [
           {wert: "99,2 %", label: "Trefferquote im Testsatz (Beispiel)", icon: "target"},
           {wert: "35 ms", label: "Antwortzeit je Bild", icon: "timer"},
           {wert: "0 Byte", label: "Bilddaten, die das Haus verlassen", icon: "shield-check"},
         ]},
         p: ["Felder: `kacheln` mit `wert` (Text samt Einheit), `label`, optional `icon`. Zahlen der Form `12`, `1,5` oder `99,5 %` zählen hoch."]},

        {h: "Zeitachse: Meilensteine der KI",
         kurz: "Fünf Stationen in der Reihenfolge der Zeit. Die Linie zieht sich, die Punkte erscheinen nacheinander.",
         visual: {typ: "zeitachse", punkte: [
           {t: "1956", text: "Der Begriff Künstliche Intelligenz entsteht", icon: "book-open"},
           {t: "1997", text: "Ein Schachcomputer schlägt den Weltmeister", icon: "trophy"},
           {t: "2012", text: "Tiefe Netze gewinnen die Bilderkennung", icon: "image"},
           {t: "2017", text: "Die Transformer-Architektur erscheint", icon: "layers"},
           {t: "2022", text: "Chatbots erreichen ein breites Publikum", icon: "message-square"},
         ]},
         p: ["Felder: `punkte` mit `t` (Jahr oder Zeitpunkt), `text`, optional `icon`."]},

        {h: "Netz: eine kleine Wissensgraph-Skizze",
         kurz: "Knoten und Beziehungen. Die Linien zeichnen sich nacheinander, danach läuft ein Impuls durch das Netz.",
         visual: {typ: "netz", knoten: [
           {id: "kunde", text: "Kundin", icon: "user", x: 6, y: 18},
           {id: "auftrag", text: "Auftrag", icon: "file-text", x: 40, y: 18},
           {id: "produkt", text: "Produkt", icon: "package", x: 56, y: 58, farbe: "gruen"},
           {id: "lager", text: "Lager", icon: "warehouse", x: 94, y: 30, farbe: "orange"},
           {id: "lieferant", text: "Lieferant", icon: "truck", x: 90, y: 90, farbe: "orange"},
         ], kanten: [["kunde", "auftrag", "bestellt"], ["auftrag", "produkt", "enthält"], ["produkt", "lager", "liegt in"], ["produkt", "lieferant", "kommt von"]]},
         p: ["Felder: `knoten` mit `id`, `text`, `icon`, `x` und `y` (0 bis 100), `kanten` als Paare `[von, nach, Beschriftung]`."]},

        {h: "Punkte: zwei Klassen und eine Grenze",
         kurz: "Punktwolken fliegen ein, dann zieht sich die Grenze. Formen und Farben unterscheiden die Klassen.",
         visual: [
           {typ: "punkte", grenze: "linie", klassen: [
             {name: "Gutteil", farbe: "gruen", n: 26, mitte: [28, 64], streu: 9},
             {name: "Ausschuss", farbe: "rot", n: 22, mitte: [72, 34], streu: 9},
           ]},
           {typ: "punkte", grenze: "kreis", klassen: [
             {name: "Normal", farbe: "akzent", n: 40, mitte: [42, 48], streu: 8},
             {name: "Auffällig", farbe: "orange", n: 7, mitte: [84, 80], streu: 5},
           ]},
         ],
         p: ["Felder: `klassen` mit `name`, `farbe`, `n`, `mitte` als `[x, y]` (0 bis 100, y wächst nach oben) und `streu`; `grenze` ist `linie` oder `kreis`.",
             "Die Punkte sind zufällig, aber bei gleicher Spezifikation immer gleich. Das Bild veranschaulicht nur, es zeigt keine Messdaten.",
             "`visual` darf eine Liste sein: Die Bilder stehen dann nebeneinander, wenn der Platz reicht."]},

        {h: "Matrix: eine Konfusionsmatrix",
         kurz: "Vier Felder zeigen, wo ein Prüfmodell richtig und wo es falsch liegt. Symbole ergänzen die Farben.",
         visual: {typ: "matrix", xtitel: "Vorhersage", ytitel: "Wirklichkeit", x: ["Defekt", "Ok"], y: ["Defekt", "Ok"], zellen: [
           [{text: "46 erkannt", ton: "gut"}, {text: "4 übersehen", ton: "schlecht"}],
           [{text: "6 Fehlalarme", ton: "schlecht"}, {text: "144 richtig ok", ton: "gut"}],
         ]},
         p: ["Felder: `x`, `y` (Beschriftungen), `zellen` als Zeilen von Zellen mit `text` und `ton` (`gut`, `schlecht`, `neutral`), optional `xtitel` und `ytitel`."]},

        {h: "Skala: ein Spektrum mit Marker",
         kurz: "Der Marker gleitet an seine Stelle. So zeigt sich, wo etwas zwischen zwei Polen liegt.",
         visual: {typ: "skala", links: "Sachlich und vorhersehbar", rechts: "Kreativ und überraschend", marker: 0.28, label: "Zusammenfassung eines Berichts"},
         p: ["Felder: `links`, `rechts`, `marker` (0 bis 1), optional `label` über dem Marker."]},

        {h: "Token: ein Satz in Stücken",
         kurz: "Ein Sprachmodell liest keine Wörter, sondern Stücke. Der Satz zerfällt, die Stücke lösen sich nacheinander.",
         visual: {typ: "token", stuecke: ["Der", " Him", "mel", " ist", " heute", " kla", "r", "."]},
         p: ["Felder: `stuecke` als Liste. Ein Punkt vor einem Stück steht für das Leerzeichen, das zum Token gehört."]},

        {h: "Quelle: ein Bild aus den Beispieldaten",
         kurz: "Ein echtes Bild aus dem Beispielordner, mit Bildunterschrift und Textalternative.",
         visual: {typ: "quelle", src: "/static/beispiele/fertigung-sichtpruefung/ausschuss/01.jpg", alt: "Graue Metallscheibe mit mehreren Kratzern, aufgenommen von oben", unter: "Ausschuss aus dem Beispielsatz der Sichtprüfung (künstlich erzeugt)"},
         p: ["Felder: `src` (nur Dateien unter `/static/`), `alt` (Pflicht), optional `unter`."]},
      ],
      mitnehmen: [
        "Jedes Bild hat einen Typ und kurze Beschriftungen statt Sätzen.",
        "Animationen starten beim Sichtbarwerden und stehen still, wenn der Besucher weniger Bewegung wünscht.",
      ],
      weiter: ["karte"],
    },
  },
});
})();
