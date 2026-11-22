# Welle 2: Tobias (52, Admin und Bastler, Desktop 1440x900)

Geprüft am 22.11.2026 gegen https://192.168.178.83:8443, Chrome headless über tests/browser.mjs mit `willkommen: true`, Rolle im Fenster "Ich arbeite in der IT". Gelesen und nichts installiert, keine Verbindung zum Jetson. Der GitHub-Link wurde nur als Verweis geprüft (Adresse und Attribute), nicht aufgerufen. Keine Konsolen- oder Netzwerkfehler im Lauf, keine Ratenbegrenzung. Beim Lauf zeigte die Seite "Hardware" 89 Prozent GPU-Last und die Startseite "Gerade viel los" (andere Prüfer liefen parallel), das war kein Fehler der Seite. Screenshots: /tmp/welle2-tobias/ (01 Willkommens-Fenster, 02 Start nach Rollenwahl, 03 und 04 Seite oben und ganz, 05 bis 07 Abschnitte, 08 Suche ohne Treffer, 09 Hardware, 10 Quiz).

## Kurzfassung

Als Wegweiser taugt die Seite "Selbst auf einem Jetson aufbauen": Ich finde sie nach zwei Klicks, sie sagt ehrlich, dass der Aufbau nur auf einem Gerät geprüft ist, und sie verweist auf Repo und Vorab-Check. Als Anleitung taugt sie nicht. Es steht kein einziger Befehl darauf (die Seite hat keinen einzigen Codeblock, nur Dateinamen im Fließtext), die Einkaufsliste ist keine, und Voraussetzungen wie `sudo` fehlen ganz. Wer die Seite für sich liest, hat danach ein Bild vom Weg, aber noch nichts, was er tippen kann. Er muss ins Repo, und dorthin führt nur ein Link auf die Startseite des Repos, nicht auf die Datei `docs/selbst-aufbauen.md`.

**Gesamtnote: 6,5 von 10** (als Ersatz für die Anleitung 5, als Wegweiser zur Anleitung 8).

## Das Menü beim Start (neue Fassung)

Nach der Rolle "Ich arbeite in der IT" zähle ich in der linken Spalte:

- 8 Menüpunkte: Start, Selbst aufbauen, Hardware, Lizenzen und Quellen, RAG im Überblick, Was ist ein Agent?, Prototyp zu Betrieb und "Alle Bereiche" (eingeklappt).
- 1 sichtbare Gruppe ("Für dich"), dazu Suchfeld und Fortschrittsbalken ("Noch nichts gelesen"). Hinter "Alle Bereiche" liegen weitere 12 Bereiche.
- Ohne Rolle (zweiter Lauf, direkt auf die Seite): Start, Neu hier, In 15 Minuten und "Alle Bereiche", das sich auf der Lektion von selbst aufklappt. Dann stehen 9 Gruppen plus die Gruppe "Der Rechner dahinter" im Menü, die Lektion ist mit "Selbst aufbauen" markiert. Das ist wieder lang, aber nur, weil ich direkt auf die Lektion gesprungen bin.

Das Menü mit Rolle ist deutlich aufgeräumter als alles, was ich von vorher kenne, und nicht überladen. Die fünf Punkte, die ich als IT-Mensch erwarte: Selbst aufbauen, Hardware, Quellcode/Repo, Lizenzen, Fehlersuche. Vier davon stehen da. Der Quellcode ist nur eine Kachel auf der Startseite, kein Menüpunkt. Eine Fehlersuche hat keinen eigenen Eintrag. Nie anklicken würde ich "Prototyp zu Betrieb" (der Titel sagt mir als Admin nichts) und "Was ist ein Agent?", solange ich erst aufbauen will. Warum "Prototyp zu Betrieb" in meiner Rolle steht, erschließt sich nicht.

## Das Willkommens-Fenster

