# Prüfbericht Runde 4: Mehmet (39, Betriebsleiter Metallbau, Desktop 1440x900)

Testadresse https://192.168.178.83:8443, 22.11.2026. Ein headless Chrome, Viewport 1440x900, Hell und Dunkel, Erstbesuch mit Willkommens-Fenster, danach mit gemerkter Einwilligung. Bilder in `docs/runde4/mehmet-bilder/` (26 Screenshots, alle angesehen, dazu eine Druck-PDF mit vier Seiten bei 60 dpi). Zwei Sprachmodell-Anfragen (die erste lief in eine Warteschlange und wurde von mir abgebrochen, die zweite nach 10 Sekunden Pause vollständig). Keine Ratenbegrenzung erlebt.

## Gesamtnote: 7,5 von 10

Als Betriebsleiter finde ich den Weg zur Sichtprüfung schnell, das Beispiel läuft nach 3 Sekunden und zeigt "Ausschuss, Sicherheit 91 Prozent". Das überzeugt. Die Kostenseite hat ein ehrliches, aber auf Sprachmodelle zugeschnittenes Rechenwerkzeug, und für mein Kameraprojekt gibt es nur ein festes Rechenbeispiel. Eine eigene Seite zu Grenzen und Risiken der Kamera fehlt; die Hinweise stecken verstreut in "Stolpersteine", Quiz und Checkliste. Das Chat-Modell lieferte zu meiner Frage nach Grenzen Unsinn ("Schweißröhre"), ohne das Hauptproblem Glanz zu nennen.

| Nr. | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit fürs Alter | 8,5 | Kurze Sätze, Alltagsbeispiele, wenig Fachwörter; "Token", "Kontextfenster" nur im Chat |
| 2 | Einstieg und Führung | 8 | Rolle "Ich entscheide im Betrieb" führt klar zu Pfad und Anwendungsfällen (`02-rolle-betrieb.png`) |
| 3 | Lernwirkung | 7,5 | Quiz und "Das nimmst du mit" gut, Grenzen aber nur angedeutet |
| 4 | Motivation und Spaß | 8 | Testbilder anklicken mit sofortigem Urteil, Erklärvideo mit Kapiteln |
| 5 | Labore und Interaktion | 7,5 | Sichtprüfung 3 s und 0,1 s je Urteil; Chat 36,9 s für 114 Tokens (3,1 Tokens/s), Antwort fachlich schwach |
| 6 | Videos | 8 | 1:15, Untertitel an, Kapitelliste, Verweis am Ende erklärt |
| 7 | Navigation und Orientierung | 7 | Suche "Qualität" findet die Sichtprüfung nicht, "Datenschutz Kamera Mitarbeiter" gar nichts |
| 8 | Vertrauen und Sicherheit | 8,5 | Datenschutz und Betriebsrat in Sichtprüfung und Checkliste benannt, KI-Hinweis unter dem Chat |
| 9 | Barrierefreiheit und Bedienbarkeit | 8 | Tastaturfokus sichtbar (3 px Rahmen), Kontrast im Dunkelmodus gut |
| 10 | Fehlerfälle | 8 | 404 freundlich mit Vorschlägen, leerer Chat: "Schreib zuerst eine Frage.", Warteschlange mit Platz und Schätzung |

## Befunde nach Schwere

### Blocker
Keine.

