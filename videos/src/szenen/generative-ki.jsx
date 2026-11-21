import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, Pill, Pfeil, Pfad, C, rnd, spitze } from "../lib.jsx";

const softmax = (l, T) => { const e = l.map((x) => Math.exp(x / T)); const s = e.reduce((a, b) => a + b, 0); return e.map((x) => x / s); };

// Balken (Spur + Füllung) und Etikett getrennt: die Balken sind Match-Cut-Anker
const mixc = (a, b, k) => { const h = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); const x = h(a), y = h(b); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(",")})`; };
const Spur = ({ y, p, farbe = C.blue, x = 120, lw = 390, bw = 760, h = 60, a = 1 }) => (
  <div style={{ position: "absolute", left: x + lw + 30, top: y, width: bw, height: h, borderRadius: h / 2, background: C.panel2, opacity: a }}>
    <div style={{ width: Math.max(12, bw * p), height: h, borderRadius: h / 2, background: farbe }} />
  </div>
);
const Etikett = ({ y, label, hell = false, x = 120, lw = 390, h = 60 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: lw, height: h, display: "flex", alignItems: "center", justifyContent: "flex-end", fontSize: 56, fontWeight: hell ? 700 : 500, color: hell ? C.text : C.mute, whiteSpace: "nowrap" }}>{label}</div>
);

// ---- Token-Kette (Match-Cut zwischen "Text in Tokens" und "Das nächste Token")
const KETTE = ["Der", "Himmel", "ist", "blau", "."];
const KFARBEN = [C.blue, "#64d2ff", C.green, C.orange, C.mute];
const kw = (w) => w.length * 54 + 84;
const kx = (i) => 200 + KETTE.slice(0, i).reduce((a, w) => a + kw(w) + 26, 0);
const KY = 290;
const Chip = ({ i, a = 1, x, y = KY, farbe }) => (
  <div style={{ position: "absolute", left: x ?? kx(i), top: y, width: kw(KETTE[i]), height: 130, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 92, fontWeight: 600, borderRadius: 28, background: (farbe ?? KFARBEN[i]) + "26", border: `5px solid ${farbe ?? KFARBEN[i]}`, opacity: a, color: C.text }}>{KETTE[i]}</div>
);

const Tokens = () => {
  const { t, cue, word, dur } = useCues();
  const satz = "Der Himmel ist blau.";
  const tipp = Math.floor(lin(t, cue(0) + 0.5, cue(0) + 2.4, 0, satz.length));
  const zerl = ease(t, cue(1) + 0.1, cue(1) + 0.5);
  const weg = ease(t, dur - 0.7, dur - 0.25); // "blau" und "." lösen sich, die ersten drei Chips bleiben
  const kette = (
    <>
      {KETTE.map((k, i) => <Chip key={i} i={i} a={sp(t, cue(1) + 0.15 + i * 0.22, 0.6) * (i >= 3 ? 1 - weg : 1)} />)}
    </>
  );
  return (
    <Szene titel="Text in Tokens" sub="Das Modell liest keine Wörter, sondern Tokens" tiefe={["message", 1330, 640, 900]} anker={kette}>
      <div style={{ position: "absolute", left: 200, top: KY, height: 130, display: "flex", alignItems: "center", fontSize: 92, fontWeight: 600, opacity: 1 - zerl }}>
        {satz.slice(0, tipp)}<span style={{ display: "inline-block", width: 8, height: 100, background: C.blue, marginLeft: 8, opacity: Math.floor(t * 2) % 2 ? 0.2 : 1 }} />
      </div>
      <Txt at={cue(0) + 0.3} x={200} y={445} w={1500} size={44} color={C.mute}>Das Modell sagt voraus, was als Nächstes kommt</Txt>
      <Txt at={cue(1) + 1.2} x={200} y={560} w={1500} size={64} weight={700}>Jedes Stück ist ein Token</Txt>
      <Rv at={word(1, "Wortteil")} dy={14} style={{ position: "absolute", left: 200, top: 700, width: 1560 }}>
        <div style={{ fontSize: 44, color: C.mute, marginBottom: 18 }}>Lange oder seltene Wörter werden oft in Teile zerlegt (Beispiel)</div>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ fontSize: 92, fontWeight: 600 }}>unglaublich</div>
          <div style={{ fontSize: 70, color: C.mute }}>→</div>
          {["un", "glaub", "lich"].map((x, i) => <div key={i} style={{ fontSize: 92, fontWeight: 600, padding: "0 28px 6px", borderRadius: 22, background: C.panel2, border: `4px solid ${C.line}` }}>{x}</div>)}
        </div>
      </Rv>
    </Szene>
  );
};

const R1 = { kand: ["blau", "grau", "bewölkt", "heute", "Kühlschrank"], l: [3.3, 2.2, 1.9, 0.9, -2.2] };
const R2 = { kand: ["Punkt .", "Komma ,", "und", "heute", "Auto"], l: [3.1, 2.6, 1.7, 0.6, -2.4] };
const Naechstes = () => {
  const { t, cue, end } = useCues();
  const wahl1 = cue(1) + 0.3, wechsel = cue(1) + 2.2;
  const runde = t < wechsel ? R1 : R2;
  const p = softmax(runde.l, 1);
  const grow = t < wechsel ? ease(t, cue(0) + 0.8, cue(0) + 2.2) : ease(t, wechsel, wechsel + 1.2);
  const gew = t < wechsel ? (t > wahl1 ? 0 : -1) : (t > wechsel + 2.0 ? 0 : -1);
  const fl = ease(t, wahl1 + 0.2, wahl1 + 1.0);
  const kette = (
    <>
      {runde.kand.map((k, i) => <Spur key={i} y={500 + i * 94} p={p[i] * grow} farbe={gew === i ? C.green : C.blue} a={Math.min(1, grow * 4)} />)}
      {[0, 1, 2].map((i) => <Chip key={i} i={i} a={1} />)}
      {/* gewähltes Token fliegt aus der Balkenzeile in die Kette */}
      {t > wahl1 + 0.2 && <Chip i={3} a={1} x={lerp(540, kx(3), fl)} y={lerp(500, KY, fl)} />}
    </>
  );
  return (
    <Szene titel="Das nächste Token" sub="Wahrscheinlichkeiten für jede Fortsetzung" tiefe={["list", 1380, 660, 900]} anker={kette}>
      <Txt at={cue(0) + 0.6} x={530} y={440} w={800} size={40} color={C.mute}>Wahrscheinlichkeit des nächsten Tokens</Txt>
      {runde.kand.map((k, i) => (
        <Etikett key={(t < wechsel ? "a" : "b") + k} y={500 + i * 94} label={k} hell={gew === i} />
      ))}
      <Rv at={cue(1) + 0.2} dx={30} dy={0} style={{ position: "absolute", left: 1340, top: 520, width: 484 }}>
        <div style={{ fontSize: 52, fontWeight: 700, color: C.green, lineHeight: 1.1 }}>Eines wird gewählt</div>
        <div style={{ fontSize: 44, color: C.mute, marginTop: 10 }}>und angehängt.</div>
      </Rv>
      <Rv at={wechsel + 0.2} dx={30} dy={0} style={{ position: "absolute", left: 1340, top: 760, width: 484 }}>
        <div style={{ fontSize: 52, fontWeight: 700, color: C.blue, lineHeight: 1.1 }}>Dann von vorn</div>
        <div style={{ fontSize: 44, color: C.mute, marginTop: 10 }}>mit dem längeren Text.</div>
      </Rv>
    </Szene>
  );
};

const KAND = ["blau", "grau", "bewölkt", "heute", "Kühlschrank"];
const LOG = [3.3, 2.2, 1.9, 0.9, -2.2];
const Temperatur = () => {
  const { t, cue } = useCues();
  const T = t < cue(1) ? lerp(1.0, 0.25, ease(t, cue(0) + 1.0, cue(1) + 0.3)) : lerp(0.25, 2.2, ease(t, cue(2) + 0.2, cue(2) + 2.6));
  const pos = (T - 0.2) / 2.2;
  const p = softmax(LOG, T);
  const SX = 760, SW = 1000;
  const hoch = T > 1.4;
  const p2 = softmax(R2.l, 1), m = ease(t, 0.15, 1.1);
  const balken = (
    <>
      {KAND.map((k, i) => <Spur key={i} y={500 + i * 94} p={lerp(p2[i], p[i], m)} farbe={i === 4 && hoch ? C.orange : i === 0 ? mixc(C.green, C.blue, m) : C.blue} />)}
    </>
  );
  return (
    <Szene titel="Temperatur" sub="Wie mutig wählt das Modell?" tiefe={["zap", 1400, 650, 900]} anker={balken}>
      <div style={{ position: "absolute", left: 120, top: 290, fontSize: 64, fontWeight: 600 }}>Der Himmel ist …</div>
      <Rv at={0.5} dy={0}>
        <div style={{ position: "absolute", left: SX, top: 322, width: SW, height: 16, borderRadius: 8, background: `linear-gradient(90deg, ${C.blue}, ${C.orange})` }} />
        <div style={{ position: "absolute", left: SX + pos * SW - 40, top: 290, width: 80, height: 80, borderRadius: 40, background: "#fff", boxShadow: "0 4px 20px #0008" }} />
        <div style={{ position: "absolute", left: SX - 10, top: 384, fontSize: 44, color: C.blue, fontWeight: 600 }}>niedrig</div>
        <div style={{ position: "absolute", left: SX + SW - 190, top: 384, width: 200, textAlign: "right", fontSize: 44, color: C.orange, fontWeight: 600 }}>hoch</div>
      </Rv>
      {KAND.map((k, i) => (
        <Etikett key={k} y={500 + i * 94} label={k} hell={i === 0 || (hoch && i === 4)} />
      ))}
      <Rv at={cue(1) + 0.3} dx={30} dy={0} style={{ position: "absolute", left: 1340, top: 510, width: 484 }}>
        <div style={{ opacity: 1 - sp(t, cue(2) + 0.2, 0.5) }}>
          <div style={{ fontSize: 60, fontWeight: 700, color: C.blue }}>Niedrig</div>
          <div style={{ fontSize: 44, color: C.mute, marginTop: 8, lineHeight: 1.2 }}>fast immer das wahrscheinlichste Token. Sicher, aber gleichförmig.</div>
        </div>
      </Rv>
      <Rv at={cue(2) + 0.6} dx={30} dy={0} style={{ position: "absolute", left: 1340, top: 510, width: 484 }}>
        <div style={{ fontSize: 60, fontWeight: 700, color: C.orange }}>Hoch</div>
        <div style={{ fontSize: 44, color: C.mute, marginTop: 8, lineHeight: 1.2 }}>auch unwahrscheinliche Kandidaten bekommen eine Chance.</div>
      </Rv>
    </Szene>
  );
};

const KT = ["Ich", "habe", "gestern", "ein", "Buch", "über", "Roboter", "gelesen", "und", "frage", "mich", "jetzt", "wie", "sie", "lernen", "können", "heute", "schon"];
const Kontext = () => {
  const { t, cue } = useCues();
  const WX = 640, WR = 1814;
  const breit = (w) => w.length * 40 + 84;
  let xs = []; let acc = 0;
  KT.forEach((w) => { xs.push(acc); acc += breit(w) + 18; });
  const off = -200 * Math.max(0, t - (cue(2) - 0.3));
  return (
    <Szene titel="Kontextfenster" sub="Das Gedächtnis einer Anfrage" tiefe={["book", 1360, 650, 900]}>
      <Rv at={cue(1) - 0.3} dy={0}>
        <div style={{ position: "absolute", left: WX - 20, top: 420, width: WR - WX + 40, height: 270, borderRadius: 36, border: `5px solid ${C.blue}`, background: C.blue + "10" }} />
        <div style={{ position: "absolute", left: WX - 20, top: 340, fontSize: 48, fontWeight: 700, color: C.blue }}>Kontextfenster: hier liest das Modell mit</div>
      </Rv>
      <div style={{ position: "absolute", left: 96, top: 420, width: 1728, height: 270, overflow: "hidden", WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 70px)" }}>
        {KT.map((w, i) => {
          const x = WX + xs[i] + off - 96;
          const innen = x + 96 >= WX - 2;
          const a = sp(t, 0.4 + Math.min(i, 8) * 0.12, 0.6) * Math.max(0, Math.min(1, (WR - 6 - (x + 96 + breit(w))) / 40));
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 75, width: breit(w), height: 120, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, fontWeight: 600, borderRadius: 24, background: innen ? C.panel2 : "#111", border: `4px solid ${innen ? C.blue + "99" : "#2a2a2c"}`, color: innen ? C.text : "#58585d", opacity: a, whiteSpace: "nowrap" }}>{w}</div>
          );
        })}
      </div>
      <Rv at={cue(2) + 0.4} dy={0}>
        <div style={{ position: "absolute", left: 110, top: 730, display: "flex", alignItems: "center", gap: 16, fontSize: 52, color: C.orange, fontWeight: 600 }}><Icon name="x" size={56} color={C.orange} />Außerhalb des Fensters: vergessen</div>
      </Rv>
      <Txt at={cue(1)} x={110} y={820} w={1700} size={62} weight={600}>Nur was in das Fenster passt, fließt in die Antwort ein.</Txt>
      <Txt at={cue(2) + 1.2} x={110} y={915} w={1700} size={52} color={C.mute}>Neue Tokens schieben alte hinaus.</Txt>
    </Szene>
  );
};

const Halluzination = () => {
  const { t, cue } = useCues();
  const antwort = "Die Hauptstadt von Atlantis heißt Aquaria.";
  const n = Math.floor(lin(t, cue(0) + 1.8, cue(0) + 4.2, 0, antwort.length));
  const erf = t > cue(2) + 0.4;
  const w = sp(t, cue(2) + 0.3, 0.8);
  return (
    <Szene titel="Halluzination" sub="Plausibel ist nicht gleich wahr" tiefe={["message", 1400, 640, 900]}>
      <Rv at={cue(0) + 0.4} dx={40} dy={0} style={{ position: "absolute", left: 110, top: 290, width: 1700 }}>
        <div style={{ background: C.blue, borderRadius: 48, padding: "28px 56px", fontSize: 62, fontWeight: 500, float: "right" }}>Wie heißt die Hauptstadt von Atlantis?</div>
      </Rv>
      <Rv at={cue(0) + 1.4} dx={-40} dy={0} style={{ position: "absolute", left: 110, top: 470, width: 1280 }}>
        <div style={{ background: C.panel2, borderRadius: 48, padding: "28px 56px", fontSize: 62, minHeight: 170, border: `5px solid ${erf ? C.orange : "transparent"}`, lineHeight: 1.2 }}>{antwort.slice(0, n)}<span style={{ opacity: 0.3 }}>{n < antwort.length ? "|" : ""}</span></div>
      </Rv>
      <div style={{ position: "absolute", left: 1440, top: 395, width: 380, textAlign: "center", opacity: w, transform: `scale(${lerp(0.7, 1, w)})` }}>
        <Icon name="alert" size={230} color={C.orange} sw={1.4} />
        <div style={{ fontSize: 44, fontWeight: 700, color: C.orange, lineHeight: 1.1, marginTop: 6 }}>erfunden, aber überzeugend</div>
      </div>
      <Rv at={cue(1) + 0.2} dy={0} style={{ position: "absolute", left: 110, top: 790, width: 1700 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div style={{ width: 640, fontSize: 56, fontWeight: 600 }}>klingt plausibel</div>
          <div style={{ width: 860, height: 56, borderRadius: 28, background: C.panel2 }}><div style={{ width: 860 * ease(t, cue(1) + 0.4, cue(1) + 1.4), height: 56, borderRadius: 28, background: C.green }} /></div>
          <Icon name="check" size={72} color={C.green} />
        </div>
      </Rv>
      <Rv at={cue(1) + 1.0} dy={0} style={{ position: "absolute", left: 110, top: 890, width: 1700 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div style={{ width: 640, fontSize: 56, fontWeight: 600 }}>durch Fakten belegt</div>
          <div style={{ width: 860, height: 56, borderRadius: 28, background: C.panel2 }}><div style={{ width: 22, height: 56, borderRadius: 28, background: C.orange }} /></div>
          <Icon name="x" size={72} color={C.orange} />
        </div>
      </Rv>
    </Szene>
  );
};

const Rag = () => {
  const { t, cue, word } = useCues();
  const X = [290, 735, 1180, 1620], Y = 570;
  const stufen = [
    { n: "Frage", i: "message", at: cue(0) + 0.3, s: "„Was steht im Handbuch?“" },
    { n: "Suche", i: "search", at: cue(0) + 1.6, s: "in deinen Dokumenten" },
    { n: "Treffer", i: "list", at: cue(1), s: "passende Stellen im Kontext" },
    { n: "Antwort", i: "sparkles", at: cue(2), s: "stützt sich auf die Treffer" },
  ];
  const erreicht = stufen.reduce((a, s, i) => (t > s.at + 0.3 ? i : a), 0);
  const q = ((t - cue(0)) * 0.28) % 1;
  const px = lerp(X[0], X[erreicht], q);
  return (
    <Szene titel="RAG" sub="Erst nachschlagen, dann antworten" tiefe={["search", 1380, 650, 900]}>
      <Rv at={word(0, "nachschlagen")} dy={0} style={{ position: "absolute", left: 110, top: 310 }}>
        <div style={{ width: 880, height: 8, borderRadius: 4, background: C.blue, marginBottom: 14 }} /><div style={{ fontSize: 56, fontWeight: 700, color: C.blue }}>1  Nachschlagen</div>
      </Rv>
      <Rv at={word(0, "antworten")} dy={0} style={{ position: "absolute", left: 1010, top: 310 }}>
        <div style={{ width: 800, height: 8, borderRadius: 4, background: C.green, marginBottom: 14 }} /><div style={{ fontSize: 56, fontWeight: 700, color: C.green }}>2  Antworten</div>
      </Rv>
      {stufen.map((s, i) => (
        <React.Fragment key={s.n}>
          <Rv at={s.at} s0={0.85} style={{ position: "absolute", left: X[i] - 125, top: Y - 125 }}><Badge name={s.i} size={250} color={i < 2 ? C.blue : C.green} /></Rv>
          <Txt at={s.at + 0.1} x={X[i] - 205} y={Y + 150} w={410} size={64} weight={700} align="center">{s.n}</Txt>
          <Txt at={s.at + 0.3} x={X[i] - 205} y={Y + 235} w={410} size={42} color={C.mute} align="center">{s.s}</Txt>
          {i > 0 && <Pfeil x1={X[i - 1] + 150} y1={Y} x2={X[i] - 150} y2={Y} p={sp(t, s.at - 0.2, 0.6)} color={C.mute} w={7} />}
        </React.Fragment>
      ))}
      {t > cue(0) + 1.8 && <div style={{ position: "absolute", left: px - 34, top: Y - 24, width: 68, height: 48, borderRadius: 10, background: erreicht >= 3 ? C.green : C.blue, boxShadow: "0 3px 14px #0009" }}><div style={{ position: "absolute", left: 8, top: 22, width: 52, height: 4, background: "#0007" }} /></div>}
      <Rv at={cue(2) + 1.4} dy={10} s0={0.9} style={{ position: "absolute", left: X[3] - 300, top: Y + 345 }}>
        <Pill color={C.green} size={40}><Icon name="file" size={48} color={C.green} />Quelle: Handbuch</Pill>
      </Rv>
    </Szene>
  );
};

// Mosaik aus Rauschen und Bild: ein grosses Bild, das Schritt für Schritt entrauscht
const GW = 44, GH = 28, CZ = 25;
const ziel = (x, y) => {
  const u = x / GW, v = y / GH;
  const sonne = Math.hypot(u - 0.72, (v - 0.3) * (GH / GW)) < 0.12;
  if (sonne) return "#ffd60a";
  const huegel = 0.68 + 0.08 * Math.sin(u * 7) - 0.15 * u;
  if (v > huegel) return v > huegel + 0.14 ? "#248a3d" : "#30d158";
  return `hsl(${208 + v * 20} 85% ${48 + v * 28}%)`;
};
const rausch = (n) => { const g = Math.floor(40 + rnd(n) * 190); return `rgb(${g}, ${Math.floor(40 + rnd(n + 3) * 190)}, ${Math.floor(40 + rnd(n + 7) * 190)})`; };
const Bilder = () => {
  const { t, cue, end } = useCues();
  const k = Math.max(0, Math.min(5, Math.floor(lin(t, cue(1) + 0.3, end(1) + 0.6, 0, 6))));
  const nl = 1 - k / 5;
  const zellen = Array.from({ length: GW * GH }).map((_, c) => (rnd(c * 1.7 + 5) >= nl ? ziel(c % GW, Math.floor(c / GW)) : rausch(c + k * 31)));
  const fertig = k === 5;
  return (
    <Szene titel="Bilder aus Rauschen" sub="Bildmodelle entrauschen in vielen kleinen Schritten" tiefe={["image", 1380, 650, 900]}>
      <Rv at={cue(0) + 0.3} s0={0.96} style={{ position: "absolute", left: 110, top: 300 }}>
        <svg width={GW * CZ} height={GH * CZ} style={{ display: "block", borderRadius: 24, border: `3px solid ${C.line}` }} shapeRendering="crispEdges">
          {zellen.map((c, i) => <rect key={i} x={(i % GW) * CZ} y={Math.floor(i / GW) * CZ} width={CZ} height={CZ} fill={c} />)}
        </svg>
      </Rv>
      <Txt at={cue(0) + 0.6} x={1270} y={330} w={560} size={64} weight={700} color={fertig ? C.green : k === 0 ? C.mute : C.blue}>{fertig ? "Bild" : k === 0 ? "Rauschen" : "weniger Rauschen"}</Txt>
      <Rv at={cue(1) + 0.2} dy={10} style={{ position: "absolute", left: 1270, top: 470, width: 560 }}>
        <div style={{ fontSize: 56, fontWeight: 600, marginBottom: 22 }}>Schritt {k + 1} von 6</div>
        <div style={{ display: "flex", gap: 14 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ width: 76, height: 28, borderRadius: 14, background: i <= k ? (fertig ? C.green : C.blue) : C.panel2 }} />)}
        </div>
      </Rv>
      <Txt at={cue(1) + 1.2} x={1270} y={640} w={540} size={44} color={C.mute}>Aus jedem Schritt entsteht ein klareres Bild.</Txt>
      <Txt at={cue(1) + 1.2} x={1270} y={900} w={540} size={38} color={C.mute}>Vereinfachte Darstellung</Txt>
    </Szene>
  );
};

export default { tokens: Tokens, naechstes: Naechstes, temperatur: Temperatur, kontext: Kontext, halluzination: Halluzination, rag: Rag, bilder: Bilder };
