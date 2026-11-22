import React from "react";
import { Szene, useCues, sp, ease, lerp, rnd, C } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Pf, Etikett, Mark } from "../neu.jsx";
import { Bahn, Kn, Fl, Ic, Bg, RY } from "../bausteine-betrieb.jsx";

const X = (i) => 150 + i * 13;
const BASE = (i) => 700 - 3.2 * i + 55 * Math.sin((i / 12) * Math.PI * 2);
const YH = (i) => BASE(i) + (rnd(i * 1.7 + 5) - 0.5) * 44;
const YA = (i) => YH(i) + (i >= 58 ? (i - 57) * 14 : 0);
const rng = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k);
const HIST = rng(0, 48).map((i) => [X(i), YH(i)]);
const FC = [[X(48), YH(48)], ...rng(49, 72).map((i) => [X(i), BASE(i)])];
const ACT = rng(48, 72).map((i) => [X(i), YA(i)]);
const TREND = [[X(0), 700], [X(72), 700 - 3.2 * 72]];
const hw = (i) => 8 + (i - 48) * 3.4;
const BAND = [...rng(48, 72).map((i) => [X(i), BASE(i) - (i === 48 ? 0 : hw(i))]), ...rng(48, 72).reverse().map((i) => [X(i), BASE(i) + (i === 48 ? 0 : hw(i))])];

// Anker links: das Diagramm
const Ser = ({ hist = 1, fc = 0, band = 0, act = 0, dim = 0, trend = 0, saison = 0, heute = 1, fau = 0, label = "Zeitreihe", ghost }) => (
  <>
    <Panel x={90} y={215} w={1040} h={760} r={28} />
    <Lbl x={130} y={236} w={700} t={label} size={40} align="left" color={C.mute} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      <line x1={130} y1={910} x2={1100} y2={910} stroke={C.line} strokeWidth="5" strokeLinecap="round" />
      <text x={1100} y={950} fill={C.mute} fontSize="34" textAnchor="end" fontWeight="600">Zeit</text>
      {[0, 12, 24, 36, 48, 60, 72].map((i) => <line key={i} x1={X(i)} y1={896} x2={X(i)} y2={924} stroke={C.line} strokeWidth="4" />)}
      <line x1={X(48)} y1={300} x2={X(48)} y2={910} stroke={C.mute} strokeWidth="3" strokeDasharray="10 12" opacity={heute} />
      <text x={X(48) - 12} y={285} fill={C.mute} fontSize="34" textAnchor="end" fontWeight="600" opacity={heute}>Heute</text>
      {band > 0 && <polygon points={BAND.map(([x, y]) => `${x},${lerp(BASE(Math.round((x - 150) / 13)), y, band)}`).join(" ")} fill={C.blue + "33"} stroke="none" />}
    </svg>
    <Bahn pts={HIST} p={hist} f={C.text} w={7} a={1 - dim * 0.65} />
    {trend > 0 && <Bahn pts={TREND} p={trend} f={C.orange} w={9} />}
    {saison > 0 && rng(0, 5).map((k) => <div key={k} style={{ position: "absolute", left: X(3 + 12 * k) - 14, top: BASE(3 + 12 * k) - 14 - 40, width: 28, height: 28, borderRadius: 14, background: C.green, opacity: saison > k / 6 ? 1 : 0 }} />)}
    {fc > 0 && <Bahn pts={FC} p={fc} f={C.blue} w={8} dash={undefined} />}
    {act > 0 && <Bahn pts={ACT} p={act} f={C.red} w={8} />}
    {fau > 0 && <Bahn pts={[[X(48), YH(48)], [X(60), YH(48)]]} p={fau} f={C.mute} w={7} />}
  </>
);
const RC = 1505; // Mitte der rechten Spalte
const Rk = ({ y, ...p }) => <Kn x={RC} y={y} w={640} h={140} size={40} {...p} />;

// ---------- 1 Wetter
const Wetter = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const th = ease(t, 0.4, cue(1) - 0.2), tf = word(1, "Faustregel") + 0.3;
  return (
    <Szene titel="Eine Zeitreihe" tiefe={["clock", 1500, 640, 800]} anker={<Ser hist={th} fau={ease(t, tf, tf + 1.2)} heute={ease(t, cue(1) - 0.2, cue(1) + 0.4)} />}>
      <Rk y={RY + 100} t="Reihenfolge zählt" ic="clock" f={C.blue} a={o(word(1, "Hier"))} />
      <Rk y={RY + 290} t="Faustregel: wie gestern" ic="repeat" f={C.mute} a={o(tf - 0.3)} />
      <Rk y={RY + 480} t="Modell muss sie schlagen" ic="target" f={C.green} a={o(word(1, "schlagen") - 0.5)} />
    </Szene>
  );
};

