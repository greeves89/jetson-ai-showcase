// node tests/beispiele-start-knoepfe.mjs: "Beispiel starten" auf allen zehn Use-Case-Seiten und im Baustein "bereiche".
// Prüft Knopf, Ziel-Adresse (?beispiel=<id>) und, dass das Labor den Beispielkopf zeigt. Startet keine Modelle.
import assert from "node:assert/strict";
import { starte, URL_LABOR, oeffneSeite } from "./browser.mjs";
import { manifest } from "./bsp-hilfe.mjs";
const t = await starte({ kamera: false });
const { page } = t;
let schlecht = 0;
const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) { schlecht++; process.exitCode = 1; } };
for (const u of manifest.usecases) {
  await oeffneSeite(page, "uc-" + u.id);
  const knopf = page.locator("#ausprobieren a.btn.primary");
  pruefe((await knopf.count()) === 1 && /Beispiel starten/.test(await knopf.textContent()), `uc-${u.id}: Knopf Beispiel starten im Baustein`);
  pruefe((await knopf.getAttribute("href")) === `#/${u.lab}?beispiel=${u.id}`, `uc-${u.id}: Ziel ${u.lab}?beispiel=${u.id}`);
  pruefe((await page.locator("#ausprobieren svg.ic").count()) >= 1, `uc-${u.id}: Knopf mit Symbol`);
  const imText = await page.locator('.text p > a[href*="?beispiel="]').count();
  pruefe(imText >= 1, `uc-${u.id}: Link im Fließtext ebenfalls vorhanden (${imText})`);
  await knopf.click();
  await page.waitForSelector(".d-beispiel .d-bsp-kopf", { timeout: 15000 });
  const url = new URL(page.url());
  pruefe(url.pathname === "/" + u.lab && url.search === "?beispiel=" + u.id, `uc-${u.id}: Adresse ${url.pathname}${url.search}`);
  pruefe((await page.textContent(".d-bsp-kopf")).includes(u.titel), `uc-${u.id}: Labor zeigt "${u.titel}"`);
  // Zurück zur Seite, ohne dass ein Labor-Modell geladen bleibt
  await page.goBack();
}
// Baustein "bereiche" auf der Business-Seite
await oeffneSeite(page, "business");
const bereiche = [...new Set(manifest.usecases.map((u) => u.bereich))];
await page.waitForSelector("a.w-bsp", { state: "attached", timeout: 10000 });
const links = await page.$$eval("a.w-bsp", (a) => a.map((x) => x.getAttribute("href")));
for (const u of manifest.usecases) pruefe(links.includes(`#/${u.lab}?beispiel=${u.id}`), `bereiche: Beispiel starten für ${u.id}`);
pruefe(bereiche.length === 7, "bereiche: sieben Bereiche mit Beispielen im Katalog");
// Falsche oder fremde Adresse bricht das Labor nicht
await page.goto(`${URL_LABOR}/anlernen?beispiel=gibt-es-nicht`, { waitUntil: "load" });
await page.waitForSelector(".d-beispiel", { timeout: 10000 });
pruefe(/gibt es nicht/.test(await page.textContent(".d-beispiel")), "unbekanntes Beispiel: freundliche Meldung, Labor läuft");
await page.goto(`${URL_LABOR}/anlernen?beispiel=service-bestellung`, { waitUntil: "load" });
await page.waitForSelector(".d-beispiel", { timeout: 10000 });
pruefe(/anderen Labor/.test(await page.textContent(".d-beispiel")), "Beispiel eines anderen Labors: Hinweis statt Fehler");
pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
await t.schliessen();
assert.equal(schlecht, 0);
