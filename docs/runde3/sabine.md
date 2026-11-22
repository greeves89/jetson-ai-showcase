# Prüfrunde 3: Sabine (49, Geschäftsführerin Handwerksbetrieb, Laptop 1440x900)

Testadresse https://192.168.178.83:8443, Playwright über tests/browser.mjs, ein headless Chromium (am Ende geschlossen), helles Schema, dazu Dunkelmodus an drei Stellen. Screenshots in /tmp/r3-sabine/ (22 Dateien, 12 davon mit dem Read-Werkzeug angesehen). Sprachmodell: genau eine Anfrage (Chat, Angebot aus Notiz), danach keine weitere. Keine Ratenbegrenzung aufgetreten. Zeiten sind Maschinenzeiten, keine Lesezeiten. Skripte: /tmp/r3-sabine/a.mjs bis g.mjs (nicht im Repo).

Meine Rolle: wenig Zeit, will Nutzen, Kosten, Risiken. Aufgaben: (1) in 15 Minuten klären, was KI im Betrieb bringt, (2) ein Beispiel für Angebote oder Rechnungen, (3) was vor dem Einsatz zu fragen und zu klären ist (Datenschutz).

## 1. Gesamtnote und Raster

Gesamtnote: 7,8 von 10 (Vorrunde 7,0). Ehrlicher Eindruck, kein Mittelwert.

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit | 8,5 | Kurzmodus mit Kernsätzen, kaum Fachwörter auf Handwerk, Business, Einführung. Begriffe wie "Pilot" und "Token" werden erklärt (Fragezeichen-Hilfe, z. B. "KI" auf der Startseite). Abzug: Kosten-Seite mit 1306 Wörtern, Rechner mit sieben Annahmen (21-kosten.png). |
| 2 | Einstieg und Führung | 9,0 | Willkommens-Fenster, Klick auf "Ich entscheide im Betrieb", nach 145 ms steht die Rollenseite mit "In 15 Minuten" und einem Knopf (02-rolle-start.png). Zeitangaben je Schritt stimmen jetzt mit den Seitenköpfen überein (ca. 1 Min Lesen, Video 1:24, Labor ca. 3 Min), Summe sichtbar: 4 Min Lesen, Video 4:00, Labor 9 Min. Abzug: Titel "In 15 Minuten", die Summe ergibt 17; Pfadangabe "Schritt 4 von 10" in der Seite widerspricht "Vier feste Seiten" (siehe Befund H2). |
| 3 | Lernwirkung | 7,5 | Ich kann erklären: Problem zuerst, Pilot mit vorher festgelegtem Maßstab, Datenschutz und Betriebsrat früh einbinden, lokal gegen Cloud. Abzug: kein Nutzen in Stunden oder Euro, keine realen Preise für Büro-KI im Betrieb. |
| 4 | Motivation | 7,0 | Handwerk ist jetzt die erste Karte unter "Empfohlen für dich" (03-rolle-start-voll.png). Die Handwerk-Seite selbst hat Grafiken, aber weiter kein Video, kein Startknopf, kein Quiz. Der Chat liefert ein Angebot, das Floskeln enthält (siehe 4). |
| 5 | Labore und Interaktion | 7,0 | Chat läuft, Hinweis "Antwort eines KI-Modells. Sie kann falsch sein", Beispielfragen, freundliche Leereingabe (33-chat-leer.png). Antwort nach 28 Sekunden noch nicht fertig (Stopp-Knopf sichtbar, Text endet mit "zögern Sie bitte nicht", 35-chat-antwort.png). Kein Labor mit Angebot oder Rechnung als Startknopf. |
| 6 | Videos | 8,0 | Je 1:12 bis 1:24, Kapitelmarken mit Zeitstempel, Hinweis "Sprecherstimme KI-erzeugt", Verweis "Der Verweis am Ende der Folge meint diese Seite". Handwerk hat keines. Im Video 'Kosten' ist die große grüne Zahl im Bild unten abgeschnitten (21-kosten.png, Standbild), wirkt aber nur im Ausschnitt so. |
| 7 | Navigation | 8,0 | Menü beim Start: 7 Einträge "Für dich" plus eingeklappt "Alle Bereiche" (04 zeigt die neutrale Variante, 02 die Rollenvariante). Suche "Datenschutz" findet jetzt "Recht und Regeln" nur noch einmal, dazu eine Begriffskarte "Datenschutz-Grundverordnung" (31-suche-datenschutz.png). Abzug: zwei fast gleiche Gruppen "KI im Betrieb" und "Business-Use-Cases" im Menü (04-menue-offen.png). 93 Links im Baum. |
| 8 | Vertrauen und Sicherheit | 8,5 | "Ist das sicher?" listet Zustimmungen, Kurzantwort, "Texte nur kurz", "Kein KI-Dienst in der Cloud beteiligt", "Verbindlich sind Impressum und Datenschutzerklärung". Recht-Seite sagt "keine Rechtsberatung". Abzug: kein Satz zum Auftragsverarbeitungsvertrag bei konkreten Diensten, kein Hosting-Hinweis (Standort) auf der Rollenseite. |
| 9 | Barrierefreiheit und Bedienbarkeit | 8,5 | Sprunglink "Zum Inhalt springen" ist der erste Tab-Stopp, Fokusrahmen 3 px an jedem Stopp, Reihenfolge logisch (Suche, Menü, Karten). Kontrast hell und dunkel gut (41, 42). Auf 1440x900 liegen die Empfohlen-Karten unter dem Falz (03-rolle-start-voll.png), "In 15 Minuten" füllt den ersten Bildschirm. |
| 10 | Fehlerfälle | 8,0 | Leere Chat-Eingabe: orangefarbener Hinweis "Schreib zuerst eine Frage." (33-chat-leer.png). 404: "Seite nicht gefunden. Diese Adresse gibt es im KI-Labor nicht. Zur Startseite." Abzug: 404 meldet zusätzlich einen Konsolenfehler (normal). |

