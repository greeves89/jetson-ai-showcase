# Prüfbericht Runde 4: Herr Schulz (52, Gymnasiallehrer Mathe/Physik, iPad 820x1180)

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443, ein headless Chromium (Playwright, `tests/browser.mjs`), hell und dunkel, mit Erstbesuch und Willkommens-Fenster. 22 Screenshots in `docs/runde4/schulz-bilder/`, alle angesehen. Drei PDFs mit `pdftoppm -r 60` und `-r 90` geöffnet, dazu eine Graustufen-Probe für den Schwarzweißdruck. Jetson: zwei Sprachmodell-Aufträge (Prompt-Werkstatt "Beide senden", ein Chat), dazwischen mehr als 10 Sekunden Pause, keine Ratenbegrenzung aufgetreten.

## Gesamtnote: 8,2 von 10 (Ziel 8,5 knapp verfehlt)

Herr Schulz findet fast alles, was er braucht, und das Material ist für Lehrkräfte erstaunlich gut: fertige Pläne, Operatoren, Hilfekarten, Differenzierung. Abzüge gibt es für zwei Dinge. Die Doppelstunde steht nur im PDF und nirgends auf der Seite. Und die Lehrkraft-Seiten sprechen ihn im Ton der Schüler an und sind auf dem iPad in einigen Bedienelementen zu klein.

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter (hier: für eine fachfremde Lehrkraft) | 8,5 | Kurze Sätze, Fachwörter erklärt (Handreichung "Fachbegriffe in einfachen Worten"). Mischton: Lehrerseite sagt "Du fährst im Punkte-Labor ..." und "Das nimmst du mit". |
| 2 | Einstieg und Führung | 8,5 | Willkommen: "Ich unterrichte" (1 Klick) führt zu "Für morgen im Unterricht" mit 15 Kacheln, Zeitangabe "45 Minuten Unterricht" je Kachel. |
| 3 | Lernwirkung | 8,0 | Stundenaufbau mit Zeitplan, Tafelbild, Merksatz, Reflexionsfragen mit Erwartungshorizont. Nur ein Quiz mit drei Fragen je Stunde. |
| 4 | Motivation und Spaß | 8,0 | Punkte-Labor reagiert sofort sichtbar. Prompt-Werkstatt zeigt Bausteine mit Haken. Vorlagen der Werkstatt sind aber Büro-Themen (Kundenmail, Angebote vergleichen). |
| 5 | Labore und Interaktion | 8,5 | Punkte-Labor: 20 Punkte und Entscheidungsfläche in unter einer Sekunde, Text erklärt die Abstimmung der Nachbarn. Chat zeigt "Der Jetson rechnet seit 4 s ... Mit Stopp kannst du abbrechen", erstes Token nach 7,0 s, Tempo 4,0 Token je Sekunde. |
| 6 | Videos | 7,5 | Video "Maschinelles Lernen" 1:29 mit Kapitelliste und Hinweis, was der Verweis am Ende meint. Untertitel und Ton habe ich als Lehrkraft nicht im Detail geprüft. |
| 7 | Navigation und Orientierung | 8,0 | Menü, Suche ("Doppelstunde" findet Handreichung und KI 1 bis 3), Pfad "Schritt 1 von 17". Der Pfad ist für einen vollen Stundenplan lang. |
| 8 | Vertrauen und Sicherheit | 8,5 | Klassenlink "Ohne Kamera", "Auf den Geräten wird nichts gespeichert", Daten-Abschnitt auf "Schule: Einstieg". |
| 9 | Barrierefreiheit und Bedienbarkeit | 7,5 | Tab-Reihenfolge sinnvoll, Skip-Link da, Fokusrahmen sichtbar. Aber 21 Bedienelemente unter 44 Pixel (Fußzeilenlinks 20 Pixel hoch, Quiz-Rundknöpfe 13x13) bei einem Touchgerät. |
| 10 | Fehlerfälle | 8,0 | Leere Chat-Eingabe: "Schreib zuerst eine Frage." Unbekannte Adresse: "Seite nicht gefunden" mit Weg zur Startseite, aber ohne Suche und ohne Vorschläge. |

