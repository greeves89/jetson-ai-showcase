import React from "react";
import { Szene, useCues, sp, ease, lerp, rnd, C } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Pf, Etikett, Mark, Zeile } from "../neu.jsx";
import { Bahn, Kn, Fl, Pt, Ic, Bg, Kachel, RX, RW, RY } from "../bausteine-betrieb.jsx";

const WEGE = [["server", "Lokal", "eigener Server", C.blue], ["cloud", "Cloud", "mieten nach Nutzung", C.orange], ["cpu", "Edge", "kleines Gerät vor Ort", C.green]];
// Anker links: die drei Wege. hl = Liste hervorgehobener Indizes, dim = andere abdunkeln
const Drei = ({ hl = [0, 1, 2], dim = 0.45, a = 1, leer = 0 }) => (
  <>
    <Panel x={90} y={215} w={560} h={760} r={28} />
    <Lbl x={90} y={236} w={560} t="Drei Wege" size={40} align="center" color={C.mute} />
    {WEGE.map(([ic, n, sub, f], i) => {
      const on = hl.includes(i);
      return (
        <div key={n} style={{ position: "absolute", left: 130, top: 300 + i * 220, width: 480, height: 190, borderRadius: 24, background: on ? f + "22" : C.panel2, border: `${on ? 5 : 3}px solid ${on ? f : C.line}`, boxSizing: "border-box", opacity: a * (on ? 1 : dim), display: "flex", alignItems: "center", gap: 24, padding: "0 28px", boxShadow: on && hl.length < 3 ? `0 0 40px ${f}55` : "none" }}>
          <Ic name={ic} size={96} color={on ? f : C.text} sw={1.6} />
          <div style={{ lineHeight: 1.1 }}><div style={{ fontSize: 56, fontWeight: 800 }}>{n}</div><div style={{ fontSize: 33, color: C.mute, fontWeight: 600, marginTop: 6 }}>{sub}</div></div>
        </div>
      );
    })}
  </>
);

// ---------- 1 Wege
const Wege = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const R = [["Kaufen", "lock", word(0, "Lokal")], ["Mieten", "calendar", word(0, "Cloud")], ["Dort, wo die Daten entstehen", "camera", word(0, "Edge")]];
  const S = [["Datenschutz", C.blue], ["Leistung", C.orange], ["Reaktionszeit", C.green]];
  return (
    <Szene titel="Kaufen, mieten, Taxi fahren" tiefe={["truck", 1500, 640, 800]} anker={<Drei hl={t < R[0][2] ? [0, 1, 2] : [t < R[1][2] ? 0 : t < R[2][2] ? 1 : 2]} dim={t < R[0][2] ? 1 : 0.4} />}>
      {R.map(([n, ic, ts], i) => <Kn key={n} x={RX + 330} y={300 + i * 220 + 95 - 5} w={640} h={130} t={n} ic={ic} f={WEGE[i][3]} size={40} a={o(ts - 0.3)} />)}
      {S.map(([n, f], i) => <Chip key={n} x={RX + 700} y={300 + i * 220 + 55} t={n} f={f} size={42} a={o(cue(1) + 0.3 + i * 0.5)} />)}
      <Etikett x={RX + 130} y={925} t="Keiner gewinnt in allem" f={C.mute} size={50} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 2 Kostenblöcke
const Bloecke = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tp = word(1, "Personal");
  return (
    <Szene titel="Woraus Kosten bestehen" tiefe={["receipt", 1500, 640, 800]} anker={<Drei dim={1} />}>
      <Kn x={RX + 330} y={RY + 100} w={640} h={140} t="Hardware, Cloud-Preis" ic="euro" f={C.orange} size={44} a={o(0.5)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <path d={`M${RX} ${RY + 260} q 70 -30 141 0 t 141 0 t 141 0 t 141 0 t 141 0 t 141 0 t 141 0 t 141 0`} fill="none" stroke={C.blue} strokeWidth="6" strokeLinecap="round" opacity={o(0.8)} />
      </svg>
      <Fl x={RX} y={RY + 320} w={540} h={400} f={C.red} a={o(tp - 0.3)} r={24} />
      <Fl x={RX + 590} y={RY + 320} w={540} h={290} f={C.red} a={o(word(1, "Datenpflege") - 0.3)} r={24} />
      <div style={{ position: "absolute", left: RX + 160, top: RY + 410, opacity: o(tp) }}><Ic name="users" size={200} color={C.red} sw={1.4} /></div>
      <Lbl x={RX} y={RY + 640} w={540} t="Personal" size={56} weight={800} align="center" a={o(tp)} />
      <div style={{ position: "absolute", left: RX + 750, top: RY + 380, opacity: o(word(1, "Datenpflege")) }}><Ic name="database" size={160} color={C.red} sw={1.4} /></div>
      <Lbl x={RX + 590} y={RY + 550} w={540} t="Datenpflege" size={52} weight={800} align="center" a={o(word(1, "Datenpflege"))} />
      <Lbl x={RX + 590} y={RY + 650} w={540} t="oft unterschätzt" size={40} color={C.mute} weight={600} align="center" a={o(word(1, "unterschätzt"))} />
    </Szene>
  );
};

// ---------- 3 Annahmen
const Annahmen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const K = [["zap", "15 Watt", "Aufnahme im Mittel", word(1, "15 Watt")], ["clock", "24 Stunden", "Laufzeit pro Tag", word(1, "24 Stunden")], ["euro", "0,30 Euro", "je Kilowattstunde", word(1, "Eine Kilo")]];
  return (
    <Szene titel="Drei Annahmen" tiefe={["grid", 1500, 640, 800]} anker={<Drei hl={[2]} />}>
      <Etikett x={RX} y={RY + 10} t="Annahmen, ersetze sie durch deine" f={C.orange} size={46} a={o(0.5)} />
      {K.map(([ic, w, sub, ts], i) => <Kachel key={w} x={RX + i * 385} y={RY + 150} w={360} h={440} ic={ic} t={w} sub={sub} f={C.blue} a={o(ts - 0.3)} ics={130} size={54} />)}
      <Lbl x={RX} y={RY + 650} w={RW} t="Nur zum Rechnen: nimm den Wert deiner Stromrechnung." size={42} color={C.mute} weight={600} a={o(word(1, "Eine Kilo") + 1.4)} />
    </Szene>
  );
};

