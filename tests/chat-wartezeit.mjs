// node tests/chat-wartezeit.mjs [hell]: Chat ohne echte Sprachmodell-Anfrage (alle Antworten abgefangen).
//   Wartezeit-Ansage (ehrlich, aus gemessenen Antworten), Fortschrittsanzeige, gemeinsamer Rechnerstatus (Start, Seitenleiste, Chat),
//   Ausfall nach 90 s und bei "Dem Jetson fehlt ...": Karte, Knopf, genau ein automatischer Versuch nach 20 s,
//   Pruefhinweis "Stimmt das?" unter jeder Antwort, Beispielfragen je Rolle, Kontextlaenge, stabile Selektoren (data-testid).
import { starte, oeffneSeite, URL_LABOR } from "./browser.mjs";
let schlecht = 0;
const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) { schlecht++; process.exitCode = 1; } };
const dunkel = process.argv[2] !== "hell";
const antwort = (t) => ({ status: 200, contentType: "text/plain; charset=utf-8", body: t + "⁣\n\n---\n1 Tokens in 0.1s (10.0 Tok/s), Temperatur 0.7" });
const stats = (w, gpu = 0) => ({ ram_mb: 2700, ram_max_mb: 7620, gpu_pct: gpu, cpu_pct: 2, temp_c: 50, power_w: 5, frisch: true, warteschlange: w, modelle_geladen: ["llama3.2:3b"] });

/* ---- 1. Selektoren, Ansage ohne Messwert, Fortschritt, Pruefhinweis, Kontextzeile */
{
  const t = await starte({ kamera: false, dunkel });
  const { page } = t;
  let n = 0;
  await page.route("**/api/warteschlange", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ aktiv: 2, wartend: 1, parallel: 2, max_wartend: 6, meine_position: 2, frei: false }) }));
  await page.route("**/api/chat", async (r) => { n++; await new Promise((ok) => setTimeout(ok, 3500)); r.fulfill(antwort("Hallo")); });
  await oeffneSeite(page, "chat");
  pruefe(await page.locator('[data-testid="chat-eingabe"]').count() === 1 && await page.locator("#chat-eingabe").count() === 1, "Chat-Feld hat id und data-testid chat-eingabe");
  const kontext = await page.textContent(".d-kontext");
  pruefe(/etwa 4096 Token im Kopf \(ein bis zwei Seiten Text\)/.test(kontext) && !!(await page.getAttribute(".d-kontext", "title")), "Kontextlänge im Chat-Fuß (Zeile und Tooltip): " + kontext.trim().slice(0, 70));
  // erstes Zeichen geht nicht verloren: sofort tippen
  await page.locator('[data-testid="chat-eingabe"]').pressSequentially("Hallo Welt", { delay: 0 });
  pruefe(await page.inputValue('[data-testid="chat-eingabe"]') === "Hallo Welt", "erstes Zeichen kommt im Feld an");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => /Nr\. 2/.test(document.querySelector('[data-testid="chat-antwort"]').textContent), null, { timeout: 8000 });
  const t1 = await page.textContent('[data-testid="chat-antwort"]');
  pruefe(/Nr\. 2 in der Warteschlange/.test(t1) && /bis zu einer Minute/.test(t1) && !/etwa 10 Sekunden/.test(t1), "ohne Messwert ehrlich: " + t1.trim().slice(0, 110));
  pruefe(await page.locator('[data-testid="chat-antwort"] [role=progressbar]').count() === 1, "Fortschrittsanzeige mit Balken");
  await page.waitForFunction(() => /Bisher \d+ s/.test(document.querySelector('[data-testid="chat-antwort"] .warte-zeit').textContent), null, { timeout: 5000 });
  pruefe(true, "verstrichene Zeit steht dabei: " + await page.textContent('[data-testid="chat-antwort"] .warte-zeit'));
  await page.waitForFunction(() => /Hallo/.test(document.querySelector('[data-testid="chat-antwort"] .d-text').textContent) && !document.querySelector('[data-testid="chat-antwort"] .warte-fort'), null, { timeout: 10000 });
  pruefe(true, "Antwort da, Fortschritt weg");
  // Pruefhinweis
  const pk = page.locator('[data-testid="chat-antwort"] [data-testid="chat-pruefen"]');
  pruefe(await pk.count() === 1, "unter der Antwort steht der Prüfhinweis (auch bei einer Alltagsfrage)");
  const ptext = await pk.textContent();
  pruefe(/Stimmt das\? Prüfe es:/.test(ptext) && /Woran würdest du merken, dass das falsch ist\?/.test(ptext), "Text: " + ptext.trim().slice(0, 90));
  pruefe(await pk.locator("a[href='/quellen-pruefen']").count() === 1, "Link auf die Seite quellen-pruefen");
  pruefe(await pk.evaluate((e) => parseFloat(getComputedStyle(e).fontSize) >= 15), "Schrift mindestens 15 px");
  await page.screenshot({ path: "tests/ausgabe/chat-antwort-pruefen.png" });
  // Messwert: zweite Frage, Platz 2, Schaetzung aus der gemessenen Dauer
  await page.fill('[data-testid="chat-eingabe"]', "Noch eine");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => /Geschätzte Wartezeit: etwa \d+ (Sekunden|Minute)/.test(document.querySelectorAll('[data-testid="chat-antwort"]')[1].textContent), null, { timeout: 8000 });
  pruefe(true, "mit Messwert: " + (await page.locator('[data-testid="chat-antwort"]').nth(1).textContent()).trim().slice(0, 110));
  pruefe(n === 2, "zwei Anfragen, keine zusätzlichen");
  pruefe(t.fehler.length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
  await t.schliessen();
}

