import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Chip, Lin, Karte } from "../bausteine.jsx";

const FELD = [["Baujahr", "2016", C.blue], ["Kilometer", "84 000", C.blue], ["Zustand", "gut", C.blue], ["Preis", "?", C.orange]];
const Inserat = () => {
  const { t, cue, word } = useCues();
  return (
    <Szene titel="Inserat" tiefe={["file", 1380, 650, 900]}>
      <Panel x={110} y={280} w={720} h={700} r={30} a={sp(t, 0.3, 0.7)}>
        <svg style={{ position: "absolute", left: 60, top: 70 }} width="600" height="300" viewBox="0 0 600 300"><path d="M30 220 L70 130 Q110 90 220 90 L400 90 Q480 100 520 150 L570 220 Z" fill="#48484a" /><circle cx="170" cy="230" r="46" fill="#1c1c1e" stroke="#98989d" strokeWidth="12" /><circle cx="440" cy="230" r="46" fill="#1c1c1e" stroke="#98989d" strokeWidth="12" /></svg>
        <Skel x={60} y={430} w={600} n={5} gap={50} h={20} />
      </Panel>
      {FELD.map(([n, v, f], i) => {
        const at = i < 3 ? word(1, ["Baujahr", "Kilometer", "Zustand"][i]) : word(1, "Preis");
        return (
          <Rv key={n} at={at} dx={40} dy={0} style={{ position: "absolute", left: 900, top: 290 + i * 170 }}>
            <div style={{ width: 910, height: 140, borderRadius: 30, background: f + "22", border: `5px solid ${f}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px", boxSizing: "border-box" }}>
              <div style={{ fontSize: 56, fontWeight: 700, color: f }}>{n}</div>
              <div style={{ fontSize: 80, fontWeight: 800 }}>{v}</div>
            </div>
          </Rv>
        );
      })}
      <Lbl x={1560} y={965} w={250} t="Etikett" size={44} color={C.orange} align="right" a={sp(t, word(1, "Etikett"), 0.6)} />
      <Lbl x={900} y={965} w={400} t="Merkmale" size={44} color={C.blue} a={sp(t, word(1, "Merkmale"), 0.6)} />
    </Szene>
  );
};

const Zahlenwelt = () => {
  const { t, cue } = useCues();
  const Q = [["grid", "Tabelle"], ["image", "Foto"], ["message", "Text"], ["zap", "Ton"]];
  const num = ease(t, cue(0) + 2.4, cue(0) + 3.6);
  return (
    <Szene titel="Alles Zahlen" tiefe={["database", 1380, 650, 900]}>
      {Q.map(([ic, n], i) => (
        <React.Fragment key={n}>
          <Rv at={0.3 + i * 0.4} dy={20} style={{ position: "absolute", left: 130 + i * 430, top: 300 }}><Badge name={ic} size={240} /></Rv>
          <Lbl x={110 + i * 430} y={560} w={280} t={n} size={56} align="center" a={sp(t, 0.5 + i * 0.4, 0.6)} />
          <Zahlen x={130 + i * 430} y={680} w={240} h={230} n={8} seed={i * 3 + 1} farbe={[C.blue, C.green, C.orange, "#bf5af2"][i]} a={num * sp(t, 0.5, 0.5)} />
        </React.Fragment>
      ))}
    </Szene>
  );
};

const Fehler = () => {
  const { t, cue } = useCues();
  const R = Array.from({ length: 8 });
  const mark = { 2: ["Fehler", C.red], 4: ["Lücke", C.orange], 6: ["Dublette", "#bf5af2"] };
  return (
    <Szene titel="Fehler" tiefe={["alert", 1380, 650, 900]}>
      <Panel x={110} y={280} w={1700} h={700} r={28}>
        {R.map((_, i) => {
          const m = mark[i], at = cue(0) + 0.3 + i * 0.3, hit = m && t > cue(1) + 0.3 + (i - 2) * 0.35;
          const dupl = i === 7;
          return (
            <div key={i} style={{ position: "absolute", left: 30, top: 24 + i * 83, width: 1640, height: 66, borderRadius: 14, background: hit ? m[1] + "33" : "transparent", border: hit ? `4px solid ${m[1]}` : "4px solid transparent", opacity: sp(t, at, 0.4), boxSizing: "border-box" }}>
              <Skel x={20} y={22} w={300} n={1} h={22} seed={i + 1} />
              <Skel x={480} y={22} w={i === 4 ? 0 : 260} n={1} h={22} seed={i + 4} />
              <Skel x={880} y={22} w={300} n={1} h={22} seed={i === 7 ? 1 : i + 8} />
              {hit && <div style={{ position: "absolute", right: 24, top: 6, fontSize: 44, fontWeight: 800, color: m[1] }}>{m[0]}</div>}
              {i === 6 && t < cue(1) + 99 && <Skel x={20} y={22} w={300} n={1} h={22} seed={7} />}
            </div>
          );
        })}
      </Panel>
    </Szene>
  );
};

const Vielfalt = () => {
  const { t, cue } = useCues();
  const A = Array.from({ length: 60 }).map((_, i) => [260 + (rnd(i) - 0.5) * 130, 640 + (rnd(i + 9) - 0.5) * 130]);
  const B = Array.from({ length: 10 }).map((_, i) => [1030 + rnd(i + 20) * 700, 340 + rnd(i + 30) * 560]);
  const F = [C.blue, C.green, C.orange, "#bf5af2", "#ffd60a", "#64d2ff", C.red, "#30d158", "#ff9f0a", "#0a84ff"];
  return (
    <Szene titel="Vielfalt" tiefe={["grid", 1380, 650, 900]}>
      <Karte x={110} y={280} w={820} h={700} a={sp(t, 0.2, 0.6)} /><Karte x={990} y={280} w={820} h={700} a={sp(t, 0.2, 0.6)} />
      {A.map(([x, y], i) => <Dot key={i} x={x + 120} y={y} r={13} f={C.mute} a={sp(t, 0.3 + i * 0.01, 0.4)} />)}
      {B.map(([x, y], i) => <Dot key={i} x={x} y={y} r={26} f={F[i]} a={sp(t, cue(1) + 0.3 + i * 0.2, 0.5)} />)}
      <Lbl x={110} y={990 - 70} w={820} t="Tausend gleiche" size={50} color={C.mute} align="center" a={sp(t, cue(0) + 1.5, 0.6)} />
      <Lbl x={990} y={990 - 70} w={820} t="Zehn verschiedene" size={50} color={C.green} align="center" a={sp(t, cue(1) + 0.4, 0.6)} />
    </Szene>
  );
};

const Toepfe = () => {
  const { t, cue, word } = useCues();
  const s1 = ease(t, cue(0) + 0.6, cue(0) + 1.8);
  const P = [["Üben", 0.6, C.blue, "book"], ["Probe", 0.2, C.orange, "edit"], ["Klausur", 0.2, C.green, "target"]];
  let x = 110;
  const bar = P.map(([n, f, c, ic], i) => { const w = lerp(1700, 1700 * f - 14, s1), px = lerp(110, 110 + P.slice(0, i).reduce((a, p) => a + 1700 * p[1], 0), s1); return [n, w, px, c, ic]; });
  return (
    <Szene titel="Drei Töpfe" tiefe={["database", 1380, 650, 900]}>
      {bar.map(([n, w, px, c, ic], i) => <div key={n} style={{ position: "absolute", left: px, top: 300, width: i === 0 && s1 < 0.01 ? 1700 : w, height: 200, borderRadius: 30, background: s1 < 0.01 ? C.blue + "33" : c + "33", border: `5px solid ${s1 < 0.01 ? C.blue : c}`, boxSizing: "border-box", opacity: sp(t, 0.2, 0.6) }} />)}
      {P.map(([n, f, c, ic], i) => {
        const cx = [110 + 1700 * 0.3, 110 + 1700 * 0.7, 110 + 1700 * 0.9][i];
        return (
          <React.Fragment key={n}>
            <Lbl x={cx - 170} y={560} w={340} t={n} size={60} color={c} align="center" a={s1} />
            <div style={{ position: "absolute", left: cx - 100, top: 640, opacity: s1 }}><Badge name={ic} size={200} color={c} /></div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 1530, top: 880, opacity: sp(t, cue(1) + 1.4, 0.6) }}><Icon name="lock" size={100} color={C.green} /></div>
      <Lbl x={1100} y={900} w={400} t="Bleibt zu" size={52} color={C.green} align="right" a={sp(t, cue(1) + 1.4, 0.6)} />
    </Szene>
  );
};

const Pflege = () => {
  const { t, cue, dur } = useCues();
  const alt = ease(t, cue(1) + 0.2, cue(1) + 2.2);
  return (
    <Szene titel="Pflege" tiefe={["calendar", 1380, 650, 900]}>
      <div style={{ position: "absolute", left: 110, top: 290, opacity: sp(t, 0.3, 0.8) }}><Icon name="lock" size={430} color={C.orange} sw={1.2} /></div>
      <Lbl x={110} y={760} w={520} t="Zweck, Sparsamkeit" size={52} color={C.orange} a={sp(t, cue(0) + 0.5, 0.6)} />
      <Panel x={760} y={290} w={1050} h={680} r={28} a={sp(t, cue(1) + 0.1, 0.7)} rand={alt > 0.5 ? C.red : C.line}>
        <div style={{ position: "absolute", left: 40, top: 30, display: "flex", gap: 20, alignItems: "center", fontSize: 60, fontWeight: 800 }}><Icon name="calendar" size={80} color={C.blue} />Daten</div>
        {Array.from({ length: 6 }).map((_, i) => <Skel key={i} x={40} y={170 + i * 78} w={970 * (1 - alt * (i % 3) * 0.3)} n={1} h={26} seed={i + 1} farbe={alt > 0.3 && i % 2 ? "#6b3a37" : "#48484a"} />)}
        <div style={{ position: "absolute", left: 600, top: 40, width: 380, height: 40, borderRadius: 20, background: C.panel2 }}><div style={{ width: 380 * (1 - alt * 0.7), height: 40, borderRadius: 20, background: alt > 0.5 ? C.red : C.green }} /></div>
        <Lbl x={40} y={620} w={600} t="Modell wird schlechter" size={46} color={C.red} a={alt} />
      </Panel>
      <div style={{ position: "absolute", left: 1620, top: 790, opacity: ease(t, cue(1) + 2.2, cue(1) + 3.0) }}><Icon name="repeat" size={150} color={C.green} /></div>
    </Szene>
  );
};

export default { inserat: Inserat, zahlen: Zahlenwelt, fehler: Fehler, vielfalt: Vielfalt, toepfe: Toepfe, pflege: Pflege };
