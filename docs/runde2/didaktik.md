# Prüfrunde 2: Didaktik-Fachprüfer (Mediendidaktik, digitale Lernplattformen)

Stand: 22.11.2026. Geprüft gegen LABOR_URL=https://192.168.178.83:8443 mit Playwright (tests/browser.mjs), dazu die Inhaltsdateien app/static/content*.js (nur gelesen, per Skript ausgewertet), docs/lehrplan.md, schreibleitfaden.md, visuals.md, visual-pass.md. Gelesen wurde auch app/static/app.js (Quiz, Fortschritt, Videoblock). Nichts wurde geändert, kein git.

Grenzen der Prüfung: Ich habe Start, karte, ml, prompting, llm-grenzen, rag-ueberblick, uc-handel-regal, verzerrung-ethik, chat und hardware geöffnet, ein Quiz bedient, ein Video samt Untertitelspur geprüft, die Suche mit Alltagswörtern und die Handy-Breite (390 px) getestet. Die Labore selbst, Kamera und die Sprachmodell-Antworten habe ich bewusst nicht ausgereizt (Jetson schonen, das ist Sache der anderen Prüfer). Das Ergebnis betrifft Lernaufbau und Lernwirksamkeit, nicht Technik.

## Gesamtnote: 6,8 von 10

Als Fachwissens-Sammlung ist das Labor überdurchschnittlich: korrekt, in Du-Form, mit tragenden Alltagsbildern, Bild-zuerst-Aufbau und einem guten Lesemodus. Als Lernplattform mit Anspruch "Eins-A für unerfahrene Menschen, auch Schüler" ist es noch keine, weil das Lernen selbst nicht geführt wird: keine Lernziele, kein Fortschritt, kein Lernpfad über die erste Handvoll Seiten hinaus, Selbsttests ohne Wiederholung, und die Seiten, mit denen Anfänger beginnen, sind die dünnsten.

Eins-A wäre ab etwa 9,0. Erreichbar mit den Paketen A1 bis A5 unten.

## Noten nach Raster (didaktisch bewertbare Punkte, streng)

| Nr. | Kriterium | Note | Kurzbeleg |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter | 7,0 | Du-Form, kurze Sätze, Alltagsvergleiche (Eisdiele, Forellen, Kollegin). Aber ein Text für alle: keine Sprachstufe für Klasse 8, Fachbegriffe dicht (Vortraining, Textnormalisierung, Kosinus). |
| 2 | Einstieg und Führung | 6,5 | Start hat "Neu hier" (3 Schritte) und "Für Entscheider" (4 Seiten mit Minuten). Kein Weg für Schüler oder Lehrkräfte, kein Lernziel je Seite. |
| 3 | Lernwirkung | 6,5 | Gute Erklärungen, aber Selbsttest ohne zweiten Versuch, ohne Transferaufgabe, ohne Erklärungsaufgabe. Siehe Quiz-Analyse. |
| 4 | Motivation und Spaß | 7,0 | Bilder, Labore, Videos. Keine Belohnung für Fortschritt, nichts Sammelbares, kein Erfolgserlebnis außerhalb der Labore. |
| 5 | Labore und Interaktion | 7,0 (nur Oberfläche gesichtet) | 47 Seiten mit Baustein oder Demo. Rückmeldung und Wartezeiten nicht geprüft, das übernehmen die Nutzer-Prüfer. |
| 6 | Videos | 7,5 | 49 Videos, 62,2 bis 89,3 s, Untertitel, Kapitel. Position über dem Text, Verweis am Ende nicht belegbar. Siehe Videoabschnitt. |
| 7 | Navigation und Orientierung | 5,5 | Menü, Suche und Zurück gut. Fortschritt nur als Häkchen im Menü, gesetzt beim bloßen Öffnen der Seite. Kein Prozentwert, keine Reihenfolge-Hilfe, kein "weiter mit". |
| 8 | Vertrauen und Sicherheit | 7,5 (Stichprobe) | Seite "Ist das sicher?", Einwilligungsabfrage, KI-Stimme gekennzeichnet. Nicht vertieft geprüft. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7,0 (Stichprobe) | Radiogruppen im fieldset, aria-live im Quiz, Untertitel an, prefers-reduced-motion, kein Querscrollen bei 390 px. Kontrast und Touch-Ziele nicht gemessen. |
| 10 | Fehlerfälle | 6,0 (didaktisch) | Falsche Quizantwort: erklärt, aber kein zweiter Versuch. Suche ohne Treffer: leer, siehe unten. |

Gesamtnote ist der Eindruck, nicht der Mittelwert (Mittelwert wäre 6,8; ich bleibe bei 6,8).

Würde ich es weiterempfehlen? Ja, an Neugierige und Erwachsene im Beruf, die selbst steuern können. Nicht ohne Begleitung an Klasse 8, und nicht als Kurs: Es fehlt der rote Faden, der aus 60 guten Seiten einen Lernweg macht.

## Befunde mit Belegen

### 1. Lernziele je Seite: nicht erkennbar (Note 4)
- `grep -c "Lernziel" app/static/content*.js` ergibt in allen Dateien 0. Die Seitenköpfe liefern ein `kurz` (Lead) als Frage oder Beschreibung, zum Beispiel llm-grenzen: "Hier lernst du die typischen Risiken kennen und wie du damit arbeitest." Das ist eine Themenangabe, kein überprüfbares Lernziel.
- "Das nimmst du mit" (drei Merksätze) steht am Ende. Es sichert, kündigt aber vorher nichts an. Wer vorher nicht weiß, was er können soll, kann hinterher nicht prüfen, ob er es kann.
- Die Kennzeichen im Seitenkopf (aus `kennzahlenFuer`) nennen Videos, Abschnitte und Quizfragen, aber keine Dauer. Nur Start und "Für Entscheider" haben Minutenangaben ("ca. 5 Min").
- Soll: je Lektion 2 bis 3 Lernziele als Können-Sätze ("Nach der Seite kannst du in drei Sätzen erklären, warum ein Sprachmodell Quellen erfindet"), dazu geschätzte Lesezeit. Die Merksätze am Ende bleiben und werden damit als Abgleich lesbar.

