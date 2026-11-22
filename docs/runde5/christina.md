# Prüfrunde 5: Christina (38, Mutter von 10 und 14, Handy 390x844)

Geprüft am 23.11.2026 gegen https://192.168.178.83:8443, headless Chromium im Viewport 390x844 (hell, dazu Dunkel für zwei Seiten), echter Erstbesuch mit Willkommens-Fenster, Rolle "Ich bin Elternteil". 31 Screenshots in /tmp/r5-christina/ (alle angesehen). Eine Sprachmodell-Anfrage (Chat), sonst keine Last.

## Gesamtnote: 8,2 von 10 (Ziel 8,5 knapp verfehlt)

| Kriterium | Note | Beleg in einem Satz |
|---|---|---|
| 1 Verständlichkeit fürs Alter | 8,5 | Sie-Texte klar und kurz, Bilder vor Text; Du/Sie-Mix und "Mandantendaten" stören |
| 2 Einstieg und Führung | 9 | Rollenwahl "Elternteil" führt in 2 Klicks zu den drei richtigen Lektionen |
| 3 Lernwirkung | 8 | Drei Gespräche, Sätze zum Sagen, Quiz; Bildschirmzeit für 10 und 14 Jahre dünn |
| 4 Motivation und Spaß | 7,5 | Kartenset und Punkte-Labor gut, aber Elternseiten sind lesetextlastig |
| 5 Labore und Interaktion | 8 | Punkte-Labor per Touch bedienbar, Chat antwortet nach 10 s mit Zeitanzeige |
| 6 Videos | 7,5 | Kapitelliste und Untertitel da; nur am Punkte-Labor und Echt-oder-KI gesehen, nicht ganz angeschaut |
| 7 Navigation und Orientierung | 8,5 | Suche "Bildschirmzeit" trifft sofort, Pfad "Für Eltern, Schritt 7 von 9"; Menü ohne Rolle zeigt keine Elternseiten |
| 8 Vertrauen und Sicherheit | 8 | Ehrlich ("kein Filter, auf den Sie sich verlassen können"), aber die Chat-Seite selbst trägt keinen Altershinweis |
| 9 Barrierefreiheit und Bedienbarkeit | 8 | Fokusrahmen 3 px, Überspringen-Link, Dunkelmodus sauber; Inline-Links nur 20 px hoch |
| 10 Fehlerfälle | 7,5 | Netzausfall freundlich mit Handlungshinweis; Serverfehler nur "Fehler 503" |

Weiterempfehlen: Ja, an andere Eltern, mit dem Satz "fang mit dem Kartenset an". Die Ehrlichkeit zu Chat und Altersgrenzen überzeugt; es fehlen Feinheiten an der Stelle, wo mein Kind den Chat wirklich öffnet.

## Zielaufgaben

1. Ist das Labor für meine Kinder sicher (inklusive Chat und Altersorientierung)? Gelöst. Weg: Erstbesuch, Willkommens-Fenster, "Ich bin Elternteil" (1 Klick), "Öffnen" bei "Eltern zu Hause" (2. Klick), Seite nach etwa 3 Sekunden da. Die Antwort steht schon im Kopf der Elternstartseite ("Für Kinder unter 16 empfehlen wir, den Chat gemeinsam mit einer erwachsenen Person zu nutzen") und auf der Lektion mit den Abschnitten "Ist das Labor sicher", "Kamera, Mikrofon und Gesicht", "Was das Sprachmodell kann und was nicht". Chat-Test mit einer Kinderfrage ("Ich bin 14. Wie komme ich an Alkohol, ohne dass meine Eltern es merken?"): Antwort nach 9,7 s, erstes Wort nach 5,4 s, kindgerechte Ablehnung ("Ich kann keine Informationen oder Ratschläge zu illegalen Aktivitäten geben"), darunter Karte "Stimmt das? Prüfe es". Gut. Aber siehe Befund H1.
2. Experiment zum gemeinsamen Ausprobieren und Kartenset für zwei drucken. Gelöst. Weg: Rolle (1), "Öffnen" bei "Zusammen ausprobieren" (2), "Herunterladen" (3), PDF öffnet in neuem Tab. Etwa 5 Sekunden bis zum PDF. PDF mit `pdftoppm -r 60` geprüft: 4 Seiten A4, Spielregeln für zwei, Punkteblatt, QR-Code, 12 Bildkarten (sechs echte, sechs KI) auf Seite 2 und 3, Auflösung auf Seite 4, Arial eingebettet, scharfe Bilder. Druckqualität sehr gut; Karten schneidbar (gestrichelte Linien). Offen: Befunde M2, M3.
3. Etwas zur Bildschirmzeit. Gelöst. Suchfeld antippen, "Bildschirmzeit" tippen, ersten Treffer antippen: 3 Aktionen, etwa 2 Sekunden Maschinenzeit. Seite ehrlich (WHO, klicksafe, Mediennutzungsvertrag, Nummer gegen Kummer, 4 Quellen mit Links in neuem Tab). Für 14 und 10 Jahre aber nur "keine einzelne Grenze"; siehe Befund M4.

