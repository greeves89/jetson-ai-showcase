// node tests/quiz-grundlagen.mjs
//   Klickt das Quiz jeder Seite des Strangs Grundlagen mit den richtigen Antworten durch
//   und prueft Ergebnis, Rueckmeldungen und Konsolenfehler.
import { starte, oeffneSeite } from "./browser.mjs";
const seiten = ["daten", "neuronale-netze", "training", "bewertung", "verzerrung-ethik", "recht"];
const t = await starte({ kamera: false });
let fehlerAnzahl = 0;
const pruefe = (ok, text) => { console.log((ok ? "ok    " : "FEHLER ") + text); if (!ok) fehlerAnzahl++; };
for (const id of seiten) {
  await oeffneSeite(t.page, id);
  const richtig = await t.page.evaluate((i) => window.INHALT.seiten[i].quiz.map((q) => q.richtig), id);
  const felder = t.page.locator("fieldset.quiz-frage");
  pruefe((await felder.count()) === richtig.length, `${id}: ${richtig.length} Quizfragen sichtbar`);
  for (let i = 0; i < richtig.length; i++) {
    await felder.nth(i).locator(`label:has(input[value="${richtig[i]}"])`).click()   // Reihenfolge ist gemischt, value = urspruenglicher Index;
  }
  const ergebnis = (await t.page.locator(".quiz-ergebnis").textContent()).trim();
  pruefe(ergebnis === `${richtig.length} von ${richtig.length} richtig.`, `${id}: Ergebnis "${ergebnis}"`);
  const rueck = await t.page.locator(".quiz-rueck").allTextContents();
  pruefe(rueck.every((r) => r.startsWith("Richtig.")), `${id}: alle Rückmeldungen "Richtig."`);
  const abschnitte = await t.page.locator("h2.abs").count();
  pruefe(abschnitte >= 6 && abschnitte <= 8, `${id}: ${abschnitte} Abschnitte`);
  // falsche Antwort einmal pruefen: Seite neu laden, erste falsche waehlen
  await t.page.goto("about:blank");
  await oeffneSeite(t.page, id);
  const f0 = t.page.locator("fieldset.quiz-frage").first();
  await f0.locator(`label:has(input[value="${richtig[0] === 0 ? 1 : 0}"])`).click();
  pruefe((await f0.locator(".quiz-rueck").textContent()).startsWith("Nicht ganz."), `${id}: falsche Antwort wird erkannt`);
}
pruefe(t.fehler.length === 0, "keine Konsolenfehler" + (t.fehler.length ? ": " + t.fehler.join(" | ") : ""));
await t.schliessen();
process.exit(fehlerAnzahl ? 1 : 0);
