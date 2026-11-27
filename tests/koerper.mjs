// node tests/koerper.mjs: Labor "Körperhaltung" mit Fake-Webcam.
//   LABOR_URL=https://192.168.178.83:8502 KOERPER_BILD=<.jpg einer stehenden Person, ganzer Körper> node tests/koerper.mjs
//   FAKE_VIDEO=<.y4m>   statt KOERPER_BILD: ein fertiges Video (Person mit Beinen im Bild)
//   KOERPER_BILD        baut daraus mit ffmpeg ein kurzes Video (6 s, 640x480, 15 Bilder pro Sekunde, Bild füllt das Format)
//   MIN_FPS             Mindestwert für Bilder pro Sekunde (Standard 8)
// Prüft: Seite, Einwilligung mit Kästchen, Kennzeichnung der Schätzungen, WebSocket modus=koerper, Skelett mit Punkten und Sicherheit,
// Gelenkwinkel und Ansicht, alle vier Bedienmodi (Steuernachrichten kommen an, Antworten haben die richtige Gestalt), Hinweise ohne
// medizinische Wörter, Tempo, Stoppen, Zurücksetzen, saubere Konsole. Zähler mit echten Bewegungen prüft tests/koerper_regeln_test.py
// (ein Standbild bewegt sich nicht). Das Testbild gehört nicht ins Repo (tests/fixtures ist ignoriert), es sind keine echten Personenfotos
// im Repo.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

if (!process.env.FAKE_VIDEO && process.env.KOERPER_BILD) {
  const ziel = join(mkdtempSync(join(tmpdir(), "koerper-")), "person.y4m");
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-loop", "1", "-framerate", "15", "-i", process.env.KOERPER_BILD,
    "-vf", "scale=640:480:force_original_aspect_ratio=increase,crop=640:480", "-t", "6", "-pix_fmt", "yuv420p", ziel]);
  process.env.FAKE_VIDEO = ziel;
}
const { starte, oeffneSeite } = await import("./browser.mjs");
const pruefe = (ok, text) => { console.log((ok ? "OK    " : "FEHLT ") + text); if (!ok) process.exitCode = 1; };
if (!process.env.FAKE_VIDEO || !existsSync(process.env.FAKE_VIDEO)) {
  console.log("FEHLT FAKE_VIDEO (.y4m mit stehender Person) oder KOERPER_BILD (.jpg) ist nicht gesetzt");
  process.exit(1);
}
const MIN_FPS = Number(process.env.MIN_FPS || 8);
mkdirSync("tests/ausgabe", { recursive: true });

// ---------------------------------------------------------------- Erstbesuch: Einwilligung mit Kästchen
{
  const e = await starte({ dunkel: true, einwilligung: false });
  await oeffneSeite(e.page, "koerperhaltung");
  await e.page.click("text=Kamera starten");
  await e.page.waitForSelector("dialog.einw[open]", { timeout: 8000 }).catch(() => {});
  const dlg = await e.page.locator("dialog.einw").innerText().catch(() => "");
  pruefe(/Körperhaltung: ausdrücklich einwilligen/.test(dlg), "Einwilligung nennt das Labor Körperhaltung");
  pruefe(/Skelett/.test(dlg) && /nichts gespeichert/.test(dlg), "Einwilligung erklärt Zweck und dass nichts gespeichert wird");
  pruefe(await e.page.locator("dialog.einw .einw-aktion .btn.primary").isDisabled(), "Einwilligung: Knopf ist ohne Kästchen gesperrt");
  await e.page.check("dialog.einw input[type=checkbox]");
  pruefe(await e.page.locator("dialog.einw .einw-aktion .btn.primary").isEnabled(), "Einwilligung: Knopf geht nach dem Kästchen auf");
  await e.page.click("dialog.einw .einw-aktion .btn.primary");
  await e.page.waitForSelector(".d-steuer .chip.live", { timeout: 25000 }).catch(() => {});
  pruefe(/verbunden/.test(await e.page.textContent(".d-steuer .chip")), "Nach der Einwilligung startet die Kamera");
  await e.schliessen();
}

const t = await starte({ dunkel: true });
const { page } = t;
const nachrichten = [];
const gesendet = [];
page.on("websocket", (ws) => {
  if (!/\/ws\/vision/.test(ws.url())) return;
  const eintrag = { url: ws.url(), rahmen: [] };
  nachrichten.push(eintrag);
  ws.on("framereceived", (f) => { try { eintrag.rahmen.push(JSON.parse(f.payload)); } catch (e) { /* Binaerrahmen egal */ } });
  ws.on("framesent", (f) => { if (typeof f.payload === "string" && f.payload.startsWith("{")) gesendet.push(JSON.parse(f.payload)); });
});

