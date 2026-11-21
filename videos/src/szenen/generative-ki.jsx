import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, Pill, Pfeil, Pfad, C, rnd, spitze } from "../lib.jsx";

const softmax = (l, T) => { const e = l.map((x) => Math.exp(x / T)); const s = e.reduce((a, b) => a + b, 0); return e.map((x) => x / s); };
const Balken = ({ x, y, label, p, farbe = C.blue, hell = false, breite = 640, size = 40, lw = 300 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 28, height: 56 }}>
    <div style={{ width: lw, textAlign: "right", fontSize: size, fontWeight: hell ? 700 : 500, color: hell ? C.text : C.mute }}>{label}</div>
    <div style={{ width: breite, height: 36, borderRadius: 18, background: C.panel2 }}>
      <div style={{ width: Math.max(8, breite * p), height: 36, borderRadius: 18, background: farbe }} />
    </div>
  </div>
);

const Tokens = () => {
  const { t, cue, word } = useCues();
  const satz = "Der Himmel ist heute klar";
  const tipp = Math.floor(lin(t, cue(0) + 0.5, cue(0) + 2.6, 0, satz.length));
  const toks = ["Der", "Himmel", "ist", "heute", "klar", "."];
  const farben = [C.blue, "#64d2ff", C.green, C.orange, "#bf5af2", C.mute];
  const teile = ["un", "glaub", "lich"];
  return (
    <Szene titel="Text in Tokens" sub="Das Modell liest keine Wörter, sondern Tokens">
      <div style={{ position: "absolute", left: 120, top: 370, fontSize: 76, fontWeight: 600, letterSpacing: -1 }}>
        {satz.slice(0, tipp)}<span style={{ display: "inline-block", width: 6, height: 70, background: C.blue, marginLeft: 6, verticalAlign: "middle", opacity: Math.floor(t * 2) % 2 ? 0.2 : 1 }} />
      </div>
      <Txt at={cue(0) + 0.3} x={120} y={470} w={900} size={38} color={C.mute}>Das Modell sagt voraus, was als Nächstes kommt</Txt>
      <div style={{ position: "absolute", left: 120, top: 590, display: "flex", gap: 14 }}>
        {toks.map((k, i) => (
          <Rv key={i} at={cue(1) + 0.2 + i * 0.28} dy={14} s0={0.9}>
            <div style={{ fontSize: 56, fontWeight: 600, padding: "10px 24px", borderRadius: 16, background: farben[i] + "26", border: `3px solid ${farben[i]}`, color: C.text }}>{k}</div>
          </Rv>
        ))}
      </div>
      <Txt at={cue(1) + 0.4} x={120} y={725} w={1000} size={38} color={C.mute}>Jedes Stück ist ein Token</Txt>
      <Rv at={word(1, "Wortteil")} dy={14} style={{ position: "absolute", left: 120, top: 810 }}>
        <div style={{ fontSize: 36, color: C.mute, marginBottom: 14 }}>Lange oder seltene Wörter werden oft in Teile zerlegt (Beispiel)</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 48, fontWeight: 600 }}>unglaublich</div>
          <div style={{ fontSize: 40, color: C.mute }}>wird zu</div>
          {teile.map((x, i) => <div key={i} style={{ fontSize: 48, fontWeight: 600, padding: "6px 20px", borderRadius: 14, background: C.panel2, border: `3px solid ${C.line}` }}>{x}</div>)}
        </div>
      </Rv>
    </Szene>
  );
};

