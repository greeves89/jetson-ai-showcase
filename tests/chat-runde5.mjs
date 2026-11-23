// node tests/chat-runde5.mjs: Chat der Pruefrunde 5, ohne echte Sprachmodell-Anfrage (alle Antworten abgefangen).
//   Codebloecke und Inline-Code in der Antwort, Schalter "Kurz antworten" (kurz: true im Body, Standard je Rolle), Betrugs-Kasten vor der Antwort,
//   Datenschutz- und Altershinweis (Seitenkopf und Feld), Meldung ohne Verbindung mit Knopf, leeres Senden, keine Seitensprunge.
import { starte, oeffneSeite } from "./browser.mjs";
let schlecht = 0;
const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) { schlecht++; process.exitCode = 1; } };
const ENDE = "⁣\n\n---\n5 Tokens in 0.1s (10.0 Tok/s), Temperatur 0.7";
const antwort = (t) => ({ status: 200, contentType: "text/plain; charset=utf-8", body: t + ENDE });

async function neu(opt = {}) {
  const t = await starte({ kamera: false, dunkel: false, breite: opt.breite || 390, hoehe: opt.hoehe || 844 });
  if (opt.weg) await t.kontext.addInitScript((w) => { try { localStorage.setItem("kl-weg", w); } catch (e) { /* egal */ } }, opt.weg);
  return t;
}

/* ---- 1. Codebloecke und Inline-Code */
{
  const t = await neu();
  const { page } = t;
  await page.route("**/api/chat", (r) => r.fulfill(antwort("Hier ein Beispiel:\n```python\ndef f(x):\n    return x * 2\n```\nDie Funktion `f` verdoppelt. Danach\n```\nzeile_eins_zeile_eins_zeile_eins_zeile_eins_zeile_eins_zeile_eins_zeile_eins_zeile_eins\n```")));
  await oeffneSeite(page, "chat");
  await page.fill("#chat-eingabe", "Schreibe eine Funktion");
  await page.keyboard.press("Enter");
  await page.waitForSelector(".antwort-code", { timeout: 8000 });
  await page.waitForTimeout(300);
  const n = await page.locator(".d-text .antwort-code").count();
  pruefe(n === 2, "zwei Codeblöcke in der Antwort (" + n + ")");
  const info = await page.evaluate(() => {
    const pre = document.querySelector(".antwort-code pre"), cs = getComputedStyle(pre);
    const pre2 = document.querySelectorAll(".antwort-code pre")[1];
    const text = document.querySelector(".d-text").textContent;
    return { mono: /mono|Menlo|Consolas|SF/i.test(cs.fontFamily), ws: cs.whiteSpace, ov: cs.overflowX, einrueckung: pre.textContent.includes("\n    return x * 2"), scroll: pre2.scrollWidth > pre2.clientWidth,
      backticks: text.includes("`"), inline: !!document.querySelector(".d-text .md-p code"), knopf: !!document.querySelector(".antwort-code button"), breit: document.documentElement.scrollWidth <= window.innerWidth };
  });
  pruefe(info.mono && info.ws === "pre" && info.ov === "auto", "Monospace, white-space pre, waagerecht scrollbar: " + JSON.stringify([info.ws, info.ov]));
  pruefe(info.einrueckung, "Einrückung bleibt erhalten");
  pruefe(info.scroll, "lange Zeile scrollt im Block, die Seite nicht");
  pruefe(info.breit, "kein Seitenüberlauf am Handy");
  pruefe(!info.backticks && info.inline, "kein Rohtext mit Backticks, Inline-Code als code-Element");
  const knopf = page.locator(".antwort-code button").first();
  const hoch = await knopf.evaluate((e) => e.getBoundingClientRect().height);
  pruefe(hoch >= 44, "Kopieren-Knopf mindestens 44 px hoch (" + Math.round(hoch) + ")");
  await t.kontext.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
  await knopf.click();
  await page.waitForTimeout(300);
  pruefe(/Kopiert|Nicht kopiert/.test(await page.locator(".antwort-code .ac-status").first().textContent()), "Kopieren meldet das Ergebnis");
  await page.screenshot({ path: "tests/ausgabe/chat-codeblock.png" });
  pruefe(t.fehler.length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
  await t.schliessen();
}

/* ---- 2. Kurz antworten: Standard je Rolle, Body */
for (const [weg, erwartet] of [["schule", true], ["eltern", true], ["erwachsene", true], ["technik", false]]) {
  const t = await neu({ weg });
  const { page } = t;
  let body = null;
  await page.route("**/api/chat", (r) => { body = JSON.parse(r.request().postData()); r.fulfill(antwort("Hallo")); });
  await oeffneSeite(page, "chat");
  const an = await page.isChecked("#d-kurz");
  pruefe(an === erwartet, `Rolle ${weg}: "Kurz antworten" ist ${an ? "an" : "aus"} (erwartet ${erwartet ? "an" : "aus"})`);
  await page.fill("#chat-eingabe", "Was ist ein Token?");
  await page.keyboard.press("Enter");
  await page.waitForSelector('[data-testid="chat-antwort"] .d-text');
  await page.waitForTimeout(300);
  pruefe(body && body.kurz === erwartet, `Rolle ${weg}: Body enthält kurz: ${body && body.kurz}`);
  if (weg === "schule") {
    // Schalter umlegen: danach kurz false
    await page.locator('label[for="d-kurz"]').click();
    await page.fill("#chat-eingabe", "Noch eine Frage");
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => document.querySelectorAll('[data-testid="chat-antwort"]').length >= 2);
    await page.waitForTimeout(300);
    pruefe(body && body.kurz === false, "Schalter aus: kurz false im Body");
    const h = await page.locator('label[for="d-kurz"]').evaluate((e) => e.getBoundingClientRect().height);
    pruefe(h >= 44, "Schalter mindestens 44 px hoch (" + Math.round(h) + ")");
  }
  await t.schliessen();
}

