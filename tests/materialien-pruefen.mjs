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
    if (art === "arbeitsblatt" && (seiten < 3 || seiten > 4)) meld(name + ": erwartet 3 bis 4 Seiten, gefunden " + seiten);
    if (art === "loesung" && seiten > 3) meld(name + ": mehr als drei Seiten");
    if (art === "loesung" && !/Nur für Lehrkräfte, nicht an Schüler weitergeben/.test(text)) meld(name + ": Hinweis Nur für Lehrkräfte im Kopf fehlt");
    if (!/Stand 22\.11\.2026/.test(text)) meld(name + ": Kopfzeile fehlt");
    if (!/Mehr dazu im KI-Labor|im KI-Labor/.test(text)) meld(name + ": Kasten Mehr dazu fehlt");
    if (/[–—]/.test(text)) meld(name + ": Gedankenstrich");
    if (!/abgerufen am 22\.11\.2026/.test(text) || !/Zuordnung kann je Bundesland und Fach leicht abweichen/.test(text)) meld(name + ": Quellenhinweis zu den Operatoren fehlt");
    // Operatoren: jede Aufgabe beginnt mit einem fetten Operator samt Bereich (siehe Seitendaten), die Legende nennt alle verwendeten
    const opTab = OPERATOREN;
    const genutzt = [...new Set([...text.matchAll(/\b(Nenne|Beschreibe|Erkläre|Ordne zu|Vergleiche|Begründe|Beurteile|Überprüfe|Entwickle|nenne|beschreibe|erkläre|ordne zu|vergleiche|begründe|beurteile|überprüfe|entwickle) \((I{1,3})\)/g)].map((m) => m[1][0].toUpperCase() + m[1].slice(1) + "|" + m[2]))];
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
      // Zeitangabe nennt Einzel- (20 Minuten) und Doppelstunde (30)
      if (!/Zeit:\s+\d+ Minuten \(Doppelstunde: 30\)\. Quiz und Nachdenken: Hausaufgabe/.test(text.replace(/\s+/g, " "))) meld(name + ": Zeitangabe zu Einzel- und Doppelstunde fehlt");
      // Schreibzeilen: je Aufgabe vier (die Linien sind Vektorgrafik, darum über die HTML-Quelle geprüft)
      const html = fs.readFileSync(path.join(DIR, name + ".html"), "utf8");
      const aufgaben = html.split('<div class="aufgabe">').slice(1, 4);
      aufgaben.forEach((a, i) => { const n = (a.split('<div class="aufgabe">')[0].match(/class="zeile"/g) || []).length; if (n !== 4) meld(`${name}: Aufgabe ${i + 1} hat ${n} Schreibzeilen, erwartet 4`); });
      if (!/font-size: 13pt/.test(html)) meld(name + ": Schrift nicht 13 pt");
      // Adressen brechen nie mitten im Wort: jedes Stück der Adresse steht in einem Nowrap-Span
      if (/(?:daniel|ki|medien|schule|labor)-[ \t]*\n[ \t]*(?:alisch|stunde|labor|lehrkraefte)|stunde-[ \t]*\n[ \t]*\d/.test(text)) meld(name + ": Adresse bricht mitten im Wort");
    } else {
      const flach = text.replace(/\s+/g, " ");
      if (!/Einzelstunde: Zeitplan \(45 Minuten\)/.test(flach) || !/Doppelstunde: Zeitplan \(90 Minuten\)/.test(flach)) meld(name + ": beide Zeitpläne fehlen");
      const plan45 = flach.split("Einzelstunde: Zeitplan (45 Minuten)")[1].split("Doppelstunde: Zeitplan")[0];
      if (/Quiz/.test(plan45.split("In der Stunde laufen")[0].replace(/Quiz und schriftliches/g, "")) || !/Hausaufgabe/.test(plan45)) meld(name + ": Einzelstunde widerspricht sich (Quiz im Plan oder keine Hausaufgabe)");
      // Reflexion: jede Frage mit Erwartungshorizont
      const sd = INHALT.seiten[id], rf = sd.abschnitte.find((a) => a.h.startsWith("Reflexion"));
      if (!/Fragen für die Reflexion mit Erwartungshorizont/.test(flach)) meld(name + ": Reflexion ohne Erwartungshorizont");
      rf.muster.forEach((m, i) => { const t = m[0].replace(/\s+/g, " ").slice(0, 28); if (!flach.includes(t)) meld(`${name}: Musterantwort ${i + 1} fehlt (${t})`); });
      // Quiz: Satzende zwischen Antwort und Erklärung
      sd.quiz.forEach((q, i) => { const o = q.optionen[q.richtig].trim(); const z = (/[.!?]$/.test(o) ? o : o + ".") + " " + q.erklaerung; if (!flach.includes(z.slice(0, 70))) meld(`${name}: Quiz-Lösung ${i + 1} ohne Satzende zwischen Antwort und Erklärung`); });
      if (!/Hilfekarten zum Ausschneiden/.test(text) || (text.match(/Tipp 2/g) || []).length < 3) meld(name + ": Hilfekarten zum Ausschneiden mit Tipp 2 fehlen");
      if (!/Lehrplanbezug/.test(text) || !/Kompetenzbereiche/.test(flach)) meld(name + ": Lehrplanbezug fehlt");
      const phasen = sd.abschnitte.find((a) => a.h === "Einzelstunde oder Doppelstunde");
      if (!phasen) meld(id + ": Seitenabschnitt Einzelstunde oder Doppelstunde fehlt");
      else {
        if (phasen.doppel.reduce((n, d) => n + d.min, 0) !== 90) meld(id + ": Doppelstunde ergibt nicht 90 Minuten");
        for (const d of phasen.doppel) if (!flach.includes(d.phase.split(" ")[0]) || !flach.includes(d.min + " Min")) meld(`${name}: Phase "${d.phase}" (${d.min} Min) der Doppelstunde fehlt`);
        const sum = phasen.tabelle.zeilen.find((z) => z[0] === "Summe");
        if (!sum || sum[1] !== "45 Minuten" || sum[2] !== "90 Minuten") meld(id + ": Tabelle Einzel-/Doppelstunde ohne Summe 45/90");
      }
      if (!sd.abschnitte.some((a) => a.h === "Lehrplanbezug")) meld(id + ": Abschnitt Lehrplanbezug fehlt auf der Seite");
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
/* ------------------------------------------------------------------ Quiz-Qualität (30 Fragen der Schul-Einheiten) */
{
  const alle = EINHEITEN.flatMap((e) => (INHALT.seiten[e.id].quiz || []).map((q, i) => ({ id: e.id, i, q })));
  const pos = [0, 0, 0, 0]; let laengste = 0;
  for (const { id, i, q } of alle) {
    const l = q.optionen.map((o) => o.length), max = Math.max(...l), min = Math.min(...l);
    pos[q.richtig]++;
    if (l[q.richtig] === max) laengste++;
    if (q.optionen.length !== 4) meld(`${id} Frage ${i + 1}: nicht vier Antworten`);
    if (min < 0.55 * max) meld(`${id} Frage ${i + 1}: Antwortlängen zu unterschiedlich (${min} gegen ${max} Zeichen)`);
    if (!/[.!?]$/.test(q.erklaerung)) meld(`${id} Frage ${i + 1}: Erklärung ohne Satzzeichen am Ende`);
    if (!INHALT.seiten[id].abschnitte.some((a) => a.h === q.abschnitt)) meld(`${id} Frage ${i + 1}: abschnitt "${q.abschnitt}" gibt es auf der Seite nicht`);
    if (/im Beispiel|im Bild oben|wie oben|im Text/.test(q.frage)) meld(`${id} Frage ${i + 1}: verweist auf Beispiel oder Text`);
  }
  console.log(`Quiz: ${alle.length} Fragen, richtige Antwort am längsten in ${laengste}, Position A bis D: ${pos.join("/")}`);
  if (alle.length !== 30) meld("Quiz: erwartet 30 Fragen, gefunden " + alle.length);
  if (laengste > 10) meld(`Quiz: richtige Antwort ist in ${laengste} von ${alle.length} Fragen die längste (höchstens 10)`);
  if (pos.some((n) => n < 5 || n > 10)) meld("Quiz: Positionen der richtigen Antwort ungleich verteilt: " + pos.join("/"));
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

// Kartenset für Eltern: 4 Seiten (Regeln, Karten 1 bis 6, Karten 7 bis 12, Auflösung), Sie-Form, QR zu echt-oder-ki, Auflösung mit zwölf Einträgen
{
  const name = "kartenset-eltern", pdf = path.join(DIR, name + ".pdf"), text = pdfText(pdf), flach = text.replace(/\s+/g, " ");
  const seiten = seitenZahl(pdf), url = `${BASIS}/echt-oder-ki?weg=eltern`;
  const bilder = execFileSync("pdfimages", ["-list", pdf]).toString().split("\n").slice(2).filter((z) => z.trim()).length;
  console.log(`${name}: ${seiten} Seite(n), ${bilder} Bilder`);
  if (seiten !== 4) meld(name + ": erwartet 4 Seiten, gefunden " + seiten);
  if (bilder !== 12) meld(name + ": erwartet 12 Bilder, gefunden " + bilder);
  if (!/KI-Labor, Stand 22\.11\.2026/.test(text)) meld(name + ": Kopfzeile fehlt");
  if (/Lizenz(vermerk)?:/.test(text.split("Auflösung für Eltern")[0])) meld(name + ": Lizenzvermerk im Kopf");
  if (/[–—]/.test(text)) meld(name + ": Gedankenstrich");
  if (/je Gruppe|Lehrkraft|Lehrkräfte|Klasse/.test(text)) meld(name + ": Bezug zu Gruppe, Klasse oder Lehrkraft");
  if (/\b(Du|Dein|Deine)\b/.test(text)) meld(name + ": Du-Form im Elternteil");
  for (const t of ["Spielregeln für zwei", "Woran hast du es gesehen", "Punkteblatt", "Karten 1 bis 6", "Karten 7 bis 12", "Auflösung für Eltern"]) if (!flach.includes(t)) meld(`${name}: "${t}" fehlt`);
  const aufl = flach.split("Auflösung für Eltern")[1] || "";
  const ki = (aufl.match(/\bKI-Bild\b(?=[^.]*\.)/g) || []).length, echt = (aufl.match(/Foto: [^.]+, (CC0|Public Domain), Wikimedia Commons/g) || []).length;
  if (!(aufl.match(/\b\d{1,2} (Echt|KI-Bild) /g) || []).length || (aufl.match(/ (Echt|KI-Bild) [A-ZÄÖÜ]/g) || []).length !== 12) meld(name + ": Auflösung braucht zwölf Einträge, gefunden " + (aufl.match(/ (Echt|KI-Bild) [A-ZÄÖÜ]/g) || []).length);
  if ((aufl.match(/ KI-Bild [A-ZÄÖÜ]/g) || []).length !== 6 || (aufl.match(/ Echt [A-ZÄÖÜ]/g) || []).length !== 6) meld(name + ": Auflösung braucht sechs KI-Bilder und sechs echte Fotos");
  if (echt !== 6) meld(`${name}: erwartet sechs echte Fotos mit Quelle und Lizenz, gefunden ${echt} (KI ${ki})`);
  const gefunden = qrCodes(pdf, name);
  if (!gefunden.includes(url)) meld(`${name}: QR-Code für ${url} nicht dekodierbar (gefunden: ${JSON.stringify(gefunden)})`);
  if (!linksIn(pdf).includes(url)) meld(`${name}: Link ${url} fehlt als Verknüpfung`);
}
// Entscheidungshilfe Betrieb: eine Seite, sechs Fragen aus der Seite betrieb-entscheidung, QR dekodierbar
{
  const name = "entscheidungshilfe-betrieb", pdf = path.join(DIR, name + ".pdf"), text = pdfText(pdf), flach = text.replace(/\s+/g, " ");
  const seiten = seitenZahl(pdf), url = `${BASIS}/betrieb-entscheidung?weg=beruf`;
  console.log(`${name}: ${seiten} Seite(n)`);
  if (seiten !== 1) meld(name + ": erwartet genau 1 Seite, gefunden " + seiten);
  if (!/KI-Labor, Stand 22\.11\.2026/.test(text)) meld(name + ": Kopfzeile fehlt");
  if (/[–—]/.test(text)) meld(name + ": Gedankenstrich");
  const punkte = INHALT.seiten["betrieb-entscheidung"].checkliste.punkte;
  if (punkte.length !== 6) meld(name + ": Seite hat nicht sechs Fragen");
  punkte.forEach((p, i) => { if (!flach.includes(p.frage.slice(0, 30))) meld(`${name}: Frage ${i + 1} fehlt`); if (!flach.includes(p.hilfe.slice(0, 30))) meld(`${name}: Hilfe ${i + 1} fehlt`); });
  const html = fs.readFileSync(path.join(DIR, name + ".html"), "utf8");
  if ((html.match(/<span class="box"><\/span>/g) || []).length !== 6) meld(name + ": erwartet sechs Kästchen");
  if (!/Notizen/.test(text)) meld(name + ": Platz für Notizen fehlt");
  const gefunden = qrCodes(pdf, name);
  if (!gefunden.includes(url)) meld(`${name}: QR-Code für ${url} nicht dekodierbar (gefunden: ${JSON.stringify(gefunden)})`);
  if (!linksIn(pdf).includes(url)) meld(`${name}: Link ${url} fehlt als Verknüpfung`);
}

// Elternabend: Info-Blatt (1 Seite, Sie-Form), Leitfaden (1 Seite), QR-Codes dekodierbar und verlinkt
for (const [name, seitenMax, soll] of [
  ["elternabend-infoblatt", 1, [`${BASIS}/schule-eltern?weg=schule`, `${BASIS}/eltern-zuhause?weg=schule`]],
  ["elternabend-leitfaden", 1, [`${BASIS}/elternabend?weg=schule`, `${BASIS}/schule-eltern?weg=schule`]],
]) {
  const pdf = path.join(DIR, name + ".pdf"), text = pdfText(pdf), seiten = seitenZahl(pdf);
  console.log(`${name}: ${seiten} Seite(n), ${text.split(/\s+/).filter(Boolean).length} Wörter`);
  if (seiten > seitenMax) meld(`${name}: mehr als ${seitenMax} Seite(n)`);
  if (!/Stand 22\.11\.2026/.test(text)) meld(name + ": Kopfzeile fehlt");
  if (/[–—]/.test(text)) meld(name + ": Gedankenstrich");
  if (!/Ihr Kind|Ihre Klasse|Sie /.test(text)) meld(name + ": Sie-Form nicht erkennbar");
  if (name === "elternabend-infoblatt") {
    if (!/Rückfragen an die Schule/.test(text)) meld(name + ": Kontaktzeile fehlt");
    if (/@|\b\d{3,}[ -]?\d{3,}\b/.test(text.replace(/116 111/g, ""))) meld(name + ": echte E-Mail oder Telefonnummer im Infoblatt");
    if (seiten !== 1) meld(name + ": erwartet genau 1 Seite");
  }
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
// Download-Karten: Seitenzahl in der Beschriftung muss zum PDF passen
for (const id of Object.keys(INHALT.seiten)) {
  for (const d of INHALT.seiten[id].downloads || []) {
    const m = String(d.sub || "").match(/(\d+) Seiten?\b/);
    if (!m || !/\.pdf$/.test(d.href)) continue;
    const n = seitenZahl(path.join(DIR, "..", d.href.replace(/^\/static\//, "")));
    if (Number(m[1]) !== n) meld(`${id}: Download "${d.text}" nennt ${m[1]} Seite(n), das PDF hat ${n}`);
  }
}
// Texte auf den Seiten dürfen nicht mehr von einem Blatt sprechen
for (const id of ["schule-lehrkraefte", ...EINHEITEN.map((e) => e.id)]) {
  if (/auf ein Blatt|Eine DIN-A4-Seite/.test(JSON.stringify(INHALT.seiten[id]))) meld(id + ": Text spricht von einem Blatt, die Arbeitsblätter haben drei Seiten");
}
// Handreichung: Medien-Einheiten mit Links, Lehrplanbezug, Kamera sperren; Anrede Sie
{
  const hr = INHALT.seiten["schule-lehrkraefte"], text = JSON.stringify(hr);
  const medien = hr.abschnitte.find((a) => a.h === "Die sieben Medien-Einheiten");
  if (!medien) meld("Handreichung: Abschnitt Die sieben Medien-Einheiten fehlt");
  else for (let i = 1; i <= 7; i++) if (!medien.tabelle.zeilen.some((z) => z[0].includes(`{{medien-stunde-${i}|`))) meld(`Handreichung: Medien ${i} fehlt in der Übersicht`);
  if (!hr.abschnitte.some((a) => /^Kamera und Mikrofon am Schulgerät sperren/.test(a.h))) meld("Handreichung: Abschnitt zum Sperren der Kamera fehlt");
  if (!hr.abschnitte.some((a) => /^Lehrplanbezug/.test(a.h))) meld("Handreichung: Abschnitt Lehrplanbezug fehlt");
  const lp = hr.abschnitte.find((a) => /^Lehrplanbezug/.test(a.h));
  if (lp && lp.tabelle.zeilen.length !== 10) meld("Handreichung: Lehrplantabelle braucht zehn Einheiten");
  if (/\b(deinem Land|Du kannst eine|So gehst du|So passt du|kürzt du|erweiterst du|für dich behalten)\b/.test(text.replace(/Heute kannst du/g, ""))) meld("Handreichung: Du-Anrede an Lehrkräfte");
}
for (const id of ["schule-schulleitung", "elternabend"]) {
  const s = INHALT.seiten[id], text = JSON.stringify(s).replace(/Woran würdest du[^"]*|Was hast du selbst[^"]*|Wo hast du zuletzt[^"]*/g, "");
  if (/\b(du|dich|dein|deine|deinen|deinem|deiner|dir)\b/.test(text)) meld(id + ": Du-Anrede auf einer Sie-Seite");
}
{
  const sl = INHALT.seiten["schule-schulleitung"], b = sl.abschnitte.find((a) => a.h === "Betrieb und Verträge");
  if (!b) meld("Schulleitung: Abschnitt Betrieb und Verträge fehlt");
  else {
    const z = JSON.stringify(b);
    if (!/Kostenlos, ohne Vertrag, ohne Zusage zur Verfügbarkeit/.test(z)) meld("Schulleitung: Kostenaussage fehlt");
    if (!/Auf Anfrage beim Betreiber/.test(z)) meld("Schulleitung: Auf Anfrage fehlt");
    if (/laut Planung|vorgesehen/.test(z)) meld("Schulleitung: Planungsformulierung im Abschnitt Betrieb");
  }
  if (JSON.stringify(sl).includes("laut Planung")) meld("Schulleitung: noch \"laut Planung\" auf der Seite");
}
// Medien 3: Deepfake-Dilemma in Aufgabe 3, Quiz mit Deepfake-Frage, Aufgaben bleiben drei
{
  const m3 = INHALT.seiten["medien-stunde-3"], auf = m3.abschnitte.find((a) => a.h.startsWith("Arbeitsblatt")).liste;
  if (auf.filter((a) => /^\*\*Aufgabe/.test(a)).length !== 3) meld("Medien 3: erwartet drei Aufgaben");
  if (!/KI-Stimme|Deepfake/.test(auf.join(" "))) meld("Medien 3: keine Aufgabe zu KI-erzeugten Medien");
  if (m3.quiz.length !== 3 || !m3.quiz.some((q) => /Deepfake/.test(q.optionen.concat(q.erklaerung).join(" ")))) meld("Medien 3: Quiz braucht drei Fragen, eine zu Deepfakes");
  if (/\*\*Begründe\*\* \(III\) deine Wahl/.test(auf.join(" "))) meld("Medien 3: Beurteile und Begründe doppelt in Aufgabe 3");
}
// Videos: Medien 1 bis 6 haben das Erklärvideo auf der Einheit, Videodateien liegen vor
for (let i = 1; i <= 6; i++) {
  const s = INHALT.seiten["medien-stunde-" + i];
  if (!s.videos || s.videos.length !== 1) meld(`Medien ${i}: Erklärvideo nicht eingebettet`);
  else if (!fs.existsSync(path.join(DIR, "..", "videos", s.videos[0] + ".mp4"))) meld(`Medien ${i}: Videodatei ${s.videos[0]}.mp4 fehlt`);
}
console.log("Seitendaten und Downloads geprüft");

fs.rmSync(tmp, { recursive: true, force: true });
console.log(fehler ? `${fehler} Fehler` : "alles in Ordnung");
process.exit(fehler ? 1 : 0);
