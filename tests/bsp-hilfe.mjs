// Gemeinsame Hilfen der Beispiel-Tests (tests/beispiele-*.mjs). Kein eigener Test.
//   LABOR_URL=https://<jetson>:8443 node tests/beispiele-<id>.mjs
import { starte, URL_LABOR } from "./browser.mjs";
import { readFileSync } from "node:fs";

export const manifest = JSON.parse(readFileSync(new URL("../app/static/beispiele/manifest.json", import.meta.url), "utf8"));
export const eintrag = (id) => manifest.usecases.find((u) => u.id === id);

export function pruefer() {
  const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) process.exitCode = 1; };
  return { pruefe };
}

/* Oeffnet /<labor>?beispiel=<id> als echte Adresse und wartet auf den Beispielkopf. */
export async function oeffneBeispiel(id, opt = {}) {
  const e = eintrag(id);
  if (!e) throw new Error("Beispiel nicht im Katalog: " + id);
  const t = await starte({ kamera: !!opt.kamera });
  const { page } = t;
  await page.goto(`${URL_LABOR}/${e.lab}?beispiel=${id}`, { waitUntil: "load" });
  await page.waitForSelector("#inhalt h1", { timeout: 15000 });
  await page.waitForSelector(".d-beispiel .d-bsp-kopf", { timeout: 15000 });
  return { t, page, e };
}

export async function warteStatus(page, muster, timeout = 180000) {
  await page.waitForFunction((m) => { const s = document.querySelector(".d-beispiel .d-bsp-status"); return s && new RegExp(m).test(s.textContent); }, muster.source, { timeout });
}
export const normal = (s) => String(s).toLowerCase().replace(/\s+/g, " ");
export const origin = (page) => new URL(page.url()).origin;

/* Lädt das Sprachmodell vor dem Test (Ollama-Port des Jetson). Hintergrund: Wird es erst nach dem Embedding-Modell geladen,
   scheitert auf dem Jetson gelegentlich der CUDA-Puffer ("Dem Jetson fehlt gerade freier Speicher"). Nicht fatal. */
export async function waermeLlm(modell = "llama3.2:3b") {
  const host = new URL(URL_LABOR).hostname;
  try {
    // erst entladen: Ein zuvor halb geladenes Modell erzeugt sonst Unsinn
    await fetch(`http://${host}:11434/api/generate`, { method: "POST", body: JSON.stringify({ model: modell, keep_alive: 0 }), signal: AbortSignal.timeout(30000) });
    await new Promise((ok) => setTimeout(ok, 3000));
    const r = await fetch(`http://${host}:11434/api/chat`, { method: "POST", body: JSON.stringify({ model: modell, messages: [{ role: "user", content: "Sag hallo" }], stream: false, keep_alive: "20m" }), signal: AbortSignal.timeout(120000) });
    console.log("Sprachmodell vorgewärmt: HTTP " + r.status);
  } catch (e) { console.log("Sprachmodell nicht vorgewärmt (" + e.message + "), der Test läuft trotzdem."); }
}