### 2. Aufbau von einfach zu komplex, Vorwissen, Lernpfade (Note 6)
Stärken:
- Die Bereiche folgen einer sinnvollen Linie: Grundlagen, Sehen (Pixel, Filter, Aufgaben), Sprache (Token, Prompting, Grenzen), RAG in sieben kleinen Schritten (Überblick, Embedding, Chunking, Suche, Reranking, Bewertung, Werkstatt), Agenten, Prognosen, Betrieb. Gleichförmiges Muster: Alltagsbild, Begriff, Technik, Grenzen, Labor.
- `weiter`-Links (3 bis 4 je Seite) und Quervernetzung im Text (`{{id|Text}}`).

Schwächen:
- Es gibt keine ausgewiesenen Voraussetzungen. rag-embedding setzt Vektoren voraus, tokens-sprachmodelle setzt Token aus dem Chat-Labor voraus, ohne es zu sagen. Der Einstieg bräuchte "Das solltest du kennen: karte, daten".
- Ein einziger Lernpfad ist für Anfänger sichtbar: "Neu hier" (3 Seiten) und der alte Pfad "Wenn du mehr willst" (5 Seiten). Danach stehen 60 Seiten in 11 Menügruppen nebeneinander. Es fehlt: "Pfad Sprachmodelle: chat, tokens-sprachmodelle, prompting, llm-grenzen", "Pfad Sehen", "Pfad RAG".
- Die Reihenfolge im Bereich Sprache führt mit den Laboren `chat` und `whisper` (je 3 bzw. 2 Abschnitte), dann folgt `tokens-sprachmodelle` mit 8 Abschnitten und 1300 Wörtern, der längsten Lektion. Der Sprung von 2 Abschnitten auf 8 ist hart.
- Business-Gewicht: 11 Seiten Use-Cases plus 3 Betrieb plus 4 Prognosen. Für Schüler gibt es keinen eigenen Alltag (Hausaufgaben, Social Media, Spiele), die Beispiele sind Fertigung, Logistik, Handel, Büro.
- Anfänger-Kennzeichnung: `anfaenger` ist nur bei 7 Seiten gesetzt (karte, ml, genki, business, gesicht, objekt, chat) und erscheint als "Für Einsteiger" im Seitenkopf. Es gibt kein Gegenstück "Fortgeschritten" und keine Stufe in der Navigation. Wer bei rag-reranking landet, erfährt nicht, dass es eine Vertiefung ist.

### 3. Seitenumfang: die wichtigsten Einstiegsseiten sind die dünnsten (Befund gegen die eigene Regel)
Auswertung der Inhaltsdateien (Wörter in `p`, `liste`, `alltag`, `merke`, `tabelle`):

| Seiten | Abschnitte | Wörter | Quiz | Merksätze | Alltagskästen |
|---|---|---|---|---|---|
| karte | 4 | 229 | 0 | 3 | 0 |
| ml | 5 | 331 | 0 | 3 | 0 |
| genki | 5 | 217 | 0 | 3 | 0 |
| robotik | 4 | 191 | 0 | 3 | 0 |
| business | 4 | 162 | 0 | 3 | 0 |
| Labore gesicht, objekt, anlernen, chat, rag, agent, whisper, bild, faceswap | 2 bis 5 | 71 bis 162 | 0 | 0 | 0 |
| hardware | 4 | 161 | 0 | 3 | 0 |
| 45 Lektionen der neuen Wellen | 7 bis 8 | 762 bis 1418 | 5 | 3 | 4 bis 8 |

Das sind 15 der 60 sichtbaren Seiten (alle alten Seiten plus Labore) ohne Selbsttest und ohne Alltagsbeispiel-Kasten, obwohl `schreibleitfaden.md` 700 bis 1300 Wörter, Quiz und mindestens jeden zweiten Abschnitt mit `alltag` verlangt. Es sind genau die Seiten, die "Neu hier" und "Für Entscheider" ansteuern (karte, chat, business). Die Qualität steigt also, je weiter man kommt, statt am Eingang am höchsten zu sein. Der Bruch ist beim Navigieren spürbar: karte hat 434 sichtbare Wörter im Kompaktmodus, llm-grenzen 877, und das Niveau wechselt von "Landkarte" zu "Fachlektion".

Gegenrichtung: Die neuen Lektionen sind lang. Ausführlich gemessen: llm-grenzen 1966 Wörter und 10657 px Höhe, rag-embedding 2379 Wörter und 12603 px (inklusive Baustein, Quiz, Videoliste). Im Kompaktmodus sind es bei llm-grenzen etwa 877 sichtbare Wörter und 7620 px, also gut die Hälfte. Das ist für Erwachsene tragbar, für Klasse 8 am Handy aber eine lange Strecke ohne Zwischenziel (siehe Punkt 6).

### 4. Wiederholung und Selbsttest (Note 5,5)
Auswertung aller Quizfragen (Skript über INHALT.seiten): 205 Fragen auf 41 Seiten, alle mit vier Optionen und Erklärung.

Gut:
- Viele Fragen prüfen Verständnis und Anwendung. Beispiele: verzerrung-ethik "Ein Gesichtserkenner hat insgesamt 98 Prozent Genauigkeit. Was lässt sich daraus sicher sagen?" (Antwort: nichts über einzelne Gruppen). bild-als-zahlen "Wie groß ist ein 1000 mal 1000 Pixel großes Farbbild im Rohformat ungefähr?" (Rechenaufgabe). uc-sicherheit-baustelle "Das Foto zeigt Arbeiter in Warnwesten. Was meldet das Modell?". ki-einfuehrung "Was ist ein guter erster Einsatzfall?" mit Begründung "Ein leichter Karton zuerst".
- Rückmeldung bei jeder Antwort mit Erklärung ("Nicht ganz. Das Modell prüft keine Fakten..."), richtige Option wird grün markiert, falsche rot. Das ist besser als bloßes Richtig/Falsch.
- Rückmeldung per `aria-live`, Optionen als echte Radio-Gruppe.

