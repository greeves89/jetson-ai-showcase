import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, Pill, Pfeil, Pfad, C, rnd, spitze } from "../lib.jsx";

const Kopfzeile = ({ at, x, w = 700, icon, children, color = C.blue }) => (
  <Rv at={at} dy={14} style={{ position: "absolute", left: x, top: 350, width: w }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 38, fontWeight: 700, color }}><Icon name={icon} size={44} color={color} />{children}</div>
  </Rv>
);

const Einstieg = () => {
  const { t, cue, word } = useCues();
  const felder = [["factory", "Fertigung"], ["truck", "Logistik"], ["store", "Handel"], ["heart", "Gesundheit"], ["file", "Büro und Wissen"], ["shield", "Sicherheit"]];
  return (
    <Szene titel="Wo KI arbeitet" sub="Sechs Bereiche, ein Muster">
      {felder.map(([ic, n], i) => {
        const x = 120 + (i % 3) * 330, y = 400 + Math.floor(i / 3) * 250;
        return (
          <Rv key={n} at={cue(0) + 0.5 + i * 0.4} s0={0.85} style={{ position: "absolute", left: x, top: y }}>
            <div style={{ width: 300 }}><Badge name={ic} size={120} /><div style={{ fontSize: 36, fontWeight: 600, marginTop: 14 }}>{n}</div></div>
          </Rv>
        );
      })}
      <div style={{ position: "absolute", left: 1140, top: 400, width: 1, height: 480, background: C.line, opacity: sp(t, cue(1), 0.8) }} />
      <Rv at={cue(1) + 0.1} dx={40} style={{ position: "absolute", left: 1260, top: 440 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Badge name="user" size={140} color={C.green} />
          <div style={{ fontSize: 60, color: C.mute }}>+</div>
          <Badge name="bot" size={140} />
        </div>
      </Rv>
      <Txt at={cue(1) + 0.9} x={1260} y={620} w={540} size={46} weight={700}>Assistenz statt Ersatz</Txt>
      <Txt at={cue(1) + 1.2} x={1260} y={690} w={520} size={38} color={C.mute}>Die KI unterstützt, der Mensch entscheidet.</Txt>
      <Rv at={word(2, "drei Fragen")} dy={12} style={{ position: "absolute", left: 1260, top: 800 }}>
        <Pill color={C.orange} size={36}><Icon name="help" size={34} color={C.orange} />Am Ende: drei Fragen</Pill>
      </Rv>
    </Szene>
  );
};

// Punkt auf einem Linienzug
const punktAuf = (pts, p) => {
  const ls = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const gesamt = ls.reduce((a, b) => a + b, 0);
  let d = p * gesamt;
  for (let i = 0; i < ls.length; i++) {
    if (d <= ls[i] || i === ls.length - 1) { const f = Math.min(1, d / ls[i]); return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; }
    d -= ls[i];
  }
};
const ROUTE = [[1030, 880], [1030, 650], [1240, 650], [1240, 440], [1480, 440], [1480, 650], [1720, 650]];
const Fertigung = () => {
  const { t, cue, end } = useCues();
  const v = 105, t0 = cue(0) + 0.2;
  const gehen = Math.max(0, t - t0);
  const lauf = ease(t, cue(2) + 1.2, end(2) - 0.4);
  const dot = punktAuf(ROUTE, lauf);
  const pfadD = ROUTE.map((q, i) => `${i ? "L" : "M"}${q[0]} ${q[1]}`).join(" ");
  return (
    <Szene titel="Fertigung und Logistik" sub="Sehen, prüfen, planen">
      <Kopfzeile at={cue(0)} x={120} icon="factory">Sichtprüfung</Kopfzeile>
      {/* Förderband */}
      <div style={{ position: "absolute", left: 120, top: 560, width: 780, height: 300, overflow: "hidden", WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 50px, #000 730px, transparent 780px)" }}>
        <div style={{ position: "absolute", left: 0, top: 150, width: 780, height: 22, borderRadius: 11, background: C.panel2 }} />
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 330 + gehen * v - i * 230 - 120 + 0;
          const geprueft = x + 55 > 390 + 40;
          const defekt = i === 2;
          const rand = geprueft ? (defekt ? C.red : C.green) : C.mute;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 50, width: 110, height: 100, borderRadius: 18, background: "#2c2c2e", border: `4px solid ${rand}`, boxSizing: "border-box" }}>
              {defekt && <svg width="110" height="100" style={{ position: "absolute", left: -4, top: -4 }}><path d="M30 20 L52 48 L40 62 L68 86" stroke="#98989d" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>}
              {geprueft && <div style={{ position: "absolute", left: 20, top: -52, width: 70, textAlign: "center" }}><Icon name={defekt ? "x" : "check"} size={42} color={rand} sw={3} /></div>}
            </div>
          );
        })}
      </div>
      <Rv at={cue(0) + 0.4} dy={-10} style={{ position: "absolute", left: 420, top: 430 }}>
        <svg width="200" height="260" viewBox="0 0 200 260"><defs><linearGradient id="strahl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.blue} stopOpacity="0.55" /><stop offset="1" stopColor={C.blue} stopOpacity="0" /></linearGradient></defs><path d="M80 66 L120 66 L170 250 L30 250 Z" fill="url(#strahl)" /></svg>
        <div style={{ position: "absolute", left: 66, top: 0 }}><Badge name="camera" size={68} color={C.blue} /></div>
      </Rv>
      <Txt at={cue(1)} x={120} y={900} w={780} size={38} color={C.mute}>Eine Kamera prüft jedes Teil, die KI markiert Fehler.</Txt>
      <div style={{ position: "absolute", left: 960, top: 370, width: 1, height: 540, background: C.line, opacity: sp(t, cue(2), 0.8) }} />
      <Kopfzeile at={cue(2)} x={1030} icon="truck" color={C.green}>Logistik</Kopfzeile>
      {/* Lager von oben */}
      <Rv at={cue(2) + 0.3} dy={0}>
        {[[1060, 460], [1060, 700], [1300, 460], [1300, 700], [1540, 460], [1540, 700]].map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 150, height: 150, borderRadius: 18, background: C.panel, border: `2px solid ${C.line}` }}>
            {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 14, top: 14 + k * 44, width: 122, height: 32, borderRadius: 8, background: "#2c2c2e" }} />)}
          </div>
        ))}
      </Rv>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <Pfad d={pfadD} p={lauf} color={C.green} w={7} />
        <circle cx={ROUTE[0][0]} cy={ROUTE[0][1]} r={13} fill={C.green} opacity={sp(t, cue(2) + 0.6, 0.5)} />
        <circle cx={dot[0]} cy={dot[1]} r={17} fill={C.text} opacity={lauf > 0.001 ? 1 : 0} />
      </svg>
      <Txt at={cue(2) + 0.8} x={1000} y={905} w={800} size={38} color={C.mute}>Start, Ziel und Route durchs Lager</Txt>
    </Szene>
  );
};

