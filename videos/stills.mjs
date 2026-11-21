// Standbilder zur Sichtprüfung: node stills.mjs <id> [sek,sek,...]
// Ohne Zeiten: je Satz 1,1 s nach Satzbeginn und kurz vor Szenenende, dazu die Mitte jeder Szene.
// Ergebnis: arbeit/stills/<id>/*.jpg und Kontaktbögen kontakt-<id>-<n>.jpg
import { renderStill } from "@remotion/renderer";
import { mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { vorbereiten } from "./bund.mjs";

const [id, zeiten] = process.argv.slice(2);
const { serveUrl, comp, plan } = await vorbereiten(id);
const dir = `arbeit/stills/${id}`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
let punkte = [];
if (zeiten) punkte = zeiten.split(",").map((s) => ({ t: Number(s), name: s }));
else plan.szenen.forEach((s, k) => {
  s.saetze.forEach((x, i) => punkte.push({ t: s.start + x.t + Math.min(1.1, x.d * 0.6), name: `${k + 1}.${i + 1}` }));
  punkte.push({ t: s.start + s.dauer - 0.6, name: `${k + 1}.ende` });
});
const dateien = [];
for (const p of punkte) {
  const f = Math.min(comp.durationInFrames - 1, Math.round(p.t * 30));
  const out = `${dir}/${String(Math.round(p.t * 10)).padStart(5, "0")}_${p.name}.jpg`;
  await renderStill({ composition: comp, serveUrl, output: out, frame: f, imageFormat: "jpeg", jpegQuality: 80, scale: 0.5 });
  dateien.push(out);
}
dateien.sort();
// Kontaktbögen mit 12 Bildern (4 x 3)
for (let i = 0, n = 1; i < dateien.length; i += 12, n++) {
  execFileSync("montage", [...dateien.slice(i, i + 12), "-tile", "3x4", "-geometry", "640x360+6+6", "-background", "#222", "-label", "%t", "-pointsize", "14", "-fill", "white", `${dir}/kontakt-${n}.jpg`]);
}
console.log(dateien.length, "Bilder in", dir);
