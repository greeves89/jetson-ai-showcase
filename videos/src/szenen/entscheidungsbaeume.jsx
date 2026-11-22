import React from "react";
import { Szene, useCues, sp, ease, lerp, Icon, Badge, C } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Pf, Etikett, Mark, Zeile } from "../neu.jsx";
import { Baum, Kn, Pt, Ic, Bg, RX, RW, RY, RH } from "../bausteine-betrieb.jsx";

const PATH = ["0-0", "1-1", "2-2", "3-4"];
// Anker links: der Baum, in jeder Szene an derselben Stelle
const Ank = ({ hl = [], out = [], deep = 0, label = "Entscheidungsbaum" }) => (
  <>
    <Panel x={90} y={215} w={560} h={760} r={28} />
    <Lbl x={90} y={240} w={560} t={label} size={40} align="center" color={C.mute} />
    <Baum x={150} y={340} w={440} h={520} levels={3} hl={hl} out={out} a={1 - deep} leafCol={() => C.mute} />
    {deep > 0 && <Baum x={150} y={340} w={440} h={520} levels={5} a={deep} f={C.orange} leafCol={() => C.orange} hl={["0-0"]} />}
  </>
);
const pfad = (t, ts) => PATH.filter((_, i) => t >= ts[i]);

// ---------- 1 Ratespiel
const Rate = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ts = [word(1, "Ist es"), word(1, "Hat es"), word(1, "Genau") - 0.4, word(1, "Genau") + 0.4];
  return (
    <Szene titel="Das Ratespiel" tiefe={["help", 1500, 640, 800]} anker={<Ank hl={pfad(t, ts)} />}>
      <div style={{ position: "absolute", left: RX + 60, top: RY + 10, opacity: o(0.5) }}><Bg name="help" size={220} color={C.orange} /></div>
      <Lbl x={RX + 330} y={RY + 40} w={700} t="Ja oder Nein" size={80} weight={800} a={o(0.8)} />
      <Chip x={RX + 330} y={RY + 150} t="Ja" f={C.green} size={54} a={o(1.2)} />
      <Chip x={RX + 470} y={RY + 150} t="Nein" f={C.red} size={54} a={o(1.4)} />
      <Zeile x={RX + 60} y={RY + 330} w={620} h={110} t="Ist es ein Tier?" size={52} a={o(ts[0] - 0.2)} rand={C.blue} />
      <Chip x={RX + 720} y={RY + 350} t="Ja" f={C.green} size={54} a={o(ts[0] + 0.5)} />
      <Zeile x={RX + 60} y={RY + 480} w={620} h={110} t="Hat es vier Beine?" size={52} a={o(ts[1] - 0.2)} rand={C.blue} />
      <Chip x={RX + 720} y={RY + 500} t="Ja" f={C.green} size={54} a={o(ts[1] + 0.5)} />
      <Kn x={RX + 900} y={RY + 700} w={330} h={120} t="Hund" ic="heart" f={C.green} size={56} a={o(ts[2])} />
      <Pf x1={RX + 400} y1={RY + 600} x2={RX + 735} y2={RY + 700} p={ease(t, ts[2], ts[2] + 0.5)} f={C.green} w={6} />
    </Szene>
  );
};

