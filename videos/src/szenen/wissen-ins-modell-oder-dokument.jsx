import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Chip, Skel, Dok } from "../bausteine.jsx";
import { Zettel, Pf, MONO, Etikett, Mark, Zeile } from "../neu.jsx";

const RX = 700, RW = 1130;
const Zahnrad = ({ cx, cy, r, z = 10, rot = 0, f = C.blue }) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
    {Array.from({ length: z }).map((_, i) => <rect key={i} x={-r * 0.14} y={-r * 1.22} width={r * 0.28} height={r * 0.42} rx={r * 0.05} fill={f} transform={`rotate(${(360 / z) * i})`} />)}
    <circle r={r} fill={f} /><circle r={r * 0.45} fill="#1c1c1e" />
  </g>
);
// Anker: das Modell links, in fünf Szenen an derselben Stelle
function Modell({ zahn = 0, rot = 0, glow = 0 }) {
  return (
    <>
      <Panel x={90} y={215} w={540} h={760} r={32} rand={glow ? C.green : C.blue} />
      <div style={{ position: "absolute", left: 220, top: 260, opacity: 1 - zahn }}><Badge name="bot" size={280} color={C.blue} glow={0.6 + glow} /></div>
      <svg style={{ position: "absolute", left: 90, top: 215, width: 540, height: 760, opacity: zahn }}>
        <Zahnrad cx={220} cy={190} r={92} z={12} rot={rot} f={C.blue} />
        <Zahnrad cx={390} cy={290} r={64} z={9} rot={-rot * 1.3 + 12} f={C.green} />
      </svg>
      <Lbl x={90} y={600} w={540} t="Sprachmodell" size={64} weight={800} align="center" />
      <Lbl x={90} y={690} w={540} t="kennt die Welt" size={46} align="center" color={C.mute} />
      <Lbl x={90} y={750} w={540} t="nicht deine Firma" size={46} align="center" color={C.orange} />
    </>
  );
}
const Ordner = ({ x, y, w = 220, h = 170, f = C.orange, a = 1, glow = false, label }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: w * 0.42, height: 30, borderRadius: "14px 14px 0 0", background: f }} />
    <div style={{ position: "absolute", left: 0, top: 24, width: w, height: h - 24, borderRadius: "0 18px 18px 18px", background: f + "dd", boxShadow: glow ? `0 0 40px ${f}` : "none" }} />
    {label && <div style={{ position: "absolute", left: 14, top: 70, fontSize: 36, fontWeight: 800, color: "#1c1c1e" }}>{label}</div>}
  </div>
);

// ---------- 1 Frage
const Frage = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const nm = ["Verträge", "Handbuch", "Preise", "Protokolle", "Kunden", "Technik", "Personal", "Angebote", "Berichte"];
  return (
    <Szene titel="Die Frage" tiefe={["help", 1500, 640, 800]} anker={<Modell />}>
      <Panel x={RX} y={215} w={RW} h={760} r={32} a={o(0.4)} rand={C.orange} />
      <Lbl x={RX} y={235} w={RW} t="Dein Wissen: die Firma" size={60} weight={800} align="center" color={C.orange} a={o(cue(0) + 0.6)} />
      {nm.map((n, i) => <Ordner key={n} x={RX + 70 + (i % 3) * 340} y={330 + Math.floor(i / 3) * 185} w={300} h={165} f={[C.orange, C.blue, C.green][i % 3]} label={n} a={o(cue(0) + 0.8 + i * 0.12)} />)}
      <div style={{ position: "absolute", left: 600, top: 540, opacity: o(cue(1) - 0.2) }}><Badge name="help" size={150} color="#fff" bg="#d98300" glow={1} /></div>
      <Lbl x={RX} y={905} w={RW} t="Wie kommt das Wissen ins Modell?" size={56} weight={800} align="center" color={C.text} a={o(cue(1) + 0.4)} />
    </Szene>
  );
};

// ---------- 2 Drei Wege
const W3 = [["Spickzettel", "edit", "besser fragen", "Prompt", C.green], ["Nachschlagewerk", "book", "Dokumente anbinden", "RAG", C.blue], ["Auswendig lernen", "bulb", "nachtrainieren", "Nachtrainieren", C.orange]];
const Drei = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const at = [word(0, "Spickzettel"), word(0, "Nachschlagewerk"), word(0, "auswendig")];
  const ab = [word(1, "Prompt"), word(1, "RAG"), word(1, "Nachtrainieren")];
  return (
    <Szene titel="Drei Wege" tiefe={["fork", 1500, 640, 800]} anker={<Modell />}>
      {W3.map(([n, ic, sub, k, f], i) => (
        <div key={n} style={{ position: "absolute", left: RX + i * 385, top: 215, width: 360, height: 760, borderRadius: 32, background: C.panel, border: `4px solid ${f}`, opacity: o(at[i] - 0.3), boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: 26, paddingTop: 60, transform: `translateY(${(1 - sp(t, at[i] - 0.3, 0.7)) * 30}px)` }}>
          <Icon name={ic} size={150} color={f} sw={1.4} />
          <div style={{ fontSize: 42, fontWeight: 800, textAlign: "center", lineHeight: 1.1, padding: "0 8px", whiteSpace: "nowrap" }}>{n}</div>
          <div style={{ fontSize: 42, color: C.mute, fontWeight: 600, textAlign: "center", opacity: o(ab[i] - 0.4) }}>{sub}</div>
          <div style={{ marginTop: 20, fontSize: 44, fontWeight: 800, color: f, border: `4px solid ${f}`, borderRadius: 20, padding: "6px 16px", opacity: o(ab[i] - 0.3) }}>{k}</div>
        </div>
      ))}
    </Szene>
  );
};

