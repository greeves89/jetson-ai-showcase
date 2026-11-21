// Risiko-Spiel: Runde mit Startwert, Zaehler, Erklaerung, Tastatur, Auswertung, Wiederholen.
//   node tests/widgets-sprache-risiko.mjs [hell]   -> tests/ausgabe/sp-risiko-<modus>*.png
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const modus = process.argv[2] === "hell" ? "hell" : "dunkel";
const t = await starte({ kamera: false, dunkel: modus !== "hell" });
const { page } = t;
await oeffneSeite(page, "llm-grenzen");
await page.waitForSelector(".sp-rs .sp-seed");
const daten = await page.evaluate(async () => (await fetch("/static/daten/risiko-szenarien.json")).json());
assert.ok(daten.szenarien.length >= 10);
const finde = (txt) => daten.szenarien.find((s) => s.bloecke[0].text === txt);

async function runde(seed, modusAntwort) {
  await page.fill(".sp-rs .sp-seed", String(seed));
  await page.click('.sp-rs button:has-text("Runde starten")');
  const karten = [], arten = {};
  let richtig = 0;
  for (let i = 0; i < 10; i++) {
    await page.waitForSelector(".sp-rs .sp-opt:not([disabled])");
    assert.equal((await page.textContent(".sp-rs .sp-zahl")).trim(), `Karte ${i + 1} von 10`);
    const erster = await page.textContent(".sp-rs .sp-block .sp-bt");
    const s = finde(erster);
    assert.ok(s, "Szenario gefunden");
    karten.push(s.id); arten[s.art] = (arten[s.art] || 0) + 1;
    const richtigText = s.optionen.find((o) => o.id === s.richtig).t;
    const falscheText = s.optionen.filter((o) => o.id !== s.richtig)[0].t;
    const ziel = modusAntwort === "richtig" ? richtigText : modusAntwort === "falsch" ? falscheText : null;
    if (ziel === null) { await page.keyboard.press("1"); }
    else await page.click(`.sp-rs .sp-opt:has(.sp-ot:text-is("${ziel.replace(/"/g, '\\"')}"))`);
    await page.waitForSelector(".sp-rs .sp-rueck.ok, .sp-rs .sp-rueck.nein");
    const ok = await page.$(".sp-rs .sp-rueck.ok");
    const erwartet = modusAntwort === "richtig" ? true : modusAntwort === "falsch" ? false : null;
    if (erwartet !== null) assert.equal(!!ok, erwartet);
    if (ok) richtig++;
    assert.ok((await page.textContent(".sp-rs .sp-rueck")).includes(s.erklaerung));
    assert.equal(await page.$$eval(".sp-rs .sp-opt:not([disabled])", (e) => e.length), 0, "nach der Wahl gesperrt");
    assert.equal((await page.textContent(".sp-rs .sp-stand")).trim(), richtig + " richtig");
    if (i === 3 && modusAntwort === "tasten") await (await page.$("#ausprobieren")).screenshot({ path: `tests/ausgabe/sp-risiko-karte-${modus}.png` });
    await page.click(".sp-rs .sp-weiter");
  }
  await page.waitForSelector(".sp-rs .sp-gross");
  return { karten, arten, richtig };
}

// Zusammensetzung: je Art mindestens zwei Karten
const r1 = await runde(42, "richtig");
console.log("Karten:", r1.karten.join(" "), r1.arten);
assert.equal(r1.karten.length, 10);
assert.equal(new Set(r1.karten).size, 10);
for (const a of Object.keys(daten.arten)) assert.ok(r1.arten[a] >= 2, a);
assert.equal(r1.richtig, 10);
assert.match(await page.textContent(".sp-rs .sp-gross"), /^10 von 10 richtig$/);
assert.match(await page.textContent(".sp-rs"), /Alles richtig/);
assert.match(await page.textContent(".sp-rs"), /In dieser Runde nichts/);

// gleicher Startwert, gleiche Runde (ueber Wiederholen)
await page.click('.sp-rs button:has-text("Dieselbe Runde")');
await page.waitForSelector(".sp-rs .sp-opt");
const ersteWiederholt = await page.textContent(".sp-rs .sp-block .sp-bt");
assert.equal(finde(ersteWiederholt).id, r1.karten[0]);
// ... und alle falsch
await page.click('.sp-rs button:has-text("Startwert") >> nth=0').catch(() => {});
await page.goBack().catch(() => {});
await oeffneSeite(page, "llm-grenzen");
await page.waitForSelector(".sp-rs .sp-seed");
const r2 = await runde(42, "falsch");
assert.deepEqual(r2.karten, r1.karten, "gleicher Startwert, gleiche Reihenfolge");
assert.equal(r2.richtig, 0);
assert.match(await page.textContent(".sp-rs .sp-gross"), /^0 von 10 richtig$/);
assert.ok(await page.$$eval(".sp-rs .sp-verwechslung li", (e) => e.length) >= 1);
assert.ok(await page.$$eval(".sp-rs .sp-nachlesen li", (e) => e.length) === 10);
assert.ok(await page.$$eval(".sp-rs .sp-ae", (e) => e.length) === 4);
await (await page.$("#ausprobieren")).screenshot({ path: `tests/ausgabe/sp-risiko-ende-${modus}.png` });

// anderer Startwert, andere Reihenfolge; Tasten 1 bis 3
await page.click('.sp-rs button:has-text("Startwert waehlen"), .sp-rs button:has-text("Startwert wählen")');
const r3 = await runde(7, "tasten");
assert.notDeepEqual(r3.karten, r1.karten);
assert.match(await page.textContent(".sp-rs .sp-gross"), /^\d+ von 10 richtig$/);
const n = Number((await page.textContent(".sp-rs .sp-gross")).split(" ")[0]);
assert.equal(n, r3.richtig, "Zaehler und Auswertung stimmen ueberein");

// Sicherheit: Startwert nimmt nur Ziffern
await page.click('.sp-rs button:has-text("Startwert wählen")');
await page.fill(".sp-rs .sp-seed", "<b>9x");
await page.click('.sp-rs button:has-text("Runde starten")');
await page.waitForSelector(".sp-rs .sp-opt");
assert.equal(await page.$$eval(".sp-rs b", (e) => e.length), 0);
assert.equal(t.fehler.length, 0, t.fehler.join("\n"));
console.log("Risiko-Spiel ok (" + modus + ")");
await t.schliessen();
