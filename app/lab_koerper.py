"""Labor "Körperhaltung": Skelett einer Person im Kamerabild, Gelenkwinkel, Bewegungs-Spiegel, Haltung am Schreibtisch, Pose nachmachen.

Eingebunden wird das Modul von app/app.py (Schleife über lab_*.py) und vom Kamera-Kanal /ws/vision?modus=koerper.
Endpunkt
  GET /api/koerperhaltung/status   {"bereit": bool, "fehlt": [Dateinamen]} (die Oberfläche prüft das vor dem Kamerastart)

Modelle (nicht im Repo, scripts/modelle_laden.sh holt sie nach app/models/; Lizenzen auf der Seite /lizenzen):
  person_detection_mediapipe_2023mar.onnx    findet Personen und liefert zwei Ankerpunkte für die Ausrichtung (Eingabe NCHW 1x3x224x224)
  pose_estimation_mediapipe_2023mar.onnx     33 Körperpunkte plus 6 Hilfspunkte je Person (Eingabe NHWC 1x256x256x3)

Quellen und Lizenz: Beide Modelle stammen aus dem OpenCV Zoo (opencv/opencv_zoo, Apache-2.0) und gehen auf Google MediaPipe
BlazePose (Apache-2.0) zurück. Die Vor- und Nachverarbeitung (Anker, NMS, Ausrichtung der Person über Hüfte und Körpermitte,
Rücktransformation der Punkte) folgt dem Ablauf der Referenzcodes mp_persondet.py und mp_pose.py des OpenCV Zoo (Apache-2.0)
und ist hier eigenständig in NumPy und OpenCV neu geschrieben. Die 2254 Anker werden berechnet statt als Tabelle abgelegt (gegen
die Tabelle des Zoo geprüft). Glättung, Winkel, Übungszähler, Haltungshinweise, Zielposen und Zeichnung sind eigener Code.

Tempo: Die Person wird nur gesucht, wenn keine verfolgt wird, und alle DET_ALLE Bilder, um weitere Personen zu zählen. Dazwischen
folgt der Ausschnitt den Körperpunkten des letzten Bildes (wie in MediaPipe). Die Modelle werden erst beim ersten Bild geladen
und nach FREIGABE_NACH Sekunden ohne Bild wieder freigegeben, damit der Chat den Arbeitsspeicher behält.

Es wird nichts gespeichert: Jedes Bild wird ausgewertet, gezeichnet und verworfen. Der Zustand je Verbindung (Ausschnitt, Glättung,
Zähler, Verlauf der letzten Sekunden) liegt nur im Arbeitsspeicher und endet mit der Verbindung. Es wird nichts geloggt.

Sicherheit: Steuerwerte der Oberfläche werden gegen feste Listen geprüft. Alle Aussagen zur Haltung sind Hinweise aus einfachen
Regeln über 2D-Punkte, keine Diagnose und keine medizinische Aussage.
"""
import gc
import math
import threading
import time
from collections import deque
from pathlib import Path

from app import kamera_modi

import cv2
import numpy as np
from fastapi import APIRouter

router = APIRouter()

MODELLE = Path(__file__).resolve().parent / "models"
DATEIEN = {
    "person": "person_detection_mediapipe_2023mar.onnx",
    "pose": "pose_estimation_mediapipe_2023mar.onnx",
}
THREADS = 3                   # Rechenkerne dieser Pipeline (der Jetson hat 6, der Chat soll nicht verhungern)
PERSON_SCHWELLE = 0.5         # Mindest-Sicherheit des Personenfinders
POSE_SCHWELLE = 0.5           # Mindest-Sicherheit des Pose-Modells, darunter gilt die Person als verloren
SICHT = 0.5                   # Ab dieser "Sichtbarkeit" gilt ein Punkt als gesehen, darunter wird er blass gezeichnet und nicht gewertet
DET_ALLE = 15                 # Personenfinder höchstens jedes 15. Bild, solange eine Person verfolgt wird
ROI_FAKTOR = 1.25             # Ausschnitt um die Person: MediaPipe vergrößert den Kreis um die Körpermitte um 25 Prozent
MELDUNG_HALTEN = 1.8          # Sekunden, die das Ergebnis einer Wiederholung stehen bleibt
FREIGABE_NACH = 120.0         # Sekunden ohne Bild, dann werden die Modelle freigegeben
GLAETTEN = {"min_grenzfreq": 1.2, "beta": 6.0}   # Ein-Euro-Filter (siehe EinEuro), Geschwindigkeit in Körpergrößen pro Sekunde

# Punkte des Modells (BlazePose, 33 Stück): Namen von der Person aus gesehen
NASE, OHR_L, OHR_R = 0, 7, 8
SCH_L, SCH_R, ELL_L, ELL_R, HGK_L, HGK_R = 11, 12, 13, 14, 15, 16
HUE_L, HUE_R, KNI_L, KNI_R, KNO_L, KNO_R = 23, 24, 25, 26, 27, 28
PAARE = [(1, 4), (2, 5), (3, 6), (7, 8), (9, 10), (11, 12), (13, 14), (15, 16), (17, 18), (19, 20), (21, 22), (23, 24),
         (25, 26), (27, 28), (29, 30), (31, 32)]
TAUSCH = np.arange(39)                       # Links und rechts tauschen: Das Bild wird gespiegelt ausgewertet (wie im Spiegel)
for _a, _b in PAARE:
    TAUSCH[_a], TAUSCH[_b] = _b, _a

# Zeichnung: Linien (von, bis, Seite). Seite: 0 Mitte, 1 links, 2 rechts (von der Person aus gesehen, im Spiegelbild)
KNOCHEN = [(SCH_L, SCH_R, 0), (HUE_L, HUE_R, 0), (SCH_L, HUE_L, 1), (SCH_R, HUE_R, 2),
           (SCH_L, ELL_L, 1), (ELL_L, HGK_L, 1), (SCH_R, ELL_R, 2), (ELL_R, HGK_R, 2),
           (HUE_L, KNI_L, 1), (KNI_L, KNO_L, 1), (HUE_R, KNI_R, 2), (KNI_R, KNO_R, 2),
           (KNO_L, 29, 1), (29, 31, 1), (KNO_R, 30, 2), (30, 32, 2),
           (OHR_L, NASE, 1), (OHR_R, NASE, 2)]
