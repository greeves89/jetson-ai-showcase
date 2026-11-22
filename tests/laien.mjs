// node tests/laien.mjs [hell]: Einsteiger-Funktionen ohne Sprachmodell-Anfrage (Anfragen werden abgefangen).
//   Einwilligung vor Kamera und Mikrofon, freundliche Last-Zustaende mit Wiederholung, Startseite, Suche mit Synonymen,
//   Skip-Link, Pfeiltasten im Menue, Zurueck-Knopf, Unfertiges, Handy-Kopf, Touch-Ziele, Seite "Ist das sicher?".
import { starte, URL_LABOR, oeffneSeite } from "./browser.mjs";
let schlecht = 0;
const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) { schlecht++; process.exitCode = 1; } };

/* ---- 1. Einwilligung (Erstbesuch, ohne gemerkte Zustimmung) */
{
  const t = await starte({ einwilligung: false });
  const { page } = t;
  await oeffneSeite(page, "gesicht");
  await page.click("button:has-text('Kamera starten')");
  await page.waitForSelector("dialog.einw[open]");
  const text = await page.textContent("dialog.einw");
  pruefe(/Gesichtserkennung: ausdrücklich einwilligen/.test(text), "Gesicht: Dialog verlangt ausdrückliche Einwilligung");
  pruefe(/Wozu/.test(text) && /Wohin/.test(text) && /Was bleibt/.test(text) && /Stoppen/.test(text) && /Kostenlos und ohne Anmeldung/.test(text), "Zweck, Weg des Bildes, Speicherung, Stoppen, kostenlos stehen drin");
  pruefe(/nichts gespeichert/i.test(text) || /Es wird nichts gespeichert/.test(text), "sagt: nichts wird gespeichert");
  pruefe(await page.locator("dialog.einw a[href='/sicherheit-einfach']").count() === 1, "Link zu Ist das sicher?");
  pruefe(await page.evaluate(() => !localStorage.getItem("kl-einwilligung")), "vor der Zustimmung ist nichts gemerkt");
  await page.click("dialog.einw button:has-text('Ohne Kamera weitermachen')");
  await page.waitForFunction(() => !document.querySelector("dialog.einw"));
  pruefe(/nicht eingewilligt/.test(await page.textContent(".d-meldung")), "Ablehnen: freundlicher Hinweis, Labor bleibt bedienbar");
  pruefe(await page.evaluate(() => !localStorage.getItem("kl-einwilligung")), "Ablehnen merkt nichts");
  await page.click("button:has-text('Kamera starten')");
  await page.waitForSelector("dialog.einw[open]");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog.einw"));
  pruefe(true, "Esc schliesst den Dialog wie Ablehnen");
  await page.click("button:has-text('Kamera starten')");
  await page.waitForSelector("dialog.einw[open]");
  pruefe(/Kontrollkästchen|willige ein/.test(await page.textContent("dialog.einw")) && await page.$eval("dialog.einw input[type=checkbox]", (c) => !c.checked), "Gesichtserkennung: Kontrollkaestchen ist nicht vorbelegt");
  pruefe(/ab 16 Jahren/.test(await page.textContent("dialog.einw")) && /Datenschutzerklärung/.test(await page.textContent("dialog.einw")), "Hinweise: ab 16, Datenschutzerklaerung verlinkt");
  pruefe(await page.$eval("dialog.einw button.primary", (b) => b.disabled), "Knopf bleibt ohne Haken gesperrt");
  await page.click("dialog.einw input[type=checkbox]");
  await page.click("dialog.einw button.primary");
  await page.waitForSelector(".d-steuer button:has-text('Kamera stoppen')", { timeout: 15000 }).catch(() => {});
  pruefe(await page.evaluate(() => !!sessionStorage.getItem("kl-einwilligung-bio") && !localStorage.getItem("kl-einwilligung")), "biometrisch: nur je Sitzung gemerkt (sessionStorage)");
  pruefe(await page.locator(".fuss-widerruf:not([hidden])").count() === 1, "Fusszeile zeigt 'Einwilligung widerrufen'");
  await page.click(".fuss-widerruf button");
  pruefe(await page.evaluate(() => !sessionStorage.getItem("kl-einwilligung-bio")), "Widerruf loescht den Eintrag");
  pruefe(await page.evaluate(() => { const v = document.querySelector("video"); return !v || !v.srcObject || v.srcObject.getTracks().every((x) => x.readyState === "ended"); }), "Widerruf stoppt die laufende Kamera");
  pruefe(await page.locator("dialog.einw").count() === 0, "Dialog ist weg");
  await page.screenshot({ path: "tests/ausgabe/laien-einwilligung-gestartet.png" });
  await t.schliessen();
}
{
  const t = await starte({ einwilligung: false, kamera: false });
  const { page } = t;
  await oeffneSeite(page, "whisper");
  await page.click(".wh-knopf, button:has-text('Aufnahme starten')");
  await page.waitForSelector("dialog.einw[open]");
  pruefe(/Mikrofon/.test(await page.textContent("dialog.einw h2")), "Whisper: Dialog fragt nach dem Mikrofon");
  await page.screenshot({ path: "tests/ausgabe/laien-einwilligung-mikro.png" });
  await t.schliessen();
}
{ // Ohne localStorage (Privatfenster): Dialog kommt, Seite bleibt heil
  const t = await starte({ einwilligung: false });
  await t.kontext.addInitScript(() => { Object.defineProperty(window, "localStorage", { get() { throw new Error("gesperrt"); } }); });
  await oeffneSeite(t.page, "gesicht");
  await t.page.click("button:has-text('Kamera starten')");
  await t.page.waitForSelector("dialog.einw[open]");
  pruefe(true, "ohne localStorage: Dialog funktioniert");
  await t.schliessen();
}

