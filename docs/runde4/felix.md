# Prüfbericht Runde 4: Felix (17, Klasse 12, Abitur Informatik, Laptop 1440x900)

Testadresse https://192.168.178.83:8443, Playwright mit Chromium headless, helles und dunkles Farbschema, Erstbesuch mit Willkommens-Fenster. Alle Screenshots liegen in /tmp/felix/ (01 bis 24, dazu zwei PDF-Seitenbilder). Gesehen und gewertet habe ich 18 Bilder, darunter Willkommens-Fenster, Startseite, Suche, Lernseite mit Mathe, Gelände-Labor, Netz-Labor (dunkel), Chat (leer, wartend, Antwort), Video, Quiz, 404, Arbeitsblatt-PDF.

## Gesamtnote: 8,4 von 10

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter | 9 | Kurz lesen mit Kernsätzen, Alltagsbeispiele, Fachwörter antippbar; Mathe getrennt zuschaltbar |
| 2 | Einstieg und Führung | 8 | Willkommens-Fenster klar, aber keine Rolle für die Oberstufe (siehe Befund 1) |
| 3 | Lernwirkung | 9 | Rechenbeispiele nachgerechnet und korrekt, Quiz mit Erklärung, Lernziele, "Das nimmst du mit" |
| 4 | Motivation und Spaß | 8 | Gelände-Kugel und Netz-Spielplatz sofort bedienbar; wenig Erfolgserlebnis ohne eigene Aufgabe |
| 5 | Labore und Interaktion | 8,5 | Labore laufen ohne Fehler; Chat meldet Wartezeit, Zeitbalken erklärt, wo die Zeit hinging |
| 6 | Videos | 8 | Kapitelmarken, deutsche Untertitel, 1:20, Hinweis, dass der Verweis am Ende die Seite meint; kein Posterbild |
| 7 | Navigation und Orientierung | 7,5 | Suche stark, aber Oberstufenpfad versteckt und Pfadkontext geht verloren |
| 8 | Vertrauen und Sicherheit | 8,5 | "Ist das sicher?", Altershinweis 16+, Hinweis "Antwort kann falsch sein" im Chat |
| 9 | Barrierefreiheit und Bedienbarkeit | 8,5 | "Zum Inhalt springen", Tastatur im Quiz (Radio-Fokus), guter Kontrast hell und dunkel |
| 10 | Fehlerfälle | 8 | Leere Eingabe: orange "Schreib zuerst eine Frage."; unbekannte Adresse: "Seite nicht gefunden" |

## Zielaufgaben

1. **Rechnung zum Training eines Neurons.** Gefunden in 4 Schritten, etwa 30 Sekunden: Suche "Neuron", dann "Neuronale Netze" und "Training" (beide in der Suche sichtbar), dort den Schalter "Mit Mathe" einschalten. Inhalt: Neuron y = f(w1·x1 + … + b) mit Zahlenbeispiel (Summe −1, Ausgabe 0), mittlerer quadratischer Fehler (0,065 nachgerechnet, stimmt), Kreuzentropie (−ln 0,8 ≈ 0,223 stimmt), Kettenregel für ein Sigmoid-Neuron (∂L/∂w = 2(ŷ−y)·σ(z)(1−σ(z))·x, stimmt) und Update-Regel mit Zahlen (w: 0 → 0,6 → 1,08, stimmt). Erfüllt. Allerdings steht die komplette Rechnung "Neuron trainieren: Eingabe, Vorwärts, Fehler, Gradient, neues Gewicht" nicht in einem durchgehenden Beispiel, sondern verteilt auf drei Mathe-Kästen in zwei Seiten.
2. **Weiterlesen zu Embeddings oder Fairness.** Erfüllt, 3 Klicks, etwa 20 Sekunden. Beide Seiten haben unten einen Abschnitt "Weiterlesen" mit Quellen und Jahr (Mikolov 2013, Sentence-BERT 2019, Lewis et al. 2020; Buolamwini/Gebru 2018, NIST 8280, ProPublica 2016, Hardt/Price/Srebro 2016, Barocas/Hardt/Narayanan, Model Cards 2018) und einer fertigen Zitierzeile. Links gehen zu Nature, arXiv und deeplearningbook.org. Im Modus "Kurz lesen" ist der Abschnitt zugeklappt und der Link-Text der Einträge leer (nur die URL), siehe Befund 4.
3. **Weg für die Oberstufe.** Nur mit Mühe erfüllt: 2 Klicks plus Scrollen, etwa 25 Sekunden, und nur, weil ich "Weitere Wege" geöffnet und lange gescrollt habe. Dort steht der Pfad "Oberstufe und Abitur" (7 Schritte, ca. 10 Min Lesen, Video 11:38, Labor 15 Min) mit passender Beschreibung (Formeln, Quellen, Referat, Seminararbeit). Im Willkommens-Fenster und in der Rollenwahl gibt es ihn nicht.

## Befunde

**Blocker:** keine.

