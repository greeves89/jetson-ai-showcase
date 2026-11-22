# Prüfbericht Svenja (36, Mutter von 9 und 13, Handy 390x844), Runde 4

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443, headless Chromium, Viewport 390x844, Hell und Dunkel, Erstbesuch mit Willkommens-Fenster. Screenshots (über 25, alle angesehen) liegen in `docs/runde4/bilder-svenja/`. Der Chat wurde einmal befragt (Jetson geschont), das Kartenset-PDF wurde mit `pdftoppm -r 60` geöffnet.

## Gesamtnote: 8,0 von 10

Für eine Mutter ist das Labor erstaunlich ehrlich und klar: Die Sicherheitsfrage wird direkt beantwortet, ohne Werbesprache und mit sichtbaren Grenzen ("kein Jugendschutzfilter, auf den du dich verlassen kannst"). Die Note bleibt unter 8,5, weil das empfohlene Familienexperiment inhaltlich nicht zu Kindern von 9 und 13 passt und ein Schritt der Anleitung ins Leere führt.

| Kriterium | Note | Beleg |
|---|---|---|
| 1 Verständlichkeit | 9 | Kurze Sätze, Du-Form, Alltagsbilder (belesener Gast am Tisch). Nur "Prompt-Injection" im Spiel ist für Eltern fremd. |
| 2 Einstieg und Führung | 8 | Willkommens-Fenster: "Ich bin Elternteil" führt in 4 s zur Elternstartseite mit drei Empfehlungen (01, 02). Ohne Fenster zeigt die Startseite zuerst "Neu hier" und "In 15 Minuten" für Entscheider, der Elternweg liegt erst unter dem Falz (04). |
| 3 Lernwirkung | 8 | Die drei Gespräche mit dem Kind und "Das nimmst du mit" bleiben hängen. Das Quiz fragt echte Elternsituationen ("Dein Kind ist 12 und will die Gesichtserkennung"). |
| 4 Motivation, Spaß | 7 | "Echt oder KI?" (70) ist ein gutes gemeinsames Spiel. Das Fehler-Spiel, das als Experiment 1 empfohlen wird, ist ein Büro-Spiel (siehe hoch 1). |
| 5 Labore, Interaktion | 7 | Chat meldet sofort "Du bist Nr. 2 in der Warteschlange. Geschätzte Wartezeit: etwa 40 Sekunden." (51). Die Antwort lief nach über 3 Minuten noch (52). |
| 6 Videos | 8 | Auf den geprüften Elternseiten selbst kein Video. Auf `echt-oder-ki` und `datenschutz-im-alltag` Kapitelliste, Untertitel an, 2:18 bis 2:31, Hinweis "Der Verweis am Ende der Folge meint diese Seite". |
| 7 Navigation | 8 | Suche mit Textauszug ist gut (06, 08). "Kinder", "Jugendschutz", "Bildschirmzeit" und "Eltern" finden jeweils die richtigen Seiten. Pfad "Für Eltern" mit 9 Schritten. Unbekannte Adresse zeigt jetzt "Seite nicht gefunden" (71). |
| 8 Vertrauen, Sicherheit | 9 | Alles Wesentliche steht da: Kein Konto, keine Werbung, Kamera nur nach Zustimmung, kein Alterscheck ("Du bist der Alterscheck"), Weg der Daten über IONOS und Cloudflare, Cookie-Tabelle, Link zu Datenschutz und Impressum. |
| 9 Barrierefreiheit | 8 | Kein horizontales Scrollen (scrollWidth 390). Fokusrahmen 3 px sichtbar. Acht Textlinks nur 20 px hoch. Dunkelmodus sauber (60 bis 62). |
| 10 Fehlerfälle | 8 | Chat-Warteschlange freundlich, unbekannte Seite behandelt. Menü und Fenster bleiben bei Adresswechsel offen (siehe mittel 4). |

## Befunde

### Blocker
Keine.

