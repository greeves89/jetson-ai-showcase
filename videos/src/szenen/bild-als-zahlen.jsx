import React from "react";
import { Szene, useCues, sp, ease, lin, lerp, Rv, Icon, Badge, C, rnd } from "../lib.jsx";
import { Panel, Lbl, Chip, Lin } from "../bausteine.jsx";
import { Zeile, Pf, MONO, Etikett } from "../neu.jsx";
import foto from "../img/tassen.jpg";
import f192 from "../img/tassen-192x128.png";
import f96 from "../img/tassen-96x64.png";
import f48 from "../img/tassen-48x32.png";
import f24 from "../img/tassen-24x16.png";
import f12 from "../img/tassen-12x8.png";
import D from "../img/tassen-24x16.json";

const BX = 90, BY = 210, BW = 1080, BH = 720, CELL = 45;
const RX = 1230, RW = 600;
const lum = (p) => Math.round(0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]);
const G = D.px.map(lum);
const C0 = 13, R0 = 8, ZC = 15, ZR = 9; // Ausschnitt 6x4 Zellen, Einzelzelle
const SUB = [C0 * CELL, R0 * CELL, 6 * CELL];
const ONE = [ZC * CELL + 22.5 - 90, ZR * CELL + 22.5 - 60, 180];
const viewMix = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const FULL = [0, 0, BW];
const zellenPx = D.px[ZR * 24 + ZC];

// Das Bild als Anker: Foto, Pixelstufen, Zellen mit Zahlen, Zoom
function PixelFeld({ ops = { foto: 1 }, raster = 0, grau = 0, zahlen = 0, view = FULL, ring = 0, filter, geo = [BX, BY, BW], zellen = 0, fuell }) {
  const [vx, vy, vw] = view, sc = BW / vw, [gx, gy, gw] = geo, gs = gw / BW;
  const L = [["foto", foto], ["i192", f192], ["i96", f96], ["i48", f48], ["i24", f24], ["i12", f12]];
  return (
    <div style={{ position: "absolute", left: gx, top: gy, width: BW, height: BH, transformOrigin: "0 0", transform: `scale(${gs})`, overflow: "hidden", borderRadius: 24, border: `${3 / gs}px solid ${C.line}`, boxSizing: "border-box", background: "#000", filter }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH, transformOrigin: "0 0", transform: `translate(${-vx * sc}px, ${-vy * sc}px) scale(${sc})` }}>
        {L.map(([k, src]) => (ops[k] ?? 0) > 0.001 && <img key={k} src={src} style={{ position: "absolute", left: 0, top: 0, width: BW, height: BH, opacity: ops[k], imageRendering: k === "foto" ? "auto" : "pixelated" }} />)}
        {zellen > 0 && (
          <div style={{ position: "absolute", inset: 0, opacity: zellen, filter: grau > 0 ? `grayscale(${grau})` : undefined }}>
            {D.px.map((p, i) => {
              const c = i % 24, r = Math.floor(i / 24), inSub = c >= C0 && c < C0 + 6 && r >= R0 && r < R0 + 4;
              return (
                <div key={i} style={{ position: "absolute", left: c * CELL, top: r * CELL, width: CELL, height: CELL, background: `rgb(${p[0]},${p[1]},${p[2]})`, boxShadow: raster > 0 ? `inset 0 0 0 ${1.6 * raster}px rgba(0,0,0,0.6)` : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {zahlen > 0 && inSub && <span style={{ fontSize: 16, fontWeight: 700, fontFamily: MONO, color: G[i] > 120 ? "#111" : "#fff", opacity: zahlen, filter: "none" }}>{G[i]}</span>}
                </div>
              );
            })}
          </div>
        )}
        {ring > 0 && <div style={{ position: "absolute", left: ZC * CELL - 7, top: ZR * CELL - 7, width: CELL + 14, height: CELL + 14, borderRadius: 8, border: `${5 / sc}px solid ${C.orange}`, opacity: ring, boxSizing: "border-box" }} />}
        </div>
      {fuell}
    </div>
  );
}
const stufeOps = (s) => ({ foto: Math.max(0, 1 - Math.abs(s)), i192: Math.max(0, 1 - Math.abs(s - 1)), i96: Math.max(0, 1 - Math.abs(s - 2)), i48: Math.max(0, 1 - Math.abs(s - 3)), i24: Math.max(0, 1 - Math.abs(s - 4)) });

// ---------- 1 Foto
const Anker1 = () => {
  const { t, cue } = useCues();
  const s = ease(t, cue(2) - 0.3, cue(2) + 1.9, 0, 4);
  const vw = lerp(980, 1080, ease(t, 0, 3));
  return <PixelFeld ops={stufeOps(s)} view={[(1080 - vw) / 2, (720 - vw / 1.5) / 2, vw]} />;
};
const Foto = () => {
  const { t, cue, word } = useCues();
  const zahlT = word(1, "Zahlen");
  const rain = ease(t, zahlT, zahlT + 0.6);
  const nr = Math.floor(t * 3);
  return (
    <Szene titel="Ein Foto" tiefe={["camera", 1500, 640, 800]} anker={<Anker1 />}>
      <Panel x={RX} y={BY} w={RW} h={BH} r={24}>
        <Lbl x={0} y={250} w={RW} t="Tasse" size={150} align="center" color={C.text} a={(1 - rain) * sp(t, cue(0) + 0.5, 0.6)} />
        <div style={{ position: "absolute", left: RW / 2 - 100, top: 230, opacity: (1 - rain) * sp(t, word(1, "keine"), 0.5) }}><Icon name="x" size={200} color={C.red} sw={2.6} /></div>
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 30 + (i % 4) * 140, top: 30 + Math.floor(i / 4) * 76, fontFamily: MONO, fontSize: 52, fontWeight: 700, color: i % 5 === 0 ? C.orange : C.blue, opacity: rain * (0.55 + 0.45 * rnd(i + nr)) }}>{String(Math.floor(rnd(i * 3 + nr) * 256)).padStart(3, "0")}</div>
        ))}
      </Panel>
      <Etikett x={BX + 24} y={BY + BH - 100} t="24 × 16 Pixel" size={50} a={sp(t, cue(2) + 1.4, 0.5)} />
    </Szene>
  );
};

