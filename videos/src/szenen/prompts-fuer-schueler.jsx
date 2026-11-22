import React from "react";
import { Szene, useCues, sp, ease, lerp, lin, C } from "../lib.jsx";
import { Panel, Lbl, Skel } from "../bausteine.jsx";
import { Mark, Etikett, Pf, Tipp } from "../neu.jsx";
import { Ic, K, Bubble, Num, Figur, Quer } from "../bausteine-schule.jsx";

// ---------- 1 Die Textwand
const Textwand = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Die Textwand" tiefe={["file", 1500, 640, 800]}>
      <Panel x={110} y={235} w={1700} h={560} a={o(0.3)} />
      <Bubble x={1000} y={265} w={780} h={110} me t="Erklär Bruchrechnung" a={o(0.5)} size={48} />
      <Bubble x={140} y={410} w={1250} h={350} a={o(1.6)} size={40}><div style={{ width: "100%" }}><Skel x={0} y={0} w={1150} n={7} gap={46} h={20} a={o(1.8)} /></div></Bubble>
      <div style={{ position: "absolute", left: 1450, top: 480, fontSize: 130, fontWeight: 900, color: C.orange, opacity: o(2.6) }}>Zzz</div>
      <K x={110} y={830} w={1700} h={120} icon="help" t="Oft liegt es nicht an der KI, sondern an der Frage." f={C.blue} size={50} isize={80} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 2 Sie muss raten
const Raten = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Sie muss raten" tiefe={["bot", 1500, 640, 800]}>
      <Figur x={800} y={380} s={320} f={C.orange} icon="bot" a={o(0.3)} />
      <K x={110} y={250} w={600} h={150} icon="cap" t="Welche Klasse?" f={C.blue} size={48} isize={80} a={o(word(0, "Klasse"))} />
      <K x={110} y={470} w={600} h={150} icon="check" t="Was kannst du schon?" f={C.green} size={44} isize={80} a={o(word(0, "was du schon"))} />
      <K x={110} y={690} w={600} h={150} icon="frown" t="Was nervt dich?" f={C.red} size={48} isize={80} a={o(word(0, "nervt"))} />
      {[360, 545, 760].map((y, i) => <Pf key={i} x1={720} y1={y} x2={790} y2={560} p={ease(t, 1.0 + i * 0.8, 1.6 + i * 0.8)} f={C.mute} w={5} />)}
      <K x={1210} y={300} w={600} h={190} icon="question" t="Sie rät." f={C.orange} size={60} isize={90} a={o(cue(1))} />
      <K x={1210} y={540} w={600} h={190} icon="scale" t="Raten ergibt Durchschnitt." f={C.red} size={46} isize={90} a={o(word(1, "Raten ergibt"))} />
    </Szene>
  );
};

// ---------- 3 Rolle und Kontext
const Rolle = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Rolle und Kontext" tiefe={["user", 1500, 640, 800]}>
      <Panel x={110} y={235} w={840} h={640} a={o(0.3)} rand={C.blue} />
      <Num n="1" size={70} f={C.blue} a={o(0.4)} style={{ position: "absolute", left: 140, top: 260 }} />
      <Lbl x={240} y={268} w={600} t="Rolle" size={64} weight={800} color={C.blue} a={o(0.4)} />
      <Ic name="user" size={160} color={C.blue} sw={1.4} style={{ position: "absolute", left: 140, top: 400, opacity: o(0.7) }} />
      <Bubble x={140} y={610} w={780} h={220} t="Du bist ein geduldiger Nachhilfelehrer." me a={o(cue(0) + 1.4)} size={46} />
      <Panel x={980} y={235} w={830} h={640} a={o(cue(1) - 0.3)} rand={C.green} />
      <Num n="2" size={70} f={C.green} a={o(cue(1) - 0.2)} style={{ position: "absolute", left: 1010, top: 260 }} />
      <Lbl x={1110} y={268} w={600} t="Material und Kontext" size={52} weight={800} color={C.green} a={o(cue(1) - 0.2)} />
      <Ic name="cap" size={160} color={C.green} sw={1.4} style={{ position: "absolute", left: 1010, top: 400, opacity: o(cue(1)) }} />
      <Bubble x={1010} y={610} w={770} h={220} t="Ich bin in Klasse acht und verstehe das Kürzen nicht." me f={C.green} a={o(cue(1) + 0.3)} size={44} />
    </Szene>
  );
};

