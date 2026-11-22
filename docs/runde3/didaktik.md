# Prüfrunde 3: Didaktik-Fachprüfer (Lehrplan, Lernwirksamkeit, Aufbau, Materialqualität)

Stand: 22.11.2026. Geprüft gegen https://192.168.178.83:8443 mit Chromium über tests/browser.mjs (Desktop 1440x900, überwiegend hell, Stichproben dunkel). Gelesen: app/static/content-schule.js, content-schule-medien.js, app/static/app.js (Quiz, Lernziele). Alle 24 PDFs (10 Arbeitsblätter, 10 Lösungsblätter, Kartenset, Elternabend-Infoblatt, Elternabend-Leitfaden) wurden vom Server geladen (identisch mit den Dateien im Repo), mit pdftotext vollständig gelesen und mit pdftoppm als Bild angesehen (Kartenset, Elternabend, KI 1 Arbeits- und Lösungsblatt, Medien 3 und 6 als Bild; die übrigen als Text). Screenshots liegen in `docs/runde3/didaktik-bilder/` (12 Browserbilder, 5 PDF-Ansichten). Keine Sprachmodell-Anfrage gestellt, keine Ratenbegrenzung. Keine Code-Änderung, kein Commit.

Grenze: Videos, Kamera-Labore und RAG-Seiten habe ich diesmal nicht erneut geprüft, die Runde-2-Befunde dazu gelten unverändert als Stand. Der Punkte-Labor-Test beschränkte sich auf Klick und Rückmeldung.

## 1. Gesamtnote: 7,8 von 10 (Vorrunde 6,8)

Das Labor hat seit der Vorrunde einen echten Sprung gemacht: Es gibt jetzt Rollenwahl, ein Lehrenden-Menü, zehn fertig verwendbare Unterrichtseinheiten mit Arbeits- und Lösungsblatt, Operatoren, Differenzierung, Hilfekarten, Doppelstunden-Plan, Kartenset und Elternmaterial. Das ist für ein kostenloses Angebot ungewöhnlich vollständig. Auf die 8,5 fehlen drei Dinge: ein Quiz, das Testtaktik belohnt (jetzt in 27 von 30 Schul-Fragen messbar), kleine, aber sichtbare Inkonsistenzen in den Materialien (Einzelstunden-Plan, "2 Seiten", fehlende Punkt am Satzende) und kein Bezug zu einem Kompetenzrahmen (KMK) und keine zweite Klassenstufe.

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter | 8,0 | Arbeitsblätter in kurzen Sätzen, Operator je Aufgabe, Fachwörter erklärt. Ein Text für Klasse 8, keine Sprachstufe. Aufgabentexte sind teils verschachtelt (Medien 3, Aufgabe 1: Fall, zwei Aufträge, Lösungsweg in einem Absatz). |
| 2 | Einstieg und Führung | 8,5 | Willkommens-Fenster mit sechs Rollen (01), "Ich unterrichte" führt in 2 Klicks und etwa 3 s zu "Für morgen im Unterricht" und einem Menü mit 13 Einträgen (02). Lernziele als Aufklapp-Zeile je Seite (03). Abzug: "ca. 1 Min Lesen" auf 45-Minuten-Seiten. |
| 3 | Lernwirkung | 7,0 | Aufgaben, Selbsteinschätzung, Quiz, Nachdenken, Merksatz, eigene Frage: gute Struktur. Quiz weiter einmalig, ohne Wiederholung, 90 Prozent über die Antwortlänge lösbar (Befund 1). Zum Nachdenken ohne Musterlösung. |
| 4 | Motivation und Spaß | 7,5 | Labore, Kartenset mit echten und KI-Bildern, Poster-Runde. Nichts Sammelbares, Fortschritt ist nur ein Balken im Menü. |
| 5 | Labore und Interaktion | 8,0 | Punkte-Labor gibt sofort Text-Rückmeldung ("Es gibt erst 2 Punkte, mehr können nicht abstimmen", 12). Leere Zeichenfläche ohne Hinweistext im Feld selbst. |
| 6 | Videos | 7,5 | nicht neu geprüft, Stand Runde 2. |
| 7 | Navigation und Orientierung | 7,5 | Menü je Rolle und "Alle Bereiche" zugeklappt, Menüsuche findet "Arbeitsblatt" (10 Schulseiten, 10). Suche "Doppelstunde" liefert "nichts gefunden" (Befund 8). Unbekannte Adresse zeigt still die Startseite (14). |
| 8 | Vertrauen und Sicherheit | 8,0 | Quellen und Abrufdatum auf jedem Blatt, "Stand 22.11.2026", Kein-Rechtsrat-Hinweise, Elterninfo in Sie-Form mit Datenangaben. Lösungsblatt öffentlich erreichbar (Befund 9).  Eine Lizenz für die Blätter steht in den PDFs nicht (Fußzeile nennt nur Quellen der Operatoren). |
| 9 | Barrierefreiheit und Bedienbarkeit | 7,5 | Radiogruppen, Lesemodus, helle und dunkle Ansicht gut lesbar (07, 08). Quizantwort wird mit Farbe und Rand markiert, ohne Symbol. Schmale Kontrastflächen in Hellmodus bei grauem Zusatztext. |
| 10 | Fehlerfälle | 7,0 | Falsche Quizantwort wird erklärt, aber kein zweiter Versuch (06). Unbekannte Adresse ohne Meldung. |

