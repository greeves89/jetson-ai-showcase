// Bedient kosten-rechner (Seite kosten-energie): Handrechnung, Eingabeprüfung, Messwert-Übernahme, Sensitivität.
//   node tests/widgets-prognose-kosten.mjs [hell]
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const dunkel = process.argv[2] !== "hell";
const t = await starte({ kamera: false, dunkel });
const { page } = t;
await oeffneSeite(page, "kosten-energie");
await page.locator("#ausprobieren").scrollIntoViewIfNeeded();
const wurzel = ".pg-kosten";
const d = () => page.evaluate((s) => ({ ...document.querySelector(s).dataset }), wurzel);
const feld = (k, v) => page.locator(`[data-feld="${k}"]`).fill(v);
const nah = (a, b, eps = 1e-3) => assert.ok(Math.abs(a - b) < eps, `${a} ungleich ${b}`);
const rechne = ({ w, h, preis, kauf, cloud, pers, jahre }) => {
  const tag = w / 1000 * h * preis, monat = tag * 365 / 12, lauf = monat + pers, ersp = cloud - lauf;
  return { tag, monat, jahr: tag * 365, ersp, amort: ersp > 0 ? kauf / ersp : Infinity, eigen: kauf + lauf * jahre * 12, cloud: cloud * jahre * 12 };
};

// Voreinstellungen: als Beispielannahmen markiert, Hinweis sichtbar
assert.match(await page.textContent(".pg-annahme"), /Alle Werte sind deine Annahmen, keine Preise oder Messwerte/);
const tags = await page.$$eval(".pg-tag", (els) => els.map((e) => e.textContent));
assert.equal(tags.length, 7); assert.ok(tags.every((x) => x === "Beispielannahme"));

// Handrechnung mit den Startwerten: 15 W, 24 h, 0,30 €, 500 €, 50 €, Betreuung 30 €
let z = await d();
let r = rechne({ w: 15, h: 24, preis: 0.3, kauf: 500, cloud: 50, pers: 30, jahre: 3 });
console.log("Start:", z, "Handrechnung:", r);
nah(+z.kwhTag, 0.36); nah(+z.kostenTag, 0.108); nah(+z.kostenJahr, 39.42, 1e-2); nah(+z.kostenMonat, r.monat);
nah(+z.amort, r.amort); nah(+z.ersparnis, r.ersp);
assert.equal((await page.textContent('[data-pg="amortisation"] b')).trim(), "29,9 Monate");
assert.match(await page.textContent('[data-pg="satz"]'), /0,36 Kilowattstunden am Tag/);

// eigene Werte
const eig = { w: 22, h: 10, preis: 0.25, kauf: 800, cloud: 120, pers: 15, jahre: 4 };
await feld("w", "22"); await feld("h", "10"); await feld("preis", "0,25"); await feld("kauf", "800"); await feld("cloud", "120"); await feld("pers", "15"); await feld("jahre", "4");
r = rechne(eig); z = await d();
console.log("Eigene Werte:", z, r);
nah(+z.kostenTag, r.tag); nah(+z.kostenMonat, r.monat); nah(+z.kostenJahr, r.jahr); nah(+z.amort, r.amort, 1e-3); nah(+z.gesamtEigen, r.eigen, 1e-2); nah(+z.gesamtCloud, r.cloud, 1e-2);
assert.equal(await page.textContent('[data-pg="amortisation"] b'), (Math.round(r.amort * 10) / 10).toFixed(1).replace(".", ",") + " Monate");
assert.equal(await page.locator('.pg-tag[data-herkunft="eigen"]').count(), 7, "Herkunft: deine Eingabe");