### Hoch
1. **Kein passender Kostenrechner für ein Kameraprojekt.** Seite "Kosten und Energie", Abschnitt "Ausprobieren" (`09-rechner.png`, `10-rechner-kamera.png`). Das Werkzeug fragt nach Watt, Laufzeit, Strompreis, Anschaffung, Nutzungsdauer, "Alternative: Cloud pro Monat" und Betreuung. Meine Alternative ist die Handprüfung, nicht die Cloud. Ich musste die Handprüfung (1.500 €) ins Feld "Cloud" schreiben und bekam Sätze wie "Die Cloud kostet 1.500,00 € im Monat". Strom (98 € im Jahr) spielt bei mir kaum eine Rolle, Montage, Einrichtungsstunden und Pflege sind der Block. Dafür gibt es unten nur das feste Beispiel "Kameraprojekte rechnen anders" (4.700 € einmalig, 245 € laufend, 13 Monate), ohne Eingabefelder und nur hinter "Mehr dazu" ausgerechnet.
2. **Grenzen und Risiken der Kamera sind keine eigene, auffindbare Stelle.** Es gibt "Grenzen" nur für Sprachmodelle (Sprache). Für Mehmet stehen sie verteilt in "Stolpersteine" (Licht, Untergrund, neue Fehlerarten) und Quiz der Sichtprüfung, in den sechs Fragen der Entscheidungsseite und in der Kostenseite ("Was man gern vergisst"). Fehlt: Taktzeit (Teile pro Minute), Haftung bei durchgelassenem Ausschuss, Kundenvorgaben und Normen, Hardwareanforderungen für Glanz und Schweißnähte.
3. **Chat gibt zur Grenzfrage fachlich falsche Antwort.** Frage: Grenzen einer Kamera bei glänzenden Schweißnähten. Antwort: "Farbton und Übertragung", "Nahtschärfe", "Schweißröhre". Der Hinweis "kann falsch sein, prüfe Wichtiges" steht darunter (`19-chat-antwort-dunkel.png`), aber ein Betriebsleiter ohne Vorwissen könnte es glauben. Für Metallbau fehlt ein Beispiel, das die Grenze des kleinen Modells zeigt.

### Mittel
4. **Widersprüchliche Zahlen auf einer Seite.** "Kosten und Energie": Rechner meldet im Standardfall 29,9 Monate bis zur Amortisation, das Beispiel im Text "nach rund 10,7 Monaten gleichauf", das Kameraprojekt 13 Monate. Die Unterschiede (mit und ohne Betreuung, anderes Gerät) werden nicht erklärt. Dazu der Satz "Verdoppelst du den Strompreis, dauert es 3,6 statt 3,6 Monate" bei meinen Werten.
5. **Druckansicht der Checkliste ist kaputt.** Seite "Deine Entscheidung", Knopf "Seite drucken". In der erzeugten PDF (`checkliste-druck-1.png`, `-2.png`) fehlen die Kreise und Haken, die Kopfleiste "KI-Labor, Seiten suchen" erscheint mitten im Text, "Zum Inhalt springen" liegt über dem Inhalt, und das Seitenende von Seite 1 schneidet Frage 4 an. Als Ausdruck für die Besprechung nicht brauchbar. Es gibt außerdem kein fertiges PDF für Betriebe, die Materialien (Arbeitsblätter, Elternabend) sind für die Schule.
6. **Suche findet den Kamera-Anwendungsfall schlecht.** "Qualität" listet Sprachausgabe, Daten, Business und andere, aber nicht "Sichtprüfung" (`03-suche-qualitaet.png`). "Kamera Ausschuss" findet ihn dagegen. "Datenschutz Kamera Mitarbeiter" liefert nichts. Die Suche verlangt offenbar alle Wörter. "Grenzen" gibt 30 Treffer ohne erkennbare Rangfolge.
7. **Seitenleiste wechselt ohne Hinweis ihren Inhalt.** Nach Rollenwahl zeigt sie "Für dich" mit den Betriebsseiten (`02-rolle-betrieb.png`). Beim direkten Öffnen einer Lernseite zeigt sie "Einstieg, Alle Bereiche" ohne Rolle (`06-beispiel-fertig.png`). Wer die Rolle nicht dauerhaft merkt, verliert den Betriebspfad.
8. **Pfad "In 15 Minuten" enthält weder Kosten noch Grenzen.** Vier Seiten (KI-Begriff, Chat, "Wo KI im Betrieb hilft", Einstieg planen). Kosten steht erst im längeren Betriebspfad (Schritt 2 von 8 auf der Sichtprüfung).