Materialqualität im Einzelnen (Sonderkriterium dieser Runde):

| Material | Note | Kurz |
|---|---|---|
| Arbeitsblätter (10) | 8,0 | 3 Seiten, einheitlich, Selbsteinschätzung, Niveau-Symbole, Sozialform, Zeitangabe je Aufgabe, QR-Code, Quellen. Quiz-Verzerrung, wenige Schreibzeilen, Seitenumbrüche. |
| Lösungsblätter (10) | 8,0 | Zeitplan 45 und 90 Minuten, Operatoren, Erwartungshorizont, Differenzierung leichter/schwerer, Hilfekarten, Tafelbild. Fehler in der Quiz-Lösung (Satzende), Nachdenken ohne Antwortrahmen. |
| Kartenset (12 Bilder) | 7,5 | Gute Mischung (6 echt, 6 KI), Quellen und Lizenzen im Lösungsblatt. Keine Sortierunterlage mit den Stapelnamen, keine Schwierigkeitsstufung. |
| Elternabend (Infoblatt, Leitfaden) | 8,0 | Klare Sie-Form, ein Blatt, Beschwerdeweg (116 111, JUUUPORT), QR-Codes. Seitenangabe im Link falsch. |

## 2. Vergleich zur Vorrunde

Besser:
- Einstiegsweiche mit Rollen, unscharfer Hintergrund, schließbar (01). Die Vorrunde hatte nur "Neu hier" und "Für Entscheider". Genau das war meine Zielgruppenweiche-Empfehlung, und sie ist als freie Auswahl mit "Später" und Datenschutzzeile umgesetzt.
- Lernziele je Lektion mit Lesezeit (Vorrunde A2): auf allen Schulseiten, im Seitenkopf als Aufklapp-Zeile (03).
- Fortschritt: Balken "Noch nichts gelesen" im Menü, "gelesen" zählt erst am Seitenende oder nach dem Quiz (app.js Kommentar Zeile 37). Vorrunde A4 ist im Kern erledigt.
- Lehrmaterial (Vorrunde B3): Handreichung, 3 KI-Stunden plus 7 Medien-Einheiten, Elternabend, Kartenset "Echt oder KI?" (Vorrunde B1). Alle mit Operatoren und Anforderungsbereichen.
- Schüleralltag in den Beispielen (Hausaufgaben, Feed, Datenschutz): Medien 4, 5, 7 (Vorrunde B5).
- Suche findet "Arbeitsblatt" und die Schulseiten; "Hausaufgaben" ist als Vorschlag da.
- Sprachstufe/Lesemodus und Textmenge: Kompakt zeigt Kernsatz je Abschnitt, Aufgaben stehen im Genau-Modus komplett (05).

