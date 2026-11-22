# Welle 2, Prüfperson Sabine (Entscheiderin im Betrieb)

Person: Sabine, 49, Geschäftsführerin eines Handwerksbetriebs mit 25 Beschäftigten. Laptop 1366x768, helles Farbschema. Wenig Zeit, will Nutzen, Kosten, Risiken und Datenschutz-Antworten.
Testadresse: https://192.168.178.83:8443 (nicht die öffentliche Domain). Playwright über tests/browser.mjs, starte({willkommen: true}), Fake-Kamera. Screenshots in /tmp/welle2-sabine/.
Sprachmodell: zwei Anfragen insgesamt (Chat, RAG), nie parallel. Kein "freier Speicher", keine Ratenbegrenzung aufgetreten.

Hinweis zur Messung: Die Zeiten sind Maschinenzeiten (Ladezeit, Antwortzeit des Jetson). Lesezeit einer Person habe ich nicht gemessen, nur geschätzt. Die Wartezeit in meinem Skript war teils länger als die echte Antwortzeit, weil meine Abfrage zu grob war; die Antwortzeiten stehen unten, wie die Seite sie selbst ausweist.

## 1. Startseite und Menü nach der Rollenwahl

Willkommens-Fenster erscheint beim Erstbesuch (mit ?willkommen=1). Sechs Rollen, "Ich entscheide im Betrieb" mit dem Zusatz "Anwendungsfälle, Kosten, Grenzen". Zusätzlich ein Schalter "Lernfortschritt merken" und ein Knopf "Später". Ein Klick auf die Rolle schließt das Fenster nach unter 2 Sekunden und zeigt die Seite "Was KI deinem Betrieb bringt" (Screenshot 02-nach-rolle.png).

Was die Seite zeigt, von oben nach unten:
- Überschrift "Was KI deinem Betrieb bringt", Untertitel, zwei Marken "Kostenlos" und "Ohne Anmeldung", Statuszeile "Der Rechner ist bereit und frei".
- Block "In 15 Minuten" mit vier nummerierten Seiten (2, 5, 3, 5 Minuten) und dem Knopf "Mit Schritt 1 starten". Das beantwortet meine Erwartung sofort.
- "Empfohlen für dich": drei Karten (Dokumente befragen, Bestellservice, Sichtprüfung), je "ca. 4 Min", "Öffnen".
- "Weitere Wege", "Ist das sicher?", "Ab wann?" (16+), "Was ist ein Jetson?".

Menü beim Start (nach Rollenwahl), gezählt:
- 1 Suchfeld, 1 Fortschrittsbalken ("Noch nichts gelesen"), 1 Gruppe "Für dich" mit 7 Einträgen (Start, Dokumente befragen, Bestellservice, Sichtprüfung, KI im Business, KI einführen, Kosten und Energie), 1 eingeklappte Gruppe "Alle Bereiche", dazu die Statuszeile "Rechner live und frei". Das sind 7 sichtbare Einträge plus eine Aufklappgruppe: ruhig, nicht überladen.
- Klappt man "Alle Bereiche" auf, kommen 12 Gruppen (KI im Betrieb, Business-Use-Cases, Experimente, Grundlagen, Sehen, Sprache, Wissen und RAG, Agenten, Daten und Prognosen, Der Rechner dahinter, Für die Schule, Medienkompetenz). Insgesamt 88 Links im Menübaum. Für mich als Betriebsinhaberin ist das zu viel, aber es ist weggeklappt.

Eigene Erwartung an fünf Punkte: Kosten, Datenschutz, Beispiele aus meiner Branche, "Wie fange ich an", Kontakt. Nie anklicken würde ich: Sehen, Agenten, Daten und Prognosen, Der Rechner dahinter, Für die Schule.

## 2. Der Weg "In 15 Minuten"

Erreicht nach 2 Klicks (Rolle, "Mit Schritt 1 starten"), Seite lädt in unter 3 Sekunden.

