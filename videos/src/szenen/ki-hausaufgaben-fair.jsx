import React from "react";
import { Szene, useCues, sp, ease, lerp, lin, C } from "../lib.jsx";
import { Panel, Lbl, Skel } from "../bausteine.jsx";
import { Mark, Etikett, Pf, Zettel, Tipp } from "../neu.jsx";
import { Ic, K, Bubble, Num, Stempel, Figur, Quer } from "../bausteine-schule.jsx";

// ---------- 1 Der Auftrag
const Auftrag = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Der Auftrag" tiefe={["edit", 1500, 640, 800]}>
      <Panel x={110} y={235} w={1050} h={640} a={o(0.3)} />
      <Bubble x={300} y={265} w={830} h={170} me t="Schreib mir eine Erörterung zum Handyverbot, fünf Seiten" a={o(0.5)} size={40} />
      <Bubble x={140} y={470} w={880} h={370} a={o(1.6)} size={40}><div style={{ width: "100%" }}><Skel x={0} y={0} w={800} n={7} gap={46} h={20} a={o(1.8)} /></div></Bubble>
      <div style={{ position: "absolute", left: 1290, top: 300, opacity: o(1.6) }}><Ic name="clock" size={330} color={C.orange} sw={1.3} /></div>
      <Lbl x={1210} y={680} w={500} t="Sekunden" size={64} weight={800} align="center" color={C.orange} a={o(2.0)} />
      <K x={1210} y={780} w={600} h={120} icon="help" t="Was bringt dir das?" f={C.blue} size={44} isize={70} a={o(cue(1) + 0.6)} />
    </Szene>
  );
};

// ---------- 2 Das Fitnessstudio
const Fitness = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const stark = ease(t, 2.0, 5.0);
  return (
    <Szene titel="Das Fitnessstudio" tiefe={["dumbbell", 1500, 640, 800]}>
      <Panel x={110} y={235} w={820} h={560} a={o(0.3)} />
      <Figur x={170} y={330} s={200} f={C.blue} a={o(0.5)} />
      <Lbl x={140} y={545} w={260} t="Du" size={46} weight={800} align="center" a={o(0.5)} />
      <Figur x={700} y={330} s={160} f={C.orange} a={o(1.0)} />
      <Lbl x={640} y={510} w={280} t="Dein Kumpel" size={42} weight={800} align="center" color={C.orange} a={o(1.0)} />
      <div style={{ position: "absolute", left: 480, top: 380, opacity: o(1.2), transform: `translateY(${-Math.abs(Math.sin(t * 3)) * 26}px)` }}><Ic name="dumbbell" size={190} color={C.mute} sw={1.4} /></div>
      <Lbl x={110} y={650} w={820} t="Er hebt für dich" size={52} weight={800} align="center" color={C.mute} a={o(1.6)} />
      <Panel x={970} y={235} w={840} h={560} a={o(1.8)} />
      <Lbl x={970} y={262} w={840} t="Kraft" size={44} weight={800} align="center" color={C.mute} a={o(1.9)} />
      <div style={{ position: "absolute", left: 1130, top: 690 - 330 * stark, width: 220, height: Math.max(8, 330 * stark), borderRadius: 14, background: C.orange, opacity: o(1.9) }} />
      <div style={{ position: "absolute", left: 1430, top: 690 - 40, width: 220, height: 40, borderRadius: 14, background: C.red, opacity: o(1.9) }} />
      <Lbl x={1090} y={715} w={300} t="Kumpel" size={42} weight={700} align="center" a={o(2.0)} />
      <Lbl x={1390} y={715} w={300} t="Du" size={42} weight={700} align="center" a={o(2.0)} />
      <K x={110} y={830} w={1700} h={120} icon="cap" t="Gelernt wird nur, was du selbst denkst." f={C.green} size={52} isize={80} a={o(cue(1) + 1.0)} />
    </Szene>
  );
};

