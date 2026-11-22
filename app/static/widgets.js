/* KI-Labor: interaktive Lernbausteine (Widgets).
   Vertrag siehe app.js: KL.widgets.<name> = function (root, seite) { ...; return { destroy() {} } }
   Bausteine: landkarte, knn, tokens, regelkreis, bereiche, hardware.
   Daten aus dem Netz (Stats, Modellnamen) gelangen nur per Text in die Seite, nie als HTML. */
(function () {
  "use strict";
  const KL = window.KL;
  const { h, icon, stats, INHALT } = KL;
  const SVGNS = "http://www.w3.org/2000/svg";

  /* ------------------------------------------------------------ Hilfen */
  const de = (n, d = 1) => Number(n).toFixed(d).replace(".", ",");
  const klemme = (v, a, b) => Math.min(b, Math.max(a, v));
  const mqDunkel = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const mqRuhig = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  let zaehler = 0;
  const neueId = (p) => "w-" + p + "-" + (++zaehler);

  function mqHoeren(mq, fn) {
    if (!mq) return () => {};
    if (mq.addEventListener) { mq.addEventListener("change", fn); return () => mq.removeEventListener("change", fn); }
    mq.addListener(fn); return () => mq.removeListener(fn);
  }
  /* meldet fn(true/false), wenn das Element ins Bild kommt oder es verlaesst */
  function sichtbarBeobachten(el, fn) {
    if (!("IntersectionObserver" in window)) { fn(true); return () => {}; }
    const io = new IntersectionObserver((es) => fn(es[es.length - 1].isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }
  function gauss() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function schalter(text, an, onChange) {
    const input = h("input", { type: "checkbox", role: "switch" });
    input.checked = !!an;
    input.addEventListener("change", () => onChange(input.checked));
    const el = h("label", { class: "w-schalter" }, input, h("span", { class: "w-sw", "aria-hidden": "true" }), h("span", null, text));
    return { el, input };
  }
  /* Reglerzeile im Stil von .regler: Beschriftung, Schieber, Wert */
  function regler(text, min, max, step, wert, format, onInput) {
    const id = neueId("regler");
    const input = h("input", { type: "range", id, min, max, step });
    input.value = wert;
    const out = h("output", { for: id }, format(wert));
    input.addEventListener("input", () => { out.textContent = format(Number(input.value)); onInput(Number(input.value)); });
    const el = h("div", { class: "regler" }, h("label", { for: id }, text), input, out);
    return { el, input, out };
  }
  function hinweis(text) {
    return h("p", { class: "w-hinweis" }, icon("info"), h("span", null, text));
  }

  /* ============================================================ 1. Landkarte */
  KL.widgets.landkarte = function (root, seite) {
    root.classList.add("w-wid");
    const L = INHALT.landkarte;
    const knoepfe = {};
    let aktiv = null;
    const detail = h("div", { class: "detail", "aria-live": "polite" });

    function waehlen(k) {
      aktiv = k;
      for (const [key, el] of Object.entries(knoepfe)) el.setAttribute("aria-pressed", key === k ? "true" : "false");
      const d = L[k];
      const ziel = INHALT.seiten[d.seite];
      detail.replaceChildren(
        h("h3", null, d.titel),
        h("p", null, d.text),
        h("p", { class: "bsp" }, d.bsp),
        d.seite !== (seite && seite.id)
          ? h("a", { class: "btn primary", href: "#/" + d.seite }, "Zur Seite " + (ziel ? ziel.nav || ziel.titel : ""), icon("arrow"))
          : h("p", { class: "w-leise" }, "Du bist schon auf dieser Seite."));
    }
    function bereich(k, klasse, kinder) {
      const el = h("div", { class: "bereich " + klasse, role: "button", tabindex: "0", "aria-pressed": "false", "aria-label": L[k].titel, dataset: { k } }, kinder);
      el.addEventListener("click", (e) => { e.stopPropagation(); waehlen(k); });
      el.addEventListener("keydown", (e) => {
        if (e.target !== el) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); waehlen(k); }
      });
      knoepfe[k] = el;
      return el;
    }
    const n = (t) => h("span", { class: "n" }, t);
    const karte = h("div", { class: "w-karte" },
      bereich("ki", "l0", [
        n("Künstliche Intelligenz"),
        h("div", { class: "innen" },
          bereich("regel", "l1 w-regel", [n("Regelbasierte Systeme")]),
          bereich("ml", "l1 w-ml", [
            n("Maschinelles Lernen"),
            bereich("dl", "l2", [n("Deep Learning"), bereich("gen", "l3", [n("Generative KI")])])])),
      ]),
      h("div", { class: "neben" }, bereich("robotik", "w-robotik", [n("Robotik"), h("small", null, "nutzt KI als Baustein, ist aber nicht Teil davon")])));
    root.append(h("div", { class: "lk" }, karte, detail));
    waehlen("ki");
    return { destroy() {} };
  };

  /* ============================================================ 2. k nächste Nachbarn */
  KL.widgets.knn = function (root) {
    root.classList.add("w-wid", "w-knn");
    const NAMEN = ["Blau", "Orange", "Grün"];
    const ADJ = ["blauen", "orangefarbenen", "grünen"];
    const ZELLE = 12, MAXP = 300;
    let pts = [], PX = [], PY = [], PC = [];
    let klasse = 0, k = 5, flaecheAn = false;
    let hover = null, kbAktiv = false, kbPos = null;
    let W = 640, H = 360, dpr = 1;
    let farben = [], cBg = "#fff", cText = "#000", cLeise = "#888";
    let gitter = null, gitterDirty = true, cols = 0, rows = 0;
    let ausreisser = 0, voll = false;

    function lesen() {
      farben = [css("--k1"), css("--k2"), css("--k3")];
      cBg = css("--flaeche"); cText = css("--text"); cLeise = css("--leise");
    }
    lesen();

    /* ---- Bedienung */
    const klassenKnoepfe = [0, 1, 2].map((c) => {
      const b = h("button", { type: "button", class: "klasse-btn", "aria-pressed": c === 0 ? "true" : "false", title: "Taste " + (c + 1) },
        h("i", { class: "w-f" + c }), NAMEN[c]);
      b.addEventListener("click", () => setzeKlasse(c));
      return b;
    });
    function setzeKlasse(c) {
      klasse = c;
      klassenKnoepfe.forEach((b, i) => b.setAttribute("aria-pressed", i === c ? "true" : "false"));
    }
    const bBeispiel = h("button", { type: "button", class: "btn klein", onclick: beispieldaten }, "Beispieldaten");
    const bLeeren = h("button", { type: "button", class: "btn klein", onclick: leeren }, "Leeren");
    const werkzeuge = h("div", { class: "werkzeuge", role: "group", "aria-label": "Farbe wählen und Daten laden" }, klassenKnoepfe, bBeispiel, bLeeren);
    const rk = regler("k (Nachbarn)", 1, 15, 1, k, (v) => String(v), (v) => { k = v; gitterDirty = true; aktualisieren(); });
    const sw = schalter("Entscheidungsfläche zeigen", false, (an) => { flaecheAn = an; aktualisieren(); });
    const reihe = h("div", { class: "w-reihe" }, rk.el, sw.el);

    const canvas = h("canvas", {
      class: "spiel", tabindex: "0", role: "application",
      "aria-label": "Spielfeld. Mit der Maus klicken oder mit den Pfeiltasten bewegen und die Eingabetaste drücken, um einen Punkt in der gewählten Farbe zu setzen. Tasten 1 bis 3 wählen die Farbe, die Rücktaste nimmt den letzten Punkt weg.",
    });
    const wrapper = h("div", { class: "w-feld" }, canvas);
    const satz = h("p", { class: "erklaerung", "aria-live": "off" });
    const extra = h("p", { class: "w-hinweis", hidden: true });
    root.append(werkzeuge, reihe, wrapper, satz, extra);
    const ctx = canvas.getContext("2d");

    /* ---- Daten */
    function neuIndizieren() {
      PX = pts.map((p) => p.x * W); PY = pts.map((p) => p.y * H); PC = pts.map((p) => p.c);
      gitterDirty = true;
      ausreisser = 0;
      if (pts.length >= 8) {
        for (let i = 0; i < pts.length; i++) {
          const a = abstimmen(PX[i], PY[i], 4, i);
          if (a && a.max >= 3 && a.sieger !== PC[i]) ausreisser++;
        }
      }
    }
    /* k nächste Nachbarn, optional ohne Punkt 'ohne' */
    function abstimmen(px, py, kk, ohne = -1) {
      const n = PX.length;
      const m = Math.min(kk, ohne >= 0 ? n - 1 : n);
      if (m <= 0) return null;
      const best = [];
      for (let i = 0; i < n; i++) {
        if (i === ohne) continue;
        const dx = PX[i] - px, dy = PY[i] - py, d = dx * dx + dy * dy;
        if (best.length < m) best.push({ i, d });
        else if (d < best[m - 1].d) best[m - 1] = { i, d };
        else continue;
        for (let j = best.length - 1; j > 0 && best[j].d < best[j - 1].d; j--) { const t = best[j]; best[j] = best[j - 1]; best[j - 1] = t; }
      }
      const zaehl = [0, 0, 0];
      for (const e of best) zaehl[PC[e.i]]++;
      const max = Math.max(...zaehl);
      let sieger = 0;
      for (const e of best) if (zaehl[PC[e.i]] === max) { sieger = PC[e.i]; break; }
      const gleichstand = zaehl.filter((z) => z === max).length > 1;
      return { best, zaehl, max, sieger, gleichstand, m };
    }
    function flaecheBerechnen() {
      cols = Math.ceil(W / ZELLE); rows = Math.ceil(H / ZELLE);
      gitter = new Int8Array(cols * rows).fill(-1);
      if (!pts.length) { gitterDirty = false; return; }
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const a = abstimmen(c * ZELLE + ZELLE / 2, r * ZELLE + ZELLE / 2, k);
        gitter[r * cols + c] = a ? a.sieger : -1;
      }
      gitterDirty = false;
    }

    /* ---- Zeichnen */
    function marke(c, x, y, r) {
      ctx.beginPath();
      if (c === 0) ctx.arc(x, y, r, 0, Math.PI * 2);
      else if (c === 1) ctx.rect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7);
      else { ctx.moveTo(x, y - r * 1.1); ctx.lineTo(x + r * 1.05, y + r * 0.8); ctx.lineTo(x - r * 1.05, y + r * 0.8); ctx.closePath(); }
    }
    function zeichnen() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (flaecheAn && pts.length) {
        if (gitterDirty || !gitter) flaecheBerechnen();
        ctx.globalAlpha = 0.22;
        let letzte = -2;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const v = gitter[r * cols + c];
          if (v < 0) continue;
          if (v !== letzte) { ctx.fillStyle = farben[v]; letzte = v; }
          ctx.fillRect(c * ZELLE, r * ZELLE, ZELLE, ZELLE);
        }
        ctx.globalAlpha = 1;
      }
      const a = hover ? abstimmen(hover.x, hover.y, k) : null;
      if (a) {
        ctx.lineWidth = 1.6; ctx.globalAlpha = 0.85;
        for (const e of a.best) {
          ctx.strokeStyle = farben[PC[e.i]];
          ctx.beginPath(); ctx.moveTo(hover.x, hover.y); ctx.lineTo(PX[e.i], PY[e.i]); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      ctx.lineWidth = 1.5; ctx.strokeStyle = cBg;
      const nachbar = new Set(a ? a.best.map((e) => e.i) : []);
      for (let i = 0; i < pts.length; i++) {
        marke(PC[i], PX[i], PY[i], nachbar.has(i) ? 7 : 5.5);
        ctx.fillStyle = farben[PC[i]]; ctx.fill(); ctx.stroke();
      }
      if (hover && a) {
        ctx.lineWidth = 2; ctx.strokeStyle = cText;
        ctx.beginPath(); ctx.arc(hover.x, hover.y, 10, 0, Math.PI * 2); ctx.stroke();
        marke(a.sieger, hover.x, hover.y, 4.5); ctx.fillStyle = farben[a.sieger]; ctx.fill();
      }
      if (kbAktiv && kbPos) {
        ctx.lineWidth = 1; ctx.strokeStyle = cLeise;
        ctx.beginPath(); ctx.moveTo(kbPos.x - 16, kbPos.y); ctx.lineTo(kbPos.x + 16, kbPos.y); ctx.moveTo(kbPos.x, kbPos.y - 16); ctx.lineTo(kbPos.x, kbPos.y + 16); ctx.stroke();
      }
    }

    /* ---- Erklärsatz */
    function liste(zaehl) {
      const t = [];
      zaehl.forEach((z, c) => { if (z > 0) t.push(z + (z === 1 ? " Punkt" : " Punkte") + " in " + NAMEN[c]); });
      return t.length > 1 ? t.slice(0, -1).join(", ") + " und " + t[t.length - 1] : t[0];
    }
    function erklaeren() {
      let s;
      const a = hover ? abstimmen(hover.x, hover.y, k) : null;
      if (!pts.length) s = "Das Feld ist leer. Wähle eine Farbe und klicke ins Feld, oder lade die Beispieldaten. Jeder Punkt ist ein Beispiel, dessen Farbe bekannt ist.";
      else if (!a) s = "Du hast " + pts.length + (pts.length === 1 ? " Punkt" : " Punkte") + " gesetzt. Fahre mit dem Zeiger über das Feld: Der Rechner sucht dann die " + k + " nächsten Punkte und lässt sie abstimmen.";
      else if (a.m === 1) s = "Der Punkt unter deinem Zeiger hat als nächsten Nachbarn einen Punkt in " + NAMEN[a.sieger] + ". Dieser eine Nachbar entscheidet allein: " + NAMEN[a.sieger] + ".";
      else {
        s = "Der Punkt unter deinem Zeiger hat unter seinen " + a.m + " nächsten Nachbarn " + liste(a.zaehl) + ". ";
        s += a.gleichstand ? "Es steht unentschieden, deshalb entscheidet der nächste Nachbar: " + NAMEN[a.sieger] + "." : "Die Mehrheit gewinnt: " + NAMEN[a.sieger] + ".";
        if (a.m < k) s += " Es gibt erst " + a.m + " Punkte, mehr können nicht abstimmen.";
      }
      if (voll) s += " Das Feld ist voll (" + MAXP + " Punkte). Leere es, um neu zu beginnen.";
      satz.textContent = s;
      let e = "";
      if (k === 1 && ausreisser > 0) e = "Bei k = 1 zählt nur ein einziger Nachbar. Einzelne Ausreißer ziehen dann kleine Inseln in die Fläche. Das nennt man Überanpassung: Das Modell merkt sich die Daten samt Zufall und Fehlern. Erhöhe k, dann beruhigt sich die Grenze.";
      else if (k >= 12 && pts.length >= 10) e = "Ein sehr großes k glättet alles. Kleine Gruppen gehen dann in der Mehrheit unter.";
      extra.hidden = !e; extra.textContent = e;
    }
    function aktualisieren() { zeichnen(); erklaeren(); }

    /* ---- Ereignisse */
    function pos(e) {
      const r = canvas.getBoundingClientRect();
      return { x: klemme((e.clientX - r.left) * (W / r.width), 0, W), y: klemme((e.clientY - r.top) * (H / r.height), 0, H) };
    }
    function setzen(p) {
      if (pts.length >= MAXP) { voll = true; aktualisieren(); return; }
      pts.push({ x: p.x / W, y: p.y / H, c: klasse });
      neuIndizieren(); aktualisieren();
    }
    function leeren() { pts = []; voll = false; neuIndizieren(); aktualisieren(); }
    function beispieldaten() {
      const zentren = [[0.27, 0.36], [0.68, 0.34], [0.47, 0.74]];
      pts = []; voll = false;
      zentren.forEach((z, c) => {
        for (let i = 0; i < 24; i++) {
          pts.push({ x: klemme(z[0] + gauss() * 0.1, 0.02, 0.98), y: klemme(z[1] + gauss() * 0.15, 0.03, 0.97), c });
        }
      });
      /* zwei bewusste Ausreißer: eine Farbe mitten in einer anderen Wolke */
      pts.push({ x: zentren[0][0] + 0.03, y: zentren[0][1] + 0.02, c: 1 });
      pts.push({ x: zentren[1][0] - 0.03, y: zentren[1][1] - 0.03, c: 2 });
      neuIndizieren(); aktualisieren();
    }
    canvas.addEventListener("pointermove", (e) => { kbAktiv = false; hover = pos(e); aktualisieren(); });
    canvas.addEventListener("pointerleave", () => { if (!kbAktiv) { hover = null; aktualisieren(); } });
    canvas.addEventListener("click", (e) => { hover = pos(e); setzen(hover); });
    canvas.addEventListener("focus", () => { if (!kbPos) kbPos = { x: W / 2, y: H / 2 }; });
    canvas.addEventListener("blur", () => { if (kbAktiv) { kbAktiv = false; hover = null; aktualisieren(); } });
    canvas.addEventListener("keydown", (e) => {
      const schritt = e.shiftKey ? 48 : 12;
      const richt = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (richt) {
        e.preventDefault();
        if (!kbPos) kbPos = { x: W / 2, y: H / 2 };
        kbPos = { x: klemme(kbPos.x + richt[0] * schritt, 0, W), y: klemme(kbPos.y + richt[1] * schritt, 0, H) };
        kbAktiv = true; hover = kbPos; aktualisieren();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!kbPos) kbPos = { x: W / 2, y: H / 2 };
        kbAktiv = true; hover = kbPos; setzen(kbPos);
      } else if (e.key === "1" || e.key === "2" || e.key === "3") {
        setzeKlasse(Number(e.key) - 1);
      } else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault(); pts.pop(); voll = false; neuIndizieren(); aktualisieren();
      }
    });

    /* ---- Größe und Farbschema */
    function groesse() {
      const w = Math.max(280, Math.floor(wrapper.clientWidth));
      const hh = Math.round(klemme(w * 0.56, 260, 420));
      if (w === W && hh === H && canvas.width === Math.round(w * dpr)) return;
      dpr = window.devicePixelRatio || 1;
      W = w; H = hh;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.height = H + "px";
      neuIndizieren(); aktualisieren();
    }
    const ro = new ResizeObserver(groesse);
    ro.observe(wrapper);
    groesse();
    const mqAb = mqHoeren(mqDunkel, () => { lesen(); aktualisieren(); });
    erklaeren();
    return { destroy() { ro.disconnect(); mqAb(); } };
  };

  /* ============================================================ 3. Token-Würfel */
  KL.widgets.tokens = function (root) {
    root.classList.add("w-wid", "w-tokens");
    const START = "Ein Roboter kann";
    /* Selbst festgelegte Beispielwerte. Zustand = letztes Token, Wert = Kandidaten mit Gewicht.
       Jedes Token ist hinter jedem seiner Vorgänger grammatisch richtig. Fehlt ein Zustand, endet der Satz. */
    const TAB = {
      "kann": [[" Gegenstände", 22], [" lernen", 16], [" Kisten", 14], [" Teile", 12], [" mit", 12], [" sehen", 8], [" sprechen", 6], [" laufen", 6], [" schweißen", 4]],
      " Gegenstände": [[" greifen", 40], [" sicher", 30], [" heben", 20], [" sortieren", 10]],
      " sicher": [[" greifen", 60], [" heben", 40]],
      " Kisten": [[" heben", 35], [" tragen", 30], [" schnell", 25], [" stapeln", 10]],
      " schnell": [[" tragen", 55], [" stapeln", 45]],
      " Teile": [[" montieren", 50], [" lackieren", 30], [" prüfen", 20]],
      " mit": [[" Kameras", 55], [" Sensoren", 45]],
      " Kameras": [[" sehen", 65], [" messen", 35]],
      " Sensoren": [[" messen", 60], [" arbeiten", 40]],
    };
    const kandidatenVon = (letztes) => TAB[letztes] || [[".", 100]];
    const anzeige = (t) => (t === "." ? "Punkt (Ende)" : t.trim());

    let T = 1.0, zustand = "kann", gezogen = [], ende = false, busy = false;
    let letzte = null; /* {tok, p, favorit, modus} */
    let timer = 0, nachTimer = 0, auto = false;
    let zeilen = [], aktuell = [];

    function verteilung(kand, temp) {
      const sum = kand.reduce((s, c) => s + c[1], 0);
      const l = kand.map((c) => Math.log(c[1] / sum) / temp);
      const m = Math.max(...l);
      const e = l.map((x) => Math.exp(x - m));
      const s = e.reduce((a, b) => a + b, 0);
      return e.map((x) => x / s);
    }

    /* ---- Oberfläche */
    const satzEl = h("div", { class: "satz", "aria-label": "Entstehender Satz" });
    const liste = h("div", { class: "kandidaten", role: "list", "aria-label": "Kandidaten für das nächste Token mit Wahrscheinlichkeit" });
    const rT = regler("Temperatur", 0.1, 2, 0.1, T, (v) => de(v, 1), (v) => { T = v; balkenAktualisieren(); erklaeren(); });
    const skala = h("div", { class: "w-skala", "aria-hidden": "true" }, h("span", null, "vorsichtig, immer der Favorit"), h("span", null, "mutig, auch Seltenes"));
    const bZiehen = h("button", { type: "button", class: "btn primary", onclick: () => ziehen("zufall") }, "Nächstes Token ziehen");
    const bMax = h("button", { type: "button", class: "btn", onclick: () => ziehen("max") }, "Wahrscheinlichstes nehmen");
    const bAuto = h("button", { type: "button", class: "btn", "aria-pressed": "false", onclick: autoUmschalten }, "Automatisch");
    const bNeu = h("button", { type: "button", class: "btn", onclick: neu }, "Neu");
    const knoepfe = h("div", { class: "zeile" }, bZiehen, bMax, bAuto, bNeu);
    const erkl = h("p", { class: "erklaerung", "aria-live": "polite" });
    root.append(satzEl, liste, rT.el, skala, knoepfe, erkl,
      hinweis("Beispielwerte, die für diese Demo festgelegt wurden, kein echtes Modell. Ein echtes Modell rechnet genauso, mit rund 128.000 möglichen Tokens."));

    function satzZeichnen() {
      satzEl.replaceChildren(START, ...gezogen.map((g) => h("span", { class: "tn" }, g.tok)));
      if (!ende) satzEl.append(h("span", { class: "w-offen", "aria-hidden": "true" }, " …"));
    }
    function listeBauen() {
      aktuell = kandidatenVon(zustand).slice().sort((a, b) => b[1] - a[1]);
      zeilen = aktuell.map((c) => {
        const bar = h("i"), pz = h("div", { class: "pz" });
        const z = h("div", { class: "kand", role: "listitem" }, h("div", { class: "tk" }, anzeige(c[0])), h("div", { class: "bar" }, bar), pz);
        return { z, bar, pz };
      });
      liste.replaceChildren(...zeilen.map((z) => z.z));
      balkenAktualisieren();
    }
    function wahrscheinlichkeiten() { return verteilung(aktuell, T); }
    function balkenAktualisieren() {
      const p = wahrscheinlichkeiten();
      zeilen.forEach((z, i) => {
        z.bar.style.width = (p[i] * 100).toFixed(2) + "%";
        z.pz.textContent = de(p[i] * 100, 1) + " %";
        z.z.dataset.p = (p[i] * 100).toFixed(4);
        z.z.setAttribute("aria-label", anzeige(aktuell[i][0]) + ", " + de(p[i] * 100, 1) + " Prozent");
      });
    }
    function erklaeren() {
      const p = wahrscheinlichkeiten();
      let s;
      const zeigeVorschau = !letzte || (!busy && !ende);
      if (letzte) {
        const g = letzte;
        s = (g.modus === "max" ? "Das wahrscheinlichste Token wurde genommen: „" : "Gezogen: „") + anzeige(g.tok) + "“, mit " + de(g.p * 100, 1) + " Prozent Wahrscheinlichkeit. ";
        s += g.modus === "max" ? "" : g.favorit ? "Das war der Favorit. " : "Das war nicht der Favorit. Auch Seltenes kommt vor, das macht Texte abwechslungsreich. ";
        if (ende) s += "Der Satz ist fertig. Mit „Neu“ beginnst du von vorn.";
        else if (zeigeVorschau) s += vorschau(p);
      } else s = vorschau(p);
      erkl.textContent = s;
    }
    function vorschau(p) {
      const name = zustand === "kann" ? "kann" : anzeige(zustand);
      if (aktuell.length === 1) return "Nach „" + name + "“ gibt es nur einen Kandidaten: den Punkt. Dann endet der Satz.";
      let top = 0; p.forEach((x, i) => { if (x > p[top]) top = i; });
      let s = "Nach „" + name + "“ kommen " + aktuell.length + " Kandidaten infrage. Bei Temperatur " + de(T, 1) + " führt „" + anzeige(aktuell[top][0]) + "“ mit " + de(p[top] * 100, 1) + " Prozent. ";
      if (T <= 0.5) s += "Die Verteilung ist spitz, fast immer gewinnt der Favorit.";
      else if (T >= 1.4) s += "Die Verteilung ist flach, auch unwahrscheinliche Tokens haben eine Chance.";
      else s += "Ziehe ein Token und schau, was passiert.";
      return s;
    }
    function knoepfeSetzen() {
      bZiehen.disabled = bMax.disabled = ende;
      bAuto.disabled = ende;
    }

    /* ---- Ablauf */
    function ziehen(modus) {
      if (ende || busy) return;
      const p = wahrscheinlichkeiten();
      let idx = 0;
      if (modus === "max") p.forEach((x, i) => { if (x > p[idx]) idx = i; });
      else {
        let r = Math.random(), summe = 0; idx = p.length - 1;
        for (let i = 0; i < p.length; i++) { summe += p[i]; if (r < summe) { idx = i; break; } }
      }
      let top = 0; p.forEach((x, i) => { if (x > p[top]) top = i; });
      const tok = aktuell[idx][0];
      letzte = { tok, p: p[idx], favorit: idx === top, modus };
      gezogen.push({ tok, p: p[idx] });
      zeilen[idx].z.classList.add("gewaehlt");
      zustand = tok;
      ende = tok === ".";
      satzZeichnen();
      knoepfeSetzen();
      if (ende) { stoppeAuto(); busy = false; erkl.textContent = ""; erklaeren(); return; }
      busy = true;
      erklaeren();
      nachTimer = setTimeout(() => { busy = false; listeBauen(); erklaeren(); }, mqRuhig && mqRuhig.matches ? 0 : 550);
    }
    function neu() {
      clearTimeout(nachTimer); stoppeAuto();
      zustand = "kann"; gezogen = []; ende = false; busy = false; letzte = null;
      satzZeichnen(); listeBauen(); knoepfeSetzen(); erklaeren();
    }
    function stoppeAuto() {
      auto = false; clearInterval(timer); timer = 0;
      bAuto.setAttribute("aria-pressed", "false"); bAuto.textContent = "Automatisch";
    }
    function autoUmschalten() {
      if (auto) { stoppeAuto(); return; }
      auto = true;
      bAuto.setAttribute("aria-pressed", "true"); bAuto.textContent = "Anhalten";
      ziehen("zufall");
      timer = setInterval(() => { if (!document.hidden) ziehen("zufall"); }, 1100);
    }
    neu();
    return { destroy() { clearInterval(timer); clearTimeout(nachTimer); } };
  };

  /* ============================================================ 4. Regelkreis */
  KL.widgets.regelkreis = function (root) {
    root.classList.add("w-wid", "w-regel");
    const W = 640, H = 360, R = 12, RANGE = 110, N = 7, SPAN = (70 * Math.PI) / 180;
    const DT = 1 / 60, V0 = 80, WMAX = 2.8, ZEITLIMIT = 20 * 60, PAUSE = 90;
    const WINKEL = Array.from({ length: N }, (_, i) => -SPAN + (i * 2 * SPAN) / (N - 1));
    const START = { x: 60, y: H / 2 };

    let rob, ziel, hind = [], trail = [], queue = [];
    let rausch = 10, verzoegerung = 0, wahrnehmung = true;
    let erreicht = 0, kollisionen = 0, verfehlt = 0;
    let frame = 0, blinkBis = 0, letzterKontakt = -100, pauseBis = 0, seitZiel = 0;
    let letzteWelt = 0; /* zuletzt gewählte Fahrtrichtung in Weltkoordinaten (Trägheit gegen Hin und Her) */
    let info = { sens: null, dec: null, act: null };
    let farben = {}, dpr = 1, skala = 1;
    let raf = 0, last = null, acc = 0, sichtbar = true, pausiert = !!(mqRuhig && mqRuhig.matches);
    let phase = 0, phasenZaehler = 0;

    function lesen() {
      farben = { akzent: css("--akzent"), orange: css("--orange"), gruen: css("--gruen"), rot: css("--rot"), leise: css("--leise"), f3: css("--flaeche3"), text: css("--text") };
    }
    lesen();
    const winkelDiff = (a, b) => { let d = a - b; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };

    /* ---- Welt */
    function frei(x, y, abstand) { return hind.every((o) => Math.hypot(o.x - x, o.y - y) > o.r + abstand); }
    function zufallsHindernis(abstandZuAnderen) {
      for (let v = 0; v < 60; v++) {
        const r = 16 + Math.floor(Math.random() * 9);
        const x = 150 + Math.random() * (W - 220), y = 36 + Math.random() * (H - 72);
        if (Math.hypot(x - rob.x, y - rob.y) < 80 + r || Math.hypot(x - ziel.x, y - ziel.y) < 50 + r) continue;
        if (hind.every((o) => Math.hypot(o.x - x, o.y - y) > o.r + r + abstandZuAnderen)) return { x, y, r };
      }
      return null;
    }
    function neuesZiel() {
      for (let v = 0; v < 80; v++) {
        const x = 50 + Math.random() * (W - 100), y = 45 + Math.random() * (H - 90);
        if (Math.hypot(x - rob.x, y - rob.y) < 170) continue;
        if (!frei(x, y, 30)) continue;
        ziel = { x, y }; trail = []; seitZiel = 0; return;
      }
      ziel = { x: W - 60, y: START.y };
    }
    function neustart(mitHindernissen) {
      rob = { x: START.x, y: START.y, th: 0 };
      ziel = { x: W - 70, y: H / 2 };
      queue = []; trail = []; letzteWelt = 0;
      if (mitHindernissen) {
        hind = [];
        for (let i = 0; i < 5; i++) { const o = zufallsHindernis(50); if (o) hind.push(o); }
      }
      neuesZiel();
      pauseBis = 0; frame = 0; blinkBis = 0; letzterKontakt = -100;
    }

    /* ---- Wahrnehmen */
    function strahl(x, y, dx, dy) {
      let t = RANGE;
      for (const o of hind) {
        const fx = x - o.x, fy = y - o.y;
        const b = fx * dx + fy * dy, c = fx * fx + fy * fy - o.r * o.r;
        if (c < 0) return 0;
        const disc = b * b - c;
        if (disc >= 0) { const t0 = -b - Math.sqrt(disc); if (t0 >= 0 && t0 < t) t = t0; }
      }
      if (dx > 1e-9) t = Math.min(t, (W - x) / dx); else if (dx < -1e-9) t = Math.min(t, (0 - x) / dx);
      if (dy > 1e-9) t = Math.min(t, (H - y) / dy); else if (dy < -1e-9) t = Math.min(t, (0 - y) / dy);
      return Math.max(0, t);
    }
    function messen() {
      return WINKEL.map((a) => {
        let d = strahl(rob.x, rob.y, Math.cos(rob.th + a), Math.sin(rob.th + a));
        if (rausch > 0 && d < RANGE) d += gauss() * (rausch / 100) * 35; /* ohne Echo kein Messfehler */
        return klemme(d, 0, RANGE);
      });
    }

    /* ---- Entscheiden: beste Richtung nach Zielnähe und Freiraum.
       Jeder Messpunkt zählt als Hindernis, wenn er im Fahrstreifen der Breite des Roboters liegt. */
    function freiweg(m, phi) {
      let dist = RANGE;
      for (let i = 0; i < N; i++) {
        const d = m[i];
        if (d >= RANGE - 1) continue;
        const rel = WINKEL[i] - phi, vor = d * Math.cos(rel), seit = Math.abs(d * Math.sin(rel));
        if (vor > 0 && seit < R + 11) dist = Math.min(dist, vor);
      }
      return dist;
    }
    function entscheiden(m, zielRel) {
      let besteWinkel = 0, besteKosten = Infinity;
      const schritt = (5 * Math.PI) / 180;
      for (let phi = -SPAN; phi <= SPAN + 1e-6; phi += schritt) {
        const c = klemme((freiweg(m, phi) - (R + 4)) / (0.7 * RANGE - (R + 4)), 0, 1);
        const kosten = Math.abs(winkelDiff(phi, zielRel)) + 7 * (1 - c) + 0.5 * Math.abs(winkelDiff(rob.th + phi, letzteWelt));
        if (kosten < besteKosten) { besteKosten = kosten; besteWinkel = phi; }
      }
      return besteWinkel;
    }

    /* ---- ein Takt: Wahrnehmen, Entscheiden, Handeln */
    function schritt() {
      frame++; seitZiel++;
      if (pauseBis) {
        if (frame >= pauseBis) { pauseBis = 0; neuesZiel(); }
        info.act = { v: 0, wartet: true };
        return;
      }
      const zielRel = winkelDiff(Math.atan2(ziel.y - rob.y, ziel.x - rob.x), rob.th);
      let phi, v = V0, bremst = false;
      if (wahrnehmung) {
        queue.push(messen());
        while (queue.length > verzoegerung + 1) queue.shift();
        const m = queue[0];
        let mi = 0; m.forEach((d, i) => { if (d < m[mi]) mi = i; });
        info.sens = { m, min: m[mi], winkel: WINKEL[mi], alt: Math.min(verzoegerung, queue.length - 1) };
        phi = entscheiden(m, zielRel);
        const vorn = Math.min(freiweg(m, 0), freiweg(m, phi));
        const f = klemme((vorn - (R + 6)) / 45, 0.35, 1);
        v = V0 * f; bremst = f < 0.98;
        info.dec = { phi, zielRel, umweg: Math.abs(winkelDiff(phi, klemme(zielRel, -SPAN, SPAN))) > 0.14 };
        letzteWelt = rob.th + phi;
      } else {
        phi = zielRel;
        info.sens = null;
        info.dec = { phi, zielRel, umweg: false };
      }
      info.act = { v, bremst };
      rob.th += klemme(phi * 10 * DT, -WMAX * DT, WMAX * DT);
      rob.x += Math.cos(rob.th) * v * DT; rob.y += Math.sin(rob.th) * v * DT;
      trail.push(rob.x, rob.y); if (trail.length > 480) trail.splice(0, 2);

      let kontakt = false;
      for (const o of hind) {
        let dx = rob.x - o.x, dy = rob.y - o.y, d = Math.hypot(dx, dy);
        if (d < o.r + R) {
          kontakt = true;
          if (d < 1e-6) { dx = 1; dy = 0; d = 1; }
          rob.x = o.x + (dx / d) * (o.r + R); rob.y = o.y + (dy / d) * (o.r + R);
        }
      }
      if (rob.x < R) { rob.x = R; kontakt = true; } else if (rob.x > W - R) { rob.x = W - R; kontakt = true; }
      if (rob.y < R) { rob.y = R; kontakt = true; } else if (rob.y > H - R) { rob.y = H - R; kontakt = true; }
      if (kontakt) {
        if (frame - letzterKontakt > 12) { kollisionen++; zaehlerAnzeigen(); }
        letzterKontakt = frame; blinkBis = frame + 30;
      }
      if (Math.hypot(ziel.x - rob.x, ziel.y - rob.y) < R + 6) {
        erreicht++; pauseBis = frame + PAUSE; meldung("Ziel erreicht. Gleich kommt ein neues.", true); zaehlerAnzeigen();
      } else if (seitZiel > ZEITLIMIT) {
        verfehlt++; meldung("Das Ziel wurde nicht rechtzeitig erreicht. Es gibt ein neues.", false); neuesZiel(); zaehlerAnzeigen();
      }
    }

    /* ---- Oberfläche */
    const bPause = h("button", { type: "button", class: "btn klein", "aria-pressed": String(pausiert), onclick: () => { pausiert = !pausiert; pauseText(); anwerfen(); zeichnen(); } });
    function pauseText() { bPause.textContent = pausiert ? "Weiter" : "Pause"; bPause.setAttribute("aria-pressed", String(pausiert)); }
    pauseText();
    const rRausch = regler("Sensorrauschen", 0, 100, 5, rausch, (v) => v + " %", (v) => { rausch = v; });
    const rVerz = regler("Verzögerung der Wahrnehmung", 0, 20, 1, verzoegerung, (v) => v + " Frames", (v) => { verzoegerung = v; });
    const sw = schalter("Wahrnehmung an", true, (an) => { wahrnehmung = an; sw.el.lastChild.textContent = an ? "Wahrnehmung an" : "Wahrnehmung aus"; queue = []; if (!an) { info.sens = null; } textAktualisieren(); zeichnen(); });
    const bZiel = h("button", { type: "button", class: "btn klein", onclick: () => { neuesZiel(); pauseBis = 0; zeichnen(); } }, "Ziel neu setzen");
    const bLeer = h("button", { type: "button", class: "btn klein", onclick: () => { hind = []; zeichnen(); } }, "Hindernisse leeren");
    const bHind = h("button", { type: "button", class: "btn klein", onclick: () => { const o = zufallsHindernis(30); if (o && hind.length < 14) { hind.push(o); } zeichnen(); } }, "Hindernis setzen");
    const bNeu = h("button", { type: "button", class: "btn klein", onclick: () => { erreicht = kollisionen = verfehlt = 0; neustart(false); zaehlerAnzeigen(); zeichnen(); } }, "Neustart");

    const canvas = h("canvas", { class: "spiel w-sim", role: "img", "aria-label": "Simulation: Ein Roboter fährt zu einem grünen Ziel und weicht Hindernissen aus. Klick auf eine freie Stelle setzt ein Hindernis, Klick auf ein Hindernis entfernt es." });
    const wrapper = h("div", { class: "w-feld" }, canvas);
    const chipErreicht = h("span", { class: "chip w-ok" }), chipKoll = h("span", { class: "chip warn" });
    const meld = h("span", { class: "w-meldung", role: "status", "aria-live": "polite" });
    const zeileStand = h("div", { class: "zeile w-stand" }, chipErreicht, chipKoll, meld);
    const phasen = ["Wahrnehmen", "Entscheiden", "Handeln"].map((n, i) => {
      const t = h("span", { class: "w-pt" });
      return { t, el: h("div", { class: "w-phase" }, h("span", { class: "w-pk" }, h("b", null, String(i + 1)), n), t) };
    });
    const phasenBox = h("div", { class: "w-phasen", "aria-label": "Was der Roboter gerade tut" }, phasen.map((p) => p.el));
    const taktHinweis = hinweis("Der Roboter wiederholt diese drei Schritte 60 Mal pro Sekunde. Die Anzeige hier läuft langsamer, damit du sie lesen kannst.");

    root.append(
      h("div", { class: "werkzeuge" }, bPause, bZiel, bHind, bLeer, bNeu),
      h("div", { class: "w-reglerpaar" }, rRausch.el, rVerz.el), h("div", { class: "w-reihe" }, sw.el),
      wrapper, zeileStand, phasenBox, taktHinweis);
    const ctx = canvas.getContext("2d");

    function zaehlerAnzeigen() {
      chipErreicht.textContent = "Ziele erreicht: " + erreicht;
      chipKoll.textContent = "Zusammenstöße: " + kollisionen;
      root.dataset.erreicht = erreicht; root.dataset.kollisionen = kollisionen; root.dataset.verfehlt = verfehlt;
    }
    let meldeTimer = 0;
    function meldung(t) { meld.textContent = t; clearTimeout(meldeTimer); meldeTimer = setTimeout(() => { meld.textContent = ""; }, 2600); }

    function grad(rad) { return Math.round(Math.abs(rad) * 180 / Math.PI); }
    function textAktualisieren() {
      const [pw, pe, ph] = phasen;
      if (!wahrnehmung) pw.t.textContent = "Aus. Der Roboter sieht keine Hindernisse und kennt nur das Ziel.";
      else if (info.sens) {
        const s = info.sens;
        const alt = s.alt > 0 ? " Die Messung ist " + s.alt + " Frames alt." : "";
        if (s.min >= RANGE - 1) pw.t.textContent = "Nichts in Reichweite (" + RANGE + " px)." + alt;
        else {
          const wo = Math.abs(s.winkel) < 0.2 ? "vor mir" : s.winkel < 0 ? "links von mir" : "rechts von mir";
          pw.t.textContent = "Nächstes Hindernis oder nächster Rand " + Math.max(0, Math.round(s.min - R)) + " px " + wo + "." + alt;
        }
      } else pw.t.textContent = "Wartet auf die erste Messung.";
      if (info.dec) {
        const d = info.dec, seite = (x) => (x < 0 ? "links" : "rechts");
        const ziel = grad(d.zielRel) < 3 ? "Das Ziel liegt voraus." : "Das Ziel liegt " + grad(d.zielRel) + " Grad " + seite(d.zielRel) + ".";
        if (!wahrnehmung) pe.t.textContent = ziel + " Ich drehe direkt darauf zu und fahre geradeaus.";
        else if (grad(d.phi) < 3) pe.t.textContent = ziel + " Ich halte die Richtung.";
        else pe.t.textContent = ziel + (d.umweg ? " Etwas ist im Weg. " : " Der Weg ist frei. ") + "Ich lenke " + grad(d.phi) + " Grad nach " + seite(d.phi) + ".";
      }
      if (info.act) {
        ph.t.textContent = info.act.wartet ? "Ich stehe am Ziel." : Math.round(info.act.v) + " Pixel pro Sekunde." + (info.act.bremst ? " Ich bremse, weil es vorn eng wird." : "");
      }
    }
    function phaseWeiter() {
      phasen.forEach((p, i) => p.el.classList.toggle("an", i === phase));
      textAktualisieren();
      phase = (phase + 1) % 3;
    }

    /* ---- Zeichnen */
    function zeichnen() {
      ctx.setTransform(dpr * skala, 0, 0, dpr * skala, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (trail.length > 3) {
        ctx.strokeStyle = farben.leise; ctx.globalAlpha = 0.4; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(trail[0], trail[1]);
        for (let i = 2; i < trail.length; i += 2) ctx.lineTo(trail[i], trail[i + 1]);
        ctx.stroke(); ctx.globalAlpha = 1;
      }
      for (const o of hind) {
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = farben.f3; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = farben.leise; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(ziel.x, ziel.y, 15, 0, Math.PI * 2); ctx.globalAlpha = 0.22; ctx.fillStyle = farben.gruen; ctx.fill(); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(ziel.x, ziel.y, 8, 0, Math.PI * 2); ctx.fillStyle = farben.gruen; ctx.fill();
      if (wahrnehmung && info.sens) {
        const m = info.sens.m;
        for (let i = 0; i < N; i++) {
          const a = rob.th + WINKEL[i], d = m[i], treffer = d < RANGE - 0.5;
          const ex = rob.x + Math.cos(a) * d, ey = rob.y + Math.sin(a) * d;
          ctx.beginPath(); ctx.moveTo(rob.x, rob.y); ctx.lineTo(ex, ey);
          ctx.strokeStyle = treffer ? farben.orange : farben.akzent; ctx.globalAlpha = treffer ? 0.9 : 0.4; ctx.lineWidth = 1.5; ctx.stroke();
          if (treffer) { ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fillStyle = farben.orange; ctx.fill(); }
          ctx.globalAlpha = 1;
        }
      }
      const rot = frame < blinkBis && Math.floor(frame / 6) % 2 === 0;
      ctx.beginPath(); ctx.arc(rob.x, rob.y, R, 0, Math.PI * 2);
      ctx.fillStyle = rot ? farben.rot : farben.akzent; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = rot ? farben.rot : farben.text; ctx.globalAlpha = rot ? 1 : 0.25; ctx.stroke(); ctx.globalAlpha = 1;
      ctx.save(); ctx.translate(rob.x, rob.y); ctx.rotate(rob.th);
      ctx.beginPath(); ctx.moveTo(R * 0.75, 0); ctx.lineTo(-R * 0.35, R * 0.5); ctx.lineTo(-R * 0.35, -R * 0.5); ctx.closePath();
      ctx.fillStyle = "#fff"; ctx.fill(); ctx.restore();
    }

    /* ---- Schleife mit festem Zeitschritt */
    const laeuft = () => sichtbar && !document.hidden && !pausiert;
    function takt(ts) {
      raf = 0;
      if (!laeuft()) return;
      if (last == null) last = ts;
      acc += Math.min(100, ts - last); last = ts;
      let n = 0;
      while (acc >= DT * 1000 && n < 6) {
        schritt(); acc -= DT * 1000; n++;
        if (++phasenZaehler >= 12) { phasenZaehler = 0; phaseWeiter(); }
      }
      if (n === 6) acc = 0;
      zeichnen();
      raf = requestAnimationFrame(takt);
    }
    function anwerfen() { if (!raf && laeuft()) { last = null; acc = 0; raf = requestAnimationFrame(takt); } }
    const aufSichtbar = () => anwerfen();
    document.addEventListener("visibilitychange", aufSichtbar);
    const io = sichtbarBeobachten(root, (s) => { sichtbar = s; anwerfen(); });

    /* ---- Klicks auf das Feld */
    canvas.addEventListener("click", (e) => {
      const r = canvas.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
      const i = hind.findIndex((o) => Math.hypot(o.x - x, o.y - y) <= o.r + 4);
      if (i >= 0) { hind.splice(i, 1); meldung("Hindernis entfernt."); }
      else if (hind.length >= 14) meldung("Es sind genug Hindernisse im Feld.");
      else if (Math.hypot(x - rob.x, y - rob.y) < R + 28 || Math.hypot(x - ziel.x, y - ziel.y) < 34) meldung("Dort stehen der Roboter oder das Ziel im Weg.");
      else hind.push({ x, y, r: 16 + Math.floor(Math.random() * 9) });
      zeichnen();
    });

    function groesse() {
      const w = Math.max(280, Math.floor(wrapper.clientWidth));
      const d = window.devicePixelRatio || 1;
      skala = w / W; dpr = d;
      canvas.width = Math.round(w * d); canvas.height = Math.round(w * (H / W) * d);
      canvas.style.height = Math.round(w * (H / W)) + "px";
      zeichnen();
    }
    const ro = new ResizeObserver(groesse);
    ro.observe(wrapper);
    const mqAb = mqHoeren(mqDunkel, () => { lesen(); zeichnen(); });

    neustart(true);
    zaehlerAnzeigen();
    groesse();
    schritt(); frame = 0; seitZiel = 0; phaseWeiter();
    anwerfen();
    return {
      destroy() {
        if (raf) cancelAnimationFrame(raf); raf = 0; sichtbar = false;
        document.removeEventListener("visibilitychange", aufSichtbar);
        clearTimeout(meldeTimer); io(); ro.disconnect(); mqAb();
      },
    };
  };

  /* ============================================================ 5. Bereiche im Business */
  KL.widgets.bereiche = function (root) {
    root.classList.add("w-wid", "w-null");
    const F = INHALT.faehigkeiten;
    const alle = [];
    let filter = "alle";
    const chips = {};
    const zahl = h("span", { class: "w-zahl", "aria-live": "polite" });

    function chip(key, text) {
      const b = h("button", { type: "button", class: "chip", "aria-pressed": key === filter ? "true" : "false" }, text);
      b.addEventListener("click", () => { filter = key; anwenden(); });
      chips[key] = b;
      return b;
    }
    const leiste = h("div", { class: "filter", role: "group", "aria-label": "Nach Fähigkeit filtern" },
      chip("alle", "Alle"), Object.entries(F).map(([k, t]) => chip(k, t)), zahl);

    const liste = h("div", { class: "w-bz" });
    for (const b of INHALT.bereiche) {
      const labore = (b.labor || []).map((id) => {
        const s = INHALT.seiten[id];
        return s ? h("a", { class: "chip w-link", href: "#/" + id }, s.nav || s.titel, icon("arrow")) : null;
      });
      const dl = h("dl", null,
        h("dt", null, "Wie"), h("dd", null, b.verfahren),
        h("dt", null, "Warum"), h("dd", null, b.warum),
        h("dt", null, "Frage vor dem Einsatz"), h("dd", null, b.frage),
        labore.length ? [h("dt", null, "Im Labor ausprobieren"), h("dd", { class: "w-labore" }, labore)] : null);
      const d = h("details", { class: "bz" },
        h("summary", null,
          h("span", { class: "b" }, b.name),
          h("span", { class: "ch" }, icon("chevron")),
          h("span", { class: "a" }, b.aufgabe),
          h("span", { class: "w-faehig" }, b.f.map((f) => h("span", { class: "chip" }, F[f] || f)))),
        h("div", { class: "in" }, dl));
      // Fertige Beispiele dieses Bereichs (Katalog KL.beispiele()): Knopf "Beispiel starten" je Use-Case
      KL.beispiele().then((m) => {
        const bsp = (m.usecases || []).filter((u) => u.bereich === b.name);
        if (!bsp.length) return;
        dl.append(h("dt", null, "Beispiel starten"), h("dd", { class: "w-labore" }, bsp.map((u) =>
          h("a", { class: "chip w-bsp", href: "#/" + u.lab + "?beispiel=" + u.id, title: u.titel }, icon("play"), "Beispiel starten: " + u.titel))));
      });
      alle.push({ d, f: b.f });
      liste.append(d);
    }
    function anwenden() {
      let n = 0;
      for (const [key, el] of Object.entries(chips)) el.setAttribute("aria-pressed", key === filter ? "true" : "false");
      for (const e of alle) {
        const zeigen = filter === "alle" || e.f.includes(filter);
        e.d.hidden = !zeigen;
        if (zeigen) n++;
      }
      zahl.textContent = n + " von " + alle.length + " Bereichen";
    }
    root.append(leiste, liste);
    anwenden();
    return { destroy() {} };
  };

  /* ============================================================ 6. Hardware live */
  KL.widgets.hardware = function (root) {
    root.classList.add("w-wid", "w-hw");
    const FENSTER = 60000;
    const verlauf = []; /* {t, gpu, w} */
    let letzteWerte = null;

    /* ---- Ringe */
    function ring(titel, unter) {
      const b = h("b", null, "0 %");
      const sub = h("small", null, unter || "");
      const el = h("div", { class: "ring", role: "group" }, h("div", { class: "kreis" }, b), h("span", null, titel), sub);
      return { el, b, sub, titel };
    }
    const rGpu = ring("GPU", "Auslastung"), rRam = ring("Speicher", ""), rCpu = ring("CPU", "Auslastung"), rW = ring("Leistung", "Ring voll bei 25 W");
    const tempZahl = h("b", null, "0 °C");
    const temp = h("div", { class: "w-temp", role: "group" }, h("div", { class: "w-tempz" }, tempZahl), h("span", null, "Temperatur"), h("small", null, "heißester Messpunkt"));
    const ringe = h("div", { class: "ringe" }, rGpu.el, rRam.el, rCpu.el, rW.el, temp);
    function setRing(r, pct, text, warn) {
      r.el.style.setProperty("--p", klemme(pct, 0, 100).toFixed(1));
      r.el.classList.toggle("warn", !!warn);
      r.b.textContent = text;
      r.el.setAttribute("aria-label", r.titel + " " + text);
    }

    /* ---- Satz im Klartext */
    const jetzt = h("p", { class: "jetztsatz", "aria-live": "off" }, "Der Jetson meldet sich gleich.");
    function satzBauen(d) {
      if (d.gpu_pct == null) return "Der Jetson hat noch keine Werte geschickt.";
      const gpu = d.gpu_pct, ramP = d.ram_max_mb ? (d.ram_mb / d.ram_max_mb) * 100 : 0;
      const modelle = d.modelle_geladen || [];
      const teile = [];
      if (d.frisch === false) teile.push("Die Werte sind gerade nicht frisch, es kann sein, dass der Jetson kurz nicht antwortet.");
      if (gpu >= 60) teile.push("Die GPU rechnet gerade mit voller Kraft, sie ist zu " + Math.round(gpu) + " Prozent ausgelastet.");
      else if (gpu >= 15) teile.push("Die GPU arbeitet, sie ist zu " + Math.round(gpu) + " Prozent ausgelastet.");
      else if (gpu >= 3) teile.push("Die GPU regt sich kaum, " + Math.round(gpu) + " Prozent Auslastung.");
      else teile.push("Der Jetson ruht: Die GPU hat nichts zu tun" + (d.power_w != null ? " und das Board nimmt nur " + de(d.power_w, 1) + " Watt auf." : "."));
      if (modelle.length === 1) teile.push("Das Modell " + modelle[0] + " liegt im Speicher und belegt dort Platz" + (gpu < 15 ? ", auch wenn gerade niemand fragt." : "."));
      else if (modelle.length > 1) teile.push("Die Modelle " + modelle.join(" und ") + " liegen im Speicher und belegen dort Platz.");
      if (ramP > 90) teile.push("Der Speicher ist zu " + Math.round(ramP) + " Prozent voll, für weitere Modelle wird es eng.");
      if (d.temp_c != null && d.temp_c >= 75) teile.push("Mit " + de(d.temp_c, 1) + " Grad ist der Chip recht warm, bei zu viel Hitze taktet er herunter.");
      return teile.join(" ");
    }

    /* ---- Verlaufsgrafik (SVG) */
    const VB = { w: 640, h: 230, l: 46, r: 594, o: 14, u: 190 };
    const sv = (tag, attrs) => { const e = document.createElementNS(SVGNS, tag); for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, v); return e; };
    const svg = sv("svg", { viewBox: "0 0 " + VB.w + " " + VB.h, class: "w-chart", role: "img", preserveAspectRatio: "xMidYMid meet" });
    const gitterG = sv("g"), achsenL = sv("g"), achsenR = sv("g"), achsenX = sv("g");
    const pfadW = sv("path", { class: "w-linie-w" }), pfadG = sv("path", { class: "w-linie-g" });
    const dotG = sv("circle", { r: 3.5, class: "w-punkt-g" }), dotW = sv("circle", { r: 3.5, class: "w-punkt-w" });
    svg.append(gitterG, achsenL, achsenR, achsenX, pfadW, pfadG, dotW, dotG);
    const yAt = (frac) => VB.u - frac * (VB.u - VB.o);
    for (let i = 0; i <= 5; i++) {
      gitterG.append(sv("line", { x1: VB.l, x2: VB.r, y1: yAt(i / 5), y2: yAt(i / 5), class: i === 0 ? "w-achse" : "w-gitter" }));
      const t = sv("text", { x: VB.l - 8, y: yAt(i / 5) + 4, "text-anchor": "end", class: "w-tick" }); t.textContent = i * 20 + " %"; achsenL.append(t);
    }
    const rTicks = [];
    for (let i = 0; i <= 5; i++) { const t = sv("text", { x: VB.r + 8, y: yAt(i / 5) + 4, "text-anchor": "start", class: "w-tick w-tick-w" }); rTicks.push(t); achsenR.append(t); }
    [[0, "vor 60 s"], [1 / 3, "vor 40 s"], [2 / 3, "vor 20 s"], [1, "jetzt"]].forEach(([f, txt]) => {
      const t = sv("text", { x: VB.l + f * (VB.r - VB.l), y: VB.u + 22, "text-anchor": f === 0 ? "start" : f === 1 ? "end" : "middle", class: "w-tick" });
      t.textContent = txt; achsenX.append(t);
    });
    const legende = h("div", { class: "w-legende" },
      h("span", null, h("i", { class: "w-sw-g" }), "GPU-Auslastung (linke Achse, Prozent)"),
      h("span", null, h("i", { class: "w-sw-w" }), "Leistung (rechte Achse, Watt)"));

    function diagramm() {
      const jetztMs = Date.now();
      while (verlauf.length && jetztMs - verlauf[0].t > FENSTER + 2000) verlauf.shift();
      const maxW = Math.max(25, Math.ceil(Math.max(0, ...verlauf.map((p) => p.w || 0)) / 5) * 5);
      rTicks.forEach((t, i) => { t.textContent = Math.round((maxW / 5) * i) + " W"; });
      const x = (t) => VB.l + (1 - (jetztMs - t) / FENSTER) * (VB.r - VB.l);
      const punkte = verlauf.filter((p) => jetztMs - p.t <= FENSTER + 2000);
      const pfad = (f) => punkte.map((p, i) => (i ? "L" : "M") + klemme(x(p.t), VB.l, VB.r).toFixed(1) + " " + yAt(klemme(f(p), 0, 1)).toFixed(1)).join(" ");
      pfadG.setAttribute("d", pfad((p) => p.gpu / 100));
      pfadW.setAttribute("d", pfad((p) => (p.w || 0) / maxW));
      const l = punkte[punkte.length - 1];
      dotG.style.display = dotW.style.display = l ? "" : "none";
      if (l) {
        dotG.setAttribute("cx", klemme(x(l.t), VB.l, VB.r)); dotG.setAttribute("cy", yAt(klemme(l.gpu / 100, 0, 1)));
        dotW.setAttribute("cx", klemme(x(l.t), VB.l, VB.r)); dotW.setAttribute("cy", yAt(klemme((l.w || 0) / maxW, 0, 1)));
        svg.setAttribute("aria-label", "Verlauf der letzten 60 Sekunden. GPU zuletzt " + Math.round(l.gpu) + " Prozent, Leistung " + de(l.w || 0, 1) + " Watt.");
      } else svg.setAttribute("aria-label", "Verlauf der letzten 60 Sekunden, noch keine Werte.");
    }

    /* ---- Modelle im Speicher */
    const modelleListe = h("ul", { class: "w-modelle" });
    function modelleBauen(d) {
      const m = d.modelle_geladen || [];
      if (!m.length) { modelleListe.replaceChildren(h("li", { class: "w-leer" }, "Gerade liegt kein Modell im Speicher. Der Speicher gehört dem Betriebssystem und den Programmen.")); return; }
      modelleListe.replaceChildren(...m.map((name) => h("li", null,
        h("b", null, name),
        h("span", null, "Das Modell liegt komplett im gemeinsamen Speicher von CPU und GPU, damit die Antwort ohne Ladezeit startet. Dieser Platz fehlt für anderes."))));
    }

    root.append(
      ringe,
      h("div", { class: "w-abschnitt" }, jetzt),
      h("div", { class: "w-abschnitt" }, h("h3", { class: "w-ueber" }, "Die letzten 60 Sekunden"), svg, legende),
      h("div", { class: "w-abschnitt" }, h("h3", { class: "w-ueber" }, "Im Speicher"), modelleListe));
    diagramm();
    modelleBauen({});

    function aktualisieren(d) {
      letzteWerte = d;
      if (d.gpu_pct != null) setRing(rGpu, d.gpu_pct, Math.round(d.gpu_pct) + " %");
      if (d.ram_mb != null && d.ram_max_mb) {
        const p = (d.ram_mb / d.ram_max_mb) * 100;
        setRing(rRam, p, Math.round(p) + " %", p > 90);
        rRam.sub.textContent = de(d.ram_mb / 1024, 1) + " von " + de(d.ram_max_mb / 1024, 1) + " GB";
      }
      if (d.cpu_pct != null) setRing(rCpu, d.cpu_pct, Math.round(d.cpu_pct) + " %");
      if (d.power_w != null) setRing(rW, (d.power_w / 25) * 100, de(d.power_w, 1) + " W", d.power_w >= 22.5);
      if (d.temp_c != null) { tempZahl.textContent = de(d.temp_c, 1) + " °C"; temp.setAttribute("aria-label", "Temperatur " + de(d.temp_c, 1) + " Grad Celsius"); temp.classList.toggle("warn", d.temp_c >= 75); }
      jetzt.textContent = satzBauen(d);
      modelleBauen(d);
      if (d.gpu_pct != null && d.frisch !== false) verlauf.push({ t: Date.now(), gpu: d.gpu_pct, w: d.power_w });
      diagramm();
    }
    const ab = stats.on(aktualisieren);
    /* Zeit läuft weiter, auch wenn gerade kein neuer Wert kommt: Linie wandert nach links */
    const uhr = setInterval(() => { if (!document.hidden) diagramm(); }, 1000);
    return { destroy() { ab(); clearInterval(uhr); } };
  };
})();
