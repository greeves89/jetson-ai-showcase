import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Chip, Skel } from "../bausteine.jsx";
import { Zettel, Pf, MONO, Etikett, Mark, Zeile } from "../neu.jsx";

const Lautsprecher = ({ x, y, size = 110, color = C.blue }) => (
  <svg style={{ position: "absolute", left: x, top: y }} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /></svg>
);
const Mic = ({ x, y, size = 200, color = C.text, sw = 1.6, a = 1 }) => (
  <svg style={{ position: "absolute", left: x, top: y, opacity: a }} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" /></svg>
);
const Welle = ({ x, y, w, h, n = 40, t = 0, f = C.blue, a = 1, ruhig = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a }}>
    {Array.from({ length: n }).map((_, i) => {
      const v = 0.12 + 0.88 * Math.abs(Math.sin(i * 0.55 + t * 5) * (0.5 + 0.5 * Math.sin(i * 0.21 + 1.3))) * (0.6 + 0.4 * rnd(i + 3));
      const bh = h * (ruhig ? 0.1 : v);
      return <div key={i} style={{ position: "absolute", left: i * (w / n) + 2, top: (h - bh) / 2, width: w / n - 5, height: bh, borderRadius: 4, background: f }} />;
    })}
  </div>
);
// Ablaufband unten (Anker): Aufbereiten -> Aussprache -> Klang -> Betonung
const STUFEN = [["Aufbereiten", "list"], ["Aussprache", "message"], ["Klang", "zap"], ["Betonung", "repeat"]];
function Kette({ aktiv = -1, a = 1 }) {
  return (
    <>
      {STUFEN.map(([n, ic], i) => {
        const h = Math.max(0, 1 - Math.abs(aktiv - i));
        return (
          <React.Fragment key={n}>
            <div style={{ position: "absolute", left: 90 + i * 443, top: 865, width: 410, height: 110, borderRadius: 24, background: h > 0 ? `rgba(10,132,255,${0.12 + 0.3 * h})` : C.panel, border: `4px solid ${h > 0.5 ? C.blue : C.line}`, opacity: a, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 20, padding: "0 28px", fontSize: 46, fontWeight: 800, color: h > 0.5 ? C.text : C.mute }}>
              <Icon name={ic} size={58} color={h > 0.5 ? C.blue : C.mute} sw={1.7} />{n}
            </div>
            {i < 3 && <div style={{ position: "absolute", left: 90 + i * 443 + 412, top: 905, opacity: a, color: C.mute, fontSize: 40, width: 30, textAlign: "center", fontWeight: 800 }}>→</div>}
          </React.Fragment>
        );
      })}
    </>
  );
}

// ---------- 1 Navi
const Anker1 = () => { const { t, cue } = useCues(); return <Kette aktiv={-1} a={ease(t, cue(1) - 0.2, cue(1) + 0.5)} />; };
const Navi = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Das Navi" tiefe={["zap", 1500, 640, 800]} anker={<Anker1 />}>
      <Panel x={90} y={215} w={840} h={620} r={32} a={o(0.3)} />
      <div style={{ position: "absolute", left: 90, top: 215, width: 840, height: 150, borderRadius: "32px 32px 0 0", background: C.green, display: "flex", alignItems: "center", padding: "0 40px", fontSize: 54, fontWeight: 800, color: "#000", opacity: o(0.5), boxSizing: "border-box" }}>Nach 300 Metern rechts abbiegen</div>
      <svg style={{ position: "absolute", left: 90, top: 365, width: 840, height: 470, opacity: o(0.7) }}><path d="M420 470 V260 Q420 200 480 200 H840" fill="none" stroke="#3a3a3c" strokeWidth="70" /><path d="M420 470 V260 Q420 200 480 200 H840" fill="none" stroke={C.blue} strokeWidth="14" strokeDasharray="30 20" /><circle cx="420" cy="440" r="26" fill={C.blue} stroke="#fff" strokeWidth="6" /></svg>
      <Pf x1={960} y1={525} x2={1030} y2={525} p={ease(t, cue(1) - 0.3, cue(1) + 0.4)} f={C.blue} w={9} />
      <Panel x={1060} y={215} w={770} h={620} r={32} a={o(cue(1) - 0.3)} rand={C.blue} />
      <Welle x={1100} y={330} w={690} h={260} n={30} t={t} a={o(cue(1) - 0.2)} f={C.blue} />
      <div style={{ opacity: o(cue(1)) }}><Lautsprecher x={1370} y={635} size={120} /></div>
      <Lbl x={1060} y={760} w={770} t="Sprache" size={56} weight={800} align="center" color={C.blue} a={o(cue(1))} />
      <div style={{ position: "absolute", left: 1500, top: 230, opacity: o(cue(2) + 0.4) }}><Mic x={0} y={0} size={110} color={C.red} /><div style={{ position: "absolute", left: -6, top: 54, width: 130, height: 8, background: C.red, transform: "rotate(-40deg)", borderRadius: 4 }} /></div>
      <Etikett x={1060} y={160} t="nie aufgenommen" f={C.red} size={0.1} a={0} />
      <Lbl x={1100} y={240} w={380} t="nie aufgenommen" size={46} weight={700} color={C.red} a={o(cue(2) + 0.4)} />
    </Szene>
  );
};

