import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Chip, Lin, Karte } from "../bausteine.jsx";

// Fehlerlandschaft: f(x) mit Tal
const f = (x) => 0.55 * Math.pow((x - 0.5) * 2, 2) + 0.07 * Math.sin(x * 14) + 0.05;
const LX = 130, LW = 1560, LYB = 940, LH = 560;
const P = (x) => [LX + x * LW, LYB - (1 - Math.min(1, f(x))) * LH * 0 - (1 - f(x)) * LH * 0.9];
const kurve = Array.from({ length: 90 }).map((_, i) => { const [x, y] = P(i / 89); return `${i ? "L" : "M"}${x} ${y}`; }).join(" ");
const Landschaft = ({ a = 1, nebel = 0 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: a }}>
    <path d={kurve + ` L${LX + LW} 1000 L${LX} 1000 Z`} fill={C.panel} />
    <path d={kurve} fill="none" stroke={C.blue} strokeWidth={10} strokeLinecap="round" />
  </svg>
);
const Dart = () => {
  const { t, cue } = useCues();
  const T = [[960, 640], [1150, 520], [800, 780]];
  return (
    <Szene titel="Fehler messen" tiefe={["target", 1380, 650, 900]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {[330, 260, 190, 120, 50].map((r, i) => <circle key={r} cx={780} cy={640} r={r} fill="none" stroke={i % 2 ? C.blue : C.line} strokeWidth={i % 2 ? 6 : 24} opacity={sp(t, 0.1 + i * 0.1, 0.6)} />)}
        <circle cx={780} cy={640} r={14} fill={C.red} />
        {[[1050, 470], [560, 770], [930, 840]].map(([x, y], i) => { const a = sp(t, cue(0) + 0.6 + i * 0.7, 0.4); return <g key={i} opacity={a}><line x1={780} y1={640} x2={x} y2={y} stroke={C.orange} strokeWidth={8} strokeDasharray="14 10" opacity={ease(t, cue(1) + 0.2 + i * 0.4, cue(1) + 0.8 + i * 0.4)} /><circle cx={x} cy={y} r={24} fill={C.orange} /></g>; })}
      </svg>
      <Chip x={1300} y={420} t="Verlust" f={C.orange} size={70} a={sp(t, cue(1) + 0.4, 0.6)} />
      <Lbl x={1300} y={560} w={500} t="je weiter daneben, desto größer" size={44} color={C.mute} a={sp(t, cue(1) + 1.0, 0.6)} />
    </Szene>
  );
};

const Schleife = () => {
  const { t, cue } = useCues();
  const S = [["search", "Vorhersage", C.blue, 960, 330], ["alert", "Fehler", C.orange, 1480, 800], ["edit", "Gewichte", C.green, 440, 800]];
  const q = ((t - cue(1) - 0.2) * 0.35) % 1;
  const pts = [[960, 330], [1480, 800], [440, 800], [960, 330]];
  const seg = Math.min(2, Math.floor(Math.max(0, q) * 3)), fr = Math.max(0, q) * 3 - seg;
  const pos = [lerp(pts[seg][0], pts[seg + 1][0], fr), lerp(pts[seg][1], pts[seg + 1][1], fr)];
  return (
    <Szene titel="Die Schleife" tiefe={["repeat", 1380, 650, 900]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <path d="M960 330 L1480 800 L440 800 Z" fill="none" stroke={C.line} strokeWidth={10} strokeLinejoin="round" strokeDasharray="22 16" />
      </svg>
      {S.map(([ic, n, c, x, y], i) => (
        <React.Fragment key={n}>
          <Rv at={0.3 + i * 0.4} s0={0.85} style={{ position: "absolute", left: x - 130, top: y - 130 }}><Badge name={ic} size={260} color={c} /></Rv>
          <Lbl x={x - 200} y={y + 150} w={400} t={n} size={56} color={c} align="center" a={sp(t, 0.5 + i * 0.4, 0.6)} />
        </React.Fragment>
      ))}
      {t > cue(1) + 0.2 && <Dot x={pos[0]} y={pos[1]} r={22} f="#fff" />}
    </Szene>
  );
};

const Huegel = () => {
  const { t, cue } = useCues();
  const g = ease(t, cue(2) + 0.2, cue(2) + 3.6);
  const x = lerp(0.05, 0.5, g);
  const [px, py] = P(x);
  const trail = Array.from({ length: 12 }).map((_, i) => x - i * 0.025).filter((v) => v > 0.05);
  return (
    <Szene titel="Bergab" tiefe={["grid", 1380, 650, 900]}>
      <Landschaft />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "linear-gradient(#0000, #0000)", opacity: 0 }} />
      {trail.map((v, i) => { const [a, b] = P(v); return <Dot key={i} x={a} y={b - 28} r={8} f={C.orange} a={0.6 - i * 0.045} />; })}
      <Dot x={px} y={py - 30} r={32} f={C.orange} />
      <div style={{ position: "absolute", left: LX + LW * 0.5 - 100, top: 560, opacity: sp(t, cue(2) + 3.2, 0.6) }}><Icon name="target" size={200} color={C.green} /></div>
      <Lbl x={110} y={290} w={600} t="Nebel" size={60} color={C.mute} a={sp(t, cue(0) + 0.5, 0.6) * (1 - sp(t, cue(2), 0.6))} />
      <Lbl x={110} y={290} w={600} t="Tal" size={60} color={C.green} a={sp(t, cue(2) + 3.2, 0.6)} />
    </Szene>
  );
};

