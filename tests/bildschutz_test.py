"""Regeltest des Labors "Bild schützen" (app/lab_bildschutz.py) mit künstlichen Bildern, ohne Modelle und ohne Kamera.
Aufruf (aus dem Repo-Wurzelordner, braucht numpy und opencv): python3 tests/bildschutz_test.py"""
import sys
from pathlib import Path

import cv2
import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app import lab_bildschutz as B  # noqa: E402

fehler = []


def pruefe(ok, text):
    print(("OK    " if ok else "FEHLT ") + text)
    if not ok:
        fehler.append(text)


def testbild(w=480, h=360):
    """Bild mit viel Struktur (Rauschen und Linien), damit Mosaik und Weichzeichner messbar etwas ändern."""
    rng = np.random.default_rng(7)
    bild = rng.integers(0, 256, (h, w, 3), dtype=np.uint8)
    cv2.line(bild, (0, 0), (w - 1, h - 1), (255, 255, 255), 3)
    return bild


# --- Rahmen vergrößern und begrenzen
r = B.erweitere_box((100, 100, 80, 100), 480, 360)
pruefe(r[0] < 100 and r[1] < 100 and r[2] > 180 and r[3] > 200, f"Rahmen wird größer als der YuNet-Rahmen: {r}")
r = B.erweitere_box((-30, -30, 60, 60), 480, 360)
pruefe(r[0] == 0 and r[1] == 0, "Rahmen am Bildrand wird begrenzt")
r = B.erweitere_box((470, 350, 40, 40), 480, 360)
pruefe(r[2] == 480 and r[3] == 360 and r[2] > r[0] and r[3] > r[1], "Rahmen über den rechten unteren Rand wird begrenzt und bleibt nicht leer")

# --- Mosaik: außerhalb unverändert, innen Kästchen mit je einer Farbe
orig = testbild()
b = orig.copy()
rahmen = (100, 80, 220, 230)
nx, ny = B.mosaik(b, rahmen, 10)
pruefe(nx == 10 and ny >= 1, f"Mosaik: {nx} mal {ny} Kästchen")
aussen = np.ones(orig.shape[:2], bool)
aussen[80:230, 100:220] = False
pruefe(np.array_equal(b[aussen], orig[aussen]), "Mosaik ändert nichts außerhalb des Rahmens")
innen = b[80:230, 100:220]
pruefe(not np.array_equal(innen, orig[80:230, 100:220]), "Mosaik ändert das Innere")
farben = {tuple(p) for p in innen.reshape(-1, 3)}
pruefe(len(farben) <= nx * ny, f"Im Rahmen bleiben höchstens {nx * ny} Farben (gezählt: {len(farben)})")
fein = orig.copy()
B.mosaik(fein, rahmen, 40)
grob = orig.copy()
B.mosaik(grob, rahmen, 4)
fn = len({tuple(p) for p in fein[80:230, 100:220].reshape(-1, 3)})
gn = len({tuple(p) for p in grob[80:230, 100:220].reshape(-1, 3)})
pruefe(gn < fn, f"Gröberes Mosaik hat weniger Farbwerte als feines ({gn} gegen {fn})")

# --- Weichzeichner: weniger Kontrast im Rahmen, außen unverändert
b = orig.copy()
B.weichzeichnen(b, rahmen, 10)
pruefe(np.array_equal(b[aussen], orig[aussen]), "Weichzeichner ändert nichts außerhalb des Rahmens")
pruefe(b[80:230, 100:220].std() < orig[80:230, 100:220].std() * 0.5, "Weichzeichner senkt den Kontrast im Rahmen deutlich")
stark = orig.copy()
B.weichzeichnen(stark, rahmen, 4)
leicht = orig.copy()
B.weichzeichnen(leicht, rahmen, 40)
pruefe(stark[80:230, 100:220].std() <= leicht[80:230, 100:220].std(), "Weniger Blöcke ergibt stärkeren Weichzeichner")

# --- Balken: im Rahmen nur Schwarz, also keine Bildinformation
b = orig.copy()
B.balken(b, rahmen)
pruefe(int(b[80:230, 100:220].max()) == 0, "Balken ist im Rahmen vollständig schwarz")
pruefe(np.array_equal(b[aussen], orig[aussen]), "Balken ändert nichts außerhalb des Rahmens")
vor, nach = B.farbwerte(rahmen, "balken", 10)
pruefe(nach == 1 and vor == 120 * 150, f"Farbwerte Balken: {vor} Pixel, {nach} Wert")
vor, nach = B.farbwerte(rahmen, "mosaik", 10)
pruefe(1 < nach < vor, f"Farbwerte Mosaik: {nach} von {vor}")
vor, nach = B.farbwerte(rahmen, "weich", 10)
pruefe(nach == vor, "Weichzeichner: kein Abzählen, keine Werte als verloren gemeldet")