Schwach, belegt:
- **Längenhinweis:** In 176 von 205 Fragen (86 Prozent) ist die richtige Antwort die längste Option. Wer nie etwas gelesen hat, kann durch "nimm die längste" etwa 86 Prozent erraten, Zufall wäre 25. Beispiel tokens-sprachmodelle "Was lernt ein Modell im Vortraining?": richtig ist "Das nächste Token vorherzusagen, auf riesigen Textmengen", die Falschen sind "Die Namen aller Nutzer", "Wie man ein Programm installiert". Das ist ein Mess- und Lernproblem: Das Quiz belohnt Testtaktik.
- **Zu leichte Ablenker:** "Es hat zu wenig Strom" (llm-grenzen), "Das Netz liegt auf einem tiefen Speicher" (neuronale-netze), "Die Antworten aus einem Fragenkatalog". Der Schreibleitfaden verlangt "plausible Fehlvorstellungen". Das gelingt in verzerrung-ethik und rag-reranking, in vielen anderen Fragen nicht.
- **Kein zweiter Versuch:** Nach der ersten Wahl sind die Optionen gesperrt (`x.disabled = true`). Es gibt keinen Knopf "Nochmal", kein "Falsche wiederholen". Wer 0 von 5 hat (ich habe es so provoziert), liest "0 von 5 richtig." und sonst nichts: kein Hinweis auf die Abschnitte, keine Wiederholungsempfehlung.
- **Keine Verknüpfung zurück zum Stoff:** Die Erklärung nennt keinen Abschnitt ("Siehe Abschnitt: Halluzination"), kein Sprung dorthin.
- **Nichts wird gespeichert:** Das Ergebnis geht beim Verlassen verloren, also kein Lernstand, keine Wiederholung nach einigen Tagen (Spacing), kein "Du hast diese Seite schon gut gelöst".
- **Nur Einfachauswahl:** Keine Zuordnungs-, Reihenfolge-, Lücken- oder Freitextaufgaben; keine "Erkläre es in drei Sätzen"-Selbstprüfung, obwohl das Raster genau so die Lernwirkung testet. Keine Transferaufgabe ("Wo in deinem Alltag begegnet dir das?").
- **Faktenanteil:** Etwa 27 Prozent der Fragen beginnen mit "Was" (56 von 205), viele davon Definitionsabfragen. Das ist in Ordnung, wenn daneben Anwendungsfragen stehen, aber das Verhältnis ist nicht bewusst gesteuert.
- **Optionen werden nicht gemischt:** Die Reihenfolge ist fest; richtig verteilt sich auf Position 1 bis 4 mit 48/57/55/45 recht gleichmäßig (gut), aber beim zweiten Besuch kennt man sie.
- 15 Seiten haben gar kein Quiz (Punkt 3).

### 5. Fortschrittsanzeige und Orientierung (Note 5,5)
- Technisch: `besuchtMerken(id)` wird beim Aufbau der Route gerufen (app.js: route), also beim bloßen Öffnen. Gespeichert in `localStorage` `kl-besucht`. Das Menü zeigt ein Häkchen "schon gelesen". Wer eine Seite nur kurz öffnet, hat sie "gelesen".
- Es gibt keinen Fortschrittsbalken, keinen Wert "7 von 60", kein Bereichs-Prozent, kein "Weiter, wo du aufgehört hast", keinen Lesefortschritt innerhalb einer langen Seite (nur die Titelleiste, die beim Scrollen den Seitentitel einblendet).
- Der Abschluss je Seite ist nicht definiert: Gelesen, Video gesehen, Quiz bestanden, Labor bedient wären vier Signale, genutzt wird keins.
- Stark: Sticky-Titelleiste, "Zurück"-Zeile mit Verlauf, Menügruppen mit gemerktem Auf- und Zuklappen, Suche.
- Die Suche ist für Alltagswörter brauchbar (Synonyme: Foto findet "Bild als Zahlen", ChatGPT findet Sprachmodelle und "Gut fragen", Deepfake findet "Face-Swap", Urheberrecht findet "Recht und Regeln"). Lücken: "Schummeln", "Fake News", "Hausaufgabe", "Glossar" liefern null Treffer ohne Hilfetext; bei "Roboter" steht "Agent" vor der Seite Robotik; einzelne Treffer erscheinen doppelt (Agent, Bild als Zahlen). Das sind genau die Wörter, mit denen Schüler suchen.
- Das Glossar (138 Begriffe) existiert nur als Hover- und Tipptext im Fließtext. Es gibt keine Glossarseite zum Nachschlagen oder Üben, die Suche findet Begriffe zwar, aber ein Link `/glossar` fehlt.

### 6. Kognitive Last, Bilder, Text (Note 7,5)
Gut:
- Kompakt/Ausführlich-Schalter ("Kurz lesen", "Genau lesen") mit erklärendem Satz unter dem Titel, gemerkt in `kl-lesemodus`. Das ist die Differenzierung nach Tiefe, und sie ist gut gelöst: Je Abschnitt Überschrift, Bild, ein Kernsatz (`kurz`, höchstens 140 Zeichen), Rest hinter "Mehr dazu".
- Pro Lektion durchschnittlich 8 Abschnitte, 8 Bilder (jeder Abschnitt hat ein Bild, nur "recht" hat bei einem von 8 Abschnitten keins). Sieben Bildtypen wechseln, es sind erklärende Diagramme, keine Stockfotos. Texte im Bild sind Stichworte.
- Videos haben Kapitel, Abschnitte haben Alltagskästen und Merk-Kästen.

Schwach:
- Kompakt ist Standard und halbiert die Last, aber der Standard gilt für alle. Ein 13-Jähriger scrollt auf dem Handy in llm-grenzen etwa 7600 px (13 Blöcke: Video, Labor, 8 Abschnitte, Mitnehmen, Quiz, Weiter), ohne Zwischenstand.
- Der Seitenaufbau stellt Video und Labor vor die Abschnitte (Video bei etwa 610 bis 700 px, noch vor dem ersten Text). Didaktisch ist das Gegenteil von "Vorwissen aktivieren, erklären, ausprobieren": Das Labor kommt, bevor die Begriffe erklärt sind. Für Anfänger ist das oft nicht schlimm (Ausprobieren zuerst), aber es steht nirgends als Absicht, und die Seite sagt nicht "Probiere zuerst, lies danach".
- Quiz-Fragen prüfen Begriffe, die im ausgeklappten "Mehr dazu" stehen. Wer im Kompaktmodus bleibt, bekommt Fragen zu Text, den er nie aufgeklappt hat. Ein Hinweis "Für die Fragen brauchst du den Abschnitt X" fehlt.
- Textbilder: Die Bilder erklären weitgehend (Ablauf, Vergleich, Schichten). Ein sichtbarer Mangel im Video, nicht in der Seite: Standbild rag-embedding bei 20 s: die Balkenbeschriftungen "fruchtig" und "cremig" stoßen ohne Abstand aneinander, die rechte Bildhälfte ist leer.

