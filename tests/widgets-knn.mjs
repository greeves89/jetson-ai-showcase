// Bedient den Punktespielplatz: Punkte setzen, Hover-Satz, k, Flaeche, Beispieldaten, Leeren, Tastatur.
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const dunkel = process.argv[2] !== "hell";
const t = await starte({ kamera: false, dunkel });
const { page } = t;
await oeffneSeite(page, "ml");
const c = page.locator("canvas.spiel");
await c.scrollIntoViewIfNeeded();
const box = await c.boundingBox();
const satz = () => page.textContent(".w-knn .erklaerung");
const farbPixel = () => page.evaluate(() => {
  const cv = document.querySelector("canvas.spiel"); const d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data;
  let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n;
});
assert.match(await satz(), /Feld ist leer/);
assert.equal(await farbPixel(), 0);
// Punkte setzen: 4 blaue links, 1 orange nahe
const pt = (fx, fy) => ({ x: box.x + box.width * fx, y: box.y + box.height * fy });
for (const [fx, fy] of [[0.2, 0.3], [0.22, 0.34], [0.18, 0.36], [0.24, 0.28]]) { const p = pt(fx, fy); await page.mouse.click(p.x, p.y); }
await page.click('.klasse-btn:has-text("Orange")');
assert.equal(await page.getAttribute('.klasse-btn:has-text("Orange")', "aria-pressed"), "true");
{ const p = pt(0.26, 0.31); await page.mouse.click(p.x, p.y); }
await page.mouse.move(pt(0.21, 0.32).x, pt(0.21, 0.32).y);
let s = await satz();
console.log("Satz k=5:", s);
assert.match(s, /5 nächsten Nachbarn 4 Punkte in Blau und 1 Punkt in Orange\. Die Mehrheit gewinnt: Blau\./);
// k=1: naechster Nachbar entscheidet
await page.locator('.w-knn input[type=range]').focus();
for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowLeft");
assert.equal(await page.textContent(".w-knn .regler output"), "1");
s = await satz(); console.log("Satz k=1:", s);
assert.match(s, /einen Punkt in (Blau|Orange)/);
// Beispieldaten + Flaeche
await page.click('button:has-text("Beispieldaten")');
const ohneFlaeche = await farbPixel();
await page.click('.w-schalter');
assert.equal(await page.isChecked('.w-knn input[role=switch]'), true);
const mitFlaeche = await farbPixel();
assert.ok(mitFlaeche > ohneFlaeche * 5, `Flaeche gezeichnet ${ohneFlaeche} -> ${mitFlaeche}`);
// Ueberanpassungshinweis bei k=1 mit Ausreissern
const hint = page.locator(".w-knn .w-hinweis");
assert.equal(await hint.isVisible(), true, "Hinweis bei k=1 sichtbar");
assert.match(await hint.textContent(), /Überanpassung/);
await page.locator('.w-knn input[type=range]').fill("9");
assert.equal(await hint.isVisible(), false, "Hinweis bei k=9 weg");
await page.mouse.move(pt(0.5, 0.5).x, pt(0.5, 0.5).y);
s = await satz(); console.log("Satz k=9:", s);
assert.match(s, /9 nächsten Nachbarn/);
// Tastatur: Fokus auf Spielfeld, Pfeil + Enter setzt Punkt
await page.click('button:has-text("Leeren")');
assert.match(await satz(), /Feld ist leer/);
await c.focus();
await page.keyboard.press("3");
await page.keyboard.press("ArrowRight"); await page.keyboard.press("Enter");
assert.match(await satz(), /Punkt in Grün/);
await page.keyboard.press("Backspace");
assert.match(await satz(), /Feld ist leer/);
// Bildschirmfotos
await page.click('button:has-text("Beispieldaten")');
await page.locator('.w-knn input[type=range]').fill("5");
await page.mouse.move(pt(0.47, 0.5).x, pt(0.47, 0.5).y);
await page.locator("#ausprobieren").screenshot({ path: `tests/ausgabe/wb-ml-${dunkel ? "dunkel" : "hell"}-aktiv.png` });
t.fehler = t.fehler.filter((f) => !f.includes("ERR_ABORTED"));
console.log("knn: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
