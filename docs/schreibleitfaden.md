# Schreibleitfaden für Lernseiten

Dieser Leitfaden gilt für jede Seite des KI-Labors. Er sorgt dafür, dass alles gleich gut erklärt ist.

## Für wen schreibst du
Für Menschen im Beruf, ohne Vorwissen, neugierig. Später entscheiden sie vielleicht über den Einsatz von KI.
Sie wollen verstehen, nicht auswendig lernen. Nach der Seite sollen sie jemand anderem erklären können, worum es geht.

## Aufbau einer Seite
1. **Lead** (`kurz`): ein bis zwei Sätze. Die Frage, die die Seite beantwortet.
2. **Fünf bis acht Abschnitte** (`abschnitte`). Reihenfolge im Strang: Alltagsbild, Begriff, wie es technisch
   funktioniert, typische Fehler und Grenzen, Verbindung zum Labor.
3. **Merksätze** (`mitnehmen`, drei Stück) und ein **Selbsttest** (`quiz`, vier bis fünf Fragen).
4. Optional: `business` (Einsatz im Betrieb), `grenzen`, `weiter` (Links auf andere Seiten).
5. Länge: 700 bis 1300 Wörter Text, ohne Quiz.

## Wie ein Abschnitt aussieht
- Ein Gedanke je Abschnitt, zwei bis vier kurze Absätze.
- **Mindestens jeder zweite Abschnitt hat ein `alltag`-Beispiel** aus dem echten Leben: Kochen, Bibliothek,
  Telefonbuch, Navigation, Supermarkt, Post, Bewerbungsgespräch, Wetterbericht, Sport, Autowerkstatt.
  Das Beispiel steht vor der Technik oder erklärt sie. Es muss tragen: Man kann daran nachvollziehen, was in der
  Technik passiert, und man sieht, wo der Vergleich hinkt (ein Satz dazu, wenn es wichtig ist).
- `merke` für den Kernsatz eines Abschnitts. `tabelle` für Vergleiche (zum Beispiel Verfahren gegeneinander).
- Technik ohne Formelwust. Formeln nur, wenn sie helfen, und dann einmal in Worten erklärt.

## Sprache
- Du-Form. Kurze Sätze (im Mittel höchstens 18 Wörter). Aktiv. Konkret.
- Fachbegriff erst erklären, dann benutzen. Bei der ersten Nennung `[[schluessel|Text]]` (Glossar). Neue Begriffe
  im Glossar der Seitendatei ergänzen (`glossar`).
- **Keine Gedankenstriche** (– —). Bindestriche in Wörtern sind in Ordnung. **Keine Emojis.** Echte Umlaute.
- Keine Floskeln („in der heutigen Zeit“, „spannende Welt“), keine Werbesprache, kein Muster „nicht nur X, sondern
  auch Y“, keine Aufzählungen aus lauter Dreiern ohne Not.
- Keine Anrede wie „Lass uns eintauchen“. Sag, was passiert.

## Fachliche Korrektheit
- Nichts Falsches vereinfachen. Wenn etwas grob stimmt, schreib „grob“ oder „meist“.
- Zahlen, Jahre und Namen nur, wenn du sie sicher weißt. Im Zweifel weglassen oder qualitativ formulieren.
- Keine Produktwerbung. Produktnamen nur, wenn sie zum Verständnis nötig sind, neutral.
- Rechtliches (Datenschutz, KI-Verordnung): Überblick und Begriffe, immer mit dem Hinweis, dass es keine
  Rechtsberatung ist.
- Ehrlich über Grenzen: Was kann das Verfahren nicht? Wann ist es die falsche Wahl?

## Selbsttest (`quiz`)
Prüft Verständnis, nicht Wortlaut. Eine richtige Antwort, drei bis vier Optionen mit plausiblen Fehlvorstellungen als
Falschantworten, eine kurze Erklärung, warum. Die Position der richtigen Antwort variiert.

## Technik der Seitendatei
- Datei `app/static/content-<strang>.js`, Registrierung mit `INHALT.registriere({...})` (siehe Kommentar am Ende von
  `app/static/content.js`), Eintrag in `app/static/module.json` unter `content`.
- Seitenfelder: `typ` (`lektion` oder `labor`), `gruppe` (Name aus `docs/lehrplan.md`), `titel`, `nav` (kurzer
  Navigationsname), `symbol` (vorhandener Symbolname: start, karte, ml, genki, robotik, business, gesicht, objekt,
  anlernen, chat, rag, agent, whisper, bild, faceswap, hardware, check, play, chevron, live, info, arrow), `kurz`,
  `abschnitte`, `mitnehmen`, `quiz`, `weiter`, optional `widget`, `demo`, `videos`, `business`, `grenzen`.
- IDs in `kebab-case`, global eindeutig, wie in `docs/lehrplan.md`. Links im Text: `{{id|Text}}`.
- `widget: "<name>"` nur, wenn der Baustein in `docs/bausteine-<strang>.md` spezifiziert ist (Zweck, Bedienung, Daten,
  Lerneffekt). Bausteine werden danach separat gebaut. Bis dahin zeigt die Seite „Baustein folgt“.
- `videos: ["video-id", ...]`: ein bis drei Folgen je Seite. Video-IDs global eindeutig, `kebab-case`. Je Video im
  Strangdokument eine Skizze (Titel, Kernaussage, 4 bis 6 Szenen mit Bildidee). Die Videos selbst entstehen später.

## Selbstprüfung vor der Abgabe
1. Jeden Abschnitt laut lesen. Füllwörter streichen.
2. Fakten prüfen. Unsicheres raus.
3. `grep` auf „–“ und „—“ in deiner Datei: darf nichts finden. `node --check` für die Syntax.
4. Seite im Browser öffnen (Test-Harness, siehe `tests/screenshot.mjs`) und ansehen.
