/* KI-Labor: Bausteine der Stränge "Daten und Prognosen" und "KI im Betrieb" (widgets-prognose.js).
   Vertrag siehe app.js: KL.widgets.<name> = function (root, seite) { ...; return { destroy() {} } }
   Bausteine: baum-spiel, prognose-labor, anomalie-labor, empfehlungs-labor, kosten-rechner.
   Alles läuft im Browser, ohne Serveraufruf. Alle Daten sind erfunden. Zufall kommt aus einem eigenen,
   festen Generator, damit jeder Lauf wiederholbar ist. Texte aus Berechnungen gehen nur über textContent
   oder h(...) in die Seite, nie über innerHTML. Eigene CSS-Klassen beginnen mit pg- (widgets-prognose.css). */
(function () {
  "use strict";
  const KL = window.KL;
  if (!KL) return;
  const { h, icon, stats } = KL;
  const SVGNS = "http://www.w3.org/2000/svg";

  /* ------------------------------------------------------------ Hilfen */
  const klemme = (v, a, b) => Math.min(b, Math.max(a, v));
  const nfCache = {};
  function fmt(n, d = 1) {
    if (!isFinite(n)) return "offen";
    const key = String(d);
    const f = nfCache[key] || (nfCache[key] = new Intl.NumberFormat("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d }));
    const s = f.format(n);
    return /^-0([,.]0+)?$/.test(s) ? s.slice(1) : s;
  }
  const euro = (n, d = 2) => fmt(n, d) + " €";
  const mqDunkel = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  let zaehler = 0;
  const neueId = (p) => "pg-" + p + "-" + (++zaehler);

  function mqHoeren(mq, fn) {
    if (!mq) return () => {};
    if (mq.addEventListener) { mq.addEventListener("change", fn); return () => mq.removeEventListener("change", fn); }
    mq.addListener(fn); return () => mq.removeListener(fn);
  }
  /* Zufall mit festem Startwert (mulberry32) */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function normal(r) {
    let u = 0, v = 0;
    while (u === 0) u = r();
    while (v === 0) v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function svg(tag, attrs, ...kids) {
    const e = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (const c of kids.flat(Infinity)) {
      if (c == null || c === false) continue;
      e.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return e;
  }
  /* Ansage für Bildschirmleser: höchstens etwa zwei Aktualisierungen pro Sekunde */
  function sprecher(el) {
    let timer = null, letzte = 0, offen = "";
    const spuelen = () => { timer = null; letzte = Date.now(); el.textContent = offen; };
    return {
      sag(text) {
        offen = text;
        if (el.textContent === text) return;
        const d = Date.now() - letzte;
        if (d >= 500 && !timer) spuelen();
        else if (!timer) timer = setTimeout(spuelen, 500 - d);
      },
      stop() { clearTimeout(timer); timer = null; },
    };
  }
  /* Zeichenfläche mit Pixeldichte, Größenanpassung und höchstens einem Neuzeichnen pro Bild */
  function leinwand(canvas, zeichne) {
    const ctx = canvas.getContext("2d");
    let rahmen = 0;
    function jetzt() {
      rahmen = 0;
      const r = canvas.getBoundingClientRect();
      const d = window.devicePixelRatio || 1;
      const w = Math.max(10, Math.round(r.width)), hh = Math.max(10, Math.round(r.height));
      if (canvas.width !== Math.round(w * d) || canvas.height !== Math.round(hh * d)) { canvas.width = Math.round(w * d); canvas.height = Math.round(hh * d); }
      ctx.setTransform(d, 0, 0, d, 0, 0);
      ctx.clearRect(0, 0, w, hh);
      zeichne(ctx, w, hh);
    }
    const ro = "ResizeObserver" in window ? new ResizeObserver(() => plan()) : null;
    if (ro) ro.observe(canvas);
    function plan() { if (!rahmen) rahmen = requestAnimationFrame(jetzt); }
    return { plan, jetzt, destroy() { if (rahmen) cancelAnimationFrame(rahmen); rahmen = 0; if (ro) ro.disconnect(); } };
  }
  function farben() {
    return {
      text: css("--text"), leise: css("--leise"), linie: css("--linie"), linie2: css("--linie2"),
      flaeche: css("--flaeche"), flaeche2: css("--flaeche2"), flaeche3: css("--flaeche3"),
      akzent: css("--akzent"), gruen: css("--gruen"), orange: css("--orange"), rot: css("--rot"),
      k1: css("--k1"), k2: css("--k2"), k3: css("--k3"), k4: css("--k4"),
    };
  }
  const SCHRIFT = '12px -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,"Segoe UI",sans-serif';

  /* Schalter (Kippschalter) */
  function schalter(text, an, onChange) {
    const input = h("input", { type: "checkbox", role: "switch" });
    input.checked = !!an;
    input.addEventListener("change", () => onChange(input.checked));
    const el = h("label", { class: "pg-schalter" }, input, h("span", { class: "pg-sw", "aria-hidden": "true" }), h("span", null, text));
    return { el, input };
  }
  /* Reglerzeile im Stil von .regler: Beschriftung, Schieber, Wert */
  function regler(text, min, max, step, wert, format, onInput, name) {
    const id = neueId("regler");
    const input = h("input", { type: "range", id, min, max, step, "data-regler": name || null });
    input.value = wert;
    const out = h("output", { for: id }, format(wert));
    input.addEventListener("input", () => { out.textContent = format(Number(input.value)); onInput(Number(input.value)); });
    const el = h("div", { class: "regler" }, h("label", { for: id }, text), input, out);
    return { el, input, out, setze(v) { input.value = v; out.textContent = format(Number(v)); } };
  }
  function hinweis(text) { return h("p", { class: "pg-hinweis" }, icon("info"), h("span", null, text)); }
  function kachel(titel, wert, klein) {
    const w = h("b", null, wert);
    const el = h("div", { class: "messwert" }, titel, w, klein != null ? h("small", null, klein) : null);
    return { el, set(v, k) { w.textContent = v; if (klein != null && k != null) el.lastChild.textContent = k; } };
  }
  /* Gruppe aus Chips, genau einer ist gedrückt */
  function chipGruppe(eintraege, wert, onWahl, label) {
    const knoepfe = {};
    const el = h("div", { class: "pg-chips", role: "group", "aria-label": label });
    for (const [k, text] of eintraege) {
      const b = h("button", { type: "button", class: "chip", "aria-pressed": k === wert ? "true" : "false", dataset: { wert: k } }, text);
      b.addEventListener("click", () => { setze(k); onWahl(k); });
      knoepfe[k] = b; el.append(b);
    }
    function setze(k) { for (const [kk, b] of Object.entries(knoepfe)) b.setAttribute("aria-pressed", kk === k ? "true" : "false"); }
    return { el, setze };
  }
  function aufraeumer(liste) { return { destroy() { for (const f of liste) { try { f(); } catch (e) { console.error(e); } } liste.length = 0; } }; }

  /* ============================================================ 1. baum-spiel */
  /* Spalten: 0 Zahlungsrückstände (1 = ja), 1 Einkommen (1 niedrig, 2 mittel, 3 hoch), 2 Kontodauer in Jahren,
     3 Alter, 4 Ergebnis (1 = ausgefallen). Alles erfunden. */
  const BAUM_TRAIN = [
    [1, 1, 1, 23, 1], [1, 2, 3, 41, 1], [1, 1, 2, 35, 1], [1, 3, 6, 52, 0], [1, 2, 1, 29, 1],
    [1, 1, 4, 47, 1], [1, 3, 2, 38, 1], [0, 1, 2, 26, 0], [0, 2, 5, 44, 0], [0, 3, 8, 51, 0],
    [0, 1, 1, 22, 1], [0, 2, 3, 33, 0], [0, 3, 4, 39, 0], [0, 2, 7, 58, 0], [0, 1, 6, 49, 0],
    [0, 3, 2, 31, 0], [0, 2, 1, 27, 1], [0, 1, 3, 36, 0], [0, 3, 9, 61, 0], [0, 2, 4, 30, 0],
  ];
  const BAUM_TEST = [
    [1, 2, 2, 40, 1], [1, 1, 3, 33, 1], [1, 3, 5, 48, 0], [0, 1, 1, 24, 0],
    [0, 2, 1, 28, 0], [0, 3, 3, 45, 0], [0, 2, 6, 37, 0], [1, 3, 1, 30, 1],
  ];
  const EK_NAME = ["", "niedrig", "mittel", "hoch"];
  const jahre = (n) => n + (n === 1 ? " Jahr" : " Jahre");
  const BAUM_FRAGEN = (() => {
    const l = [{ id: "rueck", f: 0, op: ">=", t: 1, text: "Gibt es Zahlungsrückstände?", kurz: "Zahlungsrückstände" },
      { id: "ek1", f: 1, op: "<=", t: 1, text: "Ist das Einkommen niedrig?", kurz: "Einkommen niedrig" },
      { id: "ek2", f: 1, op: "<=", t: 2, text: "Ist das Einkommen höchstens mittel?", kurz: "Einkommen ≤ mittel" }];
    for (const t of [1, 2, 3, 4, 5, 6]) l.push({ id: "konto" + t, f: 2, op: "<=", t, text: "Besteht das Konto höchstens " + jahre(t) + "?", kurz: "Konto ≤ " + jahre(t) });
    for (const t of [25, 30, 35, 40, 45, 50]) l.push({ id: "alter" + t, f: 3, op: "<=", t, text: "Ist die Person höchstens " + t + " Jahre alt?", kurz: "Alter ≤ " + t + " Jahre" });
    return l;
  })();

  KL.widgets["baum-spiel"] = function (root) {
    root.classList.add("pg-wid", "pg-baum");
    const ab = [];
    let ids = 0;
    let maxTiefe = 3, minBlatt = 1, vorschlag = null;

    const ja = (c, x) => (c.op === "<=" ? x[c.f] <= c.t : x[c.f] >= c.t);
    const teile = (rows, c) => { const l = [], r = []; for (const x of rows) (ja(c, x) ? l : r).push(x); return { l, r }; };
    const zaehle = (rows) => { let a = 0; for (const x of rows) a += x[4]; return [rows.length - a, a]; };
    const gini = (rows) => { const n = rows.length; if (!n) return 0; const p = zaehle(rows)[1] / n; return 2 * p * (1 - p); };
    const gewichtet = (l, r) => (l.length * gini(l) + r.length * gini(r)) / (l.length + r.length);
    const mehrheit = (rows) => (zaehle(rows)[1] * 2 > rows.length ? 1 : 0);
    const klasse = (y) => (y ? "ausgefallen" : "zurückgezahlt");
    const knoten = (rows, tiefe, eltern, seite) => ({ id: ++ids, rows, tiefe, q: null, kids: null, eltern, seite });

    let wurzel = knoten(BAUM_TRAIN, 0, null, null);
    let auswahl = wurzel;

    const istBlatt = (n) => !n.q || !n.kids || n.tiefe >= maxTiefe;
    function blaetter(n, out = []) { if (istBlatt(n)) out.push(n); else { blaetter(n.kids[0], out); blaetter(n.kids[1], out); } return out; }
    function tiefeReal(n) { return istBlatt(n) ? 0 : 1 + Math.max(tiefeReal(n.kids[0]), tiefeReal(n.kids[1])); }
    function sagt(x) { let n = wurzel; while (!istBlatt(n)) n = ja(n.q, x) ? n.kids[0] : n.kids[1]; return mehrheit(n.rows); }
    const trefferZahl = (rows) => rows.reduce((a, x) => a + (sagt(x) === x[4] ? 1 : 0), 0);
    function pfadText(n) {
      const teile_ = [];
      for (let k = n; k.eltern; k = k.eltern) teile_.unshift(k.eltern.q.kurz + ": " + (k.seite ? "ja" : "nein"));
      return teile_.length ? teile_.join(", dann ") : "ganz oben, alle 20 Trainingszeilen";
    }
    function bewerte(rows) {
      const res = [];
      for (const c of BAUM_FRAGEN) {
        const { l, r } = teile(rows, c);
        const ok = l.length >= minBlatt && r.length >= minBlatt;
        res.push({ c, l, r, ok, g: l.length && r.length ? gewichtet(l, r) : gini(rows) });
      }
      res.sort((a, b) => (a.ok === b.ok ? a.g - b.g : a.ok ? -1 : 1));
      return res;
    }
    function frageStellen(n, c) {
      const { l, r } = teile(n.rows, c);
      n.q = c; n.kids = [knoten(l, n.tiefe + 1, n, true), knoten(r, n.tiefe + 1, n, false)];
      vorschlag = null; alles();
    }
    function kannFragen(n) { return n.tiefe < maxTiefe && n.rows.length > 1 && gini(n.rows) > 0; }
    function baueAuto(n) {
      if (!kannFragen(n)) return;
      const b = bewerte(n.rows).find((x) => x.ok && x.g < gini(n.rows) - 1e-9);
      if (!b) return;
      n.q = b.c; n.kids = [knoten(b.l, n.tiefe + 1, n, true), knoten(b.r, n.tiefe + 1, n, false)];
      baueAuto(n.kids[0]); baueAuto(n.kids[1]);
    }

    /* ---- Oberfläche */
    const satz = h("p", { class: "erklaerung pg-satz", "data-pg": "satz" });
    const sr = h("p", { class: "pg-sr", "aria-live": "polite" });
    const sprich = sprecher(sr); ab.push(() => sprich.stop());
    const baumBox = h("div", { class: "pg-baumbox", tabindex: "-1" });
    const fragenBox = h("div", { class: "pg-fragen", "data-pg": "fragen" });
    const tiefeR = regler("Tiefe (Fragen hintereinander)", 1, 6, 1, maxTiefe, (v) => String(v), (v) => { maxTiefe = v; vorschlag = null; alles(); }, "tiefe");
    const blattR = regler("Mindestzahl je Blatt", 1, 5, 1, minBlatt, (v) => String(v), (v) => { minBlatt = v; vorschlag = null; alles(); }, "blatt");
    const bVorschlag = h("button", { type: "button", class: "btn primary", "data-pg": "vorschlag" }, icon("live"), "Beste Frage vorschlagen");
    const bAuto = h("button", { type: "button", class: "btn", "data-pg": "auto" }, "Baum automatisch bauen");
    const bNeu = h("button", { type: "button", class: "btn", "data-pg": "neu" }, "Zurücksetzen");
    const kTrain = kachel("Genauigkeit auf Trainingszeilen", "", "");
    const kTest = kachel("Genauigkeit auf Prüfzeilen", "", "");
    const kGini = kachel("Unreinheit der Blätter (Gini)", "", "");
    kTrain.el.dataset.pg = "train"; kTest.el.dataset.pg = "test"; kGini.el.dataset.pg = "gini";
    const daten = h("details", { class: "pg-daten" }, h("summary", null, "Die Zeilen ansehen (erfunden)"));
    const datenInhalt = h("div", { class: "tabelle-wrap" });
    daten.append(datenInhalt);

    bVorschlag.addEventListener("click", () => {
      if (!kannFragen(auswahl)) return;
      vorschlag = bewerte(auswahl.rows).find((x) => x.ok) ? bewerte(auswahl.rows).find((x) => x.ok).c.id : null;
      zeichneFragen(); sagVorschlag();
      const b = fragenBox.querySelector(".ist-vorschlag"); if (b && b.scrollIntoView) b.scrollIntoView({ block: "nearest" });
    });
    bAuto.addEventListener("click", () => { wurzel = knoten(BAUM_TRAIN, 0, null, null); baueAuto(wurzel); auswahl = wurzel; vorschlag = null; alles(); });
    bNeu.addEventListener("click", () => { wurzel = knoten(BAUM_TRAIN, 0, null, null); auswahl = wurzel; vorschlag = null; alles(); });

    root.append(
      h("p", { class: "pg-leise" }, "Zwanzig erfundene Kreditanträge, jeder mit dem Ergebnis, ob er zurückgezahlt wurde oder ausfiel. Wähle einen Knoten im Baum und stelle ihm eine Frage. Je reiner die Gruppen danach sind, desto besser trennt die Frage."),
      KL.gruppe("Baum", [tiefeR.el, blattR.el], { aktion: [bVorschlag, bAuto, bNeu] }),
      h("div", { class: "pg-legende", "aria-hidden": "true" },
        h("span", null, h("i", { class: "pg-sw0" }), "zurückgezahlt"), h("span", null, h("i", { class: "pg-sw1" }), "ausgefallen"),
        h("span", { class: "pg-leise" }, "Gini: 0 heißt rein, 0,5 heißt völlig durchmischt")),
      baumBox, fragenBox,
      h("div", { class: "messwerte pg-messwerte" }, kTrain.el, kTest.el, kGini.el),
      satz, sr, daten,
      hinweis("Alle Zeilen sind erfunden und sehr wenige. Ein echter Baum braucht viele Datensätze und prüft auf Daten, die er nie gesehen hat."));

    /* ---- Zeichnen */
    const NB = 138, NH = 62, GX = 14, GY = 52;
    function zeichneBaum() {
      let nr = 0;
      (function lay(n) {
        if (istBlatt(n)) { n.px = nr * (NB + GX) + NB / 2; nr++; }
        else { lay(n.kids[0]); lay(n.kids[1]); n.px = (n.kids[0].px + n.kids[1].px) / 2; }
        n.py = n.tiefe * (NH + GY);
      })(wurzel);
      const td = tiefeReal(wurzel);
      const breite = nr * (NB + GX) - GX, hoch = (td + 1) * NH + td * GY;
      const kanten = [], knoeten = [];
      (function zeichne(n) {
        if (!istBlatt(n)) {
          for (const k of n.kids) {
            const x1 = n.px, y1 = n.py + NH, x2 = k.px, y2 = k.py, my = (y1 + y2) / 2;
            kanten.push(svg("path", { class: "pg-kante", d: `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}` }));
            kanten.push(svg("text", { class: "pg-kante-t", x: (x1 + x2) / 2 + (k.seite ? -6 : 6), y: my + 4, "text-anchor": k.seite ? "end" : "start" }, k.seite ? "ja" : "nein"));
            zeichne(k);
          }
        }
        const [n0, n1] = zaehle(n.rows), nn = n.rows.length, blatt = istBlatt(n), w = NB - 16;
        const g = svg("g", {
          class: "pg-kn" + (n === auswahl ? " ist-auswahl" : "") + (blatt ? " ist-blatt" : ""), transform: `translate(${n.px - NB / 2},${n.py})`,
          role: "button", tabindex: "0", "aria-pressed": n === auswahl ? "true" : "false", "data-knoten": String(n.id), "data-tiefe": String(n.tiefe),
          "aria-label": (blatt ? "Blatt, sagt " + klasse(mehrheit(n.rows)) : "Frage " + n.q.text) + ". " + nn + " Zeilen, davon " + n0 + " zurückgezahlt und " + n1 + " ausgefallen. Gini " + fmt(gini(n.rows), 2) + ". Pfad: " + pfadText(n),
        },
          svg("rect", { class: "pg-kn-r", width: NB, height: NH, rx: 11 }),
          svg("text", { class: "pg-kn-t1", x: NB / 2, y: 18, "text-anchor": "middle" }, blatt ? "→ " + klasse(mehrheit(n.rows)) : n.q.kurz),
          svg("rect", { class: "pg-b0", x: 8, y: 26, width: nn ? w * n0 / nn : 0, height: 8, rx: 3 }),
          svg("rect", { class: "pg-b1", x: 8 + (nn ? w * n0 / nn : 0), y: 26, width: nn ? w * n1 / nn : 0, height: 8, rx: 3 }),
          svg("text", { class: "pg-kn-t2", x: NB / 2, y: 52, "text-anchor": "middle" }, "n = " + nn + " · Gini " + fmt(gini(n.rows), 2)));
        g.addEventListener("click", () => { auswahl = n; vorschlag = null; alles(); const f = baumBox.querySelector('[data-knoten="' + n.id + '"]'); if (f && document.activeElement !== f) f.focus({ preventScroll: true }); });
        g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); g.dispatchEvent(new Event("click")); } });
        knoeten.push(g);
      })(wurzel);
      const s = svg("svg", { class: "pg-baumsvg", width: Math.max(breite, 200), height: hoch + 4, viewBox: `0 0 ${Math.max(breite, 200)} ${hoch + 4}`, role: "group", "aria-label": "Entscheidungsbaum, " + blaetter(wurzel).length + " Blätter" },
        kanten, knoeten);
      baumBox.replaceChildren(s);
    }
    function mix(rows) {
      const [a, b] = zaehle(rows), n = rows.length || 1;
      return h("span", { class: "pg-mix", title: a + " zurückgezahlt, " + b + " ausgefallen" },
        h("i", { class: "a", style: "width:" + (100 * a / n) + "%" }), h("i", { class: "b", style: "width:" + (100 * b / n) + "%" }));
    }
    function zeichneFragen() {
      const n = auswahl, g0 = gini(n.rows), [z0, z1] = zaehle(n.rows);
      const kopf = h("div", { class: "pg-fkopf" },
        h("p", { class: "pg-ueber" }, "Frage für den gewählten Knoten"),
        h("p", { class: "pg-pfad" }, "Pfad: ", h("b", null, pfadText(n)), ". ", n.rows.length + " Zeilen (" + z0 + " zurückgezahlt, " + z1 + " ausgefallen), Gini " + fmt(g0, 2) + "."));
      const teile_ = [kopf];
      if (n.tiefe >= maxTiefe) teile_.push(h("p", { class: "pg-notiz" }, "Die größte Tiefe ist hier erreicht. Erhöhe den Regler Tiefe, wenn der Baum weiter fragen soll."));
      else if (n.rows.length < 2 || g0 === 0) teile_.push(h("p", { class: "pg-notiz" }, "Diese Gruppe ist schon rein, alle Zeilen haben dasselbe Ergebnis. Hier braucht es keine Frage mehr."));
      else {
        const res = bewerte(n.rows);
        if (!res.some((x) => x.ok)) teile_.push(h("p", { class: "pg-notiz" }, "Mit dieser Mindestzahl je Blatt gibt es keine Frage mehr. Senke den Regler, wenn du weiter teilen willst."));
        const liste = h("div", { class: "pg-fliste", role: "list" });
        for (const x of res) {
          const aktuell = n.q && n.q.id === x.c.id;
          const b = h("button", {
            type: "button", role: "listitem", class: "pg-frage" + (vorschlag === x.c.id ? " ist-vorschlag" : "") + (aktuell ? " ist-aktuell" : ""),
            dataset: { id: x.c.id, ok: x.ok ? "1" : "0", gini: x.g.toFixed(4) }, "aria-disabled": x.ok ? null : "true", "aria-current": aktuell ? "true" : null,
            "aria-label": x.c.text + " Ja: " + x.l.length + " Zeilen, nein: " + x.r.length + " Zeilen. Gewichteter Gini danach " + fmt(x.g, 2) + (x.ok ? "" : ". Nicht möglich wegen der Mindestzahl je Blatt") + (vorschlag === x.c.id ? ". Beste Frage" : ""),
          },
            h("span", { class: "pg-f-text" }, x.c.text, vorschlag === x.c.id ? h("em", null, "beste Frage") : null, aktuell ? h("em", { class: "pg-f-akt" }, "gestellt") : null),
            h("span", { class: "pg-f-seite" }, h("span", { class: "pg-f-lab" }, "ja " + x.l.length), mix(x.l)),
            h("span", { class: "pg-f-seite" }, h("span", { class: "pg-f-lab" }, "nein " + x.r.length), mix(x.r)),
            h("span", { class: "pg-f-g" }, h("span", { class: "pg-gbar" }, h("i", { style: "width:" + klemme(x.g / 0.5, 0, 1) * 100 + "%" })), "Gini " + fmt(x.g, 2)));
          b.addEventListener("click", () => { if (x.ok) frageStellen(n, x.c); });
          liste.append(b);
        }
        teile_.push(liste);
        if (vorschlag) {
          const x = res.find((y) => y.c.id === vorschlag);
          if (x) teile_.push(h("p", { class: "pg-vorschlag", "data-pg": "vorschlagtext" },
            h("b", null, x.c.text), " Diese Frage trennt hier am besten. Vorher liegt der Gini bei " + fmt(g0, 2) + ". Danach hat die Ja-Gruppe (" + x.l.length + " Zeilen) einen Gini von " + fmt(gini(x.l), 2) +
            " und die Nein-Gruppe (" + x.r.length + " Zeilen) " + fmt(gini(x.r), 2) + ", gewichtet " + fmt(x.g, 2) + ". Gewinn: " + fmt(g0 - x.g, 2) + ". ",
            h("button", { type: "button", class: "btn klein primary", "data-pg": "uebernehmen", onclick: () => frageStellen(n, x.c) }, "Diese Frage stellen")));
        }
      }
      fragenBox.replaceChildren(...teile_);
    }
    function sagVorschlag() {
      const x = bewerte(auswahl.rows).find((y) => y.ok);
      if (x) sprich.sag("Beste Frage: " + x.c.text + " Gewichteter Gini danach " + fmt(x.g, 2) + ", vorher " + fmt(gini(auswahl.rows), 2) + ".");
    }
    function zeichneDaten() {
      const tab = (titel, rows, mitPrognose) => h("table", { class: "vergleich pg-tab" },
        h("caption", null, titel),
        h("thead", null, h("tr", null, ["Rückstände", "Einkommen", "Konto", "Alter", "Ergebnis", "Baum sagt"].map((k) => h("th", { scope: "col" }, k)))),
        h("tbody", null, rows.map((x) => { const s = sagt(x), ok = s === x[4]; return h("tr", null,
          h("td", null, x[0] ? "ja" : "nein"), h("td", null, EK_NAME[x[1]]), h("td", null, jahre(x[2])), h("td", null, String(x[3])), h("td", null, klasse(x[4])),
          h("td", { class: ok ? "pg-ok" : "pg-falsch" }, klasse(s) + (ok ? "" : ", falsch"))); })));
      datenInhalt.replaceChildren(tab("Trainingszeilen (20)", BAUM_TRAIN), tab("Prüfzeilen (8), dem Baum beim Bauen nicht gezeigt", BAUM_TEST));
    }
    function messen() {
      const tr = trefferZahl(BAUM_TRAIN), te = trefferZahl(BAUM_TEST);
      const bl = blaetter(wurzel);
      const gk = bl.reduce((a, n) => a + n.rows.length * gini(n.rows), 0) / BAUM_TRAIN.length;
      kTrain.set(Math.round(100 * tr / 20) + " %", tr + " von 20 richtig");
      kTest.set(Math.round(100 * te / 8) + " %", te + " von 8 richtig");
      kGini.set(fmt(gk, 2), "ohne Fragen: " + fmt(gini(BAUM_TRAIN), 2));
      kTrain.el.style.setProperty("--p", tr / 20); kTest.el.style.setProperty("--p", te / 8);
      Object.assign(root.dataset, { train: String(tr), test: String(te), blaetter: String(bl.length), tiefe: String(tiefeReal(wurzel)), giniStart: gini(BAUM_TRAIN).toFixed(4), giniBlaetter: gk.toFixed(4), auswahlGini: gini(auswahl.rows).toFixed(4) });
      let t;
      if (!wurzel.q) t = "Noch keine Frage gestellt. Der Baum rät für alle Anträge „" + klasse(mehrheit(BAUM_TRAIN)) + "“ und liegt auf " + tr + " von 20 Trainingszeilen richtig, auf " + te + " von 8 Prüfzeilen.";
      else {
        t = "Der Baum hat " + bl.length + " Blätter und " + tiefeReal(wurzel) + (tiefeReal(wurzel) === 1 ? " Ebene" : " Ebenen") + ". Training: " + tr + " von 20 richtig, Prüfzeilen: " + te + " von 8. ";
        if (tr / 20 >= 0.95 && te / 8 < tr / 20 - 0.1) t += "Auf dem Training fast perfekt, auf den neuen Zeilen schwächer: Das ist Überanpassung. Der Baum hat sich Einzelfälle gemerkt.";
        else if (te / 8 >= tr / 20) t += "Auf den Prüfzeilen ist der Baum mindestens so gut wie im Training. Er hat ein Muster gelernt und keine Einzelfälle.";
        else t += "Prüfe, ob weitere Fragen auch auf den Prüfzeilen helfen oder nur das Training verbessern.";
      }
      satz.textContent = t; sprich.sag(t);
    }
    function alles() { zeichneBaum(); zeichneFragen(); zeichneDaten(); messen(); }
    alles();
    return aufraeumer(ab);
  };

  /* ============================================================ 2. prognose-labor */
  KL.widgets["prognose-labor"] = function (root) {
    root.classList.add("pg-wid", "pg-prog");
    const ab = [];
    const N = 60, HOR = 12, P = 12;
    const MUSTER = Array.from({ length: P }, (_, k) => Math.sin(2 * Math.PI * k / P) + 0.35 * Math.cos(4 * Math.PI * k / P));
    const S = { trend: 2, saison: 18, rausch: 6, hist: 36, seed: 7, prognose: true, wahrheit: true, modus: "ausreisser", ausr: null, bruch: null, cur: null, fokus: false };

    /* Ursprüngliche Reihe: Trend + Saison + Rauschen, danach Eingriffe */
    function reihe(mitEingriffen = true) {
      const r = rng(S.seed * 104729 + 13), ohne = [], y = [];
      for (let t = 0; t < N; t++) {
        const base = 60 + S.trend * t + S.saison * MUSTER[t % P] + S.rausch * normal(r);
        ohne.push(base);
        let v = base;
        if (mitEingriffen && S.bruch && t >= S.bruch.t) v += S.bruch.delta;
        if (mitEingriffen && S.ausr && t === S.ausr.t) v += S.ausr.delta;
        y.push(v);
      }
      return { ohne, y };
    }
    /* Trend (Gerade) und Saison (Mittel je Position) abwechselnd anpassen */
    function anpassen(y, H) {
      const s = new Array(P).fill(0); let a = 0, b = 0;
      for (let it = 0; it < 8; it++) {
        let sx = 0, sy = 0, sxx = 0, sxy = 0;
        for (let t = 0; t < H; t++) { const v = y[t] - s[t % P]; sx += t; sy += v; sxx += t * t; sxy += t * v; }
        b = (H * sxy - sx * sy) / (H * sxx - sx * sx); a = (sy - b * sx) / H;
        const sum = new Array(P).fill(0), cnt = new Array(P).fill(0);
        for (let t = 0; t < H; t++) { sum[t % P] += y[t] - (a + b * t); cnt[t % P]++; }
        let m = 0;
        for (let k = 0; k < P; k++) { s[k] = cnt[k] ? sum[k] / cnt[k] : 0; m += s[k]; }
        m /= P; for (let k = 0; k < P; k++) s[k] -= m; a += m;
      }
      let sse = 0;
      for (let t = 0; t < H; t++) { const e = y[t] - (a + b * t + s[t % P]); sse += e * e; }
      const tbar = (H - 1) / 2; let sxx = 0;
      for (let t = 0; t < H; t++) sxx += (t - tbar) * (t - tbar);
      return { a, b, s, sigma: Math.sqrt(sse / Math.max(3, H - 14)), tbar, sxx, H, f: (t) => a + b * t + s[t % P] };
    }
    function modell() {
      const { ohne, y } = reihe(), H = S.hist, m = anpassen(y, H);
      const prog = [];
      for (let t = H; t < H + HOR; t++) {
        const f = m.f(t), halb = 1.96 * m.sigma * Math.sqrt(1 + 1 / H + (t - m.tbar) * (t - m.tbar) / m.sxx);
        prog.push({ t, f, halb, ist: y[t], faust: y[t - P] });
      }
      let ef = 0, en = 0, im = 0;
      for (const p of prog) { ef += Math.abs(p.f - p.ist); en += Math.abs(p.faust - p.ist); if (Math.abs(p.ist - p.f) <= p.halb) im++; }
      const sauber = anpassen(reihe(false).y, H);
      const ohneAusr = S.ausr ? (() => { const sv = S.ausr; S.ausr = null; const r = anpassen(reihe().y, H); S.ausr = sv; return r; })() : null;
      return { ohne, y, m, prog, maeModell: ef / HOR, maeFaust: en / HOR, imBand: im, sauber, ohneAusr, halbEnde: prog[prog.length - 1].halb, halbMittel: prog.reduce((a, p) => a + p.halb, 0) / HOR };
    }

    /* ---- Oberfläche */
    const canvas = h("canvas", { class: "pg-canvas", tabindex: "0", role: "img", "aria-label": "Liniendiagramm der Zeitreihe mit Prognose und Unsicherheitsband. Mit den Pfeiltasten wählst du eine Stelle, mit Enter setzt du den gewählten Eingriff, mit Rücktaste nimmst du ihn zurück." });
    const info = h("p", { class: "pg-cursorinfo", "data-pg": "cursor" }, "Klicke ins Diagramm, um einen Eingriff zu setzen.");
    const satz = h("p", { class: "erklaerung pg-satz", "data-pg": "satz" });
    const sr = h("p", { class: "pg-sr", "aria-live": "polite" });
    const sprich = sprecher(sr); ab.push(() => sprich.stop());
    const rTrend = regler("Trend je Monat", 0, 3, 0.1, S.trend, (v) => fmt(v, 1), (v) => { S.trend = v; neu(); }, "trend");
    const rSaison = regler("Saisonstärke", 0, 40, 1, S.saison, (v) => fmt(v, 0), (v) => { S.saison = v; neu(); }, "saison");
    const rRausch = regler("Rauschen", 0, 25, 1, S.rausch, (v) => fmt(v, 0), (v) => { S.rausch = v; neu(); }, "rauschen");
    const rHist = regler("Länge der Historie", 12, 48, 1, S.hist, (v) => v + " Punkte", (v) => { S.hist = v; S.cur = null; neu(); }, "historie");
    const bProg = h("button", { type: "button", class: "btn primary", "aria-pressed": "true", "data-pg": "prognose" }, icon("live"), "Prognose");
    const bWahr = h("button", { type: "button", class: "btn", "aria-pressed": "true", "data-pg": "wahrheit" }, "Zurückgehaltene Daten zeigen");
    const bSeed = h("button", { type: "button", class: "btn", "data-pg": "wuerfeln" }, "Zufall neu würfeln");
    const bAusr = h("button", { type: "button", class: "btn", "aria-pressed": "false", "data-pg": "ausreisser" }, "Ausreißer einbauen");
    const bBruch = h("button", { type: "button", class: "btn", "aria-pressed": "false", "data-pg": "ereignis" }, "Ereignis einbauen, das es nie gab");
    const kMod = kachel("Fehler des Modells (Mittel)", "", ""), kFau = kachel("Fehler der Faustregel „wie letztes Jahr“", "", ""), kBand = kachel("Zurückgehaltene Punkte im Band", "", "");
    kMod.el.dataset.pg = "fehler-modell"; kFau.el.dataset.pg = "fehler-faust"; kBand.el.dataset.pg = "im-band";
    const legende = h("div", { class: "pg-legende", "aria-hidden": "true" },
      h("span", null, h("i", { class: "pg-l-hist" }), "Historie"), h("span", null, h("i", { class: "pg-l-fit" }), "Anpassung des Modells"),
      h("span", null, h("i", { class: "pg-l-prog" }), "Prognose und Band"), h("span", null, h("i", { class: "pg-l-ist" }), "zurückgehaltene Daten"));

    bProg.addEventListener("click", () => { S.prognose = !S.prognose; bProg.setAttribute("aria-pressed", String(S.prognose)); neu(); });
    bWahr.addEventListener("click", () => { S.wahrheit = !S.wahrheit; bWahr.setAttribute("aria-pressed", String(S.wahrheit)); neu(); });
    bSeed.addEventListener("click", () => { S.seed++; neu(); });
    bAusr.addEventListener("click", () => {
      S.modus = "ausreisser";
      S.ausr = S.ausr ? null : { t: Math.max(1, S.hist - 5), delta: 55 };
      neu();
    });
    bBruch.addEventListener("click", () => {
      S.modus = "bruch";
      S.bruch = S.bruch ? null : { t: Math.min(N - 1, S.hist + 3), delta: -40 };
      neu();
    });

    root.append(
      h("p", { class: "pg-leise" }, "Eine erfundene Zeitreihe aus Trend, Saison und Zufall. Das Modell kennt nur die Historie und schreibt sie zwölf Punkte fort. Die grauen Kreise sind die Werte, die es nicht sehen durfte."),
      h("div", { class: "pg-canvaswrap" }, canvas), info, legende,
      KL.gruppe("Zeitreihe", [rTrend.el, rSaison.el, rRausch.el, rHist.el], { aktion: [bProg, bWahr, bSeed] }),
      KL.gruppe("Störungen", [], { fuss: "Danach klickst du ins Diagramm, um die Stelle zu verschieben.", aktion: [bAusr, bBruch] }),
      h("div", { class: "messwerte pg-messwerte" }, kMod.el, kFau.el, kBand.el), satz, sr,
      hinweis("Die Reihe ist erfunden und hat keine Einheit. Das Band zeigt grob, wo 95 von 100 neuen Werten liegen würden, wenn das Muster so bleibt. Ein Bruch im Muster ist darin nicht eingerechnet."));

    /* ---- Zeichnen */
    let d = null; // letztes Modell
    const lein = leinwand(canvas, (ctx, W, Hh) => { if (d) zeichne(ctx, W, Hh); });
    ab.push(() => lein.destroy());
    ab.push(mqHoeren(mqDunkel, () => lein.plan()));
    const R = { l: 10, r: 10, t: 26, b: 26 };
    let skala = { lo: 0, hi: 1 };
    const xVon = (t, W) => R.l + (t / (S.hist + HOR - 1)) * (W - R.l - R.r);
    const yVon = (v, Hh) => R.t + (1 - (v - skala.lo) / (skala.hi - skala.lo)) * (Hh - R.t - R.b);
    const tVon = (x, W) => klemme(Math.round((x - R.l) / (W - R.l - R.r) * (S.hist + HOR - 1)), 0, S.hist + HOR - 1);
    const vVon = (y, Hh) => skala.lo + (1 - (y - R.t) / (Hh - R.t - R.b)) * (skala.hi - skala.lo);

    function zeichne(ctx, W, Hh) {
      const c = farben(), H = S.hist, { y, m, prog } = d;
      let mn = Infinity, mx = -Infinity;
      for (let t = 0; t < H + HOR; t++) { mn = Math.min(mn, y[t]); mx = Math.max(mx, y[t]); }
      if (S.prognose) for (const p of prog) { mn = Math.min(mn, p.f - p.halb); mx = Math.max(mx, p.f + p.halb); }
      const pad = (mx - mn) * 0.08 + 4;
      skala = { lo: Math.floor((mn - pad) / 10) * 10, hi: Math.ceil((mx + pad) / 10) * 10 };
      ctx.font = SCHRIFT; ctx.textBaseline = "middle";
      // Prognosebereich
      const xg = xVon(H - 0.5, W);
      ctx.fillStyle = c.flaeche2; ctx.fillRect(xg, R.t - 8, W - R.r - xg + 2, Hh - R.t - R.b + 8);
      ctx.fillStyle = c.leise; ctx.textAlign = "left"; ctx.fillText("Historie", R.l, 10);
      ctx.textAlign = "right"; ctx.fillText(W < 520 ? "Prognose" : "zurückgehalten, hier schreibt das Modell fort", W - R.r, 10);
      // Gitter
      ctx.strokeStyle = c.linie2; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) { const yy = Math.round(R.t + i * (Hh - R.t - R.b) / 4) + 0.5; ctx.beginPath(); ctx.moveTo(R.l, yy); ctx.lineTo(W - R.r, yy); ctx.stroke(); }
      ctx.textAlign = "center"; ctx.fillStyle = c.leise;
      for (let t = 0; t < H + HOR; t += 12) { const xx = xVon(t, W); ctx.strokeStyle = c.linie2; ctx.beginPath(); ctx.moveTo(Math.round(xx) + 0.5, R.t); ctx.lineTo(Math.round(xx) + 0.5, Hh - R.b); ctx.stroke(); ctx.fillText(String(t + 1), clampX(xx, W), Hh - 11); }
      // Ereignis
      if (S.bruch) {
        const xx = xVon(S.bruch.t, W);
        ctx.strokeStyle = c.rot; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(xx, R.t - 4); ctx.lineTo(xx, Hh - R.b); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = c.rot; ctx.textAlign = xx > W * 0.7 ? "right" : "left"; ctx.fillText("Ereignis ab Punkt " + (S.bruch.t + 1), xx + (xx > W * 0.7 ? -5 : 5), R.t + 6);
      }
      // Band und Prognose
      if (S.prognose) {
        ctx.globalAlpha = 0.2; ctx.fillStyle = c.k2; ctx.beginPath();
        prog.forEach((p, i) => { const xx = xVon(p.t, W), yy = yVon(p.f + p.halb, Hh); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); });
        for (let i = prog.length - 1; i >= 0; i--) ctx.lineTo(xVon(prog[i].t, W), yVon(prog[i].f - prog[i].halb, Hh));
        ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      }
      // Anpassung in der Historie
      ctx.strokeStyle = c.leise; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath();
      for (let t = 0; t < H; t++) { const xx = xVon(t, W), yy = yVon(m.f(t), Hh); t ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke(); ctx.setLineDash([]);
      // Historie
      ctx.strokeStyle = c.k1; ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.beginPath();
      for (let t = 0; t < H; t++) { const xx = xVon(t, W), yy = yVon(y[t], Hh); t ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
      ctx.fillStyle = c.k1; for (let t = 0; t < H; t++) { ctx.beginPath(); ctx.arc(xVon(t, W), yVon(y[t], Hh), 2.2, 0, 6.2832); ctx.fill(); }
      // Prognoselinie
      if (S.prognose) {
        ctx.strokeStyle = c.k2; ctx.lineWidth = 2.4; ctx.beginPath();
        ctx.moveTo(xVon(H - 1, W), yVon(m.f(H - 1), Hh));
        prog.forEach((p) => ctx.lineTo(xVon(p.t, W), yVon(p.f, Hh))); ctx.stroke();
      }
      // Zurückgehaltene Daten
      if (S.wahrheit) {
        ctx.strokeStyle = c.text; ctx.fillStyle = c.flaeche; ctx.lineWidth = 1.6;
        for (const p of prog) { ctx.beginPath(); ctx.arc(xVon(p.t, W), yVon(p.ist, Hh), 3.6, 0, 6.2832); ctx.fill(); ctx.stroke(); }
      }
      // Ausreißer
      if (S.ausr) {
        const xx = xVon(S.ausr.t, W), yy = yVon(y[S.ausr.t], Hh);
        ctx.strokeStyle = c.rot; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(xx, yy, 8, 0, 6.2832); ctx.stroke();
        ctx.fillStyle = c.rot; ctx.textAlign = "center"; ctx.fillText("Ausreißer", clampX(xx, W, 28), yy + (yy < Hh / 2 ? 20 : -18));
      }
      // Cursor
      if (S.cur) {
        const xx = xVon(S.cur.t, W), yy = yVon(S.cur.v, Hh);
        ctx.strokeStyle = c.akzent; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xx + 0.5, R.t - 4); ctx.lineTo(xx + 0.5, Hh - R.b); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(xx - 6, yy + 0.5); ctx.lineTo(xx + 6, yy + 0.5); ctx.stroke();
      }
    }
    function clampX(x, W, rand = 14) { return klemme(x, rand, W - rand); }

    /* ---- Eingabe über das Diagramm */
    function ausEreignis(e) {
      const r = canvas.getBoundingClientRect();
      return { t: tVon(e.clientX - r.left, r.width), v: vVon(e.clientY - r.top, r.height) };
    }
    function setzeEingriff(t, v) {
      const ohne = reihe().ohne;
      if (S.modus === "ausreisser") {
        const grund = ohne[t] + (S.bruch && t >= S.bruch.t ? S.bruch.delta : 0);
        let dl = v - grund; if (Math.abs(dl) < 15) dl = (dl < 0 ? -1 : 1) * 45;
        S.ausr = { t, delta: dl };
      } else {
        t = Math.max(1, t);
        let dl = v - ohne[t]; if (Math.abs(dl) < 15) dl = (dl < 0 ? -1 : 1) * 35;
        S.bruch = { t, delta: dl };
      }
      neu();
    }
    canvas.addEventListener("pointermove", (e) => { S.cur = ausEreignis(e); cursorInfo(); lein.plan(); });
    canvas.addEventListener("pointerleave", () => { if (!S.fokus) { S.cur = null; cursorInfo(); lein.plan(); } });
    canvas.addEventListener("click", (e) => { const p = ausEreignis(e); S.cur = p; setzeEingriff(p.t, p.v); });
    canvas.addEventListener("focus", () => {
      S.fokus = true;
      if (!S.cur) S.cur = { t: Math.round(S.hist / 2), v: d ? d.y[Math.round(S.hist / 2)] : 100 };
      cursorInfo(); lein.plan();
    });
    canvas.addEventListener("blur", () => { S.fokus = false; S.cur = null; cursorInfo(); lein.plan(); });
    canvas.addEventListener("keydown", (e) => {
      if (!S.cur) return;
      const gross = e.shiftKey ? 5 : 1;
      if (e.key === "ArrowLeft") S.cur.t = Math.max(0, S.cur.t - gross);
      else if (e.key === "ArrowRight") S.cur.t = Math.min(S.hist + HOR - 1, S.cur.t + gross);
      else if (e.key === "ArrowUp") S.cur.v += 5 * gross;
      else if (e.key === "ArrowDown") S.cur.v -= 5 * gross;
      else if (e.key === "Enter" || e.key === " ") { setzeEingriff(S.cur.t, S.cur.v); }
      else if (e.key === "Backspace" || e.key === "Delete") { if (S.modus === "ausreisser") S.ausr = null; else S.bruch = null; neu(); }
      else return;
      e.preventDefault(); cursorInfo(); lein.plan();
    });
    function cursorInfo() {
      const was = S.modus === "ausreisser" ? "Ausreißer" : "Ereignis";
      info.textContent = S.cur ? "Punkt " + (S.cur.t + 1) + (S.cur.t >= S.hist ? " (zurückgehalten)" : "") + ", Wert " + fmt(S.cur.v, 0) + ". Ein Klick setzt: " + was + "."
        : "Klicke ins Diagramm, um die Stelle für einen Eingriff zu wählen. Zuletzt gewählt: " + was + ".";
    }

    /* ---- Rechnen und Beschreiben */
    function neu() {
      d = modell();
      bAusr.setAttribute("aria-pressed", String(!!S.ausr)); bBruch.setAttribute("aria-pressed", String(!!S.bruch));
      const { m, prog } = d;
      kMod.set(fmt(d.maeModell, 1)); kFau.set(fmt(d.maeFaust, 1)); kBand.set(d.imBand + " von " + HOR);
      Object.assign(root.dataset, { band: d.halbEnde.toFixed(3), bandMittel: d.halbMittel.toFixed(3), fehlerModell: d.maeModell.toFixed(3), fehlerFaust: d.maeFaust.toFixed(3), imBand: String(d.imBand), trendGeschaetzt: m.b.toFixed(3), sigma: m.sigma.toFixed(3) });
      const b = m.b, smax = Math.max(...m.s.map(Math.abs));
      const richtung = Math.abs(b) < 0.05 ? "Der Trend ist flach." : "Der Trend " + (b > 0 ? "steigt" : "fällt") + " um " + fmt(Math.abs(b), 1) + " Einheiten pro Monat.";
      let t = "Das Modell schätzt: " + richtung + " Die Saison wiederholt sich alle 12 Punkte und hebt oder senkt den Wert um bis zu " + fmt(smax, 0) + ". ";
      t += "Das Band am Ende der Prognose ist ±" + fmt(d.halbEnde, 0) + " breit. ";
      t += "Auf den zurückgehaltenen 12 Punkten liegt das Modell im Mittel " + fmt(d.maeModell, 1) + " daneben, die Faustregel „wie letztes Jahr“ " + fmt(d.maeFaust, 1) + ". " + d.imBand + " von 12 Punkten liegen im Band. ";
      t += d.maeModell < d.maeFaust ? "Das Modell schlägt die Faustregel. " : "Hier ist die einfache Faustregel mindestens so gut wie das Modell. ";
      if (S.ausr) {
        const sv = S.ausr.t < S.hist && d.ohneAusr
          ? "Der Ausreißer bei Punkt " + (S.ausr.t + 1) + " verschiebt den geschätzten Trend von " + fmt(d.ohneAusr.b, 2) + " auf " + fmt(b, 2) + " und weitet das Band."
          : "Der Ausreißer bei Punkt " + (S.ausr.t + 1) + " liegt im zurückgehaltenen Teil und stört nur den Vergleich.";
        t += sv + " ";
      }
      if (S.bruch) {
        if (S.bruch.t >= S.hist) {
          const nach = prog.filter((p) => p.t >= S.bruch.t), fe = nach.reduce((a, p) => a + Math.abs(p.f - p.ist), 0) / Math.max(1, nach.length);
          t += "Ab Punkt " + (S.bruch.t + 1) + " ändert sich das Niveau. Das Modell kann das nicht wissen und liegt dort im Mittel " + fmt(fe, 0) + " daneben, das Band hilft nicht.";
        } else t += "Das Ereignis bei Punkt " + (S.bruch.t + 1) + " liegt in der Historie. Das Modell hält den Sprung für einen Teil des Trends: geschätzt " + fmt(b, 2) + " statt " + fmt(d.sauber.b, 2) + " ohne das Ereignis.";
      }
      satz.textContent = t.trim(); sprich.sag(t.trim());
      cursorInfo(); lein.plan();
    }
    neu();
    return aufraeumer(ab);
  };

  /* ============================================================ 3. anomalie-labor */
  KL.widgets["anomalie-labor"] = function (root) {
    root.classList.add("pg-wid", "pg-anomalie");
    const ab = [];
    const N = 200, LERN = 100, P = 24, ANZ = 6, FENSTER = 24;
    const S = { seed: 11, laut: false, methode: "fest", k: 2 };
    const KS = Array.from({ length: 51 }, (_, i) => Math.round((1 + i * 0.1) * 10) / 10);
    const mittel = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    const abw = (a, mu) => Math.sqrt(a.reduce((x, y) => x + (y - mu) * (y - mu), 0) / Math.max(1, a.length - 1));

    function reihe() {
      const r = rng(S.seed * 7919 + 5), z = [];
      for (let t = 0; t < N; t++) z.push(normal(r));
      const pos = []; let wache = 0;
      while (pos.length < ANZ && wache++ < 800) { const p = 108 + Math.floor(r() * 88); if (pos.every((q) => Math.abs(q - p) >= 10)) pos.push(p); }
      pos.sort((a, b) => a - b);
      const off = pos.map(() => (r() < 0.5 ? -1 : 1) * (4.5 + 4.5 * r()));
      const sigma = S.laut ? 3.0 : 1.2;
      const y = z.map((zz, t) => 70 + 4 * Math.sin(2 * Math.PI * t / P) + sigma * zz);
      pos.forEach((p, i) => { y[p] += off[i]; });
      return { y, pos, sigma };
    }
    /* Erwartungswert e[t] und Streuung s[t] je Verfahren, gelernt nur aus der Lernphase (oder dem Fenster davor) */
    function erwartung(y, methode) {
      const e = new Array(N).fill(NaN), s = new Array(N).fill(NaN), lern = y.slice(0, LERN);
      if (methode === "fest") {
        const mu = mittel(lern), sd = abw(lern, mu);
        for (let t = 0; t < N; t++) { e[t] = mu; s[t] = sd; }
      } else if (methode === "fenster") {
        for (let t = FENSTER; t < N; t++) { const w = y.slice(t - FENSTER, t), mu = mittel(w); e[t] = mu; s[t] = abw(w, mu); }
      } else {
        const sum = new Array(P).fill(0), cnt = new Array(P).fill(0);
        for (let t = 0; t < LERN; t++) { sum[t % P] += y[t]; cnt[t % P]++; }
        const mp = sum.map((v, i) => v / cnt[i]);
        let sse = 0; for (let t = 0; t < LERN; t++) sse += (y[t] - mp[t % P]) ** 2;
        const sd = Math.sqrt(sse / Math.max(1, LERN - P));
        for (let t = 0; t < N; t++) { e[t] = mp[t % P]; s[t] = sd; }
      }
      return { e, s };
    }

    /* ---- Oberfläche */
    const canvas = h("canvas", { class: "pg-canvas pg-c-anomalie", role: "img", "aria-label": "Liniendiagramm einer Messreihe mit Schwellenband, Treffern, Fehlalarmen und übersehenen Fällen" });
    const canvas2 = h("canvas", { class: "pg-canvas pg-c-kurve", role: "img", "aria-label": "Diagramm: Fehlalarme und übersehene Fälle in Abhängigkeit vom Schwellenwert" });
    const satz = h("p", { class: "erklaerung pg-satz", "data-pg": "satz" });
    const alltag = h("p", { class: "pg-alltag", "data-pg": "alltag" });
    const sr = h("p", { class: "pg-sr", "aria-live": "polite" });
    const sprich = sprecher(sr); ab.push(() => sprich.stop());
    const rK = regler("Schwelle (Abstand in Streuungen)", 1, 6, 0.1, S.k, (v) => fmt(v, 1), (v) => { S.k = v; neu(); }, "schwelle");
    const gruppe = chipGruppe([["fest", "Feste Schwelle"], ["fenster", "Gleitendes Fenster"], ["saison", "Saison berücksichtigt"]], S.methode, (v) => { S.methode = v; neu(); }, "Verfahren");
    const sLaut = schalter("Rauschen erhöhen", S.laut, (v) => { S.laut = v; neu(); });
    sLaut.input.dataset.pg = "laut";
    const bNeu = h("button", { type: "button", class: "btn", "data-pg": "wuerfeln" }, "Messreihe neu würfeln");
    bNeu.addEventListener("click", () => { S.seed++; neu(); });
    const kTr = kachel("Echte Fälle gefunden", "", ""), kFa = kachel("Fehlalarme", "", ""), kUe = kachel("Übersehene Fälle", "", ""), kMe = kachel("Meldungen insgesamt", "", "");
    kTr.el.dataset.pg = "treffer"; kFa.el.dataset.pg = "fehlalarme"; kUe.el.dataset.pg = "uebersehen"; kMe.el.dataset.pg = "meldungen";
    const legende = h("div", { class: "pg-legende", "aria-hidden": "true" },
      h("span", null, h("i", { class: "pg-m-treffer" }), "echter Fall gefunden"), h("span", null, h("i", { class: "pg-m-fehl" }), "Fehlalarm"),
      h("span", null, h("i", { class: "pg-m-miss" }), "echter Fall übersehen"), h("span", null, h("i", { class: "pg-m-band" }), "erlaubter Bereich"));

    root.append(
      h("p", { class: "pg-leise" }, "Die Messreihe zeigt zum Beispiel die Temperatur einer Maschine. Darin stecken sechs echte Auffälligkeiten, die du hier schon kennst. Das Verfahren kennt sie nicht und lernt nur aus den ersten 100 Punkten, was normal ist."),
      h("div", { class: "pg-canvaswrap" }, canvas), legende,
      KL.gruppe("Verfahren", [KL.zeile("Verfahren", gruppe.el, null, true), rK.el, sLaut.el], { aktion: [bNeu] }),
      h("div", { class: "messwerte pg-messwerte" }, kTr.el, kFa.el, kUe.el, kMe.el),
      satz, alltag, sr,
      h("div", { class: "pg-abschnitt" }, h("p", { class: "pg-ueber" }, "Was die Schwelle kostet"), h("div", { class: "pg-canvaswrap" }, canvas2)),
      hinweis("Die Messreihe ist erfunden. Fehlalarme und übersehene Fälle kannst du nur zählen, weil du die Wahrheit kennst. Im Betrieb weiß niemand vorher, welche Meldung echt ist."));

    /* ---- Rechnen */
    let D = null;
    function rechne() {
      const { y, pos, sigma } = reihe(), { e, s } = erwartung(y, S.methode);
      const echt = new Set(pos), dev = [];
      for (let t = LERN; t < N; t++) dev.push({ t, z: Math.abs(y[t] - e[t]) / s[t], echt: echt.has(t) });
      const zaehle = (k) => { let tr = 0, fa = 0; for (const p of dev) if (p.z > k) { if (p.echt) tr++; else fa++; } return { tr, fa, ue: ANZ - tr, me: tr + fa }; };
      const kurve = KS.map((k) => ({ k, ...zaehle(k) }));
      return { y, pos, sigma, e, s, dev, kurve, jetzt: zaehle(S.k), echt };
    }

    /* ---- Zeichnen */
    const lein = leinwand(canvas, (ctx, W, Hh) => { if (D) zeichne(ctx, W, Hh); });
    const lein2 = leinwand(canvas2, (ctx, W, Hh) => { if (D) zeichneKurve(ctx, W, Hh); });
    ab.push(() => lein.destroy(), () => lein2.destroy());
    ab.push(mqHoeren(mqDunkel, () => { lein.plan(); lein2.plan(); }));
    const R = { l: 10, r: 10, t: 22, b: 22 };

    function zeichne(ctx, W, Hh) {
      const c = farben(), { y, e, s, dev, echt } = D;
      let mn = Infinity, mx = -Infinity;
      for (let t = 0; t < N; t++) { mn = Math.min(mn, y[t]); mx = Math.max(mx, y[t]); }
      for (let t = LERN; t < N; t++) if (isFinite(e[t])) { mn = Math.min(mn, e[t] - S.k * s[t]); mx = Math.max(mx, e[t] + S.k * s[t]); }
      const pad = (mx - mn) * 0.06 + 1, lo = mn - pad, hi = mx + pad;
      const xv = (t) => R.l + (t / (N - 1)) * (W - R.l - R.r), yv = (v) => R.t + (1 - (v - lo) / (hi - lo)) * (Hh - R.t - R.b);
      ctx.font = SCHRIFT; ctx.textBaseline = "middle";
      ctx.fillStyle = c.flaeche2; ctx.fillRect(xv(0), R.t - 8, xv(LERN - 0.5) - xv(0), Hh - R.t - R.b + 8);
      ctx.fillStyle = c.leise; ctx.textAlign = "left"; ctx.fillText(W < 520 ? "Lernphase" : "Lernphase: hier lernt das Verfahren, was normal ist", R.l + 4, 9);
      ctx.textAlign = "right"; ctx.fillText("Prüfphase", W - R.r, 9);
      ctx.strokeStyle = c.linie2; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) { const yy = Math.round(R.t + i * (Hh - R.t - R.b) / 4) + 0.5; ctx.beginPath(); ctx.moveTo(R.l, yy); ctx.lineTo(W - R.r, yy); ctx.stroke(); }
      ctx.fillStyle = c.leise; ctx.textAlign = "center";
      for (const t of [0, 50, 100, 150, 199]) ctx.fillText(String(t + 1), klemme(xv(t), 12, W - 12), Hh - 9);
      // erlaubter Bereich
      ctx.globalAlpha = 0.16; ctx.fillStyle = c.akzent; ctx.beginPath();
      let start = true;
      for (let t = LERN; t < N; t++) { if (!isFinite(e[t])) continue; const xx = xv(t), yy = yv(e[t] + S.k * s[t]); start ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); start = false; }
      for (let t = N - 1; t >= LERN; t--) if (isFinite(e[t])) ctx.lineTo(xv(t), yv(e[t] - S.k * s[t]));
      ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      // Messreihe
      ctx.strokeStyle = c.k1; ctx.lineWidth = 1.6; ctx.lineJoin = "round"; ctx.beginPath();
      for (let t = 0; t < N; t++) { const xx = xv(t), yy = yv(y[t]); t ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
      // Meldungen
      for (const p of dev) {
        const xx = xv(p.t), yy = yv(y[p.t]), gemeldet = p.z > S.k;
        if (gemeldet && p.echt) { ctx.fillStyle = c.gruen; ctx.strokeStyle = c.flaeche; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(xx, yy, 5.5, 0, 6.2832); ctx.fill(); ctx.stroke(); }
        else if (gemeldet) { ctx.strokeStyle = c.orange; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(xx - 4.5, yy - 4.5); ctx.lineTo(xx + 4.5, yy + 4.5); ctx.moveTo(xx + 4.5, yy - 4.5); ctx.lineTo(xx - 4.5, yy + 4.5); ctx.stroke(); }
        else if (p.echt) { ctx.strokeStyle = c.rot; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(xx, yy, 7, 0, 6.2832); ctx.stroke(); }
      }
    }
    function zeichneKurve(ctx, W, Hh) {
      const c = farben(), kv = D.kurve, L = 30, Rr = 12, T = 14, B = 24;
      const ymax = Math.max(6, ...kv.map((p) => Math.max(p.fa, p.ue)));
      const xv = (k) => L + (k - 1) / 5 * (W - L - Rr), yv = (v) => T + (1 - v / ymax) * (Hh - T - B);
      ctx.font = SCHRIFT; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
      ctx.strokeStyle = c.linie2; ctx.lineWidth = 1; ctx.fillStyle = c.leise; ctx.textAlign = "right";
      for (const v of [0, Math.round(ymax / 2), ymax]) { const yy = Math.round(yv(v)) + 0.5; ctx.beginPath(); ctx.moveTo(L, yy); ctx.lineTo(W - Rr, yy); ctx.stroke(); ctx.fillText(String(v), L - 6, yy); }
      ctx.textAlign = "center";
      for (let k = 1; k <= 6; k++) ctx.fillText(String(k), xv(k), Hh - 9);
      const linie = (key, farbe, strich) => {
        ctx.strokeStyle = farbe; ctx.lineWidth = 2.2; ctx.setLineDash(strich); ctx.beginPath();
        kv.forEach((p, i) => { const xx = xv(p.k), yy = yv(p[key]); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); });
        ctx.stroke(); ctx.setLineDash([]);
      };
      linie("fa", c.orange, []); linie("ue", c.rot, [6, 4]);
      const x0 = xv(S.k); ctx.strokeStyle = c.text; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 + 0.5, T - 4); ctx.lineTo(x0 + 0.5, Hh - B); ctx.stroke();
      const jetzt = D.jetzt;
      for (const [v, f] of [[jetzt.fa, c.orange], [jetzt.ue, c.rot]]) { ctx.fillStyle = f; ctx.strokeStyle = c.flaeche; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x0, yv(v), 4.5, 0, 6.2832); ctx.fill(); ctx.stroke(); }
      ctx.textAlign = "left"; ctx.fillStyle = c.text; ctx.fillText("Fehlalarme", L + 8, yv(kv[0].fa) + 2 > Hh - B - 6 ? Hh - B - 8 : yv(kv[0].fa) + 2);
      ctx.textAlign = "right"; ctx.fillStyle = c.text; ctx.fillText("übersehene Fälle", W - Rr - 4, yv(Math.max(kv[kv.length - 1].ue, 0)) - 10);
    }

    function neu() {
      D = rechne();
      const j = D.jetzt;
      kTr.set(j.tr + " von " + ANZ); kFa.set(String(j.fa)); kUe.set(String(j.ue)); kMe.set(String(j.me));
      Object.assign(root.dataset, { treffer: String(j.tr), fehlalarme: String(j.fa), uebersehen: String(j.ue), meldungen: String(j.me), methode: S.methode, schwelle: String(S.k) });
      let t;
      if (!j.me) t = "Bei " + fmt(S.k, 1) + " Streuungen meldet das Verfahren nichts. Alle " + ANZ + " echten Fälle bleiben unentdeckt.";
      else t = "Bei " + fmt(S.k, 1) + " Streuungen meldet das Verfahren " + j.me + (j.me === 1 ? " Fall" : " Fälle") + ". Von " + j.me + " Meldungen " + (j.tr === 1 ? "ist " : "sind ") + j.tr + " echt und " + j.fa + (j.fa === 1 ? " ist" : " sind") + " Fehlalarm. " + j.ue + " von " + ANZ + " echten Fällen " + (j.ue === 1 ? "bleibt" : "bleiben") + " unentdeckt.";
      let a;
      if (j.fa > j.tr) a = "Mehr als die Hälfte der Meldungen ist falsch, obwohl das Verfahren arbeitet wie gedacht. Wie bei einem Rauchmelder, der schon beim Toasten piept: Irgendwann hört niemand mehr hin.";
      else if (j.ue > 0) a = "Das ist ein Rauchmelder, der nur bei offenem Feuer piept. Es bleibt ruhig, aber ein Schwelbrand fällt nicht auf. Eine niedrigere Schwelle fängt mehr, weckt aber auch öfter grundlos.";
      else a = "Hier passt die Schwelle gerade. Mit mehr Rauschen oder einer neuen Messreihe verschiebt sich das. Es gibt keine Schwelle ohne Kosten, nur eine, die zur Lage passt.";
      satz.textContent = t; alltag.textContent = a; sprich.sag(t + " " + a);
      lein.plan(); lein2.plan();
    }
    neu();
    return aufraeumer(ab);
  };

  /* ============================================================ 4. empfehlungs-labor */
  /* Spalten: Artikel in der Reihenfolge von EMP_ARTIKEL. 0 heißt nicht bewertet, sonst 1 bis 5. Alles erfunden. */
  const EMP_NUTZER = ["Anna", "Ben", "Cem", "Dora", "Emil", "Fynn", "Gita", "Hugo", "Neu"];
  const EMP_FELDER = ["Technik", "Organisation"];
  const EMP_ARTIKEL = [
    { n: "Schmierplan Pressen", f: 0 }, { n: "Lagerwechsel", f: 0 }, { n: "Sensorik Grundlagen", f: 0 }, { n: "Energie sparen", f: 1 },
    { n: "Schichtübergabe", f: 1 }, { n: "Hydraulik-Störungen", f: 0 }, { n: "Kalibrierung", f: 0 }, { n: "Brandschutz", f: 1 },
    { n: "Stichprobenprüfung", f: 1 }, { n: "Einarbeitung", f: 1 },
  ];
  const EMP_BASIS = [
    [5, 4, 5, 0, 0, 0, 0, 0, 0, 0],
    [4, 5, 4, 0, 0, 5, 0, 0, 0, 2],
    [5, 0, 4, 2, 0, 0, 5, 0, 3, 0],
    [0, 0, 0, 4, 5, 0, 0, 5, 4, 5],
    [1, 0, 0, 5, 4, 0, 0, 4, 5, 0],
    [3, 0, 4, 4, 0, 3, 0, 4, 0, 4],
    [0, 5, 5, 0, 0, 4, 5, 0, 0, 3],
    [0, 2, 0, 3, 5, 0, 0, 5, 0, 4],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  KL.widgets["empfehlungs-labor"] = function (root) {
    root.classList.add("pg-wid", "pg-emp");
    const ab = [];
    const R = EMP_BASIS.map((r) => r.slice());
    const S = { u: 0, modus: "nutzer", k: 3, vielfalt: false, sel: null };
    const NI = EMP_ARTIKEL.length;
    const cos = (a, b) => {
      let dp = 0, x = 0, y = 0;
      for (let i = 0; i < a.length; i++) { dp += a[i] * b[i]; x += a[i] * a[i]; y += b[i] * b[i]; }
      return x && y ? dp / Math.sqrt(x * y) : 0;
    };
    const spalte = (i) => R.map((r) => r[i]);
    const mittel = (a) => a.reduce((x, y) => x + y, 0) / a.length;

    function berechne() {
      const u = S.u, mein = R[u], bew = mein.filter((v) => v > 0).length;
      const res = { bew, kalt: false, nachbarn: [], sims: [], preds: new Array(NI).fill(null), recs: [], pop: [], bubble: false, entdeckung: null };
      for (let i = 0; i < NI; i++) {
        if (mein[i]) continue;
        const rs = spalte(i).filter((v) => v > 0);
        if (rs.length) res.pop.push({ i, n: rs.length, avg: mittel(rs) });
      }
      res.pop.sort((a, b) => b.n - a.n || b.avg - a.avg || a.i - b.i);
      if (S.modus === "nutzer") {
        res.sims = R.map((r, v) => (v === u ? null : { v, s: cos(mein, r), gem: r.filter((x, i) => x > 0 && mein[i] > 0).length })).filter(Boolean).sort((a, b) => b.s - a.s || a.v - b.v);
        res.nachbarn = res.sims.filter((x) => x.s > 0).slice(0, S.k);
        if (!bew || !res.nachbarn.length) res.kalt = true;
        else for (let i = 0; i < NI; i++) {
          if (mein[i]) continue;
          let n = 0, dd = 0; const bei = [];
          for (const nb of res.nachbarn) { const w = R[nb.v][i]; if (w > 0) { n += nb.s * w; dd += nb.s; bei.push({ v: nb.v, s: nb.s, w }); } }
          if (dd) res.preds[i] = { wert: n / dd, bei };
        }
      } else if (!bew) res.kalt = true;
      else {
        const J = []; mein.forEach((v, i) => { if (v > 0) J.push(i); });
        for (let i = 0; i < NI; i++) {
          if (mein[i]) continue;
          const bei = J.map((j) => ({ j, s: cos(spalte(i), spalte(j)), w: mein[j] })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s || a.j - b.j).slice(0, S.k);
          const dd = bei.reduce((a, x) => a + x.s, 0);
          if (dd) res.preds[i] = { wert: bei.reduce((a, x) => a + x.s * x.w, 0) / dd, bei };
        }
        if (!res.preds.some(Boolean)) res.kalt = true;
      }
      if (res.kalt) res.recs = res.pop.slice(0, 3).map((p) => ({ i: p.i, wert: p.avg, pop: true, n: p.n }));
      else {
        res.recs = res.preds.map((p, i) => (p ? { i, wert: p.wert, bei: p.bei } : null)).filter(Boolean)
          .sort((a, b) => b.wert - a.wert || b.bei.length - a.bei.length || a.i - b.i).slice(0, 3);
        const summe = [0, 0]; mein.forEach((v, i) => { summe[EMP_ARTIKEL[i].f] += v; });
        const dom = summe[0] >= summe[1] ? 0 : 1, anteil = summe[dom] / Math.max(1, summe[0] + summe[1]);
        const imFeld = res.recs.filter((r) => EMP_ARTIKEL[r.i].f === dom).length;
        res.dom = dom;
        res.bubble = bew >= 3 && anteil >= 0.6 && res.recs.length >= 2 && imFeld / res.recs.length >= 2 / 3;
        if (S.vielfalt) {
          const aus = res.recs.slice(0, 2).map((r) => r.i);
          const p = res.pop.find((x) => EMP_ARTIKEL[x.i].f !== dom && !aus.includes(x.i));
          if (p) { res.entdeckung = { i: p.i, wert: p.avg, disc: true, n: p.n }; res.recs = res.recs.slice(0, 2).concat([res.entdeckung]); }
        }
      }
      return res;
    }

    /* ---- Oberfläche */
    const tabBox = h("div", { class: "tabelle-wrap pg-tabbox" });
    const simBox = h("div", { class: "pg-panel", "data-pg": "aehnlich" });
    const recBox = h("div", { class: "pg-panel", "data-pg": "empfehlungen" });
    const blase = h("p", { class: "pg-blase", "data-pg": "blase", hidden: true });
    const satz = h("p", { class: "erklaerung pg-satz", "data-pg": "satz" });
    const sr = h("p", { class: "pg-sr", "aria-live": "polite" });
    const sprich = sprecher(sr); ab.push(() => sprich.stop());
    const gruppe = chipGruppe([["nutzer", "Nach Nutzerähnlichkeit"], ["artikel", "Nach Artikelähnlichkeit"]], S.modus, (v) => { S.modus = v; S.sel = null; alles(); }, "Verfahren");
    const rK = regler("Anzahl Nachbarn", 1, 7, 1, S.k, (v) => String(v), (v) => { S.k = v; alles(); }, "nachbarn");
    const sV = schalter("Vielfalt beimischen", S.vielfalt, (v) => { S.vielfalt = v; alles(); });
    sV.input.dataset.pg = "vielfalt";

    root.append(
      h("p", { class: "pg-leise" }, "Acht erfundene Personen haben zehn Wissensartikel von 1 bis 5 bewertet, die Person „Neu“ noch nichts. Klicke auf eine Zelle, um die Bewertung zu ändern, oder tippe eine Zahl von 0 bis 5. Wähle einen Namen, dann siehst du seine Empfehlungen."),
      KL.gruppe("Empfehlung", [KL.zeile("Verfahren", gruppe.el, null, true), rK.el, sV.el]),
      tabBox,
      h("div", { class: "pg-legende", "aria-hidden": "true" },
        h("span", null, h("i", { class: "pg-f0" }), EMP_FELDER[0]), h("span", null, h("i", { class: "pg-f1" }), EMP_FELDER[1]),
        h("span", null, h("i", { class: "pg-vorh" }), "Vorhersage für leere Zellen")),
      h("div", { class: "pg-zwei" }, simBox, recBox), blase, satz, sr,
      hinweis("Kosinus-Ähnlichkeit: 1 heißt, zwei Geschmäcker zeigen in dieselbe Richtung, 0 heißt, sie haben nichts gemeinsam. Nicht bewertet zählt dabei als 0. Die Tabelle ist erfunden und winzig, echte Systeme rechnen mit Millionen Zellen."));

    /* ---- Zeichnen */
    let E = null;
    function zeichneTabelle(fokus) {
      const kopf = h("tr", null, h("th", { scope: "col", class: "pg-eck" }, "Artikel"));
      EMP_NUTZER.forEach((n, u) => {
        const nb = S.modus === "nutzer" && !E.kalt && E.nachbarn.some((x) => x.v === u);
        kopf.append(h("th", { scope: "col", class: "pg-sp" + (u === S.u ? " ist-gewaehlt" : "") + (nb ? " ist-nachbar" : "") },
          h("button", { type: "button", class: "pg-name", "aria-pressed": u === S.u ? "true" : "false", dataset: { nutzer: String(u) }, onclick: () => { S.u = u; S.sel = null; alles(); } }, n),
          nb ? h("span", { class: "pg-nb" }, "Nachbar") : null));
      });
      const rows = EMP_ARTIKEL.map((a, i) => {
        const tr = h("tr", null, h("th", { scope: "row", class: "pg-art" }, h("i", { class: "pg-f" + a.f, title: EMP_FELDER[a.f] }), a.n));
        EMP_NUTZER.forEach((n, u) => {
          const v = R[u][i], vorher = u === S.u && !v && E.preds[i] && !E.kalt ? E.preds[i].wert : null;
          const b = h("button", {
            type: "button", class: "pg-zelle" + (v ? " hat" : "") + (vorher != null ? " vorher" : "") + (u === S.u ? " ist-gewaehlt" : ""), dataset: { u: String(u), i: String(i), wert: String(v) },
            "aria-label": n + ", " + a.n + ": " + (v ? v + " von 5" : "nicht bewertet") + (vorher != null ? ", Vorhersage " + fmt(vorher, 1) : "") + ". Klick ändert, Tasten 0 bis 5 setzen direkt.",
          }, v ? String(v) : vorher != null ? fmt(vorher, 1) : "");
          b.addEventListener("click", () => setze(u, i, (R[u][i] + 1) % 6));
          b.addEventListener("keydown", (e) => {
            if (/^[0-5]$/.test(e.key)) { e.preventDefault(); setze(u, i, Number(e.key)); }
            else if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); setze(u, i, 0); }
          });
          tr.append(h("td", { class: u === S.u ? "ist-gewaehlt" : null }, b));
        });
        return tr;
      });
      tabBox.replaceChildren(h("table", { class: "pg-etab" }, h("caption", { class: "pg-sr" }, "Bewertungen der Artikel durch die Personen"), h("thead", null, kopf), h("tbody", null, rows)));
      if (fokus) { const z = tabBox.querySelector('[data-u="' + fokus.u + '"][data-i="' + fokus.i + '"]'); if (z) z.focus({ preventScroll: true }); }
    }
    function setze(u, i, v) { R[u][i] = v; S.sel = null; alles({ u, i }); }
    const nm = (v) => EMP_NUTZER[v];

    function zeichnePaneele() {
      // Ähnlichkeit
      const selRec = E.recs.find((r) => !r.pop && !r.disc && r.i === S.sel) || E.recs.find((r) => !r.pop && !r.disc) || null;
      const sBars = [];
      let titel, sub;
      if (S.modus === "nutzer") {
        titel = "Wer ähnelt " + nm(S.u) + "?";
        sub = E.bew ? "Die obersten " + S.k + " mit Ähnlichkeit über 0 sind die Nachbarn und liefern die Empfehlung." : nm(S.u) + " hat nichts bewertet, daher lässt sich keine Ähnlichkeit berechnen.";
        for (const x of E.sims) {
          const nb = E.nachbarn.some((y) => y.v === x.v);
          const beste = R[x.v].map((w, i) => ({ w, i })).filter((q) => q.w > 0).sort((a, b) => b.w - a.w || a.i - b.i).slice(0, 2).map((q) => EMP_ARTIKEL[q.i].n + " " + q.w).join(", ");
          sBars.push(h("li", { class: "pg-sim" + (nb ? " ist-nachbar" : ""), dataset: { nutzer: nm(x.v), aehnlich: x.s.toFixed(3), nachbar: nb ? "1" : "0" } },
            h("span", { class: "pg-sim-n" }, nm(x.v), nb ? h("em", null, "Nachbar") : null),
            h("span", { class: "pg-sbar" }, h("i", { style: "width:" + klemme(x.s, 0, 1) * 100 + "%" })),
            h("span", { class: "pg-sim-w" }, fmt(x.s, 2)),
            h("span", { class: "pg-sim-z" }, x.gem + " gemeinsam bewertet" + (beste ? ". Mag: " + beste : ""))));
        }
      } else {
        const rec = selRec;
        const p = rec && E.preds[rec.i];
        if (rec && p) {
          titel = "Welche Artikel ähneln „" + EMP_ARTIKEL[rec.i].n + "“?";
          sub = "Verglichen mit den Artikeln, die " + nm(S.u) + " schon bewertet hat. Die obersten " + S.k + " liefern den Wert.";
          const alle = R[S.u].map((w, j) => ({ j, w })).filter((q) => q.w > 0).map((q) => ({ ...q, s: cos(spalte(rec.i), spalte(q.j)) })).sort((a, b) => b.s - a.s || a.j - b.j);
          for (const x of alle) {
            const nb = p.bei.some((y) => y.j === x.j);
            sBars.push(h("li", { class: "pg-sim" + (nb ? " ist-nachbar" : ""), dataset: { artikel: EMP_ARTIKEL[x.j].n, aehnlich: x.s.toFixed(3), nachbar: nb ? "1" : "0" } },
              h("span", { class: "pg-sim-n" }, EMP_ARTIKEL[x.j].n, nb ? h("em", null, "Nachbar") : null),
              h("span", { class: "pg-sbar" }, h("i", { style: "width:" + klemme(x.s, 0, 1) * 100 + "%" })),
              h("span", { class: "pg-sim-w" }, fmt(x.s, 2)),
              h("span", { class: "pg-sim-z" }, "deine Bewertung: " + x.w)));
          }
        } else { titel = "Ähnlichkeit der Artikel"; sub = nm(S.u) + " hat nichts bewertet, daher gibt es keine Artikel zum Vergleichen."; }
      }
      simBox.replaceChildren(...[h("p", { class: "pg-ueber" }, "Nachbarn"), h("h3", { class: "pg-h3" }, titel), h("p", { class: "pg-notiz" }, sub), sBars.length ? h("ul", { class: "pg-simliste" }, sBars) : null].filter(Boolean));

      // Empfehlungen
      const recs = E.recs, li = [];
      recs.forEach((r, n) => {
        const a = EMP_ARTIKEL[r.i];
        let grund;
        if (r.pop) grund = "Beliebt: " + r.n + (r.n === 1 ? " Bewertung" : " Bewertungen") + ", im Mittel " + fmt(r.wert, 1) + ".";
        else if (r.disc) grund = "Bewusst aus dem anderen Themenfeld (" + EMP_FELDER[a.f] + "), damit nicht nur mehr vom Gleichen kommt. " + r.n + (r.n === 1 ? " Bewertung" : " Bewertungen") + ", im Mittel " + fmt(r.wert, 1) + ".";
        else if (S.modus === "nutzer") grund = "Ähnliche Nutzer: " + r.bei.map((b) => nm(b.v) + " (" + fmt(b.s, 2) + ") gab " + b.w).join(", ") + ".";
        else grund = "Ähnliche Artikel, die du kennst: " + r.bei.map((b) => EMP_ARTIKEL[b.j].n + " (" + fmt(b.s, 2) + ", deine " + b.w + ")").join(", ") + ".";
        const wertText = r.disc ? "Ø " + fmt(r.wert, 1) : fmt(r.wert, 1);
        const inhalt = [h("span", { class: "pg-rang" }, String(n + 1)),
          h("span", { class: "pg-rec-n" }, a.n, r.disc ? h("em", null, "Entdeckung") : null, h("small", null, grund)),
          h("span", { class: "pg-sbar pg-rbar" }, h("i", { style: "width:" + klemme(r.wert / 5, 0, 1) * 100 + "%" })),
          h("span", { class: "pg-sim-w" }, wertText)];
        const klickbar = S.modus === "artikel" && !r.pop && !r.disc;
        const el = klickbar
          ? h("button", { type: "button", class: "pg-rec" + (selRec === r ? " ist-gewaehlt" : ""), "aria-pressed": selRec === r ? "true" : "false", dataset: { artikel: a.n } }, inhalt)
          : h("div", { class: "pg-rec", dataset: { artikel: a.n } }, inhalt);
        if (klickbar) el.addEventListener("click", () => { S.sel = r.i; alles(); });
        li.push(h("li", null, el));
      });
      const kopf = E.kalt && E.bew === 0 ? "Kaltstart: noch keine Bewertungen" : E.kalt ? "Kein ähnlicher Nutzer gefunden" : "Empfehlungen für " + nm(S.u);
      recBox.replaceChildren(...[h("p", { class: "pg-ueber" }, "Empfehlungen"), h("h3", { class: "pg-h3" }, kopf),
        E.kalt ? h("p", { class: "pg-notiz", "data-pg": "kaltstart" }, (E.bew === 0 ? nm(S.u) + " hat noch nichts bewertet. Ohne Bewertungen gibt es keine Ähnlichkeit." : "Es gibt keinen Nutzer mit gemeinsamem Geschmack.") + " Das System fällt auf Beliebtes zurück und zeigt allen dasselbe. Bewerte ein paar Artikel und sieh zu, wie die Liste persönlich wird.") : null,
        li.length ? h("ol", { class: "pg-reclist" }, li) : h("p", { class: "pg-notiz" }, "Mit diesen Nachbarn gibt es keinen Artikel, den " + nm(S.u) + " noch nicht kennt. Erhöhe die Zahl der Nachbarn.")].filter(Boolean));
    }

    function alles(fokus) {
      E = berechne();
      zeichneTabelle(fokus); zeichnePaneele();
      const top = E.recs[0];
      Object.assign(root.dataset, {
        nutzer: nm(S.u), modus: S.modus, kaltstart: E.kalt ? "1" : "0", top: E.recs.map((r) => EMP_ARTIKEL[r.i].n).join("|"),
        topWert: top ? top.wert.toFixed(3) : "", blase: E.bubble ? "1" : "0", vielfalt: E.entdeckung ? "1" : "0",
      });
      blase.hidden = !(E.bubble);
      if (E.bubble) blase.textContent = S.vielfalt && E.entdeckung
        ? "Filterblase gebremst: Die Empfehlung „" + EMP_ARTIKEL[E.entdeckung.i].n + "“ kommt aus dem anderen Themenfeld. So siehst du auch etwas, das nicht nach deinem bisherigen Geschmack aussieht."
        : "Filterblase: Fast alle Empfehlungen stammen aus demselben Themenfeld (" + EMP_FELDER[E.dom] + ") wie das, was " + nm(S.u) + " schon bewertet hat. Das System zeigt mehr vom Gleichen. Mit „Vielfalt beimischen“ kommt eine Empfehlung aus dem anderen Feld.";
      let t;
      if (E.kalt) t = nm(S.u) + (E.bew === 0 ? " hat noch nichts bewertet. Das System kennt den Geschmack nicht und empfiehlt, was allen gefällt: " : ": kein ähnlicher Nutzer, daher Rückfall auf Beliebtes: ") + E.recs.map((r) => EMP_ARTIKEL[r.i].n).join(", ") + ".";
      else if (top) t = "Für " + nm(S.u) + " liegt „" + EMP_ARTIKEL[top.i].n + "“ vorn mit " + fmt(top.wert, 1) + " von 5. " + (S.modus === "nutzer"
        ? "Grundlage sind die " + E.nachbarn.length + " ähnlichsten Nutzer: " + E.nachbarn.map((x) => nm(x.v) + " (" + fmt(x.s, 2) + ")").join(", ") + "."
        : "Der Wert kommt aus Artikeln, die denen ähneln, die " + nm(S.u) + " schon gut fand.");
      else t = "Für " + nm(S.u) + " gibt es mit diesen Nachbarn keine Empfehlung.";
      satz.textContent = t; sprich.sag(t);
    }
    alles();
    return aufraeumer(ab);
  };

  /* ============================================================ 5. kosten-rechner */
  const KOSTEN_FELDER = [
    { k: "w", label: "Leistungsaufnahme", einheit: "Watt", start: "15", hilfe: "Was das Gerät beim Arbeiten zieht." },
    { k: "h", label: "Laufzeit pro Tag", einheit: "Stunden", start: "24", max: 24, hilfe: "Von 0 bis 24 Stunden." },
    { k: "preis", label: "Strompreis", einheit: "€ je kWh", start: "0,30", hilfe: "Steht auf deiner Stromrechnung." },
    { k: "kauf", label: "Anschaffung", einheit: "€", start: "500", hilfe: "Einmalig, mit Zubehör." },
    { k: "jahre", label: "Nutzungsdauer", einheit: "Jahre", start: "3", positiv: true, hilfe: "So lange rechnest du mit dem Gerät." },
    { k: "cloud", label: "Alternative: Cloud pro Monat", einheit: "€", start: "50", hilfe: "Was dieselbe Aufgabe in der Cloud kostet." },
    { k: "pers", label: "Betreuung pro Monat", einheit: "€", start: "30", hilfe: "Personal, Pflege und Updates beim eigenen Betrieb. Beispielannahme: etwa eine halbe Stunde Arbeit pro Woche." },
  ];
  const TAGE_JAHR = 365;

  /* reine Rechnung, damit sie auch ohne Oberfläche prüfbar bleibt */
  function kostenRechnung(v) {
    const kwhTag = v.w / 1000 * v.h, tag = kwhTag * v.preis, jahr = tag * TAGE_JAHR, monat = jahr / 12;
    const lauf = monat + v.pers, ersp = v.cloud - lauf, monate = v.jahre * 12;
    const amort = ersp > 0 ? v.kauf / ersp : Infinity;
    return { kwhTag, tag, monat, jahr, lauf, ersp, amort, monate, gesamtEigen: v.kauf + lauf * monate, gesamtCloud: v.cloud * monate, stromGesamt: monat * monate, persGesamt: v.pers * monate };
  }

  KL.widgets["kosten-rechner"] = function (root) {
    root.classList.add("pg-wid", "pg-kosten");
    const ab = [];
    const V = {}, roh = {}, fehler = {}, herkunft = {};
    const eur = (n) => euro(n, Math.abs(n) < 1 && n !== 0 ? 3 : 2);
    const monateText = (m) => (isFinite(m) ? fmt(m, 1) + " Monate" : "nie");
    function lies(f, text) {
      const t = String(text).trim().replace(/\s/g, "");
      if (!t) return { fehler: "Bitte gib eine Zahl ein." };
      if (!/^\d+([.,]\d+)?$/.test(t)) return { fehler: /^-/.test(t) ? "Die Zahl darf nicht negativ sein." : "Bitte eine Zahl ohne Tausenderpunkt, mit Komma für Dezimalstellen." };
      const n = Number(t.replace(",", "."));
      if (f.positiv && n <= 0) return { fehler: "Die Zahl muss größer als 0 sein." };
      if (f.max != null && n > f.max) return { fehler: "Die Zahl darf höchstens " + f.max + " sein." };
      return { wert: n };
    }

    /* ---- Oberfläche */
    const reihen = [];
    const eingaben = {}, fehlerEl = {}, tagEl = {};
    for (const f of KOSTEN_FELDER) {
      const id = neueId("kosten"), fid = id + "-f";
      roh[f.k] = f.start; herkunft[f.k] = "beispiel"; V[f.k] = lies(f, f.start).wert;
      const input = h("input", { type: "text", inputmode: "decimal", id, value: f.start, autocomplete: "off", "aria-describedby": fid, "data-feld": f.k });
      const tag = h("span", { class: "pg-tag", "data-herkunft": "beispiel" }, "Beispielannahme");
      const fe = h("span", { class: "pg-fehler", id: fid }, "");
      input.addEventListener("input", () => {
        roh[f.k] = input.value; herkunft[f.k] = "eigen";
        const r = lies(f, input.value);
        if (r.fehler) { fehler[f.k] = r.fehler; input.setAttribute("aria-invalid", "true"); } else { delete fehler[f.k]; V[f.k] = r.wert; input.removeAttribute("aria-invalid"); }
        fe.textContent = fehler[f.k] || ""; markiere(); rechne();
      });
      eingaben[f.k] = input; fehlerEl[f.k] = fe; tagEl[f.k] = tag;
      reihen.push(h("div", { class: "pg-feld" }, h("label", { for: id }, f.label, tag),
        h("span", { class: "pg-eingabe" }, input, h("span", { class: "pg-einheit" }, f.einheit)), fe, h("span", { class: "pg-hilfe" }, f.hilfe)));
    }
    function markiere() {
      for (const f of KOSTEN_FELDER) {
        const t = tagEl[f.k], hk = herkunft[f.k];
        t.dataset.herkunft = hk;
        t.textContent = hk === "beispiel" ? "Beispielannahme" : hk === "messwert" ? "Messwert, Momentwert" : "deine Eingabe";
      }
    }

    const jetsonStatus = h("p", { class: "pg-notiz", "data-pg": "jetson-status" }, "");
    const bJetson = h("button", { type: "button", class: "btn", "data-pg": "jetson" }, icon("live"), "Messwert des Jetson übernehmen");
    let jetsonW = null;
    function jetsonAnzeige() {
      bJetson.disabled = jetsonW == null;
      jetsonStatus.textContent = jetsonW == null ? "Gerade liegt kein Messwert vor. Gib die Leistung von Hand ein."
        : "Der Jetson meldet gerade " + fmt(jetsonW, 1) + " Watt. Das ist ein Momentwert, kein Durchschnitt über den Tag.";
    }
    bJetson.addEventListener("click", () => {
      if (jetsonW == null) return;
      const text = fmt(jetsonW, 1);
      eingaben.w.value = text; roh.w = text; V.w = jetsonW; herkunft.w = "messwert"; delete fehler.w; eingaben.w.removeAttribute("aria-invalid"); fehlerEl.w.textContent = "";
      jetsonStatus.textContent = "Übernommen: " + text + " Watt als Beispielannahme. Das ist ein Momentwert aus diesem Augenblick. Unter Last liegt der Verbrauch höher, im Leerlauf niedriger. Ein Durchschnitt über einen Tag wäre aussagekräftiger.";
      markiere(); rechne();
    });
    ab.push(stats.on((d) => {
      jetsonW = d && d.power_w != null && isFinite(Number(d.power_w)) && Number(d.power_w) > 0 ? Number(d.power_w) : null;
      if (herkunft.w !== "messwert") jetsonAnzeige();
    }));

    const tabCaption = "Laufende Kosten";
    const tabBox = h("div", { class: "tabelle-wrap" });
    const balkenBox = h("div", { class: "pg-balken", "data-pg": "balken" });
    const sensBox = h("div", { class: "tabelle-wrap" });
    const kErsp = kachel("Ersparnis pro Monat gegenüber der Cloud", "", ""), kAmort = kachel("Amortisation der Anschaffung", "", "");
    kErsp.el.dataset.pg = "ersparnis"; kAmort.el.dataset.pg = "amortisation"; kAmort.el.classList.add("pg-gross"); kErsp.el.classList.add("pg-gross");
    const satz = h("p", { class: "erklaerung pg-satz", "data-pg": "satz" });
    const sr = h("p", { class: "pg-sr", "aria-live": "polite" });
    const sprich = sprecher(sr); ab.push(() => sprich.stop());

    root.append(
      h("p", { class: "pg-annahme" }, icon("info"), h("span", null, h("b", null, "Alle Werte sind deine Annahmen, keine Preise oder Messwerte. "), "Die Beispielannahmen unten sind nur Startwerte zum Ausprobieren. Überschreibe sie mit deinen eigenen Zahlen.")),
      KL.gruppe("Annahmen", reihen, { fuss: jetsonStatus, aktion: [bJetson] }),
      h("div", { class: "messwerte pg-messwerte" }, kErsp.el, kAmort.el),
      satz, sr,
      h("div", { class: "pg-abschnitt" }, tabBox),
      h("div", { class: "pg-abschnitt" }, h("p", { class: "pg-ueber", id: "pg-balken-titel" }, "Gesamtkosten über die Nutzungsdauer"), balkenBox),
      h("div", { class: "pg-abschnitt" }, h("p", { class: "pg-ueber" }, "Was wäre, wenn: Monate bis zur Amortisation"), sensBox),
      hinweis("Gerechnet wird mit 365 Tagen im Jahr und einem gleichbleibenden Verbrauch. Nicht enthalten sind Steuern, Zinsen, Preisänderungen, Ausfälle und Kosten für den Platz. Die Rechnung ist so gut wie deine Annahmen."));

    /* ---- Rechnen und Zeichnen */
    function rechne() {
      const ok = KOSTEN_FELDER.every((f) => !fehler[f.k]);
      root.dataset.gueltig = ok ? "1" : "0";
      if (!ok) {
        kErsp.set("bitte prüfen"); kAmort.set("bitte prüfen");
        const t = "Bitte gib in den markierten Feldern eine Zahl von 0 aufwärts ein, dann rechne ich neu.";
        satz.textContent = t; sprich.sag(t);
        tabBox.replaceChildren(); balkenBox.replaceChildren(); sensBox.replaceChildren();
        return;
      }
      const r = kostenRechnung(V);
      kErsp.set(r.ersp > 0 ? eur(r.ersp) : "keine");
      kAmort.set(monateText(r.amort));
      Object.assign(root.dataset, {
        kwhTag: r.kwhTag.toFixed(6), kostenTag: r.tag.toFixed(6), kostenMonat: r.monat.toFixed(6), kostenJahr: r.jahr.toFixed(6),
        ersparnis: r.ersp.toFixed(6), amort: isFinite(r.amort) ? r.amort.toFixed(6) : "nie", gesamtEigen: r.gesamtEigen.toFixed(4), gesamtCloud: r.gesamtCloud.toFixed(4),
      });
      // Tabelle laufende Kosten
      const zeile = (name, faktor) => {
        const st = r.tag * faktor, pe = V.pers * 12 / TAGE_JAHR * faktor, eigen = st + pe, cl = V.cloud * 12 / TAGE_JAHR * faktor;
        return h("tr", null, h("th", { scope: "row" }, name), h("td", null, fmt(r.kwhTag * faktor, faktor === 1 ? 2 : 1) + " kWh"), h("td", null, eur(st)), h("td", null, eur(pe)), h("td", null, h("b", null, eur(eigen))), h("td", null, eur(cl)));
      };
      tabBox.replaceChildren(h("table", { class: "vergleich pg-tab-kosten", "data-pg": "kostentabelle" }, h("caption", null, tabCaption),
        h("thead", null, h("tr", null, ["Zeitraum", "Energie", "Strom", "Betreuung", "Eigener Betrieb", "Cloud"].map((k) => h("th", { scope: "col" }, k)))),
        h("tbody", null, zeile("Tag", 1), zeile("Monat", TAGE_JAHR / 12), zeile("Jahr", TAGE_JAHR))));
      // Balken
      const max = Math.max(r.gesamtEigen, r.gesamtCloud, 0.0001);
      const seg = (cls, wert, name) => (wert > 0 ? h("i", { class: cls, style: "width:" + (100 * wert / max) + "%", title: name + ": " + eur(wert) }) : null);
      balkenBox.replaceChildren(
        h("div", { class: "pg-bz" }, h("span", { class: "pg-bn" }, "Eigener Betrieb"), h("span", { class: "pg-bs" }, seg("a", V.kauf, "Anschaffung"), seg("b", r.stromGesamt, "Strom"), seg("c", r.persGesamt, "Betreuung")), h("span", { class: "pg-bw" }, eur(r.gesamtEigen))),
        h("div", { class: "pg-bz" }, h("span", { class: "pg-bn" }, "Cloud"), h("span", { class: "pg-bs" }, seg("d", r.gesamtCloud, "Cloud")), h("span", { class: "pg-bw" }, eur(r.gesamtCloud))),
        h("div", { class: "pg-legende", "aria-hidden": "true" }, h("span", null, h("i", { class: "pg-k-a" }), "Anschaffung " + eur(V.kauf)), h("span", null, h("i", { class: "pg-k-b" }), "Strom " + eur(r.stromGesamt)),
          h("span", null, h("i", { class: "pg-k-c" }), "Betreuung " + eur(r.persGesamt)), h("span", null, h("i", { class: "pg-k-d" }), "Cloud " + eur(r.gesamtCloud))),
        h("p", { class: "pg-notiz" }, "Über " + fmt(V.jahre, V.jahre % 1 ? 1 : 0) + (V.jahre === 1 ? " Jahr" : " Jahre") + " (" + fmt(r.monate, 0) + " Monate). " + (r.gesamtEigen <= r.gesamtCloud ? "Der eigene Betrieb ist um " + eur(r.gesamtCloud - r.gesamtEigen) + " günstiger." : "Die Cloud ist um " + eur(r.gesamtEigen - r.gesamtCloud) + " günstiger.")));
      // Sensitivität
      const faktoren = [0.5, 1, 1.5, 2], stunden = [6, 12, 18, 24];
      const wert = (fa, hh) => kostenRechnung({ ...V, preis: V.preis * fa, h: hh }).amort;
      const alle = []; faktoren.forEach((fa) => stunden.forEach((hh) => { const a = wert(fa, hh); if (isFinite(a)) alle.push(a); }));
      const lo = Math.min(...alle, Infinity), hi = Math.max(...alle, -Infinity);
      sensBox.replaceChildren(h("table", { class: "vergleich pg-tab-sens", "data-pg": "sensitivitaet" },
        h("caption", null, "Zeile: Strompreis, Spalte: Laufzeit pro Tag"),
        h("thead", null, h("tr", null, h("th", { scope: "col" }, "Strompreis"), stunden.map((x) => h("th", { scope: "col" }, x + " Std.")))),
        h("tbody", null, faktoren.map((fa) => h("tr", null, h("th", { scope: "row" }, euro(V.preis * fa, 2) + " je kWh" + (fa === 1 ? " (deiner)" : "")),
          stunden.map((hh) => {
            const a = wert(fa, hh), mark = fa === 1 && hh === V.h;
            const anteil = isFinite(a) && hi > lo ? (a - lo) / (hi - lo) : 0;
            return h("td", { class: "pg-sens" + (mark ? " ist-deine" : ""), style: isFinite(a) ? "--pg-w:" + Math.round(anteil * 22) + "%" : null, dataset: { amort: isFinite(a) ? a.toFixed(4) : "nie" } }, isFinite(a) ? fmt(a, 1) : "nie");
          }))))));
      // Satz
      const doppelt = kostenRechnung({ ...V, preis: V.preis * 2 }).amort;
      let t = fmt(V.w, V.w % 1 ? 1 : 0) + " Watt über " + fmt(V.h, V.h % 1 ? 1 : 0) + " Stunden sind " + fmt(r.kwhTag, 2) + " Kilowattstunden am Tag. Bei " + euro(V.preis, 2) + " je Kilowattstunde macht das " + eur(r.tag) + " am Tag und " + eur(r.jahr) + " im Jahr. ";
      if (r.ersp > 0) {
        t += "Die Cloud kostet " + eur(V.cloud) + " im Monat, der eigene Betrieb " + eur(r.lauf) + ". Du sparst " + eur(r.ersp) + " im Monat. Die Anschaffung von " + euro(V.kauf, V.kauf % 1 ? 2 : 0) + " ist nach " + fmt(r.amort, 1) + " Monaten wieder drin. ";
        t += r.amort > r.monate ? "Das ist länger als die geplante Nutzungsdauer von " + fmt(V.jahre, V.jahre % 1 ? 1 : 0) + " Jahren: Auf dem Papier lohnt es sich nicht. " : "Über die Nutzungsdauer bleiben " + eur(r.gesamtCloud - r.gesamtEigen) + " übrig. ";
        if (V.preis > 0) t += isFinite(doppelt) ? "Verdoppelst du den Strompreis, dauert es " + fmt(doppelt, 1) + " statt " + fmt(r.amort, 1) + " Monate." : "Verdoppelst du den Strompreis, kommt die Anschaffung nie zurück.";
      } else t += "Der eigene Betrieb kostet im Monat " + eur(r.lauf) + " und ist damit nicht günstiger als die Cloud mit " + eur(V.cloud) + ". Die Anschaffung kommt nie zurück.";
      satz.textContent = t.trim(); sprich.sag(t.trim());
    }
    jetsonAnzeige(); markiere(); rechne();
    return aufraeumer(ab);
  };

  /* ============================================================ 6. checkliste (Seitenfeld checkliste: {lead, punkte: [{frage, hilfe}]}) */
  /* Fragen zum Abhaken. Nichts wird gespeichert. "Drucken" öffnet den Druckdialog des Browsers. Texte nur über textContent. */
  KL.widgets.checkliste = function (root, seite) {
    const c = (seite && seite.checkliste) || {};
    const punkte = Array.isArray(c.punkte) ? c.punkte : [];
    const stand = h("p", { class: "pg-notiz", role: "status", "aria-live": "polite" }, "");
    const boxen = [];
    const zaehle = () => { const n = boxen.filter((b) => b.checked).length; stand.textContent = n + " von " + punkte.length + " Fragen geklärt."; };
    const liste = h("ol", { class: "drei-schritte" }, punkte.map((p, i) => {
      const id = neueId("check");
      const input = h("input", { type: "checkbox", id });
      input.addEventListener("change", zaehle);
      boxen.push(input);
      return h("li", null, input, h("label", { for: id }, h("span", { class: "nr", "aria-hidden": "true" }, String(i + 1)),
        h("span", null, h("b", null, p.frage), p.hilfe ? h("small", { style: "display:block;color:var(--leise)" }, p.hilfe) : null)));
    }));
    root.append(c.lead ? h("p", { class: "drei-lead" }, c.lead) : null, liste, stand,
      h("div", { class: "zeile" }, h("button", { type: "button", class: "btn", onclick: () => window.print() }, icon("printer"), "Seite drucken")),
      h("p", { class: "pg-notiz" }, "Zum Drucken oder Speichern als PDF nutzt du den Druckdialog deines Browsers. Die Haken werden nicht gespeichert."));
    zaehle();
    return { destroy() {} };
  };
})();
