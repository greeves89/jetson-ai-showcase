/* demo-koerper: Labor "Körperhaltung" (Seite koerperhaltung, Kamera-Modus "koerper", Server app/lab_koerper.py).
   Baut auf webcam() aus demos.js auf: KL.kameraModi.koerper beschreibt Beschriftung, Hinweis, Messwerte-Karte (eigenschaften)
   und die Bedienung (extra: Modus, Übung, Zielpose). Der Server schickt mit jedem Bild ein JSON mit person, ansicht, messwerte,
   uebung, haltung oder nachmachen; die Oberfläche zeigt nur das, was dort steht.
   Das Bild kommt gespiegelt zurück (wie im Spiegel). Der Browser spiegelt deshalb auch die Vorschau links (CSS .d-koerper).
   SICHERHEIT: Alle Werte und Sätze kommen aus dem Netz und gelangen nur per h(...) und textContent ins DOM, nie als HTML. */
(function () {
  "use strict";
  const KL = window.KL;
  const h = KL.h;
  const ic = (n) => KL.icon(n);
  const de = (x, d = 0) => Number(x).toFixed(d).replace(".", ",");

  const MODI = [
    { id: "skelett", name: "Skelett", icon: "person-standing",
      satz: "Das Skelett besteht aus 33 Punkten. Blasse Teile sind unsicher. Die Zahlen an Ellbogen und Knien sind Winkel in Grad, 180 heißt gestreckt." },
    { id: "spiegel", name: "Bewegungs-Spiegel", icon: "activity",
      satz: "Wähle eine Übung. Der Jetson zählt mit und gibt kurze Rückmeldungen. Das ist ein Spiel mit Punkten im Bild und kein Ersatz für Training oder Therapie." },
    { id: "schreibtisch", name: "Haltung am Schreibtisch", icon: "ruler",
      satz: "Setz dich so hin, dass Kopf und Schultern im Bild sind. Der Jetson sammelt ein paar Sekunden lang Bilder und gibt dann einen freundlichen Hinweis. Das ist keine Diagnose." },
    { id: "nachmachen", name: "Pose nachmachen", icon: "target",
      satz: "Mach die Pose nach. Der helle Umriss im Bild zeigt, wo Arme und Beine hin sollen. Die Zahl sagt, wie ähnlich die Richtungen deiner Arme und Beine der Pose sind." },
  ];
  const UEBUNGEN = [
    { id: "kniebeuge", name: "Kniebeuge", aufbau: "Stell dich seitlich zur Kamera, die Beine ganz im Bild. Geh in die Knie und richte dich wieder auf." },
    { id: "arme-heben", name: "Arme heben", aufbau: "Stell dich mit dem Gesicht zur Kamera. Hebe beide Arme über den Kopf und senke sie wieder." },
    { id: "armkreisen", name: "Arme kreisen", aufbau: "Stell dich mit dem Gesicht zur Kamera. Strecke die Arme zur Seite aus und kreise mit beiden Armen." },
    { id: "seitneigung", name: "Seitneigung", aufbau: "Stell dich mit dem Gesicht zur Kamera. Neige den Oberkörper abwechselnd zur linken und zur rechten Seite." },
  ];
  const ZIELE = [
    { id: "haende-hoch", name: "Hände hoch" },
    { id: "t-pose", name: "T-Pose" },
    { id: "baum", name: "Baum" },
  ];
  const ANSICHT_TEXT = { vorn: "von vorn", seite: "von der Seite", schraeg: "schräg" };

  /* Zeilen der Messwerte-Karte: Schlüssel im JSON, Name, Art der Darstellung */
  const ZEILEN = [
    ["ellbogen_l", "Ellbogen links", "winkel"], ["ellbogen_r", "Ellbogen rechts", "winkel"],
    ["knie_l", "Knie links", "winkel"], ["knie_r", "Knie rechts", "winkel"],
    ["huefte_l", "Hüfte links", "winkel"], ["huefte_r", "Hüfte rechts", "winkel"],
    ["rumpf_seitlich", "Oberkörper", "rumpf"], ["schulter_schief", "Schultern", "schulter"], ["kopf_vor", "Kopf zu den Schultern", "kopf"],
  ];

  function messwerteKarte() {
    const felder = {};
    const zeilen = ZEILEN.map(([k, name, art]) => {
      const wert = h("b", null, "·");
      const balken = art === "winkel" ? h("div", { class: "balken d-kh-balken", "aria-hidden": "true" }, h("i")) : null;
      felder[k] = { wert, balken };
      return h("div", { class: "d-feld d-kh-feld" }, h("span", null, name), wert, balken);
    });
    const ansicht = h("b", null, "·");
    const gesehen = h("b", null, "·");
    const leer = h("p", { class: "d-hinweis" }, "Stell dich so ins Bild, dass man dich zum großen Teil sieht. Dann erscheint hier das Skelett mit seinen Winkeln.");
    const el = h("aside", { class: "d-eigen d-kh-karte", "aria-label": "Gelenkwinkel live" },
      h("h3", { class: "d-eigen-titel" }, ic("person-standing"), "Gelenkwinkel live"),
      h("div", { class: "d-feld d-kh-feld" }, h("span", null, "Ansicht"), ansicht),
      h("div", { class: "d-feld d-kh-feld" }, h("span", null, "Sichere Punkte"), gesehen),
      ...zeilen, leer);
    const setze = (f, t) => { if (f.textContent !== t) f.textContent = t; };
    function zeige(d) {
      leer.hidden = !!d.person;
      if (!d.person) {
        setze(ansicht, "keine Person");
        setze(gesehen, "·");
        for (const [k] of ZEILEN) { setze(felder[k].wert, "·"); if (felder[k].balken) felder[k].balken.firstChild.style.width = "0"; }
        return;
      }
      const m = d.messwerte || {};
      setze(ansicht, ANSICHT_TEXT[d.ansicht] || "unklar");
      setze(gesehen, (d.gesehen || 0) + " von 33");
      for (const [k, , art] of ZEILEN) {
        const v = m[k];
        let t;
        if (art === "winkel") t = v == null ? "nicht sichtbar" : v + "°";
        else if (v == null) t = "nicht sichtbar";
        else if (art === "rumpf") t = Math.abs(v) < 1 ? "gerade" : de(Math.abs(v)) + "° nach " + (v > 0 ? "rechts" : "links");
        else if (art === "schulter") t = d.ansicht !== "vorn" ? "nur von vorn" : Math.abs(v) < 1 ? "gleich hoch" : (v > 0 ? "linke" : "rechte") + " " + de(Math.abs(v), 1) + "° höher";
        else t = d.ansicht !== "seite" ? "nur von der Seite" : de(v) + "°";
        setze(felder[k].wert, t);
        if (felder[k].balken) felder[k].balken.firstChild.style.width = v == null ? "0" : Math.max(0, Math.min(100, v / 180 * 100)) + "%";
      }
    }
    return { el, zeige };
  }

  function bedienung(api) {
    let modus = "skelett", uebung = "kniebeuge", ziel = "haende-hoch";
    const knopf = (liste, aktuell, bei, klasse) => liste.map((e) => {
      const b = h("button", { type: "button", class: klasse, "aria-pressed": String(e.id === aktuell()), onclick: () => bei(e.id) }, e.icon ? ic(e.icon) : null, e.name);
      b.dataset.id = e.id;
      return b;
    });
    const markiere = (box, id) => box.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.id === id)));

    // Kopf: vier Modi
    const modiBox = h("div", { class: "d-kh-modi", role: "group", "aria-label": "Was soll der Jetson mit dem Skelett machen?" });
    const satz = h("p", { class: "d-hinweis d-kh-satz" });

    // Bewegungs-Spiegel
    const uebBox = h("div", { class: "d-kh-chips", role: "group", "aria-label": "Übung wählen" });
    const aufbau = h("p", { class: "d-hinweis" });
    const zahl = h("b", { class: "d-kh-zahl" }, "0");
    const zahlName = h("span", null, "Wiederholungen");
    const seitenZahl = h("span", { class: "d-kh-seiten", hidden: true });
    const rueck = h("p", { class: "d-kh-rueck", "aria-live": "polite" }, "Starte die Kamera, dann zählt der Jetson mit.");
    const phase = h("span", { class: "chip d-kh-phase" }, "bereit");
    const reset = h("button", { type: "button", class: "btn klein", onclick: () => { api.sende({ neu: true }); zahl.textContent = "0"; seitenZahl.textContent = ""; } }, ic("rotate-cw"), "Zähler auf null");
    const spiegel = h("div", { class: "d-kh-panel" },
      uebBox, aufbau,
      h("div", { class: "d-kh-zaehler" }, h("div", { class: "d-kh-zahlbox" }, zahl, zahlName, seitenZahl), rueck),
      h("div", { class: "zeile" }, phase, reset),
      h("p", { class: "d-hinweis" }, "Kein Ersatz für Training oder Therapie. Der Jetson sieht nur flache Punkte im Bild und kann Haltung und Belastung nicht beurteilen."));

    // Haltung am Schreibtisch
    const hinweise = h("ul", { class: "d-kh-hinweise", "aria-live": "polite" }, h("li", null, "Starte die Kamera und setz dich an deinen Platz."));
    const hAnsicht = h("span", { class: "chip" }, "Ansicht: noch offen");
    const tisch = h("div", { class: "d-kh-panel" },
      hinweise, h("div", { class: "zeile" }, hAnsicht),
      h("p", { class: "d-hinweis" }, "Das sind Hinweise aus einfachen Regeln über Punkte im Bild. Sie sind keine Diagnose und keine medizinische Aussage."),
      h("details", { class: "d-kh-warum" },
        h("summary", null, "Warum von vorn und von der Seite verschieden gerechnet wird"),
        h("p", null, "Das Modell sieht ein flaches Bild und setzt Punkte hinein. Ob dein Kopf vor den Schultern steht, ist eine Frage der Tiefe. Von vorn liegen Nase und Brustbein in einer Linie, egal wie weit der Kopf nach vorn wandert. Erst von der Seite siehst du den Abstand zwischen Ohr und Schulter."),
        h("p", null, "Umgekehrt sieht man schiefe Schultern nur von vorn. Von der Seite liegen beide übereinander. Außerdem verdeckt von der Seite die nähere Schulter die andere. Verdeckte Punkte schätzt das Modell nur, sie sind unsicherer und erscheinen im Bild blass.")));

    // Pose nachmachen
    const zielBox = h("div", { class: "d-kh-chips", role: "group", "aria-label": "Zielpose wählen" });
    const zielSatz = h("p", { class: "d-hinweis" }, "Wähle eine Pose und stell dich so hin, dass man dich ganz sieht.");
    const prozent = h("b", { class: "d-kh-zahl" }, "·");
    const prozentBalken = h("div", { class: "balken gruen d-kh-balken-gross", "aria-hidden": "true" }, h("i"));
    const stuecke = h("ul", { class: "d-kh-stuecke", "aria-label": "Arme und Beine einzeln" });
    const geschafft = h("span", { class: "chip" }, "Geschafft: 0");
    const banner = h("p", { class: "d-kh-rueck", "aria-live": "polite" }, "");
    const nachmachen = h("div", { class: "d-kh-panel" },
      zielBox, zielSatz,
      h("div", { class: "d-kh-zaehler" }, h("div", { class: "d-kh-zahlbox" }, prozent, h("span", null, "Ähnlichkeit in Prozent")), prozentBalken),
      stuecke, banner,
      h("div", { class: "zeile" }, geschafft, h("button", { type: "button", class: "btn klein", onclick: () => { api.sende({ neu: true }); } }, ic("rotate-cw"), "Zähler auf null")),
      h("p", { class: "d-hinweis" }, "So wird gerechnet: Für jeden der acht Arm- und Beinabschnitte zählt die Richtung. Null Grad Abweichung geben volle Punkte, ab 45 Grad gibt es keine. Die Zahl ist der Mittelwert. Welche Seite oder welches Bein du nimmst, ist egal. Mit weniger als sechs sichtbaren Abschnitten gibt es keine Zahl."));

    const panels = { skelett: h("div", { class: "d-kh-panel" }), spiegel, schreibtisch: tisch, nachmachen };
    const el = h("section", { class: "d-kh", "aria-label": "Bedienung des Körperlabors" }, modiBox, satz, panels.skelett, spiegel, tisch, nachmachen);

    function zeigeModus() {
      markiere(modiBox, modus);
      const m = MODI.find((x) => x.id === modus);
      satz.textContent = m.satz;
      for (const [id, p] of Object.entries(panels)) p.hidden = id !== modus;
    }
    function zeigeUebung() {
      markiere(uebBox, uebung);
      aufbau.textContent = UEBUNGEN.find((u) => u.id === uebung).aufbau;
      zahlName.textContent = uebung === "armkreisen" ? "Kreise" : uebung === "seitneigung" ? "Neigungen" : "Wiederholungen";
      seitenZahl.hidden = uebung !== "seitneigung";
    }
    function sendeAlles() { api.sende({ ansicht: modus, uebung, ziel }); }

    modiBox.append(...knopf(MODI, () => modus, (id) => { modus = id; zeigeModus(); api.sende({ ansicht: id }); }, "d-kh-modus"));
    uebBox.append(...knopf(UEBUNGEN, () => uebung, (id) => { uebung = id; zeigeUebung(); zahl.textContent = "0"; api.sende({ uebung: id }); }, "chip d-kh-chip"));
    zielBox.append(...knopf(ZIELE, () => ziel, (id) => { ziel = id; markiere(zielBox, id); api.sende({ ziel: id }); }, "chip d-kh-chip"));
    zeigeModus(); zeigeUebung();
    api.beiVerbindung(sendeAlles);

    const setzeText = (f, t) => { if (f.textContent !== t) f.textContent = t; };
    function aktualisiere(d) {
      if (!d.person) {
        if (modus === "schreibtisch" && hinweise.dataset.stand !== "keine") {
          hinweise.dataset.stand = "keine";
          hinweise.replaceChildren(h("li", null, "Ich sehe dich noch nicht. Setz dich so hin, dass Kopf und Schultern im Bild sind."));
        }
        return;
      }
      if (modus === "spiegel" && d.uebung) {
        setzeText(zahl, String(d.uebung.zaehler));
        setzeText(rueck, d.uebung.rueckmeldung || "");
        setzeText(phase, { bereit: "bereit", oben: "oben", runter: "geht nach unten", unten: "unten", hoch: "kommt hoch", unten_ruhe: "unten", rauf: "geht nach oben", kreisen: "kreist", aufrecht: "aufrecht", neigen: "neigt sich", geneigt: "geneigt" }[d.uebung.phase] || d.uebung.phase);
        if (d.uebung.seiten) setzeText(seitenZahl, "links " + d.uebung.seiten.links + ", rechts " + d.uebung.seiten.rechts);
      } else if (modus === "schreibtisch" && d.haltung) {
        const texte = (d.haltung.hinweise || []).map((x) => x.text);
        if (texte.join("|") !== hinweise.dataset.stand) {
          hinweise.dataset.stand = texte.join("|");
          hinweise.replaceChildren(...texte.map((t) => h("li", null, t)));
        }
        setzeText(hAnsicht, "Ansicht: " + (ANSICHT_TEXT[d.haltung.ansicht] || "noch offen") + " (aus " + d.haltung.bilder + " Bildern)");
      } else if (modus === "nachmachen" && d.nachmachen) {
        const n = d.nachmachen;
        setzeText(prozent, n.aehnlichkeit == null ? "keine Zahl" : n.aehnlichkeit + " %");
        prozentBalken.firstChild.style.width = (n.aehnlichkeit || 0) + "%";
        setzeText(zielSatz, n.hinweis || "");
        setzeText(geschafft, "Geschafft: " + n.geschafft);
        setzeText(banner, n.gerade ? "Geschafft. Löse die Pose, dann kannst du sie noch einmal machen." : n.aehnlichkeit == null ? "Zu wenig von dir ist im Bild, ich kann noch nichts vergleichen." : "");
        const stand = n.stuecke.map((s) => s.name + (s.sichtbar ? (s.ok ? "+" : "-") : "?")).join("|");
        if (stand !== stuecke.dataset.stand) {
          stuecke.dataset.stand = stand;
          stuecke.replaceChildren(...n.stuecke.map((s) => h("li", { class: "d-kh-stueck " + (!s.sichtbar ? "unklar" : s.ok ? "ok" : "offen") },
            ic(!s.sichtbar ? "eye-off" : s.ok ? "circle-check" : "circle-x"), h("span", null, s.name),
            h("i", { class: "d-kh-stand" }, !s.sichtbar ? "nicht sichtbar" : s.ok ? "stimmt" : "noch nicht"))));
        }
      }
    }
    api.beiAntwort(aktualisiere);
    return el;
  }

  (KL.kameraModi = KL.kameraModi || {}).koerper = {
    dingMehr: "Personen",
    suche: "nach einer Person",
    klasse: "d-koerper",
    beschriftung: ["Deine Kamera (gespiegelt)", "Skelett vom Jetson (gespiegelt)"],
    hinweis: "Alles hier sind Schätzungen eines KI-Modells über Punkte im Bild. Sie können falsch sein, vor allem bei Verdeckung, weite Kleidung und ungewöhnlichen Körpern. Hinweise zur Haltung sind keine Diagnose, Übungen sind kein Ersatz für Training oder Therapie. Es wird nichts gespeichert.",
    statusUrl: "/api/koerperhaltung/status",
    statusFehler: "Dieses Labor ist auf diesem Jetson noch nicht eingerichtet: Die Modelle für das Körperskelett fehlen. Der Betreiber holt sie mit scripts/modelle_laden.sh.",
    eigenschaften: messwerteKarte,
    treffer: (d) => (d.person ? "1" : "0") + (d.weitere ? " (+" + d.weitere + " nicht ausgewertet)" : ""),
    gefunden: (d) => (d.person ? "Gefunden: eine Person, " + (d.gesehen || 0) + " von 33 Punkten sicher gesehen." + (d.weitere ? " Weitere Personen im Bild werden nicht ausgewertet." : "")
      : "Gefunden: keine Person."),
    extra: bedienung,
  };
  KL.demos = KL.demos || {};
  KL.demos["webcam-koerperhaltung"] = (root, seite) => KL.kamera(root, "koerper", seite);
})();
