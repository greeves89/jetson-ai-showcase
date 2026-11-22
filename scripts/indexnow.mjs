// Meldet alle Adressen der Sitemap per IndexNow (Bing, Yandex, Seznam; ChatGPT Search nutzt den Bing-Index).
// Voraussetzung: Der Dienst laeuft oeffentlich mit OEFFENTLICH=1 und demselben INDEXNOW_KEY, dann liefert er die
// Schluesseldatei unter <Basis>/<Schluessel>.txt aus. Der Schluessel steht nur in der Umgebung, nie im Repo.
// Aufruf:  INDEXNOW_KEY=<schluessel> node scripts/indexnow.mjs [--basis https://ki-labor.daniel-alisch.site] [--probe]
//   --basis  oeffentliche Adresse (Host der Meldung, Ort der Schluesseldatei), Standard OEFFENTLICHE_URL bzw. ki-labor.daniel-alisch.site
//   --abruf  Adresse, unter der Sitemap und Schluesseldatei geholt werden (Standard: --basis), z. B. ein lokaler Dienst
//   --probe  nichts melden, nur Sitemap und Schluesseldatei pruefen und die Adressen zaehlen
// Die Sitemap wird von der laufenden Seite geholt (<Basis>/sitemap.xml), damit genau die oeffentlichen Adressen gemeldet werden.
const args = process.argv.slice(2);
const wert = (name, standard) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : standard; };
const BASIS = wert("--basis", process.env.OEFFENTLICHE_URL || "https://ki-labor.daniel-alisch.site").replace(/\/$/, "");
const PROBE = args.includes("--probe");
const ABRUF = wert("--abruf", BASIS).replace(/\/$/, "");
const KEY = (process.env.INDEXNOW_KEY || "").trim();
const ENDPUNKT = process.env.INDEXNOW_ENDPUNKT || "https://api.indexnow.org/indexnow";

function abbruch(text) { console.error(text); process.exit(1); }
if (!/^[A-Za-z0-9-]{8,128}$/.test(KEY)) abbruch("INDEXNOW_KEY fehlt oder ist ungueltig (8 bis 128 Zeichen: Buchstaben, Ziffern, Bindestrich).");
if (!/^https:\/\/[a-z0-9.-]+$/i.test(BASIS)) abbruch("Basis muss eine https-Adresse ohne Pfad sein: " + BASIS);
if (!/^https?:\/\/[a-z0-9.-]+(:\d+)?$/i.test(ABRUF)) abbruch("Abrufadresse ohne Pfad erwartet: " + ABRUF);
const host = new URL(BASIS).hostname;

// 1. Schluesseldatei muss erreichbar sein und genau den Schluessel enthalten
const schluesselUrl = BASIS + "/" + KEY + ".txt";
const sr = await fetch(ABRUF + "/" + KEY + ".txt").catch((e) => abbruch("Schluesseldatei nicht erreichbar: " + e.message));
const st = (await sr.text()).trim();
if (sr.status !== 200 || st !== KEY) abbruch("Schluesseldatei " + ABRUF + "/<Schluessel>.txt liefert Status " + sr.status + (sr.status === 200 ? " mit falschem Inhalt" : "") + ". Laeuft der Dienst mit OEFFENTLICH=1 und demselben INDEXNOW_KEY?");

// 2. Adressen aus der Sitemap (nur eigene Adressen unter der Basis)
const sm = await fetch(ABRUF + "/sitemap.xml").catch((e) => abbruch("Sitemap nicht erreichbar: " + e.message));
if (sm.status !== 200) abbruch("Sitemap: Status " + sm.status);
const adressen = [...(await sm.text()).matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/&amp;/g, "&").trim())
  .filter((u) => u.startsWith(BASIS + "/"));
if (!adressen.length) abbruch("Die Sitemap enthaelt keine Adressen unter " + BASIS);
console.log(adressen.length + " Adressen in der Sitemap, Schluesseldatei ok.");
if (PROBE) process.exit(0);

// 3. Melden (hoechstens 10.000 Adressen je Anfrage)
for (let i = 0; i < adressen.length; i += 10000) {
  const teil = adressen.slice(i, i + 10000);
  const r = await fetch(ENDPUNKT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: KEY, keyLocation: schluesselUrl, urlList: teil }),
  }).catch((e) => abbruch("IndexNow nicht erreichbar: " + e.message));
  // 200: angenommen, 202: angenommen, Schluessel wird noch geprueft. 403: Schluessel ungueltig, 422: Adressen passen nicht zum Host.
  const text = (await r.text()).slice(0, 300);
  if (r.status !== 200 && r.status !== 202) abbruch("IndexNow antwortet mit Status " + r.status + (text ? ": " + text : ""));
  console.log("Gemeldet: " + teil.length + " Adressen, Status " + r.status + ".");
}
