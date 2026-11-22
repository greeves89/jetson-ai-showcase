// node tests/labor-bild.mjs <seite-id> <hell|dunkel> [breite] [datei]
//   Bildet den Block #ausprobieren (Labor/Baustein) einer Seite ab.
import { starte, oeffneSeite } from "./browser.mjs";
import { mkdirSync } from "node:fs";
const [id, modus = "hell", breite = "1100", datei] = process.argv.slice(2);
mkdirSync("tests/ausgabe/gruppe", { recursive: true });
const t = await starte({ dunkel: modus === "dunkel", breite: Number(breite), hoehe: 1000 });
await oeffneSeite(t.page, id);
await t.page.waitForSelector("#ausprobieren");
await t.page.locator("#ausprobieren").scrollIntoViewIfNeeded();
await t.page.evaluate(() => { for (const e of document.querySelectorAll("body *")) { const p = getComputedStyle(e).position; if (p === "fixed" || p === "sticky") e.style.visibility = "hidden"; } });
await t.page.waitForTimeout(800);
const ziel = datei || `tests/ausgabe/gruppe/${id}-${modus}-${breite}.png`;
await t.page.locator("#ausprobieren").screenshot({ path: ziel });
const ueberlauf = await t.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(ziel, "Ueberlauf:", ueberlauf, t.fehler.length ? "FEHLER " + t.fehler.join("|") : "");
await t.schliessen();
