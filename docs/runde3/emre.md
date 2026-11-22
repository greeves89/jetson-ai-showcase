# Prüfrunde 3: Emre (14, Klasse 9 Realschule, Tablet 820x1180)

Beobachtet am 22.11.2026 gegen https://192.168.178.83:8443, Chrome headless über tests/browser.mjs, Rolle "Schüler:in" über das Willkommens-Fenster. Screenshots in /tmp/r3-emre/ (24 Dateien, Namen unten bei den Befunden). Es gab genau eine Sprachmodell-Anfrage (Chat), danach mehr als 10 Sekunden Pause. "Zu viele Anfragen" trat nicht auf. Zeiten für Menschen sind Schätzungen, gemessen sind Ladezeiten und Skriptläufe.

## 1. Gesamtnote: 7,0 von 10 (Vorrunde 5,5)

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit fürs Alter | 7 | Startseite Schüler: kurze Sätze ("Probiere aus, wie KI arbeitet"). Lektion "Maschinelles Lernen" im Kurzmodus nur 464 Wörter (vorher 901 bei Training). Quiz-Erklärungen gut ("wie beim Darts"). Fachwörter (Inferenz, Validierungsverlust, Lernrate) stehen in /training weiter ohne Erklärung. |
| 2 | Einstieg und Führung | 8 | Rollenwahl führt jetzt zu einer eigenen Schüler-Startseite mit sechs Experimenten und "Empfohlen für dich" (02-start-oben, 03-start-voll). Rollenauswahl nicht mehr doppelt. Klick "Starten" bringt mich in 1 Klick in ein Labor. Abzug: Pfadhinweis am Seitenende ("Pfad Verstehen, Schritt 2 von 9") ist nicht der Schülerpfad. |
| 3 | Lernwirkung | 7 | Punkte-Labor mit Nachbarn-Linien und Entscheidungsfläche erklärt "Ähnlichkeit" sofort (06, 07, 08). "Das nimmst du mit" mit drei Sätzen am Ende. Das Quiz hat keine Wiederholung (siehe Befunde). |
| 4 | Motivation und Spaß | 6 | Sofortige Rückmeldung, schöne Farbflächen. Immer noch kein Ziel, keine Punkte, kein "Schaffst du es". Der Chat ist bei mir nicht angesprungen. Für einen Gamer weiter zu brav, aber der Einstieg ist deutlich schneller. |
| 5 | Labore und Interaktion | 7 | Punkte-Labor flüssig, Beispieldaten ein Klick. Objekterkennung: Kamera-Ansicht mit klaren Platzhaltern (22). Chat: wegen fehlendem Speicher nicht benutzbar, siehe Befund Hoch 1. Leerzustand im Spielfeld erklärt jetzt, was zu tun ist ("Wähle eine Farbe und klicke ins Feld, oder lade die Beispieldaten"). |
| 6 | Videos | 7 | Video direkt über dem Labor, 1:29, Untertitel an (de, showing), Kapitelliste. Ende weiterhin schwarz ohne Einblendung (23-video-ende). Verweiszeile "meint diese Seite" unverändert, 12 Pixel groß. Video-Bild im Hochformat-Ausschnitt: Beschriftung unten wird von den Bedienelementen verdeckt (04-punkte-oben). |
| 7 | Navigation und Orientierung | 8 | Menü ist nach Rolle sortiert: "Für dich" mit 6 Punkten, "Alle Bereiche" zugeklappt (10b, 10c). Suche mit Gruppen, "Quiz" liefert 5 Seiten, "wie lernt eine KI" führt zu "KI 2: Wie lernt ein Computer?", "Fortnite" zeigt "Dazu habe ich nichts gefunden" plus Vorschläge. Abzug: kein Auszug zum Treffer, keine eigenen Punkte "Videos" oder "Quiz". |
| 8 | Vertrauen und Sicherheit | 7 | Willkommens-Fenster mit "Nichts wird gesendet". Startseite zeigt "Ab wann? ab 16 Jahren, kein Alterscheck" offen. Nach wie vor kein echter Alterscheck, für mich ein Satz wie jeder andere. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Tab durch das Willkommens-Fenster in sinnvoller Reihenfolge, Esc schließt. Hell und Dunkel gut lesbar (20, 21, 16, 22). Quiz markiert richtig und falsch nur mit Farbe (rot/grün), kein Häkchen oder Kreuz (13). Video-Kleintext 12 Pixel. |
| 10 | Fehlerfälle | 8 | Chat-Ausfall jetzt als eigene Karte mit Sanduhr-Symbol, klarem Text und Knopf "Noch einmal versuchen" (18-chat-antwort). Suche ohne Treffer mit Vorschlägen. Abzug: Der Fehler tritt auf, obwohl der Rechner auf der Startseite "bereit und frei, 0 Prozent" meldet. |