### 7. Alltagsbezug, Transfer, Handlungsorientierung (Note 6,5)
- Alltagsbezug ist die größte Stärke: Eissorten für Embeddings, Forellen und Netz für Precision/Recall, Vokabelkarten für Epochen, Kollegin mit Zettel für Prompting, Taschenlexikon gegen Schreibtisch für das Kontextfenster. Die Bilder tragen und die Grenzen der Vergleiche werden teils benannt.
- Handlungsorientierung: 47 Seiten mit Baustein oder Demo zum Ausprobieren, "In 3 Schritten bei dir" bei den Use-Cases (abhakbar, nichts gespeichert). Das ist ein echter Pluspunkt.
- Transfer fehlt: Es gibt keine Aufgabe "Probiere es in deinem Alltag", kein Mini-Projekt (zum Beispiel "Teste drei Prompts, vergleiche, schreibe auf"), keine Reflexionsfrage. Das "Selbsterklären in drei Sätzen" (Raster) ist nicht als Funktion angelegt.
- Alltag ist betriebs-, nicht schülernah: Fertigung, Logistik, Handel. Schüler-Alltag (Hausaufgaben, Social Media, Handyfilter, Spielfiguren, Empfehlungen bei Streaming) kommt nur über "Empfehlungen" und einzelne Sätze vor.

### 8. Differenzierung nach Alter und Vorwissen (Note 5,5)
- Einzige Differenzierung: Lesemodus und das 7-Seiten-Etikett "Für Einsteiger". Keine Sprachstufe, keine Stufen Einsteiger/Fortgeschritten/Profi je Seite, keine Altersangabe außer der Datenschutz-Seite (16+).
- "Für Entscheider in 15 Minuten" ist ein gelungener Kurzpfad für eine Gruppe. Für die zweite Hauptgruppe (Schüler) und die Lehrkräfte gibt es nichts Entsprechendes.
- Siehe Abschnitt "Zielgruppenweiche" unten.

### 9. Videos (Note 7,5)
Gemessen an den Dateien (ffprobe, manifest.json, .vtt):
- 49 Videos, Länge 62,2 s (uc-logistik-zaehlen) bis 89,3 s (maschinelles-lernen), Mittel 77,3 s. Entspricht dem Soll 62 bis 89 s.
- Auflösung 1920 mal 1080, H.264 und AAC. Untertitelspur `de` ist vorhanden und im Browser standardmäßig an (textTrack.mode "showing"). Das ist für Schule (Ton im Klassenraum) und Hörschwäche wichtig und gut gelöst.
- Kapitelmarken: 5 bis 7 je Video, anklickbar, mit Hervorhebung des aktuellen Kapitels. Das entspricht einem neuen Gedanken etwa alle 13 Sekunden.
- Sprechtempo aus den Untertiteln: im Mittel 1,93 Wörter je Sekunde (etwa 116 Wörter je Minute), Spanne 1,72 (bewertung-konfusionsmatrix) bis 2,18 (rag-ueberblick). Das ist normales Hörbuchtempo und bei Neuland-Inhalten mit sechs Begriffen in 77 s zu dicht für Einsteiger. Kein Tempo-Menü in der Seite, nur die Standardsteuerung des Browsers (Wiedergabegeschwindigkeit je nach Browser versteckt).
- Kennzeichnung "Sprecherstimme KI-erzeugt" steht unter jedem Video und verlinkt auf Lizenzen. Gut und rechtlich sauber.
- Position: Das Video steht oberhalb des Seitentextes (etwa 610 bis 700 px Abstand vom Seitenanfang bei 1440 px Breite). Ein Erklärvideo am Anfang einer Lektion als "Vorab-Überblick" ist didaktisch vertretbar (Advance Organizer), sollte aber so benannt sein.
- Verweis am Ende: Die Seite zeigt über dem Video den Hinweis "Der Verweis am Ende der Folge meint diese Seite: Unten stehen die Abschnitte zur Folge, mit Bildern und zum Ausprobieren." Dieser Hinweis erklärt einen Verweis, den ich im Video nicht belegen kann: Im Standbild 2 Sekunden vor Schluss (prompting-grundlagen) steht kein Verweis, und die letzten Untertitelzeilen (zum Beispiel mcp-erklaert: "MCP ist nur das Kabel dazwischen.") enthalten keinen. Falls der Verweis eingeblendet wird, sitzt er zu spät oder zu klein, falls nicht, ist der Hinweisabsatz überflüssig. Bitte gezielt nachprüfen.
- Videoreihe (zum Beispiel prompting: 2 Folgen) mit Folgenliste und Dauer: gut. Es fehlt eine Empfehlung "erst Folge 1, dann Abschnitt X lesen".
- Es fehlen: ein Transkript zum Nachlesen (nur .vtt), eine "Danach kannst du ..."-Zeile, ein Quiz-Bezug ("Teste, ob du das Video verstanden hast"), und ein Hinweis, welcher Seitenabschnitt zu welchem Kapitel gehört.
- Positiv: Das Standbild prompting-grundlagen zeigt ein klares, lesbares Bild (Zettel mit Aufgabe/Rolle/Grund/Ton/Ausweg, Warnschild) und die Fortschrittsleiste mit Kapitelstrichen im Video. Das ist qualitativ gut.

