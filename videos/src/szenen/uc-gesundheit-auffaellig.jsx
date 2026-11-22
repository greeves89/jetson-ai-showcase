import React from "react";
import { Szene, useCues, sp, ease, lerp, C } from "../lib.jsx";
import { Panel, Lbl } from "../bausteine.jsx";
import { Pf, Etikett } from "../neu.jsx";
import { Kn, Kachel, Bg, Ic } from "../bausteine-betrieb.jsx";
import { Pic, Ring, Hinweis } from "../bausteine-uc.jsx";

const P = "gesundheit-auffaellig/";
const A = (i) => `${P}auffaellig/${String(i).padStart(2, "0")}.jpg`;
const U = (i) => `${P}unauffaellig/${String(i).padStart(2, "0")}.jpg`;
const H = () => <Hinweis t="Gezeichnete Bilder, kein Medizinprodukt" w={760} />;

// ---------- 1 Vorab: der Hinweis, groß
const Vorab = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Vorab" tiefe={["alert", 1500, 640, 800]}>
      <Pic k={A(1)} x={110} y={250} w={800} h={600} a={o(0.3)} rand={C.orange} bw={5} />
      <div style={{ position: "absolute", left: 110, top: 700, width: 800, height: 150, background: "#000000dd", borderTop: `6px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 44, fontWeight: 800, color: C.orange, lineHeight: 1.15, padding: "0 30px", boxSizing: "border-box", opacity: o(0.6) }}>Synthetische Bilder, keine medizinischen Daten</div>
      <Kn x={1380} y={330} w={850} h={130} t="keine medizinischen Daten" ic="ban" f={C.orange} size={48} a={o(word(0, "keine medizinischen") - 0.2)} />
      <Kn x={1380} y={500} w={850} h={130} t="kein Medizinprodukt" ic="shield" f={C.orange} size={48} a={o(word(0, "kein Medizinprodukt") - 0.2)} />
      <Kn x={1380} y={670} w={850} h={130} t="zeigt nur ein Prinzip" ic="bulb" f={C.blue} size={48} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 2 Viele Proben, eine fällt auf
const GR = Array.from({ length: 24 }).map((_, i) => (i === 13 ? [A(5), false] : [U((i > 13 ? i - 1 : i) % 20 + 1), i >= 20]));
const Proben = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tf = word(1, "Auffällige") - 0.3;
  const f = ease(t, tf, tf + 0.7);
  return (
    <Szene titel="Viele Proben" tiefe={["layers", 1500, 640, 800]}>
      <H />
      {GR.map(([k, fl], i) => {
        const x = 130 + (i % 8) * 210, y = 260 + Math.floor(i / 8) * 165, odd = i === 13;
        return <Pic key={i} k={k} x={x} y={y} w={190} h={143} r={12} bw={odd && f > 0 ? 5 : 2} flip={fl} rand={odd && f > 0 ? C.orange : C.line} a={sp(t, 0.3 + i * 0.1, 0.5) * (odd ? 1 : lerp(1, 0.35, f))} s={odd ? lerp(1, 1.18, f) : 1} glow={odd && f > 0 ? C.orange : undefined} style={{ zIndex: odd ? 5 : 1 }} />;
      })}
      <Kn x={960} y={880} w={1200} h={110} t="Aufmerksamkeit ist begrenzt" ic="eye" f={C.orange} size={52} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 3 Nach vorn legen: Reihenfolge ändert sich
const REIHE = [[U(3), 0], [U(8), 0], [A(2), 1], [U(11), 0], [A(7), 1], [U(15), 0]];
const Vorsort = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ts = word(0, "nach vorn");
  const u = ease(t, ts, ts + 1.4);
  const nach = [2, 3, 0, 1, 4, 5]; // alte Position -> neue Position
  const neu = [2, 4, 0, 1, 3, 5].map((_, i) => i);
  const ziel = (i) => ({ 0: 2, 1: 3, 2: 0, 3: 4, 4: 1, 5: 5 }[i]);
  return (
    <Szene titel="Nach vorn legen" tiefe={["list", 1500, 640, 800]}>
      <H />
      {REIHE.map(([k, a], i) => {
        const pos = lerp(i, ziel(i), u);
        const on = a && u > 0.7;
        return (
          <React.Fragment key={i}>
            <Pic k={k} x={130 + pos * 290} y={260} w={250} h={188} a={o(0.2 + i * 0.1)} rand={on ? C.orange : C.line} bw={on ? 6 : 3} glow={on ? C.orange : undefined} />
            {on && <div style={{ position: "absolute", left: 130 + pos * 290 + 170, top: 275, width: 60, height: 60, borderRadius: 30, background: C.orange, color: "#000", fontSize: 44, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", opacity: ease(t, ts + 1.0, ts + 1.4) }}>!</div>}
          </React.Fragment>
        );
      })}
      <Kn x={1400} y={705} w={700} h={110} t="keine Diagnose" ic="ban" f={C.mute} size={50} a={o(word(0, "Diagnose") - 0.3)} />
      <Pf x1={270} y1={460} x2={270} y2={530} p={ease(t, cue(1), cue(1) + 0.5)} f={C.orange} w={7} />
      <Pf x1={560} y1={460} x2={560} y2={530} p={ease(t, cue(1) + 0.2, cue(1) + 0.7)} f={C.orange} w={7} />
      <Kachel x={130} y={540} w={830} h={330} ic="userCheck" t="Ein Mensch prüft jeden gemeldeten Fall" f={C.green} a={o(cue(1))} ics={110} size={52} />
    </Szene>
  );
};

// ---------- 4 Zwei Ringe
const ZahlenG = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t1 = word(0, "alle 12"), t2 = word(0, "59 von 60");
  return (
    <Szene titel="Was herauskam" tiefe={["target", 1500, 640, 800]}>
      <H />
      <Ring cx={520} cy={560} r={200} w={36} p={ease(t, t1, t1 + 1.6)} f={C.green} t="12 von 12" tsize={74} sub="Testbilder" a={o(t1 - 0.3)} />
      <Ring cx={1400} cy={560} r={200} w={36} p={ease(t, t2, t2 + 1.8) * (59 / 60)} f={C.green} t="98 %" tsize={96} sub="59 von 60 weitere" a={o(t2 - 0.3)} />
      <Kn x={960} y={930} w={1300} h={100} t="gezeichnet: deutlicher Unterschied, echte Proben sind schwerer" ic="edit" f={C.mute} size={36} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 5 Die Waage
const Waage = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tw = word(0, "übersehene") - 0.2;
  const ang = -9 * ease(t, tw, tw + 1.4) * Math.PI / 180;
  const cx = 960, cy = 400, L = 520;
  const lx = cx - L * Math.cos(ang), ly = cy - L * Math.sin(ang), rx = cx + L * Math.cos(ang), ry = cy + L * Math.sin(ang);
  return (
    <Szene titel="Zwei Fehlerarten" tiefe={["scale", 1500, 640, 800]}>
      <H />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o(0.3) }}>
        <path d={`M${cx} ${cy} L${cx} 800`} stroke={C.mute} strokeWidth="14" strokeLinecap="round" />
        <path d={`M${cx - 160} 810 H${cx + 160}`} stroke={C.mute} strokeWidth="18" strokeLinecap="round" />
        <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C.text} strokeWidth="16" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="20" fill={C.text} />
        {[[lx, ly], [rx, ry]].map(([x, y], i) => <path key={i} d={`M${x} ${y} L${x - 150} ${y + 190} M${x} ${y} L${x + 150} ${y + 190}`} stroke={C.mute} strokeWidth="5" />)}
      </svg>
      <div style={{ position: "absolute", left: lx - 200, top: ly + 190, width: 400, height: 150, borderRadius: 24, background: C.red + "33", border: `5px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontSize: 44, fontWeight: 800, color: C.red, opacity: o(0.5) }}><Ic name="alert" size={60} color={C.red} />übersehen</div>
      <div style={{ position: "absolute", left: rx - 200, top: ry + 190, width: 400, height: 150, borderRadius: 24, background: C.orange + "22", border: `5px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontSize: 36, fontWeight: 800, color: C.orange, textAlign: "center", lineHeight: 1.1, opacity: o(word(0, "unnötig") - 0.3) }}><Ic name="bell" size={56} color={C.orange} />unnötig gemeldet</div>
      <Kn x={960} y={920} w={1300} h={100} t="beide getrennt zählen, Schwelle bewusst einstellen" ic="sliders" f={C.blue} size={42} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 6 Wer verantwortet
const Haftung = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Wer verantwortet" tiefe={["userCheck", 1500, 640, 800]}>
      <H />
      <Kachel x={130} y={260} w={520} h={380} ic="userCheck" t="Wer prüft?" sub="ein Mensch, jeder Fall" f={C.blue} a={o(word(0, "prüft") - 0.3)} ics={120} size={56} />
      <Kachel x={700} y={260} w={520} h={380} ic="scale" t="Wer haftet?" sub="vorher geklärt" f={C.orange} a={o(word(0, "haftet") - 0.3)} ics={120} size={56} />
      <Kachel x={1270} y={260} w={520} h={380} ic="lock" t="Datenschutz" sub="mit geklärt" f={C.green} a={o(word(0, "Datenschutz") - 0.3)} ics={120} size={56} />
      <Kn x={700} y={830} w={1000} h={120} t="keine Rechtsberatung" ic="info" f={C.mute} size={48} a={o(cue(1))} />
      <Kn x={1530} y={830} w={600} h={120} t="Hinweis bleibt sichtbar" ic="eye" f={C.orange} size={40} a={o(word(1, "Hinweis"))} />
    </Szene>
  );
};

export default { hinweis: Vorab, proben: Proben, vorsortieren: Vorsort, zahlen: ZahlenG, waage: Waage, haftung: Haftung };
