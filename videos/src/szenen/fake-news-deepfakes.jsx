import React from "react";
import { Szene, useCues, sp, ease, lerp, lin, rnd, C } from "../lib.jsx";
import { Panel, Lbl, Lin } from "../bausteine.jsx";
import { Mark, Etikett, Pf, Zettel } from "../neu.jsx";
import { Ic, K, Bubble, Num, Stempel, Handy, Figur, Quer } from "../bausteine-schule.jsx";

// Klangwelle aus Balken (lebt mit der Zeit)
const Welle = ({ x, y, w, h, n = 18, f = C.blue, t = 0, a = 1, seed = 1, ruhig }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a }}>
    {Array.from({ length: n }).map((_, i) => {
      const bh = h * (0.2 + rnd(i * 1.7 + seed) * 0.8) * (ruhig ? 1 : 0.75 + 0.25 * Math.sin(t * 6 + i));
      return <div key={i} style={{ position: "absolute", left: i * (w / n), top: (h - bh) / 2, width: (w / n) * 0.62, height: bh, borderRadius: 6, background: f }} />;
    })}
  </div>
);

// ---------- 1 Die Sprachnachricht
const Stimme = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Die Sprachnachricht" tiefe={["mic", 1500, 640, 800]}>
      <Handy x={110} y={235} w={560} h={720} a={o(0.3)}>
        <div style={{ position: "absolute", left: 30, top: 60, display: "flex", alignItems: "center", gap: 20 }}><Ic name="user" size={64} color={C.blue} />
          <div style={{ fontSize: 44, fontWeight: 800 }}>Bruder</div></div>
        <div style={{ position: "absolute", left: 30, top: 200, width: 480, height: 150, borderRadius: 30, background: C.panel2, border: `3px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 24px", boxSizing: "border-box", opacity: o(0.6) }}>
          <Ic name="mic" size={64} color={C.blue} />
          <Welle x={110} y={40} w={340} h={70} n={14} t={t} f={C.blue} a={o(0.6)} />
        </div>
        <div style={{ position: "absolute", left: 30, top: 400, width: 480, fontSize: 50, fontWeight: 700, lineHeight: 1.15, opacity: o(word(0, "bittet")) }}>„Überweis mir schnell Geld!“</div>
      </Handy>
      <Panel x={760} y={235} w={1050} h={460} a={o(cue(1) - 0.2)} rand={C.orange} />
      <Lbl x={760} y={262} w={1050} t="Was wirklich passiert ist" size={44} weight={800} align="center" color={C.orange} a={o(cue(1))} />
      <Welle x={800} y={400} w={220} h={120} n={9} f={C.blue} ruhig a={o(cue(1) + 0.3)} seed={4} />
      <Lbl x={790} y={540} w={260} t="Kurze Probe" size={38} align="center" color={C.mute} a={o(cue(1) + 0.3)} />
      <Pf x1={1040} y1={460} x2={1120} y2={460} p={ease(t, cue(1) + 0.8, cue(1) + 1.3)} f={C.mute} w={7} />
      <div style={{ position: "absolute", left: 1140, top: 380, opacity: o(cue(1) + 1.2) }}><Ic name="sparkles" size={170} color={C.orange} sw={1.5} /></div>
      <Lbl x={1100} y={570} w={250} t="KI" size={48} weight={800} align="center" color={C.orange} a={o(cue(1) + 1.2)} />
      <Pf x1={1350} y1={460} x2={1430} y2={460} p={ease(t, cue(1) + 1.8, cue(1) + 2.3)} f={C.mute} w={7} />
      <Welle x={1450} y={400} w={310} h={120} n={13} f={C.red} t={t} a={o(cue(1) + 2.2)} seed={9} />
      <Lbl x={1440} y={540} w={330} t="Nachgebaut" size={38} align="center" color={C.red} a={o(cue(1) + 2.2)} />
      <Etikett x={760} y={760} t="Klingt echt. Ist es nicht." f={C.red} size={60} a={o(cue(1) + 3.0)} />
    </Szene>
  );
};

// ---------- 2 Zwei Begriffe
const Begriffe = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Zwei Begriffe" tiefe={["news", 1500, 640, 800]}>
      <K x={110} y={250} w={830} h={420} v icon="help" t="Falschinformation" sub="Falsch, aus Versehen weitergegeben" f={C.blue} size={56} isize={120} a={o(0.4)} />
      <K x={980} y={250} w={830} h={420} v icon="target" t="Desinformation" sub="Falsch, mit Absicht verbreitet" f={C.red} size={56} isize={120} a={o(cue(1) - 0.1)} />
      <Etikett x={720} y={700} t="Alltagsname: Fake News" f={C.orange} size={56} a={o(word(1, "Fake News"))} />
      <K x={110} y={800} w={1700} h={130} icon="send" t="Wer teilt, macht mit, auch ohne Absicht." f={C.green} size={52} isize={84} a={o(cue(2))} />
    </Szene>
  );
};

// ---------- 3 Warum jemand das tut
const Warum = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const W = [["coin", "Geld mit Klicks", C.green, "Geld"], ["megaphone", "Meinung machen", C.blue, "Meinung"], ["smile", "Spaß", C.orange, "lustig"]];
  const z = Math.round(lin(t, cue(1), cue(1) + 3, 12, 980));
  return (
    <Szene titel="Warum jemand das tut" tiefe={["megaphone", 1500, 640, 800]}>
      {W.map(([ic, n, f, key], i) => (
        <K key={n} x={110 + i * 590} y={240} w={540} h={380} v icon={ic} t={n} f={f} size={50} isize={130} a={o(word(0, key) - 0.2)} />
      ))}
      <Panel x={110} y={680} w={1000} h={230} a={o(cue(1))} />
      <Lbl x={150} y={705} w={900} t="Geteilt" size={42} color={C.mute} a={o(cue(1))} />
      <div style={{ position: "absolute", left: 150, top: 770, fontSize: 100, fontWeight: 800, color: C.green, opacity: o(cue(1)) }}>{z}</div>
      <div style={{ position: "absolute", left: 460, top: 800, width: 600, height: 36, borderRadius: 18, background: "#48484a", opacity: o(cue(1)) }}><div style={{ width: `${lin(t, cue(1), cue(1) + 3, 2, 100)}%`, height: 36, borderRadius: 18, background: C.green }} /></div>
      <K x={1150} y={680} w={660} h={230} icon="send" t="Ob es stimmt, ist oft egal" f={C.red} size={46} isize={90} a={o(cue(1) + 1.2)} />
    </Szene>
  );
};

// ---------- 4 Was ist ein Deepfake?
const Deepfake = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const Reihe = ({ y, titel, a, kind }) => (
    <>
      <Panel x={110} y={y} w={1700} h={340} a={a} />
      <Lbl x={150} y={y + 24} w={500} t={titel} size={44} weight={800} color={C.mute} a={a} />
      {kind === "bild" ? (
        <>
          <Figur x={300} y={y + 100} s={200} f={C.blue} a={a} />
          <Lbl x={240} y={y + 305} w={320} t="Echt" size={34} align="center" color={C.mute} a={a} style={{ top: y + 303 }} />
        </>
      ) : <Welle x={260} y={y + 110} w={260} h={140} n={11} f={C.blue} ruhig a={a} seed={4} />}
    </>
  );
  const a1 = o(0.4), a2 = o(cue(1) - 0.1);
  return (
    <Szene titel="Was ist ein Deepfake?" tiefe={["image", 1500, 640, 800]}>
      <Reihe y={235} titel="Bild und Video" a={a1} kind="bild" />
      <Pf x1={560} y1={400} x2={700} y2={400} p={ease(t, 1.0, 1.6)} f={C.mute} w={8} />
      <div style={{ position: "absolute", left: 740, top: 320, opacity: o(1.2) }}><Ic name="sparkles" size={170} color={C.orange} sw={1.5} /></div>
      <Pf x1={950} y1={400} x2={1090} y2={400} p={ease(t, 1.8, 2.4)} f={C.mute} w={8} />
      <Figur x={1150} y={335} s={200} f={C.red} a={o(2.0)} icon="smile" />
      <Lbl x={1110} y={545} w={280} t="Deepfake" size={40} weight={800} align="center" color={C.red} a={o(2.2)} />
      <Reihe y={600} titel="Stimme" a={a2} kind="ton" />
      <Pf x1={560} y1={770} x2={700} y2={770} p={ease(t, cue(1) + 0.8, cue(1) + 1.4)} f={C.mute} w={8} />
      <div style={{ position: "absolute", left: 740, top: 690, opacity: o(cue(1) + 1.0) }}><Ic name="sparkles" size={170} color={C.orange} sw={1.5} /></div>
      <Pf x1={950} y1={770} x2={1090} y2={770} p={ease(t, cue(1) + 1.6, cue(1) + 2.2)} f={C.mute} w={8} />
      <Welle x={1130} y={700} w={260} h={140} n={11} f={C.red} t={t} a={o(cue(1) + 1.8)} seed={9} />
      <Etikett x={1130} y={868} t="Wenige Sekunden Aufnahme reichen" f={C.orange} size={36} a={o(word(1, "wenige"))} />
    </Szene>
  );
};

// ---------- 5 Spaß oder Schaden
const Spass = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const ang = ease(t, cue(1) + 0.4, cue(1) + 1.6, -4, 11);
  return (
    <Szene titel="Spaß oder Schaden" tiefe={["scale", 1500, 640, 800]}>
      <K x={110} y={270} w={620} h={340} v icon="smile" t="Gekennzeichneter Witz" sub="Film mit Spezialeffekten" f={C.green} size={46} isize={110} a={o(0.5)} />
      <div style={{ position: "absolute", left: 760, top: 300, opacity: o(0.8), transform: `rotate(${ang}deg)`, transformOrigin: "50% 50%" }}><Ic name="scale" size={400} color={C.mute} sw={1.2} /></div>
      <K x={1190} y={270} w={620} h={340} v icon="alert" t="Sieht echt aus" sub="Jemand sagt, was er nie gesagt hat" f={C.red} size={46} isize={110} a={o(cue(0) + 3.0)} />
      <Etikett x={110} y={700} t="Harmlos" f={C.green} size={56} a={o(0.8)} />
      <Etikett x={1190} y={700} t="Schwierig" f={C.red} size={56} a={o(cue(1) + 0.4)} />
      <Lbl x={110} y={830} w={1700} t="Entscheidend: Soll es echt wirken und jemanden täuschen?" size={46} weight={700} align="center" color={C.mute} a={o(cue(1) + 1.4)} />
    </Szene>
  );
};

// ---------- 6 So prüfst du
const Pruefen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="So prüfst du" tiefe={["search", 1500, 640, 800]}>
      <K x={110} y={250} w={540} h={420} v icon="user" t="Passt das zu dieser Person?" f={C.blue} size={44} isize={110} a={o(word(0, "Erstens"))} />
      <Num n={1} size={70} f={C.blue} a={o(word(0, "Erstens"))} style={{ position: "absolute", left: 125, top: 265 }} />
      <K x={690} y={250} w={540} h={420} v icon="news" t="Berichten seriöse Quellen?" f={C.green} size={44} isize={110} a={o(word(0, "Zweitens"))} />
      <Num n={2} size={70} f={C.green} a={o(word(0, "Zweitens"))} style={{ position: "absolute", left: 705, top: 265 }} />
      <K x={1270} y={250} w={540} h={420} v icon="phone" t="Ruf zurück" f={C.orange} size={50} isize={110} a={o(word(1, "Drittens"))} />
      <Num n={3} size={70} f={C.orange} a={o(word(1, "Drittens"))} style={{ position: "absolute", left: 1285, top: 265 }} />
      <K x={110} y={730} w={1700} h={170} icon="phone" t="Mit der Nummer, die du schon kennst. Nicht mit der aus der Nachricht." f={C.orange} size={46} isize={90} a={o(cue(1) + 1.8)} />
    </Szene>
  );
};

// ---------- 7 Das Codewort
const Codewort = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Das Codewort" tiefe={["lock", 1500, 640, 800]}>
      <Panel x={110} y={235} w={1000} h={640} a={o(0.3)} rand={C.green} />
      <Figur x={170} y={300} s={190} f={C.blue} icon="users" a={o(0.5)} />
      <Lbl x={140} y={505} w={250} t="Familie" size={42} weight={800} align="center" a={o(0.5)} />
      <Figur x={870} y={300} s={190} f={C.orange} icon="users" a={o(0.8)} />
      <Lbl x={840} y={505} w={250} t="Freunde" size={42} weight={800} align="center" a={o(0.8)} />
      <div style={{ position: "absolute", left: 500, top: 310, opacity: o(1.1) }}><Ic name="lock" size={170} color={C.green} sw={1.5} /></div>
      <Bubble x={250} y={640} w={700} h={140} t="Pizza-Salami" me f={C.green} size={72} a={o(1.6)} />
      <Lbl x={110} y={800} w={1000} t="Kennt nur ihr. Darf albern sein." size={42} color={C.mute} align="center" a={o(1.9)} />
      <Panel x={1150} y={235} w={660} h={640} a={o(cue(1))} rand={C.red} />
      <Zettel x={1220} y={340} w={520} h={170} rot={-3} a={o(word(1, "Hundename"))} style={{ fontSize: 76, display: "flex", alignItems: "center", justifyContent: "center" }}>Bello</Zettel>
      <Quer x={1210} y={330} w={540} h={190} a={o(word(1, "Hundename") + 0.8)} />
      <Lbl x={1150} y={600} w={660} t="Hundename" size={50} weight={800} align="center" color={C.red} a={o(word(1, "Hundename") + 0.3)} />
      <Lbl x={1150} y={690} w={660} t="Zu leicht zu erraten" size={44} align="center" color={C.mute} a={o(word(1, "Hundename") + 0.6)} />
    </Szene>
  );
};

// ---------- 8 Teilen ist Mitmachen
const Teilen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const N1 = [[560, 330], [560, 560], [560, 790]];
  const N2 = [[800, 280], [800, 380], [800, 510], [800, 610], [800, 740], [800, 840]];
  return (
    <Szene titel="Teilen ist Mitmachen" tiefe={["send", 1500, 640, 800]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {N1.map(([x, y], i) => <line key={i} x1="260" y1="560" x2={x} y2={y} stroke={C.red} strokeWidth="5" opacity={o(0.9 + i * 0.3)} />)}
        {N2.map(([x, y], i) => { const p = N1[Math.floor(i / 2)]; return <line key={i} x1={p[0]} y1={p[1]} x2={x} y2={y} stroke={C.red} strokeWidth="4" opacity={o(2.0 + i * 0.15)} />; })}
      </svg>
      <Figur x={190} y={490} s={140} f={C.red} icon="send" a={o(0.5)} />
      {N1.map(([x, y], i) => <Figur key={i} x={x - 45} y={y - 45} s={90} f={C.red} a={o(0.9 + i * 0.3)} />)}
      {N2.map(([x, y], i) => <Figur key={i} x={x - 32} y={y - 32} s={64} f={C.red} a={o(2.0 + i * 0.15)} />)}
      <K x={1000} y={250} w={810} h={190} icon="alert" t="Fakes, die Menschen bloßstellen, sind kein Spaß" f={C.red} size={42} isize={80} a={o(cue(1))} />
      <K x={1000} y={470} w={810} h={150} icon="scale" t="Sie können strafbar sein" f={C.orange} size={46} isize={80} a={o(cue(1) + 1.6)} />
      <K x={1000} y={650} w={810} h={150} icon="heart" t="Sie können sehr weh tun" f={C.red} size={46} isize={80} a={o(word(1, "weh tun"))} />
      <Etikett x={1000} y={850} t="Nicht bauen. Nicht weiterschicken." f={C.green} size={46} a={o(cue(2))} />
    </Szene>
  );
};

// ---------- 9 Wenn es dich trifft
const Hilfe = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const L = [["camera", "Bildschirmfoto machen", C.blue, "Bildschirmfotos"], ["flag", "Inhalt melden", C.orange, "melde"], ["users", "Mit jemandem sprechen", C.green, "sprich"]];
  return (
    <Szene titel="Wenn es dich trifft" tiefe={["heart", 1500, 640, 800]}>
      {L.map(([ic, n, f, key], i) => (
        <K key={n} x={110 + i * 430} y={250} w={400} h={400} v icon={ic} t={n} f={f} size={42} isize={110} a={o(word(0, key) - 0.2)} />
      ))}
      <div style={{ position: "absolute", left: 1400, top: 250, width: 410, height: 400, borderRadius: 28, background: C.red + "18", border: `4px solid ${C.red}`, opacity: o(cue(1)), boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "0 16px", textAlign: "center" }}>
        <Ic name="phone" size={100} color={C.red} sw={1.6} />
        <div style={{ fontSize: 40, fontWeight: 800 }}>Nummer gegen Kummer</div>
        <div style={{ fontSize: 76, fontWeight: 900, color: C.red, letterSpacing: 2 }}>116 111</div>
      </div>
      <K x={110} y={730} w={1700} h={140} icon="shield" t="Kostenlos und anonym, für Kinder und Jugendliche" f={C.green} size={50} isize={90} a={o(cue(1) + 1.8)} />
    </Szene>
  );
};

export default { stimme: Stimme, begriffe: Begriffe, warum: Warum, deepfake: Deepfake, spass: Spass, pruefen: Pruefen, codewort: Codewort, teilen: Teilen, hilfe: Hilfe };
