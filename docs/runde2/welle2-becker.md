# Welle 2: Frau Becker (Lehrerin Klasse 8, Laptop 1366x768)

Prüfung am 22.11.2026, 16:33 bis 16:44 Uhr, gegen https://192.168.178.83:8443 (Jetson im LAN), Chromium headless, Viewport 1366x768, helles Farbschema, ohne Kamera. Die Seite wird parallel von anderen Agenten weiterentwickelt: Der Stand ist der von 16:33 bis 16:44 Uhr. Die Zeiten unten sind die Ladezeiten aus dem Browser (1,5 bis 2,4 Sekunden je Lektionsseite). Menschliche Lesezeiten sind Schätzungen und so benannt. Screenshots liegen in /tmp/welle2-becker/.

## Gesamtnote: 6,5 von 10

Für eine Lehrerin, die abends vor der Stunde nur wenig Zeit hat, ist der Inhalt der Schulseiten überraschend gut: Es gibt einen Zeitplan, Aufgaben, Lösungshinweise, Differenzierung, Tafelbild und eine Seite für die Schulleitung. Zwei Dinge verhindern aber eine bessere Note: Das Arbeitsblatt ist kein Arbeitsblatt zum Ausdrucken, und das Sprachmodell lief bei mir in keinem einzigen Versuch. Genau das hätte ich in der Stunde gebraucht (Prompt-Werkstatt, Station 2).

## Willkommens-Fenster (Zusatzfrage 1)

- Beim ersten Aufruf (16:33) erschien ein Fenster "Willkommen im KI-Labor" mit sechs Rollen, unscharfer Hintergrund, Knopf "Später" und Schließen-Kreuz. Ich habe "Ich unterrichte" gewählt (Untertitel: "Themen und Material für Lehrende").
- Erwartet: dass ich direkt bei Material für meine Stunde lande. Passiert: Das Fenster schließt, die Startseite bleibt oben stehen (Überschrift "KI verstehen, indem du sie ausprobierst"), nur ein kleines Schild "Ich bin: Lehrende" oben rechts bestätigt die Wahl. Der Abschnitt "Dein Weg: Unterricht" steht erst weit unten (nach dem Rollenblock, Fullpage-Screenshot 02b-voll.png). Ich muss scrollen und merke nicht, dass meine Wahl etwas verändert hat. Das ist der größte Bruch im Einstieg.
- Die Rollenauswahl wird auf der Startseite ein zweites Mal gezeigt ("Wofür bist du hier?"), mit fast gleichen Texten. Doppelt.
- Der Satz bei "Ich bin Schüler:in" ("Kamera, Mikro und Gesicht ab 16, im Schulpfad nicht nötig") ist für mich als Lehrerin ein guter Hinweis, steht aber nur dort, nicht bei "Ich unterrichte".
- Der Schalter "Meinen Lernfortschritt in diesem Browser merken" ist für mich unverständlich, ich weiß nicht, was er mit dem Schulgerät macht. Gut, dass er aus ist.

## Menü (Zusatzfrage 2)

