import React from "react";
import { Szene, useCues, sp, ease, lerp, rnd, C } from "../lib.jsx";
import { Panel, Lbl, Dok, Skel, Zahlen } from "../bausteine.jsx";
import { Pf, Etikett, Zeile, Mark } from "../neu.jsx";
import { Kn, Kachel, Bg, Ic } from "../bausteine-betrieb.jsx";
import { Blase } from "../bausteine-uc.jsx";

const DOKS = [["Wartungsanleitung", "wrench"], ["Dienstleistungsvertrag", "file"], ["Betriebsvereinbarung", "users"], ["Produkt-FAQ", "help"]];

// ---------- 1 Vier Dokumente, jemand blättert
const Ordner = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Vier Dokumente" tiefe={["file", 1500, 640, 800]}>
      {DOKS.map(([n, ic], i) => {
        const x = 140 + i * 430, p = ((t * 0.55 + i * 0.27) % 1);
        return (
          <React.Fragment key={n}>
            <Dok x={x} y={250} w={360} h={440} n={9} seed={i * 3 + 1} a={o(0.3 + i * 0.25)} />
            <div style={{ position: "absolute", left: x + 24, top: 280 + p * 360, width: 312, height: 22, borderRadius: 11, background: C.orange, opacity: 0.85 * o(0.6 + i * 0.25) }} />
            <div style={{ position: "absolute", left: x - 20, top: 715, width: 400, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, opacity: o(0.5 + i * 0.25) }}><Ic name={ic} size={48} color={C.blue} /><div style={{ fontSize: 30, fontWeight: 700 }}>{n}</div></div>
          </React.Fragment>
        );
      })}
      <Etikett x={1390} y={152} t="alle frei erfunden" f={C.mute} size={34} a={o(word(1, "erfunden") - 0.3)} />
      <Kn x={960} y={900} w={1100} h={100} t="Wer eine Antwort braucht, blättert lange" ic="clock" f={C.orange} size={44} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 2 Zwölf Abschnitte, jeder wird zu Zahlen
const Abschnitte = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const u = ease(t, 0.8, 2.4);
  const z = ease(t, cue(1) - 0.3, cue(1) + 0.8);
  return (
    <Szene titel="In Abschnitte teilen" tiefe={["layers", 1500, 640, 800]}>
      {Array.from({ length: 12 }).map((_, i) => {
        const d = Math.floor(i / 3), k = i % 3;
        const x = lerp(140 + d * 430, 130 + d * 440, u), y = lerp(250 + k * 147, 240 + k * 205, u);
        const w = lerp(360, 390, u), h = lerp(146, 185, u);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 18, background: C.panel, border: `3px solid ${u > 0.5 ? C.blue : C.line}`, boxSizing: "border-box", opacity: o(0.2 + d * 0.1) }}>
            <Skel x={24} y={22} w={w - 48} n={3} gap={26} h={12} seed={i} />
            <Zahlen x={24} y={h - 62} w={w - 48} h={44} n={14} seed={i * 1.7} a={z} />
          </div>
        );
      })}
      <Kn x={960} y={950} w={800} h={90} t="12 Abschnitte, jeder als Zahlen" ic="grid" f={C.blue} size={46} a={o(cue(0) + 1.5)} />
    </Szene>
  );
};