# --- Muster: selbst erzeugt, richtige Größe, je Name verschieden
muster = {n: B.muster_bild(n, B.FARBEN["blau"], 480, 360) for n in B.MUSTER}
pruefe(all(m.shape == (360, 480, 3) and m.dtype == np.uint8 for m in muster.values()), "Muster haben Bildgröße und uint8")
pruefe(len({m.tobytes() for m in muster.values()}) == len(B.MUSTER), "Die Muster unterscheiden sich")
pruefe(not np.array_equal(B.muster_bild("verlauf", B.FARBEN["blau"], 64, 48), B.muster_bild("verlauf", B.FARBEN["rot"], 64, 48)), "Die Farbwahl ändert das Muster")

# --- Maske und Zusammensetzen
p = np.zeros((90, 120), np.float32)
p[:, 60:] = 1.0
p[30:60, 55:65] = 0.5
hart = B.maske_aufbereiten(p, 0)
pruefe(set(np.unique(hart)) <= {0.0, 1.0}, "Kantenweichheit 0 ergibt eine harte Maske aus 0 und 1")
weich = B.maske_aufbereiten(p, 6)
pruefe(0.0 < weich[45, 60] < 1.0 or 0.0 < weich[45, 58] < 1.0, "Kantenweichheit 6 ergibt Zwischenwerte am Rand")
pruefe(len(np.unique(weich)) > len(np.unique(hart)), "Weiche Maske hat mehr Stufen als die harte")
pruefe(float(weich.min()) >= 0.0 and float(weich.max()) <= 1.0, "Maske bleibt zwischen 0 und 1")
vorn = np.full((90, 120, 3), 200, np.uint8)
hinten = np.full((90, 120, 3), 20, np.uint8)
m = B.mische(vorn, hinten, hart)
pruefe(int(m[0, 0, 0]) == 20 and int(m[0, 119, 0]) == 200, "Zusammensetzen: Person bleibt, Hintergrund wird ersetzt")
m = B.mische(vorn, hinten, np.full((90, 120), 0.5, np.float32))
pruefe(abs(int(m[5, 5, 0]) - 110) <= 1, "Zusammensetzen mischt bei Deckkraft 0,5 zur Hälfte")

# --- Steuernachrichten: nur feste Listen und Bereiche
z = B.Verbindung()
B.steuere(z, {"effekt": "balken", "farbe": "rot", "muster": "karos", "kante": 7, "staerke": 9})
pruefe((z.effekt, z.farbe, z.muster, z.kante, z.staerke) == ("balken", "rot", "karos", 7, 9), "Gültige Steuerwerte werden übernommen")
B.steuere(z, {"effekt": "../../etc/passwd", "farbe": "magenta", "muster": 5, "kante": "7", "staerke": True})
pruefe((z.effekt, z.farbe, z.muster, z.kante, z.staerke) == ("balken", "rot", "karos", 7, 9), "Ungültige Steuerwerte werden ignoriert")
B.steuere(z, {"kante": 99, "staerke": -5})
pruefe((z.kante, z.staerke) == (10, 1), "Zahlen werden auf den erlaubten Bereich begrenzt")
B.steuere(z, {"kante": float("nan"), "staerke": [1]})
pruefe((z.kante, z.staerke) == (10, 1), "NaN und Listen werden ignoriert")
B.steuere(z, "kein dict")
B.steuere(z, None)
pruefe(True, "Steuernachricht ohne Wörterbuch wirft nichts")
for e in B.EFFEKTE:
    B.steuere(z, {"effekt": e})
    pruefe(z.effekt == e, f"Effekt {e} ist zulässig")

# --- Netz auslassen nur unter Last, nie zweimal hintereinander
z = B.Verbindung()
pruefe(not B.netz_auslassen(z), "Erstes Bild: Netz läuft immer")
z.wahrsch = np.zeros((4, 4), np.float32)
z.letzte_ms = B.LANGSAM_MS - 1
pruefe(not B.netz_auslassen(z), "Schnelles Bild: Netz läuft")
z.letzte_ms = B.LANGSAM_MS + 10
pruefe(B.netz_auslassen(z), "Langsames Bild: Maske wird wiederverwendet")
z.ausgelassen = True
pruefe(not B.netz_auslassen(z), "Nie zweimal hintereinander auslassen")