| Schritt | Seite | Angabe Pfad | Befund |
|---|---|---|---|
| 1 | Was ist KI? (/karte) | ca. 2 Min | Video 1:23 mit Untertitel, Landkarte zum Anklicken, rund 460 Wörter im Kurzmodus. Seitenkopf nennt "ca. 1 Min", die Pfadliste "ca. 2 Min". |
| 2 | Sprachmodell im Chat (/chat) | ca. 5 Min | Echte Frage gestellt: Antwort nach 23,5 s (192 Token, 8,2 Token/s), Modell llama3.2:3b. Brauchbar als Eindruck, inhaltlich dünn (siehe unten). |
| 3 | KI im Business (/business) | ca. 3 Min | Video 1:16 mit deutschem Untertitel (eine Untertitelspur), Branchenübersicht, Lokal gegen Cloud, "Drei Fragen vor jedem Einsatz". Rund 470 Wörter. |
| 4 | KI im Unternehmen einführen (/ki-einfuehrung) | ca. 5 Min | Video 1:10+, Problem zuerst, Auswahl nach Nutzen und Machbarkeit, Pilot, Betriebsrat, Entscheidungspunkte, Checkliste "Sechs Fragen vor dem Start", 5 Quizfragen. Rund 800 Wörter. |

Gesamteindruck: Die vier Seiten bilden tatsächlich einen sinnvollen Entscheiderpfad. Schritt 4 ist die beste Seite für mich: Checkliste mit sechs Punkten, Stopp-Kriterium, Pilot mit vorher festgelegtem Maßstab. Das ist das, was ich in einer Besprechung weitergeben würde.

Die 15 Minuten sind aber knapp gerechnet: Videos (ca. 1,2 bis 1,4 Min je Seite) plus Lesen plus Chat-Wartezeit ergeben für mich eher 25 bis 30 Minuten, wenn ich nicht nur überfliege. Die Seitenköpfe zeigen überall "ca. 1 Min", das widerspricht den 2, 5, 3, 5 Minuten im Pfad.

Zusätzlich fällt auf: Unter Schritt 1 steht "Pfad 'KI im Betrieb', Seite 1 von 9", auf der Startseite steht "Vier feste Seiten". Schritt 4 verweist auf "Kosten und Energie" als nächste Seite (Seite 4 von 9). Ich weiß nicht, ob ich nach vier Seiten fertig bin oder neun lesen soll.

## 3. Anwendungsbeispiel zum Starten per Klick (Aufgabe 2)

Ziel: Angebote, Rechnungen, Dokumente.

a) Der Weg über die Rollenseite: Die drei "Empfohlen für dich"-Karten sind Dokumente befragen, Bestellservice, Sichtprüfung. Keine davon handelt von Angeboten oder Rechnungen. Das ist die erste Lücke für meine Person.

b) Dokumente befragen (2 Klicks ab Startseite: "Öffnen", dann "Beispiel starten"): Seite /uc-buero-dokumente (rund 1000 Wörter) beschreibt vier Beispieldokumente (Wartungsanleitung, Dienstleistungsvertrag, Betriebsvereinbarung, Produkt-FAQ). "Beispiel starten" öffnet /rag?beispiel=buero-dokumente und liest die Dokumente selbst ein. Gemessen: bis "bereit" rund 30 Sekunden (Einlesen der vier Dokumente, ohne dass ich etwas tun muss). Dann Frage "Wie lang ist die Kündigungsfrist im Dienstleistungsvertrag?": Antwort "drei Monate zum Ende der jeweiligen Laufzeit [2]", Quelle verlinkt, Suchen 480 ms, erstes Wort nach 2,5 s, Schreiben 3,9 s. Es ist die erwartete richtige Antwort und die Quelle ist sichtbar. Das ist überzeugend und gut erklärt ("Erwartet war: drei Monate"). Wartezeit ist akzeptabel, aber 30 s Einlesen ohne klare Fortschrittsanzeige im Betrieb wirken lang (sichtbar ist "Dokument 2 von 4 wird eingelesen").
Problem: Es sind Verträge und Betriebsvereinbarungen, keine Angebote oder Rechnungen. Der Bezug zu meinem Alltag (Kundenangebot, Rechnungseingang) muss ich selbst herstellen.

