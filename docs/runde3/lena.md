# Prüfrunde 3: Lena (29, Softwareentwicklerin, Laptop 1440x900)

Stand: 22.11.2026, abends. Geprüft gegen https://192.168.178.83:8443, Chromium headless über tests/browser.mjs, Viewport 1440x900, hell und dunkel. Rolle im Willkommens-Fenster: "Ich arbeite in der IT". Screenshots (21 Stück) liegen in /tmp/r3lena/ (Auswahl: 01-willkommen.png, 02-it-start.png, 03-menue-offen.png, 10-rag-ueberblick-oben.png, 21-rag-leere-frage.png, 26-rag-antwort.png, 28-dunkel-antwort.png, 40-codeblock.png, 50-suche.png, 61-tokenizer.png, 71-agent-laeuft.png, 72-agent-fertig.png, 80-chat-dunkel.png, 82-start-dunkel.png). Dazu das Arbeitsblatt-PDF KI 2 heruntergeladen und mit pdftoppm -r 60 angesehen (/tmp/r3lena/pdf/a2-1.png).

Sprachmodell-Last, ehrlich: Ich habe die Vorgabe "höchstens eine Anfrage, danach 10 Sekunden warten" im RAG-Labor eingehalten (Pausen 8 bis 10 s), im Agenten-Labor aber dreimal dieselbe Aufgabe gestartet, weil mein Skript beim ersten Lauf abbrach und ich es wiederholen musste. Der dritte Lauf brauchte 94,8 s statt 9 bis 16 s, der Menüfuß zeigte da "Rechner live, gerade viel los". "Zu viele Anfragen" kam nicht. Zweimal im RAG-Labor kam stattdessen "Dem Jetson fehlt gerade freier Speicher, um das Sprachmodell zu laden" (siehe H1). Danach habe ich keine weitere Modellanfrage gestellt, der Chat blieb deshalb ungenutzt (nur Oberfläche gesichtet).

## 1. Gesamtnote: 7,7 von 10 (Vorrunde 7,5)

Kurzurteil: Die Oberfläche ist sichtbar ruhiger und konsistenter geworden (Willkommens-Fenster, "Kurz lesen" als Standard, Glossar in der Suche, Kopierknöpfe an den Befehlen). Fachlich ist die Seite weiterhin ehrlich und überwiegend korrekt. Die drei größten inhaltlichen Lücken für mich als Entwicklerin sind seit der letzten Runde unverändert: keine Quellen, kaum Mathematik, keine harten Zahlen zum laufenden Modell. Dazu kommen im RAG-Labor zwei neue Fehler (stehengebliebene Fehlermeldung, stille leere Frage) und ein Fehlerbild, das ich zweimal reproduzieren konnte.