// ---------- 2 Raster
const HERZ = ["..XX.XX..", ".XXXXXXX.", ".XXXXXXX.", "..XXXXX..", "...XXX...", "....X...."];
const Anker2 = () => {
  const { t, cue } = useCues();
  return <PixelFeld ops={{ i24: 1 }} zellen={ease(t, 0, 0.3)} raster={ease(t, 0.3, 1.3)} ring={sp(t, cue(1) - 0.2, 0.5)} />;
};
const Raster = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.6);
  const px = zellenPx;
  return (
    <Szene titel="Das Raster" tiefe={["grid", 1500, 640, 800]} anker={<Anker2 />}>
      <Etikett x={BX + 24} y={BY + BH - 100} t="24 × 16 Pixel" size={50} />
      <Panel x={RX} y={BY} w={RW} h={230} r={24} a={o(cue(1) - 0.1)}>
        <div style={{ position: "absolute", left: 30, top: 35, width: 160, height: 160, borderRadius: 18, background: `rgb(${px[0]},${px[1]},${px[2]})`, border: `4px solid ${C.orange}` }} />
        <Lbl x={220} y={50} w={360} t="1 Pixel" size={64} />
        <Lbl x={220} y={130} w={360} t="1 Farbe" size={64} color={C.orange} />
      </Panel>
      <Lin x1={BX + 15 * 45 + 60} y1={BY + 9 * 45 + 25} x2={RX - 10} y2={BY + 115} p={ease(t, cue(1), cue(1) + 0.7)} f={C.orange} w={5} dash="12 10" />
      <Panel x={RX} y={BY + 260} w={RW} h={460} r={24} a={o(word(1, "Kreuzstich") - 0.4)}>
        <div style={{ position: "absolute", left: 40, top: 40 }}>
          {HERZ.map((row, r) => row.split("").map((ch, c) => (
            <div key={r + "-" + c} style={{ position: "absolute", left: c * 58, top: r * 58, width: 54, height: 54, borderRadius: 6, background: "#2c2c2e", opacity: o(word(1, "Kreuzstich") - 0.3 + (r + c) * 0.03) }}>
              {ch === "X" && <Icon name="x" size={54} color={C.red} sw={3.2} />}
            </div>
          )))}
        </div>
        <Lbl x={0} y={385} w={RW} t="Kreuzstich" size={52} align="center" color={C.mute} />
      </Panel>
    </Szene>
  );
};

