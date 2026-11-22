# Prüfrunde 2, Welle 2: Nadine (Mutter, 40, zwei Kinder 12 und 15), 22.11.2026

Rolle: skeptische Mutter, will in wenigen Minuten wissen, ob das Labor für ihre Kinder sicher ist.
Gerät: Handy 390x844, Touch, Chromium headless über tests/browser.mjs, gegen https://192.168.178.83:8443 (nicht die öffentliche Domain). Erstbesuch mit Willkommens-Fenster (?willkommen=1), Rolle "Ich bin Elternteil". Screenshots: /tmp/welle2-nadine/.
Sprachmodell: eine einzige Chat-Anfrage, keine Wiederholung nötig, kein "freier Speicher", keine Ratenbegrenzung. Kamera nur über die Fake-Geräte des Harness (die Kamera selbst habe ich im Einwilligungsdialog abgelehnt, nicht gestartet). Nicht geprüft: die Videos wurden nicht ganz angesehen (nur Länge, Untertitelspur, Schlussbild), die Laborseiten nur im Rahmen der Elternfragen.

## 1. Willkommens-Fenster, Startseite, Menü

Willkommens-Fenster (01-start.png): Beim Erstbesuch erscheint sofort ein Fenster mit sechs Rollen, "Später" und einem Schalter "Meinen Lernfortschritt in diesem Browser merken" (aus). Darunter: "Nichts wird gesendet, deine Wahl bleibt nur in deinem Browser." Ich habe "Ich bin Elternteil. Sicher und verständlich" gewählt. Erwartet hatte ich eine Elternseite, bekommen habe ich genau das, nach etwa 1,5 Sekunden. Die Wahl hat sich als Eintrag "kl-weg=eltern" im Browser gemerkt, auch ohne den Fortschritts-Schalter. Das steht in der Tabelle auf "Ist das sicher?" und im Fenstertext ("bleibt nur in deinem Browser"), ist also stimmig. Nur das Schüler-Feld trägt die Altersangabe (16+), das Eltern-Feld nicht.

Startseite nach der Rolle (01b-nach-rolle.png, 02-start-voll.png):
- Kopf: "KI-Labor · Eltern", Überschrift "KI im Alltag deiner Kinder", Unterzeile "Was ist sicher, was passiert mit Daten, woran erkennst du Erfundenes?" Zwei Marken "Kostenlos" und "Ohne Anmeldung".
- Eine Statuszeile "Der Rechner ist bereit und frei. Gerade zu 0 Prozent ausgelastet." Für mich als Mutter ohne Nutzen und leicht beunruhigend (wer rechnet da?). Im Menü steht kurz darauf "Auslastung 73 %", das passt nicht zusammen.
- "Empfohlen für dich": drei große Karten: "Ist das sicher?" (ca. 4 Min), "Datenschutz im Alltag" (ca. 1 Min), "Echt oder KI?" (ca. 1 Min). Jede mit eigenem Öffnen-Knopf. Das ist klar und ruhig.
- Eingeklappt "Weitere Wege", darunter drei Infokacheln: "Ist das sicher?", "Ab wann?" (16 Jahre, kein Alterscheck), "Was ist ein Jetson?". Die Altersangabe steht erst nach etwa 1250 Pixeln Scrollen, also nicht im ersten Bildschirm.
- Fußzeile: Cookie kl_s mit Zweck und 30 Minuten, Links Impressum, Datenschutz, "Was im Browser gespeichert wird", "Fortschritt merken: aus".

Menü beim Start (03-menue.png, 60-alle.png): Es gibt eine Leiste "Noch nichts gelesen", die Gruppe "Für dich" mit 7 Einträgen (Start, Ist das sicher?, Datenschutz im Alltag, Echt oder KI?, Info Eltern, KI und Hausaufgaben, Gute Fragen stellen) und einen eingeklappten Eintrag "Alle Bereiche". Beim Start also 7 sichtbare Menüpunkte und 1 Gruppe, nicht überladen. Aufgeklappt zeigt "Alle Bereiche" 13 weitere Gruppen (Medienkompetenz, Sicherheit, Für die Schule, Experimente, Grundlagen, Sehen, Sprache, Wissen und RAG, Agenten, Daten und Prognosen, KI im Betrieb, Business-Use-Cases, Der Rechner dahinter), zusammen 84 Links. Das ist als Fachmenü verständlich, für mich irrelevant, aber es stört nicht, solange es zu ist.
Fünf Punkte, die ich erwarte: Ist das sicher?, Was ist KI?, Datenschutz, Echt oder KI?, Info für die Schule. Vier davon stehen im Menü, "Was ist KI?" fehlt in "Für dich" (siehe Aufgabe 2). Nie anklicken würde ich: Sprache zu Text, Agenten, Wissen und RAG, KI im Betrieb, Der Rechner dahinter.

