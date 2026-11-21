import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Fig, Chip, Lin, Flug, Karte } from "../bausteine.jsx";

// Kandidaten-Karten (Anker): 200 klein -> 15 -> 20 Zeilen
const Trichter = () => {
  const { t, cue } = useCues();
  const fall = ease(t, cue(1) - 0.2, cue(1) + 1.0);
  const N = 60;
  return (
    <Szene titel="Vorauswahl" tiefe={["list", 1380, 650, 900]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><path d="M180 330 L1740 330 L1100 760 L820 760 Z" fill="none" stroke={C.line} strokeWidth={6} /><path d="M820 760 L820 940 L1100 940 L1100 760" fill="none" stroke={C.line} strokeWidth={6} /></svg>
      {Array.from({ length: N }).map((_, i) => {
        const col = i % 12, row = Math.floor(i / 12);
        const x0 = 230 + col * 120 + (rnd(i) - 0.5) * 10, y0 = 360 + row * 66;
        const keep = i < 15 && false;
        const ok = rnd(i + 50) > 0.76; // etwa ein Viertel bleibt
        const x = lerp(x0, ok ? 860 + (i % 5) * 50 : x0, fall), y = lerp(y0, ok ? 790 + Math.floor((i % 15) / 5) * 40 : 1100, fall);
        return <div key={i} style={{ position: "absolute", left: x - 38, top: y - 22, width: 76, height: 46, borderRadius: 10, background: ok && fall > 0.5 ? C.green : "#3a3a3c", opacity: sp(t, 0.1 + i * 0.012, 0.4), border: `3px solid ${ok && fall > 0.5 ? C.green : "#48484a"}` }} />;
      })}
      <Lbl x={110} y={290} w={300} t="200" size={90} color={C.mute} a={sp(t, 0.5, 0.6) * (1 - fall)} />
      <Lbl x={1130} y={800} w={500} t="15" size={120} color={C.green} a={fall} />
    </Szene>
  );
};

const Gespraech = () => {
  const { t, cue } = useCues();
  const tick = lin(t, 0.5, 6, 0, 1);
  return (
    <Szene titel="Gespräche" tiefe={["users", 1380, 650, 900]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 110 + i * 120, top: 300 + (i % 2) * 40, opacity: sp(t, 0.2 + i * 0.1, 0.5) }}><Badge name="file" size={100} color={C.green} /></div>
      ))}
      <Fig x={200} y={560} s={320} f={C.blue} a={sp(t, 0.5, 0.7)} />
      <Fig x={720} y={560} s={320} f={C.green} a={sp(t, cue(0) + 0.8, 0.7)} icon="user" />
      <Lin x1={540} y1={700} x2={720} y2={700} p={sp(t, cue(0) + 1.0, 0.6)} f={C.mute} w={7} dash="14 12" />
      <svg style={{ position: "absolute", left: 1150, top: 330, width: 640, height: 640 }} viewBox="0 0 640 640">
        <circle cx="320" cy="320" r="280" fill="none" stroke={C.line} strokeWidth="14" />
        <circle cx="320" cy="320" r="280" fill="none" stroke={C.orange} strokeWidth="14" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - (t * 0.12) % 1} transform="rotate(-90 320 320)" />
        <line x1="320" y1="320" x2="320" y2="130" stroke="#fff" strokeWidth="14" strokeLinecap="round" transform={`rotate(${((t * 0.12) % 1) * 360} 320 320)`} />
        <circle cx="320" cy="320" r="18" fill="#fff" />
      </svg>
      <Lbl x={1150} y={970} w={640} t="Dauert, zeigt Passung" size={44} color={C.mute} align="center" a={sp(t, cue(1) + 0.4, 0.6)} />
    </Szene>
  );
};

const Grob = () => {
  const { t, cue } = useCues();
  const nb = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ i, x: 760 + (rnd(i) - 0.5) * 300, y: 640 + (rnd(i + 9) - 0.5) * 300 }));
  const Q = [1300, 560];
  return (
    <Szene titel="Grobe Suche" tiefe={["search", 1380, 650, 900]}>
      <Karte x={110} y={280} w={1700} h={700} />
      {nb.map(({ i, x, y }) => <Dot key={i} x={x} y={y} r={20} f={C.blue} a={sp(t, 0.2 + i * 0.08, 0.5)} />)}
      <Dot x={Q[0]} y={Q[1]} r={30} f="#fff" ring={C.orange} a={sp(t, cue(0) + 0.4, 0.6)} />
      {nb.map(({ i, x, y }, k) => <Lin key={i} x1={Q[0]} y1={Q[1]} x2={x} y2={y} p={sp(t, cue(1) + k * 0.08, 0.5)} f={C.mute} w={3} />)}
      <Lbl x={Q[0] - 40} y={Q[1] + 50} w={300} t="Frage" size={48} color={C.orange} a={sp(t, cue(0) + 0.4, 0.6)} />
      <div style={{ position: "absolute", left: 1500, top: 340, width: 260, height: 200, borderRadius: 26, background: C.panel2, border: `4px solid ${C.green}`, opacity: sp(t, cue(2) + 0.2, 0.7), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 140, fontWeight: 800, color: C.green }}>9</div>
      <Lbl x={1470} y={560} w={330} t="Platz" size={50} color={C.green} align="center" a={sp(t, cue(2) + 0.4, 0.6)} />
      <div style={{ position: "absolute", left: 340, top: 340, opacity: sp(t, cue(0) + 0.6, 0.6) }}><Icon name="zap" size={110} color={C.orange} /></div>
    </Szene>
  );
};

