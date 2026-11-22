# Prüfrunde 2: Schülerin Klasse 10 (Leyla, 15, Handy 390 x 844, Touch)

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443, Chromium mit Mobil-Emulation (Touch, iPhone-Kennung), Kamera und Mikrofon nur über Fake-Geräte. Screenshots liegen in /tmp/runde2-klasse10/ (Nummern 01 bis 32). Keine Ratenbegrenzung aufgetreten. Eine Sprachmodell-Anfrage nach der anderen, jeweils mit Wartezeit.

Ehrlich vorweg, was ich nicht geprüft habe: Videos habe ich nicht mit Ton angesehen, sondern Dauer, Untertitel-Spur, Kapitelliste, Ende und Verweis geprüft (Sprung ans Ende, Abspielen der letzten Sekunden). Den Lernfortschritt (gemerkte Seiten) habe ich nicht bedient. Das Quiz habe ich nur mit zwei Fragen durchgespielt.

## Beobachtungen (Schritt, Seite, Erwartung, Ergebnis)

| Nr. | Schritt und Seite | Erwartung | Ergebnis |
|---|---|---|---|
| 1 | Startseite /, erster Bildschirm (01-start.png) | In 30 Sekunden wissen, was ich tun soll | Große Überschrift "KI verstehen, indem du sie ausprobierst", Knopf "Neu hier? Hier anfangen" klar sichtbar. Gut. Danach aber gleich "Für Entscheider: in 15 Minuten": das gilt nicht für mich und lenkt ab. |
| 2 | Startseite, "Kamera nur mit deiner Zustimmung" | Altersangabe sehen | Keine Altersangabe auf der Startseite. Das Wort "16" kommt auf der ganzen Startseite nicht vor (geprüft per Textsuche). |
| 3 | Tipp auf "Neu hier? Hier anfangen" | Neue Seite mit Schritt 1 | Die URL bleibt /, die Seite scrollt nur zum Abschnitt "So fängst du an". Verwirrend: ich habe erst gedacht, es passiert nichts. Erst "Verstehen, was KI ist" öffnet wirklich die Seite. |
| 4 | Startseite: "Der Rechner ... Jetson" | Verstehen, was der Jetson ist | "Jetson" steht schon im ersten Absatz der Lernpfad-Karten, erklärt wird er erst ganz unten ("Was ist ein Jetson?"). Für mich ein unbekanntes Wort. |
| 5 | Menü (03-menue.png) | Seite finden | 10 Gruppen, klar, große Tippflächen. Gut. Die Gruppe "Business-Use-Cases" und "KI im Betrieb" sind für meine Welt uninteressant. |
| 6 | /karte "Was ist KI?" (04, 05) | Lernseite Grundlagen | Gut aufgebaut: Video, Zeitstrahl, "Das nimmst du mit". Tipp "Genau lesen" macht die Seite länger (5278 auf 6117 px). Der Satz "Du liest gerade kurz ... Unterstrichene Begriffe mit ? kannst du antippen" ist ein Textblock, den ich überspringe. |
| 7 | /karte Video (06, 07) | Länge, Untertitel, Verweis am Ende | 1:23, deutsche Untertitel-Spur aktiv, Kapitelmarken, Vorschaubild. Verweis unter dem Video ("meint diese Seite") ist verständlich. Inhaltsfehler: Kapitel und Ton sagen "Vier Fähigkeiten: wahrnehmen, verstehen, entscheiden, erzeugen", der Abschnitt auf der Seite nennt "Fünf Fähigkeiten: Sehen, Sprache, Wissen, Handeln, Erzeugen". Das ist nicht dasselbe und für Lernende widersprüchlich. Ein Tipp auf das Video startete es im Test nicht sofort (nach 3 s noch Zeit 0:00), ich musste das Abspielen per Skript auslösen. Auf einem echten Handy kann das anders sein. |
| 8 | /karte, Video-Standbild | Lesbar | Im Standbild überdeckt die Steuerleiste den Videotext ("Generative KI" ist halb verdeckt). Kleinigkeit. |
| 9 | Suche mit Alltagswörtern (13-suche-leer.png) | Treffer für Wörter aus meinem Alltag | Gefunden: "ChatGPT" (aber erster Treffer ist der Begriff "Wortschatz (Vokabular)", dann Prompt, Few-Shot; die Seite "Sprachmodell im Chat" kommt nicht zuerst), "Deepfake" (Face-Swap), "Datenschutz". Nichts gefunden bei: TikTok, Spotify, Hausaufgaben, Snapchat Filter, schummeln, Handy entsperren. Bei "Gesicht" steht die Seite "Gesichter" erst an neunter Stelle. Der Leerzustand ("Dazu habe ich nichts gefunden. Probiere zum Beispiel: Chat, Datenschutz ...") ist freundlich, aber die Vorschläge helfen bei "Hausaufgaben" nicht. |
| 10 | /chat, Eingabe leer, "Senden" | Hinweis | Es passiert nichts, kein Hinweis, keine Meldung. Stumm. |
| 11 | /chat, Eingabefeld am Handy (15-chat-leer.png, 16-chat-laeuft.png) | Eine Frage bequem tippen | Das Feld ist nur etwa 49 px hoch, der Platzhalter "Schreibe eine Frage, Enter ..." wird abgeschnitten. Sobald die Antwort läuft, erscheint zusätzlich "Stopp" und das Feld schrumpft auf etwa 40 px Breite, man sieht pro Zeile einen Buchstaben ("S", "c"). Das ist auf dem Handy ein echter Mangel für das wichtigste Labor. |
| 12 | /chat, Frage "Warum klingt ChatGPT manchmal so sicher ...?" und eine zweite Frage (17, 18) | Antwort mit Wartezeit-Erklärung | Erstes Token nach 7,7 s, danach 8 Tokens pro Sekunde, Antwort nach etwa 11 bis 16 s. Die Live-Erklärung mit Balken (7,7 s warten, 3,5 s erzeugen) ist stark: ich verstehe, was dahinter passiert. Die Antwort selbst hat Fehler ("Analyseren", "Faktensätze erfindet, um eine narrative Linie zu erstellen"). Das passt zufällig zum Thema Halluzination, wird aber nirgends so benannt. Der Hinweis "Antwort eines KI-Modells. Sie kann falsch sein" steht direkt darunter, gut. |
| 13 | /chat, Statuszeile | Verstehen | "Modell llama3.2:3b" "im Speicher" und daneben ein Knopf "Modell laden". Wenn es schon im Speicher ist, wozu laden? Unklar. "drei Milliarden Parameter", "Token", "Temperatur" ohne Alltagsbild beim ersten Kontakt. |
| 14 | /ml "Maschinelles Lernen" (21, 22) | Labor selbst bedienen | Sehr gut: Beispieldaten laden, auf das Feld tippen, Text erklärt, welche Nachbarn entscheiden ("2 Punkte in Blau, 2 in Orange, 1 in Grün, Unentschieden, entscheidet der nächste Nachbar"). Das ist das Beste auf der Seite. Schwächen: "Zeiger" (Mausbegriff) am Handy, Beschriftung "Farbe des nächsten Punkts" ist missverständlich, Begriffe "Entscheidungsfläche", "Merkmalsraum". |
| 15 | /llm-grenzen "Grenzen" mit Quiz (23, 24) | Quiz lösen | Fünf Fragen, Antworten gut antippbar. Rückmeldung nach der Antwort: "Nicht ganz. Das Modell prüft keine Fakten ..." beziehungsweise "Richtig. ..." mit Erklärung. Gut. Eine Gesamtauswertung nach zwei Antworten war noch leer (erwartbar). Auf den Einsteigerseiten /karte, /ml, /genki gibt es kein Quiz, ausgerechnet dort, wo ich anfange. |
| 16 | /llm-grenzen "Erkenne die Risiken" (25-spiel.png) | Spiel starten | Funktioniert per Touch, Mail-Beispiel mit Injection ist verständlich. Hinweis "Mit den Tasten 1 bis 3 wählst du ..." ist am Handy nutzlos. Thema trifft meine Welt (ChatGPT erfindet Quellen) gut. |
| 17 | /prompting "Gut fragen" | Hilfe für meine Hausaufgaben | Alle Beispiele sind Büro (Mail an Kunden, Angebote vergleichen, Protokoll). Nichts für Schule. |
| 18 | /whisper mit Fake-Mikrofon (28 bis 30) | Mikro-Labor | Dialog, Aufnahme (3 s), Ergebnis mit Messwerten: "Jetson rechnet 6,3 s", "0,8 mal Echtzeit", "whisper-base (int8, CPU)". Funktioniert, ist aber voller Fachbegriffe (Dekodieren, int8). Mit dem Fake-Ton (Piepton) kann ich die Erkennungsqualität nicht beurteilen. |
| 19 | /bild "Bilder erzeugen" und /faceswap | Bilder aus Text, wie in meinen Apps | Beide "In Arbeit". Genau das, was mich am meisten reizen würde, gibt es nicht zum Ausprobieren. Im Menü steht es mit Schild "in Arbeit", das ist ehrlich. |
| 20 | Touch-Ziele | Mindestens etwa 44 px | Hauptknöpfe sind groß (44 px und mehr). Auf /karte sind 19 Knöpfe und Links unter 40 px hoch, auf /ml 7 Elemente mit nur 26 px (die ?-Begriffe). Kein seitliches Überlaufen (scrollWidth gleich Breite). |
| 21 | Konsole | Keine Fehler | Keine Konsolenfehler auf allen besuchten Seiten. |

