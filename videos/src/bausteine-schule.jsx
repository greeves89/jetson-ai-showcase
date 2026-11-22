// Bausteine für die Folgen im Strang Schule und Medienkompetenz (nur Linien, Formen und Symbole, keine Marken, keine echten Personen)
import React from "react";
import { C, Icon as BasisIcon, lerp } from "./lib.jsx";
import { Panel, Lbl, Skel } from "./bausteine.jsx";

const X = {
  pin: <><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  phone: <><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>,
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  thumb: <path d="M7 11v10H3V11zM7 11l4-8a2 2 0 0 1 3 2l-1 4h6a2 2 0 0 1 2 2l-2 7a3 3 0 0 1-3 2H7" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M16 7l3 3" /></>,
  eyeOff: <path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.4-1" />,
  send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />,
  dumbbell: <path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12" />,
  cap: <path d="M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />,
  news: <path d="M4 4h13v16H6a2 2 0 0 1-2-2zM17 8h3v10a2 2 0 0 1-2 2M8 8h5M8 12h5M8 16h5" />,
  flag: <path d="M5 21V4M5 4h12l-2 4 2 4H5" />,
  wave: <path d="M3 12h2M7 7v10M11 3v18M15 8v8M19 10v4" />,
  smile: <><circle cx="12" cy="12" r="9" /><path d="M8 14a4 4 0 0 0 8 0M9 9h.01M15 9h.01" /></>,
  frown: <><circle cx="12" cy="12" r="9" /><path d="M8 16a4 4 0 0 1 8 0M9 9h.01M15 9h.01" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  megaphone: <path d="M3 11v2a1 1 0 0 0 1 1h3l8 5V5L7 10H4a1 1 0 0 0-1 1zM19 9a4 4 0 0 1 0 6" />,
  coin: <><circle cx="12" cy="12" r="9" /><path d="M15.5 9a4 4 0 1 0 0 6M7.5 11h6M7.5 13.5h6" /></>,
  stop: <><path d="M8 2h8l6 6v8l-6 6H8l-6-6V8z" /><path d="M8 12h8" /></>,
  school: <path d="M3 21h18M5 21V9l7-5 7 5v12M10 21v-6h4v6" />,
  scale: <path d="M12 3v18M5 21h14M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  ruler: <path d="M3 17L17 3l4 4L7 21zM8 12l2 2M11 9l2 2M14 6l2 2" />,
  badge: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  paper: <path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h6" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" /></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
  question: <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01" />,
};
export function Ic({ name, size = 64, color = C.text, sw = 1.8, style }) {
  if (!X[name]) return <BasisIcon name={name} size={size} color={color} sw={sw} style={style} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", ...style }}>{X[name]}</svg>
  );
}

// Karte: Rahmen in Farbe f, Symbol und Text. v = senkrecht (Symbol oben)
export const K = ({ x, y, w, h, icon, t, f = C.blue, a = 1, size = 48, isize = 100, v, sub, subsize = 36, bg, tc = C.text, weight = 800 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: 28, background: bg ?? f + "18", border: `4px solid ${f}`, boxSizing: "border-box", display: "flex", flexDirection: v ? "column" : "row", alignItems: "center", justifyContent: "center", gap: v ? 22 : 30, padding: "0 28px", textAlign: v ? "center" : "left", transform: `translateY(${(1 - Math.min(1, a)) * 24}px)` }}>
    {icon && <Ic name={icon} size={isize} color={f} sw={1.6} />}
    <div><div style={{ fontSize: size, fontWeight: weight, lineHeight: 1.12, color: tc }}>{t}</div>{sub && <div style={{ fontSize: subsize, color: C.mute, marginTop: 8, fontWeight: 500, lineHeight: 1.2 }}>{sub}</div>}</div>
  </div>
);

// Sprechblase im Chat
export const Bubble = ({ x, y, w, h, t, me, a = 1, size = 44, f, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: 30, background: me ? (f ?? C.blue) + "33" : C.panel2, border: `3px solid ${me ? (f ?? C.blue) : C.line}`, boxSizing: "border-box", padding: "16px 28px", fontSize: size, fontWeight: 600, lineHeight: 1.2, display: "flex", alignItems: "center", transform: `translateY(${(1 - Math.min(1, a)) * 18}px)` }}>{children ?? t}</div>
);

// Gezeichnetes Landschaftsfoto (keine echte Aufnahme)
export const Foto = ({ x, y, w, h, a = 1, v = 0, rand = C.line, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: 22, overflow: "hidden", border: `4px solid ${rand}`, boxSizing: "border-box", background: "linear-gradient(#27406b, #e39a63)", ...style }}>
    <svg viewBox="0 0 400 260" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", left: 0, top: 0 }}>
      <circle cx={v ? 300 : 105} cy={v ? 72 : 80} r={32} fill="#ffd27a" />
      <polygon points="0,260 0,170 90,90 170,175 250,110 340,190 400,150 400,260" fill="#2d3b55" />
      <polygon points="90,90 70,118 90,108 106,121" fill="#e8edf5" />
      <polygon points="250,110 232,136 250,128 266,140" fill="#e8edf5" />
      <polygon points="0,260 0,210 70,165 150,215 230,172 320,228 400,192 400,260" fill="#1b2335" />
    </svg>
    {children}
  </div>
);

