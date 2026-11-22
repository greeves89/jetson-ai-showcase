import React from "react";
import { Szene, useCues, sp, ease, lerp, C } from "../lib.jsx";
import { Panel, Lbl } from "../bausteine.jsx";
import { Pf, Etikett, Mark } from "../neu.jsx";
import { Kn, Kachel, Bg, Ic } from "../bausteine-betrieb.jsx";
import { Foto, Quelle, Gross, Kopf } from "../bausteine-uc.jsx";

const METRO = "baustelle-metro-pause.jpg", HALLE = "baustelle-halle-montage.jpg", FERNE = "baustelle-neubau-ferne.jpg";

// ---------- 1 Die Baustelle: Foto als Band über die ganze Breite
const Baustelle = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Die Baustelle" tiefe={["hardhat", 1500, 640, 800]}>
      <Foto name={METRO} x={90} y={215} w={1740} h={500} fy={0.52} a={o(0.3)} />
      <Quelle x={110} y={650} a={o(0.6)} />
      <Kn x={330} y={850} w={420} h={110} t="Fahrzeuge fahren" ic="truck" f={C.orange} size={32} a={o(word(0, "Fahrzeuge") - 0.2)} />
      <Kn x={770} y={850} w={420} h={110} t="Lasten schwenken" ic="package" f={C.orange} size={32} a={o(word(0, "Lasten") - 0.2)} />
      <Kn x={1210} y={850} w={420} h={110} t="Menschen mittendrin" ic="user" f={C.orange} size={30} a={o(word(0, "Menschen") - 0.2)} />
      <Kn x={1650} y={850} w={420} h={110} t="Kamera unterstützt" ic="camera" f={C.blue} size={32} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 2 Personen finden: Rahmen zählen
const Personen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t0 = word(0, "findet Personen");
  const n = Math.min(5, Math.max(0, (t - t0) / 0.6));
  return (
    <Szene titel="Personen finden" tiefe={["users", 1500, 640, 800]}>
      <Foto name={METRO} x={90} y={215} w={1740} h={500} fy={0.52} n={n} ls={24} bw={6} />
      <Gross x={110} y={750} w={600} h={230} wert={String(Math.floor(n))} label="Personen gefunden" f={C.orange} size={120} lsize={34} a={o(0.4)} />
      <Kn x={1270} y={865} w={1100} h={130} t="Als Klasse steht immer nur: Person" ic="tag" f={C.blue} size={48} a={o(cue(1) - 0.3)} />
    </Szene>
  );
};

// ---------- 3 Helm oder nicht: Ausschnitt vergrößert
const Helm = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Helm oder nicht" tiefe={["hardhat", 1500, 640, 800]}>
      <Foto name={METRO} x={110} y={250} w={900} h={560} zoom={3.1} fx={0.22} fy={0.52} n={99} ls={34} bw={6} a={o(0.3)} />
      <Etikett x={130} y={270} t="Ausschnitt vergrößert" f={C.blue} size={32} a={o(0.5)} />
      <Kachel x={1100} y={250} w={730} h={260} ic="hardhat" t="Helm?" sub="weiß das Modell nicht" f={C.orange} a={o(word(0, "Helm") - 0.2)} ics={84} size={56} />
      <Kachel x={1100} y={550} w={730} h={260} ic="eye" t="Warnweste?" sub="weiß das Modell nicht" f={C.orange} a={o(word(0, "Warnwesten") - 0.5)} ics={84} size={56} />
      <Kn x={960} y={900} w={1000} h={110} t="die häufigste Fehlannahme" ic="alert" f={C.red} size={52} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 4 Wer fehlt: zwei Fotos nebeneinander
const Fehlen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const th = word(0, "Werkhalle"), tg = word(1, "Großbaustelle");
  const n1 = Math.min(17, Math.max(0, (t - th) * 5)), n2 = Math.min(2, Math.max(0, (t - tg) / 0.6));
  return (
    <Szene titel="Wer fehlt" tiefe={["users", 1500, 640, 800]}>
      <Foto name={HALLE} x={90} y={215} w={720} h={738} n={n1} labels={false} bw={4} farbe={(b) => (b.k === "person" ? C.orange : C.red)} a={o(0.3)} />
      <Foto name={FERNE} x={870} y={215} w={960} h={540} n={n2} sel={(b) => b.k === "person"} ls={26} bw={6} a={o(0.4)} />
      <Kn x={1350} y={830} w={960} h={100} t="Werkhalle: 16 erkannt, mehr im Bild" ic="alert" f={C.orange} size={38} a={o(th + 1.2)} />
      <Kn x={1350} y={940} w={960} h={90} t="Großbaustelle: 2 erkannt, die meisten zu klein" ic="alert" f={C.orange} size={34} a={o(tg + 1.0)} />
    </Szene>
  );
};