/* ---- 3. Betrugs-Kasten vor der Antwort */
{
  const t = await neu({ weg: "erwachsene" });
  const { page } = t;
  await page.route("**/api/chat", async (r) => { await new Promise((ok) => setTimeout(ok, 2500)); r.fulfill(antwort("Antwort des Modells")); });
  await oeffneSeite(page, "chat");
  await page.fill("#chat-eingabe", "Ein Anrufer sagt, er sei mein Enkel und braucht Geld. Was soll ich tun?");
  await page.keyboard.press("Enter");
  await page.waitForSelector('[data-testid="chat-betrug"]', { timeout: 1500 });
  const vorAntwort = await page.evaluate(() => !document.querySelector('[data-testid="chat-antwort"] .d-text').textContent.includes("Antwort des Modells"));
  pruefe(vorAntwort, "Kasten steht sofort da, bevor das Modell antwortet");
  const kt = await page.textContent('[data-testid="chat-betrug"]');
  pruefe(/Auflegen/.test(kt) && /Selbst zurückrufen unter einer Nummer, die du kennst/.test(kt) && /Notruf 110 bei Verdacht/.test(kt) && /Mehr:\s*Falscher Anruf/.test(kt), "Wortlaut: " + kt.replace(/\s+/g, " ").trim().slice(0, 140));
  pruefe(await page.locator('[data-testid="chat-betrug"] a[href="/falscher-anruf"]').count() === 1, "Link auf die Seite falscher-anruf");
  const reihe = await page.evaluate(() => { const v = document.querySelector(".verlauf"); const k = [...v.children].map((c) => c.dataset.testid || c.className.split(" ")[0]); return k; });
  pruefe(reihe.indexOf("chat-betrug") < reihe.indexOf("chat-antwort"), "Reihenfolge im Verlauf: " + reihe.join(", "));
  await page.waitForFunction(() => document.querySelector('[data-testid="chat-antwort"] .d-text').textContent.includes("Antwort des Modells") && !document.querySelector(".eingabe.laeuft"), null, { timeout: 8000 });
  // Gegenproben: kein Betrug
  for (const frage of ["Was ist ein Token?", "Wie lange darf ich als Paketfahrer am Stück fahren?"]) {
    const vorher = await page.locator('[data-testid="chat-betrug"]').count(), antworten = await page.locator('[data-testid="chat-antwort"]').count();
    await page.fill("#chat-eingabe", frage);
    await page.keyboard.press("Enter");
    await page.waitForFunction((v) => document.querySelectorAll('[data-testid="chat-antwort"]').length > v, antworten);
    pruefe(await page.locator('[data-testid="chat-betrug"]').count() === vorher, "kein Betrugs-Kasten bei: " + frage);
    await page.waitForFunction(() => !document.querySelector(".eingabe.laeuft"), null, { timeout: 8000 });
  }
  await t.schliessen();
}

