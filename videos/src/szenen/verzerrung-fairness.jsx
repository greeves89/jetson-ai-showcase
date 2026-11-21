import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Chip, Lin, Karte, Fig } from "../bausteine.jsx";

const Umfrage = () => {
  const { t, cue } = useCues();
  const M = Array.from({ length: 30 }).map((_, i) => [150 + (i % 10) * 125, 400 + Math.floor(i / 10) * 170]);
  const pend = (i) => i % 10 < 4;
  return (
    <Szene titel="Umfrage" tiefe={["users", 1380, 650, 900]}>
      {M.map(([x, y], i) => <Fig key={i} x={x - 45} y={y - 45} s={90} f={pend(i) ? C.blue : C.mute} a={sp(t, 0.2 + i * 0.03, 0.4) * (pend(i) ? 1 : lerp(1, 0.35, ease(t, cue(0) + 0.8, cue(0) + 1.6)))} />)}
      <div style={{ position: "absolute", left: 130, top: 340, width: 540, height: 540, borderRadius: 30, border: `6px dashed ${C.blue}`, opacity: ease(t, cue(0) + 0.8, cue(0) + 1.6) }} />
      <Lbl x={130} y={900} w={540} t="Nur Pendler" size={56} color={C.blue} align="center" a={ease(t, cue(0) + 1.2, cue(0) + 1.9)} />
      <Lbl x={760} y={900} w={560} t="Rest fehlt" size={56} color={C.mute} align="center" a={ease(t, cue(0) + 1.6, cue(0) + 2.3)} />
      <div style={{ position: "absolute", left: 1440, top: 330, opacity: sp(t, cue(1) + 0.2, 0.7) }}><Icon name="clock" size={320} color={C.orange} /></div>
      <Lbl x={1380} y={680} w={440} t="Nur morgens" size={56} color={C.orange} align="center" a={sp(t, cue(1) + 0.4, 0.6)} />
    </Szene>
  );
};

const Quellen = () => {
  const { t, cue, word } = useCues();
  const Q = [["database", "Daten"], ["users", "Auswahl"], ["edit", "Etiketten"], ["repeat", "Rückkopplung"]];
  return (
    <Szene titel="Vier Quellen" tiefe={["alert", 1380, 650, 900]}>
      {Q.map(([ic, n], i) => {
        const at = word(0, ["Daten", "Auswahl", "Etiketten", "Rückkopplung"][i]);
        return (
          <React.Fragment key={n}>
            <Rv at={at} s0={0.85} style={{ position: "absolute", left: 140 + i * 430, top: 340 }}><Badge name={ic} size={320} color={C.orange} /></Rv>
            <Lbl x={110 + i * 430} y={700} w={380} t={n} size={56} align="center" color={C.orange} a={sp(t, at + 0.1, 0.6)} />
          </React.Fragment>
        );
      })}
      <Panel x={110} y={820} w={1700} h={150} r={30} a={sp(t, cue(1) + 0.3, 0.8)} rand={C.red}>
        <div style={{ position: "absolute", left: 40, top: 28, display: "flex", gap: 24, alignItems: "center", fontSize: 60, fontWeight: 700, color: C.red }}><Icon name="list" size={90} color={C.red} />Alte Einstellungen<span style={{ color: C.mute }}>→</span>Muster wird übernommen</div>
      </Panel>
    </Szene>
  );
};

