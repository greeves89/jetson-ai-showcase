import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, Pill, Pfeil, Pfad, C, rnd, spitze } from "../lib.jsx";

// Phasen: ein Motiv je Zeitraum, mit kurzem Ein- und Ausblenden
const ph = (t, a, b) => Math.min(ease(t, a, a + 0.4), 1 - ease(t, b - 0.4, b));
const Phase = ({ a, b, children }) => {
  const { t } = useCues();
  const o = ph(t, a, b);
  return <div style={{ position: "absolute", inset: 0, opacity: o, visibility: o <= 0.001 ? "hidden" : "visible" }}>{children}</div>;
};
const Kopf = ({ at, icon, color = C.blue, children }) => (
  <Rv at={at} dy={10} style={{ position: "absolute", left: 110, top: 246 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 52, fontWeight: 700, color }}><Icon name={icon} size={58} color={color} />{children}</div>
  </Rv>
);

const Einstieg = () => {
  const { t, cue, word } = useCues();
  const felder = [["factory", "Fertigung"], ["truck", "Logistik"], ["store", "Handel"], ["heart", "Gesundheit"], ["file", "Büro und Wissen"], ["shield", "Sicherheit"]];
  return (
    <Szene titel="Wo KI arbeitet" sub="Sechs Bereiche, ein Muster" tiefe={["factory", 1400, 660, 900]}>
      {felder.map(([ic, n], i) => {
        const x = 110 + (i % 3) * 385, y = 320 + Math.floor(i / 3) * 340;
        return (
          <Rv key={n} at={cue(0) + 0.5 + i * 0.4} s0={0.85} style={{ position: "absolute", left: x, top: y }}>
            <div style={{ width: 370 }}><Badge name={ic} size={200} /><div style={{ fontSize: 46, fontWeight: 600, marginTop: 14, lineHeight: 1.1 }}>{n}</div></div>
          </Rv>
        );
      })}
      <div style={{ position: "absolute", left: 1290, top: 320, width: 2, height: 640, background: C.line, opacity: sp(t, cue(1), 0.8) }} />
      <Rv at={cue(1) + 0.1} dx={40} style={{ position: "absolute", left: 1340, top: 330 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Badge name="user" size={170} color={C.green} />
          <div style={{ fontSize: 70, color: C.mute }}>+</div>
          <Badge name="bot" size={170} />
        </div>
      </Rv>
      <Txt at={cue(1) + 0.9} x={1340} y={560} w={480} size={58} weight={700}>Assistenz statt Ersatz</Txt>
      <Txt at={cue(1) + 1.2} x={1340} y={720} w={480} size={42} color={C.mute}>Die KI unterstützt, der Mensch entscheidet.</Txt>
      <Rv at={word(2, "drei Fragen")} dy={12} style={{ position: "absolute", left: 1340, top: 890 }}>
        <Pill color={C.orange} size={36}><Icon name="help" size={44} color={C.orange} />Am Ende: drei Fragen</Pill>
      </Rv>
    </Szene>
  );
};

const punktAuf = (pts, p) => {
  const ls = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const gesamt = ls.reduce((a, b) => a + b, 0);
  let d = p * gesamt;
  for (let i = 0; i < ls.length; i++) {
    if (d <= ls[i] || i === ls.length - 1) { const f = Math.min(1, d / ls[i]); return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; }
    d -= ls[i];
  }
};
const ROUTE = [[110, 940], [110, 605], [435, 605], [435, 310], [755, 310], [755, 605], [1075, 605], [1075, 900], [1395, 900], [1395, 605], [1740, 605]];
const SHELF = [[150, 360], [470, 360], [790, 360], [1110, 360], [1430, 360], [150, 650], [470, 650], [790, 650], [1110, 650], [1430, 650]];

const Fertigung = () => {
  const { t, cue, end } = useCues();
  const T2 = cue(2) - 0.3;           // Wechsel Förderband -> Lager
  const gehen = Math.max(0, Math.min(t, T2) - 0.2);
  const v = 140;
  const lauf = ease(t, cue(2) + 1.0, end(2) - 0.4);
  const dot = punktAuf(ROUTE, lauf);
  const pfadD = ROUTE.map((q, i) => `${i ? "L" : "M"}${q[0]} ${q[1]}`).join(" ");
  // das geprüfte Teil wandert vom Band ins Regal (Match-Cut)
  const m = ease(t, T2, T2 + 0.9);
  const bx = 400 + gehen * v, by = 545;            // Mitte auf dem Band
  const zx = 595, zy = 460;                          // Regalfach
  const tx = lerp(bx, zx, m), ty = lerp(by, zy, m);
  const tw = lerp(230, 190, m), th = lerp(190, 150, m);
  return (
    <Szene titel="Fertigung und Logistik" sub="Sehen, prüfen, planen" tiefe={["factory", 1400, 650, 900]}>
      <Phase a={0} b={T2 + 0.5}>
        <Kopf at={cue(0)} icon="factory">Sichtprüfung</Kopf>
        <div style={{ position: "absolute", left: 96, top: 640, width: 1728, height: 56, borderRadius: 28, background: C.panel2 }} />
        <div style={{ position: "absolute", left: 96, top: 330, width: 1728, height: 330, overflow: "hidden" }}>
          {[1, 2, 3, 4, 5].map((i) => {
            const cx = 400 + gehen * v - i * 400 - 96;
            const geprueft = cx + 96 > 1010;
            const defekt = i === 3;
            const rand = geprueft ? (defekt ? C.red : C.green) : C.mute;
            return (
              <div key={i} style={{ position: "absolute", left: cx - 115, top: 120, width: 230, height: 190, borderRadius: 30, background: "#2c2c2e", border: `6px solid ${rand}`, boxSizing: "border-box" }}>
                {defekt && <svg width="230" height="190" style={{ position: "absolute", left: -6, top: -6 }}><path d="M70 36 L112 92 L88 124 L146 166" stroke="#98989d" strokeWidth="7" fill="none" strokeLinecap="round" /></svg>}
                {geprueft && <div style={{ position: "absolute", left: 60, top: -96, width: 110, textAlign: "center" }}><Icon name={defekt ? "x" : "check"} size={90} color={rand} sw={3} /></div>}
              </div>
            );
          })}
        </div>
        <Rv at={cue(0) + 0.4} dy={-10} style={{ position: "absolute", left: 800, top: 270 }}>
          <svg width="320" height="400" viewBox="0 0 320 400"><path d="M120 110 L200 110 L290 390 L30 390 Z" fill={C.blue} opacity="0.22" /></svg>
          <div style={{ position: "absolute", left: 100, top: 0 }}><Badge name="camera" size={120} color={C.blue} /></div>
        </Rv>
        <Txt at={cue(1)} x={96} y={790} w={1728} size={64} weight={700} align="center">Die KI markiert Fehler.</Txt>
      </Phase>
      <Phase a={T2 + 0.4} b={9999}>
        <Kopf at={T2 + 0.5} icon="truck" color={C.green}>Logistik</Kopf>
        {SHELF.map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 250, height: 200, borderRadius: 26, background: C.panel, border: `3px solid ${C.line}` }}>
            {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 22, top: 22 + k * 56, width: 206, height: 40, borderRadius: 10, background: "#2c2c2e" }} />)}
          </div>
        ))}
        <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <Pfad d={pfadD} p={lauf} color={C.green} w={9} />
          <circle cx={ROUTE[0][0]} cy={ROUTE[0][1]} r={16} fill={C.green} />
          <circle cx={dot[0]} cy={dot[1]} r={22} fill={C.text} opacity={lauf > 0.001 ? 1 : 0} />
          <path d="M1740 605 v-70 l56 22 l-56 22" fill={C.green} stroke={C.green} strokeWidth="4" />
        </svg>
        <Txt at={cue(2) + 0.8} x={96} y={945} w={1728} size={52} color={C.mute} align="center">Die KI plant die Route</Txt>
      </Phase>
      <div style={{ position: "absolute", left: tx - tw / 2, top: ty - th / 2, width: tw, height: th, borderRadius: 28, background: "#2c2c2e", border: `6px solid ${(bx > 1010 || m > 0) ? C.green : C.mute}`, boxSizing: "border-box", opacity: t < T2 + 1.2 ? Math.min(ease(t, 0, 0.5), 1) : 1 }} />
    </Szene>
  );
};

