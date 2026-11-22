import React from "react";
import { Szene, useCues, sp, ease, lerp, C } from "../lib.jsx";
import { Panel, Lbl } from "../bausteine.jsx";
import { Pf, Etikett, Mark } from "../neu.jsx";
import { Kn, Kachel, Ic } from "../bausteine-betrieb.jsx";
import { Pic, Gross } from "../bausteine-uc.jsx";

const P = "fertigung-sichtpruefung/";
const G = (i) => `${P}gut/${String(i).padStart(2, "0")}.jpg`;
const A = (i) => `${P}ausschuss/${String(i).padStart(2, "0")}.jpg`;
const T = (i) => `${P}test/${String(i).padStart(2, "0")}.jpg`;

// ---------- 1 Band: Scheiben laufen am Prüffenster vorbei
const BAND = [[G(2), 1], [G(5), 1], [A(1), 0], [G(9), 1], [A(3), 0], [G(12), 1], [A(2), 0], [G(14), 1]];
const Band = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const att = ease(t, cue(1) - 0.2, cue(1) + 5.5, 1, 0.3);
  const tf = word(1, "Schicht");
  return (
    <Szene titel="Am Bandende" tiefe={["eye", 1500, 640, 800]}>
      <Panel x={90} y={330} w={1740} h={300} r={20} a={o(0.2)} bg="#151517" />
      {Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ position: "absolute", left: ((i * 60 - t * 150) % 2400 + 2400) % 2400 - 300, top: 626, width: 30, height: 8, background: C.line, borderRadius: 4, opacity: o(0.3) }} />)}
      {BAND.map(([k, gut], i) => {
        const x = 1850 + i * 300 - t * 190;
        const am = x > 330 && x < 600;
        const durch = x < 330;
        return (
          <React.Fragment key={i}>
            <Pic k={k} x={x} y={380} w={240} h={180} a={o(0.3)} rand={am ? C.orange : C.line} />
            {durch && <Mark x={x + 75} y={575} ok={!!gut} size={70} a={Math.min(1, (330 - x) / 60)} />}
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 300, top: 350, width: 300, height: 240, border: `6px solid ${C.orange}`, borderRadius: 24, opacity: o(0.5), boxShadow: `0 0 40px ${C.orange}66` }} />
      <div style={{ position: "absolute", left: 365, top: 250, opacity: o(0.5), display: "flex", alignItems: "center", gap: 14 }}><Ic name="eye" size={64} color={C.orange} /><div style={{ fontSize: 44, fontWeight: 700, color: C.orange }}>Prüfer</div></div>
      <Etikett x={1260} y={255} t="Beispielbilder, gezeichnet" f={C.mute} size={34} a={o(0.6)} />
      <Panel x={90} y={730} w={1740} h={240} r={24} a={o(0.7)} />
      <Lbl x={140} y={760} w={560} t="Aufmerksamkeit" size={44} color={C.mute} a={o(0.8)} />
      <div style={{ position: "absolute", left: 140, top: 840, width: 760, height: 40, borderRadius: 20, background: C.panel2, opacity: o(0.8) }}><div style={{ width: `${att * 100}%`, height: 40, borderRadius: 20, background: att > 0.6 ? C.green : C.orange }} /></div>
      <Lbl x={140} y={895} w={760} t="nach zwei Stunden" size={36} color={C.mute} a={o(cue(1) + 3)} />
      <Pic k={A(3)} x={1000} y={760} w={187} h={140} a={o(tf)} />
      <Pic k={A(3)} x={1440} y={760} w={187} h={140} a={o(tf + 0.6)} />
      <Kn x={1093} y={932} w={320} h={56} t="Frühschicht: gut" f={C.green} size={30} a={o(tf)} />
      <Kn x={1533} y={932} w={380} h={56} t="Spätschicht: Ausschuss" f={C.red} size={28} a={o(tf + 0.6)} />
      <Pf x1={1230} y1={830} x2={1400} y2={830} p={ease(t, tf + 0.3, tf + 0.8)} f={C.mute} w={7} />
    </Szene>
  );
};