// ---------- 4 Strom
const Strom = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const B = [["15 W × 24 h", "", word(0, "15 Watt"), C.blue], ["360 Wh", "", word(0, "360"), C.blue], ["0,36 kWh", "pro Tag", word(0, "0,36"), C.blue], ["rund 39 €", "pro Jahr", word(0, "rund 39"), C.green]];
  return (
    <Szene titel="Die Stromrechnung" tiefe={["zap", 1500, 640, 800]} anker={<Drei hl={[2]} />}>
      {B.map(([a, b, ts, f], i) => (
        <React.Fragment key={a}>
          <Kn x={RX + 115 + i * 300} y={RY + 150} w={230} h={200} t={a} sub={b} f={f} size={i === 0 ? 34 : 42} a={o(ts - 0.3)} />
          {i > 0 && <Pf x1={RX + 115 + (i - 1) * 300 + 118} y1={RY + 150} x2={RX + 115 + i * 300 - 118} y2={RY + 150} p={ease(t, ts - 0.5, ts - 0.1)} f={C.mute} w={7} />}
        </React.Fragment>
      ))}
      <Lbl x={RX} y={RY + 330} w={RW} t="rund 39 €" size={220} weight={800} color={C.green} align="center" a={o(word(0, "rund 39"))} />
      <Lbl x={RX} y={RY + 580} w={RW} t="Stromkosten im Jahr" size={60} color={C.mute} weight={600} align="center" a={o(word(0, "rund 39") + 0.4)} />
    </Szene>
  );
};

