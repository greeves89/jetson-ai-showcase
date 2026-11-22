# Prüfrunde 3: Schüler Klasse 8 (Jonas, 13, Handy 390x844, Touch)

Prüfung am 22.11.2026 gegen https://192.168.178.83:8443. Chrome headless mit Mobil-Emulation (390x844, isMobile, hasTouch, Tippen statt Klicken, Skalierung 2). Dunkel als Standard, Hell für Start, Quiz und Gesicht. Rolle im Willkommens-Fenster: "Ich bin Schüler:in". Screenshots (30 Dateien) liegen in docs/runde3/klasse8-bilder/. PDFs heruntergeladen und mit pdftoppm -r 60 angesehen. Alle Seiten: kein seitliches Überlaufen (scrollWidth 390), keine Konsolenfehler. Keine Ratenbegrenzung, kein Speichermangel; ein einziger Chat-Lauf, danach 10 Sekunden Pause.

Einschränkungen: Video nicht in Echtzeit angesehen (Sprung auf 0:11 und auf die letzten 4 Sekunden). Objekt-Labor mit Beispielbildern, Prompt-Vergleich und Netz-Spielplatz diesmal nicht bedient. Tastatur nur an einer Seite (Chat) angetestet.

## 1. Gesamtnote und Raster

Gesamtnote: **7,0 von 10** (Vorrunde 5,5).

| Nr | Kriterium | Note | Beleg |
|----|-----------|------|-------|
| 1 | Verständlichkeit fürs Alter | 7 | Startseite "Experimente, leicht erklärt" kurz und im Du. Kurze Sätze, Alltagsquiz ("Ein Programm meldet 95 Prozent KI. Wie gehst du damit um?"). Abzug: Seiten wie "Was ist KI?" und ML tragen noch "Inferenz", "Merkmalsraum", "Überanpassung", "Temperatur" (Videokapitel, 05-karte.png, 08-ml). |
| 2 | Einstieg und Führung | 8 | Willkommens-Fenster in 2 Sekunden klar, 1 Tipp auf "Ich bin Schüler:in", danach 6 Karten in 3624 px statt 5595 px (02-start-schueler.png). Kein "Für Entscheider" mehr. Abzug: Beschriftung der Rolle in der Kopfleiste verengt das Suchfeld auf "Seite" (abgeschnitten). |
| 3 | Lernwirkung | 7 | Punkte-Labor und Chat erkläre ich in drei Sätzen. Quiz auf "Echt oder KI?" gibt kurze, erklärende Rückmeldung (12-quiz-falsch.png). Abzug: Die Seite "Echt oder KI?" hat kein einziges Bild (img = 0), die zwölf Karten gibt es nur als PDF zum Ausdrucken. |
| 4 | Motivation und Spaß | 6 | Chat antwortet in 4,3 s, erstes Token nach 1,4 s (vorher 62 s): spürbar. "In Arbeit"-Seiten sind aus dem Menü verschwunden. Abzug: Beispielfragen weiter "Token", "Roboter", "Jetson" (06b-chat-leer.png), kein Bild-Labor, nichts zum Teilen, kein Spielcharakter bei "Echt oder KI?". |
| 5 | Labore und Interaktion | 7 | Chat schnell, Punkte-Feld jetzt ohne Scrollen bedienbar, Entscheidungsfläche als Schalter direkt unter dem Feld (08-ml-flaeche.png). Abzug: Statusanzeige widerspricht sich ("im Speicher" neben Knopf "Modell laden"), leeres Feld ohne Hinweis im Feld selbst (08-ml-labor-start.png), Ergebnissatz spricht noch von "deinem Zeiger". |
| 6 | Videos | 7 | 1:24, Untertitel jetzt unter dem Bild, Kapitel mit Sprung, Schlussbild mit "Nächste Videos". Abzug: Kapitel "Vier Fähigkeiten" gegen Schlussbild "Fünf Bereiche" (13-video-ende.png), Player-Leiste liegt bei 0:00 weiter über Bildtext (05-echt-oder-ki.png: "Sieht echt aus?" verdeckt), Ladekreis ins Standbild eingebrannt, leerer grauer Untertitelkasten bei 0:00. |
| 7 | Navigation und Orientierung | 8 | Menü "Für dich" mit 6 Einträgen, "Alle Bereiche" zugeklappt, Fortschrittsbalken "Noch nichts gelesen" (03-menue.png). Suche: "chatgpt" führt jetzt zuerst zu "Sprachmodell im Chat" (10-suche-chatgpt.png). Abzug: Suche sortiert nach Gruppen, nicht nach Treffer: "hausaufgaben" zeigt zuerst "Gut fragen" und "Grenzen", die Seite "KI und Hausaufgaben" fehlt oben; "witz" findet "Chunking"; "tiktok" und "snapchat" landen bei Empfehlungen und Gesichtern. |
| 8 | Vertrauen und Sicherheit | 8 | Altershinweis steht jetzt als blauer Kasten oben in beiden Kamera-Dialogen (09-objekt-dialog.png), "null" ist weg, Ablehnen-Text ist ehrlich ("Beispielbilder gibt es hier nicht"). Abzug: Kein Alterscheck (steht aber offen da: "Die Seite prüft dein Alter nicht"), Gesicht-Dialog sagt weiter "Zahlenlisten ... wiedererkennen" gegen Seitentext "erkennt nur, dass ein Gesicht da ist". |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Hauptknöpfe 44 px und mehr, Schrift mindestens 15 px, Hell und Dunkel gut lesbar, Tab-Reihenfolge sinnvoll mit 3-px-Fokusring, "Zum Inhalt springen". Abzug: Fußlink "Lizenzen und Quellen" 16 px hoch, "Mehr dazu"-Knöpfe 26 px, Begriffs-Links 20 px; Suchfeld ohne Outline (nur Schatten). |
| 10 | Fehlerfälle | 8 | Leeres Senden im Chat: orange "Schreib zuerst eine Frage." (06b-chat-leer.png), vorher stumm. Kamera abgelehnt: freundlich und jetzt wahrheitsgemäß (14-gesicht-abgelehnt-hell.png). Abzug: Fehlerpfade bei Speichermangel nicht selbst gesehen. |

