// node tests/demos-teach.mjs [hell]: Klassen anlernen (Pointer halten) und Erkennung pruefen.
import { starte, oeffneSeite } from "./browser.mjs";
const pruefe = (ok, text) => { console.log((ok ? "OK    " : "FEHLT ") + text); if (!ok) process.exitCode = 1; };
const modus = process.argv[2] || "dunkel";
const t = await starte({ dunkel: modus !== "hell" });
const { page } = t;
await oeffneSeite(page, "anlernen");
await page.click("text=Kamera starten");
await page.waitForSelector(".d-halten:not([disabled])");
async function zuruecksetzen() {
  await page.click("text=Zurücksetzen");
  await page.click("text=Ja, löschen");
  await page.waitForTimeout(500);
}
await zuruecksetzen();
async function halten(i, ms) {
  const b = (await page.$$(".d-halten"))[i];
  await b.scrollIntoViewIfNeeded();
  const box = await b.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down(); await page.waitForTimeout(ms); await page.mouse.up();
  await page.waitForTimeout(600);
}
await halten(0, 2500);
const z1 = await page.$$eval(".d-zahl", (e) => e.map((x) => x.textContent));
pruefe(/^\d+ Beispiel/.test(z1[0]) && parseInt(z1[0]) >= 3, "Klasse A nimmt auf: " + z1.join(" | "));
console.log("      ", await page.textContent(".live .erklaerung"));
await halten(1, 2500);
const z2 = await page.$$eval(".d-zahl", (e) => e.map((x) => x.textContent));
pruefe(parseInt(z2[1]) >= 3, "Klasse B nimmt auf: " + z2.join(" | "));
await page.focus(".d-halten");
await page.keyboard.down("Space"); await page.waitForTimeout(1200); await page.keyboard.up("Space");
await page.waitForTimeout(500);
await page.waitForFunction(() => document.querySelectorAll(".d-balkenzeile").length >= 2, null, { timeout: 15000 });
await page.waitForTimeout(1200);
const erg = await page.textContent(".d-gross");
const sat = await page.textContent(".live .erklaerung");
pruefe(/Klasse/.test(erg) && /ähnelt/.test(sat), `Erkennung: ${erg} | ${sat}`);
const vals = await page.$$eval(".d-wert", (e) => e.map((x) => x.textContent));
pruefe(vals.length >= 2, "Balken: " + vals.join(", "));
await page.screenshot({ path: `tests/ausgabe/demo-anlernen-${modus}.png`, fullPage: false });
await zuruecksetzen();
pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
await t.schliessen();
