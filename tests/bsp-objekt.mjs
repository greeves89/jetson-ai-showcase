// Gemeinsamer Ablauf der Objekterkennungs-Beispiele: Katalogfoto statt Webcam, derselbe Weg zum Jetson. Kein eigener Test.
import { oeffneBeispiel, pruefer, warteStatus } from "./bsp-hilfe.mjs";

export async function objektTest(id) {
  const { pruefe } = pruefer();
  const { t, page, e } = await oeffneBeispiel(id);
  const bilder = e.daten.bilder;
  pruefe(/Beispiel:/.test(await page.textContent(".d-bsp-kopf")), "Beispielkopf zeigt " + e.titel);
  await warteStatus(page, /Beispielbilder sind bereit/, 30000);
  const knoepfe = await page.$$(".d-bsp-bild");
  pruefe(knoepfe.length === bilder.length, bilder.length + " Beispielbilder wählbar");
  pruefe(await page.$eval(".d-vorlage", (i) => !i.hidden && i.naturalWidth > 0), "Beispielbild steht statt der Kamera");
  pruefe(/Erwartet:/.test(await page.textContent(".d-bsp-info")), "Erwartung zum Bild sichtbar");
  for (let i = 0; i < bilder.length; i++) {
    const vorher = await page.evaluate(() => { const x = document.querySelector(".kameras img[alt^='Kamerabild']"); return x ? x.src : ""; });
    await knoepfe[i].click();
    await page.waitForFunction((v) => { const x = document.querySelector(".kameras img[alt^='Kamerabild']"); return x && x.src && x.src !== v; }, vorher, { timeout: 60000 });
    await page.waitForFunction(() => /Gefunden:/.test(document.querySelector(".live .erklaerung").textContent), null, { timeout: 30000 });
    await page.waitForTimeout(700);
    const satz = await page.textContent(".live .erklaerung");
    const anzahl = parseInt(await page.textContent(".messwert b"));
    pruefe(anzahl >= 1, `Bild ${i + 1} (${bilder[i].titel}): ${anzahl} Objekte gefunden, erwartet ${bilder[i].erwartet}`);
    pruefe(/Beispielbild ausgewertet/.test(await page.textContent(".d-steuer .chip")), "Status meldet Auswertung");
    if (i === 0) console.log("       " + satz.trim());
  }
  // Schwelle ändern wertet das stehende Bild neu aus
  await page.fill("#d-schwelle", "90");
  await page.waitForFunction(() => /Schwelle 90 Prozent/.test(document.querySelector(".live .erklaerung").textContent), null, { timeout: 30000 });
  pruefe(true, "Schwelle 90 Prozent wertet das Beispielbild neu aus");
  await page.screenshot({ path: `tests/ausgabe/beispiel-${id}.png` });
  pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
  await t.schliessen();
}
