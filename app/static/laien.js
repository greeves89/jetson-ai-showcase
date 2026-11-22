/* KI-Labor: Bausteine fuer Einsteiger.
   1) KL.einwilligung  Einwilligung in einfachen Worten, bevor Kamera oder Mikrofon zum ersten Mal starten.
        await KL.einwilligung.verlangen("kamera", { sendet: true })   // oder "mikro"
        Ist die Zustimmung schon gemerkt (localStorage "kl-einwilligung"), kehrt der Aufruf sofort zurueck. Sonst oeffnet sich eine
        Dialogansicht. Lehnt der Besucher ab, wird ein Error mit name "EinwilligungFehlt" und freundlichem Text geworfen.
        sendet: true  das Bild geht kurz an den Rechner der Seite (Gesicht, Objekt, Anlernen), false  es bleibt im Browser.
   2) KL.last          freundliche Warte- und Fehlerzustaende, wenn der Rechner ausgelastet ist.
        KL.last.post(pfad, obj, signal, bei)   POST wie KL.post, wiederholt bei "ausgelastet" (HTTP 503) bis zu dreimal selbst,
                                               meldet den Zaehler ueber bei({art:"warte", versuch, von, sekunden}) und wirft danach BelegtFehler.
        KL.last.beobachten(bei)                fragt /api/warteschlange und ruft bei({art:"platz", position, wartend}), solange der
                                               Besucher wartet. Gibt eine Stopp-Funktion zurueck.
        KL.last.istBelegtText(text)            erkennt die Meldung "ausgelastet" im Antworttext eines Stroms.
        KL.last.box(text, wiederholen)         Hinweisbox mit Knopf "Noch einmal versuchen".
   Alle Texte kommen nur per textContent oder h(...) ins DOM. */