## 2. Raster (zehn Kriterien, streng)

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit | 8 | Kurzfassung (Standard) trägt die Kernsätze. Die Alltagsbilder sind in "Kurz" weg, in "Genau" noch dreifach da (tokens-sprachmodelle: Handytastatur, Lego, Stadtplan). Für mich als Entwicklerin akzeptabel, weil ich wählen kann. |
| 2 | Einstieg und Führung | 7,5 | Rolle gewählt, 0,9 s später "Die Technik dahinter" (02-it-start.png). Menü "Für dich" jetzt sechs Einträge (Start, Selbst aufbauen, Hardware, Lizenzen und Quellen, RAG im Überblick, Was ist ein Agent?). Die Startkarten führen weiter zum Bauen, nicht zu RAG-Werkstatt, Agent, Tokenizer, Chat. "Prototyp zu Betrieb" ist aus dem Menü verschwunden, gut. |
| 3 | Lernwirkung | 7,5 | Ich kann RAG, Agentenschleife und Tokens wieder in drei Sätzen erklären (siehe 7). Nachprüfbarkeit fehlt weiter (keine Formel, keine Originalquelle). |
| 4 | Motivation und Spaß | 7,5 | Echte Messwerte statt Animation (Zeitstreifen "Frage einbetten 105 ms, Vergleichen und Netz 168 ms"; Tokenizer mit dem echten Modell). Das Labor liefert aber unter Last Fehlermeldungen statt Ergebnis (H1). |
| 5 | Labore und Interaktion | 7 | Einlesen 2,9 s, Suche mit Treffern und Scores funktionieren. Zweimal keine Antwort (H1), Fehlermeldung bleibt nach erfolgreichem Einlesen stehen (H2), leere Frage ohne Rückmeldung (H3), Agent bei Last 94,8 s (H4). |
| 6 | Videos | 7 | Nur Oberfläche geprüft: "RAG im Überblick" 1:17 mit sechs Kapitelmarken, "Sprecherstimme KI-erzeugt" und Verweishinweis stehen sichtbar. Das Standbild, das beim Laden im Player steht, zeigt "Fragen" (0:40) statt des Anfangs (10-rag-ueberblick-oben.png). Ton nicht gewertet. |
| 7 | Navigation und Orientierung | 7,5 | Suche findet jetzt "Quellcode" (Selbst aufbauen, Lizenzen) und "GitHub", Begriffe zeigen eine Karte "Begriff erklärt" (Kosinus-Ähnlichkeit, 50-suche.png). Weiter schlecht: "Mathe" findet "Neuronale Netze" nicht, Labor heißt "RAG-Werkstatt", "RAG", "Dokumente befragen"; Tokens-Seite heißt im Menü "Sprachmodelle", als Titel "Wie ein Sprachmodell gebaut ist". |
| 8 | Vertrauen und Sicherheit | 8 | Hinweise "Antwort eines KI-Modells ..." und "Built with Llama" überall. Datenschutzzeile im Footer. Abzug: Code-Lizenz weiter "noch festzulegen", auch auf jedem PDF in der Kopfzeile ("Lizenz: noch festzulegen"), obwohl das Repo "öffentlich" heißt und keine LICENSE-Datei im Repo liegt. |
| 9 | Barrierefreiheit und Bedienbarkeit | 8 | Tab: Zum Inhalt springen, Suche, Start, Neu hier, In 15 Minuten, Alle Bereiche, Rechner live (sinnvoll), sichtbarer 3-px-Fokusring bei Links und Knöpfen (41-tab-fokus.png). Suchfeld zeigt Fokus als Rand statt Ring, aber sichtbar. Dunkelmodus gut lesbar (80, 82). Kontrast nicht gemessen. |
| 10 | Fehlerfälle | 7 | Frage ohne Text: freundliche Meldung (22-rag-ohne-text.png). Aber: ganz leere Frage bleibt stumm (H3), alte Fehlermeldung hängt (H2), dreifache Meldung bei Modellfehler (H1). |

## 3. Vergleich zur Vorrunde (docs/runde2/welle2-lena.md)

Besser:
- "Kurz lesen" ist jetzt Standard, "Genau lesen" oben rechts im Kopf. Meine Forderung aus Runde 2 ist erfüllt. rag-ueberblick: 5.275 Zeichen im Standard (früher 12.514).
- Suche findet "Quellcode" und "GitHub" (N2 aus Runde 2). Die Menüsuche zeigt keine Doppelungen mehr (50-suche.png). Neu: Glossarkarte "Begriff erklärt" mit Verweisen auf drei Seiten.
- Hardware: "Geladenes Modell: bis zu zwei, je nach Größe" statt "immer nur eins" (Widerspruch 14 behoben). Die Seite nennt live den Speicher (3,2 von 7,4 GB).
- Selbst aufbauen: Befehle in Blöcken mit "Kopieren", "braucht sudo"-Marke und "Warum sudo" (40-codeblock.png). Neu: Hinweis, dass Ollama 0.12.3 nötig ist, weil llama3.2:3b bei Eingaben über etwa 1.100 Tokens sonst Kauderwelsch liefert. Das ist genau die Detailtiefe, die ich suche.
- Agenten-Labor: Hinweis "Die Dokumentsuche braucht vorher eingelesenen Text. Lies ihn im RAG-Labor ein" direkt unter den Beispielfragen (L3 abgemildert).
- Willkommens-Fenster mit Rollenwahl (01-willkommen.png): unscharfer Hintergrund, Schließen-Kreuz, "Später", Datenschutzzeile.
- Tokens-Seite markiert die 3-Stück-Abbildung jetzt als "Beispielwerte".

