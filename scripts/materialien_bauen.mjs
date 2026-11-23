// Baut die Unterrichtsmaterialien zu den drei Schulstunden (Plan: docs/materialien-plan.md):
//   app/static/materialien/arbeitsblatt-stunde-N.html und .pdf   (Schueler, zwei bis vier Seiten DIN A4)
//   app/static/materialien/loesung-stunde-N.html und .pdf        (Lehrkraft: Zeitplan, Loesungen, Differenzierung)
// Dazu die sieben Medien-Einheiten (Seiten medien-stunde-1 bis -7, Dateien arbeitsblatt-medien-N und loesung-medien-N),
// das Kartenset zu Medien 1 (bildkarten-echt-oder-ki.pdf, Bilder in materialien/bildkarten/) und das Paket Elternabend
// (elternabend-infoblatt.pdf, elternabend-leitfaden.pdf, aus der Seite "elternabend").
// Alle Texte kommen aus den Seitendaten (app/static/content-schule.js und content-schule-medien.js), nichts ist hier erfunden.
// Der QR-Code wird lokal erzeugt (npm "qrcode-generator", Entwicklungsabhaengigkeit in tests/package.json), als Inline-SVG.
// PDF: Playwright (tests/node_modules/playwright-core), Chrome wie in tests/browser.mjs.
// Aufruf:  node scripts/materialien_bauen.mjs [--ohne-pdf]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { INHALT, klar, STATIC, WURZEL } from "./inhalt.mjs";

const require = createRequire(path.join(WURZEL, "tests", "package.json"));
const qrcode = require("qrcode-generator");
const { chromium } = require("playwright-core");

const AUS = path.join(STATIC, "materialien");
const STAND = "22.11.2026";
const BASIS = "https://ki-labor.daniel-alisch.site";
const KOPF = "KI-Labor, ki-labor.daniel-alisch.site, Stand " + STAND;
const ohnePdf = process.argv.includes("--ohne-pdf");

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** Text mit **fett** und `code` aus den Seitendaten als HTML. */
const md = (t) => esc(klar(t).replace(/–|—/g, ", "));
const mdFett = (t) => esc(String(t)).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>")
  .replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, k, a) => a || (INHALT.glossar[k] ? INHALT.glossar[k][0] : k))
  .replace(/\{\{([a-z0-9-]+)(?:\?[a-z0-9_=&amp;-]+)?\|([^}]+)\}\}/g, "$2");

/* ------------------------------------------------------------------ Daten aus den Seiten */
function abschnitt(seite, anfang) {
  const a = (INHALT.seiten[seite].abschnitte || []).find((x) => x.h.startsWith(anfang));
  if (!a) throw new Error(`${seite}: Abschnitt "${anfang}" fehlt`);
  return a;
}
/** "**Aufgabe 1, Punkte-Labor:** Text" -> { titel: "Aufgabe 1, Punkte-Labor", text: "Text" } */
function teile(eintrag) {
  const m = String(eintrag).match(/^\*\*([^*]+?):?\*\*\s*(.*)$/s);
  return m ? { titel: m[1].replace(/:$/, ""), text: m[2] } : { titel: "", text: String(eintrag) };
}
const LAENGE = { "schule-stunde-1": 3, "schule-stunde-2": 3, "schule-stunde-3": 3 };
for (let i = 1; i <= 7; i++) LAENGE["medien-stunde-" + i] = 3;
// Minuten je Aufgabe: stehen in "kurz" der Erarbeitung ("Punkte-Labor (12 Minuten) und Prompt-Werkstatt (8 Minuten)"); hier nur zugeordnet und gegengeprueft.
const ZEITEN = {
  "schule-stunde-1": { zuordnung: [[0, 1], [2]], minuten: [12, 8], pruefen: ["12 Minuten", "8 Minuten"] },
  "schule-stunde-2": { zuordnung: [[0], [1, 2]], minuten: [8, 12], pruefen: ["8 Minuten", "12 Minuten"] },
  "schule-stunde-3": { zuordnung: [[0], [1], [2]], minuten: [8, 6, 6], pruefen: ["8 Minuten", "6 Minuten", "6 Minuten"] },
};
for (let i = 1; i <= 7; i++) {
  const m = i === 1 ? [7, 7, 6] : [6, 8, 6];
  ZEITEN["medien-stunde-" + i] = { zuordnung: [[0], [1], [2]], minuten: m, pruefen: m.map((x) => x + " Minuten") };
}
const THEMA = { 1: "Was ist KI?", 2: "Wie lernt ein Computer?", 3: "Echt oder erfunden?" };
const MEDIEN = { 1: "Echt oder KI?", 2: "Quellen prüfen", 3: "Fake News und Deepfakes", 4: "KI und Hausaufgaben", 5: "Datenschutz im Alltag", 6: "Gute Fragen stellen", 7: "KI in deinem Alltag" };
const QUELLENFUSS = "Operatoren und Bereiche nach: Bildungsserver Rheinland-Pfalz (bildung.rlp.de, Informatik, 2013), IQB Abituraufgabenpools (iqb.hu-berlin.de, 2026), Bildungsplan Baden-Württemberg 2016 (lehrerfortbildung-bw.de), Hessisches Kultusministerium (kultus.hessen.de, 2026), abgerufen am 22.11.2026. Die Zuordnung kann je Bundesland und Fach leicht abweichen.";
const NIVEAU = { Basis: 1, Standard: 2, Herausforderung: 3 };

/** Operatoren-Tabelle aus der Handreichung (eine Quelle fuer Seite, Arbeitsblatt und Loesungsblatt): kleingeschriebener Operator -> { name, text, bereich }. */
const OPERATOREN = (() => {
  const t = abschnitt("schule-lehrkraefte", "Operatoren in den Aufgaben").tabelle;
  const o = {};
  for (const [name, text, bereich] of t.zeilen) o[name.toLowerCase()] = { name, text, bereich };
  return o;
})();
/** Aufgabentext muss mit "**Operator** (Bereich)" beginnen; liefert alle im Text genutzten Operatoren in Reihenfolge, prueft das Kuerzel gegen die Tabelle. */
function operatorenIn(titel, text) {
  if (!/^\*\*[A-ZÄÖÜ][a-zäöüß]+(?: zu)?\*\* \((I{1,3})\)/.test(text)) throw new Error(`${titel}: Aufgabe beginnt nicht mit einem Operator samt Bereich`);
  const gefunden = [];
  for (const m of text.matchAll(/\*\*([A-Za-zÄÖÜäöüß]+(?: zu)?)\*\* \((I{1,3})\)/g)) {
    const op = OPERATOREN[m[1].toLowerCase()];
    if (!op) throw new Error(`${titel}: Operator "${m[1]}" steht nicht in der Tabelle der Handreichung`);
    if (op.bereich !== m[2]) throw new Error(`${titel}: ${m[1]} trägt (${m[2]}), die Tabelle sagt ${op.bereich}`);
    if (!gefunden.includes(op.name)) gefunden.push(op.name);
  }
  return gefunden;
}
const kasten = (n) => `<svg class="niv" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 3" width="9mm" height="2.6mm" aria-hidden="true">${[0, 1, 2].map((i) => `<rect x="${i * 4 + 0.15}" y="0.15" width="2.7" height="2.7" fill="${i < n ? "#000" : "#fff"}" stroke="#000" stroke-width="0.3"/>`).join("")}</svg>`;

/** Die 90-Minuten-Phasen einer Einheit, gelesen aus dem Seitenabschnitt "Einzelstunde oder Doppelstunde" (Summe muss 90 sein). */
function doppelPhasen(id) {
  const d = abschnitt(id, "Einzelstunde oder Doppelstunde").doppel;
  if (!Array.isArray(d) || d.length < 5 || d.some((x) => !x.phase || !x.min || !x.was)) throw new Error(`${id}: Doppelstunde ohne Phasendaten`);
  if (d.reduce((n, x) => n + x.min, 0) !== 90) throw new Error(`${id}: Doppelstunde ergibt nicht 90 Minuten`);
  return d;
}

