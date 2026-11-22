import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Zettel, Pf, MONO, Etikett, Mark, Zeile, PAPIER } from "../neu.jsx";

const ZL = [["Aufgabe", "Schreib dem Kunden wegen der Verspätung.", "#6b5a2a"], ["Rolle", "Du bist Kundenberaterin.", C.blue], ["Grund", "Lieferung: 2 Tage später.", C.orange], ["Ton", "Freundlich, kurz.", C.green], ["Ausweg", "Fehlt etwas: „nicht genannt“.", C.red]];
// Der Zettel als Anker: wächst mit jeder Zeile
function ZettelA({ n = 1, hl = -1, glow = 0 }) {
  const h = Math.min(760, 330 + n * 110);
  return (
    <div style={{ position: "absolute", left: 90, top: 215, width: 740, height: h, background: PAPIER, borderRadius: 16, boxShadow: `0 18px 40px rgba(0,0,0,0.55)${glow ? `, 0 0 ${50 * glow}px ${C.orange}` : ""}`, boxSizing: "border-box", padding: "26px 34px", color: "#1c1c1e", transform: "rotate(-0.8deg)" }}>
      {ZL.map(([k, v, f], i) => {
        const a = Math.max(0, Math.min(1, n - i));
        return (
          <div key={k} style={{ opacity: a, marginBottom: 16, transform: `translateX(${(1 - a) * -30}px)`, padding: "2px 10px", borderRadius: 10, background: hl === i ? "#ff9f0a44" : "transparent", outline: hl === i ? `4px solid ${C.orange}` : "none" }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: i === 0 ? "#6b5a2a" : f === C.blue ? "#0a5fc2" : f === C.orange ? "#b36b00" : f === C.green ? "#168a3a" : "#c2271c" }}>{k}</div>
            <div style={{ fontSize: 46, fontWeight: 650, lineHeight: 1.15 }}>{v}</div>
          </div>
        );
      })}
    </div>
  );
}
const RX = 880, RW = 950;

