# Prüfrunde 5: Burak, 16, Klasse 11, Laptop 1440x900 (23.11.2026)

Testadresse https://192.168.178.83:8443, headless Chromium, hell und dunkel, Erstbesuch mit Willkommens-Fenster und Einwilligungsdialog. Screenshots (35 Stück, alle angesehen bzw. im Text belegt) in /tmp/r5-burak/. Nur Lesen und Browser, keine Änderungen.

## Gesamtnote: 8,6

| Kriterium | Note | Beleg in einem Satz |
|---|---|---|
| 1 Verständlichkeit fürs Alter | 9 | Kurze Sätze, Fachwörter wie Gewicht, Aktivierung, Verlust werden erklärt und für Oberstufe unter "Mit Mathe" vertieft. |
| 2 Einstieg und Führung | 8,5 | Willkommens-Fenster, Rollenwahl und Schul-Startseite führen in zwei Klicks zum Oberstufen-Pfad. |
| 3 Lernwirkung | 9 | Rechenbeispiele mit Zahlen zum Nachrechnen, alle von mir nachgerechnet und korrekt (z. B. 0,033 nach einem Schritt, 21 und 78 500 Parameter). |
| 4 Motivation und Spaß | 8,5 | Netz-Spielplatz lernt sichtbar in Sekunden, aber nichts Programmierbares zum Mitnehmen. |
| 5 Labore und Interaktion | 8,5 | Netz-Spielplatz sehr gut; Chat im Test 44,6 s bis zum ersten Zeichen, dann 6,5 Tokens/s. |
| 6 Videos | 8,5 | 1:20, Kapitelliste, Untertitel schaltbar, Verweis am Ende erklärt; ich habe nur die ersten Sekunden gespielt, nicht die ganze Folge geprüft. |
| 7 Navigation und Orientierung | 8,5 | Suche stark ("Neuron", "Gewicht"), aber "Abitur" und "Oberstufe" führen nicht zum Pfad. |
| 8 Vertrauen und Sicherheit | 9 | Einwilligung ausführlich und verständlich, 16+ klar, Kopf- und Datenangaben offen; eine Angabe zu Ollama stimmt im LAN nicht (siehe Befunde). |
| 9 Barrierefreiheit und Bedienbarkeit | 8,5 | Tastatur, Fokus, Skip-Link, Quiz per Pfeiltasten funktionieren; Kontrast hell gut; kleinste Schrift 12 px. |
| 10 Fehlerfälle | 8,5 | Leere Eingabe ("Schreib zuerst eine Frage."), 404 mit Suchhilfe, Wartehinweis im Chat; die Ausfall-Karte konnte ich nicht auslösen und werte sie nicht. |

Weiterempfehlen: Ja, an Mitschüler aus der Informatik-Kursstufe. Es erklärt ein Neuron wirklich mit Zahlen und gibt die Quelle der Zahlen an. Für einen, der selbst programmiert, fehlen Code zum Mitnehmen und ein Überblick, wie die Technik zusammenhängt.

## Befunde

### Blocker
Keine.

