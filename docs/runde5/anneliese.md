# Prüfbericht Runde 5: Anneliese (71, Rentnerin, Tablet 820x1180, Zoom 150 Prozent)

Geprüft am 23.11.2026 gegen https://192.168.178.83:8443, Playwright mit Chrome headless, wirksame Fensterbreite 547x787 (820 Pixel bei 150 Prozent Zoom), hell und dunkel, Erstbesuch mit Willkommens-Fenster. Screenshots in /tmp/r5-anneliese/ (01 bis 33, alle angesehen), Druck-PDF anruf-druck.pdf (7 Seiten, geöffnet). Ein Sprachmodell-Lauf (Frage zum Enkeltrick, 84 s). Die Ratenbegrenzung trat nicht auf.

## Gesamtnote: 7,8

| Kriterium | Note | Beleg |
|---|---|---|
| 1 Verständlichkeit für das Alter | 8 | Seite "Falscher Anruf" ist klar, kurze Sätze, Merksatz. Aber "Sitzungs-Cookie kl_s", "Arbeitsspeicher", "Jetson", "Token", "Transformer" in Fuß und Nachbarseiten |
| 2 Einstieg und Führung | 8,5 | Willkommens-Fenster mit sechs Rollen, "Ich will KI verstehen" führt in zwei Klicks zur Betrugsseite (Screenshot 01, 02) |
| 3 Lernwirkung | 8,5 | Drei Schritte, Beispiele, Codewort, Quiz mit Erklärung je Antwort (12, 16) |
| 4 Motivation | 7,5 | Ruhige Gestaltung, Quiz-Rückmeldung freundlich; wenig Erfolgserlebnis, Seite wirkt lang |
| 5 Labore und Interaktion | 7 | Chat liefert eine falsche Beratung zum Enkeltrick (siehe Befund 1); Antwort nach 84 s |
| 6 Videos | 8 | "Was ist KI?" 1:23 mit Untertiteln und Kapiteln (19); schwarzes Standbild, kleine Bedienleiste |
| 7 Navigation | 7,5 | Suche gut (05), Menü aber 12 Bereiche mit Fachbegriffen (29) |
| 8 Vertrauen und Sicherheit | 8 | Kurze Antwort stimmt, Tabelle ehrlich; zu viel Technik und ein Absatz mit 80 Wörtern (20, 21, 32) |
| 9 Barrierefreiheit | 8 | Fokusring 3 px, Skip-Link, Kontrast gut, kein Querscroll bei 547 px; kleine Touch-Ziele und Beschriftungen (Befund 6) |
| 10 Fehlerfälle | 8,5 | Leeres Senden "Schreib zuerst eine Frage." (26), Ausfall freundlich mit Handlung (27), 404 mit Wegen (28) |

Würde ich es weiterempfehlen? Ja, die Betrugsseite schon, dem Enkel würde ich sie zeigen. Den Chat nicht, solange er bei einem Betrugsfall gegen die eigene Lektion rät.

## Befunde

### Hoch
1. **Chat widerspricht der Lektion bei Betrug** (Seite Chat, Screenshot 25). Frage: "Ein Anrufer sagt, er sei mein Enkel und braucht Geld. Was soll ich tun?" Antwort: "Wenn ja, ist es möglich, dass der Anrufer tatsächlich dein Enkel ist", rät, nach Hobbys und Schule zu fragen und "die Telefonnummer zu überprüfen"; "auflegen und selbst zurückrufen" und "110" kommen nicht vor, Du und Sie wechseln. Für Anneliese gefährlich, weil die Seite vorher das Gegenteil lehrt. Die Beispielfrage "Wie lange darf ein Busfahrer ..." trägt "(Antwort prüfen)", Betrug nicht. Der Hinweis "Stimmt das?" unter der Antwort rettet das nicht.
2. **Chat ist für sie nicht gerahmt** (Seite Chat, Screenshot 23). Sie landet unter "Sprache" bei "Sprachmodell im Chat", mit "Parametern", "Token", "Jetson bekommt keinen früheren Verlauf", Temperatur-Regler. Im Rollenweg "KI verstehen" fehlt ein einfacher Chat-Einstieg mit Betrugs-Beispielfrage.