PUNKTE_ZEICHNEN = [NASE, OHR_L, OHR_R, SCH_L, SCH_R, ELL_L, ELL_R, HGK_L, HGK_R, HUE_L, HUE_R, KNI_L, KNI_R, KNO_L, KNO_R, 29, 30, 31, 32]
FARBE = {0: (235, 235, 235), 1: (255, 160, 60), 2: (60, 170, 255)}     # BGR: Mitte hell, links blau, rechts orange


# --------------------------------------------------------------------------- Anker des Personenfinders
def _anker():
    """2254 Ankerpunkte (Mitte als Anteil der Kante) des 224-Pixel-Modells: Raster 28x28 mit 2 Ankern, 14x14 mit 2 und 7x7 mit 6
    je Zelle, zeilenweise von oben links. Entspricht der Tabelle des OpenCV Zoo (Abweichung unter 1e-7)."""
    punkte = []
    for kante, je_zelle in ((28, 2), (14, 2), (7, 6)):
        for y in range(kante):
            for x in range(kante):
                punkte.extend([((x + 0.5) / kante, (y + 0.5) / kante)] * je_zelle)
    return np.array(punkte, dtype=np.float64)


ANKER = _anker()


# --------------------------------------------------------------------------- Modelle
class Modelle:
    """Lädt die beiden Netze. Die Netze sind nicht threadsicher: Der Aufrufer hält dafür seine Sperre (_inferenz_lock in app.py)."""

    def __init__(self):
        self.fehlt = fehlende_dateien()
        self.person = self.pose = None
        if not self.fehlt:
            self.person = cv2.dnn.readNet(str(MODELLE / DATEIEN["person"]))
            self.pose = cv2.dnn.readNet(str(MODELLE / DATEIEN["pose"]))
            self.person_aus = self.person.getUnconnectedOutLayersNames()
            self.pose_aus = self.pose.getUnconnectedOutLayersNames()

    @property
    def bereit(self):
        return not self.fehlt

    def personen(self, bild):
        """Liefert Zeilen [x1,y1,x2,y2, Hüftmitte(x,y), Körperpunkt(x,y), Schultermitte(x,y), Oberkörperpunkt(x,y), Sicherheit]
        in Bildpixeln, beste zuerst."""
        h, w = bild.shape[:2]
        faktor = min(224 / h, 224 / w)
        nh, nw = int(h * faktor), int(w * faktor)
        klein = cv2.resize(bild, (nw, nh), interpolation=cv2.INTER_AREA)
        oben, links = (224 - nh) // 2, (224 - nw) // 2
        voll = cv2.copyMakeBorder(klein, oben, 224 - nh - oben, links, 224 - nw - links, cv2.BORDER_CONSTANT, value=(128, 128, 128))
        blob = (cv2.cvtColor(voll, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0 - 0.5) * 2.0
        self.person.setInput(np.transpose(blob, (2, 0, 1))[np.newaxis])
        ausgaben = self.person.forward(self.person_aus)
        deltas = next(o for o in ausgaben if o.shape[-1] > 1)[0]
        roh = next(o for o in ausgaben if o.shape[-1] == 1)[0, :, 0]
        sicher = 1.0 / (1.0 + np.exp(-np.clip(roh.astype(np.float64), -100, 100)))
        gut = np.where(sicher > PERSON_SCHWELLE)[0]
        if len(gut) == 0:
            return np.empty((0, 13))
        d = deltas[gut].astype(np.float64)
        anker = ANKER[gut]
        mass = max(h, w)
        versatz = np.array([links, oben], dtype=np.float64) / faktor
        mitte, halb = d[:, :2] / 224.0, d[:, 2:4] / 224.0 / 2
        kaesten = np.concatenate([mitte - halb + anker, mitte + halb + anker], axis=1) * mass - np.tile(versatz, 2)
        behalten = np.array(cv2.dnn.NMSBoxes([[float(a), float(b), float(c - a), float(e - b)] for a, b, c, e in kaesten],
                                             sicher[gut].tolist(), PERSON_SCHWELLE, 0.3)).reshape(-1)
        if len(behalten) == 0:
            return np.empty((0, 13))
        pts = (d[behalten, 4:].reshape(-1, 4, 2) / 224.0 + anker[behalten][:, None, :]) * mass - versatz
        zeilen = np.c_[kaesten[behalten], pts.reshape(-1, 8), sicher[gut][behalten]]
        return zeilen[np.argsort(-zeilen[:, 12])]

    def koerper(self, bild, huefte, rand):
        """Körperpunkte einer Person. huefte: Hüftmitte, rand: Punkt, der Größe und Neigung festlegt (beide in Bildpixeln).
        Gibt None oder (39 Zeilen [x, y, z, Sichtbarkeit, Anwesenheit] in Bildpixeln, Sicherheit der Person) zurück."""
        huefte = np.asarray(huefte, dtype=np.float64)
        rand = np.asarray(rand, dtype=np.float64)
        radius = float(np.linalg.norm(rand - huefte))
        kante = max(2.0 * radius * ROI_FAKTOR, 16.0)
        # Person aufrecht stellen: Hüftmitte -> Körperpunkt soll nach oben zeigen
        winkel = math.pi / 2 - math.atan2(-(rand[1] - huefte[1]), rand[0] - huefte[0])
        winkel -= 2 * math.pi * math.floor((winkel + math.pi) / (2 * math.pi))
        m = cv2.getRotationMatrix2D((float(huefte[0]), float(huefte[1])), math.degrees(winkel), 256.0 / kante)
        m[:, 2] += (128.0 - huefte[0], 128.0 - huefte[1])
        ausschnitt = cv2.warpAffine(bild, m, (256, 256), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0))
        eingabe = cv2.cvtColor(ausschnitt, cv2.COLOR_BGR2RGB).astype(np.float32)[np.newaxis] / 255.0     # NHWC
        self.pose.setInput(eingabe)
        ausgaben = self.pose.forward(self.pose_aus)
        punkte = next(o for o in ausgaben if o.size == 195).reshape(39, 5).astype(np.float64)
        sicher = float(next(o for o in ausgaben if o.size == 1).reshape(-1)[0])
        if sicher < POSE_SCHWELLE:
            return None
        punkte[:, 3:] = 1.0 / (1.0 + np.exp(-np.clip(punkte[:, 3:], -100, 100)))
        zurueck = cv2.invertAffineTransform(m)
        punkte[:, :2] = punkte[:, :2] @ zurueck[:, :2].T + zurueck[:, 2]
        punkte[:, 2] *= kante / 256.0
        return punkte, sicher


