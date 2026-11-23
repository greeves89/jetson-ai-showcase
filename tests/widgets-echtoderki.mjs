// Echt oder KI?: 12 Karten, richtig und falsch, Tastatur, Ende, Noch einmal, Handy und Desktop.
//   LABOR_URL=https://192.168.178.83:8443 node tests/widgets-echtoderki.mjs [hell]  -> tests/ausgabe/eok-*.png
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const modus = process.argv[2] === "hell" ? "hell" : "dunkel";
const t = await starte({ kamera: false, dunkel: modus !== "hell" });
const { page } = t;
await oeffneSeite(page, "echt-oder-ki");
await page.waitForSelector(".eok .eok-wahl");
const erstes = await page.$eval("#inhalt", (r) => [...r.querySelectorAll("section.block")].map((s) => s.id || s.className)[0]);
console.log("erster Block:", erstes);
assert.ok(await page.$('a.dlkarte[href$="bildkarten-echt-oder-ki.pdf"]'), "Download-Karte");
const wahl = await page.$$eval(".eok-wahl", (b) => b.map((x) => x.getBoundingClientRect().height));
assert.ok(wahl.every((x) => x >= 44), "Touch >= 44");

async function lauf(strategie, tastatur) {
  const gesehen = new Set(); let richtig = 0;
  for (let i = 0; i < 12; i++) {
    await page.waitForSelector(".eok .eok-wahl");
    assert.equal((await page.textContent(".eok-zahl")).trim(), `Karte ${i + 1} von 12`);
    const alt = await page.getAttribute(".eok-bild", "alt");
    assert.match(alt, /^Bildkarte \d+$/, "alt neutral");
    const src = await page.getAttribute(".eok-bild", "src");
    gesehen.add(src);
    assert.ok(await page.$eval(".eok-bild", (im) => im.complete || true));
    const n = Number(alt.split(" ")[1]);
    const istKi = [2, 3, 6, 8, 9, 12].includes(n);
    const tippKi = strategie === "richtig" ? istKi : strategie === "falsch" ? !istKi : i % 2 === 0;
    if (tastatur) await page.keyboard.press(tippKi ? "2" : "1");
    else await page.click(tippKi ? '[data-wahl="ki"]' : '[data-wahl="echt"]');
    await page.waitForSelector(".eok-urteil");
    const ok = !!(await page.$(".eok-urteil.ok"));
    assert.equal(ok, tippKi === istKi);
    if (ok) richtig++;
    const txt = await page.textContent(".eok-aufl");
    assert.ok(txt.includes("Woran du es sehen konntest") && txt.length > 60);
    if (!istKi) assert.ok(/Wikimedia Commons/.test(txt), "Quelle echt");
    if (i === 2 && !tastatur) await (await page.$("#ausprobieren")).screenshot({ path: `tests/ausgabe/eok-aufloesung-${modus}.png` });
    if (i === 3 && !tastatur) await page.screenshot({ path: `tests/ausgabe/eok-seite-${modus}.png`, fullPage: false });
    if (tastatur) await page.keyboard.press("Enter"); else await page.click(".eok-weiter");
  }
  await page.waitForSelector(".eok-gross");
  assert.equal(gesehen.size, 12, "zwölf verschiedene Karten");
  assert.equal((await page.textContent(".eok-gross")).trim(), `${richtig} von 12`);
  return richtig;
}
assert.equal(await lauf("richtig", false), 12);
await (await page.$("#ausprobieren")).screenshot({ path: `tests/ausgabe/eok-ende-${modus}.png` });
const ende = await page.textContent(".eok-ende");
assert.ok(/quellen-pruefen/.test(await page.$eval(".eok-ende a[href='/quellen-pruefen']", (a) => a.getAttribute("href"))));
assert.ok(ende.includes("Herkunft prüfen schlägt Hinsehen"));
assert.ok(await page.$('.eok-druck[href$="bildkarten-echt-oder-ki.pdf"]'));
await page.click(".eok-nochmal");
assert.equal(await lauf("falsch", true), 0);
await page.click(".eok-nochmal");
const mix = await lauf("wechsel", false);
console.log("gemischt:", mix, "von 12");
// Pfeiltasten + Enter
await page.click(".eok-nochmal");
await page.waitForSelector(".eok-wahl");
await page.focus('[data-wahl="echt"]'); await page.keyboard.press("ArrowRight");
assert.equal(await page.evaluate(() => document.activeElement.dataset.wahl), "ki");
await page.keyboard.press("Enter");
await page.waitForSelector(".eok-urteil");
// Bilder laden wirklich
await page.click(".eok-weiter");
await page.waitForSelector(".eok-bild");
await page.waitForFunction(() => { const im = document.querySelector(".eok-bild"); return im && im.complete && im.naturalWidth > 0; }, null, { timeout: 8000 });
assert.ok(await page.$eval(".eok-bild", (im) => im.complete && im.naturalWidth > 0), "Bild geladen");
// Handy
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(300);
const ueber = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
assert.ok(ueber <= 1, "kein Quer-Scrollen: " + ueber);
await (await page.$("#ausprobieren")).screenshot({ path: `tests/ausgabe/eok-handy-${modus}.png` });
assert.equal(t.fehler.length, 0, "Konsole: " + t.fehler.join("; "));
console.log("ok");
await t.schliessen();
