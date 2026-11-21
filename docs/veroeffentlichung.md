# Veröffentlichung im Internet

Ziel: das KI-Labor unter einer eigenen Adresse öffentlich erreichbar machen, auffindbar für Suchmaschinen, mit
Namensnennung des Autors. Bis alle Punkte unten erledigt sind, bleibt das Labor intern erreichbar.

## Warum nicht einfach freischalten
Der Jetson ist ein kleiner Rechner mit 8 GB gemeinsamem Speicher. Öffentlich könnte jeder Besucher Chat,
Spracherkennung und Sprachausgabe auslasten. Kamera und Mikrofon laufen über Cloudflare zu einem Gerät im
Heimnetz. Die Seiten laufen über `#`-Adressen, die Suchmaschinen nicht indexieren.

## Stand der Vorbereitung
| Thema | Stand |
|---|---|
| Sitzungen getrennt (Anlern-Beispiele, RAG-Texte je Besucher, Ablauf nach 30 Minuten) | fertig, `app/sicherheit.py` |
| Ratenbegrenzung je Besucher | fertig, schaltbar mit `OEFFENTLICH=1` |
| Gleichzeitige Chats (2) und Kameraverbindungen (6) begrenzt | fertig, immer aktiv |
| Origin-Pflicht, Host-Allowlist, Größenlimits | fertig |
| Speicherwächter (Dateicache freigeben, Ollama-Fehler verständlich anzeigen) | fertig, `app/speicher.py` |
| Warteschlange mit Anzeige "gerade belegt" in allen Laboren | offen |
| Einwilligung vor Kamera und Mikrofon, Beispieldaten als Standard | offen (Beispiel-Katalog in Arbeit) |
| Echte Adressen statt `#`, vorgerenderte Seiten, Titel, Sitemap, `robots.txt` | offen |
| Fußzeile mit Name und Links zu Impressum und Datenschutz | offen |
| Cloudflare-Tunnel und Turnstile | offen, braucht den Cloudflare-Zugang des Betreibers |

## Schritte zum Start (Reihenfolge)
1. **Abnahme intern:** alle Seiten und Labore durchgehen, Videos prüfen.
2. **Härten:** Dienst mit `OEFFENTLICH=1` starten (Ratenbegrenzung an). Cloudflare-Regeln: Ratenbegrenzung je
   Adresse, Bot-Schutz (Turnstile) vor den teuren Aktionen (Chat, Whisper, TTS, Kamera).
3. **Datenschutz:** Hinweis vor der ersten Kamera- oder Mikrofonnutzung, ausdrückliche Zustimmung, Beispieldaten als
   Voreinstellung. Datenschutzerklärung und Impressum der Hauptseite verlinken (Rechtstexte werden nicht hier erzeugt).
   Technisch notwendige Speicherungen nennen: Sitzungs-Cookie `kl_s` (Zustand je Besucher), `localStorage`
   `kl-besucht` (Lernfortschritt).
4. **Auffindbarkeit:** Routing auf echte Adressen (`/rag-embedding`), Seiten vorrendern (Titel, Beschreibung, Inhalt,
   `canonical`, Open Graph, strukturierte Daten), `sitemap.xml`. Bis zum Start liefert `robots.txt` ein
   `Disallow: /`.
5. **Tunnel:** `cloudflared` auf dem Jetson als Dienst, Tunnel auf `https://localhost:8443` (ohne Zertifikatsprüfung
   für das lokale selbstsignierte Zertifikat) oder besser auf eine HTTP-Adresse, DNS-Eintrag für die Wunschadresse
   im Cloudflare-Konto. Dafür sind ein Tunnel-Token und Zugriff auf die DNS-Zone nötig; beides liegt beim Betreiber.
6. **Beobachten:** Auslastung und Fehlerquote in den ersten Tagen im Blick behalten (Seite `hardware`).

## Warum Cloudflare Tunnel
Nur ausgehende Verbindung, keine Portfreigabe im Router, gültiges HTTPS (Browser geben Kamera und Mikrofon nur
im sicheren Kontext frei), Schutzfunktionen von Cloudflare vor dem Gerät.