### 10. Fachliche Korrektheit (Stichprobe, 14 Aussagen, keine Fehler gefunden)
| Nr. | Seite | Aussage (Zitat) | Urteil |
|---|---|---|---|
| 1 | karte, Zeitachse | "1956 Der Begriff entsteht", "1997 Schachcomputer schlägt Weltmeister", "2012 Tiefe Netze gewinnen Bilderkennung" | richtig (Dartmouth 1956, Deep Blue 1997, ImageNet 2012). "Alle heutige KI ist spezialisiert" ist als Überschrift sprachlich holprig, inhaltlich ok. |
| 2 | rag-embedding | "nomic-embed-text", "768 Zahlen" | richtig (768 Dimensionen) |
| 3 | rag-suche | Kosinus: "Sein Wert liegt zwischen -1 und 1", Wanderer-Bild für Richtung statt Länge | richtig; das Bild trifft die Kernidee gut |
| 4 | bewertung | "Im Beispiel 90 von 108 Alarmen, also gut 83 Prozent" (Precision), "90 von 100, also 90 Prozent" (Recall) | richtig (83,3) |
| 5 | tokens-sprachmodelle | "Deutsche Wörter brauchen im Schnitt mehr Token als englische" | richtig (tendenziell, mit "im Schnitt" korrekt abgeschwächt) |
| 6 | Glossar temperatur | "Niedrig: das wahrscheinlichste Token gewinnt fast immer" | richtig |
| 7 | Glossar halluzination | "Sie entsteht, weil das Modell Wahrscheinliches fortsetzt und keine Fakten nachschlägt." | richtig für ein Modell ohne Werkzeuge; mit RAG ändert sich das, die Seite sagt es an anderer Stelle |
| 8 | tokens-sprachmodelle, Quiz | Vortraining: "der Text liefert die richtige Lösung selbst, deshalb braucht es keine Etiketten" | richtig (selbstüberwacht) |
| 9 | cnn-intuition | Pooling: "Aus jedem Block bleibt der größte Wert übrig." | gilt für Max-Pooling; Durchschnitts-Pooling gibt es auch. Besser "meist der größte Wert (Max-Pooling)". Kleine Ungenauigkeit. |
| 10 | recht | Hochrisiko-Beispiele "Personalauswahl, Kreditwürdigkeit, Bildung, kritischer Infrastruktur"; "Einzelheiten und Fristen ändern sich, prüfe aktuelle Quellen" | richtig und vorsichtig formuliert |
| 11 | rechtliches | "Die europäische KI-Verordnung verlangt in Artikel 50, dass Menschen erkennen, wann sie mit einer KI zu tun haben ..." | richtig (Transparenzpflichten Art. 50) |
| 12 | bild-als-zahlen, Quiz | "1000 mal 1000 mal 3 Byte sind drei Millionen Byte" (3 MB) | richtig |
| 13 | tokens-sprachmodelle | "Drei Milliarden Zahlen mit je zwei Byte ergeben rund 6 GB", daneben "belegt rund 2 GB auf der Platte" (content.js, Jetson) | rechnerisch richtig, aber der Leser muss selbst erschließen, dass 2 GB eine verkleinerte Fassung meint; der Satz "darum nutzt man verkleinerte Fassungen" steht direkt dahinter. |
| 14 | verzerrung-ethik, Quiz | "98 Prozent Genauigkeit ... Nichts über einzelne Gruppen" | richtig |
| 15 | sprachausgabe, Quiz | "3,5 kg" wird "drei Komma fünf Kilogramm" (Textnormalisierung) | richtig |

Ergebnis: Kein sachlicher Fehler gefunden, eine Präzisierung (Pooling). Die Texte kennzeichnen Vereinfachungen und Rechtsunsicherheit überwiegend sauber ("grob", "meist", "keine Rechtsberatung"). Fachliche Korrektheit: 8,5. Offen bleibt die EU-Fristenlage zur KI-Verordnung, die sich laufend ändert: die Seite delegiert korrekt an aktuelle Quellen.

### 11. Lücken im Lehrplan gegenüber einer Eins-A-Plattform für KI-Einsteiger
| Thema | Stand im Labor | Lücke |
|---|---|---|
| Medienkompetenz (Deepfakes, Fake News, Bilder prüfen) | Face-Swap als Labor ("in Arbeit"), llm-grenzen nennt Halluzination. Suche nach "Fake News" ergibt nichts. | Eigene Seite "Echt oder KI?" mit Übungen (Bilder, Texte, Stimmen unterscheiden), Quellen prüfen in vier Schritten. Hoher Bedarf bei Schülern. |
| Prompt-Praxis | prompting (8 Abschnitte, 2 Videos, Werkstatt) | Gut. Es fehlt eine Übungsserie mit Bewertung ("Verbessere diesen Prompt") und eine Vorlagen-Sammlung zum Mitnehmen. |
| Ethik und Verantwortung | verzerrung-ethik, recht | Gut. Es fehlen Diskussionsfragen für den Unterricht und ein Fall zum Selbstentscheiden (Dilemma). |
| Fehler erkennen | llm-grenzen, bewertung | Gut theoretisch. Es fehlt ein praktisches Labor "Finde den Fehler in dieser KI-Antwort". |
| Quellen prüfen | in llm-grenzen angerissen | Eigene Checkliste (Wer sagt das? Beleg? Gegenprobe?) als Mini-Lektion und druckbare Karte. |
| Urheberrecht und KI | recht, Fragen im Quiz | Geplant ("spätere Welle: urheberrecht"), nicht gebaut. Für Schüler wegen Hausaufgaben, Bildern, Musik wichtig. |
| Datenschutz im Alltag | sicherheit-einfach, daten, recht | Es fehlt "Was gebe ich in einen Chatbot ein?" als einprägsame Faustregel mit Beispielen aus dem Schüleralltag. |
| Hausaufgaben, Schule, Schummeln, KI-Nutzung beim Lernen | nicht vorhanden | Seite "KI beim Lernen nutzen, ohne zu schummeln" (Lerntipps, Regeln, Grenzen). Suchbegriffe "Hausaufgabe" und "Schummeln" liefern nichts. |
| Glossar | 138 Begriffe, nur als Tooltip | Eigene Glossarseite mit Suche, Alphabet und "Teste dich"-Karten. |
| Lernpfade | 2 Pfade auf der Startseite | 4 bis 6 benannte Pfade mit Fortschritt. |
| Zertifikat und Fortschritt | `kl-besucht` Häkchen | Lernstand, Abzeichen je Bereich, optional druckbare Teilnahmebestätigung (ohne Konto, aus dem Browser erzeugt). |
| Lehrerhandreichung | nicht vorhanden | Siehe Paket B3. Kein Unterrichtsentwurf, keine Arbeitsblätter, keine Einbindung in Fachlehrplan, kein Hinweis zur Nutzung mit der Klasse am Beamer. |
| Sprachen | nur Deutsch | Für Schule in Deutschland ok, kein Befund. |

## Priorisierte Verbesserungen

Priorität A: ohne diese ist "Eins-A" nicht erreichbar. Aufwand je Paket.

