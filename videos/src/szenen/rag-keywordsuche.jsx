import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Fig, Chip, Lin, Flug, Karte } from "../bausteine.jsx";

const Telefonbuch = () => {
  const { t, cue, word } = useCues();
  const f = ease(t, cue(0) + 0.5, cue(0) + 2.6);
  const treffer = sp(t, cue(0) + 2.4, 0.6);
  const ry = 300 + f * 6 * 82;
  return (
    <Szene titel="Telefonbuch" tiefe={["book", 1400, 650, 900]}>
      <Panel x={110} y={280} w={940} h={700} r={26} a={sp(t, 0.3, 0.7)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 40, top: 30 + i * 82, width: 860, height: 56, borderRadius: 12, background: i === 6 && treffer > 0.1 ? C.orange + "44" : "transparent", border: i === 6 && treffer > 0.1 ? `4px solid ${C.orange}` : "none" }}>
            <Skel x={14} y={18} w={300} n={1} h={20} seed={i + 2} farbe={i === 6 && treffer > 0.1 ? C.orange : "#48484a"} />
            <Skel x={560} y={18} w={250} n={1} h={20} seed={i + 9} />
          </div>
        ))}
      </Panel>
      <div style={{ position: "absolute", left: 880, top: 280 + 30 + f * 6 * 82 - 20, opacity: sp(t, 0.6, 0.5) }}><Icon name="pointer" size={130} color="#fff" sw={1.6} /></div>
      <Rv at={cue(0) + 2.4} dx={40} dy={0} style={{ position: "absolute", left: 1130, top: 380 }}>
        <div style={{ width: 680, height: 420, borderRadius: 34, background: C.orange + "22", border: `6px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 150, fontWeight: 800, color: C.orange }}>Meier</div>
      </Rv>
      <Lbl x={1130} y={840} w={680} t="Genau dieses Wort" size={50} align="center" a={treffer} />
    </Szene>
  );
};

const WORTE = ["der", "Dichtungsring", "wird", "im", "Ventil", "gewechselt", "und", "die", "Pumpe", "dann", "geprüft", "mit", "dem", "Handbuch", "des", "Herstellers", "für", "jede", "Anlage"];
const Absatz = ({ x, y, w, hit, dim, a = 1, off = 0, seed = 1 }) => {
  const zeilen = 5; const pro = 5;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: a }}>
      {Array.from({ length: zeilen * pro }).map((_, i) => {
        const r = Math.floor(i / pro), c = i % pro;
        const wd = 90 + rnd(i * 1.7 + seed) * 70;
        const m = hit.includes(i);
        return <div key={i} style={{ position: "absolute", left: c * (w / pro), top: r * 96, width: Math.min(wd, w / pro - 14), height: 54, borderRadius: 14, background: m ? "#ffd60a" : "#2c2c2e", opacity: m ? 1 : dim }} />;
      })}
    </div>
  );
};
const Zaehlen = () => {
  const { t, cue } = useCues();
  const hitA = [2, 8, 11, 17, 23], hitB = [4, 19];
  const n = (arr, s) => arr.filter((h, k) => t > cue(0) + s + k * 0.5).length;
  const a = n(hitA, 0.8), b = n(hitB, 1.0);
  const ranks = ease(t, cue(1) + 0.2, cue(1) + 1.2);
  return (
    <Szene titel="Wörter zählen" tiefe={["search", 1400, 650, 900]}>
      <Absatz x={110} y={400} w={920} hit={hitA.filter((h, k) => t > cue(0) + 0.8 + k * 0.5)} dim={0.9} seed={1} a={sp(t, 0.3, 0.7)} />
      <Absatz x={1130} y={400} w={680} hit={hitB.filter((h, k) => t > cue(0) + 1.0 + k * 0.5)} dim={0.9} seed={5} a={sp(t, 0.5, 0.7)} />
      <Lbl x={110} y={290} w={300} t={String(a)} size={110} color="#ffd60a" a={sp(t, 0.8, 0.5)} />
      <Lbl x={1130} y={290} w={300} t={String(b)} size={110} color={C.mute} a={sp(t, 0.8, 0.5)} />
      <div style={{ position: "absolute", left: 110, top: 910, width: 920 * ranks * a / 5, height: 40, borderRadius: 20, background: C.green }} />
      <div style={{ position: "absolute", left: 1130, top: 910, width: 680 * ranks * b / 5, height: 40, borderRadius: 20, background: C.mute }} />
      <Lbl x={1100} y={895} w={30} t="" size={10} />
      <Chip x={1560} y={300} t="oben" f={C.green} size={44} a={ranks * (a > b ? 1 : 0)} />
    </Szene>
  );
};

const Gewicht = () => {
  const { t, cue, word } = useCues();
  const g = ease(t, cue(1) + 0.3, cue(1) + 1.4), g2 = ease(t, cue(2) + 0.3, cue(2) + 1.2);
  const W = [["der", 480, 360, 0], ["die", 760, 310, 0], ["und", 1000, 400, 0], ["im", 1270, 340, 0], ["wird", 640, 560, 0], ["das", 1180, 600, 0], ["Dichtungsring", 560, 760, 1], ["Ventil", 1330, 800, 1], ["Pumpe", 960, 900, 1]];
  return (
    <Szene titel="Seltene Wörter" tiefe={["list", 1400, 650, 900]}>
      {W.map(([n, x, y, rare], i) => {
        const base = 56, size = rare ? lerp(base, 130, g) : lerp(base, 36, g);
        const col = rare ? lerp(0, 1, g) : 0;
        return <div key={n} style={{ position: "absolute", left: x - 300, top: y - 70, width: 600, textAlign: "center", fontSize: size, fontWeight: 800, color: rare && g > 0.4 ? C.orange : "#8e8e93", opacity: sp(t, 0.2 + i * 0.1, 0.5) * (rare ? 1 : lerp(1, 0.45, g)) }}>{n}</div>;
      })}
      <Chip x={1380} y={290} t="BM25" f={C.blue} size={56} a={g2} />
    </Szene>
  );
};

const Saettigung = () => {
  const { t, cue } = useCues();
  const p = ease(t, cue(0) + 0.4, cue(0) + 3.4), k2 = sp(t, cue(1) + 0.3, 0.8);
  const pts = Array.from({ length: 40 }).map((_, i) => { const x = i / 39; return [x, 1 - Math.exp(-4 * x)]; });
  const X0 = 140, Y0 = 300, W = 1000, H = 600;
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${X0 + x * W} ${Y0 + H - y * H}`).join(" ");
  const cur = pts[Math.floor(p * 39)];
  return (
    <Szene titel="Sättigung" tiefe={["zap", 1400, 650, 900]}>
      <Panel x={110} y={280} w={1060} h={680} r={28} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <path d={path} fill="none" stroke={C.blue} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
        <circle cx={X0 + cur[0] * W} cy={Y0 + H - cur[1] * H} r={22} fill={C.orange} />
      </svg>
      <Lbl x={130} y={895} w={600} t="Vorkommen" size={40} color={C.mute} />
      <Panel x={1260} y={300} w={240} h={640} r={22} a={k2}><Skel x={24} y={36} w={190} n={12} gap={50} h={16} /></Panel>
      <Panel x={1560} y={720} w={240} h={220} r={22} a={k2}><Skel x={24} y={36} w={190} n={4} gap={44} h={16} /></Panel>
      {[1260, 1560].map((x, i) => <div key={x} style={{ position: "absolute", left: x, top: 960 - 60, width: 240 * k2, height: 40, borderRadius: 20, background: C.green }} />)}
      <Lbl x={1260} y={230} w={540} t="Länge egal" size={50} color={C.green} align="center" a={k2} />
    </Szene>
  );
};

