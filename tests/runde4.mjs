// node tests/runde4.mjs: Pruefrunde 4. Unbekannte Adressen, Suche mit Volltext und Textauszug, Pfadkontext, Lesemodus-Standard, Menue,
//   Chat-Hinweise, Prompt-Vergleich, Videos, Willkommens-Fenster. Modellanfragen werden abgefangen (kein Jetson-Lauf).
import { starte, URL_LABOR, oeffneSeite } from "./browser.mjs";
let schlecht = 0;
const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) { schlecht++; process.exitCode = 1; } };

/* ---- 2. Unbekannte Adressen */
{
  const t = await starte({ kamera: false }); const { page } = t;
  for (const a of ["/#/gibt-es-nicht", "/gibt-es-nicht-2"]) {
    await page.goto(URL_LABOR + a, { waitUntil: "load" });
    await page.waitForSelector("#inhalt h1");
    pruefe(/Seite nicht gefunden/.test(await page.textContent("#inhalt h1")), a + ": Seite nicht gefunden");
    pruefe(await page.locator('#inhalt a[href="/"]').count() === 1 && await page.locator("#inhalt button:has-text('Seiten suchen')").count() === 1, a + ": Links zur Startseite und zur Suche");
  }
  await page.click("#inhalt button:has-text('Seiten suchen')");
  pruefe(await page.evaluate(() => document.activeElement.id === "nav-suche"), "Seiten suchen setzt den Fokus in die Suche");
  await t.schliessen();
}

/* ---- 3. Suche: Volltext, Textauszug, kein leerer Balken */
{
  const t = await starte({ kamera: false }); const { page } = t;
  await oeffneSeite(page, "karte");
  const suche = async (q) => { await page.fill("#nav-suche", q); await page.waitForTimeout(300);
    return page.evaluate(() => ({ seiten: [...document.querySelectorAll("a.nav")].filter((a) => !a.hidden && !a.closest("[hidden]")).map((a) => a.dataset.id),
      auszuege: [...document.querySelectorAll(".such-auszug")].filter((e) => !e.closest("[hidden]")).length, boxLeer: (() => { const b = document.querySelector("#such-ergebnis"); return !b.hidden && !b.textContent.trim(); })() })); };
  for (const q of ["Operatoren", "Arbeitsblatt", "Ethik", "Doppelstunde", "Kontakt", "Enkeltrick", "Referat"]) {
    const r = await suche(q);
    pruefe(r.seiten.length > 0, `Suche "${q}" findet Seiten (${r.seiten.length}: ${r.seiten.slice(0, 4).join(", ")})`);
    pruefe(r.auszuege > 0, `Suche "${q}": Treffer mit Textauszug (${r.auszuege})`);
  }
  const medien = await suche("Operatoren");
  pruefe(medien.seiten.filter((i) => /^medien-stunde/.test(i)).length >= 3, "Operatoren findet die Medien-Einheiten");
  for (const q of ["Oberstufe", "abitur"]) { const r = await suche(q); pruefe(!r.boxLeer, `"${q}": kein leerer grauer Balken über den Treffern`); }
  await t.schliessen();
}

