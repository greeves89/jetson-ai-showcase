import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Chip, Zahlen } from "../bausteine.jsx";
import { Zeile, Pf, MONO, Etikett, Mark } from "../neu.jsx";
import exA from "../img/ex-schraube.jpg";
import exB from "../img/ex-mutter.jpg";
import exC from "../img/ex-scheibe.jpg";

const CW = 80, GX = 90, GY = 215, OX = 960, NC = 10, NR = 8;
const HAUS = ["..........", "........SS", "....RR....", "...RRRR...", "..RRRRRR..", "..WFWWWW..", "..WFWWDW..", "gggggggggg"];
const WERT = { ".": 225, S: 255, R: 60, W: 150, F: 240, D: 40, g: 110 };
const IMG = HAUS.flatMap((r) => r.split("").map((c) => WERT[c]));
const K = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
const conv = (r, c) => { let v = 0; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) v += K[j * 3 + i] * IMG[(r - 1 + j) * NC + (c - 1 + i)]; return v; };
const KANT = Array.from({ length: NC * NR }).map((_, i) => { const r = Math.floor(i / NC), c = i % NC; return r < 1 || r > NR - 2 || c < 1 || c > NC - 2 ? 0 : Math.min(1, Math.abs(conv(r, c)) / 480); });
const POS = Array.from({ length: 48 }).map((_, k) => [1 + Math.floor(k / 8), 1 + (k % 8)]);

// Raster aus Zellen: Bild (Grauwerte) oder Ergebnis (Kantenstärke)
function Gitter({ x, y, cell = CW, modus = "bild", zahlen = 0, bis = 80, aktiv = null, leucht = 0, a = 1 }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: NC * cell, height: NR * cell, opacity: a, borderRadius: cell * 0.2, overflow: "hidden", border: `3px solid ${C.line}`, boxSizing: "content-box", marginLeft: -3, marginTop: -3 }}>
      {IMG.map((v, i) => {
        const r = Math.floor(i / NC), c = i % NC;
        const idx = POS.findIndex((p) => p[0] === r && p[1] === c);
        const fertig = modus === "bild" || (idx >= 0 && idx < bis);
        const g = modus === "bild" ? v : Math.round(255 * KANT[i] * (fertig ? 1 : 0));
        const cur = aktiv && aktiv[0] === r && aktiv[1] === c;
        return (
          <div key={i} style={{ position: "absolute", left: c * cell, top: r * cell, width: cell, height: cell, background: `rgb(${g},${g},${g})`, boxShadow: `inset 0 0 0 1.5px rgba(0,0,0,0.5)${modus === "kante" && g > 120 && leucht ? `, 0 0 ${leucht * 24}px ${leucht * 6}px rgba(255,255,255,${0.5 * leucht})` : ""}`, outline: cur ? `5px solid ${C.orange}` : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {zahlen > 0 && <span style={{ fontFamily: MONO, fontSize: 40, fontWeight: 700, color: v > 130 ? "#111" : "#fff", opacity: zahlen }}>{v}</span>}
          </div>
        );
      })}
    </div>
  );
}
// vektorgrafisches Haus (dieselbe Szene wie das Raster)
const Haus = ({ x, y, w = 800, h = 640 }) => (
  <svg style={{ position: "absolute", left: x, top: y, borderRadius: 16 }} width={w} height={h} viewBox="0 0 800 640">
    <rect width="800" height="640" fill="#8ec5ff" /><rect y="560" width="800" height="80" fill="#4c9a52" />
    <circle cx="730" cy="95" r="52" fill="#ffd60a" />
    <polygon points="140,220 400,70 660,220 660,260 140,260" fill="#c0392b" /><polygon points="130,300 400,110 670,300" fill="#c0392b" opacity="0" />
    <rect x="165" y="250" width="470" height="310" fill="#d9b88f" /><polygon points="130,260 400,60 670,260" fill="#b8402e" />
    <rect x="215" y="330" width="130" height="130" fill="#ffe27a" stroke="#6b4f2a" strokeWidth="10" /><path d="M280 330v130M215 395h130" stroke="#6b4f2a" strokeWidth="8" />
    <rect x="470" y="380" width="110" height="180" fill="#6b4f2a" />
  </svg>
);

