// Prueft die PDFs unter app/static/materialien/: Seitenzahl, Text vorhanden (pdftotext), Link im PDF, QR-Code dekodierbar und gleich der Adresse.
// Voraussetzung: poppler (pdfinfo, pdftotext, pdftoppm). Aufruf: node tests/materialien-pruefen.mjs
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const hier = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const jsQR = require("jsqr");
const { PNG } = require("pngjs");
const DIR = path.join(hier, "..", "app", "static", "materialien");
const BASIS = "https://ki-labor.daniel-alisch.site";
let fehler = 0;
const meld = (t) => { fehler++; console.log("  FEHLER: " + t); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mat-"));

for (const n of [1, 2, 3]) {
  for (const art of ["arbeitsblatt", "loesung"]) {
    const name = `${art}-stunde-${n}`, pdf = path.join(DIR, name + ".pdf");
    const info = execFileSync("pdfinfo", [pdf]).toString();
    const seiten = Number((info.match(/Pages:\s+(\d+)/) || [])[1]);
    const text = execFileSync("pdftotext", ["-layout", pdf, "-"]).toString();
    const soll = art === "arbeitsblatt" ? [`${BASIS}/schule-stunde-${n}?weg=schule`] : [`${BASIS}/schule-stunde-${n}?weg=schule`, `${BASIS}/schule-lehrkraefte?weg=schule`];
    console.log(`${name}: ${seiten} Seite(n), ${text.split(/\s+/).filter(Boolean).length} Wörter, Format ${(info.match(/Page size:\s+(.+)/) || [])[1]}`);
    if (art === "arbeitsblatt" && seiten !== 1) meld(name + ": mehr als eine Seite");
    if (art === "loesung" && seiten > 2) meld(name + ": mehr als zwei Seiten");
    if (!/Stand 22\.11\.2026/.test(text) || !/Lizenz: noch festzulegen/.test(text)) meld(name + ": Kopfzeile fehlt");
    if (!/Mehr dazu im KI-Labor|im KI-Labor/.test(text)) meld(name + ": Kasten Mehr dazu fehlt");
    if (/[–—]/.test(text)) meld(name + ": Gedankenstrich");
    if (art === "arbeitsblatt" && !/Ich habe verstanden/.test(text)) meld(name + ": Kästchen Ich habe verstanden fehlt");
    if (art === "arbeitsblatt" && !/Name:/.test(text) || !/Datum:|Lösung/.test(text)) meld(name + ": Name oder Datum fehlt");
    const roh = fs.readFileSync(pdf).toString("latin1");
    const links = [...roh.matchAll(/\/URI\s*\(([^)]+)\)/g)].map((m) => m[1]);
    // QR-Codes: jede Seite rendern und alle dekodierbaren Codes einsammeln (Lösungsblatt hat zwei nebeneinander)
    execFileSync("pdftoppm", ["-r", "300", "-png", pdf, path.join(tmp, name)]);
    const gefunden = [];
    for (const f of fs.readdirSync(tmp).filter((x) => x.startsWith(name + "-"))) {
      const png = PNG.sync.read(fs.readFileSync(path.join(tmp, f)));
      const rgba = new Uint8ClampedArray(png.data);
      const b = png.width, hh = png.height;
      // ganze Seite und linke/rechte Haelfte der unteren Seitenhaelfte (zwei Codes nebeneinander)
      const ausschnitt = (x0, y0, w, h) => { const o = new Uint8ClampedArray(w * h * 4); for (let y = 0; y < h; y++) o.set(rgba.subarray(((y0 + y) * b + x0) * 4, ((y0 + y) * b + x0 + w) * 4), y * w * 4); return [o, w, h]; };
      for (const [x0, w] of [[0, b], [0, Math.floor(b / 2)], [Math.floor(b / 2), Math.ceil(b / 2)]]) {
        const [d, ww, h2] = ausschnitt(x0, 0, w, hh);
        const q = jsQR(d, ww, h2);
        if (q && !gefunden.includes(q.data)) gefunden.push(q.data);
      }
    }
    for (const u of soll) {
      if (!gefunden.includes(u)) meld(`${name}: QR-Code für ${u} nicht dekodierbar (gefunden: ${JSON.stringify(gefunden)})`);
      if (!links.includes(u)) meld(`${name}: Link ${u} fehlt als anklickbare Verknüpfung (gefunden: ${JSON.stringify(links)})`);
    }
    console.log(`   QR dekodiert: ${gefunden.join("  |  ")}; Links: ${links.join(" | ")}`);
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(fehler ? `${fehler} Fehler` : "alles in Ordnung");
process.exit(fehler ? 1 : 0);
