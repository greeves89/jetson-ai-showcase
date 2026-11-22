/* KI-Labor: Kern der Oberflaeche.
   Aufgaben: Router (echte Adressen /seite per History-API), Seitenleiste mit Live-Werten, Seitenaufbau aus content.js,
   Glossar-Erklaerungen, Video-Spieler mit Kapiteln.

   SCHNITTSTELLE FUER BAUSTEINE (widgets.js, demos.js, demo-whisper.js)
   ---------------------------------------------------------------------
   window.KL.widgets[name] = function (root, seite) { ...; return { destroy() {} } }
   window.KL.demos[name]   = function (root, seite) { ...; return { destroy() {} } }
     root   leeres Element in einer Flaeche (class "flaeche pad"). Der Baustein baut seine Oberflaeche darin auf.
     seite  das Seitenobjekt aus INHALT.seiten[id], erweitert um seite.id.
     destroy() wird beim Seitenwechsel gerufen: Kamera stoppen, Timer, WebSockets, Hoerer entfernen.
   Hilfen:
     KL.$(sel, root) KL.$$(sel, root)         Kurzformen fuer querySelector(All)
     KL.h(tag, attrs, ...kinder)              Elemente bauen (class, html, on<ereignis>, dataset, sonst Attribute)
     KL.md(text)                              Markierungen aus content.js in sicheres HTML wandeln
     KL.icon(name)                            Inline-SVG (Klasse ic)
     KL.post(pfad, objekt)                    fetch POST mit JSON, gibt Response zurueck (gleiche Herkunft, Origin geht automatisch mit)
     KL.stats.on(fn)                          fn(statsObjekt) etwa alle 1,5 s, gibt eine Abmelde-Funktion zurueck;
                                              Felder: gpu_pct, ram_mb, ram_max_mb, cpu_pct, power_w, temp_c, modelle_geladen[], frisch
     KL.stats.letzte                          zuletzt empfangene Werte oder null
     KL.zeit(ms)                              Millisekunden als "12 ms" bzw. "1,2 s"
     KL.gruppe(titel, zeilen, {fuss, aktion, klasse})  Einstellungsgruppe (inset grouped): kleine Ueberschrift, Zeilen mit 44 px,
                                              Erlaeuterung (fuss) darunter, Hauptaktionen (aktion: Pill-Buttons) am Ende
     KL.zeile(beschriftung, steuerelement, id, stapel) Zeile in einer Gruppe: links Beschriftung, rechts Steuerelement (Auswahl, Zahlenfeld, Chips)
     KL.beispiele()                           Promise auf /static/beispiele/manifest.json ({usecases:[...]}), gecacht
     seite.query                              Abfrage der Adresse, z. B. /anlernen?beispiel=fertigung-teile -> {beispiel:"fertigung-teile"}
   ADRESSEN: Seiten liegen unter /<id> (Startseite /). Links der Form href="#/<id>" oder "#/<id>?beispiel=x" funktionieren
     weiter: Klicks darauf werden abgefangen und ohne Neuladen auf die echte Adresse gelegt; ein gesetztes
     location.hash = "#/id" und alte Lesezeichen werden per replaceState auf die saubere Adresse umgeleitet.
   SICHERHEIT: Server-, Modell- und Nutzertexte NUR per textContent oder h(...) mit Text einsetzen, nie ueber
   html: oder innerHTML. KL.md() ist nur fuer eigene, statische Texte aus content.js gedacht.
   CSS-Klassen stehen in style.css (flaeche, pad, btn, chip, regler, live, pipe, erklaerung, ...).
   LERNPLATTFORM (alles nur im Browser, nichts wird gesendet):
     Seitenfeld downloads: [{text, sub, href}]   Dateikarten mit Download-Knopf rechts, immer sichtbar direkt unter dem Seitenkopf, href nur unter /static/ (PDF), öffnet in neuem Tab
     Seitenfeld lernziele: ["Du kannst ...", ...]   2 bis 4 Sätze, stehen oben auf der Seite; daneben die Lesezeit (kurz und genau, aus der Wortzahl)
     Abschnittsfeld mathe: {p: [...]}                 erscheint nur, wenn der Schalter "Mit Mathe" an ist (localStorage kl-mathe)
     Fortschritt: Eine Seite zaehlt als gelesen, wenn das Seitenende erreicht ist (mindestens 5 s nach dem Oeffnen) oder das Quiz fertig ist
       (localStorage kl-gelesen, kl-zuletzt). INHALT.lernpfade (content-laien.js) benennt die Pfade; unbekannte Seiten-IDs fallen still weg.
     Weg: Startseite mit sechs Rollen (siehe WEGE), localStorage kl-weg (ein Wort). /?weg=schule wirkt ohne zu speichern.
     Fortschritt wird nur nach Einwilligung gespeichert (localStorage kl-merken = "1", nie vorbelegt; Schalter im Willkommens-Fenster, "Fortschritt merken" in der
       Fusszeile, Aus leert kl-gelesen und kl-zuletzt). Ohne Einwilligung bleibt er im Arbeitsspeicher. KL.merken liest, KL.merkenSetzen(an) setzt.
     Wege: schule, lehrende, erwachsene (Alias neugierig), technik, beruf, eltern. Jeder /?weg=... wirkt wie /?weg=schule, ohne zu speichern.
     KL.weg liefert den aktiven Weg oder null, KL.gelesen(id) ob eine Seite als gelesen gilt.
     Willkommens-Fenster (laien.js, Texte INHALT.willkommen): erscheint nur beim ersten Besuch der Startseite, nutzt KL.wegListe() (Schluessel, Titel, Symbol)
       und KL.wegWaehlen(schluessel); "Rollenname wie im Fenster (z. B. "Ich will KI verstehen)" in der Kopfzeile oeffnet dieselbe Karte (KL.willkommen.oeffnen). Die Karte blockiert nichts (kein Modal).
       localStorage kl-willkommen merkt, dass sie gesehen wurde.
   TEXTAUSZEICHNUNG KL.md: **fett**, `code`, [[glossar|Text]], {{seite|Text}} und [Text](Adresse). Adressen nur mit https:// oder / am Anfang
     (kein // und keine anderen Schemata, sonst bleibt es Klartext); alles wird zuerst escaped. Externe Adressen (https://) bekommen
     rel="noopener noreferrer" und target="_blank", die Klasse md-link ist am Handy mindestens 44 px hoch. Interne (/seite) laufen im Router.
   CODEBLOECKE: Abschnittsfeld code: [{titel, sudo, text}] (nur bei Anleitungen, Beispiel: Seite selbst-bauen). text ist roher Text, der per
     textContent in <pre><code> kommt (wie md() nie als HTML) und genau so kopiert wird; titel ist die Beschriftung; sudo ist ein Satz mit dem Grund
     und zeigt die Markierung "braucht sudo". Der Knopf "Kopieren" ist mindestens 44 px hoch, nutzt navigator.clipboard und notfalls execCommand;
     die Stile stehen inline in codeBlock() (style.css gehoert anderen). Der Block steht im aufklappbaren Teil des Abschnitts, nach den Absaetzen.
   MENUE UND STARTSEITE: Das Menue zeigt beim Start nur Suche, "Fuer dich" (INHALT.menue.fuerDich, hoechstens 12 Seiten) und den zugeklappten Block
     "Alle Bereiche" (Akkordeon). Die Startseite zeigt je Rolle INHALT.startRollen (Ueberschrift, Satz, Bloecke), alles Uebrige liegt unter "Weitere Wege".
     Karten (karte()) haben immer Kopfzeile, Titel, Satz und Fuss; der Fuss liegt unten (margin-top:auto), damit Knoepfe in einer Zeile stehen.
     Der Rohtext der Startseite fuer Suchmaschinen (scripts/seo_bauen.mjs) bleibt unveraendert; die Rolle aendert nur die Darstellung im Browser.
   BILDER UND LESEMODUS (docs/visuals.md): KL.visual(spec) baut ein Bild (visuals.js), KL.montiere({destroy}) haengt Aufraeumer an die Seite,
     KL.lesemodus ist "kompakt" (Standard) oder "ausfuehrlich" (Zuweisung wechselt und merkt sich die Wahl), KL.hatIcon(name) prueft Icon-Namen. */
