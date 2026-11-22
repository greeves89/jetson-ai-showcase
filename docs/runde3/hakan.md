# Prüfrunde 3: Hakan (45, Vater eines 14-Jährigen, Laptop 1440x900)

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443, Chrome headless über tests/browser.mjs (Willkommens-Fenster mit Rolle "Ich bin Elternteil", Hell und Dunkel). Screenshots (20 ausgewählte) in docs/runde3/hakan-bilder/, alle 34 Rohbilder in /tmp/r3-hakan/. Es wurde nichts am Code geändert. Es gab genau eine Sprachmodell-Anfrage (Chat), danach mehr als 10 Sekunden Pause, "Zu viele Anfragen" trat nicht auf. Zeiten für Menschen sind Schätzungen, Ladezeiten und Skriptläufe sind gemessen.

## 1. Gesamtnote: 7,6 von 10 (Vorrunde 6,8)

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter | 8 | Kurze Sätze, Du-Ton, Kurz-Modus mit Kernsätzen. Die Seite "Eltern zu Hause" (730 Wörter) spricht mich jetzt direkt an ("Drei Gespräche mit deinem Kind"). Abzug: Fachwörter wie "k (Nachbarn)" und "Entscheidungsfläche" im Punkte-Labor weiter ohne Hilfe am Ort (aus Runde 2, nicht neu geprüft). |
| 2 | Einstieg und Führung | 8 | Willkommens-Fenster, Elternstartseite "KI im Alltag deiner Kinder", "Für dich" mit 7 Einträgen enthält jetzt Eltern zu Hause, Experimente, Quellen prüfen, KI und Hausaufgaben, Ist das sicher? (04-menue-alle). Die drei Empfehlungskarten sind elterngerecht ("ein Gespräch mit dem Kind"). Abzug: "Echt oder KI?" fehlt in "Für dich", ebenso jeder Hinweis "zu zweit". |
| 3 | Lernwirkung | 7,5 | Meine drei Sätze: "KI klingt sicher, auch wenn sie falsch liegt. Ich prüfe Herkunft, Datum und eine zweite Quelle. Hausaufgaben gebe ich als Hilfe an." Das Fehler-Spiel mit Erklärung je Karte und Auswertung nach Art (13-spielende) trägt am meisten. |
| 4 | Motivation und Spaß | 6 | Startwert-Kartenspiel bleibt die einzige echte Zwei-Personen-Mechanik, wird aber nirgends so beworben. Punkte-Labor ohne Ziel (aus Vorrunde, nicht neu gespielt). Karten überwiegend Büroalltag (Überweisungen, Skript mit Zugangsdaten), eine Karte mit Hausmeisterin. |
| 5 | Labore und Interaktion | 7,5 | Fehler-Spiel: das Wort "null" unter "Richtig." ist weg, stattdessen Häkchen und Kreuz an den Antworten (11, 12). Chat antwortete in 16,1 s, erstes Token nach 7,9 s (kalter Start), Live-Erklärung mit Balken. Abzug: "Starten" auf Experimente führt weiter in eine Lektion mit Video oben, das Spielfeld liegt darunter. |
| 6 | Videos | 7 | 2:29, Kapitel, Untertitel "de" an, Hinweis "Sprecherstimme KI-erzeugt". Der Fehler aus Runde 2 besteht unverändert: Am Ende liegen die Untertitel über dem Merksatz-Bild "Nichts gefunden? Dann nicht teilen." und sind doppelt zu lesen (27). Nach dem Ende bleibt ein schwarzes Bild ohne Weiterführung (28). |
| 7 | Navigation und Orientierung | 7,5 | Suche: "Quellen" bringt Quellen prüfen zuerst, "KI-Antwort prüfen" liefert Quellen prüfen und Echt oder KI?, "stimmt das" ebenfalls. Besser als in Runde 2. Abzug: "Vater Sohn" findet nichts, "zusammen ausprobieren" liefert Chat und Gut fragen statt Experimente, "Hausaufgaben" listet KI und Hausaufgaben erst nach vier anderen Gruppen. Treffer ohne Auszug. |
| 8 | Vertrauen und Sicherheit | 8 | "Kostenlos, Ohne Anmeldung", "Ab wann? ab 16, Jüngere nur mit Einverständnis der Eltern, kein Alterscheck" auf der Startseite. Die Seite "Eltern zu Hause" nennt Kamera nur nach Zustimmung, kein Jugendschutzfilter, kein Konto. Elternabend-Infoblatt mit QR-Codes ist klar. Abzug: ehrliche, aber unkonkrete Aussage zu Jüngeren. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7,5 | Tab: Skip-Link, Suche, Menü, Rollen-Chip, Kurz/Genau lesen, alles mit 3-px-Fokusrahmen (Suchfeld eigene Rahmung). Fließtext gut lesbar, Dunkelmodus sauber (25, 29). Abzug: Quiz-Auswahlkreise im Dunkelmodus kaum sichtbar, Rollenkacheln doppelt im DOM (erster Treffer unsichtbar, mein erster Klick lief ins Leere). |
| 10 | Fehlerfälle | 8,5 | Leere Chat-Eingabe: "Schreib zuerst eine Frage."; Suche ohne Treffer mit Vorschlägen; 404 mit Link zur Startseite (30). |

