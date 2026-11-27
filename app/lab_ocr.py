"""Labor "Text auf Papier lesen": Blatt finden und geradeziehen, Textzeilen erkennen, Zeichen lesen, sauber auswerten.

Eingebunden wird das Modul von app/app.py (Schleife ueber lab_*.py) und vom Kamera-Kanal /ws/vision?modus=ocr.
Endpunkt
  GET /api/text-lesen/status   {"bereit": bool, "fehlt": [Dateinamen]} (die Oberflaeche prueft das vor dem Kamerastart)

Ablauf je gelesenem Bild (alles auf der CPU, keine GPU):
  1. Blatt finden (Helligkeit und Kanten, OpenCV) und per Perspektive geradeziehen; sonst das ganze Bild nehmen.
  2. Textzeilen finden: DB-Detektor (PP-OCRv3, Modell aus dem OpenCV Zoo, laeuft in OpenCV).
  3. Zeichen lesen: PP-OCRv5-Erkenner fuer lateinische Schrift (ONNX, laeuft in ONNX Runtime). Sein Zeichenvorrat
     enthaelt ä ö ü Ä Ö Ü ß und das Euro-Zeichen.
  4. Auswerten (app/ocr_regeln.py): Lesereihenfolge, Silbentrennung, Absaetze, Mehrheitsentscheid ueber mehrere Bilder,
     Betraege, Daten, Uhrzeiten, E-Mail, Telefon.
Die Drehung des Blattes (auf dem Kopf, quer) wird einmal je Szene bestimmt: Der Erkenner liest eine Handvoll Zeilen in
beiden Lagen, die sicherere gewinnt.

Modelle (nicht im Repo, scripts/modelle_laden.sh holt sie nach app/models/; Lizenzen auf der Seite /lizenzen):
  text_detection_en_ppocrv3_2023may.onnx    Textzeilen finden (OpenCV Zoo, Apache-2.0, aus PaddleOCR PP-OCRv3)
  ocr_latin_ppocrv5_rec_mobile.onnx         Zeichen lesen, lateinische Schrift (PaddleOCR PP-OCRv5, Apache-2.0, ONNX-Umwandlung)
  ocr_latin_ppocrv5_dict.txt                Zeichenliste dazu
Die Modelle werden erst beim ersten Bild geladen und nach 120 Sekunden ohne Bild wieder freigegeben, damit der Chat den
Speicher behaelt. Die Vor- und Nachverarbeitung (DB-Nachbearbeitung durch OpenCV, CTC-Dekodierung, Zuschnitt) folgt dem
Ablauf von PaddleOCR und ist hier eigenstaendig in NumPy und OpenCV geschrieben.

Es wird nichts gespeichert und nichts geloggt, auch kein gelesener Text: Jedes Bild wird ausgewertet, gezeichnet und
verworfen. Der Zustand je Verbindung (Spuren der Textzeilen) liegt nur im Arbeitsspeicher und endet mit der Verbindung.
"""
import gc
import math
import threading
import time
from pathlib import Path

from app import kamera_modi, ocr_regeln as R

import cv2
import numpy as np
from fastapi import APIRouter

router = APIRouter()

