// Bedient ablaufspiel (Spielen, Fehler, Kette, echtes Modell) und angriff (Schutzmassnahmen aendern das Ergebnis).
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const dunkel = process.argv[2] !== "hell";
const t = await starte({ dunkel, kamera: false });
const { page } = t;
await oeffneSeite(page, "agenten-planung");
const A = ".sa-ab";
await page.locator(`${A} .sa-aufgabe`).scrollIntoViewIfNeeded();
const wk = async (name, eingabe) => { await page.click(`${A} .sa-werkzeug:has-text("${name}")`); await page.selectOption(`${A} .sa-sel`, { label: eingabe }); await page.click(`${A} button:has-text("Werkzeug ausführen")`); };
const mess = (l) => page.textContent(`${A} .sa-mess .messwert:has-text("${l}") b`);
// Fehlgriffe: falsche Nummer, fehlende Nummer
await wk("Bestellstatus", "Bestellnummer 1024");
await wk("Bestellstatus", "ohne Nummer");
assert.equal(await mess("Fehlgriffe"), "2");
assert.match(await mess("Runde"), /^2 von 6/);
const k1 = Number((await mess("Kontext")).replace(/\D/g, ""));
// Rechner ohne vorherige Fakten ist geraten
await wk("Taschenrechner", "36,40 + 4,90");
assert.equal(await page.locator(`${A} .sa-schritt`).last().getAttribute("class").then((c) => /sa-art-falsch/.test(c)), true);
const k2 = Number((await mess("Kontext")).replace(/\D/g, ""));
assert.ok(k2 > k1, "Kontext waechst " + k1 + " -> " + k2);
// Wiederholung
await wk("Bestellstatus", "Bestellnummer 1024");
assert.ok(await page.locator(`${A} .sa-art-wiederholt`).count() === 1);
// Neu starten und sauber loesen
await page.click(`${A} .sa-kopf button:has-text("Umzug")`); await page.click(`${A} .sa-kopf button:has-text("Kundenanfrage")`);
assert.equal(await mess("Runde"), "0 von 6");
await wk("Bestellstatus", "Bestellnummer 1042"); await wk("Lieferzeit", "Standardversand"); await wk("Preisliste", "Tabelle Versandkosten"); await wk("Taschenrechner", "36,40 + 4,90");
await page.click(`${A} button:has-text("Jetzt antworten")`);
const erg = await page.textContent(`${A} .sa-ergebnis`);
console.log(erg.slice(0, 300));
assert.match(erg, /Donnerstag/); assert.match(erg, /41,30 Euro/); assert.match(erg, /Sauber gelöst/);
// Abbruch durch Rundengrenze
await page.click(`${A} .sa-kopf button:has-text("Büropapier")`);
await page.locator(`${A} .regler:has(label:text("Höchstzahl")) input`).fill("3");
await wk("Lagerbestand", "Toner"); await wk("Lagerbestand", "ohne Artikel"); await wk("Preise", "Toner");
assert.match(await page.textContent(`${A} .sa-ergebnis`), /Abbruch nach 3 Runden/);
// Kette: 90 Prozent, 10 Schritte = 34,9 Prozent
await page.click(`${A} button.chip:has-text("Kette berechnen")`);
await page.locator(`${A} .regler:has(label:text("Erfolg")) input`).fill("90");
await page.locator(`${A} .regler:has(label:text("Anzahl")) input`).fill("10");
await page.waitForTimeout(700);
assert.match(await page.textContent(`${A} .sa-kette .sa-erkl`), /schaffen 10 Schritte die ganze Kette nur mit 34,9 Prozent/);
assert.match(await page.getAttribute(`${A} svg.sa-chart`, "aria-label"), /34,9 Prozent/);
await page.click(`${A} button:has-text("100 Läufe würfeln")`);
assert.equal(await page.locator(`${A} .sa-raster i`).count(), 100);
const w = await page.textContent(`${A} .sa-kette .sa-erkl >> nth=1`);
const ok = Number(/^(\d+) von 100/.exec(w)[1]); console.log("Wuerfel:", w.slice(0, 80)); assert.ok(ok >= 10 && ok <= 65);
// echtes Modell
await page.click(`${A} button.chip:has-text("Selbst spielen")`);
await page.click(`${A} button:has-text("Das echte Modell versuchen")`);
await page.waitForFunction((s) => document.querySelector(s + " .sa-echtstatus").textContent.length > 20 && !document.querySelector(s + " .sa-echt .btn:not(.klein)").disabled, A, { timeout: 120000 });
console.log("Modell:", await page.textContent(`${A} .sa-echtstatus`));

