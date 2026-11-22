import React from "react";
import { Szene, useCues, sp, ease, lerp, C } from "../lib.jsx";
import { Panel, Lbl } from "../bausteine.jsx";
import { Pf, Etikett, Zettel } from "../neu.jsx";
import { Kn, Kachel, Bg, Ic } from "../bausteine-betrieb.jsx";
import { Foto, Quelle, Gross } from "../bausteine-uc.jsx";

const VOLL = "handel-getraenkeregal.jpg", LUECK = "handel-regal-luecken.jpg";
const FL = (b) => b.k === "bottle";
const GAPS = [[420, 330, 200, 70], [40, 330, 340, 60], [700, 190, 250, 100]];

// ---------- 1 Der Abendgang: Notizzettel links, Regal rechts
const Abend = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tn = word(0, "notiert");
  return (
    <Szene titel="Der Abendgang" tiefe={["moon", 1500, 640, 800]}>
      <Kn x={420} y={275} w={520} h={90} t="am Abend" ic="moon" f={C.blue} size={44} a={o(0.4)} />
      <Zettel x={110} y={340} w={620} h={520} rot={-2} a={o(tn - 0.4)}>
        <div style={{ fontSize: 50, fontWeight: 800, marginBottom: 24 }}>Nachfüllen</div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 26, opacity: o(tn + i * 0.45) }}>
            <div style={{ width: 54, height: 54, border: "5px solid #1c1c1e", borderRadius: 10, flex: "none" }} />
            <div style={{ height: 22, borderRadius: 11, background: "#c9bb8a", width: [380, 300, 340, 230][i] }} />
          </div>
        ))}
      </Zettel>
      <Foto name={VOLL} x={880} y={215} w={950} h={713} a={o(0.3)} />
      <Quelle x={900} y={865} a={o(0.6)} />
      <Kn x={420} y={925} w={660} h={90} t="die Lücke fällt spät auf" ic="clock" f={C.orange} size={38} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 2 Flaschen zählen, Zähler läuft hoch
