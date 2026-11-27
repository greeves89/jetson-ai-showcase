#!/usr/bin/env python3
"""Baut die Handformen des Fingeralphabets (Labor "Fingeralphabet") als Handpunkt-Vorlagen.

Aufruf (aus dem Repo-Wurzelordner, braucht nur numpy):  python3 scripts/gebaerde_vorlagen_bauen.py
Schreibt app/static/daten/gebaerde-vorlagen.json. Das ist die EINE Datenquelle des Labors:
  - die Erkennung (app/lab_gebaerde.py) liest daraus die Merkmale jeder Vorlage,
  - die Seite (app/static/demo-gebaerde.js) zeichnet daraus die Hände als Vektorgrafik.
So laufen Erkennen und Zeigen nicht auseinander. tests/gebaerde_test.py prüft, dass die Datei zu diesem Skript passt.

Wie die Vorlagen entstehen: Es gibt kein Bildmaterial und keine Trainingsdaten. Jede Handform ist ein einfaches
Handmodell (Handfläche, vier Finger mit je drei Gliedern, Daumen mit drei Gliedern, Beugewinkel je Gelenk), das
ich nach der Beschreibung des deutschen Einhand-Fingeralphabets selbst eingestellt habe, dann gedreht (Drehung der
Hand im Bild, Seitenansicht) und auf die Bildebene projiziert. Die 21 Punkte haben dieselbe Reihenfolge wie beim
Handmodell des Labors (0 Handgelenk, 1-4 Daumen, 5-8 Zeigefinger, 9-12 Mittelfinger, 13-16 Ringfinger, 17-20 kleiner Finger).
Einheit: Handflächenlänge (Handgelenk bis Mittelfingerwurzel) ist 1. x nach rechts, y nach unten, z zum Betrachter.
Die Vorlagen sind Modelle der Handformen und KEINE Messungen an echten Händen.
"""
import json
import math
import sys
from pathlib import Path

import numpy as np

WURZEL = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(WURZEL))
ZIEL = WURZEL / "app" / "static" / "daten" / "gebaerde-vorlagen.json"

# ------------------------------------------------------------------ Handmodell (neutral: Handfläche zum Betrachter, Finger nach oben, Daumen links)
MCP = {"zeige": (-0.31, -0.97), "mittel": (-0.10, -1.00), "ring": (0.11, -0.96), "klein": (0.30, -0.86)}
GLIEDER = {"zeige": (0.40, 0.22, 0.20), "mittel": (0.44, 0.25, 0.21), "ring": (0.41, 0.24, 0.20), "klein": (0.32, 0.18, 0.18)}
FINGER = ("zeige", "mittel", "ring", "klein")
DAUMEN_WURZEL = (-0.24, -0.14, 0.0)
DAUMEN_GLIEDER = (0.27, 0.24, 0.20)
BASIS = {"zeige": 5, "mittel": 9, "ring": 13, "klein": 17}

GERADE = (0, 0, 0)
FAUST = (70, 95, 60)         # Beugung in MCP, PIP, DIP (Grad, Summe wird mitgezählt)
KRALLE = (48, 62, 38)
RUND = (40, 55, 35)


def _r(grad):
    return math.radians(grad)


def finger_punkte(name, abd=0.0, beuge=GERADE):
    """4 Punkte (Wurzel, PIP, DIP, Spitze) eines Fingers im neutralen Handkoordinatensystem."""
    x0, y0 = MCP[name]
    p = [np.array([x0, y0, 0.0])]
    oben = np.array([math.sin(_r(abd)), -math.cos(_r(abd)), 0.0])
    z = np.array([0.0, 0.0, 1.0])
    e = 0.0
    for laenge, b in zip(GLIEDER[name], beuge):
        e += b
        richtung = oben * math.cos(_r(e)) + z * math.sin(_r(e))
        p.append(p[-1] + laenge * richtung)
    return p