// ---------- angriff
await oeffneSeite(page, "agenten-sicherheit");
const B = ".sa-an";
await page.locator(`${B} .sa-fremd`).scrollIntoViewIfNeeded();
const lauf = async () => { await page.click(`${B} button:has-text("Agent starten")`); await page.waitForSelector(`${B} .sa-ergebnis:not([hidden]) .sa-urteil`, { timeout: 15000 }); return page.textContent(`${B} .sa-urteil .chip`); };
const schaden = () => page.textContent(`${B} .sa-meter:has-text("Schaden") b`);
assert.equal(await lauf(), "Angriff erfolgreich"); assert.equal(await schaden(), "70 von 100");
// Kennzeichnung stoppt den plumpen Angriff
await page.click(`${B} .w-schalter:has-text("kennzeichnen") .w-sw`);
assert.equal(await lauf(), "Angriff ohne Folge"); assert.equal(await schaden(), "0 von 100");
assert.match(await page.textContent(`${B} .sa-massnahmen`), /Gewirkt\. Der Text war plump/);
await page.click(`${B} .w-schalter:has-text("kennzeichnen") .w-sw`);
// Recht Mail senden entziehen
await page.click(`${B} .sa-recht[data-recht=mail] .w-sw`);
assert.equal(await lauf(), "Angriff ohne Folge");
assert.match(await page.textContent(`${B} .sa-ablauf`), /Recht „Mails senden“/);
await page.click(`${B} .sa-recht[data-recht=mail] .w-sw`);
// Freigabe: Mensch lehnt ab
await page.click(`${B} .w-schalter:has-text("Mensch") .w-sw`);
await page.click(`${B} button:has-text("Agent starten")`);
await page.waitForSelector(`${B} .sa-anfrage`);
assert.match(await page.textContent(`${B} .sa-anfragetext`), /kontrolle@example\.invalid/);
await page.click(`${B} .sa-anfrage button:has-text("Ablehnen")`);
await page.waitForSelector(`${B} .sa-urteil`);
assert.equal(await page.textContent(`${B} .sa-urteil .chip`), "Angriff ohne Folge");
// Getarnte Anfrage (Support): Zustimmen ohne Hinsehen = Schaden
await page.click(`${B} .sa-kopf button:has-text("Support")`); // Freigabe bleibt eingeschaltet
await page.click(`${B} button:has-text("Agent starten")`);
await page.waitForSelector(`${B} .sa-anfrage`);
assert.equal(await page.isVisible(`${B} .sa-anfrageinhalt`), false);
await page.click(`${B} .sa-anfrage button:has-text("Zustimmen")`);
await page.waitForSelector(`${B} .sa-urteil`);
assert.equal(await page.textContent(`${B} .sa-urteil .chip`), "Angriff erfolgreich");
assert.match(await page.textContent(`${B} .sa-massnahmen`), /Inhalt zeigte erst/);
// Auswertung rechnet die Wirksamkeit
const ausw = await page.textContent(`${B} .sa-auswertung`);
console.log(ausw.slice(0, 420));
assert.match(ausw, /wirksamste einzelne Maßnahme ist hier: nur Freigabe durch einen Menschen\. Sie stoppt 5 von 7/);
assert.match(ausw, /bleibt riskant: Support-Ticket beantworten und Newsletter zusammenfassen/);
// mindestens 6 Szenarien, kein Gedankenstrich
assert.ok(await page.locator(`${B} .sa-kopf .chip`).count() >= 6);
assert.equal(/[–—]/.test(await page.textContent("#inhalt")), false);
await page.evaluate(() => { location.hash = "#/start"; }); await page.waitForTimeout(400);
console.log(t.fehler.length ? t.fehler.join("\n") : "agenten ok");
assert.equal(t.fehler.length, 0);
await t.schliessen();
