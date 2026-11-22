# Prüfrunde 3: Schülerin Klasse 10 (Leyla, 15, Handy 390 x 844, Touch)

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443. Chrome headless mit Mobil-Emulation (390 x 844, Skalierung 2, Touch, iPhone-Kennung), Kamera und Mikrofon nur über Fake-Geräte. 28 Screenshots in /tmp/r3-klasse10/ (Nummern 01 bis 28, dazu PDF-Vorschauen m-p-*.png). Genau eine Sprachmodell-Anfrage (Chat), "Zu viele Anfragen" trat nicht auf. Ein Chromium, am Ende geschlossen.

Ehrlich vorweg: Videos habe ich nicht mit Ton angesehen, sondern Dauer, Untertitelspur, Kapitel und Ende geprüft. Fortschritt-Merken habe ich nicht eingeschaltet. Die PDFs habe ich geladen, mit pdftoppm gerendert und angesehen (Arbeitsblatt, Lösungsblatt Medien 4, Kartenset Echt oder KI?). Die anderen PDFs habe ich nicht geöffnet.

## 1. Gesamtnote: 7,5 von 10 (Vorrunde 6,5)

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit fürs Alter | 8 | Schüler-Startseite in kurzen Sätzen ("Probiere aus, wie KI arbeitet", 03-start-voll). Hausaufgaben-Seite mit Ampel und Fitnessstudio-Bild gut. Abzug: "Jetson" und "Sprachmodell" stehen im ersten Absatz, Chat-Kopf "drei Milliarden Parametern", "Token" (06-chat). |
| 2 | Einstieg und Führung | 8 | Willkommens-Fenster (01) mit sechs Rollen, "Ich bin Schüler:in" führt in einem Tipp auf eine eigene Startseite mit sechs Experimenten, Zeitangabe und "Empfohlen für dich" (02, 03). Menü "Für dich" mit 6 Punkten, "Alle Bereiche" zu (04). Abzug: Das Chat-Eingabefeld liegt erst nach zwei Bildschirmen (06, 07). |
| 3 | Lernwirkung | 8 | Quiz mit Erklärung auf Grenzen, Hausaufgaben, Echt oder KI (27). Punkte-Fläche mit Nachbarn (21). Eigene Erklärung gelingt, siehe unten. Abzug: Einsteigerseite "Was ist KI?" und Punkte-Labor ohne Quiz. |
| 4 | Motivation und Spaß | 7 | Punkte-Labor, Live-Balken im Chat, Kartenset Echt oder KI? zum Ausschneiden (m-p-bildkarten). Beispiele sind jetzt aus meiner Welt: Hausaufgaben, Echt oder KI. Abzug: Bilder erzeugen und Face-Swap weiter nicht spielbar, keine Belohnung oder Ziel. |
| 5 | Labore und Interaktion | 7 | Chat: Feld 56 px hoch, schrumpft beim Antworten nicht mehr (10), erstes Wort nach 1,1 s, danach rund 6,5 Tokens pro Sekunde. Leere Eingabe zeigt jetzt "Schreib zuerst eine Frage." Abzug: Antwort zeigt rohes Markdown ("**Benutzerverhalten**", 11), 20 s Wartezeit bis fast fertig, Objekt-Labor ohne wählbare Beispielbilder (siehe Befund Hoch 1). |
| 6 | Videos | 7 | 2:11, deutsche Untertitelspur vorhanden (Modus "hidden", also standardmäßig aus), Kapitel mit Zeiten, Ende mit klarer Schlussfolie (25). Abzug: Steuerleiste verdeckt unten die Folie (13: Zeile "Rot" halb verdeckt, 25: Text darunter), Tipp auf das Video startete es im Test nicht (nach 3 s Zeit 0:00, pausiert). |
| 7 | Navigation und Orientierung | 8 | Suche: "TikTok" findet Empfehlungen, "Hausaufgaben" findet "KI und Hausaufgaben" und "Gut fragen", Treffer nach Gruppen (05, 09). Menü klar. Abzug: Suchfeld in der Kopfzeile nur 94 px breit, wenn die Rolle angezeigt wird, Platzhalter "Seite" abgeschnitten (02, 04). Leerer grauer Balken unter dem Fortschritt in der Suche (05, 09). |
| 8 | Vertrauen und Sicherheit | 8 | 16+ steht jetzt als blaues Feld ganz oben in jedem Einwilligungsfenster (16: "Nutzbar ab 16 Jahren ... Die Seite prüft dein Alter nicht"), auch im Mikro-Fenster, und auf der Startseite ("Ab wann?"). Kein "null" mehr. Haken nicht vorangekreuzt. Ehrlich: kein Alterscheck. Abzug: "Zahlenlisten, mit denen sich Gesichter ... wiedererkennen lassen" klingt für mich weiter nach Speichern. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Haupt-Knöpfe 44 px, kein seitliches Überlaufen auf 10 geprüften Seiten (Breite 390). Fokusrahmen 3 px beim Tabben sichtbar. Hell und Dunkel gut lesbar (18, 21), Grautext 95/95/100 auf 245/245/247 ausreichend. Abzug: Glossar-Begriffe 26 px hoch, Textlinks "Mehr dazu" 18 px und "Lizenzen und Quellen" 16 px, Quiz zeigt richtig nur mit Farbe plus Rand (27). |
| 10 | Fehlerfälle | 8 | Kamera ablehnen: freundlicher Text (17, 24). Leere Eingabe: Hinweis. Suche leer mit Vorschlägen. Abzug: Ablehn-Text im Objekt-Labor verspricht Beispielbilder, die ich nicht bedienen kann. Im Gesichts-Labor steht ehrlich "Beispielbilder gibt es hier nicht". |