def daumen_punkte(winkel):
    """winkel: ((a1, e1), (a2, e2), (a3, e3)): a = Richtung in der Handebene (Grad von oben, nach rechts positiv),
    e = Hebung zum Betrachter. Gibt die Punkte 1 bis 4 zurück."""
    p = [np.array(DAUMEN_WURZEL, dtype=float)]
    for laenge, (a, e) in zip(DAUMEN_GLIEDER, winkel):
        richtung = np.array([math.sin(_r(a)) * math.cos(_r(e)), -math.cos(_r(a)) * math.cos(_r(e)), math.sin(_r(e))])
        p.append(p[-1] + laenge * richtung)
    return p


def daumen_zu(ziel, start, abstand=0.0):
    """Stellt den Daumen so ein, dass seine Spitze `ziel` berührt (Koordinatenabstieg, deterministisch).
    start: Ausgangshaltung ((a, e) je Glied), die so wenig wie möglich verändert wird."""
    ziel = np.asarray(ziel, dtype=float)
    par = np.array([v for ae in start for v in ae], dtype=float)
    par0 = par.copy()
    grenzen = [(-110, 110), (-40, 85)] * 3

    def kosten(q):
        spitze = daumen_punkte([(q[0], q[1]), (q[2], q[3]), (q[4], q[5])])[-1]
        return float(np.sum((spitze - ziel) ** 2) * 1000 + np.sum(((q - par0) / 90.0) ** 2) * 0.4) + (0 if abstand == 0 else 0)
    best = kosten(par)
    schritt = 20.0
    while schritt > 0.2:
        besser = False
        for i in range(6):
            for s in (-schritt, schritt):
                q = par.copy()
                q[i] = min(max(q[i] + s, grenzen[i][0]), grenzen[i][1])
                c = kosten(q)
                if c < best - 1e-9:
                    best, par, besser = c, q, True
        if not besser:
            schritt /= 2
    return [(par[0], par[1]), (par[2], par[3]), (par[4], par[5])]


# Daumenhaltungen als Ausgangswerte
T_AUS = ((-55, 5), (-70, 5), (-80, 5))              # abgespreizt (L, Y)
T_SEITE = ((-22, 12), (-6, 12), (0, 12))            # an der Faust anliegend, Spitze nach oben (A)
T_QUER = ((40, 40), (65, 48), (80, 52))             # quer über die Handfläche (B)
T_FAUST = ((35, 50), (60, 52), (75, 48))            # vor den gebeugten Fingern (S, I, R, U)
T_RUNDE = ((10, 30), (20, 45), (30, 50))


def dreh_y(p, grad):
    c, s = math.cos(_r(grad)), math.sin(_r(grad))
    return np.array([p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c])


def dreh_x(p, grad):
    c, s = math.cos(_r(grad)), math.sin(_r(grad))
    return np.array([p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c])


def dreh_z(p, grad):
    c, s = math.cos(_r(grad)), math.sin(_r(grad))
    return np.array([p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]])


_JITTER = {"rng": None, "grad": 0.0}      # gesetzt: jeder Winkel wird gestreut (Ausführungsvarianten für die Einstufung)


def _j(wert, faktor=1.0):
    r = _JITTER["rng"]
    return wert if r is None else wert + float(r.normal(0.0, _JITTER["grad"] * faktor))


