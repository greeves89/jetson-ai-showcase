import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Zeile, Pf, MONO, Etikett, Mark } from "../neu.jsx";

const SX = 90, SY = 215, SW = 1200, SH = 760, RPX = 1330, RPW = 500;
const AUTOS = [[70, "#c0392b"], [460, "#2e6fd9"], [860, "#d6a21f"]];
const BOXEN = [...AUTOS.map(([x]) => ({ x: x - 12, y: 515, w: 324, h: 224, n: "Auto", f: C.green })), { x: 585, y: 228, w: 110, h: 250, n: "Person", f: C.orange }];
const KP = { kopf: [640, 262], hals: [640, 305], sL: [600, 312], sR: [680, 312], eL: [588, 366], eR: [692, 366], wL: [614, 414], wR: [666, 414], hL: [615, 400], hR: [665, 400], kL: [598, 440], kR: [682, 440], aL: [606, 470], aR: [674, 470] };
const KNOCHEN = [["kopf", "hals"], ["hals", "sL"], ["hals", "sR"], ["sL", "eL"], ["eL", "wL"], ["sR", "eR"], ["eR", "wR"], ["hals", "hL"], ["hals", "hR"], ["hL", "hR"], ["hL", "kL"], ["kL", "aL"], ["hR", "kR"], ["kR", "aR"]];

