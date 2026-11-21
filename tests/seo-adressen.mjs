// Echte Adressen: Klick-Navigation ohne Neuladen, Zurueck/Vor, alte #/-Links, Abfrage, Direktaufruf, Fusszeile, Titel, Fokus.
// Aufruf:  LABOR_URL=https://<jetson>:8443 node tests/seo-adressen.mjs [hell]
import assert from "node:assert/strict";
import { starte, URL_LABOR } from "./browser.mjs";

const t = await starte({ dunkel: process.argv[2] !== "hell", kamera: false });
const { page } = t;
const pfad = () => page.evaluate(() => location.pathname + location.search + location.hash);
const h1 = () => page.textContent("#inhalt h1");
const warteAuf = (p) => page.waitForFunction((x) => location.pathname === x, p);
const kopf = async (u) => { await page.goto(URL_LABOR + u, { waitUntil: "load" }); await page.waitForSelector("#inhalt h1"); await page.waitForTimeout(250); };

// 1) Startseite, Fusszeile, Titel
await kopf("/");
assert.equal(await pfad(), "/");
assert.match(await page.title(), /^KI verstehen, indem du sie ausprobierst · KI-Labor$/);
const fuss = await page.textContent("#fuss");
assert.match(fuss, /Ein Projekt von Daniel Alisch/);
assert.equal(await page.getAttribute('#fuss a[rel="author"]', "href"), "https://daniel-alisch.site");
assert.match(fuss, /Lernprojekt/);
assert.equal(await page.locator("#fuss").isVisible(), true);
assert.equal(await page.locator("#fuss >> text=Impressum").count(), 0, "Impressum nur mit gesetzter Adresse");
assert.ok((await page.locator("#seite a.nav").count()) > 40, "Navigation mit echten Links");

// 2) Klick in der Seitenleiste: Adresse aendert sich, kein Neuladen
await page.evaluate(() => { window.__marke = 42; });
await page.click('#seite a.nav[href="/rag-embedding"]');
await warteAuf("/rag-embedding");
assert.equal(await page.evaluate(() => window.__marke), 42, "kein Neuladen");
assert.equal(await h1(), "Vektorisieren und Embeddings");
assert.equal(await page.title(), "Vektorisieren und Embeddings · KI-Labor");
assert.equal(await page.getAttribute('#seite a.nav[aria-current="page"]', "href"), "/rag-embedding");
assert.equal(await page.evaluate(() => document.activeElement && document.activeElement.id), "inhalt", "Fokus im Inhalt");

// 3) Zurueck und Vor
await page.goBack();
await warteAuf("/");
assert.equal(await page.evaluate(() => window.__marke), 42, "Zurueck ohne Neuladen");
assert.match(await page.title(), /^KI verstehen/);
await page.goForward();
await warteAuf("/rag-embedding");
assert.equal(await h1(), "Vektorisieren und Embeddings");

// 4) Alter Link im Inhalt (href="#/id") wird abgefangen
const alt = page.locator('#inhalt a[href^="#/"]').first();
const ziel = (await alt.getAttribute("href")).slice(1).split("?")[0];
await alt.click();
await warteAuf(ziel);
assert.equal(await page.evaluate(() => location.hash), "", "Hash bleibt leer");
assert.equal(await page.evaluate(() => window.__marke), 42, "Inhaltslink ohne Neuladen");

// 5) Tastatur: Link fokussieren, Enter
await page.focus('#seite a.nav[href="/karte"]');
await page.keyboard.press("Enter");
await warteAuf("/karte");
assert.equal(await h1(), "Was ist KI?");

// 6) Scrollposition: wiederherstellen beim Zurueck
await page.evaluate(() => window.scrollTo(0, 500));
const y0 = await page.evaluate(() => window.scrollY);
await page.click('#seite a.nav[href="/ml"]');
await warteAuf("/ml");
assert.equal(await page.evaluate(() => window.scrollY), 0, "neue Seite beginnt oben");
await page.goBack();
await warteAuf("/karte");
await page.waitForTimeout(200);
if (y0 > 0) assert.ok(Math.abs((await page.evaluate(() => window.scrollY)) - y0) < 40, "Scrollposition zurueck");

// 7) Alte Lesezeichen und location.hash werden umgeleitet, Abfrage bleibt
await kopf("/#/rag-suche");
assert.equal(await pfad(), "/rag-suche");
assert.match(await h1(), /^Suchen/);
await kopf("/#/anlernen?beispiel=fertigung-teile");
assert.equal(await pfad(), "/anlernen?beispiel=fertigung-teile");
await page.evaluate(() => { location.hash = "#/hardware"; });
await warteAuf("/hardware");
assert.equal(await pfad(), "/hardware");
await kopf("/#/gibt-es-nicht");
assert.equal(await pfad(), "/", "unbekannte alte Adresse landet auf der Startseite");
// Abfrage in der echten Adresse
await kopf("/anlernen?beispiel=fertigung-teile");
assert.equal(await pfad(), "/anlernen?beispiel=fertigung-teile");
assert.match(await h1(), /nlern/);
// Schreibweisen
await kopf("/karte/");
assert.equal(await pfad(), "/karte");
await kopf("/start");
assert.equal(await pfad(), "/");

// 8) Direktaufruf, Titel je Seite verschieden
const titel = new Set();
for (const id of ["karte", "chat", "rag", "hardware", "whisper"]) {
  await kopf("/" + id);
  assert.equal(await pfad(), "/" + id);
  titel.add(await page.title());
}
assert.equal(titel.size, 5, "Titel je Seite verschieden");
assert.equal(await page.locator("#fuss").isVisible(), true);

// 9) Unbekannte Adresse: 404 mit freundlicher Seite
const vor404 = t.fehler.length;
const antwort = await page.goto(URL_LABOR + "/gibt-es-nicht", { waitUntil: "load" });
assert.equal(antwort.status(), 404);
await page.waitForSelector("#inhalt h1");
assert.equal(await h1(), "Seite nicht gefunden");
assert.match(await page.title(), /^Seite nicht gefunden/);
t.fehler.length = vor404;   // die Konsolenmeldung zum absichtlichen 404 ist erwartet
await page.click("#inhalt a[href='/']");
await warteAuf("/");
assert.match(await h1(), /KI verstehen/);

t.fehler = t.fehler.filter((f) => !f.includes("ERR_ABORTED"));
console.log("seo-adressen: ok", t.fehler.length ? "FEHLER " + t.fehler : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