- Startseite: 12 Gruppen (Start, Grundlagen, Sehen, Sprache, Wissen und RAG, Agenten, Daten und Prognosen, KI im Betrieb, Business-Use-Cases, Der Rechner dahinter, Für die Schule, Medienkompetenz). Ohne Scrollen im Menü sind bei 768 Pixeln Höhe nur 7 Gruppen sichtbar (bis "Daten und Prognosen"), dazu der Punkt "Start". "Für die Schule" und "Medienkompetenz" liegen unter dem Falz. Das Menü ist ein Scrollbereich von etwa 440 Pixeln, weil der Kasten "Rechner live und frei" fest darunter sitzt.
- Lektionsseite Stunde 1: 12 Gruppen, Gruppe "Für die Schule" aufgeklappt mit 10 Punkten (Schule: Einstieg, Stunde 1, 2, 3, Handreichung Lehrkräfte, Info Schulleitung, Info Eltern, KI für Schulen: Überblick, In 7 Schritten starten). Im Fenster sichtbar sind 8 Gruppen und nur 2 Schulpunkte, die übrigen 8 muss ich im Menü scrollen. Insgesamt hat das Labor laut Linkliste etwa 75 Seiten.
- Überladen? Ja, für mich. Ich erwarte: Start, Für die Schule, Medienkompetenz, Ist das sicher, Suche. Nie anklicken würde ich: Agenten, Daten und Prognosen, KI im Betrieb, Business-Use-Cases, Der Rechner dahinter.
- "Für die Schule" sollte bei meiner Rollenwahl oben im Menü stehen oder vorgeklappt sein. Nach der Wahl "Ich unterrichte" ändert sich am Menü nichts.
- Die Suche ist gut: "Arbeitsblatt" findet Stunde 1 bis 3 und die Handreichung, "Schulleitung" die Info Schulleitung, "Datenschutz Schule" mehrere Seiten, "Klasse 8" die Schulseiten (daneben unpassende Treffer wie "Bild als Zahlen"). "Stundenplanung" findet nichts, "PDF" findet nur RAG-Seiten.

## Zielaufgaben (Zusatzfrage 3)

1. Material für eine 45-Minuten-Stunde: gelöst. Weg: Willkommens-Fenster "Ich unterrichte" (1 Klick), nach unten scrollen, "Dein Weg: Unterricht" oder "Neu hier" Schritt 3 "Stunde 1" (2 Klicks) = 3 Klicks, geschätzt unter einer Minute, wenn man den Abschnitt findet. Wer das Fenster schließt, findet über Menü "Für die Schule" ebenfalls in 3 Klicks. Stunde 1 hat einen sauberen Zeitplan (Einstieg 5, Erarbeitung 20, Sicherung 10, Reflexion 10), Stationen, Aufgaben, Lösungshinweise, leichte/schwere Variante, Tafelbild, 3 Quizfragen. Die Vorbereitung in zehn Minuten ist realistisch, wenn man vorher ins Punkte-Labor schaut.
2. Arbeitsblatt zum Ausdrucken: Lücke. Auf Stunde 1 gibt es den Abschnitt "Arbeitsblatt: die Aufgaben" mit drei Aufgaben plus Zusatz. Er ist unter "Mehr dazu" eingeklappt (im Modus "Kurz lesen") und wird erst mit "Genau lesen" lesbar. Es gibt kein PDF, keinen Druckknopf, keinen Download, und die Seite hat keine Druckformatierung (0 Druckregeln in den Stylesheets). Ausdrucken heißt: Browser-Druck der ganzen Lektionsseite (Höhe etwa 6400 Pixel) oder Text kopieren und in Word einfügen. Der Text auf der Seite sagt sogar, die Aufgaben "passen auf ein Blatt". Auch die Handreichung erwähnt "Arbeitsblatt kopieren", ohne dass es etwas zu kopieren gibt. Auf Stunde 2 und 3 ebenfalls kein Blatt (nur Aufgabentext auf der Seite). Du/Sie-Hinweis: Das Arbeitsblatt spricht Schüler an, aber die Aufgaben stehen auf einer Seite, die Schüler und Lehrkraft zugleich lesen. Ich muss sie mit Namensfeld und Platz zum Schreiben selbst bauen.
3. Datenschutz für die Schulleitung: gelöst, mit Einschränkung. Seite "Info Schulleitung" (Menü, 2 Klicks aus der Startseite, Suche "Schulleitung" ebenfalls). Sie nennt kein Konto, keine Namen, Cookie kl_s, Verbindungsdaten, Verantwortlichen, Kamera/Mikro nicht vorgesehen, Schule klärt Rechtsgrundlage, Stand 22.11.2026. Das ist brauchbar als Gesprächsgrundlage. Aber: (a) "Weiterleitung laut Planung" und "nach dem Planungsstand vom 22.11.2026 ist ein Server und ein Tunnel eines Netzanbieters vorgesehen" klingt für eine Schulleitung nach "noch nicht geklärt"; Auftragsverarbeitung, Serverstandort, Löschfristen fehlen. (b) "Verantwortlich ist Daniel Alisch" (eine Privatperson): Die Schulleitung wird fragen, ob es einen Auftragsverarbeitungsvertrag gibt. Die Seite sagt nur "lesen Sie in der Datenschutzerklärung nach oder fragen Sie den Betreiber". (c) Kein Ausdruck, kein PDF, keine Kurzfassung auf einer Seite. (d) Unklare Rückfrage-Anschrift: Der Kontakt steht nur im verlinkten Impressum. (e) Der Satz, die Gesichtserkennung sei "erst ab 16 Jahren gedacht, jüngere nur mit Einverständnis der Eltern", ist unscharf formuliert, nenne ich als Lehrerin besser nicht der Schulleitung. Zusätzlich gibt es "KI für Schulen: Überblick" (2341 Wörter) und "In 7 Schritten starten" (1284 Wörter): gute Inhalte, aber für den Abend vor der Stunde zu lang.

