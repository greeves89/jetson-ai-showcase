/* demo-ocr: Labor "Text auf Papier lesen".
   Ablauf: Kamerabild (bis 960 mal 720) -> /ws/vision?modus=ocr -> Jetson findet das Blatt, zieht es gerade, findet Zeilen,
   liest Zeichen, wertet aus -> Antwort mit entzerrtem Bild und d.ocr (Text, Zeilen mit Wortsicherheit, Karten, Zustand).
   Die Kamera, die Messwerte und die Live-Erklaerung kommen von webcam() in demos.js (KL.kameraModi.ocr); hier steht nur,
   was dieses Labor zusaetzlich zeigt: gelesener Text mit Markierung unsicherer Woerter, Karten, Knoepfe (Kopieren, Vorlesen,
   Neu lesen, Standbild). Alle Werte vom Server gelangen nur per textContent ins DOM. Es wird nichts gespeichert:
   der Text lebt im Arbeitsspeicher der Seite und verschwindet mit ihr. Vorlesen schickt den Text an /api/tts (lab_tts.py).
   Vertrag siehe app.js: KL.demos["webcam-ocr"](root, seite). */
(function () {
  "use strict";
  const KL = window.KL;
  const h = KL.h;

  const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const KARTEN = {
    betrag: { symbol: "banknote", name: "Betrag" },
    prozent: { symbol: "percent", name: "Prozent" },
    datum: { symbol: "calendar", name: "Datum" },
    uhrzeit: { symbol: "clock", name: "Uhrzeit" },
    email: { symbol: "mail", name: "E-Mail" },
    telefon: { symbol: "phone", name: "Telefon" },
    iban: { symbol: "landmark", name: "IBAN" },
    web: { symbol: "globe", name: "Webadresse" },
  };
  const STIMME = "thorsten";
  const MAX_STUECK = 480;          // lab_tts nimmt hoechstens 500 Zeichen je Anfrage
  const MAX_VORLESEN = 1800;       // darueber hinaus liest das Labor nicht vor (Rechenzeit, 20 Anfragen je Minute)
  const dez = (x, n) => Number(x).toFixed(n).replace(".", ",");
  const proz = (x) => Math.round((x || 0) * 100) + " %";

  /* Schoene Form einer Karte: Datum ausgeschrieben, Betrag mit Komma, Uhrzeit mit "Uhr". Der gelesene Text steht immer dabei. */
  function kartenWert(k) {
    const w = String(k.wert || "");
    if (k.art === "datum" && /^\d{4}-\d{2}-\d{2}$/.test(w)) return Number(w.slice(8)) + ". " + MONATE[Number(w.slice(5, 7)) - 1] + " " + w.slice(0, 4);
    if (k.art === "betrag") { const z = Number(w); return isFinite(z) ? z.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Euro" : w; }
    if (k.art === "uhrzeit") return w + " Uhr";
    if (k.art === "prozent") return w.replace(".", ",") + " Prozent";
    return w;
  }

  function kopierenAlt(text) {
    return new Promise((ok, fehl) => {
      const t = h("textarea", { "aria-hidden": "true", tabindex: "-1", style: "position:fixed;left:-9999px;top:0" });
      t.value = text;
      document.body.append(t);
      t.select();
      let gut = false;
      try { gut = document.execCommand("copy"); } catch (e) { gut = false; }
      t.remove();
      gut ? ok() : fehl(new Error("kopieren nicht moeglich"));
    });
  }
  function kopieren(text) {
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) return navigator.clipboard.writeText(text).catch(() => kopierenAlt(text));
    return kopierenAlt(text);
  }

  /* Text in Stuecke teilen, die an einer Zeilen- oder Satzgrenze enden */
  function stuecke(text) {
    const aus = [];
    let rest = text.replace(/[ \t]+/g, " ").trim();
    while (rest.length > MAX_STUECK) {
      let schnitt = Math.max(rest.lastIndexOf("\n", MAX_STUECK), rest.lastIndexOf(". ", MAX_STUECK) + 1, rest.lastIndexOf(" ", MAX_STUECK));
      if (schnitt < MAX_STUECK / 3) schnitt = MAX_STUECK;
      aus.push(rest.slice(0, schnitt).trim());
      rest = rest.slice(schnitt).trim();
    }
    if (rest) aus.push(rest);
    return aus.filter((x) => x);
  }

  function base64Bytes(b64) {
    const bin = atob(b64);
    const b = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
    return b;
  }

  function ergebnisBlock(api) {
    const L = api.L;
    let letzte = null;            // letzte Antwort (d.ocr)
    let schluessel = "";          // erkennt unveraenderten Text, damit das DOM nicht bei jedem Bild neu gebaut wird
    let fliess = false;
    let eingefroren = false;
    let vorlesen = null;          // laufendes Vorlesen { stop() }

    const chipZustand = h("span", { class: "chip ocr-zustand", role: "status" }, KL.icon("scan-line"), h("span", null, "Warte auf die Kamera"));
    const chipZahlen = h("span", { class: "ocr-zahlen" });
    const hinweis = h("p", { class: "d-hinweis ocr-hinweis", "aria-live": "polite" }, "Starte die Kamera und halte ein Blatt mit gedrucktem Text ins Bild. Der Text erscheint hier.");
    const textBox = h("div", { class: "ocr-text", lang: "de", tabindex: "0", "aria-label": "Gelesener Text" });
    const leer = h("p", { class: "d-hinweis ocr-leer" }, "Noch kein Text gelesen.");
    const legende = h("p", { class: "ocr-legende", hidden: true },
      h("span", { class: "ocr-w u1" }, "unsicher"), " und ", h("span", { class: "ocr-w u2" }, "sehr unsicher"),
      " gelesene Wörter sind unterstrichen und tragen ein Fragezeichen. Prüfe sie am Papier.");
    const meld = h("p", { class: "ocr-meld", role: "status", "aria-live": "polite" });
    const karten = h("div", { class: "ocr-karten", "aria-live": "polite" });
    const kartenKopf = h("h4", { class: "ocr-karten-kopf", hidden: true }, KL.icon("list-checks"), "Gefunden im Text");
    const kartenLeer = h("p", { class: "d-hinweis ocr-karten-leer" }, "Beträge, Datum, Uhrzeit, E-Mail und Telefonnummern erscheinen hier als Karten, sobald sie im Text stehen.");

    const knopf = (symbol, text, klick, titel) => h("button", { type: "button", class: "btn", onclick: klick, title: titel || null }, KL.icon(symbol), h("span", null, text));
    const bKopieren = knopf("copy", "Text kopieren", () => textKopieren());
    const bVorlesen = knopf("volume-2", "Vorlesen", () => vorlesenUmschalten(), "Der Jetson liest den Text mit einer KI-Stimme vor");
    const bNeu = knopf("refresh-cw", "Neu lesen", () => neuLesen(), "Verwirft den bisherigen Text und liest von vorn");
    const bFrieren = knopf("snowflake", "Standbild einfrieren", () => frieren(), "Hält Text und Bild fest, damit du das Blatt weglegen kannst");
    const bFliess = h("button", { type: "button", class: "btn ocr-fliess", "aria-pressed": "false", onclick: () => { fliess = !fliess; bFliess.setAttribute("aria-pressed", String(fliess)); schluessel = ""; if (letzte) zeige(letzte); } },
      KL.icon("type"), h("span", null, "Als Fließtext"));
    const zeile = h("div", { class: "zeile ocr-knoepfe", role: "group", "aria-label": "Aktionen für den gelesenen Text" }, bKopieren, bVorlesen, bNeu, bFrieren, bFliess);
    const kiChip = h("span", { class: "chip ki-kennung", hidden: true }, KL.icon("bot"), "KI-erzeugte Stimme");

    const el = h("section", { class: "ocr-ergebnis", "aria-label": "Gelesener Text und gefundene Angaben" },
      h("div", { class: "ocr-kopf" }, h("h3", null, KL.icon("file-text"), "Gelesener Text"), chipZustand, chipZahlen),
      hinweis,
      h("div", { class: "ocr-spalten" },
        h("div", { class: "ocr-links" }, zeile, kiChip, textBox, leer, legende, meld),
        h("aside", { class: "ocr-rechts", "aria-label": "Gefundene Angaben" }, kartenKopf, karten, kartenLeer,
          h("p", { class: "d-leise ocr-regelhinweis" }, "Die Karten findet keine KI, sondern eine feste Regel im Text. Sie sind so sicher wie der Text darüber."))));

    function melde(t) { meld.textContent = t || ""; }

    /* ------------------------------------------------ Anzeige */
    function wortEl(w) {
      const s = w[1];
      const stufe = s >= 0.85 ? 0 : s >= 0.6 ? 1 : 2;
      if (!stufe) return document.createTextNode(w[0]);
      return h("span", { class: "ocr-w u" + stufe, title: (stufe === 1 ? "unsicher gelesen, " : "sehr unsicher gelesen, ") + proz(s) }, w[0]);
    }
    function zeileEl(z) {
      const el = h("span", { class: "ocr-z" });
      z.w.forEach((w, i) => { if (i) el.append(" "); el.append(wortEl(w)); });
      return el;
    }
    function textZeigen(o) {
      const teile = [];
      let aktuell = null;
      o.zeilen.forEach((z, i) => {
        if (i === 0 || z.a) { aktuell = h("p", { class: "ocr-absatz" }); teile.push(aktuell); aktuell.append(zeileEl(z)); return; }
        const davor = o.zeilen[i - 1];
        if (fliess && davor.f) { aktuell.append(" ", zeileEl(z)); return; }
        aktuell.append(h("br"), zeileEl(z));
      });
      textBox.replaceChildren(...teile);
    }
    function kartenZeigen(o) {
      const liste = o.fakten || [];
      karten.replaceChildren(...liste.map((k) => {
        const art = KARTEN[k.art] || { symbol: "hash", name: k.name };
        const schoen = kartenWert(k);
        return h("div", { class: "ocr-karte ocr-karte-" + k.art },
          h("span", { class: "ocr-karte-symbol" }, KL.icon(art.symbol)),
          h("div", { class: "ocr-karte-text" }, h("span", { class: "ocr-karte-art" }, art.name), h("b", null, schoen),
            schoen !== k.text ? h("span", { class: "d-leise" }, "gelesen: " + k.text) : null),
          h("button", { type: "button", class: "ocr-karte-kopie", "aria-label": art.name + " kopieren: " + k.text, title: "Kopieren", onclick: () => kopiereWert(k.text) }, KL.icon("copy")));
      }));
      kartenKopf.hidden = liste.length === 0;
      kartenLeer.hidden = liste.length > 0;
    }
    function kopiereWert(t) { kopieren(t).then(() => melde("Kopiert: " + t), () => melde("Kopieren ging nicht. Markiere den Text und kopiere ihn von Hand.")); }

    function zustandsText(o) {
      if (o.eingefroren) return ["snowflake", "Standbild"];
      if (!o.anzahl) return ["search", "Suche Text"];
      if (o.stabil) return ["check", "Text steht stabil"];
      return ["scan-line", "Liest, Text noch nicht stabil"];
    }
    function zeige(d) {
      const o = d.ocr || d;
      letzte = o;
      eingefroren = !!o.eingefroren;
      bFrieren.replaceChildren(KL.icon(eingefroren ? "refresh-cw" : "snowflake"), h("span", null, eingefroren ? "Weiter lesen" : "Standbild einfrieren"));
      const [sym, txt] = zustandsText(o);
      chipZustand.replaceChildren(KL.icon(sym), h("span", null, txt));
      chipZustand.classList.toggle("stabil", !!o.stabil && !o.eingefroren);
      const sich = o.anzahl ? "Sicherheit des Modells " + proz(o.sicherheit) : "";
      chipZahlen.textContent = o.anzahl ? o.anzahl + (o.anzahl === 1 ? " Zeile, " : " Zeilen, ") + o.woerter + " Wörter, " + sich + (o.unsicher ? ", " + o.unsicher + (o.unsicher === 1 ? " Wort unsicher" : " Wörter unsicher") : "") : "";
      const bl = o.blatt ? "Das Blatt ist gefunden und geradegezogen." : "Kein Blatt im Bild erkannt, der Jetson liest das ganze Bild.";
      const dr = o.drehung ? " Der Text stand " + (o.drehung === 180 ? "auf dem Kopf" : "quer") + ", der Jetson hat ihn um " + o.drehung + " Grad gedreht." : "";
      hinweis.textContent = o.anzahl ? bl + dr : "Kein Text gefunden. Halte das Blatt näher heran, sorge für gutes Licht und lege es möglichst flach hin.";
      const neu = JSON.stringify([o.zeilen, fliess]);
      if (neu !== schluessel) {
        schluessel = neu;
        textZeigen(o);
        kartenZeigen(o);
      }
      leer.hidden = o.anzahl > 0;
      textBox.hidden = o.anzahl === 0;
      legende.hidden = !(o.unsicher > 0);
      [bKopieren, bVorlesen, bFliess].forEach((b) => { b.disabled = !o.anzahl; });
      bFrieren.disabled = !o.anzahl && !o.eingefroren;
    }

    /* ------------------------------------------------ Knoepfe */
    function aktuellerText() { return letzte ? (fliess ? letzte.fliess : letzte.text) || "" : ""; }
    function textKopieren() {
      const t = aktuellerText();
      if (!t) return;
      kopieren(t).then(() => melde("Der Text ist kopiert."), () => melde("Kopieren ging nicht. Markiere den Text und kopiere ihn von Hand."));
    }
    function neuLesen() {
      stopVorlesen();
      api.sende({ neu: true });
      eingefroren = false;
      schluessel = "";
      melde("Der Jetson liest das Blatt neu.");
    }
    function frieren() {
      api.sende({ frieren: !eingefroren });
      melde(eingefroren ? "Der Jetson liest weiter." : "Text und Bild sind eingefroren. Du kannst das Blatt weglegen.");
    }

    /* Vorlesen: Text in Stuecke, jedes Stueck ueber /api/tts (Stimme thorsten), nacheinander abspielen, das naechste vorab holen */
    function stopVorlesen() {
      if (vorlesen) { vorlesen.stop(); vorlesen = null; }
      bVorlesen.replaceChildren(KL.icon("volume-2"), h("span", null, "Vorlesen"));
      kiChip.hidden = true;
    }
    L.onEnde(stopVorlesen);
    function vorlesenUmschalten() {
      if (vorlesen) { stopVorlesen(); return; }
      let text = (letzte && letzte.text) || "";
      if (!text) return;
      let gekuerzt = false;
      if (text.length > MAX_VORLESEN) { text = text.slice(0, MAX_VORLESEN); gekuerzt = true; }
      const teile = stuecke(text);
      let abbruch = new AbortController();
      let audio = null, url = null, i = 0, aus = false;
      const holen = (t) => fetch("/api/tts", { method: "POST", headers: { "Content-Type": "application/json" }, signal: abbruch.signal, body: JSON.stringify({ text: t, stimme: STIMME, tempo: 1.0 }) })
        .then(async (r) => {
          const d = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(typeof d.fehler === "string" && d.fehler ? d.fehler : "Die Sprachausgabe hat nicht geklappt (Fehler " + r.status + ").");
          return URL.createObjectURL(new Blob([base64Bytes(d.wav_b64 || "")], { type: "audio/wav" }));
        });
      const ende = () => { if (aus) return; aus = true; abbruch.abort(); if (audio) { audio.pause(); audio = null; } if (url) URL.revokeObjectURL(url); };
      vorlesen = { stop: ende };
      bVorlesen.replaceChildren(KL.icon("volume-x"), h("span", null, "Vorlesen stoppen"));
      kiChip.hidden = false;
      melde("Der Jetson bereitet die Stimme vor.");
      let naechstes = holen(teile[0]);
      const spiele = async () => {
        try {
          while (i < teile.length && !aus) {
            const aktuell = await naechstes;
            if (aus) { URL.revokeObjectURL(aktuell); return; }
            i++;
            naechstes = i < teile.length ? holen(teile[i]) : null;
            if (naechstes) naechstes.catch(() => { /* Fehler zeigt der naechste Durchlauf */ });
            if (url) URL.revokeObjectURL(url);
            url = aktuell;
            audio = new Audio(url);
            melde("Der Jetson liest vor (Teil " + i + " von " + teile.length + (gekuerzt && i === teile.length ? ", der Rest ist zu lang zum Vorlesen" : "") + ").");
            await new Promise((ok, fehl) => { audio.onended = ok; audio.onerror = () => fehl(new Error("Der Browser konnte die Sprachausgabe nicht abspielen.")); audio.play().catch(fehl); });
          }
          if (!aus) melde(gekuerzt ? "Fertig. Der Text war länger als " + MAX_VORLESEN + " Zeichen, der Rest wurde nicht vorgelesen." : "Fertig vorgelesen.");
        } catch (e) {
          if (!aus) melde(e && e.name !== "AbortError" && e.message ? e.message : "Das Vorlesen hat nicht geklappt.");
        } finally {
          if (vorlesen && vorlesen.stop === ende) { ende(); vorlesen = null; stopVorlesen(); }
        }
      };
      spiele();
    }

    api.beiVerbindung(() => { eingefroren = false; });
    api.beiAntwort((d) => { if (d.ocr) zeige(d); });
    return el;
  }

  /* Konfiguration fuer webcam() in demos.js (siehe KL.kameraModi) */
  (KL.kameraModi = KL.kameraModi || {}).ocr = {
    dingMehr: "Zeilen",
    suche: "nach Text",
    klasse: "d-ocr",
    beschriftung: ["Deine Kamera", "Das Blatt, wie der Jetson es liest"],
    aufnahme: { breite: 960, hoehe: 720, qualitaet: 0.82, kamera: { breite: 1280, hoehe: 960, rueck: true } },
    hinweis: "Der gelesene Text ist die Schätzung eines KI-Modells. Verwechslungen wie 0 und O, 1 und l oder rn und m kommen vor, Wörter mit Fragezeichen sind unsicher. Es wird nichts gespeichert.",
    statusUrl: "/api/text-lesen/status",
    statusFehler: "Dieses Labor ist auf diesem Jetson noch nicht eingerichtet: Die Modelle zum Lesen von Text fehlen. Der Betreiber holt sie mit scripts/modelle_laden.sh.",
    treffer: (d) => String(d.ocr ? d.ocr.anzahl : 0),
    gefunden: (d) => {
      const o = d.ocr || {};
      const ms = o.ms || {};
      if (!o.anzahl) return "Gefunden: kein Text.";
      const teil = (n, t) => n + " " + t;
      return "Gefunden: " + teil(o.anzahl, o.anzahl === 1 ? "Zeile" : "Zeilen") + " mit " + teil(o.woerter, "Wörtern") + (o.blatt ? ", das Blatt war geradegezogen" : ", ohne Blatt") +
        (o.gelesen ? " (Blatt suchen " + Math.round(ms.blatt || 0) + " ms, Zeilen finden " + Math.round(ms.zeilen_finden || 0) + " ms, Zeichen lesen " + Math.round(ms.lesen || 0) + " ms, davon " + (ms.gelesen || 0) + " Zeilen neu gelesen und " + (ms.uebernommen || 0) + " übernommen)." : " (dieses Bild wurde nicht neu gelesen, der Text steht).");
    },
    extra: (api) => ergebnisBlock(api),
  };
  KL.demos = KL.demos || {};
  KL.demos["webcam-ocr"] = (root, seite) => KL.kamera(root, "ocr", seite);
})();
