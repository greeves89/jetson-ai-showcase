import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, Pill, Pfeil, Pfad, C, rnd, spitze } from "../lib.jsx";

const Einstieg = () => {
  const { t, cue, word } = useCues();
  const X = [860, 1240, 1620];
  const knoten = [["eye", "Wahrnehmen", word(1, "wahrnehmen")], ["fork", "Entscheiden", word(1, "entscheiden")], ["pointer", "Handeln", word(1, "handeln")]];
  const lauf = ease(t, word(1, "immer"), word(1, "immer") + 1.4);
  const dot = lauf > 0.02 && lauf < 0.98 ? lauf : -1;
  return (
    <Szene titel="Roboter" sub="KI mit Körper, die in die Welt eingreift" tiefe={["bot", 1360, 650, 900]}>
      <Rv at={cue(0) + 0.2} s0={0.8} style={{ position: "absolute", left: 110, top: 360 }}>
        <div style={{ textAlign: "center", width: 440 }}><Badge name="bot" size={400} /><div style={{ fontSize: 68, fontWeight: 700, marginTop: 24 }}>KI + Körper</div></div>
      </Rv>
      {knoten.map(([ic, n, at], i) => (
        <React.Fragment key={n}>
          <Rv at={at} s0={0.85} style={{ position: "absolute", left: X[i] - 115, top: 430 }}><Badge name={ic} size={230} color={i === 1 ? C.green : C.blue} /></Rv>
          <Txt at={at + 0.1} x={X[i] - 180} y={680} w={360} size={58} weight={700} align="center">{n}</Txt>
          {i > 0 && <Pfeil x1={X[i - 1] + 125} y1={545} x2={X[i] - 125} y2={545} p={sp(t, at - 0.1, 0.5)} color={C.mute} w={7} />}
        </React.Fragment>
      ))}
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <Pfad d="M1620 780 C 1620 960, 860 960, 860 800" p={lauf} color={C.blue} w={8} head={spitze(860, 960, 860, 800, 26)} />
        {dot > 0 && <circle cx={lerp(1620, 860, dot)} cy={850 + 100 * Math.sin(dot * Math.PI)} r={18} fill={C.text} />}
      </svg>
      <Txt at={word(1, "immer")} x={860} y={950} w={760} size={52} weight={600} color={C.blue} align="center">immer wieder</Txt>
    </Szene>
  );
};

const Regelkreis = () => {
  const { t, cue } = useCues();
  const K = { s: [670, 450], p: [1250, 450], a: [1250, 830], w: [670, 830] };
  const R = 115;
  const knoten = [
    { id: "s", n: "Sensoren", i: "camera", sub: "messen die Welt", ex: "sieht das Teil", at: cue(1), links: true },
    { id: "p", n: "Planung (KI)", i: "cpu", sub: "entscheidet", ex: "plant den Griff", at: cue(2), links: false },
    { id: "a", n: "Aktoren", i: "zap", sub: "führen aus", ex: "schließt die Finger", at: cue(3), links: false },
    { id: "w", n: "Welt", i: "box", sub: "ändert sich", ex: "Teil ist gegriffen", at: cue(4) - 0.3, links: true },
  ];
  const beispiel = sp(t, cue(5) + 0.4, 0.8);
  const pfad = [K.s, K.p, K.a, K.w, K.s];
  const lauf = (Math.max(0, t - (cue(4) + 1.6)) / 4) % 1;
  const seg = Math.floor(lauf * 4), fr = lauf * 4 - seg;
  const dot = [lerp(pfad[seg][0], pfad[seg + 1][0], fr), lerp(pfad[seg][1], pfad[seg + 1][1], fr)];
  return (
    <Szene titel="Der Regelkreis" sub="Wahrnehmen, entscheiden, handeln" tiefe={["repeat", 1380, 660, 900]}>
      <Pfeil x1={K.s[0] + 135} y1={K.s[1]} x2={K.p[0] - 135} y2={K.p[1]} p={sp(t, cue(2) - 0.4, 0.8)} color={C.blue} w={7} />
      <Pfeil x1={K.p[0]} y1={K.p[1] + 135} x2={K.a[0]} y2={K.a[1] - 135} p={sp(t, cue(3) - 0.4, 0.8)} color={C.blue} w={7} />
      <Pfeil x1={K.a[0] - 135} y1={K.a[1]} x2={K.w[0] + 135} y2={K.w[1]} p={sp(t, cue(4) - 0.9, 0.8)} color={C.blue} w={7} />
      <Pfeil x1={K.w[0]} y1={K.w[1] - 135} x2={K.s[0]} y2={K.s[1] + 135} p={sp(t, cue(4) + 0.4, 0.8)} color={C.green} w={7} />
      {knoten.map((k) => {
        const [x, y] = K[k.id];
        const lx = k.links ? 96 : x + 145, al = k.links ? "right" : "left";
        const w = k.links ? x - 96 - 145 : 1824 - (x + 145);
        return (
          <React.Fragment key={k.id}>
            <Rv at={k.at} s0={0.85} style={{ position: "absolute", left: x - R, top: y - R }}><Badge name={k.i} size={R * 2} color={k.id === "w" ? C.green : C.blue} /></Rv>
            <Txt at={k.at + 0.1} x={lx} y={y - 72} w={w} size={58} weight={700} align={al}>{k.n}</Txt>
            <div style={{ position: "absolute", left: lx, top: y + 2, width: w, textAlign: al, fontSize: 46, color: C.mute, opacity: sp(t, k.at + 0.3, 0.6) * (1 - beispiel) }}>{k.sub}</div>
            <div style={{ position: "absolute", left: lx, top: y + 2, width: w, textAlign: al, fontSize: 46, color: C.orange, fontWeight: 600, opacity: beispiel }}>{k.ex}</div>
          </React.Fragment>
        );
      })}
      {t > cue(4) + 1.6 && <div style={{ position: "absolute", left: dot[0] - 18, top: dot[1] - 18, width: 36, height: 36, borderRadius: 18, background: C.text }} />}
      <Rv at={cue(5) + 0.2} dy={0} style={{ position: "absolute", left: 620, top: 600 }}>
        <div style={{ fontSize: 50, color: C.orange, fontWeight: 700, width: 680, textAlign: "center" }}>Beispiel: Greifarm</div>
      </Rv>
    </Szene>
  );
};