/** n = 1 bis 3 (KI-Stunden) oder "medien-1" bis "medien-7" (Medien-Einheiten). */
function stunde(n) {
  const medien = typeof n === "string";
  const nr = medien ? Number(n.split("-")[1]) : n;
  const id = medien ? "medien-stunde-" + nr : "schule-stunde-" + n, s = INHALT.seiten[id];
  if (!s) throw new Error(id + " fehlt");
  const aufg = abschnitt(id, "Arbeitsblatt").liste.map(teile);
  const zusatz = aufg.filter((a) => /^Zusatz/.test(a.titel)), aufgaben = aufg.filter((a) => /^Aufgabe/.test(a.titel));
  if (aufgaben.length !== LAENGE[id] || zusatz.length !== 1) throw new Error(id + ": unerwartete Aufgabenliste");
  const erar = abschnitt(id, "Erarbeitung");
  const z = ZEITEN[id];
  z.pruefen.forEach((t) => { if (!erar.kurz.includes(t)) throw new Error(`${id}: Zeitangabe "${t}" steht nicht in der Erarbeitung`); });
  const zeitplan = abschnitt(id, "Der Zeitplan").visual.punkte;
  const phasen = ["Einstieg", "Erarbeitung", "Sicherung", "Reflexion"].map((p, i) => ({
    phase: p, zeit: zeitplan[i].t, was: abschnitt(id, p).kurz,
  }));
  if (!zeitplan.every((p, i) => p.text === phasen[i].phase)) throw new Error(id + ": Zeitplan passt nicht zu den Phasen");
  const sich = abschnitt(id, "Sicherung");
  const sv = sich.visual;
  const tafel = (sv.knoten || sv.schritte || []).map((k) => k.text);
  const vorb = abschnitt(id, "Der Zeitplan");
  // Sozialform und Niveau stehen im Titel der Aufgabe: "Aufgabe 1, Punkte-Labor (Gruppe zu viert, Basis)"
  for (const a of aufg) {
    const m = a.titel.match(/^(?:Aufgabe (\d+), (.+?)|Zusatz für Schnelle) \((.+), (Basis|Standard|Herausforderung)\)$/);
    if (!m) throw new Error(`${id}: Titel "${a.titel}" ohne Sozialform und Niveau`);
    Object.assign(a, { nr: m[1], ort: m[2], sozial: m[3], niveau: m[4], ops: operatorenIn(`${id} ${a.titel}`, a.text) });
  }
  const hilfen = {};
  for (const h of abschnitt(id, "Gestufte Hilfen").liste.map(teile)) {
    const m = h.titel.match(/^Tipp ([12]) zu Aufgabe (\d)$/);
    if (!m) throw new Error(`${id}: Hilfe "${h.titel}" nicht lesbar`);
    (hilfen[m[2]] = hilfen[m[2]] || {})[m[1]] = h.text;
  }
  for (const a of aufgaben) if (!hilfen[a.nr] || !hilfen[a.nr][1] || !hilfen[a.nr][2]) throw new Error(`${id}: Aufgabe ${a.nr} braucht Tipp 1 und Tipp 2`);
  const rfx = abschnitt(id, "Reflexion");
  if (!rfx.muster || rfx.muster.length !== rfx.liste.length || rfx.muster.some((m) => !Array.isArray(m) || m.length < 2 || m.length > 3)) throw new Error(`${id}: Reflexion braucht je Frage 2 bis 3 Stichpunkte als Musterantwort`);
  const bereiche = new Set(aufg.flatMap((a) => a.ops).map((o) => OPERATOREN[o.toLowerCase()].bereich));
  for (const b of ["I", "II", "III"]) if (!bereiche.has(b)) throw new Error(`${id}: kein Operator aus Bereich ${b}`);
  const genutzt = [...new Set(aufg.flatMap((a) => a.ops))].sort((a, b) => OPERATOREN[a.toLowerCase()].bereich.length - OPERATOREN[b.toLowerCase()].bereich.length);
  return {
    hilfen, genutzt, n: nr, id, medien, kenn: medien ? "Medien " + nr : "KI " + nr, datei: medien ? "medien-" + nr : "stunde-" + nr,
    titel: medien ? MEDIEN[nr] : THEMA[n], lernziele: s.lernziele, aufgaben, zusatz: zusatz[0], zeitplan, phasen, minuten: z,
    loesungen: abschnitt(id, "Lösungshinweise").liste.map(teile),
    diff: abschnitt(id, "Differenzierung").liste.map(teile),
    tafel, tafelMitte: sv.mitte || "", tafelMerke: sich.merke, tafelText: sich.p || [],
    reflexion: abschnitt(id, "Reflexion").liste,
    muster: abschnitt(id, "Reflexion").muster,
    vorbereitung: (vorb.p || []).concat(vorb.alltag ? [vorb.alltag] : []),
    merksatz: s.mitnehmen[0], quiz: s.quiz || [],
    // Doppelstunde und Lehrplanbezug stehen auf der Seite (content-schule.js, window.KLSchule): eine Quelle fuer Seite und Loesungsblatt
    doppel: doppelPhasen(id), lehrplan: abschnitt(id, "Lehrplanbezug").p,
  };
}

/* ------------------------------------------------------------------ QR-Code (lokal, Inline-SVG) */
const MODUL_MM = 0.9;   // Kantenlaenge eines Moduls im Druck; Symbol mit 37 Modulen = ca. 33 mm, ruhige Zone 4 Module
function qrSvg(url, modul = MODUL_MM) {
  const q = qrcode(0, "M");
  q.addData(url, "Byte");
  q.make();
  const n = q.getModuleCount(), ruhe = 4, gesamt = n + 2 * ruhe;
  let d = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) d += `M${x + ruhe} ${y + ruhe}h1v1h-1z`;
  const mm = (gesamt * modul).toFixed(2);
  return { n, mm: ((n) * modul).toFixed(1), svg:
    `<svg class="qr" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${gesamt} ${gesamt}" width="${mm}mm" height="${mm}mm" role="img" aria-label="QR-Code zu ${esc(url)}" shape-rendering="crispEdges"><rect width="${gesamt}" height="${gesamt}" fill="#fff"/><path d="${d}" fill="#000"/></svg>` };
}

/* ------------------------------------------------------------------ Seiten */
const CSS = `
@page { size: A4; margin: 8mm 13mm; }
* { box-sizing: border-box; }
html { font-family: Arial, Helvetica, sans-serif; color: #000; background: #fff; }
body { margin: 0; font-size: 12pt; line-height: 1.3; }
body.arbeitsblatt { font-size: 11.5pt; line-height: 1.28; }
.kopfblock { display: flex; gap: 6mm; align-items: flex-start; }
.kopfblock .links { flex: 1; }
.kopfblock .qrbox { flex: 0 0 auto; padding-top: 1mm; }
.seite { display: flex; flex-direction: column; min-height: 281mm; }
.kopf { display: flex; justify-content: space-between; font-size: 9pt; border-bottom: 0.4mm solid #000; padding-bottom: 1.5mm; }
h1 { font-size: 18pt; line-height: 1.15; margin: 2mm 0 1mm; }
h2 { font-size: 13.5pt; margin: 4mm 0 1.5mm; }
.felder { display: flex; gap: 10mm; margin: 0 0 1mm; font-size: 12pt; }
.felder span { display: block; border-bottom: 0.3mm solid #000; flex: 1; height: 6.5mm; }
.felder span.klein { flex: 0 0 52mm; }
.zeit { font-size: 11pt; border: 0.4mm solid #000; padding: 0.8mm 3mm; display: inline-block; margin: 0 0 1mm; }
.aufgabe { margin: 0 0 1.6mm; break-inside: avoid; }
.aufgabe .k { display: flex; gap: 3mm; align-items: baseline; }
.niv { vertical-align: -0.4mm; }
.meta { margin-left: auto; font-size: 10.5pt; white-space: nowrap; }
.nz { font-size: 10.5pt; }
.tipp { font-size: 10.5pt; }
table.ziele, table.legende { font-size: 10pt; margin: 0 0 2mm; break-inside: avoid; }
table.ziele td, table.ziele th { padding: 0.8mm 2mm; }
table.ziele th.b, table.ziele td.b { width: 19mm; white-space: nowrap; text-align: center; }
table.ziele th { font-size: 10pt; }
table.legende th.b, table.legende td.b { width: 16mm; text-align: center; }
table.legende td, table.legende th { padding: 0.4mm 2mm; }
.box { display: inline-block; width: 5mm; height: 5mm; border: 0.5mm solid #000; vertical-align: middle; }
.zusatz .k { display: flex; gap: 3mm; align-items: baseline; }
.quellen { font-size: 8.5pt; line-height: 1.2; display: block; margin-top: auto; padding-top: 1.5mm; }
.fuss.quellen { display: block; }
.karten { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; margin: 1mm 0 2mm; }
.karte { border: 0.4mm dashed #000; padding: 1.5mm 2.5mm; break-inside: avoid; }
.nr { flex: 0 0 9mm; height: 9mm; border: 0.5mm solid #000; border-radius: 50%; text-align: center; font-weight: bold; font-size: 13pt; line-height: 8mm; }
.aufgabe h3 { margin: 0; font-size: 12.5pt; }
.aufgabe .zt { font-weight: normal; font-size: 10.5pt; margin-left: 2mm; }
.aufgabe p { margin: 0.5mm 0 0 12mm; }
.zusatz p { margin: 0.5mm 0 0; }
.zeile { height: 5.5mm; border-bottom: 0.25mm solid #000; margin-left: 12mm; }
.zusatz { border: 0.4mm dashed #000; padding: 1.5mm 3mm; margin: 0 0 2.4mm; break-inside: avoid; }
.verstanden { border: 0.5mm solid #000; padding: 2mm 3mm; display: flex; gap: 3mm; align-items: flex-start; margin: 0 0 2.4mm; break-inside: avoid; }
.verstanden .box { flex: 0 0 7mm; height: 7mm; border: 0.5mm solid #000; margin-top: 0.5mm; }
.mehr { margin-top: auto; border: 0.5mm solid #000; padding: 2mm 3mm; display: flex; gap: 5mm; align-items: center; break-inside: avoid; }
.mehr .paar { display: flex; gap: 5mm; align-items: center; flex: 1; }
.mehr .t { flex: 1; }
.mehr h2 { margin: 0 0 1mm; }
.mehr .adr { font-size: 13pt; font-weight: bold; display: block; margin: 1mm 0 1mm; color: #000; text-decoration: underline; }
.mehr small { font-size: 9.5pt; }
.qrbox { text-align: center; font-size: 8.5pt; line-height: 1.2; }
.qr { display: block; margin: 0 auto; }
.fuss { margin-top: 2mm; font-size: 9pt; display: flex; justify-content: space-between; border-top: 0.3mm solid #000; padding-top: 1mm; }
table { border-collapse: collapse; width: 100%; margin: 1mm 0 2mm; font-size: 10.5pt; }
h2, h3 { break-after: avoid; }
th, td { border: 0.3mm solid #000; padding: 1.2mm 2mm; text-align: left; vertical-align: top; }
th { font-weight: bold; }
.loesung body, body.loesung { font-size: 11pt; line-height: 1.28; }
body.loesung table { font-size: 10.5pt; }
body.loesung ul.muster { font-size: 10.5pt; }
body.loesung h1 { font-size: 17pt; margin: 2mm 0 1.5mm; }
body.loesung h2 { font-size: 12pt; margin: 2.8mm 0 1mm; border-bottom: 0.25mm solid #000; }
body.loesung p { margin: 0 0 1.2mm; }
body.loesung ul { margin: 0 0 1.5mm; padding-left: 5mm; }
body.loesung li { margin: 0 0 1.2mm; break-inside: avoid; }
.lg { break-inside: avoid; margin: 0 0 1.6mm; }
.lg b.t { display: inline-block; }
.zwei { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
.zwei > div { border: 0.3mm solid #000; padding: 1.5mm 2.5mm; break-inside: avoid; }
.pfad { display: flex; flex-wrap: wrap; gap: 2mm; align-items: center; margin: 1mm 0; }
.pfad span { border: 0.3mm solid #000; padding: 0.8mm 2.5mm; border-radius: 2mm; }
.pfad i { font-style: normal; }
body.loesung .mehr { margin-top: 4mm; padding: 2.5mm; gap: 4mm; align-items: flex-start; }
body.loesung .mehr .adr { font-size: 10.5pt; }
body.loesung .mehr .paar { gap: 4mm; }
body.loesung .mehr .paar + .paar { border-left: 0.3mm solid #000; padding-left: 4mm; }
body.loesung .mehr h2 { border: 0; font-size: 12pt; margin: 0 0 1mm; }
@media screen { body { max-width: 210mm; margin: 0 auto; padding: 11mm 13mm; } }
`;