Gleich:
- Null Quellen, null Weiterlesen auf allen technischen Seiten (per Skript gezählt: 0 externe Links auf rag-ueberblick, rag-embedding, rag-chunking, rag-suche, rag-reranking, rag-bewertung, tokens-sprachmodelle, agenten-grundlagen, agenten-planung, mcp-werkzeuge, llm-grenzen, finetuning-oder-rag). "Lizenzen und Quellen" hat 30 Links, ist aber eine Lizenzliste.
- "Mit Mathe" nur auf neuronale-netze, Schalter bei y = 2604 px mitten im Text (Kopfleiste zeigt nur Kurz/Genau).
- Skala im RAG-Labor "0 unverwandt bis 1 sehr ähnlich, Marker bei 80 Prozent" (Beispiel-Abbildung). Das Glossar sagt "Werte nahe 0 heißen unverwandt". Das echte Labor zeigt Score 0,56 für einen thematisch fremden Abschnitt (Rang 2, Stahlpreis zur Frage nach der Bauüberwachung) und 0,63 für den richtigen. Skala und Messwerte passen weiter nicht zusammen.
- Kontextlänge des laufenden Modells wird nicht genannt (nur Beispielfenster 2.048 bis 128.000 auf der Tokens-Seite; im Quelltext steht OLLAMA_CONTEXT_LENGTH=4096 in einem Konfigurationsblock, ich habe diese Zahl nicht als Aussage auf einer Lernseite gefunden). Quantisierungsstufe weiter nicht genannt.
- Code-Lizenz "noch nicht festgelegt" (selbst-bauen, PDF-Kopfzeile).
- Vorschau der Abschnitte nach dem Einlesen: "Das Bauprojekt Orion Orion ist ein erfundenes Bauprojekt" (Name doppelt, 24-rag-eingelesen).
- Rolle IT führt zu Bauen, nicht zu den Laboren (siehe M1).

Schlechter oder neu:
- H1, H2, H3 im RAG-Labor (unten).
- Tokens-Seite widerspricht sich weiter: Abbildung "Haus | rat | versicherung, 3 Tokens", Text "im Bild oben beispielhaft in drei", Zusatz "Das Tokenizer-Labor unten arbeitet mit einem vereinfachten Wortschatz". Das Labor direkt darunter trägt aber das Siegel "Genau, vom Modell auf dem Jetson" und zerlegt "Hausratversicherung" in sechs Stücke (Ha | usr | at | vers | icher | ung, 61-tokenizer.png). Der Text ist durch den Umbau des Labors veraltet: Das Labor ist jetzt das echte Modell und nicht mehr vereinfacht.

## 4. UX- und UI-Befunde nach Schwere

### Blocker
Keine.

### Hoch
- H1 RAG-Werkstatt, Schritt 3 Antwort: Bei zwei von zwei Versuchen kam keine Antwort. Meldung: "Dem Jetson fehlt gerade freier Speicher, um das Sprachmodell zu laden." Zur selben Zeit zeigte die Hardwareseite 3,2 von 7,4 GB belegt (nur nomic-embed-text im Speicher), also rund 4 GB frei, das Modell braucht etwa 2 GB. Die Meldung ist also für mich nicht nachvollziehbar. Außerdem erscheinen drei Meldungen übereinander: orange Karte mit "Noch einmal versuchen", darunter grau "Diesmal gab es keine Antwort. Die Meldung darüber sagt, woran es lag.", darunter in der Live-Erklärung "Das hat diesmal nicht geklappt". Der graue Satz ist überflüssig. Dunkel: 28-dunkel-antwort.png, hell: 26-rag-antwort.png.
- H2 RAG-Werkstatt: Wer zuerst ohne Text fragt (Fehler "keine Dokumente eingelesen") und danach erfolgreich einliest, sieht im Schritt 3 die alte Fehlermeldung samt Knopf "Noch einmal versuchen" weiter stehen (24-rag-eingelesen.png). Sie verschwindet erst mit einer neuen Frage. Das widerspricht dem grünen Einlesen-Ergebnis zwei Zeilen darüber.
- H3 RAG-Werkstatt, leere Frage: Klick auf "Fragen" ohne Text und ohne Dokumente tut nichts, keine Meldung, kein Fokus ins Feld (21-rag-leere-frage.png). In Runde 2 gab es hier noch die Meldung "Es sind noch keine Dokumente eingelesen". Rückschritt.

