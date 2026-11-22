// Erzeugt aus den Inhaltsdateien (content.js und die in module.json genannten content-*.js) die Fragmente
// fuer Suchmaschinen: app/static/seo/<id>.html, nav.html, index.json, sitemap.json.
// Der Server setzt das Fragment in die Oberflaeche ein (Rohtext ohne JavaScript lesbar).
// Aufruf:  node scripts/seo_bauen.mjs        (Ergebnis wird eingecheckt; nach jeder Inhaltsaenderung neu bauen)
//          node scripts/seo_bauen.mjs --pruefen   (baut nichts, meldet nur, ob die Dateien aktuell sind)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { WURZEL, STATIC, moduleJson as module, INHALT, quelle, visualAlt, bereichKennung, klar } from "./inhalt.mjs";

const AUS = path.join(STATIC, "seo");
const NUR_PRUEFEN = process.argv.includes("--pruefen");
const TITEL_ENDE = " · KI-Labor";
const IDS = new Set(Object.keys(INHALT.seiten));

/* ---------------------------------------------------------------- Markierungen (gleiche Regeln wie md() in app.js) */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pfad = (id) => (id === "start" ? "/" : "/" + id);
const LINK_OK = /^(?:https:\/\/[^\s"'<>*`\\]+|\/(?!\/)[^\s"'<>*`\\]*)$/;   // gleiche Regel wie LINK_OK in app.js
const LINK_RE = /\[([^\[\]]+)\]\(([^()\s]+)\)/g;
function md(t) {
  let s = esc(t);
  const links = [];
  s = s.replace(LINK_RE, (m, text, url) => {
    if (!LINK_OK.test(url)) return text;
    links.push('<a href="' + url + '"' + (url.startsWith("https://") ? ' rel="noopener noreferrer"' : "") + ">" + text + "</a>");
    return "\u0001" + (links.length - 1) + "\u0001";
  });
  s = s.replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, k, anzeige) => {
    const g = INHALT.glossar[k];
    return anzeige || (g ? g[0] : k);
  });
  s = s.replace(/\{\{([a-z0-9-]+)(\?[a-z0-9_=&-]+)?\|([^}]+)\}\}/g, (m, id, abfrage, text) => (IDS.has(id) ? '<a href="' + pfad(id) + (abfrage || "") + '">' + text + "</a>" : text));
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  return s.replace(/\u0001(\d+)\u0001/g, (m, i) => links[+i]);
}
/** Saetze eines Textes (ohne Markierungen); Abkuerzungen wie "z. B." trennen nicht. */
function saetze(t) {
  const geschuetzt = klar(t).replace(/\s+/g, " ").trim().replace(/\b(z|d|u|v|i|o|s|bzw|ca|etc|vgl|Nr)\. ?(?=[A-Za-zÄÖÜ]\.|[a-zäöü])/g, (m) => m.replace(/\. ?/, ".\u0001"));
  return geschuetzt.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ0-9„"(])/).map((x) => x.replace(/\u0001/g, " ").trim()).filter(Boolean);
}
function kuerzen(t, max) {
  if (t.length <= max) return t;
  const k = t.slice(0, max - 1);
  return k.slice(0, k.lastIndexOf(" ")).replace(/[,;:.]+$/, "") + "…";
}
/** Meta-Beschreibung 120 bis 160 Zeichen: Saetze der Reihe nach (kurz, Abschnitts-Leads, Kernaussagen), soweit sie passen. */
function beschreibungAus(s) {
  const kand = [...saetze(s.kurz)];
  for (const a of s.abschnitte || []) if (a.kurz) kand.push(...saetze(a.kurz));
  for (const m of s.mitnehmen || []) kand.push(...saetze(m));
  for (const p of s.pfad || []) kand.push(...saetze(p.p));
  let text = "";
  for (const k of kand) {
    const neu = text ? text + " " + k : k;
    if (neu.length <= 160) text = neu;
    else if (text.length >= 120) break;
  }
  if (text.length < 120 && s.typ === "labor" && s.gruppe) {       // Labore ohne Abschnitte: Art und Bereich nennen
    const mit = text + " Interaktiver Versuch im Bereich " + s.gruppe + ".";
    if (mit.length <= 160) text = mit;
  }
  return kuerzen(text || kand[0] || "", 160);
}
/** Zitierfaehige Kurzfassung (2 bis 3 Saetze) fuer den Anfang der Seite, nur aus vorhandenen Feldern:
 *  zusammenfassung (falls gesetzt), sonst "Das nimmst du mit", Merksaetze und die Leitsaetze der Abschnitte; der erste
 *  Satz von "Im Business" nur, wenn sonst zu wenig da ist. Jeder Text wird von vorn gelesen; faellt ein Satz heraus,
 *  entfaellt der Rest dieses Textes (Folgesaetze beziehen sich oft auf ihn). Heraus fallen Fragen, Saetze aus dem Lead
 *  (kurz), Checklisten, Verweise auf andere Seiten und ein Anfang, der sich auf Vorheriges bezieht. Fehlt Stoff,
 *  stellen sich Aussagesaetze des Leads davor. Hoechstens 360 Zeichen. */
