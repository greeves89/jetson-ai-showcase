// node tests/demos-webcam.mjs: bedient Gesichts- und Objekt-Labor mit Fake-Webcam.
import { starte, oeffneSeite } from "./browser.mjs";
const pruefe = (ok, text) => { console.log((ok ? "OK    " : "FEHLT ") + text); if (!ok) process.exitCode = 1; };
const t = await starte({ dunkel: true });
const { page } = t;

async function messwerte() {
  return page.$$eval(".messwerte .messwert b", (bs) => bs.map((b) => b.textContent));
}
for (const [id, modus] of [["gesicht", "gesicht"], ["objekt", "objekt"]]) {
  await oeffneSeite(page, id);
  await page.click("text=Kamera starten");
  await page.waitForFunction(() => { const b = document.querySelectorAll(".messwerte .messwert b"); return b.length === 3 && b[1].textContent !== "·"; }, null, { timeout: 20000 });
  await page.waitForTimeout(3000);
  const m = await messwerte();
  pruefe(m[1] !== "·" && m[2] !== "·", `${id}: Messwerte ${m.join(" | ")}`);
  const segs = await page.$$eval(".pipe > div", (d) => d.map((x) => x.textContent));
  pruefe(segs.length >= 5 && segs.every((s) => /ms/.test(s)), `${id}: Pipeline ${segs.join(" | ")}`);
  const satz = await page.textContent(".live .erklaerung");
  pruefe(/Dein Browser hat ein Bild/.test(satz), `${id}: Satz: ${satz}`);
  const src = await page.$eval(".kameras img", (i) => i.src.slice(0, 22)).catch(() => null);
  pruefe(src === "data:image/jpeg;base64", `${id}: Ergebnisbild da`);
  if (modus === "objekt") {
    const setze = async (v) => { await page.$eval("#d-schwelle", (e, v) => { e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); }, v); await page.waitForTimeout(3500); return Number((await messwerte())[0]); };
    const niedrig = await setze(10);
    const hoch = await setze(90);
    pruefe(niedrig > hoch, `objekt: Schwelle 10 -> ${niedrig} Treffer, Schwelle 90 -> ${hoch} Treffer`);
    console.log("      ", await page.textContent("#d-schwelle-satz"));
  }
  await page.screenshot({ path: `tests/ausgabe/demo-${id}-dunkel.png`, fullPage: true });
  await page.click("text=Kamera stoppen");
  await page.waitForTimeout(500);
  pruefe((await page.textContent(".d-steuer .chip")) === "Kamera aus", `${id}: Stoppen`);
}
// Seitenwechsel waehrend Kamera laeuft
await oeffneSeite(page, "gesicht");
await page.click("text=Kamera starten");
await page.waitForTimeout(2500);
await page.evaluate(() => { location.hash = "#/start"; });
await page.waitForTimeout(800);
pruefe(true, "Seitenwechsel ohne Fehler");
pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
await t.schliessen();
