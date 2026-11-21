import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Fig, Chip, Lin, Flug, Karte } from "../bausteine.jsx";

const Kellner = () => {
  const { t, cue } = useCues();
  const T = [["Pizza", 800, 700], ["Pasta", 1130, 560], ["Tiramisu", 1460, 700]];
  return (
    <Szene titel="Kellner" tiefe={["store", 1400, 650, 900]}>
      <Fig x={110} y={520} s={360} f={C.blue} />
      <Rv at={cue(0) + 0.3} s0={0.8} style={{ position: "absolute", left: 200, top: 300 }}>
        <div style={{ padding: "18px 40px", borderRadius: 50, background: C.panel2, border: `4px solid ${C.line}`, fontSize: 70, fontWeight: 700 }}>Italienisch?</div>
      </Rv>
      <Fig x={1560} y={300} s={200} f={C.green} a={sp(t, cue(1) - 0.2, 0.6)} />
      {T.map(([n, x, y], i) => {
        const a = sp(t, cue(1) + 0.3 + i * 0.35, 0.7);
        return (
          <React.Fragment key={n}>
            <div style={{ position: "absolute", left: x - 140, top: y - 140 + (1 - a) * -60, width: 280, height: 280, borderRadius: 140, background: C.panel, border: `6px solid ${[C.orange, C.red, C.green][i]}`, opacity: a }}>
              <div style={{ position: "absolute", left: 40, top: 40, width: 200, height: 200, borderRadius: 100, background: [C.orange, "#ffd60a", "#a2845e"][i] + "55" }} />
            </div>
            <Lbl x={x - 200} y={y + 160} w={400} t={n} size={56} align="center" a={a} />
          </React.Fragment>
        );
      })}
    </Szene>
  );
};