// ---------- 3 Prompt
const Prompt = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const fl = ease(t, cue(0) + 1.2, cue(0) + 2.4);
  return (
    <Szene titel="Besser fragen" tiefe={["edit", 1500, 640, 800]} anker={<Modell glow={ease(t, cue(0) + 2.2, cue(0) + 2.6) * 0.5} />}>
      <Zettel x={lerp(RX + 40, RX + 20, fl)} y={215} w={RW - 40} h={330} rot={lerp(2, 0, fl)} a={o(0.3)} style={{ fontSize: 46 }}>
        <div style={{ fontSize: 36, color: "#6b5a2a", fontWeight: 700, marginBottom: 6 }}>Prompt</div>
        Unsere Öffnungszeiten: Montag bis Freitag, 8 bis 16 Uhr. Rückgabe innerhalb von 14 Tagen. Frage: Bis wann kann ich zurückgeben?
      </Zettel>
      <Pf x1={RX + 560} y1={565} x2={RX + 560} y2={640} p={ease(t, cue(0) + 2.0, cue(0) + 2.6)} f={C.green} w={9} />
      {[["sofort", "zap", C.green], ["wenig Kosten", "clock", C.green], ["immer aktuell", "repeat", C.green]].map(([n, ic, f], i) => (
        <div key={n} style={{ position: "absolute", left: RX + i * 385, top: 670, width: 360, height: 110, borderRadius: 22, background: f + "18", border: `4px solid ${f}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 38, fontWeight: 800, color: f, whiteSpace: "nowrap", opacity: o(cue(1) + 0.3 + i * 0.5), boxSizing: "border-box" }}><Icon name={ic} size={46} color={f} />{n}</div>
      ))}
      <Lbl x={RX} y={822} w={340} t="Grenze: Platz" size={48} weight={800} color={C.red} a={o(cue(1) + 3.2)} />
      <div style={{ position: "absolute", left: RX + 360, top: 825, width: 770, height: 56, borderRadius: 28, background: "#2c2c2e", opacity: o(cue(1) + 3.2), overflow: "hidden" }}><div style={{ width: 800 * ease(t, cue(1) + 3.3, cue(1) + 4.6), height: 56, background: C.red }} /></div>
    </Szene>
  );
};

// ---------- 4 RAG
const Rag = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const gl = ease(t, cue(0) + 1.4, cue(0) + 2.2);
  const fl = ease(t, cue(0) + 3.0, cue(0) + 4.2);
  return (
    <Szene titel="RAG" tiefe={["search", 1500, 640, 800]} anker={<Modell glow={ease(t, cue(0) + 4.0, cue(0) + 4.6) * 0.5} />}>
      <Zeile x={RX} y={215} w={RW} h={100} t="Frage: Bis wann kann ich zurückgeben?" size={46} rand={C.blue} a={o(0.4)} />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: RX + (i % 3) * 200, top: 345 + Math.floor(i / 3) * 235, opacity: (i === 4 ? 1 - fl : 1 - gl * 0.55) }}>
          <Dok x={0} y={0} w={170} h={210} n={6} seed={i + 1} rand={i === 4 && gl > 0.3 ? C.green : C.line} a={o(0.6 + i * 0.1)} />
        </div>
      ))}
      <div style={{ position: "absolute", left: RX + 200 - 10, top: 345 + 235 - 10, width: 190, height: 230, borderRadius: 24, boxShadow: `0 0 ${50 * gl}px ${C.green}`, border: `5px solid ${C.green}`, opacity: gl * (1 - fl), boxSizing: "border-box" }} />
      <div style={{ position: "absolute", left: lerp(RX + 200, 400, fl), top: lerp(580, 560, fl), opacity: fl > 0 ? 1 : 0, transform: `scale(${lerp(1, 0.8, fl)})`, transformOrigin: "top left" }}><Dok x={0} y={0} w={170} h={210} n={6} seed={5} rand={C.green} /></div>
      <Lbl x={RX + 620} y={500} w={500} t="passende Stelle" size={52} weight={800} color={C.green} a={o(cue(0) + 2.0)} />
      <Lbl x={RX + 620} y={575} w={500} t="geht mit der Frage zum Modell" size={42} color={C.mute} a={o(cue(0) + 3.0)} />
      <div style={{ position: "absolute", left: RX, top: 800, width: RW, height: 175, borderRadius: 26, background: C.panel2, border: `4px solid ${C.green}`, boxSizing: "border-box", padding: "18px 34px", opacity: o(cue(1)) }}>
        <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.2 }}>Bis zu 14 Tage nach dem Kauf.</div>
        <div style={{ marginTop: 14, display: "flex" }}><Etikett flow t="Quelle: Handbuch, Seite 12" f={C.orange} size={40} /></div>
      </div>
      <Etikett x={RX + 520} y={345} t="Dokument ändern: gilt sofort" f={C.green} size={40} a={o(cue(1) + 3.0)} />
    </Szene>
  );
};

// ---------- 5 Nachtrainieren
const Nach = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const rot = (t - 0) * 14 + ease(t, cue(0) + 1.0, cue(0) + 2.4) * 40;
  const z = ease(t, 0, 0.6);
  return (
    <Szene titel="Nachtrainieren" tiefe={["repeat", 1500, 640, 800]} anker={<Modell zahn={z} rot={rot} />}>
      <Lbl x={RX} y={225} w={RW} t="Das Modell selbst verändert sich" size={56} weight={800} color={C.orange} a={o(cue(0) + 0.4)} />
      {[["Ton", "message"], ["Format", "grid"], ["Spezialaufgaben", "target"]].map(([n, ic], i) => (
        <div key={n} style={{ position: "absolute", left: RX + i * 385, top: 320, width: 360, height: 220, borderRadius: 26, background: C.green + "18", border: `4px solid ${C.green}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: o(cue(0) + 2.4 + i * 0.5), boxSizing: "border-box" }}><Icon name={ic} size={80} color={C.green} /><div style={{ fontSize: 38, fontWeight: 800, color: C.green, whiteSpace: "nowrap" }}>{n}</div></div>
      ))}
      <Lbl x={RX} y={575} w={RW} t="gut für …" size={42} color={C.mute} a={o(cue(0) + 2.2)} />
      <Panel x={RX} y={640} w={RW} h={335} r={28} a={o(cue(1) - 0.2)} rand={C.red} />
      <div style={{ position: "absolute", left: RX + 40, top: 690, opacity: o(cue(1) + 0.2) }}><Icon name="calendar" size={150} color={C.red} sw={1.4} /></div>
      <Lbl x={RX + 230} y={680} w={860} t="Als Wissensspeicher schwach" size={56} weight={800} color={C.red} a={o(cue(1) + 0.2)} />
      <Lbl x={RX + 230} y={770} w={860} t="Jede Änderung: neues Training" size={50} color={C.text} a={o(cue(1) + 2.4)} />
      <Lbl x={RX + 230} y={850} w={860} t="dauert, kostet, wird alt" size={44} color={C.mute} a={o(cue(1) + 3.0)} />
    </Szene>
  );
};

