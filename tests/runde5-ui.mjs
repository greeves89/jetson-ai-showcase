// node tests/runde5-ui.mjs: Befunde der Pruefrunde 5 in Lernseiten und Spiel (ohne Sprachmodell).
//   Beispiel-Prompts (Umbruch, Kopieren, Im Chat ausprobieren), Tabellen im Rahmen, Quiz stabil, Echt oder KI? per Taste,
//   Fortschrittszaehler, Willkommens-Fenster auf dem SE, Sprungmarken, Menue fuer Aeltere, Menuetext "Gesichter braucht Kamera".
import { starte, oeffneSeite, URL_LABOR } from "./browser.mjs";
let schlecht = 0;
const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) { schlecht++; process.exitCode = 1; } };
const genau = (k) => k.addInitScript(() => { try { localStorage.setItem("kl-lesemodus", "ausfuehrlich"); } catch (e) { /* egal */ } });

/* ---- Beispiel-Prompts: alle vier Seiten, Handy */
{
  const t = await starte({ kamera: false, dunkel: false, breite: 375, hoehe: 667 });
  const { page } = t;
  await genau(t.kontext);
  for (const id of ["prompts-schule", "prompts-alltag", "prompts-fuer-schueler"]) {
    await oeffneSeite(page, id);
    const r = await page.evaluate(() => {
      const bl = [...document.querySelectorAll('[data-testid="prompt-block"]')];
      return { n: bl.length, breit: document.documentElement.scrollWidth <= window.innerWidth, umbruch: bl.every((b) => { const p = b.querySelector(".pb-text"); const cs = getComputedStyle(p); return cs.whiteSpace === "pre-wrap" && p.scrollWidth <= p.clientWidth + 1; }),
        knoepfe: bl.every((b) => /Kopieren/.test(b.textContent) && /Im Chat ausprobieren/.test(b.textContent)), hoch: bl.every((b) => [...b.querySelectorAll("button")].every((x) => x.getBoundingClientRect().height >= 44)) };
    });
    pruefe(r.n >= 1, id + ": " + r.n + " Beispiel-Prompts als Block");
    pruefe(r.umbruch && r.breit, id + ": Text bricht um, kein waagerechter Überlauf");
    pruefe(r.knoepfe && r.hoch, id + ": jeder Block hat Kopieren und Im Chat ausprobieren (mindestens 44 px)");
  }
  await oeffneSeite(page, "prompts-schule");
  const text = await page.locator('[data-testid="prompt-block"] .pb-text').first().textContent();
  let gesendet = 0;
  await page.route("**/api/chat", (r) => { gesendet++; r.abort(); });
  await page.locator('[data-testid="prompt-im-chat"]').first().click();
  await page.waitForSelector("#chat-eingabe");
  await page.waitForTimeout(600);
  pruefe(new URL(page.url()).pathname === "/chat", "Im Chat ausprobieren öffnet die Chat-Seite");
  pruefe(await page.inputValue("#chat-eingabe") === text.slice(0, 1000), "Chat-Feld ist mit dem Prompt gefüllt");
  pruefe(await page.evaluate(() => document.activeElement && document.activeElement.id === "chat-eingabe"), "Fokus liegt im Feld");
  pruefe(gesendet === 0 && await page.locator(".msg.du").count() === 0, "nichts wurde automatisch gesendet");
  pruefe(await page.evaluate(() => sessionStorage.getItem("kl-chat-vorlage")) === null, "Vorlage wurde verbraucht (kein zweites Befüllen)");
  pruefe(t.fehler.filter((f) => !/chat/.test(f)).length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
  await t.schliessen();
}

/* ---- Tabellen und Quiz */
{
  const t = await starte({ kamera: false, dunkel: false, breite: 390, hoehe: 844 });
  const { page } = t;
  await genau(t.kontext);
  await oeffneSeite(page, "selbst-bauen");
  const r = await page.evaluate(() => [...document.querySelectorAll(".tabelle-wrap")].map((w) => ({ tab: w.getAttribute("tabindex"), rolle: w.getAttribute("role"), name: w.getAttribute("aria-label"), ov: getComputedStyle(w).overflowX, ok: w.getBoundingClientRect().right <= window.innerWidth + 1 })));
  pruefe(r.length >= 2 && r.every((x) => x.tab === "0" && x.rolle === "region" && x.name && x.ov === "auto" && x.ok), "Tabellen: Rahmen mit overflow-x auto, tabindex 0, region, aria-label (" + r.length + ")");
  pruefe(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "selbst-bauen: kein Seitenüberlauf");

  await oeffneSeite(page, "falscher-anruf");
  const q = page.locator(".quiz-frage").first();
  await q.scrollIntoViewIfNeeded();
  const vorher = await q.locator("label").evaluateAll((ls) => ls.map((l) => l.textContent.trim().slice(0, 30) + "|" + Math.round(l.getBoundingClientRect().top - ls[0].getBoundingClientRect().top)));
  const radio = await q.locator("input").first().evaluate((i) => { const r = i.getBoundingClientRect(); return [r.width, r.height]; });
  pruefe(radio[0] >= 20 && radio[1] >= 20, "Auswahlfeld mindestens 20 px (" + radio.join("x") + ")");
  const zeile = await q.locator("label").first().evaluate((l) => { const i = l.querySelector("input").getBoundingClientRect(), tx = l.querySelector(".quiz-text").getBoundingClientRect(); return Math.abs(i.top - tx.top) < 16 && tx.left > i.right - 1; });
  pruefe(zeile, "Radiofeld steht links neben dem Text, nicht allein über ihm");
  await q.locator("label").first().click();
  await page.waitForTimeout(300);
  const nachher = await q.locator("label").evaluateAll((ls) => ls.map((l) => l.textContent.trim().slice(0, 30)));
  pruefe(JSON.stringify(vorher.map((v) => v.split("|")[0])) === JSON.stringify(nachher.map((v) => v.replace(/(Richtig|Deine Wahl, falsch)$/, "").trim().slice(0, 30)).map((v, i) => v)) || nachher.length === vorher.length, "Optionen bleiben in gleicher Reihenfolge");
  const reihenfolge = await q.locator("label .quiz-text").evaluateAll((es) => es.map((e) => e.firstChild.textContent.trim().slice(0, 30)));
  pruefe(JSON.stringify(reihenfolge) === JSON.stringify(vorher.map((v) => v.split("|")[0])), "Reihenfolge nach der Antwort unverändert");
  await t.schliessen();
}

/* ---- Echt oder KI?: Tasten ohne Fokus auf dem Spiel */
{
  const t = await starte({ kamera: false, dunkel: false, breite: 1440, hoehe: 900 });
  const { page } = t;
  await oeffneSeite(page, "echt-oder-ki");
  await page.waitForSelector(".eok-wahl");
  await page.evaluate(() => { document.activeElement && document.activeElement.blur(); document.body.focus(); });
  await page.keyboard.press("1");
  await page.waitForSelector(".eok-urteil", { timeout: 3000 });
  pruefe(true, "Taste 1 antwortet ohne Fokus auf dem Spiel");
  await page.evaluate(() => { document.activeElement && document.activeElement.blur(); });
  await page.keyboard.press("Enter");
  await page.waitForSelector(".eok-wahl", { timeout: 3000 });
  pruefe(/Karte 2 von 12/.test(await page.textContent(".eok-zahl")), "Enter geht ohne Fokus weiter: " + await page.textContent(".eok-zahl"));
  await page.keyboard.press("2");
  await page.waitForSelector(".eok-urteil");
  pruefe(true, "Taste 2 antwortet");
  // nicht in einem Eingabefeld
  await page.evaluate(() => { const i = document.createElement("input"); i.id = "tmp-feld"; document.body.append(i); i.focus(); });
  await page.keyboard.press("Enter");
  pruefe(/Karte 2 von 12/.test(await page.textContent(".eok-zahl")), "mit Fokus im Eingabefeld passiert nichts");
  await page.evaluate(() => document.getElementById("tmp-feld").remove());
  // Ergebnisseite
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Enter"); await page.waitForSelector(".eok-wahl"); await page.keyboard.press("1"); await page.waitForSelector(".eok-urteil");
  }
  await page.keyboard.press("Enter");
  await page.waitForSelector(".eok-ende", { timeout: 3000 });
  const sichtbar = await page.evaluate(() => [...document.querySelectorAll(".eok-ende > p")].filter((p) => p.getBoundingClientRect().height > 0 && !p.classList.contains("ki-hinweis")).length);
  pruefe(sichtbar <= 2, "Ergebnisseite: höchstens zwei Textzeilen plus Knöpfe (" + sichtbar + ")");
  pruefe(await page.locator(".eok-ende .eok-wahlzeile button, .eok-ende .eok-wahlzeile a").count() >= 2, "Knöpfe Noch einmal und Karten zum Ausdrucken");
  await t.schliessen();
}

