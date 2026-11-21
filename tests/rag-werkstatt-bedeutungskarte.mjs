// RAG-Werkstatt, Baustein rag-bedeutungskarte: Punkte, Nachbarn, Zahlen, eigener Satz ueber den Jetson, Zuruecksetzen.
//   LABOR_URL=https://<jetson>:8443 node tests/rag-werkstatt-bedeutungskarte.mjs [hell]
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false, dunkel: process.argv[2] !== "hell" });
const { page } = t;
await oeffneSeite(page, "rag-embedding");
await page.waitForSelector(".rr-pkt", { timeout: 15000 });
assert.equal(await page.locator(".rr-pkt").count(), 25, "25 Beispielsaetze");
assert.equal(await page.locator(".rr-legende li").count(), 5, "fuenf Themen in der Legende");
assert.match(await page.textContent(".rr-live .erklaerung"), /768 Zahlen/, "Startertext nennt 768");
assert.match(await page.textContent(".rr-live .erklaerung"), /Prozent/, "Startertext nennt den Informationsverlust");

// Beispielsatz antippen (ohne Jetson): 5 Nachbarn, Linien, Kosinus
await page.locator(".rr-pkt").nth(5).click();   // "Das Auto steht auf dem Parkplatz vor dem Haus."
assert.equal(await page.locator(".rr-nb").count(), 5);
assert.equal(await page.locator(".rr-pkt.rr-nachbar").count(), 5);
assert.equal(await page.locator(".rr-linie").count(), 5);
const nb = await page.$$eval(".rr-nb-wert", (e) => e.map((x) => Number(x.textContent.replace(",", "."))));
assert.ok(nb.every((v, i) => i === 0 || nb[i - 1] >= v), "Nachbarn absteigend sortiert: " + nb);
assert.ok(nb[0] > 0.5 && nb[0] < 1, "Kosinus plausibel " + nb[0]);
await page.waitForTimeout(600);
assert.match(await page.textContent(".rr-live .erklaerung"), /Kosinus \d,\d\d/);
// Tastatur: Fokus und Enter waehlt einen anderen Punkt
await page.mouse.move(0, 0);
await page.locator(".rr-pkt").nth(0).focus(); await page.keyboard.press("Enter");
assert.equal(await page.locator(".rr-pkt.rr-gewaehlt").count(), 1);
assert.match(await page.textContent(".rr-info"), /Frühstück/);

// Zahlen zeigen
await page.locator(".rr-aktionen label.w-schalter").click();
assert.equal(await page.locator(".rr-zahlen i").count(), 48);
assert.match(await page.textContent(".rr-zahlnote"), /von 768 Zahlen/);

// eigener Satz ueber den Jetson
await page.fill(".rr-form-zeile input", "Im Kühlschrank ist noch Käse.");
await page.click('.rr-form-zeile button[type=submit]');
await page.waitForSelector(".rr-eigen", { timeout: 40000 });
assert.equal(await page.locator(".rr-eigen").count(), 1);
assert.equal(await page.locator(".rr-nb").count(), 5);
const nr = await page.$$eval(".rr-nb .rr-nb-text", (e) => e.map((x) => x.textContent));
console.log("Nachbarn von 'Im Kuehlschrank ist noch Kaese':", nr.slice(0, 3));
const essen = ["Brötchen", "Suppe", "Apfelkuchen", "Kaffee", "Nudeln"];
assert.ok(essen.some((w) => nr[0].includes(w)), "naechster Nachbar gehoert zu Essen: " + nr[0]);
await page.waitForTimeout(600);
const erkl = await page.textContent(".rr-live .erklaerung");
assert.match(erkl, /Dein Satz/);
assert.match(erkl, /Kein einziges Wort stimmt überein|Gemeinsame Wörter/);
assert.equal(await page.locator(".rr-zahlen i").count(), 48, "Zahlen folgen dem neuen Satz");
// Zuruecksetzen
await page.click('button:has-text("Karte zurücksetzen")');
assert.equal(await page.locator(".rr-eigen").count(), 0);
assert.equal(await page.locator(".rr-nb").count(), 0);
// keine Gedankenstriche, keine Emojis im sichtbaren Text
const txt = await page.innerText("#inhalt");
assert.ok(!/[–—]/.test(txt.replace(/(^|\n)[ \t]*[–—][ \t]*(?=\n|$)/g, "$1")), "keine Gedankenstriche");
console.log("Fehler:", t.fehler.length ? t.fehler : "keine");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