def fehlende_dateien():
    return [d for d in DATEIEN.values() if not (MODELLE / d).is_file()]


# Modelle erst beim ersten Bild laden und nach FREIGABE_NACH Sekunden ohne Bild wieder freigeben.
_modelle = None
_lade_lock = threading.Lock()
_zuletzt = 0.0


def freigeben_wenn_leer():
    """Gibt die Modelle frei, wenn länger als FREIGABE_NACH Sekunden kein Bild kam. True, wenn sie freigegeben wurden."""
    global _modelle
    with _lade_lock:
        if _modelle is not None and time.monotonic() - _zuletzt > FREIGABE_NACH:
            _modelle = None
            gc.collect()
            return True
    return False


def _waechter():
    while geladen():
        time.sleep(10)
        if freigeben_wenn_leer():
            return


def modelle():
    """Die geladenen Modelle (beim ersten Aufruf geladen). Fehlen Dateien, ist .bereit falsch und nichts wird geladen."""
    global _modelle, _zuletzt
    with _lade_lock:
        _zuletzt = time.monotonic()
        if _modelle is None:
            _modelle = Modelle()
            if _modelle.bereit:
                threading.Thread(target=_waechter, name="koerper-waechter", daemon=True).start()
        return _modelle


def geladen():
    return _modelle is not None


# --------------------------------------------------------------------------- Glättung
class EinEuro:
    """Ein-Euro-Filter für ein ganzes Punktfeld: ruhig bei langsamer Bewegung, schnell bei schneller. Die Geschwindigkeit wird in
    Körpergrößen pro Sekunde gemessen, damit Nähe und Ferne zur Kamera keine Rolle spielen."""

    def __init__(self, min_grenzfreq=1.2, beta=6.0, ableitung=1.0):
        self.mg, self.beta, self.ab = min_grenzfreq, beta, ableitung
        self.x = None
        self.dx = None
        self.t = None

    @staticmethod
    def _alpha(grenzfreq, dt):
        tau = 1.0 / (2 * math.pi * grenzfreq)
        return 1.0 / (1.0 + tau / dt)

    def __call__(self, x, t, skala):
        if self.x is None:
            self.x, self.dx, self.t = x.copy(), np.zeros_like(x), t
            return self.x
        dt = min(max(t - self.t, 1 / 60), 0.5)
        self.t = t
        d = (x - self.x) / dt / max(skala, 1.0)
        a_d = self._alpha(self.ab, dt)
        self.dx = a_d * d + (1 - a_d) * self.dx
        grenz = self.mg + self.beta * np.linalg.norm(self.dx, axis=-1, keepdims=True)
        a = 1.0 / (1.0 + (1.0 / (2 * math.pi * grenz)) / dt)
        self.x = a * x + (1 - a) * self.x
        return self.x


# --------------------------------------------------------------------------- Winkel und Maße (nur Regeln, kein Lernen)
def winkel_grad(a, b, c):
    """Winkel bei b zwischen den Strecken b-a und b-c in Grad (180 = gestreckt)."""
    u, v = np.asarray(a, dtype=float) - b, np.asarray(c, dtype=float) - b
    nenner = np.linalg.norm(u) * np.linalg.norm(v)
    if nenner < 1e-6:
        return 0.0
    return float(np.degrees(np.arccos(np.clip(np.dot(u, v) / nenner, -1.0, 1.0))))


def _alle(sicht, *idx):
    return all(sicht[i] >= SICHT for i in idx)


def _w(P, S, a, b, c):
    return round(winkel_grad(P[a], P[b], P[c])) if _alle(S, a, b, c) else None


def richtung_grad(von, nach):
    """Richtung einer Strecke in Grad gegen die Senkrechte nach oben: 0 = nach oben, 90 = nach rechts im Bild, -90 = nach links."""
    d = np.asarray(nach, dtype=float) - von
    return float(np.degrees(np.arctan2(d[0], -d[1])))


def ansicht_aus(P, S):
    """Von vorn, schräg oder von der Seite? Schulterbreite im Verhältnis zur Rumpflänge (Schulter bis Hüfte); ohne Hüften im Verhältnis
    zum Abstand Schulter zu Ohr. Grobe Faustregeln dieser Seite, keine Messwerte aus einer Studie."""
    if not _alle(S, SCH_L, SCH_R):
        return None
    breite = float(np.linalg.norm(P[SCH_L] - P[SCH_R]))
    if _alle(S, HUE_L, HUE_R):
        rumpf = float(np.linalg.norm((P[SCH_L] + P[SCH_R]) / 2 - (P[HUE_L] + P[HUE_R]) / 2))
        if rumpf < 1e-6:
            return None
        r = breite / rumpf
        return "vorn" if r >= 0.55 else "seite" if r <= 0.3 else "schraeg"
    ohren = [i for i in (OHR_L, OHR_R) if S[i] >= SICHT]
    if not ohren:
        return None
    hoehe = float(np.mean([np.linalg.norm(P[i] - (P[SCH_L] + P[SCH_R]) / 2) for i in ohren]))
    if hoehe < 1e-6:
        return None
    r = breite / hoehe
    return "vorn" if r >= 1.8 else "seite" if r <= 1.0 else "schraeg"


