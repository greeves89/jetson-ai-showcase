// stimme.mjs: Sprechertexte vertonen, Szenenzeiten aus gemessenen Satzlängen ableiten, Musik erzeugen, mischen.
//
//   node stimme.mjs schaetzen [id...]   Zeitplan nur aus Schätzung (kein ElevenLabs, kostenlos) fuer die Bildprüfung
//   node stimme.mjs [id...]             echte Stimme (Zwischenspeicher je Satz), Plan, Musik, Mischung (-16 LUFS), VTT, Manifest
//
// Zeichenobergrenze fuer diesen Auftrag: ZEICHEN_MAX (Standard 15000), nur neue (nicht zwischengespeicherte) Zeichen zaehlen.
// Der API-Schluessel steht nur in ~/.elevenlabs/key und wird nie ausgegeben oder gespeichert.
import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";
import { musik } from "./musik.mjs";

const MODELL = process.env.MODELL ?? "eleven_v4";
const STIMME = process.env.STIMME_ID ?? "JBFqnCBsd6RMkjVDRZzb"; // George
const SPRACHE = process.env.SPRACHE ?? "de";
const ZEICHEN_MAX = Number(process.env.ZEICHEN_MAX ?? 15000);
const LEAD = 0.5, GAP = 0.3, TAIL = 0.9, MIN_SZENE = 4.5, SCHLUSS = 1.8;
const CACHE = "stimme-cache";
const json = (p) => JSON.parse(readFileSync(p, "utf8"));
const alleIds = () => readdirSync("texte").filter((f) => f.endsWith(".json")).map((f) => f.replace(".json", ""));
const dauerVon = (d) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", d]).toString().trim());

const regeln = existsSync("aussprache.json") ? json("aussprache.json") : {};
const sprich = (t) => Object.entries(regeln).reduce((s, [w, a]) => s.replace(new RegExp(`\\b${w}\\b`, "g"), a), t);
const settings = { stability: 0.5, similarity_boost: 0.75, use_speaker_boost: true };
const hashVon = (text) => createHash("sha256").update(`${STIMME}|${MODELL}|${SPRACHE}|${JSON.stringify(settings)}|${text}`).digest("hex").slice(0, 16);

let neueZeichen = 0;
async function satzHolen(text) {
  const gesprochen = sprich(text);
  const datei = join(CACHE, `${hashVon(gesprochen)}.mp3`);
  if (existsSync(datei)) return datei;
  if (neueZeichen + gesprochen.length > ZEICHEN_MAX) throw new Error(`Zeichengrenze ${ZEICHEN_MAX} erreicht, Abbruch.`);
  const key = readFileSync(join(homedir(), ".elevenlabs", "key"), "utf8").trim();
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${STIMME}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({ text: gesprochen, model_id: MODELL, language_code: SPRACHE, voice_settings: settings }),
  });
  if (!r.ok) throw new Error(`ElevenLabs HTTP ${r.status}: ${(await r.text()).slice(0, 200).replace(key, "***")}`);
  writeFileSync(datei, Buffer.from(await r.arrayBuffer()));
  neueZeichen += gesprochen.length;
  appendFileSync(join(CACHE, "verbrauch.tsv"), `${gesprochen.length}\t${gesprochen}\n`);
  return datei;
}

const vttZeit = (s) => {
  const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), sek = Math.floor((ms % 60000) / 1000);
  const p = (n, l = 2) => String(n).padStart(l, "0");
  return `${p(h)}:${p(m)}:${p(sek)}.${p(ms % 1000, 3)}`;
};
const umbruch = (t) => {
  if (t.length <= 44) return t;
  const mitte = t.length / 2;
  let best = -1;
  for (let i = 0; i < t.length; i++) if (t[i] === " " && (best < 0 || Math.abs(i - mitte) < Math.abs(best - mitte))) best = i;
  return t.slice(0, best) + "\n" + t.slice(best + 1);
};

async function planen(id, schaetzen) {
  const tx = json(`texte/${id}.json`);
  let a = 0;
  const szenen = [];
  for (let k = 0; k < tx.szenen.length; k++) {
    const sz = tx.szenen[k];
    let t = k === 0 ? LEAD + 0.4 : LEAD;
    const saetze = [];
    for (const text of sz.saetze) {
      let d, datei = null;
      if (schaetzen) d = sprich(text).length / 14.5;
      else { datei = await satzHolen(text); d = dauerVon(datei); }
      saetze.push({ t: +t.toFixed(3), d: +d.toFixed(3), text, datei });
      t += d + GAP;
    }
    const letzte = saetze[saetze.length - 1];
    const dauer = +Math.max(MIN_SZENE, letzte.t + letzte.d + (k === tx.szenen.length - 1 ? SCHLUSS : sz.nachlauf ?? TAIL)).toFixed(2);
    szenen.push({ id: sz.id, kapitel: sz.kapitel, start: +a.toFixed(3), dauer, saetze });
    a += dauer;
  }
  return { id, titel: tx.titel, untertitel: tx.untertitel, gesamt: +a.toFixed(2), szenen };
}

