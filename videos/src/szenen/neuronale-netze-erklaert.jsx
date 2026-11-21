import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Chip, Lin, Karte, Fig } from "../bausteine.jsx";

const NX = 1030, NY = 640;
const Eingaben = [150, 280, 410, 540, 670].map((d, i) => [330, 300 + i * 150]);
const W = [0.9, 0.3, 0.7, 0.15, 0.5];
const Neuron = ({ t, a = 1, gew = 1, summe = 0, farbe = C.blue, schw }) => (
  <>
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: a }}>
      {Eingaben.map(([x, y], i) => <line key={i} x1={x} y1={y} x2={NX - 150} y2={NY} stroke={C.blue} strokeWidth={4 + W[i] * 24 * gew} strokeLinecap="round" opacity={0.85} />)}
      <circle cx={NX} cy={NY} r={150} fill={C.panel} stroke={farbe} strokeWidth={8} />
    </svg>
    {Eingaben.map(([x, y], i) => <Dot key={i} x={x} y={y} r={30} f={C.green} a={a} />)}
  </>
);
const Abstimmung = () => {
  const { t, cue } = useCues();
  const H = [0.9, 0.35, 0.65, 0.2, 0.5];
  return (
    <Szene titel="Abstimmung" tiefe={["users", 1380, 650, 900]}>
      {H.map((v, i) => {
        const x = 220 + i * 290, a = sp(t, 0.3 + i * 0.25, 0.7), h = 90 + v * 290, hand = sp(t, cue(0) + 0.8 + i * 0.3, 0.6);
        return (
          <React.Fragment key={i}>
            <Fig x={x - 100} y={560} s={200} f={C.blue} a={a} />
            <div style={{ position: "absolute", left: x - 70, top: 540 - h * hand, width: 140, height: h * hand, borderRadius: 20, background: C.orange, opacity: hand }} />
            <div style={{ position: "absolute", left: x - 70, top: 540 - h * hand - 20, width: 140, textAlign: "center", fontSize: 40, fontWeight: 800, opacity: hand }}></div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 1500, top: 300, opacity: sp(t, cue(1) + 0.1, 0.7) }}><Icon name="network" size={280} color={C.blue} /></div>
      <Lbl x={1400} y={640} w={440} t="Ein Neuron" size={60} color={C.blue} align="center" a={sp(t, cue(1) + 0.3, 0.6)} />
    </Szene>
  );
};

const Gewichte = () => {
  const { t, cue } = useCues();
  const g = ease(t, 0.5, 1.6), s = ease(t, cue(1) + 0.2, cue(1) + 1.2);
  return (
    <Szene titel="Gewichte" tiefe={["network", 1380, 650, 900]}>
      <Neuron t={t} gew={g} />
      <Lbl x={NX - 130} y={NY - 70} w={260} t="Σ" size={130} color="#fff" align="center" a={s} />
      <Lbl x={NX - 130} y={NY + 30} w={260} t="Summe" size={44} color={C.mute} align="center" a={s} />
      <Lin x1={NX + 160} y1={NY} x2={NX + 500} y2={NY} p={s} f={C.mute} w={8} />
      <div style={{ position: "absolute", left: NX + 520, top: NY - 160, width: 240, height: 320, borderRadius: 30, background: C.panel, border: `5px solid ${C.blue}`, opacity: s, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 40, boxSizing: "border-box" }}><div style={{ width: 120, height: 230 * s, background: C.blue, borderRadius: 14 }} /></div>
      {W.map((w, i) => <Lbl key={i} x={420} y={Eingaben[i][1] - 40 + 0} w={250} t={w > 0.6 ? "dick" : w < 0.25 ? "dünn" : ""} size={40} color={C.mute} a={g} />)}
    </Szene>
  );
};

const Ampel = () => {
  const { t, cue } = useCues();
  const s = ease(t, 0.5, cue(0) + 3.2);
  const over = s > 0.6;
  const Y0 = 300, H = 640;
  return (
    <Szene titel="Schwelle" tiefe={["zap", 1380, 650, 900]}>
      <Panel x={160} y={Y0} w={200} h={H} r={30} />
      <div style={{ position: "absolute", left: 160, top: Y0 + H - H * s, width: 200, height: H * s, borderRadius: 30, background: over ? C.green : C.blue }} />
      <div style={{ position: "absolute", left: 120, top: Y0 + H * 0.4 - 4, width: 600, height: 10, borderRadius: 5, background: C.orange }} />
      <Lbl x={400} y={Y0 + H * 0.4 - 80} w={400} t="Schwelle" size={56} color={C.orange} />
      <svg style={{ position: "absolute", left: 1100, top: 290, width: 500, height: 700 }} viewBox="0 0 500 700"><rect x="100" y="20" width="300" height="660" rx="60" fill={C.panel} stroke={C.line} strokeWidth="6" /><circle cx="250" cy="190" r="100" fill={over ? "#1c3a24" : C.red} /><circle cx="250" cy="500" r="100" fill={over ? C.green : "#3a2420"} /></svg>
      <Lbl x={1620} y={600} w={260} t={over ? "Signal" : "still"} size={56} color={over ? C.green : C.mute} />
    </Szene>
  );
};

const Schichten = () => {
  const { t, cue, word } = useCues();
  const L = [4, 5, 5, 3];
  const X = [330, 760, 1190, 1620];
  const node = (c, i) => [X[c], 640 + (i - (L[c] - 1) / 2) * 135];
  const lay = [sp(t, 0.3, 0.8), sp(t, word(1, "erste"), 0.8), sp(t, word(1, "nächste"), 0.8), sp(t, word(1, "letzte"), 0.8)];
  return (
    <Szene titel="Schichten" tiefe={["network", 1380, 650, 900]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {[0, 1, 2].map((c) => Array.from({ length: L[c] }).flatMap((_, i) => Array.from({ length: L[c + 1] }).map((__, j) => { const [x1, y1] = node(c, i), [x2, y2] = node(c + 1, j); return <line key={`${c}${i}${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.blue} strokeWidth={2.5} opacity={0.35 * lay[c + 1]} />; })))}
        {L.map((n, c) => Array.from({ length: n }).map((_, i) => { const [x, y] = node(c, i); return <circle key={`${c}${i}`} cx={x} cy={y} r={34} fill={C.panel2} stroke={[C.mute, C.blue, C.green, C.orange][c]} strokeWidth={6} opacity={lay[c]} />; }))}
      </svg>
      {["Kanten", "Formen", "Gesicht"].map((n, i) => <Lbl key={n} x={X[i + 1] - 200} y={968} w={400} t={n} size={50} color={[C.blue, C.green, C.orange][i]} align="center" a={lay[i + 1]} />)}
      <svg style={{ position: "absolute", left: X[1] - 90, top: 290, opacity: lay[1] }} width="180" height="120"><path d="M10 100 L90 20 L170 100" fill="none" stroke={C.blue} strokeWidth="10" strokeLinecap="round" /></svg>
      <svg style={{ position: "absolute", left: X[2] - 90, top: 270, opacity: lay[2] }} width="180" height="140"><circle cx="90" cy="70" r="55" fill="none" stroke={C.green} strokeWidth="10" /></svg>
      <div style={{ position: "absolute", left: X[3] - 80, top: 290, opacity: lay[3] }}><Icon name="user" size={160} color={C.orange} /></div>
    </Szene>
  );
};

const Grenze = () => {
  const { t, cue } = useCues();
  const P = Array.from({ length: 28 }).map((_, i) => { const x = 130 + rnd(i) * 1000 + 100, y = 320 + rnd(i + 5) * 600; const r = Math.hypot(x - 680, y - 620); return [x, y, r < 250 ? 1 : 0]; });
  const gerade = sp(t, cue(0) + 0.4, 0.8), kreis = sp(t, cue(1) + 0.5, 0.9);
  return (
    <Szene titel="Gebogene Grenze" tiefe={["fork", 1380, 650, 900]}>
      <Karte x={110} y={280} w={1200} h={700} />
      {P.map(([x, y, k], i) => <Dot key={i} x={x} y={y} r={18} f={k ? C.orange : C.blue} a={sp(t, 0.2 + i * 0.03, 0.4)} />)}
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <line x1={420} y1={300} x2={960} y2={960} stroke={C.red} strokeWidth={8} strokeLinecap="round" opacity={gerade * (1 - kreis * 0.8)} />
        <circle cx={680} cy={620} r={250} fill="none" stroke={C.green} strokeWidth={10} strokeDasharray="1600" strokeDashoffset={1600 * (1 - kreis)} />
      </svg>
      <div style={{ position: "absolute", left: 1400, top: 340, opacity: gerade * (1 - kreis) }}><Icon name="x" size={300} color={C.red} sw={2} /></div>
      <div style={{ position: "absolute", left: 1400, top: 340, opacity: kreis }}><Icon name="check" size={300} color={C.green} sw={2} /></div>
      <Lbl x={1380} y={700} w={440} t={kreis > 0.4 ? "Mehrere Schichten" : "Eine Gerade"} size={52} color={kreis > 0.4 ? C.green : C.red} align="center" a={1} />
    </Szene>
  );
};

const BlackBox = () => {
  const { t, cue } = useCues();
  const n = Math.floor(lin(t, 0.6, cue(0) + 3.2, 0, 4));
  const Z = ["21", "78 500", "Millionen", "Milliarden"];
  const box = sp(t, cue(0) + 3.4, 0.8);
  return (
    <Szene titel="Black Box" tiefe={["box", 1380, 650, 900]}>
      <Lbl x={110} y={280} w={1700} t={Z[Math.min(3, n)]} size={260} color={C.blue} weight={800} align="center" a={sp(t, 0.5, 0.5)} />
      <Lbl x={110} y={560} w={1700} t="Parameter" size={64} color={C.mute} align="center" a={sp(t, 0.8, 0.6)} />
      <Lin x1={190} y1={800} x2={640} y2={800} p={box} f={C.mute} w={10} />
      <div style={{ position: "absolute", left: 660, top: 660, width: 600, height: 280, borderRadius: 40, background: "#0b0b0d", border: `6px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: box }}><span style={{ fontSize: 200, color: C.mute, fontWeight: 800 }}>?</span></div>
      <Lin x1={1280} y1={800} x2={1730} y2={800} p={box} f={C.mute} w={10} />
    </Szene>
  );
};

export default { abstimmung: Abstimmung, summe: Gewichte, ampel: Ampel, schichten: Schichten, grenze: Grenze, blackbox: BlackBox };
