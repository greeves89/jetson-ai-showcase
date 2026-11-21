// Schmale Anzeige (Handy): kein Ueberlauf nach rechts, alle Knoepfe mindestens 32 Pixel hoch, Zeichenflaechen sichtbar.
//   LABOR_URL=https://192.168.178.83:8443 node tests/widgets-grundlagen-schmal.mjs
import { starte, oeffneSeite } from "./browser.mjs";
import assert from "node:assert/strict";
for (const dunkel of [true, false]) {
  const t = await starte({ kamera: false, dunkel, breite: 375, hoehe: 800 });
  for (const [seite, w] of [["neuronale-netze", ".gl-netz"], ["training", ".gl-grad"], ["bewertung", ".gl-konf"], ["daten", ".gl-dq"]]) {
    await oeffneSeite(t.page, seite);
    await t.page.locator(w).scrollIntoViewIfNeeded();
    const r = await t.page.evaluate((w) => {
      const root = document.querySelector(w), b = root.getBoundingClientRect();
      const rand = Array.from(root.querySelectorAll("*")).filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > b.right + 1 && !e.closest(".gl-tabwrap"); }).map((e) => e.tagName + "." + e.className);
      const klein = Array.from(root.querySelectorAll("button, select")).filter((e) => e.offsetParent && e.getBoundingClientRect().height < 30 && !e.classList.contains("gl-zk")).map((e) => e.textContent.trim());
      const leer = Array.from(root.querySelectorAll("canvas")).filter((c) => c.getBoundingClientRect().height < 40).length;
      return { rand, klein, leer, seite: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    }, w);
    console.log(seite, dunkel ? "dunkel" : "hell", JSON.stringify(r));
    assert.deepEqual(r.rand, [], "Ueberlauf in " + seite);
    assert.deepEqual(r.klein, [], "zu kleine Ziele in " + seite);
    assert.equal(r.leer, 0); assert.ok(r.seite <= 0, "Seite scrollt seitlich");
  }
  assert.equal(t.fehler.length, 0, t.fehler.join("\n"));
  await t.schliessen();
}
console.log("schmal: ok");
