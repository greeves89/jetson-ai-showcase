// node tests/beispiele-sicherheit-zutritt.mjs: Beispielkopf mit Datenschutzhinweis, dann Kamera (Fake-Webcam) und Gesichtserkennung.
import { oeffneBeispiel, pruefer, warteStatus } from "./bsp-hilfe.mjs";
const { pruefe } = pruefer();
const { t, page, e } = await oeffneBeispiel("sicherheit-zutritt", { kamera: true });
pruefe(/Beispiel:/.test(await page.textContent(".d-bsp-kopf")), "Beispielkopf zeigt " + e.titel);
pruefe(/Rechtsgrundlage/.test(await page.textContent(".d-beispiel")), "Datenschutzhinweis ist im Beispiel sichtbar");
await warteStatus(page, /brauchst du deine Kamera/, 15000);
pruefe(true, "Status verweist auf die Kamera");
pruefe((await page.$$(".d-bsp-bild")).length === 0, "keine Beispielbilder, das Beispiel läuft über die Kamera");
await page.click("button:has-text('Kamera starten')");
await page.waitForFunction(() => /verbunden|Beispiel|Bilder laufen/.test(document.querySelector(".d-steuer .chip").textContent), null, { timeout: 20000 });
await page.waitForFunction(() => document.querySelector(".kameras img[alt^='Kamerabild']"), null, { timeout: 30000 });
pruefe(true, "Der Jetson schickt das Kamerabild mit Markierungen zurück");
await page.screenshot({ path: "tests/ausgabe/beispiel-sicherheit-zutritt.png" });
pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
await t.schliessen();