const Handel = () => {
  const { t, cue, word, end } = useCues();
  const farben = ["#ff9f0a", "#0a84ff", "#30d158", "#bf5af2", "#ffd60a", "#64d2ff", "#ff453a", "#ff9f0a", "#0a84ff"];
  const P2 = cue(1) - 0.2;
  return (
    <Szene titel="Handel und Gesundheit" sub="Erkennen und unterstützen" tiefe={["store", 1400, 650, 900]}>
      <Phase a={0} b={P2 + 0.5}>
        <Kopf at={cue(0)} icon="store">Regale und Bedarf</Kopf>
        {[0, 1, 2].map((r) => (
          <React.Fragment key={r}>
            <Rv at={cue(0) + 0.3 + r * 0.2} dy={0}><div style={{ position: "absolute", left: 120, top: 460 + r * 175 - 6 + 0, width: 1680, height: 12, borderRadius: 6, background: C.line }} /></Rv>
            {farben.map((f, k) => {
              const leer = r === 1 && k === 3;
              const a = sp(t, cue(0) + 0.4 + r * 0.2 + k * 0.06, 0.6);
              const top = 340 + r * 175;
              return leer ? (
                <div key={k} style={{ position: "absolute", left: 140 + k * 185, top, width: 150, height: 120, borderRadius: 20, border: `5px dashed ${C.orange}`, opacity: ease(t, word(0, "leere"), word(0, "leere") + 0.5), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, fontWeight: 800, color: C.orange }}>!</div>
              ) : (
                <div key={k} style={{ position: "absolute", left: 140 + k * 185, top: top + (1 - a) * -24, width: 150, height: 120, borderRadius: 20, background: f + "55", border: `5px solid ${f}`, opacity: a }} />
              );
            })}
          </React.Fragment>
        ))}
        <Rv at={word(0, "leere") + 0.2} dy={10} style={{ position: "absolute", left: 120, top: 880 }}>
          <Pill color={C.orange} size={44}>leeres Fach erkannt</Pill>
        </Rv>
        <Rv at={word(0, "Bedarf")} dy={10} style={{ position: "absolute", left: 860, top: 850, width: 960 }}>
          <div style={{ fontSize: 46, fontWeight: 600, color: C.blue }}>Bedarf: wird geschätzt</div>
          <svg width="960" height="130" viewBox="0 0 960 130"><path d="M10 110 C 170 110, 220 80, 340 82 S 520 56, 640 50 S 840 22, 940 14" stroke={C.blue} strokeWidth="8" fill="none" strokeLinecap="round" /></svg>
        </Rv>
      </Phase>
      <Phase a={P2 + 0.3} b={9999}>
        <Kopf at={P2 + 0.4} icon="heart" color={C.green}>Bildauswertung</Kopf>
        <Rv at={P2 + 0.6} dy={0} style={{ position: "absolute", left: 110, top: 320 }}>
          <svg width="1000" height="620" viewBox="0 0 1000 620">
            <rect width="1000" height="620" rx="36" fill="#0b0b0d" stroke={C.line} strokeWidth="3" />
            {[270, 215, 160, 105].map((r, i) => <ellipse key={i} cx="500" cy="310" rx={r * 1.7} ry={r} fill="none" stroke="#636366" strokeWidth="4" opacity={0.35 + i * 0.12} />)}
            <ellipse cx="500" cy="310" rx="130" ry="80" fill="#48484a" opacity="0.5" />
            <circle cx="640" cy="260" r="28" fill="#e5e5ea" opacity="0.95" />
            <circle cx="640" cy="260" r={80 * sp(t, P2 + 1.6, 0.8)} fill="none" stroke={C.orange} strokeWidth="7" strokeDasharray="14 10" />
          </svg>
        </Rv>
        <Txt at={P2 + 2.0} x={1170} y={380} w={650} size={64} weight={700} color={C.orange}>auffällig</Txt>
        <Rv at={cue(2) + 0.2} dy={10} style={{ position: "absolute", left: 1170, top: 600, width: 650 }}>
          <Icon name="userCheck" size={110} color={C.green} />
          <div style={{ fontSize: 62, fontWeight: 700, marginTop: 14, lineHeight: 1.1 }}>Ärztin oder Arzt prüft</div>
          <div style={{ fontSize: 44, color: C.mute, marginTop: 10 }}>Die KI ist Assistenz und weist nur hin.</div>
        </Rv>
      </Phase>
    </Szene>
  );
};

