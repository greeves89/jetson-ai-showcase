# Prüfrunde 2, Welle 2: Emre (14, Klasse 9 Realschule, Tablet 820x1180)

Beobachtet am 22.11.2026 zwischen 16:33 und 16:46 Uhr (MEZ), gegen https://192.168.178.83:8443. Bedienung im Browser (Chrome headless, Touch, Fake-Kamera), Rolle "Schüler:in" gewählt. Screenshots in /tmp/welle2-emre/. Die Seite wurde in dieser Zeit von anderen Agenten weiterentwickelt, der Stand kann abweichen. Ratenbegrenzung ("Zu viele Anfragen") trat nicht auf. Es gab genau zwei Sprachmodell-Anfragen mit 20 Sekunden Pause.

Hinweis zu Zeiten: Gemessen sind nur die Ladezeiten der Seiten (Skript). Wie lange ein echter 14-Jähriger braucht, schätze ich und kennzeichne das als Schätzung.

## 1. Willkommens-Fenster und Startseite (Zusatzfrage 1)

Was ich gesehen habe: Mit ?willkommen=1 erscheint ein Fenster mit unscharfem Hintergrund, sechs Rollenkacheln, einem Schalter "Lernfortschritt merken" und "Später". Ohne den Parameter erscheint es im Test-Browser nicht (Absicht laut Harness, wegen navigator.webdriver). Ein echter Nutzer sieht es also beim Erstaufruf.

Was ich erwartet habe: Ein Fenster, das kurz fragt und mich weiterschickt. Ich habe "Ich bin Schüler:in" getippt (1 Tipp, Fenster ging nach rund 2 Sekunden zu).

Was passiert ist: Das Fenster schließt, die Seite bleibt aber die Startseite, oben steht nur ein kleines Chip "Ich bin: in der Schule". Es gibt keinen Sprung zu etwas, das ich tun soll. Darunter steht dieselbe Rollenauswahl noch einmal als sechs große Kacheln ("Wofür bist du hier?"), obwohl ich gerade gewählt habe. Das wirkt wie ein doppeltes Fenster. Der Hinweis in der Kachel "Kamera, Mikro und Gesicht ab 16, im Schulpfad nicht nötig" ist für mich eher verwirrend: Ich weiß nicht, ob ich die Labore mit Kamera darf oder nicht.

"Neu hier? Hier anfangen" scrollt 2551 Pixel nach unten (Seite bleibt die Startseite). Dort steht für mich als Schüler als Schritt 1 "KI im Unterricht: Einstieg für Klassen und Lehrkräfte" (Lehrertext) und direkt darunter ein Block "In 15 Minuten: Was bringt KI meinem Betrieb?". Beides ist nicht für mich gedacht, obwohl ich Schüler gewählt habe.

## 2. Menü (Zusatzfrage 2)

Auf dem Tablet (820 breit) ist das Menü ein Aufklapp-Fenster hinter dem Menüknopf rechts oben, nicht links fest.

- Startseite, Menü geöffnet: 12 Gruppen, nur 1 Menüpunkt sichtbar (Start). Alle anderen Gruppen sind zugeklappt. Fortschrittsbalken "Noch nichts gelesen (75 Seiten)" oben.
- Lektionsseite (Training), Menü geöffnet: 12 Gruppen, 12 Menüpunkte sichtbar (Start plus die elf Seiten der aktuellen Gruppe Grundlagen). Die anderen elf Gruppen zu.
- Insgesamt 75 Seiten in 12 Gruppen. Das ist viel, aber durch das Zuklappen auf dem Tablet nicht erschlagend.
- Die Rolle "Schüler:in" ordnet das Menü nicht um. "Für die Schule" und "Medienkompetenz" (KI und Hausaufgaben, Echt oder KI?) stehen ganz unten, Ordnung ist die gleiche wie für Betriebsleiter.

Fünf Punkte, die ich erwarte: Spiele/Ausprobieren, Videos, Quiz, "Wie lernt eine KI", "Ist das sicher?". Davon gibt es als Menüpunkt keinen einzigen außer "Ist das sicher?" (in "Der Rechner dahinter"). Nie anklicken würde ich: "Business-Use-Cases", "KI im Betrieb", "Der Rechner dahinter", "Wissen und RAG" (alles Fremdwörter oder Arbeitswelt).

## 3. Zielaufgaben (Zusatzfrage 3)

