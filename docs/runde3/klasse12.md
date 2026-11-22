# Prüfrunde 3: Schüler Klasse 12 (Mehmet, 17, Laptop 1440x900)

Stand: 22.11.2026. Geprüft gegen https://192.168.178.83:8443, Chromium headless über tests/browser.mjs (Viewport 1440x900, hell und dunkel, einmal 1024x700). Screenshots (23 Stück) liegen in /tmp/r3k12/: 01-willkommen, 02-schueler-start, 03-verstehen-start, 04-menue-alle, 10-nn-oben, 12-nn-training, 13-mathe, 14-nn-3x8, 20-suche-abitur, 20-suche-backpropagation, 31-chat-leer-senden, 33-chat-antwort, 40-quiz-falsch, 50-schule2, 60/61/62 (dunkel), 71/72-video, 80-tab, 86-einwilligung, 91-embedding-ergebnis, 95-tokenizer, 96-schmal. PDFs: /tmp/r3k12/pdf/ (Arbeitsblatt KI 2, Lösungsblatt KI 2, Arbeitsblatt Medien 1, Kartenset), mit pdftoppm -r 60 geöffnet und angesehen, QR-Code mit jsQR dekodiert.

Last: eine einzige Sprachmodell-Anfrage (Chat, Erdbeere-Frage), danach keine weitere. "Zu viele Anfragen" trat nicht auf. Der Rechner zeigte zwischendurch "zu 61 Prozent ausgelastet" (andere Prüfer), kein Einfluss auf meine Läufe.

Meine Rolle: Abi-Seminar KI (Neuronale Netze, LLM, RAG, Bias). Ich prüfe, ob Einstieg, Tiefe und Quellen jetzt tragen.

## 1. Gesamtnote: 8,0 von 10 (Vorrunde 7,5)

Kurzurteil: Handwerklich und fachlich hat sich viel gebessert (Fehlerfälle, Korrekturen F1 bis F6 zu etwa vier Fünfteln, Glossar in der Suche, "Mit Mathe", Willkommens-Fenster). Die zwei Dinge, die mir in Runde 2 am meisten fehlten, sind aber nicht da: Quellen zum Nachschlagen (null externe Links auf allen 60 Lernseiten) und ein Weg für Abitur und Seminar. Das Willkommens-Fenster hat keine Rolle für mich, "Ich bin Schüler:in" führt in einen Mittelstufen-Pfad.

