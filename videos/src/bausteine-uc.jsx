import React from "react";
import { C, sp, ease, lerp, rnd, Icon } from "./lib.jsx";
import { Panel, Lbl } from "./bausteine.jsx";
import { Ic } from "./bausteine-betrieb.jsx";
import { BILD } from "./bilder-uc.js";
import BOX from "./boxen-uc.json";

// ---- Bildkachel aus den Beispieldaten (Schlüssel wie in app/static/beispiele)
export const Pic = ({ k, x, y, w, h, a = 1, rand = C.line, bw = 3, r = 14, rot = 0, s = 1, flip, style, children, glow }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: r, overflow: "hidden", border: `${bw}px solid ${rand}`, boxSizing: "border-box", transform: `rotate(${rot}deg) scale(${s})`, background: "#111", boxShadow: glow ? `0 0 44px ${glow}99` : "none", ...style }}>
    <img src={BILD[k]} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: flip ? "scaleX(-1)" : undefined }} />
    {children}
  </div>
);

export const KL = { truck: "Lastwagen", bicycle: "Fahrrad", person: "Person", bottle: "Flasche", refrigerator: "Kühlschrank", train: "Zug", car: "Auto", cup: "Tasse", "dining table": "Tisch" };
const KF = { truck: C.blue, bicycle: C.green, person: C.orange, bottle: C.blue, refrigerator: C.red, train: C.red, car: C.blue, cup: C.green };

// Foto mit echten Erkennungsrahmen (boxen-uc.json, YOLOX-tiny, Schwelle th).
// Container x,y,w,h; zoom/fx/fy wählen den Ausschnitt; n = Anzahl sichtbarer Rahmen (auch gebrochen); sel filtert; kind(box) -> Text.
export const Foto = ({ name, x, y, w, h, zoom = 1, fx = 0.5, fy = 0.5, a = 1, th = "0.5", n = 0, sel, labels = true, ls = 24, bw = 5, rand = C.line, farbe, mindest = 0, children, r = 16, nurRahmen }) => {
  const [W, H] = BOX[name].wh;
  const s = Math.max((w / W) * zoom, h / H);
  const L = Math.min(0, Math.max(w - W * s, w / 2 - fx * W * s)), T = Math.min(0, Math.max(h - H * s, h / 2 - fy * H * s));
  const m = (px, py) => [L + px * s, T + py * s];
  const boxen = (BOX[name][th] ?? []).filter((b) => (sel ? sel(b) : true));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: r, overflow: "hidden", border: `3px solid ${rand}`, boxSizing: "border-box", background: "#111" }}>
      <img src={BILD["fotos/" + name]} style={{ position: "absolute", left: L, top: T, width: W * s, height: H * s, maxWidth: "none" }} />
      {boxen.map((b, i) => {
        const v = Math.min(1, Math.max(0, n - i));
        if (v <= 0) return null;
        const [bx, by] = m(b.b[0], b.b[1]);
        const f = farbe ? farbe(b) : KF[b.k] ?? C.blue;
        return (
          <div key={i} style={{ position: "absolute", left: bx, top: by, width: b.b[2] * s, height: b.b[3] * s, border: `${typeof bw === "function" ? bw(b) : bw}px solid ${f}`, borderRadius: 6, boxSizing: "border-box", opacity: v, background: f + "1a", transform: `scale(${lerp(1.08, 1, v)})` }}>
            {labels && <div style={{ position: "absolute", left: -5, top: -ls - 12, whiteSpace: "nowrap", fontSize: ls, fontWeight: 700, color: "#fff", background: f, borderRadius: 6, padding: "2px 10px", lineHeight: 1.15 }}>{(KL[b.k] ?? b.k) + " " + Math.round(b.c * 100) + " %"}</div>}
          </div>
        );
      })}
      {children && children({ m, s, L, T })}
    </div>
  );
};
export const anzahl = (name, th = "0.5", sel) => (BOX[name][th] ?? []).filter((b) => (sel ? sel(b) : true)).length;
export const boxenVon = (name, th = "0.5") => BOX[name][th] ?? [];

// Quellenhinweis auf Fotos
export const Quelle = ({ x, y, t = "Beispiel, Quelle: Wikimedia Commons", a = 1, size = 28 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: a, fontSize: size, fontWeight: 600, color: C.text, background: "#000000cc", border: `2px solid ${C.mute}`, borderRadius: 12, padding: "4px 16px", whiteSpace: "nowrap" }}>{t}</div>
);

