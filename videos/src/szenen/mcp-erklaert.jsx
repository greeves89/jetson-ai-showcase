import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Zettel, Pf, MONO, Etikett, Mark, Zeile } from "../neu.jsx";

const SYS = [["Kalender", "calendar"], ["E-Mail", "bell"], ["Datenbank", "database"], ["Tickets", "list"], ["Wiki", "book"]];
const ASS = [["Assistent A", C.blue], ["Assistent B", C.green], ["Assistent C", C.orange]];

// ---------- 1 Stecker
const PLATTE = (typ) => {
  const L = { fill: "#101012" };
  const s = {
    0: <><rect x="62" y="48" width="14" height="64" rx="3" {...L} /><rect x="104" y="48" width="14" height="64" rx="3" {...L} /></>,
    1: <><circle cx="62" cy="80" r="11" {...L} /><circle cx="118" cy="80" r="11" {...L} /></>,
    2: <><rect x="50" y="52" width="14" height="28" rx="3" {...L} /><rect x="116" y="52" width="14" height="28" rx="3" {...L} /><rect x="83" y="82" width="14" height="30" rx="3" {...L} /></>,
    3: <><circle cx="60" cy="70" r="10" {...L} /><circle cx="90" cy="70" r="10" {...L} /><circle cx="120" cy="70" r="10" {...L} /></>,
    4: <><circle cx="56" cy="64" r="11" {...L} /><circle cx="124" cy="64" r="11" {...L} /><rect x="83" y="92" width="14" height="22" rx="3" {...L} /></>,
    5: <><rect x="48" y="56" width="14" height="38" rx="3" transform="rotate(-22 55 75)" {...L} /><rect x="118" y="56" width="14" height="38" rx="3" transform="rotate(22 125 75)" {...L} /><rect x="83" y="90" width="14" height="26" rx="3" {...L} /></>,
  };
  return s[typ];
};
const Anker1 = ({ swap = 0, mark = [] }) => (
  <>
    {Array.from({ length: 6 }).map((_, i) => {
      const x = 90 + (i % 3) * 590, y = 215 + Math.floor(i / 3) * 385;
      return (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: 560, height: 360, borderRadius: 28, background: C.panel, border: `3px solid ${mark[i] === 1 ? C.red : mark[i] === 2 ? C.green : C.line}`, boxSizing: "border-box" }}>
          <svg style={{ position: "absolute", left: 190, top: 30, opacity: 1 - swap }} width="180" height="180" viewBox="0 0 180 180"><circle cx="90" cy="90" r="86" fill="#d8d8dc" />{PLATTE(i)}</svg>
          <div style={{ position: "absolute", left: 200, top: 40, opacity: swap }}><Icon name={["calendar", "bell", "database", "list", "book", "file"][i]} size={160} color={C.blue} sw={1.4} /></div>
          <Lbl x={0} y={250} w={560} t={swap > 0.5 ? (i === 5 ? "Dateien" : SYS[i][0]) : "Typ " + "ABCDEF"[i]} size={64} weight={800} align="center" color={swap > 0.5 ? C.text : C.mute} />
        </div>
      );
    })}
  </>
);
const Stecker = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const swap = ease(t, cue(1) + 0.3, cue(1) + 1.0);
  const marks = [0, 1, 2, 3, 4, 5].map((i) => (t > cue(2) + 1.8 + i * 0.5 ? (i === 3 ? 2 : 1) : 0));
  return (
    <Szene titel="Steckerwirrwarr" tiefe={["zap", 1500, 640, 800]} anker={<Anker1 swap={swap} mark={marks} />}>
      <Etikett x={90} y={940} t="sechs Adapter im Koffer" f={C.orange} size={44} a={o(cue(2) - 0.2) * (1 - swap)} />
      {marks.map((m, i) => m ? <Mark key={i} x={90 + (i % 3) * 590 + 450} y={215 + Math.floor(i / 3) * 385 + 20} ok={m === 2} size={90} a={1} /> : null)}
    </Szene>
  );
};

