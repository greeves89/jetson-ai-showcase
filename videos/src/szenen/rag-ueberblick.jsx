import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, C } from "../lib.jsx";
import { Panel, Lbl, Skel, Dok, Zahlen, Dot, Fig, Chip, Lin, Flug, Karte } from "../bausteine.jsx";

// Regal mit neun Schubladen (Match-Cut-Anker über drei Szenen)
const SX = 1010, SY = 290, SW = 806, SH = 656;
const dz = (i) => [SX + 34 + 115 + (i % 3) * 254, SY + 34 + 90 + Math.floor(i / 3) * 204];
const Regal = ({ voll = [], glow = [], grau = 0, a = 1 }) => (
  <>
    <Panel x={SX} y={SY} w={SW} h={SH} a={a} r={32} />
    {Array.from({ length: 9 }).map((_, i) => {
      const [cx, cy] = dz(i), g = glow.includes(i), f = voll.includes(i);
      return (
        <div key={i} style={{ position: "absolute", left: cx - 115, top: cy - 90, width: 230, height: 180, borderRadius: 18, background: "#2c2c2e", border: `4px solid ${g ? C.green : C.line}`, opacity: a, boxSizing: "border-box", filter: f && grau > 0 ? `blur(${grau * 3}px) grayscale(${grau})` : "none" }}>
          <div style={{ position: "absolute", left: 85, top: 138, width: 60, height: 10, borderRadius: 5, background: g ? C.green : "#636366" }} />
          {f && <Zahlen x={30} y={34} w={170} h={80} n={9} seed={i + 2} farbe={g ? C.green : C.blue} />}
        </div>
      );
    })}
  </>
);

