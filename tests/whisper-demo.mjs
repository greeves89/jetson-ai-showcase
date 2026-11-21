// node tests/whisper-demo.mjs [hell]
//   Oeffnet die Seite "whisper", nimmt ca. 6 s auf (FAKE_AUDIO = deutsche wav), wartet auf das Ergebnis,
//   prueft Text, Sprache und Pipeline-Zahlen, speichert Screenshots, meldet Konsolenfehler.
//   Beispiel: FAKE_AUDIO=probe.wav LABOR_URL=https://<jetson>:8443 node tests/whisper-demo.mjs
import { starte, oeffneSeite } from "./browser.mjs";
import { mkdirSync } from "node:fs";
mkdirSync("tests/ausgabe", { recursive: true });
const hell = process.argv[2] === "hell";
const modus = hell ? "hell" : "dunkel";
const t = await starte({ dunkel: !hell });
const { page } = t;
let ok = true;
const pruefe = (b, was) => { console.log((b ? "ok     " : "FEHLER ") + was); if (!b) ok = false; };
await oeffneSeite(page, "whisper");
await page.waitForSelector(".wh-rec");
await page.screenshot({ path: `tests/ausgabe/whisper-bereit-${modus}.png`, fullPage: true });
await page.click(".wh-rec");
await page.waitForSelector(".wh-rec.an");
await page.waitForTimeout(3000);
await page.screenshot({ path: `tests/ausgabe/whisper-aufnahme-${modus}.png`, fullPage: true });
const zeit = await page.textContent(".wh-zeit");
pruefe(zeit !== "00:00", "Aufnahmezeit laeuft (" + zeit + ")");
await page.waitForTimeout(3500);
await page.click(".wh-rec");
await page.waitForSelector(".wh-text", { timeout: 90000 });
await page.waitForSelector(".wh-live .messwert", { timeout: 5000 });
const text = (await page.textContent(".wh-text")).trim();
const erkl = (await page.textContent(".wh-live .erklaerung")).trim();
const werte = (await page.$$eval(".wh-live .messwert", (e) => e.map((x) => x.textContent))).join(" | ");
console.log("Text:", text); console.log("Erklaerung:", erkl); console.log("Werte:", werte);
pruefe(text.length > 10, "Text erkannt");
pruefe(/Deutsch/.test(await page.textContent(".wh-kopf")), "Sprache Deutsch angezeigt");
pruefe(/gesprochen/.test(erkl) && /gerechnet/.test(erkl) && /Echtzeit/.test(erkl), "Live-Erklaerung nennt Dauer, Rechenzeit, Echtzeit");
pruefe((await page.$$eval(".wh-live .pipe > div", (e) => e.length)) >= 3, "Pipeline hat mindestens 3 Abschnitte");
pruefe(!/–|—/.test(erkl + text), "keine Gedankenstriche");
const segs = await page.$$(".wh-seg");
pruefe(segs.length >= 1, "Segmente vorhanden: " + segs.length);
await segs[0].click();
await page.waitForTimeout(800);
const pos = await page.$eval(".wh-player", (a) => ({ t: a.currentTime, d: a.duration, p: a.paused }));
console.log("Player:", JSON.stringify(pos));
pruefe(pos.t > 0 || !pos.p, "Segment spielt die Aufnahme ab");
await page.screenshot({ path: `tests/ausgabe/whisper-ergebnis-${modus}.png`, fullPage: true });
// Seitenwechsel raeumt auf
await page.evaluate(() => { location.hash = "#/chat"; });
await page.waitForTimeout(600);
// Chrome bricht beim Entfernen des <audio>-Elements dessen blob:-Abruf ab (ERR_ABORTED); das ist kein Fehler der Seite.
const echte = t.fehler.filter((f) => !/^requestfailed: blob:.*ERR_ABORTED/.test(f));
pruefe(echte.length === 0, "keine Konsolenfehler" + (echte.length ? ": " + echte.join("; ") : ""));
await t.schliessen();
process.exit(ok ? 0 : 1);