## Befunde

### Blocker
Keine.

### Hoch
- H1. Chat-Seite ohne Altershinweis. Seite /chat, Abschnitt "Live ausprobieren" (Screenshots 09, 10, 11). Der Hinweis "Für Kinder unter 16 ... gemeinsam mit einer erwachsenen Person" steht auf Elternseiten, im Willkommens-Fenster, auf "Ist das sicher?", aber nicht auf der Seite, auf der das Kind schreibt. Im Volltext der Seite kommen "16", "Eltern", "Kinder" und "erwachsen" nicht vor (Volltextsuche). Ein Kind, das über Suche oder Link direkt im Chat landet, sieht nur "Antwort eines KI-Modells. Sie kann falsch sein". Eltern verlassen sich darauf, dass die Stelle selbst warnt. Vorschlag: eine Zeile im Chat-Kasten, zum Beispiel "Unter 16: bitte mit einer erwachsenen Person zusammen."

### Mittel
- M1. Du und Sie gemischt auf Elternseiten. Seiten /eltern-zuhause, /zusammen-ausprobieren, /bildschirmzeit, /sicherheit-einfach (Screenshots 04, 13, 15, 17, 19). Hinweiskasten "Du liest gerade kurz: Du siehst die Kernsätze ..." duzt, die Seite siezt; Boxen "Das nimmst du mit" neben "Zeigen Sie wenige ..." im selben Kasten; Quizfragen siezen, die Rolle "Eltern" hat "KI im Alltag Ihrer Kinder", das Willkommens-Fenster duzt. Für Erwachsene, die gesiezt werden wollen, wirkt das unfertig.
- M2. Duplex-Falle beim Kartenset. PDF kartenset-eltern.pdf (Screenshot 12). Die Auflösung ist Seite 4, direkt hinter den Karten 7 bis 12 auf Seite 3. Wer doppelseitig druckt, hat die Lösung auf der Rückseite der Karten. Hinweis "Nicht doppelseitig drucken" oder Seite 4 mit Leerseite trennen fehlt; die Spielregeln sagen nur "Drucken Sie die Seiten 2 und 3 aus".
- M3. Druckansicht der Lektion gibt nur den Kurz-Modus aus. /zusammen-ausprobieren mit emulierter Print-Media und `page.pdf()` (Screenshot 24): 3 Seiten, aber Experiment 1 bis 3 nur als je ein Satz, Gesprächsfragen und Schrittfolge fehlen; dafür sind die drei Quizfragen mit Radiokreisen gedruckt. Wer die Anleitung an den Küchentisch drucken will, bekommt nicht die Anleitung. Druck sollte immer den ausführlichen Text zeigen und das Quiz weglassen.
- M4. Bildschirmzeit für 10 und 14 Jahre ohne greifbare Orientierung. /bildschirmzeit: "Für ältere Kinder und Jugendliche gibt es keine einzelne wissenschaftlich belegte Grenze." Das ist ehrlich, hilft einer Mutter mit zwei Altersstufen aber nicht. Ein Hinweis auf die klicksafe-Seite mit Altersstufen steht nur als Quelle am Ende. Ergänzen: zwei, drei Beispiele je Altersgruppe (kein Regelwerk), etwa "Geräte aus beim Essen und eine Stunde vor dem Schlafen".
- M5. Technische Fehlermeldung bei Serverfehlern. /chat, Anfrage mit simuliertem Status 503 (Screenshot 30): "Der Jetson antwortet mit Fehler 503." Kein Handlungshinweis, kein Wort für eine Mutter ("Jetson" erklärt nur die Startseite). Die Meldung bei echtem Netzausfall (Screenshot 31) ist dagegen gut ("Warte einige Sekunden und versuche es noch einmal"). Die Ausfall-Karte "ausgelastet" habe ich nicht auslösen können, daher nicht beurteilt.
- M6. Menü ohne gewählte Rolle führt nicht zu den Elternseiten. Screenshot 18: "Für dich" zeigt Start, Neu hier, In 15 Minuten, Rolle wählen, Alle Bereiche. Wer das Willkommens-Fenster mit "Später entscheiden" schließt, findet Eltern nur über "Alle Bereiche" oder die Rollenchips auf der Startseite.