Weiterempfehlung: Ja, an Kolleginnen und Kollegen mit Klassen ab Klasse 7. Begründung: Arbeitsblatt, Lösung, Doppelstundenplan und Klassenlink sind sofort einsetzbar, ohne Anmeldung und ohne Kamera.

## Befunde nach Schwere

### Blocker
Keine.

### Hoch
1. **Doppelstunde nur im Lösungs-PDF.** Seite KI 1 (`/schule-stunde-1`), Abschnitt "Zum Ausdrucken": Die Seite nennt nur "45 Minuten Unterricht", das Wort "Doppelstunde" kommt in Kurz und Genau lesen je einmal vor, und zwar nur in der Kartenbeschriftung des Lösungsblatts. Der 90-Minuten-Plan (10/30/10/15/15/10) steht erst im Lösungsblatt, Seite 1 (`05-loesung-stunde-1-alle.png`). Für Herrn Schulz, der fast nur Doppelstunden unterrichtet, ist das die wichtigste Information und sie ist hinter einem Download versteckt. Die Handreichung (`/schule-lehrkraefte`, Abschnitt "Einzelstunde oder Doppelstunde") zeigt nur Stichpunkte ohne Minuten. Empfehlung: Umschalter "45 Minuten / 90 Minuten" im Kopf jeder Stunde, der den Zeitplan der Seite austauscht.
2. **Prompt-Werkstatt passt nicht zur Stunde.** Aufgabe 3 des Arbeitsblatts KI 1 sagt "Wähle eine Aufgabe aus dem Alltag". Die Vorlagen der Werkstatt (`/prompting`, Abschnitt "Ausprobieren", `12b-prompting-labor.png`) sind "Mail an einen Kunden", "Protokoll zusammenfassen", "Angebote vergleichen", "Anfragen sortieren", "Text einfach erklären". Für Klasse 8 sind vier von fünf Büroaufgaben. Außerdem löst "Beide senden" zwei Anfragen hintereinander aus (Vorher, dann Nachher), im Test schrieb die Antwort auf "Vorher" nach 35 Sekunden noch, "Nachher" wartete mit dem Hinweis "Wartet, bis Vorher fertig ist". Bei sieben Geräten und Gruppen, die "versetzt starten", ist das die engste Stelle der Stunde.

### Mittel
3. **Kurz lesen ist für Lehrkräfte der falsche Standard.** Auf `/schule-stunde-1` steht oben "Du liest gerade kurz: ...", das Hinweisfeld wirkt auf eine Lehrkraft wie Schülertext (`03-stunde1-oben.png`). Wichtige Planungsangaben wie "Vierergruppen, ein Gerät je Gruppe, Klassenlink aus der Einstiegsseite" erscheinen nur in Genau lesen (Textlänge 5576 gegenüber 10293 Zeichen). Empfehlung: auf den Lehrer-Seiten standardmäßig "Genau lesen".
4. **Lehrerseite im Du-Ton der Schüler.** "Teste dich", "Das nimmst du mit", "Du fährst im Punkte-Labor ..." (`19-quiz.png`) stehen auf einer Seite, die sich an die Lehrkraft richtet. Das Quiz ist für Schüler gedacht, aber nichts trennt die beiden Gruppen. Auf der Seite ist auch der Schieberegler "Eigene Einschätzung per Handzeichen" (`19-quiz.png`) ein Bedienelement ohne Wirkung für die Lehrkraft.
5. **Touch-Ziele zu klein auf dem iPad.** Fußzeilenlinks 100x20, 148x20, 103x20 Pixel, Quiz-Rundknöpfe und Kontrollkästchen 13x13 Pixel (Messung per Skript auf `/schule-stunde-1`). Die Antwortzeilen im Quiz sind als ganze Fläche tippbar (`19-quiz.png`), die Fußzeile nicht.
6. **Lesezeit widerspricht sich.** Startseite "Für morgen": Handreichung "ca. 10 Min Lesen". Seite selbst: "ca. 2 Min Lesen" (Kopf von `/schule-lehrkraefte`). Info Schulleitung zeigt "ca. 1 Min", die Kachel "ca. 3 Min".
7. **Labor liegt weit unten.** Auf `/ml` liegt das Spielfeld nach Video und Kapitelliste erst bei etwa 1800 Pixel (`10b-ml-labor.png`). Ein Sprung "Zum Labor" im Kopf fehlt. Für Gruppen, die nur das Labor brauchen, ist das ein Scrollweg.
8. **Chatantwort mit Sprachfehler.** Der Chat lieferte im Test "um einen Computerprogramm zu steuern" (`17c-chat-warten-2.png`). Der Hinweis "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." steht da. Die Stolperstellen der Handreichung nennen Vermenschlichung und Antwort-als-Lösung, Sprachfehler des Modells habe ich dort nicht gefunden.

