// Gemeinsamer Harness: startet Chrome mit Fake-Webcam, sammelt Konsolenfehler.
//   LABOR_URL     Adresse des Labors (Standard https://localhost:8443)
//   FAKE_VIDEO    Pfad zu einer .y4m/.mjpeg-Datei als Webcam-Bild (optional)
//   FAKE_AUDIO    Pfad zu einer .wav-Datei als Mikrofon (optional, 16 kHz mono)
//   CHROME        Pfad zum Chrome (Standard: macOS-Installation)
import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

export const URL_LABOR = process.env.LABOR_URL || "https://localhost:8443";
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// einwilligung: true setzt die gemerkte Zustimmung zu Kamera und Mikrofon (localStorage "kl-einwilligung"), damit die
// Labor-Tests nicht an der Einwilligungsansicht haengen. false testet den Erstbesuch (tests/einwilligung.mjs).
export async function starte({ dunkel = true, breite = 1440, hoehe = 900, kamera = true, einwilligung = true } = {}) {
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
