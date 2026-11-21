# Bausteine im Strang "Wissen und RAG"

Fünf interaktive Bausteine, die später gebaut werden. Ihre Namen stehen als `widget` in den Seiten von `app/static/content-rag.js`. Bis zum Bau zeigt die Seite "Baustein folgt".

| Baustein | Seite | Aha-Moment in einem Satz | Aufwand |
|---|---|---|---|
| `rag-bedeutungskarte` | `rag-embedding` | Sätze mit ähnlichem Sinn liegen nah beieinander, auch ohne gemeinsame Wörter. | mittel |
| `rag-chunk-labor` | `rag-chunking` | Derselbe Text liefert je nach Schnitt Stücke, in denen die Antwort ganz oder nur halb steht. | mittel |
| `rag-suche-vergleich` | `rag-suche` | Stichwort und Vektor scheitern an verschiedenen Fragen, die Mischung fängt beide auf. | mittel bis hoch |
| `rag-rerank-labor` | `rag-reranking` | Die richtige Stelle steigt von Platz neun auf Platz eins, und das Nachsortieren kostet Zeit. | mittel |
| `rag-test-labor` | `rag-bewertung` | Die Trefferquote ändert sich sichtbar mit Methode und Trefferzahl, Gefühl hätte das nicht gezeigt. | gering bis mittel |

## Gemeinsame Daten und Technik

Alle Bausteine nutzen dieselben Beispieldaten, damit sich Seiten gegenseitig stützen: Wer auf `rag-suche` die Frage zum Parken sieht, trifft sie im Testlabor wieder.

- Datei `app/static/beispiele/rag-korpus.json` mit den Textstücken (Abschnitt "Beispielkorpus" unten), den Fragen und der bekannten Fundstelle je Frage.
- Vorberechnete Vektoren für den Korpus und die Beispielfragen in `app/static/beispiele/rag-vektoren.json`, erzeugt mit einem kleinen Skript unter `scripts/` über `nomic-embed-text` (768 Zahlen je Text). So laufen die Bausteine auch ohne Wartezeit und ohne Jetson-Aufruf für die Beispiele.
- Nur freie Eingaben der Nutzer (neuer Satz, eigene Frage) brauchen einen Aufruf an den Jetson. Dafür den vorhandenen Einbettungsweg der RAG-Werkstatt wiederverwenden, nichts Neues bauen.
- Berechnungen, die klein und deterministisch sind, laufen im Browser: Kosinus, Stichwortwertung, Rangfusion, Trefferquote, Zerlegen von Text.
- Alle Bausteine zeigen bei fehlendem Jetson eine Hinweiszeile und bleiben mit den Beispieldaten bedienbar.
- Gestaltung wie die vorhandenen Bausteine (`widgets.js`, `widgets.css`). Keine Emojis, nur Symbole des Labors, echte Umlaute in allen sichtbaren Texten.

---

## 1. `rag-bedeutungskarte`

Seite: `rag-embedding`.

**Zweck.** Zeigt, dass Embeddings Bedeutung als Nähe abbilden. Die Nutzerin sieht echte Satz-Embeddings als Punkte und prüft mit eigenen Sätzen, ob die Karte "versteht".

**Bedienung.**
1. Die Karte zeigt etwa dreißig Beispielsätze als Punkte. Die Punkte haben eine Farbe je Themengruppe (Essen, Auto und Verkehr, Büro, Wetter, Gesundheit). Ein Satz wird beim Darüberfahren eingeblendet.
2. Die Nutzerin tippt einen eigenen Satz in ein Feld und drückt "Einbetten".
3. Der Satz erscheint als leuchtender neuer Punkt. Die drei bis fünf nächsten Nachbarn werden mit Linien verbunden und in einer Liste unter der Karte mit ihrem Kosinuswert aufgeführt.
4. Ein Schalter "Zahlen zeigen" blendet die ersten Einträge des 768-stelligen Vektors als kleine Balken ein. Ein Hinweis nennt die Zahl 768.
5. Eine Schaltfläche "Karte zurücksetzen" entfernt die eigenen Punkte.

