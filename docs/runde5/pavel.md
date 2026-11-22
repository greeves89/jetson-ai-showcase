# Prüfrunde 5: Pavel (35, Systemadministrator, Desktop 1920x1080)

Geprüft am 23.11.2026 gegen https://192.168.178.83:8443 mit Playwright (ein headless Chromium, Viewport 1920x1080, hell und dunkel), curl und openssl. Eine einzige Sprachmodell-Anfrage (Chat), danach Pause. Keine Ratenbegrenzung ausgelöst. Screenshots liegen in /tmp/r5-pavel/ (27 Stück, alle angesehen bis auf die reinen Zwischenstände 03b und 07, 09 bis 11, 21, 24 bis 26, deren Inhalt ich als Text geprüft habe).

## Gesamtnote: 8,0 von 10

Streng und mit Beleg: Für einen Admin ist die Betriebsseite ungewöhnlich ehrlich (Teststand, Grenzen, kopierbare Befehle, geprüfte Preisquelle). Die Note bleibt unter 8,5, weil das Labor auf Betriebsebene eine eigene Aussage nicht einhält (Ollama im LAN offen), die Fehlersuche-Tabelle abgeschnitten ist und lange Seiten keine Sprungmarken haben.

| Nr. | Kriterium | Note | Beleg in einem Satz |
|---|---|---|---|
| 1 | Verständlichkeit für das Alter | 9,0 | Kurze, präzise Sätze, Fachwörter erklärt, Befehle mit Begründung ("Warum sudo") |
| 2 | Einstieg und Führung | 8,5 | Willkommens-Fenster, "Ich arbeite in der IT" führt mit einem Klick zu drei passenden Karten |
| 3 | Lernwirkung | 8,0 | Quiz mit Erklärung bei falscher Antwort, Merke-Kästen, "Das nimmst du mit" |
| 4 | Motivation und Spaß | 7,5 | Live-Messwerte auf der Hardware-Seite sind gut, der IT-Pfad hat sonst wenig Mitmach-Anteil |
| 5 | Labore und Interaktion | 8,0 | Chat nennt Wartestand und verstrichene Zeit ehrlich; 79 s für 507 Token bei 6,4 Token/s |
| 6 | Videos | 7,5 | Video (geprüft: Prototyp zu Betrieb) mit Kapiteln und deutschen Untertiteln; auf Betrieb, Aufbau und Hardware gibt es keins |
| 7 | Navigation und Orientierung | 8,0 | Suche trifft Admin-Wörter gut; keine Sprungmarken auf 6000 bis 8000 Pixel langen Seiten |
| 8 | Vertrauen und Sicherheit | 7,5 | Sehr ehrliche Seite, aber Ollama (11434) ist im LAN offen, Seite sagt "nur lokal" |
| 9 | Barrierefreiheit und Bedienbarkeit | 8,0 | Kontraste 7,7 bis 15,6 gemessen, Tab-Reihenfolge und Skip-Link gut; Tabelle abgeschnitten und nicht fokussierbar |
| 10 | Fehlerfälle | 7,5 | 404-Seite freundlich; nicht lesbarer Body an /api/chat ergibt nackten "Internal Server Error" |

Würde ich es weiterempfehlen? Ja, als Lernlabor und als ehrliche Aufbauanleitung für einen Jetson. Nicht als Betriebsvorlage, solange die Seite ihre eigene Port-Aussage am Referenzgerät nicht erfüllt.

## Befunde nach Schwere

### Blocker
Keine.

### Hoch