const Lernrate = () => {
  const { t, cue } = useCues();
  const L = [["Zu groß", C.red, 0.24], ["Passend", C.green, 0.07], ["Zu klein", C.orange, 0.012]];
  const run = (s, k) => { const n = Math.floor(ease(t, cue(0) + 0.8, cue(1) + 3.6) * 14); let x = 0.08; const pts = [x]; for (let i = 0; i < n; i++) { const g = (f(x + 0.001) - f(x - 0.001)) / 0.002; x = Math.max(0, Math.min(1, x - s * g * (k === 0 ? 2.4 : 1) * (k === 1 ? 2.5 : 1))); pts.push(x); } return pts; };
  return (
    <Szene titel="Lernrate" tiefe={["zap", 1380, 650, 900]}>
      {L.map(([n, c, s], k) => {
        const ox = 110 + k * 580, pts = run(s, k);
        const px = (v) => ox + v * 520, py = (v) => 800 - (1 - f(v)) * 340;
        const d = Array.from({ length: 50 }).map((_, i) => `${i ? "L" : "M"}${px(i / 49)} ${py(i / 49)}`).join(" ");
        return (
          <React.Fragment key={n}>
            <Panel x={ox} y={290} w={540} h={600} r={28} a={sp(t, 0.2 + k * 0.2, 0.6)} />
            <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
              <path d={d} fill="none" stroke={C.line} strokeWidth={8} />
              {pts.map((v, i) => i > 0 && <line key={i} x1={px(pts[i - 1])} y1={py(pts[i - 1])} x2={px(v)} y2={py(v)} stroke={c} strokeWidth={5} opacity={0.7} />)}
              {pts.map((v, i) => <circle key={i} cx={px(v)} cy={py(v)} r={i === pts.length - 1 ? 18 : 9} fill={c} />)}
            </svg>
            <Lbl x={ox} y={910} w={540} t={n} size={56} color={c} align="center" a={sp(t, 0.4 + k * 0.2, 0.6)} />
          </React.Fragment>
        );
      })}
    </Szene>
  );
};

const Kurven = () => {
  const { t, cue } = useCues();
  const p = ease(t, 0.4, cue(1) + 2.0);
  const X0 = 130, Y0 = 290, W = 1250, H = 640;
  const tr = (x) => 1 - 0.85 * (1 - Math.exp(-4 * x));
  const va = (x) => 1 - 0.8 * (1 - Math.exp(-4 * x)) + 0.9 * Math.max(0, x - 0.55) ** 2 * 1.2;
  const mk = (fn) => Array.from({ length: 60 }).map((_, i) => { const x = (i / 59) * p; return `${i ? "L" : "M"}${X0 + (i / 59) * p * W} ${Y0 + fn(x) * H * 0.9}`; }).join(" ");
  const minX = 0.55;
  const stop = sp(t, cue(1) + 1.6, 0.6);
  return (
    <Szene titel="Rechtzeitig stoppen" tiefe={["target", 1380, 650, 900]}>
      <Panel x={110} y={270} w={1290} h={700} r={28} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <path d={mk(tr)} fill="none" stroke={C.blue} strokeWidth={10} strokeLinecap="round" />
        <path d={mk(va)} fill="none" stroke={C.orange} strokeWidth={10} strokeLinecap="round" />
        <line x1={X0 + minX * W} y1={Y0} x2={X0 + minX * W} y2={Y0 + H} stroke={C.red} strokeWidth={8} strokeDasharray="16 12" opacity={stop} />
      </svg>
      <Lbl x={1440} y={330} w={380} t="Training" size={56} color={C.blue} a={sp(t, 0.5, 0.6)} />
      <Lbl x={1440} y={430} w={380} t="Validierung" size={56} color={C.orange} a={sp(t, 0.7, 0.6)} />
      <Chip x={1440} y={640} t="Stopp" f={C.red} size={80} a={stop} />
    </Szene>
  );
};

const GPU = () => {
  const { t, cue } = useCues();
  return (
    <Szene titel="Viel gleichzeitig" tiefe={["cpu", 1380, 650, 900]}>
      {Array.from({ length: 60 }).map((_, i) => { const c = i % 12, r = Math.floor(i / 12); const on = Math.sin(t * 5 + i * 0.7) > -0.3; return <div key={i} style={{ position: "absolute", left: 110 + c * 108, top: 290 + r * 108, width: 92, height: 92, borderRadius: 18, background: on ? C.green : C.panel2, opacity: sp(t, 0.1 + i * 0.015, 0.4) }} />; })}
      <div style={{ position: "absolute", left: 1450, top: 330, opacity: sp(t, cue(1) + 0.2, 0.7) }}><Icon name="network" size={340} color={C.blue} /></div>
      <Lbl x={1420} y={700} w={400} t="Vortraining" size={56} color={C.blue} align="center" a={sp(t, cue(1) + 0.4, 0.6)} />
      <Lbl x={1420} y={790} w={400} t="Feinabstimmung" size={56} color={C.green} align="center" a={sp(t, cue(1) + 1.2, 0.6)} />
    </Szene>
  );
};

export default { dart: Dart, schleife: Schleife, huegel: Huegel, lernrate: Lernrate, kurven: Kurven, gpu: GPU };
