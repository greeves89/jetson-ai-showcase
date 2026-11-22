# Prüfrunde 5: Herr Kowalski (61, Schulleiter, Desktop 1440x900)

Geprüft am 23.11.2026 gegen https://192.168.178.83:8443, headless Chromium (Playwright, `tests/browser.mjs`), Hell und Dunkel. Screenshots in `/tmp/r5-kowalski/` (01 bis 13, plus Druck-PNGs und die beiden Elternabend-PDFs als PNG).

## Gesamtnote: 8,0 von 10

Die Schulleitungsseite ist inhaltlich ehrlich und gut gebaut. Für einen Entscheider, der "unterschreiben oder nicht" klären muss, fehlen aber drei Dinge: eine Datei zum Weitergeben an Datenschutzbeauftragte und Schulträger, eine direkte Kontaktangabe im Labor selbst und eine Aussage zu Protokolldauer und Auftragsverarbeitung, die nicht nur "auf Anfrage" lautet.

| Kriterium | Note | Beleg |
|---|---|---|
| 1 Verständlichkeit | 9 | Kurze Sätze, Sie-Form, "kein Rechtsrat" überall, Tabelle "Betrieb und Verträge im Überblick" |
| 2 Einstieg und Führung | 8 | Willkommens-Fenster hat keinen Eintrag "Schulleitung", ich musste "Ich unterrichte" wählen; danach Kachel "Info Schulleitung" sofort sichtbar |
| 3 Lernwirkung (Entscheidungsfähigkeit) | 8 | Ich kann in 3 Sätzen sagen, was verarbeitet wird und wer verantwortlich ist; Rechtsgrundlage bleibt bewusst offen |
| 4 Motivation | 7 | Sachlich, nüchtern; für Schulleitung passend, wenig Überzeugungsmaterial (keine Einsatzbeispiele, keine Stimmen) |
| 5 Labore und Interaktion | 8 | Chat: Wartehinweis nach 2 s ("Der Jetson rechnet seit 2 s ... bis zu einer Minute"), Zähler, Stopp, KI-Hinweis. Antwort kam in meinem Zeitfenster nicht (Rechner "gerade viel los", fünf Prüfer parallel) |
| 6 Videos | nicht geprüft | für meine Aufgaben nicht nötig |
| 7 Navigation | 8 | Suche findet Datenschutz, Elternabend, Kontakt, Schulleitung, Auftragsverarbeitung sinnvoll; Seitenleiste klappt "Für die Schule" automatisch auf |
| 8 Vertrauen und Sicherheit | 8 | Offen über IONOS und Cloudflare, Jetson, keine externen KI-Dienste; Lücken ehrlich benannt; Impressum mit Anschrift, Telefon, E-Mail |
| 9 Barrierefreiheit | 8 | Fokusrahmen sichtbar (Screenshot 09), Kontrast Hell und Dunkel gut (10), Dialog schließbar |
| 10 Fehlerfälle | 9 | 404-Seite freundlich mit Suche und Vorschlägen, echter HTTP-Status 404 |

Würde ich es empfehlen? Als Lernangebot im Unterricht: ja, mit der Auflage, dass die Schule selbst Datenschutzbeauftragte und Träger einbindet. Als Beschlussgrundlage reicht die Seite noch nicht ganz.

## Befunde

### Blocker
Keine.

