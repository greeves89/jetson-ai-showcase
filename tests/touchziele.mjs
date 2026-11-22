// node tests/touchziele.mjs: Touch-Ziele (Handy 390x844 und Tablet 820x1180, mit Touch): jedes sichtbare, bedienbare Element
//   (Link, Knopf, Auswahl, Eingabe, Aufklapper, Beschriftung) hat mindestens 44x44 Pixel Trefferflaeche.
//   Ausnahmen: Links mitten im Fliesstext (Satzteil, WCAG 2.5.8 "Inline") und versteckte Hilfselemente. Ein Auswahlfeld in einer
//   Beschriftung zaehlt mit der Flaeche der Beschriftung.
//   LABOR_URL wie in browser.mjs.
import { chromium } from "playwright-core";
import { URL_LABOR } from "./browser.mjs";

const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SEITEN = ["/", "/karte", "/echt-oder-ki", "/schule-stunde-1", "/chat", "/ml", "/sicherheit-einfach", "/schule-lehrkraefte", "/lizenzen", "/prompting"];
const GERAETE = [{ name: "Handy 390", w: 390, h: 844 }, { name: "Tablet 820", w: 820, h: 1180 }];
let schlecht = 0;

const messen = () => {
  const sichtbar = (e) => {
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const s = getComputedStyle(e);
    if (s.visibility === "hidden" || s.display === "none" || s.opacity === "0") return false;
    return !e.closest("[hidden],[inert],.sr-nur,.skip");
  };
  const imText = (e) => {       // Link mitten im Satz
    if (e.tagName !== "A") return false;
    const p = e.parentElement;
    if (!p) return false;
    const s = getComputedStyle(e);
    if (s.display !== "inline") return false;
    return /^(P|LI|SPAN|SMALL|TD|DD)$/.test(p.tagName) && Array.from(p.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
  };
  const aus = [];
  for (const e of document.querySelectorAll("a[href],button,select,textarea,input:not([type=hidden]),summary,[role=button],[role=switch],[role=tab]")) {
    if (!sichtbar(e) || imText(e)) continue;
    let ziel = e;
    if (e.tagName === "INPUT" && /^(checkbox|radio)$/.test(e.type)) { const l = e.closest("label") || (e.id && document.querySelector('label[for="' + e.id + '"]')); if (l) ziel = l; }
    const r = ziel.getBoundingClientRect();
    if (r.height < 43.5 || (r.width < 43.5 && !(e.tagName === "A" && r.height >= 43.5))) {
      aus.push((ziel.tagName.toLowerCase() + (ziel.className && typeof ziel.className === "string" ? "." + ziel.className.split(" ")[0] : "") + " " + Math.round(r.width) + "x" + Math.round(r.height) + " \"" + (ziel.textContent || ziel.getAttribute("aria-label") || "").trim().slice(0, 28) + "\""));
    }
  }
  return aus;
};

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--ignore-certificate-errors"] });
for (const g of GERAETE) {
  const kontext = await browser.newContext({ viewport: { width: g.w, height: g.h }, hasTouch: true, isMobile: false, ignoreHTTPSErrors: true, colorScheme: "light" });
  await kontext.addInitScript(() => { try { localStorage.setItem("kl-willkommen", "1"); } catch (e) { /* egal */ } });
  const page = await kontext.newPage();
  for (const a of SEITEN) {
    await page.goto(URL_LABOR + a, { waitUntil: "load" });
    await page.waitForSelector("#inhalt h1", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);
    // Quiz, Aufklapper und Fuss sichtbar machen: Genau lesen klappt alles auf
    await page.evaluate(() => { const b = document.querySelector('.lesemodus button[data-modus="ausfuehrlich"]'); if (b) b.click(); });
    await page.waitForTimeout(150);
    const aus = await page.evaluate(messen);
    if (aus.length) { schlecht += aus.length; console.log("FEHLER " + g.name + " " + a + ": " + aus.length + " Ziele zu klein: " + aus.slice(0, 8).join(" | ")); process.exitCode = 1; }
  }
  await kontext.close();
}
await browser.close();
console.log(schlecht ? "touchziele: " + schlecht + " Ziele unter 44 px" : "touchziele: alles ok");
