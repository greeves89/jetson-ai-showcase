# Runde 3: Tobias (52, Admin und Bastler, Desktop 1440x900)

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443, Chrome headless über tests/browser.mjs, Rolle im Willkommens-Fenster "Ich arbeite in der IT". Gelesen, geklickt, kopiert, nichts installiert, keine Verbindung zum Jetson. Alle Links der Seite "Selbst aufbauen" und "Lizenzen und Quellen" habe ich zusätzlich mit curl auf ihren Statuscode geprüft. Keine Konsolen- und Netzwerkfehler in allen Läufen. Keine Ratenbegrenzung, keine Sprachmodell-Anfrage nötig. Einmal war der Dienst kurz nicht erreichbar (Verbindung abgelehnt, rund zwei Minuten, danach wieder 200), vermutlich ein Neustart durch parallele Prüfer. Die Startseite zeigte zeitweise "Gerade viel los", das war Last durch andere Läufe.

Screenshots liegen in `docs/runde3/tobias-bilder/` (21 Stück, Viewport 1440x900, dazu 1024x768 und 390x844 als Stichprobe).

## 1. Gesamtnote und Raster

**Gesamtnote: 7,5 von 10** (Vorrunde 6,5). Als Wegweiser zur Anleitung 9, als Anleitung selbst 7,5. Die Seite hat jetzt echte Codeblöcke mit Kopierknopf, sudo-Kennzeichnung, Ollama-Version, Preisquelle und Fehlertabelle mit allen 15 Zeilen. Abzüge gibt es für einen fehlenden ersten Schritt (Flashen), einen unbrauchbar gemischten Block, die fehlende Orientierung auf einer 10.300 Pixel langen Seite und dafür, dass die verlinkte Anleitung und der Vorab-Check auf GitHub `main` heute nicht liegen.

| # | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit | 8 | Kurze Sätze, sudo-Gründe stehen am Block ("Warum sudo: Der Installer legt einen Systemdienst an"). Abzug: Das Alltagsbeispiel "Regal" ist für meine Rolle überflüssig, und "zwei Skripte" (Fließtext, "Das nimmst du mit") widerspricht "Drei Skripte" (Merkkasten). |
| 2 | Einstieg und Führung | 9 | Rolle IT: 1 Klick, Startseite "Die Technik dahinter" mit Lektion, Hardware, Lizenzen und Kachel "Quellcode auf GitHub". Fokus im Fenster liegt jetzt auf der Überschrift, nicht mehr auf "Schüler:in". Abzug: Kacheln im Fenster ungleich hoch. |
| 3 | Lernwirkung | 8 | Ich kann acht Befehlsblöcke in der richtigen Reihenfolge ausführen, Version und Pfad stehen da. Ich könnte aber weder flashen (kein Link, keine Version) noch den Dienst prüfen (kein `systemctl status`), noch eine Variable setzen (Fehlertabelle nennt `SHOWCASE_ALLOWED_HOSTS`, aber nicht, wo man sie einträgt). |
| 4 | Motivation und Spaß | 7 | Kopierknopf mit Rückmeldung "Kopiert." ist angenehm, die Hardware-Seite mit Live-Ringen ist Bastlerfutter. Das Quiz fragt weiter Randwissen. Das Erfolgserlebnis "läuft" fehlt: kein Schritt "Im Browser öffnen" mit Erwartung (Zertifikatswarnung, was man sieht). |
| 5 | Labore und Interaktion | 7 | Für meine Rolle nur Hardware (läuft, Werte plausibel: 0 bis 43 Prozent GPU, 3,2 von 7,4 GB) und Quiz. Kein Test des Sprachmodells nötig. |
| 6 | Videos | 6 | Kein Video bei "Selbst aufbauen". Ein kurzes Video zum Flashen wäre der größte Gewinn für Einsteiger. Nicht nötig für meine Aufgaben. |
| 7 | Navigation und Orientierung | 8 | Menü mit Rolle 8 Einträge, Suche deutlich besser (siehe unten). Abzug: Seite ohne Inhaltsverzeichnis und ohne Sprungmarken (siehe Befunde), kein Menüpunkt "Quellcode" oder "Fehlersuche". |
| 8 | Vertrauen und Sicherheit | 8 | Ehrlicher Prüfstand, Preisquelle mit Datum, Lizenzsatz "Du darfst das Labor für dich aufbauen" steht jetzt auf der Seite, alle 15 geprüften Links liefern 200 (Ausnahme: Anleitungsdatei, siehe Blocker). Abzug: Kopfzeile jedes Arbeitsblatts "Lizenz: noch festzulegen". |
| 9 | Barrierefreiheit und Bedienbarkeit | 7 | Skip-Link ist erster Tab-Stopp, Fokusrahmen sichtbar (hell und dunkel), Esc schließt das Fenster. Abzug: Fokus bleibt im Willkommens-Fenster nicht gefangen (Tab nach "Später" springt auf "Zum Inhalt springen" der Seite dahinter), nach Skip-Link bleibt ein blauer Rahmen um den ganzen Inhalt. |
| 10 | Fehlerfälle | 7 | Leere Suche mit Vorschlägen (nicht rollenspezifisch), Quiz erklärt falsche Antworten. Unbekannte Adresse `#/gibt-es-nicht` landet still auf der Startseite ohne Hinweis. Fehlertabelle vollständig, aber schlecht lesbar (Befunde 3). |