**H1. Ollama (11434) ist im LAN ohne Anmeldung erreichbar, die Seite sagt "nur lokal".**
Seite "Betrieb und Sicherheit", Abschnitt Ports (Screenshots 03, 05; Kachel "11434 Ollama, nur lokal", Merke "Prüfe mit ss -tlnp, dass 11434 nur auf 127.0.0.1 hört"). Die Seite fordert ausdrücklich zur Prüfung auf; die Prüfung von außen widerlegt sie am Referenzgerät:
- `nc -z 192.168.178.83 11434` ist offen, `curl http://192.168.178.83:11434/api/tags` liefert ohne Anmeldung die Modellliste (llama3.2:3b, nomic-embed-text, qwen2.5, qwen3 u. a.).
- Offen sind außerdem 22 (SSH) und 3000 (Open WebUI). Die Seite nimmt "weitere Ports" bewusst aus, das ist fair; Ollama nimmt sie nicht aus.
- Auswirkung: Jeder im Heimnetz kann Modelle ziehen, löschen und Rechenzeit verbrauchen. Das ist genau das, was die Seite verspricht auszuschließen.
- Dazu passt: `/api/models` der App listet sechs Modelle, die Seite spricht von "nur llama3.2:3b und nomic-embed-text lassen sich über die App laden". Das stimmt für `/api/pull` (geprüft: `{"modell":"evil/model:1b"}` ergibt 400 "Modell nicht erlaubt"), aber der Leser sieht auf dem Gerät mehr.

**H2. Fehlersuche-Tabelle ist rechts abgeschnitten, Lösungen und Befehle sind unvollständig lesbar.**
Seite "Selbst aufbauen", Abschnitt "Wenn etwas nicht klappt" (Screenshots 16 dunkel und 19 hell). Die Tabelle ist 923 px breit in einem 896 px breiten Rahmen (`overflow-x: auto`), die Spalte Lösung wird angeschnitten: `https://<jetson-ip>:8443` und "eintragen, Dienst neu starten" brechen am Rand ab. Es gibt keinen Scroll-Hinweis und der Rahmen ist nicht per Tastatur erreichbar (`tabindex` -1, keine Rolle, kein Label). Die Spalte Symptom ist dagegen breiter als nötig. Für Zielaufgabe 2 ist das die wichtigste Tabelle der Seite.

### Mittel

**M1. Keine Sprungmarken auf langen Seiten.** Betrieb (5800 px) und Selbst aufbauen (12 Abschnitte, Stückliste und Fehlersuche mittendrin): Der Chip "8 Abschnitte" ist nicht klickbar, es gibt kein Inhaltsverzeichnis, die feste Kopfzeile zeigt nur den Seitentitel. Stückliste und Fehlersuche findet man nur durch Scrollen oder Strg+F.

**M2. "Kurz lesen" tut auf den Betriebsseiten nichts, verspricht aber etwas.** Auf Betrieb und Sicherheit springt die Lesezeit von 6 auf 1 Minute und der Hinweis sagt "Du siehst die Kernsätze. Mit Mehr dazu klappst du Einzelnes auf", aber alle elf Abschnitte bleiben offen (Klasse `mehr immer-offen`, Seite wird sogar 63 px länger). Auch der Vorgabemodus wechselt je Seite: Betrieb und Selbst aufbauen starten "genau", Hardware, Chat und Prototyp zu Betrieb starten "kurz" (Screenshots 03, 06, 08).

**M3. Betriebsseite verschweigt den Weg über IONOS und Cloudflare.** Sie nennt nur "Tunnel, nur ausgehend". Die Seiten "Ist das sicher?" und Datenschutz nennen den Server bei IONOS und den Cloudflare-Tunnel als Vermittler. Ein Admin, der die Betriebsseite zur Risikobewertung liest, erfährt nicht, dass TLS dort endet und Eingaben im Klartext durch Dritte laufen. Der Abschnitt "Was du für den Firmenbetrieb ergänzt" ist der richtige Ort.

**M4. Doku und Gerät weichen bei Köpfen und Indexierung ab.** Die Seite sagt: HSTS nur im öffentlichen Betrieb, im Heimnetz mit selbstsigniertem Zertifikat nicht. Der LAN-Port 8443 sendet aber `strict-transport-security: max-age=31536000` und `x-robots-tag: index, follow`, das Referenzgerät läuft also im öffentlichen Modus und bedient das LAN mit. Die Seite erklärt diesen Mischfall nicht (Browser ignorieren HSTS bei Zertifikatsfehlern, daher kein Schaden, aber die Aussage "Heimnetz = kein HSTS" gilt am Gerät nicht).

