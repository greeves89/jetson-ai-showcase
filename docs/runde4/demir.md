# Prüfbericht Runde 4: Frau Demir (58, Schulleiterin, Desktop 1440x900)

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443, headless Chromium (Playwright, tests/browser.mjs), Erstbesuch mit Willkommens-Fenster, hell und dunkel, Tastatur, einmal Chat. 21 Screenshots in /tmp/dem (alle mit dem Read-Werkzeug angesehen, soweit unten zitiert), beide Elternabend-PDFs mit pdftoppm -r 60 geöffnet. Keine Konsolenfehler, keine fehlgeschlagenen Anfragen in allen Läufen.

## Gesamtnote: 7,5 von 10

Das Labor ist für eine Schulleitung ordentlich vorbereitet: Es gibt eine eigene Seite, ein Elternabend-Paket und sachliche Aussagen, ohne Werbung. Für eine Entscheiderin fehlen aber verbindliche Aussagen zu Betrieb, Verträgen und Kontakt. Mehrfach steht "laut Planung" oder "fragen Sie den Betreiber".

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit | 8 | kurze Sätze, aber Du und Sie wechseln auf derselben Seite (siehe mittel 1) |
| 2 | Einstieg und Führung | 7 | keine Rolle "Schulleitung" im Willkommens-Fenster (Screenshot 01, 13) |
| 3 | Lernwirkung | 7 | für meine Rolle nur Information, nicht geprüft ob Quiz sinnvoll |
| 4 | Motivation | 7 | saubere Karten und Grafiken, für Entscheider nüchtern, passend |
| 5 | Labore und Interaktion | 8 | Chat startet nach rund 3 s zu schreiben, "Stopp"-Knopf, Hinweis "Antwort eines KI-Modells, kann falsch sein" (Screenshot 20, 21) |
| 6 | Videos | nicht bewertet | für meine Aufgaben nicht nötig, nicht geprüft |
| 7 | Navigation | 7 | Suche "Kontakt" findet keine Kontaktseite (Screenshot 08); Info Schulleitung fehlt im Seitenmenü |
| 8 | Vertrauen und Sicherheit | 7 | ehrlich, aber Lücken bei Hosting, Protokollen, Verträgen |
| 9 | Barrierefreiheit | 8 | sichtbarer Fokusring, Skip-Link als erster Tab-Stopp, Dunkelmodus lesbar (Screenshot 17, 18) |
| 10 | Fehlerfälle | 7 | Pfad-404 freundlich, falsche Seitenadresse mit # landet still auf der Startseite |

Weiterempfehlen: Ja, als Lernangebot für Lehrkräfte. Eine Schulleitung braucht vor einer Freigabe aber noch feste Antworten zum Betrieb und einen direkten Kontakt.

## Befunde

### Blocker
Keine.

### Hoch
1. **Kontakt zum Betreiber nicht auffindbar** (Seite: alle, Fußzeile; Screenshot 08, 14-lehrer-1900). In der Fußzeile steht nur "Ein Projekt von Daniel Alisch" mit Link auf daniel-alisch.site, ohne E-Mail oder Telefon. Die Seite "Über das Labor" nennt nur "Mehr über ihn steht auf seiner Hauptseite". Die Suche nach "Kontakt" liefert "Deine Entscheidung", "Info Eltern", "Datenschutz im Alltag", aber keine Seite mit einem Kontaktweg. Im Repo liegt `app/static/content-beratung.js` (Seite "schule-unterricht" mit E-Mail), sie ist aber nicht committet und nicht in `app/index.html` eingebunden: `/schule-unterricht` zeigt "Seite nicht gefunden", `#/schule-unterricht` die Startseite. Solange das so bleibt, gibt es keinen Kontaktweg im Labor selbst. Ich habe die Hauptseite selbst nicht geöffnet.
2. **Betrieb nur als Planung beschrieben** (Info Schulleitung, Abschnitt "Hosting und Betrieb", Genau lesen): "Weiterleitung laut Planung", "Für die öffentliche Erreichbarkeit ist nach dem Planungsstand vom 22.11.2026 eine Weiterleitung über einen Server und einen Tunnel eines Netzanbieters vorgesehen. Dienstleister und Verträge nennt die Datenschutzerklärung, oder fragen Sie den Betreiber." Und bei den Verbindungsdaten: "Die Aufbewahrungsdauer der Protokolle ist nicht festgelegt, bitte fragen Sie den Betreiber." Eine Schulleiterin kann so nicht entscheiden und nichts an die Datenschutzbeauftragte weitergeben. Gebraucht: feste Angabe, wer Dienstleister ist, ob ein Auftragsverarbeitungsvertrag nötig ist, wie lange Protokolle liegen.