/* ---- 2. Rechnerstatus: Start, Seitenleiste und Chat sagen dasselbe */
{
  const t = await starte({ kamera: false, dunkel });
  const { page } = t;
  let lage = { aktiv: 2, wartend: 3, parallel: 2 };
  await page.route("**/api/stats", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(stats(lage, 0)) }));
  await oeffneSeite(page, "start");
  await page.waitForFunction(() => /viel los/.test(document.querySelector(".statuschip").textContent), null, { timeout: 8000 });
  const s1 = (await page.textContent(".statuschip")).trim();
  pruefe(/Gerade viel los/.test(s1) && !/bereit und frei/.test(s1), "Start bei wartenden Anfragen: " + s1);
  pruefe(/gerade viel los/.test(await page.textContent(".livebox summary")), "Seitenleiste: " + (await page.textContent(".livebox summary")).trim());
  await oeffneSeite(page, "chat");
  await page.waitForFunction(() => /viel los/.test(document.querySelector(".d-modell .chip").textContent), null, { timeout: 8000 });
  const c1 = (await page.textContent(".d-modell .chip")).trim();
  pruefe(/gerade viel los/.test(c1) && !/bereit/.test(c1), "Chat bei wartenden Anfragen: " + c1);
  // eine laufende Anfrage, niemand wartet: rechnet, nicht frei
  lage = { aktiv: 1, wartend: 0, parallel: 2 };
  await page.waitForFunction(() => /rechnet gerade/.test(document.querySelector(".d-modell .chip").textContent), null, { timeout: 8000 });
  pruefe(true, "eine laufende Anfrage: " + (await page.textContent(".d-modell .chip")).trim());
  // alles frei: beide sagen bereit
  lage = { aktiv: 0, wartend: 0, parallel: 2 };
  await page.waitForFunction(() => /Modell bereit/.test(document.querySelector(".d-modell .chip").textContent), null, { timeout: 8000 });
  await oeffneSeite(page, "start");
  await page.waitForFunction(() => /bereit und frei/.test(document.querySelector(".statuschip").textContent), null, { timeout: 8000 });
  const s0 = (await page.textContent(".statuschip")).trim();
  pruefe(/bereit und frei/.test(s0) && !/Prozent/.test(s0), "frei: " + s0 + " | Seitenleiste: " + (await page.textContent(".livebox summary")).trim());
  pruefe(/Rechner live und frei/.test(await page.textContent(".livebox summary")), "Seitenleiste frei");
  pruefe(t.fehler.length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
  await t.schliessen();
}