const Wissen = () => {
  const { t, cue, word } = useCues();
  const P2 = cue(1) - 0.2;
  const t0 = P2 + 0.5;
  const ankunft = ease(t, t0, t0 + 1.0);
  const offen = sp(t, t0 + 1.1, 0.5);
  const x2start = t0 + 1.7;
  const ank2 = ease(t, x2start, x2start + 1.0);
  const nein = sp(t, x2start + 1.1, 0.5);
  const auf = offen > 0.5 && nein < 0.5;
  const x1 = lerp(110, 900, ankunft), x2 = lerp(110, 900, ank2);
  return (
    <Szene titel="Büro, Wissen, Sicherheit" sub="Fragen beantworten und Türen regeln" tiefe={["file", 1400, 650, 900]}>
      <Phase a={0} b={P2 + 0.5}>
        <Kopf at={cue(0)} icon="file">Dokumente</Kopf>
        <Rv at={cue(0) + 0.3} dx={-30} dy={0} style={{ position: "absolute", left: 110, top: 320 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}><Badge name="file" size={200} /><div style={{ fontSize: 56, fontWeight: 600, color: C.mute }}>Protokoll</div></div>
        </Rv>
        <Rv at={word(0, "fasst")} dx={30} dy={0} style={{ position: "absolute", left: 800, top: 300, width: 1020 }}>
          <div style={{ fontSize: 54, fontWeight: 700, color: C.blue, marginBottom: 14 }}>Zusammenfassung</div>
          {["Termin ist abgestimmt", "Aufgaben sind verteilt", "Nächster Schritt steht fest"].map((x, i) => (
            <div key={x} style={{ fontSize: 58, marginBottom: 14, opacity: sp(t, word(0, "fasst") + 0.3 + i * 0.35, 0.5), display: "flex", gap: 18, alignItems: "center" }}><Icon name="check" size={54} color={C.green} />{x}</div>
          ))}
        </Rv>
        <Rv at={word(0, "beantwortet")} dx={-30} dy={0} style={{ position: "absolute", left: 110, top: 700 }}>
          <div style={{ background: C.blue, borderRadius: 48, padding: "24px 52px", fontSize: 62, fontWeight: 500, display: "inline-block" }}>Was wurde beschlossen?</div>
        </Rv>
        <Rv at={word(0, "beantwortet") + 0.6} dy={8} style={{ position: "absolute", left: 110, top: 850 }}>
          <Pill color={C.green} size={50}><Icon name="file" size={52} color={C.green} />Antwort mit Quelle</Pill>
        </Rv>
      </Phase>
      <Phase a={P2 + 0.3} b={9999}>
        <Kopf at={P2 + 0.4} icon="shield" color={C.green}>Zutritt</Kopf>
        <div style={{ position: "absolute", left: 1330, top: 300 }}>
          <svg width="420" height="640" viewBox="0 0 200 300">
            <rect x="6" y="6" width="188" height="288" rx="14" fill={auf ? C.green + "22" : C.panel} stroke={auf ? C.green : C.line} strokeWidth="5" />
            {auf ? <path d="M30 24 L100 44 L100 266 L30 276 Z" fill={C.green + "55"} stroke={C.green} strokeWidth="4" strokeLinejoin="round" />
              : <g><rect x="30" y="24" width="140" height="252" rx="8" fill="#2c2c2e" stroke={C.mute} strokeWidth="3" /><circle cx="148" cy="152" r="8" fill={C.mute} /></g>}
          </svg>
        </div>
        <div style={{ position: "absolute", left: x1, top: 520, opacity: 1 - ease(t, t0 + 1.6, t0 + 2.1) }}><Badge name="user" size={230} color={C.green} /></div>
        <div style={{ position: "absolute", left: x2, top: 520, opacity: sp(t, x2start - 0.2, 0.4) }}><Badge name="user" size={230} color={nein > 0.5 ? C.red : C.mute} /></div>
        <div style={{ opacity: 1 - ease(t, x2start, x2start + 0.5) }}><Txt at={t0 + 1.1} x={110} y={820} w={1150} size={58} weight={700} color={C.green}>Berechtigung erkannt: Tür auf</Txt></div>
        <Rv at={x2start + 1.2} dy={8} style={{ position: "absolute", left: 110, top: 820 }}><div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 58, fontWeight: 700, color: C.red }}><Icon name="x" size={62} color={C.red} />Keine Berechtigung: Tür bleibt zu</div></Rv>
      </Phase>
    </Szene>
  );
};