## 2. Vergleich zur Vorrunde

Besser:
- Handwerk steht jetzt als erste Karte auf meiner Rollenseite und im Menü "Für dich" (Vorrunde: nur über Suche oder als elfter Eintrag). Aufgabe 2 dauert 2 Klicks.
- Zeitangaben vereinheitlicht: Pfadliste und Seitenköpfe nennen dieselben Werte, Summe unter der Liste.
- Suche "Datenschutz" zeigt "Recht und Regeln" nur einmal und eine Begriffserklärung statt dreier gleicher Titel.
- Menü mit Rollen: "Für dich" kurz, "Alle Bereiche" zugeklappt. Rollenwechsel in unter 0,2 Sekunden.
- Tastaturbedienung geprüft: Sprunglink, sichtbarer Fokus.
- Kein Konsolenfehler auf den geprüften Seiten außer dem erwarteten 404.

Gleich geblieben:
- Handwerk ohne Video, ohne Startknopf, ohne Quiz.
- Kosten: Betreuung steht auf 0,00 €, Ergebnis "Eigener Betrieb ist 1.181,74 € günstiger" wirkt wie eine Empfehlung; der lange Rechenabsatz steht weiterhin doppelt (21-kosten.png, Abschnitt nach "Messwert des Jetson übernehmen"). Keine realen Preise für Büro-KI.
- Checklisten nicht speicherbar oder druckbar; keine Kontaktmöglichkeit, kein Ansprechpartner.
- Chat-Antwort inhaltlich flach, kein Satz, dass ein kleines Lokalmodell nicht mit kommerziellen Diensten vergleichbar ist.
- Vollseiten-Screenshot (fullPage) zeigt Grafiken leer (10-handwerk-voll.png), beim echten Scrollen sind sie da (20-handwerk-scroll.png). Beim Drucken oder Speichern als PDF möglicherweise leer, nicht geprüft.

Schlechter:
- Neuer Widerspruch im Pfad: Die Seite "KI einführen" verweist unter "Nächste Seite im Pfad" auf Handwerk, Handwerk wiederum auf Kosten und Energie, "Pfad KI im Betrieb, Schritt 4 von 10" (42-dunkel-ende-einfuehrung.png). Die Rollenseite spricht von vier Seiten, der Pfad hat zehn. In der Vorrunde war es neun.