// ---------- 2 Aufbereiten
const Anker2 = () => { const { t } = useCues(); return <Kette aktiv={0} />; };
const Aufb = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const R = [["3,5 kg", "drei Komma fünf Kilogramm", cue(1) + 0.2], ["z. B.", "zum Beispiel", cue(1) + 2.2], ["12 %", "zwölf Prozent", cue(1) + 3.4]];
  return (
    <Szene titel="Aufbereiten" tiefe={["edit", 1500, 640, 800]} anker={<Anker2 />}>
      {R.map(([a, b, at], i) => {
        const hl = i === 0 && t > word(2, "Einheit") - 0.2;
        return (
          <React.Fragment key={a}>
            <div style={{ position: "absolute", left: 90, top: 225 + i * 205, width: 470, height: 170, borderRadius: 26, background: C.panel, border: `4px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 80, fontWeight: 800, opacity: o(at - 0.2), boxSizing: "border-box" }}>{a}</div>
            <Pf x1={580} y1={310 + i * 205} x2={660} y2={310 + i * 205} p={ease(t, at, at + 0.5)} f={C.blue} w={9} />
            <div style={{ position: "absolute", left: 690, top: 225 + i * 205, width: 1140, height: 170, borderRadius: 26, background: hl ? C.green + "28" : C.green + "14", border: `4px solid ${C.green}`, display: "flex", alignItems: "center", padding: "0 44px", fontSize: i === 0 ? 76 : 70, fontWeight: 800, color: C.green, opacity: o(at + 0.3), boxSizing: "border-box" }}>{b}</div>
          </React.Fragment>
        );
      })}
    </Szene>
  );
};

// ---------- 3 Aussprache
const LAUTE = [["Sch", C.blue], ["u", C.green], ["l", C.orange], ["e", "#bf5af2"]];
const Laute = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Aussprache" tiefe={["message", 1500, 640, 800]} anker={<Kette aktiv={ease(t, 0, 0.6, 0, 1)} />}>
      <div style={{ position: "absolute", left: 90, top: 225, width: 520, height: 260, borderRadius: 28, background: C.panel, border: `4px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110, fontWeight: 800, opacity: o(0.4), boxSizing: "border-box" }}>Schule</div>
      <Pf x1={630} y1={355} x2={720} y2={355} p={ease(t, cue(0) + 1.2, cue(0) + 1.8)} f={C.blue} w={9} />
      {LAUTE.map(([n, f], i) => (
        <div key={n} style={{ position: "absolute", left: 750 + i * 270, top: 225, width: 250, height: 260, borderRadius: 28, background: f + "26", border: `5px solid ${f}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: i === 0 ? 100 : 130, fontWeight: 800, opacity: o(cue(0) + 1.6 + i * 0.5), boxSizing: "border-box", transform: `translateY(${(1 - sp(t, cue(0) + 1.6 + i * 0.5, 0.6)) * 30}px)` }}>{n}</div>
      ))}
      <Lbl x={750} y={500} w={1080} t="Lautschrift wie im Wörterbuch" size={46} color={C.mute} a={o(cue(0) + 4.2)} />
      <Lbl x={90} y={600} w={520} t="Jetson" size={96} weight={800} align="center" a={o(cue(2) - 0.5)} />
      <Pf x1={630} y1={650} x2={720} y2={650} p={ease(t, cue(2) - 0.4, cue(2) + 0.2)} f={C.orange} w={9} />
      {["Dsch", "e", "t", "s", "o", "n"].map((n, i) => <div key={i} style={{ position: "absolute", left: 750 + i * 178, top: 585, width: 160, height: 150, borderRadius: 22, background: C.orange + "22", border: `4px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: i === 0 ? 54 : 76, fontWeight: 800, color: C.orange, opacity: o(cue(2) - 0.2 + i * 0.2), boxSizing: "border-box" }}>{n}</div>)}
      <Etikett x={750} y={760} t="Eigennamen: oft falsch, darum Aussprachehilfen" f={C.orange} size={42} a={o(cue(2) + 0.8)} />
    </Szene>
  );
};

// ---------- 4 Klang
const Spek = ({ x, y, w, h, p }) => {
  const NC = 34, NR = 14, cw = w / NC, ch = h / NR;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, overflow: "hidden", background: "#000" }}>
      {Array.from({ length: NC * NR }).map((_, k) => {
        const c = k % NC, r = NR - 1 - Math.floor(k / NC);
        if (c / NC > p) return null;
        const f = 4 + 3 * Math.sin(c * 0.42), v = Math.max(0, (0.5 + 0.5 * Math.sin(c * 0.9 + 1)) * Math.exp(-((r - f) ** 2) / 5)) + 0.35 * Math.exp(-((r - f - 5) ** 2) / 3) * (0.5 + 0.5 * Math.sin(c * 0.5));
        const col = `rgb(${Math.round(20 + 235 * Math.min(1, v * 1.4))},${Math.round(40 + 140 * Math.min(1, v))},${Math.round(120 - 80 * Math.min(1, v))})`;
        return <div key={k} style={{ position: "absolute", left: c * cw, top: (NR - 1 - r) * ch, width: cw + 1, height: ch + 1, background: col }} />;
      })}
    </div>
  );
};
const Klang = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Klang" tiefe={["zap", 1500, 640, 800]} anker={<Kette aktiv={ease(t, 0, 0.6, 1, 2)} />}>
      <Panel x={90} y={215} w={840} h={620} r={32} a={o(0.3)} rand={C.orange} />
      <Lbl x={90} y={235} w={840} t="Spektrogramm" size={56} weight={800} align="center" color={C.orange} a={o(0.4)} />
      <div style={{ position: "absolute", left: 130, top: 330, opacity: o(0.6) }}><Spek x={0} y={0} w={760} h={420} p={ease(t, 0.8, cue(0) + 3.6)} /></div>
      <Lbl x={90} y={770} w={840} t="die Noten der Stimme" size={44} align="center" color={C.mute} a={o(cue(0) + 2.6)} />
      <Pf x1={950} y1={525} x2={1070} y2={525} p={ease(t, cue(1) - 0.2, cue(1) + 0.4)} f={C.blue} w={10} />
      <Panel x={1090} y={215} w={740} h={620} r={32} a={o(cue(1) - 0.2)} rand={C.blue} />
      <Lbl x={1090} y={235} w={740} t="Vocoder" size={56} weight={800} align="center" color={C.blue} a={o(cue(1))} />
      <Welle x={1130} y={340} w={660} h={300} n={28} t={t} a={o(cue(1) + 0.3)} f={C.blue} />
      <Lbl x={1090} y={770} w={740} t="spielt sie als Ton ab" size={44} align="center" color={C.mute} a={o(cue(1) + 1.4)} />
    </Szene>
  );
};

