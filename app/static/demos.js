/* KI-Labor: Live-Labore (Webcam Gesicht, Hände und Gesichter, Objekt, Anlernen, Chat, RAG, Agent).
   Vertrag siehe app.js. Jedes Labor: KL.demos.<name> = function (root, seite) { ...; return { destroy() {} }; }
   Alle Texte aus dem Netz (Modell, Server, Eingaben) kommen nur per textContent oder h(...) ins DOM. */
(function () {
  "use strict";
  const KL = window.KL;
  const h = KL.h;

  /* ------------------------------------------------------------ gemeinsame Hilfen */
  const de = (x, d = 1) => Number(x).toFixed(d).replace(".", ",");
  const kb = (b) => Math.max(1, Math.round(b / 1024)) + " KB";
  const msText = (x) => (x < 10 ? de(x, 1) : String(Math.round(x))) + " ms";
  const sekText = (ms) => de(ms / 1000, 1) + " s";
  const kurz = (s, n) => { s = String(s); return s.length > n ? s.slice(0, n - 1) + "…" : s; };

  const SVG = {
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',
    stop: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  };
  function ic(name) {
    if (!SVG[name]) return KL.icon(name);
    const doc = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg" class="ic" viewBox="0 0 24 24" aria-hidden="true">' + SVG[name] + "</svg>", "image/svg+xml");
    return document.importNode(doc.documentElement, true);
  }

  /* Aufraeum-Sammler: destroy() ruft alles auf, danach ist weg = true. */
  function leben() {
    const ende = [];
    const L = {
      weg: false,
      onEnde(f) { ende.push(f); },
      timeout(f, ms) { const t = setTimeout(() => { if (!L.weg) f(); }, ms); ende.push(() => clearTimeout(t)); return t; },
      interval(f, ms) { const t = setInterval(() => { if (!L.weg) f(); }, ms); ende.push(() => clearInterval(t)); return t; },
      abbruch() { const c = new AbortController(); ende.push(() => c.abort()); return c; },
      destroy() { L.weg = true; for (const f of ende.splice(0)) { try { f(); } catch (e) { /* egal */ } } },
    };
    return L;
  }

  /* Hoechstens einmal je "wait" ms ausfuehren, der letzte Aufruf wird nachgeholt. */
  function drossel(fn, wait) {
    let letzte = 0, timer = null, args = null;
    const f = (...a) => {
      args = a;
      const jetzt = performance.now();
      if (jetzt - letzte >= wait) { letzte = jetzt; clearTimeout(timer); timer = null; fn(...a); return; }
      if (!timer) timer = setTimeout(() => { timer = null; letzte = performance.now(); fn(...args); }, wait - (jetzt - letzte));
    };
    f.jetzt = (...a) => { clearTimeout(timer); timer = null; letzte = performance.now(); fn(...a); };
    f.stop = () => { clearTimeout(timer); timer = null; };
    return f;
  }

  function postS(pfad, obj, signal) {
    return fetch(pfad, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj || {}), signal });
  }
  async function antwortFehler(r) {
    let d = null;
    try { d = await r.json(); } catch (e) { /* kein JSON */ }
    if (d && (d.belegt || d.limit)) return String(d.fehler || KL.last.TEXT);
    if (r.status === 403) return "Der Jetson hat die Anfrage abgelehnt. Öffne das Labor über die normale Adresse des Jetson.";
    if (d && d.fehler) return String(d.fehler);
    return "Der Jetson antwortet mit Fehler " + r.status + ".";
  }
  /* Wie postS, aber mit freundlichem Wiederholen, wenn der Rechner ausgelastet ist (siehe laien.js). bei meldet den Zaehler. */
  const postLast = (pfad, obj, signal, bei, opt) => KL.last.post(pfad, obj, signal, bei, opt);
  const istBelegt = (e) => !!e && e.name === "BelegtFehler";
  const NETZ_AUS = "Keine Verbindung zum Labor. Prüfe dein Netz und versuche es noch einmal.";
  function netzFehler(e) {
    if (e && e.name === "AbortError") return null;
    if (e && e.message && !/fetch|network|load failed/i.test(e.message)) return e.message;
    return NETZ_AUS;
  }
  async function streamLesen(r, bei) {
    const rd = r.body.getReader();
    const dec = new TextDecoder();
    let gesamt = "";
    for (;;) {
      const { done, value } = await rd.read();
      if (done) break;
      gesamt += dec.decode(value, { stream: true });
      bei(gesamt);
    }
    gesamt += dec.decode();
    bei(gesamt);
    return gesamt;
  }

  /* Kamera */
  async function kameraOeffnen() {
    if (!window.isSecureContext) throw new Error("Der Browser erlaubt die Kamera nur über eine HTTPS-Verbindung. Öffne das Labor über die https-Adresse des Jetson und bestätige dort die Zertifikatswarnung.");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("Dieser Browser kann nicht auf die Kamera zugreifen. Probiere einen aktuellen Browser wie Safari, Chrome oder Firefox.");
    await KL.einwilligung.verlangen("kamera", { sendet: true });      // erst erklären, dann den Browser fragen
    try {
      return await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }, audio: false });
    } catch (e) {
      const n = e && e.name;
      if (n === "NotAllowedError" || n === "SecurityError") throw new Error("Der Browser darf die Kamera nicht benutzen. Erlaube den Zugriff über das Kamerasymbol in der Adressleiste und drücke dann noch einmal auf Kamera starten.");
      if (n === "NotFoundError" || n === "OverconstrainedError") throw new Error("Es wurde keine Kamera gefunden. Schließe eine Webcam an oder öffne das Labor auf einem Gerät mit Kamera.");
      if (n === "NotReadableError" || n === "AbortError") throw new Error("Die Kamera wird gerade von einem anderen Programm benutzt. Schließe dieses Programm und versuche es noch einmal.");
      throw new Error("Die Kamera ließ sich nicht starten" + (n ? " (" + n + ")" : "") + ".");
    }
  }
  function kameraStoppen(stream, video) {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (video) { try { video.pause(); } catch (e) { /* egal */ } video.srcObject = null; }
  }
  /* Ein 4:3-Ausschnitt der Kamera als JPEG-DataURL (480x360, Qualitaet 0,6). */
  function bildAufnehmen(video, canvas) {
    const vw = video.videoWidth || video.naturalWidth, vh = video.videoHeight || video.naturalHeight;   // Video oder Beispielbild
    let sw = vw, sh = vw * 3 / 4, sx = 0, sy = 0;
    if (sh > vh) { sh = vh; sw = vh * 4 / 3; }
    sx = (vw - sw) / 2; sy = (vh - sh) / 2;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.6);
  }
  const neuesCanvas = () => { const c = document.createElement("canvas"); c.width = 480; c.height = 360; return c; };

  /* Meldungsfeld (Ursache und Ausweg) */
  function meldungBox() {
    const text = h("span");
    const erneut = h("button", { type: "button", class: "btn klein", hidden: true }, ic("refresh-cw"), "Noch einmal versuchen");
    const el = h("div", { class: "d-meldung", role: "alert", hidden: true }, ic("alert"), text, erneut);
    let handler = null;
    erneut.addEventListener("click", () => { const f = handler; el.hidden = true; if (f) f(); });
    /* zeige(text, wiederholen): mit Funktion erscheint der Knopf "Noch einmal versuchen" */
    return { el, zeige(t, wiederholen) { text.textContent = t; handler = wiederholen || null; erneut.hidden = !wiederholen; el.hidden = false; }, weg() { el.hidden = true; handler = null; } };
  }

  /* Live-Erklaerung: Titel, Streifen, Legende, Satz */
  function liveBlock(titel) {
    const satz = h("p", { class: "erklaerung", "aria-live": "polite", "aria-atomic": "true" });
    const pipe = h("div", { class: "pipe", role: "img" });
    const leg = h("div", { class: "pipeleg" });
    const el = h("div", { class: "live d-live" }, h("div", { class: "titel" }, ic("live"), titel), pipe, leg, satz);
    return {
      el, satz,
      /* segs: [{k, cls, farbe, wert, text, name}] */
      pipe(segs, beschreibung) {
        const gueltig = segs.filter((s) => s.wert > 0);
        const behalten = new Set(gueltig.map((s) => s.k));
        for (const c of Array.from(pipe.children)) if (!behalten.has(c.dataset.k)) c.remove();
        for (const s of gueltig) {
          let c = pipe.querySelector('[data-k="' + s.k + '"]');
          if (!c) { c = h("div", { dataset: { k: s.k }, class: s.cls || "" }); pipe.append(c); }
          if (s.farbe) c.style.background = s.farbe;
          c.style.flex = s.wert + " 1 0";
          c.textContent = s.text || "";
          c.dataset.text = s.text || "";
          c.title = s.name ? s.name + (s.text ? ": " + s.text : "") : "";
        }
        // Reihenfolge wie in segs
        for (const s of gueltig) pipe.append(pipe.querySelector('[data-k="' + s.k + '"]'));
        pipe.setAttribute("aria-label", beschreibung || "Zeitanteile");
        // Passt der Wert nicht in den schmalen Abschnitt, steht er nur in der Legende (statt abgeschnitten im Balken)
        for (const c of Array.from(pipe.children)) { if (c.textContent !== c.dataset.text) c.textContent = c.dataset.text; if (c.scrollWidth > c.clientWidth + 1) c.textContent = ""; }
        leg.replaceChildren(...segs.map((s) => h("span", null, h("i", { class: "d-sw " + (s.cls || ""), style: s.farbe ? "background:" + s.farbe : null }), s.name + (s.text && s.wert > 0 ? ": " + s.text : ""))));
      },
      text(...teile) { satz.replaceChildren(...teile); },
    };
  }
  const fett = (t) => h("b", null, t);

  /* ============================================================ Beispielmodus
     Die Labore lesen seite.query.beispiel (z. B. /anlernen?beispiel=fertigung-sortieren), suchen den Eintrag im Katalog
     (KL.beispiele(), Quelle app/static/beispiele/manifest.json) und laden die fertigen Daten. Nur Eintraege, deren
     "lab" zum Labor passt, werden geladen. Texte aus dem Katalog kommen nur per textContent ins DOM. */
  const bspUrl = (pfad) => "/static/beispiele/" + pfad;
  function bildLaden(pfad) {
    return new Promise((ok, fehl) => {
      const img = new Image();
      img.onload = () => ok(img);
      img.onerror = () => fehl(new Error("Das Beispielbild " + pfad + " ließ sich nicht laden."));
      img.src = bspUrl(pfad);
    });
  }
  async function textLaden(pfad) {
    const r = await fetch(bspUrl(pfad), { cache: "no-cache" });
    if (!r.ok) throw new Error("Die Beispieldatei " + pfad + " ließ sich nicht laden.");
    return r.text();
  }
  function beispielKopf(e) {
    const status = h("p", { class: "d-bsp-status", role: "status", "aria-live": "polite" });
    const el = h("section", { class: "d-beispiel", "aria-label": "Beispiel: " + e.titel },
      h("div", { class: "d-bsp-kopf" }, ic("rocket"), h("b", null, "Beispiel: " + e.titel), h("span", { class: "chip" }, e.bereich)),
      h("p", { class: "d-bsp-text" }, e.beschreibung),
      // Beispiel-Sprachaufnahmen sind synthetisch (beispiele/QUELLEN.md): sichtbar kennzeichnen, nicht nur im Aufklapper
      e.daten && e.daten.audio ? h("p", { class: "ki-hinweis" }, KL.icon("audio-lines"), h("span", null, "Die Stimme der Beispielaufnahme ist KI-erzeugt. Der Inhalt ist erfunden.")) : null,
      h("p", { class: "d-bsp-text d-leise" }, e.ziel),
      h("details", { class: "d-bsp-mehr" }, h("summary", null, "Ablauf in Schritten"), h("ol", null, (e.ablauf || []).map((a) => h("li", null, a)))),
      (e.erwartung || e.hinweis) ? h("details", { class: "d-bsp-mehr" }, h("summary", null, "Was du erwarten kannst"),
        e.erwartung ? h("p", null, e.erwartung) : null, e.hinweis ? h("p", { class: "d-leise" }, e.hinweis) : null) : null,
      status);
    return { el, status, text(t) { status.textContent = t; } };
  }
  /* "Beispiel starten" soll nicht oben auf der Seite landen: zum Labor scrollen, damit man sieht, was passiert. */
  function zumLabor(root) {
    const block = (root.closest && root.closest("#ausprobieren")) || root;
    const ruhig = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => block.scrollIntoView({ block: "start", behavior: ruhig ? "auto" : "smooth" }));
  }
  /* Hebt den Knopf hervor, den man als Naechstes drueckt (bis zum Klick), und setzt den Fokus darauf. */
  function hervor(btn) {
    if (!btn) return;
    btn.classList.add("d-hervor");
    btn.addEventListener("click", () => btn.classList.remove("d-hervor"), { once: true });
    try { btn.focus({ preventScroll: true }); } catch (e) { /* egal */ }
  }
  /* Haengt den Kopf oben in root ein und ruft fn(eintrag, kopf), wenn ?beispiel= zu diesem Labor passt. */
  function beispielStart(root, seite, lab, L, fn) {
    const id = seite && seite.query && seite.query.beispiel;
    if (!id) return;
    KL.beispiele().then((m) => {
      if (L.weg) return;
      const e = (m.usecases || []).find((u) => u.id === id);
      if (!e || e.lab !== lab) {
        const k = h("section", { class: "d-beispiel" }, h("p", { class: "d-bsp-text" }, !e
          ? "Dieses Beispiel gibt es nicht. Das Labor läuft ganz normal, du kannst es selbst ausprobieren."
          : "Dieses Beispiel gehört zu einem anderen Labor. Öffne es über die Seite des Use-Cases."));
        root.prepend(k);
        return;
      }
      const kopf = beispielKopf(e);
      root.prepend(kopf.el);
      zumLabor(root);
      return fn(e, kopf);
    }).catch((err) => { if (!L.weg) root.prepend(h("section", { class: "d-beispiel" }, h("p", { class: "d-bsp-text" }, "Das Beispiel ließ sich nicht laden: " + (err && err.message ? err.message : "unbekannter Fehler")))); });
  }
  /* Prueft einen Antworttext gegen antwort_enthaelt/oder (ohne Beachtung der Gross-/Kleinschreibung). */
  function antwortPasst(f, text) {
    const t = String(text).toLowerCase();
    const muster = [f.antwort_enthaelt].concat(f.oder || []).filter(Boolean).map((x) => String(x).toLowerCase());
    return muster.length ? muster.some((x) => t.includes(x)) : null;
  }
  KL.beispiel = { url: bspUrl, bildLaden, textLaden, kopf: beispielKopf, start: beispielStart, antwortPasst, hervor };

  /* Kennzeichnung nach KI-Verordnung (Art. 50) und Llama-Lizenz (Abschnitt 1.b.i): kurzer, sichtbarer Hinweis am
     Ausgabebereich jeder Sprachmodell-Antwort. Gemeinsam fuer Chat, RAG, Agent und die Bausteine mit echtem Modell. */
  KL.kiHinweis = function (opt) {
    // Text und Link in einem Satzfluss (ein span): der Rahmen nutzt die ganze Breite des Bereichs, auch bei grosser Schrift; der Link bricht mit dem Text um
    // opt {text, link}: Kennzeichnung fuer Ergebnisse anderer Modelle (Bildlabore), ohne den Llama-Hinweis
    if (opt && opt.text) return h("p", { class: "ki-hinweis" }, KL.icon("bot"), h("span", null, opt.text + " ", h("a", { href: "/lizenzen" }, opt.link || "Modelle und Lizenzen")));
    return h("p", { class: "ki-hinweis" }, KL.icon("bot"),
      h("span", null, "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges. ", h("a", { href: "/lizenzen" }, "Built with Llama")));
  };

  /* Hinweise unter einer Chat-Antwort: Das kleine Modell (3B) erklaert Sprachmodelle und KI oft falsch und rechnet schlecht. Die Pruefung laeuft im Browser
     ueber Stichwoerter in Frage und Antwort; sie ersetzt nichts, sie verweist nur auf die gepruefte Erklaerung. */
  const KI_THEMA = /Sprachmodell|Token|Training|Chatbot|neuronal|\bKI\b|\bLLM|künstliche Intelligenz|Llama|ChatGPT/i;
  const RECHEN_THEMA = /\d\s*(?:[-+*\/×÷:^=]|mal|plus|minus|geteilt)\s*\d|rechne|berechn|ausrechn|gleichung|ableitung|integral|wurzel|prozent|gradient|summe von|wie viel ist|wie viele ist/i;
  KL.antwortWarnungen = function (frage, antwort) {
    const aus = [];
    const box = (symbol, kopf, ...rest) => h("div", { class: "ki-warn", role: "note" }, KL.icon(symbol), h("p", null, h("b", null, kopf), " ", ...rest));
    if (RECHEN_THEMA.test(frage)) aus.push(box("triangle-alert", "Kleine Modelle rechnen schlecht.", "Rechne das Ergebnis selbst nach, zum Beispiel mit dem Taschenrechner."));
    if (KI_THEMA.test(frage) || KI_THEMA.test(antwort)) {
      const sd = KL.INHALT.seiten["tokens-sprachmodelle"];
      aus.push(box("triangle-alert", "Das kleine Modell irrt bei Erklärungen zur KI oft.", "Geprüfte Erklärung: Seite ", sd ? h("a", { href: "/tokens-sprachmodelle" }, "Tokens und Sprachmodelle") : "Tokens und Sprachmodelle", "."));
    }
    return aus;
  };

  /* Baustein fuer die Use-Case-Seiten (widget: "beispielstart"): Knopf, der das passende Labor mit dem Beispiel oeffnet. */
  KL.widgets.beispielstart = function (root, seite) {
    const id = String((seite && seite.id) || "").replace(/^uc-/, "");
    const box = h("div", { class: "d-bsp-start" });
    root.append(box);
    let weg = false;
    KL.beispiele().then((m) => {
      if (weg) return;
      const e = (m.usecases || []).find((u) => u.id === id);
      if (!e) { box.append(h("p", { class: "d-hinweis" }, "Für diesen Fall gibt es kein fertiges Beispiel.")); return; }
      const labor = KL.INHALT.seiten[e.lab];
      box.append(
        h("p", { class: "d-bsp-text" }, e.ziel),
        h("div", { class: "zeile" },
          h("a", { class: "btn primary", href: "#/" + e.lab + "?beispiel=" + e.id }, ic("rocket"), "Beispiel starten"),
          h("span", { class: "chip" }, "Labor: " + (labor ? (labor.nav || labor.titel) : e.lab)),
          e.live ? h("span", { class: "chip" }, "braucht deine Kamera") : null),
        h("p", { class: "d-hinweis" }, "Die Daten sind schon vorbereitet. Du musst nur noch klicken."));
    });
    return { destroy() { weg = true; } };
  };

  /* Eigenschaften-Karten fuer Haende und Gesichter (Labor Haende und Gesichter). Je erkannter Hand und je erkanntem Gesicht
     eine kleine Karte; Karten werden aktualisiert statt neu gebaut und verschwinden erst nach einigen Bildern ohne Treffer.
     Alle Werte kommen vom Server und gelangen nur als Text ins DOM. */
  const AUSDRUCK_ICON = { froh: "smile", neutral: "meh", traurig: "frown", wütend: "angry", angewidert: "annoyed", überrascht: "zap", ängstlich: "ghost" };
  const KARTEN_FARBE = { hand: ["#2a8cff", "#ffaa3c"], gesicht: ["#76b900", "#28c8be", "#eb6e50"] };      // wie die Zeichnung im Bild (RGB)
  const GESTE_ICON = { "Daumen hoch": "thumbs-up", "Daumen runter": "thumbs-down" };
  const proz = (x) => Math.round((x || 0) * 100) + " %";
  function eigenschaften() {
    const liste = h("div", { class: "d-karten", "aria-live": "polite" });
    const leer = h("p", { class: "d-hinweis d-karten-leer" }, "Halte eine Hand oder dein Gesicht in die Kamera. Für jede erkannte Hand und jedes Gesicht erscheint hier eine Karte.");
    const el = h("aside", { class: "d-eigen", "aria-label": "Eigenschaften der erkannten Hände und Gesichter" },
      h("h3", { class: "d-eigen-titel" }, ic("scan-face"), "Das erkennt der Jetson"), liste, leer);
    const karten = new Map();                   // "hand1" / "gesicht2" -> { el, felder, fehlt }
    const MAX_FEHLT = 6;
    function karteBauen(art, nr, titel, symbol) {
      const farben = KARTEN_FARBE[art];
      const punkt = h("i", { class: "d-karte-punkt", style: "background:" + farben[(nr - 1) % farben.length], "aria-hidden": "true" });
      const symbolEl = h("span", { class: "d-karte-symbol" }, KL.icon(symbol));
      const kopf = h("div", { class: "d-karte-kopf" }, punkt, h("b", null, titel + " " + nr), symbolEl);
      const felder = {};
      const zeilen = (art === "hand" ? [["seite", "Seite"], ["geste", "Geste"], ["finger", "Finger gestreckt"], ["sicher", "Sicherheit"]]
        : [["ausdruck", "Ausdruck"], ["laechelt", "Lächeln"], ["kopf", "Kopfhaltung"]]).map(([k, name]) => {
        felder[k] = h("b", null, "·");
        return h("div", { class: "d-feld" }, h("span", null, name), felder[k]);
      });
      const e = h("div", { class: "d-karte d-karte-" + art }, kopf, ...zeilen);
      return { el: e, felder, symbolEl, symbol, fehlt: 0 };
    }
    function setze(k, name, wert) { if (k.felder[name].textContent !== wert) k.felder[name].textContent = wert; }
    function symbolSetzen(k, symbol) { if (k.symbol !== symbol) { k.symbol = symbol; k.symbolEl.replaceChildren(KL.icon(symbol)); } }
    function zeige(d) {
      const jetzt = new Set();
      for (const hd of d.haende || []) {
        const key = "hand" + hd.nr; jetzt.add(key);
        let k = karten.get(key);
        if (!k) { k = karteBauen("hand", hd.nr, "Hand", "hand"); karten.set(key, k); liste.append(k.el); }
        k.fehlt = 0; k.el.classList.remove("alt");
        setze(k, "seite", hd.seite === "rechts" ? "rechte Hand" : hd.seite === "links" ? "linke Hand" : "nicht sicher");
        setze(k, "geste", hd.geste);
        setze(k, "finger", String(hd.finger));
        setze(k, "sicher", proz(hd.sicher));
        symbolSetzen(k, GESTE_ICON[hd.geste] || "hand");
      }
      for (const g of d.gesichter || []) {
        const key = "gesicht" + g.nr; jetzt.add(key);
        let k = karten.get(key);
        if (!k) { k = karteBauen("gesicht", g.nr, "Gesicht", "scan-face"); karten.set(key, k); liste.append(k.el); }
        k.fehlt = 0; k.el.classList.remove("alt");
        setze(k, "ausdruck", g.ausdruck + " (" + proz(g.sicher) + ")");
        setze(k, "laechelt", g.laechelt ? "ja" : "nein");
        setze(k, "kopf", g.kopf);
        symbolSetzen(k, AUSDRUCK_ICON[g.ausdruck] || "scan-face");
      }
      for (const [key, k] of Array.from(karten)) {
        if (jetzt.has(key)) continue;
        k.fehlt++;
        k.el.classList.add("alt");
        if (k.fehlt >= MAX_FEHLT) { k.el.remove(); karten.delete(key); }
      }
      leer.hidden = karten.size > 0;
    }
    return { el, zeige };
  }

  /* ============================================================ 1 Webcam: Gesicht und Objekt */
  function webcam(root, modus, seite) {
    const objekt = modus === "objekt";
    const hg = modus === "hand_gesicht";            // Haende und Gesichter gleichzeitig, mit Eigenschaften-Karten
    /* Weitere Modi melden sich mit KL.kameraModi[modus] = { dingMehr, suche, klasse, eigenschaften(), treffer(d), gefunden(d),
       hinweis, statusUrl, statusFehler, beschriftung: [links, rechts], messwert } an (siehe demo-*.js). Der Kanal ist app/kamera_modi.py. */
    const konf = (!hg && KL.kameraModi && KL.kameraModi[modus]) || null;
    const L = leben();
    const dingEin = objekt ? "Objekt" : "Gesicht";
    const dingMehr = konf ? konf.dingMehr : objekt ? "Objekte" : hg ? "Hände / Gesichter" : "Gesichter";
    const suche = konf ? konf.suche : objekt ? "nach Objekten" : hg ? "nach Händen und Gesichtern" : "nach Gesichtern";

    const video = h("video", { autoplay: true, playsinline: true, "aria-label": "Deine Kamera", hidden: true });
    video.muted = true;
    const platzV = h("div", { class: "d-platz" }, ic("camera"), h("span", null, "Die Kamera ist aus. Starte sie mit dem Knopf oben."));
    const platzR = h("div", { class: "d-platz" }, ic("arrow"), h("span", null, "Hier erscheint das Bild, das der Jetson zurückschickt."));
    let img = null;
    let vorlage = null;      // Beispielbild-Element, nur im Beispielmodus
    const eigen = hg ? eigenschaften() : konf && konf.eigenschaften ? konf.eigenschaften() : null;
    const kameras = h("div", { class: "kameras" + (hg ? " d-hg" : "") + (konf && konf.klasse ? " " + konf.klasse : "") },
      h("figure", null, h("figcaption", null, (konf && konf.beschriftung && konf.beschriftung[0]) || "Deine Kamera"), video, platzV),
      h("figure", null, h("figcaption", null, (konf && konf.beschriftung && konf.beschriftung[1]) || "Vom Jetson zurück"), platzR),
      eigen ? eigen.el : null);

    const btn = h("button", { type: "button", class: "btn primary" }, ic("camera"), "Kamera starten");
    const status = h("span", { class: "chip", role: "status" }, "Kamera aus");
    const meld = meldungBox();

    const mTreffer = h("b", null, "·"), mRunde = h("b", null, "·"), mFps = h("b", null, "·");
    const messwerte = h("div", { class: "messwerte" },
      h("div", { class: "messwert" }, dingMehr + " im Bild", mTreffer),
      h("div", { class: "messwert" }, "Runde gesamt", mRunde),
      h("div", { class: "messwert" }, "Bilder pro Sekunde", mFps));

    const live = liveBlock("Live-Erklärung");
    live.text("Starte die Kamera. Dann siehst du hier Schritt für Schritt, was Browser, Netz und Jetson mit jedem Bild machen.");

    // Schwelle (nur Objekt)
    let schwelle = 50, regler = null, schwelleSatz = null, schwelleOut = null, sendeTimer = null;
    if (objekt) {
      const inp = h("input", { type: "range", id: "d-schwelle", min: 10, max: 90, step: 5, value: 50, "aria-describedby": "d-schwelle-satz" });
      schwelleOut = h("output", { for: "d-schwelle" }, "50 %");
      schwelleSatz = h("p", { class: "d-hinweis", id: "d-schwelle-satz" });
      const satzSchwelle = () => {
        const s = schwelle;
        schwelleSatz.textContent = s <= 30
          ? "Bei " + s + " Prozent zeigt der Jetson auch Objekte, bei denen er sich nur wenig sicher ist. Das sind mehr Treffer und mehr Fehlalarme."
          : s >= 70
            ? "Bei " + s + " Prozent zeigt der Jetson nur Objekte, bei denen er sich sehr sicher ist. Das sind weniger Fehlalarme, aber er übersieht mehr."
            : "Bei " + s + " Prozent zeigt der Jetson Objekte ab mittlerer Sicherheit. Das ist ein Kompromiss zwischen Treffern und Fehlalarmen.";
      };
      satzSchwelle();
      inp.addEventListener("input", () => {
        schwelle = Number(inp.value);
        schwelleOut.textContent = schwelle + " %";
        satzSchwelle();
        clearTimeout(sendeTimer);
        sendeTimer = setTimeout(schwelleSenden, 150);
      });
      L.onEnde(() => clearTimeout(sendeTimer));
      regler = KL.gruppe("Erkennung", [h("div", { class: "regler" }, h("label", { for: "d-schwelle" }, "Schwelle"), inp, schwelleOut)], { fuss: schwelleSatz, klasse: "d-regler" });
    }
    function schwelleSenden() {
      if (!objekt || !ws || ws.readyState !== 1) return;
      ws.send(JSON.stringify({ schwelle: schwelle / 100 }));
      if (bildQuelle && !wartet) aufnehmenUndSenden();      // stehendes Beispielbild: mit neuer Schwelle noch einmal auswerten
    }

    /* Schnittstelle fuer KL.kameraModi[modus].extra(api): L (Aufraeumen), sende(objekt) schickt eine Steuernachricht an den Modus
       (Python: steuern()), beiVerbindung(fn) laeuft bei jedem (Wieder-)Verbinden, ladend(fn) bekommt jede Antwort (JSON des Jetson). */
    const beiVerbindung = [], beiAntwort = [];
    const kameraApi = {
      L, video,
      sende(o) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); },
      beiVerbindung(f) { beiVerbindung.push(f); },
      beiAntwort(f) { beiAntwort.push(f); },
    };
    // regler gibt es nur im Objekt-Modus; Element.append(null) wuerde sonst das Wort "null" in die Seite schreiben
    root.append(...[
      h("div", { class: "zeile d-steuer" }, btn, status),
      meld.el, kameras, hg ? KL.kiHinweis({ text: "Alles hier sind Schätzungen eines KI-Modells. Gesten, Kopfhaltung und vor allem der Gesichtsausdruck können falsch sein. Es wird nichts gespeichert." }) : konf && konf.hinweis ? KL.kiHinweis({ text: konf.hinweis }) : null,
      konf && konf.extra ? konf.extra(kameraApi) : null,
      regler, messwerte, live.el].filter(Boolean));

    /* Zustand */
    let stream = null, ws = null, laeuft = false, startet = false, wartet = false;
    let tStart = 0, tBrowser = 0, versuche = 0, wachhund = null, neuTimer = null;
    let bildQuelle = null, gesendetFuer = null;      // Beispielbild statt Kamera: ein stehendes Bild, wird einmal je Auswahl gesendet
    const canvas = neuesCanvas();
    const reihen = { b: [], n: [], d: [], e: [], k: [], w: [], t: [] };
    const stempel = [];
    let letzte = null;
    const schiebe = (a, v) => { a.push(v); if (a.length > 8) a.shift(); };
    const mittel = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);

    function setStatus(t, live) { status.textContent = t; status.classList.toggle("live", !!live); }

    function zeichne(satzAuch) {
      if (!letzte) return;
      const b = mittel(reihen.b), n = mittel(reihen.n), d = mittel(reihen.d), e = mittel(reihen.e), k = mittel(reihen.k), w = mittel(reihen.w), t = mittel(reihen.t);
      mTreffer.textContent = konf && konf.treffer ? konf.treffer(letzte) : hg ? (letzte.haende || []).length + " / " + (letzte.gesichter || []).length : String(letzte.anzahl);
      mRunde.textContent = msText(t);
      let fps = 0;
      if (stempel.length > 1) fps = (stempel.length - 1) / ((stempel[stempel.length - 1] - stempel[0]) / 1000);
      mFps.textContent = fps ? de(fps, 1) : "·";
      const segs = [
        { k: "b", cls: "s1", wert: b, text: msText(b), name: "1 Browser: Bild aufnehmen und packen" },
        { k: "n", cls: "s2", wert: n, text: msText(n), name: "2 Netz" },
        { k: "d", cls: "s3", wert: d, text: msText(d), name: "3 Jetson entpackt" },
        { k: "e", cls: "s4", wert: e, text: msText(e), name: "4 Jetson erkennt" },
        { k: "k", cls: "s5", wert: k, text: msText(k), name: "5 Jetson packt zurück" },
      ];
      if (w >= 0.5) segs.push({ k: "w", cls: "s6", wert: w, text: msText(w), name: "6 Warten" });
      live.pipe(segs, "Zeit je Schritt: Browser " + msText(b) + ", Netz " + msText(n) + ", entpacken " + msText(d) + ", erkennen " + msText(e) + ", zurückpacken " + msText(k));
      if (!satzAuch) return;
      const namen = { b: "im Browser beim Aufnehmen", n: "im Netz", d: "beim Entpacken", e: "beim Erkennen", k: "beim Zurückpacken", w: "beim Warten" };
      const werte = { b, n, d, e, k, w };
      const groesster = Object.keys(werte).sort((x, y) => werte[y] - werte[x])[0];
      const nH = (letzte.haende || []).length, nG = (letzte.gesichter || []).length;
      const wasGefunden = konf && konf.gefunden ? konf.gefunden(letzte) : hg ? "Gefunden: " + nH + (nH === 1 ? " Hand" : " Hände") + " und " + nG + (nG === 1 ? " Gesicht." : " Gesichter.") : letzte.anzahl === 0 ? "Gefunden: kein " + dingEin + "." : "Gefunden: " + letzte.anzahl + " " + (letzte.anzahl === 1 ? dingEin : dingMehr) + ".";
      const teile = [
        "Dein Browser hat ein Bild (" + letzte.breite + " mal " + letzte.hoehe + ", " + kb(letzte.bytes_ein) + ") geschickt. Der Jetson hat es in " + msText(d) + " entpackt und in " + msText(e) + " " + suche + " durchsucht",
        objekt ? " (Schwelle " + Math.round((letzte.schwelle || 0.5) * 100) + " Prozent). " : ". ",
        fett(wasGefunden),
        " Das Bild mit den Markierungen (" + kb(letzte.bytes_aus) + ") hat er in " + msText(k) + " zurückgepackt. ",
      ];
      if (hg && letzte.detail_ms) teile.push("Davon gingen " + msText(letzte.detail_ms.gesicht + letzte.detail_ms.ausdruck) + " an die Gesichter und " + msText(letzte.detail_ms.handsuche + letzte.detail_ms.handpunkte) + " an die Hände" + (letzte.detail_ms.neu_gesucht ? ", mit neuer Suche nach Handflächen. " : ", die Hände folgten der letzten Lage. "));
      if (w >= 0.5) teile.push("Vor dem Erkennen musste er " + msText(w) + " warten, weil er noch ein anderes Bild bearbeitete. ");
      teile.push("Eine Runde dauerte " + msText(t) + ", davon " + msText(n) + " im Netz. Am meisten Zeit ging " + namen[groesster] + " drauf.");
      live.text(...teile);
    }
    const zeichneGedrosselt = drossel(() => zeichne(true), 500);
    L.onEnde(() => zeichneGedrosselt.stop());

    function aufnehmenUndSenden() {
      if (!laeuft || wartet || !ws || ws.readyState !== 1) return;
      if (!bildQuelle && (video.readyState < 2 || !video.videoWidth)) { L.timeout(aufnehmenUndSenden, 100); return; }
      const t0 = performance.now();
      let url;
      try { url = bildAufnehmen(bildQuelle || video, canvas); } catch (e) { L.timeout(aufnehmenUndSenden, 200); return; }
      gesendetFuer = bildQuelle;
      tBrowser = performance.now() - t0;
      tStart = t0;
      wartet = true;
      ws.send(url);
      clearTimeout(wachhund);
      wachhund = setTimeout(() => { wartet = false; aufnehmenUndSenden(); }, 6000);
    }
    L.onEnde(() => clearTimeout(wachhund));

    function verbinden() {
      const url = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/ws/vision?modus=" + modus;
      let sock;
      try { sock = new WebSocket(url); } catch (e) { meld.zeige("Die Verbindung zum Jetson ließ sich nicht öffnen. Lade die Seite neu und versuche es noch einmal."); stoppen(); return; }
      ws = sock;
      sock.onopen = () => {
        if (ws !== sock) return;
        setStatus("verbunden, Bilder laufen", true);
        schwelleSenden();
        beiVerbindung.forEach((f) => { try { f(); } catch (e) { /* ein Modus darf die Kamera nicht stoeren */ } });
        aufnehmenUndSenden();
      };
      sock.onmessage = (ev) => {
        if (ws !== sock) return;
        let d;
        try { d = JSON.parse(ev.data); } catch (e) { wartet = false; L.timeout(aufnehmenUndSenden, 50); return; }
        clearTimeout(wachhund);
        if (bildQuelle && gesendetFuer !== bildQuelle) { wartet = false; aufnehmenUndSenden(); return; }   // Bild wurde inzwischen gewechselt
        const jetzt = performance.now();
        const gesamt = jetzt - tStart;
        const z = d.zeiten || {};
        schiebe(reihen.b, tBrowser);
        schiebe(reihen.n, Math.max(0, gesamt - tBrowser - (d.ms || 0)));
        schiebe(reihen.d, z.dekodieren || 0);
        schiebe(reihen.e, z.erkennen || 0);
        schiebe(reihen.k, z.kodieren || 0);
        schiebe(reihen.w, z.warten || 0);
        schiebe(reihen.t, gesamt);
        stempel.push(jetzt); if (stempel.length > 8) stempel.shift();
        letzte = d;
        if (d.bild) {
          if (!img) { img = h("img", { alt: "Kamerabild mit den Markierungen des Jetson" }); platzR.replaceWith(img); }
          img.src = d.bild;
        }
        meld.weg();
        versuche = 0;
        wartet = false;
        if (bildQuelle) { zeichneGedrosselt.jetzt(); setStatus("Beispielbild ausgewertet", true); return; }
        if (eigen) eigen.zeige(d);
        beiAntwort.forEach((f) => { try { f(d); } catch (e) { /* siehe oben */ } });
        zeichneGedrosselt();
        L.timeout(aufnehmenUndSenden, 0);
      };
      sock.onclose = () => {
        if (ws !== sock) return;
        ws = null; wartet = false;
        if (!laeuft) return;
        if (versuche < 1) {
          versuche++;
          setStatus("verbinde neu…", false);
          neuTimer = setTimeout(() => { if (laeuft && !L.weg) verbinden(); }, 800);
        } else {
          meld.zeige("Die Verbindung zum Jetson ist abgebrochen und ließ sich nicht wiederherstellen. Vielleicht startet der Jetson gerade einen Dienst neu. Warte kurz und drücke auf Kamera starten.");
          stoppen();
        }
      };
      sock.onerror = () => { /* onclose behandelt es */ };
    }
    L.onEnde(() => clearTimeout(neuTimer));

    function stoppen() {
      laeuft = false; startet = false; wartet = false;
      clearTimeout(wachhund); clearTimeout(neuTimer);
      if (ws) { const s = ws; ws = null; try { s.close(); } catch (e) { /* egal */ } }
      kameraStoppen(stream, video); stream = null;
      video.hidden = true; platzV.hidden = false;
      btn.replaceChildren(ic("camera"), "Kamera starten");
      btn.classList.add("primary"); btn.disabled = false;
      setStatus("Kamera aus", false);
    }
    L.onEnde(() => { laeuft = false; wartet = false; if (ws) { try { ws.close(); } catch (e) { /* egal */ } ws = null; } kameraStoppen(stream, video); stream = null; });

    function beispielbildAus() {
      if (!bildQuelle) return;
      bildQuelle = null; gesendetFuer = null; if (vorlage) vorlage.hidden = true;
      laeuft = false; wartet = false; clearTimeout(wachhund);
      if (ws) { const sk = ws; ws = null; try { sk.close(); } catch (e) { /* egal */ } }
    }
    async function starten() {
      beispielbildAus();
      if (startet || laeuft) return;
      startet = true; btn.disabled = true; meld.weg(); setStatus("Kamera startet…", false);
      try {
        const statusUrl = hg ? "/api/hand-gesicht/status" : konf && konf.statusUrl;
        if (statusUrl) {                                  // fehlen die Modelle auf dem Jetson, gar nicht erst die Kamera oeffnen
          let st = null;
          try { const r = await fetch(statusUrl, { cache: "no-store" }); st = r.ok ? await r.json() : null; } catch (e) { st = null; }
          if (L.weg) return;
          if (!st || !st.bereit) throw new Error(hg ? "Dieses Labor ist auf diesem Jetson noch nicht eingerichtet: Die Modelle für Hände und Gesichtsausdruck fehlen. Der Betreiber holt sie mit scripts/modelle_laden.sh."
            : (konf && konf.statusFehler) || "Dieses Labor ist auf diesem Jetson noch nicht eingerichtet: Die Modelle fehlen. Der Betreiber holt sie mit scripts/modelle_laden.sh.");
        }
        const s = await kameraOeffnen();
        if (L.weg) { s.getTracks().forEach((t) => t.stop()); return; }
        stream = s;
        video.srcObject = s;
        video.hidden = false; platzV.hidden = true;
        try { await video.play(); } catch (e) { /* autoplay greift trotzdem */ }
        reihen.b.length = reihen.n.length = reihen.d.length = reihen.e.length = reihen.k.length = reihen.w.length = reihen.t.length = 0;
        stempel.length = 0; versuche = 0;
        laeuft = true; startet = false;
        btn.replaceChildren(ic("stop"), "Kamera stoppen"); btn.classList.remove("primary"); btn.disabled = false;
        setStatus("verbinde mit dem Jetson…", false);
        live.text("Die Kamera läuft. Der Browser verbindet sich jetzt mit dem Jetson und schickt das erste Bild.");
        verbinden();
      } catch (e) {
        startet = false; btn.disabled = false;
        setStatus("Kamera aus", false);
        meld.zeige(e.message || "Die Kamera ließ sich nicht starten.");
      }
    }
    btn.addEventListener("click", () => { if (laeuft && !bildQuelle) stoppen(); else starten(); });

    /* Beispielmodus: statische Beispielbilder aus dem Katalog statt Kamera, sie laufen durch denselben Weg zum Jetson. */
    beispielStart(root, seite, modus, L, (e, kopf) => {
      const bilder = (e.daten && e.daten.bilder) || [];
      if (!bilder.length) {
        kopf.text("Für dieses Beispiel brauchst du deine Kamera. Drücke auf Kamera starten.");
        hervor(btn);
        return;
      }
      let aktuell = -1;
      vorlage = h("img", { class: "d-vorlage", alt: "Beispielbild, das der Jetson auswerten soll", hidden: true });
      video.after(vorlage);
      kameras.querySelector("figcaption").textContent = "Deine Kamera oder Beispielbild";
      const info = h("div", { class: "d-bsp-info", "aria-live": "polite" });
      const erkBtn = h("button", { type: "button", class: "btn primary" }, ic("search"), "Beispielbild erkennen");
      const knoepfe = bilder.map((b, i) => {
        const t = h("img", { src: bspUrl(b.datei), alt: "", loading: "lazy" });
        return h("button", { type: "button", class: "d-bsp-bild", "aria-pressed": "false", "aria-label": "Beispielbild " + (i + 1) + ": " + b.titel, title: b.titel, onclick: () => waehlen(i, true) }, t, h("span", null, b.titel));
      });
      const leiste = h("div", { class: "d-bsp-bilder", role: "group", "aria-label": "Beispielbilder" }, knoepfe);
      const zeile = h("div", { class: "d-bsp-quelle" }, leiste, h("div", { class: "zeile d-zeile" }, erkBtn), info);
      kameras.before(zeile);
      function infoZeigen(b) {
        // Native replaceChildren schreibt null als Text "null" in die Seite: leere Teile gar nicht erst uebergeben
        info.replaceChildren(...[
          h("p", null, fett("Erwartet: "), b.erwartet || "keine Angabe"),
          b.fehlmeldung ? h("p", { class: "d-leise" }, b.fehlmeldung) : null,
          b.bemerkung ? h("p", { class: "d-leise" }, b.bemerkung) : null,
          b.quelle ? h("p", { class: "d-leise d-bsp-quelltext" }, "Quelle: " + b.quelle) : null].filter(Boolean));
      }
      async function waehlen(i, auswerten) {
        if (i === aktuell && !auswerten) return;
        const b = bilder[i];
        try {
          const img = await bildLaden(b.datei);
          if (L.weg) return;
          if (stream) stoppen();
          aktuell = i;
          knoepfe.forEach((k, j) => k.setAttribute("aria-pressed", j === i ? "true" : "false"));
          bildQuelle = img; gesendetFuer = null;
          vorlage.src = img.src; vorlage.hidden = false; video.hidden = true; platzV.hidden = true;
          infoZeigen(b);
          meld.weg();
          if (!auswerten) { kopf.text("Beispielbild " + (i + 1) + " von " + bilder.length + " ist geladen. Drücke auf Beispielbild erkennen."); return; }
          kopf.text("Der Jetson wertet Beispielbild " + (i + 1) + " aus.");
          if (ws && ws.readyState === 1) { wartet = false; aufnehmenUndSenden(); }
          else if (!ws) { laeuft = true; versuche = 0; setStatus("verbinde mit dem Jetson…", false); verbinden(); }
        } catch (err) { meld.zeige(err.message); }
      }
      erkBtn.addEventListener("click", () => { if (aktuell < 0) waehlen(0, true); else waehlen(aktuell, true); });
      live.text("Wähle ein Beispielbild und drücke auf Beispielbild erkennen. Dann siehst du hier Schritt für Schritt, was der Jetson mit dem Bild macht.");
      // Das erste Beispielbild wird gleich ausgewertet: Der Klick auf "Beispiel starten" soll etwas in Gang setzen
      waehlen(0, true).then(() => kopf.text(bilder.length + " Beispielbilder sind bereit, das erste wird gerade ausgewertet. Wähle ein anderes oder starte deine Kamera."));
    });

    return { destroy() { L.destroy(); } };
  }

  /* ============================================================ 2 Bildmodell anlernen */
  function teach(root, seite) {
    const L = leben();
    const FARBEN = ["var(--k1)", "var(--k2)", "var(--k3)", "var(--k4)"];
    const MIN_GUT = 8, MAX_BSP = 50;
    let klassen = [{ name: "Klasse A" }, { name: "Klasse B" }];
    let counts = {};
    let dimension = null;
    let stream = null, startet = false;
    let aufIdx = null, aufBusy = false, klBusy = false;
    const canvas = neuesCanvas();

    const video = h("video", { autoplay: true, playsinline: true, "aria-label": "Deine Kamera", hidden: true });
    video.muted = true;
    const platz = h("div", { class: "d-platz" }, ic("camera"), h("span", null, "Die Kamera ist aus."));
    const kamBtn = h("button", { type: "button", class: "btn primary" }, ic("camera"), "Kamera starten");
    const status = h("span", { class: "chip", role: "status" }, "Kamera aus");
    const meld = meldungBox();

    /* Ergebnis rechts */
    const grossName = h("div", { class: "d-gross" }, "Noch kein Ergebnis");
    const grossSich = h("div", { class: "d-sicher" }, "Nimm für mindestens zwei Klassen Beispiele auf, dann erkennt der Jetson, was du zeigst.");
    const balkenBox = h("div", { class: "d-balken" });
    const ergebnis = h("div", { class: "d-ergebnis" }, grossName, grossSich, balkenBox);

    const testBild = h("img", { class: "d-vorlage", alt: "Testbild, das der Jetson zuordnen soll", hidden: true });
    const kopf = h("div", { class: "d-teachkopf kameras" },
      h("figure", null, h("figcaption", null, "Deine Kamera oder Testbild"), video, testBild, platz),
      h("figure", null, h("figcaption", null, "Was der Jetson erkennt"), ergebnis));

    /* Klassen */
    const liste = h("div", { class: "d-klassen gruppe" });
    let zeilen = [];
    const hinweisKlasse = h("p", { class: "d-hinweis", role: "status" });
    function zaehlerText(n, name) {
      if (n != null) return n + (n === 1 ? " Beispiel" : " Beispiele");
      return "schon Beispiele da";
    }
    function bauKlassen() {
      zeilen = [];
      liste.replaceChildren(...klassen.map((k, i) => {
        const hat = counts[k.name] != null || k.bekannt;
        const inp = h("input", { type: "text", value: k.name, maxlength: 24, "aria-label": "Name der Klasse " + (i + 1), readonly: hat ? true : null, title: hat ? "Der Name ist fest, solange Beispiele gespeichert sind. Mit Zurücksetzen kannst du neu beginnen." : null });
        inp.addEventListener("change", () => umbenennen(i, inp));
        const zaehler = h("span", { class: "d-zahl" }, zaehlerText(counts[k.name] != null ? counts[k.name] : (k.bekannt ? null : 0)));
        const halten = h("button", { type: "button", class: "btn d-halten", disabled: !stream, "aria-label": "Halten zum Aufnehmen, " + k.name }, ic("camera"), "Halten zum Aufnehmen");
        verdrahteHalten(halten, i);
        const row = h("div", { class: "d-klasse" }, h("i", { class: "d-punkt", style: "background:" + FARBEN[i] }), inp, zaehler, halten);
        zeilen.push({ inp, zaehler, halten });
        return row;
      }));
      aktualisiereZaehler();
    }
    function aktualisiereZaehler() {
      klassen.forEach((k, i) => {
        const z = zeilen[i]; if (!z) return;
        const n = counts[k.name];
        z.zaehler.textContent = n != null ? zaehlerText(n) : (k.bekannt ? "schon Beispiele da" : "0 Beispiele");
        const hat = n != null || k.bekannt;
        z.inp.readOnly = hat;
        z.halten.disabled = !stream;
        z.zaehler.classList.toggle("d-wenig", n != null && n < MIN_GUT);
      });
      addBtn.disabled = klassen.length >= 4;
    }
    function umbenennen(i, inp) {
      const alt = klassen[i].name;
      const neu = inp.value.replace(/[⁣\n\r]/g, "").trim().slice(0, 24);
      const doppelt = klassen.some((k, j) => j !== i && k.name.toLowerCase() === neu.toLowerCase());
      if (!neu || doppelt || counts[alt] != null || klassen[i].bekannt) {
        inp.value = alt;
        hinweisKlasse.textContent = !neu ? "Der Name darf nicht leer sein." : doppelt ? "Diesen Namen gibt es schon. Jede Klasse braucht einen eigenen Namen." : "Der Name ist fest, solange Beispiele gespeichert sind.";
        return;
      }
      klassen[i].name = neu; inp.value = neu; hinweisKlasse.textContent = "";
    }
    const addBtn = h("button", { type: "button", class: "btn klein" }, ic("plus"), "Klasse hinzufügen");
    addBtn.addEventListener("click", () => {
      if (klassen.length >= 4) return;
      const frei = ["Klasse C", "Klasse D", "Klasse E", "Klasse F"].find((n) => !klassen.some((k) => k.name === n));
      klassen.push({ name: frei }); bauKlassen();
    });

    /* Zuruecksetzen mit Rueckfrage im Text */
    const resetBtn = h("button", { type: "button", class: "btn klein" }, ic("trash"), "Zurücksetzen");
    const resetFrage = h("span", { class: "d-frage", hidden: true },
      "Das löscht alle gespeicherten Beispiele für alle Besucher. ",
      h("button", { type: "button", class: "btn klein", id: "d-reset-ja" }, "Ja, löschen"),
      h("button", { type: "button", class: "btn klein", id: "d-reset-nein" }, "Abbrechen"));
    resetBtn.addEventListener("click", () => { resetFrage.hidden = false; resetBtn.hidden = true; $1("#d-reset-ja", resetFrage).focus(); });
    const $1 = (s, r) => r.querySelector(s);
    $1("#d-reset-nein", resetFrage).addEventListener("click", () => { resetFrage.hidden = true; resetBtn.hidden = false; resetBtn.focus(); });
    $1("#d-reset-ja", resetFrage).addEventListener("click", async () => {
      resetFrage.hidden = true; resetBtn.hidden = false;
      try {
        const r = await postS("/api/teach/reset", {}, ctrl.signal);
        if (!r.ok) throw new Error(await antwortFehler(r));
        counts = {}; klassen = klassen.filter((k) => !k.fremd);
        klassen.forEach((k) => { k.bekannt = false; });
        if (klassen.length < 2) klassen = [{ name: "Klasse A" }, { name: "Klasse B" }];
        zeigeLeer(); bauKlassen(); streifen();
        hinweisKlasse.textContent = "Alle gespeicherten Beispiele sind gelöscht. Das gilt für alle Besucher.";
        live.text("Alles gelöscht. Halte den Knopf einer Klasse gedrückt, um neue Beispiele aufzunehmen.");
      } catch (e) { const t = netzFehler(e); if (t) meld.zeige(t); }
    });
    const ctrl = L.abbruch();

    const live = liveBlock("Live-Erklärung");
    live.text("Starte die Kamera. Halte dann den Knopf einer Klasse gedrückt und zeige dem Jetson, was er lernen soll.");
    const tipp = h("p", { class: "d-hinweis" }, "Tipp: Verändere beim Aufnehmen Winkel, Abstand und Licht ein wenig. So lernt der Jetson, worauf es ankommt, und nicht den Hintergrund.");

    root.append(
      h("div", { class: "zeile d-steuer" }, kamBtn, status),
      meld.el, kopf,
      h("div", { class: "d-klassenkopf" }, h("h3", null, "Klassen"), h("div", { class: "zeile" }, addBtn, resetBtn, resetFrage)),
      liste, hinweisKlasse, tipp, live.el);

    function streifen() {
      const segs = klassen.map((k, i) => ({ k: "k" + i, farbe: FARBEN[i], wert: counts[k.name] || 0, text: (counts[k.name] || 0) > 0 ? kurz(k.name, 12) + " " + counts[k.name] : "", name: k.name + ": " + (counts[k.name] != null ? counts[k.name] : 0) }));
      live.pipe(segs, "Gespeicherte Beispiele je Klasse");
    }
    streifen();

    function bekannteKlassen() { return klassen.filter((k) => counts[k.name] > 0 || k.bekannt); }
    /* Beispiele, die schon auf dem Jetson liegen (zum Beispiel von anderen Besuchern), tauchen als Klassen auf. */
    function labelsUebernehmen(labels) {
      let neu = false;
      for (const l of labels) {
        const k = klassen.find((x) => x.name === l);
        if (k) { if (counts[l] == null && !k.bekannt) { k.bekannt = true; neu = true; } }
        else if (klassen.length < 4) { klassen.push({ name: l, fremd: true, bekannt: true }); neu = true; }
      }
      if (neu) bauKlassen();
    }

    /* Aufnehmen */
    function stoppeAufnahme() {
      if (aufIdx == null) return;
      const z = zeilen[aufIdx]; if (z) z.halten.classList.remove("aktiv");
      aufIdx = null;
    }
    function startAufnahme(i) {
      if (!stream || aufIdx != null) return;
      aufIdx = i; zeilen[i].halten.classList.add("aktiv");
      hinweisKlasse.textContent = "";
      tickAuf();
    }
    function verdrahteHalten(b, i) {
      b.addEventListener("pointerdown", (e) => { if (e.button !== 0 && e.pointerType === "mouse") return; e.preventDefault(); startAufnahme(i); });
      for (const ev of ["pointerup", "pointercancel", "pointerleave"]) b.addEventListener(ev, stoppeAufnahme);
      b.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (!e.repeat) startAufnahme(i); } });
      b.addEventListener("keyup", (e) => { if (e.key === " " || e.key === "Enter") stoppeAufnahme(); });
      b.addEventListener("blur", stoppeAufnahme);
      b.addEventListener("contextmenu", (e) => e.preventDefault());
    }
    const onBlur = () => stoppeAufnahme();
    window.addEventListener("blur", onBlur);
    L.onEnde(() => window.removeEventListener("blur", onBlur));

    const satzAuf = drossel((name, n, gesamt) => {
      const wenige = klassen.filter((k) => counts[k.name] != null && counts[k.name] < MIN_GUT);
      const zahlen = dimension ? dimension + " Zahlen" : "einer langen Liste von Zahlen (ein Embedding)";
      const teile = ["Jedes Bild wird zu " + zahlen + " und mit dem Namen deiner Klasse ", fett(name), " gespeichert. Gespeichert: ", fett(n + (n === 1 ? " Beispiel" : " Beispiele")), " in dieser Klasse, insgesamt " + gesamt + ". "];
      if (n >= MAX_BSP) teile.push("Mehr als " + MAX_BSP + " Beispiele je Klasse speichert der Jetson nicht. ");
      else if (wenige.length) teile.push(wenige[0].name + " hat erst " + counts[wenige[0].name] + ". Unter " + MIN_GUT + " Beispielen je Klasse wird das Ergebnis unsicher.");
      live.text(...teile);
    }, 500);
    L.onEnde(() => satzAuf.stop());

    async function tickAuf() {
      if (aufIdx == null || aufBusy || !stream || L.weg) return;
      const k = klassen[aufIdx];
      if ((counts[k.name] || 0) >= MAX_BSP) { hinweisKlasse.textContent = "Für " + k.name + " sind " + MAX_BSP + " Beispiele gespeichert, mehr nimmt der Jetson nicht an."; return; }
      if (video.readyState < 2) return;
      aufBusy = true;
      try {
        const url = bildAufnehmen(video, canvas);
        const r = await postS("/api/teach/sample", { bild: url, label: k.name }, ctrl.signal);
        if (!r.ok) throw new Error(await antwortFehler(r));
        const d = await r.json();
        counts = d.counts || counts;
        labelsUebernehmen(Object.keys(counts));
        const n = counts[k.name] || 0;
        const gesamt = Object.values(counts).reduce((a, b) => a + b, 0);
        aktualisiereZaehler(); streifen();
        satzAuf(k.name, n, gesamt);
        meld.weg();
      } catch (e) { const t = netzFehler(e); if (t) { meld.zeige(t); stoppeAufnahme(); } }
      finally { aufBusy = false; }
    }
    L.interval(tickAuf, 150);

    /* Erkennen */
    const balkenRefs = {};
    function zeigeLeer() {
      grossName.textContent = "Noch kein Ergebnis"; grossName.style.color = "";
      grossSich.textContent = "Nimm für mindestens zwei Klassen Beispiele auf, dann erkennt der Jetson, was du zeigst.";
      balkenBox.replaceChildren();
      for (const k of Object.keys(balkenRefs)) delete balkenRefs[k];
    }
    function zeigeErgebnis(d) {
      const scores = d.scores || {};
      labelsUebernehmen(Object.keys(scores));
      const idx = klassen.findIndex((k) => k.name === d.label);
      grossName.textContent = d.label;
      grossName.style.color = idx >= 0 ? FARBEN[idx] : "";
      grossSich.textContent = "Sicherheit " + Math.round((d.conf || 0) * 100) + " Prozent";
      const namen = klassen.map((k) => k.name).filter((n) => scores[n] != null);
      if (Object.keys(balkenRefs).join("|") !== namen.join("|")) {
        balkenBox.replaceChildren();
        for (const k of Object.keys(balkenRefs)) delete balkenRefs[k];
        for (const n of namen) {
          const i = klassen.findIndex((k) => k.name === n);
          const fuell = h("i", { style: "background:" + FARBEN[i] });
          const wert = h("span", { class: "d-wert" });
          balkenBox.append(h("div", { class: "d-balkenzeile" }, h("span", { class: "d-bname" }, h("i", { class: "d-punkt", style: "background:" + FARBEN[i] }), n), h("div", { class: "d-bar", role: "img", "aria-label": n }, fuell), wert));
          balkenRefs[n] = { fuell, wert };
        }
      }
      for (const n of namen) {
        const s = Math.max(0, Math.min(1, scores[n]));
        balkenRefs[n].fuell.style.width = (s * 100) + "%";
        balkenRefs[n].wert.textContent = de(scores[n], 2);
      }
      return namen;
    }
    const satzKl = drossel((d, namen) => {
      const sorted = namen.slice().sort((a, b) => d.scores[b] - d.scores[a]);
      const teile = ["Das aktuelle Bild ähnelt " + sorted.map((n) => n + " zu " + de(d.scores[n], 2)).join(" und ") + ". "];
      teile.push(d.stimmen === d.k
        ? "Die " + d.k + " ähnlichsten gespeicherten Beispiele sagen alle: " + d.label + ". "
        : "Von den " + d.k + " ähnlichsten gespeicherten Beispielen gehören " + d.stimmen + " zu " + d.label + ". ");
      const wenige = klassen.filter((k) => counts[k.name] != null && counts[k.name] < MIN_GUT);
      if (wenige.length) teile.push(wenige[0].name + " hat erst " + counts[wenige[0].name] + " Beispiele. Mit mindestens " + MIN_GUT + " je Klasse wird die Erkennung stabiler.");
      live.text(...teile);
    }, 500);
    L.onEnde(() => satzKl.stop());

    async function erkennen(probe) {
      if (klBusy || !stream || L.weg || aufIdx != null || aufBusy || video.readyState < 2) return;
      if (!probe && bekannteKlassen().length < 2) return;
      klBusy = true;
      try {
        const url = bildAufnehmen(video, canvas);
        const r = await postS("/api/teach/classify", { bild: url }, ctrl.signal);
        if (!r.ok) throw new Error(await antwortFehler(r));
        const d = await r.json();
        if (!d.label) return;
        if (d.dimension) dimension = d.dimension;
        const namen = zeigeErgebnis(d);
        satzKl(d, namen);
        meld.weg();
      } catch (e) { const t = netzFehler(e); if (t) meld.zeige(t); }
      finally { klBusy = false; }
    }
    L.interval(() => erkennen(false), 300);

    async function starten() {
      if (startet || stream) return;
      startet = true; kamBtn.disabled = true; meld.weg(); status.textContent = "Kamera startet…";
      try {
        const s = await kameraOeffnen();
        if (L.weg) { s.getTracks().forEach((t) => t.stop()); return; }
        stream = s; video.srcObject = s; video.hidden = false; platz.hidden = true; testBild.hidden = true;
        try { await video.play(); } catch (e) { /* egal */ }
        startet = false; kamBtn.disabled = false;
        kamBtn.replaceChildren(ic("stop"), "Kamera stoppen"); kamBtn.classList.remove("primary");
        status.textContent = "Kamera läuft"; status.classList.add("live");
        aktualisiereZaehler();
        // Einmal nachsehen, ob der Jetson schon Beispiele von anderen Besuchern hat
        L.timeout(() => erkennen(true), 400);
      } catch (e) {
        startet = false; kamBtn.disabled = false; status.textContent = "Kamera aus";
        meld.zeige(e.message || "Die Kamera ließ sich nicht starten.");
      }
    }
    function stoppen() {
      stoppeAufnahme();
      kameraStoppen(stream, video); stream = null;
      video.hidden = true; platz.hidden = false;
      kamBtn.replaceChildren(ic("camera"), "Kamera starten"); kamBtn.classList.add("primary");
      status.textContent = "Kamera aus"; status.classList.remove("live");
      aktualisiereZaehler();
    }
    kamBtn.addEventListener("click", () => { if (stream) stoppen(); else starten(); });
    L.onEnde(() => { kameraStoppen(stream, video); stream = null; });

    bauKlassen();

    /* Beispielmodus: Anlern-Bilder und Testbilder aus dem Katalog, ohne Kamera. Die Bilder laufen durch dieselben Wege
       wie Kamerabilder (/api/teach/sample und /api/teach/classify). */
    beispielStart(root, seite, "anlernen", L, async (e, kopfB) => {
      const kl = ((e.daten && e.daten.klassen) || []).slice(0, 4);
      const tests = (e.daten && e.daten.test) || [];
      const urteil = h("p", { class: "d-bsp-urteil", role: "status", "aria-live": "polite" });
      const testZeile = h("div", { class: "d-bsp-bilder", role: "group", "aria-label": "Testbilder", hidden: true });
      const testBox = h("div", { class: "d-bsp-quelle", hidden: true },
        h("h3", null, "Testbilder, die der Jetson noch nie gesehen hat"), testZeile, urteil);
      kopf.before(testBox);
      kamBtn.disabled = false;
      const gesamt = kl.reduce((n, k) => n + k.bilder.length, 0);
      try {
        kopfB.text("Der Jetson wird vorbereitet: Alte Beispiele löschen …");
        const r0 = await postS("/api/teach/reset", {}, ctrl.signal);
        if (!r0.ok) throw new Error(await antwortFehler(r0));
        counts = {};
        klassen = kl.map((k) => ({ name: k.name }));
        bauKlassen(); streifen();
        let fertig = 0;
        for (const k of kl) {
          for (const datei of k.bilder) {
            if (L.weg) return;
            const img = await bildLaden(datei);
            const url = bildAufnehmen(img, canvas);
            const r = await postS("/api/teach/sample", { bild: url, label: k.name }, ctrl.signal);
            if (!r.ok) throw new Error(await antwortFehler(r));
            const d = await r.json();
            counts = d.counts || counts;
            fertig++;
            aktualisiereZaehler(); streifen();
            kopfB.text("Beispielbilder werden gelernt: " + fertig + " von " + gesamt + " (" + k.name + ").");
          }
        }
      } catch (err) { const t = netzFehler(err); if (t) meld.zeige(t); kopfB.text("Das Laden der Beispiele ist abgebrochen."); return; }
      live.text("Die Beispielbilder sind gelernt: " + kl.map((k) => k.name + " " + (counts[k.name] || 0)).join(", ") + ". Wähle ein Testbild und lass den Jetson es zuordnen.");
      kopfB.text("Fertig: " + gesamt + " Beispielbilder gelernt. Wähle ein Testbild, der Klick startet die Zuordnung.");
      let busyT = false;
      async function zuordnen(i) {
        if (busyT || L.weg) return;
        busyT = true;
        const t = tests[i];
        try {
          const img = await bildLaden(t.bild);
          stoppeAufnahme(); if (stream) stoppen();
          testBild.src = img.src; testBild.hidden = false; video.hidden = true; platz.hidden = true;
          tKnoepfe.forEach((b, j) => b.setAttribute("aria-pressed", j === i ? "true" : "false"));
          urteil.textContent = "Der Jetson ordnet das Bild zu …";
          const r = await postS("/api/teach/classify", { bild: bildAufnehmen(img, canvas) }, ctrl.signal);
          if (!r.ok) throw new Error(await antwortFehler(r));
          const d = await r.json();
          if (!d.label) throw new Error("Der Jetson hat keine Zuordnung geliefert.");
          if (d.dimension) dimension = d.dimension;
          const namen = zeigeErgebnis(d);
          satzKl.jetzt(d, namen);
          const passt = d.label === t.erwartet;
          urteil.textContent = "Erwartet: " + t.erwartet + ". Der Jetson sagt: " + d.label + " (Sicherheit " + Math.round((d.conf || 0) * 100) + " Prozent). " + (passt ? "Das stimmt." : "Das stimmt hier nicht. Auch das gehört zum Beispiel: Kein Modell trifft immer.");
          urteil.classList.toggle("d-bsp-ok", passt);
          meld.weg();
        } catch (err) { const m = netzFehler(err); if (m) meld.zeige(m); urteil.textContent = ""; }
        finally { busyT = false; }
      }
      const tKnoepfe = tests.map((t, i) => h("button", { type: "button", class: "d-bsp-bild", "aria-pressed": "false", "aria-label": "Testbild " + (i + 1), onclick: () => zuordnen(i) },
        h("img", { src: bspUrl(t.bild), alt: "", loading: "lazy" }), h("span", null, "Testbild " + (i + 1))));
      testZeile.replaceChildren(...tKnoepfe);
      testZeile.hidden = false; testBox.hidden = false;
      if (tests.length) zuordnen(0);               // das erste Testbild gleich zuordnen, damit man sofort ein Ergebnis sieht
    });

    return { destroy() { L.destroy(); } };
  }

  /* ============================================================ 3 Chat */
  function chat(root) {
    const L = leben();
    const MODELL = "llama3.2:3b";
    let tokensZeigen = false, busy = false, pullBusy = false, ctrl = null;
    let temperatur = 0.7;
    let imSpeicher = false, verbindungWeg = false, belegtBis = 0;
    const nachrichten = [];

    /* Modellzeile */
    const modellStatus = h("span", { class: "chip", role: "status" }, "Status wird gelesen…");
    const ladeBtn = h("button", { type: "button", class: "btn klein", title: "Lädt das Modell vorab auf die SSD des Jetson. Das ist nur einmal nötig." }, ic("download"), "Modell laden");
    const ladeBalken = h("i");
    const ladeLeiste = h("div", { class: "ladebar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 0, "aria-label": "Fortschritt beim Laden", hidden: true }, ladeBalken);
    const ladeTxt = h("div", { class: "ladetxt", "aria-live": "polite" });
    const modellZeile = h("div", { class: "d-modell" },
      h("div", { class: "zeile" }, h("b", null, "Modell"), h("code", null, MODELL), modellStatus, ladeBtn), ladeLeiste, ladeTxt);

    /* Verlauf */
    const verlauf = h("div", { class: "verlauf", role: "log", "aria-live": "off", "aria-label": "Chatverlauf", tabindex: "0" });
    const leer = h("p", { class: "d-hinweis" }, "Jede Frage steht für sich: Das Modell erinnert sich nicht an vorherige Fragen.");

    /* Eingabe */
    const feld = h("textarea", { rows: 1, maxlength: 1000, id: "chat-eingabe", placeholder: "Schreibe eine Frage…", "aria-label": "Deine Frage", enterkeyhint: "send", dataset: { testid: "chat-eingabe" } });
    const sendeBtn = h("button", { type: "button", class: "btn primary" }, ic("send"), "Senden");
    const stoppBtn = h("button", { type: "button", class: "btn", hidden: true }, ic("stop"), "Stopp");
    const eingabe = h("div", { class: "eingabe" }, feld, sendeBtn, stoppBtn);
    const feldHinweis = h("p", { class: "d-feldhinweis", id: "chat-feldhinweis", role: "status", "aria-live": "polite" });
    const tastenHinweis = h("p", { class: "d-hinweis d-tasten" }, "Enter sendet, Shift+Enter macht eine neue Zeile.");
    // Kontextlaenge (Zahl wie auf der Seite Hardware: im Labor eingestellt sind 4096 Token)
    const kontextHinweis = h("p", { class: "d-hinweis d-kontext", title: "Token sind Wortstücke. 4096 Token sind ungefähr ein bis zwei Seiten Text. Längere Texte vergisst das Modell." },
      "Das Modell hält etwa 4096 Token im Kopf (ein bis zwei Seiten Text). ", h("a", { href: "/hardware" }, "Mehr dazu"));
    // "Kurz antworten": Standard an fuer Schule, Eltern und Erwachsene, aus fuer Technik; der Server begrenzt dann Saetze und Laenge
    let kurzAn = ["schule", "eltern", "erwachsene"].includes(KL.weg);
    const kurzBox = h("input", { type: "checkbox", id: "d-kurz", role: "switch", checked: kurzAn, dataset: { testid: "chat-kurz" } });
    kurzBox.addEventListener("change", () => { kurzAn = kurzBox.checked; });
    const kurzSchalter = h("label", { class: "d-schalter d-kurz", for: "d-kurz" }, kurzBox, h("span", { class: "d-sw-bahn", "aria-hidden": "true" }, h("i")), "Kurz antworten");
    const eingabeBlock = h("div", { class: "d-eingabeblock" }, eingabe, feldHinweis, kurzSchalter, KL.datenHinweis(), tastenHinweis, kontextHinweis);
    /* Leeres Senden: kurze, freundliche Rückmeldung, der Cursor springt ins Feld */
    function ausFeldSenden() {
      if (busy) return;
      if (!feld.value.trim()) { feldHinweis.textContent = "Schreib zuerst eine Frage."; feld.classList.add("d-leer"); feld.setAttribute("aria-invalid", "true"); feld.setAttribute("aria-describedby", "chat-feldhinweis"); feld.focus({ preventScroll: true }); return; }
      senden(feld.value);
    }

    // Beispielfragen je Rolle: Alltag und Beruf. Eintrag als Text oder {t: Frage, l: Beschriftung des Knopfes}.
    const BUS = "Wie lange darf ein Busfahrer am Stück fahren, bevor er Pause machen muss? Antworte kurz.";
    const BEISPIELE_WEG = {
      schule: ["Wie kann ich KI bei den Hausaufgaben nutzen, ohne zu schummeln?", "Woran erkenne ich, ob ein Bild echt oder von einer KI ist?", "Wie lerne ich besser für eine Klassenarbeit?"],
      lehrende: ["Wie erkläre ich Klasse 8 in drei Sätzen, was ein Sprachmodell ist?", "Was ist ein Token?", "Nenne drei Regeln für KI bei Hausaufgaben."],
      erwachsene: ["Woran erkenne ich einen Enkeltrick oder Betrug am Telefon?", { t: BUS, l: "Wie lange darf ein Busfahrer am Stück fahren? (Antwort prüfen)" }, "Was ist künstliche Intelligenz in einfachen Worten?"],
      eltern: ["Wie erkläre ich meinem Kind, was KI ist?", "Woran erkenne ich einen Enkeltrick oder Betrug am Telefon?", "Wie spreche ich mit meinem Kind über Bildschirmzeit?"],
      beruf: ["Was darf ich einer KI nie eingeben, wenn ich in einem Steuerbüro arbeite?", "Mache aus dieser Notiz ein kurzes Angebot: 3 Fenster tauschen, Montag, 1.200 Euro.",
        { t: "Wofür ist ein FI-Schalter in der Elektroinstallation da? Antworte kurz.", l: "FI-Schalter erklären (nur Lehrbeispiel, Antwort prüfen lassen)" }, { t: BUS, l: "Lenk- und Pausenzeiten im Bus (Antwort prüfen)" }],
      technik: ["Erkläre in zwei Sätzen, was ein Token ist.", "Was ist ein Jetson?", "Schreibe einen Satz über Roboter."],
    };
    const BEISPIELE = BEISPIELE_WEG[KL.weg] || ["Erkläre in zwei Sätzen, was ein Token ist.", { t: BUS, l: "Wie lange darf ein Busfahrer am Stück fahren? (Antwort prüfen)" }, "Was ist ein Jetson?"];
    const chips = h("div", { class: "vorschlaege", "aria-label": "Beispielfragen" }, BEISPIELE.map((b) => { const t = typeof b === "string" ? b : b.t, l = typeof b === "string" ? b : b.l; return h("button", { type: "button", class: "chip", onclick: () => senden(t) }, l); }));

    /* Einstellungen */
    const temp = h("input", { type: "range", id: "d-temp", min: 0, max: 2, step: 0.1, value: 0.7 });
    const tempOut = h("output", { for: "d-temp" }, "0,7");
    temp.addEventListener("input", () => { temperatur = Number(temp.value); tempOut.textContent = de(temperatur, 1); });
    const schalter = h("input", { type: "checkbox", id: "d-tokens", role: "switch" });
    schalter.addEventListener("change", () => { tokensZeigen = schalter.checked; nachrichten.forEach((m) => m.ki && fuelle(m)); });
    const einst = KL.gruppe("Antwort einstellen", [
      h("div", { class: "regler" }, h("label", { for: "d-temp" }, "Temperatur"), temp, tempOut),
      h("label", { class: "d-schalter", for: "d-tokens" }, schalter, h("span", { class: "d-sw-bahn", "aria-hidden": "true" }, h("i")), "Tokens zeigen")], { klasse: "d-einst" });

    const live = liveBlock("Live-Erklärung");
    live.text("Stelle eine Frage. Hier siehst du dann, wie der Jetson Token für Token antwortet.");

    root.append(h("div", { class: "d-chatbox" }, verlauf, leer), eingabeBlock, KL.kiHinweis(), chips, modellZeile, einst, live.el);        // Eingabe zuerst, das Modell darunter (Handy: Feld direkt unter der Überschrift)

    /* Modellstatus aus den Live-Werten */
    function modellStatusSetzen(d) {
      if (verbindungWeg) { modellStatus.textContent = "Keine Verbindung zum Labor"; modellStatus.classList.remove("live"); return; }
      const geladen = (d.modelle_geladen || []).some((m) => m.startsWith("llama3.2"));
      imSpeicher = geladen;
      // gleiche Aussage wie Startseite und Seitenleiste (KL.rechner): "bereit" nur, solange keine Anfragen warten
      let lage = KL.rechner ? KL.rechner.lage(d) : { zustand: "frei" };
      if (belegtBis > Date.now() && lage.zustand !== "voll") lage = Object.assign({}, lage, { zustand: "voll" });      // die Ausfall-Karte meldet "ausgelastet": der Chip sagt dasselbe
      const zusatz = lage.zustand === "voll" ? ", aber gerade viel los" : lage.zustand === "rechnet" ? ", Rechner rechnet gerade" : "";
      modellStatus.textContent = (geladen ? (zusatz ? "Modell im Speicher" : "Modell bereit, im Speicher") : "Modell wird bei der ersten Frage geladen") + zusatz;
      modellStatus.classList.toggle("live", geladen && lage.zustand === "frei");
      ladeBtn.hidden = geladen;          // ist es schon im Speicher, gibt es nichts mehr zu laden (kein Widerspruch zum Status)
    }
    L.onEnde(KL.stats.on(modellStatusSetzen));

    /* Modell laden */
    function pullStatusText(s) {
      s = String(s || "");
      if (/^pulling manifest/.test(s)) return "Verzeichnis holen";
      if (/^pulling/.test(s)) return "Modelldaten laden";
      if (/^verifying/.test(s)) return "Prüfsumme prüfen";
      if (/^writing/.test(s)) return "Verzeichnis schreiben";
      if (/^success|^fertig/.test(s)) return "fertig";
      return kurz(s, 60);
    }
    async function laden() {
      if (pullBusy) return;
      pullBusy = true; ladeBtn.disabled = true; ladeLeiste.hidden = false; ladeBalken.style.width = "0%"; ladeTxt.textContent = "Frage beim Jetson an…";
      const c = L.abbruch();
      try {
        const r = await postS("/api/pull", { modell: MODELL }, c.signal);
        if (!r.ok) throw new Error(await antwortFehler(r));
        let puffer = "", fertig = false, fehlerText = null;
        const verarbeite = (block) => {
          const zeile = block.split("\n").find((z) => z.startsWith("data:"));
          if (!zeile) return;
          let o; try { o = JSON.parse(zeile.slice(5).trim()); } catch (e) { return; }
          if (typeof o.pct === "number") { ladeBalken.style.width = o.pct + "%"; ladeLeiste.setAttribute("aria-valuenow", o.pct); }
          if (o.status && /^Fehler/.test(o.status)) fehlerText = o.status;
          ladeTxt.textContent = pullStatusText(o.status) + (typeof o.pct === "number" ? ", " + o.pct + " Prozent" : "");
          if (o.done) fertig = true;
        };
        await streamLesen(r, (gesamt) => {
          const teile = gesamt.split("\n\n");
          puffer = teile.pop();
          // alle vollstaendigen Bloecke einmalig verarbeiten: Zaehler ueber Laenge
          while (verarbeitet < teile.length) verarbeite(teile[verarbeitet++]);
        });
        if (puffer.trim()) verarbeite(puffer);
        if (fehlerText) throw new Error("Das Laden meldet: " + fehlerText);
        ladeBalken.style.width = "100%"; ladeLeiste.setAttribute("aria-valuenow", 100);
        ladeTxt.textContent = fertig ? "Das Modell liegt auf der SSD des Jetson. Beim ersten Token wird es in den Speicher geladen." : "Das Laden wurde beendet.";
      } catch (e) {
        const t = netzFehler(e);
        if (t) ladeTxt.textContent = t;
      } finally { pullBusy = false; ladeBtn.disabled = false; }
    }
    let verarbeitet = 0;
    ladeBtn.addEventListener("click", () => { verarbeitet = 0; laden(); });

    /* Antwort aufbereiten */
    function zerlege(roh) {
      const i = roh.indexOf("\n\n---\n");
      const body = i < 0 ? roh : roh.slice(0, i);
      const meta = i < 0 ? "" : roh.slice(i + 6);
      let tokens = body.split("⁣");
      if (tokens.length && tokens[tokens.length - 1] === "") tokens.pop();
      return { tokens, meta };
    }
    function metaText(meta) {
      const m = /(\d+) Tokens in ([\d.]+)s \(([\d.]+) Tok\/s\), Temperatur ([\d.]+)/.exec(meta);
      if (!m) return meta.trim();
      return m[1] + " Tokens in " + de(Number(m[2]), 1) + " s (" + de(Number(m[3]), 1) + " Tokens pro Sekunde), Temperatur " + de(Number(m[4]), 1);
    }
    function fuelle(m) {
      const node = m.text;
      node.replaceChildren();
      if (m.tokens.length === 0) { node.append(m.platz || ""); return; }
      node.classList.toggle("md", !tokensZeigen);
      if (tokensZeigen) m.tokens.forEach((t) => node.append(h("span", { class: "tok" }, t)));
      else node.append(KL.mdAntwort(m.tokens.join("")));          // Markdown sicher als DOM-Knoten, nie als HTML
    }
    function nachUnten() { verlauf.scrollTop = verlauf.scrollHeight; }
    function neueNachricht(rolle, text) {
      leer.hidden = true;
      if (rolle === "du") { verlauf.append(h("div", { class: "msg du" }, text)); nachUnten(); return null; }
      const m = { ki: true, tokens: [], platz: "…", text: h("span", { class: "d-text" }), meta: h("span", { class: "meta" }) };
      m.el = h("div", { class: "msg ki", dataset: { testid: "chat-antwort" } }, m.text, m.meta);
      fuelle(m); verlauf.append(m.el); nachrichten.push(m); nachUnten();
      return m;
    }

    const liveSatz = drossel((s) => {
      const gpu = KL.stats.letzte && KL.stats.letzte.gpu_pct != null ? KL.stats.letzte.gpu_pct : null;
      const tempo = s.n > 1 && s.tErst ? (s.n - 1) / ((performance.now() - s.tErst) / 1000) : null;
      live.text(fett("Token " + s.n + ": "), "Das Modell wählt gerade das nächste Wort. ",
        tempo ? "Aktuelles Tempo: " + de(tempo, 1) + " Tokens pro Sekunde. " : "",
        gpu != null ? "GPU: " + gpu + " Prozent. " : "",
        "Das erste Token kam nach " + sekText(s.tErst - s.tSend) + ".");
      live.pipe([
        { k: "w", cls: "s6", wert: s.tErst - s.tSend, text: sekText(s.tErst - s.tSend), name: "Warten auf das erste Token" },
        { k: "g", cls: "s4", wert: Math.max(1, performance.now() - s.tErst), text: sekText(performance.now() - s.tErst), name: "Tokens erzeugen" },
      ], "Wartezeit bis zum ersten Token und Zeit zum Erzeugen");
    }, 500);
    L.onEnde(() => liveSatz.stop());

    const AUSFALL_NACH_S = 90, AUTO_NACH_S = 20;
    /* Lernmoment unter jeder Antwort: Ein Sprachmodell erfindet Dinge, auch zu Alltagsfragen. Darum immer, nicht nur bei KI-Themen. */
    function pruefKasten() {
      return h("div", { class: "ki-pruefen", role: "note", dataset: { testid: "chat-pruefen" } }, ic("search"),
        h("div", null, h("p", null, h("b", null, "Stimmt das? Prüfe es: "), h("a", { href: "/quellen-pruefen" }, "Quellen prüfen")),
          h("p", null, "Woran würdest du merken, dass das falsch ist?")));
    }
    /* Was inzwischen hilft, wenn der Jetson ausgelastet ist: etwas lesen oder das Quiz machen. */
    function hilfeLinks() {
      const quiz = () => document.querySelector(".block.quiz");
      return h("ul", { class: "last-links" },
        h("li", null, h("a", { href: "/tokens-sprachmodelle" }, "Seite lesen: Tokens und Sprachmodelle")),
        quiz() ? h("li", null, h("a", { href: "#quiz", onclick: (e) => { const q = quiz(); if (!q) return; e.preventDefault(); q.scrollIntoView({ behavior: "smooth", block: "start" }); } }, "Das Quiz zu dieser Seite machen")) : null);
    }

    /* Betrugs-Kasten: feste Hinweise, keine Modell-Aussage. Erscheint vor der Antwort, wenn Frage UND Stichwort auf Betrug deuten. */
    const BETRUG = {
      stichwort: /\b(?:anruf\w*|angerufen|anrufer\w*|enkel\w*|polizei\w*|schockanruf\w*|konto\w*|gewinn\w*|überweis\w*|ueberweis\w*|(?:paket|pakete|paketen|link|links|sms)(?![a-zäöüß])|bank\w*|falsch(?:er|e|en|es)|betrug\w*|betrüg\w*)/i,
      frage: /\?|\b(?:was|wie|soll|sollte|muss|darf|kann|wer|ob|woran|warum|wann|wo|wohin|ist|sind|hilfe)\b/i,
    };
    function betrugKasten() {
      return h("div", { class: "betrug-kasten", role: "note", dataset: { testid: "chat-betrug" } }, ic("shield-alert"),
        h("div", null, h("p", { class: "bk-titel" }, "Bei Verdacht auf Betrug"),
          h("ul", null, h("li", null, "Auflegen."), h("li", null, "Selbst zurückrufen unter einer Nummer, die du kennst."), h("li", null, "Notruf 110 bei Verdacht.")),
          h("p", { class: "bk-mehr" }, "Mehr: ", h("a", { href: "/falscher-anruf" }, "Falscher Anruf"))));
    }

    async function senden(text, erneut, autoSchon) {
      text = String(text || "").trim().slice(0, 1000);
      if (!text || busy) return;
      busy = true; sendeBtn.hidden = true; stoppBtn.hidden = false; feld.value = ""; feld.style.height = ""; feldHinweis.textContent = ""; feld.classList.remove("d-leer"); feld.removeAttribute("aria-invalid");
      const scrollY = window.scrollY;                  // die Seite springt beim Absenden nicht
      eingabe.classList.add("laeuft");
      if (!erneut) neueNachricht("du", text);          // beim Wiederholen steht die Frage schon im Verlauf
      if (!erneut && BETRUG.stichwort.test(text) && BETRUG.frage.test(text)) verlauf.append(betrugKasten());      // sofort, ohne auf das Modell zu warten
      const m = neueNachricht("ki");
      window.scrollTo(window.scrollX, scrollY);
      try { stoppBtn.focus({ preventScroll: true }); } catch (e) { /* egal */ }
      ctrl = new AbortController();
      const sig = ctrl.signal;
      const s = { n: 0, tSend: performance.now(), tErst: 0 };
      const warMitSpeicher = imSpeicher;
      live.pipe([]);
      live.text(warMitSpeicher
        ? "Das Modell liegt schon im Speicher. Der Jetson liest deine Frage und beginnt gleich zu rechnen."
        : "Der Jetson lädt das Modell aus der SSD in den Speicher. Das dauert beim ersten Mal einige Sekunden.");
      let abgebrochen = false, fehler = null, roh = "", belegt = false, zeitlimit = false;
      let rafOffen = false;
      const zeichne = () => { rafOffen = false; fuelle(m); nachUnten(); };
      // Fortschrittsanzeige mit verstrichener Zeit bis zum ersten Wort (nach AUSFALL_NACH_S Sekunden gilt der Jetson als ausgelastet)
      const fortI = h("i");
      const fortZeit = h("span", { class: "warte-zeit" }, "0 s");
      const fort = h("div", { class: "warte-fort" },
        h("div", { class: "ladebar", role: "progressbar", "aria-label": "Wartezeit bis zum ersten Wort", "aria-valuemin": 0, "aria-valuemax": AUSFALL_NACH_S, "aria-valuenow": 0 }, fortI), fortZeit);
      m.el.insertBefore(fort, m.meta);
      // Wartezustand in Klartext: Platznummer in der Warteschlange, Zaehler beim automatischen Wiederholen
      const wartehinweis = (t) => { if (s.tErst) return; m.platz = t; fuelle(m); live.text(t); };
      const stoppePlatz = KL.last.beobachten((i) => wartehinweis(KL.last.platzText(i)));
      // Ansage ehrlich: aus den letzten Antworten dieser Sitzung, ohne Messwert "kann bis zu einer Minute dauern"
      const ANSAGE = KL.last.ansage();
      const WARTE = warMitSpeicher ? "Der Jetson rechnet" : "Das Modell wird geladen, das dauert beim ersten Mal bis zu einer Minute";
      const STOPP = " Mit „Stopp“ kannst du abbrechen.";
      m.platz = WARTE + (warMitSpeicher ? ", einen Moment … " : ". ") + ANSAGE + STOPP; fuelle(m);
      const wartetimer = setInterval(() => {
        if (s.tErst) { fort.remove(); return; }
        const e = Math.round((performance.now() - s.tSend) / 1000);
        fortI.style.width = Math.min(100, e / AUSFALL_NACH_S * 100) + "%";
        fort.firstChild.setAttribute("aria-valuenow", String(Math.min(AUSFALL_NACH_S, e)));
        fortZeit.textContent = "Bisher " + e + " s";
        if (m.platz.startsWith(WARTE)) { m.platz = WARTE + (warMitSpeicher ? " seit " : ". Bisher ") + e + " s … " + ANSAGE + STOPP; fuelle(m); }
        if (e >= AUSFALL_NACH_S && ctrl) { zeitlimit = true; ctrl.abort(); }          // kein erstes Wort nach 90 Sekunden: Karte statt endlosem Warten
      }, 1000);
      try {
        const r = await postLast("/api/chat", { nachricht: text, temperatur, kurz: kurzAn }, sig, (i) => wartehinweis(KL.last.warteText(i)),
          { max: 1, sek: AUTO_NACH_S });    // einmal automatisch nach 20 s, nicht dreimal. Rolle Schule: der Server haengt "kurz und einfach" an
        if (!r.ok) throw new Error(await antwortFehler(r));
        await streamLesen(r, (gesamt) => {
          roh = gesamt;
          const z = zerlege(gesamt);
          m.tokens = z.tokens;
          if (z.tokens.length && !s.tErst) { s.tErst = performance.now(); KL.last.ersteMerken((s.tErst - s.tSend) / 1000); fort.remove(); }
          s.n = z.tokens.length;
          if (s.tErst && !z.meta) liveSatz(s);
          if (!rafOffen) { rafOffen = true; requestAnimationFrame(zeichne); }
        });
      } catch (e) {
        if (e && e.name === "AbortError") abgebrochen = true; else { fehler = netzFehler(e) || "Unbekannter Fehler."; belegt = istBelegt(e); if (fehler === NETZ_AUS) { verbindungWeg = true; modellStatusSetzen(KL.stats.letzte || {}); } }
      }
      stoppePlatz();
      if (!fehler) verbindungWeg = false;
      clearInterval(wartetimer);
      fort.remove();
      liveSatz.stop();
      const z = zerlege(roh);
      m.tokens = z.tokens;
      const fe = /\[Fehler: ([^\]]*)\]/.exec(roh);
      if (fe) fehler = "Das Modell meldet einen Fehler: " + fe[1];
      else if (!z.meta && z.tokens.length === 1 && /^\[(?!\d+\])[^\]]+\]$/.test(z.tokens[0])) { fehler = z.tokens[0].slice(1, -1); z.tokens = []; m.tokens = []; }
      // Meldungen des Servers ("[Dem Jetson fehlt gerade freier Speicher ...]"): freundlicher Hinweis-Kasten statt Text in eckigen Klammern in der Blase
      const sv = /^\s*\[((?:Dem Jetson fehlt|Das Sprachmodell antwortet|Das Modell ist auf dem Jetson)[^\]]*)\]\s*$/.exec(z.tokens.join(""));
      let hinweisText = "";
      if (sv) { hinweisText = sv[1]; z.tokens = []; m.tokens = []; fehler = fehler || hinweisText; }
      else if (fehler && !z.tokens.length && /^(?:Dem Jetson fehlt|Das Sprachmodell antwortet|Das Modell ist auf dem Jetson)/.test(fehler)) hinweisText = fehler;      // Meldung ohne Anhang: die eckigen Klammern sind oben schon abgestreift
      if (zeitlimit && !z.tokens.length) { abgebrochen = false; hinweisText = "Nach " + AUSFALL_NACH_S + " Sekunden kam noch kein erstes Wort."; fehler = hinweisText; }
      if (fehler && z.tokens.length === 0) m.platz = fehler;
      if (fehler && !z.tokens.length && KL.last.istBelegtText(fehler)) belegt = true;
      fuelle(m);
      // Neuer Versuch derselben Frage: die Frage bleibt stehen und wird nicht doppelt eingetragen; Auto-Versuch gibt es je Frage nur einmal
      const nochmal = () => { if (busy) return; const i = nachrichten.indexOf(m); if (i >= 0) nachrichten.splice(i, 1); m.el.remove(); senden(text, true, true); };
      let karte = null;
      if (!hinweisText && !belegt && fehler && !z.tokens.length && !abgebrochen) {
        // anderer Fehlschlag (keine Verbindung, Serverfehler): Karte mit "Noch einmal versuchen", ohne Schuldzuweisung
        karte = KL.last.karte({ titel: fehler === NETZ_AUS ? "Keine Verbindung" : "Das hat nicht geklappt", text: fehler, wiederholen: nochmal, auto: 0 });
        m.el.classList.add("msg-hinweis");
        m.el.replaceChildren(karte.el);
        L.onEnde(() => karte.stop());
      }
      else if (hinweisText || (belegt && !z.tokens.length)) {
        belegtBis = Date.now() + 30000; modellStatusSetzen(KL.stats.letzte || {});
        // Ausfall: Karte "Der Jetson ist gerade ausgelastet" mit Knopf, Hilfe und (einmal je Frage) automatischem Versuch nach 20 s
        const auto = hinweisText && !autoSchon;
        karte = KL.last.karte({ titel: "Der Jetson ist gerade ausgelastet", text: hinweisText ? hinweisText + (/[.!?]$/.test(hinweisText) ? "" : ".") + " Das liegt nicht an dir." : KL.last.TEXT,
          wiederholen: nochmal, auto: auto ? AUTO_NACH_S : 0, hilfe: hilfeLinks() });
        m.el.classList.add("msg-hinweis");
        m.el.replaceChildren(karte.el);
        L.onEnde(() => karte.stop());
      }
      else if (z.meta) m.meta.textContent = metaText(z.meta);
      else if (abgebrochen) m.meta.textContent = "Abgebrochen nach " + z.tokens.length + " Tokens.";
      if (z.tokens.length && !hinweisText && !m.warnungen) {        // Hinweise zu KI-Erklaerungen und Rechenfragen, danach immer der Pruefhinweis
        m.warnungen = true;
        for (const w of KL.antwortWarnungen(text, z.tokens.join(""))) m.el.append(w);
        m.el.append(pruefKasten());
        nachUnten();
      }
      else if (fehler && z.tokens.length) m.meta.textContent = fehler;
      // Abschluss der Live-Erklaerung
      const mm = /(\d+) Tokens in ([\d.]+)s \(([\d.]+) Tok\/s\)/.exec(z.meta || "");
      if (mm) {
        KL.last.dauerMerken((performance.now() - s.tSend) / 1000);                    // gemessene Gesamtdauer (mit Warten) fuer die Wartezeit-Schaetzung, nur im Speicher
        const wartezeit = s.tErst ? s.tErst - s.tSend : 0;
        live.text(fett("Fertig. "), mm[1] + " Tokens in " + de(Number(mm[2]), 1) + " Sekunden, das sind " + de(Number(mm[3]), 1) + " Tokens pro Sekunde. Das erste Token kam nach " + sekText(wartezeit) + ". " + (wartezeit > 3000 && !warMitSpeicher ? "Diese Zeit ging vor allem für das Laden des Modells drauf." : "Kürzere Antworten und eine kleinere Temperatur machen das Modell berechenbarer."));
        live.pipe([
          { k: "w", cls: "s6", wert: wartezeit, text: sekText(wartezeit), name: "Warten auf das erste Token" },
          { k: "g", cls: "s4", wert: Math.max(1, performance.now() - s.tErst), text: sekText(performance.now() - s.tErst), name: "Tokens erzeugen" },
        ], "Wartezeit bis zum ersten Token und Zeit zum Erzeugen");
      } else if (abgebrochen) live.text("Du hast die Antwort gestoppt. Der Jetson hat bis dahin " + z.tokens.length + " Tokens erzeugt.");
      else if (hinweisText) live.text("Der Jetson ist gerade ausgelastet. Die Karte im Chat bietet einen neuen Versuch an.");
      else if (fehler) live.text(fehler);
      busy = false; ctrl = null; sendeBtn.hidden = false; stoppBtn.hidden = true; eingabe.classList.remove("laeuft");
      nachUnten();
      if (!L.weg && !karte) feld.focus({ preventScroll: true });
      window.scrollTo(window.scrollX, scrollY);
    }
    L.onEnde(() => { if (ctrl) ctrl.abort(); });

    /* Vorlage von einer Beispiel-Prompt-Seite ("Im Chat ausprobieren"): nur ins Feld, nie automatisch gesendet */
    try {
      const vorlage = sessionStorage.getItem("kl-chat-vorlage");
      if (vorlage) {
        sessionStorage.removeItem("kl-chat-vorlage");
        feld.value = vorlage.slice(0, 1000);
        requestAnimationFrame(() => { feld.style.height = "auto"; feld.style.height = Math.min(feld.scrollHeight, 130) + "px"; feld.scrollIntoView({ block: "center" }); feld.focus(); });
      }
    } catch (e) { /* ohne Speicher */ }

    sendeBtn.addEventListener("click", ausFeldSenden);
    stoppBtn.addEventListener("click", () => { if (ctrl) ctrl.abort(); });
    feld.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); ausFeldSenden(); }
    });
    feld.addEventListener("input", () => { if (feldHinweis.textContent) { feldHinweis.textContent = ""; feld.classList.remove("d-leer"); } feld.style.height = "auto"; feld.style.height = Math.min(feld.scrollHeight, 130) + "px"; });

    return { destroy() { L.destroy(); } };
  }

  /* ============================================================ 4 RAG */
  const BEISPIELTEXT = [
    "Das Bauprojekt Orion",
    "Orion ist ein erfundenes Bauprojekt: ein neues Lagergebäude mit Bürotrakt am Rand einer fiktiven Stadt. Der erste Spatenstich ist für den 4. März geplant, die Übergabe an den Betreiber für den 30. November.",
    "Das Gesamtbudget beträgt 4,2 Millionen Euro. Davon entfallen 2,6 Millionen auf den Rohbau, 900.000 Euro auf die Gebäudetechnik und 700.000 Euro auf Außenanlagen und Reserve. Ändert sich ein Posten um mehr als fünf Prozent, muss die Lenkungsgruppe zustimmen.",
    "Die Projektleitung liegt bei Lena Orth. Jonas Kreil ist für die Bauüberwachung zuständig und meldet jeden Freitag den Baufortschritt. Die Gebäudetechnik verantwortet Mira Sander, Genehmigungen und Behördenkontakt übernimmt Tobias Wenk.",
    "Das größte Risiko ist der Stahlpreis. Steigt er bis Mai um mehr als zehn Prozent, wird der Rohbau um etwa drei Wochen verschoben. Für diesen Fall gibt es einen Ersatzlieferanten in Reserve.",
  ].join("\n\n");

  function rag(root, seite) {
    const L = leben();
    let busy = false, ctrl = null, hatText = false;
    const meld = meldungBox();
    const antwortMeld = meldungBox();      // Fehler der Frage erscheinen direkt am Antwortfeld, nicht oben auf der Seite

    /* Schritt 1 */
    const text = h("textarea", { rows: 6, maxlength: 300000, placeholder: "Füge hier einen Text ein, zum Beispiel ein Handbuch oder Notizen.", "aria-label": "Text zum Einlesen" });
    const bspBtn = h("button", { type: "button", class: "btn klein" }, ic("file"), "Beispieltext einfügen");
    const lesenBtn = h("button", { type: "button", class: "btn primary klein" }, ic("download"), "Einlesen");
    const resetBtn = h("button", { type: "button", class: "btn klein" }, ic("trash"), "Zurücksetzen");
    const lesenErg = h("div", { class: "d-erg", "aria-live": "polite" });
    const s1 = h("div", { class: "schritt" }, h("div", { class: "nr" }, "1"),
      h("div", { class: "d-schrittinhalt" }, h("h3", null, "Text einlesen"), h("p", null, "Der Jetson zerlegt den Text in Abschnitte und macht aus jedem eine Zahlenliste."),
        text, h("div", { class: "zeile d-zeile" }, bspBtn, lesenBtn, resetBtn), lesenErg));

    /* Schritt 2 */
    const frage = h("input", { type: "text", maxlength: 300, placeholder: "Stelle eine Frage zu deinem Text", "aria-label": "Deine Frage" });
    const fragBtn = h("button", { type: "button", class: "btn primary klein" }, ic("search"), "Fragen");
    const FRAGEN = ["Wie hoch ist das Gesamtbudget?", "Wer ist für die Bauüberwachung zuständig?", "Wann ist der erste Spatenstich?", "Was ist das größte Risiko?"];
    const chips = h("div", { class: "vorschlaege", "aria-label": "Beispielfragen zum Beispieltext" }, FRAGEN.map((f) => h("button", { type: "button", class: "chip", onclick: () => { frage.value = f; fragen(); } }, f)));
    const wartehinweis = h("p", { class: "d-hinweis d-warte", role: "status", hidden: true });      // erklärt, warum die Beispielfragen gerade gesperrt sind
    const sucheSatz = h("p", { class: "d-hinweis", "aria-live": "polite" });
    const trefferBox = h("div", { class: "treffer" });
    const s2 = h("div", { class: "schritt" }, h("div", { class: "nr" }, "2"),
      h("div", { class: "d-schrittinhalt" }, h("h3", null, "Frage stellen"), h("p", null, "Der Jetson sucht die Abschnitte, die zur Frage am besten passen."),
        h("div", { class: "eingabe d-frage" }, frage, fragBtn), chips, wartehinweis, sucheSatz, trefferBox));

    /* Schritt 3 */
    const antwort = h("div", { class: "satz d-antwort", "aria-live": "off" }, "Hier erscheint die Antwort.");
    const urteil = h("p", { class: "d-bsp-urteil", role: "status", "aria-live": "polite", hidden: true });
    const s3 = h("div", { class: "schritt" }, h("div", { class: "nr" }, "3"),
      h("div", { class: "d-schrittinhalt" }, h("h3", null, "Antwort"), h("p", null, "Das Sprachmodell antwortet nur mit den gefundenen Abschnitten. Verweise wie [1] zeigen auf die Treffer."), antwortMeld.el, antwort, KL.kiHinweis(), urteil));
    let erwartet = null;            // Beispielfrage mit erwarteter Antwort (Beispielmodus)
    frage.addEventListener("input", () => { if (erwartet && frage.value !== erwartet.frage) erwartet = null; });
    function urteilZeigen(roh) {
      if (!erwartet) { urteil.hidden = true; return; }
      const f = erwartet;
      const passt = KL.beispiel.antwortPasst(f, roh);
      urteil.classList.toggle("d-bsp-ok", passt === true);
      urteil.textContent = passt === null
        ? "Fangfrage. " + (f.erklaerung || "Davon steht nichts in den Dokumenten.") + " Prüfe, ob die Antwort das ehrlich sagt, statt etwas zu erfinden."
        : passt ? "Erwartet war: " + f.antwort_enthaelt + ". Die Antwort enthält es, die Suche hat die richtige Stelle gefunden."
          : "Erwartet war: " + f.antwort_enthaelt + ". Die Antwort enthält es nicht. Schau bei den Treffern, ob die richtige Stelle gefunden wurde: Daran erkennst du, ob Suche oder Modell danebenlag.";
      urteil.hidden = false;
    }

    const live = liveBlock("Live-Erklärung");
    live.text("Lies einen Text ein und stelle eine Frage. Dann siehst du hier, wie lange Suchen und Antworten dauern.");
    root.append(meld.el, s1, s2, s3, live.el);
    let wartetAuf = "";             // was gerade läuft: "lesen" oder "fragen"
    const WARTE = { lesen: "Ich lese die Dokumente noch ein, einen Moment.", fragen: "Ich beantworte gerade eine Frage, einen Moment." };
    const chipKnoepfe = () => Array.from(chips.querySelectorAll("button"));

    const ok = (s, an) => s.classList.toggle("ok", an);
    /* Während etwas läuft, sind alle Knöpfe und Beispielfragen gesperrt und ein Satz sagt, worauf gewartet wird (kein stummes Ignorieren). */
    function setBusy(b, was) {
      busy = b; wartetAuf = b ? (was || wartetAuf || "fragen") : "";
      [bspBtn, lesenBtn, resetBtn, fragBtn, ...chipKnoepfe()].forEach((x) => { x.disabled = b; });
      wartehinweis.textContent = b ? WARTE[wartetAuf] : "";
      wartehinweis.hidden = !b;
    }

    bspBtn.addEventListener("click", () => { text.value = BEISPIELTEXT; text.focus(); });
    lesenBtn.addEventListener("click", async () => {
      const t = text.value.trim();
      if (!t) { meld.zeige("Füge zuerst einen Text ein oder nutze den Beispieltext."); return; }
      if (busy) return;
      setBusy(true, "lesen"); meld.weg(); lesenBtn.textContent = "Liest ein…";
      ctrl = L.abbruch();
      try {
        const r = await postS("/api/rag/upload", { text: t }, ctrl.signal);
        if (!r.ok) throw new Error(await antwortFehler(r));
        const d = await r.json();
        hatText = d.gesamt > 0;
        lesenErg.replaceChildren(
          h("p", { class: "d-hinweis" }, fett(d.chunks + (d.chunks === 1 ? " neuer Abschnitt" : " neue Abschnitte")), " eingelesen, insgesamt " + d.gesamt + ". Jeder Abschnitt ist jetzt eine Liste aus " + d.dimension + " Zahlen. Das sind die Anfänge der neuen Abschnitte:"),
          h("ol", { class: "d-vorschau" }, (d.vorschau || []).map((v) => h("li", null, kurz(v, 110)))));
        ok(s1, hatText);
        live.text("Der Text ist eingelesen: " + d.chunks + " neue Abschnitte, jeder als " + d.dimension + " Zahlen gespeichert. Jetzt kannst du eine Frage stellen.");
      } catch (e) { const m = netzFehler(e); if (m) meld.zeige(m); }
      finally { lesenBtn.replaceChildren(ic("download"), "Einlesen"); setBusy(false); }
    });
    resetBtn.addEventListener("click", async () => {
      if (busy) return;
      setBusy(true); meld.weg();
      ctrl = L.abbruch();
      try {
        const r = await postS("/api/rag/reset", {}, ctrl.signal);
        if (!r.ok) throw new Error(await antwortFehler(r));
        hatText = false; lesenErg.replaceChildren(h("p", { class: "d-hinweis" }, "Alle eingelesenen Abschnitte sind gelöscht."));
        trefferBox.replaceChildren(); sucheSatz.textContent = ""; antwort.textContent = "Hier erscheint die Antwort.";
        ok(s1, false); ok(s2, false); ok(s3, false);
      } catch (e) { const m = netzFehler(e); if (m) meld.zeige(m); }
      finally { setBusy(false); }
    });

    function antwortMitVerweisen(roh, karten) {
      const teile = roh.split(/(\[\d+\])/);
      return teile.map((t) => {
        const m = /^\[(\d+)\]$/.exec(t);
        if (!m || !karten[Number(m[1]) - 1]) return t;
        const k = karten[Number(m[1]) - 1];
        const b = h("button", { type: "button", class: "d-ref", "aria-label": "Treffer " + m[1] + " hervorheben" }, t);
        const an = () => k.classList.add("d-hl"), aus = () => k.classList.remove("d-hl");
        b.addEventListener("pointerenter", an); b.addEventListener("pointerleave", aus);
        b.addEventListener("focus", an); b.addEventListener("blur", aus);
        return b;
      });
    }

    async function fragen() {
      const f = frage.value.trim().slice(0, 300);
      if (!f || busy) return;
      setBusy(true, "fragen"); meld.weg(); antwortMeld.weg(); ok(s2, false); ok(s3, false); urteil.hidden = true;
      trefferBox.replaceChildren(); sucheSatz.textContent = "Der Jetson vergleicht deine Frage mit den Abschnitten…";
      antwort.textContent = "Wartet auf die Suche…";
      live.pipe([]);
      const c = L.abbruch(); ctrl = c;
      let karten = [];
      try {
        const t0 = performance.now();
        const r = await postS("/api/rag/search", { frage: f }, c.signal);
        if (!r.ok) {
          const m = await antwortFehler(r);
          if (/keine Dokumente/.test(m)) throw new Error("Es sind noch keine Dokumente eingelesen. Das geht in Schritt 1: Füge einen Text ein und drücke auf Einlesen.");
          throw new Error(m);
        }
        const d = await r.json();
        const tSuche = performance.now() - t0;
        sucheSatz.textContent = "Die Frage wurde in " + d.dimension + " Zahlen verwandelt (in " + msText(d.embed_ms) + ") und mit allen " + d.abschnitte + " Abschnitten verglichen. Das sind die ähnlichsten.";
        karten = (d.treffer || []).map((t) => {
          const s = Math.max(0, Math.min(1, t.score));
          const inhalt = h("div", { class: "d-treffer", tabindex: "-1" },
            h("div", { class: "sc" }, h("span", null, "Rang " + t.rang), h("span", null, "Score " + de(t.score, 2))),
            h("div", { class: "d-ttext" }, t.text),
            h("div", { class: "bal", style: "width:" + (s * 100) + "%" }));
          return inhalt;
        });
        trefferBox.replaceChildren(...karten);
        ok(s2, karten.length > 0);
        live.pipe([
          { k: "e", cls: "s4", wert: d.embed_ms, text: msText(d.embed_ms), name: "Frage einbetten" },
          { k: "v", cls: "s2", wert: Math.max(1, tSuche - d.embed_ms), text: msText(tSuche - d.embed_ms), name: "Vergleichen und Netz" },
        ], "Zeit für Einbetten und Vergleichen");
        live.text("Die Suche hat " + msText(tSuche) + " gedauert, davon " + msText(d.embed_ms) + " fürs Einbetten der Frage. Der beste Treffer hat den Score " + de(karten.length ? d.treffer[0].score : 0, 2) + ". Jetzt schreibt das Sprachmodell die Antwort.");
        antwort.textContent = "Das Sprachmodell liest die Treffer…";

        const tAsk = performance.now();
        let tErst = 0;
        let roh = "", rafOffen = false, fertigGezeichnet = false;
        const zeichne = () => { rafOffen = false; if (fertigGezeichnet || /^\[Dem Jetson fehlt gerade freier Speicher/.test(roh)) return; antwort.replaceChildren(...antwortMitVerweisen(roh, karten)); };
        const liveAntwort = drossel((n) => {
          live.text("Das Sprachmodell bekommt nur die vier Treffer und deine Frage und schreibt die Antwort. Bisher: " + n + " Wörter.");
        }, 500);
        L.onEnde(() => liveAntwort.stop());
        /* Auf dem Jetson scheitert das Laden des Sprachmodells direkt nach dem Embedding-Modell manchmal einmal
           ("fehlt gerade freier Speicher"). Der zweite Versuch gelingt dann meist, deshalb einmal selbst wiederholen. */
        const hinweis = (t) => { if (!tErst) { antwort.textContent = t; live.text(t); } };
        const stoppePlatz = KL.last.beobachten((i) => hinweis(KL.last.platzText(i)));
        L.onEnde(stoppePlatz);
        for (let versuch = 1; ; versuch++) {
          let r2;
          try { r2 = await postLast("/api/rag/ask", { frage: f }, c.signal, (i) => hinweis(KL.last.warteText(i))); }
          catch (err) { stoppePlatz(); throw err; }
          if (!r2.ok) { stoppePlatz(); throw new Error(await antwortFehler(r2)); }
          roh = "";
          await streamLesen(r2, (gesamt) => {
            const i = gesamt.indexOf("\n\n---\n");
            roh = (i < 0 ? gesamt : gesamt.slice(0, i)).trim();
            if (roh && !tErst) tErst = performance.now();
            if (!rafOffen) { rafOffen = true; requestAnimationFrame(zeichne); }
            liveAntwort(roh.split(/\s+/).filter(Boolean).length);
          });
          if (versuch < 2 && /^\[Dem Jetson fehlt gerade freier Speicher/.test(roh)) {
            live.text("Dem Jetson fehlte kurz Speicher für das Sprachmodell. Er räumt auf und versucht es noch einmal.");
            tErst = 0;
            await new Promise((ok2) => L.timeout(ok2, 2500));
            if (L.weg) return;
            continue;
          }
          break;
        }
        stoppePlatz();
        liveAntwort.stop();
        fertigGezeichnet = true;
        const tEnde = performance.now();
        antwort.replaceChildren(...antwortMitVerweisen(roh || "Das Modell hat keine Antwort geliefert.", karten));
        const fe = /\[Fehler: ([^\]]*)\]/.exec(roh);
        if (fe) throw new Error("Das Sprachmodell meldet einen Fehler: " + fe[1]);
        if (/^\[(?!\d+\])[^\]]+\]$/.test(roh)) throw new Error(roh.slice(1, -1));
        ok(s3, !!roh);
        urteilZeigen(roh);
        const warte = (tErst || tEnde) - tAsk, schreib = tEnde - (tErst || tEnde);
        live.pipe([
          { k: "e", cls: "s4", wert: d.embed_ms, text: msText(d.embed_ms), name: "Frage einbetten" },
          { k: "v", cls: "s2", wert: Math.max(1, tSuche - d.embed_ms), text: msText(tSuche - d.embed_ms), name: "Vergleichen und Netz" },
          { k: "w", cls: "s6", wert: warte, text: sekText(warte), name: "Warten auf das erste Wort" },
          { k: "s", cls: "s5", wert: Math.max(1, schreib), text: sekText(schreib), name: "Antwort schreiben" },
        ], "Zeit je Schritt");
        live.text(fett("Fertig. "), "Suchen: " + msText(tSuche) + ". Bis zum ersten Wort der Antwort: " + sekText(warte) + ". Schreiben: " + sekText(schreib) + ". Fahre mit der Maus über einen Verweis wie [1], dann siehst du, auf welchen Treffer er zeigt.");
      } catch (e) {
        const m = netzFehler(e);
        if (m) {
          const belegt = istBelegt(e) || KL.last.istBelegtText(m);
          // Ausgelastet ist kein Fehler des Besuchers: freundlicher Text, Wiederholknopf, die Frage bleibt stehen
          antwortMeld.zeige(m, () => fragen());
          live.text(belegt ? "Der Rechner ist gerade ausgelastet. Drücke auf Noch einmal versuchen, sobald du magst." : "Das hat diesmal nicht geklappt. Du kannst es gleich noch einmal versuchen.");
          if (!karten.length) sucheSatz.textContent = "";
          antwort.textContent = belegt ? "Die Antwort kommt, sobald der Rechner frei ist." : "Diesmal gab es keine Antwort. Die Meldung darüber sagt, woran es lag.";
        }
      }
      finally { setBusy(false); }
    }
    fragBtn.addEventListener("click", fragen);
    frage.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); fragen(); } });

    /* Beispielmodus: Dokumentensatz einlesen und die Beispielfragen als Chips anbieten. */
    beispielStart(root, seite, "rag", L, async (e, kopfB) => {
      const dokus = (e.daten && e.daten.dokumente) || [];
      const fragenListe = (e.daten && e.daten.fragen) || [];
      setBusy(true, "lesen");
      try {
        kopfB.text("Der Jetson wird vorbereitet: Alte Abschnitte löschen …");
        const r0 = await postS("/api/rag/reset", {}, ctrl2().signal);
        if (!r0.ok) throw new Error(await antwortFehler(r0));
        let abschnitte = 0, dim = 0;
        for (let i = 0; i < dokus.length; i++) {
          if (L.weg) return;
          kopfB.text("Dokument " + (i + 1) + " von " + dokus.length + " wird eingelesen: " + dokus[i].titel);
          const t = await KL.beispiel.textLaden(dokus[i].datei);
          const r = await postS("/api/rag/upload", { text: t }, ctrl2().signal);
          if (!r.ok) throw new Error(await antwortFehler(r));
          const d = await r.json();
          abschnitte = d.gesamt; dim = d.dimension;
        }
        hatText = abschnitte > 0;
        lesenErg.replaceChildren(
          h("p", { class: "d-hinweis" }, fett(dokus.length + " Dokumente"), " sind eingelesen, zusammen " + abschnitte + " Abschnitte, jeder als Liste aus " + dim + " Zahlen:"),
          h("ul", { class: "d-vorschau" }, dokus.map((d) => h("li", null, d.titel))));
        ok(s1, hatText);
        live.text("Die Dokumente sind eingelesen. Wähle eine Beispielfrage. Eine davon ist eine Fangfrage: Ihre Antwort steht in keinem Dokument.");
      } catch (err) { const m = netzFehler(err); if (m) meld.zeige(m); kopfB.text("Das Einlesen ist abgebrochen."); setBusy(false); return; }
      setBusy(false);
      chips.replaceChildren(...fragenListe.map((f) => h("button", { type: "button", class: "chip", onclick: () => { if (busy) { setBusy(true); return; } erwartet = f; frage.value = f.frage; fragen(); } }, f.frage)));
      chips.setAttribute("aria-label", "Beispielfragen zu den Dokumenten");
      kopfB.text("Fertig: " + dokus.length + " Dokumente eingelesen. Wähle eine Beispielfrage, der Klick startet die Suche.");
      // Die Frage im Feld muss zu den Beispieldokumenten passen (nicht zum Orion-Beispieltext): erste Beispielfrage einsetzen
      if (fragenListe.length) { erwartet = fragenListe[0]; frage.value = erwartet.frage; hervor(fragBtn); }
    });
    function ctrl2() { ctrl = L.abbruch(); return ctrl; }

    return { destroy() { L.destroy(); } };
  }

  /* ============================================================ 5 Agent */
  function agent(root, seite) {
    const L = leben();
    let busy = false, ctrl = null;
    const meld = meldungBox();
    const frage = h("input", { type: "text", maxlength: 300, placeholder: "Stelle eine Aufgabe, bei der Rechnen, Uhrzeit oder Dokumente helfen", "aria-label": "Deine Aufgabe" });
    const sendeBtn = h("button", { type: "button", class: "btn primary" }, ic("send"), "Fragen");
    const FRAGEN = ["Was ist 23 mal 19 plus 100?", "Welcher Wochentag ist heute?", "Rechne 17 mal 23 und sag mir danach, wie spät es ist.", "Suche in den Dokumenten nach dem Wort Budget."];
    const chips = h("div", { class: "vorschlaege", "aria-label": "Beispielfragen" }, FRAGEN.map((f) => h("button", { type: "button", class: "chip", onclick: () => { frage.value = f; los(); } }, f)));
    const hinweis = h("p", { class: "d-hinweis" }, "Die Dokumentsuche braucht vorher eingelesenen Text. Lies ihn im ", h("a", { href: "#/rag" }, "RAG-Labor"), " ein, zum Beispiel den Beispieltext.");
    const status = h("p", { class: "d-status", role: "status", hidden: true });
    const karten = h("div", { class: "d-karten" });
    const live = liveBlock("Live-Erklärung");
    live.text("Stelle eine Aufgabe. Hier siehst du dann, wie das Modell Werkzeuge wählt und wie lange jeder Schritt dauert.");
    root.append(h("div", { class: "eingabe d-frage" }, frage, sendeBtn), chips, hinweis, meld.el, status, karten, KL.kiHinweis(), live.el);
    let szenario = null, erwartet = null;      // Beispielmodus: Szenario fuer /api/agent/ask und erwartete Antwort
    frage.addEventListener("input", () => { if (erwartet && frage.value !== erwartet.frage) erwartet = null; });
    const urteil = h("p", { class: "d-bsp-urteil", role: "status", "aria-live": "polite", hidden: true });
    karten.after(urteil);
    function urteilZeigen(text) {
      if (!erwartet) { urteil.hidden = true; return; }
      const f = erwartet;
      const passt = KL.beispiel.antwortPasst(f, text);
      urteil.classList.toggle("d-bsp-ok", passt === true);
      urteil.textContent = passt === null
        ? "Fangfrage. " + (f.erklaerung || "") + " Prüfe, ob der Agent ehrlich sagt, dass er nichts gefunden hat."
        : (passt ? "Erwartet war: " + f.antwort_enthaelt + ". Die Antwort enthält es. " : "Erwartet war: " + f.antwort_enthaelt + ". Die Antwort enthält es nicht. ") + (f.erklaerung || "");
      urteil.hidden = false;
    }

    function zeigeEingabe(json) {
      let o = null;
      try { o = JSON.parse(json); } catch (e) { /* kein JSON */ }
      if (!o || typeof o !== "object" || !Object.keys(o).length) return [h("span", { class: "d-leise" }, "keine Eingabe")];
      return Object.entries(o).map(([k, v]) => h("span", { class: "d-par" }, h("span", { class: "d-leise" }, k + ": "), h("code", null, typeof v === "string" ? v : JSON.stringify(v))));
    }
    function erklaerung(name, json, ergebnis) {
      let o = {}; try { o = JSON.parse(json) || {}; } catch (e) { /* egal */ }
      const fehler = /^Fehler/.test(ergebnis);
      if (name === "rechne") {
        const ausdruck = o.ausdruck != null ? String(o.ausdruck) : json;
        return fehler
          ? "Das Modell wollte das Werkzeug rechne benutzen, mit der Eingabe " + ausdruck + ". Der Rechner hat sie abgelehnt, weil er nur Zahlen und einfache Rechenzeichen versteht. Das Modell bekommt diese Meldung zurück."
          : "Das Modell hat selbst entschieden, das Werkzeug rechne zu benutzen, mit der Eingabe " + ausdruck + ". Das Ergebnis " + ergebnis + " geht zurück an das Modell.";
      }
      if (name === "uhrzeit") return "Das Modell hat selbst entschieden, die Uhr zu lesen. Das Werkzeug uhrzeit gibt Datum und Uhrzeit des Jetson zurück, hier: " + ergebnis + ". Das Modell bekommt es als Antwort zurück.";
      if (name === "dokumentsuche") {
        return /^nichts gefunden/.test(ergebnis)
          ? "Das Modell hat das Werkzeug dokumentsuche mit dem Begriff " + (o.begriff != null ? o.begriff : json) + " benutzt. Es gab keinen Treffer. Lies vorher im RAG-Labor einen Text ein."
          : "Das Modell hat das Werkzeug dokumentsuche mit dem Begriff " + (o.begriff != null ? o.begriff : json) + " benutzt. Der Jetson hat Abschnitte gefunden, die das Wort enthalten, und gibt sie an das Modell zurück.";
      }
      if (name === "bestellstatus") return fehler
        ? "Das Werkzeug bestellstatus kennt diese Bestellnummer nicht und meldet das. Ein gutes Modell sagt das ehrlich weiter, statt einen Status zu erfinden."
        : "Das Modell hat das Werkzeug bestellstatus mit der Bestellnummer " + (o.nummer != null ? o.nummer : json) + " gewählt. Die Daten kommen aus der Bestelltabelle, nicht aus dem Gedächtnis des Modells.";
      if (name === "preis_berechnen") return "Das Modell hat das Werkzeug preis_berechnen gewählt. Es rechnet das Werkzeug aus, nicht das Modell: Zwischensumme und Versandkosten nach der Regel, dann der Gesamtpreis.";
      if (name === "stornierung_pruefen") return "Das Modell hat das Werkzeug stornierung_pruefen gewählt. Es wendet die Regel an (nur bei Status bestellt oder in Bearbeitung) und liefert Antwort und Grund. Storniert wird dabei nichts.";
      if (name === "bestellungen_suchen") return "Das Modell hat das Werkzeug bestellungen_suchen mit dem Kundenkürzel " + (o.kunde != null ? o.kunde : json) + " gewählt und bekommt die Liste der Bestellungen dieses Kunden.";
      return "Das Modell hat ein Werkzeug namens " + name + " gewählt. Der Jetson hat es ausgeführt und das Ergebnis an das Modell zurückgegeben.";
    }
    function schrittKarte(n, name, json, ergebnis) {
      return h("div", { class: "karte-w" },
        h("div", { class: "kopfz" }, ic("wrench"), "Werkzeug-Aufruf, Schritt " + n),
        h("div", { class: "d-zeilek" }, h("span", { class: "d-leise" }, "Werkzeug"), h("code", null, name)),
        h("div", { class: "d-zeilek" }, h("span", { class: "d-leise" }, "Eingabe"), h("span", { class: "d-pars" }, zeigeEingabe(json))),
        h("div", { class: "d-zeilek" }, h("span", { class: "d-leise" }, "Ergebnis"), h("span", { class: "d-ergtext" }, ergebnis)),
        h("p", { class: "d-erkl" }, erklaerung(name, json, ergebnis)));
    }

    async function los() {
      const f = frage.value.trim().slice(0, 300);
      if (!f || busy) return;
      busy = true; sendeBtn.disabled = true; meld.weg(); karten.replaceChildren(); urteil.hidden = true;
      status.hidden = false; status.textContent = "Das Modell überlegt…";
      ctrl = new AbortController(); const sig = ctrl.signal;
      const t0 = performance.now();
      let letzteZeit = t0, schritte = 0, verarbeitetBis = 0, antwortKarte = null, antwortText = null, segs = [], leereWerkzeuge = 0;
      live.text("Der Jetson schickt deine Frage und die Beschreibung der drei Werkzeuge an das Modell. Das Modell entscheidet, ob es ein Werkzeug braucht.");
      live.pipe([]);
      const zeitStreifen = () => live.pipe(segs, "Zeit je Schritt");
      try {
        const hinweis = (t) => { if (!schritte) { status.textContent = t; live.text(t); } };
        const stoppePlatz = KL.last.beobachten((i) => hinweis(KL.last.platzText(i)));
        L.onEnde(stoppePlatz);
        let r;
        try { r = await postLast("/api/agent/ask", szenario ? { frage: f, szenario } : { frage: f }, sig, (i) => hinweis(KL.last.warteText(i))); }
        finally { stoppePlatz(); }
        if (!r.ok) throw new Error(await antwortFehler(r));
        await streamLesen(r, (gesamt) => {
          const jetzt = performance.now();
          const iA = gesamt.indexOf("[Antwort] ");
          const bereich = iA < 0 ? gesamt : gesamt.slice(0, iA);
          // vollstaendige Werkzeugzeilen
          const zeilen = bereich.slice(verarbeitetBis).split("\n");
          const unfertig = zeilen.pop();
          for (const z of zeilen) {
            verarbeitetBis += z.length + 1;
            const m = /^\[Werkzeug\] ([^(]+)\((.*?)\)  ->  ([\s\S]*)$/.exec(z);
            if (!m) continue;
            schritte++;
            if (/nichts gefunden|nicht gefunden/i.test(m[3])) leereWerkzeuge++;           // das Werkzeug fand nichts: Antwort später gegenprüfen
            karten.append(schrittKarte(schritte, m[1].trim(), m[2], m[3]));
            segs.push({ k: "s" + schritte, cls: "s" + (((schritte - 1) % 3) + 3), wert: jetzt - letzteZeit, text: sekText(jetzt - letzteZeit), name: "Schritt " + schritte + ": " + m[1].trim() });
            letzteZeit = jetzt;
            status.textContent = "Schritt " + schritte + " fertig. Das Modell überlegt weiter…";
            live.text("Schritt " + schritte + " ist da: Das Modell hat " + m[1].trim() + " gewählt und der Jetson hat es ausgeführt. Jetzt überlegt das Modell, ob es weitere Werkzeuge braucht oder antworten kann.");
            zeitStreifen();
          }
          if (iA >= 0) {
            const text = gesamt.slice(iA + 10).trim();
            if (!antwortKarte) {
              antwortText = h("div", { class: "d-ergtext" });
              antwortKarte = h("div", { class: "karte-w antwort" }, h("div", { class: "kopfz" }, ic("check"), "Antwort"), antwortText,
                h("p", { class: "d-erkl" }, schritte === 0 ? "Das Modell hat kein Werkzeug gebraucht und direkt geantwortet." : "Das Modell hat die Ergebnisse der Werkzeuge gelesen und daraus die Antwort formuliert."));
              karten.append(antwortKarte);
              segs.push({ k: "a", cls: "s1", wert: Math.max(1, jetzt - letzteZeit), text: sekText(jetzt - letzteZeit), name: "Antwort formulieren" });
              letzteZeit = jetzt;
            }
            antwortText.textContent = text;
          } else if (/\[Abbruch/.test(unfertig || "") && !antwortKarte) {
            antwortText = h("div", { class: "d-ergtext" }, "Nach fünf Schritten hat der Agent abgebrochen.");
            antwortKarte = h("div", { class: "karte-w antwort" }, h("div", { class: "kopfz" }, ic("alert"), "Abbruch"), antwortText);
            karten.append(antwortKarte);
          }
        });
        const gesamtMs = performance.now() - t0;
        if (!antwortKarte) throw new Error("Das Modell hat keine Antwort geliefert. Versuche es mit einer anderen Formulierung.");
        zeitStreifen();
        // Widerspruch markieren: Das Werkzeug meldete "nichts gefunden", die Antwort klingt aber nach Erfolg (kein "nicht", "kein", "leider" ...)
        if (leereWerkzeuge > 0 && antwortKarte.classList.contains("antwort") && !/\b(nicht|kein\w*|nichts|leider|unbekannt|weiß)\b/i.test(antwortText.textContent)) {
          antwortKarte.classList.add("d-widerspruch");
          antwortKarte.append(h("p", { class: "d-erkl d-warnung", role: "note" }, ic("alert"), h("span", null, h("b", null, "Das Werkzeug fand nichts, die Antwort des Modells kann erfunden sein. "), "Prüfe sie gegen das Ergebnis oben.")));
        }
        urteilZeigen(antwortText.textContent);
        status.textContent = schritte + (schritte === 1 ? " Werkzeug-Schritt" : " Werkzeug-Schritte") + ", Gesamtzeit " + sekText(gesamtMs) + ".";
        live.text(fett("Fertig. "), schritte === 0 ? "Das Modell hat ohne Werkzeug geantwortet. " : "Das Modell hat " + schritte + (schritte === 1 ? " Werkzeug" : " Werkzeuge") + " gewählt, der Jetson hat sie ausgeführt. ", "Alles zusammen dauerte " + sekText(gesamtMs) + ". Jeder Abschnitt im Streifen ist die Zeit bis zum nächsten Ergebnis.");
      } catch (e) {
        const m = netzFehler(e);
        status.hidden = true;
        if (m) meld.zeige(m, istBelegt(e) || KL.last.istBelegtText(m) ? () => los() : null);
      }
      busy = false; ctrl = null; sendeBtn.disabled = false;
    }
    L.onEnde(() => { if (ctrl) ctrl.abort(); });
    sendeBtn.addEventListener("click", los);
    frage.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing) { e.preventDefault(); los(); } });

    /* Beispielmodus: Szenario mit eigenen Werkzeugen, Beispielfragen als Klickchips. */
    beispielStart(root, seite, "agent", L, (e, kopfB) => {
      const d = e.daten || {};
      szenario = e.id;
      const werkz = d.werkzeuge || [];
      hinweis.replaceChildren(
        fett("Werkzeuge in diesem Beispiel: "), werkz.map((w) => w.name).join(", ") + ". ",
        "Die Daten kommen aus einer Bestelltabelle mit erfundenen Bestellungen, die Regeln stehen im Werkzeug. Das Modell rät nicht, es schlägt nach.");
      chips.replaceChildren(...(d.fragen || []).map((f) => h("button", { type: "button", class: "chip", onclick: () => { if (busy) return; erwartet = f; frage.value = f.frage; los(); } }, f.frage)));
      chips.setAttribute("aria-label", "Beispielfragen zu den Bestellungen");
      frage.placeholder = "Frage zu den Bestellungen, zum Beispiel: Wie ist der Status der Bestellung B-10233?";
      live.text("Wähle eine Beispielfrage. Das Modell entscheidet selbst, welches der vier Werkzeuge es braucht. Hier siehst du dann jeden Schritt.");
      kopfB.text("Bereit: " + werkz.length + " Werkzeuge und " + (d.fragen || []).length + " Beispielfragen. Der Klick auf eine Frage startet den Agenten.");
      if ((d.fragen || []).length) { erwartet = d.fragen[0]; frage.value = erwartet.frage; hervor(sendeBtn); }
    });
    return { destroy() { L.destroy(); } };
  }

  /* ------------------------------------------------------------ Registrierung */
  Object.assign(KL.demos, {
    "webcam-gesicht": (root, seite) => webcam(root, "gesicht", seite),
    "webcam-objekt": (root, seite) => webcam(root, "objekt", seite),
    "webcam-hand-gesicht": (root, seite) => webcam(root, "hand_gesicht", seite),
    teach, chat, rag, agent,
  });
  KL.kamera = webcam;                         // Weitere Kamera-Labore: KL.kameraModi[modus] = {...}; KL.demos["webcam-xyz"] = (root, seite) => KL.kamera(root, "modus", seite)
  KL.kameraModi = KL.kameraModi || {};
})();