### Klein
9. Menü auf dem iPad (`08-menue.png`) ist ein Vollbild mit einer leeren grauen Zeile unter dem Fortschrittsbalken "Noch nichts gelesen".
10. Im Chat überlappt das Wort "Antwort" fast die Beispielfragen-Knöpfe (`17c-chat-warten-2.png`, unter den Beispielsätzen).
11. Arbeitsblatt (`/static/materialien/arbeitsblatt-stunde-1.pdf`): Antwortzeilen nur zwei je Aufgabe, Schrift etwa 9 Punkt in den Kopfangaben, Niveau-Symbole ("■□□ Basis") ohne Erklärung am Aufgabenort (Ansicht bei 90 dpi). Die Legende steht erst auf Seite 3.
12. Das Lösungsblatt ist "nur für Lehrkräfte", aber öffentlich unter einer Adresse ohne Schutz erreichbar (`/static/materialien/loesung-stunde-1.pdf`). Das ist beim Konzept "ohne Anmeldung" kaum anders lösbar, sollte aber im Handbuch benannt sein.
13. 404-Seite (`20-404.png`) ohne Suchfeld und ohne Vorschläge.

## Zielaufgaben

**1. Doppelstunde (90 Minuten) zu KI planen.** Weg: Willkommen "Ich unterrichte" (Klick 1), "KI 1: Was ist KI?" "Öffnen" (Klick 2), "Lösungsblatt KI 1 Herunterladen" (Klick 3), PDF öffnen. Dauer etwa 40 Sekunden bis zum Plan, dazu 2 Minuten Lesen. Ergebnis: gelöst. Der Plan im PDF (10/30/10/15/15/10 = 90 Minuten, Rechnung geprüft) ist vollständig mit Tafelbild und Merksatz. Aber: Die Seite selbst zeigt die Doppelstunde nicht, die Entdeckung gelang nur, weil die Kartenbeschreibung "mit Plänen für Einzel- und Doppelstunde" lautet (Befund 1). Eine Doppelstunde aus zwei verschiedenen Themen (KI 1 plus KI 2) bietet das Labor nicht an, die 90 Minuten sind gestreckte 45.