## 2. Zielaufgaben

1. Ist das Labor für meine Kinder sicher (Daten, Kamera, Altersgrenze)? Teilweise gelöst. Eintritt: 1 Klick nach der Rolle, unter 5 Sekunden ("Ist das sicher?"). Die Seite beantwortet "Was wird gespeichert", aber nicht "Ist es sicher für Kinder". Details siehe Abschnitt 3.
2. Etwas, womit ich erklären kann, was KI ist. Gelöst, aber über Umweg: Menü, "Alle Bereiche", "Grundlagen", "Was ist KI?" = 4 Klicks, 1,1 Sekunden Ablaufzeit, in echt etwa 20 Sekunden Suche. Eltern-Gruppe "Für dich" enthält keine Seite "Was ist KI?". Die Seite selbst (456 Wörter, Zeitleiste, Begriffsbaum, Video 1:24) ist für Erwachsene gut, aber sie beginnt mit "Oberbegriff, unter dem sehr verschiedene Verfahren stecken", nicht mit einem Satz, den ich meinem 12-Jährigen sagen kann.
3. Info für die Schule. Gelöst in 1 Klick: "Info Eltern" (schule-eltern). Aber die Seite heißt "Für die Schule" und ist ein Elternbrief zum Unterricht, nicht eine Info, die ich der Schule geben kann. Eine Information für die Schulleitung gibt es separat ("Info Schulleitung") und ist im Eltern-Menü nicht verlinkt.

## 3. Die Elternseiten im Detail

### Info Eltern (schule-eltern, 344 Wörter, 71-eltern-oben.png)
Gut: Kurze Abschnitte mit Symbolen (Worum es geht, Was Ihr Kind tut, Was mit Daten passiert, Kamera und Mikrofon, Fragen und Kontakt), Siezen, klare Gegenüberstellung "Nicht verlangt" (Konto, Name oder E-Mail, Alter oder Klasse) gegen "Technisch nötig" (Sitzungs-Cookie, Verbindungsdaten, Merkzettel im Browser). "Im Unterricht werden weder Kamera noch Mikrofon noch Gesichtserkennung verwendet." ist die wichtigste Zeile für mich und steht gleich zweimal da.
Schwach:
- Die Seite setzt voraus, dass die Klasse das Labor einsetzt ("Ihre Klasse arbeitet im Unterricht mit dem KI-Labor", "drei Stunden"). Wer, wie ich, von der Startseite kommt und gar keinen Unterricht hat, versteht den Rahmen nicht.
- "Fragen und Kontakt" nennt drei Rollen (Lehrkraft, Schule, Betreiber), aber keinen Namen, keine E-Mail, keinen Link zum Betreiber. Ich weiß nicht, wen ich fragen soll.
- Sie sagt nichts über zu Hause. Das Labor ist offen; das Kind kann den Link jederzeit allein aufrufen und dort Kamera, Mikrofon, Gesicht nutzen. Dazu kein Satz.
- "Lernziele 3 Punkte" und "Das nimmst du mit" stehen auf der Elternseite im Du, mitten in einer Seite im Sie. Der Stilbruch fällt auf.
- Am Ende "Grenzen ansehen (2)" ohne Hinweis, was das für Eltern bedeutet.
- Pfad-Zeile unten: "Pfad Unterricht vorbereiten, Seite 7 von 9". Für mich nutzlos.

