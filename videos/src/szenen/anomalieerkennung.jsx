import React from "react";
import { Szene, useCues, sp, ease, lerp, rnd, C } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Pf, Etikett, Mark, Zeile } from "../neu.jsx";
import { Bahn, Kn, Fl, Pt, Ic, Bg, Kachel, RY } from "../bausteine-betrieb.jsx";

const CX0 = 450, CY0 = 620, EX = 250, EY = 190;
const NORM = Array.from({ length: 64 }, (_, i) => { const a = rnd(i * 2.3 + 1) * Math.PI * 2, r = Math.sqrt(rnd(i * 5.1 + 2)) * 0.92; return [CX0 + Math.cos(a) * r * EX, CY0 + Math.sin(a) * r * EY]; });
const OUT = { a: [650, 360], b: [250, 860], c: [680, 840], d: [230, 380] };
const RX2 = 860;

// Anker links: Streudiagramm. ell = Größe der Normalfläche (0 aus), out = Liste [[key, einblenden 0..1, Farbe]]
const Streu = ({ ell = 0, outs = [], pulse = 0, label = "Normal und Auffälliges", extra = [], schwelle }) => (
  <>
    <Panel x={90} y={215} w={720} h={760} r={28} />
    <Lbl x={90} y={236} w={720} t={label} size={40} align="center" color={C.mute} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      {ell > 0 && <ellipse cx={CX0} cy={CY0} rx={EX * 1.08 * ell} ry={EY * 1.12 * ell} fill={C.green + "14"} stroke={C.green} strokeWidth="5" strokeDasharray="14 12" />}
      {schwelle && <ellipse cx={CX0} cy={CY0} rx={EX * schwelle} ry={EY * schwelle} fill="none" stroke={C.orange} strokeWidth="6" />}
    </svg>
    {NORM.map(([x, y], i) => <Pt key={i} x={x} y={y} r={11} f={C.blue} a={0.9} />)}
    {extra.map(([x, y, f, a], i) => <Pt key={"e" + i} x={x} y={y} r={11} f={f} a={a} />)}
    {outs.map(([k, a, f]) => <Pt key={k} x={OUT[k][0]} y={OUT[k][1]} r={17} f={f ?? C.orange} a={a} ring={pulse > 0 ? C.orange : undefined} />)}
  </>
);

// ---------- 1 Abbuchung
const ZEILEN = [["Supermarkt", false], ["Bäckerei", false], ["Tankstelle", false], ["Unbekannter Händler, Ausland", true], ["Streaming", false], ["Supermarkt", false]];
const Abbuchung = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ts = word(0, "seltsame");
  return (
    <Szene titel="Die seltsame Abbuchung" tiefe={["card", 1500, 640, 800]} anker={<Streu ell={ease(t, cue(1), cue(1) + 1.2)} outs={[["a", o(ts), C.orange]]} />}>
      <Panel x={RX2} y={RY} w={970} h={640} a={o(0.3)} />
      <Lbl x={RX2} y={RY + 20} w={970} t="Kontoauszug" size={44} align="center" color={C.mute} a={o(0.4)} />
      {ZEILEN.map(([n, b], i) => (
        <React.Fragment key={i}>
          <Zeile x={RX2 + 40} y={RY + 100 + i * 88} w={890} h={76} t={n} size={40} a={o(0.6 + i * 0.25)} rand={b && t > ts ? C.orange : C.line} color={b && t > ts ? C.orange : C.text} />
          {b && <div style={{ position: "absolute", left: RX2 + 840, top: RY + 106 + i * 88, opacity: o(ts) }}><Ic name="alert" size={64} color={C.orange} /></div>}
        </React.Fragment>
      ))}
      <Etikett x={RX2 + 140} y={RY + 690} t="Ein Modell lernt, wie normal aussieht" f={C.green} size={44} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 2 Normal lernen
const Normal = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tw = word(0, "Was davon");
  const ta = word(1, "Anomalie");
  return (
    <Szene titel="Normal lernen" tiefe={["target", 1500, 640, 800]} anker={<Streu ell={1} outs={[["a", o(tw), C.orange]]} pulse={t > tw ? 1 : 0} />}>
      <Kn x={1110} y={RY + 100} w={470} h={130} t="Lernt nur Normales" ic="database" f={C.green} size={38} a={o(0.5)} />
      <Pf x1={1360} y1={RY + 100} x2={1480} y2={RY + 100} p={ease(t, 0.9, 1.4)} f={C.mute} w={7} />
      <div style={{ position: "absolute", left: 1490, top: RY + 25, opacity: o(1.0) }}><Bg name="bot" size={150} color={C.blue} /></div>
      <Kn x={1110} y={RY + 330} w={470} h={130} t="Abweichung" ic="alert" f={C.orange} size={40} a={o(tw)} />
      <Pf x1={1360} y1={RY + 330} x2={1480} y2={RY + 330} p={ease(t, tw + 0.3, tw + 0.8)} f={C.orange} w={7} />
      <Kn x={1660} y={RY + 330} w={290} h={130} t="Meldung" ic="bell" f={C.orange} size={38} a={o(tw + 0.6)} />
      <Panel x={RX2} y={RY + 500} w={970} h={230} rand={C.orange} a={o(ta - 0.2)} />
      <div style={{ position: "absolute", left: RX2 + 40, top: RY + 565, opacity: o(ta) }}><Bg name="search" size={110} color={C.orange} /></div>
      <Lbl x={RX2 + 190} y={RY + 545} w={740} t="Anomalie: kein Urteil" size={56} a={o(ta)} color={C.orange} />
      <Lbl x={RX2 + 190} y={RY + 625} w={740} t="Ein Anlass nachzusehen" size={46} a={o(ta + 0.8)} color={C.mute} weight={600} />
    </Szene>
  );
};

