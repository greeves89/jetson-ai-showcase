# Visual-Pass: Seiten bildzentriert umschreiben

Auftrag des Betreibers: **Weniger Text ist mehr. Mehr Visualisierungen sind krasser.** Lernseiten sind heute Textblöcke.
Sie sollen Bild-zuerst werden: jeder Abschnitt ein erklärendes Bild und höchstens ein bis zwei kurze Sätze. Die Tiefe bleibt
erhalten, steht aber hinter "Mehr dazu". Spezifikation der Bildsprache: `docs/visuals.md`. Beispiele aller Typen: Seite
`/visual-demo` (`app/static/content-visual-demo.js`). Qualitätsregeln für Text: `docs/schreibleitfaden.md`.

## Was du je Abschnitt tust
1. **`kurz`** schreiben: ein bis zwei Sätze, höchstens 140 Zeichen, der Kern. Kein Anreißer, keine Floskel, keine Wiederholung
   der Überschrift. Beispiel: "Je kleiner das Stück, desto genauer der Treffer, aber desto weniger Zusammenhang."
2. **`visual`** hinzufügen: ein Bild, das den Kern ERKLÄRT, nicht schmückt. Wähle den passenden Typ:
   Ablauf für Reihenfolgen und Datenfluss, Kreis für Schleifen, Vergleich für Gegensätze, Balken für Größen und Zeiten,
   Schichten für Verschachtelung oder Stapel, Raster für Beispiele und Branchen, Zahlen für Kennzahlen, Zeitachse für
   Reihenfolge in der Zeit, Netz für Beziehungen, Punkte für Klassen und Grenzen, Matrix für 2 mal 2 Fälle, Skala für
   Spektren, Token für Textzerlegung, Quelle für Fotos aus `app/static/beispiele/fotos/`.
   - Jedes Bild ist inhaltlich korrekt und trägt die Aussage des Abschnitts. Zahlen im Bild stehen so im Text des Abschnitts
     oder sind als "Beispielwerte" gekennzeichnet. Keine erfundenen Messwerte.
   - Variiere die Typen innerhalb einer Seite. Nicht jedes Bild ein Ablauf. Zwei Bilder (Liste `visual: [..]`) nur, wenn
     der Vergleich es verlangt.
   - Texte im Bild sind Stichworte, keine Sätze (höchstens 3 bis 4 Wörter je Beschriftung).
   - Icons: lucide-Namen. Prüfe JEDEN Namen gegen `app/static/icons.json` (Schlüssel). Fehlt einer, nimm einen passenden
     vorhandenen. Prüfung zum Kopieren:
     `node -e "const i=require('./app/static/icons.json');const t=require('fs').readFileSync('DEINE_DATEI','utf8');const n=[...t.matchAll(/icon:\s*\"([a-z0-9-]+)\"/g)].map(m=>m[1]);console.log('fehlt:',[...new Set(n)].filter(x=>!i[x]))"`
3. **Bestehenden Text** (`p`, `liste`, `alltag`, `merke`, `tabelle`) behalten: Er liegt automatisch hinter "Mehr dazu".
   Du darfst Absätze streichen oder straffen, die nur wiederholen oder Füllwörter enthalten; der ausführliche Teil soll
   nicht länger werden. Fachliche Aussagen bleiben korrekt. `alltag`-Kästen bleiben (sie sind das Herz der Tiefe).
4. Bei Seiten mit `widget` oder `demo`: Das Labor steht schon oben. Die Abschnitte darunter erklären den Hintergrund; auch
   sie bekommen `kurz` und ein Bild, aber keine Bilder, die den Baustein nur wiederholen.
5. **Seitenkopf:** `kurz` der Seite (Lead) bleibt ein Satz. `mitnehmen`, `quiz`, `weiter` bleiben.

## Qualitätsmaßstab
- Wer nur die Überschriften und Bilder durchscrollt, versteht den Kerngedanken der Seite. Teste das selbst.
- Pro Seite mindestens so viele Bilder wie Abschnitte (jeder Abschnitt eins), wo es inhaltlich trägt; ein Abschnitt, der kein
  sinnvolles Bild hat (z. B. reine Definition), bekommt ein `zahlen`- oder `skala`-Bild nur, wenn es etwas aussagt, sonst keins.
- Sprache: Deutsch, du-Form, echte Umlaute, KEINE Emojis, KEINE Gedankenstriche (– —), keine Floskeln.

## Prüfen (Pflicht)
1. `node --check` deiner Datei, Icon-Prüfung (oben), `grep -n "–\|—"` (nichts).
2. Deploy `tests/deploy.sh`, dann je Seite `export LABOR_URL=https://192.168.178.83:8443; node tests/screenshot.mjs <id>`
   (der Test scrollt die Seite durch, damit die Animationen ihren Endzustand zeigen), Screenshot mit dem Read-Werkzeug
   ansehen (große Seiten mit `convert datei.png -crop 1440x2400+0+0 +repage ausschnitt.png` in Stücke schneiden). Prüfe
   Kompaktmodus (Standard) und einmal Ausführlich (Schalter oben; per Playwright `localStorage.setItem("kl-lesemodus","ausfuehrlich")`
   vor dem Laden). Behebe, was nicht überzeugt: leere Bilder, abgeschnittene Texte, falsche Inhalte, öde Wiederholungen.
3. `node tests/smoke.mjs` (null Probleme) und das Quiz-Testskript deines Strangs, falls vorhanden (`tests/quiz-*.mjs`).
4. NICHT `node scripts/seo_bauen.mjs` ausführen (schreibt alle Seiten, das macht der Hauptprozess am Ende).
5. Fasse nur deine Datei(en) an. Kein `git commit`/`push`.

## Bericht
Kurz: Seiten fertig (Anzahl Bilder je Seite), Bildtypen, was du streichen oder straffen musstest, was dir noch nicht gefällt.
