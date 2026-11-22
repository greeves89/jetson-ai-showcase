import React from "react";
import { C, Icon, sp, ease, lin, lerp, rnd, FONT } from "./lib.jsx";
import { Panel, Lbl, Chip } from "./bausteine.jsx";

export const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
export const PAPIER = "#f3e6b3";
// Zettel: helles Papier mit dunkler Schrift
export const Zettel = ({ x, y, w, h, a = 1, rot = 0, children, bg = PAPIER, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg, borderRadius: 14, opacity: a, transform: `rotate(${rot}deg)`, boxShadow: "0 18px 40px rgba(0,0,0,0.55)", boxSizing: "border-box", padding: 28, color: "#1c1c1e", fontSize: 44, fontWeight: 600, lineHeight: 1.2, ...style }}>{children}</div>
);
// Text, der Zeichen für Zeichen erscheint (p 0..1)
export const Tipp = ({ text, p }) => <>{text.slice(0, Math.round(text.length * Math.min(1, Math.max(0, p))))}</>;
// Eine Zeile Text in einer Karte
export const Zeile = ({ x, y, w, t, size = 44, color = C.text, bg = C.panel2, rand = C.line, a = 1, align = "left", weight = 600, mono, h, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, background: bg, border: `3px solid ${rand}`, borderRadius: 18, boxSizing: "border-box", padding: "10px 22px", fontSize: size, fontWeight: weight, color, textAlign: align, fontFamily: mono ? MONO : undefined, lineHeight: 1.2, display: "flex", alignItems: "center", justifyContent: align === "center" ? "center" : "flex-start", ...style }}>{t}</div>
);
// Haken / Kreuz im Kreis
export const Mark = ({ x, y, ok = true, size = 90, a = 1, flow = false }) => (
  <div style={{ position: flow ? "relative" : "absolute", flex: "none", left: flow ? 0 : x, top: flow ? 0 : y, width: size, height: size, borderRadius: size / 2, background: (ok ? C.green : C.red) + "33", border: `4px solid ${ok ? C.green : C.red}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: a, transform: `scale(${lerp(0.6, 1, Math.min(1, a))})` }}>
    <Icon name={ok ? "check" : "x"} size={size * 0.6} color={ok ? C.green : C.red} sw={3} />
  </div>
);
// Pfeil als SVG (Linie + Spitze), p = Zeichenfortschritt
export const Pf = ({ x1, y1, x2, y2, p = 1, f = C.mute, w = 8, dash }) => {
  const ex = lerp(x1, x2, p), ey = lerp(y1, y2, p), ang = Math.atan2(y2 - y1, x2 - x1), l = 26;
  const q = (da) => `${ex - l * Math.cos(ang + da)},${ey - l * Math.sin(ang + da)}`;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", pointerEvents: "none" }}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={f} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} />
      {p > 0.92 && <polyline points={`${q(0.5)} ${ex},${ey} ${q(-0.5)}`} fill="none" stroke={f} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};
// Etikett mit festem dunklem Grund (lesbar auch auf Fotos)
export const Etikett = ({ x, y, t, f = C.orange, size = 46, a = 1, flow = false }) => (
  <div style={{ position: flow ? "relative" : "absolute", left: flow ? 0 : x, top: flow ? 0 : y, opacity: a, fontSize: size, fontWeight: 700, color: f, background: "#0d0d0f", border: `3px solid ${f}`, borderRadius: 18, padding: "6px 24px", whiteSpace: "nowrap", boxSizing: "border-box" }}>{t}</div>
);
export { Panel, Lbl, Chip, FONT };