### Aufgabe 1: Labor mit Bild oder Spiel starten. Gelöst, aber nicht als Spiel.
Weg: Rolle wählen (1 Tipp), Suchfeld tippen und "Spiel" eingeben (2 Aktionen), Treffer "Maschinelles Lernen" (1 Tipp), 2 Mal scrollen, "Beispieldaten" tippen, auf das Feld tippen, "Entscheidungsfläche zeigen". Etwa 6 Tipps plus Tippen. Seite lädt in rund 4,6 Sekunden bis zur Lektion (gemessen, mit Suche). Geschätzt 1 bis 1,5 Minuten für einen echten Schüler.
- Die Suche nach "Spiel" liefert fünf Seiten (Maschinelles Lernen, Robotik, Planen und Fehler, Stunde 2, KI in deinem Alltag) ohne Hinweis, warum sie passen. Ein Spiel ist nicht dabei. Das Labor dort heißt "Spielfeld" (Punkte setzen, KI rät die Farbe).
- Das Labor funktioniert: Leeres graues Feld, nach "Beispieldaten" erscheinen Punkte, ein Fingertipp zeigt "Der Punkt unter deinem Zeiger hat unter seinen 5 nächsten Nachbarn 1 Punkt in Blau, 2 in Orange ..." Mit "Entscheidungsfläche" werden die Zonen farbig. Das hat mir als Gamer gefallen (sofort Rückmeldung). Es fehlt aber ein Ziel (Aufgabe, Punkte, "Schaffst du es, ...").
- Das leere Feld am Anfang sagt nicht, was ich tun soll. Ich musste raten, dass ich tippen kann.
- Zweites Labor, "Bild": Seite "Wie ein Computer ein Bild sieht" (/bild-als-zahlen). Ein Pixel-Haus mit Zahlen, drei Bildquellen ohne Kamera (Haus, Farben, Himmel), Regler für Helligkeit und Rot/Grün/Blau. Läuft ohne Wartezeit. Gut. Die Seite hat aber 1084 Wörter und neun Abschnitte, bevor man zum Ende kommt.
- Drittes Labor, Kamera: Objekterkennung (/objekt). Kamera starten fragt zuerst einen langen Einwilligungsdialog ab (siehe unten). Mit der Fake-Kamera: Start bis Ergebnis 6,2 Sekunden, Antwort "Jetson hat es in 408 ms durchsucht. Gefunden: kein Objekt." Mit dem Testbild (grüner Kreis) ist "kein Objekt" korrekt, ich konnte die Erkennungsqualität nicht beurteilen.
- Sprachmodell-Chat (/chat), zwei Versuche mit 20 Sekunden Pause (Beispielfrage "Was ist ein Jetson?" und eigene Frage): beide Male Antwort nach 6,7 und 7,3 Sekunden: "[Dem Jetson fehlt gerade freier Speicher, um das Sprachmodell zu laden. Versuch es in einem Moment noch einmal.]" Der Chat lief also nicht. Vermutlich liegt das an der Last durch die parallelen Prüfer (zuvor Anzeige "Speicher 3,9 von 7,4 GB, Kein Modell im Speicher"), ich werte es nicht als Seitenfehler. Aber: Die Meldung steht in eckigen Klammern in einer Chat-Blase, wie eine Antwort der KI, und es gibt keinen "Nochmal"-Knopf. Ich wäre als Emre hier raus.
- Leere Eingabe im Chat: "Schreib zuerst eine Frage." in Orange unter dem Feld. Freundlich und klar.

