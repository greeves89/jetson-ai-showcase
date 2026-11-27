// node tests/bildschutz.mjs: Labor "Bild schützen" (Freistellen und Verpixeln) mit Fake-Webcam.
//   LABOR_URL=https://192.168.178.83:8501 BILD=<.jpg mit sichtbarem Gesicht und Person> node tests/bildschutz.mjs
//   FAKE_VIDEO=<.y4m>   statt BILD: fertiges Video als Webcam
//   BILD=<.jpg>         baut daraus mit ffmpeg ein kurzes Video (4 s, 640x480, 15 Bilder pro Sekunde)
//   ERWARTE_GESICHT     Mindestzahl Gesichter im Testbild (Standard 1; 0 = nicht prüfen)
//   MIN_FPS             Mindestwert für Bilder pro Sekunde (Standard 8)
// Prüft: Seite lädt, KI-Kennzeichnung, Antwortbild kommt, jeder Effektwechsel ändert das Bild, Maske ist ein Graustufenbild,
// Mosaik, Weichzeichner und Balken verändern das Gesicht, die Regler wirken, Vorher-Nachher-Schieber zeichnet, Tempo,
// saubere Konsole und (im Quelltext des Moduls) kein Schreiben auf die Platte. Das Testbild gehört nicht ins Repo (tests/fixtures ist ignoriert).
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

if (!process.env.FAKE_VIDEO && process.env.BILD) {
  const ziel = join(mkdtempSync(join(tmpdir(), "bildschutz-")), "bild.y4m");
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-loop", "1", "-framerate", "15", "-i", process.env.BILD,
    "-vf", "scale=640:480:force_original_aspect_ratio=increase,crop=640:480", "-t", "4", "-pix_fmt", "yuv420p", ziel]);
  process.env.FAKE_VIDEO = ziel;
}
const { starte, oeffneSeite } = await import("./browser.mjs");
const pruefe = (ok, text) => { console.log((ok ? "OK    " : "FEHLT ") + text); if (!ok) process.exitCode = 1; };
if (!process.env.FAKE_VIDEO || !existsSync(process.env.FAKE_VIDEO)) {
  console.log("FEHLT FAKE_VIDEO (.y4m mit Person und Gesicht) oder BILD (.jpg) ist nicht gesetzt");
  process.exit(1);
}
const ERWARTE = Number(process.env.ERWARTE_GESICHT === undefined ? 1 : process.env.ERWARTE_GESICHT);
const MIN_FPS = Number(process.env.MIN_FPS || 8);