const R1 = { prompt: "Der Himmel ist", kand: ["blau", "grau", "bewölkt", "heute", "Kühlschrank"], l: [3.3, 2.2, 1.9, 0.9, -2.2] };
const R2 = { prompt: "Der Himmel ist blau", kand: [".", ",", "und", "heute", "Auto"], l: [3.1, 2.6, 1.7, 0.6, -2.4] };
const Naechstes = () => {
  const { t, cue, end } = useCues();
  const wahl1 = cue(1) + 0.3, wechsel = cue(1) + 2.2;
  const runde = t < wechsel ? R1 : R2;
  const p = softmax(runde.l, 1);
  const grow = t < wechsel ? ease(t, cue(0) + 0.8, cue(0) + 2.2) : ease(t, wechsel, wechsel + 1.2);
  const gew = t < wechsel ? (t > wahl1 ? 0 : -1) : (t > wechsel + 2.0 ? 1 : -1);
  return (
    <Szene titel="Das nächste Token" sub="Wahrscheinlichkeiten für jede Fortsetzung">
      <div style={{ position: "absolute", left: 120, top: 360, fontSize: 80, fontWeight: 600, letterSpacing: -1 }}>
        {R1.prompt}
        {t > wechsel - 0.3 && <span style={{ color: C.blue, opacity: sp(t, wechsel - 0.3, 0.5) }}> blau</span>}
        {t > wechsel + 2.0 && <span style={{ color: C.blue, opacity: sp(t, wechsel + 2.0, 0.5) }}>,</span>}
        <span style={{ display: "inline-block", width: 6, height: 74, background: C.blue, marginLeft: 8, verticalAlign: "middle", opacity: Math.floor(t * 2) % 2 ? 0.2 : 1 }} />
      </div>
      <Txt at={cue(0) + 0.6} x={500} y={500} w={800} size={38} color={C.mute}>Wahrscheinlichkeit des nächsten Tokens</Txt>
      {runde.kand.map((k, i) => (
        <Balken key={t < wechsel ? "a" + k : "b" + k} x={120} y={560 + i * 76} label={k === "." ? "Punkt ." : k === "," ? "Komma ," : k} p={p[i] * grow} hell={gew === i} farbe={gew === i ? C.green : C.blue} />
      ))}
      <Rv at={cue(1) + 0.2} dx={30} dy={0} style={{ position: "absolute", left: 1330, top: 560 }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: C.green }}>Eines wird gewählt</div>
        <div style={{ fontSize: 36, color: C.mute, marginTop: 8, width: 440, lineHeight: 1.3 }}>und an den Text angehängt.</div>
      </Rv>
      <Rv at={wechsel + 0.2} dx={30} dy={0} style={{ position: "absolute", left: 1330, top: 700 }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: C.blue }}>Dann von vorn</div>
        <div style={{ fontSize: 36, color: C.mute, marginTop: 8, width: 440, lineHeight: 1.3 }}>mit dem verlängerten Text.</div>
      </Rv>
    </Szene>
  );
};

const KAND = ["blau", "grau", "bewölkt", "heute", "Kühlschrank"];
const LOG = [3.3, 2.2, 1.9, 0.9, -2.2];
const Temperatur = () => {
  const { t, cue, end } = useCues();
  const T = t < cue(1) ? lerp(1.0, 0.25, ease(t, cue(0) + 1.0, cue(1) + 0.3)) : lerp(0.25, 2.2, ease(t, cue(2) + 0.2, cue(2) + 2.6));
  const pos = (T - 0.2) / 2.2;
  const p = softmax(LOG, T);
  const SX = 560, SW = 1000;
  const hoch = T > 1.4;
  return (
    <Szene titel="Temperatur" sub="Wie mutig wählt das Modell?">
      <div style={{ position: "absolute", left: 120, top: 360, fontSize: 36, fontWeight: 600 }}>Der Himmel ist …</div>
      <Rv at={0.5} dy={0}>
        <div style={{ position: "absolute", left: SX, top: 398, width: SW, height: 10, borderRadius: 5, background: `linear-gradient(90deg, ${C.blue}, ${C.orange})` }} />
        <div style={{ position: "absolute", left: SX + pos * SW - 22, top: 380, width: 44, height: 44, borderRadius: 22, background: "#fff", boxShadow: "0 4px 20px #0008" }} />
        <div style={{ position: "absolute", left: SX, top: 438, fontSize: 36, color: C.blue, fontWeight: 600 }}>niedrig</div>
        <div style={{ position: "absolute", left: SX + SW - 100, top: 438, width: 100, textAlign: "right", fontSize: 36, color: C.orange, fontWeight: 600 }}>hoch</div>
      </Rv>
      {KAND.map((k, i) => (
        <Balken key={k} x={120} y={540 + i * 76} label={k} p={p[i]} hell={i === 0 || (hoch && i === 4)} farbe={i === 4 && hoch ? C.orange : C.blue} breite={560} lw={300} />
      ))}
      <Rv at={cue(1) + 0.3} dx={30} dy={0} style={{ position: "absolute", left: 1090, top: 560, opacity: undefined }}>
        <div style={{ opacity: 1 - sp(t, cue(2) + 0.2, 0.5) }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: C.blue }}>Niedrig</div>
          <div style={{ fontSize: 36, color: C.mute, marginTop: 8, width: 640, lineHeight: 1.3 }}>fast immer das wahrscheinlichste Token. Sicher, aber gleichförmig.</div>
        </div>
      </Rv>
      <Rv at={cue(2) + 0.6} dx={30} dy={0} style={{ position: "absolute", left: 1090, top: 560 }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: C.orange }}>Hoch</div>
        <div style={{ fontSize: 36, color: C.mute, marginTop: 8, width: 640, lineHeight: 1.3 }}>auch unwahrscheinliche Kandidaten bekommen eine Chance. Abwechslungsreich, aber riskanter.</div>
      </Rv>
    </Szene>
  );
};

