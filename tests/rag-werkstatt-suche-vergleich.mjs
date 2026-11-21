// RAG-Werkstatt, Baustein rag-suche-vergleich: Stichwort gewinnt bei Code, Vektor bei Umschreibung, Hybrid faengt beide,
// Regler, Filter, freie Frage ueber den Jetson. Prueft ausserdem die Rechenwege im Browser gegen die Python-Raenge.
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false, dunkel: process.argv[2] !== "hell" });
const { page } = t;
await oeffneSeite(page, "rag-suche");
await page.waitForSelector(".rr-spalte .rr-karte", { timeout: 15000 });
const spalte = (n) => page.locator(".rr-spalte").nth(n);   // 0 Stichwort, 1 Vektor, 2 Hybrid
const rangZiel = async (n) => {   // Platz der richtigen Stelle in der Spalte oder null
  const r = await spalte(n).locator(".rr-karte").evaluateAll((e) => e.findIndex((x) => x.classList.contains("ziel")));
  return r < 0 ? null : r + 1;
};
const frage = (text) => page.click(`.rr-beispiele button:has-text("${text}")`);

// 1. Umschreibung: Vektor gewinnt, Stichwort hat keinen Treffer
await frage("Wo darf ich mit dem Wagen parken?");
assert.equal(await spalte(0).locator(".rr-karte").count(), 0, "Stichwort ohne Treffer");
assert.match(await spalte(0).textContent(), /Kein Treffer/);
assert.match(await spalte(0).textContent(), /keinen Rang/);
assert.equal(await rangZiel(1), 1, "Vektor findet das Parken"); assert.equal(await rangZiel(2), 1, "Hybrid auch");
assert.equal(await spalte(1).locator(".rr-karte").count(), 5);
await page.waitForTimeout(600);
const e1 = await page.textContent(".rr-live .erklaerung");
assert.match(e1, /Hier trägt der Vektor die Suche/);
// 2. Fehlercode: Stichwort gewinnt, Vektor verliert (Nachbarcode vorn)
await frage("Was bedeutet E-4711?");
assert.equal(await rangZiel(0), 1, "Stichwort findet E-4711");
assert.notEqual(await rangZiel(1), 1, "Vektor hat nicht Platz 1");
assert.equal(await rangZiel(2), 1, "Hybrid rettet");
assert.ok(await spalte(0).locator("mark.rr-mark").count() >= 1, "gepasste Woerter markiert");
assert.ok((await spalte(0).locator(".rr-pille").allTextContents()).some((x) => /e-4711 · 1× · Seltenheit/.test(x)), "Pille mit e-4711");
await page.waitForTimeout(600);
assert.match(await page.textContent(".rr-live .erklaerung"), /Hier rettet das Stichwort die Suche/);
// Rechnung sichtbar
const rech = await spalte(2).locator(".rr-rechnung").first().textContent();
assert.match(rech, /Stichwort Platz 1: 0,0164/); assert.match(rech, /= 0,0\d\d\d/);
// 3. Regler k und Gewicht
await page.locator(".rr input[type=range]").nth(1).fill("3");
assert.equal(await spalte(1).locator(".rr-karte").count(), 3);
await page.locator(".rr input[type=range]").nth(1).fill("10");
assert.equal(await spalte(1).locator(".rr-karte").count(), 10);
await page.locator(".rr input[type=range]").nth(0).fill("0");   // Gewicht ganz beim Stichwort
const h0 = await spalte(2).locator(".rr-karte").first().getAttribute("data-idx");
const s0 = await spalte(0).locator(".rr-karte").first().getAttribute("data-idx");
assert.equal(h0, s0, "Gewicht 0: Hybrid folgt dem Stichwort");
await page.locator(".rr input[type=range]").nth(0).fill("100");
assert.equal(await spalte(2).locator(".rr-karte").first().getAttribute("data-idx"), await spalte(1).locator(".rr-karte").first().getAttribute("data-idx"), "Gewicht 100: Hybrid folgt dem Vektor");
await page.locator(".rr input[type=range]").nth(0).fill("50");
// 4. Filter
await page.click('.rr-filterzeile button:has-text("Personal")');
const gr = await spalte(1).locator(".rr-grp").allTextContents();
assert.ok(gr.length > 0 && gr.every((g) => g === "Personal"), "nur Personal: " + gr);
await page.click('.rr-filterzeile button:has-text("Alle Gruppen")');
// 5. Eigene Frage ueber den Jetson: kein Haken
await page.locator(".rr input[type=range]").nth(1).fill("5");
await page.fill(".rr-form-zeile input", "Wo kann ich mein Fahrzeug lassen?");
await page.click('.rr-form-zeile button[type=submit]');
await page.waitForFunction(() => /ist eingebettet/.test(document.querySelector(".rr-status").textContent), null, { timeout: 40000 });
assert.equal(await page.locator(".rr-karte.ziel").count(), 0, "freie Frage ohne Haken");
assert.equal(await spalte(1).locator(".rr-karte").count(), 5);
await page.waitForTimeout(700);
assert.match(await page.textContent(".rr-live .erklaerung"), /stehen \d in beiden Listen/);
// 6. Rechenwege gegen Python: Raenge fuer alle Fragen identisch
const diff = await page.evaluate(async () => {
  const K = await window.KL.rag.laden(); const R = window.KL.rag; const fehler = [];
  for (const f of K.fragen) {
    const S = R.suche(K, f.frage, f.vektor, { gewicht: 0.5 });
    const rs = S.zeilen.map((z) => z.rangS), rv = S.zeilen.map((z) => z.rangV), rh = S.zeilen.map((z) => z.rangH);
    if (JSON.stringify(rs) !== JSON.stringify(f.erwartet.rs)) fehler.push(f.id + " Stichwort");
    if (JSON.stringify(rv) !== JSON.stringify(f.erwartet.rv)) fehler.push(f.id + " Vektor");
    if (JSON.stringify(rh) !== JSON.stringify(f.erwartet.rh)) fehler.push(f.id + " Hybrid");
  }
  return fehler;
});
assert.deepEqual(diff, [], "Browser und Python rechnen gleich");
const txt = await page.innerText("#inhalt");
assert.ok(!/[–—]/.test(txt.replace(/(^|\n)[ \t]*[–—][ \t]*(?=\n|$)/g, "$1")), "keine Gedankenstriche");
console.log("Fehler:", t.fehler.length ? t.fehler : "keine");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
