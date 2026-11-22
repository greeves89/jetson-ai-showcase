# Runde 3: Mia (13, Klasse 8, Handy 390x844)

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443, Chromium headless über tests/browser.mjs (Viewport 390x844, Hell und Dunkel), Rolle "Schüler:in" über das Willkommens-Fenster. Screenshots (17 Stück) in /tmp/mia3/. Chat-Labor: eine Anfrage, danach 12 Sekunden Pause, keine Ratenbegrenzung. Die PDFs habe ich geladen und mit pdftoppm -r 60 angesehen.

## 1. Gesamtnote: 7,5 von 10 (Vorrunde 6)

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter | 7,5 | Startseite und Schülerseiten kurze Sätze, Symbolkarten. Labore tragen noch Fachwörter, "Operatoren" (Nenne (I), Beurteile (III)) auf den Arbeitsblättern |
| 2 | Einstieg und Führung | 8 | Rolle gewählt, Startseite heißt "Experimente, leicht erklärt", sechs Experiment-Karten, "Empfohlen für dich" mit drei Lektionen. 319 Wörter, 3.624 px (vorher 1.123 Wörter, 11.673 px) |
| 3 | Lernwirkung | 7,5 | Echt oder KI?: Ausgangslage-Regler, Warnzeichen, drei Prüfwege, Quiz. Hausaufgaben: Faustfrage, Ampel. Kein Bild zum Selbstprüfen in der App |
| 4 | Motivation und Spaß | 7 | Punkte-Labor mit Beispieldaten sofort bunt und antippbar. Kein Rate-Spiel in der App, Bildkarten nur als Druck-PDF |
| 5 | Labore und Interaktion | 7 | Punkte-Labor (/ml) und Netz laufen sofort. Chat wieder "nicht im Speicher", jetzt mit Knopf "Noch einmal versuchen" |
| 6 | Videos | 8 | Alle drei Schülerseiten haben ein Erklärvideo (Echt oder KI? 2:31, Hausaufgaben 2:12, Fragen 2:14), Kapitel antippbar, Untertitelspur vorhanden, KI-Kennzeichnung. Video startet (3,3 s nach 4 s) |
| 7 | Navigation und Orientierung | 8 | Menü "Für dich" mit 6 Einträgen, "Alle Bereiche" zugeklappt. Suche "Experiment" findet jetzt Treffer. Suche "KI Bild erkennen" findet "Echt oder KI?" immer noch nicht |
| 8 | Vertrauen und Sicherheit | 8 | Ab-16-Hinweis auf der Startseite und im Willkommens-Fenster, "Nichts wird gesendet", "Antwort kann falsch sein" im Chat |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Fokus sichtbar (3 px), Skip-Link, Haupt-Knöpfe 44 px und mehr. Quiz-Radios 13 px, "Lizenzen und Quellen" 16 px hoch, Suchplatzhalter abgeschnitten |
| 10 | Fehlerfälle | 8 | Chat: freundliche Meldung ohne eckige Klammern, mit Knopf "Noch einmal versuchen" (Screenshot 15). Leere Eingabe: Senden tut nichts, kein Hinweis |

## 2. Vergleich zur Vorrunde

**Besser**
- Startseite für Schüler:innen: 319 statt 1.123 Wörter, 3.624 statt 11.673 Pixel. Das Rollen-Fenster steht nicht mehr doppelt (kein Block "Wofür bist du hier?" mehr auf der Startseite). Screenshot 02-start-full.png.
- Der Schulpfad beginnt nicht mehr mit Lehrertext. Mia landet bei "Experimente, leicht erklärt" mit sechs Karten, "Ohne Kamera" klar gekennzeichnet.
- Menü folgt der Rolle: "Für dich" mit Start, Experimente, Sprachmodell im Chat, Echt oder KI?, KI und Hausaufgaben, Gute Fragen stellen, Was ist KI? (03-menue.png). Vorher 12 Gruppen ohne Sortierung.
- Eine eigene Gruppe "Experimente" existiert, Suche "Experiment" liefert Treffer (vorher 0). "Spiel" und "Hausaufgaben" funktionieren, "Hausaufgaben" nennt jetzt "KI und Hausaufgaben" unter Medienkompetenz.
- Videos auf allen Schülerseiten (vorher 0).
- Chat-Fehlermeldung: kein Programmfehler-Look mehr, mit Wiederholknopf (15-chat-antwort.png).
- Kachel "Schüler:in" ist nicht mehr vorausgewählt.
- Punkte-Labor: Zeichenfläche jetzt 310 px breit (vorher Netz-Labor 130 px), Beispieldaten und Regler direkt darunter (18-dunkel-ml.png).
- Echte Bildkarten für "Echt oder KI?" gibt es jetzt (zwölf Fotos, 2 Seiten A4, nummeriert).

