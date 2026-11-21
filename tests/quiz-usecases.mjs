// node tests/quiz-usecases.mjs  Klickt bei den zehn Use-Case-Seiten jedes Quiz durch (je Frage die erste Option)
// und prueft: fuenf Fragen, Ergebnis sichtbar, Beispiel-Link vorhanden, keine Konsolenfehler.
import { starte, oeffneSeite } from "./browser.mjs";
const ids = ["uc-fertigung-sichtpruefung","uc-fertigung-sortieren","uc-logistik-zaehlen","uc-handel-regal","uc-gesundheit-auffaellig","uc-buero-dokumente","uc-buero-protokoll","uc-service-bestellung","uc-sicherheit-zutritt","uc-sicherheit-baustelle"];
const t = await starte({ kamera: false });
let schlecht = 0;
for (const id of ids) {
  await oeffneSeite(t.page, id);
  const n = await t.page.locator("fieldset.quiz-frage").count();
  for (let i = 0; i < n; i++) await t.page.locator("fieldset.quiz-frage").nth(i).locator("input[type=radio]").first().check();
  const erg = (await t.page.locator(".quiz-ergebnis").innerText()).trim();
  const links = await t.page.locator("main a[href*='beispiel='], main a[href='#/gesicht']").count();
  const ok = n === 5 && erg.length > 0 && links >= 1;
  if (!ok) schlecht++;
  console.log(ok ? "ok " : "FEHLER", id, "Fragen:", n, "Beispiel-Links:", links, "|", erg);
}
console.log(t.fehler.length ? "FEHLER:\n" + t.fehler.join("\n") : "keine Konsolenfehler");
await t.schliessen();
process.exit(schlecht || t.fehler.length ? 1 : 0);
