# Veröffentlichung im Internet

Ziel: das KI-Labor unter einer eigenen Adresse öffentlich erreichbar machen, auffindbar für Suchmaschinen, mit
Namensnennung des Autors. Bis alle Punkte unten erledigt sind, bleibt das Labor intern erreichbar.

## Warum nicht einfach freischalten
Der Jetson ist ein kleiner Rechner mit 8 GB gemeinsamem Speicher. Öffentlich könnte jeder Besucher Chat,
Spracherkennung und Sprachausgabe auslasten. Kamera und Mikrofon laufen über Cloudflare zu einem Gerät im
Heimnetz. Die Seiten liegen unter echten Adressen (`/rag-embedding`), der Server liefert sie mit Inhalt im Rohtext aus.

## Stand der Vorbereitung
| Thema | Stand |
|---|---|
| Sitzungen getrennt (Anlern-Beispiele, RAG-Texte je Besucher, Ablauf nach 30 Minuten) | fertig, `app/sicherheit.py` |
| Ratenbegrenzung je Besucher | fertig, schaltbar mit `OEFFENTLICH=1` |
| Gleichzeitige Chats (2) und Kameraverbindungen (6) begrenzt | fertig, immer aktiv |
| Origin-Pflicht, Host-Allowlist, Größenlimits | fertig |
| Speicherwächter (Dateicache freigeben, Ollama-Fehler verständlich anzeigen) | fertig, `app/speicher.py` |
| Warteschlange vor den Sprachmodellen (Chat, RAG-Frage, Agent) mit Platzanzeige "Du bist Nr. 2", freundlicher Hinweis und bis zu drei automatische Wiederholungen | fertig, `app/sicherheit.py` (`Warteschlange`), `GET /api/warteschlange`, `app/static/laien.js`; Whisper, TTS und Rerank haben weiter ihre eigene Sperre |
| Einwilligung vor Kamera und Mikrofon (Bild und Ton: Information plus Klick; Gesichtserkennung und Anlernen: ausdrückliches Kontrollkästchen, nur je Sitzung gemerkt), Widerruf in der Fußzeile, Beispieldaten ohne Kamera | fertig, `KL.einwilligung` in `app/static/laien.js` |
| Seite "Ist das sicher? Was wird gespeichert?" in einfacher Sprache (`/sicherheit-einfach`) | fertig, ersetzt nicht die Datenschutzerklärung |
| Echte Adressen (`/<id>`, History-API), alte `#/id`-Links werden umgeleitet | fertig, `app/static/app.js` |
| Vorgerenderte Seiten (Titel, Beschreibung, `canonical`, Open Graph, JSON-LD, Inhalt und Linkliste im Rohtext) | fertig, `scripts/seo_bauen.mjs` erzeugt `app/static/seo/` |
| Strukturierte Daten (`Article`/`LearningResource`, `BreadcrumbList`, `VideoObject` mit Transkript, `FAQPage` aus dem Quiz, `Course`, `ItemList`, `DefinedTermSet`), Open-Graph-Bild je Bereich (`app/static/og/`, erzeugt mit `node scripts/og_bauen.mjs`), `hreflang`, `llms.txt` und `llms-full.txt` (nur öffentlich) | fertig, alles aus den Inhaltsdaten durch `scripts/seo_bauen.mjs` |
| gzip für Text, `Cache-Control` für `/static/` (mit `?v=` unveränderlich), Vorladen der Skripte | fertig, `app/app.py` |
| `robots.txt` (KI-Crawler ausdrücklich erlaubt), `sitemap.xml` mit `lastmod`, Bild- und Videoeinträgen, `X-Robots-Tag` und Meta-Robots | fertig, intern überall "nicht indexieren", Umschalter `OEFFENTLICH=1` |
| Fußzeile mit Name des Autors, Lernprojekt-Hinweis, Links zu Impressum und Datenschutz | fertig, **Adressen der Rechtstexte fehlen**: `seite.impressum_url` und `seite.datenschutz_url` in `app/static/module.json` eintragen (Links erscheinen erst dann) |
| Cloudflare-Tunnel und Turnstile | offen, braucht den Cloudflare-Zugang des Betreibers |

## Schritte zum Start (Reihenfolge)
1. **Abnahme intern:** alle Seiten und Labore durchgehen, Videos prüfen.
2. **Härten:** Dienst mit `OEFFENTLICH=1` starten (Ratenbegrenzung an). Cloudflare-Regeln: Ratenbegrenzung je
   Adresse, Bot-Schutz (Turnstile) vor den teuren Aktionen (Chat, Whisper, TTS, Kamera).