### Hoch
1. **Keine mitnehmbare Unterlage für die Schulleitung.** Die Seite `/schule-schulleitung` (Abschnitt "Betrieb und Verträge", Tabelle) ist genau das, was ich dem Datenschutzbeauftragten geben müsste, aber es gibt dafür kein PDF. Für Elternabend (zwei PDFs) und Betriebe (Entscheidungshilfe) gibt es Downloads. Ausdruck per Browser geht (6 Seiten A4, Screenshot druck-1/druck-3, lesbar, Symbole drucken mit), aber ohne Absender, QR-Code und Stand je Seite. Empfehlung: Ein-Seiten-PDF "Entscheidungsvorlage Schulleitung" nach dem Muster des Elternabend-Blatts.
2. **Zu allen Kernfragen "Auf Anfrage beim Betreiber".** Aufbewahrungsdauer der Server-Protokolle, Auftragsverarbeitung mit IONOS und Cloudflare, Nutzungsrechte am Material und "wenn das Angebot eingestellt wird" stehen alle nur als "auf Anfrage" (Tabelle Betrieb und Verträge). Ehrlich, aber ein Entscheider will einen Wert oder wenigstens "geplant bis". Zudem fehlt auf der Seite selbst eine anklickbare Kontaktadresse: Verweis geht nur auf `daniel-alisch.site/impressum` (Text, nicht als Link gesetzt; auf der Über-Seite dagegen verlinkt). Die E-Mail steht erst dort.

### Mittel
3. **Willkommens-Fenster und Rollenzeile kennen keine Schulleitung.** "Ich unterrichte" ist nächstbeste Wahl, "Ich entscheide im Betrieb" führt vermutlich zu Betriebs-Themen. Die Schulleitung findet ihre Seite nur über die Kachel oder die Suche. (Screenshot 01, 02)
4. **Elternabend-Leitfaden verweist auf ein "Kartenset", das die Seite nicht verlinkt.** Leitfaden-PDF, Punkt "Beispiel (3 Minuten)": "zwei Bildkarten aus dem Kartenset". Auf `/elternabend` fehlt der Download-Link zu `bildkarten-echt-oder-ki.pdf` (liegt im Ordner `static/materialien`). Wer den Elternabend vorbereitet, sucht danach. (Elternabend-Seite, Abschnitt "Zum Ausdrucken")
5. **Info-Blatt ist fest auf "Klasse 8" geschrieben.** Titel und Text sagen "Klasse 8" und "sieben Einheiten". Eine Schule, die nur drei Stunden nutzt oder andere Jahrgänge, muss das Blatt anpassen; es gibt keine bearbeitbare Fassung (nur PDF). Das Feld "Rückfragen an die Schule: Ansprechperson" ist gut, aber handschriftlich.
6. **Doppelte Textfassung im Lesefluss.** Unter jedem Piktogramm-Block steht der Inhalt ein zweites Mal als Liste ("Kostenlos (für alle) / Kein Konto (keine Anmeldung)"), im reinen Textabzug sichtbar. Vermutlich nur für Vorlesegeräte, am Bildschirm unsichtbar; sicherheitshalber prüfen, ob beim Druck oder bei abgeschalteten Stilen doppelt erscheint.
7. **"Ist das sicher?"-Hinweis und Kamera-Altersgrenze im Fuß** sagen "kein Alterscheck". Für Schulleitungen das wichtigste Risiko; steht auf der Schulleitungsseite (Abschnitt Kamera und Mikrofon), aber in der Mitte des Textes. Ein Hinweis in der Übersichtstabelle würde reichen.

### Klein
8. Lazy-Rendering der Piktogramm-Blöcke: Bei einer Vollseiten-Aufnahme ohne Scrollen bleiben sie leer (Screenshot 03-schule-schulleitung-voll); beim Scrollen erscheinen sie. Für Menschen unkritisch, nur für Druck-PDF per Skript relevant (dort aber korrekt, druck-1).
9. Seite "Über das Labor": die fünf "Mehr dazu"-Links tragen keine eigene Beschriftung, Ziel des ersten ist `/schule-schulleitung` (statt Hauptseite des Betreibers). Verwirrend.
10. Im Chat springt die Seite beim Absenden (Seite scrollt unter die Kopfzeile, Screenshot 12). Kleinigkeit.
11. Stand "22.11.2026" auf allen Seiten, kein Hinweis, wann die Seite wieder geprüft wird.

