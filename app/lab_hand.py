"""Labor "Hände und Gesichter": Handskelett, Gesten, Gesichtsausdruck und Kopfhaltung im selben Kamerabild.

Eingebunden wird das Modul von app/app.py (Schleife über lab_*.py) und vom Kamera-Kanal /ws/vision?modus=hand_gesicht.
Endpunkt
  GET /api/hand-gesicht/status   {"bereit": bool, "fehlt": [Dateinamen]} (die Oberfläche prüft das vor dem Kamerastart)

Modelle (nicht im Repo, scripts/modelle_laden.sh holt sie nach app/models/; Lizenzen auf der Seite /lizenzen):
  palm_detection_mediapipe_2023feb.onnx             Handflächen finden (Eingabe NHWC 1x192x192x3)
  handpose_estimation_mediapipe_2023feb.onnx        21 Handpunkte und Links/Rechts (Eingabe NHWC 1x224x224x3)
  facial_expression_recognition_mobilefacenet_2022july.onnx   sieben Gesichtsausdrücke (Eingabe NCHW 1x3x112x112)

Quellen und Lizenz: Die Modelle stammen aus dem OpenCV Zoo (github.com/opencv/opencv_zoo, Apache-2.0) und gehen auf
Google MediaPipe (Palm- und Handpose-Modell, Apache-2.0) bzw. die im Zoo genannte Veröffentlichung zur Ausdruckserkennung
(IEEE 9629313, Modell Apache-2.0 laut Modellkarte) zurück. Die Vor- und Nachverarbeitung
(Anker, NMS, Drehung der Handfläche, Rücktransformation der Punkte, Ausrichtung des Gesichts für den Ausdruck) folgt dem
Ablauf der Referenzcodes mp_palmdet.py, mp_handpose.py und fer.py des OpenCV Zoo (Apache-2.0) und ist hier eigenständig
in NumPy und OpenCV neu geschrieben. Die Anker werden berechnet statt als Tabelle abgelegt. Gesten, Kopfhaltung und
Zeichnung sind eigener Code.

Es wird nichts gespeichert: Jedes Bild wird ausgewertet, gezeichnet und verworfen. Der Zustand je Verbindung (letzte Hand-
und Gesichtslage) liegt nur im Arbeitsspeicher und endet mit der Verbindung.
"""
import time
from pathlib import Path

from app import kamera_modi

import cv2
import numpy as np
from fastapi import APIRouter

router = APIRouter()

MODELLE = Path(__file__).resolve().parent / "models"
DATEIEN = {
    "palm": "palm_detection_mediapipe_2023feb.onnx",
    "hand": "handpose_estimation_mediapipe_2023feb.onnx",
    "ausdruck": "facial_expression_recognition_mobilefacenet_2022july.onnx",
}
LAENGSTE_KANTE = 480          # Frames werden vor der Auswertung auf diese Kante verkleinert
MAX_HAENDE = 2
MAX_GESICHTER = 3
NEU_SUCHEN_ALLE = 2           # Handflächen nur jeden zweiten Frame neu suchen, dazwischen folgt das Skelett der Hand
PALM_SCHWELLE = 0.5
HAND_SCHWELLE = 0.5           # Mindest-Sicherheit des Handmodells (MediaPipe-Standard), darunter gilt die Hand als nicht gefunden
GESICHT_SCHWELLE = 0.8        # YuNet liefert ab 0,7; für Karten und Ausdruck nur sichere Gesichter (weniger Geisterkarten im Dunkeln)
THREADS = 3                   # Rechenkerne dieser Pipeline (der Jetson hat 6, der Chat soll nicht verhungern)

# Verbindungen des Handskeletts: Handgelenk 0, Daumen 1-4, Zeige 5-8, Mittel 9-12, Ring 13-16, Klein 17-20
VERBINDUNGEN = [(0, 1), (1, 2), (2, 3), (3, 4), (0, 5), (5, 6), (6, 7), (7, 8), (5, 9), (9, 10), (10, 11), (11, 12),
                (9, 13), (13, 14), (14, 15), (15, 16), (13, 17), (17, 18), (18, 19), (19, 20), (0, 17)]
