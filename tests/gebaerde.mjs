// node tests/gebaerde.mjs: Labor "Fingeralphabet" im Browser.
//   LABOR_URL=https://192.168.178.83:8443 node tests/gebaerde.mjs           Oberfläche ohne Kamera (Zeigen, Alphabet, Halten, Üben-Anzeige)
//   FAKE_VIDEO=<.y4m mit sichtbarer Hand> oder HAND_BILD=<.jpg>             zusätzlich der Weg über die Kamera (Erkennen) auf dem Jetson
//   ERWARTE_BUCHSTABE  erwarteter Buchstabe im Kamerabild (leer = nur prüfen, dass etwas Sinnvolles zurückkommt)
//   HAND_ECHT=1        das Testbild zeigt eine echte Hand: dann muss sie gefunden werden
//   MIN_FPS            Mindestwert für Bilder pro Sekunde (Standard 6)
// Prüft ohne Kamera: Seite, Kennzeichnung der Schätzungen, "Nicht die Gebärdensprache", Alphabetkarten und Tabelle (stimmt mit
// den Messwerten der Vorlagendatei überein), Wort zeigen (Animation, Tempo, Linkshänder-Spiegelung), Halte-Logik (0,8 s, Sperre,
// Löschen), Zerlegung von Text, keine Gedankenstriche, saubere Konsole. Das Testbild gehört nicht ins Repo (tests/fixtures ist ignoriert).
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

if (!process.env.FAKE_VIDEO && process.env.HAND_BILD) {
  const ziel = join(mkdtempSync(join(tmpdir(), "gebaerde-")), "hand.y4m");
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-loop", "1", "-framerate", "15", "-i", process.env.HAND_BILD,
    "-vf", "scale=640:480:force_original_aspect_ratio=increase,crop=640:480", "-t", "5", "-pix_fmt", "yuv420p", ziel]);
  process.env.FAKE_VIDEO = ziel;
}
const { starte, oeffneSeite } = await import("./browser.mjs");
const pruefe = (ok, text) => { console.log((ok ? "OK    " : "FEHLT ") + text); if (!ok) process.exitCode = 1; };
mkdirSync("tests/ausgabe", { recursive: true });
const mitKamera = !!(process.env.FAKE_VIDEO && existsSync(process.env.FAKE_VIDEO));
const MIN_FPS = Number(process.env.MIN_FPS || 6);
const daten = JSON.parse(readFileSync(new URL("../app/static/daten/gebaerde-vorlagen.json", import.meta.url), "utf8"));

const t = await starte({ dunkel: true, kamera: mitKamera });
const { page } = t;
const nachrichten = [];
page.on("websocket", (ws) => {
  if (!/\/ws\/vision/.test(ws.url())) return;
  const eintrag = { url: ws.url(), rahmen: [], gesendet: [] };
  nachrichten.push(eintrag);
  ws.on("framereceived", (f) => { try { eintrag.rahmen.push(JSON.parse(f.payload)); } catch (e) { /* Binaerrahmen egal */ } });
  ws.on("framesent", (f) => { if (typeof f.payload === "string" && f.payload.startsWith("{")) eintrag.gesendet.push(f.payload); });
});

await oeffneSeite(page, "fingeralphabet");
const seite = await page.textContent("#inhalt");
pruefe(/Fingeralphabet/.test(await page.textContent("#inhalt h1")), "Seite fingeralphabet öffnet");
pruefe(await page.locator(".ki-hinweis", { hasText: "Schätzung" }).count() === 1, "Kennzeichnung der Schätzung sichtbar (KL.kiHinweis)");
pruefe(/nicht dasselbe|nicht die Gebärdensprache|übersetzt keine Gebärdensprache/.test(seite), "Seite sagt: Fingeralphabet ist nicht die Gebärdensprache, keine Übersetzung");
pruefe(!/[–—]/.test(seite), "keine Gedankenstriche auf der Seite");
pruefe(!/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(seite), "keine Emojis auf der Seite");
pruefe(await page.locator('a[href^="https://gehoerlosenbund.de"]').count() >= 1 || /Gehörlosen-Bund/.test(seite), "Verweis auf offizielle Stelle (Gehörlosen-Bund)");

