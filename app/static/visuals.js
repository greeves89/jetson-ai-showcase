/* KI-Labor: Bildsprache. Datengetriebene, animierte Diagramme fuer Lernseiten (Spezifikation: docs/visuals.md).

   SCHNITTSTELLE
     KL.visual(spec)            baut aus einer Spezifikation { typ: "ablauf", ... } ein <figure class="visual">.
                                spec darf eine Liste sein, dann kommt ein <div class="v-reihe"> mit mehreren Bildern zurueck.
                                Ungueltige Spezifikationen: gibt null zurueck und loggt eine Warnung (die Seite bleibt heil).
     KL.visuals[typ] = function (spec, ctx) { ...; return { el, alt?: [..] } }
                                Registrierung weiterer Bildtypen. el ist der Inhalt des Bildes; alt die Beschriftungen fuer die
                                Textalternative. Der Rahmen (figure, aria-label, Sichtbarkeit, Aufraeumen) kommt von KL.visual.
     KL.visualAlt(spec)         { typ, titel, eintraege: [..] } oder null: Textalternative (auch fuer scripts/seo_bauen.mjs).
     KL.visualAufraeumen(fig)   beendet Animationen und Beobachter eines Bildes (der Router tut das beim Seitenwechsel ohnehin).

   KONTEXT ctx (fuer Renderer)
     ctx.ruhig                  true bei prefers-reduced-motion: dann nur das statische Endbild bauen
     ctx.ein(el, von, o)        el startet beim Sichtbarwerden mit den CSS-Werten "von" und animiert zum Normalzustand (o: delay, dauer in s)
     ctx.schleife(fn)           fn() erzeugt Dauer-Animationen (ctx.wiederhole); laufen nur, solange das Bild sichtbar ist
     ctx.wiederhole(el, kf, dauer, delay?)  Endlos-Animation (Web Animations API), wird mit dem Bild pausiert und aufgeraeumt
     ctx.start(fn)              fn() laeuft einmal beim ersten Sichtbarwerden (z. B. Zahlen hochzaehlen)
     ctx.ic(name)               lucide-Icon (svg) oder null, wenn es den Namen nicht gibt

   SICHERHEIT: Texte der Spezifikation gelangen nur per textContent in die Seite. Die einzigen innerHTML-Stellen sind die
   eigenen Icon-Pfade aus icons.json (ueber KL.icon). */