// --- Datenschutz im Quelltext: das Modul schreibt nichts auf die Platte und loggt nichts
const quelle = readFileSync(new URL("../app/lab_bildschutz.py", import.meta.url), "utf8").split("\n").filter((z) => !/^\s*#/.test(z)).join("\n").replace(/"""[\s\S]*?"""/g, "");
for (const [name, muster] of [["open(", /\bopen\s*\(/], ["imwrite", /imwrite/], ["write_", /\.write(_text|_bytes)?\s*\(/], ["print(", /\bprint\s*\(/], ["logging", /\blogging\b|\blogger\b/], ["tempfile", /tempfile/], ["pickle", /pickle/], ["sqlite", /sqlite/]]) {
  pruefe(!muster.test(quelle), `Datenschutz: lab_bildschutz.py enthält kein ${name}`);
}

const t = await starte({ dunkel: true });
const { page } = t;
const nachrichten = [];
page.on("websocket", (ws) => {
  if (!/\/ws\/vision/.test(ws.url())) return;
  const eintrag = { url: ws.url(), rahmen: [] };
  nachrichten.push(eintrag);
  ws.on("framereceived", (f) => { try { eintrag.rahmen.push(JSON.parse(f.payload)); } catch (e) { /* Binaerrahmen egal */ } });
});
const letzter = () => { const w = nachrichten.find((n) => n.url.includes("modus=bildschutz")); return w ? w.rahmen[w.rahmen.length - 1] : null; };
const warteAuf = async (f, ms = 12000) => { const ende = Date.now() + ms; while (Date.now() < ende) { const r = letzter(); if (r && f(r)) return r; await page.waitForTimeout(150); } return null; };
const analyse = (bild) => page.evaluate(async (url) => {
  const img = new Image(); img.src = url; await img.decode();
  const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
  const g = c.getContext("2d"); g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  let grau = 0, dunkel = 0, summe = 0; const n = d.length / 4;
  for (let i = 0; i < d.length; i += 4) {
    if (Math.abs(d[i] - d[i + 1]) < 5 && Math.abs(d[i + 1] - d[i + 2]) < 5) grau++;
    if (d[i] < 16 && d[i + 1] < 16 && d[i + 2] < 16) dunkel++;
    summe += d[i] + d[i + 1] + d[i + 2];
  }
  return { grau: grau / n, dunkel, mittel: summe / (3 * n), w: c.width, h: c.height };
}, bild);
const unterschied = (a, b) => page.evaluate(async ([x, y]) => {
  const laden = async (u) => { const i = new Image(); i.src = u; await i.decode(); const c = document.createElement("canvas"); c.width = i.width; c.height = i.height; const g = c.getContext("2d"); g.drawImage(i, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
  const p = await laden(x), q = await laden(y); let s = 0;
  for (let i = 0; i < p.length; i += 4) s += Math.abs(p[i] - q[i]) + Math.abs(p[i + 1] - q[i + 1]) + Math.abs(p[i + 2] - q[i + 2]);
  return s / (p.length / 4) / 3;
}, [a, b]);
const klick = async (selektor) => { await page.click(selektor); };
const effekt = async (name, erwartet) => { await klick(`button.bs-effekt:has-text("${name}")`); const r = await warteAuf((x) => x.effekt === erwartet); pruefe(!!r, `Effekt ${name}: Antwort mit effekt=${erwartet}`); return r; };

await oeffneSeite(page, "bild-schuetzen");
pruefe(/Bild schützen/.test(await page.textContent("#inhalt h1")), "Seite bild-schuetzen öffnet");
pruefe(await page.locator(".ki-hinweis", { hasText: "Schätzung" }).count() === 1, "Kennzeichnung der Schätzung sichtbar (KL.kiHinweis)");
pruefe(await page.locator("#inhalt :text('Keine Rechtsberatung')").count() > 0 || /Rechtsberatung/.test(await page.textContent("#inhalt")), "Hinweis, dass es keine Rechtsberatung ist");

await klick("text=Kamera starten");
await page.waitForSelector(".kameras figure:nth-of-type(2) img", { timeout: 30000 }).catch(() => {});
const erstes = await warteAuf((x) => x.bild, 30000);
pruefe(!!erstes, "Antwortbild kommt vom Jetson");
const w = nachrichten.find((n) => n.url.includes("modus=bildschutz"));
pruefe(!!w, "WebSocket mit modus=bildschutz");
await warteAuf((x) => x.effekt === "unscharf");

// --- Freistellen
let r = letzter();
pruefe(r.funktion === "freistellen" && typeof r.person_prozent === "number" && r.person_prozent > 0, `Freistellen: Anteil Person ${r.person_prozent} %, Netz ${r.ms_netz} ms`);
const unscharf = (await warteAuf((x) => x.effekt === "unscharf")).bild;
await effekt("Einfarbig", "farbe");
const farbe = (await warteAuf((x) => x.effekt === "farbe")).bild;
pruefe(await unterschied(unscharf, farbe) > 3, "Wechsel unscharf nach einfarbig ändert das Bild");
await klick('button.bs-farbe[data-farbe="blau"]');
await page.waitForTimeout(900);
const blau = (letzter()).bild;
pruefe(await unterschied(farbe, blau) > 3, "Farbwahl ändert das Bild");
await effekt("Muster", "muster");
await page.waitForTimeout(600);
const muster = letzter().bild;
pruefe(await unterschied(blau, muster) > 3, "Muster ändert das Bild");
await klick('button.bs-muster[data-muster="karos"]');
await page.waitForTimeout(900);
pruefe(await unterschied(muster, letzter().bild) > 3, "Musterwahl (Karos) ändert das Bild");
await effekt("Nur die Maske", "maske");
await page.waitForTimeout(600);
const maske = await analyse(letzter().bild);
pruefe(maske.grau > 0.99, `Maske ist ein Graustufenbild (${(maske.grau * 100).toFixed(1)} % graue Pixel)`);
pruefe(await page.locator(".bs-legende:visible").count() === 1, "Legende zur Maske sichtbar");
await effekt("Original", "original");
await page.waitForTimeout(500);
// Kantenweichheit: Regler wirkt nur bei Effekten mit Hintergrundersatz
await effekt("Einfarbig", "farbe");
await page.fill("#bs-kante", "0"); await page.dispatchEvent("#bs-kante", "input");
await page.waitForTimeout(1000);
const hart = letzter().bild;
await page.fill("#bs-kante", "10"); await page.dispatchEvent("#bs-kante", "input");
await page.waitForTimeout(1000);
const weich = letzter().bild;
pruefe(await unterschied(hart, weich) > 0.05, "Kantenweichheit 0 gegen 10 ändert den Rand");

// --- Verpixeln
await klick('button.bs-funktion:has-text("Gesichter")');
r = await warteAuf((x) => x.effekt === "mosaik");
pruefe(!!r && r.funktion === "verpixeln", "Umschalter wechselt zu Verpixeln (Mosaik)");
r = await warteAuf((x) => x.effekt === "mosaik" && (ERWARTE === 0 || (x.gesichter || []).length >= ERWARTE), 15000);
pruefe(!!r, `Mindestens ${ERWARTE} Gesicht(er) gefunden`);
if (r && r.gesichter.length) {
  const g = r.gesichter[0];
  console.log("      Gesicht:", JSON.stringify(g), "Blöcke:", r.bloecke, "Suche:", r.ms_suche, "ms");
  pruefe(g.werte < g.pixel && g.werte > 1, `Mosaik: ${g.werte} Farbwerte von ${g.pixel} Pixeln`);
  pruefe((await page.textContent(".bs-gesichter")).includes("Gesicht 1"), "Gesichtsliste zeigt Gesicht 1");
}
const mosaikBild = r.bild;
await page.fill("#bs-staerke", "1"); await page.dispatchEvent("#bs-staerke", "input");
const fein = await warteAuf((x) => x.effekt === "mosaik" && x.bloecke === 40);
await page.fill("#bs-staerke", "10"); await page.dispatchEvent("#bs-staerke", "input");
const grob = await warteAuf((x) => x.effekt === "mosaik" && x.bloecke === 4);
pruefe(!!fein && !!grob && await unterschied(fein.bild, grob.bild) > 0.3, "Blockgröße 1 gegen 10: 40 gegen 4 Blöcke, Bild ändert sich");
await page.fill("#bs-staerke", "6"); await page.dispatchEvent("#bs-staerke", "input");
await effekt("Weichzeichner", "weich");
await page.waitForTimeout(500);
const weichBild = letzter().bild;
pruefe(await unterschied(mosaikBild, weichBild) > 0.2, "Weichzeichner sieht anders aus als Mosaik");
await effekt("Schwarzer Balken", "balken");
r = await warteAuf((x) => x.effekt === "balken" && (ERWARTE === 0 || (x.gesichter || []).length >= ERWARTE), 15000);
if (r && r.gesichter.length) {
  const a = await analyse(r.bild);
  const g = r.gesichter[0];
  pruefe(a.dunkel >= g.pixel * 0.6, `Balken: ${a.dunkel} fast schwarze Pixel bei ${g.pixel} Gesichtspixeln`);
  pruefe(g.werte === 1, "Balken lässt genau einen Farbwert übrig");
} else if (ERWARTE > 0) pruefe(false, "Balken: kein Gesicht gefunden");

// --- Vorher-Nachher-Schieber
await page.click(".bs-vergleich summary");
await page.waitForTimeout(1500);
const vor = await page.evaluate(() => { const c = document.querySelector(".bs-vorher"); const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2]; return s; });
pruefe(vor > 0, "Vorher-Nachher: das Vorher-Bild ist gezeichnet");
pruefe(((await page.getAttribute(".bs-nachher", "src")) || "").startsWith("data:image/jpeg"), "Vorher-Nachher: das Nachher-Bild kommt vom Jetson");

// --- Tempo und Erklärung
await page.waitForTimeout(2500);
const werte = await page.$$eval(".messwerte .messwert b", (bs) => bs.map((b) => b.textContent));
const fps = Number(String(werte[2]).replace(",", "."));
pruefe(fps >= MIN_FPS, `Bilder pro Sekunde ${werte[2]} (Ziel mindestens ${MIN_FPS}), Treffer ${werte[0]}, Runde ${werte[1]}`);
const satz = await page.textContent(".live .erklaerung");
pruefe(/Gefunden/.test(satz), "Live-Erklärung nennt, was gefunden wurde: " + satz.slice(0, 110));
pruefe(!/[–—]/.test(await page.textContent("#inhalt")), "keine Gedankenstriche auf der Seite");
pruefe(!/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(await page.textContent("#inhalt")), "keine Emojis auf der Seite");
await page.screenshot({ path: "tests/ausgabe/bildschutz-dunkel.png", fullPage: true });

await klick("text=Kamera stoppen");
await page.waitForTimeout(600);
pruefe((await page.textContent(".d-steuer .chip")) === "Kamera aus", "Stoppen");
pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
await t.schliessen();
