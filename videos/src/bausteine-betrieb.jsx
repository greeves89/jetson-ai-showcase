import React from "react";
import { C, Icon, sp, ease, lerp, rnd } from "./lib.jsx";
import { Panel, Lbl } from "./bausteine.jsx";


const X = {
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>,
  scale: <><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></>,
  house: <><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>,
  moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
  sliders: <><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></>,
  play: <polygon points="6 3 20 12 6 21 6 3" />,
  hardhat: <><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" /><path d="M14 6a6 6 0 0 1 6 6v3" /><path d="M4 15v-3a6 6 0 0 1 6-6" /><rect x="2" y="15" width="20" height="4" rx="1" /></>,
  scan: <><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="10" r="3" /><path d="M7 18a5 5 0 0 1 10 0" /></>,
  mail: <><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
  ban: <><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></>,
  hand: <><path d="M18 11V6a2 2 0 0 0-4 0" /><path d="M14 10V4a2 2 0 0 0-4 0v2" /><path d="M10 10.5V6a2 2 0 0 0-4 0v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></>,
  trend: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>,
  activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  refresh: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>,
  rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>,
  package: <><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></>,
  gauge: <><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></>,
  euro: <><path d="M4 10h12" /><path d="M4 14h9" /><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" /></>,
  layers: <><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></>,
  server: <><rect width="20" height="8" x="2" y="2" rx="2" /><rect width="20" height="8" x="2" y="14" rx="2" /><path d="M6 6h.01M6 18h.01" /></>,
  flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><path d="M4 22v-7" /></>,
  undo: <><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></>,
  receipt: <><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></>,
  timer: <><line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" /></>,
  chart: <><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></>,
  tag: <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".6" /></>,
  clip: <><rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>,
  card: <><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></>,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  cart: <><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />,
  down: <path d="M12 5v14M19 12l-7 7-7-7" />,
  mic: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></>,
  ruler: <><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" /><path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" /></>,
  thermo: <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" />,
};
export const Ic = ({ name, size = 64, color = C.text, sw = 1.8 }) => X[name]
  ? <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>{X[name]}</svg>
  : <Icon name={name} size={size} color={color} sw={sw} />;
export const Bg = ({ name, size = 150, color = C.blue, bg = C.panel }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, border: `2px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ic name={name} size={size * 0.5} color={color} /></div>
);

export const RX = 700, RW = 1130, RY = 215, RH = 760;

// Knoten: Kasten, Mittelpunkt x/y
export const Kn = ({ x, y, w = 300, h = 110, t, sub, ic, f = C.blue, a = 1, size = 44, fill, flow }) => (
  <div style={{ position: flow ? "relative" : "absolute", left: flow ? 0 : x - w / 2, top: flow ? 0 : y - h / 2, width: w, height: h, opacity: a, borderRadius: 24, background: fill ?? C.panel2, border: `3px solid ${f}`, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 18px", textAlign: "center", lineHeight: 1.1 }}>
    {ic && <Ic name={ic} size={Math.min(h * 0.55, 70)} color={f} sw={1.8} />}
    <div style={{ whiteSpace: "nowrap" }}><div style={{ fontSize: size, fontWeight: 700 }}>{t}</div>{sub && <div style={{ fontSize: size * 0.68, color: C.mute, fontWeight: 500, marginTop: 4 }}>{sub}</div>}</div>
  </div>
);

// Polylinie mit Zeichenfortschritt p
export const Bahn = ({ pts, p = 1, f = C.blue, w = 8, dash, a = 1, fillTo }) => {
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", pointerEvents: "none", opacity: a }}>
      {fillTo != null && <path d={`${d} L${pts[pts.length - 1][0]} ${fillTo} L${pts[0][0]} ${fillTo} Z`} fill={f + "22"} opacity={p} />}
      <path d={d} fill="none" stroke={f} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={dash ?? "1"} strokeDashoffset={dash ? 0 : 1 - p} />
    </svg>
  );
};

// Rechteck mit Rand
export const Fl = ({ x, y, w, h, f = C.blue, a = 1, r = 12, fill, bw = 3, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: r, background: fill ?? f + "22", border: `${bw}px solid ${f}`, boxSizing: "border-box", ...style }} />
);

// Punkt
export const Pt = ({ x, y, r = 22, f = C.blue, a = 1, ring }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, background: f, opacity: a, boxShadow: ring ? `0 0 0 4px #000, 0 0 0 8px ${ring}` : "none" }} />
);