| Nr. | Maßnahme | Aufwand | Wirkung |
|---|---|---|---|
| A1 | **Einstiegsseiten angleichen.** karte, ml, genki, robotik, business, hardware und die neun Labor-Seiten auf das Niveau der neuen Lektionen heben: je 5 bis 8 Abschnitte, Alltagskästen, `mitnehmen`, 4 bis 5 Quizfragen. Reihenfolge: karte, chat, business, ml, genki zuerst (das sind die Einstiegsziele). | groß (15 Seiten, aber mit vorhandener Vorlage; Labore brauchen kürzere Fassung mit "Beobachte"-Aufgaben) | Behebt den größten Bruch im Lernpfad. |
| A2 | **Lernziele und Lesezeit je Lektion.** Neues Feld `ziele: [...]` (2 bis 3 Können-Sätze) und `minuten`. Anzeige im Seitenkopf unter dem Lead. Einmal pro Seite schreiben, die Merksätze am Ende darauf abstimmen. | mittel (45 Seiten Text plus ein Renderer) | Orientierung und Selbsteinschätzung. |
| A3 | **Quiz überarbeiten.** (a) Antwortlänge angleichen: 176 von 205 Fragen anpassen (Skript findet die Fälle), (b) Ablenker auf plausible Fehlvorstellungen umschreiben, (c) Knopf "Falsche nochmal" und "Alles neu", (d) bei falscher Antwort Sprung zum passenden Abschnitt (`abschnitt`-Feld in der Frage), (e) Optionen mischen, (f) Ergebnis und Lernstand lokal speichern. | mittel (Renderer klein, Fragen groß: 205) | Macht den Test zum Lernmittel statt zur Testtaktik-Übung. |
| A4 | **Fortschritt echt machen.** "Gelesen" erst setzen, wenn bis zum Ende gescrollt wurde oder das Quiz abgeschlossen ist. Sichtbar: "7 von 60 Seiten", Prozent je Bereich im Menü, Start-Karte "Weiter, wo du aufgehört hast". Alles in `localStorage`. | klein bis mittel | Orientierung, Motivation, Wiederkehr. |
| A5 | **Lernpfade benennen.** 5 Pfade mit Reihenfolge, Zeit, Voraussetzung: "KI verstehen (30 Min)", "Sprachmodelle (2 Std)", "Sehen", "RAG", "KI im Betrieb". Auf der Startseite, im Menü und am Ende jeder Seite ("Nächste Seite im Pfad"). Voraussetzungen als Feld `vorher` mit Hinweis "Das solltest du kennen". | mittel | Aus 60 Seiten wird ein Kurs. |

Priorität B: hebt die Note von etwa 8,5 Richtung 9.

| Nr. | Maßnahme | Aufwand |
|---|---|---|
| B1 | **Seite "Echt oder KI?"** (Medienkompetenz): Bilder, Texte, Stimmen unterscheiden, Quellen in vier Schritten prüfen, Deepfake-Warnzeichen. Mit Übungsaufgaben und Auflösung. Nur eigene oder frei lizenzierte Beispiele. | mittel |
| B2 | **Glossarseite** `/glossar` mit Suche, Alphabet, Verweis auf die Seite, in der der Begriff erklärt wird, und Kartenquiz "Welcher Begriff ist gemeint?". Daten sind da (138 Einträge). | klein bis mittel |
| B3 | **Lehrerhandreichung** (eigene Seite oder druckbares Heft je Pfad): Lernziele, Zeitrahmen, Einstieg, Aufgaben, Lösungen, Differenzierung, Kamera-Hinweis (16+), Datenschutzkurzinfo, Stundenverlaufsvorschlag, Arbeitsblatt als Druckansicht. | groß |
| B4 | **Transfer- und Erklärungsaufgaben:** am Ende jeder Lektion "Erkläre es in drei Sätzen" mit Musterlösung zum Aufklappen (Selbstvergleich, keine Speicherung), und "Probiere es im Alltag" mit einer konkreten Mini-Aufgabe. | mittel (45 Seiten, aber je 2 bis 3 Sätze) |
| B5 | **Schüler-Alltag in den Beispielen:** Hausaufgaben, Social Media, Spiele, Streaming-Empfehlungen, Handyfilter. Mindestens je ein Kasten in 12 Lektionen, plus Seite "KI beim Lernen nutzen, ohne zu schummeln". | mittel |
| B6 | **Vorwissens-Aktivierung vor dem Labor:** Ein Satz "Probiere zuerst, lies danach" oder "Lies zuerst, probiere danach" je Seite, plus Einstiegsfrage ("Was vermutest du?"). | klein |
| B7 | **Suche nachziehen:** Synonyme für Schülerbegriffe (Hausaufgabe, Schummeln, Fake News, Roboter vor Agent), Hilfe bei null Treffern ("Meintest du ...? Oder starte hier: karte"), doppelte Treffer entfernen. | klein |
| B8 | **Videos:** Verweis am Ende klären (einblenden oder Hinweis streichen), Transkript auf Aufklick, Tempo-Hinweis oder Tempo-Knopf, bei Einsteigerthemen etwa 10 Prozent langsamer sprechen, Video-Kapitel mit Seitenabschnitt verknüpfen. | mittel |

Priorität C: Feinschliff.

| Nr. | Maßnahme | Aufwand |
|---|---|---|
| C1 | Erklärung der Reihenfolge Video, Labor, Text auf jeder Seite (ein Satz) oder die Reihenfolge je Seitentyp bewusst wählen. | klein |
| C2 | Quiz-Fragetypen ergänzen: Zuordnen, Reihenfolge, Lücke, "Welche Aussage stimmt nicht?". | mittel |
| C3 | Abzeichen je Bereich und druckbare Teilnahmebestätigung (clientseitig, ohne Namen oder mit frei eingetipptem Namen, nichts gesendet). | mittel |
| C4 | Wiederholungs-Tipp nach einigen Tagen ("Drei Fragen von letzter Woche") aus gespeichertem Lernstand. | mittel |
| C5 | Pooling-Satz präzisieren (Max-Pooling), "Alle heutige KI" sprachlich glätten, Standbild-Layout in rag-embedding (Balkenbeschriftung). | klein |
| C6 | Kompakt-Standard je Pfad: für Schule-Pfad kompakt, für Fachpfad ausführlich (siehe Weiche). | klein |

