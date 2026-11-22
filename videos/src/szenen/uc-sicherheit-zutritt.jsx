import React from "react";
import { Szene, useCues, sp, ease, lerp, C } from "../lib.jsx";
import { Panel, Lbl } from "../bausteine.jsx";
import { Pf, Etikett, Mark } from "../neu.jsx";
import { Kn, Kachel, Bg, Ic } from "../bausteine-betrieb.jsx";
import { Gesicht } from "../bausteine-uc.jsx";

// ---------- 1 Die Seitentür: Lampe an, aus, an bei Bewegung
const Tuer = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tb = word(0, "brennt"), tg = word(0, "gar nicht"), tk = word(1, "wenn jemand");
  const an = (t > tb && t < tg) || t > tk + 1.0 ? 1 : 0;
  const px = lerp(1180, 860, ease(t, tk - 0.8, tk + 1.0));
  const glow = an ? 1 : 0;
  return (
    <Szene titel="Die Seitentür" tiefe={["door", 1500, 640, 800]}>
      <Panel x={110} y={230} w={1180} h={700} a={o(0.3)} bg="#0c0d12" />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o(0.4) }}>
        {glow > 0 && <polygon points="700,430 430,880 970,880" fill="#ffd45a" opacity="0.28" />}
        <rect x={540} y={450} width={320} height={430} rx={10} fill="#2a2018" stroke="#4a3a2a" strokeWidth="6" />
        <circle cx={820} cy={680} r="14" fill="#c9a24a" />
        <rect x={330} y={880} width={740} height={10} rx={5} fill={C.line} />
        <circle cx={700} cy={390} r={34} fill={glow ? "#ffd45a" : "#333"} stroke={glow ? "#ffe9a0" : "#555"} strokeWidth="5" />
        {glow > 0 && <circle cx={700} cy={390} r={80} fill="#ffd45a" opacity="0.22" />}
        <rect x={684} y={330} width={32} height={30} fill="#555" />
      </svg>
      <div style={{ position: "absolute", left: px - 55, top: 740, opacity: ease(t, tk - 0.9, tk - 0.4) }}><Bg name="user" size={110} color={C.blue} /></div>
      <Kn x={1560} y={330} w={500} h={110} t="ganze Nacht an" ic="zap" f={C.orange} size={42} a={o(tb)} />
      <Kn x={1560} y={470} w={500} h={110} t="gar nicht" ic="moon" f={C.mute} size={42} a={o(tg)} />
      <Kn x={1560} y={640} w={500} h={150} t="an, wenn jemand kommt" ic="check" f={C.green} size={34} a={o(tk)} />
    </Szene>
  );
};

// ---------- 2 Zwei Aufgaben
const Unterschied = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ti = word(0, "Identifikation");
  return (
    <Szene titel="Zwei Aufgaben" tiefe={["scan", 1500, 640, 800]}>
      <Kachel x={110} y={250} w={800} h={370} ic="scan" t="Da ist ein Gesicht" sub="Detektion" f={C.green} a={o(0.4)} ics={140} size={60} />
      <Kachel x={1010} y={250} w={820} h={370} ic="database" t="Das ist Person X" sub="Identifikation" f={C.orange} a={o(ti - 0.3)} ics={140} size={60} />
      <div style={{ position: "absolute", left: 925, top: 380, fontSize: 90, fontWeight: 800, color: C.mute, opacity: o(ti) }}>/</div>
      <Kn x={510} y={780} w={800} h={130} t="genügt für das Licht" ic="bulb" f={C.green} size={50} a={o(cue(1))} />
      <Kn x={1370} y={780} w={900} h={130} t="Gesichter-Datenbank: eigenes Rechtsfeld" ic="scale" f={C.orange} size={34} a={o(word(1, "Das Zweite"))} />
    </Szene>
  );
};

