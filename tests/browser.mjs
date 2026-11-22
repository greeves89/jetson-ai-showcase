// Gemeinsamer Harness: startet Chrome mit Fake-Webcam, sammelt Konsolenfehler.
//   LABOR_URL     Adresse des Labors (Standard https://localhost:8443)
//   FAKE_VIDEO    Pfad zu einer .y4m/.mjpeg-Datei als Webcam-Bild (optional)
//   FAKE_AUDIO    Pfad zu einer .wav-Datei als Mikrofon (optional, 16 kHz mono)
//   CHROME        Pfad zum Chrome (Standard: macOS-Installation)
import { chromium } from "playwright-core";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { extname, join } from "node:path";

export const URL_LABOR = process.env.LABOR_URL || "https://localhost:8443";
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// einwilligung: true setzt die gemerkte Zustimmung zu Kamera und Mikrofon (localStorage "kl-einwilligung"), damit die
// Labor-Tests nicht an der Einwilligungsansicht haengen. false testet den Erstbesuch (tests/einwilligung.mjs).
// willkommen: false (Standard) setzt localStorage "kl-willkommen", damit das Willkommens-Fenster die Tests nicht stoert (navigator.webdriver unterdrueckt es ohnehin
// ohne ?willkommen=1). true laesst es unberuehrt (Erstbesuch, tests/laien.mjs).
export async function starte({ dunkel = true, breite = 1440, hoehe = 900, kamera = true, einwilligung = true, willkommen = false } = {}) {
  const args = ["--ignore-certificate-errors", "--autoplay-policy=no-user-gesture-required"];
  if (kamera) {
    args.push("--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream");
    const fake = process.env.FAKE_VIDEO;
    if (fake && existsSync(fake)) args.push(`--use-file-for-fake-video-capture=${fake}`);
    const fakeAudio = process.env.FAKE_AUDIO;
    if (fakeAudio && existsSync(fakeAudio)) args.push(`--use-file-for-fake-audio-capture=${fakeAudio}`);
  }
  const browser = await chromium.launch({ executablePath: CHROME, headless: true, args });
  const kontext = await browser.newContext({
    viewport: { width: breite, height: hoehe }, ignoreHTTPSErrors: true,
    colorScheme: dunkel ? "dark" : "light", permissions: kamera ? ["camera", "microphone"] : [],
  });
  if (einwilligung) await kontext.addInitScript(() => { try { localStorage.setItem("kl-einwilligung", JSON.stringify({ kamera: "2026-11-22", mikro: "2026-11-22" })); sessionStorage.setItem("kl-einwilligung-bio", "2026-11-22"); } catch (e) { /* egal */ } });
  if (!willkommen) await kontext.addInitScript(() => { try { if (!localStorage.getItem("kl-willkommen")) localStorage.setItem("kl-willkommen", "1"); } catch (e) { /* egal */ } });
  // LOKAL_STATIC=1: die Dateien unter /static/ kommen von der Platte (Arbeitskopie) statt vom Jetson, damit sich Aenderungen vor dem Deploy pruefen lassen.
  if (process.env.LOKAL_STATIC) {
    const wurzel = join(fileURLToPath(new URL("..", import.meta.url)), "app", "static");
    const typen = { ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
    await kontext.route("**/static/*", async (route) => {
      const u = new URL(route.request().url());
      const datei = join(wurzel, decodeURIComponent(u.pathname.replace(/^\/static\//, "")));
      if (!datei.startsWith(wurzel) || !typen[extname(datei)] || !existsSync(datei)) return route.continue();
      await route.fulfill({ status: 200, contentType: typen[extname(datei)] + "; charset=utf-8", body: readFileSync(datei) });
    });
  }
  const page = await kontext.newPage();
  const fehler = [];
  page.on("console", (m) => { if (m.type() === "error") fehler.push("console: " + m.text()); });
  page.on("pageerror", (e) => fehler.push("pageerror: " + e.message));
  page.on("requestfailed", (r) => { const t = (r.failure() || {}).errorText || ""; if (!/ERR_ABORTED/.test(t)) fehler.push("requestfailed: " + r.url() + " " + t); });
  return { browser, kontext, page, fehler, schliessen: () => browser.close() };
}

export async function oeffneSeite(page, id) {
  await page.goto(`${URL_LABOR}/#/${id}`, { waitUntil: "load" });
  await page.waitForSelector("#inhalt h1", { timeout: 15000 });
  await page.waitForTimeout(400);
}