const Raten = () => {
  const { t, cue, word } = useCues();
  const dok = [["Handbuch", "Handbuch"], ["Vertrag", "Vertrag"], ["Protokoll", "Protokoll"]];
  const punkte = Math.floor(t * 2.5) % 4;
  return (
    <Szene titel="Das Problem" tiefe={["message", 1380, 650, 900]}>
      <Fig x={130} y={470} s={460} f={C.blue} />
      <Rv at={cue(0) + 0.4} s0={0.8} style={{ position: "absolute", left: 330, top: 270 }}>
        <div style={{ width: 380, height: 170, borderRadius: 60, background: C.panel2, border: `4px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110, fontWeight: 800, color: t > word(2, "rät") ? C.orange : C.mute }}>{t > word(2, "rät") ? "?" : ".".repeat(punkte + 1)}</div>
      </Rv>
      {dok.map(([n, w], i) => {
        const x = 790 + i * 340, a = sp(t, cue(1) + 0.1 + i * 0.2, 0.7), no = sp(t, word(1, w), 0.4);
        return (
          <React.Fragment key={n}>
            <Dok x={x} y={400} w={300} h={400} a={a} rot={(i - 1) * 4} n={8} seed={i + 1} />
            <div style={{ position: "absolute", left: x + 55, top: 470, opacity: no, transform: `scale(${lerp(0.5, 1, no)})` }}><Icon name="x" size={190} color={C.red} sw={2.4} /></div>
            <Lbl x={x - 10} y={840} w={320} t={n} size={50} align="center" a={a} />
          </React.Fragment>
        );
      })}
    </Szene>
  );
};

const Buch = () => {
  const { t, cue, word } = useCues();
  const flip = ease(t, cue(1) - 0.1, cue(1) + 0.9);
  const sc = Math.abs(1 - 2 * Math.min(flip, 1));
  const lupe = ease(t, cue(1) + 0.9, cue(1) + 2.2);
  return (
    <Szene titel="Open Book" tiefe={["book", 1400, 650, 900]}>
      <Panel x={110} y={300} w={800} h={650} r={28} a={sp(t, 0.3, 0.8)}><Skel x={50} y={60} w={700} n={11} gap={50} h={20} mark={[]} /></Panel>
      <div style={{ position: "absolute", left: 940, top: 300, width: 800, height: 650, transform: `scaleX(${sc})`, transformOrigin: "left center" }}>
        <Panel x={0} y={0} w={800} h={650} r={28} a={sp(t, 0.5, 0.8)}>
          <Skel x={50} y={60} w={700} n={11} gap={50} h={20} mark={flip > 0.5 ? [4, 5, 6] : []} hl={C.orange} seed={flip > 0.5 ? 9 : 3} />
        </Panel>
      </div>
      <div style={{ position: "absolute", left: 1500, top: 260, width: 56, height: 220, background: C.red, opacity: sp(t, cue(1) + 1.2, 0.5), clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)" }} />
      <div style={{ position: "absolute", left: lerp(500, 1330, lupe), top: lerp(560, 520, lupe), opacity: sp(t, cue(1) + 0.8, 0.5) }}><Icon name="search" size={260} color={C.orange} sw={1.6} /></div>
      <Lbl x={110} y={965} w={800} t="Richtige Seite" size={44} color={C.orange} a={sp(t, cue(1) + 1.6, 0.6)} />
    </Szene>
  );
};

const Vorbereiten = () => {
  const { t, cue, end } = useCues();
  const ziel = [0, 1, 4, 7];
  const cut = ease(t, cue(1) + 0.2, cue(1) + 0.9), num = ease(t, cue(2) + 0.1, cue(2) + 0.8);
  const fl = ziel.map((d, k) => Flug({ t, t0: cue(3) + 0.1 + k * 0.5, t1: cue(3) + 0.95 + k * 0.5, a: [320, 330 + k * 150 + 60], b: dz(d), bogen: 90 }));
  const voll = ziel.filter((d, k) => fl[k][2] >= 1);
  return (
    <Szene titel="Vorbereiten" tiefe={["file", 700, 650, 900]} anker={<Regal voll={voll} />}>
      {[0, 1, 2, 3].map((k) => {
        const top = 330 + k * (118 + cut * 22);
        const f = fl[k];
        const moving = t > cue(3) + 0.1 + k * 0.5;
        return (
          <React.Fragment key={k}>
            {!moving && <Panel x={110} y={top} w={420} h={118} r={16} a={sp(t, 0.3, 0.6)} rand={cut > 0.1 ? C.blue : C.line}><div style={{ opacity: 1 - num }}><Skel x={26} y={24} w={368} n={3} gap={30} h={14} seed={k + 2} /></div><Zahlen x={26} y={22} w={368} h={74} n={16} seed={k + 5} a={num} /></Panel>}
            {moving && f[2] < 1 && <Zahlen x={f[0] - 100} y={f[1] - 30} w={200} h={60} n={10} seed={k + 5} />}
          </React.Fragment>
        );
      })}
      <Lbl x={110} y={940} w={420} t="Stücke" size={44} color={C.mute} a={sp(t, cue(1) + 0.4, 0.5)} />
      <Lbl x={SX} y={965} w={SW} t="Index" size={44} color={C.mute} align="center" a={sp(t, cue(3), 0.6)} />
    </Szene>
  );
};

const Frage = () => {
  const { t, cue } = useCues();
  const num = ease(t, cue(1), cue(1) + 0.8);
  const fl = Flug({ t, t0: cue(1) + 1.2, t1: cue(1) + 2.2, a: [320, 700], b: [dz(4)[0], dz(4)[1]], bogen: 120 });
  const glow = t > cue(2) + 0.2 ? [1, 4, 7] : [];
  return (
    <Szene titel="Fragen" tiefe={["search", 600, 650, 900]} anker={<Regal voll={[0, 1, 4, 7]} glow={glow} />}>
      <Rv at={0.4} dy={0}><Panel x={110} y={330} w={700} h={190} r={60} rand={C.blue} bg={C.blue + "22"}><div style={{ fontSize: 110, fontWeight: 800, textAlign: "center", lineHeight: "190px", color: C.blue }}>Frage?</div></Panel></Rv>
      {fl[2] < 1 && <Zahlen x={fl[2] > 0 ? fl[0] - 280 : 110} y={fl[2] > 0 ? fl[1] - 60 : 640} w={560} h={150} n={16} seed={11} farbe={C.blue} a={num} />}
      <Lbl x={110} y={860} w={560} t="Zahlen" size={44} color={C.mute} a={num} />
      <Lbl x={SX} y={965} w={SW} t="Treffer" size={44} color={C.green} align="center" a={sp(t, cue(2) + 0.4, 0.6)} />
    </Szene>
  );
};

const Antwort = () => {
  const { t, cue } = useCues();
  const quellen = [1, 4, 7];
  const fl = quellen.map((d, k) => Flug({ t, t0: cue(0) + 0.3 + k * 0.35, t1: cue(0) + 1.2 + k * 0.35, a: dz(d), b: [275, 370 + k * 150], bogen: 60 }));
  const rest = quellen.filter((d, k) => fl[k][2] < 1);
  const zeilen = Math.floor(lin(t, cue(1) + 0.2, cue(1) + 2.2, 0, 6));
  return (
    <Szene titel="Antworten" tiefe={["sparkles", 600, 650, 900]} anker={<Regal voll={[0, 1, 4, 7]} glow={rest} />}>
      {quellen.map((d, k) => <Panel key={k} x={fl[k][0] - 165} y={fl[k][1] - 60} w={330} h={120} r={18} rand={C.green} a={fl[k][2] > 0 ? 1 : 0}><Skel x={24} y={26} w={282} n={3} gap={28} h={13} seed={k + 1} /></Panel>)}
      <Panel x={540} y={310} w={420} h={560} r={26} rand={C.blue} a={sp(t, cue(1), 0.7)}>
        <Skel x={34} y={44} w={352} n={zeilen} gap={64} h={22} farbe={C.blue} />
      </Panel>
      <Chip x={560} y={890} t="Quelle" f={C.orange} size={48} a={sp(t, cue(2), 0.6)} />
      {quellen.map((d, k) => <Lin key={k} x1={400} y1={370 + k * 150} x2={540} y2={600 + (k - 1) * 90} p={sp(t, cue(2) + k * 0.2, 0.6)} f={C.orange} w={4} dash="10 10" />)}
    </Szene>
  );
};

const Grenzen = () => {
  const { t, cue } = useCues();
  const g = ease(t, cue(0) + 0.2, cue(0) + 1.4);
  return (
    <Szene titel="Grenzen" tiefe={["alert", 600, 650, 900]} anker={<Regal voll={[0, 1, 4, 7]} grau={g} />}>
      <div style={{ position: "absolute", left: 250, top: 290, opacity: sp(t, cue(0) + 0.4, 0.7), transform: `scale(${lerp(0.6, 1, sp(t, cue(0) + 0.4, 0.8))})` }}><Icon name="alert" size={430} color={C.orange} sw={1.3} /></div>
      <Lbl x={110} y={790} w={820} t="Gute Quellen, gute Antwort." size={72} a={sp(t, cue(2) + 0.2, 0.8)} />
    </Szene>
  );
};

export default { raten: Raten, buch: Buch, vorbereiten: Vorbereiten, frage: Frage, antwort: Antwort, grenzen: Grenzen };
