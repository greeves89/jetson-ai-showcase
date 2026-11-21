// Bildsprache und Lesemodus: alle Bildtypen rendern, Schalter wirkt und bleibt nach Neuladen, "Mehr dazu" oeffnet und schliesst,
// Seitenwechsel raeumt auf, prefers-reduced-motion zeigt das statische Endbild, ungueltige Spezifikationen zerstoeren nichts.
// Aufruf:  LABOR_URL=https://<jetson>:8443 node tests/visuals-bildsprache.mjs
import assert from "node:assert/strict";
import { starte, oeffneSeite, URL_LABOR } from "./browser.mjs";

const TYPEN = ["ablauf", "kreis", "vergleich", "balken", "schichten", "raster", "zahlen", "zeitachse", "netz", "punkte", "matrix", "skala", "token", "quelle"];

/* ---- 1) alle Typen, Lesemodus, Aufklapper ---- */
{
  const t = await starte({ kamera: false });
  const { page, fehler } = t;
  await oeffneSeite(page, "visual-demo");
  for (const typ of TYPEN) {
    assert.ok((await page.locator(`figure.visual.vt-${typ}`).count()) >= 1, "Bildtyp fehlt: " + typ);
  }
  const ohneLabel = await page.$$eval("figure.visual", (fs) => fs.filter((f) => !f.getAttribute("aria-label")).length);
  assert.equal(ohneLabel, 0, "jedes Bild hat aria-label");
  assert.ok((await page.locator("figure.visual ul.v-alt li").count()) > 30, "Textalternative als Liste");
  // Texte der Bilder nie unter 14 px
  const klein = await page.$$eval("figure.visual .v-body *", (els) => els.filter((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 14).length);
  assert.equal(klein, 0, "Text im Bild unter 14 px");

  // Kompakt ist Standard
  assert.equal(await page.evaluate(() => window.KL.lesemodus), "kompakt");
  assert.equal(await page.getAttribute('.lesemodus button[data-modus="kompakt"]', "aria-pressed"), "true");
  assert.equal(await page.locator("details.mehr[open]").count(), 0, "in Kompakt alles zu");
  const sichtbarKompakt = (await page.innerText("#inhalt")).length;
  // Aufklapper per Tastatur
  const erste = page.locator("details.mehr > summary").first();
  await erste.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("details.mehr[open]").count(), 1, "Enter oeffnet");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("details.mehr[open]").count(), 0, "Enter schliesst");

  // Ausfuehrlich: alles offen, Zusammenfassung unsichtbar, mehr Text
  await page.click('.lesemodus button[data-modus="ausfuehrlich"]');
  assert.equal(await page.evaluate(() => window.KL.lesemodus), "ausfuehrlich");
  assert.equal(await page.locator("details.mehr:not([open])").count(), 0, "in Ausfuehrlich alles offen");
  assert.equal(await page.locator("details.mehr > summary").first().isVisible(), false, "Zusammenfassung unsichtbar");
  assert.ok((await page.innerText("#inhalt")).length > sichtbarKompakt, "Ausfuehrlich zeigt mehr Text");
  assert.equal(await page.getAttribute('.lesemodus button[data-modus="ausfuehrlich"]', "aria-pressed"), "true");

  // Pfeiltasten im Schalter
  await page.focus('.lesemodus button[data-modus="ausfuehrlich"]');
  await page.keyboard.press("ArrowLeft");
  assert.equal(await page.evaluate(() => window.KL.lesemodus), "kompakt");
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.evaluate(() => window.KL.lesemodus), "ausfuehrlich");

  // Wahl bleibt nach Neuladen und gilt auf anderen Seiten
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector("#inhalt h1");
  assert.equal(await page.evaluate(() => window.KL.lesemodus), "ausfuehrlich");
  await oeffneSeite(page, "karte");
  assert.equal(await page.evaluate(() => window.KL.lesemodus), "ausfuehrlich");
  assert.equal(await page.locator("details.mehr:not([open])").count(), 0);
  await page.click('.lesemodus button[data-modus="kompakt"]');
  assert.ok((await page.locator("section.abschnitt .kurz").count()) > 0, "kurz je Abschnitt (auch automatisch)");
  assert.equal(await page.locator("details.mehr[open]").count(), 0);

  // automatischer Kurztext: hoechstens 140 Zeichen, ohne Rohmarkierungen
  const kurz = await page.$$eval("section.abschnitt .kurz", (ps) => ps.map((p) => p.textContent));
  for (const k of kurz) { assert.ok(k.length <= 141, "kurz zu lang: " + k.length); assert.ok(!/\[\[|\{\{|\*\*/.test(k), "Markierung im kurz: " + k); }

  // Seitenwechsel raeumt auf: mehrfach wechseln, keine Fehler, Animationen des alten Bildes sind weg
  await oeffneSeite(page, "visual-demo");
  await page.evaluate(() => { window.__figs = [...document.querySelectorAll("figure.visual")]; });
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.querySelector('#seite a.nav[href="/ml"]').click());
  await page.waitForFunction(() => location.pathname === "/ml");
  const laufende = await page.evaluate(() => window.__figs.reduce((n, f) => n + f.getAnimations({ subtree: true }).length, 0));
  assert.equal(laufende, 0, "nach dem Seitenwechsel laufen keine Animationen mehr");
  await page.goBack();
  await page.waitForSelector("figure.visual");
  await page.waitForTimeout(800);
  assert.deepEqual(fehler, [], "Konsolenfehler: " + fehler.join("; "));
  await t.schliessen();
}

/* ---- 2) reduzierte Bewegung: statisches Endbild ---- */
{
  const t = await starte({ kamera: false });
  const ctx = await t.browser.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${URL_LABOR}/#/visual-demo`, { waitUntil: "load" });
  await page.waitForSelector("figure.visual");
  for (const f of await page.$$("figure.visual")) { await f.scrollIntoViewIfNeeded(); }
  await page.waitForTimeout(800);
  const anim = await page.evaluate(() => document.getAnimations().filter((a) => a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest("figure.visual")).length);
  assert.equal(anim, 0, "bei reduzierter Bewegung keine Animation");
  const versteckt = await page.$$eval("figure.visual .v-body *", (els) => els.filter((e) => e.style && (e.style.opacity === "0" || e.style.width === "0%")).length);
  assert.equal(versteckt, 0, "Endbild sofort sichtbar");
  await t.schliessen();
}

/* ---- 3) Robustheit: ungueltige Spezifikationen ---- */
{
  const t = await starte({ kamera: false });
  const { page, fehler } = t;
  await oeffneSeite(page, "start");
  const r = await page.evaluate(() => {
    const KL = window.KL;
    const schlecht = [null, 5, "x", {}, { typ: "gibtsnicht" }, { typ: "ablauf" }, { typ: "ablauf", schritte: "x" }, { typ: "balken", zeilen: [{ label: "a", wert: "abc" }] },
      { typ: "netz", knoten: [{ id: "a" }] }, { typ: "quelle", src: "https://example.com/x.png", alt: "x" }, { typ: "punkte", klassen: [{ name: "a" }] },
      { typ: "matrix", x: [], y: [], zellen: [] }, [null, { typ: "zzz" }]];
    const ergebnisse = schlecht.map((s) => { try { return KL.visual(s) === null; } catch (e) { return "wirft: " + e.message; } });
    const xss = KL.visual({ typ: "ablauf", schritte: [{ icon: "camera", text: "<img src=x onerror=window.__xss=1>" }, { icon: "../x", text: "b" }] });
    document.body.append(xss);
    return { ergebnisse, xss: !!window.__xss, bilder: document.querySelectorAll("img").length, text: xss.textContent.includes("<img") };
  });
  assert.ok(r.ergebnisse.every((x) => x === true), "ungueltige Spezifikationen liefern null: " + JSON.stringify(r.ergebnisse));
  assert.equal(r.xss, false, "kein HTML aus Spezifikationstexten");
  assert.equal(r.text, true, "Text erscheint als Text");
  assert.deepEqual(fehler, [], "Konsolenfehler: " + fehler.join("; "));
  await t.schliessen();
}
console.log("visuals-bildsprache: ok");