const KT = ["Ich", "habe", "gestern", "ein", "Buch", "über", "Roboter", "gelesen", "und", "frage", "mich", "jetzt", "wie", "sie", "lernen", "können", "heute", "schon"];
const Kontext = () => {
  const { t, cue, end } = useCues();
  const WX = 900, WR = 1800;
  const breit = (w) => w.length * 22 + 54;
  let xs = []; let acc = 0;
  KT.forEach((w) => { xs.push(acc); acc += breit(w) + 14; });
  const off = -170 * Math.max(0, t - (cue(2) - 0.3));
  const anz = (() => { let n = 0; KT.forEach((w, i) => { const x = WX + xs[i] + off; if (x >= WX - 2 && x + breit(w) <= WR + 2) n++; }); return n; })();
  return (
    <Szene titel="Kontextfenster" sub="Das Gedächtnis einer Anfrage">
      <Rv at={cue(1) - 0.3} dy={0}>
        <div style={{ position: "absolute", left: WX - 14, top: 470, width: WR - WX + 28, height: 200, borderRadius: 28, border: `4px solid ${C.blue}`, background: C.blue + "10" }} />
        <div style={{ position: "absolute", left: WX - 14, top: 420, fontSize: 36, fontWeight: 700, color: C.blue }}>Kontextfenster: hier liest das Modell mit</div>
      </Rv>
      <div style={{ position: "absolute", left: 120, top: 500, width: 1700, height: 140, overflow: "hidden", WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 60px)" }}>
        {KT.map((w, i) => {
          const x = WX + xs[i] + off - 120;
          const innen = x + 120 >= WX - 2;
          const a = sp(t, 0.4 + Math.min(i, 8) * 0.12, 0.6) * Math.max(0, Math.min(1, (WR - 4 - (x + 120 + breit(w))) / 50));
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 34, fontSize: 40, width: breit(w), boxSizing: "border-box", textAlign: "center", padding: "10px 0", fontWeight: 600, borderRadius: 14, background: innen ? C.panel2 : "#111", border: `3px solid ${innen ? C.blue + "99" : "#2a2a2c"}`, color: innen ? C.text : "#58585d", opacity: a, whiteSpace: "nowrap" }}>{w}</div>
          );
        })}
      </div>
      <Rv at={cue(2) + 0.4} dy={0}>
        <div style={{ position: "absolute", left: 120, top: 700, display: "flex", alignItems: "center", gap: 14, fontSize: 36, color: C.orange, fontWeight: 600 }}><Icon name="x" size={36} color={C.orange} />Außerhalb des Fensters: vergessen</div>
      </Rv>
      <Txt at={cue(1)} x={120} y={820} w={1500} size={38} color={C.text} weight={500}>Nur was in das Fenster passt, fließt in die Antwort ein.</Txt>
      <Txt at={cue(2) + 1.2} x={120} y={880} w={1500} size={38} color={C.mute}>Neue Tokens schieben alte hinaus.</Txt>
    </Szene>
  );
};

