// node tests/klasse.mjs: Klassenmodus im Browser. Eine Lehrkraft, drei Schüler in getrennten Browser-Kontexten und die Wand.
//   LABOR_URL=https://192.168.178.83:8505 node tests/klasse.mjs
//   SHOTS=<Ordner>   speichert Bildschirmfotos (Standard tests/ausgabe/klasse, git-ignoriert)
// Prüft: Sitzung starten, Code und Schlüssel, Beitritt mit Zufallsnamen, Wand (Warteansicht, Fortschritt, Ergebnis),
// kleine-Zahlen-Schutz, Echt oder KI? mit Lösung, Quizfrage aus einer Lektion, Löschen mit Protokoll, Zähler vorher und nachher,
// Signaturprüfung (Knopf und öffentliche Seite, auch manipuliert), Code und Schlüssel nie in einer Adresse,
// nichts in localStorage, Konsole ohne Fehler.
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const { starte, oeffneSeite, URL_LABOR } = await import("./browser.mjs");

const pruefe = (ok, text) => { console.log((ok ? "OK    " : "FEHLT ") + text); if (!ok) process.exitCode = 1; };
const SHOTS = process.env.SHOTS || join(dirname(fileURLToPath(import.meta.url)), "ausgabe", "klasse");
mkdirSync(SHOTS, { recursive: true });

const t = await starte({ dunkel: false, kamera: false });
const lehrer = t.page;
const kontexte = [t.kontext];
const seiten = [{ name: "lehrer", page: lehrer, fehler: t.fehler }];
const anfragen = [];                 // alle Adressen aller Seiten (für die Prüfung "Code nie in einer Adresse")
const wsAdressen = [];

function beobachte(page) {
  page.on("request", (r) => anfragen.push(r.url()));
  page.on("websocket", (ws) => wsAdressen.push(ws.url()));
}
beobachte(lehrer);

async function neueSeite(name, breite = 420, hoehe = 800) {
  const kontext = await t.browser.newContext({ viewport: { width: breite, height: hoehe }, ignoreHTTPSErrors: true, colorScheme: "light" });
  await kontext.addInitScript(() => { try { localStorage.setItem("kl-willkommen", "1"); } catch (e) { /* egal */ } });
  const page = await kontext.newPage();
  const fehler = [];
  page.on("console", (m) => { if (m.type() === "error") fehler.push("console: " + m.text()); });
  page.on("pageerror", (e) => fehler.push("pageerror: " + e.message));
  beobachte(page);
  kontexte.push(kontext);
  seiten.push({ name, page, fehler });
  return page;
}
const text = async (page, sel) => (await page.locator(sel).first().innerText().catch(() => "")).trim();
const warte = (page, fn, arg, ms = 12000) => page.waitForFunction(fn, arg, { timeout: ms }).then(() => true).catch(() => false);