## Pflichtweg (verkürzt, aus Sicht der Lehrerin)

- Startseite, Willkommens-Fenster, "Neu hier" (drei Schritte, Schule-Pfad). Lernseiten gelesen: Handreichung Lehrkräfte, Schule: Einstieg, Stunde 1, Info Schulleitung, Info Eltern, Maschinelles Lernen (Grundlagen, mit Video und Labor), Prompting (Sprache, mit Labor), Chat (Sprache).
- Labor 1, Punkte-Labor (Seite "Maschinelles Lernen"): funktioniert. Ich habe je zehn blaue und orange Punkte gesetzt und mit der Maus über die Mitte gefahren. Rückmeldung in Alltagssprache: "Der Punkt unter deinem Zeiger hat unter seinen 5 nächsten Nachbarn 1 Punkt in Blau und 4 Punkte in Orange. Die Mehrheit gewinnt: Orange." Mit gezeichneten Verbindungslinien. Das ist gut für Klasse 8. Ein Haken: In der Handreichung steht "Seite ml" als Link, das ist kein Wort für Schüler und mich.
- Labor 2, Prompt-Werkstatt (Seite "Gut fragen"): nicht nutzbar. "Beide senden" meldete nach etwa 6 Sekunden "Dem Jetson fehlt gerade freier Speicher, um das Sprachmodell zu laden. Versuch es in einem Moment noch einmal." Zweiter Versuch (nach etwa 4 Minuten): nach etwa 12 Sekunden dieselbe Meldung. Chat-Seite: dieselbe Meldung nach etwa 6 Sekunden. Knopf "Modell laden": 60 Sekunden lang keine sichtbare Reaktion, Status blieb "nicht im Speicher". Das war keine Ratenbegrenzung ("Zu viele Anfragen" kam nie). Auffällig: Die Anzeige links unten sagte durchgehend "Rechner live und frei, 0 % Auslastung, Kein Modell im Speicher" (Speicher 3,0 bis 4,0 von 7,4 GB). Der Rechner wirkt also bereit und ist es nicht. Die Meldung ist freundlich, aber ohne Handlungshinweis außer "in einem Moment". Wegen der Last durch andere Prüfer ist das möglicherweise nur ein Moment, für die Stunde mit 28 Kindern wäre es ein Totalausfall von Station 2. Nach vier Versuchen habe ich nicht weiter belastet.
- Video (Maschinelles Lernen): 1:29 Minuten, Untertitel vorhanden (eine Spur), Kapitelmarken mit Zeit (0:00 bis 1:11), Hinweis "Der Verweis am Ende der Folge meint diese Seite" und "Sprecherstimme KI-erzeugt". Im Unterricht brauchbar als Einstieg. Das Video bleibt beim Seitenaufruf stehen (kein Autostart).
- Quiz (Stunde 1, 3 Fragen): gelöst, sofortige Rückmeldung "Richtig. Das Labor vergleicht mit den nächsten Beispielen und lässt sie abstimmen."
- Suche mit Alltagswörtern: siehe oben, gut.
- Fehlersituationen: Leere Eingabe im Chat: Hinweis "Schreib zuerst eine Frage." (freundlich). Kamera nicht getestet (nicht Aufgabe der Karte, Kamera ist im Schulpfad aus).

