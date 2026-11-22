# Prüfbericht Runde 4: Heike (55, Inhaberin Steuerbüro, Laptop 1366x768)

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443, headless Chromium (Playwright, tests/browser.mjs), Viewport 1366x768. Erstbesuch mit Willkommens-Fenster und Rollenwahl, hell und dunkel, Tastatur, Suche, Video, Druck (Playwright-PDF mit pdftoppm -r 60), zwei Chat-Anfragen. 30 Screenshots in /tmp/hk, die zitierten alle mit dem Read-Werkzeug angesehen. Keine Konsolenfehler, keine fehlgeschlagenen Anfragen in allen Läufen.

## Gesamtnote: 7,5 von 10

Für eine Inhaberin, die nur wissen will, was KI im Büro bringt und was datenschutzrechtlich geht, ist der Betriebspfad gut gebaut: klare Rolle, vier Seiten, eine Checkliste zum Abhaken, ehrliche Aussagen zu Grenzen. Zwei Dinge halten die Note unten: Das einzige Werkzeug, mit dem man KI selbst erlebt (der Chat), lieferte in drei Versuchen keine Antwort, und die Datenschutzfrage wird für ein Steuerbüro nur halb beantwortet (kein Wort zu Berufsgeheimnis, Steuergeheimnis, Auftragsverarbeitung für den eigenen Betrieb).

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit | 8 | kurze Sätze, wenig Fachwörter; ein sprachlicher Ausrutscher "der leichte Karton" (siehe klein 2) |
| 2 | Einstieg und Führung | 8 | Rolle "Ich entscheide im Betrieb" (Screenshot 01) führt in 1 Klick auf eine Startseite mit Pfad "In 15 Minuten" (Screenshot 02, 03-start-voll) |
| 3 | Lernwirkung | 7 | Checkliste und Kostenrechner wirken; Steuerbüro-Bezug fehlt, Beispiele sind Handwerk und Fertigung |
| 4 | Motivation | 6 | sauber und nüchtern, aber das Ausprobieren (Chat) scheiterte; Handwerk-Seite zeigt nur Schaubilder |
| 5 | Labore und Interaktion | 5 | Chat: 3 Versuche, keine Antwort (Screenshot 14, 16, 17); Checkliste und Kostenrechner funktionieren |
| 6 | Videos | 8 | 1:16, deutsche Untertitel an, Kapitelliste, "Nochmal ansehen" am Ende (Screenshot 26, 27) |
| 7 | Navigation | 8 | Menü "Für dich", Suche mit Synonymen, Zurück-Knopf; Lücken bei Mandanten/Kanzlei (siehe mittel 2) |
| 8 | Vertrauen und Sicherheit | 7 | ehrlich und gut sichtbar, aber nur Labor-Sicht, nicht Betriebs-Sicht (siehe hoch 2) |
| 9 | Barrierefreiheit | 8 | Skip-Link als erster Tab-Stopp, Fokusring 3 px, Dunkelmodus gut lesbar (Screenshot 22 bis 24), Fließtext 17 px |
| 10 | Fehlerfälle | 7 | freundliche Hinweise mit "Noch einmal versuchen" und Warteschlangen-Anzeige, aber Dead End nach 89 s (siehe hoch 1) |

Weiterempfehlen: Ja, als Einstieg für Entscheider, mit dem Vorbehalt, dass der Chat nicht immer erreichbar ist und die Datenschutzantwort für Berufsgeheimnisträger ergänzt werden sollte.

## Befunde

### Blocker
Keine.

