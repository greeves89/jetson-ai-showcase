import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Fig, Chip, Lin, Flug, Karte } from "../bausteine.jsx";

const REZ = [C.blue, C.green, C.orange, "#bf5af2", "#ffd60a", "#64d2ff"];
const Kochbuch = () => {
  const { t, cue, word } = useCues();
  const sel = sp(t, word(1, "Carbonara"), 0.7);
  return (
    <Szene titel="Kochbuch" tiefe={["book", 1400, 650, 900]}>
      {REZ.map((f, i) => {
        const x = 110 + (i % 3) * 580, y = 290 + Math.floor(i / 3) * 350, isel = i === 2;
        const a = sp(t, 0.3 + i * 0.15, 0.7);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 540, height: 310, borderRadius: 30, background: f + "26", border: `5px solid ${f}`, opacity: a * (isel ? 1 : 1 - sel * 0.6), transform: `scale(${isel ? 1 + sel * 0.06 : 1})`, boxSizing: "border-box", padding: 30 }}>
            <Skel x={30} y={34} w={480} n={5} gap={50} h={20} farbe={f} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: lerp(900, 1060, ease(t, word(1, "Carbonara") - 0.8, word(1, "Carbonara"))), top: lerp(940, 500, ease(t, word(1, "Carbonara") - 0.8, word(1, "Carbonara"))), opacity: sp(t, cue(1) - 0.3, 0.5) }}><Icon name="pointer" size={150} color="#fff" sw={1.6} /></div>
      <Lbl x={780} y={965} w={540} t="Carbonara" size={56} color={C.orange} align="center" a={sel} />
    </Szene>
  );
};