## 2. Vergleich zur Vorrunde

Besser:
- Chat-Wartezeit von 62 s auf 4,3 s (erstes Token 1,4 s). Das war meine größte Lücke.
- Willkommens-Fenster mit Rolle, Startseite "Experimente, leicht erklärt" ohne Entscheider-Kachel, 3624 statt 5595 px.
- Menü je Rolle, Fortschrittsanzeige, "In Arbeit"-Seiten (Bilder erzeugen, Face-Swap) nicht mehr im Schülermenü.
- Suche: "ChatGPT" führt direkt zum Chat, "Deepfake" bekommt eine Erklärkachel mit Link auf "KI 3: Echt oder erfunden?".
- Chat: leeres Senden meldet sich. Quiz "Echt oder KI?" ist Alltag statt Parameterrechnung.
- Dialoge: Altershinweis oben, "null" behoben, Ablehnen-Text stimmt. Punkte-Feld liegt im ersten Bildschirm nach dem Antippen.
- Arbeitsblätter, Lösungsblätter und Kartenset öffnen sich, Dateiname "ki-labor-arbeitsblatt-medien-1.pdf".

Gleich:
- Video: "Vier Fähigkeiten" gegen "Fünf Bereiche", Verweis "Der Verweis am Ende der Folge meint diese Seite" (Generative KI).
- Beispielfragen im Chat langweilig, nichts zum Teilen.
- Kleine Tippflächen (26 px, 16 px, 20 px).
- Seiten 7000 bis 8400 px lang (Echt oder KI 8117, Hausaufgaben 7677, Gute Fragen 8357, Quellen prüfen 8398), obwohl "Kurz lesen" an ist und die Kopfzeile "ca. 1 Min Lesen" bei 750 bis 830 Wörtern nennt.
- Gesicht-Dialog: Widerspruch "wiedererkennen".