// ---------- 4 Aufgabe und Format
const Aufgabe = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const R = [["list", "Aufgabe", "Erkläre es in drei Schritten", C.blue, word(0, "Erkläre")], ["edit", "Format", "Beispiel aus dem Alltag, kurze Sätze", C.orange, word(0, "Beispiel")], ["stop", "Grenzen", "Keine Fachwörter ohne Erklärung", C.red, word(1, "Du kannst")]];
  return (
    <Szene titel="Aufgabe und Format" tiefe={["list", 1500, 640, 800]}>
      {R.map(([ic, n, txt, f, at], i) => (
        <div key={n} style={{ position: "absolute", left: 110, top: 250 + i * 210, width: 1700, height: 180, borderRadius: 28, background: f + "18", border: `4px solid ${f}`, opacity: o(at), boxSizing: "border-box", display: "flex", alignItems: "center", gap: 36, padding: "0 40px", transform: `translateX(${(1 - o(at)) * 50}px)` }}>
          <Ic name={ic} size={100} color={f} sw={1.6} />
          <div style={{ fontSize: 60, fontWeight: 800, color: f, width: 360 }}>{n}</div>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{txt}</div>
        </div>
      ))}
    </Szene>
  );
};

// ---------- 5 Hinweise statt Lösung
const Hinweis = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Hinweise statt Lösung" tiefe={["bulb", 1500, 640, 800]}>
      <Panel x={110} y={235} w={700} h={500} a={o(0.3)} />
      <Lbl x={110} y={262} w={700} t="Aufgabe" size={42} weight={800} align="center" color={C.mute} a={o(0.4)} />
      <Lbl x={110} y={340} w={700} t="3x + 5 = 20" size={84} weight={800} align="center" a={o(0.5)} />
      <div style={{ position: "absolute", left: 190, top: 520, width: 540, height: 150, borderRadius: 26, background: "#2c2c2e", border: `3px dashed ${C.mute}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, opacity: o(0.9), fontSize: 50, fontWeight: 700, color: C.mute }}><Ic name="lock" size={80} color={C.mute} />Lösung</div>
      <Bubble x={870} y={250} w={940} h={170} t="Gib mir nur einen Tipp. Ich probiere es selbst." me a={o(word(0, "Sag"))} size={46} f={C.orange} />
      <K x={870} y={460} w={940} h={250} icon="bulb" t="Tipp" sub="Bring zuerst die 5 auf die andere Seite" f={C.orange} size={58} isize={110} a={o(word(0, "Sag") + 1.8)} />
      <K x={110} y={800} w={1700} h={130} icon="cap" t="So bleibt das Denken bei dir." f={C.green} size={56} isize={86} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 6 Lass dich abfragen
const Abfragen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Lass dich abfragen" tiefe={["help", 1500, 640, 800]}>
      <Bubble x={110} y={250} w={1300} h={130} me t="Stell mir fünf Fragen, eine nach der anderen." a={o(0.4)} size={50} />
      {[1, 2, 3, 4, 5].map((n, i) => {
        const done = i < 2, now = i === 2;
        const f = done ? C.green : now ? C.orange : C.mute;
        const at = 1.4 + i * 0.7;
        return (
          <div key={n} style={{ position: "absolute", left: 110 + i * 350, top: 450, width: 320, height: 230, borderRadius: 28, background: f + "18", border: `4px solid ${f}`, opacity: o(at), boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ fontSize: 100, fontWeight: 900, color: f }}>{n}</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: f }}>{done ? "richtig" : now ? "jetzt" : "gleich"}</div>
          </div>
        );
      })}
      <K x={110} y={730} w={830} h={170} icon="target" t="Am Ende: Das übst du noch" f={C.orange} size={46} isize={80} a={o(word(0, "sag mir") - 0.2)} />
      <K x={980} y={730} w={830} h={170} icon="smile" t="Wie Vokabeln, mit einem Partner, der nie genervt ist" f={C.blue} size={40} isize={80} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 7 Erklär es zurück
const Zurueck = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Erklär es zurück" tiefe={["repeat", 1500, 640, 800]}>
      <Figur x={110} y={250} s={130} f={C.blue} a={o(0.4)} />
      <Bubble x={270} y={235} w={1540} h={160} me t="Kürzen heißt: Oben und unten durch dieselbe Zahl teilen." a={o(0.5)} size={46} />
      <Figur x={110} y={440} s={130} f={C.orange} icon="bot" a={o(word(0, "frag") - 0.6)} />
      <Bubble x={270} y={425} w={1540} h={150} a={o(word(0, "frag") - 0.4)} size={46}>Stimmt. Es fehlt noch ein Beispiel.</Bubble>
      <K x={110} y={660} w={830} h={200} icon="cap" t="Wer es erklären kann, hat es verstanden" f={C.green} size={44} isize={90} a={o(cue(1))} />
      <K x={980} y={660} w={830} h={200} icon="search" t="Du merkst sofort, wo es hakt" f={C.orange} size={44} isize={90} a={o(cue(1) + 1.6)} />
    </Szene>
  );
};

// ---------- 8 Nachhaken
const Nachhaken = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const Z = [["Prompt", "message", C.blue, 110, 250], ["Antwort", "bot", C.orange, 560, 250], ["Korrektur", "edit", C.red, 560, 500], ["Besserer Prompt", "sparkles", C.green, 110, 500]];
  return (
    <Szene titel="Nachhaken" tiefe={["repeat", 1500, 640, 800]}>
      {Z.map(([n, ic, f, x, y], i) => <K key={n} x={x} y={y} w={400} h={190} icon={ic} t={n} f={f} size={40} isize={70} a={o(0.4 + i * 0.9)} />)}
      <Pf x1={520} y1={345} x2={550} y2={345} p={ease(t, 1.0, 1.4)} f={C.mute} w={6} />
      <Pf x1={760} y1={450} x2={760} y2={490} p={ease(t, 1.9, 2.3)} f={C.mute} w={6} />
      <Pf x1={550} y1={595} x2={520} y2={595} p={ease(t, 2.8, 3.2)} f={C.mute} w={6} />
      <Pf x1={310} y1={490} x2={310} y2={450} p={ease(t, 3.5, 3.9)} f={C.mute} w={6} />
      <Bubble x={1020} y={250} w={790} h={170} t="Zu schwer. Noch ein Beispiel bitte." me a={o(word(0, "Sag"))} size={46} />
      <Bubble x={1020} y={500} w={790} h={170} t="Frag mich, wenn dir etwas fehlt." me f={C.orange} a={o(word(1, "Sag"))} size={46} />
      <Lbl x={110} y={800} w={1700} t="Der erste Versuch ist selten perfekt. Das ist normal." size={46} weight={700} align="center" color={C.mute} a={o(cue(0) + 3.0)} />
    </Szene>
  );
};

// ---------- 9 Prüfen und schützen
const Pruefen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Prüfen und schützen" tiefe={["shield", 1500, 640, 800]}>
      <Panel x={110} y={235} w={840} h={640} a={o(0.3)} rand={C.blue} />
      <Lbl x={110} y={262} w={840} t="Prüfen" size={56} weight={800} align="center" color={C.blue} a={o(0.4)} />
      <Skel x={160} y={380} w={740} n={5} gap={56} h={22} mark={[1, 3]} hl={C.orange} a={o(0.6)} />
      <div style={{ position: "absolute", left: 590, top: 540, opacity: o(word(0, "Zahlen")) }}><Ic name="search" size={230} color={C.orange} sw={1.4} /></div>
      <Lbl x={110} y={770} w={840} t="Zahlen und Quellen" size={46} weight={700} align="center" color={C.mute} a={o(word(0, "Zahlen"))} />
      <Panel x={980} y={235} w={830} h={640} a={o(cue(1) - 0.2)} rand={C.red} />
      <Lbl x={980} y={262} w={830} t="Bleibt draußen" size={56} weight={800} align="center" color={C.red} a={o(cue(1))} />
      {[["Namen", "user"], ["Adressen", "pin"], ["Privates", "eyeOff"]].map(([n, ic], i) => (
        <div key={n} style={{ position: "absolute", left: 1040, top: 370 + i * 150, width: 710, height: 120, borderRadius: 24, background: C.red + "18", border: `3px solid ${C.red}`, display: "flex", alignItems: "center", gap: 28, padding: "0 30px", boxSizing: "border-box", fontSize: 50, fontWeight: 800, opacity: o(cue(1) + 0.3 + i * 0.5) }}>
          <Ic name={ic} size={70} color={C.red} sw={1.6} />{n}
        </div>
      ))}
    </Szene>
  );
};

// ---------- 10 Deine Vorlage
const Vorlage = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const Z = [["Ich bin in Klasse ", "acht", 0.5], ["Ich will ", "Brüche kürzen", 1.5], ["Erkläre es in ", "drei Schritten", 2.5], ["Dann frag mich ", "fünfmal ab", 3.5]];
  return (
    <Szene titel="Deine Vorlage" tiefe={["file", 1500, 640, 800]}>
      <Panel x={110} y={235} w={1700} h={560} a={o(0.3)} rand={C.blue} />
      {Z.map(([a, b, at], i) => (
        <div key={a} style={{ position: "absolute", left: 170, top: 280 + i * 125, fontSize: 62, fontWeight: 700, opacity: o(at), display: "flex", alignItems: "baseline", gap: 18 }}>
          {a}<span style={{ color: C.orange, borderBottom: `6px solid ${C.orange}`, padding: "0 14px", fontWeight: 800 }}><Tipp text={b} p={lin(t, at + 0.4, at + 1.3)} /></span>
        </div>
      ))}
      <K x={110} y={830} w={1700} h={120} icon="repeat" t="Probier sie aus und verbessere sie, bis sie zu dir passt." f={C.green} size={48} isize={80} a={o(cue(1))} />
    </Szene>
  );
};

export default { textwand: Textwand, raten: Raten, rolle: Rolle, aufgabe: Aufgabe, hinweis: Hinweis, abfragen: Abfragen, zurueck: Zurueck, nachhaken: Nachhaken, pruefen: Pruefen, vorlage: Vorlage };