## Altersangabe 16+ und Einwilligung (ausdrücklich geprüft)

Was ich bemerkt habe:
- Startseite: Chip "Kamera nur mit deiner Zustimmung". Altersangabe: keine. Ich hätte als 15-Jährige nichts bemerkt.
- /gesicht, Tipp auf "Kamera starten" (12-einwilligung.png, 26-einw-oben.png): Ein Fenster "Gesichtserkennung: ausdrücklich einwilligen" mit sechs Abschnitten (Wozu, Wohin, Was bleibt, Stoppen und widerrufen, Wer ins Bild darf, Kosten). Die Zeile "Nutzbar ab 16 Jahren, jüngere nur mit Einverständnis der Eltern" steht im fünften Abschnitt. Auf dem Handy muss man scrollen, um sie zu sehen. Darunter ein Haken "Ich willige ein, dass mein Kamerabild zur Gesichtserkennung kurz verarbeitet wird" (nicht vorangekreuzt, Knopf gesperrt bis zum Haken). Gut.
- Verstanden? Die Hinweise zu Wozu, Wohin, Was bleibt sind verständlich und ehrlich ("Es wird nichts gespeichert"). Nicht verstanden: "Zahlenlisten, mit denen sich Gesichter vergleichen und wiedererkennen lassen". Das klingt, als würde mein Gesicht doch wiedererkannt. Ich habe es mir übersetzt als "die speichern was von meinem Gesicht, aber nur kurz".
- Der entscheidende Punkt für mich: Der Satz "jüngere nur mit Einverständnis der Eltern" ist nicht an eine Handlung gekoppelt. Es gibt keine Frage nach dem Alter, keine Möglichkeit, das Einverständnis zu bestätigen, der Haken sagt nichts über das Alter. Als 15-Jährige hätte ich einfach den Haken gesetzt. Das ist keine Schutzwirkung, nur ein Hinweis.
- Ablehnen: "Ohne Kamera weitermachen" ist ein gleichwertig großer Knopf, danach der freundliche Hinweis "Du hast nicht eingewilligt. Das ist in Ordnung. Du kannst mit den Beispielbildern weitermachen." (27-abgelehnt.png). Gut. Aber: Ich habe auf der Seite /gesicht keine Beispielbilder gefunden (Textsuche 0 Treffer, Bildschirm zeigt "Die Kamera ist aus. Starte sie mit dem Knopf oben."). Das Versprechen "Beispielbilder" läuft ins Leere, wenn sie weiter unten nicht existieren.
- Mikrofon-Dialog (28-mikro.png): Kein Haken, keine Altersangabe, und mitten im Fenster steht das Wort "null" (Anzeigefehler zwischen "Kosten" und "Danach fragt dich noch dein Browser"). Wirkt kaputt und untergräbt das Vertrauen. Der Knopf "Einverständnis, Mikrofon nutzen" ist zweizeilig umgebrochen.
- "Ist das sicher?" (31-sicher.png): In der Kurzansicht sehr verständlich (Kein Konto, Kein Foto gespeichert, Texte nur kurz) und mit Schaltern "Widerrufen". Die Altersgrenze 16 steht dort in der Kurzansicht nicht, nur in der ausführlichen Fassung ("ab 16 Jahren, jüngere mit Einverständnis der Eltern").
- Als skeptische Nutzerin: Positiv ist, dass alles auf dem Jetson im LAN läuft und nicht bei einem Konzern. Aber "Das Modell läuft lokal" ist ein Versprechen, das ich nicht prüfen kann. Ich würde wissen wollen: Wer sieht mein Bild? Der Betreiber? Kann das Gesicht später zu mir zugeordnet werden?

