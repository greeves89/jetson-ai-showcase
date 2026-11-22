// Baut die Unterrichtsmaterialien zu den drei Schulstunden (Plan: docs/materialien-plan.md):
//   app/static/materialien/arbeitsblatt-stunde-N.html und .pdf   (Schueler, 1 Seite DIN A4)
//   app/static/materialien/loesung-stunde-N.html und .pdf        (Lehrkraft: Zeitplan, Loesungen, Differenzierung)
// Alle Texte kommen aus den Seitendaten (app/static/content-schule.js, Seiten schule-stunde-1 bis -3), nichts ist hier erfunden.
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
const LIZENZ = "Lizenz: noch festzulegen";
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
// Minuten je Aufgabe: stehen in "kurz" der Erarbeitung ("Punkte-Labor (12 Minuten) und Prompt-Werkstatt (8 Minuten)"); hier nur zugeordnet und gegengeprueft.
const ZEITEN = {
  "schule-stunde-1": { zuordnung: [[0, 1], [2]], minuten: [12, 8], pruefen: ["12 Minuten", "8 Minuten"] },
  "schule-stunde-2": { zuordnung: [[0], [1, 2]], minuten: [8, 12], pruefen: ["8 Minuten", "12 Minuten"] },
  "schule-stunde-3": { zuordnung: [[0], [1], [2]], minuten: [8, 6, 6], pruefen: ["8 Minuten", "6 Minuten", "6 Minuten"] },
};
const THEMA = { 1: "Was ist KI?", 2: "Wie lernt ein Computer?", 3: "Echt oder erfunden?" };

function stunde(n) {
  const id = "schule-stunde-" + n, s = INHALT.seiten[id];
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
  return {
    n, id, titel: THEMA[n], lernziele: s.lernziele, aufgaben, zusatz: zusatz[0], zeitplan, phasen, minuten: z,
    loesungen: abschnitt(id, "Lösungshinweise").liste.map(teile),
    diff: abschnitt(id, "Differenzierung").liste.map(teile),
    tafel, tafelMitte: sv.mitte || "", tafelMerke: sich.merke, tafelText: sich.p || [],
    reflexion: abschnitt(id, "Reflexion").liste,
    vorbereitung: (vorb.p || []).concat(vorb.alltag ? [vorb.alltag] : []),
    merksatz: s.mitnehmen[0],
  };
}

/* ------------------------------------------------------------------ QR-Code (lokal, Inline-SVG) */
const MODUL_MM = 0.9;   // Kantenlaenge eines Moduls im Druck; Symbol mit 37 Modulen = ca. 33 mm, ruhige Zone 4 Module
function qrSvg(url) {
  const q = qrcode(0, "M");
  q.addData(url, "Byte");
  q.make();
  const n = q.getModuleCount(), ruhe = 4, gesamt = n + 2 * ruhe;
  let d = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) d += `M${x + ruhe} ${y + ruhe}h1v1h-1z`;
  const mm = (gesamt * MODUL_MM).toFixed(2);
  return { n, mm: ((n) * MODUL_MM).toFixed(1), svg:
    `<svg class="qr" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${gesamt} ${gesamt}" width="${mm}mm" height="${mm}mm" role="img" aria-label="QR-Code zu ${esc(url)}" shape-rendering="crispEdges"><rect width="${gesamt}" height="${gesamt}" fill="#fff"/><path d="${d}" fill="#000"/></svg>` };
}

/* ------------------------------------------------------------------ Seiten */
const CSS = `
@page { size: A4; margin: 11mm 13mm; }
* { box-sizing: border-box; }
html { font-family: Arial, Helvetica, sans-serif; color: #000; background: #fff; }
body { margin: 0; font-size: 12pt; line-height: 1.28; }
.seite { display: flex; flex-direction: column; min-height: 273mm; }
.kopf { display: flex; justify-content: space-between; font-size: 9pt; border-bottom: 0.4mm solid #000; padding-bottom: 1.5mm; }
h1 { font-size: 19pt; line-height: 1.15; margin: 3mm 0 2mm; }
h2 { font-size: 13.5pt; margin: 4mm 0 1.5mm; }
.felder { display: flex; gap: 10mm; margin: 0 0 2mm; font-size: 12.5pt; }
.felder span { display: block; border-bottom: 0.3mm solid #000; flex: 1; height: 7mm; }
.felder span.klein { flex: 0 0 52mm; }
.zeit { font-size: 12.5pt; border: 0.4mm solid #000; padding: 1mm 3mm; display: inline-block; margin: 0 0 2.5mm; }
.aufgabe { margin: 0 0 2.4mm; break-inside: avoid; }
.aufgabe .k { display: flex; gap: 3mm; align-items: baseline; }
.nr { flex: 0 0 9mm; height: 9mm; border: 0.5mm solid #000; border-radius: 50%; text-align: center; font-weight: bold; font-size: 13pt; line-height: 8mm; }
.aufgabe h3 { margin: 0; font-size: 12.5pt; }
.aufgabe .zt { font-weight: normal; font-size: 10.5pt; margin-left: 2mm; }
.aufgabe p { margin: 0.5mm 0 0 12mm; }
.zeile { height: 6.6mm; border-bottom: 0.25mm solid #000; margin-left: 12mm; }
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
.zwei > div { border: 0.3mm solid #000; padding: 1.5mm 2.5mm; }
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

const seite = (titel, klasse, inhalt) => `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titel)}</title>
<style>${CSS}</style>
</head>
<body class="${klasse}">
<div class="seite">
<div class="kopf"><span>${esc(KOPF)}</span><span>${esc(LIZENZ)}</span></div>
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