const Reranker = () => {
  const { t, cue } = useCues();
  const p = ease(t, cue(0) + 0.6, cue(0) + 1.6), sc = ease(t, cue(1) + 0.3, cue(1) + 1.6);
  const sk = [2, 3, 4, 5];
  return (
    <Szene titel="Gemeinsam lesen" tiefe={["search", 1380, 650, 900]}>
      <Panel x={110} y={420} w={640} h={460} r={26} rand={C.orange} a={sp(t, 0.3, 0.7)} bg={C.orange + "18"}><Skel x={32} y={50} w={576} n={5} gap={72} h={26} farbe={C.orange} /></Panel>
      <Panel x={1170} y={420} w={640} h={460} r={26} rand={C.blue} a={sp(t, 0.5, 0.7)} bg={C.blue + "18"}><Skel x={32} y={50} w={576} n={5} gap={72} h={26} mark={sk.map((x) => x - 2).slice(0, 2)} hl={C.green} farbe={C.blue} /></Panel>
      <Lbl x={110} y={340} w={640} t="Frage" size={56} color={C.orange} align="center" a={p} />
      <Lbl x={1170} y={340} w={640} t="Kandidat" size={56} color={C.blue} align="center" a={p} />
      {[0, 1, 2].map((k) => <Lin key={k} x1={750} y1={500 + k * 130} x2={1170} y2={560 + k * 100} p={p} f={C.green} w={7} />)}
      <div style={{ position: "absolute", left: 790, top: 360, width: 340, height: 560, borderRadius: 30, border: `5px solid ${C.green}`, background: "#000a", opacity: p }} />
      <div style={{ position: "absolute", left: 790, top: 600, width: 340, textAlign: "center", fontSize: 220, fontWeight: 800, color: C.green, opacity: sc }}>{Math.round(sc * 0.9 * 10) / 10 || ""}</div>
      <Lbl x={790} y={930} w={340} t="Punktwert" size={46} color={C.green} align="center" a={sc} />
    </Szene>
  );
};

const Sortieren = () => {
  const { t, cue } = useCues();
  const m = ease(t, cue(0) + 1.8, cue(0) + 3.2);
  const order = [3, 7, 1, 5, 8, 2, 0, 6, 4]; // Platz 9 = id 8 nach oben
  return (
    <Szene titel="Neu sortiert" tiefe={["list", 1380, 650, 900]}>
      {Array.from({ length: 9 }).map((_, id) => {
        const start = id, ziel = id === 8 ? 0 : id < 8 ? id + 1 : 0;
        const y = 290 + lerp(start, ziel, m) * 76;
        const star = id === 8;
        return (
          <div key={id} style={{ position: "absolute", left: 110, top: y, width: 1000, height: 64, borderRadius: 18, background: star && m > 0.9 ? C.green + "33" : C.panel, border: `4px solid ${star ? C.green : C.line}`, opacity: sp(t, 0.1 + id * 0.06, 0.5), boxSizing: "border-box", zIndex: star ? 5 : 1 }}>
            <Skel x={96} y={22} w={760} n={1} h={20} seed={id + 3} farbe={star ? C.green : "#48484a"} />
            <div style={{ position: "absolute", left: 22, top: 6, fontSize: 40, fontWeight: 800, color: C.mute }}>{Math.round(lerp(start, ziel, m)) + 1}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 1220, top: 290, opacity: sp(t, cue(1) + 0.2, 0.7) }}>
        <div style={{ fontSize: 300, fontWeight: 800, color: C.green, lineHeight: 1 }}>5</div>
        <Lbl x={0} y={310} w={500} t="gehen ans Modell" size={50} color={C.mute} a={1} />
      </div>
      <div style={{ position: "absolute", left: 1220, top: 700, opacity: sp(t, cue(1) + 0.8, 0.7) }}><Icon name="sparkles" size={200} color={C.blue} /></div>
    </Szene>
  );
};

const Waage = () => {
  const { t, cue } = useCues();
  const kipp = ease(t, 0.6, 2.0), kipp2 = ease(t, cue(1) + 0.2, cue(1) + 1.4);
  const ang = lerp(0, 8, kipp) - lerp(0, 16, kipp2);
  return (
    <Szene titel="Abwägen" tiefe={["target", 1380, 650, 900]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <g transform={`rotate(${ang} 960 560)`}>
          <line x1="360" y1="560" x2="1560" y2="560" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
          <line x1="360" y1="560" x2="360" y2="700" stroke={C.mute} strokeWidth="6" /><line x1="1560" y1="560" x2="1560" y2="700" stroke={C.mute} strokeWidth="6" />
          <rect x="200" y="700" width="320" height="30" rx="15" fill={C.orange} /><rect x="1400" y="700" width="320" height="30" rx="15" fill={C.green} />
        </g>
        <path d="M960 560 L860 900 L1060 900 Z" fill={C.panel2} stroke={C.line} strokeWidth="6" />
      </svg>
      <div style={{ position: "absolute", left: 230, top: 400 + ang * 3, opacity: sp(t, 0.4, 0.6) }}><Icon name="clock" size={240} color={C.orange} /></div>
      <div style={{ position: "absolute", left: 1430 , top: 400 - ang * 3, opacity: sp(t, 0.8, 0.6) }}><Icon name="target" size={240} color={C.green} /></div>
      <Lbl x={200} y={770} w={340} t="Zeit" size={56} color={C.orange} align="center" a={sp(t, 0.6, 0.6)} />
      <Lbl x={1400} y={770} w={340} t="Treffer" size={56} color={C.green} align="center" a={sp(t, 0.9, 0.6)} />
      <Chip x={660} y={940} t="Mit Test prüfen" f={C.blue} size={52} a={sp(t, cue(1) + 1.0, 0.6)} />
    </Szene>
  );
};

export default { trichter: Trichter, gespraech: Gespraech, grob: Grob, reranker: Reranker, sortieren: Sortieren, waage: Waage };
