import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Zettel, Pf, MONO, Etikett, Mark, Zeile } from "../neu.jsx";

const RX = 700, RW = 1130, RY = 215, RH = 760;
// Anker links: Zettel mit der Aufgabe und die Agentenfigur
const Anker = ({ bot = 1, pulse = 0, dim = 0 }) => (
  <>
    <Zettel x={90} y={215} w={560} h={250} rot={-2} a={1 - dim * 0.6}>
      <div style={{ fontSize: 34, color: "#6b5a2a", fontWeight: 700, marginBottom: 8 }}>Aufgabe</div>
      Wann kommt Bestellung 1042?
    </Zettel>
    {pulse > 0 && <div style={{ position: "absolute", left: 80, top: 205, width: 580, height: 270, borderRadius: 20, border: `${6 * pulse}px solid ${C.orange}`, opacity: pulse, boxSizing: "border-box" }} />}
    <div style={{ position: "absolute", left: 90, top: 520, width: 560, height: 455, borderRadius: 28, background: C.panel, border: `3px solid ${C.line}`, opacity: bot, boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: 180, top: 40 }}><Badge name="bot" size={200} color={C.blue} glow={0.6} /></div>
      <Lbl x={0} y={270} w={560} t="Agent" size={72} weight={800} align="center" />
      <Lbl x={0} y={360} w={560} t="Sprachmodell + Werkzeuge" size={40} align="center" color={C.mute} />
    </div>
  </>
);

