import React, { createContext, useContext } from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate, Easing } from "remotion";

export const FPS = 30;
export const C = {
  bg: "#000000", panel: "#1c1c1e", panel2: "#2c2c2e", line: "#3a3a3c",
  text: "#f5f5f7", mute: "#98989d", blue: "#0a84ff", green: "#30d158",
  orange: "#ff9f0a", red: "#ff453a",
};
export const FONT = '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, "Helvetica Neue", Arial, sans-serif';

const Ctx = createContext({ saetze: [], dur: 6, label: "", kapitel: "" });
export const SceneProvider = Ctx.Provider;

// Zeit in der Szene (Sekunden) + Satzmarken der Stimme
export function useCues() {
  const f = useCurrentFrame();
  const c = useContext(Ctx);
  const t = f / FPS;
  const cue = (i) => (c.saetze[i] ? c.saetze[i].t : 0);
  const end = (i) => (c.saetze[i] ? c.saetze[i].t + c.saetze[i].d : c.dur);
  // Zeitpunkt, an dem ein Wort im Satz i ungefähr gesprochen wird
  const word = (i, sub) => {
    const s = c.saetze[i];
    if (!s) return 0;
    const idx = s.text.indexOf(sub);
    return s.t + Math.max(0, (idx < 0 ? 0 : idx / s.text.length) * s.d - 0.08);
  };
  return { t, f, cue, end, word, dur: c.dur, saetze: c.saetze };
}

// weiche Feder 0..1, startet bei Zeit s (Sekunden)
export const sp = (t, s, d = 0.9) =>
  t <= s ? 0 : spring({ frame: Math.round((t - s) * FPS), fps: FPS, config: { damping: 200 }, durationInFrames: Math.round(d * FPS) });
export const lerp = (a, b, p) => a + (b - a) * p;
export const ease = (t, a, b, from = 0, to = 1) =>
  interpolate(t, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
export const lin = (t, a, b, from = 0, to = 1) =>
  interpolate(t, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Einblenden mit Feder
export function Rv({ at, dy = 26, dx = 0, d = 0.9, s0 = 1, children, style }) {
  const { t } = useCues();
  const p = sp(t, at, d);
  return (
    <div style={{ opacity: Math.min(1, p * 1.6), transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) scale(${lerp(s0, 1, p)})`, ...style }}>
      {children}
    </div>
  );
}

export const Abs = ({ x, y, w, h, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...style }}>{children}</div>
);

// Grundgerüst jeder Szene: Hintergrund, Kopfzeile, Ein- und Ausblenden
export function Szene({ titel, sub, children, kopf = true, fokus }) {
  const { t, dur } = useCues();
  const c = useContext(Ctx);
  const rein = ease(t, 0, 0.45), raus = ease(t, dur - 0.45, dur);
  const o = Math.min(rein, 1 - raus);
  // Kamera: Inhalt wird auf die Bildmitte gesetzt und zoomt langsam heran
  const [fs, ox, oy] = fokus ?? [1, 960, 670];
  const z = fs * (1 + 0.05 * (t / dur));
  const tf = `translate(${960 - ox}px, ${670 - oy}px) scale(${z})`;
  const hub = `scale(${lerp(0.97, 1, rein) * lerp(1, 1.025, raus)})`;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(1400px 900px at 78% 12%, #121216 0%, #000 70%)", fontFamily: FONT, color: C.text, opacity: o, transform: hub }}>
      {kopf && (
        <div style={{ position: "absolute", left: 120, top: 70, width: 1680 }}>
          <Rv at={0.1} dy={14}>
            <div style={{ fontSize: 36, fontWeight: 600, color: C.blue, letterSpacing: 0.2 }}>{c.label}</div>
          </Rv>
          <Rv at={0.2} dy={24}>
            <div style={{ fontSize: 100, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.05, marginTop: 6 }}>{titel}</div>
          </Rv>
          {sub && (
            <Rv at={0.45} dy={16}>
              <div style={{ fontSize: 44, color: C.mute, marginTop: 10, fontWeight: 400 }}>{sub}</div>
            </Rv>
          )}
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${ox}px ${oy}px`, transform: tf }}>{children}</div>
    </AbsoluteFill>
  );
}

// Zeilenstütze: Text, der an einer Satzmarke erscheint
export function Txt({ at, x, y, w, size = 36, color = C.text, weight = 500, align = "left", children, dy = 16, style }) {
  return (
    <Rv at={at} dy={dy} style={{ position: "absolute", left: x, top: y, width: w, ...style }}>
      <div style={{ fontSize: size, color, fontWeight: weight, textAlign: align, lineHeight: 1.25 }}>{children}</div>
    </Rv>
  );
}

export function Pill({ children, color = C.blue, bg, size = 32, pad = "10px 22px", style, border }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: size, fontWeight: 600, color, background: bg ?? "rgba(255,255,255,0.07)", border: border ?? `2px solid ${color}55`, borderRadius: 999, padding: pad, whiteSpace: "nowrap", ...style }}>
      {children}
    </div>
  );
}