// ---------- 3 Treffer mit Score
const TR = [["Dienstleistungsvertrag", "file", 0.92], ["Betriebsvereinbarung", "users", 0.45], ["Wartungsanleitung", "wrench", 0.3]];
const Treffer = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tt = word(0, "die am besten");
  return (
    <Szene titel="Treffer und Score" tiefe={["search", 1500, 640, 800]}>
      <Blase x={110} y={250} w={760} h={190} t="Wie lang ist die Kündigungsfrist im Vertrag?" ic="message" f={C.blue} size={44} rechts a={o(0.4)} />
      <Pf x1={890} y1={345} x2={960} y2={345} p={ease(t, tt - 0.3, tt + 0.2)} f={C.mute} w={7} />
      {TR.map(([n, ic, s], i) => (
        <div key={n} style={{ position: "absolute", left: 980, top: 250 + i * 170, width: 850, height: 150, borderRadius: 24, background: C.panel2, border: `4px solid ${i === 0 ? C.green : C.line}`, boxSizing: "border-box", opacity: o(tt + i * 0.4), display: "flex", alignItems: "center", gap: 20, padding: "0 28px" }}>
          <Ic name={ic} size={56} color={i === 0 ? C.green : C.mute} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 36, fontWeight: 700 }}>{n}</div>
            <div style={{ height: 22, borderRadius: 11, background: C.line, marginTop: 14 }}><div style={{ width: `${ease(t, tt + i * 0.4 + 0.3, tt + i * 0.4 + 1.2) * s * 100}%`, height: 22, borderRadius: 11, background: i === 0 ? C.green : C.mute }} /></div>
          </div>
          <div style={{ fontSize: 30, color: C.mute, fontWeight: 600 }}>Score</div>
        </div>
      ))}
      <Kachel x={110} y={500} w={760} h={330} ic="target" t="Zuerst die Treffer ansehen" sub="liegt der richtige Abschnitt oben?" f={C.orange} a={o(cue(1))} ics={110} size={48} />
    </Szene>
  );
};

// ---------- 4 Antwort mit Quelle
const Quelle = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tk = word(1, "klickst");
  return (
    <Szene titel="Antwort mit Quelle" tiefe={["link", 1500, 640, 800]}>
      <Panel x={110} y={250} w={940} h={330} a={o(0.4)} rand={C.blue} />
      <div style={{ position: "absolute", left: 150, top: 275, display: "flex", alignItems: "center", gap: 16, opacity: o(0.5) }}><Ic name="bot" size={56} color={C.blue} /><div style={{ fontSize: 36, color: C.mute, fontWeight: 600 }}>Antwort</div></div>
      <div style={{ position: "absolute", left: 150, top: 370, width: 860, fontSize: 56, fontWeight: 700, lineHeight: 1.15, opacity: o(0.8) }}>Die Kündigungsfrist beträgt drei Monate.</div>
      <Kn x={430} y={680} w={640} h={110} t="Quelle: Vertrag" ic="link" f={C.blue} size={46} a={o(word(0, "nennt die Quelle") - 0.3)} />
      <Pf x1={770} y1={690} x2={1180} y2={560} p={ease(t, tk, tk + 0.8)} f={C.orange} w={8} />
      <Lbl x={1180} y={215} w={600} t="Dienstleistungsvertrag" size={34} color={C.mute} align="center" a={o(tk - 0.3)} />
      <Dok x={1210} y={270} w={540} h={600} n={10} seed={4} a={o(tk - 0.4)} mark={[3, 4]} hl={C.orange} />
      <Kn x={580} y={850} w={940} h={110} t="Du prüfst die Fundstelle selbst" ic="check" f={C.green} size={44} a={o(tk + 0.3)} />
    </Szene>
  );
};

