// Gemeinsamer Lader der Inhaltsdateien fuer die Werkzeuge in scripts/ (seo_bauen.mjs, og_bauen.mjs):
// content.js und die in module.json genannten content-*.js laufen ohne DOM in einem eigenen Kontext.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const STATIC = path.join(WURZEL, "app", "static");

const ctx = vm.createContext({});
ctx.window = ctx;
export const moduleJson = JSON.parse(fs.readFileSync(path.join(STATIC, "module.json"), "utf8"));
const dateien = ["content.js", ...(moduleJson.content || [])];
/** Seiten-ID -> Inhaltsdatei, aus der sie stammt (fuer Aenderungsdatum). */
export const quelle = {};
let bekannt = new Set();
for (const d of dateien) {
  vm.runInContext(fs.readFileSync(path.join(STATIC, d), "utf8"), ctx, { filename: d });
  for (const id of Object.keys(ctx.INHALT.seiten)) if (!bekannt.has(id)) quelle[id] = d;
  bekannt = new Set(Object.keys(ctx.INHALT.seiten));
}
// Textalternativen der Bilder: dieselbe Funktion wie im Browser (app/static/visuals.js, laeuft hier ohne DOM bis zur Textalternative)
vm.runInContext(fs.readFileSync(path.join(STATIC, "visuals.js"), "utf8"), ctx, { filename: "visuals.js" });
export const visualAlt = ctx.KLVisualAlt;
export const INHALT = ctx.INHALT;

/** Dateiname-tauglicher Name eines Bereichs: "Daten und Prognosen" -> "daten-und-prognosen". */
export const bereichKennung = (name) =>
  String(name).toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Reiner Text ohne Markierungen ([[begriff]], {{seite|text}}, **fett**, `code`), fuer Beschreibung, Titel und Textdateien. */
export function klar(t) {
  return String(t)
    .replace(/\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (m, k, a) => a || (INHALT.glossar[k] ? INHALT.glossar[k][0] : k))
    .replace(/\{\{([a-z0-9-]+)(?:\?[a-z0-9_=&-]+)?\|([^}]+)\}\}/g, "$2")
    .replace(/\[([^\[\]]+)\]\(([^()\s]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");
}