def hand(finger, daumen, seitlich=0.0, kipp=0.0, drehung=0.0, daumen_ziel=None):
    """Baut die 21 Punkte. finger: {name: (abd, (b1, b2, b3))}; daumen: Haltung; seitlich: Drehung um die Handachse
    (90 = Seitenansicht, Handfläche nach rechts); kipp: Neigung der Finger zum Betrachter; drehung: Drehung in der
    Bildebene im Uhrzeigersinn. daumen_ziel: Funktion (Punkte der Finger) -> Zielpunkt, die Daumenspitze berührt ihn."""
    pts = [np.zeros(3)] + [None] * 20
    for name in FINGER:
        abd, beuge = finger.get(name, (0.0, GERADE))
        abd, beuge = _j(abd, 0.5), tuple(_j(b) for b in beuge)
        for k, q in enumerate(finger_punkte(name, abd, beuge)):
            pts[BASIS[name] + k] = q
    if daumen_ziel is not None:
        daumen = daumen_zu(daumen_ziel(pts), daumen)
    daumen = [(_j(a), _j(e)) for a, e in daumen]
    for k, q in enumerate(daumen_punkte(daumen)):
        pts[1 + k] = q
    seitlich, kipp, drehung = _j(seitlich, 1.0) if seitlich else _j(0.0, 0.5), _j(kipp, 0.5), _j(drehung, 0.7)
    out = []
    for q in pts:
        q = dreh_y(q, seitlich) if seitlich else q
        q = dreh_x(q, kipp) if kipp else q
        q = dreh_z(q, drehung) if drehung else q
        out.append(q)
    return np.array(out)


F = {}        # Kurzformen


def fg(*namen, abd=None, beuge=GERADE):
    return {n: ((abd or {}).get(n, 0.0), beuge) for n in namen}


def faust_der_rest(gestreckt, abd=None, beuge_gestreckt=GERADE, beuge_rest=FAUST):
    d = {}
    for n in FINGER:
        if n in gestreckt:
            d[n] = ((abd or {}).get(n, 0.0), beuge_gestreckt)
        else:
            d[n] = (0.0, beuge_rest)
    return d


def spitze(pts, name):
    return pts[BASIS[name] + 3]


def mitte(pts, name, k):
    return pts[BASIS[name] + k]