Gleich:
- Quiz (Vorrunde A3): keine Wiederholung, kein Mischen, kein Rückverweis auf den Abschnitt, Ergebnis nicht gespeichert, nur Einfachauswahl. Der Längenhinweis ist schlimmer geworden: 27 von 30 Schulfragen (90 Prozent) haben die längste Antwort als richtige, Vorrunde 86 Prozent bei den Lektionen.
- Keine Transfer-/Erklärungsaufgabe im Web, nur auf dem Blatt ("Zum Nachdenken").
- Videos nicht verändert geprüft.

Schlechter: nichts. Neue Schwächen betreffen nur Neues (Materialien, Schulseiten).

## 3. UX- und UI-Befunde nach Schwere

Blocker: keine.

Hoch
1. **Quiz belohnt Testtaktik, in den neuen Materialien noch stärker.** Auswertung der 30 Fragen aus content-schule.js und content-schule-medien.js (Skript über das Quiz-Feld): richtige Antwort ist die längste in 27 von 30 Fragen (90 Prozent, Zufall 25). Position: B ist in 19 von 30 richtig (63 Prozent), D nur in 1. Beispiele: Medien 6, Frage 1: richtig 88 Zeichen, die anderen 18, 23, 10; Medien 3, Frage 2: 77 gegen 32, 33, 35; Medien 1: 56 gegen 22, 26, 29. Viele Ablenker sind offen unsinnig ("Aufgeben", "Gar nicht mehr", "Handy ausschalten", "Alles ist verboten", "Du bist selbst schuld", "Sie hat ein rundes Symbol"). Wer nur "nimm die längste" oder "nimm B" befolgt, besteht 19 bis 27 von 30. Auf dem Arbeitsblatt (Quiz auf Seite 2) kommt das Gleiche ungemischt an, Beleg: pdf-01 und pdf-05. Das entwertet Quiz und Lösungsblatt-Erklärungen. Auch die Web-Quiz hat keinen "Nochmal"-Knopf und mischt nicht (app.js quizBlock, Zeilen 905 bis 930; 06).
2. **Einzelstunden-Plan widerspricht sich in allen 10 Lösungsblättern.** Der Plan für 45 Minuten enthält "Reflexion 10 Min: Drei Fragen" (das sind die Nachdenken-Fragen). Direkt darunter steht: "Bei einer Einzelstunde (45 Minuten) genügt der Zeitplan oben: Aufgaben und Sicherung in der Stunde, Quiz und Nachdenken als Hausaufgabe." Beides geht nicht. Außerdem steht im 45-Minuten-Plan das Quiz gar nicht, es erscheint nur im 90-Minuten-Plan. Die Lehrkraft muss entscheiden, was ausfällt. Beleg: loesung-stunde-1.txt, loesung-medien-1.txt (pdf-02).
3. **Zeitangabe "ca. 1 Min Lesen" auf Unterrichtsseiten.** Seitenkopf KI 1, Medien 1, Elternabend: "ca. 1 Min Lesen" (03, 07, 08), auf den Karten der Startseite "ca. 4 bis 5 Min Lesen" (02), im Titel steht "45 Minuten". Drei verschiedene Zeitangaben für dasselbe, und die gedruckte Zeit der Stunde ist keine Lesezeit. Für Lehrende ist das irreführend (sie planen "1 Minute").
4. **Nachdenken-Fragen ohne Erwartungshorizont.** Das Lösungsblatt wiederholt unter "Fragen für die Reflexion" nur die Fragen (pdf-02, Seite 3). Aufgaben 1 bis 3 und Quiz haben Lösungen, die Nachdenken-Fragen 4 bis 6 nicht, obwohl "Was würde passieren, wenn alle Beispiele aus einer Ecke kämen?" (KI 1) eine klare Musterantwort hat (Verzerrung). Gleiches bei allen Medien-Einheiten.