### Hoch
1. **Chat liefert keine Antwort, Hinweise widersprechen sich** (Seite /chat, Pfad-Schritt 2 "Ein Sprachmodell selbst befragen"; Screenshot 14, 16, 17). Versuch 1 nach 7 s: "Dem Jetson fehlt gerade freier Speicher, um das Sprachmodell zu laden." Versuch 2 nach 6 s: "Das Sprachmodell antwortet gerade nicht", obwohl direkt darüber "Modell bereit, im Speicher" stand. Versuch 3 (nach Pause): Warteschlange "Nr. 3, etwa 60 Sekunden", sinkend auf "als Nächster dran", nach 89 s "Der Rechner ist gerade ausgelastet ... Versuch es gleich noch einmal". Die Warteschlangenanzeige ist vorbildlich, das Ende nicht: nach 89 s Warten gibt es keine Antwort. Teile davon gehen auf die gemeinsame Last der Prüfrunde und auf den Speicher des Jetson, trotzdem: Der Betriebspfad schickt Schritt 2 genau auf diese Seite. Die Startseite sagte zudem "Rechner bereit und frei (zu 0 Prozent ausgelastet)", im Chat und später im Menü "Rechner live, gerade viel los". Ein Entscheider ohne Geduld bricht hier ab.
2. **Datenschutzantwort passt nicht auf ein Steuerbüro** (Seite /sicherheit-einfach, Abschnitt "Darf ich Kundendaten eingeben?", Screenshot 23; Seite /recht). Die Antwort lautet: "Nein. Nimm erfundene Beispiele." Das ist für das Labor richtig, beantwortet aber nicht, was Heike eigentlich wissen muss: Darf mein Büro KI mit Mandantendaten betreiben und unter welchen Bedingungen? /recht nennt Auftragsverarbeitung und Zweckbindung allgemein, aber weder Berufsgeheimnis noch Steuergeheimnis noch Schweigepflicht (Textsuche über alle gelesenen Seiten: kein Treffer für Berufsgeheim, Kanzlei, Mandant). Wer in der Suche "Mandanten" oder "Schweigepflicht" tippt, bekommt "Dazu habe ich nichts gefunden" (Screenshot 09). Auch die Seite "Deine Entscheidung" (Frage 3) sagt nur "Daten und Rechtsgrundlage geklärt?" ohne Hinweis, wo man das klärt.

### Mittel
1. **Druckausgabe der Checkliste enthält Bedienelemente** (Seite /betrieb-entscheidung, Knopf "Seite drucken"; Screenshot pdf-1, pdf-2). Im Druck-PDF (3 A4-Seiten) stehen "Zur Startseite", "Kurz lesen/Genau lesen", mitten im Text eine Kopfleiste "KI-Labor, Seiten suchen, Menü" und unten "Zum Inhalt springen". Die Nummern 1 bis 3 sind zum Teil überdeckt, die Checkliste passt nicht auf eine Seite. Für das einzige Blatt, das man abheften würde, nicht druckreif. Hinweis: gemessen mit dem Druck von headless Chromium, ein echter Druckdialog kann leicht abweichen.
2. **Kein Steuerbüro-Bezug in den Beispielen** (Seiten /uc-handwerk, /uc-fertigung-sichtpruefung, /uc-buero-dokumente). Die Einsatzfälle sind Handwerk, Fertigung, Dokumente befragen mit Wartungsanleitung und Dienstleistungsvertrag. Rechnungen und Belege sortieren kommt nur in einem Satz auf der Handwerk-Seite vor ("Beträge und Steuerliches prüfst du selbst"). Für Kanzleien und Büros mit Belegfluss fehlt ein Fall.
3. **Weg zur Datenschutz-Seite im Rollenmenü fehlt** (Startseite, Menü "Für dich", Screenshot 03-start-voll). Das Menü enthält Handwerk, Sichtprüfung, Dokumente, Gut fragen, KI im Business, KI einführen, Kosten, Deine Entscheidung. "Ist das sicher?" und "Recht und Regeln" stehen nicht darin, obwohl der Pfad "beruf-praxis" sie enthält. Die Suche "Datenschutz" führt zuerst zu "Recht und Regeln", "Ist das sicher?" erst an fünfter Stelle.
4. **Kontakt und Verantwortung nur über die Hauptseite eines Dritten** (Seite /ueber, Fußzeile, Seite "Deine Entscheidung", Abschnitt "Fragen und Kontakt"). Impressum und Datenschutz verlinken auf daniel-alisch.site (beide erreichbar, die Datenschutzerklärung hat einen eigenen Abschnitt "KI-Labor"). Direkt im Labor stehen keine E-Mail und kein Name der verantwortlichen Stelle, "/impressum" im Labor selbst liefert 404. Für eine Entscheiderin zumutbar, aber ein Klick weg vom Labor.
5. **Pfadzeit stimmt nicht ganz** (Startseite, Pfad "In 15 Minuten", Screenshot 02). "Zusammen: ca. 4 Min Lesen, plus Video 4:00, plus Labor ca. 9 Min" sind 17 Minuten, nicht 15. Ohne Labor sind es 8 Minuten.
6. **Hakenstand der Checkliste geht beim Neuladen verloren** (Seite /betrieb-entscheidung). Gesagt wird das ("Die Haken werden nicht gespeichert"), aber 3 gesetzte Haken waren nach dem Neuladen weg. Ehrlich, doch für ein Abhaken-Blatt unpraktisch.