# ------------------------------------------------------------------ die Buchstaben
def vorlagen():
    V = {}
    # A: Faust, Daumen seitlich angelegt (Spitze zeigt nach oben)
    V["A"] = hand(faust_der_rest([]), T_SEITE)
    # B: flache Hand, Finger zusammen nach oben, Daumen quer über der Handfläche
    V["B"] = hand(faust_der_rest(FINGER), T_QUER)
    # C: Daumen und Finger bilden einen offenen Halbkreis (Seitenansicht)
    V["C"] = hand({n: (0.0, (28, 38, 26)) for n in FINGER}, ((0, 45), (0, 38), (0, 26)), seitlich=90)
    # D: Zeigefinger nach oben, Daumen und die anderen drei Finger bilden einen Kreis (Seitenansicht)
    V["D"] = hand({"zeige": (0.0, GERADE), "mittel": (0.0, (50, 62, 40)), "ring": (0.0, (52, 64, 42)), "klein": (0.0, (54, 62, 40))},
                  T_RUNDE, seitlich=90, daumen_ziel=lambda p: spitze(p, "mittel") + np.array([0.0, 0.02, 0.0]))
    # E: Finger gekrümmt, Daumen quer davor, Fingerspitzen liegen am Daumen
    V["E"] = hand({n: (0.0, KRALLE) for n in FINGER}, T_QUER, daumen_ziel=lambda p: (spitze(p, "mittel") + spitze(p, "ring")) / 2 + np.array([0.0, 0.1, 0.07]))
    # F: Daumen und Zeigefinger bilden einen Ring, die anderen drei Finger stehen nach oben gespreizt
    V["F"] = hand({"zeige": (0.0, (42, 52, 36)), "mittel": (-2.0, GERADE), "ring": (6.0, GERADE), "klein": (14.0, GERADE)},
                  T_RUNDE, seitlich=40, daumen_ziel=lambda p: spitze(p, "zeige"))
    # G: Hand waagerecht (Finger nach links), Zeigefinger gestreckt, übrige Finger geschlossen, Daumen angelegt
    V["G"] = hand(faust_der_rest(["zeige"]), T_FAUST, seitlich=20, drehung=-90)
    # H: wie G, aber Zeige- und Mittelfinger gestreckt und zusammen
    V["H"] = hand(faust_der_rest(["zeige", "mittel"], abd={"zeige": 1.5, "mittel": -1.5}), T_FAUST, seitlich=20, drehung=-90)
    # I: Faust, Daumen davor, kleiner Finger nach oben
    V["I"] = hand(faust_der_rest(["klein"]), T_FAUST)
    # K: Zeige- und Mittelfinger gespreizt nach oben, Daumen lehnt am Mittelfinger
    V["K"] = hand(faust_der_rest(["zeige", "mittel"], abd={"zeige": -10.0, "mittel": 12.0}), T_QUER,
                  daumen_ziel=lambda p: (mitte(p, "mittel", 0) + mitte(p, "mittel", 1)) / 2 + np.array([0.0, 0.0, 0.06]))
    # L: Zeigefinger nach oben, Daumen im rechten Winkel abgespreizt
    V["L"] = hand(faust_der_rest(["zeige"]), ((-62, 4), (-78, 4), (-86, 4)))
    # M: Hand zeigt nach unten, Zeige-, Mittel- und Ringfinger hängen über dem Daumen, kleiner Finger geschlossen
    V["M"] = hand({"zeige": (0.0, (8, 6, 4)), "mittel": (0.0, (8, 6, 4)), "ring": (0.0, (8, 6, 4)), "klein": (0.0, FAUST)}, ((60, -30), (82, -30), (88, -30)), drehung=180)
    # N: wie M, aber nur Zeige- und Mittelfinger hängen über dem Daumen
    V["N"] = hand({"zeige": (0.0, (8, 6, 4)), "mittel": (0.0, (8, 6, 4)), "ring": (0.0, FAUST), "klein": (0.0, FAUST)}, ((60, -30), (82, -30), (88, -30)), drehung=180)
    # O: alle Finger und der Daumen bilden einen geschlossenen Kreis (Seitenansicht)
    V["O"] = hand({"zeige": (0.0, (44, 56, 36)), "mittel": (0.0, (48, 58, 38)), "ring": (0.0, (50, 58, 38)), "klein": (0.0, (52, 56, 36))},
                  T_RUNDE, seitlich=90, daumen_ziel=lambda p: (spitze(p, "zeige") + spitze(p, "mittel")) / 2)
    # P: Hand zeigt nach unten, Zeigefinger nach vorn (zum Betrachter), Mittelfinger nach unten, Daumen berührt ihn
    V["P"] = hand({"zeige": (0.0, (80, 0, 0)), "mittel": (0.0, GERADE), "ring": (0.0, FAUST), "klein": (0.0, FAUST)}, T_QUER,
                  drehung=180, daumen_ziel=lambda p: (mitte(p, "mittel", 0) + mitte(p, "mittel", 1)) / 2 + np.array([0.0, 0.0, 0.06]))
    # Q: Hand zeigt nach unten, Zeigefinger und Daumen gestreckt nach unten
    V["Q"] = hand(faust_der_rest(["zeige"]), ((-4, 10), (-2, 6), (0, 4)), drehung=180)
    # R: Zeige- und Mittelfinger nach oben gekreuzt
    V["R"] = hand(faust_der_rest(["zeige", "mittel"], abd={"zeige": 14.0, "mittel": -8.0}), T_FAUST)
    # S: Faust, Daumen quer vor den Fingern
    V["S"] = hand(faust_der_rest([]), T_FAUST)
    # T: wie G, aber der Daumen liegt auf dem Zeigefinger
    V["T"] = hand(faust_der_rest(["zeige"]), T_FAUST, seitlich=20, drehung=-90,
                  daumen_ziel=lambda p: mitte(p, "zeige", 2) + np.array([0.0, 0.0, 0.08]))
    # U: Zeige- und Mittelfinger gestreckt und zusammen, Daumen hält die anderen Finger
    V["U"] = hand(faust_der_rest(["zeige", "mittel"], abd={"zeige": 1.5, "mittel": -1.5}), T_FAUST)
    # V: wie U, aber gespreizt
    V["V"] = hand(faust_der_rest(["zeige", "mittel"], abd={"zeige": -9.0, "mittel": 9.0}), T_FAUST)
    # W: Zeige-, Mittel- und Ringfinger gespreizt nach oben, Daumen hält den kleinen Finger
    V["W"] = hand(faust_der_rest(["zeige", "mittel", "ring"], abd={"zeige": -12.0, "mittel": 0.0, "ring": 12.0}), T_FAUST,
                  daumen_ziel=lambda p: spitze(p, "klein") + np.array([0.0, 0.0, 0.06]))
    # X: Hand waagerecht, Zeigefinger nach oben abgewinkelt wie ein Haken
    V["X"] = hand({"zeige": (0.0, (80, 55, 30)), "mittel": (0.0, FAUST), "ring": (0.0, FAUST), "klein": (0.0, FAUST)}, T_FAUST, seitlich=90, drehung=-90)
    # Y: Daumen und kleiner Finger abgespreizt, Rest Faust
    V["Y"] = hand(faust_der_rest(["klein"], abd={"klein": 16.0}), ((-55, 5), (-70, 5), (-80, 5)))
    # Zeichen für Steuerung (Gesten, keine Buchstaben)
    V["LEER"] = hand(faust_der_rest(FINGER, abd={"zeige": -14.0, "mittel": -4.0, "ring": 6.0, "klein": 16.0}), ((-60, 5), (-72, 5), (-82, 5)))
    V["LOESCHEN"] = hand(faust_der_rest([]), ((-75, 5), (-85, 5), (-90, 5)), drehung=-90)
    return V


