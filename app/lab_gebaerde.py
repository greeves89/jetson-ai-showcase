"""Labor "Fingeralphabet": Handformen des deutschen Fingeralphabets (DGS) erkennen und zeigen.

Eingebunden wird das Modul von app/app.py (Schleife über lab_*.py) und vom Kamera-Kanal /ws/vision?modus=gebaerde.
Endpunkt
  GET /api/fingeralphabet/status   {"bereit": bool, "fehlt": [Dateinamen]} (die Oberfläche prüft das vor dem Kamerastart)

Hände finden und Handpunkte bestimmen übernimmt lab_hand (Palm-Detektor und 21-Punkte-Handmodell, MediaPipe über den
OpenCV Zoo, Apache-2.0). Dieses Modul lädt dafür KEINE weiteren Modelle: Es nimmt nur die beiden Handnetze (ohne den
Ausdruckserkenner) in einer eigenen Instanz, lädt sie erst beim ersten Bild und gibt sie 120 Sekunden nach dem letzten Bild
wieder frei (damit der Chat Speicher und Rechenzeit behält).

Die Handform wird NICHT von einem Netz gelesen, sondern aus den 21 Punkten gerechnet:
  1. Merkmale aus den Punkten (merkmale): Streckung jedes Fingers, Lage der Fingerspitzen zur Handmitte, Daumenlage und
     Abstände zu den Fingerspitzen, Abstand und Kreuzung der Finger, Ausrichtung der Hand. Alle Merkmale sind auf die
     Handgröße bezogen, unabhängig von der Drehung und gegen Spiegelung unempfindlich (linke und rechte Hand, Hand- und Handrücken-
     seite sehen gleich aus).
  2. Vergleich mit den Vorlagen (app/static/daten/gebaerde-vorlagen.json, gebaut von scripts/gebaerde_vorlagen_bauen.py):
     gewichteter Abstand der Merkmale plus Regeln (ein gestreckter Finger passt nicht zu einem geschlossenen).
  3. Sicherheit je Buchstabe aus dem Abstand zu allen Vorlagen. Unter der Schwelle gilt: nicht sicher.
Trainiert wird nichts, es gibt keine Bilder von Händen im Repo und es werden keine Besucherdaten verwendet. Die Vorlagen sind
Modelle der Handformen nach der Beschreibung des Alphabets, keine Messungen an echten Händen.

Es wird nichts gespeichert und nichts geloggt: Jedes Bild wird ausgewertet, gezeichnet und verworfen. Der Zustand je
Verbindung (die letzten Ergebnisse zum Glätten) liegt nur im Arbeitsspeicher und endet mit der Verbindung.
"""
import gc
import json
import threading
import time
from collections import deque
from pathlib import Path

import numpy as np
from fastapi import APIRouter

from app import kamera_modi, lab_hand

router = APIRouter()

VORLAGEN_DATEI = Path(__file__).resolve().parent / "static" / "daten" / "gebaerde-vorlagen.json"
FREIGABE_NACH = 120.0          # Sekunden ohne Bild, dann werden die Handnetze wieder freigegeben
FENSTER = 5                    # so viele letzte Bilder glätten die Anzeige (Mehrheit)
MEHRHEIT = 3
SICHER_AB = 0.60               # unter dieser Sicherheit gilt: nicht sicher (Anzeige "?"), es wird nichts bestätigt
ABSTAND_MAX = 3.0              # bester Abstand darüber: keine Handform des Alphabets
REGEL_STRAFE = 2.0             # Zuschlag (im Quadrat des Abstands) je Finger, der gestreckt sein soll und geschlossen ist, oder umgekehrt
STEUERZEICHEN = {"LEER": "Leerzeichen", "LOESCHEN": "Löschen"}

ZEIGE, MITTEL, RING, KLEIN = (5, 6, 7, 8), (9, 10, 11, 12), (13, 14, 15, 16), (17, 18, 19, 20)
FINGER = (("zeige", ZEIGE), ("mittel", MITTEL), ("ring", RING), ("klein", KLEIN))
FINGERNAME = {"zeige": "Zeigefinger", "mittel": "Mittelfinger", "ring": "Ringfinger", "klein": "kleiner Finger"}


