import React from "react";
import { Szene, useCues, sp, ease, lerp, rnd, C } from "../lib.jsx";
import { Panel, Lbl } from "../bausteine.jsx";
import { Pf, Etikett, Mark } from "../neu.jsx";
import { Kn, Fl, Ic, Bg } from "../bausteine-betrieb.jsx";
import { Pic, Gross, Punkte } from "../bausteine-uc.jsx";

const P = "fertigung-sortieren/";
const K = (c, i) => `${P}${c}/${String(i).padStart(2, "0")}.jpg`;
const T = (i) => `${P}test/${String(i).padStart(2, "0")}.jpg`;
const KL = [["schraube", "Schrauben", C.blue], ["mutter", "Muttern", C.green], ["scheibe", "Scheiben", C.orange]];

// ---------- 1 Vorher/Nachher: gemischte Kiste wird sortiert
const Kiste = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t0 = word(1, "sortiert");
  const items = Array.from({ length: 18 }).map((_, i) => ({ c: i % 3, n: Math.floor(i / 3) + 1 }));
  return (
    <Szene titel="Die gemischte Kiste" tiefe={["package", 1500, 640, 800]}>
      <Panel x={90} y={215} w={800} h={560} a={o(0.3)} />
      <Lbl x={90} y={232} w={800} t="Gemischt" size={40} color={C.mute} align="center" a={o(0.4)} />
      <Panel x={1030} y={215} w={800} h={560} a={o(0.3)} />
      <Lbl x={1030} y={232} w={800} t="Sortiert" size={40} color={C.mute} align="center" a={o(t0 - 0.5)} />
      {KL.map(([, n, f], c) => <Lbl key={n} x={1050 + c * 260} y={290} w={250} t={n} size={34} color={f} align="center" a={o(t0)} />)}
      {items.map(({ c, n }, i) => {
        const sx = 120 + rnd(i * 3.1) * 600, sy = 300 + rnd(i * 5.7 + 1) * 400, rot = (rnd(i * 7.3) - 0.5) * 70;
        const col = c, row = Math.floor((n - 1) / 2), cc = (n - 1) % 2;
        const tx = 1050 + col * 260 + cc * 122, ty = 345 + row * 128;
        const u = ease(t, t0 + 0.2 + i * 0.22, t0 + 1.1 + i * 0.22);
        return <Pic key={i} k={K(KL[c][0], n)} x={lerp(sx, tx, u)} y={lerp(sy, ty, u)} w={112} h={84} r={8} bw={2} rot={lerp(rot, 0, u)} a={o(0.3 + i * 0.05)} rand={u > 0.95 ? KL[c][2] : C.line} />;
      })}
      <Kn x={470} y={890} w={760} h={110} t="sortiert von Hand" ic="hand" f={C.mute} size={46} a={o(t0)} />
      <Kn x={1430} y={890} w={760} h={110} t="diese Person fehlt woanders" ic="user" f={C.orange} size={42} a={o(word(1, "fehlt"))} />
    </Szene>
  );
};

