/* KI-Labor: Klassenmodus (Seiten klassenmodus, klasse-mitmachen, klasse-wand).
   Vier Bausteine: KL.widgets["klasse-lehrkraft"], ["klasse-schueler"], ["klasse-wand"] und die Protokollpruefung.
   Server: app/lab_klasse.py (WebSocket /ws/klasse). Regeln, die hier gelten:
     - Der Code und der Lehrer-Schluessel stehen NIE in einer Adresse, nur in WebSocket-Nachrichten.
     - Gespeichert wird nur in sessionStorage des eigenen Tabs (Lehrkraft: Code und Schluessel, Schueler: Wiederverbindungs-Schluessel).
       Beides wird beim Ende der Sitzung geloescht. Kein localStorage, keine Cookies.
     - Es gibt keine Freitexteingabe der Teilnehmenden. Fragetexte kommen aus den vorhandenen Lektionen (Quiz, Echt oder KI?,
       Prompt-Werkstatt) und stehen in diesem Browser, nicht auf dem Server. Der Server kennt nur Art, Zahl der Moeglichkeiten und
       einen Verweis wie quiz:ml:2. */
(function () {
  "use strict";
  const KL = window.KL;
  const { h, icon } = KL;

  const LEHRER_SP = "kl-klasse";
  const SCHUELER_SP = "kl-klasse-teiln";
  const BUCHSTABEN = ["A", "B", "C", "D", "E", "F"];

  /* ---------------------------------------------------------------- Speicher im eigenen Tab */
  const sp = {
    lesen(name) { try { return JSON.parse(sessionStorage.getItem(name) || "null"); } catch (e) { return null; } },
    setzen(name, wert) { try { sessionStorage.setItem(name, JSON.stringify(wert)); } catch (e) { /* ohne Speicher geht es auch */ } },
    loeschen(name) { try { sessionStorage.removeItem(name); } catch (e) { /* egal */ } },
  };

  /* ---------------------------------------------------------------- Verbindung */
  const wsUrl = () => (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/ws/klasse";

  /** Haelt eine WebSocket-Verbindung. erste() liefert die Anmelde-Nachricht (bei jedem Verbinden neu).
      Ruft bei(msg) fuer jede Nachricht, status(text) bei Verbindungswechsel. Verbindet bis zum "ende" von selbst neu. */
  function verbindung({ erste, bei, status, bleibt = true }) {
    let ws = null, zu = false, versuche = 0, ping = 0, retry = 0, beendet = false;
    function auf() {
      if (zu) return;
      status && status("verbinde");
      ws = new WebSocket(wsUrl());
      ws.onopen = () => {
        versuche = 0;
        ws.send(JSON.stringify(erste()));
        clearInterval(ping);
        ping = setInterval(() => { if (ws && ws.readyState === 1) ws.send('{"t":"ping"}'); }, 25000);
      };
      ws.onmessage = (e) => {
        let m; try { m = JSON.parse(e.data); } catch (x) { return; }
        if (m.t === "ende") beendet = true;
        if (m.t === "fehler" && !bleibt) zu = true;
        bei(m);
      };
      ws.onclose = () => {
        clearInterval(ping);
        if (zu || beendet) { status && status("zu"); return; }
        status && status("getrennt");
        versuche++;
        retry = setTimeout(auf, Math.min(8000, 800 * 2 ** Math.min(versuche, 4)));
      };
      ws.onerror = () => { /* onclose folgt */ };
    }
    auf();
    return {
      senden(o) { if (ws && ws.readyState === 1) { ws.send(JSON.stringify(o)); return true; } return false; },
      beenden() { zu = true; clearTimeout(retry); clearInterval(ping); try { ws && ws.close(); } catch (e) { /* egal */ } },
      stoppeNeuverbinden() { zu = true; clearTimeout(retry); },
    };
  }

  async function zaehlerHolen() {
    try {
      const r = await fetch("/api/klasse/zaehler", { cache: "no-store" });
      if (!r.ok) return null;
      return await r.json();
    } catch (e) { return null; }
  }

  /* ---------------------------------------------------------------- Aufgaben aus vorhandenem Material */
  const I = () => window.INHALT;
  const quizSeiten = () => Object.entries(I().seiten).filter(([, s]) => Array.isArray(s.quiz) && s.quiz.some((q) => q.optionen && q.optionen.length >= 2 && q.optionen.length <= 6))
    .map(([id, s]) => ({ id, titel: s.nav || s.titel }));
  function promptPaare() {
    const s = I().seiten["prompts-schule"];
    const paare = [];
    for (const a of (s && s.abschnitte) || []) {
      const c = a.code || [];
      const schlecht = c.find((x) => /Schlecht/.test(x.titel)), gut = c.find((x) => /Gut/.test(x.titel));
      if (schlecht && gut) paare.push({ titel: a.h, schlecht: schlecht.text, gut: gut.text });
    }
    return paare;
  }
  const eokKarten = () => KL.echtOderKiKarten || [];

  /** Verweis -> Anzeige. Rueckgabe: { frage, optionen:[..], bild, loesung (Index oder null), extra } */
  function anzeige(a) {
    const ref = a.ref || "";
    let m;
    if ((m = /^quiz:([a-z0-9-]+):(\d+)$/.exec(ref))) {
      const q = ((I().seiten[m[1]] || {}).quiz || [])[Number(m[2])];
      if (q && q.optionen.length === a.n) return { frage: q.frage, optionen: q.optionen.slice(), loesung: q.richtig, extra: q.erklaerung };
    }
    if ((m = /^eok:(\d+)$/.exec(ref))) {
      const k = eokKarten().find((x) => x.n === Number(m[1]));
      if (k) return { frage: "Echt oder KI? Was ist dein Tipp?", optionen: ["Echt", "KI"], bild: KL.echtOderKiBild(k), loesung: k.ki ? 1 : 0, extra: k.hinweis + " " + k.quelle };
    }
    if ((m = /^prompt:(\d+):([01])$/.exec(ref))) {
      const p = promptPaare()[Number(m[1])];
      if (p) {
        const vertauscht = m[2] === "1";
        const A = vertauscht ? p.gut : p.schlecht, B = vertauscht ? p.schlecht : p.gut;
        return { frage: "Welcher Prompt ist besser?", optionen: ["Prompt A", "Prompt B"], texte: [A, B], loesung: vertauscht ? 0 : 1,
          extra: "Der gute Prompt nennt Aufgabe, Niveau, Zeit und Format. Die Aufgabe heißt: " + p.titel + "." };
      }
    }
    if (a.art === "skala") return { frage: "Wie sehr stimmst du zu?", optionen: ["1", "2", "3", "4", "5"], skala: true, loesung: null, extra: "1 heißt gar nicht, 5 heißt voll und ganz." };
    if (a.art === "schaetzung") return { frage: "Was schätzt du?", optionen: [], loesung: null, extra: "" };
    if (ref === "jn" || (a.n === 2 && !ref)) return { frage: "Ja oder Nein?", optionen: ["Ja", "Nein"], loesung: null, extra: "" };
    return { frage: "Wähle eine Antwort.", optionen: BUCHSTABEN.slice(0, a.n), loesung: null, extra: "Die Frage stellt die Lehrkraft." };
  }

  /* ---------------------------------------------------------------- gemeinsame Teile der Oberflaeche */
  const mmss = (s) => { s = Math.max(0, Math.floor(s)); const m = Math.floor(s / 60); return m + ":" + String(s % 60).padStart(2, "0"); };
  const hinweis = (symbol, ...kids) => h("p", { class: "kl-hinweis" }, icon(symbol), h("span", null, ...kids));

  /** Aufgabe auf Wand und Lehrkraft: Frage, Bild, Texte. */
  function aufgabeKarte(a, info, gross) {
    const k = h("div", { class: "kl-aufgabe" + (gross ? " gross" : "") });
    k.append(h("p", { class: "kl-frage" }, info.frage));
    if (info.bild) k.append(h("div", { class: "eok-bildbox kl-bild" }, h("img", { class: "eok-bild", src: info.bild, alt: "Bild zur Frage: echt oder KI-erzeugt" })));
    if (info.texte) {
      k.append(h("div", { class: "kl-texte" }, info.texte.map((t, i) => h("div", { class: "kl-text" }, h("b", null, info.optionen[i]), h("p", null, t)))));
    } else if (info.optionen.length && a.art === "wahl") {
      k.append(h("ol", { class: "kl-optionen", type: "A" }, info.optionen.map((o) => h("li", null, o))));
    }
    if (a.art === "schaetzung") k.append(h("p", { class: "kl-bereich" }, "Schätze eine Zahl von " + a.lo + " bis " + a.hi + "."));
    return k;
  }

  /** Balken fuer ein Ergebnis. Felder mit -1 zeigen "unter 3". */
  function ergebnisBalken(a, info, erg, meine) {
    const wurzel = h("div", { class: "kl-ergebnis" });
    if (erg.zu_wenige) {
      wurzel.append(hinweis("shield-check", "Zu wenige Antworten, um sie zu zeigen. Ab " + erg.mindestens + " Antworten gibt es ein Ergebnis. So bleibt niemand erkennbar."));
      return wurzel;
    }
    const maxwert = Math.max(1, ...erg.zellen);
    const zeilen = erg.zellen.map((c, i) => {
      let name;
      if (a.art === "schaetzung") name = (erg.grenzen[i]) + " bis " + (i === erg.zellen.length - 1 ? erg.grenzen[i + 1] : erg.grenzen[i + 1] - 1);
      else if (a.art === "skala") name = String(i + 1);
      else name = info.optionen[i] != null ? info.optionen[i] : BUCHSTABEN[i];
      const richtig = a.art === "wahl" && erg.loesung === i;
      const meins = meine != null && meine === i;
      const klein = c === -1;
      const breite = klein ? 6 : Math.round((c / maxwert) * 100);
      return h("li", { class: "kl-zeile" + (richtig ? " richtig" : "") + (meins ? " meins" : "") },
        h("span", { class: "kl-name" }, name, richtig ? h("span", { class: "kl-marke" }, icon("check"), "richtig") : null, meins ? h("span", { class: "kl-marke leise" }, icon("user-round"), "dein Tipp") : null),
        h("span", { class: "kl-bahn", "aria-hidden": "true" }, h("span", { class: "kl-balken" + (klein ? " klein" : ""), style: "width:" + breite + "%" })),
        h("span", { class: "kl-zahl" }, klein ? "verdeckt" : String(c)));
    });
    wurzel.append(h("ul", { class: "kl-zeilen" }, zeilen));
    const fuss = [];
    if (erg.gesamt != null) fuss.push(erg.gesamt + " Antworten");
    else fuss.push("Gesamtzahl verdeckt");
    if (a.art === "skala" && erg.mittelwert != null) fuss.push("Mittelwert " + String(erg.mittelwert).replace(".", ","));
    if (a.art === "schaetzung" && erg.median != null) fuss.push("Mitte der Schätzungen (Median) " + String(erg.median).replace(".", ","));
    if (a.art === "schaetzung" && erg.loesung != null) fuss.push("richtig: " + erg.loesung);
    wurzel.append(h("p", { class: "kl-fuss" }, fuss.join(", ")));
    if (erg.unter_drei) wurzel.append(hinweis("shield-check", "Felder mit 1 oder 2 Antworten und das jeweils kleinste sichtbare Feld bleiben verdeckt, die Gesamtzahl auch. So lässt sich niemand erraten."));
    return wurzel;
  }

  /* ---------------------------------------------------------------- Lehrkraft */
  KL.widgets["klasse-lehrkraft"] = function (root) {
    const wurzel = h("div", { class: "kl" });
    root.append(wurzel);
    let verb = null, daten = null, stand = null, ende = null, status = "zu", zaehlerZeit = 0, timer = 0, zaehlerVorher = null, zaehlerNachher = null;
    let schluesselSichtbar = false, bestaetigen = 0;
    let waehlArt = null;
    const oeffnen = () => sp.lesen(LEHRER_SP);

    function starten() {
      if (verb) return;
      verb = verbindung({
        erste: () => { const c = oeffnen(); return c ? { t: "lehrer", code: c.code, schluessel: c.key } : { t: "neu" }; },
        bei: nachricht, status: (s) => { status = s; zeichnen(); }, bleibt: true,
      });
    }

    function nachricht(m) {
      if (m.t === "erstellt") { daten = { code: m.code, key: m.schluessel }; sp.setzen(LEHRER_SP, daten); }
      else if (m.t === "stand") { stand = m; if (!daten) daten = oeffnen(); }
      else if (m.t === "ende") {
        sp.loeschen(LEHRER_SP);
        ende = { protokoll: m.nachweis || "", zeit: new Date() };
        stand = null; if (verb) verb.stoppeNeuverbinden();
        zaehlerNachher = null;
        zaehlerHolen().then((z) => { zaehlerNachher = z; zeichnen(); });
      } else if (m.t === "fehler") {
        if (/Diesen Code gibt es nicht|Schlüssel stimmt nicht|beendet/.test(m.text)) { sp.loeschen(LEHRER_SP); daten = null; if (verb) { verb.beenden(); verb = null; } }
        meldung(m.text);
      }
      zeichnen();
    }
    let fehlertext = "";

    async function zaehlerAuffrischen() {
      const z = await zaehlerHolen();
      if (z) { zaehler = z; zeichnen(); }
    }
    let zaehler = null;
    timer = setInterval(() => {
      if (stand) { stand.rest_s = Math.max(0, stand.rest_s - 1); const e = wurzel.querySelector(".kl-rest"); if (e) e.textContent = mmss(stand.rest_s); }
      if (Date.now() - zaehlerZeit > 10000) { zaehlerZeit = Date.now(); zaehlerAuffrischen(); }
    }, 1000);

    /* ---- Aufgaben starten */
    function aufgabeStarten(msg) { if (verb) verb.senden(Object.assign({ t: "aktivitaet" }, msg)); waehlArt = null; formular(); }

    function artWahl() {
      const kacheln = [
        ["jn", "circle-check", "Ja oder Nein", "Du stellst die Frage mündlich, die Klasse antwortet."],
        ["ab", "list", "Auswahl A bis F", "Zwei bis sechs Möglichkeiten, die Frage steht an der Tafel."],
        ["skala", "sliders-horizontal", "Skala 1 bis 5", "Zustimmung oder Einschätzung."],
        ["schaetzung", "target", "Schätzfrage", "Eine Zahl in einem Bereich, den du festlegst."],
        ["quiz", "clipboard-check", "Quiz einer Lektion", "Eine Frage aus dem Selbsttest einer Seite."],
        ["eok", "images", "Echt oder KI?", "Ein Bild aus dem Kartenset, die Klasse tippt."],
        ["prompt", "message-square", "Prompt-Vergleich", "Welcher Prompt ist besser? Aus der Prompt-Werkstatt."],
      ];
      return h("div", { class: "kl-arten", role: "group", "aria-label": "Art der Aufgabe" }, kacheln.map(([id, ic, titel, text]) =>
        h("button", { type: "button", class: "kl-art" + (waehlArt === id ? " aktiv" : ""), "aria-pressed": waehlArt === id ? "true" : "false", onclick: () => { waehlArt = waehlArt === id ? null : id; formular(); } },
          icon(ic), h("b", null, titel), h("span", null, text))));
    }

    function artFormular() {
      if (!waehlArt) return null;
      const box = h("div", { class: "kl-form" });
      const starten = (txt, fn) => h("button", { type: "button", class: "btn primary", onclick: fn }, icon("play"), txt);
      if (waehlArt === "jn") box.append(starten("Starten", () => aufgabeStarten({ art: "wahl", n: 2, ref: "jn" })));
      if (waehlArt === "ab") {
        const sel = h("select", { id: "kl-ab-n", "aria-label": "Anzahl der Möglichkeiten" }, [2, 3, 4, 5, 6].map((n) => h("option", { value: String(n), selected: n === 4 }, n + " Möglichkeiten (A bis " + BUCHSTABEN[n - 1] + ")")));
        box.append(h("label", { for: "kl-ab-n" }, "Wie viele Möglichkeiten?"), sel, starten("Starten", () => aufgabeStarten({ art: "wahl", n: Number(sel.value), ref: "ab" })));
      }
      if (waehlArt === "skala") box.append(starten("Starten", () => aufgabeStarten({ art: "skala", ref: "skala" })));
      if (waehlArt === "schaetzung") {
        const lo = h("input", { type: "number", id: "kl-lo", value: "0", inputmode: "numeric" }), hi = h("input", { type: "number", id: "kl-hi", value: "100", inputmode: "numeric" });
        const fehler = h("p", { class: "kl-fehler", role: "alert" });
        box.append(h("label", { for: "kl-lo" }, "Kleinste Zahl"), lo, h("label", { for: "kl-hi" }, "Größte Zahl"), hi, fehler, starten("Starten", () => {
          const a = Number(lo.value), b = Number(hi.value);
          if (!Number.isInteger(a) || !Number.isInteger(b) || a >= b || Math.abs(a) > 1e6 || Math.abs(b) > 1e6) { fehler.textContent = "Gib zwei ganze Zahlen ein, die kleinere zuerst (Betrag höchstens eine Million)."; return; }
          aufgabeStarten({ art: "schaetzung", lo: a, hi: b, ref: "schaetzung" });
        }));
      }
      if (waehlArt === "quiz") {
        const seiten = quizSeiten();
        const wunsch = new URLSearchParams(location.search).get("quiz");
        const selS = h("select", { id: "kl-qs", "aria-label": "Seite mit Selbsttest" }, seiten.map((s) => h("option", { value: s.id, selected: s.id === wunsch }, s.titel)));
        const selF = h("select", { id: "kl-qf", "aria-label": "Frage" });
        const vorschau = h("div", { class: "kl-vorschau" });
        const fuellen = () => {
          const qs = (I().seiten[selS.value] || {}).quiz || [];
          selF.replaceChildren(...qs.map((q, i) => ({ q, i })).filter(({ q }) => q.optionen.length >= 2 && q.optionen.length <= 6).map(({ q, i }) => h("option", { value: String(i) }, (i + 1) + ". " + q.frage.slice(0, 70))));
          zeigen();
        };
        const zeigen = () => {
          const q = ((I().seiten[selS.value] || {}).quiz || [])[Number(selF.value)];
          vorschau.replaceChildren(q ? h("div", null, h("p", { class: "kl-frage" }, q.frage), h("ol", { type: "A" }, q.optionen.map((o) => h("li", null, o)))) : "");
        };
        selS.addEventListener("change", fuellen); selF.addEventListener("change", zeigen);
        box.append(h("label", { for: "kl-qs" }, "Seite"), selS, h("label", { for: "kl-qf" }, "Frage"), selF, vorschau,
          starten("Starten", () => { const q = ((I().seiten[selS.value] || {}).quiz || [])[Number(selF.value)]; if (q) aufgabeStarten({ art: "wahl", n: q.optionen.length, ref: "quiz:" + selS.value + ":" + selF.value }); }));
        fuellen();
      }
      if (waehlArt === "eok") {
        const karten = eokKarten();
        const sel = h("select", { id: "kl-ek", "aria-label": "Karte" }, [h("option", { value: "zufall" }, "Zufällige Karte"), ...karten.map((k) => h("option", { value: String(k.n) }, "Karte " + k.n))]);
        box.append(h("label", { for: "kl-ek" }, "Welche Karte?"), sel, hinweis("info", "Die Lösung steht erst auf der Wand, wenn du \"Lösung zeigen\" drückst."),
          starten("Starten", () => { const n = sel.value === "zufall" ? karten[Math.floor(Math.random() * karten.length)].n : Number(sel.value); aufgabeStarten({ art: "wahl", n: 2, ref: "eok:" + n }); }));
      }
      if (waehlArt === "prompt") {
        const paare = promptPaare();
        const sel = h("select", { id: "kl-pp", "aria-label": "Aufgabe" }, paare.map((p, i) => h("option", { value: String(i) }, p.titel)));
        box.append(h("label", { for: "kl-pp" }, "Welche Aufgabe?"), sel, hinweis("info", "Welcher Prompt links steht, wird zufällig bestimmt."),
          starten("Starten", () => aufgabeStarten({ art: "wahl", n: 2, ref: "prompt:" + sel.value + ":" + (Math.random() < 0.5 ? 0 : 1) })));
      }
      return box;
    }

    /* ---- Anzeige der laufenden Aufgabe */
    function laufend() {
      const a = stand.aktivitaet;
      if (!a) return h("p", { class: "leise" }, "Noch keine Aufgabe. Wähle unten eine Art und starte sie.");
      const info = anzeige(a);
      const box = h("div", { class: "kl-laufend" });
      box.append(aufgabeKarte(a, info, false));
      if (!a.zeigen) box.append(h("p", { class: "kl-fortschritt", role: "status" }, icon("users"), h("span", null, a.antworten + " von " + stand.teilnehmer + " haben geantwortet.")));
      const knoepfe = h("div", { class: "kl-knoepfe" });
      if (a.offen) knoepfe.append(h("button", { type: "button", class: "btn", onclick: () => verb.senden({ t: "schliessen" }) }, icon("lock"), "Aufgabe schließen"));
      if (!a.zeigen) knoepfe.append(h("button", { type: "button", class: "btn primary", onclick: () => verb.senden({ t: "zeigen" }) }, icon("eye"), "Ergebnis zeigen"));
      else knoepfe.append(h("button", { type: "button", class: "btn", onclick: () => verb.senden({ t: "verbergen" }) }, icon("eye-off"), "Ergebnis verbergen"));
      if (info.loesung != null && a.art === "wahl") knoepfe.append(h("button", { type: "button", class: "btn tint", onclick: () => verb.senden({ t: "loesung", wert: info.loesung }) }, icon("check"), "Lösung zeigen"));
      box.append(knoepfe);
      if (a.art === "schaetzung") {
        const eingabe = h("input", { type: "number", id: "kl-loes", inputmode: "numeric", "aria-label": "Richtige Zahl" });
        box.append(h("div", { class: "kl-loesung-zeile" }, h("label", { for: "kl-loes" }, "Richtige Zahl"), eingabe,
          h("button", { type: "button", class: "btn tint klein", onclick: () => { const w = Number(eingabe.value); if (Number.isInteger(w)) verb.senden({ t: "loesung", wert: w }); } }, icon("check"), "Lösung zeigen")));
      }
      if (info.extra && a.zeigen) box.append(hinweis("lightbulb", info.extra));
      if (a.zeigen && a.ergebnis) box.append(ergebnisBalken(a, info, a.ergebnis, null));
      return box;
    }

    /* ---- Ende: Loeschprotokoll */
    function endeAnsicht() {
      const box = h("div", { class: "kl-ende" });
      box.append(h("h3", null, icon("shield-check"), "Die Sitzung ist gelöscht"));
      box.append(h("p", null, "Code, Pseudonyme, Antworten und Aufgaben sind beim Dienst entfernt. Das Protokoll unten belegt die Löschung. Der Dienst hält es noch eine Stunde bereit, danach gibt es nur noch deine Kopie."));
      if (zaehlerVorher != null && zaehlerNachher) box.append(h("p", { class: "kl-beweis", role: "status" }, icon("activity"),
        h("span", null, "Aktive Sitzungen im Labor: ", h("b", null, String(zaehlerVorher)), " vor dem Löschen, ", h("b", null, String(zaehlerNachher.aktiv)), " danach.")));
      if (!ende.protokoll) {
        box.append(hinweis("triangle-alert", "Die Sitzung wurde beendet, während du nicht verbunden warst. Ein Protokoll holst du mit dem Code, solange der Dienst es noch hält (eine Stunde)."));
        const code = h("input", { type: "text", maxlength: "6", autocomplete: "off", "aria-label": "Code der beendeten Sitzung", class: "kl-code-eingabe", placeholder: "Code" });
        box.append(h("div", { class: "kl-zeile-form" }, code, h("button", { type: "button", class: "btn", onclick: () => {
          const v = verbindung({ erste: () => ({ t: "nachweis", code: code.value }), bei: (m) => { if (m.nachweis) { ende.protokoll = m.nachweis; zeichnen(); } }, bleibt: false });
          setTimeout(() => v.beenden(), 4000);
        } }, "Protokoll holen")));
        return box;
      }
      box.append(h("pre", { class: "kl-protokoll", tabindex: "0", "aria-label": "Löschprotokoll" }, ende.protokoll));
      const stat = h("p", { class: "kl-status", role: "status", "aria-live": "polite" });
      const pruefErgebnis = h("div", { class: "kl-pruef" });
      box.append(h("div", { class: "kl-knoepfe" },
        h("button", { type: "button", class: "btn primary", onclick: () => {
          const blob = new Blob([ende.protokoll], { type: "text/plain;charset=utf-8" });
          const u = URL.createObjectURL(blob);
          const a = h("a", { href: u, download: "loeschprotokoll-klassenmodus.txt" });
          document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000);
        } }, icon("download"), "Als Textdatei speichern"),
        h("button", { type: "button", class: "btn", onclick: () => drucken(ende.protokoll) }, icon("printer"), "Drucken"),
        h("button", { type: "button", class: "btn", onclick: async () => { stat.textContent = (await KL.kopieren(ende.protokoll)) ? "Protokoll kopiert." : "Nicht kopiert. Markiere den Text und kopiere ihn von Hand."; } }, icon("copy"), "Kopieren"),
        h("button", { type: "button", class: "btn tint", onclick: async () => { pruefErgebnis.replaceChildren(await pruefen(ende.protokoll)); } }, icon("shield-check"), "Signatur jetzt prüfen")), stat, pruefErgebnis);
      box.append(h("p", { class: "leise" }, "Eine öffentliche Prüfseite gibt es auch ohne JavaScript: ", h("a", { href: "/klasse/nachweis" }, "Löschprotokoll prüfen"), ". Dort kann jede Person ein Protokoll einfügen."));
      box.append(h("button", { type: "button", class: "btn", onclick: () => { ende = null; daten = null; stand = null; fehlertext = ""; verb && verb.beenden(); verb = null; zeichnen(); } }, icon("refresh-cw"), "Neue Sitzung vorbereiten"));
      return box;
    }

    function drucken(text) {
      const flaeche = h("div", { id: "klasse-druckflaeche" }, h("h1", null, "Löschprotokoll Klassenmodus"), h("pre", null, text),
        h("p", null, "Prüfen: Auf der Seite /klasse/nachweis des KI-Labors kann das Protokoll eingefügt werden. Es wird nicht gespeichert."));
      document.body.append(flaeche);
      document.documentElement.classList.add("klasse-drucken");
      const weg = () => { flaeche.remove(); document.documentElement.classList.remove("klasse-drucken"); window.removeEventListener("afterprint", weg); };
      window.addEventListener("afterprint", weg);
      window.print();
      setTimeout(weg, 60000);
    }

    /* ---- Gesamt: drei Zustaende (start, lauf, ende). Im Lauf bleibt das Formular unten beim Aktualisieren unberuehrt. */
    let modusAlt = null, oben = null, unten = null, meldungZeit = 0;
    function meldung(text) { fehlertext = text; clearTimeout(meldungZeit); meldungZeit = setTimeout(() => { fehlertext = ""; zeichnen(); }, 6000); }

    function zeichnen() {
      const modus = ende ? "ende" : stand ? "lauf" : "start";
      if (modus !== modusAlt) {
        modusAlt = modus;
        wurzel.replaceChildren();
        if (modus === "lauf") { oben = h("div", { class: "kl-oben" }); unten = h("div", { class: "kl-unten" }); wurzel.append(oben, unten); formular(); }
      }
      if (modus === "lauf") { oben.replaceChildren(...obenAnsicht()); return; }
      if (document.activeElement && wurzel.contains(document.activeElement) && /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
      wurzel.replaceChildren(...(modus === "ende" ? [endeAnsicht()] : startAnsicht()));
    }

    function startAnsicht() {
      const teile = [];
      teile.push(h("p", { class: "kl-lead" }, "Du startest eine Sitzung ohne Konto, ohne E-Mail und ohne Namen. Die Klasse tritt mit einem Code bei. Auf der Wand siehst du nur Summen."));
      teile.push(hinweis("shield-check", "Alles liegt nur im Arbeitsspeicher des Rechners, höchstens zwei Stunden. Du kannst jederzeit löschen und bekommst ein Protokoll."));
      if (fehlertext) teile.push(h("p", { class: "kl-fehler", role: "alert" }, fehlertext));
      teile.push(h("div", { class: "kl-knoepfe" }, h("button", { type: "button", class: "btn primary kl-start-knopf", onclick: starten }, icon("play"), status === "verbinde" ? "Verbinde ..." : "Sitzung starten")));
      if (zaehler) teile.push(h("p", { class: "kl-zaehler", role: "status" }, icon("activity"), h("span", null, "Aktive Sitzungen im Labor: ", h("b", null, String(zaehler.aktiv)), " von höchstens " + zaehler.max)));
      return teile;
    }

    function obenAnsicht() {
      const teile = [];
      const d = daten || oeffnen() || { code: "", key: "" };
      teile.push(h("div", { class: "kl-kopf" },
        h("div", { class: "kl-code-box" }, h("span", { class: "kl-label" }, "Code für die Klasse"), h("span", { class: "kl-code", "aria-label": "Code " + d.code.split("").join(" ") }, d.code),
          h("button", { type: "button", class: "btn klein", onclick: () => KL.kopieren(d.code) }, icon("copy"), "Kopieren")),
        h("div", { class: "kl-werte" },
          h("p", null, icon("users"), h("span", null, h("b", null, stand.teilnehmer + " von " + stand.max_teilnehmer), " dabei")),
          h("p", null, icon("clock"), h("span", null, "Noch ", h("b", { class: "kl-rest" }, mmss(stand.rest_s)))),
          zaehler ? h("p", { class: "kl-zaehler", role: "status" }, icon("activity"), h("span", null, "Aktive Sitzungen im Labor: ", h("b", null, String(zaehler.aktiv)))) : null)));
      if (status === "getrennt") teile.push(hinweis("wifi-off", "Die Verbindung ist weg. Sie wird automatisch wiederhergestellt."));
      if (fehlertext) teile.push(h("p", { class: "kl-fehler", role: "alert" }, fehlertext));
      teile.push(h("p", { class: "kl-beitritt" }, icon("smartphone"), h("span", null, "Die Klasse öffnet ", h("b", null, location.host + "/klasse-mitmachen"), " und gibt den Code ein. Der Code steht in keiner Adresse.")));
      teile.push(h("div", { class: "kl-knoepfe" },
        h("button", { type: "button", class: "btn primary", onclick: () => window.open("/klasse-wand", "_blank") }, icon("presentation"), "Wand öffnen (Beamer)"),
        h("button", { type: "button", class: "btn", "aria-expanded": schluesselSichtbar ? "true" : "false", onclick: () => { schluesselSichtbar = !schluesselSichtbar; zeichnen(); } }, icon(schluesselSichtbar ? "eye-off" : "key-round"), schluesselSichtbar ? "Schlüssel verbergen" : "Lehrer-Schlüssel zeigen")));
      if (schluesselSichtbar) teile.push(h("div", { class: "kl-schluessel" }, h("code", null, d.key),
        h("p", null, "Mit Code und Schlüssel meldest du dich auf einem anderen Gerät wieder an. Der Schlüssel liegt nur in diesem Browser-Tab und steht nie in einer Adresse. Gib ihn nicht weiter, wer ihn hat, steuert die Sitzung.")));
      if (!stand.aktivitaet && stand.namen && stand.namen.length) teile.push(h("div", { class: "kl-namen", "aria-label": "Wer ist dabei" }, stand.namen.map((n) => h("span", { class: "kl-chip" }, n))));
      teile.push(h("h3", null, "Aktuelle Aufgabe"));
      teile.push(laufend());
      return teile;
    }

    function formular() {
      if (!unten) return;
      const d = daten || oeffnen() || { code: "", key: "" };
      unten.replaceChildren(
        h("h3", null, "Nächste Aufgabe"),
        hinweis("info", "Teilnehmende schicken nur Auswahlwerte, keinen Text. Die Frage stellst du mündlich oder sie kommt aus einer Lektion."),
        artWahl(), artFormular() || "",
        h("div", { class: "kl-gefahr" },
          h("p", null, "Mit dem Beenden wird alles gelöscht: Code, Pseudonyme, Antworten. Du bekommst ein Protokoll mit Prüfergebnissen."),
          h("button", { type: "button", class: "btn kl-beenden" + (bestaetigen ? " sicher" : ""), onclick: () => {
            if (!bestaetigen) { bestaetigen = setTimeout(() => { bestaetigen = 0; formular(); }, 5000); formular(); return; }
            clearTimeout(bestaetigen); bestaetigen = 0;
            zaehlerVorher = zaehler ? zaehler.aktiv : null;
            zaehlerHolen().then((z) => { if (z) zaehlerVorher = z.aktiv; if (verb) verb.senden({ t: "beenden", code: d.code }); });
          } }, icon("trash-2"), bestaetigen ? "Wirklich löschen? Noch einmal tippen" : "Sitzung beenden und löschen")));
    }

    // Wiederanmeldung nach Neuladen im selben Tab; Einstieg aus Quiz- oder Echt-oder-KI-Seite ueber ?quiz=<seite> oder ?eok=1
    const param = new URLSearchParams(location.search);
    if (param.get("quiz")) waehlArt = "quiz"; else if (param.get("eok")) waehlArt = "eok";
    zaehlerAuffrischen();
    if (oeffnen()) starten(); else zeichnen();
    return { destroy() { clearInterval(timer); clearTimeout(bestaetigen); clearTimeout(meldungZeit); if (verb) verb.beenden(); } };
  };

  /* ---------------------------------------------------------------- Protokollpruefung */
  async function pruefen(text) {
    const box = h("div", { class: "kl-pruef-ergebnis" });
    try {
      const r = await fetch("/api/klasse/nachweis/pruefen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      if (!r.ok) { box.append(hinweis("triangle-alert", r.status === 429 ? "Zu viele Anfragen. Warte eine Minute." : "Die Prüfung ist gerade nicht möglich.")); return box; }
      const a = await r.json();
      const gut = a.format === "gültig" && a.signatur === "gültig";
      box.classList.add(gut ? "ok" : "nein");
      box.append(h("p", { class: "kl-pruef-kopf" }, icon(gut ? "circle-check" : "circle-x"), h("b", null, gut ? "Format und Signatur sind gültig." : "Das Protokoll ist nicht gültig.")));
      box.append(h("p", null, "Format: " + a.format + ". Signatur: " + a.signatur + (gut ? (a.alle_bestanden ? ". Alle Einzelprüfungen sind bestanden." : ". Mindestens eine Einzelprüfung ist nicht bestanden, lies das Protokoll.") : ".")));
      (a.fehler || []).forEach((f) => box.append(h("p", { class: "kl-fehler" }, f)));
      if (a.hinweis) box.append(h("p", null, a.hinweis));
      box.append(h("p", { class: "leise" }, "Die Signatur zeigt, dass dieser Dienst das Protokoll ausgestellt hat und nichts daran geändert wurde. Die Einzelprüfungen hat der Dienst selbst gefahren."));
    } catch (e) { box.append(hinweis("triangle-alert", "Keine Verbindung zum Dienst.")); }
    return box;
  }

  KL.widgets["klasse-nachweis-pruefen"] = function (root) {
    const feld = h("textarea", { class: "kl-protokoll-eingabe", rows: "10", maxlength: "6000", "aria-label": "Löschprotokoll einfügen", placeholder: "Löschprotokoll hier einfügen" });
    const aus = h("div", { class: "kl-pruef", "aria-live": "polite" });
    root.append(h("div", { class: "kl" }, h("p", null, "Füge ein Löschprotokoll ein. Der Dienst prüft Format und Signatur. Nichts wird gespeichert."), feld,
      h("div", { class: "kl-knoepfe" }, h("button", { type: "button", class: "btn primary", onclick: async () => { aus.replaceChildren(await pruefen(feld.value)); } }, icon("shield-check"), "Prüfen"),
        h("a", { class: "btn", href: "/klasse/nachweis" }, icon("file-check"), "Prüfseite ohne JavaScript")), aus));
    return { destroy() {} };
  };

  KL.demos["klasse-nachweis-pruefen"] = (root) => KL.widgets["klasse-nachweis-pruefen"](root);

  /* ---------------------------------------------------------------- Schueler */
  KL.widgets["klasse-schueler"] = function (root) {
    const wurzel = h("div", { class: "kl kl-schueler" });
    root.append(wurzel);
    let verb = null, st = null, name = "", status = "aus", ende = false, fehler = "", gewaehlt = null, meine = {}, skalaWahl = null;
    const gemerkt = () => sp.lesen(SCHUELER_SP);
    let zeichneFokus = null;

    let gestartet = false;
    function verbinden(code) {
      fehler = ""; gestartet = true;
      verb = verbindung({
        erste: () => { const g = gemerkt(); return g && g.code === code && g.token ? { t: "wieder", code, token: g.token } : { t: "beitritt", code }; },
        bei: nachricht, status: (s) => { status = s; zeichnen(); }, bleibt: true,
      });
    }
    let codeAktuell = "";
    function nachricht(m) {
      if (m.t === "willkommen") sp.setzen(SCHUELER_SP, { code: codeAktuell, token: m.token });
      else if (m.t === "stand") { st = m; name = m.name || name; if (m.aktivitaet && !m.aktivitaet.offen) { /* Auswahl bleibt lokal */ } }
      else if (m.t === "ende") { ende = true; st = null; sp.loeschen(SCHUELER_SP); if (verb) verb.stoppeNeuverbinden(); }
      else if (m.t === "fehler") {
        fehler = m.text;
        if (!st) {            // Beitritt gescheitert
          if (verb) { verb.beenden(); verb = null; }
          sp.loeschen(SCHUELER_SP); gestartet = false;
        }
      }
      zeichnen();
    }

    function senden(a) {
      if (a.art === "skala") { if (skalaWahl == null) return; meine[a.nr] = skalaWahl - 1; verb.senden({ t: "antwort", nr: a.nr, wert: skalaWahl }); return; }
      if (gewaehlt == null) return;
      meine[a.nr] = a.art === "wahl" ? gewaehlt : gewaehlt;
      verb.senden({ t: "antwort", nr: a.nr, wert: gewaehlt });
    }

    function aufgabe(a) {
      const info = anzeige(a);
      const box = h("div", { class: "kl-aufgabe schueler" });
      box.append(aufgabeKarte(a, info, false));
      if (st.aktivitaet.beantwortet) {
        box.append(hinweis("circle-check", "Deine Antwort ist angekommen. Sie ist endgültig. Warte, bis die Lehrkraft das Ergebnis zeigt."));
        return box;
      }
      if (!a.offen) { box.append(hinweis("lock", "Diese Aufgabe ist geschlossen.")); return box; }
      const sendKnopf = h("button", { type: "button", class: "btn primary kl-senden", disabled: true, onclick: () => senden(a) }, icon("send"), "Antwort abschicken");
      if (a.art === "wahl") {
        const gruppe = h("div", { class: "kl-wahl", role: "radiogroup", "aria-label": "Deine Antwort" });
        info.optionen.forEach((o, i) => {
          const kurz = info.texte ? o : o;
          const b = h("button", { type: "button", role: "radio", "aria-checked": "false", class: "kl-wahl-knopf", onclick: () => { gewaehlt = i; gruppe.querySelectorAll("button").forEach((x, j) => { x.setAttribute("aria-checked", j === i ? "true" : "false"); x.classList.toggle("an", j === i); }); sendKnopf.disabled = false; } },
            h("span", { class: "kl-buchst" }, BUCHSTABEN[i]), h("span", { class: "kl-wahl-text" }, kurz));
          gruppe.append(b);
        });
        box.append(gruppe);
      } else if (a.art === "skala") {
        const gruppe = h("div", { class: "kl-skala", role: "radiogroup", "aria-label": "Deine Einschätzung von 1 bis 5" });
        [1, 2, 3, 4, 5].forEach((w) => gruppe.append(h("button", { type: "button", role: "radio", "aria-checked": "false", class: "kl-wahl-knopf kl-skala-knopf", onclick: () => { skalaWahl = w; gruppe.querySelectorAll("button").forEach((x, j) => { x.setAttribute("aria-checked", j + 1 === w ? "true" : "false"); x.classList.toggle("an", j + 1 === w); }); sendKnopf.disabled = false; } }, String(w))));
        box.append(gruppe, h("p", { class: "leise kl-skala-ende" }, h("span", null, "1 gar nicht"), h("span", null, "5 voll und ganz")));
      } else {
        const feld = h("input", { type: "number", class: "kl-zahl-eingabe", inputmode: "numeric", min: String(a.lo), max: String(a.hi), "aria-label": "Deine Schätzung von " + a.lo + " bis " + a.hi });
        feld.addEventListener("input", () => { const w = Number(feld.value); const ok = feld.value !== "" && Number.isInteger(w) && w >= a.lo && w <= a.hi; gewaehlt = ok ? w : null; sendKnopf.disabled = !ok; });
        box.append(feld);
      }
      box.append(sendKnopf);
      return box;
    }

    function zeichnen() {
      if (document.activeElement && wurzel.contains(document.activeElement) && document.activeElement.tagName === "INPUT") return;
      wurzel.replaceChildren(...aufbau());
    }

    function aufbau() {
      if (ende) {
        return [h("div", { class: "kl-ende" }, h("h3", null, icon("shield-check"), "Die Sitzung ist zu Ende"),
          h("p", null, "Die Lehrkraft hat die Sitzung gelöscht oder sie ist abgelaufen. Dein Zufallsname und deine Antworten sind beim Dienst entfernt. Auf deinem Gerät bleibt nichts zurück."),
          h("button", { type: "button", class: "btn", onclick: () => { ende = false; fehler = ""; gestartet = false; verb = null; zeichnen(); } }, icon("refresh-cw"), "Anderer Code"))];
      }
      if (!st) {
        const feld = h("input", { type: "text", id: "kl-code", class: "kl-code-eingabe", maxlength: "6", autocomplete: "off", autocapitalize: "characters", spellcheck: "false", "aria-label": "Code der Klasse", placeholder: "CODE" });
        const los = () => {
          const c = feld.value.trim().toUpperCase();
          if (c.length !== 6) { fehler = "Der Code hat sechs Zeichen."; zeichnen(); return; }
          codeAktuell = c; verbinden(c); zeichnen();
        };
        feld.addEventListener("keydown", (e) => { if (e.key === "Enter") los(); });
        const g = gemerkt();
        if (g && g.code && !gestartet) { codeAktuell = g.code; verbinden(g.code); }
        return [h("p", { class: "kl-lead" }, "Gib den Code ein, den deine Lehrkraft zeigt. Du brauchst keinen Namen und kein Konto."),
          h("div", { class: "kl-zeile-form" }, h("label", { for: "kl-code" }, "Code"), feld, h("button", { type: "button", class: "btn primary", onclick: los }, icon("play"), status === "verbinde" ? "Verbinde ..." : "Mitmachen")),
          fehler ? h("p", { class: "kl-fehler", role: "alert" }, fehler) : null,
          hinweis("shield-check", "Du bekommst einen Zufallsnamen. Niemand sieht, was du antwortest, nur die Summe aller Antworten. Nach der Stunde wird alles gelöscht.")];
      }
      const t = [];
      t.push(h("p", { class: "kl-ich" }, icon("user-round"), h("span", null, "Du bist ", h("b", null, name || "ein Gast"), ". Das ist nur ein Zufallsname."), h("span", { class: "leise" }, st.teilnehmer + " dabei")));
      if (status === "getrennt") t.push(hinweis("wifi-off", "Die Verbindung ist weg. Sie wird automatisch wiederhergestellt."));
      const a = st.aktivitaet;
      if (!a) t.push(h("p", { class: "kl-warten" }, icon("hourglass"), "Gleich geht es los. Warte auf die erste Aufgabe."));
      else {
        t.push(aufgabe(a));
        if (a.zeigen && a.ergebnis) {
          const info = anzeige(a);
          t.push(h("h3", null, "Ergebnis der Klasse"));
          if (info.extra) t.push(hinweis("lightbulb", info.extra));
          t.push(ergebnisBalken(a, info, a.ergebnis, a.art === "wahl" ? meine[a.nr] : a.art === "skala" ? meine[a.nr] : null));
        } else if (!a.offen && !a.zeigen) t.push(hinweis("hourglass", "Die Lehrkraft zeigt das Ergebnis gleich."));
      }
      t.push(h("p", { class: "kl-verlassen" }, h("button", { type: "button", class: "textlink", onclick: () => { if (verb) verb.beenden(); verb = null; st = null; gestartet = false; sp.loeschen(SCHUELER_SP); zeichnen(); } }, icon("x"), "Sitzung verlassen")));
      return t;
    }
    zeichnen();
    return { destroy() { if (verb) verb.beenden(); } };
  };

  /* ---------------------------------------------------------------- Wand */
  KL.widgets["klasse-wand"] = function (root) {
    const wurzel = h("div", { class: "kl kl-wand" });
    root.append(wurzel);
    let verb = null, st = null, ende = false, status = "aus", fehler = "", codeAnzeige = "", gestartet = false;
    const lesen = () => sp.lesen(LEHRER_SP);

    function verbinden(code, key) {
      codeAnzeige = code; gestartet = true;
      verb = verbindung({ erste: () => ({ t: "wand", code, schluessel: key }), bei: (m) => {
        if (m.t === "stand") st = m;
        else if (m.t === "ende") { ende = true; st = null; if (verb) verb.stoppeNeuverbinden(); }
        else if (m.t === "fehler") { fehler = m.text; if (!st) { if (verb) verb.beenden(); verb = null; gestartet = false; } }
        zeichnen();
      }, status: (s) => { status = s; zeichnen(); }, bleibt: true });
    }

    function zeichnen() {
      if (document.activeElement && wurzel.contains(document.activeElement) && document.activeElement.tagName === "INPUT") return;
      wurzel.replaceChildren(...aufbau());
    }

    function aufbau() {
      const voll = h("button", { type: "button", class: "btn klein", onclick: () => { if (document.fullscreenElement) document.exitFullscreen(); else wurzel.requestFullscreen && wurzel.requestFullscreen().catch(() => {}); } }, icon("monitor"), "Vollbild");
      if (ende) return [h("div", { class: "kl-wand-mitte" }, h("h2", null, icon("shield-check"), "Die Sitzung ist beendet und gelöscht"), h("p", null, "Alle Daten dieser Sitzung sind entfernt. Das Löschprotokoll hat die Lehrkraft."))];
      if (!st) {
        const l = lesen();
        if (l && !gestartet && !fehler) { verbinden(l.code, l.key); return [h("p", null, "Verbinde ...")]; }
        if (gestartet && !fehler) return [h("p", null, "Verbinde ...")];
        const code = h("input", { type: "text", id: "kw-code", class: "kl-code-eingabe", maxlength: "6", autocomplete: "off", "aria-label": "Code" });
        const key = h("input", { type: "password", id: "kw-key", autocomplete: "off", "aria-label": "Lehrer-Schlüssel", maxlength: "64", class: "kl-key-eingabe" });
        return [h("p", { class: "kl-lead" }, "Die Wand zeigt nur Summen. Sie braucht Code und Lehrer-Schlüssel. Wenn du sie über den Knopf auf der Lehrerseite geöffnet hast, kennt sie beides schon."),
          h("div", { class: "kl-zeile-form" }, h("label", { for: "kw-code" }, "Code"), code, h("label", { for: "kw-key" }, "Schlüssel"), key,
            h("button", { type: "button", class: "btn primary", onclick: () => { fehler = ""; verbinden(code.value.trim().toUpperCase(), key.value.trim()); zeichnen(); } }, icon("presentation"), "Wand starten")),
          fehler ? h("p", { class: "kl-fehler", role: "alert" }, fehler) : null,
          hinweis("lock", "Code und Schlüssel stehen nie in der Adresse. Die Wand kann nichts steuern.")];
      }
      const a = st.aktivitaet;
      const kopf = h("div", { class: "kl-wand-kopf" },
        h("span", { class: "kl-wand-code" }, icon("users"), h("span", null, st.teilnehmer + " dabei")),
        h("span", { class: "kl-wand-code" }, icon("key-round"), h("span", null, "Code ", h("b", { class: "kl-code klein" }, codeAnzeige))), voll);
      if (!a) {
        return [kopf, h("div", { class: "kl-wand-mitte" }, h("h2", null, "Mach mit"), h("p", { class: "kl-wand-gross" }, "Öffne ", h("b", null, location.host + "/klasse-mitmachen")), h("p", { class: "kl-wand-gross" }, "und gib den Code ", h("b", { class: "kl-code" }, codeAnzeige), " ein."),
          h("div", { class: "kl-namen gross" }, (st.namen || []).map((n) => h("span", { class: "kl-chip" }, n))))];
      }
      const info = anzeige(a);
      const t = [kopf, aufgabeKarte(a, info, true)];
      if (a.zeigen && a.ergebnis) {
        t.push(ergebnisBalken(a, info, a.ergebnis, null));
        if (info.extra) t.push(hinweis("lightbulb", info.extra));
      } else {
        const anteil = st.teilnehmer ? Math.round((a.antworten / st.teilnehmer) * 100) : 0;
        t.push(h("div", { class: "kl-wand-fortschritt", role: "status" },
          h("p", { class: "kl-wand-gross" }, a.antworten + " von " + st.teilnehmer + " haben geantwortet"),
          h("span", { class: "kl-bahn gross", "aria-hidden": "true" }, h("span", { class: "kl-balken", style: "width:" + anteil + "%" })),
          h("p", { class: "leise" }, a.offen ? "Das Ergebnis erscheint, wenn die Lehrkraft es zeigt." : "Die Aufgabe ist geschlossen.")));
      }
      return t;
    }
    zeichnen();
    return { destroy() { if (verb) verb.beenden(); } };
  };
})();