const Handel = () => {
  const { t, cue, word, end } = useCues();
  const farben = ["#ff9f0a", "#0a84ff", "#30d158", "#bf5af2", "#ffd60a", "#64d2ff", "#ff453a"];
  return (
    <Szene titel="Handel und Gesundheit" sub="Erkennen und unterstützen">
      <Kopfzeile at={cue(0)} x={120} icon="store">Regale und Bedarf</Kopfzeile>
      {[0, 1, 2].map((r) => (
        <React.Fragment key={r}>
          <Rv at={cue(0) + 0.3 + r * 0.2} dy={0}><div style={{ position: "absolute", left: 120, top: 530 + r * 120, width: 780, height: 10, borderRadius: 5, background: C.line }} /></Rv>
          {farben.map((f, k) => {
            const leer = r === 1 && k === 3;
            const a = sp(t, cue(0) + 0.4 + r * 0.2 + k * 0.06, 0.6);
            return leer ? (
              <div key={k} style={{ position: "absolute", left: 130 + k * 108, top: 450 + r * 120, width: 90, height: 80, borderRadius: 12, border: `3px dashed ${C.orange}`, opacity: ease(t, word(0, "leere"), word(0, "leere") + 0.5), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 800, color: C.orange }}>!</div>
            ) : (
              <div key={k} style={{ position: "absolute", left: 130 + k * 108, top: 450 + r * 120 + (1 - a) * -20, width: 90, height: 80, borderRadius: 12, background: f + "55", border: `3px solid ${f}`, opacity: a }} />
            );
          })}
        </React.Fragment>
      ))}
      <Rv at={word(0, "leere") + 0.2} dy={10} style={{ position: "absolute", left: 120, top: 800 }}>
        <Pill color={C.orange} size={36} pad="6px 18px">leeres Fach erkannt</Pill>
      </Rv>
      <Rv at={word(0, "Bedarf")} dy={10} style={{ position: "absolute", left: 120, top: 868, width: 780 }}>
        <svg width="780" height="110" viewBox="0 0 780 110"><path d="M10 90 C 120 90, 160 60, 260 62 S 420 40, 520 36 S 680 14, 760 10" stroke={C.blue} strokeWidth="6" fill="none" strokeLinecap="round" /><path d="M520 36 S 680 14, 760 10" stroke={C.blue} strokeWidth="6" strokeDasharray="4 12" fill="none" strokeLinecap="round" /></svg>
        <div style={{ position: "absolute", left: 10, top: 6, fontSize: 36, fontWeight: 600, color: C.blue }}>Bedarf: wird geschätzt</div>
      </Rv>
      <div style={{ position: "absolute", left: 960, top: 370, width: 1, height: 540, background: C.line, opacity: sp(t, cue(1), 0.8) }} />
      <Kopfzeile at={cue(1)} x={1030} icon="heart" color={C.green}>Bildauswertung</Kopfzeile>
      <Rv at={cue(1) + 0.3} dy={0} style={{ position: "absolute", left: 1030, top: 440 }}>
        <svg width="560" height="340" viewBox="0 0 560 340">
          <rect width="560" height="340" rx="24" fill="#0b0b0d" stroke={C.line} strokeWidth="2" />
          {[150, 120, 90, 60].map((r, i) => <ellipse key={i} cx="280" cy="170" rx={r * 1.6} ry={r} fill="none" stroke="#636366" strokeWidth="3" opacity={0.35 + i * 0.12} />)}
          <ellipse cx="280" cy="170" rx="70" ry="44" fill="#48484a" opacity="0.5" />
          <circle cx="352" cy="140" r="16" fill="#e5e5ea" opacity="0.9" />
        </svg>
        <svg width="560" height="340" viewBox="0 0 560 340" style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx="352" cy="140" r={46 * sp(t, cue(1) + 1.4, 0.8)} fill="none" stroke={C.orange} strokeWidth="5" strokeDasharray="10 8" />
        </svg>
        <div style={{ position: "absolute", left: 410, top: 60, opacity: sp(t, cue(1) + 1.8, 0.6), fontSize: 36, fontWeight: 700, color: C.orange }}>auffällig</div>
      </Rv>
      <Rv at={cue(2) + 0.2} dy={10} style={{ position: "absolute", left: 1030, top: 830, width: 770 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Icon name="userCheck" size={54} color={C.green} />
          <div><div style={{ fontSize: 36, fontWeight: 700 }}>Ärztin oder Arzt prüft</div><div style={{ fontSize: 36, color: C.mute }}>Die KI ist Assistenz und weist nur hin.</div></div>
        </div>
      </Rv>
    </Szene>
  );
};

const Wissen = () => {
  const { t, cue, word, end } = useCues();
  const ankunft = ease(t, cue(1) + 0.2, cue(1) + 1.0);
  const x1 = lerp(1060, 1390, ankunft);
  const offen = sp(t, cue(1) + 1.1, 0.5);
  const x2start = cue(1) + 1.8;
  const ank2 = ease(t, x2start, x2start + 1.0);
  const x2 = lerp(1060, 1390, ank2);
  const nein = sp(t, x2start + 1.1, 0.5);
  return (
    <Szene titel="Büro, Wissen, Sicherheit" sub="Fragen beantworten und Türen regeln">
      <Kopfzeile at={cue(0)} x={120} icon="file">Dokumente</Kopfzeile>
      <Rv at={cue(0) + 0.3} dx={-30} dy={0} style={{ position: "absolute", left: 120, top: 440 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Badge name="file" size={110} />
          <div style={{ fontSize: 36, color: C.mute }}>Protokoll</div>
        </div>
      </Rv>
      <Rv at={word(0, "fasst")} dx={30} dy={0} style={{ position: "absolute", left: 120, top: 590, width: 780 }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: C.blue, marginBottom: 12 }}>Zusammenfassung</div>
        {["Termin ist abgestimmt", "Aufgaben sind verteilt", "Nächster Schritt steht fest"].map((x, i) => (
          <div key={x} style={{ fontSize: 36, marginBottom: 10, opacity: sp(t, word(0, "fasst") + 0.3 + i * 0.35, 0.5), display: "flex", gap: 14, alignItems: "center" }}><Icon name="check" size={32} color={C.green} />{x}</div>
        ))}
      </Rv>
      <Rv at={word(0, "beantwortet")} dx={-30} dy={0} style={{ position: "absolute", left: 460, top: 440 }}>
        <div style={{ background: C.blue, borderRadius: 26, padding: "16px 28px", fontSize: 36, fontWeight: 500 }}>Was wurde beschlossen?</div>
      </Rv>
      <Rv at={word(0, "beantwortet") + 0.6} dy={8} style={{ position: "absolute", left: 460, top: 520 }}>
        <Pill color={C.green} size={36} pad="6px 18px"><Icon name="file" size={28} color={C.green} />Antwort mit Quelle</Pill>
      </Rv>
      <div style={{ position: "absolute", left: 960, top: 370, width: 1, height: 540, background: C.line, opacity: sp(t, cue(1), 0.8) }} />
      <Kopfzeile at={cue(1)} x={1030} icon="shield" color={C.green}>Zutritt</Kopfzeile>
      {/* Tür */}
      <Rv at={cue(1) + 0.2} dy={0} style={{ position: "absolute", left: 1560, top: 470 }}>
        <svg width="200" height="300" viewBox="0 0 200 300">
          <rect x="6" y="6" width="188" height="288" rx="14" fill={offen > 0.5 && nein < 0.5 ? C.green + "22" : C.panel} stroke={offen > 0.5 && nein < 0.5 ? C.green : C.line} strokeWidth="6" />
          {offen > 0.5 && nein < 0.5
            ? <path d="M30 24 L100 44 L100 266 L30 276 Z" fill={C.green + "55"} stroke={C.green} strokeWidth="5" strokeLinejoin="round" />
            : <g><rect x="30" y="24" width="140" height="252" rx="8" fill="#2c2c2e" stroke={C.mute} strokeWidth="4" /><circle cx="148" cy="152" r="9" fill={C.mute} /></g>}
        </svg>
      </Rv>
      <Rv at={cue(1) + 0.2} dy={0} style={{ position: "absolute", left: x1, top: 560 }}>
        <div style={{ opacity: 1 - ease(t, cue(1) + 1.5, cue(1) + 2.0) }}><Badge name="user" size={110} color={C.green} /></div>
      </Rv>
      <Rv at={x2start - 0.2} dy={0} style={{ position: "absolute", left: x2, top: 560 }}>
        <Badge name="user" size={110} color={nein > 0.5 ? C.red : C.mute} />
      </Rv>
      <div style={{ opacity: 1 - ease(t, x2start, x2start + 0.5) }}><Txt at={cue(1) + 1.1} x={1060} y={760} w={600} size={38} weight={600} color={C.green}>Berechtigung erkannt: Tür auf</Txt></div>
      <Rv at={x2start + 1.2} dy={8} style={{ position: "absolute", left: 1060, top: 830, display: "flex", gap: 12, alignItems: "center", fontSize: 36, fontWeight: 600, color: C.red }}><Icon name="x" size={36} color={C.red} />Keine Berechtigung: Tür bleibt zu</Rv>
    </Szene>
  );
};

const Fragen = () => {
  const { t, cue, end } = useCues();
  const Q = [
    ["fork", "Welche Entscheidung?", "soll die KI treffen oder vorbereiten", cue(1)],
    ["database", "Welche Daten?", "braucht sie, und darf sie diese nutzen", cue(2)],
    ["userCheck", "Wer prüft das Ergebnis?", "ein Mensch bleibt verantwortlich", cue(3)],
  ];
  const ok = sp(t, cue(4) + 0.3, 0.8);
  return (
    <Szene titel="Drei Fragen vor dem Einsatz" sub="Bevor KI in einen Ablauf kommt">
      {Q.map(([ic, q, d, at], i) => {
        const y = 360 + i * 170;
        return (
          <Rv key={q} at={at} dx={-40} dy={0} style={{ position: "absolute", left: 120, top: y }}>
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800 }}>{i + 1}</div>
              <Badge name={ic} size={110} />
              <div>
                <div style={{ fontSize: 58, fontWeight: 700, letterSpacing: -1 }}>{q}</div>
                <div style={{ fontSize: 36, color: C.mute, marginTop: 4 }}>{d}</div>
              </div>
            </div>
          </Rv>
        );
      })}
      {Q.map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 1620, top: 372 + i * 170, opacity: ok, transform: `scale(${lerp(0.6, 1, ok)})` }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: C.green + "26", border: `3px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={44} color={C.green} sw={3} /></div>
        </div>
      ))}
      <Txt at={cue(4) + 0.2} x={120} y={880} w={1500} size={40} weight={700} color={C.green}>Alle drei klar: Der Einsatz lohnt sich.</Txt>
      <Rv at={cue(5) + 0.2} dy={10} style={{ position: "absolute", left: 120, top: 945 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, color: C.mute }}><Icon name="user" size={36} color={C.mute} />Sonst bleibt der Mensch am Steuer.</div>
      </Rv>
    </Szene>
  );
};

export default { einstieg: Einstieg, fertigung: Fertigung, handel: Handel, wissen: Wissen, fragen: Fragen };