// ---------- 3 Nur ein Rahmen
const Rahmen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tr = word(0, "zeichnet");
  const cx = 610 + Math.sin(t * 1.1) * 120, cy = 560 + Math.cos(t * 0.8) * 30;
  const r = 130;
  return (
    <Szene titel="Nur ein Rahmen" tiefe={["scan", 1500, 640, 800]}>
      <Panel x={110} y={240} w={1000} h={640} a={o(0.3)} bg="#0f1116" />
      {[[130, 260, 1, 1], [1090, 260, -1, 1], [130, 860, 1, -1], [1090, 860, -1, -1]].map(([x, y, sx, sy], i) => <div key={i} style={{ position: "absolute", left: x - (sx < 0 ? 60 : 0), top: y - (sy < 0 ? 60 : 0), width: 60, height: 60, borderLeft: sx > 0 ? `6px solid ${C.mute}` : "none", borderRight: sx < 0 ? `6px solid ${C.mute}` : "none", borderTop: sy > 0 ? `6px solid ${C.mute}` : "none", borderBottom: sy < 0 ? `6px solid ${C.mute}` : "none", opacity: o(0.4) }} />)}
      <Gesicht cx={cx} cy={cy} r={r} a={o(0.4)} />
      <div style={{ position: "absolute", left: cx - r * 1.05, top: cy - r * 1.25, width: r * 2.1, height: r * 2.5, border: `7px solid ${C.orange}`, borderRadius: 18, boxSizing: "border-box", opacity: o(tr), boxShadow: `0 0 30px ${C.orange}66` }} />
      <Etikett x={150} y={290} t="gezeichnet, keine echte Person" f={C.mute} size={32} a={o(0.6)} />
      <Kn x={1500} y={340} w={640} h={120} t="Gesicht da: ja" ic="check" f={C.green} size={46} a={o(tr)} />
      <Kn x={1500} y={500} w={640} h={120} t="Wer? unbekannt" ic="help" f={C.mute} size={46} a={o(word(0, "weiß nicht") - 0.2)} />
      <Kn x={1500} y={660} w={640} h={120} t="gespeichert: nichts" ic="trash" f={C.green} size={46} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 4 Deine Kamera, nur mit Einverstandenen
const KameraS = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tn = word(0, "nur mit Menschen");
  const P = [[C.green, "einverstanden", true], [C.green, "einverstanden", true], [C.mute, "nicht im Bild", false]];
  return (
    <Szene titel="Deine Kamera" tiefe={["camera", 1500, 640, 800]}>
      <Kachel x={110} y={260} w={560} h={470} ic="camera" t="Deine eigene Kamera" f={C.blue} a={o(0.4)} ics={150} size={48} />
      <Panel x={760} y={260} w={1070} h={470} a={o(tn - 0.3)} />
      {P.map(([f, lab, ok], i) => (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: 830 + i * 340, top: 310, opacity: o(tn + i * 0.4) }}><Bg name="user" size={220} color={f} /></div>
          <Mark x={830 + i * 340 + 65} y={560} ok={ok} size={90} a={ease(t, tn + i * 0.4 + 0.4, tn + i * 0.4 + 0.8)} />
          <Lbl x={810 + i * 340} y={665} w={260} t={lab} size={30} color={f} align="center" a={o(tn + i * 0.4 + 0.3)} />
        </React.Fragment>
      ))}
      <Kn x={960} y={880} w={1300} h={110} t="nur mit Menschen, die einverstanden sind" ic="users" f={C.green} size={46} a={o(word(0, "einverstanden"))} />
    </Szene>
  );
};

// ---------- 5 Die Grenzen: vier Gesichter, der Rahmen geht verloren
const Grenzen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const T = [["normal", {}, 0], ["Maske", { maske: true }, word(0, "Maske")], ["Gegenlicht", { dunkel: true }, word(0, "Gegenlicht")], ["stark geneigt", { rot: 55 }, word(0, "Neigung")]];
  return (
    <Szene titel="Die Grenzen" tiefe={["alert", 1500, 640, 800]}>
      {T.map(([n, p, ta], i) => {
        const x = 110 + i * 440, verloren = i > 0 && t > ta + 0.9;
        return (
          <React.Fragment key={n}>
            <Panel x={x} y={250} w={400} h={470} a={o(0.3 + i * 0.1)} bg={p.dunkel ? "#e9e6dc" : "#15161b"} rand={verloren ? C.red : C.line} />
            <Gesicht cx={x + 200} cy={470} r={100} maske={p.maske} dunkel={p.dunkel} rot={p.rot ?? 0} a={o(0.3 + i * 0.1)} />
            <div style={{ position: "absolute", left: x + 70, top: 320, width: 260, height: 320, border: `${verloren ? 5 : 7}px ${verloren ? "dashed" : "solid"} ${verloren ? C.red : C.orange}`, borderRadius: 16, boxSizing: "border-box", opacity: verloren ? 0.45 : 1, transform: verloren ? "scale(1.04)" : "none" }} />
            <Lbl x={x} y={740} w={400} t={n} size={40} color={C.text} align="center" a={o(0.3 + i * 0.1)} />
            {i > 0 && <Lbl x={x} y={795} w={400} t="Rahmen verloren" size={34} color={C.red} align="center" a={ease(t, ta + 0.9, ta + 1.3)} />}
          </React.Fragment>
        );
      })}
      <Kn x={960} y={930} w={1300} h={100} t="An der Tür: ein Weg ohne Gesichtserkennung" ic="door" f={C.blue} size={42} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 6 Das Recht zuerst: Schichten
const Recht = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const R = [["Rechtsgrundlage", "scale"], ["Datenschutz", "lock"], ["Betriebsrat", "users"], ["Löschfristen", "trash"]];
  return (
    <Szene titel="Das Recht zuerst" tiefe={["scale", 1500, 640, 800]}>
      <Panel x={230} y={235} w={1460} h={440} rand={C.orange} a={o(0.3)} bg="#1c1710" />
      <Lbl x={230} y={255} w={1460} t="zuerst: Recht" size={44} color={C.orange} align="center" a={o(0.4)} />
      {R.map(([n, ic], i) => <Kn key={n} x={600 + (i % 2) * 720} y={410 + Math.floor(i / 2) * 140} w={660} h={110} t={n} ic={ic} f={C.orange} size={44} a={o(word(0, n.slice(0, 8)) - 0.1)} />)}
      <Pf x1={960} y1={690} x2={960} y2={760} p={ease(t, cue(0) + 5, cue(0) + 5.6)} f={C.mute} w={8} />
      <Panel x={230} y={780} w={1460} h={120} rand={C.line} a={o(0.9)} />
      <Lbl x={230} y={815} w={1460} t="danach: Technik" size={44} color={C.mute} align="center" a={o(0.9)} />
      <Kn x={960} y={965} w={700} h={70} t="keine Rechtsberatung" ic="info" f={C.mute} size={34} a={o(cue(1))} />
    </Szene>
  );
};

export default { tuer: Tuer, unterschied: Unterschied, rahmen: Rahmen, kamera: KameraS, grenzen: Grenzen, recht: Recht };