// Textstreifen (Anker): Stücke gleich lang oder nach Themen
const SX0 = 110, SW0 = 1700, SYY = 330, SHH = 400;
const TH = [0, 0.18, 0.47, 0.62, 1]; // Themengrenzen
const stueckeA = (u, gap) => {
  const gl = [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1];
  const n = 6;
  const xs = gl.map((g, i) => lerp(g, i <= 4 ? [0, 0.18, 0.47, 0.62, 0.8, 1][Math.min(i, 5)] : 1, u));
  return xs;
};
const Streifen = ({ u = 0, sep = 0, farbig = 0, cut = 1, hl = true }) => {
  const g = u <= 0 ? [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1] : [0, 0.18, 0.47, 0.62, 0.8, 0.9, 1].map((v, i) => lerp([0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1][i], v, u));
  return (
    <>
      {g.slice(0, 6).map((a, i) => {
        const x0 = SX0 + a * SW0 + sep * 14 * i, w = (g[i + 1] - a) * SW0 - sep * 12;
        const f = REZ[i % 6];
        return (
          <Panel key={i} x={x0} y={SYY + sep * (i % 2 ? 40 : 0)} w={w} h={SHH} r={22} rand={farbig > 0.5 ? f : C.line} bg={farbig > 0.5 ? f + "1f" : C.panel}>
            <Skel x={22} y={40} w={Math.max(20, w - 44)} n={6} gap={58} h={22} seed={i + 1} mark={[]} farbe={farbig > 0.5 ? f : "#48484a"} />
            {farbig > 0.5 && <div style={{ position: "absolute", left: 22, top: 12, width: Math.max(20, w - 44) * 0.5, height: 8, borderRadius: 4, background: f }} />}
          </Panel>
        );
      })}
    </>
  );
};
const Feste = () => {
  const { t, cue, word } = useCues();
  const cut = ease(t, cue(0) + 0.6, cue(0) + 2.6);
  const sep = ease(t, cue(1) + 0.2, cue(1) + 1.2);
  const sx = SX0 + cut * SW0 * (5 / 6);
  return (
    <Szene titel="Feste Länge" tiefe={["file", 1380, 650, 900]} anker={<Streifen u={0} sep={sep} />}>
      <div style={{ position: "absolute", left: SX0 + 1700 * (2 / 6) - 430, top: SYY + 150, width: 560, height: 26, borderRadius: 13, background: C.orange, opacity: sp(t, cue(0) + 0.4, 0.5) }} />
      {[1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", left: SX0 + (i / 6) * SW0 - 4, top: SYY - 40, width: 8, height: SHH + 80, background: C.red, opacity: sx > SX0 + (i / 6) * SW0 ? 1 : 0, borderRadius: 4 }} />)}
      <div style={{ position: "absolute", left: sx - 60, top: SYY - 130, opacity: sp(t, cue(0) + 0.4, 0.5) * (1 - sep) }}><Icon name="x" size={120} color={C.orange} sw={2.2} /></div>
      <div style={{ position: "absolute", left: 110, top: 800, width: 1700, opacity: sep }}>
        <Lbl x={0} y={0} w={800} t="Mitten im Satz" size={64} color={C.orange} a={1} />
        <Lbl x={0} y={95} w={1000} t="Schnitt ohne Rücksicht" size={46} color={C.mute} a={1} />
      </div>
    </Szene>
  );
};

const Absatz = () => {
  const { t, cue } = useCues();
  const u = ease(t, cue(0) + 0.5, cue(0) + 2.0), f = ease(t, cue(0) + 1.8, cue(0) + 2.6);
  return (
    <Szene titel="Absätze" tiefe={["list", 1380, 650, 900]} anker={<Streifen u={u} sep={1} farbig={f} />}>
      {["Thema A", "Thema B", "Thema C", "Thema D"].map((n, i) => <Lbl key={n} x={SX0 + [0.04, 0.3, 0.52, 0.74][i] * SW0 - 40} y={SYY + SHH + 50} w={300} t={n} size={48} color={REZ[i]} a={sp(t, cue(1) + 0.3 + i * 0.3, 0.6)} />)}
      <div style={{ position: "absolute", left: 110, top: 880, opacity: sp(t, cue(1) + 1.6, 0.7) }}><Icon name="check" size={100} color={C.green} /></div>
      <Lbl x={250} y={885} w={1300} t="Schnitt an der Gliederung" size={64} color={C.green} a={sp(t, cue(1) + 1.8, 0.7)} />
    </Szene>
  );
};

const Groesse = () => {
  const { t, cue } = useCues();
  const K = [[110, 220, 160, "Zu klein", C.orange], [450, 540, 560, "Gut", C.green], [1070, 700, 700, "Zu groß", C.red]];
  return (
    <Szene titel="Größe" tiefe={["file", 1380, 650, 900]}>
      {K.map(([x, w, h, n, f], i) => {
        const a = sp(t, cue(i) + 0.1 + (i === 0 ? 0 : -0.3), 0.8);
        return (
          <React.Fragment key={n}>
            <Panel x={x} y={960 - h - 70} w={w} h={h} r={24} rand={f} a={a} bg={f + "14"}>
              {i === 0 && <Skel x={20} y={36} w={w - 40} n={1} h={18} farbe={f} />}
              {i === 1 && <Skel x={34} y={44} w={w - 68} n={7} gap={66} h={22} farbe={f} />}
              {i === 2 && <>{[0, 1, 2, 3, 4].map((k) => <Skel key={k} x={34} y={40 + k * 128} w={w - 68} n={3} gap={38} h={18} farbe={REZ[k]} seed={k} />)}</>}
            </Panel>
            <Lbl x={x} y={925} w={w} t={n} size={50} color={f} align="center" a={a} />
          </React.Fragment>
        );
      })}
    </Szene>
  );
};

const Ueberlappung = () => {
  const { t, cue } = useCues();
  const o = sp(t, cue(0) + 0.8, 0.8), s2 = sp(t, cue(1) + 0.3, 0.8);
  return (
    <Szene titel="Überlappung" tiefe={["repeat", 1380, 650, 900]}>
      <Panel x={110} y={320} w={1000} h={300} r={24} rand={C.blue} a={sp(t, 0.3, 0.7)}><Skel x={30} y={40} w={940} n={4} gap={60} h={22} farbe={C.blue} /></Panel>
      <Panel x={810} y={660} w={1000} h={300} r={24} rand={C.green} a={sp(t, 0.5, 0.7)}><Skel x={30} y={40} w={940} n={4} gap={60} h={22} farbe={C.green} /></Panel>
      <div style={{ position: "absolute", left: 810, top: 300, width: 300, height: 680, borderRadius: 20, border: `5px dashed ${C.orange}`, background: C.orange + "1a", opacity: o }} />
      <div style={{ position: "absolute", left: 840, top: 520, width: 240, height: 24, borderRadius: 12, background: C.orange, opacity: o }} />
      <div style={{ position: "absolute", left: 840, top: 760, width: 240, height: 24, borderRadius: 12, background: C.orange, opacity: s2 }} />
      <Lbl x={1130} y={400} w={600} t="Doppelt vorhanden" size={56} color={C.orange} a={o} />
    </Szene>
  );
};

const Etiketten = () => {
  const { t, cue, word } = useCues();
  const z = ease(t, cue(0) + 0.4, cue(0) + 1.6);
  return (
    <Szene titel="Etiketten" tiefe={["file", 1380, 650, 900]}>
      <Panel x={110} y={290} w={760} h={640} r={24} a={sp(t, 0.3, 0.7) * (1 - z * 0.5)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 100, background: C.blue + "33", borderRadius: "21px 21px 0 0" }} />
        {[0, 1, 2, 3, 4].map((r) => <Skel key={r} x={30} y={140 + r * 92} w={700} n={1} h={22} seed={r} />)}
      </Panel>
      {[0, 1, 2, 3, 4].map((r) => (
        <div key={r} style={{ position: "absolute", left: lerp(110, 960, z), top: lerp(430 + r * 92, 290 + r * 128, z), width: lerp(760, 850, z), opacity: z }}>
          <div style={{ height: 36, borderRadius: "14px 14px 0 0", background: C.blue + "55" }} />
          <div style={{ height: 70, borderRadius: "0 0 14px 14px", background: C.panel, border: `3px solid ${C.line}` }}><Skel x={24} y={24} w={800} n={1} h={20} seed={r} /></div>
        </div>
      ))}
      {[["Quelle", "file", C.green], ["Kapitel", "book", C.orange], ["Datum", "calendar", "#bf5af2"]].map(([n, ic, f], i) => (
        <Rv key={n} at={word(1, ["Dokument", "Kapitel", "Datum"][i])} dx={30} dy={0} style={{ position: "absolute", left: 1100 + i * 250 - 220 + 120, top: 880 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 44, fontWeight: 700, color: f }}><Icon name={ic} size={52} color={f} />{n}</div>
        </Rv>
      ))}
    </Szene>
  );
};

export default { kochbuch: Kochbuch, feste: Feste, absatz: Absatz, groesse: Groesse, ueberlappung: Ueberlappung, etiketten: Etiketten };
