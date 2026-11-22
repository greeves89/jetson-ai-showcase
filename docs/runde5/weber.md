# Prüfrunde 5: Dr. Weber (46, Inhaber einer Zahnarztpraxis, Laptop 1366x768)

Geprüft am 23.11.2026 gegen https://192.168.178.83:8443, ein headless Chrome, Hell und Dunkel, Willkommens-Fenster im Erstbesuch, eine Sprachmodell-Anfrage. Screenshots in /tmp/r5-weber/ (nicht im Repo).

## Gesamtnote: 7,5 von 10

| Kriterium | Note | Beleg in einem Satz |
|---|---|---|
| 1 Verständlichkeit | 8 | Kurzfassungen klar, Rechtsbegriffe (§ 203 StGB, Art. 28 DSGVO) nur im "Genau lesen"-Modus und dort verständlich erklärt |
| 2 Einstieg und Führung | 8 | Willkommens-Fenster und Rollenwahl "Ich entscheide im Betrieb" führen sofort zu passendem Menü (Screenshot 01, 02) |
| 3 Lernwirkung | 7 | Ich kann die Regel erklären (keine Patientendaten, Vertrag nötig), aber nicht, was KI in meiner Praxis konkret bringt |
| 4 Motivation | 7 | Anwendungsfälle sind Handwerk, Fertigung, Büro; für Praxen nichts Passendes |
| 5 Labore und Interaktion | 7 | Chat antwortet nach ca. 3 s, aber die 3B-Antwort war fachlich dünn (siehe Befund M2) |
| 6 Videos | 7 | Nur gestreift (Zellprobe-Video 1:10 mit Kapiteln und Untertiteln), nicht ausgewertet |
| 7 Navigation | 8 | Suche findet "Patientendaten" und "Schweigepflicht" sofort, "Zahnarzt" und "Arztpraxis" nicht |
| 8 Vertrauen und Sicherheit | 8 | Sehr ehrlich (kein Vertrag zur Auftragsverarbeitung, Vermittler IONOS und Cloudflare genannt), aber nicht am Chat-Eingabefeld |
| 9 Barrierefreiheit | 8 | Fokus sichtbar, Skip-Link, Kontrast Hell und Dunkel gut (Screenshot 30, 32) |
| 10 Fehlerfälle | 8 | Leere Eingabe: "Schreib zuerst eine Frage." (Screenshot 21); 404 mit Suche und Startseite (Screenshot 31) |

Würde ich es weiterempfehlen? Ja, als ehrliches Lernangebot und für die Regel "keine Patientendaten". Für meine Praxis als Entscheidungsgrundlage reicht es nicht, weil Gesundheitsbereich und Praxisalltag nicht vorkommen.

## Zielaufgaben

1. **Was bringt KI in der Praxis?** Teilweise gelöst. Weg: Start, Rolle "Ich entscheide im Betrieb" (1 Klick, 1,3 s), Seite "Was KI deinem Betrieb bringt", 3 Beispiele (Handwerk, Sichtprüfung, Dokumente befragen). Die einzige medizinnahe Seite "Auffälliges in Bildern" (Zellprobe) ist per Suche nach "Patient" erreichbar, nicht per Menü der Betriebsrolle. Eine Seite für Praxis, Zahnarzt oder Gesundheit fehlt. Etwa 4 Klicks und 45 Sekunden, ohne brauchbare Antwort für den Praxisalltag.
2. **Darf ich Patientendaten eingeben?** Gelöst, 2 Klicks, ca. 10 Sekunden. Suche "Patientendaten" führt zu "Ist das sicher?". Dort steht klar: Nein, Ärzte geben keine Patientendaten ein. Im Modus "Genau lesen" folgen § 203 StGB Abs. 1, 3, 4, Art. 28 DSGVO, Standort (Kapitel V DSGVO), Training mit Eingaben. Sehr gut. Lücke: Gesundheitsdaten als besondere Kategorie (Art. 9 DSGVO) und Zahnärzte werden nicht genannt.
3. **Entscheidungshilfe zum Abhaken und Drucken.** Gelöst, aber umständlich. Weg: Rolle Betrieb, Menü "Deine Entscheidung" (2 Klicks). Sechs Fragen anklicken geht (4 von 6 gesetzt, Screenshot 14). Druckansicht: 3 Seiten A4, Haken erscheinen als gesetzte Kästchen, Lesbarkeit gut (druck-1.png). Es gibt zusätzlich ein einseitiges PDF (entscheidungshilfe-betrieb.pdf) mit Notizfeld und QR-Code, das ich nur durch Raten der Adresse gefunden habe, siehe H1.

## Befunde