**M5. Unsaubere Fehlerbehandlung an der API.** `POST /api/chat` mit passendem Origin, aber Inhaltstyp text/plain und Body "xx" ergibt `500 Internal Server Error` als reiner Text, ohne JSON-Fehlerobjekt wie bei den anderen Fällen ("leere Nachricht" 400, "ungueltiger Origin" 403). Kein Absturz, aber die Betriebsseite verspricht keine Stacktraces; hier ist es nur ein nackter 500er.

**M6. Fachlich missverständlich: "Whisper rechnet auf der CPU, etwa dreimal Echtzeit".** (Selbst aufbauen, Tabelle Zeile 13, Symptom "Spracherkennung dauert lange"). Das Labor selbst nennt "schneller als Echtzeit", wenn die Rechenzeit kürzer ist als die Aufnahme (Whisper-Labor). Nach dieser Lesart wäre "dreimal Echtzeit" schnell, gemeint ist offenbar dreimal so lang. Eindeutig wäre "etwa dreimal so lange wie die Aufnahme".

**M7. Suche gewichtet "Fehlersuche" falsch.** Treffer-Reihenfolge: Sortieren, Was ist ein Agent?, erst dann Selbst aufbauen (Seite mit der Fehlersuche-Tabelle). "Ports", "Header", "journalctl", "Zertifikat" treffen Betrieb und Selbst aufbauen korrekt, "Firewall" nur Betrieb, "Backup" nichts (auch kein Hinweis "nichts zu sichern, keine Datenbank").

**M8. Teststand dreifach.** Auf Betrieb steht derselbe Satz im Untertitel, als Kernsatz und im Fließtext des Abschnitts "Teststand" (Screenshot 03). Auf Selbst aufbauen ebenso. Ehrlich, aber redundant auf dem ersten Bildschirm.

**M9. Stückliste ohne JetPack-Version und ohne Bauform.** "Bauform laut Handbuch zum Kit" und "Preis beim Händler erfragen" in fünf von sechs Zeilen. Ehrlich begründet, aber für die Einkaufsliste fehlen die Angabe der M.2-Bauform und die getestete JetPack/L4T-Version (die Seite nennt nur Ollama 0.12.3).

### Klein

- Inline-Code mit Leerraum vor Satzzeichen: "( SITZUNG_TTL_S , Standard 1800 Sekunden )" (Screenshot 05).
- In Monospace sehen `--user` und `--no-pager` wie lange Gedankenstriche aus (Ligatur, Screenshots 05, 15). Kopieren liefert korrekt `--` (geprüft, alle fünf Kopieren-Knöpfe); wer abtippt, kann sich vertun.
- Leere Eingabe im Chat (nur Leerzeichen, Enter) wird still ignoriert, keine Meldung. Chat-Feld begrenzt auf 1000 Zeichen, die API erlaubt 4000: harmlos, aber unterschiedliche Zahlen.
- Willkommens-Fenster (Screenshot 01): Die Schüler-Kachel hat drei Textzeilen, die anderen zwei, dadurch sitzen Titel und Symbole der Zeile versetzt. Nach dem Klick bleibt die Adresse `/?willkommen=1` stehen.
- Beim Ende des Videos liegt "Nochmal ansehen" über dem letzten Bild und verdeckt Beschriftungen (Screenshot 27).
- Kein Video auf Betrieb, Aufbau und Hardware.
- Header: kein COOP/CORP, `server: uvicorn` sichtbar (beides auf der Seite offen dokumentiert, nur Hinweis). Cookie `kl_s` hat HttpOnly, Secure, SameSite=Lax, Max-Age 86400: gut.

## Zielaufgaben