const Jetson = () => {
  const { t, cue } = useCues();
  const rahmen = sp(t, cue(2), 1.0);
  return (
    <Szene titel="Der Jetson als Gehirn" sub="Ein kleiner Rechner direkt am Roboter" tiefe={["cpu", 1400, 650, 900]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <rect x={96} y={300} width={1728} height={660} rx={44} fill="none" stroke={C.green} strokeWidth={5} strokeDasharray="16 14" opacity={rahmen} />
        <rect x={520} y={350} width={880} height={500} rx={34} fill={C.panel} stroke={C.blue} strokeWidth={5} opacity={sp(t, cue(0) + 0.2, 0.9)} />
        {Array.from({ length: 8 }).map((_, k) => <path key={k} d={`M${600 + k * 100} 350 v-30 M${600 + k * 100} 850 v30`} stroke={C.line} strokeWidth={8} strokeLinecap="round" opacity={sp(t, cue(0) + 0.5, 0.9)} />)}
        <rect x={810} y={440} width={300} height={300} rx={30} fill={C.blue + "26"} stroke={C.blue} strokeWidth={5} opacity={sp(t, cue(0) + 0.6, 0.9)} />
        <text x={960} y={620} textAnchor="middle" fontSize={84} fontWeight={800} fill={C.text} opacity={sp(t, cue(0) + 0.8, 0.8)} fontFamily="inherit">GPU</text>
        <Pfad d="M345 600 L505 600" p={sp(t, cue(0) + 1.0, 0.7)} color={C.mute} w={7} head={spitze(345, 600, 505, 600, 22)} />
        <Pfad d="M1415 600 L1575 600" p={sp(t, cue(0) + 1.3, 0.7)} color={C.mute} w={7} head={spitze(1415, 600, 1575, 600, 22)} />
      </svg>
      <Rv at={cue(0) + 0.4} style={{ position: "absolute", left: 100, top: 480 }}><div style={{ textAlign: "center", width: 240 }}><Badge name="camera" size={200} color={C.mute} /><div style={{ fontSize: 46, marginTop: 14, fontWeight: 600 }}>Sensoren</div></div></Rv>
      <Rv at={cue(0) + 0.9} style={{ position: "absolute", left: 1580, top: 480 }}><div style={{ textAlign: "center", width: 240 }}><Badge name="zap" size={200} color={C.mute} /><div style={{ fontSize: 46, marginTop: 14, fontWeight: 600 }}>Motoren</div></div></Rv>
      <Txt at={cue(0) + 0.8} x={520} y={868} w={440} size={56} weight={700} align="left">Jetson</Txt>
      <Txt at={cue(1) + 0.1} x={540} y={745} w={840} size={46} color={C.blue} weight={600} align="center">Grafikkarte für KI</Txt>
      <Rv at={cue(1) + 1.6} dy={0} style={{ position: "absolute", left: 1000, top: 868 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 48, fontWeight: 600, color: C.green }}><Icon name="zap" size={54} color={C.green} />wenig Strom</div>
      </Rv>
      <Txt at={cue(2) + 0.2} x={130} y={330} w={370} size={46} weight={700} color={C.green}>Alles läuft am Gerät</Txt>
    </Szene>
  );
};

const Paket = ({ x, y, farbe }) => (
  <div style={{ position: "absolute", left: x - 34, top: y - 24, width: 68, height: 48, borderRadius: 11, background: farbe, boxShadow: "0 3px 14px #0009" }}>
    <div style={{ position: "absolute", left: 8, top: 22, width: 52, height: 4, background: "#0007" }} />
  </div>
);
const Wartezeit = ({ x, y, w, p, farbe, aus }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 48, fontWeight: 600, color: C.mute, marginBottom: 14 }}><Icon name="clock" size={58} color={C.mute} />Wartezeit</div>
    <div style={{ height: 44, borderRadius: 22, background: C.panel2 }}><div style={{ width: Math.max(14, w * p), height: 44, borderRadius: 22, background: aus ? C.red : farbe }} /></div>
  </div>
);
const Lokal = () => {
  const { t, cue } = useCues();
  const aus = sp(t, cue(2) + 1.8, 0.6);
  const aus0 = aus > 0.5;
  const t1 = Math.max(0, t - cue(1) - 0.2);
  const l = aus0 ? 0.26 : (t1 / 5.0) % 1;
  const hin = l < 0.5;
  const phase2 = t > cue(2) - 0.2;
  // Paketweg: erst Internet-Strecke, dann läuft es zum Roboter und senkrecht in die lokale Strecke
  let px, py, pf = C.orange;
  if (!phase2) { px = hin ? lerp(350, 1440, l * 2) : lerp(1440, 350, (l - 0.5) * 2); py = hin ? 410 : 470; if (aus0) pf = C.red; }
  else {
    const u = ease(t, cue(2) - 0.2, cue(2) + 0.8);
    if (u < 1) { px = 210; py = lerp(450, 860, u); pf = C.orange; }
    else {
      const k = ((t - cue(2) - 0.8) / 0.8) % 1, kh = k < 0.5;
      px = kh ? lerp(350, 540, k * 2) : lerp(540, 350, (k - 0.5) * 2); py = kh ? 830 : 890; pf = C.green;
    }
  }
  return (
    <Szene titel="Warum lokal?" sub="Die Antwort muss sofort da sein" tiefe={["clock", 1400, 650, 900]}>
      <Txt at={cue(0) + 0.3} x={110} y={270} w={900} size={52} weight={700} color={C.orange}>Über das Internet</Txt>
      <Rv at={cue(1)} style={{ position: "absolute", left: 110, top: 340 }}><Badge name="bot" size={200} color={C.mute} /></Rv>
      <Rv at={cue(1) + 0.2} style={{ position: "absolute", left: 1480, top: 310 }}><Badge name="cloud" size={260} color={aus0 ? C.mute : C.orange} /></Rv>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <Pfad d="M330 410 L1460 410" p={sp(t, cue(1), 0.8)} color={C.line} w={7} dash="0.01 0.012" />
        <Pfad d="M1460 470 L330 470" p={sp(t, cue(1), 0.8)} color={C.line} w={7} dash="0.01 0.012" />
        <g opacity={aus}><Pfad d="M780 370 L980 510 M980 370 L780 510" color={C.red} w={14} p={1} /></g>
        <Pfad d="M210 560 L210 770" p={sp(t, cue(2) - 0.2, 0.8)} color={C.line} w={6} dash="0.01 0.014" />
      </svg>
      {(t > cue(1) + 0.2) && <Paket x={px} y={py} farbe={pf} />}
      <Wartezeit x={330} y={540} w={920} p={aus0 ? 0.5 : (hin ? l * 2 : 1)} farbe={C.orange} aus={aus0} />
      <Txt at={cue(1) + 0.8} x={1290} y={570} w={520} size={44} color={C.mute}>weiter Weg für jede Antwort</Txt>
      <Txt at={cue(2) - 0.2} x={110} y={690} w={900} size={52} weight={700} color={C.green}>Lokal am Gerät</Txt>
      <Rv at={cue(2)} style={{ position: "absolute", left: 110, top: 760 }}><Badge name="bot" size={200} color={C.mute} /></Rv>
      <Rv at={cue(2) + 0.2} style={{ position: "absolute", left: 560, top: 760 }}><Badge name="cpu" size={200} color={C.green} /></Rv>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <Pfad d="M330 830 L540 830" p={sp(t, cue(2), 0.8)} color={C.line} w={7} dash="0.02 0.03" />
        <Pfad d="M540 890 L330 890" p={sp(t, cue(2), 0.8)} color={C.line} w={7} dash="0.02 0.03" />
      </svg>
      <Wartezeit x={900} y={740} w={560} p={0.1} farbe={C.green} />
      <Rv at={cue(2) + 0.6} dx={20} dy={0} style={{ position: "absolute", left: 900, top: 880 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 46, fontWeight: 600, color: C.green }}><Icon name="check" size={54} color={C.green} />kurzer Weg, schnelle Antwort</div>
      </Rv>
      <Rv at={cue(2) + 1.4} dx={20} dy={0} style={{ position: "absolute", left: 900, top: 948 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 46, fontWeight: 600, color: C.green }}><Icon name="wifiOff" size={54} color={C.green} />läuft auch ohne Netz</div>
      </Rv>
    </Szene>
  );
};

