import React from "react";
import { Szene, useCues, sp, ease, lerp, C } from "../lib.jsx";
import { Panel, Lbl } from "../bausteine.jsx";
import { Pf, Etikett, Mark, MONO } from "../neu.jsx";
import { Kn, Kachel, Bg, Ic } from "../bausteine-betrieb.jsx";
import { Blase, Stempel } from "../bausteine-uc.jsx";

// ---------- 1 Immer dieselben Fragen: Posteingang, dahinter das Bestellsystem
const Fragen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const Q = [["Wo ist meine Bestellung?", "Wo ist"], ["Was kostet sie?", "Was kostet"], ["Kann ich stornieren?", "Kann ich"]];
  const ts = word(1, "stehen");
  return (
    <Szene titel="Immer dieselben Fragen" tiefe={["mail", 1500, 640, 800]}>
      <Etikett x={1390} y={152} t="erfundene Bestellungen" f={C.mute} size={34} a={o(0.4)} />
      {Q.map(([q, w], i) => (
        <div key={i} style={{ position: "absolute", left: 110, top: 270 + i * 175, width: 820, height: 145, borderRadius: 22, background: C.panel2, border: `3px solid ${C.line}`, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 24, padding: "0 30px", opacity: o(word(0, w) - 0.2), fontSize: 48, fontWeight: 700 }}>
          <Ic name="mail" size={64} color={C.blue} />{q}
        </div>
      ))}
      {[0, 1, 2].map((i) => <Pf key={i} x1={950} y1={342 + i * 175} x2={1130} y2={450} p={ease(t, ts + i * 0.25, ts + i * 0.25 + 0.6)} f={C.mute} w={5} />)}
      <Kachel x={1150} y={270} w={680} h={360} ic="database" t="Bestellsystem" sub="die Antworten stehen dort" f={C.blue} a={o(ts - 0.3)} ics={130} size={56} />
      <Kn x={1490} y={790} w={680} h={110} t="jemand muss nachsehen" ic="search" f={C.orange} size={46} a={o(cue(1) + 2.5)} />
    </Szene>
  );
};

// ---------- 2 Vier Werkzeuge um den Agenten
const TOOLS = [["Status lesen", "package", 420, 370, "Status lesen"], ["Preis rechnen", "euro", 1500, 370, "Preis rechnen"], ["Stornierung prüfen", "undo", 420, 780, "Stornierung prüfen"], ["Bestellungen suchen", "search", 1500, 780, "Bestellungen eines Kunden"]];
const Werkzeuge = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tl = word(1, "Alle vier");
  return (
    <Szene titel="Vier Werkzeuge" tiefe={["wrench", 1500, 640, 800]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
        {TOOLS.map(([, , x, y], i) => <line key={i} x1={960} y1={575} x2={x + (x < 960 ? 270 : -270)} y2={y} stroke={C.line} strokeWidth="6" strokeDasharray="12 12" opacity={o(0.6)} />)}
      </svg>
      <div style={{ position: "absolute", left: 960 - 130, top: 575 - 130, opacity: o(0.3) }}><Bg name="bot" size={260} color={C.blue} /></div>
      <Lbl x={760} y={720} w={400} t="Agent" size={40} color={C.mute} align="center" a={o(0.5)} />
      {TOOLS.map(([n, ic, x, y, w], i) => (
        <React.Fragment key={n}>
          <Kn x={x} y={y} w={540} h={130} t={n} ic={ic} f={C.blue} size={42} a={o(word(0, w) - 0.2)} />
          <div style={{ position: "absolute", left: x + 190, top: y - 95, opacity: ease(t, tl + i * 0.2, tl + i * 0.2 + 0.4) }}><Bg name="eye" size={70} color={C.green} /></div>
        </React.Fragment>
      ))}
      <Kn x={960} y={930} w={700} h={90} t="alle vier lesen nur" ic="eye" f={C.green} size={42} a={o(tl)} />
    </Szene>
  );
};

// ---------- 3 Der Preis: vier Schritte, echte Werte aus dem Beispiel
const Preis = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tw = word(0, "Es rechnet");
  const Z = ["nummer: B-10243", "zwischensumme: 28,8", "versandkosten: 4,9", "gesamt: 33,7"];
  return (
    <Szene titel="Der Preis" tiefe={["euro", 1500, 640, 800]}>
      <Blase x={110} y={290} w={420} h={270} t="Was kostet B-10243 mit Versand?" ic="message" rechts f={C.blue} size={38} a={o(0.4)} />
      <Pf x1={545} y1={425} x2={595} y2={425} p={ease(t, 0.9, 1.2)} f={C.mute} w={7} />
      <Kachel x={610} y={290} w={420} h={270} ic="euro" t="preis_berechnen" f={C.blue} a={o(word(0, "Preis-Werkzeug") - 0.2)} ics={90} size={34} />
      <Pf x1={1045} y1={425} x2={1095} y2={425} p={ease(t, tw - 0.3, tw + 0.1)} f={C.mute} w={7} />
      <Panel x={1110} y={260} w={500} h={330} r={22} a={o(tw)} rand={C.green} />
      {Z.map((z, i) => <div key={i} style={{ position: "absolute", left: 1134, top: 288 + i * 72, fontFamily: MONO, fontSize: 31, fontWeight: 600, color: i === 3 ? C.green : C.text, opacity: o(tw + 0.2 + i * 0.3), whiteSpace: "nowrap" }}>{z}</div>)}
      <Pf x1={1625} y1={425} x2={1665} y2={425} p={ease(t, tw + 1.6, tw + 2.0)} f={C.mute} w={7} />
      <Blase x={1680} y={310} w={150} h={230} t="33,70" f={C.green} size={36} a={o(tw + 1.8)} rechts />
      <Kn x={540} y={780} w={800} h={120} t="gerechnet im Werkzeug" ic="cpu" f={C.green} size={46} a={o(cue(1))} />
      <Kn x={1440} y={780} w={800} h={120} t="das Modell formuliert nur" ic="message" f={C.blue} size={46} a={o(word(1, "formuliert"))} />
    </Szene>
  );
};

