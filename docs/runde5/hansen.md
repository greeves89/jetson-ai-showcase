# Prüfbericht Runde 5: Frau Hansen (57, Lehrerin Mathe und Biologie, Laptop 1366x768)

Geprüft am 23.11.2026 gegen https://192.168.178.83:8443, headless Chromium, Hell und Dunkel. Screenshots in /tmp/r5-hansen/ (01 bis 19 plus PDF-Seiten). Chat: eine Anfrage, danach keine weitere.

## Gesamtnote: 7,8

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit | 8 | Lehrerseiten klar, aber Fachwörter wie Operator, Anforderungsbereich, Token ohne Vorerklärung auf den Einheiten |
| 2 | Einstieg und Führung | 9 | Willkommens-Fenster "Ich unterrichte" führt nach 1 Klick zu "Für morgen im Unterricht" mit allen Einheiten (02) |
| 3 | Lernwirkung | 8 | Aufgaben mit Operatoren, Lösungshinweisen, Tipps und Differenzierung sind sofort unterrichtbar |
| 4 | Motivation und Spaß | 7 | Punkte-Labor funktioniert und ist anschaulich (12, 13); Seite selbst ist textlastig |
| 5 | Labore und Interaktion | 8 | Punkte-Labor: Beispieldaten, Regler k, Entscheidungsfläche laufen fehlerfrei. Chat: 104 s für 191 Token (1,8 Token/s) bei Last |
| 6 | Videos | 8 | Kapitelliste, Untertitel, Hinweis auf KI-Stimme; Verweis am Ende erklärt (11) |
| 7 | Navigation | 8 | Suche findet "Lehrplan" sofort (09), "Mathe" liefert aber nur Formel-Hinweise statt Unterrichtsbezug (08) |
| 8 | Vertrauen und Sicherheit | 8 | Kamera-Sperre am Schulgerät erklärt, Hinweis "Antwort kann falsch sein" und Prüf-Karte im Chat |
| 9 | Barrierefreiheit | 8 | Skip-Link, Fokusrahmen 3 px, Quiz mit Tastatur. Suchfeld zeigt beim Fokus keinen Rahmen am Element selbst (der Rahmen sitzt am Container) |
| 10 | Fehlerfälle | 8 | "Seite nicht gefunden" mit Startseite, Suche und Vorschlägen; Chat zeigt Wartezeit und Stopp |

Gesamtnote ist der Eindruck, kein Mittelwert. Sie liegt unter 8,5 wegen der Lücke beim Fachbezug (Mathe, Biologie, Lehrplan) und der Druckansicht.

## Befunde

### Blocker
Keine.

### Hoch
1. **Kein Fachbezug für Mathe und Biologie, Lehrplanbezug nur KMK-Rahmen.** Seite "KI 1", Abschnitt Lehrplanbezug, und Handreichung: "wurde für kein Bundesland geprüft und bleibt Sache der Lehrkraft". Suche "Biologie" liefert nichts, "Mathe" nur Formel-Hinweise. Meine Aufgabe 3 ist damit nur halb gelöst: Ich finde den KMK-Rahmen (Informatik/Medienbildung), aber nichts, was ich in meine Fächer einordnen kann. Es fehlt eine Seite "KI im Mathe- und Biologieunterricht" mit Einordnung und je einer Idee.
2. **Browser-Druck der Seite ist unbrauchbar.** `emulateMedia print`: Seite KI 1 ergibt 9 Seiten (Handreichung 10), mit grauen "Herunterladen"-Schaltflächen, Kreis-Grafik auf eigener Seite, Quiz-Antworten ohne Frage getrennt, Überschrift "Merke" am Seitenende abgeschnitten, Adresszeile der Testadresse in der Kopfzeile (10-druck-stunde1.png). Das Labor leitet nicht ausdrücklich zu den PDFs um, wer Strg+P drückt, bekommt Papierverschwendung.

### Mittel
3. **Downloads liegen unterhalb der ersten Bildschirmhöhe.** Bei 1366x768 sieht man auf KI 1 nur die oberen Kanten der Karten "Arbeitsblatt" und "Lösungsblatt" (04-stunde1.png); "Herunterladen" ist erst nach Scrollen sichtbar. Die Lernziele-Zeile davor ist für Lehrkräfte weniger wichtig als der Druckweg.
4. **Doppelstunde ist versteckt.** Titel und Untertitel nennen "45 oder 90 Minuten", aber der Plan für 90 Minuten steht erst im Abschnitt "Einzelstunde oder Doppelstunde" weit unten (und vollständig im Lösungsblatt-PDF). Das Arbeitsblatt-Kopffeld sagt nur "Zeit: 20 Minuten (Doppelstunde: 30)". Ein Schalter "45 / 90 Minuten" oben würde Doppelstunden-Lehrkräften helfen.
5. **Arbeitsblatt-PDF Seite 4 fast leer.** Nur die Operatoren-Tabelle und Quellenzeile, rund ein Viertel der Seite genutzt. Als Handout sollte die Tabelle auf Seite 3 passen oder auf der Rückseite der Quiz-Seite stehen (06-pdf-ab.png).
6. **Gerätebedarf klein geschrieben.** Aufgaben verlangen Maus über freie Stelle, Regler k; "ein Gerät je Gruppe" steht nur im Fließtext. Bei 28 Schülern fehlt eine Zeile "Material und Geräte" ganz oben (Raum, WLAN, Chrome). Der Prompt-Werkstatt-Hinweis zu "nicht alle gleichzeitig" ist da, die Chat-Last (104 s Antwort schon bei Parallelbetrieb) macht ihn für eine Klasse wichtig.
7. **Reihenfolge im Quiz weicht vom Arbeitsblatt ab.** Bildschirm-Quiz zeigt die Antworten anders sortiert als das gedruckte Blatt (15-quiz.png gegen 06-pdf-ab.png), die Lösung "C" im Lösungsblatt passt nicht zur Bildschirmreihenfolge. Das verwirrt, wenn beides in der Stunde gemischt wird.