Sicherheitsköpfe (curl -skI): HSTS, CSP mit `default-src 'self'`, `frame-ancestors 'none'`, nosniff, DENY, Referrer-Policy, Permissions-Policy, Cookie `kl_s` HttpOnly, Secure, SameSite=lax. Beanstandung nur: `style-src 'unsafe-inline'`.

## Zielaufgaben

| Aufgabe | Ergebnis | Klicks | Zeit |
|---|---|---|---|
| 1 Datenschutz, Kosten, Verantwortung | Gelöst, vollständig auf `/schule-schulleitung`: Daten (Wird verarbeitet / nicht), Kosten (kostenlos, ohne Vertrag), Verantwortlicher (Daniel Alisch), Hosting (Jetson, IONOS, Cloudflare), Entscheidung der Schule. Offene Werte nur "auf Anfrage". | 3 (Willkommen "Ich unterrichte", Kachel "Info Schulleitung") bzw. 1 über Suche | ca. 10 s, Lesen ca. 5 Min wie angegeben |
| 2 Material Elternabend | Gelöst: `/elternabend` mit Info-Blatt (A4, 1 Seite) und Leitfaden (A4, 1 Seite), beide PDFs geöffnet und lesbar, QR-Codes, Antworttabelle mit 8 Elternfragen. Lücke: Bildkarten nicht verlinkt (Befund 4). | 2 | ca. 8 s |
| 3 Kontakt und Betreiber | Gelöst mit Umweg: Labor nennt Daniel Alisch, Link auf `daniel-alisch.site/impressum` (Potsdam, Telefon, E-Mail). Im Labor selbst keine Adresse und keine E-Mail. Datenschutzerklärung dort nennt KI-Labor, IONOS und Cloudflare. | 3 (Über das Labor, Impressum) | ca. 15 s |

## Weitere geprüfte Punkte
- Erstbesuch mit Willkommens-Fenster: klar, sechs Rollen, Schalter "Fortschritt merken" aus (Standard sinnvoll), "Später entscheiden" vorhanden.
- Druck: `page.emulateMedia("print")`, `page.pdf()` ergibt 6 Seiten A4, Seitenkopf mit Titel und Adresse, Tabellen sauber, Seitenumbruch zwischen Kopf und Tabelle teils großzügig (Seite 1 halb leer).
- Hell und Dunkel: Kontrast durchgehend gut, Piktogramme in beiden Modi erkennbar.
- Keine Konsolenfehler in meinen Läufen.
- Hinweis zu Ratenbegrenzung: Ich habe das Chat-Skript versehentlich zweimal gestartet (zwei Anfragen mit etwa 30 Sekunden Abstand, jeweils ohne Wiederholung). Der Rechner meldete "gerade viel los", die Antwort kam in meinem Beobachtungsfenster nicht. Nicht als Seitenfehler gewertet.

## Empfehlung
Für den Einsatz an der Schule tragfähig: Die Seite sagt klar, was verarbeitet wird und wer verantwortlich ist, und verspricht nicht mehr, als sie belegen kann. Nachbessern sollte der Betreiber vor allem eine mitnehmbare Entscheidungsvorlage und konkrete Angaben zu Protokolldauer und Auftragsverarbeitung.

## Die drei größten Lücken Richtung 10
1. Ein-Seiten-PDF "Entscheidungsvorlage Schulleitung" (mit Tabelle Betrieb und Verträge, QR-Code, Stand, Ansprechstelle für Datenschutzbeauftragte).
2. Konkrete Werte statt "auf Anfrage" (Protokolldauer, Auftragsverarbeitung, Zusage zur Laufzeit) und eine direkt im Labor verlinkte Kontaktadresse.
3. Rolle "Schulleitung" im Willkommens-Fenster und auf der Startseite, plus Elternabend-Seite vollständig (Bildkarten-Link, anpassbares Info-Blatt).