Schlechter: nichts Neues bemerkt.

## 3. UX- und UI-Befunde nach Schwere

### Blocker
Keine.

### Hoch
1. **Seite "Echt oder KI?" ohne Bilder.** Lektion und Medien-Einheit 1 haben null Bilder (Prüfung per img-Zählung), das Spiel "Echt oder KI?" gibt es nur als PDF-Kartenset (pdf-karten.png, 12 Fotos). Für mich als 13-Jähriger ist das der naheliegendste Ausprobier-Moment und er fehlt am Handy. Seite: echt-oder-ki, medien-stunde-1.
2. **Suchsortierung.** Treffer erscheinen nach Gruppen statt nach Passung. "hausaufgaben" zeigt "Gut fragen", "Grenzen", "Sprachmodell im Chat" vor "KI und Hausaufgaben"; "fake" zeigt Medien 3 erst am Ende; "witz" liefert "Chunking"; "tiktok" und "snapchat" führen nicht zu "Echt oder KI?" oder "Datenschutz im Alltag". Beleg: Lauf mit 14 Begriffen (10-suche-chatgpt.png als Beispiel für den guten Fall).
3. **Seitenlänge und ehrliche Zeit.** 7600 bis 8400 px (rund 9 Bildschirme) bei "ca. 1 Min Lesen". Quiz liegt ganz unten.
4. **Chat-Beispielfragen.** Drei Fragen ("Token", "Roboter", "Jetson") sind Fachthemen. Ein Witz kam erst, weil ich ihn selbst eintippte (07-chat-ergebnis.png).

### Mittel
5. **Chat: Modellstatus widersprüchlich.** Grüner Punkt "im Speicher" neben aktivem Knopf "Modell laden", die Pille ist auffällig hoch und oval (07-chat-ergebnis.png).
6. **Video.** Player-Leiste über dem Bild bei 0:00 (05-echt-oder-ki.png, 05-karte.png), eingebrannter Ladekreis im Standbild, leerer grauer Kasten darunter, "Vier" gegen "Fünf" (13-video-ende.png).
7. **Kopfleiste mit Rolle.** Das Rollenschild "Ich bin Schüler:in" lässt dem Suchfeld nur "Seite" (02-start-schueler.png, 03-menue.png).
8. **Willkommens-Fenster.** Karten ungleich hoch (179 gegen 126 px, Schüler:in trägt einen dritten Absatz), "Anwendungsfälle," läuft bei "Betrieb" rechts aus der Karte (01-willkommen.png). Das Fenster ist 761 px hoch bei 844 px Viewport, passt gerade.
9. **Kamera-Dialoge länger als der Bildschirm** (1111 bis 1206 px bei 812 px), Einwilligungsknopf unten angeschnitten (09-objekt-dialog.png). Im Objekt-Dialog stehen unten Firmenbeispiele ("Personen auf Baustelle und in der Werkhalle"), das passt nicht zur Schülerrolle.
10. **Punkte-Labor.** Leeres Feld ohne Hinweis im Feld (08-ml-labor-start.png), Ergebnissatz "unter deinem Zeiger" am Touch-Gerät.
11. **Arbeitsblatt-PDF.** Die Überschrift "Quiz: Was hast du verstanden?" steht allein am Fuß von Seite 1, die Fragen beginnen auf Seite 2 (pdf-arbeitsblatt.png). Die Operatoren "Nenne (I)" und "Entwickle (III)" im Aufgabentext wirken für Klasse 8 sperrig, die Tabelle unten erklärt sie aber.
12. **Gesicht-Dialog.** "wiedererkennen" widerspricht dem Seitentext "erkennt nur, dass ein Gesicht da ist".