# --- Gesichter nachführen: kurzes Fehlen zeigt keinen Blitzer, dauerhaftes Fehlen endet
alt = []
neu = [(100.0, 100.0, 60.0, 60.0)]
st = B.rahmen_nachfuehren(alt, neu)
pruefe(len(st) == 1 and st[0][4] == 0, "Frisch gefundenes Gesicht hat Alter 0")
for i in range(1, B.NACHHALTE + 1):
    st = B.rahmen_nachfuehren(st, [])
    pruefe(len(st) == 1 and st[0][4] == i, f"Fehlendes Gesicht bleibt im Bild {i} von {B.NACHHALTE} verpixelt")
st = B.rahmen_nachfuehren(st, [])
pruefe(st == [], "Nach der Nachhaltezeit verschwindet der Rahmen")
st = B.rahmen_nachfuehren([(100.0, 100.0, 60.0, 60.0, 2)], [(104.0, 102.0, 60.0, 60.0)])
pruefe(len(st) == 1 and st[0][4] == 0, "Dasselbe Gesicht wird nicht doppelt gezählt")

# --- Verpixeln mit einem Ersatz-Gesichtsfinder (ohne YuNet-Datei)
class Falscher:
    def __init__(self, treffer):
        self.treffer = treffer
        self.schwelle = 0.7

    def setInputSize(self, g):
        self.g = g

    def getScoreThreshold(self):
        return self.schwelle

    def setScoreThreshold(self, s):
        self.schwelle = s

    def detect(self, bild):
        if not self.treffer:
            return 1, None
        return 1, np.array([[*t, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.9] for t in self.treffer], dtype=np.float32)


from app import kamera_modi  # noqa: E402
orig = testbild()
for effekt in B.VERPIXEL_EFFEKTE:
    kamera_modi.setze_gemeinsam(yunet=Falscher([(150, 100, 80, 100)]))
    z = B.Verbindung()
    B.steuere(z, {"effekt": effekt, "staerke": 6})
    b = orig.copy()
    daten, ms = B.verpixeln(b, z)
    r = B.erweitere_box((150, 100, 80, 100), 480, 360)
    pruefe(len(daten) == 1 and daten[0]["nr"] == 1, f"{effekt}: ein Gesicht gefunden und bearbeitet")
    pruefe(not np.array_equal(b[r[1]:r[3], r[0]:r[2]], orig[r[1]:r[3], r[0]:r[2]]), f"{effekt}: Gesichtsbereich verändert")
    ausser = np.ones(orig.shape[:2], bool)
    ausser[r[1]:r[3], r[0]:r[2]] = False
    pruefe(np.array_equal(b[ausser], orig[ausser]), f"{effekt}: Rest des Bildes unverändert")
    pruefe(kamera_modi.yunet().schwelle == 0.7, f"{effekt}: YuNet-Schwelle wird für andere Labore zurückgesetzt")
kamera_modi.setze_gemeinsam(yunet=Falscher([]))
b = orig.copy()
daten, ms = B.verpixeln(b, B.Verbindung())
pruefe(daten == [] and np.array_equal(b, orig), "Ohne Gesicht bleibt das Bild unverändert")

# --- Modus-Eintrag
modus = kamera_modi.MODI.get("bildschutz")
pruefe(modus is not None and modus.name == "bildschutz" and modus.max_kante == 480, "Modus bildschutz ist registriert")
kamera_modi.setze_gemeinsam(yunet=Falscher([(150, 100, 80, 100)]))
z = modus.neu()
modus.steuern(z, {"effekt": "mosaik"})
b = orig.copy()
anzahl, extra = modus.verarbeite(b, 0.5, z)
pruefe(anzahl == 1 and extra["funktion"] == "verpixeln" and extra["gesichter"][0]["werte"] < extra["gesichter"][0]["pixel"], "Modus liefert Anzahl, Funktion und Gesichtsdaten")
pruefe(not B.geladen(), "Das Segmentierungsnetz wird beim Verpixeln nicht geladen (lazy)")

print("\nALLES OK" if not fehler else f"\n{len(fehler)} FEHLER")
sys.exit(1 if fehler else 0)
