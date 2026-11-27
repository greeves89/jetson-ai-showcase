"""Register der Kamera-Modi fuer /ws/vision.

Jeder Modus (ausser den beiden Urgesteinen "gesicht" und "objekt" in app.py) ist ein Objekt mit
  name                     Kennung, wie sie in ?modus=... steht
  bereit() -> bool         False, solange Modelle fehlen (die Oberflaeche fragt vorher /api/<seite>/status)
  neu() -> Zustand         pro Verbindung ein frischer Zustand (Glaettung, Verfolgung), darf None sein
  verarbeite(img, schwelle, zustand) -> (anzahl, extra)
                           zeichnet in img (BGR, wird danach als JPEG zurueckgeschickt) und liefert die Trefferzahl
                           plus ein Woerterbuch mit Zusatzdaten fuer die Oberflaeche (landet im JSON)
  max_kante                laengste Bildkante vor dem Erkennen (Standard 480; None = unveraendert)
  schwelle_senden          True, wenn die Oberflaeche einen Schwellenregler schickt

Ein Modus meldet sich beim Import seines Moduls mit registriere(...) an. Die Inferenz laeuft unter dem
gemeinsamen Schloss in app.py (_inferenz_lock), ein Modus braucht also kein eigenes.
Datenschutz-Vertrag: Bilder bleiben im Arbeitsspeicher, nichts wird auf die Platte geschrieben oder geloggt.
"""
import threading

MODI = {}
_gemeinsam = {"yunet": None}
_lock = threading.Lock()


def registriere(modus):
    with _lock:
        MODI[modus.name] = modus
    return modus


def setze_gemeinsam(**kw):
    """app.py reicht geteilte Werkzeuge (z. B. den YuNet-Gesichtsfinder) hierher durch."""
    _gemeinsam.update(kw)


def yunet():
    return _gemeinsam["yunet"]


def verkleinern(bild, kante=480):
    """Laengste Kante auf `kante` begrenzen (nur verkleinern)."""
    import cv2
    h, w = bild.shape[:2]
    m = max(h, w)
    if kante and m > kante:
        s = kante / m
        bild = cv2.resize(bild, (max(1, int(w * s)), max(1, int(h * s))), interpolation=cv2.INTER_AREA)
    return bild
