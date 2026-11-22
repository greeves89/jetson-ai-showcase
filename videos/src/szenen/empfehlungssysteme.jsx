import React from "react";
import { Szene, useCues, sp, ease, lerp, rnd, C } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Pf, Etikett, Mark, Zeile } from "../neu.jsx";
import { Kn, Fl, Pt, Ic, Bg, Kachel, RY } from "../bausteine-betrieb.jsx";

const PX = 270, TX = 640;
const PERS = { anna: [PX, 350, "Anna"], ben: [PX, 520, "Ben"], cem: [PX, 690, "Cem"], neu: [PX, 860, "Neu"] };
const TEIL = { a: [TX, 350, "A"], b: [TX, 520, "B"], c: [TX, 690, "C"], d: [TX, 860, "D"] };
const E = [["anna", "a"], ["anna", "b"], ["anna", "c"], ["ben", "a"], ["ben", "b"], ["ben", "d"], ["cem", "c"]];
const FARB = { anna: C.blue, ben: C.green };
const RX2 = 900;

// Anker links: Personen und Teile als Netz
const Netz = ({ ep = 1, hl = {}, rec = 0, emb = 0, pop = 0, neu = 0, ring = 0, label = "Wer hat was bestellt?", vis = 1 }) => (
  <>
    <Panel x={90} y={215} w={760} h={760} r={28} />
    <Lbl x={90} y={236} w={760} t={label} size={40} align="center" color={C.mute} />
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", opacity: vis }}>
      {E.map(([p, q], i) => {
        const [x1, y1] = PERS[p], [x2, y2] = TEIL[q]; const f = hl[p] ?? C.line; const on = !!hl[p];
        const pr = Math.min(1, Math.max(0, ep * 7 - i));
        return <line key={i} x1={x1 + 50} y1={y1} x2={lerp(x1 + 50, x2 - 50, pr)} y2={lerp(y1, y2, pr)} stroke={f} strokeWidth={on ? 9 : 5} strokeLinecap="round" opacity={1 - emb * 0.6} />;
      })}
      {rec > 0 && <line x1={PERS.anna[0] + 50} y1={PERS.anna[1]} x2={lerp(PERS.anna[0] + 50, TEIL.d[0] - 50, rec)} y2={lerp(PERS.anna[1], TEIL.d[1], rec)} stroke={C.orange} strokeWidth="10" strokeDasharray="16 14" strokeLinecap="round" />}
    </svg>
    <div style={{ opacity: vis }}>
      {Object.entries(PERS).map(([k, [x, y, n]]) => (
        <div key={k} style={{ opacity: k === "neu" ? neu : 1 }}>
          <div style={{ position: "absolute", left: x - 50, top: y - 50, width: 100, height: 100, borderRadius: 50, background: C.panel2, border: `4px solid ${hl[k] ?? (k === "neu" ? C.orange : C.line)}`, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}><Ic name="user" size={52} color={hl[k] ?? C.text} /></div>
          <div style={{ position: "absolute", left: x - 140, top: y - 18, width: 80, textAlign: "right", fontSize: 34, fontWeight: 700 }}></div>
          <Lbl x={x - 100} y={y + 56} w={200} t={n} size={36} align="center" color={C.mute} />
          {emb > 0 && <Bars x={x - 150} y={y - 20} f={hl[k] ?? C.blue} a={emb} seed={k.length * 3 + n.charCodeAt(0)} />}
        </div>
      ))}
      {Object.entries(TEIL).map(([k, [x, y, n]]) => {
        const big = k === "a" ? 1 + pop * 0.5 : 1 - pop * 0.12;
        return (
          <div key={k}>
            <div style={{ position: "absolute", left: x - 50 * big, top: y - 50 * big, width: 100 * big, height: 100 * big, borderRadius: 18 * big, background: C.panel2, border: `4px solid ${k === "d" && ring ? C.orange : C.line}`, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", boxShadow: k === "d" && ring ? `0 0 ${50 * ring}px ${C.orange}88` : "none" }}><Ic name="package" size={52 * big} color={k === "d" && ring ? C.orange : C.text} /></div>
            <Lbl x={x + 62 * big} y={y - 20} w={150} t={"Teil " + n} size={34} color={C.mute} />
            {emb > 0 && <Bars x={x + 62 * big} y={y + 18} f={C.orange} a={emb} seed={n.charCodeAt(0)} />}
          </div>
        );
      })}
    </div>
  </>
);
const Bars = ({ x, y, f, a, seed }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: a }}>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: i * 20, top: 40 - (10 + rnd(seed + i * 1.9) * 40), width: 14, height: 10 + rnd(seed + i * 1.9) * 40, borderRadius: 4, background: f }} />)}
  </div>
);