// ---------- 5 Helme anlernen: zwei Klassen, gezeichnete Köpfe
const Anlernen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t1 = word(0, "mit Helm"), t2 = word(0, "ohne");
  const Stapel = ({ x, helm, f, n, ta }) => (
    <>
      <Panel x={x} y={250} w={780} h={470} rand={f} a={o(ta - 0.3)} />
      <Lbl x={x} y={265} w={780} t={n} size={44} color={f} align="center" a={o(ta - 0.2)} />
      {Array.from({ length: 6 }).map((_, i) => <Kopf key={i} cx={x + 150 + (i % 3) * 240} cy={430 + Math.floor(i / 3) * 170} r={52} helm={helm} a={sp(t, ta + i * 0.15, 0.5)} />)}
    </>
  );
  return (
    <Szene titel="Helme anlernen" tiefe={["hardhat", 1500, 640, 800]}>
      <Stapel x={110} helm f="#f2c200" n="mit Helm" ta={t1} />
      <Stapel x={1040} helm={false} f={C.mute} n="ohne Helm" ta={t2} />
      <Kn x={480} y={850} w={760} h={120} t="Nahaufnahmen: klappt" ic="check" f={C.green} size={46} a={o(word(1, "Nahaufnahmen") - 0.2)} />
      <Kn x={1400} y={850} w={880} h={120} t="Gesamtbild: eigenes Modell" ic="scan" f={C.orange} size={46} a={o(word(1, "Gesamtbild") - 0.2)} />
    </Szene>
  );
};

// ---------- 6 Vorher klären: Absperrung ist die Grundlage
const Mitbest = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Vorher klären" tiefe={["shield", 1500, 640, 800]}>
      <Panel x={110} y={250} w={820} h={470} rand={C.orange} a={o(0.3)} />
      <Lbl x={110} y={270} w={820} t="Absperrung und Einweisung" size={44} color={C.orange} align="center" a={o(0.4)} />
      <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: o(0.5) }}>
        <defs><pattern id="band" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="40" height="80" fill="#e5e5ea" /><rect x="40" width="40" height="80" fill={C.red} /></pattern></defs>
        <rect x={150} y={400} width={740} height={70} rx={8} fill="url(#band)" transform="rotate(-4 520 435)" />
        <rect x={190} y={380} width={16} height={230} rx={6} fill={C.mute} /><rect x={830} y={390} width={16} height={230} rx={6} fill={C.mute} />
      </svg>
      <div style={{ position: "absolute", left: 460, top: 520, opacity: o(0.7) }}><Bg name="hardhat" size={140} color={C.orange} /></div>
      <Panel x={560} y={560} w={450} h={230} rand={C.blue} a={o(word(0, "ergänzt") - 0.3)} bg="#10202f" />
      <div style={{ position: "absolute", left: 600, top: 600, display: "flex", alignItems: "center", gap: 20, opacity: o(word(0, "ergänzt") - 0.2) }}><Ic name="camera" size={90} color={C.blue} /><div style={{ fontSize: 44, fontWeight: 700, color: C.blue }}>ergänzt</div></div>
      <Kn x={1470} y={310} w={720} h={110} t="Zweck" ic="target" f={C.blue} size={46} a={o(word(0, "Zweck") - 0.2)} />
      <Kn x={1470} y={450} w={720} h={110} t="Datenschutz" ic="lock" f={C.blue} size={46} a={o(word(0, "Datenschutz") - 0.2)} />
      <Kn x={1470} y={590} w={720} h={110} t="Mitbestimmung" ic="users" f={C.blue} size={46} a={o(word(0, "Mitbestimmung") - 0.2)} />
      <Kn x={960} y={880} w={1500} h={120} t="Nicht erkannt heißt nicht: niemand da" ic="alert" f={C.orange} size={52} a={o(cue(1))} />
    </Szene>
  );
};

export default { baustelle: Baustelle, personen: Personen, helm: Helm, fehlen: Fehlen, anlernen: Anlernen, mitbestimmung: Mitbest };
