// Bildschirmfotos der vier Grundlagen-Bausteine (nur der Baustein-Block), hell und dunkel.
//   node tests/widgets-grundlagen-bilder.mjs [breite]
import { starte, oeffneSeite } from "./browser.mjs";
import { mkdirSync } from "node:fs";
const breite = Number(process.argv[2]) || 1280;
mkdirSync("tests/ausgabe", { recursive: true });
const seiten = ["neuronale-netze", "training", "bewertung", "daten"];
let fehlerGesamt = 0;
for (const dunkel of [true, false]) {
  const t = await starte({ kamera: false, dunkel, breite, hoehe: 900 });
  for (const s of seiten) {
    await oeffneSeite(t.page, s);
    const el = t.page.locator("#ausprobieren");
    await el.scrollIntoViewIfNeeded();
    await t.page.waitForTimeout(500);
    const datei = `tests/ausgabe/gl-${s}-${dunkel ? "dunkel" : "hell"}-${breite}.png`;
    await el.screenshot({ path: datei });
    console.log(datei);
  }
  if (t.fehler.length) { console.log("FEHLER", t.fehler); fehlerGesamt += t.fehler.length; }
  await t.schliessen();
}
process.exit(fehlerGesamt ? 1 : 0);
