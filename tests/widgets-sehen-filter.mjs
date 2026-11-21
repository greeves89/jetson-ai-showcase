// Bedient das filter-labor: Kantenfilter auf Streifenbild, Kernel editieren, Rechenschritt, Pooling, Schichten, Kamera.
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const dunkel = process.argv[2] !== "hell";
const t = await starte({ dunkel });
const { page } = t;
await oeffneSeite(page, "cnn-intuition");
await page.locator(".sa-fl .sa-paar").scrollIntoViewIfNeeded();
const erg = (x, y) => page.evaluate(([x, y]) => { const c = document.querySelector(".sa-fl canvas[aria-label='Ergebnis des Filters']"); return [c.width, c.height, c.getContext("2d").getImageData(x, y, 1, 1).data[0]]; }, [x, y]);
await page.click('.sa-fl button.chip:has-text("Streifen")');
await page.click('.sa-fl .sa-filterchips button:has-text("Kanten senkrecht")');
await page.click('.sa-fl .sa-chips[aria-label="Darstellung des Ergebnisses"] button:has-text("Nur Betrag")');
await page.waitForTimeout(300);
// Streifen: dunkle Streifen zwischen x=20..40, 60..80 ...; Kante bei x=20
const kante = await erg(20, 60), flaeche = await erg(30, 60), hell = await erg(10, 60);
console.log("Kante/Flaeche/hell:", kante[2], flaeche[2], hell[2]);
assert.ok(kante[2] > 200, "Kante leuchtet");
assert.equal(flaeche[2], 0); assert.equal(hell[2], 0);
// waagerechte Kante antwortet auf senkrechte Streifen nicht
await page.click('.sa-fl .sa-filterchips button:has-text("Kanten waagerecht")');
await page.waitForTimeout(300);
assert.equal((await erg(20, 60))[2], 128, "Mittelgrau = keine Antwort: waagerechter Filter findet senkrechte Kante nicht");
// Position per Regler auf die Kante, Rechenschritt zeigt Summe
await page.click('.sa-fl .sa-filterchips button:has-text("Kanten senkrecht")');
await page.locator('.sa-fl .regler:has(label:text("Spalte")) input').fill("20");
await page.locator('.sa-fl .regler:has(label:text("Zeile")) input').fill("60");
await page.waitForTimeout(300);
const summe = await page.textContent(".sa-fl .sa-summe");
console.log(summe);
assert.match(summe, /Summe der neun Produkte: -840\./);
const prod = await page.$$eval(".sa-fl .sa-matwrap:nth-child(5) .sa-mat span, .sa-fl .sa-rechnung > .sa-matwrap:last-child .sa-mat span", (s) => s.length);
assert.equal(prod, 9);
// Eigener Filter: Kernel editieren
await page.fill('.sa-fl input[aria-label="Filterwert Zeile 2, Spalte 2"]', "3");
assert.equal(await page.getAttribute('.sa-fl .sa-filterchips button:has-text("Eigener Filter")', "aria-pressed"), "true");
// Pooling halbiert
await page.click('.sa-fl .w-schalter:has-text("Pooling") .w-sw');
await page.waitForTimeout(300);
assert.deepEqual((await erg(0, 0)).slice(0, 2), [120, 90]);
// Schichten
await page.click('.sa-fl button.chip:has-text("Schichten")');
await page.waitForTimeout(500);
assert.match(await page.textContent(".sa-fl .sa-schichten .sa-erkl"), /Prozent des Bildes|keine Stelle/);
assert.match(await page.textContent(".sa-fl .sa-schichten .w-hinweis"), /Illustration/);
// Kamera live
await page.click('.sa-fl button.chip:has-text("Ein Filter")');
await page.click('.sa-fl .sa-chips[aria-label="Bildquelle"] button:has-text("Kamera")');
await page.waitForFunction(() => { const c = document.querySelector(".sa-fl canvas[aria-label='Originalbild']"); return c.getContext("2d").getImageData(100, 90, 1, 1).data[3] > 0; }, null, { timeout: 8000 });
await page.waitForTimeout(500);
const lebt = await page.evaluate(() => document.querySelector(".sa-fl video").srcObject && document.querySelector(".sa-fl video").srcObject.getTracks().every((x) => x.readyState === "live"));
assert.ok(lebt, "Kamera laeuft");
await page.evaluate(() => { window.__v = document.querySelector(".sa-fl video"); location.hash = "#/start"; });
await page.waitForTimeout(600);
assert.equal(await page.evaluate(() => window.__v.srcObject), null, "destroy stoppt Kamera");
console.log(t.fehler.length ? t.fehler.join("\n") : "filter-labor ok");
assert.equal(t.fehler.length, 0);
await t.schliessen();