const Halluzination = () => {
  const { t, cue, end } = useCues();
  const antwort = "Die Hauptstadt von Atlantis heißt Aquaria.";
  const n = Math.floor(lin(t, cue(0) + 1.8, cue(0) + 4.2, 0, antwort.length));
  return (
    <Szene titel="Halluzination" sub="Plausibel ist nicht gleich wahr">
      <Rv at={cue(0) + 0.4} dx={40} dy={0} style={{ position: "absolute", left: 960, top: 350, width: 840 }}>
        <div style={{ background: C.blue, borderRadius: 30, padding: "22px 34px", fontSize: 38, fontWeight: 500, float: "right" }}>Wie heißt die Hauptstadt von Atlantis?</div>
      </Rv>
      <Rv at={cue(0) + 1.4} dx={-40} dy={0} style={{ position: "absolute", left: 120, top: 480, width: 1100 }}>
        <div style={{ background: C.panel2, borderRadius: 30, padding: "22px 34px", fontSize: 38, minHeight: 60, border: `3px solid ${t > cue(2) + 0.4 ? C.orange : "transparent"}` }}>{antwort.slice(0, n)}<span style={{ opacity: 0.3 }}>{n < antwort.length ? "|" : ""}</span></div>
      </Rv>
      <Txt at={cue(0) + 4.6} x={120} y={600} w={900} size={38} color={C.mute}>Beispielantwort, frei erfunden</Txt>
      {/* Zwei Anzeigen */}
      <Rv at={cue(1) + 0.2} dy={0} style={{ position: "absolute", left: 120, top: 700, width: 1300 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ width: 360, fontSize: 36, fontWeight: 600 }}>klingt plausibel</div>
          <div style={{ width: 700, height: 34, borderRadius: 17, background: C.panel2 }}><div style={{ width: 700 * ease(t, cue(1) + 0.4, cue(1) + 1.4), height: 34, borderRadius: 17, background: C.green }} /></div>
          <Icon name="check" size={46} color={C.green} />
        </div>
      </Rv>
      <Rv at={cue(1) + 1.0} dy={0} style={{ position: "absolute", left: 120, top: 790, width: 1300 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ width: 360, fontSize: 36, fontWeight: 600 }}>durch Fakten belegt</div>
          <div style={{ width: 700, height: 34, borderRadius: 17, background: C.panel2 }}><div style={{ width: 14, height: 34, borderRadius: 17, background: C.orange }} /></div>
          <Icon name="x" size={46} color={C.orange} />
        </div>
      </Rv>
      <Rv at={cue(2) + 0.4} dx={0} s0={0.9} style={{ position: "absolute", left: 1250, top: 500 }}>
        <Pill color={C.orange} size={36}><Icon name="help" size={36} color={C.orange} />erfunden, aber überzeugend</Pill>
      </Rv>
    </Szene>
  );
};

const Rag = () => {
  const { t, cue, word, end } = useCues();
  const X = [260, 700, 1140, 1580], Y = 640;
  const stufen = [
    { n: "Frage", i: "message", at: cue(0) + 0.3 },
    { n: "Suche", i: "search", at: cue(0) + 1.6 },
    { n: "Kontext", i: "list", at: cue(1) },
    { n: "Antwort", i: "sparkles", at: cue(2) },
  ];
  return (
    <Szene titel="RAG" sub="Erst nachschlagen, dann antworten">
      {/* Klammern */}
      <Rv at={word(0, "nachschlagen")} dy={0} style={{ position: "absolute", left: 120, top: 400 }}>
        <div style={{ width: 840, height: 6, borderRadius: 3, background: C.blue, marginBottom: 14 }} /><div style={{ fontSize: 38, fontWeight: 700, color: C.blue }}>1  Nachschlagen</div>
      </Rv>
      <Rv at={word(0, "antworten")} dy={0} style={{ position: "absolute", left: 1000, top: 400 }}>
        <div style={{ width: 800, height: 6, borderRadius: 3, background: C.green, marginBottom: 14 }} /><div style={{ fontSize: 38, fontWeight: 700, color: C.green }}>2  Antworten</div>
      </Rv>
      {stufen.map((s, i) => (
        <React.Fragment key={s.n}>
          <Rv at={s.at} s0={0.85} style={{ position: "absolute", left: X[i] - 90, top: Y - 90 }}><Badge name={s.i} size={180} color={i < 2 ? C.blue : C.green} /></Rv>
          <Txt at={s.at + 0.1} x={X[i] - 180} y={Y + 110} w={360} size={42} weight={700} align="center">{s.n}</Txt>
          {i > 0 && <Pfeil x1={X[i - 1] + 120} y1={Y} x2={X[i] - 120} y2={Y} p={sp(t, s.at - 0.2, 0.6)} color={C.mute} />}
        </React.Fragment>
      ))}
      <Txt at={cue(0) + 0.4} x={X[0] - 180} y={Y + 170} w={360} size={38} color={C.mute} align="center">„Was steht im Handbuch?“</Txt>
      <Txt at={cue(0) + 1.7} x={X[1] - 180} y={Y + 170} w={360} size={38} color={C.mute} align="center">in deinen Dokumenten</Txt>
      <Txt at={cue(1) + 0.4} x={X[2] - 180} y={Y + 170} w={360} size={38} color={C.mute} align="center">passende Stellen kommen in den Kontext</Txt>
      <Txt at={cue(2) + 0.4} x={X[3] - 180} y={Y + 170} w={360} size={38} color={C.mute} align="center">stützt sich auf diese Stellen</Txt>
      <Rv at={cue(2) + 1.4} dy={10} s0={0.9} style={{ position: "absolute", left: X[3] - 150, top: Y + 280 }}>
        <Pill color={C.green} size={36}><Icon name="file" size={32} color={C.green} />Quelle: Handbuch</Pill>
      </Rv>
    </Szene>
  );
};

