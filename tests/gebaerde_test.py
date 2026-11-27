"""Test des Labors Fingeralphabet (app/lab_gebaerde.py, scripts/gebaerde_vorlagen_bauen.py), ohne Modelle und ohne Kamera.
Aufruf (aus dem Repo-Wurzelordner, braucht numpy, opencv und fastapi): python3 tests/gebaerde_test.py

Geprüft wird:
  1. Die Datei der Vorlagen passt zum Bauskript (eine Datenquelle) und die Tabelle der Seite zur Messung.
  2. Regeln: Jede Vorlage hat die Fingerstellung, die die Beschreibung des Buchstabens verlangt (gestreckt, gebogen, geschlossen,
     Berührungen, Kreuzung, Ausrichtung).
  3. Selbsterkennung: Jede Vorlage wird von der eigenen Erkennung als sie selbst erkannt, mit Sicherheit über der Schwelle.
  4. Händigkeit: Gespiegelte Vorlagen (linke Hand), gedrehte, verkleinerte und verschobene werden ebenso erkannt.
  5. Rauschfestigkeit: Zufallsstörung auf den Punkten ändert das Ergebnis nur selten.
  6. Unsinn: Zufällige Punktwolken werden nicht als Buchstabe übernommen.
  7. Glättung über mehrere Bilder."""
import importlib.util
import json
import re
import sys
from pathlib import Path

import numpy as np

WURZEL = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(WURZEL))
from app import lab_gebaerde as L  # noqa: E402

spec = importlib.util.spec_from_file_location("gebaerde_bauen", WURZEL / "scripts" / "gebaerde_vorlagen_bauen.py")
G = importlib.util.module_from_spec(spec)
spec.loader.exec_module(G)

fehler = 0


def pruefe(ok, text):
    global fehler
    print(("OK    " if ok else "FEHLT ") + text)
    fehler += not ok


daten = json.loads(L.VORLAGEN_DATEI.read_text(encoding="utf-8"))
v = L.Vorlagen(daten)
BUCHSTABEN = list(G.BUCHSTABEN)

# ------------------------------------------------------------------ 1. eine Datenquelle
neu = G.bauen()
gleich = all(np.allclose(np.array(neu["vorlagen"][k]["punkte"]), np.array(daten["vorlagen"][k]["punkte"]), atol=2e-3) for k in neu["vorlagen"]) \
    and set(neu["vorlagen"]) == set(daten["vorlagen"])
pruefe(gleich, "Vorlagendatei passt zu scripts/gebaerde_vorlagen_bauen.py (Punkte)")
stufen_gleich = all(neu["stufen"][k]["stufe"] == daten["stufen"][k]["stufe"] and abs(neu["stufen"][k]["treffer"] - daten["stufen"][k]["treffer"]) <= 0.06 for k in daten["stufen"])
pruefe(stufen_gleich, "Einstufung sicher/unsicher in der Datei stimmt mit einer neuen Messung überein")
inhalt = (WURZEL / "app" / "static" / "content-gebaerde.js").read_text(encoding="utf-8")
block = re.search(r"/\*MESSUNG:BEGIN\*/.*?/\*MESSUNG:ENDE\*/", inhalt, re.S).group(0)
pruefe(block == G.messung_block(daten), "Tabelle der Seite (content-gebaerde.js) stimmt mit der Messung in der JSON-Datei überein")
pruefe(len(daten["vorlagen"]) == 26 and all(len(x["punkte"]) == 21 and all(len(q) == 3 for q in x["punkte"]) for x in daten["vorlagen"].values()), "26 Vorlagen mit je 21 Punkten (x, y, z)")
pruefe(set(L.STEUERZEICHEN) <= set(daten["vorlagen"]) and all(k in daten["vorlagen"] for k in BUCHSTABEN), "24 Buchstaben und beide Gesten sind vorhanden")
bewegt_ok = all(b["basis"] in daten["vorlagen"] for b in daten["bewegt"].values()) and set(daten["bewegt"]) == {"J", "Z", "Ä", "Ö", "Ü", "ß", "Sch"}
pruefe(bewegt_ok, "J, Z, Ä, Ö, Ü, ß und Sch sind als nicht erkannt (Bewegung) geführt und haben eine Grundform zum Zeigen")