### Hoch
1. **Experiment 1 der Familienanleitung passt nicht zu den Kindern.** Die Seite `zusammen-ausprobieren` verspricht ein "Fehler-Spiel": "Hat die KI hier recht, oder erfindet sie etwas?". Der Link führt zu `llm-grenzen`, dort heißt das Spiel "Erkenne die Risiken" ("Zehn Karten aus dem Arbeitsalltag"). Mit Startwert 4711 kamen: Skript mit Datenbank-Zugang und Passwort (Karte 4), Überweisungen unter 10.000 Euro (2), Kundenmail mit versteckter Anweisung "Prompt-Injection" (3), Zahlungserinnerungen an Kunden (10), Webseite mit unsichtbarem Text (9). Nur drei Karten sind "Erfunden?"-Fragen. Für ein 9-jähriges Kind ist das unbrauchbar, für das 13-jährige trocken (33, 34, 35, 36). Die Seite `llm-grenzen` ist außerdem "ca. 8 Min Lesen" lang. Empfehlung: Kinderfassung des Spiels oder Verweis auf "Echt oder KI?" statt Fehler-Spiel.
2. **Experiment 3 verweist auf ein Lösungsblatt, das Eltern nicht bekommen.** `zusammen-ausprobieren`: "Die Auflösung steht im Lösungsblatt." Auf der Seite gibt es nur das Kartenset als Download. Das PDF selbst sagt (40): "Medien-Einheit 1. Karten ausschneiden und je Gruppe ein Set austeilen. Die Auflösung steht nur im Lösungsblatt der Lehrkraft." Eine Mutter steht mit ausgeschnittenen Karten ohne Lösung da. Das PDF ist erkennbar ein Schul-Material (Kopf "ki-labor.daniel-alisch.site", Gruppen). Empfehlung: Auflösung als Elternblatt anbieten oder im Text auf das Online-Bilderspiel verweisen, das sofort auflöst.
3. **Altersangabe für Kinder unter 16 bleibt unscharf.** Die Seiten sagen "Kamera, Mikro, Gesicht ab 16, Jüngere mit deinem Einverständnis". Für den Chat gilt keine Angabe, obwohl "kein Filter" davorsitzt. Svenja hat ein 9-jähriges Kind: Ab wann ist der Chat in Ordnung, nur begleitet? Das steht dort nicht eindeutig (nur "Sitz deshalb dabei", im Genau-Lesen-Text). Empfehlung: ein Satz mit Altersrichtung für Chat und Spiele, sichtbar im Kurz-Modus.

### Mittel
4. **Fenster bleibt offen, wenn die Adresse wechselt.** Mit geöffnetem Willkommens-Fenster ("Weg wählen") und anschließendem Aufruf einer anderen Seite bleibt das Fenster stehen (63). Gleiches ist Aylin für das Menü aufgefallen. Zurück-Taste und Seitenwechsel sollten Layer schließen.
5. **Elternweg ohne Willkommens-Fenster schwer sichtbar.** Wer das Fenster schließt oder nicht erhält, sieht zuerst "Neu hier" und "In 15 Minuten" für Betriebe (04). "Für wen bist du hier? Weg wählen" steht weiter unten. Die Mutter muss die Rolle suchen.
6. **Chat bei 3 Min Wartezeit.** Die Warteschlangen-Meldung ist gut, aber nach 180 s lief die Antwort noch, der Stopp-Knopf stand weiter da (52). Für ein Kind zu lang, die Seite nennt "braucht manchmal einen Moment", aber keine Größenordnung. Der Jetson war durch die parallelen Prüfer ausgelastet, daher ist das keine reine Seitenschuld.
7. **Lesezeit "ca. 1 Min" in der Kurzansicht wirkt auf der Elternseite zu klein.** Die Seite ist im Kurz-Modus 8.657 px hoch, "Genau lesen" gibt 6 Min an (12). Der Modus ist erklärt, aber ein Satz "6 Minuten, wenn du alles liest" würde helfen.
8. **Suchtext bricht mitten im Satz.** Beispiel: Ergebnis "Ist das sicher?" zeigt "in, Lehrende, KI verstehen, IT, Betrieb, Eltern):" (08), "Datenschutz im Alltag" zeigt "Für Kinder und Jugendliche gelten besondere Regeln:" (06). Der Treffer "Chunking: Das gilt nur für Kinder unter 12" gehört nicht in die Kindersuche.

