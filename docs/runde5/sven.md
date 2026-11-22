# Prüfbericht Runde 5: Sven (33, Paketfahrer, Handy 390x844, 15 Minuten Pause)

Geprüft am 23.11.2026 gegen https://192.168.178.83:8443, Chromium headless, Viewport 390x844 (hell und dunkel). Screenshots in /tmp/r5-sven/ (28 Stück, alle angesehen). Eine echte Sprachmodell-Anfrage, ein simulierter Ausfall (Anfrage abgebrochen), keine Code-Änderung.

## Gesamtnote: 8,0 von 10

Das Labor ist für eine Pause auf dem Handy erstaunlich gut gebaut. Der Weg "In 15 Minuten" ist ein echter Pfad, jede Seite ist eine Minute lang, die Texte sind kurz und konkret, nichts läuft horizontal über. Abzüge gibt es dort, wo der Pausen-Nutzer anpacken will: Der Weg vom Lesen zum Chat ist im Kurz-Modus versteckt, der Chat liefert 65 Sekunden lang einen Textberg, und die Beispiel-Fragen lassen sich nicht direkt ausprobieren.

## Raster

| Kriterium | Note | Beleg |
|---|---|---|
| 1 Verständlichkeit | 9 | Kurzsätze, keine Fachwörter, "Wer, Was, Wie" als Merkformel (09-pfad-4) |
| 2 Einstieg und Führung | 8,5 | Willkommen-Fenster, danach "Empfohlen für dich" mit Karte "In 15 Minuten" ganz oben (02) |
| 3 Lernwirkung | 8 | Drei "Das nimmst du mit"-Punkte je Seite; Prüfhaltung wird vermittelt, aber nicht geübt |
| 4 Motivation | 7,5 | Saubere Grafiken, aber keine Erfolgserlebnisse im Pfad, kein "Geschafft" am Ende von Schritt 5 |
| 5 Labore und Interaktion | 7 | Chat funktioniert (6,4 Tokens/s), aber 407 Tokens Antwort auf dem Handy, kein Wiederholen-Knopf bei Ausfall |
| 6 Videos | 8,5 | "Was ist KI?" 1:23, Untertitel-Schalter, Kapitelliste, Poster (27); nicht im 15-Minuten-Pfad |
| 7 Navigation | 8 | Menü für Rolle kurz und klar (10), Suche gut, aber Tastatursteuerung der Treffer fehlt (siehe mittel) |
| 8 Vertrauen und Sicherheit | 8,5 | Hinweis "Antwort eines KI-Modells. Sie kann falsch sein" direkt am Chat; Kurzfassung "Ist das sicher?" im Pfad (09-pfad-5) |
| 9 Barrierefreiheit | 8 | Alle Touch-Ziele mindestens 44 px, Schrift mindestens 14 px, kein Überlauf auf neun geprüften Seiten; Dunkelmodus gut lesbar (22, 23) |
| 10 Fehlerfälle | 7,5 | Ausfall-Text freundlich, 404 hilfreich mit Vorschlägen (24); aber Statuschip widerspricht und kein Knopf zum Wiederholen |

## Zielaufgaben

**1. Das Wichtigste in 15 Minuten lernen: gelöst.** Willkommen-Fenster, "Ich will KI verstehen" (1 Klick), "Öffnen" bei "In 15 Minuten: das Wichtigste" (2. Klick), danach viermal "Nächste Seite im Pfad" (Klicks 3 bis 6). Fünf Seiten: KI, Chat prüfen, Betrug, besser fragen, Datenschutz. Seitenwechsel je etwa 1,2 Sekunden. Gesamttext 212 bis 411 Wörter je Seite, geschätzt 5 bis 8 Minuten Lesezeit, also bequem in der Pause. Offizielle Angabe "ca. 1 Min Lesen" je Seite ist knapp (im Genau-Modus 2 Minuten).

