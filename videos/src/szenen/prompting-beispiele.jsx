import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Chip, Skel } from "../bausteine.jsx";
import { Zettel, Pf, MONO, Etikett, Mark, Zeile } from "../neu.jsx";

const TABS = [["Mail", "message", C.blue], ["Protokoll", "list", C.green], ["Angebote", "grid", C.orange]];
// Die drei Aufgaben: erst große Karten, dann Reiter (Anker über alle Szenen)
function Reiter({ u = 1, aktiv = -1, a = 1, ap = [1, 1, 1] }) {
  return (
    <>
      {TABS.map(([n, ic, f], i) => {
        const h = lerp(680, 80, u), on = aktiv === i;
        return (
          <div key={n} style={{ position: "absolute", left: 90 + i * 590, top: 215, width: 560, height: h, borderRadius: lerp(28, 22, u), background: on ? f + "33" : C.panel, border: `4px solid ${on ? f : aktiv >= 0 ? C.line : f}`, opacity: a * ap[i], boxSizing: "border-box", overflow: "hidden", transform: `translateY(${(1 - ap[i]) * 30}px)` }}>
            <div style={{ position: "absolute", left: 24, top: lerp(26, 12, u), display: "flex", alignItems: "center", gap: 18, fontSize: lerp(72, 46, u), fontWeight: 800, color: aktiv >= 0 && !on ? C.mute : C.text }}><Icon name={ic} size={lerp(90, 52, u)} color={aktiv >= 0 && !on ? C.mute : f} sw={1.6} />{n}</div>
            <div style={{ opacity: 1 - ease(u, 0, 0.5) }}>
              {i === 0 && <><Skel x={50} y={190} w={460} n={7} gap={66} h={22} farbe="#48484a" /><div style={{ position: "absolute", left: 50, top: 600, width: 200, height: 52, borderRadius: 26, background: f }} /></>}
              {i === 1 && [0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: 40, top: 200 + k * 150, width: 480, height: 120, borderRadius: 18, border: `3px solid ${f}88`, background: f + "11" }}><Skel x={22} y={26} w={300} n={3} gap={30} h={14} farbe="#48484a" /></div>)}
              {i === 2 && <>{[0, 1].map((k) => <div key={k} style={{ position: "absolute", left: 40 + k * 250, top: 200, width: 230, height: 300, borderRadius: 18, border: `3px solid ${f}88`, background: f + "11" }}><Skel x={20} y={30} w={180} n={6} gap={40} h={16} farbe="#48484a" /></div>)}<div style={{ position: "absolute", left: 40, top: 540, width: 480, height: 90, borderRadius: 18, background: "#2c2c2e" }} /></>}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ---------- 1 Übersicht
const Anker1 = () => { const { t, word } = useCues(); const at = [word(0, "Mail"), word(0, "Protokoll"), word(0, "Angebote")]; return <Reiter u={0} ap={at.map((x) => sp(t, x - 0.4, 0.7))} />; };
const Uebersicht = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Drei Aufgaben" tiefe={["list", 1500, 640, 800]} anker={<Anker1 />}>
      <Lbl x={90} y={925} w={1740} t="Bei allen dreien gilt dasselbe: genau sagen, was du brauchst" size={52} weight={800} align="center" color={C.blue} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 2 Mail
const Anker2 = () => { const { t } = useCues(); return <Reiter u={ease(t, 0, 0.9)} aktiv={0} />; };
const MailS = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const R = [["Rolle", "Kundenberaterin"], ["Grund", "Lieferung 2 Tage später"], ["Ton", "freundlich"], ["Länge", "höchstens 100 Wörter"], ["Tabu", "keine Rabatte zusagen"]];
  return (
    <Szene titel="Die Mail" tiefe={["message", 1500, 640, 800]} anker={<Anker2 />}>
      <Lbl x={90} y={325} w={610} t="Vorher" size={48} weight={800} color={C.red} a={o(0.8)} />
      <Panel x={90} y={385} w={610} h={140} r={22} a={o(0.9)} rand={C.red}><Lbl x={26} y={22} w={560} t="Schreib eine Mail wegen der Verspätung." size={42} weight={600} /></Panel>
      <Panel x={90} y={550} w={610} h={425} r={22} a={o(cue(0) + 1.2)}>
        <div style={{ position: "absolute", left: 28, top: 26, width: 556, fontSize: 40, fontWeight: 500, color: C.mute, lineHeight: 1.3 }}>Sehr geehrte Damen und Herren, leider gibt es ein Problem mit Ihrer Bestellung. Wir bitten um Verständnis und danken für Ihre Geduld.</div>
      </Panel>
      <Lbl x={760} y={325} w={1070} t="Nachher" size={48} weight={800} color={C.green} a={o(cue(1) - 0.3)} />
      <Panel x={760} y={385} w={1070} h={365} r={22} a={o(cue(1) - 0.2)} rand={C.green}>
        {R.map(([k, v], i) => (
          <div key={k} style={{ position: "absolute", left: 28, top: 20 + i * 68, display: "flex", gap: 22, fontSize: 44, fontWeight: 700, opacity: o(cue(1) + 0.2 + i * 0.35) }}><span style={{ color: C.green, width: 280 }}>{k}</span><span>{v}</span></div>
        ))}
      </Panel>
      <Panel x={760} y={775} w={1070} h={200} r={22} a={o(cue(2) - 0.1)} rand={C.green}>
        <div style={{ position: "absolute", left: 28, top: 20, width: 1014, fontSize: 42, fontWeight: 600, lineHeight: 1.3 }}>Guten Tag Frau Muster, Ihre Lieferung kommt am Donnerstag. Das tut uns leid.</div>
        {["kürzer", "passender", "erfindet nichts"].map((q, i) => <div key={q} style={{ position: "absolute", left: 28 + i * 290, top: 135, display: "flex", alignItems: "center", gap: 10, fontSize: 40, fontWeight: 700, color: C.green, opacity: o(cue(2) + 0.4 + i * 0.4) }}><Mark flow ok size={44} />{q}</div>)}
      </Panel>
    </Szene>
  );
};

// ---------- 3 Protokoll
const Anker3 = () => { const { t } = useCues(); return <Reiter u={1} aktiv={1} />; };
const ProtokollS = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const chat = ["Anna: also wir sollten das Angebot noch mal anschauen", "Ben: ja, ich schau drauf, bis Freitag?", "Chris: ok, und die Schulung verschieben wir", "Anna: gut, dann machen wir das so", "Ben: Budget klären, wer weiß das?"];
  const sort = ease(t, word(0, "Raster") - 0.5, word(0, "Raster") + 1.0) || ease(t, cue(0) + 3.2, cue(0) + 4.2);
  const lu = t > cue(2) ? 1 : 0;
  return (
    <Szene titel="Das Protokoll" tiefe={["list", 1500, 640, 800]} anker={<Anker3 />}>
      <Panel x={90} y={325} w={760} h={650} r={24} a={o(0.4)} />
      {chat.map((c, i) => <div key={i} style={{ position: "absolute", left: 120, top: 350 + i * 124, width: 700, fontSize: 40, fontWeight: 500, color: C.mute, lineHeight: 1.2, opacity: o(0.5 + i * 0.25) * (1 - sort * 0.55) }}>{c}</div>)}
      <Pf x1={870} y1={650} x2={940} y2={650} p={ease(t, cue(0) + 3.0, cue(0) + 3.6)} f={C.green} w={9} />
      <Panel x={960} y={325} w={870} h={650} r={24} a={o(cue(0) + 3.0)} rand={C.green} />
      <Lbl x={990} y={345} w={400} t="Teilnehmende" size={44} weight={800} color={C.green} a={sort} />
      {["Anna", "Ben", "Chris"].map((n, i) => <div key={n} style={{ position: "absolute", left: 990 + i * 190, top: 405, opacity: sort }}><Etikett x={0} y={0} t={n} f={C.green} size={42} /></div>)}
      <Lbl x={990} y={510} w={400} t="Beschlüsse" size={44} weight={800} color={C.green} a={sort} />
      <Lbl x={990} y={565} w={800} t="Schulung wird verschoben" size={42} a={sort} />
      <Lbl x={990} y={650} w={600} t="Offene Punkte mit Frist" size={44} weight={800} color={C.green} a={sort} />
      <div style={{ position: "absolute", left: 990, top: 715, width: 810, height: 100, borderRadius: 18, background: C.panel2, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", fontSize: 42, fontWeight: 600, opacity: sort, boxSizing: "border-box" }}><span>Angebot prüfen (Ben)</span><span style={{ color: C.green }}>Freitag</span></div>
      <div style={{ position: "absolute", left: 990, top: 835, width: 810, height: 100, borderRadius: 18, background: lu ? C.orange + "22" : C.panel2, border: `4px solid ${lu ? C.orange : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", fontSize: 42, fontWeight: 600, opacity: sort, boxSizing: "border-box" }}><span>Budget klären</span><span style={{ color: C.orange, fontWeight: 800 }}>nicht genannt</span></div>
    </Szene>
  );
};

// ---------- 4 Angebote
const Anker4 = () => <Reiter u={1} aktiv={2} />;
const AngeboteS = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const rows = [["Preis", "1.200 € im Monat", "980 € im Monat", 0], ["Laufzeit", "12 Monate", "12 Monate", 0], ["Leistung", "Support rund um die Uhr", "Support werktags", 0], ["Gesamtkosten", "14.400 €", "11.760 €", 1], ["Empfehlung", "wenn rund um die Uhr nötig", "wenn werktags reicht", 2]];
  const step = t > word(0, "Empfehlung") ? 2 : t > word(0, "Gesamtkosten") ? 1 : 0;
  const S = ["1  Eckdaten", "2  Gesamtkosten", "3  Empfehlung"];
  return (
    <Szene titel="Die Angebote" tiefe={["grid", 1500, 640, 800]} anker={<Anker4 />}>
      {S.map((n, i) => <div key={n} style={{ position: "absolute", left: 90 + i * 590, top: 325, width: 560, height: 80, borderRadius: 40, background: step >= i ? C.orange + "33" : "#2c2c2e", border: `4px solid ${step === i ? C.orange : C.line}`, fontSize: 44, fontWeight: 800, color: step >= i ? C.text : C.mute, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", opacity: o(0.5 + i * 0.2) }}>{n}</div>)}
      <div style={{ position: "absolute", left: 90, top: 430, width: 1740, height: 70, display: "flex", fontSize: 44, fontWeight: 800, color: C.mute, opacity: o(0.8) }}><div style={{ width: 420, padding: "0 20px" }} /><div style={{ width: 660, padding: "0 20px", color: C.blue }}>Angebot A</div><div style={{ width: 660, padding: "0 20px", color: C.green }}>Angebot B</div></div>
      {rows.map(([k, a, b, st], i) => {
        const when = [cue(0) + 1.4, cue(0) + 2.9, cue(0) + 4.4, word(0, "Gesamtkosten") + 0.3, word(0, "Empfehlung") + 0.3][i];
        return (
          <div key={k} style={{ position: "absolute", left: 90, top: 505 + i * 94, width: 1740, height: 82, borderRadius: 16, background: st === 1 ? C.orange + "18" : C.panel, border: `3px solid ${st === 1 ? C.orange : C.line}`, display: "flex", alignItems: "center", fontSize: 44, fontWeight: 700, opacity: o(when), boxSizing: "border-box" }}>
            <div style={{ width: 420, padding: "0 24px", color: C.mute }}>{k}</div><div style={{ width: 660, padding: "0 20px" }}>{a}</div><div style={{ width: 660, padding: "0 20px" }}>{b}</div>
          </div>
        );
      })}
    </Szene>
  );
};

// ---------- 5 Muster
const Anker5 = () => <Reiter u={1} aktiv={-1} a={0.55} />;
const MusterS = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const R = [["Beispiel 1", "Frau Muster", "Guten Tag Frau Muster,"], ["Beispiel 2", "Herr Beispiel", "Guten Tag Herr Beispiel,"], ["Neu", "Frau Test", "Guten Tag Frau Test,"]];
  const tipp = lin(t, cue(2) - 0.4, cue(2) + 2.4, 0, 1);
  return (
    <Szene titel="Das Muster" tiefe={["repeat", 1500, 640, 800]} anker={<Anker5 />}>
      {R.map(([lab, k, v], i) => (
        <div key={lab} style={{ position: "absolute", left: 90, top: 335 + i * 200, width: 1740, height: 180, borderRadius: 26, background: i === 2 ? C.orange + "14" : C.panel, border: `4px solid ${i === 2 ? C.orange : C.line}`, opacity: o(cue(i === 2 ? 1 : 0) + (i === 1 ? 1.0 : 0.2)), boxSizing: "border-box", padding: "0 36px", display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ width: 230, fontSize: 40, fontWeight: 800, color: i === 2 ? C.orange : C.mute }}>{lab}</div>
          <div style={{ fontSize: 52, fontWeight: 700, width: 560 }}>Kunde: {k}</div>
          <div style={{ fontSize: 60, color: C.mute, width: 80 }}>→</div>
          <div style={{ fontSize: 50, fontWeight: 800, fontFamily: MONO, whiteSpace: "nowrap", color: i === 2 ? C.orange : C.text }}>{i === 2 ? v.slice(0, Math.round(v.length * tipp)) : v}</div>
        </div>
      ))}
      <Etikett x={90} y={935} t="Das Modell erkennt das Muster" f={C.orange} size={44} a={o(cue(2))} />
    </Szene>
  );
};

export default { uebersicht: Uebersicht, mail: MailS, protokoll: ProtokollS, angebote: AngeboteS, muster: MusterS };