Mittelwert 7,5.

## 2. Vergleich zur Vorrunde (6,5)

**Besser**
- Codeblöcke: Vorher kein einziger, jetzt 9 Blöcke mit Titel, Nummer, Kopierknopf und Kennzeichnung "braucht sudo" samt Begründung. Der Zwischenablage-Inhalt stimmt exakt mit dem Block überein (geprüft, Block 5 komplett).
- `sudo` ist Thema: Merkkasten "Mit sudo laufen nur ...", README-Widerspruch "kein Root" kommt auf der Seite nicht mehr vor.
- Ollama 0.12.3 steht im Befehl (`OLLAMA_VERSION=0.12.3`), mit Begründung (Kauderwelsch ab etwa 1100 Tokens) und Hinweis "mit anderen Versionen ungetestet".
- Einkaufsliste: Super-Ausführung genannt, Netzteil (19 V, gehört zum Kit), NVMe M.2 ohne Bauform (ehrlich "nicht belegt"), 10 GB frei, Preis 249 US-Dollar mit Quelle und Datum, Kühlung "nicht belegt".
- Fehlertabelle: alle 15 Zeilen wie im Repo, inklusive `ps ... | grep "[u]vicorn ..."`, `pkill`-Klammertrick, linger, Ollama nicht erreichbar, Modell fehlt.
- Link auf die Anleitung ist klickbar (`.../blob/main/docs/selbst-aufbauen.md`, neuer Tab, `noopener noreferrer`). Der Repo-Link steht im Text ebenfalls als Link.
- Suche: "Quellcode", "kaufen", "Einkaufsliste", "sudo", "JetPack", "flashen", "NVMe", "Zertifikat", "Kühlung", "Anleitung" führen jetzt alle zu "Selbst aufbauen". Vorher fand "Quellcode" nichts.
- Zeitangaben: Kopfzeile und Kachel zeigen beide "ca. 7 Min Lesen", der Absatz "Die Lesezeit dieser Seite steht oben in der Kopfzeile und ist davon unabhängig" trennt Lese- und Aufbauzeit.
- Fokus im Willkommens-Fenster liegt auf der Überschrift.
- Lizenz-Satz für den Eigenbau ist auf der Seite.

**Gleich**
- Kein Menüpunkt für Quellcode oder Fehlersuche (Kachel auf der Startseite genügt, die Suche trägt es).
- "Prototyp zu Betrieb" ist aus meinem Menü verschwunden, "Was ist ein Agent?" und "RAG im Überblick" bleiben (für meine Rolle nachrangig, aber harmlos).
- Quiz prüft weiter Randwissen.
- Alltagsvergleich "Regal" im Abschnitt "Der Weg in sechs Schritten".

**Schlechter**
- Nichts im Inhalt. Neu aufgefallen: Die Befehle verschwinden im Lesemodus "Kurz lesen" (Befund hoch 1), die Seite ist mit 10.300 Pixel lang und ohne Sprungmarken (hoch 2).

## 3. UX- und UI-Befunde

### Blocker