### Hoch
- **H1 Das beste Druckmaterial ist verwaist.** `/static/materialien/entscheidungshilfe-betrieb.pdf` (A4, 1 Seite, Kästchen, Notizen, QR) wird auf keiner geprüften Seite verlinkt (betrieb-entscheidung, ki-einfuehrung, Start, schule-start, alltag-sicher, gesundheit: null PDF-Links). Die Seite sagt stattdessen "Druckdialog deines Browsers". Das Browser-Ergebnis hat 3 Seiten.
- **H2 Praxis und Gesundheit fehlen als Zielgruppe.** Suche "Zahnarzt" und "Arztpraxis": 0 Treffer, Seite "Dazu habe ich nichts gefunden" mit Beispielwörtern Chat, Datenschutz usw. (Screenshot 05). Rolle Betrieb listet Handwerk, Sichtprüfung, Dokumente, Kameraprüfung; die Gesundheitsseite fehlt im Menü der Rolle (Screenshot 02).

### Mittel
- **M1 Das PDF lässt den Schweigepflicht-Satz weg.** Frage 3 lautet im PDF nur "Echte Kundendaten gehören nicht in dieses Labor." Online steht zusätzlich "Mit Schweigepflicht (Steuerberatung, Anwaltschaft, Ärzte) gelten zusätzliche Regeln, siehe unten." Gerade für mich der wichtigste Zusatz.
- **M2 Chat: Keine Datenschutzwarnung am Eingabefeld.** Unter dem Feld steht nur "Antwort eines KI-Modells. Sie kann falsch sein" (Screenshot 20/22). Der Hinweis "keine Patienten- oder Personendaten eintippen" fehlt dort, obwohl die Seite sonst klar warnt. Fachliche Qualität: Auf meine Frage zu Terminerinnerungen kam nach ca. 12 s eine Liste mit "Termine automatisch ermittelt und sendet" und "Patienteninformationen und -notizen speichert", unvollständig und grammatisch holprig (Screenshot 23). Ich habe nicht länger gewartet, die Antwort lief eventuell noch. Für Laien lehrreich als Beispiel für Fehler, aber ohne Einordnung auf der Seite.
- **M3 "siehe unten" ohne Ziel im Kurzmodus.** "Ist das sicher?" und die Checkliste verweisen mit "siehe unten" auf Regeln, die im Kurzmodus eingeklappt oder nur im "Genau lesen"-Modus stehen. Die wichtigen Rechtsangaben sind dort versteckt, ein Laie klickt sie kaum auf.
- **M4 Suche für "Entscheidungshilfe".** Einziger Treffer ist "Wissen: Modell oder Dokument", nicht "Deine Entscheidung" (die als "Checkliste" gefunden wird). Mein Alltagswort führt in die Irre.
- **M5 Kontakt nur über Umweg.** Im Labor gibt es keine E-Mail und kein Formular (Seite "Über das Labor"). Für eine Praxis mit Vertragsfragen ein Medienbruch, die Seite sagt es aber ehrlich.

### Klein
- K1 Nach Klick auf die Rolle im Willkommens-Fenster bleibt `?willkommen=1` in der Adresse.
- K2 Im Menü der Betriebsrolle steht "Ist das sicher?" ganz unten, nicht direkt bei "Deine Entscheidung".
- K3 Auf 1366x768 nimmt die Seitenleiste mit dem aufgeklappten Bereich fast den halben Bildschirm, der Inhalt rutscht nach unten (Screenshot 32).
- K4 Konsolenfehler beim Aufruf einer unbekannten Adresse: einmal "404 Not Found" (erwartet).
- K5 Das Druck-PDF der Browseransicht trägt die Test-IP in der Kopfzeile (Testumgebung, auf der echten Domain kein Befund).

### Positiv (Beleg)
- Texte bleiben kurz, keine Gedankenstriche, echte Umlaute.
- Haken werden auch gedruckt (gesetzt oder leer als Kästchen).
- Dunkelmodus sauber (Screenshots 30 bis 33).
- Leere-Eingabe- und 404-Seiten freundlich mit Handlungshinweis.
- Ehrliche Aussagen zu Vermittlern (IONOS, Cloudflare) und fehlendem AV-Vertrag.

## Empfehlung in zwei Sätzen
Das Labor erklärt Datenschutz und Berufsgeheimnis vorbildlich ehrlich und liefert ein sauberes Abhak-Blatt, aber es spricht Praxen nicht an und versteckt sein bestes Druckmaterial. Mit einer Praxis- oder Gesundheitsseite, dem verlinkten Ein-Seiten-PDF samt Schweigepflicht-Satz und einer Datenschutzwarnung am Chat-Feld käme es über 8,5.

## Die drei größten Lücken Richtung 10
1. Eine Seite "KI in der Arztpraxis" (Terminorganisation, Patienteninfo, Praxisverwaltung, was nicht geht) mit Suchwörtern Zahnarzt, Arzt, Praxis, Patient und Eintrag im Menü der Betriebsrolle (H2).
2. PDF der Entscheidungshilfe von der Seite aus verlinken (Knopf "Als PDF, 1 Seite") und den Schweigepflicht-Satz sowie Art. 9 DSGVO in die PDF-Frage 3 aufnehmen (H1, M1).
3. Datenschutzhinweis direkt am Chat-Eingabefeld und die Kernregeln zu Schweigepflicht und Auftragsverarbeitung im Kurzmodus sichtbar statt hinter "Genau lesen" (M2, M3).
