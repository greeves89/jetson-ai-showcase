// Prüft die Sicherheitsköpfe gegen einen laufenden Dienst (selbstsigniertes Zertifikat erlaubt).
//   LABOR_URL        Adresse (Standard https://localhost:8443)
//   ERWARTE_HSTS=1   HSTS muss vorhanden sein (nur im öffentlichen Modus über HTTPS), sonst darf es fehlen
// Aufruf: LABOR_URL=https://192.168.178.83:8443 node tests/sicherheitskoepfe.mjs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const BASIS = (process.env.LABOR_URL || "https://localhost:8443").replace(/\/$/, "");
const fehler = [];
const ok = (b, t) => { console.log((b ? "OK    " : "FEHLT ") + t); if (!b) fehler.push(t); };

async function kopf(pfad, methode = "GET") {
  const r = await fetch(BASIS + pfad, { method: methode, redirect: "manual" });
  await r.arrayBuffer();
  return r;
}

const csp = (r) => r.headers.get("content-security-policy") || r.headers.get("content-security-policy-report-only") || "";
function pruefeKoepfe(r, name) {
  const h = (n) => r.headers.get(n) || "";
  ok(h("x-content-type-options") === "nosniff", `${name}: nosniff`);
  ok(h("x-frame-options") === "DENY", `${name}: X-Frame-Options DENY`);
  ok(h("referrer-policy") === "strict-origin-when-cross-origin", `${name}: Referrer-Policy`);
  ok(/camera=\(self\)/.test(h("permissions-policy")) && /geolocation=\(\)/.test(h("permissions-policy")), `${name}: Permissions-Policy`);
  const c = csp(r);
  ok(/default-src 'self'/.test(c) && /script-src 'self'(;|$)/.test(c) && /object-src 'none'/.test(c) && /frame-ancestors 'none'/.test(c), `${name}: Content-Security-Policy`);
  ok(!/unsafe-eval|script-src[^;]*unsafe-inline/.test(c), `${name}: CSP ohne unsafe-eval und ohne unsafe-inline bei Skripten`);
}

const seiten = [["/", "Startseite"], ["/was-ist-ki", "Lernseite"], ["/api/warteschlange", "API"], ["/static/style.css", "Statische Datei"],
  ["/seite-gibt-es-nicht", "Fehlerseite"]];
for (const [pfad, name] of seiten) {
  const r = await kopf(pfad);
  console.log(`  ${pfad} -> ${r.status}`);
  pruefeKoepfe(r, name);
  if (name === "Startseite" || name === "Lernseite") ok(/no-cache/.test(r.headers.get("cache-control") || ""), `${name}: Cache-Control no-cache`);
}
const start = await kopf("/");
const hsts = start.headers.get("strict-transport-security");
if (process.env.ERWARTE_HSTS === "1") ok(/max-age=\d{7,}/.test(hsts || ""), "HSTS vorhanden");
else ok(!hsts, "HSTS im LAN nicht gesetzt (selbstsigniertes Zertifikat)");
for (const p of ["/docs", "/redoc", "/openapi.json"]) {
  const r = await kopf(p);
  ok(r.status === 404, `${p} liefert 404 (ist ${r.status})`);
}
console.log(fehler.length ? `\n${fehler.length} Fehler` : "\nalles in Ordnung");
process.exit(fehler.length ? 1 : 0);
