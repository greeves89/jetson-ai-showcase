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
const tags = await page.$$eval(wurzel + " .pg-tag", (els) => els.map((e) => e.textContent));
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

// ---- kosten-kamera: Kameraprojekt gegen Handprüfung (Widget wird in die Seite eingehängt, die Seite bindet es über die Widget-ID kosten-kamera ein)
await page.evaluate(() => { const w = document.createElement("div"); w.id = "kk-test"; w.className = "flaeche pad"; document.querySelector("#inhalt").append(w); window.KL.widgets["kosten-kamera"](w, { id: "kosten-energie" }); });
const kk = "#kk-test";
const dk = () => page.evaluate((sel) => ({ ...document.querySelector(sel).dataset }), kk);
const fk = (k, v) => page.locator(`${kk} [data-feld="${k}"]`).fill(v);
const rk = ({ einrichtung, geraete, pflege, stueck, sekunden, lohn, quote, anteil, tage }) => {
  const hand = stueck * sekunden / 3600 * tage * lohn, rest = hand * (1 - anteil / 100), nach = stueck * tage * quote / 100 * sekunden / 3600 * lohn;
  const kamera = pflege + rest + nach, einmalig = einrichtung + geraete, ersp = hand - kamera;
  return { hand, rest, nach, kamera, einmalig, ersp, amort: ersp > 0 ? einmalig / ersp : Infinity };
};
assert.match(await page.textContent(`${kk} .pg-annahme`), /Beispielwerte, keine Preise/);
assert.match(await page.textContent(`${kk} .pg-annahme`), /Fehlerquote der Kamera ist nicht enthalten/);
assert.match(await page.textContent(`${kk} .pg-annahme`), /kosten meist mehr als die Handprüfung/);
const ktags = await page.$$eval(`${kk} .pg-tag`, (els) => els.map((e) => e.textContent));
assert.equal(ktags.length, 9); assert.ok(ktags.every((x) => x === "Beispielwert"));
// Startwerte von Hand gerechnet: 400 Stück, 20 s, 22 Tage, 25 €/h
let ks = { einrichtung: 2400, geraete: 2300, pflege: 245, stueck: 400, sekunden: 20, lohn: 25, quote: 3, anteil: 50, tage: 22 };
let kr = rk(ks), kz = await dk();
nah(+kz.hand, 400 * 20 / 3600 * 22 * 25); nah(+kz.hand, 1222.2222, 1e-3);
nah(+kz.rest, kr.rest); nah(+kz.nachpruefung, kr.nach); nah(+kz.kamera, kr.kamera); nah(+kz.einmalig, 4700); nah(+kz.ersparnis, kr.ersp); nah(+kz.amort, kr.amort, 1e-4);
assert.equal((await page.textContent(`${kk} [data-pg="amortisation"] b`)).trim(), (Math.round(kr.amort * 10) / 10).toFixed(1).replace(".", ",") + " Monate");
const formel = await page.textContent(`${kk} [data-pg="rechnung"]`);
assert.match(formel, /Stück × Sekunden ÷ 3600 × Betriebstage × Stundenlohn = 400 × 20 ÷ 3600 × 22 × 25,00\s€/);
assert.match(formel, /\(Einrichtung \+ Kamera und Rechner\) ÷ Ersparnis pro Monat/);
// eigene Werte
ks = { einrichtung: 6000, geraete: 3500, pflege: 150, stueck: 900, sekunden: 12, lohn: 32, quote: 5, anteil: 80, tage: 20 };
for (const [k, v] of Object.entries(ks)) await fk(k, String(v));
kr = rk(ks); kz = await dk();
nah(+kz.hand, kr.hand); nah(+kz.kamera, kr.kamera); nah(+kz.ersparnis, kr.ersp); nah(+kz.amort, kr.amort, 1e-4); nah(+kz.einmalig, 9500);
assert.equal(await page.locator(`${kk} .pg-tag[data-herkunft="eigen"]`).count(), 9);
// Komma als Dezimalzeichen und Grenzen
await fk("lohn", "27,5"); ks.lohn = 27.5; nah(+(await dk()).hand, rk(ks).hand);
for (const [k, v, muster] of [["stueck", "", /Bitte gib eine Zahl ein/], ["quote", "101", /höchstens 100/], ["tage", "32", /höchstens 31/], ["sekunden", "0", /größer als 0/], ["lohn", "-3", /nicht negativ/]]) {
  await fk(k, v);
  assert.equal(await page.getAttribute(`${kk} [data-feld="${k}"]`, "aria-invalid"), "true", k + " " + v);
  assert.match(await page.locator(`${kk} .pg-feld:has([data-feld="${k}"]) .pg-fehler`).textContent(), muster);
  assert.equal((await dk()).gueltig, "0");
  await fk(k, String(ks[k]).replace(".", ","));
  assert.equal((await dk()).gueltig, "1");
}
// zu teuer: Kamera spart nichts, Amortisation nie
await fk("pflege", "5000"); ks.pflege = 5000;
assert.equal((await dk()).amort, "nie"); assert.match(await page.textContent(`${kk} [data-pg="satz"]`), /nicht günstiger als die Handprüfung/);
assert.equal((await page.textContent(`${kk} [data-pg="amortisation"] b`)).trim(), "nie");
assert.doesNotMatch(await page.textContent(kk), /[–—]/, "keine Gedankenstriche");
await fk("pflege", "245");
// reine Funktion gleich wie die Handrechnung
const basis = { einrichtung: 2400, geraete: 2300, pflege: 245, stueck: 400, sekunden: 20, lohn: 25, quote: 3, anteil: 50, tage: 22 };
const rein = await page.evaluate((b) => window.KL.widgets["kosten-kamera"].rechne(b), basis);
nah(rein.amort, rk(basis).amort, 1e-9);
await page.locator(kk).scrollIntoViewIfNeeded();
await page.locator(kk).screenshot({ path: `tests/ausgabe/pg-kosten-kamera-${dunkel ? "dunkel" : "hell"}.png` });
// Einbindung über das Abschnittsfeld widget: der Abschnitt "kamera" der Seite bekommt den Rechner (so bindet die Seite ihn ein)
const abschnittHatWidget = await page.evaluate(() => { const a = window.KL.INHALT.seiten["kosten-energie"].abschnitte.find((x) => x.id === "kamera"); if (!a) return "kein Abschnitt kamera"; a.widget = "kosten-kamera"; return "ok"; });
assert.equal(abschnittHatWidget, "ok");
await page.evaluate(() => { history.pushState({ y: 0, i: 1 }, "", "/karte"); dispatchEvent(new PopStateEvent("popstate", { state: history.state })); });
await page.waitForTimeout(300);
await page.evaluate(() => { history.pushState({ y: 0, i: 2 }, "", "/kosten-energie"); dispatchEvent(new PopStateEvent("popstate", { state: history.state })); });
await page.waitForSelector('#kamera .abschnitt-widget[data-widget="kosten-kamera"] [data-feld="stueck"]', { timeout: 8000 });
assert.equal(await page.locator('#kamera .abschnitt-widget .pg-tag').count(), 9);
assert.match(await page.textContent('#kamera .abschnitt-widget [data-pg="satz"]'), /Die Handprüfung kostet/);
console.log("kosten-kamera: ok");

const alles = await page.textContent("#ausprobieren");
assert.doesNotMatch(alles, /[–—]/, "keine Gedankenstriche");
await feld("pers", "30");
await page.locator("#ausprobieren").screenshot({ path: `tests/ausgabe/pg-kosten-${dunkel ? "dunkel" : "hell"}.png` });
console.log("kosten-rechner: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
