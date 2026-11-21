# Bausteine: Strang Daten und Prognosen, KI im Betrieb

Alle Bausteine laufen im Browser (clientseitig, ohne Server und ohne Kamera). Schnittstelle: `KL.widgets.<name> = function (root, seite)`, siehe `app/static/app.js`. Die Daten sind Entwürfe und erfunden. Alle Texte in den Bausteinen folgen `docs/schreibleitfaden.md` (Du-Form, echte Umlaute, keine Gedankenstriche).

## baum-spiel (Seite `tabellen-ml`)
- **Zweck:** Erleben, wie ein Entscheidungsbaum die beste Frage wählt und wie Überanpassung entsteht.
- **Bedienung:** Eine Tabelle mit 20 Zeilen (Kreditanträge: Zahlungsrückstände ja/nein, Einkommen niedrig/mittel/hoch, Kontodauer in Jahren, Alter, Ergebnis zurückgezahlt/ausgefallen). Die Nutzerin klickt in einem Baumdiagramm auf einen Knoten und wählt aus einer Liste die Frage (Merkmal und Schwelle). Neben jeder Frage steht die Reinheit der beiden Gruppen als Balken. Knopf „Beste Frage vorschlagen“ zeigt, was das Verfahren wählen würde. Schalter „Tiefe“ (1 bis 6) und „Mindestzahl je Blatt“. Unter dem Baum zeigt ein Zähler die Genauigkeit auf den Trainingszeilen und auf 8 zurückgehaltenen Prüfzeilen.
- **Daten (Entwurf):** 20 Trainings- und 8 Prüfzeilen, fest im Code, so gewählt, dass „Zahlungsrückstände“ die beste erste Frage ist und ein sehr tiefer Baum auf den Prüfzeilen schlechter wird als ein flacher. Nichts davon sind echte Kundendaten.
- **Lerneffekt:** Beste Frage = höchste Reinheit. Ein zu tiefer Baum ist auf dem Training perfekt und auf den Prüfzeilen schwächer (Überanpassung). Bäume sind lesbar: Jedes Blatt zeigt den Pfad dorthin.
- **Technik:** Reines JavaScript, SVG für den Baum, Reinheit als Gini oder Anteil der Mehrheitsklasse, Zeilen in einem Array. Keine Bibliothek.
- **Aufwand:** mittel (rund zwei Tage).

## prognose-labor (Seite `zeitreihen`)
- **Zweck:** Trend, Saison und Zufall getrennt erleben, sehen wie ein Modell fortschreibt, und Unsicherheit und Ausreißer begreifen.
- **Bedienung:** Ein Liniendiagramm mit 36 Zeitpunkten (zum Beispiel Monate). Regler für Trendstärke, Saisonstärke (Periode 12) und Rauschen erzeugen die Verlaufsdaten. Ein Knopf „Prognose“ schreibt die nächsten 12 Punkte fort (Modell zerlegt in Trend und Saison und führt beides weiter). Ein Band zeigt den Unsicherheitsbereich, der nach rechts breiter wird. Schalter „Ausreißer einbauen“ setzt einen einzelnen starken Ausreißer, ein weiterer „Ereignis, das es nie gab“ verschiebt das Niveau ab einem Zeitpunkt, und die Prognose liegt sichtbar daneben. Eine Zeile zeigt den mittleren Prognosefehler gegenüber der Faustregel „wie letztes Jahr“.
- **Daten (Entwurf):** erzeugt aus Formel plus festem Zufallsstartwert, damit Läufe wiederholbar sind. Einheiten: Wertebereich 0 bis 200 ohne Bezeichnung.
- **Lerneffekt:** Muster fortschreiben ist möglich, Zufall nicht. Das Band zeigt Unsicherheit. Ein Ausreißer verzerrt die Anpassung, ein neues Ereignis bricht die Prognose. Eine Faustregel ist der Maßstab.
- **Technik:** Canvas oder SVG, Zerlegung per gleitendem Mittel für den Trend und Mittelwert je Saisonposition, Band aus der Streuung der Reste mal einem wachsenden Faktor. Reines JavaScript.
- **Aufwand:** mittel bis hoch (rund drei Tage).

