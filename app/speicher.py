"""Speicherhilfen fuer den Jetson (CPU und GPU teilen sich den Arbeitsspeicher).

Problem: GPU-Modelle reservieren ihren Platz aus dem wirklich freien RAM. Der Dateicache grosser Modelldateien
bleibt nach dem Laden stehen und wird bei einer GPU-Reservierung nicht zuverlaessig freigegeben. Folge:
"unable to allocate CUDA0 buffer", obwohl scheinbar genug Speicher "available" ist.

Loesung ohne Root: posix_fadvise(DONTNEED) verwirft die sauberen Cache-Seiten einer Datei. Das darf jeder Benutzer
fuer Dateien, die er lesen kann. Die Dateien bleiben unveraendert und werden beim naechsten Zugriff neu gelesen.

    from app import speicher
    speicher.sicherstellen(2800)      # vor dem Laden eines Modells: Cache freigeben, falls zu wenig frei ist
    speicher.waechter()               # Dauerlaeufer (in einem Thread): haelt genug RAM frei
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