const Auto = ({ x, f, seg }) => (
  <g>
    <path d={`M${x + 60} 592 L${x + 95} 530 H${x + 215} L${x + 255} 592 Z`} fill={seg ?? f} />
    {!seg && <path d={`M${x + 80} 585 L${x + 108} 540 H${x + 150} V585 Z M${x + 160} 585 V540 H${x + 207} L${x + 240} 585 Z`} fill="#cfe6ff" />}
    <rect x={x} y="585" width="300" height="102" rx="26" fill={seg ?? f} />
    {!seg && [70, 230].map((cx) => <g key={cx}><circle cx={x + cx} cy="690" r="38" fill="#1c1c1e" /><circle cx={x + cx} cy="690" r="16" fill="#8e8e93" /></g>)}
    {seg && [70, 230].map((cx) => <circle key={cx} cx={x + cx} cy="690" r="38" fill={seg} />)}
  </g>
);
const Mensch = ({ seg }) => (
  <g strokeLinecap="round" strokeLinejoin="round">
    <g stroke={seg ?? "#35507a"} strokeWidth="26" fill="none"><path d="M624 400 L606 470 M656 400 L674 470" /></g>
    <rect x="598" y="298" width="84" height="110" rx="22" fill={seg ?? "#2e7d6b"} />
    <g stroke={seg ?? "#2e7d6b"} strokeWidth="20" fill="none"><path d="M604 312 L588 366 L614 414 M676 312 L692 366 L666 414" /></g>
    <circle cx="640" cy="262" r="30" fill={seg ?? "#e0b99a"} />
    {!seg && <rect x="604" y="392" width="72" height="56" rx="6" fill="#c8a165" stroke="#8a6a3a" strokeWidth="4" />}
    {seg && <rect x="604" y="392" width="72" height="56" rx="6" fill={seg} />}
  </g>
);
// Straßenszene als Anker; Überlagerungen je Aufgabe
function Strasse({ boxen = 0, seg = 0, pose = 0, ocr = 0, zoom = 1, geo = [SX, SY, 1], blur = 0, boxN = 4 }) {
  const [gx, gy, gs] = geo;
  return (
    <div style={{ position: "absolute", left: gx, top: gy, width: SW, height: SH, transformOrigin: "0 0", transform: `scale(${gs})`, borderRadius: 24, overflow: "hidden", border: `${3 / gs}px solid ${C.line}`, boxSizing: "border-box", background: "#000" }}>
      <svg width={SW} height={SH} viewBox="0 0 1200 760" style={{ transformOrigin: "640px 380px", transform: `scale(${zoom})` }}>
        <defs><linearGradient id="himmel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fb4ff" /><stop offset="1" stopColor="#cfe6ff" /></linearGradient></defs>
        <rect width="1200" height="430" fill="url(#himmel)" />
        <g>{[[0, 420, 130, "#b9856a"], [420, 400, 80, "#d3c2a0"], [820, 380, 150, "#8f9bb3"]].map(([x, w, y, f], i) => (
          <g key={i}><rect x={x} y={y} width={w} height={430 - y} fill={f} />{i !== 0 && Array.from({ length: 3 }).map((_, k) => Array.from({ length: 2 }).map((__, j) => <rect key={k + "" + j} x={x + 50 + k * 120} y={y + 40 + j * 110} width="70" height="70" rx="6" fill="#2a3b55" opacity="0.8" />))}</g>
        ))}</g>
        <rect x="40" y="300" width="360" height="82" rx="8" fill="#2f7d4f" /><text x="220" y="360" textAnchor="middle" fontSize="58" fontWeight="800" fill="#fff" fontFamily="-apple-system, system-ui, sans-serif" letterSpacing="3">BÄCKEREI</text>
        <rect x="40" y="382" width="360" height="38" fill="#e9dcc3" /><rect x="190" y="382" width="60" height="38" fill="#6b4f2a" />
        <rect x="1004" y="340" width="12" height="130" fill="#6b6b70" /><circle cx="1010" cy="292" r="58" fill="#fff" stroke="#d93025" strokeWidth="14" /><text x="1010" y="313" textAnchor="middle" fontSize="60" fontWeight="800" fill="#111" fontFamily="-apple-system, system-ui, sans-serif">30</text>
        <rect y="420" width="1200" height="52" fill="#a8a8ad" /><rect y="472" width="1200" height="288" fill="#4b4b52" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={30 + i * 200} y="742" width="110" height="10" rx="5" fill="#e8e8ea" />)}
        <Mensch />
        {AUTOS.map(([x, f]) => <Auto key={x} x={x} f={f} />)}
        {/* Segmentierung: Flächenfarben */}
        <g opacity={seg * 0.78}>
          <rect width="1200" height="430" fill="#0a84ff" /><rect x="0" y="130" width="420" height="290" fill="#ff9f0a" /><rect x="420" y="80" width="400" height="340" fill="#ff9f0a" /><rect x="820" y="150" width="380" height="270" fill="#ff9f0a" />
          <rect y="420" width="1200" height="52" fill="#8e8e93" /><rect y="472" width="1200" height="288" fill="#bf5af2" />
          {AUTOS.map(([x]) => <Auto key={x} x={x} seg="#ff453a" />)}<Mensch seg="#ffd60a" />
        </g>
        {/* Erkennung */}
        {BOXEN.map((b, i) => { const a = Math.max(0, Math.min(1, boxen * 4 - i)); return (
          <g key={i} opacity={a}><rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke={b.f} strokeWidth="9" rx="8" />
            <rect x={b.x} y={b.y - 54} width={b.n === "Auto" ? 130 : 170} height="54" fill={b.f} rx="6" /><text x={b.x + 14} y={b.y - 13} fontSize="40" fontWeight="800" fill="#000" fontFamily="-apple-system, system-ui, sans-serif">{b.n}</text></g>
        ); })}
        {/* Pose */}
        <g opacity={pose}>
          {KNOCHEN.map(([a, b], i) => <line key={i} x1={KP[a][0]} y1={KP[a][1]} x2={KP[b][0]} y2={KP[b][1]} stroke="#fff" strokeWidth="6" strokeLinecap="round" />)}
          {Object.entries(KP).map(([k, p]) => <circle key={k} cx={p[0]} cy={p[1]} r="9" fill={C.orange} stroke="#000" strokeWidth="3" />)}
        </g>
        {/* Texterkennung */}
        <g opacity={ocr} fill="none" stroke={C.orange} strokeWidth="8"><rect x="50" y="300" width="340" height="80" rx="8" /><rect x="944" y="232" width="132" height="120" rx="10" /></g>
        {blur > 0 && <rect x="560" y="205" width="160" height="285" rx="14" fill="#000" opacity={blur * 0.82} />}
      </svg>
    </div>
  );
}
const Rechts = ({ children, a = 1 }) => <Panel x={RPX} y={SY} w={RPW} h={SH} r={24} a={a}>{children}</Panel>;
const Frage = ({ t, a = 1 }) => <Lbl x={30} y={30} w={RPW - 60} t={t} size={60} weight={800} a={a} />;