- Erwartet: eine Auswahl der Rolle. Passiert: genau das, sechs Karten, ein Schließen-Kreuz, ein Schalter für den Lernfortschritt, "Später", dazu der Satz "Nichts wird gesendet, deine Wahl bleibt nur in deinem Browser". Gut.
- Der Fokus liegt vorab auf "Ich bin Schüler:in". Wer die Eingabetaste drückt, ohne zu lesen, wird Schüler.
- Nach dem Klick auf "Ich arbeite in der IT" dauert es rund 1,6 Sekunden bis zur Startseite "Die Technik dahinter" (Messung im Lauf, inklusive Wartezeit des Skripts).
- Der Startsatz "Selbst aufbauen, Hardware ansehen, Modelle und Quellcode prüfen" trifft genau, was ich suche.

## Zielaufgaben

1. **Anleitung und Quellcode finden: gelöst, 2 Klicks (Rolle, dann "Repo öffnen" oder "Selbst aufbauen"), unter 5 Sekunden.** Die Startseite hat eine eigene Kachel "Quellcode auf GitHub, Repo öffnen". Der Link ist echt: `href=https://github.com/greeves89/jetson-ai-showcase`, `target=_blank`, `rel=noopener noreferrer`. Im Text der Lektion steht dieselbe Adresse als klickbarer Link. Es fehlt ein Link auf die Anleitungsdatei selbst. Auf der Lektion steht nur der Dateiname `docs/selbst-aufbauen.md` als Code-Schnipsel, nicht anklickbar. Ich muss im Repo selbst in den Ordner `docs` gehen.
2. **Einkaufsliste finden: nur zum Teil gelöst, 3 Klicks, rund 20 Sekunden.** Die Kachel auf der Startseite verspricht "Einkaufsliste, Schritte und häufige Fehler". Auf der Seite ist die "Einkaufsliste" eine Kachelreihe ohne Modellnummer, Größe oder Link: Jetson Orin Nano Developer Kit 8 GB, NVMe-SSD "mindestens 10 GB frei", zweiter Rechner, Netzwerk, Terminal-Kenntnisse, Zeit. Es fehlen: ob das Netzteil dabei ist, welche NVMe-Bauform (M.2 2280?), ob ein Kühler nötig ist, jede Preisgrößenordnung. Dass die Super-Ausführung gemeint ist, steht nur im Repo, nicht auf der Seite. Die Seite sagt "Preise stehen bewusst nicht hier, sie schwanken", das ist ehrlich, aber auch ein Kostenrahmen ("grob 250 bis 300 Euro für das Kit", nur als Beispiel) würde mir beim Entscheiden helfen. Die Seite "Hardware" (Klick 3) hilft bei dieser Aufgabe nicht, sie zeigt Live-Werte, nichts zum Kaufen.
3. **Fehlersuche finden: gelöst, 1 Klick.** Der Abschnitt "Wenn etwas nicht klappt" mit Tabelle (6 Zeilen) steht direkt auf der Lektion, plus Suche "Fehlersuche" findet die Seite an dritter Stelle nach "Sortieren" und "Agenten" (die Suchtreffer stehen als reine Gruppenüberschriften und Seitennamen, ohne Textausschnitt). Die Tabelle ist brauchbar, aber eine Kurzfassung: 6 von 14 Zeilen der Tabelle im Repo.

Suche mit meinen Wörtern: "kaufen" führt zu Daten/Prognosen, Empfehlungen, Kosten und Energie, Quellen prüfen, aber nicht zu "Selbst aufbauen". "GitHub" und "Jetson bauen" finden die Lektion. "Quellcode" findet nichts ("Dazu habe ich nichts gefunden"), obwohl die Startseite eine Kachel "Quellcode auf GitHub" hat. Die Alternativvorschläge unter dem Leerergebnis (Chat, Datenschutz, Hausaufgaben, Bilder, Roboter, Kosten) passen nicht zu meiner Rolle.