// ---------- gemeinsame Netzdarstellung (Szenen 2 bis 4)
const AY = (i) => 340 + i * 240;
const SYy = (j, c) => 310 + j * (580 / (c - 1));
function Netz({ c = 4, hub = 0, linien = 1, fade = 0, m = 0, fokus = false }) {
  const sy = (j) => (fokus && j === 0 ? lerp(SYy(0, 5), 520, m) : SYy(j, c));
  const ay = (i) => (fokus && i === 0 ? lerp(AY(0), 520, m) : AY(i));
  const so = (j) => (j === 0 ? 1 : 1 - fade), ao = (i) => (i === 0 ? 1 : 1 - fade);
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {linien > 0 && ASS.map((_, i) => SYS.slice(0, Math.ceil(c)).map((__, j) => (
          <line key={i + "-" + j} x1={450} y1={ay(i)} x2={1470} y2={sy(j)} stroke={C.blue} strokeWidth="5" opacity={(1 - hub) * 0.5 * linien * ao(i) * so(j) * (j >= c ? 0 : j > c - 1 ? c - j : 1)} />
        )))}
        {hub > 0 && ASS.map((_, i) => <line key={"a" + i} x1={450} y1={ay(i)} x2={810} y2={600} stroke={C.green} strokeWidth="7" opacity={hub * ao(i)} />)}
        {hub > 0 && SYS.slice(0, Math.ceil(c)).map((_, j) => <line key={"s" + j} x1={1110} y1={600} x2={1470} y2={sy(j)} stroke={C.green} strokeWidth="7" opacity={hub * so(j) * (j >= c ? 0 : 1)} />)}
      </svg>
      {ASS.map(([n, f], i) => (
        <div key={n} style={{ position: "absolute", left: 90, top: ay(i) - 75, width: 360, height: 150, borderRadius: 26, background: C.panel2, border: `4px solid ${f}`, display: "flex", alignItems: "center", gap: 18, padding: "0 24px", boxSizing: "border-box", fontSize: 40, fontWeight: 800, opacity: ao(i) }}><Icon name="bot" size={80} color={f} />{n}</div>
      ))}
      {SYS.slice(0, Math.ceil(c)).map(([n, ic], j) => (
        <div key={n} style={{ position: "absolute", left: 1470, top: sy(j) - (c > 4 ? 55 : 60), width: 360, height: c > 4 ? 110 : 120, borderRadius: 24, background: C.panel2, border: `4px solid ${C.line}`, display: "flex", alignItems: "center", gap: 18, padding: "0 24px", boxSizing: "border-box", fontSize: 44, fontWeight: 800, opacity: so(j) * (j >= c ? 0 : j > c - 1 ? c - j : 1) }}><Icon name={ic} size={64} color={C.text} />{n}</div>
      ))}
      {hub > 0 && (
        <div style={{ position: "absolute", left: 810, top: 495, width: 300, height: 210, borderRadius: 36, background: C.green + "22", border: `5px solid ${C.green}`, opacity: hub, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
          <div style={{ fontSize: 96, fontWeight: 800, color: C.green, letterSpacing: 2 }}>MCP</div><div style={{ fontSize: 38, color: C.mute, fontWeight: 600 }}>Standard</div>
        </div>
      )}
    </>
  );
}

// ---------- 2 Netz aus Linien
const Anker2 = () => { const { t, cue } = useCues(); return <Netz c={4 + ease(t, cue(2) + 0.6, cue(2) + 1.6)} linien={ease(t, 0.5, 1.4)} />; };
const NetzS = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const c = 4 + ease(t, cue(2) + 0.6, cue(2) + 1.6);
  const n = 3 * Math.round(c);
  return (
    <Szene titel="Zwölf Verbindungen" tiefe={["network", 1500, 640, 800]} anker={<Anker2 />}>
      <Lbl x={450} y={225} w={1020} t={n + " Einzelanbindungen"} size={72} weight={800} align="center" color={n > 12 ? C.red : C.orange} a={o(cue(0) + 1.0)} />
      <Etikett x={640} y={930} t="jede baut und pflegt jemand" f={C.mute} size={44} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 3 Standard
const Anker3 = () => { const { t, cue } = useCues(); return <Netz c={5} hub={ease(t, 0.4, 1.4)} linien={1} />; };
const Standard = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Ein Standard" tiefe={["zap", 1500, 640, 800]} anker={<Anker3 />}>
      <Lbl x={450} y={225} w={1020} t="8 statt 15 Verbindungen" size={72} weight={800} align="center" color={C.green} a={o(cue(0) + 1.2)} />
      <Etikett x={1390} y={955} t="baut 1 Anschluss" f={C.green} size={40} a={o(cue(1))} />
      <Etikett x={90} y={955} t="nutzt jeden" f={C.green} size={40} a={o(cue(1) + 1.2)} />
    </Szene>
  );
};

