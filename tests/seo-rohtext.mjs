// Rohtext ohne JavaScript: jede Seite per fetch auf Pflichtelemente pruefen (so sieht ein Crawler die Seite).
// Aufruf:  LABOR_URL=https://<jetson>:8443 node tests/seo-rohtext.mjs
//          lokal mit OEFFENTLICHE_URL:  LABOR_URL=http://127.0.0.1:8765 SEO_BASIS=https://ki-labor.daniel-alisch.site node tests/seo-rohtext.mjs
import assert from "node:assert/strict";
import { pruefeLd } from "./seo-ld-pruefung.mjs";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const BASIS = (process.env.LABOR_URL || "https://localhost:8443").replace(/\/$/, "");
// Basis der Adressen im JSON-LD (OEFFENTLICHE_URL des Dienstes), wenn der Test lokal gegen eine andere Adresse laeuft
const LD_BASIS = (process.env.SEO_BASIS || BASIS).replace(/\/$/, "");
let probleme = 0;
const meld = (id, text) => { probleme++; console.log(`  [${id}] ${text}`); };

const start = await fetch(BASIS + "/");
const html0 = await start.text();
const intern = /noindex/.test(start.headers.get("x-robots-tag") || "");
const ids = [...html0.matchAll(/<a class="nav" href="\/([a-z0-9-]*)"/g)].map((m) => m[1] || "start");
assert.ok(ids.length > 40, "Linkliste der Navigation im Rohtext: " + ids.length);

const titel = new Set();
for (const id of ids) {
  const r = await fetch(BASIS + (id === "start" ? "/" : "/" + id));
  const t = await r.text();
  if (r.status !== 200) { meld(id, "Status " + r.status); continue; }
  const m = (re) => (t.match(re) || [])[1];
  const ti = m(/<title>([^<]+)<\/title>/);
  const be = m(/<meta name="description" content="([^"]+)"/);
  if (!ti) meld(id, "kein title"); else titel.add(ti);
  if (!be) meld(id, "keine description"); else if (be.length > 160) meld(id, "description laenger als 160: " + be.length);
  if (!/<link rel="canonical" href="https?:\/\/[^"]+">/.test(t)) meld(id, "kein canonical");
  if (!/<meta property="og:locale" content="de_DE">/.test(t)) meld(id, "kein og:locale");
  if (!/<meta name="author" content="Daniel Alisch">/.test(t)) meld(id, "kein author");
  const ld = pruefeLd(t, LD_BASIS);
  for (const p of ld.probleme) meld(id, "JSON-LD: " + p);
  const soll = id === "start" ? ["WebSite", "Person", "Course", "ItemList", "DefinedTermSet", "BreadcrumbList"]
    : id === "ueber" ? ["WebSite", "Person", "Article", "LearningResource", "BreadcrumbList", "AboutPage"] : ["WebSite", "Person", "Article", "LearningResource", "BreadcrumbList"];
  for (const k of soll) if (!ld.typen.includes(k)) meld(id, "JSON-LD ohne " + k);
  // Autor als Entitaet: Article verweist per @id auf den Person-Knoten (Aufloesung prueft seo-ld-pruefung.mjs)
  if (id !== "start" && !/"author":\{"@id":"https:\/\/[^"]+#person"\}/.test(t.replace(/\s/g, ""))) meld(id, "kein JSON-LD mit Autor (@id-Verweis)");
  // Antwort zuerst: zitierfaehige Kurzfassung direkt nach dem h1
  const kg = (t.match(/<\/h1><p class="kurzgesagt"><strong>Kurz gesagt:<\/strong> ([^<]+)<\/p>/) || [])[1];
  if (!kg) meld(id, "keine Kurzfassung direkt nach dem h1");
  else if (kg.length > 360 || (kg.match(/[.!?](\s|$)/g) || []).length < 2) meld(id, "Kurzfassung nicht 2 bis 3 Saetze: " + kg.length + " Zeichen");
  // Open Graph und X: Vorschaubild 1200 x 630 mit Textalternative
  const og = (n) => m(new RegExp('<meta property="' + n + '" content="([^"]+)"'));
  const bildUrl = og("og:image");
  if (!bildUrl || !/^https?:\/\/.+\.png$/.test(bildUrl)) meld(id, "kein og:image");
  else {
    const br = await fetch(BASIS + new URL(bildUrl).pathname);
    if (br.status !== 200 || !/image\/png/.test(br.headers.get("content-type") || "")) meld(id, "og:image nicht abrufbar: " + br.status);
  }
  if (og("og:image:width") !== "1200" || og("og:image:height") !== "630") meld(id, "og:image Maße");
  if (!og("og:image:alt")) meld(id, "kein og:image:alt");
  if (!/<meta name="twitter:card" content="summary_large_image">/.test(t)) meld(id, "twitter:card nicht summary_large_image");
  if (!m(/<meta name="twitter:image" content="([^"]+)"/)) meld(id, "kein twitter:image");
  if (!/<link rel="alternate" hreflang="de" href="https?:\/\/[^"]+">/.test(t)) meld(id, "kein hreflang de");
  const llmsLink = /<link rel="alternate" type="text\/plain" href="[^"]+\/llms\.txt"/.test(t);
  if (intern === llmsLink) meld(id, intern ? "llms.txt-Link im internen Modus" : "kein llms.txt-Link");
  if (ti && ti.length > 60) meld(id, "title laenger als 60: " + ti.length);
  if (be && be.length < 120) meld(id, "description kuerzer als 120: " + be.length);
  if ((t.match(/<h1\b/g) || []).length !== 1) meld(id, "nicht genau ein h1");
  if (!/<h1>[^<]+<\/h1>/.test(t)) meld(id, "kein h1");
  if (id !== "start" && !/<h2 class="abs">/.test(t)) meld(id, "keine Abschnitte");
  if (!/<footer[^>]*>[\s\S]*Ein Projekt von[\s\S]*<\/footer>/.test(t)) meld(id, "keine Fusszeile");
  const haupt = (t.match(/<main[\s\S]*?<\/main>/) || [""])[0];
  if (/\[\[|\]\]|\{\{|\}\}/.test(haupt)) meld(id, "Rohmarkierung im Text");
  if (/[–—]/.test(haupt)) meld(id, "Gedankenstrich im Text");
  if (/href="#\//.test(haupt)) meld(id, "Link der Form #/ im Fragment");
  const robots = intern ? /<meta name="robots" content="noindex,nofollow">/ : /<meta name="robots" content="index,follow">/;
  if (!robots.test(t)) meld(id, "falsche robots-Angabe");
  for (const l of haupt.matchAll(/<a href="\/([a-z0-9-]*)"/g)) if (!ids.includes(l[1] || "start")) meld(id, "Link auf unbekannte Seite: " + l[1]);
}
if (titel.size !== ids.length) meld("alle", "Titel nicht eindeutig: " + titel.size + " von " + ids.length);

