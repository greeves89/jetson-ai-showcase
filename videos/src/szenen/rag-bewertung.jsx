import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Fig, Chip, Lin, Flug, Karte } from "../bausteine.jsx";

const Chat = () => {
  const { t, cue } = useCues();
  const R = [[C.green, "check"], [C.green, "check"], [C.green, "check"], [C.red, "x"]];
  const ats = [cue(0) + 0.3, cue(0) + 1.3, cue(0) + 2.3, cue(1) + 0.4];
  return (
    <Szene titel="Drei von vier" tiefe={["message", 1380, 650, 900]}>
      {R.map(([f, ic], i) => {
        const y = 290 + i * 165;
        return (
          <Rv key={i} at={ats[i]} dx={i % 2 ? 40 : -40} dy={0} style={{ position: "absolute", left: 110, top: y, width: 1700 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <div style={{ flex: 1, height: 130, borderRadius: 40, background: C.panel2, border: `4px solid ${f}`, padding: "30px 44px", boxSizing: "border-box" }}><Skel x={0} y={0} w={1100} n={2} gap={36} h={20} farbe={f === C.red ? "#6b3a37" : "#48484a"} /></div>
              <Icon name={ic} size={120} color={f} sw={3} />
            </div>
          </Rv>
        );
      })}
    </Szene>
  );
};

const Testset = () => {
  const { t, cue, dur } = useCues();
  const rows = Math.floor(lin(t, 0.6, cue(1) + 2.5, 0, 7));
  return (
    <Szene titel="Testset" tiefe={["list", 1380, 650, 900]}>
      <Panel x={110} y={280} w={1700} h={700} r={28}>
        {[["Frage", 90], ["Fundstelle", 690], ["Erwartet", 1180]].map(([n, x]) => <Lbl key={n} x={x} y={26} w={400} t={n} size={46} color={C.blue} />)}
        {Array.from({ length: 7 }).map((_, r) => (
          <div key={r} style={{ position: "absolute", left: 0, top: 100 + r * 84, width: 1700, height: 70, opacity: r < rows ? 1 : 0 }}>
            <Skel x={90} y={26} w={460} n={1} h={20} seed={r + 1} />
            <Skel x={690} y={26} w={300} n={1} h={20} seed={r + 5} farbe={C.orange} />
            <Skel x={1180} y={26} w={400} n={1} h={20} seed={r + 9} farbe={C.green} />
            <div style={{ position: "absolute", left: 20, top: 8, fontSize: 40, fontWeight: 800, color: C.mute }}>{r + 1}</div>
            {r === 6 && <Lbl x={690} y={8} w={400} t="keine" size={42} color={C.red} a={1} />}
          </div>
        ))}
      </Panel>
    </Szene>
  );
};

const Treffer = () => {
  const { t, cue } = useCues();
  const g = ease(t, cue(0) + 0.8, cue(0) + 2.4);
  const bals = Array.from({ length: 10 }).map((_, i) => i);
  const ok = [0, 1, 2, 3, 5, 6, 8, 9];
  return (
    <Szene titel="Trefferquote" tiefe={["target", 1380, 650, 900]}>
      {[0, 1, 2, 3, 4].map((r) => (
        <div key={r} style={{ position: "absolute", left: 110, top: 290 + r * 118, width: 760, height: 100, borderRadius: 22, background: r === 2 ? C.green + "33" : C.panel, border: `5px solid ${r === 2 ? C.green : C.line}`, opacity: sp(t, 0.2 + r * 0.1, 0.5), boxSizing: "border-box" }}>
          <Skel x={90} y={38} w={560} n={1} h={22} farbe={r === 2 ? C.green : "#48484a"} seed={r + 2} />
          <div style={{ position: "absolute", left: 24, top: 18, fontSize: 52, fontWeight: 800, color: C.mute }}>{r + 1}</div>
        </div>
      ))}
      <Lbl x={110} y={910} w={760} t="Top 5" size={50} color={C.green} a={sp(t, 0.8, 0.6)} />
      <Karte x={960} y={290} w={850} h={470} a={sp(t, cue(0) + 0.5, 0.7)} />
      {bals.map((i) => <div key={i} style={{ position: "absolute", left: 1000 + i * 78, top: 330 + (i % 5) * 0, width: 56, height: 56, borderRadius: 14, background: ok.includes(i) ? C.green : C.red, opacity: sp(t, cue(0) + 0.8 + i * 0.1, 0.4) }} />)}
      <div style={{ position: "absolute", left: 960, top: 800, width: 850, height: 60, borderRadius: 30, background: C.panel2 }}><div style={{ width: 850 * 0.8 * g, height: 60, borderRadius: 30, background: C.green }} /></div>
      <Lbl x={960} y={400} w={850} t={`${Math.round(g * 80)} %`} size={300} color={C.green} weight={800} align="center" a={sp(t, cue(0) + 1.0, 0.5)} />
    </Szene>
  );
};

const Beleg = () => {
  const { t, cue } = useCues();
  const quell = [[1000, 340], [1000, 520], [1000, 700]];
  return (
    <Szene titel="Beleg" tiefe={["file", 1380, 650, 900]}>
      <Panel x={110} y={290} w={620} h={660} r={28} rand={C.blue}>
        {[0, 1, 2, 3].map((i) => <Skel key={i} x={36} y={46 + i * 148} w={540} n={2} gap={44} h={22} farbe={i < 3 ? C.blue : C.red} />)}
      </Panel>
      <Panel x={1160} y={290} w={650} h={660} r={28} a={sp(t, cue(1) + 0.2, 0.7)}>
        {[0, 1, 2].map((i) => <Panel key={i} x={40} y={50 + i * 200} w={570} h={160} r={18} rand={C.green}><Skel x={26} y={30} w={518} n={3} gap={42} h={18} seed={i + 1} /></Panel>)}
      </Panel>
      {[0, 1, 2].map((i) => <Lin key={i} x1={700} y1={360 + i * 148} x2={1190} y2={370 + i * 200} p={sp(t, cue(1) + 0.4 + i * 0.3, 0.6)} f={C.green} w={8} />)}
      <Lin x1={700} y1={950 - 60} x2={960} y2={880} p={sp(t, cue(2) + 0.2, 0.7)} f={C.red} w={8} dash="12 12" />
      <div style={{ position: "absolute", left: 930, top: 810, opacity: sp(t, cue(2) + 0.7, 0.5) }}><Icon name="x" size={130} color={C.red} sw={3} /></div>
    </Szene>
  );
};

const Kette = () => {
  const { t, cue } = useCues();
  const G = [["database", "Daten"], ["search", "Suche"], ["list", "Reranking"], ["sparkles", "Modell"]];
  const pos = lin(t, cue(1) + 0.3, cue(2) - 0.2, 0, 3);
  const X = [260, 700, 1140, 1580];
  return (
    <Szene titel="Von vorn nach hinten" tiefe={["repeat", 1380, 650, 900]}>
      {G.map(([ic, n], i) => (
        <React.Fragment key={n}>
          <Rv at={0.3 + i * 0.25} s0={0.85} style={{ position: "absolute", left: X[i] - 150, top: 400 }}><Badge name={ic} size={300} color={Math.abs(pos - i) < 0.5 ? C.green : C.blue} /></Rv>
          <Lbl x={X[i] - 200} y={730} w={400} t={n} size={60} align="center" a={sp(t, 0.5 + i * 0.25, 0.6)} />
          {i > 0 && <Lin x1={X[i - 1] + 170} y1={550} x2={X[i] - 170} y2={550} p={sp(t, 0.5 + i * 0.25, 0.5)} f={C.mute} w={8} />}
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: lerp(X[0], X[3], Math.min(1, pos / 3)) - 40, top: 300, opacity: sp(t, cue(1) + 0.2, 0.5) }}><Icon name="pointer" size={90} color="#fff" sw={1.8} /></div>
      <Chip x={660} y={880} t="Eine Sache ändern" f={C.orange} size={56} a={sp(t, cue(2) + 1.2, 0.6)} />
    </Szene>
  );
};

const Rechte = () => {
  const { t, cue } = useCues();
  return (
    <Szene titel="Rechte" tiefe={["lock", 1380, 650, 900]}>
      <div style={{ position: "absolute", left: 110, top: 290, opacity: sp(t, 0.3, 0.8) }}><Icon name="lock" size={500} color={C.orange} sw={1.2} /></div>
      <Lbl x={110} y={800} w={600} t="Vor der Suche" size={56} color={C.orange} a={sp(t, 0.8, 0.6)} />
      <Panel x={760} y={290} w={520} h={560} r={28} a={sp(t, cue(1) + 0.2, 0.7)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 110, background: C.blue + "33", borderRadius: "25px 25px 0 0" }} />
        {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 30 + (i % 5) * 92, top: 140 + Math.floor(i / 5) * 90, width: 76, height: 76, borderRadius: 14, background: i < 2 ? C.green + "55" : C.panel2 }} />)}
        {Array.from({ length: 25 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 30 + (i % 5) * 92, top: 140 + Math.floor(i / 5) * 90, width: 76, height: 76, borderRadius: 14, background: C.panel2, border: `3px solid ${(i % 7 === 0) ? C.green : C.line}` }}>{i % 7 === 0 && <Icon name="check" size={56} color={C.green} />}</div>)}
      </Panel>
      <Lbl x={760} y={870} w={520} t="Aktuell halten" size={50} color={C.green} align="center" a={sp(t, cue(1) + 0.8, 0.6)} />
      <Panel x={1360} y={290} w={450} h={560} r={28} a={sp(t, cue(1) + 1.4, 0.7)}>
        {Array.from({ length: 6 }).map((_, i) => <Skel key={i} x={30} y={40 + i * 84} w={390} n={1} h={22} seed={i + 1} farbe={i === 2 ? C.orange : "#48484a"} />)}
        <div style={{ position: "absolute", left: 150, top: 450, opacity: 0.9 }}><Icon name="search" size={140} color={C.orange} /></div>
      </Panel>
      <Lbl x={1360} y={870} w={450} t="Protokolle lesen" size={50} color={C.orange} align="center" a={sp(t, cue(1) + 1.8, 0.6)} />
    </Szene>
  );
};

export default { chat: Chat, testset: Testset, treffer: Treffer, beleg: Beleg, kette: Kette, rechte: Rechte };