BESCHREIBUNG = {
    "A": "Faust, der Daumen liegt seitlich an und zeigt nach oben.",
    "B": "Flache Hand, die Finger zusammen nach oben, der Daumen quer über der Handfläche.",
    "C": "Daumen und Finger bilden einen offenen Halbkreis, wie der Buchstabe C.",
    "D": "Der Zeigefinger zeigt nach oben. Daumen und die anderen Finger bilden einen geschlossenen Kreis.",
    "E": "Die Finger sind gekrümmt, der Daumen liegt quer davor, die Fingerspitzen berühren ihn.",
    "F": "Daumen und Zeigefinger bilden einen Ring. Die drei anderen Finger stehen gespreizt nach oben.",
    "G": "Die Hand liegt waagerecht, der Zeigefinger zeigt zur Seite, die anderen Finger sind geschlossen.",
    "H": "Wie G, aber Zeige- und Mittelfinger zeigen nebeneinander zur Seite.",
    "I": "Faust mit dem Daumen davor, der kleine Finger zeigt nach oben.",
    "K": "Zeige- und Mittelfinger zeigen gespreizt nach oben, der Daumen lehnt am Mittelfinger.",
    "L": "Der Zeigefinger zeigt nach oben, der Daumen im rechten Winkel zur Seite.",
    "M": "Die Hand zeigt nach unten. Zeige-, Mittel- und Ringfinger liegen über dem eingeklemmten Daumen.",
    "N": "Wie M, aber nur Zeige- und Mittelfinger liegen über dem Daumen.",
    "O": "Alle Finger und der Daumen bilden einen geschlossenen Kreis.",
    "P": "Die Hand zeigt nach unten, der Zeigefinger nach vorn, der Mittelfinger nach unten, der Daumen berührt ihn.",
    "Q": "Die Hand zeigt nach unten, Zeigefinger und Daumen zeigen gestreckt nach unten.",
    "R": "Zeige- und Mittelfinger zeigen nach oben und sind gekreuzt.",
    "S": "Faust, der Daumen liegt quer vor den Fingern.",
    "T": "Die Hand liegt waagerecht, der Zeigefinger zeigt zur Seite, der Daumen liegt darauf.",
    "U": "Zeige- und Mittelfinger zeigen zusammen nach oben, der Daumen hält die anderen Finger.",
    "V": "Wie U, aber Zeige- und Mittelfinger sind gespreizt.",
    "W": "Zeige-, Mittel- und Ringfinger zeigen gespreizt nach oben, der Daumen hält den kleinen Finger.",
    "X": "Die Hand liegt waagerecht, der Zeigefinger ist nach oben abgewinkelt wie ein Haken.",
    "Y": "Faust, Daumen und kleiner Finger sind abgespreizt.",
    "LEER": "Ganz offene Hand mit gespreizten Fingern.",
    "LOESCHEN": "Faust, der Daumen zeigt nach unten.",
}