// ---------- 3 Helligkeit (Zoom auf 6 x 4 Zellen, Zahlen)
const Anker3 = () => {
  const { t, cue } = useCues();
  const u = ease(t, 0.4, 2.6);
  return <PixelFeld ops={{ i24: 1 }} zellen={1} raster={1} grau={ease(t, 0, 1.2)} view={viewMix(FULL, SUB, u)} zahlen={ease(t, 2.2, 3.0)} />;
};
const Grau = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  const hl = (w) => (t > word(1, w) ? 1 : 0);
  return (
    <Szene titel="Helligkeit" tiefe={["image", 1500, 640, 800]} anker={<Anker3 />}>
      <Panel x={RX} y={BY} w={RW} h={BH} r={24} a={o(cue(1) - 0.2)}>
        <div style={{ position: "absolute", left: 40, top: 50, width: 150, height: 620, borderRadius: 20, background: "linear-gradient(#fff, #000)", border: `3px solid ${C.line}` }} />
        {[["255", "Weiß", 50], ["128", "Grau", 310], ["0", "Schwarz", 590]].map(([n, w, y], i) => (
          <React.Fragment key={n}>
            <Lbl x={230} y={y - 10} w={330} t={n} size={84} weight={800} color={C.text} a={o(cue(1) + i * 0.5)} />
            <Lbl x={230} y={y + 74} w={330} t={w} size={44} color={C.mute} a={o(cue(1) + i * 0.5)} />
          </React.Fragment>
        ))}
      </Panel>
    </Szene>
  );
};

// ---------- 4 Drei Kanäle
const KANAL = [["Rot", C.red], ["Grün", C.green], ["Blau", C.blue]];
const Anker4 = () => {
  const { t, cue, word } = useCues();
  const u = ease(t, 0, 1.6);
  const buehne = ease(t, cue(1) - 0.3, cue(1) + 0.4);
  const r = 255, g = t > word(1, "Rot und Grün") + 0.6 ? 255 : 0, b = t > word(1, "Alle drei") ? 255 : 0;
  const ci = (x, y, f, an) => <div style={{ position: "absolute", left: x - 230, top: y - 230, width: 460, height: 460, borderRadius: 230, background: f, mixBlendMode: "screen", opacity: an }} />;
  const an = (a) => ease(t, a, a + 0.5);
  const bg = (
    <div style={{ position: "absolute", inset: 0, background: "#000", opacity: buehne }}>
      {ci(380, 290, "#ff0000", an(cue(1) + 0.3))}
      {ci(700, 290, "#00ff00", an(word(1, "Rot und Grün") + 0.5))}
      {ci(540, 480, "#0000ff", an(word(1, "Alle drei")))}
    </div>
  );
  return <PixelFeld ops={{ i24: 1 }} zellen={1} raster={1} grau={1 - ease(t, 0, 1.0)} view={viewMix(SUB, ONE, u)} zahlen={1 - ease(t, 0, 0.4)} ring={ease(t, 1.2, 1.8)} fuell={bg} />;
};
const Farbe = () => {
  const { t, cue, word } = useCues();
  const px = zellenPx, o = (a) => sp(t, a, 0.7);
  const buehne = t > cue(1) - 0.2;
  const werte = buehne ? [255, t > word(1, "Rot und Grün") + 0.6 ? 255 : 0, t > word(1, "Alle drei") ? 255 : 0] : [px[0], px[1], px[2]];
  return (
    <Szene titel="Drei Kanäle" tiefe={["eye", 1500, 640, 800]} anker={<Anker4 />}>
      <Panel x={RX} y={BY} w={RW} h={BH} r={24} a={o(1.2)}>
        {KANAL.map(([n, f], i) => (
          <React.Fragment key={n}>
            <Lbl x={36} y={64 + i * 215} w={300} t={n} size={56} color={f} />
            <Lbl x={330} y={50 + i * 215} w={240} t={String(werte[i])} size={110} weight={800} align="right" color={C.text} />
            <div style={{ position: "absolute", left: 36, top: 150 + i * 215, width: 528, height: 34, borderRadius: 17, background: "#2c2c2e" }}>
              <div style={{ width: 528 * werte[i] / 255, height: 34, borderRadius: 17, background: f }} />
            </div>
          </React.Fragment>
        ))}
      </Panel>
      <Etikett x={BX + 24} y={BY + BH - 100} t="Gelb" f="#ffd60a" size={58} a={buehne && t > word(1, "Gelb") ? 1 : 0} />
      <Etikett x={BX + 220} y={BY + BH - 100} t="Weiß" f="#ffffff" size={58} a={t > word(1, "Alle drei") + 0.8 ? 1 : 0} />
    </Szene>
  );
};

