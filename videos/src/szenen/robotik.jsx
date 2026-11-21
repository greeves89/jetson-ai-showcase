import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, Pill, Pfeil, Pfad, C, rnd, spitze } from "../lib.jsx";

const Einstieg = () => {
  const { t, cue, word } = useCues();
  const X = [800, 1180, 1560];
  const knoten = [["eye", "Wahrnehmen", word(1, "wahrnehmen")], ["fork", "Entscheiden", word(1, "entscheiden")], ["pointer", "Handeln", word(1, "handeln")]];
  const lauf = ease(t, word(1, "immer"), word(1, "immer") + 1.4);
  return (
    <Szene titel="Roboter" sub="KI mit Körper, die in die Welt eingreift">
      <Rv at={cue(0) + 0.2} s0={0.8} style={{ position: "absolute", left: 120, top: 450 }}>
        <div style={{ textAlign: "center", width: 360 }}><Badge name="bot" size={260} glow={1} /><div style={{ fontSize: 44, fontWeight: 700, marginTop: 20 }}>KI + Körper</div></div>
      </Rv>
      {knoten.map(([ic, n, at], i) => (
        <React.Fragment key={n}>
          <Rv at={at} s0={0.85} style={{ position: "absolute", left: X[i] - 100, top: 480 }}><div style={{ textAlign: "center", width: 200 }}><Badge name={ic} size={150} color={i === 1 ? C.green : C.blue} /></div></Rv>
          <Txt at={at + 0.1} x={X[i] - 150} y={650} w={300} size={42} weight={700} align="center">{n}</Txt>
          {i > 0 && <Pfeil x1={X[i - 1] + 95} y1={555} x2={X[i] - 95} y2={555} p={sp(t, at - 0.1, 0.5)} color={C.mute} />}
        </React.Fragment>
      ))}
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <Pfad d="M1560 740 C 1560 880, 800 880, 800 760" p={lauf} color={C.blue} w={6} head={spitze(800, 880, 800, 760, 22)} />
      </svg>
      <Txt at={word(1, "immer")} x={800} y={850} w={760} size={38} weight={600} color={C.blue} align="center">immer wieder</Txt>
    </Szene>
  );
};

