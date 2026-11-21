// node tests/widgets-bild.mjs <seite> [hell]  -> tests/ausgabe/wb-<seite>-<modus>.png (nur der Baustein)
import { starte, oeffneSeite } from "./browser.mjs";
const [id, modus] = process.argv.slice(2);
const t = await starte({ dunkel: modus !== "hell", kamera: false });
await oeffneSeite(t.page, id);
await t.page.waitForTimeout(1800);
const el = await t.page.$("#ausprobieren");
await el.screenshot({ path: `tests/ausgabe/wb-${id}-${modus || "dunkel"}.png` });
console.log(t.fehler.length ? t.fehler.join("\n") : "ok");
await t.schliessen();