{ // Objekterkennung: Information und Klick reichen (kein Wiedererkennen)
  const t = await starte({ einwilligung: false });
  await oeffneSeite(t.page, "objekt");
  await t.page.click("button:has-text('Kamera starten')");
  await t.page.waitForSelector("dialog.einw[open]");
  pruefe(await t.page.locator("dialog.einw input[type=checkbox]").count() === 0 && !/Wiedererkennung/.test(await t.page.textContent("dialog.einw")), "Objekterkennung: Information ohne Haken");
  await t.schliessen();
}

/* ---- 2. Last: 503 ausgelastet mit automatischem Wiederholen, Wiederholknopf */
{
  const t = await starte({ kamera: false });
  const { page } = t;
  let n = 0;
  await page.route("**/api/chat", (r) => { n++; r.fulfill({ status: 503, contentType: "application/json", headers: { "Retry-After": "3" }, body: JSON.stringify({ fehler: "Der Rechner ist gerade ausgelastet, weil viele Menschen das Labor nutzen. Du hast nichts falsch gemacht. Versuch es gleich noch einmal.", belegt: true, wiederholen_s: 3 }) }); });
  await oeffneSeite(page, "chat");
  await page.fill("textarea", "Hallo");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => /Wiederholung 1 von 3/.test(document.querySelector(".msg.ki").textContent), null, { timeout: 15000 });
  const satz = await page.textContent(".msg.ki");
  pruefe(/ausgelastet, nichts falsch gemacht\. Neuer Versuch in \d s \(Wiederholung 1 von 3\)/.test(satz), "Zaehler beim automatischen Wiederholen: " + satz.trim().slice(0, 90));
  await page.waitForFunction(() => document.querySelector(".msg.ki .meta button"), null, { timeout: 30000 });
  pruefe(n === 4, "ein Versuch plus drei Wiederholungen = " + n + " Anfragen");
  const ende = await page.textContent(".msg.ki");
  pruefe(/ausgelastet/.test(ende) && !/Keine Antwort|nicht geklappt/.test(ende), "Endtext freundlich: " + ende.trim().slice(0, 70));
  pruefe(await page.locator(".msg.du").count() === 1, "Frage steht genau einmal im Verlauf");
  await page.screenshot({ path: "tests/ausgabe/laien-last-chat.png" });
  await page.unroute("**/api/chat");
  await page.route("**/api/chat", (r) => r.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: "Hallo⁣ Welt⁣\n\n---\n2 Tokens in 0.1s (20.0 Tok/s), Temperatur 0.7" }));
  await page.click(".msg.ki .meta button");
  await page.waitForFunction(() => /Hallo Welt/.test(document.querySelector(".msg.ki").textContent), null, { timeout: 10000 });
  pruefe(await page.locator(".msg.du").count() === 1 && await page.locator(".msg.ki").count() === 1, "Wiederholknopf: neue Antwort ersetzt die alte, Frage nicht doppelt");
  pruefe(t.fehler.every((f) => /status of 503/.test(f)), "Konsole sauber (ausser den bewusst abgefangenen 503) " + t.fehler.filter((f) => !/status of 503/.test(f)).join("; "));
  await t.schliessen();
}
{ // Platznummer: Schlange meldet Position 2, Antwort kommt verzoegert
  const t = await starte({ kamera: false });
  const { page } = t;
  await page.route("**/api/warteschlange", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ aktiv: 2, wartend: 2, parallel: 2, max_wartend: 6, meine_position: 2, frei: false }) }));
  await page.route("**/api/chat", async (r) => { await new Promise((ok) => setTimeout(ok, 3500)); r.fulfill({ status: 200, contentType: "text/plain; charset=utf-8", body: "Fertig⁣\n\n---\n1 Tokens in 0.1s (10.0 Tok/s), Temperatur 0.7" }); });
  await oeffneSeite(page, "chat");
  await page.fill("textarea", "Hallo");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => /Du bist Nr\. 2 in der Warteschlange/.test(document.querySelector(".msg.ki").textContent), null, { timeout: 8000 });
  pruefe(true, "Platzanzeige im Chat: Du bist Nr. 2 in der Warteschlange");
  await page.screenshot({ path: "tests/ausgabe/laien-last-platz.png" });
  await t.schliessen();
}

