// Bedient das pixel-labor: Pixelwerte beim Ueberfahren, Kanaele, Helligkeit (Abschneiden), Aufloesung, Zahlentabelle, Kamera.
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const dunkel = process.argv[2] !== "hell";
const t = await starte({ dunkel });
const { page } = t;
await oeffneSeite(page, "bild-als-zahlen");
const cv = page.locator(".sa-pl canvas.sa-cv");
await cv.scrollIntoViewIfNeeded();
const box = await cv.boundingBox();
const tiles = () => page.$$eval(".sa-pl .sa-vier .messwert b", (b) => b.map((x) => Number(x.textContent)));
// Himmel links oben im Haus-Bild: #9ccbee = 156, 203, 238
await page.mouse.move(box.x + 3, box.y + 3);
let v = await tiles();
console.log("Pixel links oben:", v);
assert.deepEqual(v.slice(0, 3), [156, 203, 238]);
await page.waitForTimeout(700); // aria-live hoechstens zweimal pro Sekunde
assert.match(await page.textContent(".sa-pl .sa-erkl"), /Dieser Pixel hat die Werte 156, 203, 238\. Das ist/);
assert.match(await page.textContent(".sa-pl .sa-pos"), /Zeile 1, Spalte 1 von 72 mal 96/);
// Tabelle: 64 Zahlen, erste Zelle = Helligkeit
const zellen = await page.$$eval(".sa-pl .sa-tab tbody td:not([hidden])", (td) => td.length);
assert.equal(zellen, 64);
assert.equal(Number(await page.textContent(".sa-pl .sa-tab tbody tr:first-child td")), Math.round(0.299 * 156 + 0.587 * 203 + 0.114 * 238));
// Rot ausschalten
await page.click('.sa-pl .sa-kanal:has-text("Rot") .w-sw');
await page.mouse.move(box.x + 4, box.y + 4); await page.mouse.move(box.x + 3, box.y + 3);
v = await tiles(); assert.equal(v[0], 0); assert.equal(v[1], 203);
await page.click('.sa-pl .sa-kanal:has-text("Rot") .w-sw');
// Helligkeit +128: Himmel schlaegt an 255 an, Abgeschnitten steigt, Histogramm-Text nennt Pixel bei 255
const abgeschnitten = () => page.textContent('.sa-pl .sa-mess .messwert:has-text("Abgeschnitten") b');
const vorher = Number((await abgeschnitten()).replace(/\D/g, "").slice(0, 8).split(" ")[0]);
await page.locator('.sa-pl .regler:has(label:text("Helligkeit")) input').fill("128");
await page.mouse.move(box.x + 4, box.y + 4); await page.mouse.move(box.x + 3, box.y + 3);
v = await tiles(); console.log("Nach +128:", v); assert.deepEqual(v.slice(0, 3), [255, 255, 255]);
await page.waitForTimeout(700);
assert.match(await page.textContent(".sa-pl .sa-erkl"), /abgeschnitten/);
assert.notEqual(await abgeschnitten(), "0 Zahlen unter 0 oder über 255");
await page.locator('.sa-pl .regler:has(label:text("Helligkeit")) input').fill("0");
// Aufloesung: 12 mal 9
await page.locator('.sa-pl .regler:has(label:text("Auflösung")) input').fill("3");
assert.match(await page.textContent('.sa-pl .sa-mess .messwert:has-text("Pixel") b'), /108 \(12 × 9\)/);
await page.locator('.sa-pl .regler:has(label:text("Auflösung")) input').fill("0");
// Graustufen: alle drei Werte gleich
await page.click('.sa-pl .w-schalter:has-text("Graustufen") .w-sw');
await page.mouse.move(box.x + 4, box.y + 4); await page.mouse.move(box.x + 3, box.y + 3);
v = await tiles(); assert.ok(v[0] === v[1] && v[1] === v[2], "Graustufen gleich");
// Zoom und Zahlen im Bild
await page.locator(".sa-pl .sa-zoom input").fill("100");
const px = await cv.evaluate((c) => { const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n; });
assert.ok(px > 1000);
// Kamera: starten, Standbild, Tracks gestoppt
await page.click('.sa-pl button.chip:has-text("Kamera starten")');
await page.waitForSelector(".sa-pl .sa-video:not([hidden])");
await page.waitForFunction(() => !document.querySelector(".sa-pl .sa-kameraleiste .btn.primary").disabled, null, { timeout: 8000 });
await page.click('.sa-pl button:has-text("Standbild aufnehmen")');
assert.equal(await page.isHidden(".sa-pl .sa-video"), true);
const tracks = await page.evaluate(() => document.querySelector(".sa-pl .sa-video").srcObject);
assert.equal(tracks, null, "Kamera nach Standbild gestoppt");
assert.equal(await page.getAttribute('.sa-pl button.chip:has-text("Kamera starten")', "aria-pressed"), "true");
assert.match(await page.textContent(".sa-pl .w-hinweis"), /nicht an einen Server/);
// Seitenwechsel gibt alles frei
await page.click('.sa-pl button.chip:has-text("Kamera starten")');
await page.waitForSelector(".sa-pl .sa-video:not([hidden])");
await page.evaluate(() => { location.hash = "#/start"; });
await page.waitForTimeout(500);
console.log(t.fehler.length ? t.fehler.join("\n") : "pixel-labor ok");
assert.equal(t.fehler.length, 0);
await t.schliessen();
