import React from "react";
import { Szene, useCues, sp, ease, lerp, lin, C } from "../lib.jsx";
import { Panel, Lbl, Skel } from "../bausteine.jsx";
import { Mark, Etikett, Pf } from "../neu.jsx";
import { Ic, K, Bubble, Num, Stempel, Fenster, Handy, Figur } from "../bausteine-schule.jsx";

// ---------- 1 Tausend Likes
const Likes = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const n = Math.round(lin(t, 0.8, 4.5, 0, 1000));
  return (
    <Szene titel="Tausend Likes" tiefe={["thumb", 1500, 640, 800]}>
      <Handy x={110} y={235} w={520} h={720} a={o(0.3)}>
        <div style={{ position: "absolute", left: 30, top: 60, width: 460, height: 230, borderRadius: 20, background: C.red, color: "#fff", fontSize: 44, fontWeight: 900, lineHeight: 1.05, padding: 22, boxSizing: "border-box", display: "flex", alignItems: "center" }}>UNGLAUBLICH!!! Das sagt dir keiner</div>
        <Skel x={34} y={330} w={450} n={4} gap={44} h={20} a={o(0.6)} />
        <div style={{ position: "absolute", left: 30, top: 560, display: "flex", alignItems: "center", gap: 18, fontSize: 52, fontWeight: 800, color: C.blue }}><Ic name="thumb" size={80} color={C.blue} />{n}</div>
      </Handy>
      {[["Habt ihr das gesehen??", 0, 0.9], ["Krass, schickt es weiter!", 1, 1.7], ["Hab ich auch bekommen", 0, 2.5]].map(([x, me, at], i) => (
        <React.Fragment key={x}>
          <Figur x={700} y={265 + i * 165} s={110} f={[C.green, C.orange, C.blue][i]} a={o(at)} />
          <Bubble x={840} y={265 + i * 165} w={820} h={110} t={x} a={o(at)} size={46} />
        </React.Fragment>
      ))}
      <Etikett x={700} y={780} t="Likes sind kein Beweis" f={C.red} size={64} a={o(cue(1))} />
      <Lbl x={700} y={885} w={1100} t="Auch Unsinn wird tausendmal geteilt." size={46} color={C.mute} a={o(cue(1) + 1.6)} />
    </Szene>
  );
};

// ---------- 2 Schritt 1: Stopp
const Stopp = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Schritt 1: Stopp" tiefe={["stop", 1500, 640, 800]}>
      <K x={110} y={250} w={650} h={170} icon="send" t="Teilen" f={C.blue} size={60} isize={100} a={o(0.4)} />
      <Pf x1={435} y1={430} x2={435} y2={500} p={ease(t, 1.0, 1.6)} f={C.red} w={8} />
      <div style={{ position: "absolute", left: 285, top: 520, opacity: o(1.4), transform: `scale(${lerp(0.7, 1, o(1.4))})` }}><Ic name="stop" size={300} color={C.red} sw={1.4} /></div>
      <Lbl x={110} y={830} w={650} t="Einmal durchatmen" size={52} weight={800} align="center" color={C.red} a={o(1.8)} />
      <K x={900} y={250} w={910} h={150} icon="frown" t="Wütend" f={C.red} size={54} isize={90} a={o(cue(1) + 0.2)} />
      <K x={900} y={430} w={910} h={150} icon="help" t="Neugierig" f={C.orange} size={54} isize={90} a={o(cue(1) + 1.1)} />
      <Pf x1={1355} y1={590} x2={1355} y2={660} p={ease(t, cue(1) + 2.0, cue(1) + 2.6)} f={C.mute} w={8} />
      <K x={900} y={680} w={910} h={170} icon="repeat" t="Wird besonders oft geteilt" f={C.green} size={52} isize={90} a={o(cue(1) + 2.4)} />
      <Lbl x={900} y={880} w={910} t="Manche Beiträge sind genau dafür gebaut." size={40} color={C.mute} a={o(word(1, "Manche"))} />
    </Szene>
  );
};