// Zwei Ranglisten (Anker über drei Szenen)
const S = ["B", "A", "C", "D", "E"], V = ["A", "F", "B", "C", "E"];
const FZ = { A: C.orange, B: C.blue, C: C.green, D: "#bf5af2", E: "#ffd60a", F: "#64d2ff" };
const LX = [150, 1190], LY = 340, LW = 580, RH = 120;
const Liste = ({ items, x, f, name, a = 1, mix = 0 }) => (
  <>
    <Lbl x={x} y={LY - 70} w={LW} t={name} size={50} color={f} align="center" a={a} />
    {items.map((it, i) => (
      <div key={it} style={{ position: "absolute", left: x, top: LY + i * (RH + 12), width: LW, height: RH, borderRadius: 26, background: FZ[it] + "26", border: `5px solid ${FZ[it]}`, opacity: a * (1 - mix * 0.65), boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 28px", fontSize: 64, fontWeight: 800, color: C.text }}>
        <span style={{ color: C.mute, fontSize: 48, width: 70 }}>{i + 1}</span>{it}
      </div>
    ))}
  </>
);
const ListenA = ({ a = 1, mix = 0, skala = 0 }) => (
  <>
    <Liste items={S} x={LX[0]} f={C.blue} name="Stichwort" a={a} mix={mix} />
    <Liste items={V} x={LX[1]} f={C.green} name="Vektor" a={a} mix={mix} />
  </>
);
const Listen = () => {
  const { t, cue } = useCues();
  const a = sp(t, 0.4, 0.8);
  return (
    <Szene titel="Zwei Listen" tiefe={["list", 960, 650, 900]} anker={<ListenA a={a} />}>
      {["A", "B", "C", "E"].map((it, k) => {
        const i1 = S.indexOf(it), i2 = V.indexOf(it);
        return <Lin key={it} x1={LX[0] + LW} y1={LY + i1 * (RH + 12) + RH / 2} x2={LX[1]} y2={LY + i2 * (RH + 12) + RH / 2} p={sp(t, cue(1) + 0.3 + k * 0.3, 0.7)} f={FZ[it]} w={7} />;
      })}
    </Szene>
  );
};

const Punkte = () => {
  const { t, cue } = useCues();
  const g = ease(t, cue(1) + 0.3, cue(1) + 1.6);
  return (
    <Szene titel="Nicht addieren" tiefe={["x", 960, 650, 900]} anker={<ListenA />}>
      {S.map((it, i) => <div key={it} style={{ position: "absolute", left: LX[0] + 190, top: LY + i * (RH + 12) + 38, width: 360 * (1 - i * 0.18) * g, height: 44, borderRadius: 22, background: C.blue }} />)}
      {V.map((it, i) => <div key={it} style={{ position: "absolute", left: LX[1] + 190, top: LY + i * (RH + 12) + 38, width: 60 * (1 - i * 0.14) * g, height: 44, borderRadius: 22, background: C.green }} />)}
      <div style={{ position: "absolute", left: 790, top: 450, opacity: sp(t, cue(1) + 1.2, 0.6) }}><Icon name="x" size={340} color={C.red} sw={1.5} /></div>
      <Lbl x={740} y={890} w={440} t="Platz zählt" size={56} color={C.orange} align="center" a={sp(t, cue(2) + 0.2, 0.6)} />
    </Szene>
  );
};

const Tafel = () => {
  const { t, cue } = useCues();
  const m = ease(t, cue(0) + 0.5, cue(0) + 1.6), sort = ease(t, cue(0) + 2.2, cue(0) + 3.6);
  const sum = (it) => (5 - S.indexOf(it)) * (S.includes(it) ? 1 : 0) + (V.includes(it) ? 5 - V.indexOf(it) : 0);
  const ids = ["A", "B", "C", "D", "E", "F"].sort((a, b) => sum(b) - sum(a));
  return (
    <Szene titel="Punktetafel" tiefe={["list", 960, 650, 900]} anker={<ListenA mix={m} />}>
      {["A", "B", "C", "D", "E", "F"].map((it, k) => {
        const ziel = ids.indexOf(it), start = k;
        const y = LY - 40 + lerp(start, ziel, sort) * 100;
        const pS = S.includes(it) ? 5 - S.indexOf(it) : 0, pV = V.includes(it) ? 5 - V.indexOf(it) : 0;
        const win = ziel === 0 && sort > 0.95;
        return (
          <div key={it} style={{ position: "absolute", left: 770, top: y, width: 380, height: 88, opacity: m, borderRadius: 22, background: FZ[it] + "26", border: `${win ? 8 : 4}px solid ${win ? C.green : FZ[it]}`, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", boxSizing: "border-box", transform: `scale(${win ? 1.05 : 1})` }}>
            <span style={{ fontSize: 56, fontWeight: 800, width: 60 }}>{it}</span>
            <div style={{ width: pS * 36 * m, height: 40, background: C.blue, borderRadius: 8 }} />
            <div style={{ width: pV * 36 * m, height: 40, background: C.green, borderRadius: 8 }} />
          </div>
        );
      })}
    </Szene>
  );
};

const Regler = () => {
  const { t, cue, word } = useCues();
  const s1 = lerp(0.2, 0.8, ease(t, word(1, "Codes"), word(1, "Codes") + 1.0)) * (t < word(1, "Fragen") ? 1 : 0) + lerp(0.8, 0.2, ease(t, word(1, "Fragen"), word(1, "Fragen") + 1.0)) * (t >= word(1, "Fragen") ? 1 : 0);
  const k = 3 + Math.floor(ease(t, cue(2), cue(2) + 1.0) * 0);
  const falls = Array.from({ length: 6 }).map((_, i) => ({ i, u: ease(t, cue(2) + 0.2 + i * 0.35, cue(2) + 1.0 + i * 0.35) }));
  return (
    <Szene titel="Regler" tiefe={["zap", 1400, 650, 900]}>
      {[["Stichwort", C.blue, s1], ["Vektor", C.green, 1 - s1]].map(([n, f, v], i) => (
        <React.Fragment key={n}>
          <Lbl x={110} y={300 + i * 130} w={380} t={n} size={56} color={f} a={sp(t, 0.3 + i * 0.2, 0.6)} />
          <div style={{ position: "absolute", left: 520, top: 325 + i * 130, width: 1100, height: 24, borderRadius: 12, background: C.panel2 }}><div style={{ width: 1100 * v, height: 24, borderRadius: 12, background: f }} /></div>
          <div style={{ position: "absolute", left: 520 + 1100 * v - 36, top: 305 + i * 130, width: 72, height: 72, borderRadius: 36, background: "#fff", boxShadow: "0 4px 20px #0008" }} />
        </React.Fragment>
      ))}
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><path d="M1050 600 L1500 600 L1420 940 L1130 940 Z" fill={C.panel} stroke={C.line} strokeWidth={6} /></svg>
      <Lbl x={1050} y={955} w={450} t="Top K" size={50} color={C.orange} align="center" a={sp(t, cue(2), 0.6)} />
      {falls.map(({ i, u }) => <div key={i} style={{ position: "absolute", left: lerp(200 + i * 130, i < 3 ? 1130 + i * 90 : 1620, u), top: lerp(560 + (i % 2) * 40, i < 3 ? 780 + i * 20 : 900, u), width: 110, height: 70, borderRadius: 14, background: i < 3 ? C.green : C.mute, opacity: u > 0 ? 1 : 0 }} />)}
    </Szene>
  );
};

const Filter = () => {
  const { t, cue } = useCues();
  const cols = ["Technik", "Personal", "Vertrieb"], rows = ["2023", "2024", "2025"];
  const sel = sp(t, cue(0) + 1.4, 0.8);
  return (
    <Szene titel="Filter" tiefe={["search", 1400, 650, 900]}>
      {cols.map((c, ci) => <Lbl key={c} x={330 + ci * 480} y={270} w={440} t={c} size={52} color={C.blue} align="center" a={sp(t, 0.3 + ci * 0.15, 0.6)} />)}
      {rows.map((r, ri) => <Lbl key={r} x={110} y={420 + ri * 190} w={180} t={r} size={52} color={C.orange} a={sp(t, 0.3 + ri * 0.15, 0.6)} />)}
      {rows.flatMap((r, ri) => cols.map((c, ci) => {
        const hit = ci === 0 && ri === 1;
        return (
          <div key={r + c} style={{ position: "absolute", left: 330 + ci * 480, top: 380 + ri * 190, width: 440, height: 170, borderRadius: 26, background: C.panel, border: `${hit && sel > 0.5 ? 8 : 4}px solid ${hit && sel > 0.5 ? C.green : C.line}`, opacity: hit ? 1 : lerp(1, 0.25, sel), boxSizing: "border-box" }}>
            <Zahlen x={50} y={36} w={340} h={90} n={14} seed={ri * 3 + ci} farbe={hit && sel > 0.5 ? C.green : C.blue} />
          </div>
        );
      }))}
      <div style={{ position: "absolute", left: 1800 - 120, top: 420, opacity: sel }}><Icon name="search" size={110} color={C.green} /></div>
    </Szene>
  );
};

export default { kellner: Kellner, listen: Listen, punkte: Punkte, tafel: Tafel, regler: Regler, filter: Filter };
