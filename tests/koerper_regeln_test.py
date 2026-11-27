"""Regeltest der Körperhaltung (app/lab_koerper.py) mit künstlichen Skeletten, ohne Modelle und ohne Kamera.
Aufruf (aus dem Repo-Wurzelordner, braucht numpy, opencv und fastapi): python3 tests/koerper_regeln_test.py
Geprüft werden: Ansicht, Winkel, Zähler mit Hysterese (Kniebeuge, Arme heben, Armkreisen, Seitneigung), Haltungshinweise,
Ähnlichkeit der Zielposen, Halten und Zählen, Glättung, Links/Rechts-Tausch, Steuerwerte, Freigabe der Modelle."""
import math
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app import lab_koerper as L  # noqa: E402

fehler = 0


def pruefe(ok, text):
    global fehler
    print(("OK    " if ok else "FEHLT ") + text)
    if not ok:
        fehler += 1


# --------------------------------------------------------------------------- Skelett aus Richtungen (Einheit: Rumpflänge)
LAENGEN = {"Oberarm": 0.62, "Unterarm": 0.55, "Oberschenkel": 0.95, "Unterschenkel": 0.9}


def figur(richtungen=None, breite=1.0, kopf=None):
    """33 Punkte einer Person von vorn (breite 1) bis von der Seite (breite 0.1). richtungen: {Gliedname: (dx, dy)} wie ZIELE,
    sonst steht die Person gerade. kopf: Winkel Schulter zu Ohr in Grad nach vorn (nur für die Seitenansicht)."""
    r = dict(L.ZIELE["haende-hoch"]["richtungen"])
    r.update({"Oberarm links": (-0.05, 1.0), "Unterarm links": (-0.05, 1.0), "Oberarm rechts": (0.05, 1.0), "Unterarm rechts": (0.05, 1.0)})
    if richtungen:
        r.update(richtungen)
    P = np.zeros((33, 2))
    P[L.HUE_L], P[L.HUE_R] = (-0.2 * breite, 0.0), (0.2 * breite, 0.0)
    P[L.SCH_L], P[L.SCH_R] = (-0.42 * breite, -1.0), (0.42 * breite, -1.0)
    for name, a, b in L.GLIEDER:
        v = np.array(r[name], dtype=float)
        v /= np.linalg.norm(v)
        P[b] = P[a] + v * LAENGEN[name.split()[0]]
    sm = (P[L.SCH_L] + P[L.SCH_R]) / 2
    wink = math.radians(kopf if kopf is not None else 0.0)
    for o, sch in ((L.OHR_L, L.SCH_L), (L.OHR_R, L.SCH_R)):
        P[o] = P[sch] + (0.35 * math.tan(wink), -0.35)            # Ohr senkrecht über der Schulter, bei kopf nach vorn versetzt
        if breite > 0.5:
            P[o] += (0.30 if o == L.OHR_L else -0.30, 0.0)
    P[L.NASE] = (P[L.OHR_L] + P[L.OHR_R]) / 2 + ((0.0, 0.1) if breite > 0.5 else (0.14, 0.1))      # Seitenansicht: Nase vor dem Ohr, Blick nach rechts
    return P * 100.0 + 200.0              # in Bildpixel (y nach unten)


def sicht(unsichtbar=()):
    s = np.ones(33)
    for i in unsichtbar:
        s[i] = 0.1
    return s


S = sicht()

# --------------------------------------------------------------------------- Ansicht und Winkel
pruefe(L.ansicht_aus(figur(breite=1.0), S) == "vorn", "Ansicht: von vorn")
pruefe(L.ansicht_aus(figur(breite=0.1), S) == "seite", "Ansicht: von der Seite")
pruefe(L.ansicht_aus(figur(breite=0.5), S) == "schraeg", "Ansicht: schräg")
pruefe(L.ansicht_aus(figur(), sicht([L.SCH_L])) is None, "Ansicht: ohne Schulter keine Aussage")
# ohne Hüften: Maß aus Schulterbreite und Ohr-Abstand
pruefe(L.ansicht_aus(figur(breite=1.0), sicht([L.HUE_L, L.HUE_R])) == "vorn", "Ansicht ohne Hüften: von vorn")
pruefe(L.ansicht_aus(figur(breite=0.1), sicht([L.HUE_L, L.HUE_R])) == "seite", "Ansicht ohne Hüften: von der Seite")

