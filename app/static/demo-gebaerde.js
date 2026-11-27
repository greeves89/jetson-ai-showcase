/* demo-gebaerde: Labor "Fingeralphabet" (Seite fingeralphabet, Kamera-Modus gebaerde).
   Zwei Richtungen aus EINER Datenquelle (app/static/daten/gebaerde-vorlagen.json, gebaut von scripts/gebaerde_vorlagen_bauen.py):
     Erkennen: Der Jetson findet die Hand (21 Punkte), rechnet daraus die Handform und vergleicht sie mit den Vorlagen. Wer eine Form
               etwa 0,8 Sekunden ruhig hält, bestätigt einen Buchstaben; so wächst ein Wort. Leerzeichen und Löschen sind Gesten.
     Zeigen:   Dieselben Vorlagen werden als Vektorhand gezeichnet: ein Wort Buchstabe für Buchstabe, das ganze Alphabet, und eine Übung
               mit Rückmeldung der Kamera.
   Das Labor hängt an KL.kameraModi.gebaerde (siehe demos.js, webcam()) und nutzt dort Einwilligung, Kamerakanal, Messwerte und
   Live-Erklärung. Texte aus dem Netz (Server, Eingaben) kommen nur per textContent/h(...) ins DOM.
   Datenschutz: Das Wort liegt nur in dieser Seite (kein Speicher, kein Cookie). Nur auf Knopfdruck geht es für die Sprachausgabe
   an /api/tts. */