Gesamtnote als ehrlicher Eindruck: **7,5**. Das Wichtigste aus der Vorrunde ist behoben (Chat am Handy, Altersangabe, Schul-Einstieg, Suche). Es bleiben Detailmängel und ein unvollständiges Versprechen.

## 2. Vergleich zur Vorrunde

Besser:
- Chat am Handy: Eingabefeld 56 px (vorher 49, bei Antwort einbuchstabig), bleibt bei "Stopp" in voller Breite (10). Leere Eingabe meldet sich.
- Eigene Schüler-Startseite statt "Für Entscheider" (03). Startseite 2035 statt 7248 Pixel Höhe nach Rollenwahl.
- Beispiele aus meinem Alltag: "KI und Hausaufgaben", "Echt oder KI?", Kartenset.
- Suche findet TikTok, Hausaufgaben, ChatGPT, Deepfake (vorher TikTok, Hausaufgaben, Spotify leer).
- 16+ jetzt oben im Einwilligungsfenster, im Mikro-Fenster, auf der Startseite. "null" im Mikro-Fenster weg.
- Quiz jetzt auf Hausaufgaben, Echt oder KI, Grenzen (10 Quiz-Elemente je Seite).
- Videoinhalt "vier gegen fünf Fähigkeiten" nicht erneut geprüft.

Gleich:
- Steuerleiste im Video verdeckt Teile der Folie.
- Video startet im Test nicht per Tipp.
- Bilder erzeugen und Face-Swap nicht spielbar.
- Kleine Touch-Ziele (Glossarbegriffe 26 px).
- Der graue Satz "Du liest gerade kurz ..." und "Der Verweis am Ende der Folge ..." stehen auf jeder Seite als Textblock.
- Antworten des kleinen Modells mit Fehlern.

Schlechter:
- Nichts Neues deutlich schlechter. Auffällig: Die Rechnerzeile auf der Startseite sagt "bereit und frei. Gerade zu 99 Prozent ausgelastet" (02), das widerspricht sich in einem Satz (kam durch parallele Prüfer, der Text bleibt trotzdem unlogisch).

## 3. UX- und UI-Befunde

Blocker: keine.

Hoch:
1. Objekt-Labor, Abschnitt "Live ausprobieren" (24-objekt-ohne): Der Text nach "Ohne Kamera" sagt "Du kannst mit den Beispielbildern weitermachen", die Startkarte trägt das Etikett "Mit Beispielbildern". Ich finde im Labor keinen Knopf für Beispielbilder (0 Beispiel-Knöpfe, nur ein statisches Foto weit unten). Für Schüler unter 16, die die Kamera nicht freigeben, bleibt das Labor leer. Das Versprechen läuft ins Leere.
2. Chat-Antwort (11-chat-antwort): Markdown wird roh angezeigt ("1. **Benutzerverhalten**: ..."), Satz bricht mitten im Wort ab ("interess", Antwort lief noch). Das wirkt kaputt und ist das zentrale Erfolgserlebnis.
3. Chat, Seitenaufbau (06-chat, 06-chat-voll): Das Eingabefeld liegt rund 1650 Pixel unter dem Seitenanfang (zwei Bildschirme: Kopf, Lernziele, "Modell llama3.2:3b im Speicher", Knopf "Modell laden", leere Fläche, Hinweistext). "Modell laden" bei "im Speicher" bleibt unerklärt.

Mittel:
4. Kopfzeile (02, 04, 05): Mit Rollen-Chip bleibt für die Suche 94 px, Platzhalter "Seiten suchen" erscheint als "Seite". Beim Tippen sieht man nur "aben" (05). Beim Menü-Öffnen und in der Suche ein leerer grauer Balken unter "Noch nichts gelesen" (05, 09).
5. Video (13-ki-hausaufgaben-fair, 25-video-ende): Bedienleiste liegt über dem Bildinhalt und verdeckt Text. Zwischen Video und Kapitelliste eine unruhige graue Fläche mit Textzeile. Untertitel standardmäßig aus.
6. Video Tipp (Test k.mjs): Tipp in die Videomitte startete nicht. Auf einem echten iPhone kann das anders sein, nicht belegt.
7. Lösungsblatt "für dich" (14-medien-stunde-4): Schülerinnen finden über Suche ("Medien 4: KI und Hausaufgaben") und Menü Lehrerseiten mit Download des Lösungsblatts samt Quiz-Antworten. Ich als Schülerin lade es herunter. Das ist keine Sicherheitslücke, aber Zweck der Aufgaben fällt weg.
8. Suchtreffer ohne Auszug (09-suche-tiktok): "Wie Netze sehen" und "Fairness und Verantwortung" bei TikTok ohne Grund, ich verstehe nicht, warum.
9. Startseite (03-start-voll): "Alle Experimente" und Hinweis "Labore mit Kamera findest du unter Alle Bereiche. Im Unterricht brauchst du sie nicht." gut, aber "Im Unterricht" passt nicht zu jemandem, der zu Hause ausprobiert.

