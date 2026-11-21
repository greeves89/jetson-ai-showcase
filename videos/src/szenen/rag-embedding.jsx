import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Fig, Chip, Lin, Flug, Karte } from "../bausteine.jsx";

const KX = 110, KY = 270, KW = 1700, KH = 710;
const Pin = ({ x, y, f = C.blue, t, a = 1, r = 26 }) => (
  <>
    <Dot x={x} y={y} r={r} f={f} a={a} />
    {t && <Lbl x={x - 150} y={y + r + 10} w={300} t={t} size={46} align="center" a={a} />}
  </>
);

const Stadtplan = () => {
  const { t, cue } = useCues();
  const B = [420, 470], U = [700, 540], F = [1380, 620];
  const o = (p) => sp(t, p, 0.7);
  return (
    <Szene titel="Stadtplan" tiefe={["grid", 1380, 650, 900]}>
      <Karte x={KX} y={KY} w={KW} h={KH}>
        <svg width={KW} height={KH} style={{ position: "absolute", left: 0, top: 0 }}>
          {[[0, 200, 1700, 260], [0, 520, 1700, 470], [300, 0, 380, 710], [900, 0, 840, 710], [1300, 0, 1400, 710]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="#3a3a3c" strokeWidth={26} strokeLinecap="round" />)}
        </svg>
      </Karte>
      {[[B, "Bahnhof", cue(0) + 0.3], [U, "Bus", cue(0) + 0.9], [F, "Friedhof", cue(1) + 0.8]].map(([p, n, at]) => <Pin key={n} x={KX + p[0]} y={KY + p[1]} t={n} a={o(at)} f={n === "Friedhof" ? C.orange : C.blue} />)}
      {/* zwei Zahlen: Lote auf die Achsen */}
      <Lin x1={KX + B[0]} y1={KY + B[1]} x2={KX + B[0]} y2={KY + KH} p={o(cue(0) + 1.2)} f={C.green} w={5} dash="10 10" />
      <Lin x1={KX + B[0]} y1={KY + B[1]} x2={KX} y2={KY + B[1]} p={o(cue(0) + 1.5)} f={C.green} w={5} dash="10 10" />
      <Lin x1={KX + B[0]} y1={KY + B[1]} x2={KX + U[0]} y2={KY + U[1]} p={o(cue(1) + 0.3)} f={C.green} w={9} />
      <Lin x1={KX + B[0]} y1={KY + B[1]} x2={KX + F[0]} y2={KY + F[1]} p={o(cue(1) + 1.0)} f={C.orange} w={9} dash="22 14" />
      <Lbl x={KX + 520} y={KY + 420} w={200} t="nah" size={50} color={C.green} a={o(cue(1) + 0.8)} />
      <Lbl x={KX + 850} y={KY + 600} w={200} t="weit" size={50} color={C.orange} a={o(cue(1) + 1.8)} />
    </Szene>
  );
};

const SORTEN = [
  ["Zitrone", [0.55, 0.9, 0.25], "#ffd60a"], ["Himbeere", [0.6, 0.85, 0.3], "#ff375f"], ["Nuss", [0.3, 0.1, 0.9], "#a2845e"],
];
const Eis = () => {
  const { t, cue, word } = useCues();
  const FARB = [C.orange, C.green, C.text];
  return (
    <Szene titel="Eissorten" tiefe={["sparkles", 1380, 650, 900]}>
      {SORTEN.map(([n, w, f], i) => {
        const cx = 330 + i * 630, at = i === 0 ? cue(0) + 0.8 : i === 1 ? word(1, "Zitrone") : word(1, "Nuss");
        const a = sp(t, i === 0 ? cue(0) + 0.4 : cue(1) + 0.3 * i, 0.8);
        return (
          <React.Fragment key={n}>
            <svg style={{ position: "absolute", left: cx - 110, top: 285, opacity: a }} width="220" height="260" viewBox="0 0 220 260"><path d="M40 120 L110 250 L180 120 Z" fill="#c7a15b" /><circle cx="110" cy="85" r="72" fill={f} /></svg>
            {w.map((v, k) => <div key={k} style={{ position: "absolute", left: cx - 175 + k * 125, top: 950 - 340 * v * ease(t, cue(0) + 1.0 + k * 0.25 + i * 0.3, cue(0) + 1.8 + k * 0.25 + i * 0.3), width: 100, height: 340 * v * ease(t, cue(0) + 1.0 + k * 0.25 + i * 0.3, cue(0) + 1.8 + k * 0.25 + i * 0.3), borderRadius: 14, background: FARB[k], opacity: a }} />)}
            <Lbl x={cx - 250} y={548} w={500} t={n} size={52} align="center" a={a} />
          </React.Fragment>
        );
      })}
      {["süß", "fruchtig", "cremig"].map((n, k) => <Lbl key={n} x={155 + k * 125 - 25} y={960} w={150} t={n} size={36} color={FARB[k]} align="center" a={sp(t, cue(0) + 1.8, 0.6)} />)}
      <Chip x={1230} y={280} t="Vektor" f={C.blue} size={56} a={sp(t, cue(2) + 0.4, 0.7)} />
    </Szene>
  );
};