function arbeitsblatt(st) {
  const zeitVon = (i) => {
    const gruppe = st.minuten.zuordnung.findIndex((g) => g.includes(i));
    return gruppe >= 0 && st.minuten.zuordnung[gruppe][0] === i ? st.minuten.minuten[gruppe] : null;
  };
  const zeilen = (k) => Array.from({ length: k }, () => '<div class="zeile"></div>').join("");
  const auf = st.aufgaben.map((a, i) => {
    const m = a.titel.match(/^Aufgabe (\d+), (.+)$/);
    const zt = zeitVon(i) ? `<span class="zt">(ca. ${zeitVon(i)} Minuten${st.minuten.zuordnung.find((g) => g[0] === i).length > 1 ? " für die Aufgaben " + st.minuten.zuordnung.find((g) => g[0] === i).map((x) => x + 1).join(" und ") : ""})</span>` : "";
    return `<div class="aufgabe"><div class="k"><span class="nr">${m ? m[1] : i + 1}</span><h3>${esc(m ? m[2] : a.titel)}${zt}</h3></div><p>${md(a.text)}</p>${zeilen(3)}</div>`;
  }).join("\n");
  const zus = `<div class="zusatz"><b>Zusatz für Schnelle.</b> ${md(st.zusatz.text)}${zeilen(2)}</div>`;
  const url = `${BASIS}/${st.id}?weg=schule`;
  return seite(`Arbeitsblatt Stunde ${st.n}: ${st.titel}`, "arbeitsblatt", `
<h1>Arbeitsblatt Stunde ${st.n}: ${esc(st.titel)}</h1>
<div class="felder"><span>Name:</span><span class="klein">Datum:</span></div>
<div class="zeit"><b>Zeit:</b> ${esc(st.zeitplan[1].t.replace(/ Min$/, " Minuten"))} für die Aufgaben, in der Gruppe</div>
${auf}
${zus}
<div class="verstanden"><span class="box"></span><div><b>Ich habe verstanden:</b> ${md(st.merksatz)}</div></div>
${mehrKasten([{ titel: "Mehr dazu im KI-Labor", url, hinweis: "Link anklicken, abtippen oder den QR-Code scannen. Es wird nichts gespeichert." }])}
`);
}

function loesungsblatt(st) {
  const lis = (l) => l.map((x) => `<li>${x.titel ? `<b>${esc(x.titel)}:</b> ` : ""}${mdFett(x.text)}</li>`).join("\n");
  const tafel = st.tafel.length ? `<div class="pfad">${st.tafelMitte ? `<span><b>${esc(st.tafelMitte)}:</b></span>` : ""}${st.tafel.map((t, i) => `<span>${esc(t)}</span>${i < st.tafel.length - 1 ? "<i>&gt;</i>" : ""}`).join("")}</div>` : "";
  const loes = st.loesungen.map((x) => `<div class="lg"><b>${esc(x.titel.replace(/^Zu /, "Zu "))}.</b> ${mdFett(x.text)}</div>`).join("\n");
  const diff = st.diff.map((x) => `<div><b>${esc(x.titel)}</b><br>${mdFett(x.text)}</div>`).join("");
  const zp = st.phasen.map((p) => `<tr><td>${esc(p.phase)}</td><td style="white-space:nowrap">${esc(p.zeit)}</td><td>${md(p.was)}</td></tr>`).join("\n");
  const url1 = `${BASIS}/${st.id}?weg=schule`, url2 = `${BASIS}/schule-lehrkraefte?weg=schule`;
  return seite(`Lösungsblatt Stunde ${st.n}: ${st.titel}`, "loesung", `
<h1>Lösungsblatt Stunde ${st.n}: ${esc(st.titel)} (für Lehrkräfte)</h1>
<h2>Zeitplan (45 Minuten)</h2>
<table><thead><tr><th>Phase</th><th style="width:20mm">Zeit</th><th>Was passiert</th></tr></thead><tbody>
${zp}
</tbody></table>
${st.vorbereitung.map((v) => `<p>${md(v)}</p>`).join("\n")}
<h2>Lösungen und Hinweise</h2>
${loes}
<h2>Differenzierung</h2>
<div class="zwei">${diff}</div>
<h2>Tafelbild (Sicherung)</h2>
${tafel}
${st.tafelText.map((v) => `<p>${md(v)}</p>`).join("\n")}
<p><b>Merksatz:</b> ${md(st.tafelMerke)}</p>
<h2>Fragen für die Reflexion</h2>
<ul style="break-inside:avoid">${st.reflexion.map((r) => `<li>${md(r)}</li>`).join("")}</ul>
${mehrKasten([
    { titel: `Stunde ${st.n} im KI-Labor`, url: url1, hinweis: "Seite zur Stunde mit Aufgaben und Quiz." },
    { titel: "Handreichung", url: url2, hinweis: "Fachbegriffe, Schülerfragen, Stolperstellen." },
  ])}
`);
}

/* ------------------------------------------------------------------ Bauen */
fs.mkdirSync(AUS, { recursive: true });
const dateien = [];
for (const n of [1, 2, 3]) {
  const st = stunde(n);
  for (const [name, html] of [[`arbeitsblatt-stunde-${n}`, arbeitsblatt(st)], [`loesung-stunde-${n}`, loesungsblatt(st)]]) {
    if (/[–—]/.test(html)) throw new Error(name + ": Gedankenstrich im Text");
    fs.writeFileSync(path.join(AUS, name + ".html"), html);
    dateien.push(name);
  }
}
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