const Fragen = () => {
  const { t, cue } = useCues();
  const Q = [
    ["fork", "Welche Entscheidung?", "soll die KI treffen oder vorbereiten", cue(1)],
    ["database", "Welche Daten?", "braucht sie, und darf sie diese nutzen", cue(2)],
    ["userCheck", "Wer prüft das Ergebnis?", "ein Mensch bleibt verantwortlich", cue(3)],
  ];
  const ok = sp(t, cue(4) + 0.3, 0.8);
  return (
    <Szene titel="Drei Fragen vor dem Einsatz" sub="Bevor KI in einen Ablauf kommt" tiefe={["help", 1420, 650, 900]}>
      {Q.map(([ic, q, d, at], i) => {
        const y = 290 + i * 190;
        return (
          <Rv key={q} at={at} dx={-40} dy={0} style={{ position: "absolute", left: 110, top: y }}>
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
              <div style={{ width: 96, height: 96, borderRadius: 48, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, fontWeight: 800 }}>{i + 1}</div>
              <Badge name={ic} size={150} />
              <div>
                <div style={{ fontSize: 78, fontWeight: 700, letterSpacing: -1.5 }}>{q}</div>
                <div style={{ fontSize: 46, color: C.mute, marginTop: 2 }}>{d}</div>
              </div>
            </div>
          </Rv>
        );
      })}
      {Q.map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 1690, top: 305 + i * 190, opacity: ok, transform: `scale(${lerp(0.6, 1, ok)})` }}>
          <div style={{ width: 110, height: 110, borderRadius: 55, background: C.green + "26", border: `4px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={64} color={C.green} sw={3} /></div>
        </div>
      ))}
      <Txt at={cue(4) + 0.2} x={110} y={860} w={1700} size={60} weight={700} color={C.green}>Alle drei klar: Der Einsatz lohnt sich.</Txt>
      <Rv at={cue(5) + 0.2} dy={10} style={{ position: "absolute", left: 110, top: 940 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 48, color: C.mute }}><Icon name="user" size={52} color={C.mute} />Sonst bleibt der Mensch am Steuer.</div>
      </Rv>
    </Szene>
  );
};

export default { einstieg: Einstieg, fertigung: Fertigung, handel: Handel, wissen: Wissen, fragen: Fragen };
