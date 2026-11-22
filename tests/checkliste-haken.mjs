// node tests/checkliste-haken.mjs: Haken der Checkliste (Seite betrieb-entscheidung) bleiben beim Neuladen.
//   Ohne "Fortschritt merken" (kl-merken) nur in der Sitzung (sessionStorage, nichts in localStorage), mit Einwilligung in localStorage;
//   "Aus" leert die dauerhaften Haken. Ein neuer Browserkontext sieht ohne Einwilligung nie fremde Haken.
import { starte, oeffneSeite } from "./browser.mjs";
let schlecht = 0;
const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) { schlecht++; process.exitCode = 1; } };
const gesetzt = (page) => page.$$eval('[data-testid="checkliste"] input', (l) => l.map((i, k) => (i.checked ? k : -1)).filter((k) => k >= 0));
const haken = (page, i) => page.locator('[data-testid="checkliste"] label').nth(i).click();
const speicher = (page) => page.evaluate(() => ({ lokal: Object.keys(localStorage).filter((k) => k.startsWith("kl-haken-")), sitzung: Object.keys(sessionStorage).filter((k) => k.startsWith("kl-haken-")).map((k) => [k, sessionStorage.getItem(k)]) }));

/* ---- 1. ohne Einwilligung: nur in der Sitzung */
{
  const t = await starte({ kamera: false });
  const { page } = t;
  await oeffneSeite(page, "betrieb-entscheidung");
  await page.waitForSelector('[data-testid="checkliste"] input');
  pruefe((await gesetzt(page)).length === 0, "Start: nichts abgehakt");
  await haken(page, 0); await haken(page, 2);
  pruefe(/2 von \d+ Fragen geklärt/.test(await page.textContent(".pg-notiz[role=status]")), "Zähler: 2 Fragen geklärt");
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-testid="checkliste"] input');
  await page.waitForTimeout(300);
  pruefe(JSON.stringify(await gesetzt(page)) === "[0,2]", "nach dem Neuladen stehen die Haken noch (Sitzung): " + JSON.stringify(await gesetzt(page)));
  const sp = await speicher(page);
  pruefe(sp.lokal.length === 0 && sp.sitzung.length === 1, "ohne Einwilligung nichts in localStorage, nur sessionStorage: " + JSON.stringify(sp));
  pruefe(/solange dieser Tab offen ist/.test(await page.textContent(".pg-speicher")), "Hinweis sagt ehrlich, wie lange: " + (await page.textContent(".pg-speicher")).trim().slice(0, 80));
  // Haken wieder weg
  await haken(page, 0);
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-testid="checkliste"] input');
  pruefe(JSON.stringify(await gesetzt(page)) === "[2]", "Abhaken wird ebenfalls gemerkt");
  // anderes Fenster (neuer Kontext): leer
  const t2 = await starte({ kamera: false });
  await oeffneSeite(t2.page, "betrieb-entscheidung");
  await t2.page.waitForSelector('[data-testid="checkliste"] input');
  pruefe((await gesetzt(t2.page)).length === 0, "ein anderer Browser sieht keine Haken");
  await t2.schliessen();
  pruefe(t.fehler.length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
  await t.schliessen();
}

/* ---- 2. mit "Fortschritt merken": dauerhaft in diesem Browser, Aus leert */
{
  const t = await starte({ kamera: false });
  const { page } = t;
  await page.addInitScript(() => { try { if (!sessionStorage.getItem("kl-test-init")) { localStorage.setItem("kl-merken", "1"); sessionStorage.setItem("kl-test-init", "1"); } } catch (e) { /* egal */ } });
  await oeffneSeite(page, "betrieb-entscheidung");
  await page.waitForSelector('[data-testid="checkliste"] input');
  await haken(page, 1); await haken(page, 4);
  let sp = await speicher(page);
  pruefe(sp.lokal.length === 1 && JSON.stringify(sp.sitzung.map((x) => x[1])) === '["[]"]', "mit Einwilligung liegen die Haken in localStorage: " + JSON.stringify(sp));
  pruefe(/solange „Fortschritt merken“ an ist/.test(await page.textContent(".pg-speicher")), "Hinweis: bleibt in diesem Browser");
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-testid="checkliste"] input');
  pruefe(JSON.stringify(await gesetzt(page)) === "[1,4]", "nach dem Neuladen stehen die Haken noch");
  // neuer Tab (frische Sitzung) im selben Kontext: noch da
  const seite2 = await page.context().newPage();
  await seite2.goto(page.url(), { waitUntil: "load" });
  await seite2.waitForSelector('[data-testid="checkliste"] input');
  pruefe(JSON.stringify(await gesetzt(seite2)) === "[1,4]", "ein neuer Tab desselben Browsers sieht sie auch");
  await seite2.close();
  // Merken ausschalten: dauerhafte Haken weg
  await page.evaluate(() => window.KL.merkenSetzen(false));
  sp = await speicher(page);
  pruefe(sp.lokal.length === 0, "Fortschritt merken aus leert die dauerhaften Haken: " + JSON.stringify(sp.lokal));
  pruefe(/solange dieser Tab offen ist/.test(await page.textContent(".pg-speicher")), "Hinweis wechselt auf Sitzung");
  pruefe(JSON.stringify(await gesetzt(page)) === "[1,4]", "auf dem Bildschirm bleibt der Stand bis zum Neuladen");
  sp = await speicher(page);
  pruefe(sp.sitzung.some((x) => x[1] === "[1,4]"), "und gilt weiter für diese Sitzung");
  // Merken wieder an: Stand wird dauerhaft geschrieben
  await page.evaluate(() => window.KL.merkenSetzen(true));
  sp = await speicher(page);
  pruefe(sp.lokal.length === 1, "Merken wieder an schreibt den sichtbaren Stand dauerhaft");
  pruefe(t.fehler.length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
  await t.schliessen();
}
console.log(schlecht ? `\n${schlecht} Fehler` : "\nalles ok");
