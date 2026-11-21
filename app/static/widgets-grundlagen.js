/* KI-Labor: Lernbausteine des Strangs Grundlagen.
   Vertrag siehe app.js: KL.widgets.<name> = function (root, seite) { ...; return { destroy() {} } }
   Bausteine: netz-spielplatz, gradient-abstieg, konfusionsmatrix, datenqualitaet.
   Alles rechnet im Browser, ohne Bibliothek und ohne Server. Zufall kommt aus einem kleinen Generator mit
   festem Startwert, damit jede Einstellung dasselbe Ergebnis liefert. Die reine Rechnung steht in KL.glKern
   (Tests rufen sie direkt auf). Texte aus Berechnungen gelangen nur per Text in die Seite. */
(function () {
  "use strict";
  const KL = window.KL;
  const { h } = KL;

  /* ============================================================ Rechenkern (ohne DOM) */
  const de = (n, d = 1) => Number(n).toFixed(d).replace(".", ",");
  const ganz = (n) => Math.round(n).toLocaleString("de-DE");
  const klemme = (v, a, b) => Math.min(b, Math.max(a, v));
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gaussVon(r) {
    return () => {
      let u = 0, v = 0;
      while (u === 0) u = r();
      while (v === 0) v = r();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
  }

  /* ---------- Netz: vollverbundene Schichten, Rueckpropagierung, Gradientenabstieg mit Paeckchen und Impuls */
  const AKT = {
    tanh: { f: (z) => Math.tanh(z), d: (z, a) => 1 - a * a },
    relu: { f: (z) => (z > 0 ? z : 0), d: (z) => (z > 0 ? 1 : 0) },
    sigmoid: { f: (z) => 1 / (1 + Math.exp(-z)), d: (z, a) => a * (1 - a) },
  };
  function datensatz(name, seed) {
    const r = rng(seed), g = gaussVon(r), p = [], N = 100;
    if (name === "wolken") {
      for (let k = 0; k < 2; k++) for (let i = 0; i < N; i++) {
        const m = k ? 0.5 : -0.5;
        p.push({ x: klemme(m + 0.25 * g(), -1, 1), y: klemme(m + 0.25 * g(), -1, 1), k });
      }
    } else if (name === "kreis") {
      for (let i = 0; i < N; i++) { const rr = 0.4 * Math.sqrt(r()), w = 2 * Math.PI * r(); p.push({ x: rr * Math.cos(w), y: rr * Math.sin(w), k: 0 }); }
      for (let i = 0; i < N; i++) { const rr = 0.6 + 0.3 * r(), w = 2 * Math.PI * r(); p.push({ x: rr * Math.cos(w), y: rr * Math.sin(w), k: 1 }); }
    } else if (name === "xor") {
      while (p.length < 2 * N) {
        const x = (2 * r() - 1) * 0.95, y = (2 * r() - 1) * 0.95;
        if (Math.abs(x) < 0.1 || Math.abs(y) < 0.1) continue;
        p.push({ x, y, k: x * y > 0 ? 0 : 1 });
      }
    } else {
      for (let k = 0; k < 2; k++) for (let i = 0; i < N; i++) {
        const t = 0.12 + 0.88 * (i / (N - 1)), w = t * 3 * Math.PI + k * Math.PI, rr = t * 0.92 + 0.03 * g();
        p.push({ x: rr * Math.cos(w), y: rr * Math.sin(w), k });
      }
    }
    for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
    const train = [], test = [], zaehl = [0, 0];
    for (const q of p) (zaehl[q.k]++ % 5 === 0 ? test : train).push(q);
    return { train, test };
  }
  function netzNeu(gr, akt, seed) {
    const r = rng(seed), g = gaussVon(r), L = gr.length - 1;
    const W = [], B = [], vW = [], vB = [], gW = [], gB = [];
    for (let l = 0; l < L; l++) {
      const ni = gr[l], no = gr[l + 1], relu = akt === "relu" && l < L - 1;
      const sd = relu ? Math.sqrt(2 / ni) : Math.sqrt(2 / (ni + no));
      const w = new Float64Array(ni * no);
      for (let i = 0; i < w.length; i++) w[i] = sd * g();
      W.push(w); B.push(new Float64Array(no).fill(relu ? 0.1 : 0));
      vW.push(new Float64Array(ni * no)); vB.push(new Float64Array(no));
      gW.push(new Float64Array(ni * no)); gB.push(new Float64Array(no));
    }
    const mk = () => gr.map((n) => new Float64Array(n));
    return { gr, akt, L, W, B, vW, vB, gW, gB, z: mk(), a: mk(), d: mk(), schritt: 0 };
  }
  function vor(n, x, y) {
    const { L, W, B, z, a, gr } = n, f = AKT[n.akt].f;
    a[0][0] = x; a[0][1] = y;
    for (let l = 0; l < L; l++) {
      const ni = gr[l], no = gr[l + 1], w = W[l], b = B[l], zl = z[l + 1], al = a[l + 1], ap = a[l];
      for (let o = 0; o < no; o++) {
        let s = b[o];
        for (let i = 0; i < ni; i++) s += w[o * ni + i] * ap[i];
        zl[o] = s; al[o] = l < L - 1 ? f(s) : s;
      }
    }
    return 1 / (1 + Math.exp(-a[L][0]));
  }
  function schritt(n, batch, lr, mu) {
    const { L, W, B, vW, vB, gW, gB, z, a, d, gr } = n, df = AKT[n.akt].d;
    for (let l = 0; l < L; l++) { gW[l].fill(0); gB[l].fill(0); }
    for (const q of batch) {
      const p = vor(n, q.x, q.y);
      d[L][0] = p - q.k;
      for (let l = L - 1; l >= 0; l--) {
        const ni = gr[l], no = gr[l + 1], w = W[l], dl = d[l + 1], ap = a[l], gw = gW[l], gb = gB[l];
        for (let o = 0; o < no; o++) {
          const dd = dl[o];
          gb[o] += dd;
          for (let i = 0; i < ni; i++) gw[o * ni + i] += dd * ap[i];
        }
        if (l > 0) {
          const dv = d[l];
          for (let i = 0; i < ni; i++) {
            let s = 0;
            for (let o = 0; o < no; o++) s += w[o * ni + i] * dl[o];
            dv[i] = s * df(z[l][i], a[l][i]);
          }
        }
      }
    }
    const inv = 1 / batch.length;
    for (let l = 0; l < L; l++) {
      const w = W[l], g = gW[l], v = vW[l];
      for (let i = 0; i < w.length; i++) { v[i] = mu * v[i] - lr * g[i] * inv; w[i] += v[i]; }
      const b = B[l], gb = gB[l], vb = vB[l];
      for (let i = 0; i < b.length; i++) { vb[i] = mu * vb[i] - lr * gb[i] * inv; b[i] += vb[i]; }
    }
    n.schritt++;
  }
  function bewerte(n, menge) {
    let l = 0, ok = 0;
    for (const q of menge) {
      const p = klemme(vor(n, q.x, q.y), 1e-9, 1 - 1e-9);
      l += -(q.k ? Math.log(p) : Math.log(1 - p));
      if ((p > 0.5 ? 1 : 0) === q.k) ok++;
    }
    return { verlust: l / menge.length, richtig: ok, n: menge.length };
  }
  /* trainiert ohne Oberflaeche (fuer Tests und Voreinstellungen) */
  function trainiere(ds, hid, nper, akt, lr, schritte, seed) {
    const daten = datensatz(ds, 7), n = netzNeu([2, ...new Array(hid).fill(nper), 1], akt, seed), r = rng(seed + 99);
    for (let s = 0; s < schritte; s++) {
      const b = [];
      for (let i = 0; i < 20; i++) b.push(daten.train[Math.floor(r() * daten.train.length)]);
      schritt(n, b, lr, 0.9);
    }
    return { train: bewerte(n, daten.train), test: bewerte(n, daten.test), netz: n };
  }

  /* ---------- Landschaften fuer den Gradientenabstieg (Ableitungen als Formeln) */
  function brunnen(liste) {
    return {
      f: (p) => { let s = 0.015 * (p[0] * p[0] + p[1] * p[1]); for (const [cx, cy, a, sg] of liste) s -= a * Math.exp(-((p[0] - cx) ** 2 + (p[1] - cy) ** 2) / (2 * sg * sg)); return s; },
      g: (p) => { let gx = 0.03 * p[0], gy = 0.03 * p[1]; for (const [cx, cy, a, sg] of liste) { const e = a * Math.exp(-((p[0] - cx) ** 2 + (p[1] - cy) ** 2) / (2 * sg * sg)) / (sg * sg); gx += e * (p[0] - cx); gy += e * (p[1] - cy); } return [gx, gy]; },
    };
  }
  const TAL = brunnen([[-2.8, -1.2, 3, 1.0], [2.8, 1.5, 2, 0.9], [0.3, -2.8, 1.6, 0.8]]);
  const SCHRAEG = { c: Math.cos(0.5), s: Math.sin(0.5) };
  const LS_DEF = {
    mulde: { name: "Eine Mulde", dim: 1, a: -2, b: 6, f: (p) => (p[0] - 2) ** 2, g: (p) => [2 * (p[0] - 2)], start: [-1], seeds: [[2]], lrV: 63 },
    zwei: {
      name: "Zwei Mulden", dim: 1, a: -3.6, b: 3.6,
      f: (p) => 0.1 * p[0] ** 4 - 0.8 * p[0] * p[0] + 0.3 * p[0] + 1.5,
      g: (p) => [0.4 * p[0] ** 3 - 1.6 * p[0] + 0.3], start: [2.6], seeds: [[-2], [2]], lrV: 48,
    },
    schlucht: {
      name: "Steile Schlucht", dim: 2, xa: -6.4, xb: 6.4, ya: -3.6, yb: 3.6,
      f: (p) => { const u = SCHRAEG.c * p[0] + SCHRAEG.s * p[1], v = -SCHRAEG.s * p[0] + SCHRAEG.c * p[1]; return 0.15 * u * u + 6 * v * v; },
      g: (p) => {
        const u = SCHRAEG.c * p[0] + SCHRAEG.s * p[1], v = -SCHRAEG.s * p[0] + SCHRAEG.c * p[1];
        return [0.3 * u * SCHRAEG.c - 12 * v * SCHRAEG.s, 0.3 * u * SCHRAEG.s + 12 * v * SCHRAEG.c];
      },
      start: [-5, -1.5], seeds: [[0, 0]], lrV: 37,
    },
    taeler: { name: "Mehrere Täler", dim: 2, xa: -6.4, xb: 6.4, ya: -3.6, yb: 3.6, f: TAL.f, g: TAL.g, start: [0.6, 2.6], seeds: [[-2.8, -1.2], [2.8, 1.5], [0.3, -2.8]], lrV: 71 },
  };
  function landschaft(id) {
    const L = Object.assign({ id }, LS_DEF[id]);
    L.minima = L.seeds.map((s) => {
      let p = s.slice();
      for (let i = 0; i < 600; i++) { const g = L.g(p); p = p.map((x, k) => x - 0.05 * g[k]); }
      return p;
    });
    const fm = L.minima.map((p) => L.f(p));
    L.fmin = Math.min(...fm);
    L.verlust = (p) => L.f(p) - L.fmin;
    L.istGlobal = (p) => L.verlust(p) < 0.05;
    L.kruemmung = (p) => {
      const e = 1e-3;
      if (L.dim === 1) return Math.abs(L.g([p[0] + e])[0] - L.g([p[0] - e])[0]) / (2 * e);
      const gx1 = L.g([p[0] + e, p[1]]), gx0 = L.g([p[0] - e, p[1]]), gy1 = L.g([p[0], p[1] + e]), gy0 = L.g([p[0], p[1] - e]);
      const a = (gx1[0] - gx0[0]) / (2 * e), d = (gy1[1] - gy0[1]) / (2 * e), b = ((gx1[1] - gx0[1]) + (gy1[0] - gy0[0])) / (4 * e);
      return Math.abs((a + d) / 2) + Math.sqrt(((a - d) / 2) ** 2 + b * b);
    };
    return L;
  }
  /* ein Schritt Gradientenabstieg mit Impuls; Zustand z = {p, v, schritt} */
  function abstieg(L, z, lr, mu) {
    const g = L.g(z.p), v = z.v.map((x, k) => mu * x - lr * g[k]);
    z.v = v; z.p = z.p.map((x, k) => x + v[k]); z.schritt++;
    return z;
  }

  /* ---------- Konfusionsmatrix: Szenarien mit fest erzeugter Verteilung der Modellwerte */
  const SZENARIEN = {
    spam: {
      name: "Spamfilter", seed: 101, anteil: 30, mPos: 0.72, mNeg: 0.3, sd: 0.17, einzeln: false, schwer: "fp",
      gesamt: "Mails", pos: "Spam", neg: "gute Mail", posPl: "Spam-Mails", negPl: "guten Mails",
      fn: (n, p) => n + " von " + p + " Spam-Mails landen im Posteingang",
      fp: (n, p) => n + " von " + p + " guten Mails verschwinden im Spamordner",
      fnFolge: "Das nervt, ist aber meist harmlos.",
      fpFolge: "Eine gute Mail im Spamordner kann eine Rechnung oder Bewerbung verstecken.",
      alarm: "Spamordner", kein: "Posteingang",
    },
    schimmel: {
      name: "Schimmelprüfung", seed: 202, anteil: 4, mPos: 0.7, mNeg: 0.3, sd: 0.15, einzeln: true, schwer: "fn",
      gesamt: "Bauteile", pos: "befallen", neg: "gesund", posPl: "befallenen Teilen", negPl: "gesunden Teilen",
      fn: (n, p) => n + " von " + p + " befallenen Teilen gehen durch",
      fp: (n, p) => n + " von " + p + " gesunden Teilen werden unnötig aussortiert",
      fnFolge: "Ein durchgerutschtes befallenes Teil kann später Schäden und Rückrufe auslösen.",
      fpFolge: "Unnötig aussortierte Teile kosten Material und Zeit.",
      alarm: "Ausschuss", kein: "Freigabe",
    },
    rauch: {
      name: "Rauchmelder", seed: 303, anteil: 1, mPos: 0.72, mNeg: 0.28, sd: 0.15, einzeln: true, schwer: "fn",
      gesamt: "Messungen", pos: "Rauch", neg: "ruhig", posPl: "Bränden", negPl: "ruhigen Messungen",
      fn: (n, p) => n + " von " + p + " Bränden bleiben unbemerkt",
      fp: (n, p) => n + " von " + p + " ruhigen Messungen lösen Fehlalarm aus",
      fnFolge: "Ein unbemerkter Brand ist der gefährlichste Fehler.",
      fpFolge: "Viele Fehlalarme führen dazu, dass Menschen den Melder abschalten.",
      alarm: "Alarm", kein: "Ruhe",
    },
    sicherheit: {
      name: "Sicherheitskontrolle", seed: 404, anteil: 2, mPos: 0.68, mNeg: 0.3, sd: 0.15, einzeln: true, schwer: "fn",
      gesamt: "Gepäckstücke", pos: "verboten", neg: "harmlos", posPl: "verbotenen Gegenständen", negPl: "harmlosen Gepäckstücken",
      fn: (n, p) => n + " von " + p + " verbotenen Gegenständen werden nicht gefunden",
      fp: (n, p) => n + " von " + p + " harmlosen Gepäckstücken werden von Hand geprüft",
      fnFolge: "Ein übersehener Gegenstand ist ein Sicherheitsrisiko.",
      fpFolge: "Jede unnötige Handkontrolle verlängert die Schlange.",
      alarm: "Handkontrolle", kein: "Durchgang",
    },
  };
  const KM_N = 1000, KM_BINS = 20;
  function werte(sz) {
    const r = rng(sz.seed), g = gaussVon(r);
    const zieh = (m) => { for (let i = 0; i < 50; i++) { const x = m + sz.sd * g(); if (x >= 0 && x < 1) return x; } return klemme(m, 0, 0.999); };
    const pos = [], neg = [];
    for (let i = 0; i < KM_N; i++) { pos.push(zieh(sz.mPos)); neg.push(zieh(sz.mNeg)); }
    return { pos, neg };
  }
  /* anteilProzent echte Faelle aus den festen Listen; ab Schwelle zaehlt ein Fall als Alarm */
  function matrix(w, anteilProzent, schwelle) {
    const nP = Math.max(1, Math.round(anteilProzent / 100 * KM_N)), nN = KM_N - nP;
    let tp = 0, fp = 0;
    for (let i = 0; i < nP; i++) if (w.pos[i] >= schwelle) tp++;
    for (let i = 0; i < nN; i++) if (w.neg[i] >= schwelle) fp++;
    const fn = nP - tp, tn = nN - fp, alarme = tp + fp;
    return {
      tp, fp, fn, tn, nP, nN, alarme,
      genau: (tp + tn) / KM_N,
      precision: alarme ? tp / alarme : null,
      recall: tp / nP,
    };
  }
  function histogramm(w, anteilProzent) {
    const nP = Math.max(1, Math.round(anteilProzent / 100 * KM_N)), nN = KM_N - nP;
    const p = new Array(KM_BINS).fill(0), n = new Array(KM_BINS).fill(0);
    for (let i = 0; i < nP; i++) p[Math.min(KM_BINS - 1, Math.floor(w.pos[i] * KM_BINS))]++;
    for (let i = 0; i < nN; i++) n[Math.min(KM_BINS - 1, Math.floor(w.neg[i] * KM_BINS))]++;
    return { pos: p, neg: n };
  }

  /* ---------- Datenqualitaet: erfundene Gebrauchtwagentabelle mit eingebauten Fehlern, Modelle im Browser */
  const MISCHUNG = 3, BEZUG = 2026, MARKEN = ["Norda", "Brisa", "Tavio"], SELTEN = "Lumo";
  function fahrzeug(r, g, marke) {
    const alter = 1 + Math.floor(r() * 10);
    const km = Math.max(3000, Math.round((alter * 13000 + 7000 * g()) / 500) * 500);
    const zustand = 2 + Math.floor(r() * 4);
    const preis = Math.max(1500, Math.round((26000 - 1250 * alter - 0.045 * km + 800 * (zustand - 3) + (marke === SELTEN ? 3500 : 0) + 450 * g()) / 50) * 50);
    return { marke, baujahr: BEZUG - alter, km, zustand, preis };
  }
  function zahlendreher(b) { const s = String(b); return Number(s[0] + s[2] + s[1] + s[3]); }
  function tabelle(mischung) {
    const r = rng(4242), g = gaussVon(r), rm = rng(9000 + (mischung == null ? MISCHUNG : mischung));
    const z = [];
    for (let i = 0; i < 28; i++) z.push(fahrzeug(r, g, i === 5 || i === 17 ? SELTEN : MARKEN[Math.floor(r() * 3)]));
    for (let i = z.length - 1; i > 0; i--) { const j = Math.floor(rm() * (i + 1)); const t = z[i]; z[i] = z[j]; z[j] = t; }
    const rows = z.map((q) => Object.assign({ id: 0, fehler: null }, q));
    const frei = (cond, n) => rows.filter((q) => !q.fehler && q.marke !== SELTEN && cond(q)).slice(0, n);
    const setze = (q, feld, neu, typ) => { q.fehler = { typ, feld, richtig: q[feld] }; q[feld] = neu; };
    for (const q of frei((q) => q.baujahr >= 2016, 2)) setze(q, "baujahr", zahlendreher(q.baujahr), "tippfehler");
    for (const q of frei((q) => q.km >= 70000, 2)) setze(q, "km", q.km / 10, "tippfehler");
    for (const q of frei((q) => q.preis < 16000 && q.preis > 9000, 2)) setze(q, "preis", q.preis / 1000, "einheit");
    for (const q of frei((q) => q.preis > 14000 && q.preis < 20000, 1)) setze(q, "preis", q.preis * 4, "ausreisser");
    for (const q of frei(() => true, 2)) setze(q, "preis", null, "luecke");
    for (const q of frei(() => true, 1)) setze(q, "km", null, "luecke");
    for (const q of rows) if (q.marke === SELTEN) q.fehler = { typ: "verzerrung" };
    const quellen = rows.filter((q) => !q.fehler).slice(3, 5);
    const out = rows.slice();
    const dup = (q) => Object.assign({}, q, { id: 0, fehler: { typ: "dublette", vonRef: q } });
    out.splice(out.indexOf(quellen[0]) + 1, 0, dup(quellen[0]));
    out.push(dup(quellen[1]));
    out.forEach((q, i) => { q.id = i + 1; });
    for (const q of out) if (q.fehler && q.fehler.vonRef) { q.fehler.vonId = q.fehler.vonRef.id; delete q.fehler.vonRef; }
    return out;
  }
  function pruefdaten() {
    const r = rng(777), g = gaussVon(r), t = [];
    for (let i = 0; i < 20; i++) t.push(fahrzeug(r, g, i % 5 === 4 ? SELTEN : MARKEN[i % 3]));
    return t;
  }
  const merk = (q) => [1, BEZUG - q.baujahr, q.km / 1000, q.zustand];
  function loese(A, b) {
    const n = b.length;
    for (let i = 0; i < n; i++) {
      let m = i;
      for (let k = i + 1; k < n; k++) if (Math.abs(A[k][i]) > Math.abs(A[m][i])) m = k;
      [A[i], A[m]] = [A[m], A[i]]; [b[i], b[m]] = [b[m], b[i]];
      for (let k = i + 1; k < n; k++) {
        const f = A[k][i] / (A[i][i] || 1e-12);
        for (let j = i; j < n; j++) A[k][j] -= f * A[i][j];
        b[k] -= f * b[i];
      }
    }
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let s = b[i];
      for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j];
      x[i] = s / (A[i][i] || 1e-12);
    }
    return x;
  }
  /* Modelle: "linear" (kleinste Quadrate) oder "knn" (3 naechste Nachbarn). Zeilen mit Luecken fallen weg. */
  function lernen(modell, zeilen) {
    const t = zeilen.filter((q) => q.baujahr != null && q.km != null && q.preis != null);
    if (t.length < 5) return null;
    if (modell === "knn") {
      const skal = (q) => [(BEZUG - q.baujahr) / 3, q.km / 40000, q.zustand];
      const tf = t.map((p) => ({ f: skal(p), preis: p.preis }));
      return {
        n: t.length,
        vorhersage: (q) => {
          const f = skal(q);
          const d = tf.map((p) => ({ d: (p.f[0] - f[0]) ** 2 + (p.f[1] - f[1]) ** 2 + (p.f[2] - f[2]) ** 2, preis: p.preis })).sort((a, b) => a.d - b.d).slice(0, 3);
          return d.reduce((s, x) => s + x.preis, 0) / d.length;
        },
      };
    }
    const A = Array.from({ length: 4 }, () => new Array(4).fill(0)), b = new Array(4).fill(0);
    for (const q of t) { const f = merk(q); for (let i = 0; i < 4; i++) { b[i] += f[i] * q.preis; for (let j = 0; j < 4; j++) A[i][j] += f[i] * f[j]; } }
    for (let i = 1; i < 4; i++) A[i][i] += 1e-6;
    const w = loese(A, b);
    return { n: t.length, vorhersage: (q) => merk(q).reduce((s, x, i) => s + x * w[i], 0) };
  }
  function fehlerMass(m, test) {
    if (!m) return null;
    let s = 0, sr = 0, nr = 0;
    const punkte = [];
    for (const q of test) {
      const v = m.vorhersage(q), e = Math.abs(v - q.preis);
      s += e; if (q.marke === SELTEN) { sr += e; nr++; }
      punkte.push({ wirklich: q.preis, geschaetzt: v, selten: q.marke === SELTEN });
    }
    return { alle: s / test.length, selten: nr ? sr / nr : 0, punkte };
  }

  KL.glKern = {
    rng, datensatz, netzNeu, vor, schritt, bewerte, trainiere, landschaft, abstieg, SZENARIEN, werte, matrix, histogramm,
    tabelle, pruefdaten, lernen, fehlerMass, BEZUG,
  };
  if (typeof document === "undefined" || !document.createElement) return;

  /* ============================================================ Oberflaechenhilfen */
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const mqDunkel = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const mqRuhig = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const ruhig = () => !!(mqRuhig && mqRuhig.matches);
  let zaehler = 0;
  const neueId = (p) => "gl-" + p + "-" + (++zaehler);

  function parseFarbe(s) {
    s = (s || "").trim();
    let m = s.match(/^#([0-9a-f]{6})$/i);
    if (m) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
    m = s.match(/^#([0-9a-f]{3})$/i);
    if (m) return [0, 1, 2].map((i) => parseInt(m[1][i] + m[1][i], 16));
    m = s.match(/^rgba?\(([^)]+)\)/);
    if (m) { const t = m[1].split(",").map((x) => parseFloat(x)); return [t[0], t[1], t[2]]; }
    return [128, 128, 128];
  }
  const rgba = (c, a) => "rgba(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + "," + (a == null ? 1 : a) + ")";
  function palette() {
    const f = (n) => parseFarbe(css(n));
    return {
      text: f("--text"), leise: f("--leise"), flaeche: f("--flaeche"), flaeche2: f("--flaeche2"), flaeche3: f("--flaeche3"),
      k1: f("--k1"), k2: f("--k2"), k3: f("--k3"), k4: f("--k4"), akzent: f("--akzent"), gruen: f("--gruen"), rot: f("--rot"), orange: f("--orange"),
    };
  }
  function ctxFuer(cv) {
    const r = cv.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(10, Math.round(r.width)), hh = Math.max(10, Math.round(r.height));
    const bw = Math.round(w * dpr), bh = Math.round(hh * dpr);
    if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; }
    const c = cv.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, hh);
    return { c, w, h: hh };
  }
  const SCHRIFT = '12px -apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif';

  const SYM = {
    play: '<path d="M7 4l13 8-13 8z"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    schritt: '<path d="M5 4l10 8-10 8z"/><path d="M19 5v14"/>',
    zurueck: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    mischen: '<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    pruefen: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    entfernen: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    korrigieren: '<path d="M5 12l4 4 10-10"/>',
    loeschen: '<path d="M18 6L6 18M6 6l12 12"/>',
    stopp: '<circle cx="12" cy="12" r="9"/><path d="M5.7 5.7l12.6 12.6"/>',
  };
  function gi(name) {
    const w = document.createElement("span");
    w.innerHTML = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + (SYM[name] || SYM.play) + "</svg>";
    return w.firstChild;
  }
  function knopf(text, sym, fn, klasse) {
    return h("button", { type: "button", class: klasse || "btn klein", onclick: fn }, sym ? gi(sym) : null, h("span", null, text));
  }
  function setzeKnopf(b, text, sym) { b.replaceChildren(gi(sym), h("span", null, text)); }
  /* Auswahl wie Funktionstasten: genau einer ist gedrueckt */
  function wahl(beschriftung, optionen, wert, onWahl) {
    const knoepfe = {};
    const el = h("div", { class: "gl-wahl", role: "group", "aria-label": beschriftung });
    for (const [key, text] of optionen) {
      const b = h("button", { type: "button", class: "chip", "aria-pressed": key === wert ? "true" : "false", onclick: () => { setze(key); onWahl(key); } }, text);
      knoepfe[key] = b; el.append(b);
    }
    function setze(k) { for (const [key, b] of Object.entries(knoepfe)) b.setAttribute("aria-pressed", key === k ? "true" : "false"); }
    return { el, setze };
  }
  function regler(text, min, max, step, wert, format, onInput) {
    const id = neueId("regler");
    const input = h("input", { type: "range", id, min, max, step });
    input.value = wert;
    const out = h("output", { for: id }, format(wert));
    input.addEventListener("input", () => { const v = Number(input.value); out.textContent = format(v); onInput(v); });
    const el = h("div", { class: "regler" }, h("label", { for: id }, text), input, out);
    return {
      el, input, out,
      setze(v) { input.value = v; out.textContent = format(Number(input.value)); },
      aktiv(an) { input.disabled = !an; },
    };
  }
  function schalter(text, an, onChange) {
    const input = h("input", { type: "checkbox", role: "switch" });
    input.checked = !!an;
    input.addEventListener("change", () => onChange(input.checked));
    return { el: h("label", { class: "gl-schalter" }, input, h("span", { class: "gl-sw", "aria-hidden": "true" }), h("span", null, text)), input };
  }
  /* Textzeile mit aria-live; wechselt hoechstens etwa zweimal pro Sekunde */
  function livezeile(el, minMs) {
    const pause = minMs || 500;
    let letzte = 0, ausstehend = null, timer = 0, gezeigt = "";
    function zeigen() {
      timer = 0;
      if (ausstehend == null || ausstehend === gezeigt) { ausstehend = null; return; }
      el.textContent = ausstehend; gezeigt = ausstehend; ausstehend = null; letzte = Date.now();
    }
    return {
      setze(text) {
        ausstehend = text;
        if (text === gezeigt) { ausstehend = null; return; }
        const warte = pause - (Date.now() - letzte);
        if (warte <= 0 && !timer) zeigen();
        else if (!timer) timer = setTimeout(zeigen, Math.max(0, warte));
      },
      sofort(text) { if (timer) { clearTimeout(timer); timer = 0; } ausstehend = text; zeigen(); },
      ende() { if (timer) clearTimeout(timer); timer = 0; },
    };
  }
  /* Verwaltung von Hoerern und Neuzeichnen (Groesse, Hell/Dunkel) */
  function leben(root, zeichne) {
    const ab = [];
    let rafId = 0;
    const plan = () => { if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; try { zeichne(); } catch (e) { console.error(e); } }); };
    const api = {
      plan,
      hoere(ziel, ev, fn, opt) { ziel.addEventListener(ev, fn, opt); ab.push(() => ziel.removeEventListener(ev, fn, opt)); },
      merke(fn) { ab.push(fn); },
      ende() { if (rafId) cancelAnimationFrame(rafId); rafId = 0; ab.splice(0).forEach((f) => { try { f(); } catch (e) { /* ignorieren */ } }); },
    };
    if (mqDunkel) {
      if (mqDunkel.addEventListener) api.hoere(mqDunkel, "change", plan);
      else if (mqDunkel.addListener) { mqDunkel.addListener(plan); ab.push(() => mqDunkel.removeListener(plan)); }
    }
    if (window.ResizeObserver) { const ro = new ResizeObserver(plan); ro.observe(root); ab.push(() => ro.disconnect()); }
    return api;
  }
  function sichtbarBeobachten(el, fn) {
    if (!("IntersectionObserver" in window)) { fn(true); return () => {}; }
    const io = new IntersectionObserver((es) => fn(es[es.length - 1].isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }
  function stand(text, wert) { return h("span", { class: "chip gl-stand" }, text + " ", h("b", null, wert)); }
  const proz = (x, d = 0) => de(100 * x, d) + " %";
  function pfeil(c, x0, y0, x1, y1, farbe, breite) {
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
    if (len < 3) return;
    const ux = dx / len, uy = dy / len, kopf = Math.min(10, len * 0.5);
    c.strokeStyle = farbe; c.fillStyle = farbe; c.lineWidth = breite || 2.5; c.lineCap = "round";
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1 - ux * kopf * 0.7, y1 - uy * kopf * 0.7); c.stroke();
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - ux * kopf - uy * kopf * 0.55, y1 - uy * kopf + ux * kopf * 0.55);
    c.lineTo(x1 - ux * kopf + uy * kopf * 0.55, y1 - uy * kopf - ux * kopf * 0.55); c.closePath(); c.fill();
  }

  /* ============================================================ 1. Netz-Spielplatz */
  KL.widgets["netz-spielplatz"] = function (root) {
    root.classList.add("gl-wid", "gl-netz");
    const DS = [["wolken", "Zwei Wolken"], ["kreis", "Kreis im Kreis"], ["xor", "Schachbrett"], ["spirale", "Spirale"]];
    const AK = [["tanh", "Weich (tanh)"], ["relu", "Rampe (ReLU)"], ["sigmoid", "Sigmoid"]];
    const STD = { ds: "kreis", hid: 1, nper: 4, akt: "tanh", lrV: 50 };
    const MAX_SCHRITTE = 30000;
    const lrVon = (v) => 0.003 * Math.pow(100, v / 100);
    const z = Object.assign({}, STD, { seedZ: 0, laeuft: false, sichtbar: true });
    let daten, netz, batchR, hist, letzt, raf = 0, schmutzig = true, letzteZeichnung = 0;

    /* Aufbau */
    const cvFeld = h("canvas", { class: "spiel gl-cv gl-quadrat", role: "img", "aria-label": "Entscheidungsfläche" });
    const cvKurve = h("canvas", { class: "spiel gl-cv gl-kurve", role: "img", "aria-label": "Verlauf von Trainings- und Testverlust" });
    const cvNetz = h("canvas", { class: "spiel gl-cv gl-netzbild", role: "img", "aria-label": "Zeichnung des Netzes" });
    const erkl = h("p", { class: "erklaerung", "aria-live": "polite" });
    const live = livezeile(erkl, 500);
    const statusZeile = h("p", { class: "gl-statuszeile", "aria-live": "off" });
    const chSchritt = stand("Schritt", "0"), chVT = stand("Verlust Training", "0"), chVTe = stand("Verlust Test", "0"), chG = stand("Treffer Test", "0");
    const standBox = h("div", { class: "gl-standreihe" }, chSchritt, chVT, chVTe, chG);

    const wDs = wahl("Punktmenge", DS, z.ds, (k) => { z.ds = k; neuAufbauen(); });
    const rHid = regler("Zwischenschichten", 0, 3, 1, z.hid, (v) => String(v), (v) => { z.hid = v; rNeu.aktiv(v > 0); neuAufbauen(); });
    const rNeu = regler("Neuronen je Schicht", 1, 8, 1, z.nper, (v) => String(v), (v) => { z.nper = v; neuAufbauen(); });
    const rLr = regler("Lernrate", 0, 100, 1, z.lrV, (v) => de(lrVon(v), 3), () => { schmutzig = true; plan(); });
    const selId = neueId("akt");
    const sel = h("select", { id: selId, class: "gl-select" }, AK.map(([k, t]) => h("option", { value: k }, t)));
    sel.value = z.akt;
    sel.addEventListener("change", () => { z.akt = sel.value; neuAufbauen(); });
    const aktZeile = h("div", { class: "regler gl-aktzeile" }, h("label", { for: selId }, "Aktivierung"), sel, h("span"));

    const bStart = knopf("Training starten", "play", () => umschalten(), "btn primary klein");
    const bSchritt = knopf("Ein Schritt", "schritt", () => { z.laeuft = false; knopfText(); einSchritt(); if (netz.schritt % 10 !== 0) messen(); schmutzig = true; plan(); });
    const bNeu = knopf("Neu starten", "mischen", () => { z.seedZ++; neuAufbauen(); });
    const bReset = knopf("Zurücksetzen", "zurueck", () => alleZurueck());
    function knopfText() { setzeKnopf(bStart, z.laeuft ? "Pause" : "Training starten", z.laeuft ? "pause" : "play"); statusZeile.setAttribute("aria-live", z.laeuft ? "off" : "polite"); }

    root.append(
      h("p", { class: "gl-einf" }, "Ein kleines Netz lernt, zwei Farben zu trennen. Stelle Schichten und Neuronen ein und sieh zu, wie die Grenze entsteht."),
      h("div", { class: "gl-block" }, h("p", { class: "gl-ueber" }, "Punktmenge"), wDs.el),
      h("div", { class: "gl-regler-gitter" }, rHid.el, rNeu.el, aktZeile, rLr.el),
      h("div", { class: "werkzeuge gl-knoepfe" }, bStart, bSchritt, bNeu, bReset),
      h("div", { class: "gl-haupt" },
        h("figure", { class: "gl-fig" }, cvFeld,
          h("figcaption", null, "Blau und Orange sind die zwei Klassen. Gefüllte Punkte trainieren das Netz, hohle Punkte sind Testpunkte, die es nie zum Lernen sieht.")),
        h("div", { class: "gl-rechts" },
          h("figure", { class: "gl-fig" }, h("p", { class: "gl-ueber" }, "Verlust über die Schritte"), cvKurve,
            h("div", { class: "gl-legende" }, h("span", null, h("i", { class: "gl-l-tr" }), "Training"), h("span", null, h("i", { class: "gl-l-te" }), "Test"))),
          standBox)),
      statusZeile,
      erkl,
      h("figure", { class: "gl-fig" }, h("p", { class: "gl-ueber" }, "Das Netz"), cvNetz,
        h("figcaption", null, "Jede Linie ist ein Gewicht. Blau verstärkt, Orange bremst, dicker heißt stärker.")));

    function umschalten() {
      z.laeuft = !z.laeuft;
      if (z.laeuft && netz.schritt >= MAX_SCHRITTE) neuAufbauen();
      knopfText(); plan();
    }
    function alleZurueck() {
      Object.assign(z, STD, { seedZ: 0, laeuft: false });
      wDs.setze(z.ds); rHid.setze(z.hid); rNeu.setze(z.nper); rNeu.aktiv(true); rLr.setze(z.lrV); sel.value = z.akt;
      knopfText(); neuAufbauen();
    }
    function neuAufbauen() {
      daten = datensatz(z.ds, 7);
      netz = netzNeu([2, ...new Array(z.hid).fill(z.nper), 1], z.akt, 11 + z.seedZ * 17);
      batchR = rng(5 + z.seedZ);
      hist = { s: [], tr: [], te: [] };
      messen();
      schmutzig = true; plan();
    }
    function messen() {
      const tr = bewerte(netz, daten.train), te = bewerte(netz, daten.test);
      letzt = { tr, te };
      hist.s.push(netz.schritt); hist.tr.push(tr.verlust); hist.te.push(te.verlust);
      if (hist.s.length > 500) { for (const k of ["s", "tr", "te"]) hist[k] = hist[k].filter((_, i) => i % 2 === 0); }
    }
    function einSchritt() {
      const b = [], tr = daten.train;
      for (let i = 0; i < 20; i++) b.push(tr[Math.floor(batchR() * tr.length)]);
      schritt(netz, b, lrVon(Number(rLr.input.value)), 0.9);
      if (netz.schritt % 10 === 0) messen();
    }
    function plan() { if (!raf) raf = requestAnimationFrame(tick); }
    function tick() {
      raf = 0;
      if (document.hidden || !z.sichtbar) { if (z.laeuft) plan(); return; }
      if (z.laeuft) {
        const t0 = performance.now();
        let n = 0;
        while (n < 12 && performance.now() - t0 < 5) { einSchritt(); n++; }
        schmutzig = true;
        if (netz.schritt >= MAX_SCHRITTE) { z.laeuft = false; knopfText(); }
      }
      const jetzt = performance.now();
      if (schmutzig && (jetzt - letzteZeichnung >= (ruhig() ? 600 : 90) || !z.laeuft)) { zeichneAlles(); letzteZeichnung = jetzt; schmutzig = false; }
      if (z.laeuft || schmutzig) plan();
    }

    /* Zeichnen */
    const gitter = 40;
    const off = document.createElement("canvas");
    off.width = off.height = gitter;
    const offC = off.getContext("2d"), img = offC.createImageData(gitter, gitter);
    function zeichneFeld(P) {
      for (let j = 0; j < gitter; j++) for (let i = 0; i < gitter; i++) {
        const p = vor(netz, -1 + 2 * (i + 0.5) / gitter, 1 - 2 * (j + 0.5) / gitter), o = (j * gitter + i) * 4;
        for (let k = 0; k < 3; k++) img.data[o + k] = P.k1[k] * (1 - p) + P.k2[k] * p;
        img.data[o + 3] = Math.round(255 * (0.16 + 0.5 * Math.abs(2 * p - 1)));
      }
      offC.putImageData(img, 0, 0);
      const { c, w, h: hh } = ctxFuer(cvFeld), pad = 8, bw = w - 2 * pad, bh = hh - 2 * pad;
      c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high";
      c.drawImage(off, pad, pad, bw, bh);
      c.strokeStyle = rgba(P.leise, 0.3); c.lineWidth = 1;
      c.beginPath(); c.moveTo(pad, hh / 2); c.lineTo(w - pad, hh / 2); c.moveTo(w / 2, pad); c.lineTo(w / 2, hh - pad); c.stroke();
      const px = (x) => pad + (x + 1) / 2 * bw, py = (y) => pad + (1 - y) / 2 * bh;
      const punkt = (q, test) => {
        const col = q.k ? P.k2 : P.k1, x = px(q.x), y = py(q.y), r = 4.6;
        c.beginPath();
        if (q.k) { c.moveTo(x, y - r - 1); c.lineTo(x + r + 1, y); c.lineTo(x, y + r + 1); c.lineTo(x - r - 1, y); c.closePath(); } else c.arc(x, y, r, 0, 7);
        if (test) { c.fillStyle = rgba(P.flaeche); c.fill(); c.lineWidth = 2; c.strokeStyle = rgba(col); c.stroke(); }
        else { c.fillStyle = rgba(col); c.fill(); c.lineWidth = 1.4; c.strokeStyle = rgba(P.flaeche); c.stroke(); }
      };
      for (const q of daten.train) punkt(q, false);
      for (const q of daten.test) punkt(q, true);
    }
    function zeichneKurve(P) {
      const { c, w, h: hh } = ctxFuer(cvKurve), l = 34, r = 8, t = 8, b = 22, bw = w - l - r, bh = hh - t - b;
      const maxS = Math.max(200, hist.s[hist.s.length - 1] || 0);
      let ymax = 0.8;
      for (let i = 0; i < hist.s.length; i++) ymax = Math.max(ymax, Math.min(2, hist.tr[i]), Math.min(2, hist.te[i]));
      ymax = Math.ceil(ymax * 5) / 5;
      c.font = SCHRIFT; c.fillStyle = rgba(P.leise); c.strokeStyle = rgba(P.leise, 0.22); c.lineWidth = 1; c.textBaseline = "middle"; c.textAlign = "right";
      for (let i = 0; i <= 4; i++) {
        const v = ymax * i / 4, y = t + bh - bh * i / 4;
        c.beginPath(); c.moveTo(l, y); c.lineTo(l + bw, y); c.stroke();
        c.fillText(de(v, 1), l - 5, y);
      }
      c.textAlign = "center"; c.textBaseline = "top";
      c.fillText("0", l, t + bh + 5); c.fillText(ganz(maxS) + " Schritte", l + bw - 30, t + bh + 5);
      const linie = (arr, farbe, strich) => {
        c.beginPath(); c.strokeStyle = farbe; c.lineWidth = 2.2; c.setLineDash(strich || []); c.lineJoin = "round";
        for (let i = 0; i < arr.length; i++) {
          const x = l + bw * hist.s[i] / maxS, y = t + bh - bh * Math.min(arr[i], ymax) / ymax;
          if (i) c.lineTo(x, y); else c.moveTo(x, y);
        }
        c.stroke(); c.setLineDash([]);
      };
      linie(hist.tr, rgba(P.text)); linie(hist.te, rgba(P.k4), [6, 4]);
    }
    function zeichneNetz(P) {
      const { c, w, h: hh } = ctxFuer(cvNetz), gr = netz.gr, sp = gr.length, rx = 22;
      const pos = gr.map((n, li) => { const x = 54 + (w - 54 - 70) * li / (sp - 1); return Array.from({ length: n }, (_, i) => ({ x, y: hh * (i + 1) / (n + 1) })); });
      for (let l = 0; l < netz.L; l++) {
        const ni = gr[l];
        for (let o = 0; o < gr[l + 1]; o++) for (let i = 0; i < ni; i++) {
          const wv = netz.W[l][o * ni + i], st = Math.min(1, Math.abs(wv) / 3);
          c.strokeStyle = rgba(wv >= 0 ? P.k1 : P.k2, 0.25 + 0.65 * st); c.lineWidth = 0.5 + 4.5 * st;
          c.beginPath(); c.moveTo(pos[l][i].x, pos[l][i].y); c.lineTo(pos[l + 1][o].x, pos[l + 1][o].y); c.stroke();
        }
      }
      c.font = SCHRIFT; c.textBaseline = "middle";
      pos.forEach((spalte, li) => spalte.forEach((p, i) => {
        c.beginPath(); c.arc(p.x, p.y, Math.min(11, 130 / (spalte.length + 2) / 1.6 + 5), 0, 7);
        c.fillStyle = rgba(P.flaeche); c.fill(); c.lineWidth = 2; c.strokeStyle = rgba(P.text, 0.7); c.stroke();
      }));
      c.fillStyle = rgba(P.leise); c.textAlign = "right";
      c.fillText("x", pos[0][0].x - rx, pos[0][0].y); c.fillText("y", pos[0][1].x - rx, pos[0][1].y);
      c.textAlign = "left"; c.fillText("Ausgabe", pos[sp - 1][0].x + rx - 4, pos[sp - 1][0].y);
    }
    function zeichneAlles() {
      const P = palette();
      zeichneFeld(P); zeichneKurve(P); zeichneNetz(P);
      const tr = letzt.tr, te = letzt.te;
      chSchritt.lastChild.textContent = ganz(netz.schritt);
      chVT.lastChild.textContent = de(tr.verlust, 2);
      chVTe.lastChild.textContent = de(te.verlust, 2);
      chG.lastChild.textContent = te.richtig + " von " + te.n;
      statusZeile.textContent = "Schritt " + ganz(netz.schritt) + ", Verlust " + de(tr.verlust, 2) + ", " + tr.richtig + " von " + tr.n + " Trainingspunkten und " + te.richtig + " von " + te.n + " Testpunkten richtig.";
      const text = erklaerung();
      live.setze(text);
      const lbl = "Entscheidungsfläche nach " + ganz(netz.schritt) + " Schritten: " + tr.richtig + " von " + tr.n + " Trainingspunkten und " + te.richtig + " von " + te.n + " Testpunkten richtig.";
      cvFeld.setAttribute("aria-label", lbl);
    }
    function erklaerung() {
      const tr = letzt.tr, te = letzt.te, st = netz.schritt;
      const aTr = tr.richtig / tr.n, aTe = te.richtig / te.n;
      const linear = z.hid === 0 || z.nper === 1;
      const grund = z.hid === 0 ? "Ohne versteckte Schicht" : "Mit nur einem Neuron je Schicht";
      const fehltDs = {
        kreis: "Der Kreis braucht mindestens eine versteckte Schicht mit mehreren Neuronen.",
        xor: "Das Schachbrett braucht eine versteckte Schicht mit mindestens zwei Neuronen, vier machen es sicherer.",
        spirale: "Die Spirale braucht mehrere Neuronen und am besten mehr als eine Schicht.",
      };
      if (linear) {
        if (z.ds === "wolken") return st < 30 ? grund + " kann das Netz nur eine gerade Linie ziehen. Für die zwei Wolken reicht das. Starte das Training." : grund + " zieht das Netz eine gerade Linie. Für die zwei Wolken reicht das: " + proz(aTe) + " der Testpunkte liegen richtig.";
        return grund + " kann das Netz nur eine gerade Linie ziehen. " + fehltDs[z.ds] + (st >= 30 ? " Aktuell liegen " + proz(aTe) + " der Testpunkte richtig." : "");
      }
      if (st < 30) return "Mit mehreren Neuronen kann die Grenze Kurven bekommen. Starte das Training und sieh zu, wie sie sich biegt.";
      if (st > 300 && aTr - aTe >= 0.1) return "Das Netz kennt die Trainingspunkte besser als die Testpunkte. Das nennt man Überanpassung: Es hat Einzelheiten auswendig gelernt.";
      if (aTe >= 0.95) {
        const schichten = z.hid === 1 ? "einer Schicht" : z.hid + " Schichten";
        return "Gelöst: Mit " + z.nper + " Neuronen in " + schichten + " biegt das Netz die Grenze passend. " + proz(aTe) + " der Testpunkte liegen richtig.";
      }
      if (st > 800 && aTe < 0.85) return z.ds === "spirale" ? "Die Spirale ist schwer. Probiere mehr Neuronen oder eine zweite Schicht und gib dem Training Zeit." : "Das Netz kommt nicht weiter. Mehr Neuronen oder eine andere Lernrate können helfen.";
      return "Das Netz sucht die Grenze noch. Die Entscheidungsfläche wird mit jedem Schritt genauer.";
    }

    const abmelde = [];
    abmelde.push(sichtbarBeobachten(root, (s) => { z.sichtbar = s; if (s) plan(); }));
    const L = leben(root, () => { schmutzig = true; zeichneAlles(); });
    L.hoere(document, "visibilitychange", () => { if (!document.hidden) { schmutzig = true; plan(); } });
    neuAufbauen();
    knopfText();
    return { destroy() { if (raf) cancelAnimationFrame(raf); raf = 0; z.laeuft = false; live.ende(); abmelde.forEach((f) => f()); L.ende(); } };
  };

  /* ============================================================ 2. Gradientenabstieg */
  KL.widgets["gradient-abstieg"] = function (root) {
    root.classList.add("gl-wid", "gl-grad");
    const LIST = [["mulde", "Eine Mulde"], ["zwei", "Zwei Mulden"], ["schlucht", "Steile Schlucht"], ["taeler", "Mehrere Täler"]];
    const TEMPO = [0, 4, 15, 60];
    const TEMPO_NAME = ["", "langsam", "mittel", "schnell"];
    const STD = { ls: "mulde", lrV: 63, mu: 0, tempo: 2 };
    const lrVon = (v) => 0.01 * Math.pow(120, v / 100);
    const MAX_SCHRITTE = 4000;
    const cache = {};
    const lsHol = (id) => cache[id] || (cache[id] = landschaft(id));
    const z = Object.assign({}, STD);
    let L = lsHol(z.ls), start = L.start.slice(), st, bahn, verl, laeuft = false, ende = null, raf = 0, letzterT = 0, rest = 0, sichtbar = true, kontur = null;

    const cv = h("canvas", { class: "spiel gl-cv gl-weit", tabindex: "0", role: "application", "aria-label": "Landschaft. Klicke, um den Startpunkt zu setzen. Mit den Pfeiltasten verschiebst du ihn." });
    const cvV = h("canvas", { class: "spiel gl-cv gl-niedrig", role: "img", "aria-label": "Verlust über die Schritte, logarithmisch" });
    const erkl = h("p", { class: "erklaerung", "aria-live": "polite" });
    const live = livezeile(erkl, 500);
    const chS = stand("Schritt", "0"), chW = stand("Gewicht", ""), chV = stand("Verlust", ""), chL = stand("Lernrate", "");
    const wLs = wahl("Landschaft", LIST, z.ls, (k) => { z.ls = k; L = lsHol(k); start = L.start.slice(); kontur = null; rLr.setze(L.lrV); zuruecksetzen(); });
    const rLr = regler("Lernrate", 0, 100, 1, z.lrV, (v) => de(lrVon(v), 2), () => zeichne());
    const rMu = regler("Impuls", 0, 95, 5, z.mu * 100, (v) => de(v / 100, 2), (v) => { z.mu = v / 100; zeichne(); });
    const rTempo = regler("Tempo", 1, 3, 1, z.tempo, (v) => TEMPO_NAME[v], (v) => { z.tempo = v; });
    const bStart = knopf("Start", "play", () => umschalten(), "btn primary klein");
    const bSchritt = knopf("Ein Schritt", "schritt", () => { laeuft = false; knopfText(); eins(); zeichne(); });
    const bReset = knopf("Zurücksetzen", "zurueck", () => alleZurueck());
    function knopfText() { setzeKnopf(bStart, laeuft ? "Pause" : "Start", laeuft ? "pause" : "play"); }

    root.append(
      h("p", { class: "gl-einf" }, "Eine Kugel rollt im Gelände bergab, so wie ein Modell beim Training seinen Fehler verkleinert. Klicke ins Bild, um den Startpunkt zu setzen."),
      h("div", { class: "gl-block" }, h("p", { class: "gl-ueber" }, "Landschaft"), wLs.el),
      h("div", { class: "gl-regler-gitter gl-drei" }, rLr.el, rMu.el, rTempo.el),
      h("div", { class: "werkzeuge gl-knoepfe" }, bStart, bSchritt, bReset),
      cv,
      h("div", { class: "gl-standreihe" }, chS, chW, chV, chL),
      erkl,
      h("figure", { class: "gl-fig" }, h("p", { class: "gl-ueber" }, "Verlust über die Schritte (logarithmisch)"), cvV));

    function zuruecksetzen() {
      st = { p: start.slice(), v: start.map(() => 0), schritt: 0 };
      bahn = [start.slice()]; verl = [L.verlust(start)];
      ende = null; laeuft = false; rest = 0; knopfText(); zeichne();
    }
    function alleZurueck() {
      Object.assign(z, STD);
      wLs.setze(z.ls); rLr.setze(z.lrV); rMu.setze(z.mu * 100); rTempo.setze(z.tempo);
      L = lsHol(z.ls); start = L.start.slice(); kontur = null; zuruecksetzen();
    }
    const lr = () => lrVon(Number(rLr.input.value));
    function eins() {
      if (ende) return;
      abstieg(L, st, lr(), z.mu);
      const fertigeWerte = st.p.every((x) => isFinite(x) && Math.abs(x) < 1e6);
      if (!fertigeWerte) { ende = "diverge"; laeuft = false; knopfText(); return; }
      bahn.push(st.p.slice()); if (bahn.length > 600) bahn.shift();
      verl.push(L.verlust(st.p)); if (verl.length > 1500) verl.splice(1, 1);
      const g = L.g(st.p), gn = Math.hypot(...g), vn = Math.hypot(...st.v);
      if (gn < 2e-3 && vn < 1e-3) { ende = "fertig"; laeuft = false; knopfText(); }
      else if (st.schritt >= MAX_SCHRITTE) { ende = "lang"; laeuft = false; knopfText(); }
    }
    function umschalten() {
      if (ende) { zuruecksetzen(); }
      laeuft = !laeuft; knopfText(); letzterT = 0; planen();
    }
    function planen() { if (!raf) raf = requestAnimationFrame(tick); }
    function tick(t) {
      raf = 0;
      if (!laeuft) return;
      if (document.hidden || !sichtbar) { letzterT = 0; planen(); return; }
      if (!letzterT) letzterT = t;
      rest += Math.min(100, t - letzterT) / 1000 * TEMPO[z.tempo]; letzterT = t;
      let n = 0;
      while (rest >= 1 && n < 30 && laeuft) { eins(); rest -= 1; n++; }
      if (rest > 30) rest = 0;
      zeichne();
      if (laeuft) planen();
    }

    /* Zustand beurteilen: Worte fuer das Verhalten der Kugel */
    function beurteile() {
      const lrw = lr(), n = st.schritt;
      if (ende === "diverge") return "diverge";
      if (ende === "fertig") return "fertig";
      if (n === 0) return "bereit";
      const kr = L.kruemmung(st.p), verhaeltnis = lrw * kr; // 1 = Grenze zum Springen, 2 = Grenze zum Davonfliegen (bei Mulden)
      const k = bahn.length;
      let wechsel = 0, paare = 0;
      for (let i = Math.max(2, k - 6); i < k; i++) {
        const a = bahn[i - 1].map((x, j) => x - bahn[i - 2][j]), b = bahn[i].map((x, j) => x - bahn[i - 1][j]);
        paare++; if (a.reduce((s, x, j) => s + x * b[j], 0) < 0) wechsel++;
      }
      const hin = paare >= 4 && wechsel >= Math.ceil(paare * 0.7);
      const l = verl.length, waechst = l > 7 && verl[l - 1] > verl[l - 7] * 1.15;
      if (hin && (waechst || verhaeltnis > 2.05)) return "diverge";
      if (hin) return "springt";
      if (ende === "lang") return "lang";
      if (n >= 12 && verhaeltnis < 0.04) return "kriecht";
      return "rollt";
    }
    function erklaerung() {
      const zu = beurteile(), v = L.verlust(st.p);
      if (zu === "bereit") return L.dim === 1
        ? "Die Kugel steht am Start. Das Gefälle der Kurve sagt ihr, wohin es bergab geht. Die Lernrate bestimmt, wie weit sie je Schritt rollt."
        : "Die Kugel steht am Start. Die Linien verbinden Punkte gleicher Höhe, dunkler heißt tiefer. Die Lernrate bestimmt, wie weit sie je Schritt rollt.";
      if (zu === "diverge") return "Die Schritte sind viel zu groß: Die Kugel springt über das Tal und landet bei jedem Sprung höher. Der Verlust wächst, das Training divergiert. Senke die Lernrate.";
      if (zu === "springt") return "Die Schritte sind zu groß: Die Kugel springt von Wand zu Wand und kommt nur langsam unten an." + (z.mu > 0 ? " Der Impuls verstärkt das Überschwingen." : " Eine kleinere Lernrate beruhigt sie.");
      if (zu === "kriecht") return "Die Schritte sind sehr klein, die Kugel kriecht. Das Training würde ewig dauern. Erhöhe die Lernrate.";
      if (zu === "fertig") {
        if (L.istGlobal(st.p)) return "Angekommen im tiefsten Tal nach " + ganz(st.schritt) + " Schritten. Der Verlust ist " + de(v, 2) + ".";
        return "Angekommen, aber nur in einem lokalen Minimum: Der Verlust bleibt bei " + de(v, 2) + ", im anderen Tal wäre er kleiner. Setze den Startpunkt woanders hin.";
      }
      if (zu === "lang") return "Nach " + ganz(st.schritt) + " Schritten ist die Kugel noch nicht angekommen. Mit einer größeren Lernrate oder etwas Impuls geht es schneller.";
      if (L.id === "schlucht" && st.schritt >= 40) return "Quer zur Schlucht ist es steil, dort geht es schnell. Entlang des Bodens ist das Gefälle flach, deshalb kriecht die Kugel längs. Ein Impuls hilft.";
      if (z.mu > 0) return "Die Kugel nimmt mit dem Impuls Schwung mit und rollt auch über kleine Hügel hinweg.";
      return "Die Schritte passen: Die Kugel rollt gleichmäßig bergab, erst schnell, dann langsamer, weil das Gefälle abnimmt.";
    }

    /* Zeichnen */
    function abb() { // Abbildung Welt -> Bildpunkte
      const { c, w, h: hh } = ctxFuer(cv);
      const m = { l: 14, r: 14, t: 18, b: 24 };
      if (L.dim === 1) {
        const n = 240; let lo = Infinity, hi = -Infinity;
        for (let i = 0; i <= n; i++) { const f = L.f([L.a + (L.b - L.a) * i / n]); lo = Math.min(lo, f); hi = Math.max(hi, f); }
        const sp = hi - lo; lo -= 0.06 * sp; hi += 0.06 * sp;
        return { c, w, h: hh, m, lo, hi, X: (x) => m.l + (x - L.a) / (L.b - L.a) * (w - m.l - m.r), Y: (f) => hh - m.b - (f - lo) / (hi - lo) * (hh - m.t - m.b), inv: (px) => L.a + (px - m.l) / (w - m.l - m.r) * (L.b - L.a) };
      }
      return { c, w, h: hh, m: { l: 0, r: 0, t: 0, b: 0 }, X: (x) => (x - L.xa) / (L.xb - L.xa) * w, Y: (y) => hh - (y - L.ya) / (L.yb - L.ya) * hh, invX: (px) => L.xa + px / w * (L.xb - L.xa), invY: (py) => L.ya + (hh - py) / hh * (L.yb - L.ya) };
    }
    function zeichneKontur(A, P) {
      const key = [L.id, A.w, A.h, css("--flaeche"), css("--akzent")].join("|");
      if (!kontur || kontur.key !== key) {
        const sc = 0.5, cw = Math.max(40, Math.round(A.w * sc)), ch = Math.max(24, Math.round(A.h * sc));
        const oc = document.createElement("canvas"); oc.width = cw; oc.height = ch;
        const o = oc.getContext("2d"), im = o.createImageData(cw, ch);
        const wert = new Float64Array(cw * ch); let fmax = 0;
        for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
          const x = L.xa + (i + 0.5) / cw * (L.xb - L.xa), y = L.ya + (1 - (j + 0.5) / ch) * (L.yb - L.ya);
          const f = L.verlust([x, y]); wert[j * cw + i] = f; if (f > fmax) fmax = f;
        }
        const STUFEN = 14, stufe = (f) => Math.min(STUFEN, Math.floor(Math.sqrt(Math.max(0, f) / fmax) * STUFEN));
        for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
          const s = stufe(wert[j * cw + i]), rand = (i + 1 < cw && stufe(wert[j * cw + i + 1]) !== s) || (j + 1 < ch && stufe(wert[(j + 1) * cw + i]) !== s);
          const t = 1 - s / STUFEN, k = (j * cw + i) * 4;
          for (let q = 0; q < 3; q++) {
            const basis = P.flaeche2[q] * (1 - 0.55 * t) + P.akzent[q] * 0.55 * t;
            im.data[k + q] = rand ? P.leise[q] * 0.55 + basis * 0.45 : basis;
          }
          im.data[k + 3] = 255;
        }
        o.putImageData(im, 0, 0);
        kontur = { key, canvas: oc };
      }
      A.c.imageSmoothingEnabled = true; A.c.drawImage(kontur.canvas, 0, 0, A.w, A.h);
    }
    function zeichne() {
      const P = palette(), A = abb(), c = A.c;
      c.font = SCHRIFT;
      const lrw = lr();
      if (L.dim === 1) {
        c.strokeStyle = rgba(P.leise, 0.25); c.lineWidth = 1; c.beginPath(); c.moveTo(A.m.l, A.h - A.m.b); c.lineTo(A.w - A.m.r, A.h - A.m.b); c.stroke();
        c.fillStyle = rgba(P.leise); c.textAlign = "center"; c.textBaseline = "top";
        for (let v = Math.ceil(L.a); v <= L.b; v++) if (v % 2 === 0) c.fillText(String(v), A.X(v), A.h - A.m.b + 5);
        c.textAlign = "right"; c.fillText("Gewicht w", A.w - A.m.r, A.h - A.m.b - 18);
        c.beginPath(); c.lineWidth = 2.4; c.strokeStyle = rgba(P.text); c.lineJoin = "round";
        for (let i = 0; i <= 240; i++) { const x = L.a + (L.b - L.a) * i / 240, y = A.Y(L.f([x])); if (i) c.lineTo(A.X(x), y); else c.moveTo(A.X(x), y); }
        c.stroke();
      } else zeichneKontur(A, P);
      const pix = (p) => (L.dim === 1 ? [A.X(p[0]), A.Y(L.f(p))] : [A.X(p[0]), A.Y(p[1])]);
      /* Minima */
      L.minima.forEach((p) => {
        const [x, y] = pix(p), glob = L.istGlobal(p);
        c.beginPath(); c.arc(x, y, 11, 0, 7); c.lineWidth = 2.4; c.strokeStyle = rgba(glob ? P.gruen : P.orange); c.stroke();
        c.fillStyle = rgba(P.text); c.textAlign = "center"; c.textBaseline = "top";
        c.fillText(glob ? "tiefster Punkt" : "lokales Minimum", x, y + 15);
      });
      /* Startmarke */
      const [sx, sy] = pix(start);
      c.strokeStyle = rgba(P.text, 0.6); c.lineWidth = 1.5; c.setLineDash([3, 3]); c.beginPath(); c.arc(sx, sy, 7, 0, 7); c.stroke(); c.setLineDash([]);
      /* Spur */
      c.lineJoin = "round"; c.lineCap = "round";
      if (bahn.length > 1) {
        c.beginPath(); c.strokeStyle = rgba(P.akzent, 0.55); c.lineWidth = 2;
        bahn.forEach((p, i) => { const [x, y] = pix(p); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
        c.stroke();
        const von = Math.max(0, bahn.length - 80);
        for (let i = von; i < bahn.length; i++) { const [x, y] = pix(bahn[i]); c.beginPath(); c.arc(x, y, 2.6, 0, 7); c.fillStyle = rgba(P.akzent, 0.8); c.fill(); }
      }
      /* Kugel und naechster Schritt */
      const innen = (p) => (L.dim === 1 ? p[0] >= L.a && p[0] <= L.b : p[0] >= L.xa && p[0] <= L.xb && p[1] >= L.ya && p[1] <= L.yb);
      const draussen = !innen(st.p);
      let [bx, by] = pix(st.p);
      if (L.dim === 1) { bx = klemme(bx, A.m.l, A.w - A.m.r); by = klemme(by, A.m.t, A.h - A.m.b); } else { bx = klemme(bx, 0, A.w); by = klemme(by, 0, A.h); }
      if (!ende && isFinite(st.p[0])) {
        const g = L.g(st.p), nx = st.p.map((x, k) => x + z.mu * st.v[k] - lrw * g[k]);
        let [ex, ey] = L.dim === 1 ? [A.X(nx[0]), by] : pix(nx);
        const lang = Math.hypot(ex - bx, ey - by);
        if (lang > A.w * 0.6) { ex = bx + (ex - bx) * A.w * 0.6 / lang; ey = by + (ey - by) * A.w * 0.6 / lang; }
        pfeil(c, bx, by, ex, ey, rgba(P.k2), 3);
      }
      c.beginPath(); c.arc(bx, by, 9, 0, 7); c.fillStyle = rgba(draussen || ende === "diverge" ? P.rot : P.akzent); c.fill();
      c.lineWidth = 2.5; c.strokeStyle = rgba(P.flaeche); c.stroke();
      if (draussen) { c.fillStyle = rgba(P.rot); c.textAlign = "left"; c.textBaseline = "top"; c.fillText("Die Kugel ist aus dem Bild gerollt.", 10, 8); }
      /* Werte */
      chS.lastChild.textContent = ganz(st.schritt);
      const fmtW = (x) => (!isFinite(x) || Math.abs(x) > 1e5 ? "riesig" : de(x, 2));
      chW.firstChild.textContent = (L.dim === 1 ? "Gewicht" : "Gewichte") + " ";
      chW.lastChild.textContent = L.dim === 1 ? fmtW(st.p[0]) : fmtW(st.p[0]) + " / " + fmtW(st.p[1]);
      const vv = L.verlust(st.p);
      chV.lastChild.textContent = !isFinite(vv) || vv > 1e5 ? "riesig" : de(vv, 2);
      chL.lastChild.textContent = de(lrw, 2) + (z.mu > 0 ? ", Impuls " + de(z.mu, 2) : "");
      live.setze(erklaerung());
      cv.setAttribute("aria-label", "Landschaft " + LIST.find((x) => x[0] === z.ls)[1] + ". Schritt " + st.schritt + ", Verlust " + chV.lastChild.textContent + ". Klicke, um den Startpunkt zu setzen, oder nutze die Pfeiltasten.");
      zeichneVerlauf(P);
    }
    function zeichneVerlauf(P) {
      const { c, w, h: hh } = ctxFuer(cvV), l = 40, r = 8, t = 8, b = 20, bw = w - l - r, bh = hh - t - b;
      const lo = -3, hoch = Math.max(1, Math.ceil(Math.log10(Math.max(1, ...verl.map((x) => (isFinite(x) ? x : 1e6))))));
      const Yv = (v) => t + bh - bh * (klemme(Math.log10(Math.max(1e-3, v)), lo, hoch) - lo) / (hoch - lo);
      c.font = SCHRIFT; c.fillStyle = rgba(P.leise); c.strokeStyle = rgba(P.leise, 0.22); c.lineWidth = 1; c.textAlign = "right"; c.textBaseline = "middle";
      for (let e = lo; e <= hoch; e += hoch - lo > 6 ? 2 : 1) {
        const y = Yv(Math.pow(10, e)); c.beginPath(); c.moveTo(l, y); c.lineTo(l + bw, y); c.stroke();
        c.fillText(e >= 0 ? ganz(Math.pow(10, e)) : de(Math.pow(10, e), -e), l - 5, y);
      }
      const maxS = Math.max(40, st.schritt);
      c.textAlign = "center"; c.textBaseline = "top"; c.fillText("0", l, t + bh + 4); c.fillText(ganz(maxS) + " Schritte", l + bw - 32, t + bh + 4);
      c.beginPath(); c.strokeStyle = rgba(P.akzent); c.lineWidth = 2.2; c.lineJoin = "round";
      const n = verl.length;
      verl.forEach((v, i) => { const x = l + bw * (n > 1 ? (i / (n - 1)) * (st.schritt / maxS) : 0), y = Yv(isFinite(v) ? v : 1e6); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
      c.stroke();
    }

    /* Startpunkt setzen */
    function startVonPixel(ev) {
      const r = cv.getBoundingClientRect(), px = ev.clientX - r.left, py = ev.clientY - r.top;
      if (L.dim === 1) {
        const m = { l: 14, r: 14 };
        start = [klemme(L.a + (px - m.l) / (r.width - m.l - m.r) * (L.b - L.a), L.a + 0.05, L.b - 0.05)];
      } else {
        start = [klemme(L.xa + px / r.width * (L.xb - L.xa), L.xa + 0.2, L.xb - 0.2), klemme(L.ya + (r.height - py) / r.height * (L.yb - L.ya), L.ya + 0.2, L.yb - 0.2)];
      }
      const lief = laeuft;
      zuruecksetzen(); if (lief) { laeuft = true; knopfText(); letzterT = 0; planen(); }
    }
    function pTaste(e) {
      const sch = e.shiftKey ? 0.1 : 0.025, d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (!d) return;
      e.preventDefault();
      if (L.dim === 1) start = [klemme(start[0] + d[0] * sch * (L.b - L.a), L.a + 0.05, L.b - 0.05)];
      else start = [klemme(start[0] + d[0] * sch * (L.xb - L.xa), L.xa + 0.2, L.xb - 0.2), klemme(start[1] + d[1] * sch * (L.yb - L.ya), L.ya + 0.2, L.yb - 0.2)];
      zuruecksetzen();
    }

    const abmelde = sichtbarBeobachten(root, (s) => { sichtbar = s; });
    const lb = leben(root, () => zeichne());
    lb.hoere(cv, "pointerdown", startVonPixel);
    lb.hoere(cv, "keydown", pTaste);
    zuruecksetzen();
    return { destroy() { laeuft = false; if (raf) cancelAnimationFrame(raf); raf = 0; live.ende(); abmelde(); lb.ende(); } };
  };

  /* ============================================================ 3. Konfusionsmatrix */
  KL.widgets["konfusionsmatrix"] = function (root) {
    root.classList.add("gl-wid", "gl-konf");
    const STD = { sz: "spam", th: 0.5 };
    const z = { sz: STD.sz, th: STD.th, anteil: SZENARIEN[STD.sz].anteil, einzeln: SZENARIEN[STD.sz].einzeln };
    const daten = {};
    const wHol = (id) => daten[id] || (daten[id] = werte(SZENARIEN[id]));

    const cv = h("canvas", { class: "spiel gl-cv gl-hist", role: "img", "aria-label": "Verteilung der Modellwerte" });
    const erkl = h("p", { class: "erklaerung", "aria-live": "polite" });
    const live = livezeile(erkl, 500);
    const wSz = wahl("Szenario", Object.keys(SZENARIEN).map((k) => [k, SZENARIEN[k].name]), z.sz, (k) => { z.sz = k; z.anteil = SZENARIEN[k].anteil; z.einzeln = SZENARIEN[k].einzeln; rAn.setze(z.anteil); sw.input.checked = z.einzeln; zeichne(); });
    const rTh = regler("Schwelle", 0, 1, 0.01, z.th, (v) => de(v, 2), (v) => { z.th = v; zeichne(); });
    const rAn = regler("Anteil echter Fälle", 0.5, 50, 0.5, z.anteil, (v) => de(v, 1) + " %", (v) => { z.anteil = v; zeichne(); });
    const sw = schalter("Beide Gruppen einzeln skalieren", z.einzeln, (an) => { z.einzeln = an; zeichne(); });
    const bImmer = knopf("Immer unauffällig sagen", "stopp", () => { z.th = 1; rTh.setze(1); zeichne(); live.sofort(satzNeu(matrix(wHol(z.sz), z.anteil, z.th))); });
    const bReset = knopf("Zurücksetzen", "zurueck", () => { z.sz = STD.sz; z.th = STD.th; z.anteil = SZENARIEN[z.sz].anteil; z.einzeln = SZENARIEN[z.sz].einzeln; wSz.setze(z.sz); rTh.setze(z.th); rAn.setze(z.anteil); sw.input.checked = z.einzeln; zeichne(); });

    const legende = h("div", { class: "gl-legende" });
    const mtab = h("table", { class: "gl-matrix" });
    const zellen = {};
    function zelle(key, text) { const n = h("b", null, "0"); zellen[key] = { n, t: h("span", null, text) }; return h("td", { class: key === "tp" || key === "tn" ? "gl-gut" : "gl-schlecht" }, n, zellen[key].t); }
    const kopfPos = h("th", { scope: "row" }), kopfNeg = h("th", { scope: "row" });
    mtab.append(
      h("caption", { class: "gl-sr" }, "Konfusionsmatrix"),
      h("thead", null, h("tr", null, h("td"), h("th", { scope: "col" }, "Modell sagt: Alarm"), h("th", { scope: "col" }, "Modell sagt: kein Alarm"))),
      h("tbody", null, h("tr", null, kopfPos, zelle("tp", "Richtig positiv"), zelle("fn", "Falsch negativ")), h("tr", null, kopfNeg, zelle("fp", "Falsch positiv"), zelle("tn", "Richtig negativ"))));
    const mass = {};
    function massZeile(key, name) {
      const wert = h("b", null, ""), balken = h("i"), satz = h("span", { class: "gl-massatz" });
      mass[key] = { wert, balken, satz };
      return h("div", { class: "gl-mass" }, h("div", { class: "gl-masskopf" }, h("span", null, name), wert), h("div", { class: "gl-balken", "aria-hidden": "true" }, balken), satz);
    }

    root.append(
      h("p", { class: "gl-einf" }, "Ein Modell gibt jedem Fall einen Wert zwischen 0 und 1. Ab der Schwelle schlägt es Alarm. Verschiebe sie und sieh, wie Treffer und Fehler wandern."),
      h("div", { class: "gl-block" }, h("p", { class: "gl-ueber" }, "Szenario"), wSz.el),
      h("div", { class: "gl-haupt gl-konfhaupt" },
        h("div", { class: "gl-links" },
          h("figure", { class: "gl-fig" }, cv, legende),
          h("div", { class: "gl-regler-gitter gl-eine" }, rTh.el, rAn.el),
          h("div", { class: "werkzeuge gl-knoepfe" }, sw.el, bImmer, bReset)),
        h("div", { class: "gl-rechts" },
          mtab,
          massZeile("genau", "Genauigkeit"), massZeile("precision", "Precision"), massZeile("recall", "Recall"))),
      erkl);

    function satzNeu(m) {
      const S = SZENARIEN[z.sz];
      const fnTeil = m.fn === 0 ? "jeder der " + m.nP + " echten Fälle wird gefunden" : S.fn(m.fn, m.nP);
      const fpTeil = m.fp === 0 ? "es gibt keinen Fehlalarm" : S.fp(m.fp, m.nN);
      let s = "Bei dieser Schwelle: " + fnTeil + ", und " + fpTeil + ".";
      const schlimm = S.schwer === "fn" ? m.fn : m.fp;
      if (schlimm > 0) s += " " + (S.schwer === "fn" ? S.fnFolge : S.fpFolge);
      if (m.genau >= 0.9 && m.recall < 0.5) s += " Die Genauigkeit zeigt " + proz(m.genau, 1) + ", doch das Modell findet nur " + m.tp + " von " + m.nP + " echten Fällen. Bei seltenen Ereignissen täuscht diese Zahl.";
      else if (S.schwer === "fn" && m.recall < 0.95) s += " Hier ist Übersehen teuer: Eine niedrigere Schwelle findet mehr, kostet aber Fehlalarme.";
      else if (S.schwer === "fp" && m.fp > 0) s += " Hier ist ein Fehlalarm teuer: Eine höhere Schwelle schützt gute Fälle, übersieht aber mehr echte.";
      return s;
    }

    function zeichne() {
      const S = SZENARIEN[z.sz], w = wHol(z.sz), m = matrix(w, z.anteil, z.th), hi = histogramm(w, z.anteil), P = palette();
      /* Histogramm */
      const { c, w: bw0, h: hh } = ctxFuer(cv), l = 34, r = 10, t = 22, b = 26, bw = bw0 - l - r, bh = hh - t - b;
      const maxP = Math.max(1, ...hi.pos), maxN = Math.max(1, ...hi.neg), gem = Math.max(maxP, maxN);
      const hoch = (v, grp) => bh * (z.einzeln ? v / (grp === "p" ? maxP : maxN) : v / gem) * 0.95;
      c.font = SCHRIFT;
      c.strokeStyle = rgba(P.leise, 0.25); c.lineWidth = 1; c.beginPath(); c.moveTo(l, t + bh); c.lineTo(l + bw, t + bh); c.stroke();
      c.fillStyle = rgba(P.leise); c.textBaseline = "top"; c.textAlign = "center";
      [0, 0.25, 0.5, 0.75, 1].forEach((v) => c.fillText(de(v, v === 0 || v === 1 ? 0 : 2), l + bw * v, t + bh + 6));
      c.textAlign = "right"; c.textBaseline = "middle";
      c.fillText(z.einzeln ? "relativ" : ganz(gem), l - 6, t + 6);
      const bb = bw / KM_BINS;
      for (let i = 0; i < KM_BINS; i++) {
        const x = l + i * bb;
        const hn = hoch(hi.neg[i], "n"), hp = hoch(hi.pos[i], "p");
        c.fillStyle = rgba(P.k1, 0.55); c.fillRect(x + 1, t + bh - hn, bb - 2, hn);
        if (hp > 0) { c.fillStyle = rgba(P.k2, 0.7); c.fillRect(x + 1, t + bh - hp, bb - 2, hp); c.lineWidth = 1.5; c.strokeStyle = rgba(P.k2); c.strokeRect(x + 1.5, t + bh - hp + 0.5, bb - 3, hp - 1); }
      }
      const tx = l + bw * z.th;
      c.strokeStyle = rgba(P.text); c.lineWidth = 2.2; c.beginPath(); c.moveTo(tx, t - 4); c.lineTo(tx, t + bh); c.stroke();
      c.fillStyle = rgba(P.text); c.textBaseline = "bottom";
      const links = tx > l + 110, rechts = tx < l + bw - 90;
      c.textAlign = "right"; if (links) c.fillText(S.kein, tx - 6, t + 14);
      c.textAlign = "left"; if (rechts) c.fillText(S.alarm + " ab " + de(z.th, 2), tx + 6, t + 14);
      legende.replaceChildren(
        h("span", null, h("i", { class: "gl-f-neg" }), "Wirklich " + S.neg), h("span", null, h("i", { class: "gl-f-pos" }), "Wirklich " + S.pos),
        h("span", { class: "gl-leise" }, "Balken links von der Linie: kein Alarm, rechts: Alarm."));
      /* Matrix */
      kopfPos.textContent = "Wirklich " + S.pos; kopfNeg.textContent = "Wirklich " + S.neg;
      zellen.tp.n.textContent = ganz(m.tp); zellen.fn.n.textContent = ganz(m.fn); zellen.fp.n.textContent = ganz(m.fp); zellen.tn.n.textContent = ganz(m.tn);
      /* Kennzahlen */
      const setze = (k, v, text) => { mass[k].wert.textContent = v == null ? "keine Angabe" : proz(v, 1); mass[k].balken.style.width = (v == null ? 0 : v * 100) + "%"; mass[k].satz.textContent = text; };
      setze("genau", m.genau, (m.tp + m.tn) + " von " + KM_N + " " + S.gesamt + " wurden richtig eingeordnet.");
      setze("precision", m.precision, m.alarme ? "Von " + m.alarme + " Alarmen waren " + m.tp + " echt." : "Es gab keinen Alarm, also lässt sich nichts über die Alarme sagen.");
      setze("recall", m.recall, "Von " + m.nP + " echten Fällen hat das Modell " + m.tp + " gefunden.");
      live.setze(satzNeu(m));
      cv.setAttribute("aria-label", "Verteilung der Modellwerte, Schwelle " + de(z.th, 2) + ". " + m.tp + " Treffer, " + m.fp + " Fehlalarme, " + m.fn + " übersehen.");
    }
    function pointer(ev) {
      const r = cv.getBoundingClientRect(), l = 34, rr = 10;
      const v = klemme(Math.round((ev.clientX - r.left - l) / (r.width - l - rr) * 100) / 100, 0, 1);
      z.th = v; rTh.setze(v); zeichne();
    }
    let zieht = false;
    const lb = leben(root, zeichne);
    lb.hoere(cv, "pointerdown", (e) => { zieht = true; try { cv.setPointerCapture(e.pointerId); } catch (x) { /* ignorieren */ } pointer(e); });
    lb.hoere(cv, "pointermove", (e) => { if (zieht) pointer(e); });
    lb.hoere(cv, "pointerup", () => { zieht = false; });
    lb.hoere(cv, "pointercancel", () => { zieht = false; });
    zeichne();
    return { destroy() { live.ende(); lb.ende(); } };
  };

  /* ============================================================ 4. Datenqualitaet */
  KL.widgets["datenqualitaet"] = function (root) {
    root.classList.add("gl-wid", "gl-dq");
    const TYPEN = {
      tippfehler: ["Tippfehler", "Tippfehler und Zahlendreher ergeben Werte, die es nicht geben kann, etwa ein Baujahr in der Zukunft oder ein Kilometerstand mit einer Null zu wenig. Das Modell glaubt sie trotzdem und verbiegt seine Schätzung."],
      einheit: ["Falsche Einheit", "Ein Preis in Tausend statt in Euro wirkt wie ein Auto, das fast nichts kostet. Prüfe Einheiten, bevor du Zahlen vergleichst."],
      ausreisser: ["Ausreißer", "Ein auffällig hoher Preis kann ein Tippfehler sein oder ein echtes Sondermodell. Frag nach, bevor du löschst. Ein einzelner Ausreißer zieht eine lineare Schätzung merklich mit."],
      luecke: ["Lücke", "Fehlende Werte kann das Modell nicht nutzen, die Zeile fällt weg. Gefährlich wird es, wenn die Lücken nicht zufällig sind: Dann fehlt eine ganze Sorte von Fällen."],
      dublette: ["Dublette", "Doppelte Zeilen zählen doppelt. Das Modell hält dieses Auto für häufiger, als es ist. Landet eine Kopie im Test, sieht das Ergebnis besser aus, als es ist."],
      verzerrung: ["Verzerrung", "Von der Marke " + SELTEN + " gibt es nur zwei Zeilen. Das Modell lernt vor allem die anderen Marken und schätzt " + SELTEN + " schlechter, auch wenn der Gesamtfehler klein wirkt. Streichen hilft nicht, es fehlen Daten."],
    };
    const MARKEN_TOOL = [["fehler", "Fehler"], ["luecke", "Lücke"], ["dublette", "Dublette"], ["verzerrung", "Verzerrung"]];
    const MARK_NAME = Object.fromEntries(MARKEN_TOOL);
    const FELDER = { baujahr: "Baujahr", km: "Kilometer", preis: "Preis" };
    const test = pruefdaten();
    let rows = tabelle(), marken = new Map(), geprueft = false, modell = "linear", werkzeug = "fehler";
    let basis = null; // Fehler auf den Startdaten je Modell

    const fmtZahl = (v) => (v == null ? "leer" : v < 100 ? de(v, 1) : Math.round(v).toLocaleString("de-DE"));
    const euro = (v) => ganz(v) + " €";

    const erkl = h("p", { class: "erklaerung", "aria-live": "polite" });
    const live = livezeile(erkl, 500);
    const wWz = wahl("Markieren als", MARKEN_TOOL, werkzeug, (k) => { werkzeug = k; });
    const wMo = wahl("Modell", [["linear", "Lineare Schätzung"], ["knn", "Nächste Nachbarn"]], modell, (k) => { modell = k; basisNeu(); aktualisiere(); live.sofort("Modell gewechselt: " + (k === "linear" ? "Die Schätzung ist eine Gerade durch alle Zeilen. Einzelne falsche Werte ziehen sie stark mit." : "Jedes Auto wird nach den drei ähnlichsten Autos geschätzt. Falsche Werte stören nur ihre Nachbarschaft.")); });
    const bPruefen = knopf("Prüfen", "pruefen", () => pruefen(), "btn primary klein");
    const bEntf = knopf("Markierte Zeilen entfernen", "entfernen", () => bereinigen("entfernen"));
    const bKorr = knopf("Markierte Fehler korrigieren", "korrigieren", () => bereinigen("korrigieren"));
    const bMarkLoesch = knopf("Markierungen löschen", "loeschen", () => { marken.clear(); aktualisiereZeilen(); live.sofort("Alle Markierungen gelöscht."); });
    const bReset = knopf("Zurücksetzen: alle Fehler wieder einbauen", "zurueck", () => zuruecksetzen());
    const cv = h("canvas", { class: "spiel gl-cv gl-quadrat", role: "img", "aria-label": "Schätzung gegen Wirklichkeit" });
    const tileJetzt = h("b", null, ""), tileStart = h("b", null, ""), tileSauber = h("b", null, ""), tileSelten = h("b", null, "");
    const tileSeltenText = h("span", null, "");
    const kachel = (b, text) => h("div", { class: "gl-kachel" }, h("span", null, text), b);
    const ergebnis = h("div", { class: "gl-ergebnis", hidden: true, "aria-live": "polite" });
    const zaehlerEntf = h("span", { class: "gl-leise" });

    /* Tabelle */
    const tbody = h("tbody");
    const trs = new Map();
    function zeilenZeile(r) {
      const knopfZ = h("button", { type: "button", class: "gl-zk", "aria-pressed": "false" }, h("span", { class: "gl-nr" }, String(r.id)), h("span", { class: "gl-mk" }));
      const zellen = {};
      const td = (f, cls) => { const e = h("td", { class: cls }); zellen[f] = e; return e; };
      const tr = h("tr", { class: "gl-zeile" }, h("th", { scope: "row" }, knopfZ), h("td", { class: "gl-marke" }, r.marke), td("baujahr", "gl-z"), td("km", "gl-z"), td("zustand", "gl-z"), td("preis", "gl-z"));
      tr.addEventListener("click", () => umschalten(r));
      trs.set(r.id, { tr, knopf: knopfZ, zellen, mk: knopfZ.querySelector(".gl-mk") });
      return tr;
    }
    function bauTabelle() {
      tbody.replaceChildren(...rows.map(zeilenZeile));
      aktualisiereZeilen();
    }
    function aktualisiereZeilen() {
      for (const r of rows) {
        const e = trs.get(r.id), mk = marken.get(r.id);
        e.tr.hidden = !!r.entfernt;
        e.tr.className = "gl-zeile" + (mk ? " gl-m-" + mk : "") + (geprueft && r.fehler && !r.entfernt && !gefunden(r) ? " gl-offen" : "");
        for (const f of ["baujahr", "km", "zustand", "preis"]) {
          const v = r[f];
          e.zellen[f].textContent = f === "zustand" || f === "baujahr" ? (v == null ? "leer" : String(v)) : fmtZahl(v);
          const fehlzelle = geprueft && r.fehler && r.fehler.feld === f && !r.korrigiert;
          e.zellen[f].className = "gl-z" + (v == null ? " gl-leer" : "") + (fehlzelle ? " gl-fehlzelle" : "") + (r.korrigiert && r.fehler && r.fehler.feld === f ? " gl-korr" : "");
          if (fehlzelle) e.zellen[f].title = TYPEN[r.fehler.typ][0] + " im Feld " + FELDER[f];
          else e.zellen[f].removeAttribute("title");
        }
        e.mk.textContent = mk ? MARK_NAME[mk] : (geprueft && r.fehler && !r.entfernt ? "" : "");
        e.knopf.setAttribute("aria-pressed", mk ? "true" : "false");
        e.knopf.setAttribute("aria-label", "Zeile " + r.id + (mk ? ", markiert als " + MARK_NAME[mk] + ", zum Ändern drücken" : " markieren als " + MARK_NAME[werkzeug]) + (geprueft && r.fehler ? ". Befund: " + TYPEN[r.fehler.typ][0] : ""));
      }
      const n = rows.filter((r) => r.entfernt).length;
      zaehlerEntf.textContent = n ? n + " Zeile" + (n === 1 ? "" : "n") + " entfernt." : "";
    }
    function umschalten(r) {
      if (r.entfernt) return;
      if (marken.get(r.id) === werkzeug) marken.delete(r.id); else marken.set(r.id, werkzeug);
      aktualisiereZeilen();
      live.setze(marken.has(r.id) ? "Zeile " + r.id + " ist als " + MARK_NAME[werkzeug] + " markiert." : "Markierung an Zeile " + r.id + " entfernt.");
    }

    /* Modell und Anzeige */
    function zuTrainieren(variant) { return variant || rows.filter((r) => !r.entfernt); }
    function sauberVariante(nurTyp) {
      return rows.filter((r) => !r.entfernt).filter((r) => !(r.fehler && r.fehler.typ === "dublette" && (!nurTyp || nurTyp === "dublette"))).map((r) => {
        const c = Object.assign({}, r);
        if (r.fehler && r.fehler.richtig !== undefined && (!nurTyp || nurTyp === r.fehler.typ) && r.fehler.typ !== "luecke") c[r.fehler.feld] = r.fehler.richtig;
        return c;
      });
    }
    const messen = (zeilen) => fehlerMass(lernen(modell, zeilen), test);
    function basisNeu() { basis = messen(tabelle()); }
    function aktualisiere() {
      const jetzt = messen(zuTrainieren());
      const sauber = messen(sauberVariante());
      const P = palette();
      tileJetzt.textContent = jetzt ? euro(jetzt.alle) : "zu wenig Daten";
      tileStart.textContent = basis ? euro(basis.alle) : "";
      tileSauber.textContent = sauber ? euro(sauber.alle) : "";
      tileSelten.textContent = jetzt ? euro(jetzt.selten) : "";
      tileSeltenText.textContent = jetzt ? "Marke " + SELTEN + " (nur 2 Zeilen), die anderen Marken: " + euro(mittelAndere(jetzt)) : "";
      zeichneStreu(P, jetzt);
      return jetzt;
    }
    function mittelAndere(m) { const a = m.punkte.filter((p) => !p.selten); return a.reduce((s, p) => s + Math.abs(p.geschaetzt - p.wirklich), 0) / a.length; }
    function zeichneStreu(P, m) {
      const { c, w, h: hh } = ctxFuer(cv), l = 60, r = 22, t = 10, b = 40, bw = w - l - r, bh = hh - t - b, MAXV = 30000;
      c.font = SCHRIFT; c.fillStyle = rgba(P.leise); c.strokeStyle = rgba(P.leise, 0.22); c.lineWidth = 1;
      const X = (v) => l + bw * klemme(v, 0, MAXV) / MAXV, Y = (v) => t + bh - bh * klemme(v, 0, MAXV) / MAXV;
      c.textAlign = "right"; c.textBaseline = "middle";
      [0, 10000, 20000, 30000].forEach((v) => { c.beginPath(); c.moveTo(l, Y(v)); c.lineTo(l + bw, Y(v)); c.stroke(); c.fillText(ganz(v), l - 6, Y(v)); });
      c.textAlign = "center"; c.textBaseline = "top";
      [0, 10000, 20000, 30000].forEach((v) => c.fillText(ganz(v), X(v), t + bh + 5));
      c.fillText("Wirklicher Preis in Euro", l + bw / 2, t + bh + 22);
      c.save(); c.translate(10, t + bh / 2); c.rotate(-Math.PI / 2); c.textBaseline = "middle"; c.fillText("Geschätzter Preis", 0, 0); c.restore();
      c.setLineDash([5, 4]); c.strokeStyle = rgba(P.leise, 0.6); c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(MAXV), Y(MAXV)); c.stroke(); c.setLineDash([]);
      if (!m) { c.fillStyle = rgba(P.text); c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("Zu wenig Zeilen zum Lernen.", l + bw / 2, t + bh / 2); return; }
      for (const p of m.punkte) {
        const aussen = p.geschaetzt < 0 || p.geschaetzt > MAXV, x = X(p.wirklich), y = Y(p.geschaetzt), col = p.selten ? P.k2 : P.k1;
        c.beginPath();
        if (p.selten) { c.moveTo(x, y - 6); c.lineTo(x + 6, y); c.lineTo(x, y + 6); c.lineTo(x - 6, y); c.closePath(); } else c.arc(x, y, 4.8, 0, 7);
        if (aussen) { c.fillStyle = rgba(P.flaeche); c.fill(); c.lineWidth = 2; c.strokeStyle = rgba(col); c.stroke(); }
        else { c.fillStyle = rgba(col, 0.9); c.fill(); c.lineWidth = 1.2; c.strokeStyle = rgba(P.flaeche); c.stroke(); }
      }
    }

    /* Pruefen */
    function gefunden(r) {
      if (r.entfernt || r.korrigiert || marken.has(r.id)) return true;
      if (r.fehler && r.fehler.typ === "dublette") { const o = rows.find((x) => x.id === r.fehler.vonId); return !!(o && (o.entfernt || marken.has(o.id))); }
      if (r.fehler && r.fehler.typ === "verzerrung") return rows.some((x) => x.fehler && x.fehler.typ === "verzerrung" && (marken.has(x.id) || x.entfernt));
      return false;
    }
    function pruefen() {
      geprueft = true;
      const bilanz = {};
      for (const r of rows) {
        if (!r.fehler) continue;
        const t = r.fehler.typ;
        const b = bilanz[t] || (bilanz[t] = { gesamt: 0, gef: 0, fehlt: [] });
        if (t === "verzerrung") { if (!b.gesamt) { b.gesamt = 1; b.gef = gefunden(r) ? 1 : 0; b.zeilen = []; } b.zeilen.push(r.id); if (!b.gef) b.fehlt = b.zeilen; continue; }
        b.gesamt++;
        if (gefunden(r)) b.gef++; else b.fehlt.push(r.id);
      }
      const vonIds = new Set(rows.filter((r) => r.fehler && r.fehler.typ === "dublette").map((r) => r.fehler.vonId));
      const falsch = rows.filter((r) => !r.fehler && !vonIds.has(r.id) && (marken.has(r.id) || r.entfernt)).map((r) => r.id);
      const jetzt = messen(zuTrainieren());
      const alle = Object.values(bilanz), ges = alle.reduce((s, b) => s + b.gesamt, 0), gef = alle.reduce((s, b) => s + b.gef, 0);
      const kopf = h("p", { class: "gl-ergkopf" }, "Du hast " + gef + " von " + ges + " Problemen gefunden" + (falsch.length ? " und " + falsch.length + " Zeile" + (falsch.length === 1 ? "" : "n") + " markiert, die in Ordnung " + (falsch.length === 1 ? "war" : "waren") + " (Zeile " + falsch.join(", ") + ")" : "") + ".");
      const liste = h("ul", { class: "gl-befund" });
      for (const t of Object.keys(TYPEN)) {
        const b = bilanz[t]; if (!b) continue;
        const wirk = (t === "luecke" || t === "verzerrung" || !jetzt) ? null : wirkung(t, jetzt);
        liste.append(h("li", null,
          h("b", null, TYPEN[t][0]), ": " + b.gef + " von " + b.gesamt + (t === "verzerrung" ? " (Gruppe " + SELTEN + ")" : "") + " gefunden" + (b.fehlt.length ? ", übersehen in Zeile " + b.fehlt.join(", ") + "." : "."),
          h("span", { class: "gl-erkl" }, TYPEN[t][1]),
          wirk ? h("span", { class: "gl-wirk" }, wirk) : null));
      }
      ergebnis.hidden = false;
      ergebnis.replaceChildren(h("p", { class: "gl-ueber" }, "Befund"), kopf, liste);
      aktualisiereZeilen();
      live.sofort("Geprüft: " + gef + " von " + ges + " Problemen gefunden." + (falsch.length ? " " + falsch.length + " Markierung" + (falsch.length === 1 ? "" : "en") + " waren unnötig." : "") + " Die übersehenen Stellen sind in der Tabelle umrandet.");
    }
    function wirkung(typ, jetzt) {
      const vorhanden = rows.some((r) => !r.entfernt && !r.korrigiert && r.fehler && r.fehler.typ === typ);
      if (!vorhanden) return "Dieser Fehler ist schon bereinigt.";
      const fix = messen(sauberVariante(typ));
      if (!fix) return null;
      const diff = jetzt.alle - fix.alle;
      if (Math.abs(diff) < 150) return "Auf den Schätzfehler wirkt sich dieser Fehler hier kaum aus (" + euro(jetzt.alle) + " mit, " + euro(fix.alle) + " ohne).";
      return diff > 0 ? "Behebst du nur diesen Fehler, sinkt der Schätzfehler von " + euro(jetzt.alle) + " auf " + euro(fix.alle) + "." : "Behebst du nur diesen Fehler, steigt der Schätzfehler sogar von " + euro(jetzt.alle) + " auf " + euro(fix.alle) + ".";
    }

    /* Bereinigen */
    function bereinigen(art) {
      const vorher = messen(zuTrainieren());
      let n = 0, verz = 0, ohneWert = 0;
      for (const r of rows) {
        const mk = marken.get(r.id);
        if (!mk || r.entfernt) continue;
        if (art === "entfernen") {
          if (mk === "verzerrung") { verz++; continue; }
          r.entfernt = true; marken.delete(r.id); n++;
        } else if (mk === "fehler") {
          if (r.fehler && r.fehler.richtig !== undefined) { r[r.fehler.feld] = r.fehler.richtig; r.korrigiert = true; marken.delete(r.id); n++; } else ohneWert++;
        }
      }
      aktualisiereZeilen();
      const jetzt = aktualisiere();
      const teile = [];
      if (art === "entfernen") teile.push(n ? n + " Zeile" + (n === 1 ? "" : "n") + " entfernt." : "Keine Zeile entfernt: Markiere zuerst Zeilen.");
      else teile.push(n ? n + " Wert" + (n === 1 ? "" : "e") + " korrigiert, so wie ihn eine Rückfrage an die Quelle ergeben würde." : "Nichts korrigiert: Markiere zuerst Zeilen als Fehler, bei denen ein Wert nicht stimmt.");
      if (ohneWert) teile.push(ohneWert + " markierte Zeile" + (ohneWert === 1 ? " hatte" : "n hatten") + " keinen falschen Wert, sie bleibt" + (ohneWert === 1 ? "" : "en") + " unverändert.");
      if (verz) teile.push("Verzerrung lässt sich nicht wegstreichen, es fehlen Fahrzeuge dieser Marke. Entfernen würde es verschlimmern.");
      if (n && vorher && jetzt) teile.push("Der Schätzfehler geht von " + euro(vorher.alle) + " auf " + euro(jetzt.alle) + (jetzt.alle < vorher.alle ? " zurück." : " hoch."));
      if (geprueft) { ergebnis.hidden = true; geprueft = false; aktualisiereZeilen(); teile.push("Prüfe erneut für einen neuen Befund."); }
      live.sofort(teile.join(" "));
    }
    function zuruecksetzen() {
      rows = tabelle(); marken = new Map(); geprueft = false; ergebnis.hidden = true; ergebnis.replaceChildren();
      trs.clear(); bauTabelle(); basisNeu(); aktualisiere();
      live.sofort("Alle Fehler sind wieder eingebaut. Markiere auffällige Zeilen und prüfe dann.");
    }

    root.append(
      h("p", { class: "gl-einf" }, "In dieser erfundenen Tabelle eines Gebrauchtwagenhändlers stecken Fehler. Finde sie, markiere die Zeilen und sieh, wie sich die Preisschätzung des Modells verbessert."),
      h("div", { class: "gl-block" }, h("p", { class: "gl-ueber" }, "Markieren als"), wWz.el),
      h("div", { class: "gl-haupt gl-dqhaupt" },
        h("div", { class: "gl-links" },
          h("div", { class: "gl-tabwrap", tabindex: "0", role: "region", "aria-label": "Tabelle der Fahrzeuge, scrollbar" },
            h("table", { class: "gl-tab" },
              h("caption", { class: "gl-sr" }, "Fahrzeuge. Mit Enter oder Klick auf eine Zeile markierst du sie."),
              h("thead", null, h("tr", null, h("th", { scope: "col" }, "Zeile"), h("th", { scope: "col" }, "Marke"), h("th", { scope: "col" }, "Baujahr"), h("th", { scope: "col" }, "Kilometer"), h("th", { scope: "col" }, "Zustand 1 bis 5"), h("th", { scope: "col" }, "Preis in €")),
              ), tbody)),
          zaehlerEntf),
        h("div", { class: "gl-rechts" },
          h("p", { class: "gl-ueber" }, "Modell"), wMo.el,
          h("figure", { class: "gl-fig" }, cv, h("figcaption", null, "Je näher die Punkte an der gestrichelten Linie liegen, desto besser die Schätzung. Getestet wird an 20 sauberen Fahrzeugen, die das Modell nie sieht. Orange Rauten sind die Marke " + SELTEN + ".")),
          h("div", { class: "gl-kacheln" },
            kachel(tileJetzt, "Mittlerer Fehler jetzt"), kachel(tileStart, "Mit allen Fehlern am Anfang"), kachel(tileSauber, "Wenn alles sauber wäre"), kachel(tileSelten, "Fehler bei Marke " + SELTEN)),
          h("p", { class: "gl-leise gl-klein" }, tileSeltenText))),
      h("div", { class: "werkzeuge gl-knoepfe" }, bPruefen, bEntf, bKorr, bMarkLoesch, bReset),
      erkl, ergebnis);

    const lb = leben(root, () => aktualisiere());
    bauTabelle(); basisNeu(); aktualisiere();
    live.sofort("Klicke auf Zeilen, die dir falsch vorkommen, und wähle oben, was für ein Problem du vermutest. Dann prüfe.");
    return { destroy() { live.ende(); lb.ende(); } };
  };
})();
