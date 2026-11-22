import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Zettel, Pf, MONO, Etikett, Mark, Zeile } from "../neu.jsx";

const STEP = ["Kartons packen", "Transporter buchen", "Strom ummelden", "Schlüssel übergeben"];
const WEITER = ["Aufruf: Kalender", "Ergebnis: frei", "Aufruf: Mail", "Ergebnis: gesendet", "Aufruf: Tickets", "Ergebnis: 3 offen"];
const SLIPS = [...STEP, ...WEITER];
const FARBEN = [C.blue, C.blue, C.blue, C.blue, C.orange, C.green, C.orange, C.green, C.orange, C.green];

// Schrittkarten, die zum Stapel werden (Anker über vier Szenen)
// u: 0 = vier Karten, 1 = Stapel; n = Anzahl Zettel; k = Zusammenfassen (0..1); an = Einblendzeiten der ersten vier
function Karten({ u = 0, n = 4, k = 0, an = [1, 1, 1, 1], nr = true }) {
  return (
    <>
      {SLIPS.slice(0, Math.max(4, Math.ceil(n))).map((s, i) => {
        const kartenY = 305 + i * 148, BASE = 950 - 70, PITCH = 76;
        const sy = i < 4 ? BASE - (3 - i) * PITCH : BASE - i * PITCH;
        const y = lerp(i < 4 ? kartenY : sy, sy, i < 4 ? u : 1);
        const h = lerp(130, 70, i < 4 ? u : 1);
        const ziel = BASE;
        const yy = lerp(y, ziel, k);
        const a = i < 4 ? an[i] : Math.min(1, n - i);
        const op = i === 0 ? a : a * (1 - k);
        return (
          <div key={i} style={{ position: "absolute", left: 90, top: yy, width: 840, height: h, borderRadius: lerp(24, 16, u), background: C.panel2, border: `3px solid ${FARBEN[i]}`, opacity: op, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 22, padding: `0 ${lerp(30, 20, u)}px`, transform: `translateX(${(1 - a) * -40}px)` }}>
            {i < 4 && <div style={{ width: lerp(64, 40, u), height: lerp(64, 40, u), borderRadius: 40, background: C.blue, color: "#000", fontSize: lerp(40, 28, u), fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{i + 1}</div>}
            <div style={{ fontSize: lerp(54, 42, u), fontWeight: 700, color: i < 4 ? C.text : FARBEN[i], whiteSpace: "nowrap" }}>{s}</div>
          </div>
        );
      })}
    </>
  );
}

// ---------- 1 Zerlegen
const Anker1 = () => { const { t, cue, word } = useCues(); const w = ["Kartons", "Transporter", "Strom", "Schlüssel"]; return <Karten an={w.map((x) => ease(t, word(1, x) - 0.1, word(1, x) + 0.5))} />; };
const Umzug = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const z = ease(t, cue(0) + 1.4, cue(0) + 2.4);
  return (
    <Szene titel="Zerlegen" tiefe={["list", 1500, 640, 800]} anker={<Anker1 />}>
      <Lbl x={90} y={225} w={840} t="Vier kleine Schritte" size={56} weight={800} color={C.blue} a={o(cue(1))} />
      <div style={{ position: "absolute", left: 1010, top: 215, width: 820, height: 760, borderRadius: 28, background: C.panel, border: `3px solid ${C.orange}`, opacity: o(0.3), boxSizing: "border-box" }}>
        <div style={{ position: "absolute", left: 230, top: 120, transform: `scale(${lerp(1, 0.92, z)})` }}><Icon name="box" size={360} color={C.orange} sw={1.2} /></div>
        <Lbl x={0} y={520} w={820} t="Umzug" size={150} weight={800} align="center" />
        <Lbl x={0} y={680} w={820} t="eine große Aufgabe" size={50} align="center" color={C.mute} />
      </div>
      <Pf x1={995} y1={595} x2={950} y2={595} p={ease(t, cue(1), cue(1) + 0.6)} f={C.orange} w={8} />
      <Etikett x={90} y={915} t="Auch ein Agent zerlegt zuerst" f={C.blue} size={44} a={o(cue(2) - 0.2)} />
    </Szene>
  );
};

// ---------- 2 Plan oder reagieren
const Anker2 = () => <Karten />;
const Plan = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ang = (t - cue(0)) * 60;
  const kn = [["Nachsehen", "search", -90], ["Entscheiden", "bulb", 30], ["Kochen", "zap", 150]];
  const pos = (d) => [1420 + 170 * Math.cos(d * Math.PI / 180), 630 + 170 * Math.sin(d * Math.PI / 180)];
  const run = Math.floor(Math.max(0, t - cue(0) - 0.5) / 1.6);
  return (
    <Szene titel="Plan oder reagieren" tiefe={["fork", 1500, 640, 800]} anker={<Anker2 />}>
      <Lbl x={90} y={225} w={840} t="Rezept: erst planen" size={56} weight={800} color={C.green} a={o(cue(0))} />
      <Lbl x={1010} y={225} w={820} t="Kühlschrank: neu entscheiden" size={56} weight={800} color={C.orange} a={o(cue(1) - 0.2)} />
      <Panel x={1010} y={305} w={820} h={640} r={28} a={o(cue(1) - 0.2)} rand={C.orange} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o(cue(1) - 0.1) }}>
        <circle cx={1420} cy={630} r={170} fill="none" stroke={C.line} strokeWidth="8" strokeDasharray="4 16" strokeLinecap="round" />
        <circle cx={pos(ang - 90)[0]} cy={pos(ang - 90)[1]} r="18" fill={C.orange} />
      </svg>
      {kn.map(([n, ic, d], i) => { const [x, y] = pos(d); return (
        <React.Fragment key={n}>
          <div style={{ position: "absolute", left: x - 70, top: y - 70, opacity: o(cue(1) + i * 0.3) }}><Badge name={ic} size={140} color={[C.orange, C.blue, C.green][i]} bg="#000" /></div>
          <Lbl x={i === 0 ? x + 90 : x - 130} y={i === 0 ? y - 25 : y + 85} w={i === 0 ? 300 : 260} t={n} size={44} align={i === 0 ? "left" : "center"} a={o(cue(1) + i * 0.3)} />
        </React.Fragment>
      ); })}
      <Etikett x={1210} y={880} t="Meist: eine Mischung" f={C.blue} size={46} a={o(word(1, "Meist") - 0.1)} />
    </Szene>
  );
};