### Mittel
1. **Du und Sie gemischt** (Info Schulleitung und Elternabend, jede Seite): Der Kasten "Du liest gerade kurz: ... Mit „Mehr dazu“ klappst du Einzelnes auf" steht über Text in Sie-Form ("Ihre Schule"). Das wirkt bei Schulleitung und Eltern unpassend und sollte je Seite in der Anrede der Zielgruppe stehen. Das gilt auch für "Für wen bist du hier? Weg wählen" auf der Startseite.
2. **Keine Rolle für die Schulleitung** (Willkommens-Fenster, Screenshot 01 und 13): Es gibt "Ich unterrichte", aber nichts für Leitung oder Verwaltung. Ich habe "Ich unterrichte" gewählt und die Info Schulleitung erst nach Scrollen als vorletzte Karte gefunden (Screenshot 14-lehrer-1000). Im Seitenmenü "Für dich" fehlt sie, dort stehen alle Unterrichtsstunden und "Elternabend".
3. **Keine Aussagen zu Kosten für die Schule im Klartext** (Info Schulleitung): "Kostenlos für alle" steht da, aber nicht, wie lange, ob das garantiert ist, und was passiert, wenn der Betreiber das Labor einstellt (eine Person, ein kleiner Rechner). Die Seite "KI für Schulen: Überblick" hat Wege und Preise, aber nicht für dieses Labor. Verantwortung ist gut geklärt (Tabelle Betreiber und Schule), Verfügbarkeit und Ausfall aber nicht.
4. **Leselängen widersprechen sich** (Startseite Lehrende, Screenshot 14-lehrer-1000): Karte Info Schulleitung "ca. 3 Min Lesen", Seite selbst im Modus Kurz "ca. 1 Min Lesen", Elternabend Karte "ca. 4 Min", Seite "ca. 1 Min". Im Modus "Genau lesen" stimmt es mit 3 Min. Die Karte sollte sagen, welcher Modus gemeint ist, oder die Seite beide Zeiten zeigen.
5. **"Kamera nicht vorgesehen" neben Labor mit Kamera** (Info Schulleitung, Abschnitt Kamera und Mikrofon): Die Seite schreibt, die Gesichtserkennung sei "erst ab 16 Jahren gedacht, jüngere nur mit Einverständnis der Eltern". Als Leiterin möchte ich wissen, ob Schüler unter 16 versehentlich dorthin gelangen können (Menü zeigt alle Bereiche, kein Alterscheck, steht auch dort). Ein Satz "Sperren Sie die Kamera am Schulgerät" fehlt.

### Klein
1. Hash-Adressen ohne Seite (z. B. `/#/gibtsnicht`) zeigen still die Startseite statt der Fehlerseite, die der Pfad `/gibtsnicht` zeigt (Screenshot 16).
2. Die Sucheingabe hat im Tab-Stopp `outline: none`, der Fokus wird nur durch den blauen Rahmen gezeigt (Screenshot 08). Sichtbar, aber nicht einheitlich mit den anderen Elementen (solid 3px).
3. Im Dunkelmodus erscheint beim Einblenden der Grafik "Wird verarbeitet" vorübergehend nur der erste Listenpunkt abgedunkelt (Screenshot 17). Es handelt sich um eine Einblend-Animation, kein Dauerzustand.
4. Das Willkommens-Fenster hat zuerst "Später", nach einer Wahl "Schließen": zwei Beschriftungen für denselben Knopf.
5. Im Willkommens-Fenster steht "Kamera, Mikro und Gesicht ab 16, im Schulpfad nicht nötig" nur bei Schüler:in, nicht bei Lehrenden und Eltern.