# --------------------------------------------------------------------------- Merkmale aus 21 Punkten
def _n(v):
    return float(np.linalg.norm(v))


def merkmale(p):
    """Merkmalsvektor (Länge MERKMAL_ZAHL) aus 21 Handpunkten (Bildebene). Spiegelung der x-Achse ändert nichts,
    Drehung nur die beiden Ausrichtungsmerkmale, Größe nichts."""
    p = np.asarray(p, dtype=np.float64)[:, :2]
    s = max(float(np.mean([_n(p[i] - p[0]) for i in (5, 9, 13, 17)])), 1e-6)
    achse = p[9] - p[0]
    achse = achse / max(_n(achse), 1e-6)
    mitte = p[[0, 5, 9, 13, 17]].mean(axis=0)

    def laengs(v):
        return float(np.dot(v, achse)) / s

    def quer(v):
        return abs(float(achse[0] * v[1] - achse[1] * v[0])) / s

    f = []
    for _name, (mcp, pip, dip, tip) in FINGER:
        lang = _n(p[pip] - p[mcp]) + _n(p[dip] - p[pip]) + _n(p[tip] - p[dip])
        f.append(_n(p[tip] - p[mcp]) / max(lang, 1e-6))                          # gerade (1 = gestreckt)
        f.append(_n(p[tip] - mitte) / s)                                          # Spitze zur Handmitte
        f.append(lab_hand._winkel_grad(p[mcp], p[pip], p[dip]) / 180.0)           # Knick im Mittelgelenk
        f.append(laengs(p[tip] - p[mcp]))                                         # Spitze nach vorn (Richtung Fingerspitzen)
        f.append(quer(p[tip] - p[mcp]))                                           # Spitze zur Seite
    t1, t2, t3, t4 = p[1], p[2], p[3], p[4]
    f.append(_n(t4 - t1) / max(_n(t2 - t1) + _n(t3 - t2) + _n(t4 - t3), 1e-6))   # Daumen gerade
    f.append(laengs(t4 - t1))
    f.append(quer(t4 - t1))
    for i in (8, 12, 16, 20):
        f.append(_n(t4 - p[i]) / s)                                               # Daumenspitze zu den Fingerspitzen
    for i in (5, 6, 10, 17):
        f.append(_n(t4 - p[i]) / s)                                               # Daumenspitze zu Zeigefinger-Wurzel, -Mittelgelenk, Mittelfinger-Gelenk, kleiner-Finger-Wurzel
    f.append(_n(t4 - mitte) / s)
    for a, b in ((8, 12), (12, 16), (16, 20)):
        f.append(_n(p[a] - p[b]) / s)                                             # Abstand der Fingerspitzen
    for a, b in ((8, 12), (12, 16)):
        wurzel = p[a - 3] - p[b - 3]
        f.append(float(np.dot(p[a] - p[b], wurzel)) / max(float(np.dot(wurzel, wurzel)), 1e-9))   # < 0: gekreuzt
    f.append(abs(float(np.degrees(np.arctan2(achse[0], -achse[1])))) / 180.0)     # Ausrichtung der Hand (Finger nach oben = 0)
    d = t4 - t1
    f.append(abs(float(np.degrees(np.arctan2(d[0], -d[1])))) / 180.0 if _n(d) > 1e-6 else 0.0)   # Richtung des Daumens im Bild
    return np.array(f, dtype=np.float64)


MERKMAL_ZAHL = 20 + 12 + 5 + 2
# Gewichte je Merkmal: Ausrichtung der Hand zählt doppelt, weil mehrere Buchstaben sich nur dadurch unterscheiden
GEWICHT = np.ones(MERKMAL_ZAHL)
GEWICHT[-2:] = 2.0
GEWICHT[20 + 6:20 + 10] = 0.8        # Abstände der Daumenspitze zu den Fingerspitzen etwas leiser (die Spitzen sind unruhig)