Gesamtnote als ehrlicher Eindruck, nicht Mittelwert: **7,6**.

## 2. Vergleich zur Vorrunde

Besser:
- Eltern-Menü enthält jetzt Experimente, Quellen prüfen, KI und Hausaufgaben und die neue Seite "Eltern zu Hause" (vorher fehlten Experimente und Quellen prüfen).
- Der erste Schritt im Pfad "Neu hier" für Eltern ist nicht mehr der Schul-Elternbrief im Sie-Ton, sondern "KI zu Hause: Was Eltern wissen sollten". Der Schul-Brief sagt jetzt selbst: "Diese Seite ist der Brief für den Einsatz in der Schule. Für zu Hause gibt es eine eigene Seite."
- Es gibt endlich eine Seite, die mich als Vater anspricht: Drei Gespräche mit dem Kind, "So richtest du es zu Hause ein" (gemeinsam öffnen, ein Gerät, ihr zwei, danach reden), Hinweis "Die Kamera braucht dein Kind nicht".
- "null" im Fehler-Spiel behoben, Feedback jetzt mit Häkchen und Kreuz statt nur Farbe.
- Suchreihenfolge bei "Quellen", "KI-Antwort prüfen", "stimmt das" brauchbar.
- Neues Material: Kartenset "Echt oder KI?" (12 Bildkarten, 2 Seiten A4), Elternabend-Infoblatt mit QR-Codes, Arbeitsblatt mit Lösungsblatt. PDFs laden, sehen sauber aus (pdf-bildkarten-echt-oder-ki-1.png, pdf-elternabend-infoblatt-1.png).
- Chat-Frage nach der WM 1998: diesmal korrekt beantwortet (Frankreich, 3:0 gegen Brasilien, Stade de France). Im Chat-Fenster steht weiter nur "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." ohne Verweis.

Gleich:
- Videoende: Untertitel über dem Schlussbild, danach schwarz.
- "ca. 1 Min Lesen" bei Seiten mit 730 bis 840 Wörtern und über zwei Minuten Video (Eltern zu Hause: 730 Wörter, "ca. 1 Min").
- "Starten" auf Experimente-Karten landet in der Lektion mit Video vor dem Labor.
- Keine Zwei-Personen-Anleitung, keine Aufgabe "Setzt Punkte so, dass der Computer sich irrt".
- Seiten "Echt oder KI?", "Quellen prüfen", "KI und Hausaufgaben" reden zum Jugendlichen. Kein Abschnitt "Was tue ich als Elternteil" bei Hausaufgaben.
- Rollenkacheln doppelt im DOM.

Schlechter: nichts Sichtbares. Das Menü "Für dich" führt "Echt oder KI?" nicht mehr direkt (in Runde 2 stand es in der Gruppe, jetzt nur unter "Alle Bereiche, Medienkompetenz", obwohl die Seite "Eltern zu Hause" es als erstes Gespräch nennt).

## 3. UX- und UI-Befunde nach Schwere

### Blocker
Keine.

### Hoch
1. Kartenset "Echt oder KI?" ist für mich nicht auffindbar. Das Material (12 Bildkarten, Lösung im Lösungsblatt) ist genau die Bild-Übung, die ich in Runde 2 vermisst habe, hängt aber nur an "Medien 1: Echt oder KI?" (Lehrer-Seite) und am Lösungsblatt "für Lehrkräfte". Die Seite "Echt oder KI?" (echt-oder-ki, Links nur auf Startseite, Lizenzen und Quellen prüfen) und "Eltern zu Hause" verlinken es nicht. Suche "Kartenset" findet nur Medien 1 und Elternabend. Beleg: Skript s10, 16-echt-oder-ki.png.
2. Keine Anleitung "zu zweit". Weder "Experimente" noch "Eltern zu Hause" nennen das Fehler-Spiel mit Startwert als Vater-Sohn-Spiel ("beide geben 4711 ein, vergleicht"). Der Startwert steht unerklärt im Spiel (13-spielende). Suche "Vater Sohn" liefert "Dazu habe ich nichts gefunden". Beleg: 06-experimente-voll, 09-fehlerspiel-startwert.
3. Videoende: Untertitel kollidieren mit dem Bildtext (zwei Textzeilen übereinander, 27-dunkel-video-ende.png), und nach dem Ende kommt ein schwarzes Bild ohne Weiterführung (28-video-nach-ende.png). Wiederholung aus Runde 2, damit der am längsten offene Fehler.

