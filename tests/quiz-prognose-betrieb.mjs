// node tests/quiz-prognose-betrieb.mjs  Klickt bei den sieben Seiten jedes Quiz durch (je Frage die erste Option).
import { starte, oeffneSeite } from "./browser.mjs";
const ids = ["tabellen-ml","zeitreihen","anomalien","empfehlungen","mlops","kosten-energie","ki-einfuehrung"];
const t = await starte({ kamera: false });
for (const id of ids) {
  await oeffneSeite(t.page, id);
  const n = await t.page.locator("fieldset.quiz-frage").count();
  for (let i = 0; i < n; i++) await t.page.locator("fieldset.quiz-frage").nth(i).locator("input[type=radio]").first().check();
  const erg = await t.page.locator(".quiz-ergebnis").innerText();
  console.log(id, "Fragen:", n, "|", erg.trim());
}
console.log(t.fehler.length ? "FEHLER:\n" + t.fehler.join("\n") : "keine Konsolenfehler");
await t.schliessen();
process.exit(t.fehler.length ? 1 : 0);