// ---------- 1 Buchhändlerin
const Buch = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t1 = word(1, "was du"), t2 = word(1, "was Menschen");
  const hl = {}; if (t > t1) hl.anna = C.blue; if (t > t2) hl.ben = C.green;
  return (
    <Szene titel="Die Buchhändlerin, die dich kennt" tiefe={["book", 1500, 640, 800]} anker={<Netz ep={ease(t, 0.3, 1.8)} hl={hl} />}>
      <div style={{ position: "absolute", left: RX2, top: RY + 10, opacity: o(0.5) }}><Bg name="book" size={220} color={C.orange} /></div>
      <Lbl x={RX2 + 260} y={RY + 60} w={640} t="kennt dich" size={80} weight={800} a={o(0.8)} />
      <Lbl x={RX2 + 260} y={RY + 160} w={640} t="zwei Quellen" size={50} color={C.mute} weight={600} a={o(cue(1))} />
      <Kn x={RX2 + 465} y={RY + 440} w={930} h={150} t="Was du magst" ic="heart" f={C.blue} size={56} a={o(t1 - 0.3)} />
      <Kn x={RX2 + 465} y={RY + 640} w={930} h={150} t="Was Ähnliche mögen" ic="users" f={C.green} size={56} a={o(t2 - 0.3)} />
    </Szene>
  );
};

