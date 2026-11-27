# Das KI-Labor selbst auf einem Jetson aufbauen

Diese Anleitung bringt das KI-Labor auf deinen eigenen NVIDIA Jetson Orin Nano (8 GB). Danach läuft es im Heimnetz
unter `https://<jetson-ip>:8443`, ohne Cloud und ohne Konto.

Die Anleitung stammt aus der Praxis eines einzigen Geräts. Was geprüft ist und was nicht, steht im Abschnitt
[Stand der Prüfung](#stand-der-prüfung). Lies ihn zuerst.

## Was du brauchst

| Teil | Hinweis |
|---|---|
| NVIDIA Jetson Orin Nano Developer Kit mit 8 GB | Getestet auf der "Super"-Ausführung. Das Labor ist für 8 GB ausgelegt, der Speicher ist seine Grenze. Andere Modelle sind ungetestet |
| Netzteil | gehört zum Developer Kit (laut NVIDIA-Schnellstart ein 19-V-Netzteil, gelesen am 22.11.2026) |
| NVMe-SSD (M.2) | Das Referenzgerät läuft von einer NVMe-SSD. Eine SD-Karte ist ungetestet. Die M.2-Bauform ist hier nicht belegt, sie steht im NVIDIA-Handbuch zum Kit. Mindestens 10 GB frei einplanen (Modelle und Pakete belegen rund 3,2 GB, dazu Betriebssystem und Platz zum Arbeiten) |
| Netzwerk | Kabel oder WLAN, nur für Einrichtung und Zugriff im Heimnetz |
| Ein zweiter Rechner | zum Flashen von JetPack (Ubuntu-PC) und zum Bedienen im Browser |
| Webcam und Mikrofon | brauchst du am Jetson nicht. Kamera und Mikrofon kommen aus dem Browser deines Rechners oder Handys |

Preis: NVIDIA nannte im Blog vom 17. Dezember 2024 für das Developer Kit 249 US-Dollar (gesenkt von 499), Quelle
https://developer.nvidia.com/blog/nvidia-jetson-orin-nano-developer-kit-gets-a-super-boost, am 22.11.2026 erneut gelesen.
Händlerpreise, Steuer, SSD und Zubehör kommen dazu: Preis beim Händler erfragen. Zur Kühlung nennt NVIDIA auf den
geprüften Seiten nichts, achte bei einem höheren Leistungsmodus selbst darauf (siehe Schritt 2).

Zeit und Vorkenntnisse: Du solltest ein Terminal bedienen können (Befehle eintippen, eine Datei lesen) und per
`ssh` auf einen Rechner kommen. Programmieren musst du nicht. Rechne für den Aufbau mit einem halben bis ganzen Tag, der größte Teil
ist Warten (Flashen, Downloads). Das ist eine Schätzung, keine Messung.

## Überblick

1. JetPack 6 auf den Jetson flashen
2. Leistungsmodus prüfen
3. Vorab-Check laufen lassen
4. Ollama installieren und die zwei Modelle laden
5. Repo klonen, einrichten, als Dienst starten
6. Im Browser öffnen

Schritte mit `sudo` sind unten ausdrücklich so gekennzeichnet: der Ollama-Installer (legt einen Systemdienst an), der
Leistungsmodus (ändert eine Systemeinstellung), die Ollama-Einstellungen und notfalls `loginctl enable-linger`. Das Labor
selbst und seine Skripte (`check.sh`, `setup.sh`, `install-service.sh`) laufen ohne Administratorrechte.

## 1. JetPack 6 flashen

Das Labor braucht JetPack 6 (L4T R36, Ubuntu 22.04, CUDA 12.6, Python 3.10). Wie du flashst, steht in der
Anleitung von NVIDIA und ändert sich mit jeder Version. Folge ihr, statt hier eine Kopie zu pflegen:

- Einstieg für das Developer Kit: https://developer.nvidia.com/embedded/learn/get-started-jetson-orin-nano-devkit
- JetPack-Übersicht: https://developer.nvidia.com/embedded/jetpack

Wichtig für das Labor:

- Installiere JetPack mit den Komponenten für CUDA und OpenCV. Das Labor benutzt das **OpenCV aus JetPack** (im
  System-Python). Es kommt bewusst nicht aus `pip`.
- Lege beim ersten Start einen normalen Benutzer an. Alles Weitere läuft unter diesem Benutzer.
- Aktiviere SSH, damit du von deinem Rechner aus arbeiten kannst.

Das Referenzgerät läuft mit L4T R36.4.7 (JetPack 6.2.x), Ubuntu 22.04.5 und CUDA 12.6.

## 2. Leistungsmodus

Der Jetson hat Leistungsmodi. Das Referenzgerät läuft im Modus `MAXN_SUPER`. Ansehen:

```bash
nvpmodel -q
```

Umstellen braucht Administratorrechte (**sudo**):

```bash
sudo nvpmodel -q --verbose     # zeigt die verfügbaren Modi mit Nummern
sudo nvpmodel -m <Nummer>      # Modus wählen; eine Nummer aus der Liste, nicht raten
```

Ein höherer Modus macht das Gerät schneller und wärmer. Achte auf Kühlung und ein ausreichend starkes Netzteil.

## 3. Vorab-Check

Das Repo bringt einen Check mit, der nur liest und nichts ändert (`scripts/check.sh`). Du kannst ihn auf dem Jetson
starten oder von deinem Rechner aus, auf dem du das Repo geklont hast:

```bash
ssh <benutzer>@<jetson-ip> 'bash -s' < scripts/check.sh
```

Er prüft JetPack/L4T-Version, Python, Speicher und Platte, Ollama und die Modelle, `numpy<2`, Port 8443 und den
Dateicache. Er meldet je Zeile `OK`, `WARNUNG` oder `FEHLER`. Vor Schritt 4 melden Ollama und die Modelle erwartungsgemäß
Fehler. Nach Schritt 5 sollte er sauber durchlaufen. Exit-Code: 0 alles in Ordnung, 2 nur Warnungen, 1 Fehler.

## 4. Ollama installieren und Modelle laden

Das Sprachmodell läuft in [Ollama](https://ollama.com). Installation laut Ollama-Dokumentation für Linux:

```bash
# braucht sudo: das Skript legt einen Systemdienst an
curl -fsSL https://ollama.com/install.sh | sh
```

Nach Angaben von Ollama wählt das Skript die passende Ausführung für JetPack. Auf einem frischen Gerät ist das
nicht nachgeprüft (siehe Stand der Prüfung). Das Referenzgerät läuft mit **Ollama 0.12.3**. Willst du genau diese
Version, die Ollama-Dokumentation nennt dafür die Variable `OLLAMA_VERSION`:

```bash
# braucht sudo
curl -fsSL https://ollama.com/install.sh | OLLAMA_VERSION=0.12.3 sh
```

Dann die zwei Modelle laden (ohne sudo, `ollama pull` spricht mit dem Dienst):

```bash
ollama pull llama3.2:3b          # Sprachmodell, rund 2,0 GB
ollama pull nomic-embed-text     # Einbettungsmodell für RAG, rund 270 MB
ollama list
```

Das Labor erlaubt genau diese zwei Modelle (feste Liste in `app/app.py`). Andere Modelle laufen nicht im Labor. Auf
dem Referenzgerät ließ sich `qwen2.5` nicht laden, und `qwen3` ignorierte die Einstellung `think:false`. Deshalb ist
`llama3.2:3b` das Chat-Modell.

### Ollama-Einstellungen für den Jetson (sudo)

Das Referenzgerät startet Ollama mit diesen Umgebungsvariablen:

| Variable | Wert | Wozu |
|---|---|---|
| `OLLAMA_FLASH_ATTENTION` | `1` | Ohne Flash-Attention und mit dem Standard-Cache (f16) scheiterte bei fragmentiertem Speicher die Reservierung (rund 448 MiB) |
| `OLLAMA_KV_CACHE_TYPE` | `q8_0` | kleinerer Zwischenspeicher für den Kontext |
| `OLLAMA_CONTEXT_LENGTH` | `4096` | begrenzt den Kontext, spart Speicher |
| `OLLAMA_KEEP_ALIVE` | `30m` | Modelle bleiben 30 Minuten geladen |
| `OLLAMA_MAX_LOADED_MODELS` | `2` | Chat- und Einbettungsmodell bleiben gleichzeitig geladen |

Setzen mit einem Drop-in für den Dienst:

```bash
# braucht sudo
sudo systemctl edit ollama
```

Im Editor eintragen (der Block `[Service]` ist Pflicht):

```ini
[Service]
Environment="OLLAMA_FLASH_ATTENTION=1"
Environment="OLLAMA_KV_CACHE_TYPE=q8_0"
Environment="OLLAMA_CONTEXT_LENGTH=4096"
Environment="OLLAMA_KEEP_ALIVE=30m"
Environment="OLLAMA_MAX_LOADED_MODELS=2"
```

Speichern, dann `sudo systemctl restart ollama`. Das Labor spricht Ollama unter `http://127.0.0.1:11434` an. Der
Standard von Ollama passt dazu, du musst `OLLAMA_HOST` nicht setzen.

Ob das Labor auch mit den Ollama-Standardwerten läuft, habe ich nicht getestet. Die Werte oben sind die, mit denen es
gemessen wurde.

### Bekannte Falle: Kauderwelsch bei langen Eingaben (Ollama 0.12.3)

Auf dem Orin Nano mit Ollama 0.12.3 lieferte `llama3.2:3b` ab etwa 1100 Eingabe-Tokens nur noch "GGGG" oder
hing, wenn alle Schichten auf der GPU lagen. Gemessen am 22.11.2026: 1084 Tokens ok, 1168 kaputt, mit der CPU ok.
Flash-Attention, Cache-Typ und `num_batch` ändern daran nichts.

Der Fix steckt im Labor: Es lässt nur einen Teil der Schichten auf der GPU rechnen (`num_gpu`, Standard **24**,
siehe `app/speicher.py`). Damit sind die Antworten korrekt und ungefähr gleich schnell (rund 10 Tokens pro Sekunde
gemessen). Du musst nichts tun. Ändern kannst du den Wert mit der Umgebungsvariable `KL_LLM_GPU_SCHICHTEN` im
Dienst (siehe [Einstellungen](#einstellungen-des-labors)). 28 Schichten gaben auf dem Referenzgerät einen
Speicherfehler (OOM). Bei einer anderen Ollama-Version kann das Verhalten anders sein. Wenn du eine neuere Version
nutzt, teste mit einem langen Text.

Das Einbettungsmodell `nomic-embed-text` rechnet auf der CPU (`num_gpu 0`), weil es auf der GPU für manche Sätze nur
Nullvektoren lieferte. Auch das macht das Labor selbst.

## 5. Labor einrichten

Das Repo muss unter **`~/jetson-ai-showcase`** liegen. Die Dienstdatei erwartet genau diesen Pfad.

```bash
git clone https://github.com/greeves89/jetson-ai-showcase.git ~/jetson-ai-showcase
cd ~/jetson-ai-showcase
bash scripts/check.sh              # Vorab-Check (liest nur)
bash scripts/setup.sh              # Pakete, Modelle, Stimme, Zertifikat
bash scripts/install-service.sh    # Autostart als systemd-Benutzerdienst
```

Was `setup.sh` ohne Administratorrechte tut:

- richtet `pip` für deinen Benutzer ein, falls es fehlt (`get-pip.py --user`)
- installiert die Pakete aus `requirements.txt` mit `pip install --user` (FastAPI, Uvicorn, faster-whisper,
  piper-tts, `numpy<2`)
- lädt die Bildmodelle (Gesichtserkennung YuNet, Objekterkennung YOLOX, MobileNet für das Anlern-Labor, dazu über `scripts/modelle_laden.sh` Handerkennung und Gesichtsausdruck für das Labor Hände und Gesichter sowie das Freistell-Modell PP-HumanSeg für das Labor Bild schützen, rund 6 MB, im Betrieb etwa 40 MB Arbeitsspeicher, 120 Sekunden nach dem letzten Bild wieder freigegeben) nach `app/models/`
- lädt das Whisper-Modell `base` in den Hugging-Face-Cache und die deutsche Piper-Stimme `thorsten-medium` nach
  `~/.local/share/piper-voices`
- erzeugt ein selbstsigniertes Zertifikat in `certs/` (825 Tage gültig)

Auf dem Referenzgerät belegen diese Dateien zusammen rund 0,9 GB (Bildmodelle 49 MB, Whisper-Cache 605 MB, Stimme
230 MB). Die Ollama-Modelle kommen mit 2,3 GB dazu.

`install-service.sh` legt `~/.config/systemd/user/jetson-showcase.service` an und startet den Dienst. Zum Schluss
versucht es `loginctl enable-linger`, damit der Dienst auch ohne Anmeldung nach einem Neustart startet. Meldet es eine
Warnung, ist dafür ein **sudo**-Schritt nötig:

```bash
# braucht sudo, nur wenn install-service.sh eine linger-Warnung gemeldet hat
sudo loginctl enable-linger "$USER"
```

## 6. Erster Start im Browser

Prüfen, ob der Dienst läuft:

```bash
systemctl --user status jetson-showcase
journalctl --user -u jetson-showcase -n 50 --no-pager
```

Dann im Browser deines Rechners öffnen: `https://<jetson-ip>:8443`

### HTTPS-Warnung

Das Zertifikat hast du selbst erzeugt, kein Browser kennt es. Er warnt deshalb einmal. Wähle "Erweitert" und dann
"Weiter zu ... (unsicher)". Die Verbindung ist trotzdem verschlüsselt. Ein vertrauenswürdiges Zertifikat gibt es nur
mit einer eigenen Adresse (siehe Betrieb unten).

### Kamera und Mikrofon

Browser geben Kamera und Mikrofon **nur über HTTPS** frei. Öffnest du `http://...` oder bestätigst die Warnung
nicht, bleibt die Freigabe aus. Die Kamera ist die deines Rechners oder Handys, nicht eine am Jetson. Wer nichts
freigeben will, nutzt die mitgelieferten Beispielbilder.

## Einstellungen des Labors

Umgebungsvariablen des Dienstes. Setzen mit einem Drop-in (ohne sudo, es ist ein Benutzerdienst):

```bash
systemctl --user edit jetson-showcase
```

```ini
[Service]
Environment="KL_LLM_GPU_SCHICHTEN=24"
```

Danach `systemctl --user restart jetson-showcase`. Ein Neustart beendet laufende Chats und Verbindungen.

| Variable | Standard | Bedeutung |
|---|---|---|
| `KL_LLM_GPU_SCHICHTEN` | `24` | GPU-Schichten des Sprachmodells (siehe Falle oben) |
| `WHISPER_MODELL` | `base` | Größe des Whisper-Modells für Sprache zu Text |
| `PIPER_VOICE_DIR` | `~/.local/share/piper-voices` | Ordner der Piper-Stimmen |
| `SHOWCASE_ALLOWED_HOSTS` | leer | weitere erlaubte Adressen, kommagetrennt (siehe Fehlersuche) |
| `OEFFENTLICH` | aus | `1` schaltet Ratenbegrenzung und den öffentlichen Modus ein |
| `OEFFENTLICHE_URL` | leer | Basisadresse für `canonical` und Sitemap im öffentlichen Modus |
| `LLM_PARALLEL` | `2` | gleichzeitige Sprachmodell-Antworten |
| `LLM_WARTEND_MAX` | `6` | wie viele Besucher in der Warteschlange stehen dürfen |
| `LLM_WARTEZEIT_S` | `90` | längste Wartezeit |
| `SITZUNG_TTL_S` | `1800` | Ablauf der Besucher-Sitzung in Sekunden |

Die letzten vier Zeilen sind in `docs/veroeffentlichung.md` beschrieben.

## Updates

```bash
cd ~/jetson-ai-showcase
git pull
bash scripts/setup.sh                       # lädt nur, was fehlt, und installiert neue Pakete
systemctl --user restart jetson-showcase
```

Ändert sich `requirements.txt`, holt `setup.sh` die neuen Pakete. Prüfe danach mit `bash scripts/check.sh`.

## Autostart und Dienst

Der Dienst startet beim Hochfahren und bei einem Absturz nach 3 Sekunden neu (`Restart=always`).

```bash
systemctl --user status jetson-showcase
systemctl --user restart jetson-showcase
systemctl --user stop jetson-showcase
```

## Speicher-Fallen

CPU und GPU teilen sich die 8 GB. GPU-Modelle reservieren ihren Platz aus dem wirklich **freien** Speicher. Der
Dateicache großer Modelldateien bleibt nach dem Laden stehen und wird dabei nicht zuverlässig freigegeben. Folge:
`unable to allocate CUDA0 buffer`, Ollama-Fehler 500, leere Antworten, obwohl `available` genug zeigt.

- **Automatisch:** Das Labor prüft alle 20 Sekunden und gibt den Dateicache frei, wenn weniger als 1800 MB frei sind
  (`app/speicher.py`). Vor dem Laden eines Modells prüft es zusätzlich.
- **Von Hand, ohne sudo:** `python3 scripts/cache_leeren.py`. Das verwirft nur saubere Cache-Seiten (`posix_fadvise`).
  Deine Dateien bleiben unverändert und werden bei Bedarf neu gelesen.
- Zahlen ansehen: `free -m`. Entscheidend ist die Spalte `free`, nicht `available`.
- Starte keine zusätzlichen großen Programme auf dem Jetson, während das Labor läuft. Ein Desktop mit Browser frisst
  Speicher, den die Modelle brauchen.
- Auf dem Referenzgerät nutzt Whisper `base` die CPU (CTranslate2 hat auf dem Jetson keine CUDA-Unterstützung),
  etwa dreimal Echtzeit. Das ist gewollt, nicht kaputt.

## Fehlersuche

| Symptom | Ursache | Lösung |
|---|---|---|
| Browser meldet "Verbindung nicht sicher" | selbstsigniertes Zertifikat | Warnung einmal bestätigen (siehe oben) |
| Kamera oder Mikrofon lässt sich nicht freigeben | Seite über `http://` oder Warnung nicht bestätigt | `https://<jetson-ip>:8443` verwenden |
| Seite lädt nicht, Meldung "Invalid host header" (HTTP 400) | Du rufst das Labor über eine Adresse auf, die nicht erlaubt ist (z. B. eigener Name oder Tunnel) | Adresse in `SHOWCASE_ALLOWED_HOSTS` eintragen, Dienst neu starten |
| Dienst startet nicht, Status `exit 3` | Port 8443 ist belegt, oft von einem von Hand gestarteten `uvicorn` | `ps -eo pid,lstart,args \| grep "[u]vicorn app.app"`, den fremden Prozess beenden, Dienst neu starten |
| Chat: leere Antwort, Fehler "unable to allocate CUDA0 buffer", Ollama 500 | zu wenig freier Speicher durch Dateicache | `python3 scripts/cache_leeren.py`, bei Wiederholung andere Programme beenden |
| Antworten werden zu "GGGG" oder Kauderwelsch bei langem Text | Fehler von Ollama 0.12.3 bei voller GPU-Auslagerung | Standard `KL_LLM_GPU_SCHICHTEN=24` nicht erhöhen. Bei anderer Ollama-Version testen |
| Speicherfehler (OOM) beim Laden des Sprachmodells | `KL_LLM_GPU_SCHICHTEN` zu hoch (28 scheiterte) | Wert senken, 24 wählen |
| Labor meldet "Ollama nicht erreichbar" | Ollama-Dienst läuft nicht | `sudo systemctl status ollama`, `sudo systemctl restart ollama` (**sudo**) |
| Modell fehlt (Fehlermeldung beim Chat oder RAG) | Modell nicht geladen | `ollama pull llama3.2:3b` und `ollama pull nomic-embed-text` |
| Gesichts- oder Objekterkennung bricht mit Importfehler von `cv2` ab | `numpy` 2 oder neuer überschreibt die Version, die OpenCV aus JetPack erwartet | `python3 -m pip install --user 'numpy<2'`, Dienst neu starten |
| `pip: command not found` | `pip` ist bei JetPack nicht dabei | normal, `setup.sh` richtet `python3 -m pip` ein. Immer `python3 -m pip` benutzen |
| Hinweis "Du bist Nr. 2" oder Meldung "ausgelastet" | Es laufen schon zwei Sprachmodell-Antworten | warten, das Labor wiederholt bis zu dreimal selbst |
| Spracherkennung dauert lange | Whisper rechnet auf der CPU, etwa dreimal Echtzeit | erwartet; `WHISPER_MODELL` kleiner wählen, wenn nötig |
| Dienst läuft nach Neustart nicht | `linger` nicht aktiv | `sudo loginctl enable-linger "$USER"` (**sudo**) |
| Beim Beenden des Dienstes bricht deine SSH-Sitzung ab | `pkill -f "uvicorn app.app"` trifft die eigene Shell | `pkill -f "[u]vicorn app.app"` (die Klammern sind der Trick) oder besser `systemctl --user stop jetson-showcase` |

Erst `bash scripts/check.sh` laufen lassen. Er findet die meisten dieser Ursachen selbst.

## Betrieb im Heimnetz oder öffentlich

**Heimnetz (Standard):** Das Labor ist über die Adresse des Jetson im eigenen Netz erreichbar. Ohne `OEFFENTLICH=1` steht
auf allen Seiten "nicht indexieren", `robots.txt` sperrt alles. Das ist der empfohlene Betrieb für Lernen und
Vorführen. Leite den Port nicht im Router ins Internet weiter.

**Öffentlich:** Das geht, ist aber ein eigenes Projekt. Ein Jetson hat 8 GB Speicher und kann von jedem Besucher
ausgelastet werden. Starte dann mit `OEFFENTLICH=1`. Das schaltet eine Ratenbegrenzung je Besucher ein. Gleichzeitige
Chats (2) und Kameraverbindungen (6) sind immer begrenzt, dahinter steht eine Warteschlange. Alles Weitere, vom
Cloudflare-Tunnel über Bot-Schutz bis zu den Rechtstexten, steht in
[`docs/veroeffentlichung.md`](veroeffentlichung.md). Als Betreiber einer öffentlichen Seite brauchst du eigene
Rechtstexte (Impressum, Datenschutzerklärung). Das Repo ersetzt sie nicht und ist keine Rechtsberatung.

## Lizenzen der Bausteine

Die Übersicht mit Quellen steht in [`lizenzen.md`](lizenzen.md) und im Labor auf der Seite "Lizenzen und Quellen".
Verbindlich ist immer der Lizenztext an der Quelle.

| Baustein | Lizenz laut Labor | Was du beachten musst |
|---|---|---|
| Llama 3.2 3B (Meta) | Llama 3.2 Community License und Acceptable Use Policy | Sichtbarer Hinweis "Built with Llama" und eine Kopie der Lizenz. Das Labor zeigt ihn in der Fußzeile und unter Antworten. Wenn du das Labor weitergibst oder öffentlich betreibst, behalte ihn bei. Lizenztext: https://github.com/meta-llama/llama-models/blob/main/models/llama3_2/LICENSE |
| nomic-embed-text | Apache-2.0 | siehe Modellkarte |
| Ollama | MIT | |
| Whisper base (faster-whisper) | MIT | siehe Modellkarte |
| Piper-Stimme `thorsten-medium` | CC0 laut `docs/lizenzen.md` | Namensnennung nicht verlangt. Stimme eines echten Menschen, geklont wird nichts. Andere Stimmen: **jeweils die Modellkarte lesen**, einige tragen nicht kommerzielle Lizenzen oder keine Angabe (siehe `docs/lizenzen.md`) |
| Piper (`piper-tts`) | GPL-3.0 | Das Labor ruft es nur als Bibliothek auf dem Gerät auf. Bei Weitergabe von Piper selbst gelten die GPL-Bedingungen |
| YuNet, MobileNetV2 (OpenCV Zoo) | MIT bzw. Apache-2.0 | siehe Modellkarte im OpenCV Zoo |
| MediaPipe Handflächen und Handpunkte, Gesichtsausdruck (OpenCV Zoo) | Apache-2.0 | siehe Modellkarten im OpenCV Zoo |
| PP-HumanSeg Personen-Segmentierung (OpenCV Zoo, aus PaddleHub) | Apache-2.0 | siehe Modellkarte und LICENSE im OpenCV Zoo |
| YOLOX-S (OpenCV Zoo) | Apache-2.0 | siehe Modellkarte im OpenCV Zoo |
| Haar-Kaskade (OpenCV) | Intel License Agreement for Open Source Computer Vision Library | siehe Datei |
| lucide-Icons | ISC | Lizenzhinweis beibehalten |

**Lizenz des Codes dieses Repos:** wird vom Betreiber festgelegt. Bis dahin gilt keine ausdrückliche Erlaubnis zur
Weitergabe. Das Labor selbst darfst du für dich aufbauen und nutzen, indem du es von GitHub klonst.

## Stand der Prüfung

Ehrlich vorweg: Diese Anleitung wurde **nicht** an einem frischen Jetson von einer dritten Person durchgespielt.

**Geprüft, am laufenden Referenzgerät (nur lesend, Stand 22.11.2026):**

- JetPack-Familie: L4T R36.4.7 (JetPack 6.2.x), Ubuntu 22.04.5, CUDA 12.6, Python 3.10.12
- Ollama 0.12.3 mit den Modellen `llama3.2:3b` (2,0 GB) und `nomic-embed-text` (274 MB)
- Die Ollama-Umgebungsvariablen der Tabelle oben
- OpenCV 4.8.0 aus dem System-Python, numpy 1.26.4, Pillow, faster-whisper, piper-tts
- Dienst als systemd-Benutzerdienst auf Port 8443 mit selbstsigniertem Zertifikat
- Dateigrößen der Modelle und Caches (im Text genannt)
- Befehle und Variablen von `scripts/setup.sh`, `scripts/install-service.sh` und `scripts/check.sh` gegen den Code
- `scripts/check.sh` läuft auf dem Referenzgerät ohne Fehler und ändert nichts

**Nicht geprüft:**

- Eine komplette Neuinstallation von JetPack bis zum Labor auf einem frischen Gerät
- Dass `setup.sh` auf einem frischen System ohne `pip` vollständig durchläuft (`get-pip.py --user`)
- Dass der Ollama-Installer auf einem frischen JetPack-Gerät die passende GPU-Ausführung wählt und dass
  `OLLAMA_VERSION=0.12.3` dort wie dokumentiert wirkt
- Neuere Ollama-Versionen (der Fehler bei langen Eingaben kann dort behoben sein oder anders auftreten)
- Der Betrieb mit den Ollama-Standardwerten (ohne die Variablen oben)
- Das Developer Kit mit 4 GB, andere Jetson-Modelle, SD-Karte statt NVMe
- Preise und Beschaffung
- Der Ablauf des Flashens (steht in der NVIDIA-Anleitung)
- `loginctl enable-linger` ohne sudo (hängt von der Konfiguration des Systems ab)

Hast du das Labor auf einem frischen Gerät aufgebaut und etwas stimmt nicht, melde es als Issue im Repo.