**2. Chat etwas aus dem Alltag fragen und Antwort prüfen: gelöst, mit Reibung.** Frage: "Wie lange darf ich als Paketfahrer am Stück fahren, bis ich Pause machen muss?" Erstes Token nach 1,7 Sekunden, Antwort fertig nach 64 Sekunden (407 Tokens, 6,4 Tokens/s). Wartehinweis gut: "Der Jetson rechnet seit 1 s ... Mit Stopp kannst du abbrechen", danach Live-Text mit Stopp-Knopf, am Ende Tempoanzeige und "Stimmt das? Prüfe es: Quellen prüfen" (16-chat-ende).
Faktenprüfung der Antwort: Sie ist falsch bzw. erfunden. Das Modell nennt "Deutsche Gesellschaft für Arbeitsmedizin" mit Pausenstaffel (4/6/8 Stunden) und einen "Verband der Privatwagenfahrer (VPW)", behauptet es gebe keine gesetzliche Obergrenze. Tatsächlich gilt für Fahrzeuge über 3,5 t die EU-Verordnung 561/2006 (nach 4,5 Stunden Lenkzeit 45 Minuten Pause), für Transporter bis 3,5 t greifen dagegen nur Arbeitszeitgesetz und Ruhepausen (30 Minuten nach sechs Stunden Arbeit). Bei einem ersten, abgebrochenen Versuch nannte das Modell sogar das "Drogengesetz" als Quelle. Das Labor zeigt damit ungewollt sehr gut, warum man prüfen muss; die Prüfhilfe danach ist aber nur ein Link, keine Anleitung in zwei Sätzen.

**3. Bessere Fragen stellen: gelöst.** Über den Pfad Schritt 4 "Gute Fragen an die KI: die Alltagskarte" (Wer, Was, Wie, drei Beispiele, Prüf-Satz). Über die Suche "besser fragen": mit gewählter Rolle 3 Treffer vorn, ohne Rolle stehen "Für die Schule"-Seiten vor dem Alltags-Material (19, 19b). Zeit: etwa 2 Sekunden bis zur Trefferliste, 3 Klicks.

## Befunde

### Blocker
Keine.

### Hoch
1. **Weg zum Chat im Kurz-Modus versteckt.** Seite "Einen Chatbot nutzen und die Antwort prüfen" (alltag-chat), Abschnitt "Eine Frage stellen": Der Satz sagt "Öffne den Chat", der Link "Chat" steht aber nur im aufgeklappten "Mehr dazu" bzw. im Genau-Modus (12d, 12c). Auf der Kurz-Ansicht gibt es keinen Knopf "Chat öffnen". Ein Pausen-Nutzer sucht den Chat dann über das Menü. Der Pfad führt ausgerechnet auf dieser Seite nicht dorthin, wo er gerade "Öffne den Chat" sagt.
2. **Beispiel-Prompts lassen sich nicht ausprobieren.** Seite prompts-alltag, Abschnitt "Drei Beispiele zum Kopieren" (22, 23): kein Kopier-Knopf, kein "Im Chat ausprobieren" mit vorbefülltem Text. Der Praxisschritt "probiere es" kostet auf dem Handy mühsames Markieren. Verzahnung fehlt.
3. **Chat liefert einen Textberg.** Seite chat: 407 Tokens, 64 Sekunden Wartezeit, auf dem Handy drei bis vier Bildschirme (16-chat-ende). Für die 15-Minuten-Pause ist das zu lang. Der Hinweis "Kürzere Antworten ... machen das Modell berechenbarer" steht erst nach der Antwort. Ein Schalter "Kurz antworten" oder die Beispielfrage "in drei Sätzen" fehlt.

