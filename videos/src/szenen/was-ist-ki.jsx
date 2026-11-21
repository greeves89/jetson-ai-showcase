import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, Pill, Pfeil, Pfad, C, spitze } from "../lib.jsx";

const Einstieg = () => {
  const { t, cue, word } = useCues();
  const a = sp(t, cue(0), 1.1);
  return (
    <Szene titel="" kopf={false}>
      <div style={{ position: "absolute", left: 120, top: 120, fontSize: 36, fontWeight: 600, color: C.blue }}>
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
          <div><div style={{ fontSize: 44, fontWeight: 700 }}>Maschine</div><div style={{ fontSize: 36, color: C.mute }}>löst</div></div>
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
            <div style={{ fontSize: 36, color: C.mute, lineHeight: 1.3 }}>für die sonst Intelligenz nötig wäre</div>
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
    <Szene titel="Vier Fähigkeiten" sub="Was ein KI-System dafür können muss">
      {spalten.map((s, i) => {
        const cx = 330 + i * 420, t0 = word(0, s.w), t1 = word(1, s.ew) - 0.2;
        return (
          <React.Fragment key={s.v}>
            <Rv at={t0} dy={30} style={{ position: "absolute", left: cx - 85, top: 440 }}><Badge name={s.n} size={170} glow={sp(t, t1, 1)} /></Rv>
            <Txt at={t0 + 0.1} x={cx - 200} y={640} w={400} size={50} weight={700} align="center">{s.v}</Txt>
            <Txt at={t1} x={cx - 200} y={716} w={400} size={38} color={C.mute} align="center">{s.e}</Txt>
            {i > 0 && <Pfeil x1={cx - 420 + 110} y1={525} x2={cx - 110} y2={525} p={sp(t, t0 - 0.2, 0.6)} color={C.line} w={4} />}
          </React.Fragment>
        );
      })}
    </Szene>
  );
};