// ---------- 6 Leiter
const Leiter = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const swap = ease(t, word(0, "meint") - 0.1, word(0, "meint") + 0.6);
  const L = [["Reicht ein besserer Prompt?", "Prompt", C.green], ["Fakten, die sich ändern?", "RAG", C.blue], ["Ton, Format, Spezialaufgabe?", "Nachtrainieren", C.orange]];
  return (
    <Szene titel="Die Leiter" tiefe={["list", 1500, 640, 800]}>
      <Panel x={90} y={215} w={1740} h={210} r={28} a={o(0.3)} rand={C.mute} />
      <Lbl x={130} y={265} w={1260} t="„Wir trainieren das Modell mit unseren Dokumenten.“" size={56} weight={700} color={swap > 0.5 ? C.mute : C.text} a={o(0.5)} style={{ textDecoration: swap > 0.5 ? "line-through" : "none" }} />
      <Lbl x={1380} y={250} w={420} t="RAG" size={130} weight={800} color={C.blue} align="center" a={swap} />
      {L.map(([q, a, f], i) => (
        <div key={q} style={{ position: "absolute", left: 90 + i * 70, top: 470 + i * 170, width: 1740 - i * 70, height: 150, borderRadius: 26, background: C.panel, border: `4px solid ${f}`, opacity: o(cue(1) - 0.2 + i * 1.0), boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 54, fontWeight: 700 }}><div style={{ width: 70, height: 70, borderRadius: 35, background: f, color: "#000", fontSize: 44, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>{q}</div>
          <div style={{ fontSize: 56, fontWeight: 800, color: f }}>{a}</div>
        </div>
      ))}
      <Etikett x={90} y={955 - 8} t="" size={10} a={0} />
    </Szene>
  );
};

export default { frage: Frage, drei: Drei, prompt: Prompt, rag: Rag, nachtrainieren: Nach, leiter: Leiter };