**1. Betrieb und Sicherheit finden (Ports, Logs, Köpfe): erledigt, 2 Klicks.**
Willkommens-Fenster, "Ich arbeite in der IT" (Klick 1), Karte "Betrieb und Sicherheit" "Öffnen" (Klick 2). Alternativ Suche "Ports" (1 Eingabe, 1 Klick). Die Seite lädt in unter einer Sekunde (Index 18 KB gzip in 0,08 s, app.js 49 KB in 0,15 s per curl). Ports, Logs (journalctl-Befehle mit Kopieren-Knopf), Aufbewahrung, Schutzmaßnahmen und Updates stehen auf einer Seite. HTTP-Köpfe mit `curl -skI`: vorhanden sind X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy, Content-Security-Policy (script-src 'self', nur style-src 'unsafe-inline'), HSTS 1 Jahr, Cache-Control no-cache für HTML. Das stimmt mit der Tabelle der Seite überein. TLS 1.2 und 1.3 angeboten, 1.0 und 1.1 nicht; Zertifikat selbstsigniert, CN jetson.local, SAN mit IP, gültig bis 23.02.2029. `/docs` und `/openapi.json` ergeben 404, Host-Header "evil.example" ergibt 400 "Invalid host header", POST ohne oder mit fremdem Origin ergibt 403. Das deckt die Aussagen der Seite. Abweichung: H1 und M4.

**2. Anleitung, Stückliste, Fehlersuche: erledigt, 2 Klicks plus Scrollen (etwa 20 bis 30 s bis zur Fehlersuche).**
Karte "Selbst aufbauen" (Klick 2). Inhalt ist stark: Weg in sechs Schritten, Stückliste mit Quelle und Datum (NVIDIA-Blog vom 17.12.2024, 249 US-Dollar, gesenkt von 499), acht nummerierte Befehlsblöcke mit "braucht sudo"-Marke und Begründung, ausdrücklich ungetestete Fälle (SD-Karte, 4-GB-Modell, andere Ollama-Version), Fehlersuche mit 16 Zeilen (15 plus Log, stimmt mit der Überschrift). Einschränkungen: M1 (keine Sprungmarken), H2 (Tabelle abgeschnitten), M9.

**3. Zwei fachliche Aussagen prüfen.**
- Aussage A (Seite "Sprachmodelle"): "Drei Milliarden Zahlen mit je zwei Byte ergeben rund 6 GB ... Das Modell hier belegt rund 2 GB." Richtig: 3 Mrd. mal 2 Byte sind 6 GB bei 16 Bit; `/api/tags` meldet für llama3.2:3b (Q4_K_M) 2.019.393.189 Byte, also rund 2,0 GB. Auch "6 Prozessorkerne, 8 GB gemeinsamer Speicher, 25 W" auf der Hardware-Seite stimmt mit dem Jetson Orin Nano Super überein, "3,2 Mrd. Parameter, Q4_K_M, Kontext 4096" mit Ollama (Anzeige 7,4 GB nutzbar passt zu 8 GB).
- Aussage B (Betrieb und Sicherheit): "Ollama (11434) soll nur lokal hören", "Standard von Ollama passt dazu." Der Standard von Ollama ist 127.0.0.1, die Aussage ist als Regel richtig; am Referenzgerät ist sie nicht erfüllt (H1).
- Weitere geprüfte Aussagen der Betriebsseite: Gleichzeitige Chats 2 und Kameraverbindungen 6 (Code: `LLM_PARALLEL=2`, `WS_MAX=6`, `/api/warteschlange` meldet parallel 2, max_wartend 6) stimmen. Die Seite spricht unter Ratenbegrenzung korrekt von "Chats (2) und Kameraverbindungen (6)", wobei 6 bei Chats die Warteplätze sind: leicht verwechselbar. Die Ratenbegrenzung je Besucher habe ich nicht ausgelöst (gemeinsame IP, nicht belastet): ungeprüft. "Eingabetexte stehen nicht im Log" und "Journal 141,3 MB": ohne Zugriff auf das Gerät nicht prüfbar.
- Fachlich unklar: M6.
- Chat-Antwort zur Admin-Frage (Welche Ports ... Ollama-Server): Das Modell lehnte zuerst ab, listete dann DNS "53/55" und RTP "5004/5006" und behauptete "Ollama ist ein deutsches Unternehmen". Falsch bzw. erfunden. Der Prüfhinweis darunter ("Das kleine Modell irrt bei Erklärungen zur KI oft ... Stimmt das? Prüfe es: Quellen prüfen") fing das sinnvoll ab. Wartehinweise im Chat (Screenshots 13, 14): erst "Du bist als Nächster dran, bis zu einer Minute" mit Zähler "Bisher 3 s", dann "Der Jetson rechnet seit 3 s ... Das erste Wort kann bis zu einer Minute dauern. Mit Stopp kannst du abbrechen." Antwort begann nach etwa 6 s, endete nach 79,4 s. Ehrlich und brauchbar; der Stopp-Knopf ist sichtbar. Ausfall-Karte nicht ausgelöst (kein Ausfall).

