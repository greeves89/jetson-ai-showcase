"""Labor "Bild schützen": Person freistellen und Gesichter unkenntlich machen.

Eingebunden wird das Modul von app/app.py (Schleife über lab_*.py) und vom Kamera-Kanal /ws/vision?modus=bildschutz.
Endpunkt
  GET /api/bild-schuetzen/status   {"bereit": bool, "fehlt": [Dateinamen]} (die Oberfläche prüft das vor dem Kamerastart)

Zwei Funktionen, ein Kanal. Der Effekt aus der Steuernachricht {"effekt": ...} wählt die Funktion:
  Freistellen   original, unscharf, farbe, muster, maske     (Person gegen Hintergrund, Netz PP-HumanSeg)
  Verpixeln     mosaik, weich, balken                        (Gesichter über YuNet, dem geteilten Gesichtsfinder)
Weitere Steuerwerte, alle gegen feste Listen oder Bereiche geprüft: farbe, muster, kante (0 bis 10), staerke (1 bis 10).

Modell (nicht im Repo, scripts/modelle_laden.sh holt es nach app/models/; Lizenz auf der Seite /lizenzen):
  human_segmentation_pphumanseg_2023mar.onnx    Person oder Hintergrund je Pixel, Eingabe 1x3x192x192, Ausgabe 1x2x192x192
Quelle und Lizenz: OpenCV Zoo (github.com/opencv/opencv_zoo, Apache-2.0), das Modell geht auf PP-HumanSeg aus PaddleHub
(PaddlePaddle, Apache-2.0) zurück. Die Vor- und Nachverarbeitung folgt dem Ablauf von pphumanseg.py im OpenCV Zoo und ist
hier eigenständig in NumPy und OpenCV geschrieben. Die Ausgabe ist schon als Wahrscheinlichkeit normiert (beide Kanäle
summieren sich je Pixel zu 1), Kanal 1 ist "Person". Alle Effekte, Muster, das Verpixeln und die Glättung sind eigener Code.

Speicher: Das Netz wird erst beim ersten Bild des Modus geladen und nach FREIGABE_NACH_S Sekunden ohne Bild wieder
freigegeben (del und gc), damit der Chat den Arbeitsspeicher behält.

Es wird nichts gespeichert: Jedes Bild wird ausgewertet, verändert und verworfen. Dieses Modul schreibt keine Datei und
loggt nichts. Der Zustand je Verbindung (Maske des letzten Bildes, letzte Gesichtsrahmen) liegt nur im Arbeitsspeicher
und endet mit der Verbindung.
"""
import gc
import threading
import time
from pathlib import Path

import cv2
import numpy as np
from fastapi import APIRouter

from app import kamera_modi

router = APIRouter()

MODELLE = Path(__file__).resolve().parent / "models"
SEG_DATEI = "human_segmentation_pphumanseg_2023mar.onnx"
YUNET_DATEI = "face_detection_yunet_2023mar.onnx"
LAENGSTE_KANTE = 480          # Frames werden vor der Auswertung auf diese Kante verkleinert
THREADS = 3                   # Rechenkerne dieser Pipeline (der Jetson hat 6, der Chat soll nicht verhungern)
FREIGABE_NACH_S = 120         # so lange ohne Bild, dann gibt das Labor das Netz wieder frei
SEG_EINGABE = 192             # Kantenlänge, die das Netz erwartet
LANGSAM_MS = 65               # dauert ein Bild länger als das, rechnet der Jetson das Netz im nächsten Bild nicht neu und nutzt die letzte Maske
GLAETTUNG = 0.65              # Gewicht des neuen Bildes bei der zeitlichen Glättung der Maske (0 bis 1; 1 = keine Glättung)
GESICHT_SCHWELLE = 0.6        # YuNet-Schwelle fürs Verpixeln: lieber ein Fehlalarm als ein übersehenes Gesicht (Standard sonst 0,7)
NACHHALTE = 4                 # so viele Bilder bleibt ein Gesichtsrahmen stehen, wenn das Gesicht kurz nicht gefunden wird
MAX_GESICHTER = 12