def messwerte(P, S):
    """Alle Winkel und Maße aus 33 Punkten P (33x2, Bildpixel, y nach unten) und ihrer Sichtbarkeit S. None, wenn ein Punkt fehlt.
    Seiten sind von der Person aus gesehen (im Spiegelbild: links im Bild = linke Körperseite)."""
    m = {
        "ellbogen_l": _w(P, S, SCH_L, ELL_L, HGK_L), "ellbogen_r": _w(P, S, SCH_R, ELL_R, HGK_R),
        "knie_l": _w(P, S, HUE_L, KNI_L, KNO_L), "knie_r": _w(P, S, HUE_R, KNI_R, KNO_R),
        "huefte_l": _w(P, S, SCH_L, HUE_L, KNI_L), "huefte_r": _w(P, S, SCH_R, HUE_R, KNI_R),
        "arm_l": _w(P, S, HUE_L, SCH_L, ELL_L), "arm_r": _w(P, S, HUE_R, SCH_R, ELL_R),
        "ansicht": ansicht_aus(P, S),
        "rumpf_seitlich": None, "schulter_schief": None, "kopf_vor": None, "kopf_seite": None,
    }
    if _alle(S, SCH_L, SCH_R, HUE_L, HUE_R):
        # Neigung des Rumpfes von der Senkrechten, positiv: Schultern liegen im Bild rechts von den Hüften
        m["rumpf_seitlich"] = round(richtung_grad((P[HUE_L] + P[HUE_R]) / 2, (P[SCH_L] + P[SCH_R]) / 2), 1)
    if _alle(S, SCH_L, SCH_R):
        d = P[SCH_R] - P[SCH_L]                 # positiv: linke Schulter höher (y nach unten, linke Schulter links im Bild)
        m["schulter_schief"] = round(float(np.degrees(np.arctan2(d[1], abs(d[0]) + 1e-6))), 1)
    # Kopf vor den Schultern: nur aus der Seite sinnvoll (Ohr, Schulter derselben Seite, Blickrichtung aus der Nase)
    ohr = [i for i in (OHR_L, OHR_R) if S[i] >= SICHT]
    if ohr and S[NASE] >= SICHT:
        o = max(ohr, key=lambda i: S[i])
        sch = SCH_L if o == OHR_L else SCH_R
        if S[sch] >= SICHT:
            blick = 1.0 if P[NASE][0] >= P[o][0] else -1.0
            m["kopf_vor"] = round(float(np.degrees(np.arctan2(blick * (P[o][0] - P[sch][0]), P[sch][1] - P[o][1]))), 1)
    if _alle(S, OHR_L, OHR_R):
        d = P[OHR_R] - P[OHR_L]
        m["kopf_seite"] = round(float(np.degrees(np.arctan2(d[1], abs(d[0]) + 1e-6))), 1)
    return m


def _mittel(*werte):
    w = [x for x in werte if x is not None]
    return sum(w) / len(w) if w else None


# --------------------------------------------------------------------------- Bewegungs-Spiegel: Übungen mit Zähler
class Uebung:
    """Basis: schritt(m) -> Rückmeldung (Text). Der Zähler steht in self.zaehler, die Phase in self.phase."""
    name = ""
    titel = ""
    hinweis_ansicht = None          # "seite" oder "vorn": aus welcher Ansicht die Übung sinnvoll ist

    def __init__(self):
        self.zaehler = 0
        self.phase = "bereit"
        self.rueckmeldung = ""
        self.fest_bis = 0.0

    def _melde(self, text):
        """Ergebnis einer Wiederholung: bleibt kurz stehen, damit man es lesen kann."""
        self.rueckmeldung = text
        self.fest_bis = time.monotonic() + MELDUNG_HALTEN

    def _info(self, text):
        """Laufender Hinweis: ersetzt keine Ergebnismeldung, die noch steht."""
        if time.monotonic() >= self.fest_bis:
            self.rueckmeldung = text

    def pruefe_ansicht(self, m):
        a = m.get("ansicht")
        if self.hinweis_ansicht == "seite" and a == "vorn":
            return "Dreh dich seitlich zur Kamera, sonst sieht man die Beugung kaum."
        if self.hinweis_ansicht == "vorn" and a == "seite":
            return "Dreh dich mit dem Gesicht zur Kamera."
        return None

    def zustand(self):
        return {"name": self.name, "titel": self.titel, "zaehler": self.zaehler, "phase": self.phase, "rueckmeldung": self.rueckmeldung}


class Kniebeuge(Uebung):
    """Zählt über den mittleren Kniewinkel mit Hysterese: Eine Wiederholung zählt, wenn das Knie unter UNTEN kommt und danach
    wieder über OBEN. Dazwischen wird nichts gezählt (Ruckeln an einer einzigen Schwelle ergäbe Fehlzähler)."""
    name, titel, hinweis_ansicht = "kniebeuge", "Kniebeuge", "seite"
    OBEN, UNTEN, START = 160, 110, 150

    def __init__(self):
        super().__init__()
        self.tief = 180.0

    def schritt(self, m):
        k = _mittel(m.get("knie_l"), m.get("knie_r"))
        if k is None:
            self._info("Stell dich so hin, dass man deine Beine ganz sieht.")
            return self.rueckmeldung
        if self.phase in ("bereit", "oben"):
            self.phase = "oben"
            self._info(self.pruefe_ansicht(m) or "Geh langsam in die Knie.")
            if k < self.START:
                self.phase, self.tief = "runter", k
        if self.phase in ("runter", "unten", "hoch"):
            self.tief = min(self.tief, k)
            if k <= self.UNTEN:
                self.phase = "unten"
                self._info("Gut. Jetzt wieder aufrichten.")
            elif self.phase == "unten" and k > self.UNTEN + 10:
                self.phase = "hoch"
                self._info("Richte dich ganz auf.")
            elif self.phase == "runter":
                self._info("Noch ein Stück tiefer.")
            if k >= self.OBEN:
                if self.tief <= self.UNTEN:
                    self.zaehler += 1
                    self._melde("Gezählt. Weiter so.")
                else:
                    self._melde("Knie weiter beugen, dann zählt es.")
                self.phase, self.tief = "oben", 180.0
        return self.rueckmeldung


class ArmeHeben(Uebung):
    """Zählt über den mittleren Armwinkel am Schulter (Hüfte, Schulter, Ellbogen): unten unter UNTEN, oben über OBEN."""
    name, titel, hinweis_ansicht = "arme-heben", "Arme heben", "vorn"
    OBEN, UNTEN, START = 140, 35, 60

    def __init__(self):
        super().__init__()
        self.hoch = 0.0

    def schritt(self, m):
        a = _mittel(m.get("arm_l"), m.get("arm_r"))
        if a is None:
            self._info("Stell dich so hin, dass man deine Arme und Hüften sieht.")
            return self.rueckmeldung
        if self.phase in ("bereit", "unten_ruhe"):
            self.phase = "unten_ruhe"
            self._info(self.pruefe_ansicht(m) or "Hebe beide Arme über den Kopf.")
            if a > self.START:
                self.phase, self.hoch = "rauf", a
        if self.phase in ("rauf", "oben", "runter"):
            self.hoch = max(self.hoch, a)
            if a >= self.OBEN:
                self.phase = "oben"
                streck = _mittel(m.get("ellbogen_l"), m.get("ellbogen_r"))
                links, rechts = m.get("arm_l"), m.get("arm_r")
                if links is not None and rechts is not None and abs(links - rechts) > 25:
                    self._info("Hebe beide Arme gleich hoch.")
                elif streck is not None and streck < 150:
                    self._info("Strecke die Arme durch.")
                else:
                    self._info("Oben. Jetzt langsam senken.")
            elif self.phase == "oben" and a < self.OBEN - 15:
                self.phase = "runter"
            elif self.phase == "rauf":
                self._info("Weiter nach oben.")
            if a <= self.UNTEN:
                if self.hoch >= self.OBEN:
                    self.zaehler += 1
                    self._melde("Gezählt. Weiter so.")
                else:
                    self._melde("Hebe die Arme höher, dann zählt es.")
                self.phase, self.hoch = "unten_ruhe", 0.0
        return self.rueckmeldung