Die Maßnahmen A1 bis A5 (rund 3 bis 4 Pakete) und B1 bis B3 bringen den größten Zuwachs. Ohne A3 und A4 bleibt die Plattform ein Nachschlagewerk.

## Zielgruppenweiche (Zusatzfrage des Betreibers)

Frage: Ist eine Einstiegsweiche ("Wer bist du? Schule, Beruf, neugierig") mit eigener Startseite je Zielgruppe und Alterslogik didaktisch besser als Lernpfade und die Kennzeichnung Anfänger/Fortgeschritten?

### Empfehlung in einem Satz
Eine freiwillige Weiche ja, aber als Auswahl von Lernpfaden, nicht als Alterstor: nach Absicht und Rolle fragen, nie nach dem Alter, nichts außerhalb des Browsers speichern, jederzeit wechselbar, und die Kamera- und Gesichtsfunktionen für Minderjährige über den technischen Schutz regeln, nicht über die Selbstauskunft.

### Warum nicht "statt", sondern "obendrauf"
- Die Weiche ersetzt keine Lernpfade. Sie wählt nur einen aus. Ohne Pfade (A5) wäre eine Weiche eine Tür in leere Räume: Jede Zielgruppen-Startseite besteht im Kern aus einer geordneten Liste (Pfad), einer Einleitung und einem Satz zur Lesetiefe.
- Die Weiche ersetzt auch nicht die Seiten-Kennzeichnung Einsteiger/Fortgeschritten. Wer die Seite über Suche oder Link erreicht (das ist der Normalfall bei Suchmaschinen), sieht die Weiche nie. Die Kennzeichnung muss deshalb an der Seite selbst stehen: Stufe, Voraussetzung, Lesezeit.
- Eine Weiche verhindert die häufigste Überforderung: Schüler stehen vor 60 Seiten Betrieb, Betriebsinhaber vor Pixel-Filtern. Das spricht für Zielgruppen-Einstiege.
- Risiken einer Weiche: Etikettierung ("Ich bin Schüler, also nur das"), Bevormundung, mehr zu pflegende Seiten, Datenschutz bei Altersangaben, Sackgasse bei falscher Wahl.

### Sinnvolle Zielgruppen (vier, nicht acht)
Keine feinen Altersstufen als Auswahl. Alter ist ein schlechter Schalter (13-Jährige können weiter sein als 17-Jährige) und ein schlechtes Datum (Datenschutz). Besser sind Rollen und Absichten:

1. **Neugierig, ohne Vorwissen** (alle Altersstufen, Rentner, Quereinsteiger): ruhiger Einstieg, kürzeste Wege, wenig Fachwort.
2. **Schule und Ausbildung** (Sek I und II): Alltag und Medienkompetenz zuerst, Betriebsbeispiele hinten.
3. **Beruf und Betrieb** (heute der Haupteinstieg: Entscheider-Pfad, Use-Cases, Einführung).
4. **Ich unterrichte oder bilde aus** (Lehrkräfte, Ausbilder, Eltern): Handreichung, Stundenpfade, Datenschutz, Materialien.

Innerhalb von "Schule" ersetzt ein Zwei-Stufen-Pfad die Altersfrage: "Pfad Einstieg" (kurze Seiten, viel Bild, ab Klasse 7 gedacht) und "Pfad Vertiefung" (die Fachlektionen, ab Klasse 10 oder Oberstufe). Der Schüler wählt selbst, kein System entscheidet nach Alter.

### Was je Startseite steht
Nur eine Seitenvorlage, die Inhalte sind Daten (Pfadlisten und Texte), kein zweites Labor:

- **Neugierig:** "In 30 Minuten verstehen, was KI ist." Pfad karte, chat, ml, genki, prompting, llm-grenzen, dazu "Ist das sicher?". Lesemodus kurz.
- **Schule und Ausbildung:** Überschrift "KI im Alltag verstehen, ohne Vorkenntnisse". Pfad 1 (Einstieg): karte, chat, prompting (Hausaufgaben-Beispiele), llm-grenzen (Quellen prüfen), "Echt oder KI?" (neu), verzerrung-ethik, recht (Kurzfassung). Pfad 2 (Vertiefung): daten, neuronale-netze, training, bewertung, bild-als-zahlen, cnn-intuition. Lesemodus kurz, Quiz sichtbar, Bausteine ohne Kamera zuerst. Eine Zeile "Frag deine Lehrkraft, wenn du Kamera-Labore nutzen willst."
- **Beruf und Betrieb:** der bestehende Entscheider-Pfad (15 Minuten), dazu Use-Cases nach Branche, mlops, kosten-energie, ki-einfuehrung. Lesemodus nach Wahl.
- **Lehrende:** "Material für den Unterricht": Stundenverläufe (45 Minuten) je Pfad, Druckansichten, Lösungen, Hinweise zu 16+ und Kamera (Handreichung B3), Vorschlag für Gruppenarbeit mit einem Gerät am Beamer, Link "Klassenlink" (siehe unten).
- Gemeinsam auf jeder: ein Satz "Du kannst jederzeit alles ansehen", ein Link "Alle Bereiche", eine Zeile zum Datenschutz.