// ---------- 4 Server und Client
const Anker4 = () => { const { t, cue } = useCues(); return <Netz c={5} hub={1} linien={0} fade={ease(t, 0, 0.6)} fokus m={ease(t, 0.3, 1.2)} />; };
const ServerClient = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Server und Client" tiefe={["users", 1500, 640, 800]} anker={<Anker4 />}>
      <Lbl x={90} y={250} w={360} t="Client" size={96} weight={800} align="center" color={C.blue} a={o(cue(1))} />
      <Lbl x={60} y={365} w={420} t="Anwendung des Assistenten" size={40} align="center" color={C.mute} a={o(cue(1) + 0.2)} />
      <Lbl x={1470} y={250} w={360} t="Server" size={96} weight={800} align="center" color={C.green} a={o(cue(0) + 0.3)} />
      <Lbl x={1440} y={365} w={420} t="macht das System bekannt" size={40} align="center" color={C.mute} a={o(cue(0) + 0.5)} />
      <Panel x={90} y={810} w={1740} h={165} r={28} a={o(cue(2) - 0.2)} rand={C.orange} />
      <Lbl x={130} y={830} w={440} t="Reisebüro" size={52} weight={800} color={C.orange} a={o(cue(2) - 0.1)} />
      <Lbl x={130} y={900} w={500} t="vermittelt viele Anbieter" size={40} color={C.mute} a={o(cue(2))} />
      {[["Hotel", "store"], ["Flug", "zap"], ["Bahn", "truck"], ["Auto", "box"]].map(([n, ic], i) => (
        <React.Fragment key={n}>
          <div style={{ position: "absolute", left: 760 + i * 270, top: 840, opacity: o(cue(2) + 0.3 + i * 0.3) }}><Icon name={ic} size={80} color={C.orange} sw={1.6} /></div>
          <Lbl x={850 + i * 270} y={860} w={180} t={n} size={44} a={o(cue(2) + 0.3 + i * 0.3)} />
        </React.Fragment>
      ))}
    </Szene>
  );
};