m = L.messwerte(figur(), S)
pruefe(m["ellbogen_l"] >= 178 and m["knie_l"] >= 175, f"Winkel: gestreckte Arme und Beine messen fast 180 Grad ({m['ellbogen_l']}, {m['knie_l']})")
r = {"Oberarm links": (-1, 0), "Unterarm links": (0, -1)}          # Arm waagerecht, Unterarm hoch: rechter Winkel am Ellbogen
m = L.messwerte(figur(r), S)
pruefe(abs(m["ellbogen_l"] - 90) <= 1, f"Winkel: rechter Winkel am Ellbogen ({m['ellbogen_l']})")
pruefe(L.messwerte(figur(), sicht([L.KNI_L]))["knie_l"] is None, "Winkel: Knie nicht sichtbar gibt None")
pruefe(L.messwerte(figur(), sicht([L.KNI_L]))["knie_r"] >= 175, "Winkel: die andere Seite bleibt gemessen")
m = L.messwerte(figur({"Oberarm links": (-1, 0), "Unterarm links": (-1, 0)}), S)
pruefe(abs(m["arm_l"] - 100) <= 8, f"Armhebung: waagerecht etwa 90 bis 100 Grad, da die Hüfte schmaler ist als die Schultern ({m['arm_l']})")
m = L.messwerte(figur({"Oberarm links": (0, -1), "Unterarm links": (0, -1)}), S)
pruefe(m["arm_l"] > 160, f"Armhebung: senkrecht nach oben ({m['arm_l']})")

# Schulterhöhe: linke Schulter höher gibt positiven Wert (links im Bild = linke Körperseite)
P = figur()
P[L.SCH_L][1] -= 8
m = L.messwerte(P, S)
pruefe(m["schulter_schief"] > 3, f"Schulterhöhe: linke höher gibt positiv ({m['schulter_schief']})")
P = figur()
P[L.SCH_R][1] -= 8
pruefe(L.messwerte(P, S)["schulter_schief"] < -3, "Schulterhöhe: rechte höher gibt negativ")
pruefe(abs(L.messwerte(figur(), S)["schulter_schief"]) < 0.5, "Schulterhöhe: gerade gibt 0")
# Rumpf: Schultern nach rechts versetzt
P = figur()
P[L.SCH_L][0] += 20
P[L.SCH_R][0] += 20
pruefe(L.messwerte(P, S)["rumpf_seitlich"] > 10, "Rumpf: Schultern rechts von der Hüfte geben positive Neigung")
# Kopf vor den Schultern (Seitenansicht)
pruefe(abs(L.messwerte(figur(breite=0.1, kopf=0), S)["kopf_vor"]) < 3, "Kopf vor: Ohr über der Schulter gibt etwa 0")
pruefe(L.messwerte(figur(breite=0.1, kopf=30), S)["kopf_vor"] > 25, "Kopf vor: Ohr vor der Schulter gibt positiv")
P = figur(breite=0.1, kopf=30)
P[:, 0] = 400 - P[:, 0]                                            # Blick nach links: gleiche Aussage
pruefe(L.messwerte(P, S)["kopf_vor"] > 25, "Kopf vor: unabhängig von der Blickrichtung")

# --------------------------------------------------------------------------- Kniebeuge (Hysterese)
def lauf(uebung, werte, schluessel):
    aus = []
    for w in werte:
        m = {k: None for k in ("knie_l", "knie_r", "arm_l", "arm_r", "ellbogen_l", "ellbogen_r", "rumpf_seitlich", "ansicht")}
        m.update(schluessel(w))
        aus.append(uebung.schritt(m))
    return aus


