# Materialien zum Mitnehmen (Paket D, Plan 22.11.2026)

Idee des Betreibers: Neben den Lernseiten soll es kostenlose Materialien geben, die man herunterladen, drucken und im Unterricht oder zu Hause nutzen kann. Aufbau erst nach Paket C (Inhalte), damit Materialien und Seiten dieselben Texte nutzen.

## Seite "Materialien" (eine Übersicht, Filter nach Zielgruppe)
Kacheln je Zielgruppe (Schule, Lehrende, Eltern, Beruf, Alle), je Material: Titel, Format (PDF, Bild, Tabelle), Seitenzahl, Zielgruppe, Lernziel, Download-Knopf, Vorschau.

## Material je Zielgruppe
- Schule und Lehrende: Arbeitsblätter zu den drei Unterrichtsstunden (mit Lösungsblatt), Tafelbild als Poster, Kurzfolien (PDF) je Stunde, Stundenverlaufsplan zum Abhaken, Elternbrief-Vorlage, Info-Blatt für die Schulleitung (1 Seite), Glossar als Karten.
- Alle: Poster "KI-Landkarte" (A3), Spickzettel "Gute Fragen an die KI" (A5), Checkliste "Echt oder KI?" (A6 zum Falten), Spickzettel "Quellen prüfen", Glossar als PDF, Lernkarten zu den Quizfragen (Frage vorne, Antwort hinten).
- Beruf und Betrieb: Checkliste "Drei Fragen vor dem KI-Einsatz", Datenschutz-Check (1 Seite), Beispieldaten und Anleitung für die Labore (CSV, Beispielbilder, Beispieltexte).
- Videos: Transkripte (Text), Untertitel (VTT), Kapitelübersicht als PDF.

## Technik
- Erzeugung zur Bauzeit aus denselben Inhaltsdaten wie die Seiten (kein zweiter Text), statische Dateien unter `app/static/materialien/`, kein Server-Code, keine Anmeldung, keine Statistik pro Person.
- Druckgerechte HTML-Vorlagen (A4/A5, Schwarzweiß-tauglich, große Schrift) und PDF-Erzeugung mit Playwright oder WeasyPrint; Barrierefreiheit: Überschriftenstruktur, Alternativtexte, Kontrast.
- Jede Datei trägt Titel, Quelle (KI-Labor, Adresse), Stand und Lizenzhinweis.
- Seiten-IDs verlinken direkt auf die zugehörige Lektion; Lektionen verlinken zurück auf passendes Material ("Zum Ausdrucken").
- Sitemap, llms.txt und seo_bauen kennen die Materialseite.

## Entscheidung beim Betreiber
Lizenz der Materialien. Vorschlag: CC BY 4.0 (frei nutzbar, Namensnennung "KI-Labor, Daniel Alisch"). Alternativen: CC BY-SA (Weitergabe unter gleichen Bedingungen) oder alle Rechte vorbehalten. Drittmaterial nur mit passender Lizenz; Bilder nur aus app/static/beispiele/ oder selbst erzeugt, keine Kundenbilder.

## PDF je Lektion und Labor mit Specs (Wunsch 22.11.)
Jede Lektion und jedes Labor bekommt einen Knopf "Als PDF herunterladen". Das PDF enthält den Seiteninhalt (Kompaktfassung, Bilder, Merksätze, Quiz ohne Lösung, Lösungen am Ende) und einen Kasten "Technische Daten" mit den Specs des Labors: eingesetztes Modell (Name, Größe, Version), Zweck, Lizenz, Hardware (Jetson Orin Nano, Speicher), typische Laufzeit/Messwerte (nur gemessene Werte, mit Datum), Datenfluss (was wird gespeichert: nichts). Quelle der Angaben: docs/lizenzen.md, app/speicher.py, app/lab_*.py, Modellnamen aus der Laufzeit; keine erfundenen Zahlen. Erzeugung zur Bauzeit aus den Inhaltsdaten (kein zweiter Text), Ablage unter app/static/materialien/pdf/<seiten-id>.pdf.