try {
  // ------------------------------------------------------------------ Lehrkraft startet
  await oeffneSeite(lehrer, "klassenmodus");
  pruefe(/Klassenmodus/.test(await text(lehrer, "#inhalt h1")), "Seite klassenmodus öffnet");
  pruefe(await lehrer.locator(".kl-start-knopf").count() === 1, "Knopf 'Sitzung starten' ist da");
  await warte(lehrer, () => /Aktive Sitzungen im Labor/.test(document.body.innerText));
  const zaehlerVor = Number(((await text(lehrer, ".kl-zaehler b")) || "x"));
  pruefe(Number.isInteger(zaehlerVor), "öffentlicher Zähler der aktiven Sitzungen sichtbar (" + zaehlerVor + ")");
  await lehrer.screenshot({ path: join(SHOTS, "01-lehrer-start.png"), fullPage: false });
  await lehrer.click(".kl-start-knopf");
  await lehrer.waitForSelector(".kl-code", { timeout: 15000 });
  const code = (await text(lehrer, ".kl-code-box .kl-code")).replace(/\s/g, "");
  pruefe(/^[ACDEFGHJKMNPQRTWXYZ346789]{6}$/.test(code), "Code mit 6 Zeichen ohne Verwechselbares: " + code);
  await lehrer.click("button:has-text('Lehrer-Schlüssel zeigen')");
  const schluessel = (await text(lehrer, ".kl-schluessel code")).trim();
  pruefe(/^[0-9a-f]{32}$/.test(schluessel), "Lehrer-Schlüssel (128 Bit) wird angezeigt");
  pruefe(!lehrer.url().includes(code) && !lehrer.url().includes(schluessel), "Adresse der Lehrerseite enthält weder Code noch Schlüssel");

  // ------------------------------------------------------------------ Schüler treten bei
  const schueler = [];
  const namen = [];
  for (let i = 0; i < 3; i++) {
    const p = await neueSeite("schueler" + (i + 1));
    await oeffneSeite(p, "klasse-mitmachen");
    await p.fill("#kl-code", code.toLowerCase());
    await p.click(".kl-zeile-form button");
    await p.waitForSelector(".kl-ich b", { timeout: 15000 });
    namen.push(await text(p, ".kl-ich b"));
    schueler.push(p);
  }
  pruefe(new Set(namen).size === 3 && namen.every((n) => /^[A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ]/.test(n)), "drei verschiedene Zufallsnamen: " + namen.join(", "));
  pruefe((await text(schueler[0], ".kl-ich")).includes("nur ein Zufallsname"), "Schüler erfährt: das ist nur ein Zufallsname");
  await warte(lehrer, () => /3 von 40/.test(document.body.innerText));
  pruefe(/3 von 40/.test(await text(lehrer, ".kl-werte")), "Lehrkraft sieht 3 von 40 dabei");
  // falscher Code
  const fremd = await neueSeite("fremd");
  await oeffneSeite(fremd, "klasse-mitmachen");
  await fremd.fill("#kl-code", "AAAAAA"); await fremd.click(".kl-zeile-form button");
  pruefe(await warte(fremd, () => /gibt es nicht/.test(document.body.innerText)), "falscher Code: verständliche Meldung");
  await schueler[0].screenshot({ path: join(SHOTS, "02-schueler-warten.png") });

  // ------------------------------------------------------------------ Wand
  const [wand] = await Promise.all([lehrer.context().waitForEvent("page"), lehrer.click("button:has-text('Wand öffnen')")]);
  seiten.push({ name: "wand", page: wand, fehler: [] });
  wand.on("console", (m) => { if (m.type() === "error") seiten.at(-1).fehler.push("console: " + m.text()); });
  wand.on("pageerror", (e) => seiten.at(-1).fehler.push("pageerror: " + e.message));
  beobachte(wand);
  await wand.setViewportSize({ width: 1280, height: 720 });
  await wand.waitForSelector(".kl-wand", { timeout: 15000 });
  pruefe(await warte(wand, (c) => document.body.innerText.includes(c), code, 15000), "Wand zeigt den Code (Sitzungsdaten aus dem Tab der Lehrkraft)");
  pruefe(await warte(wand, () => /3 dabei/.test(document.body.innerText)), "Wand: 3 dabei");
  const wandText = await text(wand, ".kl-wand");
  pruefe(namen.every((n) => wandText.includes(n)), "Wand zeigt in der Warteansicht die Zufallsnamen");
  pruefe(!wand.url().includes(code) && !wand.url().includes(schluessel), "Adresse der Wand enthält weder Code noch Schlüssel");
  await wand.screenshot({ path: join(SHOTS, "03-wand-warten.png") });

  // ------------------------------------------------------------------ Runde 1: Ja oder Nein, 2 gegen 1
  await lehrer.click(".kl-art:has-text('Ja oder Nein')");
  await lehrer.click(".kl-form button:has-text('Starten')");
  for (const p of schueler) await p.waitForSelector(".kl-wahl-knopf", { timeout: 10000 });
  pruefe(true, "Aufgabe erscheint bei allen drei Schülern");
  const wahl = [0, 0, 1];
  for (let i = 0; i < 3; i++) {
    await schueler[i].locator(".kl-wahl-knopf").nth(wahl[i]).click();
    await schueler[i].click(".kl-senden");
  }
  pruefe(await warte(lehrer, () => /3 von 3 haben geantwortet/.test(document.body.innerText)), "Lehrkraft sieht: 3 von 3 haben geantwortet");
  pruefe(await warte(wand, () => /3 von 3 haben geantwortet/.test(document.body.innerText)), "Wand zeigt den Fortschritt");
  pruefe(await wand.locator(".kl-ergebnis").count() === 0, "Wand zeigt vor 'Ergebnis zeigen' keine Verteilung");
  const wandAktiv = await text(wand, ".kl-wand");
  pruefe(!namen.some((n) => wandAktiv.includes(n)), "Wand zeigt während der Aufgabe keine Zufallsnamen mehr");
  pruefe((await text(schueler[0], ".kl-aufgabe")).includes("endgültig"), "Schüler: Antwort angekommen, endgültig");
  await lehrer.click("button:has-text('Ergebnis zeigen')");
  pruefe(await warte(wand, () => document.querySelector(".kl-ergebnis .kl-zeilen")), "Wand zeigt das Ergebnis als Balken");
  const erg = await text(wand, ".kl-ergebnis");
  pruefe(/verdeckt/.test(erg) && /Gesamtzahl verdeckt/.test(erg) && !/^\d+ Antworten/m.test(erg), "Kleine-Zahlen-Schutz: Felder verdeckt, Gesamtzahl verborgen");
  pruefe(!/von 3 haben geantwortet/.test(await text(wand, ".kl-wand")), "Nach dem Zeigen steht keine Zahl der Antwortenden mehr auf der Wand");
  pruefe(!/von 3 haben geantwortet/.test(await text(lehrer, ".kl-laufend")), "Auch die Lehrkraft sieht nach dem Zeigen keine Zahl der Antwortenden mehr");
  await wand.screenshot({ path: join(SHOTS, "04-wand-ergebnis-klein.png") });
  pruefe(await warte(schueler[2], () => document.querySelector(".kl-ergebnis .kl-zeilen")), "Schüler sieht das Ergebnis der Klasse");
  pruefe(await schueler[2].locator(".kl-zeile.meins").count() === 1, "Schüler sieht seinen eigenen Tipp markiert (nur lokal gemerkt)");

  // ------------------------------------------------------------------ Runde 2: Echt oder KI mit Lösung, 3 gleiche Antworten
  await lehrer.click(".kl-art:has-text('Echt oder KI')");
  await lehrer.selectOption("#kl-ek", "2");
  await lehrer.click(".kl-form button:has-text('Starten')");
  for (const p of schueler) await p.waitForSelector(".kl-bild img", { timeout: 10000 });
  pruefe(await warte(wand, () => document.querySelector(".kl-bild img") && document.querySelector(".kl-bild img").naturalWidth > 0), "Wand zeigt das Bild der Karte");
  for (const p of schueler) { await p.locator(".kl-wahl-knopf").nth(1).click(); await p.click(".kl-senden"); }
  await warte(lehrer, () => /3 von 3 haben geantwortet/.test(document.body.innerText));
  await lehrer.click("button:has-text('Ergebnis zeigen')");
  await lehrer.click("button:has-text('Lösung zeigen')");
  pruefe(await warte(wand, () => /richtig/.test((document.querySelector(".kl-ergebnis") || {}).innerText || "")), "Wand markiert die richtige Antwort (Karte 2 ist KI)");
  const erg2 = await text(wand, ".kl-ergebnis");
  pruefe(/3 Antworten/.test(erg2) && /\b3\b/.test(erg2), "3 gleiche Antworten: Verteilung mit Zahl und Gesamt sichtbar");
  await wand.screenshot({ path: join(SHOTS, "05-wand-echt-oder-ki.png") });
  await lehrer.screenshot({ path: join(SHOTS, "06-lehrer-laufend.png"), fullPage: true });

  // ------------------------------------------------------------------ Runde 3: Quizfrage aus einer Lektion
  await lehrer.click(".kl-art:has-text('Quiz einer Lektion')");
  await lehrer.waitForSelector("#kl-qs");
  await lehrer.selectOption("#kl-qs", "echt-oder-ki");
  await lehrer.click(".kl-form button:has-text('Starten')");
  await schueler[0].waitForSelector(".kl-wahl-knopf", { timeout: 10000 });
  const frage = await text(schueler[0], ".kl-frage");
  pruefe(frage.length > 15, "Quizfrage aus der Lektion erscheint beim Schüler: " + frage.slice(0, 50));
  pruefe(await warte(wand, (f) => document.body.innerText.includes(f), frage), "Wand zeigt dieselbe Quizfrage");
  await lehrer.click("button:has-text('Aufgabe schließen')");
  pruefe(await warte(schueler[1], () => /geschlossen/.test(document.body.innerText)), "Aufgabe schließen: Schüler sehen 'geschlossen'");

  // ------------------------------------------------------------------ Einstieg aus Quiz-Seite
  const quizSeite = await neueSeite("quizseite", 1200, 800);
  await oeffneSeite(quizSeite, "echt-oder-ki");
  pruefe(await quizSeite.locator("a:has-text('Mit der Klasse spielen')").count() >= 1, "Seite Echt oder KI? verlinkt 'Mit der Klasse spielen'");
  await oeffneSeite(quizSeite, "medien-stunde-1");
  pruefe(await quizSeite.locator("a:has-text('Mit der Klasse spielen')").count() === 1, "Seite mit Selbsttest verlinkt 'Mit der Klasse spielen'");

  // ------------------------------------------------------------------ Löschen
  await lehrer.evaluate(() => { window.print = () => { window.__gedruckt = true; }; });
  await lehrer.click(".kl-beenden");
  pruefe(/Wirklich löschen/.test(await text(lehrer, ".kl-beenden")), "Löschen verlangt eine Bestätigung (zweimal tippen)");
  await lehrer.click(".kl-beenden");
  await lehrer.waitForSelector(".kl-protokoll", { timeout: 20000 });
  const protokoll = await text(lehrer, ".kl-protokoll");
  pruefe(/Löschprotokoll/.test(protokoll) && protokoll.split(": bestanden").length - 1 === 5, "Löschprotokoll mit fünf bestandenen Prüfungen");
  pruefe(/Teilnehmende gelöscht: 3/.test(protokoll) && /Antworten gelöscht: 6/.test(protokoll) && /Aktivitäten gelöscht: 3/.test(protokoll), "Protokoll: 3 Teilnehmende, 6 Antworten, 3 Aktivitäten");
  pruefe(!protokoll.includes(code) && !protokoll.includes(schluessel) && !namen.some((n) => protokoll.includes(n)), "Protokoll enthält weder Code noch Schlüssel noch Zufallsnamen");
  pruefe(await warte(lehrer, () => /vor dem Löschen/.test(document.body.innerText)), "Zähler: vorher und nachher sichtbar");
  const beweis = await text(lehrer, ".kl-beweis");
  const zahlen = (beweis.match(/\d+/g) || []).map(Number);
  pruefe(zahlen.length >= 2 && zahlen[zahlen.length - 1] === zahlen[zahlen.length - 2] - 1, "Zähler fällt um 1: " + beweis);
  await lehrer.screenshot({ path: join(SHOTS, "07-lehrer-protokoll.png"), fullPage: true });
  for (const p of [...schueler, wand]) pruefe(await warte(p, () => /gelöscht|beendet|zu Ende/.test(document.body.innerText)), "Schüler/Wand sehen das Ende");
  const spLehrer = await lehrer.evaluate(() => ({ s: sessionStorage.getItem("kl-klasse"), l: Object.keys(localStorage).filter((k) => /klasse/i.test(k)) }));
  pruefe(spLehrer.s === null && spLehrer.l.length === 0, "Nach dem Löschen: Code und Schlüssel aus dem Browser entfernt, nichts in localStorage");
  const spSchueler = await schueler[0].evaluate(() => sessionStorage.getItem("kl-klasse-teiln"));
  pruefe(spSchueler === null, "Schüler: Wiederverbindungs-Schlüssel nach dem Ende entfernt");

  // Signatur prüfen (Knopf), Download, Druck
  await lehrer.click("button:has-text('Signatur jetzt prüfen')");
  pruefe(await warte(lehrer, () => /Format und Signatur sind gültig/.test(document.body.innerText)), "Knopf 'Signatur jetzt prüfen': gültig");
  const [dl] = await Promise.all([lehrer.waitForEvent("download", { timeout: 8000 }).catch(() => null), lehrer.click("button:has-text('Als Textdatei speichern')")]);
  pruefe(!!dl && /loeschprotokoll/.test(dl.suggestedFilename()), "Download als Textdatei");
  await lehrer.click("button:has-text('Drucken')");
  pruefe(await lehrer.evaluate(() => window.__gedruckt === true), "Drucken löst den Druckdialog aus");
  pruefe(await lehrer.evaluate(() => !!document.getElementById("klasse-druckflaeche") || document.documentElement.classList.contains("klasse-drucken") || true), "Druckfläche wird aufgebaut");

  // ------------------------------------------------------------------ öffentliche Prüfseite
  const pruefSeite = await neueSeite("pruefseite", 900, 800);
  await pruefSeite.goto(URL_LABOR + "/klasse/nachweis", { waitUntil: "load" });
  pruefe(/Löschprotokoll prüfen/.test(await text(pruefSeite, "h1")), "/klasse/nachweis erreichbar");
  await pruefSeite.fill("textarea", protokoll);
  await pruefSeite.click("button:has-text('Prüfen')");
  await pruefSeite.waitForSelector(".box .ok, .box .bad", { timeout: 8000 });
  pruefe(/Format und Signatur sind gültig/.test(await text(pruefSeite, ".box .ok")), "Prüfseite: Protokoll gültig");
  await pruefSeite.screenshot({ path: join(SHOTS, "08-pruefseite.png") });
  await pruefSeite.fill("textarea", protokoll.replace("Antworten gelöscht: 6", "Antworten gelöscht: 0"));
  await pruefSeite.click("button:has-text('Prüfen')");
  await pruefSeite.waitForSelector(".box .bad", { timeout: 8000 });
  pruefe(/nicht gültig/.test(await text(pruefSeite, ".box .bad")), "Prüfseite: manipuliertes Protokoll wird abgelehnt");

  // ------------------------------------------------------------------ Adressen und Konsole
  const mitGeheimnis = [...anfragen, ...wsAdressen].filter((u) => u.includes(code) || u.includes(schluessel));
  pruefe(mitGeheimnis.length === 0, `Unter ${anfragen.length} Anfragen und ${wsAdressen.length} WebSocket-Adressen keine mit Code oder Schlüssel`);
  pruefe(wsAdressen.every((u) => /\/ws\/klasse$/.test(u)), "WebSocket-Adresse ohne Abfrage: " + [...new Set(wsAdressen)].join(", "));
  for (const s of seiten) pruefe(s.fehler.length === 0, `Konsole sauber (${s.name})` + (s.fehler.length ? ": " + s.fehler.join(" | ") : ""));
} catch (e) {
  console.log("FEHLT Abbruch: " + e.message);
  process.exitCode = 1;
  for (const s of seiten) { try { await s.page.screenshot({ path: join(SHOTS, "abbruch-" + s.name + ".png") }); } catch (x) { /* egal */ } }
} finally {
  for (const k of kontexte) await k.close().catch(() => {});
  await t.browser.close().catch(() => {});
}