## Lehrerinnen-Fragen

**Ist die Stunde in 10 Minuten vorbereitbar?** Fast. Lesen der Stunde-1-Seite im Modus "Genau lesen" (etwa 4 Minuten laut Seite, 750 Wörter kurz, 1344 Wörter genau), Link testen, Labor einmal ausprobieren: realistisch 10 bis 15 Minuten. Es hapert an (a) Arbeitsblatt drucken, (b) der Frage, ob das Sprachmodell läuft, (c) dem Wechsel zwischen Seiten "ml" und "prompting" mitten in der Stunde, ohne dass die Stationen in Stunde 1 direkt als Knopf verlinkt sind ("Punkte-Labor (Seite ml)").

**Passen Zeitplan, Aufgaben, Technikhinweise?** Zeitplan ja, 45 Minuten mit Reserve. Aufgaben ja, klar formuliert. Technik: "Vierergruppen, höchstens 7 Geräte gleichzeitig, kurze Wartezeit" ist ehrlich, aber 28 Kinder in Vierergruppen sind genau 7 Gruppen, also volles Limit, und die Seite verspricht "kurze Wartezeit", obwohl der Chat bei mir gar nicht startete. Die Seite sagt nicht, was ich tue, wenn das Modell nicht antwortet (Plan B, zum Beispiel Station 1 verlängern, Antworten vorab als Screenshots). Schul-WLAN: Keine Aussage zu Bandbreite oder Firewall. Wichtig für mich: Das Labor läuft auf dem LAN-Jetson, ob die Schule die Adresse öffnen kann, steht nirgends. Schulgeräte: Browseranforderungen fehlen (welcher Browser, welche Version, welche Bildschirmgröße).

**Ist die Info für die Schulleitung brauchbar und verständlich?** Verständlich ja (kurze Sätze, Tabelle Betreiber gegen Schule), brauchbar nur halb (siehe Aufgabe 3). Das Wort "Verarbeitung" und "Rechtsgrundlage" lässt die Schulleitung die Arbeit selbst machen, das ist rechtlich richtig, praktisch aber unbequem. Eine Seite "Das sagen Sie Ihrer Schulleitung in 5 Sätzen" und ein ausdruckbares Blatt fehlen.

**Fehlen Arbeitsblätter?** Ja. Gefunden: Aufgabentext je Stunde, aber kein PDF, keine Druckansicht, keine Kopiervorlage, kein Lösungsblatt zum Ausdrucken, kein Tafelbild als Folie. Der Menüpunkt "Handreichung Lehrkräfte" verweist auf "Arbeitsblatt kopieren" ohne Datei.

