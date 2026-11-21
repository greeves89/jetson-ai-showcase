// Rauchtest: oeffnet jede Seite des Labors und prueft
//   - keine Konsolenfehler und keine fehlgeschlagenen Anfragen
//   - Ueberschrift und Lead vorhanden, mindestens ein Abschnitt
//   - alle internen Links (#/seite) zeigen auf vorhandene Seiten
//   - Glossarbegriffe sind aufloesbar (kein Rohtext [[...]] sichtbar)
//   - keine Gedankenstriche im sichtbaren Text
// Aufruf:  LABOR_URL=https://<jetson>:8443 node tests/smoke.mjs [hell]
import { starte, oeffneSeite } from "./browser.mjs";

const t = await starte({ dunkel: process.argv[2] !== "hell", kamera: false });
const { page, fehler } = t;
await page.goto(`${process.env.LABOR_URL || "https://localhost:8443"}/#/start`, { waitUntil: "load" });
await page.waitForSelector("#inhalt h1");
const ids = await page.evaluate(() => Object.keys(window.KL.INHALT.seiten));
const bekannt = new Set(ids);
let probleme = 0;
const meld = (id, text) => { probleme++; console.log(`  [${id}] ${text}`); };

for (const id of ids) {
  const vorher = fehler.length;
  await oeffneSeite(page, id);
  const r = await page.evaluate(() => {
    const main = document.querySelector("#inhalt");
    const text = main.innerText;
    const links = [...main.querySelectorAll('a[href^="#/"]')].map((a) => a.getAttribute("href").slice(2).split("?")[0]);
    return {
      h1: (main.querySelector("h1") || {}).innerText || "",
      lead: !!main.querySelector(".lead"),
      abschnitte: main.querySelectorAll("h2.abs").length,
      links,
      roh: /\[\[|\]\]|\{\{|\}\}/.test(text),
      // Platzhalter fuer "noch kein Messwert" (ein einzelner Strich in einer Kachel) sind erlaubt, Striche in Prosa nicht
      strich: /[–—]/.test(text.replace(/(^|\n)[ \t]*[–—][ \t]*(?=\n|$)/g, "$1")),
      baustein: /Baustein folgt/.test(text),
    };
  });
  if (!r.h1) meld(id, "keine Ueberschrift");
  if (!r.lead) meld(id, "kein Lead");
  if (id !== "start" && r.abschnitte < 1) meld(id, "keine Abschnitte");
  for (const l of r.links) if (!bekannt.has(l)) meld(id, `Link auf fehlende Seite: ${l}`);
  if (r.roh) meld(id, "Rohmarkierung im Text ([[ ]] oder {{ }})");
  if (r.strich) meld(id, "Gedankenstrich im sichtbaren Text");
  for (const f of fehler.slice(vorher)) meld(id, f);
  console.log(`${r.baustein ? "~" : "ok"}  ${id.padEnd(24)} ${r.abschnitte} Abschnitte${r.baustein ? "  (Baustein folgt)" : ""}`);
}
console.log(`\n${ids.length} Seiten geprueft, ${probleme} Probleme.`);
await t.schliessen();
process.exit(probleme ? 1 : 0);
