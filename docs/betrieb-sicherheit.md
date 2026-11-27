# Betrieb: Sicherheitsköpfe und Doku-Pfade

Stand: 22.11.2026. Die Regeln stehen in `app/sicherheit.py` (Werte) und `app/app.py` (Middleware `_Sicherheitskoepfe`, äußerste Schicht).

## Köpfe auf jeder Antwort

Seiten, API, Statisches und Fehlerseiten bekommen dieselben Köpfe:

| Kopf | Wert | Grund |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Browser rät keine Dateitypen |
| `X-Frame-Options` | `DENY` | Seite lässt sich nicht einbetten (Clickjacking) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Fremde Seiten sehen nur die Herkunft, nicht den Pfad |
| `Permissions-Policy` | `camera=(self), microphone=(self), geolocation=(), payment=()` | Labore nutzen Kamera und Mikrofon nach Zustimmung, sonst nichts |
| `Content-Security-Policy` | siehe unten | Skripte nur vom eigenen Ursprung |
| `Strict-Transport-Security` | `max-age=31536000` | nur im öffentlichen Modus über HTTPS |
| `Cache-Control` | HTML `no-cache`; Statisches wie bisher (`?v=` Stand: ein Jahr, Medien ein Tag, sonst `no-cache`) | nichts verschlechtert |

### Content-Security-Policy

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;
media-src 'self' blob: data:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:;
object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

Entscheidungen:

- `script-src 'self'`: Das Labor lädt kein Skript von außen und hat keine Inline-Skripte oder Ereignis-Attribute. Das JSON-LD in den Seiten (`type="application/ld+json"`) ist Daten und wird nicht ausgeführt. Kein `unsafe-eval`, kein `wasm-unsafe-eval`: Spracherkennung und Sprachausgabe laufen auf dem Jetson, nicht als WebAssembly im Browser.
- `style-src 'unsafe-inline'`: Die Oberfläche setzt `style`-Attribute (Balken, Diagramme, Positionen). Das ist die einzige Lockerung. Sie schwächt den Schutz vor Skripteinschleusung nicht.
- `connect-src 'self'` deckt Fetch und die WebSocket-Verbindung zum eigenen Host ab.
- `media-src` und `img-src` mit `blob:` und `data:`: Kamerabilder, Mikrofonaufnahmen und eingebettete Vorschaubilder.
- `worker-src 'self' blob:`: vorsorglich für Web Worker.
- Mit `KL_CSP=report-only` wird dieselbe Richtlinie nur als `Content-Security-Policy-Report-Only` geschickt (Verstöße stehen dann in der Browser-Konsole, nichts wird blockiert). Nützlich, wenn neue Inhalte von außen laden sollen und man erst prüfen will.

## Umgebungsvariablen

| Variable | Wirkung |
|---|---|
| `OEFFENTLICH=1` | Öffentlicher Modus: HSTS (über HTTPS), Ratenbegrenzung, Indexierung. `/docs`, `/redoc`, `/openapi.json` sind immer aus. |
| `KL_API_DOKU=1` | Nur im LAN-Test (ohne `OEFFENTLICH`): `/docs`, `/redoc`, `/openapi.json` bleiben erreichbar. Sonst liefern sie 404. |
| `KL_CSP=report-only` | CSP nur als Bericht statt erzwungen. |

## Köpfe prüfen

```
curl -skI https://192.168.178.83:8443/
curl -sI https://ki-labor.daniel-alisch.site/
curl -s -o /dev/null -w "%{http_code}\n" https://ki-labor.daniel-alisch.site/openapi.json   # erwartet 404
LABOR_URL=https://192.168.178.83:8443 node tests/sicherheitskoepfe.mjs
python3 tests/sicherheitskoepfe_test.py        # alle Betriebsarten, ohne Jetson
```

`tests/csp-crawl.mjs` geht Seiten und Knöpfe im Browser durch und meldet CSP-Verstöße (Chrome loggt sie nur als Info; am besten mit `KL_CSP=report-only` gegen eine lokale Kopie).

`ERWARTE_HSTS=1 LABOR_URL=... node tests/sicherheitskoepfe.mjs` verlangt zusätzlich HSTS (nur öffentlich sinnvoll).

## Was bewusst nicht geändert wurde