// ---------- 1 Frage
const Anker1 = () => { const { t } = useCues(); return <Gitter x={GX} y={GY} zahlen={ease(t, 0.5, 1.4)} />; };
const Frage = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Die Frage" tiefe={["help", 1500, 640, 800]} anker={<Anker1 />}>
      <Lbl x={GX} y={870} w={800} t="Tabelle aus Zahlen" size={56} align="center" color={C.mute} a={o(cue(0) + 0.4)} />
      <Lbl x={OX} y={870} w={800} t="Haus" size={56} align="center" color={C.mute} a={o(cue(0) + 1.2)} />
      <div style={{ opacity: o(cue(0) + 1.0) }}><Haus x={OX} y={GY} /></div>
      <div style={{ position: "absolute", left: 868, top: 460, opacity: o(cue(0) + 2.0) }}><Badge name="help" size={100} color={C.orange} bg="#000" /></div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: OX + 360 + i * 12, top: GY + 250 + i * 12, width: 200, height: 200, borderRadius: 16, border: `5px dashed ${C.orange}`, background: "#ff9f0a22", opacity: o(cue(1) + i * 0.25), transform: `rotate(${(i - 1) * 4}deg)` }} />
      ))}
      <Etikett x={OX + 180} y={GY + 20} t="Schablone" f={C.orange} size={52} a={o(word(1, "Schablonen"))} />
    </Szene>
  );
};

// ---------- 2 Filter
const posNr = (t, cue) => Math.max(0, Math.min(47, Math.floor(lin(t, cue(1) + 0.1, cue(2) + 3.8, 0, 48))));
const Anker2 = () => {
  const { t, cue } = useCues();
  const k = t < cue(1) + 0.1 ? 0 : posNr(t, cue), p = POS[k];
  return (
    <>
      <Gitter x={GX} y={GY} aktiv={null} />
      <Gitter x={OX} y={GY} modus="kante" bis={t < cue(1) + 0.1 ? 0 : k + 1} aktiv={t < cue(1) ? null : p} />
    </>
  );
};
const Filter = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const k = t < cue(1) + 0.1 ? 0 : posNr(t, cue), p = POS[k];
  const wx = GX + (p[1] - 1) * CW, wy = GY + (p[0] - 1) * CW;
  const kernA = o(cue(0) + 1.0);
  return (
    <Szene titel="Der Filter" tiefe={["grid", 1500, 640, 800]} anker={<Anker2 />}>
      <div style={{ position: "absolute", left: wx, top: wy, width: 3 * CW, height: 3 * CW, border: `7px solid ${C.orange}`, borderRadius: 14, boxSizing: "border-box", opacity: kernA, background: "#ff9f0a14" }}>
        {K.map((w, i) => (
          <div key={i} style={{ position: "absolute", left: (i % 3) * CW + 12, top: Math.floor(i / 3) * CW + 12, width: CW - 24, height: CW - 24, borderRadius: 10, background: "#000b", color: w === 0 ? C.mute : w > 0 ? C.green : C.red, fontSize: 42, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO }}>{w > 0 ? "+" + w : w === 0 ? "0" : "−1"}</div>
        ))}
      </div>
      <Lbl x={GX} y={870} w={800} t="Bild" size={56} align="center" color={C.mute} a={o(cue(0) + 0.3)} />
      <Lbl x={OX} y={870} w={800} t="Ergebnis: eine Zahl je Position" size={50} align="center" color={C.orange} a={o(cue(2))} />
      <Pf x1={wx + 3 * CW + 10} y1={wy + 1.5 * CW} x2={OX + p[1] * CW + CW / 2 - 50} y2={GY + p[0] * CW + CW / 2} p={ease(t, cue(1) + 0.2, cue(1) + 0.7)} f={C.orange} w={5} dash="14 12" />
    </Szene>
  );
};

// ---------- 3 Kanten
const Anker3 = () => { const { t } = useCues(); return (<><Gitter x={GX} y={GY} /><Gitter x={OX} y={GY} modus="kante" bis={48} leucht={ease(t, 0.3, 1.3)} /></>); };
const Kanten = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ring = (cx, cy, rx, ry, a, f) => <div style={{ position: "absolute", left: OX + cx * CW - rx, top: GY + cy * CW - ry, width: rx * 2, height: ry * 2, borderRadius: 60, border: `6px solid ${f}`, opacity: a, boxSizing: "border-box" }} />;
  return (
    <Szene titel="Kanten leuchten" tiefe={["zap", 1500, 640, 800]} anker={<Anker3 />}>
      {ring(2.0, 6, 70, 110, o(cue(0) + 0.8), C.orange)}{ring(8.0, 6, 70, 110, o(cue(0) + 1.0), C.orange)}
      <Etikett x={OX + 180} y={GY + 20} t="dunkel → hell: leuchtet" f={C.orange} size={44} a={o(cue(0) + 1.2)} />
      {ring(5, 0.6, 300, 90, o(cue(1)), C.blue)}
      <Etikett x={OX + 200} y={GY + 140} t="glatte Fläche: dunkel" f={C.blue} size={44} a={o(cue(1) + 0.2)} />
      <Lbl x={GX} y={870} w={800} t="Bild" size={56} align="center" color={C.mute} />
      <Lbl x={OX} y={870} w={800} t="Kantenfilter" size={56} align="center" color={C.mute} />
    </Szene>
  );
};

