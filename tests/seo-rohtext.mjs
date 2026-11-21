// Rohtext ohne JavaScript: jede Seite per fetch auf Pflichtelemente pruefen (so sieht ein Crawler die Seite).
// Aufruf:  LABOR_URL=https://<jetson>:8443 node tests/seo-rohtext.mjs
import assert from "node:assert/strict";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const BASIS = (process.env.LABOR_URL || "https://localhost:8443").replace(/\/$/, "");
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
  if (!/<script type="application\/ld\+json">\{.*"author".*\}<\/script>/.test(t)) meld(id, "kein JSON-LD mit Autor");
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
}
console.log(`${ids.length} Seiten im Rohtext geprueft (${intern ? "intern, noindex" : "oeffentlich"}), ${probleme} Probleme.`);
process.exit(probleme ? 1 : 0);
