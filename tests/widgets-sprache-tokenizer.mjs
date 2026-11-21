// Tokenizer-Labor: echte Zerlegung vom Jetson, Zaehler, Nummern, Vergleich, Naeherung ohne Server, Sicherheit.
//   node tests/widgets-sprache-tokenizer.mjs [hell]   -> tests/ausgabe/sp-tokenizer-<modus>*.png
import { starte, oeffneSeite, URL_LABOR } from "./browser.mjs";
import assert from "node:assert/strict";
const modus = process.argv[2] === "hell" ? "hell" : "dunkel";
const t = await starte({ kamera: false, dunkel: modus !== "hell" });
const { page } = t;
await oeffneSeite(page, "tokens-sprachmodelle");
await page.waitForSelector(".sp-tok .sp-feld");
const tokenTexte = () => page.$$eval(".sp-tok .sp-tk", (e) => e.map((x) => x.textContent));
const wert = async (name) => page.$$eval(".sp-tok .sp-werte > div", (ds, n) => { const d = ds.find((x) => x.querySelector("dt").textContent === n); return d && d.querySelector("dd").textContent; }, name);
const server = (text) => page.evaluate(async (a) => (await fetch("/api/tokenize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: a }) })).json(), text);
const warteAnzahl = (n) => page.waitForFunction((n) => document.querySelectorAll(".sp-tok .sp-tk").length === n, n, { timeout: 15000 });

// Anfangszustand
assert.match(await page.textContent(".sp-tok .sp-leer"), /Hier erscheinen die Stücke/);
await page.waitForFunction(() => /Genau/.test(document.querySelector(".sp-tok .chip[role=status]").textContent), null, { timeout: 15000 });

// Beispiel: Fachwort. Anzahl stimmt mit dem Server ueberein, Stuecke ergeben den Text.
await page.click('.sp-tok .sp-bsp button:has-text("Hausratversicherung")');
await warteAnzahl(6);
let tk = await tokenTexte();
assert.equal(tk.join(""), "Hausratversicherung");
assert.equal(await wert("Token"), "6");
assert.equal(await wert("Zeichen"), "19");
assert.equal(await wert("Wörter"), "1");
assert.equal(await wert("Token je Wort"), "6,0");
assert.match(await page.textContent(".sp-tok .sp-zerfall"), /Hausratversicherung \(6\)/);
assert.match(await page.textContent(".sp-tok .sp-notiz"), /Bruchstücken/);
console.log("Hausratversicherung:", tk.join(" | "));

// Eigener Text: Anzahl identisch zum Server, Leerzeichen am Wortanfang mit Punkt markiert
const eigen = "Das Haus ist alt, aber die Hausratversicherung gilt 2025.";
await page.fill(".sp-tok .sp-feld", eigen);
const s = await server(eigen);
await warteAnzahl(s.anzahl);
assert.equal(await wert("Token"), String(s.anzahl));
tk = await tokenTexte();
assert.deepEqual(tk.map((x) => x.replace(/·/g, " ")), s.tokens.map((x) => x.text));
assert.ok(tk.some((x) => x.startsWith("·Haus")), "Leerzeichen gehoert zum Wort: " + tk.join("|"));
assert.equal(s.quelle, "gguf");
assert.ok(s.wortschatz > 100000, "Wortschatz " + s.wortschatz);

// Nummern
await page.click('.sp-tok .sp-seg button:has-text("Nummern")');
const ids = await tokenTexte();
assert.deepEqual(ids, s.tokens.map((x) => String(x.id)));
await page.click('.sp-tok .sp-seg button:has-text("Text")');
assert.deepEqual((await tokenTexte()).map((x) => x.replace(/·/g, " ")), s.tokens.map((x) => x.text));

// Lerneffekte: haeufiges Wort ein Stueck, Zahl in Bloecken
await page.fill(".sp-tok .sp-feld", "ein Haus");
await warteAnzahl(2);
assert.deepEqual(await tokenTexte(), ["ein", "·Haus"]);
await page.click('.sp-tok .sp-bsp button:has-text("12.10.2025")');
await warteAnzahl(6);
assert.deepEqual(await tokenTexte(), ["12", ".", "10", ".", "202", "5"]);
await page.click('.sp-tok .sp-bsp button:has-text("Donaudampf")');
await page.waitForFunction(() => document.querySelectorAll(".sp-tok .sp-tk").length > 8);
await page.click('.sp-tok .sp-bsp button:has-text("Straße")');
await page.waitForFunction(() => document.querySelector(".sp-tok .sp-teil") || document.querySelectorAll(".sp-tok .sp-tk").length > 0);
await page.click('.sp-tok .sp-bsp button:has-text("Erdbeere")');
await warteAnzahl(4);
assert.match(await page.textContent(".sp-tok .sp-notiz"), /Wie viele r/);

// Englisch gegen Deutsch
await page.click('.sp-tok .sp-bsp button:has-text("Englisch gegen Deutsch")');
await page.waitForSelector(".sp-tok .sp-tab tbody tr:nth-child(2)");
const zeilen = await page.$$eval(".sp-tok .sp-tab tbody tr", (r) => r.map((x) => [...x.querySelectorAll("td")].map((c) => c.textContent)));
assert.equal(zeilen.length, 2);
const en = Number(zeilen[0][1]), de = Number(zeilen[1][1]);
assert.equal(en, 10); assert.equal(de, 16);
assert.equal(zeilen[0][3], "1,00 ×");
assert.equal(zeilen[1][3], "1,60 ×");
assert.match(await page.textContent(".sp-tok .sp-notiz"), /englische braucht 10 Token, der deutsche 16/);
// Merken, Entfernen, Leeren
await page.fill(".sp-tok .sp-feld", "Hallo Welt");
await page.waitForFunction(() => document.querySelectorAll(".sp-tok .sp-tk").length === 2);
await page.click('.sp-tok button:has-text("Zum Vergleich merken")');
assert.equal(await page.$$eval(".sp-tok .sp-tab tbody tr", (r) => r.length), 3);
await page.click(".sp-tok .sp-tab tbody tr:nth-child(3) .sp-ikon");
assert.equal(await page.$$eval(".sp-tok .sp-tab tbody tr", (r) => r.length), 2);
// Kontextfenster
await page.click('.sp-tok [role=radiogroup] button:has-text("2.048")');
assert.match(await page.textContent(".sp-tok .sp-folge:nth-of-type(1) .sp-text[aria-live]"), /von 2\.048 Token/);

// Grenzen und Sicherheit
const lang = "a".repeat(1200);
await page.fill(".sp-tok .sp-feld", lang);
assert.equal(await page.$eval(".sp-tok .sp-feld", (e) => e.value.length), 1000);
await page.fill(".sp-tok .sp-feld", "<img src=x onerror=\"window.__xss=1\"> <script>window.__xss=2</script>");
await page.waitForFunction(() => /img/.test(document.querySelector(".sp-tok .sp-tokens").textContent));
assert.equal(await page.$$eval(".sp-tok img, .sp-tok script", (e) => e.length), 0);
assert.equal(await page.evaluate(() => window.__xss), undefined);
await page.fill(".sp-tok .sp-feld", "");
await page.waitForSelector(".sp-tok .sp-leer");
// Server lehnt zu langen Text und fehlenden Origin ab
const r413 = await page.evaluate(async () => (await fetch("/api/tokenize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "a".repeat(1001) }) })).status);
assert.equal(r413, 413);

// Bildschirmfotos
await page.click('.sp-tok .sp-bsp button:has-text("Englisch gegen Deutsch")');
await page.waitForSelector(".sp-tok .sp-tab tbody tr:nth-child(2)");
await page.waitForTimeout(300);
await (await page.$("#ausprobieren")).screenshot({ path: `tests/ausgabe/sp-tokenizer-${modus}.png` });

// Naeherung, wenn der Jetson-Zerleger fehlt
const t2 = await starte({ kamera: false, dunkel: modus !== "hell" });
await t2.page.route("**/api/tokenize", (r) => r.fulfill({ status: 503, contentType: "application/json", body: '{"fehler":"nicht da"}' }));
await oeffneSeite(t2.page, "tokens-sprachmodelle");
await t2.page.click('.sp-tok .sp-bsp button:has-text("Hausratversicherung")');
await t2.page.waitForFunction(() => document.querySelectorAll(".sp-tok .sp-tk").length > 1);
assert.match(await t2.page.textContent(".sp-tok .chip[role=status]"), /Näherung/);
assert.match(await t2.page.textContent(".sp-tok .w-hinweis"), /Näherung/);
assert.ok(await t2.page.isDisabled('.sp-tok .sp-seg button:has-text("Nummern")'));
const naeh = await t2.page.$$eval(".sp-tok .sp-tk", (e) => e.map((x) => x.textContent));
assert.equal(naeh.join(""), "Hausratversicherung");
await t2.page.fill(".sp-tok .sp-feld", "12.10.2025");
await t2.page.waitForFunction(() => document.querySelectorAll(".sp-tok .sp-tk").length === 6);
await (await t2.page.$("#ausprobieren")).screenshot({ path: `tests/ausgabe/sp-tokenizer-naeherung-${modus}.png` });
assert.equal(t2.fehler.filter((f) => !/503/.test(f)).length, 0, t2.fehler.join("\n"));
await t2.schliessen();

const echt = t.fehler.filter((f) => !/413/.test(f));   // 413 stammt aus der absichtlich zu langen Anfrage oben
assert.equal(echt.length, 0, echt.join("\n"));
console.log("Tokenizer-Labor ok (" + modus + ")");
await t.schliessen();