// ---------- 5 Die Fangfrage: Pipeline mit zwei Ausgängen
const Fang = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const th = word(0, "steht nirgends"), tg = word(1, "sagt"), te = word(1, "erfindet");
  return (
    <Szene titel="Die Fangfrage" tiefe={["help", 1500, 640, 800]}>
      <Blase x={110} y={380} w={500} h={190} t="Wie viel Urlaub gibt es?" ic="help" f={C.orange} rechts a={o(0.4)} size={42} />
      <Pf x1={630} y1={475} x2={700} y2={475} p={ease(t, 0.9, 1.3)} f={C.mute} w={7} />
      {[0.22, 0.15, 0.1].map((s, i) => (
        <div key={i} style={{ position: "absolute", left: 720, top: 280 + i * 150, width: 440, height: 130, borderRadius: 22, background: C.panel2, border: `3px solid ${C.line}`, boxSizing: "border-box", opacity: o(1.1 + i * 0.3), padding: "20px 26px" }}>
          <div style={{ fontSize: 30, color: C.mute, fontWeight: 600 }}>Treffer {i + 1}</div>
          <div style={{ height: 20, borderRadius: 10, background: C.line, marginTop: 20 }}><div style={{ width: `${ease(t, 1.4 + i * 0.3, 2.2 + i * 0.3) * s * 100}%`, height: 20, borderRadius: 10, background: C.mute }} /></div>
        </div>
      ))}
      <Etikett x={720} y={735} t="alle Scores niedrig" f={C.mute} size={36} a={o(th)} />
      <Pf x1={1180} y1={475} x2={1260} y2={475} p={ease(t, th, th + 0.4)} f={C.mute} w={7} />
      <Panel x={1280} y={270} w={550} h={250} rand={C.green} a={o(tg)} />
      <div style={{ position: "absolute", left: 1310, top: 300, width: 490, display: "flex", alignItems: "center", gap: 18, opacity: o(tg) }}><Mark x={0} y={0} ok size={80} flow /><div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15 }}>Dazu steht nichts in den Dokumenten</div></div>
      <Panel x={1280} y={570} w={550} h={250} rand={C.red} a={o(te)} />
      <div style={{ position: "absolute", left: 1310, top: 600, width: 490, display: "flex", alignItems: "center", gap: 18, opacity: o(te) }}><Mark x={0} y={0} ok={false} size={80} flow /><div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.15, color: C.red }}>erfindet eine Zahl</div></div>
      <Kn x={500} y={900} w={900} h={100} t="Wichtigster Test: bleibt es ehrlich?" ic="target" f={C.orange} size={42} a={o(word(1, "wichtigste") - 0.2)} />
    </Szene>
  );
};

// ---------- 6 Aktuell und berechtigt
const Rechte = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ROWS = [["darf alles sehen", [1, 1, 1], C.green], ["darf den Vertrag nicht sehen", [1, 0, 1], C.orange]];
  return (
    <Szene titel="Aktuell und berechtigt" tiefe={["lock", 1500, 640, 800]}>
      <Kn x={500} y={290} w={760} h={100} t="Dokumente aktuell halten" ic="refresh" f={C.blue} size={42} a={o(word(0, "aktuelle"))} />
      <Kn x={1420} y={290} w={760} h={100} t="Zugriffsrechte beachten" ic="lock" f={C.blue} size={42} a={o(word(0, "Zugriffsrechte"))} />
      {ROWS.map(([lab, ok, f], r) => {
        const y = 440 + r * 260;
        return (
          <React.Fragment key={r}>
            <div style={{ position: "absolute", left: 110, top: y + 20, opacity: o(cue(1) + r * 1.0) }}><Bg name="user" size={150} color={f} /></div>
            <Lbl x={80} y={y + 185} w={230} t={lab} size={28} color={f} align="center" a={o(cue(1) + r * 1.0)} />
            {[["Wartung", "wrench"], ["Vertrag", "file"], ["Vereinbarung", "users"]].map(([n, ic], i) => (
              <div key={i} style={{ position: "absolute", left: 400 + i * 470, top: y, width: 430, height: 190, borderRadius: 22, background: ok[i] ? C.panel2 : "#1a1a1c", border: `4px ${ok[i] ? "solid" : "dashed"} ${ok[i] ? C.line : C.red}`, boxSizing: "border-box", opacity: o(cue(1) + r * 1.0 + 0.3 + i * 0.2), display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontSize: 34, fontWeight: 700, color: ok[i] ? C.text : C.red }}>
                <Ic name={ok[i] ? ic : "lock"} size={60} color={ok[i] ? C.mute : C.red} />{ok[i] ? n : "kein Zugriff"}
              </div>
            ))}
          </React.Fragment>
        );
      })}
    </Szene>
  );
};

export default { ordner: Ordner, abschnitte: Abschnitte, treffer: Treffer, quelle: Quelle, fang: Fang, rechte: Rechte };
