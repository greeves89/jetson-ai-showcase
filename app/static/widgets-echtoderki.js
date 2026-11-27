/* KI-Labor: Baustein "Echt oder KI?" (Seite echt-oder-ki, Widget "echt-oder-ki").
   Vertrag siehe app.js: KL.widgets.<name> = function (root, seite) { ...; return { destroy() {} } }
   Zwölf Bildkarten aus /static/materialien/bildkarten/karte-NN.jpg, je Durchlauf gemischt.
   Die Daten (KARTEN) spiegeln scripts/materialien_bauen.mjs (Quelle der Wahrheit) und die Quellenangaben aus
   app/static/beispiele/fotos/meta.json. Bei Änderungen dort: hier nachziehen.
   Kein Server, kein Speichern: Der Stand lebt nur im Arbeitsspeicher der Seite, nichts wird gesendet. */
(function () {
  "use strict";
  const KL = window.KL;
  const { h, icon } = KL;

  const BASIS = "/static/materialien/bildkarten/";
  const PDF = "/static/materialien/bildkarten-echt-oder-ki.pdf";
  const KI_QUELLE = "KI-Bild, selbst erzeugt (Bildmodell, 22.11.2026).";
  const foto = (urheber, lizenz) => "Foto: " + urheber + ", " + lizenz + ", Wikimedia Commons.";
  const KARTEN = [
    { n: 1, ki: false, motiv: "Containerhof mit Lastwagen", hinweis: "Schrift auf dem Container lesbar und logisch.", quelle: foto("Yinan Chen", "Public Domain") },
    { n: 2, ki: true, motiv: "Bergsee bei Sonnenaufgang", hinweis: "Licht wie auf einem Poster, Spiegelung zu gleichmäßig. Keine Hände, keine Schrift.", quelle: KI_QUELLE },
    { n: 3, ki: true, motiv: "Fuchs in einer Herbstwiese", hinweis: "Fell und Wiese wirken wie gemalt, Hintergrund weich und sauber.", quelle: KI_QUELLE },
    { n: 4, ki: false, motiv: "Emaille-Tassen auf einem Tisch", hinweis: "Stark gefiltert und unscharf, aber echt.", quelle: foto("André Freitas andrekerygma", "CC0") },
    { n: 5, ki: false, motiv: "Neubau und Straße in der Ferne", hinweis: "Viele kleine Details, lesbare Schilder.", quelle: foto("Retired electrician", "CC0") },
    { n: 6, ki: true, motiv: "Spaghetti mit Tomatensoße", hinweis: "Soße und Nudeln sehr gleichmäßig, Licht wie im Werbefoto, Wasserglas prüfen.", quelle: KI_QUELLE },
    { n: 7, ki: false, motiv: "Leere Regale im Laden", hinweis: "Preisschilder lesbar und stimmig, Unordnung wie im echten Laden.", quelle: foto("citytransportinfo", "CC0") },
    { n: 8, ki: true, motiv: "Fachwerkhaus", hinweis: "Fenster, Balken und Dach fast zu regelmäßig, Ränder prüfen.", quelle: KI_QUELLE },
    { n: 9, ki: true, motiv: "Fahrrad an einer Ziegelwand", hinweis: "Sehr sauber, Spiegelung im Fenster und Speichen prüfen.", quelle: KI_QUELLE },
    { n: 10, ki: false, motiv: "Kleintransporter in einer Einkaufsstraße", hinweis: "Viele Schilder mit lesbarer Schrift, dichter Hintergrund.", quelle: foto("Syced", "CC0") },
    { n: 11, ki: false, motiv: "Baustelle in einer Stadtstraße", hinweis: "Verkehrsschild, Absperrband und Häuser im Hintergrund stimmig, viele kleine Details.", quelle: foto("Fons Heijnsbroek", "CC0") },
    { n: 12, ki: true, motiv: "Regentropfen an einer Haltestelle", hinweis: "Tropfen sehr gleichmäßig, Lichter auf der Straße passen nicht ganz.", quelle: KI_QUELLE },
  ];
  const bildUrl = (k) => BASIS + "karte-" + String(k.n).padStart(2, "0") + ".jpg";
  KL.echtOderKiKarten = KARTEN;        // der Klassenmodus (demo-klasse.js) nutzt dieselben Karten und Bilder
  KL.echtOderKiBild = bildUrl;

  function mischen(feld) {
    const a = feld.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function einordnung(punkte, n) {
    const kopf = punkte >= n - 1 ? "Stark. Aber verlass dich nicht darauf."
      : punkte >= Math.round(n * 0.7) ? "Gut gesehen, aber nicht fehlerfrei."
        : punkte >= Math.round(n * 0.45) ? "Etwa so viel wie Raten, und das ist normal."
          : "Weniger als Raten. Das passiert vielen.";
    return kopf;
  }

  KL.widgets["echt-oder-ki"] = function (root) {
    const wurzel = h("div", { class: "eok", tabindex: "-1" });
    root.append(wurzel);
    let reihe = mischen(KARTEN);
    let idx = 0;
    let phase = "frage"; // frage | aufloesung | ende
    let antworten = []; // { karte, tipp (true = KI), richtig }
    let fokusZiel = null;

    const live = h("p", { class: "eok-live", role: "status", "aria-live": "polite" });
    const stage = h("div", { class: "eok-stage" });
    wurzel.append(stage, h("p", { class: "eok-freunde" }, icon("users"), h("span", null, "Mit Freunden spielen: zählt, wer mehr richtig hat.")), live);

    const punkte = () => antworten.filter((a) => a.richtig).length;

    function fortschritt() {
      return h("div", { class: "eok-kopf" },
        h("span", { class: "eok-zahl" }, "Karte " + (idx + 1) + " von " + reihe.length),
        h("span", { class: "eok-stand" }, punkte() + " richtig"),
        h("div", { class: "eok-balken", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(reihe.length), "aria-valuenow": String(idx + (phase === "aufloesung" ? 1 : 0)), "aria-label": "Fortschritt" },
          h("span", { style: "width:" + Math.round(((idx + (phase === "aufloesung" ? 1 : 0)) / reihe.length) * 100) + "%" })));
    }

    function bildBox(k, aufgedeckt) {
      const img = h("img", { class: "eok-bild", src: bildUrl(k), width: "960", height: "720", loading: "lazy", decoding: "async",
        alt: aufgedeckt ? "Bildkarte " + k.n + ": " + k.motiv : "Bildkarte " + k.n });
      return h("div", { class: "eok-bildbox" }, img);
    }

    function kiHinweis() {
      return h("p", { class: "ki-hinweis eok-ki" }, icon("bot"),
        h("span", null, "KI-Bilder dieser Karten wurden mit einem Bildgenerator erstellt. Die echten Fotos haben freie Lizenzen. ",
          h("a", { href: "/lizenzen" }, "Lizenzen und Quellen")));
    }

    function zeigeFrage() {
      phase = "frage";
      const k = reihe[idx];
      const echtB = h("button", { type: "button", class: "btn eok-wahl eok-echt", "data-wahl": "echt", onclick: () => antwort(false) },
        icon("camera"), h("span", null, "Echt"), h("kbd", { "aria-hidden": "true" }, "1"));
      const kiB = h("button", { type: "button", class: "btn eok-wahl eok-kib", "data-wahl": "ki", onclick: () => antwort(true) },
        icon("bot"), h("span", null, "KI"), h("kbd", { "aria-hidden": "true" }, "2"));
      stage.replaceChildren(
        fortschritt(),
        h("p", { class: "eok-frage" }, "Ist dieses Bild echt oder von einer KI erzeugt?"),
        bildBox(k, false),
        h("div", { class: "eok-wahlzeile", role: "group", "aria-label": "Deine Antwort" }, echtB, kiB),
        h("p", { class: "eok-tasten" }, icon("info"), h("span", null, "Tastatur: 1 für Echt, 2 für KI, Enter für Weiter.")));
      stage.append(kiHinweis());
      live.textContent = "";
      if (fokusZiel === "frage") echtB.focus({ preventScroll: true });
      fokusZiel = null;
    }

    function antwort(tippKi) {
      if (phase !== "frage") return;
      const k = reihe[idx];
      const richtig = tippKi === k.ki;
      antworten.push({ karte: k, tipp: tippKi, richtig });
      phase = "aufloesung";
      const letzte = idx === reihe.length - 1;
      const weiter = h("button", { type: "button", class: "btn primary eok-weiter", onclick: voran },
        h("span", null, letzte ? "Ergebnis ansehen" : "Weiter"), icon("arrow-right"));
      const urteil = h("p", { class: "eok-urteil " + (richtig ? "ok" : "nein"), tabindex: "-1" },
        icon(richtig ? "circle-check" : "circle-x"),
        h("span", null, (richtig ? "Richtig. " : "Leider falsch. ") + "Das Bild ist " + (k.ki ? "von einer KI erzeugt." : "ein echtes Foto.")));
      stage.replaceChildren(
        fortschritt(),
        bildBox(k, true),
        urteil,
        h("div", { class: "eok-aufl" },
          h("p", { class: "eok-motiv" }, h("b", null, "Zu sehen: "), k.motiv + "."),
          h("h3", null, "Woran du es sehen konntest"),
          h("p", null, k.hinweis),
          h("p", { class: "eok-quelle" }, icon(k.ki ? "bot" : "image"), h("span", null, k.quelle))),
        h("div", { class: "eok-wahlzeile" }, weiter),
        kiHinweis());
      live.textContent = (richtig ? "Richtig. " : "Leider falsch. ") + "Das Bild ist " + (k.ki ? "von einer KI erzeugt." : "ein echtes Foto.") + " " + k.hinweis;
      weiter.focus({ preventScroll: true });
    }

    function voran() {
      if (phase !== "aufloesung") return;
      if (idx >= reihe.length - 1) { zeigeEnde(); return; }
      idx += 1;
      fokusZiel = "frage";
      zeigeFrage();
    }

    function zeigeEnde() {
      phase = "ende";
      const n = reihe.length, p = punkte();
      const kiRichtig = antworten.filter((a) => a.karte.ki && a.richtig).length, kiGesamt = antworten.filter((a) => a.karte.ki).length;
      const echtRichtig = antworten.filter((a) => !a.karte.ki && a.richtig).length, echtGesamt = n - kiGesamt;
      const zeilen = antworten.map((a, i) => h("li", { class: a.richtig ? "ok" : "nein" },
        icon(a.richtig ? "circle-check" : "circle-x"),
        h("span", null, h("b", null, "Karte " + a.karte.n + ": "), a.karte.motiv + ", " + (a.karte.ki ? "KI" : "echt") + ". ",
          h("i", null, a.richtig ? "Du lagst richtig." : "Du hattest " + (a.tipp ? "KI" : "echt") + " getippt."))));
      const nochmal = h("button", { type: "button", class: "btn primary eok-nochmal", onclick: neu }, icon("refresh-cw"), h("span", null, "Noch einmal"));
      const druck = h("a", { class: "btn eok-druck", href: PDF, download: "ki-labor-bildkarten-echt-oder-ki.pdf", target: "_blank", rel: "noopener" },
        icon("download"), h("span", null, "Karten zum Ausdrucken"));
      stage.replaceChildren(
        h("div", { class: "eok-ende" },
          h("p", { class: "eok-ergebnis", tabindex: "-1" }, h("span", { class: "eok-gross" }, p + " von " + n), " richtig"),
          h("p", { class: "eok-einordnung" }, h("b", null, einordnung(p, n) + " "),
            "Herkunft prüfen schlägt Hinsehen: ", h("a", { href: "/quellen-pruefen" }, "so geht das"), "."),
          h("div", { class: "eok-wahlzeile" }, nochmal, druck),
          h("details", { class: "eok-liste" }, h("summary", null, "Alle zwölf Karten im Überblick"),
            h("p", { class: "eok-teil" }, "Echte Fotos: " + echtRichtig + " von " + echtGesamt + " erkannt. KI-Bilder: " + kiRichtig + " von " + kiGesamt + " erkannt."),
            h("ul", null, zeilen),
            h("p", { class: "eok-privat" }, icon("shield-check"), h("span", null, "Dein Ergebnis bleibt in diesem Fenster. Es wird nicht gespeichert und nicht gesendet."))),
          kiHinweis()),
      );
      live.textContent = "Ergebnis: " + p + " von " + n + " richtig.";
      const erg = stage.querySelector(".eok-ergebnis");
      if (erg) erg.focus({ preventScroll: true });
    }

    function neu() {
      reihe = mischen(KARTEN);
      idx = 0;
      antworten = [];
      fokusZiel = "frage";
      zeigeFrage();
    }

    /* Tastatur: 1 = Echt, 2 = KI, Enter = Weiter (ohne Fokus auf einem Knopf), Pfeile wechseln den Fokus zwischen den Knöpfen.
       Der Hörer hängt am Dokument: Die Tasten gelten, solange die Seite aktiv ist und kein Eingabefeld oder Dialog den Fokus hat. */
    function taste(e) {
      if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (document.querySelector("dialog[open]") || !wurzel.isConnected) return;
      if (e.key === "Enter" && phase === "aufloesung" && !(t && t.closest && t.closest("button, a, summary"))) { e.preventDefault(); voran(); return; }
      if (phase === "frage") {
        if (e.key === "1") { e.preventDefault(); antwort(false); }
        else if (e.key === "2") { e.preventDefault(); antwort(true); }
        else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          const b = stage.querySelector(e.key === "ArrowLeft" ? '[data-wahl="echt"]' : '[data-wahl="ki"]');
          if (b) b.focus({ preventScroll: true });
        }
      } else if (phase === "aufloesung") {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          const w = stage.querySelector(".eok-weiter");
          if (w) { e.preventDefault(); w.focus({ preventScroll: true }); }
        }
      }
    }
    document.addEventListener("keydown", taste);

    zeigeFrage();
    return { destroy() { document.removeEventListener("keydown", taste); } };
  };
})();
