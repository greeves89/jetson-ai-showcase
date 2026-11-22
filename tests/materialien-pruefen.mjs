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
const { INHALT } = await import("../scripts/inhalt.mjs");
const OPERATOREN = Object.fromEntries(INHALT.seiten["schule-lehrkraefte"].abschnitte.find((x) => x.h === "Operatoren in den Aufgaben").tabelle.zeilen.map((z) => [z[0], z]));
const DIR = path.join(hier, "..", "app", "static", "materialien");
const BASIS = "https://ki-labor.daniel-alisch.site";
let fehler = 0;
const meld = (t) => { fehler++; console.log("  FEHLER: " + t); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mat-"));

// KI-Stunden 1 bis 3 und die sieben Medien-Einheiten (Seiten medien-stunde-1 bis -7)
const EINHEITEN = [1, 2, 3].map((n) => ({ datei: `stunde-${n}`, id: `schule-stunde-${n}` })).concat([1, 2, 3, 4, 5, 6, 7].map((n) => ({ datei: `medien-${n}`, id: `medien-stunde-${n}` })));
for (const { datei, id } of EINHEITEN) {
  for (const art of ["arbeitsblatt", "loesung"]) {
    const name = `${art}-${datei}`, pdf = path.join(DIR, name + ".pdf");
    const info = execFileSync("pdfinfo", [pdf]).toString();
    const seiten = Number((info.match(/Pages:\s+(\d+)/) || [])[1]);
    const text = execFileSync("pdftotext", ["-layout", pdf, "-"]).toString();
    const soll = art === "arbeitsblatt" ? [`${BASIS}/${id}?weg=schule`] : [`${BASIS}/${id}?weg=schule`, `${BASIS}/schule-lehrkraefte?weg=schule`];
    console.log(`${name}: ${seiten} Seite(n), ${text.split(/\s+/).filter(Boolean).length} Wörter, Format ${(info.match(/Page size:\s+(.+)/) || [])[1]}`);
    if (art === "arbeitsblatt" && (seiten < 2 || seiten > 3)) meld(name + ": erwartet 2 bis 3 Seiten, gefunden " + seiten);
    if (art === "loesung" && seiten > 3) meld(name + ": mehr als drei Seiten");
    if (!/Stand 22\.11\.2026/.test(text) || !/Lizenz: noch festzulegen/.test(text)) meld(name + ": Kopfzeile fehlt");
    if (!/Mehr dazu im KI-Labor|im KI-Labor/.test(text)) meld(name + ": Kasten Mehr dazu fehlt");
    if (/[–—]/.test(text)) meld(name + ": Gedankenstrich");
    if (!/abgerufen am 22\.11\.2026/.test(text) || !/Zuordnung kann je Bundesland und Fach leicht abweichen/.test(text)) meld(name + ": Quellenhinweis zu den Operatoren fehlt");
    // Operatoren: jede Aufgabe beginnt mit einem fetten Operator samt Bereich (siehe Seitendaten), die Legende nennt alle verwendeten
    const opTab = OPERATOREN;
    const genutzt = [...new Set([...text.matchAll(/\b(Nenne|Beschreibe|Erkläre|Vergleiche|Begründe|Beurteile|Überprüfe|Entwickle|nenne|beschreibe|erkläre|vergleiche|begründe|beurteile|überprüfe|entwickle) \((I{1,3})\)/g)].map((m) => m[1][0].toUpperCase() + m[1].slice(1) + "|" + m[2]))];
    if (art === "arbeitsblatt") {
      if (!/Operator\s+Das sollst du tun\s+Bereich/.test(text)) meld(name + ": Operatoren-Legende fehlt");
      const bereiche = new Set(genutzt.map((g) => g.split("|")[1]));
      for (const b of ["I", "II", "III"]) if (!bereiche.has(b)) meld(`${name}: kein Operator im Bereich ${b}`);
      for (const g of genutzt) {
        const [o, b] = g.split("|");
        if (!opTab[o]) meld(`${name}: Operator ${o} nicht in der Tabelle der Handreichung`);
        else if (opTab[o][2] !== b) meld(`${name}: ${o} trägt (${b}), Tabelle sagt ${opTab[o][2]}`);
        else if (!new RegExp(`${o}\\s+${opTab[o][1].slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(text)) meld(`${name}: Legendenzeile für ${o} fehlt`);
      }
      const ziele = (text.match(/Heute kannst du/g) || []).length;
      if (ziele !== 1) meld(name + ": Kopf Heute kannst du fehlt");
      if (!/sicher\s+fast\s+noch nicht/.test(text)) meld(name + ": Selbsteinschätzung fehlt");
      if (!/Niveau:\s+Basis\s+Standard\s+Herausforderung/.test(text)) meld(name + ": Niveau-Legende fehlt");
      if (!/(Einzelarbeit|Partnerarbeit|Gruppe zu viert)/.test(text)) meld(name + ": Sozialform fehlt");
      if (/Tipp 2/.test(text)) meld(name + ": Tipp 2 darf nicht auf dem Schülerblatt stehen");
    } else {
      if (!/Hilfekarten/.test(text) || (text.match(/Tipp 2/g) || []).length < 3) meld(name + ": Hilfekarten mit Tipp 2 fehlen");
      if (!/Erwartungshorizont/.test(text)) meld(name + ": Erwartungshorizont fehlt");
    }
    // Schrift: serifenlos eingebettet
    if (art === "arbeitsblatt") {
      const schr = execFileSync("pdffonts", [pdf]).toString();
      if (/Times|Serif|Comic/i.test(schr.replace(/Sans/gi, ""))) meld(name + ": Schrift nicht serifenlos: " + schr.split("\n").slice(2).join("; "));
    }
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
/* ------------------------------------------------------------------ Kartenset, Elternabend, Seiten */
const seitenZahl = (pdf) => Number((execFileSync("pdfinfo", [pdf]).toString().match(/Pages:\s+(\d+)/) || [])[1]);
const pdfText = (pdf) => execFileSync("pdftotext", ["-layout", pdf, "-"]).toString();
/** Alle dekodierbaren QR-Codes eines PDFs (ganze Seite, linke und rechte Hälfte). */
function qrCodes(pdf, name) {
  execFileSync("pdftoppm", ["-r", "300", "-png", pdf, path.join(tmp, name)]);
  const gefunden = [];
  for (const f of fs.readdirSync(tmp).filter((x) => x.startsWith(name + "-"))) {
    const png = PNG.sync.read(fs.readFileSync(path.join(tmp, f)));
    const b = png.width, hh = png.height, rgba = new Uint8ClampedArray(png.data);
    for (const [x0, w] of [[0, b], [0, Math.floor(b / 2)], [Math.floor(b / 2), Math.ceil(b / 2)]]) {
      const o = new Uint8ClampedArray(w * hh * 4);
      for (let y = 0; y < hh; y++) o.set(rgba.subarray((y * b + x0) * 4, (y * b + x0 + w) * 4), y * w * 4);
      const q = jsQR(o, w, hh);
      if (q && !gefunden.includes(q.data)) gefunden.push(q.data);
    }
  }
  return gefunden;
}
const linksIn = (pdf) => [...fs.readFileSync(pdf).toString("latin1").matchAll(/\/URI\s*\(([^)]+)\)/g)].map((m) => m[1]);

// Kartenset: 12 Karten, nur Nummern, keine Lösung im Text, Bilder vorhanden und ohne Metadaten-Hinweise auf KI im Dateinamen
{
  const pdf = path.join(DIR, "bildkarten-echt-oder-ki.pdf");
  const seiten = seitenZahl(pdf), text = pdfText(pdf);
  const bilder = execFileSync("pdfimages", ["-list", pdf]).toString().split("\n").slice(2).filter((z) => z.trim()).length;
  console.log(`bildkarten-echt-oder-ki: ${seiten} Seite(n), ${bilder} Bilder`);
  if (seiten !== 2) meld("Kartenset: erwartet 2 Seiten, gefunden " + seiten);
  if (bilder !== 12) meld("Kartenset: erwartet 12 Bilder im PDF, gefunden " + bilder);
  for (let i = 1; i <= 12; i++) if (!new RegExp(`(^|\\s)${i}(\\s|$)`, "m").test(text)) meld("Kartenset: Nummer " + i + " fehlt");
  if (/KI-Bild|echtes Foto|Wikimedia|Lizenz: CC|\bCC0\b|Auflösung:/.test(text)) meld("Kartenset: Lösung oder Quelle steht im Kartenset");
  const dateien = fs.readdirSync(path.join(DIR, "bildkarten")).filter((f) => /^karte-\d\d\.jpg$/.test(f));
  if (dateien.length !== 12) meld("Bildkarten: erwartet 12 Bilddateien, gefunden " + dateien.length);
  for (const f of dateien) if (fs.statSync(path.join(DIR, "bildkarten", f)).size < 20000) meld("Bildkarte zu klein: " + f);
  // Lösungsblatt zu Medien 1: alle zwölf Karten aufgelöst, sechs mal KI-Bild, Quelle je echter Karte
  const loes = pdfText(path.join(DIR, "loesung-medien-1.pdf"));
  if (!/Auflösung des Kartensets/.test(loes)) meld("Lösungsblatt Medien 1: Auflösung des Kartensets fehlt");
  const ki = (loes.match(/\bKI-Bild\b/g) || []).length, echt = (loes.match(/Foto:\s/g) || []).length, lizenz = (loes.match(/\b(CC0|Public [Dd]omain)\b/g) || []).length;
  if (ki < 6) meld("Lösungsblatt Medien 1: erwartet 6 Karten als KI-Bild gekennzeichnet, gefunden " + ki);
  if (lizenz < 6) meld("Lösungsblatt Medien 1: Lizenz fehlt bei echten Karten");
  if (echt < 6) meld("Lösungsblatt Medien 1: erwartet 6 echte Karten mit Quelle und Lizenz, gefunden " + echt);
  if (!/(Hände|Spiegelung|Schrift)/.test(loes)) meld("Lösungsblatt Medien 1: Hinweise auf typische Merkmale fehlen");
}

// Elternabend: Info-Blatt (1 Seite, Sie-Form), Leitfaden (höchstens 2 Seiten), QR-Codes dekodierbar und verlinkt
for (const [name, seitenMax, soll] of [
  ["elternabend-infoblatt", 1, [`${BASIS}/schule-eltern?weg=schule`, `${BASIS}/eltern-zuhause?weg=schule`]],
  ["elternabend-leitfaden", 2, [`${BASIS}/elternabend?weg=schule`, `${BASIS}/schule-eltern?weg=schule`]],
]) {
  const pdf = path.join(DIR, name + ".pdf"), text = pdfText(pdf), seiten = seitenZahl(pdf);
  console.log(`${name}: ${seiten} Seite(n), ${text.split(/\s+/).filter(Boolean).length} Wörter`);
  if (seiten > seitenMax) meld(`${name}: mehr als ${seitenMax} Seite(n)`);
  if (!/Stand 22\.11\.2026/.test(text) || !/Lizenz: noch festzulegen/.test(text)) meld(name + ": Kopfzeile fehlt");
  if (/[–—]/.test(text)) meld(name + ": Gedankenstrich");
  if (!/Ihr Kind|Ihre Klasse|Sie /.test(text)) meld(name + ": Sie-Form nicht erkennbar");
  if (/\b(Du|Dein|Deine)\b/.test(text)) meld(name + ": Du-Form im Elternteil");
  if (!/[Kk]ein Rechtsrat/.test(text)) meld(name + ": Hinweis kein Rechtsrat fehlt");
  const gefunden = qrCodes(pdf, name), links = linksIn(pdf);
  for (const u of soll) {
    if (!gefunden.includes(u)) meld(`${name}: QR-Code für ${u} nicht dekodierbar (gefunden: ${JSON.stringify(gefunden)})`);
    if (!links.includes(u)) meld(`${name}: Link ${u} fehlt als Verknüpfung`);
  }
  const schr = execFileSync("pdffonts", [pdf]).toString();
  if (/Times|Serif|Comic/i.test(schr.replace(/Sans/gi, ""))) meld(name + ": Schrift nicht serifenlos");
}

// Seiten: Downloads zeigen auf vorhandene Dateien, Operatoren-Tabelle gilt für alle Einheiten
for (const id of [...EINHEITEN.filter((e) => e.id.startsWith("medien")).map((e) => e.id), "elternabend"]) {
  const s = INHALT.seiten[id];
  if (!s) { meld("Seite fehlt: " + id); continue; }
  for (const d of s.downloads || []) if (!fs.existsSync(path.join(DIR, "..", d.href.replace(/^\/static\//, "")))) meld(`${id}: Download ${d.href} fehlt`);
  if (JSON.stringify(s).match(/[–—]/)) meld(id + ": Gedankenstrich in den Seitendaten");
}
console.log("Seitendaten und Downloads geprüft");

fs.rmSync(tmp, { recursive: true, force: true });
console.log(fehler ? `${fehler} Fehler` : "alles in Ordnung");
process.exit(fehler ? 1 : 0);