/* ---- 3. Startseite, Suche, Tastatur, Zurueck */
{
  const t = await starte({ kamera: false });
  const { page } = t;
  await oeffneSeite(page, "start");
  const kopf = await page.evaluate(() => { const r = document.querySelector(".hero").getBoundingClientRect(); return document.querySelector(".hero").innerText + "|" + document.querySelector(".seite").innerText; });
  pruefe(!/Jetson|GPU|in diesem Netz/.test(kopf), "erster Bildschirm ohne Jetson, GPU, 'in diesem Netz'");
  pruefe(/Kostenlos/.test(kopf) && /Ohne Anmeldung/.test(kopf), "kostenlos und ohne Anmeldung sichtbar");
  pruefe(/Neu hier\? Hier anfangen/.test(kopf) && /In 15 Minuten|in 15 Minuten/.test(kopf), "Knoepfe: Neu hier und Entscheider");
  pruefe(/Der Rechner (ist bereit|meldet sich)|Gerade viel los/.test(await page.textContent(".statuschip")), "Status in Klartext: " + (await page.textContent(".statuschip")).trim());
  pruefe((await page.$$eval("#anfangen .start-schritte li", (l) => l.length)) === 3, "drei Schritte unter Neu hier");
  pruefe((await page.$$eval("#entscheider .start-schritte li", (l) => l.length)) === 4, "vier feste Seiten fuer Entscheider");
  pruefe(/Was ist ein Jetson\?/.test(await page.textContent(".start-fuss")), "Jetson in einem Satz weiter unten erklaert");
  pruefe(await page.locator(".hero .gl").count() >= 1, "Glossarbegriff auf der Startseite");
  const gl = await page.evaluate(() => { const g = document.querySelector(".hero .gl"); const c = getComputedStyle(g); const a = getComputedStyle(g, "::after"); return { bg: c.backgroundColor, u: c.textDecorationLine, q: a.content }; });
  pruefe(gl.u.includes("underline") && gl.bg !== "rgba(0, 0, 0, 0)" && /\?/.test(gl.q), "Fachwort sichtbar markiert (Tint, Unterstrich, Fragezeichen)");
  await page.click("a:has-text('Neu hier? Hier anfangen')");
  await page.waitForTimeout(900);
  pruefe(await page.evaluate(() => document.getElementById("anfangen").getBoundingClientRect().top < 200), "Neu hier scrollt zu den drei Schritten");
  // Skip-Link
  await page.goto("about:blank");
  await oeffneSeite(page, "karte");
  await page.keyboard.press("Tab");
  pruefe(await page.evaluate(() => document.activeElement.classList.contains("skip")), "erster Tab landet auf 'Zum Inhalt springen'");
  await page.keyboard.press("Enter");
  pruefe(await page.evaluate(() => document.activeElement.id === "inhalt"), "Skip-Link setzt den Fokus in den Inhalt");
  // Suche
  const suche = async (q) => { await page.fill("#nav-suche", q); await page.waitForTimeout(250); return page.evaluate(() => ({ seiten: [...document.querySelectorAll("a.nav")].filter((a) => !a.hidden && !a.closest("[hidden]")).map((a) => a.dataset.id), box: document.querySelector("#such-ergebnis").hidden ? "" : document.querySelector("#such-ergebnis").innerText })); };
  for (const [q, erwartet] of [["ChatGPT", "chat"], ["KI-Assistent", "agent"], ["Datenschutz", "recht"], ["DSGVO", "recht"], ["Foto", "gesicht"], ["Handy", "gesicht"], ["Halluzination", "llm-grenzen"], ["Cookie", "sicherheit-einfach"]]) {
    const r = await suche(q);
    pruefe(r.seiten.includes(erwartet), `Suche "${q}" findet ${erwartet} (${r.seiten.length} Seiten)`);
  }
  const hal = await suche("Halluzination");
  pruefe(/Begriff erklärt/.test(hal.box) && /Halluzination/.test(hal.box), "Suche zeigt die Begriffserklärung");
  const leer = await suche("Zebrafinkenzucht");
  pruefe(leer.seiten.length === 0 && /nichts gefunden/.test(leer.box) && /Probiere/.test(leer.box), "leerer Treffer: Hinweis und Vorschlaege");
  const tippfehler = await suche("Datenschtz");
  pruefe(/Meintest du/.test(tippfehler.box), "Tippfehler: 'Meintest du ...'");
  await page.click("#such-ergebnis .chip >> nth=0");
  await page.waitForTimeout(250);
  pruefe((await page.inputValue("#nav-suche")).length > 0, "Vorschlag fuellt das Suchfeld");
  await page.fill("#nav-suche", "");
  await page.dispatchEvent("#nav-suche", "input");
  // Pfeiltasten im Menue
  await page.focus(".navkopf[aria-expanded=false] >> nth=0");
  await page.keyboard.press("ArrowRight");
  pruefe(await page.evaluate(() => document.activeElement.getAttribute("aria-expanded") === "true"), "Pfeil rechts oeffnet die Gruppe");
  await page.keyboard.press("ArrowDown");
  pruefe(await page.evaluate(() => document.activeElement.matches("a.nav")), "Pfeil runter springt zur ersten Seite der Gruppe");
  await page.keyboard.press("ArrowLeft");
  pruefe(await page.evaluate(() => document.activeElement.matches(".navkopf")), "Pfeil links springt zur Gruppe zurueck");
  // Zurueck-Knopf
  await oeffneSeite(page, "karte");
  pruefe(/Zur Startseite/.test(await page.textContent(".zurueck")), "direkt gelandet: Zur Startseite");
  await page.click("#inhalt .weiter a >> nth=0");
  await page.waitForTimeout(500);
  pruefe(/Zurück/.test(await page.textContent(".zurueck")), "nach einem Klick im Labor: Zurück");
  await page.click(".zurueck");
  await page.waitForTimeout(500);
  pruefe(new URL(page.url()).pathname === "/karte", "Zurück fuehrt auf die vorige Seite: " + new URL(page.url()).pathname);
  // Lesemodus
  pruefe((await page.$$eval(".lesemodus button", (b) => b.map((x) => x.textContent.trim()))).join("|") === "Kurz lesen|Genau lesen", "Umschalter heisst Kurz lesen / Genau lesen");
  pruefe(/Du liest gerade kurz/.test(await page.textContent(".lese-hilfe")), "Hilfetext erklaert den Umschalter");
  await page.click(".lesemodus button[data-modus=ausfuehrlich]");
  pruefe(/Du liest gerade genau/.test(await page.textContent(".lese-hilfe")), "Hilfetext wechselt mit");
  await page.click(".lesemodus button[data-modus=kompakt]");
  // Unfertiges
  await oeffneSeite(page, "bild");
  const navBild = await page.evaluate(() => document.querySelector('a.nav[data-id=bild]').textContent.trim());
  pruefe(/Bilder erzeugen\s+in Arbeit/.test(navBild), "Menue: 'Bilder erzeugen in Arbeit' statt 'Bilder erzeugenbald': " + navBild);
  pruefe(/In Arbeit/.test(await page.textContent(".in-arbeit")) && !/Demo folgt/.test(await page.textContent("#inhalt")), "Seite: 'In Arbeit' statt 'Demo folgt'");
  // Sicherheitsseite
  await oeffneSeite(page, "sicherheit-einfach");
  const si = await page.textContent("#inhalt");
  pruefe(/kl_s/.test(si) && /kl-einwilligung/.test(si) && /Kamera und Mikrofon/.test(si) && /Texte, die du eintippst/.test(si), "Sicherheitsseite nennt Cookie, localStorage, Kamera, Mikro, Texte");
  pruefe(await page.locator("#inhalt a[href^='https://daniel-alisch.site']").count() === 2, "Links zu Datenschutzerklaerung und Impressum");
  await page.evaluate(() => localStorage.setItem("kl-einwilligung", JSON.stringify({ kamera: "x" })));
  await oeffneSeite(page, "sicherheit-einfach");
  await page.click("#ausprobieren button:has-text('Widerrufen') >> nth=0");
  pruefe(await page.evaluate(() => !JSON.parse(localStorage.getItem("kl-einwilligung") || "{}").kamera), "Widerrufen loescht den Eintrag");
  await page.screenshot({ path: "tests/ausgabe/laien-sicherheit.png", fullPage: true });
  pruefe(await page.locator("footer a[href='/sicherheit-einfach']").count() === 1, "Fusszeile verlinkt Ist das sicher?");
  // Use-Case: In 3 Schritten, Handwerk
  await oeffneSeite(page, "uc-handel-regal");
  pruefe(await page.locator(".drei-schritte li").count() === 3, "Use-Case: In 3 Schritten bei dir");
  await page.click(".drei-schritte label >> nth=0");
  pruefe(await page.locator(".drei-schritte input:checked").count() === 1, "Checkliste laesst sich abhaken");
  await oeffneSeite(page, "uc-handwerk");
  pruefe((await page.$$eval("#inhalt h2.abs", (h) => h.map((x) => x.textContent))).join("|") === "Angebot aus einer Notiz|Baustellenfoto prüfen|Rechnungen sortieren" && await page.locator(".abschnitt .v-bild, .abschnitt [class^=v-]").count() >= 3, "Handwerk: drei Abschnitte mit Bild");
  pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
  await t.schliessen();
}

