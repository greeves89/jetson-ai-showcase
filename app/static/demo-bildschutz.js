/* demo-bildschutz: Labor "Bild schützen: freistellen und verpixeln".
   Nutzt den Kamera-Baustein aus demos.js (KL.kamera) mit der Konfiguration KL.kameraModi.bildschutz. Der Kanal ist
   /ws/vision?modus=bildschutz (app/lab_bildschutz.py). Der Umschalter, die Effekte, die Farbwahl, die Regler und der
   Vorher-Nachher-Schieber stehen in extra(api) und schicken ihre Werte als Steuernachricht an den Jetson.
   SICHERHEIT: Alles, was aus dem Netz kommt (Gesichtsdaten, Zahlen), wird nur per h(...)/textContent eingesetzt, nie als HTML.
   Datenschutz: Das Vergleichsbild liegt nur in einem Canvas im Browser, es wird nicht gespeichert und nicht verschickt. */
(function () {
  "use strict";
  const KL = window.KL;
  const { h } = KL;
  const ic = (n) => KL.icon(n);

  const FUNKTIONEN = [
    { id: "freistellen", name: "Person freistellen", symbol: "scissors", effekte: ["unscharf", "farbe", "muster", "maske", "original"] },
    { id: "verpixeln", name: "Gesichter unkenntlich machen", symbol: "eye-off", effekte: ["mosaik", "weich", "balken"] },
  ];
  const EFFEKT_NAME = {
    original: "Original", unscharf: "Hintergrund unscharf", farbe: "Einfarbig", muster: "Muster", maske: "Nur die Maske",
    mosaik: "Mosaik", weich: "Weichzeichner", balken: "Schwarzer Balken",
  };
  const FARBEN = [["gruen", "Grün", "#00b140"], ["blau", "Blau", "#145ac8"], ["rot", "Rot", "#c8323c"], ["orange", "Orange", "#f08c1e"],
    ["grau", "Grau", "#808080"], ["weiss", "Weiß", "#f5f5f5"], ["schwarz", "Schwarz", "#0f0f0f"]];
  const MUSTER = [["verlauf", "Verlauf"], ["karos", "Karos"], ["wellen", "Wellen"]];
  const BLOECKE = { 1: 40, 2: 30, 3: 24, 4: 18, 5: 14, 6: 10, 7: 8, 8: 6, 9: 5, 10: 4 };      // wie BLOECKE in lab_bildschutz.py

  const zahl = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  function extra(api) {
    const wert = { funktion: "freistellen", effekt: "unscharf", farbe: "gruen", muster: "verlauf", kante: 3, staerke: 5 };
    let letzte = null;
    const senden = () => api.sende({ effekt: wert.effekt, farbe: wert.farbe, muster: wert.muster, kante: wert.kante, staerke: wert.staerke });
    const knopf = (text, symbol, an, klick, klasse) => {
      const b = h("button", { type: "button", class: "chip bs-knopf" + (klasse ? " " + klasse : ""), "aria-pressed": an ? "true" : "false", onclick: klick }, symbol ? ic(symbol) : null, text);
      return b;
    };

    // ---- Umschalter der Funktion
    const funkKnoepfe = FUNKTIONEN.map((f) => knopf(f.name, f.symbol, false, () => waehleFunktion(f.id), "bs-funktion"));
    const funkZeile = h("div", { class: "bs-reihe", role: "group", "aria-label": "Funktion wählen" }, funkKnoepfe);

    // ---- Effekte (werden je Funktion neu gebaut)
    const effektZeile = h("div", { class: "bs-reihe", role: "group", "aria-label": "Effekt wählen" });
    const farbZeile = h("div", { class: "bs-reihe", role: "group", "aria-label": "Farbe wählen" },
      FARBEN.map(([id, name, css]) => h("button", { type: "button", class: "bs-farbe", "aria-pressed": "false", "aria-label": name, title: name, dataset: { farbe: id }, style: "background:" + css,
        onclick: () => { wert.farbe = id; aktualisiere(); senden(); } })));
    const musterZeile = h("div", { class: "bs-reihe", role: "group", "aria-label": "Muster wählen" },
      MUSTER.map(([id, name]) => knopf(name, null, false, () => { wert.muster = id; aktualisiere(); senden(); }, "bs-muster")));
    musterZeile.querySelectorAll("button").forEach((b, i) => { b.dataset.muster = MUSTER[i][0]; });

    // ---- Regler
    const kanteIn = h("input", { type: "range", id: "bs-kante", min: 0, max: 10, step: 1, value: wert.kante, "aria-describedby": "bs-kante-satz" });
    const kanteOut = h("output", { for: "bs-kante" }, String(wert.kante));
    const kanteSatz = h("p", { class: "d-hinweis", id: "bs-kante-satz" });
    const kanteRegler = h("div", { class: "regler" }, h("label", { for: "bs-kante" }, "Kantenweichheit"), kanteIn, kanteOut);
    const staerkeIn = h("input", { type: "range", id: "bs-staerke", min: 1, max: 10, step: 1, value: wert.staerke, "aria-describedby": "bs-staerke-satz" });
    const staerkeOut = h("output", { for: "bs-staerke" }, "5");
    const staerkeSatz = h("p", { class: "d-hinweis", id: "bs-staerke-satz" });
    const staerkeRegler = h("div", { class: "regler" }, h("label", { for: "bs-staerke" }, "Blockgröße"), staerkeIn, staerkeOut);
    let sendeTimer = null;
    const verzoegert = () => { clearTimeout(sendeTimer); sendeTimer = setTimeout(senden, 120); };
    api.L.onEnde(() => clearTimeout(sendeTimer));
    kanteIn.addEventListener("input", () => { wert.kante = Number(kanteIn.value); aktualisiere(); verzoegert(); });
    staerkeIn.addEventListener("input", () => { wert.staerke = Number(staerkeIn.value); aktualisiere(); verzoegert(); });

    // ---- Erklärung zum Effekt und Gesichtsliste
    const erklaerung = h("p", { class: "bs-erklaerung", "aria-live": "polite" });
    const gesichtsListe = h("ul", { class: "bs-gesichter", "aria-live": "polite" });
    const leger = h("p", { class: "d-hinweis bs-legende", hidden: true },
      "Weiß: Das Netz ist sicher, dass hier die Person ist. Schwarz: Hintergrund. Grau: Das Netz ist unsicher. Jeder Pixel ist eine Wahrscheinlichkeit.");

    // ---- Vorher-Nachher-Schieber (Canvas im Browser, nichts wird gespeichert)
    const cv = h("canvas", { class: "bs-vorher", width: 480, height: 360, "aria-hidden": "true" });
    const nachher = h("img", { class: "bs-nachher", alt: "Ergebnis des Jetson, rechts vom Schieber", width: 480, height: 360 });
    const schieber = h("input", { type: "range", min: 0, max: 100, step: 1, value: 50, id: "bs-schieber", "aria-label": "Schieber: links dein Kamerabild, rechts das Ergebnis" });
    const buehne = h("div", { class: "bs-buehne" }, nachher, cv);
    const vergleich = h("details", { class: "bs-vergleich" },
      h("summary", null, ic("split"), "Vorher und nachher mit dem Schieber vergleichen"),
      h("p", { class: "d-hinweis" }, "Links siehst du dein unverändertes Kamerabild, rechts das Ergebnis. Das Bild links bleibt in deinem Browser."),
      buehne, h("div", { class: "bs-schieberzeile" }, h("label", { for: "bs-schieber" }, "Vorher"), schieber, h("span", null, "Nachher")));
    const schnitt = () => { cv.style.clipPath = "inset(0 " + (100 - Number(schieber.value)) + "% 0 0)"; };
    schieber.addEventListener("input", schnitt);
    schnitt();
    function vergleichZeichnen(video) {
      if (!vergleich.open || !video || !video.videoWidth) return;
      const vw = video.videoWidth, vh = video.videoHeight;
      let sw = vw, sh = vw * 3 / 4;
      if (sh > vh) { sh = vh; sw = vh * 4 / 3; }          // gleicher Zuschnitt wie beim Senden (4 zu 3 aus der Mitte)
      try { cv.getContext("2d").drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, cv.width, cv.height); } catch (e) { /* ohne Bild */ }
    }

    // ---- Zustand abbilden
    function waehleFunktion(id) {
      wert.funktion = id;
      const f = FUNKTIONEN.find((x) => x.id === id);
      if (!f.effekte.includes(wert.effekt)) wert.effekt = f.effekte[0];
      aktualisiere(); senden();
    }
    function effektKnoepfe() {
      const f = FUNKTIONEN.find((x) => x.id === wert.funktion);
      effektZeile.replaceChildren(...f.effekte.map((e) => knopf(EFFEKT_NAME[e], null, wert.effekt === e, () => { wert.effekt = e; aktualisiere(); senden(); }, "bs-effekt")));
    }
    function aktualisiere() {
      funkKnoepfe.forEach((b, i) => b.setAttribute("aria-pressed", FUNKTIONEN[i].id === wert.funktion ? "true" : "false"));
      effektKnoepfe();
      const e = wert.effekt, frei = wert.funktion === "freistellen";
      farbZeile.hidden = !(e === "farbe" || e === "muster");
      farbZeile.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.farbe === wert.farbe ? "true" : "false"));
      musterZeile.hidden = e !== "muster";
      musterZeile.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.muster === wert.muster ? "true" : "false"));
      const kanteZeigen = frei && (e === "unscharf" || e === "farbe" || e === "muster");
      kanteRegler.hidden = !kanteZeigen; kanteSatz.hidden = !kanteZeigen;
      kanteOut.textContent = String(wert.kante);
      kanteSatz.textContent = wert.kante === 0
        ? "Stufe 0: Jeder Pixel gehört ganz zur Person oder ganz zum Hintergrund. Der Rand wirkt gezackt, wie eine Treppe."
        : wert.kante >= 8 ? "Stufe " + wert.kante + ": Der Rand ist sehr weich. Er wirkt natürlicher, aber ein Saum aus altem Hintergrund und Haar verschwimmt mit."
          : "Stufe " + wert.kante + ": Der Rand geht weich in den neuen Hintergrund über. Das versteckt kleine Fehler der Maske.";
      const pixZeigen = !frei && (e === "mosaik" || e === "weich");
      staerkeRegler.hidden = !pixZeigen; staerkeSatz.hidden = !pixZeigen;
      staerkeOut.textContent = String(wert.staerke);
      const n = BLOECKE[wert.staerke];
      staerkeSatz.textContent = (e === "mosaik" ? "Stufe " + wert.staerke + ": Dein Gesicht wird quer in " + n + " Blöcke geteilt. " : "Stufe " + wert.staerke + ": Der Weichzeichner verwischt so stark wie ein Mosaik mit " + n + " Blöcken quer. ")
        + (wert.staerke <= 3 ? "Das ist fein: Wer dich kennt, erkennt dich oft noch." : wert.staerke >= 8 ? "Das ist grob: Du selbst erkennst dich kaum noch. Für eine Maschine kann trotzdem etwas übrig sein." : "Probiere selbst, ab welcher Stufe du dich nicht mehr erkennst.");
      leger.hidden = e !== "maske";
      erklaerung.textContent = {
        original: "Ohne Effekt. Der Jetson rechnet die Maske trotzdem und zeigt dir in der Messung, wie viel vom Bild er für die Person hält.",
        unscharf: "Alles außer der Person wird verwischt. So machen es Videokonferenzen, wenn dein Zimmer unscharf werden soll.",
        farbe: "Alles außer der Person bekommt eine Farbe. Das ist ein Greenscreen ohne grüne Wand: Das Netz findet die Person, nicht die Farbe.",
        muster: "Alles außer der Person wird durch ein Bild ersetzt, das der Jetson selbst rechnet. Es kommt kein fremdes Bild ins Spiel.",
        maske: "So sieht der Jetson dein Bild, wenn es nur um die Frage geht: Person oder nicht? Das ist die Maske.",
        mosaik: "Jedes Gesicht wird in Kästchen zerlegt, jedes Kästchen bekommt den Mittelwert seiner Farben.",
        weich: "Jedes Gesicht wird verwischt. Das sieht weich aus, löscht aber keine Information: Die Werte sind nur vermischt.",
        balken: "Jedes Gesicht wird mit einem schwarzen Rechteck überdeckt. Darunter steht nichts mehr, das sich zurückholen ließe.",
      }[e];
      listeZeigen();
    }
    function listeZeigen() {
      const verpix = wert.funktion === "verpixeln";
      gesichtsListe.hidden = !verpix;
      if (!verpix) return;
      const g = letzte && letzte.funktion === "verpixeln" ? letzte.gesichter || [] : [];
      if (!g.length) {
        gesichtsListe.replaceChildren(h("li", { class: "d-leise" }, letzte && letzte.funktion === "verpixeln" ? "Kein Gesicht gefunden. Was der Jetson nicht findet, bleibt unverpixelt." : "Schau in die Kamera. Der Jetson sucht Gesichter und macht sie unkenntlich."));
        return;
      }
      gesichtsListe.replaceChildren(...g.map((x) => {
        const werte = wert.effekt === "balken" ? "Im Balken bleibt " + x.werte + " Farbwert von " + zahl(x.pixel) + " Pixeln."
          : wert.effekt === "mosaik" ? "Vom Gesicht bleiben " + zahl(x.werte) + " Farbwerte von " + zahl(x.pixel) + " Pixeln."
            : "Alle " + zahl(x.pixel) + " Pixel bleiben als verwischte Werte erhalten.";
        return h("li", null, ic("scan-face"), h("span", null, h("b", null, "Gesicht " + x.nr + ": "), werte + (x.nachgefuehrt ? " Dieses Gesicht wurde gerade nicht gefunden und bleibt aus Vorsicht noch kurz verdeckt." : "")));
      }));
    }

    aktualisiere();
    api.beiVerbindung(senden);
    api.beiAntwort((d) => {
      letzte = d;
      if (d.bild && vergleich.open) { nachher.src = d.bild; vergleichZeichnen(api.video); }
      if (wert.funktion === "verpixeln" || d.funktion === "verpixeln") listeZeigen();
    });
    vergleich.addEventListener("toggle", () => { if (vergleich.open && letzte && letzte.bild) { nachher.src = letzte.bild; vergleichZeichnen(api.video); } });

    return KL.gruppe("Was soll der Jetson tun?", [
      funkZeile, effektZeile, farbZeile, musterZeile,
      h("div", { class: "bs-regler" }, kanteRegler, kanteSatz, staerkeRegler, staerkeSatz),
    ], { fuss: [erklaerung, leger, gesichtsListe, vergleich], klasse: "d-regler bs-gruppe" });
  }

  (KL.kameraModi = KL.kameraModi || {}).bildschutz = {
    dingMehr: "Erfasst",
    suche: "nach einer Person oder nach Gesichtern",
    beschriftung: ["Deine Kamera (unverändert)", "Vom Jetson zurück"],
    hinweis: "Das Ergebnis ist eine Schätzung eines KI-Modells. Haare, Glas und ähnliche Farben bringen die Maske durcheinander, und ein Gesicht, das der Jetson nicht findet, bleibt sichtbar. Das Bild links bleibt in deinem Browser. Es wird nichts gespeichert.",
    statusUrl: "/api/bild-schuetzen/status",
    statusFehler: "Dieses Labor ist auf diesem Jetson noch nicht eingerichtet: Das Modell zum Freistellen oder die Gesichtserkennung fehlt. Der Betreiber holt sie mit scripts/modelle_laden.sh.",
    treffer: (d) => (d.funktion === "verpixeln" ? d.anzahl + (d.anzahl === 1 ? " Gesicht" : " Gesichter") : (d.person_prozent || 0) + " % Person"),
    gefunden: (d) => (d.funktion === "verpixeln"
      ? "Gefunden: " + d.anzahl + (d.anzahl === 1 ? " Gesicht" : " Gesichter") + ", davon wurde " + (d.anzahl === 1 ? "es" : "jedes") + " unkenntlich gemacht (Suche " + (d.ms_suche || 0) + " Millisekunden)."
      : "Gefunden: Das Netz hält " + (d.person_prozent || 0) + " Prozent des Bildes für die Person (Netz " + (d.ms_netz || 0) + " Millisekunden)."),
    extra,
  };
  KL.demos = KL.demos || {};
  KL.demos["webcam-bildschutz"] = (root, seite) => KL.kamera(root, "bildschutz", seite);
})();
