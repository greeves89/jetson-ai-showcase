import React from "react";
import { Szene, useCues, sp, ease, lerp, lin, C } from "../lib.jsx";
import { Panel, Lbl } from "../bausteine.jsx";
import { Mark, Etikett, Pf } from "../neu.jsx";
import { Ic, K, Bubble, Foto, Schalter, Figur, Quer } from "../bausteine-schule.jsx";

// ---------- 1 Was weiß das Netz?
const Profil = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const L = [["user", "Name", "Name", 110, 250], ["pin", "Wohnort", "Wohnort", 110, 430], ["image", "Fotos", "Fotos", 110, 610], ["mic", "Stimme", "Stimme", 1250, 250], ["wave", "Musik", "hörst", 1250, 430], ["clock", "Wann du wo bist", "wann", 1250, 610]];
  return (
    <Szene titel="Was weiß das Netz?" tiefe={["database", 1500, 640, 800]}>
      <Panel x={700} y={250} w={520} h={520} a={o(0.3)} rand={C.blue} />
      <Figur x={830} y={320} s={260} f={C.blue} a={o(0.4)} />
      <Lbl x={700} y={620} w={520} t="Dein Profil" size={54} weight={800} align="center" a={o(0.5)} />
      {L.map(([ic, n, key, x, y], i) => {
        const at = word(0, key) - 0.1;
        const links = x < 700;
        return (
          <React.Fragment key={n}>
            <K x={x} y={y} w={560} h={150} icon={ic} t={n} f={C.blue} size={46} isize={80} a={o(at)} />
            <Pf x1={links ? x + 565 : x - 5} y1={y + 75} x2={links ? 695 : 1225} y2={510} p={ease(t, at + 0.4, at + 0.9)} f={C.blue} w={5} />
          </React.Fragment>
        );
      })}
      <Etikett x={560} y={850} t="Vieles lieferst du selbst, nebenbei" f={C.orange} size={52} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 2 Bezahlen mit Daten
const Bezahlen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const kipp = ease(t, 2.0, 3.0, 0, 9);
  return (
    <Szene titel="Bezahlen mit Daten" tiefe={["coin", 1500, 640, 800]}>
      <Panel x={110} y={250} w={520} h={420} a={o(0.4)} />
      <div style={{ position: "absolute", left: 270, top: 290, opacity: o(0.5) }}><Ic name="phone" size={200} color={C.blue} sw={1.3} /></div>
      <Lbl x={110} y={530} w={520} t="App: 0 Euro" size={60} weight={800} align="center" color={C.blue} a={o(0.6)} />
      <div style={{ position: "absolute", left: 760, top: 290, opacity: o(1.8), transform: `rotate(${-kipp}deg)` }}><Ic name="scale" size={340} color={C.mute} sw={1.2} /></div>
      <K x={1190} y={250} w={620} h={420} v icon="database" t="Deine Daten" f={C.orange} size={58} isize={150} a={o(1.6)} />
      <K x={110} y={720} w={830} h={170} icon="target" t="Werbung, die zu dir passt" f={C.orange} size={46} isize={80} a={o(cue(1) + 0.4)} />
      <K x={980} y={720} w={830} h={170} icon="userCheck" t="Wissen und selbst entscheiden" f={C.green} size={46} isize={80} a={o(word(1, "Das ist nicht") - 0.2)} />
    </Szene>
  );
};

