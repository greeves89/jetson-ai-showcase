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

{ // Einwilligung A2: kein Wort "null", 16+ oben, Mikrofon-Haken, Esc, Touch-Ziele, ehrlicher Ablehnen-Text, Handy
  const t = await starte({ einwilligung: false, breite: 390, hoehe: 844 });
  const { page } = t;
  const dlgTest = async (id, knopf, name) => {
    await oeffneSeite(page, id);
    await page.click(knopf);
    await page.waitForSelector("dialog.einw[open]");
    const text = await page.textContent("dialog.einw");
    pruefe(!/\bnull\b|undefined/.test(text), name + ": kein null/undefined im Dialog");
    pruefe(await page.evaluate(() => { const d = document.querySelector("dialog.einw"), a = d.querySelector(".einw-alter"); const r = a.getBoundingClientRect(), dr = d.getBoundingClientRect(); return /ab 16 Jahren/.test(a.textContent) && /Eltern/.test(a.textContent) && r.bottom < dr.top + 200 && d.scrollTop === 0; }), name + ": 16+ und Eltern oben sichtbar");
    pruefe(await page.evaluate(() => { const d = document.querySelector("dialog.einw"); return d.contains(document.activeElement); }), name + ": Fokus liegt im Dialog");
    pruefe(await page.evaluate(() => [...document.querySelectorAll("dialog.einw button, dialog.einw .einw-klein a, dialog.einw .einw-box")].every((e) => e.getBoundingClientRect().height >= 43.5)), name + ": Touch-Ziele mindestens 44 px");
    await page.screenshot({ path: "tests/ausgabe/laien-einw-" + id + "-handy.png" });
    return text;
  };
  await dlgTest("gesicht", "button:has-text('Kamera starten')", "Gesicht");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog.einw"));
  pruefe(!(await page.textContent("body")).includes("mit den Beispielbildern weitermachen"), "Gesicht: kein Versprechen von Beispielbildern nach Ablehnen");
  await dlgTest("objekt", "button:has-text('Kamera starten')", "Objekt");
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog.einw"));
  await dlgTest("whisper", ".wh-knopf, button:has-text('Aufnahme starten')", "Mikrofon");
  pruefe(await page.$eval("dialog.einw button.primary", (b) => b.disabled) && await page.locator("dialog.einw input[type=checkbox]").count() === 1, "Mikrofon: Haken nicht vorbelegt, Knopf gesperrt");
  await page.keyboard.press("Escape");
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
  const einstieg = await page.textContent("#einstiege");
  pruefe(/Neu hier/.test(einstieg) && /In 15 Minuten/.test(einstieg) && /Alle Bereiche/.test(einstieg) && await page.locator("#einstiege .karte").count() === 3, "ohne Rolle: drei große Einstiege (Neu hier, In 15 Minuten, Alle Bereiche)");
  pruefe(await page.locator("#weitere").count() === 1 && await page.$eval("#weitere", (d) => !d.open), "Weitere Wege ist zugeklappt");
  pruefe(/Der Rechner (ist bereit|meldet sich)|Gerade viel los/.test(await page.textContent(".statuschip")), "Status in Klartext: " + (await page.textContent(".statuschip")).trim());
  pruefe((await page.$$eval("#anfangen .start-schritte li", (l) => l.length)) === 3, "drei Schritte unter Neu hier");
  pruefe((await page.$$eval("#entscheider .start-schritte li", (l) => l.length)) === 4, "vier feste Seiten fuer Entscheider");
  pruefe(/Was ist ein Jetson\?/.test(await page.textContent(".start-fuss")), "Jetson in einem Satz weiter unten erklaert");
  pruefe(await page.locator(".hero .gl").count() >= 1, "Glossarbegriff auf der Startseite");
  const gl = await page.evaluate(() => { const g = document.querySelector(".hero .gl"); const c = getComputedStyle(g); const a = getComputedStyle(g, "::after"); return { bg: c.backgroundColor, u: c.textDecorationLine, q: a.content }; });
  pruefe(gl.u.includes("underline") && gl.bg !== "rgba(0, 0, 0, 0)" && /\?/.test(gl.q), "Fachwort sichtbar markiert (Tint, Unterstrich, Fragezeichen)");
  await page.click("#einstiege a:has-text('Hier anfangen')");
  await page.waitForTimeout(900);
  pruefe(await page.evaluate(() => document.getElementById("anfangen").getBoundingClientRect().top < 300 && document.getElementById("weitere").open), "Neu hier öffnet Weitere Wege und scrollt zu den drei Schritten");
  // Skip-Link
  await page.goto("about:blank");
  await oeffneSeite(page, "karte");
  await page.keyboard.press("Tab");
  pruefe(await page.evaluate(() => document.activeElement.classList.contains("skip")), "erster Tab landet auf 'Zum Inhalt springen'");
  await page.keyboard.press("Enter");
  pruefe(await page.evaluate(() => document.activeElement.id === "inhalt"), "Skip-Link setzt den Fokus in den Inhalt");
  // Suche
  const suche = async (q) => { await page.fill("#nav-suche", q); await page.waitForTimeout(250); return page.evaluate(() => ({ seiten: [...document.querySelectorAll("a.nav")].filter((a) => !a.hidden && !a.closest("[hidden]")).map((a) => a.dataset.id), box: document.querySelector("#such-ergebnis").hidden ? "" : document.querySelector("#such-ergebnis").innerText })); };
  for (const [q, erwartet] of [["ChatGPT", "chat"], ["KI-Assistent", "agenten-grundlagen"], ["Datenschutz", "recht"], ["DSGVO", "recht"], ["Foto", "gesicht"], ["Handy", "gesicht"], ["Halluzination", "llm-grenzen"], ["Cookie", "sicherheit-einfach"]]) {
    const r = await suche(q);
    pruefe(r.seiten.includes(erwartet), `Suche "${q}" findet ${erwartet} (${r.seiten.length} Seiten)`);
  }
  // Alltagswoerter: der erste Treffer ist die passende Seite (Rangfolge, nicht Menuereihenfolge)
  for (const [q, erster] of [["ChatGPT", "chat"], ["Roboter", "robotik"], ["Hausaufgaben", "prompting"], ["Fake News", "llm-grenzen"], ["TikTok", "empfehlungen"], ["Spotify", "empfehlungen"], ["Backpropagation", "training"], ["Gehirn", "neuronale-netze"], ["Wer haftet", "recht"], ["Urheberrecht", "recht"], ["Handy entsperren", "gesicht"], ["Snapchat-Filter", "gesicht"]]) {
    const r = await suche(q);
    pruefe(r.seiten[0] === erster, `Suche "${q}": erster Treffer ${erster} (ist ${r.seiten[0]})`);
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
  if ((await page.getAttribute(".nav-alle", "aria-expanded")) !== "true") await page.click(".nav-alle");
  pruefe(await page.locator(".navgruppe .navkopf:visible").count() >= 8, "Alle Bereiche klappt die Gruppen auf (Akkordeon, jeweils zu)");
  await page.focus(".nav-alle-inhalt .navkopf[aria-expanded=false]:visible >> nth=0");
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
  pruefe(await page.locator(".lese-hilfe").count() === 0, "Lesehinweis erscheint nur einmal pro Sitzung (schon gesehen)");
  await page.evaluate(() => sessionStorage.removeItem("kl-hilfe"));
  await oeffneSeite(page, "karte");
  pruefe(/Du liest gerade kurz/.test(await page.textContent(".lese-hilfe")), "Hilfetext erklaert den Umschalter");
  await oeffneSeite(page, "ml");
  pruefe(await page.locator(".lese-hilfe").count() === 0, "Zweite Lektion: kein Lesehinweis mehr");
  await page.evaluate(() => sessionStorage.removeItem("kl-hilfe"));
  await oeffneSeite(page, "karte");
  await page.click(".lesemodus button[data-modus=ausfuehrlich]");
  pruefe(/Du liest gerade genau/.test(await page.textContent(".lese-hilfe")), "Hilfetext wechselt mit");
  await page.click(".lesemodus button[data-modus=kompakt]");
  // Unfertiges: steht weder im Menue noch auf der Startseite, die Seite selbst ist als Vorschau gekennzeichnet
  await oeffneSeite(page, "bild");
  pruefe(await page.locator("a.nav[data-id=bild], a.nav[data-id=faceswap]").count() === 0, "Menue: Bilder erzeugen und Face-Swap fehlen (versteckte Seiten)");
  pruefe(/Vorschau/.test(await page.textContent(".in-arbeit")) && !/Demo folgt/.test(await page.textContent("#inhalt")), "Seite: als Vorschau gekennzeichnet, kein 'Demo folgt'");
  await oeffneSeite(page, "start");
  const menueStart = await page.evaluate(() => document.querySelector("#nav-liste").textContent + "|" + document.querySelector("#inhalt").innerText);
  pruefe(!/\b(bald|folgt|in Arbeit)\b/i.test(menueStart) && !/Erzeugen/.test(await page.textContent("#nav-liste")), "Menue und Startseite ohne 'bald', 'folgt', 'in Arbeit'");
  const suchBild = await suche("Face-Swap");
  pruefe(!suchBild.seiten.includes("faceswap"), "Suche zeigt versteckte Seiten nicht");
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
/* ---- 5. Lernplattform: Lernziele, Fortschritt, Rollenwahl, Klassenlink, Mit Mathe, 16+ */
{
  const t = await starte({ kamera: false, einwilligung: false });
  const { page } = t;
  const ls = (k) => page.evaluate((x) => localStorage.getItem(x), k);
  await oeffneSeite(page, "neuronale-netze");
  pruefe(await page.locator("details.lernziele li").count() >= 2 && await page.$eval("details.lernziele", (d) => !d.open) && /ca\. \d+ Min/.test(await page.innerText(".hero .ueber")), "Lektion: Lernziele einzeilig aufklappbar, Lesezeit in der Kopfzeile");
  pruefe(!(await ls("kl-gelesen")), "Öffnen allein zählt nicht als gelesen");
  // Mit Mathe: Kasten nur bei eingeschaltetem Schalter sichtbar
  pruefe(await page.locator(".mathe").first().isHidden(), "Mit Mathe: Kasten ist standardmäßig aus");
  await page.click(".mathe-schalter");
  pruefe(await page.locator(".mathe").first().isVisible() && (await ls("kl-mathe")) === "1", "Mit Mathe: Schalter blendet die Formel ein und merkt sich das");
  await page.click(".mathe-schalter");
  pruefe(await page.locator(".mathe").first().isHidden(), "Mit Mathe: wieder aus");
  // Fortschritt: Ende erreichen
  await oeffneSeite(page, "karte");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  pruefe(!(await ls("kl-gelesen")), "Sofort ans Ende scrollen zählt noch nicht (Mindestdauer)");
  await page.waitForTimeout(5000);
  pruefe(!(await ls("kl-merken")) && !(await ls("kl-gelesen")) && !(await ls("kl-zuletzt")), "Ohne Einwilligung: weder kl-gelesen noch kl-zuletzt noch kl-merken im Speicher");
  pruefe(await page.locator("a.nav[data-id=karte] .ok:not([hidden])").count() === 1, "Ohne Einwilligung zählt der Fortschritt trotzdem für die laufende Ansicht (Haken im Menü)");
  pruefe(await page.locator(".merken-schalter").getAttribute("aria-checked") === "false" && /aus/.test(await page.textContent(".merken-schalter")), "Fußzeile: Fortschritt merken ist aus");
  await page.click(".merken-schalter");
  pruefe((await ls("kl-merken")) === "1" && /karte/.test((await ls("kl-gelesen")) || ""), "Einschalten in der Fußzeile: kl-merken gesetzt, karte steht in kl-gelesen");
  pruefe(await page.locator("a.nav[data-id=karte] .ok:not([hidden])").count() === 1, "Menü zeigt den Haken");
  pruefe(/\d+ Prozent gelesen/.test(await page.textContent(".fs-text")), "Menü zeigt Prozent");
  await oeffneSeite(page, "ml");
  await page.waitForTimeout(600);
  await oeffneSeite(page, "start");
  pruefe(await page.locator("#weiter").count() === 1 && /Weiter, wo du aufgehört hast/.test(await page.textContent("#weiter")), "Startseite: Weiter, wo du aufgehört hast");
  pruefe(/ml/.test(await page.getAttribute("#weiter a.btn", "href")), "Weiter führt zur zuletzt geöffneten, ungelesenen Seite (ml)");
  pruefe(/ab 16 Jahren/.test(await page.textContent(".start-fuss")) && /kein Alterscheck/.test(await page.textContent(".start-fuss")), "Startseite nennt 16+ und kein Alterscheck");
  // Rollenwahl
  pruefe(await page.locator(".weg-kachel").count() === 6 && !(await ls("kl-weg")), "sechs Kacheln, ohne Wahl nichts gespeichert");
  await page.click("#weitere > summary");
  await page.click(".weg-kachel[data-weg=schule]");
  await page.waitForSelector("#experimente");
  pruefe((await ls("kl-weg")) === "schule", "Wahl speichert genau ein Wort");
  pruefe(/in der Schule/.test(await page.textContent(".weg-chip-leiste")), "Kopfzeile: Ich bin: in der Schule");
  pruefe(await page.locator("a.nav[data-id=gesicht] .kam:not([hidden])").count() === 1 && /braucht Kamera, im Unterricht nicht nötig/.test(await page.textContent("a.nav[data-id=gesicht]")), "Schulweg: Kamera-Labor im Menü gekennzeichnet");
  pruefe(await page.locator(".weg-kachel").count() === 0, "Nach der Wahl keine zweite Rollenauswahl auf der Startseite");
  pruefe(await page.locator("#lernpfade .pfad-karte").count() >= 6 && await page.locator("#lernpfade .pfad-karte[data-pfad=schule-einstieg]").count() === 1, "Pfade: Stufen und Rollenpfade");
  const schulPfad = await page.$$eval("#lernpfade .pfad-karte[data-pfad=schule-einstieg] .pfad-seiten a", (a) => a.map((x) => x.getAttribute("href")));
  pruefe(schulPfad[0] === "/experimente" && schulPfad.every((h) => !/gesicht|objekt|anlernen|whisper|schule-start|lehrkraefte|schulleitung|stunde|eltern/.test(h)), "Schülerpfad: beginnt mit Experimenten, nichts für Lehrkräfte, keine Kamera-Labore");
  pruefe(await page.locator("#experimente .karte").count() === 6 && await page.locator("#empfohlen .karte").count() === 3, "Schule: sechs Experimente und drei Empfehlungen");
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector(".weg-chip-leiste:not([hidden])");
  pruefe(/in der Schule/.test(await page.textContent(".weg-chip-leiste")), "Wahl bleibt nach dem Neuladen");
  await page.evaluate(() => { document.querySelector("#weitere").open = true; });
  await page.click("text=Auswahl aufheben");
  pruefe(!(await ls("kl-weg")) && await page.locator(".weg-chip-leiste:not([hidden])").count() === 0, "Auswahl aufheben löscht den Eintrag und den Hinweis");
  // Fortschritt löschen
  await page.click(".fs-loeschen"); await page.click(".fs-loeschen");
  pruefe(!(await ls("kl-gelesen")) && !(await ls("kl-zuletzt")), "Fortschritt löschen leert beide Einträge");
  pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
  await t.schliessen();
}
{ // Klassenlink: wirkt, ohne zu speichern
  const t = await starte({ kamera: false, einwilligung: false });
  const { page } = t;
  await page.goto(`${URL_LABOR}/?weg=schule`, { waitUntil: "load" });
  await page.waitForSelector("#experimente");
  pruefe(await page.evaluate(() => !localStorage.getItem("kl-weg")), "Klassenlink: nichts gespeichert");
  pruefe(/in der Schule/.test(await page.textContent(".weg-chip-leiste")), "Klassenlink: Weg Schule aktiv");
  pruefe(await page.evaluate(() => document.documentElement.dataset.lesemodus === "kompakt") && await page.evaluate(() => !localStorage.getItem("kl-lesemodus")), "Schule: Lesemodus kurz, ohne zu speichern");
  await page.locator("a.nav[data-id=gesicht]").evaluate((a) => a.click());
  await page.waitForSelector("#inhalt h1");
  pruefe(/Gesichtserkennung/.test(await page.textContent("#inhalt h1")) && await page.locator(".kamera-hinweis").count() === 1, "Schulweg bleibt beim Seitenwechsel und kennzeichnet das Kamera-Labor");
  await page.goto(`${URL_LABOR}/?weg=lehrende`, { waitUntil: "load" });
  await page.waitForSelector("#morgen");
  pruefe(await page.locator(".klassenlink").inputValue().then((v) => /\/\?weg=schule$/.test(v)), "Lehrende: Klassenlink wird angezeigt");
  pruefe(await page.evaluate(() => document.documentElement.dataset.lesemodus === "ausfuehrlich"), "Lehrende: ausführlich als Standard");
  await page.goto(`${URL_LABOR}/?weg=quatsch`, { waitUntil: "load" });
  await page.waitForSelector("#inhalt h1");
  pruefe(await page.locator("#dein-weg").count() === 0, "Unbekannter Weg wird ignoriert");
  await oeffneSeite(page, "sicherheit-einfach");
  pruefe(/ab 16 Jahren/.test(await page.textContent("#inhalt")) && /kein Alterscheck/.test(await page.textContent("#inhalt")), "Ist das sicher: 16+ und kein Alterscheck sichtbar");
  pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
  await t.schliessen();
}
{ // Handy: Lesemodus und Zur Startseite in einer Zeile
  const t = await starte({ kamera: false, breite: 390, hoehe: 844 });
  const { page } = t;
  await oeffneSeite(page, "karte");
  const r = await page.evaluate(() => { const a = document.querySelector(".zurueck").getBoundingClientRect(), b = document.querySelector(".lesemodus").getBoundingClientRect(); return { a: a.top, b: b.top, w: Math.max(a.right, b.right) }; });
  pruefe(Math.abs(r.a - r.b) < 30 && r.w <= 390, "Handy: Zur Startseite und Lesemodus in einer Zeile");
  await t.schliessen();
}
/* ---- 6. Willkommens-Fenster (Erstbesuch), Eltern- und Technikweg, Fußzeile */
{
  const ls = (page, k) => page.evaluate((x) => localStorage.getItem(x), k);
  const neu = async (opt) => { const t = await starte(Object.assign({ kamera: false, einwilligung: false, willkommen: true }, opt || {})); return t; };
  const auf = async (page, pfad = "/?willkommen=1") => { await page.goto(URL_LABOR + pfad, { waitUntil: "load" }); await page.waitForSelector("dialog.wk[open]", { timeout: 8000 }); };
  const keins = async (page) => { await page.waitForTimeout(1800); return (await page.locator("dialog.wk").count()) === 0; };
  { // Erstbesuch: Inhalt, Fokus, Wahl
    const t = await neu(); const { page } = t;
    await page.goto(URL_LABOR + "/?willkommen=1", { waitUntil: "load" });
    pruefe(await page.locator("h1").count() === 1 && await page.locator("dialog.wk").count() === 0, "Willkommen: Überschrift der Startseite steht im Rohtext, bevor das Fenster kommt");
    await page.waitForSelector("dialog.wk[open]", { timeout: 8000 });
    const text = await page.textContent("dialog.wk");
    pruefe(/Willkommen im KI-Labor/.test(text) && /Für wen darf es sein\? Dann zeige ich dir den passenden Einstieg\./.test(text) && /Nichts wird gesendet, deine Wahl bleibt nur in deinem Browser\./.test(text), "Willkommen: Titel, Satz und Datenschutzhinweis");
    pruefe(await page.locator("dialog.wk .wk-weg").count() === 6, "Willkommen: sechs Rollen-Kacheln");
    pruefe(await page.locator("dialog.wk").getAttribute("aria-labelledby") === "wk-t" && (await page.textContent("#wk-t")) === "Willkommen im KI-Labor", "Willkommen: aria-labelledby zeigt auf den Titel");
    pruefe(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains("wk-weg") && document.activeElement.dataset.weg === "schule"), "Willkommen: Fokus liegt auf dem ersten Knopf");
    pruefe(/Kamera, Mikro und Gesicht ab 16, im Schulpfad nicht nötig/.test(await page.textContent(".wk-weg[data-weg=schule]")), "Willkommen: Schule nennt Kamera ab 16");
    const beschr = await page.$$eval("dialog.wk .wk-weg", (b) => b.map((x) => x.dataset.weg + "|" + x.querySelector("b").textContent + "|" + x.querySelector(".wk-kurz").textContent));
    pruefe(beschr.join(";") === "schule|Ich bin Schüler:in|Experimente, leicht erklärt;lehrende|Ich unterrichte|Themen und Material für Lehrende;erwachsene|Ich will KI verstehen|Die Grundlagen, Schritt für Schritt;technik|Ich arbeite in der IT|Technik, Modelle, selbst aufbauen;beruf|Ich entscheide im Betrieb|Anwendungsfälle, Kosten, Grenzen;eltern|Ich bin Elternteil|Sicher und verständlich", "Willkommen: sechs Rollen mit Beschriftung und Unterzeile (" + beschr.length + ")");
    pruefe(await page.locator(".wk-merken").getAttribute("aria-checked") === "false", "Willkommen: Fortschritt merken ist nicht vorbelegt");
    pruefe(await page.evaluate(() => !localStorage.getItem("kl-weg") && !localStorage.getItem("kl-merken") && !localStorage.getItem("kl-willkommen")), "Willkommen: beim Öffnen wird nichts gespeichert");
    await page.click(".wk-weg[data-weg=schule]");
    await page.waitForFunction(() => !document.querySelector("dialog.wk"));
    pruefe((await ls(page, "kl-weg")) === "schule" && (await ls(page, "kl-willkommen")) === "1" && !(await ls(page, "kl-merken")), "Wahl: kl-weg = schule, kl-willkommen gemerkt, kein kl-merken");
    pruefe(/in der Schule/.test(await page.textContent(".weg-chip-leiste")), "Wahl wirkt: Ich bin: in der Schule");
    await page.click(".weg-chip-leiste");
    await page.waitForSelector("dialog.wk[open]");
    pruefe(await page.locator(".wk-weg.aktiv[data-weg=schule]").count() === 1 && /Schließen/.test(await page.textContent(".wk-aktion")), "Kopfzeile Ich bin: öffnet dieselbe Auswahl, aktueller Weg markiert");
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.querySelector("dialog.wk"));
    pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
    await t.schliessen();
  }
  { // Später, X, Esc, Hintergrund: schließen ohne Rolle, merken kl-willkommen
    for (const art of ["spaeter", "x", "esc", "hintergrund"]) {
      const t = await neu(); const { page } = t;
      await auf(page);
      await page.focus(".wk-weg[data-weg=beruf]");
      if (art === "spaeter") await page.click(".wk-spaeter");
      if (art === "x") { const b = await page.locator(".wk-x").boundingBox(); pruefe(b.width >= 44 && b.height >= 44, "X hat 44 px Touch-Ziel"); await page.click(".wk-x"); }
      if (art === "esc") await page.keyboard.press("Escape");
      if (art === "hintergrund") await page.mouse.click(6, 6);
      await page.waitForFunction(() => !document.querySelector("dialog.wk"));
      pruefe(!(await ls(page, "kl-weg")) && (await ls(page, "kl-willkommen")) === "1" && !(await ls(page, "kl-merken")), art + ": schließt ohne Rolle, merkt nur kl-willkommen");
      pruefe(await page.evaluate(() => document.activeElement && document.activeElement.tagName !== "DIALOG" && !document.querySelector("dialog[open]")), art + ": Fokus ist zurück auf der Seite");
      await page.goto(URL_LABOR + "/?willkommen=1", { waitUntil: "load" });
      pruefe(await keins(page), art + ": kommt nicht noch einmal");
      await t.schliessen();
    }
  }
  { // Schalter Fortschritt merken wirkt nur, wenn er an ist
    const t = await neu(); const { page } = t;
    await auf(page);
    await page.click(".wk-merken");
    pruefe(await page.locator(".wk-merken").getAttribute("aria-checked") === "true", "Schalter lässt sich einschalten");
    await page.click(".wk-spaeter");
    await page.waitForFunction(() => !document.querySelector("dialog.wk"));
    pruefe((await ls(page, "kl-merken")) === "1" && !(await ls(page, "kl-weg")), "Schalter an und Später: kl-merken gesetzt, keine Rolle");
    await t.schliessen();
  }
  { // Wann es NICHT erscheint
    let t = await neu(); await t.page.goto(URL_LABOR + "/", { waitUntil: "load" });
    pruefe(await keins(t.page), "Nicht bei navigator.webdriver ohne ?willkommen=1"); await t.schliessen();
    t = await neu(); await t.page.goto(URL_LABOR + "/?weg=schule&willkommen=1", { waitUntil: "load" });
    pruefe(await keins(t.page), "Nicht mit ?weg= in der Adresse"); await t.schliessen();
    t = await neu(); await t.kontext.addInitScript(() => { try { localStorage.setItem("kl-weg", "beruf"); } catch (e) { /* egal */ } });
    await t.page.goto(URL_LABOR + "/?willkommen=1", { waitUntil: "load" });
    pruefe(await keins(t.page), "Nicht mit gespeichertem kl-weg"); await t.schliessen();
    t = await neu(); await t.page.goto(URL_LABOR + "/karte?willkommen=1", { waitUntil: "load" });
    pruefe(await keins(t.page), "Nicht auf Lektionsseiten"); await t.schliessen();
    t = await starte({ kamera: false, einwilligung: false });
    await t.page.goto(URL_LABOR + "/?willkommen=1", { waitUntil: "load" });
    pruefe(await keins(t.page), "Nicht, wenn kl-willkommen schon gesetzt ist (Harness-Vorbelegung)"); await t.schliessen();
  }
  { // Handy 390x844 und Bilder (hell, dunkel, Handy, Desktop)
    for (const [name, dunkel, breite, hoehe] of [["handy-hell", false, 390, 844], ["handy-dunkel", true, 390, 844], ["desktop-hell", false, 1440, 900], ["desktop-dunkel", true, 1440, 900]]) {
      const t = await neu({ dunkel, breite, hoehe }); const { page } = t;
      await auf(page);
      await page.waitForTimeout(400);
      const m = await page.evaluate(() => {
        const d = document.querySelector("dialog.wk").getBoundingClientRect();
        return { l: d.left, r: d.right, t: d.top, b: d.bottom, w: d.width, kleinste: Math.min(...[...document.querySelectorAll("dialog.wk .wk-weg, dialog.wk .wk-spaeter, dialog.wk .wk-x, dialog.wk .wk-merken")].map((e) => e.getBoundingClientRect().height)),
          spalten: new Set([...document.querySelectorAll(".wk-weg")].map((e) => Math.round(e.getBoundingClientRect().left))).size, blur: getComputedStyle(document.querySelector("dialog.wk"), "::backdrop").backdropFilter };
      });
      pruefe(m.l >= 0 && m.r <= breite && m.t >= 0 && m.b <= hoehe, name + ": Fenster liegt im Bild");
      pruefe(m.kleinste >= 44, name + ": alle Touch-Ziele mindestens 44 px (" + Math.round(m.kleinste) + ")");
      pruefe(m.spalten === 2 && (breite > 560 ? m.w <= 560.5 : m.w >= breite - 26), name + ": zwei Spalten, " + (breite > 560 ? "höchstens 560 px breit" : "volle Breite"));
      pruefe(/blur/.test(m.blur), name + ": Hintergrund ist unscharf (" + m.blur + ")");
      await page.screenshot({ path: "tests/ausgabe/laien-willkommen-" + name + ".png" });
      await t.schliessen();
    }
  }
  { // Eltern, Technik, Erwachsene (Alias neugierig): Klassenlink wirkt ohne Speichern, Pfade da
    for (const [w, ich, anzahl] of [["eltern", /Elternteil/, 6], ["technik", /in der IT/, 6], ["neugierig", /neugierig/, 7], ["erwachsene", /neugierig/, 7]]) {
      const t = await neu(); const { page } = t;
      await page.goto(URL_LABOR + "/?weg=" + w, { waitUntil: "load" });
      await page.waitForSelector("#empfohlen");
      pruefe(ich.test(await page.textContent(".weg-chip-leiste")) && await page.locator("#empfohlen .karte").count() === 3 && !(await ls(page, "kl-weg")), w + ": Weg aus dem Link, drei Empfehlungen, nichts gespeichert");
      const n = await page.locator("#lernpfade .pfad-karte[data-pfad=" + (w === "neugierig" ? "erwachsene" : w) + "] .pfad-seiten a").count();
      pruefe(n === anzahl, w + ": Pfad mit " + anzahl + " Seiten (" + n + ")");
      const menue = await page.locator("#nav-liste a.nav:visible").count();
      pruefe(menue <= 8, w + ": höchstens 8 sichtbare Menüeinträge beim Start (" + menue + ")");
      await t.schliessen();
    }
  }
  { // Fußzeile: Link zu den Browser-Einträgen, Tabelle nennt kl-merken und kl-willkommen
    const t = await neu(); const { page } = t;
    await oeffneSeite(page, "karte");
    pruefe(await page.locator(".fuss-speicher a[href^='/sicherheit-einfach']").count() === 1, "Fußzeile: Link Was im Browser gespeichert wird");
    await page.click(".fuss-speicher a");
    await page.waitForSelector("#browser-eintraege");
    pruefe(/sicherheit-einfach/.test(page.url()), "Link führt zu Ist das sicher?");
    const tab = await page.textContent("#browser-eintraege");
    pruefe(/kl-merken/.test(tab) && /kl-willkommen/.test(tab), "Tabelle nennt kl-merken und kl-willkommen");
    await t.schliessen();
  }
}