### Aufgabe 2: Video, das erklärt, wie eine KI lernt. Gelöst, 0 Klicks nach der Seite.
Auf derselben Seite "Maschinelles Lernen" steht das Erklärvideo direkt unter den Lernzielen, ohne scrollen sichtbar. Länge 1:29, Untertitel standardmäßig an (Deutsch, 21 Einträge), Kapitelliste mit Sprungmarken (0:00 Programmieren oder Lernen, 0:14 Training, 0:28 Inferenz, 0:40 Drei Lernarten, 0:56 Falle Überanpassung, 1:11 Im Merkmalsraum). Kapitel "Training" angetippt: Video sprang auf 0:15. Funktioniert.
- Inhaltlich gut für mich: bunte Punkte, Kurven, kurze Sätze wie "Das Modell lernt die Trainingsbeispiele auswendig, statt das Muster zu verstehen."
- Das Ende: Das Video blendet zu fast schwarzem Bild aus, es kommt keine Einblendung "Weiter zu ...". Der Verweis "Der Verweis am Ende der Folge meint diese Seite: Unten stehen die Abschnitte ..." steht als kleine graue Zeile unter dem Video, 12 Pixel Schrift. Der Text dort ist unklar formuliert ("Verweis ... meint diese Seite").
- Kleiner Mangel: Der Titel des Videos ("Drei Lernarten") ist nicht das, was ich gesucht habe ("wie lernt eine KI"), es kommt aber im Video vor.
- Auf Seiten wie /chat und /objekt gibt es kein Video (49 von 76 Menüseiten haben eins, nicht jede Labor-Seite).
- Die Suche "wie lernt eine KI" gibt 27 Treffer, beginnt mit "Schule: Einstieg" und "Stunde 1: Was ist KI?". "Training" (das eigentliche "Wie ein Modell lernt") und "Maschinelles Lernen" stehen dort nicht oben. "Training" als Suchwort liefert dagegen "Training" an Platz 1. Gute Treffer hängen am richtigen Wort. Ergebnis zeigt nur Titel, keinen Auszug.

### Aufgabe 3: Quiz finden und machen. Gelöst, aber nur über Umwege auffindbar.
- Suche "Quiz" liefert nur 2 Treffer: "Dokumente befragen" (ein Betriebsbeispiel) und "Ist das sicher?". Im ersten steht erst im Chip "5 Quizfragen" und ganz unten "Teste dich". Meine Textsuche über alle 76 Menüseiten findet auf 54 Seiten ein Quiz. Die Suche kennt davon fast keine. Es gibt keine Übersicht "Alle Quiz".
- Auf der Seite "Wie ein Modell lernt" (/training) steht "Teste dich" ganz unten (Seite 9393 Pixel hoch). 5 Fragen mit je 4 Antworten, Antwort antippen, sofort grün/rot mit Erklärung ("Nicht ganz. Der Verlust ist die Fehlerzahl ... Wie die Entfernung zur Mitte beim Darts."). Nach der letzten Frage "1 von 5 richtig." Ich hatte absichtlich schnell und blind getippt (Messung, kein Schülerverhalten).
- Schwächen: Eine Antwort pro Frage, danach gesperrt (kein "Nochmal versuchen"). Zahl steht trocken da, kein Lob, kein Neustart. Bei zwei Fragen war die längste Antwort die richtige, das merkt ein Spieler schnell. Das Quiz am Seitenende wird nur sehen, wer die ganze Lektion scrollt.
- Zeit: Quiz selbst (5 Fragen) ca. 5 Sekunden im Skript. Echt vermutlich 1 bis 2 Minuten.
- Klicks vom Start bis Quiz auf /training über Suche "Training": Suche tippen, Treffer tippen, bis ans Ende scrollen (Scrollen ca. 9 Bildschirme), dann 5 Tipps. Das sind ca. 8 Aktionen plus langes Scrollen.

## 4. Textlastigste Stellen (Zusatzfrage 4)

1. Startseite: 1123 Wörter, 10.735 Pixel hoch. Rollenauswahl doppelt, dann Schulpfade, Betriebspfad, Lernpfade nach Stufe und nach Rolle, alle Bereiche, "Wenn du mehr willst". Für einen Schüler zu viel und zu gemischt.
2. Lektionsseiten: "Wie ein Modell lernt" 901 Wörter im Modus "Kurz lesen" (9393 Pixel), 1775 Wörter bei "Genau lesen" (11.700 Pixel). "Wie ein Computer ein Bild sieht" 1084 Wörter. Längste Absätze 45 bis 56 Wörter (z. B. "Training kostet Rechenzeit und damit Strom. Je größer das Mo..."). Positiv: Der Schalter "Kurz lesen / Genau lesen" ist da und "Mehr dazu" klappt Details zu.
3. Kamera-Einwilligungsdialog (Seite "Wie ein Computer ein Bild sieht", Knopf "Kamera starten"): sechs Textblöcke plus Link-Zeile, ca. 170 Wörter. Wichtig, aber für einen 14-Jährigen eine Wand. Den Satz "Nutzbar ab 16 Jahren. Jüngere nur mit Einverständnis der Eltern. Die Seite prüft dein Alter nicht." habe ich gelesen und verstanden, aber ein Knopf "Einverstanden" reicht, um weiterzumachen.