### Mittel
- M1 Startseite IT-Rolle und Menü "Für dich": RAG-Werkstatt, Agent, Chat und Tokens fehlen (02-it-start.png). Die Karte heißt weiter "Selbst aufbauen", Eintrag "Lizenzen und Quellen" verspricht Quellen. Ein Entwickler, der verstehen will, muss "Alle Bereiche", dann Gruppe, dann Seite klicken (3 Klicks).
- M2 Quellenlosigkeit (siehe oben). Behauptungen wie ReAct, Transformer 2017, "Modelle gehen mit sehr langen Texten oft weniger sorgfältig um" sind nicht belegt.
- M3 Agenten-Labor und RAG-Labor: Das Labor beginnt bei y = 660 px, Ergebnis und Wartezustand liegen unter der Bildschirmkante. Beim Absenden bleibt der Knopf blass (disabled), aber ich sehe auf 1440x900 nicht, dass etwas läuft (71-agent-laeuft.png), und es gab bei 95 s Dauer keine Zwischenmeldung "ausgelastet, das dauert". Der Menüfuß zeigt zwar "Rechner live, gerade viel los", aber nur wer ihn liest, versteht den Zusammenhang.
- M4 Agentenlabor-Hinweis zur Dokumentsuche ist nur lesbar, wenn man die Zeile unter den Beispielfragen sieht. Der Beispielknopf "Suche in den Dokumenten nach dem Wort Budget." bleibt trotzdem anklickbar und führt ohne Text weiter in die Irre (Vorrunde L3). Eine Meldung "Achtung: Antwort und Werkzeugergebnis passen nicht zusammen" fehlt weiter. Beim 3. Lauf (rechne, uhrzeit) war das Ergebnis dagegen korrekt (391, Sonntag, 22.11.2026 20:46).
- M5 Benennung (Konsistenz): Labor "RAG-Werkstatt" (Menü, Titel, Suche), früher "RAG". Besser als in Runde 2, aber "Agent" (Menü) gegen "Agent mit Werkzeugen" (Titel) gegen "Was ist ein Agent?" (Theorie) bleibt, ebenso "Sprachmodelle" gegen "Wie ein Sprachmodell gebaut ist" und "Sprachmodell im Chat".
- M6 Zwei Lesezeiten für dieselbe Seite: Startkarte "Selbst aufbauen" sagt "ca. 7 Min Lesen", die Seite im Standard "ca. 1 Min Lesen" (kurz). Nach "Genau lesen" aktualisiert sich die Zahl vermutlich, in der Startkarte steht aber nur eine Zahl.
- M7 Ein Abschnitt der Selbstbau-Seite ("Mehr dazu") versteckt in "Kurz" alle Befehle, genau das, was der Titel "Die Befehle zum Kopieren" verspricht. Für diese Rolle sollte die Seite in "Genau" öffnen (die Rolle ist bekannt).