**Gleich**
- Suche findet "Echt oder KI?" bei "KI Bild erkennen" nicht. Suchplatzhalter weiter abgeschnitten ("Seite").
- Quiz-Radios 13 px, "Lizenzen und Quellen" 16 px.
- Chat-Labor nicht nutzbar (Jetson ohne freien Speicher, Modell "nicht im Speicher"). Eine echte Antwort konnte ich wieder nicht sehen.
- Lektionsseiten sind lang (Echt oder KI? 8.117 px, 788 Wörter, Hausaufgaben 7.677 px, Alltag 7.511 px).
- Kein Rate-Spiel in der App.

**Schlechter:** nichts Gravierendes gefunden.

## 3. UX- und UI-Befunde

**Blocker:** keine.

**Hoch**
1. Schule/Medien 1 (/medien-stunde-1) ist über die Suche "echt" gleichrangig mit "Echt oder KI?" und beginnt mit Download-Karten für Arbeitsblatt, Lösungsblatt und Kartenset (09-medien1.png). "Lösungsblatt Medien 1, für dich" richtet sich an Lehrkräfte. Eine Schülerin, die das Kartenset sucht, findet es nur dort, nicht auf "Echt oder KI?". Die Bildkarten (Fotos von Fuchs, See, Spaghetti) sind gut, aber nur als PDF zum Ausschneiden. In der App kann Mia kein Bild raten. Seite Echt oder KI?, 08-echt-*.png.
2. Chat-Labor (/chat): "nicht im Speicher", Knopf "Modell laden" und "Senden" konkurrieren. Beim Senden lädt das Modell nicht von selbst, die Antwort ist die Fehlermeldung (13-chat.png, 15-chat-antwort.png). Das Hauptlabor für "Gute Fragen stellen" und "Hausaufgaben" ist so ein Rückschlag. Hinweis: Jetson-Last, keine Seitenschuld, aber Mia sieht nur das Ergebnis.
3. Willkommens-Fenster, Kachel "Ich entscheide im Betrieb": Das Wort "Anwendungsfälle," ragt über den rechten Kachelrand hinaus (01-willkommen.png). Die Schüler-Kachel hat weiter den längsten Text ("Kamera, Mikro und Gesicht ab 16, im Schulpfad nicht nötig"), vierzeilig.

**Mittel**
4. Suche: Platzhalter abgeschnitten ("Seite"), nach Eingabe sieht man nur das Ende des Wortes ("echt", 04-suche-bild.png). Ergebnisliste erscheint im Menü, nicht als eigene Treffer-Seite, und gruppiert nach Menügruppen statt nach Relevanz. "KI Bild erkennen": Echt oder KI? fehlt (Treffer: Schule KI 1 und KI 3, Handreichung). "Quiz": findet Lektionen, aber das ist ein Seiten-Merkmal.
5. Seiten sind lang: Echt oder KI? 8.117 px mit "Mehr dazu"-Blöcken, die im Kurzmodus erst aufgeklappt werden. Kein Fortschritt innerhalb der Seite, kein Sprungmenü auf dem Handy.
6. Arbeitsblätter: Im Kopf steht "Lizenz: noch festzulegen" (arbeitsblatt-medien-1-1.png, auch Medien 4). Für eine Veröffentlichung ein offener Punkt. QR-Code oben rechts schön, Niveau-Quadrate sind für Kinder ohne Legende nur halb verständlich ("Basis, Standard, Herausforderung" steht daneben, gut).
7. Arbeitsblatt-Sprache: "Nenne (I)", "Erkläre (II)", "Beurteile (III)", "Entwickle (III)" sind Operatoren mit Anforderungsbereich in Klammern. Für Lehrkräfte richtig, für Klasse 8 ohne Erklärung nüchtern.
8. Quiz: Antwort wird sofort grün markiert, kein "Nochmal", kein Punktestand sichtbar im geprüften Ausschnitt (10b-quiz-antwort.png). Das ist wie in der Vorrunde.
9. Leere Eingabe im Chat: Senden macht nichts sichtbares (14-chat-leer.png, vorher "Schreib zuerst eine Frage."). Das ist eher schlechter als zuvor, falls der Hinweis dort entfallen ist.
10. Punkte-Labor: Zeichenfläche startet leer ("Das Feld ist leer") grau, 260 px hoch (11/12-ml-labor.png). Der Knopf "Beispieldaten" liegt unter dem Feld und unter den Farb-Knöpfen. Ein schmaler heller Streifen zwischen Feld und Reglern wirkt wie ein Rest (18-dunkel-ml.png, bei y 342).