// Mosaik aus Rauschen und Bild
const GW = 30, GH = 20, CZ = 10;
const ziel = (x, y) => {
  const u = x / GW, v = y / GH;
  const sonne = Math.hypot(u - 0.72, (v - 0.3) * (GH / GW)) < 0.12;
  if (sonne) return "#ffd60a";
  const huegel = 0.68 + 0.08 * Math.sin(u * 7) - 0.15 * u;
  if (v > huegel) return v > huegel + 0.14 ? "#248a3d" : "#30d158";
  return `hsl(${208 + v * 20} 85% ${48 + v * 28}%)`;
};
const rausch = (n) => { const g = Math.floor(40 + rnd(n) * 190); return `rgb(${g}, ${Math.floor(40 + rnd(n + 3) * 190)}, ${Math.floor(40 + rnd(n + 7) * 190)})`; };
const STUFEN = [1, 0.75, 0.5, 0.25, 0];
const RAHMEN = STUFEN.map((n, k) => Array.from({ length: GW * GH }).map((_, c) => {
  const x = c % GW, y = Math.floor(c / GW);
  return rnd(c * 1.7 + 5) >= n ? ziel(x, y) : rausch(c + k * 31);
}));
const Bilder = () => {
  const { t, cue, end } = useCues();
  return (
    <Szene titel="Bilder aus Rauschen" sub="Bildmodelle entrauschen in vielen kleinen Schritten">
      {STUFEN.map((n, k) => {
        const x = 120 + k * 345, at = k === 0 ? cue(0) + 0.5 : cue(1) + 0.2 + (k - 1) * 0.7;
        return (
          <React.Fragment key={k}>
            <Rv at={at} s0={0.92} style={{ position: "absolute", left: x, top: 470 }}>
              <svg width={GW * CZ} height={GH * CZ} style={{ borderRadius: 16, display: "block", border: `2px solid ${C.line}` }} shapeRendering="crispEdges">
                {RAHMEN[k].map((c, i) => <rect key={i} x={(i % GW) * CZ} y={Math.floor(i / GW) * CZ} width={CZ} height={CZ} fill={c} />)}
              </svg>
            </Rv>
            {k > 0 && <Pfeil x1={x - 38} y1={570} x2={x - 8} y2={570} p={sp(t, at, 0.5)} color={C.mute} w={4} />}
          </React.Fragment>
        );
      })}
      <Txt at={cue(0) + 0.8} x={120} y={710} w={300} size={38} weight={700} color={C.mute}>Rauschen</Txt>
      <Txt at={cue(1) + 3.2} x={1500} y={710} w={300} size={38} weight={700} color={C.green}>Bild</Txt>
      <Txt at={cue(1) + 1.0} x={520} y={710} w={900} size={38} weight={600} color={C.blue} align="center">Schritt für Schritt weniger Rauschen</Txt>
      <Txt at={cue(1) + 3.4} x={120} y={900} w={1000} size={38} color={C.mute}>Vereinfachte Darstellung</Txt>
    </Szene>
  );
};

export default { tokens: Tokens, naechstes: Naechstes, temperatur: Temperatur, kontext: Kontext, halluzination: Halluzination, rag: Rag, bilder: Bilder };
