// node tests/ocr.mjs: Labor "Text auf Papier lesen" mit Fake-Webcam.
//   LABOR_URL=https://192.168.178.83:8503 node tests/ocr.mjs
//   FAKE_VIDEO=<.y4m>  eigenes Testvideo; sonst wird mit tests/ocr_bild.py ein Blatt mit deutschem Text erzeugt (ausgedacht, mit
//                      Umlauten, ss und Euro; kein echtes Dokument) und mit ffmpeg zu einem kurzen Video (960x720, 15 Bilder/s) gemacht
//   OCR_OPTIONEN       Optionen fuer ocr_bild.py, zum Beispiel "--drehung 180" (Blatt auf dem Kopf)
//   MIN_FPS            Mindestwert fuer Bilder pro Sekunde (Standard 1)
//   LOKAL_STATIC=1     Oberflaeche von der Platte statt vom Jetson (siehe browser.mjs)
// Prueft: Seite, Kennzeichnung der KI, Modell-Status, gelesener Text gleich dem Sollwert (Umlaute, ss, Euro, Silbentrennung
// zusammengezogen), Karten fuer Betrag, Datum, Uhrzeit, Telefon und E-Mail, Zustand "Text steht stabil", Standbild, Neu lesen,
// Kopieren, Vorlesen, Tempo, Tastatur, keine Emojis, keine Gedankenstriche, saubere Konsole.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SOLL = JSON.parse(execFileSync("python3", ["-c", "import sys, json; sys.path.insert(0, 'tests'); import ocr_bild; print(json.dumps(ocr_bild.SOLL_ZEILEN, ensure_ascii=False))"], { encoding: "utf8" }));
if (!process.env.FAKE_VIDEO) {
  const ziel = join(mkdtempSync(join(tmpdir(), "ocr-")), "blatt.y4m");
  const opt = (process.env.OCR_OPTIONEN || "").split(/\s+/).filter(Boolean);
  execFileSync("python3", ["tests/ocr_bild.py", join(tmpdir(), "ocr-test.jpg"), "--video", ziel, ...opt], { stdio: "ignore" });
  process.env.FAKE_VIDEO = ziel;
}
const { starte, oeffneSeite } = await import("./browser.mjs");
const pruefe = (ok, text) => { console.log((ok ? "OK    " : "FEHLT ") + text); if (!ok) process.exitCode = 1; };
if (!existsSync(process.env.FAKE_VIDEO)) { console.log("FEHLT Testvideo " + process.env.FAKE_VIDEO); process.exit(1); }
const MIN_FPS = Number(process.env.MIN_FPS || 1);
mkdirSync("tests/ausgabe", { recursive: true });

const t = await starte({ dunkel: true });
const { page } = t;
const nachrichten = [];
page.on("websocket", (ws) => {
  if (!/\/ws\/vision/.test(ws.url())) return;
  const eintrag = { url: ws.url(), rahmen: [] };
  nachrichten.push(eintrag);
  ws.on("framereceived", (f) => { try { eintrag.rahmen.push(JSON.parse(f.payload)); } catch (e) { /* Binaerrahmen egal */ } });
});
const tts = [];
page.on("request", (r) => { if (r.url().endsWith("/api/tts") && r.method() === "POST") tts.push(r.postData()); });

await oeffneSeite(page, "text-lesen");
pruefe(/Text auf Papier lesen/.test(await page.textContent("#inhalt h1")), "Seite text-lesen öffnet");
pruefe(await page.locator(".ki-hinweis", { hasText: "Schätzung" }).count() >= 1, "Kennzeichnung der KI-Schätzung sichtbar");
const status = await page.evaluate(() => fetch("/api/text-lesen/status").then((r) => r.json()));
pruefe(status.bereit === true && Array.isArray(status.fehlt) && status.fehlt.length === 0, "Status: Modelle bereit " + JSON.stringify(status));
pruefe(await page.locator(".ocr-leer").isVisible(), "Leerzustand erklärt, dass noch kein Text gelesen wurde");

