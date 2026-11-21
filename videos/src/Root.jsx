import React from "react";
import { Composition, Sequence } from "remotion";
import { FPS, SceneProvider, C, FONT, useCues, lin } from "./lib.jsx";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { VIDEOS } from "./registry.js";


function Fortschritt({ plan }) {
  const f = useCurrentFrame();
  const t = f / FPS;
  const B = 1680, X = 120, Y = 1030;
  return (
    <div style={{ position: "absolute", left: X, top: Y, width: B, height: 6 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.10)", borderRadius: 3 }} />
      <div style={{ position: "absolute", left: 0, top: 0, height: 6, width: B * Math.min(1, t / plan.gesamt), background: C.blue, borderRadius: 3 }} />
      {plan.szenen.map((s, i) => (
        <div key={s.id} style={{ position: "absolute", left: (s.start / plan.gesamt) * B - 2, top: -4, width: 4, height: 14, borderRadius: 2, background: t >= s.start ? C.blue : "#48484a", display: i === 0 ? "none" : "block" }} />
      ))}
    </div>
  );
}

function Film({ plan, szenen }) {
  return (
    <AbsoluteFill style={{ background: "#000", fontFamily: FONT }}>
      {plan.szenen.map((s) => {
        const Comp = szenen[s.id];
        return (
          <Sequence key={s.id} from={Math.round(s.start * FPS)} durationInFrames={Math.round(s.dauer * FPS)} premountFor={FPS}>
            <SceneProvider value={{ saetze: s.saetze, dur: s.dauer, label: plan.titel, kapitel: s.kapitel, start: s.start }}>
              <Comp />
            </SceneProvider>
          </Sequence>
        );
      })}
      <Fortschritt plan={plan} />
    </AbsoluteFill>
  );
}

export const Root = () => (
  <>
    {VIDEOS.map(([plan, szenen]) => (
      <Composition key={plan.id} id={plan.id} component={() => <Film plan={plan} szenen={szenen} />}
        durationInFrames={Math.ceil(plan.gesamt * FPS)} fps={FPS} width={1920} height={1080} />
    ))}
  </>
);
