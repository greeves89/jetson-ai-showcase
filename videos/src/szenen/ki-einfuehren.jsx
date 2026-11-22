import React from "react";
import { Szene, useCues, sp, ease, lerp, rnd, C } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Pf, Etikett, Mark, Zeile } from "../neu.jsx";
import { Kn, Fl, Pt, Ic, Bg, Kachel, RX, RW, RY } from "../bausteine-betrieb.jsx";

const ST = [["help", "Problem"], ["target", "Auswahl"], ["rocket", "Pilot"], ["fork", "Entscheidung"], ["factory", "Betrieb"]];
const SY = (i) => 330 + i * 145;
// Anker links: der Weg vom Problem zum Betrieb. pos = Stelle (0..4, auch Bruchteile), alle = alle Stationen gleich stark
const Weg = ({ pos = 0, alle = 0, f = C.blue }) => (
  <>
    <Panel x={90} y={215} w={560} h={760} r={28} />
    <Lbl x={90} y={236} w={560} t="Der Weg" size={40} align="center" color={C.mute} />
    <div style={{ position: "absolute", left: 197, top: SY(0), width: 6, height: SY(4) - SY(0), background: C.line, borderRadius: 3 }} />
    <div style={{ position: "absolute", left: 197, top: SY(0), width: 6, height: (SY(4) - SY(0)) * Math.min(1, pos / 4), background: f, borderRadius: 3 }} />
    {ST.map(([ic, n], i) => { const on = alle ? true : Math.abs(pos - i) < 0.5, done = i < pos - 0.5 || (alle && true); const col = on ? f : done ? C.green : C.text; return (
      <React.Fragment key={n}>
        <div style={{ position: "absolute", left: 200 - 46, top: SY(i) - 46, width: 92, height: 92, borderRadius: 46, background: on ? f + "33" : C.panel2, border: `${on ? 6 : 3}px solid ${on ? f : done ? C.green : C.line}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: on ? `0 0 36px ${f}88` : "none" }}><Ic name={done && !on ? "check" : ic} size={48} color={col} sw={done && !on ? 2.8 : 1.8} /></div>
        <Lbl x={270} y={SY(i) - 24} w={360} t={n} size={on ? 46 : 40} weight={on ? 800 : 600} color={on ? f : C.text} />
      </React.Fragment>
    ); })}
  </>
);

// ---------- 1 Problem
const Problem = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Erst das Problem" tiefe={["help", 1500, 640, 800]} anker={<Weg pos={0} />}>
      <Kn x={RX + 220} y={RY + 100} w={400} h={140} t="Problem" ic="help" f={C.blue} size={54} a={o(0.5)} />
      <Pf x1={RX + 430} y1={RY + 100} x2={RX + 590} y2={RY + 100} p={ease(t, 1.2, 1.7)} f={C.mute} w={7} />
      <Kn x={RX + 800} y={RY + 100} w={400} h={140} t="Technik" ic="cpu" f={C.mute} size={54} a={o(1.4)} />
      <Kn x={RX + 280} y={RY + 330} w={520} h={140} t="Erfolg messbar" ic="target" f={C.green} size={52} a={o(cue(1) + 0.6)} />
      <Zeile x={RX} y={RY + 500} w={RW} h={130} t="wenn A, dann B" size={62} mono rand={C.orange} a={o(word(2, "Regel") - 0.4)} color={C.orange} />
      <Etikett x={RX + 280} y={RY + 670} t="manchmal reicht eine Regel" f={C.orange} size={50} a={o(cue(2))} />
    </Szene>
  );
};

// ---------- 2 Auswahl
const PUNKT = [[0.18, 0.2], [0.3, 0.55], [0.75, 0.3], [0.85, 0.82], [0.62, 0.9], [0.4, 0.3]];
const Auswahl = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const K = ["Nutzen", "Machbarkeit", "Daten", "Risiko"];
  const tk = word(1, "Starte");
  return (
    <Szene titel="Den Einsatz auswählen" tiefe={["target", 1500, 640, 800]} anker={<Weg pos={1} />}>
      {K.map((k, i) => <Chip key={k} x={RX + [0, 210, 540, 720][i]} y={RY + 10} t={k} f={[C.blue, C.green, C.orange, C.red][i]} size={40} a={o(word(0, k) - 0.2)} />)}
      <Panel x={RX} y={RY + 110} w={760} h={620} a={o(0.6)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <line x1={RX + 70} y1={RY + 690} x2={RX + 730} y2={RY + 690} stroke={C.mute} strokeWidth="5" strokeLinecap="round" opacity={o(0.8)} />
        <line x1={RX + 70} y1={RY + 690} x2={RX + 70} y2={RY + 160} stroke={C.mute} strokeWidth="5" strokeLinecap="round" opacity={o(0.8)} />
      </svg>
      <Lbl x={RX + 80} y={RY + 700} w={650} t="Machbarkeit" size={38} color={C.mute} align="right" a={o(0.9)} />
      <div style={{ position: "absolute", left: RX + 90, top: RY + 140, fontSize: 38, color: C.mute, fontWeight: 700, opacity: o(0.9) }}>Nutzen</div>
      <Fl x={RX + 400} y={RY + 190} w={310} h={270} f={C.green} a={o(tk)} r={22} />
      <Lbl x={RX + 400} y={RY + 400} w={310} t="Hier starten" size={38} color={C.green} align="center" a={o(tk + 0.3)} />
      {PUNKT.map(([x, y], i) => <div key={i} style={{ position: "absolute", left: RX + 90 + x * 600 - 22, top: RY + 650 - y * 480 - 22, width: 44, height: 44, borderRadius: 22, background: x > 0.55 && y > 0.5 ? C.green : C.mute, opacity: o(1.0 + i * 0.15) }} />)}
      <Kn x={RX + 960} y={RY + 330} w={340} h={150} t="leichter Karton" ic="box" f={C.green} size={40} a={o(word(1, "leichte") - 0.2)} />
    </Szene>
  );
};

// ---------- 3 Pilot
const Pilot = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ts = cue(2);
  return (
    <Szene titel="Der Pilot als Probefahrt" tiefe={["truck", 1500, 640, 800]} anker={<Weg pos={2} />}>
      <Kn x={RX + 270} y={RY + 100} w={540} h={140} t="Probefahrt" ic="truck" f={C.blue} size={54} a={o(0.5)} />
      <Kn x={RX + 880} y={RY + 100} w={500} h={140} t="Maßstab vorher fest" ic="ruler" f={C.orange} size={40} a={o(cue(1))} />
      <Panel x={RX} y={RY + 240} w={RW} h={470} rand={C.green} a={o(ts - 0.2)} />
      <Lbl x={RX} y={RY + 260} w={RW} t="Schattenbetrieb" size={54} weight={800} align="center" color={C.green} a={o(ts)} />
      <div style={{ position: "absolute", left: RX + 150, top: RY + 350, opacity: o(word(2, "KI") - 0.2) }}><Bg name="bot" size={170} color={C.blue} /></div>
      <Lbl x={RX + 90} y={RY + 530} w={290} t="KI läuft mit" size={38} align="center" a={o(word(2, "KI"))} />
      <div style={{ position: "absolute", left: RX + 800, top: RY + 350, opacity: o(word(2, "Menschen") - 0.2) }}><Bg name="user" size={170} color={C.orange} /></div>
      <Lbl x={RX + 640} y={RY + 530} w={450} t="Mensch entscheidet" size={38} align="center" a={o(word(2, "Menschen"))} />
      <Kn x={RX + 565} y={RY + 430} w={290} h={100} t="vergleichen" ic="target" f={C.mute} size={36} a={o(ts + 4.0)} />
      <Lbl x={RX} y={RY + 620} w={RW} t="ohne Folgen eines Fehlers" size={42} color={C.mute} weight={600} align="center" a={o(ts + 4.6)} />
    </Szene>
  );
};

// ---------- 4 Menschen
const Menschen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const G = [["Fachbereich", "users", RX + 190, RY + 130], ["IT", "server", RX + 940, RY + 130], ["Datenschutz", "lock", RX + 190, RY + 530], ["Betriebsrat", "shield", RX + 940, RY + 530]];
  const tf = word(2, "meldet");
  return (
    <Szene titel="Menschen mitnehmen" tiefe={["users", 1500, 640, 800]} anker={<Weg pos={2.3} />}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {G.map(([n, ic, x, y], i) => <line key={n} x1={RX + 565} y1={RY + 330} x2={lerp(RX + 565, x, ease(t, word(1, n === "IT" ? "IT," : n) - 0.3, word(1, n === "IT" ? "IT," : n) + 0.3))} y2={lerp(RY + 330, y, ease(t, word(1, n === "IT" ? "IT," : n) - 0.3, word(1, n === "IT" ? "IT," : n) + 0.3))} stroke={C.line} strokeWidth="6" strokeLinecap="round" />)}
      </svg>
      <div style={{ position: "absolute", left: RX + 565 - 90, top: RY + 330 - 90, opacity: o(cue(0) + 0.3) }}><Bg name="target" size={180} color={C.orange} /></div>
      <Lbl x={RX + 465} y={RY + 430} w={200} t="Problem" size={36} color={C.mute} align="center" a={o(cue(1))} />
      {G.map(([n, ic, x, y]) => <Kn key={n} x={x} y={y} w={380} h={130} t={n} ic={ic} f={C.blue} size={42} a={o(word(1, n === "IT" ? "IT," : n) - 0.2)} />)}
      <Etikett x={RX + 110} y={RY + 700} t="Wer die Grenzen kennt, meldet Fehler zurück" f={C.green} size={38} a={o(tf - 0.4)} />
    </Szene>
  );
};

// ---------- 5 Entscheidung
const Entscheid = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const E = [["x", "stoppen", C.red, word(0, "stoppen")], ["edit", "ändern", C.orange, word(0, "ändern")], ["rocket", "ausrollen", C.green, word(0, "ausrollen")]];
  return (
    <Szene titel="Stoppen, ändern, ausrollen" tiefe={["fork", 1500, 640, 800]} anker={<Weg pos={3} />}>
      <Lbl x={RX} y={RY + 10} w={RW} t="Jeder Pilot endet mit einer Entscheidung" size={46} weight={700} a={o(0.4)} />
      {E.map(([ic, n, f, ts], i) => <Kachel key={n} x={RX + i * 385} y={RY + 110} w={360} h={400} ic={ic} t={n} f={f} a={o(ts - 0.3)} ics={130} size={54} />)}
      <Kn x={RX + 565} y={RY + 650} w={1130} h={140} t="Kriterien stehen vorher fest" ic="flag" f={C.blue} size={52} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 6 Fehler
const FE = [["cpu", "Technik zuerst", "Technik zuerst"], ["ruler", "Kein Maßstab", "kein Maßstab"], ["database", "Daten unterschätzt", "Daten unterschätzt"], ["users", "Menschen vergessen", "Menschen vergessen"], ["rocket", "Pilot ohne Betrieb", "Pilot ohne"], ["layers", "Zu groß gestartet", "zu groß"]];
const Fehler = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Typische Fehler" tiefe={["alert", 1500, 640, 800]} anker={<Weg pos={2} f={C.red} />}>
      {FE.map(([ic, n, w], i) => <Kachel key={n} x={RX + (i % 3) * 385} y={RY + 30 + Math.floor(i / 3) * 360} w={360} h={330} ic={ic} t={n} f={C.red} a={o(word(0, w) - 0.2)} ics={110} size={42} />)}
      <Etikett x={RX + 310} y={RY + 740} t="wiederholen sich in fast jedem Projekt" f={C.mute} size={38} a={o(cue(0) + 12)} />
    </Szene>
  );
};

// ---------- 7 Checkliste
const CL = ["Problem in einem Satz", "Ziel mit Ausgangswert", "Daten und Rechtsgrundlage", "Verantwortung benannt", "Betroffene informiert", "Rückfall und Stopp-Kriterium"];
const Check = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tn = word(1, "Nein");
  return (
    <Szene titel="Die Checkliste" tiefe={["clip", 1500, 640, 800]} anker={<Weg pos={0} alle={1} f={C.green} />}>
      {CL.map((n, i) => (
        <React.Fragment key={n}>
          <Zeile x={RX} y={RY + 20 + i * 108} w={RW - 110} h={92} t={n} size={42} a={o(cue(0) + 0.3 + i * 0.35)} rand={i === 3 && t > tn ? C.orange : C.line} />
          <Mark x={RX + RW - 92} y={RY + 20 + i * 108} size={92} ok={!(i === 3 && t > tn)} a={o(cue(0) + 0.7 + i * 0.35)} />
        </React.Fragment>
      ))}
      <Etikett x={RX + 450} y={RY + 690} t="Nein = Aufgabe zuerst" f={C.orange} size={50} a={o(tn)} />
    </Szene>
  );
};

export default { problem: Problem, auswahl: Auswahl, pilot: Pilot, menschen: Menschen, entscheidung: Entscheid, fehler: Fehler, checkliste: Check };