## 2. Raster (zehn Kriterien, streng)

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit fürs Alter | 8 | Kurz-Modus trägt die Kernsätze, Fachwörter sind erklärt, die Glossarkarte nennt Backpropagation, Gradient, Attention sauber. Abzug: Quizfrage 1 auf Neuronale Netze verweist auf das "Team-Beispiel" (Grillbesitzer), das nur im Abschnitt "Beispiel aus dem Alltag" steht, im Kurz-Modus aber ausgeblendet ist (kommt nur in "Genau lesen" vor, 13.059 Zeichen gegen 6.517). |
| 2 | Einstieg und Führung | 7 | Willkommens-Fenster erscheint nach 1,2 s, Rollenwahl in einem Klick, Startseite 1,5 s später (01, 02, 03). Aber: keine Rolle für Oberstufe, Abitur oder Studium. "Ich bin Schüler:in" zeigt "Experimente, leicht erklärt" mit Punkte-Labor, Echt oder KI?, Hausaufgaben (02-schueler-start.png), "Ich will KI verstehen" einen Neun-Schritte-Pfad ab "Was ist KI?" mit Fake News als Schritt 3 (03). Neuronale Netze liegt erst als Schritt 5 von 9. Eine Zeile zu Aufwand für ein Seminar oder zum Zitieren fehlt. |
| 3 | Lernwirkung | 8 | Spirale: 1 Schicht, 4 Neuronen nach 5.772 Schritten Verlust 0,60 und 24 von 40 Testpunkten. 3 Schichten, 8 Neuronen nach 8.940 Schritten Verlust 0,00 und 40 von 40 (14-nn-3x8.png). Der Unterschied zwischen "Training" und "Test" ist sichtbar. Mit Mathe jetzt ein durchgerechnetes Neuron (0,5·2 + (−1)·3 + 1 = −1, Schwelle, Ausgabe 0). Es fehlen weiter Verlustformel, Backpropagation-Beispiel, Softmax, Fairnessmaße. |
| 4 | Motivation und Spaß | 8 | Die Spirale lösen und das Zusehen, wie die Grenze entsteht, bleibt der Höhepunkt. Der Tokenizer zerlegt "Donaudampfschifffahrtsgesellschaft 12.10.2025" mit dem echten Modell in 20 Token (95-tokenizer.png), "2025" wird "202" und "5". Das Chat-Modell sagt zu "r in Erdbeere" wieder "drei Mal" (richtig: zwei), ein gutes Lehrbeispiel, aber ohne Verweis zur Tokens-Seite. |
| 5 | Labore und Interaktion | 8,5 | Netz-Lab: Mit etwa 250 px Scroll sind Regler und Ergebnis zugleich sichtbar (14-nn-3x8.png), Verlustkurve, Kennzahlen, "Pause"/"Ein Schritt"/"Zurücksetzen". Chat: erstes Token nach 1,0 s, 6,5 Token/s (Vorrunde 15,9 s und 3,2 Token/s), Live-Erklärung mit Zeitstreifen. Embeddings: 3,5 s bis zum Ergebnis, Live-Erklärung warnt selbst ("Karte ist nur eine Skizze und verliert Information"). Abzug: Regler und Ergebnis liegen beim Seitenaufruf weiter nicht zugleich im Bild (12-nn-training.png, Ergebnisbild unten angeschnitten). |
| 6 | Videos | 7 | "Wie ein Modell lernt": 1:23 (Header) bzw. 82,7 s (Datei), deutsche Untertitel standardmäßig an, Kapitelleiste mit 6 Marken, Klick auf 0:27 springt dahin und die Leiste hebt es hervor (71-video-kapitel.png). Verweis "Der Verweis am Ende der Folge meint diese Seite" steht unter dem Player, Hinweis "Sprecherstimme KI-erzeugt". Abzug: Standbild im Player zeigt ein Bild aus der Mitte (NN: "Schichten", "Was ist KI?": "Ineinander gesetzt"), nicht den Anfang. Ende des Videos: Abblende auf Schwarz, kein Abschlussbild mit Verweis (72-video-ende.png). Bild und Ton nicht gewertet (headless). Für Tiefe weiter zu kurz. |
| 7 | Navigation und Orientierung | 8 | Die Suche ist deutlich besser: "backpropagation", "gehirn" (Neuron), "chatgpt", "transformer", "bias", "gradient", "lernrate", "attention", "halluzination" liefern eine Glossarkarte "Begriff erklärt" plus Seiten (20-suche-backpropagation.png). Leer bleiben "softmax", "overfitting", "seminararbeit", "ki-gesetz" (Hinweis "Dazu habe ich nichts gefunden" mit Vorschlägen Chat, Datenschutz, Hausaufgabe, die für meine Frage nicht passen). "abitur" findet nur die Handreichung für Lehrkräfte und zeigt darüber einen leeren grauen Balken (20-suche-abitur.png). "mathe", "quelle", "referat", "wer haftet" liefern keinen Treffer, den ich auslesen konnte. Menüsymbol: Maschinelles Lernen, Daten, Neuronale Netze, Training zeigen alle dasselbe Streudiagramm-Icon; Fairness und Recht dasselbe Info-Icon. Menü- und Seitentitel weichen ab ("Sprachmodelle" gegen "Wie ein Sprachmodell gebaut ist", "Embeddings" gegen "Vektorisieren und Embeddings"). |
| 8 | Vertrauen und Sicherheit | 8,5 | Einwilligung weiter vorbildlich: Wozu, Wohin, Was bleibt, Widerruf, "ab 16, Jüngere nur mit Einverständnis der Eltern, kein Alterscheck", nicht vorangekreuzt (86-einwilligung.png). Auf der Startseite steht dieselbe Altersaussage in der Kachel "Ab wann?". PDFs tragen "Stand 22.11.2026" und nennen Quellen der Operatoren (bildung.rlp.de, IQB). Abzug: kein Autor- und Qualitätshinweis. |
| 9 | Barrierefreiheit und Bedienbarkeit | 7,5 | Tab: Skip-Link zuerst, sichtbarer 3-px-Ring auf Links und Knöpfen (80-tab.png), Suchfeld mit Schattenrand. Dunkel gut lesbar (60, 61, 62). Fehlerstatus im Quiz nur über Farbe (grün/rot) plus Satz "Nicht ganz". Tastatur im Quiz: schon der erste Pfeil nach unten wählt eine Antwort und sperrt die Frage (siehe H2). Der Screenreader liest Netz-Grafiken weiter doppelt (Block "Eingabe 1 verbunden mit Neuron A" zweimal im Text). |
| 10 | Fehlerfälle | 8 | Leeres Senden im Chat: jetzt Meldung "Schreib zuerst eine Frage." in Orange unter dem Feld, Fokus bleibt im Textfeld, Leerzeichen allein werden genauso behandelt (31-chat-leer-senden.png). Kamera ohne Einwilligung: Dialog, "Noch einmal versuchen". Vorbildlich. Offen: Suche ohne Treffer schlägt unpassende Seiten vor. |