function sh(args) { execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" }); }
function lautheit(datei, extra = "") {
  const p = ffmpegAus(["-hide_banner", "-nostats", "-i", datei, "-af", `loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json${extra}`, "-f", "null", "-"]);
  const m = p.match(/\{[\s\S]*?\}/g);
  return JSON.parse(m[m.length - 1]);
}
import { spawnSync } from "node:child_process";
function ffmpegAus(args) { const r = spawnSync("ffmpeg", args, { encoding: "utf8" }); return r.stderr; }

function mischen(plan) {
  mkdirSync("ton", { recursive: true });
  const saetze = plan.szenen.flatMap((s) => s.saetze.map((x) => ({ ...x, tg: s.start + x.t })));
  const wav = `ton/${plan.id}-musik.wav`;
  musik(plan, wav, 0);
  const ein = saetze.flatMap((s) => ["-i", s.datei]);
  const ver = saetze.map((s, i) => `[${i + 1}:a]aresample=44100,adelay=${Math.round(s.tg * 1000)}|${Math.round(s.tg * 1000)}[s${i}]`);
  const g = plan.gesamt.toFixed(2);
  const filter = [
    ...ver,
    `${saetze.map((_, i) => `[s${i}]`).join("")}amix=inputs=${saetze.length}:normalize=0,apad=whole_dur=${g},atrim=0:${g},asplit=2[stimme][seite]`,
    `[0:a]volume=0.4[m]`,
    `[m][seite]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=400[geduckt]`,
    `[geduckt][stimme]amix=inputs=2:normalize=0[aus]`,
  ].join(";");
  const roh = `ton/${plan.id}-roh.wav`;
  sh(["-i", wav, ...ein, "-filter_complex", filter, "-map", "[aus]", "-ar", "44100", "-ac", "2", roh]);
  // zweistufig auf -16 LUFS / -1,5 dBTP
  const m = lautheit(roh);
  const lin = `:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  sh(["-i", roh, "-af", `loudnorm=I=-16:TP=-2.0:LRA=11${lin}`, "-ar", "44100", "-ac", "2", `ton/${plan.id}.wav`]);
  const n = lautheit(`ton/${plan.id}.wav`);
  console.log(`  Lautheit ${plan.id}: ${n.input_i} LUFS, Spitze ${n.input_tp} dBTP`);
}

function vtt(plan) {
  const z = ["WEBVTT", ""];
  plan.szenen.forEach((s) => s.saetze.forEach((x) => {
    z.push(`${vttZeit(s.start + x.t)} --> ${vttZeit(s.start + x.t + x.d + 0.15)}`, umbruch(x.text), "");
  }));
  mkdirSync("out", { recursive: true });
  writeFileSync(`out/${plan.id}.vtt`, z.join("\n"));
}

function manifest(ids) {
  const videos = ids.map((id) => {
    const p = json(`src/plan/${id}.json`);
    return { id, titel: p.titel, untertitel: p.untertitel, dauer_s: Math.round(p.gesamt * 10) / 10,
      kapitel: p.szenen.map((s) => ({ t: Math.round(s.start * 10) / 10, titel: s.kapitel })) };
  });
  const text = JSON.stringify({ videos }, null, 2) + "\n";
  writeFileSync("manifest.json", text);
  mkdirSync("../app/static/videos", { recursive: true });
  writeFileSync("../app/static/videos/manifest.json", text);
}

const args = process.argv.slice(2);
const schaetzen = args[0] === "schaetzen";
const wahl = args.filter((a) => a !== "schaetzen");
const ids = wahl.length ? wahl : alleIds();
mkdirSync(CACHE, { recursive: true });
mkdirSync("src/plan", { recursive: true });
const reihenfolge = ["was-ist-ki", "maschinelles-lernen", "generative-ki", "robotik", "ki-im-business", "rag-ueberblick", "rag-embedding", "rag-embedding-beachten", "rag-chunking", "rag-keywordsuche", "rag-hybridsuche", "rag-reranking", "rag-bewertung", "daten-rohstoff", "neuronale-netze-erklaert", "training-gradientenabstieg", "bewertung-konfusionsmatrix", "verzerrung-fairness", "recht-ueberblick",
  "bild-als-zahlen", "cnn-wie-netze-sehen", "vision-aufgaben-ueberblick", "agenten-grundlagen", "agenten-planung", "agenten-sicherheit", "mcp-erklaert",
  "sprachmodell-aufbau", "prompting-grundlagen", "prompting-beispiele", "llm-grenzen-risiken", "wissen-ins-modell-oder-dokument", "sprachausgabe-erklaert",
  "entscheidungsbaeume", "zeitreihen-prognose", "anomalieerkennung", "empfehlungssysteme", "mlops-betrieb", "kosten-und-energie", "ki-einfuehren",
  "uc-fertigung-sichtpruefung", "uc-fertigung-sortieren", "uc-logistik-zaehlen", "uc-handel-regal", "uc-gesundheit-auffaellig", "uc-buero-dokumente", "uc-buero-protokoll", "uc-service-bestellung", "uc-sicherheit-zutritt", "uc-sicherheit-baustelle"];
for (const id of ids) {
  const plan = await planen(id, schaetzen);
  const speicher = JSON.parse(JSON.stringify(plan));
  speicher.szenen.forEach((s) => s.saetze.forEach((x) => delete x.datei));
  writeFileSync(`src/plan/${id}.json`, JSON.stringify(speicher, null, 1));
  console.log(`${id}: ${plan.gesamt.toFixed(1)} s${schaetzen ? " (Schätzung)" : ""}, neue Zeichen bisher ${neueZeichen}`);
  if (!schaetzen) { mischen(plan); vtt(plan); }
}
manifest(reihenfolge.filter((i) => existsSync(`src/plan/${i}.json`)));
console.log(`Neu vertonte Zeichen in diesem Lauf: ${neueZeichen}`);
