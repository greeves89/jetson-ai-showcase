# Videoskizzen: Strang Grundlagen

Sechs Folgen, je 70 bis 100 Sekunden, später von einer Stimme gesprochen. Sprechtext in Du-Form, kurze Sätze. Bilder sind animierte Diagramme im Stil des Labors (dunkler Grund, wenige Farben). Keine Kunden-, Firmen- oder Personennamen.

## 1. `daten-rohstoff` (Seite `daten`)

Titel: Daten, der Rohstoff
Kernaussage: Ein Modell lernt nur, was in den Daten steckt. Qualität und Vielfalt zählen mehr als Menge.
Dauer: etwa 85 Sekunden.

1. Bild: Ein Gebrauchtwagen-Inserat, Felder leuchten nacheinander auf. Sprechtext: „Ein Auto-Inserat zeigt, was Daten für eine KI sind. Baujahr, Kilometer und Zustand sind die Merkmale. Der Preis ist das Etikett, die gesuchte Antwort.“
2. Bild: Vier Symbole (Tabelle, Bild, Text, Ton) wandeln sich in Zahlenreihen. Sprechtext: „Für ein Modell ist alles am Ende Zahlen: Tabellen, Fotos, Text, Ton, Messwerte.“
3. Bild: Zeilen einer Tabelle, rote Markierungen bei Fehler, Lücke, Dublette. Sprechtext: „Das Modell kann nicht prüfen, ob Daten stimmen. Fehler, Lücken und doppelte Zeilen lernt es einfach mit.“
4. Bild: Links tausend fast gleiche Punkte, rechts zehn verschiedenfarbige, die den Raum füllen. Sprechtext: „Wie viel Daten reichen? Vielfalt vor Menge. Zehn verschiedene Fälle helfen mehr als tausend gleiche.“
5. Bild: Datenbalken teilt sich in drei Farben: Training, Validierung, Test, mit Symbolen Buch, Probeklausur, Klausur. Sprechtext: „Teile die Daten in drei Töpfe. Üben, Probeklausur, echte Klausur. Der Test bleibt bis zum Schluss unberührt.“
6. Bild: Schloss über einer Personenkarte, Häkchen bei „Zweck“ und „so wenig wie nötig“. Sprechtext: „Personenbezogene Daten brauchen einen Zweck und Sparsamkeit.“
7. Bild: Ein Kalender, die Tabelle altert, Pfeil zurück zu Pflege. Sprechtext: „Daten altern. Wer sie nicht pflegt, merkt es erst, wenn das Modell schlechter wird.“

## 2. `neuronale-netze-erklaert` (Seite `neuronale-netze`)

Titel: Neuronale Netze erklärt
Kernaussage: Ein Neuron summiert gewichtete Eingaben und entscheidet. Viele davon in Schichten ergeben feine Muster.
Dauer: etwa 90 Sekunden.

1. Bild: Fünf Personen heben Karten, manche Karten sind größer. Sprechtext: „Ein Team stimmt ab. Manche Stimmen zählen mehr. Das ist ein Neuron.“
2. Bild: Eingaben als Linien in einen Kreis, Dicke der Linie gleich Gewicht, Summe erscheint. Sprechtext: „Jede Eingabe wird mit einem Gewicht multipliziert. Alles wird addiert.“
3. Bild: Ampel, Schwellenlinie, Summe steigt, Ampel wird grün. Sprechtext: „Eine Schwelle entscheidet, ob das Neuron meldet. Wie bei der Fußgängerampel.“
4. Bild: Drei Spalten von Kreisen verbinden sich, Kanten, Formen, Gesicht erscheinen nacheinander. Sprechtext: „Viele Neuronen bilden Schichten. Die erste findet Kanten, die nächste Formen, die letzte ein Gesicht.“
5. Bild: Punkte auf einer Fläche, eine Gerade scheitert, eine gebogene Grenze gelingt. Sprechtext: „Eine Gerade trennt nicht alles. Mehrere Schichten ziehen gebogene Grenzen.“
6. Bild: Ein Zähler läuft hoch: 21, 78 500, Millionen, Milliarden. Sprechtext: „Die Gewichte heißen Parameter. Echte Netze haben Millionen bis Milliarden.“
7. Bild: Eine schwarze Box mit Pfeil hinein und heraus. Sprechtext: „Das Wissen steckt verteilt in den Zahlen. Darum lässt sich schwer erklären, warum ein Netz so entscheidet.“

