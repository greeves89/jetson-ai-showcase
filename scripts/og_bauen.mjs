// Rendert die Vorschaubilder fuer Open Graph und X (1200 x 630) nach app/static/og/:
// standard.png fuer Startseite und Seiten ohne Bereich, <bereich>.png je Bereich der Navigation.
// Aufruf:  node scripts/og_bauen.mjs        (Chrome: Umgebungsvariable CHROME oder macOS-Standard; Ergebnis einchecken)
// Danach node scripts/seo_bauen.mjs, damit die Seiten die Bilder referenzieren.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "../tests/node_modules/playwright-core/index.mjs";
import { STATIC, INHALT, bereichKennung, klar } from "./inhalt.mjs";

const AUS = path.join(STATIC, "og");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const gruppen = INHALT.gruppen.filter((g) => g.name !== "Start" && g.seiten.some((i) => INHALT.seiten[i] && !INHALT.seiten[i].versteckt));
const bereiche = INHALT.seiten.start.bereiche || {};

const CSS = `
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",system-ui,"Segoe UI",sans-serif;
  color:#1d1d1f;letter-spacing:-.022em;background:
  radial-gradient(900px 520px at 100% 0%,rgba(0,102,204,.16),transparent 70%),
  radial-gradient(700px 420px at 0% 100%,rgba(0,102,204,.08),transparent 70%),#f5f5f7;position:relative}
.marke{position:absolute;left:72px;top:56px;display:flex;align-items:center;gap:16px}
.logo{width:56px;height:56px;border-radius:16px;background:#0066cc;display:grid;place-items:center}
.logo i{display:block;width:24px;height:24px;border-radius:6px;background:#fff}
.marke b{font-size:30px;font-weight:600}.marke span{font-size:24px;color:#5f5f64;margin-left:4px}
.haupt{position:absolute;left:72px;top:176px;width:640px}
.haupt .art{font-size:26px;color:#0066cc;font-weight:600;margin-bottom:16px}
.haupt h1{font-size:76px;line-height:1.05;font-weight:700;letter-spacing:-.035em}
.haupt p{margin-top:28px;font-size:32px;line-height:1.3;color:#5f5f64}
.liste{position:absolute;right:72px;top:96px;width:380px;display:flex;flex-direction:column;gap:14px}
.liste div{background:#fff;border-radius:22px;padding:18px 24px;font-size:26px;font-weight:500;line-height:1.2;
  box-shadow:0 8px 32px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.06);display:flex;align-items:center;gap:16px}
.liste div:before{content:"";flex:none;width:12px;height:12px;border-radius:50%;background:#0066cc}
.fuss{position:absolute;left:72px;right:72px;bottom:48px;display:flex;justify-content:space-between;font-size:24px;color:#5f5f64}
`;

function seite({ art, titel, satz, eintraege }) {
  return `<!doctype html><meta charset="utf-8"><style>${CSS}</style>
<div class="marke"><div class="logo"><i></i></div><b>KI-Labor</b><span>läuft auf dem Jetson</span></div>
<div class="haupt">${art ? `<div class="art">${esc(art)}</div>` : ""}<h1>${esc(titel)}</h1>${satz ? `<p>${esc(satz)}</p>` : ""}</div>
<div class="liste">${eintraege.map((e) => `<div>${esc(e)}</div>`).join("")}</div>
<div class="fuss"><span>ki-labor.daniel-alisch.site</span><span>Daniel Alisch</span></div>`;
}

const jobs = [{
  datei: "standard.png", art: "Lernlabor zu künstlicher Intelligenz", titel: "KI verstehen, indem du sie ausprobierst",
  satz: "", eintraege: gruppen.slice(0, 5).map((g) => g.name),
}];
for (const g of gruppen) {
  jobs.push({
    datei: bereichKennung(g.name) + ".png", art: "Bereich", titel: g.name, satz: (bereiche[g.name] || {}).satz || "",
    eintraege: g.seiten.filter((i) => INHALT.seiten[i] && !INHALT.seiten[i].versteckt).slice(0, 5).map((i) => klar(INHALT.seiten[i].nav || INHALT.seiten[i].titel)),
  });
}

fs.mkdirSync(AUS, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const j of jobs) {
  await page.setContent(seite(j));
  await page.screenshot({ path: path.join(AUS, j.datei), type: "png" });
  console.log(j.datei, fs.statSync(path.join(AUS, j.datei)).size, "Bytes");
}
await browser.close();