def _zustand(m):
    """Regelstufe je Finger aus den Merkmalen: 2 gestreckt, 1 gebogen, 0 geschlossen."""
    z = []
    for k in range(4):
        gerade, knick = m[5 * k], m[5 * k + 2]
        z.append(2 if (gerade > 0.82 and knick > 0.8) else 0 if gerade < 0.55 else 1)
    return np.array(z)


RAUSCHEN = 0.03                # Störung, an der die Merkmale gemessen werden: Abweichung jedes Punktes in Anteilen der Handgröße
DREHUNG = 8.0                  # und eine zufällige Drehung bis zu so vielen Grad
K_EFF = 6.0                    # wie schnell die Sicherheit mit dem Abstand fällt (Merkmale hängen zusammen, deshalb wenige "freie" Werte)


class Vorlagen:
    """Die Handformen mit ihren Merkmalen. Aufbau aus dem Wörterbuch der JSON-Datei.
    Der Abstand misst in Einheiten der Messunruhe: Jedes Merkmal wird durch die Streuung geteilt, die es bei verrauschten
    Punkten hat. Merkmale, die schon bei kleiner Störung wackeln, zählen so wenig, ruhige und trennscharfe viel."""

    def __init__(self, daten):
        self.namen = list(daten["vorlagen"].keys())
        self.punkte = {k: np.array(v["punkte"], dtype=np.float64) for k, v in daten["vorlagen"].items()}
        self.m = np.array([merkmale(self.punkte[k]) for k in self.namen])
        rng = np.random.default_rng(7)
        abw = []
        for k in self.namen:
            p = self.punkte[k][:, :2]
            s = float(np.mean([_n(p[i] - p[0]) for i in (5, 9, 13, 17)]))
            m0 = merkmale(p)
            for _ in range(10):
                abw.append(merkmale(stoeren(p, s, rng, RAUSCHEN, DREHUNG)) - m0)
        boden = np.full(MERKMAL_ZAHL, 0.03)
        boden[-2], boden[-1] = 0.12, 0.2          # Ausrichtung: ein Neigen der Hand um etwa 20 Grad soll noch passen
        self.sigma = np.maximum(np.sqrt(np.mean(np.square(abw), axis=0)), boden)
        self.zustaende = np.array([_zustand(r) for r in self.m])
        self.index = {k: i for i, k in enumerate(self.namen)}

    def abstaende(self, m):
        """Abstand der Merkmale m zu allen Vorlagen (kleiner = ähnlicher, 1 = so weit weg wie die Messunruhe), mit Regelzuschlag."""
        z = (self.m - m) / self.sigma
        d2 = (GEWICHT * z * z).sum(axis=1) / GEWICHT.sum()
        zs = _zustand(m)
        luecke = np.abs(self.zustaende - zs)
        d2 = d2 + REGEL_STRAFE * (luecke >= 2).sum(axis=1)
        return np.sqrt(d2)

    def klassifiziere(self, p):
        """Gibt (Namen nach Sicherheit absteigend, Sicherheiten, Abstände, Merkmale) zurück. Sicherheit: Anteil der Vorlage an allen,
        abgeschwächt, wenn schon die beste weit weg ist (dann passt eigentlich keine)."""
        m = merkmale(p)
        d = self.abstaende(m)
        w = np.exp(-K_EFF * (d - d.min()) * (d + d.min()) / 2.0)
        anteil = w / w.sum()
        sicher = anteil * float(np.exp(-max(d.min() - 2.0, 0.0) ** 2 / 2.0))
        reihe = np.argsort(-sicher)
        return [self.namen[i] for i in reihe], sicher[reihe], d[reihe], m


_vorlagen_cache = {"v": None}
_vorlagen_lock = threading.Lock()