// ---------- 4 Die Stornoregel: zwei Stati, Ja und Nein
const Storno = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tn = word(0, "Nein");
  return (
    <Szene titel="Die Stornoregel" tiefe={["undo", 1500, 640, 800]}>
      <Kachel x={110} y={250} w={520} h={330} ic="clock" t="in Bearbeitung" f={C.green} a={o(0.4)} ics={110} size={48} />
      <Stempel x={190} y={620} t="Ja" f={C.green} a={o(0.9)} />
      <Kachel x={700} y={250} w={520} h={330} ic="truck" t="versendet" f={C.red} a={o(word(0, "versendeten") - 0.3)} ics={110} size={48} />
      <Stempel x={780} y={620} t="Nein" f={C.red} a={o(tn)} />
      <Kachel x={1290} y={250} w={540} h={330} ic="scale" t="stornierung_pruefen" sub="prüft nur" f={C.blue} a={o(word(0, "prüft nur") - 0.3)} ics={110} size={38} />
      <Kn x={1560} y={720} w={540} h={110} t="storniert nichts" ic="ban" f={C.mute} size={44} a={o(word(0, "storniert nichts"))} />
      <Kn x={960} y={900} w={1500} h={110} t="Die Regel kommt aus dem Werkzeug, nicht aus dem Modell" ic="database" f={C.blue} size={46} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 5 Die Fangfrage als Chatverlauf
const Fang = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tm = word(0, "meldet");
  return (
    <Szene titel="Die Fangfrage" tiefe={["help", 1500, 640, 800]}>
      <Blase x={900} y={250} w={930} h={120} t="Wo ist Bestellung B-10299?" rechts f={C.orange} size={46} a={o(0.4)} />
      <Blase x={110} y={420} w={1000} h={120} t='bestellstatus: "Bestellung nicht gefunden"' mono size={36} ic="database" f={C.blue} a={o(tm - 0.2)} />
      <Blase x={110} y={590} w={1000} h={120} t="Diese Bestellnummer gibt es nicht." size={46} ic="bot" f={C.green} a={o(word(0, "ehrlich") - 0.1)} />
      <Mark x={1160} y={595} ok size={110} a={ease(t, word(0, "ehrlich") + 0.4, word(0, "ehrlich") + 0.8)} />
      <Kn x={960} y={860} w={1000} h={110} t="keinen Status erfinden" ic="ban" f={C.red} size={48} a={o(word(0, "ehrlich") + 0.6)} />
    </Szene>
  );
};

// ---------- 6 Rechte: Tabelle mit Schaltern
const Rechte = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const R = [["bestellstatus", "package"], ["preis_berechnen", "euro"], ["stornierung_pruefen", "undo"], ["bestellungen_suchen", "search"]];
  const Schalter = ({ x, y, an, f }) => <div style={{ position: "absolute", left: x, top: y, width: 110, height: 56, borderRadius: 28, background: an ? f + "44" : C.panel2, border: `4px solid ${an ? f : C.line}`, boxSizing: "border-box" }}><div style={{ position: "absolute", left: an ? 58 : 4, top: 4, width: 40, height: 40, borderRadius: 20, background: an ? f : C.mute }} /></div>;
  const tf = word(0, "Aktionen");
  return (
    <Szene titel="Nur nötige Rechte" tiefe={["lock", 1500, 640, 800]}>
      {R.map(([n, ic], i) => (
        <div key={n} style={{ position: "absolute", left: 110, top: 240 + i * 122, width: 1720, height: 100, borderRadius: 22, background: C.panel, border: `3px solid ${C.line}`, boxSizing: "border-box", opacity: o(0.3 + i * 0.25), display: "flex", alignItems: "center", gap: 22, padding: "0 28px" }}>
          <Ic name={ic} size={56} color={C.blue} />
          <div style={{ fontFamily: MONO, fontSize: 38, fontWeight: 600, width: 560 }}>{n}</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: C.green, flex: 1 }}>nur lesen</div>
        </div>
      ))}
      {R.map((_, i) => <Schalter key={i} x={1680} y={262 + i * 122} an f={C.green} />)}
      <div style={{ position: "absolute", left: 110, top: 240 + 4 * 122, width: 1720, height: 130, borderRadius: 22, background: C.panel, border: `4px solid ${C.orange}`, boxSizing: "border-box", opacity: o(tf - 0.4), display: "flex", alignItems: "center", gap: 22, padding: "0 28px" }}>
        <Ic name="lock" size={64} color={C.orange} />
        <div style={{ fontSize: 40, fontWeight: 700, flex: 1 }}>Aktion mit Folgen, zum Beispiel Stornieren</div>
        <Ic name="userCheck" size={64} color={C.orange} />
        <div style={{ fontSize: 36, fontWeight: 700, color: C.orange }}>Mensch gibt frei</div>
      </div>
      <Kn x={960} y={960} w={1100} h={70} t="Beispiel: 14 erfundene Bestellungen" ic="database" f={C.mute} size={34} a={o(word(1, "Das Beispiel"))} />
    </Szene>
  );
};

export default { fragen: Fragen, werkzeuge: Werkzeuge, preis: Preis, storno: Storno, fang: Fang, rechte: Rechte };