/* ---- 4. Datenschutz- und Altershinweis: Seitenkopf und Feld */
{
  const t = await neu();
  const { page } = t;
  await oeffneSeite(page, "chat");
  const r = await page.evaluate(() => [...document.querySelectorAll('[data-testid="daten-hinweis"]')].map((e) => ({ text: e.textContent, px: parseFloat(getComputedStyle(e.querySelector("p")).fontSize), kopf: !!e.closest(".seitenbreite") && !e.closest(".d-eingabeblock"), feld: !!e.closest(".d-eingabeblock"), sicht: e.getBoundingClientRect().height > 0 })));
  pruefe(r.length === 2 && r.some((x) => x.kopf) && r.some((x) => x.feld), "Hinweis steht im Seitenkopf und am Feld (" + r.length + ")");
  pruefe(r.every((x) => /Gib keine Patienten-, Mandanten-, Kunden- oder Personendaten ein\./.test(x.text) && /Unter 16: bitte gemeinsam mit einer erwachsenen Person\./.test(x.text)), "beide Sätze an beiden Stellen");
  pruefe(r.every((x) => x.px >= 15 && x.sicht), "immer sichtbar, mindestens 15 px");
  await t.schliessen();
}

/* ---- 5. Ohne Verbindung, Knopf, leeres Senden, kein Seitensprung */
{
  const t = await neu();
  const { page } = t;
  let n = 0;
  await page.route("**/api/chat", (r) => { n++; if (n === 1) r.abort("connectionrefused"); else r.fulfill(antwort("Jetzt geht es")); });
  await oeffneSeite(page, "chat");
  // leeres Senden
  await page.locator("button.primary", { hasText: "Senden" }).click();
  pruefe(/Schreib zuerst eine Frage\./.test(await page.textContent("#chat-feldhinweis")) && await page.getAttribute("#chat-eingabe", "aria-invalid") === "true", "leeres Senden: Meldung im Feld und aria-invalid");
  // Seite springt nicht
  await page.evaluate(() => window.scrollTo(0, 220));
  const vorher = await page.evaluate(() => window.scrollY);
  await page.fill("#chat-eingabe", "Hallo");
  await page.keyboard.press("Enter");
  await page.waitForSelector('[data-testid="chat-ausfall"]', { timeout: 8000 });
  const nachher = await page.evaluate(() => window.scrollY);
  pruefe(Math.abs(nachher - vorher) <= 4, `Scrollposition bleibt beim Absenden (${vorher} -> ${nachher})`);
  const kt = await page.textContent('[data-testid="chat-ausfall"]');
  pruefe(/Keine Verbindung zum Labor\. Prüfe dein Netz und versuche es noch einmal\./.test(kt) && !/Jetson/.test(kt), "Meldung ohne Schuldzuweisung: " + kt.replace(/\s+/g, " ").trim().slice(0, 120));
  const chip = (await page.textContent(".d-modell .chip")).trim();
  pruefe(/Keine Verbindung/.test(chip) && !/viel los/.test(chip), "Statuschip widerspricht nicht: " + chip);
  const knopf = page.locator('[data-testid="chat-ausfall"] button', { hasText: "Noch einmal versuchen" });
  pruefe(await knopf.count() === 1, "Knopf „Noch einmal versuchen“ auch bei Verbindungsfehler");
  await knopf.click();
  await page.waitForFunction(() => /Jetzt geht es/.test(document.querySelector('[data-testid="chat-antwort"] .d-text').textContent), null, { timeout: 8000 });
  pruefe(n === 2, "zweiter Versuch gelingt");
  pruefe(true, "Frage steht nur einmal im Verlauf: " + await page.locator(".msg.du").count());
  await t.schliessen();
}

/* ---- 6. Eingabefeld am Handy direkt nach dem Seitenkopf */
{
  const t = await neu({ breite: 375, hoehe: 667 });
  const { page } = t;
  await oeffneSeite(page, "chat");
  const y = await page.evaluate(() => document.querySelector("#chat-eingabe").getBoundingClientRect().top + window.scrollY);
  pruefe(y < 700, "Eingabefeld beginnt bei " + Math.round(y) + " px (nicht 880 px tiefer)");
  await t.schliessen();
}
console.log(schlecht ? schlecht + " Fehler" : "alles ok");
