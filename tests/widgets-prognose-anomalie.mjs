// Bedient anomalie-labor (Seite anomalien): Schwelle, Verfahren, Rauschen, neue Reihe.
//   node tests/widgets-prognose-anomalie.mjs [hell]
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const dunkel = process.argv[2] !== "hell";
const t = await starte({ kamera: false, dunkel });
const { page } = t;
await oeffneSeite(page, "anomalien");
await page.locator("#ausprobieren").scrollIntoViewIfNeeded();
const wurzel = ".pg-anomalie";
const zahlen = async () => { const d = await page.evaluate((s) => ({ ...document.querySelector(s).dataset }), wurzel); return { tr: +d.treffer, fa: +d.fehlalarme, ue: +d.uebersehen, me: +d.meldungen }; };
const k = (v) => page.locator('[data-regler="schwelle"]').fill(String(v));
const verfahren = (v) => page.click(`.pg-chips [data-wert="${v}"]`);
const pixel = () => page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(() => ok(document.querySelector(".pg-c-anomalie").toDataURL())))));

// Zähler sind in sich stimmig, Satz nennt die Abwägung
await k(2);
let z = await zahlen();
console.log("Start (k=2, feste Schwelle):", z);
assert.equal(z.tr + z.ue, 6, "echte Fälle: gefunden plus übersehen = 6");
assert.equal(z.tr + z.fa, z.me, "Meldungen = echt plus Fehlalarm");
const satz = await page.textContent('[data-pg="satz"]');
assert.match(satz, new RegExp(`Von ${z.me} Meldungen (ist|sind) ${z.tr} echt und ${z.fa}`));
assert.match(await page.textContent(".pg-alltag"), /Rauchmelder/);

// Höhere Schwelle: Fehlalarme sinken (nie steigen), übersehene Fälle steigen (nie sinken)
let vorher = null, streng = 0;
for (const v of [1, 1.5, 2, 2.5, 3, 4, 5, 6]) {
  await k(v); const n = await zahlen();
  if (vorher) { assert.ok(n.fa <= vorher.fa, `Fehlalarme sinken bei ${v}`); assert.ok(n.ue >= vorher.ue, `Übersehene steigen bei ${v}`); if (n.fa < vorher.fa) streng++; }
  vorher = n;
}
assert.ok(streng >= 1, "Fehlalarme sinken mindestens einmal wirklich");
await k(1.0); const tief = await zahlen(); await k(4.0); const hoch = await zahlen();
console.log("Schwelle 1,0:", tief, "Schwelle 4,0:", hoch);
assert.ok(hoch.fa < tief.fa, "höhere Schwelle senkt Fehlalarme");
assert.ok(hoch.ue > tief.ue, "höhere Schwelle erhöht die übersehenen Fälle");
assert.ok(tief.fa > tief.tr, "bei Schwelle 1 sind die meisten Meldungen falsch");
await k(1.0);
assert.match(await page.textContent(".pg-alltag"), /Mehr als die Hälfte/);

// Saisonverfahren trennt besser als die feste Schwelle
await k(2.5);
await verfahren("fest"); const fest = await zahlen();
await verfahren("saison"); const saison = await zahlen();
console.log("k=2,5 fest:", fest, "saison:", saison);
assert.ok(saison.tr > fest.tr, "Saison berücksichtigt findet mehr echte Fälle");
await verfahren("fenster"); const fenster = await zahlen();
assert.equal(fenster.tr + fenster.ue, 6);

// Mehr Rauschen macht das Trennen schwerer
await verfahren("saison"); await k(2.5);
const leise = await zahlen();
await page.locator('[data-pg="laut"]').evaluate((e) => e.click());
const laut = await zahlen();
console.log("leise:", leise, "laut:", laut);
assert.ok(laut.tr < leise.tr || laut.fa > leise.fa, "mit Rauschen wird es schlechter");
assert.ok(laut.tr <= leise.tr);
await page.locator('[data-pg="laut"]').evaluate((e) => e.click());

// neue Messreihe
const vorW = await pixel();
await page.click('[data-pg="wuerfeln"]');
assert.notEqual(await pixel(), vorW, "neue Reihe, neue Zeichnung");
const nachW = await zahlen(); assert.equal(nachW.tr + nachW.ue, 6);

// Tastatur: Regler mit Pfeiltaste
await k(3);
await page.locator('[data-regler="schwelle"]').focus();
await page.keyboard.press("ArrowRight");
assert.equal((await page.textContent(".pg-anomalie .regler output")).trim(), "3,1");

// Verfahren wählen per Tastatur (Chips sind Knöpfe)
await page.locator('.pg-chips [data-wert="fest"]').focus(); await page.keyboard.press("Enter");
assert.equal(await page.getAttribute('.pg-chips [data-wert="fest"]', "aria-pressed"), "true");

const alles = await page.textContent("#ausprobieren");
assert.doesNotMatch(alles, /[–—]/, "keine Gedankenstriche");
await k(2); await verfahren("fest");
await page.locator("#ausprobieren").screenshot({ path: `tests/ausgabe/pg-anomalie-${dunkel ? "dunkel" : "hell"}.png` });
console.log("anomalie-labor: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
