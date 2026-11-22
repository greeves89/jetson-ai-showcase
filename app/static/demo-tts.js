/* demo-tts: Labor "Text zu Sprache".
   Ablauf: Text und Stimme -> POST /api/tts (JSON) -> WAV als base64, Lautschrift und Zeiten.
   Die Live-Erklaerung zeigt die Pipeline Text, Lautschrift, Klang, Ausgabe und rechnet das Tempo
   in einen Alltagssatz um. Die Wellenform liest das WAV selbst (ohne Bibliothek) und zeichnet auf ein Canvas.
   Vertrag siehe app.js: KL.demos.tts(root, seite) gibt { destroy() } zurueck.
   SICHERHEIT: Lautschrift, aufbereiteter Text und Fehlermeldungen kommen aus dem Netz und werden nur per
   h(...)/textContent eingesetzt, nie als HTML. */
(function () {
  "use strict";
  const KL = window.KL;
  const { h, icon, zeit } = KL;

  const MAX_ZEICHEN = 500;
  const TEMPO_MIN = 0.7, TEMPO_MAX = 1.5;
  const STANDARDTEXT = "Hallo! Ich bin der Jetson und lese dir diesen Satz vor.";

  // Probiertexte. Die Hinweise beschreiben nur, was bei diesen Texten tatsaechlich in der Lautschrift steht.
  const PROBEN = [
    { id: "zahlen", name: "Zahlen und Datum", text: "Am 24. Dezember 2026 kostet es 1.299,50 Euro.",
      lern: "Achte darauf, dass Zahlen in Wörter verwandelt werden. Und schau, wo der Punkt nach der 24 den Satz teilt." },
    { id: "abk", name: "Abkürzungen", text: "Wir treffen uns z. B. mit der GmbH und dem TÜV.",
      lern: "Abkürzungen liest der Computer Buchstabe für Buchstabe. Der Punkt in „z. B.“ wirkt wie ein Satzende." },
    { id: "fremd", name: "Fremdwörter", text: "Der Jetson verarbeitet Token und Embeddings.",
      lern: "Englische Wörter werden nach deutschen Regeln gelesen. Hör, wie Embeddings klingt." },
    { id: "betonung", name: "Betonung", text: "Du kommst morgen? Du kommst morgen!",
      lern: "Beide Sätze haben dieselben Wörter. Nur das Satzzeichen unterscheidet sie. Hör, ob die Stimme anders klingt." },
    { id: "namen", name: "Namen", text: "Frau Schneider fährt mit Herrn Nguyen nach Hannover.",
      lern: "Häufige deutsche Namen klappen meist. Bei fremden Namen wie Nguyen rät das Modell nach deutschen Regeln." },
  ];

  const NAMEN = ["Text", "Lautschrift", "Klang erzeugen", "Ausgabe"];
  const FARBEN = ["s1", "s2", "s3", "s4"];
  const FARBWERT = { s1: "#5e5ce6", s2: "#64748b", s3: "#0a84ff", s4: "#30a14e" };  // wie .pipe .s1 bis .s4 in style.css

  const dez = (zahl, stellen = 1) => zahl.toFixed(stellen).replace(".", ",");
  const sek = (s) => dez(s, s < 0.1 ? 2 : 1) + " Sekunden";

  /* ------------------------------------------------------------ WAV lesen und zeichnen */
  function leseWav(bytes) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let p = 12, rate = 22050, daten = null;
    while (p + 8 <= bytes.length) {
      const name = String.fromCharCode(bytes[p], bytes[p + 1], bytes[p + 2], bytes[p + 3]);
      const len = dv.getUint32(p + 4, true);
      if (name === "fmt ") rate = dv.getUint32(p + 12, true);
      else if (name === "data") {
        const n = Math.floor(Math.min(len, bytes.length - p - 8) / 2);
        daten = new Int16Array(n);
        for (let i = 0; i < n; i++) daten[i] = dv.getInt16(p + 8 + i * 2, true);
        break;
      }
      p += 8 + len + (len % 2);
    }
    return { rate, samples: daten || new Int16Array(0) };
  }
  function base64Bytes(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function zeichneWelle(canvas, samples, anteil, farben) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const B = Math.max(1, Math.round(canvas.clientWidth * dpr)), H = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== B || canvas.height !== H) { canvas.width = B; canvas.height = H; }
    const c = canvas.getContext("2d");
    c.clearRect(0, 0, B, H);
    const mitte = H / 2, n = samples.length;
    const spalte = Math.max(2, Math.round(2 * dpr)), luecke = Math.max(1, Math.round(dpr));
    const anzahl = Math.floor(B / (spalte + luecke));
    const grenze = Math.floor(anzahl * anteil);
    for (let i = 0; i < anzahl; i++) {
      const a = Math.floor((i / anzahl) * n), b = Math.max(a + 1, Math.floor(((i + 1) / anzahl) * n));
      let m = 0;
      for (let k = a; k < b && k < n; k += Math.max(1, Math.floor((b - a) / 40))) { const v = Math.abs(samples[k]); if (v > m) m = v; }
      const hoehe = Math.max(2 * dpr, (m / 32768) * (H - 4 * dpr));
      c.fillStyle = i < grenze ? farben.gespielt : farben.offen;
      c.fillRect(i * (spalte + luecke), mitte - hoehe / 2, spalte, hoehe);
    }
  }

  KL.demos.tts = function (root, seite) {
    root.classList.add("tts");
    let weg = false;
    let stimmen = [];
    let gewaehlt = null;
    let tempo = 1.0;
    let laeuft = false;
    let abbruch = null;
    let ergebnisse = [];            // { daten, url, audio, canvas, samples, rate, name, raf, ... }
    let letzte = null;              // Parameter des letzten Ergebnisses: text|stimme|tempo
    const aufraeumer = [];

    /* ------------------------------------------------------------ Oberflaeche */
    const feld = h("textarea", { class: "tts-feld", id: "tts-text", rows: 3, maxlength: MAX_ZEICHEN, "aria-describedby": "tts-zaehler",
      placeholder: "Schreib einen Text, den der Jetson sprechen soll.", oninput: zaehlen,
      onkeydown: (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); sprechen(); } } });
    feld.value = STANDARDTEXT;
    const zaehler = h("span", { class: "tts-zaehler mono", id: "tts-zaehler" });
    const lernHinweis = h("p", { class: "tts-lern", "aria-live": "polite" });
    const probenChips = PROBEN.map((p) => h("button", { class: "chip tts-chip", type: "button", dataset: { id: p.id }, "aria-pressed": "false", onclick: () => probe(p) }, p.name));

    const stimmenZeile = h("div", { class: "tts-stimmen", role: "group", "aria-label": "Stimme wählen" });
    const stimmenText = h("p", { class: "tts-stimmentext", "aria-live": "polite" });
    const tempoIn = h("input", { type: "range", id: "tts-tempo", min: TEMPO_MIN, max: TEMPO_MAX, step: 0.05, value: 1, oninput: () => { tempo = parseFloat(tempoIn.value); tempoAus.textContent = dez(tempo, 2) + "×"; } });
    const tempoAus = h("output", { for: "tts-tempo" }, "1,00×");
    const sprechKnopf = h("button", { class: "btn primary tts-sprechen", type: "button", onclick: () => sprechen() }, icon("play"), "Sprechen");
    const vergleichKnopf = h("button", { class: "btn tts-vergleich", type: "button", onclick: vergleichen }, icon("faceswap"), "Mit anderer Stimme vergleichen");
    const status = h("p", { class: "tts-status", role: "status", "aria-live": "polite" });
    const hinweis = h("div", { class: "tts-hinweis", role: "alert", hidden: true });

    const ergebnisBox = h("div", { class: "tts-ergebnisse", hidden: true });
    const liveTitel = h("div", { class: "titel" }, icon("live"), "Live-Erklärung");
    const pipen = h("div", { class: "tts-pipen" });
    const lautBox = h("div", { class: "tts-laut", hidden: true });
    const erkl = h("div", { class: "erklaerung tts-erkl", "aria-live": "polite" },
      h("p", null, "Sprich einen Text. Dann siehst du hier, wie aus Buchstaben erst Lautschrift und dann Klang wird und wie schnell der Jetson dabei ist."));
    const live = h("div", { class: "live tts-live" }, liveTitel, pipen, lautBox, erkl);
    const missbrauch = h("p", { class: "tts-missbrauch" }, icon("info"),
      h("span", null, "Diese Stimmen stammen von echten Menschen, deren Aufnahmen frei lizenziert sind. Eine Stimme ohne Einwilligung zu klonen ist ein Missbrauchsrisiko, etwa für Betrug am Telefon."));

    root.append(
      h("div", { class: "tts-buehne" },
        h("label", { class: "tts-label", for: "tts-text" }, "Text"),
        feld,
        h("div", { class: "tts-feldfuss" }, lernHinweis, zaehler),
        KL.gruppe("Stimme und Tempo", [
          KL.zeile("Zum Ausprobieren", probenChips, null, true),
          KL.zeile("Stimme", stimmenZeile, null, true),
          h("div", { class: "regler tts-tempo" }, h("label", { for: "tts-tempo" }, "Sprechtempo"), tempoIn, tempoAus)],
          { fuss: stimmenText, aktion: [sprechKnopf, vergleichKnopf], aktionKlasse: "tts-knoepfe" }),
        status, hinweis),
      ergebnisBox, live, missbrauch);
    zaehlen();
    knoepfe();

    /* ------------------------------------------------------------ Stimmen laden */
    const ladeAbbruch = new AbortController();
    fetch("/api/tts/stimmen", { signal: ladeAbbruch.signal }).then((r) => r.json()).then((d) => {
      if (weg) return;
      stimmen = Array.isArray(d.stimmen) ? d.stimmen.filter((s) => s && typeof s.id === "string") : [];
      if (!stimmen.length) { melde("Auf dem Jetson ist gerade keine Stimme installiert. Das Labor kann nicht sprechen."); return; }
      gewaehlt = stimmen[0].id;
      zeichneStimmen();
      knoepfe();
    }).catch((e) => { if (!weg && !(e && e.name === "AbortError")) melde("Die Stimmenliste ließ sich nicht laden. Prüfe die Verbindung zum Jetson und lade die Seite neu."); });

    function zeichneStimmen() {
      stimmenZeile.replaceChildren(...stimmen.map((s) =>
        h("button", { class: "chip tts-stimme", type: "button", dataset: { id: s.id }, "aria-pressed": s.id === gewaehlt ? "true" : "false", onclick: () => waehle(s.id) }, String(s.name || s.id))));
      const s = stimmen.find((x) => x.id === gewaehlt);
      stimmenText.textContent = s ? String(s.beschreibung || "") : "";
    }
    function waehle(id) { gewaehlt = id; zeichneStimmen(); knoepfe(); }
    function andere() {
      const i = stimmen.findIndex((s) => s.id === gewaehlt);
      return stimmen.length > 1 ? stimmen[(i + 1) % stimmen.length] : null;
    }
    const nameVon = (id) => { const s = stimmen.find((x) => x.id === id); return s ? String(s.name || s.id) : id; };

    /* ------------------------------------------------------------ Eingabe */
    function zaehlen() {
      const n = feld.value.length;
      zaehler.textContent = n + " / " + MAX_ZEICHEN;
      zaehler.classList.toggle("warn", n >= MAX_ZEICHEN - 40);
      knoepfe();
    }
    function probe(p) {
      feld.value = p.text;
      lernHinweis.textContent = p.lern;
      probenChips.forEach((c) => c.setAttribute("aria-pressed", c.dataset.id === p.id ? "true" : "false"));
      zaehlen();
      feld.focus();
    }
    function knoepfe() {
      const leer = !feld.value.trim();
      sprechKnopf.disabled = laeuft || leer || !gewaehlt;
      vergleichKnopf.disabled = laeuft || leer || !gewaehlt || stimmen.length < 2;
      const a = andere();
      if (a) vergleichKnopf.title = "Spricht denselben Text zusätzlich mit " + nameVon(a.id) + ".";
    }
    function melde(text) {
      hinweis.hidden = !text;
      hinweis.textContent = text || "";
    }

    /* ------------------------------------------------------------ Anfrage */
    async function anfrage(stimme, text) {
      abbruch = new AbortController();
      let r, d;
      try {
        r = await fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, signal: abbruch.signal,
          body: JSON.stringify({ text, stimme, tempo: Math.round(tempo * 100) / 100 }) });
        d = await r.json().catch(() => ({}));
      } catch (e) {
        throw new Error("Der Jetson ist gerade nicht erreichbar. Prüfe die Verbindung und versuche es noch einmal.");
      }
      if (!r.ok) throw new Error(typeof d.fehler === "string" && d.fehler ? d.fehler : "Die Sprachausgabe hat nicht geklappt (Fehler " + r.status + "). Versuche es noch einmal.");
      return d;
    }

    function setzeLaufend(an, text) {
      laeuft = an;
      knoepfe();
      status.textContent = text || "";
      ergebnisBox.setAttribute("aria-busy", an ? "true" : "false");
    }

    function loescheErgebnisse() {
      ergebnisse.forEach(freigeben);
      ergebnisse = [];
      ergebnisBox.replaceChildren();
      ergebnisBox.hidden = true;
    }

    async function sprechen() {
      if (laeuft || !gewaehlt || !feld.value.trim()) return;
      melde("");
      const text = feld.value;
      loescheErgebnisse();
      const erstesMal = !letzte;
      setzeLaufend(true, erstesMal ? "Der Jetson rechnet. Beim ersten Mal lädt er zuerst die Stimme in den Speicher." : "Der Jetson rechnet.");
      zeigeLaufend();
      try {
        const d = await anfrage(gewaehlt, text);
        if (weg) return;
        addiere(d, true);
        letzte = text + "|" + gewaehlt + "|" + tempo;
        setzeLaufend(false, "Fertig. Das Ergebnis steht unten.");
        zeigeLive();
      } catch (e) {
        if (weg) return;
        setzeLaufend(false, "Keine Sprachausgabe.");
        melde(e.message);
        zeigeLive();
      }
    }

    async function vergleichen() {
      if (laeuft || !gewaehlt || !feld.value.trim()) return;
      const a = andere();
      if (!a) return;
      melde("");
      const text = feld.value;
      const schluessel = text + "|" + gewaehlt + "|" + tempo;
      setzeLaufend(true, "Der Jetson rechnet mit zwei Stimmen nacheinander.");
      zeigeLaufend();
      try {
        if (!(letzte === schluessel && ergebnisse.length >= 1)) {
          loescheErgebnisse();
          const d1 = await anfrage(gewaehlt, text);
          if (weg) return;
          addiere(d1, true);
          letzte = schluessel;
        } else if (ergebnisse.length > 1) {
          freigeben(ergebnisse.pop());
          ergebnisBox.lastChild.remove();
        }
        const d2 = await anfrage(a.id, text);
        if (weg) return;
        addiere(d2, false);
        setzeLaufend(false, "Fertig. Beide Stimmen stehen untereinander.");
      } catch (e) {
        if (weg) return;
        setzeLaufend(false, "Der Vergleich hat nicht geklappt.");
        melde(e.message);
      }
      zeigeLive();
    }

    /* ------------------------------------------------------------ Ergebniskarte mit Wellenform */
    function addiere(d, erste) {
      const bytes = base64Bytes(d.wav_b64 || "");
      const wav = leseWav(bytes);
      const url = URL.createObjectURL(new Blob([bytes], { type: "audio/wav" }));
      const name = nameVon(d.stimme);
      const audio = h("audio", { class: "tts-player", controls: true, preload: "auto", src: url, "aria-label": "Sprachausgabe mit " + name });
      const canvas = h("canvas", { class: "tts-welle", "aria-hidden": "true" });
      const e = { daten: d, url, audio, canvas, samples: wav.samples, rate: wav.rate, name, raf: 0 };
      const zeiten = d.zeiten || {};
      const kopf = h("div", { class: "tts-kartenkopf" },
        h("b", { class: "tts-name" }, name),
        h("span", { class: "chip" }, sek(d.audio_s || 0) + " Sprache"),
        h("span", { class: "chip" }, "gerechnet in " + zeit((zeiten.phonemisierung_ms || 0) + (zeiten.synthese_ms || 0))));
      const karte = h("section", { class: "tts-karte", "aria-label": "Ergebnis mit " + name }, kopf, canvas, audio);
      e.karte = karte;
      canvas.addEventListener("click", (ev) => {
        const dauer = audio.duration;
        if (!isFinite(dauer) || dauer <= 0) return;
        const r = canvas.getBoundingClientRect();
        audio.currentTime = Math.min(dauer, Math.max(0, ((ev.clientX - r.left) / r.width) * dauer));
        audio.play().catch(() => {});
      });
      const neuZeichnen = () => zeichne(e);
      audio.addEventListener("play", () => {
        ergebnisse.forEach((x) => { if (x !== e && !x.audio.paused) x.audio.pause(); });
        const lauf = () => { zeichne(e); e.raf = audio.paused || audio.ended ? 0 : requestAnimationFrame(lauf); };
        cancelAnimationFrame(e.raf); e.raf = requestAnimationFrame(lauf);
      });
      ["pause", "ended", "seeked", "timeupdate", "loadedmetadata"].forEach((n) => audio.addEventListener(n, neuZeichnen));
      if (window.ResizeObserver) { const ro = new ResizeObserver(neuZeichnen); ro.observe(canvas); e.ro = ro; }
      ergebnisse.push(e);
      ergebnisBox.append(karte);
      ergebnisBox.hidden = false;
      zeichne(e);
      if (erste) audio.play().catch(() => { /* Browser verlangt eine Geste: dann startet der Player per Knopf */ });
    }
    function farben() {
      const cs = getComputedStyle(root);
      return { gespielt: cs.getPropertyValue("--akzent").trim() || "#0071e3", offen: cs.getPropertyValue("--leise").trim() || "#8e8e93" };
    }
    function zeichne(e) {
      const dauer = e.audio.duration;
      const anteil = isFinite(dauer) && dauer > 0 ? Math.min(1, e.audio.currentTime / dauer) : 0;
      zeichneWelle(e.canvas, e.samples, anteil, farben());
    }
    function freigeben(e) {
      if (!e) return;
      cancelAnimationFrame(e.raf);
      if (e.ro) e.ro.disconnect();
      try { e.audio.pause(); } catch (x) { /* egal */ }
      e.audio.removeAttribute("src");
      try { e.audio.load(); } catch (x) { /* egal */ }
      URL.revokeObjectURL(e.url);
    }

    /* ------------------------------------------------------------ Live-Erklaerung */
    function zeigeLaufend() {
      pipen.replaceChildren(h("div", { class: "pipe", role: "img", "aria-label": "Noch keine Messung" }, h("div", { class: "s6", style: "flex:1" }, "Der Jetson rechnet …")));
      lautBox.hidden = true;
      erkl.replaceChildren(h("p", null, "Der Jetson wandelt den Text zuerst in Lautschrift um und erzeugt daraus den Klang."));
    }

    function pipeZeile(e) {
      const d = e.daten, z = d.zeiten || {};
      const phon = Math.max(z.phonemisierung_ms || 0, 0.001), synth = Math.max(z.synthese_ms || 0, 0.001);
      const rand = (phon + synth) * 0.12;                        // Text und Ausgabe sind Marken ohne eigene Rechenzeit
      const teile = [rand, phon, synth, rand];
      const summe = teile.reduce((a, b) => a + b, 0);
      const beschr = [d.zeichen + " Zeichen", zeit(z.phonemisierung_ms || 0), zeit(z.synthese_ms || 0), sek(d.audio_s || 0)];
      const innen = ["Text", "", zeit(z.synthese_ms || 0), "Ausgabe"];
      const pipe = h("div", { class: "pipe", role: "img", "aria-label": e.name + ": " + NAMEN.map((n, i) => n + " " + beschr[i]).join(", ") });
      teile.forEach((ms, i) => {
        const el = h("div", { class: FARBEN[i], title: NAMEN[i] + ": " + beschr[i] }, ms / summe > 0.1 ? innen[i] : "");
        el.style.flexGrow = String(ms); el.style.flexBasis = "0";
        pipe.append(el);
      });
      const leg = h("div", { class: "pipeleg" }, NAMEN.map((n, i) =>
        h("span", null, h("i", { style: "background:" + FARBWERT[FARBEN[i]] }), n + ": " + beschr[i])));
      return h("div", { class: "tts-pipezeile" }, ergebnisse.length > 1 ? h("div", { class: "tts-pipename" }, e.name) : null, pipe, leg);
    }

    function faktorVon(d) { return d.rechen_s > 0 ? d.audio_s / d.rechen_s : 0; }
    function satzTempo(e) {
      const d = e.daten, f = faktorVon(d);
      const t = [];
      if (ergebnisse.length > 1) t.push(h("b", null, e.name + ": "));
      t.push("Der Jetson hat für ", h("b", null, sek(d.audio_s)), " Sprache ", h("b", null, sek(d.rechen_s)), " gerechnet. ");
      if (f >= 1) t.push("Das ist " + dez(f, 1) + "-mal schneller als Echtzeit.");
      else t.push("Das ist langsamer als Echtzeit (Faktor " + dez(f, 1) + "). Für ein Gespräch wäre das zu langsam.");
      if (d.lade_s) t.push(" Dazu kam einmalig das Laden der Stimme in den Speicher: " + zeit(d.lade_s * 1000) + ". Danach geht es schneller.");
      return h("p", null, t);
    }

    function zeigeLive() {
      if (!ergebnisse.length) { zeigeLeer(); return; }
      pipen.replaceChildren(...ergebnisse.map(pipeZeile));
      const d = ergebnisse[0].daten;
      // Lautschrift: eine Zeile je Satz
      const saetze = String(d.phoneme || "").split(" | ").filter(Boolean);
      lautBox.replaceChildren(...[
        h("div", { class: "tts-laut-kopf" }, h("b", null, "So hört der Computer deinen Text"),
          h("span", { class: "tts-laut-sub" }, "Lautschrift (IPA), " + (d.saetze || saetze.length) + (saetze.length === 1 ? " Satz" : " Sätze"))),
        h("ol", { class: "tts-laut-liste" }, saetze.map((s) => h("li", { class: "tts-laut-satz mono", lang: "und" }, s))),
        d.normalisiert ? h("p", { class: "tts-normal" }, h("span", { class: "tts-label" }, "Aufbereiteter Text"), " ", d.normalisiert) : null,
        h("p", { class: "tts-laut-hinweis" }, "Die Stimme sieht keine Buchstaben mehr, nur diese Laute. Zahlen, Abkürzungen und Satzzeichen sind schon aufgelöst.")].filter(Boolean));
      lautBox.hidden = false;
      const absaetze = ergebnisse.map(satzTempo);
      if (ergebnisse.length > 1) {
        const [a, b] = ergebnisse;
        const fa = a.daten.rechen_s, fb = b.daten.rechen_s;
        const schnell = fa <= fb ? a : b, langsam = fa <= fb ? b : a;
        const verh = Math.max(schnell.daten.rechen_s, 0.001);
        const q = langsam.daten.rechen_s / verh;
        absaetze.push(h("p", null, q >= 1.1
          ? h("span", null, h("b", null, schnell.name), " war " + dez(q, 1) + "-mal schneller als ", h("b", null, langsam.name), ". Kleinere Stimmenmodelle rechnen schneller, größere klingen meist voller.")
          : "Beide Stimmen haben ungefähr gleich lang gerechnet."));
      }
      erkl.replaceChildren(...absaetze);
    }
    function zeigeLeer() {
      pipen.replaceChildren();
      lautBox.hidden = true;
      erkl.replaceChildren(h("p", null, "Sprich einen Text. Dann siehst du hier, wie aus Buchstaben erst Lautschrift und dann Klang wird."));
    }

    // Farben der Wellenform folgen dem hellen oder dunklen Modus
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const neu = () => ergebnisse.forEach(zeichne);
      mq.addEventListener("change", neu);
      aufraeumer.push(() => mq.removeEventListener("change", neu));
    }

    return {
      destroy() {
        weg = true;
        ladeAbbruch.abort();
        if (abbruch) abbruch.abort();
        ergebnisse.forEach(freigeben);
        ergebnisse = [];
        aufraeumer.forEach((f) => f());
      },
    };
  };
})();
