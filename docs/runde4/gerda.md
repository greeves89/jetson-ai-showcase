# Prüfbericht Runde 4: Gerda (74, Rentnerin, Smartphone, Zoom 150 Prozent)

Testadresse https://192.168.178.83:8443, 22.11.2026. Ein headless Chrome, Viewport 390x844 bei Zoom 150 Prozent, also 260x563 CSS-Pixel, Touch, zweifacher Pixelfaktor. Hell und Dunkel, Erstbesuch mit Willkommens-Fenster. Bilder liegen in `docs/runde4/gerda-bilder/` (23 Screenshots, alle angesehen, dazu zwei PDF-Seiten). Eine Sprachmodell-Anfrage gestellt, keine Ratenbegrenzung erlebt.

## Gesamtnote: 6,5 von 10

Der Inhalt ist für Gerda gut gemeint und sachlich in Ordnung. Bei ihrer Schriftgröße bricht aber die Oberfläche: Die Seite ist breiter als der Bildschirm, Titel und Absätze sind am rechten Rand abgeschnitten, und der Schalter "Genau lesen" liegt außerhalb des sichtbaren Bereichs. Dazu kommt, dass es zu Telefonbetrug keine eigene, leicht auffindbare Seite gibt und keine Notrufnummer genannt wird.

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit fürs Alter | 7 | Kurze Sätze, aber "Token", "Temperatur", "Parameter", "Kontextfenster" schon auf der dritten Lernseite |
| 2 | Einstieg und Führung | 7 | "Ich will KI verstehen" führt klar, Willkommens-Fenster läuft aber über den Rand |
| 3 | Lernwirkung | 6,5 | Merksätze und Quiz gut, Betrugsschutz nur als Randthema hinter "Mehr dazu" |
| 4 | Motivation und Spaß | 7 | Bilderspiel mit sofortiger Erklärung, freundlicher Ton |
| 5 | Labore und Interaktion | 6 | Chat: erstes Wort nach 21,6 s, Antwort zum Enkeltrick ungenau |
| 6 | Videos | 6,5 | Schrift im Video bei 260 px winzig, Untertitel im Test auf "hidden" |
| 7 | Navigation und Orientierung | 6,5 | Suche findet "Betrug", aber nicht "falscher Anruf"; Pfadzählung widersprüchlich |
| 8 | Vertrauen und Sicherheit | 8 | Seite "Ist das sicher?" klar, ehrlich, ohne Kontozwang |
| 9 | Barrierefreiheit und Bedienbarkeit | 5 | Seitenüberlauf bei Zoom, "Genau lesen" nicht erreichbar, kleine Links |
| 10 | Fehlerfälle | 7,5 | 404 freundlich, leere Chat-Eingabe gemeldet, Warteschlange erklärt |

## Befunde nach Schwere

### Blocker
Keine, die den Zugang ganz verhindern. Alle Inhalte lassen sich lesen.

### Hoch
1. **Seite ist bei Zoom 150 Prozent breiter als der Bildschirm, Text wird rechts abgeschnitten.** Auf jeder Seite. Gemessen: sichtbare Breite 260 px, Layout 296 px (Startseite) bis 354 px (Lernseiten). Ursache für die Startseite: die Kopfleiste (Logo, Suche, Menü, `nowrap`) braucht mindestens 296 px. Folgen: "Kostenlo[s]", Titel "Echt oder KI? Bilder[...]", Absätze enden mitten im Wort. Seiten: Start `05-start.png`, Lernseite `11-echt.png`, `07-genki.png`, Karte `10-karte-scroll.png`, Fehlerseite `24-404.png`, Fuß `32-fuss.png`.
2. **"Genau lesen" liegt außerhalb des sichtbaren Bereichs.** Auf Lernseiten steht der Schalter bei x = 251 bis 352, sichtbar sind 260 px. Ein Seitwärtsscrollen blieb im Test wirkungslos (`31-genau-seitwaerts.png`). Gerda bekommt also nur die Kurzfassung und wüsste nicht, dass es mehr gibt (Fake-News-Seite: 773 Wörter kurz gegen 1288 genau).
3. **Willkommens-Fenster läuft über den rechten Rand.** Dialog 272 px breit bei 260 px Sichtbreite. Die zweite Kachelspalte (Ich unterrichte, IT, Elternteil) ist halb abgeschnitten, der Schließen-Knopf sitzt am Rand (`01-erst.png`, `03-erst-unten.png`). Das ist das Erste, was Gerda sieht. Die Kacheln sind aber gut beschriftet, "Ich will KI verstehen" ist eindeutig.
4. **Kein Weg "falscher Anruf erkennen" aus einem Guss.** Es gibt keine Seite zu Enkeltrick, Schockanruf oder falschem Bankmitarbeiter. Das Wort "Enkeltrick" kommt in den Inhalten nicht vor. Die Stimmen-Warnung steht auf "Echt oder KI?" in einem eingeklappten Abschnitt ("Stimmen: Klonen braucht wenig Material": Anruf, Druck, Auflegen, Klarheit) und im Video bei 1:34 ("Das Codewort"). Nicht genannt: Polizei 110, Anzeige, Verbraucherzentrale. Gerda findet es nur, wenn sie "Betrug" sucht und die richtige Seite öffnet (3 Klicks, etwa 40 Sekunden, siehe Zielaufgaben).

