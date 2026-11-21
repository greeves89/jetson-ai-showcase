// node tests/rag-lektionen.mjs
//   Oeffnet die sechs RAG-Lektionen, prueft Ueberschriften, Tabellen, Alltagskaesten,
//   klickt jedes Quiz einmal durch und meldet Konsolenfehler.
import { starte, oeffneSeite } from "./browser.mjs";
const ids = ["rag-ueberblick", "rag-embedding", "rag-chunking", "rag-suche", "rag-reranking", "rag-bewertung"];
const t = await starte({ kamera: false });
let ok = true;
for (const id of ids) {
  await oeffneSeite(t.page, id);
  const info = await t.page.evaluate(() => ({
    abschnitte: document.querySelectorAll("#inhalt h2.abs").length,
    alltag: document.querySelectorAll("#inhalt aside.alltag").length,
    merke: document.querySelectorAll("#inhalt aside.merke").length,
    tabellen: document.querySelectorAll("#inhalt table.vergleich").length,
    fragen: document.querySelectorAll("#inhalt fieldset.quiz-frage").length,
    mitnehmen: document.querySelectorAll("#inhalt .mitnehmen li").length,
    gl: document.querySelectorAll("#inhalt button.gl").length,
    ueberlauf: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));
  const fs = await t.page.$$("#inhalt fieldset.quiz-frage");
  for (const f of fs) await (await f.$("label")).click();
  const erg = await t.page.textContent("#inhalt .quiz-ergebnis");
  const rueck = await t.page.$$eval("#inhalt .quiz-rueck", (l) => l.every((x) => x.textContent.length > 10));
  console.log(id, JSON.stringify(info), "| Quiz:", erg, "| Rueckmeldung:", rueck);
  if (info.fragen !== 5 || info.mitnehmen !== 3 || info.ueberlauf || !rueck) ok = false;
}
await oeffneSeite(t.page, "rag-chunking");
await t.page.click("#inhalt button.gl");
console.log("Tooltip:", (await t.page.textContent("#tip")).slice(0, 80));
const nav = await t.page.$$eval(".nav", (l) => l.map((a) => a.dataset.id));
console.log("Nav:", nav.filter((x) => x === "rag" || x.startsWith("rag-")).join(", "));
console.log(t.fehler.length ? "FEHLER:\n" + t.fehler.join("\n") : "keine Konsolenfehler");
await t.schliessen();
process.exit(ok && !t.fehler.length ? 0 : 1);