## Die Lektion Schritt für Schritt (nur gelesen)

Aufbau: "Der Weg in sechs Schritten" (Bild), "Das brauchst du", "Wo du die Anleitung findest", "Wenn etwas nicht klappt", "Im Heimnetz oder öffentlich", "Lizenzen", "Das nimmst du mit", Quiz mit 4 Fragen. Ca. 4 Minuten laut Kopf.

| Schritt | Auf der Seite | Vollständig? |
|---|---|---|
| 1. JetPack 6 flashen | genannt, "als Betriebssystem" | Nein. Keine Version (L4T R36.4.7, Ubuntu 22.04, CUDA 12.6 stehen nur im Repo), kein Link zur NVIDIA-Anleitung, nicht erwähnt, dass CUDA und OpenCV mitinstalliert werden müssen (das Labor nutzt das OpenCV aus JetPack), nichts zu SSH und Benutzer, Flashen braucht laut Repo einen Ubuntu-PC. Die Seite sagt nur "zweiter Rechner". |
| 2. Leistungsmodus | nur als Kachel "Leistung, Modus prüfen" | Nein. Weder `nvpmodel -q` noch der Hinweis auf `sudo`, noch Kühlung. Im Fließtext kommt der Schritt gar nicht mehr vor. |
| 3. Vorab-Check | `scripts/check.sh` als Name, "liest nur" | Teilweise. Kein Aufruf, kein Hinweis, dass Ollama-Fehler vor Schritt 4 normal sind. |
| 4. Ollama + 2 Modelle | Namen `llama3.2:3b`, `nomic-embed-text` | Nein. Kein Installationsbefehl, nicht gesagt, dass er `sudo` braucht, nicht gesagt, dass die Ollama-Variablen (Flash-Attention, KV-Cache, Kontext, Keep-Alive) gesetzt werden müssen, keine Version. Die Seite nennt die Falle "Fehler von Ollama 0.12.3", sagt aber nirgends, dass man genau 0.12.3 installieren soll. Wer die neueste Version zieht, weiß nicht, was passiert. |
| 5. Skripte | `setup.sh`, `install-service.sh` | Teilweise. Kein `git clone`, nicht gesagt, dass das Repo unter `~/jetson-ai-showcase` liegen muss (sonst findet die Dienstdatei den Pfad nicht). Wo die Daten landen (rund 0,9 GB), fehlt. |
| 6. Browser | `https://<jetson-ip>:8443` | Ja. Zertifikatswarnung steht in der Fehlertabelle, nicht im Schritt. |

Ergebnis: Ein Admin, der nur diese Seite liest, kommt nicht bis zum laufenden Labor. Die Seite behauptet das auch nicht, sie verweist ins Repo ("Alles steht im öffentlichen Repo, mit Befehlen zum Kopieren"). Der Satz "Du tippst wenige Befehle" im Merkkasten ist trotzdem irreführend, solange kein Befehl zu sehen ist.

### Widersprüche und Auffälligkeiten (Seite gegen docs/selbst-aufbauen.md und README.md)