**B1. Die Anleitung und der Vorab-Check liegen auf GitHub `main` nicht.** Der Link "docs/selbst-aufbauen.md" (Abschnitt "Wo du die Anleitung findest") liefert 404. `raw.githubusercontent.com/.../main/scripts/check.sh` liefert ebenfalls 404, `setup.sh`, `install-service.sh`, `cache_leeren.py` und `README.md` liefern 200. Beide Dateien stehen nur auf dem Branch `feat/lernplattform-welle2` (200). Wer Block 3 ausführt (`git clone ...` klont `main`, danach `bash scripts/check.sh`), bekommt "No such file". Das ist ein Release-Thema (Merge nach `main` fehlt), aber aus Sicht des Besuchers heute ein harter Fehler im zentralen Weg und gehört vor jeder Veröffentlichung geprüft. Beleg: curl-Statuscodes, Seite `#/selbst-bauen`, Abschnitt "Wo du die Anleitung findest" und Block 3.

### Hoch

**H1. Im Modus "Kurz lesen" sind alle Befehle weg.** Ohne Rollenwahl (Fenster "Später", Direktlink, Suchtreffer) startet die Lektion in "Kurz lesen" mit "ca. 1 Min Lesen". Abschnitt "Die Befehle zum Kopieren" zeigt dann nur den Satz "Wenige Befehle, in der Reihenfolge der Anleitung" und "Mehr dazu". Sichtbare Codeblöcke: 0, sichtbare Kopieren-Knöpfe: 0. Der Satz "Die wichtigsten Befehle stehen schon oben" stimmt dann nicht. Eine Befehlsanleitung gehört nicht hinter "Mehr dazu". Datei: `11-kurz-oben.png`.

**H2. Kein Inhaltsverzeichnis, keine Sprungmarken auf einer Seite mit 10.300 Pixel Höhe.** Die Überschriften (`h2`) haben keine ID, es gibt weder Verzeichnis noch "Zum Abschnitt". Die Fehlertabelle (Zielaufgabe 3) erreiche ich nur durch Scrollen, und ein Link "springe zur Fehlersuche" lässt sich nicht teilen. Die Suche führt auf die Seite, nicht in den Abschnitt. Für Admins, die später "nur die Befehle" oder "nur die Fehlertabelle" brauchen, ist das die größte Bremse der Seite.

**H3. Schritt 1 "JetPack flashen" hat keinen Befehls- oder Linkblock.** Die Blöcke beginnen bei "1. Leistungsmodus ansehen". Der Weg zeigt oben sechs Schritte, die Blöcke heißen 1 bis 8 und passen nicht dazu. Auf der Seite fehlen: die NVIDIA-Anleitung (beide Links stehen im Repo und liefern 200), die Version (L4T R36, JetPack 6.2.x, Ubuntu 22.04, CUDA 12.6), der Hinweis "CUDA- und OpenCV-Komponenten mitinstallieren, das Labor nutzt das OpenCV aus JetPack", "normalen Benutzer anlegen" und "SSH aktivieren". Wer hier hängt, kommt nie zu Block 1. Gleiches gilt für Schritt 6: Der Browserschritt hat keinen Befehl (`systemctl --user status jetson-showcase`, `journalctl --user -u jetson-showcase -n 50 --no-pager`) und keine Erklärung der Zertifikatswarnung am Ort des Geschehens.

**H4. Block 5 mischt Terminal und Editor.** Der Block enthält `sudo systemctl edit ollama`, Kommentarzeilen, den `[Service]`-Text und `sudo systemctl restart ollama`. Wer den ganzen Block kopiert und ins Terminal einfügt, öffnet den Editor, und alle folgenden Zeilen, auch der Restart-Befehl, landen im Editor statt in der Shell. Im Repo sind es drei getrennte Blöcke (Befehl, Editor-Inhalt, Neustart). Datei: `05-kopieren.png`.

**H5. Fehlertabelle: Spalte "Lösung" ist die schmalste.** Im Screenshot hat "Symptom" rund 500 Pixel, "Ursache" 190 und "Lösung" 180 Pixel. Befehle brechen mitten im Code um, `ps -eo pid,lstart,args | grep "[u]vicorn app.app"` läuft über fünf Zeilen, `KL_LLM_GPU_SCHICHTEN=24` stößt an den rechten Tabellenrand. Die Befehle der Tabelle haben keinen Kopieren-Knopf. Datei: `07-fehlertabelle.png`. Die wichtigste Spalte sollte die breiteste sein, oder die Zeilen werden zu Karten.

### Mittel

**M1. Variablen werden genannt, aber nicht gesetzt.** `SHOWCASE_ALLOWED_HOSTS` und `KL_LLM_GPU_SCHICHTEN` stehen in der Fehlertabelle, aber nirgends der Weg (`systemctl --user edit jetson-showcase`, `[Service]`, `Environment=...`, danach `systemctl --user restart jetson-showcase`). Der Dienst-Block hat nur `restart`, nicht `status` und `stop`.