# Buchstaben, die sich bewegen oder keine eigene feste Handform haben: sie werden nicht erkannt, nur gezeigt.
# basis: Vorlage, deren Handform als Grundform dient; bewegung: Schlüsselbilder (dx, dy, Drehung um die Handachse in Grad),
# in Einheiten der Handflächenlänge.
BEWEGT = {
    "J": {"basis": "I", "grund": "Handform wie I, dazu eine Drehbewegung der Hand um die senkrechte Achse.",
          "bewegung": [[0, 0, 0], [0, 0, 55], [0, 0, 0]]},
    "Z": {"basis": "G", "grund": "Zeigefinger zeichnet ein Zickzack in die Luft, die Handform allein sagt es nicht.",
          "bewegung": [[0.3, -0.3, 0], [-0.3, -0.3, 0], [0.3, 0.3, 0], [-0.3, 0.3, 0]], "nur_zeigefinger": True},
    "Ä": {"basis": "A", "grund": "Handform wie A, dazu eine kurze Bewegung der Hand nach unten.",
          "bewegung": [[0, 0, 0], [0, 0.35, 0], [0, 0, 0]]},
    "Ö": {"basis": "O", "grund": "Handform wie O, dazu eine kurze Bewegung der Hand nach unten.",
          "bewegung": [[0, 0, 0], [0, 0.35, 0], [0, 0, 0]]},
    "Ü": {"basis": "U", "grund": "Handform wie U, dazu eine kurze Bewegung der Hand nach unten.",
          "bewegung": [[0, 0, 0], [0, 0.35, 0], [0, 0, 0]]},
    "ß": {"basis": "S", "grund": "Handform wie S, dazu eine kurze Bewegung der Hand nach unten.",
          "bewegung": [[0, 0, 0], [0, 0.35, 0], [0, 0, 0]]},
    "Sch": {"basis": "LEER", "grund": "Flache Hand mit gespreizten Fingern, das ist dieselbe Handform wie die Geste für das Leerzeichen.",
            "bewegung": [[0, 0, 0]]},
}

BUCHSTABEN = list("ABCDEFGHIKLMNOPQRSTUVWXY")      # fest erkannt (J und Z sind bewegt)
ALLE = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ") + ["Ä", "Ö", "Ü", "ß", "Sch"]


VORLAGEN_FN = None


def bauen(mit_stufen=True):
    V = vorlagen()
    daten = {
        "einheit": "Handflächenlänge (Handgelenk bis Mittelfingerwurzel) = 1; x rechts, y unten, z zum Betrachter",
        "hinweis": "Handformen modelliert nach der Beschreibung des deutschen Einhand-Fingeralphabets, keine Messung an echten Händen.",
        "vorlagen": {},
        "bewegt": BEWEGT,
    }
    for k, p in V.items():
        daten["vorlagen"][k] = {"beschreibung": BESCHREIBUNG[k], "punkte": [[round(float(v), 3) for v in q] for q in p]}
    if mit_stufen:
        daten["stufen"] = stufen_messen(daten)
    return daten


STREUUNG_GRAD = 14.0       # Standardabweichung jedes Winkels der Ausführungsvarianten
RAUSCHEN_MESS = 0.03       # dazu Rauschen auf den Punkten (Anteil der Handgröße), Drehung bis 15 Grad
VARIANTEN = 40