// ---------- 2 Tabelle
const ROWS = [["nein", "nein", "Handel", "Zusage"], ["ja", "ja", "Bau", "Absage"], ["nein", "ja", "Handwerk", "Zusage"], ["ja", "nein", "Handel", "Zusage"]];
const HEAD = ["Rückstände", "Rate zu hoch", "Branche", "Antwort"];
const CX = [30, 270, 540, 840], CW = [220, 250, 280, 230];
const Tabelle = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tz = word(0, "Jede Zeile"), ts = word(0, "jede Spalte"), tb = word(1, "Blatt");
  const ts2 = [word(1, "Der Baum"), word(1, "fragt"), tb - 0.3, tb + 0.3];
  return (
    <Szene titel="Tabelle und Baum" tiefe={["grid", 1500, 640, 800]} anker={<Ank hl={pfad(t, ts2)} />}>
      <Panel x={RX} y={RY} w={RW} h={500} a={o(0.3)} />
      {HEAD.map((h, i) => <div key={h} style={{ position: "absolute", left: RX + CX[i], top: RY + 24, width: CW[i], height: 80, borderRadius: 18, border: `3px solid ${i === 3 ? C.orange : C.blue}`, background: (i === 3 ? C.orange : C.blue) + (t > ts && i === 1 ? "55" : "1f"), color: i === 3 ? C.orange : C.blue, fontSize: 38, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", opacity: o(0.5 + i * 0.12), boxSizing: "border-box" }}>{h}</div>)}
      {ROWS.map((r, k) => r.map((v, i) => (
        <div key={k + "" + i} style={{ position: "absolute", left: RX + CX[i], top: RY + 130 + k * 90, width: CW[i], height: 74, borderRadius: 16, background: C.panel2, border: `3px solid ${k === 1 && t > tz ? C.blue : i === 1 && t > ts ? C.blue + "99" : C.line}`, fontSize: 40, fontWeight: 600, color: i === 3 ? (v === "Absage" ? C.red : C.green) : C.text, display: "flex", alignItems: "center", justifyContent: "center", opacity: o(0.9 + k * 0.2), boxSizing: "border-box" }}>{v}</div>
      )))}
      <Lbl x={RX} y={RY + 540} w={540} t="Zeile = ein Fall" size={46} color={C.blue} a={o(tz)} align="center" />
      <Lbl x={RX + 590} y={RY + 540} w={540} t="Spalte = ein Merkmal" size={46} color={C.blue} a={o(ts)} align="center" />
      <Kn x={RX + 565} y={RY + 700} w={560} h={100} t="Blatt = die Antwort" ic="check" f={C.green} size={46} a={o(tb)} />
    </Szene>
  );
};

// ---------- 3 Beste Frage
const GR = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0]; // 1 = zurückgezahlt
const Gruppe = ({ x, y, n, g, a = 1, f }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 3 * 80, opacity: a }}>
    {Array.from({ length: n }).map((_, i) => <div key={i} style={{ position: "absolute", left: (i % 3) * 80, top: Math.floor(i / 3) * 80, width: 62, height: 62, borderRadius: 31, background: i < g ? C.green : C.red }} />)}
  </div>
);
const Frage = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ta = word(2, "Gibt es"), tbb = word(2, "Ist die"), tx = word(2, "fliegt");
  const xb = ease(t, tx, tx + 0.8);
  return (
    <Szene titel="Die beste Frage zuerst" tiefe={["target", 1500, 640, 800]} anker={<Ank hl={t > cue(0) ? ["0-0"] : []} />}>
      {GR.map((v, i) => <div key={i} style={{ position: "absolute", left: RX + 40 + i * 78, top: RY + 20, width: 60, height: 60, borderRadius: 30, background: v ? C.green : C.red, opacity: o(cue(0) + 0.3 + i * 0.1) }} />)}
      <Lbl x={RX + 40} y={RY + 100} w={800} t="6 zurückgezahlt, 4 nicht" size={42} color={C.mute} a={o(cue(1))} />
      <Panel x={RX} y={RY + 170} w={540} h={580} rand={C.green} a={o(ta - 0.2)} />
      <Lbl x={RX} y={RY + 190} w={540} t="Zahlungsrückstände?" size={44} align="center" a={o(ta - 0.1)} color={C.green} />
      <Lbl x={RX + 20} y={RY + 280} w={240} t="ja" size={40} align="center" color={C.mute} a={o(ta + 0.3)} />
      <Lbl x={RX + 290} y={RY + 280} w={240} t="nein" size={40} align="center" color={C.mute} a={o(ta + 0.3)} />
      <Gruppe x={RX + 35} y={RY + 350} n={4} g={1} a={o(ta + 0.5)} />
      <Gruppe x={RX + 270} y={RY + 350} n={6} g={5} a={o(ta + 0.7)} />
      <Mark x={RX + 220} y={RY + 640} size={100} a={o(ta + 1.4)} />
      <Panel x={RX + 590} y={RY + 170} w={540} h={580} rand={C.red} a={o(tbb - 0.2) * (1 - 0.65 * xb)} />
      <div style={{ opacity: 1 - 0.65 * xb }}>
        <Lbl x={RX + 590} y={RY + 190} w={540} t="Hausnummer gerade?" size={44} align="center" a={o(tbb - 0.1)} color={C.red} />
        <Lbl x={RX + 610} y={RY + 280} w={240} t="ja" size={40} align="center" color={C.mute} a={o(tbb + 0.3)} />
        <Lbl x={RX + 880} y={RY + 280} w={240} t="nein" size={40} align="center" color={C.mute} a={o(tbb + 0.3)} />
        <Gruppe x={RX + 625} y={RY + 350} n={5} g={3} a={o(tbb + 0.5)} />
        <Gruppe x={RX + 860} y={RY + 350} n={5} g={3} a={o(tbb + 0.7)} />
      </div>
      <Mark x={RX + 810} y={RY + 640} ok={false} size={100} a={o(tx)} />
    </Szene>
  );
};