const CSS2 = `
body.infoblatt { font-size: 12pt; line-height: 1.35; }
body.infoblatt h1 { font-size: 18pt; margin: 3mm 0 2mm; }
body.infoblatt .ib { margin: 0 0 2.6mm; break-inside: avoid; }
body.infoblatt .ib h2 { font-size: 12.5pt; margin: 0 0 0.6mm; }
body.infoblatt .ib p { margin: 0; }
body.infoblatt .mehr { margin-top: 3mm; }
body.infoblatt .mehr .paar { align-items: center; }
body.infoblatt .mehr .paar + .paar { border-left: 0.3mm solid #000; padding-left: 4mm; }
body.infoblatt .mehr .adr { font-size: 9.5pt; }
body.infoblatt .mehr h2 { font-size: 11.5pt; margin: 0 0 1mm; }
body.infoblatt .mehr small { font-size: 9pt; }
body.kartenset .hinweis { font-size: 10pt; margin: 1mm 0 3mm; }
.bks { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm 6mm; break-after: page; }
.bks:last-of-type { break-after: auto; }
.bk { border: 0.4mm dashed #000; padding: 2mm; break-inside: avoid; position: relative; }
.bk img { display: block; width: 100%; height: auto; }
.bk .nr { position: absolute; left: 4mm; top: 4mm; width: 11mm; height: 11mm; line-height: 10mm; font-size: 16pt; background: #fff; }
body.loesung table.auf { font-size: 9.5pt; margin: 0 0 2mm; }
body.loesung table.auf td, body.loesung table.auf th { padding: 0.5mm 1.4mm; }
body.loesung table.auf td.n { width: 8mm; text-align: center; font-weight: bold; }
body.loesung table.auf td.a { width: 14mm; font-weight: bold; }
body.loesung.kompakt { font-size: 11pt; line-height: 1.17; }
body.loesung.kompakt p { margin: 0 0 0.8mm; }
body.loesung.kompakt table.auf { font-size: 9pt; }
body.loesung.kompakt table.auf td { padding: 0.2mm 1.2mm; }
body.loesung.kompakt table { margin: 0 0 1mm; }
body.loesung.kompakt td, body.loesung.kompakt th { padding-top: 0.6mm; padding-bottom: 0.6mm; }
body.loesung.kompakt h2 { margin: 1.8mm 0 0.6mm; }
body.loesung.kompakt .lg { margin: 0 0 0.6mm; }
body.loesung.kompakt li { margin: 0 0 0.6mm; }
body.loesung.kompakt ul { margin: 0 0 1mm; }
body.loesung.kompakt h1 { margin: 1mm 0 1mm; font-size: 16pt; }
body.loesung.kompakt .nurlehr { margin: 0 0 1mm; padding: 0.5mm 3mm; }
body.loesung.kompakt .zwei > div { padding: 1mm 2mm; }
body.loesung.kompakt .karten { gap: 2mm; }
body.loesung.kompakt .karte { padding: 1mm 2mm; }
body.loesung.kompakt .mehr { margin-top: 1.5mm; padding: 1mm 2.5mm; }
body.loesung.kompakt .quellen { padding-top: 0.5mm; font-size: 8pt; line-height: 1.15; }
body.loesung.kompakt .karte { padding: 0.8mm 2mm; }
body.loesung table.frage td:first-child { width: 52mm; font-weight: bold; }
/* Arbeitsblaetter duerfen mehrseitig sein: grosse Schrift, viel Schreibraum, keine Quetschung auf eine Seite */
@page ab { size: A4; margin: 12mm 16mm; }
body.arbeitsblatt { page: ab; font-size: 12.5pt; line-height: 1.36; }
body.arbeitsblatt .seite { min-height: 0; }
body.arbeitsblatt h1 { font-size: 20pt; margin: 4mm 0 2mm; }
body.arbeitsblatt h2 { font-size: 14pt; margin: 6mm 0 2mm; }
body.arbeitsblatt .aufgabe { margin: 0 0 4mm; }
body.arbeitsblatt .aufgabe h3 { font-size: 13.5pt; }
body.arbeitsblatt .aufgabe p { margin: 1.2mm 0 0 12mm; }
body.arbeitsblatt .zeile { height: 7.6mm; }
body.arbeitsblatt .zusatz { padding: 3mm 4mm; margin: 0 0 5mm; }
body.arbeitsblatt .verstanden { padding: 3mm 4mm; margin: 4mm 0 5mm; }
body.arbeitsblatt .karten { gap: 4mm; margin: 2mm 0 4mm; }
body.arbeitsblatt .karte { padding: 2.5mm 3mm; }
body.arbeitsblatt table.ziele td, body.arbeitsblatt table.ziele th { padding: 1.6mm 2.5mm; }
body.arbeitsblatt .opt { margin: 1.5mm 0 0 12mm; }
body.arbeitsblatt .opt .box { margin-right: 2mm; }
body.arbeitsblatt .mehr { margin-top: 8mm; padding: 3mm 4mm; }
/* feste Seitenumbrueche: Seite 1 Kopf und Aufgaben 1 und 2, Seite 2 Aufgabe 3 und Quiz, Seite 3 Nachdenken, Seite 4 Zusatz und Legende */
.pb { break-before: page; height: 0; }
/* Ueberschrift mit Anweisung und erster Frage zusammenhalten (kein Kopf allein am Seitenende) */
.zus { break-inside: avoid; }
.zus > h2 { margin-top: 0; }
body.arbeitsblatt .zus.start { margin-top: 6mm; }
.nurlehr { border: 0.5mm solid #000; padding: 1mm 3mm; margin: 0 0 2mm; display: inline-block; font-size: 10.5pt; }
.zeitnote { font-size: 10.5pt; margin: 0 0 2mm; }
table.plan td:first-child { width: 28mm; font-weight: bold; }
ul.muster { margin: 0.5mm 0 0 0; padding-left: 5mm; font-size: 10.5pt; }
body.loesung ul.muster li { margin: 0; }
.rf { break-inside: avoid; margin: 0 0 1.6mm; }
/* Info-Blatt: grosse Schrift, Kontaktfeld, Kaesten unten buendig */
body.infoblatt { font-size: 13pt; line-height: 1.4; }
body.infoblatt .ib { margin: 0 0 4mm; }
body.infoblatt .ib h2 { font-size: 13.5pt; margin: 0 0 1mm; }
body.infoblatt .kontakt { border: 0.5mm solid #000; padding: 3mm 4mm; margin: 2mm 0 0; break-inside: avoid; }
body.infoblatt .kontakt h2 { font-size: 13.5pt; margin: 0 0 1mm; }
body.infoblatt .kontakt .linie { border-bottom: 0.3mm solid #000; height: 9mm; margin-top: 1mm; }
body.infoblatt .mehr { margin-top: auto; align-items: stretch; padding: 3mm 4mm; }
body.infoblatt .mehr .paar { flex: 1 1 0; align-items: flex-start; gap: 4mm; }
body.infoblatt .mehr .t { flex: 1 1 0; min-width: 0; }
body.infoblatt .mehr .qrbox { flex: 0 0 auto; padding: 0; }
body.infoblatt .mehr .adr { font-size: 8.5pt; }
body.infoblatt .mehr small { display: block; font-size: 9.5pt; }

/* Kartenset fuer Eltern */
body.eltern { font-size: 11.5pt; line-height: 1.35; }
body.eltern h1 { font-size: 18pt; margin: 3mm 0 2mm; }
body.eltern h2 { font-size: 13pt; margin: 4mm 0 1.2mm; }
body.eltern .lead { margin: 0 0 2mm; }
body.eltern ol.regeln, body.eltern ul.fragen { margin: 0 0 2mm; padding-left: 6mm; }
body.eltern ol.regeln li, body.eltern ul.fragen li { margin: 0 0 1.2mm; }
body.eltern p { margin: 0 0 1.5mm; }
body.eltern table.punkte { font-size: 10pt; table-layout: fixed; }
body.eltern table.punkte th, body.eltern table.punkte td { padding: 1.2mm 0.5mm; text-align: center; height: 7mm; }
body.eltern table.punkte th:first-child { width: 17mm; text-align: left; padding-left: 1.5mm; }
body.eltern .mehr { margin-top: 3mm; }
body.eltern .pg { break-before: page; }
body.eltern .pg .bks { break-after: auto; gap: 5mm; }
body.eltern table.auf { font-size: 9.5pt; }
body.eltern table.auf td.n { width: 8mm; text-align: center; font-weight: bold; }
body.eltern table.auf td.a { width: 16mm; font-weight: bold; }
body.eltern .fuss-eltern { font-size: 9pt; margin-top: 3mm; }
/* Entscheidungshilfe Betrieb (eine Seite) */
body.entscheidung { font-size: 11.5pt; line-height: 1.3; }
body.entscheidung h1 { font-size: 17pt; margin: 3mm 0 1mm; }
body.entscheidung h2 { font-size: 12.5pt; margin: 3mm 0 1.5mm; }
body.entscheidung .lead { margin: 0 0 2mm; }
body.entscheidung .fr { display: flex; gap: 4mm; align-items: flex-start; margin: 0 0 2.4mm; break-inside: avoid; }
body.entscheidung .fr .box { flex: 0 0 6.5mm; height: 6.5mm; margin-top: 0.5mm; }
body.entscheidung .hilfe { font-size: 10.5pt; }
body.entscheidung .drei { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; }
body.entscheidung .drei div { border: 0.3mm solid #000; padding: 1.5mm 2.5mm; font-size: 10.5pt; }
body.entscheidung .notiz .zeile { height: 6.8mm; }
body.entscheidung .fuss { margin-top: auto; display: block; }
body.entscheidung .hinweis-sp { font-size: 10pt; border: 0.3mm solid #000; padding: 1.5mm 2.5mm; margin: 2mm 0 0; }
/* Vereinbarung und Infoblatt Schulleitung */
body.vereinbarung { font-size: 11pt; line-height: 1.3; }
body.vereinbarung h1 { font-size: 17pt; margin: 3mm 0 1mm; }
body.vereinbarung h2 { font-size: 12pt; margin: 3mm 0 1.2mm; }
body.vereinbarung .lead { margin: 0 0 2mm; }
body.vereinbarung .pg { break-before: page; }
body.vereinbarung table.stufe { table-layout: fixed; font-size: 10.5pt; }
body.vereinbarung table.stufe th { font-size: 10.5pt; }
body.vereinbarung .opt { display: flex; gap: 2mm; align-items: flex-start; margin: 0 0 1.3mm; }
body.vereinbarung .opt .box { flex: 0 0 4.2mm; height: 4.2mm; margin-top: 0.4mm; }
body.vereinbarung .feldz { margin: 0 0 3mm; font-size: 11pt; }
body.vereinbarung .fl { display: inline-block; border-bottom: 0.3mm solid #000; min-width: 28mm; height: 5mm; vertical-align: bottom; }
body.vereinbarung .fl.l { min-width: 55mm; }
body.vereinbarung .drei div { border: 0.3mm solid #000; padding: 1.5mm 2.5mm; }
body.vereinbarung .drei { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; margin: 0 0 2mm; }
body.vereinbarung .beispiel { border: 0.3mm dashed #000; padding: 1.5mm 2.5mm; margin: 1mm 0 2mm; }
body.vereinbarung .sign { display: flex; gap: 8mm; margin: 6mm 0 2mm; }
body.vereinbarung .sign div { flex: 1; border-top: 0.3mm solid #000; padding-top: 1mm; font-size: 9.5pt; }
body.vereinbarung .mehr { margin-top: 3mm; }
body.vereinbarung .mehr .adr { font-size: 10pt; }
body.schulleitung { font-size: 11pt; line-height: 1.32; }
body.schulleitung h1 { font-size: 17pt; margin: 3mm 0 1mm; }
body.schulleitung h2 { font-size: 12pt; margin: 3mm 0 1mm; }
body.schulleitung p { margin: 0 0 1.5mm; }
body.schulleitung ul { margin: 0 0 1.5mm; padding-left: 5mm; }
body.schulleitung li { margin: 0 0 0.8mm; }
body.schulleitung .pg { break-before: page; }
body.schulleitung .antwort { border: 0.5mm solid #000; padding: 2mm 3mm; margin: 2mm 0; }
body.schulleitung table { font-size: 10.5pt; }
body.schulleitung td:first-child { width: 48mm; font-weight: bold; }
body.schulleitung .mehr { margin-top: 3mm; }
body.schulleitung .mehr .adr { font-size: 10pt; }
`;