const FARB = ["#ff9f0a", "#30d158", "#bf5af2", "#ffffff", "#ff375f"];
// ---------- 1 Fragen
const Fragen = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const Q = [["Was ist das?", "tag"], ["Wo, wie viele?", "target"], ["Welche Pixel?", "grid"], ["Wo die Gelenke?", "users"], ["Was steht da?", "file"]];
  return (
    <Szene titel="Ein Bild" tiefe={["eye", 1500, 640, 800]} anker={<Strasse />}>
      {Q.map(([q, ic], i) => (
        <div key={q} style={{ position: "absolute", left: RPX, top: SY + i * 154, width: RPW, height: 134, borderRadius: 20, background: C.panel, border: `3px solid ${FARB[i]}`, opacity: o(cue(0) + 1.2 + i * 0.35), boxSizing: "border-box", display: "flex", alignItems: "center", gap: 18, padding: "0 24px", fontSize: 50, fontWeight: 800, color: C.text }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: FARB[i], color: "#000", fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{i + 1}</div>{q}
        </div>
      ))}
      <Etikett x={SX + 30} y={SY + SH - 100} t="Dasselbe Foto, fünf Aufgaben" f={C.blue} size={46} a={o(cue(1))} />
    </Szene>
  );
};
// ---------- 2 Klassifikation
const Klass = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const bars = [["Straße", 0.92, C.green], ["Park", 0.05, C.mute], ["Hafen", 0.03, C.mute]];
  return (
    <Szene titel="Klassifikation" tiefe={["tag", 1500, 640, 800]} anker={<Strasse />}>
      <Rechts a={o(0.2)}><Frage t="Was ist das?" />
        {bars.map(([n, v, f], i) => (
          <React.Fragment key={n}>
            <Lbl x={30} y={190 + i * 150} w={300} t={n} size={50} color={i === 0 ? C.text : C.mute} a={o(cue(0) + 0.8 + i * 0.3)} />
            <Lbl x={290} y={190 + i * 150} w={180} t={Math.round(v * 100) + " %"} size={50} align="right" color={f} a={o(cue(0) + 0.8 + i * 0.3)} />
            <div style={{ position: "absolute", left: 30, top: 262 + i * 150, width: 440, height: 36, borderRadius: 18, background: "#2c2c2e" }}><div style={{ width: 440 * v * ease(t, cue(0) + 1.0 + i * 0.3, cue(0) + 1.8 + i * 0.3), height: 36, borderRadius: 18, background: f }} /></div>
          </React.Fragment>
        ))}
        <Chip x={30} y={640} t="eine Klasse je Bild" f={C.green} size={44} a={o(cue(2) - 0.2)} />
      </Rechts>
      <Etikett x={SX + 30} y={SY + 30} t="Straße" f={C.green} size={64} a={o(cue(1) - 0.2)} />
    </Szene>
  );
};
// ---------- 3 Erkennung
const Erkennung = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const bx = ease(t, cue(0) + 1.4, cue(0) + 3.4);
  const n = Math.min(3, Math.floor(bx * 4));
  return (
    <Szene titel="Erkennung" tiefe={["target", 1500, 640, 800]} anker={<Strasse boxen={bx} />}>
      <Rechts a={o(0.2)}><Frage t="Wo ist es, und wie viele?" />
        <Lbl x={0} y={250} w={RPW} t={String(n)} size={260} weight={800} align="center" color={C.green} />
        <Lbl x={0} y={540} w={RPW} t="Autos" size={70} weight={800} align="center" />
        <Lbl x={0} y={650} w={RPW} t={bx > 0.9 ? "und 1 Person" : " "} size={50} align="center" color={C.orange} />
      </Rechts>
    </Szene>
  );
};
// ---------- 4 Segmentierung
const Segment = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const sg = ease(t, cue(0) + 0.8, cue(0) + 2.4);
  const fb = 1 - ease(t, 0, 0.5);
  const L = [["Himmel", "#0a84ff"], ["Haus", "#ff9f0a"], ["Straße", "#bf5af2"], ["Auto", "#ff453a"], ["Mensch", "#ffd60a"]];
  return (
    <Szene titel="Segmentierung" tiefe={["grid", 1500, 640, 800]} anker={<Strasse boxen={fb} seg={sg} />}>
      <Rechts a={o(0.2)}><Frage t="Welche Pixel gehören dazu?" />
        {L.map(([n, f], i) => (
          <div key={n} style={{ position: "absolute", left: 30, top: 270 + i * 88, display: "flex", alignItems: "center", gap: 22, opacity: o(cue(0) + 1.0 + i * 0.3) }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: f }} /><div style={{ fontSize: 50, fontWeight: 700 }}>{n}</div>
          </div>
        ))}
        <Chip x={30} y={700} t="jedes Pixel eine Klasse" f={C.orange} size={40} a={o(cue(1) + 1.0)} />
      </Rechts>
    </Szene>
  );
};
// ---------- 5 Pose
const Pose = () => {
  const { t, cue, dur } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const z = 1 + 1.3 * ease(t, 0.3, 1.5) - 1.3 * ease(t, dur - 1.4, dur - 0.3);
  const sg = 1 - ease(t, 0, 0.5);
  const ps = ease(t, cue(0) + 1.2, cue(0) + 2.4);
  const C3 = ["Knie gebeugt", "Rücken gerade", "Last nah am Körper"];
  return (
    <Szene titel="Pose" tiefe={["users", 1500, 640, 800]} anker={<Strasse seg={sg} pose={ps} zoom={z} />}>
      <Rechts a={o(0.2)}><Frage t="Wo sind die Gelenke?" />
        {C3.map((n, i) => (
          <React.Fragment key={n}>
            <Mark x={30} y={250 + i * 160} ok size={84} a={o(cue(1) + 0.4 + i * 0.5)} />
            <Lbl x={140} y={252 + i * 160} w={340} t={n} size={46} a={o(cue(1) + 0.4 + i * 0.5)} />
          </React.Fragment>
        ))}
      </Rechts>
    </Szene>
  );
};
// ---------- 6 Text
const Text = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const pf = 1 - ease(t, 0, 0.5);
  const oc = ease(t, cue(0) + 1.0, cue(0) + 1.8);
  return (
    <Szene titel="Texterkennung" tiefe={["file", 1500, 640, 800]} anker={<Strasse pose={pf} ocr={oc} />}>
      <Rechts a={o(0.2)}><Frage t="Was steht da?" />
        {["BÄCKEREI", "30"].map((s, i) => (
          <div key={s} style={{ position: "absolute", left: 30, top: 200 + i * 190, width: 440, height: 150, borderRadius: 18, background: "#0d0d0f", border: `3px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: i === 0 ? 62 : 110, fontWeight: 800, color: C.orange, opacity: o(cue(0) + 1.6 + i * 0.6), boxSizing: "border-box" }}>{s}</div>
        ))}
        <Chip x={30} y={640} t="Bild wird zu Text" f={C.orange} size={46} a={o(cue(1) + 0.2)} />
      </Rechts>
    </Szene>
  );
};
// ---------- 7 Wahl
const Wahl = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const u = ease(t, 0.2, 1.3);
  const L = [["Klassifikation", "Was ist das?"], ["Erkennung", "Wo, wie viele?"], ["Pose", "Wo die Gelenke?"], ["Texterkennung", "Was steht da?"], ["Segmentierung", "Welche Pixel?"]];
  return (
    <Szene titel="Die Wahl" tiefe={["shield", 1500, 640, 800]} anker={<Strasse geo={[lerp(SX, 1110, u), lerp(SY, 225, u), lerp(1, 0.6, u)]} blur={ease(t, cue(1) + 0.4, cue(1) + 1.2)} />}>
      <Pf x1={110} y1={250} x2={110} y2={930} p={ease(t, 0.5, 1.6)} f={C.mute} w={6} />
      {L.map(([n, q], i) => (
        <div key={n} style={{ position: "absolute", left: 160, top: 225 + i * 142, width: 880, height: 122, borderRadius: 22, background: i === 0 ? C.green + "22" : C.panel, border: `4px solid ${i === 0 ? C.green : C.line}`, opacity: o(0.4 + i * 0.25), boxSizing: "border-box", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 54, fontWeight: 800, color: i === 0 ? C.green : C.text }}>{n}</div><div style={{ fontSize: 42, color: C.mute, fontWeight: 600 }}>{q}</div>
        </div>
      ))}
      <Etikett x={160} y={945} t="einfachste, die genügt" f={C.green} size={44} a={o(cue(0) + 1.6)} />
      <Lbl x={130} y={870} w={250} t="" size={10} />
      <div style={{ position: "absolute", left: 1110, top: 735, opacity: o(cue(1) + 0.2) }}><Badge name="lock" size={210} color={C.orange} /></div>
      <Lbl x={1345} y={735} w={480} t="Datenschutz" size={72} weight={800} a={o(cue(1) + 0.3)} />
      <Lbl x={1345} y={835} w={480} t="Personen und Kennzeichen sind personenbezogen" size={44} color={C.mute} a={o(cue(1) + 0.6)} />
    </Szene>
  );
};

export default { fragen: Fragen, klass: Klass, erkennung: Erkennung, segment: Segment, pose: Pose, text: Text, wahl: Wahl };