// ---------- 3 Daten
const DEF = [[610, 720], [655, 640], [600, 790], [300, 560], [560, 520], [350, 690]];
const Daten = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const td = word(1, "Defekte");
  const g = ease(t, td, td + 1.4);
  return (
    <Szene titel="Gute Daten für das Normale" tiefe={["database", 1500, 640, 800]}
      anker={<Streu ell={1 + 0.2 * g} extra={DEF.map(([x, y], i) => [x, y, C.red, ease(t, td + i * 0.12, td + i * 0.12 + 0.4)])} />}>
      <Kachel x={RX2} y={RY + 20} w={460} h={330} ic="database" t="Sauber gezeigt" sub="normal ist normal" f={C.green} a={o(0.5)} ics={110} size={44} />
      <Mark x={RX2 + 360} y={RY + 40} size={80} a={o(word(0, "Was du"))} />
      <Kachel x={RX2 + 510} y={RY + 20} w={460} h={330} ic="alert" t="Defekte drin" sub="werden mitgelernt" f={C.red} a={o(td - 0.3)} ics={110} size={44} />
      <Mark x={RX2 + 870} y={RY + 40} ok={false} size={80} a={o(td + 1)} />
      <Lbl x={RX2} y={RY + 420} w={970} t="Was du als normal zeigst, wird Normal." size={54} weight={700} a={o(word(0, "hält")) } />
      <Lbl x={RX2} y={RY + 520} w={970} t="Die Fläche wächst mit den Defekten." size={46} color={C.mute} weight={600} a={o(td + 0.8)} />
    </Szene>
  );
};

// ---------- 4 Nicht Fehler lernen
const Klasse = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ts = word(0, "sieht anders"), tu = word(1, "Unbekanntes");
  const F = [["a", "Fehler A"], ["d", "Fehler B"], ["c", "Fehler C?"]];
  return (
    <Szene titel="Warum nicht Fehler lernen?" tiefe={["alert", 1500, 640, 800]}
      anker={<Streu ell={1} outs={[["a", o(cue(0) + 0.3)], ["d", o(ts)], ["c", o(tu - 0.3), C.red]]} pulse={t > tu ? 1 : 0} />}>
      <Lbl x={RX2} y={RY + 10} w={970} t="Fehlerbeispiele" size={50} weight={800} a={o(0.4)} />
      {F.map(([k, n], i) => <Kachel key={k} x={RX2 + i * 330} y={RY + 100} w={310} h={240} ic="alert" t={n} f={i === 2 ? C.red : C.orange} a={o(i === 0 ? cue(0) + 0.3 : i === 1 ? ts : tu - 0.3)} ics={84} size={40} />)}
      <Etikett x={RX2} y={RY + 390} t="selten, und jeder sieht anders aus" f={C.mute} size={42} a={o(cue(0) + 1.6)} />
      <Panel x={RX2} y={RY + 500} w={970} h={230} rand={C.green} a={o(cue(1) - 0.1)} />
      <div style={{ position: "absolute", left: RX2 + 40, top: RY + 560, opacity: o(cue(1)) }}><Bg name="bot" size={110} color={C.green} /></div>
      <Lbl x={RX2 + 190} y={RY + 540} w={740} t="Das Modell fürs Normale" size={52} color={C.green} a={o(cue(1))} />
      <Lbl x={RX2 + 190} y={RY + 620} w={740} t="meldet alles, was draußen liegt" size={44} color={C.text} weight={600} a={o(tu)} />
    </Szene>
  );
};