(function () {
  "use strict";
  const KL = window.KL;
  const h = KL.h;
  const SVGNS = "http://www.w3.org/2000/svg";
  const DATEN_URL = "/static/daten/gebaerde-vorlagen.json";
  const HALTEN_MS = 800;            // so lange eine Handform ruhig gehalten wird, bis sie als Buchstabe zählt
  const GNADE_MS = 250;             // so kurz darf die Erkennung aussetzen, ohne dass das Halten von vorn beginnt
  const FREI_MS = 350;              // nach einer Bestätigung muss die Form so lange anders (oder weg) sein, bevor derselbe Buchstabe wieder zählt
  const MAX_WORT = 40;
  const STEUER = { LEER: "Leerzeichen", LOESCHEN: "Löschen" };
  const NICHT_ERKANNT = ["J", "Z", "Ä", "Ö", "Ü", "ß", "Sch"];
  const UEBUNGSWOERTER = ["HAUS", "BAUM", "WALD", "KINO", "BROT", "TEE", "OMA", "OPA", "TAXI", "GOLD", "MOND", "LIED", "BUS", "FUCHS", "WOLKE", "SONNE", "REGEN", "STUHL"];
  const UMLAUT = { "ä": "Ä", "ö": "Ö", "ü": "Ü", "Ä": "Ä", "Ö": "Ö", "Ü": "Ü", "ß": "ß", "ẞ": "ß" };
  const reduziert = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
  const proz = (x) => Math.round((x || 0) * 100) + " %";

  /* ------------------------------------------------------------ Vorlagen laden (einmal je Seite) */
  let datenVersprechen = null;
  function datenLaden() {
    if (!datenVersprechen) {
      datenVersprechen = fetch(DATEN_URL, { cache: "no-cache" }).then((r) => {
        if (!r.ok) throw new Error("Die Handformen ließen sich nicht laden (Fehler " + r.status + ").");
        return r.json();
      }).then((d) => {
        if (!d || !d.vorlagen) throw new Error("Die Datei mit den Handformen ist unvollständig.");
        return d;
      }).catch((e) => { datenVersprechen = null; throw e; });
    }
    return datenVersprechen;
  }

  /* ------------------------------------------------------------ Text in Zeichen zerlegen */
  /* Aus einem Text werden Zeichen des Fingeralphabets: A bis Z, Ä Ö Ü ß, "sch" als ein Zeichen, Leerzeichen als Pause.
     Alles andere (Zahlen, Satzzeichen) hat das Fingeralphabet nicht und wird gemeldet. */
  function zerlege(text) {
    const t = String(text || "").normalize("NFC").slice(0, MAX_WORT);
    const zeichen = [], ignoriert = [];
    let i = 0;
    while (i < t.length) {
      const c = t[i];
      if (/^sch/i.test(t.slice(i, i + 3))) { zeichen.push({ typ: "buchstabe", z: "Sch" }); i += 3; continue; }
      if (UMLAUT[c]) zeichen.push({ typ: "buchstabe", z: UMLAUT[c] });
      else if (/^[A-Za-z]$/.test(c)) zeichen.push({ typ: "buchstabe", z: c.toUpperCase() });
      else if (/\s/.test(c)) { if (zeichen.length && zeichen[zeichen.length - 1].typ !== "pause") zeichen.push({ typ: "pause", z: " " }); }
      else if (!ignoriert.includes(c)) ignoriert.push(c);
      i++;
    }
    while (zeichen.length && zeichen[zeichen.length - 1].typ === "pause") zeichen.pop();
    return { zeichen, ignoriert };
  }

  /* ------------------------------------------------------------ Halten: aus Bildern wird ein Buchstabe */
  /* Reine Logik ohne Oberfläche (damit sie sich testen lässt). update(name, jetztMs) mit dem erkannten Namen (oder null) je Bild.
     Gibt { kandidat, fortschritt 0..1, bestaetigt: Name oder null, gesperrt: Name oder null } zurück. */
  class HalteLogik {
    constructor(haltenMs = HALTEN_MS) { this.haltenMs = haltenMs; this.reset(); }
    reset() { this.kandidat = null; this.seit = 0; this.zuletztGesehen = 0; this.gesperrt = null; this.anderSeit = 0; }
    update(name, jetzt) {
      let bestaetigt = null;
      if (this.gesperrt) {
        if (name === this.gesperrt) this.anderSeit = 0;
        else { if (!this.anderSeit) this.anderSeit = jetzt; if (jetzt - this.anderSeit >= FREI_MS) { this.gesperrt = null; this.anderSeit = 0; } }
        if (this.gesperrt) return { kandidat: null, fortschritt: 0, bestaetigt: null, gesperrt: this.gesperrt };
      }
      if (name && name === this.kandidat) this.zuletztGesehen = jetzt;
      else if (name) { this.kandidat = name; this.seit = jetzt; this.zuletztGesehen = jetzt; }
      else if (this.kandidat && jetzt - this.zuletztGesehen >= GNADE_MS) this.kandidat = null;
      let fortschritt = this.kandidat ? Math.min(1, (jetzt - this.seit) / this.haltenMs) : 0;
      if (this.kandidat && fortschritt >= 1) { bestaetigt = this.kandidat; this.gesperrt = this.kandidat; this.anderSeit = 0; this.kandidat = null; fortschritt = 0; }
      return { kandidat: this.kandidat, fortschritt, bestaetigt, gesperrt: this.gesperrt };
    }
  }

  /* ------------------------------------------------------------ Hand als Vektorgrafik */
  const GLIEDER = { zeige: [5, 6, 7, 8], mittel: [9, 10, 11, 12], ring: [13, 14, 15, 16], klein: [17, 18, 19, 20], daumen: [0, 1, 2, 3, 4] };
  const BREITE = { zeige: 0.17, mittel: 0.18, ring: 0.17, klein: 0.15, daumen: 0.2 };
  const el = (tag, attr) => { const e = document.createElementNS(SVGNS, tag); for (const k in attr) e.setAttribute(k, attr[k]); return e; };
  const mittelZ = (P, ids) => ids.reduce((s, i) => s + (P[i][2] || 0), 0) / ids.length;

  function dreheY(P, grad) {
    if (!grad) return P;
    const c = Math.cos(grad * Math.PI / 180), s = Math.sin(grad * Math.PI / 180);
    return P.map((q) => [q[0] * c + q[2] * s, q[1], -q[0] * s + q[2] * c]);
  }

  /* Eine gezeichnete Hand. setze(P, {spiegel, fit, dx, dy}): P sind 21 Punkte (x, y, z) in Handflächenlängen; fit ist die Hand, nach der
     Größe und Mitte bestimmt werden (damit eine bewegte Hand nicht springt). */
  function handZeichnung(titel) {
    const svg = el("svg", { viewBox: "0 0 200 200", role: "img", class: "hd-svg", "aria-label": titel || "Handform" });
    const teile = {};
    const palm = el("g", { class: "hd-teil" });
    const palmK = el("polygon", { class: "hd-k hd-p" }), palmF = el("polygon", { class: "hd-f hd-p" });
    palm.append(palmK, palmF);
    teile.palm = { g: palm, k: palmK, f: palmF };
    svg.append(palm);
    for (const name of Object.keys(GLIEDER)) {
      const g = el("g", { class: "hd-teil" });
      const k = el("polyline", { class: "hd-k" }), f = el("polyline", { class: "hd-f" });
      g.append(k, f);
      teile[name] = { g, k, f };
      svg.append(g);
    }
    const spur = el("polyline", { class: "hd-spur", fill: "none" });
    svg.append(spur);
    let reihenfolge = "";
    const spurPunkte = [];
    function setze(P, opt) {
      opt = opt || {};
      const sp = opt.spiegel ? -1 : 1;
      const m = (q) => [sp * q[0], q[1]];
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const q of (opt.fit || P).map(m)) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
      const gross = Math.max(x1 - x0, y1 - y0, 0.2) + (opt.rand || 0.12) * 2;
      const sk = Math.min(80, 176 / gross);
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, ox = sp * (opt.dx || 0), oy = opt.dy || 0;
      const pt = P.map((q) => { const a = m(q); return [100 + (a[0] + ox - cx) * sk, 100 + (a[1] + oy - cy) * sk]; });
      const liste = (ids) => ids.map((i) => pt[i][0].toFixed(1) + "," + pt[i][1].toFixed(1)).join(" ");
      palmK.setAttribute("points", liste([1, 5, 9, 13, 17, 0])); palmF.setAttribute("points", liste([1, 5, 9, 13, 17, 0]));
      palmK.setAttribute("stroke-width", (0.1 * sk + 4).toFixed(1)); palmF.setAttribute("stroke-width", "0");
      const z = [{ n: "palm", z: mittelZ(P, [0, 5, 9, 13, 17]) - 0.02 }];
      for (const name of Object.keys(GLIEDER)) {
        const ids = GLIEDER[name], w = BREITE[name] * sk;
        teile[name].k.setAttribute("points", liste(ids)); teile[name].f.setAttribute("points", liste(ids));
        teile[name].k.setAttribute("stroke-width", (w + 4).toFixed(1)); teile[name].f.setAttribute("stroke-width", w.toFixed(1));
        z.push({ n: name, z: mittelZ(P, name === "daumen" ? [2, 3, 4] : ids.slice(1)) });
      }
      z.sort((a, b) => a.z - b.z);
      const neu = z.map((e) => e.n).join(",");
      if (neu !== reihenfolge) { reihenfolge = neu; for (const e of z) svg.insertBefore(teile[e.n].g, spur); }
      if (opt.spur != null) {
        const q = pt[opt.spur];
        if (opt.spurNeu) spurPunkte.length = 0;
        spurPunkte.push(q[0].toFixed(1) + "," + q[1].toFixed(1));
        if (spurPunkte.length > 90) spurPunkte.shift();
        spur.setAttribute("points", spurPunkte.join(" "));
      } else if (spurPunkte.length) { spurPunkte.length = 0; spur.setAttribute("points", ""); }
    }
    return { el: svg, setze };
  }

  /* Skelett der echten Hand aus den 21 Punkten des Jetson (nur Linien), normiert auf ein quadratisches Feld */
  const VERB = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
  function skelett(titel) {
    const svg = el("svg", { viewBox: "0 0 200 200", role: "img", class: "hd-svg hd-skelett", "aria-label": titel });
    const linien = VERB.map(() => el("line", { class: "hd-sk" }));
    const punkte = Array.from({ length: 21 }, () => el("circle", { r: 3.2, class: "hd-skp" }));
    svg.append(...linien, ...punkte);
    function setze(pts, spiegel) {
      if (!pts || pts.length !== 21) { svg.classList.add("leer"); return; }
      svg.classList.remove("leer");
      let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
      for (const q of pts) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
      const g = Math.max(x1 - x0, y1 - y0, 1e-3);
      const sk = 170 / g, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const p = pts.map((q) => [100 + (spiegel ? -1 : 1) * (q[0] - cx) * sk, 100 + (q[1] - cy) * sk]);
      VERB.forEach(([a, b], i) => { linien[i].setAttribute("x1", p[a][0].toFixed(1)); linien[i].setAttribute("y1", p[a][1].toFixed(1)); linien[i].setAttribute("x2", p[b][0].toFixed(1)); linien[i].setAttribute("y2", p[b][1].toFixed(1)); });
      p.forEach((q, i) => { punkte[i].setAttribute("cx", q[0].toFixed(1)); punkte[i].setAttribute("cy", q[1].toFixed(1)); });
    }
    return { el: svg, setze };
  }

  /* ------------------------------------------------------------ Vorlesen über /api/tts (nur auf Knopfdruck) */
  let stimmeId = null;
  async function vorlesen(text, abbruch) {
    if (!stimmeId) {
      const r = await fetch("/api/tts/stimmen", { signal: abbruch && abbruch.signal });
      const d = await r.json();
      const s = (d.stimmen || [])[0];
      if (!s) throw new Error("Auf dem Jetson ist keine Stimme installiert.");
      stimmeId = s.id;
    }
    const r = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, signal: abbruch && abbruch.signal, body: JSON.stringify({ text: text.slice(0, 200), stimme: stimmeId, tempo: 1.0 }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(typeof d.fehler === "string" && d.fehler ? d.fehler : "Die Sprachausgabe hat nicht geklappt (Fehler " + r.status + ").");
    const bin = atob(d.wav_b64 || "");
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
    const audio = new Audio(url);
    audio.addEventListener("ended", () => URL.revokeObjectURL(url), { once: true });
    await audio.play();
    return audio;
  }

  /* ------------------------------------------------------------ Eigenschaften-Karte neben dem Kamerabild */
  function eigenschaften() {
    const gross = h("div", { class: "gb-gross", "aria-hidden": "true" }, "·");
    const satz = h("p", { class: "gb-satz", role: "status", "aria-live": "polite" }, "Halte eine Hand in die Kamera.");
    const balken = h("div", { class: "gb-balken" });
    const seite = h("span", { class: "gb-seite" });
    const wurzel = h("aside", { class: "d-eigen gb-eigen", "aria-label": "Handform, die der Jetson erkennt" },
      h("h3", { class: "d-eigen-titel" }, KL.icon("hand"), "Das erkennt der Jetson"),
      h("div", { class: "gb-karte" }, gross, h("div", { class: "gb-text" }, satz, seite)), balken);
    let zuletzt = "";
    function zeige(d) {
      const name = d.buchstabe || d.steuerung;
      const text = d.zustand === "keine_hand" ? "Keine Hand im Bild."
        : d.zustand === "erkannt" ? (d.steuerung ? "Geste: " + STEUER[d.steuerung] + "." : "Buchstabe " + d.buchstabe + ", " + proz(d.sicher) + " sicher.")
        : d.zustand === "keine_form" ? "Eine Hand, aber keine Handform des Alphabets."
        : "Nicht sicher" + (d.vermutung ? ", vermutet: " + (STEUER[d.vermutung] || d.vermutung) : "") + ".";
      const schluessel = text + "|" + (d.kandidaten || []).map((k) => k.join(":")).join(",") + "|" + d.seite;
      if (schluessel === zuletzt) return;
      zuletzt = schluessel;
      gross.textContent = name ? (d.steuerung ? (d.steuerung === "LEER" ? "␣" : "←") : name) : (d.zustand === "unsicher" ? "?" : "·");
      gross.classList.toggle("sicher", !!name);
      satz.textContent = text;
      seite.textContent = d.seite && d.seite !== "unklar" ? (d.seite === "rechts" ? "rechte Hand" : "linke Hand") : "";
      balken.replaceChildren(...(d.kandidaten || []).map(([n, s]) => h("div", { class: "d-balkenzeile" },
        h("span", { class: "d-bname" }, STEUER[n] || n), h("span", { class: "d-bar" }, h("i", { style: "width:" + Math.round(s * 100) + "%;background:var(--akzent)" })), h("span", { class: "d-wert" }, proz(s)))));
    }
    return { el: wurzel, zeige };
  }

  /* ------------------------------------------------------------ Oberfläche unter dem Kamerabild */
  function oberflaeche(api) {
    const L = api.L;
    let daten = null;                 // { vorlagen, bewegt, stufen }
    let spiegel = false;              // Händigkeit: Vorlagen für die linke Hand spiegeln
    let tab = "lesen";
    const beiDaten = [];              // Funktionen, die laufen, sobald die Vorlagen da sind
    const aufraeumer = [];
    L.onEnde(() => aufraeumer.forEach((f) => { try { f(); } catch (e) { /* egal */ } }));

    const kopf = h("div", { class: "gb-kopf" });
    const tabs = [["lesen", "Wort lesen", "scan-search"], ["ueben", "Üben", "target"], ["zeigen", "Wort zeigen", "type"], ["alphabet", "Alphabet", "book-open"]];
    const tabKnoepfe = tabs.map(([id, name, symbol]) => h("button", { type: "button", role: "tab", class: "gb-tab", id: "gb-tab-" + id, "aria-selected": id === tab ? "true" : "false", "aria-controls": "gb-tafel-" + id, onclick: () => wechsel(id) }, KL.icon(symbol), name));
    const tabLeiste = h("div", { class: "gb-tabs", role: "tablist", "aria-label": "Was möchtest du tun?" }, tabKnoepfe);
    const spiegelBox = h("input", { type: "checkbox", id: "gb-spiegel", onchange: () => { spiegel = spiegelBox.checked; beiDaten.forEach((f) => f("spiegel")); } });
    const spiegelZeile = h("label", { class: "gb-spiegel", for: "gb-spiegel" }, spiegelBox,
      h("span", null, "Linkshänder: Handformen gespiegelt zeigen. Die Erkennung selbst braucht das nicht, sie erkennt linke und rechte Hand."));
    const meldung = h("p", { class: "d-hinweis gb-meldung", role: "status", hidden: true });
    const tafeln = {};
    for (const [id] of tabs) tafeln[id] = h("section", { class: "gb-tafel", role: "tabpanel", id: "gb-tafel-" + id, "aria-labelledby": "gb-tab-" + id, hidden: id !== tab });
    const wurzel = h("div", { class: "gb-wurzel" }, tabLeiste, spiegelZeile, meldung, ...Object.values(tafeln));

    function wechsel(id) {
      tab = id;
      tabKnoepfe.forEach((b, i) => b.setAttribute("aria-selected", tabs[i][0] === id ? "true" : "false"));
      for (const k in tafeln) tafeln[k].hidden = k !== id;
      beiDaten.forEach((f) => f("tab"));
      if (id === "lesen") lesen.zuruecksetzen();
    }

    function zeichenVorlage(z) {
      // Welche Punktvorlage zeigt das Zeichen? Bewegte Zeichen zeigen ihre Grundform.
      if (!daten) return null;
      if (daten.vorlagen[z]) return daten.vorlagen[z].punkte;
      const b = daten.bewegt[z];
      return b && daten.vorlagen[b.basis] ? daten.vorlagen[b.basis].punkte : null;
    }
    const beschreibung = (z) => {
      if (daten.vorlagen[z] && !STEUER[z]) return daten.vorlagen[z].beschreibung;
      const b = daten.bewegt[z];
      return b ? b.grund : "";
    };
    const stufeVon = (z) => {
      if (NICHT_ERKANNT.includes(z)) return { stufe: "nicht", text: "nicht erkannt" };
      const s = daten.stufen && daten.stufen[z];
      if (!s) return { stufe: "nicht", text: "nicht erkannt" };
      return s.stufe === "sicher" ? { stufe: "sicher", text: "im Test sicher" } : { stufe: "unsicher", text: "im Test unsicher" };
    };

    /* Animation einer Zeichenfolge in einer Hand: Gleiten zwischen Handformen, bewegte Buchstaben mit Spur */
    function lerpP(A, B, t) { return A.map((q, i) => [q[0] + (B[i][0] - q[0]) * t, q[1] + (B[i][1] - q[1]) * t, q[2] + (B[i][2] - q[2]) * t]); }
    const sanft = (t) => t * t * (3 - 2 * t);
    function bewegungsStand(z, t) {
      // t: 0..1 innerhalb des Haltens; liefert { dx, dy, roll, spur }
      const b = daten.bewegt[z];
      if (!b || !b.bewegung || b.bewegung.length < 2) return { dx: 0, dy: 0, roll: 0, spur: null };
      const k = b.bewegung, n = k.length;
      const f = Math.min(0.9999, t) * (n - 1), i = Math.floor(f), u = sanft(f - i);
      const a = k[i], c = k[i + 1];
      return { dx: a[0] + (c[0] - a[0]) * u, dy: a[1] + (c[1] - a[1]) * u, roll: a[2] + (c[2] - a[2]) * u, spur: z === "Z" ? 8 : z === "J" ? 20 : null };
    }

    /* ======================== Tafel: Alphabet ======================== */
    const alphabet = (() => {
      const detail = h("div", { class: "gb-detail" });
      const raster = h("div", { class: "gb-raster", role: "list" });
      const tabelle = h("div", { class: "gb-tabelle" });
      tafeln.alphabet.append(h("p", { class: "gb-lead" }, "Alle Zeichen zum Nachschlagen. Ein Klick zeigt die Handform groß mit ihrer Beschreibung. Die Farbe sagt, wie gut das Labor das Zeichen im Test erkennt."), detail, raster, tabelle);
      let gewaehlt = "A", detailAnim = 0;
      const karten = new Map();
      aufraeumer.push(() => cancelAnimationFrame(detailAnim));
      function zeigeDetail(z) {
        gewaehlt = z;
        karten.forEach((k, name) => k.setAttribute("aria-pressed", name === z ? "true" : "false"));
        const P = zeichenVorlage(z);
        detail.replaceChildren();
        if (!P) return;
        const hz = handZeichnung("Handform für " + z);
        const st = stufeVon(z);
        detail.append(h("div", { class: "gb-detail-bild" }, hz.el),
          h("div", { class: "gb-detail-text" },
            h("h3", null, "Zeichen " + z), h("p", null, beschreibung(z)),
            h("p", { class: "gb-stufe gb-stufe-" + st.stufe }, st.text + (daten.stufen && daten.stufen[z] && st.stufe !== "sicher" && st.stufe !== "nicht" ? ", wird leicht mit " + daten.stufen[z].nachbar + " verwechselt" : "") + "."),
            NICHT_ERKANNT.includes(z) ? h("p", { class: "d-leise" }, "Das Labor erkennt dieses Zeichen nicht. Es zeigt nur die Handform (mit Bewegung, wenn nötig) zum Nachschlagen.") : null));
        cancelAnimationFrame(detailAnim);
        if (daten.bewegt[z] && !reduziert()) {
          const start = performance.now();
          const schritt = () => {
            if (L.weg || !hz.el.isConnected) return;
            const t = ((performance.now() - start) % 2600) / 2600;
            const b = bewegungsStand(z, t);
            hz.setze(dreheY(P, b.roll), { spiegel, fit: P, dx: b.dx, dy: b.dy, spur: b.spur, spurNeu: t < 0.03, rand: 0.45 });
            detailAnim = requestAnimationFrame(schritt);
          };
          detailAnim = requestAnimationFrame(schritt);
        } else hz.setze(P, { spiegel });
      }
      function bauen() {
        raster.replaceChildren();
        karten.clear();
        const alle = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").concat(["Ä", "Ö", "Ü", "ß", "Sch"]);
        for (const z of alle) {
          const P = zeichenVorlage(z);
          const hz = handZeichnung("");
          hz.el.setAttribute("aria-hidden", "true");
          if (P) hz.setze(P, { spiegel });
          const st = stufeVon(z);
          const k = h("button", { type: "button", class: "gb-kachel gb-stufe-" + st.stufe, role: "listitem", "aria-pressed": "false", "aria-label": "Zeichen " + z + ", " + st.text, onclick: () => zeigeDetail(z) },
            hz.el, h("b", null, z), h("small", null, st.text));
          karten.set(z, k);
          raster.append(k);
        }
        // Tabelle: sicher / unsicher / nicht erkannt, aus den Messungen der Vorlagen
        const sicher = [], unsicher = [];
        for (const z of "ABCDEFGHIKLMNOPQRSTUVWXY".split("")) {
          const s = daten.stufen && daten.stufen[z];
          if (!s) continue;
          if (s.stufe === "sicher") sicher.push(z); else unsicher.push(z + " (mit " + s.nachbar + ")");
        }
        tabelle.replaceChildren(h("table", { class: "gb-tab-tabelle" },
          h("caption", null, "Erkennung im Test an den Vorlagen (Simulation, nicht an echten Händen gemessen)"),
          h("thead", null, h("tr", null, h("th", { scope: "col" }, "Gruppe"), h("th", { scope: "col" }, "Zeichen"))),
          h("tbody", null,
            h("tr", null, h("th", { scope: "row" }, "Im Test sicher erkannt"), h("td", null, sicher.join(", ") + ", dazu die Gesten Leerzeichen und Löschen")),
            h("tr", null, h("th", { scope: "row" }, "Im Test unsicher"), h("td", null, unsicher.join(", "))),
            h("tr", null, h("th", { scope: "row" }, "Nicht erkannt (Bewegung, keine eigene Form)"), h("td", null, "J, Z, Ä, Ö, Ü, ß, Sch")))),
          h("p", { class: "d-hinweis" }, "Gemessen wurde an den Vorlagen: Jede Handform wurde 40 Mal mit Streuung (Winkel der Finger bis etwa 14 Grad, Rauschen auf den Punkten, leichte Drehung) erkannt. „Sicher“ heißt, dass mindestens 85 von 100 Varianten richtig bestimmt wurden. Wie gut echte Hände erkannt werden, sagt das nicht: Dafür muss jemand es live ausprobieren."));
      }
      beiDaten.push((was) => { if (!daten) return; if (was === "daten") { bauen(); zeigeDetail(gewaehlt); } else if (was === "spiegel") { bauen(); zeigeDetail(gewaehlt); } });
      return { zeigeDetail };
    })();

    /* ======================== Tafel: Wort zeigen ======================== */
    const zeigen = (() => {
      const feld = h("input", { type: "text", id: "gb-wort", maxlength: MAX_WORT, autocomplete: "off", spellcheck: "false", "aria-describedby": "gb-wort-hilfe", placeholder: "Dein Name oder ein Wort", value: "Hallo" });
      const hz = handZeichnung("Handform");
      const grossBuchstabe = h("div", { class: "gb-zeigen-z", "aria-hidden": "true" }, "·");
      const zaehler = h("p", { class: "gb-zeigen-zaehler" });
      const text = h("p", { class: "gb-zeigen-text", "aria-live": "polite" });
      const hinweis = h("p", { class: "d-hinweis", id: "gb-wort-hilfe" }, "Buchstaben, Umlaute, ß und „sch“ werden gezeigt. Zahlen und Satzzeichen hat das Fingeralphabet nicht. Leerzeichen sind kurze Pausen.");
      const kette = h("div", { class: "gb-kette", role: "group", "aria-label": "Buchstaben des Wortes" });
      let tempo = 1;
      const TEMPI = [["Langsam", 1.9], ["Normal", 1], ["Schnell", 0.6]];
      const tempoKnoepfe = TEMPI.map(([n, f], i) => h("button", { type: "button", class: "btn klein gb-tempo", "aria-pressed": i === 1 ? "true" : "false", onclick: () => { tempo = f; tempoKnoepfe.forEach((b, j) => b.setAttribute("aria-pressed", j === i ? "true" : "false")); } }, n));
      const spielen = h("button", { type: "button", class: "btn primary", onclick: () => start() }, KL.icon("play"), "Zeigen");
      const nochmal = h("button", { type: "button", class: "btn", onclick: () => start() }, KL.icon("repeat"), "Wiederholen");
      const stopp = h("button", { type: "button", class: "btn", onclick: () => halt(), hidden: true }, "Anhalten");
      let lauf = 0;                     // Nummer des laufenden Abspielens (alte Läufe hören auf)
      let zeichen = [];
      function kettenBauen() {
        kette.replaceChildren(...zeichen.map((z, i) => h("button", { type: "button", class: "gb-kettenglied", "aria-label": z.typ === "pause" ? "Pause" : "Zeichen " + z.z, onclick: () => springe(i) }, z.typ === "pause" ? "·" : z.z)));
      }
      function markiere(i) { Array.from(kette.children).forEach((b, j) => b.classList.toggle("aktuell", j === i)); }
      function beschreibeZeichen(z) {
        if (z.typ === "pause") return "Pause zwischen zwei Wörtern.";
        return beschreibung(z.z) + (NICHT_ERKANNT.includes(z.z) ? " (Bewegung, wird vom Labor nicht erkannt)" : "");
      }
      function zeigeEins(i) {
        const z = zeichen[i];
        if (!z) return;
        markiere(i);
        grossBuchstabe.textContent = z.typ === "pause" ? "␣" : z.z;
        zaehler.textContent = (i + 1) + " von " + zeichen.length;
        text.textContent = beschreibeZeichen(z);
      }
      const warte = (ms) => new Promise((ok) => { const t = setTimeout(ok, ms); aufraeumer.push(() => clearTimeout(t)); });
      async function formen(P, Q, dauer, mein) {
        // gleitet von Form P zu Form Q
        if (reduziert()) { hz.setze(Q, { spiegel }); return; }
        const t0 = performance.now();
        await new Promise((ok) => {
          const f = () => {
            if (L.weg || mein !== lauf) return ok();
            const t = Math.min(1, (performance.now() - t0) / dauer);
            hz.setze(lerpP(P, Q, sanft(t)), { spiegel });
            if (t < 1) requestAnimationFrame(f); else ok();
          };
          requestAnimationFrame(f);
        });
      }
      async function haltenMitBewegung(z, P, ms, mein) {
        const b = daten.bewegt[z.z];
        if (!b || reduziert() || z.typ === "pause") { await warte(ms); return; }
        const t0 = performance.now();
        await new Promise((ok) => {
          const f = () => {
            if (L.weg || mein !== lauf) return ok();
            const t = Math.min(1, (performance.now() - t0) / ms);
            const s = bewegungsStand(z.z, t);
            hz.setze(dreheY(P, s.roll), { spiegel, fit: P, dx: s.dx, dy: s.dy, spur: s.spur, spurNeu: t < 0.03, rand: 0.45 });
            if (t < 1) requestAnimationFrame(f); else ok();
          };
          requestAnimationFrame(f);
        });
      }
      async function springe(i) { halt(); zeigeEins(i); const P = zeichenVorlage(zeichen[i].z); if (P) hz.setze(P, { spiegel }); }
      function halt() { lauf++; stopp.hidden = true; spielen.hidden = false; }
      async function start() {
        if (!daten) return;
        const z = zerlege(feld.value);
        zeichen = z.zeichen;
        kettenBauen();
        hinweis.textContent = z.ignoriert.length ? "Nicht gezeigt, weil das Fingeralphabet sie nicht hat: " + z.ignoriert.join(" ") : "Buchstaben, Umlaute, ß und „sch“ werden gezeigt. Zahlen und Satzzeichen hat das Fingeralphabet nicht. Leerzeichen sind kurze Pausen.";
        if (!zeichen.length) { text.textContent = "Schreib ein Wort mit Buchstaben, dann zeige ich es dir."; grossBuchstabe.textContent = "·"; zaehler.textContent = ""; return; }
        const mein = ++lauf;
        stopp.hidden = false; spielen.hidden = true;
        let vorher = zeichenVorlage("S");
        for (let i = 0; i < zeichen.length; i++) {
          if (L.weg || mein !== lauf) return;
          const zz = zeichen[i];
          zeigeEins(i);
          if (zz.typ === "pause") { await warte(700 * tempo); continue; }
          const P = zeichenVorlage(zz.z);
          if (!P) continue;
          await formen(vorher, P, 380 * Math.min(tempo, 1.4) + 120, mein);
          await haltenMitBewegung(zz, P, (daten.bewegt[zz.z] ? 1700 : 950) * tempo, mein);
          vorher = P;
        }
        if (mein === lauf) { stopp.hidden = true; spielen.hidden = false; text.textContent = "Das war das ganze Wort. Mit Wiederholen siehst du es noch einmal, mit dem Tempo kannst du es langsamer machen."; }
      }
      feld.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); start(); } });
      tafeln.zeigen.append(
        h("p", { class: "gb-lead" }, "Tippe ein Wort oder deinen Namen. Die Hand zeigt es Buchstabe für Buchstabe, so wie es in der Gebärdensprache buchstabiert wird."),
        h("div", { class: "gb-eingabe" }, h("label", { for: "gb-wort" }, "Wort"), feld, spielen, stopp, nochmal),
        hinweis,
        h("div", { class: "gb-zeigen" },
          h("div", { class: "gb-zeigen-hand" }, hz.el),
          h("div", { class: "gb-zeigen-info" }, grossBuchstabe, zaehler, text,
            h("div", { class: "gb-tempi", role: "group", "aria-label": "Tempo" }, KL.icon("gauge"), ...tempoKnoepfe))),
        kette);
      beiDaten.push((was) => {
        if (!daten) return;
        if (was === "daten") { const P = zeichenVorlage("A"); hz.setze(P, { spiegel }); }
        if (was === "spiegel") { const i = Array.from(kette.children).findIndex((b) => b.classList.contains("aktuell")); const P = zeichenVorlage(i >= 0 && zeichen[i] && zeichen[i].typ !== "pause" ? zeichen[i].z : "A"); if (P) hz.setze(P, { spiegel }); }
        if (was === "tab") halt();
      });
      return {};
    })();

    /* ======================== Tafel: Wort lesen (Erkennen) ======================== */
    const lesen = (() => {
      const halten = new HalteLogik();
      const wortFeld = h("input", { type: "text", id: "gb-ergebnis", maxlength: MAX_WORT, autocomplete: "off", spellcheck: "false", "aria-label": "Das gelesene Wort", placeholder: "Hier wächst dein Wort" });
      const ring = el("svg", { viewBox: "0 0 44 44", class: "gb-ring", "aria-hidden": "true" });
      const ringSpur = el("circle", { cx: 22, cy: 22, r: 18, class: "gb-ring-spur" });
      const ringBogen = el("circle", { cx: 22, cy: 22, r: 18, class: "gb-ring-bogen", transform: "rotate(-90 22 22)", "stroke-dasharray": (2 * Math.PI * 18).toFixed(1), "stroke-dashoffset": (2 * Math.PI * 18).toFixed(1) });
      ring.append(ringSpur, ringBogen);
      const aktuell = h("div", { class: "gb-aktuell", "aria-hidden": "true" }, "·");
      const status = h("p", { class: "gb-lesen-status", role: "status", "aria-live": "polite" }, "Starte oben die Kamera und zeige einen Buchstaben. Halte die Form etwa eine Sekunde ruhig.");
      const sprechMeld = h("p", { class: "d-hinweis", role: "status", "aria-live": "polite" });
      const lauf = (() => { let c = null; return { neu() { if (c) c.abort(); c = new AbortController(); return c; } }; })();
      const anfuegen = (z) => { if (wortFeld.value.length < MAX_WORT) wortFeld.value += z; };
      const loeschen = () => { wortFeld.value = wortFeld.value.slice(0, -1); };
      const sprechKnopf = h("button", { type: "button", class: "btn", onclick: async () => {
        const t = wortFeld.value.trim();
        if (!t) { sprechMeld.textContent = "Es steht noch kein Wort im Feld."; return; }
        sprechMeld.textContent = "Der Text geht jetzt einmal an den Jetson, er wird gesprochen und nicht gespeichert.";
        try { await vorlesen(t, lauf.neu()); sprechMeld.textContent = ""; } catch (e) { if (!(e && e.name === "AbortError")) sprechMeld.textContent = (e && e.message) || "Das Vorlesen hat nicht geklappt."; }
      } }, KL.icon("volume-2"), "Vorlesen");
      const knoepfe = h("div", { class: "gb-tasten", role: "group", "aria-label": "Wort bearbeiten" },
        h("button", { type: "button", class: "btn klein", onclick: () => anfuegen(" ") }, "Leerzeichen"),
        h("button", { type: "button", class: "btn klein", onclick: loeschen }, KL.icon("undo-2"), "Letztes löschen"),
        h("button", { type: "button", class: "btn klein", onclick: () => { wortFeld.value = ""; } }, KL.icon("trash-2"), "Alles löschen"),
        sprechKnopf);
      const extra = h("div", { class: "gb-extra", role: "group", "aria-label": "Zeichen, die das Labor nicht erkennt, einfügen" },
        h("span", null, "Nicht erkannt, zum Eintippen:"), ...NICHT_ERKANNT.map((z) => h("button", { type: "button", class: "btn klein", "aria-label": z + " einfügen", onclick: () => anfuegen(z === "Sch" ? "Sch" : z) }, z)));
      const geste = h("p", { class: "d-hinweis" }, "Gesten: Eine ganz offene Hand mit gespreizten Fingern ist ein Leerzeichen. Eine Faust mit dem Daumen nach unten löscht den letzten Buchstaben. Zwischen zwei gleichen Buchstaben nimmst du die Hand kurz weg.");
      tafeln.lesen.append(
        h("p", { class: "gb-lead" }, "Zeige der Kamera Buchstaben des Fingeralphabets. Hältst du eine Form etwa 0,8 Sekunden ruhig, übernimmt das Labor den Buchstaben ins Wort."),
        h("div", { class: "gb-lesen" }, h("div", { class: "gb-anzeige" }, aktuell, ring), h("div", { class: "gb-lesen-rechts" }, h("label", { for: "gb-ergebnis", class: "gb-label" }, "Dein Wort"), wortFeld, status)),
        knoepfe, extra, sprechMeld, geste);
      api.L.onEnde(() => lauf.neu());
      function neuerStand(d) {
        if (tab !== "lesen") return;
        const name = d.zustand === "erkannt" ? (d.buchstabe || d.steuerung) : null;
        const e = halten.update(name, performance.now());
        const umfang = 2 * Math.PI * 18;
        ringBogen.setAttribute("stroke-dashoffset", (umfang * (1 - e.fortschritt)).toFixed(1));
        aktuell.textContent = e.kandidat ? (STEUER[e.kandidat] ? (e.kandidat === "LEER" ? "␣" : "←") : e.kandidat) : (d.zustand === "unsicher" ? "?" : "·");
        if (e.bestaetigt) {
          if (e.bestaetigt === "LEER") anfuegen(" ");
          else if (e.bestaetigt === "LOESCHEN") loeschen();
          else anfuegen(e.bestaetigt);
          status.textContent = e.bestaetigt === "LEER" ? "Leerzeichen übernommen." : e.bestaetigt === "LOESCHEN" ? "Letztes Zeichen gelöscht." : "Buchstabe " + e.bestaetigt + " übernommen. Zeige den nächsten.";
        } else if (e.gesperrt) status.textContent = "Übernommen. Wechsle die Handform oder nimm die Hand kurz weg für den nächsten Buchstaben.";
        else if (e.kandidat) status.textContent = "Halte " + (STEUER[e.kandidat] ? "die Geste " + STEUER[e.kandidat] : "den Buchstaben " + e.kandidat) + " ruhig …";
        else status.textContent = d.zustand === "keine_hand" ? "Ich sehe keine Hand. Halte sie mit der ganzen Handfläche ins Bild."
          : d.zustand === "unsicher" ? "Ich bin mir nicht sicher." + (d.vermutung ? " Das könnte " + (STEUER[d.vermutung] || d.vermutung) + " sein, aber die Sicherheit reicht nicht." : "") + " Halte die Form ruhiger oder deutlicher."
          : d.zustand === "keine_form" ? "Diese Handform gehört nicht zum Alphabet, das ich kenne." : "Ich lese mit.";
      }
      return { neuerStand, zuruecksetzen() { halten.reset(); ringBogen.setAttribute("stroke-dashoffset", (2 * Math.PI * 18).toFixed(1)); aktuell.textContent = "·"; } };
    })();

    /* ======================== Tafel: Üben ======================== */
    const ueben = (() => {
      const modus = { art: "buchstabe", ziele: [], index: 0, geschafft: 0 };
      const halten = new HalteLogik();
      const vorlageHand = handZeichnung("Vorlage der gesuchten Handform");
      const skel = skelett("Deine Hand, wie der Jetson sie sieht");
      const aufgabe = h("div", { class: "gb-aufgabe-z", "aria-hidden": "true" }, "·");
      const aufgabeText = h("p", { class: "gb-aufgabe-text", "aria-live": "polite" }, "Wähle oben, ob du einen Buchstaben oder ein Wort üben willst.");
      const rueck = h("p", { class: "gb-rueck", role: "status", "aria-live": "polite" });
      const nahe = h("div", { class: "gb-nahe", role: "img", "aria-label": "Wie nah deine Hand an der Vorlage ist" }, h("i", { style: "width:0%" }));
      const nahText = h("span", { class: "gb-nahe-text" }, "");
      const tippListe = h("ul", { class: "gb-tipps" });
      const buchstabenModus = h("button", { type: "button", class: "btn", "aria-pressed": "true", onclick: () => setzeModus("buchstabe") }, "Ein Buchstabe");
      const wortModus = h("button", { type: "button", class: "btn", "aria-pressed": "false", onclick: () => setzeModus("wort") }, "Ein Wort");
      const wortFeld = h("input", { type: "text", id: "gb-uwort", maxlength: 12, autocomplete: "off", spellcheck: "false", "aria-label": "Wort zum Üben", placeholder: "Wort oder Name", hidden: true });
      const weiter = h("button", { type: "button", class: "btn", onclick: () => naechster(true) }, KL.icon("shuffle"), "Anderer Buchstabe");
      const los = h("button", { type: "button", class: "btn primary", onclick: () => neu() }, KL.icon("target"), "Aufgabe stellen");
      const kette = h("div", { class: "gb-kette", role: "group", "aria-label": "Fortschritt im Wort" });
      const erkennbar = () => Object.keys(daten.vorlagen).filter((k) => !STEUER[k]);
      function setzeModus(art) {
        modus.art = art;
        buchstabenModus.setAttribute("aria-pressed", art === "buchstabe" ? "true" : "false");
        wortModus.setAttribute("aria-pressed", art === "wort" ? "true" : "false");
        wortFeld.hidden = art !== "wort"; weiter.hidden = art !== "buchstabe";
        neu();
      }
      function neu() {
        if (!daten) return;
        halten.reset();
        modus.geschafft = 0; modus.index = 0;
        let notiz = "";
        if (modus.art === "buchstabe") {
          const sichere = erkennbar().filter((k) => (daten.stufen[k] || {}).stufe === "sicher");
          const pool = sichere.length ? sichere : erkennbar();
          modus.ziele = [pool[Math.floor(Math.random() * pool.length)]];
        } else {
          let w = wortFeld.value.trim();
          if (!w) { w = UEBUNGSWOERTER[Math.floor(Math.random() * UEBUNGSWOERTER.length)]; wortFeld.value = w; }
          const z = zerlege(w);
          const gut = z.zeichen.filter((c) => c.typ === "buchstabe" && daten.vorlagen[c.z] && !STEUER[c.z]);
          const raus = z.zeichen.filter((c) => c.typ === "buchstabe" && !(daten.vorlagen[c.z] && !STEUER[c.z])).map((c) => c.z);
          modus.ziele = gut.map((c) => c.z);
          if (raus.length) notiz = "Übersprungen, weil das Labor sie nicht erkennt: " + Array.from(new Set(raus)).join(", ") + ".";
          if (!modus.ziele.length) { aufgabe.textContent = "·"; aufgabeText.textContent = "In diesem Wort steht kein Buchstabe, den das Labor erkennt. Nimm ein anderes Wort."; api.sende({ ziel: "" }); kettenBauen(); return; }
        }
        zeigeZiel();
        if (notiz) rueck.textContent = notiz;
      }
      function kettenBauen() {
        kette.replaceChildren(...modus.ziele.map((z, i) => h("span", { class: "gb-kettenglied" + (i < modus.index ? " fertig" : i === modus.index ? " aktuell" : "") }, z)));
        kette.hidden = modus.art !== "wort";
      }
      function zeigeZiel() {
        const z = modus.ziele[modus.index];
        kettenBauen();
        if (!z) {
          aufgabe.textContent = "✓"; aufgabeText.textContent = modus.art === "wort" ? "Geschafft: das ganze Wort." : "Geschafft.";
          api.sende({ ziel: "" });
          return;
        }
        aufgabe.textContent = z;
        aufgabeText.textContent = (modus.art === "wort" ? "Buchstabe " + (modus.index + 1) + " von " + modus.ziele.length + ": " : "Zeige den Buchstaben " + z + ". ") + daten.vorlagen[z].beschreibung;
        const P = daten.vorlagen[z].punkte;
        vorlageHand.setze(P, { spiegel });
        rueck.textContent = "";
        nahe.firstChild.style.width = "0%"; nahText.textContent = "";
        tippListe.replaceChildren();
        api.sende({ ziel: z });
      }
      function naechster(neuerBuchstabe) {
        if (neuerBuchstabe) { neu(); return; }
        modus.index++; modus.geschafft++; halten.reset();
        zeigeZiel();
      }
      tafeln.ueben.append(
        h("p", { class: "gb-lead" }, "Die Seite nennt dir einen Buchstaben, du zeigst ihn der Kamera. Du siehst die Vorlage, die Punkte deiner Hand und wie nah du bist. Starte oben die Kamera."),
        h("div", { class: "gb-uebung-steuer" }, buchstabenModus, wortModus, wortFeld, los, weiter),
        h("div", { class: "gb-uebung" },
          h("figure", { class: "gb-uebung-bild" }, h("figcaption", null, "Vorlage"), vorlageHand.el),
          h("figure", { class: "gb-uebung-bild" }, h("figcaption", null, "Deine Hand (21 Punkte)"), skel.el),
          h("div", { class: "gb-uebung-info" }, aufgabe, aufgabeText, kette, nahe, nahText, rueck, tippListe)));
      wortFeld.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); neu(); } });
      beiDaten.push((was) => {
        if (!daten) return;
        if (was === "daten") { skel.setze(null); setzeModus("buchstabe"); if (tab !== "ueben") api.sende({ ziel: "" }); }
        if (was === "spiegel") { const z = modus.ziele[modus.index]; if (z) vorlageHand.setze(daten.vorlagen[z].punkte, { spiegel }); }
        if (was === "tab") { if (tab === "ueben") zeigeZiel(); else { halten.reset(); api.sende({ ziel: "" }); } }
      });
      api.beiVerbindung(() => { const z = modus.ziele[modus.index]; if (tab === "ueben" && z) api.sende({ ziel: z }); });
      function neuerStand(d) {
        if (tab !== "ueben" || !daten) return;
        skel.setze(d.punkte || null, false);
        const z = modus.ziele[modus.index];
        if (!z) return;
        const ok = d.zustand === "erkannt" && d.buchstabe === z;
        const e = halten.update(ok ? z : null, performance.now());
        if (typeof d.ziel_sicher === "number") {
          nahe.firstChild.style.width = Math.round(d.ziel_sicher * 100) + "%";
          nahText.textContent = "Nähe zur Vorlage: " + proz(d.ziel_sicher);
        } else { nahe.firstChild.style.width = "0%"; nahText.textContent = d.zustand === "keine_hand" ? "Keine Hand im Bild." : ""; }
        tippListe.replaceChildren(...((d.hinweise && !ok) ? d.hinweise : []).map((t) => h("li", null, t)));
        if (e.bestaetigt === z) {
          rueck.textContent = "Richtig: " + z + ".";
          modus.geschafft++; modus.index++;
          halten.reset();
          setTimeout(() => { if (!L.weg) zeigeZiel(); }, 700);
          return;
        }
        if (e.kandidat === z) rueck.textContent = "Gut, halte es noch kurz …";
        else if (d.zustand === "erkannt" && d.buchstabe && d.buchstabe !== z) rueck.textContent = "Das sieht nach " + d.buchstabe + " aus, gesucht ist " + z + ".";
        else if (d.zustand === "keine_hand") rueck.textContent = "Halte die Hand ins Bild.";
        else rueck.textContent = "Noch nicht ganz.";
      }
      return { neuerStand, zuruecksetzen() { halten.reset(); } };
    })();

    /* ======================== Anbindung an die Kamera ======================== */
    api.beiAntwort((d) => { lesen.neuerStand(d); ueben.neuerStand(d); });
    datenLaden().then((d) => {
      if (L.weg) return;
      daten = d;
      beiDaten.forEach((f) => f("daten"));
    }).catch((e) => { if (!L.weg) { meldung.hidden = false; meldung.textContent = (e && e.message) || "Die Handformen ließen sich nicht laden."; } });
    return wurzel;
  }

  /* ------------------------------------------------------------ Anmeldung beim Kamera-Modus */
  (KL.kameraModi = KL.kameraModi || {}).gebaerde = {
    dingMehr: "Hände",
    suche: "nach einer Hand",
    klasse: "d-gebaerde",
    beschriftung: ["Deine Kamera", "Vom Jetson zurück, mit Handpunkten"],
    hinweis: "Das ist eine Schätzung eines KI-Modells aus 21 Handpunkten. Handformen werden verwechselt, besonders ähnliche. Es wird nichts gespeichert.",
    statusUrl: "/api/fingeralphabet/status",
    statusFehler: "Dieses Labor ist auf diesem Jetson noch nicht eingerichtet: Die Handmodelle oder die Datei mit den Handformen fehlen. Der Betreiber holt die Modelle mit scripts/modelle_laden.sh.",
    treffer: (d) => (d.buchstabe ? d.buchstabe : d.steuerung ? STEUER[d.steuerung] : d.anzahl ? "?" : "·"),
    gefunden: (d) => d.zustand === "keine_hand" ? "Gefunden: keine Hand."
      : d.zustand === "erkannt" ? "Gefunden: eine Hand, Handform " + (STEUER[d.buchstabe || d.steuerung] || d.buchstabe) + " (" + proz(d.sicher) + " sicher)."
      : "Gefunden: eine Hand, aber keine sichere Handform.",
    eigenschaften,
    extra: oberflaeche,
  };
  KL.demos = KL.demos || {};
  KL.demos["webcam-gebaerde"] = (root, seite) => KL.kamera(root, "gebaerde", seite);
  // Für Tests: die reinen Bausteine
  KL.gebaerde = { HalteLogik, zerlege, handZeichnung, datenLaden, HALTEN_MS, FREI_MS, GNADE_MS };
})();
