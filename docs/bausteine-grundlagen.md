# Bausteine des Strangs Grundlagen

Vier interaktive Bausteine. Sie werden separat gebaut und rein im Browser berechnet (kein Server, keine Modelle, keine Bibliotheken außer dem, was `widgets.js` schon bietet). Registrierung wie die vorhandenen Bausteine: `window.KL.widgets["<name>"] = function (root, seite) { ...; return { destroy() {} } }`. Alle Texte auf Deutsch mit echten Umlauten, keine Gedankenstriche, keine Emojis, Symbole nur aus dem vorhandenen Satz.

Gemeinsame Regeln: Jeder Baustein hat einen kurzen Einführungssatz, einen Zurücksetzen-Knopf, ein festes Zufallsmuster (Startwert), damit Ergebnisse reproduzierbar sind, Tastaturbedienung für alle Regler und eine Textzeile mit `aria-live`, die das aktuelle Ergebnis in Worten nennt. Dunkles und helles Farbschema über die vorhandenen CSS-Variablen. Alle Zeichenflächen skalieren mit der Breite.

## 1. `netz-spielplatz` (Seite `neuronale-netze`)

**Zweck.** Zeigen, dass ein Netz aus gewichteten Summen eine gebogene Entscheidungsgrenze lernt, und dass Schichten und Neuronen dafür nötig sind.

**Bedienung.**
- Auswahl einer Punktmenge: „Zwei Klumpen“, „Kreis im Kreis“, „Schachbrett“, „Spirale“. Klick auf die Fläche setzt eigene Punkte (Taste zum Umschalten der Klasse).
- Regler: Zahl der Zwischenschichten (0 bis 3), Neuronen je Schicht (1 bis 8), Aktivierung (Stufe, weich, Rampe), Lernrate.
- Knöpfe: Training starten/anhalten, Einzelschritt, Neu starten (neue Anfangsgewichte), Zurücksetzen.
- Anzeige: Entscheidungsfläche als Farbverlauf unter den Punkten, aktualisiert sich live. Rechts ein Diagramm mit Trainings- und Testverlust über die Schritte. Darunter das Netz als Zeichnung, Linienstärke und Farbe zeigen Gewichte.
- Textzeile: „Schritt 120, Verlust 0,31, 94 von 100 Punkten richtig.“

**Daten (Entwurf, erfunden).** Punktmengen werden im Code erzeugt: je 100 Punkte pro Klasse im Quadrat von minus 1 bis 1, mit festem Zufallsstartwert. „Zwei Klumpen“: Mittelpunkte (-0,5 / -0,5) und (0,5 / 0,5), Streuung 0,25. „Kreis im Kreis“: Klasse A bis Radius 0,4, Klasse B zwischen 0,6 und 0,9. „Schachbrett“: Vorzeichen von x mal y. „Spirale“: zwei verschlungene Arme mit leichtem Rauschen. 20 Prozent der Punkte gehen in die Testmenge.

**Lerneffekt.** Mit null Zwischenschichten zieht das Netz nur eine Gerade und scheitert an „Kreis im Kreis“. Mit einer Schicht und wenigen Neuronen klappt es. Mehr Neuronen erlauben feinere Grenzen, bei der Spirale braucht es mehr Schichten. Zu viele Neuronen bei wenigen Punkten zeigen Überanpassung im Testverlust.

**Technik.** Eigenes kleines Netz in Float32Array, Rückpropagierung mit Päckchen, Zeichnung auf Canvas, Entscheidungsfläche auf einem groben Gitter (zum Beispiel 40 mal 40) hochskaliert. Schritte in `requestAnimationFrame`, höchstens etwa 5 ms Rechenzeit je Bild. Keine Bibliothek.

**Aufwand.** Mittel bis hoch, etwa 2 Tage.

## 2. `gradient-abstieg` (Seite `training`)

**Zweck.** Gradientenabstieg und Lernrate fühlbar machen: kleine Schritte bergab, zu große springen über das Tal, zu kleine dauern ewig.

**Bedienung.**
- Landschaft auf einer Zeichenfläche (Verlust über einer Gewichtsachse, einfache Ansicht) mit einer Kugel. Klick setzt den Startpunkt.
- Regler Lernrate (logarithmisch, von sehr klein bis sehr groß), Schalter Landschaft: „Eine Mulde“, „Zwei Mulden“, „Steile Schlucht“.
- Knöpfe: Start, Pause, Einzelschritt, Zurücksetzen.
- Anzeige: Spur der letzten Positionen, Zahlenanzeige für Schritt, Gewicht und Verlust, kleine Kurve Verlust über Schritte. Text bei Auffälligkeit: „Die Schritte sind zu groß, die Kugel springt über das Tal.“

**Daten (Entwurf, erfunden).** Verlustfunktionen als Formeln: Mulde f(w) = (w - 2)², zwei Mulden f(w) = 0,1·w⁴ - 0,8·w² + 0,3·w + 1,5 (vereinfachte Form), Schlucht als Funktion zweier Gewichte (Ellipsenbecken), dann als Höhenlinien gezeichnet. Startwerte vorgegeben, Lernraten zwischen 0,01 und 1,2.