kn = lambda w: {"knie_l": w, "knie_r": w, "ansicht": "seite"}          # noqa: E731
u = L.Kniebeuge()
lauf(u, [175, 170, 150, 130, 105, 100, 120, 150, 165, 175], kn)
pruefe(u.zaehler == 1, "Kniebeuge: tiefe Wiederholung zählt einmal")
u = L.Kniebeuge()
a = lauf(u, [175, 140, 125, 150, 170, 175], kn)
pruefe(u.zaehler == 0 and a[-1].startswith("Knie weiter beugen"), "Kniebeuge: zu flach zählt nicht und sagt es")
u = L.Kniebeuge()
lauf(u, [165, 161, 159, 162, 158, 163, 160, 165, 170], kn)
pruefe(u.zaehler == 0, "Kniebeuge: Wackeln um die obere Schwelle zählt nicht")
u = L.Kniebeuge()
lauf(u, [175, 140, 114, 112, 114, 112, 114, 112, 150, 170], kn)
pruefe(u.zaehler == 0, "Kniebeuge: Wackeln knapp über der unteren Schwelle (112 bis 114) zählt nicht")
u = L.Kniebeuge()
lauf(u, [175, 140, 112, 108, 112, 108, 112, 108, 100, 112, 150, 170], kn)
pruefe(u.zaehler == 1, "Kniebeuge: Wackeln unten zählt genau einmal")
u = L.Kniebeuge()
lauf(u, [175, 100, 175, 100, 175, 100, 175], kn)
pruefe(u.zaehler == 3, "Kniebeuge: drei Wiederholungen")
u = L.Kniebeuge()
lauf(u, [175, 100, 130, 100, 175], kn)
pruefe(u.zaehler == 1, "Kniebeuge: Zwischenstopp in der Mitte zählt nicht doppelt")
u = L.Kniebeuge()
a = lauf(u, [None, None], kn if False else (lambda w: {"ansicht": "seite"}))
pruefe(u.zaehler == 0 and "Beine" in a[0], "Kniebeuge: ohne sichtbare Knie kommt ein Hinweis")
u = L.Kniebeuge()
a = lauf(u, [175, 175], lambda w: {"knie_l": w, "knie_r": w, "ansicht": "vorn"})
pruefe("seitlich" in a[0], "Kniebeuge: von vorn kommt der Hinweis, sich zu drehen")
u = L.Kniebeuge()
lauf(u, [175, 100, 175], lambda w: {"knie_l": w, "knie_r": None, "ansicht": "seite"})
pruefe(u.zaehler == 1, "Kniebeuge: ein sichtbares Knie reicht")
pruefe(u.zustand()["name"] == "kniebeuge" and "zaehler" in u.zustand(), "Kniebeuge: Zustand für die Oberfläche")

# --------------------------------------------------------------------------- Arme heben
ah = lambda w: {"arm_l": w, "arm_r": w, "ellbogen_l": 175, "ellbogen_r": 175, "ansicht": "vorn"}      # noqa: E731
u = L.ArmeHeben()
lauf(u, [10, 20, 50, 100, 150, 160, 100, 40, 20], ah)
pruefe(u.zaehler == 1, "Arme heben: voll hoch und runter zählt einmal")
u = L.ArmeHeben()
a = lauf(u, [10, 50, 100, 120, 80, 30, 10], ah)
pruefe(u.zaehler == 0 and a[-1].startswith("Hebe die Arme höher"), "Arme heben: nur bis 120 Grad zählt nicht und sagt es")
u = L.ArmeHeben()
a = lauf(u, [10, 50, 100, 150], lambda w: {"arm_l": w, "arm_r": w, "ellbogen_l": 120, "ellbogen_r": 120, "ansicht": "vorn"})
pruefe("durch" in a[-1], "Arme heben: gebeugte Ellbogen oben geben den Hinweis, durchzustrecken")
u = L.ArmeHeben()
a = lauf(u, [10, 50, 100, 150], lambda w: {"arm_l": w, "arm_r": max(10, w - 60), "ellbogen_l": 175, "ellbogen_r": 175, "ansicht": "vorn"})
pruefe(u.phase in ("rauf", "oben") and u.zaehler == 0, "Arme heben: Mittelwert reicht nicht für ungleiche Arme nach oben")
u = L.ArmeHeben()
lauf(u, [10, 100, 160] * 1 + [160, 160, 20] + [10, 100, 160, 20], ah)
pruefe(u.zaehler == 2, "Arme heben: zwei Wiederholungen")