const Staerken = () => {
  const { t, cue } = useCues();
  const a1 = sp(t, cue(0) + 0.3, 0.7), a2 = sp(t, cue(1) + 0.2, 0.7), x2 = sp(t, cue(2) + 0.8, 0.6);
  return (
    <Szene titel="Stärken" tiefe={["check", 1400, 650, 900]}>
      <Panel x={110} y={280} w={820} h={680} r={28} a={a1} rand={C.green}>
        <div style={{ position: "absolute", left: 40, top: 36, fontSize: 80, fontWeight: 800, color: C.green }}>E-4711</div>
        <Absatz x={40} y={190} w={740} hit={[7, 12]} dim={0.6} seed={2} a={1} />
      </Panel>
      <div style={{ position: "absolute", left: 740, top: 700, opacity: a1 }}><Icon name="check" size={190} color={C.green} sw={3} /></div>
      <Panel x={990} y={280} w={820} h={680} r={28} a={a2} rand={C.red}>
        <div style={{ position: "absolute", left: 40, top: 36, fontSize: 70, fontWeight: 800, color: C.orange }}>Auto abstellen</div>
        <Absatz x={40} y={190} w={740} hit={[]} dim={0.6} seed={4} a={1} />
        <div style={{ position: "absolute", left: 40, top: 520, fontSize: 56, fontWeight: 700, color: C.mute, opacity: x2 }}>Fahrzeug parken</div>
      </Panel>
      <div style={{ position: "absolute", left: 1550, top: 700, opacity: x2 }}><Icon name="x" size={190} color={C.red} sw={3} /></div>
    </Szene>
  );
};

const Sinn = () => {
  const { t, cue } = useCues();
  const pts = Array.from({ length: 12 }).map((_, i) => [1300 + (rnd(i) - 0.5) * 420, 600 + (rnd(i + 8) - 0.5) * 380]);
  return (
    <Szene titel="Bedeutung" tiefe={["help", 1400, 650, 900]}>
      <Lbl x={110} y={300} w={700} t="?" size={560} color={C.orange} weight={800} a={sp(t, 0.3, 0.8)} style={{ lineHeight: 0.9 }} />
      <Chip x={190} y={850} t="Sinn" f={C.orange} size={70} a={sp(t, cue(0) + 0.4, 0.6)} />
      <Karte x={900} y={290} w={910} h={690} a={sp(t, cue(0) + 0.6, 0.7)} />
      {pts.map(([x, y], i) => <Dot key={i} x={x} y={y} r={20} f={i < 5 ? C.green : C.blue} a={sp(t, cue(0) + 0.9 + i * 0.1, 0.5)} />)}
    </Szene>
  );
};

export default { telefonbuch: Telefonbuch, zaehlen: Zaehlen, gewicht: Gewicht, saettigung: Saettigung, staerken: Staerken, sinn: Sinn };