// ---- Alphabet und Tabelle
await page.click("#gb-tab-alphabet");
const kacheln = await page.locator(".gb-kachel").count();
pruefe(kacheln === 31, `Alphabet: 31 Karten (26 Buchstaben, Ä, Ö, Ü, ß, Sch) gefunden: ${kacheln}`);
const tabelleText = await page.locator(".gb-tab-tabelle").innerText();
const sicher = Object.entries(daten.stufen).filter(([k, s]) => s.stufe === "sicher" && !["LEER", "LOESCHEN"].includes(k)).map(([k]) => k);
const unsicher = Object.entries(daten.stufen).filter(([k, s]) => s.stufe !== "sicher" && !["LEER", "LOESCHEN"].includes(k)).map(([k]) => k);
pruefe(sicher.every((k) => new RegExp("\\b" + k + "\\b").test(tabelleText.split("Im Test unsicher")[0])), `Tabelle im Labor: sicher = ${sicher.join(" ")} wie in der Messung`);
pruefe(unsicher.every((k) => new RegExp("\\b" + k + " \\(mit").test(tabelleText)), `Tabelle im Labor: unsicher = ${unsicher.join(" ")} wie in der Messung`);
pruefe(/J, Z, Ä, Ö, Ü, ß, Sch/.test(tabelleText), "Tabelle im Labor nennt die nicht erkannten Zeichen");
const lehrTabelle = await page.locator("#inhalt table").allInnerTexts();
pruefe(lehrTabelle.some((x) => sicher.every((k) => new RegExp("\\b" + k + "\\b").test(x.split("Im Test unsicher")[0]))), "Tabelle im Lehrtext stimmt mit der Messung überein");
await page.click('.gb-kachel[aria-label^="Zeichen Z"]');
pruefe(/Zickzack/.test(await page.textContent(".gb-detail")) && /nicht erkannt/.test(await page.textContent(".gb-detail")), "Z: Detail nennt Bewegung und 'nicht erkannt'");
await page.screenshot({ path: "tests/ausgabe/gebaerde-alphabet.png", fullPage: false });
const pfade = await page.locator(".gb-kachel svg .hd-f").count();
pruefe(pfade >= 31 * 5, "Karten sind gezeichnete Hände (SVG), keine Bilder");
pruefe(await page.locator(".gb-kachel img, .gb-detail img").count() === 0, "keine Fotos oder Bilddateien in den Karten");

// ---- Linkshänder: Spiegelung
const vorher = await page.locator('.gb-kachel[aria-label^="Zeichen L,"] svg .hd-f').first().getAttribute("points");
await page.check("#gb-spiegel");
const nachher = await page.locator('.gb-kachel[aria-label^="Zeichen L,"] svg .hd-f').first().getAttribute("points");
const xs = (s) => s.trim().split(" ").map((q) => Number(q.split(",")[0]));
const mitte = (a) => a.reduce((x, y) => x + y, 0) / a.length;
pruefe(vorher !== nachher && Math.abs((mitte(xs(vorher)) - 100) + (mitte(xs(nachher)) - 100)) < 6, "Linkshänder: Zeichnung wird gespiegelt");
await page.uncheck("#gb-spiegel");

// ---- Wort zeigen
await page.click("#gb-tab-zeigen");
await page.fill("#gb-wort", "Schule Ä!");
await page.click(".gb-eingabe .btn.primary");
await page.waitForTimeout(900);
const kette = (await page.locator("#gb-tafel-zeigen .gb-kettenglied").allTextContents()).join("|");
pruefe(kette === "Sch|U|L|E|·|Ä", `Wort zerlegt: sch als ein Zeichen, Leerzeichen als Pause, Umlaut erhalten (${kette})`);
pruefe(/Nicht gezeigt/.test(await page.textContent("#gb-wort-hilfe")) && /!/.test(await page.textContent("#gb-wort-hilfe")), "Satzzeichen werden gemeldet statt verschluckt");
const z1 = await page.textContent(".gb-zeigen-z");
await page.waitForTimeout(2600);
const z2 = await page.textContent(".gb-zeigen-z");
pruefe(z1 !== z2, `Animation läuft weiter (${z1} dann ${z2})`);
await page.screenshot({ path: "tests/ausgabe/gebaerde-zeigen.png", fullPage: false });
await page.click(".gb-tempi .gb-tempo:nth-of-type(1)");
pruefe((await page.getAttribute(".gb-tempi .gb-tempo:nth-of-type(1)", "aria-pressed")) === "true", "Tempo Langsam wählbar");
await page.click(".gb-eingabe .btn >> text=Wiederholen");
await page.waitForTimeout(500);
pruefe(/1 von/.test(await page.textContent(".gb-zeigen-zaehler")), "Wiederholen beginnt von vorn");
await page.click("#gb-tafel-zeigen .gb-kettenglied:nth-child(2)");
pruefe(/U/.test(await page.textContent(".gb-zeigen-z")), "Klick auf ein Zeichen springt dorthin");