def stufen_messen(daten, seed=20261127):
    """Misst für jede feste Vorlage, wie oft eine Ausführungsvariante (alle Winkel gestreut, Punkte verrauscht, Hand leicht gedreht)
    als die richtige Handform erkannt wird, und mit welcher anderen sie verwechselt wird. Die Vorlagen selbst bleiben unverändert.
    Stufen: sicher (Treffer >= 0,85 und Nachbar weit weg), unsicher (Treffer >= 0,5), schwach (darunter).
    Das ist eine Messung an MODELLEN: Sie sagt, wie leicht die Handformen untereinander zu verwechseln sind, nicht, wie gut
    echte Hände erkannt werden."""
    from app import lab_gebaerde as L
    v = L.Vorlagen(daten)
    rng = np.random.default_rng(seed)
    aus = {}
    for name in v.namen:
        richtig = 0
        verwechselt = {}
        for _ in range(VARIANTEN):
            _JITTER["rng"], _JITTER["grad"] = rng, STREUUNG_GRAD
            try:
                p = VORLAGEN_FN()[name]
            finally:
                _JITTER["rng"] = None
            s = float(np.mean([np.linalg.norm(p[i, :2] - p[0, :2]) for i in (5, 9, 13, 17)]))
            q = L.stoeren(p[:, :2], s, rng, RAUSCHEN_MESS, 15.0)
            erg = L.erkenne(q, v)
            if erg["name"] == name:
                richtig += 1
            else:
                nb = erg["name"] or erg.get("vermutung") or erg["kandidaten"][0][0]
                if nb != name:
                    verwechselt[nb] = verwechselt.get(nb, 0) + 1
        quote = richtig / VARIANTEN
        d_nah = sorted((float(x), v.namen[i]) for i, x in enumerate(v.abstaende(v.m[v.index[name]])) if v.namen[i] != name)[0]
        nachbar = max(verwechselt, key=verwechselt.get) if verwechselt else d_nah[1]
        aus[name] = {"stufe": "sicher" if quote >= 0.85 else "unsicher" if quote >= 0.5 else "schwach",
                     "treffer": round(quote, 2), "nachbar": nachbar, "abstand": round(d_nah[0], 1)}
    return aus


VORLAGEN_FN = vorlagen
CONTENT = WURZEL / "app" / "static" / "content-gebaerde.js"


def messung_block(daten):
    """Der Block MESSUNG für content-gebaerde.js: die Tabelle der Seite kommt aus derselben Messung wie die JSON-Datei."""
    st = daten["stufen"]
    sicher = [z for z in BUCHSTABEN if st[z]["stufe"] == "sicher"]
    unsicher = [[z, st[z]["nachbar"]] for z in BUCHSTABEN if st[z]["stufe"] != "sicher"]
    return "/*MESSUNG:BEGIN*/\nconst MESSUNG = " + json.dumps({"sicher": sicher, "unsicher": unsicher}, ensure_ascii=False) + ";\n/*MESSUNG:ENDE*/"


def content_aktualisieren(daten):
    if not CONTENT.is_file():
        return
    text = CONTENT.read_text(encoding="utf-8")
    a, b = text.index("/*MESSUNG:BEGIN*/"), text.index("/*MESSUNG:ENDE*/") + len("/*MESSUNG:ENDE*/")
    neu = text[:a] + messung_block(daten) + text[b:]
    if neu != text:
        CONTENT.write_text(neu, encoding="utf-8")


def main():
    daten = bauen()
    ZIEL.parent.mkdir(parents=True, exist_ok=True)
    ZIEL.write_text(json.dumps(daten, ensure_ascii=False, indent=1, sort_keys=False) + "\n", encoding="utf-8")
    content_aktualisieren(daten)
    print("geschrieben:", ZIEL.relative_to(WURZEL), len(daten["vorlagen"]), "Vorlagen")
    for k, s in daten.get("stufen", {}).items():
        print(f"  {k:9s} {s['stufe']:8s} Treffer {s['treffer']:.2f} Nachbar {s['nachbar']} (Abstand {s['abstand']:.2f})")


if __name__ == "__main__":
    main()