Gesamtnote als ehrlicher Eindruck, nicht Mittelwert: **7,0**.

## 2. Vergleich zur Vorrunde

Besser:
- Willkommens-Fenster schließt sauber, Rolle wirkt: eigene Schüler-Startseite ("Experimente, leicht erklärt"), Experimente mit Zeitangabe und Label "Ohne Kamera". Vorher: Rolle doppelt, "Neu hier" mit Lehrer- und Betriebstexten.
- Menü nach Rolle, "Für dich" kurz, "Alle Bereiche" zu.
- Startseite von 1123 Wörtern auf 405 (2168 Pixel statt 10.735).
- Suche: Treffer nach Gruppen, "Quiz" findet 5 statt 2 Seiten, "wie lernt eine KI" bringt die passende Unterrichtsseite nach oben, leere Suche mit Vorschlägen.
- Chat-Fehlermeldung freundlich, mit Wiederholknopf.
- Lektion im Kurzmodus deutlich kürzer.

Gleich:
- Video endet schwarz, ohne Weiterführung. Verweiszeile unverändert.
- Quiz am Seitenende (/training: Quiz bei 6878 von 9198 Pixel), kein Sprungknopf, keine Wiederholung, nur "0 von 5 richtig." ohne weiteren Satz.
- Kein Spiel mit Ziel.
- Altersgrenze ohne Prüfung.

Schlechter:
- Nichts Sichtbares schlechter. Eine Auffälligkeit: In einem Vollseiten-Screenshot (05-punkte-voll) sind die Diagramme der Abschnitte leer, weil sie erst beim Scrollen nachgeladen werden. Mit echtem Scrollen sind sie da (08, 09), ich werte es als Messartefakt und nenne es unten bei "klein".

## 3. UX- und UI-Befunde nach Schwere

### Blocker
- Keine.

### Hoch
1. **Chat in dieser Prüfung nicht nutzbar.** /chat, Frage "Erkläre in zwei Sätzen, wie eine KI lernt, für einen 14-Jährigen." Nach rund 15 Sekunden Karte "Dem Jetson fehlt gerade freier Speicher ..." (18-chat-antwort). Die Meldung selbst ist gut gelöst, aber das Labor, das Schüler am meisten anspricht, lief nicht. Gestern gleiches Bild, vermutlich Speicherlast durch parallele Prüfer; ich werte es nicht als Seitenfehler, nenne es trotzdem, weil die Startseite zeitgleich "bereit und frei" anzeigt. Eine ehrlichere Statusanzeige ("Sprachmodell nicht geladen") wäre passend.
2. **Quiz schwer zu finden und ohne Wiederholung.** Seite /training, Abschnitt "Teste dich" (12-quiz-start, 14-quiz-ende). Quiz liegt ganz unten, es gibt weder Sprungknopf noch Chip im Seitenkopf auf der Seite selbst (Chip "5 Quizfragen" fehlt dort). Nach der letzten Antwort steht nur "0 von 5 richtig." Kein Neustart, kein Lob, kein Hinweis, was ich wiederholen soll. Das Quiz, das mir im Menü angeboten wird, ist für 14-Jährige im Fachwort-Niveau (Validierungsverlust, Lernrate).
3. **Quiz-Rückmeldung nur über Farbe.** Falsche Antwort rot, richtige grün, ohne Symbol (13-quiz-antwort). Bei Rot-Grün-Schwäche nicht unterscheidbar. Die erste Zeile "Nicht ganz." ist freundlich.

