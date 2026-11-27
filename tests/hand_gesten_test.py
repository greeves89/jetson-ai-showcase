"""Regeltest der Gestenerkennung (app/lab_hand.py) mit künstlichen Handskeletten, ohne Modelle und ohne Kamera.
Aufruf (aus dem Repo-Wurzelordner, braucht numpy und opencv): python3 tests/hand_gesten_test.py"""
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app import lab_hand as L  # noqa: E402


def hand(gestreckt, daumen, drehung=0.0, daumen_richtung="seite"):
    """21 Punkte einer rechten Hand mit Fingern nach oben (y nach unten, Handgelenk bei (0, 0)).
    gestreckt: Namen der gestreckten Finger; daumen: Daumen gestreckt; drehung in Grad."""
    p = np.zeros((21, 2))
    x_basis = {"zeige": -30.0, "mittel": -10.0, "ring": 10.0, "klein": 28.0}
    for name, x in x_basis.items():
        mcp, pip, dip, tip = L.FINGER[name]
        p[mcp] = (x, -90)
        if name in gestreckt:
            p[pip], p[dip], p[tip] = (x, -130), (x, -152), (x, -172)
        else:                                            # eingerollt: Spitze zeigt zur Handfläche zurück
            p[pip], p[dip], p[tip] = (x, -120), (x, -100), (x, -78)
    t1, t2, t3, t4 = L.FINGER["daumen"]
    p[t1], p[t2] = (-30, -20), (-45, -45)
    if daumen:
        if daumen_richtung == "hoch":
            p[t3], p[t4] = (-48, -100), (-50, -135)
        elif daumen_richtung == "runter":
            p[t1], p[t2], p[t3], p[t4] = (-30, -20), (-45, 0), (-48, 30), (-50, 60)
        else:
            p[t3], p[t4] = (-70, -60), (-95, -75)
    else:
        p[t3], p[t4] = (-30, -55), (-15, -60)
    if drehung:
        w = np.radians(drehung)
        r = np.array([[np.cos(w), -np.sin(w)], [np.sin(w), np.cos(w)]])
        p = p @ r.T
    return p


FAELLE = [
    ("offene Hand", hand(["zeige", "mittel", "ring", "klein"], True), 5),
    ("offene Hand", hand(["zeige", "mittel", "ring", "klein"], False), 4),
    ("Faust", hand([], False), 0),
    ("Daumen hoch", hand([], True, daumen_richtung="hoch"), 1),
    ("Daumen runter", hand([], True, daumen_richtung="runter"), 1),
    ("Victory", hand(["zeige", "mittel"], False), 2),
    ("Zeigefinger", hand(["zeige"], False), 1),
    ("3 Finger", hand(["zeige", "mittel", "ring"], False), 3),
    ("Faust mit Daumen", hand([], True), 1),
]
fehler = 0
for soll, punkte, n in FAELLE:
    for grad in (0, 25, -25):                              # gedrehte Hand muss genauso erkannt werden
        p = punkte if grad == 0 else punkte @ np.array([[np.cos(np.radians(grad)), -np.sin(np.radians(grad))], [np.sin(np.radians(grad)), np.cos(np.radians(grad))]]).T
        geste, zahl = L.erkenne_geste(p)
        ok = geste == soll and zahl == n
        if "Daumen" in soll and grad:                      # Daumen hoch/runter gilt im Bild, nicht an der Hand: gedreht nicht prüfen
            continue
        print(("OK    " if ok else "FEHLT ") + f"{soll} bei {grad} Grad: {geste}, {zahl} Finger")
        fehler += not ok

# Kopfhaltung: fünf YuNet-Punkte (rechtes Auge, linkes Auge, Nase, Mundwinkel rechts, links)
def gesicht(nase_dx=0.0, neigung=0.0):
    f = np.zeros(15)
    augen = np.array([[40.0, 50.0], [80.0, 50.0]])
    w = np.radians(neigung)
    r = np.array([[np.cos(w), -np.sin(w)], [np.sin(w), np.cos(w)]])
    augen = (augen - 60) @ r.T + 60
    f[4:8] = augen.reshape(-1)
    f[8:10] = (60 + nase_dx * 40, 75)
    f[10:14] = (45, 95, 75, 95)
    return f

for soll, f in [("geradeaus", gesicht()), ("rechts", gesicht(nase_dx=0.5)), ("links", gesicht(nase_dx=-0.5)), ("geneigt", gesicht(neigung=25)), ("geneigt", gesicht(neigung=-25)), ("geradeaus", gesicht(nase_dx=0.1, neigung=5))]:
    k = L.kopfhaltung(f)
    ok = k == soll
    print(("OK    " if ok else "FEHLT ") + f"Kopf {soll}: {k}")
    fehler += not ok

# Anker: 2016 Punkte im Bildbereich
ok = L.ANKER.shape == (2016, 2) and L.ANKER.min() > 0 and L.ANKER.max() < 1
print(("OK    " if ok else "FEHLT ") + "Anker 2016 Punkte")
fehler += not ok
sys.exit(1 if fehler else 0)