## Altersweiche (Zusatzfrage des Betreibers)

Idee: Einstiegsfrage ("Wer bist du? Schule, Beruf, neugierig" beziehungsweise Altersstufe) mit eigener Startseite je Gruppe. Kamera und Gesicht wären unter 16 ausgeblendet.

Würde ich die Frage beantworten oder wegklicken?
- Wegklicken, wenn sie vor jedem Inhalt kommt und ich ohne Antwort nicht weiterkomme. Ich will wissen, was die Seite kann, bevor ich etwas über mich sage. Bei Apps, die erst nach dem Alter fragen, lüge ich bei der Angabe oder gehe weg (das tun viele in meiner Klasse bei Social Media).
- Beantworten würde ich sie, wenn sie klein ist, überspringbar, und wenn ich sofort etwas davon habe. Zum Beispiel zwei Knöpfe unter der Überschrift: "Ich gehe zur Schule" und "Ich bin neugierig". Keine Textfelder, kein Geburtsdatum.
- Nach dem genauen Alter fragen ("Wie alt bist du?") wäre für mich bevormundend und der Punkt, an dem ich lüge. Wer unter 16 ist, tippt dann 16 oder älter ein. Das gibt dem Betreiber nur scheinbare Sicherheit.

Was müsste auf MEINER Startseite stehen?
- Sofort ein Ding zum Ausprobieren, nicht erst "Landkarte der Begriffe". Zum Beispiel "Frag die KI selbst" mit Beispielfragen aus meiner Welt: "Erkläre mir den Dreisatz wie einer Zehnjährigen", "Warum zeigt mir TikTok genau diese Videos?", "Schreibe einen Songtext im Stil von ...".
- Drei kurze Karten mit Fragen, die ich wirklich habe: "Wie funktioniert ChatGPT?", "Merkt der Lehrer, wenn ich KI benutze, und darf ich das?", "Wie erkennt TikTok, was mir gefällt?" (Empfehlungen), "Wie macht man Fake-Bilder?" (Deepfakes, Verzerrung und Ethik).
- Ein Satz zur Sicherheit ohne Juristendeutsch: "Kein Konto, deine Daten bleiben nicht gespeichert. Kamera und Mikro gibt es nur, wenn du ausdrücklich Ja sagst."
- Ein klarer Weg zum Schulreferat: Gliederung, Quellen, "so nennst du das im Referat" (Lizenzen und Quellen ist heute versteckt).
- Kein "Für Entscheider", keine Betriebs-Beispiele, kein "Jetson" im ersten Absatz.

