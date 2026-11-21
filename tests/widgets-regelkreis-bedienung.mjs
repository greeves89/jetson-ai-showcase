// Regelkreis bedienen: Hindernis setzen und entfernen per Klick, Leeren, Pause, Seitenwechsel ohne Fehler, Rueckkehr.
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false });
const { page } = t;
await page.clock.install({ time: 0 });
await oeffneSeite(page, "robotik");
await page.locator("canvas.w-sim").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
const cv = page.locator("canvas.w-sim");
const hindernisse = () => page.evaluate(() => { const c = document.querySelector("canvas.w-sim"); return c.getContext("2d").getImageData(0, 0, c.width, c.height).data.length; });
await page.clock.runFor(1000);
const box = await cv.boundingBox();
const px = (x, y) => [box.x + (x / 640) * box.width, box.y + (y / 360) * box.height];
const zaehleLeer = async () => { // zaehlt graue Hindernisfuellung (flaeche3) per Bildabtastung ueber Pixel am Klickpunkt
  return page.evaluate(([x, y]) => { const c = document.querySelector("canvas.w-sim"); const d = c.getContext("2d").getImageData(Math.round(x * c.width / 640), Math.round(y * c.height / 360), 1, 1).data; return [...d]; }, [0, 0]);
};
// Hindernisse leeren, dann an freier Stelle eines setzen
await page.click('button:has-text("Hindernisse leeren")');
const farbeLeer = await page.evaluate(([x, y]) => { const c = document.querySelector("canvas.w-sim"); return [...c.getContext("2d").getImageData(Math.round(x * c.width / 640), Math.round(y * c.height / 360), 1, 1).data]; }, [320, 100]);
await page.mouse.click(...px(320, 100));
await page.clock.runFor(100);
const farbeMit = await page.evaluate(([x, y]) => { const c = document.querySelector("canvas.w-sim"); return [...c.getContext("2d").getImageData(Math.round(x * c.width / 640), Math.round(y * c.height / 360), 1, 1).data]; }, [320, 100]);
assert.notDeepEqual(farbeLeer, farbeMit, "Hindernis gezeichnet");
await page.mouse.click(...px(320, 100));
await page.clock.runFor(100);
const farbeWeg = await page.evaluate(([x, y]) => { const c = document.querySelector("canvas.w-sim"); return [...c.getContext("2d").getImageData(Math.round(x * c.width / 640), Math.round(y * c.height / 360), 1, 1).data]; }, [320, 100]);
assert.deepEqual(farbeWeg, farbeLeer, "Hindernis per Klick entfernt");
// Pause haelt den Roboter an
await page.click('button:has-text("Pause")');
const a = await page.evaluate(() => document.querySelector(".w-regel").dataset.erreicht);
const bild1 = await page.evaluate(() => document.querySelector("canvas.w-sim").toDataURL());
await page.clock.runFor(3000);
assert.equal(await page.evaluate(() => document.querySelector("canvas.w-sim").toDataURL()), bild1, "pausiert: Bild bleibt stehen");
await page.click('button:has-text("Weiter")');
await page.clock.runFor(2000);
assert.notEqual(await page.evaluate(() => document.querySelector("canvas.w-sim").toDataURL()), bild1, "weiter: Bild bewegt sich");
// Hindernis setzen per Knopf (Tastatur erreichbar)
await page.click('button:has-text("Hindernis setzen")');
// Verzoegerung wirkt im Text
await page.locator('.w-regel input[type=range] >> nth=1').fill("8");
await page.clock.runFor(1500);
assert.match(await page.textContent(".w-pt >> nth=0"), /8 Frames alt/);
// Schalter aus
await page.click(".w-regel .w-schalter");
await page.clock.runFor(1000);
assert.match(await page.textContent(".w-pt >> nth=0"), /^Aus\./);
assert.match(await page.textContent(".w-regel .w-schalter"), /Wahrnehmung aus/);
// Seitenwechsel und zurueck
await page.evaluate(() => { location.hash = "#/hardware"; });
await page.clock.runFor(500);
await page.evaluate(() => { location.hash = "#/robotik"; });
await page.clock.runFor(500);
await page.waitForSelector("canvas.w-sim");
t.fehler = t.fehler.filter((f) => !f.includes("ERR_ABORTED"));
console.log("regelkreis-bedienung: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
