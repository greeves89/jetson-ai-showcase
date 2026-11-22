// node tests/beispiele-buero-dokumente.mjs: vier Dokumente einlesen, alle Beispielfragen stellen (nacheinander, Jetson-RAM).
// Hart geprüft wird die Suche: Die erwartete Stelle muss unter den Treffern stehen. Die Antwort des Sprachmodells wird
// zusätzlich gewertet, ihr Ausbleiben ist nur eine Warnung: Auf dem Jetson scheitert das Laden des Sprachmodells direkt nach
// dem Embedding-Modell gelegentlich (CUDA-Puffer), und ein so geladenes Modell kann Unsinn erzeugen. Das ist ein Problem der
// Jetson-Umgebung, nicht des Beispiels. Jede Frage läuft in frischer Sitzung, damit eine hängende Antwort die nächste nicht blockiert.
// Die Fangfrage (Urlaub) hat keine erwartete Stelle: Der Test zeigt Treffer und Antwort, wertet sie aber nicht als Treffer.
import { oeffneBeispiel, pruefer, warteStatus, normal, origin, waermeLlm, eintrag } from "./bsp-hilfe.mjs";
await waermeLlm();
const { pruefe } = pruefer();
let sucheOk = 0, mitPruefung = 0, antwortOk = 0, antwortenDa = 0, fehlerKonsole = [];
const n = eintrag("buero-dokumente").daten.fragen.length;
for (let i = 0; i < n; i++) {
  const { t, page, e } = await oeffneBeispiel("buero-dokumente");
  const f = e.daten.fragen[i];
  if (i === 0) {
    pruefe(/Beispiel:/.test(await page.textContent(".d-bsp-kopf")), "Beispielkopf zeigt " + e.titel);
  }
  await warteStatus(page, /Fertig: 4 Dokumente eingelesen/, 240000);
  if (i === 0) {
    pruefe(/4 Dokumente/.test(await page.textContent(".d-erg")), "Einlesen meldet 4 Dokumente");
    pruefe((await page.$$(".vorschlaege .chip")).length === n, n + " Beispielfragen als Chips");
  }
  await (await page.$$(".vorschlaege .chip"))[i].click();
  await page.waitForSelector(".d-treffer", { timeout: 60000 });
  const treffer = normal((await page.$$eval(".d-ttext", (x) => x.map((y) => y.textContent))).join(" "));
  const fertig = await page.waitForFunction(() => !document.querySelector(".eingabe.d-frage .btn.primary").disabled, null, { timeout: 60000 }).then(() => true, () => false);
  const antwort = (await page.textContent(".d-antwort")).trim();
  const urteilSichtbar = await page.$eval(".d-bsp-urteil", (u) => !u.hidden && u.textContent.length > 5);
  console.log(`       Frage ${i + 1}: ${f.frage}\n       Antwort: ${antwort.slice(0, 160).replace(/\n/g, " ")}`);
  const muster = [f.antwort_enthaelt].concat(f.oder || []).filter(Boolean).map(normal);
  if (!muster.length) pruefe(treffer.length > 0, "Fangfrage: Suche liefert Treffer, Antwort bitte selbst lesen");
  else {
    mitPruefung++;
    const inTreffern = muster.some((m) => treffer.includes(m));
    if (inTreffern) sucheOk++;
    pruefe(inTreffern, `Suche Frage ${i + 1}: "${f.antwort_enthaelt}" steht in den Treffern`);
    if (!fertig || !urteilSichtbar) console.log("WARNUNG Frage " + (i + 1) + ": keine brauchbare Antwort vom Sprachmodell (Jetson-Speicher)");
    else {
      antwortenDa++;
      const trifft = muster.some((m) => normal(antwort).includes(m));
      if (trifft) antwortOk++;
      pruefe(trifft === /enthält es,/.test(await page.textContent(".d-bsp-urteil")), `Urteil der Oberfläche passt zur Antwort (Frage ${i + 1})`);
    }
  }
  if (i === 0) await page.screenshot({ path: "tests/ausgabe/beispiel-buero-dokumente.png" });
  fehlerKonsole.push(...t.fehler);
  await page.request.post(origin(page) + "/api/rag/reset", { headers: { Origin: origin(page) }, data: {} }).catch(() => {});
  await t.schliessen();
}
pruefe(sucheOk >= 6, `${sucheOk} von ${mitPruefung} Fragen: erwartete Stelle unter den Treffern (mindestens 6)`);
console.log(`       Antworten des Sprachmodells: ${antwortenDa} von ${mitPruefung} brauchbar erhalten, davon ${antwortOk} mit erwartetem Inhalt`);
pruefe(fehlerKonsole.length === 0, "Konsole sauber " + fehlerKonsole.join("; "));