**Daten (Entwurf, erfunden und neutral).** Sätze je Gruppe:
- Essen: "Zum Frühstück gibt es Brötchen mit Marmelade." "Die Suppe braucht noch etwas Salz." "Wir backen am Sonntag einen Apfelkuchen." "Der Kaffee ist heute besonders stark." "Ich koche gern Nudeln mit Tomatensauce."
- Auto und Verkehr: "Das Auto steht auf dem Parkplatz vor dem Haus." "An der Kreuzung ist die Ampel ausgefallen." "Der Bus fährt alle zehn Minuten." "Ich muss noch tanken, bevor ich losfahre." "Auf der Autobahn gibt es einen Stau."
- Büro: "Die Besprechung beginnt um zehn Uhr im großen Raum." "Bitte schicke mir die Rechnung per Mail." "Der Drucker braucht neues Papier." "Der Urlaubsantrag liegt bei der Teamleitung." "Das Protokoll wird bis morgen verteilt."
- Wetter: "Morgen soll es den ganzen Tag regnen." "Am Wochenende wird es sonnig und warm." "Nachts sinkt die Temperatur unter null Grad." "Ein Gewitter zieht von Westen auf." "Der Wind weht heute kräftig."
- Gesundheit: "Er hat seit Montag Fieber und Husten." "Ich war zur Untersuchung beim Arzt." "Die Tabletten nimmst du morgens nach dem Essen." "Nach der Operation braucht sie Ruhe." "Wir haben einen Termin zur Impfung."

Die 2D-Position jedes Satzes wird einmal offline aus den 768 Zahlen berechnet (zum Beispiel Hauptkomponentenanalyse, die zwei Achsen mit den meisten Unterschieden) und gespeichert. Für neue Sätze werden die gespeicherten Achsen wiederverwendet.

**Lerneffekt.** Aha 1: "Mein Satz über den Kühlschrank landet bei den Essenssätzen, obwohl kein Wort passt." Aha 2: Die Nachbarliste wird in 768 Dimensionen berechnet, die Karte zeigt nur eine Skizze. Manchmal liegt ein Satz auf der Karte nah an einer Gruppe, aber die Liste nennt andere Nachbarn. Ein Hinweistext erklärt, warum (die Karte verliert Information).

**Technik.** Die Nachbarsuche (Kosinus über 30 Vektoren) und die Projektion auf zwei Achsen laufen im Browser. Das Einbetten des freien Satzes braucht den Jetson mit `nomic-embed-text`, eine Anfrage je Eingabe. Ohne Jetson: Beispielsätze anklicken statt tippen, deren Vektoren liegen in der Datei.

**Aufwand.** Mittel. Etwa ein bis zwei Arbeitstage: Skript für Vektoren und Projektion, Karte als SVG oder Canvas, Eingabe, Nachbarliste.

---

## 2. `rag-chunk-labor`

Seite: `rag-chunking`.

**Zweck.** Zeigt, dass der Schnitt entscheidet, ob eine Antwort in einem Stück ganz oder zerrissen vorliegt, und lässt Größe, Überlappung und Strategie vergleichen.

**Bedienung.**
1. Ein Textfeld enthält einen Beispieltext (Entwurf unten). Die Nutzerin kann ihn ersetzen oder eigenen Text einfügen.
2. Auswahl der Strategie: feste Länge, Absatz, Satz, nach Überschrift, rekursiv.
3. Regler für die Größe (Zeichen, etwa 100 bis 1500) und für die Überlappung (0 bis etwa 40 Prozent der Größe).
4. Der Text erscheint darunter in Farbe: jedes Stück eine eigene Farbe, die Überlappung schraffiert. Neben jedem Stück stehen Nummer und Länge. Oben steht die Zahl der Stücke und die mittlere Länge.
5. Testfrage: Ein Feld "Antwortsatz" (vorbelegt mit der Antwort auf die Beispielfrage). Der Baustein markiert die Stelle im Text. Er zeigt "Die Antwort liegt ganz in Stück 4" in Grün oder "Die Antwort ist zerrissen: Stück 4 und 5" in Rot.
6. Ein Knopf "Alle Einstellungen durchprobieren" zeigt eine kleine Tabelle: Für jede Strategie und drei Größen steht, ob die Antwort ganz in einem Stück liegt.