### Klein
9. Das Beispiel zeigt Metallscheiben aus Zeichnungen, "Beispielbilder, gezeichnet" steht im Video, auf der Seite "Testbilder, die der Jetson noch nie gesehen hat" ohne Hinweis auf gezeichnet (nur "Das nimmst du mit"). Ehrlich genug, aber das Wort gehört direkt ans Beispiel.
10. Der Kamera-Knopf "Kamera starten" neben dem Beispiel wirkt wie Teil der Aufgabe. Ein Satz "Für das Beispiel brauchst du keine Kamera" würde Mehmet ohne Webcam helfen.
11. Wartezeit im Chat beim ersten Versuch: "Du bist Nr. 3 in der Warteschlange. Geschätzte Wartezeit: etwa 60 Sekunden", später "Du bist als Nächster dran, etwa 10 Sekunden". Klar und freundlich, aber die Zeit stimmte nur grob (Eintritt nach etwa 2 Minuten, wenn der Jetson belegt war).
12. Zähler im Kameraprojekt laufen beim Scrollen hoch (Screenshot `12-kameraprojekt-offen.png` zeigt 227 € und 11 Monate mitten in der Animation). Für Lesende, die wegen der Zahlen kommen, sollte der Endwert sofort stehen.

## Zielaufgaben

1. **Qualitätsprüfung per Kamera finden und Beispiel starten: gelöst.** Willkommens-Fenster, "Ich entscheide im Betrieb" (1 Klick, 1 s), "Sichtprüfung" im Menü (2), "Beispiel starten" (3), Testbild wählen (4). Training der 40 Bilder 2,9 Sekunden, Urteil 0,1 Sekunden: "Ausschuss (Sicherheit 91 Prozent). Das stimmt." Vier Klicks, etwa 10 Sekunden reine Wartezeit.
2. **Kosten für ein Kameraprojekt rechnen: teilweise gelöst.** Rolle, "Kosten und Energie" (2 Klicks), dann sieben Felder tippen (60 W, 16 h, 0,28 €, 5.000 €, 5 Jahre, 1.500 €, 100 €), Ergebnis nach unter 1 Sekunde: 108,18 € Betrieb im Monat, 3,6 Monate Amortisation. Rechenweg stimmt, aber die Beschriftung passt nicht auf Handprüfung (Befund 1) und die Einrichtungskosten fehlen. Brauchbarer war das feste Beispiel "Kameraprojekte rechnen anders" mit Aufschlüsselung (Kamera 1.500 €, Rechner 800 €, Einrichtung 2.400 €, Pflege 240 €).
3. **Grenzen und Risiken finden: teilweise gelöst.** Gefunden nach etwa 4 Klicks und 3 Minuten Lesen: "Stolpersteine" und Quiz der Sichtprüfung (Licht, Untergrund, Beispielwerte nur für gezeichnete Bilder, Mensch zieht Stichproben), Datenschutz und Betriebsrat im Abschnitt "Zum Datenschutz", die sechs Fragen auf "Deine Entscheidung" (`20-checkliste.png`). Eine zusammengefasste Seite fehlt (Befund 2).

## Empfehlung

Für Betriebsleiter ist der Weg zur Sichtprüfung und zum Ausprobieren stimmig und glaubwürdig, ich würde das Labor weiterempfehlen. Vor einer 8,5 sollten ein Kostenrechner mit eigenen Posten für Kameraprojekte, eine eigene Seite "Grenzen und Risiken der Kamera im Betrieb" und eine lesbare Druckansicht der Entscheidungshilfe folgen.

## Die drei größten Lücken Richtung 10

1. Kostenrechner für Kameraprojekte (Einmalkosten, Einrichtung, Pflege, Alternative Handprüfung) statt Strom und Cloud.
2. Eine zusammenhängende Seite zu Grenzen, Haftung, Taktzeit und Datenschutz bei Kameraprüfung, in der Betriebsrolle direkt verlinkt.
3. Saubere Druckansicht oder fertiges PDF der Entscheidungshilfe, dazu bessere Suche (Synonyme wie Qualität, Prüfung, Mehrwort-Treffer) und konsistente Zahlen auf der Kostenseite.
