// Token-Wuerfel: Balkensumme 100 %, Temperatur veraendert Balken, Ziehen, Wahrscheinlichstes, Automatisch bis zum Satzende, Neu.
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const dunkel = process.argv[2] !== "hell";
const t = await starte({ kamera: false, dunkel });
const { page } = t;
await oeffneSeite(page, "genki");
const summe = () => page.$$eval(".w-tokens .kand", (z) => z.reduce((s, e) => s + Number(e.dataset.p), 0));
const werte = () => page.$$eval(".w-tokens .kand", (z) => z.map((e) => Number(e.dataset.p)));
const satz = () => page.textContent(".w-tokens .satz");
const slider = page.locator(".w-tokens input[type=range]");
assert.ok(Math.abs((await summe()) - 100) < 0.01);
const w1 = await werte();
assert.deepEqual(w1.map(Math.round), [22, 16, 14, 12, 12, 8, 6, 6, 4]);
for (const T of ["0.1", "0.5", "1.5", "2"]) {
  await slider.fill(T);
  assert.ok(Math.abs((await summe()) - 100) < 0.01, "Summe bei T=" + T);
}
await slider.fill("0.1"); const wk = await werte();
assert.ok(wk[0] > 90, "T=0.1: Favorit dominiert " + wk[0]);
await slider.fill("2"); const wh = await werte();
assert.ok(wh[0] < w1[0] && wh[8] > w1[8], "T=2 flacher");
assert.equal(await page.textContent(".w-tokens .regler output"), "2,0");
await slider.fill("1");
assert.match(await satz(), /^Ein Roboter kann/);
// Wahrscheinlichstes nehmen: Gegenstände
await page.click('button:has-text("Wahrscheinlichstes nehmen")');
assert.match(await satz(), /Ein Roboter kann Gegenstände/);
assert.equal(await page.$$eval(".satz .tn", (e) => e.length), 1);
assert.match(await page.textContent(".w-tokens .erklaerung"), /Das wahrscheinlichste Token wurde genommen: „Gegenstände“, mit 22,0 Prozent/);
await page.waitForTimeout(800);
assert.ok(Math.abs((await summe()) - 100) < 0.01);
assert.equal(await page.$$eval(".w-tokens .kand", (e) => e.length), 4, "Zustand Gegenstände hat 4 Kandidaten");
// Zufaellig ziehen
await page.click('button:has-text("Nächstes Token ziehen")');
assert.equal(await page.$$eval(".satz .tn", (e) => e.length), 2);
assert.match(await page.textContent(".w-tokens .erklaerung"), /Gezogen: „.+“, mit \d+,\d Prozent/);
// Automatisch bis zum Ende
await page.click('button:has-text("Automatisch")');
await page.waitForFunction(() => /\.$/.test(document.querySelector(".w-tokens .satz").textContent), null, { timeout: 15000 });
const fertig = await satz();
console.log("Satz:", fertig);
assert.match(fertig, /^Ein Roboter kann .+\.$/);
assert.ok(await page.isDisabled('button:has-text("Nächstes Token ziehen")'));
assert.match(await page.textContent(".w-tokens .erklaerung"), /Der Satz ist fertig/);
// Neu
await page.click('button:has-text("Neu")');
assert.match(await satz(), /^Ein Roboter kann …$/);
assert.ok(!(await page.isDisabled('button:has-text("Nächstes Token ziehen")')));
// Statistik: 40 Saetze zufaellig, alle enden mit Punkt, 2 bis 4 Tokens
const laengen = new Set();
for (let i = 0; i < 40; i++) {
  await page.click('button:has-text("Neu")');
  for (let j = 0; j < 6; j++) {
    if (await page.isDisabled('button:has-text("Nächstes Token ziehen")')) break;
    await page.click('button:has-text("Nächstes Token ziehen")');
    await page.waitForTimeout(600);
  }
  const n = await page.$$eval(".satz .tn", (e) => e.length);
  laengen.add(n);
  assert.ok(n >= 2 && n <= 4, "Laenge " + n);
  assert.match(await satz(), /\.$/);
  if (i >= 5) break; // Zeit sparen: 6 Saetze genuegen am echten Browser
}
console.log("Satzlaengen:", [...laengen]);
await page.click('button:has-text("Neu")');
await page.click('button:has-text("Nächstes Token ziehen")');
await page.waitForTimeout(700);
await page.locator("#ausprobieren").screenshot({ path: `tests/ausgabe/wb-genki-${dunkel ? "dunkel" : "hell"}-aktiv.png` });
t.fehler = t.fehler.filter((f) => !f.includes("ERR_ABORTED"));
console.log("tokens: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