// ---------- 4 Lesen
const Lesen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ts = [word(1, "Rückstände"), word(1, "Rate"), word(1, "abgelehnt")];
  return (
    <Szene titel="Man kann ihn lesen" tiefe={["book", 1500, 640, 800]} anker={<Ank hl={pfad(t, [ts[0], ts[1], ts[2], ts[2]]).concat([])} />}>
      <Kn x={RX + 290} y={RY + 130} w={520} h={130} t="Rückstände?" sub="ja" f={C.blue} size={52} a={o(ts[0] - 0.3)} />
      <Pf x1={RX + 290} y1={RY + 200} x2={RX + 290} y2={RY + 295} p={ease(t, ts[1] - 0.5, ts[1])} f={C.mute} />
      <Kn x={RX + 290} y={RY + 360} w={520} h={130} t="Rate zu hoch?" sub="ja" f={C.blue} size={52} a={o(ts[1] - 0.3)} />
      <Pf x1={RX + 290} y1={RY + 430} x2={RX + 290} y2={RY + 525} p={ease(t, ts[2] - 0.5, ts[2])} f={C.mute} />
      <Kn x={RX + 290} y={RY + 590} w={560} h={130} t="Antrag ablehnen" ic="x" f={C.red} size={52} a={o(ts[2] - 0.3)} />
      <div style={{ position: "absolute", left: RX + 600, top: RY + 80, width: 8, height: 330, borderRadius: 4, background: C.orange, opacity: o(cue(1) + 3.2) }} />
      <Etikett x={RX + 650} y={RY + 195} t="Begründung" f={C.orange} size={56} a={o(cue(1) + 3.4)} />
      <Lbl x={RX + 650} y={RY + 290} w={470} t="in zwei Fragen nachlesbar" size={40} color={C.mute} a={o(cue(1) + 3.8)} />
    </Szene>
  );
};

// ---------- 5 Grenze
const Grenze = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const deep = ease(t, cue(0) + 0.4, cue(0) + 2.4);
  const p1 = ease(t, cue(0) + 1.8, cue(0) + 3.2), p2 = ease(t, cue(1), cue(1) + 1.2);
  return (
    <Szene titel="Die Grenze" tiefe={["alert", 1500, 640, 800]} anker={<Ank deep={deep} />}>
      <Kn x={RX + 250} y={RY + 70} w={500} h={100} t="auswendig gelernt" ic="book" f={C.orange} size={44} a={o(cue(0))} />
      <Lbl x={RX} y={RY + 200} w={RW} t="Trainingsdaten" size={50} weight={700} a={o(cue(0) + 1.2)} />
      <div style={{ position: "absolute", left: RX, top: RY + 275, width: RW, height: 80, borderRadius: 40, background: C.panel2 }} />
      <div style={{ position: "absolute", left: RX, top: RY + 275, width: RW * 0.96 * p1, height: 80, borderRadius: 40, background: C.green }} />
      <Lbl x={RX} y={RY + 440} w={RW} t="Neue Daten" size={50} weight={700} a={o(cue(1) - 0.2)} />
      <div style={{ position: "absolute", left: RX, top: RY + 515, width: RW, height: 80, borderRadius: 40, background: C.panel2, opacity: o(cue(1) - 0.2) }} />
      <div style={{ position: "absolute", left: RX, top: RY + 515, width: RW * 0.42 * p2, height: 80, borderRadius: 40, background: C.orange }} />
      <Etikett x={RX + RW * 0.42 + 40} y={RY + 528} t="fällt deutlich ab" f={C.red} size={46} a={o(cue(1) + 1.2)} />
    </Szene>
  );
};