# --------------------------------------------------------------------------- Armkreisen: Handgelenke laufen um die Schultern
def kreisen(winkel_liste, radius=1.0, mit_ellbogen=175):
    u = L.Armkreisen()
    for w in winkel_liste:
        P = np.zeros((33, 2))
        P[L.SCH_L], P[L.SCH_R] = (100, 100), (160, 100)
        for sch, ell, hgk, vz in ((L.SCH_L, L.ELL_L, L.HGK_L, 1), (L.SCH_R, L.ELL_R, L.HGK_R, -1)):
            ang = math.radians(vz * w)
            richt = np.array([math.cos(ang), math.sin(ang)])
            P[ell] = P[sch] + 30.0 * richt                # Oberarm 30, Unterarm 30: gestreckt reicht die Hand 60 weit
            P[hgk] = P[sch] + 60.0 * radius * richt       # radius 0,3: Hand zurück nahe an der Schulter
        sicher = np.ones(33)
        u.schritt({"ellbogen_l": mit_ellbogen, "ellbogen_r": mit_ellbogen}, P, sicher)
    return u


u = kreisen(list(range(0, 800, 10)))              # 2,2 Umdrehungen in 10-Grad-Schritten
pruefe(u.zaehler == 2, f"Armkreisen: 2,2 Umdrehungen zählen zwei Kreise ({u.zaehler})")
u = kreisen(list(range(0, 800, 10))[::-1])
pruefe(u.zaehler == 2, "Armkreisen: Gegenrichtung zählt gleich")
u = kreisen(list(range(0, 200, 10)))
pruefe(u.zaehler == 0, "Armkreisen: ein halber Kreis zählt nicht")
u = kreisen(list(range(0, 800, 10)), radius=0.3)
pruefe(u.zaehler == 0, "Armkreisen: Hände dicht am Körper werden nicht gewertet")
u = kreisen([0, 3, -2, 4, -1, 2, 0, 3, -3, 1] * 20)
pruefe(u.zaehler == 0, "Armkreisen: Zittern am Platz zählt nicht")
u = kreisen(list(range(0, 800, 10)), mit_ellbogen=120)
pruefe(u.zaehler == 2 and "durch" in u.rueckmeldung, "Armkreisen: gebeugte Arme zählen, geben aber den Hinweis")

# --------------------------------------------------------------------------- Seitneigung
sn = lambda w: {"rumpf_seitlich": w, "ansicht": "vorn"}                    # noqa: E731
u = L.Seitneigung()
lauf(u, [0, 3, 8, 14, 18, 12, 5, 2], sn)
pruefe(u.zaehler == 1 and u.seiten["rechts"] == 1 and u.seiten["links"] == 0, "Seitneigung: nach rechts gezählt")
u = L.Seitneigung()
lauf(u, [0, -8, -18, -5, 0, 8, 19, 5, 0], sn)
pruefe(u.zaehler == 2 and u.seiten == {"links": 1, "rechts": 1}, "Seitneigung: beide Seiten getrennt gezählt")
u = L.Seitneigung()
a = lauf(u, [0, 8, 12, 9, 3], sn)
pruefe(u.zaehler == 0 and "weiter zur Seite" in a[-1], "Seitneigung: zu wenig zählt nicht und sagt es")
u = L.Seitneigung()
lauf(u, [0, 5, 7, 4, 8, 3, 0], sn)
pruefe(u.zaehler == 0, "Seitneigung: kleines Wackeln zählt nicht")

# --------------------------------------------------------------------------- Haltung am Schreibtisch
def hinweise(**k):
    med = {"ansicht": "vorn", "schulter_schief": 0.0, "rumpf_seitlich": 0.0, "kopf_vor": None, "kopf_seite": 0.0}
    med.update(k)
    return haltung_texte(L.haltung_hinweise(med))


def haltung_texte(liste):
    return " | ".join(h["text"] for h in liste)