c) Der eigentlich passende Treffer: Suche "Angebot" oder "Rechnung" liefert als ersten Treffer "Handwerk" (/uc-handwerk, "Im Handwerk: Angebot, Baustellenfoto, Rechnungen"). Weg: Rolle, Suchfeld, Treffer: 3 Handlungen, etwa 20 Sekunden. Inhalt: drei Alltagsaufgaben im Kleinbetrieb (Angebot aus einer Notiz, Baustellenfoto prüfen, Rechnungen sortieren), jeweils mit "Du prüfst", ehrliche Grenzen ("Sie lenkt den Blick, die Fachkraft beurteilt", "Beträge und Steuerliches prüfst du selbst"), Checkliste "In 3 Schritten bei dir" mit dem Rat, mit erfundenen Beispielen statt echten Kundendaten zu üben. Das ist genau meine Seite, inhaltlich gut und ehrlich.
Aber: Diese Seite hat kein Video, kein Quiz und keinen Startknopf (keinen "Beispiel starten"). Sie ist nicht von der Rollen-Startseite aus verlinkt (nur über Suche oder Menü "Alle Bereiche, Business-Use-Cases, Handwerk" als elfter Eintrag in der Gruppe). Wer nicht sucht, findet sie nicht. Von der Handwerk-Seite aus kann ich nichts mit Angeboten oder Rechnungen ausprobieren; die Links gehen zu Chat, Objekterkennung, RAG.

Ergebnis Aufgabe 2: Teilweise gelöst. Per Klick startbar ist ein Dokumenten-Beispiel (Vertrag, Wartung). Ein Angebot-aus-Notiz-Beispiel zum Ausprobieren gibt es nicht, obwohl der Chat es technisch könnte (ich habe es im Chat selbst gefragt, siehe unten).

Eigener Chat-Test zu Angeboten (eine Anfrage, 23,5 s): Frage "Nenne drei Dinge, bei denen mir KI bei Angeboten und Rechnungen helfen kann, in je einem Satz." Antwort: drei allgemeine Sätze ("KI kann deine Angebote automatisieren und personalisieren", "Rechnungen schnell und präzise erstellen, indem die Software Kundeninformationen aus deinen Datenbanken abruft"). Ich lese das als Floskelbrei und teilweise unpassend: Ich habe keine Datenbank erwähnt. Der Hinweis "Antwort eines KI-Modells. Sie kann falsch sein, prüfe Wichtiges." steht direkt darunter, gut. Aber das Modell mit 3 Milliarden Parametern ist für mich als Eindruck von "KI im Betrieb" schwach, und die Seite sagt das nicht deutlich (kein Satz wie "ein großes Modell wie ChatGPT antwortet besser").

## 4. Wüsste ich nach 15 Minuten, ob und wie ich einsteige? (Aufgabe 1 und 3)

Aufgabe 1 (Was bringt KI im Betrieb?): Ja, in Grundzügen. Business-Seite zeigt Einsatzbereiche, die Handwerk-Seite die Alltagsaufgaben. Messbarer Nutzen (Stunden, Euro pro Woche) fehlt komplett. Es gibt keinen einzigen Satz in der Art "ein Betrieb sparte X Stunden". Das ist ehrlich (keine erfundenen Zahlen), hilft mir aber bei einer Entscheidung nicht.