Mittel
5. **Differenzierung steht nur im Lösungsblatt, nicht im Material der Schüler.** Das Arbeitsblatt zeigt Niveau als ■□□ bis ■■■ je Aufgabe und eine unerklärte Zeile "Niveau: Basis Standard Herausforderung" (pdf-01). Satzbausteine für Schwache ("Das Labor entscheidet nach ___, weil ___") und die Hilfekarten stehen nur auf Lösungsseite 3, zum Ausschneiden. Eine Lehrkraft muss sie kopieren und einzeln schneiden. Es gibt kein druckfertiges Hilfekarten-Blatt und kein Blatt "Basis" mit Lückensatz. Positiv: die Verteilung Basis, Standard, Herausforderung auf Aufgabe 1 bis 3 (05) und der Zusatz "für Schnelle".
6. **Operator "Nenne" fehlt in der Tabelle von KI 1, taucht aber im Differenzierungsvorschlag des Lösungsblatts auf** ("Bei den Operatoren Nenne (I) und Beschreibe (I) bleiben"). Die Schüler sehen "Nenne" auf diesem Blatt nicht erklärt. Die Tabellen sind sonst je Blatt passend zusammengestellt.
7. **Satzende fehlt in der Quiz-Lösung.** "Frage 1: B. Es sucht die nächsten Beispielpunkte und nimmt die Mehrheitsfarbe Das Labor vergleicht mit den nächsten Beispielen ..." (alle 10 Lösungsblätter, pdf-02, Seite 2). Der Antworttext und die Erklärung laufen ohne Punkt zusammen und lesen sich wie ein Satz.
8. **Suche: "Doppelstunde" liefert "Dazu habe ich nichts gefunden",** obwohl jedes Lösungsblatt einen Doppelstunden-Plan hat und der Start damit wirbt ("Plan für Einzel- und Doppelstunde", 02). "Arbeitsblatt" findet die zehn Seiten (10). Beim Tippen bleibt in der Seitenleiste eine leere graue Balkenzeile über den Treffern stehen (10).
9. **Lösungsblatt ist für alle erreichbar.** Auf jeder Stundenseite steht die Karte "Lösungsblatt, für dich" neben dem Arbeitsblatt (03, 07), und die Seiten sind nicht nur für Lehrende gedacht. Schüler laden die Lösungen mit einem Klick (Link /static/materialien/loesung-stunde-1.pdf). Das ist bei einem Angebot ohne Konto nicht lösbar, aber unerwähnt. Rat: im Handbuch benennen, oder die Lösungsblätter nur über die Handreichung verlinken.
10. **PDF-Seitenumbrüche und Layout.** (a) KI 1: Überschrift "Zum Nachdenken" steht unten auf Seite 2, Frage 6 oben auf Seite 3 allein (pdf-01). (b) Medien 6: "Quiz: Was hast du verstanden?" mit Anweisung steht am Seitenende, die Fragen erst auf Seite 2 (pdf-05). (c) Medien 3: untere Seitenhälfte von Seite 1 leer, obwohl Aufgabe 1 (Falltext, zwei Aufträge) nur zwei Schreibzeilen hat. (d) Titel auf zwei Zeilen ("Fake News und Deepfakes") drückt den Kopf neben den QR-Code. (e) Zusatzzeichen "·" am Ende von "Zeit: ... eine Doppelstunde ·" sieht aus wie ein Satzfehler. (f) Umgebrochene Antwortoptionen im Quiz (Medien 3 Frage 2 B, Medien 6 Frage 1 B) rücken nicht unter den Text ein (pdf-05).
11. **Seitentitel uneinheitlich und lang.** Seite: "Medien-Einheit 1: Echt oder KI? Bilder sortieren und begründen" (dreizeilig bei Elternabend), Menü: "Medien 1: Echt oder KI?", PDF: "Arbeitsblatt Medien 1: Echt oder KI?", Karte: "Medien 1: Echt oder KI?". Drei Namensformen für dieselbe Einheit (03, 07, 08, 02).
12. **Kein Bezug zu einem Kompetenzrahmen.** Operatoren sind mit Quellen belegt (RLP, IQB, BW-Bildungsplan, Abrufdatum), aber es gibt weder KMK-Strategie "Bildung in der digitalen Welt" noch Bezug auf ein Fach/Lehrplan (grep: 0 Treffer "KMK" in content-schule*.js; docs/lehrplan.md ist das interne Lehrplan-Dokument, nicht im Material). Lehrende müssen Bezug und Stundenziel selbst ableiten.
13. **Eine Klassenstufe.** Alle zehn Einheiten sind "45 Minuten für Klasse 8". Für Klasse 7 und 9 steht keine Anpassungshilfe, Oberstufe bedient nur der Weg "Ich arbeite in der IT". Das ist für den Start vertretbar, aber im Selbstverständnis ("Schule und Ausbildung") zu eng.