## Weitere geprüfte Bereiche (kurz)

- Erstbesuch mit Willkommens-Fenster, Rollenwahl, Startseite, Menü, Suche, Hell und Dunkel, Druckansicht: gut. Druck (`page.pdf`, Print-Medium): Betrieb 5 Seiten, Selbst aufbauen 11 Seiten, A4, Kopfzeile mit Adresse, Tabellen lesbar und nicht abgeschnitten (Screenshots pr-betrieb-1, pr-sb-03). Die Tabelle ist im Druck besser als am Bildschirm.
- Dunkel: Kontraste gemessen 7,7 (Tabellenkopf) bis 15,6, Fließtext 9,5, Link 7,0, alles über AA. Hell gleichwertig im Eindruck.
- Tastatur: Skip-Link "Zum Inhalt springen" als erster Tab, Fokusrahmen 3 px, Suchfeld mit Ring am Feld, Quiz mit Pfeiltasten. Tabelle nicht fokussierbar (H2).
- Quiz Selbst aufbauen (4 Fragen): falsche Antwort wird rot, richtige grün markiert, kurze Erklärung. Gut.
- 404 (`/#/gibtesnicht` und `/nichtda`): eigene freundliche Seite "Seite nicht gefunden" mit Suche und Beispielthemen, HTTP 404.
- Konsole: in allen Läufen keine Konsolenfehler, keine fehlgeschlagenen Anfragen.
- Typografie und Abstände: klare Hierarchie, Spaltenbreite des Textes etwa 700 px bei 1920 px Breite (viel Weißraum, gut lesbar), Karten, Kästen und Tabellen konsistent.

## Empfehlung in zwei Sätzen

Die Betriebs- und Aufbauseiten sind inhaltlich vorbildlich ehrlich und für einen Admin sofort brauchbar; die Aussage "Ollama nur lokal" sollte am Referenzgerät wahr gemacht (oder die Seite angepasst) und die Fehlersuche-Tabelle ohne Abschneiden lesbar werden. Danach noch Sprungmarken auf den langen Seiten und ein ehrlicher "Kurz lesen"-Modus, dann sind 8,5 und mehr erreichbar.

## Die drei größten Lücken Richtung 10

1. **Seite und Gerät stimmen überein.** Ollama nur auf 127.0.0.1, eine Zeile zum Mischfall "öffentlicher Modus im LAN" (HSTS, Indexierung), IONOS und Cloudflare auf der Betriebsseite nennen, Modellliste und Pull-Erlaubnis erklären.
2. **Lesbarkeit der Technikseiten.** Sprungmarken oder Inhaltsverzeichnis, Fehlersuche-Tabelle ohne Abschneiden (Spaltenbreite oder Kartenansicht), Tabellenrahmen fokussierbar, "Kurz lesen" entweder wirksam oder ehrlich beschriftet, einheitlicher Vorgabemodus, Teststand nur einmal.
3. **Präzision im Detail.** Whisper-Tempo eindeutig formulieren, saubere JSON-Fehler an der API statt nacktem 500, Suche für "Fehlersuche" und "Backup" verbessern, Stückliste um M.2-Bauform und JetPack-Version ergänzen, kurzer Videoeinstieg für den IT-Pfad.