// ---------- 3 Dafür ist KI gut
const Gut = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const G = [["bulb", "Anders erklären", "erklärt", 0], ["help", "Dich abfragen", "fragt", 1], ["edit", "Text-Feedback", "zeigt", 2], ["sparkles", "Ideen sammeln", "sammeln", 3]];
  return (
    <Szene titel="Dafür ist KI gut" tiefe={["cap", 1500, 640, 800]}>
      {G.map(([ic, n, key, i]) => {
        const at = word(i < 2 ? 0 : 1, key) - 0.3;
        return (
          <React.Fragment key={n}>
            <K x={110 + (i % 2) * 880} y={250 + Math.floor(i / 2) * 330} w={830} h={290} icon={ic} t={n} f={C.green} size={58} isize={130} a={o(at)} />
            <div style={{ position: "absolute", left: 110 + (i % 2) * 880 + 735, top: 262 + Math.floor(i / 2) * 330 }}><Mark ok size={70} a={o(at + 0.5)} /></div>
          </React.Fragment>
        );
      })}
    </Szene>
  );
};

// ---------- 4 Wo es unfair wird
const Unfair = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Wo es unfair wird" tiefe={["copy", 1500, 640, 800]}>
      <Panel x={110} y={250} w={520} h={300} a={o(0.3)} rand={C.blue} />
      <div style={{ position: "absolute", left: 150, top: 275, opacity: o(0.4) }}><Ic name="sparkles" size={80} color={C.blue} /></div>
      <Lbl x={250} y={290} w={360} t="Text der KI" size={44} weight={800} color={C.blue} a={o(0.4)} />
      <Skel x={150} y={380} w={440} n={4} gap={40} h={18} a={o(0.6)} />
      <Pf x1={650} y1={400} x2={780} y2={400} p={ease(t, 1.0, 1.6)} f={C.red} w={9} />
      <Panel x={800} y={250} w={520} h={300} a={o(0.9)} rand={C.mute} />
      <Lbl x={840} y={280} w={440} t="Mein Heft" size={44} weight={800} color={C.mute} a={o(0.9)} />
      <Skel x={840} y={380} w={440} n={4} gap={40} h={18} a={o(1.0)} />
      <Lbl x={840} y={500} w={440} t="Name: Ich" size={34} color={C.mute} a={o(1.0)} />
      <Stempel x={1000} y={330} t="ABGESCHRIEBEN" size={50} rot={-8} a={o(word(0, "Abschreiben"))} />
      <K x={1360} y={250} w={450} h={300} v icon="repeat" t="Nur schneller" f={C.orange} size={44} isize={100} a={o(word(0, "nur schneller"))} />
      <K x={110} y={620} w={830} h={260} icon="x" t="Du lernst nichts" f={C.red} size={54} isize={110} a={o(cue(1))} />
      <K x={980} y={620} w={830} h={260} icon="alert" t="Kann als Täuschung gelten" f={C.red} size={50} isize={110} a={o(word(1, "Täuschung") - 0.8)} />
    </Szene>
  );
};

// ---------- 5 Die Ampel
const Ampel = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const L = [[C.green, "Grün", "Erklären und abfragen lassen", 390, "Grün"], [C.orange, "Gelb", "Text überarbeiten lassen, offen sagen", 550, "Gelb"], [C.red, "Rot", "Einen fertigen Text abgeben", 710, "Rot"]];
  return (
    <Szene titel="Die Ampel" tiefe={["school", 1500, 640, 800]}>
      <K x={500} y={235} w={1310} h={120} icon="school" t="Regeln je nach Schule, Fach, Lehrkraft: vorher fragen" f={C.blue} size={44} isize={76} a={o(0.4)} />
      <Panel x={110} y={235} w={330} h={660} a={o(0.3)} r={60} />
      {L.map(([f, n, , y, key], i) => {
        const at = word(1, key) - 0.2;
        const an = t > at;
        return <div key={n} style={{ position: "absolute", left: 175, top: 270 + i * 200, width: 200, height: 180, borderRadius: 90, background: an ? f : f + "33", boxShadow: an ? `0 0 60px ${f}88` : "none" }} />;
      })}
      {L.map(([f, n, txt, y, key]) => {
        const at = word(1, key) - 0.2;
        return (
          <div key={n} style={{ position: "absolute", left: 500, top: y, width: 1310, height: 140, borderRadius: 26, background: f + "18", border: `4px solid ${f}`, opacity: o(at), boxSizing: "border-box", display: "flex", alignItems: "center", gap: 30, padding: "0 36px", fontSize: 50, fontWeight: 800, transform: `translateX(${(1 - o(at)) * 40}px)` }}>
            <span style={{ color: f, width: 150 }}>{n}</span>{txt}
          </div>
        );
      })}
    </Szene>
  );
};

