#!/usr/bin/env python3
"""Gibt den Dateicache grosser Modelldateien frei, ohne Root.

Hintergrund: Auf dem Jetson teilen sich CPU und GPU denselben Arbeitsspeicher. GPU-Modelle reservieren ihren
Platz aus dem wirklich freien RAM. Der Dateicache grosser Modelldateien (Ollama, Whisper, Piper ...) bleibt nach
dem Laden stehen und wird bei einer GPU-Reservierung nicht zuverlaessig freigegeben. Folge: "unable to allocate
CUDA0 buffer", obwohl scheinbar genug "available" ist.

posix_fadvise(DONTNEED) verwirft die sauberen Cache-Seiten einer Datei. Das darf jeder Benutzer fuer Dateien, die er
lesen kann. Die Dateien selbst bleiben unveraendert, sie werden beim naechsten Zugriff neu gelesen.

Aufruf:  python3 scripts/cache_leeren.py [--ruhig]
"""
import os
import sys

WURZELN = [
    os.path.expanduser("~"),
    "/usr/share/ollama/.ollama/models",
    "/usr/local/lib/ollama",
]
MIN_BYTES = 8 * 1024 * 1024
SKIP = ("/proc", "/sys", "/dev")


def frei_mb():
    with open("/proc/meminfo") as f:
        werte = {z.split(":")[0]: int(z.split()[1]) for z in f if ":" in z}
    return werte["MemFree"] // 1024, werte["Cached"] // 1024


def main():
    ruhig = "--ruhig" in sys.argv
    vorher = frei_mb()
    dateien = 0
    for wurzel in WURZELN:
        for ordner, unterordner, namen in os.walk(wurzel, followlinks=False):
            unterordner[:] = [d for d in unterordner if not d.startswith(".cache") or d == ".cache"]
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
    nachher = frei_mb()
    if not ruhig:
        print("Dateien bearbeitet: %d" % dateien)
        print("Frei:   %d MB -> %d MB" % (vorher[0], nachher[0]))
        print("Cache:  %d MB -> %d MB" % (vorher[1], nachher[1]))


if __name__ == "__main__":
    main()