def vorlagen_laden(neu=False):
    with _vorlagen_lock:
        if _vorlagen_cache["v"] is None or neu:
            daten = json.loads(VORLAGEN_DATEI.read_text(encoding="utf-8"))
            _vorlagen_cache["v"] = Vorlagen(daten)
            _vorlagen_cache["daten"] = daten
        return _vorlagen_cache["v"]


def erkenne(p, v=None):
    """Handform aus 21 Punkten: {"name", "sicher", "kandidaten": [[name, sicher], ..], "abstand", "art"}. name ist None,
    wenn keine Handform des Alphabets passt oder die Sicherheit unter SICHER_AB liegt (art "unsicher" bzw. "keine")."""
    v = v or vorlagen_laden()
    namen, sicher, abst, _m = v.klassifiziere(p)
    kandidaten = [[n, round(float(s), 2)] for n, s in zip(namen[:3], sicher[:3])]
    if abst[0] > ABSTAND_MAX:
        return {"name": None, "sicher": 0.0, "kandidaten": kandidaten, "abstand": float(abst[0]), "art": "keine"}
    erg = {"name": namen[0], "sicher": float(sicher[0]), "kandidaten": kandidaten, "abstand": float(abst[0])}
    if sicher[0] < SICHER_AB:
        erg["name"] = None
        erg["art"] = "unsicher"
        erg["vermutung"] = namen[0]
    else:
        erg["art"] = "steuerung" if namen[0] in STEUERZEICHEN else "buchstabe"
    return erg


# --------------------------------------------------------------------------- Rückmeldung zum Üben
def hinweise(p, ziel, v=None):
    """Kurze Hinweise, was an der gezeigten Hand von der Vorlage `ziel` abweicht (höchstens drei Sätze, feste Texte)."""
    v = v or vorlagen_laden()
    m, t = merkmale(p), v.m[v.index[ziel]]
    aus = []
    for k, (name, _ids) in enumerate(FINGER):
        dg = m[5 * k] - t[5 * k]
        if abs(dg) > 0.22:
            aus.append((abs(dg), FINGERNAME[name].capitalize() + (" strecken." if dg < 0 else " einknicken.")))
    daumen = float(np.abs(m[20 + 4:20 + 12] - t[20 + 4:20 + 12]).mean())      # Daumenspitze zu Fingern und Handmitte
    if daumen > 0.28:
        aus.append((daumen, "Daumen anders legen."))
    do = m[-2] - t[-2]
    if abs(do) > 0.16:
        wohin = "nach oben" if t[-2] * 180.0 < 45 else ("zur Seite" if t[-2] * 180.0 < 135 else "nach unten")
        aus.append((abs(do) * 2, f"Hand drehen, die Finger zeigen {wohin}."))
    aus.sort(key=lambda x: -x[0])
    return [text for _w, text in aus[:3]]


# --------------------------------------------------------------------------- Störung für Tests und Einstufung
def stoeren(p, s, rng, sigma, grad):
    """Zufallsstörung: Rauschen auf jedem Punkt, kleine Drehung, kleine Größenänderung (für Tests und Einstufung)."""
    w = np.radians(rng.uniform(-grad, grad))
    r = np.array([[np.cos(w), -np.sin(w)], [np.sin(w), np.cos(w)]])
    q = (p - p[0]) @ r.T * rng.uniform(0.85, 1.15)
    return q + rng.normal(0.0, sigma * s, q.shape)


# --------------------------------------------------------------------------- Handnetze: eigene Instanz, lazy, nach 120 s frei
class _NurHaende(lab_hand.Modelle):
    """Nur Handflächen- und Handpunktnetz (ohne den Ausdruckserkenner), in eigener Instanz."""

    def __init__(self):
        namen = [lab_hand.DATEIEN["palm"], lab_hand.DATEIEN["hand"]]
        self.fehlt = [d for d in namen if not (lab_hand.MODELLE / d).is_file()]
        self.palm = self.hand = self.ausdruck = None
        if not self.fehlt:
            import cv2
            self.palm = cv2.dnn.readNet(str(lab_hand.MODELLE / lab_hand.DATEIEN["palm"]))
            self.hand = cv2.dnn.readNet(str(lab_hand.MODELLE / lab_hand.DATEIEN["hand"]))
            self.palm_ausgaenge = self.palm.getUnconnectedOutLayersNames()
            self.hand_ausgaenge = self.hand.getUnconnectedOutLayersNames()