const Zaehlen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t0 = word(0, "findet die");
  const n = Math.min(42, Math.max(0, (t - t0) * 11));
  return (
    <Szene titel="Flaschen zählen" tiefe={["store", 1500, 640, 800]}>
      <Foto name={VOLL} x={90} y={215} w={950} h={713} n={n} sel={FL} labels={false} bw={3} />
      <Gross x={1100} y={215} w={730} h={400} wert={String(Math.floor(n))} label="Flaschen" f={C.blue} size={190} a={o(0.4)} />
      <Kn x={1465} y={730} w={730} h={110} t="Beispielwert, je nach Bild 38 bis 42" ic="info" f={C.mute} size={32} a={o(t0 + 3.5)} />
      <Kn x={1465} y={870} w={730} h={110} t="kennt Flaschen, Tassen, Alltagsdinge" ic="eye" f={C.green} size={34} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 3 Die Lücke: leere Plätze sind keine Objekte
const Luecke = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tl = word(0, "leerer Platz");
  const n = Math.min(18, Math.max(0, (t - cue(1) - 0.3) * 6));
  return (
    <Szene titel="Die Lücke" tiefe={["help", 1500, 640, 800]}>
      <Foto name={LUECK} x={930} y={215} w={900} h={675} n={n} sel={FL} labels={false} bw={3}>
        {({ m, s }) => GAPS.map(([x, y, w, h], i) => { const [px, py] = m(x, y); return (
          <div key={i} style={{ position: "absolute", left: px, top: py, width: w * s, height: h * s, border: `5px dashed ${C.orange}`, borderRadius: 10, boxSizing: "border-box", opacity: ease(t, tl + i * 0.35, tl + i * 0.35 + 0.5), background: C.orange + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60, fontWeight: 800, color: C.orange, textShadow: "0 0 10px #000" }}>?</div>
        ); })}
      </Foto>
      <Kachel x={90} y={215} w={780} h={330} ic="help" t="Ein leerer Platz ist kein Gegenstand" f={C.orange} a={o(tl - 0.3)} ics={110} size={48} />
      <Gross x={90} y={590} w={780} h={300} wert={String(Math.floor(n))} label="Flaschen gefunden, keine Artikel" f={C.blue} size={150} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 4 Fehlmeldung: Regal als Kühlschrank
const Fehl = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tf = word(0, "Kühlschrank");
  return (
    <Szene titel="Fehlmeldungen" tiefe={["alert", 1500, 640, 800]}>
      <Foto name={LUECK} x={90} y={215} w={950} h={713} n={99} sel={(b) => b.k === "bottle" || ((b.k === "refrigerator") && t > tf - 0.5)} labels={false} bw={(b) => (b.k === "refrigerator" ? 8 : 3)} farbe={(b) => (b.k === "refrigerator" ? C.red : C.blue)} />
      <div style={{ position: "absolute", left: 120, top: 235, opacity: ease(t, tf - 0.5, tf), fontSize: 36, fontWeight: 800, color: "#fff", background: C.red, borderRadius: 8, padding: "2px 14px" }}>Kühlschrank 64 %</div>
      <Kachel x={1100} y={215} w={730} h={330} ic="alert" t="Fehlmeldung" sub="das Regal ist kein Kühlschrank" f={C.red} a={o(tf - 0.4)} ics={110} size={56} />
      <Kn x={1465} y={680} w={730} h={120} t="Klasse ausblenden" ic="ban" f={C.orange} size={46} a={o(cue(1))} />
      <Kn x={1465} y={830} w={730} h={120} t="weiter beobachten" ic="eye" f={C.green} size={46} a={o(cue(1) + 1.0)} />
    </Szene>
  );
};

// ---------- 5 Das Soll: Ist plus Soll ergibt Hinweis
const Soll = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ts = word(0, "Soll");
  return (
    <Szene titel="Das Soll" tiefe={["clip", 1500, 640, 800]}>
      <Kachel x={110} y={260} w={520} h={420} ic="camera" t="Ist" sub="Kamera zählt, z. B. 18" f={C.blue} a={o(0.4)} ics={120} size={64} />
      <div style={{ position: "absolute", left: 650, top: 420, opacity: o(ts - 0.2), fontSize: 110, fontWeight: 800, color: C.mute }}>+</div>
      <div style={{ position: "absolute", left: 770, top: 260, width: 520, height: 420, border: `4px dashed ${C.orange}`, borderRadius: 24, boxSizing: "border-box", opacity: o(ts), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <Ic name="edit" size={120} color={C.orange} />
        <div style={{ fontSize: 64, fontWeight: 700 }}>Soll</div>
        <div style={{ fontSize: 36, color: C.mute, fontWeight: 500 }}>kommt von dir</div>
      </div>
      <Pf x1={1310} y1={470} x2={1390} y2={470} p={ease(t, ts + 1.0, ts + 1.4)} f={C.mute} w={8} />
      <Kachel x={1400} y={260} w={430} h={420} ic="bell" t="Hinweis" sub="nachfüllen" f={C.green} a={o(ts + 1.2)} ics={120} size={60} />
      <Kn x={960} y={850} w={1500} h={120} t="Eigene Artikel: Anlernen oder eigenes Modell" ic="tag" f={C.blue} size={50} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 6 Wohin die Kamera schaut: Draufsicht
const Kamera = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tg = word(0, "nicht auf die Gänge");
  return (
    <Szene titel="Wohin die Kamera schaut" tiefe={["camera", 1500, 640, 800]}>
      <Panel x={90} y={215} w={1740} h={600} a={o(0.3)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <rect x={300} y={270} width={1320} height={90} rx={14} fill={C.panel2} stroke={C.blue} strokeWidth="4" opacity={o(0.4)} />
        {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={325 + i * 59} y={290} width={34} height={50} rx={8} fill={C.blue + "88"} opacity={o(0.5)} />)}
        <polygon points="960,640 340,375 1580,375" fill={C.blue + "22"} stroke={C.blue} strokeWidth="4" strokeDasharray="14 12" opacity={o(0.8)} />
        <rect x={110} y={420} width={170} height={360} rx={18} fill="none" stroke={C.line} strokeWidth="4" strokeDasharray="10 10" opacity={o(tg)} />
        <rect x={1640} y={420} width={170} height={360} rx={18} fill="none" stroke={C.line} strokeWidth="4" strokeDasharray="10 10" opacity={o(tg)} />
      </svg>
      <Lbl x={300} y={225} w={1320} t="Regal" size={36} color={C.blue} align="center" a={o(0.5)} />
      <div style={{ position: "absolute", left: 960 - 55, top: 640, opacity: o(0.8) }}><Bg name="camera" size={110} color={C.blue} /></div>
      {[[195, 520], [195, 680], [1725, 520], [1725, 680]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 40, top: y - 40, opacity: o(tg + i * 0.2) }}><Bg name="user" size={80} color={C.mute} /></div>)}
      <Lbl x={110} y={430} w={170} t="Gang" size={30} color={C.mute} align="center" a={o(tg)} />
      <Lbl x={1640} y={430} w={170} t="Gang" size={30} color={C.mute} align="center" a={o(tg)} />
      <Lbl x={640} y={720} w={640} t="Blickfeld nur aufs Regal" size={36} color={C.blue} align="center" a={o(0.9)} />
      <Kn x={520} y={925} w={780} h={100} t="nichts speichern, was du nicht brauchst" ic="lock" f={C.green} size={34} a={o(word(0, "speichere"))} />
      <Kn x={1440} y={925} w={780} h={100} t="Beispiel mit drei freien Fotos" ic="image" f={C.blue} size={38} a={o(cue(1))} />
    </Szene>
  );
};

export default { abend: Abend, zaehlen: Zaehlen, luecke: Luecke, fehlmeldung: Fehl, soll: Soll, kamera: Kamera };