## Raster (1 bis 10)

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter | 7 | Schülerseiten kurz und klar, Lehrerseiten ebenfalls. Aber "Du" gegenüber Lehrkräften in der Handreichung ("Du kannst die Lernziele ... zuordnen") und "Sie" auf der Schulleitungsseite; Wörter wie Heuristik, Inferenz, Tokens, Temperatur, "Seite ml". |
| 2 | Einstieg und Führung | 6 | Willkommens-Fenster gut gemeint, aber danach ändert sich fast nichts sichtbar. "Dein Weg: Unterricht" liegt unter dem Falz. Startseite ist etwa 7700 Pixel hoch. |
| 3 | Lernwirkung | 7 | Stunde 1 ist didaktisch rund (Beispiele statt Regeln). Ich könnte in drei Sätzen erklären: KI lernt aus Beispielen, die nächsten Nachbarn stimmen ab, wenige Beispiele führen zu schlechten Entscheidungen. |
| 4 | Motivation und Spaß | 7 | Punkte-Labor mit sofortigem Feedback, Video, Quiz. Sprachmodell ausgefallen, dadurch fehlt der Hauptspaß. |
| 5 | Labore und Interaktion | 5 | Punkte-Labor sehr gut. Prompt-Werkstatt und Chat nicht nutzbar (vier Versuche, "fehlt freier Speicher"). Knopf "Modell laden" ohne Reaktion. Statusanzeige "frei" trügt. |
| 6 | Videos | 8 | 1:29 Minuten, Untertitel, Kapitelmarken, Verweisklärung. Kein Autostart. |
| 7 | Navigation und Orientierung | 6 | Suche gut, "Weiter im Pfad" gut. Menü mit 12 Gruppen und 75 Seiten überladen, Schulgruppe nicht hervorgehoben, Menüfläche klein auf 768 Pixeln. |
| 8 | Vertrauen und Sicherheit | 7 | Kamera aus im Schulpfad, klare Aussagen, Klassenlink ohne Speichern. Aber Schulleitung: Hosting "laut Planung", Betreiber Privatperson, kein AV-Vertrag genannt. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Überschriften, Skip-Link, gute Kontraste im Screenshot. Wartezeit ohne Zähler. Nicht vollständig geprüft (kein Screenreader). |
| 10 | Fehlerfälle | 6 | Freundliche Meldung bei fehlendem Speicher und leerer Eingabe. Aber kein Handlungsweg und kein Alternativangebot (zum Beispiel Beispielantworten ansehen), Knopf "Modell laden" bleibt stumm. |

Gesamtnote 6,5 (ehrlicher Eindruck, nicht Mittelwert).

## Die drei textlastigsten Stellen (Zusatzfrage 4)

1. "KI für Schulen: Was gibt es und wie fange ich an?" (ki-schule-ueberblick), Abschnitt "Weg 1: Angebote der Länder" und folgende: 2341 Wörter im Modus "Genau lesen", 10 Abschnitte, Seitenhöhe etwa 11000 Pixel, viel Prosa mit Ländernamen, Tabellen und Verbandskritik. Für einen Abend vor der Stunde zu viel.
2. Startseite nach der Rollenwahl: Rollenblock, "Dein Weg", "Neu hier", "In 15 Minuten", vier Lernpfade, Pfade nach Rolle (acht Karten), "Alle Bereiche" (13 Kacheln), Carousel, Hinweise. Etwa 7700 Pixel Höhe, viele Karten mit ähnlichen Texten, der für mich wichtige Teil ist ein kleiner Abschnitt mittendrin.
3. "Ist das sicher? Was wird gespeichert?" (sicherheit-einfach), Abschnitt "Was die Seite in deinem Browser ablegt": 1288 Wörter, eine lange Tabelle mit Einträgen wie kl-merken, kl-weg, kl-mathe. Richtig und ehrlich, aber für Lehrkräfte und Schulleitung ohne Kurzfassung nicht hilfreich. Gleiches gilt für Stunde 1 im Modus "Genau lesen" (1344 Wörter).

## Würde ich es weiterempfehlen? (Zusatzfrage 5)

Eingeschränkt: Ja an Kolleginnen, die Klasse 8 in Informatik, Politik oder Deutsch unterrichten und ein Experiment ohne Anmeldung wollen, die sich mit Ausdrucken selbst helfen können. Zwei Sätze: "Das Punkte-Labor und die erste Stunde sind gut gemacht, ohne Anmeldung und ohne Kamera, und du bekommst Zeitplan, Aufgaben und Lösungen. Druck dir das Arbeitsblatt selbst und halte einen Plan B bereit, denn der Chat lief bei mir nicht."