// ---------- 5 Vergleich
const MX = (m) => 790 + m * 60, VY = (v) => RY + 500 - v * 0.62;
const CLOUD = [[MX(0), VY(0)], [MX(14), VY(700)]];
const GER = [[MX(0), VY(500)], [MX(14), VY(500 + 3.3 * 14)]];
const Vergleich = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const pc = ease(t, 0.4, cue(1) - 0.2), pg = ease(t, word(0, "das Gerät"), word(0, "das Gerät") + 1.2);
  const tx = word(1, "knapp");
  return (
    <Szene titel="Der Vergleich" tiefe={["target", 1500, 640, 800]} anker={<Drei hl={[1, 2]} />}>
      <Panel x={RX} y={RY} w={RW} h={600} a={o(0.3)} />
      <Lbl x={RX + 30} y={RY + 16} w={600} t="Kosten insgesamt" size={40} color={C.mute} a={o(0.5)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <line x1={760} y1={RY + 520} x2={1790} y2={RY + 520} stroke={C.line} strokeWidth="5" strokeLinecap="round" />
        <text x={1790} y={RY + 570} fill={C.mute} fontSize="34" textAnchor="end" fontWeight="600">Monate</text>
        {(() => { const m = 10.7, x = MX(m), y = VY(500 + 3.3 * m); return <g opacity={ease(t, tx, tx + 0.5)}><circle cx={x} cy={y} r="26" fill="none" stroke={C.text} strokeWidth="6" /><line x1={x} y1={y + 26} x2={x} y2={RY + 520} stroke={C.text} strokeWidth="4" strokeDasharray="8 8" /></g>; })()}
      </svg>
      <Bahn pts={CLOUD} p={pc} f={C.orange} w={9} />
      <Bahn pts={GER} p={pg} f={C.green} w={9} />
      <Etikett x={MX(0.3)} y={VY(330)} t="Cloud: 50 € je Monat" f={C.orange} size={34} a={o(0.9)} />
      <Etikett x={MX(0.2)} y={VY(660)} t="Gerät: 500 € Anschaffung" f={C.green} size={38} a={o(word(0, "das Gerät"))} />
      <Etikett x={MX(7.4)} y={VY(130)} t="gleichauf nach 10,7 Monaten" f={C.text} size={34} a={o(tx)} />
      <Kn x={RX + 565} y={RY + 700} w={1130} h={120} t="Noch nicht eingerechnet: Personal und Wartung" ic="alert" f={C.red} size={44} a={o(word(1, "ohne Personal") - 0.2)} />
    </Szene>
  );
};

// ---------- 6 Vergessen
const Vergessen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tg = cue(1);
  return (
    <Szene titel="Was man gern vergisst" tiefe={["clock", 1500, 640, 800]} anker={<Drei hl={[2]} />}>
      <Lbl x={RX} y={RY + 10} w={RW} t="Fitnessstudio-Vertrag" size={52} weight={800} a={o(0.4)} />
      {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: RX + i * 94, top: RY + 100, width: 80, height: 100, borderRadius: 16, background: C.red + "22", border: `3px solid ${C.red}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", opacity: o(0.6 + i * 0.12) }}><Ic name="euro" size={46} color={C.red} /></div>)}
      <Lbl x={RX} y={RY + 220} w={RW} t="jeden Monat, auch ohne Besuch" size={44} color={C.mute} weight={600} a={o(0.7 + 1.2)} />
      <Kn x={RX + 280} y={RY + 440} w={500} h={150} t="kaum genutzt" ic="cpu" f={C.mute} size={46} a={o(tg - 0.2)} />
      <div style={{ position: "absolute", left: RX + 560, top: RY + 410, width: 560, height: 60, borderRadius: 30, background: C.panel2, opacity: o(tg) }} />
      <div style={{ position: "absolute", left: RX + 560, top: RY + 410, width: 560 * 0.12, height: 60, borderRadius: 30, background: C.green, opacity: o(tg) }} />
      <Lbl x={RX + 560} y={RY + 485} w={560} t="Auslastung" size={38} color={C.mute} a={o(tg)} />
      {Array.from({ length: 12 }).map((_, i) => <div key={i} style={{ position: "absolute", left: RX + i * 94, top: RY + 620, width: 80, height: 100, borderRadius: 16, background: C.red + "22", border: `3px solid ${C.red}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", opacity: o(tg + 0.4 + i * 0.1) }}><Ic name="euro" size={46} color={C.red} /></div>)}
    </Szene>
  );
};

// ---------- 7 Fragen
const FR = [["lock", "Datenschutz", "Datenschutz"], ["timer", "Tempo", "Tempo"], ["chart", "Last", "Last"], ["cpu", "Modellgröße", "Modellgröße"], ["users", "Betreuung", "Betreuung"], ["alert", "Ausfall", "Ausfall"]];
const Fragen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Sechs Fragen" tiefe={["help", 1500, 640, 800]} anker={<Drei />}>
      {FR.map(([ic, n, w], i) => <Kachel key={n} x={RX + (i % 3) * 385} y={RY + Math.floor(i / 3) * 280} w={360} h={250} ic={ic} t={n} f={[C.blue, C.orange, C.green][i % 3]} a={o(word(0, w) - 0.2)} ics={90} size={42} />)}
      <Kn x={RX + 565} y={RY + 680} w={1130} h={140} t="Gesamte Laufzeit, Annahmen offen" ic="calendar" f={C.green} size={52} a={o(cue(1))} />
    </Szene>
  );
};

export default { wege: Wege, bloecke: Bloecke, annahmen: Annahmen, strom: Strom, vergleich: Vergleich, vergessen: Vergessen, fragen: Fragen };