## 3. Vergleich zur Vorrunde (docs/runde2/klasse12.md)

Besser:
- Leeres "Senden" im Chat jetzt mit Meldung und Fokus (Vorrunde: stumm).
- Chat-Antwort viel schneller (erstes Token 1,0 s statt 15,9 s; 6,5 statt 3,2 Token/s).
- Suche: Alltags- und Fachwörter "backpropagation", "gehirn", "chatgpt" liefern jetzt Glossarkarten (Vorrunde: leer oder unpassend).
- "Mit Mathe" gibt es jetzt (Schalter mitten auf Neuronale Netze, y etwa 2.600 px) mit durchgerechnetem Neuron. Meine Forderung ist erst zu einem kleinen Teil erfüllt.
- Fachliche Korrekturen: F2 behoben ("Eine niedrige Temperatur macht Antworten gleichförmiger, aber nicht richtiger"), F5 behoben (Überschrift "99 Prozent richtig" passt zur Grafik), F6 teilweise (jetzt "Gender Shades (2018)" und "NIST-Bericht (2019), 189 Algorithmen" genannt, aber ohne Link und Autoren), F4 (Zwei-Neuronen-Satz) nicht mehr im Text, F3 abgeschwächt ("meist nah beieinander") und das Lab selbst warnt. F1 nur halb: "Die meiste KI ist spezialisiert", aber der Folgesatz "Die meisten Systeme können genau ihre Aufgabe" passt weiter nicht zu einem Sprachmodell, das im Chat-Lab Zählen, Übersetzen und Schreiben kann.
- Willkommens-Fenster mit unscharfem Hintergrund, Schließkreuz, "Später", Hinweis "Nichts wird gesendet" (01-willkommen.png).
- Arbeitsblätter und Lösungsblätter als PDF mit Niveau-Markern (Basis, Standard, Herausforderung), Operatoren mit Anforderungsbereich I bis III, QR-Code auf die Seite (dekodiert: https://ki-labor.daniel-alisch.site/schule-stunde-2?weg=schule, Seite antwortet 200), Stand und Quellen im Fuß. Für mich als Oberstufe nützlich als Struktur, auch wenn es "Klasse 8" ist.

Gleich:
- Null externe Quellen: Auf allen geprüften Lernseiten 0 externe Links (Skript über 88 Seiten). Nur Lizenzen und Quellen (30 Links, reine Lizenzliste), Selbst bauen (2 Links) und die Datenschutz-Seiten haben welche. "Gender Shades" und NIST sind ohne Fundstelle.
- Kein "So zitierst du diese Seite", keine Autoren- und Qualitätsangabe, kein Seitendatum auf den Lernseiten (nur auf Schulleitung und Eltern: "Stand 22.11.2026").
- Fehlende Tiefe: kein Softmax (Suche "softmax" leer), keine Kreuzentropie, keine Backpropagation-Rechnung, kein Attention-Q/K/V, keine Fairnessmaße.
- Regler und Ergebnis im Netz-Lab nicht gleichzeitig beim Seitenaufruf.
- Quizfragen auf Neuronale Netze weiter Grundniveau, nur die Parameterfrage (3, 4, 1 ergibt 21) ist Anwendung.

Schlechter:
- Neu im Quiz: Pfeiltasten committen eine Antwort (H2). In der Vorrunde nicht geprüft, daher nur als Befund, nicht als Rückschritt gewertet.
- Quizfrage 1 hängt an einem Beispiel, das im Standard-Modus unsichtbar ist (H3).

## 4. UX- und UI-Befunde nach Schwere

Blocker: keine.

Hoch
- H1. Kein Pfad und keine Quellen für Oberstufe, Abitur, Studium. Willkommens-Fenster (01-willkommen.png): sechs Rollen, keine passt ("Ich bin Schüler:in" liefert Experimente, Echt oder KI?, KI und Hausaufgaben, Gute Fragen, Was ist KI?; Kamera-Hinweis "ab 16, im Schulpfad nicht nötig"). Auf Lernseiten kein Weiterlesen, keine Fundstellen (Neuronale Netze, Training, Verzerrung, RAG-Embedding geprüft). Wer ein Referat schreibt, kann diese Seite nur als Veranschaulichung nutzen.
- H2. Quiz per Tastatur nicht bedienbar. Seite Neuronale Netze, Abschnitt "Teste dich": Fokus auf Frage 3, ein Druck auf Pfeil nach unten wählt die zweite Antwort und sperrt die Frage sofort (alle Optionen disabled, richtige Antwort wird grün). Eine Tastaturnutzerin kann nicht erst durch die Antworten gehen und dann bewusst wählen. Kein "Nochmal" nach falscher Antwort (40-quiz-falsch.png).

Mittel
- M1. Suche "abitur": über dem Ergebnis ein leerer grauer Balken (20-suche-abitur.png, y etwa 186). Kein Treffer für "mathe", "quelle", "referat" oder "wer haftet", obwohl "Mit Mathe" und Verantwortungsseiten existieren. Keine Treffer für "softmax" und "overfitting" (Überanpassung wird im Lab gezeigt).
- M2. Quizfrage 1 (Neuronale Netze) nimmt Bezug auf das Team-Beispiel, das im Standard-Modus "Kurz lesen" nicht erscheint.
- M3. Lesezeit: "ca. 1 Min Lesen" auf Seiten mit 8 Abschnitten und 6.500 Zeichen (Neuronale Netze, Wie ein Modell lernt). Das passt zum Kurz-Modus mit eingeklappten Abschnitten, aber "plus Video 1:20, plus Labor ca. 3 Min" lässt den Aufwand unterschätzen (Genau lesen ist doppelt so lang).
- M4. Video-Standbild zeigt nicht den Anfang, sondern ein Bild aus der Mitte (Neuronale Netze: "Schichten", Was ist KI?: "Ineinander gesetzt", 10-nn-oben.png, 20-suche-abitur.png). Kein Abschlussbild nach dem Ende (72-video-ende.png).
- M5. "Mit Mathe" liegt als einzelner Schalter mitten im Text (13-mathe.png), nicht in der Kopfleiste neben "Kurz lesen / Genau lesen", und nur auf einer Seite. Der Mathe-Inhalt ist ein einziges Rechenbeispiel für ein Neuron.
- M6. Menüsymbole sind nicht unterscheidbar (Streudiagramm bei vier Seiten, Info-Kreis bei zwei), Menü- und Seitentitel weichen oft ab. "Fairness und Verantwortung" im Menü, "Fairness, Verzerrung und Verantwortung" als Titel.
- M7. Arbeitsblatt KI 2, Zusatz: "mehr als 90 von 100 Punkten" für die Spirale, das Lab zählt 40 Testpunkte (160 Trainingspunkte). Die Zahl passt nicht zum Labor.

Klein
- K1. Chat und Embeddings: Gruppenbezeichnungen "Antwort" und "Anzeige" sitzen eng zwischen Beispielknöpfen und Einstellungskarte (33-chat-antwort.png, 91-embedding-ergebnis.png, Abstand etwa 6 px, sonst überall 24 bis 30 px).
- K2. Chat: Statusfeld "im Speicher" und Knopf "Modell laden" nebeneinander. Wenn das Modell schon im Speicher ist, ist "Modell laden" widersprüchlich. Zwischen Kopfzeile und Eingabe eine leere Fläche von etwa 70 px (31-chat-leer-senden.png).
- K3. Der Hinweiskasten "Du liest gerade kurz: ..." ist schmaler als alle Karten (625 px gegen 895 px, 13-mathe.png).
- K4. Kopfzeile "Grundlagen · Lektion ·" endet auf einen Punkt (10-nn-oben.png), bei "Was ist KI?" steht "Lektion 1 ·".
- K5. Netz-Grafiken werden vom Screenreader doppelt gelesen.
- K6. Willkommens-Fenster Rolle "Ich bin Schüler:in" sagt "Experimente, leicht erklärt / Kamera, Mikro und Gesicht ab 16", das ist für 17-Jährige verwirrend, weil die Startseite dann "Ohne Kamera" bewirbt.

Was gut ist (UI)
- Gleichmäßiges Kartenraster auf den Startseiten (drei Spalten, gleiche Höhen, Abstände 24 px, 02, 03), Icons aus einem Satz (lucide-Stil), klare Fokusringe, Dunkelmodus mit gutem Kontrast (Fließtext 174/174/178 auf Schwarz).
- 1024 px Breite: kein horizontaler Scroll, Menü bleibt links (96-schmal.png).
- Ladezeiten: Seitenwechsel unter einer Sekunde, Willkommens-Fenster 1,2 s, Embedding-Ergebnis 3,5 s, Chat 1,0 s bis zum ersten Token mit sichtbarer Wartebalkenanzeige.
- Konsole und Netzwerk: in allen Läufen keine Fehler.

## 5. Zielaufgaben der Persona

| Aufgabe | Gelöst? | Klicks, Sekunden |
|---|---|---|
| Einen Weg für mein Abi-Seminar finden | teilweise | 1 Klick "Ich will KI verstehen", 1,5 s. Der Pfad führt zu Neuronale Netze erst bei Schritt 5 von 9, kein Abitur-Hinweis. |
| Spirale mit 3 Schichten lösen | ja | Spirale, zwei Regler, "Training starten": 4 Aktionen, 12 s bis 40 von 40. |
| "Backpropagation" nachschlagen | ja | 1 Eingabe, Karte in 0,5 s, danach Verweis auf Training und Neuronale Netze. |
| Etwas mit Mathe sehen | teilweise | Seite öffnen, bis zum Schalter scrollen (etwa 2.600 px), 1 Klick. Nur ein Rechenbeispiel. |
| Bias-Studie finden zum Zitieren | nein | Name genannt, kein Link, keine Quelle. |
| Quiz lösen und Fehler sehen | ja, mit Haken | Falsche Antwort: 1 Klick, sofortige Erklärung. Per Tastatur nicht sinnvoll bedienbar (H2). |
| Chat: leere Eingabe senden | ja | 1 Klick, Meldung in unter 1 s. |
| Video ansehen | ja | Kapitel 0:27 anklicken, Untertitel laufen. Bild und Ton nicht gewertet. |
| Arbeitsblatt als PDF laden und öffnen | ja | 1 Klick "Herunterladen", Datei ki-labor-arbeitsblatt-stunde-2.pdf, 3 Seiten, Layout sauber (arbeitsblatt-stunde-2-1.png, -3.png). |

## 6. Was habe ich verstanden (3 Sätze)

Ein Neuron bildet y = f(Summe aus Gewicht mal Eingabe plus b), und ohne die Aktivierung f ließen sich alle Schichten zu einer zusammenfassen. Beim Training verschiebt man die Gewichte per Gradientenabstieg entlang des Verlusts, und das Test-gegen-Training-Bild zeigt, ob das Netz nur auswendig lernt. Ein Sprachmodell zerlegt Text in Token, rechnet mit Aufmerksamkeit und zieht das nächste Stück aus einer Verteilung, deshalb verzählt es sich ("drei Mal" r in Erdbeere) und muss geprüft werden.

## 7. Empfehlung und größte Lücken

Empfehlung: Ja, für den Einstieg und zum Üben im Seminar, das Netz-Lab und der Token-Zerleger sind echte Erklärwerkzeuge. Als Quelle für eine Seminararbeit würde ich die Seite weiter nicht nennen, weil nichts davon nachschlagbar ist.

Die drei größten Lücken Richtung 10:
1. Quellen und Weiterlesen: pro Lektion 3 bis 5 echte Fundstellen mit Link (Gender Shades, NIST, Transformer-Paper, ein Lehrbuch oder Vorlesung mit Mathe), Seitendatum, Autor und Qualitätsangabe, "So zitierst du diese Seite". Gender Shades und NIST sind schon im Text genannt und brauchen nur noch den Link.
2. Ein Weg für Oberstufe, Abitur und Studium: eigene Rolle im Willkommens-Fenster mit Pfad (Neuronale Netze, Wie ein Modell lernt, Sprachmodelle, Embeddings, RAG, Fairness, Grenzen) und Aufwandsangabe. "Mit Mathe" in die Kopfleiste und auf Training, Bewertung, Sprachmodelle, Fairness ausdehnen (Verlust, Backpropagation mit Zahlen, Softmax, Fairnessmaße).
3. Quiz und Suche nachschleifen: Antwort erst nach Bestätigung sperren (Tastatur), "Nochmal" anbieten, Anwendungsfragen ergänzen, Quizfrage 1 ohne Bezug auf ein verstecktes Beispiel, Suchtreffer für "softmax", "overfitting", "mathe", "quelle", "referat", leeren Balken bei "abitur" entfernen.
