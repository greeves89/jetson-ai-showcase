// Prueft alle sechs Bausteine bei Handybreite: kein waagerechter Ueberlauf; Bilder unter tests/ausgabe/ws-*.png
import { starte, oeffneSeite } from "./browser.mjs";
const t = await starte({ kamera: false, breite: 390, hoehe: 800, dunkel: false });
let schlecht = 0;
for (const id of ["karte", "ml", "genki", "robotik", "business", "hardware"]) {
  await oeffneSeite(t.page, id);
  await t.page.waitForTimeout(1500);
  const r = await t.page.evaluate(() => {
    const b = document.querySelector("#ausprobieren"); const w = b.getBoundingClientRect();
    const raus = [...b.querySelectorAll("*")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > w.right + 1 || r.left < w.left - 1) && !e.closest("svg"); }).map((e) => e.tagName + "." + e.className);
    return { sw: document.documentElement.scrollWidth, iw: innerWidth, raus: raus.slice(0, 5) };
  });
  console.log(id, JSON.stringify(r));
  if (r.sw > r.iw || r.raus.length) schlecht++;
  await (await t.page.$("#ausprobieren")).screenshot({ path: `tests/ausgabe/ws-${id}.png` });
}
await t.schliessen();
process.exit(schlecht ? 1 : 0);