### Mittel
4. **Download-Karten (Arbeitsblatt, Lösungsblatt, Kartenset) schlecht gepackt.** /medien-stunde-1 (15-medien-stunde-1): Der Text steht in einer schmalen Spalte, die Beschreibung bricht auf vier bis fünf Zeilen ("mit / Doppelstunden- / Plan, für dich"), der Knopf nimmt viel Breite. Die dritte Karte steht allein links, rechts leere Fläche. Das Raster ist ungleichmäßig.
5. **"Lösungsblatt, für dich" als Schüler.** Auf der Seite bin ich als Schüler:in gewählt und sehe das Lösungsblatt "für dich" (gemeint: Lehrkraft, steht im PDF-Titel "für Lehrkräfte"). Klingt wie ein Angebot an mich. Beschriftung "für Lehrkräfte" und für Schüler ausblenden oder zuklappen.
6. **PDF-Kopfzeile mit "Lizenz: noch festzulegen"** auf allen drei Seiten des Arbeitsblatts, des Kartensets und des Lösungsblatts (pdf-arbeitsblatt-medien-1-*, m1.png, m2.png). Wirkt unfertig.
7. **PDF Arbeitsblatt: Überschrift "Quiz" steht unten auf Seite 1, die Fragen erst auf Seite 2.** Kartenset: Karte 1 ist abgeschnitten (Aufschrift "CROWL"), Karte 7 ist ein Regal ohne klare Aussage. QR-Code oben rechts und Operatorentabelle sind gut.
8. **Video: Beschriftung im Bild wird von der Steuerleiste verdeckt** (04-punkte-oben). Und das Ende bleibt schwarz (23-video-ende), kein "Weiter zu ...". Die Zeile "Der Verweis am Ende der Folge meint diese Seite" ist umständlich.
9. **Chat-Seite: Beschriftung "Antwort" klebt direkt an den Beispielfragen-Chips** (16-chat-hell, bei 1065 Pixel), und über der Einleitung klafft eine große Leerfläche (Antwortfenster leer). Das wirkt wie ein halbfertiges Layout.
10. **Pfadhinweis passt nicht zur Rolle.** Auf /ml: "Nächste Seite im Pfad: Generative KI, Pfad Verstehen, Schritt 2 von 9", auf /chat: "Pfad Anwenden, Schritt 1 von 9" (09-ml-ende). Für einen Schüler im Schulpfad wäre die nächste Schulseite stimmiger. Auch "Weiter geht es" zeigt "Bildmodell anlernen" (braucht Kamera).
11. **Namen wechseln:** Startkarte "Chat", Menü "Sprachmodell im Chat", Seitentitel "Sprachmodell im Chat"; Karte "Punkte-Labor", Seite "Maschinelles Lernen", Abschnitt "Spielfeld". Ich suche "Punkte-Labor" nicht auf einer Seite namens "Maschinelles Lernen".
12. **Willkommens-Fenster: Kacheln ungleich hoch.** Die Schüler-Kachel ist höher (drei Textzeilen, "Kamera, Mikro und Gesicht ab 16 ...") als ihre Nachbarin (01-willkommen). Fenster ist sonst schön (unscharfer Hintergrund, X-Knopf, "Später").

### Klein
13. Hinweisbox "Du liest gerade kurz ..." ist schmaler als die Karte darüber (08-ml-mitte), leichte Kantenverschiebung.
14. Menü auf dem Tablet ist ein Vollbild-Panel mit schwarzer Leerfläche unter den Punkten (10, 10c). Funktioniert, nutzt aber den Platz nicht.
15. Wenn man ohne Rolle auf "Später" tippt, erscheint oben ein blauer Strich vor der Fußzeile der Startseite (21-start-hell). Zierlinie oder Fehler, wirkt zufällig.
16. Diagramme nur beim Scrollen geladen (05-punkte-voll zeigt leere Kästen). Echte Nutzer sehen das nur bei sehr schnellem Scrollen, ich habe es nicht gemessen.
17. Die Experimente-Karten haben bei "Zeit" zwei Zeilen Kleintext ("ca. 1 Min Lesen, plus Video 1:29, plus Labor ca. 3 Min"), für mich zu viel Rechnerei; ein Symbol mit "5 Min" reicht. Karten selbst sind gleich groß und gut ausgerichtet.
18. Footer 12 bis 13 Pixel Fließtext mit vielen Links, für Kinder unlesbar, aber nicht kritisch.