// ---------- 5 Beschreibung (Server-Kachel wächst zur Karte)
const TOOLS = [["termine_lesen", "Liest die Termine eines Tages.", "datum: Datum"], ["termin_anlegen", "Legt einen neuen Termin an.", "titel: Text, zeit: Zeit"]];
const Anker5 = () => {
  const { t, cue } = useCues();
  const u = ease(t, 0.3, 1.4), f = 1 - ease(t, 0, 0.4);
  const x = lerp(1470, 90, u), y = lerp(520 - 60, 215, u), w = lerp(360, 1740, u), h = lerp(120, 760, u);
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 520 - 75, width: 360, height: 150, borderRadius: 26, background: C.panel2, border: `4px solid ${C.blue}`, display: "flex", alignItems: "center", gap: 18, padding: "0 24px", boxSizing: "border-box", fontSize: 40, fontWeight: 800, opacity: f }}><Icon name="bot" size={80} color={C.blue} />Assistent A</div>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 28, background: u > 0.4 ? C.panel : C.panel2, border: `4px solid ${C.green}`, boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 24, top: lerp(34, 24, u), display: "flex", alignItems: "center", gap: 18, fontSize: lerp(44, 60, u), fontWeight: 800 }}><Icon name="calendar" size={lerp(64, 84, u)} color={C.text} />Kalender{u > 0.5 ? "-Server" : ""}</div>
      </div>
    </>
  );
};
const Beschr = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const hl = t > word(1, "Zum Beispiel") ? 1 : 0;
  return (
    <Szene titel="Was ein Server beschreibt" tiefe={["edit", 1500, 640, 800]} anker={<Anker5 />}>
      {TOOLS.map(([nm, d, p], i) => (
        <div key={nm} style={{ position: "absolute", left: 130, top: 345 + i * 300, width: 1660, height: 270, borderRadius: 26, background: C.panel2, border: `4px solid ${i === 0 && hl ? C.orange : C.line}`, opacity: o(cue(0) + 0.4 + i * 0.7), boxSizing: "border-box", padding: "20px 40px" }}>
          <div style={{ fontSize: 66, fontWeight: 800, fontFamily: MONO, color: C.blue }}>{nm}</div>
          <div style={{ fontSize: 50, fontWeight: 600, marginTop: 10 }}>{d}</div>
          <div style={{ fontSize: 44, fontFamily: MONO, color: C.green, marginTop: 14 }}>Parameter: {p}</div>
        </div>
      ))}
      <Etikett x={130} y={935} t="Name, Beschreibung, Parameter" f={C.mute} size={44} a={o(cue(0) + 2.4)} />
      <div style={{ position: "absolute", left: 1370, top: 935, opacity: o(cue(2)) }}><Etikett x={0} y={0} t="Das Modell wählt" f={C.orange} size={48} /></div>
    </Szene>
  );
};