**Hoch**
1. **Oberstufe nicht auffindbar.** Willkommens-Fenster (Screenshot 01) und "Wofür bist du hier?" (Screenshot 11) bieten sechs Rollen, keine für Oberstufe oder Abitur. Der Pfad "Oberstufe und Abitur" liegt erst weit unten unter "Weitere Wege", Lernpfade, "Nach Rolle" (Screenshot 13). Die Rolle existiert im Code (content-laien.js: `oberstufe`), wird aber nicht angeboten. Wer in der Oberstufe ist, wählt "Schüler:in" und landet bei "Experimente, leicht erklärt" (Screenshot 02), das für Klasse 12 zu leicht wirkt. Die Suche nach "Oberstufe" findet die richtigen Seiten, nennt den Pfad aber nicht.
2. **Pfadkontext geht verloren.** Wer "Oberstufe und Abitur" startet, landet auf Neuronale Netze, dort steht "Pfad „Verstehen", Schritt 5 von 9", und "Nächste Seite" führt zu "Wie ein Modell lernt". Beim Training lautet die Folgeseite "Wie ein Sprachmodell gebaut ist", nicht Bewertung, Embeddings, Verzerrung wie im Oberstufenpfad beschrieben. Der gewählte Weg bleibt also nicht erhalten.

**Mittel**
3. **Mathe-Schalter schwer zu finden.** "Mit Mathe" ist eine kleine graue Kapsel mitten auf der Seite (Screenshot 07, 08), nicht in der Kopfleiste neben "Kurz lesen / Genau lesen", und standardmäßig aus. Ich hätte die Formeln ohne Suche nach "Mathe" nicht erwartet. Auf Bewertung und Sprachmodelle ist der Schalter ebenfalls da, die Zahlen erscheinen aber erst nach dem Einschalten; der Oberstufenpfad verspricht das, sagt aber nicht, wo.
4. **Weiterlesen:** im Kurzmodus zugeklappt, Quellen-Links ohne lesbaren Text (innerText leer, nur Pfeil/Symbol). Für Screenreader und für Felix, der Quellen sammeln will, fehlt ein Linktext wie der Titel. Zitierlink "Link zur Seite" zeigt auf die öffentliche Domain, nicht auf die Testadresse (zu erwarten, aber im Test unprüfbar).
5. **Chat und Mathe.** Die Frage zum Sigmoid-Gradienten wurde vom 3B-Modell falsch beantwortet ("…zu −y \* (1−y) addiert", Screenshot 18). Der Hinweis "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." steht da, aber die Seite sagt nicht, dass kleine Modelle bei Mathe besonders schwach sind. Für die Oberstufe wäre genau das ein guter Lernmoment ("prüfe es mit der Rechnung auf Training").
6. **Suche leer.** Bei "Oberstufe" erscheint über den Treffern ein leerer grauer Balken (Screenshot 12), vermutlich die Begriffs-Karte ohne Inhalt.

**Klein**
7. Die Hash-Adresse `/#/gibt-es-nicht` zeigt still die Startseite, die Pfad-Adresse `/gibt-es-nicht-2` zeigt "Seite nicht gefunden". Uneinheitlich.
8. Das Video hat kein Posterbild (poster leer), der erste Bildausschnitt bei 0:03 ist eine Szene ohne Titel.
9. Statusleiste wechselt zwischen "Der Rechner ist bereit und frei", "Gerade viel los" und "Rechner live, rechnet gerade", obwohl ich allein war (die eigene Anfrage zählt mit). Ohne Erklärung irritiert das kurz.
10. Dunkelmodus: der Seitenhintergrund ist reines Schwarz, die Karten Anthrazit; lesbar, aber hart. Kein Kontrastproblem gefunden.
11. Der Verlauf im Verlustdiagramm ist vor dem Start leer (Screenshot 08, 23); ein Platzhaltertext "Starte das Training" fehlt.

## Gemessen
- Neuronen-Rechnung finden: 4 Klicks, ca. 30 s.
- Weiterlesen: 3 Klicks, ca. 20 s.
- Oberstufenpfad: 2 Klicks plus Scrollen, ca. 25 s (Klick 1: Weitere Wege, Klick 2: Pfad starten).
- Chat: Wartehinweis nach 2,5 s ("Der Jetson rechnet seit 2 s … Mit „Stopp" kannst du abbrechen."), erstes Token nach 5,0 s (Modell laden), 96 Tokens in 25,1 s (3,8 Tokens/s). Gute Rückmeldung, Wartezeit akzeptabel.
- Quiz: Antwort sofort markiert, Erklärung darunter, Tastaturhinweis sichtbar.
- Konsolenfehler: keine in allen Läufen.
- PDF (Arbeitsblatt und Lösung KI 2, je 3 Seiten A4, mit `pdftoppm -r 60` angesehen): sauber, Operatoren und Niveau-Symbole, Zeitplan für 45 und 90 Minuten. Für Felix nicht relevant, aber hochwertig.

## Empfehlung
Das Labor ist inhaltlich stark und fachlich korrekt (Rechnungen stimmen, Quellen aktuell und echt); für die Oberstufe fehlt nur der sichtbare Eingang und ein durchgehender Pfad. Mit Rolle "Oberstufe" im Willkommens-Fenster, erhaltenem Pfadkontext und einem sichtbaren Mathe-Schalter wäre es für mich ein Eins-A-Werkzeug fürs Abitur-Lernen.

## Die drei größten Lücken Richtung 10
1. Rolle "Oberstufe und Abitur" ins Willkommens-Fenster und in "Wofür bist du hier?" aufnehmen und den Pfad nach dem Start durchhalten (Pfadleiste, "Nächste Seite" aus dem gewählten Pfad).
2. "Mit Mathe" in die Kopfleiste (neben Kurz/Genau lesen) legen, bei Rolle Oberstufe automatisch einschalten, und ein durchgehendes Rechenbeispiel "ein Neuron trainieren" mit allen Zwischenschritten anbieten.
3. Quellen-Links mit Titeltext und im Kurzmodus sichtbar; im Chat einen Hinweis, dass kleine Modelle bei Mathe oft falsch liegen, mit Verweis auf die Rechnung zum Nachprüfen.