// ---------- 5 Auflösung
const STUFEN = [["12 × 8", 12, 8, "i12"], ["24 × 16", 24, 16, "i24"], ["96 × 64", 96, 64, "i96"], ["192 × 128", 192, 128, "i192"]];
const fmt = (n) => n.toLocaleString("de-DE");
const Anker5 = () => {
  const { t, cue } = useCues();
  const T = [0.2, 1.0, 1.8, 2.6];
  const ops = { i12: 0, i24: 0, i96: 0, i192: 0, foto: 0 };
  const idx = T.filter((x) => t >= x).length - 1;
  const keys = ["i12", "i24", "i96", "i192"];
  keys.forEach((k, i) => { ops[k] = i === idx ? 1 : 0; });
  if (idx >= 0) ops[keys[idx]] = ease(t, T[idx], T[idx] + 0.25);
  if (idx > 0) ops[keys[idx - 1]] = 1 - ease(t, T[idx], T[idx] + 0.25);
  if (idx < 0) ops.i24 = 1;
  return <PixelFeld ops={ops} />;
};
const Groesse = () => {
  const { t, cue, word } = useCues();
  const T = [0.2, 1.0, 1.8, 2.6], idx = T.filter((x) => t >= x).length - 1;
  return (
    <Szene titel="Auflösung" tiefe={["grid", 1500, 640, 800]} anker={<Anker5 />}>
      <Panel x={RX} y={BY} w={RW} h={BH} r={24}>
        {STUFEN.map(([n, w, h], i) => {
          const an = sp(t, T[i], 0.5), akt = idx === i;
          return (
            <div key={n} style={{ position: "absolute", left: 24, top: 24 + i * 172, width: RW - 48, height: 156, borderRadius: 18, background: akt ? C.blue + "22" : "transparent", border: `3px solid ${akt ? C.blue : "transparent"}`, opacity: an, boxSizing: "border-box" }}>
              <div style={{ position: "absolute", left: 22, top: 16, fontFamily: MONO, fontSize: 44, fontWeight: 700, color: C.mute }}>{n} × 3</div>
              <div style={{ position: "absolute", left: 22, top: 70, fontSize: 68, fontWeight: 800, color: akt ? C.text : C.mute }}>{fmt(w * h * 3)}</div>
            </div>
          );
        })}
      </Panel>
      <Etikett x={BX + 24} y={BY + BH - 100} t="Speicher" size={50} a={sp(t, word(1, "Speicher"), 0.5)} />
      <Etikett x={BX + 300} y={BY + BH - 100} t="Rechenzeit" size={50} a={sp(t, word(1, "Rechenzeit"), 0.5)} />
    </Szene>
  );
};