1. **Zwei Skripte oder drei?** Die Zusammenfassung sagt "klonst das Repo und startest zwei Skripte". Der Merkkasten sagt "Ein Skript prüft vorher, ein Skript richtet ein, ein Skript macht den Autostart", also drei. Im Repo sind es drei (`check.sh`, `setup.sh`, `install-service.sh`), und `check.sh` ist freiwillig. Die Seite ist in sich uneinheitlich.
2. **"Kein Root nötig" (README) gegen sudo (Anleitung).** Die README sagt "Es ist kein Root nötig". Die Anleitung braucht `sudo` für den Ollama-Installer, `nvpmodel -m`, `systemctl edit ollama` samt Neustart und notfalls `loginctl enable-linger`. Die Anleitung kennzeichnet das sauber, die README nicht. Die Lektion erwähnt `sudo` kein einziges Mal und sagt zu den Administratorrechten nur, dass `cache_leeren.py` keine braucht. Für einen Admin ist das die wichtigste Voraussetzung, und sie fehlt.
3. **Dauer: 1 Minute oder 4?** Die Startkachel "Selbst aufbauen" zeigt "ca. 1 Min", die Seite selbst "ca. 4 Min". Gemeint ist offenbar Lesezeit, die Kachel rechnet im Standardmodus "Kurz lesen". Für den Aufbau gilt der "halbe bis ein Tag", das steht nur im Kasten "Zeit". Auf der Startkachel ohne Zusatz ist "ca. 1 Min" für ein Aufbauprojekt missverständlich.
4. **Lizenz des Codes.** Die Seite und die README sagen, die Lizenz sei "noch nicht festgelegt, bis dahin gilt keine ausdrückliche Erlaubnis zur Weitergabe". Die Anleitung schreibt zusätzlich, dass man das Labor für sich aufbauen und nutzen darf. Dieser Satz fehlt auf der Seite. Ein vorsichtiger Admin liest "keine Erlaubnis" und zögert. Das Repo hat auch keine Lizenzdatei im Wurzelverzeichnis.
5. **"Befehle zum Kopieren" (Seite) gegen kein Codeblock.** Die Seite wirbt mit Befehlen zum Kopieren, hat selbst aber keinen Codeblock. Die Abschnittsüberschrift "Wo du die Anleitung findest" verspricht die Befehle im Repo, nicht auf der Seite, das ist erst beim zweiten Lesen klar.
6. **Fehlertabelle gekürzt ohne Befehle.** Zeile "Dienst startet nicht, Status exit 3" sagt "Prozess suchen und beenden", ohne Befehl. Die Repo-Anleitung gibt `ps -eo pid,lstart,args | grep "[u]vicorn app.app"` und warnt vor `pkill` ohne Klammertrick (der killt die eigene SSH-Sitzung). Ohne den Befehl ist die Zeile nicht ausführbar. Die Zeilen "Ollama nicht erreichbar", "Modell fehlt", "Dienst läuft nach Neustart nicht (linger)" und "Speicherfehler beim Laden" fehlen auf der Seite. "Ollama-Fehler" steht außerdem als Symptom in der Kurzliste, aber ohne Lösung in der Tabelle.
7. **Verweis auf die Prüfung.** Die Seite sagt im Abschnitt "Wo du die Anleitung findest" ehrlich: "Aufgebaut ist das Labor bisher nur auf einem einzigen Gerät". Das stimmt mit dem Abschnitt "Stand der Prüfung" im Repo überein. Vorbildlich. Es fehlt der Hinweis, dass SD-Karte, 4-GB-Modell und andere Ollama-Versionen ungetestet sind, was ein Käufer vor dem Bestellen wissen will.
8. **Lesemodus.** Mit der Rolle IT startet die Lektion in "Genau lesen" (Hinweis "Alle Erklärungen sind aufgeklappt"). Ohne Rolle startet sie in "Kurz lesen", und dann stehen unter jedem Abschnitt nur ein Satz und "Mehr dazu". In diesem Modus sind die Tabelle und die Kasten "Merke" zugeklappt, und die Seite wirkt noch dünner. Der Wechsel ist sichtbar ("Kurz lesen, Genau lesen" oben rechts), das ist gut, nur wusste ich beim ersten Besuch nicht, dass Inhalt fehlt.
9. **Seitenpfad.** Am Ende steht "Pfad Selbst tüfteln, Seite 1 von 6", die folgende Seite ist "Hardware" (Seite 2 von 6). Das stimmt, der Pfad wird aber nirgends als Ganzes gezeigt, ich sehe nicht, was in Seite 3 bis 6 steht.