Neue Bereiche (Schule, PDFs, Kartenset, Elternabend): für meine Persona nicht relevant. Ich habe geprüft, ob es Download-Karten für Betrieb gibt: Im Ordner app/static liegen PDFs ausschließlich für Schule und Elternabend, kein druckbares Blatt für Entscheider.

## 3. UX- und UI-Befunde

Blocker: keine.

Hoch
- H1 Handwerk-Seite (Abschnitte Angebot, Baustellenfoto, Rechnungen, 10-handwerk.png, 20-handwerk-scroll.png): Die Seite, die meine Aufgabe 2 löst, hat nichts zum Mitmachen. Weder "Beispiel starten" noch Video noch Quiz. Alle anderen Anwendungsfall-Seiten (Dokumente, Bestellservice) haben Video und Labor.
- H2 Pfad und Zählung (02-rolle-start.png, 42-dunkel-ende-einfuehrung.png): "Vier feste Seiten" und "In 15 Minuten" gegen "Schritt 4 von 10" und eine Reihenfolge, in der Handwerk auf Einführung folgt, aber nicht zu den vier Seiten zählt. Ich weiß nach Schritt 4 nicht, ob ich fertig bin.
- H3 Kein Abschluss und kein nächster Schritt für Entscheider (alle Betriebsseiten): keine Zusammenfassung, kein druckbares Blatt mit den sechs Fragen, kein Hinweis, wen ich fragen kann.
- H4 Kosten (21-kosten.png): Betreuung 0,00 €, Beispielwerte (500 € Anschaffung, 50 € Cloud) liefern ein Ergebnis, das nach Empfehlung aussieht. Es fehlt ein Vergleich mit Preisen pro Nutzer und Monat typischer Betriebslösungen.

Mittel
- M1 Chat (35-chat-antwort.png): 28 Sekunden, Antwort noch nicht fertig, dabei Floskeln ("Warum wir uns für diesen Preis entscheiden", "Kontaktinformationen"). Die Rechnung selbst stimmt (360 € plus 320 € gleich 680 €). Ein Hinweis, dass das kleine Modell Angebote nur als Entwurfsstil liefert, fehlt.
- M2 Kosten-Seite: 1306 Wörter, der Rechenabsatz doppelt. Sieben Eingabefelder, alle mit "Beispielannahme" beschriftet, das wiederholt sich siebenmal.
- M3 Einführung (41-dunkel-checkliste.png): "Checkliste für den Start" ist ein Schaubild, die sechs Fragen stehen erst hinter "Mehr dazu". Als Entscheiderin wollte ich die sechs Fragen sofort sehen, zum Abhaken.
- M4 Menü (04-menue-offen.png): "KI im Betrieb" und "Business-Use-Cases" sind kaum unterscheidbar, Handwerk liegt in der zweiten Gruppe, Kosten und Einführung in der ersten.
- M5 Kopfzeile jeder Lernseite: "Business-Use-Cases · ca. 1 Min Lesen" und "Grundlagen · Lektion · ..." mit Trennpunkt ohne Folgetext in der Textansicht, in Grafik sieht es richtig aus; kleine Unsauberkeit, in 10-handwerk.png als "Business-Use-Cases ·" mit Uhr-Symbol zu sehen.
- M6 Willkommens-Fenster (01-willkommen.png): Kachel "Ich bin Schüler:in" ist höher als die anderen (zusätzlicher Satz zu Kamera ab 16), dadurch Symbole und Textzeilen in der Reihe nicht auf einer Linie. Der Schalter "Lernfortschritt merken" ist ohne Erklärung, was gespeichert wird (der Hinweis "Nichts wird gesendet" steht darunter).

Klein
- K1 Fußzeile (03-rolle-start-voll.png, 41): beginnt bei x=416 statt bei der Inhaltskante 360 auf der Startseite, uneinheitlich zur Spalte darüber.
- K2 Rollenseite: Chip "Ich entscheide im Betrieb" oben rechts ist wenig als Schalter erkennbar (Klick öffnet vermutlich die Rollenwahl, nicht geprüft).
- K3 Fortschrittsbalken "Noch nichts gelesen" auf jeder Seite, auch nach dem Lesen; ohne Rolle oder Merken wenig Wert.
- K4 Quellen- und Lizenzhinweis in der Fußzeile ist klein (ca. 12 px) und eng gesetzt.
- K5 Dunkelmodus: Schalter "Kurz lesen" aktiv als graue Fläche, Kontrast zum Hintergrund mäßig (41-dunkel-checkliste.png), lesbar.
- K6 Recht-Seite: einige Fließtext-Links gehen auf "#/verzerrung-ethik", andere auf "/lizenzen". Zwei Adressformen im Text, beide funktionierten nicht gegeneinander geprüft.