const Regelkreis = () => {
  const { t, cue, end } = useCues();
  const K = { s: [560, 470], p: [1180, 470], a: [1180, 800], w: [560, 800] };
  const R = 80;
  const wasser = [
    { id: "s", n: "Sensoren", i: "camera", sub: "messen die Welt", ex: "sieht das Teil", at: cue(1), links: true },
    { id: "p", n: "Planung (KI)", i: "cpu", sub: "entscheidet", ex: "plant den Griff", at: cue(2), links: false },
    { id: "a", n: "Aktoren", i: "zap", sub: "führen aus", ex: "schließt die Finger", at: cue(3), links: false },
    { id: "w", n: "Welt", i: "box", sub: "ändert sich", ex: "Teil ist gegriffen", at: cue(4) - 0.3, links: true },
  ];
  const beispiel = sp(t, cue(5) + 0.4, 0.8);
  // laufender Punkt auf dem Kreis
  const pfad = [K.s, K.p, K.a, K.w, K.s];
  const lauf = (Math.max(0, t - (cue(4) + 1.6)) / 4) % 1;
  const seg = Math.floor(lauf * 4), fr = lauf * 4 - seg;
  const dot = [lerp(pfad[seg][0], pfad[seg + 1][0], fr), lerp(pfad[seg][1], pfad[seg + 1][1], fr)];
  return (
    <Szene titel="Der Regelkreis" sub="Wahrnehmen, entscheiden, handeln">
      <Pfeil x1={K.s[0] + 100} y1={K.s[1]} x2={K.p[0] - 100} y2={K.p[1]} p={sp(t, cue(2) - 0.4, 0.8)} color={C.blue} />
      <Pfeil x1={K.p[0]} y1={K.p[1] + 100} x2={K.a[0]} y2={K.a[1] - 100} p={sp(t, cue(3) - 0.4, 0.8)} color={C.blue} />
      <Pfeil x1={K.a[0] - 100} y1={K.a[1]} x2={K.w[0] + 100} y2={K.w[1]} p={sp(t, cue(4) - 0.9, 0.8)} color={C.blue} />
      <Pfeil x1={K.w[0]} y1={K.w[1] - 100} x2={K.s[0]} y2={K.s[1] + 100} p={sp(t, cue(4) + 0.4, 0.8)} color={C.green} />
      {wasser.map((k) => {
        const [x, y] = K[k.id];
        const lx = k.links ? 120 : x + 120, al = k.links ? "right" : "left";
        const w = k.links ? x - 120 - 120 : 1800 - (x + 120);
        return (
          <React.Fragment key={k.id}>
            <Rv at={k.at} s0={0.85} style={{ position: "absolute", left: x - R, top: y - R }}><Badge name={k.i} size={R * 2} color={k.id === "w" ? C.green : C.blue} /></Rv>
            <Txt at={k.at + 0.1} x={lx} y={y - 50} w={w} size={42} weight={700} align={al}>{k.n}</Txt>
            <div style={{ position: "absolute", left: lx, top: y + 6, width: w, textAlign: al, fontSize: 36, color: C.mute, opacity: sp(t, k.at + 0.3, 0.6) * (1 - beispiel) }}>{k.sub}</div>
            <div style={{ position: "absolute", left: lx, top: y + 6, width: w, textAlign: al, fontSize: 36, color: C.orange, fontWeight: 600, opacity: beispiel }}>{k.ex}</div>
          </React.Fragment>
        );
      })}
      {t > cue(4) + 1.6 && <div style={{ position: "absolute", left: dot[0] - 14, top: dot[1] - 14, width: 28, height: 28, borderRadius: 14, background: C.text, boxShadow: `0 0 24px ${C.blue}` }} />}
      <Rv at={cue(5) + 0.2} dy={0} style={{ position: "absolute", left: 700, top: 650 }}>
        <div style={{ fontSize: 36, color: C.orange, fontWeight: 600, width: 400, textAlign: "center" }}>Beispiel: Greifarm</div>
      </Rv>
    </Szene>
  );
};

const Jetson = () => {
  const { t, cue, end } = useCues();
  const rahmen = sp(t, cue(2), 1.0);
  return (
    <Szene titel="Der Jetson als Gehirn" sub="Ein kleiner Rechner direkt am Roboter">
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <rect x={120} y={400} width={1680} height={500} rx={40} fill="none" stroke={C.green} strokeWidth={4} strokeDasharray="14 12" opacity={rahmen} />
        <rect x={700} y={470} width={520} height={340} rx={28} fill={C.panel} stroke={C.blue} strokeWidth={4} opacity={sp(t, cue(0) + 0.2, 0.9)} />
        {Array.from({ length: 6 }).map((_, k) => <path key={k} d={`M${760 + k * 80} 470 v-24 M${760 + k * 80} 810 v24`} stroke={C.line} strokeWidth={6} strokeLinecap="round" opacity={sp(t, cue(0) + 0.5, 0.9)} />)}
        <rect x={860} y={540} width={200} height={200} rx={22} fill={C.blue + "26"} stroke={C.blue} strokeWidth={4} opacity={sp(t, cue(0) + 0.6, 0.9)} />
        <text x={960} y={655} textAnchor="middle" fontSize={54} fontWeight={800} fill={C.text} opacity={sp(t, cue(0) + 0.8, 0.8)} fontFamily="inherit">GPU</text>
        <Pfad d="M430 640 L690 640" p={sp(t, cue(0) + 1.0, 0.7)} color={C.mute} w={5} head={spitze(430, 640, 690, 640, 18)} />
        <Pfad d="M1230 640 L1490 640" p={sp(t, cue(0) + 1.3, 0.7)} color={C.mute} w={5} head={spitze(1230, 640, 1490, 640, 18)} />
      </svg>
      <Rv at={cue(0) + 0.4} style={{ position: "absolute", left: 250, top: 540 }}><div style={{ textAlign: "center", width: 200 }}><Badge name="camera" size={160} color={C.mute} /><div style={{ fontSize: 36, marginTop: 10, fontWeight: 600 }}>Sensoren</div></div></Rv>
      <Rv at={cue(0) + 0.9} style={{ position: "absolute", left: 1500, top: 540 }}><div style={{ textAlign: "center", width: 200 }}><Badge name="zap" size={160} color={C.mute} /><div style={{ fontSize: 36, marginTop: 10, fontWeight: 600 }}>Motoren</div></div></Rv>
      <Txt at={cue(0) + 0.8} x={700} y={846} w={520} size={38} weight={700} align="center">Jetson</Txt>
      <Txt at={cue(1) + 0.1} x={700} y={752} w={520} size={38} color={C.blue} weight={600} align="center">Grafikkarte für KI</Txt>
      <Rv at={cue(1) + 1.6} dy={0} style={{ position: "absolute", left: 1250, top: 760 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: 600, color: C.green }}><Icon name="zap" size={38} color={C.green} />wenig Strom</div>
      </Rv>
      <Txt at={cue(2) + 0.2} x={160} y={420} w={700} size={38} weight={700} color={C.green}>Alles läuft am Gerät</Txt>
    </Szene>
  );
};