### Klein
1. Willkommens-Fenster und Seiten duzen durchgehend ("Dann zeige ich dir ..."); für Geschäftsleute ab 50 ungewohnt, aber konsistent. Nur zu wissen, kein Fehler.
2. Seite /ki-einfuehrung, Abschnitt "Den Einsatz auswählen": "Das ist der leichte Karton." Unverständliche Redewendung, Satz kürzen oder streichen.
3. Auf Lektionsseiten (z. B. /betrieb-entscheidung, Screenshot 05) füllen Kopfleiste, Icon, Titel und Lernziele die ersten 600 px bei 768 px Höhe; der erste Inhalt erscheint erst nach dem Scrollen.
4. Überall "Mehr dazu" in jedem Abschnitt (auf /sicherheit-einfach 7 Stück); Kurz lesen: 399 Wörter, Genau lesen: 1499 Wörter auf derselben Seite. Das ist gut, nur auf der Suche nach einer Ja/Nein-Antwort braucht man mehrere Klicks.
5. Seite /ueber: interne Links laufen noch in der alten Form "#/hardware", werden aber korrekt umgeleitet.

## Zielaufgaben

1. **In 15 Minuten, was KI im Büro bringt:** Rolle wählen (1 Klick, 3,4 s inklusive Seitenaufbau), "Mit Schritt 1 starten" und dreimal "Nächste Seite" = 5 Klicks bis zum Ende. Gelesen werden 4 Seiten mit je 1 Minute Lesen plus Videos. Schritt 1 (/karte), 3 (/business) und 4 (/ki-einfuehrung) funktionieren und beantworten die Frage ("Gute Einsatzfelder: klare Aufgaben, genug Daten, ein Mensch prüft"). Schritt 2 (Chat) scheiterte (siehe hoch 1). Ein Büro-spezifischer Fall (Steuerbüro, Belege) fehlt. Teilweise erfüllt.
2. **Darf ich Mandantendaten eingeben?:** Suchfeld, "Datenschutz" tippen, "Ist das sicher?" anklicken = 3 Klicks, rund 10 Sekunden. Die Antwort "Nein, nur erfundene Beispiele" steht dort sofort (Screenshot 23). Die Suche nach "Mandantendaten" findet nichts (Screenshot 09). Für das Labor beantwortet, für den eigenen Kanzleibetrieb (Berufsgeheimnis, Auftragsverarbeitung) nicht. Teilweise erfüllt.
3. **Entscheidungshilfe zum Abhaken:** Menü "Für dich", "Deine Entscheidung" = 1 Klick, 3 s. Sechs Fragen, Haken lassen sich setzen, Zähler "3 von 6 Fragen geklärt", Ergebnis Starten/Nachbessern/Lassen (Screenshot 12). Druck siehe mittel 1. Erfüllt.

## Empfehlung in zwei Sätzen
Der Betriebspfad ist für Entscheider klar und ehrlich aufgebaut und sollte so bleiben; vor einer Empfehlung an Berufsgeheimnisträger fehlen aber eine Antwort auf "Was darf mein Büro mit Mandantendaten?" und ein verlässlich antwortender Chat. Die Druckansicht der Checkliste und die Pfadzeit sind schnelle Korrekturen.

## Die drei größten Lücken Richtung 10
1. Chat zuverlässig machen: bei Ausfall nicht in einer Sackgasse enden, sondern eine vorbereitete Beispielantwort zeigen; Statusanzeige ("0 Prozent ausgelastet") mit der tatsächlichen Lage abgleichen.
2. Eine Seite oder ein Abschnitt "Mandantendaten und KI im Betrieb": Berufsgeheimnis, Auftragsverarbeitung, lokal oder Cloud, was erlaubt ist; in Suche (Mandanten, Kanzlei, Schweigepflicht) und Rollenmenü auffindbar.
3. Ein Büro-Beispiel mit Belegen oder Mandantenpost, und eine druckfertige Checkliste (A4 auf einer Seite, ohne Bedienelemente, möglichst mit gespeicherten Haken).