## anomalie-labor (Seite `anomalien`)
- **Zweck:** Das Gleichgewicht aus Fehlalarmen und übersehenen Fällen am Schwellenwert erleben.
- **Bedienung:** Ein Liniendiagramm einer Messreihe (zum Beispiel Vibration einer Maschine) mit 200 Punkten, darin 6 versteckte echte Auffälligkeiten. Ein Regler stellt den Schwellenwert (Abstand vom Mittelwert in Vielfachen der Streuung). Punkte über der Schwelle werden markiert. Zwei Zähler zeigen: gefundene echte Fälle (x von 6), Fehlalarme (Anzahl), und ein Satz „Von n Meldungen sind m echt“. Schalter „Messreihe neu würfeln“ und „Rauschen erhöhen“.
- **Daten (Entwurf):** erzeugt aus einer Normalverteilung mit eingestreuten Spitzen, fester Startwert pro Knopfdruck.
- **Lerneffekt:** Es gibt keinen Schwellenwert ohne Kosten. Die Mehrzahl der Meldungen kann falsch sein, obwohl das Verfahren gut ist. Mit mehr Rauschen wird das Trennen schwerer.
- **Technik:** Canvas, reines JavaScript, Mittelwert und Standardabweichung auf den ersten 100 Punkten als „Lernphase“.
- **Aufwand:** niedrig (rund ein Tag).

## empfehlungs-labor (Seite `empfehlungen`)
- **Zweck:** Nachvollziehen, wie Empfehlungen aus Ähnlichkeit entstehen, und Kaltstart und Filterblase erleben.
- **Bedienung:** Eine Tabelle mit 6 Personen und 8 Produkten (Ersatzteile oder Wissensartikel), ja oder nein pro Zelle. Die Nutzerin klickt Zellen um und wählt eine Person. Das System zeigt die Ähnlichkeit zu allen anderen als Balken (Kosinus-Ähnlichkeit) und darunter die Empfehlungen mit Begründung („weil Ben dir ähnelt“). Eine neue, leere Person zeigt den Kaltstart (Rückfall auf Beliebtes). Ein Schalter „Vielfalt beimischen“ mischt eine nicht passende Empfehlung dazu.
- **Daten (Entwurf):** feste erfundene Beispieltabelle, keine Personen. Namen sind Vornamen aus dem Entwurf (Anna, Ben, Cem, Dora, Emil, Fynn).
- **Lerneffekt:** Ähnlichkeit als Rechnung, Nachbarschaft der Geschmäcker, Kaltstart, Filterblase und Gegenmaßnahme.
- **Technik:** HTML-Tabelle, reines JavaScript, Kosinus-Ähnlichkeit über Zeilen, Empfehlung als Summe der Ähnlichkeiten der Nachbarn für nicht gekaufte Produkte.
- **Aufwand:** niedrig bis mittel (rund anderthalb Tage).

## kosten-rechner (Seite `kosten-energie`)
- **Zweck:** Stromkosten und Zeit bis zur Amortisation selbst ausrechnen, mit eigenen Annahmen.
- **Bedienung:** Eingabefelder: Leistungsaufnahme in Watt, Laufzeit pro Tag in Stunden, Strompreis in Euro je Kilowattstunde, Anschaffung in Euro, Cloud-Kosten pro Monat in Euro. Ausgabe: Energie pro Tag, Kosten pro Tag, pro Monat, pro Jahr, Ersparnis pro Monat gegenüber der Cloud und Monate bis zur Amortisation (oder „nie“). Ein Hinweistext: „Alle Werte sind deine Annahmen, keine Preise oder Messwerte.“ Optional ein Knopf „Messwert vom Jetson übernehmen“, der `power_w` aus `KL.stats.letzte` einsetzt (nur, wenn der Wert vorhanden ist). Sonst Handeingabe.
- **Daten (Entwurf):** Startwerte nur als sichtbar markierte Beispielwerte (15 Watt, 24 Stunden, 0,30 Euro, 500 Euro, 50 Euro), die Nutzerin überschreibt sie.
- **Lerneffekt:** Watt mal Stunden, Kilowattstunde, die Rechnung über die gesamte Laufzeit. Die Rechnung hängt von den Annahmen ab. Personal und Wartung fehlen (eigenes Feld „Laufende Betreuung pro Monat“ optional).
- **Technik:** Reines HTML und JavaScript, Zahlenformat deutsch (Komma), Eingabeprüfung gegen leere und negative Werte.
- **Aufwand:** niedrig (rund ein halber Tag).