const Lokal = () => {
  const { t, cue, end } = useCues();
  const kreis = ((t - cue(1) - 0.3) / 5.0);
  const l = Math.max(0, kreis) % 1;
  // Internet-Weg: Roboter (270,520) -> Wolke (1560,520) und zurück
  const dx = l < 0.5 ? lerp(300, 1450, l * 2) : lerp(1450, 300, (l - 0.5) * 2);
  const kurz = (Math.max(0, t - cue(1) - 0.3) / 0.9) % 1;
  const kx = kurz < 0.5 ? lerp(300, 560, kurz * 2) : lerp(560, 300, (kurz - 0.5) * 2);
  const aus = sp(t, cue(2) + 1.0, 0.7);
  return (
    <Szene titel="Warum lokal?" sub="Die Antwort muss sofort da sein">
      {/* Internet */}
      <Txt at={cue(0) + 0.3} x={120} y={370} w={800} size={38} weight={700} color={C.orange}>Über das Internet</Txt>
      <Rv at={cue(1)} style={{ position: "absolute", left: 120, top: 440 }}><Badge name="bot" size={120} color={C.mute} /></Rv>
      <Rv at={cue(1) + 0.2} style={{ position: "absolute", left: 1500, top: 410 }}><Badge name="cloud" size={160} color={C.orange} /></Rv>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <Pfad d="M270 482 L1480 482" p={sp(t, cue(1), 0.8)} color={C.line} w={5} dash="0.01 0.012" />
        <Pfad d="M1480 540 L270 540" p={sp(t, cue(1), 0.8)} color={C.line} w={5} dash="0.01 0.012" />
        {t > cue(1) + 0.3 && <circle cx={dx} cy={l < 0.5 ? 482 : 540} r={16} fill={aus > 0.5 ? C.red : C.orange} opacity={1 - aus * 0.7} />}
        <g opacity={aus}><Pfad d="M840 450 L960 570 M960 450 L840 570" color={C.red} w={9} p={1} /></g>
      </svg>
      <Txt at={cue(1) + 0.8} x={300} y={585} w={1200} size={38} color={C.mute} align="center">weiter Weg für jede Antwort</Txt>
      {/* lokal */}
      <Txt at={cue(2) - 0.2} x={120} y={700} w={800} size={38} weight={700} color={C.green}>Lokal am Gerät</Txt>
      <Rv at={cue(2)} style={{ position: "absolute", left: 120, top: 770 }}><Badge name="bot" size={120} color={C.mute} /></Rv>
      <Rv at={cue(2) + 0.2} style={{ position: "absolute", left: 640, top: 770 }}><Badge name="cpu" size={120} color={C.green} /></Rv>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <Pfad d="M255 815 L625 815" p={sp(t, cue(2), 0.8)} color={C.line} w={5} dash="0.01 0.012" />
        <Pfad d="M625 845 L255 845" p={sp(t, cue(2), 0.8)} color={C.line} w={5} dash="0.01 0.012" />
        {t > cue(2) + 0.5 && <circle cx={lerp(300, 570, (Math.abs(((Math.max(0, t - cue(2) - 0.5) / 0.7) % 1) * 2 - 1)))} cy={830} r={14} fill={C.green} />}
      </svg>
      <Rv at={cue(2) + 0.6} dx={20} dy={0} style={{ position: "absolute", left: 860, top: 780 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: 600, color: C.green }}><Icon name="check" size={40} color={C.green} />kurzer Weg, schnelle Antwort</div>
      </Rv>
      <Rv at={cue(2) + 1.2} dx={20} dy={0} style={{ position: "absolute", left: 860, top: 850 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: 600, color: C.green }}><Icon name="wifiOff" size={40} color={C.green} />läuft auch ohne Netz weiter</div>
      </Rv>
    </Szene>
  );
};