/* ---- 3. Ausfall: 90 s ohne erstes Wort, Karte, genau ein automatischer Versuch nach 20 s */
{
  const t = await starte({ kamera: false, dunkel });
  const { page } = t;
  await page.clock.install();
  let n = 0;
  await page.route("**/api/warteschlange", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ aktiv: 0, wartend: 0, parallel: 2, meine_position: 0, frei: true }) }));
  await page.route("**/api/chat", async (r) => {
    n++;
    if (n === 1) return;                                                         // haengt: kein erstes Wort
    if (n === 2) return r.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: "[Dem Jetson fehlt gerade freier Speicher, um das Sprachmodell zu laden.]⁣" });
    return r.fulfill(antwort("Jetzt klappt es"));
  });
  await oeffneSeite(page, "chat");
  await page.fill('[data-testid="chat-eingabe"]', "Wie lange darf ein Busfahrer fahren?");
  await page.keyboard.press("Enter");
  await page.clock.runFor(30000);
  const fort = await page.locator('[data-testid="chat-antwort"] [role=progressbar]').getAttribute("aria-valuenow");
  pruefe(+fort >= 25 && +fort <= 35, "Fortschritt zählt Sekunden: " + fort + " s");
  await page.clock.runFor(61000);
  await page.waitForSelector('[data-testid="chat-ausfall"]', { timeout: 8000 });
  const k = (await page.textContent('[data-testid="chat-ausfall"]')).replace(/\s+/g, " ");
  pruefe(/Der Jetson ist gerade ausgelastet/.test(k) && /Nach 90 Sekunden kam noch kein erstes Wort/.test(k), "nach 90 s: Karte (" + k.slice(0, 90) + ")");
  pruefe(await page.locator('[data-testid="chat-ausfall"] button:has-text("Noch einmal versuchen")').count() === 1, "Knopf Noch einmal versuchen");
  pruefe(/Bis dahin hilft/.test(k) && await page.locator('[data-testid="chat-ausfall"] a[href="/tokens-sprachmodelle"]').count() === 1, "Hinweis, was inzwischen hilft (Seite lesen)");
  pruefe(/in \d+ Sekunden automatisch noch einmal, genau einmal/.test(k), "Ansage des automatischen Versuchs: " + (k.match(/Ich versuche[^.]*\./) || [""])[0]);
  pruefe(n === 1, "bis hierhin eine Anfrage");
  await page.screenshot({ path: "tests/ausgabe/chat-ausfall-karte.png" });
  await page.clock.runFor(21000);
  await page.locator('[data-testid="chat-ausfall"]:has-text("Dem Jetson fehlt")').waitFor({ timeout: 8000 });
  pruefe(n === 2, "nach 20 s genau ein automatischer Versuch (Anfragen: " + n + ")");
  const k2 = (await page.textContent('[data-testid="chat-ausfall"]')).replace(/\s+/g, " ");
  pruefe(!/automatisch noch einmal/.test(k2), "zweiter Ausfall: kein weiterer automatischer Versuch angekündigt");
  await page.clock.runFor(90000);
  pruefe(n === 2, "auch nach weiteren 90 s kein dritter Versuch (Anfragen: " + n + ")");
  pruefe(await page.locator(".msg.du").count() === 1, "die Frage steht genau einmal im Verlauf");
  await page.click('[data-testid="chat-ausfall"] button:has-text("Noch einmal versuchen")');
  await page.locator('[data-testid="chat-antwort"]:has-text("Jetzt klappt es")').waitFor({ timeout: 8000 });
  pruefe(n === 3 && await page.locator(".msg.du").count() === 1, "Knopf versucht sofort noch einmal (Anfragen: " + n + ")");
  pruefe(t.fehler.length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
  await t.schliessen();
}

/* ---- 4. Beispielfragen je Rolle */
{
  const t = await starte({ kamera: false, dunkel });
  const { page } = t;
  await page.route("**/api/chat", (r) => r.fulfill(antwort("ok")));
  const chips = async (weg) => { await page.goto(`${URL_LABOR}/chat?weg=${weg}`, { waitUntil: "load" }); await page.waitForSelector(".vorschlaege .chip"); return page.$$eval(".vorschlaege .chip", (c) => c.map((x) => x.textContent)); };
  let c = await chips("eltern");
  pruefe(c.includes("Wie erkläre ich meinem Kind, was KI ist?"), "Eltern: Kind und KI erklären");
  c = await chips("beruf");
  pruefe(c.some((x) => /Steuerbüro/.test(x) && /nie eingeben/.test(x)), "Betrieb: Was darf ich einer KI nie eingeben (Steuerbüro)");
  pruefe(c.some((x) => /FI-Schalter/.test(x) && /Lehrbeispiel/.test(x) && /prüfen/.test(x)), "Betrieb: FI-Schalter nur als Lehrbeispiel mit Prüfhinweis");
  pruefe(c.some((x) => /Pausen/.test(x)), "Betrieb: Pausenzeiten im Bus als Alltagsbeispiel");
  c = await chips("erwachsene");
  pruefe(c.some((x) => /Busfahrer/.test(x) && /prüfen/.test(x)), "Erwachsene: Busfahrer-Pausen mit Prüfhinweis");
  await page.click(".vorschlaege .chip >> nth=1");
  await page.waitForSelector('[data-testid="chat-pruefen"]', { timeout: 8000 });
  pruefe(true, "Beispielfrage anklickbar, Antwort samt Prüfhinweis");
  pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
  await t.schliessen();
}
console.log(schlecht ? `\n${schlecht} Fehler` : "\nalles ok");