// ---------- 3 Schritt 2: Wer steckt dahinter?
const Wer = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const m = o(cue(1));
  return (
    <Szene titel="Schritt 2: Wer steckt dahinter?" tiefe={["userCheck", 1500, 640, 800]}>
      <Fenster x={110} y={250} w={1000} h={640} url="meldung.example" a={o(0.3)}>
        <div style={{ margin: "30px 36px", fontSize: 54, fontWeight: 800, lineHeight: 1.1 }}>Große Überschrift der Meldung</div>
        <Skel x={36} y={150} w={920} n={6} gap={50} h={22} a={o(0.6)} />
        <div style={{ position: "absolute", left: 0, top: 470, width: 1000, height: 100, borderTop: `3px solid ${C.line}`, display: "flex", gap: 60, padding: "26px 36px", boxSizing: "border-box", fontSize: 40, color: C.mute }}>
          <span>Kontakt</span>
          <span style={{ color: m > 0.2 ? C.orange : C.mute, fontWeight: 800, border: m > 0.2 ? `4px solid ${C.orange}` : "4px solid transparent", borderRadius: 14, padding: "0 16px", marginTop: -8, lineHeight: "60px" }}>Impressum</span>
          <span>Datenschutz</span>
        </div>
      </Fenster>
      <K x={1150} y={250} w={660} h={190} icon="userCheck" t="Name und Adresse" sub="steht im Impressum" f={C.green} size={50} isize={90} a={o(cue(1) + 0.3)} />
      <K x={1150} y={470} w={660} h={190} icon="calendar" t="Konto: seit wann?" sub="Was zeigt es sonst?" f={C.blue} size={50} isize={90} a={o(cue(1) + 1.6)} />
      <K x={1150} y={700} w={660} h={190} icon="alert" t="Fehlt es ganz?" sub="Dann sei misstrauisch" f={C.red} size={50} isize={90} a={o(word(1, "Fehlt"))} />
    </Szene>
  );
};

// ---------- 4 Schritt 3: Seitlich lesen
const Seitlich = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Schritt 3: Seitlich lesen" tiefe={["search", 1500, 640, 800]}>
      <Fenster x={110} y={260} w={720} h={560} url="meldung.example" a={o(0.3)}>
        <div style={{ margin: "26px 30px", fontSize: 46, fontWeight: 800 }}>Die Meldung</div>
        <Skel x={30} y={110} w={640} n={5} gap={50} h={20} a={o(0.5)} />
      </Fenster>
      <Lbl x={110} y={850} w={720} t="Nicht nur hier bleiben" size={46} weight={800} align="center" color={C.mute} a={o(cue(0) + 1.0)} />
      <Pf x1={850} y1={540} x2={960} y2={440} p={ease(t, word(0, "Verlass"), word(0, "Verlass") + 0.6)} f={C.blue} w={8} />
      <Fenster x={980} y={235} w={830} h={320} url="Suche: Name der Quelle" a={o(word(0, "neuen Tab"))} f={C.blue}>
        <div style={{ position: "absolute", left: 36, top: 40, display: "flex", alignItems: "center", gap: 24 }}><Ic name="search" size={80} color={C.blue} /><div style={{ fontSize: 50, fontWeight: 800 }}>Wer steckt dahinter?</div></div>
        <Skel x={36} y={140} w={740} n={3} gap={40} h={18} a={o(cue(0) + 3.4)} />
      </Fenster>
      <K x={980} y={600} w={830} h={200} icon="users" t="Was sagen andere über sie?" f={C.green} size={50} isize={90} a={o(cue(1) + 0.3)} />
      <Etikett x={980} y={850} t="So arbeiten Profis" f={C.orange} size={52} a={o(cue(1) + 2.0)} />
    </Szene>
  );
};