// ---------- 2 Ähnlichkeit
const TAB = { anna: ["a", "b", "c"], ben: ["a", "b", "d"], cem: ["c"] };
const Aehnlich = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tl = cue(2), tg = word(3, "zwei Teile"), tn = word(3, "Nachbar"), tr = word(3, "Darum");
  const hl = { anna: C.blue, ben: C.green };
  const CXs = (i) => RX2 + 220 + i * 175;
  return (
    <Szene titel="Ähnlichkeit als Rechnung" tiefe={["users", 1500, 640, 800]} anker={<Netz hl={hl} rec={ease(t, tr, tr + 1.2)} ring={ease(t, tr, tr + 1)} />}>
      <Panel x={RX2} y={RY} w={930} h={540} a={o(0.3)} />
      {["a", "b", "c", "d"].map((k, i) => <Lbl key={k} x={CXs(i)} y={RY + 24} w={150} t={"Teil " + k.toUpperCase()} size={36} align="center" color={C.mute} a={o(0.5)} />)}
      {Object.entries(TAB).map(([p, teile], r) => (
        <React.Fragment key={p}>
          <Lbl x={RX2 + 30} y={RY + 160 + r * 135} w={180} t={PERS[p][2]} size={44} color={hl[p] ?? C.text} a={o(0.4 + r * 0.3)} />
          {["a", "b", "c", "d"].map((k, i) => {
            const has = teile.includes(k), gem = (p === "anna" || p === "ben") && (k === "a" || k === "b"), rec = p === "anna" && k === "d";
            const mark = (gem && t > tg) ? C.green : (rec && t > tr) ? C.orange : has ? (hl[p] ?? C.blue) : C.line;
            return <div key={k} style={{ position: "absolute", left: CXs(i), top: RY + 120 + r * 135, width: 150, height: 112, borderRadius: 20, background: has ? mark + "33" : rec && t > tr ? C.orange + "22" : C.panel2, border: `${(gem && t > tg) || (rec && t > tr) ? 6 : 3}px ${rec && t > tr ? "dashed" : "solid"} ${mark}`, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", opacity: o(0.7 + r * 0.3 + i * 0.1) * (!has && !rec && t > tl && t < tg ? 0.5 : 1) }}>{has && <Ic name="check" size={64} color={mark} sw={2.6} />}{rec && t > tr && !has && <Ic name="star" size={60} color={C.orange} />}</div>;
          })}
        </React.Fragment>
      ))}
      <Etikett x={RX2} y={RY + 580} t="Zellen meist leer" f={C.mute} size={42} a={o(tl)} />
      <Etikett x={RX2 + 440} y={RY + 580} t="Ben = Annas Nachbar" f={C.green} size={42} a={o(tn)} />
      <Etikett x={RX2 + 100} y={RY + 670} t="Empfehlung: Teil D für Anna" f={C.orange} size={46} a={o(tr)} />
    </Szene>
  );
};

// ---------- 3 Zahlenlisten
const Zahlenlisten = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ts = word(1, "kurze"), tv = word(1, "Vorlieben");
  const bars = (x, y, f, seed, a) => <div style={{ position: "absolute", left: x, top: y, opacity: a }}>{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ position: "absolute", left: i * 50, top: 160 - (30 + rnd(seed + i * 2.1) * 130), width: 36, height: 30 + rnd(seed + i * 2.1) * 130, borderRadius: 6, background: f }} />)}</div>;
  return (
    <Szene titel="Versteckte Vorlieben" tiefe={["network", 1500, 640, 800]} anker={<Netz emb={ease(t, ts, ts + 1.2)} ep={1} hl={{ anna: C.blue, ben: C.green }} />}>
      <Panel x={RX2} y={RY + 10} w={430} h={400} rand={C.blue} a={o(0.5)} />
      <div style={{ position: "absolute", left: RX2 + 30, top: RY + 35, opacity: o(0.5) }}><Ic name="user" size={80} color={C.blue} /></div>
      <Lbl x={RX2 + 130} y={RY + 50} w={280} t="Nutzer" size={54} color={C.blue} a={o(0.5)} />
      {bars(RX2 + 60, RY + 200, C.blue, 3, o(ts))}
      <Panel x={RX2 + 500} y={RY + 10} w={430} h={400} rand={C.orange} a={o(0.7)} />
      <div style={{ position: "absolute", left: RX2 + 530, top: RY + 35, opacity: o(0.7) }}><Ic name="package" size={80} color={C.orange} /></div>
      <Lbl x={RX2 + 630} y={RY + 50} w={280} t="Produkt" size={54} color={C.orange} a={o(0.7)} />
      {bars(RX2 + 560, RY + 200, C.orange, 9, o(ts + 0.4))}
      <Lbl x={RX2} y={RY + 440} w={930} t="eine kurze Zahlenliste" size={56} weight={800} align="center" a={o(ts)} />
      {[["zap", "Mag Spannung"], ["cpu", "Mag Technik"], ["tag", "Kauft günstig"]].map(([ic, n], i) => <Kn key={n} x={RX2 + 155 + i * 310} y={RY + 640} w={295} h={150} t={n} ic={ic} f={C.green} size={30} a={o(tv + i * 0.35)} />)}
    </Szene>
  );
};

// ---------- 4 Kaltstart
const Kalt = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const S = [["help", "Erst fragen", C.blue, word(1, "Erst")], ["star", "Beliebtes zeigen", C.orange, word(1, "dann Beliebtes")], ["userCheck", "Persönlicher werden", C.green, word(1, "persönlicher")]];
  return (
    <Szene titel="Der Kaltstart" tiefe={["clock", 1500, 640, 800]} anker={<Netz neu={ease(t, 0.3, 1)} hl={{ anna: C.blue, ben: C.green }} />}>
      <Lbl x={RX2} y={RY + 10} w={930} t="Neu: noch kein Verhalten" size={52} weight={800} color={C.orange} a={o(0.4)} />
      <Lbl x={RX2} y={RY + 90} w={930} t="nichts zu vergleichen" size={44} color={C.mute} weight={600} a={o(cue(0) + 1.5)} />
      {S.map(([ic, n, f, ts], i) => (
        <React.Fragment key={n}>
          <Kn x={RX2 + 465} y={RY + 260 + i * 190} w={930} h={140} t={n} ic={ic} f={f} size={52} a={o(ts - 0.3)} />
          {i < 2 && <Pf x1={RX2 + 465} y1={RY + 335 + i * 190} x2={RX2 + 465} y2={RY + 380 + i * 190} p={ease(t, S[i + 1][3] - 0.6, S[i + 1][3] - 0.3)} f={C.mute} w={6} />}
        </React.Fragment>
      ))}
    </Szene>
  );
};

