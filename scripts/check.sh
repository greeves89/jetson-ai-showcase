#!/bin/bash
# Vorab-Check fuer das KI-Labor auf einem Jetson. Liest nur: installiert nichts, startet nichts, braucht kein sudo.
#
# Aufruf:  bash scripts/check.sh
#          ssh <benutzer>@<jetson-ip> 'bash -s' < scripts/check.sh      (von einem anderen Rechner aus)
#
# Ausgabe je Pruefung: [OK], [WARNUNG] oder [FEHLER].
# Exit-Code: 0 = alles in Ordnung, 2 = nur Warnungen, 1 = mindestens ein Fehler.
# Anleitung: docs/selbst-aufbauen.md

OLLAMA_URL="${OLLAMA_URL:-http://127.0.0.1:11434}"
PORT="${PORT:-8443}"
n_ok=0; n_warn=0; n_fehler=0

ok()     { printf '[OK]       %s\n' "$*"; n_ok=$((n_ok + 1)); }
warn()   { printf '[WARNUNG]  %s\n' "$*"; n_warn=$((n_warn + 1)); }
fehler() { printf '[FEHLER]   %s\n' "$*"; n_fehler=$((n_fehler + 1)); }
info()   { printf '           %s\n' "$*"; }
abschnitt() { printf '\n== %s ==\n' "$*"; }

# ---------------------------------------------------------------- Gerät und JetPack
abschnitt "Gerät und JetPack"
if [ "$(uname -m)" = "aarch64" ]; then ok "Architektur aarch64"; else warn "Architektur $(uname -m): das Labor ist für einen Jetson (aarch64) gebaut"; fi

modell=""
[ -r /proc/device-tree/model ] && modell=$(tr -d '\0' < /proc/device-tree/model)
case "$modell" in
  *"Orin Nano"*) ok "Gerät: $modell" ;;
  "") warn "Gerätemodell nicht lesbar (kein Jetson?)" ;;
  *) warn "Gerät: $modell. Getestet ist nur der Orin Nano mit 8 GB" ;;
esac

if [ -r /etc/nv_tegra_release ]; then
  l4t=$(sed -n '1s/^# \(R[0-9]*\).*REVISION: \([0-9.]*\).*/\1.\2/p' /etc/nv_tegra_release)
  case "$l4t" in
    R36.*) ok "L4T $l4t (gehört zu JetPack 6)" ;;
    "") warn "L4T-Version nicht lesbar (/etc/nv_tegra_release)" ;;
    *) fehler "L4T $l4t: gebraucht wird JetPack 6 (L4T R36). Neu flashen, siehe docs/selbst-aufbauen.md" ;;
  esac
else
  fehler "/etc/nv_tegra_release fehlt: kein JetPack-System?"
fi

if [ -x /usr/local/cuda/bin/nvcc ]; then
  cuda=$(/usr/local/cuda/bin/nvcc --version 2>/dev/null | sed -n 's/.*release \([0-9.]*\),.*/\1/p')
  ok "CUDA ${cuda:-vorhanden}"
else
  warn "CUDA-Werkzeuge (nvcc) nicht gefunden. Für das Labor selbst nicht nötig, Ollama bringt seine CUDA-Bibliotheken mit"
fi

if command -v nvpmodel >/dev/null 2>&1; then
  modus=$(nvpmodel -q 2>/dev/null | sed -n 's/^NV Power Mode: //p')
  case "$modus" in
    "") info "Leistungsmodus nicht lesbar (nvpmodel -q braucht hier evtl. sudo). Prüfen: sudo nvpmodel -q" ;;
    *7W*) warn "Leistungsmodus $modus: sehr niedrig. Höheren Modus wählen (sudo nvpmodel -m <Nr>), siehe docs/selbst-aufbauen.md" ;;
    *) ok "Leistungsmodus: $modus" ;;
  esac
fi

# ---------------------------------------------------------------- Werkzeuge und Python
abschnitt "Werkzeuge und Python"
for w in git curl openssl python3; do
  if command -v "$w" >/dev/null 2>&1; then ok "$w vorhanden"; else fehler "$w fehlt (sudo apt install $w)"; fi
done

if command -v python3 >/dev/null 2>&1; then
  pyv=$(python3 -c 'import sys; print("%d.%d" % sys.version_info[:2])')
  if [ "$pyv" = "3.10" ]; then ok "Python $pyv"; else warn "Python $pyv: getestet ist 3.10 (JetPack 6). Andere Versionen können mit den Paketen aus JetPack kollidieren"; fi

  if python3 -c 'import pip' 2>/dev/null; then ok "pip vorhanden"; else warn "pip fehlt: scripts/setup.sh richtet es ohne sudo ein (get-pip.py --user)"; fi

  if python3 -c 'import cv2' 2>/dev/null; then
    ok "OpenCV (cv2) $(python3 -c 'import cv2; print(cv2.__version__)') aus JetPack"
  else
    fehler "OpenCV (cv2) im System-Python fehlt: JetPack-Komponenten nachinstallieren (sudo apt install nvidia-jetpack oder python3-opencv)"
  fi
  if python3 -c 'import PIL' 2>/dev/null; then ok "Pillow vorhanden"; else warn "Pillow fehlt (sudo apt install python3-pil)"; fi

  if python3 -c 'import numpy' 2>/dev/null; then
    if python3 -c 'import numpy, sys; sys.exit(0 if int(numpy.__version__.split(".")[0]) < 2 else 1)'; then
      ok "numpy $(python3 -c 'import numpy; print(numpy.__version__)') (unter 2, richtig)"
    else
      fehler "numpy $(python3 -c 'import numpy; print(numpy.__version__)') ist 2 oder neuer: bricht OpenCV aus JetPack. Reparatur: python3 -m pip install --user 'numpy<2'"
    fi
  else
    warn "numpy nicht installiert: scripts/setup.sh installiert numpy<2"
  fi