# ------------------------------------------------------------------ 2. Regeln je Vorlage
M = {k: v.m[v.index[k]] for k in v.namen}
ZUSTAND = {k: "".join(map(str, L._zustand(M[k]))) for k in M}
T_SPITZE = {k: M[k][23:27] for k in M}          # Daumenspitze zu Spitze von Zeige, Mittel, Ring, klein
T_P = {k: M[k][27:31] for k in M}               # Daumenspitze zu Wurzel Zeige, Gelenk Zeige, Gelenk Mittel, Wurzel klein
T_MITTE = {k: M[k][31] for k in M}
LUECKE = {k: M[k][32:35] for k in M}            # Abstand der Spitzen Zeige-Mittel, Mittel-Ring, Ring-klein
KREUZ = {k: M[k][35] for k in M}
ORI = {k: M[k][37] * 180 for k in M}            # Ausrichtung: Finger nach oben 0, zur Seite 90, nach unten 180
TDIR = {k: M[k][38] * 180 for k in M}           # Richtung des Daumens im Bild (0 oben, 180 unten)

REGELN = {
    "A": ("0000", lambda k: T_SPITZE[k][0] < 0.3, "Faust, Daumen liegt seitlich am Zeigefinger"),
    "B": ("2222", lambda k: min(T_SPITZE[k]) > 1.0 and T_P[k][3] < 0.6, "Finger gestreckt, Daumen quer über der Handfläche"),
    "C": ("1111", lambda k: min(T_SPITZE[k]) > 0.45, "Finger gebogen, Daumen berührt nicht (offener Halbkreis)"),
    "D": ("2111", lambda k: max(T_SPITZE[k][1:]) < 0.5 and T_SPITZE[k][0] > 1.0, "Zeigefinger gestreckt, Daumen und andere Finger bilden einen Kreis"),
    "E": (None, lambda k: max(T_SPITZE[k]) < 0.5 and T_MITTE[k] < 0.3, "Fingerspitzen berühren den Daumen vor der Handfläche"),
    "F": ("1222", lambda k: T_SPITZE[k][0] < 0.5 and LUECKE[k][0] > 0.6, "Daumen und Zeigefinger ein Ring, drei Finger gestreckt und gespreizt"),
    "G": ("2000", lambda k: 60 < ORI[k] < 120, "Hand waagerecht, Zeigefinger gestreckt"),
    "H": ("2200", lambda k: 60 < ORI[k] < 120 and LUECKE[k][0] < 0.3, "Hand waagerecht, Zeige- und Mittelfinger zusammen"),
    "I": ("0002", lambda k: ORI[k] < 30, "Faust, kleiner Finger nach oben"),
    "K": ("2200", lambda k: 0.4 < LUECKE[k][0] < 0.8 and T_MITTE[k] < 0.3, "Zeige- und Mittelfinger gespreizt, Daumen dazwischen an der Hand"),
    "L": ("2000", lambda k: T_MITTE[k] > 0.8 and 55 < TDIR[k] < 95, "Zeigefinger oben, Daumen im rechten Winkel abgespreizt"),
    "M": ("2220", lambda k: ORI[k] > 150, "Hand zeigt nach unten, drei Finger gestreckt"),
    "N": ("2200", lambda k: ORI[k] > 150, "Hand zeigt nach unten, zwei Finger gestreckt"),
    "O": ("1111", lambda k: max(T_SPITZE[k]) < 0.55 and max(LUECKE[k]) < 0.25, "alle Fingerspitzen treffen die Daumenspitze"),
    "P": ("2200", lambda k: ORI[k] > 150 and TDIR[k] > 150, "Hand zeigt nach unten, Daumen nach unten"),
    "Q": ("2000", lambda k: ORI[k] > 150 and TDIR[k] > 150, "Hand zeigt nach unten, Zeigefinger und Daumen nach unten"),
    "R": ("2200", lambda k: KREUZ[k] < 0, "Zeige- und Mittelfinger gekreuzt"),
    "S": ("0000", lambda k: T_SPITZE[k][0] > 0.4, "Faust, Daumen quer vor den Fingern"),
    "T": ("2000", lambda k: 60 < ORI[k] < 120 and T_P[k][0] < 0.3, "Hand waagerecht, Zeigefinger gestreckt, Daumen darauf"),
    "U": ("2200", lambda k: LUECKE[k][0] < 0.3 and KREUZ[k] > 0, "Zeige- und Mittelfinger zusammen"),
    "V": ("2200", lambda k: LUECKE[k][0] > 0.4 and KREUZ[k] > 0, "Zeige- und Mittelfinger gespreizt"),
    "W": ("2220", lambda k: T_SPITZE[k][3] < 0.2, "drei Finger gespreizt, Daumen hält den kleinen Finger"),
    "X": ("1000", lambda k: 60 < ORI[k] < 120, "Hand waagerecht, Zeigefinger abgewinkelt"),
    "Y": ("0002", lambda k: T_MITTE[k] > 0.8, "Daumen und kleiner Finger abgespreizt"),
    "LEER": ("2222", lambda k: min(LUECKE[k]) > 0.3, "ganz offene Hand, Finger gespreizt"),
    "LOESCHEN": ("0000", lambda k: TDIR[k] > 150, "Faust, Daumen nach unten"),
}
for k, (zustand, regel, text) in REGELN.items():
    ok = (zustand is None or ZUSTAND[k] == zustand) and bool(regel(k))
    pruefe(ok, f"Regel {k}: {text} (Fingerstellung {ZUSTAND[k]})")