**2. Arbeitsblatt und Lösung laden und für den Druck beurteilen.** Weg: von der Startseite "Ich unterrichte" bis "Herunterladen" 3 Klicks, etwa 20 Sekunden je Datei (beide Dateien 3 Seiten A4, 276 KB und 227 KB, Titel gesetzt). Beurteilung Druck:
- Gut: A4 hochkant, reines Schwarzweiß, in Graustufen unverändert lesbar (geprüft für Arbeitsblatt KI 3 und die Bildkarten, `16b-ab3-grau.png`, `16-bildkarten-grau.png`). Namensfeld, Selbsteinschätzung mit Kästchen "sicher / fast / noch nicht", Aufgaben mit Operator und Niveau, Schreiblinien, QR-Code zurück zur Seite, Quelle und Stand in der Kopfzeile.
- Gut: Das Lösungsblatt hat Zeitplan Einzel und Doppelstunde, Operatorentabelle, Erwartungshorizont, Quizlösungen mit Begründung, Hilfekarten zum Ausschneiden, Differenzierung (Leichter und Schwerer), Tafelbild.
- Schwach: Schrift in Kopfangaben und Legende klein, die Operatorentabelle auf Seite 3 des Arbeitsblatts ist für Schüler dicht. Antwortzeilen knapp (zwei Zeilen für "Beschreibe ... in einem Satz" reicht, für "Erkläre ... bei k gleich 1 und k gleich 9" nicht). Das Niveau-Symbol (gefüllte Quadrate) erklärt nur die Zeile oben auf Seite 1. Hilfekarten stehen nur im Lösungsblatt, also auf einem Bogen mit den Lösungen und nicht als eigene Druckseite.
- Bildkarten (`bildkarten-echt-oder-ki.pdf`, 2 Seiten): 12 Karten mit Schneidelinien und Nummern, in Graustufen noch erkennbar, aber Karte 1 ist angeschnitten ("CROWL..." im Containertext), die Fotos benötigen viel Toner.
Ergebnis: druckfertig, mit kleinen Mängeln. Ein Satz der Lehrkraft ("Hilfekarten ausschneiden") steht nur im Lösungsblatt.

**3. Wie lösen die Schüler die Aufgaben ohne eigene Kamera?** Weg: `/schule-start` (Menü, "Schule: Einstieg") oder direkt Lehrerstart-Kachel "Klassenlink" (Link kopieren) oder `/?weg=schule`. Dauer 2 Klicks, etwa 15 Sekunden. Ergebnis: gelöst und eindeutig. Der Klassenlink öffnet den Schulweg "Experimente, leicht erklärt", jede Kachel trägt das Etikett "OHNE KAMERA" (Punkte-Labor, Chat, Prompt-Vergleich, Text zu Sprache, Netz-Spielplatz), unten steht "Labore mit Kamera findest du unter Alle Bereiche. Im Unterricht brauchst du sie nicht." (`14-klassenlink.png`). Die Seite KI 1 sagt "Kamera und Mikrofon bleiben aus." Nur "Objekte erkennen" arbeitet mit Beispielbildern. Kleiner Mangel: Der Klassenlink steht auf `/schule-start` als "/?weg=schule" ohne Domain, Herr Schulz müsste den vollen Link erst über "Link kopieren" auf der Lehrerstartseite holen.

## Empfehlung in zwei Sätzen
Das Material ist für den Unterricht tragfähig und mit Klassenlink, Arbeitsblatt und Lösungen ohne Hürde nutzbar. Mit einem sichtbaren 90-Minuten-Plan auf der Seite, passenden Alltagsvorlagen in der Prompt-Werkstatt und Lehrer-Seiten im Lehrer-Ton wäre das 8,5 sicher erreicht.

## Die drei größten Lücken Richtung 10
1. Doppelstunde sichtbar machen: 45/90-Minuten-Umschalter und Zeitplan auf jeder Stundenseite, nicht nur im Lösungs-PDF.
2. Schulgerechte Prompt-Werkstatt: Alltags- und Schulvorlagen für Klasse 8, "Beide senden" als zwei klar getrennte Schritte mit Wartehinweis und Empfehlung, wie viele Gruppen gleichzeitig senden.
3. Lehrer-Bedienung auf dem iPad: Touch-Ziele mindestens 44 Pixel, "Genau lesen" als Standard auf Lehrer-Seiten, Lehrer-Ton statt Schülerton, einheitliche Lesezeiten.