MODELLE = Path(__file__).resolve().parent / "models"
DATEIEN = {
    "det": "text_detection_en_ppocrv3_2023may.onnx",
    "rec": "ocr_latin_ppocrv5_rec_mobile.onnx",
    "woerter": "ocr_latin_ppocrv5_dict.txt",
}
LAENGSTE_KANTE = 960          # Bilder fuer dieses Labor sind groesser als bei den anderen (Schrift braucht Aufloesung)
THREADS = 3                   # Rechenkerne dieser Pipeline (der Jetson hat 6, der Chat soll nicht verhungern)
FREIGABE_NACH_S = 120         # Modelle ohne Bild so lange behalten, dann del + gc
DET_KANTE = 960               # laengste Kante fuer den Zeilenfinder (Vielfaches von 32)
DET_MAX_VERGROESSERN = 1.0    # nie vergroessern: Hochrechnen half im Test nicht und kostete Zeit
REC_HOEHE = 48                # Eingabehoehe des Erkenners
REC_MAX_BREITE = 1536
REC_BATCH = 6
MAX_KAESTEN = 60              # mehr Zeilen liest ein Bild nicht (Rechenzeit)
MIN_KASTEN_HOEHE = 9          # Kaesten, die niedriger sind (Bildpunkte), sind Rauschen
STABIL_NACH_PRUEFEN = 4       # steht der Text, wird nur jedes vierte Bild neu gelesen
AENDERUNG_SCHWELLE = 14.0     # mittlere Helligkeitsaenderung (0 bis 255) der Vorschau, ab der sofort neu gelesen wird
TAKT_RUHE_MS = 600            # Abstand der Bilder, solange der Text steht (die Oberflaeche richtet sich danach)
TAKT_MS = 150
FARBE_SICHER = (118, 185, 0)     # BGR
FARBE_UNSICHER = (0, 170, 255)
FARBE_SEHR = (70, 70, 235)
WIEDERVERWENDEN_BIS = 8.0    # mittlere Grauwert-Abweichung der Zeilen-Miniatur (0 bis 255), bis zu der eine Zeile nicht neu gelesen wird

_sperre = threading.RLock()          # schuetzt die geladenen Modelle gegen das Freigeben
_modelle = None
_letzte_nutzung = 0.0
_waechter = None


# --------------------------------------------------------------------------- Geometrie
def ordne4(p):
    """Vier Punkte als links oben, rechts oben, rechts unten, links unten."""
    p = np.asarray(p, dtype=np.float32).reshape(4, 2)
    s = p.sum(axis=1)
    d = np.diff(p, axis=1).reshape(-1)
    return np.array([p[np.argmin(s)], p[np.argmin(d)], p[np.argmax(s)], p[np.argmax(d)]], dtype=np.float32)


def _laenge(a, b):
    return float(np.linalg.norm(a - b))


def _konvex_und_gross(q, mindest):
    """Prueft ein Viereck: konvex, kein Winkel unter 50 Grad, keine Seite unter `mindest` Bildpunkten."""
    for i in range(4):
        a, b, c = q[i - 1], q[i], q[(i + 1) % 4]
        u, v = a - b, c - b
        n = np.linalg.norm(u) * np.linalg.norm(v)
        if n < 1e-6 or np.degrees(np.arccos(np.clip(np.dot(u, v) / n, -1, 1))) < 50:
            return False
        if np.linalg.norm(u) < mindest:
            return False
    return cv2.isContourConvex(q.astype(np.float32).reshape(-1, 1, 2))