await oeffneSeite(page, "koerperhaltung");
pruefe(/Körperhaltung/.test(await page.textContent("#inhalt h1")), "Seite koerperhaltung öffnet");
pruefe(await page.locator(".ki-hinweis", { hasText: "Schätzungen" }).count() === 1, "Kennzeichnung der Schätzungen sichtbar (KL.kiHinweis)");
pruefe(/keine Diagnose/.test(await page.locator(".ki-hinweis").first().innerText()) && /nichts gespeichert/.test(await page.locator(".ki-hinweis").first().innerText()), "Kennzeichnung nennt Diagnose und Speichern");
pruefe(await page.locator(".d-kh-modus").count() === 4, "vier Bedienmodi");
pruefe(await page.locator(".kameras.d-koerper video").count() === 1, "Vorschau ist als gespiegelt gekennzeichnet (Klasse d-koerper)");
const nav = await page.locator("#nav-treffer-koerperhaltung, a.nav[data-id=koerperhaltung]").count();
pruefe(nav >= 1, "Seite steht im Menü");
const kameraMarke = await page.locator("a.nav[data-id=koerperhaltung] small").count();
pruefe(kameraMarke >= 1, "Seite ist im Menü als Kameraseite gekennzeichnet");
const weiterVon = await page.evaluate(() => (window.INHALT.seiten["hand-gesicht"].weiter || []).includes("koerperhaltung"));
pruefe(weiterVon, "hand-gesicht verweist auf koerperhaltung");
const gruppe = await page.evaluate(() => { const g = window.INHALT.gruppen.find((x) => x.name === "Sehen").seiten; return g.indexOf("koerperhaltung") === g.indexOf("hand-gesicht") + 1; });
pruefe(gruppe, "koerperhaltung steht in der Gruppe Sehen hinter hand-gesicht");
const suche = await page.evaluate(() => Object.keys(window.INHALT.synonyme).filter((k) => (window.INHALT.synonyme[k] || []).includes("=koerperhaltung")));
pruefe(["skelett", "haltung", "kniebeuge", "ergonomie", "sport", "pose"].every((k) => suche.includes(k)), "Suchbegriffe führen zur Seite (" + suche.length + " Stück)");