Alle Ortsangaben stimmen mit dem Repo überein: Adresse `https://<jetson-ip>:8443`, Port 8443, `numpy<2`, `SHOWCASE_ALLOWED_HOSTS`, 24 GPU-Schichten, "Built with Llama". Falsche Befehle oder Adressen habe ich keine gefunden, es sind schlicht zu wenige da, um etwas falsch zu machen.

## Quiz (Selbst auf einem Jetson aufbauen)

Zwei der vier Fragen gelöst. Eine falsche Antwort ("Von einer Kamera am Jetson") bekommt "Nicht ganz. Der Browser gibt Kamera und Mikrofon frei, und nur über HTTPS. Am Jetson brauchst du keine." Die richtige Antwort wird mit Begründung bestätigt ("Der Check liest nur: Version, Speicher, Ollama, Modelle, Port"). Gutes Feedback. Die Fragen prüfen aber nur Randwissen (Zweck von `check.sh`, Herkunft der Kamera). Nichts davon hilft beim Aufbau, etwa "Welcher Befehl lädt die Modelle?" oder "Wohin gehört das Repo?".

## Raster (1 bis 10, streng)

1. **Verständlichkeit: 8.** Kurze Sätze, Fachwörter erklärt, die Tabelle ist klar. Für einen Admin eher zu einfach, zum Beispiel "Wie beim Aufbau eines Regals: erst der Rahmen (JetPack)". Zu viel Alltagsvergleich für meine Rolle.
2. **Einstieg und Führung: 8.** Rollenfenster, drei Empfehlungskarten, Quellcode-Kachel und Lektion in zwei Klicks. Die Startseite für IT sagt sofort, wo ich hin muss. Abzug: Kachel "ca. 1 Min" und der Fokus auf "Schüler:in" im Fenster.
3. **Lernwirkung: 6.** Nach der Seite kann ich die sechs Schritte in drei Sätzen erklären: JetPack, Check, Ollama mit zwei Modellen, zwei bis drei Skripte, Browser auf 8443. Ich könnte aber nichts davon ausführen, Befehle und Werte fehlen. Die Kernsätze zum Speicher ("Die meisten Fehler sind Speicherfragen") sind gut.
4. **Motivation und Spaß: 6.** Die Zeitleiste und die Live-Hardwareseite (GPU, Watt, Temperatur) sind für Bastler nett. Dann folgt eine Textseite ohne Befehle zum Kopieren. Das Erfolgserlebnis "ich baue es nach" kommt nicht auf.
5. **Labore und Interaktion: 7.** Auf dieser Seite gibt es kein Labor, nur Quiz und die verlinkte Live-Hardwareseite. Die Hardwareseite läuft, Werte stimmen zur Last (89 Prozent GPU, 5,0 von 7,4 GB). Quiz funktioniert mit Rückmeldung. Mehr habe ich für meine Rolle nicht getestet, keine Wartezeit-Probleme.
6. **Videos: nicht bewertet.** Auf der Seite "Selbst aufbauen" gibt es kein Video, und für meine Zielaufgaben war keines nötig. Ein Video, das einen Flash-Vorgang zeigt, wäre dennoch sinnvoll und fehlt.
7. **Navigation und Orientierung: 7.** Menü mit Rolle gut (8 Einträge), Zurück-Pfeil, Pfad "Seite 1 von 6", Suche findet "Jetson bauen" und "GitHub", aber nicht "Quellcode" und führt bei "kaufen" an der Lektion vorbei. Der Fortschrittsbalken "Noch nichts gelesen" bleibt ohne Merken-Schalter wirkungslos, ist aber optional. Der Lesemodus (Kurz/Genau) sitzt nur oben rechts und ist nicht gemerkt, wenn man die Rolle nicht wählt.
8. **Vertrauen und Sicherheit: 8.** Offen über den Prüfstand (ein Gerät), selbstsigniertes Zertifikat erklärt, Hinweis "Port nicht ins Internet weiterleiten", "Nichts wird gesendet" im Willkommens-Fenster. Abzug für die unklare Lizenz und fehlendes `sudo`.
9. **Barrierefreiheit und Bedienbarkeit: 8.** "Zum Inhalt springen" ist der erste Tab-Stopp, danach Suche und Menü, Reihenfolge logisch. Fließtext 17 Pixel, guter Kontrast im dunklen Modus. Die Diagramme haben Textalternativen. Nicht geprüft: Screenreader, hellen Modus.
10. **Fehlerfälle: 7.** Leerer Suchtreffer bekommt Alternativvorschläge, nur nicht passende zu meiner Rolle. Falsche Quiz-Antwort wird erklärt. Die Fehlersuche für den Aufbau selbst ist gekürzt und ohne Befehle.

