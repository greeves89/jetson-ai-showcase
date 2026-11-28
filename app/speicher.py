"""Speicherhilfen fuer den Jetson (CPU und GPU teilen sich den Arbeitsspeicher).

Problem: GPU-Modelle reservieren ihren Platz aus dem wirklich freien RAM. Der Dateicache grosser Modelldateien
bleibt nach dem Laden stehen und wird bei einer GPU-Reservierung nicht zuverlaessig freigegeben. Folge:
"unable to allocate CUDA0 buffer", obwohl scheinbar genug Speicher "available" ist.

Loesung ohne Root: posix_fadvise(DONTNEED) verwirft die sauberen Cache-Seiten einer Datei. Das darf jeder Benutzer
fuer Dateien, die er lesen kann. Die Dateien bleiben unveraendert und werden beim naechsten Zugriff neu gelesen.

    from app import speicher
    speicher.sicherstellen(2800)      # vor dem Laden eines Modells: Cache freigeben, falls zu wenig frei ist
    speicher.waechter()               # Dauerlaeufer (in einem Thread): haelt genug RAM frei
    await speicher.modell_bereit("llama3.2:3b")   # vor jedem Chat-Aufruf: andere GPU-Modelle entladen, Modell laden, bei Speicherfehler
                                                  # in derselben Anfrage Cache und GPU leeren und mit weniger GPU-Schichten erneut laden
"""
import os
import time

WURZELN = [
    os.path.expanduser("~"),
    "/usr/share/ollama/.ollama/models",
    "/usr/local/lib/ollama",
]
MIN_BYTES = 8 * 1024 * 1024
UEBERSPRINGEN = {".git", "node_modules", "__pycache__"}


# Auf dem Jetson liefert llama3.2:3b bei voller GPU-Auslagerung ab ca. 1100 Prompt-Tokens nur noch "GGGG"
# (Ollama 0.12.3, gemessen 22.11.2026; mit 20 bis 24 GPU-Schichten korrekt und gleich schnell).
# Gilt fuer alle Chat-Aufrufe des Sprachmodells. Ueberschreibbar per Umgebungsvariable.
LLM_GPU_SCHICHTEN = int(os.environ.get("KL_LLM_GPU_SCHICHTEN", "24"))
# Kleinere Batchgroesse = kleinerer Rechenpuffer auf der GPU (565 MB bei 512). Nach langer Laufzeit ist der gemeinsame CPU/GPU-Speicher
# fragmentiert, ein grosser zusammenhaengender Puffer scheitert dann mit "cudaMalloc failed" (22.11.2026 beobachtet).
LLM_BATCH = int(os.environ.get("KL_LLM_BATCH", "128"))

# Rueckfall bei fragmentiertem GPU-Speicher: scheitert das Laden des Modells mit "cudaMalloc failed", wird fuer die folgenden Anfragen
# mit weniger GPU-Schichten geladen (24, 16, 8, 0; langsamer, aber es laeuft). Nach RUECKFALL_MINUTEN wird wieder die volle Stufe versucht.
_STUFEN = [LLM_GPU_SCHICHTEN, 16, 8, 0]
RUECKFALL_MINUTEN = int(os.environ.get("KL_RUECKFALL_MINUTEN", "30"))
_rueckfall = {"stufe": 0, "seit": 0.0}


def gpu_schichten():
    """Anzahl GPU-Schichten fuer die naechste Ollama-Anfrage (siehe Rueckfall oben)."""
    import time
    if _rueckfall["stufe"] and time.time() - _rueckfall["seit"] > RUECKFALL_MINUTEN * 60:
        _rueckfall["stufe"] = 0
    return min(_STUFEN[_rueckfall["stufe"]], LLM_GPU_SCHICHTEN)


def bei_ladefehler(text):
    """Merkt sich einen Speicherfehler von Ollama und senkt die Stufe. Gibt True zurueck, wenn es ein Speicherfehler war."""
    import time
    t = (text or "").lower()
    if not ("allocate" in t or "cuda" in t or "out of memory" in t):
        return False
    if _rueckfall["stufe"] < len(_STUFEN) - 1:
        _rueckfall["stufe"] += 1
    _rueckfall["seit"] = time.time()
    return True

