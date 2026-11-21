import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Chip, Lin, Karte } from "../bausteine.jsx";

const MX = 640, MY = 340, CW = 560, CH = 280;
const FELDER = [["Treffer", C.green, 0, 0], ["Fehlalarm", C.orange, 1, 0], ["Übersehen", C.red, 0, 1], ["Durchgelassen", C.blue, 1, 1]];
const Matrix = ({ a = 1, zahl = null, hi = -1, s = 1 }) => (
  <>
    <Lbl x={MX} y={MY - 70} w={CW} t="Mail ist Spam" size={44} color={C.mute} align="center" a={a} />
    <Lbl x={MX + CW + 20} y={MY - 70} w={CW} t="Mail ist gut" size={44} color={C.mute} align="center" a={a} />
    {FELDER.map(([n, c, x, y], i) => (
      <div key={n} style={{ position: "absolute", left: MX + x * (CW + 20), top: MY + y * (CH + 20), width: CW, height: CH, borderRadius: 30, background: c + (hi === i ? "55" : "22"), border: `${hi === i ? 8 : 5}px solid ${c}`, boxSizing: "border-box", opacity: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 56, fontWeight: 700, color: c }}>{n}</div>
        {zahl && <div style={{ fontSize: 120, fontWeight: 800 }}>{zahl[i]}</div>}
      </div>
    ))}
  </>
);
const Melder = () => {
  const { t, cue } = useCues();
  return (
    <Szene titel="Rauchmelder" tiefe={["bell", 1380, 650, 900]}>
      <div style={{ position: "absolute", left: 160, top: 320, opacity: sp(t, 0.3, 0.8) }}><svg width="560" height="560" viewBox="0 0 560 560"><circle cx="280" cy="280" r="250" fill={C.panel} stroke={C.line} strokeWidth="10" /><circle cx="280" cy="280" r="140" fill="none" stroke={C.mute} strokeWidth="12" strokeDasharray="30 22" /><circle cx="280" cy="280" r="32" fill={C.mute} /></svg></div>
      <div style={{ position: "absolute", left: 760, top: 330, opacity: sp(t, cue(0) + 0.6, 0.8) }}><Icon name="x" size={0} color={C.red} /></div>
      <Rv at={cue(0) + 0.4} dx={30} dy={0} style={{ position: "absolute", left: 800, top: 340 }}>
        <div style={{ padding: "40px 70px", borderRadius: 40, background: C.green + "22", border: `6px solid ${C.green}`, fontSize: 180, fontWeight: 800, color: C.green }}>99 %</div>
        <div style={{ fontSize: 60, fontWeight: 700, marginTop: 20, color: C.green }}>richtig</div>
      </Rv>
      <Rv at={cue(1) + 0.2} dx={30} dy={0} style={{ position: "absolute", left: 800, top: 700 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, fontSize: 90, fontWeight: 800, color: C.red }}><Icon name="bell" size={170} color={C.red} sw={1.6} /><Icon name="x" size={170} color={C.red} sw={3} /><span>kein Ton</span></div>
      </Rv>
    </Szene>
  );
};

const MatrixS = () => {
  const { t, cue, word } = useCues();
  const hi = t < word(1, "Fehlalarm") ? (t > word(1, "Treffer") ? 0 : -1) : t < word(1, "übersehen") ? 1 : t < word(1, "richtig") ? 2 : 3;
  return (
    <Szene titel="Vier Fälle" tiefe={["grid", 1380, 650, 900]} anker={null}>
      <Matrix a={sp(t, 0.3, 0.8)} hi={hi} />
    </Szene>
  );
};

const Zahlen = () => {
  const { t, cue } = useCues();
  const z = [90, 18, 10, 882];
  const g = ease(t, cue(0) + 0.8, cue(0) + 2.4);
  const zz = z.map((v) => Math.round(v * g));
  const bal = sp(t, cue(1) + 0.6, 0.8);
  return (
    <Szene titel="Spamfilter" tiefe={["file", 1380, 650, 900]}>
      <Matrix a={1} zahl={zz} hi={-1} />
      <div style={{ opacity: bal }}>
        <Lbl x={110} y={310} w={500} t="Genauigkeit" size={52} color={C.mute} />
        <Lbl x={110} y={380} w={500} t="97 %" size={150} color={C.green} weight={800} />
        <Lbl x={110} y={620} w={500} t="aber…" size={64} color={C.orange} />
      </div>
    </Szene>
  );
};

