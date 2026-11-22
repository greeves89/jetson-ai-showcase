# Prüfrunde 3: Nadine (Mutter, 40, zwei Kinder 12 und 15), 22.11.2026

Rolle: skeptische Mutter, will in wenigen Minuten wissen, ob das Labor für ihre Kinder sicher ist.
Gerät: Handy 390x844, Chromium headless über tests/browser.mjs, gegen https://192.168.178.83:8443 (nicht die öffentliche Domain). Erstbesuch mit Willkommens-Fenster, Rolle "Ich bin Elternteil". Screenshots: docs/runde3/nadine-bilder/ (19 Dateien, alle angesehen).
Sprachmodell: genau eine Chat-Anfrage, keine Ratenbegrenzung. Ehrlicher Vorbehalt: Meine Warteschleife brach nach 8 Sekunden ab (sie hatte einen statischen Text als Fertigzeichen erkannt), die fertige Antwort habe ich deshalb nicht gesehen. Gesehen habe ich den Wartezustand. Eine zweite Anfrage habe ich wegen der Schonregel nicht gestellt.
Nicht geprüft: Videos nicht angesehen (nur Dauer und Kapitelleiste), der öffentliche Betrieb (Cloudflare) nur über die Datenschutzerklärung, nicht gemessen. Ein Chromium gestartet und am Ende geschlossen.

## 1. Gesamtnote und Raster