**Daten (Entwurf).** Ein erfundenes Kurzhandbuch "Kaffeevollautomat Modell K" mit Überschriften "Inbetriebnahme", "Reinigung", "Entkalken", "Fehlermeldungen" und etwa 15 bis 20 Absätzen. Testfragen: "Wie oft muss entkalkt werden?" mit Antwortsatz "Das Gerät sollte alle drei Monate entkalkt werden, bei hartem Wasser früher." Eine zweite Frage, deren Antwort über zwei Absätze reicht ("Welche Schritte gehören zur Reinigung?"), damit die Überlappung gebraucht wird. Eine Tabelle im Text (Fehlercodes mit Bedeutung), damit sichtbar wird, wie ein reiner Zeichenschnitt eine Tabelle zerlegt.

**Lerneffekt.** Aha: "Mit 300 Zeichen und ohne Überlappung ist meine Antwort zerrissen. Mit 20 Prozent Überlappung liegt sie ganz in einem Stück." Und: Der Schnitt nach Überschrift hält die Tabelle zusammen, der Zeichenschnitt nicht.

**Technik.** Rein im Browser möglich (Text, Zeichenzähler, Regeln für Absatz, Satz, Überschrift und rekursives Teilen). Das semantische Teilen weglassen oder nur als Hinweistext erwähnen, weil es Embeddings braucht. Optional: Knopf "Mit dem Jetson suchen", der die Stücke einbettet und die Testfrage sucht, um zu zeigen, ob das richtige Stück auf Platz 1 steht. Dieser Teil braucht `nomic-embed-text` und dauert je nach Textlänge Sekunden.

**Aufwand.** Mittel. Etwa zwei Arbeitstage ohne den optionalen Suchteil.

---

## 3. `rag-suche-vergleich`

Seite: `rag-suche`.

**Zweck.** Zeigt nebeneinander, dass Stichwort und Vektor an verschiedenen Fragen gewinnen und verlieren, und dass die Hybridsuche beides abfängt. Die Rangfusion wird sichtbar.

**Bedienung.**
1. Oben ein Feld für die Frage und eine Reihe von Beispielfragen als Knöpfe (Entwurf unten).
2. Drei Spalten: "Stichwort (BM25)", "Vektor", "Hybrid". Jede zeigt die besten fünf Treffer als Karten mit Rang, Text und Punktwert. Die richtige Fundstelle ist mit einem Haken markiert, sofern die Frage aus dem Beispielsatz stammt.
3. In der Stichwortspalte sind die Wörter markiert, die gepasst haben. In der Vektorspalte steht der Kosinuswert.
4. In der Hybridspalte zeigt jede Karte die Rechnung: "Stichwort Platz 1 ergibt 0,0164, Vektor Platz 4 ergibt 0,0156, Summe 0,0320". Ein Regler "Gewicht Stichwort gegen Vektor" ändert die Mischung.
5. Ein Regler "Trefferzahl k" (1 bis 10) schneidet die Spalten ab.
6. Ein Schalter "Filter" schränkt den Korpus auf eine Gruppe ein (zum Beispiel Technik, Personal).

**Daten (Entwurf, erfunden und neutral).** Korpus von etwa vierzehn Absätzen:
- P1 "Fehlercode E-4711 bedeutet: Der Filter ist verstopft. Filter reinigen und Gerät neu starten."
- P2 "Fehlercode E-4712 bedeutet: Der Wassertank ist leer. Tank füllen und Taste Start drücken."
- P3 "Fahrzeuge dürfen nur auf den gekennzeichneten Flächen des Betriebsgeländes geparkt werden."
- P4 "Besucher melden sich am Empfang an und erhalten einen Ausweis, den sie gut sichtbar tragen."
- P5 "Die Wartung der Pumpe 3 erfolgt alle sechs Monate. Dabei wird der Dichtungsring ersetzt."
- P6 "Der Dichtungsring wird vor dem Einbau dünn mit Silikonfett eingerieben."
- P7 "Urlaub beantragen Mitarbeitende mindestens zwei Wochen vorher bei der Führungskraft."
- P8 "Die Kantine bietet täglich ein vegetarisches Gericht und einen Salat an."
- P9 "Zum Abschalten der Anlage zuerst den Hauptschalter auf Null stellen und die Druckleitung entlasten."
- P10 "Wer krank ist, meldet sich bis neun Uhr bei der Führungskraft und reicht ab dem dritten Tag eine Bescheinigung ein."
- P11 "Die Garantie beträgt 24 Monate ab Kaufdatum. Verschleißteile wie Dichtungen sind ausgenommen."
- P12 "Lieferungen an Samstagen sind möglich und kosten einen Aufschlag."
- P13 "Rechnungen werden innerhalb von 14 Tagen nach Eingang bezahlt."
- P14 "Ein Wasserschaden am Gerät ist keine Garantieleistung."