### Klein
- K1 Menü: "Sprachmodell im Chat" und "Wissen: Modell oder Dokument" brechen auf zwei Zeilen, wegen des "Einsteiger"-Etiketts (80-chat-dunkel.png). Gruppentitel "Alle Bereiche" ist als Überschrift kräftiger als die Untergruppen, die Hierarchie ist aber trotzdem eng (Alle Bereiche, 12 Gruppen, Seiten). Menüunterkante schneidet "Lizenzen und Quellen" und "Business-Use-Cases" an (40-codeblock.png, 72-agent-fertig.png).
- K2 Sticky Kopf mit "Kurz lesen / Genau lesen": halbtransparenter Hintergrund lässt Seiteninhalt durchscheinen (Textzeile "Rang 2 ..." im Dunkelmodus, 28-dunkel-antwort.png; schwarzer Balken des Videos auf 61-tokenizer.png). Wirkt unruhig.
- K3 Selbst aufbauen: harte Zeilenumbrüche mitten im Satz ("Nimm eine / Nummer aus der Liste", 40-codeblock.png).
- K4 Willkommens-Fenster: Die Karte "Ich bin Schüler:in" hat drei Textzeilen (Kamera, Mikro und Gesicht ab 16), die anderen zwei. Dadurch sind Titelhöhen unterschiedlich (01-willkommen.png). Inhaltlich gut (Altersgrenze sichtbar), nur optisch ungleich.
- K5 404-Seite ("Seite nicht gefunden") nett, aber Ihre Adresse "/tokenizer" erzeugt eine 404-Fehlermeldung in der Browserkonsole (51-404.png). Entwicklerin sieht das. Kein Nutzerproblem.
- K6 Konsole: bei Frage ohne Text 400 Bad Request (erwartete Abweisung), Konsole sonst sauber.
- K7 Vollbild-Screenshots zeigen bei den Diagrammen "Das Problem" und "Die Lösung in vier Schritten" leere Flächen (nur "gegen" und Pfeile), weil Diagramme beim Einscrollen aufgebaut werden. In normalen Sichtfenstern erscheinen sie. Wer die Seite druckt oder als PDF speichert, sieht die Lücken (nicht geprüft, nur vermutet).

## 5. Zielaufgaben von Lena

1. RAG-Erklärung finden und Labor probieren: gelöst. Erklärung "RAG im Überblick" aus dem Menü "Für dich": 1 Klick, Seite nach 1,0 s. Labor "RAG-Werkstatt" im Menü unter "Alle Bereiche, Wissen und RAG": 3 Klicks, rund 12 s. Beispieltext einfügen, Einlesen (2,9 s, "2 neue Abschnitte, jeder als 768 Zahlen"), Frage "Wer ist für die Bauüberwachung zuständig?": Treffer Rang 1 Score 0,63 (richtiger Abschnitt, Jonas Kreil steht darin), Einbetten 105 ms, Vergleichen 168 ms, danach aber keine Antwort wegen Speichermeldung (zwei Versuche, 16,3 s und 16,3 s bis zur Fehlermeldung). Vollständig gelöst nur bis zur Suche, die Antwort selbst habe ich diesmal nicht sehen können (anders als in Runde 2, 26 s mit korrekter Antwort).
2. Welches Modell läuft, welche Grenzen: gelöst in 2 Klicks. Chat-Seite zeigt "Modell llama3.2:3b, im Speicher", etwa drei Milliarden Parameter, "rund 2 GB"; Hardware zeigt live belegten Speicher. Lizenzen-Seite: Llama 3.2 Community License. Grenzen: Parameter, "Weiß weniger, Mehr Fehler", 8 GB gemeinsamer Speicher, 24 GPU-Schichten (Selbst aufbauen), Ollama 0.12.3. Nicht gefunden: Kontextlänge als feste Aussage, Quantisierung, Rate-Limit je Besucher. Teilweise gelöst.
3. Fachliche Stichproben (zwei plus Zusatz): siehe nächster Abschnitt.

## 6. Fachliche Stichproben