### Klein
9. Acht Textlinks im Inhalt sind nur 20 px hoch (Messung auf `eltern-zuhause`), knapp für Touch.
10. Dunkelmodus (61): Letzter Listenpunkt "Fragen geduldig beantworten" erschien beim Screenshot noch halb ausgeblendet (Einblend-Animation). Kein Dauerfehler, aber auffällig.
11. Auf den Elternseiten gibt es kein Erklärvideo. Für "Bildschirmzeit" wäre ein kurzes Video der Einstieg, den Eltern am Handy bevorzugen.
12. Bildschirmzeit nennt Richtwerte nur für unter Fünfjährige (WHO). Für 9 und 13 sagt die Seite ehrlich "keine einzelne Grenze". Das ist richtig, enttäuscht aber Eltern, die eine Orientierung suchen. Der klicksafe-Link führt auf `klicksafe.de/eltern` (Startseite), nicht auf den genannten Artikel "Wie lange darf mein Kind an Handy und PC?".

## Zielaufgaben

1. **Ist das Labor für meine Kinder sicher?** Gelöst. Start, "Ich bin Elternteil" (2 Klicks, 4 s), "Eltern zu Hause" öffnen (1 Klick, ca. 10 s gesamt). Antwort im ersten Abschnitt: Zum Lernen ja, kein Konto, keine Werbung, nichts dauerhaft gespeichert; Kamera, Mikro und Gesicht ab 16; der Chat hat keinen Jugendschutzfilter, Kinder nicht allein lassen. Ohne Willkommens-Fenster über die Suche "Kinder": 2 Klicks, ca. 8 s. Zusätzliche Tiefe (Cookie-Tabelle, IONOS und Cloudflare) über "Ist das sicher?" (`sicherheit-einfach`).
2. **Experiment zum gemeinsamen Ausprobieren.** Teilweise gelöst. `zusammen-ausprobieren` (Empfehlung auf der Elternstartseite, 1 Klick, ca. 8 s) liefert drei Experimente zu je 10 Minuten mit Gesprächsfragen. "Echt oder KI?" mit 12 Karten und dem Kartenset funktioniert für beide Kinder. Experiment 1 (Büro-Karten) und Experiment 3 (Lösungsblatt fehlt) tragen nicht (hoch 1, hoch 2). Experiment 2 (Chat prüfen) ist gut, scheitert aber an der langen Chat-Wartezeit.
3. **Etwas zur Bildschirmzeit.** Gelöst. Suche "Bildschirmzeit" (2 Klicks, ca. 8 s) oder aus "Eltern zu Hause" Schlusslink. Die Seite ist ehrlich ("keine Zahl für alle", WHO für unter Fünfjährige, gemeinsam Regeln vereinbaren, Mediennutzungsvertrag von klicksafe und SCHAU HIN!, Nummer gegen Kummer, jeweils mit Abrufdatum 22.11.2026). Gut für ein Gespräch, wenig für eine Zahl.

Zusatz: Eine Frage eines Kindes an den Chat ("Ich bin 9 Jahre alt. Wie kann ich heimlich nachts länger am Handy bleiben, ohne dass meine Mama es merkt?") wurde sachlich abgelehnt und mit "sprich mit deiner Mutter" beantwortet, Vorschläge (Timer, Hobbys, Plan anbieten) waren brauchbar. Sprachlich holprig ("Probleme ... zu dealen"). Der Hinweis "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." steht in einer kleinen Box unter der Antwort.

## Empfehlung

Ich würde das Labor anderen Eltern empfehlen, weil es offen sagt, was es nicht kann, und die Datenschutzfragen vollständig beantwortet. Vor einer Empfehlung für den Familienabend müssen das Fehler-Spiel durch eine kindgerechte Fassung ersetzt und die Auflösung für Eltern bereitgestellt werden.

## Die drei größten Lücken Richtung 10

1. **Familienexperimente aus einem Guss:** Kinderfassung des Fehler-Spiels und ein Elternblatt mit Auflösung zum Kartenset, damit alle drei Experimente tatsächlich tragen.
2. **Altersorientierung im Kurz-Modus:** Ein klarer Satz, ab wann der Chat begleitet genutzt werden kann (zum Beispiel 9 und 13), und was Kinder ohne Aufsicht tun können.
3. **Rolle und Wartezeit:** Elternweg auch ohne Willkommens-Fenster oben auf der Startseite anbieten, Layer bei Adresswechsel schließen und im Chat die Größenordnung der Wartezeit ("bis zu 2 Minuten") nennen.
