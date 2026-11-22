// Gemeinsamer Ablauf der Anlern-Beispiele (Bildmodell anlernen mit Katalogbildern, ohne Kamera). Kein eigener Test.
import { oeffneBeispiel, pruefer, warteStatus, origin } from "./bsp-hilfe.mjs";

export async function anlernenTest(id, mindestRichtig) {
  const { pruefe } = pruefer();
  const { t, page, e } = await oeffneBeispiel(id);
  const klassen = e.daten.klassen, tests = e.daten.test;
  pruefe(/Beispiel:/.test(await page.textContent(".d-bsp-kopf")), "Beispielkopf zeigt " + e.titel);
  await warteStatus(page, /Fertig: \d+ Beispielbilder gelernt/, 240000);
  const namen = await page.$$eval(".d-klasse input", (i) => i.map((x) => x.value));
  pruefe(JSON.stringify(namen) === JSON.stringify(klassen.map((k) => k.name)), "Klassen aus dem Katalog: " + namen.join(", "));
  const zahlen = await page.$$eval(".d-zahl", (z) => z.map((x) => parseInt(x.textContent)));
  pruefe(zahlen.every((n, i) => n === klassen[i].bilder.length), "Beispiele je Klasse: " + zahlen.join(", "));
  const knoepfe = await page.$$(".d-bsp-quelle:not([hidden]) .d-bsp-bild");
  pruefe(knoepfe.length === tests.length, tests.length + " Testbilder als Knöpfe");
  let richtig = 0;
  for (let i = 0; i < tests.length; i++) {
    await page.evaluate(() => { document.querySelector(".d-bsp-urteil").textContent = ""; });
    await knoepfe[i].click();
    await page.waitForFunction(() => /Der Jetson sagt/.test(document.querySelector(".d-bsp-urteil").textContent), null, { timeout: 30000 });
    const u = await page.textContent(".d-bsp-urteil");
    const sagt = ((/Der Jetson sagt: ([^(]+) \(/.exec(u) || [])[1] || "").trim();
    if (sagt === tests[i].erwartet) richtig++;
    if (i === 0) pruefe(sagt === (await page.textContent(".d-gross")).trim(), "Ergebnisfeld zeigt die Zuordnung: " + sagt);
  }
  pruefe(richtig >= mindestRichtig, `${richtig} von ${tests.length} Testbildern richtig (mindestens ${mindestRichtig})`);
  pruefe((await page.$$eval(".d-balkenzeile", (b) => b.length)) === klassen.length, "Balken je Klasse sichtbar");
  await page.screenshot({ path: `tests/ausgabe/beispiel-${id}.png` });
  pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
  await page.request.post(origin(page) + "/api/teach/reset", { headers: { Origin: origin(page) }, data: {} }).catch(() => {});
  await t.schliessen();
}