Aufgabe 3 (Was klären, Datenschutz): Ja, gut. Wege: Pfad Schritt 4 (Checkliste "Daten: Rechtsgrundlage", "Betroffene informiert", Betriebsrat), "Recht und Regeln im Überblick" (/recht: DSGVO-Grundsätze, Auftragsverarbeitung/Vertrag, EU-KI-Verordnung mit vier Risikostufen, Urheberrecht, klarer Hinweis "keine Rechtsberatung"), Suche "Datenschutz" (7 Treffer, 3 davon mit gleichem Namen "Recht und Regeln", das irritiert), "Ist das sicher?" (353 Wörter, einfache Sprache). Zeit bis dorthin: 3 Handlungen. Die Antwort auf "Brauche ich einen Auftragsverarbeitungsvertrag, wenn ich ChatGPT nutze?" bekomme ich nicht, nur den Hinweis "Externe Dienste brauchen einen Vertrag". Das ist verständlich, aber nicht konkret.

Kosten: Seite "Kosten und Energie" mit Rechner (Leistung, Laufzeit, Strompreis, Anschaffung, Cloud pro Monat, Betreuung). Voreingestellt: Cloud 50 € pro Monat gegen 500 € Anschaffung, Amortisation 10,7 Monate, "Eigener Betrieb 618 € gegen Cloud 1.800 € über drei Jahre". Die Seite sagt klar "Alle Werte sind deine Annahmen, keine Preise oder Messwerte". Das ist ehrlich, aber als Entscheiderin erscheint mir das Ergebnis "Eigenbetrieb ist 1.181 € günstiger" als Vorgabe, weil die Betreuung auf 0 € steht in der Tabelle (der Rechner nennt 3,29 € Eigenbetrieb und "Betreuung 0,00 €"). Ein Jetson-Labor ersetzt keine Büro-KI wie Microsoft Copilot oder ChatGPT Team; diesen Vergleich (Preis pro Nutzer und Monat) gibt es nicht. Ich finde keine realen Preise für typische Betriebs-Optionen.

Nächste Schritte: Der Pfad endet bei Schritt 4 mit "Nächste Seite: Kosten und Energie". Es gibt keinen Abschluss ("Das war's: Entscheidungshilfe, Ihre drei nächsten Schritte"). Handwerk-Seite und Einführungsseite haben Checklisten, die man nicht speichern, drucken oder exportieren kann. Kein Kontakt, keine Beratung, kein Ansprechpartner (Suche nach "Kontakt/Beratung/Mail" im Hardware-Text: nichts). "Selbst auf einem Jetson aufbauen" verlangt Terminal-Kenntnisse und einen halben bis ganzen Tag, ohne Preis in Euro. Für einen Betrieb ohne IT ist das keine Option, und die Seite sagt nicht, was die realistische Alternative ist.

Fazit für Sabine: Ich wüsste nach den Seiten, WAS ich vor dem Einsatz klären muss und wie ein Pilot aussieht. Ich wüsste NICHT, WELCHES Produkt ich konkret ausprobiere, was es pro Monat kostet und wen ich fragen kann. Der Einstieg bleibt ohne Folgeschritt.

## 5. Bewertung nach dem Zehn-Punkte-Raster

