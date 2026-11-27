// node tests/hand-gesicht.mjs: Labor "Hände und Gesichter" mit Fake-Webcam.
//   LABOR_URL=https://192.168.178.83:8443 FAKE_VIDEO=<.y4m mit sichtbarer Hand und Gesicht> node tests/hand-gesicht.mjs
//   HAND_BILD=<.jpg>   statt FAKE_VIDEO: baut daraus mit ffmpeg ein kurzes Video (4 s, 640x480, 15 Bilder pro Sekunde)
//   ERWARTE_GESTE      erwartete Geste im Testbild (Standard "Daumen hoch"; leer = nicht prüfen)
//   MIN_FPS            Mindestwert für Bilder pro Sekunde (Standard 8)
// Prüft: Hand- und Gesichtsdaten kommen über /ws/vision an, die Karten erscheinen und ändern sich nicht flackernd,
// Tempo, Kennzeichnung der Schätzungen, Stoppen, saubere Konsole. Das Testbild gehört nicht ins Repo (tests/fixtures ist ignoriert).
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

if (!process.env.FAKE_VIDEO && process.env.HAND_BILD) {
  const ziel = join(mkdtempSync(join(tmpdir(), "hand-")), "hand.y4m");
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-loop", "1", "-framerate", "15", "-i", process.env.HAND_BILD,
    "-vf", "scale=640:480:force_original_aspect_ratio=increase,crop=640:480", "-t", "4", "-pix_fmt", "yuv420p", ziel]);
  process.env.FAKE_VIDEO = ziel;
}
const { starte, oeffneSeite } = await import("./browser.mjs");
const pruefe = (ok, text) => { console.log((ok ? "OK    " : "FEHLT ") + text); if (!ok) process.exitCode = 1; };
if (!process.env.FAKE_VIDEO || !existsSync(process.env.FAKE_VIDEO)) {
  console.log("FEHLT FAKE_VIDEO (.y4m mit Hand und Gesicht) oder HAND_BILD (.jpg) ist nicht gesetzt");
  process.exit(1);
}
const ERWARTE = process.env.ERWARTE_GESTE === undefined ? "Daumen hoch" : process.env.ERWARTE_GESTE;
const MIN_FPS = Number(process.env.MIN_FPS || 8);

const t = await starte({ dunkel: true });
const { page } = t;
const nachrichten = [];
page.on("websocket", (ws) => {
  if (!/\/ws\/vision/.test(ws.url())) return;
  nachrichten.push({ url: ws.url(), rahmen: [] });
  const eintrag = nachrichten[nachrichten.length - 1];
  ws.on("framereceived", (f) => { try { eintrag.rahmen.push(JSON.parse(f.payload)); } catch (e) { /* Binaerrahmen egal */ } });
});

await oeffneSeite(page, "hand-gesicht");
pruefe(/Hände und Gesichter/.test(await page.textContent("#inhalt h1")), "Seite hand-gesicht öffnet");
pruefe(await page.locator(".ki-hinweis", { hasText: "Schätzungen" }).count() === 1, "Kennzeichnung der Schätzungen sichtbar (KL.kiHinweis)");
pruefe((await page.textContent(".d-karten-leer")).includes("Halte eine Hand"), "Leerzustand der Karten erklärt, was zu tun ist");

await page.click("text=Kamera starten");
await page.waitForSelector(".d-karte-hand", { timeout: 25000 }).catch(() => {});
await page.waitForSelector(".d-karte-gesicht", { timeout: 25000 }).catch(() => {});
await page.waitForTimeout(5000);