// ---------- 6 Ein fairer Ablauf
const Ablauf = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const S = [["user", "Ich", "Gliederung schreiben", C.blue, 0.4], ["bot", "KI", "Sagt, was fehlt", C.orange, word(0, "Dann fragst")], ["user", "Ich", "Text schreiben", C.blue, word(1, "Dann schreibst")], ["bot", "KI", "Prüft, wo es holpert", C.orange, word(1, "Zum Schluss")]];
  return (
    <Szene titel="Ein fairer Ablauf" tiefe={["repeat", 1500, 640, 800]}>
      {S.map(([ic, who, n, f, at], i) => (
        <React.Fragment key={n}>
          <div style={{ position: "absolute", left: 110 + i * 440, top: 250, width: 400, height: 430, borderRadius: 28, background: f + "18", border: `4px solid ${f}`, opacity: o(at), boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, textAlign: "center", padding: "0 16px", transform: `translateY(${(1 - o(at)) * 28}px)` }}>
            <Num n={i + 1} size={60} f={f} />
            <Ic name={ic} size={120} color={f} sw={1.5} />
            <div style={{ fontSize: 56, fontWeight: 800, color: f }}>{who}</div>
            <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.1 }}>{n}</div>
          </div>
          {i < 3 && <Pf x1={512 + i * 440} y1={465} x2={540 + i * 440} y2={465} p={ease(t, at + 0.5, at + 0.9)} f={C.mute} w={6} />}
        </React.Fragment>
      ))}
      <K x={110} y={740} w={1700} h={140} icon="cap" t="Das Denken bleibt bei dir." f={C.green} size={56} isize={90} a={o(word(1, "Das Denken"))} />
    </Szene>
  );
};

// ---------- 7 Offen sagen
const Offen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const TXT = "Ich habe KI genutzt: Ideen sammeln, Rechtschreibung prüfen.";
  return (
    <Szene titel="Offen sagen" tiefe={["edit", 1500, 640, 800]}>
      <Panel x={110} y={235} w={1000} h={640} a={o(0.3)} rand={C.mute} />
      <Lbl x={160} y={270} w={900} t="Meine Erörterung" size={54} weight={800} a={o(0.4)} />
      <Skel x={160} y={370} w={900} n={8} gap={52} h={22} a={o(0.6)} />
      <div style={{ position: "absolute", left: 150, top: 760, width: 920, padding: "14px 26px", borderRadius: 18, background: C.green + "22", border: `3px solid ${C.green}`, fontSize: 40, fontWeight: 700, lineHeight: 1.2, boxSizing: "border-box", opacity: o(cue(0) + 1.0), minHeight: 100 }}><Tipp text={TXT} p={lin(t, cue(0) + 1.2, cue(0) + 4.5)} /></div>
      <K x={1150} y={250} w={660} h={190} icon="thumb" t="Wirkt nicht schwach" f={C.green} size={52} isize={90} a={o(cue(1))} />
      <K x={1150} y={480} w={660} h={190} icon="shield" t="Zeigt: Du weißt, was du tust" f={C.blue} size={46} isize={90} a={o(cue(1) + 1.4)} />
    </Szene>
  );
};