// ---------- 4 Schichten
const PX = [90, 690, 1290], PW = 540, PY = 240, PH = 600;
const Anker4 = () => {
  const { t, cue } = useCues();
  const u = ease(t, 0.1, 1.2);
  return <Gitter x={lerp(OX, 110, u)} y={lerp(GY, 330, u)} cell={lerp(CW, 50, u)} modus="kante" bis={48} leucht={1 - u} />;
};
const Schichten = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const nm = [["Schicht 1", "Kanten"], ["Schicht 2", "Formen"], ["Schicht 3", "Fenster, Türen"]];
  const at = [cue(1) - 0.2, word(1, "mittleren") - 0.4, word(1, "letzten") - 0.4];
  return (
    <Szene titel="Schichten" tiefe={["network", 1500, 640, 800]} anker={<Anker4 />}>
      {PX.map((x, i) => (
        <React.Fragment key={i}>
          <Panel x={x} y={PY} w={PW} h={PH} r={24} a={i === 0 ? sp(t, 0.1, 0.5) : o(at[i])} />
          <Lbl x={x} y={PY + PH + 24} w={PW} t={nm[i][1]} size={60} weight={800} align="center" color={[C.blue, C.green, C.orange][i]} a={o(at[i])} />
          <Lbl x={x} y={PY + PH + 100} w={PW} t={nm[i][0]} size={42} align="center" color={C.mute} a={o(at[i])} />
        </React.Fragment>
      ))}
      <Pf x1={640} y1={PY + PH / 2} x2={690 + 0} y2={PY + PH / 2} p={ease(t, at[1] - 0.3, at[1])} f={C.mute} />
      <Pf x1={1240} y1={PY + PH / 2} x2={1290} y2={PY + PH / 2} p={ease(t, at[2] - 0.3, at[2])} f={C.mute} />
      <svg style={{ position: "absolute", left: PX[1], top: PY, width: PW, height: PH, opacity: o(at[1]) }} viewBox="0 0 540 600">
        <polygon points="120,300 270,150 420,300" fill="none" stroke={C.green} strokeWidth="14" strokeLinejoin="round" />
        <rect x="150" y="300" width="240" height="200" fill="none" stroke={C.green} strokeWidth="14" />
      </svg>
      <svg style={{ position: "absolute", left: PX[2], top: PY, width: PW, height: PH, opacity: o(at[2]) }} viewBox="0 0 540 600">
        <rect x="60" y="150" width="190" height="190" fill="#ffe27a33" stroke={C.orange} strokeWidth="12" /><path d="M155 150v190M60 245h190" stroke={C.orange} strokeWidth="10" />
        <rect x="320" y="220" width="150" height="280" fill="#d9b88f33" stroke={C.orange} strokeWidth="12" /><circle cx="440" cy="370" r="10" fill={C.orange} />
      </svg>
    </Szene>
  );
};