await page.click("text=Kamera starten");
await page.waitForFunction(() => /Text steht stabil/.test((document.querySelector(".ocr-zustand") || {}).textContent || ""), null, { timeout: 90000 }).catch(() => {});
await page.waitForTimeout(1500);

const ws = nachrichten.find((n) => n.url.includes("modus=ocr"));
pruefe(!!ws, "WebSocket mit modus=ocr");
const rahmen = ws ? ws.rahmen.filter((r) => r.bild) : [];
pruefe(rahmen.length >= 3, `Server schickt Bilder (${rahmen.length})`);
const letzte = rahmen[rahmen.length - 1] || {};
const o = letzte.ocr || {};
console.log("      Zeiten:", JSON.stringify(letzte.detail_ms), JSON.stringify(letzte.zeiten), "Bild", letzte.breite + "x" + letzte.hoehe);
pruefe(o.stabil === true, "Zustand: Text steht stabil (nach " + (o.lesung || "?") + " Lesungen)");
const gelesen = String(o.text || "").split("\n").filter(Boolean);
const fehlt = SOLL.filter((z) => !gelesen.includes(z));
pruefe(fehlt.length === 0, "Text gleich Sollwert (" + gelesen.length + " von " + SOLL.length + " Zeilen)" + (fehlt.length ? ", fehlt: " + JSON.stringify(fehlt) + ", gelesen: " + JSON.stringify(gelesen) : ""));
pruefe(/innerhalb/.test(o.text || "") && !/inner-/.test(o.text || ""), "Silbentrennung am Zeilenende zusammengezogen");
pruefe(/Äpfel/.test(o.text) && /süße/.test(o.text) && /Brötchen/.test(o.text) && /€/.test(o.text) && /Größe/.test(o.text), "Umlaute, ß und Euro-Zeichen gelesen");
pruefe(o.sicherheit > 0.8 && o.unsicher === 0, `Sicherheit ${o.sicherheit}, unsichere Wörter ${o.unsicher}`);
const arten = (o.fakten || []).map((k) => k.art + ":" + k.wert);
for (const erwartet of ["betrag:1234.56", "datum:2026-11-27", "uhrzeit:14:30", "email:kontakt@example.com", "telefon:05111234567"]) pruefe(arten.includes(erwartet), "Karte " + erwartet);

// Oberflaeche
const text = await page.locator(".ocr-text").innerText();
pruefe(text.includes("Gesamtbetrag: 1.234,56 €") && text.includes("Bitte überweise den Betrag innerhalb"), "Text steht im Ergebnisbereich");
const karten = await page.locator(".ocr-karte").allInnerTexts();
console.log("      Karten:", karten.map((k) => k.replace(/\n/g, " | ")).join(" ; "));
pruefe(karten.some((k) => /Betrag/.test(k) && /1\.234,56 Euro/.test(k)), "Betragskarte zeigt 1.234,56 Euro");
pruefe(karten.some((k) => /Datum/.test(k) && /27\. November 2026/.test(k)), "Datumskarte zeigt 27. November 2026");
pruefe(karten.some((k) => /Uhrzeit/.test(k) && /14:30 Uhr/.test(k)), "Uhrzeitkarte zeigt 14:30 Uhr");
pruefe(await page.locator(".ocr-zahlen").innerText().then((s) => /Zeilen/.test(s) && /Sicherheit/.test(s)), "Zeilenzahl und Sicherheit stehen im Kopf");
pruefe(await page.locator(".ocr-ergebnis svg").count() >= 6, "Ergebnisbereich hat lucide-Symbole");
pruefe((await page.locator(".kameras img").first().getAttribute("src") || "").startsWith("data:image/jpeg"), "Bild vom Jetson (entzerrtes Blatt) wird angezeigt");