Was ist nervig oder bevormundend?
- Frage wie "Wer bist du?" gleich beim ersten Öffnen, bevor ich etwas gesehen habe.
- Wenn Gruppen eingesperrt werden: Wenn "Schule" mir Inhalte versteckt, die ich sehen will (zum Beispiel Business-Beispiele für ein Referat über Berufe), fühle ich mich eingeengt. Besser: eine empfohlene Startseite, aber alle Seiten bleiben über das Menü erreichbar.
- Warnungen in Großbuchstaben oder Eltern-Texte ("frag deine Eltern") bevor ich etwas ausprobieren darf. Ein kurzer, ehrlicher Satz reicht.
- Wenn die Seite unter 16 etwas wegnimmt, ohne es zu sagen: Ich würde in den Menüs suchen und denken, es sei kaputt.

Kamera und Gesicht unter 16 ausgeblendet:
- Das würde ich akzeptieren, wenn die Seite es erklärt: "Gesichtserkennung gibt es erst ab 16, das ist gesetzlich so (Datenschutz). Hier kannst du es stattdessen mit Beispielbildern erleben." Dazu muss es dann die Beispielbilder wirklich geben (siehe oben, heute auf /gesicht nicht gefunden).
- Ausgeblendet ohne Erklärung wäre schlecht: Die Menüeinträge "Gesichter" und "Objekte" fehlen, und die Suche nach "Gesicht" liefert ins Leere. Besser sichtbar, aber mit Schloss und Satz ("ab 16, hier die Version ohne Kamera").
- Die Schwelle sollte nur das trennen, was wirklich Gesicht und biometrische Daten betrifft. "Objekte erkennen" (Tasse, Stift) und Mikrofon sind harmloser. Wer alles auf einmal sperrt, nimmt genau die Labore weg, die Spaß machen.
- Ehrlich: Eine Altersweiche ohne Prüfung ist nur ein Selbstauskunftsknopf. Sie schützt rechtlich den Betreiber, nicht die Jugendlichen. Das sollte der Betreiber mit der Rechtsbewertung klären und die Seite nicht als Schutz verkaufen.