| Nr | Kriterium | Note | Beleg |
|---|---|---|---|
| 1 | Verständlichkeit | 8,0 | Alltagssprache, "Entscheidung, Daten, Prüfung", wenige Fachwörter. Abzug: "Token", "Rerank", "Score", "Vektorisieren" auf der Dokumenten-Seite; Seite /uc-buero-dokumente rund 1000 Wörter. |
| 2 | Einstieg und Führung | 8,5 | Rollenfenster, Klartext "In 15 Minuten", ein großer Knopf, 2 Klicks bis Inhalt. Abzug: Widerspruch vier Seiten gegen "Seite 1 von 9", Zeitangaben 2/5/3/5 gegen "ca. 1 Min" im Seitenkopf. |
| 3 | Lernwirkung | 7,0 | Ich kann erklären: KI ist kein einzelnes Verfahren, Pilot mit Maßstab, Daten/Betriebsrat früh einbinden, lokal gegen Cloud. Aber Nutzen in Zahlen und konkrete Anbieter fehlen. |
| 4 | Motivation | 6,5 | RAG-Beispiel mit Quelle ist stark. Chat-Antwort wirkt flach. Handwerk-Seite ohne Ausprobieren. Wenig "Das will ich haben". |
| 5 | Labore | 7,0 | RAG läuft, Zeiten werden erklärt (Suchen 480 ms, erstes Wort 2,5 s). Chat 23,5 s für drei Sätze. Der Dokumenten-Beispielstart braucht 30 s ohne Aktion. Kein Labor zu Angeboten/Rechnungen. |
| 6 | Videos | 7,5 | Kurz (1:10 bis 1:23), deutscher Untertitel, Kapitelmarken. Hinweis "Verweis am Ende der Folge meint diese Seite" steht, ist aber umständlich. Sprecherstimme KI-erzeugt wird offen gesagt. Auf der Handwerk-Seite kein Video. |
| 7 | Navigation | 7,5 | Suche findet "Angebot" und "Rechnung" sofort (Handwerk), "Datenschutz" zu viele doppelte Einträge ("Recht und Regeln" dreimal). 88 Links im Gesamtbaum. Zurück-Knopf vorhanden. |
| 8 | Vertrauen und Sicherheit | 8,5 | "Ist das sicher?" verständlich, 16+-Hinweis, "Keine Rechtsberatung", Quelle neben jeder Antwort, Hinweis "Antwort kann falsch sein". Kein Auftragsverarbeitungsvertrag-Beispiel, kein Hosting-Hinweis (Land, Betreiber) auf der Rollenseite. |
| 9 | Barrierefreiheit | 7,5 | Gute Kontraste, große Ziele, Kurz-/Genau-Lesen-Schalter. Auf 1366x768 wird die untere Hälfte der Rollenseite erst nach Scrollen sichtbar (die Karten "Empfohlen für dich" liegen außerhalb des ersten Bildschirms). Tastatur nicht geprüft. |
| 10 | Fehlerfälle | 8,0 | Leerer Chat: "Schreib zuerst eine Frage." Freundlich und knapp. Kein Speicher-Fehler oder Ratenbegrenzung aufgetreten, nicht prüfbar. |

Gesamtnote: 7,0 von 10 (ehrlicher Eindruck, kein Mittelwert).
Begründung: Die Führung und die Ehrlichkeit sind für ein kostenloses Lernangebot stark, der Entscheiderpfad ist durchdacht. Für meine eigentliche Frage ("Soll ich das in meinem Betrieb einführen, was kostet es, wie fange ich an?") fehlen der Abschluss, der Praxisbezug für Angebote und Rechnungen zum Ausprobieren, realistische Kosten und ein Ansprechpartner.

## 6. Antworten auf die fünf Zusatzfragen

1. Rolle im Fenster: Ich habe "Ich entscheide im Betrieb" gewählt. Erwartet: eine Seite mit Nutzen, Kosten, Grenzen. Passiert: genau das, nach unter 2 Sekunden, mit "In 15 Minuten" als Hauptweg. Erwartung erfüllt. Das Fenster ist verständlich, der Schalter "Lernfortschritt merken" ist ohne Erklärung etwas rätselhaft, "Später" ist gut.
2. Menü: Beim Start 7 sichtbare Einträge in einer Gruppe, plus eine eingeklappte Gruppe "Alle Bereiche" (12 Untergruppen, 88 Links). Nicht überladen. Ich erwarte: Start, Kosten, Datenschutz/Recht, Beispiele aus meiner Branche, Einführung. Alles bis auf "Beispiele aus meiner Branche" im Start-Menü vorhanden; das Handwerk-Beispiel versteckt sich als elfter Eintrag unter Business-Use-Cases. Nie anklicken würde ich: Sehen, Agenten, Daten und Prognosen, Der Rechner dahinter, Für die Schule.
3. Zielaufgaben:
   - (1) Was bringt KI im Betrieb: gelöst in etwa 3 Handlungen (Rolle, Schritt 1, weiter zu Schritt 3 "KI im Business"), Maschinenladezeit je unter 3 s. Nutzen in Zahlen fehlt.
   - (2) Beispiel für Angebote/Rechnungen: teilweise. Über die Rollenseite nicht auffindbar. Über Suche "Angebot": 3 Handlungen (Rolle, Suchwort tippen, Treffer "Handwerk"), etwa 20 Sekunden. Startbares Beispiel: nur Dokumente befragen (2 Klicks plus 30 s Einlesen), aber mit Verträgen, nicht mit Angeboten.
   - (3) Was klären, Datenschutz: gelöst, 3 Handlungen über Suche "Datenschutz" (Recht und Regeln) oder über Schritt 4. Gute Checkliste, aber nichts zum Auftragsverarbeitungsvertrag bei konkreten Diensten.