### Mittel
4. "Starten" in Experimente-Karten führt in die ganze Lektion, nicht ins Labor (Fehler-Spiel: erst Video 1:14 und Kapitelliste, Ausprobieren weiter unten). 864 ms Ladezeit, aber der Weg zum Spielen ist ein Scroll. Beleg: Skript s5.
5. Zeitangabe "ca. 1 Min Lesen" ist durchgehend falsch (730 bis 840 Wörter, plus Video 2:29). Beleg: 02-start-eltern (Karte Quellen prüfen: "ca. 1 Min Lesen, plus Video 2:29"), 06-experimente-voll.
6. Hausaufgaben-Seite hat keinen Abschnitt für Eltern (Vereinbarung zu Hause, wie ich nachfrage statt kontrolliere). Die Seite "Eltern zu Hause" deckt Hausaufgaben mit einem Satz ab ("was war von dir").
7. Suche: "zusammen ausprobieren" liefert Chat und Gut fragen, nicht Experimente. "Hausaufgaben" ordnet die Gruppe Sprache, Grundlagen und Recht vor "KI und Hausaufgaben". Treffer ohne Auszug. Beleg: Skript s13, 23-suche-quellen.png.
8. Unter der aktiven Suche steht ein leerer grauer Balken unter dem Fortschrittsbalken (Statuszeile ohne Text). 23-suche-quellen.png, y 186.
9. "Weitere Wege" bei der Rolle Elternteil zeigt direkt darunter auch den Pfad "In 15 Minuten" (Betrieb: "für alle, die entscheiden müssen") und weitere fremde Pfade. Für mich Rauschen. Beleg: 31-weitere-wege.png, Skript s15.
10. Chat: Unter der Antwort nur ein Textsatz "prüfe Wichtiges", kein Weg in "Quellen prüfen". Das Modell-Plättchen "im Speicher" und der Knopf "Modell laden" daneben sind für Laien widersprüchlich (22-chat-antwort.png). Das Wort "Antwort" über dem Temperatur-Regler sitzt eng unter den Beispielfragen.
11. Fehler-Spiel: Karteninhalt weiter Büro (Überweisungen unter 10.000 Euro, Zugangsdaten im Skript). Für einen 14-Jährigen fremd.
12. Schul-Brief "Information für Eltern" (schule-eltern) bleibt Sie-Form und liegt unter "Für die Schule", dazu eine zweite Seite "Elternabend". Namen: "Eltern zu Hause", "Info Eltern", "Elternabend" nebeneinander in der Suche ("Eltern" findet alle drei) ohne Erklärung, wer was lesen soll.

### Klein
13. Willkommens-Fenster: zwei Kachelzeilen haben ungleiche Höhen (Schüler:in-Kachel dreizeilig, Elternteil einzeilig, 01-willkommen.png). Optik ok, aber unruhig. Die Rollenkacheln stehen doppelt im DOM (Skript d.mjs: eine sichtbar auf der Startseite, eine im Fenster). Ein Test-Klick auf die erste lief ins Leere.
14. Hinweiskasten "Du liest gerade kurz ..." ist schmaler als das Kartenraster und klebt ohne Abstand an den Karten (06-experimente-voll.png, 07-sogehstduvor.png). Er erscheint auf jeder Seite mit identischem Wortlaut und wiederholt sich auch bei "Eltern zu Hause".
15. Fußzeile: Text beginnt 56 px weiter rechts als der Inhaltsblock der Startseite, enthält technischen Wert `kl_s` in Code-Schrift (03-start-eltern-voll.png).
16. Seitenleiste: Der aktuell offene Eintrag ist grau hinterlegt, "Start" nach Klick kurz kräftig blau (02 gegen 04). Die Leiste wird beim Aufklappen unten abgeschnitten und scrollt; der aktive Eintrag "Grenzen" lag zuletzt außerhalb (11-fehlerspiel-feedback.png).
17. "0 richtig", "2 von 3" in Monospace-Schrift: bricht mit dem sonstigen Schriftbild, wirkt wie Debug-Ausgabe (13-spielende.png).
18. Quiz im Dunkelmodus: Auswahlkreise nur schwach sichtbar (29-dunkel-quiz.png). Im Hellmodus erscheint nach der Antwort nur Grün plus Satz "Richtig. ..." (33-quiz-feedback.png), das reicht, ist aber nicht überall mit Symbol versehen wie im Fehler-Spiel.
19. Seitenüberschrift "Experimente · " zeigt einen hängenden Punkt vor der Zeitangabe wenn die Zeit fehlt (Skript s3, Textdump "Experimente · \nca. 1 Min"). Optisch unauffällig, im Screenreader ein Satzzeichen.
20. Textdoppelung für Screenreader: "Aussuchen / Ein Experiment antippen" erscheint nach der Grafik nochmals als "Aussuchen (Ein Experiment antippen)". Gewollt als Alternativtext, aber mit Doppel-Ausgabe im Text.