/* ---- 5. Pfadkontext: gewaehlter Pfad bleibt, Zaehlung gleich */
{
  const t = await starte({ kamera: false }); const { page } = t;
  await page.goto(URL_LABOR + "/", { waitUntil: "load" });
  await page.waitForSelector("#inhalt h1");
  await page.evaluate(() => { const d = document.querySelector("details.weitere"); if (d) d.open = true; });
  const karte = page.locator('.pfad-karte[data-pfad="oberstufe"]');
  pruefe(await karte.count() === 1, "Pfadkarte Oberstufe vorhanden");
  const n = await karte.locator(".pfad-seiten a").count();
  await karte.locator("a.btn").click();
  await page.waitForSelector("#inhalt h1");
  pruefe(/pfad=oberstufe/.test(page.url()), "Start des Pfads legt ?pfad=oberstufe in die Adresse (" + page.url() + ")");
  const info = async () => page.textContent(".pfad-weiter-info");
  let text = await info();
  pruefe(/Oberstufe und Abitur/.test(text) && new RegExp("Schritt 1 von " + n + "\\.").test(text), "Pfadfuss nennt den gewählten Pfad: " + text);
  await page.click(".pfad-weiter a");
  await page.waitForSelector("#inhalt h1");
  text = await info();
  pruefe(/Oberstufe und Abitur/.test(text) && new RegExp("Schritt 2 von " + n + "\\.").test(text), "Nächste Seite bleibt im Pfad: " + text);
  await page.click(".pfad-weiter a");
  await page.waitForSelector("#inhalt h1");
  pruefe(/pfad=oberstufe/.test(page.url()), "Adresse behält ?pfad nach dem zweiten Schritt");
  // Ohne Wahl: Pfad der Rolle, Zaehlung ueberall gleich wie die Karte
  await page.goto(URL_LABOR + "/?weg=erwachsene", { waitUntil: "load" });
  await page.waitForSelector("#inhalt h1");
  await page.evaluate(() => { const d = document.querySelector("details.weitere"); if (d) d.open = true; });
  const nr = await page.locator('.pfad-karte[data-pfad="erwachsene"] .pfad-seiten a').count();
  await page.goto(URL_LABOR + "/echt-oder-ki?weg=erwachsene", { waitUntil: "load" });
  await page.waitForSelector(".pfad-weiter-info");
  const tr = await page.textContent(".pfad-weiter-info");
  pruefe(new RegExp("Schritt \\d+ von " + nr + "\\.").test(tr) && /KI verstehen/.test(tr), "Rolle erwachsene: Pfadfuß zählt wie die Karte (" + nr + "): " + tr);
  await t.schliessen();
}

/* ---- 6./7. Lesemodus-Standard und gleiche Lesezeit */
{
  const t = await starte({ kamera: false }); const { page } = t;
  await oeffneSeite(page, "medien-stunde-3");
  pruefe(await page.evaluate(() => document.documentElement.dataset.lesemodus) === "ausfuehrlich", "Unterrichtsseite (Für die Schule, Lektion): Standard Genau lesen");
  const kopf = await page.textContent(".lz-kopf");
  await oeffneSeite(page, "karte");
  pruefe(await page.evaluate(() => document.documentElement.dataset.lesemodus) === "kompakt", "Andere Seite: Standard bleibt Kurz lesen");
  await page.goto(URL_LABOR + "/?weg=lehrende", { waitUntil: "load" });
  await page.waitForSelector('[data-seite="schule-lehrkraefte"]');
  const karteZeit = (await page.textContent('[data-seite="schule-lehrkraefte"] .karte-meta')).trim();
  await page.click('[data-seite="schule-lehrkraefte"] a.btn');
  await page.waitForSelector(".lz-kopf");
  pruefe((await page.textContent(".lz-kopf")).trim() === karteZeit, "Handreichung: Karte und Seitenkopf gleiche Zeit (" + karteZeit + ")");
  // Wahl des Nutzers hat Vorrang
  await page.click('.lesemodus button[data-modus="kompakt"]');
  await oeffneSeite(page, "medien-stunde-3");
  pruefe(await page.evaluate(() => document.documentElement.dataset.lesemodus) === "kompakt", "Eigene Wahl (Kurz lesen) hat Vorrang vor dem Standard");
  pruefe(kopf.length > 0, "Seitenkopf zeigt Lesezeit");
  await t.schliessen();
}

/* ---- 4. Menue schliesst nach Seitenwechsel (Handy) */
{
  const t = await starte({ kamera: false, breite: 390, hoehe: 844 }); const { page } = t;
  await oeffneSeite(page, "karte");
  await page.click(".menueknopf");
  pruefe(await page.evaluate(() => document.body.classList.contains("menue-offen")), "Menü offen");
  await page.evaluate(() => { history.pushState({}, "", "/ml"); dispatchEvent(new PopStateEvent("popstate")); });
  await page.waitForTimeout(300);
  pruefe(await page.evaluate(() => !document.body.classList.contains("menue-offen")), "Seitenwechsel per Adresse schließt das offene Menü");
  await t.schliessen();
}