**Lerneffekt.** Mit passender Lernrate rollt die Kugel gleichmäßig ins Tal. Zu klein: sichtbar langsam. Zu groß: sie springt hin und her oder fliegt davon. Bei zwei Mulden hängt es vom Startpunkt ab, in welcher Mulde sie landet. In der Schlucht pendelt sie quer und kommt längs langsam voran.

**Technik.** Rein analytisch, Ableitungen als Formeln im Code, Canvas für die Zeichnung. Keine Bibliothek.

**Aufwand.** Niedrig bis mittel, etwa 1 Tag.

## 3. `konfusionsmatrix` (Seite `bewertung`)

**Zweck.** Zeigen, wie Schwelle, Matrix und Kennzahlen zusammenhängen und warum Genauigkeit bei seltenen Ereignissen täuscht.

**Bedienung.**
- Szenario wählen: „Spamfilter“, „Schimmelprüfung“, „Rauchmelder“, „Sicherheitskontrolle“.
- Schwellenregler von 0 bis 1. Regler „Anteil echter Fälle“ (selten bis häufig) verändert die Verteilung.
- Anzeige: Zwei überlagerte Verteilungen (Modellwert bei echten Fällen und bei harmlosen), die Schwelle als senkrechte Linie. Daneben die Matrix mit Anzahlen und Farbe. Darunter Genauigkeit, Precision und Recall als Balken mit Zahl und einem Satz in Worten. Eine Zeile nennt die Folge der Fehlerarten im gewählten Szenario („Eine gute Mail im Spamordner kann eine Rechnung oder Bewerbung verstecken.“).
- Optional: Knopf „Immer unauffällig sagen“ setzt die Schwelle auf 1 und zeigt 99 Prozent Genauigkeit bei null Recall.

**Daten (Entwurf, erfunden).** 1000 simulierte Fälle je Szenario, Modellwerte aus zwei Glockenkurven (echt: Mittel 0,7, Streuung 0,15; harmlos: Mittel 0,3, Streuung 0,15), Anteil echter Fälle voreingestellt auf 10 Prozent, Zufallsstartwert fest. Szenarientexte mit Folge je Fehlerart statt erfundener Statistiken.

**Lerneffekt.** Wer die Schwelle senkt, sieht Recall steigen und Precision fallen. Bei seltenen Fällen bleibt die Genauigkeit hoch, auch wenn Recall einbricht. Die Wahl der Schwelle hängt vom Szenario ab.

**Technik.** Rein client-seitig, Zahlen aus gespeicherten simulierten Werten, Canvas oder SVG. Keine Bibliothek.

**Aufwand.** Niedrig bis mittel, etwa 1 Tag.

## 4. `datenqualitaet` (Seite `daten`)

**Zweck.** Erleben, wie Fehler, Lücken, Dubletten und Verzerrung in Daten ein einfaches Modell verschlechtern.

**Bedienung.**
- Tabelle mit etwa 30 Zeilen (Gebrauchtwagen: Baujahr, Kilometer, Zustand, Preis). In den Daten stecken versteckte Probleme: Tippfehler beim Baujahr, vertauschte Spalten, fehlende Preise, doppelte Zeilen, eine Gruppe (zum Beispiel eine Marke) kommt kaum vor.
- Der Nutzer klickt Zeilen an und markiert, was er für fehlerhaft hält (Fehler, Lücke, Dublette, Verzerrung). Ein Knopf „Prüfen“ zeigt, was gefunden wurde und was nicht.
- Rechts ein einfaches Modell (lineare Preisschätzung oder nächste Nachbarn), das live auf den aktuellen Daten trainiert. Ein Streudiagramm zeigt Schätzung gegen Wirklichkeit, eine Zahl den mittleren Fehler.
- Knöpfe „Bereinigen“ (markierte Zeilen entfernen oder korrigieren) und „Alle Fehler wieder einbauen“.

**Daten (Entwurf, erfunden).** 30 Zeilen, aus einer einfachen Regel erzeugt (Preis fällt mit Alter und Kilometern, plus Rauschen), danach gezielt verdorben: 3 Baujahre mit Zahlendreher, 2 Preise in der falschen Einheit, 3 fehlende Werte, 2 Dubletten, 1 Marke nur mit 2 Zeilen vertreten. Alle Marken und Preise ausgedacht, keine echten Anbieter.

**Lerneffekt.** Schon wenige Fehler verschieben die Schätzung sichtbar. Dubletten lassen das Modell sicherer wirken, als es ist. Seltene Gruppen werden schlechter geschätzt, auch wenn der Gesamtfehler klein bleibt.

**Technik.** Rein client-seitig. Modell: lineare Regression in wenigen Zeilen JavaScript. Tabelle als HTML mit Tastaturbedienung.

**Aufwand.** Mittel, etwa 1,5 Tage.
