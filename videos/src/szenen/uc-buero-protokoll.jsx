import React from "react";
import { Szene, useCues, sp, ease, lerp, rnd, C } from "../lib.jsx";
import { Panel, Lbl, Skel } from "../bausteine.jsx";
import { Pf, Etikett, Zeile, Mark, Zettel } from "../neu.jsx";
import { Kn, Kachel, Bg, Ic } from "../bausteine-betrieb.jsx";
import { Welle } from "../bausteine-uc.jsx";

// ---------- 1 Nach der Besprechung: Runde am Tisch, einer schreibt
const PL = [[960, 330], [610, 470], [1310, 470], [760, 760], [1160, 760]];
const Besprechung = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const th = word(0, "hört nur halb"), tq = word(1, "Später");
  return (
    <Szene titel="Nach der Besprechung" tiefe={["users", 1500, 640, 800]}>
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o(0.3) }}><ellipse cx={960} cy={590} rx={330} ry={140} fill={C.panel2} stroke={C.line} strokeWidth="5" /></svg>
      <Etikett x={1300} y={152} t="Beispiel, fiktive Besprechung" f={C.mute} size={34} a={o(0.4)} />
      {PL.map(([x, y], i) => {
        const schreibt = i === 4;
        const sprech = !schreibt && Math.sin(t * 2.2 + i * 1.7) > 0.4 && t < tq;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 70, top: y - 70, opacity: o(0.4 + i * 0.25) }}><Bg name="user" size={140} color={schreibt ? C.orange : C.blue} /></div>
            {sprech && <div style={{ position: "absolute", left: x + 80, top: y - 60, width: 120, height: 56, borderRadius: 20, background: C.panel2, border: `3px solid ${C.blue}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>{[0, 1, 2].map((d) => <div key={d} style={{ width: 12, height: 12, borderRadius: 6, background: C.blue }} />)}</div>}
            {!schreibt && <div style={{ position: "absolute", left: x - 25, top: y - 150, fontSize: 80, fontWeight: 800, color: C.orange, opacity: ease(t, tq + i * 0.25, tq + i * 0.25 + 0.5) }}>?</div>}
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 1160 + 40, top: 790, opacity: o(th - 0.3) }}><Bg name="edit" size={90} color={C.orange} /></div>
      <Kn x={1500} y={900} w={600} h={100} t="hört nur halb zu" ic="user" f={C.orange} size={42} a={o(th)} />
      <Kn x={480} y={900} w={700} h={100} t="später weiß keiner Genaues" ic="help" f={C.orange} size={40} a={o(tq)} />
    </Szene>
  );
};

// ---------- 2 Datenschutz zuerst: Mikrofon und Checkliste
const Zustimmung = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const L = [["Alle wissen es vorher", word(0, "wissen")], ["Alle stimmen zu", word(0, "stimmen zu")], ["Zweck ist festgelegt", cue(1)], ["Löschfrist ist festgelegt", cue(1) + 1.0]];
  const puls = 0.5 + 0.5 * Math.sin(t * 4);
  return (
    <Szene titel="Erst der Datenschutz" tiefe={["lock", 1500, 640, 800]}>
      <div style={{ position: "absolute", left: 160, top: 330, opacity: o(0.3) }}><Bg name="mic" size={380} color={C.blue} /></div>
      <div style={{ position: "absolute", left: 160 + 190 - 26, top: 250, width: 52, height: 52, borderRadius: 26, background: C.red, opacity: 0.4 + 0.6 * puls, boxShadow: `0 0 ${20 + 20 * puls}px ${C.red}` }} />
      <Lbl x={160} y={740} w={380} t="Aufnahme mit Zustimmung" size={36} color={C.mute} align="center" a={o(0.5)} />
      {L.map(([n, ta], i) => (
        <div key={n} style={{ position: "absolute", left: 800, top: 270 + i * 150, width: 1030, height: 120, display: "flex", alignItems: "center", gap: 24, opacity: sp(t, ta - 0.2, 0.6) }}>
          <Mark x={0} y={0} ok size={96} flow a={ease(t, ta + 0.2, ta + 0.6)} />
          <Zeile x={0} y={0} w={880} h={110} t={n} size={48} style={{ position: "relative" }} />
        </div>
      ))}
    </Szene>
  );
};

// ---------- 3 Ton wird Text, im Haus
const TextS = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tt = word(0, "lokal");
  const th = word(0, "verlässt");
  return (
    <Szene titel="Ton wird Text" tiefe={["mic", 1500, 640, 800]}>
      <Panel x={90} y={240} w={1130} h={520} rand={C.green} a={o(0.3)} />
      <div style={{ position: "absolute", left: 120, top: 262, display: "flex", alignItems: "center", gap: 14, opacity: o(0.4) }}><Ic name="house" size={50} color={C.green} /><div style={{ fontSize: 40, fontWeight: 700, color: C.green }}>im Haus</div></div>
      <Welle x={130} y={450} w={380} h={220} n={28} t={t} laut={1} rausch={ease(t, cue(1), cue(1) + 1.2) * 0.8} f={C.blue} a={o(0.5)} />
      <Pf x1={525} y1={560} x2={600} y2={560} p={ease(t, tt, tt + 0.4)} f={C.mute} w={7} />
      <div style={{ position: "absolute", left: 620, top: 480, opacity: o(tt) }}><Bg name="cpu" size={160} color={C.blue} /></div>
      <Pf x1={800} y1={560} x2={870} y2={560} p={ease(t, tt + 0.6, tt + 1.0)} f={C.mute} w={7} />
      <Panel x={890} y={330} w={300} h={380} a={o(tt + 0.8)} r={20}>
        <Skel x={26} y={36} w={248} n={9} gap={36} h={14} seed={6} />
      </Panel>
      <Pf x1={1230} y1={500} x2={1420} y2={500} p={ease(t, th, th + 0.5)} f={C.red} w={7} dash="14 12" />
      <div style={{ position: "absolute", left: 1470, top: 380, opacity: o(th) }}><Bg name="cloud" size={200} color={C.mute} /></div>
      <div style={{ position: "absolute", left: 1470 + 20, top: 380 + 20, opacity: o(th + 0.3) }}><Ic name="ban" size={160} color={C.red} sw={2.4} /></div>
      <Lbl x={1380} y={620} w={420} t="Audio verlässt das Haus nicht" size={34} color={C.red} align="center" a={o(th + 0.4)} />
      <Kn x={660} y={880} w={1200} h={100} t="Hall, Nebengeräusche, Durcheinanderreden" ic="alert" f={C.orange} size={42} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 4 Vergleich mit dem Original, Risikostellen markiert
const HL = ({ children, a = 1 }) => <span style={{ background: C.orange + (a > 0.5 ? "55" : "00"), borderBottom: `4px solid ${a > 0.5 ? C.orange : "transparent"}`, borderRadius: 6, padding: "0 6px" }}>{children}</span>;
const Vergleich = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tv = word(0, "Vergleiche");
  const m = (k) => sp(t, tv + 1.2 + k * 0.5, 0.4);
  return (
    <Szene titel="Mit dem Original vergleichen" tiefe={["file", 1500, 640, 800]}>
      <Panel x={90} y={240} w={1090} h={610} a={o(0.3)} />
      <Lbl x={130} y={262} w={900} t="Originaltext der Beispielaufnahme" size={36} color={C.mute} a={o(0.4)} />
      <div style={{ position: "absolute", left: 130, top: 330, width: 1010, fontSize: 40, fontWeight: 500, lineHeight: 1.6, opacity: o(0.6) }}>
        Protokoll der Wochenbesprechung vom <HL a={m(0)}>zwölften März</HL>. Die Montagelinie drei arbeitet ab dem <HL a={m(1)}>siebzehnten</HL> März im <HL a={m(2)}>Zweischichtbetrieb</HL>. Das Team bestellt <HL a={m(3)}>zwanzig</HL> neue Greifer. Die Instandhaltung prüft bis zum <HL a={m(4)}>neunzehnten</HL> März.
      </div>
      <Kn x={1520} y={310} w={600} h={110} t="Ziffern statt Wörter" ic="edit" f={C.orange} size={42} a={o(tv + 1.0)} />
      <Kn x={1520} y={450} w={600} h={110} t="Fachwörter getrennt" ic="edit" f={C.orange} size={42} a={o(tv + 1.6)} />
      <Kn x={1520} y={590} w={600} h={110} t="Fehlerquote nicht gemessen" ic="info" f={C.mute} size={34} a={o(word(0, "nicht gemessen") - 0.2)} />
      <Panel x={1220} y={730} w={610} h={120} a={o(cue(1))} rand={C.blue} />
      <div style={{ position: "absolute", left: 1250, top: 755, display: "flex", alignItems: "center", gap: 18, opacity: o(cue(1)) }}><Ic name="mic" size={64} color={C.blue} /><div style={{ fontSize: 36, fontWeight: 700 }}>synthetische Stimme, 28 s</div></div>
    </Szene>
  );
};

// ---------- 5 Zwei Datumsangaben
const ZahlenP = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tw = word(0, "Zwischen");
  const Tile = ({ x, n, f, a }) => (
    <div style={{ position: "absolute", left: x, top: 270, width: 440, height: 430, borderRadius: 28, background: C.panel, border: `4px solid ${f}`, boxSizing: "border-box", opacity: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <Ic name="calendar" size={170} color={f} sw={1.4} />
      <div style={{ fontSize: 150, fontWeight: 800, color: f, lineHeight: 1 }}>{n}</div>
    </div>
  );
  return (
    <Szene titel="Zahlen und Fristen" tiefe={["calendar", 1500, 640, 800]}>
      <Tile x={110} n="19." f={C.blue} a={o(0.4)} />
      <div style={{ position: "absolute", left: 580, top: 380, fontSize: 150, fontWeight: 800, color: C.orange, opacity: o(tw) }}>≠</div>
      <Tile x={750} n="9." f={C.orange} a={o(tw + 0.2)} />
      <Lbl x={110} y={740} w={1080} t="dazwischen liegt eine ganze Aufgabe" size={46} color={C.mute} weight={600} align="center" a={o(tw + 0.8)} />
      <Zettel x={1300} y={270} w={530} h={430} rot={1.5} a={o(cue(1))}>
        <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 14 }}>Protokoll (Entwurf)</div>
        {[0, 1].map((i) => <div key={i} style={{ height: 18, borderRadius: 9, background: "#c9bb8a", width: [440, 360][i], marginTop: 22 }} />)}
        <div style={{ marginTop: 30, fontSize: 38, fontWeight: 600 }}>bis zum <span style={{ border: "5px solid #c0392b", borderRadius: 40, padding: "0 12px", color: "#c0392b" }}>9.</span> März</div>
        {[0, 1].map((i) => <div key={i} style={{ height: 18, borderRadius: 9, background: "#c9bb8a", width: [400, 300][i], marginTop: 26 }} />)}
      </Zettel>
      <Kn x={1565} y={790} w={560} h={110} t="glatt, aber falsch" ic="alert" f={C.red} size={44} a={o(word(1, "wirkt"))} />
    </Szene>
  );
};

// ---------- 6 Freigabe und Löschung
const Freigabe = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const td = word(0, "Danach");
  return (
    <Szene titel="Freigabe und Löschung" tiefe={["userCheck", 1500, 640, 800]}>
      <Kachel x={110} y={250} w={460} h={280} ic="file" t="Entwurf" f={C.mute} a={o(0.4)} ics={100} size={50} />
      <Pf x1={590} y1={390} x2={680} y2={390} p={ease(t, 0.9, 1.3)} f={C.mute} w={8} />
      <Kachel x={700} y={250} w={560} h={280} ic="userCheck" t="Person, die dabei war" sub="gibt frei" f={C.blue} a={o(0.9)} ics={100} size={46} />
      <Pf x1={1280} y1={390} x2={1370} y2={390} p={ease(t, word(0, "gibt") + 0.3, word(0, "gibt") + 0.8)} f={C.mute} w={8} />
      <Kachel x={1390} y={250} w={440} h={280} ic="check" t="Protokoll" f={C.green} a={o(word(0, "gibt") + 0.4)} ics={100} size={50} />
      <Kachel x={110} y={590} w={460} h={280} ic="mic" t="Aufnahme" f={C.mute} a={o(td - 0.3)} ics={100} size={50} />
      <Pf x1={590} y1={730} x2={680} y2={730} p={ease(t, td, td + 0.5)} f={C.mute} w={8} />
      <Kachel x={700} y={590} w={560} h={280} ic="trash" t="löschen" sub="nach der Löschfrist" f={C.red} a={o(td + 0.2)} ics={100} size={50} />
      <Kachel x={1390} y={590} w={440} h={280} ic="play" t="Beispiel" sub="startklar" f={C.green} a={o(cue(1))} ics={100} size={50} />
    </Szene>
  );
};

export default { besprechung: Besprechung, zustimmung: Zustimmung, text: TextS, vergleich: Vergleich, zahlen: ZahlenP, freigabe: Freigabe };
