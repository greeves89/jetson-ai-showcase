import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Chip, Zahlen, Karte, Dot } from "../bausteine.jsx";
import { Zettel, Pf, MONO, Etikett, Mark, Zeile } from "../neu.jsx";

const TOK = ["Der", "Koffer", "passt", "nicht", ",", "weil", "er", "zu", "groß", "ist", "."];
const FARB = [C.blue, C.green, C.orange, "#bf5af2", C.mute, C.blue, C.red, C.green, C.orange, "#bf5af2", C.mute];
const FS = 58, TY = 290, TH = 120;
const wB = (s) => Math.max(76, s.length * 33 + 44);
const wP = (s) => (s === "," || s === "." ? 20 : s.length * 31 + 6);
const GAP = 14, SPACE = 22;
const layout = (n) => {
  const brick = [], plain = [];
  let xb = 0, xp = 0;
  TOK.slice(0, n).forEach((s) => { brick.push(xb); xb += wB(s) + GAP; plain.push(xp); xp += wP(s) + (s === "," ? SPACE : SPACE); });
  const tb = xb - GAP, tp = xp - SPACE;
  return { brick, plain, tb, tp };
};
// Satzzeile: Text -> Token-Steine (Anker über mehrere Szenen). u: 0 Text, 1 Steine; n Tokens; hl Index; marke Index mit Leuchten
export function Satz({ u = 1, n = 11, hl = -1, arc = 0, neu = 0, y = TY }) {
  const L = layout(n);
  const x0 = (w) => 90 + (1740 - w) / 2;
  const base = lerp(x0(L.tp), x0(L.tb), u);
  return (
    <>
      {TOK.slice(0, n).map((s, i) => {
        const x = base + lerp(L.plain[i] - 0, L.brick[i] - 0, u) - lerp(0, 0, u);
        const x1 = lerp(x0(L.tp) + L.plain[i], x0(L.tb) + L.brick[i], u);
        const f = FARB[i];
        const w = lerp(wP(s), wB(s), u);
        const isNeu = i === n - 1 && neu > 0 && n === 10;
        return (
          <div key={i} style={{ position: "absolute", left: x1, top: y, width: w, height: TH, borderRadius: lerp(0, 22, u), background: u > 0.02 ? f + "26" : "transparent", border: `${4 * u}px solid ${hl === i ? "#fff" : f}`, borderColor: u > 0.02 ? (hl === i ? "#fff" : f) : "transparent", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: FS, fontWeight: 700, color: C.text, boxShadow: hl === i ? `0 0 40px ${C.orange}` : "none", whiteSpace: "nowrap" }}>{s}</div>
        );
      })}
    </>
  );
}
const xTok = (i, n = 11) => { const L = layout(n); return 90 + (1740 - L.tb) / 2 + L.brick[i] + wB(TOK[i]) / 2; };

