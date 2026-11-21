// Regelkreis: laeuft mit gefalschter Uhr schnell durch mehrere Zufallswelten (festes Seed).
//   node tests/widgets-regelkreis.mjs            Pruefungen (Exit 1 bei Fehlschlag)
//   node tests/widgets-regelkreis.mjs bild       Bildschirmfotos hell/dunkel
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";

const SEKUNDEN = 120;
async function lauf(o) { for (let v = 1; ; v++) { try { return await lauf1(o); } catch (e) { if (v >= 3) throw e; console.log('Wiederholung nach', e.message.split('\n')[0]); await new Promise((r) => setTimeout(r, 4000)); } } }
async function lauf1({ seed, wahrnehmung, rausch = 10, verz = 0, dunkel = true, bilder = false }) {
  const t = await starte({ kamera: false, dunkel });
  const { page } = t;
  await page.addInitScript((s) => { let a = s; Math.random = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let x = Math.imul(a ^ (a >>> 15), 1 | a); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }, seed);
  await page.clock.install({ time: 0 });
  await oeffneSeite(page, "robotik");
  const root = "#ausprobieren .w-regel";
  await page.locator("canvas.w-sim").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  if (!wahrnehmung) await page.click(".w-regel .w-schalter");
  await page.locator('.w-regel input[type=range] >> nth=0').fill(String(rausch));
  await page.locator('.w-regel input[type=range] >> nth=1').fill(String(verz));
  await page.click('button:has-text("Neustart")');
  await page.clock.runFor(SEKUNDEN * 1000);
  const d = await page.$eval(root, (e) => ({ erreicht: +e.dataset.erreicht, kollisionen: +e.dataset.kollisionen, verfehlt: +e.dataset.verfehlt }));
  const texte = await page.$$eval(".w-pt", (e) => e.map((x) => x.textContent));
  if (bilder) await page.locator("#ausprobieren").screenshot({ path: `tests/ausgabe/wb-robotik-${dunkel ? "dunkel" : "hell"}-aktiv.png` });
  t.fehler = t.fehler.filter((f) => !f.includes("ERR_ABORTED"));
  const fehler = t.fehler.slice();
  await t.schliessen();
  return { ...d, texte, fehler };
}

if (process.argv[2] === "bild") {
  for (const dunkel of [true, false]) { const r = await lauf({ seed: 7, wahrnehmung: true, dunkel, bilder: true }); console.log(dunkel ? "dunkel" : "hell", r.erreicht, r.kollisionen, r.texte); }
  process.exit(0);
}

const SEEDS = [1, 2, 3, 4, 5, 6];
const tab = (n, l) => console.log(n.padEnd(28), l.map((r) => `${r.erreicht}/${r.kollisionen}/${r.verfehlt}`).join("  "));
console.log("Spalten: erreicht / Zusammenstoesse / Zeitueberschreitung je Seed, " + SEEDS.length + " Seeds a " + SEKUNDEN + " s");
const an = [], blind = [], hart = [];
for (const seed of SEEDS) an.push(await lauf({ seed, wahrnehmung: true, rausch: 10, verz: 0 }));
tab("Wahrnehmung an, 10 %, 0 Fr", an);
if (!process.env.NURAN) for (const seed of SEEDS) hart.push(await lauf({ seed, wahrnehmung: true, rausch: 60, verz: 12 }));
tab("Wahrnehmung an, 60 %, 12 Fr", hart);
for (const seed of SEEDS) blind.push(await lauf({ seed, wahrnehmung: false }));
tab("Wahrnehmung aus", blind);

const ziele = an.reduce((s, r) => s + r.erreicht, 0), koll = an.reduce((s, r) => s + r.kollisionen, 0), miss = an.reduce((s, r) => s + r.verfehlt, 0);
assert.ok(an.every((r) => r.erreicht >= 5), "mit Wahrnehmung erreicht jeder Lauf mindestens 5 Ziele");
assert.equal(miss, 0, "keine Zeitueberschreitung mit Wahrnehmung");
assert.ok(koll <= Math.ceil(ziele * 0.04), "hoechstens vereinzelte Zusammenstoesse mit Wahrnehmung (unter 4 Prozent der Ziele): " + koll + " bei " + ziele + " Zielen");
const kb = blind.reduce((s, r) => s + r.kollisionen, 0);
assert.ok(kb >= 8 && kb > koll * 4, "ohne Wahrnehmung deutlich mehr Zusammenstoesse: " + kb);
const hk = hart.reduce((s, r) => s + r.kollisionen, 0);
assert.ok(hk > koll, "Rauschen und Verzoegerung verschlechtern das Ergebnis: " + hk + " > " + koll);
assert.ok(an.every((r) => r.fehler.length === 0), "keine Konsolenfehler");
assert.ok(an[0].texte.every((x) => x.length > 8), "Erklaerfeld gefuellt: " + an[0].texte.join(" | "));
console.log("regelkreis: ok. Ziele", ziele, "Zusammenstoesse mit Wahrnehmung", koll, "ohne", kb, "hart", hk);
console.log("Beispieltexte:", an[0].texte.join(" | "));