4. Textlastigste Stellen: (a) /uc-buero-dokumente im Kurzmodus rund 1000 Wörter, vor allem die Abschnitte "Wie es funktioniert", "Was dabei herauskommt" mit Vierfeldertabelle und Stolpersteine; (b) /kosten-energie rund 1300 Wörter, der Rechner mit sieben Annahmen und zwei gleichlautenden Rechenabsätzen (der lange Absatz "15 Watt über 24 Stunden..." steht doppelt im Text); (c) /ki-einfuehrung rund 800 Wörter mit Texttabellen zusätzlich zu den Grafiken (jede Grafik steht nochmals als Aufzählung "Pilot (Maßstab vorher fest)" im Text, vermutlich für Screenreader, in meiner Textsicht wirkt das doppelt).
5. Empfehlen: Ja, mit Einschränkung. Weitergeben würde ich es an Geschäftsführer kleiner Betriebe, die wissen wollen, was sie vor dem ersten KI-Einsatz klären müssen. Zwei Sätze: "Die Seite 'KI im Unternehmen einführen' ist eine gute, ehrliche Checkliste (Problem, Daten, Verantwortung, Pilot, Stopp), ohne Verkaufsdruck und kostenlos. Für konkrete Angebote, Preise und einen Ansprechpartner brauchst du aber etwas anderes."

## 7. Was hat dich gefreut

- Rollenfenster plus "In 15 Minuten" mit klaren Zeitangaben: in unter 3 Sekunden bin ich auf einem Weg, der für mich gebaut ist.
- Handwerk-Seite: "Du prüfst" in jedem Schritt, "Beträge und Steuerliches prüfst du selbst", "nicht mit echten Kundendaten". Genau die Ehrlichkeit, die ich brauche.
- Dokumente-Beispiel: Antwort mit Quelle und "Erwartet war: drei Monate". Das kann ich einem Mitarbeiter in 2 Minuten zeigen.
- Checkliste in "KI einführen": sechs Fragen, jedes Nein ist eine Aufgabe.
- Live-Zeitanzeige (Suchen 480 ms, erstes Wort 2,5 s) und "Rechner ist bereit und frei": man sieht, was passiert.
- Videos kurz, mit deutschem Untertitel.
- Hinweis auf Falschantworten direkt unter jeder KI-Antwort.

## 8. Was hat genervt