**M2. "Zwei Skripte" gegen "drei Skripte" und "nur Ollama und Leistungsmodus".** Im Fließtext "startest zwei Skripte", im Merkkasten "Drei Skripte, davon ist nur der Check freiwillig". In "Das nimmst du mit": "zwei Skripte" und "Mit sudo laufen nur Ollama und der Leistungsmodus", im Merkkasten oben vier Dinge (dazu Ollama-Einstellungen und linger). Kleine Widersprüche, aber Admins zählen nach.

**M3. Wiederholung statt Tiefe.** Die Einkaufsliste steht als Kacheln, als sechs Textzeilen (Screenreader-Liste), im Absatz, im Merkkasten und noch einmal in "Das nimmst du mit". Der Ablauf steht im Bild, in der Bildunterschrift, im Fließtext und im Merkkasten. Das Bild "Typisch gegen Hilfe" wiederholt die Tabelle.

**M4. Fokus im Willkommens-Fenster nicht gefangen.** Tab-Folge: sechs Rollenkarten, Schalter, "Später", dann "Zum Inhalt springen" der Seite dahinter, dann "Schließen". Der Fokus verlässt den Dialog. Esc schließt korrekt und der Fokus geht danach auf den Inhalt (gut).

**M5. Breite uneinheitlich.** Text und Merkkästen sind 707 Pixel breit, Codeblöcke, Bilder, Tabelle und Quiz 896 Pixel. Auf der Seite wirkt das wie zwei Spalten, die nicht abschließen (`04-teil1.png`). Die Warum-sudo-Zeile über den Blöcken bricht außerdem schon nach rund 520 Pixel um (Max-Breite), das wirkt wie ein Fehler.

**M6. Suche: Reihenfolge und Treffer ohne Ausschnitt.** "Fehlersuche" bringt "Sortieren" vor "Selbst aufbauen", "Port" bringt "Bild als Zahlen", "Preis" findet "Selbst aufbauen" nicht, obwohl der Preis dort steht. "Docker" findet nichts, die Alternativen darunter ("Chat, Datenschutz, Hausaufgaben, Bilder, Roboter, Kosten") sind nicht rollenspezifisch. Es gibt keinen Textausschnitt. Beim Suchen bleibt oben unter dem Fortschrittsbalken eine leere graue Pille stehen (`12-suche-kaufen.png`).

**M7. Kopfzeile der Arbeitsblätter: "Lizenz: noch festzulegen".** Auf einem Blatt, das Lehrkräfte kopieren sollen, passt das nicht zum Satz "Du darfst das Labor für dich aufbauen und nutzen". Entscheiden oder präzisieren ("Weitergabe an Schüler im Unterricht erlaubt").

### Klein

- K1. Fensterkacheln im Willkommens-Fenster ungleich hoch (Schüler-Karte 118 Pixel, Unterrichten 118, die anderen 80 bis 98), dazu zentrierte und linksbündige Texte gemischt (`01-willkommen.png`).
- K2. Nach dem Skip-Link bleibt um den ganzen Inhalt ein dauerhafter blauer Fokusrahmen (`20-fuss.png`, `21-1024.png`).
- K3. Bei 1024x768 und 900 Pixel Höhe ist die Menüleiste voll, die erste Gruppe "Einstieg" wird oben abgeschnitten, die Fußzeile "Rechner live" verdeckt den Listenrand.
- K4. Unbekannte Adresse (`#/gibt-es-nicht`) zeigt still die Startseite. Eine Meldung "Seite nicht gefunden" fehlt. Auf dem Server liefert ein unbekannter Pfad HTTP 404, gut.
- K5. Die Aktion "Ich arbeite in der IT" oben rechts sieht aus wie ein Status, nicht wie "Weg ändern" (nur Tooltip).
- K6. Schritt-Diagramm blendet beim Laden die Icons nacheinander ein, Screenshot zeigt kurz ausgegraute rechte Schritte (`03-bauen-oben.png`). Kein Problem, nur beim schnellen Blick irritierend.
- K7. Mobil (390 Pixel): Die Seite "Selbst aufbauen" hat horizontalen Überlauf. Für meine Rolle nachrangig.
- K8. Kopieren-Knopf: Rückmeldung "Kopiert." erscheint, bleibt aber nur kurz und ohne Live-Region zu prüfen. Keine Pflicht.

### Was gut ist (UX und UI)