**Klein**
11. Quiz-Radios 13 px, ganze Zeile antippbar (gut), "Lizenzen und Quellen" 16 px hoch.
12. Video-Standbild (Echt oder KI?) zeigt ein Bild, auf dem ein roter Text unter der Steuerleiste hängt ("Ohne Herkunft nur eine Behauptung", 07-echt.png). Er wird von der Leiste teilweise verdeckt.
13. Der Satz "Der Verweis am Ende der Folge meint diese Seite" steht unter jedem Video (auch ml). Kinder lesen das nicht, der Satz ist für die Videoschleife nötig, aber nie hilfreich.
14. Dunkelmodus: Kontrast gut (16/17/18). Fokus-Ring beim Suchfeld "outline none", der Ring zeigt aber als Schatten (03/04), unkritisch.
15. Konsole: keine Fehler in allen Läufen. Direktaufruf von /echt-oder-ki lädt sauber.

## 4. Zielaufgaben

1. **Experiment in 5 Minuten, das ich zeigen kann: gelöst, schnell.** Startseite, Karte "Punkte-Labor" (Karte 1, "Starten"), dann Beispieldaten antippen: 3 Klicks, ca. 20 Sekunden. Die Kacheln sagen "ca. 1 Min Lesen, plus Video 1:29, plus Labor ca. 3 Min", das passt zu "5 Minuten". Bunte Punkte und Entscheidungsfläche sieht man ohne Anleitung. Fachwort "k (Nachbarn)" bleibt.
2. **Erkennen, ob ein Bild KI ist: gelöst, mit Lücke.** Menü "Für dich", "Echt oder KI?": 2 Klicks, ca. 10 Sekunden. Video 2:31, Warnzeichen (Hände und Zähne, Schrift, Licht, Hintergrund, Haut, Spiegelungen), drei Prüfwege, Quiz. Über die Suche "Bild KI echt" kommt "Echt oder KI?" ebenfalls (3 Klicks, ca. 20 s), mit "KI Bild erkennen" nicht. Kein Beispielbild zum Raten in der App.
3. **Darf ich KI für Hausaufgaben nutzen: gelöst.** Menü, "KI und Hausaufgaben": 2 Klicks, ca. 10 Sekunden. Titel "KI bei Hausaufgaben: fair nutzen", Video 2:12 mit Ampel, "Eine Frage, die fast alles klärt", Quiz mit Alltagsfragen. Im Quiz "Deine Lehrkraft hat nichts zu KI gesagt" bleibt eine gute Frage. Die Antwort "Frag deine Schule" steht im Kasten "Das nimmst du mit" (Screenshot 10-quiz.png) weit unten, nicht oben.

## 5. Empfehlung und größte Lücken

Ja, ich würde es meinen Freundinnen schicken: Der Start ist kurz, die Experimente sind klar sortiert und "Echt oder KI?" sowie "KI und Hausaufgaben" sind ehrlich und haben jetzt ein Video. Ein Rate-Spiel mit echten Bildern wäre das, was ich wirklich weitergeben würde.

Die drei größten Lücken Richtung 10:
1. **Raten statt lesen:** Die zwölf Bildkarten ("Echt oder KI?") in die App holen als antippbares Spiel mit Auflösung und Punktestand, sichtbar auf "Echt oder KI?" und unter "Experimente".
2. **Chat zuverlässig und Suche verständlich:** Senden soll das Modell selbst laden (oder ein klarer Wartezustand "Modell wird geladen, ca. 20 Sekunden") und die Suche muss "Bild erkennen", "Spiel", "Quiz", "Video" auf die richtige Seite führen, ein lesbares Suchfeld auf dem Handy.
3. **Feinschliff Schülerseiten:** Antwort "Darf ich?" in den ersten Bildschirm von "KI und Hausaufgaben", Lizenzzeile "noch festzulegen" aus den PDFs, Überlauf im Willkommens-Fenster, Quiz mit "Nochmal", kürzere Lektionsseiten oder Sprungmarken.