// Sensitivität: Zelle mit doppeltem Strompreis und gleicher Laufzeit entspricht der Rechnung; 10 Std. liegt nicht im Raster
await feld("h", "24");
r = rechne({ ...eig, h: 24, preis: 0.5 });
const zellen = await page.$$eval('[data-pg="sensitivitaet"] tbody tr', (trs) => trs.map((tr) => [...tr.querySelectorAll("td")].map((td) => td.dataset.amort)));
nah(+zellen[3][3], r.amort, 1e-3);
assert.equal(await page.locator(".pg-sens.ist-deine").count(), 1);
// höherer Strompreis: längere Amortisation
assert.ok(+zellen[3][3] > +zellen[0][3]);

// Betreuung frisst die Ersparnis: nie
await feld("pers", "200");
z = await d();
assert.equal(z.amort, "nie");
assert.equal((await page.textContent('[data-pg="amortisation"] b')).trim(), "nie");
assert.match(await page.textContent('[data-pg="satz"]'), /nicht günstiger als die Cloud/);
assert.match(await page.textContent('[data-pg="balken"]'), /Die Cloud ist um/);
await feld("pers", "30");

// Eingabeprüfung: leer, negativ, Text, zu große Laufzeit
for (const [k, v, muster] of [["w", "", /Bitte gib eine Zahl ein/], ["w", "-5", /nicht negativ/], ["w", "abc", /Bitte eine Zahl/], ["h", "30", /höchstens 24/], ["jahre", "0", /größer als 0/]]) {
  await feld(k, v);
  assert.equal(await page.getAttribute(`[data-feld="${k}"]`, "aria-invalid"), "true", k + " " + v);
  assert.match(await page.locator(`.pg-feld:has([data-feld="${k}"]) .pg-fehler`).textContent(), muster);
  assert.equal((await d()).gueltig, "0");
  assert.match(await page.textContent('[data-pg="satz"]'), /markierten Feldern/);
  await feld(k, k === "w" ? "15" : k === "h" ? "24" : "3");
  assert.equal((await d()).gueltig, "1");
}

// Messwert des Jetson: Momentwert aus KL.stats übernehmen
const echt = await page.evaluate(() => (window.KL.stats.letzte || {}).power_w);
console.log("echter Messwert der Seitenleiste:", echt);
await page.evaluate(() => { window.KL.stats.letzte = Object.assign({}, window.KL.stats.letzte, { power_w: 12.5 }); window.KL.stats._h.forEach((fn) => fn({ power_w: 12.5 })); });
assert.equal(await page.isDisabled('[data-pg="jetson"]'), false);
assert.match(await page.textContent('[data-pg="jetson-status"]'), /12,5 Watt\. Das ist ein Momentwert/);
await page.click('[data-pg="jetson"]');
assert.equal(await page.inputValue('[data-feld="w"]'), "12,5");
assert.match(await page.textContent('[data-pg="jetson-status"]'), /Momentwert aus diesem Augenblick/);
assert.equal(await page.locator('.pg-feld:has([data-feld="w"]) .pg-tag').textContent(), "Messwert, Momentwert");
r = rechne({ ...eig, w: 12.5, h: 24, preis: 0.25, pers: 0 });
nah(+(await d()).kostenTag, 12.5 / 1000 * 24 * 0.25);
// ohne Wert bleibt der Knopf aus
await page.evaluate(() => window.KL.stats._h.forEach((fn) => fn({ power_w: null })));
await feld("w", "15"); // Eingabe von Hand, Herkunft wieder eigen
await page.evaluate(() => window.KL.stats._h.forEach((fn) => fn({ power_w: null })));
assert.equal(await page.isDisabled('[data-pg="jetson"]'), true);
assert.match(await page.textContent('[data-pg="jetson-status"]'), /liegt kein Messwert vor/);

const alles = await page.textContent("#ausprobieren");
assert.doesNotMatch(alles, /[–—]/, "keine Gedankenstriche");
await feld("pers", "30");
await page.locator("#ausprobieren").screenshot({ path: `tests/ausgabe/pg-kosten-${dunkel ? "dunkel" : "hell"}.png` });
console.log("kosten-rechner: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
