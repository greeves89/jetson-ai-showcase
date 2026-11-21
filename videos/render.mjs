// node render.mjs <id>   rendert Video (nur Bild), mischt Ton, schreibt mp4/jpg/vtt nach out/ und ../app/static/videos/
import { renderMedia, renderStill } from "@remotion/renderer";
import { mkdirSync, rmSync, copyFileSync, statSync, existsSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { vorbereiten } from "./bund.mjs";

const id = process.argv[2];
if (!id) { console.error("Aufruf: npm run render -- <id>"); process.exit(2); }
if (!existsSync(`ton/${id}.wav`)) { console.error("ton/" + id + ".wav fehlt, erst npm run ton"); process.exit(2); }
const { serveUrl, comp, plan } = await vorbereiten(id);
mkdirSync("out", { recursive: true });
mkdirSync("arbeit", { recursive: true });
mkdirSync("../app/static/videos", { recursive: true });

let letzte = -1;
const stumm = `arbeit/${id}-stumm.mp4`;
await renderMedia({
  composition: comp, serveUrl, codec: "h264", outputLocation: stumm, concurrency: 3, crf: 20, pixelFormat: "yuv420p",
  onProgress: ({ progress }) => { const p = Math.floor(progress * 10) * 10; if (p > letzte) { letzte = p; process.stdout.write(`${id} ${p}% `); } },
});
console.log();
const ziel = `out/${id}.mp4`;
const mux = (crf) => {
  const v = crf ? ["-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-pix_fmt", "yuv420p"] : ["-c:v", "copy"];
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", stumm, "-i", `ton/${id}.wav`, "-map", "0:v:0", "-map", "1:a:0", ...v, "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", ziel], { stdio: "inherit" });
};
mux(0);
let mb = statSync(ziel).size / 1048576;
for (const crf of [24, 27, 30]) { if (mb <= 14.5) break; mux(crf); mb = statSync(ziel).size / 1048576; }
// Vorschaubild: ruhiges Bild aus der Mitte der letzten Hälfte der gewünschten Szene
const th = plan.szenen.find((s) => s.id === (plan.vorschau ?? "")) ?? plan.szenen[Math.floor(plan.szenen.length / 2)];
const tf = th.start + th.saetze[th.saetze.length - 1].t + th.saetze[th.saetze.length - 1].d + 0.3;
await renderStill({ composition: comp, serveUrl, output: `out/${id}.jpg`, frame: Math.round(tf * 30), imageFormat: "jpeg", jpegQuality: 88 });
for (const e of ["mp4", "jpg", "vtt"]) copyFileSync(`out/${id}.${e}`, `../app/static/videos/${id}.${e}`);
rmSync(stumm, { force: true });
console.log(`${id}: ${mb.toFixed(1)} MB`);
const m = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", ziel, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], { encoding: "utf8" });
const j = JSON.parse(m.stderr.match(/\{[\s\S]*\}/g).pop());
console.log(`Lautheit ${j.input_i} LUFS, Spitze ${j.input_tp} dBTP, Dauer ${plan.gesamt} s`);