// ---------- 5 Gelernt
const MUSTER = [[-1, 0, 1, -1, 0, 1, -1, 0, 1], [-1, -1, -1, 0, 0, 0, 1, 1, 1], [0, 1, 1, -1, 0, 1, -1, -1, 0], [1, 1, 0, 1, 0, -1, 0, -1, -1], [-1, -1, -1, -1, 2, -1, -1, -1, -1], [1, 0, -1, 1, 0, -1, 1, 0, -1], [0, -1, 0, -1, 2, -1, 0, -1, 0], [-1, 0, -1, 0, 2, 0, -1, 0, -1]];
const Gelernt = () => {
  const { t, cue, end } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const lern = ease(t, cue(1) + 0.3, end(1) - 0.3);
  const runde = Math.max(1, Math.round(lern * 100));
  return (
    <Szene titel="Gelernt" tiefe={["repeat", 1500, 640, 800]}>
      {Array.from({ length: 15 }).map((_, i) => {
        const cx = 90 + (i % 5) * 270, cy = 215 + Math.floor(i / 5) * 245, m = MUSTER[i % 8];
        return (
          <div key={i} style={{ position: "absolute", left: cx, top: cy, width: 240, height: 240, borderRadius: 18, overflow: "hidden", border: `3px solid ${C.line}`, opacity: o(0.2 + i * 0.05) }}>
            {m.map((v, j) => {
              const noise = (rnd(i * 9 + j + Math.floor(lern < 1 ? Math.min(lern * 40, 40) : 40) * 0.0) - 0.5) * 2;
              const z = lerp(noise, Math.max(-1, Math.min(1, v)), lern);
              const g = Math.round(128 + 127 * z);
              return <div key={j} style={{ position: "absolute", left: (j % 3) * 80, top: Math.floor(j / 3) * 80, width: 80, height: 80, background: `rgb(${g},${g},${g})`, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.4)" }} />;
            })}
          </div>
        );
      })}
      <Panel x={1470} y={215} w={360} h={735} r={24} a={o(cue(1))}>
        <Lbl x={0} y={40} w={360} t="Runde" size={52} align="center" color={C.mute} />
        <Lbl x={0} y={110} w={360} t={String(runde)} size={170} weight={800} align="center" />
        <Lbl x={0} y={380} w={360} t="Fehler" size={52} align="center" color={C.mute} />
        <div style={{ position: "absolute", left: 90, top: 460, width: 180, height: 240, borderRadius: 16, background: "#2c2c2e", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 180, height: 240 * lerp(1, 0.12, lern), background: C.red, borderRadius: 16 }} />
        </div>
      </Panel>
      <Etikett x={90} y={955} t="von Hand geschrieben: keiner" f={C.red} size={44} a={o(cue(0) + 1.4) * (1 - lern)} />
    </Szene>
  );
};

// ---------- 6 Vortraining
const NETZ = [4, 6, 7, 6, 4];
const Vortraining = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const nx = (l) => 330 + l * 125, ny = (l, i) => 610 + (i - (NETZ[l] - 1) / 2) * 82;
  const tiles = [[exA, "Schraube"], [exB, "Mutter"], [exC, "Scheibe"]];
  return (
    <Szene titel="Vortraining" tiefe={["network", 1500, 640, 800]}>
      <Panel x={90} y={215} w={840} h={735} r={24} a={o(0.2)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o(0.4) }}>
        {NETZ.slice(0, -1).map((n, l) => Array.from({ length: n }).map((_, i) => Array.from({ length: NETZ[l + 1] }).map((__, j) => <line key={`${l}${i}${j}`} x1={nx(l)} y1={ny(l, i)} x2={nx(l + 1)} y2={ny(l + 1, j)} stroke={C.blue} strokeWidth={2.5} opacity={0.3} />)))}
        {NETZ.map((n, l) => Array.from({ length: n }).map((_, i) => <circle key={`${l}${i}`} cx={nx(l)} cy={ny(l, i)} r={30} fill={C.panel2} stroke={C.blue} strokeWidth={5} />))}
      </svg>
      <Lbl x={90} y={240} w={840} t="Vortrainiertes Netz" size={56} weight={800} align="center" a={o(0.3)} />
      <div style={{ position: "absolute", left: 120, top: 520, opacity: o(0.5) }}><Icon name="image" size={100} color={C.mute} /></div>
      <Zahlen x={790} y={440} w={110} h={280} n={7} seed={4} farbe={C.green} a={o(cue(0) + 1.2)} />
      <Lbl x={90} y={870} w={840} t="liefert Merkmale als Zahlen" size={46} align="center" color={C.green} a={o(cue(0) + 1.4)} />
      <Chip x={1080} y={225} t="nur 3 Beispiele" f={C.orange} size={54} a={o(cue(1) - 0.1)} />
      {tiles.map(([src, n], i) => (
        <React.Fragment key={n}>
          <div style={{ position: "absolute", left: 990 + i * 280, top: 340, width: 260, height: 195, borderRadius: 16, overflow: "hidden", border: `3px solid ${C.line}`, opacity: o(cue(1) + 0.3 + i * 0.3) }}><img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <Lbl x={990 + i * 280} y={548} w={260} t={n} size={44} align="center" a={o(cue(1) + 0.4 + i * 0.3)} />
          <Pf x1={1120 + i * 280} y1={610} x2={1120 + i * 280} y2={680} p={ease(t, cue(1) + 0.9 + i * 0.3, cue(1) + 1.3 + i * 0.3)} f={C.mute} w={6} />
          <Zahlen x={1000 + i * 280} y={700} w={240} h={150} n={8} seed={i * 5 + 2} farbe={[C.blue, C.green, C.orange][i]} a={o(cue(1) + 1.3 + i * 0.3)} />
        </React.Fragment>
      ))}
      <Etikett x={1080} y={890} t="genug zum Anlernen" f={C.green} size={50} a={o(cue(1) + 2.6)} />
    </Szene>
  );
};