// ---------- 8 Nachprüfen
const Pruefen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Nachprüfen" tiefe={["search", 1500, 640, 800]}>
      <Panel x={110} y={235} w={860} h={560} a={o(0.3)} />
      <Lbl x={150} y={262} w={780} t="Rechnet manchmal falsch" size={42} weight={800} color={C.mute} a={o(0.4)} />
      <div style={{ position: "absolute", left: 150, top: 350, display: "flex", alignItems: "center", gap: 20, opacity: o(0.7) }}><Ic name="bot" size={90} color={C.orange} /><div style={{ fontSize: 64, fontWeight: 800 }}>17 × 6 = <span style={{ color: C.red }}>112</span></div></div>
      <div style={{ position: "absolute", left: 150, top: 520, display: "flex", alignItems: "center", gap: 20, opacity: o(word(0, "rechnet") + 1.5) }}><Ic name="target" size={90} color={C.green} /><div style={{ fontSize: 56, fontWeight: 800 }}>Nachgerechnet: <span style={{ color: C.green }}>102</span></div></div>
      <Panel x={1010} y={235} w={800} h={560} a={o(word(0, "erfindet") - 0.4)} rand={C.red} />
      <Lbl x={1050} y={262} w={720} t="Erfindet Quellen" size={42} weight={800} color={C.mute} a={o(word(0, "erfindet") - 0.3)} />
      <div style={{ position: "absolute", left: 1050, top: 360, display: "flex", alignItems: "center", gap: 20, fontSize: 42, fontWeight: 700, opacity: o(word(0, "erfindet")) }}><Ic name="link" size={76} color={C.blue} />studie-xyz.example</div>
      <div style={{ position: "absolute", left: 1050, top: 500, fontSize: 110, fontWeight: 900, color: C.red, opacity: o(word(0, "erfindet") + 1) }}>404</div>
      <div style={{ position: "absolute", left: 1400, top: 500, opacity: o(word(0, "erfindet") + 1.4) }}><Mark ok={false} size={100} a={o(word(0, "erfindet") + 1.4)} /></div>
      <K x={110} y={830} w={1700} h={120} icon="userCheck" t="Verantwortlich für das, was du abgibst: du, nicht sie." f={C.blue} size={50} isize={80} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 9 Der Tafel-Test
const Tafel = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Der Tafel-Test" tiefe={["cap", 1500, 640, 800]}>
      <div style={{ position: "absolute", left: 110, top: 250, width: 830, height: 530, borderRadius: 18, background: "#1e3b2f", border: "14px solid #8d6e4c", boxSizing: "border-box", opacity: o(0.3) }}>
        <div style={{ position: "absolute", left: 46, top: 36, fontSize: 64, fontWeight: 800, color: "#f0f0e8", fontFamily: "ui-rounded, 'Comic Sans MS', sans-serif" }}>Erkläre es!</div>
        <Skel x={46} y={170} w={600} n={3} gap={50} h={14} farbe="#cfd8c8" a={o(0.8)} />
        <svg style={{ position: "absolute", left: 480, top: 250, width: 300, height: 200, opacity: o(1.2) }} viewBox="0 0 300 200"><circle cx="70" cy="100" r="50" fill="none" stroke="#f0f0e8" strokeWidth="6" /><path d="M120 100h80M180 80l24 20-24 20" fill="none" stroke="#f0f0e8" strokeWidth="6" strokeLinecap="round" /><rect x="210" y="60" width="70" height="80" fill="none" stroke="#f0f0e8" strokeWidth="6" /></svg>
      </div>
      <Figur x={420} y={800} s={110} f={C.blue} a={o(1.4)} />
      <Lbl x={110} y={920} w={830} t="Ohne Handy" size={44} weight={800} align="center" color={C.mute} a={o(1.6)} />
      <K x={980} y={250} w={830} h={240} icon="check" t="Ja: Ich kann es erklären" sub="Dann hast du etwas gelernt" f={C.green} size={52} isize={100} a={o(cue(1) + 0.2)} />
      <K x={980} y={540} w={830} h={240} icon="repeat" t="Nein: Frag nochmal" sub="Diesmal nach der Erklärung" f={C.orange} size={52} isize={100} a={o(word(1, "Wenn nein") - 0.2)} />
    </Szene>
  );
};

export default { auftrag: Auftrag, fitness: Fitness, gut: Gut, unfair: Unfair, ampel: Ampel, ablauf: Ablauf, offen: Offen, pruefen: Pruefen, tafel: Tafel };