// ---------- 6 Wald
const VOTE = [1, 1, 1, 0, 1];
const Wald = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tv = word(0, "stimmen"), tm = word(0, "Mehrheit"), te = word(0, "Einzelfehler");
  return (
    <Szene titel="Der Wald" tiefe={["users", 1500, 640, 800]} anker={<Ank hl={PATH} />}>
      {VOTE.map((v, i) => (
        <React.Fragment key={i}>
          <Baum x={RX + 10 + i * 224} y={RY + 40} w={200} h={230} levels={2} a={o(cue(0) + 0.3 + i * 0.25)} hl={["0-0", "1-1", "2-2"]} f={v ? C.blue : C.red} />
          <Kn x={RX + 110 + i * 224} y={RY + 360} w={180} h={100} t={v ? "Ja" : "Nein"} f={v ? C.green : C.red} size={48} a={o(tv + i * 0.2)} />
        </React.Fragment>
      ))}
      <Etikett x={RX + 640} y={RY + 500} t="Einzelfehler" f={C.red} size={44} a={o(te)} />
      <Pf x1={RX + 770} y1={RY + 495} x2={RX + 770} y2={RY + 425} p={ease(t, te + 0.2, te + 0.6)} f={C.red} w={6} />
      <Pf x1={RX + 400} y1={RY + 480} x2={RX + 400} y2={RY + 580} p={ease(t, tm - 0.4, tm + 0.3)} f={C.mute} />
      <Kn x={RX + 400} y={RY + 670} w={640} h={140} t="Mehrheit: Ja" ic="check" f={C.green} size={64} a={o(tm)} />
    </Szene>
  );
};

// ---------- 7 Einfach
const Einfach = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Oft genügt das Einfache" tiefe={["grid", 1500, 640, 800]} anker={<Ank hl={PATH} />}>
      <Panel x={RX} y={RY} w={540} h={RH} rand={C.green} a={o(0.3)} />
      <div style={{ position: "absolute", left: RX + 185, top: RY + 50, opacity: o(0.4) }}><Bg name="grid" size={170} color={C.green} /></div>
      <Lbl x={RX} y={RY + 250} w={540} t="Tabelle" size={64} weight={800} align="center" color={C.green} a={o(0.5)} />
      <Kn x={RX + 270} y={RY + 440} w={440} h={110} t="ein Baum" ic="fork" f={C.green} size={46} a={o(cue(0) + 0.8)} />
      <Kn x={RX + 270} y={RY + 600} w={440} h={110} t="in Sekunden" ic="clock" f={C.green} size={46} a={o(cue(1) + 0.4)} />
      <Panel x={RX + 590} y={RY} w={540} h={RH} rand={C.blue} a={o(cue(2) - 0.2)} />
      {[["image", "Bild"], ["mic", "Ton"], ["message", "Text"]].map(([ic, n], i) => (
        <div key={n} style={{ position: "absolute", left: RX + 640 + i * 160, top: RY + 60, width: 140, textAlign: "center", opacity: o(cue(2) + i * 0.3) }}>
          <Bg name={ic} size={120} color={C.blue} /><div style={{ fontSize: 40, fontWeight: 700, marginTop: 12 }}>{n}</div>
        </div>
      ))}
      <Lbl x={RX + 590} y={RY + 330} w={540} t="Neuronales Netz" size={58} weight={800} align="center" color={C.blue} a={o(cue(2) + 1.0)} />
      <div style={{ position: "absolute", left: RX + 760, top: RY + 440, opacity: o(cue(2) + 1.4) }}><Ic name="network" size={200} color={C.blue} sw={1.3} /></div>
    </Szene>
  );
};

export default { ratespiel: Rate, tabelle: Tabelle, frage: Frage, lesen: Lesen, grenze: Grenze, wald: Wald, einfach: Einfach };
