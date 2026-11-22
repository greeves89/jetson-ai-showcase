import React from "react";
import { Szene, useCues, sp, ease, lerp, rnd, C } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Pf, Etikett, Mark, Zeile, Zettel } from "../neu.jsx";
import { Bahn, Kn, Fl, Pt, Ic, Bg, Kachel, RX, RW, RY } from "../bausteine-betrieb.jsx";

const ST = [["database", "Daten", C.blue], ["network", "Training", C.blue], ["clip", "Prüfung", C.green], ["rocket", "Auslieferung", C.orange], ["activity", "Überwachung", C.orange], ["refresh", "Nachlernen", C.blue]];
const KX = 370, KY = 610, KR = 200;
const kp = (deg) => [KX + KR * Math.cos((deg * Math.PI) / 180), KY + KR * Math.sin((deg * Math.PI) / 180)];

// Anker links: der Kreislauf. hl = Index der hervorgehobenen Station, run = Winkel des laufenden Punktes
const Kreis = ({ hl = -1, run = null, alarm = 0, n = 6 }) => (
  <>
    <Panel x={90} y={215} w={560} h={760} r={28} />
    <Lbl x={90} y={236} w={560} t="Betrieb" size={40} align="center" color={C.mute} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
      <circle cx={KX} cy={KY} r={KR} fill="none" stroke={C.line} strokeWidth="8" strokeDasharray="4 16" strokeLinecap="round" />
      {run != null && (() => { const [x, y] = kp(run); return <circle cx={x} cy={y} r="14" fill={C.orange} />; })()}
    </svg>
    {ST.map(([ic, nm, f], i) => { const [x, y] = kp(-90 + i * 60); const on = hl === i; return (
      <div key={nm} style={{ position: "absolute", left: x - 56, top: y - 56, width: 112, height: 112, borderRadius: 56, background: on ? f + "33" : C.panel2, border: `${on ? 6 : 3}px solid ${on ? f : C.line}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: on ? `0 0 40px ${f}88` : "none", transform: `scale(${on ? 1.12 : 1})` }}><Ic name={ic} size={56} color={on ? f : C.text} /></div>
    ); })}
    <Lbl x={KX - 110} y={KY - 28} w={220} t={hl >= 0 ? ST[hl][1] : "Modell"} size={hl >= 0 ? 38 : 50} weight={800} align="center" color={hl >= 0 ? ST[hl][2] : C.text} />
  </>
);
const KR_ = (t, from = 0) => ((t - from) * 40 - 90);

// ---------- 1 Küche
const Kueche = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Die Restaurantküche" tiefe={["store", 1500, 640, 800]} anker={<Kreis run={KR_(t)} />}>
      <Kachel x={RX} y={RY + 20} w={540} h={400} ic="edit" t="Zu Hause" sub="darf schiefgehen" f={C.mute} a={o(0.5)} ics={120} size={52} />
      <Kachel x={RX + 590} y={RY + 20} w={540} h={400} ic="store" t="Restaurantküche" sub="jeden Abend gleich gut" f={C.orange} a={o(word(0, "In der"))} ics={120} size={52} />
      <Kn x={RX + 270} y={RY + 600} w={540} h={150} t="Versuch" ic="bulb" f={C.mute} size={56} a={o(cue(1))} />
      <Pf x1={RX + 570} y1={RY + 600} x2={RX + 650} y2={RY + 600} p={ease(t, cue(1) + 0.6, cue(1) + 1.1)} f={C.mute} w={7} />
      <Kn x={RX + 920} y={RY + 600} w={420} h={150} t="Betrieb" ic="rocket" f={C.orange} size={56} a={o(cue(1) + 0.8)} />
    </Szene>
  );
};

// ---------- 2 Kreislauf
const Lauf = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const W = ["Daten,", "Training,", "Prüfung,", "Auslieferung,", "Überwachung,", "Nachlernen."].map((w) => word(0, w));
  const idx = W.reduce((a, w, i) => (t >= w ? i : a), -1);
  const tp = word(2, "Prüfen");
  const hl = t >= tp ? 2 : idx;
  return (
    <Szene titel="Der Kreislauf" tiefe={["repeat", 1500, 640, 800]} anker={<Kreis hl={t > cue(1) && t < tp ? -1 : hl} run={t > cue(1) && t < tp ? KR_(t, cue(1)) : null} />}>
      {ST.map(([ic, n, f], i) => <Kn key={n} x={RX + 280 + (i % 2) * 570} y={RY + 100 + Math.floor(i / 2) * 170} w={540} h={130} t={n} ic={ic} f={f} size={50} a={o(W[i] - 0.2)} />)}
      <Etikett x={RX + 130} y={RY + 540} t="ein Kreis, kein einmaliger Weg" f={C.orange} size={54} a={o(cue(1))} />
      <Kn x={RX + 565} y={RY + 690} w={1130} h={130} t="Prüfen: an Daten, die das Modell nie sah" ic="eye" f={C.green} size={44} a={o(tp)} />
    </Szene>
  );
};

// ---------- 3 Drift
const QX = (i) => 760 + i * 12, QY = (i) => RY + 110 + (i < 28 ? 0 : (i - 28) * 4.6) + (rnd(i * 2.1) - 0.5) * 16;
const QP = Array.from({ length: 85 }, (_, i) => [QX(i), QY(i)]);
const Drift = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const p = ease(t, 0.5, cue(1) + 6.5);
  const tl = word(1, "Neues Licht"), tf = word(1, "Lieferant"), tq = word(1, "sinkt");
  return (
    <Szene titel="Drift" tiefe={["trend", 1500, 640, 800]} anker={<Kreis hl={t > tq ? 4 : -1} />}>
      <Panel x={RX} y={RY} w={RW} h={560} a={o(0.3)} />
      <Lbl x={RX + 30} y={RY + 20} w={500} t="Qualität" size={44} color={C.mute} a={o(0.5)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <line x1={740} y1={RY + 520} x2={1790} y2={RY + 520} stroke={C.line} strokeWidth="5" strokeLinecap="round" />
        <line x1={QX(28)} y1={RY + 70} x2={QX(28)} y2={RY + 520} stroke={C.orange} strokeWidth="4" strokeDasharray="10 10" opacity={ease(t, tl, tl + 0.5)} />
        <line x1={QX(52)} y1={RY + 70} x2={QX(52)} y2={RY + 520} stroke={C.orange} strokeWidth="4" strokeDasharray="10 10" opacity={ease(t, tf, tf + 0.5)} />
      </svg>
      <Bahn pts={QP} p={p} f={C.text} w={7} />
      <div style={{ position: "absolute", left: QX(28) - 40, top: RY + 395, opacity: o(tl) }}><Bg name="sun" size={80} color={C.orange} /></div>
      <div style={{ position: "absolute", left: QX(52) - 40, top: RY + 395, opacity: o(tf) }}><Bg name="package" size={80} color={C.orange} /></div>
      <Lbl x={RX + 30} y={RY + 450} w={400} t="Training" size={36} color={C.mute} a={o(0.7)} />
      <Kn x={RX + 280} y={RY + 680} w={500} h={130} t="Drift" ic="trend" f={C.orange} size={64} a={o(word(1, "Drift"))} />
      <Lbl x={RX + 580} y={RY + 640} w={550} t="schleichend, oft unbemerkt" size={44} color={C.mute} weight={600} a={o(word(1, "Drift") + 0.6)} />
    </Szene>
  );
};

// ---------- 4 Armaturenbrett
const Tacho = ({ x, y, w, f, nadel, a, ic, name }) => {
  const cx = x + w / 2, cy = y + 260, r = 140;
  const arc = (a0, a1, col) => { const p = (d) => [cx + r * Math.cos((d * Math.PI) / 180), cy + r * Math.sin((d * Math.PI) / 180)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return <path d={`M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`} fill="none" stroke={col} strokeWidth="22" strokeLinecap="butt" />; };
  const ang = lerp(180, 360, nadel);
  return (
    <div style={{ opacity: a }}>
      <Panel x={x} y={y} w={w} h={470} rand={nadel > 0.8 ? C.red : C.line} />
      <div style={{ position: "absolute", left: x + 24, top: y + 20 }}><Ic name={ic} size={56} color={C.mute} /></div>
      <Lbl x={x + 90} y={y + 30} w={w - 100} t={name} size={34} color={C.text} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {arc(180, 240, C.green)}{arc(240, 300, C.orange)}{arc(300, 360, C.red)}
        <line x1={cx} y1={cy} x2={cx + (r - 22) * Math.cos((ang * Math.PI) / 180)} y2={cy + (r - 22) * Math.sin((ang * Math.PI) / 180)} stroke={C.text} strokeWidth="9" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="14" fill={C.text} />
      </svg>
      <Lbl x={x} y={y + 340} w={w} t={nadel > 0.8 ? "Alarm" : "in Ordnung"} size={46} weight={800} align="center" color={nadel > 0.8 ? C.red : C.green} />
    </div>
  );
};
const Brett = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tb = word(1, "Bescheid"), tw = word(1, "was du");
  return (
    <Szene titel="Das Armaturenbrett" tiefe={["gauge", 1500, 640, 800]} anker={<Kreis hl={4} />}>
      <Tacho x={RX} y={RY} w={360} f={C.green} nadel={0.12 + 0.03 * Math.sin(t * 3)} a={o(0.4)} ic="zap" name="Läuft es?" />
      <Tacho x={RX + 385} y={RY} w={360} f={C.green} nadel={0.3 + 0.03 * Math.sin(t * 2.4)} a={o(0.7)} ic="timer" name="Schnell genug?" />
      <Tacho x={RX + 770} y={RY} w={360} f={C.red} nadel={0.2 + 0.72 * ease(t, tb - 1.2, tb + 0.2)} a={o(1.0)} ic="target" name="Noch richtig?" />
      <Kn x={RX + 260} y={RY + 640} w={500} h={130} t="Vorher festlegen" ic="flag" f={C.blue} size={46} a={o(tw)} />
      <Pf x1={RX + 520} y1={RY + 640} x2={RX + 620} y2={RY + 640} p={ease(t, tb - 0.6, tb - 0.1)} f={C.mute} w={7} />
      <Kn x={RX + 900} y={RY + 640} w={430} h={130} t="Bescheid" ic="bell" f={C.red} size={52} a={o(tb)} />
      <Lbl x={RX} y={RY + 540} w={RW} t="Was beobachtest du, und ab wann meldet sich jemand?" size={40} color={C.mute} weight={600} a={o(tw + 1.2)} align="center" />
    </Szene>
  );
};

// ---------- 5 Versionen
const Version = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tz = word(1, "zurück");
  const back = ease(t, tz, tz + 0.8);
  const neu = (i) => i >= 8 && back < 0.5;
  return (
    <Szene titel="Versionen und Rückfall" tiefe={["layers", 1500, 640, 800]} anker={<Kreis hl={3} />}>
      <Panel x={RX} y={RY} w={RW} h={440} a={o(0.3)} />
      {Array.from({ length: 10 }).map((_, i) => <div key={i} style={{ position: "absolute", left: RX + 40 + i * 106, top: RY + 120, opacity: o(0.5 + i * 0.1) }}><Bg name="user" size={90} color={neu(i) && t > cue(0) + 1.2 ? C.blue : C.mute} /></div>)}
      <Lbl x={RX + 40} y={RY + 20} w={700} t="Nutzer" size={42} color={C.mute} a={o(0.5)} />
      <Kn x={RX + 330} y={RY + 330} w={520} h={110} t="alte Version" ic="box" f={C.mute} size={42} a={o(cue(0) + 0.8)} />
      <Kn x={RX + 900} y={RY + 330} w={380} h={110} t="neue Version" ic="sparkles" f={C.blue} size={42} a={o(cue(0) + 1.2)} />
      <Kn x={RX + 270} y={RY + 600} w={500} h={140} t="Qualität sinkt" ic="trend" f={C.red} size={46} a={o(cue(1) - 0.2)} />
      <Pf x1={RX + 530} y1={RY + 600} x2={RX + 640} y2={RY + 600} p={ease(t, tz - 0.4, tz + 0.1)} f={C.mute} w={7} />
      <Kn x={RX + 880} y={RY + 600} w={470} h={140} t="Rückfall" ic="undo" f={C.green} size={52} a={o(tz)} />
    </Szene>
  );
};

// ---------- 6 Verantwortung
const Verantw = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ts = cue(1);
  return (
    <Szene titel="Verantwortung und Dokumentation" tiefe={["userCheck", 1500, 640, 800]} anker={<Kreis hl={-1} run={KR_(t)} />}>
      <Kn x={RX + 235} y={RY + 190} w={470} h={190} t="Besitzt" ic="userCheck" f={C.blue} size={60} a={o(word(0, "besitzt") - 0.3)} />
      <Kn x={RX + 235} y={RY + 470} w={470} h={190} t="Betreibt" ic="wrench" f={C.green} size={60} a={o(word(0, "betreibt") - 0.3)} />
      <Zettel x={RX + 520} y={RY + 10} w={610} h={730} rot={1.5} a={o(ts - 0.2)}>
        <div style={{ fontSize: 52, fontWeight: 800, marginBottom: 20 }}>Steckbrief</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 30, opacity: o(word(1, "was es kann")) }}><Ic name="check" size={64} color="#1f7a3a" sw={3} /><div style={{ fontSize: 46, fontWeight: 700 }}>Was es kann</div></div>
        {[0, 1, 2].map((i) => <div key={i} style={{ height: 20, borderRadius: 10, background: "#c9bb8a", width: [440, 380, 300][i], marginTop: 24, opacity: o(word(1, "was es kann") + 0.3) }} />)}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 70, opacity: o(word(1, "wo es irrt")) }}><Ic name="alert" size={64} color="#b4560a" sw={3} /><div style={{ fontSize: 46, fontWeight: 700 }}>Wo es irrt</div></div>
        {[0, 1, 2].map((i) => <div key={i} style={{ height: 20, borderRadius: 10, background: "#c9bb8a", width: [420, 340, 400][i], marginTop: 24, opacity: o(word(1, "wo es irrt") + 0.3) }} />)}
      </Zettel>
    </Szene>
  );
};

// ---------- 7 Jetson
const Jetson = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Auf dem Jetson" tiefe={["cpu", 1500, 640, 800]} anker={<Kreis hl={-1} run={KR_(t)} />}>
      <div style={{ position: "absolute", left: RX + 20, top: RY + 60, opacity: o(0.4) }}><Bg name="cpu" size={300} color={C.blue} /></div>
      <Kn x={RX + 800} y={RY + 100} w={640} h={120} t="Wenig Speicher" ic="database" f={C.orange} size={46} a={o(word(0, "wenig Speicher") - 0.2)} />
      <Kn x={RX + 800} y={RY + 250} w={640} h={120} t="Wenig Watt" ic="zap" f={C.orange} size={46} a={o(word(0, "wenig Watt") - 0.2)} />
      <Kn x={RX + 800} y={RY + 400} w={640} h={120} t="Meist ein Modell zur Zeit" ic="box" f={C.orange} size={46} a={o(word(0, "meist ein") - 0.2)} />
      <Kn x={RX + 565} y={RY + 640} w={1130} h={150} t="Dafür bleiben die Daten am Gerät" ic="lock" f={C.green} size={54} a={o(cue(1))} />
    </Szene>
  );
};

export default { kueche: Kueche, kreis: Lauf, drift: Drift, armaturenbrett: Brett, versionen: Version, verantwortung: Verantw, jetson: Jetson };
