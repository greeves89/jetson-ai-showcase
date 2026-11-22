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
     KL.beispiele()                           Promise auf /static/beispiele/manifest.json ({usecases:[...]}), gecacht
     seite.query                              Abfrage der Adresse, z. B. /anlernen?beispiel=fertigung-teile -> {beispiel:"fertigung-teile"}
   ADRESSEN: Seiten liegen unter /<id> (Startseite /). Links der Form href="#/<id>" oder "#/<id>?beispiel=x" funktionieren
     weiter: Klicks darauf werden abgefangen und ohne Neuladen auf die echte Adresse gelegt; ein gesetztes
     location.hash = "#/id" und alte Lesezeichen werden per replaceState auf die saubere Adresse umgeleitet.
   SICHERHEIT: Server-, Modell- und Nutzertexte NUR per textContent oder h(...) mit Text einsetzen, nie ueber
   html: oder innerHTML. KL.md() ist nur fuer eigene, statische Texte aus content.js gedacht.
   CSS-Klassen stehen in style.css (flaeche, pad, btn, chip, regler, live, pipe, erklaerung, ...).
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
  function md(t) {
    let s = esc(String(t));
    s = s.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, k, anzeige) => {
      const g = INHALT.glossar[k];
      if (!g) return anzeige || k;
      return '<button type="button" class="gl" data-gl="' + k + '">' + (anzeige || g[0]) + "</button>";
    });
    // {{seite|Text}} oder {{seite?beispiel=id|Text}} (Abfrage erlaubt: Buchstaben, Ziffern, - _ = &)
    s = s.replace(/\{\{([a-z0-9-]+)(\?[a-z0-9_=&-]+)?\|([^}]+)\}\}/g, (m, id, abfrage, text) => '<a href="#/' + id + (abfrage || "") + '">' + text + "</a>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    return s;
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
    return h("div", { class: "livebox", "aria-live": "off" },
      h("div", { class: "kopfz" }, live.punkt, live.status),
      h("div", { class: "mini" }, h("div", { class: "z" }, "GPU", live.gpu), live.gpuB),
      h("div", { class: "mini" }, h("div", { class: "z" }, "Speicher", live.ram), live.ramB),
      h("div", { class: "mini" }, h("div", { class: "z" }, "Leistung", live.w)),
      live.modell);
  }
  function liveAktualisieren(d) {
    live.punkt.classList.toggle("aus", !d.frisch);
    live.status.textContent = d.frisch ? "Jetson live" : "keine frischen Werte";
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
    const wrap = h("section", { class: "block" }, h("h2", null, icon("play"), reihe ? "Videoreihe" : "Erklärvideo"));
    const flaeche = h("div", { class: "flaeche reihe" }, h("div", { class: "video leer" }, h("div", { class: "platz" }, icon("play"), h("div", null, h("b", null, "Das Video wird geladen")))));
    wrap.append(flaeche);
    manifestP.then((m) => {
      const fertig = ids.map((id) => (m.videos || []).find((x) => x.id === id)).filter(Boolean);
      const offen = ids.length - fertig.length;
      if (!fertig.length) {
        flaeche.replaceChildren(h("p", { class: "video-folgt" }, icon("clock"), reihe ? "Videos zu diesem Thema folgen." : "Video zu diesem Thema folgt."));
        return;
      }
      const zeigen = (i, abspielen) => {
        const v = fertig[i];
        const basis = "/static/videos/" + v.id;
        const video = h("video", { controls: true, preload: "metadata", poster: basis + ".jpg", playsinline: true, "aria-label": v.titel },
          h("source", { src: basis + ".mp4", type: "video/mp4" }),
          h("track", { kind: "subtitles", srclang: "de", label: "Deutsch", src: basis + ".vtt", default: true }));
        const kap = (v.kapitel || []).map((k) => h("li", null,
          h("button", { type: "button", dataset: { t: k.t }, onclick: () => { video.currentTime = k.t; video.play(); } },
            h("span", { class: "t" }, mmss(k.t)), k.titel)));
        const kopf = h("div", { class: "video" + (kap.length ? "" : " leer") },
          h("div", { class: "spieler" }, video), kap.length ? h("ol", { class: "kapitel", "aria-label": "Kapitel" }, kap) : null);
        const teile = [kopf];
        if (reihe) {
          teile.push(h("ol", { class: "folgen", "aria-label": "Folgen der Reihe" }, fertig.map((f, j) => h("li", null,
            h("button", { type: "button", "aria-current": j === i ? "true" : "false", onclick: () => zeigen(j, true) },
              h("span", { class: "nr" }, "Folge " + (ids.indexOf(f.id) + 1) + " von " + ids.length), h("span", { class: "ti" }, f.titel),
              h("span", { class: "du" }, mmss(f.dauer_s || 0)))))));
          if (offen > 0) teile.push(h("p", { class: "folgen-info" }, offen === 1 ? "Eine weitere Folge ist in Arbeit." : offen + " weitere Folgen sind in Arbeit."));
        }
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
  let besucht = new Set();
  try { besucht = new Set(JSON.parse(localStorage.getItem("kl-besucht") || "[]")); } catch (e) { /* ohne Speicher */ }
  function besuchtMerken(id) {
    if (id === "start") return;
    besucht.add(id);
    try { localStorage.setItem("kl-besucht", JSON.stringify([...besucht])); } catch (e) { /* egal */ }
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
  function navSuche(text) {
    const q = text.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const gespeichert = navOffenLesen();
    let treffer = 0;
    for (const gr of navGruppen) {
      let inGruppe = 0;
      for (const a of gr.eintraege) {
        const ok = !q.length || q.every((t) => a.haystack.includes(t));
        a.el.hidden = !ok;
        if (ok) inGruppe++;
      }
      treffer += inGruppe;
      if (q.length) {
        gr.sec.hidden = inGruppe === 0;
        gr.liste.hidden = inGruppe === 0;
        gr.kopf.setAttribute("aria-expanded", inGruppe ? "true" : "false");
      } else {
        gr.sec.hidden = false;
        const aktiv = gr.eintraege.some((x) => x.el.getAttribute("aria-current") === "page");
        const offen = gespeichert.has(gr.name) || aktiv;
        gr.liste.hidden = !offen;
        gr.kopf.setAttribute("aria-expanded", offen ? "true" : "false");
      }
    }
    const leer = $("#nav-leer");
    if (leer) leer.hidden = !(q.length && treffer === 0);
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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("menue-offen")) menueSchalten(false); });

  function navBauen() {
    const suche = h("div", { class: "navsuche" },
      h("input", { type: "search", id: "nav-suche", placeholder: "Seiten suchen", "aria-label": "Seiten suchen", autocomplete: "off",
        oninput: (e) => { navSuche(e.target.value); if (e.target.value) menueSchalten(true); },
        onkeydown: (e) => { if (e.key === "Escape") { e.target.value = ""; navSuche(""); } } }));
    const nav = h("nav", { class: "navscroll", id: "nav-liste", "aria-label": "Lernpfad" });
    navGruppen = [];
    const gespeichert = navOffenLesen();
    for (const g of INHALT.gruppen) {
      if (!g.seiten.length) continue;
      const liste = h("div", { class: "navliste" });
      const kopf = h("button", { type: "button", class: "navkopf", "aria-expanded": "true" }, h("span", null, g.name), icon("chevron"));
      const sec = h("div", { class: "navgruppe" }, h("h2", null, kopf), liste);
      const gr = { name: g.name, sec, kopf, liste, eintraege: [] };
      for (const id of g.seiten) {
        const s = INHALT.seiten[id];
        const el = h("a", { class: "nav", href: adresse(id), dataset: { id } }, icon(s.symbol), h("span", null, s.nav || s.titel),
          s.status === "bald" ? h("span", { class: "bald" }, "bald") : h("span", { class: "ok", hidden: true }, icon("check")));
        liste.append(el);
        gr.eintraege.push({ el, id, haystack: ((s.nav || "") + " " + s.titel + " " + (s.kurz || "")).toLowerCase() });
      }
      kopf.addEventListener("click", () => gruppeOeffnen(gr, kopf.getAttribute("aria-expanded") !== "true", true));
      // Voreinstellung: nur die Gruppen offen, die der Besucher geoeffnet hat; Start immer offen; die der aktuellen Seite folgt in navMarkieren
      gruppeOeffnen(gr, gespeichert.has(g.name) || g.name === "Start", false);
      nav.append(sec);
      navGruppen.push(gr);
    }
    nav.append(h("p", { id: "nav-leer", class: "nav-leer", hidden: true }, "Keine Seite gefunden."));
    const f = document.createDocumentFragment();
    f.append(suche, nav);
    return f;
  }
  function navMarkieren(id) {
    $$(".nav").forEach((a) => {
      const ist = a.dataset.id === id;
      if (ist) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      const ok = $(".ok", a);
      if (ok) ok.hidden = !(besucht.has(a.dataset.id) && a.dataset.id !== "start");
    });
    const suche = $("#nav-suche");
    for (const gr of navGruppen) {
      if (gr.eintraege.some((x) => x.id === id) && !(suche && suche.value.trim())) gruppeOeffnen(gr, true, false);
    }
    const ak = $('.nav[aria-current="page"]');
    if (ak && ak.scrollIntoView) ak.scrollIntoView({ block: "nearest" });
  }

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
  function tabelleBlock(t) {
    return h("div", { class: "tabelle-wrap" }, h("table", { class: "vergleich" },
      t.beschriftung ? h("caption", null, t.beschriftung) : null,
      h("thead", null, h("tr", null, t.kopf.map((k) => h("th", { scope: "col", html: md(k) })))),
      h("tbody", null, t.zeilen.map((z) => h("tr", null, z.map((c, i) => h(i === 0 ? "th" : "td", { scope: i === 0 ? "row" : null, html: md(c) })))))));
  }
  function quizBlock(fragen) {
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
          if (beantwortet.size === fragen.length) ergebnis.textContent = richtig.size + " von " + fragen.length + " richtig.";
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
  try { const m = localStorage.getItem("kl-lesemodus"); if (MODI.includes(m)) lesemodus = m; } catch (e) { /* ohne Speicher */ }
  document.documentElement.dataset.lesemodus = lesemodus;
  function lesemodusSetzen(m) {
    if (!MODI.includes(m)) return;
    lesemodus = m;
    document.documentElement.dataset.lesemodus = m;
    try { localStorage.setItem("kl-lesemodus", m); } catch (e) { /* egal */ }
    for (const d of $$("details.mehr")) d.open = m === "ausfuehrlich";
    for (const b of $$(".lesemodus button")) b.setAttribute("aria-pressed", b.dataset.modus === m ? "true" : "false");
  }
  function lesemodusSchalter() {
    const knopf = (m, text) => h("button", { type: "button", dataset: { modus: m }, "aria-pressed": lesemodus === m ? "true" : "false", onclick: () => lesemodusSetzen(m) }, text);
    const gruppe = h("div", { class: "lesemodus", role: "group", "aria-label": "Lesemodus" }, knopf("kompakt", "Kompakt"), knopf("ausfuehrlich", "Ausführlich"));
    gruppe.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const ziel = e.key === "ArrowRight" ? "ausfuehrlich" : "kompakt";
      lesemodusSetzen(ziel);
      const b = $('button[data-modus="' + ziel + '"]', gruppe); if (b) b.focus();
    });
    return h("div", { class: "lesezeile" }, h("span", null, "Lesemodus"), gruppe);
  }
  /** Markierungen aus content.js in reinen Text wandeln. */
  function klar(t) {
    return String(t)
      .replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, k, a) => a || (INHALT.glossar[k] ? INHALT.glossar[k][0] : k))
      .replace(/\{\{([a-z0-9-]+)(?:\?[a-z0-9_=&-]+)?\|([^}]+)\}\}/g, "$2")
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
  function abschnitte(seite) {
    const out = h("div", { class: "text" });
    for (const a of seite.abschnitte || []) {
      const sec = h("section", { class: "abschnitt" }, h("h2", { class: "abs" }, a.h));
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
      if (a.tabelle) mehr.push(tabelleBlock(a.tabelle));
      if (a.alltag) mehr.push(h("aside", { class: "alltag" }, h("b", null, "Beispiel aus dem Alltag"),
        [].concat(a.alltag).map((t) => h("p", { html: md(t) }))));
      if (a.merke) mehr.push(h("aside", { class: "merke" }, h("b", null, "Merke"), h("p", { html: md(a.merke) })));
      if (mehr.length) sec.append(mehrBlock(mehr));
      out.append(sec);
    }
    return out;
  }
  function weiterBlock(ids) {
    if (!ids || !ids.length) return null;
    return h("section", { class: "block" }, h("h2", null, icon("arrow"), "Weiter geht es"),
      h("div", { class: "weiter" }, ids.map((id) => { const s = INHALT.seiten[id]; return s ? h("a", { href: "#/" + id }, icon(s.symbol), s.titel) : null; })));
  }
  function startSeite(seite) {
    const pfad = h("ol", { class: "pfad" }, seite.pfad.map((p) => h("li", null, h("h3", null, h("a", { href: "#/" + p.id }, p.h)), h("p", null, p.p))));
    const jetzt = h("p", { class: "jetztsatz" }, "Der Jetson meldet sich gleich.");
    montiert.push({ destroy: stats.on((d) => {
      const m = d.modelle_geladen && d.modelle_geladen.length ? "Im Speicher liegt " + d.modelle_geladen.join(", ") + "." : "Gerade ist kein Modell im Speicher.";
      jetzt.textContent = "GPU " + (d.gpu_pct ?? 0) + " Prozent, " + String(d.power_w ?? 0).replace(".", ",") + " Watt, " + (d.temp_c ?? 0) + " Grad. " + m;
    }) });
    return h("div", { class: "seitenbreite" },
      h("p", { class: "ueber" }, "KI-Labor auf dem Jetson"),
      h("h1", null, seite.titel),
      h("p", { class: "lead" }, seite.kurz),
      h("section", { class: "block" }, h("h2", null, icon("karte"), "Dein Lernpfad"), h("div", { class: "flaeche pad" }, pfad)),
      h("section", { class: "block" }, h("h2", null, icon("live"), "Gerade im Jetson"), h("div", { class: "flaeche pad" }, jetzt)),
      h("section", { class: "block" }, h("h2", null, icon("info"), "Datenschutz"), h("div", { class: "text" }, h("p", null, seite.datenschutz))));
  }
  function seiteBauen(id) {
    const seite = Object.assign({ id, query: aktuelleAbfrage }, INHALT.seiten[id]);
    if (seite.typ === "start") return startSeite(seite);
    const art = seite.typ === "lektion" ? "Lektion" + (seite.nr ? " " + seite.nr : "") : "Labor";
    const ueber = seite.typ === "lektion" && seite.gruppe === "Grundlagen" ? "Grundlagen · " + art : seite.gruppe;
    const out = h("div", { class: "seitenbreite" },
      h("p", { class: "ueber" }, ueber), h("h1", null, seite.titel), h("p", { class: "lead" }, seite.kurz));
    out.append(lesemodusSchalter());
    if (seite.status === "bald") out.append(h("p", null, h("span", { class: "chip warn" }, "Demo folgt"), " Die Erklärung steht schon, die Demo wird noch eingebaut."));
    const vids = seite.videos || (seite.video ? [seite.video] : []);
    if (vids.length) out.append(videoBlock(vids));
    if (seite.widget) out.append(baustein("widgets", seite.widget, seite, "Ausprobieren", "play"));
    if (seite.demo) out.append(baustein("demos", seite.demo, seite, "Live ausprobieren", "live"));
    out.append(abschnitte(seite));
    if (seite.mitnehmen) out.append(h("section", { class: "block mitnehmen" }, h("h2", null, "Das nimmst du mit"), h("ul", null, seite.mitnehmen.map((m) => h("li", null, m)))));
    if (seite.quiz && seite.quiz.length) out.append(quizBlock(seite.quiz));
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
    const w = weiterBlock(seite.weiter); if (w) out.append(w);
    return out;
  }

  /* ------------------------------------------------------------ Router (History-API) */
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
    return h("div", { class: "seitenbreite" }, h("h1", null, "Seite nicht gefunden"),
      h("p", { class: "lead" }, "Diese Adresse gibt es im KI-Labor nicht."),
      h("p", null, h("a", { href: "/" }, "Zur Startseite")));
  }
  function route(y) {
    const alt = ausHash(location.hash);
    if (alt) history.replaceState(history.state, "", adresse(gibt(alt.id) ? alt.id : "start", alt.query));
    const { id, query } = ausPfad(location.pathname, location.search);
    const gueltig = gibt(id) ? id : null;
    // saubere Schreibweise: /start und /id/ gehen auf /id bzw. /
    if (gueltig && location.pathname !== adresse(gueltig)) history.replaceState(history.state, "", adresse(gueltig, query));
    aktuelleAbfrage = Object.fromEntries(new URLSearchParams(query));
    tipAus(); aufraeumen();
    const main = $("#inhalt");
    if (gueltig) {
      main.replaceChildren(seiteBauen(gueltig));
      document.title = INHALT.seiten[gueltig].titel + " · KI-Labor";
      besuchtMerken(gueltig);
    } else {
      main.replaceChildren(nichtGefunden());
      document.title = "Seite nicht gefunden · KI-Labor";
    }
    navMarkieren(gueltig);
    window.scrollTo({ top: y || 0, left: 0, behavior: "instant" });
  }
  function navigiere(ziel) {         // ziel: { id, query }, ohne Neuladen
    const url = adresse(ziel.id, ziel.query);
    if (url === location.pathname + location.search) { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); $("#inhalt").focus({ preventScroll: true }); return; }
    history.replaceState({ y: window.scrollY }, "", location.href);
    history.pushState({ y: 0 }, "", url);
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
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
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

  window.KL = { $, $$, h, md, icon, hatIcon, post, stats, zeit, beispiele, widgets: {}, demos: {}, INHALT,
    /** Haengt ein Objekt mit destroy() an die aktuelle Seite: wird beim Seitenwechsel aufgeraeumt (wie ein Baustein). */
    montiere(m) { montiert.push(m); return m; },
    ersterSatz, klar };
  Object.defineProperty(window.KL, "lesemodus", { enumerable: true, get: () => lesemodus, set: lesemodusSetzen });

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
      h("div", { class: "marke" }, h("div", { class: "logo" }, icon("hardware")), h("div", null, h("b", null, "KI-Labor"), h("span", null, "läuft auf dem Jetson"))),
      menueKnopf(), navBauen(), liveBauen(), tip);
    route(history.state && history.state.y);
    poll(); setInterval(poll, 1500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
