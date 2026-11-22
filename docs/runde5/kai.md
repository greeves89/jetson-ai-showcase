# Prüfrunde 5: Kai (42, Vater von 12 und 15, Laptop 1440x900)

Geprüft am 23.11.2026 gegen https://192.168.178.83:8443, ein headless Chromium im Viewport 1440x900 (hell, Dunkel für zwei Seiten), echter Erstbesuch mit Willkommens-Fenster und Rolle "Ich bin Elternteil", danach die Lernseiten ohne Rolle über Direktadresse. 50 Bilddateien in /tmp/r5-kai/ (Screenshots, PDF-Seiten, Druckansichten), die Bildschirmfotos alle mit dem Read-Werkzeug angesehen. Vier Sprachmodell-Anfragen im Chat, jeweils mit Pause von mindestens 10 Sekunden, davon zwei abgebrochen, weil mein Skript zu früh weiterlief (Ergebnis nicht gewertet).

## Gesamtnote: 8,1 von 10 (Ziel 8,5 verfehlt)

| Kriterium | Note | Beleg in einem Satz |
|---|---|---|
| 1 Verständlichkeit für das Alter (hier: Eltern) | 8,5 | Kurze Sätze, klare Merkkästen; Seiten zu Hausaufgaben und Quellen sprechen das Kind an, nicht mich |
| 2 Einstieg und Führung | 8,5 | Willkommens-Fenster, ein Klick auf "Elternteil", Menü "Für dich" mit beiden Themen; "Empfohlen für dich" zeigt aber andere drei Seiten |
| 3 Lernwirkung | 7,5 | Quellenprüfung gut erklärt; das Prüf-Beispiel im Chat endet ohne richtige Antwort, ich lerne nicht, wie ein echter Beleg aussieht |
| 4 Motivation und Spaß | 8,5 | Echt-oder-KI-Spiel ist flott, Auflösung mit Begründung und Bildquelle je Karte, Ergebnis "6 von 12" mit Einordnung |
| 5 Labore und Interaktion | 8 | Chat antwortet nach 1,6 s, Live-Balken und Tempoanzeige gut; Tasten 1 und 2 wirken nur mit Fokus im Spiel |
| 6 Videos | 8 | Kapitelliste, Untertitel-Schalter, Dauer in der Kopfzeile, Hinweis auf den Verweis am Ende; Video nicht ganz angesehen, nur Anfang und Bedienung geprüft |
| 7 Navigation und Orientierung | 8,5 | Suche findet "Hausaufgabe", "Antworten prüfen", "falsch" sofort mit Kurztext; Zurück-Beschriftung wechselt |
| 8 Vertrauen und Sicherheit | 7,5 | Ehrlich und sachlich, aber die Chat-Seite trägt keinen Altershinweis, und die Prüfkarte nennt keine Gegenquelle |
| 9 Barrierefreiheit und Bedienbarkeit | 8,5 | Überspringen-Link, Fokusrahmen 3 px solid auf allen Tab-Stationen, Dunkelmodus sauber, Quiz per Pfeiltasten |
| 10 Fehlerfälle | 8 | 404 freundlich mit Suchwörtern; Offline im Chat zeigt eine Meldung, aber mit falscher Schuldzuweisung und ohne Wiederholen-Knopf |

Weiterempfehlen: Ja, an andere Eltern, mit der Einschränkung "nehmt für das Spiel zu Hause das Kartenset aus Zusammen ausprobieren, nicht das auf der Spielseite". Die Seiten sind ehrlich ("keine sichere Erkennung", "Quelle, nicht Chatbot") und das Spiel funktioniert. Was fehlt, ist die letzte Meile für Eltern: ein gelöstes Prüfbeispiel, ein passendes druckbares Kartenset an der richtigen Stelle und eine Hausaufgaben-Regel für zu Hause.

## Zielaufgaben