// ---------- 1 Handy
const Handy = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tipp = ease(t, 0.9, 1.3);
  const keys = [10, 9, 7];
  const prob = [["groß", 62, C.green], ["klein", 14, C.mute], ["schwer", 9, C.mute], ["teuer", 5, C.mute]];
  return (
    <Szene titel="Das nächste Wort" tiefe={["message", 1500, 640, 800]}>
      <Panel x={90} y={215} w={860} h={760} r={32} a={o(0.2)} />
      <Lbl x={90} y={235} w={860} t="Handy" size={56} weight={800} align="center" color={C.mute} a={o(0.3)} />
      <div style={{ position: "absolute", left: 130, top: 330, width: 780, height: 130, borderRadius: 22, background: C.panel2, fontSize: 72, fontWeight: 700, display: "flex", alignItems: "center", padding: "0 34px", boxSizing: "border-box", opacity: o(0.4) }}>Guten<span style={{ color: C.blue, marginLeft: 6, opacity: Math.floor(t * 2) % 2 ? 0 : 1 }}>|</span></div>
      {["Morgen", "Tag", "Abend"].map((w, i) => (
        <div key={w} style={{ position: "absolute", left: 130 + i * 265, top: 490, width: 250, height: 100, borderRadius: 18, background: i === 0 ? C.blue : "#3a3a3c", border: `3px solid ${i === 0 ? "#fff" : C.line}`, fontSize: 48, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", opacity: o(0.9 + i * 0.25) }}>{w}</div>
      ))}
      {keys.map((n, r) => Array.from({ length: n }).map((_, k) => <div key={r + "-" + k} style={{ position: "absolute", left: 130 + k * (780 / n), top: 635 + r * 105, width: 780 / n - 12, height: 90, borderRadius: 14, background: "#2c2c2e", opacity: o(0.6 + r * 0.1) }} />))}
      <Panel x={1000} y={215} w={830} h={760} r={32} a={o(cue(1) - 0.2)} rand={C.blue} />
      <Lbl x={1000} y={235} w={830} t="Sprachmodell" size={56} weight={800} align="center" color={C.blue} a={o(cue(1) - 0.1)} />
      <div style={{ position: "absolute", left: 1040, top: 330, width: 750, fontSize: 52, fontWeight: 700, lineHeight: 1.2, opacity: o(cue(1)) }}>Der Koffer passt nicht, weil er zu <span style={{ color: C.green }}>…</span></div>
      {prob.map(([w, p, f], i) => (
        <React.Fragment key={w}>
          <Lbl x={1040} y={500 + i * 112} w={220} t={w} size={52} weight={800} color={i === 0 ? C.text : C.mute} a={o(cue(1) + 0.8 + i * 0.3)} />
          <div style={{ position: "absolute", left: 1270, top: 508 + i * 112, width: 420, height: 50, borderRadius: 25, background: "#2c2c2e", opacity: o(cue(1) + 0.8 + i * 0.3) }}><div style={{ width: 420 * p / 70 * ease(t, cue(1) + 1.0 + i * 0.3, cue(1) + 1.8 + i * 0.3), height: 50, borderRadius: 25, background: f }} /></div>
          <Lbl x={1700} y={500 + i * 112} w={120} t={p + " %"} size={48} color={f} a={o(cue(1) + 0.8 + i * 0.3)} />
        </React.Fragment>
      ))}
    </Szene>
  );
};

// ---------- 2 Token
const Anker2 = () => { const { t, cue } = useCues(); return <Satz u={ease(t, cue(0) + 1.4, cue(0) + 2.6)} />; };
const Token = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const kasten = ["Der", "und", "ist", "Haus", "Auto", "nicht", "zu", "weil", "ein", "Zahn", "arzt", "praxis", "Rüssel", "käfer", "ung", "heit"];
  return (
    <Szene titel="Token" tiefe={["box", 1500, 640, 800]} anker={<Anker2 />}>
      <Panel x={90} y={470} w={760} h={505} r={28} a={o(word(0, "Kasten") - 0.4)} rand={C.mute} />
      <Lbl x={90} y={485} w={760} t="fester Kasten" size={52} weight={800} align="center" color={C.mute} a={o(word(0, "Kasten") - 0.3)} />
      {kasten.map((w, i) => <div key={w} style={{ position: "absolute", left: 120 + (i % 4) * 180, top: 575 + Math.floor(i / 4) * 95, width: 165, height: 78, borderRadius: 16, background: FARB[i % 6] + "22", border: `3px solid ${FARB[i % 6]}`, fontSize: 38, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", opacity: o(word(0, "Kasten") - 0.2 + i * 0.05) }}>{w}</div>)}
      <Panel x={900} y={470} w={930} h={505} r={28} a={o(cue(1) - 0.2)} />
      {[["Haus", ["Haus"]], ["Rüsselkäfer", ["Rüssel", "käfer"]], ["Zahnarztpraxis", ["Zahn", "arzt", "praxis"]]].map(([w, parts], i) => (
        <React.Fragment key={w}>
          <Lbl x={930} y={515 + i * 150} w={330} t={w} size={40} color={C.mute} a={o(cue(1) + 0.2 + i * 0.8)} />
          <Lbl x={1240} y={510 + i * 150} w={60} t="→" size={52} a={o(cue(1) + 0.4 + i * 0.8)} />
          {parts.map((p, k) => <div key={p} style={{ position: "absolute", left: 1310 + k * 170, top: 495 + i * 150, width: 160, height: 92, borderRadius: 18, background: FARB[(i + k * 2) % 6] + "22", border: `4px solid ${FARB[(i + k * 2) % 6]}`, fontSize: 40, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", opacity: o(cue(1) + 0.4 + i * 0.8 + k * 0.2) }}>{p}</div>)}
        </React.Fragment>
      ))}
      <Lbl x={930} y={925} w={880} t="häufig: ein Stein, selten: mehrere" size={42} color={C.orange} a={o(cue(1) + 3.0)} />
    </Szene>
  );
};

// ---------- 3 Zahlen / Karte
const Anker3 = () => <Satz />;
const Karten = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const P = [["Auto", 330, 230, C.blue], ["Wagen", 470, 290, C.blue], ["Koffer", 900, 170, C.orange], ["Tasche", 1020, 240, C.orange], ["Zitrone", 1540, 300, C.green]];
  return (
    <Szene titel="Zahlen" tiefe={["grid", 1500, 640, 800]} anker={<Anker3 />}>
      {TOK.map((s, i) => <Zahlen key={i} x={xTok(i) - wB(s) / 2 + 6} y={425} w={wB(s) - 12} h={60} n={5} seed={i * 3 + 1} farbe={FARB[i]} a={ease(t, cue(0) + 0.8 + i * 0.25, cue(0) + 1.4 + i * 0.25)} />)}
      <Karte x={90} y={510} w={1740} h={465} a={o(word(0, "Stadtplan") - 0.5)} />
      {P.map(([n, x, y, f], i) => (
        <React.Fragment key={n}>
          <Dot x={90 + x} y={510 + y} r={22} f={f} a={o(word(0, "Stadtplan") + i * 0.3)} />
          <Lbl x={90 + x - 100} y={510 + y + 32} w={200} t={n} size={46} align="center" a={o(word(0, "Stadtplan") + i * 0.3)} />
        </React.Fragment>
      ))}
      <Chip x={90 + 330 + 20} y={510 + 60} t="ähnlich: nah beieinander" f={C.blue} size={46} a={o(cue(1) + 0.2)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}><line x1={420} y1={740} x2={560} y2={800} stroke={C.blue} strokeWidth="8" strokeLinecap="round" opacity={o(cue(1) + 0.3)} /></svg>
    </Szene>
  );
};

// ---------- 4 Aufmerksamkeit
const W = [0.04, 0.62, 0.05, 0.04, 0.0, 0.05, 0.0, 0.07, 0.09, 0.04, 0.0];
const Anker4 = () => { const { t, cue } = useCues(); return <Satz hl={t > cue(0) + 0.5 ? 6 : -1} />; };
const Aufm = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const bogen = (i, j, f, w, a) => { const x1 = xTok(i), x2 = xTok(j), y0 = TY; const h = 40 + Math.min(70, Math.abs(x1 - x2) * 0.1); return <path d={`M${x1} ${y0} C ${x1} ${y0 - h}, ${x2} ${y0 - h}, ${x2} ${y0}`} fill="none" stroke={f} strokeWidth={w} strokeLinecap="round" opacity={a} />; };
  const main = ease(t, word(0, "schaut") - 0.2, word(0, "schaut") + 0.7);
  const alle = ease(t, cue(1) + 0.3, cue(1) + 1.5);
  const MAT = [[0, 0.05], [1, 0.9], [2, 0.1]];
  return (
    <Szene titel="Aufmerksamkeit" tiefe={["eye", 1500, 640, 800]} anker={<Anker4 />}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {bogen(6, 1, C.orange, 14, main)}
        {[[6, 8, 7], [6, 7, 5], [6, 5, 4], [6, 9, 4]].map(([a, b, w], k) => bogen(a, b, C.blue, w, alle * 0.55))}
        {[[8, 7, 6], [2, 1, 6], [5, 2, 4], [9, 8, 4], [3, 2, 5], [7, 6, 4]].map(([a, b, w], k) => bogen(a, b, C.blue, w, alle * 0.4))}
      </svg>
      <Panel x={90} y={470} w={760} h={505} r={28} a={o(0.4)} />
      <Lbl x={90} y={485} w={760} t="Aufmerksamkeit von „er“" size={48} weight={800} align="center" color={C.mute} a={o(0.5)} />
      {TOK.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: 110, top: 540 + i * 39, width: 170, fontSize: 34, color: i === 1 ? C.orange : C.mute, fontWeight: 700, textAlign: "right", opacity: o(cue(0) + 0.6) }}>{s}</div>
          <div style={{ position: "absolute", left: 300, top: 547 + i * 39, width: 520, height: 26, borderRadius: 13, background: "#2c2c2e", opacity: o(cue(0) + 0.6) }}><div style={{ width: 520 * W[i] * main, height: 26, borderRadius: 13, background: i === 1 ? C.orange : C.blue }} /></div>
        </React.Fragment>
      ))}
      <Lbl x={900} y={500} w={930} t="er → Koffer" size={130} weight={800} color={C.orange} a={main} />
      <Lbl x={900} y={680} w={930} t="nicht: der Kofferraum, nicht: die Tür" size={46} color={C.mute} a={main} />
      <Etikett x={900} y={780} t="Jedes Token schaut auf wichtige Stellen" f={C.blue} size={42} a={o(cue(1) + 1.0)} />
    </Szene>
  );
};

// ---------- 5 Transformer
const Anker5 = () => { const { t, cue } = useCues(); const n = t > cue(1) + 3.4 ? 10 : 9; return <Satz n={n} />; };
const Transformer = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const prob = [["groß", 62, C.green], ["klein", 14, C.mute], ["schwer", 9, C.mute], ["teuer", 5, C.mute], ["…", 10, C.mute]];
  const wahl = ease(t, cue(1) + 2.2, cue(1) + 3.2);
  const fl = ease(t, cue(1) + 3.2, cue(1) + 4.4);
  return (
    <Szene titel="Transformer" tiefe={["network", 1500, 640, 800]} anker={<Anker5 />}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 90, top: 880 - i * 75, width: 700, height: 62, borderRadius: 16, background: C.panel2, border: `3px solid ${C.blue}`, opacity: o(0.2 + i * 0.25), display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", boxSizing: "border-box", fontSize: 36, fontWeight: 700, color: C.blue }}><span>Schicht {i + 1}</span><span style={{ color: C.mute, fontSize: 32 }}>Aufmerksamkeit</span></div>
      ))}
      <Pf x1={440} y1={965} x2={440} y2={930} p={1} f={C.mute} w={5} />
      <Pf x1={800} y1={650} x2={920} y2={650} p={ease(t, cue(1) - 0.3, cue(1) + 0.3)} f={C.mute} w={8} />
      <Panel x={940} y={470} w={890} h={505} r={28} a={o(cue(1) - 0.2)} rand={C.green} />
      <Lbl x={940} y={485} w={890} t="Wahrscheinlichkeiten" size={46} weight={800} align="center" color={C.mute} a={o(cue(1))} />
      {prob.map(([w, p, f], i) => (
        <React.Fragment key={w}>
          <Lbl x={980} y={555 + i * 68} w={200} t={w} size={46} weight={800} color={i === 0 && wahl > 0.3 ? C.green : C.text} a={o(cue(1) + 0.4 + i * 0.25)} />
          <div style={{ position: "absolute", left: 1200, top: 562 + i * 68, width: 480, height: 42, borderRadius: 21, background: "#2c2c2e", opacity: o(cue(1) + 0.4 + i * 0.25) }}><div style={{ width: 480 * p / 62 * ease(t, cue(1) + 0.6 + i * 0.25, cue(1) + 1.4 + i * 0.25), height: 42, borderRadius: 21, background: f }} /></div>
          <Lbl x={1690} y={558 + i * 68} w={130} t={p + " %"} size={40} color={f} a={o(cue(1) + 0.4 + i * 0.25)} />
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: lerp(1260, 1160, fl), top: lerp(900, 250, fl), opacity: wahl * (fl < 1 ? 1 : 0) }}><Etikett x={0} y={0} t="groß" f={C.green} size={54} /></div>
      <div style={{ position: "absolute", left: 970, top: 905, opacity: fl }}><Icon name="repeat" size={64} color={C.blue} /></div>
      <Lbl x={1050} y={910} w={760} t="anhängen, von vorn" size={46} color={C.blue} a={fl} />
    </Szene>
  );
};

