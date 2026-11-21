import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Chip, Lin, Karte, Fig } from "../bausteine.jsx";

const Hinweis = () => {
  const { t, cue } = useCues();
  const a = sp(t, 0.3, 0.9);
  return (
    <Szene titel="Wegweiser" tiefe={["alert", 1380, 650, 900]}>
      <div style={{ position: "absolute", left: 110, top: 330, opacity: a, transform: `scale(${lerp(0.8, 1, a)})`, transformOrigin: "left center" }}><Icon name="alert" size={480} color={C.orange} sw={1.2} /></div>
      <Lbl x={700} y={420} w={1100} t="Keine Rechtsberatung" size={130} color={C.orange} a={a} />
      <svg style={{ position: "absolute", left: 700, top: 700, width: 1100, height: 260, opacity: sp(t, cue(1) + 0.2, 0.7) }} viewBox="0 0 1100 260"><path d="M0 130 H950 L1050 130 L950 70 M950 130 L1050 130 L950 190" fill="none" stroke={C.mute} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <Lbl x={700} y={770} w={800} t="Grundgedanken" size={64} color={C.mute} a={sp(t, cue(1) + 0.5, 0.6)} />
    </Szene>
  );
};

const Daten = () => {
  const { t, cue, word } = useCues();
  const K = [["lock", "Rechtsgrundlage"], ["target", "Fester Zweck"], ["list", "So wenig wie nötig"]];
  return (
    <Szene titel="Personendaten" tiefe={["user", 1380, 650, 900]}>
      <Panel x={110} y={300} w={560} h={640} r={30} a={sp(t, 0.3, 0.8)}>
        <div style={{ position: "absolute", left: 130, top: 60 }}><Icon name="user" size={300} color={C.blue} /></div>
        <Skel x={60} y={420} w={440} n={4} gap={52} h={22} />
        <div style={{ position: "absolute", right: 24, top: 24, opacity: sp(t, 0.8, 0.6) }}><Icon name="lock" size={90} color={C.orange} /></div>
      </Panel>
      {K.map(([ic, n], i) => {
        const at = word(0, ["Rechtsgrundlage", "Zweck", "so viele"][i]);
        return (
          <Rv key={n} at={at} dx={40} dy={0} style={{ position: "absolute", left: 790, top: 300 + i * 220 }}>
            <div style={{ width: 1020, height: 180, borderRadius: 34, background: C.panel, border: `5px solid ${C.blue}`, display: "flex", alignItems: "center", gap: 36, padding: "0 44px", boxSizing: "border-box" }}><Icon name={ic} size={110} color={C.blue} /><div style={{ fontSize: 72, fontWeight: 700 }}>{n}</div></div>
          </Rv>
        );
      })}
    </Szene>
  );
};

const Vertrag = () => {
  const { t, cue } = useCues();
  const rot = t * 40;
  const G = (x, y, n, c) => (
    <>
      <div style={{ position: "absolute", left: x - 190, top: y - 190, width: 380, height: 380, opacity: sp(t, 0.3, 0.8), transform: `rotate(${n * rot}deg)` }}><Icon name="zap" size={380} color={c} sw={0.8} style={{ display: "none" }} /><svg width="380" height="380" viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="none" stroke={c} strokeWidth="6" />{Array.from({ length: 8 }).map((_, i) => <rect key={i} x="44" y="6" width="12" height="16" rx="3" fill={c} transform={`rotate(${i * 45} 50 50)`} />)}</svg></div>
    </>
  );
  return (
    <Szene titel="Vertrag" tiefe={["file", 1380, 650, 900]}>
      {G(470, 620, 1, C.blue)}{G(1290, 620, -1, C.green)}
      <Lbl x={280} y={850} w={380} t="Auftraggeber" size={52} color={C.blue} align="center" a={sp(t, 0.5, 0.6)} />
      <Lbl x={1100} y={850} w={380} t="Dienstleister" size={52} color={C.green} align="center" a={sp(t, 0.5, 0.6)} />
      <Rv at={cue(0) + 0.8} s0={0.8} style={{ position: "absolute", left: 760, top: 400 }}>
        <Panel x={0} y={0} w={400} h={500} r={24} rand={C.orange}><Skel x={36} y={50} w={328} n={7} gap={52} h={20} farbe={C.orange} /><div style={{ position: "absolute", left: 140, top: 390 }}><Icon name="edit" size={120} color={C.orange} /></div></Panel>
      </Rv>
      <Lbl x={1470} y={300} w={400} t="Du bleibst verantwortlich" size={50} color={C.orange} a={sp(t, cue(1) + 0.3, 0.6)} />
    </Szene>
  );
};