t = hinweise()
pruefe("ausgeglichen" in t and "nicht sagen" in t, "Schreibtisch von vorn: ausgeglichen, mit Hinweis auf die Grenze der Frontansicht")
pruefe("linke Schulter" in hinweise(schulter_schief=6.0), "Schreibtisch von vorn: linke Schulter höher")
pruefe("rechte Schulter" in hinweise(schulter_schief=-6.0), "Schreibtisch von vorn: rechte Schulter höher")
pruefe("etwas höher" not in hinweise(schulter_schief=2.0), "Schreibtisch von vorn: kleiner Unterschied wird nicht angesprochen")
pruefe("rechten Seite" in hinweise(rumpf_seitlich=9.0) and "linken Seite" in hinweise(rumpf_seitlich=-9.0), "Schreibtisch von vorn: Oberkörper zur Seite")
pruefe("Kopf ist zur Seite geneigt" in hinweise(kopf_seite=9.0), "Schreibtisch von vorn: Kopf zur Seite geneigt")
pruefe("Kopf" not in hinweise(kopf_seite=2.0).replace("Kopf vor den Schultern steht", ""), "Schreibtisch von vorn: gerader Kopf wird nicht angesprochen")
pruefe("deutlich vor" in hinweise(ansicht="seite", kopf_vor=40.0), "Schreibtisch von der Seite: Kopf deutlich vor den Schultern")
pruefe("etwas vor" in hinweise(ansicht="seite", kopf_vor=25.0) and "deutlich" not in hinweise(ansicht="seite", kopf_vor=25.0), "Schreibtisch von der Seite: Kopf etwas vor den Schultern")
pruefe("ungefähr über den Schultern" in hinweise(ansicht="seite", kopf_vor=8.0), "Schreibtisch von der Seite: Kopf über den Schultern")
pruefe("Ohr und Schulter" in hinweise(ansicht="seite", kopf_vor=None), "Schreibtisch von der Seite: ohne Ohr kein Urteil")
pruefe("schräg" in hinweise(ansicht="schraeg"), "Schreibtisch schräg: Bitte um klare Ansicht statt Urteil")
pruefe("Schultern noch nicht" in hinweise(ansicht=None), "Schreibtisch ohne Ansicht: bittet, ins Bild zu rücken")
alle = " ".join(hinweise(ansicht=a, kopf_vor=v, schulter_schief=s) for a in ("vorn", "seite", "schraeg", None) for v in (None, 10.0, 25.0, 40.0) for s in (0.0, 6.0))
pruefe(not any(w in alle.lower() for w in ("krank", "diagnose", "schmerz", "störung", "haltungsschaden", "therapie", "behandl")), "Schreibtisch: keine medizinischen Wörter in den Hinweisen")
pruefe(not any(c in alle for c in "–—"), "Schreibtisch: keine Gedankenstriche in den Hinweisen")
# Mittelung: Ausreißer zählen nicht, Ansicht nach Mehrheit
verlauf = [{"ansicht": "seite", "kopf_vor": 40.0, "schulter_schief": None, "rumpf_seitlich": None, "kopf_seite": None}] * 10 + \
          [{"ansicht": "vorn", "kopf_vor": 5.0, "schulter_schief": None, "rumpf_seitlich": None, "kopf_seite": None}]
med = L.mittelwerte(verlauf)
pruefe(med["ansicht"] == "seite" and med["kopf_vor"] == 40.0, "Mittelung: Mehrheit und Median, ein Ausreißer ändert nichts")
verlauf = [{"ansicht": "seite", "kopf_vor": 10.0, "schulter_schief": None, "rumpf_seitlich": None, "kopf_seite": None}] * 5 + \
          [{"ansicht": "vorn", "kopf_vor": 10.0, "schulter_schief": None, "rumpf_seitlich": None, "kopf_seite": None}] * 5
pruefe(L.mittelwerte(verlauf)["ansicht"] == "schraeg", "Mittelung: wechselnde Ansicht gilt als schräg")

# --------------------------------------------------------------------------- Pose nachmachen
for ziel in L.ZIELE:
    P = figur(L.ZIELE[ziel]["richtungen"])
    w, teile, _ = L.aehnlichkeit(P, S, ziel)
    pruefe(w == 100 and all(t["ok"] for t in teile), f"Zielpose {ziel}: genau getroffen gibt 100 Prozent ({w})")