// ---------- 6 Zwei Lernphasen
const Lernen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const gross = ease(t, cue(1) + 0.4, cue(1) + 1.6);
  return (
    <Szene titel="Zwei Lernphasen" tiefe={["book", 1500, 640, 800]}>
      <Panel x={90} y={215} w={850} h={470} r={28} a={o(0.2)} rand={C.blue} />
      <Lbl x={90} y={232} w={850} t="1  Vortraining" size={56} weight={800} align="center" color={C.blue} a={o(0.3)} />
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 130 + i * 70, top: 330 + i * 12, opacity: o(0.5 + i * 0.2) }}><Icon name="book" size={150} color={C.blue} sw={1.4} /></div>)}
      <div style={{ position: "absolute", left: 540, top: 360, width: 380, fontSize: 46, fontWeight: 700, lineHeight: 1.3, opacity: o(word(0, "rät") - 0.8) }}>Der Koffer passt <span style={{ background: C.orange + "44", border: `3px solid ${C.orange}`, borderRadius: 12, padding: "0 16px", color: C.orange }}>___</span> in den Wagen.</div>
      <Etikett x={540} y={580} t="rät das nächste Token" f={C.orange} size={44} a={o(word(0, "rät"))} />
      <Panel x={980} y={215} w={850} h={470} r={28} a={o(word(0, "Feinabstimmung") - 0.6)} rand={C.green} />
      <Lbl x={980} y={232} w={850} t="2  Feinabstimmung" size={56} weight={800} align="center" color={C.green} a={o(word(0, "Feinabstimmung") - 0.5)} />
      <div style={{ position: "absolute", left: 1020, top: 340, width: 500, height: 100, borderRadius: 24, background: C.panel2, fontSize: 44, fontWeight: 700, display: "flex", alignItems: "center", padding: "0 28px", boxSizing: "border-box", opacity: o(word(0, "Feinabstimmung")) }}>Fasse die Mail zusammen.</div>
      <div style={{ position: "absolute", left: 1170, top: 460, width: 600, height: 100, borderRadius: 24, background: C.green + "22", border: `3px solid ${C.green}`, fontSize: 44, fontWeight: 700, display: "flex", alignItems: "center", padding: "0 28px", boxSizing: "border-box", opacity: o(word(0, "Feinabstimmung") + 0.6) }}>Gern. Kurz gesagt: …</div>
      <div style={{ position: "absolute", left: 1700, top: 560, opacity: o(word(0, "Feinabstimmung") + 1.2) }}><Icon name="check" size={90} color={C.green} sw={3} /></div>
      <Pf x1={940} y1={450} x2={975} y2={450} p={ease(t, word(0, "Feinabstimmung") - 0.5, word(0, "Feinabstimmung") - 0.2)} f={C.mute} w={7} />
      {/* Größenvergleich */}
      <Panel x={90} y={720} w={1740} h={255} r={28} a={o(cue(1) - 0.2)} rand={C.orange} />
      <div style={{ position: "absolute", left: 170, top: 770, opacity: o(cue(1)) }}><Icon name="cpu" size={110} color={C.green} /></div>
      <Lbl x={310} y={775} w={500} t="Jetson: klein, lokal" size={52} weight={800} color={C.green} a={o(cue(1))} />
      <Lbl x={310} y={850} w={500} t="weiß weniger" size={44} color={C.mute} a={o(cue(1) + 0.4)} />
      {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 1170 + i * 130, top: 745, width: 112, height: 205, borderRadius: 14, background: C.panel2, border: `3px solid ${C.orange}`, opacity: gross * (i < 6 ? 1 : 0), transform: `scaleY(${lerp(0.3, 1, gross)})`, transformOrigin: "bottom" }}>
        {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 14, top: 20 + k * 44, width: 87, height: 28, borderRadius: 8, background: "#3a3a3c" }} />)}
      </div>)}
      <Lbl x={830} y={775} w={330} t="Rechenzentrum" size={48} weight={800} color={C.orange} a={gross} />
      <Lbl x={830} y={850} w={330} t="riesig, weiß mehr" size={42} color={C.mute} a={gross} />
    </Szene>
  );
};

export default { handy: Handy, token: Token, karte: Karten, aufmerksamkeit: Aufm, transformer: Transformer, lernen: Lernen };