- Typografie und Kontrast: 17 Pixel Fließtext, klare Hierarchie, Dunkel und Hell beide sauber (`09-hell-oben.png`, `10-hell-code.png`). Codeblöcke in Hell nur schwach vom Rahmen abgesetzt, aber lesbar.
- Codeblock-Muster: Nummer, Titel, bernsteinfarbene Kennzeichnung "braucht sudo", Begründung, Kopieren. Konsistent über alle neun Blöcke.
- Leere und Fehlerzustände (Quiz, Suche) sind freundlich und erklärend.
- Hardware-Seite: Live-Ringe, Diagramm "Die letzten 60 Sekunden", Modellliste.
- Arbeitsblatt (PDF, 3 Seiten, QR-Code, Niveau-Symbole) und Elternabend-Infoblatt sind sauber gesetzt, kein Text läuft über (`ab1-1.png`, `ei-1.png`). Download-Dateinamen `ki-labor-arbeitsblatt-stunde-1.pdf` sind sprechend, Content-Type `application/pdf`.

## 4. Zielaufgaben

| Aufgabe | Gelöst | Klicks | Zeit | Anmerkung |
|---|---|---|---|---|
| 1. Anleitung und Quellcode finden | Ja, mit Blocker | 2 (Rolle IT, "Repo öffnen" oder "Selbst aufbauen"), Link zur Datei 3 plus Scrollen | unter 5 Sekunden bis Repo, rund 25 Sekunden bis Dateilink | Repo-Link 200. Dateilink 404 (B1). Mit Suche "Quellcode": 3 Klicks. |
| 2. Finden, was ich kaufen muss | Ja, weitgehend | 3 (Rolle, Selbst aufbauen, Abschnitt "Das brauchst du") oder Suche "kaufen" | rund 15 Sekunden | Kit (Super, 8 GB), Netzteil, SSD (M.2, Bauform offen), Preis 249 US-Dollar mit Quelle, zweiter Rechner. Fehlt: konkrete SSD-Größe, Kühlung ("nicht belegt"), Preisrahmen in Euro. |
| 3. Fehlerhilfe finden | Ja | 3 (wie 2, dann Scrollen zu "Wenn etwas nicht klappt") | rund 30 Sekunden | Tabelle komplett, aber ohne Sprungmarke (H2) und schlecht lesbar (H5). Suche "Fehlersuche" bringt "Sortieren" zuerst. |
| Befehle ausführen (Zusatz) | Teilweise | 1 je Block | | Block 5 funktioniert nicht als Ganzes (H4), Schritt Flashen fehlt (H3), Kurz-Modus versteckt alles (H1). |

## 5. Empfehlung und die drei größten Lücken

**Würdest du es empfehlen?** Ja, an Admins und Bastler mit Linux-Erfahrung: Die Seite führt jetzt mit echten Befehlen, sudo-Kennzeichnung und festgenagelter Ollama-Version durch den Aufbau und sagt ehrlich, was nur auf einem Gerät geprüft ist. Erst empfehlen, wenn die Anleitung und `check.sh` auf `main` liegen, sonst scheitert der dritte Befehl.

**Die drei größten Lücken Richtung 10**
1. **Orientierung und Vollständigkeit der Befehlsfolge:** Inhaltsverzeichnis mit Sprungmarken (Befehle, Fehlersuche, Lizenz) und die Befehle im Modus "Kurz lesen" nicht verstecken. Schritt 1 (JetPack, mit NVIDIA-Links und Versionsangabe, Benutzer, SSH) und Schritt 6 (Dienst prüfen, Zertifikatswarnung, `status` und `journalctl`) als Blöcke ergänzen, Block 5 in drei Blöcke trennen, die Nummern der Blöcke an die sechs Schritte binden.
2. **Fehlertabelle lesbar machen:** "Lösung" zur breitesten Spalte oder jede Zeile zur Karte mit Kopieren-Knopf, dazu der Weg, Variablen im Dienst zu setzen (`systemctl --user edit jetson-showcase`).
3. **Stimmigkeit und Stand:** Repo-Dateien (Anleitung, `check.sh`) auf `main` bringen und vor jedem Release gegen die Seite prüfen. Skript-Anzahl und sudo-Aufzählung vereinheitlichen, Wiederholungen (Einkaufsliste dreimal, Ablauf viermal) durch Tiefe ersetzen, Lizenzzeile der Arbeitsblätter klären, Fokusfalle im Willkommens-Fenster beheben.