(function () {
  "use strict";
  const INHALT = window.INHALT;
  const V = (document.currentScript && new URL(document.currentScript.src).search) || "";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k === "dataset") Object.assign(e.dataset, v);
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (const c of kids.flat(Infinity)) {
      if (c == null || c === false) continue;
      e.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return e;
  }

  /* ------------------------------------------------------------ Symbole (lucide-Stil) */
  const ICON = {
    start: '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>',
    karte: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    ml: '<circle cx="7" cy="16" r="1.6"/><circle cx="12" cy="9" r="1.6"/><circle cx="17" cy="14" r="1.6"/><path d="M4 4v16h16"/>',
    genki: '<path d="M4 6h16M4 12h10M4 18h14"/>',
    robotik: '<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 8V5M9.5 13.5h.01M14.5 13.5h.01M3 13v3M21 13v3"/><circle cx="12" cy="4" r="1"/>',
    business: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    gesicht: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    objekt: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
    anlernen: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    rag: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><circle cx="11" cy="14" r="2.3"/><path d="M13 16l2.5 2.5"/>',
    agent: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2V11M12 11l-6 6M12 11l6 6"/>',
    whisper: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4"/>',
    bild: '<rect x="3" y="3" width="18" height="18" rx="2.6"/><path d="M3 15l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5"/>',
    faceswap: '<circle cx="9" cy="10" r="4.5"/><circle cx="15.5" cy="14" r="4.5"/>',
    hardware: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
    check: '<path d="M5 12l4 4 10-10"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    live: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  };
  // Grosse lucide-Auswahl aus icons.json (scripts/icons_bauen.mjs), einmal beim Start nachgeladen. Ohne Datei bleibt es beim kleinen Set.
  // Die Pfade stammen aus der eigenen, eingecheckten Datei (nie aus Spezifikationen oder Nutzertexten).
  let LUCIDE = {};
  function iconsLaden() {
    return fetch("/static/icons.json" + V, { cache: "no-cache" }).then((r) => (r.ok ? r.json() : {}))
      .then((j) => { if (j && typeof j === "object") LUCIDE = j; }).catch(() => { /* bleibt beim kleinen Set */ });
  }
  const eigen = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const hatIcon = (name) => eigen(ICON, name) || eigen(LUCIDE, name);
  function icon(name) {
    const w = document.createElement("span");
    const innen = eigen(ICON, name) ? ICON[name] : eigen(LUCIDE, name) ? LUCIDE[name] : ICON.info;
    w.innerHTML = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + innen + "</svg>";
    return w.firstChild;
  }

  /* ------------------------------------------------------------ Text mit Markierungen */
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  /** Adresse fuer [Text](Adresse): nur https://... oder /pfad (nicht //), ohne Leerzeichen, Anfuehrungszeichen, spitze Klammern, * und Backtick. */
  const LINK_OK = /^(?:https:\/\/[^\s"'<>*`\\]+|\/(?!\/)[^\s"'<>*`\\]*)$/;
  const LINK_RE = /\[([^\[\]]+)\]\(([^()\s]+)\)/g;
  function md(t) {
    let s = esc(String(t));
    const links = [];
    s = s.replace(LINK_RE, (m, text, url) => {
      if (!LINK_OK.test(url)) return text;                                         // keine erlaubte Adresse: nur der Text
      const extern = url.startsWith("https://");
      links.push('<a class="md-link' + (extern ? " ext" : "") + '" href="' + url + '"' + (extern ? ' rel="noopener noreferrer" target="_blank"' : "") + ">" + text + "</a>");
      return "\u0001" + (links.length - 1) + "\u0001";
    });
    s = s.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, k, anzeige) => {
      const g = INHALT.glossar[k];
      if (!g) return anzeige || k;
      return '<button type="button" class="gl" data-gl="' + k + '">' + (anzeige || g[0]) + "</button>";
    });
    // {{seite|Text}} oder {{seite?beispiel=id|Text}} (Abfrage erlaubt: Buchstaben, Ziffern, - _ = &)
    s = s.replace(/\{\{([a-z0-9-]+)(\?[a-z0-9_=&-]+)?\|([^}]+)\}\}/g, (m, id, abfrage, text) => '<a href="#/' + id + (abfrage || "") + '">' + text + "</a>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    return s.replace(/\u0001(\d+)\u0001/g, (m, i) => links[Number(i)] || "");
  }
  const zeit = (ms) => (ms < 1000 ? Math.round(ms) + " ms" : (ms / 1000).toFixed(1).replace(".", ",") + " s");
  function post(pfad, obj) {
    return fetch(pfad, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj || {}) });
  }

  /* ------------------------------------------------------------ Glossar-Erklaerung */
  const tip = h("div", { class: "tip", role: "tooltip", id: "tip" });
  let tipFuer = null;
  function tipZeigen(btn) {
    const g = INHALT.glossar[btn.dataset.gl];
    if (!g) return;
    tip.replaceChildren(h("b", null, g[0]), g[1]);
    const r = btn.getBoundingClientRect();
    tip.style.left = "0px"; tip.style.top = "0px";
    tip.classList.add("auf");
    const b = tip.getBoundingClientRect();
    let x = Math.min(Math.max(8, r.left + r.width / 2 - b.width / 2), window.innerWidth - b.width - 8);
    let y = r.bottom + 8;
    if (y + b.height > window.innerHeight - 8) y = r.top - b.height - 8;
    tip.style.left = x + "px"; tip.style.top = y + "px";
    tipFuer = btn;
  }
  function tipAus() { tip.classList.remove("auf"); tipFuer = null; }
  document.addEventListener("pointerover", (e) => { const b = e.target.closest && e.target.closest(".gl"); if (b) tipZeigen(b); });
  document.addEventListener("pointerout", (e) => { if (e.target.closest && e.target.closest(".gl")) tipAus(); });
  document.addEventListener("focusin", (e) => { const b = e.target.closest && e.target.closest(".gl"); if (b) tipZeigen(b); });
  document.addEventListener("focusout", tipAus);
  document.addEventListener("click", (e) => { const b = e.target.closest && e.target.closest(".gl"); if (b) { tipFuer === b ? tipAus() : tipZeigen(b); } else tipAus(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") tipAus(); });

  /* ------------------------------------------------------------ Live-Werte */
  const stats = {
    letzte: null,
    _h: new Set(),
    on(fn) { this._h.add(fn); if (this.letzte) fn(this.letzte); return () => this._h.delete(fn); },
  };
  const live = {};
  function liveBauen() {
    const bar = (cls) => h("div", { class: "balken " + (cls || "") }, h("i"));
    live.punkt = h("span", { class: "punkt aus" });
    live.status = h("span", null, "verbinde…");
    live.gpu = h("b", null, "–"); live.gpuB = bar();
    live.ram = h("b", null, "–"); live.ramB = bar();
    live.w = h("b", null, "–");
    live.modell = h("div", { class: "modell" }, "kein Modell geladen");
    return h("details", { class: "livebox", "aria-live": "off" },
      h("summary", { class: "kopfz" }, live.punkt, live.status, icon("chevron")),
      h("div", { class: "mini" }, h("div", { class: "z" }, "Auslastung", live.gpu), live.gpuB),
      h("div", { class: "mini" }, h("div", { class: "z" }, "Speicher", live.ram), live.ramB),
      h("div", { class: "mini" }, h("div", { class: "z" }, "Strom", live.w)),
      live.modell);
  }
  function liveAktualisieren(d) {
    live.punkt.classList.toggle("aus", !d.frisch);
    const w = d.warteschlange || {};
    const voll = w.parallel && (w.aktiv >= w.parallel || w.wartend > 0);
    live.status.textContent = !d.frisch ? "keine frischen Werte" : voll ? "Rechner live, gerade viel los" : "Rechner live und frei";
    if (d.gpu_pct != null) { live.gpu.textContent = d.gpu_pct + " %"; live.gpuB.firstChild.style.width = d.gpu_pct + "%"; }
    if (d.ram_mb != null) {
      live.ram.textContent = (d.ram_mb / 1024).toFixed(1).replace(".", ",") + " von " + (d.ram_max_mb / 1024).toFixed(1).replace(".", ",") + " GB";
      live.ramB.firstChild.style.width = (d.ram_mb / d.ram_max_mb * 100) + "%";
      live.ramB.classList.toggle("warn", d.ram_mb / d.ram_max_mb > 0.9);
    }
    if (d.power_w != null) live.w.textContent = String(d.power_w).replace(".", ",") + " W";
    live.modell.textContent = d.modelle_geladen && d.modelle_geladen.length
      ? "Im Speicher: " + d.modelle_geladen.join(", ") : "Kein Modell im Speicher";
  }
  async function poll() {
    if (document.hidden) return;
    try {
      const r = await fetch("/api/stats", { cache: "no-store" });
      const d = await r.json();
      stats.letzte = d;
      liveAktualisieren(d);
      stats._h.forEach((fn) => { try { fn(d); } catch (e) { console.error(e); } });
    } catch (e) {
      live.punkt.classList.add("aus"); live.status.textContent = "nicht erreichbar";
    }
  }

  /* ------------------------------------------------------------ Videos */
  const manifestP = fetch("/api/videos", { cache: "no-cache" })
    .then((r) => (r.ok ? r.json() : { videos: [] })).catch(() => ({ videos: [] }));
  function mmss(t) { return Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0"); }
  function videoBlock(ids) {
    ids = [].concat(ids).filter(Boolean);
    const reihe = ids.length > 1;
    const wrap = h("section", { class: "block", hidden: true }, h("h2", null, icon("play"), reihe ? "Videoreihe" : "Erklärvideo"));
    const flaeche = h("div", { class: "flaeche reihe" }, h("div", { class: "video leer" }, h("div", { class: "platz" }, icon("play"), h("div", null, h("b", null, "Das Video wird geladen")))));
    wrap.append(flaeche);
    manifestP.then((m) => {
      const fertig = ids.map((id) => (m.videos || []).find((x) => x.id === id)).filter(Boolean);
      const offen = ids.length - fertig.length;
      if (!fertig.length) return;          // noch kein Video gebaut: Der Block bleibt weg, statt "Video folgt" zu zeigen
      wrap.hidden = false;
      const zeigen = (i, abspielen) => {
        const v = fertig[i];
        const basis = "/static/videos/" + v.id;
        const video = h("video", { controls: true, preload: "metadata", poster: basis + ".jpg", playsinline: true, "aria-label": v.titel + " (Sprecherstimme KI-erzeugt)" },
          h("source", { src: basis + ".mp4", type: "video/mp4" }),
          h("track", { kind: "subtitles", srclang: "de", label: "Deutsch", src: basis + ".vtt", default: true }));
        const kap = (v.kapitel || []).map((k) => h("li", null,
          h("button", { type: "button", dataset: { t: k.t }, onclick: () => { video.currentTime = k.t; video.play(); } },
            h("span", { class: "t" }, mmss(k.t)), k.titel)));
        // Untertitel: Am Handy verdecken sie den Bildtext und das Schlussbild. Dort laufen sie als Zeile UNTER dem Bild; im Vollbild und auf breiten Schirmen bleibt es beim Untertitel des Browsers.
        const unter = h("p", { class: "untertitel", "aria-hidden": "true", hidden: true });
        const spur = video.textTracks && video.textTracks[0];
        const schmal = window.matchMedia("(max-width: 600px)");
        let vollbild = false;
        const unterZeigen = () => {
          const eigen = !!spur && spur.mode === "hidden";
          unter.hidden = !eigen;
          unter.textContent = eigen ? Array.from(spur.activeCues || []).map((c) => String(c.text).replace(/<[^>]+>/g, "").replace(/\s*\n\s*/g, " ")).join(" ") : "";
        };
        const unterModus = () => { if (!spur) return; spur.mode = schmal.matches && !vollbild ? "hidden" : "showing"; unterZeigen(); };
        if (spur) {
          spur.addEventListener("cuechange", unterZeigen);
          video.addEventListener("loadedmetadata", unterModus);
          const vb = (an) => () => { vollbild = an; unterModus(); };
          video.addEventListener("webkitbeginfullscreen", vb(true)); video.addEventListener("webkitendfullscreen", vb(false));
          const aufModus = () => { if (!video.isConnected) { schmal.removeEventListener("change", aufModus); document.removeEventListener("fullscreenchange", aufVoll); return; } unterModus(); };
          const aufVoll = () => { if (!video.isConnected) { document.removeEventListener("fullscreenchange", aufVoll); return; } vollbild = !!document.fullscreenElement && document.fullscreenElement.contains(video); unterModus(); };
          schmal.addEventListener("change", aufModus); document.addEventListener("fullscreenchange", aufVoll);
          unterModus();
        }
        const kopf = h("div", { class: "video" + (kap.length ? "" : " leer") },
          h("div", { class: "spieler-spalte" }, h("div", { class: "spieler" }, video), unter), kap.length ? h("ol", { class: "kapitel", "aria-label": "Kapitel" }, kap) : null);
        // Kennzeichnung nach KI-Verordnung (Art. 50): zentral fuer jedes Video, nicht je Datei
        const teile = [kopf, h("p", { class: "video-ki" }, icon("audio-lines"),
          h("span", null, "Sprecherstimme KI-erzeugt. Mehr dazu unter ", h("a", { href: "/lizenzen" }, "Lizenzen und Quellen"), "."))];
        if (reihe) {
          teile.push(h("ol", { class: "folgen", "aria-label": "Folgen der Reihe" }, fertig.map((f, j) => h("li", null,
            h("button", { type: "button", "aria-current": j === i ? "true" : "false", onclick: () => zeigen(j, true) },
              h("span", { class: "nr" }, "Folge " + (ids.indexOf(f.id) + 1) + " von " + ids.length), h("span", { class: "ti" }, f.titel),
              h("span", { class: "du" }, mmss(f.dauer_s || 0)))))));
          if (offen > 0) teile.push(h("p", { class: "folgen-info" }, offen === 1 ? "Eine weitere Folge ist in Arbeit." : offen + " weitere Folgen sind in Arbeit."));
        }
        // Die Folgen enden mit "Mehr dazu auf der Seite ...": Der Verweis meint diese Seite, darum sagt der Hinweis, wo es weitergeht
        teile.splice(1, 0, h("p", { class: "video-ki video-weiter" }, icon("arrow-down"),
          h("span", null, "Der Verweis am Ende der Folge meint diese Seite: Unten stehen die Abschnitte zur Folge, mit Bildern und zum Ausprobieren.")));
        flaeche.replaceChildren(...teile);
        video.addEventListener("timeupdate", () => {
          const knoepfe = $$(".kapitel button", flaeche);
          let aktiv = -1;
          knoepfe.forEach((b, j) => { if (video.currentTime >= Number(b.dataset.t) - 0.2) aktiv = j; });
          knoepfe.forEach((b, j) => b.setAttribute("aria-current", j === aktiv ? "true" : "false"));
        });
        if (abspielen) video.play().catch(() => {});
      };
      zeigen(0, false);
    });
    return wrap;
  }

  /* ------------------------------------------------------------ Beispiel-Katalog */
  let beispieleP = null;
  function beispiele() {
    if (!beispieleP) beispieleP = fetch("/static/beispiele/manifest.json", { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : { usecases: [] })).catch(() => ({ usecases: [] }));
    return beispieleP;
  }

  /* ------------------------------------------------------------ Navigation und Verlauf */
  /* ---- Lernplattform: Fortschritt, Wege und Pfade. Alles bleibt im Browser (localStorage, jeweils in try/catch). */
  const speicherLesen = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const speicherSchreiben = (k, v) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* ohne Speicher */ } };
  /* Fortschritt (kl-gelesen, kl-zuletzt) liegt nur nach ausdruecklicher Einwilligung im Browser (kl-merken = "1", nie vorbelegt).
     Ohne Einwilligung lebt er nur im Arbeitsspeicher der Seite bis zum Neuladen. Die gewaehlte Rolle (kl-weg) ist eine ausdrueckliche Wahl und darf gespeichert werden. */
  let merken = speicherLesen("kl-merken") === "1";
  if (!merken) { speicherSchreiben("kl-gelesen", null); speicherSchreiben("kl-zuletzt", null); }      // Altbestand ohne Einwilligung bereinigen
  const fortschrittSchreiben = (k, v) => { if (merken || v == null) speicherSchreiben(k, v); };
  let gelesen = new Set();
  try { const l = JSON.parse(speicherLesen("kl-gelesen") || "[]"); if (Array.isArray(l)) gelesen = new Set(l.filter((x) => typeof x === "string")); } catch (e) { /* leer */ }
  let zuletzt = null;                  // { id, y }: zuletzt geoeffnete Seite und Stelle (Anteil 0 bis 1)
  try { const z = JSON.parse(speicherLesen("kl-zuletzt") || "null"); if (z && typeof z.id === "string") zuletzt = { id: z.id, y: Math.max(0, Math.min(1, Number(z.y) || 0)) }; } catch (e) { /* leer */ }
  let aktuelleId = null;
  let scrollZiel = null;               // { id, y }: "Weiter, wo du aufgehört hast" stellt die Stelle wieder her
  const MIN_LESEDAUER = 5000;          // ms: das Seitenende zaehlt erst nach dieser Zeit (reines Durchscrollen zaehlt nicht)
  const zaehlbar = (id) => { const sd = INHALT.seiten[id]; return !!sd && sd.typ !== "start" && !sd.versteckt && sd.status !== "bald"; };
  const alleSeiten = () => Object.keys(INHALT.seiten).filter(zaehlbar);
  function fortschritt() {
    const alle = alleSeiten();
    const n = alle.filter((id) => gelesen.has(id)).length;
    return { n, von: alle.length, prozent: alle.length ? Math.round(n / alle.length * 100) : 0 };
  }
  function gelesenMerken(id) {
    if (!zaehlbar(id) || gelesen.has(id)) return;
    gelesen.add(id);
    fortschrittSchreiben("kl-gelesen", JSON.stringify([...gelesen]));
    fortschrittZeigen();
  }
  function zuletztSpeichern() { if (zuletzt) fortschrittSchreiben("kl-zuletzt", JSON.stringify(zuletzt)); }
  /** Einwilligung zum Merken des Fortschritts: an schreibt den aktuellen Stand, aus leert beide Eintraege (die laufende Ansicht behaelt ihn bis zum Neuladen). */
  function merkenSetzen(an) {
    merken = !!an;
    speicherSchreiben("kl-merken", merken ? "1" : null);
    if (!merken) speicherSchreiben("kl-hilfe", null); else if (hilfeImSpeicher) speicherSchreiben("kl-hilfe", "1");
    if (merken) { speicherSchreiben("kl-gelesen", JSON.stringify([...gelesen])); zuletztSpeichern(); }
    else { speicherSchreiben("kl-gelesen", null); speicherSchreiben("kl-zuletzt", null); }
    for (const b of $$(".merken-schalter")) { b.setAttribute("aria-checked", String(merken)); const t = $(".merken-zustand", b); if (t) t.textContent = merken ? "an" : "aus"; }
    if (aktuelleId === "start") route(window.scrollY);
  }
  function fortschrittLoeschen() {
    gelesen = new Set(); zuletzt = null;
    speicherSchreiben("kl-gelesen", null); speicherSchreiben("kl-zuletzt", null);
    fortschrittZeigen();
    if (aktuelleId === "start") route(window.scrollY);
  }
  /** Haken im Menue, Gruppenzaehler, Prozent und Balken auf dem Stand halten. */
  function fortschrittZeigen() {
    const f = fortschritt();
    for (const el of $$(".fs-text")) {
      const kurz = !!el.closest(".nav-fortschritt");                                   // Menue: eine Zeile
      el.textContent = f.n ? f.prozent + " Prozent gelesen" + (kurz ? "" : " (" + f.n + " von " + f.von + " Seiten)") : "Noch nichts gelesen" + (kurz ? "" : " (" + f.von + " Seiten)");
    }
    for (const b of $$(".fs-balken")) { b.setAttribute("aria-valuenow", String(f.prozent)); const i = $("i", b); if (i) i.style.width = f.prozent + "%"; }
    for (const a of $$(".nav")) { const ok = $(".ok", a); if (ok) ok.hidden = !(gelesen.has(a.dataset.id) && a.dataset.id !== "start"); }
    for (const gr of navGruppen) {
      const ids = gr.ids || [];
      const n = ids.filter((id) => gelesen.has(id)).length;
      if (gr.zahl) { gr.zahl.textContent = n ? n + " von " + ids.length : ""; gr.zahl.hidden = !n; }
    }
  }

  /* Lesezeit: aus der Wortzahl. Kurz = Lead, Ueberschriften, Kernsaetze, Merksaetze; genau = der ganze Text. */
  const WORTE_PRO_MIN = 190;
  const woerter = (t) => { const k = klar(t || ""); return k ? k.split(" ").length : 0; };
  const lesezeitCache = new Map();
  function lesezeit(sd) {
    if (lesezeitCache.has(sd)) return lesezeitCache.get(sd);
    let kurz = woerter(sd.kurz), genau = kurz;
    for (const a of sd.abschnitte || []) {
      const quelle = (a.p && a.p[0]) || (a.alltag && [].concat(a.alltag)[0]) || a.merke || (a.liste && a.liste[0]) || "";
      kurz += woerter(a.h) + woerter(a.kurz || ersterSatz(quelle));
      genau += woerter(a.h) + woerter(a.kurz);
      for (const p of a.p || []) genau += woerter(p);
      for (const l of a.liste || []) genau += woerter(l);
      for (const t of [].concat(a.alltag || [])) genau += woerter(t);
      genau += woerter(a.merke);
      if (a.tabelle) for (const z of a.tabelle.zeilen || []) for (const c of z) genau += woerter(c);
    }
    for (const m of sd.mitnehmen || []) { kurz += woerter(m); genau += woerter(m); }
    if (sd.business) { kurz += woerter(ersterSatz(sd.business.text)); genau += woerter(sd.business.text); }
    for (const g of sd.grenzen || []) genau += woerter(g);
    const min = (w) => Math.max(1, Math.round(w / WORTE_PRO_MIN));
    const r = { kompakt: min(kurz), ausfuehrlich: 0 };
    r.ausfuehrlich = Math.max(r.kompakt, min(genau));
    lesezeitCache.set(sd, r);
    return r;
  }
  /* Zeitangaben: EINE Rechnung fuer Startkarten, Pfadkarten, Schritt-Listen und Seitenkopf.
     Lesen = Wortzahl durch 190 je Minute, im gewaehlten Lesemodus (kompakt oder genau). Das Video steht getrennt dabei (Laenge aus dem Videokatalog),
     ebenso ein Labor (pauschal 3 Minuten). Quiz und Aufgaben sind nicht eingerechnet. */
  const LABOR_MIN = 3;
  const videoDauer = new Map();                            // Video-ID -> Sekunden, gefuellt nach dem Laden des Videokatalogs (Seiten kommen nachgeladen, darum erst beim Rechnen zusammengezaehlt)
  const zeitFelder = [];                                   // { el, fn }: Textfelder, die sich bei Lesemodus und Videokatalog neu beschriften
  const lesemodusZeit = () => (lesemodus === "ausfuehrlich" ? "ausfuehrlich" : "kompakt");
  function seitenZeit(id) {
    const sd = INHALT.seiten[id];
    if (!sd) return { lesen: 0, video: 0, labor: 0 };
    const lz = lesezeit(sd);
    const vids = sd.videos || (sd.video ? [sd.video] : []);
    return { lesen: (sd.abschnitte || []).length ? lz[lesemodusZeit()] : 0, video: Math.round(vids.reduce((n, v) => n + (videoDauer.get(v) || 0), 0)), labor: sd.widget || sd.demo ? LABOR_MIN : 0 };
  }
  /** Minuten Lesen fuer eine Liste von Seiten (im gewaehlten Lesemodus). */
  const lesenMinuten = (ids) => [].concat(ids).reduce((n, id) => n + seitenZeit(id).lesen, 0);
  /** Einheitlicher Wortlaut: "ca. 9 Min Lesen, plus Video 1:30, plus Labor ca. 3 Min". Mehrere Seiten werden zusammengezaehlt. */
  function zeitText(ids) {
    const z = [].concat(ids).map(seitenZeit);
    const lesen = z.reduce((n, x) => n + x.lesen, 0), video = z.reduce((n, x) => n + x.video, 0), labor = z.reduce((n, x) => n + x.labor, 0);
    const teile = [];
    if (lesen) teile.push("ca. " + lesen + " Min Lesen");
    if (video) teile.push((teile.length ? "plus " : "") + "Video " + mmss(video));
    if (labor) teile.push((teile.length ? "plus " : "") + "Labor ca. " + labor + " Min");
    return teile.join(", ") || "ca. 1 Min";
  }
  /** Textfeld, das immer zeitText(ids) zeigt (vor und nach sind feste Textteile davor und dahinter). */
  function zeitFeld(ids, vor, nach, klasse) {
    const fn = () => (vor || "") + zeitText(ids) + (nach ? nach() : "");
    const el = h("span", { class: klasse || null }, fn());
    zeitFelder.push({ el, fn });
    return el;
  }
  function zeitenAktualisieren() {
    for (let i = zeitFelder.length - 1; i >= 0; i--) {
      const f = zeitFelder[i];
      if (f.el.isConnected) { f.sah = true; f.el.textContent = f.fn(); }
      else if (f.sah) zeitFelder.splice(i, 1);           // Seite gewechselt: Feld ist weg
    }
  }
  manifestP.then((m) => {
    for (const v of m.videos || []) if (v && v.id && v.dauer_s) videoDauer.set(v.id, v.dauer_s);
    zeitenAktualisieren();
  });

  /* Wege (Rollen): freiwillig, nie ein Alterstor. Gewaehlt = localStorage kl-weg (ein Wort). Aus dem Link /?weg=schule gilt der Weg nur
     in dieser Sitzung im Speicher der Seite, ohne etwas abzulegen. */
  const WEGE = {
    schule: { name: "Schule", ich: "in der Schule", symbol: "graduation-cap", titel: "Ich bin Schüler:in", kurz: "Experimente, leicht erklärt", satz: "KI im Alltag verstehen, ohne Kamera und ohne Anmeldung.",
      lead: "Kurze Texte, Beispiele aus dem Alltag und Aufgaben, alles ohne Kamera und Mikrofon. Labore, die eine Kamera brauchen, sind im Menü gekennzeichnet. Sie bleiben erreichbar.", lesemodus: "kompakt" },
    lehrende: { name: "Unterricht", ich: "Lehrende", symbol: "presentation", titel: "Ich unterrichte", kurz: "Themen und Material für Lehrende", satz: "Material für den Unterricht und Informationen für Schulleitung und Eltern.",
      lead: "Für Unterricht und Ausbildung: ein Klassenlink, die Kurzinfo zum Datenschutz und die Seiten, mit denen deine Klasse arbeitet. Ausführlich lesen ist hier voreingestellt.", lesemodus: "ausfuehrlich" },
    erwachsene: { name: "KI verstehen", ich: "neugierig", symbol: "sparkles", titel: "Ich will KI verstehen", kurz: "Die Grundlagen, Schritt für Schritt", satz: "KI in 30 Minuten verstehen, ohne Vorwissen.",
      lead: "Der kürzeste Weg durch die Grundideen: kurze Texte, viel zum Ausprobieren, wenig Fachwörter.", lesemodus: "kompakt" },
    technik: { name: "IT und Technik", ich: "in der IT", symbol: "wrench", titel: "Ich arbeite in der IT", kurz: "Technik, Modelle, selbst aufbauen", satz: "Selbst bauen: Rechner, Modelle, Dokumentensuche und Agenten.",
      lead: "Vom Rechner dahinter über Lernen und Netze bis zu Dokumentensuche und Agenten. Hier darf es ausführlich sein, die Details sind aufgeklappt.", lesemodus: "ausfuehrlich" },
    beruf: { name: "Beruf und Betrieb", ich: "im Beruf", symbol: "briefcase", titel: "Ich entscheide im Betrieb", kurz: "Anwendungsfälle, Kosten, Grenzen", satz: "Was KI im Betrieb bringt, was sie kostet und wo ihre Grenzen liegen.",
      lead: "Der Entscheider-Pfad in 15 Minuten, dazu Kosten, Betrieb und Beispiele aus Branchen. Wie ausführlich du liest, stellst du selbst ein.", lesemodus: null },
    eltern: { name: "Eltern", ich: "Elternteil", symbol: "users", titel: "Ich bin Elternteil", kurz: "Sicher und verständlich", satz: "Was Kinder mit KI machen, worauf du achten kannst und wie du mitreden kannst.",
      lead: "Kurz und ohne Fachwörter: wie KI im Schulalltag und zu Hause vorkommt, was mit Daten passiert und woran du Erfundenes erkennst.", lesemodus: "kompakt" },
  };
  const WEG_ALIAS = { neugierig: "erwachsene" };          // alter Name: /?weg=neugierig und ein frueher gespeichertes kl-weg gelten weiter
  const wegNorm = (w) => (typeof w === "string" && eigen(WEG_ALIAS, w) ? WEG_ALIAS[w] : w);
  const wegGueltig = (w) => typeof w === "string" && (eigen(WEGE, w) || eigen(WEG_ALIAS, w));
  let wegGespeichert = null, wegUrl = null;
  { const w = speicherLesen("kl-weg"); if (wegGueltig(w)) wegGespeichert = wegNorm(w); }
  const aktiverWeg = () => wegUrl || wegGespeichert;
  const kameraSeiten = () => new Set(INHALT.kameraSeiten || []);
  const kameraHinweis = "braucht Kamera, im Unterricht nicht nötig";
  const imSchulweg = (id) => aktiverWeg() === "schule" && kameraSeiten().has(id);
  /** Pfade mit nur bekannten Seiten (ids). Weniger als zwei Seiten: der Pfad fehlt noch und bleibt unsichtbar. */
  function pfadeListe() {
    return (INHALT.lernpfade || []).map((p) => Object.assign({}, p, { ids: (p.seiten || []).filter(zaehlbar) })).filter((p) => p.ids.length >= 2);
  }
  function pfadNaechste(p) {
    if (zuletzt && p.ids.includes(zuletzt.id) && !gelesen.has(zuletzt.id)) return zuletzt.id;
    return p.ids.find((id) => !gelesen.has(id)) || null;
  }
  /** Wohin "Weiter" fuehrt: zuletzt geoeffnete, noch nicht gelesene Seite, sonst die naechste im Pfad des Weges, sonst irgendeine offene. */
  function weiterZiel() {
    if (zuletzt && zaehlbar(zuletzt.id) && !gelesen.has(zuletzt.id)) return { id: zuletzt.id, art: "zuletzt" };
    const w = aktiverWeg();
    const alle = pfadeListe();
    for (const p of [...alle.filter((x) => w && x.rolle === w), ...alle]) { const n = pfadNaechste(p); if (n) return { id: n, art: "pfad", pfad: p }; }
    const rest = alleSeiten().find((id) => !gelesen.has(id));
    return rest ? { id: rest, art: "rest" } : null;
  }
  let navGruppen = [];
  function navOffenLesen() {
    try { return new Set(JSON.parse(localStorage.getItem("kl-nav-offen") || "[]")); } catch (e) { return new Set(); }
  }
  function navOffenSchreiben(menge) {
    try { localStorage.setItem("kl-nav-offen", JSON.stringify([...menge])); } catch (e) { /* ohne Speicher */ }
  }
  function gruppeOeffnen(gr, offen, merken) {
    gr.kopf.setAttribute("aria-expanded", offen ? "true" : "false");
    gr.liste.hidden = !offen;
    if (merken) {
      const m = navOffenLesen();
      if (offen) m.add(gr.name); else m.delete(gr.name);
      navOffenSchreiben(m);
    }
  }
  /* ---- Suche: Volltext ueber alle Seiten, Glossarbegriffe, Suchwoerter (Synonyme) und Vorschlaege bei leerem Treffer */
  const norm = (t) => String(t).toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
  let suchIndex = null;
  /** Text fuer die Suche: klein, ohne Umlaute, Satzzeichen als Leerzeichen, Leerzeichen vorn und hinten (so lassen sich Wortanfaenge pruefen). */
  const suchText = (t) => " " + norm(t).replace(/[^a-z0-9]+/g, " ").trim() + " ";
  function suchIndexBauen() {
    const seiten = {};
    for (const [id, sd] of Object.entries(INHALT.seiten)) {
      if (sd.versteckt) continue;       // versteckte Seiten sind erreichbar, aber nicht auffindbar
      const t = [];
      for (const a of sd.abschnitte || []) {
        t.push(a.h, a.kurz || "", ...(a.p || []), ...(a.liste || []), ...[].concat(a.alltag || []), a.merke || "");
        if (a.tabelle) for (const z of a.tabelle.zeilen || []) t.push(...z);
      }
      t.push(...(sd.mitnehmen || []), (sd.business && sd.business.text) || "", ...(sd.grenzen || []), ...(sd.lernziele || []));
      for (const p of sd.pfad || []) t.push(p.h, p.p);
      seiten[id] = { titel: suchText(klar((sd.nav || "") + " " + sd.titel)), kurz: suchText(klar(sd.kurz || "")), text: suchText(klar(t.join(" "))), roh: JSON.stringify(sd) };
    }
    const begriffe = Object.entries(INHALT.glossar).map(([k, g]) => ({ k, titel: g[0], t: suchText(g[0]), erkl: suchText(g[1]) }));
    return { seiten, begriffe };
  }
  /** Zerlegt die Eingabe in Suchwoerter. Jedes Wort darf durch seine Synonyme ersetzt werden (ChatGPT findet Chat, Foto findet Bild);
   *  steht die ganze Eingabe als Wortgruppe in INHALT.synonyme ("fake news", "wer haftet"), gilt sie als ein Wort.
   *  Ein Synonym "=seiten-id" lenkt gezielt auf eine Seite; die Reihenfolge in der Liste ist die Rangfolge. */
  const STOPPWOERTER = new Set(["am", "im", "in", "an", "auf", "der", "die", "das", "den", "dem", "ein", "eine", "und", "oder", "zu", "zum", "zur", "von", "mit", "fuer", "ist", "wie", "was", "wer", "wo", "kann"]);
  function suchWoerter(text) {
    const syn = INHALT.synonyme || {};
    const hole = (w) => syn[w] || syn[w.replace(/-/g, "")] || syn[w.replace(/-/g, " ")] || [];
    const voll = norm(text).trim().replace(/\s+/g, " ");
    if (!voll) return [];
    const gruppe = hole(voll);
    if (gruppe.length && /[\s-]/.test(voll)) return [[voll].concat(gruppe).map(norm)];
    let woerter = voll.split(" ");
    const ohne = woerter.filter((w) => !STOPPWOERTER.has(w));
    if (ohne.length) woerter = ohne;
    return woerter.map((w) => [w].concat(hole(w)).map(norm));
  }
  /** Punkte einer Seite oder eines Begriffs. Je Suchwort zaehlt der beste Treffer: Wortanfang im Feld voll, mitten im Wort (nur bei Woertern ab 5 Buchstaben)
   *  nur zu 30 Prozent, Synonyme zu 60 Prozent; "=id" bringt 24 minus 2 je Listenplatz, wenn es die Seite selbst ist. Alle Suchwoerter muessen treffen. */
  function suchPunkte(q, felder, id) {
    let summe = 0;
    for (const alt of q) {
      let best = 0;
      alt.forEach((a, i) => {
        if (a[0] === "=") { if (id && a.slice(1) === id) best = Math.max(best, 24 - 2 * i); return; }
        const wort = a.replace(/[^a-z0-9]+/g, " ").trim();
        if (!wort) return;
        const faktor = i ? 0.6 : 1;
        for (const [text, gewicht] of felder) {
          if (text.includes(" " + wort)) best = Math.max(best, gewicht * faktor);
          else if (wort.length > 4 && text.includes(wort)) best = Math.max(best, gewicht * faktor * 0.3);
        }
      });
      if (!best) return 0;
      summe += best;
    }
    return summe;
  }
  function distanz(a, b) {
    const m = a.length, n = b.length;
    let vor = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const jetzt = [i];
      for (let j = 1; j <= n; j++) jetzt[j] = Math.min(vor[j] + 1, jetzt[j - 1] + 1, vor[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      vor = jetzt;
    }
    return vor[n];
  }
  /** "Meintest du ...": aehnlich geschriebene Seiten- und Begriffsnamen. */
  function aehnliche(text) {
    const kand = new Map();
    for (const sd of Object.values(INHALT.seiten)) if (!sd.versteckt) kand.set(norm(sd.nav || sd.titel), sd.nav || sd.titel);
    for (const g of Object.values(INHALT.glossar)) kand.set(norm(g[0]), g[0]);
    const gefunden = [];
    for (const w of norm(text).trim().split(/\s+/).filter((x) => x.length >= 4)) {
      for (const [k, anzeige] of kand) {
        for (const teil of k.split(/[\s\-/()]+/)) {
          if (teil.length >= 4 && distanz(w, teil) <= Math.max(1, Math.floor(w.length / 4)) && !gefunden.includes(anzeige)) gefunden.push(anzeige);
        }
      }
    }
    return gefunden.slice(0, 3);
  }
  function suchErgebnisBlock(text, begriffe, treffer) {
    const box = $("#such-ergebnis");
    if (!box) return;
    box.replaceChildren();
    box.hidden = !text.trim();
    if (!text.trim()) return;
    const eingeben = (t) => { const i = $("#nav-suche"); if (i) { i.value = t; navSuche(t); i.focus(); } };
    if (begriffe.length) {
      box.append(h("h3", { class: "such-kopf" }, "Begriff erklärt"));
      for (const b of begriffe.slice(0, 3)) {
        const seiten = Object.entries(suchIndex.seiten).filter(([, v]) => v.roh.includes("[[" + b.k + "]]") || v.roh.includes("[[" + b.k + "|")).slice(0, 3);
        box.append(h("div", { class: "such-begriff" }, h("b", null, b.titel), h("p", null, INHALT.glossar[b.k][1]),
          seiten.length ? h("p", { class: "such-wo" }, "Mehr dazu: ", seiten.map(([id], i) => [i ? ", " : "", h("a", { href: adresse(id) }, INHALT.seiten[id].nav || INHALT.seiten[id].titel)])) : null));
      }
    }
    if (!treffer && !begriffe.length) {
      const nah = aehnliche(text);
      box.append(h("div", { class: "such-leer" }, h("p", null, h("b", null, "Dazu habe ich nichts gefunden.")),
        nah.length ? h("p", null, "Meintest du:") : null,
        nah.length ? h("div", { class: "such-chips" }, nah.map((n) => h("button", { type: "button", class: "chip", onclick: () => eingeben(n) }, n))) : null,
        h("p", null, "Probiere zum Beispiel:"),
        h("div", { class: "such-chips" }, (INHALT.sucheVorschlaege || ["Chat", "Datenschutz", "Bilder"]).map((n) => h("button", { type: "button", class: "chip", onclick: () => eingeben(n) }, n)))));
    }
  }
  function navSuche(text) {
    if (!suchIndex && text.trim()) suchIndex = suchIndexBauen();
    const q = suchWoerter(text);
    const gespeichert = navOffenLesen();
    // Punkte je Seite; nur deutliche Treffer bleiben (ein Titel- oder Zieltreffer verdraengt Zufallsfunde im Fliesstext)
    const punkte = new Map();
    let beste = 0;
    if (q.length) {
      for (const gr of navGruppen) if (!gr.sammel) for (const a of gr.eintraege) {
        const ix = suchIndex.seiten[a.id];
        const p = ix ? suchPunkte(q, a.id === "start" ? [[ix.titel, 8]] : [[ix.titel, 8], [ix.kurz, 3], [ix.text, 1]], a.id) : 0;
        punkte.set(a, p);
        beste = Math.max(beste, p);
      }
    }
    const grenze = Math.max(1, beste * 0.12);
    let treffer = 0;
    for (const gr of navGruppen) {
      if (gr.sammel) { gr.sec.hidden = true; continue; }                       // Sammelgruppen doppeln nur Seiten: in der Suche aus
      let inGruppe = 0;
      gr.beste = 0;
      for (const a of gr.eintraege) {
        const p = q.length ? punkte.get(a) || 0 : 1;
        const ok = p >= grenze;
        a.p = q.length ? p : 0;
        a.el.hidden = !ok;
        if (ok) { inGruppe++; gr.beste = Math.max(gr.beste, p); }
      }
      treffer += inGruppe;
      if (q.length) {
        gr.sec.hidden = inGruppe === 0;
        gr.liste.hidden = inGruppe === 0;
        gr.kopf.setAttribute("aria-expanded", inGruppe ? "true" : "false");
      } else {
        gr.sec.hidden = !!gr.verborgen;
        const aktiv = gr.eintraege.some((x) => x.el.getAttribute("aria-current") === "page");
        const offen = gespeichert.has(gr.name) || aktiv;
        gr.liste.hidden = !offen;
        gr.kopf.setAttribute("aria-expanded", offen ? "true" : "false");
      }
    }
    // Reihenfolge: bester Treffer zuerst (Gruppen und Seiten darin); ohne Suche wieder wie im Menue
    const nav = $("#nav-liste"), leerEl = $("#nav-leer");
    const sortiert = q.length && treffer;
    const gruppen = sortiert ? navGruppen.filter((g) => !g.sammel).map((g, i) => [g, i]).sort((x, y) => y[0].beste - x[0].beste || x[1] - y[1]).map(([g]) => g) : navGruppen;
    for (const gr of navGruppen) {
      if (gr.sammel) continue;
      const eintraege = sortiert ? gr.eintraege.map((e, i) => [e, i]).sort((x, y) => y[0].p - x[0].p || x[1] - y[1]).map(([e]) => e) : gr.eintraege;
      gr.liste.append(...eintraege.map((e) => e.el));
    }
    if (alle) {
      // Suche: "Fuer dich" weg, "Alle Bereiche" offen; ohne Suche wieder wie zuvor
      fuerDich.sec.hidden = !!q.length;
      alle.kopf.hidden = !!q.length;
      alleOeffnen(q.length ? true : alle.offen, false);
      alle.inhalt.append(...(sortiert ? gruppen : navGruppen).map((g) => g.sec));
    }
    if (nav) {
      if (leerEl) nav.append(leerEl);
      if (q.length) nav.scrollTop = 0;
    }
    // Begriffskarten: nur wenn der Begriff selbst gemeint ist (Treffer im Namen); der Erklaertext allein zaehlt nur, wenn keine Seite passt
    const begriffe = q.length
      ? suchIndex.begriffe.map((b) => [b, suchPunkte(q, [[b.t, 6], [b.erkl, 1]])]).filter(([, p]) => p >= 3 || (!treffer && p > 0)).sort((a, b) => b[1] - a[1]).map(([b]) => b)
      : [];
    suchErgebnisBlock(text, begriffe, treffer);
    if (leerEl) leerEl.hidden = true;
  }
  /* Pfeiltasten im Menue: hoch und runter springen durch Gruppen und Seiten, rechts oeffnet eine Gruppe, links schliesst sie bzw. springt zur Gruppe */
  function navTasten(e) {
    const k = e.key;
    if (!["ArrowDown", "ArrowUp", "Home", "End", "ArrowRight", "ArrowLeft"].includes(k)) return;
    const el = e.target.closest && e.target.closest(".navkopf, a.nav");
    if (!el) return;
    const sichtbar = $$(".navkopf, a.nav", $("#nav-liste")).filter((x) => !x.closest("[hidden]") && !x.hidden);
    const i = sichtbar.indexOf(el);
    const gr = navGruppen.find((g) => g.kopf === el);
    let ziel = null;
    if (alle && el === alle.kopf && (k === "ArrowRight" || k === "ArrowLeft")) {
      const auf = k === "ArrowRight";
      if ((alle.kopf.getAttribute("aria-expanded") === "true") !== auf) { alleOeffnen(auf); e.preventDefault(); return; }
      if (auf) ziel = sichtbar[i + 1];
    }
    if (k === "ArrowDown") ziel = sichtbar[Math.min(sichtbar.length - 1, i + 1)];
    else if (k === "ArrowUp") ziel = sichtbar[Math.max(0, i - 1)];
    else if (k === "Home") ziel = sichtbar[0];
    else if (k === "End") ziel = sichtbar[sichtbar.length - 1];
    else if (k === "ArrowRight" && !ziel && gr) {
      if (gr.kopf.getAttribute("aria-expanded") !== "true") { gruppeOeffnen(gr, true, true); ziel = el; }
      else ziel = sichtbar[i + 1];
    } else if (k === "ArrowLeft" && !(alle && el === alle.kopf)) {
      if (gr) { if (gr.kopf.getAttribute("aria-expanded") === "true") { gruppeOeffnen(gr, false, true); ziel = el; } }
      else { const g2 = navGruppen.find((g) => g.eintraege.some((x) => x.el === el)); if (g2) ziel = g2.kopf; }
    }
    if (ziel) { e.preventDefault(); ziel.focus(); }
  }
  // Handy und schmale Fenster: Die Navigation klappt als Menue unter der Kopfleiste auf (CSS ab 960 px).
  function menueSchalten(auf) {
    const offen = typeof auf === "boolean" ? auf : !document.body.classList.contains("menue-offen");
    document.body.classList.toggle("menue-offen", offen);
    const k = $(".menueknopf");
    if (k) { k.setAttribute("aria-expanded", String(offen)); k.setAttribute("aria-label", offen ? "Menü schließen" : "Menü öffnen"); k.replaceChildren(icon(offen ? "x" : "menu")); }
  }
  function menueKnopf() {
    return h("button", { type: "button", class: "menueknopf", "aria-expanded": "false", "aria-controls": "nav-liste", "aria-label": "Menü öffnen", onclick: () => menueSchalten() }, icon("menu"));
  }
  document.addEventListener("click", (e) => { if (e.target.closest && e.target.closest("a.nav")) menueSchalten(false); });
  // "Zum Inhalt springen": Fokus in den Hauptbereich (vor dem Start heisst er "vorab", danach "inhalt")
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a.skip");
    if (!a) return;
    e.preventDefault();
    const m = $("#inhalt") || $("#vorab");
    if (m) { m.focus(); m.scrollIntoView({ block: "start" }); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("menue-offen")) menueSchalten(false); });

  /* Menue: Suche, "Fuer dich" (je Rolle hoechstens sechs Seiten, offen) und der zugeklappte Block "Alle Bereiche" (Akkordeon der Gruppen).
     Ohne Rolle steht statt "Fuer dich" der "Einstieg": Start, Neu hier, In 15 Minuten. */
  let fuerDich = null, alle = null;
  /** Ein Menueeintrag (Link) fuer eine Seite. */
  function navEintrag(id) {
    const s = INHALT.seiten[id];
    // Leerzeichen vor dem Zusatz, damit auch der reine Text "Bilder erzeugen in Arbeit" lautet (nicht "Bilder erzeugenbald")
    const el = h("a", { class: "nav", href: adresse(id), dataset: { id } }, icon(s.symbol), h("span", { class: "nav-text" }, s.nav || s.titel, kameraSeiten().has(id) ? h("small", { class: "kam", hidden: true }, kameraHinweis) : null),
      s.anfaenger ? [" ", h("span", { class: "einst" }, "Einsteiger")] : null,
      s.status === "bald" ? [" ", h("span", { class: "bald" }, "in Arbeit")] : h("span", { class: "ok", hidden: true }, icon("check")));
    return { el, id, haystack: ((s.nav || "") + " " + s.titel + " " + (s.kurz || "")).toLowerCase() };
  }
  /** Eintrag, der zu einem Abschnitt der Startseite fuehrt (Neu hier, In 15 Minuten). */
  function navAnker(symbol, text, anker) {
    return h("a", { class: "nav", href: "/#" + anker, onclick: (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      if (aktuelleId !== "start") navigiere({ id: "start", query: "" });
      setTimeout(() => zuAbschnitt(anker), 60);
    } }, icon(symbol), h("span", { class: "nav-text" }, text));
  }
  function alleOeffnen(auf, merken) {
    if (!alle) return;
    alle.kopf.setAttribute("aria-expanded", auf ? "true" : "false");
    alle.inhalt.hidden = !auf;
    if (merken !== false) alle.offen = auf;
  }
  /** "Fuer dich" bzw. "Einstieg" je nach Weg neu aufbauen und die Gruppen in der Reihenfolge der Rolle ordnen. */
  function navAnordnen() {
    if (!fuerDich || !alle) return;
    const w = aktiverWeg();
    const M = INHALT.menue || { fuerDich: {}, reihenfolge: {}, sammel: {} };
    fuerDich.titel.textContent = w ? "Für dich" : "Einstieg";
    const eintraege = [navEintrag("start").el];
    if (w) for (const id of (M.fuerDich[w] || []).filter(gibt).slice(0, 12)) eintraege.push(navEintrag(id).el);
    else {
      const st = INHALT.seiten.start;
      eintraege.push(navAnker("smile", "Neu hier", "anfangen"), navAnker("briefcase", ((st.entscheider && st.entscheider.titel) || "In 15 Minuten").split(":")[0], "entscheider"));
    }
    fuerDich.liste.replaceChildren(...eintraege);
    const reihe = (w && M.reihenfolge[w]) || [];
    const rang = (g) => { const i = reihe.indexOf(g.name); return i < 0 ? 99 : i; };
    for (const gr of navGruppen) gr.verborgen = gr.name === "Start" || (gr.sammel && !reihe.includes(gr.name));
    navGruppen.sort((x, y) => rang(x) - rang(y) || x.nr - y.nr);
    alle.inhalt.append(...navGruppen.map((g) => g.sec));
    for (const gr of navGruppen) gr.sec.hidden = !!gr.verborgen;
    navKennzeichnen();
    fortschrittZeigen();
    if (aktuelleId) navMarkieren(aktuelleId);
  }
  function navBauen() {
    const suche = h("div", { class: "navsuche" }, icon("search"),
      h("input", { type: "search", id: "nav-suche", placeholder: "Seiten suchen", "aria-label": "Seiten suchen", autocomplete: "off",
        oninput: (e) => { navSuche(e.target.value); if (e.target.value) menueSchalten(true); },
        onkeydown: (e) => { if (e.key === "Escape") { e.target.value = ""; navSuche(""); } } }));
    const nav = h("nav", { class: "navscroll", id: "nav-liste", "aria-label": "Lernpfad" });
    nav.addEventListener("keydown", navTasten);
    nav.append(fortschrittLeiste("nav-fortschritt"), h("div", { id: "such-ergebnis", class: "such-ergebnis", "aria-live": "polite", hidden: true }));
    navGruppen = [];
    const gespeichert = navOffenLesen();
    const bauen = (name, seiten, sammel, nr) => {
      const liste = h("div", { class: "navliste" });
      const zahl = h("span", { class: "gr-zahl", hidden: true });
      const kopf = h("button", { type: "button", class: "navkopf", "aria-expanded": "true" }, h("span", null, name, zahl), icon("chevron"));
      const sec = h("div", { class: "navgruppe" }, h("h2", null, kopf), liste);
      const gr = { name, sec, kopf, liste, eintraege: [], zahl, ids: seiten.filter(zaehlbar), sammel, nr };
      for (const id of seiten) { const e = navEintrag(id); liste.append(e.el); gr.eintraege.push(e); }
      kopf.addEventListener("click", () => gruppeOeffnen(gr, kopf.getAttribute("aria-expanded") !== "true", true));
      gruppeOeffnen(gr, gespeichert.has(name), false);     // Voreinstellung: nur die vom Besucher geoeffneten Gruppen; die der aktuellen Seite folgt in navMarkieren
      navGruppen.push(gr);
    };
    let nr = 0;
    for (const g of INHALT.gruppen) if (g.seiten.length) bauen(g.name, g.seiten, false, nr++);
    for (const [name, ids] of Object.entries((INHALT.menue && INHALT.menue.sammel) || {})) bauen(name, ids.filter(gibt), true, nr++);
    fuerDich = { titel: h("h2", { class: "nav-titel" }, "Für dich"), liste: h("div", { class: "navliste" }) };
    fuerDich.sec = h("div", { class: "navgruppe nav-fuerdich" }, fuerDich.titel, fuerDich.liste);
    const kopf = h("button", { type: "button", class: "navkopf nav-alle", "aria-expanded": "false", "aria-controls": "nav-alle-inhalt" }, h("span", null, "Alle Bereiche"), icon("chevron"));
    const inhalt = h("div", { class: "nav-alle-inhalt", id: "nav-alle-inhalt", hidden: true });
    alle = { kopf, inhalt, offen: false, sec: h("div", { class: "navgruppe nav-alle-block" }, h("h2", null, kopf), inhalt) };
    kopf.addEventListener("click", () => alleOeffnen(kopf.getAttribute("aria-expanded") !== "true"));
    nav.append(fuerDich.sec, alle.sec, h("p", { id: "nav-leer", class: "nav-leer", hidden: true }, "Keine Seite gefunden."));
    const f = document.createDocumentFragment();
    f.append(suche, nav);
    return f;
  }
  /** Fortschritt als Text mit Balken (Menue oben und Karte "Weiter" auf der Startseite). */
  function fortschrittLeiste(klasse) {
    const balken = h("div", { class: "fs-balken", role: "progressbar", "aria-label": "Dein Fortschritt", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": "0" }, h("i"));
    return h("section", { class: "fs " + (klasse || ""), "aria-label": "Fortschritt" }, h("span", { class: "fs-text" }), balken);
  }
  /** Im Weg "Schule": Labore mit Kamera oder Mikrofon im Menue kennzeichnen (sie bleiben erreichbar). */
  function navKennzeichnen() {
    const kam = kameraSeiten();
    const an = aktiverWeg() === "schule";
    for (const a of $$(".nav")) { const k = $(".kam", a); if (k) k.hidden = !(an && kam.has(a.dataset.id)); }
  }
  function navMarkieren(id) {
    $$(".nav").forEach((a) => {
      const ist = a.dataset.id === id;
      if (ist) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      const ok = $(".ok", a);
      if (ok) ok.hidden = !(gelesen.has(a.dataset.id) && a.dataset.id !== "start");
    });
    const suche = $("#nav-suche");
    const sucht = !!(suche && suche.value.trim());
    if (id === "start") alleOeffnen(false);
    else if (id && fuerDich && !fuerDich.liste.querySelector('a.nav[data-id="' + id + '"]') && navGruppen.some((g) => !g.sammel && g.eintraege.some((x) => x.id === id)) && !sucht) alleOeffnen(true);
    for (const gr of navGruppen) {
      if (!gr.sammel && gr.eintraege.some((x) => x.id === id) && !sucht && id !== "start" && alle && !alle.inhalt.hidden) gruppeOeffnen(gr, true, false);
    }
    const ak = $('.nav[aria-current="page"]');
    if (ak && ak.scrollIntoView) ak.scrollIntoView({ block: "nearest" });
  }

  /* ------------------------------------------------------------ Schieber: Fuellung der Spur (--p in Prozent) */
  function schieberFuellen(wurzel) {
    const liste = wurzel.matches && wurzel.matches("input[type=range]") ? [wurzel] : $$("input[type=range]", wurzel);
    for (const r of liste) {
      const mi = parseFloat(r.min || "0"), ma = parseFloat(r.max || "100"), v = parseFloat(r.value);
      r.style.setProperty("--p", String(ma > mi ? Math.max(0, Math.min(100, (v - mi) / (ma - mi) * 100)) : 0));
    }
  }
  document.addEventListener("input", (e) => { if (e.target.matches && e.target.matches("input[type=range]")) schieberFuellen(e.target); }, true);
  (function () {   // Wert per Skript gesetzt (Zuruecksetzen, Voreinstellungen): Fuellung folgt
    const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    if (!d || !d.set) return;
    Object.defineProperty(HTMLInputElement.prototype, "value", { configurable: true, enumerable: d.enumerable, get: d.get,
      set(v) { d.set.call(this, v); if (this.type === "range") schieberFuellen(this); } });
  })();

  /* ------------------------------------------------------------ Seiten */
  let montiert = [];
  let aktuelleAbfrage = {};
  function aufraeumen() {
    for (const m of montiert) { try { m && m.destroy && m.destroy(); } catch (e) { console.error(e); } }
    montiert = [];
  }
  function baustein(art, name, seite, titel, symbol) {
    const reg = (window.KL[art] || {})[name];
    const root = h("div", { class: "flaeche pad" });
    const block = h("section", { class: "block", id: "ausprobieren" }, h("h2", null, icon(symbol || "play"), titel), root);
    if (!reg) {
      root.append(h("p", { class: "erklaerung" }, h("span", { class: "chip warn" }, "Baustein folgt"),
        " Der interaktive Teil dieser Seite ist noch in Arbeit. Die Erklärung darunter gilt schon."));
    } else {
      try { montiert.push(reg(root, seite)); } catch (e) { console.error(e); root.append(h("p", { class: "erklaerung" }, "Der Baustein konnte nicht starten: " + e.message)); }
    }
    return block;
  }
  /** Codeblock mit Kopier-Knopf (Abschnittsfeld code). Text nur per textContent, nie als HTML. */
  function codeBlock(c) {
    const st = "margin:0;padding:12px 14px;overflow-x:auto;font:14px/1.5 var(--mono);background:var(--flaeche2);color:var(--text);border-radius:0 0 10px 10px;white-space:pre;tab-size:2";
    const status = h("span", { role: "status", "aria-live": "polite", style: "font-size:14px;color:var(--leise)" });
    let zurueck = 0;
    const knopf = h("button", { type: "button", class: "btn klein", style: "min-height:44px;min-width:44px;display:inline-flex;align-items:center;gap:6px", onclick: async () => {
      try { await navigator.clipboard.writeText(c.text); status.textContent = "Kopiert."; }
      catch (e) {
        try {
          const t = h("textarea", { style: "position:fixed;opacity:0", "aria-hidden": "true" }); t.value = c.text; document.body.append(t); t.select();
          document.execCommand("copy"); t.remove(); status.textContent = "Kopiert.";
        } catch (e2) { status.textContent = "Nicht kopiert. Markiere den Text und kopiere ihn mit Strg+C."; }
      }
      clearTimeout(zurueck); zurueck = setTimeout(() => { status.textContent = ""; }, 2500);
    } }, icon("copy"), "Kopieren");
    const kopf = h("div", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:8px;justify-content:space-between;padding:4px 6px 4px 14px;background:var(--flaeche3);border-radius:10px 10px 0 0" },
      h("span", { style: "display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-size:15px" },
        h("b", null, c.titel || "Befehl"),
        c.sudo ? h("span", { class: "chip", style: "font-weight:600;color:var(--text);background:color-mix(in srgb,var(--orange) 22%,var(--flaeche))" }, "braucht sudo") : null),
      h("span", { style: "display:flex;align-items:center;gap:8px" }, status, knopf));
    const pre = h("pre", { style: st, tabindex: "0", role: "region", "aria-label": (c.titel || "Befehl") + ", Quelltext" }, h("code", { style: "background:none;padding:0;font-size:inherit" }, c.text));
    return h("div", { class: "codeblock", style: "margin:14px 0" }, kopf, c.sudo ? h("p", { class: "kurz", style: "margin:6px 0 0;font-size:15px" }, "Warum sudo: " + c.sudo) : null, pre);
  }
  function tabelleBlock(t) {
    return h("div", { class: "tabelle-wrap" }, h("table", { class: "vergleich" },
      t.beschriftung ? h("caption", null, t.beschriftung) : null,
      h("thead", null, h("tr", null, t.kopf.map((k) => h("th", { scope: "col", html: md(k) })))),
      h("tbody", null, t.zeilen.map((z) => h("tr", null, z.map((c, i) => h(i === 0 ? "th" : "td", { scope: i === 0 ? "row" : null, html: md(c) })))))));
  }
  function quizBlock(fragen, bei) {
    const richtig = new Set(), beantwortet = new Set();
    const ergebnis = h("p", { class: "quiz-ergebnis", "aria-live": "polite" });
    const felder = fragen.map((f, i) => {
      const name = "q" + i + "-" + Math.random().toString(36).slice(2, 7);
      const rueck = h("p", { class: "quiz-rueck", "aria-live": "polite" });
      const fs = h("fieldset", { class: "quiz-frage" }, h("legend", null, f.frage));
      f.optionen.forEach((o, j) => {
        const id = name + "-" + j;
        const inp = h("input", { type: "radio", name, id, value: String(j) });
        inp.addEventListener("change", () => {
          if (beantwortet.has(i)) return;
          beantwortet.add(i);
          const ok = j === f.richtig;
          if (ok) richtig.add(i);
          $$("label", fs).forEach((l, k) => { l.classList.toggle("richtig", k === f.richtig); l.classList.toggle("falsch", k === j && !ok); });
          $$("input", fs).forEach((x) => { x.disabled = true; });
          rueck.textContent = (ok ? "Richtig. " : "Nicht ganz. ") + f.erklaerung;
          if (beantwortet.size === fragen.length) { ergebnis.textContent = richtig.size + " von " + fragen.length + " richtig."; if (bei) bei(); }
        });
        fs.append(h("label", { for: id }, inp, h("span", null, o)));
      });
      fs.append(rueck);
      return fs;
    });
    return h("section", { class: "block quiz" }, h("h2", null, icon("check"), "Teste dich"), h("div", { class: "flaeche pad" }, felder, ergebnis));
  }
  /* ------------------------------------------------------------ Lesemodus (Kompakt | Ausfuehrlich) */
  const MODI = ["kompakt", "ausfuehrlich"];
  let lesemodus = "kompakt";
  let lesemodusGemerkt = false;          // true, sobald du selbst umgeschaltet hast: dann gilt deine Wahl vor dem Standard des Weges
  { const m = speicherLesen("kl-lesemodus"); if (MODI.includes(m)) { lesemodus = m; lesemodusGemerkt = true; } }
  document.documentElement.dataset.lesemodus = lesemodus;
  function lesemodusSetzen(m) {
    if (!MODI.includes(m)) return;
    lesemodusGemerkt = true;
    speicherSchreiben("kl-lesemodus", m);
    lesemodusAnwenden(m);
  }
  /** Standard-Lesemodus des Weges (Schule: kurz), solange du selbst nichts eingestellt hast. Wird nicht gespeichert. */
  function wegLesemodus() {
    if (lesemodusGemerkt) return;
    const w = WEGE[aktiverWeg()];
    const ziel = w && w.lesemodus ? w.lesemodus : "kompakt";
    if (ziel !== lesemodus) lesemodusAnwenden(ziel);
  }
  function lesemodusAnwenden(m) {
    lesemodus = m;
    document.documentElement.dataset.lesemodus = m;
    for (const d of $$("details.mehr")) d.open = m === "ausfuehrlich";
    for (const b of $$(".lesemodus button")) b.setAttribute("aria-pressed", b.dataset.modus === m ? "true" : "false");
    for (const g of $$(".lesemodus")) g.style.setProperty("--i", String(MODI.indexOf(m)));
    for (const t of $$(".lese-hilfe-text")) t.textContent = leseHilfe(m);
    zeitenAktualisieren();
  }
  /** Erklaert in einem Satz, was der Umschalter tut (steht unter der Seitenueberschrift und als Tooltip). */
  function leseHilfe(m) {
    return m === "ausfuehrlich"
      ? "Du liest gerade genau: Alle Erklärungen sind aufgeklappt. Mit „Kurz lesen“ oben rechts bleiben nur die Kernsätze."
      : "Du liest gerade kurz: Du siehst die Kernsätze. Mit „Mehr dazu“ klappst du Einzelnes auf, mit „Genau lesen“ oben rechts alles. Unterstrichene Begriffe mit ? kannst du antippen, dann erscheint eine Erklärung.";
  }
  function lesemodusSchalter() {
    const knopf = (m, text, tipp) => h("button", { type: "button", dataset: { modus: m }, title: tipp, "aria-pressed": lesemodus === m ? "true" : "false", onclick: () => lesemodusSetzen(m) }, text);
    const gruppe = h("div", { class: "lesemodus", role: "group", "aria-label": "Wie möchtest du lesen?" },
      knopf("kompakt", "Kurz lesen", "Kurz lesen: nur die Kernsätze, Einzelnes lässt sich aufklappen"),
      knopf("ausfuehrlich", "Genau lesen", "Genau lesen: alle Erklärungen sind gleich aufgeklappt"));
    gruppe.style.setProperty("--i", String(MODI.indexOf(lesemodus)));
    gruppe.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const ziel = e.key === "ArrowRight" ? "ausfuehrlich" : "kompakt";
      lesemodusSetzen(ziel);
      const b = $('button[data-modus="' + ziel + '"]', gruppe); if (b) b.focus();
    });
    return gruppe;
  }
  /* ------------------------------------------------------------ "Mit Mathe": Formeln nur auf Wunsch (Abschnittsfeld mathe) */
  let mathe = speicherLesen("kl-mathe") === "1";
  document.documentElement.dataset.mathe = mathe ? "an" : "aus";
  function matheSetzen(an) {
    mathe = !!an;
    document.documentElement.dataset.mathe = mathe ? "an" : "aus";
    speicherSchreiben("kl-mathe", mathe ? "1" : null);
    for (const b of $$(".mathe-schalter")) b.setAttribute("aria-checked", String(mathe));
  }
  function matheSchalter() {
    return h("button", { type: "button", class: "mathe-schalter", role: "switch", "aria-checked": String(mathe), onclick: () => matheSetzen(!mathe),
      title: "Blendet bei manchen Abschnitten die Rechnung mit Formeln ein" }, icon("sigma"), h("span", null, "Mit Mathe"), h("span", { class: "mathe-knopf", "aria-hidden": "true" }));
  }
  /* ------------------------------------------------------------ Wege: Auswahl merken, anwenden, anzeigen */
  function wegWaehlen(w) {              // w: Schluessel oder null (Auswahl aufheben); gewaehlt heisst gespeichert, nur im Browser
    wegUrl = null;
    wegGespeichert = wegGueltig(w) ? wegNorm(w) : null;
    speicherSchreiben("kl-weg", wegGespeichert);
    wegAnwenden(true);
  }
  function wegAnwenden(neuZeichnen) {
    wegLesemodus();
    navAnordnen();
    chipZeigen();
    if (neuZeichnen && aktuelleId === "start") route(window.scrollY);
  }
  /** Kleiner Hinweis "Rollenname wie im Fenster (z. B. "Ich will KI verstehen)" in der Kopfzeile; Antippen fuehrt zur Auswahl auf der Startseite. */
  function wegChip(klasse) {
    return h("button", { type: "button", class: "weg-chip " + klasse, hidden: true, onclick: wegAendern }, icon("user-round"), h("b"));
  }
  function chipZeigen() {
    const w = aktiverWeg();
    for (const c of $$(".weg-chip")) {
      c.hidden = !w;
      if (!w) continue;
      $("b", c).textContent = WEGE[w].titel;           // wie im Willkommens-Fenster ("Ich will KI verstehen")
      c.title = (wegUrl ? "Dieser Weg kommt aus dem Link und wird nicht gespeichert. " : "") + "Tippen, um den Weg zu ändern";
      c.setAttribute("aria-label", WEGE[w].titel + ". Weg ändern");
    }
  }
  function wegAendern() {
    if (window.KL && window.KL.willkommen) { window.KL.willkommen.oeffnen({ aendern: true }); return; }   // dasselbe Fenster wie beim Erstbesuch
    if (aktuelleId !== "start") navigiere({ id: "start", query: "" });
    zuAbschnitt("weg");
  }
  /* ------------------------------------------------------------ Werkzeugleiste (Glas) */
  const leiste = { el: null, titel: null, rechts: null, chip: null, schalter: null };
  const schmal = window.matchMedia("(max-width:960px)");
  function leisteBauen() {
    leiste.titel = h("span", { class: "leiste-titel", "aria-hidden": "true" });
    leiste.chip = wegChip("weg-chip-leiste");
    leiste.rechts = h("div", { class: "leiste-rechts" }, leiste.chip);
    leiste.el = h("div", { class: "leiste" }, h("div", { class: "leiste-in" }, leiste.titel, leiste.rechts));
    return leiste.el;
  }
  let leisteH1 = null;
  function leisteStand() {
    if (!leiste.el) return;
    leiste.el.classList.toggle("scharf", window.scrollY > 4);
    leiste.el.classList.toggle("titel-an", !!leisteH1 && leisteH1.getBoundingClientRect().bottom < 64);
  }
  window.addEventListener("scroll", () => requestAnimationFrame(leisteStand), { passive: true });
  /** Am Handy steht der Lesemodus-Schalter in der Zeile "Zur Startseite" (eine Zeile statt zwei); die leere Leiste entfaellt. */
  function schalterPlatzieren() {
    if (!leiste.el) return;
    const zeile = $(".zurueck-zeile");
    if (leiste.schalter) { if (schmal.matches && zeile) zeile.append(leiste.schalter); else leiste.rechts.append(leiste.schalter); }
    leiste.el.classList.toggle("leer", schmal.matches && !(leiste.schalter && leiste.rechts.contains(leiste.schalter)));
  }
  if (schmal.addEventListener) schmal.addEventListener("change", schalterPlatzieren);
  /** Setzt Titel und optional den Lesemodus-Schalter der Werkzeugleiste fuer die aktuelle Seite. */
  function leisteSetzen(titel, mitLesemodus) {
    leiste.titel.textContent = titel || "";
    leiste.schalter = mitLesemodus ? lesemodusSchalter() : null;
    leiste.rechts.replaceChildren(leiste.chip, ...(leiste.schalter ? [leiste.schalter] : []));
    schalterPlatzieren();
    chipZeigen();
    leisteH1 = $("#inhalt h1");
    leisteStand();
  }

  /* ------------------------------------------------------------ Hero: eine Komponente fuer jede Seite */
  /** o: { symbol, ueber, titel, lead, kennzahlen: [Knoten], unten: Knoten, gross } */
  function hero(o) {
    return h("header", { class: "hero" + (o.gross ? " gross" : "") },
      o.ohneIcon ? null : h("div", { class: "hero-icon", "aria-hidden": "true" }, icon(o.symbol || "info")),
      o.ueber ? h("p", { class: "ueber" }, o.ueber) : null,
      h("h1", null, o.titel),
      o.leadMd ? h("p", { class: "lead", html: md(o.leadMd) }) : h("p", { class: "lead" }, o.lead),
      o.kennzahlen && o.kennzahlen.length ? h("div", { class: "kennzahlen" }, o.kennzahlen) : null,
      o.unten || null);
  }
  const kennzahl = (symbol, text) => h("span", { class: "kennzahl" }, icon(symbol), text);
  function kennzahlenFuer(seite) {
    const z = [];
    const vids = seite.videos || (seite.video ? [seite.video] : []);
    if (vids.length) z.push(kennzahl("play", vids.length > 1 ? vids.length + " Videos" : "Video"));
    if (seite.widget) z.push(kennzahl("sliders-horizontal", "Zum Ausprobieren"));
    if (seite.demo) z.push(kennzahl("live", "Live-Demo"));
    const n = (seite.abschnitte || []).length;
    if (n) z.push(kennzahl("book-open", n + (n === 1 ? " Abschnitt" : " Abschnitte")));
    if (seite.quiz && seite.quiz.length) z.push(kennzahl("check", seite.quiz.length + (seite.quiz.length === 1 ? " Quizfrage" : " Quizfragen")));
    if (seite.business) z.push(kennzahl("business", "Mit Praxisbezug"));
    if (seite.anfaenger) z.unshift(kennzahl("smile", "Für Einsteiger"));
    return z;
  }
  /** Markierungen aus content.js in reinen Text wandeln. */
  function klar(t) {
    return String(t)
      .replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, k, a) => a || (INHALT.glossar[k] ? INHALT.glossar[k][0] : k))
      .replace(/\{\{([a-z0-9-]+)(?:\?[a-z0-9_=&-]+)?\|([^}]+)\}\}/g, "$2")
      .replace(LINK_RE, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/\s+/g, " ").trim();
  }
  const KUERZEL = new Set(["z", "b", "h", "d", "u", "a", "o", "s", "v", "bzw", "ca", "ggf", "usw", "vgl", "nr", "abb", "evtl", "etc", "inkl", "max", "min", "sog", "dr", "prof", "bspw"]);
  /** Erster Satz (ohne Abkuerzungspunkte) als reiner Text, hoechstens 140 Zeichen. */
  function ersterSatz(text, grenze = 140) {
    const t = klar(text);
    let ende = t.length;
    const re = /[.!?](?=\s|$)/g;
    let m;
    while ((m = re.exec(t))) {
      const wort = (t.slice(0, m.index).match(/([A-Za-zÄÖÜäöüß]+|\d+)$/) || [""])[0].toLowerCase();
      if (m[0] === "." && (KUERZEL.has(wort) || /^\d+$/.test(wort))) continue;
      ende = m.index + 1; break;
    }
    let satz = t.slice(0, ende);
    if (satz.length > grenze) {
      const k = satz.slice(0, grenze - 1);
      satz = k.slice(0, Math.max(k.lastIndexOf(" "), 40)).replace(/[,;:.\s]+$/, "") + "…";
    }
    return satz;
  }
  /** Aufklapper "Mehr dazu": in Kompakt zu, in Ausfuehrlich offen und ohne sichtbare Zusammenfassung. */
  function mehrBlock(kinder, titel) {
    const d = h("details", { class: "mehr" }, h("summary", null, icon("chevron"), titel || "Mehr dazu"), h("div", { class: "mehr-in" }, kinder));
    d.open = lesemodus === "ausfuehrlich";
    return d;
  }
  /** Der Lesehinweis ("Du liest gerade kurz ...") erscheint nur einmal: mit Einwilligung (kl-merken) pro Browser, sonst pro Sitzung (sessionStorage). */
  function hilfeSchonGesehen() {
    try { return merken ? localStorage.getItem("kl-hilfe") === "1" : sessionStorage.getItem("kl-hilfe") === "1"; } catch (e) { return hilfeImSpeicher; }
  }
  let hilfeImSpeicher = false;
  function hilfeMerken() {
    hilfeImSpeicher = true;
    try { if (merken) localStorage.setItem("kl-hilfe", "1"); else sessionStorage.setItem("kl-hilfe", "1"); } catch (e) { /* nur bis zum Neuladen */ }
  }
  function abschnitte(seite) {
    const out = h("div", { class: "text" });
    if ((seite.abschnitte || []).length && !hilfeSchonGesehen()) { out.append(h("p", { class: "lese-hilfe" }, icon("info"), h("span", { class: "lese-hilfe-text" }, leseHilfe(lesemodus)))); hilfeMerken(); }
    if ((seite.abschnitte || []).some((x) => x.mathe && x.mathe.p && x.mathe.p.length)) out.append(h("div", { class: "mathe-zeile" }, matheSchalter()));
    for (const a of seite.abschnitte || []) {
      const sec = h("section", { class: "abschnitt", id: a.id || null }, h("h2", { class: "abs" }, a.h));
      if (a.visual && window.KL.visual) {
        const bild = window.KL.visual(a.visual);
        if (bild) sec.append(bild);
      }
      const quelle = (a.p && a.p[0]) || (a.alltag && [].concat(a.alltag)[0]) || a.merke || (a.liste && a.liste[0]) || "";
      if (a.kurz) sec.append(h("p", { class: "kurz", html: md(a.kurz) }));
      else if (quelle) sec.append(h("p", { class: "kurz auto" }, ersterSatz(quelle)));
      const mehr = [];
      for (const p of a.p || []) mehr.push(h("p", { html: md(p) }));
      if (a.liste) mehr.push(h("ul", null, a.liste.map((l) => h("li", { html: md(l) }))));
      for (const c of a.code || []) mehr.push(codeBlock(c));
      if (a.tabelle) mehr.push(tabelleBlock(a.tabelle));
      if (a.alltag) mehr.push(h("aside", { class: "alltag" }, h("b", null, "Beispiel aus dem Alltag"),
        [].concat(a.alltag).map((t) => h("p", { html: md(t) }))));
      if (a.merke) mehr.push(h("aside", { class: "merke" }, h("b", null, "Merke"), h("p", { html: md(a.merke) })));
      if (mehr.length) sec.append(mehrBlock(mehr));
      // "Mit Mathe": steht ausserhalb des Aufklappers, damit der Schalter in jedem Lesemodus wirkt; ohne Schalter bleibt es ausgeblendet (CSS)
      if (a.mathe && a.mathe.p && a.mathe.p.length) sec.append(h("aside", { class: "mathe" }, h("b", null, icon("sigma"), "Mit Mathe"), a.mathe.p.map((t) => h("p", { html: md(t) }))));
      out.append(sec);
    }
    return out;
  }
  /** Checkliste "In 3 Schritten bei dir" (Use-Case-Seiten: seite.dreiSchritte). Haken sind nur zum Abhaken, nichts wird gespeichert. */
  function dreiSchritteBlock(schritte) {
    if (!schritte || !schritte.length) return null;
    const liste = h("ol", { class: "drei-schritte" }, schritte.map((t, i) => {
      const id = "ds-" + i;
      return h("li", null, h("input", { type: "checkbox", id }), h("label", { for: id }, h("span", { class: "nr", "aria-hidden": "true" }, String(i + 1)), h("span", { html: md(t) })));
    }));
    return h("section", { class: "block drei" }, h("h2", null, icon("list-checks"), "In 3 Schritten bei dir"),
      h("div", { class: "flaeche pad" }, h("p", { class: "drei-lead" }, "Eine Checkliste für den Anfang. Hake ab, was du erledigt hast."), liste));
  }
  function weiterBlock(ids) {
    if (!ids || !ids.length) return null;
    return h("section", { class: "block" }, h("h2", null, icon("arrow"), "Weiter geht es"),
      h("div", { class: "weiter" }, ids.map((id) => { const s = INHALT.seiten[id]; return s ? h("a", { href: "#/" + id }, icon(s.symbol), s.titel) : null; })));
  }
  /** Statuschip in Klartext: bereit, viel los oder noch keine Verbindung (ohne Fachwoerter). */
  function statusSatz(d) {
    if (!d || !d.frisch) return "Der Rechner meldet sich gleich.";
    const w = d.warteschlange || {};
    if (w.parallel && (w.aktiv >= w.parallel || w.wartend > 0)) return "Gerade viel los: Es laufen schon Fragen. Bei Chat und Dokumenten kann es etwas dauern.";
    return "Der Rechner ist bereit und frei. Gerade zu " + (d.gpu_pct ?? 0) + " Prozent ausgelastet.";
  }
  function zuAbschnitt(id) {
    const z = document.getElementById(id);
    if (!z) return;
    const dd = z.closest("details"); if (dd) dd.open = true;           // Abschnitte unter "Weitere Wege" erst aufklappen
    const ruhig = matchMedia("(prefers-reduced-motion: reduce)").matches;
    z.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
    const k = $("h2", z); if (k) { k.setAttribute("tabindex", "-1"); k.focus({ preventScroll: true }); }
  }
  /** Zeilenliste im Einstellungs-Stil: Nummer, Titel, Satz, Pfeil. Jede Zeile ist ein Link. */
  function schrittListe(eintraege, besuchtZeigen) {
    return h("ol", { class: "start-schritte" }, eintraege.map((e, i) => {
      const sd = INHALT.seiten[e.id];
      if (!sd) return null;
      return h("li", null, h("a", { href: adresse(e.id) },
        h("span", { class: "nummer", "aria-hidden": "true" }, String(i + 1)),
        h("span", { class: "start-text" }, h("b", null, e.h), e.p ? h("span", { html: md(e.p) }) : null,
          zeitFeld(e.id, "", null, "start-min")),
        besuchtZeigen && gelesen.has(e.id) ? h("span", { class: "ok", title: "schon gelesen" }, icon("check")) : null,
        icon("chevron")));
    }));
  }
  /** Karte: Kopfzeile (Kicker), Titel, ein Satz und der Fuss mit Angabe, Balken und Knopf. Der Fuss liegt unten, damit Knoepfe und Balken
      in einer Zeile stehen. o: { symbol, kicker, titel, text, meta, balken (0 bis 100), balkenLabel, href, knopf, extern, fertig, fuss, klasse, dataset } */
  function karte(o) {
    const fuss = [];
    if (o.meta) fuss.push(h("p", { class: "karte-meta" }, o.meta));
    if (o.balken != null) {
      const i = h("i"); i.style.width = o.balken + "%";
      fuss.push(h("div", { class: "pf-balken", role: "progressbar", "aria-label": o.balkenLabel || "Fortschritt", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(o.balken) }, i));
    }
    if (o.fuss) fuss.push(...[].concat(o.fuss));
    if (o.fertig) fuss.push(h("p", { class: "pfad-fertig" }, icon("check"), "Pfad geschafft"));
    else if (o.href) fuss.push(h("a", { class: "btn primary klein", href: o.href, rel: o.extern ? "noopener noreferrer" : null, target: o.extern ? "_blank" : null, onclick: o.onclick || null }, o.knopf || "Öffnen", icon(o.extern ? "external-link" : "chevron")));
    return h("article", { class: "karte" + (o.klasse ? " " + o.klasse : ""), dataset: o.dataset || null },
      h("p", { class: "karte-kicker" }, o.symbol ? icon(o.symbol) : null, h("span", null, o.kicker || "")),
      h("h3", { class: "karte-titel" }, o.titel),
      h("p", { class: "karte-text" }, o.text || ""),
      h("div", { class: "karte-fuss" }, fuss));
  }
  /** Karte zu einer Seite des Labors (opt: { satz, h, kicker, knopf }). */
  function seitenKarte(id, opt) {
    const sd = INHALT.seiten[id], o = opt || {};
    const gel = gelesen.has(id);
    return karte({ symbol: sd.symbol, kicker: o.kicker || (sd.typ === "labor" ? "Labor" : sd.widget || sd.demo ? "Zum Ausprobieren" : "Lektion"),
      titel: o.h || sd.nav || sd.titel, text: o.satz || ersterSatz(sd.kurz || "", 100),
      meta: zeitFeld(id, "", gel ? () => ", gelesen" : null), href: adresse(id), knopf: o.knopf || (gel ? "Noch einmal ansehen" : "Öffnen"), dataset: { seite: id } });
  }
  /** Raster der Labore ohne Kamera (INHALT.experimente, content-experimente.js): Start der Rolle Schule und Seite "Experimente". */
  function experimenteRaster(max) {
    const liste = (INHALT.experimente || []).filter((e) => gibt(e.id)).slice(0, max || 99);
    return h("div", { class: "karten karten-3 experimente" }, liste.map((e) => karte({ symbol: e.symbol, kicker: e.hinweis || "Ohne Kamera", titel: e.titel, text: e.satz,
      meta: zeitFeld(e.id), href: adresse(e.id), knopf: "Starten", dataset: { seite: e.id } })));
  }
  /** Karte eines Lernpfades: Stufe oder Rolle, Umfang, Fortschritt, "Weiter" und die Seitenliste. */
  function pfadKarte(p) {
    const n = p.ids.filter((id) => gelesen.has(id)).length;
    const next = pfadNaechste(p);
    const anteil = Math.round(n / p.ids.length * 100);
    const tag = p.stufe ? "Stufe " + p.stufe + " von 4" : (WEGE[p.rolle] ? WEGE[p.rolle].name : "Pfad");
    const liste = h("ol", { class: "pfad-seiten" }, p.ids.map((id) => {
      const sd = INHALT.seiten[id];
      const gel = gelesen.has(id);
      return h("li", null, h("a", { href: adresse(id) },
        h("span", { class: "pfad-haken" + (gel ? " an" : ""), "aria-hidden": "true" }, gel ? icon("check") : null),
        h("span", null, sd.nav || sd.titel, imSchulweg(id) ? h("small", { class: "kam" }, kameraHinweis) : null),
        gel ? h("span", { class: "sr-nur" }, " (gelesen)") : null));
    }));
    const k = karte({ kicker: tag, titel: p.name, text: p.kurz, meta: zeitFeld(p.ids, p.ids.length + " Schritte, ", () => ", " + n + " gelesen"),
      balken: anteil, balkenLabel: "Fortschritt im Pfad " + p.name, href: next ? adresse(next) : null, knopf: n ? "Weiter im Pfad" : "Pfad starten", fertig: !next, dataset: { pfad: p.id }, klasse: "pfad-karte" });
    k.append(h("details", { class: "pfad-liste" }, h("summary", null, icon("chevron"), "Alle " + p.ids.length + " Schritte"), liste));
    return k;
  }
  /** "Weiter, wo du aufgehört hast": nur wenn schon etwas gelesen oder geöffnet wurde. */
  function weiterKarte() {
    const f = fortschritt();
    if (!f.n && !(zuletzt && zaehlbar(zuletzt.id))) return null;
    const ziel = weiterZiel();
    const sd = ziel && INHALT.seiten[ziel.id];
    const text = !ziel ? "Du hast alle Seiten gelesen. Stöbere in den Pfaden oder wiederhole ein Quiz."
      : ziel.art === "zuletzt" ? "Du warst zuletzt bei „" + sd.titel + "“."
      : ziel.art === "pfad" ? "Als Nächstes im Pfad „" + ziel.pfad.name + "“: " + sd.titel + "."
      : "Noch nicht gelesen: " + sd.titel + ".";
    const loeschen = h("button", { type: "button", class: "textlink fs-loeschen", onclick: (e) => {
      const b = e.currentTarget;
      if (b.dataset.sicher) { fortschrittLoeschen(); return; }
      b.dataset.sicher = "1"; b.replaceChildren(icon("trash-2"), "Wirklich löschen? Noch einmal tippen");
    } }, icon("trash-2"), "Fortschritt löschen");
    return h("section", { class: "block weiter-karte", id: "weiter" },
      h("div", { class: "weiter-in" },
        h("div", { class: "weiter-text" }, h("h2", null, icon("play"), "Weiter, wo du aufgehört hast"), h("p", null, text), fortschrittLeiste()),
        ziel ? h("a", { class: "btn primary", href: adresse(ziel.id), onclick: () => { if (ziel.art === "zuletzt" && zuletzt) scrollZiel = { id: ziel.id, y: zuletzt.y }; } }, "Weiter lesen", icon("chevron")) : null),
      h("p", { class: "weiter-fuss" }, merken ? "Dein Fortschritt liegt nur in deinem Browser. " : "Dein Fortschritt gilt nur, solange diese Seite offen ist. ",
        merken ? null : h("button", { type: "button", class: "textlink", onclick: () => merkenSetzen(true) }, icon("save"), "In diesem Browser merken"), " ", loeschen));
  }
  /** Karte "Klassenlink": oeffnet die Seite im Schulweg, ohne dass auf dem Geraet etwas gespeichert wird. */
  function klassenLinkKarte() {
    const url = location.origin + "/?weg=schule";
    const feld = h("input", { type: "text", readonly: true, value: url, class: "klassenlink", "aria-label": "Klassenlink" });
    const status = h("span", { class: "klassenlink-status", role: "status" });
    const kopieren = async () => {
      try { await navigator.clipboard.writeText(url); status.textContent = "Link kopiert."; }
      catch (e) {
        feld.focus(); feld.select();
        try { document.execCommand("copy"); status.textContent = "Link kopiert."; } catch (e2) { status.textContent = "Der Link ist markiert. Kopiere ihn mit Strg+C oder durch langes Tippen."; }
      }
    };
    return karte({ symbol: "link", kicker: "Für deine Klasse", titel: "Klassenlink", text: "Öffnet den Schulweg. Auf den Geräten wird nichts gespeichert.", klasse: "klassen-karte",
      fuss: [feld, h("button", { type: "button", class: "btn primary klein", onclick: kopieren }, icon("copy"), "Link kopieren"), status] });
  }
  /** Rollenwahl: ohne Weg sechs Kacheln (freiwillig, keine Altersabfrage), mit Weg nur eine Zeile "Weg ändern". */
  function wegBlock() {
    const aktiv = aktiverWeg();
    if (aktiv) {
      return h("section", { class: "block weg-wahl weg-gewaehlt", id: "weg" },
        h("p", { class: "weg-fuss" }, h("span", null, "Dein Weg: ", h("b", null, WEGE[aktiv].titel)),
          h("button", { type: "button", class: "textlink", onclick: wegAendern }, icon("user-round"), "Weg ändern"),
          h("button", { type: "button", class: "textlink", onclick: () => wegWaehlen(null) }, wegUrl ? "Auswahl ignorieren" : "Auswahl aufheben"),
          wegUrl ? h("span", null, "Dieser Weg kommt aus dem Link und wird nicht gespeichert.") : null));
    }
    const kacheln = Object.entries(WEGE).map(([k, w]) => h("button", { type: "button", class: "weg-kachel", "aria-pressed": "false", dataset: { weg: k },
      onclick: () => wegWaehlen(k) },
      h("span", { class: "weg-ic", "aria-hidden": "true" }, icon(w.symbol)), h("span", { class: "weg-text" }, h("b", null, w.titel), h("span", null, w.satz))));
    return h("section", { class: "block weg-wahl", id: "weg" },
      h("h2", null, icon("compass"), "Wofür bist du hier?"),
      h("p", { class: "start-lead" }, "Freiwillig. Die Wahl ordnet nur diese Seite, nichts wird gesendet."),
      h("div", { class: "weg-kacheln karten karten-3" }, kacheln));
  }
  /** Erste Schritte: im Weg der Rolle die ersten drei Seiten des Rollenpfades, sonst die Voreinstellung aus content.js. */
  function anfangenFuer(seite) {
    const w = aktiverWeg();
    if (w && w !== "beruf") {
      const p = pfadeListe().find((x) => x.rolle === w);
      if (p) return p.ids.filter((id) => !(w === "schule" && kameraSeiten().has(id))).slice(0, 3).map((id) => ({ id, h: INHALT.seiten[id].titel, p: ersterSatz(INHALT.seiten[id].kurz || "") }));
    }
    return seite.anfangen;
  }
  /** Bloecke der Startseite je Rolle (INHALT.startRollen). */
  function startBlock(name, w, R, seite) {
    const kopf = (symbol, text, id) => h("h2", { id: id || null }, icon(symbol), text);
    if (name === "experimente") {
      return h("section", { class: "block", id: "experimente" }, kopf("flask-conical", "Zum Ausprobieren"), experimenteRaster(6),
        h("p", { class: "weg-fuss" }, h("a", { class: "textlink", href: "/experimente" }, "Alle Experimente", icon("chevron")),
          h("span", null, "Labore mit Kamera findest du unter „Alle Bereiche“. Im Unterricht brauchst du sie nicht.")));
    }
    if (name === "empfohlen") {
      const kand = (R.empfohlen || []).filter((e) => gibt(e.id) && zaehlbar(e.id));
      const pfadIds = ((pfadeListe().find((q) => q.rolle === R.pfad) || {}).ids) || [];      // gleiche Zaehlung wie "Schritt n von m" am Seitenende
      const wahl = [...kand.filter((e) => !gelesen.has(e.id)), ...kand.filter((e) => gelesen.has(e.id))].slice(0, 3);
      return h("section", { class: "block", id: "empfohlen" }, kopf("sparkles", "Empfohlen für dich"),
        h("div", { class: "karten karten-3" }, wahl.map((e) => seitenKarte(e.id, { satz: e.satz, h: e.h,
          kicker: R.pfad && pfadIds.includes(e.id) ? "Schritt " + (pfadIds.indexOf(e.id) + 1) + " von " + pfadIds.length : (/^uc-/.test(e.id) ? "Anwendungsfall" : null) }))));
    }
    if (name === "morgen") {
      const kand = (R.morgen || []).filter((e) => gibt(e.id));
      return h("section", { class: "block", id: "morgen" }, kopf("presentation", "Für morgen"),
        h("div", { class: "karten karten-3" }, [...kand.map((e) => seitenKarte(e.id, { satz: e.satz, kicker: e.id === "schule-lehrkraefte" ? "Handreichung" : e.id === "schule-schulleitung" ? "Für die Schulleitung" : e.id === "elternabend" ? "Für Eltern" : /^medien-/.test(e.id) ? "Medienkompetenz" : "KI-Reihe" })), klassenLinkKarte()]));
    }
    if (name === "minuten") {
      const e = seite.entscheider;
      const schrittIds = e.schritte.map((x) => x.id);
      return h("section", { class: "block", id: "entscheider" }, kopf("briefcase", "In 15 Minuten"),
        h("div", { class: "entscheider-box" }, h("p", { class: "start-lead" }, ersterSatz(e.lead)), schrittListe(e.schritte, true),
          h("div", { class: "entscheider-fuss" }, zeitFeld(schrittIds, "Zusammen: "),
            h("a", { class: "btn primary", href: adresse(e.schritte[0].id) }, "Mit Schritt 1 starten"))));
    }
    if (name === "repo" && R.repo) {
      const r = R.repo;
      return h("section", { class: "block", id: "repo" }, h("div", { class: "karten" }, karte({ symbol: "link", kicker: "Quellcode", titel: r.titel, text: r.satz, href: r.href, knopf: r.knopf, extern: true, klasse: "karte-breit" })));
    }
    return null;
  }
  function startSeite(seite) {
    const w = aktiverWeg();
    const R = (INHALT.startRollen || {})[w || "ohne"] || {};
    const punkt = h("span", { class: "punkt aus" });
    const stand = h("span", { class: "statuschip-text" }, statusSatz(null));
    const chip = h("div", { class: "statuschip glas", role: "status" }, punkt, stand);
    montiert.push({ destroy: stats.on((d) => { punkt.classList.toggle("aus", !d.frisch); stand.textContent = statusSatz(d); }) });
    const zuWeitere = (anker) => (e) => { e.preventDefault(); zuAbschnitt(anker); };
    const e = seite.entscheider;
    const schrittIds = e.schritte.map((x) => x.id);
    // Alles uebrige liegt unter "Weitere Wege" (zugeklappt)
    const sAnfangen = h("section", { class: "block", id: "anfangen" }, h("h2", null, icon("smile"), "Neu hier? So fängst du an"),
      h("p", { class: "start-lead" }, "Drei Schritte, ohne Vorwissen."), schrittListe(anfangenFuer(seite), true));
    const sEntscheider = w === "beruf" ? null : h("section", { class: "block", id: "entscheider" }, h("h2", null, icon("briefcase"), "In 15 Minuten"),
      h("div", { class: "entscheider-box" }, h("p", { class: "start-lead" }, ersterSatz(e.lead)), schrittListe(e.schritte, true),
        h("div", { class: "entscheider-fuss" }, zeitFeld(schrittIds, "Zusammen: "),
          h("a", { class: "btn primary", href: adresse(e.schritte[0].id) }, "Mit Schritt 1 starten"))));
    const pfade = pfadeListe();
    const stufen = pfade.filter((p) => p.stufe), rollen = pfade.filter((p) => p.rolle);
    const sPfade = pfade.length ? h("section", { class: "block", id: "lernpfade" }, h("h2", null, icon("route"), "Lernpfade"),
      h("p", { class: "start-lead" }, "Vier Stufen: Verstehen, Anwenden, Erstellen, Bewerten."),
      stufen.length ? [h("h3", { class: "pfad-gruppe" }, "Nach Stufe"), h("div", { class: "karten karten-2" }, stufen.map(pfadKarte))] : null,
      rollen.length ? [h("h3", { class: "pfad-gruppe" }, "Nach Rolle"), h("div", { class: "karten karten-2" }, rollen.map(pfadKarte))] : null) : null;
    const kacheln = [];
    for (const g of INHALT.gruppen) {
      if (!g.seiten.length || g.name === "Start") continue;
      const b = (seite.bereiche || {})[g.name] || {};
      const ziel = g.seiten[0];
      const satz = b.satz || (g.seiten.length === 1 ? ersterSatz(INHALT.seiten[ziel].kurz || "", 100) : g.seiten.slice(0, 3).map((id) => INHALT.seiten[id].nav || INHALT.seiten[id].titel).join(", "));
      kacheln.push(karte({ symbol: b.symbol || INHALT.seiten[ziel].symbol, kicker: g.seiten.length + (g.seiten.length === 1 ? " Seite" : " Seiten"), titel: g.name, text: satz, href: "/" + ziel, knopf: "Mehr erfahren" }));
    }
    const sBereiche = h("section", { class: "block", id: "bereiche" }, h("h2", null, icon("layers"), "Alle Bereiche"), h("div", { class: "karten karten-3" }, kacheln));
    const weitere = h("details", { class: "weitere", id: "weitere" },
      h("summary", null, icon("chevron"), h("span", null, "Weitere Wege"), h("small", null, "Rolle wählen, Lernpfade, alle Bereiche")),
      h("div", { class: "weitere-in" }, wegBlock(), sAnfangen, sEntscheider, sPfade, sBereiche));
    const einstiege = w ? null : h("section", { class: "block einstiege", id: "einstiege" },
      h("div", { class: "karten karten-3" },
        karte({ symbol: "smile", kicker: "Einstieg", titel: "Neu hier?", text: "Drei Schritte, ohne Vorwissen.", meta: zeitFeld(anfangenFuer(seite).map((x) => x.id)), href: "#anfangen", knopf: "Hier anfangen", onclick: zuWeitere("anfangen") }),
        karte({ symbol: "briefcase", kicker: "Für Entscheider", titel: "In 15 Minuten", text: "Was KI einem Betrieb bringt, in vier Seiten.", meta: zeitFeld(schrittIds), href: "#entscheider", knopf: "Überblick", onclick: zuWeitere("entscheider") }),
        karte({ symbol: "layers", kicker: "Orientierung", titel: "Alle Bereiche", text: "Alle Themen auf einen Blick.", meta: kacheln.length + " Bereiche", href: "#bereiche", knopf: "Ansehen", onclick: zuWeitere("bereiche") })),
      h("p", { class: "weg-fuss" }, h("button", { type: "button", class: "textlink", onclick: wegAendern }, icon("user-round"), "Für wen bist du hier? Weg wählen")));
    const fuss = h("section", { class: "block start-fuss" },
      h("div", { class: "hinweis" }, icon("shield-check"), h("p", null, h("strong", null, "Ist das sicher? "), ersterSatz(seite.datenschutz), " ", h("a", { href: "/sicherheit-einfach" }, "Mehr dazu"))),
      h("div", { class: "hinweis" }, icon("users"), h("p", null, h("strong", null, "Ab wann? "), INHALT.alterHinweis || "Kamera, Mikro und Gesicht ab 16 Jahren, Jüngere nur mit Einverständnis der Eltern, kein Alterscheck.")),
      h("div", { class: "hinweis" }, icon("cpu"), h("p", null, h("strong", null, "Was ist ein Jetson? "), ersterSatz(seite.jetson), " ", h("a", { href: "/hardware" }, "Mehr zum Rechner"))));
    return h("div", { class: "seitenbreite breit start" },
      hero({ ueber: w ? "KI-Labor · " + WEGE[w].name : "KI-Labor", titel: R.h1 || seite.titel, leadMd: R.satz || seite.kurz, lead: klar(R.satz || seite.kurz), gross: true, ohneIcon: true,
        kennzahlen: [kennzahl("badge-check", "Kostenlos"), kennzahl("user-check", "Ohne Anmeldung")], unten: h("div", { class: "hero-aktionen" }, chip) }),
      einstiege,
      weiterKarte(),
      ...(w ? (R.bloecke || []).map((b) => startBlock(b, w, R, seite)) : []),
      weitere,
      fuss);
  }
  /** Sichtbarer Zurueck-Knopf auf Unterseiten: einen Schritt zurueck, wenn man von einer Seite des Labors kommt, sonst zur Startseite. */
  function zurueckZeile() {
    const intern = !!(history.state && history.state.i > 0);
    return h("div", { class: "zurueck-zeile" }, h("a", { class: "zurueck", href: "/", onclick: (e) => { if (history.state && history.state.i > 0) { e.preventDefault(); history.back(); } } },
      icon("arrow-left"), intern ? "Zurück" : "Zur Startseite"));
  }
  /** Links zu Impressum und Datenschutzerklaerung (aus module.json), fuer die Seite "Ist das sicher?". */
  function rechtsBlock() {
    const q = window.KL.seite || {};
    const links = [["datenschutz_url", "Datenschutzerklärung", "shield-check"], ["impressum_url", "Impressum", "file-text"]]
      .filter(([k]) => /^https:\/\//.test(String(q[k] || "")));
    if (!links.length) return h("span");
    return h("section", { class: "block" }, h("h2", null, icon("scale"), "Die verbindlichen Texte"),
      h("div", { class: "weiter" }, links.map(([k, t, ic]) => h("a", { href: q[k], rel: "noopener" }, icon(ic), t))));
  }
  /* ------------------------------------------------------------ Fusszeile
     Der Server setzt Autor, Impressum, Datenschutz und den Hinweis zur Speicherung ein (app.py, _fuss_html). Hier kommen
     auf jeder Seite der Link auf "Lizenzen und Quellen" und die Pflichtangabe "Built with Llama" (Llama 3.2 Community
     License, Abschnitt 1.b.i) dazu. Fehlen Impressum oder Datenschutz im Server-Text, werden sie aus module.json ergaenzt. */
  function fussErgaenzen() {
    const fuss = $("#fuss");
    if (!fuss || $(".fuss-speicher", fuss)) return;
    const q = window.KL.seite || {};
    const pflicht = [["impressum_url", "Impressum"], ["datenschutz_url", "Datenschutz"]]
      .filter(([k]) => String(q[k] || "").startsWith("https://") && !$$("a", fuss).some((a) => a.getAttribute("href") === q[k]));
    const teile = [h("a", { href: "/lizenzen" }, "Lizenzen und Quellen")]
      .concat(pflicht.map(([k, t]) => h("a", { href: q[k] }, t)), h("span", { class: "fuss-llama" }, "Built with Llama"));
    if (!$(".fuss-lizenz", fuss)) fuss.append(h("p", { class: "fuss-lizenz" }, teile.flatMap((t, i) => (i ? [h("span", { "aria-hidden": "true" }, " · "), t] : [t]))));
    fuss.append(h("p", { class: "fuss-speicher" },
      h("a", { href: "/sicherheit-einfach#browser-eintraege", onclick: (e) => { if (e.ctrlKey || e.metaKey || e.shiftKey) return; e.preventDefault(); navigiere({ id: "sicherheit-einfach", query: "" }); setTimeout(() => zuAbschnitt("browser-eintraege"), 60); } }, "Was im Browser gespeichert wird"),
      h("span", { "aria-hidden": "true" }, " · "),
      h("button", { type: "button", class: "textlink merken-schalter", role: "switch", "aria-checked": String(merken), title: "Merkt gelesene Seiten und die letzte Stelle in diesem Browser. Aus leert diese Einträge.", onclick: () => merkenSetzen(!merken) },
        "Fortschritt merken: ", h("span", { class: "merken-zustand" }, merken ? "an" : "aus"))));
  }
  /** Lesezeit fuer die Kopfzeile: nur der Wert zum gewaehlten Lesemodus ist sichtbar (CSS nach html[data-lesemodus]). */
  function lesezeitKopf(seite) {
    if (!(seite.abschnitte || []).length) return null;
    const lz = lesezeit(seite);
    return h("span", { class: "lz-kopf", title: "Lesezeit ohne Quiz: ca. " + lz.kompakt + " Min im kurzen Modus, ca. " + lz.ausfuehrlich + " Min im genauen Modus. Das Video und ein Labor kommen dazu." },
      icon("clock"), zeitFeld(seite.id, "", null, "lz"));
  }
  /** Lernziele (Seitenfeld oder Ergaenzung in content-laien.js): eine Zeile, zum Aufklappen. */
  function lernzieleBlock(seite) {
    const z = seite.lernziele || (INHALT.lernzieleErgaenzung || {})[seite.id] || null;
    if (!z || !z.length) return null;
    return h("details", { class: "lernziele lz-kompakt", "aria-label": "Lernziele" }, h("summary", null, icon("target"), h("span", null, "Lernziele"), h("small", null, z.length === 1 ? "1 Punkt" : z.length + " Punkte"), icon("chevron")),
      h("ul", null, z.map((t) => h("li", null, t))));
  }
  /** Am Ende einer Lektion: die naechste Seite im Pfad (bevorzugt im Pfad des gewaehlten Weges). */
  function pfadWeiterBlock(id) {
    const alle = pfadeListe().filter((q) => q.ids.includes(id));
    if (!alle.length) return null;
    const w = aktiverWeg();
    const pf = alle.find((q) => w && q.rolle === w) || alle[0];
    const i = pf.ids.indexOf(id);
    const next = pf.ids.slice(i + 1).find((x) => !(w === "schule" && kameraSeiten().has(x)));
    if (!next) return null;
    const sd = INHALT.seiten[next];
    return h("section", { class: "block pfad-weiter" }, h("h2", null, icon("route"), "Nächste Seite im Pfad"),
      h("div", { class: "weiter" }, h("a", { href: adresse(next) }, icon(sd.symbol), sd.titel)),
      h("p", { class: "pfad-weiter-info" }, "Pfad „" + pf.name + "“, Schritt " + (i + 1) + " von " + pf.ids.length + "."));
  }
  /** Eine Seite gilt als gelesen, wenn das Seitenende im Bild war und mindestens MIN_LESEDAUER seit dem Oeffnen vergangen ist. */
  function lesefortschrittStarten(id) {
    const ende = $(".seitenende");
    if (!ende || gelesen.has(id)) return;
    const start = Date.now();
    let timer = null, fertig = false, y = 0, speichern = null;
    const pruefen = () => {
      if (fertig) return;
      if (ende.getBoundingClientRect().top > window.innerHeight + 8) return;      // Ende noch nicht im Bild
      const rest = MIN_LESEDAUER - (Date.now() - start);
      if (rest > 0) { if (!timer) timer = setTimeout(() => { timer = null; pruefen(); }, rest + 30); return; }
      fertig = true;
      gelesenMerken(id);
    };
    const beiScroll = () => {
      pruefen();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      y = max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0;
      if (!speichern) speichern = setTimeout(() => { speichern = null; if (zuletzt && zuletzt.id === id) { zuletzt.y = Math.round(y * 1000) / 1000; zuletztSpeichern(); } }, 1200);
    };
    window.addEventListener("scroll", beiScroll, { passive: true });
    window.addEventListener("resize", pruefen);
    requestAnimationFrame(pruefen);
    montiert.push({ destroy() { window.removeEventListener("scroll", beiScroll); window.removeEventListener("resize", pruefen); clearTimeout(timer); clearTimeout(speichern); } });
  }
  function seiteBetreten(id) {
    aktuelleId = id;
    if (!zaehlbar(id)) return;
    zuletzt = { id, y: 0 };
    zuletztSpeichern();
    lesefortschrittStarten(id);
    if (scrollZiel && scrollZiel.id === id) {
      const y = scrollZiel.y;
      scrollZiel = null;
      setTimeout(() => { const max = document.documentElement.scrollHeight - window.innerHeight; if (max > 0 && y > 0 && window.scrollY < 4) window.scrollTo({ top: Math.round(max * y), left: 0, behavior: "instant" }); }, 450);
    }
  }
  function seiteBauen(id) {
    const seite = Object.assign({ id, query: aktuelleAbfrage }, INHALT.seiten[id]);
    if (seite.typ === "start") return startSeite(seite);
    const art = seite.typ === "lektion" ? "Lektion" + (seite.nr ? " " + seite.nr : "") : "Labor";
    const ueberText = seite.typ === "lektion" && seite.gruppe === "Grundlagen" ? "Grundlagen · " + art : seite.gruppe;
    const lzk = lesezeitKopf(seite);
    const ueber = lzk ? [ueberText, h("span", { class: "ueber-trenner", "aria-hidden": "true" }, " · "), lzk] : ueberText;
    const out = h("div", { class: "seitenbreite" }, zurueckZeile(),
      hero({ symbol: seite.symbol, ueber, titel: seite.titel, lead: seite.kurz, kennzahlen: kennzahlenFuer(seite) }));
    const lzb = lernzieleBlock(seite); if (lzb) out.append(lzb);
    // Seitenfeld downloads: [{text, sub?, href}] als Knöpfe direkt unter dem Kopf (nur Dateien unter /static/)
    const dls = (seite.downloads || []).filter((d) => d && typeof d.href === "string" && d.href.startsWith("/static/") && !d.href.startsWith("//"));
    if (dls.length) out.append(h("div", { class: "downloads", role: "group", "aria-label": "Zum Ausdrucken" },
      dls.map((d) => h("a", { class: "dlkarte", href: d.href, download: "ki-labor-" + d.href.split("/").pop(), target: "_blank", rel: "noopener", "aria-label": d.text + " herunterladen" },
        h("span", { class: "dl-icon", "aria-hidden": "true" }, icon("file-text")),
        h("span", { class: "dl-text" }, h("b", null, d.text), d.sub ? h("small", null, d.sub) : null),
        h("span", { class: "btn primary klein dl-knopf" }, icon("download"), h("span", null, "Herunterladen"))))));
    if (seite.experimente) out.append(h("section", { class: "block" }, experimenteRaster()));
    if (imSchulweg(id)) out.append(h("p", { class: "kamera-hinweis" }, icon("camera"), h("span", null, h("b", null, "Braucht Kamera oder Mikrofon. "),
      "Im Unterricht ist das nicht nötig. Nutze es nur mit Einverständnis, bei unter 16 Jahren mit dem der Eltern.")));
    if (seite.status === "bald") out.append(h("p", { class: "in-arbeit" }, icon("hammer"), h("span", null, h("b", null, "Vorschau. "), "Die Erklärung steht schon. Eine Demo gibt es hier noch nicht.")));
    const vids = seite.videos || (seite.video ? [seite.video] : []);
    if (vids.length) out.append(videoBlock(vids));
    if (seite.widget) out.append(baustein("widgets", seite.widget, seite, seite.widgetTitel || "Ausprobieren", seite.widgetSymbol || "play"));
    if (seite.demo) out.append(baustein("demos", seite.demo, seite, "Live ausprobieren", "live"));
    out.append(abschnitte(seite));
    if (seite.mitnehmen) out.append(h("section", { class: "block mitnehmen" }, h("h2", null, "Das nimmst du mit"), h("ul", null, seite.mitnehmen.map((m) => h("li", null, m)))));
    if (seite.quiz && seite.quiz.length) out.append(quizBlock(seite.quiz, () => gelesenMerken(id)));
    if (seite.business) {
      const b = seite.business;
      const chips = b.beispiele && b.beispiele.length ? h("div", { class: "zeile" }, b.beispiele.map((c) => h("span", { class: "chip" }, c))) : null;
      out.append(h("section", { class: "block" }, h("h2", null, icon("business"), "Im Business"),
        h("div", { class: "flaeche pad text biz" }, chips || h("p", { class: "kurz auto" }, ersterSatz(b.text)), mehrBlock([h("p", { html: md(b.text) })]))));
    }
    if (seite.grenzen) {
      out.append(h("section", { class: "block" }, h("h2", null, icon("info"), "Grenzen"),
        h("div", { class: "flaeche pad text" }, mehrBlock([h("ul", null, seite.grenzen.map((g) => h("li", { html: md(g) })))], "Grenzen ansehen (" + seite.grenzen.length + ")"))));
    }
    if (seite.rechtslinks) out.append(rechtsBlock());
    const d3 = dreiSchritteBlock(seite.dreiSchritte); if (d3) out.append(d3);
    const pw = pfadWeiterBlock(id); if (pw) out.append(pw);
    const w = weiterBlock(seite.weiter); if (w) out.append(w);
    out.append(h("div", { class: "seitenende", "aria-hidden": "true" }));
    return out;
  }

  /* ------------------------------------------------------------ Router (History-API) */
  /* Der Router darf erst arbeiten, wenn start() den Hauptbereich eingerichtet hat (Module laden asynchron). Ein hashchange,
     popstate oder Linkklick in diesem Fenster fand sonst kein #inhalt und warf "Cannot read properties of null (reading
     'replaceChildren')". Davor gilt: Links laufen als normale Seitenaufrufe, start() zeigt am Ende die aktuelle Adresse. */
  let bereit = false;
  const gibt = (id) => !!id && Object.prototype.hasOwnProperty.call(INHALT.seiten, id);
  const adresse = (id, query) => (id === "start" ? "/" : "/" + id) + (query ? "?" + query : "");
  function ausHash(hash) {           // alte Form #/id oder #/id?abfrage
    const m = String(hash).match(/^#\/([a-z0-9-]+)(?:\?(.*))?$/);
    return m ? { id: m[1], query: m[2] || "" } : null;
  }
  function ausPfad(pfad, suche) {    // echte Adresse /id oder /
    const query = String(suche || "").replace(/^\?/, "");
    if (pfad === "/") return { id: "start", query };
    const m = pfad.match(/^\/([a-z0-9-]+)\/?$/);
    return { id: m ? m[1] : null, query };
  }
  function nichtGefunden() {
    return h("div", { class: "seitenbreite" }, hero({ symbol: "info", ueber: "KI-Labor", titel: "Seite nicht gefunden", lead: "Diese Adresse gibt es im KI-Labor nicht.",
      unten: h("div", { class: "hero-aktionen" }, h("a", { class: "btn primary", href: "/" }, "Zur Startseite")) }));
  }
  function route(y) {
    if (!bereit) return;
    const alt = ausHash(location.hash);
    if (alt) history.replaceState(history.state, "", adresse(gibt(alt.id) ? alt.id : "start", alt.query));
    const { id, query } = ausPfad(location.pathname, location.search);
    const gueltig = gibt(id) ? id : null;
    // saubere Schreibweise: /start und /id/ gehen auf /id bzw. /
    if (gueltig && location.pathname !== adresse(gueltig)) history.replaceState(history.state, "", adresse(gueltig, query));
    aktuelleAbfrage = Object.fromEntries(new URLSearchParams(query));
    // Klassenlink: /?weg=schule gilt in dieser Sitzung (im Speicher der Seite), es wird nichts abgelegt
    if (wegGueltig(aktuelleAbfrage.weg) && wegNorm(aktuelleAbfrage.weg) !== wegUrl) { wegUrl = wegNorm(aktuelleAbfrage.weg); wegAnwenden(false); }
    tipAus(); aufraeumen();
    const main = $("#inhalt");
    if (gueltig) {
      main.replaceChildren(seiteBauen(gueltig));
      document.title = INHALT.seiten[gueltig].titel + " · KI-Labor";
      seiteBetreten(gueltig);
    } else {
      aktuelleId = null;
      main.replaceChildren(nichtGefunden());
      document.title = "Seite nicht gefunden · KI-Labor";
    }
    fortschrittZeigen();
    navMarkieren(gueltig);
    const sd = gueltig ? INHALT.seiten[gueltig] : null;
    leisteSetzen(sd ? sd.titel : "Seite nicht gefunden", !!sd && sd.typ !== "start");
    window.scrollTo({ top: y || 0, left: 0, behavior: "instant" });
    leisteStand();
  }
  function navigiere(ziel) {         // ziel: { id, query }, ohne Neuladen
    const url = adresse(ziel.id, ziel.query);
    if (url === location.pathname + location.search) { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); $("#inhalt").focus({ preventScroll: true }); return; }
    const tiefe = (history.state && history.state.i) || 0;           // Tiefe der Verlaufskette: Zurueck-Knopf unterscheidet "im Labor gewesen" von "direkt gelandet"
    history.replaceState(Object.assign({}, history.state, { y: window.scrollY }), "", location.href);
    history.pushState({ y: 0, i: tiefe + 1 }, "", url);
    route();
    $("#inhalt").focus({ preventScroll: true });
  }
  /** Ziel eines Links, wenn es eine Seite des Labors ist (#/id oder /id), sonst null. */
  function linkZiel(a) {
    const href = a.getAttribute("href") || "";
    const alt = ausHash(href);
    if (alt) return { id: gibt(alt.id) ? alt.id : "start", query: alt.query };
    let u;
    try { u = new URL(href, location.href); } catch (e) { return null; }
    if (u.origin !== location.origin || u.hash) return null;
    const p = ausPfad(u.pathname, u.search);
    return gibt(p.id) ? p : null;
  }
  document.addEventListener("click", (e) => {
    if (!bereit || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
    const ziel = linkZiel(a);
    if (!ziel) return;
    e.preventDefault();
    navigiere(ziel);
  });
  history.scrollRestoration = "manual";
  window.addEventListener("popstate", () => route(history.state && history.state.y));
  window.addEventListener("hashchange", () => { if (ausHash(location.hash)) route(); });

  /* Einstellungsgruppe im Stil der Systemeinstellungen. zeilen: Elemente (.regler, .w-schalter, .g-zeile ...). */
  function gruppe(titel, zeilen, opt) {
    const o = opt || {};
    const kopf = titel ? h("h3", { class: "g-kopf" }, titel) : null;
    const box = h("div", { class: "g-box" + (o.klasse ? " " + o.klasse : "") }, kopf,
      (zeilen && zeilen.length) ? h("div", { class: "gruppe" }, [].concat(zeilen).filter(Boolean)) : null,
      [].concat(o.fuss || []).map((f) => { if (f && f.nodeType) { f.classList.add("g-fuss"); return f; } return h("p", { class: "g-fuss" }, f); }),
      o.aktion ? h("div", { class: "g-aktion" + (o.aktionKlasse ? " " + o.aktionKlasse : "") }, o.aktion) : null);
    return box;
  }
  function zeile(beschriftung, steuer, id, stapel) {
    return h("div", { class: "g-zeile" + (stapel ? " g-stapel" : "") }, h(id ? "label" : "span", { class: "g-name", for: id || null }, beschriftung), h("div", { class: "g-steuer" }, steuer));
  }

  window.KL = { $, $$, h, md, gruppe, zeile, icon, hatIcon, post, stats, zeit, beispiele, widgets: {}, demos: {}, INHALT,
    /** Haengt ein Objekt mit destroy() an die aktuelle Seite: wird beim Seitenwechsel aufgeraeumt (wie ein Baustein). */
    montiere(m) { montiert.push(m); return m; },
    ersterSatz, klar,
    /** Die vier Wege als Liste {id, titel, symbol} (Quelle fuer das Willkommens-Fenster). */
    wegListe: () => Object.entries(WEGE).map(([id, w]) => ({ id, titel: w.titel, kurz: w.kurz, symbol: w.symbol })),
    /** Weg waehlen (Schluessel) oder aufheben (null): speichert ein Wort in kl-weg und wendet den Weg an. */
    wegWaehlen,
    /** Einwilligung zum Merken des Fortschritts setzen (laien.js: Schalter im Willkommens-Fenster); lesen ueber KL.merken. */
    merkenSetzen };
  Object.defineProperty(window.KL, "merken", { enumerable: true, get: () => merken });
  Object.defineProperty(window.KL, "lesemodus", { enumerable: true, get: () => lesemodus, set: lesemodusSetzen });
  Object.defineProperty(window.KL, "weg", { enumerable: true, get: () => aktiverWeg() });
  window.KL.gelesen = (id) => gelesen.has(id);

  function ladeSkript(src) {
    return new Promise((ok) => {
      const e = document.createElement("script");
      e.src = src + V; e.onload = () => ok(true); e.onerror = () => { console.error("Modul fehlt: " + src); ok(false); };
      document.head.append(e);
    });
  }
  async function ladeModule() {
    let m = { css: [], content: [], module: [] };
    try { m = Object.assign(m, await (await fetch("/static/module.json", { cache: "no-cache" })).json()); } catch (e) { console.error(e); }
    window.KL.seite = (m && m.seite) || {};
    for (const c of m.css || []) document.head.append(h("link", { rel: "stylesheet", href: "/static/" + c + V }));
    for (const f of m.content || []) await ladeSkript("/static/" + f);
    for (const f of m.module || []) await ladeSkript("/static/" + f);
  }
  async function start() {
    const iconsP = iconsLaden();
    await ladeModule();
    await iconsP;          // vor dem ersten Rendern, damit lucide-Namen aus icons.json schon da sind
    // Der vom Server vorab eingesetzte Inhalt (id "vorab") wird jetzt zum Hauptbereich der Oberflaeche.
    const vorab = $("#vorab"); if (vorab) vorab.id = "inhalt";
    const seitenleiste = $("#seite");
    seitenleiste.replaceChildren(
      h("div", { class: "marke" }, h("div", { class: "logo" }, icon("hardware")), h("div", null, h("b", null, "KI-Labor"), h("span", null, "kostenlos, live ausprobieren"))),
      wegChip("weg-chip-seite"), menueKnopf(), navBauen(), liveBauen(), tip);
    fortschrittZeigen();
    wegAnwenden(false);
    fussErgaenzen();
    const haupt = $(".haupt");
    if (haupt) haupt.prepend(leisteBauen());
    schieberFuellen(document);
    new MutationObserver((ml) => { for (const m of ml) for (const n of m.addedNodes) if (n.nodeType === 1) schieberFuellen(n); }).observe(document.body, { childList: true, subtree: true });
    bereit = true;
    route(history.state && history.state.y);
    if (/^#[a-z0-9-]+$/.test(location.hash)) setTimeout(() => zuAbschnitt(location.hash.slice(1)), 100);     // Sprung zu einem Abschnitt, z. B. /sicherheit-einfach#browser-eintraege
    if (window.KL.willkommen) window.KL.willkommen.beimStart();      // erst nach dem ersten Rendern, nur Startseite und Erstbesuch
    poll(); setInterval(poll, 1500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