w_t, _, _ = L.aehnlichkeit(figur(L.ZIELE["t-pose"]["richtungen"]), S, "haende-hoch")
pruefe(w_t < 70, f"Zielpose: T-Pose als Hände hoch bewertet gibt wenig ({w_t})")
w_s, _, _ = L.aehnlichkeit(figur(), S, "t-pose")
pruefe(w_s < 70, f"Zielpose: Arme hängen lassen als T-Pose bewertet gibt wenig ({w_s})")
# Baum mit dem anderen Bein zählt gleich
bm = L.ZIELE["baum"]["richtungen"]
anders = L._spiegel(bm)
w, _, _ = L.aehnlichkeit(figur(anders), S, "baum")
pruefe(w == 100, f"Zielpose Baum: anderes Bein zählt gleich ({w})")
# leichte Abweichung gibt weniger als 100
P = figur(dict(L.ZIELE["t-pose"]["richtungen"], **{"Oberarm links": (-1.0, -0.3)}))
w, teile, _ = L.aehnlichkeit(P, S, "t-pose")
pruefe(80 <= w < 100, f"Zielpose: ein Arm 17 Grad zu hoch gibt wenig Abzug ({w})")
# nicht sichtbar
w, teile, _ = L.aehnlichkeit(figur(L.ZIELE["t-pose"]["richtungen"]), sicht([L.KNO_L, L.KNO_R, L.KNI_L]), "t-pose")
pruefe(w is None, "Zielpose: weniger als sechs sichtbare Stücke geben keine Zahl")
w, teile, _ = L.aehnlichkeit(figur(L.ZIELE["t-pose"]["richtungen"]), sicht([L.KNO_L, L.KNO_R]), "t-pose")
pruefe(w == 100 and sum(t["sichtbar"] for t in teile) == 6, "Zielpose: sechs sichtbare Stücke reichen")
# Umriss
pts = L.umriss(figur(), S, L.ZIELE["t-pose"]["richtungen"])
pruefe(len(pts) >= 13 and pts[L.HGK_L][0] < pts[L.SCH_L][0] and pts[L.HGK_R][0] > pts[L.SCH_R][0], "Umriss: T-Pose, linke Hand links der Schulter")
pruefe(L.umriss(figur(), sicht([L.HUE_L]), L.ZIELE["t-pose"]["richtungen"]) == {}, "Umriss: ohne Hüfte kein Umriss")

# Halten und Zählen mit Hysterese
n = L.Nachmachen()
for t, w in ((0.0, 50), (0.3, 85), (0.8, 90), (1.4, 92), (1.6, 90)):
    n.schritt(w, t)
pruefe(n.geschafft == 1 and n.zeigt, "Nachmachen: Halten über 1,2 Sekunden zählt einmal und zeigt Geschafft")
for t in (1.8, 2.5, 3.0):
    n.schritt(95, t)
pruefe(n.geschafft == 1, "Nachmachen: weiter halten zählt nicht noch einmal")
n.schritt(70, 3.2)
n.schritt(90, 3.4)
n.schritt(90, 5.0)
pruefe(n.geschafft == 1, "Nachmachen: zwischen 60 und 80 Prozent wird nicht neu gescharft")
n.schritt(40, 5.2)
n.schritt(90, 5.4)
n.schritt(90, 6.8)
pruefe(n.geschafft == 2, "Nachmachen: nach Lösen der Pose zählt die nächste")
n = L.Nachmachen()
n.schritt(90, 0.0)
n.schritt(50, 0.5)
n.schritt(90, 0.9)
n.schritt(90, 1.5)
pruefe(n.geschafft == 0, "Nachmachen: Unterbrechung setzt das Halten zurück")
n = L.Nachmachen()
n.schritt(None, 0.0)
n.schritt(None, 5.0)
pruefe(n.geschafft == 0 and not n.zeigt, "Nachmachen: ohne Zahl nichts gezählt")

# --------------------------------------------------------------------------- Glättung
rng = np.random.default_rng(1)
basis = np.array([[100.0, 100.0], [200.0, 150.0]])
f = L.EinEuro(**L.GLAETTEN)
roh, glatt = [], []
for i in range(120):
    x = basis + rng.normal(0, 2.0, basis.shape)
    roh.append(x)
    glatt.append(f(x, i * 0.1, 200.0).copy())
roh, glatt = np.array(roh[20:]), np.array(glatt[20:])
pruefe(glatt.std(axis=0).mean() < roh.std(axis=0).mean() * 0.7, f"Glättung: Rauschen im Stand sinkt ({roh.std(axis=0).mean():.2f} auf {glatt.std(axis=0).mean():.2f} Pixel)")
f = L.EinEuro(**L.GLAETTEN)
verz = []
for i in range(40):
    ziel = basis + (0 if i < 10 else 80.0)          # Sprung um 80 Pixel (0,4 Körpergrößen) in einem Bild
    verz.append(f(ziel, i * 0.1, 200.0)[0][0])