// ---------- 5 Blase
const Blase = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const pop = ease(t, cue(0) + 1, cue(1) + 2.5);
  return (
    <Szene titel="Filterblase" tiefe={["repeat", 1500, 640, 800]} anker={<Netz pop={pop} hl={{ anna: C.blue, ben: C.green }} />}>
      <Kn x={RX2 + 200} y={RY + 100} w={380} h={140} t="empfohlen" ic="bell" f={C.blue} size={50} a={o(0.5)} />
      <Kn x={RX2 + 730} y={RY + 100} w={380} h={140} t="gekauft" ic="cart" f={C.green} size={50} a={o(word(0, "öfter gekauft"))} />
      <Pf x1={RX2 + 395} y1={RY + 70} x2={RX2 + 535} y2={RY + 70} p={ease(t, word(0, "öfter gekauft"), word(0, "öfter gekauft") + 0.5)} f={C.mute} w={7} />
      <Pf x1={RX2 + 535} y1={RY + 135} x2={RX2 + 395} y2={RY + 135} p={ease(t, word(0, "noch öfter"), word(0, "noch öfter") + 0.5)} f={C.orange} w={7} />
      <Lbl x={RX2} y={RY + 250} w={930} t="immer wieder" size={44} color={C.orange} align="center" a={o(word(0, "noch öfter"))} />
      <Lbl x={RX2} y={RY + 360} w={500} t="Beliebtes" size={50} weight={700} a={o(cue(1) - 0.2)} />
      <div style={{ position: "absolute", left: RX2, top: RY + 430, width: 930, height: 70, borderRadius: 35, background: C.panel2, opacity: o(cue(1) - 0.2) }} />
      <div style={{ position: "absolute", left: RX2, top: RY + 430, width: 930 * lerp(0.35, 0.95, pop), height: 70, borderRadius: 35, background: C.orange }} />
      <Lbl x={RX2} y={RY + 540} w={500} t="Nische" size={50} weight={700} a={o(cue(1) - 0.2)} />
      <div style={{ position: "absolute", left: RX2, top: RY + 610, width: 930, height: 70, borderRadius: 35, background: C.panel2, opacity: o(cue(1) - 0.2) }} />
      <div style={{ position: "absolute", left: RX2, top: RY + 610, width: 930 * lerp(0.35, 0.08, pop), height: 70, borderRadius: 35, background: C.blue }} />
    </Szene>
  );
};

// ---------- 6 Messen
const Messen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tz = word(0, "Zähle"), td = cue(1);
  return (
    <Szene titel="Messen, ob es etwas bringt" tiefe={["target", 1500, 640, 800]} anker={<Netz hl={{ anna: C.blue, ben: C.green }} rec={1} ring={1} />}>
      <Kn x={RX2 + 230} y={RY + 75} w={460} h={120} t="Ein Klick" ic="pointer" f={C.mute} size={48} a={o(0.4)} />
      <Mark x={RX2 + 480} y={RY + 25} ok={false} size={100} a={o(word(0, "noch kein"))} />
      {[["cart", "Käufe ohne Rückgabe"], ["search", "Gefundene Antworten"], ["clock", "Kürzere Suche"]].map(([ic, n], i) => <Kachel key={n} x={RX2 + i * 315} y={RY + 190} w={300} h={260} ic={ic} t={n} f={C.green} a={o(tz + i * 0.7)} ics={84} size={36} />)}
      <Kn x={RX2 + 465} y={RY + 620} w={930} h={150} t="Verhaltensdaten sind personenbezogen" sub="Sammle nur, was du brauchst" ic="lock" f={C.orange} size={44} a={o(td)} />
    </Szene>
  );
};

export default { buchhaendlerin: Buch, aehnlich: Aehnlich, zahlenlisten: Zahlenlisten, kaltstart: Kalt, blase: Blase, messen: Messen };