// Gezeichnete Hand mit n Fingern (abstrakt)
export const Hand = ({ x, y, s = 1, n = 5, f = "#d8b494", a = 1 }) => {
  const bw = 112 / n;
  return (
    <svg style={{ position: "absolute", left: x, top: y, opacity: a }} width={220 * s} height={260 * s} viewBox="0 0 220 260">
      <rect x="48" y="120" width="124" height="120" rx="40" fill={f} />
      {Array.from({ length: n }).map((_, i) => {
        const hh = 70 + [0, 22, 30, 20, 4, 14][i % 6];
        return <rect key={i} x={54 + i * (112 / n)} y={125 - hh} width={bw - 4} height={hh + 15} rx={bw / 2 - 2} fill={f} stroke="#a98466" strokeWidth="2" />;
      })}
    </svg>
  );
};

export const Num = ({ n, size = 84, f = C.blue, a = 1, style }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: f, color: "#000", fontSize: size * 0.58, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", opacity: a, flex: "none", ...style }}>{n}</div>
);

// Rotierter Stempel
export const Stempel = ({ x, y, t, f = C.red, rot = -8, size = 60, a = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: a, transform: `rotate(${rot}deg) scale(${lerp(1.5, 1, Math.min(1, a))})`, border: `7px solid ${f}`, color: f, borderRadius: 16, padding: "6px 30px", fontSize: size, fontWeight: 900, letterSpacing: 2, whiteSpace: "nowrap", background: "#000000aa" }}>{t}</div>
);

// Messgerät mit Nadel, wert -1..1
export const Messer = ({ x, y, w = 600, wert = 0, a = 1 }) => (
  <svg style={{ position: "absolute", left: x, top: y, opacity: a }} width={w} height={w * 0.62} viewBox="0 0 300 186">
    {[[0, 33, C.red], [33, 34, C.orange], [67, 33, C.green]].map(([s, l, c], i) => (
      <path key={i} d="M30 156 A120 120 0 0 1 270 156" fill="none" stroke={c} strokeWidth="26" pathLength="100" strokeDasharray={`${l} 100`} strokeDashoffset={-s} />
    ))}
    <g transform={`rotate(${wert * 80} 150 156)`}>
      <line x1="150" y1="156" x2="150" y2="50" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </g>
    <circle cx="150" cy="156" r="12" fill="#fff" />
  </svg>
);

// Schalterzeile; v 0..1 (1 = an)
export const Schalter = ({ x, y, w = 820, h = 120, icon, t, v = 1, f = C.green, a = 1, size = 46, sub }) => {
  const an = v > 0.5;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: 26, background: C.panel, border: `3px solid ${an ? f : C.line}`, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 26, padding: "0 30px" }}>
      <Ic name={icon} size={64} color={an ? f : C.mute} sw={1.6} />
      <div style={{ flex: 1, fontSize: size, fontWeight: 700, lineHeight: 1.1 }}>{t}{sub && <div style={{ fontSize: 32, color: C.mute, fontWeight: 500, marginTop: 4 }}>{sub}</div>}</div>
      <div style={{ width: 120, height: 62, borderRadius: 31, background: an ? f : "#48484a", position: "relative", flex: "none" }}>
        <div style={{ position: "absolute", top: 6, left: lerp(6, 64, v), width: 50, height: 50, borderRadius: 25, background: "#fff" }} />
      </div>
    </div>
  );
};

// Browserfenster
export const Fenster = ({ x, y, w, h, url, a = 1, f = C.line, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: 22, background: C.panel, border: `3px solid ${f}`, overflow: "hidden", boxSizing: "border-box" }}>
    <div style={{ height: 64, background: C.panel2, display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
      {["#ff453a", "#ff9f0a", "#30d158"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />)}
      <div style={{ marginLeft: 16, flex: 1, height: 38, borderRadius: 19, background: "#000", color: C.mute, fontSize: 28, padding: "0 20px", display: "flex", alignItems: "center", whiteSpace: "nowrap", overflow: "hidden" }}>{url}</div>
    </div>
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

// Handy-Rahmen
export const Handy = ({ x, y, w, h, a = 1, children, f = C.line }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: a, borderRadius: 48, border: `7px solid ${f}`, background: "#0d0d0f", overflow: "hidden", boxSizing: "border-box" }}>
    <div style={{ position: "absolute", left: w / 2 - 50, top: 12, width: 100, height: 14, borderRadius: 7, background: "#2c2c2e" }} />
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}>{children}</div>
  </div>
);

// Kleine Figur (abstrakt)
export const Figur = ({ x, y, s = 150, f = C.blue, a = 1, icon = "user" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s / 2, background: C.panel, border: `3px solid ${f}`, opacity: a, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
    <Ic name={icon} size={s * 0.55} color={f} sw={1.6} />
  </div>
);

// Durchgestrichen-Kreuz über einem Bereich
export const Quer = ({ x, y, w, h, a = 1, f = C.red }) => (
  <svg style={{ position: "absolute", left: x, top: y, opacity: a, overflow: "visible" }} width={w} height={h}>
    <line x1="0" y1="0" x2={w} y2={h} stroke={f} strokeWidth="12" strokeLinecap="round" />
    <line x1={w} y1="0" x2="0" y2={h} stroke={f} strokeWidth="12" strokeLinecap="round" />
  </svg>
);
export { Panel, Lbl, Skel };
