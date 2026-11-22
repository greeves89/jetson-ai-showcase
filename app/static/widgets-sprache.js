/* KI-Labor: Lernbausteine des Strangs Sprache.
   Bausteine: tokenizer-labor (Seite tokens-sprachmodelle), prompt-werkstatt (Seite prompting),
   risiko-spiel (Seite llm-grenzen). Vertrag siehe app.js: KL.widgets.<name> = function (root, seite) { ...; return { destroy() {} } }.
   Spezifikation: docs/bausteine-sprache.md. Klassen mit Praefix sp-, Gestaltung in widgets-sprache.css.
   SICHERHEIT: Eingaben der Besucher, Modellantworten und alles aus dem Netz gelangen nur per textContent in die Seite,
   nie als HTML-Code. Dieser Baustein baut seine Oberflaeche nur mit h() und createElementNS. */
(function () {
  "use strict";
  const KL = window.KL;
  const { h } = KL;
  const SEP = "⁣";                       // Tokentrenner im Chat-Strom (siehe app.py, TOKEN_TRENNER)
  const SVGNS = "http://www.w3.org/2000/svg";

  /* ------------------------------------------------------------ Hilfen */
  const de = (n, d = 0) => Number(n).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
  const sek = (ms) => (ms < 1000 ? Math.round(ms) + " ms" : de(ms / 1000, 1) + " s");
  let zaehler = 0;
  const neueId = (p) => "sp-" + p + "-" + (++zaehler);
  const mqRuhig = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const ruhig = () => !!(mqRuhig && mqRuhig.matches);

  /* Symbole im lucide-Stil: Pfade bzw. Formen als Daten, die Elemente entstehen per createElementNS. */
  const FORMEN = {
    check: [["path", { d: "M5 12l4 4 10-10" }]],
    x: [["path", { d: "M18 6 6 18M6 6l12 12" }]],
    minus: [["path", { d: "M5 12h14" }]],
    refresh: [["path", { d: "M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" }]],
    stop: [["rect", { x: 6, y: 6, width: 12, height: 12, rx: 2 }]],
    send: [["path", { d: "M22 2 11 13M22 2l-7 20-4-9-9-4z" }]],
    info: [["circle", { cx: 12, cy: 12, r: 9 }], ["path", { d: "M12 11v5M12 8h.01" }]],
    shuffle: [["path", { d: "M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" }]],
    play: [["path", { d: "M7 4l13 8-13 8z" }]],
    arrow: [["path", { d: "M5 12h14M13 6l6 6-6 6" }]],
  };
  function ic(name) {
    const s = document.createElementNS(SVGNS, "svg");
    s.setAttribute("class", "ic");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    for (const [tag, attrs] of (FORMEN[name] || FORMEN.info)) {
      const e = document.createElementNS(SVGNS, tag);
      for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
      s.append(e);
    }
    return s;
  }
  function hinweis(...kinder) {
    return h("p", { class: "w-hinweis" }, ic("info"), h("span", null, ...kinder));
  }
  /* Lebenszyklus: alles, was bei destroy() enden muss */
  function leben() {
    const L = { weg: false, ctrls: new Set(), timers: new Set(), offs: [] };
    L.ctrl = () => { const c = new AbortController(); L.ctrls.add(c); return c; };
    L.frei = (c) => L.ctrls.delete(c);
    L.timeout = (fn, ms) => { const t = setTimeout(() => { L.timers.delete(t); if (!L.weg) fn(); }, ms); L.timers.add(t); return t; };
    L.clear = (t) => { clearTimeout(t); L.timers.delete(t); };
    L.on = (ziel, ev, fn, opt) => { ziel.addEventListener(ev, fn, opt); L.offs.push(() => ziel.removeEventListener(ev, fn, opt)); };
    L.destroy = () => {
      L.weg = true;
      L.ctrls.forEach((c) => c.abort());
      L.timers.forEach((t) => clearTimeout(t));
      L.offs.forEach((f) => f());
    };
    return L;
  }
  function postJson(pfad, obj, signal) {
    return fetch(pfad, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj), signal });
  }
  async function fehlerText(r) {
    let d = null;
    try { d = await r.json(); } catch (e) { /* kein JSON */ }
    if (r.status === 403) return "Der Jetson hat die Anfrage abgelehnt. Öffne das Labor über die normale Adresse des Jetson.";
    if (r.status === 429) return "Gerade sind sehr viele Anfragen unterwegs. Warte einen Moment und versuche es noch einmal.";
    if (d && d.fehler) return String(d.fehler);
    return "Der Jetson antwortet mit Fehler " + r.status + ".";
  }
  const NETZ = "Der Jetson antwortet gerade nicht. Vielleicht startet er einen Dienst neu. Warte einige Sekunden und versuche es noch einmal.";

  /* ============================================================ 1. Tokenizer-Labor */
  /* Naeherung im Browser, falls der Jetson-Zerleger nicht antwortet: Vorzerlegung wie bei Llama 3,
     dann je Wort die laengsten passenden Stuecke aus einer kleinen Liste (Greedy). Bewusst einfach. */
  const GANZE_WOERTER = new Set(("der die das den dem des ein eine einen einem einer und oder aber nicht ist sind war hat haben wird wir ihr sie er es ich du " +
    "mit von zu auf in an aus bei nach für über um als wie was wer wo wann dass auch noch nur schon sehr mehr heute hier dort ja nein " +
    "haus hand kind tag jahr zeit welt mann frau stadt land arbeit wasser the a an and or but not is are was has have will we you he she it i " +
    "of to in on at for with from by as that this today good time year people day man woman world work water please send me invoice contract insurance weather nice walk").split(" "));
  const STUECKE = ("ung heit keit schaft lich isch ver ent zer ge be er ein aus auf an ab bei vor nach über unter durch sch ch ei au eu ie ck st sp " +
    "en el em es et te ten tes ter tung ungs ing tion ation ed ly al ent ous ive ness ment able ful less ur or ar").split(" ")
    .filter((s, i, a) => a.indexOf(s) === i).sort((a, b) => b.length - a.length);
  function naehern(text) {
    const teile = text.match(/(?:'s|'t|'re|'ve|'m|'ll|'d)|[^\r\n\p{L}\p{N}]?\p{L}+|\p{N}{1,3}| ?[^\s\p{L}\p{N}]+[\r\n]*|\s*[\r\n]+|\s+(?!\S)|\s+/giu) || [];
    const aus = [];
    for (const t of teile) {
      const m = /^([^\p{L}\p{N}]?)(\p{L}+)$/u.exec(t);
      if (!m || t.length < 2) { aus.push(t); continue; }
      const [, vor, wort] = m;
      const klein = wort.toLowerCase();
      if (wort.length <= 3 || GANZE_WOERTER.has(klein)) { aus.push(t); continue; }
      let i = 0, erstes = true;
      while (i < wort.length) {
        let nimm = 0;
        for (const s of STUECKE) { if (wort.length - i > s.length - 1 && klein.startsWith(s, i) && s.length >= 2) { nimm = s.length; break; } }
        if (!nimm || (i === 0 && nimm === wort.length)) nimm = Math.min(wort.length - i, i === 0 ? 3 : 4);
        aus.push((erstes ? vor : "") + wort.slice(i, i + nimm));
        erstes = false; i += nimm;
      }
    }
    return aus.map((t) => ({ text: t, id: null, teil: false }));
  }

  /* Tokens zu Woertern und Zahlen gruppieren: so sieht man, welche Woerter in mehrere Stuecke zerfallen. */
  function gruppen(tokens) {
    const art = (c) => (/\p{L}/u.test(c) ? "b" : /\p{N}/u.test(c) ? "z" : "s");
    const gs = [];
    for (const t of tokens) {
      if (t.teil) { if (gs.length) gs[gs.length - 1].n++; continue; }
      const s = t.text;
      const erstes = s.replace(/^\s+/, "").charAt(0) || " ";
      const a = art(erstes);
      const letzte = gs[gs.length - 1];
      if (letzte && !/^\s/.test(s) && a !== "s" && a === letzte.art) { letzte.text += s; letzte.n++; }
      else gs.push({ art: a, text: s, n: 1 });
    }
    return gs;
  }

  const TOK_BEISPIELE = [
    { name: "ein Haus", text: "ein Haus", notiz: "Das Leerzeichen vor einem Wort gehört zum Stück. Das zweite Stück heißt „·Haus“, der Punkt steht für das Leerzeichen. Lösche „ein “ und schau, was mit „Haus“ allein passiert." },
    { name: "Hausratversicherung", text: "Hausratversicherung", notiz: "Ein langes Fachwort gibt es nicht als Ganzes im Wortschatz. Es wird aus Bruchstücken zusammengesetzt, die einzeln wenig Sinn ergeben." },
    { name: "Donaudampfschifffahrtsgesellschaft", text: "Donaudampfschifffahrtsgesellschaft", notiz: "Auch ein bekanntes Wort zerfällt, wenn es lang und selten ist. Jedes Stück zählt als ein Token." },
    { name: "3,5 kg", text: "3,5 kg", notiz: "Ziffern, Komma und Einheit sind eigene Stücke. Das Modell sieht keine Zahl, sondern eine Folge von Stücken." },
    { name: "12.10.2025", text: "12.10.2025", notiz: "Ein Datum besteht aus vielen kleinen Stücken. Lange Zahlen werden in Blöcke von höchstens drei Ziffern geschnitten: aus 2025 werden 202 und 5." },
    { name: "Erdbeere", text: "Erdbeere", notiz: "Wie viele r stecken in „Erdbeere“? Das Modell sieht nur die Stücke oben, als Nummern, nicht die einzelnen Buchstaben. Darum verzählt es sich bei solchen Fragen leicht." },
    { name: "Straße, Größe, Mädchen", text: "Straße, Größe, Mädchen", notiz: "Umlaute und das ß sind im Deutschen häufig, aber nicht immer ein ganzes Stück. Manche Zeichen werden in Bytes zerlegt. Ein Stück mit dem Zeichen „�“ ist nur ein Teil eines Zeichens und allein nicht lesbar." },
    { name: "Preis mit Sonderzeichen", text: "Preis: 49,90 € (inkl. 19 % MwSt.)", notiz: "Satzzeichen, Währungszeichen und Klammern sind oft eigene Stücke, und auch ein Leerzeichen vor einer Zahl kann eines sein." },
    { name: "Englisch gegen Deutsch", paar: true, notiz: "" },
  ];
  const PAAR_EN = "Please send me the invoice for the insurance contract.";
  const PAAR_DE = "Bitte schick mir die Rechnung für den Versicherungsvertrag.";
  const FENSTER = [2048, 4096, 8192, 128000];

  KL.widgets["tokenizer-labor"] = function (root) {
    const L = leben();
    root.classList.add("w-wid", "sp-wid", "sp-tok");
    const MAX = 1000;
    let anzeige = "text", fenster = 4096, serverAusBis = 0, nr = 0, ctrl = null, timer = 0;
    let aktuell = { tokens: [], quelle: null, wortschatz: null };
    let notiz = "";
    const vergleich = [];

    /* Eingabe */
    const feldId = neueId("text");
    const feld = h("textarea", { id: feldId, rows: 3, maxlength: MAX, class: "sp-feld", placeholder: "Tippe einen Text oder wähle ein Beispiel.", spellcheck: "false", autocomplete: "off" });
    const zaehlerEl = h("span", { class: "sp-zaehler mono", "aria-hidden": "true" }, "0 / " + de(MAX));
    const beispieleEl = h("div", { class: "sp-bsp", role: "group", "aria-label": "Beispiele" },
      TOK_BEISPIELE.map((b) => h("button", { type: "button", class: "chip", onclick: () => nimmBeispiel(b) }, b.name)));

    /* Anzeige und Quelle */
    const segText = h("button", { type: "button", role: "radio", "aria-checked": "true", onclick: () => setzeAnzeige("text") }, "Text");
    const segIds = h("button", { type: "button", role: "radio", "aria-checked": "false", onclick: () => setzeAnzeige("ids") }, "Nummern");
    const seg = h("div", { class: "sp-seg", role: "radiogroup", "aria-label": "Anzeige der Stücke" }, segText, segIds);
    const quelleEl = h("span", { class: "chip", role: "status" }, "Zerlegung wird geladen");
    const kopf = h("div", { class: "sp-kopf" },
      KL.gruppe(null, [KL.zeile("Stücke zeigen als", seg)], { klasse: "sp-gruppe" }), quelleEl);

    /* Ergebnis */
    const tokenEl = h("div", { class: "sp-tokens", role: "list", "aria-label": "Der Text in Token zerlegt", "aria-live": "polite" });
    const werte = h("dl", { class: "sp-werte" });
    const zerfallEl = h("p", { class: "sp-zerfall", "aria-live": "polite" });
    const notizEl = h("p", { class: "sp-notiz", "aria-live": "polite" });
    const tabelleKnoepfe = h("div", { class: "zeile" });

    /* Was daraus folgt */
    const fensterReihe = h("div", { class: "sp-bsp", role: "radiogroup", "aria-label": "Größe des Kontextfensters" },
      FENSTER.map((f) => h("button", { type: "button", class: "chip", role: "radio", "aria-checked": f === fenster ? "true" : "false", "data-f": f, onclick: () => setzeFenster(f) }, de(f))));
    const barFuell = h("i");
    const bar = h("div", { class: "sp-bar", role: "img", "aria-label": "Anteil des Kontextfensters" }, barFuell);
    const fensterText = h("p", { class: "sp-text", "aria-live": "polite" });
    const kostenText = h("p", { class: "sp-text", "aria-live": "polite" });
    const merkBtn = h("button", { type: "button", class: "btn klein", onclick: merken }, ic("check"), "Zum Vergleich merken");
    const leerBtn = h("button", { type: "button", class: "btn klein", hidden: true, onclick: () => { vergleich.length = 0; zeichneVergleich(); } }, "Vergleich leeren");
    const vergleichWrap = h("div", { class: "sp-tabwrap", hidden: true });
    const hinweisEl = h("p", { class: "w-hinweis" });

    root.append(
      h("label", { class: "w-ueber", for: feldId }, "Dein Text"),
      feld,
      h("div", { class: "sp-feldfuss" }, h("span", { class: "w-leise sp-klein" }, "Höchstens " + de(MAX) + " Zeichen."), zaehlerEl),
      h("span", { class: "w-ueber sp-vor" }, "Beispiele"),
      beispieleEl,
      h("div", { class: "sp-sektion" }, kopf, tokenEl, werte, zerfallEl, notizEl),
      h("div", { class: "sp-sektion" },
        h("h3", { class: "sp-h3" }, "Was daraus folgt"),
        h("div", { class: "sp-folge" },
          h("h4", null, "Kontextgrenze"),
          h("p", { class: "sp-text" }, "Ein Modell kann nur eine feste Zahl Token auf einmal lesen. Deine Frage und die Antwort müssen zusammen hineinpassen. Wähle ein Beispielfenster:"),
          KL.gruppe(null, [KL.zeile("Kontextfenster", fensterReihe, null, true)]), bar, fensterText),
        h("div", { class: "sp-folge" },
          h("h4", null, "Kosten"),
          h("p", { class: "sp-text" }, "Anbieter rechnen Eingabe und Ausgabe nach Token ab, jeweils mit einem Preis je Token. Die Kosten sind also Token mal Preis. Zwei Texte mit gleichem Sinn können verschieden viel kosten. Hier auf dem Jetson kostet kein Token Geld, aber jedes kostet Rechenzeit."),
          kostenText),
        h("div", { class: "sp-folge" },
          h("h4", null, "Warum Zahlen und seltene Wörter teuer sind"),
          h("p", { class: "sp-text" }, "Häufige Wörter haben einen eigenen Eintrag im Wortschatz und kosten ein Token. Seltene Wörter und Namen gibt es nicht als Ganzes, sie werden aus Bruchstücken gebaut. Zahlen gibt es unendlich viele, darum werden sie in Blöcke von höchstens drei Ziffern geschnitten. Eine lange Zahl besteht deshalb aus vielen Token."),
          h("div", { class: "zeile" }, merkBtn, leerBtn), vergleichWrap)),
      hinweisEl);

    /* ---- Zerlegen */
    async function zerlege(t) {
      if (Date.now() >= serverAusBis) {
        const c = L.ctrl();
        try {
          const r = await postJson("/api/tokenize", { text: t }, c.signal);
          if (r.ok) {
            const d = await r.json();
            if (d && Array.isArray(d.tokens)) return { tokens: d.tokens, quelle: "genau", modell: d.modell, wortschatz: d.wortschatz || null };
          }
          serverAusBis = Date.now() + (r.status === 429 ? 10000 : 30000);
        } catch (e) {
          if (e && e.name === "AbortError") throw e;
          serverAusBis = Date.now() + 30000;
        } finally { L.frei(c); }
      }
      return { tokens: naehern(t), quelle: "naehe", modell: null, wortschatz: null };
    }
    async function aktualisiere() {
      const mein = ++nr;
      const t = feld.value.slice(0, MAX);
      zaehlerEl.textContent = de(t.length) + " / " + de(MAX);
      if (!t) { aktuell = { tokens: [], quelle: aktuell.quelle, wortschatz: aktuell.wortschatz }; zeichne(t); return; }
      if (ctrl) ctrl.abort();
      try {
        const erg = await zerlege(t);
        if (mein !== nr || L.weg) return;
        aktuell = erg;
        zeichne(t);
      } catch (e) { /* abgebrochen oder zerstoert */ }
    }
    function geplant(sofort) {
      L.clear(timer);
      if (sofort) { aktualisiere(); return; }
      timer = L.timeout(aktualisiere, 220);
    }
    L.on(feld, "input", () => { notiz = ""; geplant(false); });

    /* ---- Darstellung */
    const sichtbar = (s) => s.replace(/ /g, "·").replace(/\n/g, "↵").replace(/\t/g, "→");
    function zeichne(t) {
      const toks = aktuell.tokens;
      const genau = aktuell.quelle === "genau";
      segIds.disabled = !genau;
      if (!genau && anzeige === "ids") setzeAnzeige("text", true);
      quelleEl.className = "chip " + (aktuell.quelle == null ? "" : genau ? "live" : "warn");
      quelleEl.textContent = aktuell.quelle == null ? "Zerlegung wird geladen" : genau ? "Genau, vom Modell auf dem Jetson" : "Näherung im Browser";
      tokenEl.replaceChildren();
      if (!toks.length) {
        tokenEl.append(h("span", { class: "sp-leer" }, t ? "Wird zerlegt …" : "Hier erscheinen die Stücke deines Textes."));
      } else {
        toks.forEach((k, i) => {
          const s = h("span", { class: "sp-tk sp-c" + (i % 4) + (k.teil ? " sp-teil" : ""), role: "listitem", title: k.teil ? "Teil eines Zeichens, allein nicht lesbar" : (k.id != null ? "Nummer " + k.id : "") },
            anzeige === "ids" && k.id != null ? h("span", { class: "mono" }, String(k.id)) : sichtbar(k.text));
          s.setAttribute("aria-label", (anzeige === "ids" && k.id != null ? "Nummer " + k.id + ", " : "") + (k.teil ? "Teil eines Zeichens" : "„" + k.text.replace(/\n/g, " Zeilenumbruch ") + "“"));
          tokenEl.append(s);
        });
      }
      /* Zahlen */
      const woerter = t.trim() ? t.trim().split(/\s+/).length : 0;
      const n = toks.length;
      const zeilen = [
        ["Zeichen", de(t.length)], ["Wörter", de(woerter)], ["Token", de(n)],
        ["Token je Wort", woerter && n ? de(n / woerter, 1) : "·"],
        ["Zeichen je Token", n ? de(t.length / n, 1) : "·"],
      ];
      werte.replaceChildren(...zeilen.map(([k, v]) => h("div", null, h("dt", null, k), h("dd", { class: "mono" }, v))));
      /* zerfallene Woerter */
      const zer = gruppen(toks).filter((g) => g.art !== "s" && g.n > 1).sort((a, b) => b.n - a.n).slice(0, 4);
      zerfallEl.textContent = zer.length ? "Zerfallen in mehrere Stücke: " + zer.map((g) => g.text.trim() + " (" + g.n + ")").join(", ") + "." : "";
      notizEl.textContent = notiz + (notiz && n ? " " : "") + beobachtung(t, toks);
      /* Folgen */
      zeichneFolgen(t, n, woerter);
      hinweisEl.replaceChildren(ic("info"), h("span", null, aktuell.quelle === "genau"
        ? "Die Zerlegung kommt vom Modell " + (aktuell.modell || "llama3.2:3b") + " auf dem Jetson: Der Zerleger wird aus der Modelldatei gebaut" + (aktuell.wortschatz ? " (Wortschatz mit " + de(aktuell.wortschatz) + " Einträgen)" : "") + ". Das Modell zählt dieselben Token. Andere Modelle zerlegen anders."
        : "Dies ist eine Näherung: Der Zerleger auf dem Jetson antwortet gerade nicht, darum zerlegt der Browser mit einer kleinen Liste häufiger Wortstücke. Das Modell zerlegt etwas anders, die Zahlen sind nur Richtwerte."));
    }
    function beobachtung(t, toks) {
      if (!toks.length) return "";
      const s = [];
      if (toks.some((k) => k.teil)) s.push("Ein Zeichen besteht hier aus mehreren Bytes und ist auf mehrere Stücke verteilt, die einzeln keinen lesbaren Text ergeben.");
      else if (/\d{4,}/.test(t)) s.push("Lange Zahlen werden in Blöcke von höchstens drei Ziffern geschnitten, darum kosten sie viele Token.");
      return s.join(" ");
    }
    function zeichneFolgen(t, n, woerter) {
      const anteil = n / fenster;
      barFuell.style.width = Math.min(100, anteil * 100).toFixed(2) + "%";
      bar.setAttribute("aria-label", de(Math.min(100, anteil * 100), 1) + " Prozent des Fensters belegt");
      let s = n ? "Dein Text belegt " + de(n) + " von " + de(fenster) + " Token, das sind " + de(anteil * 100, 1) + " Prozent. " : "Schreib einen Text, dann siehst du, wie viel vom Fenster er belegt. ";
      if (n && woerter >= 2) s += "Bei diesem Verhältnis von " + de(n / woerter, 1) + " Token je Wort passen etwa " + de(Math.round(fenster / (n / woerter))) + " Wörter in das Fenster. ";
      s += "Was die Antwort braucht, geht vom selben Fenster ab.";
      fensterText.textContent = s;
      kostenText.textContent = n ? "Dieser Text zählt als " + de(n) + " Token. Schickst du ihn tausendmal, sind das " + de(n * 1000) + " Token, bei einer Anbieter-Abrechnung mal dem Preis je Token." : "";
    }
    function setzeAnzeige(a, still) {
      anzeige = a;
      segText.setAttribute("aria-checked", String(a === "text"));
      segIds.setAttribute("aria-checked", String(a === "ids"));
      if (!still) zeichne(feld.value.slice(0, MAX));
    }
    function setzeFenster(f) {
      fenster = f;
      fensterReihe.querySelectorAll("button").forEach((b) => b.setAttribute("aria-checked", String(Number(b.dataset.f) === f)));
      const t = feld.value.slice(0, MAX);
      zeichneFolgen(t, aktuell.tokens.length, t.trim() ? t.trim().split(/\s+/).length : 0);
    }

    /* ---- Beispiele und Vergleich */
    function nimmBeispiel(b) {
      if (b.paar) { vergleichePaar(); return; }
      feld.value = b.text;
      notiz = b.notiz;
      geplant(true);
      feld.focus();
    }
    async function vergleichePaar() {
      if (ctrl) ctrl.abort();
      const mein = ++nr;
      try {
        const en = await zerlege(PAAR_EN), dt = await zerlege(PAAR_DE);
        if (mein !== nr || L.weg) return;
        vergleich.length = 0;
        vergleich.push(eintrag(PAAR_EN, en), eintrag(PAAR_DE, dt));
        feld.value = PAAR_DE;
        aktuell = dt;
        notiz = "Beide Sätze bedeuten dasselbe. Der englische braucht " + en.tokens.length + " Token, der deutsche " + dt.tokens.length + ". Das Modell wurde mit viel englischem Text gebaut, und deutsche Zusammensetzungen zerfallen oft in mehrere Stücke." + (dt.quelle === "naehe" ? " (Näherung)" : "");
        zeichne(PAAR_DE);
        zeichneVergleich();
        zaehlerEl.textContent = de(PAAR_DE.length) + " / " + de(MAX);
      } catch (e) { /* abgebrochen */ }
    }
    const eintrag = (text, erg) => ({ text, zeichen: text.length, token: erg.tokens.length, naehe: erg.quelle !== "genau" });
    function merken() {
      const t = feld.value.slice(0, MAX);
      if (!t.trim() || !aktuell.tokens.length) return;
      const i = vergleich.findIndex((e) => e.text === t);
      const e = eintrag(t, aktuell);
      if (i >= 0) vergleich[i] = e;
      else { if (vergleich.length >= 6) vergleich.shift(); vergleich.push(e); }
      zeichneVergleich();
    }
    function zeichneVergleich() {
      leerBtn.hidden = vergleichWrap.hidden = !vergleich.length;
      if (!vergleich.length) { vergleichWrap.replaceChildren(); return; }
      const basis = vergleich[0].token || 1;
      const tab = h("table", { class: "sp-tab" },
        h("caption", { class: "sp-nur-sr" }, "Gemerkte Texte im Vergleich"),
        h("thead", null, h("tr", null, ["Text", "Zeichen", "Token", "Zeichen je Token", "Faktor zum ersten", ""].map((k) => h("th", { scope: "col" }, k)))),
        h("tbody", null, vergleich.map((e, i) => h("tr", null,
          h("th", { scope: "row", class: "sp-tt" }, e.text.length > 44 ? e.text.slice(0, 43) + "…" : e.text, e.naehe ? h("span", { class: "chip warn sp-mini" }, "Näherung") : null),
          h("td", { class: "mono" }, de(e.zeichen)), h("td", { class: "mono" }, de(e.token)),
          h("td", { class: "mono" }, e.token ? de(e.zeichen / e.token, 1) : "·"),
          h("td", { class: "mono" }, de(e.token / basis, 2) + " ×"),
          h("td", null, h("button", { type: "button", class: "sp-ikon", "aria-label": "Eintrag entfernen: " + e.text.slice(0, 30), onclick: () => { vergleich.splice(i, 1); zeichneVergleich(); } }, ic("x")))))));
      vergleichWrap.replaceChildren(tab);
    }

    /* Start: leerer Zustand, Server einmal anfragen, damit der Hinweis stimmt */
    feld.value = "";
    zeichne("");
    zerlege("Hallo").then((e) => { if (!L.weg && !feld.value) { aktuell = { tokens: [], quelle: e.quelle, modell: e.modell, wortschatz: e.wortschatz }; zeichne(""); } }).catch(() => {});
    return { destroy() { L.destroy(); } };
  };

  /* ============================================================ 2. Prompt-Werkstatt */
  const VORLAGEN = [
    {
      id: "mail", name: "Mail an einen Kunden",
      material: "Bestellung: 40 Ordner und 2 Regale. Ursprünglicher Liefertermin: Dienstag, der 12. Neuer Liefertermin: Montag, der 18. Grund: Der Lieferant hatte einen Maschinenschaden. Der Kunde wird gesiezt und kann den Kundenservice anrufen.",
      a: "Schreib eine Mail wegen der Verspätung.",
      b: "Du bist Sachbearbeiter im Kundenservice eines Büroausstatters.\nAufgabe: Schreibe eine kurze Mail an einen Kunden, dessen Bestellung später ankommt.\nKontext: [MATERIAL]\nTon: freundlich und sachlich, per Sie. Beispiel für den Ton: „Wir bedauern die Verzögerung und danken Ihnen für Ihre Geduld.“\nAufbau: Betreff in der ersten Zeile, Entschuldigung genau einmal, neuer Liefertermin, Angebot zum Anruf.\nFormat: höchstens 90 Wörter.\nGrenzen: Keine Rabatte versprechen und nichts erfinden, was nicht im Kontext steht.",
    },
    {
      id: "protokoll", name: "Protokoll zusammenfassen",
      material: "Besprechung Projekt Frühjahrsmesse. Anwesend: Leitung, Einkauf, Grafik. Der Standentwurf wurde vorgestellt. Beschluss: Die Variante B wird gebaut. Der Einkauf holt bis Freitag zwei Angebote für den Messebau ein. Offen ist, ob der Stand ein zweites Stockwerk bekommt. Die Leitung klärt das mit der Messeleitung. Die Grafik liefert die Banner bis Ende des Monats. Wer am zweiten Messetag den Stand betreut, wurde nicht besprochen.",
      a: "Fasse das zusammen.",
      b: "Du schreibst Protokolle für ein Projektteam. Fasse das Besprechungsprotokoll unten zusammen und gliedere genau so:\nTeilnehmende: ...\nBeschlüsse: ...\nOffene Punkte: ...\nBeispiel für einen Punkt: „Beschluss: Das Muster wird bis Freitag verschickt (Einkauf).“\nHöchstens fünf Stichpunkte insgesamt. Schreibe nur, was im Text steht. Fehlt eine Angabe, schreibe „nicht genannt“.\n\nProtokoll:\n[MATERIAL]",
    },
    {
      id: "angebote", name: "Angebote vergleichen",
      material: "Angebot 1: Laptop, 16 GB Speicher, 512 GB Festplatte, Lieferung in 3 Tagen, 1.150 Euro netto, 1 Jahr Garantie, Versand 40 Euro. Angebot 2: Laptop, 32 GB Speicher, 512 GB Festplatte, Lieferung in 14 Tagen, 1.290 Euro netto, 3 Jahre Garantie, Versand kostenlos.",
      a: "Welches Angebot ist besser?",
      b: "Du hilfst einer Einkäuferin beim Vergleich zweier Angebote. Gehe in drei Schritten vor:\n1. Nenne die Eckdaten beider Angebote als Liste, eine Zeile je Merkmal.\n2. Berechne die Gesamtkosten inklusive Versand und zeige den Rechenweg.\n3. Gib eine Empfehlung in zwei Sätzen und nenne, was dagegen sprechen könnte.\nRechne nur mit den Zahlen aus dem Material. Fehlt eine Angabe, sag es.\n\nAngebote:\n[MATERIAL]",
    },
    {
      id: "sortieren", name: "Anfragen sortieren",
      material: "Hallo, auf meiner letzten Rechnung steht ein Betrag, den ich nicht verstehe. Können Sie mir das erklären?",
      a: "Ordne die Anfrage ein.",
      b: "Du sortierst Kundenanfragen in genau eine Kategorie: Rechnung, Lieferung, Reklamation oder Sonstiges. Antworte nur mit der Kategorie, ohne weiteren Satz.\n\nBeispiele:\nAnfrage: Wo ist mein Paket? Es sollte gestern kommen.\nKategorie: Lieferung\nAnfrage: Das Gerät ist nach zwei Tagen kaputt.\nKategorie: Reklamation\nAnfrage: Haben Sie am Samstag geöffnet?\nKategorie: Sonstiges\n\nAnfrage: [MATERIAL]\nKategorie:",
    },
    {
      id: "erklaeren", name: "Text einfach erklären",
      material: "Die Redundanz der Stromversorgung wird durch zwei voneinander unabhängige Einspeisungen und eine unterbrechungsfreie Stromversorgung sichergestellt, sodass bei Ausfall eines Strangs der Betrieb nahtlos weiterläuft.",
      a: "Erkläre das.",
      b: "Du erklärst Technik für Menschen ohne Vorwissen. Erkläre den Text unten für eine Teamassistentin, die nie mit Rechenzentren zu tun hatte. Nutze einen Vergleich aus dem Alltag, zum Beispiel aus dem Haushalt. Schreibe höchstens vier Sätze und vermeide Fachwörter oder erkläre sie kurz in Klammern. Erfinde keine Details, die nicht im Text stehen.\n\nText:\n[MATERIAL]",
    },
  ];

  /* Heuristik: Stichwoerter. Sie findet Hinweise auf Bausteine, keine guten Inhalte. */
  const BAUSTEINE = [
    { k: "rolle", name: "Rolle", tipp: "Sag, aus welcher Sicht das Modell antwortet, etwa „Du bist Sachbearbeiter im Kundenservice.“",
      re: [/\bdu bist\b/i, /\bdu arbeitest\b/i, /\bdu schreibst\b/i, /\bdu hilfst\b/i, /\bdu sortierst\b/i, /\bdu erklärst\b/i, /\bin der rolle\b/i, /\brolle\s*:/i, /\bstell dir vor\b/i, /\bals (?:erfahren\w*|sachbearbeiter\w*|berater\w*|experte\w*|expertin\w*|lektor\w*)\b/i] },
    { k: "kontext", name: "Kontext", tipp: "Gib die Fakten mit: Worum geht es, für wen, was ist schon bekannt? Oder füge das Material ein.",
      re: [/\[MATERIAL\]/, /\bkontext\b/i, /\bhintergrund\b/i, /\bsituation\b/i, /\bzielgruppe\b/i, /\bweil\b/i, /\bgrund\b/i, /\bfolgende[nrms]?\b/i, /\b(?:text|protokoll|angebote?|anfrage|mail|material)\s*:/i, /\bunten\b/i] },
    { k: "beispiel", name: "Beispiel", tipp: "Zeig ein Beispiel für ein gutes Ergebnis oder für den Ton, den du meinst.",
      re: [/\bbeispiele?\b/i, /\bz\.\s?b\./i, /\bzum beispiel\b/i, /\bmuster\b/i, /\bwie in\b/i] },
    { k: "format", name: "Format", tipp: "Lege Form und Länge fest: Liste, Gliederung, höchstens so viele Wörter.",
      re: [/\bformat\b/i, /\bhöchstens\b/i, /\bmaximal\b/i, /\b\d+\s*(?:wörter|worte|sätze|stichpunkte|punkte|zeilen|absätze|zeichen)\b/i, /\b(?:ein|zwei|drei|vier|fünf)\s+(?:wörter|sätze|stichpunkte|schritte|absätze)\b/i, /\bstichpunkt/i, /\btabelle\b/i, /\bals liste\b/i, /\bgliedere?\b/i, /\baufbau\b/i, /\bbetreff\b/i, /\bantworte (?:nur|mit|in)\b/i, /\bin drei schritten\b/i] },
    { k: "grenzen", name: "Grenzen", tipp: "Sag, was das Modell lassen soll: nichts erfinden, nichts versprechen, nur aus dem Material antworten.",
      re: [/\bnicht\b/i, /\bkeine?[nmrs]?\b/i, /\bohne\b/i, /\bniemals\b/i, /\bauf keinen fall\b/i, /\bvermeide\b/i, /\bnur\b/i, /\bgrenzen?\s*:/i, /\berfinde/i] },
  ];
  function pruefePrompt(text) {
    return BAUSTEINE.map((b) => {
      for (const re of b.re) { const m = re.exec(text); if (m) return { b, treffer: m[0].trim() }; }
      return { b, treffer: null };
    });
  }

  /* Antwort des Chat-Stroms lesen: Tokens sind mit SEP getrennt, danach folgt entweder die Statistik oder eine Meldung. */
  function lies(roh) {
    const teile = roh.split(SEP);
    const rest = teile.pop();
    const r = { tokens: teile, text: teile.join(""), belegt: false, meta: null, fehler: null };
    if (!teile.length && /^\[/.test(rest) && KL.last.istBelegtText(rest)) r.belegt = true;
    else if (rest.startsWith("\n\n---\n") || /^\n{1,2}-{0,3}$/.test(rest)) r.meta = rest;
    else if (/^\n\[/.test(rest)) {
      const t = rest.trim().replace(/^\[|\]$/g, "");
      r.fehler = /^Fehler/.test(t) ? "Der Jetson hat die Antwort abgebrochen." : t;
    } else r.text += rest;
    return r;
  }

  KL.widgets["prompt-werkstatt"] = function (root) {
    const L = leben();
    root.classList.add("w-wid", "sp-wid", "sp-pw");
    const MAXP = 1500, MAXM = 1200, MAXGESAMT = 3900, MAXTOK = 300, VERSUCHE = 4, WARTE_MS = 6000;
    let laeuft = false, stopp = false, aktuelleCtrl = null, vorlage = VORLAGEN[0];

    /* ---- Vorlagen, Material, Regler */
    const vorlagenEl = h("div", { class: "sp-bsp", role: "radiogroup", "aria-label": "Aufgabe aus dem Alltag" },
      VORLAGEN.map((v) => h("button", { type: "button", class: "chip", role: "radio", "aria-checked": "false", "data-v": v.id, onclick: () => waehle(v) }, v.name)));
    const matId = neueId("material");
    const material = h("textarea", { id: matId, class: "sp-feld", rows: 3, maxlength: MAXM, spellcheck: "false" });
    const tempId = neueId("temp");
    const temp = h("input", { type: "range", id: tempId, min: 0, max: 1.5, step: 0.1, value: 0.3 });
    const tempOut = h("output", { for: tempId }, "0,3");
    L.on(temp, "input", () => { tempOut.textContent = de(Number(temp.value), 1); });
    const reglerEl = h("div", { class: "regler" }, h("label", { for: tempId }, "Temperatur"), temp, tempOut);

    /* ---- zwei Seiten */
    function seite(kennung, titel, unter, start) {
      const s = { kennung, titel, durchlauf: 0, letzteTokens: null, ctrl: null };
      const pid = neueId("prompt-" + kennung);
      s.feld = h("textarea", { id: pid, class: "sp-feld sp-prompt", rows: kennung === "a" ? 4 : 14, maxlength: MAXP, spellcheck: "false" });
      s.kopf = h("div", { class: "sp-skopf" },
        h("label", { class: "sp-slabel", for: pid }, h("span", { class: "sp-stitel" }, titel), h("span", { class: "w-leise sp-klein" }, unter)));
      s.summe = h("p", { class: "sp-summe", "aria-live": "polite" });
      s.liste = h("ul", { class: "sp-checks" });
      s.vorschau = h("pre", { class: "sp-pre" });
      s.vorschauBox = h("details", { class: "sp-details" }, h("summary", null, "Was genau gesendet wird"), s.vorschau);
      s.status = h("p", { class: "sp-status", role: "status", "aria-live": "polite" }, "Noch nichts gesendet.");
      s.zahl = h("span", { class: "sp-tokzahl mono", "aria-hidden": "true" });
      s.antwort = h("div", { class: "sp-antwort", tabindex: "0", role: "region", "aria-label": "Antwort zu " + titel, "aria-live": "off" },
        h("span", { class: "sp-leer" }, "Die Antwort erscheint hier."));
      s.nochmal = h("button", { type: "button", class: "btn klein", onclick: () => starte([s]) }, ic("refresh"), "Nochmal");
      s.pruefBoxen = ["Ton passt", "Form eingehalten", "Nichts erfunden", "Vollständig"].map((t) => {
        const id = neueId("pruef");
        const cb = h("input", { type: "checkbox", id });
        L.on(cb, "change", () => zaehlePruef(s));
        return { cb, el: h("label", { class: "sp-pruef", for: id }, cb, h("span", null, t)) };
      });
      s.pruefSumme = h("span", { class: "sp-prsumme mono", "aria-live": "polite" }, "0 von 4");
      s.pruef = h("fieldset", { class: "sp-prfeld" }, h("legend", null, "Deine Prüfliste"), h("div", { class: "sp-prreihe" }, s.pruefBoxen.map((p) => p.el)), s.pruefSumme);
      L.on(s.feld, "input", () => { s.zaehlt = false; L.clear(s.t); s.t = L.timeout(() => aktualisiereSeite(s), 250); });
      s.feld.value = start;
      return s;
    }
    const A = seite("a", "Vorher", "Prompt A", "");
    const B = seite("b", "Nachher", "Prompt B", "");
    const seiten = [A, B];

    function zaehlePruef(s) {
      const n = s.pruefBoxen.filter((p) => p.cb.checked).length;
      s.pruefSumme.textContent = n + " von 4";
    }
    function zusammen(s) {
      const p = s.feld.value.trim(), m = material.value.trim();
      if (p.includes("[MATERIAL]")) return p.split("[MATERIAL]").join(m || "(kein Material angegeben)");
      return m ? p + "\n\n" + m : p;
    }
    function aktualisiereSeite(s) {
      const erg = pruefePrompt(s.feld.value);
      const n = erg.filter((e) => e.treffer).length;
      s.summe.textContent = n + " von " + BAUSTEINE.length + " Bausteinen erkannt";
      s.liste.replaceChildren(...erg.map((e) => h("li", { class: e.treffer ? "ja" : "nein" },
        h("span", { class: "sp-mk" }, ic(e.treffer ? "check" : "minus")),
        h("span", { class: "sp-ct" }, h("b", null, e.b.name), h("span", { class: "sp-sr" }, e.treffer ? ": erkannt" : ": fehlt"),
          h("span", { class: "sp-cs" }, e.treffer ? "erkannt an „" + e.treffer + "“" : e.b.tipp)))));
      s.vorschau.textContent = zusammen(s);
    }
    function alleAktualisieren() { seiten.forEach(aktualisiereSeite); }
    L.on(material, "input", alleAktualisieren);

    function waehle(v) {
      if (laeuft) return;
      vorlage = v;
      vorlagenEl.querySelectorAll("button").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.v === v.id)));
      A.feld.value = v.a; B.feld.value = v.b; material.value = v.material;
      seiten.forEach(zuruecksetzen);
      alleAktualisieren();
    }
    function zuruecksetzen(s) {
      s.durchlauf = 0; s.letzteTokens = null;
      s.antwort.replaceChildren(h("span", { class: "sp-leer" }, "Die Antwort erscheint hier."));
      s.status.textContent = "Noch nichts gesendet."; s.zahl.textContent = "";
      s.pruefBoxen.forEach((p) => { p.cb.checked = false; }); zaehlePruef(s);
    }

    /* ---- Senden */
    const sendeBtn = h("button", { type: "button", class: "btn primary", onclick: () => starte(seiten) }, ic("send"), "Beide senden");
    const stoppBtn = h("button", { type: "button", class: "btn", hidden: true, onclick: stoppen }, ic("stop"), "Stopp");
    const meld = h("p", { class: "sp-meldung", role: "alert", hidden: true });


    function knoepfeSetzen() {
      sendeBtn.disabled = laeuft; stoppBtn.hidden = !laeuft;
      seiten.forEach((s) => { s.nochmal.disabled = laeuft; });
      vorlagenEl.querySelectorAll("button").forEach((b) => { b.disabled = laeuft; });
    }
    let pauseEnde = null;
    function stoppen() { stopp = true; if (aktuelleCtrl) aktuelleCtrl.abort(); if (pauseEnde) pauseEnde(); }
    function meldung(t) { meld.hidden = !t; meld.textContent = t || ""; }

    async function starte(liste) {
      if (laeuft || L.weg) return;
      meldung("");
      for (const s of liste) {
        if (!s.feld.value.trim()) { meldung("Schreib zuerst einen Prompt für " + s.titel + "."); s.feld.focus(); return; }
        if (zusammen(s).length > MAXGESAMT) { meldung("Prompt und Material sind zusammen zu lang. Kürze " + s.titel + " oder das Material."); return; }
      }
      laeuft = true; stopp = false; knoepfeSetzen();
      liste.forEach((s, i) => { if (i > 0 || liste.length > 1) s.status.textContent = i === 0 ? "Gleich dran." : "Wartet, bis " + liste[0].titel + " fertig ist."; });
      try {
        for (const s of liste) { if (stopp || L.weg) break; await anfrage(s); }
      } finally {
        laeuft = false;
        liste.forEach((s) => { if (stopp && /^Wartet|^Gleich/.test(s.status.textContent)) s.status.textContent = "Nicht gesendet, abgebrochen."; });
        if (!L.weg) knoepfeSetzen();
      }
    }
    const pause = (ms) => new Promise((res) => {
      const t = L.timeout(() => { pauseEnde = null; res(); }, ms);
      pauseEnde = () => { L.clear(t); pauseEnde = null; res(); };
    });

    async function anfrage(s) {
      const nachricht = zusammen(s);
      s.durchlauf++;
      const vorher = s.letzteTokens;
      s.pruefBoxen.forEach((p) => { p.cb.checked = false; }); zaehlePruef(s);
      for (let versuch = 1; versuch <= VERSUCHE; versuch++) {
        if (stopp || L.weg) { s.status.textContent = "Abgebrochen."; return; }
        s.status.textContent = versuch === 1 ? "Das Modell liest den Prompt …" : "Neuer Versuch " + versuch + " von " + VERSUCHE + " …";
        const erg = await streame(s, nachricht);
        if (erg.art === "belegt" && versuch < VERSUCHE && !stopp) {
          s.status.textContent = "Der Rechner ist gerade ausgelastet, nichts falsch gemacht. Neuer Versuch in " + Math.round(WARTE_MS / 1000) + " Sekunden (Wiederholung " + versuch + " von " + (VERSUCHE - 1) + ").";
          await pause(WARTE_MS);
          continue;
        }
        abschluss(s, erg, vorher);
        return;
      }
    }
    async function streame(s, nachricht) {
      const c = L.ctrl(); aktuelleCtrl = c; s.ctrl = c;
      const t0 = performance.now();
      let tErst = 0, roh = "", art = "ok", gekappt = false, fertigAnzeige = false;
      let rafOffen = false, letzt = lies(""), stoppePlatz = null;
      const zeichne = () => {
        rafOffen = false;
        s.antwort.textContent = letzt.text;
        s.zahl.textContent = letzt.tokens.length + " Token";
        s.antwort.scrollTop = s.antwort.scrollHeight;
      };
      try {
        const r = await postJson("/api/chat", { nachricht, temperatur: Number(temp.value) }, c.signal);
        if (r.status === 503) {                           // Vorab-Absage: alle Plaetze und Warteplaetze belegt
          let d = null; try { d = await r.clone().json(); } catch (e) { /* kein JSON */ }
          if (d && d.belegt) return { art: "belegt" };
        }
        if (!r.ok) return { art: "fehler", text: await fehlerText(r) };
        stoppePlatz = KL.last.beobachten((i) => { if (!tErst) s.status.textContent = KL.last.platzText(i); });
        const rd = r.body.getReader(), dec = new TextDecoder();
        for (;;) {
          const { done, value } = await rd.read();
          if (done) break;
          roh += dec.decode(value, { stream: true });
          letzt = lies(roh);
          if (letzt.belegt) { art = "belegt"; break; }
          if (letzt.tokens.length && !tErst) { tErst = performance.now(); s.status.textContent = "Das Modell schreibt …"; }
          if (!ruhig() || !fertigAnzeige) { if (!rafOffen) { rafOffen = true; requestAnimationFrame(zeichne); } }
          if (letzt.tokens.length >= MAXTOK) { gekappt = true; c.abort(); break; }
        }
        roh += dec.decode();
        letzt = lies(roh);
      } catch (e) {
        if (!(e && e.name === "AbortError")) return { art: "fehler", text: NETZ };
        art = gekappt ? "ok" : "abbruch";
      } finally { if (stoppePlatz) stoppePlatz(); L.frei(c); if (aktuelleCtrl === c) aktuelleCtrl = null; }
      if (letzt.belegt) art = "belegt";
      else if (letzt.fehler && !letzt.tokens.length) art = "fehler";
      zeichne();
      s.antwort.scrollTop = 0;                 // nach dem Ende wieder an den Anfang der Antwort
      return { art, text: letzt.fehler, n: letzt.tokens.length, gekappt, erst: tErst ? tErst - t0 : null, gesamt: performance.now() - t0, antwort: letzt.text, fehler: letzt.fehler };
    }
    function abschluss(s, erg, vorher) {
      if (erg.art === "belegt") {
        s.status.textContent = KL.last.TEXT + " Drücke auf Nochmal, wenn du magst.";
        s.antwort.replaceChildren(h("span", { class: "sp-leer" }, "Die Antwort kommt, sobald der Rechner frei ist."));
        s.durchlauf--; return;
      }
      if (erg.art === "fehler") {
        s.status.textContent = erg.text || "Das hat nicht geklappt.";
        if (!s.antwort.textContent.trim()) s.antwort.replaceChildren(h("span", { class: "sp-leer" }, "Diesmal gab es keine Antwort. Die Meldung oben sagt, woran es lag."));
        s.durchlauf--; return;
      }
      if (erg.art === "abbruch") { s.status.textContent = "Abgebrochen nach " + erg.n + " Token."; s.letzteTokens = erg.n; return; }
      s.letzteTokens = erg.n;
      let t = "Fertig: " + erg.n + " Token in " + sek(erg.gesamt) + (erg.erst != null ? ", das erste nach " + sek(erg.erst) : "") + ".";
      if (erg.gekappt) t += " Die Anzeige endet nach " + MAXTOK + " Token, damit der Jetson frei bleibt.";
      if (erg.fehler) t += " " + erg.fehler;
      if (s.durchlauf > 1 && vorher != null) t += " Durchlauf " + s.durchlauf + ", beim letzten Mal waren es " + vorher + " Token.";
      s.status.textContent = t;
    }

    /* ---- Aufbau */
    const paar = (...k) => h("div", { class: "sp-paar" }, ...k);
    root.append(
      KL.gruppe("Aufgabe aus dem Alltag", [KL.zeile("Vorlage", vorlagenEl, null, true)]),
      h("div", { class: "sp-sektion" },
        h("label", { class: "w-ueber", for: matId }, "Material, auf das sich die Prompts beziehen"), material,
        h("p", { class: "w-leise sp-klein sp-vor" }, "Steht „[MATERIAL]“ im Prompt, wird es durch diesen Text ersetzt. Steht es nicht darin, hängt die Werkstatt das Material unten an.")),
      h("div", { class: "sp-sektion" },
        paar(A.kopf, B.kopf), paar(A.feld, B.feld),
        paar(h("div", { class: "sp-check" }, h("h4", null, "Bausteine im Prompt"), A.summe, A.liste), h("div", { class: "sp-check" }, h("h4", null, "Bausteine im Prompt"), B.summe, B.liste)),
        paar(A.vorschauBox, B.vorschauBox),
        hinweis("Die Prüfung der Bausteine ist eine Heuristik: Sie sucht Stichwörter wie „du bist“ oder „höchstens“. Sie erkennt Hinweise auf einen Baustein, nicht, ob er gut ist.")),
      h("div", { class: "sp-sektion" },
        KL.gruppe("Temperatur", [reglerEl], { fuss: ["Links gleichmäßig, wiederholbar. Rechts abwechslungsreich, schwankend.", "Die Fragen laufen nacheinander. Jeder Prompt steht für sich, das Modell erinnert sich an nichts."], aktion: [sendeBtn, stoppBtn] }),
        meld),
      h("div", { class: "sp-sektion" },
        paar(h("div", { class: "sp-akopf" }, h("b", null, "Antwort auf Vorher"), A.zahl, A.nochmal), h("div", { class: "sp-akopf" }, h("b", null, "Antwort auf Nachher"), B.zahl, B.nochmal)),
        paar(A.status, B.status), paar(A.antwort, B.antwort), KL.kiHinweis ? KL.kiHinweis() : null, paar(A.pruef, B.pruef),
        hinweis("Kleine Modelle schwanken: Dieselbe Frage bringt bei jedem Durchlauf eine andere Antwort, besonders bei hoher Temperatur. Drück mehrmals auf „Nochmal“ und prüfe, ob der Unterschied zwischen Vorher und Nachher bleibt.")));
    waehle(VORLAGEN[0]);
    knoepfeSetzen();
    return { destroy() { stopp = true; L.destroy(); } };
  };

  /* ============================================================ 3. Risiko-Spiel */
  const RUNDE = 10;
  function kurzText(t, n) {
    const e = t.replace(/\s+/g, " ").trim();
    if (e.length <= n) return e;
    const k = e.slice(0, n), i = k.lastIndexOf(" ");
    return (i > 30 ? k.slice(0, i) : k) + " …";
  }
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function mische(arr, r) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  /* Runde: je Art mindestens zwei Karten, der Rest aus dem Vorrat, alles gemischt. Gleicher Startwert, gleiche Runde. */
  function bauRunde(szenarien, arten, seed) {
    const r = rng(seed);
    const ids = Object.keys(arten);
    const gewaehlt = [];
    for (const a of ids) gewaehlt.push(...mische(szenarien.filter((s) => s.art === a), r).slice(0, 2));
    const rest = mische(szenarien.filter((s) => !gewaehlt.includes(s)), r);
    gewaehlt.push(...rest.slice(0, Math.max(0, RUNDE - gewaehlt.length)));
    return mische(gewaehlt, r).slice(0, RUNDE).map((s) => ({ s, optionen: mische(s.optionen, r) }));
  }

  KL.widgets["risiko-spiel"] = function (root) {
    const L = leben();
    root.classList.add("w-wid", "sp-wid", "sp-rs");
    let daten = null, runde = [], idx = 0, seed = 0, phase = "laden", gewaehlt = null;
    let ergebnisse = [];                       // {art, richtig, fehler, titel}
    const koerper = h("div", { class: "sp-koerper" });
    const status = h("p", { class: "sp-nur-sr", role: "status", "aria-live": "polite" });
    root.append(koerper, status);

    async function laden() {
      koerper.replaceChildren(h("p", { class: "w-leise" }, "Die Karten werden geladen …"));
      const c = L.ctrl();
      try {
        const r = await fetch("/static/daten/risiko-szenarien.json", { cache: "no-cache", signal: c.signal });
        if (!r.ok) throw new Error("status");
        const d = await r.json();
        if (!d || !Array.isArray(d.szenarien) || !d.szenarien.length || !d.arten) throw new Error("format");
        daten = d;
        start();
      } catch (e) {
        if (e && e.name === "AbortError") return;
        koerper.replaceChildren(h("p", { class: "sp-meldung", role: "alert" }, "Die Karten ließen sich nicht laden. Lade die Seite neu und versuche es noch einmal."));
      } finally { L.frei(c); }
    }

    /* ---- Startbild */
    function start() {
      phase = "start";
      const sid = neueId("seed");
      const feld = h("input", { type: "text", id: sid, class: "sp-seed", inputmode: "numeric", maxlength: 6, value: String(Math.floor(Math.random() * 9000) + 1000), "aria-describedby": sid + "-h" });
      const go = () => { const n = parseInt(feld.value.replace(/\D/g, ""), 10); neueRunde(Number.isFinite(n) ? n : 1); };
      const gehe = h("button", { type: "button", class: "btn primary", onclick: go }, ic("play"), "Runde starten");
      L.on(feld, "keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); go(); } });
      const artenEl = h("ul", { class: "sp-arten" }, Object.values(daten.arten).map((a) => h("li", null, h("b", null, a.name), " ", a.kurz === "Erfunden?" ? "Ist diese Antwort erfunden?" : a.kurz === "Injection?" ? "Steckt eine versteckte Anweisung im Text?" : a.kurz === "Datenschutz" ? "Darf dieser Text in ein öffentliches Modell?" : "Wer prüft das Ergebnis?")));
      koerper.replaceChildren(
        h("h3", { class: "sp-h3" }, "Erkenne die Risiken"),
        h("p", { class: "sp-text" }, "Zehn Karten aus dem Arbeitsalltag mit Sprachmodellen. Du entscheidest, danach siehst du sofort die Erklärung. Alle Texte und Personen sind erfunden."),
        artenEl,
        h("div", { class: "sp-startzeile" },
          KL.gruppe(null, [KL.zeile("Startwert", feld, sid)], { fuss: h("p", { id: sid + "-h" }, "Gleicher Startwert, gleiche Karten in gleicher Reihenfolge."), aktion: [gehe], klasse: "sp-seedbox" })),
        h("p", { class: "w-leise sp-klein" }, "Bedienung: Mit den Tasten 1 bis 3 wählst du eine Antwort, mit Enter geht es weiter."));
      feld.select();
    }
    function neueRunde(s) {
      seed = s; runde = bauRunde(daten.szenarien, daten.arten, seed); idx = 0; ergebnisse = [];
      karte();
    }

    /* ---- Karte */
    function bloecke(s) {
      return s.bloecke.map((b) => {
        const kopf = h("span", { class: "sp-bk" }, b.titel);
        const inhalt = b.art === "code" || b.art === "mail" || b.art === "text" || b.art === "antwort" || b.art === "quelle"
          ? h(b.art === "code" ? "pre" : "div", { class: "sp-bt sp-bt-" + b.art }, b.text)
          : h("p", { class: "sp-bt sp-bt-" + b.art }, b.text);
        return h("div", { class: "sp-block sp-b-" + b.art }, kopf, inhalt);
      });
    }
    function karte() {
      phase = "frage"; gewaehlt = null;
      const k = runde[idx], s = k.s, art = daten.arten[s.art];
      const titel = h("h3", { class: "sp-h3 sp-ktitel", tabindex: "-1" }, s.titel);
      const rueck = h("div", { class: "sp-rueck", "aria-live": "polite" });
      const knoepfe = k.optionen.map((o, i) => h("button", { type: "button", class: "sp-opt", "data-id": o.id, onclick: () => waehle(o) },
        h("span", { class: "sp-nr", "aria-hidden": "true" }, String(i + 1)), h("span", { class: "sp-ot" }, o.t), h("span", { class: "sp-om", "aria-hidden": "true" })));
      const weiter = h("button", { type: "button", class: "btn primary sp-weiter", hidden: true, onclick: naechste }, idx + 1 < runde.length ? "Weiter" : "Auswertung", ic("arrow"));
      const richtigBisher = ergebnisse.filter((e) => e.richtig).length;
      const fortschritt = h("div", { class: "sp-fort", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": runde.length, "aria-valuenow": idx, "aria-label": "Fortschritt" }, h("i", { style: "width:" + (idx / runde.length * 100) + "%" }));
      koerper.replaceChildren(
        h("div", { class: "sp-kopfzeile" },
          h("span", { class: "sp-zahl" }, "Karte " + (idx + 1) + " von " + runde.length),
          h("span", { class: "chip sp-art" }, art.kurz),
          h("span", { class: "sp-stand mono", "aria-label": richtigBisher + " richtig bisher" }, richtigBisher + " richtig")),
        fortschritt, titel,
        h("div", { class: "sp-blocke" }, bloecke(s)),
        h("div", { class: "sp-opts", role: "group", "aria-label": "Deine Entscheidung" }, knoepfe),
        rueck, weiter);
      koerper._refs = { rueck, knoepfe, weiter, titel };
      status.textContent = "Karte " + (idx + 1) + " von " + runde.length + ". " + s.titel;
      titel.focus({ preventScroll: true });
    }
    function waehle(o) {
      if (phase !== "frage") return;
      phase = "antwort"; gewaehlt = o;
      const k = runde[idx], s = k.s, ref = koerper._refs;
      const ok = o.id === s.richtig;
      const richtigOpt = s.optionen.find((x) => x.id === s.richtig);
      ergebnisse.push({ art: s.art, richtig: ok, fehler: ok ? null : (o.f || "Verwechselt"), titel: s.titel, id: s.id, richtigText: richtigOpt.t });
      ref.knoepfe.forEach((b) => {
        b.disabled = true;
        const id = b.dataset.id;
        const m = b.querySelector(".sp-om");
        if (id === s.richtig) { b.classList.add("richtig"); m.replaceChildren(ic("check"), h("span", { class: "sp-nur-sr" }, " (richtig)")); }
        else if (id === o.id) { b.classList.add("falsch"); m.replaceChildren(ic("x"), h("span", { class: "sp-nur-sr" }, " (deine Wahl, falsch)")); }
        if (id === o.id) b.classList.add("gewaehlt");
      });
      ref.rueck.className = "sp-rueck " + (ok ? "ok" : "nein");
      // Element.replaceChildren(null) schriebe das Wort "null" in die Seite: leere Teile vorher herausfiltern
      ref.rueck.replaceChildren(...[
        h("p", { class: "sp-urteil" }, ic(ok ? "check" : "x"), ok ? "Richtig." : "Nicht ganz."),
        ok ? null : h("p", { class: "sp-text" }, "Richtig wäre: " + richtigOpt.t + "."),
        h("p", { class: "sp-text" }, s.erklaerung),
        h("p", { class: "sp-tun" }, h("b", null, "Was du tun würdest: "), s.tun)].filter(Boolean));
      ref.weiter.hidden = false;
      ref.weiter.focus({ preventScroll: false });
      const n = ergebnisse.filter((e) => e.richtig).length;
      const stand = koerper.querySelector(".sp-stand");
      if (stand) { stand.textContent = n + " richtig"; stand.setAttribute("aria-label", n + " richtig bisher"); }
      const fl = koerper.querySelector(".sp-fort i");
      if (fl) fl.style.width = ((idx + 1) / runde.length * 100) + "%";
    }
    function naechste() {
      if (phase !== "antwort") return;
      idx++;
      if (idx >= runde.length) ende(); else karte();
    }

    /* ---- Auswertung */
    function ende() {
      phase = "ende";
      const n = ergebnisse.filter((e) => e.richtig).length;
      const proArt = Object.entries(daten.arten).map(([id, a]) => {
        const e = ergebnisse.filter((x) => x.art === id);
        return { id, a, gesamt: e.length, richtig: e.filter((x) => x.richtig).length };
      }).filter((x) => x.gesamt);
      const fehler = {};
      ergebnisse.filter((e) => !e.richtig).forEach((e) => { fehler[e.fehler] = (fehler[e.fehler] || 0) + 1; });
      const top = Object.entries(fehler).sort((a, b) => b[1] - a[1]);
      const schwach = proArt.filter((x) => x.richtig < x.gesamt).sort((a, b) => a.richtig / a.gesamt - b.richtig / b.gesamt)[0];
      const falsche = ergebnisse.filter((e) => !e.richtig);
      let urteil;
      if (n === ergebnisse.length) urteil = "Alles richtig. Du erkennst die typischen Fälle.";
      else if (n >= ergebnisse.length * 0.7) urteil = "Gut. Ein paar Fälle sind noch tückisch.";
      else urteil = "Hier lohnt sich ein zweiter Durchgang. Lies die Erklärungen unten.";
      koerper.replaceChildren(
        h("h3", { class: "sp-h3 sp-ktitel", tabindex: "-1" }, "Auswertung"),
        h("p", { class: "sp-gross" }, n + " von " + ergebnisse.length + " richtig"),
        h("p", { class: "sp-text" }, urteil),
        h("div", { class: "sp-arten-erg" }, proArt.map((x) => h("div", { class: "sp-ae" },
          h("span", { class: "sp-aen" }, x.a.name), h("span", { class: "sp-aez mono" }, x.richtig + " von " + x.gesamt),
          h("span", { class: "sp-bar sp-bar-klein", "aria-hidden": "true" }, h("i", { style: "width:" + (x.richtig / x.gesamt * 100) + "%" }))))),
        top.length
          ? h("div", { class: "sp-verwechslung" }, h("h4", null, "Das verwechselst du noch"),
            h("ul", null, top.slice(0, 3).map(([t, c]) => h("li", null, t + (c > 1 ? " (" + c + " Mal)" : "")))),
            schwach ? h("p", { class: "sp-text" }, h("b", null, schwach.a.name + ": "), schwach.a.tipp) : null)
          : h("div", { class: "sp-verwechslung" }, h("h4", null, "Das verwechselst du noch"), h("p", { class: "sp-text" }, "In dieser Runde nichts. Probiere eine andere Runde mit einem neuen Startwert.")),
        falsche.length ? h("div", { class: "sp-nachlesen" }, h("h4", null, "Zum Nachlesen"),
          h("ul", null, falsche.map((e) => h("li", null, h("span", null, kurzText(daten.szenarien.find((s) => s.id === e.id).bloecke[0].text, 80)), h("b", { class: "sp-rt" }, "Richtig: " + e.richtigText))))) : "",
        h("div", { class: "sp-endknoepfe" },
          h("button", { type: "button", class: "btn primary", onclick: () => neueRunde(seed) }, ic("refresh"), "Dieselbe Runde noch einmal"),
          h("button", { type: "button", class: "btn", onclick: () => neueRunde(Math.floor(Math.random() * 9000) + 1000) }, ic("shuffle"), "Neue Runde"),
          h("button", { type: "button", class: "btn", onclick: start }, "Startwert wählen")));
      status.textContent = "Auswertung: " + n + " von " + ergebnisse.length + " richtig.";
      const t = koerper.querySelector(".sp-ktitel"); if (t) t.focus({ preventScroll: true });
    }

    /* Tastatur: 1 bis 9 waehlt eine Antwort */
    L.on(document, "keydown", (e) => {
      if (phase !== "frage" || e.ctrlKey || e.metaKey || e.altKey) return;
      const ziel = e.target;
      if (ziel && /^(INPUT|TEXTAREA|SELECT)$/.test(ziel.tagName)) return;
      if (!root.isConnected) return;
      if (!/^[1-9]$/.test(e.key)) return;
      const o = runde[idx].optionen[Number(e.key) - 1];
      if (o) { e.preventDefault(); waehle(o); }
    });

    laden();
    return { destroy() { phase = "ende"; L.destroy(); } };
  };
})();
