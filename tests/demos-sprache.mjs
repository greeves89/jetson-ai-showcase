// node tests/demos-sprache.mjs [hell]: Chat, RAG und Agent bedienen.
import { starte, oeffneSeite } from "./browser.mjs";
const pruefe = (ok, text) => { console.log((ok ? "OK    " : "FEHLT ") + text); if (!ok) process.exitCode = 1; };
const modus = process.argv[2] || "dunkel";
const t = await starte({ dunkel: modus !== "hell", kamera: false });
const { page } = t;
const shot = (n) => page.screenshot({ path: `tests/ausgabe/demo-${n}-${modus}.png`, fullPage: false });

/* ---- Chat ---- */
const nur = process.env.NUR || "chat,rag,agent";
if (nur.includes("chat")) {
await oeffneSeite(page, "chat");
await page.waitForTimeout(2500);                     // Live-Werte abwarten: ist das Modell im Speicher, ist der Knopf "Modell laden" ausgeblendet
if (await page.isVisible(".d-modell .btn")) {
  await page.click("text=Modell laden");
  await page.waitForFunction(() => /liegt auf der SSD|beendet/.test(document.querySelector(".ladetxt").textContent), null, { timeout: 60000 });
  pruefe(true, "Modell laden: " + await page.textContent(".ladetxt"));
} else pruefe(/im Speicher/.test(await page.textContent(".d-modell [role=status]")), "Modell im Speicher, kein Laden-Knopf");
await page.fill(".eingabe textarea", "Erkläre in zwei Sätzen, was ein Token ist.");
await page.keyboard.press("Enter");
await page.waitForSelector(".msg.ki .d-text:not(:empty)", { timeout: 120000 });
await page.waitForTimeout(800);
console.log("      Live (Stream):", await page.textContent(".live .erklaerung"));
await page.waitForFunction(() => document.querySelector(".msg.ki .meta") && document.querySelector(".msg.ki .meta").textContent.length > 0, null, { timeout: 180000 });
const antwort = await page.textContent(".msg.ki .d-text");
const meta = await page.textContent(".msg.ki .meta");
pruefe(antwort.length > 20, "Antwort: " + antwort.slice(0, 120));
pruefe(/Tokens pro Sekunde/.test(meta), "Meta: " + meta);
console.log("      Live (fertig):", await page.textContent(".live .erklaerung"));
await page.check("#d-tokens", { force: true }).catch(async () => { await page.click(".d-schalter"); });
await page.waitForTimeout(300);
const toks = await page.$$eval(".msg.ki .tok", (e) => e.length);
pruefe(toks > 3, "Tokens zeigen nachtraeglich: " + toks + " Tokens");
await page.click("text=Was ist ein Jetson?");
await page.waitForTimeout(1500);
await page.click("text=Stopp").catch(() => {});
await page.waitForTimeout(500);
pruefe(await page.$eval(".eingabe .btn.primary", (b) => !b.disabled), "Stopp: wieder bedienbar");
await shot("chat");

}
/* ---- RAG ---- */
if (nur.includes("rag")) {
await oeffneSeite(page, "rag");
await page.click("text=Beispieltext einfügen");
await page.click("button:has-text('Einlesen')");
await page.waitForSelector(".d-vorschau li", { timeout: 60000 });
pruefe(await page.$$eval(".d-vorschau li", (e) => e.length) >= 1, "RAG eingelesen: " + await page.textContent(".d-erg p"));
await page.click("text=Wie hoch ist das Gesamtbudget?");
await page.waitForSelector(".d-treffer", { timeout: 150000 });
pruefe(true, "Treffer: " + (await page.$$eval(".d-treffer .sc", (e) => e.map((x) => x.textContent.replace(/\s+/g, " ")))).join(" | "));
await page.waitForFunction(() => document.querySelectorAll(".schritt.ok").length === 3, null, { timeout: 180000 });
const rAnt = await page.textContent(".d-antwort");
pruefe(/4,2|Million/.test(rAnt), "RAG Antwort: " + rAnt.slice(0, 160));
const ref = await page.$(".d-ref");
if (ref) { await ref.hover(); pruefe(await page.$$eval(".d-treffer.d-hl", (e) => e.length) === 1, "Verweis hebt Treffer hervor"); }
else console.log("      (kein [n]-Verweis in der Antwort)");
console.log("      Live:", await page.textContent(".live .erklaerung"));
await shot("rag");

}
/* ---- Agent ---- */
if (nur.includes("agent")) {
await oeffneSeite(page, "agent");
await page.click("text=Was ist 23 mal 19 plus 100?");
await page.waitForSelector(".karte-w.antwort", { timeout: 180000 });
const karten = await page.$$eval(".d-karten .karte-w", (e) => e.map((x) => x.textContent.replace(/\s+/g, " ").slice(0, 200)));
pruefe(karten.length >= 2 && /rechne/.test(karten[0]), "Agent Karten: " + karten.join(" || "));
await page.waitForFunction(() => /Gesamtzeit/.test(document.querySelector(".d-status").textContent), null, { timeout: 30000 });
pruefe(true, "Agent: " + await page.textContent(".d-status"));
await shot("agent");
}
pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
await t.schliessen();