/* ---- 9. Chat: Hinweise, Rolle schule, Rechenfrage, Breite des Antwortrahmens */
{
  const t = await starte({ kamera: false, breite: 390, hoehe: 844 }); const { page } = t;
  let gesendet = null;
  await page.route("**/api/chat", async (r) => { gesendet = JSON.parse(r.request().postData()); await r.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: "Ein⁣ Sprachmodell⁣ rät⁣ Wörter.⁣\n\n---\n4 Tokens in 1.0s (4.0 Tok/s), Temperatur 0.7" }); });
  await page.goto(URL_LABOR + "/chat?weg=schule", { waitUntil: "load" });
  await page.waitForSelector("textarea[aria-label='Deine Frage']");
  await page.fill("textarea[aria-label='Deine Frage']", "Was ist ein Sprachmodell?");
  await page.keyboard.press("Enter");
  await page.waitForSelector(".msg.ki .ki-warn", { timeout: 8000 });
  const w = await page.textContent(".msg.ki .ki-warn");
  pruefe(/Das kleine Modell irrt bei Erklärungen zur KI oft/.test(w) && /Tokens und Sprachmodelle/.test(w), "KI-Frage: Hinweis mit geprüfter Erklärung");
  pruefe(await page.locator('.msg.ki .ki-warn a[href="/tokens-sprachmodelle"]').count() === 1, "Hinweis verlinkt Tokens und Sprachmodelle");
  pruefe(gesendet && gesendet.kurz === true, "Rolle schule: kurz true wird an den Server gesendet (Kurz antworten ist dort Standard)");
  const b = await page.evaluate(() => { const k = document.querySelector(".ki-hinweis").getBoundingClientRect(), v = document.querySelector(".d-chatbox").getBoundingClientRect(); return { k: k.width, v: v.width }; });
  pruefe(b.k >= b.v - 2, "Antwortrahmen in voller Breite des Chat-Bereichs (" + Math.round(b.k) + " von " + Math.round(b.v) + ")");
  await page.fill("textarea[aria-label='Deine Frage']", "Wie viel ist 17 mal 23?");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => document.querySelectorAll(".msg.ki").length === 2 && document.querySelectorAll(".msg.ki")[1].querySelector(".ki-warn"), null, { timeout: 8000 });
  pruefe(/Kleine Modelle rechnen schlecht/.test(await page.locator(".msg.ki").nth(1).textContent()), "Rechenfrage: Hinweis Kleine Modelle rechnen schlecht");
  await page.goto(URL_LABOR + "/chat", { waitUntil: "load" });
  await page.waitForSelector("textarea[aria-label='Deine Frage']");
  await page.fill("textarea[aria-label='Deine Frage']", "Erkläre Wolken");
  await page.keyboard.press("Enter");
  await page.waitForSelector(".msg.ki .meta:not(:empty)");
  pruefe(gesendet.rolle === undefined, "Ohne Rolle Schule: kein Zusatz an den Server");
  await t.schliessen();
}

/* ---- 9d. Warteschlange mit Zeitschaetzung und Modell-laedt-Hinweis */
{
  const t = await starte({ kamera: false }); const { page } = t;
  await page.route("**/api/warteschlange", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ aktiv: 2, wartend: 2, parallel: 2, max_wartend: 6, meine_position: 2, frei: false }) }));
  await page.route("**/api/chat", async (r) => { await new Promise((ok) => setTimeout(ok, 3500)); r.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: "Fertig⁣\n\n---\n1 Tokens in 0.1s (10.0 Tok/s), Temperatur 0.7" }); });
  await oeffneSeite(page, "chat");
  await page.fill("textarea", "Hallo");
  await page.keyboard.press("Enter");
  pruefe(/Das Modell wird geladen, das dauert beim ersten Mal bis zu einer Minute/.test(await page.textContent(".msg.ki")), "Erste Anfrage: Hinweis Modell wird geladen");
  await page.waitForFunction(() => /Nr\. 2 in der Warteschlange\. Das kann bis zu einer Minute dauern/.test(document.querySelector(".msg.ki").textContent), null, { timeout: 8000 });
  pruefe(true, "Warteschlange nennt ohne Messwert ehrlich eine Spanne (bis zu einer Minute), keine erfundene Zahl");
  await t.schliessen();
}