## Was habe ich verstanden (3 Sätze)?

KI wie ChatGPT ist ein Programm, das aus ganz vielen Beispielen Muster lernt und dann Wort für Wort das wahrscheinlichste nächste Wort aussucht, auch wenn es das Wissen gar nicht hat, deshalb erfindet es manchmal Sachen und ich muss alles Wichtige selbst prüfen. Beim Maschinellen Lernen zeige ich dem Computer Punkte mit Farben, und er sortiert einen neuen Punkt danach ein, welche Nachbarn er hat. Kamera, Mikro und Gesicht gehen kurz an einen Rechner im selben Netz, sollen nicht gespeichert werden, aber nur mit meinem Haken, und wirklich verstanden habe ich noch nicht, was mit meinem Gesicht danach passiert.

## Was fehlt mir, um selbst etwas auszuprobieren?

- Ein Schritt "Jetzt du": Eine kleine Aufgabe, die ich mit eigenen Worten und eigenen Daten löse und danach als Link oder Bild mitnehmen kann.
- Kein Hinweis, wie ich selbst etwas baue: Auf den geprüften Seiten (prompting, ueber, bild, gesicht) steht nichts zu Python, API, GitHub, kostenlosen Werkzeugen oder "so baust du das nach". Ich weiß am Ende, wie es funktioniert, aber nicht, wie ich selbst anfange.
- Bilder erzeugen ist "in Arbeit", Face-Swap ebenfalls: Das ist das, was ich zuerst ausprobieren wollte.
- Der Chat am Handy ist durch das winzige Eingabefeld und die stumme Leere-Eingabe unbequem.
- Beispiele sind Betrieb und Büro, nichts aus Schule, Musik, Social Media oder Spielen.
- Die Einsteigerseiten (karte, ml, genki) haben kein Quiz, die Prüfung "habe ich es verstanden" fehlt dort.

## Würde ich es für ein Schulreferat nutzen?

Teilweise ja. Gut nutzbar: "Was ist KI?", "Grenzen" (Halluzination, Quiz, Spiel) und das Live-Messen der Antwortgeschwindigkeit. Sehr gut als Demo im Referat: die Punkte-Fläche (/ml) und die Live-Erklärung im Chat. Dagegen: Es gibt keinen Hinweis, wie ich die Seite als Quelle angebe (Autor ist Daniel Alisch, "Lernprojekt"), die Antwort des kleinen Modells enthält sichtbare Sprachfehler und taugt nicht als Beleg, und die Betriebsbeispiele passen nicht zu meinem Thema. Mit einem Quellen-Block und Schul-Beispielen wäre es ein Ja. Heute: ich würde es als Anschauung im Referat nehmen und die Fakten woanders belegen.