// ---------- 2 Eine Kamera, drei Klassen
const Kamera = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tk = word(0, "welches Teil");
  const ys = [330, 490, 650];
  return (
    <Szene titel="Eine Kamera, drei Klassen" tiefe={["camera", 1500, 640, 800]}>
      <div style={{ position: "absolute", left: 340, top: 215, opacity: o(0.3) }}><Bg name="camera" size={130} color={C.blue} /></div>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <polygon points="405,345 205,420 605,420" fill={C.blue + "22"} stroke={C.blue + "66"} strokeWidth="3" opacity={o(0.5)} />
      </svg>
      <Pic k={T(9)} x={140} y={420} w={520} h={390} a={o(0.5)} rand={C.blue} bw={5} />
      <Etikett x={140} y={835} t="Tisch von oben" f={C.mute} size={36} a={o(0.7)} />
      <Pf x1={700} y1={615} x2={900} y2={550} p={ease(t, tk, tk + 0.8)} f={C.mute} w={8} />
      {KL.map(([, n, f], i) => { const sel = i === 1 && t > tk + 1.0; const s1 = n.slice(0, -1) + (n === "Scheiben" ? "" : ""); return (
        <Kn key={n} x={1360} y={ys[i]} w={560} h={120} t={["Schraube", "Mutter", "Scheibe"][i]} f={sel ? C.green : C.line} size={52} a={o(tk + 0.5 + i * 0.2)} fill={sel ? C.green + "33" : undefined} />
      ); })}
      <Mark x={1680} y={ys[1] - 45} ok size={90} a={ease(t, tk + 1.0, tk + 1.4)} />
      <Kn x={1100} y={900} w={1100} h={110} t="Bild rein, Klasse raus. Mehr nicht." ic="arrowRight" f={C.blue} size={46} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 3 Vielfalt gegen Einerlei
const Vielfalt = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const V = [2, 3, 4, 5, 9, 14];
  const ts = word(1, "schräg");
  return (
    <Szene titel="Vielfalt zeigen" tiefe={["layers", 1500, 640, 800]}>
      <Lbl x={140} y={232} w={1600} t="Verschiedene Lagen und Drehungen" size={44} color={C.green} a={o(0.4)} />
      {V.map((n, i) => <Pic key={i} k={K("schraube", n)} x={140 + i * 270} y={300} w={230} h={172} a={o(word(0, "Lagen") - 0.4 + i * 0.12)} rand={C.green} />)}
      <Lbl x={140} y={540} w={1600} t="Immer gleich" size={44} color={C.orange} a={o(cue(1) - 0.3)} />
      {[0, 1, 2, 3, 4].map((i) => <Pic key={i} k={K("schraube", 1)} x={140 + i * 270} y={610} w={230} h={172} a={o(cue(1) + i * 0.12)} rand={C.orange} />)}
      <Pic k={K("schraube", 8)} x={140 + 5 * 270} y={610} w={230} h={172} a={o(ts)} rand={C.red} bw={6} glow={C.red} />
      <div style={{ position: "absolute", left: 140 + 5 * 270 + 70, top: 640, opacity: ease(t, ts + 0.5, ts + 0.9) }}><div style={{ fontSize: 110, fontWeight: 800, color: C.red, textShadow: "0 0 20px #000" }}>?</div></div>
      <Kn x={1480} y={880} w={520} h={90} t="schräg: nicht erkannt" ic="x" f={C.red} size={38} a={o(ts + 0.3)} />
    </Szene>
  );
};

// ---------- 4 Der Abstand der Balken
const BalkenS = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tb = word(0, "weit vorn");
  const L = [0.92, 0.3, 0.2];
  const ys = [300, 450, 600];
  return (
    <Szene titel="Der Abstand der Balken" tiefe={["chart", 1500, 640, 800]}>
      <Etikett x={140} y={240} t="Testbild" f={C.blue} size={38} a={o(0.4)} />
      <Pic k={T(1)} x={140} y={310} w={500} h={375} a={o(0.4)} rand={C.blue} bw={5} />
      {KL.map(([c, n, f], i) => {
        const p = ease(t, tb - 0.4 + i * 0.25, tb + 0.9 + i * 0.25) * L[i];
        return (
          <React.Fragment key={c}>
            <Pic k={K(c, 1)} x={780} y={ys[i]} w={120} h={90} r={10} bw={3} a={o(0.6 + i * 0.2)} rand={f} />
            <div style={{ position: "absolute", left: 930, top: ys[i] + 15, width: 840, height: 60, borderRadius: 14, background: C.panel2, opacity: o(0.6 + i * 0.2) }}><div style={{ width: `${p * 100}%`, height: 60, borderRadius: 14, background: i === 0 ? C.green : C.mute }} /></div>
            <Lbl x={940} y={ys[i] + 20} w={600} t={["Schraube", "Mutter", "Scheibe"][i]} size={36} color="#fff" a={o(0.6 + i * 0.2)} />
          </React.Fragment>
        );
      })}
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: ease(t, cue(1), cue(1) + 0.6) }}>
        <line x1={930 + 840 * 0.3} y1={400} x2={930 + 840 * 0.92} y2={400} stroke={C.orange} strokeWidth="8" strokeLinecap="round" />
        <line x1={930 + 840 * 0.3} y1={385} x2={930 + 840 * 0.3} y2={415} stroke={C.orange} strokeWidth="8" strokeLinecap="round" />
        <line x1={930 + 840 * 0.92} y1={385} x2={930 + 840 * 0.92} y2={415} stroke={C.orange} strokeWidth="8" strokeLinecap="round" />
      </svg>
      <Etikett x={1000} y={800} t="großer Abstand = sicheres Ergebnis" f={C.orange} size={44} a={o(cue(1))} />
      <Lbl x={780} y={880} w={990} t="Balken schematisch, keine Messwerte" size={30} color={C.mute} weight={500} a={o(cue(1) + 0.4)} />
    </Szene>
  );
};

