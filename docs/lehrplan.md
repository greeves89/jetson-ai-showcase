# Lehrplan des KI-Labors

Ziel: Wer das Labor durcharbeitet, versteht, wie KI funktioniert, wo sie hilft, wo sie scheitert und wie man sie
im Betrieb einsetzt. Jede Seite folgt demselben Muster: Alltagsbild, Begriff, Technik, Grenzen, Ausprobieren
(Baustein oder Labor), Selbsttest, bei Bedarf Videos. Siehe `docs/schreibleitfaden.md`.

Jede Seite hat eine feste ID (Adresse `#/<id>`). Bereiche (Gruppen) stehen in der Navigation in dieser Reihenfolge.

## Grundlagen (Gruppe `Grundlagen`)
Vorhanden: `karte` Was ist KI, `ml` Maschinelles Lernen, `genki` Generative KI, `robotik` Robotik, `business` KI im Business.
Neu (Strang Grundlagen):
- `daten` Daten: der Rohstoff (Merkmale, Etiketten, Qualität, Menge, Datenschutz-Basics)
- `neuronale-netze` Neuronale Netze von Grund auf (Neuron, Gewicht, Schicht, Aktivierung)
- `training` Wie ein Modell lernt (Fehler, Gradientenabstieg, Lernrate, Epochen)
- `bewertung` Wie gut ist ein Modell? (Genauigkeit, Precision, Recall, Konfusionsmatrix, Schwelle)
- `verzerrung-ethik` Fairness, Verzerrung und Verantwortung
- `recht` Recht und Regeln im Überblick (Datenschutz, EU-KI-Verordnung; keine Rechtsberatung)

## Sehen (Gruppe `Sehen`)
Vorhanden: `gesicht`, `objekt`, `anlernen`.
Neu (Strang Sehen und Agenten):
- `bild-als-zahlen` Wie ein Computer ein Bild sieht (Pixel, Farbkanäle, Auflösung)
- `cnn-intuition` Wie Netze Bilder verstehen (Filter, Kanten, Schichten)
- `vision-aufgaben` Klassifikation, Erkennung, Segmentierung, Pose, Texterkennung im Vergleich

## Sprache (Gruppe `Sprache`)
Vorhanden: `chat`, `whisper`.
Neu (Strang Sprache):
- `tokens-sprachmodelle` Wie ein Sprachmodell gebaut ist (Token, Embedding, Aufmerksamkeit, Vortraining, Feinabstimmung)
- `prompting` Gut fragen (Rolle, Kontext, Beispiele, Format)
- `llm-grenzen` Grenzen und Risiken (Halluzination, Prompt-Injection, Datenschutz, Kosten)
- `finetuning-oder-rag` Wissen ins Modell oder ins Dokument?
- `sprachausgabe` Text zu Sprache (Labor wird separat gebaut; Seite beschreibt Technik und Einsatz)

## Wissen und RAG (Gruppe `Wissen und RAG`)
Vorhanden: `rag` (Werkstatt, wird später zur Vergleichswerkstatt ausgebaut).
Neu (Strang RAG), in dieser Reihenfolge vor `rag`:
- `rag-ueberblick` RAG im Überblick (Open-Book-Prüfung, Bibliothek)
- `rag-embedding` Vektorisieren und Embeddings (was, wozu, was zu beachten ist)
- `rag-chunking` Chunking: Text in sinnvolle Stücke teilen (Größe, Überlappung, Struktur)
- `rag-suche` Suchen: Stichwort, Vektor und Hybrid (BM25, Ähnlichkeit, Fusion)
- `rag-reranking` Reranking: erst grob, dann genau
- `rag-bewertung` RAG messen und verbessern (Trefferquote, Antworttreue, typische Fehler)

## Agenten (Gruppe `Agenten`)
Vorhanden: `agent`.
Neu (Strang Sehen und Agenten):
- `agenten-grundlagen` Was ist ein Agent? (Werkzeuge, Schleife, Gedächtnis)
- `agenten-planung` Planen, Schritte, Speicher, Fehlerbehandlung
- `agenten-sicherheit` Rechte, Prompt-Injection, Freigaben durch Menschen
- `mcp-werkzeuge` Werkzeuge standardisiert anbinden (Model Context Protocol)

## Erzeugen (Gruppe `Erzeugen`)
Vorhanden: `bild`, `faceswap`. Spätere Welle: `diffusion`, `audio-ki`, `urheberrecht`.

## Daten und Prognosen (Gruppe `Daten und Prognosen`)
Neu (Strang Prognose und Betrieb):
- `tabellen-ml` Entscheidungsbäume und Tabellendaten
- `zeitreihen` Prognosen aus Zeitreihen (Trend, Saison, Wartungsvorhersage)
- `anomalien` Auffälliges finden (Anomalieerkennung)
- `empfehlungen` Empfehlungssysteme

## KI im Betrieb (Gruppe `KI im Betrieb`)
Neu (Strang Prognose und Betrieb):
- `mlops` Vom Prototyp in den Betrieb (Daten, Training, Auslieferung, Überwachung, Drift)
- `kosten-energie` Kosten und Energie (lokal, Cloud, Edge)
- `ki-einfuehrung` KI im Unternehmen einführen (Use-Case-Auswahl, Pilot, Menschen mitnehmen)

## Business-Use-Cases (Gruppe `Business-Use-Cases`)
Fallstudien mit fertigem Beispiel zum Starten (Daten unter `app/static/beispiele/`):
`uc-fertigung-sichtpruefung`, `uc-fertigung-sortieren`, `uc-logistik-zaehlen`, `uc-handel-regal`,
`uc-gesundheit-auffaellig`, `uc-buero-dokumente`, `uc-buero-protokoll`, `uc-service-bestellung`,
`uc-sicherheit-zutritt`, `uc-sicherheit-baustelle`.

## Der Jetson (Gruppe `Der Jetson`)
Vorhanden: `hardware`. Spätere Welle: `edge-optimierung` (Quantisierung, TensorRT), `energie` (Messwerte).

## Videos
Je Seite 1 bis 3 Folgen (`videos: [...]` in der Seitendefinition). Gebaut werden sie in Wellen; nur fertige
Videos erscheinen auf der Seite.