1. Tokens-Seite: "Zahlen werden in Blöcke von höchstens drei Ziffern geschnitten", Wortschatz 128.256 Einträge. Stimmt. Das Labor bestätigt live das Dreierblock-Verhalten mit "12.10.2025" (Zerlegung nicht erneut geprüft, nur die Beschreibung gelesen; in Runde 2 geprüft: 12 . 10 . 202 5). Widerspruch bleibt bei der Abbildung "Haus | rat | versicherung" gegen die echte Zerlegung in sechs Stücke (siehe 3, schlechter).
2. selbst-bauen: "llama3.2:3b lieferte bei langen Eingaben (ab etwa 1100 Tokens) nur Kauderwelsch, wenn alle Schichten auf der GPU lagen. Das Labor umgeht das mit 24 GPU-Schichten." Konsistent mit dem Quellcode (app/speicher.py: LLM_GPU_SCHICHTEN = 24, LLM_BATCH = 128) und mit dem Quiz zu "unable to allocate CUDA0 buffer". Plausibel und belegt am Code, nicht von mir auf dem Gerät nachgestellt.
3. RAG-Labor-Skala "0 unverwandt bis 1 sehr ähnlich, Marker bei 80 Prozent": stimmt mit Einschränkung nicht zum Messwert, siehe oben (Rang 2 mit 0,56 bei thematisch fremdem Abschnitt). Der Fließtext auf der Embeddings-Seite ("kein fester Wert") ist richtig, die Abbildung sagt es unscharf.
4. Arbeitsblatt KI 2 (PDF): Quizfrage "Ein Netz ohne Zwischenschicht lernt das Schachbrett nicht. Was hilft meist? Mindestens eine Zwischenschicht" ist fachlich richtig (nicht linear trennbar). Aufgabe zur Lernrate (sehr klein, sehr groß, Verlust beobachten) ist korrekt. PDF sauber gesetzt (3 Seiten, QR-Code, Operatoren I bis III, Niveau-Kästchen), Kopfzeile "Lizenz: noch festzulegen" stört bei Unterrichtsmaterial.

Quote: 4 Stichproben, 1 Widerspruch (Tokens-Abbildung gegen Labor, im Kern unverändert zur Vorrunde), 1 Einschränkung (Skala), 2 stimmen.

## 7. Meine Erklärung in drei Sätzen

RAG: Ein Programm zerlegt meinen Text, macht aus jedem Stück 768 Zahlen, sucht zur Frage die ähnlichsten Stücke und gibt nur diese mit der Frage an das Sprachmodell. Ein Agent ist dasselbe Modell in einer Schleife mit höchstens fünf Runden: Es schreibt den Werkzeugaufruf, ein normales Programm führt ihn aus. Token sind Stücke aus einem festen Wortschatz (hier 128.256), und Kontext, Kosten und Geschwindigkeit werden in ihnen gezählt.

## 8. Würdest du es empfehlen?

Ja, für Einsteiger in KI-Entwicklung und Quereinsteiger im Team, weil Labor, Zeitstreifen und der echte Tokenizer zeigen, was sonst nur in Folien steht. Für Profis bleibt es ein ehrlicher Einstieg ohne Quellen und Formeln, und im Labor muss die Antwort auch unter Last zuverlässig kommen, sonst endet der schönste Aufbau in "Noch einmal versuchen".

### Die drei größten Lücken Richtung 10
1. Quellen und Formeln: je technischer Seite 2 bis 4 Weiterlesen-Links (Transformer 2017, ReAct, RAG-Originalarbeit, Lost in the Middle, MCP-Spezifikation) und ein Schalter "Mit Mathe" in der Kopfleiste neben "Kurz/Genau" für Kosinus, BM25, Softmax, Parameterzahl.
2. Zuverlässigkeit und Fehlerbild im RAG-Labor: Antwort statt Speichermeldung (oder eine nachvollziehbare Meldung mit Zahlen, Warteschlange und geschätzter Wartezeit), alte Fehlermeldung beim erfolgreichen Einlesen löschen, leere Frage mit Hinweis beantworten, Wartezustand sichtbar halten, wenn das Labor unter der Bildschirmkante liegt.
3. Rollenpfad und harte Modellzahlen: Für die IT-Rolle RAG-Werkstatt, Agent, Tokenizer, Chat in "Für dich" und eine Seite "Das Modell in Zahlen" (Kontextlänge, Quantisierung, GPU-Schichten, Tempo, Rate-Limit). Dazu den veralteten Absatz zur Zerlegung auf der Tokens-Seite an das echte Labor anpassen und die Code-Lizenz festlegen.

## Nicht geprüft
Chat mit Modellantwort (keine weitere Anfrage wegen Last), Kamera, Mikrofon, Sprachlabore, Handy-Ansicht, Hell-Modus aller Seiten (Stichproben hell: Startseite, RAG, Agent, Selbst aufbauen), Kontrastmessung, Screenreader, Ton der Videos, Kartenset und Elternabend-Infoblatt (nur das Arbeitsblatt KI 2 geöffnet), Lösungsblatt nur als Datei geladen und als Bild erzeugt, nicht ausgewertet.
