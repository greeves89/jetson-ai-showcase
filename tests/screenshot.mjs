// node tests/screenshot.mjs <seite-id> [datei.png] [hell]
//   Oeffnet #/<id>, speichert einen Screenshot der ganzen Seite, meldet Konsolenfehler.
import { starte, oeffneSeite } from "./browser.mjs";
import { mkdirSync } from "node:fs";
const [id = "start", datei, modus] = process.argv.slice(2);
mkdirSync("tests/ausgabe", { recursive: true });
const t = await starte({ dunkel: modus !== "hell" });
await oeffneSeite(t.page, id);
const ziel = datei || `tests/ausgabe/${id}.png`;
await t.page.screenshot({ path: ziel, fullPage: true });
console.log("Screenshot:", ziel);
console.log(t.fehler.length ? "FEHLER:\n" + t.fehler.join("\n") : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