class Armkreisen(Uebung):
    """Zählt volle Kreise der Handgelenke um die Schultern: Die Drehwinkel werden aufaddiert, 330 Grad zählen als ein Kreis."""
    name, titel, hinweis_ansicht = "armkreisen", "Arme kreisen", "vorn"
    KREIS = 330.0

    def __init__(self):
        super().__init__()
        self.letzt = {}
        self.summe = {"l": 0.0, "r": 0.0}
        self.gezaehlt = 0

    def schritt(self, m, P=None, S=None):
        if P is None:
            self._info("Stell dich so hin, dass man deine Arme sieht.")
            return self.rueckmeldung
        bewegt = False
        lang = []
        for seite, sch, ell, hgk in (("l", SCH_L, ELL_L, HGK_L), ("r", SCH_R, ELL_R, HGK_R)):
            if not _alle(S, sch, ell, hgk):
                self.letzt.pop(seite, None)
                continue
            arm = float(np.linalg.norm(P[ell] - P[sch]) + np.linalg.norm(P[hgk] - P[ell]))
            d = P[hgk] - P[sch]
            if arm < 1e-6 or np.linalg.norm(d) < 0.5 * arm:
                self.letzt.pop(seite, None)          # Hand nah am Körper: Der Winkel um die Schulter ist dann unzuverlässig
                continue
            lang.append(np.linalg.norm(d) / arm)
            w = math.degrees(math.atan2(d[1], d[0]))
            if seite in self.letzt:
                dw = (w - self.letzt[seite] + 180.0) % 360.0 - 180.0
                self.summe[seite] += dw
                bewegt = bewegt or abs(dw) > 2.0
            self.letzt[seite] = w
        voll = int(max(abs(self.summe["l"]), abs(self.summe["r"])) // self.KREIS)
        if voll > self.gezaehlt:
            self.zaehler += voll - self.gezaehlt
            self.gezaehlt = voll
        self.phase = "kreisen" if bewegt else "bereit"
        streck = _mittel(m.get("ellbogen_l"), m.get("ellbogen_r"))
        if not lang:
            self._info("Strecke die Arme zur Seite aus und beginne zu kreisen.")
        elif streck is not None and streck < 150:
            self._info("Strecke die Arme durch, dann werden die Kreise größer.")
        elif bewegt:
            self._info("Schön gleichmäßig.")
        else:
            self._info("Kreise mit beiden Armen.")
        return self.rueckmeldung


class Seitneigung(Uebung):
    """Zählt Neigungen des Oberkörpers zur Seite: Über NEIGEN Grad gilt als geneigt, unter RUHE Grad als wieder aufrecht."""
    name, titel, hinweis_ansicht = "seitneigung", "Seitneigung", "vorn"
    NEIGEN, RUHE = 15.0, 6.0

    def __init__(self):
        super().__init__()
        self.seiten = {"links": 0, "rechts": 0}
        self.spitze = 0.0

    def schritt(self, m):
        a = m.get("rumpf_seitlich")
        if a is None:
            self._info("Stell dich so hin, dass man Schultern und Hüften sieht.")
            return self.rueckmeldung
        if self.phase in ("bereit", "aufrecht"):
            self.phase = "aufrecht"
            self._info(self.pruefe_ansicht(m) or "Neige den Oberkörper langsam zur Seite.")
            if abs(a) > self.RUHE:
                self.phase, self.spitze = "neigen", a
        if self.phase in ("neigen", "geneigt"):
            if abs(a) > abs(self.spitze):
                self.spitze = a
            if abs(a) >= self.NEIGEN:
                self.phase = "geneigt"
                self._info("Gut. Jetzt wieder aufrichten.")
            elif self.phase == "neigen":
                self._info("Noch ein Stück zur Seite.")
            if abs(a) <= self.RUHE:
                if abs(self.spitze) >= self.NEIGEN:
                    # Schultern rechts von den Hüften im Bild: Die Person neigt sich zur rechten Körperseite (Spiegelbild)
                    seite = "rechts" if self.spitze > 0 else "links"
                    self.seiten[seite] += 1
                    self.zaehler += 1
                    self._melde("Gezählt. Jetzt zur anderen Seite.")
                else:
                    self._melde("Neige dich weiter zur Seite, dann zählt es.")
                self.phase, self.spitze = "aufrecht", 0.0
        return self.rueckmeldung

    def zustand(self):
        z = super().zustand()
        z["seiten"] = dict(self.seiten)
        return z


UEBUNGEN = {c.name: c for c in (Kniebeuge, ArmeHeben, Armkreisen, Seitneigung)}


# --------------------------------------------------------------------------- Haltung am Schreibtisch
def haltung_hinweise(med):
    """Freundliche Hinweise aus dem Mittel der letzten Bilder (med: Wörterbuch wie messwerte, schon gemittelt). Keine Diagnose.
    Gibt eine Liste von {"id", "text"} zurück. Die Schwellen sind grobe Faustregeln dieser Seite, keine Werte aus einer Studie."""
    a = med.get("ansicht")
    aus = []
    if a is None:
        return [{"id": "sicht", "text": "Ich sehe deine Schultern noch nicht. Setz dich so, dass Kopf und Schultern im Bild sind."}]
    if a == "schraeg":
        return [{"id": "schraeg", "text": "Du sitzt schräg zur Kamera. Dreh dich ganz zur Kamera oder ganz zur Seite, dann wird die Schätzung besser."}]
    if a == "vorn":
        s = med.get("schulter_schief")
        if s is not None and abs(s) >= 4.0:
            aus.append({"id": "schulter", "text": ("Deine linke" if s > 0 else "Deine rechte") + " Schulter steht im Bild etwas höher. Lass beide Schultern locker sinken."})
        r = med.get("rumpf_seitlich")
        if r is not None and abs(r) >= 6.0:
            aus.append({"id": "rumpf", "text": "Dein Oberkörper neigt sich zur " + ("rechten" if r > 0 else "linken") + " Seite."})
        k = med.get("kopf_seite")
        if k is not None and abs(k) >= 6.0:
            aus.append({"id": "kopf", "text": "Dein Kopf ist zur Seite geneigt."})
        aus.append({"id": "vorn-info", "text": "Von vorn lässt sich nicht sagen, ob dein Kopf vor den Schultern steht. Dreh dich dafür seitlich zur Kamera."})
        if len(aus) == 1:
            aus.insert(0, {"id": "gut", "text": "Von vorn sieht deine Haltung im Bild ausgeglichen aus."})
    else:
        v = med.get("kopf_vor")
        if v is None:
            aus.append({"id": "kopf-fehlt", "text": "Ich sehe Ohr und Schulter nicht gut genug. Dreh dich so, dass eine Seite zur Kamera zeigt."})
        elif v >= 35:
            aus.append({"id": "kopf-vor", "text": "Dein Kopf steht deutlich vor den Schultern. Zieh das Kinn leicht zurück, wenn es sich gut anfühlt."})
        elif v >= 20:
            aus.append({"id": "kopf-vor", "text": "Dein Kopf steht etwas vor den Schultern. Richte dich ein Stück auf, wenn es sich gut anfühlt."})
        else:
            aus.append({"id": "gut", "text": "Von der Seite steht dein Kopf im Bild ungefähr über den Schultern."})
        rumpf = med.get("rumpf_seitlich")
        if rumpf is not None and abs(rumpf) >= 25:
            aus.append({"id": "rumpf-seite", "text": "Dein Oberkörper ist im Bild stark geneigt."})
    return aus


def mittelwerte(verlauf):
    """Mittelt die Zahlenwerte der letzten Bilder (None zählt nicht mit); die Ansicht gilt, wenn sie in den meisten Bildern gleich war."""
    aus = {}
    for k in ("schulter_schief", "rumpf_seitlich", "kopf_vor", "kopf_seite"):
        w = sorted(x[k] for x in verlauf if x.get(k) is not None)
        aus[k] = w[len(w) // 2] if len(w) >= max(3, len(verlauf) // 3) else None       # Median: einzelne Ausreißer zählen nicht
    ansichten = [x.get("ansicht") for x in verlauf]
    haeufig = max(set(ansichten), key=ansichten.count) if ansichten else None
    aus["ansicht"] = haeufig if ansichten.count(haeufig) >= len(ansichten) * 0.6 else "schraeg"
    return aus


# --------------------------------------------------------------------------- Pose nachmachen
# Zielposen als Richtungen der acht Gliedmaßen-Stücke im Spiegelbild (x nach rechts, y nach unten), von der Person aus gesehen:
# "links" ist die linke Körperseite, im Spiegelbild also links im Bild.
GLIEDER = [("Oberarm links", SCH_L, ELL_L), ("Unterarm links", ELL_L, HGK_L), ("Oberarm rechts", SCH_R, ELL_R), ("Unterarm rechts", ELL_R, HGK_R),
           ("Oberschenkel links", HUE_L, KNI_L), ("Unterschenkel links", KNI_L, KNO_L), ("Oberschenkel rechts", HUE_R, KNI_R), ("Unterschenkel rechts", KNI_R, KNO_R)]


def _spiegel(rv):
    return {n.replace("links", "#").replace("rechts", "links").replace("#", "rechts"): (-v[0], v[1]) for n, v in rv.items()}


_STEHEN = {"Oberschenkel links": (-0.08, 1.0), "Unterschenkel links": (-0.04, 1.0),
           "Oberschenkel rechts": (0.08, 1.0), "Unterschenkel rechts": (0.04, 1.0)}
ZIELE = {
    "haende-hoch": {"titel": "Hände hoch", "hinweis": "Beide Arme senkrecht nach oben, leicht nach außen.",
                    "richtungen": {"Oberarm links": (-0.35, -0.94), "Unterarm links": (-0.25, -0.97),
                                   "Oberarm rechts": (0.35, -0.94), "Unterarm rechts": (0.25, -0.97), **_STEHEN}},
    "t-pose": {"titel": "T-Pose", "hinweis": "Beide Arme waagerecht zur Seite, die Beine gerade.",
               "richtungen": {"Oberarm links": (-1.0, 0.0), "Unterarm links": (-1.0, 0.0),
                              "Oberarm rechts": (1.0, 0.0), "Unterarm rechts": (1.0, 0.0), **_STEHEN}},
    "baum": {"titel": "Baum", "hinweis": "Auf einem Bein stehen, die Fußsohle des anderen Beins an das Knie, die Arme nach oben. Egal, welches Bein.",
             "richtungen": {"Oberarm links": (-0.35, -0.94), "Unterarm links": (-0.25, -0.97),
                            "Oberarm rechts": (0.35, -0.94), "Unterarm rechts": (0.25, -0.97),
                            "Oberschenkel links": (-0.03, 1.0), "Unterschenkel links": (-0.03, 1.0),
                            "Oberschenkel rechts": (0.75, 0.66), "Unterschenkel rechts": (-0.85, 0.52)}},
}
GESPIEGELT_OK = {"haende-hoch", "t-pose", "baum"}      # Ein Bein oder eine Seite vertauscht zählt auch (spiegelsymmetrisch bewertet)
SCHRITT_TOLERANZ = 45.0                                # Ab dieser Abweichung zählt ein Stück 0 Prozent
STUECK_OK = 25.0                                       # Bis zu dieser Abweichung gilt ein Stück als getroffen
SCHAFFEN_AB, SCHAFFEN_HALTEN, FREI_UNTER = 80, 1.2, 60  # Prozent, Sekunden, Prozent (Hysterese)


def _grad_abstand(a, b):
    return abs((a - b + 180.0) % 360.0 - 180.0)


def aehnlichkeit(P, S, ziel):
    """Vergleicht die Richtung jedes Gliedmaßen-Stücks mit der Zielpose. Gibt (Prozent oder None, Liste {"name","ok","sichtbar"})
    zurück. Ein Stück zählt voll bei 0 Grad Abweichung und gar nicht ab SCHRITT_TOLERANZ Grad; die Zahl ist der Mittelwert der
    sichtbaren Stücke. Weniger als sechs sichtbare Stücke: keine Zahl. Zielpose auch seitenvertauscht bewertet (das bessere zählt)."""
    richt = ZIELE[ziel]["richtungen"]
    best = None
    for variante in (richt, _spiegel(richt)):
        teile, summe, n = [], 0.0, 0
        for name, a, b in GLIEDER:
            if not _alle(S, a, b):
                teile.append({"name": name, "ok": False, "sichtbar": False})
                continue
            soll = math.degrees(math.atan2(variante[name][0], -variante[name][1]))
            ist = richtung_grad(P[a], P[b])
            abw = _grad_abstand(soll, ist)
            summe += max(0.0, 1.0 - abw / SCHRITT_TOLERANZ)
            n += 1
            teile.append({"name": name, "ok": abw <= STUECK_OK, "sichtbar": True})
        wert = round(100.0 * summe / n) if n >= 6 else None
        if best is None or (wert is not None and (best[0] is None or wert > best[0])):
            best = (wert, teile, variante)
    return best[0], best[1], best[2]


def umriss(P, S, richtungen):
    """Punkte der Zielpose als Umriss, an Hüftmitte und Rumpflänge der Person ausgerichtet. Gibt {Index: (x, y)} zurück."""
    if not _alle(S, SCH_L, SCH_R, HUE_L, HUE_R):
        return {}
    hm = (P[HUE_L] + P[HUE_R]) / 2
    sm = (P[SCH_L] + P[SCH_R]) / 2
    t = float(np.linalg.norm(sm - hm))
    if t < 4:
        return {}
    pts = {HUE_L: hm + (-0.2 * t, 0), HUE_R: hm + (0.2 * t, 0), SCH_L: hm + (-0.42 * t, -t), SCH_R: hm + (0.42 * t, -t)}
    laengen = {"Oberarm": 0.62, "Unterarm": 0.55, "Oberschenkel": 0.95, "Unterschenkel": 0.9}
    for name, a, b in GLIEDER:
        v = np.array(richtungen[name], dtype=float)
        v /= np.linalg.norm(v)
        pts[b] = pts[a] + v * t * laengen[name.split()[0]]
    pts[NASE] = hm + (0, -1.55 * t)
    return pts


class Nachmachen:
    """Zustand der Zielpose je Verbindung: Prozent, Halten, Zähler der geschafften Posen."""

    def __init__(self):
        self.seit = None
        self.geschafft = 0
        self.frei = True
        self.zeigt = False

    def schritt(self, wert, jetzt):
        if wert is None or wert < FREI_UNTER:
            self.seit, self.frei, self.zeigt = None, True, False
            return
        if wert >= SCHAFFEN_AB:
            if self.seit is None:
                self.seit = jetzt
            if self.frei and jetzt - self.seit >= SCHAFFEN_HALTEN:
                self.geschafft += 1
                self.frei = False
        else:
            self.seit = None
        self.zeigt = not self.frei


# --------------------------------------------------------------------------- Zeichnung
def _p(P, i):
    return int(round(P[i][0])), int(round(P[i][1]))


def zeichne(bild, P, S, m):
    """Skelett in das Bild zeichnen: Punkte unter SICHT blass (blass = unsicher), Gelenkwinkel an Ellbogen und Knien."""
    dick = max(2, bild.shape[0] // 140)
    sicher_k = [(a, b, s) for a, b, s in KNOCHEN if S[a] >= SICHT and S[b] >= SICHT]
    unsicher_k = [(a, b, s) for a, b, s in KNOCHEN if not (S[a] >= SICHT and S[b] >= SICHT)]
    sicher_p = [i for i in PUNKTE_ZEICHNEN if S[i] >= SICHT]
    unsicher_p = [i for i in PUNKTE_ZEICHNEN if S[i] < SICHT]
    if unsicher_k or unsicher_p:                              # unsichere Teile nur zu 35 Prozent deckend
        blass = bild.copy()
        for a, b, seite in unsicher_k:
            cv2.line(blass, _p(P, a), _p(P, b), FARBE[seite], dick, cv2.LINE_AA)
        for i in unsicher_p:
            cv2.circle(blass, _p(P, i), dick + 1, (255, 255, 255), -1, cv2.LINE_AA)
        cv2.addWeighted(blass, 0.35, bild, 0.65, 0, bild)
    for a, b, seite in sicher_k:
        cv2.line(bild, _p(P, a), _p(P, b), FARBE[seite], dick, cv2.LINE_AA)
    for i in sicher_p:
        cv2.circle(bild, _p(P, i), dick + 1, (255, 255, 255), -1, cv2.LINE_AA)
    for punkt, wert in ((ELL_L, m.get("ellbogen_l")), (ELL_R, m.get("ellbogen_r")), (KNI_L, m.get("knie_l")), (KNI_R, m.get("knie_r"))):
        if wert is not None:
            x, y = _p(P, punkt)
            cv2.putText(bild, str(wert), (x + 8, y - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 3, cv2.LINE_AA)
            cv2.putText(bild, str(wert), (x + 8, y - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)


def zeichne_umriss(bild, pts, teile):
    """Zielpose als helle, breite Linien unter dem Skelett; getroffene Stücke grün, offene gelb."""
    ueber = bild.copy()
    ok = {t["name"]: t["ok"] for t in teile}
    for name, a, b in GLIEDER:
        if a in pts and b in pts:
            farbe = (90, 200, 90) if ok.get(name) else (60, 210, 240)
            cv2.line(ueber, tuple(int(c) for c in pts[a]), tuple(int(c) for c in pts[b]), farbe, 9, cv2.LINE_AA)
    for a, b in ((SCH_L, SCH_R), (HUE_L, HUE_R), (SCH_L, HUE_L), (SCH_R, HUE_R)):
        if a in pts and b in pts:
            cv2.line(ueber, tuple(int(c) for c in pts[a]), tuple(int(c) for c in pts[b]), (200, 200, 200), 9, cv2.LINE_AA)
    if NASE in pts:
        cv2.circle(ueber, tuple(int(c) for c in pts[NASE]), 12, (200, 200, 200), -1, cv2.LINE_AA)
    cv2.addWeighted(ueber, 0.45, bild, 0.55, 0, bild)


# --------------------------------------------------------------------------- Pipeline je Verbindung
ANSICHTEN = ("skelett", "spiegel", "schreibtisch", "nachmachen")


class Verbindung:
    """Zustand einer Kameraverbindung: Bildzähler, verfolgte Person, Glättung, Übung, Verlauf, Zielpose."""

    def __init__(self):
        self.zaehler = 0
        self.roi = None                 # (Hüftmitte, Körperpunkt) der verfolgten Person im letzten Bild
        self.filter = EinEuro(**{"min_grenzfreq": GLAETTEN["min_grenzfreq"], "beta": GLAETTEN["beta"]})
        self.ansicht = "skelett"
        self.uebung = Kniebeuge()
        self.ziel = "haende-hoch"
        self.nachmachen = Nachmachen()
        self.verlauf = deque(maxlen=24)  # Messwerte der letzten Bilder für die Haltung am Schreibtisch
        self.weitere = 0
        self.letzte = None              # (Zeit der letzten Auswertung)

    def setze_uebung(self, name):
        if self.uebung.name != name:
            self.uebung = UEBUNGEN[name]()


def analysiere(bild, modelle_, v):
    """Wertet ein BGR-Bild aus (spiegelt es und zeichnet hinein) und gibt {"person", "extra"...} zurück."""
    alt = cv2.getNumThreads()
    cv2.setNumThreads(THREADS)
    try:
        t0 = time.perf_counter()
        v.zaehler += 1
        bild[:] = cv2.flip(bild, 1)                         # Spiegelbild: Dein linker Arm ist links im Bild
        suche = v.roi is None or v.zaehler % DET_ALLE == 0
        if suche:
            gefunden = modelle_.personen(bild)
            if len(gefunden):
                v.weitere = len(gefunden) - 1
                if v.roi is None:
                    groesste = max(gefunden, key=lambda z: (z[2] - z[0]) * (z[3] - z[1]) * z[12])
                    v.roi = (groesste[4:6].copy(), groesste[6:8].copy())
            else:
                v.weitere = 0
        t1 = time.perf_counter()
        erg = modelle_.koerper(bild, *v.roi) if v.roi is not None else None
        t2 = time.perf_counter()
        extra = {"person": False, "weitere": int(v.weitere), "ansicht_modus": v.ansicht}
        if erg is None:
            v.roi = None
            v.filter = EinEuro(**{"min_grenzfreq": GLAETTEN["min_grenzfreq"], "beta": GLAETTEN["beta"]})
            v.verlauf.clear()
            extra["detail_ms"] = {"suche": round((t1 - t0) * 1000, 1), "koerper": round((t2 - t1) * 1000, 1), "neu_gesucht": bool(suche)}
            return 0, extra
        roh, sicher = erg
        v.roi = (roh[33, :2].copy(), roh[34, :2].copy())
        roh = roh[TAUSCH]                                   # Seiten der Person, wie im Spiegel gesehen
        jetzt = time.perf_counter()
        skala = float(np.linalg.norm(v.roi[1] - v.roi[0]))
        P = v.filter(roh[:33, :2], jetzt, skala)
        S = roh[:33, 3]
        m = messwerte(P, S)
        extra.update({"person": True, "sicher": round(float(sicher), 2), "messwerte": {k: m[k] for k in m if k != "ansicht"},
                      "ansicht": m["ansicht"], "gesehen": int(np.sum(S[:33] >= SICHT))})
        # --- Modi
        teile, pts = None, None
        if v.ansicht == "spiegel":
            if isinstance(v.uebung, Armkreisen):
                v.uebung.schritt(m, P, S)
            else:
                v.uebung.schritt(m)
            extra["uebung"] = v.uebung.zustand()
        elif v.ansicht == "schreibtisch":
            v.verlauf.append(m)
            if len(v.verlauf) >= 8:
                med = mittelwerte(v.verlauf)
                extra["haltung"] = {"hinweise": haltung_hinweise(med), "mittel": {k: med[k] for k in med if k != "ansicht"}, "ansicht": med["ansicht"],
                                    "bilder": len(v.verlauf)}
            else:
                extra["haltung"] = {"hinweise": [{"id": "warte", "text": "Ich sammle ein paar Bilder, bevor ich etwas sage."}], "mittel": {}, "ansicht": None, "bilder": len(v.verlauf)}
        elif v.ansicht == "nachmachen":
            wert, teile, richt = aehnlichkeit(P, S, v.ziel)
            v.nachmachen.schritt(wert, jetzt)
            pts = umriss(P, S, richt)
            extra["nachmachen"] = {"ziel": v.ziel, "titel": ZIELE[v.ziel]["titel"], "hinweis": ZIELE[v.ziel]["hinweis"], "aehnlichkeit": wert, "stuecke": teile,
                                   "geschafft": v.nachmachen.geschafft, "gerade": v.nachmachen.zeigt}
        if pts:
            zeichne_umriss(bild, pts, teile)
        zeichne(bild, P, S, m)
        t3 = time.perf_counter()
        extra["detail_ms"] = {"suche": round((t1 - t0) * 1000, 1), "koerper": round((t2 - t1) * 1000, 1), "regeln": round((t3 - t2) * 1000, 1),
                              "neu_gesucht": bool(suche)}
        return 1, extra
    finally:
        cv2.setNumThreads(alt)


@router.get("/api/koerperhaltung/status")
def status():
    fehlt = fehlende_dateien()
    return {"bereit": not fehlt, "fehlt": fehlt}


class _KoerperModus:
    """Eintrag im Modus-Register (app/kamera_modi.py): Kanal /ws/vision?modus=koerper."""
    name = "koerper"
    max_kante = 480

    def bereit(self):
        return not fehlende_dateien()

    def neu(self):
        return Verbindung()

    def verarbeite(self, img, schwelle, zustand):
        return analysiere(img, modelle(), zustand)

    def steuern(self, zustand, d):
        a = d.get("ansicht")
        if isinstance(a, str) and a in ANSICHTEN:
            zustand.ansicht = a
        u = d.get("uebung")
        if isinstance(u, str) and u in UEBUNGEN:
            zustand.setze_uebung(u)
        z = d.get("ziel")
        if isinstance(z, str) and z in ZIELE and z != zustand.ziel:
            zustand.ziel, zustand.nachmachen = z, Nachmachen()
        if d.get("neu") is True:                    # Zähler auf null (Übung oder Zielpose)
            zustand.uebung = UEBUNGEN[zustand.uebung.name]()
            zustand.nachmachen = Nachmachen()


kamera_modi.registriere(_KoerperModus())