### Mittel
3. **Zählung und Versprechen stimmen nicht** (Startseite, Weg KI verstehen, Screenshot 02/03b). "Elf kurze Seiten: erst Betrug erkennen, dann die Grundlagen", aber Schritt 1 ist "Was ist KI?", Betrug ist Schritt 2. Die Karte "In 15 Minuten" nennt "ca. 1 Min Lesen" bei "Fünf kurze Seiten für die Pause". Die Karte "Neu hier" springt je nach Lesemodus von "ca. 3" auf "ca. 8 Min Lesen" (22 gegen 03).
4. **Quiz sortiert nach der Antwort um** (Falscher Anruf, "Teste dich", Screenshot 16). Nach dem Tippen wandert die richtige Antwort unter die falsche, die Optionspunkte stehen zeilenweise getrennt vom Text ("Nichts Sicheres ..." mit Kreis über dem Text). Verwirrt, ob man etwas verändert hat.
5. **Codewort-Grafik zu breit** (Falscher Anruf, "Das Familien-Codewort", Screenshot 14, 33). Das Feld "Nur persönlich sagen" läuft über den Kartenrand, "Fehlt es: auflegen" klebt links am Rand; der Hervorhebungs-Ring liegt über dem Wort "wählen".
6. **Kleine Schrift und Ziele bei 150 Prozent** (alle Lektionen). Bildunterzeilen ("sofort, ohne Erklärung") und Fußtext 13 px, Pfadzeile 14 px, Chips und Textlinks unter 44 px hoch (Messung: 2 bis 10 Ziele je Seite unter 44 px; "Karte" 10). Für 71 Jahre grenzwertig, obwohl der Zoom hilft.
7. **Menü überfordert** (Menü, Screenshot 29). Zwölf Bereiche (u. a. "Wissen und RAG", "Agenten", "Business-Use-Cases") in einer Liste, "Falscher Anruf" liegt erst unter "Medienkompetenz" weit unten. Das Menü folgt der gewählten Rolle nicht. Die Suche rettet es ("falscher Anruf", "Telefon" finden die Seiten sofort, 05).
8. **"Ist das sicher?" beginnt mit einem Block von 80 Wörtern** (Screenshot 20) und enthält in "Genau lesen" eine Tabelle mit Namen wie `kl-haken-<Seite>`, "sessionStorage", "lokalen Speicher" (32). Die kurze Antwort ("Kein Konto, kein Foto gespeichert, Texte nur kurz") ist gut, sollte oben allein stehen. Zeilenabstand im Absatz mit Glossar-Chips springt (21).
9. **Fußtext auf jeder Seite technisch** (Screenshot 03b, 28): "Sitzungs-Cookie kl_s", "Arbeitsspeicher". Für sie ein Warnzeichen statt Beruhigung.

### Klein
10. Zwei fast gleiche Seiten ("Falscher Anruf" und "Betrug erkennen") ohne Hinweis, welche für wen ist.
11. Willkommens-Fenster: Karte "Schüler:in" hat zwei Zeilen mehr, die Kartenhöhen sind ungleich (01).
12. Die "Checkliste" sagt "schreib sie auf einen Zettel", bietet aber keinen Druck- oder Download-Zettel an. Der Seitendruck (7 Seiten, Abschnitt je Seite, Seite 1 halb leer, 31) ist sauber, aber für einen Zettel zu lang.
13. Video: Standbild schwarz mit kleinem Titel, keine Wiedergabetaste in der Mitte (19).
14. Chat-Antwort erscheint erst als einzelner Satzanfang ("Das ist eine schw"), der Wartehinweis war in den 2,5 s nicht sichtbar, danach Streaming; Statuschip wechselt auf "gerade viel los" (24, 25).

## Zielaufgaben

1. **Falschen Anruf erkennen:** Start, Rollenwahl "Ich will KI verstehen", "Falscher Anruf, Öffnen": 2 Klicks, etwa 15 Sekunden. Über die Suche "falscher Anruf": 3 Klicks, etwa 20 Sekunden. Verständlich nach etwa 90 Sekunden Lesen (drei Schritte, Maschen, KI-Stimme, Codewort, Quiz 3 Fragen). Erfüllt. Der Chat widersprach (Befund 1).
2. **Was ist KI:** Rollenweg "Was ist KI?", 2 Klicks, 10 Sekunden. Video 1:23, Karte. Verständlich für Laien, Begriffe wie "Deep Learning", "Transformer" bleiben abstrakt. Erfüllt.
3. **Speichert das Labor etwas über mich:** Fußlink "Ist das sicher?" 1 Klick (Startseite "Mehr dazu"), etwa 8 Sekunden. Kurze Antwort: kein Konto, keine Bilder, Texte nur kurz, ein Cookie, Merkzettel. Erfüllt, aber mit zu viel Technik (Befunde 8, 9).

## Empfehlung
Die Betrugs-Lektion ist inhaltlich stark und gut bedienbar, der Einstieg über die Rolle führt Anneliese in zwei Klicks hin. Vor einer Freigabe für Ältere muss der Chat bei Betrugsfragen auf die Lektion verpflichtet werden (Systemhinweis oder feste Antwort) und die Einstiegstexte müssen ehrlich zählen.

## Die drei größten Lücken Richtung 10
1. Chat sicher machen für Betrugs- und Gesundheitsfragen: Hinweis "Bei Geldforderungen immer auflegen und zurückrufen" vor der Antwort, Beispielfragen für Erwachsene, Du oder Sie einheitlich, einfacher Rahmen ohne Token, Temperatur und Jetson.
2. Lesbarkeit für Ältere: Grundschrift und Bildunterzeilen größer, Touch-Ziele mindestens 44 px, Codewort-Grafik und Quiz-Umsortierung korrigieren, Zeilenabstand bei Glossar-Chips vereinheitlichen.
3. Weniger Technik und stimmige Führung: Menü je Rolle kürzen (Betrug und Datenschutz oben), Fußtext und "Ist das sicher?" in einfache Sprache mit der Kurzantwort allein vorn, Zählungen auf der Startseite korrigieren, ein druckbarer Zettel für die Betrugs-Checkliste.