Positiv zu UI: ruhiges Layout, großzügige Abstände, gleichmäßiges Dreierkartenraster mit Knöpfen auf einer Linie (03), scharfe Piktogramme (lucide-Stil), gute Hell/Dunkel-Umsetzung, Ladezeit je Seite 1,0 bis 1,5 Sekunden, Rechnerstatus im Menü ("Rechner live und frei").

## 4. Zielaufgaben

1. Was KI im Betrieb bringt: gelöst. 2 Klicks (Rolle wählen, "Mit Schritt 1 starten"), Seite nach unter 2 Sekunden. Die Kernpunkte stehen auf "KI im Business" und "Handwerk". Nutzen in Zahlen fehlt weiterhin. Reine Lese- und Videozeit laut Seite: 4 Min Lesen plus 4:00 Video plus 9 Min Labor, also etwa 17 Minuten, realistisch 20 bis 25.
2. Beispiel für Angebote oder Rechnungen: gelöst, besser als in der Vorrunde. Rolle wählen, "Öffnen" auf der Karte "Handwerk": 2 Klicks, etwa 3 Sekunden. Die Seite beschreibt Angebot aus Notiz und Rechnungen sortieren ehrlich ("Du prüfst"). Zum Ausprobieren habe ich im Chat eine Notiz eingegeben (ein Klick auf Senden, Antwort nach über 28 Sekunden, Betrag korrekt, Stil floskelhaft). Die Seite verlinkt nicht direkt auf den Chat mit einer vorbereiteten Notiz.
3. Was vor dem Einsatz klären (Datenschutz): gelöst. Menü "KI einführen" (1 Klick) mit sechs Fragen (Problem, Ziel, Daten, Verantwortung, Betroffene, Rückfall) und Betriebsrat; "Recht und Regeln" über die Suche (3 Handlungen, etwa 15 Sekunden) mit DSGVO-Grundsätzen, Vertrag mit Dienstleister, EU-KI-Verordnung in vier Stufen, "keine Rechtsberatung". Nicht beantwortet: ob ich für ein konkretes Werkzeug einen Auftragsverarbeitungsvertrag brauche.

## 5. Empfehlung und größte Lücken

Würdest du es empfehlen? Ja, als kostenlosen, ehrlichen Einstieg für Chefinnen und Chefs kleiner Betriebe, vor allem wegen "KI einführen" und "Handwerk". Für Preise, ein konkretes Werkzeug und eine Ansprechperson brauchst du aber etwas anderes.

Drei größte Lücken Richtung 10:
1. Abschluss für Entscheider: eine Endseite "Deine Entscheidung" mit den sechs Fragen zum Abhaken, einem druckbaren Blatt (PDF wie bei der Schule), einem Satz zu Ansprechpartner oder Folgeangeboten, plus einheitlicher Pfad (vier gegen zehn Seiten, Reihenfolge Einführung, Handwerk, Kosten klären).
2. Handwerk zum Mitmachen: Startknopf "Angebot aus Notiz" (Chat mit vorbefüllter Beispielnotiz und Hinweis auf die Grenzen des kleinen Modells), dazu ein Rechnungsbeispiel, ein kurzes Video und ein Quiz wie auf den anderen Anwendungsfall-Seiten.
3. Kosten realistisch: Betreuung nicht auf 0 € vorbelegen, Doppeltext entfernen, einen Vergleich "ein Werkzeug im Betrieb" (Preis je Nutzer und Monat, Aufwand, Vertrag zur Auftragsverarbeitung, Standort) neben den eigenen Rechner stellen, und ein Satz zu Nutzen in Stunden als ausdrücklich eigene Annahme.