// ---------- 6 Wem vertraust du?
const Leiste = ({ x, y, ok, a }) => (
  <svg style={{ position: "absolute", left: x, top: y, opacity: a }} width="840" height="340" viewBox="0 0 840 340">
    <rect x="20" y="60" width="800" height="200" rx="36" fill={ok ? "#e8e8ea" : "#5a4a4a"} />
    {[0, 1, 2, 3, 4].map((i) => <g key={i}><rect x={60 + i * 150} y="95" width="110" height="130" rx="18" fill={ok ? "#cfcfd4" : "#3a2f2f"} /><circle cx={92 + i * 150} cy="160" r="9" fill="#111" /><circle cx={138 + i * 150} cy="160" r="9" fill="#111" /></g>)}
    <path d="M820 160 Q 840 160 840 200" fill="none" stroke="#888" strokeWidth="10" />
  </svg>
);
const Vertrauen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const K = [["Quelle prüfen", "search"], ["Rechte begrenzen", "lock"], ["Folgen freigeben", "userCheck"]];
  return (
    <Szene titel="Wem vertraust du?" tiefe={["shield", 1500, 640, 800]}>
      <Panel x={90} y={215} w={840} h={380} r={28} a={o(0.3)} rand={C.green} />
      <Panel x={990} y={215} w={840} h={380} r={28} a={o(0.6)} rand={C.red} />
      <Leiste x={90} y={235} ok a={o(0.4)} /><Leiste x={990} y={235} ok={false} a={o(0.7)} />
      <Mark x={140} y={240} ok size={100} a={o(cue(0))} /><Mark x={1040} y={240} ok={false} size={100} a={o(cue(0) + 0.6)} />
      <Lbl x={90} y={500} w={840} t="bekannte Quelle, geprüft" size={46} weight={700} align="center" color={C.green} a={o(cue(0) + 0.2)} />
      <Lbl x={990} y={500} w={840} t="Code mit Zugriff, unbekannt" size={46} weight={700} align="center" color={C.red} a={o(cue(0) + 0.8)} />
      {K.map(([n, ic], i) => (
        <div key={n} style={{ position: "absolute", left: 90 + i * 590, top: 640, width: 560, height: 330, borderRadius: 28, background: C.panel, border: `4px solid ${C.blue}`, opacity: o(cue(1) + i * 0.6), boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <Icon name={ic} size={130} color={C.blue} sw={1.5} /><div style={{ fontSize: 56, fontWeight: 800 }}>{n}</div>
        </div>
      ))}
    </Szene>
  );
};

// ---------- 7 Einordnung
const Einordnung = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ang = (t - cue(1)) * 70;
  const R = 200, CX = 520, CY = 600;
  const N = [["Denken", "bulb", -90, C.orange], ["Aufrufen", "zap", 30, C.blue], ["Lesen", "file", 150, C.green]];
  const pos = (d) => [CX + R * Math.cos(d * Math.PI / 180), CY + R * Math.sin(d * Math.PI / 180)];
  const puls = t > cue(2) ? 0.6 + 0.4 * Math.sin((t - cue(2)) * 5) : 1;
  return (
    <Szene titel="Einordnung" tiefe={["network", 1500, 640, 800]}>
      <Panel x={90} y={215} w={860} h={760} r={28} a={o(0.3)} rand={C.blue} />
      <Lbl x={90} y={235} w={860} t="Der Agent" size={64} weight={800} align="center" color={C.blue} a={o(0.4)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={C.line} strokeWidth="9" strokeDasharray="4 16" strokeLinecap="round" opacity={o(0.5)} />
        <circle cx={pos(ang - 90)[0]} cy={pos(ang - 90)[1]} r="18" fill={C.orange} opacity={ease(t, cue(1) - 0.2, cue(1) + 0.3)} />
        <line x1={950} y1={600} x2={1130} y2={600} stroke={C.green} strokeWidth="12" strokeLinecap="round" opacity={ease(t, 0.5, 1.2) * puls} />
        {[0, 1, 2].map((i) => <line key={i} x1={1250} y1={600} x2={1360} y2={380 + i * 220} stroke={C.green} strokeWidth="7" opacity={ease(t, 0.8, 1.4) * puls} />)}
      </svg>
      {N.map(([n, ic, d, f], i) => { const [x, y] = pos(d); return (
        <React.Fragment key={n}>
          <div style={{ position: "absolute", left: x - 60, top: y - 60, opacity: o(0.5 + i * 0.3) }}><Badge name={ic} size={120} color={f} bg="#000" /></div>
          <Lbl x={i === 0 ? x + 80 : i === 1 ? x - 130 : x - 130} y={i === 0 ? y - 25 : y + 70} w={i === 0 ? 260 : 260} t={n} size={44} align={i === 0 ? "left" : "center"} a={o(0.6 + i * 0.3)} />
        </React.Fragment>
      ); })}
      <div style={{ position: "absolute", left: 1130, top: 520, width: 120, height: 160, borderRadius: 24, background: C.green + "22", border: `5px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: o(0.6) }}><Icon name="zap" size={80} color={C.green} /></div>
      <Lbl x={940} y={700} w={330} t="MCP" size={80} weight={800} align="center" color={C.green} a={o(cue(0) + 0.3)} />
      <Lbl x={940} y={795} w={330} t="Anschluss" size={42} align="center" color={C.mute} a={o(cue(0) + 0.5)} />
      {SYS.slice(0, 3).map(([n, ic], i) => (
        <div key={n} style={{ position: "absolute", left: 1360, top: 380 + i * 220 - 70, width: 470, height: 140, borderRadius: 24, background: C.panel2, border: `4px solid ${C.line}`, display: "flex", alignItems: "center", gap: 20, padding: "0 30px", boxSizing: "border-box", fontSize: 52, fontWeight: 800, opacity: o(0.8 + i * 0.3) }}><Icon name={ic} size={70} color={C.text} />{n}</div>
      ))}
      <Etikett x={1100} y={900} t="Das Kabel, nicht der Agent" f={C.green} size={46} a={o(cue(2))} />
    </Szene>
  );
};

export default { stecker: Stecker, netz: NetzS, standard: Standard, serverclient: ServerClient, beschreibung: Beschr, vertrauen: Vertrauen, einordnung: Einordnung };
