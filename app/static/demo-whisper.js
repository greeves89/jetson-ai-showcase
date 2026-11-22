/* demo-whisper: Labor "Sprache zu Text".
   Ablauf: Mikrofon (MediaRecorder) -> POST /api/whisper (rohe Bytes, Content-Type = Mime der Aufnahme)
   -> Text, Sprache und Segmente. Die Live-Erklaerung zeigt, wo die Zeit bleibt:
   Aufnahme, Uebertragung, Rechnen auf dem Jetson.
   Vertrag siehe app.js: KL.demos.whisper(root, seite) gibt { destroy() } zurueck.
   SICHERHEIT: Erkannter Text kommt aus dem Netz und wird nur per h(...)/textContent eingesetzt. */
(function () {
  "use strict";
  const KL = window.KL;
  const { h, icon, zeit } = KL;

  const MAX_MS = 59500;            // der Server nimmt hoechstens 60 Sekunden an
  const MAX_ANZEIGE = 60;
  const MAX_BYTES = 2000000;
  const MIMES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  const BEISPIELE = ["Der Jetson schreibt jetzt mit.", "Heute scheint die Sonne über Hannover."];
  const SPRACHEN = { de: "Deutsch", en: "Englisch", fr: "Französisch", es: "Spanisch", it: "Italienisch", nl: "Niederländisch", pl: "Polnisch", tr: "Türkisch" };

  const FARBEN = ["s1", "s2", "s3", "s4"];
  const NAMEN = ["Aufnahme", "Übertragung", "Jetson rechnet", "Text"];
  const FARBWERT = { s1: "#5e5ce6", s2: "#64748b", s3: "#0a84ff", s4: "#30a14e" };  // wie .pipe .s1 bis .s4 in style.css

  const dez = (zahl, stellen = 1) => zahl.toFixed(stellen).replace(".", ",");
  const sek = (s) => dez(s, 1) + " Sekunden";
  const kb = (b) => (b < 1024 * 100 ? dez(b / 1024, 1) : Math.round(b / 1024)) + " KB";
  const uhr = (ms) => { const s = Math.floor(ms / 1000); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
  const stempel = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

  function svg(pfad, klasse) {
    const w = document.createElement("span");
    w.innerHTML = '<svg class="ic ' + (klasse || "") + '" viewBox="0 0 24 24" aria-hidden="true">' + pfad + "</svg>";
    return w.firstChild;
  }
  const IC_STOPP = '<rect x="6" y="6" width="12" height="12" rx="2.5" fill="currentColor" stroke="none"/>';
  const IC_DATEI = '<path d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>';

  KL.demos.whisper = function (root, seite) {
    root.classList.add("wh");
    let zustand = "bereit";        // bereit | aufnahme | senden | fertig
    let stream = null, rec = null, teile = [], ctx = null, analyser = null, quelle = null;
    let timer = null, stoppTimer = null, rafId = 0, t0 = 0, aufnahmeMs = 0;
    let sprache = "auto";
    let audioUrl = null;
    let abbruch = null;
    let erstesMal = true;           // bis zur ersten Antwort: Hinweis, dass das Modell erst geladen wird
    let letzter = null;             // letzte Messung fuer die Live-Erklaerung
    let pegelListe = [];
    let stille = 0;
    let weg = false;
    let nachErgebnis = null;        // Beispielmodus: Vergleich mit dem Originaltext

    /* ------------------------------------------------------------ Oberflaeche */
    const knopf = h("button", { class: "wh-rec", type: "button", "aria-label": "Aufnahme starten", onclick: umschalten });
    const zeitAnz = h("div", { class: "wh-zeit mono", "aria-hidden": "true" }, "00:00");
    const pegel = h("canvas", { class: "wh-pegel", width: 480, height: 64, "aria-hidden": "true" });
    const status = h("p", { class: "wh-status", "aria-live": "polite" }, "Bereit. Drücke den Knopf und sprich.");
    const hinweis = h("div", { class: "wh-hinweis", role: "status", "aria-live": "polite", hidden: true });
    const dateiEin = h("input", { type: "file", accept: "audio/*", class: "wh-datei", tabindex: "-1", "aria-hidden": "true", onchange: dateiGewaehlt });
    const dateiKnopf = h("button", { class: "btn klein", type: "button", onclick: () => dateiEin.click() }, svg(IC_DATEI), "Audiodatei wählen");

    const sprachChips = [["auto", "Sprache erkennen"], ["de", "Deutsch"]].map(([wert, text]) =>
      h("button", { class: "chip wh-sprache", type: "button", "aria-pressed": wert === sprache ? "true" : "false", dataset: { wert }, onclick: () => setzeSprache(wert) }, text));

    const ergebnis = h("div", { class: "wh-ergebnis", hidden: true });
    const liveTitel = h("div", { class: "titel" }, icon("live"), "Live-Erklärung");
    const pipe = h("div", { class: "pipe", role: "img", "aria-label": "Zeitanteile von Aufnahme, Übertragung und Rechnen" });
    const leg = h("div", { class: "pipeleg" });
    const erkl = h("p", { class: "erklaerung", "aria-live": "polite" }, "Nach deiner ersten Aufnahme siehst du hier, wie lange Aufnahme, Übertragung und Rechnen gedauert haben.");
    const werte = h("div", { class: "messwerte" });
    const live = h("div", { class: "live wh-live" }, liveTitel, pipe, leg, erkl, werte);

    root.append(
      h("div", { class: "wh-buehne" },
        h("div", { class: "wh-reihe" }, knopf, h("div", { class: "wh-anzeige" }, zeitAnz, pegel)),
        status, hinweis,
        KL.gruppe("Aufnahme", [KL.zeile("Sprache", sprachChips), KL.zeile("Zum Vorlesen", BEISPIELE.map((t) => h("span", { class: "chip wh-satz" }, "„" + t + "“")), null, true)], { aktion: [dateiKnopf, dateiEin], klasse: "wh-optionen" })),
      ergebnis, live);
    zeichneLeg();
    knopfAnzeigen();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      knopf.disabled = true;
      melde(window.isSecureContext === false
        ? "Dein Browser gibt das Mikrofon nur über eine sichere Verbindung frei. Öffne das Labor über die https-Adresse. Du kannst stattdessen eine Audiodatei wählen."
        : "Dieser Browser kann nicht aufnehmen. Probiere Chrome, Edge, Firefox oder Safari, oder wähle eine Audiodatei.", "warn");
      status.textContent = "Aufnahme nicht möglich.";
    }

    /* ------------------------------------------------------------ Hilfen */
    function melde(text, art) {
      hinweis.hidden = !text;
      hinweis.className = "wh-hinweis" + (art ? " " + art : "");
      hinweis.textContent = text || "";
    }
    function setzeSprache(w) {
      sprache = w;
      sprachChips.forEach((c) => c.setAttribute("aria-pressed", c.dataset.wert === w ? "true" : "false"));
    }
    function knopfAnzeigen() {
      const an = zustand === "aufnahme";
      knopf.classList.toggle("an", an);
      knopf.replaceChildren(an ? svg(IC_STOPP, "wh-ic") : icon("whisper"));
      knopf.querySelector("svg").classList.add("wh-ic");
      knopf.setAttribute("aria-label", an ? "Aufnahme beenden" : "Aufnahme starten");
      knopf.append(h("span", { class: "wh-knopftext" }, an ? "Stopp" : "Aufnahme starten"));
      knopf.disabled = zustand === "senden" || (!navigator.mediaDevices || !window.MediaRecorder);
      dateiKnopf.disabled = zustand !== "bereit" && zustand !== "fertig";
    }
    function waehleMime() {
      return MIMES.find((m) => { try { return MediaRecorder.isTypeSupported(m); } catch (e) { return false; } }) || "";
    }

    /* ------------------------------------------------------------ Aufnahme */
    function umschalten() {
      if (zustand === "aufnahme") stoppen();
      else if (zustand === "bereit" || zustand === "fertig") starten();
    }

    async function starten() {
      melde("");
      try { await KL.einwilligung.verlangen("mikro", { sendet: true }); }       // erst erklären, dann den Browser fragen
      catch (e) { melde(e.message, "warn"); status.textContent = "Keine Aufnahme gestartet."; return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      } catch (e) {
        const n = e && e.name;
        if (n === "NotAllowedError" || n === "SecurityError") melde("Der Browser hat den Zugriff auf das Mikrofon nicht erlaubt. Erlaube ihn in der Adressleiste (Symbol links neben der Adresse) und versuche es noch einmal. Du kannst auch eine Audiodatei wählen.", "warn");
        else if (n === "NotFoundError" || n === "OverconstrainedError") melde("Es wurde kein Mikrofon gefunden. Schließe eines an oder wähle eine Audiodatei.", "warn");
        else melde("Das Mikrofon lässt sich gerade nicht öffnen. Vielleicht nutzt ein anderes Programm es. Du kannst auch eine Audiodatei wählen.", "warn");
        status.textContent = "Keine Aufnahme gestartet.";
        return;
      }
      if (weg) { stoppeStream(); return; }
      const mime = waehleMime();
      try { rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined); }
      catch (e) { melde("Dieser Browser kann das Aufnahmeformat nicht erzeugen. Wähle stattdessen eine Audiodatei.", "warn"); stoppeStream(); return; }
      teile = [];
      rec.ondataavailable = (ev) => { if (ev.data && ev.data.size) teile.push(ev.data); };
      rec.onstop = aufnahmeFertig;
      rec.onerror = () => { melde("Die Aufnahme wurde unterbrochen. Versuche es noch einmal.", "warn"); aufraeumenAufnahme(); zustand = "bereit"; knopfAnzeigen(); };
      pegelStart();
      t0 = performance.now();
      rec.start(250);
      zustand = "aufnahme";
      ergebnis.hidden = true;
      freigeben();
      knopfAnzeigen();
      status.textContent = "Aufnahme läuft. Sprich jetzt. Höchstens " + MAX_ANZEIGE + " Sekunden.";
      zeitAnz.textContent = "00:00";
      timer = setInterval(tick, 100);
      stoppTimer = setTimeout(stoppen, MAX_MS);
      stille = 0;
      zeigePipe("aufnahme");
    }

    function tick() {
      const ms = performance.now() - t0;
      zeitAnz.textContent = uhr(ms);
      const rest = Math.ceil((MAX_MS - ms) / 1000);
      if (rest <= 10 && rest >= 0) status.textContent = "Noch " + rest + " Sekunden, dann stoppt die Aufnahme.";
      zeigePipe("aufnahme", ms);
    }

    function stoppen() {
      if (!rec || rec.state === "inactive") return;
      aufnahmeMs = performance.now() - t0;
      try { rec.stop(); } catch (e) { /* schon beendet */ }
      clearInterval(timer); clearTimeout(stoppTimer);
      stoppeStream();
      pegelStopp();
    }

    function stoppeStream() {
      if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
    }
    function aufraeumenAufnahme() {
      clearInterval(timer); clearTimeout(stoppTimer);
      stoppeStream(); pegelStopp();
    }

    async function aufnahmeFertig() {
      const typ = (rec && rec.mimeType) || (teile[0] && teile[0].type) || "audio/webm";
      const blob = new Blob(teile, { type: typ });
      teile = [];
      if (weg) return;
      if (blob.size < 800) {
        zustand = "bereit"; knopfAnzeigen();
        melde("Es ist fast nichts angekommen. Sprich etwas länger und versuche es noch einmal.", "warn");
        status.textContent = "Keine Aufnahme.";
        return;
      }
      senden(blob, aufnahmeMs);
    }

    /* ------------------------------------------------------------ Datei als Ausweg */
    function dateiGewaehlt() {
      const f = dateiEin.files && dateiEin.files[0];
      dateiEin.value = "";
      if (!f) return;
      if (f.size > MAX_BYTES) { melde("Die Datei ist zu groß. Erlaubt sind höchstens 2 MB, das sind je nach Format etwa eine bis vier Minuten, und der Jetson nimmt höchstens 60 Sekunden an.", "warn"); return; }
      melde("");
      senden(f, null);
    }

    /* ------------------------------------------------------------ Upload und Ergebnis */
    async function senden(blob, aufMs) {
      zustand = "senden"; knopfAnzeigen();
      ergebnis.hidden = true;
      freigeben();
      audioUrl = URL.createObjectURL(blob);
      const typ = (blob.type || "audio/webm").split(";")[0];
      status.textContent = erstesMal ? "Wird übertragen. Beim ersten Mal lädt der Jetson erst das Modell in den Speicher, das dauert etwas länger." : "Der Jetson rechnet.";
      if (erstesMal) melde("Die erste Erkennung dauert länger: Der Jetson lädt zuerst das Modell in den Speicher.", "info");
      abbruch = new AbortController();
      const start = performance.now();
      zeigePipe("senden", null, aufMs, performance.now() - start);
      const takt = setInterval(() => zeigePipe("senden", null, aufMs, performance.now() - start), 200);
      let antwort, daten;
      try {
        antwort = await fetch("/api/whisper?sprache=" + encodeURIComponent(sprache), { method: "POST", headers: { "Content-Type": typ }, body: blob, signal: abbruch.signal });
        daten = await antwort.json().catch(() => ({}));
      } catch (e) {
        clearInterval(takt);
        if (e && e.name === "AbortError") return;
        zustand = "bereit"; knopfAnzeigen();
        melde("Der Jetson ist gerade nicht erreichbar. Prüfe die Verbindung und versuche es noch einmal.", "warn");
        status.textContent = "Fehler bei der Übertragung.";
        return;
      }
      clearInterval(takt);
      const gesamt = performance.now() - start;
      if (weg) return;
      if (!antwort.ok) {
        zustand = "bereit"; knopfAnzeigen();
        melde(typeof daten.fehler === "string" && daten.fehler ? daten.fehler : "Die Erkennung hat nicht geklappt (Fehler " + antwort.status + "). Versuche es noch einmal.", "warn");
        status.textContent = "Keine Erkennung.";
        return;
      }
      erstesMal = false;
      melde("");
      zustand = "fertig"; knopfAnzeigen();
      const rechnenMs = (daten.rechen_s || 0) * 1000;
      const ladeMs = (daten.lade_s || 0) * 1000;
      letzter = {
        aufnahmeMs: aufMs != null ? aufMs : (daten.audio_s || 0) * 1000,
        ausDatei: aufMs == null,
        bytes: daten.bytes || blob.size,
        uebertragungMs: Math.max(0, gesamt - rechnenMs - ladeMs),
        ladeMs, rechnenMs,
        audioS: daten.audio_s || 0,
        modell: daten.modell || "Whisper",
        text: daten.text || "",
      };
      status.textContent = "Fertig. Das Ergebnis steht unten.";
      zeigeErgebnis(daten);
      zeigePipe("fertig");
      if (nachErgebnis) nachErgebnis(daten.text || "", blob);
    }

    function zeigeErgebnis(d) {
      ergebnis.replaceChildren();
      const text = (d.text || "").trim();
      const wk = Math.round((d.sprache_wahrscheinlichkeit || 0) * 100);
      const name = SPRACHEN[d.sprache] || (d.sprache ? String(d.sprache).toUpperCase() : "unbekannt");
      ergebnis.append(
        h("div", { class: "wh-kopf" }, h("span", { class: "wh-label" }, "Erkannter Text"),
          h("span", { class: "chip" }, "Sprache: " + name + (wk ? " (" + wk + " %)" : ""))),
        text ? h("p", { class: "wh-text" }, text)
             : h("p", { class: "wh-text leer" }, "Ich habe keine Sprache erkannt. Sprich näher am Mikrofon, etwas lauter oder etwas länger, und versuche es noch einmal."));
      const player = h("audio", { class: "wh-player", controls: true, preload: "metadata", src: audioUrl, "aria-label": "Deine Aufnahme" });
      // MediaRecorder-Dateien melden anfangs keine Dauer; der Sprung ans Ende erzwingt sie, damit Spulen funktioniert.
      player.addEventListener("loadedmetadata", () => {
        if (player.duration === Infinity) {
          const zurueck = () => { player.removeEventListener("timeupdate", zurueck); player.currentTime = 0; };
          player.addEventListener("timeupdate", zurueck);
          player.currentTime = 1e101;
        }
      });
      const segs = d.segmente || [];
      if (segs.length) {
        ergebnis.append(h("div", { class: "wh-label wh-segkopf" }, "Segmente mit Zeitstempel. Klicke eines an, um die Stelle in deiner Aufnahme zu hören."),
          h("ul", { class: "wh-segmente" }, segs.map((s) =>
            h("li", null, h("button", { class: "wh-seg", type: "button", onclick: () => spiele(player, s.start) },
              h("span", { class: "wh-st mono" }, stempel(s.start) + " bis " + stempel(s.ende)),
              h("span", { class: "wh-sx" }, s.text))))));
      }
      ergebnis.append(player);
      ergebnis.hidden = false;
    }
    function spiele(player, start) {
      try { player.currentTime = Math.max(0, start); player.play().catch(() => {}); } catch (e) { /* ignorieren */ }
    }

    /* ------------------------------------------------------------ Live-Erklaerung */
    function zeichneLeg() {
      leg.replaceChildren(...NAMEN.map((n, i) => h("span", null, h("i", { style: "background:" + FARBWERT[FARBEN[i]] }), n)));
    }

    function zeigePipe(phase, laufMs, aufMs, sendMs) {
      let teileMs = [0, 0, 0, 0], beschr = [];
      if (phase === "aufnahme") {
        teileMs = [Math.max(laufMs || 0, 1), 0, 0, 0];
        beschr = [uhr(laufMs || 0)];
      } else if (phase === "senden") {
        teileMs = [aufMs || 1, sendMs || 1, 0, 0];
        beschr = [aufMs != null ? zeit(aufMs) : "Datei", "…"];
      } else if (phase === "fertig" && letzter) {
        teileMs = [letzter.aufnahmeMs, letzter.uebertragungMs, letzter.ladeMs + letzter.rechnenMs, 0];
        beschr = [zeit(letzter.aufnahmeMs), zeit(letzter.uebertragungMs), zeit(letzter.ladeMs + letzter.rechnenMs), "fertig"];
        teileMs[3] = Math.max(1, (teileMs[0] + teileMs[1] + teileMs[2]) * 0.08);
      }
      pipe.replaceChildren();
      teileMs.forEach((ms, i) => {
        if (!ms) return;
        const summe = teileMs.reduce((a, b) => a + b, 0);
        const el = h("div", { class: FARBEN[i], title: NAMEN[i] + (beschr[i] ? ": " + beschr[i] : "") }, ms / summe > 0.09 ? (beschr[i] || "") : "");
        el.style.flexGrow = String(Math.max(ms, 1));
        el.style.flexBasis = "0";
        pipe.append(el);
      });
      if (!pipe.childNodes.length) pipe.append(h("div", { class: "s6", style: "flex:1" }, "noch keine Messung"));
      if (phase === "aufnahme") erkl.textContent = "Das Mikrofon nimmt auf. Dein Browser packt den Ton laufend in kleine Stücke. Erst nach dem Stopp geht alles zusammen an den Jetson.";
      else if (phase === "senden") erkl.textContent = erstesMal ? "Die Aufnahme ist unterwegs zum Jetson. Beim ersten Mal lädt er zuerst das Modell in den Speicher, danach rechnet er." : "Die Aufnahme ist unterwegs zum Jetson, dort wird sie in Text umgerechnet.";
      else if (phase === "fertig" && letzter) erklaerungFertig();
      if (phase === "fertig") werteFertig();
    }

    function erklaerungFertig() {
      const L = letzter;
      const faktor = L.rechnenMs > 0 ? (L.audioS * 1000) / L.rechnenMs : 0;
      const teile = [];
      teile.push(L.ausDatei ? "Die Datei ist " : "Du hast ", h("b", null, sek(L.audioS)), L.ausDatei ? " lang" : " gesprochen", " (" + kb(L.bytes) + "). ");
      teile.push("Der Jetson hat dafür ", h("b", null, sek(L.rechnenMs / 1000)), " gerechnet. ");
      if (faktor >= 1) teile.push("Das ist schneller als Echtzeit (Faktor " + dez(faktor, 1) + "). Für Live-Untertitel reicht das Tempo.");
      else teile.push("Das ist langsamer als Echtzeit (Faktor " + dez(faktor, 1) + "). Für Live-Untertitel wäre das zu langsam.");
      if (L.ladeMs > 0) teile.push(" Dieses Mal kam dazu das Laden des Modells in den Speicher: " + zeit(L.ladeMs) + ". Danach geht es schneller.");
      erkl.replaceChildren(...teile);
    }

    function werteFertig() {
      const L = letzter;
      const faktor = L.rechnenMs > 0 ? (L.audioS * 1000) / L.rechnenMs : 0;
      const m = (k, v) => h("div", { class: "messwert" }, h("b", null, v), k);
      werte.replaceChildren(
        m("Modell", L.modell),
        m(L.ausDatei ? "Dauer der Datei" : "Aufnahme", zeit(L.aufnahmeMs)),
        m("Übertragung", zeit(L.uebertragungMs) + " (" + kb(L.bytes) + ")"),
        m("Rechenzeit", zeit(L.rechnenMs)),
        m("Tempo", dez(faktor, 1) + "× Echtzeit"));
      const legende = [
        "Aufnahme: " + zeit(L.aufnahmeMs),
        "Übertragung mit Dekodieren: " + zeit(L.uebertragungMs),
        "Jetson rechnet: " + zeit(L.ladeMs + L.rechnenMs) + (L.ladeMs > 0 ? " (davon Modell laden " + zeit(L.ladeMs) + ")" : ""),
      ];
      leg.replaceChildren(...legende.map((t, i) => h("span", null, h("i", { class: FARBEN[i], style: "background:" + FARBWERT[FARBEN[i]] }), t)));
      pipe.setAttribute("aria-label", legende.join(". "));
    }

    /* ------------------------------------------------------------ Pegel */
    function pegelStart() {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        ctx = new AC();
        quelle = ctx.createMediaStreamSource(stream);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        quelle.connect(analyser);
      } catch (e) { analyser = null; return; }
      pegelListe = [];
      let letzteZeit = 0;
      const daten = new Uint8Array(analyser.fftSize);
      const c = pegel.getContext("2d");
      const schleife = (jetzt) => {
        rafId = requestAnimationFrame(schleife);
        if (jetzt - letzteZeit < 50) return;
        letzteZeit = jetzt;
        analyser.getByteTimeDomainData(daten);
        let s = 0;
        for (let i = 0; i < daten.length; i++) { const v = (daten[i] - 128) / 128; s += v * v; }
        const rms = Math.sqrt(s / daten.length);
        const p = Math.min(1, Math.pow(rms * 4, 0.6));
        pegelListe.push(p);
        const n = 60;
        if (pegelListe.length > n) pegelListe.shift();
        if (p < 0.02) stille += 1; else stille = 0;
        if (stille === 70 && zustand === "aufnahme") melde("Ich höre noch nichts. Prüfe, ob das richtige Mikrofon eingestellt und nicht stummgeschaltet ist.", "warn");
        if (stille === 0 && !hinweis.hidden && zustand === "aufnahme") melde("");
        zeichne(c, n);
      };
      rafId = requestAnimationFrame(schleife);
    }
    function zeichne(c, n) {
      const W = pegel.width, H = pegel.height;
      const cs = getComputedStyle(root);
      c.clearRect(0, 0, W, H);
      const bw = W / n;
      const farbe = cs.getPropertyValue("--akzent").trim() || "#0071e3";
      const grund = cs.getPropertyValue("--flaeche3").trim() || "#ddd";
      for (let i = 0; i < n; i++) {
        const idx = pegelListe.length - n + i;
        const p = idx >= 0 ? pegelListe[idx] : 0;
        const hh = Math.max(3, p * (H - 4));
        c.fillStyle = idx >= 0 ? farbe : grund;
        const x = i * bw + bw * 0.2, w = bw * 0.6;
        c.beginPath();
        if (c.roundRect) c.roundRect(x, (H - hh) / 2, w, hh, w / 2); else c.rect(x, (H - hh) / 2, w, hh);
        c.fill();
      }
    }
    function pegelStopp() {
      cancelAnimationFrame(rafId); rafId = 0;
      try { if (quelle) quelle.disconnect(); } catch (e) { /* egal */ }
      if (ctx && ctx.state !== "closed") ctx.close().catch(() => {});
      ctx = null; analyser = null; quelle = null;
      pegelListe = [];
      const c = pegel.getContext("2d");
      zeichne(c, 60);
    }

    function freigeben() {
      if (audioUrl) { const u = audioUrl; audioUrl = null; setTimeout(() => URL.revokeObjectURL(u), 0); }
    }

    zeichne(pegel.getContext("2d"), 60);
    zeigePipe("leer");

    /* ------------------------------------------------------------ Beispielmodus (?beispiel=buero-protokoll) */
    const woerter = (t) => String(t).toLowerCase().replace(/[^a-zäöüß0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    KL.beispiel.start(root, seite, "whisper", { get weg() { return weg; } }, (e, kopf) => {
      const d = e.daten || {};
      const player = h("audio", { class: "wh-player", controls: true, preload: "metadata", src: KL.beispiel.url(d.audio), "aria-label": "Beispielaudio: " + e.titel });
      const los = h("button", { type: "button", class: "btn primary" }, icon("whisper"), "Beispielaudio erkennen");
      const vergleich = h("div", { class: "wh-bsp-vergleich", hidden: true });
      const panel = h("section", { class: "d-beispiel wh-bsp" },
        h("div", { class: "wh-label" }, "Beispielaudio, " + Math.round(d.dauer_sekunden || 0) + " Sekunden"),
        player, h("div", { class: "wh-reihe" }, los), vergleich);
      kopf.el.after(panel);
      nachErgebnis = (text) => {
        const soll = woerter(d.originaltext || ""), ist = new Set(woerter(text));
        const treffer = soll.filter((w) => ist.has(w)).length;
        const quote = soll.length ? Math.round(100 * treffer / soll.length) : 0;
        vergleich.replaceChildren(
          h("p", { class: "d-bsp-urteil d-bsp-ok", role: "status" }, "Von " + soll.length + " Wörtern des Originaltexts stehen " + treffer + " (" + quote + " Prozent) im erkannten Text. Zahlen schreibt Whisper oft als Ziffern, daher fehlen einzelne Wörter."),
          h("details", { class: "d-bsp-mehr" }, h("summary", null, "Originaltext zum Vergleich"), h("p", null, d.originaltext || "")));
        vergleich.hidden = false;
      };
      los.addEventListener("click", async () => {
        if (zustand === "senden" || zustand === "aufnahme") return;
        los.disabled = true; vergleich.hidden = true;
        try {
          const r = await fetch(KL.beispiel.url(d.audio));
          if (!r.ok) throw new Error("Das Beispielaudio ließ sich nicht laden.");
          const blob = await r.blob();
          if (weg) return;
          setzeSprache("de");
          await senden(new Blob([blob], { type: "audio/mpeg" }), null);
        } catch (err) { melde(err && err.message ? err.message : "Das Beispielaudio ließ sich nicht laden.", "warn"); }
        finally { los.disabled = false; }
      });
      kopf.text("Bereit: Das Beispielaudio liegt vor. Der Klick auf Beispielaudio erkennen startet die Erkennung. Du kannst es vorher anhören.");
    });

    return {
      destroy() {
        weg = true;
        if (abbruch) abbruch.abort();
        if (rec && rec.state !== "inactive") { rec.onstop = null; try { rec.stop(); } catch (e) { /* egal */ } }
        aufraeumenAufnahme();
        const a = root.querySelector("audio"); if (a) a.pause();
        freigeben();
        if (audioUrl) URL.revokeObjectURL(audioUrl);
      },
    };
  };
})();