(function () {
  "use strict";
  const KL = window.KL;
  const h = KL.h;

  /* ============================================================ Einwilligung */
  /* Drei Arten: "bild" (Kamera ohne Wiedererkennung), "ton" (Mikrofon), "biometrisch" (Gesicht: Zahlenlisten zur Wiedererkennung,
     Art. 9 DSGVO). Biometrisch braucht ein unvorbelegtes Kontrollkaestchen plus Knopf und wird nur je Sitzung (sessionStorage)
     gemerkt, die beiden anderen bleiben in localStorage "kl-einwilligung" (Schluessel kamera und mikro). */
  const SCHLUESSEL = "kl-einwilligung", BIO = "kl-einwilligung-bio";
  const imSpeicher = {};               // Rueckfall, wenn der Speicher nicht geht: gilt bis zum Neuladen
  const SPEICHER_KEY = { bild: "kamera", ton: "mikro" };
  function lesen() {
    let o = {};
    try { o = JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}") || {}; } catch (e) { o = {}; }
    try { if (sessionStorage.getItem(BIO)) o.biometrisch = sessionStorage.getItem(BIO); } catch (e) { /* ohne Speicher */ }
    return Object.assign({}, imSpeicher, o && typeof o === "object" ? o : {});
  }
  function merken(typ) {
    const heute = new Date().toISOString().slice(0, 10);
    imSpeicher[typ] = heute;
    if (typ === "biometrisch") { try { sessionStorage.setItem(BIO, heute); } catch (e) { /* nur im Speicher */ } return; }
    let o = {};
    try { o = JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}") || {}; } catch (e) { o = {}; }
    o[SPEICHER_KEY[typ]] = heute;
    try { localStorage.setItem(SCHLUESSEL, JSON.stringify(o)); } catch (e) { /* nur im Speicher */ }
  }
  const gespeichert = (typ) => { const o = lesen(); return !!(typ === "biometrisch" ? o.biometrisch : (o[SPEICHER_KEY[typ]] || o[typ])); };

  const ARTEN = {
    bild: {
      icon: "camera", titel: "Darf die Seite deine Kamera nutzen?", ja: "Einverstanden, Kamera nutzen", nein: "Ohne Kamera weitermachen", frei: "Kamera",
      wozu: "Der Rechner soll dein Kamerabild auswerten und dir zeigen, was er erkennt, zum Beispiel Gegenstände.",
      wohinSendet: "Jedes Bild geht nur für einen Augenblick an den Rechner dieser Seite. Er wertet es aus und schickt das Ergebnis zurück.",
      wohinLokal: "Das Bild bleibt in deinem Browser. Es wird nicht verschickt.",
      speichern: "Es wird nichts gespeichert: kein Foto, kein Video.",
      abgelehnt: "Du hast die Kamera nicht freigegeben. Das ist in Ordnung. Du kannst mit den Beispielbildern weitermachen oder die Kamera später starten.",
      abgelehntOhne: "Du hast die Kamera nicht freigegeben. Das ist in Ordnung. Dieses Labor braucht dafür deine Kamera, du kannst sie später starten.",
    },
    ton: {
      icon: "mic", titel: "Darf die Seite dein Mikrofon nutzen?", ja: "Einverstanden, Mikrofon nutzen", nein: "Ohne Mikrofon weitermachen", frei: "Mikrofon",
      wozu: "Der Rechner soll hören, was du sagst, und es als Text aufschreiben.",
      wohinSendet: "Die Aufnahme geht einmal an den Rechner dieser Seite. Er schreibt sie als Text auf und schickt den Text zurück.",
      wohinLokal: "Die Aufnahme bleibt in deinem Browser.",
      speichern: "Es wird nichts gespeichert: keine Aufnahme, kein Ton. Nach der Auswertung ist sie weg.",
      abgelehnt: "Du hast das Mikrofon nicht freigegeben. Das ist in Ordnung. Du kannst stattdessen eine Audiodatei wählen oder es später noch einmal versuchen.",
      box: "Ich willige ein, dass meine Aufnahme zum Aufschreiben kurz verarbeitet wird.",
    },
    biometrisch: {
      icon: "scan-face", titel: "Gesichtserkennung: ausdrücklich einwilligen", ja: "Einwilligen und Kamera starten", nein: "Ohne Kamera weitermachen", frei: "Gesichtserkennung",
      wozu: "Der Rechner soll Gesichter in deinem Kamerabild finden und daraus Zahlenlisten bilden, mit denen sich Gesichter vergleichen und wiedererkennen lassen.",
      wohinSendet: "Jedes Bild geht nur für einen Augenblick an den Rechner dieser Seite. Er wertet es aus und schickt das Ergebnis zurück.",
      wohinLokal: "Das Bild bleibt in deinem Browser. Es wird nicht verschickt.",
      speichern: "Es wird nichts gespeichert: kein Foto, kein Video. Zahlenlisten verfallen mit deiner Sitzung.",
      abgelehnt: "Du hast nicht eingewilligt. Das ist in Ordnung. Du kannst mit den Beispielbildern weitermachen.",
      abgelehntOhne: "Du hast nicht eingewilligt. Das ist in Ordnung. Dieses Labor arbeitet nur mit deiner Kamera, Beispielbilder gibt es hier nicht. Ohne Kamera zeigt dir das Objekt-Labor mit Beispielbildern, wie ein Computer Bilder auswertet.",
      box: "Ich willige ein, dass mein Kamerabild zur Gesichtserkennung kurz verarbeitet wird.",
    },
  };
  /* Zusatz je Labor (Seiten-ID), wenn dort etwas auf dem Rechner der Seite zurueckbleibt */
  const ZUSATZ = {
    anlernen: "Beim Anlernen merkt sich der Rechner für etwa 30 Minuten Zahlenwerte aus deinen Bildern, nicht die Bilder selbst. Danach vergisst er sie.",
  };
  const BIO_LABORE = new Set(["gesicht", "anlernen"]);
  const MIT_BEISPIELEN = new Set(["objekt", "anlernen", "whisper"]);      // Labore, in denen es Beispiele ohne Kamera gibt (Katalog beispiele/manifest.json)
  /* Alters- und Elternhinweis, steht oben im Dialog. Bewusst ohne Abfrage: Die Seite prueft kein Alter und gibt kein Schutzversprechen. */
  const ALTER_HINWEIS = ["Nutzbar ab 16 Jahren.", "Jüngere nur mit Einverständnis der Eltern. Die Seite prüft dein Alter nicht."];
  const aktuelleSeite = () => (location.pathname.replace(/^\/|\/$/g, "") || "start");
  const typVon = (art, opt) => (opt && opt.typ) || (art === "mikro" ? "ton" : BIO_LABORE.has(aktuelleSeite()) ? "biometrisch" : "bild");

  let offen = null;                    // laufende Abfrage: Doppelklicks teilen sich dieselbe Ansicht

  function einwilligungFehlt(text) {
    const e = new Error(text);
    e.name = "EinwilligungFehlt";
    return e;
  }

  function dialogOeffnen(typ, opt) {
    const a = ARTEN[typ];
    const lab = aktuelleSeite();
    const bio = typ === "biometrisch";
    const haken = !!a.box;               // Gesicht und Mikrofon: ausdrückliches Kästchen, nie vorbelegt
    const punkte = [
      ["sparkles", "Wozu", a.wozu],
      [opt.sendet ? "send" : "lock", "Wohin", opt.sendet ? a.wohinSendet : a.wohinLokal],
      ["shield-check", "Was bleibt", a.speichern + (ZUSATZ[lab] ? " " + ZUSATZ[lab] : "")],
      ["power", "Stoppen und widerrufen", "Du kannst jederzeit stoppen und deine Einwilligung unten auf der Seite oder unter „Ist das sicher?“ widerrufen." + (bio ? " Die gemerkte Zustimmung gilt nur für diese Sitzung." : "")],
    ];
    if (bio) punkte.push(["users", "Wer ins Bild darf", "Nur du selbst oder Personen, die zugestimmt haben."]);
    punkte.push(["badge-check", "Kosten", "Kostenlos und ohne Anmeldung."]);
    return new Promise((fertig, fehl) => {
      let antwort = false;
      const id = "einw-" + typ;
      const beispiele = h("div", { class: "einw-beispiele", hidden: true });
      const dlg = h("dialog", { class: "einw", "aria-labelledby": id + "-t", "aria-describedby": id + "-l" });
      const schliessen = (ja) => {
        antwort = ja;
        if (dlg.close) dlg.close();                                          // loest das Ereignis close selbst aus
        else { dlg.removeAttribute("open"); dlg.dispatchEvent(new Event("close")); }
      };
      const ja = h("button", { type: "button", class: "btn primary", disabled: haken, onclick: () => schliessen(true) }, KL.icon("camera" === a.icon ? "camera" : a.icon), a.ja);
      const kaestchen = haken ? h("input", { type: "checkbox", id: id + "-ok", onchange: (e) => { ja.disabled = !e.target.checked; } }) : null;   // bewusst nicht vorbelegt
      const datenschutz = String((KL.seite || {}).datenschutz_url || "");
      const nein = h("button", { type: "button", class: "btn", onclick: () => schliessen(false) }, a.nein);
      // Native append schreibt null als Text "null" in den Dialog: leere Teile gar nicht erst uebergeben
      dlg.append(...[
        h("div", { class: "einw-kopf" },
          h("div", { class: "einw-icon", "aria-hidden": "true" }, KL.icon(a.icon)),
          h("h2", { id: id + "-t" }, a.titel)),
        h("p", { class: "einw-alter" }, h("span", { class: "einw-alter-ic", "aria-hidden": "true" }, KL.icon("users")), h("span", null, h("b", null, ALTER_HINWEIS[0]), " ", ALTER_HINWEIS[1])),
        h("p", { class: "einw-lead", id: id + "-l" }, "Kurz erklärt, was dann passiert:"),
        h("ul", { class: "einw-liste" }, punkte.map(([ic, kopf, text]) =>
          h("li", null, h("span", { class: "einw-ic", "aria-hidden": "true" }, KL.icon(ic)), h("div", null, h("b", null, kopf), h("span", null, text))))),
        haken ? h("label", { class: "einw-box", for: id + "-ok" }, kaestchen, h("span", null, a.box)) : null,
        h("p", { class: "einw-klein" }, "Danach fragt dich noch dein Browser. Das ersetzt deine Einwilligung hier nicht und umgekehrt. ",
          h("a", { href: "/sicherheit-einfach", onclick: () => schliessen(false) }, "Mehr dazu: Ist das sicher?"),
          /^https:\/\//.test(datenschutz) ? [" ", h("a", { href: datenschutz, rel: "noopener", target: "_blank" }, "Datenschutzerklärung")] : null),
        h("div", { class: "einw-aktion" },
          nein, ja),
        beispiele].filter(Boolean));
      dlg.addEventListener("close", () => {
        if (dlg.parentNode) dlg.remove();
        offen = null;
        if (antwort) { merken(typ); aktualisiereFuss(); fertig(true); }
        else fehl(einwilligungFehlt(MIT_BEISPIELEN.has(lab) || !a.abgelehntOhne ? a.abgelehnt : a.abgelehntOhne));
      }, { once: true });
      dlg.addEventListener("cancel", () => { antwort = false; });      // Esc: Dialog schliesst selbst, close folgt
      document.body.append(dlg);
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      try { (kaestchen || nein).focus({ preventScroll: true }); } catch (e) { /* egal */ }
      dlg.scrollTop = 0;                                                                   // der Hinweis zu Alter und Eltern oben soll zuerst im Bild stehen      // Tastatur: Fokus startet im Dialog, Esc schliesst ihn
      // Ohne Kamera: fertige Beispiele dieses Labors anbieten (aus dem Beispielkatalog)
      KL.beispiele().then((m) => {
        const liste = (m.usecases || []).filter((u) => u.lab === lab && !u.live).slice(0, 3);
        if (!liste.length || !dlg.isConnected) return;
        beispiele.append(h("p", { class: "einw-klein" }, "Ohne " + (typ === "ton" ? "Mikrofon" : "Kamera") + " ausprobieren:"),
          h("div", { class: "einw-bsp" }, liste.map((u) => h("a", { class: "chip", href: "/" + lab + "?beispiel=" + u.id, onclick: () => schliessen(false) }, u.titel))));
        beispiele.hidden = false;
      }).catch(() => { /* ohne Katalog bleibt der Dialog schlicht */ });
    });
  }

  /* Laufende Kamera- und Mikrofonstroeme merken, damit ein Widerruf sie sofort stoppen kann */
  const strome = new Set();
  try {
    const md = navigator.mediaDevices;
    if (md && md.getUserMedia) {
      const orig = md.getUserMedia.bind(md);
      md.getUserMedia = (c) => orig(c).then((st) => { strome.add(st); return st; });
    }
  } catch (e) { /* ohne Zugriff bleibt es beim normalen Stoppen der Labore */ }

  KL.einwilligung = {
    /** true, wenn der Besucher schon zugestimmt hat. art: "kamera" | "mikro" (wie verlangen) oder direkt "bild" | "ton" | "biometrisch". */
    gegeben(art, opt) { const t = ARTEN[art] ? art : typVon(art, opt); return gespeichert(t); },
    /** Zeigt bei Bedarf die Einwilligung. Loest bei Zustimmung auf, sonst Error "EinwilligungFehlt". opt: {sendet, typ} */
    verlangen(art, opt) {
      const typ = ARTEN[art] ? art : typVon(art, opt);
      if (!ARTEN[typ]) return Promise.reject(new Error("Unbekannte Einwilligung: " + art));
      if (gespeichert(typ)) return Promise.resolve(true);
      if (!offen) offen = dialogOeffnen(typ, Object.assign({ sendet: true }, opt || {}));
      return offen;
    },
    /** Nimmt die Zustimmung zurueck (typ leer: alle), loescht den gemerkten Eintrag und stoppt laufende Kamera und Mikrofon. */
    widerrufen(typ) {
      const alle = !typ;
      for (const t of Object.keys(ARTEN)) {
        if (!alle && t !== typ) continue;
        delete imSpeicher[t];
        if (t === "biometrisch") { try { sessionStorage.removeItem(BIO); } catch (e) { /* egal */ } continue; }
        try { const o = JSON.parse(localStorage.getItem(SCHLUESSEL) || "{}") || {}; delete o[SPEICHER_KEY[t]]; delete o[t]; localStorage.setItem(SCHLUESSEL, JSON.stringify(o)); } catch (e) { /* egal */ }
      }
      for (const st of strome) { try { st.getTracks().forEach((x) => x.stop()); } catch (e) { /* egal */ } }
      strome.clear();
      document.dispatchEvent(new CustomEvent("kl:widerruf", { detail: { typ: typ || "alle" } }));
      aktualisiereFuss();
    },
    arten: () => Object.keys(ARTEN),
    name: (typ) => ARTEN[typ].frei,
  };

  /* Knopf "Einwilligung widerrufen" in der Fusszeile, sichtbar nur, solange eine Zustimmung gemerkt ist */
  let fussKnopf = null;
  function aktualisiereFuss() {
    const fuss = document.getElementById("fuss");
    if (!fuss) return;
    if (!fussKnopf) {
      fussKnopf = h("p", { class: "fuss-widerruf" }, h("button", { type: "button", class: "btn klein", onclick: () => KL.einwilligung.widerrufen() }, KL.icon("undo-2"), "Einwilligung für Kamera und Mikrofon widerrufen"));
      fuss.append(fussKnopf);
    }
    fussKnopf.hidden = !KL.einwilligung.arten().some((t) => gespeichert(t));
  }
  document.addEventListener("DOMContentLoaded", aktualisiereFuss);
  setTimeout(aktualisiereFuss, 0);

  /* ============================================================ Last und Warteschlange */
  const MAX_WIEDERHOLUNGEN = 3;
  const TEXT_BELEGT = "Der Rechner ist gerade ausgelastet, weil viele Menschen das Labor nutzen. Du hast nichts falsch gemacht. Versuch es gleich noch einmal.";

  class BelegtFehler extends Error {
    constructor(text, info) { super(text); this.name = "BelegtFehler"; this.info = info || {}; }
  }
  function schlafen(ms, signal) {
    return new Promise((ok, fehl) => {
      const abbruch = () => { clearTimeout(t); const e = new Error("abgebrochen"); e.name = "AbortError"; fehl(e); };
      const t = setTimeout(() => { if (signal) signal.removeEventListener("abort", abbruch); ok(); }, ms);
      if (signal) { if (signal.aborted) abbruch(); else signal.addEventListener("abort", abbruch, { once: true }); }
    });
  }

  KL.last = {
    MAX_WIEDERHOLUNGEN,
    TEXT: TEXT_BELEGT,
    BelegtFehler,
    schlafen,
    istBelegtText: (t) => /ausgelastet|gerade belegt/i.test(String(t || "")),
    /** Satz zur Platznummer, z. B. "Du bist Nr. 2 in der Warteschlange." */
    platzText(info) {
      const n = info && info.position;
      if (!n) return "";
      return n === 1 ? "Du bist als Nächster dran. Gleich geht es los." : "Du bist Nr. " + n + " in der Warteschlange. Gleich geht es los.";
    },
    /** Satz zum automatischen Wiederholen, z. B. "Neuer Versuch in 5 s (Wiederholung 1 von 3)." */
    warteText(info) {
      return "Der Rechner ist gerade ausgelastet, nichts falsch gemacht. Neuer Versuch in " + info.sekunden + " s (Wiederholung " + info.versuch + " von " + info.von + ").";
    },
    /** POST mit JSON. Bei "ausgelastet" bis zu dreimal selbst wiederholen, danach BelegtFehler. */
    async post(pfad, obj, signal, bei) {
      for (let versuch = 1; ; versuch++) {
        const r = await fetch(pfad, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj || {}), signal });
        if (r.status !== 503 && r.status !== 429) return r;
        let d = null;
        try { d = await r.clone().json(); } catch (e) { /* kein JSON */ }
        if (!d || !(d.belegt || d.limit)) return r;
        if (d.limit) throw new BelegtFehler(String(d.fehler || "Bitte warte einen Moment."), { art: "limit" });
        if (versuch > MAX_WIEDERHOLUNGEN) throw new BelegtFehler(TEXT_BELEGT, { art: "belegt", versuche: versuch });
        const sek = Math.max(3, Math.min(20, Number(d.wiederholen_s) || 8));
        for (let rest = sek; rest > 0; rest--) {
          if (bei) bei({ art: "warte", versuch, von: MAX_WIEDERHOLUNGEN, sekunden: rest });
          await schlafen(1000, signal);
        }
      }
    },
    /** Fragt die eigene Platznummer ab, solange gewartet wird. bei({art:"platz", position, wartend}). Gibt die Stopp-Funktion zurueck. */
    beobachten(bei) {
      let weg = false, timer = null;
      const runde = async () => {
        if (weg) return;
        try {
          const r = await fetch("/api/warteschlange", { cache: "no-store" });
          const d = r.ok ? await r.json() : null;
          if (!weg && d && d.meine_position > 0) bei({ art: "platz", position: d.meine_position, wartend: d.wartend });
        } catch (e) { /* kein Platzzaehler, die Anfrage laeuft trotzdem */ }
        if (!weg) timer = setTimeout(runde, 1500);
      };
      timer = setTimeout(runde, 1200);
      return () => { weg = true; clearTimeout(timer); };
    },
    /** Hinweisbox mit Wiederholknopf. */
    box(text, wiederholen) {
      return h("div", { class: "last-box", role: "status" },
        KL.icon("hourglass"),
        h("div", { class: "last-text" }, h("p", null, text),
          wiederholen ? h("button", { type: "button", class: "btn klein", onclick: wiederholen }, KL.icon("refresh-cw"), "Noch einmal versuchen") : null));
    },
  };

  /* ============================================================ Willkommen (Rollenwahl als kleines Fenster)
     KL.willkommen.beimStart()  nach dem ersten Rendern: zeigt das Fenster nur beim ersten Besuch der Startseite (Pfad /), nie auf Lektionsseiten,
                                nicht mit gespeichertem Weg (kl-weg), nicht mit ?weg= in der Adresse, nicht nach "Später" (kl-willkommen),
                                nicht bei navigator.webdriver (Tests, Crawler), ausser die Adresse hat ?willkommen=1.
     KL.willkommen.oeffnen({aendern})  dasselbe Fenster auf Wunsch ("Ich bin: ..." in der Kopfzeile). Die Wahl laeuft ueber KL.wegWaehlen (app.js),
                                es wird nichts gesendet. Texte: INHALT.willkommen (content-laien.js). */
  const WK = "kl-willkommen";
  const wkGesehen = () => { try { if (localStorage.getItem(WK)) return true; } catch (e) { /* ohne Speicher */ } try { return !!sessionStorage.getItem(WK); } catch (e) { return false; } };
  const wkMerken = () => { try { localStorage.setItem(WK, "1"); } catch (e) { try { sessionStorage.setItem(WK, "1"); } catch (e2) { /* nur bis zum Neuladen */ } } };
  function wkErstbesuch() {
    try {
      const q = new URLSearchParams(location.search);
      if (location.pathname.replace(/\/+$/, "") !== "") return false;                  // nur die Startseite
      if (q.has("weg")) return false;                                                   // Klassenlink oder Verweis mit Weg
      if (navigator.webdriver && q.get("willkommen") !== "1") return false;             // Tests und Crawler nicht stoeren
      return !KL.weg && !wkGesehen();
    } catch (e) { return false; }
  }
  let wkOffen = null;
  function willkommenOeffnen(opt) {
    if (wkOffen) return wkOffen;
    const T = KL.INHALT && KL.INHALT.willkommen;
    const wege = KL.wegListe ? KL.wegListe() : [];
    if (!T || !wege.length || !KL.wegWaehlen) return null;
    const aendern = !!(opt && opt.aendern);
    const vorher = document.activeElement;
    const aktiv = KL.weg;
    let wahl = null;
    const dlg = h("dialog", { class: "wk", "aria-labelledby": "wk-t", "aria-describedby": "wk-s" });
    const zu = (w) => { wahl = w || null; if (dlg.close) dlg.close(); else { dlg.removeAttribute("open"); dlg.dispatchEvent(new Event("close")); } };
    const knoepfe = wege.map((w) => h("button", { type: "button", class: "wk-weg" + (aendern && aktiv === w.id ? " aktiv" : ""), dataset: { weg: w.id },
      "aria-pressed": aendern ? String(aktiv === w.id) : null, onclick: () => zu(w.id) },
      h("span", { class: "wk-ic", "aria-hidden": "true" }, KL.icon(w.symbol)),
      h("span", { class: "wk-text" }, h("b", null, w.titel), w.kurz ? h("span", { class: "wk-kurz" }, w.kurz) : null, (T.kamera || {})[w.id] ? h("small", null, T.kamera[w.id]) : null)));
    // Fortschritt merken: kleiner Schalter, nie vorbelegt (ausser es ist schon eingewilligt); wirkt erst beim Schliessen
    let merken = !!KL.merken;
    const schalter = h("button", { type: "button", class: "wk-merken", role: "switch", "aria-checked": String(merken),
      onclick: () => { merken = !merken; schalter.setAttribute("aria-checked", String(merken)); } },
      h("span", { class: "wk-merken-knopf", "aria-hidden": "true" }), h("span", { class: "wk-merken-text" }, T.merken));
    const x = h("button", { type: "button", class: "wk-x", "aria-label": T.schliessen, onclick: () => zu(null) }, KL.icon("x"));
    dlg.append(
      x,
      h("h2", { id: "wk-t" }, T.titel),
      h("p", { class: "wk-satz", id: "wk-s" }, T.satz),
      h("div", { class: "wk-wege" }, knoepfe),
      schalter,
      h("div", { class: "wk-aktion" }, h("button", { type: "button", class: "btn wk-spaeter", onclick: () => zu(null) }, aendern ? T.schliessen : T.spaeter)),
      h("p", { class: "wk-klein" }, h("span", { "aria-hidden": "true" }, KL.icon("lock")), h("span", null, T.hinweis)));
    dlg.addEventListener("click", (e) => { if (e.target === dlg) zu(null); });          // Klick neben das Fenster wie "Später"
    dlg.addEventListener("close", () => {
      if (dlg.parentNode) dlg.remove();
      wkOffen = null;
      wkMerken();                                                                       // gesehen: erscheint nicht wieder von selbst
      if (merken !== !!KL.merken && KL.merkenSetzen) KL.merkenSetzen(merken);            // Einwilligung zum Merken des Fortschritts, nur auf ausdruecklichen Schalter
      if (wahl) KL.wegWaehlen(wahl);
      const ziel = vorher && vorher.isConnected && vorher !== document.body ? vorher : document.getElementById("inhalt");
      try { if (ziel) ziel.focus({ preventScroll: true }); } catch (e) { /* egal */ }
    }, { once: true });                                                                 // Esc: dialog schliesst selbst, close folgt wie bei "Später"
    wkOffen = dlg;
    document.body.append(dlg);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    try { knoepfe[0].focus({ preventScroll: true }); } catch (e) { /* egal */ }
    return dlg;
  }
  KL.willkommen = {
    oeffnen: willkommenOeffnen,
    beimStart() {
      if (!wkErstbesuch()) return;
      requestAnimationFrame(() => setTimeout(() => { if (wkErstbesuch() && !document.querySelector("dialog[open]")) willkommenOeffnen({}); }, 500));
    },
  };

  /* ============================================================ Baustein: Zustimmungen ansehen und zuruecknehmen (Seite sicherheit-einfach) */
  KL.widgets["einwilligung-verwalten"] = function (root) {
    const status = h("p", { class: "g-fuss", role: "status", "aria-live": "polite" });
    const zeilen = KL.einwilligung.arten().map((art) => {
      const text = h("span", { class: "chip" });
      const knopf = h("button", { type: "button", class: "btn klein" }, "Widerrufen");
      const zeigen = () => {
        const ja = KL.einwilligung.gegeben(art);
        text.textContent = ja ? "Zugestimmt" : "Nicht zugestimmt";
        text.classList.toggle("live", ja);
        knopf.disabled = !ja;
      };
      knopf.addEventListener("click", () => {
        KL.einwilligung.widerrufen(art);
        zeigen();
        status.textContent = KL.einwilligung.name(art) + ": Deine Einwilligung ist widerrufen, der gemerkte Eintrag ist gelöscht und eine laufende Kamera ist aus. Beim nächsten Start fragt die Seite wieder.";
      });
      zeigen();
      return KL.zeile(KL.einwilligung.name(art), [text, knopf]);
    });
    root.append(KL.gruppe(null, zeilen, { fuss: "Die Zustimmung gilt nur in diesem Browser. Für Gesichtserkennung gilt sie nur für die laufende Sitzung. Der Browser selbst fragt zusätzlich nach." }), status);
    return { destroy() {} };
  };
})();