// ---------- 3 Verlauf wächst
const Anker3 = () => {
  const { t, cue } = useCues();
  const n = 4 + lin(t, cue(0) + 0.6, cue(1) + 2.6, 0, 6);
  return <Karten u={ease(t, 0.1, 1.2)} n={n} />;
};
const Verlauf = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const n = 4 + lin(t, cue(0) + 0.6, cue(1) + 2.6, 0, 6);
  const f = (n - 4) / 6;
  return (
    <Szene titel="Der Verlauf wächst" tiefe={["clock", 1500, 640, 800]} anker={<Anker3 />}>
      <Lbl x={90} y={225} w={840} t="Verlauf" size={56} weight={800} color={C.blue} a={o(0.3)} />
      <Panel x={1010} y={215} w={820} h={760} r={28} a={o(0.4)} />
      <Lbl x={1010} y={250} w={820} t="Runde" size={50} align="center" color={C.mute} />
      <Lbl x={1010} y={310} w={820} t={String(Math.min(10, Math.floor(n)) - 3)} size={190} weight={800} align="center" />
      {[["Dauer", "clock", C.orange], ["Kosten", "zap", C.red]].map(([nm, ic, f2], i) => (
        <React.Fragment key={nm}>
          <Icon name={ic} size={70} color={f2} style={{ position: "absolute", left: 1050, top: 600 + i * 170 }} />
          <Lbl x={1140} y={606 + i * 170} w={250} t={nm} size={48} />
          <div style={{ position: "absolute", left: 1360, top: 612 + i * 170, width: 420, height: 48, borderRadius: 24, background: "#2c2c2e" }}><div style={{ width: 420 * (0.18 + 0.82 * f), height: 48, borderRadius: 24, background: f2 }} /></div>
        </React.Fragment>
      ))}
    </Szene>
  );
};

