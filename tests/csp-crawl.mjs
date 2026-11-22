import { starte, URL_LABOR } from "./browser.mjs";
import { readdirSync } from "node:fs";
const ids = ["objekt","gesicht","anlernen","faceswap","whisper","sprachausgabe","genki","bild","echt-oder-ki","visual-demo","chat","rag","agent","karte","anomalien","zeitreihen"];
const { page, kontext, schliessen } = await starte({});
const v = new Set();
await kontext.addInitScript(() => { window.__csp = []; document.addEventListener("securitypolicyviolation", e => window.__csp.push(e.violatedDirective + " " + e.blockedURI + " " + (e.sample||"").slice(0,60))); });
page.on("console", m => { if (/Content.Security|Report Only|Refused/i.test(m.text())) v.add("console: " + m.text().slice(0, 220)); });
async function sammle() { const l = await page.evaluate(() => window.__csp.splice(0)).catch(() => []); l.forEach(x => v.add(x)); }
for (const id of ids) {
  for (const url of [`${URL_LABOR}/#/${id}`, `${URL_LABOR}/${id}`]) {
    try {
      await page.goto(url, { waitUntil: "load" });
      await page.waitForTimeout(700);
      const knoepfe = await page.$$("#inhalt button:visible");
      for (const b of knoepfe.slice(0, 30)) { try { await b.click({ timeout: 800 }); await page.waitForTimeout(150); } catch {} }
      await sammle();
    } catch (e) { console.log("seitenfehler", id, e.message.slice(0, 80)); }
  }
}
console.log(ids.length, "Seiten; Verstöße:", v.size); [...v].forEach(x => console.log(x));
await schliessen();