**Gesamtnote: 6,5.** Kein Mittelwert (der läge bei 7,3), sondern mein Eindruck für den Zweck "ich will das selbst aufbauen". Die Seite führt gut hin, aber nicht durch.

## Zusatzfragen

1. **Rolle gewählt oder Fenster geschlossen?** Gewählt, "Ich arbeite in der IT". Erwartet: eine passende Startseite. Passiert: "Die Technik dahinter" mit drei Empfehlungen (Selbst aufbauen, Hardware, Modelle und Lizenzen) und der Quellcode-Kachel, das Menü schrumpft auf "Für dich". Genau das. Ein Kritikpunkt: Die Rolle erscheint danach nur als kleine Schaltfläche "Ich bin: in der IT" oben rechts, die Möglichkeit, sie zu ändern, ist auffindbar, aber unauffällig.
2. **Menü überladen?** Nein. 8 Einträge und 1 Gruppe nach der Rollenwahl, siehe oben. Erwartet hätte ich: Selbst aufbauen, Hardware, Quellcode, Lizenzen, Fehlersuche. Nie anklicken würde ich: Prototyp zu Betrieb, Was ist ein Agent?, und RAG im Überblick erst nach dem Aufbau.
3. **Zielaufgaben:** (1) gelöst, 2 Klicks, unter 5 Sekunden. (2) nur halb gelöst, 3 Klicks, rund 20 Sekunden, weil Modelle, Zubehör und Kosten fehlen. (3) gelöst, 1 Klick, aber die Tabelle ist gekürzt. Gesucht habe ich auf der Startseite (Kachel "Quellcode"), im Menü ("Selbst aufbauen") und mit dem Suchwort "kaufen", das ins Leere führte.
4. **Text zu viel? Die drei textlastigsten Stellen:**
   1. "Selbst aufbauen", Abschnitt "Der Weg in sechs Schritten": Bild, zwei Absätze, Alltagsbeispiel, Merkkasten, dasselbe Gesagte viermal. Die sechs Schritte stehen im Bild, in der Bildunterschrift, im Fließtext und im Merkkasten.
   2. "Selbst aufbauen", Abschnitt "Das brauchst du": Kachelreihe, Satz darunter, noch ein Absatz, Merkkasten. Die Einkaufsliste wiederholt sich dreimal, enthält aber nichts Neues.
   3. "Selbst aufbauen", Abschnitt "Wenn etwas nicht klappt": Bild "Typisch gegen Hilfe", Absatz, zweiter Absatz, Tabelle und Merkkasten. Das Bild "Typisch gegen Hilfe" erklärt nichts, was die Tabelle nicht besser sagt. Das Gegenteil von zu wenig Text: Der Text ist da, aber an der falschen Stelle. Statt Wiederholungen hätte ich lieber die Befehle.
5. **Weiterempfehlen?** Ja, mit Einschränkung. Der Satz, den ich weitergeben würde: "Das KI-Labor ist ein ehrlich beschriebenes Bastelprojekt für einen Jetson Orin Nano 8 GB. Die Seite zeigt dir den Weg, die eigentliche Anleitung mit allen Befehlen liegt im GitHub-Repo, plane einen halben bis ganzen Tag ein." Empfehlen würde ich es Admins und Bastlern mit Linux-Erfahrung, nicht Einsteigern.