const PLZ = () => {
  const { t, cue } = useCues();
  const a = sp(t, cue(1) + 0.2, 0.8);
  return (
    <Szene titel="Verstecktes Merkmal" tiefe={["lock", 1380, 650, 900]}>
      <Panel x={110} y={290} w={800} h={650} r={30} a={sp(t, 0.3, 0.7)}>
        {[["Merkmal A", C.blue], ["Merkmal B", C.blue], ["Sensibel", C.red], ["Postleitzahl", C.orange]].map(([n, c], i) => (
          <div key={n} style={{ position: "absolute", left: 40, top: 50 + i * 145, width: 720, height: 110, borderRadius: 24, background: c + "22", border: `5px solid ${c}`, boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 34px", fontSize: 56, fontWeight: 700, color: c, opacity: i === 2 ? 1 - ease(t, cue(0) + 0.6, cue(0) + 1.4) * 0.8 : 1, textDecoration: i === 2 && t > cue(0) + 1.0 ? "line-through" : "none" }}>{n}</div>
        ))}
      </Panel>
      <Lin x1={940} y1={800} x2={1160} y2={540} p={a} f={C.orange} w={10} dash="18 14" />
      <div style={{ position: "absolute", left: 1180, top: 330, opacity: a }}><Icon name="alert" size={420} color={C.orange} sw={1.2} /></div>
      <Lbl x={1120} y={780} w={600} t="Ersetzt das Merkmal" size={56} color={C.orange} align="center" a={a} />
    </Szene>
  );
};

const Gruppen = () => {
  const { t, cue } = useCues();
  const sp1 = ease(t, cue(0) + 1.2, cue(0) + 2.4);
  const B = [["Gesamt", 0.98, C.blue], ["Gruppe A", 0.99, C.green], ["Gruppe B", 0.82, C.red]];
  return (
    <Szene titel="Gruppen" tiefe={["users", 1380, 650, 900]}>
      <Panel x={110} y={280} w={1700} h={700} r={28} />
      <div style={{ position: "absolute", left: 200, top: 940 - 600 * 0.98 * (1 - sp1) - 0, width: 420, height: 600 * 0.98 * (1 - sp1), borderRadius: 24, background: C.blue, opacity: 1 - sp1 }} />
      {[["Gruppe A", 0.99, C.green, 760], ["Gruppe B", 0.82, C.red, 1280]].map(([n, v, c, x]) => <div key={n} style={{ position: "absolute", left: x - (1 - sp1) * 560, top: 940 - 600 * v * sp1, width: 420, height: 600 * v * sp1, borderRadius: 24, background: c, opacity: sp1 }} />)}
      <Lbl x={200} y={850} w={420} t="Gesamt" size={52} align="center" a={1 - sp1} color="#fff" />
      <Lbl x={760} y={850} w={420} t="Gruppe A" size={52} align="center" a={sp1} color="#fff" />
      <Lbl x={1280} y={850} w={420} t="Gruppe B" size={52} align="center" a={sp1} color="#fff" />
      <Lbl x={1100} y={300} w={700} t="Lücke!" size={90} color={C.red} align="right" a={sp1} />
    </Szene>
  );
};

const Prueffragen = () => {
  const { t, cue, dur } = useCues();
  const Q = [["database", "Woher?"], ["users", "Wer fehlt?"], ["edit", "Wer widerspricht?"]];
  return (
    <Szene titel="Prüffragen" tiefe={["help", 1380, 650, 900]}>
      {Q.map(([ic, n], i) => {
        const at = 0.5 + i * (cue(0) + 1.2) / 3;
        return (
          <Rv key={n} at={at} dx={-40} dy={0} style={{ position: "absolute", left: 110, top: 300 + i * 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              <Badge name={ic} size={170} />
              <div style={{ fontSize: 110, fontWeight: 800 }}>{n}</div>
              <div style={{ opacity: sp(t, at + 1.0, 0.6), marginLeft: 40 }}><Icon name="check" size={120} color={C.green} sw={3} /></div>
            </div>
          </Rv>
        );
      })}
    </Szene>
  );
};

const Mensch = () => {
  const { t, cue } = useCues();
  const press = ease(t, cue(1) + 0.6, cue(1) + 1.2);
  return (
    <Szene titel="Mensch entscheidet" tiefe={["userCheck", 1380, 650, 900]}>
      <Fig x={180} y={330} s={520} f={C.green} />
      <div style={{ position: "absolute", left: 900, top: 420 + press * 20, width: 800, height: 330, borderRadius: 50, background: C.red + "33", border: `10px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 110, fontWeight: 800, color: C.red, opacity: sp(t, cue(0) + 0.5, 0.7), boxSizing: "border-box" }}>Überstimmen</div>
      <div style={{ position: "absolute", left: 800, top: 280 + press * 130, opacity: sp(t, cue(1) + 0.2, 0.5) }}><Icon name="pointer" size={170} color="#fff" sw={1.6} /></div>
      <Lbl x={900} y={830} w={800} t="Eingreifen möglich" size={60} color={C.green} a={sp(t, cue(1) + 1.2, 0.6)} />
    </Szene>
  );
};

export default { umfrage: Umfrage, quellen: Quellen, plz: PLZ, gruppen: Gruppen, fragen: Prueffragen, mensch: Mensch };