// Binärbaum ohne Text. levels = Anzahl Ebenen unter der Wurzel; hl = Schlüssel "ebene-index" hervorgehoben (blau),
// out = ausgeblendet/verworfen (rot), grow = Ebene ab der Knoten sichtbar sind (Teil), farbe der Blätter grün/orange nach Index
export const Baum = ({ x, y, w, h, levels = 2, hl = [], out = [], a = 1, show = 99, dot = 1, leafCol, f = C.blue }) => {
  const pos = (L, i) => [x + (w * (i + 0.5)) / 2 ** L, y + (h * L) / levels];
  const nodes = [], edges = [];
  for (let L = 0; L <= levels; L++) for (let i = 0; i < 2 ** L; i++) {
    const [px, py] = pos(L, i);
    nodes.push({ L, i, px, py });
    if (L > 0) { const [qx, qy] = pos(L - 1, i >> 1); edges.push({ L, i, qx, qy, px, py }); }
  }
  const sz = () => Math.max(5, Math.min(34 - levels * 4, (w / 2 ** levels) * 0.42));
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", pointerEvents: "none", opacity: a }}>
      {edges.map((e) => { const on = hl.includes(`${e.L}-${e.i}`), o = out.includes(`${e.L}-${e.i}`); const vis = e.L <= show; return <line key={`${e.L}-${e.i}`} x1={e.qx} y1={e.qy} x2={e.px} y2={e.py} stroke={o ? C.red : on ? f : C.line} strokeWidth={on ? 8 : 5} strokeLinecap="round" opacity={vis ? (o ? 0.5 : 1) : 0} />; })}
      {nodes.map((n) => { const k = `${n.L}-${n.i}`, on = hl.includes(k), o = out.includes(k), leaf = n.L === levels; const col = o ? C.red : on ? f : leaf ? (leafCol ? leafCol(n.i) : C.mute) : C.mute; const r = sz(n.L) * dot; const vis = n.L <= show;
        return leaf ? <rect key={k} x={n.px - r} y={n.py - r} width={r * 2} height={r * 2} rx={r * 0.35} fill={col + (on ? "" : "55")} stroke={col} strokeWidth="4" opacity={vis ? 1 : 0} />
          : <circle key={k} cx={n.px} cy={n.py} r={r} fill={C.panel2} stroke={col} strokeWidth={on ? 7 : 4} opacity={vis ? 1 : 0} />; })}
    </svg>
  );
};

// Zeitreihe: Trend + Saison + Rauschen, deterministisch. i = Index
export const reihe = (i, { trend = 0.9, saison = 34, per = 12, rausch = 9, seed = 5 } = {}) => 260 - trend * i * 1.0 + saison * Math.sin((i / per) * Math.PI * 2) + (rnd(i * 1.7 + seed) - 0.5) * rausch * 2;

// Beschriftete Karte mit Icon oben, mittig
export const Kachel = ({ x, y, w = 300, h = 260, ic, t, sub, f = C.blue, a = 1, size = 44, ics = 96 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: 24, background: C.panel2, border: `3px solid ${f}`, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center", padding: "0 12px", lineHeight: 1.1 }}>
    {ic && <Ic name={ic} size={ics} color={f} sw={1.6} />}
    <div style={{ fontSize: size, fontWeight: 700 }}>{t}</div>
    {sub && <div style={{ fontSize: size * 0.7, color: C.mute, fontWeight: 500 }}>{sub}</div>}
  </div>
);
