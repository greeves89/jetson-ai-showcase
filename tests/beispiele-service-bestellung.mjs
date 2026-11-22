// node tests/beispiele-service-bestellung.mjs: Agent mit Szenario service-bestellung, Beispielfragen als Chips (nacheinander).
// Der Preis wird hier selbst aus bestellungen.json gerechnet und muss in der Antwort stehen (Werkzeug rechnet, nicht das Modell).
import { readFileSync } from "node:fs";
import { oeffneBeispiel, pruefer, warteStatus, normal, waermeLlm } from "./bsp-hilfe.mjs";
await waermeLlm();
const { pruefe } = pruefer();
const { t, page, e } = await oeffneBeispiel("service-bestellung");
const fragen = e.daten.fragen;
const bestellungen = JSON.parse(readFileSync(new URL("../app/static/beispiele/daten/bestellungen.json", import.meta.url), "utf8")).bestellungen;
const preis = (nr) => {
  const b = bestellungen.find((x) => x.nummer === nr);
  const zw = Math.round(b.positionen.reduce((s, p) => s + p.menge * p.einzelpreis, 0) * 100) / 100;
  return (zw < 50 ? zw + 4.9 : zw).toFixed(2).replace(".", ",");
};
pruefe(/Beispiel:/.test(await page.textContent(".d-bsp-kopf")), "Beispielkopf zeigt " + e.titel);
await warteStatus(page, /Bereit: 4 Werkzeuge/, 15000);
const chips = await page.$$(".vorschlaege .chip");
pruefe(chips.length === fragen.length, fragen.length + " Beispielfragen als Chips");
pruefe(/bestellstatus.*preis_berechnen/.test(await page.textContent(".d-hinweis")), "Werkzeuge des Szenarios genannt");
let richtig = 0, mitPruefung = 0, preisOk = 0;
for (let i = 0; i < fragen.length; i++) {
  const f = fragen[i];
  await page.evaluate(() => { document.querySelector(".d-bsp-urteil").hidden = true; });
  await chips[i].click();
  await page.waitForFunction(() => { const u = document.querySelector(".d-bsp-urteil"); return u && !u.hidden && u.textContent.length > 5; }, null, { timeout: 240000 }).catch(() => {});
  const antwort = ((await page.textContent(".karte-w.antwort .d-ergtext").catch(() => "")) || "").trim();
  const werkzeuge = await page.$$eval(".karte-w:not(.antwort) .d-zeilek code", (c) => c.map((x) => x.textContent));
  console.log(`       Frage ${i + 1}: ${f.frage}\n       Werkzeuge: ${werkzeuge.join(", ") || "keine"}\n       Antwort: ${antwort.slice(0, 200).replace(/\n/g, " ")}`);
  const muster = [f.antwort_enthaelt].concat(f.oder || []).filter(Boolean).map(normal);
  if (!muster.length) { pruefe(antwort.length > 0, "Fangfrage beantwortet (Inhalt prüfst du selbst): " + antwort.slice(0, 80)); continue; }
  mitPruefung++;
  const trifft = muster.some((m) => normal(antwort).includes(m));
  if (trifft) richtig++;
  if (f.werkzeug === "preis_berechnen") {
    const nr = /B-\d+/.exec(f.frage)[0];
    const erwartet = preis(nr);
    const hat = normal(antwort).includes(erwartet) || normal(antwort).includes(erwartet.replace(",", "."));
    pruefe(hat, `Preis ${nr}: ${erwartet} Euro steht in der Antwort`);
    if (hat) preisOk++;
  }
  pruefe(werkzeuge.includes(f.werkzeug) || !f.werkzeug, `Frage ${i + 1}: Werkzeug ${f.werkzeug} wurde gewählt (${werkzeuge.join(", ") || "keines"})`);
}
pruefe(preisOk === 2, preisOk + " von 2 Preisfragen mit echtem Preis aus bestellungen.json beantwortet");
pruefe(richtig >= 6, `${richtig} von ${mitPruefung} Fragen mit erwartetem Inhalt beantwortet (mindestens 6)`);
await page.screenshot({ path: "tests/ausgabe/beispiel-service-bestellung.png" });
pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
await t.schliessen();