# feste Listen für alle Steuerwerte der Oberfläche
FREISTELL_EFFEKTE = ("original", "unscharf", "farbe", "muster", "maske")
VERPIXEL_EFFEKTE = ("mosaik", "weich", "balken")
EFFEKTE = FREISTELL_EFFEKTE + VERPIXEL_EFFEKTE
FARBEN = {                     # BGR
    "gruen": (64, 177, 0),     # klassisches Greenscreen-Grün
    "blau": (200, 90, 20),
    "rot": (60, 50, 200),
    "orange": (30, 140, 240),
    "grau": (128, 128, 128),
    "weiss": (245, 245, 245),
    "schwarz": (15, 15, 15),
}
MUSTER = ("verlauf", "karos", "wellen")
# Stärke 1 (fein) bis 10 (grob): so viele Blöcke liegen quer über der Gesichtsbreite
BLOECKE = {1: 40, 2: 30, 3: 24, 4: 18, 5: 14, 6: 10, 7: 8, 8: 6, 9: 5, 10: 4}
STANDARD = {"effekt": "unscharf", "farbe": "gruen", "muster": "verlauf", "kante": 3, "staerke": 5}


# --------------------------------------------------------------------------- reine Bildfunktionen (ohne Modelle testbar)
def erweitere_box(box, breite, hoehe):
    """YuNet-Rahmen sitzt eng am Gesicht (Stirn, Haaransatz und Ohren fehlen). Rahmen vergrößern und auf das Bild begrenzen.
    box = (x, y, w, h); gibt (x1, y1, x2, y2) in ganzen Pixeln zurück, leer (x2 <= x1) gibt es nicht."""
    x, y, w, h = [float(v) for v in box]
    x1, x2 = x - 0.18 * w, x + 1.18 * w
    y1, y2 = y - 0.35 * h, y + 1.15 * h
    x1, y1 = max(0, int(np.floor(x1))), max(0, int(np.floor(y1)))
    x2, y2 = min(breite, int(np.ceil(x2))), min(hoehe, int(np.ceil(y2)))
    return x1, y1, max(x2, x1 + 1), max(y2, y1 + 1)


def mosaik(bild, rahmen, bloecke):
    """Mosaik in `bild` (in place): `bloecke` Kästchen quer über der Rahmenbreite, jedes Kästchen ein Mittelwert."""
    x1, y1, x2, y2 = rahmen
    teil = bild[y1:y2, x1:x2]
    h, w = teil.shape[:2]
    nx = max(1, min(int(bloecke), w))
    kante = w / nx
    ny = max(1, min(int(round(h / kante)), h))
    klein = cv2.resize(teil, (nx, ny), interpolation=cv2.INTER_AREA)
    bild[y1:y2, x1:x2] = cv2.resize(klein, (w, h), interpolation=cv2.INTER_NEAREST)
    return nx, ny


def weichzeichnen(bild, rahmen, bloecke):
    """Gaußscher Weichzeichner im Rahmen (in place). Die Unschärfe ist so gewählt, dass sie ungefähr so viel Detail
    entfernt wie ein Mosaik mit derselben Blockzahl: sigma = Rahmenbreite / Blöcke."""
    x1, y1, x2, y2 = rahmen
    teil = bild[y1:y2, x1:x2]
    sigma = max(1.0, (x2 - x1) / max(1, int(bloecke)))
    bild[y1:y2, x1:x2] = cv2.GaussianBlur(teil, (0, 0), sigma)


def balken(bild, rahmen):
    """Deckender schwarzer Balken über den ganzen Rahmen (in place). Danach steht im Rahmen keine Bildinformation mehr."""
    x1, y1, x2, y2 = rahmen
    bild[y1:y2, x1:x2] = 0


def farbwerte(rahmen, effekt, bloecke):
    """Wie viele verschiedene Farbwerte bleiben im Rahmen übrig? Gezählt aus der Rechnung, nicht geschätzt:
    Mosaik nx mal ny Kästchen, Balken genau einer (alles schwarz), Weichzeichner so viele wie Pixel (er mischt, er zählt nicht ab)."""
    x1, y1, x2, y2 = rahmen
    pixel = (x2 - x1) * (y2 - y1)
    if effekt == "balken":
        return pixel, 1
    if effekt == "mosaik":
        nx = max(1, min(int(bloecke), x2 - x1))
        ny = max(1, min(int(round((y2 - y1) / ((x2 - x1) / nx))), y2 - y1))
        return pixel, nx * ny
    return pixel, pixel