## Was hat mich gefreut

- Zwei Klicks bis zum Repo und zur Lektion, der Quellcode-Link ist ein echter Link (neuer Tab, `noopener noreferrer`).
- Die Ehrlichkeit: "Aufgebaut ist das Labor bisher nur auf einem einzigen Gerät", die Zeitangabe "Schätzung, keine Messung", "Preise stehen bewusst nicht hier".
- Die Hardwareseite mit Live-Werten (GPU, Speicher, Watt, Temperatur) und den geladenen Modellen. Das ist Bastlerfutter.
- Das Menü nach der Rollenwahl: 8 Einträge, nichts Überflüssiges.
- Das Quiz erklärt die richtige und die falsche Antwort in einem Satz.
- Texte stimmen sachlich mit Repo und README überein, ich habe keinen falschen Befehl und keine falsche Adresse gefunden.

## Was hat genervt

- Die Seite hat keinen einzigen Befehl. Der Merksatz "Du tippst wenige Befehle" und die Überschrift "Befehle zum Kopieren" stehen auf einer Seite ohne Codeblock.
- Der Link führt auf die Repo-Startseite, nicht auf `docs/selbst-aufbauen.md`. Der Dateiname steht als Text, nicht als Link.
- `sudo` kommt nicht vor, obwohl Ollama, Leistungsmodus und Dienst es brauchen. Die README sagt zusätzlich "kein Root nötig".
- "Zwei Skripte" im Fließtext, drei im Merkkasten.
- Kachel "ca. 1 Min", Seite "ca. 4 Min", Aufbau "ein halber bis ein Tag": drei Zeitangaben für dieselbe Sache.
- Die "Einkaufsliste" hat keine Kaufinformation: kein Modellname der Super-Ausführung, kein Netzteil, kein Preisrahmen.
- Suche "Quellcode" findet nichts, "kaufen" findet fünf unpassende Seiten.
- Dasselbe wird im Bild, in der Bildunterschrift, im Fließtext und im Merkkasten wiederholt, statt es einmal gründlich mit Befehlen zu sagen.

## Die drei größten Lücken Richtung Eins-A

1. **Die Seite braucht echte Codeblöcke mit Kopierknopf** für `git clone`, `scripts/check.sh`, `ollama pull`, `scripts/setup.sh`, `scripts/install-service.sh`, mit klarer Kennzeichnung "braucht sudo" und dem Pfad `~/jetson-ai-showcase`. Dazu ein direkter Link auf `docs/selbst-aufbauen.md`. (Aufwand klein, Wirkung groß.)
2. **Eine echte Einkaufsliste**: Developer Kit 8 GB (Super), NVMe-Größe und Bauform, Netzteil dabei, Kühlung, grober Preisrahmen mit Stand-Datum, plus "ungetestet: 4 GB, SD-Karte, andere Ollama-Versionen". Die Ollama-Version 0.12.3 muss auf der Seite stehen, weil die Fehlerbeschreibung sich darauf bezieht.
3. **Widerspruchsfrei und vollständig bei Fehlern und Zahlen**: zwei oder drei Skripte klären, "kein Root" in der README korrigieren, Zeitangaben vereinheitlichen (Lesezeit gegen Aufbauzeit trennen), die Fehlertabelle um die fehlenden Zeilen samt Befehlen ergänzen, und die Codelizenz entscheiden oder wenigstens den Satz "für dich aufbauen und nutzen darfst du" auf die Seite übernehmen.

Nebenpunkte: Suche um "Quellcode", "kaufen" und "Einkauf" ergänzen. Fokus im Willkommens-Fenster nicht vorab auf "Schüler:in" setzen. "Prototyp zu Betrieb" aus dem IT-Menü nehmen oder umbenennen.