- Der Dienst bindet im LAN auf `0.0.0.0` mit selbstsigniertem Zertifikat. Das ist Absicht für den Test im Heimnetz. Deshalb setzt der Dienst HSTS dort nicht: Ein Browser, der HSTS kennt, ließe sich nicht mehr über die Zertifikatswarnung hinwegklicken.
- Der öffentliche Weg läuft über nginx und Cloudflare. HSTS und CSP lassen sich dort zusätzlich setzen; der Dienst liefert sie im öffentlichen Modus aber selbst mit, sobald die Anfrage als HTTPS erkennbar ist (`X-Forwarded-Proto: https`).
- Der Kopf `server: uvicorn` bleibt. Uvicorn hängt ihn nach der Anwendung selbst an. Abschalten geht nur mit dem Startparameter `--no-server-header` (Dienstdatei in `scripts/`) oder im nginx.

## Empfehlung für nginx (nur Hinweis, am Server nichts geändert)

- `proxy_set_header X-Forwarded-Proto $scheme;` setzen, damit HSTS im Dienst greift.
- `proxy_hide_header Server;` bzw. `server_tokens off;` und `more_set_headers "Server: ki-labor";` (falls das Modul vorhanden ist), um `uvicorn` und die nginx-Version nicht zu zeigen.
- HSTS erst mit `includeSubDomains` und `preload` erweitern, wenn alle Unterdomänen von `daniel-alisch.site` dauerhaft HTTPS sprechen. Bis dahin reicht `max-age=31536000`.
- Doppelte Köpfe vermeiden: Setzt nginx Köpfe selbst, mit `proxy_hide_header` die des Dienstes ausblenden oder beides gleich lassen.

## Klassenmodus: Zugriffsprotokolle (Stand 27.11.2026, nur gelesen, am Server nichts geändert)

Befund am Proxy-Server für ki-labor.daniel-alisch.site: nginx schreibt `access_log /var/log/nginx/access.log` im Standardformat (kombiniert: vollständige IP-Adresse, Zeit, Anfragezeile, Statuscode, Referer, User-Agent), tägliche Rotation, 14 Archive komprimiert (`/etc/logrotate.d/nginx`). Der Proxy reicht den Verkehr an den Cloudflare-Tunnel weiter, Cloudflare kann die Verbindung technisch einsehen. Der Klassen-Code steht nie in einer Adresse, wohl aber erscheinen `/ws/klasse`, `/klassenmodus`, `/klasse-mitmachen`, `/klasse-wand` samt IP-Adresse und Zeit.

Vorschlag (Entscheidung beim Betreiber), in `location`-Blöcken vor `location /`:

```
location = /ws/klasse        { access_log off; error_log /dev/null crit; proxy_pass ...; }   # gleiche proxy_set_header wie in location /
location ^~ /api/klasse/     { access_log off; proxy_pass ...; }
location = /klasse/nachweis  { access_log off; proxy_pass ...; }
```

Alternativ ein eigenes `log_format` mit gekürzter IP (`map $remote_addr $ip_kurz { ~(?P<a>\d+\.\d+\.\d+)\.\d+ $a.0; default 0.0.0.0; }`) und sieben Tage Aufbewahrung für diese Pfade. Die Seiten selbst (`/klassenmodus` usw.) sind normale Seitenaufrufe wie alle anderen. Danach die Aussage auf der Seite `klassenmodus` und im Datenschutzentwurf anpassen.

### Klassenmodus: Besucheradresse hinter dem Proxy (Betrieb)

Der Klassenmodus braucht für Sperre und Obergrenzen die echte Besucheradresse. Hinter dem Cloudflare-Tunnel kommt jede Verbindung vom lokalen Tunnelclient, die Adresse der direkten Verbindung ist darum für alle gleich. Der Dienst nutzt deshalb nur Werte, die der eigene nginx setzt und mit dem gemeinsamen Schlüssel ausweist: `proxy_set_header X-Real-IP $remote_addr;` und `proxy_set_header X-KL-Proxy <KL_PROXY_KEY>;` (beides steht in der vorhandenen Konfiguration von `location /`, auch für den neuen Pfad `/ws/klasse`, der denselben Block nutzt). Cloudflare reicht diese eigenen Header zum Dienst durch. `CF-Connecting-IP` bleibt ungenutzt: Der Dienst kann nicht belegen, dass die direkte Verbindung aus den veröffentlichten Cloudflare-Bereichen kommt, denn sie kommt vom lokalen Tunnelclient.

Fehlt `KL_PROXY_KEY` bei `OEFFENTLICH=1`, startet der Klassenmodus mit einer Warnung und lehnt Sitzungen ab ("nicht eingerichtet"). Das ist gewollt: lieber geschlossen als alle Besucher unter einer Adresse. Änderungen am Server (Schlüssel setzen, `access_log` für die Klassen-Pfade) erfolgen erst nach Freigabe durch den Betreiber. In dieser Arbeit wurde am Server nichts geändert.