// Große Zahl mit Beschriftung, mittig im Kasten
export const Gross = ({ x, y, w = 600, h = 300, wert, label, f = C.green, a = 1, size = 150, lsize = 38, ic }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: 28, background: C.panel, border: `3px solid ${f}`, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center", padding: "0 20px", transform: `scale(${lerp(0.94, 1, Math.min(1, a))})` }}>
    {ic && <Ic name={ic} size={56} color={f} />}
    <div style={{ fontSize: size, fontWeight: 800, color: f, lineHeight: 1, letterSpacing: -2, whiteSpace: "nowrap" }}>{wert}</div>
    <div style={{ fontSize: lsize, fontWeight: 600, color: C.mute, lineHeight: 1.15 }}>{label}</div>
  </div>
);

// Ring mit Anteil p (0..1) und Text in der Mitte
export const Ring = ({ cx, cy, r = 150, p = 1, f = C.green, w = 30, t, sub, a = 1, tsize = 80 }) => (
  <div style={{ opacity: a }}>
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.line} strokeWidth={w} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={f} strokeWidth={w} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * r * p} ${2 * Math.PI * r}`} transform={`rotate(-90 ${cx} ${cy})`} />
    </svg>
    <div style={{ position: "absolute", left: cx - r, top: cy - tsize * 0.75, width: 2 * r, textAlign: "center", fontSize: tsize, fontWeight: 800, color: f, lineHeight: 1 }}>{t}</div>
    {sub && <div style={{ position: "absolute", left: cx - r, top: cy + tsize * 0.4, width: 2 * r, textAlign: "center", fontSize: 32, fontWeight: 600, color: C.mute }}>{sub}</div>}
  </div>
);

// Punktefeld: n von gesamt gefüllt (cols Spalten), Reihenfolge von links oben
export const Punkte = ({ x, y, gesamt, voll, cols = 10, d = 34, gap = 10, f = C.green, a = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: a }}>
    {Array.from({ length: gesamt }).map((_, i) => {
      const v = Math.min(1, Math.max(0, voll - i));
      return <div key={i} style={{ position: "absolute", left: (i % cols) * (d + gap), top: Math.floor(i / cols) * (d + gap), width: d, height: d, borderRadius: d / 2, background: v > 0 ? f : C.panel2, border: `2px solid ${v > 0 ? f : C.line}`, boxSizing: "border-box", transform: `scale(${lerp(0.6, 1, v)})` }} />;
    })}
  </div>
);

// Sprechblase, links oder rechts
export const Blase = ({ x, y, w = 700, h, t, rechts, f = C.blue, a = 1, size = 44, mono, ic, color = C.text }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, transform: `translateY(${(1 - Math.min(1, a)) * 22}px)`, background: rechts ? f + "33" : C.panel2, border: `3px solid ${rechts ? f : C.line}`, borderRadius: rechts ? "28px 28px 6px 28px" : "28px 28px 28px 6px", boxSizing: "border-box", padding: "16px 26px", fontSize: size, fontWeight: 600, color, lineHeight: 1.2, fontFamily: mono ? 'ui-monospace, "SF Mono", Menlo, monospace' : undefined, display: "flex", alignItems: "center", gap: 16 }}>
    {ic && <Ic name={ic} size={size * 1.3} color={f} />}
    <div>{t}</div>
  </div>
);

// Gezeichnetes Gesicht (Strichzeichnung). maske: Mundschutz, dunkel: Gegenlicht-Silhouette, rot: Neigung in Grad
export const Gesicht = ({ cx, cy, r = 130, maske, dunkel, rot = 0, a = 1 }) => {
  const k = dunkel ? "#15151a" : "#e8c9a8", au = dunkel ? "#15151a" : "#2b2118";
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", opacity: a }}>
      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy + r * 0.95} rx={r * 1.15} ry={r * 0.7} fill={dunkel ? "#15151a" : "#35507a"} />
        <ellipse cx={cx} cy={cy} rx={r * 0.82} ry={r} fill={k} />
        <circle cx={cx - r * 0.3} cy={cy - r * 0.15} r={r * 0.09} fill={au} />
        <circle cx={cx + r * 0.3} cy={cy - r * 0.15} r={r * 0.09} fill={au} />
        {!dunkel && <path d={`M${cx - r * 0.28} ${cy + r * 0.45} Q${cx} ${cy + r * 0.62} ${cx + r * 0.28} ${cy + r * 0.45}`} stroke={au} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />}
        {maske && <path d={`M${cx - r * 0.78} ${cy + r * 0.12} H${cx + r * 0.78} Q${cx + r * 0.7} ${cy + r * 0.98} ${cx} ${cy + r * 1.0} Q${cx - r * 0.7} ${cy + r * 0.98} ${cx - r * 0.78} ${cy + r * 0.12} Z`} fill="#bcd7ee" stroke="#7aa3c4" strokeWidth="4" />}
      </g>
    </svg>
  );
};

// Kopf mit/ohne Helm (gezeichnet)
export const Kopf = ({ cx, cy, r = 70, helm, a = 1 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", opacity: a }}>
    <ellipse cx={cx} cy={cy + r * 1.35} rx={r * 1.1} ry={r * 0.6} fill="#35507a" />
    <ellipse cx={cx} cy={cy} rx={r * 0.8} ry={r} fill="#e8c9a8" />
    <circle cx={cx - r * 0.28} cy={cy + r * 0.05} r={r * 0.07} fill="#2b2118" />
    <circle cx={cx + r * 0.28} cy={cy + r * 0.05} r={r * 0.07} fill="#2b2118" />
    {helm ? <g><path d={`M${cx - r * 0.95} ${cy - r * 0.2} Q${cx - r * 0.9} ${cy - r * 1.5} ${cx} ${cy - r * 1.5} Q${cx + r * 0.9} ${cy - r * 1.5} ${cx + r * 0.95} ${cy - r * 0.2} Z`} fill="#f2c200" /><rect x={cx - r * 1.1} y={cy - r * 0.28} width={r * 2.2} height={r * 0.2} rx={r * 0.08} fill="#d9a800" /></g>
      : <path d={`M${cx - r * 0.78} ${cy - r * 0.35} Q${cx} ${cy - r * 1.35} ${cx + r * 0.78} ${cy - r * 0.35} Q${cx} ${cy - r * 0.7} ${cx - r * 0.78} ${cy - r * 0.35}`} fill="#4a3a2a" />}
  </svg>
);

// Klangwelle aus Balken. lauf = Zeit, laut = 0..1 Grundlautstärke, raus = zusätzliches Rauschen 0..1
export const Welle = ({ x, y, w, h, n = 40, t = 0, laut = 1, rausch = 0, f = C.blue, a = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a }}>
    {Array.from({ length: n }).map((_, i) => {
      const e = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.37 + t * 3.1) * Math.sin(i * 0.11 + t * 1.3 + 1));
      const z = rausch * (rnd(i * 3.3 + Math.floor(t * 8)) - 0.5) * 0.9;
      const bh = Math.max(0.06, Math.min(1, e * laut + z)) * h;
      return <div key={i} style={{ position: "absolute", left: (i * w) / n, top: (h - bh) / 2, width: (w / n) * 0.62, height: bh, borderRadius: 5, background: rausch > 0.2 && i % 3 === 0 ? C.orange : f }} />;
    })}
  </div>
);

// Fußzeile-Hinweis oben rechts (bleibt in allen Szenen sichtbar)
export const Hinweis = ({ t, f = C.orange, ic = "alert", w = 640 }) => (
  <div style={{ position: "absolute", left: 1830 - w, top: 62, width: w, display: "flex", alignItems: "center", gap: 14, background: "#0d0d0f", border: `3px solid ${f}`, borderRadius: 18, padding: "8px 20px", fontSize: 30, fontWeight: 700, color: f, boxSizing: "border-box" }}><Ic name={ic} size={38} color={f} /><div>{t}</div></div>
);

// Beschriftung unter/in Karten mit Mark
export const Stempel = ({ x, y, t, f = C.green, a = 1, size = 56, rot = -6 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: a, transform: `rotate(${rot}deg) scale(${lerp(1.5, 1, Math.min(1, a))})`, fontSize: size, fontWeight: 800, color: f, border: `6px solid ${f}`, borderRadius: 16, padding: "4px 26px", whiteSpace: "nowrap", background: "#000000aa" }}>{t}</div>
);

export { Panel, Lbl, Ic, Icon, sp, ease, lerp, rnd, C };