## 5. Bewertung nach dem Zehn-Punkte-Raster

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit fürs Alter | 6 | Lernziele und Quizerklärungen verständlich ("wie beim Darts"). Aber Wörter wie Inferenz, Merkmalsraum, Validierungsverlust, Gradientenabstieg stehen ohne Erklärung in der Kurzfassung. Absätze bis 56 Wörter. |
| 2 | Einstieg und Führung | 5 | Rollenfenster gut gemeint, danach kein Ziel. Rollenauswahl doppelt. "Neu hier" führt zu Lehrer- und Betriebstexten. Startseite 1123 Wörter. |
| 3 | Lernwirkung | 6 | Video und Spielfeld erklären "Training" und "Ähnlichkeit" gut. Ich könnte in drei Sätzen sagen: KI bekommt Beispiele, passt Zahlen an, und merkt sich bei zu viel Auswendiglernen Neues schlecht. Das Quiz sagt "1 von 5" ohne Weg zur Wiederholung. |
| 4 | Motivation und Spaß | 5 | Sofortige Rückmeldung im Punktefeld macht Spaß, Pixel-Haus und Videos sehen gut aus. Kein Spiel, keine Ziele, keine Punkte, kein "Schaffst du es". Für einen Gamer zu brav. |
| 5 | Labore und Interaktion | 5 | Spielfeld und Bild-Labor flüssig, ohne Wartezeit. Objekterkennung antwortet in 0,4 s. Chat zweimal nicht nutzbar wegen Speichermangel, mit unfreundlicher Meldung in Klammern. |
| 6 | Videos | 7 | 1:29 und 1:24 lang, Untertitel an, Kapitel springen, Tempo passend. Ende schwarz ohne Weiterführung, Verweiszeile klein und umständlich. 49 von 76 Seiten haben Video. |
| 7 | Navigation und Orientierung | 5 | Menü zugeklappt, Fortschritt oben. Aber keine Punkte "Spiele", "Videos", "Quiz" im Menü. Suche zeigt keine Auszüge, "Quiz" findet fast kein Quiz, "Fortnite" und "Cheat" liefern nichts (nur "Keine Seite gefunden."). Rolle ordnet das Menü nicht um. |
| 8 | Vertrauen und Sicherheit | 6 | Dialog ist ehrlich und vollständig (nichts gespeichert, bleibt im Browser, ab 16). Es gibt keine echte Altersbremse, ein Tipp reicht. Chip "ab 16" auf der Startseite sichtbar. Für mich als 14-Jähriger wirkt es wie jedes andere Cookie-Fenster. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Touch-Ziele meist groß (Quiz-Antworten, Knöpfe). 8 Elemente unter 44 Pixel Höhe, vor allem Glossar-Links ("künstliche Intelligenz" 22 Pixel, "Alles dazu in einfachen Worten" 18 Pixel). Schrift 17 Pixel Basis, Kontrast im dunklen Modus gut. Video-Zeilen klein (12 Pixel). |
| 10 | Fehlerfälle | 6 | Leere Eingabe: freundlich ("Schreib zuerst eine Frage."). Kamera abgelehnt ("Ohne Kamera weitermachen") sauber. Chat-Ausfall: Text hilft ein bisschen ("Versuch es in einem Moment noch einmal"), aber in Klammern wie eine KI-Antwort und ohne Knopf. Suche ohne Treffer nur "Keine Seite gefunden." ohne Vorschlag. |

Gesamtnote (ehrlicher Eindruck, nicht Mittelwert): **5,5 von 10**. Als Schüler hätte ich vermutlich nach 3 bis 5 Minuten aufgehört, wenn mir das Spielfeld oder das Video nicht aufgefallen wären. Wer sie findet, bekommt gute Sachen. Gefunden werden sie aber nur durch Glück oder die richtige Suchwort-Wahl.

## 6. Zusatzfragen