Klein:
10. Willkommens-Fenster (01): "Anwendungsfälle," stößt am rechten Rand der Karte "Ich entscheide im Betrieb". Karten unterschiedlich hoch, Text unterschiedlich eingerückt (links Symbol, daneben Text in zwei Spalten).
11. Arbeitsblatt-PDF (m-p-arbeitsblatt-medien-4): Auf Seite 1 steht die Überschrift "Quiz: Was hast du verstanden?" allein am Seitenende, die Fragen beginnen auf Seite 2. Kopfzeile "eine Doppelstunde ·" mit Punkt am Zeilenende. Seitenkopf "45 Minuten" auf der Webseite, Blatt nennt "Doppelstunde".
12. Kartenset (m-p-bildkarten): 12 Karten, 2 Seiten, saubere Schnittlinien, Seite 2 halbleer. Keine Beschriftung, was Aufgabe ist (nur Verweis oben). Gut als Spiel.
13. Touch-Ziele: "Mehr dazu" 18 px, "Lizenzen und Quellen" 16 px, Glossarbegriffe 26 px, Menüpunkt "KI" 24 px (Startseite, Chip). Auf /karte 13 Elemente unter 36 px.
14. Chat: Dreifach-Hinweis "Antwort eines KI-Modells ... Built with Llama" nimmt in jedem Antwortblock Platz.
15. Dunkelmodus (18, 21, 22): gut, Kontraste in Ordnung, Farbflächen im Punkte-Labor lesbar.

## 4. Zielaufgaben der Persona

| Aufgabe | Gelöst? | Klicks, Sekunden |
|---|---|---|
| Einstieg als Schülerin finden | Ja | 2 Tipps (Schüler:in, dann Start), unter 10 s |
| Eine Frage an die KI stellen (TikTok) | Ja, mit Mängeln (rohes Markdown) | Start, Chat (2 Tipps), Scrollen zum Feld, Tippen, Senden: rund 8 Aktionen, erstes Wort 1,1 s, Antwort 20 s+ |
| Hausaufgaben-Regeln verstehen | Ja | Suche "Hausaufgaben", 1 Tipp, Video 2:11 + Ampel-Abschnitt |
| Quiz lösen | Ja | 1 Tipp pro Frage, sofort Erklärung |
| ML-Labor selbst bedienen | Ja | Beispieldaten, Tipp ins Feld, Fläche an: 3 Tipps, unter 15 s |
| Objekt-Labor ohne Kamera | Nein, es gibt keine bedienbaren Beispielbilder | 3 Tipps bis zur Sackgasse |
| Arbeitsblatt als PDF laden und öffnen | Ja (3 Seiten, 271 KB, QR-Code, Operatoren) | 1 Tipp |
| Kartenset Echt oder KI? | Ja (2 Seiten, 2,1 MB, 12 Bilder) | 1 Tipp, lädt zügig |
| Altersangabe finden | Ja, sofort sichtbar | 0 Scroll im Fenster, Satz oben |

Was ich verstanden habe (3 Sätze): KI wie TikTok-Empfehlungen oder ChatGPT lernt aus vielen Beispielen und gibt aus, was wahrscheinlich passt, nicht, was stimmt. Bei Hausaufgaben frage ich mich: Habe ich danach mehr verstanden, oder gebe ich nur ab? Ich erkläre es mit der Ampel und gebe KI-Hilfe an.

## 5. Empfehlung und größte Lücken

Ja, ich würde es Freunden schicken, die in der Schule mit KI arbeiten sollen: Die Schüler-Startseite, "KI und Hausaufgaben" und die Punkte-Fläche sind klar und ehrlich. Für Hausaufgaben direkt würde ich es nicht nutzen, weil der Chat roh formatiert und die kleine KI Fehler macht.

Die drei größten Lücken Richtung 10:
1. Chat-Seite für das Handy straffen und Antwort sauber darstellen: Eingabefeld ohne zwei Bildschirme Vorspann, Markdown rendern, "Modell laden" erklären oder ausblenden.
2. Versprochene Beispielbilder im Objekt-Labor wirklich bedienbar machen, damit unter 16 alles ohne Kamera funktioniert.
3. Handy-Feinschliff: Suchfeld in der Kopfzeile breit genug, Videoleiste nicht über der Folie (Untertitel an), Touch-Ziele mindestens 44 px, Lehrerseiten und Lösungsblätter aus dem Schüler-Menü und der Suche heraushalten.
