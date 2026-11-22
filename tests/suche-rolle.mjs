// node tests/suche-rolle.mjs: Suche im Menue.
//   Textauszuege brechen nicht mitten im Satz (Anfang am Satzanfang, Auslassungspunkte nur am Ende),
//   Mehrwort-Anfragen: Seiten mit allen Woertern stehen vor Seiten mit einzelnen Woertern (und es kommt ueberhaupt etwas),
//   die Rolle gewichtet Treffer (Feld rollen an der Seite, sonst "Fuer dich", Pfad oder Gruppe der Rolle).
import { starte, URL_LABOR } from "./browser.mjs";
let schlecht = 0;
const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) { schlecht++; process.exitCode = 1; } };
const t = await starte({ kamera: false, dunkel: false });
const { page } = t;
const oeffne = async (weg) => { await page.goto(`${URL_LABOR}/${weg ? "?weg=" + weg : ""}`, { waitUntil: "load" }); await page.waitForSelector("#nav-suche"); await page.waitForTimeout(300); };
const suche = async (q) => {
  await page.fill("#nav-suche", ""); await page.fill("#nav-suche", q); await page.waitForTimeout(300);
  return page.evaluate(() => [...document.querySelectorAll("a.nav")].filter((a) => !a.hidden && !a.closest("[hidden]") && a.dataset.id && a.dataset.treffer)
    .map((a) => ({ id: a.dataset.id, art: a.dataset.treffer, auszug: (a.querySelector(".such-auszug") || {}).textContent || "" })));
};
const pos = (r, id) => r.findIndex((x) => x.id === id);

/* ---- 1. Auszuege */
await oeffne("");
let anzahl = 0, kaputt = [];
for (const q of ["Datenschutz", "Kinder", "Quellen", "Chat", "Kamera", "Kosten", "Hausaufgaben", "Sprachmodell", "Betrug", "Regeln", "Token", "Eltern"]) {
  for (const x of await suche(q)) {
    if (!x.auszug) continue;
    anzahl++;
    const a = x.auszug;
    const anfangOk = /^[A-ZÄÖÜ0-9„"'(]/.test(a) && !/^…/.test(a);
    const endeOk = / …$/.test(a) ? !/…/.test(a.slice(0, -2)) : !/…/.test(a);      // gekuerzt nur mit " …" am Ende, sonst ein ganzer Satz oder Listenpunkt
    const laenge = a.length <= 200;
    if (!(anfangOk && endeOk && laenge)) kaputt.push(`${q}/${x.id}: ${a}`);
  }
}
pruefe(anzahl > 40 && kaputt.length === 0, `${anzahl} Auszüge: beginnen am Satzanfang, Auslassungspunkte nur am Ende, höchstens 200 Zeichen` + (kaputt.length ? "\n   " + kaputt.slice(0, 6).join("\n   ") : ""));

/* ---- 2. Mehrwort */
let r = await suche("Datenschutz Kamera Mitarbeiter");
pruefe(r.length >= 3, "Mehrwort-Anfrage ohne Seite mit allen Wörtern liefert trotzdem Treffer (" + r.length + "): " + r.slice(0, 4).map((x) => x.id).join(", "));
const letzteVoll = r.map((x) => x.art).lastIndexOf("voll"), ersteTeil = r.map((x) => x.art).indexOf("teil");
pruefe(r.some((x) => x.art === "voll") && (ersteTeil < 0 || letzteVoll < ersteTeil), "Seiten mit allen Wörtern stehen vor Seiten mit einzelnen Wörtern: " + r.map((x) => x.id + ":" + x.art).slice(0, 7).join(" "));
r = await suche("Kamera Ausschuss");
pruefe(r.length > 0 && r[0].art === "voll" && r.some((x) => x.id === "uc-fertigung-sichtpruefung" && x.art === "voll"), "Kamera Ausschuss findet die Sichtprüfung mit allen Wörtern");
r = await suche("Hausaufgaben Regeln");
pruefe(r.filter((x) => x.art === "voll").length >= 2 && r.map((x) => x.art).indexOf("teil") > r.map((x) => x.art).lastIndexOf("voll"), "Hausaufgaben Regeln: erst vollständige, dann Teiltreffer");
r = await suche("Datenschtz");
pruefe(r.length === 0, "Tippfehler ohne Teiltreffer bleibt leer (Meintest du greift)");
r = await suche("Zebrafinkenzucht Datenschutz");
pruefe(r.length === 0 || r.every((x) => x.art === "teil"), "ein unbekanntes Wort macht die Seiten zu Teiltreffern, nicht zu vollen");

/* ---- 3. Rolle gewichtet */
await oeffne("");
const ohneDaten = await suche("Datenschutz");
await oeffne("eltern");
const elternDaten = await suche("Datenschutz");
pruefe(pos(elternDaten, "sicherheit-einfach") < pos(elternDaten, "recht") && pos(ohneDaten, "recht") < pos(ohneDaten, "sicherheit-einfach"), "Eltern: Elternseite (Ist das sicher?) vor Recht, ohne Rolle umgekehrt: " + elternDaten.slice(0, 3).map((x) => x.id) + " | " + ohneDaten.slice(0, 3).map((x) => x.id));
const elternKinder = await suche("KI Kinder");
const schulIdx = elternKinder.map((x, i) => (/^schule-|^ki-schule|^medien-stunde/.test(x.id) ? i : -1)).filter((i) => i >= 0);
pruefe(elternKinder[0].id === "eltern-zuhause" && schulIdx.every((i) => i > pos(elternKinder, "eltern-zuhause") && i > pos(elternKinder, "zusammen-ausprobieren")), "Eltern: Elternseiten vor Schulseiten (KI Kinder): " + elternKinder.slice(0, 6).map((x) => x.id));
await oeffne("beruf");
const berufHa = await suche("Hausaufgaben Regeln");
await oeffne("");
const ohneHa = await suche("Hausaufgaben Regeln");
pruefe(pos(berufHa, "recht") < pos(berufHa, "ki-hausaufgaben-fair") && pos(ohneHa, "ki-hausaufgaben-fair") < pos(ohneHa, "recht"), "Betrieb: Betriebsseite (Recht) vor der Schulseite, ohne Rolle umgekehrt");
await oeffne("schule");
const schuleDaten = await suche("Datenschutz");
pruefe(schuleDaten[0].id === "sicherheit-einfach", "Schule: erste Seite ist die Seite für die Schule (" + schuleDaten[0].id + ")");
// Feld rollen an der Seite hat Vorrang
await oeffne("beruf");
await page.evaluate(() => { window.KL.INHALT.seiten["llm-grenzen"].rollen = ["beruf"]; });
const mitBeruf = await suche("Grenzen");
await page.evaluate(() => { window.KL.INHALT.seiten["llm-grenzen"].rollen = ["schule"]; });
const mitSchule = await suche("Grenzen");
pruefe(pos(mitBeruf, "llm-grenzen") >= 0 && pos(mitBeruf, "llm-grenzen") < pos(mitSchule, "llm-grenzen"), `Feld rollen: Betrieb hebt llm-grenzen auf Platz ${pos(mitBeruf, "llm-grenzen") + 1} (mit rollen schule: ${pos(mitSchule, "llm-grenzen") + 1})`);
pruefe(t.fehler.length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
await t.schliessen();
console.log(schlecht ? `\n${schlecht} Fehler` : "\nalles ok");