// ---------- 5 Schritt 4: Zweite Quelle
const Zweite = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const Q = [["news", "Zeitung"], ["school", "Behörde"], ["globe", "Nachrichtenagentur"]];
  return (
    <Szene titel="Schritt 4: Zweite Quelle" tiefe={["copy", 1500, 640, 800]}>
      <K x={560} y={250} w={800} h={160} icon="megaphone" t="Die Aussage" f={C.orange} size={58} isize={90} a={o(0.4)} />
      {Q.map(([ic, n], i) => (
        <React.Fragment key={n}>
          <Pf x1={380 + i * 585} y1={500} x2={i === 1 ? 960 : i === 0 ? 700 : 1220} y2={425} p={ease(t, cue(0) + 0.8 + i * 0.8, cue(0) + 1.4 + i * 0.8)} f={C.green} w={6} />
          <K x={110 + i * 585} y={500} w={540} h={250} v icon={ic} t={n} f={C.green} size={44} isize={96} a={o(cue(0) + 0.6 + i * 0.8)} />
          <div style={{ position: "absolute", left: 110 + i * 585 + 440, top: 515, opacity: o(cue(0) + 1.2 + i * 0.8) }}><Mark ok size={70} a={o(cue(0) + 1.2 + i * 0.8)} /></div>
        </React.Fragment>
      ))}
      <K x={110} y={790} w={1700} h={130} icon="alert" t="Nur eine einzige Seite hat die große Neuigkeit? Warnzeichen." f={C.red} size={46} isize={80} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 6 Schritt 5: Zum Original
const Original = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const S = ["Studie: Sport hilft leicht", "Sport hilft", "Sport heilt alles!", "Ärzte hassen Sport"];
  return (
    <Szene titel="Schritt 5: Zum Original" tiefe={["file", 1500, 640, 800]}>
      {S.map((x, i) => {
        const at = 0.5 + i * 1.3;
        return (
          <React.Fragment key={x}>
            <Figur x={140 + i * 440} y={470} s={140} f={[C.green, C.blue, C.orange, C.red][i]} a={o(at)} />
            <Bubble x={110 + i * 440} y={250} w={400} h={170} t={x} a={o(at)} size={40} f={[C.green, C.blue, C.orange, C.red][i]} me />
            {i < 3 && <Pf x1={300 + i * 440} y1={540} x2={560 + i * 440} y2={540} p={ease(t, at + 0.6, at + 1.2)} f={C.mute} w={6} />}
          </React.Fragment>
        );
      })}
      <Lbl x={110} y={650} w={1700} t="Stille Post: Die Studie wird unterwegs verdreht" size={46} weight={700} align="center" color={C.mute} a={o(word(0, "Stille"))} />
      <K x={110} y={760} w={1700} h={170} icon="paper" t="Such die Studie selbst. Steht dort wirklich, was behauptet wird? Wer hat sie bezahlt?" f={C.green} size={44} isize={90} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 7 Probelauf
const Probe = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const R = [["stop", C.orange, "Stopp: klingt zu schön", word(1, "Stopp")], ["x", C.red, "Wer? Seite ohne Impressum", word(1, "Wer steckt")], ["x", C.red, "Seitlich: niemand kennt sie", word(1, "Seitlich")], ["x", C.red, "Zweite Quelle: keine", word(2, "Zweite")], ["x", C.red, "Original: keine Studie", word(2, "Original")]];
  return (
    <Szene titel="Probelauf" tiefe={["check", 1500, 640, 800]}>
      <Panel x={110} y={235} w={700} h={660} a={o(0.3)} rand={C.orange} />
      <Lbl x={150} y={270} w={620} t="NEUE STUDIE" size={42} weight={800} color={C.orange} a={o(0.4)} />
      <div style={{ position: "absolute", left: 150, top: 350, width: 620, fontSize: 58, fontWeight: 800, lineHeight: 1.15, opacity: o(0.5) }}>Schüler mit blauen Stiften schreiben bessere Noten</div>
      <div style={{ position: "absolute", left: 150, top: 700, opacity: o(0.7) }}><Ic name="edit" size={130} color={C.blue} sw={1.4} /></div>
      <Stempel x={190} y={760} t="ERFUNDEN" size={84} a={o(word(2, "Ergebnis"))} rot={-9} />
      {R.map(([ic, f, n, at], i) => (
        <div key={n} style={{ position: "absolute", left: 860, top: 235 + i * 134, width: 950, height: 116, borderRadius: 24, background: f + "18", border: `4px solid ${f}`, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 26, padding: "0 28px", fontSize: 46, fontWeight: 800, opacity: o(at), transform: `translateX(${(1 - o(at)) * 50}px)` }}>
          <Ic name={ic} size={72} color={f} sw={2.2} />{n}
        </div>
      ))}
    </Szene>
  );
};

// ---------- 8 Und die KI?
const Ki = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Und die KI?" tiefe={["bot", 1500, 640, 800]}>
      <Panel x={110} y={235} w={1000} h={500} a={o(0.3)} />
      <Bubble x={480} y={270} w={600} h={110} me t="Gib mir einen Beleg dafür" a={o(0.5)} size={44} />
      <Bubble x={140} y={420} w={940} h={130} a={o(cue(1) - 0.2)} size={44}><Ic name="bot" size={70} color={C.red} /><span style={{ marginLeft: 20 }}>Hier: studie-blaue-stifte.example</span></Bubble>
      <Lbl x={140} y={600} w={940} t="Ein Chatbot setzt passende Wörter fort." size={42} color={C.mute} a={o(cue(0) + 1.0)} />
      <Pf x1={1120} y1={485} x2={1190} y2={485} p={ease(t, cue(1) + 0.6, cue(1) + 1.2)} f={C.red} w={7} />
      <Fenster x={1200} y={235} w={610} h={500} url="studie-blaue-stifte.example" a={o(cue(1) + 0.8)} f={C.red}>
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <div style={{ fontSize: 150, fontWeight: 900, color: C.red }}>404</div>
          <div style={{ fontSize: 46, fontWeight: 700 }}>Seite nicht gefunden</div>
        </div>
      </Fenster>
      <div style={{ position: "absolute", left: 1470, top: 770, opacity: o(cue(1) + 2.0) }}><Mark ok={false} size={100} a={o(cue(1) + 2.0)} /></div>
      <Lbl x={1200} y={880} w={610} t="Erfunden" size={52} weight={800} color={C.red} align="center" a={o(cue(1) + 2.2)} />
      <K x={110} y={790} w={1000} h={130} icon="bulb" t="Gut für Ideen, was du prüfen kannst" f={C.green} size={44} isize={80} a={o(cue(2))} />
    </Szene>
  );
};

