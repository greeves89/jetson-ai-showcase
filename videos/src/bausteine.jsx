import React from "react";
import { C, Icon, Badge, sp, ease, lin, lerp, rnd, Rv, Txt } from "./lib.jsx";

export const Panel = ({ x, y, w, h, a = 1, r = 28, children, style, rand = C.line, bg = C.panel }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, background: bg, border: `3px solid ${rand}`, opacity: a, boxSizing: "border-box", ...style }}>{children}</div>
);
export const Lbl = ({ x, y, w = 600, t, size = 48, color = C.text, align = "left", a = 1, weight = 700, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, fontSize: size, fontWeight: weight, color, opacity: a, lineHeight: 1.1, ...style }}>{t}</div>
);
// Skelett-Textzeilen (Platzhalter für Text), mark = Zeilen, die farbig hervorgehoben werden
export const Skel = ({ x, y, w, n = 5, gap = 36, h = 16, mark = [], hl = C.orange, a = 1, seed = 1, farbe = "#48484a", teil }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, opacity: a }}>
    {Array.from({ length: n }).map((_, i) => {
      const bw = i === n - 1 ? 0.55 : 0.78 + rnd(i * 3 + seed) * 0.22;
      const m = mark.includes(i);
      return <div key={i} style={{ position: "absolute", left: 0, top: i * gap, width: w * bw, height: h, borderRadius: h / 2, background: m ? hl : farbe, opacity: m ? 1 : 0.9 }} />;
    })}
  </div>
);
export const Dok = ({ x, y, w = 360, h = 480, a = 1, mark = [], n = 9, hl, seed = 1, rot = 0, rand, children, gap }) => (
  <Panel x={x} y={y} w={w} h={h} a={a} r={22} rand={rand ?? C.line} style={{ transform: `rotate(${rot}deg)` }}>
    <Skel x={28} y={30} w={w - 56} n={n} gap={gap ?? (h - 80) / n} h={Math.max(10, (h - 80) / n * 0.4)} mark={mark} hl={hl} seed={seed} />
    {children}
  </Panel>
);
export const Zahlen = ({ x, y, w = 300, h = 70, n = 12, seed = 3, farbe = C.blue, a = 1, s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, transform: `scale(${s})`, transformOrigin: "left center" }}>
    {Array.from({ length: n }).map((_, i) => {
      const bh = h * (0.25 + rnd(i * 2.3 + seed) * 0.75), bw = w / n * 0.7;
      return <div key={i} style={{ position: "absolute", left: i * (w / n), bottom: 0, width: bw, height: bh, borderRadius: 4, background: farbe }} />;
    })}
  </div>
);
export const Dot = ({ x, y, r = 14, f = C.blue, a = 1, ring, glow }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: f, opacity: a, boxShadow: ring ? `0 0 0 5px #000, 0 0 0 9px ${ring}` : "none" }} />
);
export const Fig = ({ x, y, s = 200, f = C.blue, a = 1, icon = "user", bg }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: a }}><Badge name={icon} size={s} color={f} bg={bg} /></div>
);
export const Chip = ({ x, y, t, f = C.blue, size = 44, a = 1, w }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, opacity: a, fontSize: size, fontWeight: 700, color: f, background: f + "22", border: `3px solid ${f}`, borderRadius: 18, padding: "6px 24px", whiteSpace: "nowrap", textAlign: "center", boxSizing: "border-box" }}>{t}</div>
);
// Linie zwischen zwei Punkten mit Fortschritt
export const Lin = ({ x1, y1, x2, y2, p = 1, f = C.mute, w = 5, dash }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", pointerEvents: "none" }}>
    <line x1={x1} y1={y1} x2={lerp(x1, x2, p)} y2={lerp(y1, y2, p)} stroke={f} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />
  </svg>
);
// Bahn: Punkt auf Gerade von A nach B zum Zeitpunkt t0..t1
export const Flug = ({ t, t0, t1, a: A, b: B, bogen = 0 }) => {
  const u = ease(t, t0, t1);
  return [lerp(A[0], B[0], u), lerp(A[1], B[1], u) - Math.sin(u * Math.PI) * bogen, u];
};
// Karte: Hintergrundfläche mit feinem Raster
export const Karte = ({ x, y, w, h, a = 1, rand = C.line, children }) => (
  <Panel x={x} y={y} w={w} h={h} a={a} rand={rand} style={{ overflow: "hidden", backgroundImage: "linear-gradient(#ffffff0d 2px, transparent 2px), linear-gradient(90deg, #ffffff0d 2px, transparent 2px)", backgroundSize: "80px 80px" }}>{children}</Panel>
);
export const Schere = ({ x, y, a = 1, s = 100 }) => (
  <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, opacity: a }}><Icon name="x" size={s} color={C.orange} sw={2.2} /></div>
);