// ---------- 4 Notizen
const Anker4 = () => { const { t, cue } = useCues(); return <Karten u={1} n={10} k={ease(t, cue(0) + 1.2, cue(0) + 2.6)} />; };
const Notizen = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const k = ease(t, cue(0) + 1.2, cue(0) + 2.6);
  return (
    <Szene titel="Notizen" tiefe={["edit", 1500, 640, 800]} anker={<Anker4 />}>
      <Lbl x={90} y={225} w={840} t={k < 0.5 ? "10 Zeilen" : "1 Notiz"} size={56} weight={800} color={k < 0.5 ? C.red : C.green} />
      <Pf x1={950} y1={600} x2={1040} y2={600} p={ease(t, cue(0) + 1.4, cue(0) + 2.0)} f={C.orange} w={8} />
      <Zettel x={1070} y={215} w={760} h={430} a={o(cue(0) + 1.6)} rot={1.5}>
        <div style={{ fontSize: 36, color: "#6b5a2a", fontWeight: 700, marginBottom: 10 }}>Notiz</div>
        Bestellung 1042: Lieferung Donnerstag, 14 Uhr. Kunde per Mail informiert.
      </Zettel>
      {[["Dauer", "clock", C.orange], ["Kosten", "zap", C.red]].map(([nm, ic, f2], i) => (
        <React.Fragment key={nm}>
          <Icon name={ic} size={70} color={f2} style={{ position: "absolute", left: 1070, top: 720 + i * 120 }} />
          <Lbl x={1160} y={726 + i * 120} w={250} t={nm} size={48} />
          <div style={{ position: "absolute", left: 1380, top: 732 + i * 120, width: 420, height: 48, borderRadius: 24, background: "#2c2c2e" }}><div style={{ width: 420 * lerp(1, 0.2, k), height: 48, borderRadius: 24, background: f2 }} /></div>
        </React.Fragment>
      ))}
    </Szene>
  );
};

// ---------- 5 Fehler summieren sich
const PCT = [90, 81, 73, 66, 59];
const BX5 = (i) => 130 + i * 330;
const Anker5 = () => { const { t, cue } = useCues(); return <Balken />; };
const Balken = ({ u = 0, stay = false }) => {
  const { t, cue } = useCues();
  return (
    <>
      {PCT.map((p, i) => {
        const a = stay ? 1 : ease(t, cue(0) + 0.5 + i * 0.95, cue(0) + 1.1 + i * 0.95);
        const h = 560 * p / 100 * (stay ? 1 : a);
        const f = p > 80 ? C.green : p > 65 ? C.orange : C.red;
        // Morph zur Runden-Punktreihe (u = 1): Kreis 80 x 80
        const x = lerp(BX5(i), 150 + i * 100, u), w = lerp(280, 80, u), hh = lerp(h, 80, u), y = lerp(930 - h, 520, u);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: hh, borderRadius: lerp(18, 40, u), background: f, opacity: a > 0 ? 1 : 0 }} />;
      })}
    </>
  );
};
const Fehler = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Fehler summieren sich" tiefe={["alert", 1500, 640, 800]} anker={<Anker5 />}>
      <Panel x={90} y={215} w={1740} h={760} r={28} a={0.5} />
      {PCT.map((p, i) => {
        const a = ease(t, cue(0) + 0.5 + i * 0.95, cue(0) + 1.1 + i * 0.95);
        return (
          <React.Fragment key={i}>
            <Lbl x={BX5(i)} y={930 - 560 * p / 100 * a - 100} w={280} t={p + " %"} size={84} weight={800} align="center" a={a} />
            <Lbl x={BX5(i)} y={940} w={280} t={i === 0 ? "1 Schritt" : i + 1 + " Schritte"} size={38} align="center" color={C.mute} a={a} />
          </React.Fragment>
        );
      })}
      <Lbl x={130} y={238} w={1000} t="Jeder Schritt gelingt zu 90 Prozent" size={50} color={C.mute} a={o(cue(0))} />
      <Etikett x={1090} y={238} t="länger = riskanter" f={C.red} size={50} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 6 Grenzen