// ---------- 9 Dein Merksatz
const Merk = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const L = [["stop", "Stopp", C.red, "Stopp"], ["userCheck", "Wer?", C.blue, "wer"], ["search", "Seitlich", C.orange, "seitlich"], ["copy", "Zweite Quelle", C.green, "zweite"], ["paper", "Original", "#bf5af2", "Original"]];
  return (
    <Szene titel="Dein Merksatz" tiefe={["badge", 1500, 640, 800]}>
      {L.map(([ic, n, f, key], i) => {
        const at = word(0, key) - 0.2;
        return (
          <div key={n} style={{ position: "absolute", left: 110 + i * 345, top: 235, width: 325, height: 400, borderRadius: 28, background: f + "18", border: `4px solid ${f}`, opacity: o(at), boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "0 12px", textAlign: "center", transform: `translateY(${(1 - o(at)) * 28}px)` }}>
            <Num n={i + 1} size={64} f={f} />
            <Ic name={ic} size={120} color={f} sw={1.5} />
            <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1 }}>{n}</div>
          </div>
        );
      })}
      <K x={110} y={670} w={1700} h={120} icon="userCheck" t="Ein paar Minuten, und du bist der Profi im Freundeskreis." f={C.blue} size={46} isize={76} a={o(cue(1))} />
      <K x={110} y={815} w={1700} h={120} icon="stop" t="Nichts gefunden? Dann nicht teilen." f={C.green} size={46} isize={76} a={o(cue(2))} />
    </Szene>
  );
};

export default { likes: Likes, stopp: Stopp, wer: Wer, seitlich: Seitlich, zweite: Zweite, original: Original, probe: Probe, ki: Ki, merken: Merk };