(function () {
  "use strict";

  /* ================================================================ reiner Teil: Textalternative (ohne DOM, auch fuer Node) */
  const TYPEN = {
    ablauf: "Ablauf", kreis: "Kreislauf", vergleich: "Vergleich", balken: "Balkendiagramm", schichten: "Schichten", raster: "Übersicht",
    zahlen: "Kennzahlen", zeitachse: "Zeitachse", netz: "Netz", punkte: "Punktwolke", matrix: "Matrix", skala: "Skala", token: "Tokens", quelle: "Abbildung",
  };
  const str = (x) => (x == null ? "" : String(x).replace(/\s+/g, " ").trim());
  const arr = (x) => (Array.isArray(x) ? x : []);
  const objs = (x) => arr(x).filter((o) => o && typeof o === "object" && !Array.isArray(o));
  const mit = (text, sub) => (sub ? text + " (" + sub + ")" : text);
  const zahlText = (v, einheit) => {
    const t = typeof v === "number" ? v.toLocaleString("de-DE", { maximumFractionDigits: 2 }) : str(v);
    return einheit && !t.endsWith(str(einheit)) ? t + " " + str(einheit) : t;
  };
  const ALT = {
    ablauf: (s) => objs(s.schritte).map((x) => mit(str(x.text), str(x.sub))),
    kreis: (s) => objs(s.knoten).map((x) => str(x.text)).concat(s.mitte ? ["Mitte: " + str(s.mitte)] : []),
    vergleich: (s) => {
      const seite = (n, o) => (o && typeof o === "object" ? [n + " " + str(o.titel) + ": " + arr(o.punkte).map(str).join(", ")] : []);
      return seite("Links:", s.links).concat(seite("Rechts:", s.rechts), s.urteil ? ["Urteil: " + str(s.urteil)] : []);
    },
    balken: (s) => objs(s.zeilen).map((z) => str(z.label) + ": " + zahlText(z.wert, z.einheit || s.einheit)),
    schichten: (s) => objs(s.ebenen).map((x) => mit(str(x.text), str(x.sub))),
    raster: (s) => objs(s.zellen).map((x) => mit(str(x.text), str(x.sub))),
    zahlen: (s) => objs(s.kacheln).map((x) => str(x.wert) + " " + str(x.label)),
    zeitachse: (s) => objs(s.punkte).map((x) => str(x.t) + ": " + str(x.text)),
    netz: (s) => {
      const name = {};
      objs(s.knoten).forEach((k) => { name[str(k.id)] = str(k.text); });
      return objs(s.knoten).map((k) => str(k.text)).concat(arr(s.kanten).filter((k) => Array.isArray(k) && name[str(k[0])] && name[str(k[1])])
        .map((k) => name[str(k[0])] + " verbunden mit " + name[str(k[1])] + (k[2] ? " (" + str(k[2]) + ")" : "")));
    },
    punkte: (s) => objs(s.klassen).map((k) => str(k.name) + ": " + (Number(k.n) || 0) + " Punkte")
      .concat(s.grenze ? ["Trennung: " + (s.grenze === "kreis" ? "Kreis um die erste Gruppe" : "Linie zwischen den Gruppen")] : []),
    matrix: (s) => {
      const x = arr(s.x).map(str), y = arr(s.y).map(str), out = [];
      arr(s.zellen).forEach((zeile, i) => arr(zeile).forEach((c, j) => {
        out.push((y[i] || "Zeile " + (i + 1)) + ", " + (x[j] || "Spalte " + (j + 1)) + ": " + str(c && typeof c === "object" ? c.text : c));
      }));
      return out;
    },
    skala: (s) => {
      const m = Math.round(Math.min(1, Math.max(0, Number(s.marker) || 0)) * 100);
      return [str(s.links) + " bis " + str(s.rechts) + ", Marker bei " + m + " Prozent" + (s.label ? ": " + str(s.label) : "")];
    },
    token: (s) => { const st = arr(s.stuecke).map(str); return [st.length + " Stücke: " + st.join(" | ")]; },
    quelle: (s) => [str(s.alt)].concat(s.unter ? [str(s.unter)] : []),
  };
  function altText(spec) {
    if (!spec || typeof spec !== "object" || !Object.prototype.hasOwnProperty.call(ALT, spec.typ)) return null;
    try { return { typ: spec.typ, titel: TYPEN[spec.typ], eintraege: ALT[spec.typ](spec).filter(Boolean) }; } catch (e) { return null; }
  }
  const root = typeof window !== "undefined" ? window : globalThis;
  root.KLVisualAlt = altText;              // fuer scripts/seo_bauen.mjs (laeuft ohne DOM)
  if (!root.KL || typeof document === "undefined") return;

  /* ================================================================ Browser-Teil */
  const KL = root.KL;
  const { h } = KL;
  const SVGNS = "http://www.w3.org/2000/svg";
  const mqRuhig = root.matchMedia ? root.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const kannAnimieren = typeof Element !== "undefined" && typeof Element.prototype.animate === "function";

  function s(tag, attrs, ...kids) {
    const e = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v != null && v !== false) e.setAttribute(k, v === true ? "" : String(v));
    for (const c of kids.flat(Infinity)) if (c != null && c !== false) e.append(c);
    return e;
  }
  const FARBEN = { akzent: 1, gruen: 1, orange: 1, rot: 1, grau: 1, k1: 1, k2: 1, k3: 1, k4: 1 };
  const farbe = (f, standard) => "v-f-" + (Object.prototype.hasOwnProperty.call(FARBEN, f) ? f : standard || "akzent");
  const klemme = (v, a, b) => Math.min(b, Math.max(a, v));
  const prozent = (v) => (Math.round(v * 100) / 100) + "%";
  function zahl(v) {                        // 12 | "12" | "1,5" | "1.200" -> Zahl oder NaN
    if (typeof v === "number") return v;
    const t = str(v);
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) return parseFloat(t.replace(/\./g, "").replace(",", "."));
    return /^-?\d+([.,]\d+)?$/.test(t) ? parseFloat(t.replace(",", ".")) : NaN;
  }
  function liste(x, kleinste, was) {
    const l = objs(x).filter((o) => str(o.text) || str(o.label) || str(o.wert));
    if (l.length < kleinste) throw new Error(was + ": mindestens " + kleinste + " Eintraege noetig");
    return l;
  }
  function samen(text) {                    // gleiche Spezifikation, gleiche Punkte
    let a = 2166136261;
    for (let i = 0; i < text.length; i++) { a ^= text.charCodeAt(i); a = Math.imul(a, 16777619); }
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }

  /* ---------------------------------------------------------------- Kontext: Sichtbarkeit, Animation, Aufraeumen */
  /** Keyframes fuer ein Aufleuchten zu den Zeitpunkten (Sekunden) innerhalb einer Schleife der Laenge D. */
  function pulsKeyframes(zeiten, D, aus, an, halten) {
    const kf = [Object.assign({ offset: 0 }, aus)];
    let letzte = 0;
    for (const t of zeiten.slice().sort((a, b) => a - b)) {
      if (letzte > 0 && t - 0.14 < letzte) continue;
      const a = Math.max(t - 0.14, 0), b = t + 0.05, c = t + (halten || 0.4), e = c + 0.35;
      if (e >= D) continue;
      if (a / D > kf[kf.length - 1].offset) kf.push(Object.assign({ offset: a / D }, aus));
      kf.push(Object.assign({ offset: b / D }, an), Object.assign({ offset: c / D }, an), Object.assign({ offset: e / D }, aus));
      letzte = e;
    }
    kf.push(Object.assign({ offset: 1 }, aus));
    return kf;
  }
  function neuerKontext() {
    const ctx = {
      ruhig: !kannAnimieren || !!(mqRuhig && mqRuhig.matches),
      starts: [], schleifen: [], eins: [], anims: [], loopAnims: [], raf: new Set(),
      einEnde: 0, tot: false, gestartet: false,
      pulsKeyframes,
    };
    ctx.ic = (name) => (name && KL.hatIcon && KL.hatIcon(name) ? KL.icon(name) : null);
    ctx.ein = (el, von, o) => {
      if (ctx.ruhig || !el) return;
      o = o || {};
      const keys = Object.keys(von);
      keys.forEach((k) => { el.style[k] = von[k]; });
      ctx.eins.push({ el, keys });
      const delay = o.delay || 0, dauer = o.dauer || 0.5;
      ctx.einEnde = Math.max(ctx.einEnde, delay + dauer);
      ctx.starts.push(() => {
        keys.forEach((k) => { el.style[k] = ""; });
        ctx.anims.push(el.animate([Object.assign({ offset: 0 }, von)], { duration: dauer * 1000, delay: delay * 1000, easing: o.easing || "cubic-bezier(.2,.7,.2,1)", fill: "backwards" }));
      });
    };
    ctx.start = (fn) => { if (!ctx.ruhig) ctx.starts.push(fn); };
    ctx.schleife = (fn) => { if (!ctx.ruhig) ctx.schleifen.push(fn); };
    ctx.wiederhole = (el, kf, dauer, delay) => {
      const a = el.animate(kf, { duration: dauer * 1000, iterations: Infinity, delay: (delay == null ? ctx.einEnde : delay) * 1000, easing: "linear" });
      ctx.anims.push(a); ctx.loopAnims.push(a);
      return a;
    };
    ctx.rafStart = (fn) => {
      let id = 0;
      const tick = (t) => { ctx.raf.delete(id); if (ctx.tot) return; if (fn(t) !== false) { id = requestAnimationFrame(tick); ctx.raf.add(id); } };
      id = requestAnimationFrame(tick); ctx.raf.add(id);
    };
    ctx.zeigeAlles = () => { for (const e of ctx.eins) e.keys.forEach((k) => { e.el.style[k] = ""; }); };
    return ctx;
  }
  /** Haengt Sichtbarkeitssteuerung an das Bild: erst beim Sichtbarwerden starten, ausserhalb des Bildes und im Hintergrund pausieren. */
  function verbinden(fig, ctx) {
    let io = null, sichtbar = false;
    const abmelden = [];
    const pruefe = () => {
      if (ctx.tot) return;
      const an = sichtbar && !document.hidden;
      if (an && !ctx.gestartet) {
        ctx.gestartet = true;
        for (const f of ctx.starts) { try { f(); } catch (e) { console.warn("KL.visual: Start fehlgeschlagen", e); ctx.zeigeAlles(); } }
        for (const f of ctx.schleifen) { try { f(); } catch (e) { console.warn("KL.visual: Schleife fehlgeschlagen", e); } }
      }
      for (const a of ctx.loopAnims) { try { if (an) a.play(); else a.pause(); } catch (e) { /* abgebrochen */ } }
    };
    if (!ctx.ruhig && (ctx.starts.length || ctx.schleifen.length)) {
      if ("IntersectionObserver" in root) {
        io = new IntersectionObserver((es) => { sichtbar = es[es.length - 1].isIntersecting; pruefe(); }, { threshold: 0.2 });
        io.observe(fig);
      } else { sichtbar = true; Promise.resolve().then(pruefe); }
      document.addEventListener("visibilitychange", pruefe);
      abmelden.push(() => document.removeEventListener("visibilitychange", pruefe));
      // Drucken und Bildschirmfotos der ganzen Seite: alle Elemente im Endzustand zeigen, nicht auf das Sichtbarwerden warten
      const drucken = () => { if (!ctx.tot) ctx.zeigeAlles(); };
      root.addEventListener("beforeprint", drucken);
      abmelden.push(() => root.removeEventListener("beforeprint", drucken));
    }
    return () => {
      ctx.tot = true;
      if (io) io.disconnect();
      abmelden.forEach((f) => f());
      for (const a of ctx.anims) { try { a.cancel(); } catch (e) { /* schon weg */ } }
      ctx.anims = []; ctx.loopAnims = [];
      for (const id of ctx.raf) cancelAnimationFrame(id);
      ctx.raf.clear();
    };
  }

  /* ---------------------------------------------------------------- Rahmen */
  KL.visuals = {};
  function bauen(spec) {
    if (!spec || typeof spec !== "object") throw new Error("Spezifikation fehlt");
    const fn = KL.visuals[spec.typ];
    if (typeof fn !== "function") throw new Error("unbekannter Bildtyp \"" + spec.typ + "\"");
    const ctx = neuerKontext();
    const r = fn(spec, ctx);
    if (!r || !r.el) throw new Error("Renderer lieferte kein Element");
    const alt = altText(spec) || { titel: TYPEN[spec.typ] || str(spec.typ), eintraege: arr(r.alt).map(str).filter(Boolean) };
    const selbst = !!r.selbstbeschreibend;      // z. B. quelle: das Bild hat sein eigenes alt
    let label = str(spec.alt) || alt.titel + (alt.eintraege.length ? ": " + alt.eintraege.join(", ") : "");
    if (label.length > 260) label = label.slice(0, 257).replace(/[,;:\s]+\S*$/, "") + "…";
    const fig = h("figure", { class: "visual vt-" + spec.typ, "aria-label": label }, h("div", { class: "v-body", "aria-hidden": selbst ? null : "true" }, r.el));
    if (!selbst && alt.eintraege.length) {
      fig.append(h("ul", { class: "v-alt" }, alt.eintraege.map((t) => h("li", null, t))));
    }
    if (str(spec.unter)) fig.append(h("figcaption", { class: "v-unter" }, str(spec.unter)));
    const aufraeumen = verbinden(fig, ctx);
    fig._kl = { destroy: aufraeumen };
    KL.montiere && KL.montiere(fig._kl);
    return fig;
  }
  KL.visual = function (spec) {
    if (Array.isArray(spec)) {
      const figs = spec.map((x) => KL.visual(x)).filter(Boolean);
      return figs.length ? h("div", { class: "v-reihe" + (figs.length > 1 ? " mehrere" : "") }, figs) : null;
    }
    try { return bauen(spec); } catch (e) { console.warn("KL.visual: " + e.message, spec); return null; }
  };
  KL.visualAlt = altText;
  KL.visualAufraeumen = (fig) => { if (fig && fig._kl) fig._kl.destroy(); };

  /* ================================================================ Bildtypen */
  const V = KL.visuals;
  const symbol = (ctx, name, klasse, nr) => h("span", { class: klasse }, ctx.ic(name) || (nr != null ? h("span", { class: "v-nr" }, String(nr)) : null));

  /* ---- ablauf: Stationen mit wanderndem Datenpaket ---- */
  V.ablauf = function (spec, ctx) {
    const st = liste(spec.schritte, 2, "ablauf"), n = st.length;
    const bahn = h("div", { class: "v-bahn" });
    const paket = spec.paket === false ? null : h("span", { class: "v-paket" });
    if (paket) bahn.append(paket);
    for (let i = 0; i < n - 1; i++) { const p = h("span", { class: "v-pfeil" }); p.style.left = prozent(((i + 0.5) / (n - 1)) * 100); bahn.append(p); }
    const kreise = [], zellen = st.map((x, i) => {
      const k = symbol(ctx, x.icon, "v-ik", i + 1);
      kreise.push(k);
      return h("div", { class: "v-st " + farbe(x.farbe) }, k,
        h("div", { class: "v-txt" }, h("b", null, str(x.text)), str(x.sub) ? h("span", null, str(x.sub)) : null));
    });
    const el = h("div", { class: "v-ablauf" }, bahn, zellen);
    el.style.setProperty("--n", n);
    zellen.forEach((z, i) => ctx.ein(z, { opacity: "0", transform: "translateY(10px)" }, { delay: i * 0.09, dauer: 0.45 }));
    ctx.schleife(() => {
      const seg = 0.95, lauf = (n - 1) * seg, D = lauf + 1.7;
      if (paket) {
        ctx.wiederhole(paket, [
          { offset: 0, left: "0%", opacity: 0 }, { offset: 0.012, left: "0%", opacity: 1 },
          { offset: lauf / D, left: "100%", opacity: 1 }, { offset: (lauf + 0.25) / D, left: "100%", opacity: 0 }, { offset: 1, left: "100%", opacity: 0 },
        ], D);
      }
      kreise.forEach((k, i) => ctx.wiederhole(k, pulsKeyframes([i * seg + 0.02], D,
        { backgroundColor: "var(--v-tint)", color: "var(--c)", transform: "scale(1)" },
        { backgroundColor: "var(--c)", color: "var(--v-auf)", transform: "scale(1.07)" }), D));
    });
    return { el };
  };

  /* ---- kreis: Kreislauf mit umlaufendem Punkt ---- */
  V.kreis = function (spec, ctx) {
    const kn = liste(spec.knoten, 2, "kreis"), n = kn.length, R = 34;
    const winkel = (i) => -90 + (i * 360) / n;
    const pos = (a, r) => [50 + r * Math.cos((a * Math.PI) / 180), 50 + r * Math.sin((a * Math.PI) / 180)];
    const svg = s("svg", { class: "v-ring", viewBox: "0 0 100 100", "aria-hidden": "true" }, s("circle", { cx: 50, cy: 50, r: R, class: "v-ringlinie" }));
    for (let i = 0; i < n; i++) {
      const a = winkel(i) + 180 / n, [x, y] = pos(a, R);
      svg.append(s("path", { d: "M -1.5 -1.8 L 1.5 0 L -1.5 1.8", class: "v-ringpfeil", transform: "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ") rotate(" + (a + 90).toFixed(1) + ")" }));
    }
    const knoten = kn.map((k, i) => {
      const [x, y] = pos(winkel(i), R);
      const e = h("div", { class: "v-kn " + farbe(k.farbe) }, symbol(ctx, k.icon, "v-kc", i + 1), h("span", { class: "v-kt" }, str(k.text)));
      e.style.left = prozent(x); e.style.top = prozent(y);
      return e;
    });
    const mitte = h("div", { class: "v-mitte" }, str(spec.mitte) ? h("b", null, str(spec.mitte)) : ctx.ic("refresh-cw"));
    const punkt = h("span", { class: "v-punkt", hidden: true });
    const el = h("div", { class: "v-zirkel" }, svg, mitte, knoten, punkt);
    knoten.forEach((k, i) => ctx.ein(k, { opacity: "0", transform: "scale(.9)" }, { delay: i * 0.12, dauer: 0.45 }));
    ctx.schleife(() => {
      const seg = 1.3, D = n * seg, kf = [];
      for (let j = 0; j <= 48; j++) { const [x, y] = pos(winkel(0) + (j * 360) / 48, R); kf.push({ offset: j / 48, left: prozent(x), top: prozent(y) }); }
      punkt.hidden = false;
      ctx.wiederhole(punkt, kf, D);
      knoten.forEach((k, i) => ctx.wiederhole(k, pulsKeyframes([i * seg], D,
        { backgroundColor: "var(--flaeche)", color: "var(--text)", transform: "scale(1)" },
        { backgroundColor: "var(--c)", color: "var(--v-auf)", transform: "scale(1.06)" }, 0.5), D));
    });
    return { el };
  };

  /* ---- vergleich: zwei Seiten ---- */
  V.vergleich = function (spec, ctx) {
    const seite = (o, klasse, standardFarbe, standardIcon) => {
      if (!o || typeof o !== "object" || !str(o.titel)) throw new Error("vergleich: titel fehlt");
      const punkte = arr(o.punkte).map(str).filter(Boolean);
      if (!punkte.length) throw new Error("vergleich: punkte fehlen");
      const lis = punkte.map((t) => h("li", null, t));
      const e = h("div", { class: "v-seite " + klasse + " " + farbe(o.farbe, standardFarbe) },
        h("div", { class: "v-kopf" }, symbol(ctx, o.icon || standardIcon, "v-ik klein", null), h("b", null, str(o.titel))),
        h("ul", { class: "v-l" }, lis));
      return { e, lis };
    };
    const l = seite(spec.links, "v-links", "akzent", "circle"), r = seite(spec.rechts, "v-rechts", "orange", "square");
    const urteil = str(spec.urteil) ? h("div", { class: "v-urteil" }, ctx.ic("scale"), h("span", null, str(spec.urteil))) : null;
    const el = h("div", { class: "v-vgl" }, l.e, h("span", { class: "v-gegen" }, "gegen"), r.e, urteil);
    ctx.ein(l.e, { opacity: "0", transform: "translateX(-26px)" }, { dauer: 0.6 });
    ctx.ein(r.e, { opacity: "0", transform: "translateX(26px)" }, { dauer: 0.6 });
    l.lis.forEach((li, i) => ctx.ein(li, { opacity: "0", transform: "translateY(6px)" }, { delay: 0.35 + i * 0.12, dauer: 0.4 }));
    r.lis.forEach((li, i) => ctx.ein(li, { opacity: "0", transform: "translateY(6px)" }, { delay: 0.45 + i * 0.12, dauer: 0.4 }));
    if (urteil) ctx.ein(urteil, { opacity: "0", transform: "scale(.96)" }, { delay: 0.5 + Math.max(l.lis.length, r.lis.length) * 0.12, dauer: 0.5 });
    return { el };
  };

  /* ---- balken: Groessen vergleichen ---- */
  V.balken = function (spec, ctx) {
    const zl = liste(spec.zeilen, 1, "balken").map((z) => ({ z, w: zahl(z.wert) })).filter((x) => !Number.isNaN(x.w));
    if (!zl.length) throw new Error("balken: keine Zahlenwerte");
    const gmax = zahl(spec.max) > 0 ? zahl(spec.max) : Math.max(...zl.map((x) => x.w), 0) || 1;
    const el = h("div", { class: "v-bal" }, str(spec.titel) ? h("div", { class: "v-bt" }, str(spec.titel)) : null);
    zl.forEach(({ z, w }, i) => {
      const max = zahl(z.max) > 0 ? zahl(z.max) : gmax;
      const fl = h("i", { class: "v-fl" });
      fl.style.setProperty("--p", prozent(klemme((w / max) * 100, w > 0 ? 1.5 : 0, 100)));
      const wert = h("span", { class: "v-wt" }, zahlText(z.wert, z.einheit || spec.einheit));
      const zeile = h("div", { class: "v-zeile " + farbe(z.farbe) }, h("span", { class: "v-lb" }, str(z.label)), h("div", { class: "v-spur" }, fl), wert);
      el.append(zeile);
      ctx.ein(fl, { width: "0%" }, { delay: i * 0.12, dauer: 0.9, easing: "cubic-bezier(.25,.8,.25,1)" });
      ctx.ein(wert, { opacity: "0" }, { delay: 0.25 + i * 0.12, dauer: 0.6 });
    });
    return { el };
  };

  /* ---- schichten: Stapel oder Verschachtelung ---- */
  V.schichten = function (spec, ctx) {
    const eb = liste(spec.ebenen, 1, "schichten"), n = eb.length;
    const kopf = (x) => h("div", { class: "v-sh" }, ctx.ic(x.icon), h("b", null, str(x.text)), str(x.sub) ? h("span", null, str(x.sub)) : null);
    if (spec.richtung === "verschachtelt") {
      const boxen = [];
      let innen = null;
      for (let i = n - 1; i >= 0; i--) {
        const b = h("div", { class: "v-nest" }, kopf(eb[i]), innen);
        b.style.setProperty("--t", prozent(5 + i * Math.min(9, 36 / n)));
        boxen[i] = b; innen = b;
      }
      boxen.forEach((b, i) => ctx.ein(b, { opacity: "0", transform: "translateY(8px)" }, { delay: i * 0.22, dauer: 0.55 }));
      return { el: h("div", { class: "v-nestwurzel" }, boxen[0]) };
    }
    const el = h("div", { class: "v-stapel" });
    eb.forEach((x, i) => {
      const b = h("div", { class: "v-lage" }, kopf(x));
      b.style.setProperty("--t", prozent(7 + (n > 1 ? (i / (n - 1)) * 22 : 0)));
      b.style.setProperty("--b", prozent(n > 1 ? 74 + (i / (n - 1)) * 26 : 100));
      el.append(b);
      ctx.ein(b, { opacity: "0", transform: "translateY(16px)" }, { delay: (n - 1 - i) * 0.11, dauer: 0.5 });
    });
    return { el };
  };

  /* ---- raster: Dinge nebeneinander ---- */
  V.raster = function (spec, ctx) {
    const zl = liste(spec.zellen, 1, "raster"), n = zl.length;
    const sp = klemme(Math.round(Number(spec.spalten)) || (n <= 2 ? n : n === 4 ? 2 : 3), 1, 6);
    const el = h("div", { class: "v-raster" });
    el.style.setProperty("--sp", sp);
    zl.forEach((x, i) => {
      const z = h("div", { class: "v-zelle " + farbe(x.farbe) }, symbol(ctx, x.icon, "v-ik klein", null),
        h("div", { class: "v-txt" }, h("b", null, str(x.text)), str(x.sub) ? h("span", null, str(x.sub)) : null));
      el.append(z);
      ctx.ein(z, { opacity: "0", transform: "scale(.94)" }, { delay: i * 0.06, dauer: 0.45 });
    });
    return { el };
  };

  /* ---- zahlen: grosse Kennzahlen ---- */
  V.zahlen = function (spec, ctx) {
    const kl = liste(spec.kacheln, 1, "zahlen"), n = kl.length;
    const el = h("div", { class: "v-zahlen n" + Math.min(n, 4) + (n > 4 ? " viele" : "") });
    kl.forEach((x, i) => {
      const w = h("span", { class: "v-zw" }, str(x.wert));
      const k = h("div", { class: "v-zk" + (i === 0 && n > 1 ? " gross" : "") + " " + farbe(x.farbe) },
        x.icon && ctx.ic(x.icon) ? h("span", { class: "v-ik klein" }, ctx.ic(x.icon)) : null, w, h("span", { class: "v-zl" }, str(x.label)));
      el.append(k);
      ctx.ein(k, { opacity: "0", transform: "translateY(12px)" }, { delay: i * 0.12, dauer: 0.5 });
      const m = str(x.wert).match(/^(\d+)(?:,(\d+))?(.*)$/);      // nur sichere Formen zaehlen hoch: 12 | 1,5 | 99,5 %
      if (m && !/^[.\d]/.test(m[3])) {
        const dez = m[2] ? m[2].length : 0, ziel = parseFloat(m[1] + (m[2] ? "." + m[2] : "")), rest = m[3];
        ctx.start(() => {
          const t0 = performance.now() + (i * 0.12 + 0.15) * 1000, dauer = 900;
          w.textContent = (0).toFixed(dez).replace(".", ",") + rest;
          ctx.rafStart((t) => {
            const p = klemme((t - t0) / dauer, 0, 1), e = 1 - Math.pow(1 - p, 3);
            w.textContent = (ziel * e).toFixed(dez).replace(".", ",") + rest;
            if (p >= 1) { w.textContent = str(x.wert); return false; }
            return true;
          });
        });
      }
    });
    return { el };
  };

  /* ---- zeitachse: Reihenfolge in der Zeit ---- */
  V.zeitachse = function (spec, ctx) {
    const pl = liste(spec.punkte, 2, "zeitachse"), n = pl.length;
    const linie = h("div", { class: "v-zlinie" }, h("i"));
    const el = h("ol", { class: "v-zeit" }, linie);
    el.style.setProperty("--n", n);
    pl.forEach((x, i) => {
      const dot = h("span", { class: "v-zdot" + (x.icon && ctx.ic(x.icon) ? " mit" : "") + (i === n - 1 ? " ende" : "") }, ctx.ic(x.icon));
      const li = h("li", { class: "v-zp " + farbe(x.farbe) }, h("b", { class: "v-zt" }, str(x.t)), dot, h("span", { class: "v-ztext" }, str(x.text)));
      el.append(li);
      ctx.ein(dot, { transform: "scale(0)" }, { delay: 0.25 + i * 0.28, dauer: 0.4 });
      ctx.ein(li.firstChild, { opacity: "0" }, { delay: 0.25 + i * 0.28, dauer: 0.5 });
      ctx.ein(li.lastChild, { opacity: "0", transform: "translateY(6px)" }, { delay: 0.35 + i * 0.28, dauer: 0.5 });
    });
    ctx.ein(linie.firstChild, { transform: "scaleX(0)" }, { dauer: 0.25 + (n - 1) * 0.28 + 0.2, easing: "linear" });
    return { el };
  };

  /* ---- netz: Knoten und Verbindungen ---- */
  V.netz = function (spec, ctx) {
    const kn = liste(spec.knoten, 2, "netz").filter((k) => str(k.id) && Number.isFinite(Number(k.x)) && Number.isFinite(Number(k.y)));
    if (kn.length < 2) throw new Error("netz: knoten brauchen id, x und y");
    const K = {};
    kn.forEach((k) => { K[str(k.id)] = { k, x: 13 + klemme(Number(k.x), 0, 100) * 0.74, y: 12 + klemme(Number(k.y), 0, 100) * 0.76 }; });
    const kanten = arr(spec.kanten).filter((e) => Array.isArray(e) && K[str(e[0])] && K[str(e[1])] && str(e[0]) !== str(e[1]));
    const HOEHE = 56.25;
    const svg = s("svg", { class: "v-kanten", viewBox: "0 0 100 " + HOEHE, preserveAspectRatio: "none", "aria-hidden": "true" });
    const el = h("div", { class: "v-netz" }, svg);
    const linien = [], labels = [];
    kanten.forEach((e) => {
      const a = K[str(e[0])], b = K[str(e[1])];
      const l = s("line", { x1: a.x, y1: (a.y * HOEHE) / 100, x2: b.x, y2: (b.y * HOEHE) / 100, pathLength: 1, class: "v-kante" });
      svg.append(l); linien.push(l);
      if (str(e[2])) {
        const t = h("span", { class: "v-kl" }, str(e[2]));
        t.style.left = prozent((a.x + b.x) / 2); t.style.top = prozent((a.y + b.y) / 2);
        el.append(t); labels.push(t);
      }
    });
    const boxen = {};
    kn.forEach((k) => {
      const p = K[str(k.id)];
      const b = h("div", { class: "v-nk " + farbe(k.farbe) }, ctx.ic(k.icon) ? h("span", { class: "v-kc klein" }, ctx.ic(k.icon)) : null, h("span", { class: "v-kt" }, str(k.text)));
      b.style.left = prozent(p.x); b.style.top = prozent(p.y);
      el.append(b); boxen[str(k.id)] = b;
    });
    const punkt = h("span", { class: "v-punkt klein", hidden: true });
    el.append(punkt);
    Object.values(boxen).forEach((b, i) => ctx.ein(b, { opacity: "0", transform: "scale(.9)" }, { delay: i * 0.07, dauer: 0.45 }));
    const t0 = Object.keys(boxen).length * 0.07 + 0.3;
    linien.forEach((l, i) => ctx.ein(l, { strokeDashoffset: "1" }, { delay: t0 + i * 0.3, dauer: 0.55 }));
    labels.forEach((t, i) => ctx.ein(t, { opacity: "0" }, { delay: t0 + 0.2 + i * 0.3, dauer: 0.5 }));
    if (kanten.length) ctx.einEnde = Math.max(ctx.einEnde, t0 + kanten.length * 0.3 + 0.5);
    ctx.schleife(() => {
      if (!kanten.length) return;
      const seg = 1.05, D = kanten.length * seg + 0.9, kf = [], ank = {};
      kanten.forEach((e, k) => {
        const a = K[str(e[0])], b = K[str(e[1])], z0 = k * seg;
        const pa = { left: prozent(a.x), top: prozent(a.y) }, pb = { left: prozent(b.x), top: prozent(b.y) };
        kf.push(Object.assign({ offset: z0 / D, opacity: 0 }, pa), Object.assign({ offset: (z0 + 0.06) / D, opacity: 1 }, pa),
          Object.assign({ offset: (z0 + 0.85 * seg) / D, opacity: 1 }, pb), Object.assign({ offset: (z0 + 0.85 * seg + 0.08) / D, opacity: 0 }, pb));
        (ank[str(e[1])] = ank[str(e[1])] || []).push(z0 + 0.85 * seg);
      });
      kf.push(Object.assign({ offset: 1, opacity: 0 }, { left: kf[kf.length - 1].left, top: kf[kf.length - 1].top }));
      punkt.hidden = false;
      ctx.wiederhole(punkt, kf, D);
      Object.keys(ank).forEach((id) => ctx.wiederhole(boxen[id], pulsKeyframes(ank[id], D,
        { backgroundColor: "var(--flaeche)", color: "var(--text)", transform: "scale(1)" },
        { backgroundColor: "var(--c)", color: "var(--v-auf)", transform: "scale(1.06)" }, 0.35), D));
    });
    return { el };
  };

  /* ---- punkte: Punktwolken mit Klassen und Grenze ---- */
  V.punkte = function (spec, ctx) {
    const kl = objs(spec.klassen).filter((k) => Array.isArray(k.mitte) && Number.isFinite(Number(k.mitte[0])) && Number.isFinite(Number(k.mitte[1])));
    if (!kl.length) throw new Error("punkte: klassen mit mitte [x, y] noetig");
    const B = 100, H = 60, px = (x) => 4 + (x / 100) * 92, py = (y) => 4 + ((100 - y) / 100) * 52;     // y: 0 unten, 100 oben
    const rnd = samen(JSON.stringify(spec.klassen));
    const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
    const svg = s("svg", { class: "v-plot", viewBox: "0 0 " + B + " " + H, "aria-hidden": "true" }, s("rect", { x: 0, y: 0, width: B, height: H, rx: 3.2, class: "v-plotflaeche" }));
    const mitten = [], formen = [], gruppen = [];
    kl.forEach((k, ci) => {
      const m = [klemme(Number(k.mitte[0]), 0, 100), klemme(Number(k.mitte[1]), 0, 100)], streu = klemme(Number(k.streu) || 8, 1, 40), n = klemme(Math.round(Number(k.n)) || 20, 1, 80);
      mitten.push({ m, pts: [] });
      const g = s("g", { class: "v-gr " + farbe(k.farbe, ["akzent", "orange", "gruen", "k4"][ci % 4]) });
      for (let i = 0; i < n; i++) {
        const x = klemme(m[0] + gauss() * streu, 1, 99), y = klemme(m[1] + gauss() * streu, 1, 99);
        mitten[ci].pts.push([x, y]);
        const form = ci % 3 === 0 ? s("circle", { r: 1.45, class: "v-pt" }) : ci % 3 === 1 ? s("rect", { x: -1.3, y: -1.3, width: 2.6, height: 2.6, rx: 0.5, class: "v-pt" }) : s("path", { d: "M0 -1.8 L1.7 1.3 L-1.7 1.3 Z", class: "v-pt" });
        g.append(s("g", { transform: "translate(" + px(x).toFixed(2) + " " + py(y).toFixed(2) + ")" }, form));
        formen.push({ form, ci, i });
      }
      gruppen.push(g); svg.append(g);
    });
    let grenze = null;
    if (spec.grenze && kl.length >= 2) {
      // Geometrie in Bildkoordinaten, damit Mittelsenkrechte und Kreis auch wirklich so aussehen
      const sm = mitten.map((c) => [px(c.m[0]), py(c.m[1])]), sp = mitten.map((c) => c.pts.map((p) => [px(p[0]), py(p[1])]));
      const a = sm[0], b = sm[1];
      if (spec.grenze === "kreis") {
        const d = (p) => Math.hypot(p[0] - a[0], p[1] - a[1]);
        const innen = sp[0].map(d).sort((x, y) => x - y), aussen = sp.slice(1).flat().map(d).sort((x, y) => x - y);
        const r0 = innen[Math.floor(innen.length * 0.92)] || 6, r1 = aussen[Math.floor(aussen.length * 0.08)] || r0 * 2;
        grenze = s("circle", { cx: a[0].toFixed(2), cy: a[1].toFixed(2), r: Math.max(r0 + 1, (r0 + r1) / 2).toFixed(2), pathLength: 1, class: "v-grenze" });
      } else {
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = -(b[1] - a[1]), dy = b[0] - a[0], pts = [];
        const [x0, x1, y0, y1] = [4, 96, 4, 56];
        [[x0, "x"], [x1, "x"], [y0, "y"], [y1, "y"]].forEach(([w, ac]) => {
          const t = ac === "x" ? (dx ? (w - mx) / dx : NaN) : (dy ? (w - my) / dy : NaN);
          const x = mx + dx * t, y = my + dy * t;
          if (Number.isFinite(t) && x >= x0 - 0.01 && x <= x1 + 0.01 && y >= y0 - 0.01 && y <= y1 + 0.01) pts.push([x, y]);
        });
        if (pts.length >= 2) {
          pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
          const e = pts[pts.length - 1];
          grenze = s("path", { d: "M" + pts[0][0].toFixed(2) + " " + pts[0][1].toFixed(2) + " L" + e[0].toFixed(2) + " " + e[1].toFixed(2), pathLength: 1, class: "v-grenze" });
        }
      }
      if (grenze) svg.append(grenze);
    }
    const legende = h("div", { class: "v-legende" });
    kl.forEach((k, ci) => {
      const sh = ci % 3 === 0 ? s("circle", { cx: 8, cy: 8, r: 5.5 }) : ci % 3 === 1 ? s("rect", { x: 2.5, y: 2.5, width: 11, height: 11, rx: 2 }) : s("path", { d: "M8 2 L14 13 L2 13 Z" });
      legende.append(h("span", { class: "v-le " + farbe(k.farbe, ["akzent", "orange", "gruen", "k4"][ci % 4]) }, s("svg", { viewBox: "0 0 16 16", "aria-hidden": "true" }, sh), str(k.name)));
    });
    if (grenze) legende.append(h("span", { class: "v-le" }, s("svg", { viewBox: "0 0 16 16", "aria-hidden": "true" }, s("path", { d: "M2 13 L14 3", class: "v-lebahn" })), spec.grenze === "kreis" ? "Grenze (Kreis)" : "Grenze"));
    // Wolken fliegen von den Seiten ein, danach zieht sich die Grenze
    formen.forEach(({ form, ci, i }) => {
      const richtung = ci % 2 === 0 ? -1 : 1;
      ctx.ein(form, { opacity: "0", transform: "translate(" + richtung * 26 + "px," + (((i * 7) % 11) - 5) * 1.2 + "px)" }, { delay: ci * 0.25 + i * 0.015, dauer: 0.7, easing: "cubic-bezier(.2,.7,.2,1)" });
    });
    if (grenze) ctx.ein(grenze, { strokeDashoffset: "1" }, { delay: 0.35 + kl.length * 0.25 + 0.6, dauer: 0.9, easing: "ease-in-out" });
    return { el: h("div", { class: "v-punkte" }, svg, legende) };
  };

  /* ---- matrix: Tabelle als Bild ---- */
  V.matrix = function (spec, ctx) {
    const x = arr(spec.x).map(str), y = arr(spec.y).map(str), z = arr(spec.zellen);
    if (!x.length || !y.length || !z.length) throw new Error("matrix: x, y und zellen noetig");
    const el = h("div", { class: "v-mx" });
    el.style.setProperty("--sp", x.length);
    el.append(h("div", { class: "v-mxe" }, str(spec.ytitel) ? str(spec.ytitel) : null, str(spec.xtitel) && str(spec.ytitel) ? h("br") : null, str(spec.xtitel) || null));
    x.forEach((t) => el.append(h("div", { class: "v-mxk" }, t)));
    let k = 0;
    y.forEach((t, i) => {
      el.append(h("div", { class: "v-mxz" }, t));
      x.forEach((_, j) => {
        const c = arr(z[i])[j], ton = c && typeof c === "object" && ["gut", "schlecht", "neutral"].includes(c.ton) ? c.ton : "neutral";
        const text = str(c && typeof c === "object" ? c.text : c);
        const zelle = h("div", { class: "v-mxc " + ton }, ton === "gut" ? ctx.ic("check") : ton === "schlecht" ? ctx.ic("x") : null, h("span", null, text));
        el.append(zelle);
        ctx.ein(zelle, { opacity: "0", transform: "scale(.9)" }, { delay: 0.1 + k * 0.09, dauer: 0.45 }); k++;
      });
    });
    return { el };
  };

  /* ---- skala: Spektrum mit Marker ---- */
  V.skala = function (spec, ctx) {
    if (!str(spec.links) || !str(spec.rechts)) throw new Error("skala: links und rechts noetig");
    const m = klemme(Number(spec.marker), 0, 1) || 0;
    const fuell = h("i", { class: "v-sfuell" });
    const ticks = Array.from({ length: 11 }, (_, i) => { const t = h("span", { class: "v-tick" }); t.style.left = i * 10 + "%"; return t; });
    const marke = h("div", { class: "v-marke" + (m < 0.15 ? " vl" : m > 0.85 ? " vr" : "") }, str(spec.label) ? h("span", { class: "v-mlabel" }, str(spec.label)) : null, h("span", { class: "v-mknopf" }));
    const spur = h("div", { class: "v-sspur" }, fuell, ticks, marke);
    spur.style.setProperty("--p", prozent(m * 100));
    const el = h("div", { class: "v-sk" + (str(spec.label) ? " mit" : "") }, spur,
      h("div", { class: "v-enden" }, h("b", null, str(spec.links)), h("b", null, str(spec.rechts))));
    ctx.ein(marke, { left: "0%" }, { delay: 0.1, dauer: 1.1, easing: "cubic-bezier(.25,.8,.25,1)" });
    ctx.ein(fuell, { width: "0%" }, { delay: 0.1, dauer: 1.1, easing: "cubic-bezier(.25,.8,.25,1)" });
    return { el };
  };

  /* ---- token: Text in Stuecke ---- */
  V.token = function (spec, ctx) {
    const st = arr(spec.stuecke).map((x) => (x == null ? "" : String(x))).filter((x) => x.length);
    if (st.length < 2) throw new Error("token: mindestens 2 stuecke");
    const farben = ["akzent", "gruen", "orange", "k4"];
    const reihe = h("div", { class: "v-tkz" });
    st.forEach((t, i) => {
      const lead = /^ /.test(t), trail = / $/.test(t), kern = t.replace(/^ +| +$/g, "") || "·";
      const c = h("span", { class: "v-tc " + farbe(farben[i % 4]) }, lead ? h("i", { class: "v-sp" }, "·") : null, kern, trail ? h("i", { class: "v-sp" }, "·") : null);
      reihe.append(c);
      ctx.ein(c, { marginRight: "0px", backgroundColor: "transparent", borderColor: "transparent", paddingLeft: "0px", paddingRight: "0px" }, { delay: 0.3 + i * 0.13, dauer: 0.55 });
    });
    const el = h("div", { class: "v-tk" }, reihe, h("div", { class: "v-tkn" }, ctx.ic("scissors"), h("span", null, st.length + " Tokens")));
    return { el };
  };

  /* ---- quelle: Foto oder Diagramm aus den Beispieldaten ---- */
  V.quelle = function (spec) {
    const src = str(spec.src);
    if (!/^(\/static\/|static\/)[A-Za-z0-9_\-./]+$/.test(src) || src.includes("..")) throw new Error("quelle: src muss auf /static/ zeigen");
    if (!str(spec.alt)) console.warn("KL.visual: quelle ohne alt-Text", spec);
    const img = h("img", { src, alt: str(spec.alt), loading: "lazy", decoding: "async" });
    img.addEventListener("error", () => { const f = img.closest("figure"); if (f) f.hidden = true; });
    return { el: h("div", { class: "v-q" }, img), selbstbeschreibend: true };
  };
})();
