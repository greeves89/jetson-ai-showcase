// Prompt-Werkstatt: Vorlagen, Heuristik, Senden gegen das echte Modell, "Nochmal", Belegt-Meldung, Stopp, Sicherheit.
//   node tests/widgets-sprache-prompts.mjs [hell]   -> tests/ausgabe/sp-prompts-<modus>.png
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const modus = process.argv[2] === "hell" ? "hell" : "dunkel";
const t = await starte({ kamera: false, dunkel: modus !== "hell" });
const { page } = t;
await oeffneSeite(page, "prompting");
await page.waitForSelector(".sp-pw .sp-prompt");
const summen = () => page.$$eval(".sp-pw .sp-summe", (e) => e.map((x) => x.textContent));
const status = () => page.$$eval(".sp-pw .sp-status", (e) => e.map((x) => x.textContent));
const antworten = () => page.$$eval(".sp-pw .sp-antwort", (e) => e.map((x) => x.textContent));

// Heuristik je Vorlage: schwacher Prompt kaum Bausteine, guter Prompt alle fuenf
const vorlagen = await page.$$eval(".sp-pw [role=radiogroup] button", (b) => b.map((x) => x.textContent));
assert.equal(vorlagen.length, 5);
for (const v of vorlagen) {
  await page.click(`.sp-pw [role=radiogroup] button:has-text("${v}")`);
  const [a, b] = await summen();
  const na = Number(a[0]), nb = Number(b[0]);
  console.log(v.padEnd(26), "A:", a, "| B:", b);
  assert.ok(na <= 1, v + ": schwacher Prompt zeigt " + a);
  assert.ok(nb >= 4 && nb >= na + 3, v + ": guter Prompt zeigt " + b);   // nicht jeder Prompt braucht alle fünf Bausteine
  assert.equal(await page.$$eval(".sp-pw [role=radiogroup] button[aria-checked=true]", (e) => e.length), 1);
}
assert.ok((await antworten()).every((x) => /erscheint hier/.test(x)));

// Live-Erkennung beim Tippen
await page.click('.sp-pw [role=radiogroup] button:has-text("Mail an einen Kunden")');
const feldA = page.locator(".sp-pw .sp-prompt").first();
await feldA.fill("Du bist Sachbearbeiter. Schreib eine Mail wegen der Verspätung. Höchstens 80 Wörter, keine Rabatte.");
await page.waitForFunction(() => /^3 von 5/.test(document.querySelectorAll(".sp-pw .sp-summe")[0].textContent), null, { timeout: 3000 });
const liA = await page.$$eval(".sp-pw .sp-check:first-of-type .sp-checks li", (l) => l.map((x) => x.className + ":" + x.querySelector("b").textContent));
assert.deepEqual(liA, ["ja:Rolle", "nein:Kontext", "nein:Beispiel", "ja:Format", "ja:Grenzen"]);
assert.match(await page.textContent(".sp-pw .sp-check:first-of-type .sp-checks li.ja .sp-cs"), /erkannt an „Du bist“/);
assert.match(await page.textContent(".sp-pw .sp-check:first-of-type .sp-checks li.nein .sp-cs"), /Gib die Fakten/);
// Vorschau: Material wird angehaengt (A hat keinen Platzhalter), bei B ersetzt
await page.click(".sp-pw .sp-details summary >> nth=0");
const vorA = await page.textContent(".sp-pw .sp-pre >> nth=0");
assert.match(vorA, /Maschinenschaden/);
assert.ok(!/\[MATERIAL\]/.test(await page.textContent(".sp-pw .sp-pre >> nth=1")));
await feldA.fill("Schreib eine Mail wegen der Verspätung.");

// Temperatur
await page.locator(".sp-pw input[type=range]").fill("0");
assert.equal(await page.textContent(".sp-pw .regler output"), "0,0");
await page.locator(".sp-pw input[type=range]").fill("0.2");

// Echt senden: beide Antworten vom Jetson
await page.click('.sp-pw button:has-text("Beide senden")');
assert.ok(await page.isDisabled('.sp-pw button:has-text("Beide senden")'));
assert.ok(!(await page.isHidden('.sp-pw button:has-text("Stopp")')));
await page.waitForFunction(() => document.querySelectorAll(".sp-pw .sp-status")[0].textContent.match(/Fertig|belegt|ausgelastet|Abgebrochen|nicht|antwortet/), null, { timeout: 150000 });
await page.waitForFunction(() => !document.querySelector(".sp-pw button.btn.primary").disabled, null, { timeout: 200000 });
const st = await status(), an = await antworten();
console.log("Status:", st);
console.log("Antwort A:", an[0].slice(0, 120).replace(/\n/g, " "));
console.log("Antwort B:", an[1].slice(0, 120).replace(/\n/g, " "));
assert.match(st[0], /^Fertig: \d+ Token in/);
assert.match(st[1], /^Fertig: \d+ Token in/);
assert.ok(an[0].length > 20 && an[1].length > 20, "beide Antworten haben Text");
assert.ok(!/⁣/.test(an.join("")), "kein Tokentrenner im Text");
assert.ok(await page.isHidden('.sp-pw button:has-text("Stopp")'));
// Pruefliste zaehlt je Seite
await page.check(".sp-pw .sp-prfeld >> nth=0 >> text=Ton passt");
await page.check(".sp-pw .sp-prfeld >> nth=0 >> text=Vollständig");
await page.check(".sp-pw .sp-prfeld >> nth=1 >> text=Nichts erfunden");
assert.deepEqual(await page.$$eval(".sp-pw .sp-prsumme", (e) => e.map((x) => x.textContent)), ["2 von 4", "1 von 4"]);