1. Wie man KI-Antworten prüft. Gelöst, mit Lücke. Weg: Willkommens-Fenster, "Ich bin Elternteil" (Klick 1, Seite nach 1,6 s), Menü "Quellen prüfen" (Klick 2, 0,1 s): Video 2:29, Seitwärtslesen, Gegenprobe, vier Züge, Merkkasten, vier Quizfragen. Danach im Chat getestet: Frage "Zugspitze" nach 1,6 s erstes Wort, 6,1 s gesamt, Antwort stimmt (2.962 m, Bayern). Dann das Beispiel "Wie lange darf ein Busfahrer am Stück fahren? (Antwort prüfen)": erstes Wort nach 1,9 bis 2,3 s, Antwort nach 76 s komplett (142 Tokens, 2,9 Tokens pro Sekunde, Rechner war ausgelastet). Das Modell behauptete "In Deutschland ist es keine feste Zeit", die "Bundesvereinigung der Deutschen Verkehrsunternehmen (BDV)" empfehle eine Pause "nach etwa 5 bis 6 Stunden", dann "15 bis 30 Minuten". Das passt nicht zu der EU-Regel, die ich kenne (4,5 Stunden Lenkzeit, dann 45 Minuten Pause); die genannte Organisation konnte ich nicht belegen. Genau so ein Fall ist das Lehrbeispiel, aber siehe Befund H1: die Seite löst es nicht auf.
2. Regeln für KI bei den Hausaufgaben. Teilweise gelöst. Weg: Menü "KI und Hausaufgaben" (1 Klick, 0,05 s). Video 2:12, Abschnitte "Eine Frage, die fast alles klärt", "Wann es zum Problem wird" (Tabelle), "KI-Hilfe angeben", "Fragen an deine Lehrkraft", ein Abschnitt "Für Eltern: nachfragen statt kontrollieren" (Vereinbaren, Nachfragen, Angeben), vier Quizfragen. Brauchbar, aber an das Kind gerichtet und ohne etwas, das ich mit meinen Kindern unterschreiben oder aufhängen kann. Siehe H3.
3. "Echt oder KI?" mit Kindern spielen. Gelöst. Weg: Menü "Echt oder KI?" (1 Klick), Spiel liegt auf der Seite. Alle 12 Karten per Klick in 7 Sekunden Maschinenzeit (Skript, Mensch eher 3 bis 5 Minuten). Ergebnis in meinem Lauf: 6 von 12, mit der Aufteilung "Echte Fotos 3 von 6, KI-Bilder 3 von 6" und dem Satz "Etwa so viel wie Raten, und das ist normal". Reihenfolge ist zufällig (drei Ladungen, drei verschiedene erste Karten). Gemeinsam spielen: nur ein Hinweis in kleiner Schrift ("Mit Freunden spielen: zählt, wer mehr richtig hat"), kein Zähler für zwei. Das Download-Set auf dieser Seite ist das Schulset (siehe H2).

## Befunde

### Blocker
Keine.