### Mittel
4. **Statuschip passt nicht zum Ausfall.** Chat bei Ausfall (17): Chip "Modell im Speicher, aber gerade viel los", die Meldung darunter sagt "Der Jetson antwortet gerade nicht". Das widerspricht sich. Außerdem fehlt ein "Noch einmal versuchen"-Knopf, der Text steht nur als Blase.
5. **Wartehinweis überschätzt.** "Das erste Wort kann bis zu einer Minute dauern" (15-chat-sendet), real kam das erste Token nach 1,7 Sekunden. Das Warten bis zum Ende (64 Sekunden) wird dagegen nicht angekündigt, dort steht nur "Bisher 1 s". Keine Schätzung der Restzeit.
6. **Leere Eingabe ohne Text.** Chat, "Senden" bei leerem Feld (18): nur orange Rahmen, keine Meldung für den Nutzer, Screenreader erfährt nichts.
7. **Suchtreffer per Tastatur nicht bedienbar.** Startseite, Suche "besser fragen": Pfeil nach unten und Enter öffnen keinen Treffer, Tab springt auf die Gruppenüberschrift "Für die Schule". Ohne Rolle stehen Schul-Seiten vor dem Alltag-Material (19).
8. **Fortschritt irreführend.** Mit "Fortschritt merken: an" steht nach zwei gelesenen Seiten "Noch nichts gelesen (98 Seiten)" (26). Die Karte "Weiter, wo du aufgehört hast" funktioniert, aber der Balken bleibt leer. Der Pfad "Schritt 2 von 5" wird dort nicht angezeigt. Die Fortschritts-Einstellung selbst sitzt als kleiner Link ganz unten im Fuß der Seite (03b).
9. **Doppelte Wege-Links.** Auf Pfadseiten stehen unter "Weiter geht es" derselbe Folgeschritt zweimal (Seite alltag-ki-kurz, Link "Einen Chatbot nutzen ..." mit /alltag-chat?pfad=... und #/alltag-chat, jeweils sichtbar im Linktext). Inhaltlich doppelt, verwirrt kurz.
10. **Doppelter Satz.** prompts-alltag, "Dann prüfen": Der Satz "Sag mir am Ende, was du nicht sicher weißt ..." steht direkt hintereinander zweimal (23).

### Klein
11. "Zurück" und der Umschalter "Kurz lesen / Genau lesen" liegen auf dem Handy dicht nebeneinander und wirken wie ein Block (04, 08). Auf Pfadseiten heißt der Zurück-Knopf "Zurück", auf Laborseiten "Zur Startseite": nicht einheitlich.
12. Schaltfläche "Fortschritt löschen" (26) mit hartem Rahmen, optisch aus der Reihe der anderen Knöpfe.
13. Leere Kästen im Vollseiten-Screenshot (04): Grafikblöcke laden erst beim Scrollen (Lazy), im echten Gebrauch korrekt (05); kein Fehler, aber Druckvorschau (druck-1) zeigt sie mit gleichem Inhalt.
14. Druck: Kurz-Seite wird mit allen "Mehr dazu"-Texten ausgedruckt, Seite 1 gut lesbar (druck-1); für Sven irrelevant.
15. Video-Titelbild: Schriftzug im Video bei 390 Pixel Breite sehr klein (27).
16. Erster Besuch ohne Rolle: auf der Startseite stehen Willkommen-Fenster und Rollenauswahl doppelt (Karten dahinter und Fenster); Playwright-Klick traf zuerst die verdeckten Karten. Für Menschen unkritisch, aber eine doppelte Entscheidung.

## Was gut ist (zum Halten)
- Pfad "In 15 Minuten" mit fünf einminütigen Seiten, klare Reihenfolge "Schritt n von 5".
- Willkommen-Fenster auf dem Handy sauber, Esc schließt es, "Später entscheiden" vorhanden (01, 25).
- 404-Seite mit Vorschlägen (Chat, Datenschutz, Hausaufgaben ...) in Hell und Dunkel (24).
- Dauerhafter KI-Warnhinweis am Chat und "Stimmt das?"-Verlinkung auf "Quellen prüfen".
- Keine Konsolenfehler außer dem erwarteten 404, kein horizontaler Überlauf, Touch-Ziele alle mindestens 44 px.
- Suche versteht Alltagswörter ("Chat", "besser fragen").

## Empfehlung
Für Menschen in einer kurzen Pause ist das Labor schon sehr gut nutzbar; den Pfad würde Sven weiterempfehlen. Vor Note 8,5 sollten der Chat-Knopf im Kurz-Modus, Kopier- und Ausprobier-Knöpfe an den Beispiel-Fragen und eine kürzere Chat-Antwort (mit ehrlicher Wartezeit-Schätzung und Wiederholen-Knopf) ergänzt werden.

## Die drei größten Lücken Richtung 10
1. **Vom Lesen direkt zum Tun:** "Chat öffnen"-Knopf auf der Chat-Seite im Kurz-Modus und "Im Chat ausprobieren"/"Kopieren" an jedem Beispiel-Prompt, mit vorbefülltem Text.
2. **Chat für die Pause:** Schalter "Kurz antworten" (drei Sätze), Wartehinweis mit realistischer Schätzung (Erstes Token Sekunden, Antwort bis zu einer Minute), Ausfall-Karte mit "Noch einmal versuchen" und passendem Statuschip.
3. **Prüfen üben statt nur empfehlen:** Nach der Chat-Antwort zwei konkrete Prüfschritte mit Beispielsuche (hier: "Lenkzeiten 561/2006"), plus ein Erfolgsmoment am Ende des 15-Minuten-Pfads ("Geschafft, das hast du jetzt") und korrekter Fortschrittsbalken.
