// Konfusionsmatrix: Schwelle, Szenarien, Genauigkeitsfalle. Alle Zahlen kommen aus der Berechnung.
//   LABOR_URL=https://192.168.178.83:8443 node tests/widgets-grundlagen-konfusion.mjs [hell]
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false, dunkel: process.argv[2] !== "hell" });
const { page } = t;
await oeffneSeite(page, "bewertung");
const W = ".gl-konf";
await page.locator(W).scrollIntoViewIfNeeded();
const zahlZelle = async (i) => Number((await page.locator(`${W} .gl-matrix td b`).nth(i).textContent()).replace(/\./g, "")); // tp, fn, fp, tn
const matrix = async () => ({ tp: await zahlZelle(0), fn: await zahlZelle(1), fp: await zahlZelle(2), tn: await zahlZelle(3) });
const mass = async (i) => { const s = await page.locator(`${W} .gl-masskopf b`).nth(i).textContent(); return s.includes("keine") ? null : parseFloat(s.replace(",", ".")); }; // Genauigkeit, Precision, Recall
const schwelle = async (v) => { await page.locator(`${W} input[type=range]`).nth(0).fill(String(v)); await page.waitForTimeout(150); };
const satz = async () => { await page.waitForTimeout(700); return page.textContent(`${W} .erklaerung`); };
const wahl = async (n) => { await page.click(`${W} .gl-wahl button:has-text("${n}")`); await page.waitForTimeout(150); };

// Alles wird gerechnet: Summe ist 1000, Kennzahlen stimmen mit der Matrix
let m = await matrix();
assert.equal(m.tp + m.fn + m.fp + m.tn, 1000);
assert.equal(m.tp + m.fn, 300, "30 Prozent echte Faelle bei Spam");
const rechne = (m) => ({ genau: 100 * (m.tp + m.tn) / 1000, prec: 100 * m.tp / (m.tp + m.fp), rec: 100 * m.tp / (m.tp + m.fn) });
let r = rechne(m);
assert.ok(Math.abs(r.genau - await mass(0)) < 0.06 && Math.abs(r.prec - await mass(1)) < 0.06 && Math.abs(r.rec - await mass(2)) < 0.06, "Kennzahlen = Rechnung aus der Matrix");

// Schwelle senken: Recall steigt, Precision faellt; heben: umgekehrt
await schwelle(0.7); const hoch = { m: await matrix(), p: await mass(1), r: await mass(2) };
await schwelle(0.3); const tief = { m: await matrix(), p: await mass(1), r: await mass(2) };
console.log("Schwelle 0,7:", hoch, " Schwelle 0,3:", tief);
assert.ok(tief.r > hoch.r + 10, "Recall steigt beim Senken");
assert.ok(tief.p < hoch.p - 10, "Precision faellt beim Senken");
assert.ok(tief.m.fp > hoch.m.fp && tief.m.fn < hoch.m.fn, "mehr Fehlalarme, weniger Uebersehenes");
let s = await satz(); console.log("Satz:", s);
assert.match(s, /von 300 Spam-Mails landen im Posteingang/);
assert.match(s, /guten Mails verschwinden im Spamordner/);
assert.match(s, /Rechnung oder Bewerbung/);

// Extreme: Schwelle 0 = alles Alarm, Schwelle 1 = nie Alarm
await schwelle(0); m = await matrix(); assert.equal(m.fn, 0); assert.equal(m.tn, 0);
assert.match(await satz(), /jeder der 300 echten Fälle wird gefunden/);

// Seltenes Ereignis: Schimmelpruefung, "Immer unauffaellig sagen" = hohe Genauigkeit, null Recall
await wahl("Schimmelprüfung");
assert.equal((await matrix()).tp + (await matrix()).fn, 40, "4 Prozent befallen");
await page.click(`${W} button:has-text("Immer unauffällig sagen")`);
m = await matrix(); assert.equal(m.tp, 0); assert.equal(m.fp, 0);
assert.equal(await mass(2), 0); assert.equal(await mass(1), null, "Precision ohne Alarm: keine Angabe");
assert.ok(await mass(0) >= 95, "Genauigkeit taeuscht: " + await mass(0));
s = await satz(); console.log("Falle:", s);
assert.match(s, /täuscht/); assert.match(s, /gehen 40 von 40 befallenen Teilen durch|40 von 40 befallenen Teilen gehen durch/);
// Die Verteilung selbst ist deterministisch: Wiederholung gibt dieselbe Matrix
await schwelle(0.5); const a = await matrix(); await wahl("Spamfilter"); await wahl("Schimmelprüfung"); await schwelle(0.5); const b = await matrix();
assert.deepEqual(a, b, "fester Startwert");
console.log("Schimmel Schwelle 0,5:", a);
// Anteil echter Faelle veraendert die Verteilung
await page.locator(`${W} input[type=range]`).nth(1).fill("20"); await page.waitForTimeout(150);
m = await matrix(); assert.equal(m.tp + m.fn, 200);
// Rauchmelder und Sicherheitskontrolle haben eigene Folgen
await wahl("Rauchmelder"); await schwelle(0.9); s = await satz(); console.log("Rauch:", s);
assert.match(s, /Bränden bleiben unbemerkt/); assert.match(s, /gefährlichste/);
await wahl("Sicherheitskontrolle"); s = await satz(); assert.match(s, /verbotenen Gegenständen/);
// Zeichnen auf dem Verlauf setzt die Schwelle
const cv = page.locator(`${W} canvas`); const bx = await cv.boundingBox();
await page.mouse.click(bx.x + bx.width * 0.5, bx.y + bx.height * 0.5);
const out = await page.textContent(`${W} .regler >> nth=0 >> output`); console.log("Klick auf die Mitte:", out);
assert.ok(parseFloat(out.replace(",", ".")) > 0.4 && parseFloat(out.replace(",", ".")) < 0.6);
// Schalter Skalierung, Zuruecksetzen
await page.click(`${W} .gl-schalter`);
await page.click(`${W} button:has-text("Zurücksetzen")`);
assert.equal(await page.getAttribute(`${W} .gl-wahl button:has-text("Spamfilter")`, "aria-pressed"), "true");
assert.equal(await page.textContent(`${W} .regler >> nth=0 >> output`), "0,50");
// Tastatur
await page.locator(`${W} input[type=range]`).nth(0).focus(); await page.keyboard.press("ArrowRight");
assert.equal(await page.textContent(`${W} .regler >> nth=0 >> output`), "0,51");
await page.goto(page.url().replace("bewertung", "daten")); await page.waitForTimeout(600);
console.log(t.fehler.length ? "FEHLER:\n" + t.fehler.join("\n") : "keine Konsolenfehler");
assert.equal(t.fehler.length, 0);
await t.schliessen();
console.log("konfusion: ok");