// Nochmal nur auf einer Seite: Durchlauf 2, Haken zurueckgesetzt, B bleibt
const bVorher = an[1];
await page.click(".sp-pw .sp-akopf >> nth=0 >> text=Nochmal");
await page.waitForFunction(() => /Durchlauf 2/.test(document.querySelectorAll(".sp-pw .sp-status")[0].textContent), null, { timeout: 150000 });
assert.equal((await antworten())[1], bVorher);
assert.equal((await page.$$eval(".sp-pw .sp-prsumme", (e) => e.map((x) => x.textContent)))[0], "0 von 4");
await (await page.$("#ausprobieren")).screenshot({ path: `tests/ausgabe/sp-prompts-${modus}.png` });

// Belegt-Meldung (Antwort des Servers nachgestellt) und Stopp, ohne den Jetson zu belasten
const t2 = await starte({ kamera: false, dunkel: modus !== "hell" });
let anfragen = 0;
await t2.page.route("**/api/chat", (r) => { anfragen++; r.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: "[Gerade belegt: Der Jetson beantwortet schon zwei Fragen. Versuch es in einer halben Minute noch einmal.]" }); });
await oeffneSeite(t2.page, "prompting");
await t2.page.click('.sp-pw button:has-text("Beide senden")');
await t2.page.waitForFunction(() => /ausgelastet/.test(document.querySelectorAll(".sp-pw .sp-status")[0].textContent) && /Neuer Versuch in 6 Sekunden/.test(document.querySelectorAll(".sp-pw .sp-status")[0].textContent));
assert.match(await t2.page.textContent(".sp-pw .sp-status >> nth=1"), /Wartet, bis Vorher fertig/);
await t2.page.click('.sp-pw button:has-text("Stopp")');
await t2.page.waitForFunction(() => !document.querySelector(".sp-pw button.btn.primary").disabled, null, { timeout: 3000 });
assert.equal(anfragen, 1);
assert.match(await t2.page.textContent(".sp-pw .sp-status >> nth=0"), /Abgebrochen/);
assert.match(await t2.page.textContent(".sp-pw .sp-status >> nth=1"), /Nicht gesendet/);
await t2.schliessen();

// Sicherheit: Modellantwort mit HTML erscheint nur als Text
const t3 = await starte({ kamera: false, dunkel: modus !== "hell" });
await t3.page.route("**/api/chat", (r) => r.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: "<img src=x onerror=\"window.__xss=1\">⁣Hallo⁣\n\n---\n2 Tokens in 0.1s (20.0 Tok/s), Temperatur 0.2" }));
await oeffneSeite(t3.page, "prompting");
await t3.page.click('.sp-pw button:has-text("Beide senden")');
await t3.page.waitForFunction(() => /Fertig/.test(document.querySelectorAll(".sp-pw .sp-status")[1].textContent), null, { timeout: 8000 });
assert.equal(await t3.page.$$eval(".sp-pw img", (e) => e.length), 0);
assert.equal(await t3.page.evaluate(() => window.__xss), undefined);
assert.match(await t3.page.textContent(".sp-pw .sp-antwort >> nth=0"), /^<img src=x onerror="window.__xss=1">Hallo$/);
// Zu langer Prompt wird freundlich abgelehnt
await t3.page.locator(".sp-pw textarea.sp-feld:not(.sp-prompt)").fill("y".repeat(1200));
await t3.page.locator(".sp-pw .sp-prompt >> nth=1").fill("[MATERIAL] ".repeat(10));   // Platzhalter mehrfach: Nachricht wuerde zu lang
await t3.page.click('.sp-pw button:has-text("Beide senden")');
assert.match(await t3.page.textContent(".sp-pw .sp-meldung"), /zu lang/);
await t3.schliessen();

assert.equal(t.fehler.length, 0, t.fehler.join("\n"));
console.log("Prompt-Werkstatt ok (" + modus + ")");
await t.schliessen();