// ---------- 5 Betonung
const KURV = { aussage: "M0 60 C 80 40, 180 40, 260 60 S 420 100, 560 130", frage: "M0 90 C 80 80, 180 90, 260 90 S 420 80, 560 20", ausruf: "M0 90 C 100 70, 200 40, 300 30 S 460 60, 560 120" };
const Betonung = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const R = [["Aussage", "Es regnet.", "aussage", C.blue], ["Frage", "Es regnet?", "frage", C.green], ["Ausruf", "Es regnet!", "ausruf", C.orange]];
  return (
    <Szene titel="Betonung" tiefe={["repeat", 1500, 640, 800]} anker={<Kette aktiv={ease(t, 0, 0.6, 2, 3)} />}>
      {R.map(([n, txt, k, f], i) => {
        const at = [0.4, cue(1) - 0.2, cue(1) + 1.4][i];
        return (
          <div key={n} style={{ position: "absolute", left: 90, top: 225 + i * 205, width: 1740, height: 185, borderRadius: 26, background: C.panel, border: `4px solid ${f}`, opacity: o(at), boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: 36, top: 24, fontSize: 40, fontWeight: 800, color: f }}>{n}</div>
            <div style={{ position: "absolute", left: 36, top: 76, fontSize: 76, fontWeight: 800 }}>{txt}</div>
            <svg style={{ position: "absolute", left: 800, top: 15 }} width="900" height="160" viewBox="0 0 560 160"><path d={KURV[k]} fill="none" stroke={f} strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ease(t, at + 0.3, at + 1.5)} /></svg>
          </div>
        );
      })}
    </Szene>
  );
};