/* ---- 4. Handy: Kopf kurz, Lesemodus wandert mit, Touch-Ziele */
{
  const t = await starte({ kamera: false, breite: 390, hoehe: 844 });
  const { page } = t;
  await oeffneSeite(page, "gesicht");
  const y = await page.evaluate(() => { const l = document.querySelector("#ausprobieren").getBoundingClientRect(); return { lab: Math.round(l.top), leiste: getComputedStyle(document.querySelector(".leiste")).position }; });
  pruefe(y.lab < 400, "Handy: Labor beginnt bei " + y.lab + " px (vorher etwa 600)");
  pruefe(y.leiste === "relative", "Handy: Lesemodus-Leiste klebt nicht mehr fest");
  await page.evaluate(() => window.scrollTo(0, 600));
  pruefe(await page.evaluate(() => document.querySelector(".leiste").getBoundingClientRect().bottom < 70), "Handy: nach dem Scrollen bleibt nur der schmale Kopf");
  const kleine = [];
  for (const id of ["karte", "ml", "gesicht", "chat", "start"]) {
    await oeffneSeite(page, id);
    kleine.push(...await page.evaluate((id) => [...document.querySelectorAll("#inhalt button:not(.gl), #inhalt a.btn, .leiste button, .zurueck")].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 43.5 && !e.closest("[hidden]"); }).map((e) => id + ":" + e.tagName + "." + String(e.className).slice(0, 24) + "(" + Math.round(e.getBoundingClientRect().height) + ")"), id));
  }
  pruefe(kleine.length === 0, "Touch-Ziele mindestens 44 px auf 5 Seiten" + (kleine.length ? ": " + [...new Set(kleine)].slice(0, 8).join(", ") : ""));
  await t.schliessen();
}
{ // Beispiel starten scrollt zum Labor
  const t = await starte({ kamera: false, breite: 390, hoehe: 844 });
  const { page } = t;
  await page.goto(`${URL_LABOR}/objekt?beispiel=logistik-zaehlen`, { waitUntil: "load" });
  await page.waitForSelector(".d-beispiel .d-bsp-kopf", { timeout: 15000 });
  await page.waitForTimeout(1500);
  pruefe(await page.evaluate(() => window.scrollY > 100), "Beispiel starten: Seite scrollt zum Labor (scrollY " + (await page.evaluate(() => Math.round(window.scrollY))) + ")");
  await page.waitForFunction(() => /Gefunden:/.test((document.querySelector(".live .erklaerung") || {}).textContent || ""), null, { timeout: 40000 }).catch(() => {});
  pruefe(await page.evaluate(() => /Gefunden:/.test((document.querySelector(".live .erklaerung") || {}).textContent || "")), "Beispiel startet selbst: erstes Bild ist ausgewertet");
  await page.screenshot({ path: "tests/ausgabe/laien-beispiel-handy.png" });
  await t.schliessen();
}
console.log(schlecht ? "\n" + schlecht + " FEHLER" : "\nalles ok");