// ---------- 5 Zahlen als Punktefelder
const ZahlenS = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t12 = word(0, "alle 12"), t90 = word(0, "alle 90");
  return (
    <Szene titel="Was herauskam" tiefe={["target", 1500, 640, 800]}>
      <Gross x={110} y={235} w={560} h={250} wert="12 von 12" label="Testbilder" f={C.green} size={104} a={o(t12 - 0.2)} />
      <Punkte x={150} y={520} gesamt={12} voll={(t - t12) * 6} cols={6} d={58} gap={14} f={C.green} a={o(t12)} />
      <Gross x={800} y={235} w={1030} h={250} wert="90 von 90" label="weitere Bilder, alle richtig" f={C.green} size={104} a={o(t90 - 0.2)} />
      <Punkte x={820} y={520} gesamt={90} voll={(t - t90) * 20} cols={18} d={44} gap={11} f={C.green} a={o(t90)} />
      <Kn x={400} y={900} w={560} h={100} t="Glanz: Teile spiegeln" ic="sun" f={C.orange} size={36} a={o(word(1, "spiegeln") - 0.4)} />
      <Kn x={1000} y={900} w={560} h={100} t="Teile verdecken sich" ic="layers" f={C.orange} size={36} a={o(word(1, "verdecken") - 0.4)} />
      <Kn x={1560} y={900} w={540} h={100} t="12 Bilder: kein Beweis" ic="alert" f={C.red} size={36} a={o(cue(2))} />
    </Szene>
  );
};

// ---------- 6 Kamera liefert die Klasse, die Mechanik bleibt deine
const Weiche = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tw = word(0, "Greifer");
  const fachY = [430, 560, 690];
  return (
    <Szene titel="Die Mechanik bleibt deine" tiefe={["wrench", 1500, 640, 800]}>
      <Panel x={110} y={235} w={700} h={600} rand={C.green} a={o(0.3)} />
      <Lbl x={110} y={255} w={700} t="Kamera: liefert die Klasse" size={38} color={C.green} align="center" a={o(0.5)} />
      <Pic k={T(5)} x={180} y={330} w={300} h={225} a={o(0.6)} rand={C.green} />
      <Pf x1={500} y1={442} x2={590} y2={442} p={ease(t, 1.2, 1.7)} f={C.mute} w={7} />
      <Kn x={690} y={442} w={170} h={90} t="Scheibe" f={C.green} size={32} a={o(1.2)} />
      <div style={{ position: "absolute", left: 270, top: 620, opacity: o(0.8) }}><Bg name="camera" size={120} color={C.green} /></div>
      <Lbl x={430} y={655} w={360} t="sagt nur, was es ist" size={34} color={C.mute} weight={600} a={o(0.9)} />
      <Panel x={900} y={235} w={920} h={600} rand={C.orange} a={o(tw - 0.4)} />
      <Lbl x={900} y={255} w={920} t="Greifer oder Weiche: deine Arbeit" size={38} color={C.orange} align="center" a={o(tw - 0.2)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o(tw) }}>
        <line x1={940} y1={560} x2={1330} y2={560} stroke={C.mute} strokeWidth="14" strokeLinecap="round" />
        {fachY.map((y) => <path key={y} d={`M1330 560 L1450 ${y}`} stroke={C.line} strokeWidth="8" fill="none" strokeLinecap="round" />)}
        <path d="M1330 560 L1450 430" stroke={C.orange} strokeWidth="14" fill="none" strokeLinecap="round" />
        {fachY.map((y, i) => <rect key={i} x={1470} y={y - 36} width={290} height={72} rx={14} fill={C.panel2} stroke={KL[i][2]} strokeWidth="4" />)}
      </svg>
      {fachY.map((y, i) => <Lbl key={i} x={1470} y={y - 18} w={290} t={KL[i][1]} size={32} color={KL[i][2]} align="center" a={o(tw)} />)}
      <div style={{ position: "absolute", left: 1000, top: 640, opacity: o(tw + 0.4) }}><Bg name="wrench" size={110} color={C.orange} /></div>
      <Kn x={960} y={915} w={1250} h={100} t="Mit der leichten Aufgabe anfangen, Stichproben prüfen" ic="check" f={C.blue} size={40} a={o(cue(1))} />
    </Szene>
  );
};

export default { kiste: Kiste, kamera: Kamera, vielfalt: Vielfalt, balken: BalkenS, zahlen: ZahlenS, weiche: Weiche };