FINGER = {"daumen": (1, 2, 3, 4), "zeige": (5, 6, 7, 8), "mittel": (9, 10, 11, 12), "ring": (13, 14, 15, 16), "klein": (17, 18, 19, 20)}
PALM_PUNKTE = [0, 5, 9, 13, 17, 1, 2]       # Punkte, aus denen eine verfolgte Hand wie eine frisch gefundene Handfläche aussieht

AUSDRUECKE = ["wütend", "angewidert", "ängstlich", "froh", "neutral", "traurig", "überrascht"]   # Reihenfolge des Modells
FROH = AUSDRUECKE.index("froh")
FARBEN_HAND = [(255, 140, 40), (60, 170, 255)]               # BGR
FARBEN_GESICHT = [(0, 185, 118), (190, 200, 40), (80, 110, 235)]


# --------------------------------------------------------------------------- Anker der Handflächen-Erkennung
def _anker():
    """2016 Ankerpunkte (Mitte als Anteil der Bildkante) des 192-Pixel-Modells: Raster 24x24 mit 2 Ankern je Zelle und
    Raster 12x12 mit 6 Ankern je Zelle, zeilenweise von oben links."""
    punkte = []
    for zellen, je_zelle in ((24, 2), (12, 6)):
        for y in range(zellen):
            for x in range(zellen):
                punkte.extend([((x + 0.5) / zellen, (y + 0.5) / zellen)] * je_zelle)
    return np.array(punkte, dtype=np.float64)


ANKER = _anker()


# --------------------------------------------------------------------------- kleine Geometriehelfer
def _quadrat_einpassen(bild, groesse):
    """Skaliert unter Beibehalt des Seitenverhältnisses und füllt schwarz auf. Gibt (Bild, Versatz links/oben, Faktor) zurück."""
    h, w = bild.shape[:2]
    faktor = min(groesse / h, groesse / w)
    nh, nw = int(h * faktor), int(w * faktor)
    klein = cv2.resize(bild, (nw, nh))
    oben, links = (groesse - nh) // 2, (groesse - nw) // 2
    voll = cv2.copyMakeBorder(klein, oben, groesse - nh - oben, links, groesse - nw - links, cv2.BORDER_CONSTANT, value=(0, 0, 0))
    return voll, np.array([links, oben], dtype=np.float64), faktor


def _umfassen(punkte):
    """Kleinstes Rechteck um Punkte als [[x1, y1], [x2, y2]]."""
    return np.array([punkte.min(axis=0), punkte.max(axis=0)], dtype=np.float64)


def _verschieben_vergroessern(kasten, verschiebung, faktor):
    """Kasten [[x1,y1],[x2,y2]] um einen Anteil seiner Größe verschieben und um faktor um seine Mitte vergrößern."""
    kasten = kasten + np.array(verschiebung) * (kasten[1] - kasten[0])
    mitte = kasten.sum(axis=0) / 2
    halb = (kasten[1] - kasten[0]) * faktor / 2
    return np.array([mitte - halb, mitte + halb])


def _ausschnitt(bild, kasten, quadratisch_diagonal):
    """Schneidet den Kasten (auf das Bild begrenzt) aus und füllt schwarz auf: auf die Diagonale (für die Drehung, damit
    keine Ecke verloren geht) oder auf ein Quadrat. Gibt (Bild, begrenzter Kasten, Ursprung des Ausschnitts im Bild) zurück."""
    k = kasten.astype(np.int32)
    k[:, 0] = np.clip(k[:, 0], 0, bild.shape[1])
    k[:, 1] = np.clip(k[:, 1], 0, bild.shape[0])
    teil = bild[k[0][1]:k[1][1], k[0][0]:k[1][0], :]
    seite = int(np.linalg.norm(teil.shape[:2])) if quadratisch_diagonal else max(teil.shape[:2])
    fuell_h, fuell_b = seite - teil.shape[0], seite - teil.shape[1]
    links, oben = fuell_b // 2, fuell_h // 2
    teil = cv2.copyMakeBorder(teil, oben, fuell_h - oben, links, fuell_b - links, cv2.BORDER_CONSTANT, value=(0, 0, 0))
    return teil, k, k[0] - np.array([links, oben])


