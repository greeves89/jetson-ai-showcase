// node tests/suche-tasten.mjs: Suche per Tastatur und Treffer (Runde 5).
//   Enter oeffnet den ersten Treffer, Pfeiltasten waehlen (aria-activedescendant), Escape schliesst und leert;
//   "Entscheidungshilfe" fuehrt auf betrieb-entscheidung; "Oberstufe" und "Abitur" bieten den Pfad oberstufe an.
import { starte, URL_LABOR } from "./browser.mjs";
let schlecht = 0;
const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) { schlecht++; process.exitCode = 1; } };
const t = await starte({ kamera: false, dunkel: false });
const { page } = t;
const frisch = async () => { await page.goto(URL_LABOR + "/", { waitUntil: "load" }); await page.waitForSelector("#nav-suche"); await page.waitForTimeout(500); };
const pfad = () => new URL(page.url()).pathname;

await frisch();
await page.fill("#nav-suche", "Entscheidungshilfe");
await page.waitForTimeout(300);
const ersterTreffer = await page.evaluate(() => { const a = [...document.querySelectorAll("#nav-liste a.nav")].find((x) => !x.closest("[hidden]") && !x.hidden); return a && a.dataset.id; });
pruefe(ersterTreffer === "betrieb-entscheidung", "Suche Entscheidungshilfe: erster Treffer ist betrieb-entscheidung (" + ersterTreffer + ")");
await page.keyboard.press("Enter");
await page.waitForFunction(() => location.pathname === "/betrieb-entscheidung", null, { timeout: 5000 }).catch(() => {});
pruefe(pfad() === "/betrieb-entscheidung", "Enter öffnet den ersten Treffer: " + pfad());

for (const wort of ["Oberstufe", "Abitur"]) {
  await frisch();
  await page.fill("#nav-suche", wort);
  await page.waitForTimeout(300);
  const link = await page.evaluate(() => { const a = document.querySelector("#such-ergebnis a.such-pfad-link"); return a ? a.dataset.pfad : null; });
  pruefe(link === "oberstufe", wort + " zeigt den Pfad oberstufe (" + link + ")");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(800);
  pruefe(/pfad=oberstufe/.test(page.url()), wort + ": Enter startet den Pfad: " + page.url().replace(URL_LABOR, ""));
}

// Pfeiltasten und aria-activedescendant
await frisch();
await page.fill("#nav-suche", "Chat");
await page.waitForTimeout(300);
await page.keyboard.press("ArrowDown");
await page.keyboard.press("ArrowDown");
const aktiv = await page.evaluate(() => { const i = document.querySelector("#nav-suche"); const id = i.getAttribute("aria-activedescendant"); const el = id && document.getElementById(id); return { id, markiert: !!el && el.classList.contains("nav-aktiv"), href: el && el.getAttribute("href") }; });
pruefe(!!aktiv.id && aktiv.markiert, "Pfeil runter setzt aria-activedescendant und markiert den Treffer: " + aktiv.id);
await page.keyboard.press("ArrowUp");
const aktiv2 = await page.evaluate(() => document.querySelector("#nav-suche").getAttribute("aria-activedescendant"));
pruefe(aktiv2 && aktiv2 !== aktiv.id, "Pfeil hoch wählt den vorigen Treffer: " + aktiv2);
await page.keyboard.press("ArrowDown");
const ziel = await page.evaluate(() => { const id = document.querySelector("#nav-suche").getAttribute("aria-activedescendant"); const el = document.getElementById(id); return el && el.getAttribute("href"); });
await page.keyboard.press("Enter");
await page.waitForTimeout(800);
pruefe(ziel && pfad() === ziel.split("?")[0], "Enter öffnet den gewählten Treffer: " + ziel + " -> " + pfad());

// Escape
await frisch();
await page.fill("#nav-suche", "Prompt");
await page.waitForTimeout(300);
await page.keyboard.press("Escape");
await page.waitForTimeout(200);
pruefe(await page.inputValue("#nav-suche") === "" && await page.getAttribute("#nav-suche", "aria-expanded") === "false", "Escape leert die Suche und schließt die Treffer");
pruefe(t.fehler.length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
await t.schliessen();
console.log(schlecht ? schlecht + " Fehler" : "alles ok");