1. Rolle gewählt. Ich erwartete, dass es mich zu einem ersten Ding schickt. Passiert: Fenster zu, kleines Chip oben, Startseite unverändert mit denselben Rollen noch einmal.
2. Menü: 12 Gruppen, auf der Startseite 1 sichtbarer Punkt, auf Lektionsseite 12 Punkte. Erwartet hätte ich: Ausprobieren, Videos, Quiz, Wie lernt KI, Ist das sicher. Nie anklicken: Business, KI im Betrieb, RAG, Der Rechner dahinter.
3. Aufgaben: 1 gelöst über Maschinelles Lernen (kein Spiel, aber ein Labor, ca. 6 Tipps), 2 gelöst auf derselben Seite (0 Klicks, 1:29), 3 gelöst nur über Umwege (ca. 8 Aktionen plus langes Scrollen, Suche "Quiz" hilft kaum). Gesucht habe ich im Suchfeld, nicht im Menü.
4. Textlastigste Stellen: Startseite, Lektionsseiten (Training, Bild als Zahlen), Kamera-Einwilligungsdialog.
5. Empfehlung: Ja, mit Einschränkung, an Mitschüler, die neugierig sind und nicht nur spielen wollen. Zwei Sätze: "Hier kannst du KI mit Punkten und Bildern selbst ausprobieren und es gibt kurze Videos, kostenlos und ohne Anmeldung. Such nach dem Thema (zum Beispiel Training), nicht über die Startseite." Als Lernplattform für alle Schüler noch nicht, weil man sich ohne Anleitung verläuft.

## 7. Was hat mich gefreut

- Spielfeld: Sofortige Reaktion beim Tippen, "Entscheidungsfläche" färbt die Zonen. Fühlte sich an wie ein Mini-Spiel.
- Video auf "Maschinelles Lernen" sichtbar ganz oben, kurz (1:29), Untertitel an, Kapitel zum Anspringen.
- Quiz-Rückmeldung mit Beispiel ("wie beim Darts"), sofort, ohne Wartezeit.
- Pixel-Haus im Bild-Labor, mit Regler und ohne Kamera.
- "Kurz lesen / Genau lesen" und "Mehr dazu": Ich entscheide, wie viel Text ich will.
- Ladezeit: Startseite in ca. 0,5 s geladen (43 Anfragen, 1,2 MB), Seiten in rund 1 s.

## 8. Was hat genervt

- Rollenfenster, dann dieselbe Rollenauswahl noch einmal direkt auf der Seite.
- "Neu hier" zeigt Lehrer- und Betriebstexte, obwohl ich Schüler gewählt habe.
- Es gibt kein Spiel, keine Punkte, kein Ziel. Nur Reglerchen und Texte.
- Quiz am Seitenende, nach 9400 Pixel Text. Suche "Quiz" findet es nicht.
- Chat: Fehlermeldung in eckigen Klammern wie eine KI-Antwort, kein Knopf zum Wiederholen.
- Einwilligungsdialog: viel Text, ein Tipp auf "Einverstanden" genügt, obwohl "ab 16" dasteht.
- Video endet im Schwarzen ohne Weiterführung.
- Suchtreffer ohne Auszug, "Spiel" und "Fortnite" liefern keine sinnvollen Treffer.

## 9. Die drei größten Lücken Richtung Eins-A

1. Eine klare Spur für Schüler: Nach der Rollenwahl direkt zu "Dein erster Versuch" (Spielfeld) springen, Rollenauswahl nicht doppelt zeigen, "Neu hier" nach Rolle filtern.
2. Ausprobieren, Videos und Quiz als eigene, sichtbare Einstiege (Menü, Startseite, Suche mit Auszügen und Typ-Symbol), plus Quiz weiter oben oder als Sprung-Knopf, und ein Quiz-Ende mit Wiederholung.
3. Weniger Text pro Seite in der Kurzfassung (Fachwörter erklären oder weglassen, Absätze unter 25 Wörter, Einwilligungsdialog auf drei Zeilen) und freundlichere Fehlerfälle (Chat-Ausfall als eigene Meldung mit Knopf "Nochmal versuchen").

## 10. Einschränkungen

- Fake-Kamera zeigt nur einen grünen Kreis, die Erkennungsqualität der Kamera-Labore konnte ich nicht prüfen.
- Chat und damit Sprachmodell-Antwort nicht gesehen (Speichermangel beim Jetson während der Prüfrunde).
- Zeiten für echte Schüler sind Schätzungen, gemessen sind nur Ladezeiten, Antwortzeiten der Labore und Skriptlaufzeiten.
- Es wurden nur wenige Lektionen von Hand angesehen (Start, Maschinelles Lernen, Training, Bild als Zahlen, Fünf Fragen an ein Bild, Objekterkennung, Chat, Dokumente befragen). Die Zahl der Quiz- und Videoseiten stammt aus einem automatischen Durchlauf über alle 76 Menüseiten (Textsuche, grob).