Beispielfragen mit der erwarteten Wirkung (Hypothesen, vor dem Bau mit den echten Embeddings prüfen und die Texte so anpassen, dass jedes Muster zuverlässig sichtbar wird):
- "Wo darf ich mein Auto abstellen?" meint P3. Vektor gewinnt, Stichwort verliert, weil kein Wort übereinstimmt.
- "E-4711" meint P1. Stichwort gewinnt. Der Vektor stellt P2 weit vorn, weil beide Codes ähnlich wirken.
- "Wie oft wird der Dichtungsring von Pumpe 3 gewechselt?" meint P5. Beide finden es, die Stichwortsuche mit klarem Abstand.
- "Wie lange gilt die Gewährleistung?" meint P11. Vektor gewinnt über das Synonym Garantie.
- "Urlaup beantragen" als Beispiel für einen Tippfehler im Kernwort. P7 ist gemeint. Stichwort verliert, Vektor gewinnt meist.
- "Was kostet die Lieferung am Samstag?" meint P12. Beide gut, Hybrid sichert ab.
- "Gilt die Frist von 14 Tagen für Rechnungen?" als Beispiel für Zahlen. P13 ist gemeint. Stichwort findet es über die Zahl, der Vektor sieht auch andere Fristen als ähnlich.

**Lerneffekt.** Aha: "Bei E-4711 hätte mich die reine Vektorsuche in die Irre geführt, bei dem Auto ließ mich die Stichwortsuche im Stich. Die Hybridsuche hat beide Fälle gelöst." Und: Die Rangfusion ist keine Zauberei, man sieht ihre Rechnung.

**Technik.** BM25 (Zerlegen in Wörter, kleingeschrieben, ohne Wortstämme, damit Synonym und Beugung sichtbar scheitern) und Rangfusion laufen im Browser. Vektoren für Korpus und Beispielfragen sind vorberechnet. Eigene Fragen brauchen den Jetson mit `nomic-embed-text`. Ohne Jetson sind nur die Beispielfragen wählbar.

**Aufwand.** Mittel bis hoch. Etwa drei Arbeitstage: Datenaufbereitung, BM25, drei Spalten mit Rechenweg, Regler, Filter.

---

## 4. `rag-rerank-labor`

Seite: `rag-reranking`.

**Zweck.** Zeigt, wie sich die Reihenfolge der Kandidaten durch einen Reranker ändert, und macht den Preis sichtbar: Zeit und Schwankung.

**Bedienung.**
1. Die Nutzerin wählt eine Frage aus einer Liste. Links erscheinen die besten zehn Treffer der ersten Suche (Vektor oder Hybrid) mit Rang und Punktwert.
2. Sie drückt "Nachsortieren". Rechts läuft die Bewertung: Jeder Kandidat bekommt der Reihe nach einen Wert von 0 bis 10, mit Fortschrittsanzeige und gemessener Zeit je Kandidat.
3. Die Liste sortiert sich animiert neu. Pfeile zeigen den Rangwechsel (zum Beispiel "von 9 auf 1"). Die richtige Fundstelle ist markiert.
4. Unter der Liste stehen die Gesamtzeit und die Zahl der Durchgänge, dazu der Satz "Ohne Nachsortieren hätte die Antwort auf Platz 9 gelegen, bei k gleich 3 wäre sie nicht ans Modell gegangen."
5. Ein Knopf "Noch einmal bewerten" wiederholt die Bewertung und zeigt, ob sich einzelne Werte geändert haben.
6. Ein Regler "Kandidaten" (3 bis 10) zeigt, wie sich Zeit und Ergebnis ändern.

