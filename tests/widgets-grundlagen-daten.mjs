// Datenqualitaet: Zeilen markieren, pruefen, bereinigen. Der Schaetzfehler kommt aus dem Modell im Browser.
//   LABOR_URL=https://192.168.178.83:8443 node tests/widgets-grundlagen-daten.mjs [hell]
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false, dunkel: process.argv[2] !== "hell" });
const { page } = t;
await oeffneSeite(page, "daten");
const W = ".gl-dq";
await page.locator(W).scrollIntoViewIfNeeded();
const kachel = async (i) => parseInt((await page.locator(`${W} .gl-kachel b`).nth(i).textContent()).replace(/\D/g, ""), 10); // jetzt, Start, sauber, Lumo
const satz = async () => { await page.waitForTimeout(700); return page.textContent(`${W} .erklaerung`); };
const werkzeug = (n) => page.click(`${W} .gl-wahl >> nth=0 >> button:has-text("${n}")`);
const zeile = (id) => page.locator(`${W} tbody tr`).nth(id - 1);
// Wahrheit aus dem Kern: welche Zeilen sind wie verdorben
const wahrheit = await page.evaluate(() => KL.glKern.tabelle().map((q) => ({ id: q.id, typ: q.fehler && q.fehler.typ, von: q.fehler && q.fehler.vonId })));
const ids = (typ) => wahrheit.filter((x) => x.typ === typ).map((x) => x.id);
console.log("Fehlerzeilen:", Object.fromEntries(["tippfehler", "einheit", "ausreisser", "luecke", "dublette", "verzerrung"].map((k) => [k, ids(k)])));
assert.equal(wahrheit.length, 30);
assert.equal(await page.locator(`${W} tbody tr`).count(), 30);

const start = await kachel(1);
assert.equal(await kachel(0), start, "am Anfang jetzt = Start");
const sauber = await kachel(2);
console.log("Fehler Start", start, "sauber", sauber, "Lumo", await kachel(3));
assert.ok(start > 2 * sauber, "Fehler in den Daten verschlechtern das Modell deutlich");
assert.ok(await kachel(3) > 1.5 * sauber, "seltene Marke wird schlechter geschaetzt, auch bei sauberen Daten");

// Pruefen ohne Markierung: nichts gefunden
await page.click(`${W} button:has-text("Prüfen")`);
let erg = await page.textContent(`${W} .gl-ergebnis`); console.log(erg.slice(0, 200));
assert.match(erg, /0 von 13 Problemen gefunden/);
assert.ok(await page.locator(`${W} .gl-fehlzelle`).count() >= 7, "nach dem Pruefen sind die falschen Zellen umrandet");

// Markieren mit der Tastatur (Enter auf dem Zeilenknopf) und mit der Maus
const f = ids("tippfehler")[0];
await zeile(f).locator("button.gl-zk").focus(); await page.keyboard.press("Enter");
assert.equal(await zeile(f).locator("button.gl-zk").getAttribute("aria-pressed"), "true");
assert.match(await zeile(f).locator(".gl-mk").textContent(), /Fehler/);
await page.keyboard.press("Enter");
assert.equal(await zeile(f).locator("button.gl-zk").getAttribute("aria-pressed"), "false", "zweiter Enter nimmt die Markierung zurueck");
// falsche Markierung auf einer sauberen Zeile
const gut = wahrheit.find((x) => !x.typ && !wahrheit.some((y) => y.von === x.id)).id;
await zeile(gut).click();

