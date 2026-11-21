import React from "react";
import { Panel, Lbl } from "../bausteine.jsx";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, Pill, Pfeil, Pfad, C, spitze } from "../lib.jsx";

const Einstieg = () => {
  const { t, cue, word } = useCues();
  const a = sp(t, cue(0), 1.1);
  return (
    <Szene titel="" kopf={false}>
      <div style={{ position: "absolute", left: 120, top: 120, fontSize: 40, fontWeight: 600, color: C.blue }}>
        <Rv at={0.1}>Was ist KI?</Rv>
      </div>
      <div style={{ position: "absolute", left: 110, top: 210, fontSize: 420, fontWeight: 800, letterSpacing: -14, lineHeight: 1, opacity: Math.min(1, a * 1.5), transform: `scale(${lerp(0.92, 1, a)})`, transformOrigin: "left center" }}>
        <span style={{ background: `linear-gradient(90deg, ${C.text}, ${C.blue})`, WebkitBackgroundClip: "text", color: "transparent" }}>KI</span>
      </div>
      <Txt at={cue(0) + 0.5} x={126} y={720} w={800} size={60} color={C.mute} weight={500}>künstliche Intelligenz</Txt>
      {/* rechts: Maschine löst Aufgabe */}
      <Rv at={cue(1)} dx={60} style={{ position: "absolute", left: 1090, top: 260 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Badge name="cpu" size={150} />
          <div><div style={{ fontSize: 44, fontWeight: 700 }}>Maschine</div><div style={{ fontSize: 40, color: C.mute }}>löst</div></div>
        </div>
      </Rv>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <Pfad d="M1165 430 L1165 560" p={sp(t, cue(1) + 1.6, 0.8)} color={C.blue} w={6} head={spitze(1165, 430, 1165, 560, 20)} />
      </svg>
      <Rv at={word(1, "für die")} dx={60} style={{ position: "absolute", left: 1090, top: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Badge name="bulb" size={150} color={C.green} />
          <div style={{ width: 520 }}>
            <div style={{ fontSize: 44, fontWeight: 700 }}>Aufgabe</div>
            <div style={{ fontSize: 40, color: C.mute, lineHeight: 1.3 }}>für die sonst Intelligenz nötig wäre</div>
          </div>
        </div>
      </Rv>
    </Szene>
  );
};

const Faehigkeiten = () => {
  const { t, cue, word } = useCues();
  const spalten = [
    { n: "eye", v: "Wahrnehmen", e: "Ein Foto erkennen", w: "wahrnehmen", ew: "Foto" },
    { n: "message", v: "Verstehen", e: "Einen Satz verstehen", w: "verstehen", ew: "Satz" },
    { n: "fork", v: "Entscheiden", e: "Einen Zug wählen", w: "entscheiden", ew: "Zug" },
    { n: "sparkles", v: "Erzeugen", e: "Einen Text schreiben", w: "erzeugen", ew: "Text" },
  ];
  return (
    <Szene titel="Vier Fähigkeiten" tiefe={["eye",1400,660,900]} fokus={[1,960,615]} sub="Was ein KI-System dafür können muss">
      {spalten.map((s, i) => {
        const cx = 330 + i * 420, t0 = word(0, s.w), t1 = word(1, s.ew) - 0.2;
        return (
          <React.Fragment key={s.v}>
            <Rv at={t0} dy={30} style={{ position: "absolute", left: cx - 125, top: 400 }}><Badge name={s.n} size={250} glow={sp(t, t1, 1)} /></Rv>
            <Txt at={t0 + 0.1} x={cx - 200} y={640} w={400} size={50} weight={700} align="center">{s.v}</Txt>
            <Txt at={t1} x={cx - 200} y={775} w={400} size={44} color={C.mute} align="center">{s.e}</Txt>
            {i > 0 && <Pfeil x1={cx - 420 + 140} y1={525} x2={cx - 140} y2={525} p={sp(t, t0 - 0.2, 0.6)} color={C.line} w={4} />}
          </React.Fragment>
        );
      })}
    </Szene>
  );
};

const REGELN = ["wenn Tür offen, dann melden", "wenn Wert zu hoch, dann Alarm", "wenn Kunde neu, dann grüßen", "wenn Lager leer, dann ordern", "wenn Name fehlt, dann fragen"];
const Regeln = () => {
  const { t, cue, end } = useCues();
  const R = ["Tür offen", "Wert zu hoch", "Kunde neu", "Lager leer", "Name fehlt"];
  const A = ["melden", "Alarm", "grüßen", "ordern", "fragen"];
  const n = Math.floor(lin(t, cue(0) + 0.5, end(1) - 0.5, 0, 5.99)) + 1;
  const q = sp(t, cue(2), 0.8);
  const dicht = ease(t, cue(2) + 0.3, cue(2) + 2.0);
  return (
    <Szene titel="Regelbasierte KI" tiefe={["list", 1400, 660, 900]}>
      {R.map((r, i) => (
        <div key={r} style={{ position: "absolute", left: 110, top: 290 + i * 135, width: 1000, height: 112, borderRadius: 28, background: C.panel, border: `4px solid ${i === 0 ? C.blue : C.line}`, display: "flex", alignItems: "center", gap: 24, padding: "0 36px", boxSizing: "border-box", fontSize: 58, fontWeight: 600, opacity: sp(t, i === 0 ? cue(0) + 0.5 : lerp(cue(0) + 0.5, end(1) - 0.5, i / 5), 0.6), transform: `scale(${1 - dicht * 0.0})` }}>
          <span style={{ color: C.blue }}>wenn</span>{r}<span style={{ color: C.green }}>dann</span>{A[i]}
        </div>
      ))}
      <Rv at={cue(1)} dy={0} style={{ position: "absolute", left: 110, top: 975 }}><div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 44, color: C.mute }}><Icon name="user" size={50} color={C.mute} />Ein Mensch schreibt jede Regel</div></Rv>
      <Panel x={1190} y={290} w={620} h={420} r={34} a={q} rand={C.orange}><div style={{ position: "absolute", left: 160, top: 40 }}><Icon name="image" size={300} color={C.mute} sw={1.2} /></div><div style={{ position: "absolute", left: 0, top: 340, width: 620, textAlign: "center", fontSize: 60, fontWeight: 800, color: C.orange }}>Katze?</div></Panel>
      {Array.from({ length: 24 }).map((_, k) => <div key={k} style={{ position: "absolute", left: 1190 + (k % 6) * 104, top: 750 + Math.floor(k / 6) * 62, width: 92, height: 44, borderRadius: 12, background: k % 7 === 3 ? C.orange + "88" : "#2c2c2e", opacity: ease(t, cue(2) + 0.6 + k * 0.05, cue(2) + 1.0 + k * 0.05) }} />)}
    </Szene>
  );
};

const RINGE = [
  { r: 360, farbe: "#98989d", n: "KI", sub: "" },
  { r: 290, farbe: C.blue, n: "Maschinelles Lernen" },
  { r: 215, farbe: "#64d2ff", n: "Deep Learning" },
  { r: 140, farbe: C.green, n: "Generative KI" },
];
const Kreise = () => {
  const { t, cue } = useCues();
  const CX = 1180, BOT = 960;
  const zeiten = [cue(0), cue(1) + 0.2, cue(2) + 0.2, cue(3) + 0.2];
  const liste = [
    ["Maschinelles Lernen", "Lernt aus Beispielen, statt Regeln zu bekommen", C.blue],
    ["Deep Learning", "Große neuronale Netze mit vielen Schichten", "#64d2ff"],
    ["Generative KI", "Erzeugt neue Texte, Bilder oder Töne", C.green],
  ];
  return (
    <Szene titel="Ineinander gesetzt" tiefe={["network",1400,660,900]} fokus={[1,960,610]} sub="Jede Schicht ist ein Teil der größeren">
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {RINGE.map((c, i) => {
          const p = sp(t, zeiten[i], 1.2);
          const r = c.r * (i === 0 ? 1 : p);
          return <circle key={c.n} cx={CX} cy={BOT - r} r={Math.max(r, 0.01)} fill={c.farbe + (i === 0 ? "14" : "22")} stroke={c.farbe} strokeWidth={4} opacity={i === 0 ? sp(t, zeiten[0], 1) : 1} />;
        })}
        {RINGE.map((c, i) => {
          const p = sp(t, zeiten[i] + 0.5, 0.8);
          const top = BOT - 2 * c.r;
          const next = RINGE[i + 1];
          const band = next ? 2 * (c.r - next.r) : 2 * c.r;
          const y = i === 3 ? BOT - c.r : top + band / 2 + (c.n === "Maschinelles Lernen" ? 6 : 0);
          const lines = c.n === "Generative KI" ? ["Generative", "KI"] : c.n === "Maschinelles Lernen" ? ["Maschinelles", "Lernen"] : [c.n];
          return <text key={c.n} x={CX} y={y + (lines.length > 1 ? -4 : 12)} textAnchor="middle" fill={c.farbe === "#98989d" ? C.text : c.farbe} fontSize={i === 3 ? 38 : i === 2 ? 40 : i === 1 ? 40 : 44} fontWeight={700} opacity={p} fontFamily="inherit">
            {lines.map((l, k) => <tspan key={k} x={CX} dy={k ? 40 : 0}>{l}</tspan>)}
          </text>;
        })}
      </svg>
      {liste.map(([n, b, f], i) => (
        <Rv key={n} at={zeiten[i + 1]} dx={-30} dy={0} style={{ position: "absolute", left: 120, top: 365 + i * 190 }}>
          <div style={{ width: 640, borderLeft: `6px solid ${f}`, paddingLeft: 26 }}>
            <div style={{ fontSize: 42, fontWeight: 700, color: f }}>{n}</div>
            <div style={{ fontSize: 36, color: C.mute, marginTop: 4, lineHeight: 1.25 }}>{b}</div>
          </div>
        </Rv>
      ))}
      <Rv at={cue(0) + 1.4} dx={40} dy={0} style={{ position: "absolute", left: 1575, top: 470, width: 245 }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: C.orange }}>Regelbasierte KI</div>
        <div style={{ fontSize: 40, color: C.mute, marginTop: 6, lineHeight: 1.3 }}>feste Regeln, kein Lernen</div>
      </Rv>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <Pfad d="M1570 505 L1500 505" p={sp(t, cue(0) + 1.6, 0.6)} color={C.orange} w={3} dash="0.02 0.03" />
      </svg>
    </Szene>
  );
};

const Robotik = () => {
  const { t, cue } = useCues();
  const rahmen = sp(t, cue(0) + 0.3, 1.0);
  const p1 = ease(t, cue(1), cue(1) + 1.0), p2 = ease(t, cue(1) + 1.2, cue(1) + 2.2);
  return (
    <Szene titel="KI mit Körper" tiefe={["bot", 1400, 660, 900]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <rect x={480} y={300} width={1000} height={600} rx={50} fill="none" stroke={C.blue} strokeWidth={6} strokeDasharray="18 14" opacity={rahmen} />
        <Pfad d="M130 600 L460 600" p={p1} color={C.green} w={10} head={spitze(130, 600, 460, 600, 28)} />
        <Pfad d="M1500 600 L1790 600" p={p2} color={C.green} w={10} head={spitze(1500, 600, 1790, 600, 28)} />
      </svg>
      <Lbl x={500} y={230} w={900} t="Roboter = KI + Körper" size={56} color={C.blue} a={rahmen} />
      <Rv at={cue(0) + 0.6} style={{ position: "absolute", left: 520, top: 460 }}><div style={{ textAlign: "center", width: 280 }}><Badge name="camera" size={240} color={C.mute} /><div style={{ fontSize: 52, fontWeight: 700, marginTop: 14 }}>Sensoren</div></div></Rv>
      <Rv at={cue(0) + 1.0} s0={0.85} style={{ position: "absolute", left: 800, top: 420 }}><div style={{ width: 340, height: 340, borderRadius: 170, background: C.blue + "22", border: `8px solid ${C.blue}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 170, fontWeight: 800 }}>KI</div></Rv>
      <Rv at={cue(0) + 1.4} style={{ position: "absolute", left: 1180, top: 460 }}><div style={{ textAlign: "center", width: 280 }}><Badge name="zap" size={240} color={C.mute} /><div style={{ fontSize: 52, fontWeight: 700, marginTop: 14 }}>Motoren</div></div></Rv>
      <Lbl x={110} y={480} w={340} t="Welt" size={64} a={sp(t, cue(0) + 0.2, 0.6)} align="center" />
      <Lbl x={1560} y={480} w={300} t="Welt" size={64} a={p2} align="center" />
      <Lbl x={110} y={700} w={380} t="nimmt wahr" size={52} color={C.green} a={p1} align="center" />
      <Lbl x={1470} y={700} w={380} t="greift ein" size={52} color={C.green} a={p2} align="center" />
    </Szene>
  );
};

const Landkarte = () => {
  const { t, cue, word } = useCues();
  const zeilen = [
    ["eye", "Sehen", "Bilder und Videos erkennen", "Sehen"],
    ["message", "Sprache", "Text und gesprochene Sprache verstehen", "Sprache"],
    ["sparkles", "Erzeugen", "Neue Texte, Bilder und Töne", "Erzeugen"],
    ["book", "Wissen", "Dokumente durchsuchen und befragen", "Wissen"],
    ["pointer", "Handeln", "Werkzeuge bedienen, Roboter steuern", "Handeln"],
  ];
  return (
    <Szene titel="Die Landkarte" tiefe={["grid",1400,660,900]} fokus={[1,960,660]} sub="Fünf Bereiche, ein Überblick">
      <Rv at={0.3} s0={0.8} style={{ position: "absolute", left: 160, top: 520 }}>
        <div style={{ width: 230, height: 230, borderRadius: 115, background: C.blue + "22", border: `4px solid ${C.blue}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100, fontWeight: 800 }}>KI</div>
      </Rv>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {zeilen.map((z, i) => {
          const y = 400 + i * 120, t0 = word(0, z[3]);
          return <Pfad key={z[1]} d={`M395 635 C 600 635, 600 ${y} 800 ${y}`} p={sp(t, t0 - 0.2, 0.8)} color={C.line} w={3} />;
        })}
      </svg>
      {zeilen.map((z, i) => {
        const y = 400 + i * 120, t0 = word(0, z[3]);
        return (
          <Rv key={z[1]} at={t0} dx={40} dy={0} style={{ position: "absolute", left: 810, top: y - 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <Badge name={z[0]} size={88} />
              <div><div style={{ fontSize: 46, fontWeight: 700 }}>{z[1]}</div><div style={{ fontSize: 40, color: C.mute }}>{z[2]}</div></div>
            </div>
          </Rv>
        );
      })}
      <Txt at={cue(1)} x={120} y={800} w={560} size={42} color={C.mute} weight={500}>Nächste Videos: Lernen, Erzeugen, Robotik und Einsatz im Business</Txt>
    </Szene>
  );
};

export default { einstieg: Einstieg, faehigkeiten: Faehigkeiten, regeln: Regeln, kreise: Kreise, robotik: Robotik, landkarte: Landkarte };