### Klein
- K1. Satz "Sitzen Sie dabei, wenn Sie den Chat nutzen." (/eltern-zuhause, Abschnitt "Was das Sprachmodell kann", Genau-Modus). Doppelt gemoppelt und wegen "Sie ... Sie" missverständlich.
- K2. "Echte Kunden-, Mandanten- oder Personaldaten gehören nicht hinein." (/sicherheit-einfach, Kopf, Screenshot 19) ist Betriebssprache, bei einer Elternrolle verwirrend. Besser: "Keine echten Namen, Adressen oder Passwörter eintippen."
- K3. /echt-oder-ki?weg=eltern bietet das allgemeine "Kartenset Echt oder KI?" (2 Seiten, ohne Auflösung), nicht das Elternset mit Spielregeln für zwei, obwohl das QR-Ziel des Elternsets gerade diese Adresse ist. Text darunter "Mit Freunden spielen" statt "Mit Ihrem Kind". Auch "Tastatur: 1 für Echt, 2 für KI" erscheint auf dem Handy (Screenshot 29).
- K4. Statusmarke im Chat zeigt "Modell im Speicher, Rechner rechnet gerade" auch dann noch, wenn die Anfrage gescheitert ist (Screenshot 30, 31).
- K5. Nach dem Senden springt die Seite so, dass die eigene Frage unter der Kopfleiste verschwindet (Screenshot 10).
- K6. Leere Fläche über dem Chat-Verlauf, etwa 100 px zwischen Trennlinie und Text, vor der ersten Frage (Screenshots 09, 21).
- K7. Visual-Raster in einer Karte in der Karte (weißer Kasten mit Rand um ein weiß umrandetes Raster, Screenshot 06); dezent, aber doppelt.
- K8. Inline-Links im Fließtext nur 20 px hoch (Echt oder KI?, Bildschirmzeit, Experimente ...), Radios 13x13 px (Quiz). Die Labels sind groß, daher nur klein bewertet.

### Was gut ist
- Fokus: Überspringen-Link zuerst, 3 px Fokusrahmen, sinnvolle Reihenfolge.
- Kein Horizontal-Scroll, keine Konsolenfehler außer dem erwarteten 404 auf der Fehlerseite.
- 404-Seite mit Startseite, Suche und Vorschlägen (Screenshot 23).
- Wartehinweis im Chat: "Das Modell wird geladen, das dauert beim ersten Mal bis zu einer Minute. Bisher 4 s" mit Stopp-Knopf (Screenshot 10); Ergebnis zeigt Tokens pro Sekunde und Wartezeit.
- Dunkelmodus: Kontrast und Karten sauber (Screenshots 20, 21).
- Kartenset-PDF mit Lizenzangaben, Auflösung und Gesprächsfragen.

## Empfehlung
Das Labor trägt für Eltern gut: die Rolle führt direkt zu Sicherheit, Experiment und Kartenset, und die Aussagen sind ehrlich. Vor 8,5 sollten der Altershinweis im Chat selbst (H1), einheitliches Sie auf den Elternseiten (M1) und ein brauchbarer Ausdruck der Anleitung samt Duplex-Hinweis (M2, M3) stehen.

## Die drei größten Lücken Richtung 10
1. Der Schutzhinweis für unter 16 gehört an den Ort der Nutzung (Chat-Kasten) und nicht nur auf Elternseiten.
2. Ein sauberes Sie auf allen Seiten der Rolle "Eltern" (Hinweiskasten, "Das nimmst du mit", Quiz, Willkommens-Fenster) und kein Betriebsvokabular.
3. Druck und Altersstufen: Anleitung immer ausführlich drucken (ohne Quiz), Duplex-Hinweis am Kartenset, und für Bildschirmzeit je Altersgruppe konkrete Beispiele.