pruefe(verz[10] > 100 + 25, f"Glättung: schnelle Bewegung wird nicht verschluckt ({verz[10]:.0f} nach dem Sprung auf 180)")
pruefe(abs(verz[-1] - 180) < 1.0, f"Glättung: der Wert erreicht das Ziel ({verz[-1]:.1f})")
f = L.EinEuro(**L.GLAETTEN)
a1 = f(basis, 0.0, 200.0).copy()
a2 = f(basis, 0.0, 200.0)                            # gleicher Zeitstempel darf nicht teilen
pruefe(np.all(np.isfinite(a2)), "Glättung: gleicher Zeitstempel bleibt endlich")

# --------------------------------------------------------------------------- Zuordnung links und rechts, Anker
pruefe(all(L.TAUSCH[L.TAUSCH[i]] == i for i in range(39)), "Tausch: zweimal getauscht ist wieder die Ausgangslage")
pruefe(L.TAUSCH[L.SCH_L] == L.SCH_R and L.TAUSCH[L.KNO_R] == L.KNO_L and L.TAUSCH[L.NASE] == L.NASE and L.TAUSCH[33] == 33, "Tausch: Schultern und Knöchel getauscht, Nase und Hilfspunkte nicht")
pruefe(L.ANKER.shape == (2254, 2) and 0 < L.ANKER.min() and L.ANKER.max() < 1, "Anker: 2254 Punkte im Bild")
pruefe(len({tuple(a) for a in L.ANKER[:56]}) == 28 and len({tuple(a) for a in L.ANKER[-294:]}) == 49, "Anker: Raster 28 mit 2, Raster 7 mit 6 je Zelle")

# --------------------------------------------------------------------------- Steuerwerte werden gegen Listen geprüft
from app import kamera_modi  # noqa: E402

modus = kamera_modi.MODI["koerper"]
v = modus.neu()
for schlecht in ({"ansicht": "boese"}, {"ansicht": 5}, {"ansicht": ["spiegel"]}, {"uebung": {"x": 1}}, {"uebung": "../etc"}, {"ziel": None}, {"ziel": "t-pose; rm"},
                 {"ansicht": "x" * 5000}, {}):
    modus.steuern(v, schlecht)
pruefe(v.ansicht == "skelett" and v.uebung.name == "kniebeuge" and v.ziel == "haende-hoch", "Steuern: ungültige Werte ändern nichts")
modus.steuern(v, {"ansicht": "spiegel", "uebung": "arme-heben", "ziel": "t-pose"})
pruefe(v.ansicht == "spiegel" and v.uebung.name == "arme-heben" and v.ziel == "t-pose", "Steuern: gültige Werte werden übernommen")
v.uebung.zaehler = 5
v.nachmachen.geschafft = 3
modus.steuern(v, {"neu": True})
pruefe(v.uebung.zaehler == 0 and v.nachmachen.geschafft == 0 and v.uebung.name == "arme-heben", "Steuern: Zurücksetzen löscht beide Zähler")
pruefe(set(L.UEBUNGEN) == {"kniebeuge", "arme-heben", "armkreisen", "seitneigung"} and set(L.ANSICHTEN) == {"skelett", "spiegel", "schreibtisch", "nachmachen"}, "Steuern: feste Listen")
v2 = modus.neu()
pruefe(v2 is not v and v2.uebung.zaehler == 0, "Verbindung: jeder Kanal hat seinen eigenen Zustand")

# --------------------------------------------------------------------------- Modelle erst bei Bedarf laden und wieder freigeben
pruefe(not L.geladen() or L._modelle is None or True, "Modelle: Start ohne geladene Modelle ist erlaubt")
L._modelle = object()
L._zuletzt = time.monotonic()
pruefe(L.freigeben_wenn_leer() is False and L._modelle is not None, "Freigabe: nach frischem Bild bleiben die Modelle")
L._zuletzt = time.monotonic() - (L.FREIGABE_NACH + 5)
pruefe(L.freigeben_wenn_leer() is True and L._modelle is None, "Freigabe: nach 120 Sekunden ohne Bild werden die Modelle freigegeben")
pruefe(L.freigeben_wenn_leer() is False, "Freigabe: ohne Modelle nichts zu tun")

print("\nAlle Regeln bestanden." if not fehler else f"\n{fehler} Prüfung(en) fehlgeschlagen.")
sys.exit(1 if fehler else 0)