// ---------- 3 Das Foto verrät mehr
const FotoS = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const v = 1 - ease(t, cue(1) + 2.2, cue(1) + 3.0);
  const I = [["pin", "Aufnahmeort"], ["clock", "Uhrzeit"], ["phone", "Handymodell"]];
  return (
    <Szene titel="Das Foto verrät mehr" tiefe={["image", 1500, 640, 800]}>
      <Foto x={110} y={250} w={700} h={440} a={o(0.3)} />
      <Pf x1={830} y1={470} x2={900} y2={470} p={ease(t, 0.8, 1.3)} f={C.orange} w={8} />
      <Panel x={920} y={250} w={890} h={440} a={o(0.9)} rand={C.orange} />
      {I.map(([ic, n], i) => (
        <div key={n} style={{ position: "absolute", left: 960, top: 280 + i * 130, display: "flex", alignItems: "center", gap: 28, fontSize: 54, fontWeight: 800, opacity: o(word(0, ["Aufnahmeort", "Uhrzeit", "Handymodell"][i]) - 0.2) }}>
          <Ic name={ic} size={90} color={C.orange} sw={1.6} />{n}
        </div>
      ))}
      <Schalter x={920} y={760} w={890} h={130} icon="pin" t="Ortsangabe der Kamera" v={v} f={C.green} a={o(cue(1) + 1.4)} size={44} />
      <Lbl x={110} y={760} w={700} t="Manche Netzwerke entfernen es, andere nicht" size={40} color={C.mute} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 4 Das Netz vergisst wenig
const Alt = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const C2 = [[560, 290], [940, 580], [1360, 290]];
  return (
    <Szene titel="Das Netz vergisst wenig" tiefe={["clock", 1500, 640, 800]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        <line x1="130" y1="480" x2="1790" y2="480" stroke={C.line} strokeWidth="8" strokeLinecap="round" />
      </svg>
      <Foto x={130} y={330} w={260} h={170} a={o(0.4)} />
      <Lbl x={110} y={520} w={300} t="Heute" size={44} weight={800} align="center" a={o(0.5)} />
      <div style={{ position: "absolute", left: 1660, top: 330, opacity: o(0.6) }}><Ic name="calendar" size={100} color={C.mute} sw={1.4} /></div>
      <Lbl x={1580} y={450} w={260} t="in Jahren" size={44} weight={800} align="center" color={C.mute} a={o(0.6)} />
      {C2.map(([x, y], i) => (
        <React.Fragment key={i}>
          <Foto x={x} y={y} w={240} h={160} a={o(word(0, "speichern") + i * 0.6)} />
          <Pf x1={400} y1={415} x2={x - 10} y2={y + 80} p={ease(t, word(0, "speichern") + i * 0.6, word(0, "speichern") + 0.6 + i * 0.6)} f={C.orange} w={5} />
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: 120, top: 700, opacity: o(1.8) }}><Ic name="trash" size={150} color={C.mute} sw={1.4} /></div>
      <Lbl x={290} y={740} w={900} t="Löscht nicht alle Kopien" size={46} weight={700} color={C.mute} a={o(1.9)} />
      <Etikett x={290} y={850} t="Wäre mir das in fünf Jahren noch recht?" f={C.green} size={54} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 5 Fünf Minuten Einstellungen
const Einst = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const R = [["lock", "Profil auf privat", word(0, "Profil")], ["pin", "Standort nur, wenn die App läuft", word(0, "Standort")], ["camera", "Kamera und Mikrofon nur bei Bedarf", word(1, "Kamera")]];
  const at4 = word(1, "Taschenlampen");
  return (
    <Szene titel="Fünf Minuten Einstellungen" tiefe={["lock", 1500, 640, 800]}>
      {R.map(([ic, n, at], i) => (
        <Schalter key={n} x={110} y={240 + i * 150} w={1700} h={125} icon={ic} t={n} v={ease(t, at + 0.4, at + 1.0)} f={C.green} a={o(at)} size={50} />
      ))}
      <Schalter x={110} y={690} w={1700} h={125} icon="users" t="Taschenlampen-App: Zugriff auf Kontakte" v={1 - ease(t, at4 + 0.8, at4 + 1.4)} f={C.red} a={o(at4)} size={50} />
      <Lbl x={110} y={860} w={1700} t="Eine Taschenlampe braucht keine Kontakte." size={46} weight={700} align="center" color={C.mute} a={o(at4 + 0.6)} />
    </Szene>
  );
};

// ---------- 6 KI-Chats
const Chat = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const G = [["check", "Mathe-Aufgabe"], ["check", "Rezeptidee"]];
  const R = [["key", "Passwörter"], ["pin", "Adresse"], ["eyeOff", "Geheimnisse"], ["image", "Fotos von anderen"]];
  return (
    <Szene titel="KI-Chats" tiefe={["cloud", 1500, 640, 800]}>
      <K x={110} y={240} w={1700} h={120} icon="cloud" t="Je nach Anbieter und Einstellung kann gespeichert werden, was du tippst" f={C.orange} size={42} isize={76} a={o(0.4)} />
      <Lbl x={110} y={395} w={830} t="Unproblematisch" size={50} weight={800} color={C.green} align="center" a={o(cue(1))} />
      <Lbl x={980} y={395} w={830} t="Bleibt draußen" size={50} weight={800} color={C.red} align="center" a={o(word(1, "Passwörter") - 0.4)} />
      {G.map(([ic, n], i) => <K key={n} x={110} y={470 + i * 150} w={830} h={125} icon={ic} t={n} f={C.green} size={46} isize={70} a={o(cue(1) + 0.4 + i * 0.7)} />)}
      {R.map(([ic, n], i) => <K key={n} x={980} y={470 + i * 105} w={830} h={90} icon={ic} t={n} f={C.red} size={40} isize={56} a={o(word(1, ["Passwörter", "Adresse", "Geheimnisse", "Fotos"][i]))} />)}
    </Szene>
  );
};

// ---------- 7 Gute Passwörter
const Passwort = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const W = ["Tisch", "Wolke", "Gabel", "Mond"];
  return (
    <Szene titel="Gute Passwörter" tiefe={["key", 1500, 640, 800]}>
      <Panel x={110} y={250} w={640} h={290} a={o(0.4)} rand={C.red} />
      <Lbl x={110} y={272} w={640} t="Schwach" size={42} weight={800} align="center" color={C.red} a={o(0.4)} />
      <div style={{ position: "absolute", left: 140, top: 380, width: 580, fontSize: 80, fontWeight: 800, textAlign: "center", opacity: o(0.5) }}>Hund123</div>
      <Quer x={180} y={370} w={500} h={110} a={o(word(0, "Vier") - 0.5)} />
      <Panel x={800} y={250} w={1010} h={290} a={o(word(0, "Vier") - 0.2)} rand={C.green} />
      <Lbl x={800} y={272} w={1010} t="Stark: vier zufällige Wörter" size={42} weight={800} align="center" color={C.green} a={o(word(0, "Vier"))} />
      {W.map((w, i) => (
        <div key={w} style={{ position: "absolute", left: 830 + i * 245, top: 380, width: 225, height: 110, borderRadius: 20, background: C.green + "22", border: `3px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 800, opacity: o(word(0, "Vier") + 0.3 + i * 0.4) }}>{w}</div>
      ))}
      <K x={110} y={590} w={830} h={170} icon="key" t="Lang und nur für ein Konto" f={C.blue} size={48} isize={90} a={o(word(0, "lang"))} />
      <K x={980} y={590} w={830} h={170} icon="phone" t="Anmeldung in zwei Schritten" f={C.blue} size={48} isize={90} a={o(cue(1))} />
      <K x={110} y={800} w={1700} h={120} icon="shield" t="Dann reicht einem Dieb das Passwort allein nicht." f={C.green} size={48} isize={80} a={o(cue(1) + 2.0)} />
    </Szene>
  );
};

// ---------- 8 Deine Rechte
const Rechte = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Deine Rechte" tiefe={["scale", 1500, 640, 800]}>
      <Panel x={110} y={235} w={1000} h={650} a={o(0.3)} />
      <Bubble x={160} y={270} w={800} h={150} me t="Was habt ihr über mich gespeichert?" a={o(word(0, "Was habt"))} size={44} />
      <Bubble x={160} y={460} w={520} h={110} me t="Bitte löscht es." a={o(word(0, "löschen") - 0.4)} size={44} f={C.orange} />
      <Figur x={170} y={680} s={150} f={C.blue} a={o(0.4)} />
      <div style={{ position: "absolute", left: 820, top: 640, opacity: o(0.6) }}><Ic name="factory" size={220} color={C.mute} sw={1.3} /></div>
      <Pf x1={340} y1={760} x2={800} y2={760} p={ease(t, 1.0, 1.8)} f={C.blue} w={6} />
      <K x={1150} y={235} w={660} h={300} v icon="shield" t="Datenschutz-Grundverordnung" f={C.blue} size={46} isize={110} a={o(cue(1))} />
      <K x={1150} y={570} w={660} h={315} v icon="users" t="Unter 16: oft Zustimmung der Eltern nötig" f={C.orange} size={40} isize={100} a={o(word(1, "Für viele") - 0.1)} />
    </Szene>
  );
};

// ---------- 9 Und die anderen
const Andere = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Und die anderen" tiefe={["users", 1500, 640, 800]}>
      <Panel x={110} y={235} w={1000} h={650} a={o(0.3)} rand={C.mute} />
      {[0, 1, 2].map((i) => <Figur key={i} x={190 + i * 280} y={420} s={200} f={[C.blue, C.orange, C.green][i]} a={o(0.5 + i * 0.3)} />)}
      <Bubble x={470} y={260} w={420} h={110} t="Frag mich!" me f={C.orange} a={o(word(0, "Frag") - 0.2)} size={50} />
      <Lbl x={110} y={700} w={1000} t="Das Foto gehört auch ihnen" size={52} weight={800} align="center" a={o(word(0, "gehört") - 0.2)} />
      <K x={1150} y={250} w={660} h={280} v icon="send" t="Frag, bevor du es teilst" f={C.green} size={46} isize={110} a={o(cue(0) + 3.4)} />
      <K x={1150} y={570} w={660} h={310} v icon="scale" t="Jeder entscheidet über Bilder von sich mit" f={C.blue} size={42} isize={110} a={o(cue(1))} />
    </Szene>
  );
};

export default { profil: Profil, bezahlen: Bezahlen, foto: FotoS, alt: Alt, einstellungen: Einst, chat: Chat, passwort: Passwort, rechte: Rechte, andere: Andere };