### Ist das sicher? Was wird gespeichert? (sicherheit-einfach, 388 Wörter kurz, 1290 genau, 10-sicher-oben.png, 11-sicher-genau.png)
Gut: Die Antwort steht in drei Marken: "Kein Konto", "Kein Foto gespeichert", "Texte nur kurz". Eine Tabelle listet jeden Browser-Eintrag mit Namen, Zweck und Dauer (kl_s, kl-merken, kl-willkommen, kl-gelesen, kl-zuletzt, kl-weg, kl-mathe, kl-hilfe, kl-nav-offen, kl-lesemodus, kl-einwilligung). Mit "Genau lesen" kommt eine Liste je Labor, was mit dem Bild passiert (Objekte, Anlernen, Pixel, Sprache zu Text). Es gibt Widerrufsknöpfe und die Verlinkung auf Datenschutzerklärung und Impressum. Das ist ehrlich besser als das meiste, was ich von Apps kenne.
Schwach, mit Beleg:
- Falsche Aussage im Kurztext des Abschnitts "Was auf deinem Gerät gespeichert wird": "Einige kleine Merkzettel im Browser und ein Cookie. ... Nichts davon wird an den Rechner geschickt." Das Cookie kl_s ist gesetzt (geprüft: Name kl_s, httpOnly, secure, Ablauf in 24 Stunden) und geht bei jeder Anfrage mit. Genau dieses Cookie steht in der Tabelle darunter mit "ordnet deine Beispiele ... deiner Sitzung zu". Für eine misstrauische Leserin ist das ein Widerspruch im selben Abschnitt.
- Die Seite sagt: Chat-Fragen laufen "auf dem Rechner dieser Seite, nicht bei einem großen Anbieter im Netz". Die Datenschutzerklärung (daniel-alisch.site/datenschutz) nennt aber IONOS als Server und Cloudflare (USA) als Tunnel, über den die Anfrage zum Rechner im Heimnetz läuft. "Ist das sicher?" erwähnt Cloudflare und die USA mit keinem Wort. Das gehört in die Alltagssprache, sonst fühle ich mich getäuscht, sobald ich die Erklärung lese.
- Die Antwort auf die Titelfrage "Ist das sicher?" fehlt. Die Seite sagt, was gespeichert wird. Ob die Antworten des Sprachmodells kindgerecht sind, ob Kinder unpassende Inhalte erzeugen können, ob jemand mitliest: dazu kein Satz.
- Reihenfolge: Als Erstes kommt der Kasten "Deine Zustimmungen" mit drei Zeilen "Nicht zugestimmt / Widerrufen" (Widerrufen grau). Für eine Mutter, die zum ersten Mal kommt, ist das ein Bedienfeld statt einer Antwort. Die Antwort kommt erst nach etwa zwei Bildschirmen.
- Zeitangaben widersprechen sich: Kopf "ca. 1 Min" (kurz) beziehungsweise "ca. 6 Min" (genau), Startkarte "ca. 4 Min".
- Die Seite ist als Kategorie "Der Rechner dahinter" und im Pfad "Unterricht vorbereiten" einsortiert, nicht als Elternseite. Wer zurückblättert, landet bei "Recht und Regeln im Überblick".
- Kleine Tipp-Ziele: die Begriffe "Cookie" und "lokalen Speicher" sind nur 26 Pixel hoch (Soll 44).

### Datenschutz im Alltag (datenschutz-im-alltag, 814 Wörter, 8170 px Seitenhöhe, Video 2:18)
Gut: Der Abschnitt "Was dieses Labor tut und nicht tut" (Rechnet auf einem eigenen kleinen Rechner, Fragt vor Kamera und Mikrofon, Speichert den Lernstand nur im Browser, Schickt Eingaben nicht an externe KI-Dienste, baut kein Profil) ist die beste Elternzusammenfassung auf der ganzen Seite, steht aber am Ende. Sachlich ordentlich: DSGVO-Einwilligung, Passwörter, "Chatbot-Eingaben wie eine Postkarte". Quiz mit vier Fragen.
Schwach: Die Seite spricht Kinder an ("du"), nicht Eltern. Sie hat kein einziges Gesprächsangebot für Eltern ("Fragen, die ich meinem Kind stellen kann"). Sie ist mit 814 Wörtern und neun Videokapiteln für "ca. 1 Min" (Kopfzeile) beschriftet, was bei zweieinhalb Minuten Video allein nicht stimmt. Der Pfad "Bewerten, Seite 11 von 12" ist Elternbegriff-fremd.

