import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Txt, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Skel, Zahlen, Dot, Fig, Chip, Lin, Flug, Karte } from "../bausteine.jsx";

const MiniKarte = ({ x, y, w, h, a = 1, pin, ort, f = C.blue }) => (
  <>
    <Karte x={x} y={y} w={w} h={h} a={a}>
      <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={0} y1={h * 0.4} x2={w} y2={h * 0.35} stroke="#3a3a3c" strokeWidth={24} strokeLinecap="round" />
        <line x1={w * 0.3} y1={0} x2={w * 0.36} y2={h} stroke="#3a3a3c" strokeWidth={24} strokeLinecap="round" />
        <line x1={w * 0.72} y1={0} x2={w * 0.66} y2={h} stroke="#3a3a3c" strokeWidth={24} strokeLinecap="round" />
      </svg>
    </Karte>
    <Dot x={x + pin[0]} y={y + pin[1]} r={26} f={f} a={a} />
    <Lbl x={x + pin[0] - 160} y={y + pin[1] + 40} w={320} t={ort} size={46} align="center" a={a} />
  </>
);
const Verlag = () => {
  const { t, cue } = useCues();
  const a = sp(t, 0.3, 0.8), c = sp(t, cue(1) + 0.2, 0.7), gl = sp(t, cue(2) + 0.2, 0.6);
  return (
    <Szene titel="Modell" tiefe={["grid", 1380, 650, 900]}>
      <MiniKarte x={110} y={300} w={800} h={640} a={a} pin={[470, 230]} ort="Bahnhof" />
      <MiniKarte x={1010} y={300} w={800} h={640} a={c} pin={[470, 230]} ort="Park" f={C.orange} />
      <Lbl x={110} y={940} w={800} t="Modell A" size={50} color={C.blue} align="center" a={a} />
      <Lbl x={1010} y={940} w={800} t="Modell B" size={50} color={C.orange} align="center" a={c} />
      {[0, 1].map((i) => <Zahlen key={i} x={i ? 1480 : 580} y={330} w={170} h={70} n={2} seed={4} farbe={i ? C.orange : C.blue} a={sp(t, cue(1) + 0.6, 0.6)} />)}
      <div style={{ position: "absolute", left: 910, top: 560, width: 100, textAlign: "center", fontSize: 110, fontWeight: 800, opacity: gl, color: C.red }}>≠</div>
    </Szene>
  );
};

const Gleich = () => {
  const { t, cue } = useCues();
  const D = Array.from({ length: 10 }).map((_, i) => [620 + (rnd(i) - 0.5) * 380, 640 + (rnd(i + 20) - 0.5) * 300]);
  const Q = [1420, 380];
  const spin = (t - cue(1)) * 120;
  return (
    <Szene titel="Gleiches Modell" tiefe={["repeat", 1380, 650, 900]}>
      <Karte x={110} y={270} w={1700} h={710} />
      {D.map(([x, y], i) => <Dot key={i} x={x} y={y} r={18} f={C.blue} a={sp(t, 0.3 + i * 0.08, 0.5)} />)}
      <Lbl x={380} y={800} w={500} t="Modell A" size={50} color={C.blue} align="center" a={sp(t, 0.8, 0.6)} />
      <Dot x={Q[0]} y={Q[1]} r={30} f={C.orange} a={sp(t, cue(0) + 0.6, 0.6)} />
      <Lbl x={Q[0] - 200} y={Q[1] + 45} w={400} t="Frage, Modell B" size={44} color={C.orange} align="center" a={sp(t, cue(0) + 0.6, 0.6)} />
      <Lin x1={Q[0]} y1={Q[1]} x2={760} y2={620} p={sp(t, cue(0) + 1.4, 0.8)} f={C.red} w={6} dash="12 12" />
      <div style={{ position: "absolute", left: 1050, top: 460, opacity: sp(t, cue(1) + 0.2, 0.6), transform: `rotate(${spin}deg)` }}><Icon name="repeat" size={200} color={C.green} /></div>
      <Lbl x={850} y={700} w={800} t="Alles neu einbetten" size={56} color={C.green} align="center" a={sp(t, cue(1) + 0.8, 0.6)} />
    </Szene>
  );
};

const Laenge = () => {
  const { t, cue } = useCues();
  const quetsch = ease(t, cue(1) + 0.4, cue(1) + 1.8);
  const stuecke = ease(t, cue(2) + 1.2, cue(2) + 2.2);
  const w = lerp(1500, 120, quetsch);
  return (
    <Szene titel="Länge" tiefe={["file", 1380, 650, 900]}>
      <Karte x={110} y={500} w={1700} h={480} />
      {stuecke < 0.02 && (
        <>
          <Panel x={lerp(150, 860, quetsch)} y={lerp(300, 650, quetsch)} w={w} h={lerp(160, 120, quetsch)} r={20} a={sp(t, 0.3, 0.7)} rand={C.orange}>
            <Skel x={20} y={24} w={Math.max(40, w - 40)} n={3} gap={42} h={18} />
          </Panel>
          <div style={{ position: "absolute", left: 860, top: 650, width: 120, height: 120, borderRadius: 60, background: C.blue, filter: `blur(${quetsch * 26}px)`, opacity: quetsch }} />
        </>
      )}
      {stuecke > 0.02 && Array.from({ length: 6 }).map((_, i) => <Dot key={i} x={420 + i * 220} y={740 + (rnd(i) - 0.5) * 120} r={26} f={C.green} a={stuecke} />)}
      <Lbl x={110} y={290} w={900} t="Zu lang" size={56} color={C.orange} a={sp(t, cue(1) + 1.6, 0.6) * (1 - stuecke)} />
      <Lbl x={110} y={290} w={900} t="Kurze Stücke" size={56} color={C.green} a={stuecke} />
    </Szene>
  );
};