### Positiv
- PDFs: Info-Blatt (1 Seite A4, Sie-Form) und Leitfaden (1 Seite A4) sind sauber gesetzt, lesbar im Druck, mit QR-Codes, Feld "Ansprechperson und Kontakt (die Schule trägt sie hier ein)" und Hinweis "kein Rechtsrat". Sehr brauchbar. Auffällig: Der Text ist auf "Klasse 8" festgelegt.
- Leitfaden-Tabelle mit acht Elternfragen beantwortet ehrlich auch Unangenehmes ("Das Labor schaltet keinen Filter vor das Sprachmodell", "Sichere Erkennung von KI-Bildern gibt es nicht").
- Karte "Klassenlink" mit Link kopieren (Screenshot 14-lehrer-1900): gute Lösung für den Unterricht.
- Chat: Antwort begann nach rund 3 Sekunden, war nach 43 Sekunden fertig, Statusanzeige "Der Rechner rechnet gerade (63 Prozent ausgelastet)" vorher und "Gerade viel los" bei Last ist verständlich.

## Zielaufgaben

1. **Information für die Schulleitung (Datenschutz, Kosten, Verantwortung):** gefunden. Weg: Willkommens-Fenster, "Ich unterrichte" (1 Klick, rund 4 s), nach unten scrollen, Karte "Info Schulleitung", "Öffnen" (2. Klick). Zusammen 2 Klicks und etwa 15 Sekunden. Datenschutz und Verantwortung gut dargestellt (Tabelle, Daten verarbeitet oder nicht), Kosten nur als "kostenlos". Offen bleiben Hosting, Dienstleister, Protokolldauer (hoch 2).
2. **Material für den Elternabend:** gefunden, sehr gut. Seitenmenü "Elternabend" (1 Klick, rund 3 s), zwei PDFs (Info-Blatt, Leitfaden) mit je einem Klick. Beide geöffnet und geprüft.
3. **Wer betreibt das Labor, wie Kontakt:** Betreiber (Daniel Alisch) ist gut zu finden (Info Schulleitung, Über das Labor, Fußzeile, rund 2 Klicks). Kontakt nur über den Link auf die Hauptseite, zusätzlich 1 Klick mit Wechsel auf eine fremde Seite und dort eigene Suche. Im Labor selbst keine E-Mail oder Telefonnummer. Teilweise gelöst (hoch 1).

## Empfehlung

Das Labor ist für Lehrende und Eltern gut vorbereitet; für eine Freigabe durch die Leitung sollten Betriebsangaben (Dienstleister, Protokolle, Ausfall) und ein direkter Kontakt fest statt "laut Planung" dastehen. Danach lässt sich die Note auf 8,5 oder mehr heben.

## Die drei größten Lücken Richtung 10

1. Verbindlicher Abschnitt "Betrieb und Verträge" in der Info Schulleitung: Hoster, Tunnelanbieter, AVV ja oder nein, Protokolldauer, Verfügbarkeit, was bei Einstellung des Angebots gilt, plus Hinweis zum Sperren der Kamera am Schulgerät.
2. Direkter Kontakt im Labor (Fußzeile, Über das Labor, Info Schulleitung) mit E-Mail, und die Seite "Unterricht und Workshops" einbinden; Suche "Kontakt" und "Betreiber" soll sie finden.
3. Rolle "Ich leite eine Schule" im Willkommens-Fenster und Info Schulleitung ins Seitenmenü; Anrede (Sie) und Leselängen je Seite angleichen.