### Mittel
5. **Suche: "falscher Anruf" liefert nur "RAG messen"** (`15-suche-falscherAnruf.png`). "Betrug", "Enkeltrick", "Fälschung" liefern dagegen die Medienseiten (`15-suche-Betrug.png`). Bei "Datenschutz" steht zuerst die DSGVO-Begriffserklärung mit Fachsprache, nicht die Seite "Ist das sicher?".
6. **Suchleiste und Menü bei 260 px:** Platzhalter "Seiten sucher[...]" abgeschnitten, Logo links angeschnitten, darunter eine leere graue Zeile (`06-menue.png`, `15-suche-Betrug.png`).
7. **Chat:** Antwortrahmen "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges. Built with Llama" ist in eine schmale Spalte gequetscht (acht Zeilen) und schiebt "Built with Llama" über den Rand (`21-chat-antwort.png`). Wartezeit: Frage "Was ist ein Enkeltrick? Antworte kurz." nach 2 s "Der Jetson rechnet seit 1 s", nach 10 s "Du bist als Nächster dran. Gleich geht es los.", erstes Token nach 21,6 s, fertig nach 32 s (2,3 Tokens pro Sekunde). Die Meldungen sind gut, einen Hinweis, wie lange es etwa dauert, gibt es nicht. Die Antwort ist unscharf ("persönliche Unterstützung oder Hilfe", kein Hinweis auf Anruf, Geldforderung, Auflegen). Für eine Betrugs-Ängstliche ein schwaches Beispiel, der Warnhinweis darunter rettet es.
8. **Videos:** Die Schrift im Videobild ist bei 264 px Breite nicht lesbar (`14-video-spielt.png`). Positiv: Der gesprochene Satz steht darunter als Text. Die Untertitelspur "Deutsch" ist als Standard gesetzt, stand im Test aber auf "hidden". Nicht überprüft, ob echte Browser sie anzeigen.
9. **Lernpfad-Zahlen widersprechen sich.** Nach der Rollenwahl: "Neun kurze Seiten", dann "Schritt 1 von 10". Pfad "Verstehen" auf der Startseite: 9 Schritte; auf "Generative KI": "Pfad Verstehen, Schritt 3 von 9", auf "Echt oder KI?": "Pfad Bewerten, Schritt 2 von 13", auf "Ist das sicher?": "Schritt 12 von 13". Gerda kann nicht erkennen, wo sie steht.
10. **Fachwörter auf Seite 3 des "Verstehen"-Pfads.** "Generative KI" nennt Token, Temperatur, Kontextfenster, Diffusion in den ersten Sätzen (`07-genki.png`). Die "Was ist KI?"-Seite ist dagegen angemessen. Die Reihenfolge "Echt oder KI" an Stelle 2 ist für Gerda richtig, aber auf der Startseite nicht als solche erkennbar.

### Klein
11. Links "Lizenzen und Quellen" nur 16 bis 24 px hoch, Fußzeilenlinks klein und dicht (`32-fuss.png`). Alle anderen Knöpfe mindestens 44 px, das ist gut.
12. Quiz: Das Auswahlkreis sitzt über dem Text statt daneben, Antwortfläche aber groß und gut (`23-quiz.png`). Richtig/falsch wird farbig und mit Text gezeigt (`33-quiz-antwort.png`).
13. Fußtext (Cookie `kl_s`, Arbeitsspeicher, 30 Minuten) in einem Block, im Fließtext mit Code-Schrift und für Gerda zu technisch (`32-fuss.png`).
14. Auf der Fehlerseite fehlt neben "Zur Startseite" jede weitere Hilfe (Suche, "Neu hier"); ausreichend, aber knapp (`24-404.png`).
15. Chat leer abgeschickt: Die Meldung "Schreib zuerst eine Frage." ist im DOM vorhanden, im Ausschnitt nach dem Klick nicht sichtbar, nur der Rand des Felds färbt sich (`25-chat-leer.png`).

