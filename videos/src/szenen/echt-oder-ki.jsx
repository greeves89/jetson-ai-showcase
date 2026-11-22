import React from "react";
import { Szene, useCues, sp, ease, lerp, C, Icon } from "../lib.jsx";
import { Panel, Lbl, Chip } from "../bausteine.jsx";
import { Mark, Etikett, Pf } from "../neu.jsx";
import { Ic, K, Foto, Hand, Num, Stempel, Messer, Quer } from "../bausteine-schule.jsx";

// ---------- 1 Zwei Bilder
const Raten = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const u = t > cue(1) ? (Math.sin((t - cue(1)) * 2.4) + 1) / 2 : 0;
  return (
    <Szene titel="Zwei Bilder" tiefe={["image", 1500, 640, 800]}>
      <Foto x={110} y={240} w={790} h={500} a={o(0.4)} />
      <Foto x={1020} y={240} w={790} h={500} v={1} a={o(0.9)} />
      <Num n="A" size={110} f={C.blue} a={o(0.6)} style={{ position: "absolute", left: 445, top: 775 }} />
      <Num n="B" size={110} f={C.orange} a={o(1.1)} style={{ position: "absolute", left: 1355, top: 775 }} />
      {[[505, 1 - u, "camera", C.green], [505, u, "sparkles", C.orange], [1415, u, "camera", C.green], [1415, 1 - u, "sparkles", C.orange]].map(([cx, op, ic, col], i) => (
        <div key={i} style={{ position: "absolute", left: cx - 90, top: 400, width: 180, height: 180, borderRadius: 90, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", opacity: o(cue(1)) * op, border: `4px solid ${col}` }}>
          <Ic name={ic} size={100} color={col} sw={1.6} />
        </div>
      ))}
      <Lbl x={110} y={925} w={1700} t="Welches kommt von der KI?" size={60} weight={800} align="center" a={o(cue(1) + 0.6)} />
    </Szene>
  );
};

// ---------- 2 Bauchgefühl
const Bauch = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const wert = Math.sin(t * 4.1) * 0.7 + Math.sin(t * 7.3) * 0.25;
  const coin = Math.cos(t * 6);
  return (
    <Szene titel="Bauchgefühl" tiefe={["eye", 1500, 640, 800]}>
      <Panel x={110} y={235} w={860} h={640} a={o(0.3)} />
      <Messer x={190} y={285} w={700} wert={wert} a={o(0.5)} />
      <Lbl x={110} y={735} w={860} t="Bauchgefühl" size={64} weight={800} align="center" a={o(0.6)} />
      <Lbl x={110} y={815} w={860} t="Nadel zeigt: mal so, mal so" size={40} color={C.mute} align="center" a={o(0.8)} />
      <Panel x={1010} y={235} w={800} h={640} a={o(0.7)} />
      <div style={{ position: "absolute", left: 1260, top: 340, width: 300, height: 300, borderRadius: 150, border: `14px solid ${C.orange}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 190, fontWeight: 800, color: C.orange, opacity: o(0.9), transform: `scaleX(${coin})` }}>€</div>
      <Lbl x={1010} y={735} w={800} t="Münzwurf" size={64} weight={800} align="center" color={C.orange} a={o(0.9)} />
      <Lbl x={1010} y={815} w={800} t="Studien: Menschen raten oft nur" size={40} color={C.mute} align="center" a={o(word(0, "Studien"))} />
      <Etikett x={560} y={905} t="Kein Messgerät" f={C.red} size={56} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 3 Fehler im Bild
const Fehler = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const a1 = word(0, "Hände"), a2 = word(0, "Schrift"), a3 = word(0, "Schatten");
  const Ring = ({ x, y, w, h, a }) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: "50%", border: `7px solid ${C.red}`, opacity: a, transform: `scale(${lerp(1.5, 1, Math.min(1, a))})` }} />;
  return (
    <Szene titel="Fehler im Bild" tiefe={["alert", 1500, 640, 800]}>
      {/* Hand */}
      <Panel x={110} y={235} w={540} h={640} a={o(0.3)} />
      <Hand x={225} y={280} s={1.9} n={6} a={o(a1)} />
      <Ring x={315} y={265} w={110} h={150} a={o(a1 + 0.9)} />
      <Lbl x={110} y={790} w={540} t="Sechs Finger" size={50} weight={800} align="center" a={o(a1 + 0.4)} />
      {/* Schrift */}
      <Panel x={690} y={235} w={540} h={640} a={o(0.5)} />
      <div style={{ position: "absolute", left: 730, top: 380, width: 460, height: 260, borderRadius: 18, background: "#f3e6b3", color: "#1c1c1e", opacity: o(a2), display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 58, fontWeight: 800, lineHeight: 1.1, transform: "rotate(-3deg)" }}>RÄSTAURNT<br />ÖFFNEZ 11-0Θ</div>
      <Ring x={715} y={350} w={510} h={320} a={o(a2 + 0.9)} />
      <Lbl x={690} y={790} w={540} t="Buchstabensuppe" size={50} weight={800} align="center" a={o(a2 + 0.4)} />
      {/* Schatten */}
      <Panel x={1270} y={235} w={540} h={640} a={o(0.7)} />
      <div style={{ position: "absolute", left: 1300, top: 270, opacity: o(a3) }}><Ic name="sun" size={110} color={C.orange} sw={1.6} /></div>
      <div style={{ position: "absolute", left: 1500, top: 430, width: 190, height: 190, borderRadius: 95, background: "#8e8e93", opacity: o(a3) }} />
      <div style={{ position: "absolute", left: 1370, top: 590, width: 260, height: 50, borderRadius: 25, background: "#00000099", opacity: o(a3 + 0.3) }} />
      <Ring x={1340} y={560} w={330} h={110} a={o(a3 + 0.9)} />
      <Lbl x={1270} y={790} w={540} t="Schatten falsch" size={50} weight={800} align="center" a={o(a3 + 0.4)} />
      <Etikett x={110} y={905} t="Gute erste Hinweise" f={C.green} size={52} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 4 Die Modelle lernen
const Wett = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const B = [["Früher", 0.95, C.red, 0.4], ["Heute", 0.5, C.orange, 1.6], ["Bald", 0.08, C.green, 2.8]];
  return (
    <Szene titel="Die Modelle lernen" tiefe={["clock", 1500, 640, 800]}>
      <Panel x={110} y={235} w={980} h={700} a={o(0.3)} />
      <Lbl x={110} y={262} w={980} t="Sichtbare Fehler" size={48} weight={800} align="center" color={C.mute} a={o(0.4)} />
      {B.map(([n, h, f, at], i) => {
        const p = ease(t, at, at + 1.1);
        const H = 460 * h * p;
        return (
          <React.Fragment key={n}>
            <div style={{ position: "absolute", left: 190 + i * 290, top: 800 - H, width: 220, height: Math.max(H, 6), borderRadius: 14, background: f, opacity: o(at - 0.2) }} />
            <Lbl x={160 + i * 290} y={840} w={280} t={n} size={48} weight={800} align="center" a={o(at)} />
          </React.Fragment>
        );
      })}
      <Panel x={1150} y={235} w={660} h={700} a={o(cue(1) - 0.2)} rand={C.orange} />
      <Foto x={1210} y={300} w={540} h={340} a={o(cue(1))} />
      <K x={1180} y={670} w={600} h={110} icon="check" t="Kein Fehler sichtbar" f={C.green} size={40} isize={56} a={o(cue(1) + 0.8)} />
      <K x={1180} y={800} w={600} h={110} icon="x" t="heißt nicht: echt" f={C.red} size={40} isize={56} a={o(cue(1) + 1.6)} />
    </Szene>
  );
};

// ---------- 5 Woher kommt es?
const Herkunft = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const Q = [["user", "Wer?", 260], ["calendar", "Wann?", 440], ["pin", "Wo?", 620]];
  return (
    <Szene titel="Woher kommt es?" tiefe={["search", 1500, 640, 800]}>
      <Foto x={690} y={290} w={540} h={340} a={o(0.4)} rand={C.orange} />
      <Lbl x={690} y={645} w={540} t="Sieht echt aus?" size={46} weight={700} align="center" color={C.mute} a={o(0.5)} />
      <div style={{ position: "absolute", left: 930, top: 400, opacity: o(cue(0) + 1.8), transform: "translate(-50%,0)" }} />
      {Q.map(([ic, n, y], i) => (
        <React.Fragment key={n}>
          <K x={110} y={y} w={470} h={150} icon={ic} t={n} f={C.blue} size={54} isize={76} a={o(cue(1) + i * 0.7)} />
          <Pf x1={590} y1={y + 75} x2={680} y2={460} p={ease(t, cue(1) + 0.3 + i * 0.7, cue(1) + 0.9 + i * 0.7)} f={C.blue} w={6} />
        </React.Fragment>
      ))}
      <K x={1340} y={330} w={470} h={260} icon="link" t="Quelle" sub="Erster Beitrag" f={C.green} size={54} isize={90} v a={o(cue(1) + 2.2)} />
      <Pf x1={1240} y1={460} x2={1330} y2={460} p={ease(t, cue(1) + 2.3, cue(1) + 2.9)} f={C.green} w={6} />
      <Etikett x={290} y={880} t="Ohne Herkunft: nur eine Behauptung" f={C.red} size={56} a={o(cue(2))} />
    </Szene>
  );
};

// ---------- 6 Echt, aber falsch
const Kontext = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Echt, aber falsch" tiefe={["news", 1500, 640, 800]}>
      <Panel x={110} y={235} w={800} h={640} a={o(0.3)} />
      <Foto x={160} y={290} w={700} h={400} a={o(0.4)} />
      <div style={{ position: "absolute", left: 180, top: 310, opacity: o(0.8) }}><Ic name="calendar" size={80} color={C.mute} /></div>
      <Lbl x={110} y={730} w={800} t="Echtes Foto, vor Jahren" size={52} weight={800} align="center" a={o(0.8)} />
      <Pf x1={930} y1={455} x2={1000} y2={455} p={ease(t, cue(0) + 1.6, cue(0) + 2.2)} f={C.orange} w={8} />
      <Panel x={1010} y={235} w={800} h={640} a={o(cue(0) + 1.8)} rand={C.red} />
      <Foto x={1060} y={290} w={700} h={400} a={o(cue(0) + 2.0)} />
      <div style={{ position: "absolute", left: 1060, top: 560, width: 700, height: 130, background: "#000000cc", color: "#fff", fontSize: 62, fontWeight: 800, display: "flex", alignItems: "center", padding: "0 30px", boxSizing: "border-box", opacity: o(cue(0) + 2.3) }}>HEUTE: Neues Ereignis!</div>
      <Stempel x={1075} y={400} t="FALSCHER ZUSAMMENHANG" size={34} a={o(cue(1))} rot={-6} />
      <Lbl x={1010} y={730} w={800} t="Dasselbe Foto, neue Story" size={48} weight={800} align="center" color={C.red} a={o(cue(0) + 2.4)} />
      <Etikett x={560} y={905} t="Herkunft zählt mehr als Technik" f={C.green} size={52} a={o(cue(1) + 0.6)} />
    </Szene>
  );
};

// ---------- 7 Bildersuche
const Suche = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const R = [["Seite A", "neu", 0], ["Seite B", "neu", 1], ["Älteste Fundstelle", "alt", 2]];
  return (
    <Szene titel="Bildersuche" tiefe={["search", 1500, 640, 800]}>
      <Foto x={110} y={300} w={420} h={270} a={o(0.4)} />
      <Pf x1={540} y1={435} x2={640} y2={435} p={ease(t, 0.8, 1.4)} f={C.blue} w={7} />
      <div style={{ position: "absolute", left: 650, top: 360, width: 500, height: 150, borderRadius: 28, background: C.panel, border: `4px solid ${C.blue}`, opacity: o(0.9), display: "flex", alignItems: "center", gap: 24, padding: "0 30px", boxSizing: "border-box", fontSize: 48, fontWeight: 700 }}>
        <Ic name="search" size={80} color={C.blue} />Bildersuche
      </div>
      <Pf x1={1160} y1={435} x2={1240} y2={435} p={ease(t, cue(0) + 2.4, cue(0) + 3)} f={C.blue} w={7} />
      {R.map(([n, k, i]) => (
        <div key={n} style={{ position: "absolute", left: 1250, top: 250 + i * 190, width: 560, height: 165, borderRadius: 24, background: k === "alt" ? C.orange + "22" : C.panel, border: `4px solid ${k === "alt" ? C.orange : C.line}`, opacity: o(cue(1) - 0.3 + i * 0.7), display: "flex", alignItems: "center", gap: 22, padding: "0 22px", boxSizing: "border-box" }}>
          <div style={{ width: 150, height: 100, borderRadius: 12, background: "linear-gradient(#27406b,#e39a63)", flex: "none" }} />
          <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.1 }}>{n}</div>
          {k === "alt" && <Ic name="calendar" size={56} color={C.orange} />}
        </div>
      ))}
      <Lbl x={110} y={640} w={1100} t="Oft: alt, geklaut oder aus anderem Zusammenhang" size={46} weight={700} color={C.mute} a={o(cue(1) + 0.6)} />
      <Etikett x={110} y={880} t="Keine Treffer: Warnsignal, kein Beweis" f={C.orange} size={56} a={o(cue(2))} />
    </Szene>
  );
};

// ---------- 8 Herkunftsangabe
const Siegel = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const verloren = ease(t, cue(1) + 0.6, cue(1) + 2.2);
  const wert = Math.sin(t * 4.3) * 0.8;
  return (
    <Szene titel="Herkunftsangabe" tiefe={["shield", 1500, 640, 800]}>
      <Panel x={110} y={235} w={560} h={660} a={o(0.3)} rand={C.green} />
      <Foto x={150} y={280} w={480} h={310} a={o(0.4)} />
      <div style={{ position: "absolute", left: 160, top: 300, opacity: o(0.9) * (1 - verloren) }}><Ic name="badge" size={110} color={C.green} sw={1.8} /></div>
      <Lbl x={110} y={620} w={560} t="Content Credentials" size={44} weight={800} align="center" color={C.green} a={o(0.9) * (1 - verloren)} />
      <Lbl x={110} y={680} w={560} t="Kamera, Programm, Änderungen" size={38} align="center" color={C.mute} a={o(1.2) * (1 - verloren)} />
      <Lbl x={110} y={620} w={560} t="Angabe verloren" size={48} weight={800} align="center" color={C.red} a={verloren} />
      <Lbl x={110} y={790} w={560} t="Im Bild gespeichert" size={44} weight={800} align="center" a={o(0.8)} />
      <Panel x={700} y={235} w={560} h={660} a={o(cue(1))} rand={C.orange} />
      <Foto x={740} y={280} w={480} h={310} a={o(cue(1) + 0.1)} />
      <div style={{ position: "absolute", left: 930, top: 360, opacity: verloren }}><Ic name="question" size={150} color={C.orange} sw={2.2} /></div>
      <div style={{ position: "absolute", left: 775, top: 640, opacity: o(cue(1) + 0.3) }}><Ic name="camera" size={80} color={C.mute} /></div>
      <Lbl x={880} y={655} w={380} t="Bildschirmfoto" size={40} color={C.mute} a={o(cue(1) + 0.3)} />
      <Lbl x={700} y={790} w={560} t="Fehlt: heißt nichts" size={44} weight={800} align="center" color={C.orange} a={o(cue(1) + 1.2)} />
      <Panel x={1290} y={235} w={520} h={660} a={o(cue(2) - 0.2)} rand={C.red} />
      <Lbl x={1290} y={262} w={520} t="KI-Erkennungs-App" size={42} weight={800} align="center" color={C.mute} a={o(cue(2))} />
      <Messer x={1340} y={380} w={420} wert={wert} a={o(cue(2) + 0.2)} />
      <Lbl x={1290} y={700} w={520} t="Liegt oft daneben" size={46} weight={800} align="center" color={C.red} a={o(cue(2) + 0.9)} />
    </Szene>
  );
};

// ---------- 9 Dein Plan
const Plan = () => {
  const { t, cue } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const F = [["user", "Wer zeigt mir das?", C.blue], ["help", "Was soll ich fühlen oder tun?", C.orange], ["book", "Gibt es eine zweite Quelle?", C.green]];
  return (
    <Szene titel="Dein Plan" tiefe={["target", 1500, 640, 800]}>
      {F.map(([ic, n, f], i) => (
        <div key={n} style={{ position: "absolute", left: 110 + i * 590, top: 235, width: 540, height: 330, borderRadius: 28, background: f + "18", border: `4px solid ${f}`, opacity: o(0.3 + i * 0.9 + (i === 0 ? 0.4 : 0)), boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 22px", textAlign: "center", transform: `translateY(${(1 - o(0.3 + i * 0.9)) * 24}px)` }}>
          <Num n={i + 1} size={64} f={f} />
          <Ic name={ic} size={84} color={f} sw={1.6} />
          <div style={{ fontSize: 46, fontWeight: 800, lineHeight: 1.1 }}>{n}</div>
        </div>
      ))}
      <K x={110} y={610} w={1700} h={140} icon="frown" t="Macht es dich sofort wütend? Extra vorsichtig." f={C.red} size={52} isize={88} a={o(cue(1))} />
      <K x={110} y={790} w={1700} h={140} icon="stop" t="Unsicher? Nicht weiterschicken." f={C.green} size={52} isize={88} a={o(cue(2))} />
    </Szene>
  );
};

export default { raten: Raten, bauchgefuehl: Bauch, fehler: Fehler, wettlauf: Wett, herkunft: Herkunft, kontext: Kontext, suche: Suche, siegel: Siegel, plan: Plan };