pruefe(set(REGELN) == set(daten["vorlagen"]), "Jede Vorlage hat eine Regel")


# ------------------------------------------------------------------ 3. Selbsterkennung
def haltung(p, spiegel=False, grad=0.0, skala=1.0, schub=(0.0, 0.0)):
    q = np.array(p)[:, :2].copy()
    if spiegel:
        q[:, 0] *= -1
    w = np.radians(grad)
    r = np.array([[np.cos(w), -np.sin(w)], [np.sin(w), np.cos(w)]])
    return (q @ r.T) * skala + np.array(schub)


aus = {k: L.erkenne(haltung(v.punkte[k])) for k in v.namen}
falsch = [k for k, e in aus.items() if e["name"] != k]
pruefe(not falsch, "Selbsttest: jede Vorlage wird als sie selbst erkannt " + (str(falsch) if falsch else ""))
schwach = [k for k, e in aus.items() if e["sicher"] < 0.7]
pruefe(not schwach, "Selbsttest: Sicherheit der unveränderten Vorlagen mindestens 70 Prozent (R und U liegen eng beieinander) " + (str([(k, round(aus[k]['sicher'], 2)) for k in schwach]) if schwach else ""))

# ------------------------------------------------------------------ 4. Händigkeit, Drehung, Größe
for titel, kw in [("gespiegelt (linke Hand)", dict(spiegel=True)), ("gedreht +10 Grad", dict(grad=10)), ("gedreht -10 Grad", dict(grad=-10)),
                  ("gespiegelt und gedreht", dict(spiegel=True, grad=8)), ("klein und verschoben", dict(skala=0.4, schub=(300.0, -80.0))), ("groß", dict(skala=3.0))]:
    f = [k for k in v.namen if L.erkenne(haltung(v.punkte[k], **kw))["name"] != k]
    pruefe(not f, f"Vorlagen {titel}: alle erkannt " + (str(f) if f else ""))
