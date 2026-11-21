// Bedient die Landkarte: jeder Bereich waehlbar, Detail wechselt, Tastatur, Link.
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false });
const { page } = t;
await oeffneSeite(page, "karte");
const titel = () => page.textContent(".lk .detail h3");
assert.equal(await titel(), "Künstliche Intelligenz");
assert.equal(await page.getAttribute('.lk [data-k="ki"]', "aria-pressed"), "true");
const erwartet = { regel: "Regelbasierte Systeme", ml: "Maschinelles Lernen", dl: "Deep Learning", gen: "Generative KI", robotik: "Robotik" };
for (const [k, name] of Object.entries(erwartet)) {
  await page.click(`.lk [data-k="${k}"] > span.n`);
  assert.equal(await titel(), name, k);
  assert.equal(await page.getAttribute(`.lk [data-k="${k}"]`, "aria-pressed"), "true");
  assert.equal(await page.$$eval(".lk [aria-pressed=true]", (e) => e.length), 1, "genau ein Bereich gewaehlt");
}
// verschachtelter Klick waehlt nur den innersten
await page.click('.lk [data-k="gen"] > span.n');
assert.equal(await titel(), "Generative KI");
// Link zur Seite
assert.equal(await page.getAttribute(".lk .detail a.btn", "href"), "#/genki");
// Tastatur
await page.focus('.lk [data-k="ml"]');
await page.keyboard.press("Enter");
assert.equal(await titel(), "Maschinelles Lernen");
await page.focus('.lk [data-k="robotik"]');
await page.keyboard.press("Space");
assert.equal(await titel(), "Robotik");
assert.equal(await page.getAttribute(".lk .detail a.btn", "href"), "#/robotik");
// Klick auf den Link wechselt die Seite
await page.click(".lk .detail a.btn");
await page.waitForFunction(() => location.pathname === "/robotik");
t.fehler = t.fehler.filter((f) => !f.includes("ERR_ABORTED"));
console.log("landkarte: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