// ---------- 2 Trend, Saison, Zufall
const Mini = ({ y, a, f, children, t }) => (
  <>
    <div style={{ position: "absolute", left: 1180, top: y, width: 650, height: 200, borderRadius: 24, background: C.panel, border: `3px solid ${f}`, opacity: a, boxSizing: "border-box" }} />
    <div style={{ position: "absolute", left: 1210, top: y + 20, fontSize: 42, fontWeight: 700, color: f, opacity: a }}>{t}</div>
    <div style={{ opacity: a }}>{children}</div>
  </>
);
const Teile = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t1 = word(1, "Trend"), t2 = word(1, "Saison"), t3 = word(1, "Zufall");
  const w = (k, fn) => Array.from({ length: 30 }, (_, i) => [1400 + i * 14, fn(i)]);
  return (
    <Szene titel="Trend, Saison, Zufall" tiefe={["trend", 1500, 640, 800]} anker={<Ser dim={t > t1 ? 0.6 : 0} trend={ease(t, t1, t1 + 1)} saison={ease(t, t2, t2 + 1.2)} />}>
      <Mini y={RY + 10} a={o(t1)} f={C.orange} t="Trend"><Bahn pts={w(0, (i) => RY + 160 - i * 2.8)} p={ease(t, t1, t1 + 0.8)} f={C.orange} w={8} /></Mini>
      <Mini y={RY + 250} a={o(t2)} f={C.green} t="Saison"><Bahn pts={w(0, (i) => RY + 400 + Math.sin(i / 30 * Math.PI * 4) * 40)} p={ease(t, t2, t2 + 0.8)} f={C.green} w={8} /></Mini>
      <Mini y={RY + 490} a={o(t3)} f={C.mute} t="Zufall"><Bahn pts={w(0, (i) => RY + 640 + (rnd(i * 3.1) - 0.5) * 80)} p={ease(t, t3, t3 + 0.8)} f={C.mute} w={6} /></Mini>
    </Szene>
  );
};

// ---------- 3 Fortschreiben
const Fort = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tf = word(0, "führt");
  return (
    <Szene titel="Muster fortschreiben" tiefe={["trend", 1500, 640, 800]} anker={<Ser fc={ease(t, tf, tf + 1.6)} />}>
      <Rk y={RY + 100} t="Trend fortgeführt" ic="trend" f={C.orange} a={o(word(0, "Trend"))} />
      <Rk y={RY + 290} t="Saison fortgeführt" ic="repeat" f={C.green} a={o(word(0, "Saison"))} />
      <Rk y={RY + 480} t="Zufall: nicht vorhersagbar" size={36} ic="help" f={C.red} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 4 Grenze
const Grenze = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ta = word(0, "nie vorkam"), tb = word(1, "Je weiter");
  return (
    <Szene titel="Die Grenze" tiefe={["alert", 1500, 640, 800]} anker={<Ser fc={1} band={ease(t, tb, tb + 2)} act={ease(t, ta, ta + 2)} />}>
      <Rk y={RY + 120} t="Nie vorgekommen" sub="das Modell sieht es nicht" ic="alert" f={C.red} a={o(ta - 0.2)} />
      <Rk y={RY + 340} t="Weiter voraus" sub="größerer Fehler" ic="trend" f={C.orange} a={o(tb - 0.2)} />
      <Etikett x={760} y={760} t="Tatsächlich" f={C.red} size={38} a={o(ta + 1.2)} />
      <Etikett x={760} y={835} t="Prognose mit Bereich" f={C.blue} size={38} a={o(tb + 1)} />
    </Szene>
  );
};

// ---------- 5 Wartung (andere Kurve, gleiches Diagramm)
const VX = (i) => 150 + i * 6.4;
const VIB = (i) => 600 + Math.sin(i * 0.9) * (14 + Math.max(0, i - 60) * 1.1 + Math.max(0, i - 105) * 2.4);
const VP = Array.from({ length: 150 }, (_, i) => [VX(i), VIB(i)]);
const Wartung = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const p = ease(t, 0.4, cue(1) + 3.4), tw = word(1, "warnt");
  const warn = ease(t, tw, tw + 0.6);
  return (
    <Szene titel="Wartungsvorhersage" tiefe={["factory", 1500, 640, 800]}
      anker={<>
        <Panel x={90} y={215} w={1040} h={760} r={28} />
        <Lbl x={90} y={236} w={1040} t="Schwingung einer Maschine" size={40} align="center" color={C.mute} />
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <line x1={130} y1={910} x2={1100} y2={910} stroke={C.line} strokeWidth="5" strokeLinecap="round" />
          <text x={1100} y={950} fill={C.mute} fontSize="34" textAnchor="end" fontWeight="600">Zeit</text>
          <line x1={VX(140)} y1={330} x2={VX(140)} y2={910} stroke={C.red} strokeWidth="6" strokeDasharray="12 10" opacity={ease(t, cue(0), cue(0) + 0.8)} />
          <text x={VX(140) - 14} y={320} fill={C.red} fontSize="38" textAnchor="end" fontWeight="700" opacity={ease(t, cue(0), cue(0) + 0.8)}>Ausfall</text>
          <line x1={VX(98)} y1={330} x2={VX(98)} y2={910} stroke={C.orange} strokeWidth="5" strokeDasharray="10 10" opacity={warn} />
        </svg>
        <Bahn pts={VP.slice(0, Math.max(2, Math.round(150 * p)))} p={1} f={C.text} w={5} />
        <div style={{ position: "absolute", left: VX(98) - 55, top: 390, opacity: warn }}><Bg name="bell" size={110} color={C.orange} /></div>
      </>}>
      <Rk y={RY + 100} t="Vorboten" sub="die Schwingung wächst" ic="activity" f={C.orange} a={o(cue(0) + 0.6)} />
      <Rk y={RY + 290} t="Warnung" sub="bevor etwas bricht" ic="bell" f={C.blue} a={o(tw - 0.2)} />
      <Rk y={RY + 480} t="Wartung geplant" sub="statt Stillstand" ic="wrench" f={C.green} a={o(tw + 1.2)} />
    </Szene>
  );
};