def meminfo():
    """MemFree, MemAvailable und Cached in Megabyte."""
    with open("/proc/meminfo") as f:
        w = {z.split(":")[0]: int(z.split()[1]) for z in f if ":" in z}
    return {"frei": w["MemFree"] // 1024, "verfuegbar": w["MemAvailable"] // 1024, "cache": w["Cached"] // 1024}


def cache_leeren():
    """Gibt den Dateicache grosser Dateien frei. Gibt (Dateien, Megabyte frei gewonnen) zurueck."""
    vorher = meminfo()["frei"]
    dateien = 0
    for wurzel in WURZELN:
        for ordner, unter, namen in os.walk(wurzel, followlinks=False):
            unter[:] = [d for d in unter if d not in UEBERSPRINGEN]
            for name in namen:
                pfad = os.path.join(ordner, name)
                try:
                    if os.path.islink(pfad) or os.path.getsize(pfad) < MIN_BYTES:
                        continue
                    fd = os.open(pfad, os.O_RDONLY)
                    try:
                        os.posix_fadvise(fd, 0, 0, os.POSIX_FADV_DONTNEED)
                        dateien += 1
                    finally:
                        os.close(fd)
                except OSError:
                    continue
    return dateien, meminfo()["frei"] - vorher


def sicherstellen(min_frei_mb=2800):
    """Gibt den Cache frei, wenn weniger als min_frei_mb RAM frei sind. Liefert den freien RAM danach."""
    if meminfo()["frei"] < min_frei_mb:
        cache_leeren()
    return meminfo()["frei"]


def waechter(min_frei_mb=1800, takt_s=20):
    """Endlosschleife fuer einen Thread: prueft alle takt_s Sekunden und gibt bei Bedarf den Cache frei."""
    while True:
        try:
            sicherstellen(min_frei_mb)
        except Exception:                                      # noqa: BLE001 - ein Wächter darf nie sterben
            pass
        time.sleep(takt_s)


# ---------- Modelle automatisch laden und entladen ----------
OLLAMA_URL = os.environ.get("KL_OLLAMA", "http://127.0.0.1:11434")
_lade_sperre = None            # serialisiert Entladen und Laden (pro Ereignisschleife genau eine Sperre)


def chat_optionen():
    """Laufzeit-Optionen eines Chat-Aufrufs. Muessen beim Vorladen und beim echten Aufruf gleich sein, sonst laedt Ollama neu."""
    return {"num_gpu": gpu_schichten(), "num_batch": LLM_BATCH}


async def _geladen(c):
    """Liste der in Ollama geladenen Modelle ([] bei Fehler)."""
    try:
        return (await c.get(f"{OLLAMA_URL}/api/ps")).json().get("models", [])
    except Exception:                                          # noqa: BLE001
        return []


async def entladen(c, ausser=None, nur_gpu=True, warte_s=10.0):
    """Entlaedt geladene Modelle (alle ausser `ausser`; mit nur_gpu nur die, die GPU-Speicher belegen) und wartet,
    bis Ollama sie wirklich losgelassen hat. Gibt die Namen der entladenen Modelle zurueck."""
    import asyncio
    weg = [m["name"] for m in await _geladen(c)
           if m["name"] != ausser and (not nur_gpu or m.get("size_vram", 0) > 0)]
    for name in weg:
        try:
            await c.post(f"{OLLAMA_URL}/api/generate", json={"model": name, "keep_alive": 0})
        except Exception:                                      # noqa: BLE001
            pass
    ende = time.time() + warte_s
    while weg and time.time() < ende:
        if not any(m["name"] in weg for m in await _geladen(c)):
            break
        await asyncio.sleep(0.25)
    return weg


async def modell_bereit(modell, optionen=None, client=None):
    """Sorgt dafuer, dass `modell` geladen ist, bevor der eigentliche Aufruf kommt.

    1. Belegt das Modell GPU-Speicher, werden alle anderen GPU-Modelle zuerst entladen (der Speicher ist gemeinsam und knapp).
    2. Dateicache freigeben, falls zu wenig RAM frei ist.
    3. Modell mit leerem Prompt vorladen (gleiche Optionen wie der spaetere Aufruf).
    4. Scheitert das mit einem Speicherfehler: alles entladen, Cache leeren, naechste Stufe (weniger GPU-Schichten, zuletzt CPU)
       und sofort erneut, in derselben Anfrage. Der Besucher merkt hoechstens eine etwas laengere Wartezeit.
    Optionen None = Chat-Optionen mit der aktuellen Stufe; Aufrufe ohne GPU (num_gpu 0) entladen nichts.
    Gibt True zurueck, wenn das Modell geladen ist. Bei False folgt der echte Aufruf trotzdem und meldet den Fehler selbst."""
    import asyncio
    import httpx
    global _lade_sperre
    if _lade_sperre is None:
        _lade_sperre = asyncio.Lock()
    eigener = client is None
    c = client or httpx.AsyncClient(timeout=httpx.Timeout(180.0, connect=10.0))
    try:
        async with _lade_sperre:
            for _ in range(len(_STUFEN) + 1):
                opt = dict(optionen) if optionen is not None else chat_optionen()
                await asyncio.to_thread(sicherstellen, 2800)
                if opt.get("num_gpu", 1) != 0:
                    await entladen(c, ausser=modell)
                try:
                    r = await c.post(f"{OLLAMA_URL}/api/generate",
                                     json={"model": modell, "prompt": "", "stream": False, "keep_alive": "5m", "options": opt})
                    text = r.text
                    if r.status_code == 200 and not r.json().get("error"):
                        return True
                except Exception as e:                         # noqa: BLE001
                    text = str(e)
                if optionen is not None or not bei_ladefehler(text):
                    return False                               # feste Optionen oder kein Speicherfehler: nicht weiter absenken
                await entladen(c, nur_gpu=False)               # Speicherfehler: alles raus, Cache leeren, tiefere Stufe
                await asyncio.to_thread(cache_leeren)
            return False
    finally:
        if eigener:
            await c.aclose()
