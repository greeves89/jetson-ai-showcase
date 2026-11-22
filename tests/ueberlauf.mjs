// node tests/ueberlauf.mjs [breite ...]: Gerda-Pruefung (Zoom 150 Prozent = 260 CSS-Pixel, dazu 320 Pixel).
//   Geht ALLE Seiten durch (und Fehlerseite, Willkommens-Fenster, Menue) und prueft, dass kein Seitenueberlauf entsteht
//   (documentElement.scrollWidth <= Sichtbreite) und dass "Kurz lesen/Genau lesen" und "Mit Mathe" im sichtbaren Bereich liegen.
//   LABOR_URL wie in browser.mjs. Nur Layout, es wird keine Modellanfrage gestellt.
import { starte, URL_LABOR } from "./browser.mjs";
let schlecht = 0;
const pruefe = (ok, text) => { if (!ok) { console.log("FEHLER " + text); schlecht++; process.exitCode = 1; } };
const breiten = process.argv.slice(2).map(Number).filter(Boolean);
const LISTE = breiten.length ? breiten : [[260, 700], [320, 640]].map((x) => x[0]);
const HOEHE = { 260: 700, 320: 640 };

const messen = () => {
  const b = document.documentElement.clientWidth;
  const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  const geklemmt = (e) => { for (let p = e.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o !== "visible" && p.getBoundingClientRect().right <= b + 1) return true; } return false; };
  let breit = null;
  if (sw > b + 1) {
    let max = 0;
    for (const e of document.querySelectorAll("body *")) {
      const r = e.getBoundingClientRect();
      if (!r.width || getComputedStyle(e).position === "fixed" || e.closest("[hidden]") || geklemmt(e)) continue;
      if (r.right > b + 1 && r.right > max + 0.5) { max = r.right; breit = e.tagName.toLowerCase() + (typeof e.className === "string" && e.className ? "." + e.className.split(" ")[0] : "") + " rechts=" + Math.round(r.right); }
    }
  }
  const raus = [];
  for (const s of document.querySelectorAll(".lesemodus button, .mathe-schalter")) {
    const r = s.getBoundingClientRect();
    if (r.width && (r.left < -1 || r.right > b + 1)) raus.push(s.textContent.trim() + " x=" + Math.round(r.left) + ".." + Math.round(r.right));
  }
  return { b, sw, breit, raus };
};

const ids = await (async () => {
  const t = await starte({}); await t.page.goto(URL_LABOR + "/", { waitUntil: "load" }); await t.page.waitForSelector("#inhalt h1");
  const l = await t.page.evaluate(() => Object.keys(window.KL.INHALT.seiten)); await t.schliessen(); return l;
})();

for (const breite of LISTE) {
  const t = await starte({ breite, hoehe: HOEHE[breite] || 700, kamera: false });
  const { page } = t;
  const adressen = ids.map((id) => (id === "start" ? "/" : "/" + id)).concat(["/#/gibt-es-nicht"]);
  for (const a of adressen) {
    await page.goto(URL_LABOR + a, { waitUntil: "load" });
    await page.waitForSelector("#inhalt h1", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(250);
    // Bereiche aufklappen, die Breite beeinflussen koennen: Genau lesen (alles offen)
    await page.evaluate(() => { const b = document.querySelector('.lesemodus button[data-modus="ausfuehrlich"]'); if (b) b.click(); document.documentElement.dataset.mathe = "an"; });
    await page.waitForTimeout(100);
    const m = await page.evaluate(messen);
    pruefe(m.sw <= m.b + 1, breite + " px " + a + ": Seitenueberlauf " + m.sw + " > " + m.b + (m.breit ? " (" + m.breit + ")" : ""));
    pruefe(!m.raus.length, breite + " px " + a + ": Schalter ausserhalb " + m.raus.join(", "));
  }
  // Willkommens-Fenster
  await page.goto(URL_LABOR + "/", { waitUntil: "load" });
  await page.waitForSelector("#inhalt h1");
  await page.evaluate(() => window.KL.willkommen.oeffnen({}));
  await page.waitForSelector("dialog.wk[open]");
  const w = await page.evaluate(() => { const d = document.querySelector("dialog.wk").getBoundingClientRect(); const sp = new Set([...document.querySelectorAll(".wk-weg")].map((e) => Math.round(e.getBoundingClientRect().left))); return { l: d.left, r: d.right, b: document.documentElement.clientWidth, spalten: sp.size, ueber: document.querySelector("dialog.wk").scrollWidth > document.querySelector("dialog.wk").clientWidth + 1 }; });
  pruefe(w.l >= -1 && w.r <= w.b + 1 && !w.ueber, breite + " px Willkommens-Fenster ragt hinaus " + JSON.stringify(w));
  pruefe(w.spalten === 1, breite + " px Willkommens-Fenster einspaltig, ist " + w.spalten + " Spalten");
  await page.screenshot({ path: `tests/ausgabe/ueberlauf-willkommen-${breite}.png` });
  await page.keyboard.press("Escape");
  // Menue offen
  await page.goto(URL_LABOR + "/", { waitUntil: "load" });
  await page.waitForSelector("#inhalt h1");
  await page.click(".menueknopf");
  const mm = await page.evaluate(messen);
  pruefe(mm.sw <= mm.b + 1, breite + " px Menue offen: Seitenueberlauf " + mm.sw + " > " + mm.b + (mm.breit ? " (" + mm.breit + ")" : ""));
  await page.screenshot({ path: `tests/ausgabe/ueberlauf-menue-${breite}.png` });
  const echt = t.fehler.filter((f) => !/status of (50[23]|404)/.test(f));      // fehlende Rechner-Antworten (Ollama, Stats) sind kein Layoutfehler
  pruefe(echt.length === 0, breite + " px Konsolenfehler: " + echt.join(" | "));
  await t.schliessen();
}
console.log(schlecht ? "ueberlauf: " + schlecht + " Fehler" : "ueberlauf: alles ok");
