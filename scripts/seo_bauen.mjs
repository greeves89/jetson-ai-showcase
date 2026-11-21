// Erzeugt aus den Inhaltsdateien (content.js und die in module.json genannten content-*.js) die Fragmente
// fuer Suchmaschinen: app/static/seo/<id>.html, nav.html, index.json, sitemap.json.
// Der Server setzt das Fragment in die Oberflaeche ein (Rohtext ohne JavaScript lesbar).
// Aufruf:  node scripts/seo_bauen.mjs        (Ergebnis wird eingecheckt; nach jeder Inhaltsaenderung neu bauen)
//          node scripts/seo_bauen.mjs --pruefen   (baut nichts, meldet nur, ob die Dateien aktuell sind)
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATIC = path.join(WURZEL, "app", "static");
const AUS = path.join(STATIC, "seo");
const NUR_PRUEFEN = process.argv.includes("--pruefen");
const TITEL_ENDE = " · KI-Labor";

/* ---------------------------------------------------------------- Inhalte laden (jede Datei einzeln, Quelle merken) */
const ctx = vm.createContext({});
ctx.window = ctx;
const module = JSON.parse(fs.readFileSync(path.join(STATIC, "module.json"), "utf8"));
const dateien = ["content.js", ...(module.content || [])];
const quelle = {};
let bekannt = new Set();
for (const d of dateien) {
  vm.runInContext(fs.readFileSync(path.join(STATIC, d), "utf8"), ctx, { filename: d });
  for (const id of Object.keys(ctx.INHALT.seiten)) if (!bekannt.has(id)) quelle[id] = d;
  bekannt = new Set(Object.keys(ctx.INHALT.seiten));
}
// Textalternativen der Bilder: dieselbe Funktion wie im Browser (app/static/visuals.js, laeuft hier ohne DOM bis zur Textalternative)
vm.runInContext(fs.readFileSync(path.join(STATIC, "visuals.js"), "utf8"), ctx, { filename: "visuals.js" });
const visualAlt = ctx.KLVisualAlt;
const INHALT = ctx.INHALT;
const IDS = new Set(Object.keys(INHALT.seiten));

/* ---------------------------------------------------------------- Markierungen (gleiche Regeln wie md() in app.js) */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pfad = (id) => (id === "start" ? "/" : "/" + id);
function md(t) {
  let s = esc(t);
  s = s.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, k, anzeige) => {
    const g = INHALT.glossar[k];
    return anzeige || (g ? g[0] : k);
  });
  s = s.replace(/\{\{([a-z0-9-]+)(\?[a-z0-9_=&-]+)?\|([^}]+)\}\}/g, (m, id, abfrage, text) => (IDS.has(id) ? '<a href="' + pfad(id) + (abfrage || "") + '">' + text + "</a>" : text));
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  return s;
}
/** Reiner Text ohne Markierungen (fuer Beschreibung und Titel). */
function klar(t) {
  return String(t)
    .replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, k, a) => a || (INHALT.glossar[k] ? INHALT.glossar[k][0] : k))
    .replace(/\{\{([a-z0-9-]+)(?:\?[a-z0-9_=&-]+)?\|([^}]+)\}\}/g, "$2")
    .replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");
}
function beschreibung(kurz) {
  const t = klar(kurz).replace(/\s+/g, " ").trim();
  const satz = (t.match(/^.*?[.!?](?=\s|$)/) || [t])[0];
  if (satz.length <= 160) return satz;
  const k = satz.slice(0, 159);
  return k.slice(0, k.lastIndexOf(" ")).replace(/[,;:]+$/, "") + "…";
}