3. **Datenschutz:** Hinweis vor der ersten Kamera- oder Mikrofonnutzung, ausdrückliche Zustimmung, Beispieldaten als
   Voreinstellung. Datenschutzerklärung und Impressum der Hauptseite verlinken (Rechtstexte werden nicht hier erzeugt).
   Technisch notwendige Speicherungen nennen: Sitzungs-Cookie `kl_s` (Zustand je Besucher), `localStorage`
   `kl-besucht` (Lernfortschritt).
4. **Auffindbarkeit (technisch fertig):** Nach jeder Inhaltsänderung `node scripts/seo_bauen.mjs` ausführen und die
   Dateien in `app/static/seo/` einchecken (`--pruefen` meldet, ob sie aktuell sind). Öffentlicher Modus: Dienst mit
   `OEFFENTLICH=1` und `OEFFENTLICHE_URL=https://ki-labor.daniel-alisch.site` starten (Basis für `canonical`, `og:url`,
   Sitemap; der Host wird zusätzlich zu `SHOWCASE_ALLOWED_HOSTS` zugelassen). Dann: `index, follow`, `robots.txt`
   erlaubt Seiten (nicht `/api/`, `/ws/`) und nennt die Sitemap, `/sitemap.xml` listet alle Seiten. Ohne
   `OEFFENTLICH=1` steht überall "noindex, nofollow", `robots.txt` sperrt alles und die Sitemap gibt 404.
   Vor dem Start: Rechtslinks in `module.json` eintragen, `app/static/seo` neu bauen, in der Search Console die Sitemap melden.
5. **Tunnel:** `cloudflared` auf dem Jetson als Dienst, Tunnel auf `https://localhost:8443` (ohne Zertifikatsprüfung
   für das lokale selbstsignierte Zertifikat) oder besser auf eine HTTP-Adresse, DNS-Eintrag für die Wunschadresse
   im Cloudflare-Konto. Dafür sind ein Tunnel-Token und Zugriff auf die DNS-Zone nötig; beides liegt beim Betreiber.
6. **Beobachten:** Auslastung und Fehlerquote in den ersten Tagen im Blick behalten (Seite `hardware`).

## Warum Cloudflare Tunnel
Nur ausgehende Verbindung, keine Portfreigabe im Router, gültiges HTTPS (Browser geben Kamera und Mikrofon nur
im sicheren Kontext frei), Schutzfunktionen von Cloudflare vor dem Gerät.

## Tests für die Auffindbarkeit
- `python3 tests/seo_server_test.py`: beide Betriebsarten (intern und öffentlich) mit dem FastAPI-`TestClient`.
- `node tests/seo-rohtext.mjs`: jede Seite ohne JavaScript (Titel, Beschreibung, `canonical`, Open Graph und Vorschaubild, JSON-LD mit Pflichtfeldern je Typ über `tests/seo-ld-pruefung.mjs`, `h1`, Linkliste, `llms.txt`, Sitemap, `robots.txt`, 404, Cache, gzip). Gegen beide Betriebsarten laufen lassen.
- `node tests/seo-adressen.mjs [hell]`: Klick-Navigation ohne Neuladen, Zurück/Vor, alte `#/`-Links, Abfrage, Fokus, Scrollposition, 404-Seite.

## Last, Warteschlange und Zeitlimit (Einstellungen)
Umgebungsvariablen des Dienstes (Standardwerte in Klammern):
- `LLM_PARALLEL` (2): gleichzeitige Sprachmodell-Antworten für Chat, RAG-Frage und Agent.
- `LLM_WARTEND_MAX` (6): wie viele Besucher dahinter warten dürfen. Weitere bekommen sofort HTTP 503 mit dem Hinweis "ausgelastet"; die Oberfläche wiederholt dann bis zu dreimal selbst.
- `LLM_WARTEZEIT_S` (90): längste Wartezeit in der Schlange.
- `SITZUNG_TTL_S` (1800): Zeitlimit je Sitzung. Anlern-Beispiele und RAG-Texte verfallen nach so vielen Sekunden Ruhe.
Die Platznummer holt sich die Oberfläche über `GET /api/warteschlange` (Cookie `kl_s`). Die Belegung steht auch in `/api/stats` (`warteschlange`).
Hinweis: Neue Seiten (`sicherheit-einfach`, `uc-handwerk`) erscheinen für Direktaufrufe und Suchmaschinen erst nach `node scripts/seo_bauen.mjs`.
Test: `python3 tests/warteschlange_test.py`, `node tests/laien.mjs`.