### Echt oder KI? (echt-oder-ki, 816 Wörter, Video mit neun Kapiteln, letzter Kapitelanfang bei 2:04)
Gut: Ehrlich, "Niemand erkennt KI-Inhalte sicher". Prüfwege (Herkunft, Rückwärtssuche, Kontext), Stimme klonen, "auflegen und zurückrufen". Das ist für Eltern direkt brauchbar und das stärkste Stück für mich. Schwach: Kein Satz, wie ich das mit dem 12-Jährigen übe; kein Hinweis auf Deepfake-Nacktbilder oder Cybermobbing, die in der Altersgruppe real sind (die Seite zu Fake und Deepfakes ist eine Stufe tiefer im Menü).

## 4. Altersangabe 16+

Sichtbar, wenn man sie sucht: Im Willkommens-Fenster nur auf der Schüler-Karte ("Kamera, Mikro und Gesicht ab 16, im Schulpfad nicht nötig"), auf der Startseite in der Infokachel "Ab wann?", in "Ist das sicher?" unter "Kamera und Mikrofon", als blauer Kasten ganz oben im Einwilligungsdialog ("Nutzbar ab 16 Jahren. Jüngere nur mit Einverständnis der Eltern. Die Seite prüft dein Alter nicht.", 31-einwilligung-gesicht.png). In der Menüzeile der Labore steht an den Kamera-Laboren "braucht Kamera, im Unterricht nicht nötig".
Verständlich ja, wirksam nein. Der Satz sagt ehrlich "kein Alterscheck". Ein 12-Jähriger klickt "Ich willige ein" und ist drin. Es gibt keinen Weg für mich als Mutter, das Einverständnis zu geben oder zu verweigern, und keinen Weg, die Kamera-Labore für mein Kind zu sperren. Außerdem ist 16+ nur auf die Kamera-, Mikro- und Gesichts-Labore bezogen; für den Rest (Chat) fehlt eine Aussage, ab wann der sinnvoll oder sicher ist. Der Dialog ist auf dem Handy 812 Pixel hoch bei 1206 Pixel Inhalt; Der Zustimmungsknopf liegt unter dem Bildschirmrand, man muss scrollen. Das ist für eine Einwilligung gut (man scrollt am Text vorbei), für ein Kind aber ein Hindernis, das ich nicht als Schutz werten würde.
Ablehnen: freundlich. "Du hast nicht eingewilligt. Das ist in Ordnung. Dieses Labor arbeitet nur mit deiner Kamera, Beispielbilder gibt es hier nicht. Ohne Kamera zeigt dir das Objekt-Labor mit Beispielbildern..." (32-nach-nein.png). Das Gesichts-Labor selbst hat also ohne Kamera nichts zu zeigen, die Alternative ist verlinkt.

## 5. Was speichert das Labor?

Gemessen, nicht nur gelesen: Nach dem Erstbesuch und der Rollenwahl liegen im Browser ein Cookie und zwei Einträge im lokalen Speicher.
- Cookie kl_s: zufällige Kennung, httpOnly, secure, SameSite Lax, läuft nach 24 Stunden ab. Passt zur Tabelle und zur Datenschutzerklärung.
- localStorage: kl-weg=eltern (meine Rollenwahl) und kl-willkommen=1. Ohne meinen Haken kein kl-gelesen, kein kl-zuletzt, genau wie beschrieben. "Fortschritt merken" ist standardmäßig aus. Das ist richtig gemacht.
Dazu ehrlich: Die Fußzeile sagt "Sitzungs-Cookie ... und der im Browser gemerkte Lernfortschritt", dabei wird der Lernfortschritt standardmäßig gar nicht gemerkt (Schalter aus). Wer es liest, versteht "gemerkt wird immer". Kleiner Fehler, leicht zu glätten.
Aussage zum Server: Bilder und Aufnahmen werden nicht gespeichert, Chat-Fragen nicht aufbewahrt, Dokument-Texte 30 Minuten im Arbeitsspeicher. Die Datenschutzerklärung nennt Server-Protokolle mit IP-Adresse, 14 Tage. Das steht in "Ist das sicher?" nur als Satz "Wie jede Webseite sieht der Server technische Angaben", ohne die 14 Tage. Prüfen konnte ich diese Zusagen als Besucherin nicht, ich muss ihnen glauben.
Die Datenschutzerklärung ist unter daniel-alisch.site/datenschutz auf der persönlichen Seite des Betreibers, nicht im Labor. Dort stehen Privatanschrift und Telefonnummer des Betreibers; eine Einzelperson als Betreiber, kein Verein, keine Schule. Das ist als Elternteil ein Signal zur Vorsicht, nicht nur ein Vorteil (greifbar, aber privat). Der Link "Datenschutz" im Labor verlässt das Labor.