// ---------- 2 Zwei Fächer: zwei Fotos fliegen in das richtige Fach
const Fach = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t1 = word(0, "gut oder") - 0.2, t2 = word(0, "Ausschuss.") - 0.3;
  const u1 = ease(t, t1, t1 + 0.9), u2 = ease(t, t2, t2 + 0.9);
  const fl = (u, tx, ty) => ({ w: lerp(520, 150, u), h: lerp(390, 112, u), x: lerp(150, tx - lerp(520, 150, u) / 2, u), y: lerp(290, ty - lerp(390, 112, u) / 2, u) });
  const f1 = fl(u1, 1180, 360), f2 = fl(u2, 1600, 360);
  return (
    <Szene titel="Zwei Fächer" tiefe={["box", 1500, 640, 800]}>
      <div style={{ position: "absolute", left: 150, top: 290, width: 520, height: 390, border: `4px dashed ${C.line}`, borderRadius: 14, boxSizing: "border-box", opacity: o(0.4) }} />
      <Etikett x={150} y={715} t="Foto der Scheibe" f={C.mute} size={40} a={o(0.6)} />
      <Pf x1={720} y1={485} x2={980} y2={430} p={ease(t, 1.0, 1.7)} f={C.mute} w={8} />
      <Panel x={1000} y={250} w={360} h={340} rand={C.green} a={o(0.6)} r={24} />
      <Lbl x={1000} y={500} w={360} t="Gut" size={56} color={C.green} align="center" a={o(0.6)} />
      <Panel x={1420} y={250} w={360} h={340} rand={u2 > 0.9 ? C.red : C.orange} a={o(0.8)} r={24} />
      <Lbl x={1420} y={500} w={360} t="Ausschuss" size={56} color={C.orange} align="center" a={o(0.8)} />
      <Pic k={T(4)} x={f1.x} y={f1.y} w={f1.w} h={f1.h} rand={C.green} bw={4} a={Math.min(1, o(0.4) * 4) * (t < t2 - 0.1 || u1 < 0.99 ? 1 : 1)} />
      {t > t1 + 0.9 && <Pic k={T(1)} x={f2.x} y={f2.y} w={f2.w} h={f2.h} rand={C.orange} bw={4} a={ease(t, t1 + 0.9, t1 + 1.3)} />}
      <Mark x={1260} y={270} ok size={70} a={ease(t, t1 + 0.8, t1 + 1.2)} />
      <Mark x={1690} y={270} ok size={70} a={ease(t, t2 + 0.8, t2 + 1.2)} />
      <Kn x={540} y={850} w={700} h={120} t="repariert nichts" ic="wrench" f={C.mute} size={50} a={o(cue(1))} />
      <Kn x={1360} y={850} w={760} h={120} t="sucht keine Ursache" ic="search" f={C.mute} size={50} a={o(cue(1) + 0.9)} />
    </Szene>
  );
};