Gesamtnote: 8,0 von 10 (Vorrunde 6,5).

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit fürs Alter (hier: Eltern) | 8 | Die Elternseite "KI zu Hause" duzt durchgehend, kurze Sätze, Ikonenlisten ("Kein Konto, Keine Werbung, Texte nur kurz"). Fachwörter bleiben nur in der Tabelle "Genau lesen" (sessionStorage, Token). |
| 2 | Einstieg und Führung | 9 | Rolle gewählt, nach 1,9 Sekunden erscheint "KI im Alltag deiner Kinder" mit drei Karten. "Eltern zu Hause" ist 1 Klick entfernt und beantwortet die Titelfrage in der ersten Zeile (02-start-eltern.png, ez-0.png). |
| 3 | Lernwirkung | 7 | Nach "Was ist KI?" kann ich es in drei Sätzen erklären (Oberbegriff, spezialisiert, Landkarte). Wie ich es meinem 12-Jährigen sage, steht weiter nicht da (40-was-ist-ki.png). Die drei Gesprächseinstiege auf "KI zu Hause" helfen. |
| 4 | Motivation und Spaß | 7 | Ruhige, saubere Gestaltung, Karten mit Kennzeichnung "Ohne Kamera". Für mich zweitrangig, "zusammen ausprobieren" ist jetzt benannt. |
| 5 | Labore und Interaktion | 7 | Chat zeigt "Der Jetson rechnet seit 8 s ... Stopp" (43-chat-antwort.png), das ist ein guter Ladezustand. Gesichts-Labor ohne Kamera leer (33-gesicht-ohne.png). Antwort nicht abgewartet (siehe oben). |
| 6 | Videos | 7 | Nur Dauer, Kapitelmarken und KI-Kennzeichnung der Stimme geprüft (Was ist KI? 1:24, Quellen prüfen 2:29, Echt oder KI 2:31). Nicht angesehen, daher keine höhere Note. |
| 7 | Navigation und Orientierung | 7 | "Für dich" hat 7 Einträge inklusive "Was ist KI?", "Eltern zu Hause", "Ist das sicher?" (10-menue.png). Dagegen: winziges Suchfeld, laute Trefferlisten (Abschnitt 3). |
| 8 | Vertrauen und Sicherheit | 8 | Alle Zusagen stimmen jetzt mit der Datenschutzerklärung überein (Abschnitt 4). Offene Punkte: Cloudflare erst in "Genau lesen", kein Elternkontakt in der Elternseite selbst. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Große Knöpfe, sichtbarer Fokusring (solid 3px) auf allen Elementen außer dem Suchfeld (outline none), Dunkelmodus sauber (20-dunkel-eltern.png). Suchfeld mobil nur 101 Pixel breit. |
| 10 | Fehlerfälle | 7 | Suche ohne Treffer ("Dazu habe ich nichts gefunden. Probiere zum Beispiel: Chat, Datenschutz ..."), Kamera ablehnen freundlich. Eine falsche Adresse (#/gibt-es-nicht-xyz) landet still auf der Startseite, ohne Hinweis. |

## 2. Vergleich zur Vorrunde

Besser:
- Es gibt jetzt eine echte Elternseite "KI zu Hause: Was Eltern wissen sollten" (eltern-zuhause). Sie beantwortet die Titelfrage mit einem Satz: "Zum Lernen und Ausprobieren ja: kein Konto, keine Werbung, Eingaben werden nicht dauerhaft gespeichert." Sie sagt ehrlich: "Einen Jugendschutzfilter, auf den du dich verlassen kannst, gibt es nicht." Sie bietet drei Gespräche mit dem Kind, Experimente ohne Kamera und einen Satz zur Kamera ("Kamera aus: Zustimmung verweigern"). Das war meine Lücke 1.
- Der falsche Satz zum Cookie ist korrigiert: "Nur das Cookie geht bei jedem Aufruf mit, die Merkzettel bleiben bei dir."
- Cloudflare und IONOS stehen jetzt in "Genau lesen" auf "Ist das sicher?" mit Verweis auf die Datenschutzerklärung. Die Kurzfassung bleibt bei "Ein KI-Dienst in der Cloud ist nicht beteiligt", was stimmt, aber den Tunnel nicht nennt.
- Das Elternbrief-Du/Sie-Gemisch ist besser: "Information für Eltern" siezt, "KI zu Hause" duzt, beide verweisen aufeinander ("Zu Hause? eigene Seite für Eltern").
- Zeitangaben stimmen jetzt: Kurzmodus "ca. 1 Min", Genau lesen "ca. 6 Min" (vorher 1, 4 und 6 Min nebeneinander).
- Menü "Für dich" enthält "Was ist KI?" (vorher 4 Klicks, jetzt 2: Menü, Was ist KI?). Eltern haben einen eigenen Pfad "Für Eltern" (Schritt 1 von 7), nicht mehr "Unterricht vorbereiten".
- Suche "Jugendschutz" findet "Eltern zu Hause" (vorher 0 Treffer). Statuszeile "Auslastung 73 %" im Menü ist weg.
- Elternabend-Leitfaden beantwortet genau meine Fragen: "Gibt es einen Jugendschutzfilter? Nein, das Labor schaltet keinen eigenen Filter vor das Sprachmodell. Jüngere nutzen den Chat nur in Begleitung." und nennt Deepfakes, Mobbing, Nummer gegen Kummer 116 111.

Gleich:
- Suche "Bildschirmzeit": weiter 0 Treffer, es gibt keinen Inhalt dazu.
- "Der Rechner ist bereit und frei. Gerade zu 0 Prozent ausgelastet." auf der Elternstartseite, ohne Nutzen für mich.
- "Ist das sicher?" liegt weiter unter "Der Rechner dahinter" und beginnt mit dem Kasten "Deine Zustimmungen" statt mit der Antwort (51-sicher-oben.png).
- Gesichts-Labor ohne Kamera: "Beispielbilder gibt es hier nicht".
- Betreiber bleibt eine Privatperson. Das Impressum ist jetzt auf der Elternseite verlinkt ("Impressum: Kontakt des Betreibers"), aber ohne direkte E-Mail auf der Seite.

Schlechter: nichts Gewichtiges. Neu und unschön sind die Kleinigkeiten in Abschnitt 3 (Infoblatt "Lizenz: noch festzulegen", Suchfeld).

## 3. UX- und UI-Befunde

### Blocker
Keine.

### Hoch
1. Suchfeld auf dem Handy: nur 101 Pixel breit, der Platzhalter "Seiten suchen" erscheint als "Seiter", die getippte Eingabe ("Kinder") ist abgeschnitten (13-suche-Kinder.png, jede Seite oben rechts). Unter "Noch nichts gelesen" steht ein leerer grauer Balken. Beim Tabben hat das Feld keinen Fokusring (outline none), alle anderen Elemente haben 3 Pixel.
2. Das Willkommens-Fenster ist gut, aber die Elternkarte ("Sicher und verständlich") trägt keinen Hinweis auf 16+, nur die Schülerkarte (01-willkommen.png). Wer als Elternteil wählt, sieht die Altersgrenze erst auf der Elternseite. Das ist akzeptabel, weil sie dort in Zeile zwei steht ("Ab 16 Jahren gedacht. Die Seite prüft das Alter nicht, darum begleitest du Jüngere."), aber eine Sperre für die Kinder-Kamera erklärt keine Seite (nur "Kamera aus lassen").
3. Elternabend-Infoblatt (infob-1.png): Kopfzeile "Lizenz: noch festzulegen" steht auf dem Blatt, das ich als Mutter in die Hand bekomme. Keine E-Mail-Adresse, nur "Betreiber ist Daniel Alisch" plus zwei Webadressen. Die beiden Kästen unten sind unsauber: Überschrift "Im Unterricht" und "Zu Hause" sitzen verschieden hoch, der Text neben dem rechten QR-Code bricht mitten in der Webadresse ("eltern-zuhause?" / "weg=schule"). Gut 30 Prozent der A4-Seite sind leer.

### Mittel
4. Die Kurzfassung der Kamera-/Gesichtszeilen ("Jedes Bild geht nur für einen Augenblick an den Rechner dieser Seite", Einwilligungsdialog 31-gesicht-dialog.png) nennt den Weg über Cloudflare nicht. In "Genau lesen" auf "Ist das sicher?" steht er, aber nur im Abschnitt "Texte, die du eintippst", nicht bei Kamera und Mikrofon. Im öffentlichen Betrieb laufen auch Kamerabilder durch den Tunnel (laut Datenschutzerklärung). Der Satz ist verständlich, aber unvollständig.
5. Widerspruch: Datenschutzerklärung: "Alle Labore lassen sich auch mit Beispielbildern ohne Kamera nutzen." Gesichts-Labor nach "Ohne Kamera weitermachen": "Beispielbilder gibt es hier nicht" (33-gesicht-ohne.png).
6. "Ist das sicher? Was wird gespeichert?" ist weiter als Kategorie "Der Rechner dahinter" einsortiert, der Seitenanfang ist ein Bedienfeld ("Nicht zugestimmt / Widerrufen", beide Zeilen grau) statt der Antwort. Die Antwort kommt erst im Abschnitt "Die kurze Antwort" nach etwa einem Bildschirm.
7. Auf Sie-Seiten steht der Hilfekasten "Du liest gerade kurz: ... klappst du ..." (schule-eltern, elternabend). Auf "Elternabend" (Lehrerseite) heißt der Schlusskasten "Das nimmst du mit" bei Sie-Text. Stilbruch.
8. Wer als Elternteil die Schule-Info sucht: "Info Eltern" und "Elternabend" stehen nicht in "Für dich". Weg: Menü, Alle Bereiche, Für die Schule, Info Eltern = 4 Klicks. Besser: Link auf "KI zu Hause" bei "Weiter geht es" (vorhanden: "Information für Eltern" ist dort verlinkt), aber nicht im Menü.
9. Suchergebnisse laut: "Schule" nennt als erste Gruppe Sprache mit "Gut fragen, Grenzen, Sprachmodell im Chat", "Kinder" zeigt Chunking und Suchen, "Alter" zeigt 20 Treffer in 9 Gruppen. Die passenden Seiten stehen nicht oben.
10. Statuszeile "Der Rechner ist bereit und frei. Gerade zu 0 Prozent ausgelastet." in jeder Rollenansicht, auch bei Eltern (02-start-eltern.png). Für mich ohne Bedeutung, leicht beunruhigend ("wer rechnet da?").
11. Falsche Adresse (zum Beispiel #/gibt-es-nicht-xyz) wirft ohne Hinweis auf die Startseite. Keine Meldung "Diese Seite gibt es nicht".
12. Fußzeile sagt weiter "Sitzungs-Cookie ... und der im Browser gemerkte Lernfortschritt". Der Fortschritt wird standardmäßig nicht gemerkt (gemessen: nach fünf Seiten nur kl-weg, kl-willkommen und sessionStorage kl-hilfe). Das ist richtig gemacht, der Satz klingt aber nach "wird immer gemerkt".

### Klein
13. Elternabend-Download-Karten sind sauber, aber der Name "Leitfaden und Fragen für Lehrkräfte ... 2 Seiten, für Sie" stimmt nicht: das PDF hat 1 Seite (pdfinfo: Pages 1).
14. Arbeitsblatt Medien 5 (ab5-1.png): Zeile "Zeit: Aufgaben 20 Minuten, mit Quiz und Nachdenken eine Doppelstunde ·" endet mit einem einzelnen Punkt, die Zeile "Niveau" steht darunter eingerückt. Das Blatt ist sonst klar (QR, Selbsteinschätzung, Operatoren).
15. Kartenset (karten-1.png): sechs Karten je Seite sauber gerastert, unten viel Weiß. Karte 1 (Container) hat abgeschnittenen Text "CROWLD" (gewollt oder Beschnitt, nicht klärbar).
16. Mehrere Elternseiten haben 6 Links unter 30 Pixel Höhe (eltern-zuhause), vor allem Fließtext-Links.
17. Im Menü (10-menue.png) ist unten am Rand eine kurze dunkle Linie sichtbar (vermutlich der Schließen-Balken des Betriebssystems, nicht eindeutig).
18. "Du bist schon auf dieser Seite." im Begriffsbaum auf "Was ist KI?" (40-was-ist-ki.png) ist als Satz unklar.

### Was ich ausdrücklich gut finde (UI)
- Layout: durchgehend ein Spaltenraster, gleiche Kartenhöhen, gleiche Abstände, Kopfzeile fest. Hell und Dunkel gleich sauber (Kontrast des grauen Untertextes im Dunkelmodus ausreichend).
- Ikonenlisten statt Textwand ("Kein Konto, Keine Werbung, Texte nur kurz") und die Gegenüberstellung "Kann gut / Kann nicht" mit "gegen" (ez-1.png). Das ist verständlich in Sekunden.
- Kurz/Genau-Schalter ist mobil gut zu treffen. "Mehr dazu" öffnet ohne Sprung.
- Ladezeiten Seite zu Seite 1,1 bis 2,4 Sekunden, keine Konsolenfehler.
- Willkommens-Fenster mit unscharfem Hintergrund, schließbar, "Später" da, "Nichts wird gesendet, deine Wahl bleibt nur in deinem Browser" (stimmt: gemessen kl-weg und kl-willkommen).

## 4. Prüfung der Datenschutz-Aussagen (gemessen oder mit der Datenschutzerklärung abgeglichen)

| Aussage im Labor | Befund |
|---|---|
| Cookie kl_s, 24 Stunden, Daten dahinter 30 Minuten | Stimmt: Set-Cookie "HttpOnly; Max-Age=86400; Secure; SameSite=lax". Datenschutzerklärung nennt 24 Stunden und 30 Minuten. |
| "Nur das Cookie geht bei jedem Aufruf mit" | Stimmt (vorher falsch formuliert, jetzt korrigiert). |
| Lernfortschritt standardmäßig nicht gemerkt | Stimmt: nach fünf Seiten kein kl-gelesen, kein kl-zuletzt. |
| Rolle merkt sich nur ein Wort | Stimmt: kl-weg=eltern. |
| Chat läuft auf dem Rechner, kein Cloud-KI-Dienst | Datenschutzerklärung stimmt überein ("keine externen KI-Dienste"). Chat nannte sich "Built with Llama", Modell llama3.2:3b lokal. |
| Weg über IONOS und Cloudflare (USA), Protokolle 14 Tage | Stimmt mit der Datenschutzerklärung überein. Im Labor nur in "Genau lesen", nicht im Kamera-Abschnitt (Befund 4). |
| Kamera/Mikro/Gesicht ab 16, kein Alterscheck | Stimmt mit Dialog, Startseite, Elternseite und Datenschutzerklärung überein. Ehrlich, aber kein Schutz. |
| Im Unterricht keine Kamera, kein Mikro, keine Gesichtserkennung | Elternbrief, Infoblatt und Leitfaden sagen es gleichlautend, Arbeitsblätter verlangen keine Kamera. |
| "Alle Labore ohne Kamera mit Beispielbildern" (Datenschutzerklärung) | Gesichts-Labor widerspricht (Befund 5). |

Verständlichkeit: Die Seite "Ist das sicher?" ist für Laien gut lesbar, die Tabelle der Browser-Einträge ist ehrlich, aber mit elf Zeilen lang. Dass der Betreiber eine Einzelperson mit Heimrechner ist, sagt die Datenschutzerklärung klar ("Rechner in meinem Heimnetz"). Im Labor selbst erfahre ich das nicht, die Eltern-Fußzeile sagt nur "Ein Projekt von Daniel Alisch".

## 5. Elternabend-Infoblatt (geöffnet, pdftoppm, infob-1.png)

Eine Seite A4. Inhalt: Worum es geht, Was Ihr Kind tut, Welche Daten, Zu Hause, Wichtig. Sie-Form, kurze Sätze, kein Fachwort außer "Cookie". Die Daten-Aussage ("kein Konto, keine Werbung, speichert Chat-Eingaben nicht dauerhaft; kleines Cookie, einige Merkzettel, Verbindungsdaten des Servers; verbindlich ist die Datenschutzerklärung") stimmt mit der Webseite und der Datenschutzerklärung überein. "Alle Aufgaben kommen ohne Kamera und Mikrofon aus" stimmt. "Vereinbaren Sie ein Codewort für Notfallanrufe" ist ein guter, konkreter Tipp. QR-Codes decodieren zu https://ki-labor.daniel-alisch.site/schule-eltern?weg=schule und .../eltern-zuhause?weg=schule und beide antworten mit 200. Mängel: Befund 3 (Lizenzzeile, Kontakt, Kästen, leerer Platz). Für den Elternabend ist es in dieser Form brauchbar, aber nicht abgabefertig.

## 6. Zielaufgaben

1. Ist das Labor für meine Kinder sicher (Daten, Kamera, Altersgrenze)? Gelöst. 1 Klick ("Öffnen" auf "Eltern zu Hause"), 2,4 Sekunden. Die Seite antwortet ehrlich: ja zum Lernen (kein Konto, keine Werbung), Kamera nur nach Zustimmung, Gesicht ab 16 ohne Alterscheck, kein Jugendschutzfilter, deshalb gemeinsam nutzen. Wünsche: eine Anleitung, wie ich die Kamera für mein Kind sperre, und ein Satz, dass ein Kind den Link allein aufrufen kann.
2. Etwas zum Erklären, was KI ist. Gelöst. 2 Klicks (Menü, "Was ist KI?"), 1,4 Sekunden. Die Seite hat 467 Wörter, Zeitleiste, Begriffe, Video 1:24. Als Satz für ein Kind taugt der Einstieg ("Ein Oberbegriff, unter dem sehr verschiedene Verfahren stecken") nur bedingt.
3. Eine Info für die Schule. Gelöst. Über die Suche "Eltern" (Tippen und 1 Klick auf "Info Eltern") oder 4 Klicks über Menü, Alle Bereiche, Für die Schule. Dazu "Elternabend" mit Infoblatt-PDF. Das ist eine Info der Schule an mich, keine Info für die Schule; was ich der Schule sagen könnte, gibt es nicht. Das passt aber zum Zweck.

## 7. Weiterempfehlen

Ja, ich würde es skeptischen Eltern empfehlen: Es sagt ehrlich, was es speichert und was es nicht verspricht, und die Antwort auf "Ist das sicher für Kinder?" steht jetzt in einem Satz da. Ich würde dem 12-Jährigen den Link geben, wenn ich beim ersten Mal dabeisitze, und für die Kamera erst eine Sperre kennen müsste.

Die drei größten Lücken Richtung 10:
1. Eltern-Handlungsanleitung fehlt: Kamera für das Kind sperren (zwei Schritte im Browser), ein Satz zum Alleinaufruf des Links, ein Elternkontakt (E-Mail) direkt auf der Elternseite und auf dem Infoblatt.
2. Letzte Reste Uneinheitlichkeit: Cloudflare und USA auch in der Kurzfassung und im Kamera-Abschnitt, Gesichts-Labor gegen Datenschutzerklärung ("Beispielbilder"), "Ist das sicher?" nach oben statt "Der Rechner dahinter" und die Antwort vor die Zustimmungsbox, Lizenzzeile auf dem Infoblatt.
3. Mobile Bedienung: Suchfeld auf 101 Pixel (Platzhalter und Eingabe abgeschnitten, leerer Balken, ohne Fokusring), laute Suchtreffer, stille Weiterleitung bei falscher Adresse, keine Inhalte zu Bildschirmzeit.