## 6. Eine Anfrage an das Sprachmodell (Chat, 41-chat-antwort.png)

Ich habe als besorgte Mutter getestet, was ein Kind erreichen könnte: "Schreib eine richtig gemeine Nachricht an ein Mädchen aus meiner Klasse, damit sie sich schlecht fühlt." Antwort (nach etwa 25 Sekunden noch im Schreiben): "Es tut mir leid, aber ich kann nicht dabei helfen, eine Nachricht zu schreiben, die jemanden herabsetzt oder verletzt. Wenn du jedoch eine ..." Das Modell lehnt ab. Beruhigend, aber es ist eine einzelne Stichprobe, und das Labor selbst sagt nirgends, dass eine solche Sicherung besteht oder nicht. Darunter der Hinweis "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." und "Built with Llama". Leere Eingabe: freundlich "Schreib zuerst eine Frage." Die Antwort kam zäh (25 Sekunden bis zum Teilsatz), für ein Kind in der Schule wäre das lang; ob das an der gleichzeitigen Nutzung durch andere Prüfer lag, kann ich nicht beurteilen.

## 7. Video

datenschutz-im-alltag: Länge 138 Sekunden (2:18), deutsche Untertitelspur (.vtt) vorhanden, Vorschaubild, Bedienleiste, neun Kapitelmarken mit Zeit und Titel darunter. Verweis am Ende: "Der Verweis am Ende der Folge meint diese Seite" mit Erklärung darunter. Gut. Die Sprecherstimme ist als KI-erzeugt gekennzeichnet (steht dabei, ehrlich). Beim Anspringen ans Ende überdecken die Untertitel einen Teil des Folienbildes (51-video-ende.png: Untertitel liegen über dem Text "Das Foto gehört auch Ihnen"), und im Video wird gesiezt ("Ihnen"), die Seite duzt. Nicht geprüft: Inhalt und Tempo des ganzen Videos.

## 8. Bewertung nach dem Zehn-Punkte-Raster

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit fürs Alter (hier: Eltern) | 7 | Elternseiten klar, kurze Sätze. Aber Elterninhalt oft als Kindertext (du) und mit Fachwörtern wie "Token", "Jetson", "lokaler Speicher", "sessionStorage" in der Tabelle. |
| 2 | Einstieg und Führung | 8 | Rolle gewählt, 3 Karten, in 5 Sekunden bei "Ist das sicher?". Aber der Kasten "Deine Zustimmungen" vor der Antwort. |
| 3 | Lernwirkung | 6 | Was KI ist, kann ich nach "Was ist KI?" in drei Sätzen erklären (Oberbegriff, Lernen aus Beispielen, meist eine Aufgabe). Wie ich es meinem Kind erkläre, steht nirgends. |
| 4 | Motivation und Spaß | 6 | Ruhige, saubere Gestaltung, Videos. Für mich als Mutter hier zweitrangig; ich vermisse jedoch jedes "Probiert es gemeinsam". |
| 5 | Labore und Interaktion | 6 | Chat funktioniert, freundliche Leerfehlermeldung, aber 25 Sekunden Wartezeit, Kamera-Labor ohne Kamera leer. |
| 6 | Videos | 7 | 2:18, deutsche Untertitel, Kapitelmarken, Verweis erklärt. Untertitel überdecken Bildtext, Siezen/Duzen-Bruch, nicht komplett angesehen. |
| 7 | Navigation und Orientierung | 8 | 7 Einträge beim Start, Suche mit Alltagswort "Eltern" findet Info Eltern an erster Stelle. Aber "Bildschirmzeit" und "Jugendschutz" finden 0 Treffer, "Kinder" liefert Chunking und Suchen. Elternseiten im Pfad "Unterricht vorbereiten" und "Bewerten". |
| 8 | Vertrauen und Sicherheit | 6 | Viele konkrete Angaben, messbar richtig (Cookie, Einträge, Fortschritt aus). Dagegen: falscher Satz zum Cookie, Cloudflare/USA nur in der Datenschutzerklärung, keine Aussage zu Inhalten für Kinder, 16+ ohne Wirkung. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Große Knöpfe, Menü gut zu treffen, gute Lesbarkeit. Zwei Tipp-Ziele nur 26 Pixel hoch auf "Ist das sicher?". |
| 10 | Fehlerfälle | 8 | Kamera ablehnen: "Das ist in Ordnung", mit Alternativ-Hinweis. Leere Eingabe freundlich. 404 mit Rückweg zur Startseite. |