## 3. `training-gradientenabstieg` (Seite `training`)

Titel: Wie ein Modell lernt
Kernaussage: Training senkt den Fehler in kleinen Schritten bergab. Die Lernrate bestimmt die Schrittweite.
Dauer: etwa 90 Sekunden.

1. Bild: Dartscheibe, Pfeile, Abstand zur Mitte wird als Linie gezeigt. Sprechtext: „Zuerst misst man den Fehler. Wie weit liegt der Pfeil neben der Mitte? Diese Zahl heißt Verlust.“
2. Bild: Kreislauf aus drei Pfeilen: vorhersagen, messen, nachjustieren. Sprechtext: „Dann kommt die Schleife. Vorhersagen, Fehler messen, die Gewichte ein Stück verschieben.“
3. Bild: Hügellandschaft im Nebel, Kugel steht auf einem Hang, kleiner Pfeil bergab. Sprechtext: „Stell dir den Fehler als Landschaft vor. Du stehst im Nebel und willst ins Tal. Du spürst nur das Gefälle unter dir.“
4. Bild: Kugel rollt in Schritten ins Tal, Spur bleibt. Sprechtext: „Du gehst einen Schritt bergab und prüfst wieder. So wird der Fehler kleiner.“
5. Bild: Drei Läufe nebeneinander: zu große Schritte springen über das Tal, passende kommen an, zu kleine bleiben stecken. Sprechtext: „Die Lernrate legt die Schrittweite fest. Zu groß: Du springst über das Tal. Zu klein: Es dauert ewig.“
6. Bild: Zwei Kurven, Training fällt, Validierung steigt wieder, Markierung „Stopp“. Sprechtext: „Beobachte die Validierungsdaten. Steigt der Fehler dort, passt sich das Modell zu sehr an. Dann halte an.“
7. Bild: Tausende kleine Rechenkästchen gleichzeitig, danach Schild „Vortraining, Feinabstimmung“. Sprechtext: „GPUs rechnen sehr viel gleichzeitig, deshalb eignen sie sich fürs Training. Mit Vortraining und Feinabstimmung startest du nicht bei null.“

## 4. `bewertung-konfusionsmatrix` (Seite `bewertung`)

Titel: Wie gut ist ein Modell?
Kernaussage: Genauigkeit täuscht bei seltenen Ereignissen. Die Matrix zeigt, wo die Fehler liegen, und die Schwelle verschiebt sie.
Dauer: etwa 90 Sekunden.

1. Bild: Rauchmelder mit Schild „99 Prozent richtig“, aber ohne Ton. Sprechtext: „Ein Rauchmelder, der nie piept, hat fast immer recht. Trotzdem hilft er nicht.“
2. Bild: Vier Felder erscheinen: richtig positiv, falsch positiv, falsch negativ, richtig negativ, mit Mails als Beispiel. Sprechtext: „Die Konfusionsmatrix zählt vier Fälle. Treffer, Fehlalarm, übersehen, richtig durchgelassen.“
3. Bild: Zahlen füllen die Felder: 90, 18, 10, 882. Sprechtext: „Ein Spamfilter prüft tausend Mails. Er findet 90 von 100 Spammails und sortiert 18 gute fälschlich aus.“
4. Bild: Drei Balken: Genauigkeit 97,2, Precision gut 83, Recall 90. Sprechtext: „Die Genauigkeit sieht großartig aus. Precision und Recall zeigen mehr.“
5. Bild: Fischernetz fängt Forellen und Beifang. Sprechtext: „Recall fragt: Wie viele Forellen hast du gefangen? Precision: Wie viele Fische im Netz sind Forellen?“
6. Bild: Schwellenregler wandert, Matrix ändert sich live. Sprechtext: „Mit der Schwelle stellst du ein, wie schnell das Modell Alarm schlägt. Niedrig: mehr Funde, mehr Fehlalarme.“
7. Bild: Waagschale mit „Fehlalarm“ gegen „übersehen“, daneben eine Person. Sprechtext: „Welche Schwelle passt, hängt von den Folgen ab. Vergleiche mit dem heutigen Ablauf, und lass bei unklaren Fällen einen Menschen entscheiden.“