### Positiv, belegt
- Hell und Dunkel gleich gut lesbar, Kontrast stimmt (`27-dunkel-start.png`, `28-dunkel-echt.png`). Textgröße 17 px mit Zeilenhöhe 1,4.
- Fokusring auf allen Bedienelementen sichtbar (3 px, Tastatur-Tab geprüft: Überspringen-Link, Menü, Suche, Begriff "KI", drei Startknöpfe).
- Konsolenfehler: keine.
- Bilderspiel: sofortige, freundliche Rückmeldung mit Erklärung ("Leider falsch. Das Bild ist von einer KI erzeugt." plus Merkmale) (`22-spiel-antwort.png`).
- "Ist das sicher?": kein Konto, nichts gespeichert, Zustimmungen einsehbar und widerrufbar, Kundendaten ausdrücklich nicht eingeben (`16-sicher.png`).
- PDFs sauber: Kartenset (2 Seiten A4, 2,2 MB, Bilder scharf, `karten-1.png`) und Elternabend-Infoblatt (eine Seite, QR-Codes, Codewort-Tipp, `elt-1.png`).

## Zielaufgaben

1. **Was KI ist verstehen.** Willkommens-Fenster schließen oder "Ich will KI verstehen" wählen (1 Klick), "Was ist KI?" öffnen (2. Klick), Kurztext lesen: etwa 15 Sekunden bis zur Seite, Lesen etwa 2 Minuten. Gelungen. Meine Erklärung in drei Sätzen: KI ist ein Oberbegriff für Programme, die Aufgaben lösen, die sonst Denken brauchen. Maschinelles Lernen findet Muster in Beispielen, Regeln muss kein Mensch schreiben. Die meiste KI kann nur eine Aufgabe, Chatbots sind breiter, aber nicht allwissend. Verstanden, wegen der Schachtelgrafik und der fünf Bereiche. Abzug durch den abgeschnittenen Rand.
2. **Falschen Anruf erkennen.** Suche "Betrug" (Menü, tippen, 3 Klicks, etwa 25 s), "Echt oder KI?" öffnen, Abschnitt "Stimmen" aufklappen (ca. 45 Sekunden). Gefunden: Stimme klingt vertraut, Eile und Geheimhaltung, auflegen und zurückrufen, bekannte Nummer. Mit "falscher Anruf" in der Suche nicht gefunden (nur "RAG messen"). Keine Polizei, kein Schockanruf, kein Enkeltrick als Wort. Teilweise gelungen.
3. **Speichert das Labor etwas über mich?** Fuß "Ist das sicher? Was wird gespeichert?" oder Suche "speichert" (2 Klicks, etwa 20 s). Gelungen und klar: kein Konto, Bilder und Aufnahmen nicht gespeichert, Texte verfallen nach 30 Minuten, ein Cookie und Merkzettel im Browser, Server sieht technische Verbindungsdaten. Die Kurzfassung ist verständlich; "Was der Server technisch sieht" bleibt hinter "Mehr dazu" ohne Angabe, ob Adressen protokolliert werden.

## Empfehlung in zwei Sätzen
Für Gerda erst empfehlbar, wenn die Seite bei 260 px Sichtbreite nichts mehr abschneidet und "Genau lesen" erreichbar ist. Danach braucht sie eine eigene, auffindbare Seite "Falscher Anruf, Enkeltrick, Schockanruf" mit Notrufnummer und klaren Schritten.

## Die drei größten Lücken Richtung 10
1. **Layout bei Zoom 150 Prozent reparieren:** Kopfleiste umbrechen lassen, Willkommens-Fenster, Chat-Rahmen und Umschalter "Kurz/Genau lesen" auf die verfügbare Breite begrenzen, Test mit 260 px Breite aufnehmen (Prüfung auf `scrollWidth <= innerWidth`).
2. **Eigene Betrugs-Seite für ältere Menschen:** "Falscher Anruf erkennen" als ein Bildschirm: 4 Regeln, Codewort, Polizei 110, Beispiele (Enkeltrick, falscher Polizist, Bankmitarbeiter), erreichbar von Startseite, Rollenwahl und Suche (auch mit "falscher Anruf", "Schockanruf").
3. **Orientierung und Alltagssprache:** Pfadzählung vereinheitlichen, Fachwörter in der ersten Lernphase (Token, Temperatur) für diese Rolle weglassen oder erst später bringen, Chat mit Hinweis auf erwartete Wartezeit und einer sicheren Beispielfrage zu Betrug.