const Netz = () => {
  const { t, cue } = useCues();
  const F = Array.from({ length: 18 }).map((_, i) => [330 + (rnd(i) * 900), 380 + rnd(i + 7) * 500, i < 9 ? 1 : 0]);
  const netz = ease(t, cue(0) + 0.3, cue(0) + 1.6);
  const caught = F.map(([x, y, k], i) => rnd(i + 40) < (k ? 0.9 : 0.25));
  return (
    <Szene titel="Fischernetz" tiefe={["target", 1380, 650, 900]}>
      <div style={{ position: "absolute", left: 110, top: 280, width: 1400, height: 700, borderRadius: 40, background: "#0a2540", opacity: 0.6 }} />
      {F.map(([x, y, k], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 90, height: 48, borderRadius: 24, background: k ? C.orange : C.mute, opacity: sp(t, 0.2 + i * 0.05, 0.4) }}><div style={{ position: "absolute", right: -22, top: 4, width: 0, height: 0, borderLeft: `26px solid ${k ? C.orange : C.mute}`, borderTop: "20px solid transparent", borderBottom: "20px solid transparent" }} /></div>)}
      <div style={{ position: "absolute", left: 230, top: 330, width: 1100 * netz, height: 600, border: `8px dashed ${C.blue}`, borderRadius: 40, opacity: netz }} />
      <Chip x={1560} y={330} t="Recall" f={C.orange} size={60} a={sp(t, cue(0) + 1.4, 0.6)} />
      <Lbl x={1560} y={440} w={280} t="Forellen gefangen" size={44} color={C.mute} a={sp(t, cue(0) + 1.6, 0.6)} />
      <Chip x={1560} y={640} t="Precision" f={C.blue} size={60} a={sp(t, cue(1) + 0.3, 0.6)} />
      <Lbl x={1560} y={750} w={280} t="Netz = Forellen?" size={44} color={C.mute} a={sp(t, cue(1) + 0.5, 0.6)} />
    </Szene>
  );
};

const Schwelle = () => {
  const { t, cue } = useCues();
  const s = ease(t, cue(0) + 0.8, cue(1) + 2.4);
  const zz = [Math.round(lerp(60, 98, s)), Math.round(lerp(4, 60, s)), Math.round(lerp(40, 2, s)), Math.round(lerp(896, 840, s))];
  return (
    <Szene titel="Schwelle" tiefe={["zap", 1380, 650, 900]}>
      <Matrix a={1} zahl={zz} hi={-1} />
      <div style={{ position: "absolute", left: 110, top: 330, width: 90, height: 640, borderRadius: 45, background: C.panel2 }}>
        <div style={{ position: "absolute", left: 0, top: 640 * (1 - s) - 4, width: 90, height: 8, background: C.orange }} />
        <div style={{ position: "absolute", left: -15, top: 640 * s - 60, width: 120, height: 120, borderRadius: 60, background: "#fff", boxShadow: "0 4px 20px #0008" }} />
      </div>
      <Lbl x={230} y={330} w={300} t="Schwelle" size={52} color={C.orange} />
      <Lbl x={230} y={930} w={400} t="niedrig" size={44} color={C.mute} />
    </Szene>
  );
};

const Waage = () => {
  const { t, cue } = useCues();
  const kipp = ease(t, 0.8, 2.0);
  return (
    <Szene titel="Abwägen" tiefe={["user", 1380, 650, 900]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <g transform={`rotate(${lerp(-6, 6, kipp)} 700 560)`}><line x1="160" y1="560" x2="1240" y2="560" stroke="#fff" strokeWidth="14" strokeLinecap="round" /><rect x="60" y="680" width="280" height="30" rx="15" fill={C.orange} /><rect x="1060" y="680" width="280" height="30" rx="15" fill={C.red} /><line x1="200" y1="560" x2="200" y2="680" stroke={C.mute} strokeWidth="6" /><line x1="1200" y1="560" x2="1200" y2="680" stroke={C.mute} strokeWidth="6" /></g>
        <path d="M700 560 L600 900 L800 900 Z" fill={C.panel2} stroke={C.line} strokeWidth="6" />
      </svg>
      <Lbl x={60} y={400} w={280} t="Fehlalarm" size={50} color={C.orange} align="center" a={sp(t, 0.6, 0.6)} />
      <Lbl x={1060} y={400} w={280} t="Übersehen" size={50} color={C.red} align="center" a={sp(t, 0.8, 0.6)} />
      <div style={{ position: "absolute", left: 1450, top: 380, opacity: sp(t, cue(1) + 0.3, 0.8) }}><Icon name="userCheck" size={360} color={C.green} sw={1.3} /></div>
      <Lbl x={1380} y={780} w={440} t="Mensch entscheidet" size={52} color={C.green} align="center" a={sp(t, cue(1) + 0.6, 0.6)} />
    </Szene>
  );
};

export default { melder: Melder, matrix: MatrixS, zahlen: Zahlen, netz: Netz, schwelle: Schwelle, waage: Waage };