### Hoch
- H1. Prüfbeispiel im Chat ohne Auflösung. Seite /chat, Beispielknopf "Wie lange darf ein Busfahrer ... (Antwort prüfen)" und Karte "Stimmt das? Prüfe es: Quellen prüfen. Woran würdest du merken, dass das falsch ist?" (Screenshot 14). Das Modell lieferte eine falsche, selbstsichere Antwort mit erfundener Quelle. Die Karte stellt nur eine Frage und verlinkt die allgemeine Seite. Eine Volltextsuche in den Inhaltsdateien nach "4,5 Stunden" findet nichts; auch Alltag-Chat und Quellen prüfen nennen die richtige Antwort nicht. Ein Elternteil sieht nicht, wie ein echtes Gegenprüfen aussieht. Vorschlag: unter dem Beispiel (oder in "Chat nutzen und prüfen") einen kurzen Fall "So prüfst du es": Aussage notieren, Behörde oder Gesetz suchen, Ergebnis vergleichen, mit dem richtigen Wert und Link.
- H2. Falsches Kartenset auf der Spielseite. Seite /echt-oder-ki, Abschnitt "Zum Ausdrucken" (Screenshot 08c). Der Link zeigt auch mit ?weg=eltern auf bildkarten-echt-oder-ki.pdf. Das PDF (2 Seiten A4, 12 Karten) sagt "Medien-Einheit 1 ... je Gruppe ein Set austeilen. Die Auflösung steht nur im Lösungsblatt der Lehrkraft." (Bildkarten 1 bis 6 siehe bk-1.png). Ein Elternteil kann damit zu Hause nicht auswerten. Das passende Set mit Auflösung (kartenset-eltern.pdf, 4 Seiten) liegt versteckt auf Zusammen ausprobieren. Vorschlag: bei Rolle oder weg=eltern auf das Elternset verlinken, im Schulset Hinweis auf das Elternset.
- H3. Hausaufgaben-Regeln nicht für zu Hause nutzbar. Seite /ki-hausaufgaben-fair (Screenshots 06, 21). Alles ist in Du-Form an die Schülerin oder den Schüler geschrieben; der Elternteil bekommt drei Stichwörter ("Vereinbaren, Nachfragen, Angeben") ohne Beispielregeln. Es gibt kein druckbares Blatt (Materialien-Liste: nur Arbeitsblätter und Lösungen für die Schule, nichts wie "Hausaufgaben-Vereinbarung"). Antwort auf "Darf ich das Labor für Hausaufgaben nutzen?" ist "Frag deine Schule", der Elternabend-Leitfaden sagt "kein Werkzeug für Hausaufgaben". Zwölf- und Fünfzehnjährige brauchen unterschiedliche Regeln, das fehlt.

### Mittel
- M1. Tastatur im Spiel. Seite /echt-oder-ki, Zeile "Tastatur: 1 für Echt, 2 für KI" (Screenshot 08). Ohne Fokus in der Spielkarte tut die Taste 1 nichts; erst nach Fokus auf einen Knopf wirkt sie (getestet). Der Hinweis klingt, als gälte er auf der ganzen Seite.
- M2. Druckansicht übernimmt Bedienelemente. /echt-oder-ki gedruckt (6 Seiten, druck-eok.png): die Spielkarte mit den Knöpfen "Echt" und "KI" steht auf Seite 1, "Herunterladen" erscheint ohne Link, Quizfragen mit Auswahlkreisen auf zwei Seiten. /ki-hausaufgaben-fair gedruckt (6 Seiten, druck-hausaufgaben.png): Regler "Ich lerne damit ... Ich gebe nur ab" und Tabelle sind leer bis klein, Quiz mit Kreisen, Seite 6 fast leer. Ein Elternteil druckt eher die Merksätze; Quiz und Spielkarte sollten im Druck fehlen.
- M3. Du und Sie gemischt. Elternstartseite siezt ("Ihrer Kinder", "erkennen Sie"), Hinweiskasten "Du liest gerade kurz: Du siehst die Kernsätze ..." und die Seiten Quellen prüfen und Hausaufgaben duzen. Für Eltern wirkt das unaufgeräumt (wie Christina, Runde 5).
- M4. Offline-Meldung im Chat. Seite /chat, Browser ohne Netz (Screenshot 20): "Der Jetson antwortet gerade nicht. Vielleicht startet er einen Dienst neu. Warte einige Sekunden und versuche es noch einmal." Der Fehler liegt aber bei mir; es gibt keinen Knopf "Nochmal senden". Die Statuszeile unten links wechselt immerhin auf "nicht erreichbar" in Rot.
- M5. Chat-Seite ohne Altershinweis. Seite /chat enthält die Wörter "Kinder", "16" oder "Eltern" nicht; nur "Antwort eines KI-Modells. Sie kann falsch sein". Wer als Kind direkt hier landet, liest die Altersempfehlung nicht (auf Elternseiten und im Willkommens-Fenster steht sie).
- M6. Chat-Seite Kurzmodus, "Chat nutzen und prüfen" (Screenshot 09): Der Satz "Öffne den Chat, tippe eine Alltagsfrage" ist reiner Text. Ein Link "Chat" steckt im Aufklapptext; als Knopf fehlt er. Wer in 15 Minuten den Chat will, muss über Menü gehen.
- M7. Abstände. Auf Videoseiten (Quellen prüfen, 05) sitzt der Info-Kasten "Du liest gerade kurz" ohne Lücke direkt unter der Videokarte, Ränder berühren sich. Auf /echt-oder-ki (08c) klebt die Überschrift "Zum Ausdrucken" 13 px unter der Spielkarte, sonst sind Abstände 40 px und mehr.