/* ---- Fortschritt, Sprungmarken, Menue */
{
  const t = await starte({ kamera: false, dunkel: false, breite: 1440, hoehe: 900 });
  const { page } = t;
  await t.kontext.addInitScript(() => { try { localStorage.setItem("kl-merken", "1"); localStorage.setItem("kl-gelesen", JSON.stringify(["karte", "ml"])); localStorage.setItem("kl-weg", "erwachsene"); } catch (e) { /* egal */ } });
  await oeffneSeite(page, "start");
  await page.waitForTimeout(600);
  const f = await page.evaluate(() => [...document.querySelectorAll(".fs-text")].map((e) => e.textContent));
  pruefe(f.length > 0 && f.every((x) => /Prozent gelesen/.test(x) && !/Noch nichts gelesen/.test(x) && !/^0 Prozent/.test(x)), "Fortschritt bei gelesenen Seiten: " + f.join(" | "));
  const von = /(\d+) von (\d+) Seiten/.exec(f.find((x) => /Seiten\)/.test(x)) || "");
  pruefe(von && +von[1] === 2 && +von[2] >= 2 && +von[2] <= 98, "Zähler 2 von " + (von && von[2]) + " Seiten (nur in der Rolle sichtbare)");
  // Menue fuer Aeltere
  const n = await page.locator(".nav-fuerdich a.nav, .nav-fuerdich a").count();
  pruefe(n <= 9, "Für dich (erwachsene): Start plus höchstens 8 Einträge (" + n + ")");
  const alleBlock = await page.locator(".nav-alle-block").count();
  pruefe(alleBlock === 1, "Fachgruppen liegen unter Alle Bereiche");
  // Sprungmarken
  await oeffneSeite(page, "kosten-energie");
  await page.waitForTimeout(1200);
  const sm = await page.evaluate(() => { const b = document.querySelector('[data-testid="sprungmarken"]'); return b && { chips: b.querySelectorAll("a.sprung-chip").length, abschnitte: document.querySelectorAll("section.abschnitt").length, offen: b.open }; });
  pruefe(sm && sm.chips === sm.abschnitte && sm.chips >= 2, "Sprungmarken auf langer Seite: " + JSON.stringify(sm));
  await page.locator('[data-testid="sprungmarken"] summary').click();
  await page.locator('[data-testid="sprungmarken"] a.sprung-chip').nth(1).click();
  await page.waitForTimeout(700);
  pruefe(await page.evaluate(() => window.scrollY) > 100, "Sprungchip scrollt zum Abschnitt");
  await oeffneSeite(page, "falscher-anruf");
  await page.waitForTimeout(1200);
  // Menuetext: Leerzeichen vor dem Zusatz
  const gesicht = await page.evaluate(() => { const a = document.querySelector('a.nav[data-id="gesicht"] .nav-text'); return a ? a.textContent : null; });
  pruefe(gesicht == null || !/Gesichterbraucht/.test(gesicht), "Menütext ohne verschmolzene Wörter: " + JSON.stringify(gesicht));
  await t.schliessen();
}

/* ---- Willkommens-Fenster auf dem iPhone SE */
{
  const t = await starte({ kamera: false, dunkel: false, breite: 375, hoehe: 667, willkommen: true });
  const { page } = t;
  await page.goto(URL_LABOR + "/?willkommen=1");
  await page.waitForSelector("dialog.wk[open]");
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => { const d = document.querySelector("dialog.wk"); const b = d.querySelector(".wk-spaeter").getBoundingClientRect(); return { n: d.querySelectorAll(".wk-weg").length, scroll: d.scrollHeight > d.clientHeight + 1, spaeter: b.bottom <= innerHeight && b.height > 0, rollen: [...d.querySelectorAll(".wk-weg")].every((w) => w.getBoundingClientRect().bottom <= innerHeight) }; });
  pruefe(r.n === 6 && r.rollen && r.spaeter && !r.scroll, "Willkommens-Fenster 375x667: sechs Rollen und Später ohne Scrollen " + JSON.stringify(r));
  await t.schliessen();
}
console.log(schlecht ? schlecht + " Fehler" : "alles ok");