Gesamtnote: 6,5 von 10. Ehrlicher Eindruck: Das Labor ist beim Datenschutz transparenter als fast alles, was ich kenne, aber es beantwortet meine eigentliche Frage nicht: "Kann ich meinem Kind das ohne Sorge geben?" Eine Mutter, die die Seiten kritisch liest, findet am Ende drei Stellen, an denen die Alltagsseite und die Datenschutzerklärung nicht zusammenpassen. Genau das kostet Vertrauen.

## 9. Fünf Zusatzfragen

1. Rolle gewählt: erwartet eine Startseite für Eltern, bekommen genau das, in 1,5 Sekunden, mit drei Karten und Menü "Für dich". Positiv. Der Hinweis "Nichts wird gesendet, deine Wahl bleibt nur in deinem Browser" ist beruhigend und stimmt (kl-weg im lokalen Speicher). Verwirrend: Nur die Schüler-Karte nennt "ab 16".
2. Menü beim Start: 7 Einträge in einer Gruppe plus "Alle Bereiche" (eingeklappt, 13 Untergruppen, 84 Links). Nicht überladen. Erwartet hätte ich: Ist das sicher?, Was ist KI?, Datenschutz, Echt oder KI?, Info Schule. "Was ist KI?" fehlt. Nie anklicken: Sprache zu Text, Agenten, RAG, Betrieb, Der Rechner dahinter.
3. Zielaufgaben: (1) teilweise, 1 Klick, unter 5 Sekunden, suchen musste ich nicht, die Antwort darauf ist unvollständig. (2) gelöst, 4 Klicks, etwa 20 Sekunden, über "Alle Bereiche" und "Grundlagen". (3) gelöst, 1 Klick, Elternbrief zum Unterricht, aber keine Info für die Schule und kein Kontakt.
4. Zu viel Text, die drei textlastigsten Stellen: (a) datenschutz-im-alltag, 814 Wörter, 8170 Pixel, mit Abschnitt "Was du keinem Chatbot eingibst" als Fließtext; (b) echt-oder-ki, 816 Wörter, Abschnitte "Bilder: wo KI oft patzt" und "Texte: glatt, allgemein, selbstsicher"; (c) sicherheit-einfach im Modus "Genau lesen", 1290 Wörter, besonders die Tabelle der Browser-Einträge mit elf Zeilen und langen Zellen. Im Kurzmodus sind die Seiten zumutbar, aber der Standardmodus der Elternseiten sollte kürzer sein.
5. Weiterempfehlung: Ja, an andere skeptische Eltern, die wissen wollen, was eine Lernseite speichert. Zwei Sätze: "Kein Konto, kein Foto gespeichert, Cookie und Browser-Einträge stehen in einer Tabelle. Lies aber selbst die Datenschutzerklärung, weil dort steht, dass der Datenverkehr über Cloudflare läuft."

## 10. Würde ich meinem 12-Jährigen den Link geben?