const Satz = () => {
  const { t, cue, word } = useCues();
  const puls = ease(t, cue(1) + 0.3, cue(1) + 1.6);
  const L = [[4, 5, 3]];
  const knoten = [[0, 4], [1, 5], [2, 3]].flatMap(([c, n]) => Array.from({ length: n }).map((_, i) => [880 + c * 180, 640 + (i - (n - 1) / 2) * 110]));
  return (
    <Szene titel="Satz zu Zahlen" tiefe={["network", 1380, 650, 900]}>
      <Panel x={110} y={400} w={520} h={480} r={28} a={sp(t, 0.3, 0.8)}><Skel x={40} y={50} w={440} n={7} gap={58} h={22} /></Panel>
      <Lin x1={650} y1={640} x2={820} y2={640} p={sp(t, cue(1), 0.6)} f={C.mute} w={7} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {knoten.slice(0, 4).map(([x, y], i) => knoten.slice(4, 9).map(([x2, y2], j) => <line key={`${i}${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke={C.blue} strokeWidth={2.5} opacity={0.25 + puls * 0.4} />))}
        {knoten.slice(4, 9).map(([x, y], i) => knoten.slice(9).map(([x2, y2], j) => <line key={`b${i}${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke={C.blue} strokeWidth={2.5} opacity={0.25 + puls * 0.4} />))}
        {knoten.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={26} fill={C.panel2} stroke={C.blue} strokeWidth={5} opacity={sp(t, cue(1) + 0.1 + i * 0.04, 0.5)} />)}
      </svg>
      <Lbl x={820} y={310} w={600} t="Embedding" size={56} color={C.blue} a={sp(t, cue(1), 0.7)} />
      <Lin x1={1280} y1={640} x2={1380} y2={640} p={sp(t, cue(1) + 1.0, 0.6)} f={C.mute} w={7} />
      <Zahlen x={1400} y={380} w={400} h={520} n={14} seed={7} farbe={C.blue} a={ease(t, cue(1) + 1.2, cue(1) + 2.0)} />
      <Lbl x={1400} y={920} w={400} t="Vektor" size={50} color={C.mute} a={ease(t, cue(1) + 1.6, cue(1) + 2.2)} />
    </Szene>
  );
};

// Punkte der Bedeutungskarte (Anker über drei Szenen)
const CL = [
  { n: "Essen", c: [520, 330], f: C.orange }, { n: "Autos", c: [1250, 560], f: C.blue }, { n: "Tiere", c: [1250, 250], f: C.green },
];
const PTS = CL.flatMap((k, ki) => Array.from({ length: 8 }).map((_, i) => ({ ki, x: k.c[0] + (rnd(ki * 17 + i) - 0.5) * 260, y: k.c[1] + (rnd(ki * 17 + i + 40) - 0.5) * 220 })));
const KarteA = ({ p = 1, dim = 0, t0 }) => (
  <>
    <Karte x={KX} y={KY} w={KW} h={KH} />
    {PTS.map((q, i) => <Dot key={i} x={KX + q.x} y={KY + q.y} r={15} f={CL[q.ki].f} a={Math.max(0, Math.min(1, p * 24 - i)) * (1 - dim * 0.75)} />)}
  </>
);
const KarteSzene = () => {
  const { t, cue, word } = useCues();
  const p = ease(t, cue(0) + 0.5, cue(2) - 0.5);
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Bedeutungskarte" tiefe={["grid", 1380, 650, 900]} anker={<KarteA p={p} />}>
      {CL.map((k) => <Lbl key={k.n} x={KX + k.c[0] - 160} y={KY + k.c[1] + 135} w={320} t={k.n} size={50} color={k.f} align="center" a={o(cue(1))} />)}
      <Chip x={KX + 760} y={KY + 40} t="Nudeln" f={C.orange} size={44} a={o(word(2, "klingt") - 0.2)} />
      <Chip x={KX + 560} y={KY + 570} t="Spaghetti" f={C.orange} size={44} a={o(word(2, "klingt") + 0.2)} />
      <Lin x1={KX + 900} y1={KY + 90} x2={KX + 760} y2={KY + 570} p={o(word(2, "klingt") + 0.5)} f={C.orange} w={5} dash="10 10" />
    </Szene>
  );
};

