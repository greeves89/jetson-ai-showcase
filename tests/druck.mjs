// node tests/druck.mjs: Druckansicht (@media print) der Entscheidungsseite und einiger Lernseiten.
//   Kopfleiste, Menue, "Kurz/Genau lesen", "Zum Inhalt springen", Fusszeile, Sprungchips und Videos sind weg; die Haken der Checkliste stehen als
//   Kaestchen mit Haekchen (nur Linien, schwarz-weiss tauglich); Seitentitel und Adresse als Kopf; die Checkliste passt auf eine A4-Seite.
//   Die PDFs landen in tests/ausgabe/druck-*.pdf (mit pdftoppm -r 60 ansehen).
import { starte, oeffneSeite, URL_LABOR } from "./browser.mjs";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
let schlecht = 0;
const pruefe = (ok, text) => { console.log((ok ? "OK     " : "FEHLER ") + text); if (!ok) { schlecht++; process.exitCode = 1; } };
mkdirSync("tests/ausgabe", { recursive: true });
const t = await starte({ kamera: false, dunkel: true });
const { page } = t;
const text = (pdf) => { try { return execFileSync("pdftotext", ["-layout", pdf, "-"], { encoding: "utf8" }); } catch (e) { return ""; } };
const seiten = (pdf) => { try { return +/Pages:\s+(\d+)/.exec(execFileSync("pdfinfo", [pdf], { encoding: "utf8" }))[1]; } catch (e) { return -1; } };