// Linie mit Zeichnen-Fortschritt p (0..1)
export function Pfad({ d, p = 1, color = C.mute, w = 5, dash, head, style }) {
  return (
    <g style={style}>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
        strokeDasharray={dash ?? "1"} strokeDashoffset={dash ? 0 : 1 - p} opacity={dash ? Math.min(1, p * 2) : 1} />
      {head && p > 0.98 && <path d={head} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />}
    </g>
  );
}

// Pfeilspitze am Ende einer Geraden (x1,y1) -> (x2,y2)
export const spitze = (x1, y1, x2, y2, l = 18) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (da) => `${x2 - l * Math.cos(a + da)} ${y2 - l * Math.sin(a + da)}`;
  return `M${p(0.5)} L${x2} ${y2} L${p(-0.5)}`;
};

// Pfeil als Gerade mit Fortschritt
export function Pfeil({ x1, y1, x2, y2, p = 1, color = C.mute, w = 5 }) {
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "visible", pointerEvents: "none" }}>
      <Pfad d={`M${x1} ${y1} L${x2} ${y2}`} p={p} color={color} w={w} head={spitze(x1, y1, x2, y2)} />
    </svg>
  );
}

// ---- Symbole im Stil von lucide: Linien, 24er Raster, runde Enden
const I = {
  eye: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  fork: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M6 7v3a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3M18 7v3" /></>,
  sparkles: <><path d="M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z" /><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5z" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" /></>,
  pointer: <path d="M5 3l14 7-6 2-2 6z" />,
  cpu: <><rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
  camera: <><path d="M3 8h4l2-3h6l2 3h4v12H3z" /><circle cx="12" cy="13" r="4" /></>,
  bot: <><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 8V4M9 4h6M9 13v1.5M15 13v1.5M2 13v3M22 13v3" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" /></>,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  factory: <path d="M3 21V10l6 4v-4l6 4V6h3v15z" />,
  truck: <><path d="M2 6h12v11H2zM14 10h4l4 3v4h-8" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>,
  store: <><path d="M4 9l1-5h14l1 5" /><path d="M4 9a3 3 0 0 0 5 2 3 3 0 0 0 6 0 3 3 0 0 0 5-2" /><path d="M5 12v8h14v-8" /></>,
  heart: <><path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /><path d="M3 12h4l2-3 3 6 2-3h7" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
  door: <><path d="M13 4h5a1 1 0 0 1 1 1v15H5V5a1 1 0 0 1 1-1h3" /><path d="M4 20h16M9 12h.01" /><path d="M9 4l4 1.5v14.5L9 21z" /></>,
  check: <path d="M4 12l5 5L20 6" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  cloud: <path d="M17.5 19H7a5 5 0 0 1-.5-9.98A6 6 0 0 1 18 9.5a4.75 4.75 0 0 1-.5 9.5z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  userCheck: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M16 11l2 2 4-4" /></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  zap: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  wifiOff: <><path d="M2 8.8a15 15 0 0 1 4-2.5M22 8.8a15 15 0 0 0-9-3.6M5 12.9a10 10 0 0 1 5-2.5M19 12.9a10 10 0 0 0-2.4-1.9M8.5 16.4a5 5 0 0 1 7 0" /><path d="M12 20h.01M2 2l20 20" /></>,
  network: <><circle cx="5" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="6" r="2" /><circle cx="19" cy="18" r="2" /><path d="M7 6l3.5 5M7 18l3.5-5M14 11l3.5-4M14 13l3.5 4" /></>,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  box: <><path d="M21 8l-9-5-9 5v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01" /></>,
  grid: <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />,
  repeat: <path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" />,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></>,
  bulb: <><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z" /></>,
};
export function Icon({ name, size = 64, color = C.text, sw = 1.8, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", ...style }}>
      {I[name]}
    </svg>
  );
}

// Symbolkreis: Icon auf dunkler Fläche
export function Badge({ name, size = 150, color = C.blue, bg = C.panel, glow = 0 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, border: `2px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: glow ? `0 0 ${60 * glow}px ${color}55` : "none" }}>
      <Icon name={name} size={size * 0.5} color={color} />
    </div>
  );
}

// Deterministischer Zufall (kein Math.random: jeder Render gleich)
export const rnd = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
