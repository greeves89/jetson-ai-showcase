// Prueft alle Seiten auf leere Bilder (docs/visuals.md):
//   - Bild laut Seitendaten vorhanden, aber kein figure.visual gebaut (Spezifikation ungueltig, Warnung "KL.visual: ...")
//   - figure.visual ohne Text oder ohne Elemente (Raster ohne Zellen, Vergleich ohne Punkte, Ablauf ohne Schritte ...)
//   - Bild bleibt nach dem Durchscrollen unsichtbar (Deckkraft 0, Hoehe 0)
//   - Raster mit Zellen, die weder Text noch Icon haben
// Aufruf:  LABOR_URL=https://<jetson>:8443 node tests/visuals-leer.mjs [seite-id ...] [--ausfuehrlich] [--breite=390]
import { starte, oeffneSeite } from "./browser.mjs";

const args = process.argv.slice(2);
const ausfuehrlich = args.includes("--ausfuehrlich");
const breiteArg = args.find((a) => a.startsWith("--breite="));
const breite = breiteArg ? Number(breiteArg.slice(9)) : 1440;
const nurIds = args.filter((a) => !a.startsWith("--"));

const t = await starte({ kamera: false, breite, hoehe: breite < 600 ? 844 : 900 });
const { page } = t;
if (ausfuehrlich) await page.addInitScript(() => { try { localStorage.setItem("kl-lesemodus", "ausfuehrlich"); } catch (e) { /* egal */ } });
const warnungen = [];
page.on("console", (m) => { if (m.type() === "warning" && /KL\.visual/.test(m.text())) warnungen.push(m.text()); });

await page.goto(`${process.env.LABOR_URL || "https://localhost:8443"}/#/start`, { waitUntil: "load" });
await page.waitForSelector("#inhalt h1");
const alle = await page.evaluate(() => Object.keys(window.KL.INHALT.seiten));
const ids = nurIds.length ? nurIds : alle;
let probleme = 0;
const meld = (id, text) => { probleme++; console.log(`  [${id}] ${text}`); };

for (const id of ids) {
  warnungen.length = 0;
  await oeffneSeite(page, id);
  // Bilder starten beim Sichtbarwerden: Seite in Schritten durchlaufen
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 320)); }
    await new Promise((r) => setTimeout(r, 900));
  });
  const r = await page.evaluate((id) => {
    const sd = window.KL.INHALT.seiten[id] || {};
    const erwartet = [];
    const zaehle = (v, wo) => { (Array.isArray(v) ? v : v ? [v] : []).forEach((x) => erwartet.push(wo + " (" + (x && x.typ) + ")")); };
    (sd.abschnitte || []).forEach((a) => zaehle(a.visual, "Abschnitt \"" + a.h + "\""));
    const figs = [...document.querySelectorAll("#inhalt figure.visual")];
    const leer = [];
    figs.forEach((f, i) => {
      const name = f.className.replace("visual ", "") + " Nr. " + (i + 1) + (f.closest(".abschnitt") && f.closest(".abschnitt").querySelector("h2") ? " in \"" + f.closest(".abschnitt").querySelector("h2").innerText + "\"" : "");
      const body = f.querySelector(".v-body");
      if (!body) return leer.push(name + ": kein Bildkörper");
      if (f.classList.contains("vt-quelle")) {          // Foto: braucht ein geladenes Bild mit Textalternative
        const img = body.querySelector("img");
        if (!img || !img.complete || !img.naturalWidth) leer.push(name + ": Foto fehlt oder lädt nicht");
        else if (!(img.getAttribute("alt") || "").trim()) leer.push(name + ": Foto ohne Textalternative");
        return;
      }
      const text = (body.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) return leer.push(name + ": ohne Text");
      if (!body.querySelector("svg, .v-zelle, .v-st, .v-seite, .v-zk, .v-bal, li, .v-pkt, span, b")) return leer.push(name + ": ohne Elemente");
      const r = f.getBoundingClientRect();
      if (r.height < 40 || r.width < 40) return leer.push(name + ": Größe " + Math.round(r.width) + "x" + Math.round(r.height));
      if (f.classList.contains("vt-raster") && body.querySelectorAll(".v-zelle").length < 1) leer.push(name + ": Raster ohne Zellen");
      if (f.classList.contains("vt-vergleich")) {
        const seiten = body.querySelectorAll(".v-seite");
        if (seiten.length < 2 || [...seiten].some((s) => s.querySelectorAll("li").length < 1)) leer.push(name + ": Vergleich ohne Punkte");
      }
      const kinder = [...body.querySelectorAll(".v-zelle, .v-st, .v-seite li, .v-zk, .v-seite")];
      const unsichtbar = kinder.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.5);
      if (kinder.length && unsichtbar.length === kinder.length) leer.push(name + ": bleibt unsichtbar (Deckkraft 0)");
      else if (unsichtbar.length) leer.push(name + ": " + unsichtbar.length + " von " + kinder.length + " Teilen unsichtbar");
    });
    return { erwartet, gebaut: figs.length, leer };
  }, id);
  if (r.erwartet.length !== r.gebaut) meld(id, `${r.erwartet.length} Bilder in den Seitendaten, aber ${r.gebaut} gebaut`);
  for (const w of warnungen) meld(id, "Warnung: " + w.slice(0, 200));
  for (const l of r.leer) meld(id, l);
  console.log(`${r.leer.length || r.erwartet.length !== r.gebaut ? "!!" : "ok"}  ${id.padEnd(26)} ${r.gebaut} Bilder`);
}
console.log(`\n${ids.length} Seiten geprueft (${ausfuehrlich ? "ausführlich" : "kompakt"}, ${breite} px), ${probleme} Probleme.`);
await t.schliessen();
process.exit(probleme ? 1 : 0);