/* ---- Entscheidungsseite mit gesetzten Haken */
await oeffneSeite(page, "betrieb-entscheidung");
await page.waitForSelector('[data-testid="checkliste"] input');
const n = await page.locator('[data-testid="checkliste"] input').count();
for (const i of [0, 1, 3]) await page.locator('[data-testid="checkliste"] label').nth(i).click();
await page.emulateMedia({ media: "print", colorScheme: "light" });
const weg = [".skip", ".seite", ".leiste", ".zurueck-zeile", ".lesemodus", "footer", ".fuss", ".kennzahl-sprung", ".video-block", ".keine-druck"];
for (const sel of weg) {
  const gesamt = await page.locator(sel).count();
  const sichtbar = await page.locator(sel).evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== "none").length);
  pruefe(sichtbar === 0, `Druck blendet ${sel} aus (${gesamt} vorhanden, ${sichtbar} sichtbar)`);
}
pruefe(await page.evaluate(() => getComputedStyle(document.querySelector(".druck-kopf")).display !== "none"), "Druckkopf (Titel und Adresse) ist sichtbar");
const kopf = await page.textContent(".druck-kopf");
pruefe(/KI-Labor: /.test(kopf) && /betrieb-entscheidung/.test(kopf) && /^.*https?:\/\//.test(kopf), "Kopf nennt Seitentitel und Adresse: " + kopf.trim().slice(0, 100));
const haken = await page.$$eval('[data-testid="checkliste"] li', (lis) => lis.map((li) => { const nr = li.querySelector(".nr"); const c = getComputedStyle(nr), a = getComputedStyle(nr, "::after"); return { an: li.querySelector("input").checked, rahmen: parseFloat(c.borderTopWidth) >= 1, inhalt: a.content, haken: parseFloat(a.borderBottomWidth) >= 1.5 }; }));
pruefe(haken.length === n && haken.every((h) => h.rahmen), "jede Frage hat im Druck ein sichtbares Kästchen mit Rahmen (" + n + ")");
pruefe(haken.filter((h) => h.an).length === 3 && haken.filter((h) => h.an).every((h) => h.haken && h.inhalt !== "none"), "gesetzte Haken sind als Häkchen gezeichnet (Linien, ohne Hintergrundfarbe)");
pruefe(haken.filter((h) => !h.an).every((h) => h.inhalt === "none" || h.inhalt === "normal"), "nicht gesetzte Kästchen bleiben leer");
await page.pdf({ path: "tests/ausgabe/druck-entscheidung.pdf", format: "A4", printBackground: false, preferCSSPageSize: true });
const pdfText = text("tests/ausgabe/druck-entscheidung.pdf");
const seite1 = (() => { try { return execFileSync("pdftotext", ["-f", "1", "-l", "1", "-layout", "tests/ausgabe/druck-entscheidung.pdf", "-"], { encoding: "utf8" }); } catch (e) { return ""; } })();
pruefe(/Sechs Fragen zum Abhaken/.test(seite1) && /3 von 6 Fragen geklärt/.test(seite1) && /Rückfall, und weißt du, wann du stoppst/.test(seite1), "die ganze Checkliste (alle sechs Fragen, Zähler) steht auf der ersten A4-Seite, nichts abgeschnitten");
pruefe(seiten("tests/ausgabe/druck-entscheidung.pdf") === 1, "die Checkliste bleibt auf einer A4-Seite (" + seiten("tests/ausgabe/druck-entscheidung.pdf") + ")");
pruefe(/KI-Labor: /.test(pdfText) && /ki-labor\.daniel-alisch\.site\/betrieb-entscheidung/.test(pdfText) && !/192\.168|localhost/.test(pdfText), "PDF-Kopf: Titel und öffentliche Adresse (keine Testadresse)");
pruefe(!/Zum Inhalt springen|Kurz lesen|Genau lesen|Seiten suchen|Zur Startseite|Menü/.test(pdfText), "PDF ohne Bedienelemente (Skip-Link, Lesemodus, Suche, Zurück, Menü)");
pruefe(/3 von \d+ Fragen geklärt/.test(pdfText), "PDF enthält den Stand: 3 Fragen geklärt");
try { execFileSync("pdftoppm", ["-r", "60", "-png", "tests/ausgabe/druck-entscheidung.pdf", "tests/ausgabe/druck-entscheidung"]); } catch (e) { /* pdftoppm fehlt: PDF liegt trotzdem vor */ }
await page.emulateMedia({ media: "screen", colorScheme: "dark" });
pruefe(await page.evaluate(() => getComputedStyle(document.querySelector(".druck-kopf")).display === "none"), "am Bildschirm bleibt der Druckkopf unsichtbar");

/* ---- Lernseiten: kein Bedienelement, Text nicht abgeschnitten, keine Seitenueberbreite */
for (const id of ["karte", "ki-hausaufgaben-fair", "kosten-energie", "uc-fertigung-sichtpruefung"]) {
  await oeffneSeite(page, id);
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  const r = await page.evaluate(() => {
    const sicht = (sel) => [...document.querySelectorAll(sel)].filter((e) => getComputedStyle(e).display !== "none").length;
    return { bedien: sicht(".skip, .seite, .leiste, .lesemodus, footer, .kennzahl-sprung, .video-block, video"), breit: document.documentElement.scrollWidth, h1: !!document.querySelector("#inhalt h1") };
  });
  pruefe(r.bedien === 0 && r.h1, `${id}: im Druck nur Inhalt (Bedienelemente sichtbar: ${r.bedien})`);
  await page.pdf({ path: `tests/ausgabe/druck-${id}.pdf`, format: "A4", preferCSSPageSize: true });
  const tx = text(`tests/ausgabe/druck-${id}.pdf`);
  pruefe(tx.length > 200 && !/Zum Inhalt springen|Genau lesen/.test(tx) && new RegExp("KI-Labor: ").test(tx), `${id}: PDF hat ${seiten(`tests/ausgabe/druck-${id}.pdf`)} Seiten, Text vorhanden, Kopf mit Titel`);
  await page.emulateMedia({ media: "screen", colorScheme: "dark" });
}

/* ---- Runde 5: aufgeklappte Inhalte, Quiz, Downloads, Handreichung */
{
  const hole = async (id, kurz = true) => {
    await oeffneSeite(page, id);
    await page.evaluate((k) => { try { localStorage.setItem("kl-lesemodus", k ? "kompakt" : "ausfuehrlich"); } catch (e) { /* egal */ } }, kurz);
    await page.reload({ waitUntil: "load" }); await page.waitForSelector("#inhalt h1"); await page.waitForTimeout(500);
    await page.emulateMedia({ media: "print", colorScheme: "light" });
    const pdf = `tests/ausgabe/druck-r5-${id}.pdf`;
    await page.pdf({ path: pdf, format: "A4", preferCSSPageSize: true });
    await page.emulateMedia({ media: "screen", colorScheme: "dark" });
    return pdf;
  };
  // Kurz-Modus: der Inhalt hinter "Mehr dazu" kommt aufs Papier, Quiz und Bedienelemente nicht
  const pdf = await hole("prompts-schule", true);
  const tx = text(pdf);
  pruefe(/Ich halte ein Referat über Windkraft/.test(tx), "prompts-schule (Kurz-Modus): die Beispiel-Prompts aus „Mehr dazu“ stehen im Ausdruck");
  pruefe(!/Teste dich/.test(tx), "Quiz ohne Arbeitsblatt wird nicht gedruckt");
  pruefe(!/Im Chat ausprobieren/.test(tx) && !/^\s*Kopieren\s*$/m.test(tx), "keine Bedienknöpfe im Ausdruck");
  pruefe(/ki-labor\.daniel-alisch\.site\/prompts-schule/.test(tx) && !/192\.168|localhost/.test(tx), "Kopf mit öffentlicher Adresse");
  await oeffneSeite(page, "prompts-schule");
  pruefe(await page.evaluate(() => [...document.querySelectorAll("details.mehr")].every((d) => !d.hasAttribute("data-druck-offen"))), "am Bildschirm bleiben die Mehr-dazu-Teile wie gewählt");
  // Downloads: Hinweis "Als PDF" statt Knöpfen
  await oeffneSeite(page, "schule-lehrkraefte");
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  const dl = await page.evaluate(() => ({ knoepfe: [...document.querySelectorAll(".dlkarte,.dl-knopf")].filter((e) => e.getBoundingClientRect().height > 0).length, hinweis: (document.querySelector(".druck-pdf") || {}).textContent || "", sicht: !!document.querySelector(".druck-pdf") && getComputedStyle(document.querySelector(".druck-pdf")).display !== "none" }));
  await page.emulateMedia({ media: "screen", colorScheme: "dark" });
  pruefe(dl.knoepfe === 0 && dl.sicht && /^Als PDF: ki-labor-.*\.pdf/.test(dl.hinweis), "Herunterladen-Knöpfe weg, Hinweis: " + dl.hinweis.slice(0, 70));
  const hand = await hole("schule-lehrkraefte", false);
  pruefe(seiten(hand) <= 8, "Handreichung für Lehrkräfte: höchstens 8 Seiten (" + seiten(hand) + ")");
  const kurz = await hole("schule-lehrkraefte", true);
  pruefe(seiten(kurz) <= 8, "Handreichung (Kurz-Modus): höchstens 8 Seiten (" + seiten(kurz) + ")");
  // @page-Rand 12 mm (A4 mit Rand: Textbreite 186 mm)
  const rand = await page.evaluate(() => { for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) { if (r.type === CSSRule.MEDIA_RULE && /print/.test(r.conditionText || r.media.mediaText)) for (const x of r.cssRules) if (x.type === CSSRule.PAGE_RULE) return x.style.margin; } } catch (e) { /* egal */ } } return null; });
  pruefe(rand === "12mm", "@page margin 12mm (" + rand + ")");
}
pruefe(t.fehler.length === 0, "keine Konsolenfehler " + t.fehler.join("; "));
await t.schliessen();
console.log(schlecht ? `\n${schlecht} Fehler` : "\nalles ok");