class _Halter:
    """Hält die Handnetze nur, solange Bilder kommen."""

    def __init__(self):
        self.lock = threading.Lock()
        self.modelle = None
        self.zuletzt = 0.0
        self.waechter = None

    def holen(self):
        """Nur unter self.lock aufrufen."""
        if self.modelle is None:
            self.modelle = _NurHaende()
        self.zuletzt = time.monotonic()
        if self.waechter is None:
            self.waechter = threading.Thread(target=self._wache, daemon=True, name="gebaerde-freigabe")
            self.waechter.start()
        return self.modelle

    def _wache(self):
        while True:
            time.sleep(10.0)
            with self.lock:
                if self.modelle is not None and time.monotonic() - self.zuletzt > FREIGABE_NACH:
                    self.modelle = None
                    gc.collect()

    def geladen(self):
        return self.modelle is not None


halter = _Halter()


def fehlende_dateien():
    return [d for d in (lab_hand.DATEIEN["palm"], lab_hand.DATEIEN["hand"]) if not (lab_hand.MODELLE / d).is_file()]


# --------------------------------------------------------------------------- Pipeline je Verbindung
class Verbindung:
    """Zustand einer Kameraverbindung: Bildzähler, verfolgte Hand, die letzten Ergebnisse zum Glätten, Übungsziel."""

    def __init__(self):
        self.zaehler = 0
        self.haende = []
        self.verlauf = deque(maxlen=FENSTER)
        self.ziel = None


def _glaetten(v, erg):
    """Mehrheit über die letzten Bilder: ein einzelnes Fehlbild ändert die Anzeige nicht."""
    v.verlauf.append((erg["name"], erg["sicher"]) if erg is not None else (None, 0.0))
    zaehl = {}
    for n, s in v.verlauf:
        if n is not None:
            zaehl.setdefault(n, []).append(s)
    if zaehl:
        n = max(zaehl, key=lambda k: len(zaehl[k]))
        if len(zaehl[n]) >= MEHRHEIT:
            return n, float(np.mean(zaehl[n]))
    return None, 0.0


def analysiere(bild, modelle, v, ziel_pruefen=True):
    """Wertet ein BGR-Bild aus (zeichnet hinein): {"hand": {...} oder None, "erg": Erkennung, "ms": {...}}."""
    import cv2
    alt = cv2.getNumThreads()
    cv2.setNumThreads(lab_hand.THREADS)
    try:
        t0 = time.perf_counter()
        v.zaehler += 1
        if v.zaehler % lab_hand.NEU_SUCHEN_ALLE == 1 or not v.haende:
            palme = [pz for pz in modelle.handflaechen(bild)[:1]]
            gesucht = True
        else:
            palme = [lab_hand._palm_aus_punkten(hd["punkte"][:, :2]) for hd in v.haende[:1]]
            gesucht = False
        t1 = time.perf_counter()
        gefunden = []
        for pz in palme:
            erg = modelle.handpunkte(bild, pz)
            if erg is not None:
                gefunden.append(erg)
        v.haende = gefunden
        t2 = time.perf_counter()
        hand = None
        erk = None
        if gefunden:
            h = gefunden[0]
            erk = erkenne(h["punkte"][:, :2])
            hand = {"hand": lab_hand._hand_ergebnis(h), "punkte": h["punkte"], "kasten": h["kasten"], "erg": erk}
        t3 = time.perf_counter()
        return {"hand": hand, "erg": erk, "gesucht": gesucht,
                "ms": {"handsuche": round((t1 - t0) * 1000, 1), "handpunkte": round((t2 - t1) * 1000, 1),
                       "erkennen": round((t3 - t2) * 1000, 1), "neu_gesucht": gesucht}}
    finally:
        cv2.setNumThreads(alt)