const robots = await (await fetch(BASIS + "/robots.txt")).text();
const sm = await fetch(BASIS + "/sitemap.xml");
if (intern) {
  if (!/Disallow: \/\n/.test(robots)) meld("robots", "intern muss alles sperren");
  if (sm.status === 200 && /<loc>/.test(await sm.text())) meld("sitemap", "intern darf keine Adressen listen");
} else {
  if (/Disallow: \/\n/.test(robots) || !/Sitemap: https?:\/\//.test(robots)) meld("robots", "oeffentlich: Seiten freigeben, Sitemap nennen");
  const x = await sm.text();
  if (sm.status !== 200 || (x.match(/<loc>/g) || []).length !== ids.length) meld("sitemap", "Sitemap passt nicht zur Navigation");
  if ((x.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length !== ids.length) meld("sitemap", "lastmod fehlt bei einer Seite");
  if (!/<image:loc>[^<]+\.png<\/image:loc>/.test(x) || !/<video:content_loc>[^<]+\.mp4<\/video:content_loc>/.test(x)) meld("sitemap", "keine Bild- oder Videoeintraege");
  if (/__BASIS__/.test(x)) meld("sitemap", "Platzhalter nicht ersetzt");
  for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot", "OAI-SearchBot"]) {
    if (!new RegExp("User-agent: " + bot + "\\nAllow: /\\nDisallow: /api/\\nDisallow: /ws/").test(robots)) meld("robots", bot + " nicht ausdruecklich erlaubt");
  }
  const lk = await fetch(BASIS + "/llms.txt"), lv = await fetch(BASIS + "/llms-full.txt");
  const lkt = await lk.text(), lvt = await lv.text();
  if (lk.status !== 200 || !/^# KI-Labor\n\n> /.test(lkt) || (lkt.match(/^- \[[^\]]+\]\(https?:\/\/[^)]+\): .+$/gm) || []).length < ids.length - 1) meld("llms.txt", "Gliederung unvollstaendig");
  if (lv.status !== 200 || (lvt.match(/^Adresse: https?:\/\//gm) || []).length < ids.length - 1 || !/^Frage: /m.test(lvt) || !/^# Glossar$/m.test(lvt)) meld("llms-full.txt", "Kerntexte unvollstaendig");
  if (/__BASIS__/.test(lkt + lvt)) meld("llms", "Platzhalter nicht ersetzt");
  if (/[–—]/.test(lkt + lvt)) meld("llms", "Gedankenstrich");
  if (!/^## Optional$/m.test(lkt) || !/^Autor und Herausgeber: /m.test(lkt) || !/^Lizenz der Inhalte: /m.test(lkt)) meld("llms.txt", "Optional, Autor oder Lizenz fehlt");
}
const f404 = await fetch(BASIS + "/gibt-es-nicht-xyz");
if (f404.status !== 404 || !/noindex/.test(f404.headers.get("x-robots-tag") || "") || !/<meta name="robots" content="noindex,nofollow">/.test(await f404.text())) meld("404", "404-Seite mit Status 404 und noindex erwartet");
if (!intern && !ids.includes("ueber")) meld("ueber", "Seite Ueber das Labor fehlt in der Navigation");
if (intern) for (const u of ["/llms.txt", "/llms-full.txt"]) if ((await fetch(BASIS + u)).status !== 404) meld(u, "intern muss 404 liefern");
const cs = await fetch(BASIS + "/static/app.js?v=1");
if (!/immutable/.test(cs.headers.get("cache-control") || "")) meld("cache", "statische Datei mit Versionsparameter ohne immutable");
const gz = await fetch(BASIS + "/static/content.js?v=1", { headers: { "accept-encoding": "gzip" } });
if (!/gzip/.test(gz.headers.get("content-encoding") || "")) meld("kompression", "kein gzip fuer content.js");
console.log(`${ids.length} Seiten im Rohtext geprueft (${intern ? "intern, noindex" : "oeffentlich"}), ${probleme} Probleme.`);
process.exit(probleme ? 1 : 0);