gleich_spiegel = all(np.allclose(L.merkmale(haltung(v.punkte[k])), L.merkmale(haltung(v.punkte[k], spiegel=True)), atol=1e-6) for k in v.namen)
pruefe(gleich_spiegel, "Merkmale ändern sich beim Spiegeln nicht (linke und rechte Hand sehen gleich aus)")

# ------------------------------------------------------------------ 5. Rauschen
rng = np.random.default_rng(42)
for sigma, mindest_je, mindest_mittel in ((0.02, 0.85, 0.95), (0.03, 0.7, 0.9)):
    quoten = {}
    for k in BUCHSTABEN:
        p = v.punkte[k][:, :2]
        s = float(np.mean([np.linalg.norm(p[i] - p[0]) for i in (5, 9, 13, 17)]))
        richtig = sum(L.erkenne(L.stoeren(p, s, rng, sigma, 8.0))["name"] == k for _ in range(60))
        quoten[k] = richtig / 60
    schlecht = {k: round(q, 2) for k, q in quoten.items() if q < mindest_je}
    pruefe(not schlecht, f"Rauschen {sigma} der Handgröße, Drehung bis 8 Grad: jeder Buchstabe mindestens {mindest_je} richtig " + (str(schlecht) if schlecht else ""))
    pruefe(np.mean(list(quoten.values())) >= mindest_mittel, f"Rauschen {sigma}: im Mittel mindestens {mindest_mittel} richtig (gemessen {np.mean(list(quoten.values())):.3f})")

# ------------------------------------------------------------------ 6. Unsinn
übernommen = 0
for _ in range(300):
    p = rng.normal(0, 1, (21, 2))
    übernommen += L.erkenne(p)["name"] is not None
pruefe(übernommen <= 15, f"Zufällige Punktwolken werden fast nie als Buchstabe übernommen ({übernommen} von 300)")
e = L.erkenne(haltung(v.punkte["A"]) + rng.normal(0, 0.5, (21, 2)))
pruefe(e["name"] is None or e["name"] == "A", "Stark verrauschte Hand: kein falscher Buchstabe, sondern 'nicht sicher'")

# ------------------------------------------------------------------ 7. Glätten und Zeichen
z = L.Verbindung()
folge = [("A", 0.9), ("A", 0.9), ("B", 0.9), ("A", 0.9), ("A", 0.9)]
for n, s in folge:
    erg = L._glaetten(z, {"name": n, "sicher": s})
pruefe(erg[0] == "A", "Glätten: ein einzelnes Fehlbild ändert den Buchstaben nicht")
z = L.Verbindung()
for n in ("A", "B", "A", "C", "B"):
    erg = L._glaetten(z, {"name": n, "sicher": 0.9})
pruefe(erg[0] is None, "Glätten: ohne Mehrheit gibt es keinen Buchstaben")

# ------------------------------------------------------------------ 8. Rückmeldung zum Üben und Steuerung
h = L.hinweise(haltung(v.punkte["S"]), "B")
pruefe(len(h) >= 1 and all(isinstance(t, str) for t in h), "Hinweise zum Üben: S gezeigt, B gesucht liefert Sätze: " + "; ".join(h))
modus = L._GebaerdeModus()
zu = L.Verbindung()
modus.steuern(zu, {"ziel": "A"})
pruefe(zu.ziel == "A", "Übungsziel A wird übernommen")
modus.steuern(zu, {"ziel": "../../etc/passwd"})
modus.steuern(zu, {"ziel": "LEER"})
modus.steuern(zu, {"ziel": 5})
pruefe(zu.ziel == "A", "Ungültige Ziele werden abgelehnt (Liste statt freier Eingabe)")
modus.steuern(zu, {"ziel": ""})
pruefe(zu.ziel is None, "Leeres Ziel löscht die Übung")

print()
print("ALLES GRÜN" if not fehler else f"{fehler} PRÜFUNG(EN) FEHLGESCHLAGEN")
sys.exit(1 if fehler else 0)