def _iou(a, b):
    x1, y1, x2, y2 = max(a[0], b[0]), max(a[1], b[1]), min(a[2], b[2]), min(a[3], b[3])
    schnitt = max(0.0, x2 - x1) * max(0.0, y2 - y1)
    uni = (a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - schnitt
    return schnitt / uni if uni > 0 else 0.0


# --------------------------------------------------------------------------- Modelle
class Modelle:
    """Lädt die drei Netze einmal. Die Netze sind nicht threadsicher: Der Aufrufer hält dafür seine Sperre (_inferenz_lock)."""

    def __init__(self):
        self.fehlt = [d for d in DATEIEN.values() if not (MODELLE / d).is_file()]
        self.palm = self.hand = self.ausdruck = None
        if not self.fehlt:
            self.palm = cv2.dnn.readNet(str(MODELLE / DATEIEN["palm"]))
            self.hand = cv2.dnn.readNet(str(MODELLE / DATEIEN["hand"]))
            self.ausdruck = cv2.dnn.readNet(str(MODELLE / DATEIEN["ausdruck"]))
            self.palm_ausgaenge = self.palm.getUnconnectedOutLayersNames()
            self.hand_ausgaenge = self.hand.getUnconnectedOutLayersNames()

    @property
    def bereit(self):
        return not self.fehlt

    # ---- Handflächen finden
    def handflaechen(self, bild):
        """Liefert Zeilen [x1,y1,x2,y2, 7 Punkte (x,y), Sicherheit] in Bildpixeln, beste zuerst."""
        voll, versatz, faktor = _quadrat_einpassen(bild, 192)
        eingabe = cv2.cvtColor(voll, cv2.COLOR_BGR2RGB).astype(np.float32)[np.newaxis] / 255.0       # NHWC
        self.palm.setInput(eingabe)
        deltas, roh = self.palm.forward(self.palm_ausgaenge)
        sicher = 1.0 / (1.0 + np.exp(-roh[0, :, 0].astype(np.float64)))
        gut = np.where(sicher > PALM_SCHWELLE)[0]
        if len(gut) == 0:
            return np.empty((0, 19))
        d = deltas[0][gut]
        anker = ANKER[gut]
        mitte = d[:, :2] / 192.0
        halb = d[:, 2:4] / 192.0 / 2
        kaesten = np.concatenate([mitte - halb + anker, mitte + halb + anker], axis=1) * 192.0   # im 192er Quadrat
        behalten = cv2.dnn.NMSBoxes([[float(a), float(b), float(c - a), float(e - b)] for a, b, c, e in kaesten],
                                    sicher[gut].tolist(), PALM_SCHWELLE, 0.3)
        behalten = np.array(behalten).reshape(-1)
        if len(behalten) == 0:
            return np.empty((0, 19))
        pts = (d[behalten, 4:].reshape(-1, 7, 2) / 192.0 + anker[behalten][:, None, :]) * 192.0
        kaesten = kaesten[behalten].reshape(-1, 2, 2)
        zurueck = lambda p: (p - versatz) / faktor                                               # noqa: E731
        zeilen = np.c_[zurueck(kaesten).reshape(-1, 4), zurueck(pts).reshape(-1, 14), sicher[gut][behalten]]
        return zeilen[np.argsort(-zeilen[:, 18])]

    # ---- Handpunkte
    def handpunkte(self, bild, palm):
        """palm: Zeile aus handflaechen() oder eine aus Punkten gebaute. Gibt None oder
        {punkte (21x3 in Bildpixeln), links_rechts (0 = links, 1 = rechts im Modell), sicher, kasten} zurück."""
        kasten = palm[0:4].reshape(2, 2)
        # 1. großer Ausschnitt um die Handfläche, damit die Drehung keine Ecken verliert
        grob, k, ursprung = _ausschnitt(bild, _verschieben_vergroessern(kasten, [0, 0], 4), True)
        rgb = cv2.cvtColor(grob, cv2.COLOR_BGR2RGB)
        punkte7 = palm[4:18].reshape(7, 2) - ursprung
        kasten = k.astype(np.float64) - ursprung          # Mitte des vergrößerten Ausschnitts ist der Drehpunkt
        # 2. so drehen, dass der Mittelfinger nach oben zeigt (Handgelenk -> Mittelfingerwurzel)
        p1, p2 = punkte7[0], punkte7[2]
        winkel = np.pi / 2 - np.arctan2(-(p2[1] - p1[1]), p2[0] - p1[0])
        winkel -= 2 * np.pi * np.floor((winkel + np.pi) / (2 * np.pi))
        grad = float(np.rad2deg(winkel))
        drehung = cv2.getRotationMatrix2D(tuple(kasten.sum(axis=0) / 2), grad, 1.0)
        gedreht = cv2.warpAffine(rgb, drehung, (rgb.shape[1], rgb.shape[0]))
        gedr_pts = np.c_[punkte7, np.ones(7)] @ drehung.T
        # 3. Ausschnitt um die gedrehten Handflächenpunkte, nach oben verschoben (Finger gehören dazu)
        eng, gedr_kasten, _ = _ausschnitt(gedreht, _verschieben_vergroessern(_umfassen(gedr_pts), [0, -0.4], 3), False)
        eingabe = cv2.resize(eng, (224, 224), interpolation=cv2.INTER_AREA).astype(np.float32)[np.newaxis] / 255.0   # NHWC
        self.hand.setInput(eingabe)
        punkte, sicher, links_rechts, _welt = self.hand.forward(self.hand_ausgaenge)
        sicher = float(sicher[0][0])
        if sicher < HAND_SCHWELLE:
            return None
        pts = punkte[0].reshape(-1, 3).astype(np.float64)
        faktor = float(max((gedr_kasten[1] - gedr_kasten[0]) / 224.0))
        pts[:, :2] = (pts[:, :2] - 112.0) * faktor
        pts[:, 2] *= faktor
        # 4. zurückdrehen und an die richtige Stelle im Bild setzen
        rueck = cv2.getRotationMatrix2D((0, 0), grad, 1.0)[:, :2]
        pts[:, :2] = pts[:, :2] @ rueck
        inv = np.linalg.inv(np.vstack([drehung, [0, 0, 1]]))[:2]
        mitte = np.append(gedr_kasten.sum(axis=0) / 2, 1.0) @ inv.T
        pts[:, :2] += mitte + ursprung
        return {"punkte": pts, "links_rechts": float(links_rechts[0][0]), "sicher": sicher, "kasten": _umfassen(pts[:, :2])}

    # ---- Ausdruck
    def ausdruck_von(self, bild, gesicht):
        """gesicht: YuNet-Zeile (x, y, b, h, 10 Punkte, Sicherheit). Gibt Wahrscheinlichkeiten der sieben Ausdrücke zurück."""
        ziel = np.array([[38.2946, 51.6963], [73.5318, 51.5014], [56.0252, 71.7366], [41.5493, 92.3655], [70.7299, 92.2041]])
        quelle = gesicht[4:14].reshape(5, 2).astype(np.float64)
        ausgerichtet = cv2.warpAffine(bild, _aehnlichkeit(quelle, ziel), (112, 112))
        rgb = cv2.cvtColor(ausgerichtet, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        eingabe = np.transpose((rgb - 0.5) / 0.5, (2, 0, 1))[np.newaxis]                          # NCHW
        self.ausdruck.setInput(eingabe, "data")
        logits = self.ausdruck.forward(["label"])[0][0].astype(np.float64)
        e = np.exp(logits - logits.max())
        return e / e.sum()


def _aehnlichkeit(quelle, ziel):
    """2x3-Matrix der Ähnlichkeitsabbildung (Drehung, Skalierung, Verschiebung) von quelle auf ziel, kleinste Quadrate."""
    n = len(quelle)
    x, y = quelle[:, 0], quelle[:, 1]
    a = np.zeros((2 * n, 4))
    a[:n] = np.c_[x, -y, np.ones(n), np.zeros(n)]
    a[n:] = np.c_[y, x, np.zeros(n), np.ones(n)]
    b = np.r_[ziel[:, 0], ziel[:, 1]]
    s, t, tx, ty = np.linalg.lstsq(a, b, rcond=None)[0]
    return np.array([[s, -t, tx], [t, s, ty]], dtype=np.float64)


# --------------------------------------------------------------------------- Gesten und Kopfhaltung
def _winkel_grad(a, b, c):
    """Winkel bei b zwischen den Strecken b-a und b-c in Grad (180 = gestreckt)."""
    u, v = a - b, c - b
    nenner = np.linalg.norm(u) * np.linalg.norm(v)
    if nenner < 1e-6:
        return 0.0
    return float(np.degrees(np.arccos(np.clip(np.dot(u, v) / nenner, -1.0, 1.0))))


def finger_gestreckt(p):
    """Welche Finger sind gestreckt? p: 21x2 Bildpunkte. Unabhängig von der Drehung der Hand."""
    hand = p[0]
    aus = {}
    for name in ("zeige", "mittel", "ring", "klein"):
        mcp, pip, dip, tip = (p[i] for i in FINGER[name])
        gerade = _winkel_grad(mcp, pip, tip) > 140 and _winkel_grad(pip, dip, p[FINGER[name][3]]) > 130
        aus[name] = bool(gerade and np.linalg.norm(tip - hand) > np.linalg.norm(pip - hand) * 1.05)
    t1, t2, t3, t4 = (p[i] for i in FINGER["daumen"])
    breite = np.linalg.norm(p[5] - p[17]) + 1e-6                # Handbreite als Maß
    aus["daumen"] = bool(_winkel_grad(t2, t3, t4) > 150 and np.linalg.norm(t4 - p[17]) > breite * 0.95
                         and np.linalg.norm(t4 - p[5]) > breite * 0.45)
    return aus


def erkenne_geste(p):
    """Klartext-Geste und Zahl der gestreckten Finger aus den 21 Handpunkten (nur Regeln, kein Lernen)."""
    f = finger_gestreckt(p)
    vier = [f["zeige"], f["mittel"], f["ring"], f["klein"]]
    n = sum(vier) + int(f["daumen"])
    daumen_hoch = daumen_runter = False
    if f["daumen"]:
        d = p[4] - p[2]
        if abs(d[1]) > abs(d[0]) * 0.8:
            daumen_hoch, daumen_runter = d[1] < 0, d[1] > 0
    if not any(vier):
        if daumen_hoch:
            return "Daumen hoch", n
        if daumen_runter:
            return "Daumen runter", n
        return ("Faust mit Daumen" if f["daumen"] else "Faust"), n
    if all(vier):
        return "offene Hand", n
    if f["zeige"] and f["mittel"] and not f["ring"] and not f["klein"]:
        return "Victory", n
    if f["zeige"] and not (f["mittel"] or f["ring"] or f["klein"]):
        return "Zeigefinger", n
    zahlwort = {1: "1 Finger", 2: "2 Finger", 3: "3 Finger", 4: "4 Finger", 5: "5 Finger"}
    return zahlwort.get(n, "Hand"), n


def kopfhaltung(gesicht):
    """Grobe Kopfhaltung aus den fünf YuNet-Punkten: geradeaus, links, rechts oder geneigt (links und rechts wie im Bild)."""
    pts = gesicht[4:14].reshape(5, 2)
    augen = pts[:2][np.argsort(pts[:2, 0])]              # linkes Auge im Bild zuerst
    nase = pts[2]
    abstand = np.linalg.norm(augen[1] - augen[0])
    if abstand < 1:
        return "geradeaus"
    neigung = np.degrees(np.arctan2(augen[1][1] - augen[0][1], augen[1][0] - augen[0][0]))
    drehung = (nase[0] - augen.mean(axis=0)[0]) / abstand
    if abs(neigung) > 15:
        return "geneigt"
    if drehung > 0.22:
        return "rechts"
    if drehung < -0.22:
        return "links"
    return "geradeaus"


# --------------------------------------------------------------------------- Pipeline je Verbindung
class Verbindung:
    """Zustand einer Kameraverbindung: Bildzähler, verfolgte Hände, geglättete Ausdrücke je Gesicht."""

    def __init__(self):
        self.zaehler = 0
        self.haende = []          # {"palm": Zeile, "punkte": 21x3, ...} aus dem letzten Frame
        self.gesichter = []       # {"mitte": (x, y), "p": Wahrscheinlichkeiten}


def _palm_aus_punkten(p):
    """Baut aus den 21 Handpunkten eine Zeile wie handflaechen() sie liefert, damit eine Hand ohne neue Suche weiterläuft."""
    sieben = p[PALM_PUNKTE, :2]
    k = _umfassen(sieben)
    return np.r_[k.reshape(-1), sieben.reshape(-1), 1.0]


def _hand_ergebnis(erg):
    p = erg["punkte"][:, :2]
    geste, n = erkenne_geste(p)
    # Gemessen an Fotos mit bekannter Hand: Auch bei einem ungespiegelten Bild liefert das Modell die Seite der Person
    # (ab 0,5 rechts), es muss nichts vertauscht werden.
    lr = erg["links_rechts"]
    # Bei unsicherer Hand oder knapper Entscheidung (Faust, Hand von der Seite) wird die Seite nicht behauptet.
    seite = "unklar" if (erg["sicher"] < 0.8 or abs(lr - 0.5) < 0.25) else ("rechts" if lr >= 0.5 else "links")
    return {"seite": seite, "geste": geste, "finger": int(n), "sicher": round(erg["sicher"], 2)}


def _zeichne(bild, gesichter, haende):
    """Rahmen und Punkte der Gesichter, Skelette der Hände; die Nummern passen zu den Karten in der Oberfläche."""
    for f, i in gesichter:
        farbe = FARBEN_GESICHT[i % len(FARBEN_GESICHT)]
        x, y, bw, bh = f[:4].astype(int)
        cv2.rectangle(bild, (x, y), (x + bw, y + bh), farbe, 2)
        cv2.putText(bild, f"Gesicht {i + 1}", (x, max(y - 7, 14)), cv2.FONT_HERSHEY_SIMPLEX, 0.55, farbe, 2)
        for j in range(4, 14, 2):
            cv2.circle(bild, (int(f[j]), int(f[j + 1])), 2, (255, 190, 0), -1)
    for i, erg in enumerate(haende):
        farbe = FARBEN_HAND[i % len(FARBEN_HAND)]
        p = erg["punkte"][:, :2]
        for a, b in VERBINDUNGEN:
            cv2.line(bild, tuple(int(c) for c in p[a]), tuple(int(c) for c in p[b]), farbe, 2, cv2.LINE_AA)
        for q in p:
            cv2.circle(bild, (int(q[0]), int(q[1])), 3, (255, 255, 255), -1, cv2.LINE_AA)
        x0, y0 = erg["kasten"][0].astype(int)
        cv2.putText(bild, f"Hand {i + 1}", (max(x0, 0), max(y0 - 8, 14)), cv2.FONT_HERSHEY_SIMPLEX, 0.55, farbe, 2)


def analysiere(bild, yunet, modelle, v):
    """Wertet ein BGR-Bild aus (zeichnet hinein) und gibt {"haende": [...], "gesichter": [...], "ms": {...}} zurück."""
    alt = cv2.getNumThreads()
    cv2.setNumThreads(THREADS)
    try:
        t0 = time.perf_counter()
        v.zaehler += 1
        h, w = bild.shape[:2]
        # --- Gesichter
        yunet.setInputSize((w, h))
        _, gef = yunet.detect(bild)
        gef = [] if gef is None else [f for f in gef if f[14] >= GESICHT_SCHWELLE]
        gef = sorted(sorted(gef, key=lambda f: -f[2] * f[3])[:MAX_GESICHTER], key=lambda f: f[0])   # die größten, von links nach rechts (stabile Nummern)
        t1 = time.perf_counter()
        gesichter, neu, kaesten_g = [], [], []          # gezeichnet wird erst nach allen Netzen, sonst sähen sie die Markierungen
        for i, f in enumerate(gef):
            mitte = (float(f[0] + f[2] / 2), float(f[1] + f[3] / 2))
            alt_g = min(v.gesichter, key=lambda g: np.hypot(g["mitte"][0] - mitte[0], g["mitte"][1] - mitte[1]), default=None)
            bekannt = alt_g is not None and np.hypot(alt_g["mitte"][0] - mitte[0], alt_g["mitte"][1] - mitte[1]) < max(f[2], f[3])
            if bekannt and v.zaehler % NEU_SUCHEN_ALLE == 1:
                p = alt_g["p"]                                           # jeden zweiten Frame reicht der Ausdruck des Vorbildes
            else:
                p = modelle.ausdruck_von(bild, f)
                if bekannt:
                    p = 0.5 * p + 0.5 * alt_g["p"]                       # über zwei Bilder glätten, das ruhigt die Anzeige
            neu.append({"mitte": mitte, "p": p})
            k = int(np.argmax(p))
            gesichter.append({"nr": i + 1, "ausdruck": AUSDRUECKE[k], "sicher": round(float(p[k]), 2),
                              "laechelt": bool(k == FROH), "kopf": kopfhaltung(f)})
            kaesten_g.append((f, i))
        v.gesichter = neu
        t2 = time.perf_counter()
        # --- Hände: jeden zweiten Frame Handflächen neu suchen, dazwischen der letzten Lage folgen
        if v.zaehler % NEU_SUCHEN_ALLE == 1:
            palme = [pz for pz in modelle.handflaechen(bild)[:MAX_HAENDE]]
            gesucht = True
        else:
            palme = [_palm_aus_punkten(hd["punkte"][:, :2]) for hd in v.haende]
            gesucht = False
        t3 = time.perf_counter()
        ergebnisse = []
        for pz in palme:
            if gesucht and any(_iou(pz[:4], e["kasten"].reshape(-1)) > 0.5 for e in ergebnisse):
                continue                                                  # dieselbe Hand zweimal gefunden
            erg = modelle.handpunkte(bild, pz)
            if erg is not None:
                ergebnisse.append(erg)
        ergebnisse.sort(key=lambda e: e["kasten"][:, 0].mean())           # von links nach rechts, damit die Nummern nicht springen
        v.haende = ergebnisse
        haende = []
        for i, erg in enumerate(ergebnisse):
            info = _hand_ergebnis(erg)
            info["nr"] = i + 1
            haende.append(info)
        t4 = time.perf_counter()
        _zeichne(bild, kaesten_g, ergebnisse)
        return {"haende": haende, "gesichter": gesichter,
                "ms": {"gesicht": round((t1 - t0) * 1000, 1), "ausdruck": round((t2 - t1) * 1000, 1),
                       "handsuche": round((t3 - t2) * 1000, 1), "handpunkte": round((t4 - t3) * 1000, 1),
                       "neu_gesucht": gesucht}}
    finally:
        cv2.setNumThreads(alt)


def verkleinern(bild):
    """Längste Kante auf LAENGSTE_KANTE begrenzen (der Browser schickt schon 480x360, das ist nur der Schutz)."""
    h, w = bild.shape[:2]
    s = LAENGSTE_KANTE / max(h, w)
    return bild if s >= 1 else cv2.resize(bild, (int(w * s), int(h * s)), interpolation=cv2.INTER_AREA)


_modelle = None


def modelle():
    """Die geladenen Modelle (beim ersten Aufruf), auch wenn Dateien fehlen: dann ist .bereit falsch."""
    global _modelle
    if _modelle is None:
        _modelle = Modelle()
    return _modelle


@router.get("/api/hand-gesicht/status")
def status():
    m = modelle()
    return {"bereit": m.bereit, "fehlt": m.fehlt}


class _HandGesichtModus:
    """Eintrag im Modus-Register (app/kamera_modi.py): Kanal /ws/vision?modus=hand_gesicht."""
    name = "hand_gesicht"
    max_kante = 480

    def bereit(self):
        return kamera_modi.yunet() is not None and modelle().bereit

    def neu(self):
        return Verbindung()

    def verarbeite(self, img, schwelle, zustand):
        erg = analysiere(img, kamera_modi.yunet(), modelle(), zustand)
        return len(erg["haende"]) + len(erg["gesichter"]), {"haende": erg["haende"], "gesichter": erg["gesichter"], "detail_ms": erg["ms"]}


kamera_modi.registriere(_HandGesichtModus())
