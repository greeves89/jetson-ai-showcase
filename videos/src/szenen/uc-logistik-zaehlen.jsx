import React from "react";
import { Szene, useCues, sp, ease, lerp, C } from "../lib.jsx";
import { Panel, Lbl } from "../bausteine.jsx";
import { Pf, Etikett } from "../neu.jsx";
import { Kn, Kachel, Bg, Ic } from "../bausteine-betrieb.jsx";
import { Foto, Quelle, Gross, boxenVon } from "../bausteine-uc.jsx";

const HOF = "logistik-hafenhof-container.jpg", KLEIN = "logistik-kleintransporter-strasse.jpg";

// ---------- 1 Der Hof: Foto groß, rechts die Frage
const Hof = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Der Hof" tiefe={["truck", 1500, 640, 800]}>
      <Foto name={HOF} x={90} y={215} w={1000} h={667} a={o(0.3)} />
      <Quelle x={110} y={820} a={o(0.6)} />
      <Kachel x={1150} y={215} w={680} h={310} ic="truck" t="Wie viele Fahrzeuge?" f={C.blue} a={o(word(0, "wie viele") - 0.2)} ics={110} size={56} />
      <Kachel x={1150} y={570} w={680} h={312} ic="door" t="Torkontrolle" sub="ohne hinauszugehen" f={C.orange} a={o(word(0, "Torkontrolle") - 0.2)} ics={110} size={56} />
      <Kn x={960} y={952} w={1500} h={70} t="freies Foto, kein Bild aus einem echten Betrieb" ic="image" f={C.mute} size={38} a={o(cue(1))} />
    </Szene>
  );
};

// ---------- 2 Rahmen mit Sicherheit
const Rahmen = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t0 = word(0, "findet jedes");
  const n = Math.min(3, Math.max(0, (t - t0) / 0.9));
  return (
    <Szene titel="Rahmen mit Sicherheit" tiefe={["scan", 1500, 640, 800]}>
      <Foto name={HOF} x={90} y={215} w={1000} h={667} n={n} ls={26} />
      <Gross x={1150} y={215} w={680} h={330} wert={String(Math.floor(n))} label="Lastwagen gezählt" f={C.blue} size={170} a={o(0.4)} />
      <Kn x={1490} y={650} w={680} h={110} t="Klasse und Sicherheit" ic="tag" f={C.green} size={44} a={o(t0 + 0.5)} />
      <Kn x={1490} y={790} w={680} h={110} t="gezählt: über der Schwelle" ic="sliders" f={C.orange} size={44} a={o(word(1, "Gezählt"))} />
      <Kn x={960} y={950} w={1100} h={70} t="Anlernen musst du nichts" ic="check" f={C.mute} size={36} a={o(word(1, "Anlernen"))} />
    </Szene>
  );
};

// ---------- 3 Schwelle: Regler und Rahmen
const Schwelle = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const tn = word(1, "Niedrig");
  const v = lerp(0.8, 0.3, ease(t, tn - 0.2, tn + 2.6));
  const k = (0.8 - v) / 0.5;
  const ky = 280 + k * 560;
  const nR = boxenVon(KLEIN, "0.3").filter((b) => b.c >= v).length;
  return (
    <Szene titel="Die Schwelle" tiefe={["sliders", 1500, 640, 800]}>
      <Foto name={KLEIN} x={90} y={215} w={900} h={675} th="0.3" sel={(b) => b.c >= v - 0.0001} n={99} ls={22} bw={4} />
      <div style={{ position: "absolute", left: 1090, top: 280, width: 14, height: 560, borderRadius: 7, background: C.line, opacity: o(0.4) }} />
      <div style={{ position: "absolute", left: 1062, top: ky - 36, width: 70, height: 70, borderRadius: 35, background: C.orange, border: "6px solid #000", boxShadow: `0 0 30px ${C.orange}88`, opacity: o(0.4) }} />
      <Lbl x={1130} y={250} w={150} t="hoch" size={32} color={C.mute} a={o(0.5)} />
      <Lbl x={1130} y={815} w={150} t="niedrig" size={32} color={C.mute} a={o(0.5)} />
      <Lbl x={1280} y={225} w={550} t={`Schwelle ${Math.round(v * 100)} %`} size={52} color={C.orange} align="center" a={o(0.5)} />
      <Gross x={1280} y={310} w={550} h={280} wert={String(nR)} label="Rahmen" f={C.blue} size={150} a={o(0.5)} />
      <Kn x={1555} y={690} w={550} h={110} t="zuverlässig, aber manches fehlt" ic="check" f={C.green} size={30} a={o(0.8)} />
      <Kn x={1555} y={830} w={550} h={110} t="mehr Treffer, mehr Fehlalarme" ic="alert" f={C.orange} size={30} a={o(tn)} />
    </Szene>
  );
};