### Alterslogik: so, dass sie nicht bevormundet
1. **Keine Altersabfrage.** Weder Geburtsjahr noch "unter 16 ja/nein" als Pflichtfeld. Wer ein Alter angeben muss, lügt oder bricht ab, und die Eingabe wäre selbst ein Datum, das man rechtfertigen müsste. Gefragt wird: "Wofür bist du hier?" mit den vier Rollen.
2. **Technischer Schutz statt Selbstauskunft für Kamera und Gesichtserkennung.** Weil die Einwilligung nach Art. 8 DSGVO für unter 16 rechtlich noch zu klären ist (siehe Plan, nur melden), gilt für alle: Kamera-, Mikro- und Gesichts-Labore laufen nur nach ausdrücklicher Einwilligung (heute schon), und im Pfad "Schule" werden sie nicht als erste Wahl angeboten. Statt der Gesichtsfunktion bietet der Schulpfad gleichwertige Labore ohne Personenbezug (Objekterkennung an Beispielbildern aus `beispiele/`, Bild-als-Zahlen, Filter-Labor). Das ist keine Sperre, sondern ein anderer Standard; die Gesichtsseiten bleiben über die Navigation erreichbar, mit einem Hinweis vorab ("Dieses Labor zeigt dein Gesicht. Bei unter 16 bitte nur mit Lehrkraft oder Eltern."). Die endgültige Rechtsbewertung (ob ein Hinweis reicht oder eine Sperre nötig ist) liegt beim Betreiber und beim Datenschutz.
3. **Sprachniveau ohne zweite Textfassung.** Keine Parallel-Texte für Schule (doppelte Pflege, Fehlerquelle). Stattdessen: ein Textstand mit Standard "kurz lesen", Glossar-Tooltips, ein Leichtigkeits-Check (Satzlänge, Fachwortdichte) für die zehn Einstiegsseiten, und Schülerbeispiele als zusätzliche Alltagskästen. Wenn später nötig, genau eine Kurzfassung je Pfadseite.
4. **Lesemodus als Standard je Pfad,** aber änderbar. Ein einmal gesetzter Schalter in der Titelleiste gilt (heute `kl-lesemodus`) und hat Vorrang vor dem Pfad-Standard.
5. **Immer ein Ausweg:** Auf jeder Seite ein Link "Weg wechseln" im Fuß oder in der Leiste, und jede Seite bleibt direkt per URL erreichbar. Nie eine Seite sperren, weil "falsche Gruppe". Ausnahme: nur die technische Einwilligung (Punkt 2).
6. **Keine Etiketten im Ton:** Keine Anrede "für Kinder", keine Maskottchen-Sprache für Schule. Formulierung "Schule und Ausbildung", nicht "Schüler". Jugendliche merken Bevormundung sofort, und Erwachsene wollen nicht "Anfänger" heißen.
7. **Nicht überfragen:** Wer die Weiche übergeht (zum Beispiel über eine Suchmaschine auf eine Lektion), sieht keine. Auf der Startseite steht sie als Karten-Reihe mit "Neu hier?", nicht als Vollbild-Dialog.

### Datenschutz der Weiche: nichts außer lokal im Browser
- Speicherung nur in `localStorage` unter einem Schlüssel wie `kl-weg` (Wert: eines von vier Wörtern, kein Alter, keine ID, kein Zeitstempel). Kein Cookie, kein Server-Aufruf, kein Zähler, keine Auswertung mit Pfad.
- Kein Zusammenhang mit der Einwilligung: `kl-einwilligung` bleibt davon getrennt.
- Der Seitentext der Datenschutz-Seite ergänzt einen Satz: "Wenn du einen Weg wählst, merkt sich das nur dein Browser."
- Für Klassen ohne Speicherung auf Schulrechnern: **Klassenlink** mit URL-Parameter (`/?weg=schule`), den die Lehrkraft verteilt. Der Parameter wird nur im Browser gelesen, nicht gespeichert (außer optional als Standard für diese Sitzung in `sessionStorage`) und nicht in Server-Protokolle geschrieben, soweit der Server Query-Strings in Logs maskiert (prüfen). Das löst auch Geräte mit gelöschtem Speicher.
- Bei gelöschtem Speicher oder privatem Fenster fällt die Weiche auf "keine Auswahl" zurück: Standardstartseite wie heute. Das darf nie ein Fehler sein.
- Keine Wiedererkennung über Seiten hinweg, keine Weitergabe der Rolle an Statistik (Umami zählt heute Seitenaufrufe; die Weiche darf dort nicht als Ereignis auftauchen).

### Bewertung gegenüber Alternativen
| Option | Stärke | Schwäche | Urteil |
|---|---|---|---|
| Nur Lernpfade und Kennzeichnung | wenig Pflege, nie sperrend | Schüler und Lehrkräfte fühlen sich nicht angesprochen, 60 Seiten Menü | zu wenig für Eins-A |
| Pflicht-Weiche mit Altersabfrage | klare Logik | Bevormundung, Datenschutzrisiko, Falschangaben, rechtlich nicht sauberer (Art. 8 DSGVO bleibt) | abraten |
| Freiwillige Rollen-Weiche plus Pfade plus Seitenkennzeichnung | angesprochen, nie gesperrt, kaum Datenschutzlast | etwas Mehraufwand für Pfade und Startseitenvorlage | **empfohlen** |

Reihenfolge der Umsetzung: erst A5 (Pfade) und A2 (Lernziele, Lesezeit), dann eine Startseitenvorlage mit vier Karten (klein bis mittel), dann Schulpfad mit Echt-oder-KI (B1) und Lehrerhandreichung (B3). Die Weiche steht am Ende dieser Kette, nicht am Anfang, weil sie ohne Inhalt dahinter wenig bringt.

### Test vor dem Bau (günstig)
Mit drei Schülern und einer Lehrkraft die Karten-Reihe als Papierprototyp zeigen: Verstehen sie "Schule und Ausbildung"? Fühlen sie sich geführt oder abgestempelt? Entscheidend ist, ob jemand "falsch" wählt und das merkt. Danach die vier Beschriftungen anpassen.

## Die drei größten Lücken Richtung Eins-A
1. **Kein geführter Lernweg:** Lernziele, Voraussetzungen, Pfade und ein echter Fortschritt fehlen. Dadurch lernt man nur, wenn man schon weiß, wohin.
2. **Der Einstieg ist der dünnste Teil:** Die 15 ältesten Seiten (karte bis hardware und alle Labore) haben weder Quiz noch Alltagskasten, genau dort beginnen Anfänger.
3. **Selbsttest und Transfer taugen nur halb:** 86 Prozent der Fragen lassen sich über die Antwortlänge lösen, es gibt keinen zweiten Versuch, keine Rückverweise und keine Erklär- oder Anwendungsaufgabe.

## Was wirklich gut ist (damit es erhalten bleibt)
- Kompakt/Ausführlich-Schalter und Bild-zuerst-Abschnitte.
- Alltagsvergleiche, die tragen (Eissorten, Forellen, Kollegin mit Zettel).
- Inhaltliche Sorgfalt: kein Sachfehler in 15 geprüften Aussagen, Rechtliches vorsichtig.
- Videos: gleichmäßige Länge, Kapitel, Untertitel an, KI-Stimme gekennzeichnet.
- Suche mit Synonymen, Zurück-Navigation, gemerktes Menü, kein Querscrollen bei 390 px.
- Datenschutz in Alltagssprache.
