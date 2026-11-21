// Filter blendet Zeilen aus, Zeilen klappen nativ auf, Laborlinks stimmen.
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false });
const { page } = t;
await oeffneSeite(page, "business");
const sichtbar = () => page.$$eval("details.bz", (d) => d.filter((x) => !x.hidden).map((x) => x.querySelector(".b").textContent));
assert.equal((await sichtbar()).length, 7);
await page.click('.filter button:has-text("Handeln")');
let s = await sichtbar();
assert.deepEqual(s, ["Logistik und Lager", "Kundenservice"]);
assert.equal(await page.getAttribute('.filter button:has-text("Handeln")', "aria-pressed"), "true");
assert.equal(await page.getAttribute('.filter button:has-text("Alle")', "aria-pressed"), "false");
assert.match(await page.textContent(".w-zahl"), /^2 von 7/);
await page.click('.filter button:has-text("Erzeugen")');
assert.deepEqual(await sichtbar(), ["Büro und Wissen"]);
await page.click('.filter button:has-text("Alle")');
assert.equal((await sichtbar()).length, 7);
// aufklappen
const zeile = page.locator("details.bz").first();
assert.equal(await zeile.getAttribute("open"), null);
await zeile.locator("summary").click();
assert.notEqual(await zeile.getAttribute("open"), null);
const dts = await zeile.locator("dt").allTextContents();
assert.deepEqual(dts.slice(0, 4), ["Wie", "Warum", "Frage vor dem Einsatz", "Im Labor ausprobieren"]);
const links = await zeile.locator("a.w-link").evaluateAll((a) => a.map((x) => [x.getAttribute("href"), x.textContent]));
assert.deepEqual(links.map((l) => l[0]), ["#/anlernen", "#/objekt"]);
assert.ok(links.every((l) => l[1].trim().length > 2));
// Tastatur: Summary per Leertaste
await page.focus("details.bz:nth-of-type(2) summary");
await page.keyboard.press("Enter");
assert.notEqual(await page.locator("details.bz").nth(1).getAttribute("open"), null);
await page.click("a.w-link >> nth=0");
await page.waitForFunction(() => location.hash === "#/anlernen");
console.log("bereiche: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