/* ---------------------------------------------------------------- Fragment einer Seite */
const absaetze = (p) => [].concat(p).map((t) => "<p>" + md(t) + "</p>").join("");
function tabelle(t) {
  return '<div class="tabelle-wrap"><table class="vergleich">' +
    (t.beschriftung ? "<caption>" + md(t.beschriftung) + "</caption>" : "") +
    "<thead><tr>" + t.kopf.map((k) => '<th scope="col">' + md(k) + "</th>").join("") + "</tr></thead><tbody>" +
    t.zeilen.map((z) => "<tr>" + z.map((c, i) => (i === 0 ? '<th scope="row">' + md(c) + "</th>" : "<td>" + md(c) + "</td>")).join("") + "</tr>").join("") +
    "</tbody></table></div>";
}
/** Bild als <figure> mit Textalternative (Liste der Beschriftungen); quelle als <img> mit alt. Ungueltiges entfaellt. */
function bild(v) {
  if (Array.isArray(v)) return v.map(bild).join("");
  const a = visualAlt(v);
  if (!a) return "";
  if (v.typ === "quelle") {
    const src = String(v.src || "");
    if (!/^(\/static\/|static\/)[A-Za-z0-9_\-./]+$/.test(src) || src.includes("..")) return "";
    return '<figure class="visual"><img src="' + esc(src) + '" alt="' + esc(v.alt || "") + '">' + (v.unter ? "<figcaption>" + esc(v.unter) + "</figcaption>" : "") + "</figure>";
  }
  if (!a.eintraege.length) return "";
  return '<figure class="visual"><figcaption>' + esc(a.titel) + "</figcaption><ul>" + a.eintraege.map((t) => "<li>" + esc(t) + "</li>").join("") + "</ul></figure>";
}
const liste = (l) => "<ul>" + l.map((x) => "<li>" + md(x) + "</li>").join("") + "</ul>";

function fragment(id) {
  const s = INHALT.seiten[id];
  const o = [];
  if (s.typ === "start") {
    o.push('<div class="seitenbreite"><p class="ueber">KI-Labor auf dem Jetson</p>');
    o.push("<h1>" + md(s.titel) + '</h1><p class="lead">' + md(s.kurz) + "</p>");
    o.push('<section class="block"><h2>Dein Lernpfad</h2><div class="flaeche pad"><ol class="pfad">' +
      s.pfad.map((p) => "<li><h3>" + (IDS.has(p.id) ? '<a href="' + pfad(p.id) + '">' + esc(p.h) + "</a>" : esc(p.h)) + "</h3><p>" + md(p.p) + "</p></li>").join("") +
      "</ol></div></section>");
    if (s.datenschutz) o.push('<section class="block"><h2>Datenschutz</h2><div class="text"><p>' + md(s.datenschutz) + "</p></div></section>");
    o.push("</div>");
    return o.join("\n");
  }
  const art = s.typ === "lektion" ? "Lektion" + (s.nr ? " " + s.nr : "") : "Labor";
  const ueber = s.typ === "lektion" && s.gruppe === "Grundlagen" ? "Grundlagen · " + art : s.gruppe;
  o.push('<div class="seitenbreite"><p class="ueber">' + esc(ueber) + "</p><h1>" + md(s.titel) + '</h1><p class="lead">' + md(s.kurz) + "</p>");
  o.push('<div class="text">');
  for (const a of s.abschnitte || []) {
    o.push('<h2 class="abs">' + md(a.h) + "</h2>");
    if (a.visual) o.push(bild(a.visual));
    if (a.kurz) o.push('<p class="kurz">' + md(a.kurz) + "</p>");
    if (a.p) o.push(absaetze(a.p));
    if (a.liste) o.push(liste(a.liste));
    if (a.tabelle) o.push(tabelle(a.tabelle));
    if (a.alltag) o.push('<aside class="alltag"><b>Beispiel aus dem Alltag</b>' + absaetze(a.alltag) + "</aside>");
    if (a.merke) o.push('<aside class="merke"><b>Merke</b><p>' + md(a.merke) + "</p></aside>");
  }
  o.push("</div>");
  if (s.mitnehmen) o.push('<section class="block mitnehmen"><h2>Das nimmst du mit</h2>' + liste(s.mitnehmen) + "</section>");
  if (s.quiz && s.quiz.length) {
    o.push('<section class="block quiz"><h2>Teste dich</h2><ol>' + s.quiz.map((f) => "<li>" + md(f.frage) + "</li>").join("") + "</ol></section>");
  }
  if (s.business) {
    o.push('<section class="block"><h2>Im Business</h2><div class="text"><p>' + md(s.business.text) + "</p>" +
      (s.business.beispiele ? liste(s.business.beispiele) : "") + "</div></section>");
  }
  if (s.grenzen) o.push('<section class="block"><h2>Grenzen</h2><div class="text">' + liste(s.grenzen) + "</div></section>");
  const weiter = (s.weiter || []).filter((w) => IDS.has(w));
  if (weiter.length) {
    o.push('<section class="block"><h2>Weiter geht es</h2><ul class="weiter">' +
      weiter.map((w) => '<li><a href="' + pfad(w) + '">' + md(INHALT.seiten[w].titel) + "</a></li>").join("") + "</ul></section>");
  }
  o.push("</div>");
  return o.join("\n");
}

