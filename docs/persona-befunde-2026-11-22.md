# Persona-Prüfung 22.11.2026: Befunde für die öffentliche Freigabe

Vier Personen bedienten die Seite selbst im Browser (Rentnerin am Tablet, Betriebsinhaber am Desktop, Schüler am Handy, Lehrerin mit Tastatur und Datenschutzblick). Gesamtnoten: 5,5 / 5 / 6,5 / 6 von 10. Design wurde mit 8 bis 9 bewertet; die Lücken liegen bei Vertrauen (3 bis 7), Einsteigerführung und Fehlerfällen.

## Blocker
1. Impressum und Datenschutzerklärung fehlen (`/impressum`, `/datenschutz` liefern 404). Nötig vor öffentlicher Freigabe. Inhalte braucht der Betreiber (Anschrift, Kontakt).
2. Adresse ist eine lokale IP mit selbst signiertem Zertifikat. Nötig: Domain mit gültigem Zertifikat (Cloudflare Tunnel).
3. Keine Einwilligung vor Kamera/Mikro: Zweck, Speicherung, Dauer vor dem ersten Start in einfachen Worten.
4. Kapazität: Bei Last "Keine Antwort. Das hat diesmal nicht geklappt." ohne Handlungshinweis. Nötig: freundliche Meldung, Wiederholknopf, Warteschlange mit Platzanzeige, Zeitlimit je Sitzung.

## Hoch
- Startseite: "Jetson", "GPU", "in diesem Netz" sind Jargon und für Außenstehende falsch. Klartext, "Neu hier? Hier anfangen" mit drei Schritten, Einstieg für Entscheider ("In 15 Minuten") .
- Statusleiste/Live-Chip für Laien in Klartext.
- Glossar: Fachwörter sichtbar markieren, auch auf der Startseite; Volltext und Synonyme in der Suche (ChatGPT, Datenschutz, Foto, Handy, Halluzination); Treffer-Vorschläge bei leerer Suche.
- "Beispiel starten" landet oben, nichts läuft: zum Labor scrollen und starten oder Knopf hervorheben; Standardfrage im RAG-Feld passt nicht zu den Beispieldokumenten.
- Sichtbares "null" ("Fehlmeldung: 1 Kühlschrank | null") im Regal-/Objektbeispiel; überlappende Beschriftungen auf Rahmen am Handy.
- Handy: Seitenkopf braucht ca. 600 von 844 px, Lesemodus-Leiste 125 px dauerhaft.
- Skip-Link "Zum Inhalt springen", Menügruppen mit Pfeiltasten.
- Unfertiges ("Demo folgt", "Video folgt", "bald") aus Menü nehmen oder klar als "in Arbeit" markieren; Anzeigefehler "Bilder erzeugenbald".
- Use-Cases: am Ende "In 3 Schritten bei dir" statt nur "Weiter geht es"; Beispiele aus dem Handwerk (Angebot aus Notiz, Baustellenfoto, Rechnungen sortieren).
- Datenschutz in einfacher Sprache als eigene Seite, "kostenlos, ohne Anmeldung" sichtbar.

## Mittel
- Chips und Auswahlknöpfe unter 44 px (13 Elemente auf "Was ist KI?").
- Messwerte (Millisekunden) in "Mehr Details" auslagern, Satz zum Ergebnis zeigen.
- Umschalter "Kompakt/Ausführlich" besser benennen ("Kurz lesen / Genau lesen"), sichtbarer Zurück-Knopf.
- Menügruppen größer, Seiten mit "Anfänger" markieren.