/* ---- 6. Links im Text: [Text](Adresse), Menü beim Start, Selbst-bauen-Link */
{
  const t = await starte({ kamera: false });
  const { page } = t;
  await oeffneSeite(page, "start");
  const md = (x) => page.evaluate((v) => window.KL.md(v), x);
  const a = await md("Siehe [Repo](https://example.com/x?a=1&b=2) hier.");
  pruefe(/<a class="md-link ext" href="https:\/\/example.com\/x\?a=1&amp;b=2" rel="noopener noreferrer"/.test(a), "md: https-Link mit rel noopener noreferrer");
  pruefe(/<a class="md-link" href="\/hardware">/.test(await md("[Rechner](/hardware)")), "md: interner Link mit /");
  for (const bose of ["[x](javascript:alert(1))", "[x](//evil.example)", "[x](http://example.com)", '[x](https://a.example/"onmouseover=alert(1))', "[<img src=x onerror=alert(1)>](https://a.example)"]) {
    const r = await md(bose);
    pruefe(!/<a /.test(r.replace(/<a class="md-link ext" href="https:\/\/a\.example"[^>]*>/, "")) && !/<img/.test(r) && !/onmouseover=alert\(1\)>/.test(r.replace(/&quot;/g, "")), "md: unsichere Adresse bleibt Klartext oder wird escaped: " + bose.slice(0, 30));
  }
  await oeffneSeite(page, "selbst-bauen");
  pruefe(await page.locator('#inhalt a.md-link[href="https://github.com/greeves89/jetson-ai-showcase"][rel="noopener noreferrer"]').count() >= 1, "selbst-bauen: Repo-Adresse ist ein Link");
  await oeffneSeite(page, "start");
  const sichtbar = await page.locator("#nav-liste a.nav:visible, #nav-liste .navkopf:visible").count();
  pruefe(sichtbar <= 8, "Menü beim Start: höchstens 8 sichtbare Einträge (" + sichtbar + ")");
  await t.schliessen();
}
console.log(schlecht ? "\n" + schlecht + " FEHLER" : "\nalles ok");
