// Baut die Unterrichtsmaterialien zu den drei Schulstunden (Plan: docs/materialien-plan.md):
//   app/static/materialien/arbeitsblatt-stunde-N.html und .pdf   (Schueler, ein bis drei Seiten DIN A4)
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
const QUELLENFUSS = "Operatoren und Bereiche nach: Bildungsserver Rheinland-Pfalz (bildung.rlp.de, Informatik, 2013), IQB Abituraufgabenpools (iqb.hu-berlin.de, 2026), Bildungsplan Baden-Württemberg 2016 (lehrerfortbildung-bw.de), abgerufen am 22.11.2026. Die Zuordnung kann je Bundesland und Fach leicht abweichen.";
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
  if (!/^\*\*[A-ZÄÖÜ][a-zäöüß]+\*\* \((I{1,3})\)/.test(text)) throw new Error(`${titel}: Aufgabe beginnt nicht mit einem Operator samt Bereich`);
  const gefunden = [];
  for (const m of text.matchAll(/\*\*([A-Za-zÄÖÜäöüß]+)\*\* \((I{1,3})\)/g)) {
    const op = OPERATOREN[m[1].toLowerCase()];
    if (!op) throw new Error(`${titel}: Operator "${m[1]}" steht nicht in der Tabelle der Handreichung`);
    if (op.bereich !== m[2]) throw new Error(`${titel}: ${m[1]} trägt (${m[2]}), die Tabelle sagt ${op.bereich}`);
    if (!gefunden.includes(op.name)) gefunden.push(op.name);
  }
  return gefunden;
}
const kasten = (n) => `<svg class="niv" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 3" width="9mm" height="2.6mm" aria-hidden="true">${[0, 1, 2].map((i) => `<rect x="${i * 4 + 0.15}" y="0.15" width="2.7" height="2.7" fill="${i < n ? "#000" : "#fff"}" stroke="#000" stroke-width="0.3"/>`).join("")}</svg>`;

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
.loesung body, body.loesung { font-size: 10.5pt; line-height: 1.3; }
body.loesung h1 { font-size: 17pt; margin: 3mm 0 2mm; }
body.loesung h2 { font-size: 12pt; margin: 3.5mm 0 1mm; border-bottom: 0.25mm solid #000; }
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
body.loesung table.auf { font-size: 8pt; margin: 0 0 2mm; }
body.loesung table.auf td, body.loesung table.auf th { padding: 0.5mm 1.4mm; }
body.loesung table.auf td.n { width: 8mm; text-align: center; font-weight: bold; }
body.loesung table.auf td.a { width: 14mm; font-weight: bold; }
body.loesung.kompakt { font-size: 9.6pt; line-height: 1.25; }
body.loesung.kompakt h2 { margin: 2.5mm 0 0.8mm; }
body.loesung.kompakt .lg { margin: 0 0 1mm; }
body.loesung.kompakt .karten { gap: 2mm; }
body.loesung.kompakt .karte { padding: 1mm 2mm; }
body.loesung.kompakt .mehr { margin-top: 2mm; padding: 1.5mm 2.5mm; }
body.loesung table.frage td:first-child { width: 52mm; font-weight: bold; }
/* Arbeitsblaetter duerfen mehrseitig sein: grosse Schrift, viel Schreibraum, keine Quetschung auf eine Seite */
@page ab { size: A4; margin: 15mm 17mm; }
body.arbeitsblatt { page: ab; font-size: 12.5pt; line-height: 1.4; }
body.arbeitsblatt .seite { min-height: 0; }
body.arbeitsblatt h1 { font-size: 20pt; margin: 4mm 0 2mm; }
body.arbeitsblatt h2 { font-size: 14pt; margin: 6mm 0 2mm; }
body.arbeitsblatt .aufgabe { margin: 0 0 5mm; }
body.arbeitsblatt .aufgabe h3 { font-size: 13.5pt; }
body.arbeitsblatt .aufgabe p { margin: 1.2mm 0 0 12mm; }
body.arbeitsblatt .zeile { height: 8.2mm; }
body.arbeitsblatt .zusatz { padding: 3mm 4mm; margin: 0 0 5mm; }
body.arbeitsblatt .verstanden { padding: 3mm 4mm; margin: 4mm 0 5mm; }
body.arbeitsblatt .karten { gap: 4mm; margin: 2mm 0 4mm; }
body.arbeitsblatt .karte { padding: 2.5mm 3mm; }
body.arbeitsblatt table.ziele td, body.arbeitsblatt table.ziele th { padding: 1.6mm 2.5mm; }
body.arbeitsblatt .opt { margin: 1.5mm 0 0 12mm; }
body.arbeitsblatt .opt .box { margin-right: 2mm; }
body.arbeitsblatt .mehr { margin-top: 8mm; padding: 3mm 4mm; }
/* Ueberschrift mit Anweisung und erster Frage zusammenhalten (kein Kopf allein am Seitenende) */
.zus { break-inside: avoid; }
.zus > h2 { margin-top: 0; }
body.arbeitsblatt .zus.start { margin-top: 6mm; }
.zeitnote { font-size: 10.5pt; margin: 0 0 2mm; }
table.plan td:first-child { width: 28mm; font-weight: bold; }
ul.muster { margin: 0.5mm 0 0 0; padding-left: 5mm; font-size: 9.5pt; }
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
`;


const seite = (titel, klasse, inhalt) => `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<style>${CSS}${CSS2}</style>
</head>
<body class="${klasse}">
<div class="seite">
<div class="kopf"><span>${esc(KOPF)}</span></div>
${inhalt}
</div>
</body>
</html>
`;

const mehrKasten = (paare) => `<div class="mehr">
${paare.map((p) => {
  const q = qrSvg(p.url);
  return `<div class="paar"><div class="qrbox">${q.svg}</div><div class="t"><h2>${esc(p.titel)}</h2><a class="adr" href="${esc(p.url)}">${esc(p.url.replace(/^https:\/\//, "")).replace(/([\/?])/g, "$1<wbr>")}</a><small>${esc(p.hinweis)}</small></div></div>`;
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
    return `<div class="aufgabe"><div class="k"><span class="nr">${a.nr}</span><h3>${esc(a.ort)}${zt}</h3>${meta(a)}</div><p>${mdFett(a.text)}</p>${zeilen(2)}</div>`;
  }).join("\n");
  const buchst = "ABCD";
  const frageQuiz = (q, i) => `<div class="aufgabe"><div class="k"><span class="nr">${i + 1}</span><h3>${esc(q.frage)}</h3></div>${q.optionen.map((o, j) => `<p class="opt"><span class="box"></span> ${buchst[j]}) ${esc(o)}</p>`).join("")}</div>`;
  const quizHtml = st.quiz.length ? `<div class="zus"><h2>Quiz: Was hast du verstanden?</h2>
<p class="nz">Kreuze je Frage die beste Antwort an. Es ist genau eine richtig.</p>
${frageQuiz(st.quiz[0], 0)}</div>
${st.quiz.slice(1).map((q, i) => frageQuiz(q, i + 1)).join("\n")}` : "";
  const frageNd = (r, i) => `<div class="aufgabe"><div class="k"><span class="nr">${st.aufgaben.length + i + 1}</span><h3>${md(r)}</h3></div>${zeilen(3)}</div>`;
  const nachdenken = `<div class="zus"><h2>Zum Nachdenken</h2>
${frageNd(st.reflexion[0], 0)}</div>
${st.reflexion.slice(1).map((r, i) => frageNd(r, i + 1)).join("\n")}
<div class="aufgabe"><div class="k"><span class="nr">?</span><h3>Meine eigene Frage zum Thema</h3></div>${zeilen(2)}</div>
<div class="zusatz"><p><b>Mein Merksatz:</b> Schreibe den wichtigsten Gedanken der Stunde in einem Satz auf.</p>${zeilen(2)}</div>`;
  const zus = `<div class="zusatz"><div class="k"><b>Zusatz für Schnelle</b>${meta(st.zusatz)}</div><p>${mdFett(st.zusatz.text)}</p></div>`;
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
<div class="zeit"><b>Zeit:</b> Aufgaben ${esc(st.zeitplan[1].t.replace(/ Min$/, " Minuten"))} in der Einzelstunde (so viele Minuten stehen bei den Aufgaben), 30 Minuten in der Doppelstunde. Quiz und Nachdenken: Doppelstunde oder Hausaufgabe. ${niveauZeile}</div>
</div><div class="qrbox">${q.svg}</div></div>
<table class="ziele"><thead><tr><th>Heute kannst du ...</th><th class="b">sicher</th><th class="b">fast</th><th class="b">noch nicht</th></tr></thead><tbody>${ziele}</tbody></table>
${auf}
${quizHtml}
${nachdenken}
${zus}
${legende(st)}
<div class="fuss quellen"><b>Mehr dazu im KI-Labor:</b> <a href="${esc(url)}">${esc(url.replace(/^https:\/\//, ""))}</a> Oder den QR-Code oben rechts scannen: Labor und Material, es wird nichts gespeichert. Hilfe zu einer Aufgabe: Tipp-Karte bei deiner Lehrkraft.<br>${esc(QUELLENFUSS)}</div>
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
  const zp = st.phasen.map((p) => `<tr><td>${esc(p.phase)}</td><td style="white-space:nowrap">${esc(p.zeit)}</td><td>${md(p.was)}${p.phase === "Reflexion" ? " Nur mündlich, nichts wird aufgeschrieben (schriftlich: Hausaufgabe)." : ""}</td></tr>`).join("\n");
  const url1 = `${BASIS}/${st.id}?weg=schule`, url2 = `${BASIS}/schule-lehrkraefte?weg=schule`;
  return seite(`Lösungsblatt ${st.kenn}: ${st.titel}`, st.id === "medien-stunde-1" ? "loesung kompakt" : "loesung", `
<h1>Lösungsblatt ${st.kenn}: ${esc(st.titel)} (für Lehrkräfte)</h1>
<h2>Einzelstunde: Zeitplan (45 Minuten)</h2>
<table><thead><tr><th>Phase</th><th style="width:20mm">Zeit</th><th>Was passiert</th></tr></thead><tbody>
${zp}
</tbody></table>
<p>In der Stunde laufen die Aufgaben 1 bis ${st.aufgaben.length} (Seite 1 des Arbeitsblatts) und die mündliche Reflexion. <b>Quiz und schriftliches Nachdenken</b> (Seiten 2 und 3) sind Hausaufgabe oder Teil der Folgestunde, die Auflösung steht unten. Das Blatt gibst du in beiden Varianten ganz aus.</p>
<h2>Doppelstunde: Zeitplan (90 Minuten)</h2>
<table><thead><tr><th>Phase</th><th style="width:20mm">Zeit</th><th>Was passiert</th></tr></thead><tbody>
<tr><td>Einstieg</td><td style="white-space:nowrap">10 Min</td><td>${md(st.phasen[0].was)} Dazu genug Zeit für das Gespräch an der Tafel.</td></tr>
<tr><td>Erarbeitung</td><td style="white-space:nowrap">30 Min</td><td>Die Aufgaben 1 bis ${st.aufgaben.length} des Arbeitsblatts (20 Minuten in der Einzelstunde, hier 30), Hilfekarten nach Bedarf, Zusatz für Schnelle.</td></tr>
<tr><td>Quiz</td><td style="white-space:nowrap">10 Min</td><td>Einzelarbeit am Arbeitsblatt, danach gemeinsame Auflösung mit den Erklärungen unten.</td></tr>
<tr><td>Sicherung</td><td style="white-space:nowrap">15 Min</td><td>${md(st.phasen[2].was)} Tafelbild gemeinsam entwickeln.</td></tr>
<tr><td>Nachdenken</td><td style="white-space:nowrap">15 Min</td><td>Die Fragen „Zum Nachdenken“ schriftlich allein oder zu zweit, dann Austausch. Eigene Frage und Merksatz zum Schluss.</td></tr>
<tr><td>Abschluss</td><td style="white-space:nowrap">10 Min</td><td>Ergebnisse vorstellen, Lernziele auf dem Blatt ankreuzen, offene Fragen sammeln.</td></tr>
</tbody></table>
<p>In beiden Varianten gilt: Den Merksatz bekommen alle am Ende der Sicherung an die Tafel und ins Heft.</p>
${st.vorbereitung.map((v) => `<p>${md(v)}</p>`).join("\n")}
<div class="zus"><h2>Operatoren und Erwartungshorizont</h2>
<p>Die Operatoren dieses Blatts mit ihrem Bereich. Was eine gute Antwort je Operator enthält, steht bei den Lösungen.</p>
${legende(st)}</div>
<h2>Lösungen und Hinweise</h2>
${loes}
${st.id === "medien-stunde-1" ? aufloesungKarten() : ""}
${st.quiz.length ? `<h2>Quiz: richtige Antworten</h2><ul>${st.quiz.map((q, i) => `<li><b>Frage ${i + 1}: ${buchst2[q.richtig]}.</b> ${esc(satz(q.optionen[q.richtig]))} ${esc(q.erklaerung)} <i>Nachlesen: Abschnitt „${esc(q.abschnitt.replace(/ \(\d+ Minuten\)/, ""))}“.</i></li>`).join("")}</ul>` : ""}
<h2>Differenzierung</h2>
<div class="zwei">${diff}</div>
<h2>Hilfekarten (Tipp 1 und Tipp 2)</h2>
<p>Die Tipps stehen nicht auf dem Arbeitsblatt. Gib Tipp 1 zuerst und Tipp 2 nur bei Bedarf weiter, am besten ausgeschnitten.</p>
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

/* ------------------------------------------------------------------ Elternabend (Seite "elternabend") */
function elternabend() {
  const infoA = abschnitt("elternabend", "Das Info-Blatt"), leitA = abschnitt("elternabend", "Der Gesprächsleitfaden"), faqA = abschnitt("elternabend", "Fragen und Antworten");
  const url1 = `${BASIS}/schule-eltern?weg=schule`, url2 = `${BASIS}/eltern-zuhause?weg=schule`, url3 = `${BASIS}/elternabend?weg=schule`;
  const bloecke = infoA.liste.map(teile).map((b) => `<div class="ib"><h2>${esc(b.titel)}</h2><p>${mdFett(b.text)}</p></div>`).join("\n");
  const info = seite("Info-Blatt für Eltern: Medienkompetenz in Klasse 8", "infoblatt", `
<h1>Medienkompetenz in Klasse 8: Information für Eltern</h1>
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