const Anker6 = () => { const { t, cue } = useCues(); return <Balken u={ease(t, 0.1, 1.2)} stay />; };
const Grenzen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const uhr = ease(t, cue(0) + 2.0, cue(1) + 3.5);
  const R = 150;
  return (
    <Szene titel="Grenzen" tiefe={["shield", 1500, 640, 800]} anker={<Anker6 />}>
      <Panel x={90} y={215} w={560} h={760} r={28} a={o(0.3)} rand={C.blue} />
      <Lbl x={90} y={250} w={560} t="Höchstens 5 Runden" size={46} weight={800} align="center" color={C.blue} a={o(0.4)} />
      <Lbl x={90} y={680} w={560} t="dann Schluss" size={60} weight={700} align="center" a={o(cue(0) + 1.0)} />
      <Panel x={690} y={215} w={560} h={760} r={28} a={o(cue(0) + 1.4)} rand={C.orange} />
      <Lbl x={690} y={250} w={560} t="Zeitlimit" size={56} weight={800} align="center" color={C.orange} a={o(cue(0) + 1.5)} />
      <svg style={{ position: "absolute", left: 690, top: 330, width: 560, height: 500, opacity: o(cue(0) + 1.6) }}>
        <circle cx="280" cy="250" r={R} fill="none" stroke="#2c2c2e" strokeWidth="26" />
        <circle cx="280" cy="250" r={R} fill="none" stroke={uhr > 0.85 ? C.red : C.orange} strokeWidth="26" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * R * uhr} ${2 * Math.PI * R}`} transform="rotate(-90 280 250)" />
        <text x="280" y="275" textAnchor="middle" fontSize="80" fontWeight="800" fill="#f5f5f7" fontFamily="-apple-system, system-ui, sans-serif">{Math.round(60 * (1 - uhr))} s</text>
      </svg>
      <Panel x={1290} y={215} w={540} h={760} r={28} a={o(cue(2) - 0.2)} rand={C.green} />
      <Lbl x={1290} y={250} w={540} t="Stillstand" size={56} weight={800} align="center" color={C.green} a={o(cue(2) - 0.1)} />
      <div style={{ position: "absolute", left: 1460, top: 360, opacity: o(cue(2)) }}><Badge name="user" size={200} color={C.green} glow={0.6} /></div>
      <Lbl x={1290} y={640} w={540} t="Ein Mensch fragt nach." size={52} weight={700} align="center" a={o(cue(2) + 0.4)} />
      <div style={{ position: "absolute", left: 1520, top: 760, opacity: o(cue(2) + 0.8) }}><Icon name="help" size={120} color={C.orange} /></div>
    </Szene>
  );
};

// ---------- 7 Protokoll
const ZEILEN = [["1", "kunde_suchen", "gefunden", "0,4 s", 0], ["2", "bestellung_suchen", "1042", "0,6 s", 0], ["3", "kalender", "Fehler: Zeitüberschreitung", "5,0 s", 1], ["4", "kalender", "Do frei", "0,3 s", 0], ["5", "antwort_senden", "gesendet", "1,1 s", 0]];
const Protokoll = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const such = ease(t, cue(1) + 0.4, cue(1) + 1.2);
  const COL = [90, 200, 760, 1590];
  return (
    <Szene titel="Protokoll" tiefe={["list", 1500, 640, 800]}>
      <div style={{ position: "absolute", left: 90, top: 215, width: 1740, height: 90, borderRadius: 18, background: C.panel2, opacity: o(0.3) }} />
      {[["Nr", 0, 100], ["Werkzeug", 1, 550], ["Ergebnis", 2, 800], ["Dauer", 3, 240]].map(([n, i, w]) => <Lbl key={n} x={COL[i] + 20} y={236} w={w} t={n} size={44} weight={800} color={C.mute} a={o(0.4)} />)}
      {ZEILEN.map(([nr, wz, er, d, fehler], i) => (
        <div key={nr} style={{ position: "absolute", left: 90, top: 325 + i * 118, width: 1740, height: 100, borderRadius: 18, background: fehler && such > 0.3 ? C.red + "22" : C.panel, border: `3px solid ${fehler && such > 0.3 ? C.red : C.line}`, opacity: o(cue(0) + 0.4 + i * 0.35), boxSizing: "border-box" }}>
          {[nr, wz, er, d].map((v, c) => <div key={c} style={{ position: "absolute", left: COL[c] - 90 + 20, top: 0, height: 100, display: "flex", alignItems: "center", fontSize: 46, fontWeight: 700, fontFamily: c === 1 ? MONO : undefined, color: fehler && c === 2 ? C.red : C.text, whiteSpace: "nowrap" }}>{v}</div>)}
        </div>
      ))}
      <div style={{ position: "absolute", left: 1230, top: 325 + 2 * 118 - 15 + 80 * (1 - such), opacity: such }}><Icon name="search" size={130} color={C.orange} sw={2} /></div>
      <Etikett x={90} y={925} t="Hier ging es schief: gefunden in Sekunden" f={C.orange} size={46} a={o(cue(1) + 1.0)} />
    </Szene>
  );
};

export default { umzug: Umzug, plan: Plan, verlauf: Verlauf, notizen: Notizen, fehler: Fehler, grenzen: Grenzen, protokoll: Protokoll };