const Pict = ({ art, farbe, size = 240 }) => {
  const p = { stroke: farbe, strokeWidth: 6, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      {art === "arm" && <g {...p}><rect x="55" y="165" width="90" height="16" rx="6" /><path d="M100 165 L72 100 L140 62" /><circle cx="72" cy="100" r="9" /><path d="M140 62 L162 56 M140 62 L156 84" /></g>}
      {art === "lager" && <g {...p}><rect x="30" y="112" width="140" height="44" rx="10" /><circle cx="64" cy="170" r="13" /><circle cx="136" cy="170" r="13" /><rect x="68" y="66" width="64" height="46" rx="6" /><path d="M68 84 H132" /></g>}
      {art === "drohne" && <g {...p}><rect x="78" y="94" width="44" height="24" rx="10" /><path d="M78 98 L44 78 M122 98 L156 78 M78 114 L44 134 M122 114 L156 134" /><path d="M26 72 H62 M138 72 H174 M26 140 H62 M138 140 H174" /><path d="M90 118 V134 M110 118 V134" /></g>}
      {art === "service" && <g {...p}><circle cx="100" cy="116" r="56" /><rect x="72" y="92" width="56" height="34" rx="12" /><circle cx="88" cy="109" r="4" fill={farbe} /><circle cx="112" cy="109" r="4" fill={farbe} /><path d="M100 60 V44 M92 44 H108" /></g>}
      {art === "humanoid" && <g {...p}><circle cx="100" cy="42" r="22" /><rect x="72" y="76" width="56" height="62" rx="14" /><path d="M72 88 L44 132 M128 88 L156 132 M88 138 L80 186 M112 138 L120 186" /></g>}
    </svg>
  );
};
const Arten = () => {
  const { t, cue } = useCues();
  const X = [270, 615, 960, 1305, 1650];
  const L = [
    ["arm", "Industrie", "schweißen, montieren", cue(1)],
    ["lager", "Lager", "Regale und Kisten fahren", cue(2)],
    ["drohne", "Drohne", "fliegen, kartieren", cue(3)],
    ["service", "Service", "hilft im Alltag", cue(4) + 0.2],
    ["humanoid", "Humanoid", "menschlicher Körper", cue(4) + 2.6],
  ];
  return (
    <Szene titel="Roboterarten" sub="Gleiche Aufgabe, ganz verschiedene Körper" tiefe={["bot", 1400, 660, 900]}>
      {L.map(([art, n, d, at], i) => {
        const an = sp(t, at, 0.8), intro = sp(t, cue(0) + 0.2 + i * 0.25, 0.8);
        const f = an > 0.4 ? C.blue : C.mute;
        return (
          <React.Fragment key={n}>
            <div style={{ position: "absolute", left: X[i] - 160, top: 320, width: 320, height: 320, borderRadius: 160, background: C.panel, border: `3px solid ${an > 0.4 ? C.blue + "99" : C.line}`, opacity: Math.min(1, intro * 1.5), transform: `scale(${lerp(0.85, 1, intro)})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Pict art={art} farbe={f} size={250} />
            </div>
            <Txt at={cue(0) + 0.4 + i * 0.25} x={X[i] - 170} y={665} w={340} size={58} weight={700} align="center" color={an > 0.4 ? C.text : C.mute}>{n}</Txt>
            <Txt at={at + 0.1} x={X[i] - 170} y={745} w={340} size={42} color={C.mute} align="center">{d}</Txt>
          </React.Fragment>
        );
      })}
      <Rv at={cue(5) + 0.3} dy={10} style={{ position: "absolute", left: 96, top: 915, width: 1728, textAlign: "center" }}>
        <Pill color={C.blue} size={46}>Wahrnehmen</Pill><span style={{ color: C.mute, fontSize: 46, margin: "0 22px" }}>→</span><Pill color={C.green} size={46}>Entscheiden</Pill><span style={{ color: C.mute, fontSize: 46, margin: "0 22px" }}>→</span><Pill color={C.blue} size={46}>Handeln</Pill>
      </Rv>
    </Szene>
  );
};

export default { einstieg: Einstieg, regelkreis: Regelkreis, jetson: Jetson, lokal: Lokal, arten: Arten };