const ws = nachrichten.find((n) => n.url.includes("modus=hand_gesicht"));
pruefe(!!ws, "WebSocket mit modus=hand_gesicht");
const rahmen = ws ? ws.rahmen.filter((r) => r.bild) : [];
pruefe(rahmen.length > 10, `Server schickt Bilder (${rahmen.length})`);
const mitHand = rahmen.filter((r) => (r.haende || []).length > 0);
const mitGesicht = rahmen.filter((r) => (r.gesichter || []).length > 0);
pruefe(mitHand.length > rahmen.length * 0.7, `Handdaten in ${mitHand.length} von ${rahmen.length} Bildern (auch auf Nachführ-Bildern)`);
pruefe(mitGesicht.length > rahmen.length * 0.7, `Gesichtsdaten in ${mitGesicht.length} von ${rahmen.length} Bildern`);
const letzte = rahmen[rahmen.length - 1] || {};
const hand = (letzte.haende || [])[0] || {};
const gesicht = (letzte.gesichter || [])[0] || {};
console.log("      Hand:", JSON.stringify(hand), "Gesicht:", JSON.stringify(gesicht), "Zeiten:", JSON.stringify(letzte.detail_ms), JSON.stringify(letzte.zeiten));
pruefe(["links", "rechts", "unklar"].includes(hand.seite) && typeof hand.geste === "string" && Number.isInteger(hand.finger) && hand.sicher > 0.5, "Hand: Seite, Geste, Fingerzahl, Sicherheit");
if (ERWARTE) pruefe(hand.geste === ERWARTE, `Geste erkannt: ${hand.geste} (erwartet ${ERWARTE})`);
pruefe(["neutral", "froh", "traurig", "überrascht", "ängstlich", "angewidert", "wütend"].includes(gesicht.ausdruck) && typeof gesicht.laechelt === "boolean", "Gesicht: Ausdruck (deutsch), Lächeln");
pruefe(["geradeaus", "links", "rechts", "geneigt"].includes(gesicht.kopf), `Gesicht: Kopfhaltung ${gesicht.kopf}`);
const gesten = new Set(mitHand.map((r) => r.haende[0].geste));
pruefe(gesten.size <= 2, `Geste bleibt stabil (${[...gesten].join(", ")})`);

// Karten im DOM
const handKarte = await page.locator(".d-karte-hand").first().innerText();
const gesichtKarte = await page.locator(".d-karte-gesicht").first().innerText();
console.log("      Karte Hand:", handKarte.replace(/\n/g, " | "));
console.log("      Karte Gesicht:", gesichtKarte.replace(/\n/g, " | "));
pruefe(/Hand 1/.test(handKarte) && /Geste/.test(handKarte) && /Finger gestreckt/.test(handKarte) && /(rechte Hand|linke Hand|nicht sicher)/.test(handKarte), "Handkarte zeigt Seite, Geste, Finger");
pruefe(/Gesicht 1/.test(gesichtKarte) && /Ausdruck/.test(gesichtKarte) && /Lächeln/.test(gesichtKarte) && /Kopfhaltung/.test(gesichtKarte), "Gesichtskarte zeigt Ausdruck, Lächeln, Kopfhaltung");
pruefe(await page.locator(".d-karte-hand svg, .d-karte-gesicht svg").count() >= 2, "Karten haben lucide-Symbole");
pruefe(!/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(handKarte + gesichtKarte), "keine Emojis in den Karten");
pruefe(!/[–—]/.test(await page.textContent("#inhalt")), "keine Gedankenstriche auf der Seite");

// Tempo (Browser bis Jetson und zurück, wie in der Oberfläche gemessen)
await page.waitForTimeout(2500);
const werte = await page.$$eval(".messwerte .messwert b", (bs) => bs.map((b) => b.textContent));
const fps = Number(String(werte[2]).replace(",", "."));
pruefe(fps >= MIN_FPS, `Bilder pro Sekunde ${werte[2]} (Ziel mindestens ${MIN_FPS}), Treffer ${werte[0]}, Runde ${werte[1]}`);
const satz = await page.textContent(".live .erklaerung");
pruefe(/Hand/.test(satz) && /Gesicht/.test(satz), "Live-Erklärung nennt Hände und Gesichter: " + satz.slice(0, 120));
await page.screenshot({ path: "tests/ausgabe/hand-gesicht-dunkel.png", fullPage: true });

await page.click("text=Kamera stoppen");
await page.waitForTimeout(600);
pruefe((await page.textContent(".d-steuer .chip")) === "Kamera aus", "Stoppen");
pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
await t.schliessen();
