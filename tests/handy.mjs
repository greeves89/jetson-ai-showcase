// node tests/handy.mjs <seite-id> ...   Screenshots bei 390 x 844 (Handy), meldet seitliches Ueberlaufen und zu kleine Tippflaechen.
import { starte, oeffneSeite } from "./browser.mjs";
import { mkdirSync } from "node:fs";
mkdirSync("tests/ausgabe", { recursive: true });
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ["start", "gesicht", "rag-ueberblick"];
const t = await starte({ breite: 390, hoehe: 844, kamera: false });
let ok = true;
for (const id of ids) {
  await oeffneSeite(t.page, id);
  await t.page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 250)); } window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 500)); });
  const info = await t.page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    const breit = [...document.querySelectorAll("#inhalt *")].filter((e) => e.getBoundingClientRect().right > w + 2 && getComputedStyle(e).position !== "fixed").slice(0, 4).map((e) => e.tagName + "." + String(e.className).slice(0, 30));
    const klein = [...document.querySelectorAll("button, a")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 32) && r.top > 0; }).length;
    return { ueberlauf: document.documentElement.scrollWidth > w, breit, kleineTippflaechen: klein, hoehe: document.body.scrollHeight };
  });
  console.log(id, JSON.stringify(info));
  await t.page.screenshot({ path: `tests/ausgabe/handy-${id}.png`, fullPage: false });
  if (info.ueberlauf) ok = false;
}
// Menue: oeffnen, Gruppe ansehen, Seite waehlen
await oeffneSeite(t.page, "start");
await t.page.click(".menueknopf");
await t.page.waitForTimeout(400);
await t.page.screenshot({ path: "tests/ausgabe/handy-menue.png" });
const sichtbar = await t.page.evaluate(() => [...document.querySelectorAll("#nav-liste a.nav, #nav-liste .navkopf")].filter((e) => e.getBoundingClientRect().height > 0).length);
console.log("Menue offen, sichtbare Eintraege beim Start:", sichtbar);
if (sichtbar > 8 || sichtbar < 3) ok = false;
await t.page.click(".nav-alle");
await t.page.click(".nav-alle-inhalt .navkopf >> nth=1");
await t.page.click(".nav-alle-inhalt .navgruppe:not([hidden]) a.nav:visible >> nth=0");
await t.page.waitForTimeout(600);
const zu = await t.page.evaluate(() => !document.body.classList.contains("menue-offen"));
console.log("Menue schliesst nach Auswahl:", zu, "URL:", new URL(t.page.url()).pathname);
if (!zu) ok = false;
await t.schliessen();
process.exit(ok ? 0 : 1);