## 4. Zielaufgaben

1. Experiment für Vater und Sohn: gelöst. Start, Menü "Experimente" (1 Klick, 636 ms), "Starten" beim Fehler-Spiel (1 Klick, 864 ms), Scroll zu "Ausprobieren", Startwert 4711 eingeben, "Runde starten". Insgesamt 2 Klicks, 1 Eingabe, 1 Scroll, 1 Klick, geschätzt 40 Sekunden. Zwei Durchgänge möglich über "Dieselbe Runde noch einmal" bzw. gleichen Startwert. Mein Test: Taste 1 oder 2, Enter, 10 Karten, Ergebnis "4 von 10 richtig", Aufschlüsselung "Erfundene Antworten 2 von 3, Datenschutz 0 von 2" und "Das verwechselst du noch". Das trägt sehr gut als Gesprächsgrundlage. Ohne Hinweis, dass man zu zweit spielt, erfährt das ein Vater nur durch Zufall.
2. KI-Antworten prüfen: gelöst. Menü "Quellen prüfen" (1 Klick), Video 2:29 mit Kapiteln, "Teste dich" mit Begründung je Antwort. Alternativ Suche "stimmt das" (2 Handlungen). "Echt oder KI?" 3 Klicks (Alle Bereiche, Medienkompetenz, Echt oder KI?). Mein Chat-Probelauf zeigte diesmal keine Falschaussage, aber das Labor nutzt diese Gelegenheit weiterhin nicht.
3. Hausaufgaben fair: gelöst, 1 Klick im Menü "KI und Hausaufgaben" (1158 ms Ladezeit im Skript). Leitfrage "Hast du danach mehr verstanden, oder nur etwas abgegeben?", Tabelle "Du gibst es an / nicht an", Fragen an die Lehrkraft. Kein Elternabschnitt.

Zusätzlich: Elternabend-Infoblatt (Link in /elternabend), Kartenset und Arbeitsblatt heruntergeladen (curl), Seitenzahl und Format geprüft (Kartenset 2 Seiten A4, Infoblatt 1 Seite A4, Arbeitsblatt 3 Seiten A4) und mit pdftoppm -r 60 angesehen. Infoblatt: Sie-Form, zwei QR-Codes (Im Unterricht, Zu Hause), Hinweis "Vereinbaren Sie ein Codewort für Notfallanrufe". Kartenset: nummerierte Fotos zum Ausschneiden, sauber, Auflösung nur im Lösungsblatt.

## 5. Empfehlung und Lücken

Würde ich es empfehlen? Ja, jetzt auch an Eltern ohne Vorwissen: Kostenlos, ohne Anmeldung, die Seite "KI zu Hause" und das Fehler-Spiel mit gleichem Startwert reichen für einen guten Samstagnachmittag. Als Familienangebot ist es noch eine Sammlung guter Teile, die man selbst zusammensetzen muss.

Die drei größten Lücken Richtung 10:
1. Ein Pfad "Zusammen ausprobieren" mit drei Aufgaben zu zweit, je 10 Minuten (Fehler-Spiel mit gleichem Startwert und Vergleich, Chat-Antwort gemeinsam gegen eine Quelle prüfen, Kartenset "Echt oder KI?" ausdrucken und raten), mit Gesprächsfragen für den Vater, im Menü "Für dich" und in der Suche unter "Vater Sohn", "zusammen", "Familie". Dazu das Kartenset und das Lösungsblatt für private Nutzer verständlich verlinken, nicht nur als Lehrermaterial.
2. Kleine Brüche beseitigen, die Vertrauen kosten: Untertitel auf dem Schlussbild, Weiterführung am Videoende, ehrliche Lesezeiten (statt "ca. 1 Min" realistisch 4 bis 6 Min), "Starten" direkt ins Labor, "Weitere Wege" nur mit Elternpfaden, leere graue Statuszeile in der Suche.
3. Aus Chat-Antworten eine Prüfübung machen: unter jeder Chat-Antwort ein Link "Antwort gemeinsam prüfen" zu "Quellen prüfen" mit Fünf-Schritte-Karte, und in "KI und Hausaufgaben" ein Abschnitt "Für Eltern" (Vereinbarung, nachfragen statt kontrollieren). Danach Fehler-Spiel um Karten aus Schule und Freizeit ergänzen.