## Bewertung nach dem Raster (1 bis 10, streng)

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter | 7 | Kurze Sätze, Du-Ansprache, Erklärungen mit Beispielen (Spam, Navi). Abzug: Jetson, Token, Inferenz, Merkmalsraum, Entscheidungsfläche, "int8, CPU", "Dekodieren" ohne Übersetzung (Beob. 4, 14, 18). |
| 2 | Einstieg und Führung | 6 | Hauptknopf klar, aber "Neu hier?" scrollt nur (3), "Für Entscheider" lenkt ab (1), keine Altersangabe und kein Schul-Einstieg (2). |
| 3 | Lernwirkung | 7 | Eigene Erklärung in drei Sätzen gelang. Quiz mit Erklärung und Spiel wirken (15, 16). Die Einsteigerseiten haben kein Quiz, Videoinhalt "vier" gegen "fünf" Fähigkeiten widerspricht sich (7). |
| 4 | Motivation und Spaß | 6 | Punkte-Fläche (14) und Live-Balken (12) machen Spaß. Aber Bilder erzeugen und Face-Swap "in Arbeit" (19), Beispiele nicht aus meiner Welt (17). |
| 5 | Labore und Interaktion | 6 | ML sehr gut, Whisper läuft, Chat liefert nach 8 bis 16 s eine Antwort mit Erklärung (12). Aber auf dem Handy winziges, bei Antwort einbuchstabiges Eingabefeld (11), leere Eingabe stumm (10), Wartezeit 7,7 s bis zum ersten Wort. |
| 6 | Videos | 7 | 1:23, Untertitel, Kapitel, KI-Stimme gekennzeichnet, Verweis erklärt (7). Ton nicht gehört, Inhaltsfehler (7), Steuerleiste verdeckt Text (8). |
| 7 | Navigation und Orientierung | 6 | Menü und "Zur Startseite" gut (5). Suche findet TikTok, Spotify, Hausaufgaben, Snapchat Filter, schummeln, Handy entsperren nicht, ChatGPT liefert erst "Wortschatz" (9). Fortschritt nicht geprüft. |
| 8 | Vertrauen und Sicherheit | 6 | Gut erklärt: Zweck, Weg, Speicherung, Widerruf, Haken nicht vorangekreuzt (Einwilligung). Aber 16+ nur versteckt im fünften Abschnitt des Gesichts-Fensters, nicht auf der Startseite, nicht im Mikro-Fenster, ohne Handlung, Fenster mit "null" (Abschnitt Altersangabe). |
| 9 | Barrierefreiheit und Bedienbarkeit | 6 | Große Hauptknöpfe, kein Überlaufen, aber 19 Elemente unter 40 px (20), graue Hilfetexte auf hellem Grund mit schwachem Kontrast (Eindruck, nicht gemessen), Tastenhinweis am Handy (16), winziges Eingabefeld (11). |
| 10 | Fehlerfälle | 7 | Kamera ablehnen freundlich (Einwilligung), Suche leer mit Vorschlägen (9). Abzug: leere Chat-Eingabe stumm (10), versprochene Beispielbilder nicht gefunden (Einwilligung). |

**Gesamtnote: 6,5 von 10.** Inhaltlich eine ernsthafte, ehrliche Seite mit starken Einzelstücken (Punkte-Fläche, Live-Erklärung, Quiz-Rückmeldung, klarer Datenschutzdialog). Für mich als 15-Jährige am Handy aber noch nicht Eins-A: Das wichtigste Labor ist am Handy unbequem, die Welt der Beispiele ist nicht meine, die Altersangabe liegt versteckt und wirkt ohne Folgen.

## Würde ich es weiterempfehlen?

Bedingt. An Freundinnen, die schon neugierig auf KI sind, ja, mit dem Tipp "Probier die Punkte-Seite und den Chat". An Leute, die nur "ein Tool für Hausaufgaben" wollen, nein: es ist ein Lernprojekt, kein Werkzeug, und es sagt auch nicht, wie ich es selbst nachbaue. Ohne bessere Startseite und Chat-Eingabe am Handy würde ich nach dem ersten Besuch nicht zurückkommen.

## Die drei größten Lücken Richtung Eins-A

1. Chat-Eingabe und Handy-Bedienung reparieren: Eingabefeld ausreichend groß und beim Antworten nicht schrumpfend, leere Eingabe mit Hinweis, Touch-Ziele mindestens 44 px, Tastenhinweise nur am Desktop. Das ist das zentrale Erfolgserlebnis ("ich frage, es antwortet, ich sehe warum") und gerade dort bricht es am Handy.
2. Einstieg für Schülerinnen und Schüler: Eine eigene, empfohlene Startseite mit Beispielen aus Schule, Musik, Social Media, einem sofort startbaren Ausprobieren, einem Block "So nennst du das im Referat" und einem Schritt "Wie baue ich selbst etwas?" (Werkzeuge, kostenlose Zugänge, erste Schritte). Ohne Einschränkung des Menüs.
3. Altersangabe und Einwilligung ehrlich und sichtbar machen: 16+ im Chip auf der Startseite und im Kopf der Seiten "Gesichter" und "Objekte", im Mikro-Fenster ebenfalls oder bewusst begründet nicht, den "null"-Fehler beheben, versprochene Beispielbilder bereitstellen und die Rechtsfrage unter 16 klären, bevor eine Weiche als Schutz verkauft wird.

Weitere kleinere Punkte: Suche um Alltagswörter erweitern (TikTok, Spotify, Hausaufgaben, Filter, schummeln, Handy entsperren) und "ChatGPT" auf die Chat-Seite führen; Video "vier" gegen "fünf" Fähigkeiten angleichen; "Modell laden" erklären oder ausblenden, wenn es schon im Speicher ist; Fachbegriffe in Whisper-Messwerten übersetzen; Quiz auf den Einsteigerseiten ergänzen.