Positiv (UI): Karten sind gleichmäßig (3 Spalten, gleiche Höhen, gleiche Abstände), Icons einheitlich (lucide), Kontrast in Hell und Dunkel gut, Punkte-Labor bildschirmfüllend mit Touch-Zielen deutlich über 44 Pixel, Tab-Reihenfolge im Willkommens-Fenster richtig, Esc schließt. Keine Konsolenfehler in allen Läufen.

## 4. Zielaufgaben

| Aufgabe | Gelöst? | Weg | Klicks / Zeit |
|---|---|---|---|
| 1. Labor mit Bild oder Spiel starten | Ja | Rolle "Schüler:in" (1), "Starten" bei Punkte-Labor (1), Scroll, "Beispieldaten" (1), Feld antippen (1). Seite lädt in 97 ms (Seitenwechsel im Browser), Video darüber. | 4 Klicks, geschätzt 20 bis 30 Sekunden. Spiel mit Ziel: weiter nein. Bild-Labor ("Bild als Zahlen") nicht erneut geprüft, "Objekte erkennen" ohne Kamera zeigt Leerzustand. |
| 2. Video, wie eine KI lernt | Ja | Dieselbe Seite, Erklärvideo 1:29 direkt über dem Labor, Untertitel an, Kapitel anspringbar. Zweiter Treffer über Suche: "KI 2: Wie lernt ein Computer?". | 0 Zusatzklicks, geschätzt 2 Minuten bis zum Ende. |
| 3. Quiz finden und machen | Ja, mühsam | Suche "Quiz" (2 Aktionen), Treffer "Neuronale Netze" oder "Maschinelles Lernen" haben bei mir nicht sichtbar ein Quiz. Mein Quiz lief auf /training (Menü "Grundlagen"): Seite öffnen, bis 6878 Pixel scrollen, 5 Fragen. | ca. 8 Aktionen plus 7 Bildschirme Scrollen, Quiz selbst 5 Fragen, geschätzt 1 bis 2 Minuten. |

Sprachmodell: nicht gelöst (Speichermangel, Retry-Knopf vorhanden).

## 5. Empfehlung

Ja, mit Vorbehalt: Seit der letzten Runde finde ich als Schüler in 4 Klicks ein Labor mit Video, ohne mich durch Lehrertexte zu quälen. Es fehlt noch der Anreiz zum Dranbleiben (Ziel, Punkte, Wiederholung), und das Sprachmodell muss zuverlässig laufen.

Die drei größten Lücken Richtung 10:
1. **Motivation:** Ziele und Rückmeldung (kleine Aufgaben im Punkte-Labor, "Schaffst du es?", Quiz mit Lob, Wiederholung und Sprungknopf "Zum Quiz" im Seitenkopf, Rückmeldung mit Symbol statt nur Farbe).
2. **Rollenrichtige Führung bis zum Seitenende:** Pfadhinweis, "Weiter geht es" und Lösungsblatt-Beschriftung an die Rolle anpassen, Namen vereinheitlichen (Punkte-Labor, Chat), Videoende mit Weiterführung.
3. **Politur und Verlässlichkeit:** Download-Karten und PDFs (Lizenz-Zeile, Seitenumbruch, Kartenbilder), Chat-Layout und ehrlicher Rechnerstatus, Fachwörter in den Quizfragen für Klasse 9.

## 6. Einschränkungen
- Chat-Antwort nicht gesehen (Speichermangel). Der Test mit Objekterkennung ohne Kamera zeigt nur den Leerzustand. Quizlauf mit absichtlich falschen Antworten (0 von 5), um die Rückmeldung zu sehen; die Erfolgsmeldung bei richtigen Antworten habe ich nicht ausprobiert.
- Zeiten für echte Schüler geschätzt.
- Screenshots: 24 Dateien in /tmp/r3-emre/ (u. a. 01-willkommen, 02-start-oben, 03-start-voll, 04-punkte-oben, 06-punkte-labor, 08-ml-mitte, 10c-menue-alle, 11-suche-Quiz, 13-quiz-antwort, 14-quiz-ende, 15-medien-stunde-1, 16-chat-hell, 18-chat-antwort, 21-start-hell, 22-objekt, 23-video-ende) plus PDF-Ansichten m1.png und m2.png (60 dpi).
