// Prueft JSON-LD einer Seite lokal (ohne Netz): parsebar, @context/@type, Pflichtfelder je Typ, absolute Adressen.
// Genutzt von seo-rohtext.mjs; einzeln: node tests/seo-ld-pruefung.mjs <Datei.html>
import fs from "node:fs";

const ISO_DAUER = /^PT(\d+H)?(\d+M)?(\d+S)?$/;
const DATUM = /^\d{4}-\d{2}-\d{2}$/;
const typen = (k) => [].concat(k["@type"] || []);
const hat = (k, ...felder) => felder.filter((f) => k[f] === undefined || k[f] === null || k[f] === "" || (Array.isArray(k[f]) && !k[f].length));

/** Liefert { typen: [..], probleme: [..] } fuer alle ld+json-Elemente des HTML-Textes. */
export function pruefeLd(html, basis) {
  const probleme = [], gefunden = [];
  const bloecke = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!bloecke.length) return { typen: [], probleme: ["kein JSON-LD"] };
  for (const roh of bloecke) {
    let ld;
    try { ld = JSON.parse(roh); } catch (e) { probleme.push("JSON-LD nicht parsebar: " + e.message); continue; }
    if (ld["@context"] !== "https://schema.org") probleme.push("@context fehlt oder falsch");
    const knoten = ld["@graph"] || [ld];
    for (const k of knoten) {
      const t = typen(k);
      if (!t.length) { probleme.push("Knoten ohne @type"); continue; }
      gefunden.push(...t);
      const fehlt = [];
      if (t.includes("Article")) fehlt.push(...hat(k, "headline", "author", "publisher", "datePublished", "dateModified", "image", "inLanguage", "mainEntityOfPage"));
      if (t.includes("LearningResource")) fehlt.push(...hat(k, "name", "inLanguage", "isAccessibleForFree", "educationalLevel", "learningResourceType"));
      if (t.includes("WebSite")) fehlt.push(...hat(k, "name", "url", "inLanguage"));
      if (t.includes("Course")) fehlt.push(...hat(k, "name", "description", "provider"));
      if (t.includes("CollectionPage")) fehlt.push(...hat(k, "name", "url", "mainEntity"));
      if (t.includes("ItemList")) { fehlt.push(...hat(k, "name", "itemListElement")); (k.itemListElement || []).forEach((e, i) => { if (e.position !== i + 1 || !e.name || !e.url) probleme.push("ItemList " + k.name + ": Eintrag " + (i + 1) + " unvollstaendig"); }); }
      if (t.includes("DefinedTermSet")) { fehlt.push(...hat(k, "name", "hasDefinedTerm")); for (const d of k.hasDefinedTerm || []) if (!d.name || !d.description) probleme.push("DefinedTerm ohne Name oder Beschreibung: " + d.name); }
      if (t.includes("BreadcrumbList")) {
        const l = k.itemListElement || [];
        if (!l.length) fehlt.push("itemListElement");
        l.forEach((e, i) => { if (e.position !== i + 1 || !e.name || !e.item) probleme.push("Breadcrumb Eintrag " + (i + 1) + " unvollstaendig"); });
      }
      if (t.includes("VideoObject")) {
        fehlt.push(...hat(k, "name", "description", "thumbnailUrl", "uploadDate", "duration", "contentUrl", "transcript"));
        if (k.duration && !ISO_DAUER.test(k.duration)) probleme.push("VideoObject duration nicht ISO 8601: " + k.duration);
        if (k.uploadDate && !DATUM.test(k.uploadDate)) probleme.push("VideoObject uploadDate: " + k.uploadDate);
      }
      if (t.includes("FAQPage")) {
        if (!(k.mainEntity || []).length) fehlt.push("mainEntity");
        for (const q of k.mainEntity || []) if (q["@type"] !== "Question" || !q.name || !q.acceptedAnswer || !q.acceptedAnswer.text) probleme.push("FAQ: Frage ohne Antwort: " + q.name);
      }
      if (fehlt.length) probleme.push(t.join("/") + ": fehlt " + fehlt.join(", "));
    }
    const text = JSON.stringify(ld);
    if (/__BASIS__/.test(text)) probleme.push("Platzhalter __BASIS__ nicht ersetzt");
    if (/"(url|item|contentUrl|thumbnailUrl|image|@id)":"(?!https?:\/\/)\//.test(text)) probleme.push("relative Adresse im JSON-LD");
    if (basis && /"(url|contentUrl|thumbnailUrl)":"https?:\/\//.test(text)) {
      for (const m of text.matchAll(/"(?:contentUrl|thumbnailUrl)":"(https?:\/\/[^"]+)"/g)) if (!m[1].startsWith(basis)) probleme.push("Adresse nicht unter der Basis: " + m[1]);
    }
    for (const d of text.matchAll(/(?:datePublished|dateModified)":"([^"]+)"/g)) if (!DATUM.test(d[1])) probleme.push("Datum nicht ISO: " + d[1]);
  }
  return { typen: [...new Set(gefunden)], probleme };
}

if (process.argv[1] && process.argv[1].endsWith("seo-ld-pruefung.mjs") && process.argv[2]) {
  const r = pruefeLd(fs.readFileSync(process.argv[2], "utf8"), process.argv[3]);
  console.log(r.typen.join(", ") || "-", r.probleme.length ? "\n" + r.probleme.join("\n") : "ok");
  process.exit(r.probleme.length ? 1 : 0);
}
