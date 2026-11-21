// Gradientenabstieg: Lernrate, Divergenz, lokales gegen globales Minimum, Startpunkt per Klick.
//   LABOR_URL=https://192.168.178.83:8443 node tests/widgets-grundlagen-gradient.mjs [hell]
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false, dunkel: process.argv[2] !== "hell" });
const { page } = t;
await oeffneSeite(page, "training");
const W = ".gl-grad";
await page.locator(W).scrollIntoViewIfNeeded();
const rg = (i) => page.locator(`${W} input[type=range]`).nth(i); // 0 Lernrate, 1 Impuls, 2 Tempo
const chip = async (name) => { const s = await page.locator(`${W} .gl-stand`).filter({ hasText: name }).first().textContent(); return s.replace(name, "").trim(); };
const zahl = async (name) => parseFloat((await chip(name)).replace(/\./g, "").replace(",", "."));
const satz = async () => { await page.waitForTimeout(800); return page.textContent(`${W} .erklaerung`); };
const schritte = (n) => page.evaluate((n) => { const b = Array.from(document.querySelectorAll(".gl-grad .btn")).find((x) => /Ein Schritt/.test(x.textContent)); for (let i = 0; i < n; i++) b.click(); }, n);
const waehle = (name) => page.click(`${W} .gl-wahl button:has-text("${name}")`);
const lernrate = async (v) => { await rg(0).fill(String(v)); };
const reset = () => page.click(`${W} button:has-text("Zurücksetzen")`);
const cv = page.locator(`${W} canvas`).first();
const klick = async (fx, fy) => { const b = await cv.boundingBox(); await page.mouse.click(b.x + b.width * fx, b.y + b.height * fy); };

// Eine Mulde, passende Lernrate (0,2): rollt gleichmaessig ins Tal
await lernrate(63);
console.log("Lernrate", await chip("Lernrate"));
const v0 = await zahl("Verlust");
await schritte(40);
let s = await satz();
console.log("passend:", s, "Verlust", await chip("Verlust"));
assert.ok(await zahl("Verlust") < 0.01 && v0 > 5);
assert.match(s, /Angekommen im tiefsten Tal/);

// zu klein: kriecht
await reset(); await lernrate(0); console.log("Lernrate", await chip("Lernrate"));
await schritte(40);
s = await satz(); console.log("zu klein:", s, "Verlust", await chip("Verlust"));
assert.ok(await zahl("Verlust") > 1, "nach 40 Schritten noch weit weg");
assert.match(s, /kriecht/);

// zu gross: springt und divergiert
await reset(); await lernrate(100); console.log("Lernrate", await chip("Lernrate"));
await schritte(10);
const wachs = await zahl("Verlust");
s = await satz(); console.log("zu gross:", s, "Verlust", await chip("Verlust"));
assert.ok(wachs > v0 * 2, "Verlust waechst: " + wachs + " gegen " + v0);
assert.match(s, /zu groß|viel zu groß/);
await schritte(80);
s = await satz(); console.log("divergiert:", s, "Verlust", await chip("Verlust"));
assert.match(s, /divergiert/);
assert.match(await page.textContent(`${W} .btn.primary`), /Start/);

// springt, kommt aber an (Lernrate knapp unter der Grenze von 1)
await reset(); await lernrate(93); console.log("Lernrate", await chip("Lernrate"));
await schritte(12);
s = await satz(); console.log("knapp:", s, "Verlust", await chip("Verlust"));
assert.match(s, /springt|zu groß/);

// Zwei Mulden: rechts starten landet im lokalen Minimum, links im tiefsten Punkt
await reset(); await waehle("Zwei Mulden");
const b = await cv.boundingBox();
const xFuerW = (w) => (14 + (w + 3.6) / 7.2 * (b.width - 28)) / b.width; // Abbildung des Bausteins
await klick(xFuerW(2.6), 0.3);
await schritte(400);
s = await satz(); console.log("rechts:", s, "Verlust", await chip("Verlust"));
assert.match(s, /lokalen Minimum/);
const lokal = await zahl("Verlust");
assert.ok(lokal > 0.5, "lokales Minimum hat hoeheren Verlust: " + lokal);
await klick(xFuerW(-3), 0.3);
await schritte(400);
s = await satz(); console.log("links:", s, "Verlust", await chip("Verlust"));
assert.match(s, /tiefsten Tal/);
assert.ok(await zahl("Verlust") < 0.05);
// Tastatur setzt den Startpunkt, Pfeil nach rechts
await cv.focus(); await page.keyboard.press("ArrowRight");
assert.equal(await zahl("Schritt"), 0, "Startpunkt verschieben setzt zurueck");

// Schlucht: quer schnell, laengs langsam; Impuls hilft
await waehle("Steile Schlucht");
console.log("Lernrate", await chip("Lernrate"));
await schritte(60);
const ohneImpuls = await zahl("Verlust");
s = await satz(); console.log("Schlucht:", s, "Verlust", ohneImpuls);
assert.match(s, /längs|kriecht|springt/);
await reset(); await waehle("Steile Schlucht");
await rg(1).fill("90"); console.log("Impuls", await page.textContent(`${W} .regler >> nth=1 >> output`));
await schritte(60);
const mitImpuls = await zahl("Verlust"); console.log("mit Impuls Verlust", mitImpuls);
assert.ok(mitImpuls < ohneImpuls, "Impuls beschleunigt in der Schlucht: " + mitImpuls + " < " + ohneImpuls);

// Mehrere Taeler: laeuft an und kommt an einem Minimum an
await reset(); await waehle("Mehrere Täler");
await schritte(1500);
s = await satz(); console.log("Taeler:", s);
assert.match(s, /Angekommen/);

// Start laeuft von selbst (Zeitgeber), Pause, Wechsel der Seite raeumt auf
await reset(); await lernrate(30); await rg(2).fill("2");
await page.click(`${W} .btn.primary`);
await page.waitForTimeout(1200);
assert.ok(await zahl("Schritt") > 5, "Animation laeuft");
await page.click(`${W} .btn.primary`);
const stand = await zahl("Schritt"); await page.waitForTimeout(500);
assert.equal(await zahl("Schritt"), stand, "Pause haelt an");
await page.click(`${W} .btn.primary`);
await page.goto(page.url().replace("training", "daten")); await page.waitForTimeout(800);
console.log(t.fehler.length ? "FEHLER:\n" + t.fehler.join("\n") : "keine Konsolenfehler");
assert.equal(t.fehler.length, 0);
await t.schliessen();
console.log("gradient: ok");