// Alles Richtige markieren, je mit passendem Werkzeug
await werkzeug("Fehler"); for (const id of [...ids("tippfehler"), ...ids("einheit"), ...ids("ausreisser")]) await zeile(id).click();
await werkzeug("Lücke"); for (const id of ids("luecke")) await zeile(id).click();
await werkzeug("Dublette"); for (const id of ids("dublette")) await zeile(id).click();
await werkzeug("Verzerrung"); await zeile(ids("verzerrung")[0]).click();
await page.click(`${W} button:has-text("Prüfen")`);
erg = await page.textContent(`${W} .gl-ergebnis`); console.log(erg.slice(0, 700));
assert.match(erg, /13 von 13 Problemen gefunden/);
assert.match(erg, new RegExp("1 Zeile markiert, die in Ordnung war \\(Zeile " + gut + "\\)"));
assert.match(erg, /Behebst du nur diesen Fehler, sinkt der Schätzfehler/);
assert.equal(await page.locator(`${W} .gl-ergebnis li`).count(), 6, "ein Absatz je Fehlerart");

// Bereinigen: Fehler korrigieren, dann Luecken und Dubletten entfernen (die gute Zeile bleibt unberuehrt, wenn wir sie entmarkieren)
await werkzeug("Fehler"); await zeile(gut).click(); // gleiches Werkzeug nimmt die Markierung zurueck? Die Zeile hat "Fehler", also ja
assert.equal(await zeile(gut).locator("button.gl-zk").getAttribute("aria-pressed"), "false");
await page.click(`${W} button:has-text("Markierte Fehler korrigieren")`);
let s = await satz(); console.log("Korrigiert:", s);
assert.match(s, /^7 Werte korrigiert/);
const nachKorr = await kachel(0);
assert.ok(nachKorr < start, "Korrektur senkt den Fehler: " + nachKorr + " < " + start);
await page.click(`${W} button:has-text("Markierte Zeilen entfernen")`);
s = await satz(); console.log("Entfernt:", s);
assert.match(s, /5 Zeilen entfernt/);
assert.match(s, /Verzerrung lässt sich nicht wegstreichen/);
const jetzt = await kachel(0);
console.log("Fehler jetzt", jetzt, "sauber", sauber);
assert.ok(jetzt < 0.5 * start, "Bereinigung senkt den Fehler um mehr als die Haelfte");
assert.equal(jetzt, sauber, "alle Fehler beseitigt = Zielwert");
assert.equal(await page.locator(`${W} tbody tr:visible`).count(), 25);
// die seltene Marke bleibt schlechter: Verzerrung laesst sich nicht wegputzen
assert.ok(await kachel(3) > 1.5 * jetzt);

// Modellwechsel: Nachbarn reagieren anders, Werte bleiben berechnet
await page.click(`${W} .gl-wahl >> nth=1 >> button:has-text("Nächste Nachbarn")`);
await page.waitForTimeout(200);
console.log("kNN: jetzt", await kachel(0), "Start", await kachel(1), "sauber", await kachel(2));
assert.ok(await kachel(1) > await kachel(2), "auch kNN leidet unter den Fehlern");
// Zuruecksetzen baut alle Fehler wieder ein
await page.click(`${W} button:has-text("Zurücksetzen: alle Fehler")`);
assert.equal(await page.locator(`${W} tbody tr:visible`).count(), 30);
assert.equal(await kachel(0), await kachel(1));
assert.equal(await page.locator(`${W} .gl-ergebnis`).isHidden(), true);
// Markierungen loeschen
await zeile(1).click(); await page.click(`${W} button:has-text("Markierungen löschen")`);
assert.equal(await zeile(1).locator("button.gl-zk").getAttribute("aria-pressed"), "false");
// Entfernen einer guten Zeile wird im Befund als unnoetig gemeldet
await werkzeug("Dublette"); await zeile(gut).click(); await page.click(`${W} button:has-text("Markierte Zeilen entfernen")`);
await page.click(`${W} button:has-text("Prüfen")`);
assert.match(await page.textContent(`${W} .gl-ergebnis`), /in Ordnung war/);
console.log(t.fehler.length ? "FEHLER:\n" + t.fehler.join("\n") : "keine Konsolenfehler");
assert.equal(t.fehler.length, 0);
await t.schliessen();
console.log("daten: ok");