const Rechte = () => {
  const { t, cue, word } = useCues();
  const R = [["search", "Auskunft"], ["edit", "Berichtigung"], ["trash", "Löschung"], ["x", "Widerspruch"]];
  return (
    <Szene titel="Betroffenenrechte" tiefe={["user", 1380, 650, 900]}>
      <Fig x={130} y={420} s={400} f={C.blue} />
      {R.map(([ic, n], i) => {
        const at = word(0, n);
        const x = 700 + (i % 2) * 560, y = 310 + Math.floor(i / 2) * 330;
        return (
          <Rv key={n} at={at} s0={0.85} style={{ position: "absolute", left: x, top: y }}>
            <div style={{ width: 520, height: 290, borderRadius: 34, background: C.panel, border: `5px solid ${C.blue}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}><Icon name={ic} size={140} color={C.blue} /><div style={{ fontSize: 58, fontWeight: 700 }}>{n}</div></div>
          </Rv>
        );
      })}
    </Szene>
  );
};

const Pyramide = () => {
  const { t, cue, word } = useCues();
  const S = [["Verboten", C.red, 260], ["Hochrisiko", C.orange, 560], ["Transparenz", "#ffd60a", 860], ["Minimal", C.green, 1160]];
  const at = [word(1, "verboten") , word(1, "streng"), word(1, "Hinweis"), word(1, "meiste")];
  return (
    <Szene titel="Risikostufen" tiefe={["shield", 1380, 650, 900]}>
      {S.map(([n, c, w], i) => {
        const y = 300 + i * 170, cx = 960, ww = 360 + i * 380, a = sp(t, i === 0 ? cue(0) + 0.8 : 0.5 + i * 0.5, 0.7);
        return (
          <div key={n} style={{ position: "absolute", left: cx - ww / 2, top: y, width: ww, height: 150, borderRadius: 26, background: c + "33", border: `6px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, fontWeight: 800, color: c, opacity: a, boxSizing: "border-box", transform: `scale(${lerp(0.9, 1, a)})` }}>{n}</div>
        );
      })}
      <Lbl x={1560} y={320} w={300} t="mehr Pflichten" size={46} color={C.mute} a={sp(t, cue(0) + 1.4, 0.6)} />
      <Lbl x={1560} y={840} w={300} t="weniger" size={46} color={C.mute} a={sp(t, cue(0) + 1.4, 0.6)} />
    </Szene>
  );
};

const Doku = () => {
  const { t, cue, word } = useCues();
  return (
    <Szene titel="Dokumentieren" tiefe={["book", 1380, 650, 900]}>
      <div style={{ position: "absolute", left: 110, top: 300, opacity: sp(t, 0.3, 0.8) }}><Icon name="book" size={400} color={C.orange} sw={1.2} /></div>
      <Lbl x={110} y={720} w={420} t="Urheberrecht" size={52} color={C.orange} align="center" a={sp(t, 0.6, 0.6)} />
      <div style={{ position: "absolute", left: 600, top: 340, opacity: sp(t, 0.8, 0.8) }}><Icon name="help" size={200} color={C.orange} /></div>
      <div style={{ position: "absolute", left: 800, top: 300, opacity: sp(t, 1.0, 0.8) }}><Icon name="bot" size={400} color={C.orange} sw={1.2} /></div>
      <Panel x={1260} y={300} w={550} h={560} r={28} a={sp(t, cue(1) + 0.2, 0.7)}>
        {["Wer?", "Wofür?", "Wann?"].map((n, i) => <div key={n} style={{ position: "absolute", left: 40, top: 40 + i * 170, fontSize: 64, fontWeight: 700, color: C.blue }}>{n}<Skel x={0} y={86} w={420} n={1} h={22} seed={i + 3} /></div>)}
      </Panel>
      <div style={{ position: "absolute", left: 1480, top: 780, opacity: sp(t, cue(1) + 1.4, 0.6) }}><Icon name="calendar" size={150} color={C.green} /></div>
      <Lbl x={1260} y={950} w={550} t="Quellen aktuell prüfen" size={44} color={C.green} align="center" a={sp(t, cue(1) + 1.6, 0.6)} />
    </Szene>
  );
};

export default { hinweis: Hinweis, daten: Daten, vertrag: Vertrag, rechte: Rechte, pyramide: Pyramide, doku: Doku };