// ---------- 5 Schwellenwert
const Schwelle = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const sw = 0.95 + 0.4 * (0.5 + 0.5 * Math.sin((t - 0.5) * 1.3));
  const k = (sw - 0.95) / 0.4;
  const t1 = word(1, "findet"), t2 = word(2, "falsch");
  const cell = (x, y, f, big, small, a) => (
    <div style={{ position: "absolute", left: x, top: y, width: 460, height: 200, borderRadius: 24, background: f + "22", border: `4px solid ${f}`, boxSizing: "border-box", opacity: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1.1 }}>
      <div style={{ fontSize: 76, fontWeight: 800, color: f }}>{big}</div><div style={{ fontSize: 40, fontWeight: 600 }}>{small}</div>
    </div>
  );
  return (
    <Szene titel="Schwellenwert und Fehlalarme" tiefe={["gauge", 1500, 640, 800]} anker={<Streu ell={1} schwelle={sw} label="Schwellenwert" />}>
      <div style={{ position: "absolute", left: RX2 + 40, top: RY + 60, width: 890, height: 14, borderRadius: 7, background: C.line, opacity: o(0.5) }} />
      <div style={{ position: "absolute", left: RX2 + 40 + 890 * k - 26, top: RY + 34, width: 52, height: 66, borderRadius: 14, background: C.orange, opacity: o(0.5) }} />
      <Lbl x={RX2 + 40} y={RY + 100} w={400} t="mehr Fehlalarme" size={38} color={C.mute} a={o(0.7)} />
      <Lbl x={RX2 + 530} y={RY + 100} w={400} t="mehr übersehen" size={38} color={C.mute} align="right" a={o(0.7)} />
      <Lbl x={RX2} y={RY + 170} w={970} t="10 000 Buchungen, davon 10 auffällig" size={46} weight={700} a={o(cue(1) - 0.3)} align="center" />
      {cell(RX2, RY + 250, C.green, "9", "gefunden", o(t1))}
      {cell(RX2 + 510, RY + 250, C.red, "1", "übersehen", o(t1 + 0.4))}
      {cell(RX2, RY + 470, C.orange, "rund 100", "Fehlalarme", o(word(1, "rund") ))}
      {cell(RX2 + 510, RY + 470, C.mute, "9 890", "ruhig", o(word(1, "rund") + 0.4))}
      <Etikett x={RX2 + 70} y={RY + 700} t="rund 109 Meldungen, nur 9 echt" f={C.orange} size={50} a={o(t2 - 0.3)} />
    </Szene>
  );
};

// ---------- 6 Mensch
const Mensch = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const te = word(1, "verbessert");
  const T = [["factory", "Fertigung"], ["card", "Zahlungen"], ["server", "IT-Betrieb"], ["eye", "Qualität"]];
  return (
    <Szene titel="Der Mensch prüft" tiefe={["userCheck", 1500, 640, 800]} anker={<Streu ell={1} outs={[["a", 1]]} pulse={1} />}>
      <Kn x={1010} y={RY + 100} w={300} h={130} t="Verdacht" ic="alert" f={C.orange} size={36} a={o(0.5)} />
      <Pf x1={1170} y1={RY + 100} x2={1230} y2={RY + 100} p={ease(t, cue(1) - 0.2, cue(1) + 0.3)} f={C.mute} w={7} />
      <Kn x={1350} y={RY + 100} w={230} h={130} t="Mensch" ic="userCheck" f={C.blue} size={36} a={o(cue(1) - 0.3)} />
      <Pf x1={1470} y1={RY + 100} x2={1560} y2={RY + 100} p={ease(t, te - 0.2, te + 0.3)} f={C.mute} w={7} />
      <Kn x={1690} y={RY + 100} w={250} h={130} t="Schwelle" ic="gauge" f={C.green} size={36} a={o(te - 0.3)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <path d={`M1690 ${RY + 170} L1690 ${RY + 250} L1010 ${RY + 250} L1010 ${RY + 175}`} fill="none" stroke={C.orange} strokeWidth="6" strokeDasharray="14 12" strokeLinecap="round" opacity={ease(t, te + 0.2, te + 0.8)} />
      </svg>
      <Lbl x={960} y={RY + 270} w={800} t="Seine Entscheidung verbessert die Schwelle" size={36} color={C.orange} align="center" a={o(te + 0.6)} />
      <Lbl x={RX2} y={RY + 400} w={970} t="Überall, wo Seltenes im Normalen steckt" size={46} weight={700} a={o(cue(2))} />
      {T.map(([ic, n], i) => <Kachel key={n} x={RX2 + i * 245} y={RY + 490} w={225} h={250} ic={ic} t={n} f={C.blue} a={o(cue(2) + 0.6 + i * 0.3)} ics={80} size={34} />)}
    </Szene>
  );
};

export default { abbuchung: Abbuchung, normal: Normal, daten: Daten, klasse: Klasse, schwelle: Schwelle, mensch: Mensch };