### Klein
8. Sidebar-Menü auf Lehrerrolle zeigt nach Rollenwahl die Gruppen weiterhin lang; "Alle Bereiche" bleibt als zweiter Block (02-nach-rolle.png). Kein Fehler, nur Länge.
9. Suche "Mathe" listet "Die Formel steht unter 'Mit Mathe'" als Beschreibung, das ist als Treffer für eine Mathelehrerin irreführend.
10. Im Menü steht "Gesichterbraucht Kamera, im Unterricht nicht nötig" ohne Trennung im Textinhalt (Screenreader liest zusammengezogen; optisch vermutlich als Etikett gelöst, nicht im Bild geprüft).
11. Status-Pille wechselt zwischen "bereit und frei" und "rechnet gerade", das ist hilfreich, aber ohne Angabe, ab wann es für die Klasse zu langsam wird.

## Zielaufgaben

1. **Doppelstunde planen:** Willkommen (01) > "Ich unterrichte" (1 Klick) > "KI 1: Was ist KI?" (2. Klick) > Abschnitt "Einzelstunde oder Doppelstunde" per Scrollen. Plan mit Tabelle in etwa 25 Sekunden gefunden. Vollständiger Doppelstunden-Plan (10/30/10/15/15/10 Minuten) im Lösungsblatt, Seite 1. Gelöst, aber der 90-Minuten-Weg ist nicht auf dem ersten Bildschirm.
2. **Arbeitsblatt und Lösung drucken:** Beide PDFs (4 und 3 Seiten, A4, Arial eingebettet, content-type application/pdf) geöffnet mit `pdftoppm -r 60`. Druckqualität gut: klare Schreiblinien, Name/Datum, Kopfzeile, QR-Code, Hilfekarten mit Schnittlinien, saubere Tabellen, Schwarzweiß tauglich (Niveau-Quadrate als Symbole, keine Farbe nötig). Schwächen: Seite 4 fast leer, Schriftgröße im Lösungsblatt klein (etwa 9 Punkt), Arbeitsblatt Seite 1 enthält schon Aufgabe 1 und 2 und lässt Seite 2 mit Aufgabe 3 und Quiz beginnen, was gut ist. Etwa 3 Klicks, 15 Sekunden. Gelöst.
3. **Lehrplanbezug:** Über Suche "Lehrplan" (09) in 2 Klicks und 10 Sekunden zur Handreichung, Abschnitt "Lehrplanbezug und KMK-Strategie" mit Tabelle aller Einheiten. Ehrlich und sauber begründet, aber ohne Fach (Mathe, Biologie) und ohne Bundesland. Teilweise gelöst.

## Chat und Labor
- Chat (Seite "Sprachmodell im Chat", Dunkel): Wartehinweis nach 3 s "Der Jetson rechnet seit 3 s ... Das erste Wort kann bis zu einer Minute dauern. Mit Stopp kannst du abbrechen." mit Zeitzähler (18-chat-warten.png) ist vorbildlich. Antwort nach 104,2 s (191 Token, 1,8 Token/s) bei geteilter Last, danach Warnband "Das kleine Modell irrt bei Erklärungen zur KI oft" und Prüf-Karte (19-chat-antwort.png). Für eine Klasse mit 28 Kindern ohne Staffelung nicht tragbar, was die Seite für Lehrkräfte nur beiläufig sagt. Eine Ausfall-Karte wurde nicht ausgelöst, daher nicht bewertet.
- Punkte-Labor (Seite Maschinelles Lernen): Beispieldaten, Farbwahl, k-Regler und Entscheidungsfläche funktionieren, keine Konsolenfehler.
- Browser-Konsole: bei den Hauptwegen keine Fehler (außer dem erwarteten 404 bei /ki-1).

## Empfehlung
Für eine Lehrerin ohne Technikerfahrung ist der Weg von der Rolle bis zu druckfertigen PDFs kurz und sehr gut gemacht; ich würde KI 1 morgen unterrichten. Vor einer Empfehlung im Kollegium fehlen ein Fachbezug für Mathe und Biologie, eine brauchbare Browser-Druckansicht (oder ein klarer Hinweis auf die PDFs) und ein sichtbarer Doppelstunden-Plan oben.

## Die drei größten Lücken Richtung 10
1. Fachbezug: eine Seite oder Tabelle "KI im Mathe- und Biologieunterricht" (Beispiele, Lehrplanstichworte mit Quellenangabe für mindestens zwei Bundesländer), dazu Suchbegriffe Mathe, Biologie, Lehrplan mit Unterrichtstreffern.
2. Druck: Druckstylesheet überarbeiten (keine Schaltflächen, keine Seitenumbrüche in Grafiken oder Quizfragen, keine Adresszeile) oder oben auf den Lehrerseiten ein Knopf "Alles als PDF". Arbeitsblatt auf 3 Seiten kürzen.
3. Doppelstunde und Klasse: Schalter oder Kasten "90 Minuten" und "Material und Geräte" oberhalb der Downloads; Download-Karten über die Falz (1366x768); klare Hinweise zur Gruppen-Staffelung beim Chat und zur Bildschirmreihenfolge des Quiz im Vergleich zum Arbeitsblatt.