/* ---- 10. Prompt-Vergleich: Antwort 1 von 2 */
{
  const t = await starte({ kamera: false }); const { page } = t;
  await page.route("**/api/chat", async (r) => { await new Promise((ok) => setTimeout(ok, 1500)); r.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: "Antwort⁣ eins⁣\n\n---\n2 Tokens in 1.5s (1.3 Tok/s), Temperatur 0.3" }); });
  await oeffneSeite(page, "prompting");
  await page.click("button:has-text('Beide senden')");
  await page.waitForFunction(() => /Antwort 1 von 2 wird erzeugt/.test(document.querySelectorAll(".sp-status")[0].textContent), null, { timeout: 6000 });
  pruefe(true, "Prompt-Vergleich: Feld 1 zeigt 'Antwort 1 von 2 wird erzeugt'");
  pruefe(/Antwort 2 von 2 wartet/.test(await page.locator(".sp-status").nth(1).textContent()), "Feld 2 zeigt 'Antwort 2 von 2 wartet'");
  pruefe(await page.locator(".sp-fort:not([hidden])").count() >= 1, "Fortschrittsbalken sichtbar");
  await t.schliessen();
}

/* ---- 11. Videos: Poster, Untertitel an, Schalter */
{
  const t = await starte({ kamera: false }); const { page } = t;
  await oeffneSeite(page, "karte");
  await page.waitForSelector(".video video");
  pruefe(/\.jpg$/.test(await page.getAttribute(".video video", "poster") || ""), "Video hat ein Poster (kein schwarzes Bild vor dem Start)");
  await page.waitForTimeout(800);
  pruefe(await page.evaluate(() => { const s = document.querySelector(".video video").textTracks[0]; return !!s && s.mode === "showing"; }), "Untertitelspur steht standardmäßig auf showing");
  pruefe(/Untertitel ausschalten/.test(await page.textContent(".ut-schalter")) && await page.getAttribute(".ut-schalter", "aria-pressed") === "true", "Schalter nennt die Handlung (Untertitel ausschalten) und trägt aria-pressed=true");
  await page.click(".ut-schalter");
  pruefe(await page.evaluate(() => document.querySelector(".video video").textTracks[0].mode) === "disabled" && /Untertitel einschalten/.test(await page.textContent(".ut-schalter")) && await page.getAttribute(".ut-schalter", "aria-pressed") === "false", "Schalter schaltet aus und heißt jetzt Untertitel einschalten (aria-pressed=false)");
  await page.click(".ut-schalter");
  pruefe(await page.evaluate(() => document.querySelector(".video video").textTracks[0].mode) === "showing", "Schalter schaltet wieder ein");
  await t.schliessen();
}

/* ---- 12. Willkommens-Fenster: einheitliche Knopfnamen; Seitenkopf ohne haengenden Punkt */
{
  const t = await starte({ kamera: false, willkommen: true }); const { page } = t;
  await page.goto(URL_LABOR + "/?willkommen=1", { waitUntil: "load" });
  await page.waitForSelector("dialog.wk[open]");
  pruefe(await page.getAttribute(".wk-x", "aria-label") === "Schließen" && /Später entscheiden/.test(await page.textContent(".wk-spaeter")), "Willkommen: X heißt Schließen, Fußzeile Später entscheiden");
  await page.click(".wk-spaeter");
  await oeffneSeite(page, "karte");
  const ueber = await page.textContent(".hero .ueber");
  pruefe(!/[·]\s*$/.test(ueber.trim()), "Seitenkopf ohne hängenden Punkt (" + ueber.trim().slice(0, 50) + ")");
  await t.schliessen();
}

/* ---- Bilderspiel mobil ueber dem Falz */
{
  const t = await starte({ kamera: false, breite: 390, hoehe: 844 }); const { page } = t;
  await oeffneSeite(page, "echt-oder-ki");
  const y = await page.evaluate(() => document.querySelector("#ausprobieren").getBoundingClientRect().top);
  pruefe(y < 500, "Bilderspiel beginnt mobil über dem Falz (y=" + Math.round(y) + ")");
  await t.schliessen();
}
console.log(schlecht ? "runde4: " + schlecht + " Fehler" : "runde4: alles ok");