/* ---------------------------------------------------------------- Navigation als Linkliste */
function navigation() {
  const o = ['<nav class="navscroll" aria-label="Lernpfad">'];
  for (const g of INHALT.gruppen) {
    const ids = g.seiten.filter((i) => IDS.has(i) && !INHALT.seiten[i].versteckt);
    if (!ids.length) continue;
    o.push('<div class="navgruppe"><h2>' + esc(g.name) + "</h2><ul>" +
      ids.map((i) => '<li><a class="nav" href="' + pfad(i) + '">' + md(INHALT.seiten[i].nav || INHALT.seiten[i].titel) + "</a></li>").join("") + "</ul></div>");
  }
  o.push("</nav>");
  return o.join("\n");
}

/* ---------------------------------------------------------------- Ausgabe */
const dateienNeu = {};
const index = { seiten: {}, reihenfolge: [], gruppen: [] };
for (const g of INHALT.gruppen) {
  const ids = g.seiten.filter((i) => IDS.has(i) && !INHALT.seiten[i].versteckt);
  if (ids.length) index.gruppen.push({ name: g.name, seiten: ids });
}
// Reihenfolge: wie in der Navigation, danach Seiten ohne Gruppe (falls es welche gibt)
const reihe = [];
for (const g of index.gruppen) for (const i of g.seiten) if (!reihe.includes(i)) reihe.push(i);
for (const i of IDS) if (!reihe.includes(i) && !INHALT.seiten[i].versteckt) reihe.push(i);
index.reihenfolge = reihe;
// versteckte Seiten (versteckt: true) sind erreichbar, stehen aber weder in der Navigation noch in der Sitemap
const alle = [...reihe, ...[...IDS].filter((i) => !reihe.includes(i))];
for (const id of alle) {
  const s = INHALT.seiten[id];
  index.seiten[id] = {
    titel: klar(s.titel) + TITEL_ENDE,
    ueberschrift: klar(s.titel),
    beschreibung: beschreibung(s.kurz),
    typ: s.typ === "start" ? "start" : "seite",
    datei: quelle[id],
    ...(s.versteckt ? { versteckt: true } : {}),
  };
  dateienNeu[id + ".html"] = fragment(id) + "\n";
}
dateienNeu["nav.html"] = navigation() + "\n";
dateienNeu["index.json"] = JSON.stringify(index, null, 1) + "\n";
dateienNeu["sitemap.json"] = JSON.stringify({ seiten: reihe.map((id) => ({ id, pfad: pfad(id), datei: quelle[id] })) }, null, 1) + "\n";

fs.mkdirSync(AUS, { recursive: true });
let veraltet = 0;
for (const [name, inhalt] of Object.entries(dateienNeu)) {
  const ziel = path.join(AUS, name);
  const alt = fs.existsSync(ziel) ? fs.readFileSync(ziel, "utf8") : null;
  if (alt !== inhalt) {
    veraltet++;
    if (!NUR_PRUEFEN) fs.writeFileSync(ziel, inhalt);
  }
}
// verwaiste Fragmente entfernen
for (const f of fs.readdirSync(AUS)) {
  if (!(f in dateienNeu)) { veraltet++; if (!NUR_PRUEFEN) fs.unlinkSync(path.join(AUS, f)); }
}
if (NUR_PRUEFEN) {
  console.log(veraltet ? veraltet + " Datei(en) in app/static/seo sind nicht aktuell: node scripts/seo_bauen.mjs" : "app/static/seo ist aktuell.");
  process.exit(veraltet ? 1 : 0);
}
console.log(reihe.length + " Seiten gebaut, " + veraltet + " Datei(en) geschrieben.");