- Das passende Beispiel (Handwerk) steht nicht auf meiner Rollenseite. Die drei empfohlenen Karten haben nichts mit Angeboten/Rechnungen zu tun.
- Handwerk-Seite: kein Video, kein Startknopf, kein Quiz. Aus dem Beschreibungstext kann ich nichts "selbst machen".
- Der Pfad endet im Nichts: keine Zusammenfassung, keine "Ihre nächsten Schritte", keine Speicher-/Druckfunktion für die Checklisten, kein Kontakt.
- Widersprüche: "Vier feste Seiten" gegen "Seite 1 von 9"; Pfad "ca. 2/5/3/5 Min" gegen "ca. 1 Min" im Seitenkopf; Schritt 1 heißt auf der Startseite "Was ist KI, und was nicht?", die Seite selbst "Was ist KI?".
- Chat-Antwort: allgemeine Floskeln, teils erfunden ("Datenbanken"), 23,5 s. Als Eindruck von "KI im Betrieb" ist das schwach, und es wird nicht gesagt, dass ein kleines Lokalmodell nicht mit ChatGPT vergleichbar ist.
- Kostenrechner: Beispielwerte (500 €, 50 € Cloud) wirken wie ein Ergebnis, Betreuung 0 € verfälscht; keine realen Preise für Lösungen, die ein Betrieb tatsächlich kauft.
- Suche "Datenschutz" zeigt "Recht und Regeln" dreimal (Titel gleich, Treffer verschieden), ohne Unterscheidung.
- Jargon auf der Dokumenten-Seite (Score, Vektorisieren, Rerank).
- "Dokumente befragen" lädt etwa 30 s, bevor ich überhaupt fragen kann.
- Im Vollseiten-Screenshot (Playwright fullPage) erscheinen mehrere Grafiken leer (Karte 1, Handwerk). Beim normalen Scrollen sind sie sichtbar (73-handwerk-scroll.png), also kein Seitenfehler, aber wer Seiten druckt oder als PDF speichert, könnte leere Kästen bekommen. Nicht geprüft.

## 9. Drei größte Lücken Richtung Eins-A (für Entscheider)

1. Abschluss und nächster Schritt: Eine Endseite des Pfads "Deine Entscheidung": drei Fragen (Welche Aufgabe? Welche Daten? Wer prüft?), ein ausdruckbares Blatt (PDF), ein Satz zu einem Ansprechpartner oder weiterführenden Angeboten, die Rückkehr zur Rollenseite. Pfad und Zahlen vereinheitlichen (vier gegen neun Seiten, 2/5/3/5 gegen 1 Min).
2. Das Handwerk-Beispiel zum Mitmachen: Auf die Rollenseite als erste Karte, mit Startknopf ("Angebot aus Notiz": Notiz einfügen, Entwurf erzeugen, Preise prüfen) und einem Video. Dazu ein Beispiel mit Rechnungen (Text rein, Betrag, Lieferant heraus, "du prüfst").
3. Kosten und Risiken realistisch: Vergleich "Einzelnes Werkzeug im Betrieb" (Preis pro Nutzer und Monat, Aufwand, Datenschutz-Papiere: Auftragsverarbeitungsvertrag, Standort) neben dem Jetson-Rechner; Betreuung im Rechner nicht auf 0 € voreinstellen; klarer Satz, dass das lokale Modell kleiner ist als kommerzielle Dienste.

## 10. Würde ich es weiterempfehlen?

Ja, als kostenlose, ehrliche Einstiegshilfe für Entscheider in kleinen Betrieben, vor allem wegen der Checkliste und der Handwerk-Seite. Nein, wenn jemand erwartet, damit eine Kauf- oder Einführungsentscheidung vollständig zu treffen. Die Gesamtnote 7,0 beruht darauf, dass der Weg bis zum "Ich verstehe, was ich klären muss" sehr gut ist und der Weg von dort zum "Ich fange morgen an" fehlt.

## Belege (Screenshots in /tmp/welle2-sabine/)

- 01-start.png (Willkommens-Fenster), 02-nach-rolle.png (Rollenseite), 10-schritt1.png (Pfad Schritt 1, Vollseite), 21-chat-antwort.png (Chat 23,5 s), 31-... bis 36-... (Seiten business, ki-einfuehrung, kosten-energie, recht), 40-uc-buero.png, 51-rag-bereit.png, 52-rag-antwort.png, 60-suche-angebot.png, 70-handwerk.png, 73-handwerk-scroll.png, 80-video-drei-fragen.png, 81-chat-leer.png.
- Skripte: /tmp/welle2-sabine/s1.mjs bis s14.mjs (nicht im Repo).
