// Bedient baum-spiel (Seite tabellen-ml): beste Frage, Reinheit, Tiefe, Überanpassung, Tastatur.
//   node tests/widgets-prognose-baum.mjs [hell]
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const dunkel = process.argv[2] !== "hell";
const t = await starte({ kamera: false, dunkel });
const { page } = t;
await oeffneSeite(page, "tabellen-ml");
const wurzel = ".pg-baum";
await page.locator("#ausprobieren").scrollIntoViewIfNeeded();
const d = () => page.evaluate((s) => ({ ...document.querySelector(s).dataset }), wurzel);

// Ausgangslage: keine Frage, Mehrheit rät
let z = await d();
assert.equal(z.train, "12", "Training ohne Frage: 12 von 20 (Mehrheit)");
assert.equal(z.test, "5");
assert.equal(z.blaetter, "1");
assert.ok(Math.abs(Number(z.giniStart) - 0.48) < 1e-6, "Gini der Wurzel 0,48");

// Beste Frage vorschlagen: Zahlungsrückstände mit den Zahlen im Text
await page.click('[data-pg="vorschlag"]');
const best = page.locator(".pg-frage.ist-vorschlag");
assert.equal(await best.count(), 1);
assert.equal(await best.getAttribute("data-id"), "rueck", "Rückstände ist die beste erste Frage");
const text = await page.textContent('[data-pg="vorschlagtext"]');
console.log("Vorschlag:", text);
assert.match(text, /Gini bei 0,48/);
assert.match(text, /Ja-Gruppe \(7 Zeilen\)/);
assert.match(text, /Nein-Gruppe \(13 Zeilen\)/);
// kein anderer Kandidat ist besser
const ginis = await page.$$eval(".pg-frage[data-ok='1']", (els) => els.map((e) => Number(e.dataset.gini)));
assert.equal(Math.min(...ginis), Number(await best.getAttribute("data-gini")));

// Frage stellen: Unreinheit der Blätter sinkt
await page.click('[data-pg="uebernehmen"]');
z = await d();
console.log("nach Frage:", z);
assert.equal(z.blaetter, "2");
assert.ok(Number(z.giniBlaetter) < Number(z.giniStart) - 0.15, "Reinheit steigt: Gini sinkt von 0,48 auf " + z.giniBlaetter);
assert.equal(z.train, "17");
assert.equal(z.test, "7", "flacher Baum: 7 von 8 Prüfzeilen");

// Knoten per Tastatur wählen: Nein-Knoten, Fragen zeigen Zahlen für diese Gruppe
const knoten = page.locator('.pg-kn[data-tiefe="1"]').nth(1);
await knoten.focus();
await page.keyboard.press("Enter");
assert.equal(await page.locator('.pg-kn[aria-pressed="true"]').getAttribute("data-tiefe"), "1");
assert.match(await page.textContent(".pg-pfad"), /Zahlungsrückstände: nein/);
assert.match(await page.textContent(".pg-pfad"), /13 Zeilen/);

// automatisch bis Tiefe 3: Training 100 Prozent, Prüfzeilen schwächer, Satz nennt Überanpassung
await page.click('[data-pg="auto"]');
z = await d();
console.log("tiefer Baum:", z);
assert.equal(z.train, "20");
assert.ok(Number(z.test) < 8 && Number(z.test) < Number(z.train) / 20 * 8, "Prüfgenauigkeit unter Training");
assert.match(await page.textContent('[data-pg="satz"]'), /Überanpassung/);
assert.ok(Number(z.giniBlaetter) < 0.01, "alle Blätter rein");

// Tiefe 1 begrenzt den Baum: wieder 17 / 7, Überanpassung weg
await page.locator('[data-regler="tiefe"]').fill("1");
z = await d();
assert.equal(z.train, "17"); assert.equal(z.test, "7"); assert.equal(z.blaetter, "2");
assert.doesNotMatch(await page.textContent('[data-pg="satz"]'), /Überanpassung/);
await page.locator('[data-regler="tiefe"]').fill("6");
z = await d(); assert.equal(z.train, "20");

// Mindestzahl je Blatt sperrt Fragen mit kleinen Gruppen
await page.click('[data-pg="neu"]');
await page.locator('[data-regler="blatt"]').fill("5");
const gesperrt = await page.locator('.pg-frage[data-ok="0"]').count();
assert.ok(gesperrt >= 3, "gesperrte Fragen bei Mindestzahl 5: " + gesperrt);
await page.locator('[data-regler="blatt"]').fill("1");

// Zurücksetzen
await page.click('[data-pg="neu"]');
z = await d(); assert.equal(z.blaetter, "1"); assert.equal(z.train, "12");

// Texte: keine Gedankenstriche, Umlaute vorhanden
const alles = await page.textContent("#ausprobieren");
assert.doesNotMatch(alles, /[–—]/, "keine Gedankenstriche");
assert.doesNotMatch(alles, /\b(ae|oe|ue)\b|Rueck|Zahlungsrueck/i);

// Bildschirmfoto mit gebautem Baum
await page.click('[data-pg="vorschlag"]'); await page.click('[data-pg="uebernehmen"]');
await page.click('[data-pg="auto"]');
await page.locator("#ausprobieren").screenshot({ path: `tests/ausgabe/pg-baum-${dunkel ? "dunkel" : "hell"}.png` });
console.log("baum-spiel: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