// ---- Reine Bausteine: Zerlegen und Halten
const logik = await page.evaluate(() => {
  const G = window.KL.gebaerde;
  const aus = {};
  aus.zerlege = G.zerlege("Straße, Äpfel 12 sch Sch").zeichen.map((z) => z.z).join("");
  const h = new G.HalteLogik();
  const f = [];
  for (let ms = 0; ms <= 1000; ms += 100) f.push(h.update("B", ms).bestaetigt);
  aus.bestaetigtB = f.findIndex((x) => x === "B") * 100;
  aus.nochmal = h.update("B", 1500).bestaetigt;                       // gesperrt: nicht noch einmal B
  h.update(null, 1600); h.update(null, 2100);                          // Hand weg: Sperre löst sich
  const g = [];
  for (let ms = 2200; ms <= 3300; ms += 100) g.push(h.update("B", ms).bestaetigt);
  aus.zweitesB = g.includes("B");
  const k = new G.HalteLogik();
  let früh = null;
  for (let ms = 0; ms <= 700; ms += 100) früh = früh || k.update(ms < 300 ? "A" : "C", ms).bestaetigt;
  aus.wechselSetztZurück = früh;                                       // A kurz, dann C: nach 700 ms noch nichts
  const kn = new G.HalteLogik();
  const unt = [];
  for (let ms = 0; ms <= 600; ms += 100) unt.push(kn.update(ms === 300 ? null : "A", ms).kandidat);
  aus.kurzeLueckeOk = unt[unt.length - 1] === "A";                     // 100 ms ohne Erkennung bricht das Halten nicht ab
  return aus;
});
pruefe(logik.zerlege === "STRAßE ÄPFEL Sch Sch", `Text zerlegen (ß, Umlaut, Zahl und Komma fallen heraus, sch ein Zeichen): ${logik.zerlege}`);
pruefe(logik.bestaetigtB >= 700 && logik.bestaetigtB <= 900, `Halten: Buchstabe nach ${logik.bestaetigtB} ms bestätigt (Ziel 800)`);
pruefe(logik.nochmal === null, "Halten: derselbe Buchstabe zählt nicht noch einmal, solange die Form gehalten wird");
pruefe(logik.zweitesB === true, "Halten: nach Hand weg zählt derselbe Buchstabe wieder");
pruefe(logik.wechselSetztZurück === null, "Halten: Wechsel der Form beginnt das Halten von vorn");
pruefe(logik.kurzeLueckeOk, "Halten: eine kurze Lücke bricht das Halten nicht ab");
await page.screenshot({ path: "tests/ausgabe/gebaerde-seite.png", fullPage: true });

// ---- Kamera (nur mit FAKE_VIDEO)
if (mitKamera) {
  await page.click("#gb-tab-lesen");
  pruefe((await page.textContent(".gb-lesen-status")).includes("Kamera"), "Wort lesen erklärt, was zu tun ist");
  await page.click("text=Kamera starten");
  await page.waitForSelector(".gb-gross", { timeout: 25000 });
  await page.waitForTimeout(6000);
  const ws = nachrichten.find((n) => n.url.includes("modus=gebaerde"));
  pruefe(!!ws, "WebSocket mit modus=gebaerde");
  const rahmen = ws ? ws.rahmen.filter((r) => r.bild) : [];
  pruefe(rahmen.length > 8, `Server schickt Bilder (${rahmen.length})`);
  const letzte = rahmen[rahmen.length - 1] || {};
  console.log("      Antwort:", JSON.stringify({ ...letzte, bild: undefined, punkte: letzte.punkte ? "21" : undefined }));
  pruefe(["keine_hand", "unsicher", "keine_form", "erkannt"].includes(letzte.zustand), `Antwort hat einen Zustand: ${letzte.zustand}`);
  const mitHand = rahmen.filter((r) => r.zustand !== "keine_hand");
  if (process.env.HAND_ECHT) pruefe(mitHand.length > rahmen.length * 0.5, `Hand in ${mitHand.length} von ${rahmen.length} Bildern gefunden`);
else console.log(`      Hand in ${mitHand.length} von ${rahmen.length} Bildern (HAND_ECHT=1 setzen, wenn das Testbild eine echte Hand zeigt; gezeichnete Hände findet das Handnetz nicht)`);
  if (process.env.ERWARTE_BUCHSTABE) pruefe(letzte.buchstabe === process.env.ERWARTE_BUCHSTABE, `Buchstabe erkannt: ${letzte.buchstabe} (erwartet ${process.env.ERWARTE_BUCHSTABE})`);
  const werte = await page.$$eval(".messwerte .messwert b", (bs) => bs.map((b) => b.textContent));
  const fps = Number(String(werte[2]).replace(",", "."));
  pruefe(fps >= MIN_FPS, `Bilder pro Sekunde ${werte[2]} (Ziel mindestens ${MIN_FPS}), erkennen ${JSON.stringify(letzte.zeiten)}`);
  const feld = await page.inputValue("#gb-ergebnis");
  console.log("      Wortfeld nach 6 s:", JSON.stringify(feld));
  await page.click("#gb-tab-ueben");
  await page.click(".gb-uebung-steuer .btn.primary");
  await page.waitForTimeout(2500);
  pruefe(ws.gesendet.some((x) => /"ziel":"[A-Y]"/.test(x)), "Übung sendet das Ziel an den Jetson");
  pruefe(await page.locator(".gb-uebung .hd-skelett").count() === 1, "Übung zeigt die Punkte der erkannten Hand");
  await page.screenshot({ path: "tests/ausgabe/gebaerde-kamera.png", fullPage: true });
  await page.click("text=Kamera stoppen");
  await page.waitForTimeout(600);
  pruefe((await page.textContent(".d-steuer .chip")) === "Kamera aus", "Stoppen");
}
pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
await t.schliessen();