// ---------- 3 Zwei Stapel: 20 und 20 Beispiele
const Raster = ({ x0, y0, k, a }) => (
  <>
    {Array.from({ length: 20 }).map((_, i) => <Pic key={i} k={k(i + 1)} x={x0 + (i % 5) * 134} y={y0 + Math.floor(i / 5) * 103} w={124} h={93} r={10} bw={2} a={a(i)} s={lerp(0.7, 1, Math.min(1, a(i)))} />)}
  </>
);
const Stapel = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t0 = word(0, "im Labor");
  const ag = (off) => (i) => sp(t, t0 + off + i * 0.09, 0.5);
  return (
    <Szene titel="Zwei Stapel Beispiele" tiefe={["image", 1500, 640, 800]}>
      <Lbl x={150} y={235} w={670} t="20 Gut" size={64} color={C.green} align="center" a={o(0.4)} />
      <Lbl x={1100} y={235} w={670} t="20 Ausschuss" size={64} color={C.orange} align="center" a={o(t0 + 2.2)} />
      <Lbl x={820} y={480} w={280} t="+" size={140} color={C.mute} align="center" a={o(t0 + 2.2)} />
      <Raster x0={150} y0={330} k={G} a={ag(0)} />
      <Raster x0={1100} y0={330} k={A} a={ag(2.2)} />
      <Kn x={960} y={880} w={1180} h={120} t="Einig sein: Was ist Ausschuss?" ic="users" f={C.blue} size={52} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 4 Drei Nachbarn
const NB = [[A(12), "Ausschuss"], [A(3), "Ausschuss"], [A(6), "Ausschuss"]];
const Nachbarn = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tn = word(0, "drei ähnlichsten");
  return (
    <Szene titel="Die drei Nachbarn" tiefe={["search", 1500, 640, 800]}>
      <Etikett x={150} y={262} t="neues Bild" f={C.blue} size={40} a={o(0.4)} />
      <Pic k={T(2)} x={140} y={340} w={440} h={330} a={o(0.4)} rand={C.blue} bw={5} />
      {NB.map(([k, c], i) => {
        const y = 240 + i * 200;
        return (
          <React.Fragment key={i}>
            <Pf x1={600} y1={505} x2={850} y2={y + 90} p={ease(t, tn + i * 0.5, tn + i * 0.5 + 0.7)} f={C.blue} w={6} />
            <Pic k={k} x={870} y={y} w={240} h={180} a={o(tn + i * 0.5 + 0.4)} rand={C.orange} />
            <Kn x={1290} y={y + 90} w={240} h={80} t={c} f={C.orange} size={36} a={o(tn + i * 0.5 + 0.8)} />
          </React.Fragment>
        );
      })}
      <Pf x1={1430} y1={505} x2={1500} y2={505} p={ease(t, tn + 2.2, tn + 2.6)} f={C.mute} w={7} />
      <Kachel x={1510} y={340} w={320} h={330} ic="check" t="Mehrheit" sub="Ausschuss" f={C.orange} a={o(tn + 2.4)} ics={100} size={50} />
      <Kn x={960} y={925} w={720} h={90} t="kein langes Training" ic="zap" f={C.green} size={46} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 5 Zahlen und der eine Fehler
const Zahlen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Was herauskam" tiefe={["target", 1500, 640, 800]}>
      <Gross x={110} y={250} w={600} h={300} wert="11 von 12" label="Testbilder richtig" f={C.green} size={108} a={o(cue(0))} />
      <Gross x={110} y={600} w={600} h={300} wert="60 von 60" label="weitere Bilder richtig" f={C.green} size={108} a={o(word(0, "60 von 60"))} />
      <Pic k={T(10)} x={780} y={250} w={480} h={360} rand={C.red} bw={6} glow={C.red} a={o(cue(1))} />
      <Etikett x={780} y={635} t="Testbild 10: Ausschuss" f={C.red} size={34} a={o(cue(1) + 0.3)} />
      {[[A(3), "Ausschuss", C.orange], [G(7), "Gut", C.green], [G(11), "Gut", C.green]].map(([k, n, f], i) => (
        <React.Fragment key={i}>
          <Pic k={k} x={780 + i * 165} y={720} w={150} h={112} a={o(cue(1) + 1 + i * 0.3)} rand={f} bw={4} r={10} />
          <Lbl x={780 + i * 165} y={845} w={150} t={n} size={28} color={f} align="center" a={o(cue(1) + 1.2 + i * 0.3)} />
        </React.Fragment>
      ))}
      <Kachel x={1330} y={250} w={500} h={360} ic="alert" t="Ausschuss als Gut" sub="die teure Richtung" f={C.red} a={o(word(1, "teure"))} ics={110} size={52} />
      <Kn x={1580} y={810} w={500} h={190} t="Bilder gezeichnet" sub="echte Teile glänzen" ic="edit" f={C.mute} size={44} a={o(cue(2))} />
    </Szene>
  );
};

// ---------- 6 Vor dem Einsatz
const Fragen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const F = [["target", "Welche Entscheidung?", "Gut oder Ausschuss", "Welche Entscheidung"], ["database", "Welche Daten?", "eigene Fotos, gleiches Licht", "Welche Daten"], ["userCheck", "Wer prüft?", "ein Mensch mit Stichproben", "Wer prüft"]];
  return (
    <Szene titel="Vor dem Einsatz" tiefe={["clip", 1500, 640, 800]}>
      {F.map(([ic, n, s, w], i) => <Kachel key={i} x={130 + i * 570} y={260} w={520} h={380} ic={ic} t={n} sub={s} f={C.blue} a={o(word(0, w) - 0.1)} ics={110} size={48} />)}
      <Pf x1={1530} y1={650} x2={1250} y2={760} p={ease(t, cue(1), cue(1) + 0.6)} f={C.mute} w={7} />
      <Kn x={730} y={840} w={1000} h={150} t="Stichprobe aus dem Gut-Fach" ic="hand" f={C.blue} size={56} a={o(cue(1))} />
      <Kn x={1560} y={840} w={520} h={150} t="Beispiel startklar" ic="play" f={C.green} size={46} a={o(word(1, "Das Beispiel"))} />
    </Szene>
  );
};

export default { band: Band, fach: Fach, stapel: Stapel, nachbarn: Nachbarn, zahlen: Zahlen, fragen: Fragen };