// ---------- 6 Fehler messen
const AB = [0.5, -0.8, 0.3, -0.4, 0.9, -0.2, 0.6, -0.7];
const Fehler = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const flip = ease(t, word(0, "ohne Vorzeichen"), word(0, "ohne Vorzeichen") + 1.2);
  const tz = cue(2);
  return (
    <Szene titel="Fehler messen" tiefe={["ruler", 1500, 640, 800]}
      anker={<>
        <Ser hist={1} heute={0} label="Training und Test" />
        <Fl x={X(0)} y={330} w={X(40) - X(0)} h={570} f={C.blue} a={o(cue(1) - 0.2)} />
        <Fl x={X(40)} y={330} w={X(48) - X(40)} h={570} f={C.orange} a={o(cue(1) + 0.2)} />
        <Lbl x={X(0)} y={344} w={500} t="Training" size={40} color={C.blue} a={o(cue(1))} />
        <Lbl x={X(40) - 130} y={344} w={X(48) - X(40) + 130} t="Test" size={40} color={C.orange} align="right" a={o(cue(1) + 0.3)} />
        <Pf x1={X(40) - 10} y1={820} x2={X(48) + 60} y2={820} p={ease(t, cue(1) + 0.8, cue(1) + 1.4)} f={C.orange} w={7} />
        <div style={{ opacity: ease(t, tz, tz + 0.5) }}><Pf x1={X(48) + 40} y1={750} x2={X(10)} y2={750} p={ease(t, tz, tz + 1.2)} f={C.red} w={7} /></div>
      </>}>
      <Panel x={1180} y={RY} w={650} h={430} a={o(0.4)} />
      <Lbl x={1180} y={RY + 20} w={650} t="Abweichungen" size={42} align="center" color={C.mute} a={o(0.5)} />
      <div style={{ position: "absolute", left: 1210, top: RY + 270, width: 590, height: 4, background: C.line, opacity: o(0.5) }} />
      {AB.map((v, i) => { const h = Math.abs(v) * 170 * (v < 0 ? lerp(1, 1, flip) : 1); const up = v >= 0 || flip > 0.5; return <div key={i} style={{ position: "absolute", left: 1225 + i * 72, top: up ? RY + 272 - h : RY + 272, width: 48, height: h, borderRadius: 8, background: v < 0 && flip <= 0.5 ? C.red : C.blue, opacity: o(0.8 + i * 0.1) }} />; })}
      <Etikett x={1210} y={RY + 335} t="Mittelwert = Fehler" f={C.orange} size={42} a={o(word(0, "Mittelwert"))} />
      <Rk y={RY + 560} t="Test nur danach" ic="check" f={C.green} a={o(cue(1) + 0.6)} />
      <Rk y={RY + 720} t="Sonst: Blick in die Zukunft" size={36} ic="x" f={C.red} a={o(tz)} />
    </Szene>
  );
};

// ---------- 7 Bereich
const Band = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Ein Bereich" tiefe={["gauge", 1500, 640, 800]} anker={<Ser fc={1} band={ease(t, 0.3, 1.5)} />}>
      <Rk y={RY + 100} t="Bereich statt Zahl" ic="chart" f={C.blue} a={o(0.6)} />
      <Rk y={RY + 290} t="Puffer einplanen" sub="so groß wie der Bereich" ic="box" f={C.orange} a={o(cue(1) + 0.2)} />
      <Rk y={RY + 480} t="Daten frisch halten" ic="refresh" f={C.green} a={o(cue(2) - 0.1)} />
      <div style={{ position: "absolute", left: X(72) + 28, top: BASE(72) - hw(72), width: 10, height: hw(72) * 2, borderRadius: 5, background: C.orange, opacity: o(cue(1)) }} />
    </Szene>
  );
};

export default { wetter: Wetter, teile: Teile, fortschreiben: Fort, grenze: Grenze, wartung: Wartung, fehler: Fehler, band: Band };
