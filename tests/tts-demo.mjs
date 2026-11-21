// node tests/tts-demo.mjs [hell]
//   Oeffnet die Seite "sprachausgabe" (oder, solange es sie nicht gibt, eine temporaere Testseite mit demo "tts"),
//   spricht einen Text, prueft Wellenform, Lautschrift, Pipeline-Zahlen, Audiodauer, Stimmwechsel und Vergleich,
//   speichert Screenshots, meldet Konsolenfehler.
//   Beispiel: LABOR_URL=https://<jetson>:8443 node tests/tts-demo.mjs hell
import { starte, URL_LABOR } from "./browser.mjs";
import { mkdirSync } from "node:fs";
mkdirSync("tests/ausgabe", { recursive: true });
const hell = process.argv[2] === "hell";
const modus = hell ? "hell" : "dunkel";
const t = await starte({ dunkel: !hell, kamera: false });
const { page } = t;
let ok = true;
const pruefe = (b, was) => { console.log((b ? "ok     " : "FEHLER ") + was); if (!b) ok = false; };

await page.goto(URL_LABOR + "/", { waitUntil: "load" });
await page.waitForFunction(() => window.KL && window.KL.INHALT && window.KL.INHALT.seiten, null, { timeout: 15000 });
const echt = await page.evaluate(() => !!window.KL.INHALT.seiten.sprachausgabe);
let id = "sprachausgabe";
if (!echt) {
  id = "tts-test";
  await page.evaluate(() => { window.KL.INHALT.seiten["tts-test"] = { typ: "labor", gruppe: "Sprache", titel: "TTS-Test", symbol: "whisper", kurz: "", demo: "tts", abschnitte: [] }; });
  console.log("Hinweis: Seite sprachausgabe fehlt noch, teste ueber #/tts-test");
}
await page.evaluate((i) => { location.hash = "#/" + i; }, id);
await page.waitForSelector(".tts-feld", { timeout: 15000 });
await page.waitForSelector(".tts-stimme", { timeout: 10000 });
await page.screenshot({ path: `tests/ausgabe/tts-bereit-${modus}.png`, fullPage: true });
const stimmen = await page.$$eval(".tts-stimme", (e) => e.map((x) => x.textContent));
console.log("Stimmen:", stimmen.join(", "));
pruefe(stimmen.length >= 2, "mindestens zwei Stimmen angeboten");

// Probetext waehlen, Lerntext erscheint
await page.click('.tts-chip[data-id="abk"]');
pruefe(/Buchstabe/.test(await page.textContent(".tts-lern")), "Probetext zeigt Lernhinweis");
await page.fill(".tts-feld", "Am 24. Dezember 2026 kostet es 1.299,50 Euro.");
pruefe(/45 \/ 500/.test(await page.textContent(".tts-zaehler")), "Zaehler zeigt 45 / 500: " + (await page.textContent(".tts-zaehler")));
await page.click(".tts-sprechen");
await page.waitForSelector(".tts-karte audio", { timeout: 60000 });
await page.waitForSelector(".tts-laut-satz", { timeout: 5000 });
await page.waitForFunction(() => { const a = document.querySelector(".tts-karte audio"); return a && a.duration > 0; }, null, { timeout: 10000 });
const dauer = await page.$eval(".tts-karte audio", (a) => a.duration);
const laut = (await page.$$eval(".tts-laut-satz", (e) => e.map((x) => x.textContent))).join(" | ");
const erkl = (await page.textContent(".tts-erkl")).trim();
console.log("Audio:", dauer.toFixed(2), "s"); console.log("Lautschrift:", laut); console.log("Erklaerung:", erkl);
pruefe(dauer > 1, "Audio-Element hat Dauer > 0");
pruefe(laut.length > 20 && /ʊ|ɪ|ː/.test(laut), "Lautschrift sichtbar");
pruefe(/Sekunden Sprache/.test(erkl) && /gerechnet/.test(erkl) && /Echtzeit/.test(erkl), "Erklaerung nennt Dauer, Rechenzeit, Echtzeit");
pruefe((await page.$$eval(".tts-live .pipe > div", (e) => e.length)) >= 4, "Pipeline hat vier Abschnitte");
pruefe((await page.$$eval(".tts-live .pipeleg span", (e) => e.map((x) => x.textContent).join(" "))).includes("Klang erzeugen"), "Legende nennt Klang erzeugen");
const farbig = await page.$eval(".tts-welle", (c) => { const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n; });
pruefe(farbig > 200, "Wellenform gezeichnet (" + farbig + " Pixel)");
pruefe(!/–|—/.test(erkl + (await page.textContent(".tts-lern"))), "keine Gedankenstriche");
// Abspielen: Position laeuft
await page.evaluate(() => { const a = document.querySelector(".tts-karte audio"); a.currentTime = 0; return a.play(); });
await page.waitForTimeout(900);
const pos = await page.$eval(".tts-karte audio", (a) => a.currentTime);
pruefe(pos > 0.3, "Audio spielt, Position " + pos.toFixed(2) + " s");
await page.screenshot({ path: `tests/ausgabe/tts-ergebnis-${modus}.png`, fullPage: true });

// Stimme wechseln und neu sprechen
await page.click('.tts-stimme[aria-pressed="false"]');
const neu = await page.$eval('.tts-stimme[aria-pressed="true"]', (e) => e.textContent);
await page.click(".tts-sprechen");
await page.waitForFunction((n) => document.querySelectorAll(".tts-karte").length === 1 && document.querySelector(".tts-name").textContent === n, neu, { timeout: 60000 });
pruefe((await page.textContent(".tts-name")) === neu, "Stimmwechsel: Karte nennt " + neu);

// Vergleich
await page.click(".tts-vergleich");
await page.waitForFunction(() => document.querySelectorAll(".tts-karte").length === 2, null, { timeout: 90000 });
const namen = await page.$$eval(".tts-name", (e) => e.map((x) => x.textContent));
console.log("Vergleich:", namen.join(" und "));
pruefe(namen.length === 2 && namen[0] !== namen[1], "Vergleich zeigt zwei verschiedene Stimmen");
pruefe((await page.$$eval(".tts-live .pipe", (e) => e.length)) === 2, "zwei Pipeline-Streifen");
const welle2 = await page.$$eval(".tts-welle", (cs) => cs.map((c) => c.width > 0));
pruefe(welle2.length === 2 && welle2.every(Boolean), "zwei Wellenformen");
console.log("Vergleichssatz:", (await page.textContent(".tts-erkl")).trim());
await page.waitForTimeout(500);
await page.screenshot({ path: `tests/ausgabe/tts-vergleich-${modus}.png`, fullPage: true });

// Fehlerfall: leerer Text sperrt den Knopf
await page.fill(".tts-feld", "   ");
pruefe(await page.$eval(".tts-sprechen", (b) => b.disabled), "leerer Text sperrt Sprechen");

// Seitenwechsel raeumt auf
await page.evaluate(() => { location.hash = "#/chat"; });
await page.waitForTimeout(600);
const echte = t.fehler.filter((f) => !/^requestfailed: blob:.*ERR_ABORTED/.test(f));
pruefe(echte.length === 0, "keine Konsolenfehler" + (echte.length ? ": " + echte.join("; ") : ""));
await t.schliessen();
process.exit(ok ? 0 : 1);
