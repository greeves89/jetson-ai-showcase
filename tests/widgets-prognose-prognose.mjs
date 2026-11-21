// Bedient prognose-labor (Seite zeitreihen): Band wächst mit Rauschen, Eingriffe per Klick und Taste, Fehler.
//   node tests/widgets-prognose-prognose.mjs [hell]
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const dunkel = process.argv[2] !== "hell";
const t = await starte({ kamera: false, dunkel });
const { page } = t;
await oeffneSeite(page, "zeitreihen");
await page.locator("#ausprobieren").scrollIntoViewIfNeeded();
const wurzel = ".pg-prog";
const d = () => page.evaluate((s) => ({ ...document.querySelector(s).dataset }), wurzel);
const regler = (n, v) => page.locator(`[data-regler="${n}"]`).fill(String(v));
const satz = () => page.textContent('[data-pg="satz"]');
const pixel = () => page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(() => ok(document.querySelector(".pg-canvas").toDataURL())))));

let z = await d();
console.log("Start:", z);
assert.ok(Math.abs(Number(z.trendGeschaetzt) - 2) < 0.6, "geschätzter Trend nahe 2: " + z.trendGeschaetzt);
assert.match(await satz(), /Der Trend steigt um 2,\d Einheiten pro Monat/);
assert.match(await satz(), /alle 12 Punkte/);
assert.equal(Number(z.imBand) <= 12, true);

// Band wächst mit dem Rauschen
await regler("rauschen", 2); const klein = Number((await d()).bandMittel);
await regler("rauschen", 20); const gross = Number((await d()).bandMittel);
console.log("Band bei Rauschen 2:", klein, "bei 20:", gross);
assert.ok(gross > klein * 2, "Band deutlich breiter bei mehr Rauschen");
// ohne Rauschen und ohne Saison ist die Prognose fast fehlerfrei
await regler("rauschen", 0);
z = await d(); assert.ok(Number(z.fehlerModell) < 0.5, "ohne Rauschen kaum Fehler: " + z.fehlerModell);
await regler("rauschen", 6);

// Band wächst nach rechts: Breite am Ende größer als der Mittelwert
z = await d(); assert.ok(Number(z.band) > Number(z.bandMittel), "Band am Ende breiter als im Mittel");

// Länge der Historie: kurze Historie schlägt die Faustregel seltener als lange
await regler("historie", 48); const lang = await d();
await regler("historie", 14); const kurz = await d();
console.log("Fehler Modell lang/kurz:", lang.fehlerModell, kurz.fehlerModell, "Band lang/kurz:", lang.band, kurz.band);
assert.notEqual(lang.sigma, kurz.sigma);
await regler("historie", 36);

// Prognose ein/aus zeichnet anders
const mit = await pixel();
await page.click('[data-pg="prognose"]');
assert.equal(await page.getAttribute('[data-pg="prognose"]', "aria-pressed"), "false");
assert.notEqual(await pixel(), mit, "Zeichnung ändert sich ohne Prognose");
await page.click('[data-pg="prognose"]');

// Ereignis: vorher/nachher Fehler
const vorher = Number((await d()).fehlerModell);
await page.click('[data-pg="ereignis"]');
z = await d();
console.log("mit Ereignis:", z.fehlerModell, "vorher", vorher);
assert.ok(Number(z.fehlerModell) > vorher + 10, "Prognose liegt beim Ereignis sichtbar daneben");
assert.match(await satz(), /Ab Punkt \d+ ändert sich das Niveau/);
assert.equal(await page.getAttribute('[data-pg="ereignis"]', "aria-pressed"), "true");
await page.click('[data-pg="ereignis"]');
assert.equal(Number((await d()).fehlerModell), vorher, "Ereignis entfernt: Fehler wie vorher");

// Ausreißer per Knopf: verschiebt den Trend
const trendVor = Number((await d()).trendGeschaetzt);
await page.click('[data-pg="ausreisser"]');
const trendNach = Number((await d()).trendGeschaetzt);
assert.notEqual(trendVor, trendNach);
assert.match(await satz(), /Der Ausreißer bei Punkt \d+ verschiebt den geschätzten Trend/);
await page.click('[data-pg="ausreisser"]');

// Ausreißer per Klick an gewählter Stelle (etwa ein Viertel der Breite)
const c = page.locator(".pg-canvas"); const box = await c.boundingBox();
await page.mouse.click(box.x + box.width * 0.25, box.y + box.height * 0.12);
const m = (await satz()).match(/Ausreißer bei Punkt (\d+)/);
assert.ok(m, "Ausreißer per Klick gesetzt");
const erwartet = Math.round((box.width * 0.25 - 10) / (box.width - 20) * 47) + 1;
assert.ok(Math.abs(Number(m[1]) - erwartet) <= 1, `Klickstelle Punkt ${m[1]}, erwartet ${erwartet}`);
assert.equal(await page.getAttribute('[data-pg="ausreisser"]', "aria-pressed"), "true");

// Tastatur: Fokus, Pfeil, Enter setzt Ereignis nach Wechsel des Modus; Rücktaste nimmt zurück
await page.click('[data-pg="ereignis"]'); // setzt Standardereignis, Modus Ereignis
await page.click('[data-pg="ereignis"]'); // entfernt es wieder
await c.focus();
for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight");
await page.keyboard.press("Enter");
assert.equal(await page.getAttribute('[data-pg="ereignis"]', "aria-pressed"), "true", "Ereignis per Tastatur gesetzt");
await page.keyboard.press("Backspace");
assert.equal(await page.getAttribute('[data-pg="ereignis"]', "aria-pressed"), "false", "mit Rücktaste entfernt");
assert.match(await page.textContent('[data-pg="cursor"]'), /Punkt \d+/);

// Zufall neu würfeln ändert die Reihe
const vorW = await pixel();
await page.click('[data-pg="wuerfeln"]');
assert.notEqual(await pixel(), vorW);

// Texte
const alles = await page.textContent("#ausprobieren");
assert.doesNotMatch(alles, /[–—]/, "keine Gedankenstriche");

// Foto mit Ereignis
await page.click('[data-pg="ereignis"]');
await page.locator("#ausprobieren").screenshot({ path: `tests/ausgabe/pg-prognose-${dunkel ? "dunkel" : "hell"}.png` });
console.log("prognose-labor: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