const Pict = ({ art, farbe, size = 210 }) => {
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
  const { t, cue, end } = useCues();
  const X = [285, 622, 960, 1297, 1635];
  const L = [
    ["arm", "Industrie", "schweißen, montieren", cue(1)],
    ["lager", "Lager", "Regale und Kisten fahren", cue(2)],
    ["drohne", "Drohne", "fliegen, kartieren", cue(3)],
    ["service", "Service", "hilft im Alltag", cue(4) + 0.2],
    ["humanoid", "Humanoid", "bildet den menschlichen Körper nach", cue(4) + 2.6],
  ];
  return (
    <Szene titel="Roboterarten" sub="Gleiche Aufgabe, ganz verschiedene Körper">
      {L.map(([art, n, d, at], i) => {
        const an = sp(t, at, 0.8), intro = sp(t, cue(0) + 0.2 + i * 0.25, 0.8);
        const f = an > 0.4 ? C.blue : C.mute;
        return (
          <React.Fragment key={n}>
            <div style={{ position: "absolute", left: X[i] - 130, top: 440, width: 260, height: 260, borderRadius: 130, background: C.panel, border: `2px solid ${an > 0.4 ? C.blue + "88" : C.line}`, opacity: Math.min(1, intro * 1.5), transform: `scale(${lerp(0.85, 1, intro)})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: an > 0.4 ? `0 0 ${50 * an}px ${C.blue}44` : "none" }}>
              <Pict art={art} farbe={f} size={190} />
            </div>
            <Txt at={cue(0) + 0.4 + i * 0.25} x={X[i] - 160} y={730} w={320} size={44} weight={700} align="center" color={an > 0.4 ? C.text : C.mute}>{n}</Txt>
            <Txt at={at + 0.1} x={X[i] - 160} y={796} w={320} size={38} color={C.mute} align="center">{d}</Txt>
          </React.Fragment>
        );
      })}
      <Rv at={cue(5) + 0.3} dy={10} style={{ position: "absolute", left: 120, top: 920, width: 1680, textAlign: "center" }}>
        <Pill color={C.blue} size={36}>Wahrnehmen</Pill><span style={{ color: C.mute, fontSize: 36, margin: "0 18px" }}>→</span><Pill color={C.green} size={36}>Entscheiden</Pill><span style={{ color: C.mute, fontSize: 36, margin: "0 18px" }}>→</span><Pill color={C.blue} size={36}>Handeln</Pill>
      </Rv>
    </Szene>
  );
};

export default { einstieg: Einstieg, regelkreis: Regelkreis, jetson: Jetson, lokal: Lokal, arten: Arten };