def muster_bild(name, farbe, breite, hoehe):
    """Selbst erzeugter Hintergrund (nichts Fremdes): Verlauf, Karos oder Wellen, aus einer Farbe der festen Liste abgeleitet."""
    f = np.array(farbe, dtype=np.float32)
    hell = np.minimum(f * 1.0 + 90, 255)
    dunkel = f * 0.55
    ys, xs = np.mgrid[0:hoehe, 0:breite].astype(np.float32)
    if name == "karos":
        feld = ((xs // 32).astype(np.int32) + (ys // 32).astype(np.int32)) % 2
        t = feld.astype(np.float32)
    elif name == "wellen":
        t = 0.5 + 0.5 * np.sin(xs / 22.0 + 2.2 * np.sin(ys / 38.0))
    else:                                              # Verlauf, schräg von oben links nach unten rechts
        t = (xs / max(1, breite - 1) + ys / max(1, hoehe - 1)) / 2.0
    bild = dunkel[None, None, :] * (1 - t[..., None]) + hell[None, None, :] * t[..., None]
    return np.clip(bild, 0, 255).astype(np.uint8)


def maske_aufbereiten(wahrscheinlichkeit, kante):
    """Wahrscheinlichkeit Person (0 bis 1, Bildgröße) -> Deckkraft für das Zusammensetzen.
    kante 0: harte Entscheidung bei 0,5 (jeder Pixel Person oder nicht, die Treppen am Rand bleiben sichtbar).
    kante 1 bis 10: Übergang erst steiler gemacht, dann je größer die Zahl, desto stärker weichgezeichnet."""
    p = np.asarray(wahrscheinlichkeit, dtype=np.float32)
    if kante <= 0:
        return (p > 0.5).astype(np.float32)
    m = np.clip((p - 0.5) * 4.0 + 0.5, 0.0, 1.0)
    return np.clip(cv2.GaussianBlur(m, (0, 0), 0.8 * float(kante)), 0.0, 1.0)


def mische(vorn, hinten, deckkraft):
    """vorn * Deckkraft + hinten * (1 - Deckkraft), Pixel für Pixel."""
    a = deckkraft[..., None]
    return np.clip(vorn.astype(np.float32) * a + hinten.astype(np.float32) * (1.0 - a), 0, 255).astype(np.uint8)


# --------------------------------------------------------------------------- Segmentierungsnetz (lazy, mit Freigabe)
_sperre = threading.Lock()
_netz = {"net": None, "zuletzt": 0.0, "wachhund": None}


def _speicher_zurueckgeben():
    """gc und, wo es das gibt (Linux, glibc), malloc_trim: Sonst behält der Prozess den freien Speicher und der Chat sieht nichts davon."""
    gc.collect()
    try:
        import ctypes
        ctypes.CDLL("libc.so.6").malloc_trim(0)
    except Exception:                                  # noqa: BLE001  (macOS, musl: dann bleibt es beim gc)
        pass


def _wachhund():
    """Gibt das Netz frei, wenn FREIGABE_NACH_S Sekunden kein Bild kam. Beendet sich danach selbst."""
    while True:
        time.sleep(5)
        with _sperre:
            if _netz["net"] is None:
                _netz["wachhund"] = None
                return
            if time.monotonic() - _netz["zuletzt"] > FREIGABE_NACH_S:
                _netz["net"] = None
                _netz["wachhund"] = None
                _speicher_zurueckgeben()
                return


def freigeben():
    """Netz sofort freigeben (Tests, Messung)."""
    with _sperre:
        _netz["net"] = None
        _speicher_zurueckgeben()


def geladen():
    with _sperre:
        return _netz["net"] is not None


def segmentiere(bild):
    """Wahrscheinlichkeit Person je Pixel des Eingangsbildes (192x192, float32, 0 bis 1). Lädt das Netz beim ersten Aufruf."""
    with _sperre:
        if _netz["net"] is None:
            _netz["net"] = cv2.dnn.readNet(str(MODELLE / SEG_DATEI))
        _netz["zuletzt"] = time.monotonic()
        if _netz["wachhund"] is None:
            _netz["wachhund"] = threading.Thread(target=_wachhund, name="bildschutz-wachhund", daemon=True)
            _netz["wachhund"].start()
        rgb = cv2.cvtColor(cv2.resize(bild, (SEG_EINGABE, SEG_EINGABE)), cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        _netz["net"].setInput(cv2.dnn.blobFromImage((rgb - 0.5) / 0.5))
        ausgabe = _netz["net"].forward()
    return ausgabe[0, 1]


# --------------------------------------------------------------------------- Zustand je Verbindung
class Verbindung:
    """Alles, was zu einer Kameraverbindung gehört; liegt nur im Arbeitsspeicher."""

    def __init__(self):
        self.effekt = STANDARD["effekt"]
        self.farbe = STANDARD["farbe"]
        self.muster = STANDARD["muster"]
        self.kante = STANDARD["kante"]
        self.staerke = STANDARD["staerke"]
        self.wahrsch = None          # geglättete Wahrscheinlichkeit Person, 192x192
        self.letzte_ms = 0.0         # Gesamtzeit des letzten Freistell-Bildes
        self.ausgelassen = False     # wurde das Netz im letzten Bild ausgelassen?
        self.rahmen = []             # [(x, y, w, h, alter)] zuletzt gefundene Gesichter
        self.muster_cache = (None, None)

    def hintergrund(self, bild):
        """Der Ersatzhintergrund (oder None) für den gewählten Effekt, in Bildgröße."""
        h, w = bild.shape[:2]
        if self.effekt == "unscharf":
            klein = cv2.resize(bild, (max(1, w // 4), max(1, h // 4)), interpolation=cv2.INTER_AREA)      # auf ein Viertel verkleinert ist das Weichzeichnen viel billiger und sieht gleich aus
            return cv2.resize(cv2.GaussianBlur(klein, (0, 0), 2.5), (w, h), interpolation=cv2.INTER_LINEAR)
        if self.effekt == "farbe":
            return np.full((h, w, 3), FARBEN[self.farbe], dtype=np.uint8)
        if self.effekt == "muster":
            schluessel = (self.muster, self.farbe, w, h)
            if self.muster_cache[0] != schluessel:
                self.muster_cache = (schluessel, muster_bild(self.muster, FARBEN[self.farbe], w, h))
            return self.muster_cache[1]
        return None


def _gueltige_zahl(wert, tief, hoch):
    if isinstance(wert, bool) or not isinstance(wert, (int, float)) or wert != wert:
        return None
    return int(max(tief, min(hoch, round(wert))))


def steuere(z, ctl):
    """Übernimmt Werte aus der Steuernachricht, nur wenn sie in der festen Liste oder im erlaubten Bereich liegen."""
    if not isinstance(ctl, dict):
        return
    if isinstance(ctl.get("effekt"), str) and ctl["effekt"] in EFFEKTE:
        z.effekt = ctl["effekt"]
    if isinstance(ctl.get("farbe"), str) and ctl["farbe"] in FARBEN:
        z.farbe = ctl["farbe"]
    if isinstance(ctl.get("muster"), str) and ctl["muster"] in MUSTER:
        z.muster = ctl["muster"]
    k = _gueltige_zahl(ctl.get("kante"), 0, 10)
    if k is not None:
        z.kante = k
    s = _gueltige_zahl(ctl.get("staerke"), 1, 10)
    if s is not None:
        z.staerke = s


# --------------------------------------------------------------------------- Freistellen
def netz_auslassen(z):
    """True, wenn dieses Bild die Maske des letzten Bildes wiederverwendet: nur wenn das letzte Bild langsam war (Last auf dem Jetson)
    und das Netz nicht schon im Bild davor ausgelassen wurde. So fällt die Bildrate unter Last nicht unter die Hälfte."""
    return z.wahrsch is not None and z.letzte_ms > LANGSAM_MS and not z.ausgelassen


def freistellen(bild, z):
    """Person gegen Hintergrund. Gibt (Anteil Person in Prozent, Millisekunden Netz) zurück und verändert `bild` in place."""
    h, w = bild.shape[:2]
    t0 = time.perf_counter()
    z.ausgelassen = netz_auslassen(z)
    if not z.ausgelassen:
        neu = segmentiere(bild)
        if z.wahrsch is None or z.wahrsch.shape != neu.shape:
            z.wahrsch = neu
        else:
            z.wahrsch = GLAETTUNG * neu + (1.0 - GLAETTUNG) * z.wahrsch      # über die Zeit glätten: ruhigere Ränder
    t1 = time.perf_counter()
    gross = cv2.resize(z.wahrsch, (w, h), interpolation=cv2.INTER_LINEAR)
    anteil = float((gross > 0.5).mean() * 100.0)
    if z.effekt == "maske":
        bild[:] = cv2.cvtColor(np.clip(gross * 255.0, 0, 255).astype(np.uint8), cv2.COLOR_GRAY2BGR)
    elif z.effekt != "original":
        hinten = z.hintergrund(bild)
        bild[:] = mische(bild, hinten, maske_aufbereiten(gross, z.kante))
    z.letzte_ms = (time.perf_counter() - t0) * 1000.0
    return anteil, (t1 - t0) * 1000.0


# --------------------------------------------------------------------------- Verpixeln
def _iou(a, b):
    x1, y1 = max(a[0], b[0]), max(a[1], b[1])
    x2, y2 = min(a[0] + a[2], b[0] + b[2]), min(a[1] + a[3], b[1] + b[3])
    schnitt = max(0.0, x2 - x1) * max(0.0, y2 - y1)
    uni = a[2] * a[3] + b[2] * b[3] - schnitt
    return schnitt / uni if uni > 0 else 0.0


def gesichter_finden(bild, yunet):
    """Alle Gesichter, mit der niedrigeren Schwelle fürs Verpixeln: [(x, y, w, h), ...] von links nach rechts."""
    h, w = bild.shape[:2]
    yunet.setInputSize((w, h))
    alt = yunet.getScoreThreshold()
    yunet.setScoreThreshold(GESICHT_SCHWELLE)
    try:
        _, gef = yunet.detect(bild)
    finally:
        yunet.setScoreThreshold(alt)
    if gef is None:
        return []
    kaesten = [tuple(float(v) for v in f[:4]) for f in gef if f[2] > 4 and f[3] > 4]
    kaesten = sorted(kaesten, key=lambda b: -b[2] * b[3])[:MAX_GESICHTER]
    return sorted(kaesten, key=lambda b: b[0])


def rahmen_nachfuehren(alt, neu):
    """Gesichter, die nur ein Bild lang fehlen, würden aufblitzen. Darum bleibt ein gefundener Rahmen NACHHALTE Bilder stehen.
    alt: [(x, y, w, h, alter)], neu: [(x, y, w, h)]. Gibt die Liste [(x, y, w, h, alter)] für das aktuelle Bild zurück (alter 0 = frisch)."""
    aktuell = [(*b, 0) for b in neu]
    for a in alt:
        if a[4] + 1 <= NACHHALTE and not any(_iou(a[:4], b) > 0.3 for b in neu):
            aktuell.append((*a[:4], a[4] + 1))
    return sorted(aktuell, key=lambda b: b[0])[:MAX_GESICHTER * 2]


def verpixeln(bild, z):
    """Alle Gesichter unkenntlich machen. Gibt (Liste der Gesichtsdaten, Millisekunden Suche) zurück, verändert `bild` in place."""
    yn = kamera_modi.yunet()
    h, w = bild.shape[:2]
    t0 = time.perf_counter()
    neu = gesichter_finden(bild, yn)
    z.rahmen = rahmen_nachfuehren(z.rahmen, neu)
    t1 = time.perf_counter()
    bloecke = BLOECKE[z.staerke]
    daten = []
    for i, b in enumerate(z.rahmen):
        r = erweitere_box(b[:4], w, h)
        if z.effekt == "mosaik":
            mosaik(bild, r, bloecke)
        elif z.effekt == "weich":
            weichzeichnen(bild, r, bloecke)
        else:
            balken(bild, r)
        vorher, nachher = farbwerte(r, z.effekt, bloecke)
        daten.append({"nr": i + 1, "breite": int(r[2] - r[0]), "hoehe": int(r[3] - r[1]), "pixel": int(vorher), "werte": int(nachher),
                      "nachgefuehrt": bool(b[4] > 0)})
    return daten, (t1 - t0) * 1000.0


# --------------------------------------------------------------------------- Modus im Register
def fehlend():
    """Dateinamen der Modelle, die auf diesem Rechner fehlen."""
    fehlt = []
    if not (MODELLE / SEG_DATEI).is_file():
        fehlt.append(SEG_DATEI)
    if kamera_modi.yunet() is None:
        fehlt.append(YUNET_DATEI)
    return fehlt


@router.get("/api/bild-schuetzen/status")
def status():
    fehlt = fehlend()
    return {"bereit": not fehlt, "fehlt": fehlt}


class _BildschutzModus:
    """Eintrag im Modus-Register (app/kamera_modi.py): Kanal /ws/vision?modus=bildschutz."""
    name = "bildschutz"
    max_kante = LAENGSTE_KANTE

    def bereit(self):
        return not fehlend()

    def neu(self):
        return Verbindung()

    def steuern(self, zustand, ctl):
        steuere(zustand, ctl)

    def verarbeite(self, img, schwelle, zustand):
        z = zustand if zustand is not None else Verbindung()
        alt = cv2.getNumThreads()
        cv2.setNumThreads(THREADS)
        try:
            extra = {"effekt": z.effekt, "funktion": "freistellen" if z.effekt in FREISTELL_EFFEKTE else "verpixeln"}
            if z.effekt in FREISTELL_EFFEKTE:
                anteil, ms = freistellen(img, z)
                extra.update({"person_prozent": round(anteil), "ms_netz": round(ms, 1), "netz_ausgelassen": bool(z.ausgelassen)})
                return (1 if anteil >= 2.0 else 0), extra
            daten, ms = verpixeln(img, z)
            extra.update({"gesichter": daten, "bloecke": BLOECKE[z.staerke], "ms_suche": round(ms, 1)})
            return len(daten), extra
        finally:
            cv2.setNumThreads(alt)


kamera_modi.registriere(_BildschutzModus())