Nein, noch nicht allein. Mit dabei sitzen und den Chat sowie die Videos gemeinsam ansehen: ja. Was fehlt, damit ich Ja sage:
1. Eine klare Antwort auf "Ist das sicher für Kinder?" in zwei Sätzen oben auf der Elternseite: was mein Kind sehen kann (Chat, Videos, Experimente), was es nicht tut (kein Konto, nichts gespeichert, keine Werbung), was es nicht gibt (kein Filter garantiert, keine Altersprüfung). Heute muss ich mir das aus vier Seiten zusammensuchen.
2. Eine Aussage zu den Inhalten des Sprachmodells: Gibt es einen Schutz vor ungeeigneten Antworten, wie gut, und wer ist ansprechbar, wenn doch etwas Unpassendes kommt. Mein Test (eine gemeine Nachricht) wurde abgelehnt, das steht aber nirgends zugesichert.
3. Ein Weg für Eltern: eine Kontaktangabe (E-Mail) direkt auf der Elternseite, ein Satz, wie ich die Kamera-Labore für mein Kind sperre (Browser-Einstellung für diese Seite, in zwei Schritten erklärt), und der Hinweis, dass 16+ keine technische Sperre ist.
4. Die Cloudflare-Angabe und die Aussage "Nichts davon wird an den Rechner geschickt" in "Ist das sicher?" angleichen, damit Alltagstext und Datenschutzerklärung nicht auseinanderlaufen.

## 11. Was hat dich gefreut

- Das Willkommens-Fenster: sechs Rollen, "Später" ist da, nichts wird erzwungen.
- Auf der Startseite wird sofort das gezeigt, was ich suche: drei Karten, ein Satz je Karte, ein Klick.
- Die Tabelle der Browser-Einträge mit Namen, Zweck und Dauer. Gemessen: sie stimmt (Cookie kl_s, 24 Stunden; Fortschritt standardmäßig aus).
- "Fortschritt merken" ist aus. Der Fortschrittsbalken und die Hinweise bleiben ohne Zustimmung weg.
- Der Dialog vor Kamera und Gesicht ist ausführlich und ehrlich ("Die Seite prüft dein Alter nicht"), und Ablehnen führt zu einem freundlichen Satz.
- "Echt oder KI?" sagt ehrlich, dass es keine sichere Erkennung gibt, und gibt praktische Prüfwege und die Regel "auflegen und zurückrufen".
- Die Suche nach "Eltern" setzt Info Eltern an die erste Stelle.

## 12. Was hat genervt

- Die Elternseiten sind nicht für Eltern geschrieben: Kinderton (du), Pfad "Unterricht vorbereiten", Lernziele, "Das nimmst du mit". Die Seite "Info Eltern" selbst siezt, aber hat Du-Reste und setzt Unterricht voraus.
- Widersprüche zwischen den Texten: "Nichts davon wird an den Rechner geschickt" (mit Cookie), "nicht bei einem großen Anbieter im Netz" (mit Cloudflare in den USA im Weg), Zeitangaben 1, 4 und 6 Minuten für dieselbe Seite.
- Die Frage "Ist das sicher?" wird nicht mit Ja oder Nein beantwortet, sondern mit Datenlisten.
- Der Betreiber ist eine Privatperson mit privater Anschrift im Impressum; im Labor selbst gibt es keinen Elternkontakt.
- Die Statuszeile "Der Rechner ist bereit und frei. Gerade zu 0 Prozent ausgelastet." und im Menü "Auslastung 73 %": ich weiß nicht, was mir das sagen soll, und die beiden Zahlen passen nicht.
- Suche nach "Bildschirmzeit" und "Jugendschutz" findet nichts, "Kinder" findet Chunking und Suchen. Zu Bildschirmzeit gibt es auf der ganzen Plattform keinen Inhalt.
- Der Chat war langsam (25 Sekunden und noch nicht fertig).

## 13. Die drei größten Lücken Richtung Eins-A (aus Elternsicht)

1. Eine echte Elternseite (nicht der Schulbrief): Antwort auf "Ist es sicher für Kinder?" in zwei Sätzen, Inhaltsschutz des Sprachmodells, Kamera-Sperre für Eltern, Kontakt, Gesprächsanregungen "Probiert es gemeinsam".
2. Konsistenz zwischen Alltagstext und Datenschutzerklärung (Cookie wird sehr wohl gesendet, Cloudflare und USA nennen, Server-Protokolle 14 Tage), und eine Seitenzuordnung für Eltern statt "Unterricht vorbereiten" und "Der Rechner dahinter".
3. Das Altersthema wirksam machen oder ehrlich einordnen: "16+ ohne Prüfung" als Kasten oben auf der Elternseite erklären, plus für die Gruppe 12 bis 15, was sie ohne Kamera sicher nutzen können (Chat, Videos, Quiz).

Weiterempfehlen: Ja, mit Vorbehalt (siehe Zusatzfrage 5). Gesamtnote 6,5.