**Daten (Entwurf).** Zehn Kandidaten je Frage aus dem Korpus des Bausteins `rag-suche-vergleich`, ergänzt um einige ähnlich klingende, aber unpassende Absätze. Für den Einstieg eine Frage, bei der die vorberechnete erste Suche die richtige Stelle auf Platz 6 bis 9 zeigt (zum Beispiel "Was gilt bei Wasserschäden an Pumpe 3?" mit nahen Absätzen über Wartung, Garantie und Wasserschaden). Zu jedem Kandidaten Vorab-Bewertungen als Rückfalllösung, damit der Baustein ohne Jetson funktioniert.

**Lerneffekt.** Aha: "Die richtige Stelle springt nach oben, aber jeder Durchgang dauert." Zweiter Aha: Die Bewertung durch ein kleines Sprachmodell kann bei zwei Läufen verschiedene Werte liefern. Ein Reranker ist ein Werkzeug mit Preis und Streuung, kein Zauberstab.

**Technik.** Bewertung live mit `llama3.2:3b` auf dem Jetson: pro Kandidat ein Prompt mit Frage und Text, Antwort als Zahl (kurze Ausgabe, niedrige Temperatur). Die Ausgabe wird auf eine Zahl geprüft, bei Fehlern wiederholt. Ein Cross-Encoder steht nicht zur Verfügung, deshalb ist es ein Sprachmodell als Bewerter, was die Seite im Text offen sagt. Rückfall ohne Jetson: vorberechnete Werte. Neuordnung, Animation und Zeitmessung laufen im Browser.

**Aufwand.** Mittel. Etwa zwei Arbeitstage, Hauptaufwand sind der Bewerter-Prompt und die Robustheit der Zahlenausgabe.

---

## 5. `rag-test-labor` (optional)

Seite: `rag-bewertung`.

**Zweck.** Macht die Kennzahlen der Seite greifbar: Die Nutzerin sieht für ein kleines Testset die Trefferquote und den Rang, verändert Methode und Trefferzahl und beobachtet, wie sich die Zahlen bewegen.

**Bedienung.**
1. Eine Tabelle zeigt zehn Testfragen mit der bekannten Fundstelle (aus `rag-korpus.json`).
2. Auswahl der Methode: Stichwort, Vektor, Hybrid. Regler für k (1 bis 10).
3. Zu jeder Frage zeigt die Tabelle den Rang der richtigen Fundstelle (oder "nicht gefunden") und einen grünen oder roten Punkt für "unter den ersten k".
4. Oben stehen die Trefferquote in den ersten k ("7 von 10, 70 Prozent") und der durchschnittliche Kehrwert des Rangs. Beide Zahlen aktualisieren sich beim Verschieben der Regler.
5. Ein Klick auf eine Zeile zeigt die Treffer der Frage und warum die Stelle fehlt (zum Beispiel "Stichwort: keine gemeinsamen Wörter").
6. Eine Schaltfläche "Eigene Frage hinzufügen" lässt die Nutzerin eine Frage und die Fundstelle auswählen. Die Zahlen berechnen sich neu.

**Daten (Entwurf).** Die zehn Fragen aus dem Korpus des Bausteins `rag-suche-vergleich`, dazu zwei Fragen ohne Antwort im Korpus (richtig wäre "nichts gefunden"), damit der Begriff erklärt werden kann.

**Lerneffekt.** Aha: "Mit Vektor bekomme ich bei k gleich 1 sechs von zehn, bei k gleich 5 neun von zehn. Mit Hybrid steigt der erste Wert." Die Kennzahlen sind kein Rätsel mehr, und es wird deutlich, warum man ein Testset braucht.

**Technik.** Vollständig im Browser, wenn Vektoren und BM25 aus dem Baustein `rag-suche-vergleich` wiederverwendet werden (gemeinsame Hilfsfunktionen, keine zweite Implementierung). Eigene Fragen brauchen den Jetson. Antworttreue wird bewusst nicht gemessen, das braucht ein Modell als Bewerter und ist auf der Seite im Text erklärt.

**Aufwand.** Gering bis mittel, etwa ein Arbeitstag, sobald `rag-suche-vergleich` steht.