Klein
14. Startseite für Lehrende: zwölf gleich große Karten ohne Hervorhebung "heute", Lesezeit pro Karte ("ca. 5 Min Lesen"), Karte "Klassenlink" mit abgeschnittener Adresse (02b). Kein "Alles herunterladen" und keine Direkt-Downloads auf der Startseite; die PDFs sind nur auf den Einzelseiten.
15. Downloadkarten: bei drei Dateien (Medien 1) umbricht das Kartenset in eine zweite Zeile allein (07), Titel "Kartenset Echt oder KI?" bricht mitten. Der Text "2 Seiten, für Sie" beim Leitfaden stimmt nicht, das PDF hat eine Seite (08, pdf-04).
16. Im Punkte-Labor: leere Zeichenfläche ohne Hinweis im Feld ("Klicke hier, um Punkte zu setzen"), die Anleitung steht darüber (12).
17. Unbekannte Adresse (#/gibtesnicht) zeigt ohne Meldung die Startseite (14).
18. Arbeitsblatt-Selbsteinschätzung "sicher / fast / noch nicht" hat keine Folge (kein Hinweis im Lösungsblatt, was bei "noch nicht" passiert).
19. Dateinamen: Download heißt `ki-labor-arbeitsblatt-stunde-1.pdf`, der Seitenname "KI 1", das PDF "Arbeitsblatt KI 1". Brauchbar, aber "stunde-1" und "medien-1" lassen sich beim Sortieren nicht gemeinsam lesen. Klein.

## 4. Zielaufgaben der Didaktik-Prüferin

| Aufgabe | Gelöst? | Klicks, Sekunden |
|---|---|---|
| Rolle "Ich unterrichte" wählen, Material für morgen finden | Ja | 2 Klicks, etwa 3 s bis "Für morgen im Unterricht" (02). |
| Arbeitsblatt KI 1 herunterladen | Ja | 3 Klicks (Karte, Öffnen, Herunterladen), Link und Dateiname korrekt (03). |
| Alle Arbeitsblätter plus Lösungen prüfen (10 plus 10) | Ja, alle 20 laden, 3 Seiten, Textebene vorhanden | je 3 Seiten, 60 dpi gesichtet (pdf-01 bis 05). |
| Doppelstunde planen | Ja, im Lösungsblatt | Suche nach "Doppelstunde" scheitert, Zugriff nur über Seite. |
| Einzelstunde planen | Nur mit Widerspruch | Befund 2. |
| Differenzierung vorbereiten | Teilweise | Texte da, aber nicht druckfertig. Befund 5. |
| Elternabend vorbereiten | Ja | Infoblatt + Leitfaden + Fragen, 2 Klicks von der Startseite. Seitenangabe falsch (Befund 15). |
| Quiz lösen, Fehler provozieren | Ja | Falsche Antwort wird erklärt, kein zweiter Versuch (06). |
| Suche mit Fachbegriffen | Teilweise | Arbeitsblatt, Elternabend, Kartenset, Operatoren: Menü filtert; "Doppelstunde" liefert nichts. |

## 5. Empfehlung und größte Lücken

Würde ich es weiterempfehlen? Ja, ohne Vorbehalt an Lehrkräfte der Klasse 8, die ein Paket mit Blättern, Plan und Elternmaterial suchen, das sofort einsetzbar und kostenlos ist; das Preis-Leistungs-Verhältnis (zehn Einheiten, Quellen, Doppelstunden) ist besser als bei den meisten Schulverlagen im Gratisbereich. Als Lernplattform für Einzelne bleibt es gut, solange das Quiz nicht als Leistungsmessung dient.

Die drei größten Lücken Richtung 10:
1. **Quiz neu bauen:** Längen angleichen, Ablenker plausibel machen, Positionen mischen (auch auf dem Blatt), "Nochmal" und Rückverweis auf den Abschnitt, Ergebnis lokal speichern. Ein Quiz-Skript, das Länge und Position prüft, gehört in die Tests (27 von 30 und B 19 von 30 sind eine messbare Schwelle).
2. **Die Materialien konsistent machen:** Einzelstunden-Plan klären (Quiz, Nachdenken), Erwartungshorizont für Nachdenken, Satzende in der Quiz-Lösung, Seitenumbrüche (Medien 6, KI 1), druckfertiges Hilfekarten- und Basis-Blatt, korrekte Seitenangabe beim Leitfaden, einheitliche Namen für Einheiten, "Lesezeit" auf Unterrichtsseiten durch "Stundenlänge" ersetzen.
3. **Lehrplanbezug und Breite:** KMK-Kompetenzen (und, wo möglich, Fachlehrplan) je Einheit benennen, Anpassung für Klasse 7 und 9, Hinweis auf die Erreichbarkeit der Lösungsblätter, Suche nach "Doppelstunde", "Lösung", "Hilfekarte".

## Anhang: Screenshots

Browser (`docs/runde3/didaktik-bilder/`):
- `01-willkommen.png`: Willkommens-Fenster, sechs Rollen, Schalter, "Später", Datenschutzzeile.
- `02-start-lehrend.png`, `02b-start-lehrend-voll.png`: Startseite für Lehrende, Menü "Für dich", 12 Karten.
- `03-stunde1-oben.png`: KI 1 Seitenkopf, Lernziele, Download-Karten.
- `05-stunde1-aufgaben-genau.png`: Aufgaben mit Sozialform und Niveau im Genau-Modus.
- `06-quiz-falsch.png`: falsche Antwort, rot und grün, Erklärung, kein Nochmal.
- `07-medien1-dunkel.png`, `08-elternabend-dunkel.png`: Dunkelmodus, Download-Karten.
- `09-handreichung.png`: Handreichung Lehrkräfte.
- `10-suche-arbeitsblatt.png`: Menüsuche mit leerer Balkenzeile.
- `12-punkte-labor-klick.png`: Punkte-Labor mit Rückmeldung.
- `14-unbekannte-seite.png`: unbekannte Adresse zeigt Startseite.

PDF-Ansichten: `pdf-01-arbeitsblatt-ki1.png`, `pdf-02-loesung-ki1.png`, `pdf-03-kartenset.png`, `pdf-04-elternabend.png`, `pdf-05-arbeitsblatt-medien3.png` (Medien 3 und Medien 6).

Chromium: ein eigener headless Chromium je Skriptlauf, am Ende geschlossen; ein beim Abbruch eines Laufs (Timeout) möglicherweise verwaister Prozess lief nicht, der später sichtbare Chromium (Elternprozess ein anderes Node-Skript) gehört nicht zu mir und wurde nicht angetastet.
