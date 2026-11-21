// RAG-Werkstatt, Baustein rag-rerank-labor: Nachsortieren live auf dem Jetson, Rangwechsel, Zeit, Wiederholung, Rueckfall auf Vorab-Werte.
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false, dunkel: process.argv[2] !== "hell" });
const { page } = t;
await oeffneSeite(page, "rag-reranking");
await page.waitForSelector(".rr-rrzeile", { timeout: 15000 });
assert.equal(await page.locator(".rr-rrzeile").count(), 10);
const zielPlatz = () => page.locator(".rr-rrzeile").evaluateAll((e) => e.findIndex((x) => x.classList.contains("ziel")) + 1);
const vorher = await zielPlatz();
assert.ok(vorher >= 1, "richtige Stelle unter den Kandidaten");
await page.selectOption(".rr-select", "lieferung");
const r0 = await zielPlatz();
// live bewerten
await page.click('button:has-text("Nachsortieren")');
await page.waitForSelector(".rr-summe:not(:empty)", { timeout: 120000 });
const scores = await page.$$eval(".rr-score-zahl", (e) => e.map((x) => Number(x.textContent.replace(",", "."))));
assert.equal(scores.length, 10); assert.ok(scores.every((s, i) => i === 0 || scores[i - 1] >= s), "nach Wert sortiert: " + scores);
assert.ok(scores.some((s) => s > 0), "nicht alles null");
const summe = await page.textContent(".rr-summe");
console.log("Summe:", summe);
assert.match(summe, /Gesamtzeit .* für 10 Kandidaten, im Mittel .* je Kandidat/);
const r1 = await zielPlatz();
console.log(`richtige Stelle: Platz ${r0} vorher, Platz ${r1} nachher`);
assert.ok(r1 <= r0, "Nachsortieren verschlechtert die richtige Stelle nicht (lieferung)");
assert.ok(await page.locator(".rr-rrzeile .rr-tag").count() >= 1, "Rangwechsel als Etikett");
await page.waitForTimeout(600);
assert.match(await page.textContent(".rr-live .erklaerung"), /Durchgänge/);
assert.match(await page.textContent(".rr-live .erklaerung"), /Platz \d+ auf Platz \d+|bleibt auf Platz/);
assert.match(await page.textContent(".rr-hinweis, .w-hinweis:last-of-type"), /Sprachmodell/);
// noch einmal bewerten
assert.ok(!(await page.isDisabled('button:has-text("Noch einmal bewerten")')));
await page.click('button:has-text("Noch einmal bewerten")');
await page.waitForFunction(() => !document.querySelector('.rr-aktionen .btn.primary').disabled, null, { timeout: 120000 });
await page.waitForTimeout(700);
assert.match(await page.textContent(".rr-live .erklaerung"), /Alle Werte sind gleich geblieben|Werten.* geändert/);
// Regler Kandidaten
await page.locator(".rr input[type=range]").first().fill("4");
assert.equal(await page.locator(".rr-rrzeile").count(), 4);
assert.equal(await page.locator(".rr-summe").textContent(), "");
// Rueckfall: Jetson nicht erreichbar -> vorab gemessene Werte
await page.route("**/api/rerank", (r) => r.abort());
await page.selectOption(".rr-select", "code");
await page.locator(".rr input[type=range]").first().fill("6");
await page.click('button:has-text("Nachsortieren")');
await page.waitForSelector(".rr-summe:not(:empty)", { timeout: 30000 });
assert.match(await page.textContent(".rr-status"), /vorab gemessenen/);
assert.match(await page.textContent(".ladetxt"), /vorab gemessenen Werten/);
assert.equal(await page.locator(".rr-score-zahl").count(), 6);
const txt = await page.innerText("#inhalt");
assert.ok(!/[–—]/.test(txt.replace(/(^|\n)[ \t]*[–—][ \t]*(?=\n|$)/g, "$1")), "keine Gedankenstriche");
// requestfailed durch absichtliches Abbrechen ist erwartet
const fehler = t.fehler.filter((f) => !/api\/rerank|ERR_FAILED/.test(f));
console.log("Fehler:", fehler.length ? fehler : "keine");
await t.schliessen();
process.exit(fehler.length ? 1 : 0);