// Tempo
const werte = await page.$$eval(".messwerte .messwert b", (bs) => bs.map((b) => b.textContent));
const fps = Number(String(werte[2]).replace(",", "."));
pruefe(fps >= MIN_FPS, `Bilder pro Sekunde ${werte[2]} (Ziel mindestens ${MIN_FPS}), Zeilen ${werte[0]}, Runde ${werte[1]}`);
const satz = await page.textContent(".live .erklaerung");
pruefe(/Zeilen/.test(satz) && /Wörtern/.test(satz), "Live-Erklärung nennt Zeilen und Wörter: " + satz.slice(0, 140));

// Fliesstext
await page.click(".ocr-fliess");
pruefe((await page.locator(".ocr-fliess").getAttribute("aria-pressed")) === "true", "Umschalter Fließtext");
await page.click(".ocr-fliess");

// Kopieren
await page.click("text=Text kopieren");
await page.waitForTimeout(300);
pruefe(/kopiert/.test(await page.locator(".ocr-meld").innerText()), "Kopieren meldet Erfolg");

// Standbild einfrieren
await page.click("text=Standbild einfrieren");
await page.waitForFunction(() => /Standbild/.test(document.querySelector(".ocr-zustand").textContent), null, { timeout: 8000 }).catch(() => {});
pruefe(/Standbild/.test(await page.locator(".ocr-zustand").innerText()), "Standbild eingefroren");
const vorher = await page.locator(".ocr-text").innerText();
await page.waitForTimeout(2500);
pruefe((await page.locator(".ocr-text").innerText()) === vorher, "eingefroren: Text bleibt gleich");
await page.click("text=Weiter lesen");
await page.waitForTimeout(1500);
pruefe(!/Standbild/.test(await page.locator(".ocr-zustand").innerText()), "Weiter lesen hebt das Standbild auf");

// Neu lesen
await page.click("text=Neu lesen");
await page.waitForFunction(() => /Text steht stabil/.test(document.querySelector(".ocr-zustand").textContent), null, { timeout: 60000 }).catch(() => {});
pruefe(/Text steht stabil/.test(await page.locator(".ocr-zustand").innerText()), "Neu lesen: Text steht danach wieder stabil");
pruefe((await page.locator(".ocr-text").innerText()).includes("Gesamtbetrag: 1.234,56 €"), "Neu lesen: derselbe Text");

// Vorlesen
await page.click("text=Vorlesen");
await page.waitForTimeout(6000);
pruefe(tts.length >= 1, "Vorlesen ruft /api/tts auf (" + tts.length + " Anfragen)");
pruefe(tts.length && JSON.parse(tts[0]).stimme === "thorsten", "Vorlesen mit der Stimme thorsten");
pruefe(await page.locator(".ki-kennung", { hasText: "KI-erzeugte Stimme" }).isVisible(), "Vorlesen: Stimme ist als KI gekennzeichnet");
await page.screenshot({ path: "tests/ausgabe/ocr-dunkel.png", fullPage: true });
await page.click("text=Vorlesen stoppen");
await page.waitForTimeout(400);
pruefe(await page.locator("button", { hasText: /^Vorlesen$/ }).count() === 1, "Vorlesen stoppen setzt den Knopf zurück");

// Tastatur: Knoepfe erreichbar
await page.focus("text=Text kopieren");
await page.keyboard.press("Tab");
pruefe(await page.evaluate(() => document.activeElement && document.activeElement.tagName === "BUTTON"), "Knöpfe per Tastatur erreichbar");

pruefe(!/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(await page.textContent("#inhalt")), "keine Emojis auf der Seite");
pruefe(!/[–—]/.test(await page.textContent("#inhalt")), "keine Gedankenstriche auf der Seite");

await page.click("text=Kamera stoppen");
await page.waitForTimeout(600);
pruefe((await page.textContent(".d-steuer .chip")) === "Kamera aus", "Stoppen");
pruefe((await page.locator(".ocr-text").innerText()).length > 20, "Text bleibt nach dem Stoppen zum Kopieren stehen");
pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
await t.schliessen();
