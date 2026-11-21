// RAG-Werkstatt, Baustein rag-test-labor: Trefferquote und Kehrwert des Rangs aendern sich mit Methode und k; Zeilendetail; eigene Frage.
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false, dunkel: process.argv[2] !== "hell" });
const { page } = t;
await oeffneSeite(page, "rag-bewertung");
await page.waitForSelector(".rr-testtabelle tbody tr", { timeout: 15000 });
assert.equal(await page.locator(".rr-testtabelle tbody tr").count(), 12, "10 Fragen mit Antwort, 2 ohne");
assert.equal(await page.locator(".rr-zeile-test.ok, .rr-zeile-test.schlecht").count(), 10);
assert.equal(await page.locator(".rr-ohne-zeile").count(), 2);
const quote = async () => Number((await page.textContent(".rr-kennzahlen .messwert b")).match(/^(\d+) von/)[1]);
const mrr = async () => Number((await page.locator(".rr-kennzahlen .messwert b").nth(1).textContent()).replace(",", "."));
const methode = (n) => page.click(`.rr-chips button:has-text("${n}")`);
const k = (v) => page.locator(".rr input[type=range]").fill(String(v));
// Methode x k: Matrix aus der Seite lesen und mit den angezeigten Kacheln vergleichen
const matrix = async () => page.$$eval(".rr-matrixtab tbody tr", (r) => Object.fromEntries(r.map((x) => [x.querySelector("th").textContent, [...x.querySelectorAll("td")].map((c) => Number(c.textContent.match(/^(\d+)/)[1]))])));
const M = await matrix();
console.log("Treffer bei k=1,3,5,10:", JSON.stringify(M));
for (const [i, kk] of [1, 3, 5, 10].entries()) for (const m of ["Stichwort", "Vektor", "Hybrid"]) {
  await methode(m); await k(kk);
  assert.equal(await quote(), M[m][i], `Kachel = Matrix fuer ${m} bei k=${kk}`);
}
for (const m of Object.keys(M)) assert.ok(M[m].every((v, i) => i === 0 || M[m][i - 1] <= v), m + " steigt mit k");
assert.equal(M.Hybrid[0] >= Math.max(M.Stichwort[0], M.Vektor[0]) - 1, true, "Hybrid bei k=1 mindestens fast so gut wie die besten");
assert.ok(new Set([M.Stichwort[0], M.Vektor[0], M.Hybrid[0]]).size >= 2, "Methoden unterscheiden sich bei k=1");
assert.ok(M.Vektor[3] > M.Vektor[0], "Vektor: k=10 deutlich besser als k=1");
// Kehrwert des Rangs
await methode("Vektor"); await k(1); const m1 = await mrr(); await k(10); const m10 = await mrr();
assert.ok(m10 > m1, `Kehrwert wachst mit k: ${m1} -> ${m10}`);
// Zeilendetail: Stichwort, eine Frage ohne gemeinsame Woerter
await methode("Stichwort"); await k(5);
await page.click('.rr-zeilenknopf:has-text("Wo darf ich mit dem Wagen parken?")');
assert.match(await page.textContent(".rr-detailgrund"), /keine gemeinsamen Wörter/);
assert.equal(await page.locator(".rr-testdetail .rr-nb").count(), 0, "Stichwort ohne Treffer");
await methode("Vektor");
assert.match(await page.textContent(".rr-detailgrund"), /Platz 1, also unter den ersten 5/);
// Fragen ohne Antwort: Vektor liefert trotzdem etwas
const ohne = await page.textContent(".rr-ohne-zeile");
assert.match(ohne, /liefert trotzdem Platz 1/);
await methode("Stichwort"); assert.match(await page.textContent(".rr-ohne-zeile"), /findet nichts|liefert trotzdem/);
// eigene Frage
await methode("Vektor"); await k(1);
const vorher = await quote();
await page.fill(".rr-eigenfrage input", "Wann kommt die Kantine mit Salat?");
await page.selectOption(".rr-eigenfrage select", "8");
await page.click('button:has-text("Frage hinzufügen")');
await page.waitForFunction(() => document.querySelectorAll(".rr-testtabelle tbody tr").length === 13, null, { timeout: 40000 });
assert.match(await page.textContent(".rr-kennzahlen .messwert b"), /von 11/);
console.log("Quote vorher/nachher eigener Frage (k=1):", vorher, await quote());
assert.ok(await page.locator(".rr-tag:has-text('eigene')").count() === 1);
const txt = await page.innerText("#inhalt");
assert.ok(!/[–—]/.test(txt.replace(/(^|\n)[ \t]*[–—][ \t]*(?=\n|$)/g, "$1")), "keine Gedankenstriche");
console.log("Fehler:", t.fehler.length ? t.fehler : "keine");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
