// Bedient empfehlungs-labor (Seite empfehlungen): Nachbarn, Handrechnung der Ähnlichkeit, Bewertung ändern,
// Kaltstart, Artikelverfahren, Filterblase und Vielfalt.
//   node tests/widgets-prognose-empfehlung.mjs [hell]
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const dunkel = process.argv[2] !== "hell";
const t = await starte({ kamera: false, dunkel });
const { page } = t;
await oeffneSeite(page, "empfehlungen");
await page.locator("#ausprobieren").scrollIntoViewIfNeeded();
const wurzel = ".pg-emp";
const d = () => page.evaluate((s) => ({ ...document.querySelector(s).dataset }), wurzel);
const waehle = (n) => page.click(`.pg-name[data-nutzer="${["Anna", "Ben", "Cem", "Dora", "Emil", "Fynn", "Gita", "Hugo", "Neu"].indexOf(n)}"]`);
const zelle = (n, i) => page.locator(`.pg-zelle[data-u="${["Anna", "Ben", "Cem", "Dora", "Emil", "Fynn", "Gita", "Hugo", "Neu"].indexOf(n)}"][data-i="${i}"]`);

// Anna: drei Nachbarn, Ähnlichkeit Anna-Ben nach Handrechnung
let z = await d();
console.log("Anna:", z);
assert.equal(z.nutzer, "Anna"); assert.equal(z.kaltstart, "0");
assert.equal(await page.locator('.pg-sim[data-nachbar="1"]').count(), 3);
const a = [5, 4, 5, 0, 0, 0, 0, 0, 0, 0], b = [4, 5, 4, 0, 0, 5, 0, 0, 0, 2];
const hand = a.reduce((s, x, i) => s + x * b[i], 0) / Math.sqrt(a.reduce((s, x) => s + x * x, 0) * b.reduce((s, x) => s + x * x, 0));
const ben = Number(await page.locator('.pg-sim[data-nutzer="Ben"]').getAttribute("data-aehnlich"));
console.log("Ähnlichkeit Anna-Ben: Seite", ben, "Handrechnung", hand.toFixed(4));
assert.ok(Math.abs(ben - hand) < 1e-3);
const werte = await page.$$eval(".pg-sim", (els) => els.map((e) => Number(e.dataset.aehnlich)));
assert.deepEqual(werte, [...werte].sort((x, y) => y - x), "Ähnlichkeiten absteigend");
// Empfehlungen: höchstens drei, mit Begründung und Wert
const recs = await page.$$eval(".pg-rec", (els) => els.map((e) => e.dataset.artikel));
assert.equal(recs.length, 3);
assert.match(await page.textContent('[data-pg="empfehlungen"]'), /Ähnliche Nutzer: .* gab \d/);
// Anna kennt ihre bewerteten Artikel schon, die dürfen nicht empfohlen werden
for (const bekannt of ["Schmierplan Pressen", "Lagerwechsel", "Sensorik Grundlagen"]) assert.ok(!recs.includes(bekannt), bekannt + " ist schon bewertet");
// Vorhersagen stehen in leeren Zellen der gewählten Person
assert.ok(await page.locator(".pg-zelle.vorher").count() >= 3);

// Bewertung ändern: Annas Top-Empfehlung selbst bewerten, die Liste ändert sich
const vorTop = z.top;
const topName = z.top.split("|")[0];
const idx = ["Schmierplan Pressen", "Lagerwechsel", "Sensorik Grundlagen", "Energie sparen", "Schichtübergabe", "Hydraulik-Störungen", "Kalibrierung", "Brandschutz", "Stichprobenprüfung", "Einarbeitung"].indexOf(topName);
await zelle("Anna", idx).focus(); await page.keyboard.press("1");
z = await d();
console.log("nach Bewertung von", topName, "=> ", z.top);
assert.notEqual(z.top, vorTop, "Empfehlungen ändern sich");
assert.ok(!z.top.split("|").includes(topName), "bewerteter Artikel nicht mehr empfohlen");
assert.equal(await zelle("Anna", idx).textContent(), "1");
// Fokus bleibt auf der Zelle, Klick erhöht um 1
assert.equal(await page.evaluate(() => document.activeElement.dataset.i), String(idx));
await zelle("Anna", idx).click();
assert.equal(await zelle("Anna", idx).textContent(), "2");
// Rücktaste leert wieder
await zelle("Anna", idx).focus(); await page.keyboard.press("Backspace");
assert.equal(await zelle("Anna", idx).textContent() === "" || (await zelle("Anna", idx).getAttribute("class")).includes("vorher"), true);

// Filterblase bei Anna, Vielfalt mischt etwas aus dem anderen Feld bei
await waehle("Anna");
z = await d();
assert.equal(z.blase, "1", "Filterblase erkannt");
assert.match(await page.textContent('[data-pg="blase"]'), /Filterblase: Fast alle Empfehlungen/);
const ohne = z.top;
await page.locator('[data-pg="vielfalt"]').evaluate((e) => e.click());
z = await d();
assert.equal(z.vielfalt, "1");
assert.notEqual(z.top, ohne);
assert.equal(await page.locator(".pg-rec em", { hasText: "Entdeckung" }).count(), 1);
assert.match(await page.textContent('[data-pg="blase"]'), /gebremst/);
await page.locator('[data-pg="vielfalt"]').evaluate((e) => e.click());

// Kaltstart: Neu hat nichts bewertet
await waehle("Neu");
z = await d();
assert.equal(z.kaltstart, "1");
assert.match(await page.textContent('[data-pg="kaltstart"]'), /fällt auf Beliebtes zurück/);
assert.match(await page.textContent('[data-pg="satz"]'), /Neu hat noch nichts bewertet/);
const beliebt = z.top;
// zwei Bewertungen machen die Liste persönlich
await zelle("Neu", 3).focus(); await page.keyboard.press("5");   // Energie sparen
await zelle("Neu", 4).focus(); await page.keyboard.press("5");   // Schichtübergabe
z = await d();
console.log("Neu nach zwei Bewertungen:", z.top);
assert.equal(z.kaltstart, "0");
assert.notEqual(z.top, beliebt);
assert.ok(await page.locator('.pg-sim[data-nachbar="1"]').count() >= 1);

// Artikelähnlichkeit: anderes Verfahren, Panel zeigt Artikel
await waehle("Ben");
await page.click('.pg-chips [data-wert="artikel"]');
z = await d();
assert.equal(z.modus, "artikel");
assert.ok(await page.locator(".pg-sim[data-artikel]").count() >= 3);
assert.match(await page.textContent('[data-pg="empfehlungen"]'), /Ähnliche Artikel, die du kennst/);
const ersteRec = page.locator("button.pg-rec").nth(1);
if (await ersteRec.count()) { await ersteRec.click(); assert.equal(await page.locator(".pg-rec.ist-gewaehlt").count(), 1); }

// Zahl der Nachbarn wirkt
await page.click('.pg-chips [data-wert="nutzer"]');
await waehle("Anna");
await page.locator('[data-regler="nachbarn"]').fill("1");
assert.equal(await page.locator('.pg-sim[data-nachbar="1"]').count(), 1);

const alles = await page.textContent("#ausprobieren");
assert.doesNotMatch(alles, /[–—]/, "keine Gedankenstriche");
await page.locator('[data-regler="nachbarn"]').fill("3");
await page.locator("#ausprobieren").screenshot({ path: `tests/ausgabe/pg-empfehlung-${dunkel ? "dunkel" : "hell"}.png` });
console.log("empfehlungs-labor: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