const seite = (titel, klasse, inhalt, kopf = KOPF) => `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<style>${CSS}${CSS2}</style>
</head>
<body class="${klasse}">
<div class="seite">
<div class="kopf"><span>${esc(kopf)}</span></div>
${inhalt}
</div>
</body>
</html>
`;

/** Adresse als HTML: Umbruch nur vor / ? und ., nie mitten in einem Wort (auch nicht am Bindestrich). */
const adresse = (url) => esc(url.replace(/^https:\/\//, "")).split(/(?=[\/?.])/).map((s) => `<span style="white-space:nowrap">${s}</span>`).join("<wbr>");
const mehrKasten = (paare) => `<div class="mehr">
${paare.map((p) => {
  const q = qrSvg(p.url);
  return `<div class="paar"><div class="qrbox">${q.svg}</div><div class="t"><h2>${esc(p.titel)}</h2><a class="adr" href="${esc(p.url)}">${adresse(p.url)}</a><small>${esc(p.hinweis)}</small></div></div>`;
}).join("\n")}
</div>`;

const legende = (st) => `<table class="legende"><thead><tr><th>Operator</th><th>Das sollst du tun</th><th class="b">Bereich</th></tr></thead><tbody>${
  st.genutzt.map((o) => { const op = OPERATOREN[o.toLowerCase()]; return `<tr><td><b>${esc(op.name)}</b></td><td>${esc(op.text)}</td><td class="b">${esc(op.bereich)}</td></tr>`; }).join("")}</tbody></table>`;
const niveauZeile = `<span class="nz">Niveau: ${kasten(1)} Basis ${kasten(2)} Standard ${kasten(3)} Herausforderung</span>`;

function arbeitsblatt(st) {
  const zeitVon = (i) => {
    const gruppe = st.minuten.zuordnung.findIndex((g) => g.includes(i));
    return gruppe >= 0 && st.minuten.zuordnung[gruppe][0] === i ? st.minuten.minuten[gruppe] : null;
  };
  const zeilen = (k) => Array.from({ length: k }, () => '<div class="zeile"></div>').join("");
  const meta = (a) => `<span class="meta">${esc(a.sozial)} ${kasten(NIVEAU[a.niveau])}</span>`;
  const auf = st.aufgaben.map((a, i) => {
    const zt = zeitVon(i) ? `<span class="zt">(ca. ${zeitVon(i)} Minuten${st.minuten.zuordnung.find((g) => g[0] === i).length > 1 ? " für die Aufgaben " + st.minuten.zuordnung.find((g) => g[0] === i).map((x) => x + 1).join(" und ") : ""})</span>` : "";
    return `${i === 2 ? '<div class="pb"></div>' : ""}<div class="aufgabe"><div class="k"><span class="nr">${a.nr}</span><h3>${esc(a.ort)}${zt}</h3>${meta(a)}</div><p>${mdFett(a.text)}</p>${zeilen(4)}</div>`;
  }).join("\n");
  const buchst = "ABCD";
  const frageQuiz = (q, i) => `<div class="aufgabe"><div class="k"><span class="nr">${i + 1}</span><h3>${esc(q.frage)}</h3></div>${q.optionen.map((o, j) => `<p class="opt"><span class="box"></span> ${buchst[j]}) ${esc(o)}</p>`).join("")}</div>`;
  const quizHtml = st.quiz.length ? `<div class="zus"><h2>Quiz: Was hast du verstanden?</h2>
<p class="nz">Kreuze je Frage die beste Antwort an. Es ist genau eine richtig.</p>
${frageQuiz(st.quiz[0], 0)}</div>
${st.quiz.slice(1).map((q, i) => frageQuiz(q, i + 1)).join("\n")}` : "";
  const frageNd = (r, i) => `<div class="aufgabe"><div class="k"><span class="nr">${st.aufgaben.length + i + 1}</span><h3>${md(r)}</h3></div>${zeilen(4)}</div>`;
  const nachdenken = `<div class="pb"></div><div class="zus"><h2>Zum Nachdenken</h2>
${frageNd(st.reflexion[0], 0)}</div>
${st.reflexion.slice(1).map((r, i) => frageNd(r, i + 1)).join("\n")}
<div class="aufgabe"><div class="k"><span class="nr">?</span><h3>Meine eigene Frage zum Thema</h3></div>${zeilen(3)}</div>
<div class="zusatz"><p><b>Mein Merksatz:</b> Schreibe den wichtigsten Gedanken der Stunde in einem Satz auf.</p>${zeilen(2)}</div>`;
  const zus = `<div class="pb"></div><div class="zusatz"><div class="k"><b>Zusatz für Schnelle</b>${meta(st.zusatz)}</div><p>${mdFett(st.zusatz.text)}</p>${Array.from({ length: 6 }, () => '<div class="zeile" style="margin-left:0"></div>').join("")}</div>`;
  const ziele = st.lernziele.map((z) => {
    const t = z.replace(/^Du kannst /, "");
    if (t === z) throw new Error(st.id + ": Lernziel beginnt nicht mit „Du kannst“");
    return `<tr><td>${md(t)}</td><td class="b"><span class="box"></span></td><td class="b"><span class="box"></span></td><td class="b"><span class="box"></span></td></tr>`;
  }).join("");
  const url = `${BASIS}/${st.id}?weg=schule`;
  const q = qrSvg(url, 0.6);
  return seite(`Arbeitsblatt ${st.kenn}: ${st.titel}`, "arbeitsblatt", `
<div class="kopfblock"><div class="links">
<h1>Arbeitsblatt ${st.kenn}: ${esc(st.titel)}</h1>
<div class="felder"><span>Name:</span><span class="klein">Datum:</span></div>
<div class="zeit"><b>Zeit:</b> ${esc(st.zeitplan[1].t.replace(/ Min$/, " Minuten"))} (Doppelstunde: 30). Quiz und Nachdenken: Hausaufgabe (Doppelstunde: in der Stunde).</div>
<div class="zeitnote">${niveauZeile}</div>
</div><div class="qrbox">${q.svg}</div></div>
<table class="ziele"><thead><tr><th>Heute kannst du ...</th><th class="b">sicher</th><th class="b">fast</th><th class="b">noch nicht</th></tr></thead><tbody>${ziele}</tbody></table>
${auf}
${quizHtml}
${nachdenken}
${zus}
${legende(st)}
<div class="fuss quellen"><b>Mehr dazu im KI-Labor:</b> <a href="${esc(url)}">${adresse(url)}</a> Oder den QR-Code oben rechts scannen: Labor und Material, es wird nichts gespeichert. Hilfe zu einer Aufgabe: Hilfekarten bekommst du bei deiner Lehrkraft.<br>${esc(QUELLENFUSS)}</div>
`);
}

/** Beendet einen Satz mit Punkt, falls er mit keinem Satzzeichen endet. */
const satz = (t) => (/[.!?]$/.test(String(t).trim()) ? String(t).trim() : String(t).trim() + ".");
function loesungsblatt(st) {
  const buchst2 = "ABCD";
  const lis = (l) => l.map((x) => `<li>${x.titel ? `<b>${esc(x.titel)}:</b> ` : ""}${mdFett(x.text)}</li>`).join("\n");
  const tafel = st.tafel.length ? `<div class="pfad">${st.tafelMitte ? `<span><b>${esc(st.tafelMitte)}:</b></span>` : ""}${st.tafel.map((t, i) => `<span>${esc(t)}</span>${i < st.tafel.length - 1 ? "<i>&gt;</i>" : ""}`).join("")}</div>` : "";
  const loes = st.loesungen.map((x) => `<div class="lg"><b>${esc(x.titel.replace(/^Zu /, "Zu "))}.</b> ${mdFett(x.text)}</div>`).join("\n");
  const diff = st.diff.map((x) => `<div><b>${esc(x.titel)}</b><br>${mdFett(x.text)}</div>`).join("");
  const dp = st.doppel.map((d) => `<tr><td>${esc(d.phase)}</td><td style="white-space:nowrap">${d.min} Min</td><td>${md(d.was)}</td></tr>`).join("\n");
  const zp = st.phasen.map((p) => `<tr><td>${esc(p.phase)}</td><td style="white-space:nowrap">${esc(p.zeit)}</td><td>${md(p.was)}${p.phase === "Reflexion" ? " Nur mündlich, nichts wird aufgeschrieben (schriftlich: Hausaufgabe)." : ""}</td></tr>`).join("\n");
  const url1 = `${BASIS}/${st.id}?weg=schule`, url2 = `${BASIS}/schule-lehrkraefte?weg=schule`;
  return seite(`Lösungsblatt ${st.kenn}: ${st.titel}`, st.id === "medien-stunde-1" ? "loesung kompakt" : "loesung", `
<h1>Lösungsblatt ${st.kenn}: ${esc(st.titel)} (für Lehrkräfte)</h1>
<p class="nurlehr"><b>Nur für Lehrkräfte, nicht an Schüler weitergeben.</b></p>
<h2>Einzelstunde: Zeitplan (45 Minuten)</h2>
<table><thead><tr><th>Phase</th><th style="width:20mm">Zeit</th><th>Was passiert</th></tr></thead><tbody>
${zp}
</tbody></table>
<p>In der Stunde laufen die Aufgaben 1 bis ${st.aufgaben.length} (am Anfang des Arbeitsblatts) und die mündliche Reflexion. <b>Quiz und schriftliches Nachdenken</b> (danach auf dem Arbeitsblatt) sind Hausaufgabe oder Teil der Folgestunde, die Auflösung steht unten. Das Blatt gibst du in beiden Varianten ganz aus.</p>
<h2>Doppelstunde: Zeitplan (90 Minuten)</h2>
<table><thead><tr><th>Phase</th><th style="width:20mm">Zeit</th><th>Was passiert</th></tr></thead><tbody>
${dp}
</tbody></table>
<p>In beiden Varianten gilt: Den Merksatz bekommen alle am Ende der Sicherung an die Tafel und ins Heft.</p>
${st.vorbereitung.map((v) => `<p>${md(v)}</p>`).join("\n")}
<h2>Lehrplanbezug</h2>
${st.lehrplan.map((v) => `<p>${mdFett(v)}</p>`).join("\n")}
<div class="zus"><h2>Operatoren und Erwartungshorizont</h2>
<p>Die Operatoren dieses Blatts mit ihrem Bereich. Was eine gute Antwort je Operator enthält, steht bei den Lösungen.</p>
${legende(st)}</div>
<h2>Lösungen und Hinweise</h2>
${loes}
${st.id === "medien-stunde-1" ? aufloesungKarten() : ""}
${st.quiz.length ? `<h2>Quiz: richtige Antworten</h2><ul>${st.quiz.map((q, i) => `<li><b>Frage ${i + 1}: ${buchst2[q.richtig]}.</b> ${esc(satz(q.optionen[q.richtig]))} ${esc(q.erklaerung)} <i>Nachlesen: Abschnitt „${esc(q.abschnitt.replace(/ \(\d+ Minuten\)/, ""))}“.</i></li>`).join("")}</ul>` : ""}
<h2>Differenzierung</h2>
<div class="zwei">${diff}</div>
<h2>Hilfekarten zum Ausschneiden (Tipp 1 und Tipp 2)</h2>
<p>Die Hilfekarten liegen nur in diesem Lösungsblatt, nicht auf dem Arbeitsblatt der Klasse. Schneide sie entlang der gestrichelten Linien aus, gib Tipp 1 zuerst und Tipp 2 nur bei Bedarf weiter.</p>
<div class="karten">${st.aufgaben.flatMap((a) => [1, 2].map((t) => `<div class="karte"><b>Aufgabe ${a.nr}, Tipp ${t}</b><br>${md(st.hilfen[a.nr][t])}</div>`)).join("")}</div>
<h2>Tafelbild (Sicherung)</h2>
${tafel}
${st.tafelText.map((v) => `<p>${md(v)}</p>`).join("\n")}
<p><b>Merksatz:</b> ${md(st.tafelMerke)}</p>
<h2>Fragen für die Reflexion mit Erwartungshorizont</h2>
<p>Die Stichpunkte zeigen, was eine gute Antwort enthalten kann. Sie sind Orientierung, keine Musterlösung zum Vorlesen.</p>
<ul>${st.reflexion.map((r, i) => `<li class="rf">${md(r)}<ul class="muster">${st.muster[i].map((m) => `<li>${md(m)}</li>`).join("")}</ul></li>`).join("")}</ul>
${mehrKasten([
    { titel: `${st.kenn} im KI-Labor`, url: url1, hinweis: "Seite zur Stunde mit Aufgaben und Quiz." },
    { titel: "Handreichung", url: url2, hinweis: "Fachbegriffe, Operatoren, Schülerfragen, Stolperstellen." },
  ])}
<div class="fuss quellen">${esc(QUELLENFUSS)}</div>
`);
}

/* ------------------------------------------------------------------ Kartenset "Echt oder KI?" (Medien 1) */
// Zwoelf Karten: sechs freie Fotos aus app/static/beispiele/fotos (Quelle aus fotos/meta.json) und sechs selbst erzeugte Bilder.
// Dateien: app/static/materialien/bildkarten/karte-NN.jpg (960 x 720, zugeschnitten, ohne Metadaten). Die Nummern sind gemischt.
// Die KI-Bilder entstanden am 22.11.2026 mit dem Bildmodell gpt_image_2_6 (Higgsfield), neutrale Motive ohne Personen, Schrift und Marken.
const META = JSON.parse(fs.readFileSync(path.join(STATIC, "beispiele", "fotos", "meta.json"), "utf8"));
const KARTEN = [
  { n: 1, echt: "logistik-hafenhof-container.jpg", motiv: "Containerhof mit Lastwagen", hinweis: "Schrift auf dem Container lesbar und logisch." },
  { n: 2, ki: true, motiv: "Bergsee bei Sonnenaufgang", hinweis: "Licht wie auf einem Poster, Spiegelung zu gleichmäßig. Keine Hände, keine Schrift." },
  { n: 3, ki: true, motiv: "Fuchs in einer Herbstwiese", hinweis: "Fell und Wiese wirken wie gemalt, Hintergrund weich und sauber." },
  { n: 4, echt: "handel-tassen-tisch.jpg", motiv: "Emaille-Tassen auf einem Tisch", hinweis: "Stark gefiltert und unscharf, aber echt." },
  { n: 5, echt: "baustelle-neubau-ferne.jpg", motiv: "Neubau und Straße in der Ferne", hinweis: "Viele kleine Details, lesbare Schilder." },
  { n: 6, ki: true, motiv: "Spaghetti mit Tomatensoße", hinweis: "Soße und Nudeln sehr gleichmäßig, Licht wie im Werbefoto, Wasserglas prüfen." },
  { n: 7, echt: "handel-regal-luecken.jpg", motiv: "Leere Regale im Laden", hinweis: "Preisschilder lesbar und stimmig, Unordnung wie im echten Laden." },
  { n: 8, ki: true, motiv: "Fachwerkhaus", hinweis: "Fenster, Balken und Dach fast zu regelmäßig, Ränder prüfen." },
  { n: 9, ki: true, motiv: "Fahrrad an einer Ziegelwand", hinweis: "Sehr sauber, Spiegelung im Fenster und Speichen prüfen." },
  { n: 10, echt: "logistik-kleintransporter-strasse.jpg", motiv: "Kleintransporter in einer Einkaufsstraße", hinweis: "Viele Schilder mit lesbarer Schrift, dichter Hintergrund." },
  { n: 11, echt: "baustelle-metro-pause.jpg", motiv: "Baustelle in einer Stadtstraße", hinweis: "Verkehrsschild, Absperrband und Häuser im Hintergrund stimmig, viele kleine Details." },
  { n: 12, ki: true, motiv: "Regentropfen an einer Haltestelle", hinweis: "Tropfen sehr gleichmäßig, Lichter auf der Straße passen nicht ganz." },
];
if (KARTEN.length !== 12 || KARTEN.filter((k) => k.ki).length !== 6) throw new Error("Kartenset: erwartet 6 echte und 6 KI-Karten");
for (const k of KARTEN) {
  if (!fs.existsSync(path.join(AUS, "bildkarten", `karte-${String(k.n).padStart(2, "0")}.jpg`))) throw new Error("Bild für Karte " + k.n + " fehlt");
  if (k.echt && !META[k.echt]) throw new Error("Quelle fehlt in fotos/meta.json: " + k.echt);
}
const quelleKarte = (k) => {
  if (k.ki) return "KI-Bild, selbst erzeugt (Bildmodell, 22.11.2026).";
  const m = META[k.echt];
  return `Foto: ${m.urheber}, ${m.lizenz}, Wikimedia Commons.`;
};
function aufloesungKarten() {
  const zeilen = KARTEN.map((k) => `<tr><td class="n">${k.n}</td><td class="a">${k.ki ? "KI-Bild" : "Echt"}</td><td>${esc(k.motiv)}. ${esc(k.hinweis)} <i>${esc(quelleKarte(k))}</i></td></tr>`).join("\n");
  return `<h2>Auflösung des Kartensets</h2>
<p>Sechs echte Fotos mit freier Lizenz, sechs KI-Bilder. Die Hinweise sind Anhaltspunkte, kein Beweis.</p>
<table class="auf"><tbody>
${zeilen}
</tbody></table>`;
}
function kartenset() {
  const karte = (k) => `<div class="bk"><img src="bildkarten/karte-${String(k.n).padStart(2, "0")}.jpg" alt="Bildkarte ${k.n}"><span class="nr">${k.n}</span></div>`;
  return seite("Kartenset Echt oder KI?", "kartenset", `
<h1>Kartenset: Echt oder KI?</h1>
<p class="hinweis">Medien-Einheit 1. Karten ausschneiden und je Gruppe ein Set austeilen. Die Auflösung steht nur im Lösungsblatt der Lehrkraft.</p>
<div class="bks">${KARTEN.slice(0, 6).map(karte).join("")}</div>
<div class="bks">${KARTEN.slice(6).map(karte).join("")}</div>
`);
}


/* ------------------------------------------------------------------ Kartenset fuer Eltern (gleiche zwoelf Karten, eine Quelle: KARTEN) */
const KOPF_KURZ = "KI-Labor, Stand " + STAND;
function kartensetEltern() {
  const karte = (k) => `<div class="bk"><img src="bildkarten/karte-${String(k.n).padStart(2, "0")}.jpg" alt="Bildkarte ${k.n}"><span class="nr">${k.n}</span></div>`;
  const zellen = (txt) => KARTEN.map(() => `<td>${txt}</td>`).join("");
  const url = `${BASIS}/echt-oder-ki?weg=eltern`;
  const q = qrSvg(url, 0.7);
  const auflKopf = aufloesungKarten().replace("<h2>Auflösung des Kartensets</h2>", "<h2>Auflösung für Eltern</h2>")
    .replace("Sechs echte Fotos mit freier Lizenz, sechs KI-Bilder. Die Hinweise sind Anhaltspunkte, kein Beweis.", "Sechs Karten zeigen echte Fotos, sechs sind KI-Bilder. Die Hinweise sind Anhaltspunkte, kein Beweis. Schauen Sie erst nach, wenn alle zwölf Karten geraten sind.");
  return seite("Kartenset Echt oder KI? für Eltern", "kartenset eltern", `
<h1>Kartenset: Echt oder KI? Für Eltern und Kind</h1>
<p class="lead">Zwölf Bildkarten auf den Seiten 3 und 4: sechs echte Fotos, sechs KI-Bilder. Sie spielen zu zweit, Sie und Ihr Kind. Es braucht dafür kein Gerät. Die Auflösung steht auf Seite 2, der Rückseite dieser Regeln. Sie behalten sie, die Karten bleiben ohne Auflösung.</p>
<h2>Spielregeln für zwei</h2>
<ol class="regeln">
<li><b>Vorbereiten.</b> Drucken Sie die Seiten 1 und 2 doppelseitig, die Seiten 3 und 4 einseitig. Ausschneiden ist möglich, Sie können aber auch direkt am Blatt raten. Halten Sie Stift und das Punkteblatt unten bereit.</li>
<li><b>Abwechselnd raten.</b> Ihr Kind beginnt mit Karte 1, Sie folgen mit Karte 2, dann wieder Ihr Kind, bis Karte 12. Wer an der Reihe ist, sagt laut: „echt“, „KI“ oder „unklar“, und nennt einen Hinweis. Die andere Person darf widersprechen.</li>
<li><b>Notieren.</b> Tragen Sie die Antwort im Punkteblatt ein: E für echt, K für KI, U für unklar. Noch nicht auflösen.</li>
<li><b>Auflösen und Punkte zählen.</b> Nach Karte 12 drehen Sie dieses Blatt um und lösen auf Seite 2 gemeinsam auf. Jede richtige Antwort ist ein Punkt. „Unklar“ ist erlaubt und zählt null Punkte.</li>
<li><b>Sprechen.</b> Reden Sie bei jeder Karte kurz darüber, auch wenn die Antwort stimmte. Nicht der Punktestand ist wichtig, sondern was Sie beide gesehen haben.</li>
</ol>
<h2>Gesprächsfragen</h2>
<ul class="fragen">
<li>„Woran hast du es gesehen?“</li>
<li>„Was hat dich zweifeln lassen?“</li>
<li>„Könnte ein echtes Foto diese Stelle auch haben?“</li>
<li>„Wie würdest du prüfen, woher das Bild kommt?“</li>
</ul>
<p>Erwachsene liegen bei guten KI-Bildern oft ebenso daneben wie Kinder. Eine sichere Erkennung gibt es nicht. Wichtig ist, dass Ihr Kind vorsichtig bleibt und nachfragt: Wer hat das Bild veröffentlicht, und was berichten andere dazu?</p>
<h2>Punkteblatt</h2>
<table class="punkte"><thead><tr><th></th>${KARTEN.map((k) => `<th>${k.n}</th>`).join("")}</tr></thead><tbody>
<tr><th>Kind</th>${zellen("&nbsp;")}</tr>
<tr><th>Sie</th>${zellen("&nbsp;")}</tr>
<tr><th>Richtig</th>${zellen("&nbsp;")}</tr>
</tbody></table>
<p>Punkte Kind: ______ &nbsp;&nbsp; Punkte Sie: ______</p>
<div class="mehr"><div class="paar"><div class="qrbox">${q.svg}</div><div class="t"><h2>Echt oder KI? im KI-Labor</h2><a class="adr" href="${esc(url)}">${adresse(url)}</a><small>Dasselbe Spiel am Bildschirm, mit Erklärung zu jeder Karte. Es wird nichts gespeichert.</small></div></div></div>
<div class="pg">${auflKopf}
<p class="fuss-eltern">Alle Angaben stammen aus dem KI-Labor, Stand ${STAND}. Kein Rechtsrat.</p></div>
<div class="pg"><h2>Karten 1 bis 6</h2><p class="hinweis">Karten einseitig drucken und ausschneiden.</p><div class="bks">${KARTEN.slice(0, 6).map(karte).join("")}</div></div>
<div class="pg"><h2>Karten 7 bis 12</h2><p class="hinweis">Karten einseitig drucken und ausschneiden.</p><div class="bks">${KARTEN.slice(6).map(karte).join("")}</div></div>
`, KOPF_KURZ);
}

/* ------------------------------------------------------------------ Entscheidungshilfe fuer Betriebe (Seite "betrieb-entscheidung", eine A4-Seite) */
function entscheidungshilfe() {
  const s = INHALT.seiten["betrieb-entscheidung"], c = s.checkliste;
  if (!c || !Array.isArray(c.punkte) || c.punkte.length !== 6) throw new Error("betrieb-entscheidung: erwartet sechs Fragen im Feld checkliste");
  const entsch = abschnitt("betrieb-entscheidung", "Was du jetzt entscheidest").visual.zellen;
  if (entsch.length !== 3) throw new Error("betrieb-entscheidung: erwartet drei Entscheidungen");
  const url = `${BASIS}/betrieb-entscheidung?weg=beruf`;
  const q = qrSvg(url, 0.6);
  const fragen = c.punkte.map((p, i) => `<div class="fr"><span class="box"></span><div><b>${i + 1}. ${md(p.frage)}</b><br><span class="hilfe">${md(p.hilfe)}</span></div></div>`).join("\n");
  return seite("Entscheidungshilfe: sechs Fragen vor dem Start", "entscheidung", `
<div class="kopfblock"><div class="links"><h1>${md(s.titel)}</h1><p class="lead">${md(c.lead)}</p></div><div class="qrbox">${q.svg}</div></div>
${fragen}
<h2>Was du jetzt entscheidest</h2>
<div class="drei">${entsch.map((z) => `<div><b>${esc(z.text)}</b><br>${esc(z.sub)}</div>`).join("")}</div>
<h2>Notizen</h2>
<div class="notiz">${Array.from({ length: 6 }, () => '<div class="zeile" style="margin-left:0"></div>').join("")}</div>
<div class="hinweis-sp"><b>Schweigepflicht und Gesundheitsdaten:</b> Wer einer Schweigepflicht unterliegt (Steuerberatung, Anwaltschaft, Ärzte), gibt keine Mandanten- oder Patientendaten in das Labor ein. Näheres steht im KI-Labor auf der Seite „Ist das sicher?“, Abschnitt „Berufsgeheimnis und Mandantendaten“.</div>
<div class="fuss quellen"><b>Online abhaken und drucken:</b> <a href="${esc(url)}">${adresse(url)}</a> Oder den QR-Code oben rechts scannen. Es wird nichts gespeichert. Eine Orientierung, keine Beratung und kein Rechtsrat.</div>
`, KOPF_KURZ);
}


/* ------------------------------------------------------------------ Hausaufgaben-Vereinbarung fuer Familien (Seite "hausaufgaben-familie", zwei Seiten A4) */
function vereinbarung() {
  const url = `${BASIS}/hausaufgaben-familie?weg=eltern`;
  const op = (t) => `<div class="opt"><span class="box"></span><span>${esc(t)}</span></div>`;
  const eigen = op("Unsere eigene Regel: ______________________________");
  const spalte = (liste) => liste.map(op).join("") + eigen;
  const zeile = (titel, a, b) => `<tr><td><b>${esc(titel)}</b></td><td>${spalte(a)}</td><td>${spalte(b)}</td></tr>`;
  return seite("Hausaufgaben und KI bei uns zu Hause", "vereinbarung", `
<h1>Hausaufgaben und KI bei uns zu Hause</h1>
<div class="feldz">Name des Kindes: <span class="fl l"></span> &nbsp; Alter: <span class="fl" style="min-width:14mm"></span> &nbsp; Datum: <span class="fl"></span></div>
<p class="lead">Dieses Blatt ist ein Angebot für ein Gespräch, kein Vertrag. Lesen Sie die Bausteine gemeinsam mit Ihrem Kind, kreuzen Sie an, was bei Ihnen gelten soll, und ergänzen Sie, was fehlt. Wählen Sie die Spalte, die zum Alter passt, oder mischen Sie beide. Die Regeln der Schule gehen vor: Fragen Sie im Zweifel die Lehrkraft.</p>
<h2>Wann darf KI helfen, wann nicht?</h2>
<table class="stufe"><thead><tr><th style="width:20mm"></th><th>Mit 12 Jahren</th><th>Mit 15 Jahren</th></tr></thead><tbody>
${zeile("Du darfst KI fragen, wenn ...",
  ["du dir erst selbst Gedanken gemacht hast.", "dir ein Wort oder eine Aufgabe in einfachen Worten erklärt werden soll.", "sie dich Vokabeln oder Lernstoff abfragen soll.", "ein Erwachsener beim Chat dabei ist (für unter 16 empfiehlt das Labor das)."],
  ["du deinen eigenen Entwurf geprüft haben willst und eine Rückmeldung möchtest.", "sie eine Gliederung vorschlägt, die du selbst ausformulierst.", "du Erklärungen oder Übungsaufgaben zum Stoff brauchst.", "du die Aufgabe vorher selbst versucht hast."])}
${zeile("Du nutzt KI nicht, um ...",
  ["fertige Lösungen, Rechenwege oder Aufsätze abzuschreiben.", "Namen, Adressen, Fotos oder Passwörter einzugeben.", "allein zu chatten, wenn kein Erwachsener in der Nähe ist."],
  ["einen KI-Text als deinen eigenen abzugeben.", "bei Klassenarbeiten oder Tests zu helfen, wenn die Lehrkraft es untersagt.", "Daten von Freunden, Familie oder Lehrkräften einzugeben."])}
</tbody></table>
<p>Kamera, Mikrofon und Gesichtserkennung im KI-Labor sind erst ab 16 Jahren gedacht, jüngere nur mit Einverständnis der Eltern. Für Hausaufgaben brauchen Sie keines davon.</p>
<h2>Wie wir kennzeichnen</h2>
<p>Du schreibst unter jede Aufgabe, bei der KI geholfen hat, wofür du sie genutzt hast. Offen angegebene Hilfe ist selten ein Problem, verschwiegene schon.</p>
<div class="beispiel"><b>Beispiel:</b> KI genutzt für die Gliederung (Chatbot, 12.03.). Text und Rechnungen von mir, Fakten in den Quellen geprüft.</div>
<p>Unsere Fassung: KI genutzt für <span class="fl l"></span> (Werkzeug, Datum: <span class="fl"></span>).</p>
<div class="pg"></div>
<h2>Antworten prüfen: drei Schritte</h2>
<p>Eine KI-Antwort kann falsch sein, auch wenn sie sicher klingt. Du prüfst sie, bevor du sie benutzt.</p>
<div class="drei">
<div><b>1. Wer sagt das?</b><br>Suche den Urheber und frage, was er davon hat. Im Impressum steht, wer dahintersteckt.</div>
<div><b>2. Sagen es andere auch?</b><br>Suche einen zweiten Bericht, der selbst recherchiert hat. Kopien derselben Meldung zählen als eine Quelle.</div>
<div><b>3. Gibt es das Original?</b><br>Suche die genannte Quelle, Studie oder Zahl selbst. Chatbots erfinden Quellen. Findest du sie nicht, lässt du die Aussage weg.</div>
</div>
${op("Sie lassen sich bei Gelegenheit zeigen, wie Ihr Kind geprüft hat, und fragen: Wie bist du darauf gekommen?")}
<h2>Zeiten</h2>
${op("Erst selbst versuchen, etwa 10 Minuten, dann erst fragen.")}
<p>KI-Hilfe bei Hausaufgaben: von <span class="fl"></span> bis <span class="fl"></span> Uhr, höchstens <span class="fl" style="min-width:14mm"></span> Minuten am Tag. Ohne KI: <span class="fl l"></span></p>
<h2>Was wir bei Streit tun</h2>
${op("Wir sprechen darüber, ohne Vorwürfe, und erklären beide, was uns wichtig ist.")}
${op("Das Kind zeigt, wie es vorgegangen ist: Was habe ich selbst versucht, was hat die KI vorgeschlagen, was habe ich geprüft?")}
${op("Bei Unsicherheit fragen wir die Lehrkraft.")}
${op("Nach vier Wochen schauen wir, ob die Regeln passen, und ändern sie bei Bedarf.")}
<div class="sign"><div>Unterschrift Kind</div><div>Unterschrift Eltern</div><div>Datum</div></div>
${mehrKasten([{ titel: "Hausaufgaben und KI zu Hause", url, hinweis: "Beispiele, Gesprächsfragen und mehr im KI-Labor. Es wird nichts gespeichert." }])}
<div class="fuss quellen">Die Angaben stammen aus den Seiten des KI-Labors, Stand ${STAND}. Kein Rechtsrat.</div>
`, KOPF_KURZ);
}

/* ------------------------------------------------------------------ Infoblatt fuer die Schulleitung (Seiten "schule-schulleitung", "sicherheit-einfach", docs/betrieb-sicherheit.md) */
function schulleitungInfoblatt() {
  const sl = INHALT.seiten["schule-schulleitung"];
  const bv = abschnitt("schule-schulleitung", "Betrieb und Verträge").tabelle.zeilen;
  const bvZeile = (anfang) => { const z = bv.find((x) => x[0].startsWith(anfang)); if (!z) throw new Error("Schulleitung: Tabellenzeile fehlt: " + anfang); return z; };
  bvZeile("Kosten"); bvZeile("Aufbewahrung der Server-Protokolle"); bvZeile("Auftragsverarbeitung");
  const url = `${BASIS}/schule-schulleitung?weg=schule`;
  return seite("Infoblatt Schulleitung: KI-Labor", "schulleitung", `
<h1>KI-Labor: Infoblatt für die Schulleitung</h1>
<div class="antwort"><b>Was entscheidet die Schule?</b> Ob und wie das Labor im Unterricht eingesetzt wird, welche Rechtsgrundlage dafür gilt, ob Eltern vorab informiert werden und welche Endgeräte genutzt werden. Der Betreiber stellt das Labor bereit und beschreibt die Daten. Er trifft diese Entscheidung nicht.</div>
<h2>Was das KI-Labor ist</h2>
<p>Ein kostenloses Lernangebot zu künstlicher Intelligenz auf Deutsch, ohne Konto und ohne Anmeldung. Für den Unterricht gibt es drei Stunden zu je 45 Minuten und sieben Einheiten zur Medienkompetenz, gedacht ab Klasse 8, mit Arbeitsblättern und Lösungsblättern zum Ausdrucken. Betreiber ist Daniel Alisch.</p>
<h2>Datenschutz in Fakten</h2>
<ul>
<li>Eingegebene Texte und Kamerabilder werden nicht gespeichert. Chat-Texte verarbeitet ein Sprachmodell auf dem Rechner des Labors, externe KI-Dienste sind nicht angebunden.</li>
<li>Kamera und Mikrofon starten nie von allein, sondern nur nach ausdrücklicher Zustimmung. Das Labor nennt dafür eine Altersangabe von 16 Jahren (Kamera, Mikrofon, Gesichtserkennung), jüngere nur mit Einverständnis der Eltern. Eine Altersprüfung gibt es nicht. Der Unterricht braucht beides nicht.</li>
<li>Der Server sieht wie bei jeder Webseite Verbindungsdaten (Internetadresse, Uhrzeit) in kurzen Protokollen.</li>
<li>Technisch nötig ist ein Sitzungs-Cookie (bis 24 Stunden gültig, die Daten dahinter verfallen nach 30 Minuten ohne Aktivität). Keine Werbung, keine Besucherstatistik, keine Abfrage von Name, Alter oder Klasse.</li>
<li>Hosting: Das Labor rechnet auf einem Gerät beim Betreiber. Die öffentliche Adresse läuft über einen Server bei IONOS und den Tunneldienst von Cloudflare.</li>
</ul>
<h2>Kosten und Verantwortung</h2>
<p>Kostenlos, ohne Vertrag, ohne Zusage zur Verfügbarkeit. Es ist ein einzelner kleiner Rechner, bei vielen gleichzeitigen Anfragen entstehen Wartezeiten. Verantwortlicher im Sinne der Datenschutzerklärung ist der Betreiber. Über den Einsatz in der Schule entscheidet die Schule.</p>
<h2>Fragen, die Ihre Schule klärt</h2>
<ul>
<li>Braucht der Einsatz eine Auftragsverarbeitung oder einen anderen Vertrag, und wer prüft das (Datenschutzbeauftragte, Schulträger)?</li>
<li>Welche Rechtsgrundlage nutzt die Schule, was verlangt das Landesrecht, und braucht es Einwilligungen von Eltern oder Schülern?</li>
<li>Wo liegen die Altersgrenzen, und wie stellt die Schule sicher, dass Kamera und Mikrofon im Unterricht aus bleiben (Sperre am Schulgerät)?</li>
<li>Welche Endgeräte werden genutzt, und wie viele gleichzeitig?</li>
</ul>
<div class="pg"></div>
<h2>Offene Punkte, ehrlich benannt</h2>
<p>Aufbewahrungsdauer der Protokolle und Verträge: Auf Anfrage beim Betreiber. Was sich nicht belegen lässt, steht hier als offen.</p>
<table><thead><tr><th>Thema</th><th>Stand</th></tr></thead><tbody>
<tr><td>Aufbewahrungsdauer der Protokolle</td><td>Auf Anfrage beim Betreiber.</td></tr>
<tr><td>Verträge mit IONOS und Cloudflare (Auftragsverarbeitung)</td><td>Auf Anfrage beim Betreiber. Die Dienstleister nennt die Datenschutzerklärung.</td></tr>
<tr><td>Nutzungsrechte am Unterrichtsmaterial</td><td>Auf Anfrage beim Betreiber.</td></tr>
<tr><td>Wenn das Angebot eingestellt wird</td><td>Auf Anfrage beim Betreiber. Eine Zusage zur Dauer gibt es nicht. Die Arbeitsblätter lassen sich als PDF ausdrucken.</td></tr>
<tr><td>Prüfung nach Landesrecht</td><td>Nicht erfolgt. Kein Rechtsrat, die Datenschutzerklärung des Betreibers ist verbindlich.</td></tr>
</tbody></table>
<h2>Kontakt</h2>
<p>Impressum und Datenschutzerklärung stehen auf der Seite des Betreibers: daniel-alisch.site/impressum und daniel-alisch.site/datenschutz. Dort finden Sie auch die Kontaktangaben. Im PDF steht bewusst keine E-Mail-Adresse.</p>
<h2>Mehr zum Mitnehmen</h2>
<p>Für Elternabende gibt es ein Info-Blatt und einen Gesprächsleitfaden zum Ausdrucken. Die Handreichung für Lehrkräfte erklärt Ablauf, Operatoren und das Sperren von Kamera und Mikrofon am Schulgerät.</p>
${mehrKasten([{ titel: "Information für die Schulleitung", url, hinweis: "Alle Angaben mit Quellen und Tabelle zu Betrieb und Verträgen." }])}
<div class="fuss quellen">Alle Angaben stammen aus den Seiten des KI-Labors, Stand ${STAND}. Kein Rechtsrat: Die Schule entscheidet über den Einsatz, verbindlich ist die Datenschutzerklärung des Betreibers.</div>
`, KOPF_KURZ);
}

/* ------------------------------------------------------------------ Elternabend (Seite "elternabend") */
function elternabend() {
  const infoA = abschnitt("elternabend", "Das Info-Blatt"), leitA = abschnitt("elternabend", "Der Gesprächsleitfaden"), faqA = abschnitt("elternabend", "Fragen und Antworten");
  const url1 = `${BASIS}/schule-eltern?weg=schule`, url2 = `${BASIS}/eltern-zuhause?weg=schule`, url3 = `${BASIS}/elternabend?weg=schule`;
  const bloecke = infoA.liste.map(teile).map((b) => `<div class="ib"><h2>${esc(b.titel)}</h2><p>${mdFett(b.text)}</p></div>`).join("\n");
  const info = seite("Info-Blatt für Eltern: Medienkompetenz und KI", "infoblatt", `
<h1>Medienkompetenz und KI: Information für Eltern</h1>
${bloecke}
<div class="kontakt"><h2>Rückfragen an die Schule</h2><div>Ansprechperson und Kontakt (die Schule trägt sie hier ein):</div><div class="linie"></div></div>
${mehrKasten([
    { titel: "Im Unterricht", url: url1, hinweis: "Was die Klasse tut und welche Daten verarbeitet werden." },
    { titel: "Zu Hause", url: url2, hinweis: "Drei Gespräche mit Ihrem Kind, Einrichtung ohne Kamera." },
  ])}
<div class="fuss quellen">Betreiber des KI-Labors ist Daniel Alisch. Impressum und Datenschutzerklärung: daniel-alisch.site/impressum und daniel-alisch.site/datenschutz. Stand ${STAND}, kein Rechtsrat.</div>
`);
  const schritte = leitA.liste.map(teile).map((b) => `<li><b>${esc(b.titel)}:</b> ${mdFett(b.text)}</li>`).join("\n");
  const fragen = faqA.tabelle.zeilen.map((z) => `<tr><td>${md(z[0])}</td><td>${md(z[1])}</td></tr>`).join("\n");
  const leit = seite("Leitfaden und Fragen für den Elternabend", "loesung", `
<h1>Elternabend: Gesprächsleitfaden und Fragen (für Lehrkräfte)</h1>
<h2>Gesprächsleitfaden (zehn Minuten)</h2>
<ul>${schritte}</ul>
<h2>Fragen von Eltern und Kurzantworten</h2>
<table class="frage"><thead><tr><th>Frage</th><th>Kurzantwort</th></tr></thead><tbody>
${fragen}
</tbody></table>
${mehrKasten([
    { titel: "Seite zum Elternabend", url: url3, hinweis: "Info-Blatt, Leitfaden und Fragen online." },
    { titel: "Information für Eltern", url: url1, hinweis: "Der Brief für den Einsatz im Unterricht." },
  ])}
<div class="fuss quellen">Alle Angaben stammen aus den Seiten des KI-Labors, Stand ${STAND}. Kein Rechtsrat: Die Schule entscheidet über den Einsatz, verbindlich ist die Datenschutzerklärung des Betreibers.</div>
`);
  return { "elternabend-infoblatt": info, "elternabend-leitfaden": leit };
}

/* ------------------------------------------------------------------ Bauen */
fs.mkdirSync(AUS, { recursive: true });
const dateien = [];
const ALLE = [1, 2, 3, ...[1, 2, 3, 4, 5, 6, 7].map((i) => "medien-" + i)];
const schreibe = (name, html) => {
  if (/[–—]/.test(html)) throw new Error(name + ": Gedankenstrich im Text");
  fs.writeFileSync(path.join(AUS, name + ".html"), html);
  dateien.push(name);
};
for (const n of ALLE) {
  const st = stunde(n);
  for (const [name, html] of [[`arbeitsblatt-${st.datei}`, arbeitsblatt(st)], [`loesung-${st.datei}`, loesungsblatt(st)]]) {
    if (/[–—]/.test(html)) throw new Error(name + ": Gedankenstrich im Text");
    fs.writeFileSync(path.join(AUS, name + ".html"), html);
    dateien.push(name);
  }
}
schreibe("bildkarten-echt-oder-ki", kartenset());
for (const [name, html] of Object.entries(elternabend())) schreibe(name, html);
schreibe("kartenset-eltern", kartensetEltern());
schreibe("entscheidungshilfe-betrieb", entscheidungshilfe());
schreibe("hausaufgaben-vereinbarung-familie", vereinbarung());
schreibe("schulleitung-infoblatt", schulleitungInfoblatt());
console.log("HTML geschrieben:", dateien.length);

if (!ohnePdf) {
  const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage();
  // keine Netzzugriffe: alles ist lokal und inline
  await page.route(/^https?:/, (r) => r.abort());
  for (const name of dateien) {
    await page.goto("file://" + path.join(AUS, name + ".html"), { waitUntil: "load" });
    const hoehe = await page.evaluate(() => ({ s: document.querySelector(".seite").scrollHeight, b: document.body.scrollHeight }));
    await page.pdf({ path: path.join(AUS, name + ".pdf"), format: "A4", printBackground: false, preferCSSPageSize: true, displayHeaderFooter: false });
    console.log("PDF:", name + ".pdf", "(Inhaltshöhe", Math.round(hoehe.s / 3.7795), "mm)");
  }
  await browser.close();
}