### Hoch
1. **Chat zeigt Code als Rohtext.** Seite /chat, Abschnitt "Live ausprobieren", Frage nach einer Python-Funktion (Screenshot 20-chat-fertig.png). Die Dreifach-Backticks (```python) erscheinen als Text, die Antwort steht in Proportionalschrift ohne Einrückung. Python ist ohne Einrückung nicht kopierbar. Für jemanden, der programmiert, ist das die auffälligste Schwäche im Labor. Es braucht Codeblöcke in Monospace mit Kopieren-Knopf.

### Mittel
2. **Suche findet den Oberstufen-Pfad nicht.** Suche "Abitur" und "Oberstufe" zeigt Neuronale Netze, Training, Bewertung, Embeddings, Fairness, Referat, alle mit dem gleichen Textschnipsel "Die Formel steht unter Mit Mathe" (12-suche-abitur.png). Den Pfad "Oberstufe und Abitur: Mathe, Quellen, Formeln" (8 Schritte) gibt es nur nach der Rollenwahl Schüler:in auf der Startseite (14-oberstufe-pfad.png). Ohne Rolle gibt es unter "Weitere Wege" einen anderen Pfad "Schule: Vertiefung" (13-weitere-wege.png), der nach dem gleichen Zweck klingt, aber anders heißt. Pfad nicht in der Suche, zwei Namen für fast dasselbe.
3. **Technik-Überblick fehlt.** Wie das Labor technisch läuft, steht verteilt: Betrieb und Sicherheit (Ports, Logs, Schutz), Selbst aufbauen (Befehle), Hardware, Lizenzen (FastAPI, Ollama, faster-whisper, Piper, OpenCV nur als Liste). Eine Skizze "Browser, FastAPI/uvicorn, Ollama, Whisper, Piper, Kamera über WebSocket" mit Datenweg fehlt. Suche "Architektur", "FastAPI", "JavaScript", "Quelltext" liefert nichts; "wie funktioniert das Labor" und "GitHub" funktionieren.
4. **Betriebsseite und LAN-Wirklichkeit passen bei Ollama nicht zusammen.** /betrieb-sicherheit nennt in der Ports-Karte "11434 Ollama, nur lokal". `curl -s http://192.168.178.83:11434/` aus dem LAN liefert 200. Die Seite sagt an anderer Stelle "soll nur lokal hören, prüfe mit ss -tlnp", das ist ehrlich, aber die Karte behauptet es als Tatsache. Entweder Ollama am Jetson auf 127.0.0.1 binden oder die Karte anpassen.
5. **Chat-Wartezeit.** Erste Anfrage: 44,6 s Warten auf das erste Token, Anzeige "Du bist als Nächster dran. Das kann bis zu einer Minute dauern. Bisher 1 s" (17-chat-1s.png). Zweite Anfrage: 60,2 s gesamt (385 Tokens in 58,9 s). Der Hinweis ist ehrlich und die Schätzung stimmt, aber es gibt nur "Bisher x s", keine Schlange-Position, und beim Warten sieht man die Live-Erklärung erst, wenn das erste Token da ist. Gleichzeitig prüften andere Personen, die Zeit ist also nicht allein dem Labor anzulasten.
6. **Formeln als Fließtext.** "Mit Mathe" (08-formel.png) zeigt y = f(w1·x1 + w2·x2 + … + b) in einer Mischung aus Monospace und Proportionalschrift, ohne gesetzte Formel, Indizes als w1, x1. Für Klasse 11 lesbar, aber nicht abiturnah gesetzt. Dazu kein kleines Nachrechen-Werkzeug (Regler für x, w, b, Summe und Ausgabe live), obwohl das Rechenbeispiel dafür fertig vorliegt.

### Klein
7. Die Rechnung steckt hinter einem Schalter "Mit Mathe", der standardmäßig aus ist. Wer "Rechnung" sucht, landet auf der Seite und sieht erst die Kurzfassung mit dem Satz "Die Formel steht unter Mit Mathe". Das ist auffindbar, braucht aber einen Hinweis im Seitenkopf.
8. Druckansicht Training: 12 A4-Seiten, die interaktive Gelände-Anzeige mit Reglern und Knöpfen wird mitgedruckt (tr-01.png), in der Kreislauf-Grafik ist "Eine Runde" vom Kreis angeschnitten (tr-03.png, "Eine  unde"). Sonst sauber: Kopfzeile mit Adresse, schwarz auf weiß.
9. Aufbau-Animationen: Karten wie "Schichten: Merkmale aus Merkmalen" bleiben beim Scrollen etwa 3 s leer oder halb (06-mit-mathe-zu.png, 26-schichten-300.png), erst dann ist das Netz fertig (26-schichten-3000.png).
10. Einwilligungsdialog Gesicht bei 900 px Höhe: der Hauptknopf "Einwilligen und Kamera starten" liegt unter der Falz (y = 921), der Dialog muss gescrollt werden (36-einwilligung-dialog.png). Auf kleineren Laptops noch deutlicher.
11. Lösungsblätter mit dem Hinweis "Nur für Lehrkräfte, nicht an Schüler weitergeben" sind ohne Anmeldung unter /static/materialien/loesung-stunde-2.pdf abrufbar (HTTP 200). Für ein offenes Lernangebot vertretbar, aber der Hinweis klingt dann nach Schutz, den es nicht gibt.
12. Kein Hell/Dunkel-Schalter, das Labor folgt nur der Systemeinstellung. Beide Varianten sind sauber (24, 25), der Dunkelmodus ohne Kontrastprobleme im Mathe-Kasten.
13. Kleinste Schrift 12 px in Diagrammbeschriftungen (z. B. "Verlust über die Schritte"). Meta-Zeilen und Fließtext sonst gut lesbar.
14. Das Chat-Modell lag bei meiner Frage falsch: Beispielausgabe "0.855" für sigmoid(0,5·1,2 − 0,3·2,5 + 0,7), richtig ist etwa 0,634. Das Labor warnt direkt darunter ("Kleine Modelle rechnen schlecht. Rechne selbst nach") und verlinkt Quellen prüfen. Das ist vorbildlich und kein Mangel, nur als Beleg notiert.

## Zielaufgaben

1. **Rechnung zu einem Neuron finden.** Startseite, Suche "Neuron" tippen (Klick 1), Treffer "Neuronale Netze" (Klick 2), "Mit Mathe" einschalten (Klick 3). Etwa 4 s im Test, mit lesen realistisch unter einer Minute. Ergebnis: Rechenbeispiel x1 = 2, x2 = 3, w1 = 0,5, w2 = −1, b = 1, Summe −1, Neuron meldet 0 (08-formel.png). Das vollständige Rückwärts-Beispiel mit Kettenregel steht auf /training unter "Mit Mathe" (Eingaben 1 und 2, Gewichte 0,5 und −0,25, Fehler 0,25 auf 0,033 nach einem Schritt). Alle Zwischenwerte stimmen. Erreicht.
2. **Wie das Labor technisch läuft.** Suche "wie funktioniert das Labor" oder "Jetson": 2 Klicks zu /betrieb-sicherheit (Ports 8443 und 11434, uvicorn, Logs, Schutzmaßnahmen, Origin-Prüfung, Ratenbegrenzung, Warteschlange) und /selbst-bauen (Befehle, Ollama 0.12.3, Modelle llama3.2:3b und nomic-embed-text, GitHub-Link). Die HTTP-Köpfe passen zu den Angaben (CSP, X-Frame-Options, nosniff; /docs liefert 404). Teilweise erreicht: sehr genaue Betriebsangaben, aber kein zusammenhängendes Architekturbild (Befund 3).
3. **Weg für Oberstufe und Abitur.** Startseite, "Ich bin Schüler:in" (Klick 1), Pfad "Oberstufe und Abitur: Mathe, Quellen, Formeln", "Pfad starten" (Klick 2): 3,7 s, landet auf /neuronale-netze?pfad=oberstufe. Acht Schritte: Neuronale Netze, Training, Bewertung, Embeddings, Sprachmodelle, Fairness und Verantwortung, Quellen prüfen, Referat. Erreicht, aber nur mit Rollenwahl; Suche findet den Pfad nicht (Befund 2).

## Weitere gesichtete Bereiche
- Erstbesuch mit Willkommens-Fenster (01-erstbesuch.png): sechs Rollen, Schalter für Lernfortschritt, "Später entscheiden". Klar, Text knapp.
- Neuronale Netze: Video mit Kapiteln und Untertiteln, Netz-Spielplatz (Kreis im Kreis, 4 Neuronen: nach 6 s 39 von 40 Testpunkten, Pause, Ein Schritt, Neu starten, Zurücksetzen), Quiz mit fünf Fragen (Pfeiltasten plus Enter funktionierten, Rückmeldung grün und rot mit Erklärung, 28-quiz-tastatur.png).
- Druck: `page.pdf()` und Druck-Emulation Training, PDF mit pdftoppm angesehen. Arbeitsblatt und Lösungsblatt KI 2 als PDF geöffnet: A4, 4 und 3 Seiten, sauber, QR-Code, Niveau-Markierung.
- Tastatur: Skip-Link zuerst, danach Suche und Menü, durchgehend sichtbarer 3-px-Fokusring.
- Fehlerfälle: leere Chat-Eingabe (32-chat-leer.png), unbekannte Adresse /gibt-es-nicht mit Suchhilfe und Vorschlägen (33).

## Empfehlung
Das Labor erklärt ein Neuron ehrlich und korrekt mit nachrechenbaren Zahlen und ist für Klasse 11 gut nutzbar. Mit Codeblöcken im Chat, einem Nachrechen-Widget und einer Architekturseite kommt es für Programmierinteressierte nahe an die 9.

## Die drei größten Lücken Richtung 10
1. Codeblöcke im Chat und auf den Seiten: Monospace, Einrückung, Kopieren-Knopf; dazu Python-Beispiel zum Neuron zum Mitnehmen.
2. Auffindbarkeit und Technikbild: Oberstufen-Pfad in die Suche ("Abitur", "Oberstufe") und einheitlich benennen; eine Architekturseite mit Skizze (Browser, FastAPI, Ollama, Whisper, Piper), dazu die Ollama-Angabe mit der Wirklichkeit abgleichen.
3. Ein Neuron zum Nachrechnen live (Regler x, w, b, Summe, Aktivierung, Ausgabe) und gesetzte Formeln statt Fließtext in "Mit Mathe".