// ---------- 1 Zettel
const Zett = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const fr = [["An wen?", 0], ["Warum?", 1], ["Welcher Ton?", 2]];
  return (
    <Szene titel="Der Zettel" tiefe={["edit", 1500, 640, 800]} anker={<ZettelA n={1} />}>
      <Panel x={RX} y={215} w={RW} h={470} r={28} a={o(0.4)} />
      <div style={{ position: "absolute", left: RX + 40, top: 340, opacity: o(0.6) }}><Badge name="user" size={220} color={C.text} /></div>
      <Lbl x={RX + 20} y={580} w={260} t="Kollegin" size={46} align="center" color={C.mute} a={o(0.8)} />
      {fr.map(([q, i]) => (
        <div key={q} style={{ position: "absolute", left: RX + 330 + i * 40, top: 250 + i * 135, width: 520 - i * 40, height: 108, borderRadius: 54, background: C.orange + "22", border: `4px solid ${C.orange}`, color: C.orange, fontSize: 54, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", opacity: o(cue(2) + 0.2 + i * 0.9), boxSizing: "border-box" }}>{q}</div>
      ))}
      <Panel x={RX} y={720} w={RW} h={255} r={28} a={o(cue(1) + 0.8)} rand={C.blue} />
      <div style={{ position: "absolute", left: RX + 30, top: 780, opacity: o(cue(1) + 1.0) }}><Badge name="bot" size={130} color={C.blue} /></div>
      <div style={{ position: "absolute", left: RX + 190, top: 760, width: 720, height: 175, borderRadius: 26, background: C.panel2, fontSize: 44, fontWeight: 600, lineHeight: 1.25, padding: "18px 28px", boxSizing: "border-box", opacity: o(cue(1) + 1.6) }}>Sehr geehrte Damen und Herren, leider gibt es eine Verzögerung. Wir bitten um Verständnis.</div>
      <Lbl x={90} y={760} w={740} t="Ergebnis: Glückssache" size={64} weight={800} color={C.red} a={o(cue(2) + 3.0)} />
    </Szene>
  );
};

// ---------- 2 Lücken füllen
const Anker2 = () => { const { t, cue } = useCues(); return <ZettelA n={1 + lin(t, 0.6, cue(0) + 2.6, 0, 3)} />; };
const Fuellen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const raten = lerp(1, 0.12, lin(t, cue(0) + 0.6, cue(1) + 3));
  const L = [["An wen?", "Frau Muster"], ["Ton?", "freundlich"], ["Länge?", "kurz"]];
  return (
    <Szene titel="Lücken füllen" tiefe={["bulb", 1500, 640, 800]} anker={<Anker2 />}>
      <Lbl x={RX} y={225} w={RW} t="Wie viel muss das Modell raten?" size={52} weight={800} color={C.mute} a={o(cue(1))} />
      <div style={{ position: "absolute", left: RX, top: 320, width: RW, height: 110, borderRadius: 55, background: "#2c2c2e", opacity: o(cue(1)) }}><div style={{ width: RW * raten, height: 110, borderRadius: 55, background: raten > 0.5 ? C.red : raten > 0.25 ? C.orange : C.green }} /></div>
      <Lbl x={RX} y={450} w={RW} t={raten > 0.5 ? "viel" : "wenig"} size={72} weight={800} align="center" color={raten > 0.5 ? C.red : C.green} a={o(cue(1))} />
      <Panel x={RX} y={600} w={RW} h={375} r={28} a={o(cue(2) - 0.2)} rand={C.blue} />
      <div style={{ position: "absolute", left: RX + 30, top: 640, opacity: o(cue(2)) }}><Badge name="bot" size={150} color={C.blue} /></div>
      {L.map(([q, a], i) => (
        <React.Fragment key={q}>
          <Lbl x={RX + 200} y={642 + i * 100} w={180} t={q} size={44} color={C.mute} a={o(cue(2) + 0.3 + i * 0.5)} />
          <div style={{ position: "absolute", left: RX + 380, top: 635 + i * 100, width: 540, height: 74, borderRadius: 16, background: "#3a3a3c", border: `3px dashed ${C.orange}`, color: C.orange, fontSize: 40, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", opacity: o(cue(2) + 0.6 + i * 0.5), boxSizing: "border-box" }}>wahrscheinlich: {a}</div>
        </React.Fragment>
      ))}
    </Szene>
  );
};

// ---------- 3 Sechs Bausteine
const BS = [["Rolle", "user", "Aus welcher Sicht?", "Du bist Kundenberaterin.", C.blue, "Rolle"], ["Aufgabe", "target", "Was soll es tun?", "Schreibe eine Mail.", C.green, "Aufgabe"], ["Kontext", "file", "Was muss es wissen?", "Lieferung kommt später.", C.orange, "Kontext"], ["Beispiele", "list", "Wie sieht gut aus?", "Beispiel: freundlich, kurz.", "#bf5af2", "Beispiele"], ["Format", "grid", "Wie lang, welche Form?", "Höchstens 100 Wörter.", C.blue, "Format"], ["Grenzen", "shield", "Was soll es lassen?", "Keine Preiszusagen.", C.red, "Grenzen"]];
const Bausteine = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const at = [word(0, "Rolle"), word(0, "Aufgabe"), word(0, "Kontext"), word(1, "Beispiele"), word(1, "Format"), word(1, "Grenzen")];
  return (
    <Szene titel="Sechs Bausteine" tiefe={["list", 1500, 640, 800]}>
      {BS.map(([n, ic, q, ex, f], i) => (
        <div key={n} style={{ position: "absolute", left: 90 + (i % 3) * 590, top: 215 + Math.floor(i / 3) * 385, width: 560, height: 360, borderRadius: 28, background: C.panel, border: `4px solid ${f}`, opacity: o(at[i] - 0.3), boxSizing: "border-box", padding: "26px 30px", transform: `translateY(${(1 - sp(t, at[i] - 0.3, 0.7)) * 30}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}><Icon name={ic} size={84} color={f} sw={1.6} /><div style={{ fontSize: 66, fontWeight: 800 }}>{n}</div></div>
          <div style={{ fontSize: 42, color: C.mute, fontWeight: 600, marginTop: 18 }}>{q}</div>
          <div style={{ fontSize: 46, fontWeight: 700, marginTop: 16, color: f, lineHeight: 1.15 }}>{ex}</div>
        </div>
      ))}
    </Szene>
  );
};

// ---------- 4 Vergleich
const Vergleich = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Der Vergleich" tiefe={["check", 1500, 640, 800]}>
      <Panel x={90} y={215} w={850} h={640} r={28} a={o(0.3)} rand={C.red} />
      <Lbl x={90} y={235} w={850} t="Ohne Angaben" size={56} weight={800} align="center" color={C.red} a={o(0.4)} />
      <div style={{ position: "absolute", left: 130, top: 330, width: 770, fontSize: 46, fontWeight: 600, lineHeight: 1.3, color: C.mute, opacity: o(cue(1) - 0.2) }}>Sehr geehrte Damen und Herren, leider gibt es ein Problem mit Ihrer Bestellung. Wir bitten um Verständnis.</div>
      {["Ton?", "Grund?", "Wann?"].map((q, i) => (
        <div key={q} style={{ position: "absolute", left: 130 + i * 250, top: 700, opacity: o(cue(1) + 0.6 + i * 0.3) }}><Etikett x={0} y={0} t={q} f={C.red} size={40} /></div>
      ))}
      <Panel x={980} y={215} w={850} h={640} r={28} a={o(cue(1) + 0.3)} rand={C.green} />
      <Lbl x={980} y={235} w={850} t="Mit allen Bausteinen" size={56} weight={800} align="center" color={C.green} a={o(cue(1) + 0.4)} />
      <div style={{ position: "absolute", left: 1020, top: 330, width: 770, fontSize: 46, fontWeight: 600, lineHeight: 1.3, opacity: o(cue(1) + 0.8) }}>Guten Tag Frau Muster, Ihre Lieferung kommt zwei Tage später, am Donnerstag. Das tut uns leid. Preise ändern sich nicht.</div>
      {["Ton passt", "Länge passt", "nichts erfunden"].map((q, i) => (
        <div key={q} style={{ position: "absolute", left: 1020, top: 640 + i * 70, display: "flex", alignItems: "center", gap: 18, opacity: o(cue(1) + 1.6 + i * 0.5), fontSize: 44, fontWeight: 700, color: C.green }}><Mark flow ok size={56} />{q}</div>
      ))}
      <Panel x={90} y={880} w={1740} h={100} r={24} a={o(cue(2) - 0.1)} rand={C.blue} />
      <Lbl x={90} y={900} w={1740} t="Der Prompt ist länger. Du sparst dir drei Nachfragen." size={54} weight={800} align="center" color={C.blue} a={o(cue(2))} />
    </Szene>
  );
};

// ---------- 5 Ausweg
const Anker5 = () => { const { t, cue } = useCues(); return <ZettelA n={4 + ease(t, 0.2, 0.9)} hl={t > 0.5 && t < cue(1) ? 4 : -1} />; };
const Ausweg = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const aus = ease(t, cue(1) + 0.8, cue(1) + 1.6);
  return (
    <Szene titel="Ein Ausweg" tiefe={["door", 1500, 640, 800]} anker={<Anker5 />}>
      <Panel x={RX} y={215} w={RW} h={380} r={28} a={o(cue(0) + 0.6)} rand={C.green} />
      <Lbl x={RX} y={232} w={RW} t="Antwort des Modells" size={50} weight={800} align="center" color={C.green} a={o(cue(0) + 0.7)} />
      <div style={{ position: "absolute", left: RX + 40, top: 320, width: RW - 80, fontSize: 48, fontWeight: 600, lineHeight: 1.3, opacity: o(cue(0) + 1.2) }}>Ihr Liefertermin ist <span style={{ background: C.orange + "44", border: `3px solid ${C.orange}`, borderRadius: 12, padding: "0 14px", color: C.orange, fontWeight: 800 }}>nicht genannt</span>. Bitte nennen Sie mir das Datum.</div>
      <Panel x={RX} y={630} w={RW} h={345} r={28} a={o(cue(1) - 0.2)} rand={C.red} />
      <div style={{ position: "absolute", left: RX + 40, top: 700, width: 260, height: 190, borderRadius: 26, background: C.panel2, border: `4px solid ${C.green}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: o(cue(1)), boxSizing: "border-box" }}><Icon name="door" size={90} color={C.green} /><div style={{ fontSize: 44, fontWeight: 800 }}>Dein Haus</div></div>
      <Pf x1={RX + 320} y1={795} x2={RX + 620} y2={795} p={ease(t, cue(1) + 0.9, cue(1) + 1.8)} f={C.red} w={9} />
      <div style={{ position: "absolute", left: RX + 650, top: 700, width: 260, height: 190, borderRadius: 26, background: C.panel2, border: `4px solid ${C.red}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, opacity: o(cue(1) + 0.9), boxSizing: "border-box" }}><Icon name="cloud" size={90} color={C.red} /><div style={{ fontSize: 44, fontWeight: 800 }}>Cloud-Chat</div></div>
      <Etikett x={RX + 40} y={905} t="Keine vertraulichen Daten an fremde Dienste" f={C.red} size={40} a={o(cue(1) + 2.6)} />
    </Szene>
  );
};

export default { zettel: Zett, fuellen: Fuellen, bausteine: Bausteine, vergleich: Vergleich, ausweg: Ausweg };
