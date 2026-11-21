# Visuelle Bausteine für Lernseiten

Leitlinie: **Weniger Text ist mehr, Bilder erklären mehr.** Jeder Abschnitt einer Lernseite zeigt ein Bild und höchstens
zwei kurze Sätze. Die ausführliche Erklärung (Absätze, Alltagsbeispiel, Tabelle, Merksatz) steckt im ausklappbaren
"Mehr dazu". Der Besucher entscheidet mit dem Schalter "Kompakt | Ausführlich" oben auf der Seite.

## Felder eines Abschnitts (`abschnitte[]`)
```js
{
  h: "Überschrift",
  kurz: "Ein bis zwei Sätze, höchstens 140 Zeichen, die den Kern sagen.",   // sichtbar in "Kompakt"
  visual: { typ: "ablauf", ... },                                            // Bild, siehe unten
  p: ["..."], liste: ["..."], alltag: "...", merke: "...", tabelle: {...}   // wie bisher, landet in "Mehr dazu"
}
```
Fehlt `kurz`, nimmt die Oberfläche den ersten Satz des ersten Absatzes (gekürzt). Fehlt `visual`, gibt es kein Bild.
`visual` darf auch eine Liste von Bildern sein (nebeneinander oder untereinander, je nach Platz).

## Bildtypen
Icons sind lucide-Namen in kebab-case (`camera`, `brain-circuit`, `database`, `file-text`, `search`, `truck`).
Farben: `"akzent"` (blau), `"gruen"`, `"orange"`, `"rot"`, `"grau"`. Alle Texte kurz: Wörter, keine Sätze.

| typ | Zweck | Felder |
|---|---|---|
| `ablauf` | Schritte von links nach rechts mit wanderndem Datenpaket | `schritte:[{icon, text, sub?, farbe?}]`, `paket:true` |
| `kreis` | Kreislauf (Regelkreis, Agentenschleife, Lernen) | `knoten:[{icon, text}]`, `mitte?:"Text"` |
| `vergleich` | zwei Seiten gegenübergestellt | `links:{titel, icon?, punkte:[..], farbe?}`, `rechts:{..}`, `urteil?` |
| `balken` | Größen vergleichen, animiert | `zeilen:[{label, wert, max?, einheit?, farbe?}]`, `titel?` |
| `schichten` | Ebenen, Stapel, Verschachtelung | `ebenen:[{text, sub?, icon?}]`, `richtung:"stapel"\|"verschachtelt"` |
| `raster` | Dinge nebeneinander (Beispiele, Branchen) | `zellen:[{icon, text, sub?}]`, `spalten?:3` |
| `zahlen` | große Kennzahlen | `kacheln:[{wert, label, icon?}]` |
| `zeitachse` | Reihenfolge in der Zeit | `punkte:[{t, text, icon?}]` |
| `netz` | Knoten und Verbindungen | `knoten:[{id, text, icon?, x, y}]` (x, y von 0 bis 100), `kanten:[["a","b","Beschriftung?"]]` |
| `punkte` | Punktwolken mit Klassen (nur Veranschaulichung) | `klassen:[{name, farbe, n, mitte:[x,y], streu}]` (x, y von 0 bis 100, y wächst nach oben), `grenze?:"linie"\|"kreis"` |
| `matrix` | 2 mal 2 oder 3 mal 3 Tabelle als Bild | `x:[..]`, `y:[..]`, `zellen:[[{text, ton?}]]` (ton: gut, schlecht, neutral), zusätzlich `xtitel?`, `ytitel?` |
| `skala` | Spektrum mit Marker | `links`, `rechts`, `marker:0..1`, `label?` |
| `token` | Text in Stücke zerlegt | `stuecke:["Der"," Him","mel"]` |
| `quelle` | Foto oder Diagramm aus den Beispieldaten | `src`, `alt`, `unter?` |

## Verhalten und Gestaltung
- Gezeichnet als SVG oder HTML/CSS, mit den Farben aus `style.css` (hell und dunkel), ohne Verläufe als Dekor.
- Animation beim ersten Sichtbarwerden (IntersectionObserver), nie Endlosschleifen ohne Aussage; ein Datenpaket oder
  ein Kreislauf darf laufen, aber nur solange das Bild im Sichtbereich ist. `prefers-reduced-motion`: statisch.
