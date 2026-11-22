/* KI-Labor: RAG-Werkstatt (fuenf Bausteine zum Strang "Wissen und RAG").
   Vertrag siehe app.js: KL.widgets.<name> = function (root, seite) { ...; return { destroy() {} } }
   Bausteine: rag-bedeutungskarte, rag-chunk-labor, rag-suche-vergleich, rag-rerank-labor, rag-test-labor.
   Daten: /static/daten/rag-korpus.json (erzeugt von scripts/rag_korpus_bauen.py), Server: app/lab_rag.py.
   Die kleinen, deterministischen Rechenwege laufen im Browser und sind hier EINMAL implementiert (KL.rag):
   Zerlegen in Woerter, BM25, Rangfusion, Kosinus, Schneiden von Text. Alle Bausteine benutzen sie gemeinsam.
   Die Python-Spiegelung steht im Bauskript; der Browsertest vergleicht beide.
   SICHERHEIT: Texte aus dem Netz und Eingaben der Nutzer gelangen nur per Text (h(...), textContent) in die Seite. */
(function () {
  "use strict";
  const KL = window.KL;
  const { h, icon } = KL;
  const SVGNS = "http://www.w3.org/2000/svg";

  /* ============================================================ Hilfen */
  const de = (n, d = 1) => Number(n).toFixed(d).replace(".", ",");
  const klemme = (v, a, b) => Math.min(b, Math.max(a, v));
  const mqRuhig = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const ruhig = () => !!(mqRuhig && mqRuhig.matches);
  let zaehler = 0;
  const neueId = (p) => "rr-" + p + "-" + (++zaehler);
  const b = (t) => h("b", null, t);
  const zeitText = (ms) => KL.zeit(ms).replace(".", ",");

  function svgEl(tag, attrs, ...kinder) {
    const e = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v != null && v !== false) e.setAttribute(k, v === true ? "" : v);
    for (const c of kinder.flat(Infinity)) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c)));
    return e;
  }
  /* kleine Symbole im Stil von KL.icon (lucide), ohne innerHTML gebaut */
  const PFADE = {
    x: ["M18 6L6 18", "M6 6l12 12"],
    refresh: ["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"],
    suche: ["M11 4a7 7 0 1 0 0 14a7 7 0 0 0 0-14z", "M21 21l-4.3-4.3"],
    hoch: ["M12 19V5", "M5 12l7-7 7 7"],
    runter: ["M12 5v14", "M19 12l-7 7-7-7"],
    uhr: ["M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z", "M12 7v5l3 2"],
    plus: ["M12 5v14", "M5 12h14"],
  };
  function sym(name) {
    if (!PFADE[name]) return icon(name);
    return svgEl("svg", { class: "ic", viewBox: "0 0 24 24", "aria-hidden": "true" }, PFADE[name].map((d) => svgEl("path", { d })));
  }
  function schalter(text, an, onChange) {
    const input = h("input", { type: "checkbox", role: "switch" });
    input.checked = !!an;
    input.addEventListener("change", () => onChange(input.checked));
    return { el: h("label", { class: "w-schalter" }, input, h("span", { class: "w-sw", "aria-hidden": "true" }), h("span", null, text)), input };
  }
  function regler(text, min, max, step, wert, format, onInput) {
    const id = neueId("regler");
    const input = h("input", { type: "range", id, min, max, step });
    input.value = wert;
    const out = h("output", { for: id }, format(wert));
    input.addEventListener("input", () => { out.textContent = format(Number(input.value)); onInput(Number(input.value)); });
    return { el: h("div", { class: "regler" }, h("label", { for: id }, text), input, out), input, out };
  }
  function hinweis(text) { return h("p", { class: "w-hinweis" }, icon("info"), h("span", null, text)); }
  /* Gruppe von Chips, von denen genau einer gedrueckt ist (aria-pressed) */
  function chipGruppe(liste, start, onWahl, label) {
    const el = h("div", { class: "zeile rr-chips", role: "group", "aria-label": label });
    const knoepfe = new Map();
    function setze(id) { for (const [k, bt] of knoepfe) bt.setAttribute("aria-pressed", k === id ? "true" : "false"); }
    for (const [id, text] of liste) {
      const bt = h("button", { type: "button", class: "chip", "aria-pressed": id === start ? "true" : "false", onclick: () => { setze(id); onWahl(id); } }, text);
      knoepfe.set(id, bt); el.append(bt);
    }
    return { el, setze, knoepfe };
  }
  /* Live-Erklaerung: Block .live mit .erklaerung (aria-live polite). Nachrichten kommen gebuendelt (hoechstens alle 400 ms). */
  function liveBlock(titel) {
    const text = h("p", { class: "erklaerung", "aria-live": "polite", "aria-atomic": "true" });
    const el = h("div", { class: "live rr-live" }, h("div", { class: "titel" }, icon("live"), titel), text);
    let t = null, wartend = null;
    return {
      el,
      setze(...teile) {
        wartend = teile.flat(Infinity);
        if (t) return;
        t = setTimeout(() => { t = null; text.replaceChildren(...wartend); }, 400);
      },
      sofort(...teile) { clearTimeout(t); t = null; text.replaceChildren(...teile.flat(Infinity)); },
      stop() { clearTimeout(t); t = null; },
    };
  }
  /* POST mit JSON; wirft Error mit lesbarer Meldung. signal bricht ab (AbortError wird durchgereicht). */
  async function api(pfad, obj, signal) {
    let r;
    try {
      r = await fetch(pfad, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj), signal });
    } catch (e) {
      if (e && e.name === "AbortError") throw e;
      throw new Error("Der Jetson ist gerade nicht erreichbar.");
    }
    let d = null;
    try { d = await r.json(); } catch (e) { /* leer */ }
    if (!r.ok) throw new Error((d && d.fehler) || "Das hat nicht geklappt (Status " + r.status + ").");
    return d;
  }

  /* ============================================================ Daten */
  let korpusP = null;
  function korpus() {
    if (!korpusP) {
      korpusP = fetch("/static/daten/rag-korpus.json").then((r) => { if (!r.ok) throw new Error("Daten fehlen"); return r.json(); }).then(vorbereiten);
      korpusP.catch(() => { korpusP = null; });
    }
    return korpusP;
  }
  function vorbereiten(K) {
    K.idx = bm25Index(K.absaetze.map((a) => a.text));
    K.gruppenAbsaetze = Array.from(new Set(K.absaetze.map((a) => a.gruppe)));
    return K;
  }
  const dot = (a, b2) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b2[i]; return s; };

  /* ============================================================ Stichwortsuche (BM25), Rangfusion */
  const STOPP = new Set(("der die das den dem des ein eine einen einem einer eines und oder aber auch nicht " +
    "ist sind war wird werden wurde wurden hat haben bin bist " +
    "ich du er sie es wir ihr mein dein sein unser mir dir mich dich " +
    "von zu mit bei nach aus auf an in im am um für vor über unter durch " +
    "wie was wer wo wann welche welcher welches wenn dass als so " +
    "darf dürfen kann können muss müssen soll sollen gilt gelten").split(/\s+/));
  const WORT = /[a-zäöüß0-9]+(?:-[a-zäöüß0-9]+)*/g;
  const K1 = 1.5, B = 0.75, RRF_K = 60;
  function woerter(text) { return (String(text).toLowerCase().match(WORT) || []).filter((w) => !STOPP.has(w)); }
  function bm25Index(texte) {
    const docs = texte.map(woerter);
    const df = new Map();
    for (const d of docs) for (const w of new Set(d)) df.set(w, (df.get(w) || 0) + 1);
    return { docs, df, n: docs.length, mittel: docs.reduce((s, d) => s + d.length, 0) / docs.length };
  }
  /* Gibt Wertung und Rechenweg je Text zurueck: details[i] = [{wort, tf, df, idf, teil}] */
  function bm25(idx, frage) {
    const q = Array.from(new Set(woerter(frage)));
    const werte = [], details = [];
    for (const d of idx.docs) {
      let s = 0; const det = [];
      for (const w of q) {
        const tf = d.reduce((c, x) => c + (x === w ? 1 : 0), 0);
        if (!tf) continue;
        const df = idx.df.get(w) || 0;
        const idf = Math.log(1 + (idx.n - df + 0.5) / (df + 0.5));
        const teil = idf * tf * (K1 + 1) / (tf + K1 * (1 - B + B * d.length / idx.mittel));
        s += teil; det.push({ wort: w, tf, df, idf, teil });
      }
      werte.push(s); details.push(det);
    }
    return { werte, details, frageWoerter: q };
  }
  /* Rang je Eintrag (1 = bester) unter den erlaubten; Gleichstand: kleinerer Index zuerst; nurPositiv: Wertung 0 ohne Rang */
  function raenge(werte, erlaubt, nurPositiv) {
    const ord = [];
    for (let i = 0; i < werte.length; i++) if (!erlaubt || erlaubt(i)) ord.push(i);
    ord.sort((x, y) => (werte[y] - werte[x]) || (x - y));
    const r = new Array(werte.length).fill(null);
    let k = 0;
    for (const i of ord) { if (nurPositiv && werte[i] <= 0) continue; r[i] = ++k; }
    return r;
  }
  /* Gewichtete Rangfusion (RRF): w ist das Gewicht des Vektors (0 bis 1); 0,5 heisst gleich viel */
  const rrfTeil = (rang, gewicht) => (rang ? gewicht / (RRF_K + rang) : 0);
  /* Komplette Suche ueber den Beispielkorpus. o: {gewicht, gruppe}. Gibt je Absatz alle Zwischenwerte zurueck. */
  function suche(K, frage, qv, o) {
    o = o || {};
    const w = o.gewicht == null ? 0.5 : o.gewicht;
    const erlaubt = (i) => !o.gruppe || K.absaetze[i].gruppe === o.gruppe;
    const bm = bm25(K.idx, frage);
    const cos = K.absaetze.map((a) => dot(qv, a.vektor));
    const rs = raenge(bm.werte, erlaubt, true), rv = raenge(cos, erlaubt, false);
    const gs = 2 * (1 - w), gv = 2 * w;
    const hyb = K.absaetze.map((_, i) => rrfTeil(rs[i], gs) + rrfTeil(rv[i], gv));
    const rh = raenge(hyb, erlaubt, false);
    const zeilen = K.absaetze.map((a, i) => ({
      i, erlaubt: erlaubt(i), bm25: bm.werte[i], det: bm.details[i], rangS: rs[i], cos: cos[i], rangV: rv[i],
      teilS: rrfTeil(rs[i], gs), teilV: rrfTeil(rv[i], gv), hyb: hyb[i], rangH: rh[i],
    }));
    return { zeilen, frageWoerter: bm.frageWoerter, gewicht: w };
  }
  const reihenfolge = (S, feld) => S.zeilen.filter((z) => z.erlaubt && z[feld] != null).sort((x, y) => x[feld] - y[feld]);
  /* bester Rang der Fundstellen einer Frage (oder null) */
  function besterRang(S, ziel, feld) {
    const r = ziel.map((i) => S.zeilen[i][feld]).filter((x) => x != null);
    return r.length ? Math.min(...r) : null;
  }
  const METHODEN = { stichwort: "rangS", vektor: "rangV", hybrid: "rangH" };
  const METHODEN_NAMEN = { stichwort: "Stichwort", vektor: "Vektor", hybrid: "Hybrid" };

  /* ============================================================ Text schneiden */
  /* Jede Strategie liefert Bereiche [a, b) im Originaltext. Danach wird getrimmt und die Ueberlappung angewendet:
     s = Anfang einschliesslich Ueberlappung, k = Anfang des eigenen Teils, e = Ende. */
  const STRATEGIEN = [
    ["fest", "Feste Länge"], ["absatz", "Absatz"], ["satz", "Satz"], ["ueberschrift", "Überschrift"], ["rekursiv", "Rekursiv"],
  ];
  const STRATEGIE_NAME = Object.fromEntries(STRATEGIEN);
  function trimme(text, a, bb) {
    while (a < bb && /\s/.test(text[a])) a++;
    while (bb > a && /\s/.test(text[bb - 1])) bb--;
    return a < bb ? [a, bb] : null;
  }
  function teileAn(text, a, bb, re) {
    /* zerlegt [a,bb) an den Treffern von re; Schnitt liegt hinter dem Treffer (cut = index+laenge-nachlauf) */
    const teile = []; let von = a;
    const sub = text.slice(a, bb);
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(sub))) {
      const cut = a + m.index + m[0].length;
      if (cut > von && cut < bb) { teile.push([von, cut]); von = cut; }
      if (m[0].length === 0) re.lastIndex++;
    }
    teile.push([von, bb]);
    return teile;
  }
  function absaetze(text) {
    const r = []; const re = /\n[ \t]*\n/g; let von = 0, m;
    while ((m = re.exec(text))) { r.push([von, m.index]); von = m.index + m[0].length; }
    r.push([von, text.length]);
    return r.map(([a, bb]) => trimme(text, a, bb)).filter(Boolean);
  }
  function saetze(text) {
    /* Satzende: . ! ? gefolgt von Leerraum, oder Zeilenumbruch (Tabellenzeilen, Ueberschriften) */
    const r = []; const re = /[.!?](?=\s)|\n/g; let von = 0, m;
    while ((m = re.exec(text))) { const e = m.index + (m[0] === "\n" ? 0 : 1); r.push([von, e]); von = m.index + m[0].length; }
    r.push([von, text.length]);
    return r.map(([a, bb]) => trimme(text, a, bb)).filter(Boolean);
  }
  function packen(bereiche, groesse) {
    /* fasst aufeinanderfolgende Bereiche zusammen, solange das Stueck nicht groesser als groesse wird */
    const out = []; let cur = null;
    for (const [a, bb] of bereiche) {
      if (cur && bb - cur[0] <= groesse) cur[1] = bb;
      else { if (cur) out.push(cur); cur = [a, bb]; }
    }
    if (cur) out.push(cur);
    return out;
  }
  function rekursiv(text, a, bb, groesse, seps) {
    if (bb - a <= groesse) return [[a, bb]];
    const sep = seps[0];
    if (sep === undefined) { /* nichts mehr zum Trennen: hart schneiden */
      const out = []; for (let p = a; p < bb; p += groesse) out.push([p, Math.min(bb, p + groesse)]); return out;
    }
    const rest = seps.slice(1);
    const teile = teileAn(text, a, bb, sep);
    if (teile.length === 1) return rekursiv(text, a, bb, groesse, rest);
    const out = []; let gut = [];
    const leere = () => { if (gut.length) { out.push(...packen(gut, groesse)); gut = []; } };
    for (const t of teile) {
      if (t[1] - t[0] <= groesse) gut.push(t);
      else { leere(); out.push(...rekursiv(text, t[0], t[1], groesse, rest)); }
    }
    leere();
    return out;
  }
  const SEP_UEBERSCHRIFT = () => { const re = /\n(?=# )/g; return re; };
  const SEP_ABSATZ = () => /\n[ \t]*\n/g;
  const SEP_ZEILE = () => /\n/g;
  const SEP_SATZ = () => /[.!?] /g;
  const SEP_WORT = () => / /g;
  function grundbereiche(text, strategie, groesse) {
    const n = text.length;
    if (strategie === "fest") {
      const r = []; for (let p = 0; p < n; p += groesse) r.push([p, Math.min(n, p + groesse)]); return r;
    }
    let r;
    if (strategie === "absatz") {
      r = [];
      for (const [a, bb] of absaetze(text)) {
        if (bb - a <= groesse) r.push([a, bb]);
        else r.push(...packen(saetze(text.slice(a, bb)).map(([x, y]) => [x + a, y + a]), groesse));
      }
    } else if (strategie === "satz") {
      r = packen(saetze(text), groesse);
    } else if (strategie === "ueberschrift") {
      /* Abschnitte an Ueberschriftzeilen (# ...). Ein Abschnitt aus nur einer Ueberschrift haengt am naechsten. Zu lange Abschnitte werden rekursiv geteilt. */
      const starts = []; const re = /^# /gm; let m;
      while ((m = re.exec(text))) starts.push(m.index);
      if (!starts.length || starts[0] > 0) starts.unshift(0);
      let abschn = starts.map((s, i) => [s, i + 1 < starts.length ? starts[i + 1] : n]);
      const verb = [];
      for (let i = 0; i < abschn.length; i++) {
        const [a, bb] = abschn[i];
        if (!text.slice(a, bb).trim().includes("\n") && i + 1 < abschn.length) abschn[i + 1] = [a, abschn[i + 1][1]];
        else verb.push([a, bb]);
      }
      r = [];
      for (const [a, bb] of verb) r.push(...rekursiv(text, a, bb, groesse, [SEP_ABSATZ(), SEP_ZEILE(), SEP_SATZ(), SEP_WORT()]));
    } else {
      r = rekursiv(text, 0, n, groesse, [SEP_UEBERSCHRIFT(), SEP_ABSATZ(), SEP_ZEILE(), SEP_SATZ(), SEP_WORT()]);
    }
    return r;
  }
  function schneide(text, strategie, groesse, ueberlappungProzent) {
    let r = grundbereiche(text, strategie, groesse);
    if (strategie !== "fest") r = r.map(([a, bb]) => trimme(text, a, bb)).filter(Boolean);
    const o = Math.round(groesse * (ueberlappungProzent || 0) / 100);
    const stuecke = [];
    r.forEach(([a, bb], i) => {
      let s = a;
      if (i > 0 && o > 0) {
        s = Math.max(r[i - 1][0], a - o);
        if (strategie !== "fest") { while (s < a && !/\s/.test(text[s - 1] || " ")) s++; }  /* nicht mitten im Wort anfangen */
        while (s < a && /\s/.test(text[s])) s++;
      }
      stuecke.push({ s, k: a, e: bb });
    });
    return stuecke;
  }
  /* Antwort im Text finden (Leerraum beliebig). Gibt [a,b) oder null. */
  function findeAntwort(text, antwort) {
    const w = String(antwort || "").trim().split(/\s+/).filter(Boolean);
    if (!w.length) return null;
    const re = new RegExp(w.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s+"));
    const m = re.exec(text);
    return m ? [m.index, m.index + m[0].length] : null;
  }
  /* Urteil: welche Stuecke enthalten die Antwort ganz, welche teilweise? */
  function urteil(stuecke, ant) {
    if (!ant) return { art: "fehlt", ganz: [], teil: [] };
    const ganz = [], teil = [];
    stuecke.forEach((c, i) => {
      if (c.s <= ant[0] && c.e >= ant[1]) ganz.push(i);
      else if (c.s < ant[1] && c.e > ant[0]) teil.push(i);
    });
    return { art: ganz.length ? "ganz" : "zerrissen", ganz, teil };
  }
  /* Satzende oder Zeilenende direkt vor pos? Sonst liegt der Schnitt mitten im Satz. */
  function sauber(text, pos) { return pos >= text.length || /[.!?:]\s*$|\n\s*$/.test(text.slice(Math.max(0, pos - 12), pos)); }

  /* Die Bausteine teilen sich diese Helfer (Test und Bausteine rechnen mit denselben Funktionen). */
  KL.rag = { woerter, bm25Index, bm25, raenge, suche, besterRang, reihenfolge, schneide, findeAntwort, urteil, sauber, dot,
    konstanten: { K1, B, RRF_K }, laden: korpus };

  /* ============================================================ Formen der Gruppen (Farbe UND Form, nie nur Farbe) */
  const FORMEN = [
    (x, y, r) => svgEl("circle", { cx: x, cy: y, r }),
    (x, y, r) => svgEl("rect", { x: x - r, y: y - r, width: 2 * r, height: 2 * r, rx: 2 }),
    (x, y, r) => svgEl("path", { d: "M" + x + " " + (y - r * 1.2) + "L" + (x + r * 1.15) + " " + (y + r * 0.85) + "L" + (x - r * 1.15) + " " + (y + r * 0.85) + "Z" }),
    (x, y, r) => svgEl("path", { d: "M" + x + " " + (y - r * 1.3) + "L" + (x + r * 1.3) + " " + y + "L" + x + " " + (y + r * 1.3) + "L" + (x - r * 1.3) + " " + y + "Z" }),
    (x, y, r) => svgEl("path", { d: [0, 1, 2, 3, 4, 5].map((i) => (i ? "L" : "M") + (x + r * 1.15 * Math.cos(Math.PI / 3 * i)).toFixed(1) + " " + (y + r * 1.15 * Math.sin(Math.PI / 3 * i)).toFixed(1)).join("") + "Z" }),
  ];
  const FORM_NAMEN = ["Kreis", "Quadrat", "Dreieck", "Raute", "Sechseck"];
  function formSymbol(gi) {
    const s = svgEl("svg", { class: "rr-formsym rr-g" + gi, viewBox: "0 0 16 16", "aria-hidden": "true" });
    const f = FORMEN[gi % FORMEN.length](8, 8, 5);
    f.setAttribute("class", "rr-form"); s.append(f); return s;
  }
  const nenne = (liste) => liste.length < 2 ? liste.join("") : liste.slice(0, -1).join(", ") + " und " + liste[liste.length - 1];

  /* ============================================================ 1. Bedeutungskarte */
  KL.widgets["rag-bedeutungskarte"] = function (root) {
    root.classList.add("w-wid", "rr");
    const ac = new AbortController();
    let K = null, auswahl = null, laeuft = false, zahlenAn = false, eigeneZaehler = 0;
    const eigene = [];
    const BREITE = 640, HOEHE = 400, RAND = 30, MAXEIGENE = 6;
    const status = h("p", { class: "w-hinweis rr-status", "aria-live": "polite" }, icon("info"), h("span", null, "Beispielsätze laden …"));
    const statusText = () => status.lastChild;
    const info = h("p", { class: "rr-info", "aria-live": "off" }, "Fahre mit der Maus über einen Punkt oder tippe ihn an.");
    const karte = svgEl("svg", { class: "rr-karte", viewBox: "0 0 " + BREITE + " " + HOEHE, role: "group", "aria-label": "Karte der Beispielsätze. Jeder Punkt ist ein Satz." });
    const legende = h("ul", { class: "rr-legende", "aria-label": "Themen der Sätze" });
    const liste = h("ol", { class: "rr-nachbarn", "aria-label": "Nächste Nachbarn" });
    const listenKopf = h("p", { class: "w-ueber" }, "Nächste Sätze");
    const zahlenBox = h("div", { class: "rr-zahlenbox", hidden: true });
    const eingabe = h("input", { type: "text", maxlength: "300", placeholder: "Schreibe einen eigenen Satz", "aria-label": "Eigener Satz", autocomplete: "off" });
    const knopf = h("button", { type: "submit", class: "btn primary" }, sym("suche"), "Einbetten");
    const reset = h("button", { type: "button", class: "btn", onclick: zuruecksetzen }, sym("refresh"), "Karte zurücksetzen");
    const sw = schalter("Zahlen zeigen", false, (an) => { zahlenAn = an; zeichneZahlen(); });
    const live = liveBlock("Live-Erklärung");
    const vorschlaege = ["Im Kühlschrank ist noch Käse.", "Die Straße ist heute glatt.", "Mein Hals kratzt und die Nase läuft.", "Wir brauchen neue Druckerpatronen."];
    const form = h("form", { class: "rr-form-zeile", onsubmit: (e) => { e.preventDefault(); einbetten(eingabe.value); } }, eingabe, knopf);
    const chips = h("div", { class: "zeile rr-vorschlaege" }, h("span", { class: "w-leise rr-lbl" }, "Zum Ausprobieren:"),
      vorschlaege.map((t) => h("button", { type: "button", class: "chip", onclick: () => { eingabe.value = t; einbetten(t); } }, t)));
    root.append(
      status, h("div", { class: "rr-kartenwrap" }, karte), legende, info, form, chips,
      KL.gruppe("Anzeige", [sw.el], { aktion: [reset], klasse: "rr-anzeige" }),
      zahlenBox, h("div", { class: "rr-abschnitt" }, listenKopf, liste),
      h("div", { class: "rr-abschnitt" }, live.el));

    function gi(gruppe) { return Math.max(0, K.gruppen.findIndex((g) => g.id === gruppe)); }
    function gname(gruppe) { return (K.gruppen.find((g) => g.id === gruppe) || {}).name || gruppe; }
    let sx, sy;
    function bauen() {
      const xs = K.saetze.map((p) => p.x), ys = K.saetze.map((p) => p.y);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      sx = (x) => RAND + (x - x0) / (x1 - x0) * (BREITE - 2 * RAND);
      sy = (y) => HOEHE - RAND - (y - y0) / (y1 - y0) * (HOEHE - 2 * RAND);
      K.gruppen.forEach((g, i) => legende.append(h("li", null, formSymbol(i), h("span", null, g.name))));
      zeichne();
      eingabe.disabled = false;
    }
    function pos(p) { return [klemme(sx(p.x), 12, BREITE - 12), klemme(sy(p.y), 12, HOEHE - 12)]; }
    function zeichne() {
      karte.replaceChildren();
      const linien = svgEl("g", { class: "rr-linien" });
      const punkte = svgEl("g");
      const nachbarIdx = new Set(auswahl ? auswahl.nachbarn.map((n) => n.index) : []);
      if (auswahl) {
        const [ax, ay] = pos(auswahl);
        auswahl.nachbarn.forEach((n, r) => {
          const [bx, by] = pos(K.saetze[n.index]);
          linien.append(svgEl("line", { x1: ax, y1: ay, x2: bx, y2: by, class: "rr-linie", "stroke-width": r === 0 ? 2.5 : 1.5 }));
        });
      }
      K.saetze.forEach((p, i) => {
        const [x, y] = pos(p);
        const istAuswahl = auswahl && auswahl.art === "beispiel" && auswahl.i === i;
        const g = svgEl("g", { class: "rr-pkt rr-g" + gi(p.gruppe) + (nachbarIdx.has(i) ? " rr-nachbar" : "") + (istAuswahl ? " rr-gewaehlt" : ""),
          tabindex: "0", role: "button", "aria-label": p.text + ", Thema " + gname(p.gruppe) + (nachbarIdx.has(i) ? ", nächster Nachbar" : ""), "aria-pressed": istAuswahl ? "true" : "false" });
        if (nachbarIdx.has(i) || istAuswahl) g.append(svgEl("circle", { cx: x, cy: y, r: 13, class: "rr-ring" }));
        const f = FORMEN[gi(p.gruppe) % FORMEN.length](x, y, 7); f.setAttribute("class", "rr-form"); g.append(f);
        g.addEventListener("pointerenter", () => { info.textContent = gname(p.gruppe) + ": " + p.text; });
        g.addEventListener("focus", () => { info.textContent = gname(p.gruppe) + ": " + p.text; });
        g.addEventListener("click", () => waehleBeispiel(i));
        g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); waehleBeispiel(i); } });
        punkte.append(g);
      });
      karte.append(linien, punkte);
      eigene.forEach((p) => {
        const [x, y] = pos(p);
        const aktiv = auswahl && auswahl.art === "eigen" && auswahl.nr === p.nr;
        const g = svgEl("g", { class: "rr-eigen" + (aktiv ? " rr-gewaehlt" : ""), tabindex: "0", role: "button", "aria-pressed": aktiv ? "true" : "false",
          "aria-label": "Dein Satz " + p.nr + ": " + p.text });
        g.append(svgEl("circle", { cx: x, cy: y, r: 13, class: "rr-eigen-ring" }), svgEl("circle", { cx: x, cy: y, r: 8, class: "rr-eigen-kern" }),
          svgEl("text", { x, y: y + 3.6, "text-anchor": "middle", class: "rr-eigen-nr" }, String(p.nr)));
        g.addEventListener("pointerenter", () => { info.textContent = "Dein Satz " + p.nr + ": " + p.text; });
        g.addEventListener("focus", () => { info.textContent = "Dein Satz " + p.nr + ": " + p.text; });
        g.addEventListener("click", () => { auswahl = p; zeichne(); aktualisiere(); });
        g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); auswahl = p; zeichne(); aktualisiere(); } });
        karte.append(g);
      });
    }
    function waehleBeispiel(i) {
      const s = K.saetze[i];
      const nachbarn = K.saetze.map((t, j) => ({ index: j, aehnlichkeit: dot(s.vektor, t.vektor) })).filter((n) => n.index !== i)
        .sort((a, c) => c.aehnlichkeit - a.aehnlichkeit).slice(0, 5);
      auswahl = { art: "beispiel", i, text: s.text, gruppe: s.gruppe, x: s.x, y: s.y, nachbarn, vektor: s.vektor.slice(0, 48) };
      info.textContent = gname(s.gruppe) + ": " + s.text;
      zeichne(); aktualisiere();
    }
    async function einbetten(text) {
      text = (text || "").trim();
      if (!text || laeuft) return;
      if (eigene.length >= MAXEIGENE) { statusText().textContent = "Du hast schon " + MAXEIGENE + " eigene Sätze. Setze die Karte zurück, um neu zu beginnen."; return; }
      laeuft = true; knopf.disabled = true; statusText().textContent = "Der Jetson bettet deinen Satz ein …";
      try {
        const d = await api("/api/projektion", { texte: [text] }, ac.signal);
        const p = d.punkte[0];
        const eg = { art: "eigen", nr: ++eigeneZaehler, text, x: p.x, y: p.y, nachbarn: p.naechste, vektor: p.vektor_anfang };
        eigene.push(eg); auswahl = eg; eingabe.value = "";
        statusText().textContent = "Dein Satz ist als Punkt " + eg.nr + " auf der Karte.";
        zeichne(); aktualisiere();
      } catch (e) {
        if (e.name !== "AbortError") statusText().textContent = e.message + " Die Beispielsätze kannst du trotzdem antippen.";
      } finally { laeuft = false; knopf.disabled = false; }
    }
    function zuruecksetzen() {
      eigene.length = 0; auswahl = null; eigeneZaehler = 0;
      statusText().textContent = "Die Karte ist zurückgesetzt.";
      zeichne(); aktualisiere();
    }
    function zeichneZahlen() {
      zahlenBox.hidden = !(zahlenAn && auswahl);
      if (zahlenBox.hidden) return;
      const v = auswahl.vektor, m = Math.max(...v.map(Math.abs)) || 1;
      zahlenBox.replaceChildren(
        h("div", { class: "rr-zahlen", role: "img", "aria-label": "Die ersten " + v.length + " Zahlen des Vektors als Balken" },
          v.map((z) => h("i", { class: z < 0 ? "neg" : "pos", style: "height:" + Math.max(2, Math.abs(z) / m * 100) + "%", title: de(z, 3) }))),
        h("p", { class: "w-leise rr-zahlnote" }, "Das sind die ersten " + v.length + " von " + K.dimension + " Zahlen dieses Satzes. Blau ist positiv, orange negativ. Jede einzelne sagt nichts Greifbares, erst alle zusammen legen die Position fest."));
    }
    function aktualisiere() {
      liste.replaceChildren();
      if (!auswahl) {
        listenKopf.textContent = "Nächste Sätze";
        liste.append(h("li", { class: "rr-leer" }, "Tippe einen Punkt an oder schreibe einen Satz. Hier erscheinen die nächsten Nachbarn."));
        zeichneZahlen();
        const anteil = Math.round((K.karte.anteil[0] + K.karte.anteil[1]) * 100);
        live.sofort("Jeder Punkt ist ein Satz, die Form zeigt das Thema. Sätze mit ähnlichem Sinn liegen nah beieinander. Jeder Satz besteht aus ", b(K.dimension + " Zahlen"),
          ". Für die Karte wurden sie auf zwei gedrückt. Diese beiden Achsen halten nur ", b(anteil + " Prozent"), " der Unterschiede fest, der Rest geht verloren.");
        return;
      }
      listenKopf.textContent = (auswahl.art === "eigen" ? "Nächste Sätze zu Punkt " + auswahl.nr : "Nächste Sätze zu diesem Satz") + " (Kosinus aus allen " + K.dimension + " Zahlen)";
      for (const n of auswahl.nachbarn) {
        const t = K.saetze[n.index];
        liste.append(h("li", { class: "rr-nb" }, formSymbol(gi(t.gruppe)), h("span", { class: "rr-nb-text" }, t.text),
          h("span", { class: "rr-nb-bar", "aria-hidden": "true" }, h("i", { style: "width:" + Math.round(klemme(n.aehnlichkeit, 0, 1) * 100) + "%" })),
          h("span", { class: "mono rr-nb-wert" }, de(n.aehnlichkeit, 2))));
      }
      zeichneZahlen();
      erklaere();
    }
    function erklaere() {
      const a = auswahl, n1 = a.nachbarn[0], t1 = K.saetze[n1.index];
      const w1 = new Set(woerter(a.text)), gemeinsam = woerter(t1.text).filter((w) => w1.has(w));
      const gruppen = a.nachbarn.slice(0, 3).map((n) => K.saetze[n.index].gruppe);
      const einig = gruppen.every((g) => g === gruppen[0]);
      const teile = [];
      teile.push(a.art === "eigen" ? "Dein Satz " : "Dieser Satz ", h("em", null, "„" + a.text + "“"), " liegt am nächsten bei ", h("em", null, "„" + t1.text + "“"),
        " (Thema ", gname(t1.gruppe), ", Kosinus ", b(de(n1.aehnlichkeit, 2)), "). ");
      teile.push(gemeinsam.length ? "Gemeinsame Wörter: " + nenne(Array.from(new Set(gemeinsam))) + ". " : [b("Kein einziges Wort stimmt überein."), " Das Modell hat den Sinn verglichen, nicht die Buchstaben. "]);
      teile.push(einig ? "Auch die nächsten drei Nachbarn gehören alle zum Thema " + gname(gruppen[0]) + ". " : "Die nächsten drei Nachbarn gehören zu verschiedenen Themen (" + nenne(Array.from(new Set(gruppen)).map(gname)) + "), der Satz liegt also zwischen Themen. ");
      /* Karte gegen Rechnung: wer liegt in der Zeichnung am naechsten? */
      let best = -1, bd = Infinity;
      K.saetze.forEach((p, j) => { if (a.art === "beispiel" && j === a.i) return; const d = Math.hypot(p.x - a.x, p.y - a.y); if (d < bd) { bd = d; best = j; } });
      if (best !== n1.index) {
        teile.push("Achtung: Auf der Karte liegt dem Punkt der Satz ", h("em", null, "„" + K.saetze[best].text + "“"), " am nächsten, die Rechnung mit allen Zahlen nennt aber den anderen. Die Karte ist nur eine Skizze und verliert Information.");
      } else teile.push("Hier stimmen Karte und Rechnung überein. Das ist nicht immer so, denn die Karte zeigt nur zwei von " + K.dimension + " Richtungen.");
      live.setze(...teile.flat());
    }
    eingabe.disabled = true; liste.append(h("li", { class: "rr-leer" }, "Lade …"));
    korpus().then((d) => { if (ac.signal.aborted) return; K = d; bauen(); aktualisiere(); statusText().textContent = "Die Karte zeigt " + K.saetze.length + " Beispielsätze. Einbetten braucht den Jetson, das Antippen der Punkte nicht."; })
      .catch(() => { statusText().textContent = "Die Beispieldaten konnten nicht geladen werden."; });
    return { destroy() { ac.abort(); live.stop(); } };
  };

  /* ============================================================ 2. Chunk-Labor */
  KL.widgets["rag-chunk-labor"] = function (root) {
    root.classList.add("w-wid", "rr");
    const ac = new AbortController();
    const MAXTEXT = 20000;
    const Z = { K: null, text: "", beispiel: "", strategie: "fest", groesse: 300, ueb: 0, frage: "", antwort: "", stuecke: [], ant: null, u: null };
    const status = h("p", { class: "w-hinweis rr-status", "aria-live": "polite" }, icon("info"), h("span", null, "Beispieltext laden …"));
    const statusText = () => status.lastChild;
    const strat = chipGruppe(STRATEGIEN, Z.strategie, (id) => { Z.strategie = id; neu(); }, "Strategie");
    const gr = regler("Größe", 100, 1500, 50, Z.groesse, (v) => v + " Zeichen", (v) => { Z.groesse = v; neu(); });
    const ueb = regler("Überlappung", 0, 40, 5, Z.ueb, (v) => v + " Prozent", (v) => { Z.ueb = v; neu(); });
    const kennzahlen = h("div", { class: "messwerte rr-kennzahlen", "aria-live": "off" });
    const textBox = h("div", { class: "rr-text", tabindex: "0", role: "region", "aria-label": "Der Text, in Stücke geschnitten. Jede Farbe ist ein Stück." });
    const frageFeld = h("input", { type: "text", maxlength: "300", "aria-label": "Frage", placeholder: "Frage", autocomplete: "off", oninput: () => { Z.frage = frageFeld.value; } });
    const antwortFeld = h("textarea", { rows: "2", maxlength: "600", "aria-label": "Antwortsatz", placeholder: "Antwortsatz aus dem Text", oninput: () => { Z.antwort = antwortFeld.value; neu(); } });
    const urteilBox = h("p", { class: "rr-urteil", "aria-live": "polite" });
    const probe = h("div", { class: "rr-probe" });
    const suchErg = h("div", { class: "rr-sucherg", "aria-live": "polite" });
    const live = liveBlock("Live-Erklärung");
    const probeKnopf = h("button", { type: "button", class: "btn", onclick: durchprobieren }, sym("refresh"), "Alle Einstellungen durchprobieren");
    const suchKnopf = h("button", { type: "button", class: "btn", onclick: mitJetson }, sym("suche"), "Mit dem Jetson suchen");
    const fragenChips = h("div", { class: "zeile rr-vorschlaege" }, h("span", { class: "w-leise rr-lbl" }, "Beispielfragen:"));
    const eigenFeld = h("textarea", { rows: "7", maxlength: String(MAXTEXT), "aria-label": "Eigener Text", placeholder: "Füge hier einen eigenen Text ein. Überschriften beginnen mit # und einem Leerzeichen." });
    const eigen = h("details", { class: "rr-eigentext" }, h("summary", null, "Eigenen Text einfügen"),
      h("div", { class: "rr-eigen-in" }, eigenFeld, h("div", { class: "zeile" },
        h("button", { type: "button", class: "btn klein primary", onclick: () => { const t = eigenFeld.value.replace(/\r\n?/g, "\n").trim(); if (t) { Z.text = t.slice(0, MAXTEXT); neu(); } } }, "Übernehmen"),
        h("button", { type: "button", class: "btn klein", onclick: () => { Z.text = Z.beispiel; eigenFeld.value = ""; neu(); } }, "Beispieltext zurück"))));
    root.append(status,
      h("div", { class: "rr-steuer" }, KL.gruppe("Aufteilung", [KL.zeile("Strategie", strat.el, null, true), gr.el, ueb.el])),
      kennzahlen, textBox,
      h("div", { class: "rr-abschnitt" },
        KL.gruppe("Testfrage", [fragenChips, KL.zeile("Frage", frageFeld, null, true), KL.zeile("Antwortsatz", antwortFeld, null, true)], { aktion: [probeKnopf, suchKnopf], aktionKlasse: "rr-aktionen", klasse: "rr-fragen" }),
        urteilBox, probe, suchErg),
      eigen, h("div", { class: "rr-abschnitt" }, live.el));

    function tabellenBereich(text) {
      const zeilen = text.split("\n"); let pos = 0, a = -1, bb = -1;
      for (const z of zeilen) { if (/ \| /.test(z)) { if (a < 0) a = pos; bb = pos + z.length; } pos += z.length + 1; }
      return a < 0 ? null : [a, bb];
    }
    function neu() {
      Z.stuecke = schneide(Z.text, Z.strategie, Z.groesse, Z.ueb);
      Z.ant = findeAntwort(Z.text, Z.antwort);
      Z.u = urteil(Z.stuecke, Z.ant);
      zeichneText(); zeichneKennzahlen(); zeichneUrteil(); erklaere();
      suchErg.replaceChildren(); probe.replaceChildren();
    }
    const farbe = (i) => "rr-c" + (i % 4);
    function zeichneText() {
      const text = Z.text, st = Z.stuecke, ant = Z.ant;
      const pts = new Set([0, text.length]);
      st.forEach((c) => { pts.add(c.s); pts.add(c.e); });
      if (ant) { pts.add(ant[0]); pts.add(ant[1]); }
      const p = Array.from(pts).sort((x, y) => x - y);
      const startVon = new Map();
      st.forEach((c, i) => { if (!startVon.has(c.s)) startVon.set(c.s, []); startVon.get(c.s).push(i); });
      const aktKlasse = Z.u.art === "ganz" ? "rr-ant ok" : Z.u.art === "zerrissen" ? "rr-ant schlecht" : "rr-ant";
      const teile = [];
      for (let j = 0; j < p.length; j++) {
        const von = p[j], bis = p[j + 1];
        for (const i of startVon.get(von) || []) {
          teile.push(h("span", { class: "rr-marke " + farbe(i), title: "Stück " + (i + 1) + ", " + (st[i].e - st[i].s) + " Zeichen" }, (i + 1) + " · " + (st[i].e - st[i].s)));
        }
        if (bis == null) break;
        const deck = [];
        st.forEach((c, i) => { if (c.s <= von && c.e >= bis) deck.push(i); });
        let kl = "rr-seg";
        const stil = {};
        if (!deck.length) kl += " rr-frei";
        else if (deck.length === 1) kl += " " + farbe(deck[0]);
        else { kl += " rr-ueb"; stil["--a"] = "var(--rr-f" + (deck[0] % 4) + ")"; stil["--b"] = "var(--rr-f" + (deck[1] % 4) + ")"; }
        if (ant && von >= ant[0] && bis <= ant[1]) kl += " " + aktKlasse;
        teile.push(h("span", { class: kl, style: Object.entries(stil).map(([k, v]) => k + ":" + v).join(";") || null }, text.slice(von, bis)));
      }
      textBox.replaceChildren(...teile);
    }
    function zeichneKennzahlen() {
      const l = Z.stuecke.map((c) => c.e - c.s);
      const kachel = (w, t) => h("div", { class: "messwert" }, h("b", null, w), t);
      kennzahlen.replaceChildren(kachel(String(l.length), "Stücke"), kachel(l.length ? String(Math.round(l.reduce((a, c) => a + c, 0) / l.length)) : "0", "mittlere Länge in Zeichen"),
        kachel(l.length ? l.reduce((a, c) => Math.min(a, c), Infinity) + " bis " + Math.max(...l) : "0", "kürzestes bis längstes"));
    }
    function nummern(liste) { return nenne(liste.map((i) => String(i + 1))); }
    function zeichneUrteil() {
      const u = Z.u; urteilBox.className = "rr-urteil";
      let t, ic;
      if (u.art === "fehlt") { t = Z.antwort.trim() ? "Der Antwortsatz kommt im Text nicht vor." : "Wähle eine Beispielfrage oder schreibe einen Antwortsatz aus dem Text."; ic = icon("info"); }
      else if (u.art === "ganz") { t = "Die Antwort liegt ganz in Stück " + nummern(u.ganz) + "."; ic = icon("check"); urteilBox.classList.add("ok"); }
      else { t = "Die Antwort ist zerrissen: Stück " + nummern(u.teil) + ". Kein Stück enthält sie ganz."; ic = sym("x"); urteilBox.classList.add("schlecht"); }
      urteilBox.replaceChildren(ic, h("span", null, t));
    }
    function erklaere() {
      const st = Z.stuecke, n = st.length, text = Z.text;
      if (!n) { live.setze("Der Text ist leer."); return; }
      const mittel = Math.round(st.reduce((a, c) => a + (c.e - c.s), 0) / n);
      const mitten = st.slice(1).filter((c) => !sauber(text, c.k)).length;
      const t = [STRATEGIE_NAME[Z.strategie] + " mit " + Z.groesse + " Zeichen" + (Z.ueb ? " und " + Z.ueb + " Prozent Überlappung" : " ohne Überlappung") + " ergibt ", b(n + " Stücke"), " von im Mittel " + mittel + " Zeichen. "];
      if (Z.strategie === "fest") t.push("Geschnitten wird nach Zeichenzahl, ohne auf den Inhalt zu achten: ", b(mitten + " von " + (n - 1) + " Schnitten"), " liegen mitten im Satz. ");
      else if (Z.strategie === "absatz") {
        const nurTitel = st.filter((c) => /^# /.test(text.slice(c.k, c.e)) && !text.slice(c.k, c.e).includes("\n")).length;
        t.push("Jeder Absatz wird ein Stück, die Größe wirkt nur auf Absätze, die länger sind. ", nurTitel ? [b(nurTitel + " Stücke"), " bestehen nur aus einer Überschrift und sagen für sich allein nichts. "] : "");
      } else if (Z.strategie === "satz") t.push("Sätze werden gesammelt, bis die Größe erreicht ist. Geschnitten wird nur an Satzenden: ", b(mitten + " Schnitte"), " liegen mitten im Satz. ");
      else if (Z.strategie === "ueberschrift") t.push("Jeder Abschnitt unter einer Überschrift bleibt zusammen, zu lange Abschnitte werden weiter geteilt. ");
      else t.push("Erst wird an Überschriften geschnitten, passt ein Stück nicht, an Absätzen, dann an Zeilen und Sätzen. Kleine Teile werden bis zur Größe zusammengefasst. ");
      const tab = tabellenBereich(text);
      if (tab) {
        const betr = st.filter((c) => c.k < tab[1] && c.e > tab[0]).length;
        t.push(betr === 1 ? "Die Fehlertabelle liegt in einem einzigen Stück. " : [b("Die Fehlertabelle ist auf " + betr + " Stücke verteilt"), ": Zeilen ohne Kopfzeile sind schwer zu deuten. "]);
      }
      const u = Z.u;
      if (u.art === "ganz") t.push("Die Antwort steht ganz in Stück " + nummern(u.ganz) + "." + (Z.ueb && u.teil.length ? " Die Überlappung hat dabei geholfen, denn in Stück " + nummern(u.teil) + " steht sie nur zum Teil." : ""));
      else if (u.art === "zerrissen") t.push(b("Die Antwort ist zerrissen"), ": Sie reicht über die Stücke " + nummern(u.teil) + ", und kein Stück enthält sie ganz. Eine Suche findet dann nur eine Hälfte. Mehr Überlappung oder ein anderer Schnitt können helfen.");
      live.setze(...t.flat());
    }
    function durchprobieren() {
      const groessen = [300, 600, 1000];
      if (!Z.ant) { probe.replaceChildren(h("p", { class: "w-leise" }, "Dafür braucht der Baustein einen Antwortsatz, der im Text vorkommt.")); return; }
      const kopf = h("tr", null, h("th", { scope: "col" }, "Strategie"), groessen.map((g) => h("th", { scope: "col" }, g + " Zeichen")));
      const zeilen = STRATEGIEN.map(([id, name]) => h("tr", null, h("th", { scope: "row" }, name), groessen.map((g) => {
        const u = urteil(schneide(Z.text, id, g, Z.ueb), Z.ant);
        const aktuell = id === Z.strategie && g === Z.groesse;
        return h("td", { class: (u.art === "ganz" ? "ok" : "schlecht") + (aktuell ? " aktuell" : "") }, u.art === "ganz" ? icon("check") : sym("x"), h("span", null, u.art === "ganz" ? "ganz" : "zerrissen"));
      })));
      probe.replaceChildren(h("div", { class: "tabelle-wrap" }, h("table", { class: "vergleich rr-probetabelle" },
        h("caption", null, "Liegt die Antwort ganz in einem Stück? Überlappung: " + Z.ueb + " Prozent"), h("thead", null, kopf), h("tbody", null, zeilen))));
      const ganz = []; STRATEGIEN.forEach(([id]) => groessen.forEach((g) => { if (urteil(schneide(Z.text, id, g, Z.ueb), Z.ant).art === "ganz") ganz.push(1); }));
      live.setze("Von " + (STRATEGIEN.length * groessen.length) + " Einstellungen halten ", b(ganz.length), " die Antwort ganz in einem Stück. Verschiebe die Überlappung und probiere noch einmal.");
    }
    let sucht = false;
    async function mitJetson() {
      if (sucht) return;
      const frage = Z.frage.trim();
      if (!frage) { suchErg.replaceChildren(h("p", { class: "w-leise" }, "Schreibe zuerst eine Frage.")); return; }
      if (Z.stuecke.length > 64) { suchErg.replaceChildren(h("p", { class: "w-leise" }, "Es sind " + Z.stuecke.length + " Stücke, der Jetson nimmt höchstens 64 auf einmal. Wähle eine größere Größe.")); return; }
      sucht = true; suchKnopf.disabled = true;
      suchErg.replaceChildren(h("p", { class: "w-leise" }, "Der Jetson bettet " + Z.stuecke.length + " Stücke und die Frage ein …"));
      const st = Z.stuecke.slice();
      try {
        const t0 = performance.now();
        const d = await api("/api/embed", { texte: [frage].concat(st.map((c) => Z.text.slice(c.s, c.e).slice(0, 2000))) }, ac.signal);
        const ms = performance.now() - t0;
        const qv = d.vektoren[0];
        const reihe = st.map((c, i) => ({ i, cos: dot(qv, d.vektoren[i + 1]) })).sort((x, y) => y.cos - x.cos);
        const u = urteil(st, Z.ant);
        const platz = (liste) => { const k = reihe.findIndex((r) => liste.includes(r.i)); return k < 0 ? null : k + 1; };
        const pGanz = platz(u.ganz), pTeil = platz(u.teil);
        const kopf = !Z.ant ? "Der Antwortsatz fehlt, deshalb lässt sich der Platz nicht bestimmen."
          : pGanz ? "Das Stück mit der ganzen Antwort steht auf Platz " + pGanz + " von " + st.length + "."
            : pTeil ? "Kein Stück enthält die ganze Antwort. Das beste Teilstück steht auf Platz " + pTeil + " von " + st.length + "." : "Die Antwort steckt in keinem Stück.";
        suchErg.replaceChildren(h("p", { class: "rr-urteil " + (pGanz === 1 ? "ok" : pGanz ? "" : "schlecht") }, pGanz === 1 ? icon("check") : pGanz ? icon("info") : sym("x"), h("span", null, kopf + " (" + zeitText(ms) + ")")),
          h("ol", { class: "rr-nachbarn" }, reihe.slice(0, 3).map((r) => h("li", { class: "rr-nb" }, h("span", { class: "rr-nb-nr " + farbe(r.i) }, String(r.i + 1)),
            h("span", { class: "rr-nb-text" }, Z.text.slice(st[r.i].s, st[r.i].e).slice(0, 110) + (st[r.i].e - st[r.i].s > 110 ? " …" : "")),
            h("span", { class: "mono rr-nb-wert" }, de(r.cos, 2)),
            u.ganz.includes(r.i) ? h("span", { class: "rr-tag ok" }, "enthält die Antwort") : u.teil.includes(r.i) ? h("span", { class: "rr-tag" }, "nur ein Teil") : null))));
        live.setze("Der Jetson hat die Frage mit allen ", b(st.length + " Stücken"), " verglichen. ", pGanz === 1 ? "Das richtige Stück gewinnt." : pGanz ? "Das richtige Stück gewinnt nicht, andere wirken ähnlicher." : "Ein zerrissenes Stück kann die Frage nur halb beantworten, deshalb steht keines vorn.");
      } catch (e) {
        if (e.name !== "AbortError") suchErg.replaceChildren(h("p", { class: "w-leise" }, e.message));
      } finally { sucht = false; suchKnopf.disabled = false; }
    }
    korpus().then((K) => {
      if (ac.signal.aborted) return;
      Z.K = K; Z.beispiel = K.handbuch.text; Z.text = Z.beispiel;
      K.handbuch.fragen.forEach((f) => fragenChips.append(h("button", { type: "button", class: "chip", onclick: () => { Z.frage = f.frage; Z.antwort = f.antwort; frageFeld.value = f.frage; antwortFeld.value = f.antwort; neu(); } }, f.frage)));
      const f0 = K.handbuch.fragen[0]; Z.frage = f0.frage; Z.antwort = f0.antwort; frageFeld.value = f0.frage; antwortFeld.value = f0.antwort;
      statusText().textContent = "Der Beispieltext ist ein erfundenes Kurzhandbuch. Alles außer „Mit dem Jetson suchen“ rechnet im Browser.";
      neu();
    }).catch(() => { statusText().textContent = "Die Beispieldaten konnten nicht geladen werden."; });
    return { destroy() { ac.abort(); live.stop(); } };
  };

  /* ============================================================ 3. Suche im Vergleich */
  function markiert(text, set) {
    const low = text.toLowerCase(), out = []; let pos = 0, m;
    WORT.lastIndex = 0;
    while ((m = WORT.exec(low))) {
      if (!set.has(m[0])) continue;
      out.push(text.slice(pos, m.index), h("mark", { class: "rr-mark" }, text.slice(m.index, m.index + m[0].length)));
      pos = m.index + m[0].length;
    }
    out.push(text.slice(pos));
    return out;
  }
  const kurz = (t, n) => (t.length > n ? t.slice(0, n).trimEnd() + " …" : t);
  const zeigeRang = (r) => (r == null ? "kein Rang" : "Platz " + r);

  KL.widgets["rag-suche-vergleich"] = function (root) {
    root.classList.add("w-wid", "rr");
    const ac = new AbortController();
    const Z = { K: null, frage: "", qv: null, ziel: null, id: null, gewicht: 50, k: 5, gruppe: null, S: null, laeuft: false };
    const status = h("p", { class: "w-hinweis rr-status", "aria-live": "polite" }, icon("info"), h("span", null, "Beispielkorpus laden …"));
    const statusText = () => status.lastChild;
    const eingabe = h("input", { type: "text", maxlength: "300", placeholder: "Stelle eine Frage an den Korpus", "aria-label": "Deine Frage", autocomplete: "off" });
    const knopf = h("button", { type: "submit", class: "btn primary" }, sym("suche"), "Suchen");
    const form = h("form", { class: "rr-form-zeile", onsubmit: (e) => { e.preventDefault(); frageStellen(eingabe.value); } }, eingabe, knopf);
    const beispiele = h("div", { class: "zeile rr-vorschlaege rr-beispiele", role: "group", "aria-label": "Beispielfragen" });
    const gw = regler("Gewicht", 0, 100, 10, Z.gewicht, (v) => "Stichwort " + (100 - v) + " : Vektor " + v, (v) => { Z.gewicht = v; neuRechnen(); });
    const kr = regler("Trefferzahl k", 1, 10, 1, Z.k, (v) => String(v), (v) => { Z.k = v; zeichne(); erklaere(); });
    const filter = chipGruppe([["", "Alle Gruppen"]], "", (id) => { Z.gruppe = id || null; neuRechnen(); }, "Filter auf eine Gruppe");
    const spalten = h("div", { class: "rr-spalten" });
    const live = liveBlock("Live-Erklärung");
    root.append(status, form, beispiele, KL.gruppe("Suche einstellen", [gw.el, kr.el, KL.zeile("Filter", filter.el, null, true)], { klasse: "rr-regler" }), spalten, h("div", { class: "rr-abschnitt" }, live.el));

    const SP = [
      ["stichwort", "Stichwort (BM25)", "Zählt, welche Wörter der Frage im Absatz vorkommen. Seltene Wörter wiegen mehr."],
      ["vektor", "Vektor", "Vergleicht den Sinn über die Zahlen des Modells, mit dem Kosinus."],
      ["hybrid", "Hybrid", "Mischt beide Ranglisten: je besser der Platz, desto mehr Punkte."],
    ];
    async function frageStellen(text) {
      text = (text || "").trim();
      if (!text || Z.laeuft) return;
      const bek = Z.K.fragen.find((f) => f.frage.toLowerCase() === text.toLowerCase());
      if (bek) { waehleBeispiel(bek); return; }
      Z.laeuft = true; knopf.disabled = true; statusText().textContent = "Der Jetson bettet deine Frage ein …";
      try {
        const d = await api("/api/embed", { texte: [text] }, ac.signal);
        Z.frage = text; Z.qv = d.vektoren[0]; Z.ziel = null; Z.id = null;
        statusText().textContent = "Deine Frage ist eingebettet (" + zeitText(d.ms) + "). Für freie Fragen gibt es keinen Haken, denn die richtige Stelle kenne ich nicht.";
        markiereBeispiel(); neuRechnen();
      } catch (e) {
        if (e.name !== "AbortError") statusText().textContent = e.message + " Die Beispielfragen funktionieren auch ohne Jetson.";
      } finally { Z.laeuft = false; knopf.disabled = false; }
    }
    function waehleBeispiel(f) {
      Z.frage = f.frage; Z.qv = f.vektor; Z.ziel = f.ziel; Z.id = f.id; eingabe.value = f.frage;
      markiereBeispiel(); neuRechnen();
    }
    function markiereBeispiel() { for (const bt of beispiele.querySelectorAll("button")) bt.setAttribute("aria-pressed", bt.dataset.id === Z.id ? "true" : "false"); }
    function neuRechnen() {
      if (!Z.qv) { zeichne(); return; }
      Z.S = suche(Z.K, Z.frage, Z.qv, { gewicht: Z.gewicht / 100, gruppe: Z.gruppe });
      zeichne(); erklaere();
    }
    function karte(z, art, k) {
      const a = Z.K.absaetze[z.i], S = Z.S;
      const istZiel = Z.ziel && Z.ziel.includes(z.i);
      const kopf = h("div", { class: "rr-karte-kopf" }, h("span", { class: "rr-rang" }, String(z[METHODEN[art]])), h("span", { class: "rr-grp" }, a.gruppe),
        h("span", { class: "mono rr-wert" }, art === "stichwort" ? de(z.bm25, 2) : art === "vektor" ? de(z.cos, 3) : de(z.hyb, 4)));
      let text, detail;
      if (art === "stichwort") {
        text = markiert(a.text, new Set(S.frageWoerter));
        detail = h("div", { class: "rr-detail" }, z.det.map((d) => h("span", { class: "rr-pille", title: "Termhäufigkeit " + d.tf + ", in " + d.df + " von " + Z.K.absaetze.length + " Absätzen, Seltenheit " + de(d.idf, 2) }, d.wort + " · " + d.tf + "× · Seltenheit " + de(d.idf, 1))));
      } else if (art === "vektor") {
        text = a.text;
        detail = h("div", { class: "rr-detail" }, h("span", { class: "rr-nb-bar", "aria-hidden": "true" }, h("i", { style: "width:" + Math.round(klemme(z.cos, 0, 1) * 100) + "%" })), h("span", { class: "w-leise" }, "Kosinus " + de(z.cos, 3)));
      } else {
        text = a.text;
        const dV = z.rangV != null && z.rangH < z.rangV, dS = z.rangV != null && z.rangH > z.rangV;
        detail = h("div", { class: "rr-detail rr-rechnung" },
          h("span", null, "Stichwort " + zeigeRang(z.rangS) + ": " + de(z.teilS, 4)), h("span", null, "+ Vektor " + zeigeRang(z.rangV) + ": " + de(z.teilV, 4)),
          h("span", { class: "mono" }, "= " + de(z.hyb, 4)),
          (dV || dS) ? h("span", { class: "rr-tag " + (dV ? "ok" : "") }, sym(dV ? "hoch" : "runter"), (dV ? "über" : "unter") + " dem Vektor-Platz " + z.rangV) : null);
      }
      const li = h("li", { class: "rr-karte" + (istZiel ? " ziel" : ""), tabindex: "0", dataset: { idx: z.i }, "aria-label": "Platz " + z[METHODEN[art]] + (istZiel ? ", richtige Stelle" : "") + ": " + a.text },
        kopf, h("p", { class: "rr-karte-text" }, text), detail, istZiel ? h("span", { class: "rr-haken" }, icon("check"), "richtige Stelle") : null);
      const an = () => { for (const e of spalten.querySelectorAll('[data-idx="' + z.i + '"]')) e.classList.add("rr-hl"); };
      const aus = () => { for (const e of spalten.querySelectorAll(".rr-hl")) e.classList.remove("rr-hl"); };
      li.addEventListener("pointerenter", an); li.addEventListener("pointerleave", aus); li.addEventListener("focus", an); li.addEventListener("blur", aus);
      return li;
    }
    function zeichne() {
      spalten.replaceChildren();
      for (const [art, name, text] of SP) {
        const spalte = h("section", { class: "rr-spalte", "aria-label": name });
        spalte.append(h("h3", null, name), h("p", { class: "w-leise rr-spalten-text" }, text));
        if (!Z.S) { spalte.append(h("p", { class: "w-leise rr-leer" }, "Wähle eine Frage.")); spalten.append(spalte); continue; }
        const feld = METHODEN[art], reihe = reihenfolge(Z.S, feld);
        const ol = h("ol", { class: "rr-karten" }, reihe.slice(0, Z.k).map((z) => karte(z, art, Z.k)));
        if (!reihe.length) ol.append(h("li", { class: "rr-leer" }, "Kein Treffer: Kein Wort der Frage kommt in einem Absatz vor."));
        spalte.append(ol);
        if (Z.ziel) {
          const gefiltert = Z.ziel.every((i) => !Z.S.zeilen[i].erlaubt);
          const r = besterRang(Z.S, Z.ziel, feld);
          if (gefiltert) spalte.append(h("p", { class: "rr-fehlt" }, sym("x"), "Der Filter schließt die richtige Stelle aus."));
          else if (r == null) spalte.append(h("p", { class: "rr-fehlt" }, sym("x"), "Die richtige Stelle hat keinen Rang, weil kein Wort der Frage in ihr steht."));
          else if (r > Z.k) spalte.append(h("p", { class: "rr-fehlt" }, sym("x"), "Die richtige Stelle liegt auf Platz " + r + ", außerhalb der ersten " + Z.k + "."));
        }
        spalten.append(spalte);
      }
    }
    function erklaere() {
      const S = Z.S, t = [];
      const fw = S.frageWoerter;
      t.push("Gezählt werden ", fw.length ? b(nenne(fw)) : b("kein Wort"), " (Füllwörter wie „wo“ oder „ich“ bleiben draußen). ");
      const vorn = (feld) => { const r = reihenfolge(S, feld)[0]; return r ? r : null; };
      if (Z.ziel && Z.ziel.every((i) => !S.zeilen[i].erlaubt)) { t.push("Der Filter schließt die richtige Stelle aus, deshalb kann keine Methode sie finden."); live.setze(...t.flat()); return; }
      if (Z.ziel) {
        const rS = besterRang(S, Z.ziel, "rangS"), rV = besterRang(S, Z.ziel, "rangV"), rH = besterRang(S, Z.ziel, "rangH");
        const zi = Z.ziel.slice().sort((x, y) => (S.zeilen[x].rangH || 99) - (S.zeilen[y].rangH || 99))[0], zz = S.zeilen[zi];
        const vS = vorn("rangS"), vV = vorn("rangV");
        if (rS != null) t.push("Das Stichwort findet die richtige Stelle auf ", b("Platz " + rS), " über " + nenne(zz.det.map((d) => d.wort)) + ". ");
        else t.push("Das Stichwort findet die richtige Stelle ", b("nicht"), ": Kein Wort der Frage kommt in ihr vor (Beugung und Synonyme erkennt es nicht). ",
          vS ? ["Vorn steht stattdessen „" + kurz(Z.K.absaetze[vS.i].text, 50) + "“, weil dort " + nenne(vS.det.map((d) => d.wort)) + " vorkommt. "] : "Es gibt überhaupt keinen Treffer. ");
        t.push("Der Vektor setzt sie auf ", b("Platz " + rV), " (Kosinus " + de(zz.cos, 2) + ")");
        if (rV > 1 && vV) t.push(", vorn steht „" + kurz(Z.K.absaetze[vV.i].text, 50) + "“ mit " + de(vV.cos, 2));
        t.push(". ");
        t.push("In der Mischung ergibt das " + de(zz.teilS, 4) + " + " + de(zz.teilV, 4) + " = ", b(de(zz.hyb, 4)), ", also ", b("Platz " + rH), ". ");
        if (rS === 1 && rV !== 1 && rH === 1) t.push("Hier rettet das Stichwort die Suche, der Vektor allein hätte danebengelegen.");
        else if (rS !== 1 && rV === 1 && rH === 1) t.push("Hier trägt der Vektor die Suche, das Stichwort allein hätte versagt.");
        else if (rS === 1 && rV === 1) t.push("Hier finden beide die Stelle auf Platz 1.");
        else if (rH > 1) t.push("Auch die Mischung bringt sie nicht nach vorn. Dafür gibt es das Nachsortieren.");
        else t.push("Die Mischung stellt sie nach vorn.");
      } else {
        const k = Z.k, topS = reihenfolge(S, "rangS").slice(0, k).map((z) => z.i), topV = reihenfolge(S, "rangV").slice(0, k).map((z) => z.i), topH = reihenfolge(S, "rangH").slice(0, k).map((z) => z.i);
        const beide = topS.filter((i) => topV.includes(i)).length;
        t.push("Von den ersten " + k + " Treffern stehen ", b(beide), " in beiden Listen, Stichwort und Vektor ordnen also verschieden. Die Hybridliste übernimmt " + topH.filter((i) => topS.includes(i)).length + " aus dem Stichwort und " + topH.filter((i) => topV.includes(i)).length + " aus dem Vektor.");
      }
      live.setze(...t.flat());
    }
    korpus().then((K) => {
      if (ac.signal.aborted) return;
      Z.K = K;
      for (const g of K.gruppenAbsaetze) { const bt = h("button", { type: "button", class: "chip", "aria-pressed": "false", onclick: () => { filter.setze(g); Z.gruppe = g; neuRechnen(); } }, g); filter.knoepfe.set(g, bt); filter.el.append(bt); }
      for (const f of K.fragen) beispiele.append(h("button", { type: "button", class: "chip", "aria-pressed": "false", dataset: { id: f.id }, onclick: () => waehleBeispiel(f) }, f.frage));
      statusText().textContent = "Der Korpus hat " + K.absaetze.length + " erfundene Absätze. Wähle eine Frage oder schreibe eine eigene (dafür braucht es den Jetson).";
      const start = K.fragen.find((f) => f.id === "auto") || K.fragen[0];
      waehleBeispiel(start);
    }).catch(() => { statusText().textContent = "Die Beispieldaten konnten nicht geladen werden."; });
    return { destroy() { ac.abort(); live.stop(); } };
  };

  /* ============================================================ 4. Rerank-Labor */
  const HINWEIS_RERANK = "Bewertet wird mit einem kleinen Sprachmodell (llama3.2:3b), nicht mit einem eigens trainierten Cross-Encoder. Die Werte können schwanken und liegen nicht immer richtig.";

  KL.widgets["rag-rerank-labor"] = function (root) {
    root.classList.add("w-wid", "rr");
    const ac = new AbortController();
    const Z = { K: null, f: null, methode: "hybrid", n: 10, S: null, kand: [], scores: new Map(), vorher: null, laeuft: false, zufall: false, quelle: null, laeufe: 0, gesamtMs: 0, ursprung: new Map() };
    const status = h("p", { class: "w-hinweis rr-status", "aria-live": "polite" }, icon("info"), h("span", null, "Beispielkorpus laden …"));
    const statusText = () => status.lastChild;
    const auswahl = h("select", { class: "rr-select", "aria-label": "Frage", onchange: () => waehle(auswahl.value) });
    const meth = chipGruppe([["hybrid", "Erste Suche: Hybrid"], ["vektor", "Erste Suche: Vektor"]], Z.methode, (id) => { Z.methode = id; neuAufbauen(); }, "Erste Suche");
    const nr = regler("Kandidaten", 3, 10, 1, Z.n, (v) => String(v), (v) => { Z.n = v; neuAufbauen(); });
    const zufall = schalter("Zufall zulassen (Temperatur 0,7)", false, (an) => { Z.zufall = an; });
    const knopf = h("button", { type: "button", class: "btn primary", onclick: () => lauf(false) }, sym("hoch"), "Nachsortieren");
    const nochmal = h("button", { type: "button", class: "btn", disabled: true, onclick: () => lauf(true) }, sym("refresh"), "Noch einmal bewerten");
    const balken = h("div", { class: "ladebar", hidden: true }, h("i"));
    const fortschritt = h("p", { class: "ladetxt", "aria-live": "polite" });
    const liste = h("ol", { class: "rr-rerank", "aria-label": "Kandidaten der ersten Suche" });
    const summe = h("p", { class: "rr-summe", "aria-live": "polite" });
    const live = liveBlock("Live-Erklärung");
    const hin = hinweis(HINWEIS_RERANK);
    root.append(status,
      KL.gruppe("Nachsortieren", [KL.zeile("Frage", auswahl, "rr-rr-frage"), KL.zeile("Erste Suche", meth.el, null, true), nr.el, zufall.el], { aktion: [knopf, nochmal], aktionKlasse: "rr-aktionen", klasse: "rr-regler" }), balken, fortschritt, liste, summe, hin, h("div", { class: "rr-abschnitt" }, live.el));
    auswahl.id = "rr-rr-frage";

    const vorab = () => (Z.K.rerank_vorab || {})[Z.f.id];
    const zielRang = (reihe) => { const k = reihe.findIndex((c) => Z.f.ziel.includes(c.i)); return k < 0 ? null : k + 1; };
    function waehle(id) {
      Z.f = Z.K.fragen.find((f) => f.id === id); neuAufbauen();
    }
    function neuAufbauen() {
      if (Z.laeuft) return;
      Z.S = suche(Z.K, Z.f.frage, Z.f.vektor, { gewicht: 0.5 });
      const feld = Z.methode === "hybrid" ? "rangH" : "rangV";
      Z.kand = reihenfolge(Z.S, feld).slice(0, Z.n).map((z, k) => ({ i: z.i, rang: k + 1, wert: Z.methode === "hybrid" ? z.hyb : z.cos }));
      Z.scores = new Map(); Z.vorher = null; Z.laeufe = 0; nochmal.disabled = true; summe.textContent = ""; fortschritt.textContent = ""; balken.hidden = true;
      zeichne(false);
      const r = zielRang(Z.kand);
      live.sofort("Hier stehen die ersten ", b(Z.n + " Treffer"), " der " + (Z.methode === "hybrid" ? "Hybridsuche" : "Vektorsuche") + ". ",
        r ? ["Die richtige Stelle steht auf ", b("Platz " + r), ". "] : ["Die richtige Stelle ist ", b("nicht dabei"), ", das Nachsortieren kann sie nicht mehr retten. "],
        "Das Sprachmodell liest Frage und Kandidat zusammen und vergibt 0 bis 10, ein Kandidat nach dem anderen.");
    }
    const sortiert = () => Z.kand.slice().sort((x, y) => {
      const sx = Z.scores.has(x.i) ? Z.scores.get(x.i).score : -1, sy = Z.scores.has(y.i) ? Z.scores.get(y.i).score : -1;
      return (sy - sx) || (x.rang - y.rang);
    });
    function zeile(c, platz, fertig) {
      const a = Z.K.absaetze[c.i], s = Z.scores.get(c.i);
      const istZiel = Z.f.ziel.includes(c.i);
      let wechsel = null;
      if (fertig && s) {
        const d = c.rang - platz;
        wechsel = h("span", { class: "rr-tag " + (d > 0 ? "ok" : d < 0 ? "schlecht" : "") }, d === 0 ? "unverändert" : [sym(d > 0 ? "hoch" : "runter"), "von " + c.rang + " auf " + platz]);
      }
      return h("li", { class: "rr-rrzeile" + (istZiel ? " ziel" : ""), dataset: { idx: c.i }, "aria-label": "Platz " + platz + (istZiel ? ", richtige Stelle" : "") },
        h("span", { class: "rr-rang" }, String(platz)),
        h("div", { class: "rr-rr-mitte" }, h("p", { class: "rr-karte-text" }, a.text),
          h("div", { class: "rr-detail" }, h("span", { class: "rr-pille" }, "erste Suche: Platz " + c.rang + ", " + (Z.methode === "hybrid" ? de(c.wert, 4) : "Kosinus " + de(c.wert, 3))),
            s ? h("span", { class: "rr-pille" }, sym("uhr"), zeitText(s.ms)) : null, wechsel, istZiel ? h("span", { class: "rr-haken" }, icon("check"), "richtige Stelle") : null)),
        h("div", { class: "rr-score", "aria-label": s ? "Bewertung " + de(s.score, 1) + " von 10" : "noch nicht bewertet" },
          h("span", { class: "mono rr-score-zahl" }, s ? de(s.score, 1) : ""), h("span", { class: "rr-score-bar", "aria-hidden": "true" }, h("i", { style: "width:" + (s ? s.score * 10 : 0) + "%" }))));
    }
    function zeichne(animiert) {
      const alt = new Map();
      if (animiert) for (const li of liste.children) alt.set(li.dataset.idx, li.getBoundingClientRect().top);
      const fertig = Z.scores.size === Z.kand.length && Z.kand.length > 0;
      const reihe = fertig ? sortiert() : Z.kand;
      liste.replaceChildren(...reihe.map((c, k) => zeile(c, k + 1, fertig)));
      if (animiert && !ruhig()) {
        for (const li of liste.children) {
          const v = alt.get(li.dataset.idx); if (v == null) continue;
          const d = v - li.getBoundingClientRect().top;
          if (d) li.animate([{ transform: "translateY(" + d + "px)" }, { transform: "none" }], { duration: 650, easing: "cubic-bezier(.3,.8,.3,1)" });
        }
      }
    }
    async function lauf(wiederholung) {
      if (Z.laeuft) return;
      Z.laeuft = true; knopf.disabled = true; nochmal.disabled = true; nr.input.disabled = true;
      if (wiederholung) Z.vorher = new Map(Z.scores);
      Z.scores = new Map(); zeichne(false);
      balken.hidden = false; balken.firstChild.style.width = "0%";
      const t0 = performance.now(); let quelle = "live"; let modell = "llama3.2:3b";
      try {
        for (let k = 0; k < Z.kand.length; k++) {
          const c = Z.kand[k];
          fortschritt.textContent = "Bewerte Kandidat " + (k + 1) + " von " + Z.kand.length + " …";
          if (quelle === "live") {
            try {
              const d = await api("/api/rerank", { frage: Z.f.frage, kandidaten: [Z.K.absaetze[c.i].text], temperatur: Z.zufall ? 0.7 : 0 }, ac.signal);
              modell = d.modell; Z.scores.set(c.i, { score: d.ergebnisse[0].score, ms: d.ergebnisse[0].ms });
            } catch (e) {
              if (e.name === "AbortError") throw e;
              const v = vorab();
              if (!v) throw e;
              quelle = "vorab"; statusText().textContent = e.message + " Ich nehme die vorab gemessenen Werte.";
              Z.scores = new Map(); k = -1; continue;
            }
          } else {
            const v = vorab();
            if (!v || v.scores[c.i] == null) throw new Error("Für diese Frage gibt es keine vorab gemessenen Werte.");
            Z.scores.set(c.i, { score: v.scores[c.i], ms: v.ms[c.i] });
            await new Promise((r) => setTimeout(r, ruhig() ? 0 : 120));
          }
          balken.firstChild.style.width = Math.round((k + 1) / Z.kand.length * 100) + "%";
          zeichne(false);
        }
        Z.quelle = quelle; Z.laeufe++; Z.gesamtMs = quelle === "live" ? performance.now() - t0 : Array.from(Z.scores.values()).reduce((a, s) => a + s.ms, 0);
        fortschritt.textContent = quelle === "live" ? "Fertig mit " + modell + "." : "Fertig, mit vorab gemessenen Werten von " + modell + ".";
        zeichne(true); abschluss();
        nochmal.disabled = false;
      } catch (e) {
        if (e.name !== "AbortError") { statusText().textContent = e.message; fortschritt.textContent = ""; Z.scores = new Map(); zeichne(false); }
      } finally {
        Z.laeuft = false; knopf.disabled = false; nr.input.disabled = false; balken.hidden = true;
      }
    }
    function abschluss() {
      const ziel = Z.f.ziel, nach = sortiert();
      const r0 = zielRang(Z.kand), r1 = (() => { const k = nach.findIndex((c) => ziel.includes(c.i)); return k < 0 ? null : k + 1; })();
      const mittel = Z.gesamtMs / Z.kand.length;
      const t = [];
      const satz = ["Gesamtzeit " + zeitText(Z.gesamtMs) + " für " + Z.kand.length + " Kandidaten, im Mittel " + zeitText(mittel) + " je Kandidat. "];
      if (r0 != null) satz.push("Ohne Nachsortieren lag die richtige Stelle auf Platz " + r0 + ", jetzt liegt sie auf Platz " + r1 + ". " +
        (r0 > 3 ? "Bei k gleich 3 wäre sie nicht ans Sprachmodell gegangen. " : "Bei k gleich 3 wäre sie noch dabei gewesen. "));
      summe.textContent = satz.join("");
      t.push("Das Modell hat ", b(Z.kand.length + " Durchgänge"), " gebraucht, zusammen ", b(zeitText(Z.gesamtMs)), ". Eine Vektorsuche über denselben Korpus rechnet in wenigen Millisekunden, hier liegt der Preis. ");
      if (r0 == null) t.push("Die richtige Stelle war nicht unter den Kandidaten, da hilft auch das beste Nachsortieren nicht. ");
      else if (r1 < r0) t.push(b("Die richtige Stelle steigt von Platz " + r0 + " auf Platz " + r1 + "."), " ");
      else if (r1 === r0) t.push("Die richtige Stelle bleibt auf Platz " + r1 + ". ");
      else t.push(b("Die richtige Stelle fällt von Platz " + r0 + " auf Platz " + r1 + "."), " Das kleine Modell hat hier danebengelegen. ");
      if (r0 != null && r1 !== 1) {
        const erster = nach[0], sz = Z.scores.get(nach.find((c) => ziel.includes(c.i)).i).score;
        t.push("Die richtige Stelle bekam " + de(sz, 1) + ", Platz 1 bekam " + de(Z.scores.get(erster.i).score, 1) + ". ");
      }
      if (Z.vorher) {
        const geaendert = Z.kand.filter((c) => Z.vorher.get(c.i) && Z.vorher.get(c.i).score !== Z.scores.get(c.i).score);
        t.push(geaendert.length ? [b(geaendert.length + " von " + Z.kand.length + " Werten"), " haben sich gegenüber dem ersten Lauf geändert. Dieselbe Frage kann also verschieden bewertet werden. "]
          : "Alle Werte sind gleich geblieben. Mit Temperatur 0 antwortet das Modell hier gleich, mit Zufall ändern sie sich. ");
      }
      live.setze(...t.flat());
    }
    korpus().then((K) => {
      if (ac.signal.aborted) return;
      Z.K = K;
      const fragen = K.fragen.filter((f) => f.ziel.length);
      for (const f of fragen) auswahl.append(h("option", { value: f.id }, f.frage));
      const start = fragen.find((f) => f.id === "lieferung") || fragen[0]; auswahl.value = start.id;
      statusText().textContent = "Das Nachsortieren läuft live auf dem Jetson. Ist er nicht erreichbar, nehme ich vorab gemessene Werte.";
      waehle(start.id);
    }).catch(() => { statusText().textContent = "Die Beispieldaten konnten nicht geladen werden."; });
    return { destroy() { ac.abort(); live.stop(); } };
  };

  /* ============================================================ 5. Test-Labor */
  KL.widgets["rag-test-labor"] = function (root) {
    root.classList.add("w-wid", "rr");
    const ac = new AbortController();
    const Z = { K: null, methode: "vektor", k: 1, eigene: [], zeilen: [], offen: null, laeuft: false };
    const MAXEIGENE = 6, KS = [1, 3, 5, 10];
    const status = h("p", { class: "w-hinweis rr-status", "aria-live": "polite" }, icon("info"), h("span", null, "Testset laden …"));
    const statusText = () => status.lastChild;
    const meth = chipGruppe([["stichwort", "Stichwort"], ["vektor", "Vektor"], ["hybrid", "Hybrid"]], Z.methode, (id) => { Z.methode = id; zeichne(); }, "Methode");
    const kr = regler("Trefferzahl k", 1, 10, 1, Z.k, (v) => String(v), (v) => { Z.k = v; zeichne(); });
    const kacheln = h("div", { class: "messwerte rr-kennzahlen" });
    const matrix = h("div", { class: "rr-matrix" });
    const tabelle = h("div", { class: "tabelle-wrap" });
    const detail = h("div", { class: "rr-testdetail", "aria-live": "polite" });
    const frageFeld = h("input", { type: "text", maxlength: "300", placeholder: "Eigene Frage", "aria-label": "Eigene Frage", autocomplete: "off" });
    const stelle = h("select", { class: "rr-select", "aria-label": "Fundstelle der eigenen Frage" });
    const addKnopf = h("button", { type: "submit", class: "btn" }, sym("plus"), "Frage hinzufügen");
    const form = h("form", { class: "rr-eigenfrage", onsubmit: (e) => { e.preventDefault(); hinzu(); } },
      KL.gruppe(null, [KL.zeile("Frage", frageFeld), KL.zeile("Fundstelle", stelle)], { aktion: [addKnopf] }));
    const live = liveBlock("Live-Erklärung");
    root.append(status, KL.gruppe("Auswertung", [KL.zeile("Suchmethode", meth.el, null, true), kr.el], { klasse: "rr-regler" }), kacheln, matrix, tabelle, detail,
      h("div", { class: "rr-abschnitt" }, h("p", { class: "w-ueber" }, "Eigene Frage hinzufügen"), form,
        h("p", { class: "w-leise rr-note" }, "Wähle den Absatz, in dem die Antwort steht. Die Frage braucht den Jetson. Ob das Sprachmodell die Antwort danach richtig formuliert, misst dieser Baustein nicht.")),
      h("div", { class: "rr-abschnitt" }, live.el));

    function alle() { return Z.K.fragen.filter((f) => !f.nur_rerank).concat(Z.eigene); }
    function berechne() {
      Z.zeilen = alle().map((f) => {
        const S = suche(Z.K, f.frage, f.vektor, { gewicht: 0.5 });
        const r = {}; for (const m of Object.keys(METHODEN)) r[m] = f.ziel.length ? besterRang(S, f.ziel, METHODEN[m]) : null;
        return { f, S, r, eigen: !!f.eigen };
      });
    }
    const mitAntwort = () => Z.zeilen.filter((x) => x.f.ziel.length);
    const trifft = (x, m, k) => x.r[m] != null && x.r[m] <= k;
    const quote = (m, k) => mitAntwort().filter((x) => trifft(x, m, k)).length;
    const mrr = (m, k) => { const l = mitAntwort(); return l.reduce((s, x) => s + (trifft(x, m, k) ? 1 / x.r[m] : 0), 0) / l.length; };
    const fundstelle = (f) => f.ziel.length ? "Absatz " + nenne(f.ziel.map((i) => String(i + 1))) + ": " + kurz(Z.K.absaetze[f.ziel[0]].text, 46) : "keine im Korpus";

    function zeichne() {
      const m = Z.methode, k = Z.k, l = mitAntwort(), n = l.length, q = quote(m, k);
      const kachel = (w, t) => h("div", { class: "messwert" }, h("b", null, w), t);
      kacheln.replaceChildren(kachel(q + " von " + n, "Treffer in den ersten " + k + " (" + Math.round(q / n * 100) + " Prozent)"), kachel(de(mrr(m, k), 2), "durchschnittlicher Kehrwert des Rangs"), kachel(METHODEN_NAMEN[m], "gewählte Methode"));
      /* Uebersicht: alle Methoden und mehrere k nebeneinander */
      matrix.replaceChildren(h("div", { class: "tabelle-wrap" }, h("table", { class: "vergleich rr-matrixtab" },
        h("caption", null, "Treffer unter den ersten k, von " + n + " Fragen mit Antwort"),
        h("thead", null, h("tr", null, h("th", { scope: "col" }, "Methode"), KS.map((x) => h("th", { scope: "col" }, "k = " + x)))),
        h("tbody", null, Object.keys(METHODEN).map((mm) => h("tr", { class: mm === m ? "aktuell" : "" }, h("th", { scope: "row" }, METHODEN_NAMEN[mm]),
          KS.map((x) => h("td", { class: mm === m && x === k ? "aktuell" : "" }, quote(mm, x) + " von " + n))))))));
      /* Tabelle der Fragen */
      const kopf = h("tr", null, ["Frage", "Fundstelle", "Rang", "unter den ersten " + k].map((t) => h("th", { scope: "col" }, t)));
      const rows = Z.zeilen.map((x, j) => {
        const r = x.r[m], has = x.f.ziel.length;
        let ergebnis;
        if (!has) {
          const top = reihenfolge(x.S, METHODEN[m])[0];
          ergebnis = h("td", { class: "rr-ohne", colspan: "2" }, top ? "Keine Antwort im Korpus. Die Methode liefert trotzdem Platz 1 (" + (m === "stichwort" ? "Wertung " + de(top.bm25, 2) : "Kosinus " + de(top.cos, 2)) + "). Richtig wäre „nichts gefunden“." : "Keine Antwort im Korpus. Die Methode findet nichts, und das ist hier richtig.");
          return h("tr", { class: "rr-zeile-test rr-ohne-zeile" }, h("th", { scope: "row" }, h("button", { type: "button", class: "rr-zeilenknopf", onclick: () => oeffne(j), "aria-expanded": String(Z.offen === j) }, x.f.frage)), h("td", null, fundstelle(x.f)), ergebnis);
        }
        const ok = trifft(x, m, k);
        return h("tr", { class: "rr-zeile-test " + (ok ? "ok" : "schlecht") + (Z.offen === j ? " offen" : "") },
          h("th", { scope: "row" }, h("button", { type: "button", class: "rr-zeilenknopf", onclick: () => oeffne(j), "aria-expanded": String(Z.offen === j) }, x.f.frage, x.eigen ? h("span", { class: "rr-tag" }, "eigene") : null)),
          h("td", null, fundstelle(x.f)),
          h("td", { class: "mono" }, r == null ? "nicht gefunden" : String(r)),
          h("td", { class: "rr-ergebnis" }, ok ? icon("check") : sym("x"), h("span", null, ok ? "ja" : "nein")));
      });
      tabelle.replaceChildren(h("table", { class: "vergleich rr-testtabelle" }, h("caption", null, "Testfragen mit der bekannten Fundstelle (" + METHODEN_NAMEN[m] + ")"), h("thead", null, kopf), h("tbody", null, rows)));
      zeichneDetail(); erklaere();
    }
    function oeffne(j) { Z.offen = Z.offen === j ? null : j; zeichne(); }
    function zeichneDetail() {
      if (Z.offen == null) { detail.replaceChildren(); return; }
      const x = Z.zeilen[Z.offen], m = Z.methode, k = Z.k, r = x.r[m];
      const reihe = reihenfolge(x.S, METHODEN[m]);
      let grund;
      if (!x.f.ziel.length) grund = "Im Korpus steht keine Antwort. Eine Vektorsuche liefert trotzdem immer Treffer, denn sie sortiert nur nach Nähe. Ein Schwellenwert oder ein Stichwortfilter kann „nichts gefunden“ melden.";
      else if (r == null) grund = m === "stichwort" ? "Stichwort: keine gemeinsamen Wörter. Gezählt wurden " + (x.S.frageWoerter.length ? nenne(x.S.frageWoerter) : "keine Wörter") + ", in der Fundstelle kommt keines davon vor." : "Die Fundstelle hat keinen Rang.";
      else if (r > k) grund = "Die Fundstelle steht auf Platz " + r + " und damit außerhalb der ersten " + k + ". Davor stehen " + nenne(reihe.slice(0, Math.min(3, r - 1)).map((z) => "Absatz " + (z.i + 1))) + (r > 4 ? " und weitere" : "") + ".";
      else grund = "Die Fundstelle steht auf Platz " + r + ", also unter den ersten " + k + ".";
      detail.replaceChildren(h("div", { class: "flaeche rr-detail-box" }, h("p", { class: "w-ueber" }, "Treffer zu „" + x.f.frage + "“ (" + METHODEN_NAMEN[m] + ")"),
        h("ol", { class: "rr-nachbarn" }, reihe.slice(0, 5).map((z, i) => h("li", { class: "rr-nb" + (x.f.ziel.includes(z.i) ? " ziel" : "") }, h("span", { class: "rr-rang" }, String(i + 1)), h("span", { class: "rr-nb-text" }, kurz(Z.K.absaetze[z.i].text, 90)),
          h("span", { class: "mono rr-nb-wert" }, m === "stichwort" ? de(z.bm25, 2) : m === "vektor" ? de(z.cos, 2) : de(z.hyb, 4)), x.f.ziel.includes(z.i) ? h("span", { class: "rr-tag ok" }, "Fundstelle") : null))),
        h("p", { class: "rr-detailgrund" }, grund)));
    }
    function erklaere() {
      const m = Z.methode, k = Z.k, l = mitAntwort(), n = l.length, q = quote(m, k);
      const t = ["Mit ", b(METHODEN_NAMEN[m]), " liegt die richtige Stelle bei ", b(q + " von " + n + " Fragen"), " unter den ersten " + k + ". "];
      t.push("Bei " + METHODEN_NAMEN[m] + " steigt die Quote von " + quote(m, 1) + " bei k gleich 1 auf " + quote(m, 10) + " bei k gleich 10. ");
      const bestK1 = Object.keys(METHODEN).reduce((a, c) => (quote(c, 1) > quote(a, 1) ? c : a));
      t.push("Bei k gleich 1 liegt " + METHODEN_NAMEN[bestK1] + " vorn (" + quote(bestK1, 1) + " von " + n + "), Stichwort erreicht " + quote("stichwort", 1) + ", Vektor " + quote("vektor", 1) + ", Hybrid " + quote("hybrid", 1) + ". ");
      t.push("Der Kehrwert des Rangs belohnt Plätze weit vorn: Platz 1 zählt 1, Platz 2 zählt 0,5, Platz 4 zählt 0,25, alles hinter k zählt 0. Dein Wert: " + de(mrr(m, k), 2) + ".");
      live.setze(...t.flat());
    }
    async function hinzu() {
      const text = frageFeld.value.trim();
      if (!text || Z.laeuft) return;
      if (Z.eigene.length >= MAXEIGENE) { statusText().textContent = "Mehr als " + MAXEIGENE + " eigene Fragen sind es nicht."; return; }
      Z.laeuft = true; addKnopf.disabled = true; statusText().textContent = "Der Jetson bettet deine Frage ein …";
      try {
        const d = await api("/api/embed", { texte: [text] }, ac.signal);
        Z.eigene.push({ id: "eigen" + (Z.eigene.length + 1), frage: text, ziel: [Number(stelle.value)], vektor: d.vektoren[0], eigen: true });
        frageFeld.value = ""; statusText().textContent = "Deine Frage ist im Test. Die Zahlen sind neu berechnet.";
        berechne(); zeichne();
      } catch (e) {
        if (e.name !== "AbortError") statusText().textContent = e.message;
      } finally { Z.laeuft = false; addKnopf.disabled = false; }
    }
    korpus().then((K) => {
      if (ac.signal.aborted) return;
      Z.K = K;
      K.absaetze.forEach((a, i) => stelle.append(h("option", { value: String(i) }, "Absatz " + (i + 1) + ": " + kurz(a.text, 52))));
      statusText().textContent = "Das Testset hat " + K.fragen.filter((f) => !f.nur_rerank && f.ziel.length).length + " Fragen mit Antwort und " + K.fragen.filter((f) => !f.ziel.length).length + " ohne. Alles rechnet im Browser.";
      berechne(); zeichne();
    }).catch(() => { statusText().textContent = "Die Beispieldaten konnten nicht geladen werden."; });
    return { destroy() { ac.abort(); live.stop(); } };
  };
})();