def _zeichne(bild, hand, name, sicher):
    import cv2
    h, w = bild.shape[:2]
    p = hand["punkte"][:, :2]
    farbe = (255, 140, 40) if name else (150, 150, 150)
    for a, b in lab_hand.VERBINDUNGEN:
        cv2.line(bild, tuple(int(c) for c in p[a]), tuple(int(c) for c in p[b]), farbe, 2, cv2.LINE_AA)
    for q in p:
        cv2.circle(bild, (int(q[0]), int(q[1])), 3, (255, 255, 255), -1, cv2.LINE_AA)
    x0, y0 = hand["kasten"][0].astype(int)
    text = (STEUERZEICHEN.get(name, name) + f" {int(round(sicher * 100))}%") if name else "?"
    cv2.putText(bild, text, (max(x0, 2), max(y0 - 8, 16)), cv2.FONT_HERSHEY_SIMPLEX, 0.7, farbe, 2)


@router.get("/api/fingeralphabet/status")
def status():
    fehlt = fehlende_dateien()
    if not VORLAGEN_DATEI.is_file():
        fehlt.append(VORLAGEN_DATEI.name)
    return {"bereit": not fehlt, "fehlt": fehlt}


class _GebaerdeModus:
    """Eintrag im Modus-Register (app/kamera_modi.py): Kanal /ws/vision?modus=gebaerde."""
    name = "gebaerde"
    max_kante = 480

    def bereit(self):
        return not fehlende_dateien() and VORLAGEN_DATEI.is_file()

    def neu(self):
        return Verbindung()

    def steuern(self, zustand, ctl):
        """{"ziel": "A"} setzt den Buchstaben, den die Übung gerade verlangt; "" oder null löscht ihn."""
        if "ziel" not in ctl:
            return
        z = ctl["ziel"]
        if z in (None, ""):
            zustand.ziel = None
        elif isinstance(z, str) and z in vorlagen_laden().index and z not in STEUERZEICHEN:
            zustand.ziel = z

    def verarbeite(self, img, schwelle, zustand):
        v = vorlagen_laden()
        with halter.lock:
            modelle = halter.holen()
            erg = analysiere(img, modelle, zustand)
        hand, erk = erg["hand"], erg["erg"]
        name, sicher = _glaetten(zustand, erk)
        extra = {"detail_ms": erg["ms"], "buchstabe": None, "steuerung": None, "zustand": "keine_hand",
                 "sicher": 0.0, "kandidaten": [], "ziel": zustand.ziel}
        if hand is not None:
            if name is not None:
                art = "steuerung" if name in STEUERZEICHEN else "buchstabe"
                extra["zustand"] = "erkannt"
                extra["steuerung" if art == "steuerung" else "buchstabe"] = name
                extra["sicher"] = round(sicher, 2)
            else:
                extra["zustand"] = "keine_form" if erk["art"] == "keine" else "unsicher"
                extra["vermutung"] = erk.get("vermutung")
                extra["sicher"] = round(float(erk["sicher"]), 2)
            extra["kandidaten"] = erk["kandidaten"]
            extra["seite"] = hand["hand"]["seite"]
            extra["hand_sicher"] = hand["hand"]["sicher"]
            hb, wb = img.shape[:2]
            extra["punkte"] = [[round(float(x) / wb, 3), round(float(y) / hb, 3)] for x, y in hand["punkte"][:, :2]]
            if zustand.ziel:
                namen, sich, abst, _m = v.klassifiziere(hand["punkte"][:, :2])
                i = namen.index(zustand.ziel)
                extra["ziel_sicher"] = round(float(sich[i]), 2)
                extra["ziel_abstand"] = round(float(abst[i]), 2)
                extra["hinweise"] = hinweise(hand["punkte"][:, :2], zustand.ziel, v)
            _zeichne(img, hand, name, sicher)
        return (1 if hand is not None else 0), extra


kamera_modi.registriere(_GebaerdeModus())