## Was hat mich gefreut

- Der Zeitplan von Stunde 1 in vier Phasen mit Minuten, Differenzierung leicht/schwer und Lösungshinweisen. So arbeite ich sonst nur mit Verlagsmaterial.
- Der Klassenlink "/?weg=schule" mit der Aussage, dass auf den Klassengeräten nichts gespeichert wird.
- Das Punkte-Labor mit der Rückmeldung "5 nächste Nachbarn, 1 Blau, 4 Orange, die Mehrheit gewinnt" in einem Satz.
- Die Suche: "Arbeitsblatt" und "Schulleitung" führen sofort zu den richtigen Seiten.
- Das Quiz mit sofortigem, erklärtem Feedback und das kurze Video mit Untertiteln.
- Ehrlichkeit: "Kein Rechtsrat", "Antwort kann falsch sein, prüfe Wichtiges".

## Was hat genervt

- Das Arbeitsblatt ist kein Blatt. Kein PDF, keine Druckansicht, Aufgaben unter "Mehr dazu" versteckt.
- Das Sprachmodell lief nicht, vier Versuche, und die Anzeige "Rechner frei" widersprach dem. "Modell laden" tat nichts, und es gab keinen Plan B.
- Nach "Ich unterrichte" scheinbar nichts, weil "Dein Weg" tief unten liegt. Rollenauswahl zweimal.
- Menü: 12 Gruppen, die Schulgruppe unter dem Falz. Auf der Lektionsseite fehlt ein Wegweiser "Handreichung zuerst".
- Gemischte Anrede (Du in der Handreichung, Sie bei der Schulleitung) und Fachwörter ("Seite ml", Heuristik, Temperatur).
- Schulleitungsseite mit "laut Planung" bei Hosting. Das beantwortet die erste Frage jeder Schulleitung nicht: "Wo sind die Daten, und gibt es einen Vertrag?"

## Die drei größten Lücken Richtung Eins-A

1. Druckbares Material: Arbeitsblatt je Stunde als PDF (A4, mit Namensfeld, Lösungsblatt, Tafelbild), Druckansicht der Lektionsseiten, Download-Knopf in der Handreichung. Aufwand klein bis mittel.
2. Verlässliche Sprachmodell-Stationen: Wenn das Modell nicht lädt, ein sichtbarer Plan B (vorab aufgezeichnete Beispielantworten zum Durchklicken), ehrliche Statusanzeige statt "frei", Knopf "Modell laden" mit Rückmeldung, Hinweis für die Lehrkraft "bei 28 Kindern vorher testen". Aufwand mittel.
3. Lehrkraft-Einstieg und Schulleitungs-Blatt: Nach "Ich unterrichte" direkt auf eine Seite "Dein Abend vor der Stunde in 10 Minuten" (Link testen, Blatt drucken, Labor testen, Plan B) springen, Menü auf "Für die Schule" ausrichten, und für die Schulleitung ein Ein-Seiten-Blatt mit festen Aussagen zu Hosting, Vertrag, Speicherdauer, Ansprechperson (statt "laut Planung"). Aufwand mittel.

## Hinweise zur Prüfung

- Ratenbegrenzung ("Zu viele Anfragen") trat nicht auf. Insgesamt vier Sprachmodell-Anfragen (zwei Prompt-Werkstatt, ein Chat, ein "Modell laden") mit Pausen von mindestens 20 Sekunden.
- Konsolenfehler: In den protokollierten Läufen keine.
- Nicht geprüft: Tastaturbedienung im Detail, Screenreader, Kamera-Labore (im Schulpfad bewusst nicht vorgesehen), Quiz Stunde 2 und 3, echtes Schul-WLAN.