def finde_blatt(bild):
    """Sucht ein helles Blatt (grosses, konvexes Viereck) im Bild. Gibt die vier Ecken (links oben, rechts oben, rechts unten,
    links unten, in Bildpunkten des Eingabebildes) oder None zurueck. Fuellt das Blatt fast das ganze Bild, gibt es kein
    Viereck: Dann wird das Bild unveraendert gelesen."""
    h, w = bild.shape[:2]
    s = 400.0 / max(h, w)
    klein = cv2.resize(bild, None, fx=s, fy=s, interpolation=cv2.INTER_AREA) if s < 1 else bild
    kh, kw = klein.shape[:2]
    grau = cv2.GaussianBlur(cv2.cvtColor(klein, cv2.COLOR_BGR2GRAY), (5, 5), 0)
    flaeche_bild = float(kh * kw)
    masken = []
    _, hell = cv2.threshold(grau, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    masken.append(("hell", cv2.morphologyEx(hell, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))))
    kanten = cv2.Canny(grau, 40, 120)
    kanten = cv2.morphologyEx(cv2.dilate(kanten, np.ones((3, 3), np.uint8)), cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    masken.append(("kanten", kanten))
    beste, beste_flaeche = None, 0.0
    for name, maske in masken:
        konturen, _ = cv2.findContours(maske, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not konturen:
            continue
        k = max(konturen, key=cv2.contourArea)
        flaeche = cv2.contourArea(k)
        if not 0.18 * flaeche_bild <= flaeche <= 0.95 * flaeche_bild:
            continue
        huelle = cv2.convexHull(k)
        umfang = cv2.arcLength(huelle, True)
        poly = cv2.approxPolyDP(huelle, 0.03 * umfang, True)
        if len(poly) == 4:
            q = ordne4(poly.reshape(4, 2))
        else:                                       # keine saubere vier Ecken: Drehrechteck, wenn die Huelle gut hineinpasst
            rechteck = cv2.minAreaRect(huelle)
            if cv2.contourArea(huelle) < 0.9 * rechteck[1][0] * rechteck[1][1]:
                continue
            q = ordne4(cv2.boxPoints(rechteck))
        if not _konvex_und_gross(q, 0.2 * min(kh, kw)):
            continue
        maske_q = np.zeros((kh, kw), np.uint8)
        cv2.fillConvexPoly(maske_q, q.astype(np.int32), 255)
        innen = float(cv2.mean(grau, maske_q)[0])
        aussen = float(cv2.mean(grau, cv2.bitwise_not(maske_q))[0]) if cv2.countNonZero(maske_q) < kh * kw else 0.0
        if innen < 90 or innen < aussen + 8:        # ein Blatt ist heller als die Umgebung
            continue
        fl = cv2.contourArea(q)
        if fl > beste_flaeche:
            beste, beste_flaeche = q, fl
    return None if beste is None else (beste / (s if s < 1 else 1.0)).astype(np.float32)


def entzerre(bild, q, max_kante=1280):
    """Zieht das Viereck q zu einem Rechteck gerade. Die Groesse folgt den Kantenlaengen im Bild (nie hochgerechnet)."""
    breite = int(round(max(_laenge(q[0], q[1]), _laenge(q[3], q[2]))))
    hoehe = int(round(max(_laenge(q[0], q[3]), _laenge(q[1], q[2]))))
    f = min(1.0, max_kante / max(breite, hoehe, 1))
    breite, hoehe = max(32, int(breite * f)), max(32, int(hoehe * f))
    ziel = np.array([[0, 0], [breite - 1, 0], [breite - 1, hoehe - 1], [0, hoehe - 1]], dtype=np.float32)
    m = cv2.getPerspectiveTransform(q.astype(np.float32), ziel)
    return cv2.warpPerspective(bild, m, (breite, hoehe), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


def _ausschnitt(seite, q):
    """Schneidet eine Textzeile (Viereck) gerade aus: Breite und Hoehe aus den Kantenlaengen."""
    q = ordne4(q)
    b = max(2, int(round(max(_laenge(q[0], q[1]), _laenge(q[3], q[2])))))
    h = max(2, int(round(max(_laenge(q[0], q[3]), _laenge(q[1], q[2])))))
    ziel = np.array([[0, 0], [b - 1, 0], [b - 1, h - 1], [0, h - 1]], dtype=np.float32)
    teil = cv2.warpPerspective(seite, cv2.getPerspectiveTransform(q, ziel), (b, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return teil


# --------------------------------------------------------------------------- Modelle
class Modelle:
    """Zeilenfinder und Erkenner. Beide sind nicht threadsicher: Aufrufer halten dafuer _sperre (und app.py den _inferenz_lock)."""

    def __init__(self):
        import onnxruntime as ort
        self.det = cv2.dnn.TextDetectionModel_DB(str(MODELLE / DATEIEN["det"]))
        self.det.setBinaryThreshold(0.3).setPolygonThreshold(0.5).setUnclipRatio(2.0).setMaxCandidates(200)
        so = ort.SessionOptions()
        so.intra_op_num_threads = THREADS
        so.inter_op_num_threads = 1
        so.log_severity_level = 3
        so.enable_cpu_mem_arena = False          # kein Speicherpuffer, der nach dem Freigeben im Prozess bleibt
        so.enable_mem_pattern = False
        self.rec = ort.InferenceSession(str(MODELLE / DATEIEN["rec"]), so, providers=["CPUExecutionProvider"])
        self.rec_eingabe = self.rec.get_inputs()[0].name
        zeichen = (MODELLE / DATEIEN["woerter"]).read_text(encoding="utf-8").split("\n")
        if zeichen and zeichen[-1] == "":
            zeichen = zeichen[:-1]
        self.zeichen = [""] + zeichen + [" "]              # 0 = Leerzeichen der CTC-Entscheidung, am Ende das Wortleerzeichen

    # ---- Zeilen finden
    def zeilen_finden(self, seite):
        """Gibt Vierecke (Nx4x2, Bildpunkte der Seite) in Lesereihenfolge-neutraler Reihenfolge zurueck."""
        h, w = seite.shape[:2]
        s = min(DET_KANTE / max(h, w), DET_MAX_VERGROESSERN)
        breite, hoehe = max(32, int(math.ceil(w * s / 32.0)) * 32), max(32, int(math.ceil(h * s / 32.0)) * 32)
        self.det.setInputParams(1 / 255.0, (breite, hoehe), (122.67891434, 116.66876762, 104.00698793))
        boxen, _ = self.det.detect(seite)
        aus = []
        for b in boxen:
            q = ordne4(np.array(b, dtype=np.float32))
            if min(_laenge(q[0], q[3]), _laenge(q[1], q[2])) < MIN_KASTEN_HOEHE:
                continue
            aus.append(q)
        aus.sort(key=lambda q: (q[:, 1].mean(), q[:, 0].mean()))
        return aus[:MAX_KAESTEN]

    # ---- Zeichen lesen
    def lesen(self, ausschnitte):
        """ausschnitte: Liste von BGR-Bildern (Textzeilen, waagerecht). Gibt je Ausschnitt eine Liste von
        {"t", "s", "a", "b"} (Wort, Sicherheit, Anfang und Ende als Anteil der Breite) zurueck."""
        if not ausschnitte:
            return []
        eingaben = []
        for teil in ausschnitte:
            h, w = teil.shape[:2]
            if h > 1.6 * w:                                   # hochkant stehende Schrift (Blatt quer gehalten)
                teil = cv2.rotate(teil, cv2.ROTATE_90_COUNTERCLOCKWISE)
                h, w = teil.shape[:2]
            nb = int(min(REC_MAX_BREITE, max(REC_HOEHE // 4, math.ceil(REC_HOEHE * w / max(1, h)))))
            eingaben.append(cv2.resize(teil, (nb, REC_HOEHE), interpolation=cv2.INTER_AREA if h > REC_HOEHE else cv2.INTER_CUBIC))
        ergebnis = [None] * len(eingaben)
        reihenfolge = sorted(range(len(eingaben)), key=lambda i: eingaben[i].shape[1])
        for start in range(0, len(reihenfolge), REC_BATCH):
            ids = reihenfolge[start:start + REC_BATCH]
            bmax = max(eingaben[i].shape[1] for i in ids)
            x = np.zeros((len(ids), 3, REC_HOEHE, bmax), np.float32)
            for n, i in enumerate(ids):
                bild = eingaben[i].astype(np.float32).transpose(2, 0, 1) / 255.0
                x[n, :, :, :bild.shape[2]] = (bild - 0.5) / 0.5
            wahrsch = self.rec.run(None, {self.rec_eingabe: x})[0]
            for n, i in enumerate(ids):
                ergebnis[i] = self._dekodiere(wahrsch[n], eingaben[i].shape[1] / float(bmax))
        return ergebnis

    def _dekodiere(self, w, anteil):
        """CTC: je Zeitschritt das wahrscheinlichste Zeichen, Wiederholungen und Leerzeichen der Entscheidung entfernen.
        anteil = genutzter Teil der Zeitachse (der Rest ist Auffuellung)."""
        idx = w.argmax(axis=1)
        konf = w.max(axis=1)
        T = len(idx)
        nutz = max(1.0, T * anteil)
        woerter, aktuell, vorher = [], None, 0
        for t in range(T):
            i = int(idx[t])
            if i != 0 and i != vorher:
                ch = self.zeichen[i] if i < len(self.zeichen) else ""
                if ch == " ":
                    if aktuell and aktuell["z"]:
                        woerter.append(aktuell)
                    aktuell = None
                elif ch:
                    if aktuell is None:
                        aktuell = {"z": [], "k": [], "t0": t, "t1": t}
                    aktuell["z"].append(ch)
                    aktuell["k"].append(float(konf[t]))
                    aktuell["t1"] = t
            elif i != 0 and i == vorher and aktuell is not None and self.zeichen[i] != " ":
                aktuell["k"][-1] = max(aktuell["k"][-1], float(konf[t]))
                aktuell["t1"] = t
            vorher = i
        if aktuell and aktuell["z"]:
            woerter.append(aktuell)
        aus = []
        for wd in woerter:
            k = wd["k"]
            s = 0.6 * (sum(k) / len(k)) + 0.4 * min(k)         # ein einzelnes unsicheres Zeichen zieht das Wort herunter
            n = len(wd["z"])
            abstand = (wd["t1"] - wd["t0"]) / (n - 1) if n > 1 else 2.0          # Zeitschritte je Zeichen: der Spitzenwert liegt in der Zeichenmitte
            aus.append({"t": "".join(wd["z"]), "s": round(float(min(1.0, s)), 3),
                        "a": max(0.0, (wd["t0"] - 0.6 * abstand) / nutz), "b": min(1.0, (wd["t1"] + 0.6 * abstand + 1) / nutz)})
        return aus


def modelle():
    """Die geladenen Modelle (beim ersten Bild geladen); der Wachhund gibt sie nach FREIGABE_NACH_S Sekunden ohne Bild frei."""
    global _modelle, _letzte_nutzung, _waechter
    with _sperre:
        _letzte_nutzung = time.time()
        if _modelle is None:
            _modelle = Modelle()
            if _waechter is None or not _waechter.is_alive():
                _waechter = threading.Thread(target=_wache, daemon=True, name="ocr-wache")
                _waechter.start()
        return _modelle


def freigeben():
    """Gibt die Modelle frei (del + gc). Gibt True zurueck, wenn welche geladen waren."""
    global _modelle
    with _sperre:
        da = _modelle is not None
        _modelle = None
    if da:
        gc.collect()
        try:                                       # dem Betriebssystem den freien Speicher zurueckgeben (Linux, glibc)
            import ctypes
            ctypes.CDLL("libc.so.6").malloc_trim(0)
        except Exception:
            pass
    return da


def _wache():
    while True:
        time.sleep(10)
        with _sperre:
            if _modelle is None:
                return
            if time.time() - _letzte_nutzung > FREIGABE_NACH_S:
                freigeben()
                return


def fehlende_dateien():
    return [d for d in DATEIEN.values() if not (MODELLE / d).is_file()]


# --------------------------------------------------------------------------- Zustand und Pipeline
class Verbindung:
    """Zustand einer Kameraverbindung: Spuren der Textzeilen, Drehung des Blattes, letztes Ergebnis fuer Standbild."""

    def __init__(self):
        self.zaehler = 0
        self.stab = R.Stabilisierer()
        self.drehung = 0              # Vierteldrehungen im Uhrzeigersinn, die das Blatt braucht, damit Text waagerecht steht
        self.drehung_offen = True     # noch nicht bestimmt
        self.eingefroren = False
        self.letztes = None           # (Bild, extra) der letzten Lesung
        self.gelesen = []             # Zeilen der letzten Lesung mit Miniatur, zum Wiederverwenden
        self.vorschau = None          # kleine Graubild-Vorschau der letzten Lesung (Aenderungserkennung)
        self.seit_lesung = 0
        self.lesungen = 0
        self.unsicher_serie = 0

    def zuruecksetzen(self):
        self.stab.neu()
        self.drehung_offen = True
        self.drehung = 0
        self.seit_lesung = 0
        self.unsicher_serie = 0
        self.letztes = None
        self.gelesen = []
        self.vorschau = None


def _vorschau(bild):
    return cv2.resize(cv2.cvtColor(bild, cv2.COLOR_BGR2GRAY), (48, 36), interpolation=cv2.INTER_AREA).astype(np.float32)


def _drehen(bild, k):
    return bild if k % 4 == 0 else cv2.rotate(bild, (cv2.ROTATE_90_CLOCKWISE, cv2.ROTATE_180, cv2.ROTATE_90_COUNTERCLOCKWISE)[k % 4 - 1])


def _mittlere_sicherheit(woerter_listen):
    zeichen = [(len(w["t"]), w["s"]) for ws in woerter_listen for w in ws]
    n = sum(a for a, _ in zeichen)
    return sum(a * s for a, s in zeichen) / n if n else 0.0


def _drehung_bestimmen(m, seite, quads):
    """Bestimmt, wie oft das Blatt im Uhrzeigersinn gedreht werden muss. Liegen die Zeilen eher waagerecht, kommen 0 und
    180 Grad in Frage, sonst 90 und 270. Die wenigen breitesten Zeilen werden in beiden Lagen gelesen, die sicherere gewinnt."""
    if not quads:
        return 0
    quer = sum(1 for q in quads if _laenge(q[0], q[1]) >= _laenge(q[0], q[3]))
    waagerecht = quer >= len(quads) / 2.0
    breite = sorted(quads, key=lambda q: -max(_laenge(q[0], q[1]), _laenge(q[0], q[3])))[:4]
    teile = [_ausschnitt(seite, q) for q in breite]
    if waagerecht:
        varianten = {0: teile, 2: [cv2.rotate(t, cv2.ROTATE_180) for t in teile]}
    else:
        varianten = {1: [cv2.rotate(t, cv2.ROTATE_90_CLOCKWISE) for t in teile],
                     3: [cv2.rotate(t, cv2.ROTATE_90_COUNTERCLOCKWISE) for t in teile]}
    wert = {k: _mittlere_sicherheit(m.lesen(v)) for k, v in varianten.items()}
    return max(wert, key=wert.get)


def _kaesten_lesen(m, seite, quads, v):
    """Liest alle Zeilen einer (gedrehten) Seite. Gibt Kaesten in Bildpunkten zurueck, mit Woertern.
    Eine Zeile, die gegenueber dem letzten Bild unveraendert aussieht (gleiche Stelle, fast gleiche Bildpunkte) und
    sicher gelesen war, wird nicht noch einmal gelesen: gleiche Bildpunkte ergaeben dasselbe Ergebnis, das spart die meiste Rechenzeit."""
    sh, sb = seite.shape[:2]
    teile = [_ausschnitt(seite, q) for q in quads]
    miniaturen = [cv2.resize(cv2.cvtColor(t, cv2.COLOR_BGR2GRAY), (64, 12), interpolation=cv2.INTER_AREA).astype(np.float32) for t in teile]
    boxen = [{"x0": float(q[:, 0].min()) / sb, "y0": float(q[:, 1].min()) / sh, "x1": float(q[:, 0].max()) / sb, "y1": float(q[:, 1].max()) / sh} for q in quads]
    ergebnis = [None] * len(quads)
    for i, b in enumerate(boxen):
        for alt in v.gelesen:
            if alt["kasten"]["s"] >= R.SICHER and R._iou(b, alt["box"]) > 0.6 and float(np.abs(miniaturen[i] - alt["mini"]).mean()) < WIEDERVERWENDEN_BIS:
                ergebnis[i] = alt["kasten"]
                break
    offen = [i for i, e in enumerate(ergebnis) if e is None]
    gelesen = m.lesen([teile[i] for i in offen])
    for i, ws in zip(offen, gelesen):
        ws = [w for w in ws if w["t"]]
        if not ws:
            continue
        zeichen = sum(len(w["t"]) for w in ws)
        ergebnis[i] = {"text": " ".join(w["t"] for w in ws), "woerter": ws, "s": sum(len(w["t"]) * w["s"] for w in ws) / max(1, zeichen)}
    kaesten, v.gelesen = [], []
    for q, b, mini, e in zip(quads, boxen, miniaturen, ergebnis):
        if e is None:
            continue
        kaesten.append({"x0": float(q[:, 0].min()), "y0": float(q[:, 1].min()), "x1": float(q[:, 0].max()), "y1": float(q[:, 1].max()), **e})
        v.gelesen.append({"box": b, "mini": mini, "kasten": e})
    return kaesten, len(offen), len(quads) - len(offen)


def _zeichne(seite, kaesten, eingefroren):
    """Zeichnet je Wort einen Rahmen: Farbe UND Strichstaerke UND Zeichen (? oder ??) zeigen die Sicherheit."""
    for k in kaesten:
        x0, y0, x1, y1 = int(k["x0"]), int(k["y0"]), int(k["x1"]), int(k["y1"])
        for w in k["woerter"]:
            a = x0 + int(w["a"] * (x1 - x0))
            b = x0 + int(w["b"] * (x1 - x0))
            stufe = R.stufe(w["s"])
            farbe, dicke = (FARBE_SICHER, 1) if stufe == "sicher" else (FARBE_UNSICHER, 2) if stufe == "unsicher" else (FARBE_SEHR, 3)
            cv2.rectangle(seite, (a, y0), (max(a + 2, b), y1), farbe, dicke)
            if stufe != "sicher":
                cv2.putText(seite, "?" if stufe == "unsicher" else "??", (a, max(12, y0 - 3)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, farbe, 2, cv2.LINE_AA)
    if eingefroren:
        cv2.rectangle(seite, (0, 0), (seite.shape[1] - 1, seite.shape[0] - 1), (255, 255, 255), 6)


def analysiere(bild, m, v, erzwingen=False):
    """Liest ein BGR-Bild. Gibt (Seitenbild mit Markierungen, ocr-Woerterbuch, Zeiten) zurueck."""
    t0 = time.perf_counter()
    quad = finde_blatt(bild)
    seite = entzerre(bild, quad) if quad is not None else bild.copy()
    t1 = time.perf_counter()
    seite = _drehen(seite, v.drehung)
    quads = m.zeilen_finden(seite)
    if v.drehung_offen and quads:
        k = _drehung_bestimmen(m, seite, quads)
        v.drehung_offen = False
        if k:
            v.drehung = (v.drehung + k) % 4
            v.gelesen = []
            seite = _drehen(seite, k)
            quads = m.zeilen_finden(seite)
    t2 = time.perf_counter()
    roh, neu_gelesen, uebernommen = _kaesten_lesen(m, seite, quads, v)
    t3 = time.perf_counter()
    sh, sb = seite.shape[:2]
    norm = [{**k, "x0": k["x0"] / sb, "x1": k["x1"] / sb, "y0": k["y0"] / sh, "y1": k["y1"] / sh} for k in roh]
    sichtbar, stabil, neue_szene = v.stab.aktualisiere(norm)
    if neue_szene:
        v.drehung_offen = True            # anderes Blatt: Drehung beim naechsten Mal neu bestimmen
        v.gelesen = []
    mittel = _mittlere_sicherheit([k["woerter"] for k in sichtbar])
    v.unsicher_serie = v.unsicher_serie + 1 if (sichtbar and mittel < 0.5) else 0
    if v.unsicher_serie >= 3:
        v.drehung_offen = True            # lange nur Unsicheres: vielleicht steht das Blatt falsch herum
        v.unsicher_serie = 0
    # Karten in Seitenmassen zurueck fuer das Zeichnen
    gez = [{**k, "x0": k["x0"] * sb, "x1": k["x1"] * sb, "y0": k["y0"] * sh, "y1": k["y1"] * sh} for k in sichtbar]
    zeilen = R.zeilen_bauen(R.lesereihenfolge(sichtbar, 1.0))
    t4 = time.perf_counter()
    _zeichne(seite, gez, v.eingefroren)
    woerter = [w for z in zeilen for w in z["woerter"]]
    unsicher = sum(1 for w in woerter if w["s"] < R.SICHER)
    sehr = sum(1 for w in woerter if w["s"] < R.UNSICHER)
    texte = [R.zeilentext(z) for z in zeilen]
    ocr = {
        "text": R.text_aus(zeilen), "fliess": R.fliesstext(zeilen),
        "zeilen": [{"w": [[w["t"], round(w["s"], 2)] for w in z["woerter"]], "a": bool(z["absatz"]), "g": bool(z["getrennt"]), "f": bool(z["weiter"])} for z in zeilen],
        "anzahl": len(zeilen), "woerter": len(woerter), "unsicher": unsicher, "sehr_unsicher": sehr,
        "sicherheit": round(_mittlere_sicherheit([z["woerter"] for z in zeilen]), 3),
        "stabil": bool(stabil), "stabil_seit": v.stab.stabil_seit, "eingefroren": v.eingefroren,
        "blatt": quad is not None, "drehung": v.drehung * 90, "fakten": R.fakten(texte),
        "lesung": v.stab.lesungen, "gelesen": True,
        "ms": {"blatt": round((t1 - t0) * 1000, 1), "zeilen_finden": round((t2 - t1) * 1000, 1), "lesen": round((t3 - t2) * 1000, 1),
               "auswerten": round((t4 - t3) * 1000, 1), "kaesten": len(quads), "gelesen": neu_gelesen, "uebernommen": uebernommen},
    }
    if max(seite.shape[:2]) > LAENGSTE_KANTE:
        f = LAENGSTE_KANTE / max(seite.shape[:2])
        seite = cv2.resize(seite, None, fx=f, fy=f, interpolation=cv2.INTER_AREA)
    return seite, ocr


class _OcrModus:
    """Eintrag im Modus-Register (app/kamera_modi.py): Kanal /ws/vision?modus=ocr."""
    name = "ocr"
    max_kante = LAENGSTE_KANTE
    schwelle_senden = False

    def bereit(self):
        return not fehlende_dateien()

    def neu(self):
        return Verbindung()

    def steuern(self, zustand, d):
        """Steuernachricht der Oberflaeche: {"frieren": true/false} haelt oder gibt das Standbild frei, {"neu": true} liest neu."""
        if zustand is None:
            return
        if isinstance(d.get("frieren"), bool):
            zustand.eingefroren = d["frieren"]
            if zustand.letztes is not None:
                zustand.letztes[1]["eingefroren"] = zustand.eingefroren
        if d.get("neu") is True:
            zustand.eingefroren = False
            zustand.zuruecksetzen()

    def verarbeite(self, img, schwelle, v):
        alt = cv2.getNumThreads()
        cv2.setNumThreads(THREADS)
        global _letzte_nutzung
        try:
            with _sperre:
                _letzte_nutzung = time.time()
                v.zaehler += 1
                if v.eingefroren and v.letztes is not None:
                    return self._wiederholen(img, v, v.letztes[1], TAKT_RUHE_MS)
                vorschau = _vorschau(img)
                aenderung = float(np.abs(vorschau - v.vorschau).mean()) if v.vorschau is not None else 99.0
                ruhig = v.letztes is not None and v.stab.stabil_seit > 0
                if ruhig and aenderung < AENDERUNG_SCHWELLE and v.seit_lesung < STABIL_NACH_PRUEFEN - 1:
                    v.seit_lesung += 1
                    return self._wiederholen(img, v, v.letztes[1], TAKT_RUHE_MS)
                if ruhig and aenderung >= AENDERUNG_SCHWELLE:
                    v.stab.stabil_seit = 0
                m = modelle()
                seite, ocr = analysiere(img, m, v)
                v.vorschau = vorschau
                v.seit_lesung = 0
                v.lesungen += 1
                v.letztes = (seite, ocr)
                ocr["takt_ms"] = TAKT_RUHE_MS if ocr["stabil"] else TAKT_MS
                return self._ausgabe(img, seite, ocr)
        finally:
            cv2.setNumThreads(alt)

    @staticmethod
    def _wiederholen(img, v, ocr, takt):
        """Zwischen zwei Lesungen: das letzte Ergebnis noch einmal zeigen (kostet fast nichts)."""
        ocr = dict(ocr)
        ocr["gelesen"] = False
        ocr["takt_ms"] = takt
        ocr["eingefroren"] = v.eingefroren
        return _OcrModus._ausgabe(img, v.letztes[0], ocr)

    @staticmethod
    def _ausgabe(img, seite, ocr):
        return ocr["anzahl"], {"_bild": seite, "ocr": ocr, "takt_ms": ocr.get("takt_ms", TAKT_MS),
                                "detail_ms": ocr["ms"]}


@router.get("/api/text-lesen/status")
def status():
    fehlt = fehlende_dateien()
    return {"bereit": not fehlt, "fehlt": fehlt}


kamera_modi.registriere(_OcrModus())