await page.click("text=Kamera starten");
await page.waitForFunction(() => { const b = document.querySelectorAll(".messwerte .messwert b"); return b.length === 3 && b[2].textContent !== "·"; }, null, { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(3000);

const ws = nachrichten.find((n) => n.url.includes("modus=koerper"));
pruefe(!!ws, "WebSocket mit modus=koerper");
let rahmen = ws ? ws.rahmen.filter((r) => r.bild) : [];
pruefe(rahmen.length > 10, `Server schickt Bilder (${rahmen.length})`);
const mitPerson = rahmen.filter((r) => r.person);
pruefe(mitPerson.length > rahmen.length * 0.8, `Person in ${mitPerson.length} von ${rahmen.length} Bildern (auch auf Nachführ-Bildern)`);
const letzte = mitPerson[mitPerson.length - 1] || {};
console.log("      Messwerte:", JSON.stringify(letzte.messwerte), "Ansicht:", letzte.ansicht, "gesehen:", letzte.gesehen, "Zeiten:", JSON.stringify(letzte.detail_ms), JSON.stringify(letzte.zeiten));
pruefe(letzte.gesehen >= 20, `genug Punkte sicher gesehen (${letzte.gesehen} von 33)`);
pruefe(letzte.sicher > 0.5, `Sicherheit der Person ${letzte.sicher}`);
pruefe(["vorn", "schraeg", "seite"].includes(letzte.ansicht), `Ansicht bestimmt (${letzte.ansicht})`);
const m = letzte.messwerte || {};
pruefe(["ellbogen_l", "ellbogen_r", "knie_l", "knie_r", "huefte_l", "huefte_r", "rumpf_seitlich", "schulter_schief", "kopf_vor"].every((k) => k in m), "alle Messwert-Schlüssel vorhanden");
pruefe(m.knie_l > 140 && m.knie_r > 140, `stehende Person: Knie fast gestreckt (${m.knie_l} und ${m.knie_r} Grad)`);
pruefe(m.ellbogen_l > 140 && m.ellbogen_r > 140, `hängende Arme: Ellbogen fast gestreckt (${m.ellbogen_l} und ${m.ellbogen_r} Grad)`);
const stabil = new Set(mitPerson.map((r) => r.ansicht));
pruefe(stabil.size <= 2, `Ansicht bleibt stabil (${[...stabil].join(", ")})`);
// Glättung: Standbild darf kaum zittern (Knie in Grad)
const knie = mitPerson.slice(-20).map((r) => r.messwerte.knie_l).filter((x) => x != null);
const spanne = Math.max(...knie) - Math.min(...knie);
pruefe(spanne <= 4, `Winkel am Standbild zittern kaum (Spanne ${spanne} Grad)`);

// Karte "Gelenkwinkel live"
const karte = await page.locator(".d-kh-karte").innerText();
console.log("      Karte:", karte.replace(/\n/g, " | "));
pruefe(/Gelenkwinkel live/.test(karte) && /Ellbogen links/.test(karte) && /Knie rechts/.test(karte) && /°/.test(karte), "Karte zeigt Gelenkwinkel");
pruefe(/Ansicht/.test(karte) && /von (vorn|der Seite)|schräg/.test(karte), "Karte nennt die Ansicht");
pruefe(await page.locator(".d-kh-karte svg").count() >= 1, "Karte hat lucide-Symbol");
pruefe(!/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(await page.textContent("#inhalt")), "keine Emojis auf der Seite");
pruefe(!/[–—]/.test(await page.textContent("#inhalt")), "keine Gedankenstriche auf der Seite");
await page.screenshot({ path: "tests/ausgabe/koerper-skelett.png", fullPage: true });

// ---------------------------------------------------------------- Bewegungs-Spiegel
const frisch = async (bis, ms = 6000) => { const n0 = ws.rahmen.length; const t0 = Date.now(); while (Date.now() - t0 < ms) { const r = ws.rahmen.slice(n0).filter((x) => x.bild && bis(x)); if (r.length >= 2) return r; await page.waitForTimeout(150); } return []; };
await page.click(".d-kh-modus:has-text('Bewegungs-Spiegel')");
let r = await frisch((x) => x.uebung);
pruefe(gesendet.some((g) => g.ansicht === "spiegel"), "Steuernachricht ansicht=spiegel kam an");
pruefe(r.length >= 2, "Antworten haben im Spiegel-Modus ein Feld uebung");
const u = (r[r.length - 1] || {}).uebung || {};
pruefe(u.name === "kniebeuge" && u.zaehler === 0 && typeof u.rueckmeldung === "string" && u.rueckmeldung.length > 3, `Kniebeuge: Zähler 0, Rückmeldung "${u.rueckmeldung}"`);
pruefe(/seitlich/.test(u.rueckmeldung) || letzte.ansicht !== "vorn", "Kniebeuge von vorn: Hinweis, sich seitlich zu drehen");
for (const [name, id] of [["Arme heben", "arme-heben"], ["Arme kreisen", "armkreisen"], ["Seitneigung", "seitneigung"]]) {
  await page.click(`.d-kh-chip:has-text('${name}')`);
  r = await frisch((x) => x.uebung && x.uebung.name === id);
  pruefe(r.length >= 2 && gesendet.some((g) => g.uebung === id), `Übung ${name}: Steuernachricht und Antwort ${(r[r.length - 1] || {}).uebung ? r[r.length - 1].uebung.rueckmeldung : "?"}`);
}
const uText = await page.locator(".d-kh-panel:not([hidden])").innerText();
pruefe(/Kein Ersatz für Training oder Therapie/.test(uText), "Bewegungs-Spiegel: Hinweis Kein Ersatz für Training oder Therapie");
pruefe(await page.locator(".d-kh-rueck").first().innerText() !== "", "Rückmeldung wird angezeigt");
await page.screenshot({ path: "tests/ausgabe/koerper-spiegel.png", fullPage: true });
await page.click("text=Zähler auf null");
pruefe(gesendet.some((g) => g.neu === true), "Zurücksetzen schickt die Steuernachricht");

// ---------------------------------------------------------------- Haltung am Schreibtisch
await page.click(".d-kh-modus:has-text('Haltung am Schreibtisch')");
r = await frisch((x) => x.haltung && x.haltung.bilder >= 8, 12000);
pruefe(r.length >= 2, "Schreibtisch: nach ein paar Bildern kommen Hinweise");
const hin = ((r[r.length - 1] || {}).haltung || {}).hinweise || [];
const hinText = hin.map((x) => x.text).join(" | ");
console.log("      Hinweise:", hinText);
pruefe(hin.length >= 1 && hin.every((x) => typeof x.text === "string" && x.text.length > 10), "Schreibtisch: Hinweise sind Sätze");
pruefe(!/krank|diagnose|schmerz|störung|haltungsschaden|therapie|behandl/i.test(hinText), "Schreibtisch: keine medizinischen Wörter im Hinweis");
const tischText = await page.locator(".d-kh-panel:not([hidden])").innerText();
pruefe(/keine Diagnose/.test(tischText) && /Warum von vorn und von der Seite/.test(tischText), "Schreibtisch: Hinweis Keine Diagnose und Erklärung vorn gegen Seite");
await page.click(".d-kh-warum summary");
pruefe(/Tiefe/.test(await page.locator(".d-kh-warum").innerText()), "Schreibtisch: Erklärung lässt sich aufklappen");
await page.screenshot({ path: "tests/ausgabe/koerper-schreibtisch.png", fullPage: true });

// ---------------------------------------------------------------- Pose nachmachen
await page.click(".d-kh-modus:has-text('Pose nachmachen')");
r = await frisch((x) => x.nachmachen);
const nm = (r[r.length - 1] || {}).nachmachen || {};
console.log("      Pose:", JSON.stringify({ ziel: nm.ziel, a: nm.aehnlichkeit, geschafft: nm.geschafft, stuecke: (nm.stuecke || []).map((s) => (s.sichtbar ? (s.ok ? "+" : "-") : "?")).join("") }));
pruefe(nm.ziel === "haende-hoch" && Array.isArray(nm.stuecke) && nm.stuecke.length === 8, "Nachmachen: acht Abschnitte, Zielpose Hände hoch");
pruefe(typeof nm.aehnlichkeit === "number" && nm.aehnlichkeit >= 0 && nm.aehnlichkeit <= 100, `Nachmachen: Ähnlichkeit ist eine Zahl von 0 bis 100 (${nm.aehnlichkeit})`);
pruefe(nm.aehnlichkeit < 80 && nm.geschafft === 0, "Nachmachen: hängende Arme sind nicht Hände hoch, nichts als geschafft gezählt");
for (const [name, id] of [["T-Pose", "t-pose"], ["Baum", "baum"]]) {
  await page.click(`.d-kh-chip:has-text('${name}')`);
  r = await frisch((x) => x.nachmachen && x.nachmachen.ziel === id);
  const w = ((r[r.length - 1] || {}).nachmachen || {}).aehnlichkeit;
  pruefe(r.length >= 2 && gesendet.some((g) => g.ziel === id) && w < 80, `Zielpose ${name}: Antwort mit Ähnlichkeit ${w} Prozent, hängende Arme stimmen nicht`);
}
const posText = await page.locator(".d-kh-panel:not([hidden])").innerText();
pruefe(/Ähnlichkeit/.test(posText) && /So wird gerechnet/.test(posText), "Nachmachen: Zahl und Erklärung der Rechnung stehen da");
await page.screenshot({ path: "tests/ausgabe/koerper-nachmachen.png", fullPage: true });

// ---------------------------------------------------------------- Tempo (Browser bis Jetson und zurück, wie in der Oberfläche gemessen)
await page.waitForTimeout(2500);
const werte = await page.$$eval(".messwerte .messwert b", (bs) => bs.map((b) => b.textContent));
const fps = Number(String(werte[2]).replace(",", "."));
pruefe(fps >= MIN_FPS, `Bilder pro Sekunde ${werte[2]} (Ziel mindestens ${MIN_FPS}), Treffer ${werte[0]}, Runde ${werte[1]}`);
const satz = await page.textContent(".live .erklaerung");
pruefe(/Person/.test(satz), "Live-Erklärung nennt die Person: " + satz.slice(0, 140));
const ms = rahmen.length ? ws.rahmen.filter((x) => x.zeiten).slice(-30).map((x) => x.zeiten.erkennen) : [];
const mittel = ms.reduce((a, b) => a + b, 0) / Math.max(1, ms.length);
console.log(`      erkennen im Mittel ${mittel.toFixed(1)} ms (letzte ${ms.length} Bilder), Bilder pro Sekunde ${werte[2]}`);

await page.click("text=Kamera stoppen");
await page.waitForTimeout(600);
pruefe((await page.textContent(".d-steuer .chip")) === "Kamera aus", "Stoppen");
// Zustand endet mit der Verbindung: neue Verbindung beginnt wieder bei null
const vorher = nachrichten.filter((n) => n.url.includes("modus=koerper")).length;
await page.click(".d-kh-modus:has-text('Bewegungs-Spiegel')");
await page.click("text=Kamera starten");
await page.waitForFunction(() => /verbunden/.test(document.querySelector(".d-steuer .chip").textContent), null, { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(3000);
const alle = nachrichten.filter((n) => n.url.includes("modus=koerper"));
const neu = alle[alle.length - 1];
const ersteU = neu.rahmen.find((x) => x.uebung);
console.log("      Verbindungen:", vorher, "->", alle.length, "Zähler in der neuen:", ersteU ? ersteU.uebung.zaehler : "keine Antwort mit uebung");
pruefe(alle.length === vorher + 1 && !!ersteU && ersteU.uebung.zaehler === 0, "Neue Verbindung: Zähler beginnt bei null");
await page.click("text=Kamera stoppen");
pruefe(t.fehler.length === 0, "Konsole sauber " + t.fehler.join("; "));
await t.schliessen();