const Winkel = () => {
  const { t, cue, word } = useCues();
  const O = [700, 700], R = 420;
  const th1 = -35 * Math.PI / 180;
  const th2 = t < word(2, "Gleiche") ? -75 * Math.PI / 180 : t < word(2, "rechter") ? lerp(-75, -35, ease(t, word(2, "Gleiche"), word(2, "Gleiche") + 0.8)) * Math.PI / 180 : lerp(-35, -125, ease(t, word(2, "rechter"), word(2, "rechter") + 0.8)) * Math.PI / 180;
  const ang = Math.abs(th2 - th1) * 180 / Math.PI;
  const wert = ang < 8 ? "1" : ang > 80 && ang < 100 ? "0" : "";
  const A = [O[0] + R * Math.cos(th1), O[1] + R * Math.sin(th1)], B = [O[0] + R * Math.cos(th2), O[1] + R * Math.sin(th2)];
  const arc = (r) => { const a1 = th1, a2 = th2; const [x1, y1] = [O[0] + r * Math.cos(a1), O[1] + r * Math.sin(a1)], [x2, y2] = [O[0] + r * Math.cos(a2), O[1] + r * Math.sin(a2)]; return `M${x1} ${y1} A${r} ${r} 0 0 ${a2 < a1 ? 0 : 1} ${x2} ${y2}`; };
  return (
    <Szene titel="Winkel" tiefe={["pointer", 1380, 650, 900]} anker={<KarteA p={1} dim={sp(t, 0.3, 0.8)} />}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <defs><marker id="pf" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#fff" /></marker></defs>
        <line x1={O[0]} y1={O[1]} x2={A[0]} y2={A[1]} stroke={C.blue} strokeWidth={14} markerEnd="url(#pf)" opacity={sp(t, cue(1) - 0.2, 0.6)} />
        <line x1={O[0]} y1={O[1]} x2={B[0]} y2={B[1]} stroke={C.orange} strokeWidth={14} markerEnd="url(#pf)" opacity={sp(t, cue(1) - 0.2, 0.6)} />
        <path d={arc(190)} fill="none" stroke={C.green} strokeWidth={12} opacity={sp(t, cue(1), 0.6)} />
        <circle cx={O[0]} cy={O[1]} r={16} fill="#fff" />
      </svg>
      <Lbl x={1240} y={420} w={400} t={wert} size={380} color={C.green} weight={800} a={wert ? 1 : 0} />
      <Lbl x={1240} y={300} w={500} t="Kosinus" size={56} color={C.mute} a={sp(t, cue(0) + 0.5, 0.6)} />
    </Szene>
  );
};

const Frage = () => {
  const { t, cue } = useCues();
  const Q = [KX + 400, KY + 380];
  const fl = Flug({ t, t0: 0.5, t1: 1.8, a: [KX - 60, KY + 640], b: Q, bogen: 80 });
  const nb = PTS.map((q, i) => ({ i, d: Math.hypot(q.x - 400, q.y - 380) })).sort((a, b) => a.d - b.d).slice(0, 3).map((x) => x.i);
  const so = ease(t, cue(1), cue(1) + 0.8);
  return (
    <Szene titel="Nächste Nachbarn" tiefe={["search", 1380, 650, 900]} anker={<KarteA p={1} />}>
      {nb.map((i) => <Lin key={i} x1={Q[0]} y1={Q[1]} x2={KX + PTS[i].x} y2={KY + PTS[i].y} p={so} f={C.green} w={7} />)}
      {nb.map((i) => <Dot key={i} x={KX + PTS[i].x} y={KY + PTS[i].y} r={24} f={C.green} a={so} />)}
      <Dot x={fl[0]} y={fl[1]} r={28} f="#fff" ring={C.orange} />
      <Lbl x={Q[0] - 150} y={Q[1] + 40} w={300} t="Frage" size={52} align="center" color={C.orange} a={sp(t, 1.6, 0.6)} />
      <Lbl x={KX + 760} y={KY + 640} w={600} t="Treffer" size={52} color={C.green} a={so} />
    </Szene>
  );
};

export default { stadtplan: Stadtplan, eis: Eis, satz: Satz, karte: KarteSzene, winkel: Winkel, frage: Frage };
