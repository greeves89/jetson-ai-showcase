// Titel und Beschreibungen aller vorgerenderten Seiten (app/static/seo/index.json, ohne Server):
// Titel hoechstens 60 Zeichen, eindeutig, nicht abgeschnitten; Beschreibung 120 bis 160 Zeichen, ohne Gedankenstrich.
// Kurzfassung (Antwort zuerst) vorhanden und hoechstens 360 Zeichen.
// Aufruf (im Repo-Wurzelverzeichnis):  node tests/seo-titel.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SEO = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "app", "static", "seo");
const index = JSON.parse(fs.readFileSync(path.join(SEO, "index.json"), "utf8"));
const probleme = [];
const titel = {};
for (const [id, e] of Object.entries(index.seiten)) {
  const t = e.titel, b = e.beschreibung;
  if (t.length > 60) probleme.push(`${id}: Titel ${t.length} Zeichen`);
  if (/…/.test(t)) probleme.push(`${id}: Titel abgeschnitten`);
  if (titel[t]) probleme.push(`${id}: Titel wie ${titel[t]}`); else titel[t] = id;
  if (b.length < 120 || b.length > 160) probleme.push(`${id}: Beschreibung ${b.length} Zeichen`);
  if (/[–—]/.test(t + b)) probleme.push(`${id}: Gedankenstrich`);
  const html = fs.readFileSync(path.join(SEO, id + ".html"), "utf8");
  const kg = (html.match(/<\/h1><p class="kurzgesagt"><strong>Kurz gesagt:<\/strong> ([^<]+)<\/p>/) || [])[1];
  if (!kg) probleme.push(`${id}: keine Kurzfassung nach dem h1`);
  else if (kg.length > 360) probleme.push(`${id}: Kurzfassung ${kg.length} Zeichen`);
}
for (const p of probleme) console.log("  " + p);
console.log(`${Object.keys(index.seiten).length} Seiten: Titel und Beschreibungen geprueft, ${probleme.length} Probleme.`);
process.exit(probleme.length ? 1 : 0);