// ---------- 4 Was fehlt: Lupe auf die Fahrräder
const MISS = [[268, 430, 72, 63], [188, 435, 34, 54]];
const Luecken = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const t0 = word(0, "findet das");
  const n = Math.min(5, Math.max(0, (t - t0) / 0.5));
  const tf = word(1, "Kleine");
  return (
    <Szene titel="Was fehlt" tiefe={["search", 1500, 640, 800]}>
      <Foto name={KLEIN} x={90} y={215} w={900} h={675} n={n} labels={false} bw={4} />
      <div style={{ position: "absolute", left: 1040, top: 210, opacity: o(0.4) }}><Etikett x={0} y={0} t="Ausschnitt vergrößert" f={C.blue} size={34} flow /></div>
      <Foto name={KLEIN} x={1040} y={270} w={790} h={430} zoom={2.6} fx={0.27} fy={0.62} n={n} labels={false} bw={5} a={o(0.5)}>
        {({ m, s }) => MISS.map(([x, y, w, h], i) => { const [px, py] = m(x, y); return (
          <div key={i} style={{ position: "absolute", left: px, top: py, width: w * s, height: h * s, border: `5px dashed ${C.orange}`, borderRadius: 8, boxSizing: "border-box", opacity: ease(t, tf + i * 0.4, tf + i * 0.4 + 0.5), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, fontWeight: 800, color: C.orange, textShadow: "0 0 10px #000" }}>?</div>
        ); })}
      </Foto>
      <Kn x={1435} y={790} w={790} h={100} t="1 Lastwagen und 4 Fahrräder gefunden" ic="check" f={C.green} size={36} a={o(t0 + 2.4)} />
      <Kn x={1435} y={905} w={790} h={100} t="kleine und verdeckte fehlen" ic="alert" f={C.orange} size={38} a={o(tf)} />
    </Szene>
  );
};

// ---------- 5 Der Pilot: Handzählung als Maßstab
const Pilot = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Der Pilot" tiefe={["scale", 1500, 640, 800]}>
      <Kachel x={140} y={250} w={560} h={400} ic="hand" t="Handzählung" sub="der Maßstab" f={C.blue} a={o(word(0, "Handzählung") - 0.3)} ics={130} size={56} />
      <Kachel x={1220} y={250} w={560} h={400} ic="camera" t="Kamerazahl" sub="aus eigenen Bildern" f={C.green} a={o(word(0, "eigenen Bildern") - 0.3)} ics={130} size={56} />
      <div style={{ position: "absolute", left: 820, top: 340, opacity: o(word(0, "Pilot") + 0.5) }}><Bg name="scale" size={220} color={C.orange} /></div>
      <Kn x={960} y={760} w={1100} h={110} t="Reicht es für deinen Hof?" ic="help" f={C.orange} size={52} a={o(word(0, "reicht") + 0.4)} />
      <Kn x={520} y={910} w={780} h={110} t="oft reicht die Zahl" ic="database" f={C.green} size={44} a={o(cue(1))} />
      <Kn x={1440} y={910} w={780} h={110} t="Regler selbst ziehen" ic="sliders" f={C.blue} size={44} a={o(word(1, "Das Beispiel"))} />
    </Szene>
  );
};

export default { hof: Hof, rahmen: Rahmen, schwelle: Schwelle, luecken: Luecken, pilot: Pilot };