// ---------- 7 Irrtum
const Tier = ({ x, y, w, farbe, schnee = true, flocken = 18, seed = 1, glow = 0 }) => {
  const h = w * 0.75;
  return (
    <svg style={{ position: "absolute", left: x, top: y, borderRadius: 16 }} width={w} height={h} viewBox="0 0 200 150">
      <rect width="200" height="150" fill={schnee ? "#e9eff6" : "#7fb069"} />
      {schnee && Array.from({ length: flocken }).map((_, i) => <circle key={i} cx={rnd(i + seed) * 200} cy={rnd(i * 3 + seed) * 150} r={2 + rnd(i * 5) * 3} fill="#fff" />)}
      {glow > 0 && <rect width="200" height="150" fill={C.orange} opacity={glow * 0.28} />}
      <g fill={farbe}>
        <ellipse cx="95" cy="88" rx="55" ry="28" /><circle cx="155" cy="62" r="24" /><ellipse cx="178" cy="70" rx="16" ry="9" />
        <polygon points="140,45 148,20 158,44" /><polygon points="158,44 168,22 174,48" />
        {[58, 74, 112, 128].map((lx) => <rect key={lx} x={lx} y="105" width="11" height="38" rx="4" />)}
        <path d="M42 80 Q10 70 14 40 Q30 60 46 68 Z" />
      </g>
      <circle cx="160" cy="58" r="3" fill="#fff" />
    </svg>
  );
};
const Irrtum = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const aufm = ease(t, word(1, "Dann") - 0.2, word(1, "Dann") + 0.8);
  return (
    <Szene titel="Wo es irrt" tiefe={["alert", 1500, 640, 800]}>
      {Array.from({ length: 6 }).map((_, i) => <Tier key={i} x={90 + i * 291} y={215} w={270} farbe="#4a4a52" seed={i * 7} flocken={14} />).map((el, i) => <div key={i} style={{ opacity: o(cue(1) + 0.1 + i * 0.12) }}>{el}</div>)}
      <Lbl x={90} y={430} w={900} t="Training: lauter Wölfe im Schnee" size={46} color={C.mute} a={o(cue(1) + 0.2)} />
      <div style={{ opacity: o(cue(0) + 0.6) }}><Tier x={90} y={520} w={560} farbe="#b5b5bd" glow={aufm} seed={99} flocken={30} /></div>
      <Lbl x={90} y={945} w={560} t="Test: Husky im Schnee" size={44} align="center" color={C.mute} a={o(cue(0) + 0.8)} />
      <Pf x1={680} y1={720} x2={820} y2={720} p={ease(t, cue(0) + 1.2, cue(0) + 1.7)} f={C.blue} />
      <Panel x={840} y={560} w={420} h={300} r={24} a={o(cue(0) + 1.5)}><Lbl x={0} y={30} w={420} t="Netz" size={48} align="center" color={C.mute} /><Lbl x={0} y={110} w={420} t="Wolf" size={120} weight={800} align="center" color={C.red} /></Panel>
      <Mark x={1170} y={520} ok={false} size={100} a={o(cue(0) + 2.0)} />
      <Chip x={1330} y={540} t="Schnee = Wolf" f={C.orange} size={64} a={o(word(1, "Schnee bedeutet") )} />
      <Lbl x={1330} y={680} w={500} t="Das Netz schaut auf den Hintergrund, nicht aufs Tier." size={46} color={C.text} a={o(word(1, "Dann"))} />
    </Szene>
  );
};

export default { frage: Frage, filter: Filter, kanten: Kanten, schichten: Schichten, gelernt: Gelernt, vortraining: Vortraining, irrtum: Irrtum };