const ZF_MAX = 360;
const BEZUG = /^(Dies|Diese[rsmn]?|Darum|Danach|Dort|Dann|Deshalb|Daher|Damit|Dabei|Dafür|Dazu|Sonst|Außerdem|Auch|Beides|Beide|Sie|Er|Es)\b|^Das (ist|heißt|klappt|kostet|gilt|reicht|geht)\b|\bdas alles\b/;
function zusammenfassungAus(s) {
  if (s.zusammenfassung) return klar(s.zusammenfassung).replace(/\s+/g, " ").trim();
  const lead = saetze(s.kurz || "");
  const norm = (x) => x.toLowerCase().replace(/[^a-zäöüß0-9]+/g, " ").trim();
  const imLead = new Set(lead.map(norm));
  const aussage = (x) => !/\?$/.test(x) && x.length >= 25 && !/^Checkliste\b/.test(x) && !/\b(steht|stehen) auf (der|den) Seiten?\b|^Mehr (zu|dazu)\b/.test(x);
  const gruppen = [
    ...(s.mitnehmen || []),
    ...(s.abschnitte || []).filter((a) => a.merke).map((a) => a.merke),
    ...(s.abschnitte || []).filter((a) => a.kurz).map((a) => a.kurz),
  ];
  const gewaehlt = [];
  let laenge = 0;
  const passt = (x) => aussage(x) && !imLead.has(norm(x)) && !gewaehlt.some((g) => norm(g) === norm(x)) && laenge + x.length + 1 <= ZF_MAX;
  const lesen = (text) => {
    let erster = true;
    for (const x of saetze(text)) {
      if (gewaehlt.length >= 3) return;
      if (!passt(x) || (erster && BEZUG.test(x))) return;
      gewaehlt.push(x); laenge += x.length + 1; erster = false;
    }
  };
  for (const g of gruppen) lesen(g);
  if (gewaehlt.length < 2 && s.business && s.business.text) lesen(saetze(s.business.text)[0] || "");
  // zu wenig Stoff: Aussagesaetze des Leads stellen sich davor (Reihenfolge wie auf der Seite)
  const davor = [];
  for (const l of lead) {
    if (gewaehlt.length + davor.length >= 2) break;
    if (aussage(l) && !BEZUG.test(l) && laenge + l.length + 1 <= ZF_MAX) { davor.push(l); laenge += l.length + 1; }
  }
  return [...davor, ...gewaehlt].join(" ");
}
/** Titel hoechstens 60 Zeichen: "<Titel> · KI-Labor", sonst (zu lang oder Marke schon im Titel) nur der Titel. */
function titelMitMarke(t) {
  return kuerzen(t.length + TITEL_ENDE.length <= 60 && !t.includes("KI-Labor") ? t + TITEL_ENDE : t, 60);
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
/** Breite und Hoehe einer lokalen JPEG- oder PNG-Datei (feste Maße gegen Layoutsprünge); null, wenn unlesbar. */
function masse(src) {
  try {
    const b = fs.readFileSync(path.join(STATIC, src.replace(/^\/?static\//, "")));
    if (b[0] === 0x89 && b[1] === 0x50) return [b.readUInt32BE(16), b.readUInt32BE(20)];
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const t = b[i + 1];
      if (t >= 0xc0 && t <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(t)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + b.readUInt16BE(i + 2);
    }
  } catch { /* Datei fehlt: ohne Maße */ }
  return null;
}
/** Richtige Antwort samt Erklaerung hinter der Quizfrage (im Rohtext lesbar; die Oberflaeche ersetzt das beim Start). */
function antwort(f) {
  const r = quizAntwort(f);
  return r ? '<details class="quiz-antwort"><summary>Antwort</summary><p>' + md(r) + "</p></details>" : "";
}
/** "Richtige Option. Erklaerung" einer Quizfrage, nur wenn Frage, richtige Option und Erklaerung vorhanden sind. */
function quizAntwort(f) {
  const o = f && Array.isArray(f.optionen) ? f.optionen[f.richtig] : null;
  if (!f || !f.frage || !o || !f.erklaerung) return "";
  return String(o).replace(/[.!?]$/, "") + ". " + f.erklaerung;
}

/** Bild als <figure> mit Textalternative (Liste der Beschriftungen); quelle als <img> mit alt. Ungueltiges entfaellt. */
function bild(v) {
  if (Array.isArray(v)) return v.map(bild).join("");
  const a = visualAlt(v);
  if (!a) return "";
  if (v.typ === "quelle") {
    const src = String(v.src || "");
    if (!/^(\/static\/|static\/)[A-Za-z0-9_\-./]+$/.test(src) || src.includes("..")) return "";
    const m = masse(src);
    return '<figure class="visual"><img src="' + esc(src) + '" alt="' + esc(v.alt || "") + '"' + (m ? ' width="' + m[0] + '" height="' + m[1] + '"' : "") + ' loading="lazy" decoding="async">' + (v.unter ? "<figcaption>" + esc(v.unter) + "</figcaption>" : "") + "</figure>";
  }
  if (!a.eintraege.length) return "";
  return '<figure class="visual"><figcaption>' + esc(a.titel) + "</figcaption><ul>" + a.eintraege.map((t) => "<li>" + esc(t) + "</li>").join("") + "</ul></figure>";
}
const liste = (l) => "<ul>" + l.map((x) => "<li>" + md(x) + "</li>").join("") + "</ul>";

/** Antwort zuerst: die Kurzfassung direkt nach dem h1 (fuer Suchmaschinen und KI-Antworten zitierfaehig). */
function kurzGesagt(s) {
  const z = zusammenfassungAus(s);
  return z ? '<p class="kurzgesagt"><strong>Kurz gesagt:</strong> ' + esc(z) + "</p>" : "";
}
function fragment(id) {
  const s = INHALT.seiten[id];
  const o = [];
  if (s.typ === "start") {
    o.push('<div class="seitenbreite"><p class="ueber">KI-Labor auf dem Jetson</p>');
    o.push("<h1>" + md(s.titel) + "</h1>" + kurzGesagt(s) + '<p class="lead">' + md(s.kurz) + "</p>");
    o.push('<section class="block"><h2>Dein Lernpfad</h2><div class="flaeche pad"><ol class="pfad">' +
      s.pfad.map((p) => "<li><h3>" + (IDS.has(p.id) ? '<a href="' + pfad(p.id) + '">' + esc(p.h) + "</a>" : esc(p.h)) + "</h3><p>" + md(p.p) + "</p></li>").join("") +
      "</ol></div></section>");
    if (s.datenschutz) o.push('<section class="block"><h2>Datenschutz</h2><div class="text"><p>' + md(s.datenschutz) + "</p></div></section>");
    o.push("</div>");
    return o.join("\n");
  }
  const art = s.typ === "lektion" ? "Lektion" + (s.nr ? " " + s.nr : "") : "Labor";
  const ueber = s.typ === "lektion" && s.gruppe === "Grundlagen" ? "Grundlagen · " + art : s.gruppe;
  o.push('<div class="seitenbreite"><p class="ueber">' + esc(ueber) + "</p><h1>" + md(s.titel) + "</h1>" + kurzGesagt(s) + '<p class="lead">' + md(s.kurz) + "</p>");
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
    o.push('<section class="block quiz"><h2>Teste dich</h2><ol>' + s.quiz.map((f) => "<li>" + md(f.frage) + antwort(f) + "</li>").join("") + "</ol></section>");
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

/* ---------------------------------------------------------------- Stammdaten: Reihenfolge, Gruppen, Daten, Videos, Bilder */
const BASIS = "__BASIS__";            // der Server ersetzt das durch OEFFENTLICHE_URL bzw. die aufgerufene Adresse
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
const bereiche = INHALT.seiten.start.bereiche || {};
const gruppeVon = (id) => index.gruppen.find((g) => g.seiten.includes(id));
const url = (id) => BASIS + (id === "start" ? "/" : "/" + id);

// Datum aus Git (letzte und erste Aenderung der Datei). Hat die Datei nicht eingecheckte Aenderungen (oder ist neu), gilt
// der heutige Tag: genau dieses Datum traegt der Commit, der sie heute eincheckt; danach bleibt --pruefen stabil.
// Ohne Git-Verlauf ebenfalls der heutige Tag (Ortszeit wie %cs).
const heute = new Date().toLocaleDateString("sv-SE");
const gitCache = {};
const git = (args) => execFileSync("git", args, { cwd: WURZEL, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
function gitDaten(rel) {
  if (!(rel in gitCache)) {
    let l = [], offen = false;
    try {
      l = git(["log", "--format=%cs", "--follow", "--", rel]).trim().split("\n").filter(Boolean);
      offen = git(["status", "--porcelain", "--", rel]).trim() !== "";
    } catch { /* kein Git */ }
    gitCache[rel] = { neu: offen ? heute : l[0] || heute, alt: l[l.length - 1] || heute };
  }
  return gitCache[rel];
}
const geaendert = (id) => gitDaten("app/static/" + quelle[id]).neu;
const veroeffentlicht = (id) => gitDaten("app/static/" + quelle[id]).alt;

// Autor als Entitaet (module.json -> seite): eine Person mit fester @id. Die @id ist dieselbe wie im JSON-LD der Hauptseite
// (autor_url + "/#person"), damit Suchmaschinen beide Seiten derselben Person zuordnen. sameAs: seite.autor_profile
// (nur Profile, die auf der Hauptseite verlinkt sind). Jede Seite enthaelt den Personen-Knoten einmal, alle anderen
// Knoten verweisen per @id darauf (author, publisher, provider, copyrightHolder).
const seiteInfo = module.seite || {};
const frei = (u) => (typeof u === "string" && /^https?:\/\//.test(u) ? u : "");
const profile = (Array.isArray(seiteInfo.autor_profile) ? seiteInfo.autor_profile : []).filter(frei);
const PERSON = seiteInfo.autor
  ? { "@type": "Person", "@id": frei(seiteInfo.autor_url) ? seiteInfo.autor_url.replace(/\/?$/, "/") + "#person" : BASIS + "/#autor", name: seiteInfo.autor,
      ...(frei(seiteInfo.autor_url) ? { url: seiteInfo.autor_url } : {}), ...(profile.length ? { sameAs: profile } : {}) }
  : null;
const PERSON_REF = PERSON ? { "@id": PERSON["@id"] } : null;
const mitPerson = (o) => (PERSON ? { ...o, author: PERSON_REF, publisher: PERSON_REF } : o);
/** Knoten, die jede Seite mitbringt: die Person und die Website (Ziel der Verweise isPartOf, author, publisher). */
const stammKnoten = (beschr) => [
  ...(PERSON ? [PERSON] : []),
  mitPerson({ "@type": "WebSite", "@id": BASIS + "/#website", name: "KI-Labor", url: BASIS + "/", inLanguage: "de",
    ...(beschr ? { description: beschr } : {}), ...(PERSON ? { copyrightHolder: PERSON_REF } : {}) }),
];

// Erklaervideos: Manifest + Untertitel (Transkript); nur Videos mit Untertiteldatei
const videoInfo = {};
try {
  for (const v of JSON.parse(fs.readFileSync(path.join(STATIC, "videos", "manifest.json"), "utf8")).videos || []) {
    const vtt = path.join(STATIC, "videos", v.id + ".vtt");
    if (!fs.existsSync(vtt)) continue;
    const text = fs.readFileSync(vtt, "utf8").split(/\r?\n/)
      .filter((l) => l.trim() && l.trim() !== "WEBVTT" && !/-->/.test(l) && !/^\d+$/.test(l.trim()) && !/^(NOTE|STYLE)\b/.test(l)).join(" ").replace(/\s+/g, " ").trim();
    videoInfo[v.id] = { ...v, text, datum: gitDaten("app/static/videos/" + v.id + ".vtt").alt };
  }
} catch { /* kein Manifest: keine Videos */ }
const videosVon = (s) => (s.videos || (s.video ? [s.video] : [])).filter((v) => videoInfo[v]).map((v) => videoInfo[v]);
const iso = (sek) => { const t = Math.round(sek); return "PT" + (t >= 3600 ? Math.floor(t / 3600) + "H" : "") + Math.floor((t % 3600) / 60) + "M" + (t % 60) + "S"; };

// Vorschaubilder (scripts/og_bauen.mjs): je Bereich eins, sonst das Standardbild
if (!fs.existsSync(path.join(STATIC, "og", "standard.png"))) { console.error("app/static/og/standard.png fehlt: node scripts/og_bauen.mjs"); process.exit(2); }
function bildVon(id) {
  const g = gruppeVon(id);
  const k = g && g.name !== "Start" && fs.existsSync(path.join(STATIC, "og", bereichKennung(g.name) + ".png")) ? bereichKennung(g.name) : "standard";
  const satz = k === "standard" ? "" : (bereiche[g.name] || {}).satz;
  return {
    pfad: "/static/og/" + k + ".png",
    alt: k === "standard" ? "KI-Labor: KI verstehen, indem du sie ausprobierst. Lernpfad, Labore und Erklärvideos zu künstlicher Intelligenz."
      : "KI-Labor, Bereich " + g.name + (satz ? ": " + satz : ""),
  };
}

// Begriffe des Glossars, die eine Seite verwendet ([[schluessel]])
const begriffe = (s) => [...new Set([...JSON.stringify(s).matchAll(/\[\[([a-z0-9-]+)(?:\||\]\])/g)].map((m) => m[1]))].filter((k) => INHALT.glossar[k]);
const begriffKnoten = (k) => ({ "@type": "DefinedTerm", "@id": BASIS + "/#begriff-" + k, name: INHALT.glossar[k][0] });

/* ---------------------------------------------------------------- Strukturierte Daten (JSON-LD, nur aus vorhandenen Daten) */
function videoKnoten(v) {
  const b = BASIS + "/static/videos/" + v.id;
  const kap = v.kapitel || [];
  return mitPerson({
    "@type": "VideoObject", "@id": b + "#video", name: v.titel,
    description: v.untertitel + "." + (kap.length ? " Kapitel: " + kap.map((k) => k.titel).join(", ") + "." : ""),
    thumbnailUrl: b + ".jpg", uploadDate: v.datum, duration: iso(v.dauer_s), contentUrl: b + ".mp4", encodingFormat: "video/mp4",
    inLanguage: "de", isAccessibleForFree: true, transcript: v.text,
    ...(kap.length ? { hasPart: kap.map((k, i) => ({ "@type": "Clip", name: k.titel, startOffset: Math.floor(k.t), endOffset: Math.ceil(i + 1 < kap.length ? kap[i + 1].t : v.dauer_s), url: b + ".mp4#t=" + Math.floor(k.t) })) } : {}),
  });
}
function listeKnoten(id, name, ids) {
  return { "@type": "ItemList", "@id": BASIS + "/#" + id, name, numberOfItems: ids.length,
    itemListElement: ids.map((i, n) => ({ "@type": "ListItem", position: n + 1, name: klar(INHALT.seiten[i].titel), url: url(i) })) };
}
function ldSeite(id, beschr, bild) {
  const s = INHALT.seiten[id];
  const u = url(id);
  const kopf = { "@context": "https://schema.org" };
  const krumen = { "@type": "BreadcrumbList", "@id": u + "#breadcrumb", itemListElement: [{ "@type": "ListItem", position: 1, name: "KI-Labor", item: BASIS + "/" }] };
  if (id !== "start") krumen.itemListElement.push({ "@type": "ListItem", position: 2, name: klar(s.titel), item: u });
  const graph = [];
  if (id === "start") {
    const ids = index.gruppen.flatMap((g) => g.seiten).filter((i) => i !== "start");
    graph.push(...stammKnoten(beschr));
    graph.push(mitPerson({
      "@type": "CollectionPage", "@id": u + "#seite", name: klar(s.titel), url: u, description: beschr, inLanguage: "de",
      isPartOf: { "@id": BASIS + "/#website" }, breadcrumb: { "@id": u + "#breadcrumb" }, primaryImageOfPage: BASIS + bild.pfad,
      mainEntity: { "@id": BASIS + "/#kurs" }, datePublished: veroeffentlicht(id), dateModified: geaendert(id), abstract: zusammenfassungAus(s) || undefined,
    }));
    graph.push(mitPerson({
      "@type": "Course", "@id": BASIS + "/#kurs", name: "KI-Labor: Lernpfad zu künstlicher Intelligenz", description: klar(s.kurz), url: u, inLanguage: "de",
      isAccessibleForFree: true, educationalLevel: "Einsteiger", provider: PERSON_REF || undefined, hasPart: { "@id": BASIS + "/#lernpfad" },
      hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
      teaches: index.gruppen.filter((g) => g.name !== "Start").map((g) => g.name + (bereiche[g.name] ? ": " + klar(bereiche[g.name].satz) : "")),
    }));
    graph.push({ "@type": "ItemList", "@id": BASIS + "/#lernpfad", name: "Dein Lernpfad", numberOfItems: (s.pfad || []).length,
      itemListElement: (s.pfad || []).filter((p) => IDS.has(p.id)).map((p, n) => ({ "@type": "ListItem", position: n + 1, name: p.h, description: klar(p.p), url: url(p.id) })) });
    for (const g of index.gruppen) if (g.name !== "Start") graph.push(listeKnoten("bereich-" + bereichKennung(g.name), g.name, g.seiten));
    graph.push({ "@type": "DefinedTermSet", "@id": BASIS + "/#glossar", name: "Glossar des KI-Labors", inLanguage: "de", url: BASIS + "/",
      hasDefinedTerm: Object.entries(INHALT.glossar).map(([k, g]) => ({ "@type": "DefinedTerm", "@id": BASIS + "/#begriff-" + k, termCode: k, name: g[0], description: klar(g[1]), inDefinedTermSet: { "@id": BASIS + "/#glossar" } })) });
    graph.push(krumen);
    return { ...kopf, "@graph": JSON.parse(JSON.stringify(graph)) };
  }
  const vids = videosVon(s);
  const gr = gruppeVon(id);
  const zf = zusammenfassungAus(s);
  const art = {
    "@type": ["Article", "LearningResource"], "@id": u + "#artikel", headline: klar(s.titel), name: klar(s.titel), description: beschr, url: u,
    mainEntityOfPage: s.ueberSeite ? { "@id": u } : { "@type": "WebPage", "@id": u }, inLanguage: "de", isAccessibleForFree: true, educationalLevel: "Einsteiger",
    learningResourceType: s.ueberSeite ? "Hintergrund" : s.typ === "labor" ? "Interaktives Labor" : "Lektion", ...(gr ? { articleSection: gr.name } : {}),
    ...(zf ? { abstract: zf } : {}), ...(PERSON ? { copyrightHolder: PERSON_REF } : {}),
    image: [BASIS + bild.pfad], datePublished: veroeffentlicht(id), dateModified: geaendert(id),
    isPartOf: [{ "@id": BASIS + "/#website" }, { "@id": BASIS + "/#kurs" }], breadcrumb: { "@id": u + "#breadcrumb" },
    ...((s.mitnehmen || []).length ? { teaches: s.mitnehmen.map(klar) } : {}),
    ...(begriffe(s).length ? { about: begriffe(s).map(begriffKnoten) } : {}),
    ...(vids.length ? { video: vids.map((v) => ({ "@id": BASIS + "/static/videos/" + v.id + "#video" })) } : {}),
  };
  graph.push(...stammKnoten(), mitPerson(art), krumen, ...vids.map(videoKnoten));
  // Seite "Ueber das Labor" (ueberSeite: true): AboutPage, deren Hauptgegenstand der Autor ist
  if (s.ueberSeite) {
    graph.push({ "@type": "AboutPage", "@id": u, name: klar(s.titel), url: u, description: beschr, inLanguage: "de",
      isPartOf: { "@id": BASIS + "/#website" }, breadcrumb: { "@id": u + "#breadcrumb" }, primaryImageOfPage: BASIS + bild.pfad,
      datePublished: veroeffentlicht(id), dateModified: geaendert(id), ...(PERSON ? { about: PERSON_REF, mainEntity: PERSON_REF } : {}) });
  }
  const fragen = (s.quiz || []).filter(quizAntwort);
  if (fragen.length) {
    graph.push({ "@type": "FAQPage", "@id": u + "#faq", inLanguage: "de", mainEntity: fragen.map((f) => ({
      "@type": "Question", name: klar(f.frage), acceptedAnswer: { "@type": "Answer", text: klar(quizAntwort(f)) } })) });
  }
  return { ...kopf, "@graph": JSON.parse(JSON.stringify(graph)) };      // undefined-Felder entfallen
}

/* ---------------------------------------------------------------- Textdateien fuer KI-Suchen: llms.txt und llms-full.txt */
// Format nach llmstxt.org: H1, Zusammenfassung als Blockzitat, kurze Absaetze, Abschnitte (H2) mit Linklisten
// "- [Titel](Adresse): Kurzbeschreibung", am Ende "## Optional" fuer Verzichtbares.
/** Kurzbeschreibung einer Seite: erster Aussagesatz des Leads (keine Frage), sonst der Kurzfassung. */
function seitenSatz(s) {
  return [...saetze(s.kurz || ""), ...saetze(zusammenfassungAus(s))].find((x) => !/\?$/.test(x)) || saetze(s.kurz || "")[0] || "";
}
function autorZeile() {
  if (!PERSON) return "";
  return "Autor und Herausgeber: " + PERSON.name + (PERSON.url ? " (" + PERSON.url + ")" : "") + "." + (profile.length ? " Profile: " + profile.join(", ") + "." : "");
}
function lizenzZeile() {
  const wer = PERSON ? PERSON.name : "der Autor";
  return "Lizenz der Inhalte: Texte und Grafiken stammen von " + wer + ", alle Rechte vorbehalten. Zitate mit Quellenangabe (Adresse der Seite) sind erlaubt. " +
    "Stimmen der Sprachausgabe, Beispielfotos und Icons stammen von Dritten und stehen unter eigenen Lizenzen" + (IDS.has("lizenzen") ? " (" + url("lizenzen") + ")" : "") + ".";
}
function llmsKurz() {
  const st = INHALT.seiten.start;
  const o = ["# KI-Labor", "", "> " + (zusammenfassungAus(st) || klar(st.kurz)), "",
    "Lektionen erklären die Grundlagen, Labore laufen live auf dem Jetson (Bilderkennung, Sprachmodell, RAG, Agent, Sprache zu Text und Text zu Sprache), Erklärvideos und Selbsttests helfen beim Wiederholen. Alle Seiten sind auf Deutsch.", "",
    ...(PERSON ? [autorZeile(), ""] : []), lizenzZeile(), ""];
  if (IDS.has("ueber")) o.push("## Über das Labor", "", "- [" + klar(INHALT.seiten.ueber.titel) + "](" + url("ueber") + "): " + seitenSatz(INHALT.seiten.ueber), "");
  for (const g of index.gruppen) {
    if (g.name === "Start") continue;
    const ids = g.seiten.filter((i) => i !== "ueber");
    if (!ids.length) continue;
    o.push("## " + g.name, "");
    if (bereiche[g.name]) o.push(klar(bereiche[g.name].satz), "");
    for (const i of ids) o.push("- [" + klar(INHALT.seiten[i].titel) + "](" + url(i) + "): " + seitenSatz(INHALT.seiten[i]));
    o.push("");
  }
  o.push("## Optional", "",
    "- [Alle Seiten mit Kernaussagen](" + BASIS + "/llms-full.txt): Kurzfassung, Abschnitte, Merksätze, Fragen und Antworten jeder Seite in einer Textdatei",
    "- [Sitemap](" + BASIS + "/sitemap.xml): alle Adressen mit Datum der letzten Änderung", "");
  return o.join("\n");
}
function llmsVoll() {
  const st = INHALT.seiten.start;
  const o = ["# KI-Labor: alle Seiten mit Kernaussagen", "", "> " + klar(st.kurz), "",
    "Quelle: " + BASIS + "/ (Autor: " + (PERSON ? PERSON.name : "unbekannt") + "). Jeder Abschnitt nennt die Adresse der Seite; bitte mit Adresse zitieren.", "",
    lizenzZeile(), ""];
  for (const g of index.gruppen) {
    for (const i of g.seiten) {
      if (i === "start") continue;
      const s = INHALT.seiten[i];
      const zf = zusammenfassungAus(s);
      o.push("# " + klar(s.titel), "", "Adresse: " + url(i), "Bereich: " + g.name + ". Stand: " + geaendert(i) + ".", "", ...(zf ? ["Kurz gesagt: " + zf, ""] : []), klar(s.kurz), "");
      for (const a of s.abschnitte || []) {
        o.push("## " + klar(a.h), "");
        if (a.kurz) o.push(klar(a.kurz), "");
        if (a.merke) o.push("Merke: " + klar(a.merke), "");
      }
      if ((s.mitnehmen || []).length) o.push("## Das nimmst du mit", "", ...s.mitnehmen.map((m) => "- " + klar(m)), "");
      const fragen = (s.quiz || []).filter(quizAntwort);
      if (fragen.length) o.push("## Fragen und Antworten", "", ...fragen.flatMap((f) => ["Frage: " + klar(f.frage), "Antwort: " + klar(quizAntwort(f)), ""]));
      for (const v of videosVon(s)) o.push("Erklärvideo: " + v.titel + " (" + Math.round(v.dauer_s / 60 * 10) / 10 + " Minuten), " + BASIS + "/static/videos/" + v.id + ".mp4, Untertitel: " + BASIS + "/static/videos/" + v.id + ".vtt", "");
    }
  }
  o.push("# Glossar", "");
  for (const [, g] of Object.entries(INHALT.glossar)) o.push("- " + g[0] + ": " + klar(g[1]));
  return o.join("\n") + "\n";
}

/* ---------------------------------------------------------------- Sitemap (mit Bild- und Videoeintraegen) */
function sitemap() {
  const z = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">'];
  for (const id of reihe) {
    const s = INHALT.seiten[id];
    const bilder = new Set([BASIS + bildVon(id).pfad]);
    for (const m of JSON.stringify(s).matchAll(/"src":"(\/static\/[A-Za-z0-9_\-./]+\.(?:jpg|png|webp))"/g)) bilder.add(BASIS + m[1]);
    const e = ["<url>", "<loc>" + esc(url(id)) + "</loc>", "<lastmod>" + geaendert(id) + "</lastmod>",
      ...[...bilder].map((b) => "<image:image><image:loc>" + esc(b) + "</image:loc></image:image>")];
    for (const v of videosVon(s)) {
      const b = BASIS + "/static/videos/" + v.id;
      e.push("<video:video><video:thumbnail_loc>" + esc(b + ".jpg") + "</video:thumbnail_loc><video:title>" + esc(v.titel) + "</video:title><video:description>" +
        esc(v.untertitel + ".") + "</video:description><video:content_loc>" + esc(b + ".mp4") + "</video:content_loc><video:duration>" + Math.round(v.dauer_s) +
        "</video:duration><video:publication_date>" + v.datum + "</video:publication_date><video:family_friendly>yes</video:family_friendly></video:video>");
    }
    e.push("</url>");
    z.push(e.join(""));
  }
  z.push("</urlset>", "");
  return z.join("\n");
}

/* ---------------------------------------------------------------- Ausgabe */
const dateienNeu = {};
for (const id of alle) {
  const s = INHALT.seiten[id];
  const beschr = beschreibungAus(s);
  const bild = bildVon(id);
  index.seiten[id] = {
    titel: titelMitMarke(klar(s.titel)),
    ueberschrift: klar(s.titel),
    beschreibung: beschr,
    typ: s.typ === "start" ? "start" : "seite",
    datei: quelle[id],
    bild: bild.pfad, bild_alt: bild.alt,
    ld: ldSeite(id, beschr, bild),
    ...(s.versteckt ? { versteckt: true } : {}),
  };
  dateienNeu[id + ".html"] = fragment(id) + "\n";
}
// Titel (hoechstens 60 Zeichen, eindeutig) und Beschreibungen (120 bis 160 Zeichen) pruefen; Ausreisser melden.
// Dieselbe Pruefung laeuft als Test: node tests/seo-titel.mjs
const hinweise = [];
const gesehen = {};
for (const [id, e] of Object.entries(index.seiten)) {
  if (e.titel.length > 60) hinweise.push(id + ": Titel " + e.titel.length + " Zeichen");
  if (e.beschreibung.length < 120 || e.beschreibung.length > 160) hinweise.push(id + ": Beschreibung " + e.beschreibung.length + " Zeichen");
  if (/…$/.test(e.titel)) hinweise.push(id + ": Titel gekuerzt");
  if (gesehen[e.titel]) hinweise.push(id + ": Titel wie " + gesehen[e.titel]); else gesehen[e.titel] = id;
}
for (const h of hinweise) console.warn("Hinweis Titel/Beschreibung: " + h);
dateienNeu["nav.html"] = navigation() + "\n";
dateienNeu["index.json"] = JSON.stringify(index, null, 1) + "\n";
dateienNeu["sitemap.xml"] = sitemap();
dateienNeu["llms.txt"] = llmsKurz() + "\n";
dateienNeu["llms-full.txt"] = llmsVoll();

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