- Jedes Bild hat ein `<figure>` mit `aria-label` (aus den Texten gebildet) und eine Textalternative für Crawler.
- Responsiv: auf schmalen Fenstern brechen Abläufe um oder werden senkrecht.
- Kein Text im Bild unter 14 px bei Seitenbreite 900 px.

## Lesemodus
`KL.lesemodus` ist `"kompakt"` (Standard) oder `"ausfuehrlich"`, gespeichert in `localStorage` (`kl-lesemodus`).
Kompakt: je Abschnitt Überschrift, Bild, `kurz`, eingeklapptes "Mehr dazu". Ausführlich: alles offen.
Der Schalter steht oben auf Lektions- und Laborseiten und ändert alle Abschnitte der Seite sofort.

## Umsetzung (Stand der Bildsprache)
- Code: `app/static/visuals.js` und `visuals.css` (Klassen `v-`), Icons: `icons.json` (erzeugt mit `scripts/icons_bauen.mjs`).
- Das `<figure>` trägt die Klasse `visual vt-<typ>`. Alle Bilder haben `aria-label`; der Bildinhalt ist `aria-hidden`, dafür gibt es eine
  unsichtbare Liste der Beschriftungen (`ul.v-alt`). `scripts/seo_bauen.mjs` schreibt dieselbe Liste in den Rohtext für Suchmaschinen
  (Funktion `KL.visualAlt`, einmal in `visuals.js` definiert).
- Zusätzliche Felder, die über die Tabelle hinausgehen: jedes Bild darf `unter` (Bildunterschrift) und `alt` (eigener Text für `aria-label`)
  haben; `balken` kennt `einheit` und `max` für das ganze Bild; `ablauf` mit `paket:false` ohne wanderndes Paket; `matrix` mit `xtitel`/`ytitel`.
- `quelle` erlaubt nur Dateien unter `/static/`.
- Animationen: Web Animations API, Start beim ersten Sichtbarwerden, Pause außerhalb des Bildes und im Hintergrund, bei
  `prefers-reduced-motion` nur das Endbild. Aufräumen über `KL.montiere` (Router, beim Seitenwechsel).
- Neue Bildtypen: `KL.visuals["name"] = function (spec, ctx) { return { el, alt: [..] }; }` (siehe Kopf von `visuals.js`).
- Der Kurztext ohne `kurz` ist der erste Satz des ersten Absatzes (höchstens 140 Zeichen, Abkürzungen wie "z. B." trennen nicht). In
  "Ausführlich" entfällt dieser automatische Satz, ein von Hand geschriebenes `kurz` bleibt als Einstieg stehen.
- `business` erscheint in Kompakt als Chips, der Text liegt unter "Mehr dazu"; `grenzen` stehen in einem eingeklappten Block.
- Versteckte Seiten (`versteckt: true`) sind unter ihrer Adresse erreichbar, stehen aber nicht in Navigation und Sitemap.

## Beispiele für Autoren
```js
// 1) Ablauf mit wanderndem Datenpaket
visual: {typ: "ablauf", schritte: [
  {icon: "camera", text: "Kamera", sub: "liefert ein Bild"},
  {icon: "brain-circuit", text: "Modell"},
  {icon: "circle-check", text: "Ergebnis", farbe: "gruen"}]}

// 2) Balken mit Einheit
visual: {typ: "balken", titel: "Wartezeit pro Bild (Beispielwerte)", einheit: "ms", zeilen: [
  {label: "Cloud", wert: 180, farbe: "orange"}, {label: "Jetson", wert: 35, farbe: "gruen"}]}

// 3) Zwei Bilder nebeneinander
visual: [{typ: "skala", links: "sicher", rechts: "riskant", marker: 0.7},
         {typ: "token", stuecke: ["Der", " Him", "mel"]}]
```
Alle Typen mit Beispiel: Seite `/visual-demo` (Quelle `app/static/content-visual-demo.js`).