// ---------- 6 Hell und dunkel
const bins = (faktor) => { const b = Array(16).fill(0); G.forEach((g) => { b[Math.min(15, Math.floor(Math.min(255, g * faktor) / 16))]++; }); return b; };
const Anker6 = () => {
  const { t, cue } = useCues();
  const hell = ease(t, 0.2, cue(1) - 1.2, 1, 2.8), dunkel = ease(t, cue(1) - 0.8, cue(1) + 0.4, 0, 1);
  const f = t < cue(1) - 1.0 ? hell : lerp(2.8, 0.28, dunkel);
  return <PixelFeld ops={{ foto: 1 }} filter={`brightness(${f.toFixed(3)})`} />;
};
const Licht = () => {
  const { t, cue } = useCues();
  const hell = ease(t, 0.2, cue(1) - 1.2, 1, 2.8), dunkel = ease(t, cue(1) - 0.8, cue(1) + 0.4, 0, 1);
  const f = t < cue(1) - 1.0 ? hell : lerp(2.8, 0.28, dunkel);
  const b = bins(f), mx = 130;
  const rausch = ease(t, cue(1) + 0.2, cue(1) + 1.0), nr = Math.floor(t * 10);
  return (
    <Szene titel="Hell und dunkel" tiefe={["bulb", 1500, 640, 800]} anker={<Anker6 />}>
      {rausch > 0 && Array.from({ length: 520 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: BX + 12 + rnd(i * 7 + nr) * (BW - 24), top: BY + 12 + rnd(i * 11 + nr * 3) * (BH - 24), width: 9, height: 9, background: rnd(i + nr) > 0.5 ? "#fff" : "#000", opacity: rausch * 0.55 }} />
      ))}
      <Panel x={RX} y={BY} w={RW} h={BH} r={24}>
        <Lbl x={30} y={26} w={540} t="Werte der Pixel" size={44} color={C.mute} />
        {b.map((n, i) => (
          <div key={i} style={{ position: "absolute", left: 30 + i * 34, top: 560 - Math.min(480, 480 * n / mx), width: 30, height: Math.min(480, 480 * n / mx), borderRadius: 5, background: i === 15 && f > 1.4 ? C.red : i < 2 && f < 0.5 ? C.orange : C.blue }} />
        ))}
        <Lbl x={20} y={585} w={120} t="0" size={44} color={C.mute} />
        <Lbl x={440} y={585} w={130} t="255" size={44} color={C.mute} align="right" />
        <Chip x={30} y={640} t="Details weg" f={C.red} size={44} a={sp(t, cue(0) + 1.0, 0.5) * (1 - dunkel)} />
        <Chip x={30} y={640} t="Rauschen" f={C.orange} size={44} a={sp(t, cue(1) + 0.4, 0.5)} />
      </Panel>
    </Szene>
  );
};

// ---------- 7 Labor
const Anker7 = () => {
  const { t, cue } = useCues();
  const u = ease(t, cue(0) + 0.9, cue(0) + 2.2);
  return <PixelFeld ops={{ foto: 1 }} geo={[lerp(BX, 90, u), lerp(BY, 330, u), lerp(BW, 700, u)]} />;
};
const Labor = () => {
  const { t, cue, word } = useCues();
  const o = (a) => sp(t, a, 0.7);
  return (
    <Szene titel="Im Labor" tiefe={["cpu", 1500, 640, 800]} anker={<Anker7 />}>
      <Lbl x={90} y={820} w={700} t="Kamerabild 1920 × 1080" size={48} align="center" color={C.mute} a={o(cue(0) + 2.2)} />
      <Pf x1={815} y1={563} x2={885} y2={563} p={ease(t, cue(1) - 0.1, cue(1) + 0.5)} f={C.blue} />
      <Panel x={905} y={390} w={460} h={345} r={20} a={o(cue(1) + 0.3)} style={{ overflow: "hidden" }}><img src={foto} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Panel>
      <Lbl x={905} y={760} w={460} t="480 × 360" size={64} weight={800} align="center" color={C.orange} a={o(word(1, "480"))} />
      <Pf x1={1385} y1={563} x2={1465} y2={563} p={ease(t, cue(2) - 1.4, cue(2) - 0.8)} f={C.blue} />
      <div style={{ position: "absolute", left: 1485, top: 400, opacity: o(cue(2) - 1.0) }}><Badge name="cpu" size={320} color={C.green} glow={1} /></div>
      <Lbl x={1485} y={740} w={320} t="Jetson" size={64} weight={800} align="center" color={C.green} a={o(cue(2) - 0.8)} />
      <Chip x={905} y={880} t="schneller" f={C.green} size={48} a={o(word(2, "spart"))} />
      <Chip x={1175} y={880} t="weniger Details" f={C.orange} size={48} a={o(word(2, "kostet"))} />
    </Szene>
  );
};

export default { foto: Foto, raster: Raster, grau: Grau, farbe: Farbe, groesse: Groesse, licht: Licht, labor: Labor };