### Klein
13. Tippflächen: "Lizenzen und Quellen" 16 px, "Mehr dazu" 26 px, Begriffs-Links 20 px (Messung auf karte, ml, prompts-fuer-schueler).
14. "Zur Startseite" statt "Zurück" auf allen Seiten, auch wenn ich aus der Suche komme.
15. Suchfeld ohne Outline, Fokus nur als Schatten (Screenshot 10 zeigt ihn deutlich, Messung "outline none").
16. Chat-Feld bleibt nach dem Fokus am Rand abgeschnitten sichtbar (06b-chat-leer.png: Sprung der Seite, kleines Resize-Dreieck im Feld unnötig auf dem Handy).
17. Kopfzeile "ca. 1 Min Lesen, plus Video 1:24, plus Labor ca. 3 Min" bricht auf "Min" in die zweite Zeile (05-karte.png).
18. PDFs verweisen auf "ki-labor.daniel-alisch.site", das ist beim Testen die öffentliche Domain (Hinweis, kein Fehler).

Hell und Dunkel: Kontrast in beiden gut, Quizfarben (Rot, Grün) gut unterscheidbar (12-quiz-falsch.png). Karten, Abstände und Ausrichtung auf der Startseite gleichmäßig (02b-start-voll.png: Kartenraster einheitlich, gleiche Innenabstände, "Starten"/"Öffnen" immer links). Icons einheitlich (lucide-Stil), keine Emojis. Animationen: nichts Störendes bemerkt.

## 4. Zielaufgaben von Jonas

| Aufgabe | gelöst? | Klicks und Zeit |
|---|---|---|
| Rolle wählen, wissen was ich hier tue | ja | 1 Tipp, 2 s; Startseite in 5 s verstanden |
| KI etwas fragen (Witz) | ja | Menü, Chat, tippen, senden: 4 Tipps; Antwort nach 4,3 s |
| Punkte-Labor mit Entscheidungsfläche | ja | Start, "Experimente"/ML, Beispieldaten, Schalter: 4 Tipps, ca. 20 s; Feld sofort sichtbar |
| "Echt oder KI?" selbst ausprobieren | nur halb | Quiz ja (4 Tipps), Bilder zum Prüfen nein, nur PDF-Karten |
| Suche mit Alltagswörtern | halb | "chatgpt" und "deepfake" gut; "hausaufgaben", "tiktok", "snapchat", "witz" nur teilweise |
| Hausaufgaben-Regeln finden | ja über Menü | 2 Tipps ("KI und Hausaufgaben"), über die Suche nur auf Umwegen |
| Kamera ablehnen | ja | Dialog, "Ohne Kamera weitermachen", Hinweis ehrlich |
| Arbeitsblatt, Lösungsblatt, Kartenset | ja | je 1 Tipp, PDFs 3, 3 und 2 Seiten A4, QR-Code, Quiz, Operatorentabelle vorhanden |

## 5. Würde ich es empfehlen?

Ja, mit Einschränkung: Seit dem schnellen Chat und der Rollenwahl würde ich es Freunden zeigen, vor allem den Punkte-Versuch und den Chat. Für "Echt oder KI?" fehlt mir am Handy noch das Spiel selbst.

Die drei größten Lücken Richtung 10:
1. Etwas zum Mitspielen und Teilen: "Echt oder KI?" mit den zwölf Bildern direkt auf der Seite (antippen, Urteil, Auflösung), dazu Chat-Beispielfragen aus meiner Welt (Witz, Rap, Ausrede) und ein Ergebnis zum Schicken.
2. Suche nach Passung statt nach Gruppen (Hausaufgaben, Fake, TikTok, Snapchat, Witz) und Seiten auf rund die Hälfte kürzen, ehrliche Zeitangabe.
3. Politur: Video (Player über dem Bild, "Vier" gegen "Fünf", Ladekreis), Statusanzeige im Chat, schmale Kopfleiste mit Rolle, Kamera-Dialog kürzer, Tippflächen 44 px.