const Sprache = () => {
  const { t, cue } = useCues();
  const klar = Array.from({ length: 14 }).map((_, i) => [420 + (rnd(i) - 0.5) * 520, 520 + (rnd(i + 9) - 0.5) * 360]);
  const grau = Array.from({ length: 8 }).map((_, i) => [1330 + (rnd(i + 30) - 0.5) * 460, 700 + (rnd(i + 40) - 0.5) * 300]);
  return (
    <Szene titel="Sprache" tiefe={["message", 1380, 650, 900]}>
      <Karte x={110} y={270} w={1700} h={710} />
      {klar.map(([x, y], i) => <Dot key={i} x={x} y={y} r={18} f={C.blue} a={sp(t, 0.3 + i * 0.06, 0.5)} />)}
      <Lbl x={160} y={820} w={620} t="Deutsch, Englisch" size={48} color={C.blue} align="center" a={sp(t, 0.8, 0.6)} />
      {grau.map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 20, top: y - 20, width: 40, height: 40, borderRadius: 20, background: "#8e8e93", filter: "blur(6px)", opacity: sp(t, cue(1) + 0.3 + i * 0.1, 0.5) }} />)}
      <Chip x={1170} y={310} t="Selten" f={C.mute} size={48} a={sp(t, cue(1) + 0.4, 0.6)} />
      <Chip x={1380} y={870} t="Jargon" f={C.orange} size={48} a={sp(t, cue(1) + 1.6, 0.6)} />
      <div style={{ position: "absolute", left: 1500, top: 420, opacity: sp(t, cue(2), 0.6) }}><Icon name="check" size={200} color={C.green} /></div>
      <Lbl x={1300} y={640} w={440} t="Selbst testen" size={44} color={C.green} align="center" a={sp(t, cue(2) + 0.4, 0.6)} />
    </Szene>
  );
};

const Zeichen = () => {
  const { t, cue } = useCues();
  const lupe = ease(t, cue(1) + 0.5, cue(1) + 1.6);
  const sr = sp(t, cue(2) + 0.3, 0.7);
  return (
    <Szene titel="Genaue Zeichen" tiefe={["search", 1380, 650, 900]}>
      <Rv at={0.4}><Panel x={110} y={290} w={800} h={170} r={30}><div style={{ fontSize: 100, fontWeight: 800, textAlign: "center", lineHeight: "170px" }}>E-<span style={{ color: C.blue }}>4711</span></div></Panel></Rv>
      <Rv at={cue(1)}><Panel x={1010} y={290} w={800} h={170} r={30}><div style={{ fontSize: 100, fontWeight: 800, textAlign: "center", lineHeight: "170px" }}>E-<span style={{ color: C.orange }}>4712</span></div></Panel></Rv>
      <Karte x={110} y={510} w={1700} h={470} a={sp(t, cue(1) + 0.2, 0.7)} />
      <Dot x={880} y={740} r={30} f={C.blue} a={sp(t, cue(1) + 0.3, 0.6)} />
      <Dot x={928} y={748} r={30} f={C.orange} a={sp(t, cue(1) + 0.5, 0.6)} />
      <div style={{ position: "absolute", left: 904 - 190, top: 744 - 190, width: 380, height: 380, borderRadius: 190, border: `8px solid ${C.green}`, opacity: lupe, transform: `scale(${lerp(0.4, 1, lupe)})`, background: "#000000aa" }}>
        <div style={{ position: "absolute", left: 190 - 90 - 14, top: 190 - 60, width: 100, height: 100, borderRadius: 50, background: C.blue }} />
        <div style={{ position: "absolute", left: 190 - 20, top: 190 - 52, width: 100, height: 100, borderRadius: 50, background: C.orange, opacity: 0.9 }} />
      </div>
      <Chip x={1230} y={640} t="Stichwortsuche" f={C.green} size={52} a={sr} />
      <div style={{ position: "absolute", left: 1480, top: 720, opacity: sr }}><Icon name="search" size={170} color={C.green} /></div>
    </Szene>
  );
};

const Pruefen = () => {
  const { t, cue, dur } = useCues();
  const R = [["database", "Gleiches Modell"], ["list", "Kurze Stücke"], ["check", "Eigene Tests"], ["search", "Codes extra"], ["lock", "Daten sicher"]];
  return (
    <Szene titel="Checkliste" tiefe={["lock", 1400, 650, 900]}>
      {R.map(([ic, n], i) => {
        const at = lerp(0.5, dur - 3.2, i / 5), y = 290 + i * 135, a = sp(t, at, 0.7);
        return (
          <Rv key={n} at={at} dx={-40} dy={0} style={{ position: "absolute", left: 110, top: y }}>
            <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
              <Badge name={ic} size={110} color={i === 4 ? C.orange : C.blue} />
              <div style={{ fontSize: 76, fontWeight: 700 }}>{n}</div>
              <div style={{ marginLeft: 30, opacity: a }}><Icon name="check" size={80} color={C.green} sw={3} /></div>
            </div>
          </Rv>
        );
      })}
      <div style={{ position: "absolute", left: 1330, top: 380, opacity: sp(t, cue(1) + 0.3, 0.8) }}><Icon name="lock" size={440} color={C.orange} sw={1.2} /></div>
      <Lbl x={1250} y={850} w={560} t="Im Haus oder Cloud?" size={46} color={C.orange} align="center" a={sp(t, cue(1) + 1.0, 0.6)} />
    </Szene>
  );
};

export default { verlag: Verlag, gleich: Gleich, laenge: Laenge, sprache: Sprache, zeichen: Zeichen, pruefen: Pruefen };