## 5. `verzerrung-fairness` (Seite `verzerrung-ethik`)

Titel: Fairness und Verzerrung
Kernaussage: Modelle übernehmen, was in ihren Daten steckt. Verantwortung tragen Menschen, und bei Folgen für Menschen entscheidet ein Mensch.
Dauer: etwa 85 Sekunden.

1. Bild: Eine Umfrage vor einem Bahnhof, nur ein Teil der Passanten wird gezählt. Sprechtext: „Eine Umfrage nur morgens am Bahnhof erreicht nur Pendler. Sauber gezählt und trotzdem schief.“
2. Bild: Vier Quellen als Symbole: Daten, Auswahl, Etiketten, Rückkopplung. Sprechtext: „So entsteht Verzerrung: durch einseitige Daten, einseitige Auswahl, einseitige Etiketten und Rückkopplung.“
3. Bild: Aktenstapel mit „früher eingestellt“, Modell lernt daraus ein Muster. Sprechtext: „Lernt ein Modell aus alten Einstellungen, übernimmt es deren Einseitigkeit.“
4. Bild: Ein verborgenes Merkmal erscheint hinter einer Postleitzahl. Sprechtext: „Ein sensibles Merkmal wegzulassen reicht nicht. Die Postleitzahl kann es ersetzen.“
5. Bild: Ein Balken „98 Prozent“ spaltet sich in zwei Gruppen mit unterschiedlicher Höhe. Sprechtext: „Eine Gesamtzahl verdeckt Unterschiede. Werte Ergebnisse nach Gruppen aus.“
6. Bild: Fragenliste mit Häkchen. Sprechtext: „Prüfe vor dem Einsatz: Woher kommen die Daten, wer fehlt, wer kann widersprechen?“
7. Bild: Eine Person mit Hand über dem Knopf „Überstimmen“. Sprechtext: „Menschen tragen die Verantwortung. Bei Folgen für Menschen entscheidet ein Mensch, der wirklich eingreifen kann.“

## 6. `recht-ueberblick` (Seite `recht`)

Titel: Recht und Regeln im Überblick
Kernaussage: Datenschutz und KI-Verordnung folgen einfachen Grundgedanken. Keine Rechtsberatung, aktuelle Quellen prüfen.
Dauer: etwa 80 Sekunden.

1. Bild: Einblendung „Keine Rechtsberatung“, danach ein Wegweiser. Sprechtext: „Dieses Video ist keine Rechtsberatung. Es zeigt nur die Grundgedanken.“
2. Bild: Personenkarte mit Schloss und drei Schlüsselbegriffen. Sprechtext: „Personenbezogene Daten brauchen eine Rechtsgrundlage, einen festen Zweck, und es dürfen nur so viele sein wie nötig.“
3. Bild: Zahnräder Auftraggeber und Dienstleister, Vertrag dazwischen. Sprechtext: „Arbeitet ein Dienstleister in deinem Auftrag, braucht es einen Vertrag. Verantwortlich bleibst du.“
4. Bild: Betroffene Person mit Symbolen Auskunft, Berichtigung, Löschung. Sprechtext: „Betroffene haben Rechte: Auskunft, Berichtigung, Löschung und Widerspruch.“
5. Bild: Pyramide mit vier Stufen: verboten, Hochrisiko, Transparenz, minimal. Sprechtext: „Die EU-KI-Verordnung sortiert nach Risiko. Je höher es ist, desto mehr Pflichten.“
6. Bild: Fragezeichen über einem Buch und einem Roboter. Sprechtext: „Beim Urheberrecht sind Fragen offen: Trainingsdaten und erzeugte Inhalte.“
7. Bild: Ordner mit Dokumentation, Hausschlüssel „Abschalter“. Sprechtext: „Dokumentiere, wer wofür zuständig ist, und prüfe aktuelle Quellen, denn Einzelheiten ändern sich.“