### Klein
- Spielkarte (Screenshot 08, 08b): Beim Auflösen springt das Bild um 36 px nach oben (Kopfzeile verschwindet), "Weiter" liegt bei 900 px Höhe am unteren Rand, der Fokusring wird angeschnitten (Screenshot 17).
- Chat (Screenshot 12): Das Eingabefeld rutscht nach unten, sobald die Antwort wächst (Zeile y=437 auf y=563); Seite scrollt beim Senden selbst, sodass der Kopf aus dem Bild geht.
- Chat-Karte (Screenshot 11): leere Fläche über dem Einleitungssatz, etwa 80 px.
- Zurück-Beschriftung wechselt: "Zurück" auf Quellen prüfen und Hausaufgaben, "Zur Startseite" auf Chat, Alltag-Chat und Echt oder KI.
- Suche "Spiel" findet "Echt oder KI?" nicht unter den ersten sechs Treffern (Experimente, Maschinelles Lernen, Robotik ...).
- Elternstart "Empfohlen für dich": Eltern zu Hause, Falscher Anruf, Zusammen ausprobieren; Quellen prüfen und KI und Hausaufgaben (meine Themen) nur im Menü.

## Was gut ist
- Erstbesuch lädt in 2 s, Willkommens-Fenster mit sechs Rollen, "Nichts wird gesendet", Lernfortschritt per Schalter, aus. Keine Konsolenfehler, keine fehlgeschlagenen Anfragen in allen Läufen.
- Spiel: zwölf Karten, jede mit Auflösung, Merkmal und Bildlizenz; ehrlicher Abschluss ohne Ranking; "Dein Ergebnis bleibt in diesem Fenster".
- Fokus: Überspringen-Link, 3 px solide Rahmen auf den ersten acht Tab-Stationen; Dunkelmodus kontrastreich (Screenshots 17, 21), Videoleiste mit Kapiteln und Untertiteln.
- Suche im Menü mit Kurzbeschreibung je Treffer, 404-Seite mit Suchwörtern, Chat-Fehler ohne Stacktrace, Quellen mit Datum ("geprüft am 22.11.2026").
- Druck-PDF Schulset: Karten scharf, geschnitten bar, Arial eingebettet.

## Empfehlung
Das Labor ist für Eltern bereits gut nutzbar, braucht aber für meine drei Aufgaben je eine Nachbesserung: ein gelöstes Prüfbeispiel, das richtige Kartenset an der Spielseite und eine Hausaufgaben-Regel zum Mitnehmen. Danach die Du/Sie-Anrede und die Druckansicht vereinheitlichen, dann ist 8,5 erreichbar.

## Die drei größten Lücken Richtung 10
1. Ein vollständig gelöster Prüffall im Chat (Aussage, Quelle, richtiger Wert, Link) statt nur der Frage "Woran würdest du merken ...?" (H1), am besten mit dem Busfahrer-Beispiel, das heute offen bleibt.
2. Elternset und Spiel zusammenführen: Rolle Eltern verlinkt das Kartenset mit Auflösung, Spiel zeigt einen Zwei-Personen-Punktestand, Druck ohne Duplex-Falle (H2, M1).
3. Eine druckbare "KI und Hausaufgaben bei uns zu Hause"-Vereinbarung mit Beispielen für 12 und 15 Jahre in Sie-Form, plus ein Altershinweis auf der Chat-Seite (H3, M5, M3).
