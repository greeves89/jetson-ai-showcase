// node tests/screenshot.mjs <seite-id> [datei.png] [hell]
//   Oeffnet #/<id>, speichert einen Screenshot der ganzen Seite, meldet Konsolenfehler.
import { starte, oeffneSeite } from "./browser.mjs";
import { mkdirSync } from "node:fs";
const [id = "start", datei, modus] = process.argv.slice(2);
mkdirSync("tests/ausgabe", { recursive: true });
const t = await starte({ dunkel: modus !== "hell" });
await oeffneSeite(t.page, id);
// Bilder starten ihre Animation erst, wenn sie sichtbar werden: einmal durchscrollen, dann nach oben
await t.page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 380)); }
  window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 700));
});
const ziel = datei || `tests/ausgabe/${id}.png`;
await t.page.screenshot({ path: ziel, fullPage: true });
console.log("Screenshot:", ziel);
console.log(t.fehler.length ? "FEHLER:\n" + t.fehler.join("\n") : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
