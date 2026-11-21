// Erzeugt app/static/icons.json aus dem npm-Paket lucide-static (ISC-Lizenz, siehe docs/lizenzen.md).
// Die Datei enthaelt je Icon nur den inneren SVG-Inhalt: { "camera": "<path d=.../>...", ... }.
// KL.icon(name) in app.js nutzt zuerst das kleine Set im Code, dann diese Datei.
// Aufruf:  node scripts/icons_bauen.mjs                   (laedt lucide-static in einen temporaeren Ordner)
//          node scripts/icons_bauen.mjs --quelle <ordner>  (Ordner mit entpacktem Paket, darin icons/*.svg)
// Neue Icons: Namen unten eintragen (kebab-case wie auf lucide.dev) und das Skript neu ausfuehren.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ZIEL = path.join(WURZEL, "app", "static", "icons.json");
const VERSION = "1.77.0";            // gepinnt, damit das Ergebnis reproduzierbar bleibt
const GRENZE = 200 * 1024;

const GRUPPEN = {
  "Sehen, Kamera, Bild": "camera video webcam scan scan-eye scan-face scan-line eye eye-off eye-closed focus aperture image images image-up film clapperboard cctv monitor-play scan-search zoom-in telescope microscope",
  "Chips, Rechner, Daten": "cpu microchip circuit-board memory-stick hard-drive server server-cog database database-zap network cable plug plug-zap battery battery-charging zap power thermometer gauge fan monitor laptop smartphone tablet printer keyboard mouse tv gamepad-2 lamp-desk",
  "KI, Code, Denken": "brain brain-circuit bot sparkles sparkle wand-sparkles lightbulb puzzle workflow git-branch git-merge git-fork binary braces code code-xml terminal square-terminal file-code regex variable function-square atom flask-conical dna",
  "Netz, Cloud, Funk": "cloud cloud-upload cloud-download cloud-off wifi wifi-off globe radio antenna router signal bluetooth satellite-dish link unlink external-link share-2 download upload",
  "Sicherheit": "shield shield-check shield-alert lock lock-open key key-round fingerprint-pattern badge-check siren ban",
  "Verkehr": "truck car bus train-front plane ship bike route map map-pin navigation compass signpost traffic-cone fuel parking-meter",
  "Fabrik, Lager, Werkzeug": "factory warehouse package package-check package-open boxes container forklift wrench hammer cog settings settings-2 sliders-horizontal drill construction ruler tool-case bug scissors",
  "Handel, Geld": "store shopping-cart shopping-bag credit-card banknote coins receipt tag tags percent piggy-bank wallet",
  "Gesundheit": "heart-pulse stethoscope syringe pill hospital activity cross ambulance",
  "Buero, Bildung": "building building-2 briefcase landmark school graduation-cap book book-open library notebook-pen clipboard clipboard-check clipboard-list calendar calendar-clock calendar-days mail inbox send phone phone-call presentation",
  "Pfeile, Ablauf": "arrow-right arrow-left arrow-up arrow-down arrow-up-right arrow-right-left arrow-left-right arrow-down-to-line arrow-up-from-line corner-down-right move-right repeat repeat-2 refresh-cw rotate-cw undo-2 redo-2 shuffle split merge chevron-right chevrons-right",
  "Hinweise, Zustand": "triangle-alert circle-alert octagon-alert circle-check circle-x x check info circle-help bell bell-ring flag flag-triangle-right",
  "Sprache, Ton": "languages message-square messages-square message-circle quote text type text-cursor-input captions subtitles speech mic mic-off volume-2 volume-x audio-lines audio-waveform headphones music ear",
  "Dokumente": "file-text file file-search file-check file-warning files folder folder-open archive scroll-text sticky-note book-text pencil eraser pen-line save copy trash-2",
  "Suche, Ordnung, Form": "search filter funnel list-filter list-checks list-ordered list tree-pine table table-2 layout-grid layout-dashboard columns-3 rows-3 grid-3x3 layers layers-2 shapes square circle triangle hexagon box plus minus circle-plus equal",
  "Waage, Zeit, Mass": "scale clock timer timer-reset hourglass history alarm-clock watch infinity sigma pi divide hash at-sign target crosshair",
  "Diagramme": "chart-bar chart-line chart-pie chart-scatter chart-column chart-area chart-no-axes-column trending-up trending-down",
  "Menschen": "user users user-round user-check user-plus user-cog users-round person-standing contact hand handshake thumbs-up thumbs-down smile",
  "Natur, Sonstiges": "leaf sun moon droplets wind flame snowflake dice-5 award trophy medal star rocket",
};

function quelleOrdner() {
  const i = process.argv.indexOf("--quelle");
  if (i > 0) return path.resolve(process.argv[i + 1]);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lucide-"));
  execFileSync("npm", ["pack", "lucide-static@" + VERSION, "--pack-destination", tmp, "--silent"], { cwd: tmp, stdio: ["ignore", "ignore", "inherit"] });
  const tgz = fs.readdirSync(tmp).find((f) => f.endsWith(".tgz"));
  execFileSync("tar", ["-xzf", path.join(tmp, tgz), "-C", tmp]);
  return path.join(tmp, "package");
}

const basis = quelleOrdner();
const namen = [...new Set(Object.values(GRUPPEN).flatMap((s) => s.split(/\s+/).filter(Boolean)))].sort();
const aus = {};
const fehlt = [];
for (const n of namen) {
  const datei = path.join(basis, "icons", n + ".svg");
  if (!fs.existsSync(datei)) { fehlt.push(n); continue; }
  const svg = fs.readFileSync(datei, "utf8");
  const innen = (svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/) || [])[1];
  if (!innen) { fehlt.push(n); continue; }
  aus[n] = innen.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").replace(/> </g, "><").replace(/ \/>/g, "/>").trim();
}
if (fehlt.length) { console.error("Diese Icons gibt es nicht in lucide-static " + VERSION + ": " + fehlt.join(", ")); process.exit(1); }
const text = JSON.stringify(aus);
if (text.length > GRENZE) { console.error("icons.json ist zu gross: " + text.length + " Bytes"); process.exit(1); }
fs.writeFileSync(ZIEL, text + "\n");
console.log(namen.length + " Icons, " + text.length + " Bytes nach " + path.relative(WURZEL, ZIEL));
