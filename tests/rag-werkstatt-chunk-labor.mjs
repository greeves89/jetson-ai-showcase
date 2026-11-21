// RAG-Werkstatt, Baustein rag-chunk-labor: Stueckzahl, Ueberlappung, Urteil, Tabelle, Durchprobieren, Suche auf dem Jetson.
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const t = await starte({ kamera: false, dunkel: process.argv[2] !== "hell" });
const { page } = t;
await oeffneSeite(page, "rag-chunking");
await page.waitForSelector(".rr-text .rr-seg", { timeout: 15000 });
const anzahl = async () => Number((await page.textContent(".rr-kennzahlen .messwert b")).trim());
const urteil = () => page.textContent(".rr-urteil");
const klasse = () => page.getAttribute(".rr-urteil", "class");
const sliders = page.locator(".rr input[type=range]");   // Groesse, Ueberlappung

// Start: feste Laenge 300, keine Ueberlappung, Antwort zerrissen
assert.equal(await page.locator('.rr-chips button[aria-pressed=true]').textContent(), "Feste Länge");
const n300 = await anzahl();
assert.ok(n300 >= 6 && n300 <= 8, "ca. 7 Stuecke bei 300 Zeichen: " + n300);
assert.match(await urteil(), /zerrissen/); assert.match(await klasse(), /schlecht/);
assert.ok(await page.locator(".rr-ant.schlecht").count() > 0, "Antwort rot unterstrichen");
assert.ok(await page.locator(".rr-marke").count() === n300, "ein Etikett je Stueck");
// Ueberlappung 20 Prozent heilt
await sliders.nth(1).fill("20");
assert.match(await urteil(), /liegt ganz in Stück/); assert.match(await klasse(), /ok/);
assert.ok(await page.locator(".rr-ueb").count() > 0, "Ueberlappung schraffiert");
// Groesse veraendert die Stueckzahl
await sliders.nth(0).fill("600");
const n600 = await anzahl();
assert.ok(n600 < n300, "weniger Stuecke bei 600: " + n600 + " < " + n300);
await sliders.nth(0).fill("300"); await sliders.nth(1).fill("0");
// Strategie: Absatz zeigt Ueberschrift-Waisen, Ueberschrift haelt die Tabelle
await page.click('.rr-chips button:has-text("Absatz")');
await page.waitForTimeout(500);
assert.match(await page.textContent(".rr-live .erklaerung"), /nur aus einer Überschrift/);
await page.click('.rr-chips button:has-text("Überschrift")');
await page.waitForTimeout(500);
assert.match(await page.textContent(".rr-live .erklaerung"), /Abschnitt unter einer Überschrift/);
await page.click('.rr-chips button:has-text("Feste Länge")');
await page.waitForTimeout(500);
assert.match(await page.textContent(".rr-live .erklaerung"), /Fehlertabelle ist auf \d Stücke verteilt/, "fester Schnitt zerlegt die Tabelle");
await sliders.nth(0).fill("1000"); await page.click('.rr-chips button:has-text("Überschrift")');
await page.waitForTimeout(500);
assert.match(await page.textContent(".rr-live .erklaerung"), /Fehlertabelle liegt in einem einzigen Stück/, "Ueberschrift haelt die Tabelle zusammen");
await sliders.nth(0).fill("300");
// Beispielfrage wechseln
await page.click('.rr-vorschlaege button:has-text("Wie oft muss entkalkt werden?")');
assert.match(await urteil(), /ganz in Stück/);
assert.equal(await page.inputValue(".rr-fragen textarea"), "Das Gerät sollte alle drei Monate entkalkt werden, bei hartem Wasser früher.");
// Antwort nicht im Text
await page.fill(".rr-fragen textarea", "Dieser Satz steht nirgends.");
assert.match(await urteil(), /kommt im Text nicht vor/);
await page.click('.rr-vorschlaege button:has-text("Welche Schritte")');
// Durchprobieren
await page.click('button:has-text("Alle Einstellungen durchprobieren")');
assert.equal(await page.locator(".rr-probetabelle tbody tr").count(), 5);
assert.equal(await page.locator(".rr-probetabelle tbody td").count(), 15);
assert.equal(await page.locator(".rr-probetabelle td.aktuell").count(), 1);
const ok = await page.locator(".rr-probetabelle td.ok").count(), schlecht = await page.locator(".rr-probetabelle td.schlecht").count();
assert.equal(ok + schlecht, 15); assert.ok(schlecht >= 2 && ok >= 8, `gemischtes Ergebnis ${ok}/${schlecht}`);
// Suche auf dem Jetson
await page.fill(".rr-fragen input", "Welche Schritte gehören zur Reinigung?");
await sliders.nth(1).fill("20");
await page.click('button:has-text("Mit dem Jetson suchen")');
await page.waitForSelector(".rr-sucherg .rr-nb", { timeout: 60000 });
const such = await page.textContent(".rr-sucherg");
console.log("Jetson-Suche:", such.slice(0, 160));
assert.match(such, /Platz \d+ von \d+/);
assert.equal(await page.locator(".rr-sucherg .rr-nb").count(), 3);
// Eigener Text
await page.click("summary:has-text('Eigenen Text einfügen')");
await page.fill(".rr-eigentext textarea", "# Titel\n\nErster Absatz mit Inhalt. Zweiter Satz.\n\nZweiter Absatz.");
await page.click('button:has-text("Übernehmen")');
assert.ok((await anzahl()) <= 2, "eigener Text kurz");
await page.click('button:has-text("Beispieltext zurück")');
assert.ok((await anzahl()) > 5);
const txt = await page.innerText("#inhalt");
assert.ok(!/[–—]/.test(txt.replace(/(^|\n)[ \t]*[–—][ \t]*(?=\n|$)/g, "$1")), "keine Gedankenstriche");
console.log("Fehler:", t.fehler.length ? t.fehler : "keine");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
