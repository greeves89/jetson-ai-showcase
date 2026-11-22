// node tests/start-menue.mjs: Startseite, Menue und Willkommens-Fenster.
//   Hier anfangen oeffnet Schritt 1; Zeitsumme der Reihe "In 15 Minuten" wird aus den Seiten gerechnet (ueber 15: "In ca. N Minuten");
//   Rollenzeile mit sechs Chips ohne Willkommens-Fenster; Willkommens-Fenster und Menue bleiben bei Adresswechsel nicht offen;
//   Seitenleiste: gleiche Ueberschrift mit und ohne Rolle, Gruppen stabil, "Ist das sicher?" als letzter Eintrag fuer Eltern, Betrieb, Schule.
import { starte, URL_LABOR, oeffneSeite } from "./browser.mjs";
let schlecht = 0;
const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) { schlecht++; process.exitCode = 1; } };

/* ---- 1. Startseite ohne Rolle */
{
  const t = await starte({ kamera: false, dunkel: false });
  const { page } = t;
  await oeffneSeite(page, "start");
  const chips = await page.$$eval("#rollen-zeile .rollen-chip", (c) => c.map((x) => x.textContent.trim()));
  pruefe(chips.length === 6, "Rollenzeile mit sechs Chips direkt unter der Überschrift: " + chips.join(" | "));
  pruefe(await page.evaluate(() => { const r = document.querySelector("#rollen-zeile").getBoundingClientRect(), h = document.querySelector("h1").getBoundingClientRect(); return r.top > h.bottom && r.top < 560; }), "Rollenzeile steht ohne Scrollen sichtbar (Desktop)");
  const ziel = await page.$eval("#einstiege a:has-text('Hier anfangen')", (a) => a.getAttribute("href"));
  await page.click("#einstiege a:has-text('Hier anfangen')");
  await page.waitForFunction((z) => location.pathname === z, ziel, { timeout: 8000 });
  pruefe(await page.evaluate(() => !!document.querySelector("#inhalt h1") && !document.querySelector("#rollen-zeile")), "Hier anfangen öffnet Schritt 1 (" + ziel + ") statt nur zu scrollen");
  // Zeitsumme der Reihe wird aus den Seiten gerechnet
  const zeit = async () => {
    const meta = (await page.textContent("#einstiege .karte:nth-child(2) .karte-meta")).replace(/ /g, " ");
    const lesen = +(/ca\. (\d+) Min Lesen/.exec(meta) || [0, 0])[1], v = /Video (\d+):(\d+)/.exec(meta), labor = +(/Labor ca\. (\d+) Min/.exec(meta) || [0, 0])[1];
    const titel = (await page.textContent("#einstiege .karte:nth-child(2) .karte-titel")).trim();
    return { summe: lesen + (v ? Math.round((+v[1] * 60 + +v[2]) / 60) : 0) + labor, titel };
  };
  await oeffneSeite(page, "start");
  let z = await zeit();
  pruefe(z.summe <= 15 ? z.titel === "In 15 Minuten" : z.titel === "In ca. " + z.summe + " Minuten", `Titel passt zur Summe der Seiten (${z.summe} Min): "${z.titel}"`);
  await page.evaluate(() => { const ids = Object.keys(window.KL.INHALT.seiten).filter((i) => !["start"].includes(i)).slice(0, 12); window.KL.INHALT.seiten.start.entscheider.schritte = ids.map((id) => ({ id, h: id })); });
  await page.evaluate(() => { history.pushState({ y: 0, i: 1 }, "", "/karte"); dispatchEvent(new PopStateEvent("popstate", { state: history.state })); }); await page.waitForTimeout(300);
  await page.click("a.nav[data-id='start']"); await page.waitForSelector("#einstiege");
  await page.waitForTimeout(800);
  z = await zeit();
  pruefe(z.summe > 15 && z.titel === "In ca. " + z.summe + " Minuten", `lange Reihe: Titel nennt die gerechnete Summe statt 15 ("${z.titel}", Summe ${z.summe})`);
  await page.evaluate(() => window.KL.wegWaehlen(null));          // Menü neu aufbauen
  pruefe(/In ca\. \d+ Minuten/.test(await page.textContent("#seite")), "auch der Eintrag im Menü nennt die Summe");
  pruefe(t.fehler.length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
  await t.schliessen();
}

/* ---- 2. Willkommens-Fenster und Menue bei Adresswechsel */
{
  const t = await starte({ kamera: false, willkommen: true, breite: 390, hoehe: 844 });
  const { page } = t;
  await page.goto(`${URL_LABOR}/?willkommen=1`, { waitUntil: "load" });
  await page.waitForSelector("dialog.wk[open]", { timeout: 8000 });
  pruefe(true, "Willkommens-Fenster ist offen");
  await page.evaluate(() => { history.pushState({ y: 0, i: 1 }, "", "/karte"); dispatchEvent(new PopStateEvent("popstate", { state: history.state })); });
  await page.waitForFunction(() => !document.querySelector("dialog.wk"), null, { timeout: 5000 });
  pruefe(await page.evaluate(() => !document.querySelector("dialog[open]") && location.pathname === "/karte"), "Adresswechsel (popstate) schließt das Fenster");
  // Hash-Wechsel (das Fenster gilt nach dem Schließen als gesehen: für den zweiten Durchlauf zurücksetzen)
  await page.evaluate(() => { localStorage.removeItem("kl-willkommen"); });
  await page.goto(`${URL_LABOR}/?willkommen=1`, { waitUntil: "load" });
  await page.waitForSelector("dialog.wk[open]", { timeout: 8000 });
  await page.evaluate(() => { location.hash = "#/ml"; });
  await page.waitForFunction(() => !document.querySelector("dialog.wk"), null, { timeout: 5000 });
  pruefe(await page.evaluate(() => location.pathname === "/ml"), "Link mit Hash (#/ml) schließt das Fenster und öffnet die Seite");
  // Menue
  await oeffneSeite(page, "karte");
  await page.click(".menueknopf");
  pruefe(await page.evaluate(() => document.body.classList.contains("menue-offen")), "Menü ist offen");
  await page.evaluate(() => { history.pushState({ y: 0, i: 2 }, "", "/ml"); dispatchEvent(new PopStateEvent("popstate", { state: history.state })); });
  await page.waitForFunction(() => !document.body.classList.contains("menue-offen"), null, { timeout: 5000 });
  pruefe(true, "Adresswechsel schließt das Menü");
  await page.click(".menueknopf");
  await page.evaluate(() => { location.hash = "#/genki"; });
  await page.waitForFunction(() => !document.body.classList.contains("menue-offen") && location.pathname === "/genki", null, { timeout: 5000 });
  pruefe(true, "Hash-Link schließt das Menü");
  pruefe(t.fehler.length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
  await t.schliessen();
}

/* ---- 3. Seitenleiste: stabil, Ist das sicher? zuletzt */
{
  const t = await starte({ kamera: false, dunkel: false });
  const { page } = t;
  const gruppen = () => page.$$eval(".nav-alle-inhalt .navgruppe:not([hidden]) .navkopf span", (s) => s.map((x) => x.textContent.replace(/\d+\s*$/, "").trim()).filter(Boolean));
  await page.goto(`${URL_LABOR}/`, { waitUntil: "load" }); await page.waitForSelector(".nav-fuerdich");
  const titelOhne = await page.textContent(".nav-fuerdich .nav-titel");
  const ohne = (await gruppen());
  await page.goto(`${URL_LABOR}/?weg=beruf`, { waitUntil: "load" }); await page.waitForSelector(".nav-fuerdich");
  const titelMit = await page.textContent(".nav-fuerdich .nav-titel");
  pruefe(titelOhne === "Für dich" && titelMit === "Für dich", "gleiche Überschrift mit und ohne Rolle");
  const mit = await gruppen();
  const gemeinsam = ohne.filter((n) => mit.includes(n));
  pruefe(gemeinsam.length >= 8 && JSON.stringify(gemeinsam) === JSON.stringify(mit.filter((n) => ohne.includes(n))), "Reihenfolge der Gruppen in Alle Bereiche ist mit und ohne Rolle gleich (" + gemeinsam.length + " gemeinsame Gruppen)");
  pruefe(await page.locator(".nav-fuerdich a.nav[data-id='start']").count() === 1, "Start bleibt der erste Eintrag");
  for (const [weg, soll] of [["eltern", true], ["beruf", true], ["schule", true], ["lehrende", false], ["technik", false]]) {
    await page.goto(`${URL_LABOR}/?weg=${weg}`, { waitUntil: "load" }); await page.waitForSelector(".nav-fuerdich a.nav");
    const ids = await page.$$eval(".nav-fuerdich a.nav", (a) => a.map((x) => x.dataset.id));
    const letzte = ids[ids.length - 1];
    pruefe(soll ? letzte === "sicherheit-einfach" && ids.length <= 15 : letzte !== "sicherheit-einfach" || ids.length > 0, `Rolle ${weg}: letzter Eintrag in "Für dich": ${letzte}` + (soll ? " (Ist das sicher?)" : ""));
  }
  await t.schliessen();
}
console.log(schlecht ? `\n${schlecht} Fehler` : "\nalles ok");
