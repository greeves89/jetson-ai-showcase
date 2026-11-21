// Netz-Spielplatz: bedient den Baustein im echten Chrome und prueft, was die Erklaerung verspricht.
//   LABOR_URL=https://192.168.178.83:8443 node tests/widgets-grundlagen-netz.mjs [hell]
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false, dunkel: process.argv[2] !== "hell" });
const { page } = t;
await oeffneSeite(page, "neuronale-netze");
const W = ".gl-netz";
await page.locator(W).scrollIntoViewIfNeeded();
const regler = (i) => page.locator(`${W} input[type=range]`).nth(i);
const test = async () => {
  const s = await page.locator(`${W} .gl-stand`).nth(3).textContent();
  const m = s.match(/(\d+) von (\d+)/); return { richtig: +m[1], n: +m[2] };
};
const schrittZahl = async () => Number((await page.locator(`${W} .gl-stand`).nth(0).textContent()).replace(/\D/g, ""));
const satz = async () => { await page.waitForTimeout(700); return page.textContent(`${W} .erklaerung`); };
async function trainiere(bis, maxMs = 60000) {
  const b = page.locator(`${W} .btn.primary`);
  if (!/Pause/.test(await b.textContent())) await b.click();
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) {
    await page.waitForTimeout(500);
    if (await schrittZahl() >= bis) break;
  }
  await b.click();
  assert.match(await b.textContent(), /Training starten/);
  await page.waitForTimeout(400);
}
async function einstellen({ ds, hid, nper, akt }) {
  if (ds) await page.click(`${W} .gl-wahl button:has-text("${ds}")`);
  if (hid != null) await regler(0).fill(String(hid));
  if (nper != null) await regler(1).fill(String(nper));
  if (akt) await page.selectOption(`${W} select`, akt);
  await page.waitForTimeout(250);
}
const hitze = async () => { const t = await test(); return t.richtig / t.n; };

// Grundzustand: Kreis, 1 Schicht, 4 Neuronen, noch nichts gelernt
assert.equal(await schrittZahl(), 0);
assert.ok(await hitze() < 0.8, "ungelernt ist schlecht");

// 1) Kreis mit einer Schicht und vier Neuronen wird zuverlaessig geloest
await trainiere(3000);
let h = await hitze();
console.log("Kreis 1x4 tanh:", h, "Schritte", await schrittZahl());
assert.ok(h > 0.9, "Kreis ueber 90 Prozent: " + h);
let s = await satz(); console.log("Satz:", s);
assert.match(s, /Gelöst|Mit \d+ Neuronen/);
// Theme-Wechsel zeichnet neu: Pixel der Flaeche aendern sich
const px = () => page.evaluate(() => { const c = document.querySelector(".gl-netz canvas"); const d = c.getContext("2d").getImageData(c.width / 2, c.height * 0.15, 1, 1).data; return Array.from(d).join(","); });
const vorher = await px();
await page.emulateMedia({ colorScheme: process.argv[2] === "hell" ? "dark" : "light" });
await page.waitForTimeout(600);
const nachher = await px();
console.log("Pixel", vorher, "->", nachher);
assert.notEqual(vorher, nachher, "Hell/Dunkel-Wechsel zeichnet neu");
await page.emulateMedia({ colorScheme: process.argv[2] === "hell" ? "light" : "dark" });

// 2) ohne Zwischenschicht: nur Gerade, Kreis scheitert, Erklaerung nennt es
await einstellen({ hid: 0 });
assert.equal(await page.isDisabled(`${W} input[type=range] >> nth=1`), true, "Neuronen-Regler bei 0 Schichten gesperrt");
assert.equal(await schrittZahl(), 0, "Aenderung baut das Netz neu");
await trainiere(2000);
h = await hitze(); console.log("Kreis 0 Schichten:", h);
assert.ok(h < 0.8, "Gerade kann den Kreis nicht: " + h);
s = await satz(); console.log("Satz:", s);
assert.match(s, /gerade Linie/); assert.match(s, /Kreis braucht/);
// Zwei Wolken reichen mit einer Linie
await einstellen({ ds: "Zwei Wolken" });
await trainiere(1000);
h = await hitze(); console.log("Wolken 0 Schichten:", h); assert.ok(h > 0.9);
assert.match(await satz(), /reicht|gerade Linie/);

// 3) Schachbrett mit einer Schicht
await einstellen({ ds: "Schachbrett", hid: 1, nper: 4 });
await trainiere(3000);
h = await hitze(); console.log("XOR 1x4:", h); assert.ok(h > 0.9, "XOR " + h);

// 4) Spirale: wenig Neuronen schlecht, mehr deutlich besser
await einstellen({ ds: "Spirale", hid: 1, nper: 4 });
await trainiere(4000);
const wenig = await hitze(); console.log("Spirale 1x4:", wenig);
assert.ok(wenig < 0.75, "Spirale mit wenig Neuronen: " + wenig);
await einstellen({ hid: 2, nper: 8 });
await trainiere(8000);
const viel = await hitze(); console.log("Spirale 2x8:", viel);
assert.ok(viel > 0.9 && viel - wenig > 0.2, "Spirale mit mehr Neuronen deutlich besser: " + viel);
// 5) Rampe als Aktivierung
await einstellen({ ds: "Kreis im Kreis", hid: 1, nper: 4, akt: "relu" });
await trainiere(3000);
h = await hitze(); console.log("Kreis ReLU:", h); assert.ok(h > 0.9);

// 6) Ein Schritt, Neu starten, Zuruecksetzen
const vor1 = await schrittZahl();
await page.click(`${W} button:has-text("Ein Schritt")`);
await page.waitForTimeout(250);
assert.equal(await schrittZahl(), vor1 + 1, "Ein Schritt = ein Schritt");
const nach = await schrittZahl();
await page.click(`${W} button:has-text("Neu starten")`);
await page.waitForTimeout(250);
assert.equal(await schrittZahl(), 0);
await page.click(`${W} button:has-text("Zurücksetzen")`);
assert.equal(await page.inputValue(`${W} select`), "tanh");
assert.equal(await page.inputValue(`${W} input[type=range] >> nth=0`), "1");
assert.equal(await page.getAttribute(`${W} .gl-wahl button:has-text("Kreis im Kreis")`, "aria-pressed"), "true");
void nach;

// 7) Zuverlaessig: gleiche Einstellung, gleiches Ergebnis (fester Zufallsstartwert)
await trainiere(1500); const a1 = await test();
await page.click(`${W} button:has-text("Zurücksetzen")`);
await trainiere(1500); const a2 = await test();
console.log("Wiederholung:", a1, a2);
assert.ok(Math.abs(a1.richtig - a2.richtig) <= 1, "reproduzierbar");

// 8) Tastatur: Regler per Pfeiltaste, Knoepfe fokussierbar
await regler(2).focus(); const l0 = await page.textContent(`${W} .regler >> nth=3 >> output`);
await page.keyboard.press("ArrowRight");
assert.notEqual(await page.textContent(`${W} .regler >> nth=3 >> output`), l0);
// destroy: Seitenwechsel stoppt die Schleife (keine Fehler)
await page.click(`${W} .btn.primary`);
await page.goto(page.url().replace("neuronale-netze", "training"));
await page.waitForTimeout(800);
console.log(t.fehler.length ? "FEHLER:\n" + t.fehler.join("\n") : "keine Konsolenfehler");
assert.equal(t.fehler.length, 0);
await t.schliessen();
console.log("netz: ok");
