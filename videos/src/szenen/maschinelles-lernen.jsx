import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, Pill, Pfeil, Pfad, C, rnd, spitze } from "../lib.jsx";

// Einfache Tier-Bilder als eigene SVG (Katze, Hund)
export function Tier({ art, farbe = C.orange, size = 140, rahmen = C.line, fragezeichen }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 24, background: C.panel, border: `2px ${fragezeichen ? "dashed" : "solid"} ${rahmen}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size * 0.78} height={size * 0.78} viewBox="0 0 100 100">
        {art === "katze" ? (
          <g>
            <path d="M22 44 L26 12 L46 28 Z M78 44 L74 12 L54 28 Z" fill={farbe} />
            <ellipse cx="50" cy="56" rx="32" ry="28" fill={farbe} />
            <circle cx="39" cy="52" r="4.5" fill="#111" /><circle cx="61" cy="52" r="4.5" fill="#111" />
            <path d="M46 62 L54 62 L50 67 Z" fill="#111" />
            <path d="M12 58 L34 61 M12 68 L34 65 M88 58 L66 61 M88 68 L66 65" stroke="#111" strokeWidth="2" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <ellipse cx="22" cy="50" rx="12" ry="26" fill="#000" opacity="0.35" transform="rotate(12 22 50)" />
            <ellipse cx="78" cy="50" rx="12" ry="26" fill="#000" opacity="0.35" transform="rotate(-12 78 50)" />
            <ellipse cx="50" cy="52" rx="29" ry="30" fill={farbe} />
            <ellipse cx="50" cy="66" rx="16" ry="12" fill="#f2f2f7" opacity="0.9" />
            <circle cx="39" cy="46" r="4.5" fill="#111" /><circle cx="61" cy="46" r="4.5" fill="#111" />
            <ellipse cx="50" cy="61" rx="6" ry="4.5" fill="#111" />
            <path d="M50 65 L50 71 M44 72 Q50 77 56 72" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}
        {fragezeichen && <text x="50" y="62" textAnchor="middle" fontSize="44" fontWeight="700" fill={C.mute} opacity="0">?</text>}
      </svg>
    </div>
  );
}
const KATZEN = [C.orange, "#c7c7cc", "#8e8e93", "#ffd60a"];
const HUNDE = ["#a2845e", "#e5e5ea", "#636366", "#bf9b6a"];

const Chip = ({ children, color = C.text, bg = C.panel, size = 50, border }) => (
  <div style={{ display: "inline-block", fontSize: size, fontWeight: 600, color, background: bg, border: border ?? `3px solid ${color}66`, borderRadius: 18, padding: "8px 26px", whiteSpace: "nowrap" }}>{children}</div>
);

const Umkehr = () => {
  const { t, cue, word } = useCues();
  const zeile = (y, aus, farben, beschr, name, icon, t0, t1) => (
    <>
      <Txt at={t0} x={120} y={y} w={800} size={50} weight={700} color={C.blue}>{aus}</Txt>
      {beschr.ein.map((e, i) => (
        <Rv key={e} at={t0 + 0.3 + i * 0.3} dx={-30} dy={0} style={{ position: "absolute", left: 120, top: y + 72 + i * 88 }}><Chip color={farben[e]}>{e}</Chip></Rv>
      ))}
      <Pfeil x1={450} y1={y + 150} x2={600} y2={y + 150} p={sp(t, t0 + 0.9, 0.6)} color={C.mute} w={6} />
      <Rv at={t0 + 1.0} s0={0.8} style={{ position: "absolute", left: 630, top: y + 60 }}>
        <div style={{ textAlign: "center", width: 220 }}><Badge name={icon} size={170} /><div style={{ fontSize: 42, fontWeight: 600, marginTop: 8 }}>{name}</div></div>
      </Rv>
      <Pfeil x1={870} y1={y + 150} x2={1010} y2={y + 150} p={sp(t, t0 + 1.4, 0.6)} color={C.mute} w={6} />
      <Rv at={t0 + 1.6} dx={-30} dy={0} style={{ position: "absolute", left: 1040, top: y + 118 }}><Chip color={farben[beschr.aus]}>{beschr.aus}</Chip></Rv>
      <Txt at={t1} x={1400} y={y + 96} w={400} size={44} color={C.text} weight={500}>{beschr.text}</Txt>
    </>
  );
  const F = { Regeln: C.blue, Daten: C.mute, Antworten: C.green };
  return (
    <Szene titel="Programmieren oder Lernen" tiefe={["cpu",1400,660,900]} sub="Zwei Wege zum gleichen Ziel">
      {zeile(350, "Programmieren", F, { ein: ["Regeln", "Daten"], aus: "Antworten", text: "Der Mensch schreibt die Regeln." }, "Programm", "cpu", cue(0) + 0.3, cue(0) + 3.0)}
      {zeile(680, "Maschinelles Lernen", F, { ein: ["Daten", "Antworten"], aus: "Regeln", text: "Das System findet die Regeln selbst." }, "Lernen", "network", cue(1) + 0.2, cue(2) + 1.2)}
    </Szene>
  );
};

const Training = () => {
  const { t, cue, end, word } = useCues();
  const arten = ["katze", "hund", "katze", "hund", "hund", "katze", "hund", "katze"];
  const lernt = ease(t, cue(2) + 0.3, end(2) + 0.3);
  const treffer = lerp(0.2, 0.92, lernt);
  const durchgang = 1 + Math.floor(lernt * 11.99);
  const fertig = sp(t, cue(3), 0.6) > 0.5;
  return (
    <Szene titel="Training" tiefe={["network",1400,660,900]} sub="Aus Beispielen mit Etikett wird ein Modell">
      {arten.map((a, i) => {
        const col = i % 4, row = Math.floor(i / 4);
        const x = 120 + col * 220, y = 380 + row * 300;
        return (
          <React.Fragment key={i}>
            <Rv at={cue(1) + 0.1 + i * 0.12} s0={0.85} style={{ position: "absolute", left: x, top: y }}>
              <Tier art={a} farbe={(a === "katze" ? KATZEN : HUNDE)[i % 4]} size={190} />
            </Rv>
            <Rv at={word(1, "Etikett") + 0.2 + i * 0.1} dy={8} style={{ position: "absolute", left: x, top: y + 198 }}>
              <div style={{ width: 190, textAlign: "center", fontSize: 44, fontWeight: 600, color: a === "katze" ? C.orange : C.blue }}>{a === "katze" ? "Katze" : "Hund"}</div>
            </Rv>
          </React.Fragment>
        );
      })}
      <Pfeil x1={1020} y1={640} x2={1200} y2={640} p={sp(t, cue(2), 0.8)} color={C.mute} w={6} />
      {t > cue(2) + 0.6 && !fertig && [0, 1, 2].map((k) => { const q = ((t - cue(2)) * 0.9 + k / 3) % 1; return <div key={k} style={{ position: "absolute", left: 1030 + q * 150, top: 628, width: 24, height: 24, borderRadius: 12, background: k % 2 ? C.orange : C.blue, opacity: Math.sin(q * Math.PI) }} />; })}
      <Rv at={cue(2) + 0.2} s0={0.85} style={{ position: "absolute", left: 1230, top: 380 }}>
        <div style={{ textAlign: "center", width: 520 }}>
          <Badge name="network" size={240} color={fertig ? C.green : C.blue} />
          <div style={{ fontSize: 60, fontWeight: 700, marginTop: 16, color: fertig ? C.green : C.text }}>{fertig ? "Modell" : "wird angepasst"}</div>
        </div>
      </Rv>
      <Rv at={cue(2) + 0.5} dy={14} style={{ position: "absolute", left: 1230, top: 780, width: 520 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 42, color: C.mute, marginBottom: 14 }}><span>Treffer</span><span>Durchgang {durchgang}</span></div>
        <div style={{ width: 520, height: 36, borderRadius: 18, background: C.panel2 }}>
          <div style={{ width: 520 * treffer, height: 36, borderRadius: 18, background: treffer > 0.8 ? C.green : C.blue }} />
        </div>
      </Rv>
    </Szene>
  );
};

const Inferenz = () => {
  const { t, cue, end } = useCues();
  const bal = [["Katze", 0.86, C.green], ["Hund", 0.09, C.mute], ["Vogel", 0.05, C.mute]];
  const fl = sp(t, cue(1) + 0.9, 0.7);
  const fl2 = sp(t, cue(2), 0.7);
  return (
    <Szene titel="Inferenz" tiefe={["search",1400,660,900]} sub="Das trainierte Modell wird angewendet">
      <Rv at={cue(1) + 0.1} dx={-60} style={{ position: "absolute", left: 120, top: 400 }}>
        <Tier art="katze" farbe="#d1a15b" size={340} rahmen={C.blue} fragezeichen />
        <div style={{ marginTop: 14, fontSize: 48, fontWeight: 600, color: C.blue, width: 340, textAlign: "center" }}>neues Bild</div>
        <div style={{ fontSize: 40, color: C.mute, width: 340, textAlign: "center", marginTop: 2 }}>nie gesehen</div>
      </Rv>
      <Pfeil x1={490} y1={570} x2={640} y2={570} p={fl} color={C.mute} w={6} />
      {t > cue(1) + 1.2 && fl2 < 0.5 && <div style={{ position: "absolute", left: 500 + ((t * 1.2) % 1) * 130, top: 558, width: 24, height: 24, borderRadius: 12, background: C.blue }} />}
      <Rv at={cue(0) + 0.3} s0={0.8} style={{ position: "absolute", left: 660, top: 450 }}>
        <div style={{ textAlign: "center", width: 280 }}><Badge name="network" size={230} color={C.green} /><div style={{ fontSize: 52, fontWeight: 700, marginTop: 14 }}>Modell</div></div>
      </Rv>
      <Pfeil x1={950} y1={570} x2={1090} y2={570} p={fl2} color={C.mute} w={6} />
      <Txt at={cue(2) + 0.2} x={1130} y={360} w={700} size={42} color={C.mute}>Vorhersage mit Sicherheit</Txt>
      {bal.map(([n, v, f], i) => (
        <div key={n} style={{ position: "absolute", left: 1130, top: 440 + i * 124 }}>
          <Rv at={cue(2) + 0.5 + i * 0.25} dy={0}>
            <div style={{ fontSize: 52, fontWeight: 700, color: i === 0 ? C.green : C.mute, marginBottom: 8 }}>{n}</div>
            <div style={{ width: 670, height: 38, borderRadius: 19, background: C.panel2 }}>
              <div style={{ width: 670 * v * ease(t, cue(2) + 0.7 + i * 0.25, cue(2) + 1.8 + i * 0.25), height: 38, borderRadius: 19, background: f }} />
            </div>
          </Rv>
        </div>
      ))}
      <Txt at={cue(2) + 2.4} x={1130} y={840} w={700} size={56} weight={700} color={C.green}>Vorhersage: Katze</Txt>
    </Szene>
  );
};

const PT1 = [[0.2, 0.7], [0.3, 0.6], [0.45, 0.8], [0.55, 0.35], [0.7, 0.55], [0.8, 0.3], [0.9, 0.5]];
const Lernarten = () => {
  const { t, cue, end, dur } = useCues();
  const spalten = [
    { x: 120, n: "Überwacht", b: "Beispiele mit richtiger Antwort", f: C.blue, at: cue(0) },
    { x: 710, n: "Unüberwacht", b: "Gruppen in Daten ohne Etikett", f: "#64d2ff", at: cue(1) },
    { x: 1300, n: "Bestärkend", b: "Ausprobieren, Belohnung für gute Züge", f: C.green, at: cue(2) },
  ];
  const A = { w: 500, h: 360, y: 540 };
  const klumpen = (c, i) => [c[0] + (rnd(i * 3 + 1) - 0.5) * 150, c[1] + (rnd(i * 3 + 2) - 0.5) * 150];
  const pts = Array.from({ length: 12 }).map((_, i) => ({ k: i < 6 ? 0 : 1, p: klumpen(i < 6 ? [130, 120] : [370, 250], i) }));
  // Weg des Agenten
  const weg = [[40, 300], [40, 180], [160, 180], [160, 60], [300, 60], [440, 60]];
  const wegT = ease(t, cue(2) + 1.0, end(2));
  const idx = wegT * (weg.length - 1), i0 = Math.min(weg.length - 2, Math.floor(idx)), fr = idx - i0;
  const ag = [lerp(weg[i0][0], weg[i0 + 1][0], fr), lerp(weg[i0][1], weg[i0 + 1][1], fr)];
  return (
    <Szene titel="Drei Lernarten" tiefe={["fork",1400,660,900]} fokus={[1,960,640]} sub="Je nachdem, welche Rückmeldung es gibt">
      {spalten.map((s, i) => (
        <React.Fragment key={s.n}>
          {i > 0 && <div style={{ position: "absolute", left: s.x - 50, top: 360, width: 2, height: 560, background: C.line, opacity: sp(t, s.at, 0.8) }} />}
          <Txt at={s.at} x={s.x} y={350} w={500} size={46} weight={700} color={s.f}>{s.n}</Txt>
          <Txt at={s.at + 0.2} x={s.x} y={424} w={500} size={42} color={C.mute}>{s.b}</Txt>
        </React.Fragment>
      ))}
      {/* 1 überwacht */}
      <svg style={{ position: "absolute", left: 120, top: 540, width: 500, height: 360, overflow: "visible" }}>
        {pts.map((q, i) => <circle key={i} cx={q.p[0]} cy={q.p[1]} r={15} fill={q.k ? C.orange : C.blue} opacity={sp(t, cue(0) + 0.2 + i * 0.12, 0.5)} />)}
        <Pfad d="M120 330 C 220 250, 300 100, 420 20" p={sp(t, cue(0) + 2.6, 1.2)} color={C.text} w={4} dash="0.03 0.025" />
      </svg>
      <Txt at={cue(0) + 1.0} x={120} y={908} w={520} size={38} color={C.mute}>Antwort je Punkt bekannt</Txt>
      {/* 2 unüberwacht */}
      <svg style={{ position: "absolute", left: 710, top: 540, width: 500, height: 360, overflow: "visible" }}>
        {pts.map((q, i) => {
          const g = sp(t, cue(1) + 2.2, 1.0);
          return <circle key={i} cx={q.p[0] + (rnd(i) - 0.5) * 30} cy={q.p[1] + (rnd(i + 9) - 0.5) * 30} r={15} fill={g > 0.5 ? (q.k ? "#64d2ff" : C.green) : C.mute} opacity={sp(t, cue(1) + 0.2 + i * 0.12, 0.5)} />;
        })}
        <circle cx={130} cy={120} r={110} fill="none" stroke={C.green} strokeWidth={3} strokeDasharray="10 10" opacity={sp(t, cue(1) + 2.4, 0.8)} />
        <circle cx={370} cy={250} r={110} fill="none" stroke="#64d2ff" strokeWidth={3} strokeDasharray="10 10" opacity={sp(t, cue(1) + 2.6, 0.8)} />
      </svg>
      <Txt at={cue(1) + 2.4} x={710} y={908} w={520} size={38} color={C.mute}>System findet Gruppen</Txt>
      {/* 3 bestärkend */}
      <svg style={{ position: "absolute", left: 1300, top: 540, width: 500, height: 360, overflow: "visible" }}>
        {Array.from({ length: 24 }).map((_, k) => <rect key={k} x={(k % 6) * 80 + 4} y={Math.floor(k / 6) * 90 + 4} width={72} height={82} rx={10} fill={C.panel} stroke={C.line} strokeWidth={2} opacity={sp(t, cue(2) + 0.1 + k * 0.03, 0.6)} />)}
        <rect x={404} y={4} width={72} height={82} rx={10} fill={C.green + "33"} stroke={C.green} strokeWidth={3} opacity={sp(t, cue(2) + 0.8, 0.6)} />
        <path d="M440 26 l7 15 16 2 -12 11 3 16 -14-8 -14 8 3-16 -12-11 16-2z" fill={C.green} opacity={sp(t, cue(2) + 0.9, 0.6)} transform="translate(-4 -5)" />
        <circle cx={ag[0] + 0} cy={ag[1] + 20} r={20} fill={C.blue} opacity={sp(t, cue(2) + 0.9, 0.5)} />
      </svg>
      <Txt at={cue(2) + 3.0} x={1300} y={908} w={520} size={38} color={C.green}>Ziel erreicht: Belohnung</Txt>
    </Szene>
  );
};

// Lagrange-Polynom durch alle Trainingspunkte (zeigt Überanpassung)
const TRAIN = [[0.05, 0.4], [0.18, 0.5], [0.31, 0.4], [0.44, 0.58], [0.57, 0.46], [0.7, 0.66], [0.83, 0.55], [0.95, 0.7]];
const lag = (x) => TRAIN.reduce((s, [xi, yi], i) => s + yi * TRAIN.reduce((p, [xj], j) => (i === j ? p : p * (x - xj) / (xi - xj)), 1), 0);
const TEST = [[0.115, 0.45], [0.375, 0.5], [0.635, 0.58], [0.89, 0.64]];
const Ueberanpassung = () => {
  const { t, cue, end } = useCues();
  const X0 = 110, Y0 = 290, W = 1100, H = 680;
  const px = (x) => X0 + x * W, py = (y) => Y0 + H - y * H;
  const kurve = Array.from({ length: 160 }).map((_, i) => { const x = i / 159; return `${i ? "L" : "M"}${px(x)} ${py(Math.max(-0.2, Math.min(1.2, lag(x))))}`; }).join(" ");
  const gerade = `M${px(0)} ${py(0.38)} L${px(1)} ${py(0.7)}`;
  return (
    <Szene titel="Überanpassung" tiefe={["network",1400,660,900]} fokus={[1,960,640]} sub="Auswendig gelernt ist nicht verstanden">
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <defs><clipPath id="plot"><rect x={X0} y={Y0} width={W} height={H} /></clipPath></defs>
        <rect x={X0} y={Y0} width={W} height={H} rx={20} fill={C.panel} opacity={0.6} stroke={C.line} strokeWidth={2} />
        <g clipPath="url(#plot)">
          <Pfad d={kurve} p={sp(t, cue(1) + 0.8, 2.2)} color={C.orange} w={5} style={{ opacity: ease(t, cue(3) - 0.2, cue(3) + 0.8, 1, 0.25) }} />
        </g>
        <Pfad d={gerade} p={sp(t, cue(3) + 0.8, 1.4)} color={C.green} w={7} />
        {TRAIN.map(([x, y], i) => <circle key={i} cx={px(x)} cy={py(y)} r={12} fill={C.blue} opacity={sp(t, 0.5 + i * 0.1, 0.5)} />)}
        {TEST.map(([x, y], i) => {
          const a = sp(t, cue(2) + 0.2 + i * 0.25, 0.6);
          const fehl = Math.max(-0.2, Math.min(1.2, lag(x)));
          return <g key={i} opacity={a}>
            {t < cue(3) + 0.6 && <line x1={px(x)} y1={py(y)} x2={px(x)} y2={py(fehl)} stroke={C.red} strokeWidth={3} strokeDasharray="6 6" opacity={ease(t, cue(2) + 1.0, cue(2) + 1.6, 0, 1) * ease(t, cue(3) + 0.2, cue(3) + 0.6, 1, 0)} />}
            <circle cx={px(x)} cy={py(y)} r={13} fill="#000" stroke={C.green} strokeWidth={5} />
          </g>;
        })}
      </svg>
      <div style={{ position: "absolute", left: 1260, top: 310, width: 560 }}>
        <Rv at={0.5} dy={0}><div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40 }}><div style={{ width: 24, height: 24, borderRadius: 12, background: C.blue }} />Trainingsbeispiele</div></Rv>
        <Rv at={cue(1) + 0.4} dy={0} style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, color: C.orange }}><div style={{ width: 40, height: 6, borderRadius: 3, background: C.orange }} />Auswendig gelernt</div>
          <div style={{ fontSize: 40, color: C.mute, marginTop: 8, marginLeft: 56 }}>trifft jedes Trainingsbeispiel</div>
        </Rv>
        <Rv at={cue(2) + 0.2} dy={0} style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40 }}><div style={{ width: 24, height: 24, borderRadius: 12, border: `5px solid ${C.green}` }} />Neue Daten</div>
          <div style={{ fontSize: 40, color: C.red, marginTop: 8, marginLeft: 56 }}>große Abweichung: das Modell versagt</div>
        </Rv>
        <Rv at={cue(3) + 0.6} dy={0} style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, color: C.green }}><div style={{ width: 40, height: 6, borderRadius: 3, background: C.green }} />Muster verstanden</div>
          <div style={{ fontSize: 40, color: C.mute, marginTop: 8, marginLeft: 56 }}>passt auch zu ungesehenen Testdaten</div>
        </Rv>
      </div>
    </Szene>
  );
};

const KL = [{ n: "Katzen", c: [1180, 700], f: C.orange }, { n: "Hunde", c: [1560, 760], f: C.blue }, { n: "Vögel", c: [1480, 470], f: C.green }];
const PUNKTE = KL.flatMap((k, ki) => Array.from({ length: 7 }).map((_, i) => ({ ki, x: k.c[0] + (rnd(ki * 20 + i) - 0.5) * 190, y: k.c[1] + (rnd(ki * 20 + i + 50) - 0.5) * 170 })));
const Merkmalsraum = () => {
  const { t, cue, end, word } = useCues();
  const neu = [1262, 640];
  const flug = ease(t, cue(3), cue(3) + 1.6);
  const start = [560, 590];
  const np = [lerp(start[0], neu[0], flug), lerp(start[1], neu[1], flug)];
  const nachbarn = PUNKTE.map((p, i) => ({ ...p, i, d: Math.hypot(p.x - neu[0], p.y - neu[1]) })).sort((a, b) => a.d - b.d).slice(0, 3);
  return (
    <Szene titel="Im Merkmalsraum" tiefe={["grid",1400,660,900]} fokus={[1,960,640]} sub="Ähnliche Bilder liegen nah beieinander">
      <Rv at={cue(0) + 0.2} dx={-30} dy={0} style={{ position: "absolute", left: 120, top: 380 }}>
        <Pill color={C.blue} size={36}><Icon name="camera" size={32} color={C.blue} />Demo: Bildmodell anlernen</Pill>
      </Rv>
      <Rv at={cue(1) + 0.1} dy={0} style={{ position: "absolute", left: 120, top: 520 }}>
        <Tier art="katze" farbe="#d1a15b" size={200} rahmen={C.blue} />
      </Rv>
      <Pfeil x1={340} y1={620} x2={440} y2={620} p={sp(t, cue(1) + 0.6, 0.6)} color={C.mute} />
      <svg style={{ position: "absolute", left: 460, top: 520, width: 300, height: 200 }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const h = 40 + rnd(i + 3) * 120, a = sp(t, cue(1) + 0.9 + i * 0.08, 0.5);
          return <rect key={i} x={i * 36 + 4} y={200 - h * a} width={24} height={h * a} rx={6} fill={C.blue} />;
        })}
      </svg>
      <Txt at={cue(1) + 1.2} x={120} y={745} w={680} size={42} color={C.mute}>Das Bild wird zu einer Reihe von Zahlen</Txt>
      <Rv at={cue(2)} dy={0} style={{ position: "absolute", left: 880, top: 330, width: 920, height: 600 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: C.panel, opacity: 0.55, border: `2px solid ${C.line}` }} />
        <div style={{ position: "absolute", left: 28, top: 20, fontSize: 40, color: C.mute }}>Merkmalsraum</div>
      </Rv>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {KL.map((k, ki) => <circle key={k.n} cx={k.c[0]} cy={k.c[1]} r={125} fill={k.f + "14"} stroke={k.f} strokeWidth={2} strokeDasharray="8 8" opacity={sp(t, cue(2) + 1.8, 0.8) * (ki === 0 ? 1 + 0 * ease(t, cue(3) + 1.8, cue(3) + 2.2, 0, 1) : 1)} />)}
        {PUNKTE.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={11} fill={KL[p.ki].f} opacity={sp(t, cue(2) + 0.1 + i * 0.07, 0.5)} />)}
        {t > cue(3) + 1.5 && nachbarn.map((n) => <line key={n.i} x1={neu[0]} y1={neu[1]} x2={n.x} y2={n.y} stroke={C.text} strokeWidth={2.5} strokeDasharray="6 6" opacity={ease(t, cue(3) + 1.5, cue(3) + 2.1)} />)}
        <circle cx={np[0]} cy={np[1]} r={16} fill="#000" stroke={C.text} strokeWidth={5} opacity={sp(t, cue(3) - 0.1, 0.5)} />
      </svg>
      {KL.map((k) => <Txt key={k.n} at={cue(2) + 1.9} x={k.c[0] - 100} y={k.c[1] + 130} w={200} size={42} weight={700} color={k.f} align="center">{k.n}</Txt>)}
      <div style={{ position: "absolute", left: np[0] - 70, top: np[1] + 26, width: 140, textAlign: "center", fontSize: 40, fontWeight: 600, opacity: sp(t, cue(3), 0.5) }}>neues Bild</div>
      <Rv at={cue(3) + 2.4} dy={0} style={{ position: "absolute", left: 120, top: 830 }}>
        <Pill color={C.orange} size={36}><Icon name="check" size={32} color={C.orange} />Landet bei den Katzen</Pill>
      </Rv>
    </Szene>
  );
};

export default { umkehr: Umkehr, training: Training, inferenz: Inferenz, lernarten: Lernarten, ueberanpassung: Ueberanpassung, merkmalsraum: Merkmalsraum };