// ---------- 6 Stimmen
const Stimme = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Stimmen" tiefe={["users", 1500, 640, 800]}>
      <Panel x={90} y={215} w={560} h={760} r={32} a={o(0.3)} rand={C.green} />
      <Mic x={190} y={330} size={340} color={C.green} a={o(0.5)} />
      <Mark x={470} y={300} ok size={110} a={o(cue(0) + 1.0)} />
      <Lbl x={90} y={720} w={560} t="Einwilligung" size={60} weight={800} align="center" color={C.green} a={o(cue(0) + 1.0)} />
      <Lbl x={90} y={810} w={560} t="Stimme gehört einem Menschen" size={42} align="center" color={C.mute} a={o(cue(0) + 1.4)} />
      <Panel x={680} y={215} w={560} h={760} r={32} a={o(cue(0) + 2.6)} rand={C.red} />
      <div style={{ position: "absolute", left: 770, top: 330, opacity: o(cue(0) + 2.8) }}><Icon name="alert" size={400} color={C.red} sw={1.3} /></div>
      <Lbl x={680} y={720} w={560} t="Geklonte Stimme" size={58} weight={800} align="center" color={C.red} a={o(cue(0) + 3.0)} />
      <Lbl x={680} y={810} w={560} t="erzeugte Sprache kennzeichnen" size={42} align="center" color={C.mute} a={o(cue(0) + 3.8)} />
      <Panel x={1270} y={215} w={560} h={760} r={32} a={o(cue(1) - 0.2)} rand={C.blue} />
      <div style={{ position: "absolute", left: 1360, top: 330, opacity: o(cue(1)) }}><Badge name="cpu" size={340} color={C.blue} glow={0.8} /></div>
      <div style={{ position: "absolute", left: 1620, top: 280, opacity: o(cue(1) + 0.4) }}><Icon name="lock" size={110} color={C.green} /></div>
      <Lbl x={1270} y={720} w={560} t="Jetson: lokal" size={60} weight={800} align="center" color={C.blue} a={o(cue(1) + 0.4)} />
      <Lbl x={1270} y={810} w={560} t="dein Text verlässt das Haus nicht" size={42} align="center" color={C.mute} a={o(cue(1) + 1.2)} />
    </Szene>
  );
};

export default { navi: Navi, aufbereiten: Aufb, laute: Laute, klang: Klang, betonung: Betonung, stimme: Stimme };