// ---------- 1 Chat oder Agent
const Chat = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Chat oder Agent" tiefe={["message", 1500, 640, 800]} anker={<Anker bot={0} />}>
      <Panel x={90} y={520} w={560} h={455} r={28} a={o(0.4)}>
        <Lbl x={0} y={30} w={560} t="Die Frage" size={44} align="center" color={C.mute} />
        <Lbl x={30} y={110} w={500} t="Beide bekommen denselben Zettel." size={52} weight={700} align="center" />
      </Panel>
      <Panel x={RX} y={RY} w={RW} h={355} r={28} a={o(cue(0) + 0.2)} rand={C.mute}>
        <div style={{ position: "absolute", left: 40, top: 100 }}><Badge name="message" size={150} color={C.mute} /></div>
        <Lbl x={240} y={36} w={500} t="Chat" size={64} weight={800} />
        <div style={{ position: "absolute", left: 240, top: 130, width: 640, height: 130, borderRadius: 30, background: C.panel2, display: "flex", alignItems: "center", padding: "0 34px", fontSize: 58, fontWeight: 700, opacity: o(cue(0) + 1.0), boxSizing: "border-box" }}>Vermutlich Dienstag.</div>
        <Lbl x={240} y={285} w={650} t="aus dem Gedächtnis, ohne Beleg" size={42} color={C.orange} a={o(cue(0) + 1.6)} />
        <Lbl x={900} y={110} w={200} t="?" size={220} weight={800} color={C.orange} a={o(cue(0) + 1.6)} />
      </Panel>
      <Panel x={RX} y={RY + 395} w={RW} h={365} r={28} a={o(cue(1) - 0.1)} rand={C.blue}>
        <div style={{ position: "absolute", left: 40, top: 110 }}><Badge name="bot" size={150} color={C.blue} /></div>
        <Lbl x={240} y={30} w={500} t="Agent" size={64} weight={800} color={C.blue} />
        {["database", "calendar", "bell"].map((ic, i) => (
          <React.Fragment key={ic}>
            <div style={{ position: "absolute", left: 250 + i * 150, top: 130, opacity: o(cue(1) + 0.5 + i * 0.4) }}><Icon name={ic} size={110} color={C.blue} sw={1.6} /></div>
          </React.Fragment>
        ))}
        <div style={{ position: "absolute", left: 700, top: 120, width: 380, height: 130, borderRadius: 30, background: C.green + "22", border: `4px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, fontWeight: 800, color: C.green, opacity: o(cue(1) + 1.8), boxSizing: "border-box", textAlign: "center", lineHeight: 1.1 }}>Donnerstag<br />14 Uhr</div>
        <Lbl x={240} y={285} w={650} t="sieht nach und tut etwas" size={42} color={C.green} a={o(cue(1) + 2.0)} />
      </Panel>
    </Szene>
  );
};

// ---------- 2 Zettel und Werkzeugkasten
const TOOLS = [["Bestellung suchen", "database"], ["Kalender", "calendar"], ["Rechner", "grid"], ["E-Mail senden", "bell"], ["Datei lesen", "file"], ["Im Web suchen", "search"]];
const TX = (i) => RX + 20 + (i % 3) * 370, TY = (i) => RY + 130 + Math.floor(i / 3) * 290;
const Kachel = ({ x, y, w = 340, h = 260, name, ic, a = 1, rand = C.line, mark }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 24, background: C.panel2, border: `3px solid ${rand}`, opacity: a, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
    <Icon name={ic} size={100} color={mark ? C.blue : C.text} sw={1.6} /><div style={{ fontSize: 44, fontWeight: 700, textAlign: "center", lineHeight: 1.1, padding: "0 12px" }}>{name}</div>
  </div>
);
const Anker2 = () => { const { t, cue } = useCues(); return <Anker bot={ease(t, 0, 0.4)} pulse={Math.max(0, Math.sin(Math.max(0, t - cue(1)) * 3)) * (t > cue(1) ? 1 : 0)} />; };
const Zett = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Zettel und Werkzeugkasten" tiefe={["box", 1500, 640, 800]} anker={<Anker2 />}>
      <Panel x={RX} y={RY} w={RW} h={RH} r={28} a={o(0.3)} />
      <Lbl x={RX + 30} y={RY + 28} w={700} t="Werkzeugkasten" size={64} weight={800} a={o(word(0, "Werkzeugkasten") - 0.3)} />
      {TOOLS.map(([n, ic], i) => <Kachel key={n} x={TX(i)} y={TY(i)} name={n} ic={ic} a={o(word(0, "Werkzeugkasten") + i * 0.2)} rand={i === 0 && t > word(1, "Bestellung") ? C.blue : C.line} mark={i === 0 && t > word(1, "Bestellung")} />)}
      <Pf x1={655} y1={340} x2={RX - 5} y2={TY(0) + 130} p={ease(t, cue(1) + 0.6, cue(1) + 1.2)} f={C.orange} w={7} />
    </Szene>
  );
};

// ---------- 3 Ein Werkzeug (Kachel wächst zur Karte)
const KarteA = ({ u, t, cue }) => {
  const x = lerp(TX(0), RX, u), y = lerp(TY(0), RY, u), w = lerp(340, RW, u), h = lerp(260, RH, u);
  const o = (a) => sp(t, a, 0.6);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 28, background: u > 0.5 ? C.panel : C.panel2, border: `3px solid ${C.blue}`, boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - ease(u, 0, 0.35), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <Icon name="database" size={100} color={C.blue} sw={1.6} /><div style={{ fontSize: 44, fontWeight: 700, textAlign: "center" }}>Bestellung suchen</div>
      </div>
    </div>
  );
};
const Anker3 = () => { const { t, cue } = useCues(); return (<><Anker bot={1} /><KarteA u={ease(t, 0.1, 1.2)} t={t} cue={cue} /></>); };
const Werkzeug = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const rows = [["Name", "bestellung_suchen", true], ["Beschreibung", "Sucht eine Bestellung und nennt den Liefertermin.", false], ["Parameter", "nummer: Zahl", true]];
  return (
    <Szene titel="Ein Werkzeug" tiefe={["edit", 1500, 640, 800]} anker={<Anker3 />}>
      {rows.map(([k, v, m], i) => (
        <div key={k} style={{ position: "absolute", left: RX + 40, top: RY + 60 + i * 210, width: RW - 80, height: 180, borderRadius: 22, background: C.panel2, border: `3px solid ${t > word(1, "Zum Beispiel") && i !== 1 ? C.blue : C.line}`, opacity: o(cue(0) + 0.7 + i * 0.5), boxSizing: "border-box", padding: "18px 34px" }}>
          <div style={{ fontSize: 40, color: C.blue, fontWeight: 700 }}>{k}</div>
          <div style={{ fontSize: m ? 62 : 48, fontWeight: 700, fontFamily: m ? MONO : undefined, marginTop: 6, lineHeight: 1.15 }}>{v}</div>
        </div>
      ))}
      <Etikett x={RX + 40} y={RY + 700} t="Danach wählt das Modell" f={C.orange} size={46} a={o(cue(2))} />
      <Pf x1={RX + 760} y1={RY + 725} x2={RX + 900} y2={RY + 725} p={ease(t, cue(2) + 0.6, cue(2) + 1.2)} f={C.orange} w={6} />
      <div style={{ position: "absolute", left: RX + 930, top: RY + 668, opacity: o(cue(2) + 1.0) }}><Badge name="bot" size={110} color={C.blue} /></div>
    </Szene>
  );
};

// ---------- 4 Schleife
const CX = 1265, CY = 580, R = 230;
const NODE = [["Denken", "bulb", -90], ["Werkzeug aufrufen", "zap", 30], ["Ergebnis lesen", "file", 150]];
const Schleife = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const pos = (deg) => [CX + R * Math.cos(deg * Math.PI / 180), CY + R * Math.sin(deg * Math.PI / 180)];
  const ang = (t - cue(0)) * 55 - 90;
  const [dx, dy] = pos(ang);
  const runde = 1 + Math.floor(Math.max(0, t - cue(0) - 0.5) / 2.4);
  const fertig = ease(t, word(1, "erledigt"), word(1, "erledigt") + 0.8);
  return (
    <Szene titel="Die Schleife" tiefe={["repeat", 1500, 640, 800]} anker={<Anker bot={1} />}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.line} strokeWidth="10" strokeDasharray="4 18" strokeLinecap="round" />
        {[0, 1, 2].map((i) => { const a0 = NODE[i][2] + 30, a1 = NODE[(i + 1) % 3][2] - 30; const [x0, y0] = pos(a0), [x1, y1] = pos(a1); return <path key={i} d={`M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`} fill="none" stroke={C.blue} strokeWidth="9" strokeLinecap="round" opacity={ease(t, 0.5 + i * 0.4, 1.0 + i * 0.4)} />; })}
        <circle cx={dx} cy={dy} r="20" fill={C.orange} opacity={ease(t, cue(0) - 0.2, cue(0) + 0.3)} />
      </svg>
      {NODE.map(([n, ic, deg], i) => { const [x, y] = pos(deg); return (
        <React.Fragment key={n}>
          <div style={{ position: "absolute", left: x - 100, top: y - 100, opacity: o(0.3 + i * 0.4) }}><Badge name={ic} size={200} color={[C.orange, C.blue, C.green][i]} bg="#000" /></div>
          <Lbl x={i === 2 ? x - 120 - 300 : x + 120} y={y - 30} w={300} t={n} size={46} align={i === 2 ? "right" : "left"} a={o(0.5 + i * 0.4)} />
        </React.Fragment>
      ); })}
      <Chip x={CX - 130} y={CY - 50} t={"Runde " + runde} f={C.mute} size={56} a={o(cue(0))} />
      <div style={{ position: "absolute", left: 1620, top: 420, opacity: fertig }}><Etikett x={0} y={0} t="Antwort" f={C.green} size={56} /></div>
      <Pf x1={1560} y1={440} x2={1615} y2={450} p={fertig} f={C.green} w={7} />
    </Szene>
  );
};

// ---------- 5 Programm führt aus
const Programm = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const f1 = ease(t, word(0, "rechne") + 0.4, word(0, "rechne") + 1.4), f2 = ease(t, cue(1) + 1.8, cue(1) + 2.8);
  return (
    <Szene titel="Das Programm führt aus" tiefe={["cpu", 1500, 640, 800]} anker={<Anker bot={1} />}>
      <Panel x={RX} y={300} w={300} h={300} r={28} a={o(0.3)} rand={C.blue}><div style={{ position: "absolute", left: 75, top: 40 }}><Icon name="bot" size={150} color={C.blue} /></div><Lbl x={0} y={215} w={300} t="Modell" size={58} weight={800} align="center" /></Panel>
      <Panel x={RX + 830} y={300} w={300} h={300} r={28} a={o(word(1, "Programm") - 0.3)} rand={C.green}><div style={{ position: "absolute", left: 75, top: 40 }}><Icon name="cpu" size={150} color={C.green} /></div><Lbl x={0} y={215} w={300} t="Programm" size={54} weight={800} align="center" /></Panel>
      <Pf x1={RX + 315} y1={470} x2={RX + 815} y2={470} p={f1} f={C.mute} w={8} />
      <div style={{ position: "absolute", left: RX + 325, top: 365, opacity: f1 > 0 ? 1 : 0 }}>
        <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 800, color: C.orange, background: "#0d0d0f", border: `3px solid ${C.orange}`, borderRadius: 16, padding: "8px 14px", whiteSpace: "nowrap" }}>rechne(240 × 0,18)</div>
      </div>
      <Pf x1={RX + 815} y1={540} x2={RX + 315} y2={540} p={f2} f={C.mute} w={8} />
      <div style={{ position: "absolute", left: lerp(RX + 650, RX + 440, f2), top: 600, opacity: f2 > 0 ? 1 : 0 }}>
        <div style={{ fontFamily: MONO, fontSize: 80, fontWeight: 800, color: C.green, background: "#0d0d0f", border: `3px solid ${C.green}`, borderRadius: 16, padding: "6px 30px" }}>43,2</div>
      </div>
      <Lbl x={RX} y={760} w={RW} t="Das Modell schreibt nur auf, was es braucht." size={48} color={C.mute} a={o(cue(0) + 2.4)} />
      <Lbl x={RX} y={840} w={RW} t="Gerechnet wird außerhalb." size={48} color={C.text} a={o(cue(1) + 0.4)} />
    </Szene>
  );
};

// ---------- 6 Gedächtnis
const VERL = [["Frage", C.text], ["Aufruf: bestellung_suchen", C.blue], ["Ergebnis: Donnerstag", C.green], ["Aufruf: kalender", C.blue], ["Ergebnis: frei", C.green], ["Antwort", C.orange]];
const Gedaechtnis = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const vergessen = ease(t, word(2, "vergisst") - 0.2, word(2, "vergisst") + 0.8);
  return (
    <Szene titel="Gedächtnis" tiefe={["clock", 1500, 640, 800]} anker={<Anker bot={1} />}>
      <Panel x={RX} y={RY} w={700} h={RH} r={28} a={o(0.3)} rand={C.blue} />
      <Lbl x={RX + 30} y={RY + 24} w={640} t="Verlauf" size={60} weight={800} color={C.blue} a={o(0.4)} />
      {VERL.map(([n, f], i) => <div key={n} style={{ position: "absolute", left: RX + 30, top: RY + 120 + i * 100, width: 640, height: 82, borderRadius: 18, background: C.panel2, border: `3px solid ${f}55`, color: f, fontSize: 42, fontWeight: 700, padding: "0 24px", display: "flex", alignItems: "center", boxSizing: "border-box", opacity: o(cue(0) + 0.5 + i * 0.5) * (1 - vergessen) }}>{n}</div>)}
      <Etikett x={RX + 130} y={RY + 330} t="Neustart: leer" f={C.red} size={64} a={vergessen} />
      <Panel x={RX + 740} y={RY} w={390} h={RH} r={28} a={o(cue(1))} rand={C.orange}>
        <div style={{ position: "absolute", left: 105, top: 80 }}><Icon name="file" size={180} color={C.orange} sw={1.4} /></div>
        <Lbl x={0} y={290} w={390} t="Notizen" size={60} weight={800} align="center" color={C.orange} />
        <Lbl x={0} y={370} w={390} t="Akte außerhalb" size={44} align="center" color={C.mute} />
        {["Kunde: Beispiel", "Vorliebe: Mail", "Offen: 1042"].map((s, i) => <div key={s} style={{ position: "absolute", left: 24, top: 470 + i * 90, width: 342, height: 70, borderRadius: 14, background: C.panel2, color: C.text, fontSize: 36, fontWeight: 600, display: "flex", alignItems: "center", padding: "0 16px", boxSizing: "border-box", opacity: o(cue(1) + 0.8 + i * 0.4) }}>{s}</div>)}
      </Panel>
    </Szene>
  );
};

// ---------- 7 Agent oder Ablauf
const Ablauf = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const S = ["Mail lesen", "Daten prüfen", "Ticket anlegen", "Antwort senden"];
  return (
    <Szene titel="Agent oder fester Ablauf" tiefe={["fork", 1500, 640, 800]}>
      <Panel x={90} y={215} w={820} h={760} r={28} a={o(0.3)} rand={C.green} />
      <Lbl x={90} y={240} w={820} t="Fester Ablauf" size={64} weight={800} align="center" color={C.green} a={o(0.4)} />
      {S.map((n, i) => (
        <React.Fragment key={n}>
          <Zeile x={190} y={350 + i * 150} w={620} h={100} t={n} size={48} align="center" rand={C.green} a={o(cue(0) + 0.2 + i * 0.4)} />
          {i < 3 && <Pf x1={500} y1={455 + i * 150} x2={500} y2={495 + i * 150} p={ease(t, cue(0) + 0.5 + i * 0.4, cue(0) + 0.8 + i * 0.4)} f={C.green} w={6} />}
        </React.Fragment>
      ))}
      <Lbl x={90} y={925} w={820} t="immer gleiche Schritte" size={44} align="center" color={C.mute} a={o(cue(0) + 1.8)} />
      <Panel x={1010} y={215} w={820} h={760} r={28} a={o(cue(1) - 0.2)} rand={C.blue} />
      <Lbl x={1010} y={240} w={820} t="Agent" size={64} weight={800} align="center" color={C.blue} a={o(cue(1) - 0.1)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {[[1420, 420, 1220, 600], [1420, 420, 1420, 600], [1420, 420, 1620, 600], [1220, 640, 1320, 840], [1420, 640, 1320, 840], [1620, 640, 1520, 840], [1420, 640, 1520, 840]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={a + (c - a) * ease(t, cue(1) + 0.3 + i * 0.2, cue(1) + 0.7 + i * 0.2)} y2={b + (d - b) * ease(t, cue(1) + 0.3 + i * 0.2, cue(1) + 0.7 + i * 0.2)} stroke={C.blue} strokeWidth="6" strokeLinecap="round" />)}
        <path d="M1670 640 q90 -90 0 -180" fill="none" stroke={C.orange} strokeWidth="6" strokeDasharray="10 10" opacity={ease(t, cue(1) + 1.8, cue(1) + 2.4)} />
        {[[1420, 420], [1220, 640], [1420, 640], [1620, 640], [1320, 860], [1520, 860]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="48" fill={C.panel2} stroke={C.blue} strokeWidth="6" opacity={o(cue(1) + 0.2 + i * 0.2)} />)}
      </svg>
      <Lbl x={1010} y={925} w={820} t="offene Fälle, eigene Wege" size={44} align="center" color={C.mute} a={o(cue(1) + 1.8)} />
    </Szene>
  );
};

export default { chat: Chat, zettel: Zett, werkzeug: Werkzeug, schleife: Schleife, programm: Programm, gedaechtnis: Gedaechtnis, ablauf: Ablauf };