const REGELN = ["wenn Tür offen, dann melden", "wenn Wert zu hoch, dann Alarm", "wenn Kunde neu, dann Willkommen", "wenn Lager leer, dann bestellen", "wenn Name fehlt, dann nachfragen"];
const Regeln = () => {
  const { t, cue, end } = useCues();
  const kw = (s) => s.split(/(wenn|dann)/).map((p, i) => p === "wenn" ? <span key={i} style={{ color: C.blue }}>wenn</span> : p === "dann" ? <span key={i} style={{ color: C.green }}>dann</span> : p);
  return (
    <Szene titel="Regelbasierte KI" sub="Wenn dies, dann das">
      {/* eine Regel */}
      {REGELN.map((r, i) => {
        const at = i === 0 ? cue(0) + 0.5 : lerp(cue(1), end(1) - 0.8, (i - 1) / 4) ;
        return (
          <Rv key={r} at={at} dx={-30} dy={0} style={{ position: "absolute", left: 120, top: 380 + i * 100 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, background: C.panel, borderRadius: 18, padding: "16px 28px", width: 760, fontSize: 36, fontWeight: 500, border: `2px solid ${i === 0 ? C.blue + "99" : C.line}` }}>
              <Icon name="list" size={34} color={C.mute} />{kw(r)}
            </div>
          </Rv>
        );
      })}
      <Rv at={cue(1)} dy={0} style={{ position: "absolute", left: 120, top: 905 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, color: C.mute }}><Icon name="user" size={36} color={C.mute} />Ein Mensch schreibt jede Regel selbst</div>
      </Rv>
      {/* Bild: zu viele Fälle */}
      <Rv at={cue(2)} dx={50} style={{ position: "absolute", left: 1040, top: 380 }}>
        <div style={{ width: 360, height: 250, borderRadius: 24, background: C.panel, border: `2px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
          <Icon name="image" size={110} color={C.mute} />
          <div style={{ fontSize: 36, color: C.mute }}>Foto einer Katze</div>
        </div>
      </Rv>
      <Txt at={cue(2) + 0.6} x={1440} y={430} w={360} size={40} weight={700} color={C.orange}>Welche Regel erkennt sie?</Txt>
      {Array.from({ length: 40 }).map((_, k) => {
        const col = k % 8, row = Math.floor(k / 8);
        return <Rv key={k} at={cue(2) + 0.9 + k * 0.045} dy={8} d={0.5} style={{ position: "absolute", left: 1040 + col * 96, top: 690 + row * 52 }}>
          <div style={{ width: 84, height: 34, borderRadius: 10, background: k % 7 === 3 ? C.orange + "66" : "#2c2c2e", border: `1px solid ${C.line}` }} />
        </Rv>;
      })}
      <Txt at={cue(2) + 2.8} x={1040} y={965} w={760} size={38} color={C.orange} weight={600}>Zu viele Fälle für feste Regeln</Txt>
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
    <Szene titel="Ineinander gesetzt" sub="Jede Schicht ist ein Teil der größeren">
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
          return <text key={c.n} x={CX} y={y + (lines.length > 1 ? -4 : 12)} textAnchor="middle" fill={c.farbe === "#98989d" ? C.text : c.farbe} fontSize={i === 3 ? 34 : i === 2 ? 36 : 34} fontWeight={700} opacity={p} fontFamily="inherit">
            {lines.map((l, k) => <tspan key={k} x={CX} dy={k ? 40 : 0}>{l}</tspan>)}
          </text>;
        })}
      </svg>
      {liste.map(([n, b, f], i) => (
        <Rv key={n} at={zeiten[i + 1]} dx={-30} dy={0} style={{ position: "absolute", left: 120, top: 400 + i * 160 }}>
          <div style={{ width: 640, borderLeft: `6px solid ${f}`, paddingLeft: 26 }}>
            <div style={{ fontSize: 42, fontWeight: 700, color: f }}>{n}</div>
            <div style={{ fontSize: 36, color: C.mute, marginTop: 6, lineHeight: 1.3 }}>{b}</div>
          </div>
        </Rv>
      ))}
      <Rv at={cue(0) + 1.4} dx={40} dy={0} style={{ position: "absolute", left: 1575, top: 470, width: 245 }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: C.orange }}>Regelbasierte KI</div>
        <div style={{ fontSize: 36, color: C.mute, marginTop: 6, lineHeight: 1.3 }}>feste Regeln, kein Lernen</div>
      </Rv>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <Pfad d="M1570 505 L1500 505" p={sp(t, cue(0) + 1.6, 0.6)} color={C.orange} w={3} dash="0.02 0.03" />
      </svg>
    </Szene>
  );
};

const Robotik = () => {
  const { t, cue, end } = useCues();
  const rahmen = sp(t, cue(0) + 0.3, 1.0);
  return (
    <Szene titel="KI mit Körper" sub="Das ist Robotik">
      <Rv at={cue(0) + 0.2} style={{ position: "absolute", left: 120, top: 560 }}><div style={{ fontSize: 40, fontWeight: 700 }}>Welt</div></Rv>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <rect x={380} y={400} width={1160} height={330} rx={40} fill="none" stroke={C.blue} strokeWidth={4} strokeDasharray="14 12" opacity={rahmen} />
        <Pfad d="M260 580 L450 580" p={sp(t, cue(1), 0.8)} color={C.green} w={6} head={spitze(260, 580, 450, 580, 20)} />
        <Pfad d="M690 580 L800 580" p={sp(t, cue(0) + 1.4, 0.6)} color={C.mute} w={5} head={spitze(690, 580, 800, 580, 18)} />
        <Pfad d="M1120 580 L1230 580" p={sp(t, cue(0) + 1.8, 0.6)} color={C.mute} w={5} head={spitze(1120, 580, 1230, 580, 18)} />
        <Pfad d="M1470 580 L1660 580" p={sp(t, cue(1) + 1.2, 0.8)} color={C.green} w={6} head={spitze(1470, 580, 1660, 580, 20)} />
      </svg>
      <Txt at={cue(0) + 0.3} x={410} y={338} w={600} size={38} color={C.blue} weight={700}>Roboter = KI + Körper</Txt>
      <Rv at={cue(0) + 0.6} style={{ position: "absolute", left: 450, top: 480 }}><div style={{ textAlign: "center", width: 240 }}><Badge name="camera" size={130} color={C.mute} /><div style={{ fontSize: 36, fontWeight: 600, marginTop: 12 }}>Sensoren</div></div></Rv>
      <Rv at={cue(0) + 1.0} s0={0.8} style={{ position: "absolute", left: 800, top: 450 }}><div style={{ textAlign: "center", width: 320 }}><div style={{ width: 190, height: 190, borderRadius: 95, background: C.blue + "22", border: `4px solid ${C.blue}`, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, fontWeight: 800 }}>KI</div><div style={{ fontSize: 36, fontWeight: 600, marginTop: 12 }}>Entscheiden</div></div></Rv>
      <Rv at={cue(0) + 1.4} style={{ position: "absolute", left: 1230, top: 480 }}><div style={{ textAlign: "center", width: 240 }}><Badge name="zap" size={130} color={C.mute} /><div style={{ fontSize: 36, fontWeight: 600, marginTop: 12 }}>Motoren</div></div></Rv>
      <Rv at={cue(1) + 1.2} style={{ position: "absolute", left: 1670, top: 560 }}><div style={{ fontSize: 40, fontWeight: 700 }}>Welt</div></Rv>
      <Txt at={cue(1)} x={120} y={790} w={500} size={38} color={C.green} weight={600}>nimmt wahr</Txt>
      <Txt at={cue(1) + 1.2} x={1300} y={790} w={500} size={38} color={C.green} weight={600} align="right">greift ein</Txt>
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
    <Szene titel="Die Landkarte" sub="Fünf Bereiche, ein Überblick">
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
              <div><div style={{ fontSize: 46, fontWeight: 700 }}>{z[1]}</div><div style={{ fontSize: 36, color: C.mute }}>{z[2]}</div></div>
            </div>
          </Rv>
        );
      })}
      <Txt at={cue(1)} x={120} y={800} w={560} size={38} color={C.mute} weight={500}>Nächste Videos: Lernen, Erzeugen, Robotik und Einsatz im Business</Txt>
    </Szene>
  );
};

export default { einstieg: Einstieg, faehigkeiten: Faehigkeiten, regeln: Regeln, kreise: Kreise, robotik: Robotik, landkarte: Landkarte };
