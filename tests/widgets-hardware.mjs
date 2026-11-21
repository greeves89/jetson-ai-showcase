// Hardware: Ringe, Satz, Verlauf und Modellliste. Echte Werte vom Jetson plus drei gespielte Lagen (Mock per Route).
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
const dunkel = process.argv[2] !== "hell";
const lage = { ram_mb: 4783, ram_max_mb: 7620, swap_mb: 0, swap_max_mb: 0, gpu_pct: 0, cpu_pct: 3, temp_c: 54.2, power_w: 5.4, frisch: true, modelle_geladen: ["llama3.2:3b"] };
const t = await starte({ kamera: false, dunkel });
const { page } = t;
let mock = null;
await page.route("**/api/stats", (route) => { if (!mock) return route.continue(); return route.fulfill({ contentType: "application/json", body: JSON.stringify(mock) }); });
await oeffneSeite(page, "hardware");
await page.waitForTimeout(2200);
// 1. echte Werte
const ringe = await page.$$eval(".w-hw .ring", (r) => r.map((e) => [e.getAttribute("aria-label"), e.style.getPropertyValue("--p")]));
console.log("echt:", JSON.stringify(ringe));
assert.equal(ringe.length, 4);
assert.ok(ringe.every((r) => /^(GPU|Speicher|CPU|Leistung) \d/.test(r[0])));
assert.match(await page.textContent(".w-temp .w-tempz"), /^\d+,\d °C$/);
assert.match(await page.textContent(".w-hw .ring:nth-child(2) small"), /^\d+,\d von \d+,\d GB$/);
assert.ok((await page.textContent(".jetztsatz")).length > 30);
assert.ok((await page.getAttribute(".w-chart path.w-linie-g", "d")).startsWith("M"));
assert.ok(!/\d\.\d/.test(await page.textContent(".w-hw .ringe")), "Zahlen mit Komma, nie mit Punkt");
assert.ok(!/\d\.\d/.test((await page.textContent(".jetztsatz")).replace(/llama3\.2:3b/g, "")));
// 2. Leerlauf
mock = { ...lage };
await page.waitForTimeout(2000);
let s = await page.textContent(".jetztsatz");
console.log("Leerlauf:", s);
assert.match(s, /ruht/); assert.match(s, /llama3\.2:3b liegt im Speicher/);
assert.equal(await page.textContent(".w-hw .ring:nth-child(1) .kreis b"), "0 %");
assert.equal(await page.textContent(".w-hw .ring:nth-child(4) .kreis b"), "5,4 W");
// 3. GPU rechnet, Speicher knapp, heiss, kein Modell-HTML
mock = { ...lage, gpu_pct: 93, cpu_pct: 41, power_w: 17.3, ram_mb: 7200, temp_c: 78.4, modelle_geladen: ["<img src=x onerror=window.__x=1>:7b"] };
await page.waitForTimeout(2000);
s = await page.textContent(".jetztsatz");
console.log("Last:", s);
assert.match(s, /rechnet gerade mit voller Kraft/); assert.match(s, /Speicher ist zu 94 Prozent voll/); assert.match(s, /78,4 Grad/);
assert.equal(await page.$$eval(".w-modelle img", (e) => e.length), 0, "Modellname nur als Text");
assert.equal(await page.evaluate(() => window.__x), undefined);
assert.ok(await page.$eval(".w-hw .ring:nth-child(2)", (e) => e.classList.contains("warn")), "Speicherring warnt");
await page.locator("#ausprobieren").screenshot({ path: `tests/ausgabe/wb-hardware-${dunkel ? "dunkel" : "hell"}-last.png` });
// 4. kein Modell
mock = { ...lage, modelle_geladen: [], gpu_pct: 30 };
await page.waitForTimeout(2000);
assert.match(await page.textContent(".w-modelle"), /kein Modell/);
// Verlauf wuchs
const n = await page.$eval(".w-chart path.w-linie-g", (p) => p.getAttribute("d").split("L").length);
assert.ok(n >= 4, "Verlauf hat Punkte: " + n);
t.fehler = t.fehler.filter((f) => !f.includes("ERR_ABORTED"));
console.log("hardware: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