fi

# ---------------------------------------------------------------- Speicher und Platte
abschnitt "Speicher und Platte"
if [ -r /proc/meminfo ]; then
  gesamt=$(awk '/^MemTotal:/ {print int($2/1024)}' /proc/meminfo)
  frei=$(awk '/^MemFree:/ {print int($2/1024)}' /proc/meminfo)
  cache=$(awk '/^Cached:/ {print int($2/1024)}' /proc/meminfo)
  if [ "$gesamt" -ge 7000 ]; then ok "Arbeitsspeicher gesamt: $gesamt MB"; else warn "Arbeitsspeicher gesamt: $gesamt MB. Das Labor ist für 8 GB ausgelegt"; fi
  if [ "$frei" -ge 1800 ]; then
    ok "Freier Arbeitsspeicher: $frei MB (Dateicache: $cache MB)"
  else
    warn "Freier Arbeitsspeicher nur $frei MB (Dateicache: $cache MB). GPU-Modelle brauchen wirklich freien RAM: python3 scripts/cache_leeren.py (ohne sudo)"
  fi
  swap=$(awk '/^SwapTotal:/ {print int($2/1024)}' /proc/meminfo)
  if [ "$swap" -gt 0 ]; then ok "Swap: $swap MB"; else info "Kein Swap eingerichtet (optional)"; fi
fi

platz=$(df -Pm "$HOME" 2>/dev/null | awk 'NR==2 {print int($4/1024)}')
if [ -n "$platz" ]; then
  if [ "$platz" -lt 8 ]; then fehler "Nur $platz GB frei im Home-Verzeichnis: Modelle und Pakete brauchen rund 5 GB, empfohlen sind 10 GB und mehr"
  elif [ "$platz" -lt 15 ]; then warn "$platz GB frei im Home-Verzeichnis: reicht knapp (Richtwert: 10 GB und mehr)"
  else ok "$platz GB frei im Home-Verzeichnis"; fi
fi

# ---------------------------------------------------------------- Ollama
abschnitt "Ollama und Modelle"
if command -v ollama >/dev/null 2>&1; then
  ok "ollama installiert: $(ollama --version 2>/dev/null | sed -n 's/.*version is //p')"
else
  fehler "ollama nicht installiert: siehe docs/selbst-aufbauen.md, Schritt Ollama"
fi

tags=$(curl -s -m 4 "$OLLAMA_URL/api/tags" 2>/dev/null)
if [ -n "$tags" ]; then
  ok "Ollama antwortet unter $OLLAMA_URL"
  ver=$(curl -s -m 4 "$OLLAMA_URL/api/version" 2>/dev/null | sed -n 's/.*"version":"\([^"]*\)".*/\1/p')
  [ -n "$ver" ] && info "Ollama-Version laut Schnittstelle: $ver (gemessen und beschrieben ist 0.12.3, siehe docs/selbst-aufbauen.md)"
  for m in "llama3.2:3b" "nomic-embed-text"; do
    if printf '%s' "$tags" | grep -q "\"name\":\"$m\(:latest\)\?\""; then ok "Modell $m vorhanden"; else fehler "Modell $m fehlt: ollama pull $m"; fi
  done
else
  fehler "Ollama antwortet nicht unter $OLLAMA_URL (Dienst gestartet? systemctl status ollama)"
fi

# ---------------------------------------------------------------- Port und Dienst
abschnitt "Port $PORT und Dienst"
belegt=0
if command -v ss >/dev/null 2>&1; then
  ss -ltn 2>/dev/null | awk -v p=":$PORT" '$4 ~ p"$" {f=1} END {exit !f}' && belegt=1
fi
dienst_aktiv=0
if command -v systemctl >/dev/null 2>&1 && systemctl --user is-active --quiet jetson-showcase 2>/dev/null; then dienst_aktiv=1; fi
if [ "$belegt" = 1 ] && [ "$dienst_aktiv" = 1 ]; then
  ok "Port $PORT belegt vom Dienst jetson-showcase (läuft bereits, das ist bei einem Update richtig)"
elif [ "$belegt" = 1 ]; then
  fehler "Port $PORT ist belegt, aber nicht vom Dienst jetson-showcase. Prüfen: ss -ltnp | grep $PORT (ein von Hand gestarteter uvicorn blockiert den Dienst)"
else
  ok "Port $PORT frei"
fi
if [ "$dienst_aktiv" = 0 ] && command -v systemctl >/dev/null 2>&1; then
  info "Dienst jetson-showcase läuft noch nicht (vor der Einrichtung normal)"
fi
if [ "$(basename "$PWD")" != "jetson-ai-showcase" ] && [ ! -d "$HOME/jetson-ai-showcase" ]; then
  info "Das Repo liegt nicht unter ~/jetson-ai-showcase. Der Dienst erwartet genau diesen Pfad (scripts/jetson-showcase.service)"
fi

# ---------------------------------------------------------------- Ergebnis
printf '\nErgebnis: %d OK, %d Warnung(en), %d Fehler\n' "$n_ok" "$n_warn" "$n_fehler"
if [ "$n_fehler" -gt 0 ]; then
  echo "Bitte die Fehler beheben, bevor scripts/setup.sh läuft. Anleitung: docs/selbst-aufbauen.md"
  exit 1
elif [ "$n_warn" -gt 0 ]; then
  echo "Es geht weiter, die Warnungen vorher lesen."
  exit 2
fi
echo "Alles bereit."
exit 0
