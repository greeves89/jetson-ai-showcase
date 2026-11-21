#!/usr/bin/env python3
"""Baut die fertigen Beispieldaten fuer die Business-Use-Cases des KI-Labors.

Aufruf (aus dem Projektordner):
    python3 scripts/beispiele_bauen.py                      # Bilder + Daten + manifest.json
    python3 scripts/beispiele_bauen.py --modelle app/models # zusaetzlich nachmessen (braucht cv2)
    python3 scripts/beispiele_bauen.py --jetson             # Gegenprobe gegen das laufende Labor

Was passiert:
  1. Die synthetischen Bilder (Metallscheiben, Bauteile, Zellen) werden mit festen Seeds gezeichnet
     und als JPEG unter app/static/beispiele/<use-case>/... abgelegt (siehe beispiele_bilder.py).
  2. Der erfundene Bestellbestand daten/bestellungen.json und die Fragen dazu werden berechnet,
     damit jede erwartete Antwort aus den Daten folgt und nicht von Hand gepflegt wird.
  3. Mit --modelle (Ordner mit mobilenet_embed.onnx und yolox_tiny.onnx, wie ihn setup.sh anlegt)
     wird nachgemessen und in pruefung.json festgehalten:
       - Anlernen: Beispielbilder von der Platte lesen, mit dem Verfahren des Labors
         (MobileNet-Merkmale, 3 naechste Nachbarn) die Testbilder zuordnen, dazu eine groessere
         Stichprobe frisch erzeugter Bilder.
       - Objekterkennung: jedes Foto mit YOLOX bei Schwelle 0,5, auch nach erneuter JPEG-Kompression
         und bei kleinerer Breite. Nur was in allen Varianten erkannt wird, kommt in "erwartet".
  4. manifest.json und QUELLEN.md werden aus den Texten hier und pruefung.json geschrieben.
  5. Mit --jetson (Umgebungsvariable LABOR_URL) laufen Anlernen und RAG gegen das echte Labor.
     Danach wird alles zurueckgesetzt.

Abhaengigkeiten: Pillow, numpy. Fuer --modelle zusaetzlich opencv (cv2).
"""
import argparse
import io
import json
import os
import re
import ssl
import sys
import urllib.request
from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image

HIER = Path(__file__).resolve().parent
WURZEL = HIER.parent
sys.path.insert(0, str(HIER))
import beispiele_bilder as bild  # noqa: E402

ZIEL = WURZEL / "app" / "static" / "beispiele"
JPEG_QUALITAET = 80
STICHPROBE = 30                      # frisch erzeugte Zusatz-Testbilder je Klasse (werden nicht ausgeliefert)
MAX_BYTES = 6 * 1024 * 1024
NEIN = "(kein Treffer)"

# ======================================================================================
# 1. Klassifikations-Sets (Labor "anlernen")
# ======================================================================================
ART = ["kratzer", "delle", "kantenbruch"]

SETS = {
    "fertigung-sichtpruefung": {
        "klassen": [("gut", "Gut"), ("ausschuss", "Ausschuss")],
        "basis": 1000, "train": 20, "test": 6,
        "erzeuger": lambda k, seed, i: bild.scheibe(seed, None if k == "gut" else ART[i % 3]),
    },
    "fertigung-sortieren": {
        "klassen": [("schraube", "Schraube"), ("mutter", "Mutter"), ("scheibe", "Scheibe")],
        "basis": 10000, "train": 20, "test": 4,
        "erzeuger": lambda k, seed, i: bild.bauteil(seed, k),
    },
    "gesundheit-auffaellig": {
        "klassen": [("unauffaellig", "Unauffällig"), ("auffaellig", "Auffällig")],
        "basis": 20000, "train": 20, "test": 6,
        "erzeuger": lambda k, seed, i: bild.zellen(seed, k == "auffaellig"),
    },
}


def seed_von(satz, art, ci, i):
    """Feste Seed-Bereiche: Anlernbilder, Testbilder und Stichprobe ueberschneiden sich nie."""
    versatz = {"train": 0, "test": 500, "stichprobe": 700}[art]
    return satz["basis"] + versatz + ci * 1000 + i


def jpeg_bytes(img):
    puffer = io.BytesIO()
    img.save(puffer, "JPEG", quality=JPEG_QUALITAET, optimize=True)
    return puffer.getvalue()


def sets_schreiben():
    """Schreibt alle Bilder der Sets und liefert je Set die Daten fuers Manifest."""
    ergebnis = {}
    for sid, s in SETS.items():
        ordner = ZIEL / sid
        for alt in ordner.glob("**/*.jpg"):
            alt.unlink()
        klassen, test = [], []
        for ci, (kname, label) in enumerate(s["klassen"]):
            pfade = []
            for i in range(s["train"]):
                rel = "%s/%s/%02d.jpg" % (sid, kname, i + 1)
                (ZIEL / rel).parent.mkdir(parents=True, exist_ok=True)
                (ZIEL / rel).write_bytes(jpeg_bytes(s["erzeuger"](kname, seed_von(s, "train", ci, i), i)))
                pfade.append(rel)
            klassen.append({"name": label, "bilder": pfade})
        # Testbilder in fester, gemischter Reihenfolge, Dateiname verraet die Klasse nicht
        rohtest = [(kname, label, ci, i) for ci, (kname, label) in enumerate(s["klassen"]) for i in range(s["test"])]
        reihenfolge = np.random.default_rng(s["basis"] + 999).permutation(len(rohtest))
        for n, idx in enumerate(reihenfolge):
            kname, label, ci, i = rohtest[idx]
            rel = "%s/test/%02d.jpg" % (sid, n + 1)
            (ZIEL / rel).parent.mkdir(parents=True, exist_ok=True)
            (ZIEL / rel).write_bytes(jpeg_bytes(s["erzeuger"](kname, seed_von(s, "test", ci, i), i)))
            test.append({"bild": rel, "erwartet": label})
        ergebnis[sid] = {"klassen": klassen, "test": test}
    return ergebnis


# ======================================================================================
# 2. Bestellbestand (Use-Case service-bestellung)
# ======================================================================================
ARTIKEL = {
    "Sensorhalter": 12.90, "Kabelbinder-Set": 4.50, "Netzteil 24 V": 29.90, "Steckverbinder M12": 8.40,
    "Kugellager 6204": 7.20, "Dichtungsring-Set": 15.60, "Schaltschrankleuchte": 34.00,
    "Temperaturfühler PT100": 18.50, "Relais 24 V": 11.30, "Werkzeugkoffer": 79.00,
}
# (Nummer, Kunde, Datum, Status, [(Artikel, Menge)], Lieferdatum, Tracking)
BESTELLUNGEN_ROH = [
    ("B-10231", "K-1042", "2026-02-02", "zugestellt", [("Sensorhalter", 4), ("Kabelbinder-Set", 2)], "2026-02-06", "TRK-4F7K21"),
    ("B-10232", "K-2210", "2026-02-03", "zugestellt", [("Werkzeugkoffer", 1)], "2026-02-09", "TRK-9B2M07"),
    ("B-10233", "K-1042", "2026-02-09", "versendet", [("Netzteil 24 V", 2), ("Steckverbinder M12", 6)], "2026-02-12", "TRK-7H3Q55"),
    ("B-10234", "K-3307", "2026-02-10", "storniert", [("Schaltschrankleuchte", 2)], None, None),
    ("B-10235", "K-2210", "2026-02-11", "zugestellt", [("Kugellager 6204", 10), ("Dichtungsring-Set", 1)], "2026-02-16", "TRK-2D8L90"),
    ("B-10236", "K-4018", "2026-02-12", "versendet", [("Temperaturfühler PT100", 3)], "2026-02-17", "TRK-6P1R42"),
    ("B-10237", "K-1042", "2026-02-13", "storniert", [("Relais 24 V", 5)], None, None),
    ("B-10238", "K-5123", "2026-02-13", "versendet", [("Werkzeugkoffer", 1), ("Kabelbinder-Set", 3)], "2026-02-18", "TRK-3X9C18"),
    ("B-10239", "K-3307", "2026-02-16", "zugestellt", [("Sensorhalter", 2)], "2026-02-19", "TRK-8N5V63"),
    ("B-10240", "K-4018", "2026-02-17", "in Bearbeitung", [("Netzteil 24 V", 1), ("Relais 24 V", 4), ("Kabelbinder-Set", 1)], None, None),
    ("B-10241", "K-2210", "2026-02-18", "bestellt", [("Schaltschrankleuchte", 1)], None, None),
    ("B-10242", "K-5123", "2026-02-18", "in Bearbeitung", [("Dichtungsring-Set", 2), ("Steckverbinder M12", 4)], None, None),
    ("B-10243", "K-6094", "2026-02-19", "bestellt", [("Kugellager 6204", 4)], None, None),
    ("B-10244", "K-6094", "2026-02-19", "versendet", [("Temperaturfühler PT100", 1), ("Sensorhalter", 1)], "2026-02-24", "TRK-1G6T77"),
]
REGELN = {
    "stornierung": "Eine Bestellung kann nur storniert werden, solange ihr Status \"bestellt\" oder \"in Bearbeitung\" ist. "
                   "Ab \"versendet\" ist keine Stornierung mehr möglich, dann hilft nur eine Rücksendung.",
    "versandkosten": "Versandkosten 4,90 Euro, wenn die Zwischensumme unter 50 Euro liegt. Ab 50 Euro ist der Versand kostenlos.",
    "lieferzeit": "Die Lieferung dauert 2 bis 4 Werktage nach dem Versand. Bei Status \"versendet\" steht das voraussichtliche "
                  "Lieferdatum in der Bestellung, bei \"zugestellt\" das tatsächliche.",
    "preise": "Alle Preise sind Endpreise in Euro inklusive Mehrwertsteuer.",
}
VERSANDKOSTEN, FREI_AB = 4.90, 50.00
STORNO_STATUS = ("bestellt", "in Bearbeitung")


def euro(x):
    return ("%.2f" % x).replace(".", ",")


def datum_varianten(iso):
    j, m, t = iso.split("-")
    monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
    return ["%s.%s.%s" % (t, m, j), "%d. %s %s" % (int(t), monate[int(m) - 1], j), iso]


def summe(b):
    zw = round(sum(p["menge"] * p["einzelpreis"] for p in b["positionen"]), 2)
    vk = 0.0 if zw >= FREI_AB else VERSANDKOSTEN
    return zw, vk, round(zw + vk, 2)


def bestellungen_bauen():
    out = []
    for nr, kunde, datum, status, pos, liefer, trk in BESTELLUNGEN_ROH:
        out.append({
            "nummer": nr, "kunde": "Kunde " + kunde, "datum": datum, "status": status,
            "positionen": [{"artikel": a, "menge": m, "einzelpreis": ARTIKEL[a]} for a, m in pos],
            "lieferdatum": liefer,
            "lieferdatum_art": None if not liefer else ("tatsächlich" if status == "zugestellt" else "voraussichtlich"),
            "tracking": trk,
        })
    return out


def service_daten(bestellungen):
    """Fragen mit Erwartungen, die direkt aus den Daten berechnet werden."""
    nach = {b["nummer"]: b for b in bestellungen}
    fragen = []

    def frage(text, enthaelt, oder=None, erklaerung="", **extra):
        f = {"frage": text, "antwort_enthaelt": enthaelt}
        if oder:
            f["oder"] = oder
        f["erklaerung"] = erklaerung
        f.update(extra)
        fragen.append(f)

    b = nach["B-10233"]
    frage("Wie ist der Status der Bestellung B-10233?", "versendet",
          erklaerung="Werkzeug bestellstatus. Die Antwort nennt außerdem das Tracking-Kürzel %s." % b["tracking"],
          werkzeug="bestellstatus")
    b = nach["B-10236"]
    frage("Wann kommt die Bestellung B-10236 voraussichtlich an?", datum_varianten(b["lieferdatum"])[0],
          oder=datum_varianten(b["lieferdatum"])[1:],
          erklaerung="Werkzeug bestellstatus. Voraussichtliches Lieferdatum aus der Bestellung.", werkzeug="bestellstatus")
    b = nach["B-10243"]
    zw, vk, ges = summe(b)
    frage("Was kostet die Bestellung B-10243 insgesamt, mit Versand?", euro(ges), oder=["%.2f" % ges],
          erklaerung="Werkzeug preis_berechnen. Zwischensumme %s Euro plus %s Euro Versandkosten (unter 50 Euro)." % (euro(zw), euro(vk)),
          werkzeug="preis_berechnen")
    b = nach["B-10240"]
    zw, vk, ges = summe(b)
    frage("Wie hoch ist der Gesamtpreis der Bestellung B-10240?", euro(ges), oder=["%.2f" % ges],
          erklaerung="Werkzeug preis_berechnen. Zwischensumme %s Euro, Versand kostenlos (ab 50 Euro)." % euro(zw),
          werkzeug="preis_berechnen")
    frage("Kann ich die Bestellung B-10242 noch stornieren?", "in Bearbeitung",
          erklaerung="Werkzeug stornierung_pruefen. Ja, Status \"in Bearbeitung\" erlaubt die Stornierung.",
          werkzeug="stornierung_pruefen", stornierbar=True)
    frage("Kann ich die Bestellung B-10233 noch stornieren?", "versendet",
          erklaerung="Werkzeug stornierung_pruefen. Nein, die Bestellung ist schon versendet.",
          werkzeug="stornierung_pruefen", stornierbar=False)
    kunde = [x for x in bestellungen if x["kunde"] == "Kunde K-1042" and x["status"] == "storniert"][0]
    frage("Welche Bestellung von Kunde K-1042 wurde storniert?", kunde["nummer"],
          erklaerung="Werkzeug bestellungen_suchen mit dem Kunden K-1042 (drei Bestellungen, eine davon storniert).",
          werkzeug="bestellungen_suchen")
    b = nach["B-10238"]
    frage("Wie lautet das Tracking-Kürzel der Bestellung B-10238?", b["tracking"],
          erklaerung="Werkzeug bestellstatus.", werkzeug="bestellstatus")
    frage("Wie ist der Status der Bestellung B-10299?", "",
          erklaerung="Fangfrage: Diese Bestellung gibt es nicht. Ein gutes System sagt das ehrlich und erfindet keinen Status.",
          werkzeug="bestellstatus", im_bestand=False)
    return fragen


WERKZEUGE = [
    {
        "name": "bestellstatus",
        "beschreibung": "Gibt Status, Lieferdatum, Tracking-Kürzel und Positionen einer Bestellung zurück. "
                        "Bei unbekannter Nummer kommt {\"fehler\": \"Bestellung nicht gefunden\"}.",
        "parameter": {"type": "object", "properties": {"nummer": {"type": "string", "description": "Bestellnummer, z. B. B-10233"}},
                      "required": ["nummer"]},
        "rueckgabe_beispiel": None,       # wird gefuellt
    },
    {
        "name": "preis_berechnen",
        "beschreibung": "Berechnet Zwischensumme, Versandkosten und Gesamtpreis einer Bestellung nach den Regeln "
                        "(Versand 4,90 Euro unter 50 Euro, sonst kostenlos). Rechnet im Werkzeug, nicht im Modell.",
        "parameter": {"type": "object", "properties": {"nummer": {"type": "string", "description": "Bestellnummer, z. B. B-10240"}},
                      "required": ["nummer"]},
        "rueckgabe_beispiel": None,
    },
    {
        "name": "stornierung_pruefen",
        "beschreibung": "Prüft, ob eine Bestellung noch storniert werden kann (nur Status \"bestellt\" oder \"in Bearbeitung\"). "
                        "Storniert nicht selbst, sondern liefert nur Antwort und Grund.",
        "parameter": {"type": "object", "properties": {"nummer": {"type": "string", "description": "Bestellnummer, z. B. B-10242"}},
                      "required": ["nummer"]},
        "rueckgabe_beispiel": None,
    },
    {
        "name": "bestellungen_suchen",
        "beschreibung": "Listet alle Bestellungen eines Kunden mit Nummer, Datum und Status. Der Kunde wird als Kürzel angegeben.",
        "parameter": {"type": "object", "properties": {"kunde": {"type": "string", "description": "Kundenkürzel, z. B. K-1042"}},
                      "required": ["kunde"]},
        "rueckgabe_beispiel": None,
    },
]


def werkzeug_beispiele(bestellungen):
    nach = {b["nummer"]: b for b in bestellungen}
    b = nach["B-10233"]
    zw, vk, ges = summe(nach["B-10240"])
    s = nach["B-10242"]
    WERKZEUGE[0]["rueckgabe_beispiel"] = {k: b[k] for k in ("nummer", "status", "lieferdatum", "lieferdatum_art", "tracking", "positionen")}
    WERKZEUGE[1]["rueckgabe_beispiel"] = {"nummer": "B-10240", "zwischensumme": zw, "versandkosten": vk, "gesamt": ges, "waehrung": "EUR"}
    WERKZEUGE[2]["rueckgabe_beispiel"] = {"nummer": s["nummer"], "status": s["status"], "stornierbar": s["status"] in STORNO_STATUS,
                                          "grund": "Status \"in Bearbeitung\" erlaubt die Stornierung."}
    WERKZEUGE[3]["rueckgabe_beispiel"] = {"kunde": "K-1042", "bestellungen": [
        {"nummer": x["nummer"], "datum": x["datum"], "status": x["status"]} for x in bestellungen if x["kunde"] == "Kunde K-1042"]}


# ======================================================================================
# 3. Fotos (Objekterkennung)
# ======================================================================================
DE = {  # COCO-Klasse -> (Einzahl, Mehrzahl), wie in der Oberflaeche des Labors, mit Umlauten
    "person": ("Person", "Personen"), "bicycle": ("Fahrrad", "Fahrräder"), "car": ("Auto", "Autos"),
    "truck": ("LKW", "LKW"), "bus": ("Bus", "Busse"), "train": ("Zug", "Züge"),
    "bottle": ("Flasche", "Flaschen"), "cup": ("Tasse", "Tassen"), "refrigerator": ("Kühlschrank", "Kühlschränke"),
    "dining table": ("Esstisch", "Esstische"),
}
# Pro Foto: Use-Case, Bildunterschrift, Klassen, die fachlich sinnvoll sind, und optional eine Bemerkung.
FOTO_INFO = {
    "logistik-lieferwagen-fahrrad.jpg": {"uc": "logistik-zaehlen", "titel": "Lieferwagen am Straßenrand mit Fahrrad",
                                         "sinnvoll": ["truck", "bicycle"]},
    "logistik-hafenhof-container.jpg": {"uc": "logistik-zaehlen", "titel": "Hof mit Containern und Lastwagen",
                                        "sinnvoll": ["truck"],
                                        "bemerkung": "Das kleine Fahrzeug im Hintergrund wird mitgezählt, Container selbst kennt das Modell nicht."},
    "logistik-sattelzug-ladung.jpg": {"uc": "logistik-zaehlen", "titel": "Sattelzug mit Ladung vor einem Schiff",
                                      "sinnvoll": ["truck"]},
    "logistik-kleintransporter-strasse.jpg": {"uc": "logistik-zaehlen", "titel": "Kleintransporter und abgestellte Fahrräder",
                                              "sinnvoll": ["truck", "bicycle"],
                                              "bemerkung": "Es stehen mehr Fahrräder im Bild, als erkannt werden. Kleine und verdeckte Objekte fehlen."},
    "handel-getraenkeregal.jpg": {"uc": "handel-regal", "titel": "Regal mit Getränkeflaschen", "sinnvoll": ["bottle"]},
    "handel-tassen-tisch.jpg": {"uc": "handel-regal", "titel": "Tassen auf einem Holztisch", "sinnvoll": ["cup", "bottle"],
                              "bemerkung": "Der Krug im Hintergrund wird als Flasche erkannt."},
    "handel-regal-luecken.jpg": {"uc": "handel-regal", "titel": "Regal mit Waschmitteln und Lücken", "sinnvoll": ["bottle"],
                                 "bemerkung": "Das Modell erkennt Flaschen, aber nicht, dass es Waschmittel sind und dass Plätze leer sind."},
    "baustelle-metro-pause.jpg": {"uc": "sicherheit-baustelle", "titel": "Straßenbaustelle mit Arbeitern in Warnkleidung",
                                  "sinnvoll": ["person"]},
    "baustelle-halle-montage.jpg": {"uc": "sicherheit-baustelle", "titel": "Werkhalle bei der Montage eines großen Bauteils (Schwarzweißfoto)",
                                    "sinnvoll": ["person"],
                                    "bemerkung": "Es sind mehr Menschen im Bild, als erkannt werden. Viele sind klein oder verdeckt."},
    "baustelle-neubau-ferne.jpg": {"uc": "sicherheit-baustelle", "titel": "Großbaustelle am Straßenrand, Personen weit entfernt",
                                   "sinnvoll": ["person", "car"],
                                   "bemerkung": "Die meisten Personen sind zu klein und werden nicht erkannt."},
}


def anzahl_text(n):
    """Zaehlt grob aus: ab 10 nur noch 'mehr als'."""
    return "mehr als %d" % (n // 5 * 5) if n >= 10 else str(n)


def foto_erwartet(stabil, sinnvoll):
    teile = []
    for k in sinnvoll:
        n = stabil.get(k, 0)
        if n:
            teile.append("%s %s" % (anzahl_text(n), DE[k][0 if n == 1 else 1]))
    return "ungefähr: " + ", ".join(teile)


def foto_fehlmeldung(stabil, sinnvoll):
    extra = [k for k in stabil if k not in sinnvoll]
    if not extra:
        return None
    return "Fehlmeldung: " + ", ".join("%s %s" % (anzahl_text(stabil[k]), DE.get(k, (k, k))[0 if stabil[k] == 1 else 1]) for k in extra)


# ======================================================================================
# 4. Nachmessen mit den Modellen des Labors (cv2)
# ======================================================================================
COCO = ["person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "traffic light", "fire hydrant",
        "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra",
        "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite",
        "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup", "fork",
        "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut",
        "cake", "chair", "couch", "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote",
        "keyboard", "cell phone", "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase",
        "scissors", "teddy bear", "hair drier", "toothbrush"]


class Modelle:
    """Dasselbe Vorgehen wie app.py: MobileNet-Embedding + 3 naechste Nachbarn, YOLOX-tiny."""

    def __init__(self, ordner):
        import cv2  # lokal importiert, damit das Bauen ohne cv2 geht
        self.cv2 = cv2
        self.embed = cv2.dnn.readNetFromONNX(str(Path(ordner) / "mobilenet_embed.onnx"))
        self.yolox = cv2.dnn.readNetFromONNX(str(Path(ordner) / "yolox_tiny.onnx"))
        g, st = [], []
        for s in (8, 16, 32):
            n = 640 // s
            xv, yv = np.meshgrid(np.arange(n), np.arange(n))
            gr = np.stack((xv, yv), 2).reshape(-1, 2)
            g.append(gr)
            st.append(np.full((gr.shape[0], 1), s))
        self.gitter, self.schritt = np.concatenate(g), np.concatenate(st)

    def embedding(self, jpeg):
        cv2 = self.cv2
        img = cv2.imdecode(np.frombuffer(jpeg, np.uint8), cv2.IMREAD_COLOR)
        blob = cv2.dnn.blobFromImage(img, 1 / 255.0, (224, 224), (0.485 * 255, 0.456 * 255, 0.406 * 255), swapRB=True)
        self.embed.setInput(blob)
        v = self.embed.forward().flatten().astype(np.float32)
        return v / np.linalg.norm(v)

    @staticmethod
    def knn(vec, trainiert, k=3):
        paare = sorted(((float(np.dot(vec, s)), label) for label, vs in trainiert.items() for s in vs), reverse=True)[:k]
        return Counter(l for _, l in paare).most_common(1)[0][0]

    def objekte(self, img, schwelle=0.5):
        cv2 = self.cv2
        H, W = img.shape[:2]
        if W > 1280 or H > 720:                              # wie im Labor: Frames werden begrenzt
            s = min(1280 / W, 720 / H)
            img = cv2.resize(img, (int(W * s), int(H * s)))
            H, W = img.shape[:2]
        r = min(640 / W, 640 / H)
        nw, nh = int(W * r), int(H * r)
        pad = np.full((640, 640, 3), 114, np.uint8)
        pad[:nh, :nw] = cv2.resize(img, (nw, nh))
        self.yolox.setInput(cv2.dnn.blobFromImage(pad, 1.0, (640, 640), swapRB=True))
        out = self.yolox.forward()[0]
        xy = (out[:, 0:2] + self.gitter) * self.schritt
        wh = np.exp(out[:, 2:4]) * self.schritt
        sc = out[:, 4:5] * out[:, 5:]
        cls, conf = sc.argmax(1), sc.max(1)
        boxen, confs, klassen = [], [], []
        for i in np.where(conf > schwelle)[0]:
            cx, cy = xy[i]
            bw, bh = wh[i]
            boxen.append([int((cx - bw / 2) / r), int((cy - bh / 2) / r), int(bw / r), int(bh / r)])
            confs.append(float(conf[i]))
            klassen.append(int(cls[i]))
        idx = cv2.dnn.NMSBoxes(boxen, confs, schwelle, 0.45) if boxen else []
        return Counter(COCO[klassen[i]] for i in np.array(idx).flatten())


def nachmessen(ordner):
    m = Modelle(ordner)
    cv2 = m.cv2
    pruef = {"version": 1, "verfahren": "MobileNetV2-Merkmale, 3 nächste Nachbarn (wie Labor Anlernen); YOLOX-tiny bei Schwelle 0,5",
             "ort": "Entwicklungsrechner mit denselben ONNX-Modellen wie das Labor, nicht auf dem Jetson selbst",
             "klassifikation": {}, "objekte": {}}
    for sid, s in SETS.items():
        trainiert = {}
        for ci, (kname, label) in enumerate(s["klassen"]):
            trainiert[label] = [m.embedding((ZIEL / ("%s/%s/%02d.jpg" % (sid, kname, i + 1))).read_bytes()) for i in range(s["train"])]
        manifest_test = []
        richtig = 0
        for p in sorted((ZIEL / sid / "test").glob("*.jpg")):
            manifest_test.append(p)
        erwartet = {t["bild"]: t["erwartet"] for t in SETS_MANIFEST[sid]["test"]}
        fehler = []
        for p in manifest_test:
            rel = "%s/test/%s" % (sid, p.name)
            erkannt = m.knn(m.embedding(p.read_bytes()), trainiert)
            if erkannt == erwartet[rel]:
                richtig += 1
            else:
                fehler.append({"bild": rel, "erwartet": erwartet[rel], "erkannt": erkannt})
        # Stichprobe: frisch erzeugt, nicht ausgeliefert, mit demselben JPEG-Weg
        sr = sg = 0
        for ci, (kname, label) in enumerate(s["klassen"]):
            for i in range(STICHPROBE):
                vec = m.embedding(jpeg_bytes(s["erzeuger"](kname, seed_von(s, "stichprobe", ci, i), i)))
                sg += 1
                sr += m.knn(vec, trainiert) == label
        pruef["klassifikation"][sid] = {"test_richtig": richtig, "test_gesamt": len(manifest_test),
                                        "stichprobe_richtig": int(sr), "stichprobe_gesamt": sg, "fehler": fehler}
        print("%-26s Test %d/%d, Stichprobe %d/%d" % (sid, richtig, len(manifest_test), sr, sg))
    for p in sorted((ZIEL / "fotos").glob("*.jpg")):
        img = cv2.imread(str(p))
        q60 = cv2.imdecode(cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 60])[1], cv2.IMREAD_COLOR)
        schmal = cv2.resize(img, (640, round(img.shape[0] * 640 / img.shape[1])))
        varianten = [m.objekte(v) for v in (img, q60, schmal)]
        stabil = {k: min(v.get(k, 0) for v in varianten) for k in varianten[0]}
        stabil = {k: n for k, n in stabil.items() if n > 0}
        pruef["objekte"][p.name] = {"original": dict(varianten[0]), "stabil": stabil}
        print("%-40s %s" % (p.name, stabil))
    (ZIEL / "pruefung.json").write_text(json.dumps(pruef, ensure_ascii=False, indent=1), encoding="utf-8")
    return pruef


# ======================================================================================
# 5. Gegenprobe gegen das laufende Labor (LABOR_URL)
# ======================================================================================
class Labor:
    def __init__(self):
        self.url = os.environ.get("LABOR_URL", "").rstrip("/")
        if not self.url:
            raise SystemExit("LABOR_URL ist nicht gesetzt")
        # Das Labor nutzt ein selbst signiertes Zertifikat (wie curl -k), deshalb keine Pruefung.
        self.ctx = ssl.create_default_context()
        self.ctx.check_hostname = False
        self.ctx.verify_mode = ssl.CERT_NONE

    def post(self, pfad, daten, text=False, versuche=4):
        req = urllib.request.Request(self.url + pfad, data=json.dumps(daten).encode(), method="POST",
                                     headers={"Origin": self.url, "Content-Type": "application/json"})
        for v in range(versuche):
            try:
                roh = urllib.request.urlopen(req, timeout=180, context=self.ctx).read().decode("utf-8")
                return roh if text else json.loads(roh)
            except Exception as e:                          # Neustart durch andere Nutzer: kurz warten
                if v == versuche - 1:
                    raise
                print("  Wiederholung wegen %s" % e, file=sys.stderr)
                import time
                time.sleep(3 + 3 * v)


def dataurl(pfad):
    import base64
    return "data:image/jpeg;base64," + base64.b64encode(Path(pfad).read_bytes()).decode()


def enthaelt(text, frage):
    ziele = [frage["antwort_enthaelt"]] + list(frage.get("oder", []))
    t = text.lower()
    return any(z.lower() in t for z in ziele if z)


def jetson_pruefen(manifest):
    labor = Labor()
    try:
        for uc in manifest["usecases"]:
            if uc["lab"] == "anlernen":
                labor.post("/api/teach/reset", {})
                for k in uc["daten"]["klassen"]:
                    for rel in k["bilder"]:
                        labor.post("/api/teach/sample", {"bild": dataurl(ZIEL / rel), "label": k["name"]})
                ok = 0
                for t in uc["daten"]["test"]:
                    antwort = labor.post("/api/teach/classify", {"bild": dataurl(ZIEL / t["bild"])})
                    ok += antwort.get("label") == t["erwartet"]
                print("%-26s %d/%d Testbilder richtig (Jetson)" % (uc["id"], ok, len(uc["daten"]["test"])))
            if uc["id"] == "buero-dokumente":
                labor.post("/api/rag/reset", {})
                for d in uc["daten"]["dokumente"]:
                    labor.post("/api/rag/upload", {"text": (ZIEL / d["datei"]).read_text(encoding="utf-8")})
                for f in uc["daten"]["fragen"]:
                    such = labor.post("/api/rag/search", {"frage": f["frage"]})
                    rang = next((t["rang"] for t in such["treffer"] if enthaelt(t["text"], f)), None) if f["antwort_enthaelt"] else None
                    antwort = labor.post("/api/rag/ask", {"frage": f["frage"]}, text=True)
                    print("  %-62s Treffer-Rang %s, Antwort %s" % (
                        f["frage"][:62], rang if f["antwort_enthaelt"] else "(Fangfrage)",
                        ("enthält Stichwort" if enthaelt(antwort, f) else "OHNE Stichwort") if f["antwort_enthaelt"] else antwort[:60].replace("\n", " ")))
    finally:
        labor.post("/api/teach/reset", {})
        labor.post("/api/rag/reset", {})
        print("Labor zurückgesetzt")


# ======================================================================================
# 6. Manifest und Quellen
# ======================================================================================
PFLICHTHINWEIS_GESUNDHEIT = "Synthetische Bilder, keine medizinischen Daten. Zeigt nur das Prinzip einer Zweitmeinung, kein Medizinprodukt."
FRAGEN_DOKUMENTE = [
    {"frage": "Wie lang ist die Kündigungsfrist im Dienstleistungsvertrag?", "antwort_enthaelt": "drei Monate", "oder": ["3 Monate"],
     "quelle_dokument": "dienstleistungsvertrag.txt"},
    {"frage": "Wie hoch ist die monatliche Pauschale im Dienstleistungsvertrag?", "antwort_enthaelt": "4.800", "oder": ["4800"],
     "quelle_dokument": "dienstleistungsvertrag.txt"},
    {"frage": "Alle wie viele Betriebsstunden wird die Förderkette der Verpackungsanlage geschmiert?", "antwort_enthaelt": "250",
     "quelle_dokument": "wartungsanleitung.txt"},
    {"frage": "Was bedeutet der Fehlercode E14?", "antwort_enthaelt": "Siegeltemperatur", "oder": ["Temperatur"],
     "quelle_dokument": "wartungsanleitung.txt"},
    {"frage": "Wie viele Tage pro Woche dürfen Beschäftigte mobil arbeiten?", "antwort_enthaelt": "zwei", "oder": ["2 Tage", "bis zu 2"],
     "quelle_dokument": "betriebsvereinbarung_homeoffice.txt"},
    {"frage": "Wie früh muss ich den Antrag auf mobiles Arbeiten stellen?", "antwort_enthaelt": "zwei Wochen", "oder": ["2 Wochen"],
     "quelle_dokument": "betriebsvereinbarung_homeoffice.txt"},
    {"frage": "Wie lange gilt die Garantie für die Schreibtischlampe?", "antwort_enthaelt": "drei Jahre", "oder": ["3 Jahre"],
     "quelle_dokument": "produkt_faq.txt"},
    {"frage": "Wie viel Urlaub steht Beschäftigten im Musterwerk zu?", "antwort_enthaelt": "", "quelle_dokument": None,
     "im_text": False, "erklaerung": "Fangfrage: Davon steht nichts in den Dokumenten. Ein gutes System sagt das, statt eine Zahl zu erfinden."},
]


def prozent(r, g):
    return "%d Prozent" % round(100 * r / g)


def klass_erwartung(p, extra):
    return ("Mit genau diesen Bildern und dem Verfahren des Labors (MobileNet-Merkmale, 3 nächste Nachbarn) wurden %d von %d Testbildern "
            "richtig zugeordnet. Bei %d weiteren, frisch erzeugten Bildern waren es %s (%d richtig). %s "
            "Gemessen auf einem Entwicklungsrechner mit denselben Modelldateien, nicht auf dem Jetson selbst."
            % (p["test_richtig"], p["test_gesamt"], p["stichprobe_gesamt"], prozent(p["stichprobe_richtig"], p["stichprobe_gesamt"]),
               p["stichprobe_richtig"], extra)).strip()


def manifest_bauen(sets, bestellungen, pruef):
    meta = json.loads((ZIEL / "fotos" / "meta.json").read_text(encoding="utf-8"))

    def fotos(uc):
        out = []
        for datei, info in FOTO_INFO.items():
            if info["uc"] != uc:
                continue
            ob = pruef["objekte"][datei]["stabil"]
            m = meta[datei]
            eintrag = {"datei": "fotos/" + datei, "titel": info["titel"], "erwartet": foto_erwartet(ob, info["sinnvoll"]),
                       "quelle": "%s, %s, Wikimedia Commons: %s" % (m["urheber"], m["lizenz"], m["url"])}
            fm = foto_fehlmeldung(ob, info["sinnvoll"])
            if fm:
                eintrag["fehlmeldung"] = fm
            if info.get("bemerkung"):
                eintrag["bemerkung"] = info["bemerkung"]
            out.append(eintrag)
        return out

    k = pruef["klassifikation"]
    audio_text = (ZIEL / "audio" / "besprechung.txt").read_text(encoding="utf-8").strip()
    werkzeug_beispiele(bestellungen)

    usecases = [
        {
            "id": "fertigung-sichtpruefung", "bereich": "Fertigung", "titel": "Sichtprüfung: Gutteil oder Ausschuss", "lab": "anlernen",
            "beschreibung": "Am Bandende einer Stanzerei werden runde Metallscheiben von Hand angesehen. Gesucht sind Kratzer, Dellen und "
                            "ausgebrochene Kanten. Das ermüdet, und was noch als gut gilt, schwankt von Schicht zu Schicht.",
            "ziel": "Du zeigst, dass ein vortrainiertes Netz aus wenigen Beispielen lernt, Gutteile von Ausschuss zu trennen, und wo diese Methode an Grenzen stößt.",
            "ablauf": ["Starte den Use-Case. Der Jetson nimmt je 20 Beispielbilder der Klassen Gut und Ausschuss auf.",
                       "Wähle eines der Testbilder, die das Modell noch nie gesehen hat.",
                       "Lass es zuordnen und lies die Balken: Die Klasse mit dem längsten Balken gewinnt.",
                       "Vergleiche mit der erwarteten Klasse und probiere weitere Testbilder, auch solche mit Delle oder Ausbruch."],
            "daten": {"klassen": sets["fertigung-sichtpruefung"]["klassen"], "test": sets["fertigung-sichtpruefung"]["test"]},
            "erwartung": klass_erwartung(k["fertigung-sichtpruefung"],
                                         "Die Balken liegen oft eng beieinander. Entscheidend ist, welche Klasse vorn liegt."),
            "hinweis": "Synthetische Bilder, per Code gezeichnet. Die Fehlerarten sitzen immer ähnlich (Delle oben, Ausbruch unten), damit 20 Beispiele reichen. "
                       "Echte Teile brauchen mehr und vielfältigere Beispiele, vor allem wenn Fehler an beliebiger Stelle auftreten.",
        },
        {
            "id": "fertigung-sortieren", "bereich": "Fertigung", "titel": "Bauteile nach Typ sortieren", "lab": "anlernen",
            "beschreibung": "In der Kommissionierung landen Schrauben, Muttern und Scheiben gemischt in einer Kiste. Bisher sortiert jemand sie "
                            "von Hand, bevor sie in die richtigen Fächer gehen. Eine Kamera über dem Tisch könnte das übernehmen.",
            "ziel": "Du zeigst, dass sich Teile mit klar verschiedener Form schon mit wenigen Beispielen je Typ zuverlässig sortieren lassen.",
            "ablauf": ["Starte den Use-Case. Der Jetson nimmt je 20 Beispielbilder der Klassen Schraube, Mutter und Scheibe auf.",
                       "Wähle ein Testbild und lass es zuordnen.",
                       "Achte darauf, dass die Teile in jeder Lage und Drehung richtig erkannt werden.",
                       "Vergleiche die drei Balken: Bei klar verschiedenen Formen ist der Abstand groß."],
            "daten": {"klassen": sets["fertigung-sortieren"]["klassen"], "test": sets["fertigung-sortieren"]["test"]},
            "erwartung": klass_erwartung(k["fertigung-sortieren"], "Die Formen unterscheiden sich so deutlich, dass das Verfahren hier sehr sicher ist."),
            "hinweis": "Synthetische Bilder, per Code gezeichnet. Echte Teile glänzen, spiegeln und liegen übereinander, das macht es schwerer.",
        },
        {
            "id": "logistik-zaehlen", "bereich": "Logistik und Lager", "titel": "Fahrzeuge und Fahrräder auf dem Hof zählen", "lab": "objekt",
            "beschreibung": "Auf dem Betriebshof und an der Rampe stehen Lieferfahrzeuge, dazwischen Fahrräder. Die Torkontrolle möchte wissen, "
                            "wie viele Fahrzeuge gerade da sind, ohne jedes Mal hinzusehen.",
            "ziel": "Du zeigst, wie Objekterkennung Fahrzeuge findet und zählt, und wo sie bei kleinen oder verdeckten Objekten ungenau wird.",
            "ablauf": ["Wähle eines der vier Fotos.",
                       "Der Jetson zeichnet Rahmen mit Klasse und Sicherheit ein.",
                       "Zähle die Rahmen je Klasse und vergleiche mit dem Foto.",
                       "Ziehe den Regler Schwelle nach unten: Es kommen mehr Treffer, aber auch Fehlalarme."],
            "daten": {"bilder": fotos("logistik-zaehlen")},
            "erwartung": "Unter \"erwartet\" steht je Foto, was bei der Voreinstellung (Schwelle 50 Prozent) erkannt wird. Die Zahlen können um einen Treffer "
                         "abweichen. Gemessen mit demselben Modell auf einem Entwicklungsrechner, stabil auch nach erneuter JPEG-Kompression.",
            "hinweis": "Echte Fotos von Wikimedia Commons (CC0 oder gemeinfrei), Quellen im Eintrag und in QUELLEN.md.",
        },
        {
            "id": "handel-regal", "bereich": "Handel", "titel": "Regal und Tisch: Was steht da?", "lab": "objekt",
            "beschreibung": "Ein Händler möchte automatisch sehen, ob ein Regal gut gefüllt ist. Eine Kamera am Gang soll Flaschen und andere "
                            "Gegenstände im Regal finden und die Lücken sichtbar machen.",
            "ziel": "Du zeigst, was Objekterkennung im Regal leistet (Dinge finden und zählen) und was sie nicht kann (Produkte unterscheiden, Lücken verstehen).",
            "ablauf": ["Wähle eines der drei Fotos.",
                       "Der Jetson zeichnet Rahmen mit Klasse und Sicherheit ein.",
                       "Prüfe, ob die Klassen stimmen: Das Modell sagt Flasche, nicht Cola oder Waschmittel.",
                       "Vergleiche das volle mit dem lückenhaften Regal: Zählt das Modell die Lücken?"],
            "daten": {"bilder": fotos("handel-regal")},
            "erwartung": "Flaschen und Tassen werden gefunden. Bei vollen Regalen ist die Zahl der Flaschen groß, bei Lücken kleiner, aber das Modell "
                         "weiß nicht, was fehlt. Es kommen auch Fehlmeldungen vor, zum Beispiel ein Regal als Kühlschrank.",
            "hinweis": "COCO kennt keine Handelsprodukte: Das Modell erkennt Flasche, Tasse oder Schale, aber keine Marken und keine Artikelnummern. "
                       "Für eigene Produkte braucht man ein eigenes Modell oder, für wenige Klassen, das Labor Anlernen. "
                       "Echte Fotos von Wikimedia Commons (CC0 oder gemeinfrei).",
        },
        {
            "id": "sicherheit-baustelle", "bereich": "Sicherheit und Zutritt", "titel": "Personen auf Baustelle und in der Werkhalle", "lab": "objekt",
            "beschreibung": "Auf Baustellen und in Werkhallen halten sich Menschen in Bereichen auf, in denen Fahrzeuge und Lasten bewegt werden. "
                            "Eine Kamera könnte melden, wenn jemand im Gefahrenbereich steht.",
            "ziel": "Du zeigst, dass die Objekterkennung Personen findet, und besprichst, was sie dabei nicht kann.",
            "ablauf": ["Wähle eines der drei Fotos.",
                       "Der Jetson markiert erkannte Personen mit einem Rahmen.",
                       "Suche Personen, die nicht erkannt werden, und überlege warum (Größe, Verdeckung).",
                       "Prüfe, ob das Modell Schutzhelme oder Warnwesten unterscheidet: Es tut es nicht."],
            "daten": {"bilder": fotos("sicherheit-baustelle")},
            "erwartung": "Personen werden erkannt, wenn sie groß genug und nicht verdeckt sind. Kleine und weit entfernte Personen fehlen. "
                         "Die Klasse ist immer nur \"Person\", ohne Auskunft über Helm oder Weste.",
            "hinweis": "Dieses Modell erkennt Personen, aber keinen Schutzhelm und keine Warnweste. Für Nahaufnahmen kannst du im Labor Anlernen zwei Klassen "
                       "(mit Helm, ohne Helm) aufnehmen. Für Personen im Gesamtbild braucht man ein eigens trainiertes Erkennungsmodell. "
                       "Personenerkennung am Arbeitsplatz braucht außerdem Datenschutz und Mitbestimmung. Echte Fotos von Wikimedia Commons (CC0 oder gemeinfrei).",
        },
        {
            "id": "gesundheit-auffaellig", "bereich": "Gesundheit", "titel": "Zweitmeinung: Zellprobe auffällig oder unauffällig", "lab": "anlernen",
            "beschreibung": "Im Labor werden Proben unter dem Mikroskop angesehen. Bei sehr vielen Proben soll eine Software vorsortieren und Proben "
                            "mit einer Ansammlung dunkler, vergrößerter Zellen zur genaueren Prüfung nach vorn legen.",
            "ziel": "Du zeigst das Prinzip einer Zweitmeinung: Das Modell entscheidet nicht, es lenkt den Blick auf Proben, die ein Mensch prüfen sollte.",
            "ablauf": ["Starte den Use-Case. Der Jetson nimmt je 20 Beispielbilder der Klassen Unauffällig und Auffällig auf.",
                       "Wähle ein Testbild und lass es zuordnen.",
                       "Lies die Balken und vergleiche mit der erwarteten Klasse.",
                       "Überlege, welcher Fehler schlimmer wäre: eine auffällige Probe zu übersehen oder eine unauffällige zu melden."],
            "daten": {"klassen": sets["gesundheit-auffaellig"]["klassen"], "test": sets["gesundheit-auffaellig"]["test"]},
            "erwartung": klass_erwartung(k["gesundheit-auffaellig"], "Der Unterschied ist deutlich gezeichnet, deshalb ist die Trennung leicht."),
            "hinweis": PFLICHTHINWEIS_GESUNDHEIT,
        },
        {
            "id": "buero-dokumente", "bereich": "Büro und Wissen", "titel": "Fragen an vier Dokumente", "lab": "rag",
            "beschreibung": "In einem Unternehmen liegen Wartungsanleitung, Vertrag, Betriebsvereinbarung und Produkt-FAQ in verschiedenen Ordnern. "
                            "Wer eine Antwort braucht, blättert lange. Hier sind vier erfundene Beispieldokumente, an die du Fragen stellst.",
            "ziel": "Du zeigst, dass das System erst passende Textstellen sucht und nur damit antwortet, und wie du an den Scores siehst, ob die Suche richtig lag.",
            "ablauf": ["Starte den Use-Case. Die vier Dokumente werden eingelesen und in Abschnitte zerlegt.",
                       "Stelle eine der Beispielfragen.",
                       "Sieh dir zuerst die Treffer und ihre Scores an.",
                       "Lies die Antwort und prüfe, ob sie das erwartete Stichwort enthält und die Quelle nennt.",
                       "Stelle zum Schluss die Fangfrage nach dem Urlaub: Sie steht in keinem Dokument."],
            "daten": {"dokumente": [
                {"titel": "Wartungsanleitung Verpackungsanlage VP-200", "datei": "buero-dokumente/wartungsanleitung.txt"},
                {"titel": "Auszug Dienstleistungsvertrag", "datei": "buero-dokumente/dienstleistungsvertrag.txt"},
                {"titel": "Betriebsvereinbarung mobiles Arbeiten", "datei": "buero-dokumente/betriebsvereinbarung_homeoffice.txt"},
                {"titel": "Produkt-FAQ Schreibtischlampe Modell L3", "datei": "buero-dokumente/produkt_faq.txt"},
            ], "fragen": [dict(f, quelle_dokument=("buero-dokumente/" + f["quelle_dokument"]) if f["quelle_dokument"] else None)
                          for f in FRAGEN_DOKUMENTE]},
            "erwartung": "Jede Antwort steht wörtlich in einem der Dokumente. Bei einem reinen Stichwortvergleich (ohne das Embedding-Modell) liegt der richtige "
                         "Abschnitt bei allen sieben Fragen unter den ersten zwei von zwölf. Ob die Suche mit nomic-embed-text auf dem Jetson genauso gut trifft, "
                         "wurde bei der Erstellung nicht geprüft (kein Zugang). Das geht mit scripts/beispiele_bauen.py --jetson. "
                         "Die Fangfrage soll mit \"steht nicht im Text\" oder Ähnlichem enden.",
            "hinweis": "Alle Dokumente sind frei erfunden. Es gibt weder die Firmen noch die Produkte, und die Angaben haben keinen Rechtswert.",
        },
        {
            "id": "buero-protokoll", "bereich": "Büro und Wissen", "titel": "Besprechungsprotokoll aus Sprache", "lab": "whisper",
            "beschreibung": "Nach einer Besprechung soll jemand das Protokoll schreiben. Das kostet Zeit und gerät oft zu kurz. Hier liegt eine kurze "
                            "Sprachaufnahme einer fiktiven Besprechung mit zwei Entscheidungen und einer Aufgabe.",
            "ziel": "Du zeigst, dass der Jetson Sprache lokal in Text umwandelt, und prüfst, was bei Namen, Zahlen und Datumsangaben schiefgeht.",
            "ablauf": ["Spiele die Beispielaufnahme ab: Sie dauert etwa 28 Sekunden.",
                       "Lass sie vom Jetson in Text umwandeln.",
                       "Vergleiche das Ergebnis mit dem Originaltext.",
                       "Achte auf Datumsangaben, Zahlen und Fachwörter wie Zweischichtbetrieb."],
            "daten": {"audio": "audio/besprechung.mp3", "text_datei": "audio/besprechung.txt", "dauer_sekunden": 28,
                      "originaltext": audio_text},
            "erwartung": "Der Jetson schreibt den Text im Großen und Ganzen mit. Bei Zahlen und Datumsangaben kann die Schreibweise abweichen (Ziffern statt Wörter), "
                         "und Fachwörter werden mitunter getrennt oder anders geschrieben. Die Datei wurde bei der Erstellung nicht auf dem Jetson transkribiert, "
                         "der Originaltext dient dir als Vergleich.",
            "hinweis": "Die Aufnahme ist eine synthetische Stimme (ElevenLabs, Modell eleven_v4, Stimme George). Der Inhalt ist frei erfunden, es gibt keine echte Besprechung.",
        },
        {
            "id": "service-bestellung", "bereich": "Kundenservice", "titel": "Bestellfragen mit Werkzeugen beantworten", "lab": "agent",
            "beschreibung": "Im Kundenservice fragen viele nach dem Stand ihrer Bestellung, dem Gesamtpreis oder einer Stornierung. Die Antworten stehen im "
                            "Bestellsystem, und jemand muss sie nachschlagen und nachrechnen. Hier schlägt ein Agent selbst nach.",
            "ziel": "Du zeigst, dass ein Modell mit Werkzeugen Bestellungen nachschlägt, rechnen lässt und anhand einer Regel entscheidet, statt zu raten.",
            "ablauf": ["Starte den Use-Case. Der Agent bekommt die vier Bestellwerkzeuge und einen erfundenen Bestand von 14 Bestellungen.",
                       "Stelle eine der Beispielfragen.",
                       "Sieh dir jeden Schritt an: welches Werkzeug der Agent wählt und welche Daten zurückkommen.",
                       "Stelle die Fangfrage nach einer Bestellung, die es nicht gibt, und prüfe, ob der Agent ehrlich bleibt."],
            "daten": {"bestellungen": "daten/bestellungen.json", "regeln": REGELN, "fragen": service_daten(bestellungen),
                      "werkzeuge": WERKZEUGE},
            "erwartung": "Der Agent soll für jede Frage das passende Werkzeug aufrufen und die Antwort aus dem Ergebnis ablesen. Kleine Modelle wählen manchmal das "
                         "falsche Werkzeug oder rechnen selbst falsch. Dann siehst du es im Schrittverlauf. Die Werkzeuge existieren erst, wenn das Backend sie umsetzt.",
            "hinweis": "Alle Bestellungen, Kundenkürzel, Artikel und Preise sind frei erfunden.",
        },
        {
            "id": "sicherheit-zutritt", "bereich": "Sicherheit und Zutritt", "titel": "Zutritt: Ist jemand an der Tür?", "lab": "gesicht", "live": True,
            "beschreibung": "Ein Türsystem soll erkennen, ob jemand vor dem Eingang steht, bevor es etwas auslöst, zum Beispiel das Licht oder eine Klingel. "
                            "Wer das ist, soll es dabei nicht erfahren.",
            "ziel": "Du zeigst den Unterschied zwischen Gesicht erkennen und Person identifizieren und besprichst Datenschutz und Rechtsgrundlage.",
            "ablauf": ["Öffne das Labor Gesichter und erlaube der Seite den Zugriff auf deine Kamera.",
                       "Stelle dich in den Bildausschnitt: Der Jetson markiert dein Gesicht mit einem Rahmen.",
                       "Neige den Kopf, geh weiter weg oder setze eine Maske auf und beobachte, wann der Rahmen verschwindet.",
                       "Lass eine zweite Person ins Bild kommen: Der Jetson findet beide Gesichter, weiß aber nicht, wer wer ist."],
            "daten": {},
            "erwartung": "Der Rahmen folgt deinem Gesicht, solange es gut beleuchtet und nicht stark verdeckt ist. Es wird nur erkannt, dass ein Gesicht da ist, nicht wessen. "
                         "Der Jetson speichert nichts.",
            "hinweis": "Dieses Labor wertet dein Kamerabild nur aus, um den Rahmen einzuzeichnen, und speichert nichts. In einem echten Zutrittssystem sind Gesichter "
                       "biometrische Daten und besonders geschützt. Du brauchst eine Rechtsgrundlage, Beteiligung von Datenschutz und Betriebsrat, klare Löschfristen "
                       "und eine Alternative ohne Gesichtserkennung. Zeige die Demo nur Personen, die einverstanden sind, und richte die Kamera nicht auf Unbeteiligte.",
        },
    ]
    return {"version": 1, "usecases": usecases}


def quellen_schreiben():
    meta = json.loads((ZIEL / "fotos" / "meta.json").read_text(encoding="utf-8"))
    z = ["# Quellen und Lizenzen der Beispieldaten", "",
         "Alle Dateien in diesem Ordner sind selbst erzeugt oder stammen aus freien Quellen. Sie werden von `scripts/beispiele_bauen.py` "
         "und `scripts/beispiele_fotos.py` reproduzierbar erzeugt.", "", "## Fotos (Wikimedia Commons)", "",
         "Nur Bilder mit der Lizenz CC0 oder gemeinfrei (Public domain), geprüft am Feld `LicenseShortName` der Commons-API. "
         "Die Bilder wurden auf höchstens 960 Pixel Breite verkleinert und neu als JPEG gespeichert (EXIF-Daten entfernt). "
         "Bei CC0 und gemeinfreien Werken ist keine Namensnennung verpflichtend, sie erfolgt hier freiwillig.", ""]
    for datei in FOTO_INFO:
        m = meta.get(datei)
        if not m:
            continue
        z += ["- `fotos/%s`" % datei, "  - Titel: %s" % m["titel"], "  - Urheber: %s" % m["urheber"], "  - Lizenz: %s" % m["lizenz"],
              "  - Seite: %s" % m["url"], "  - Verwendet in: %s" % FOTO_INFO[datei]["uc"]]
    z += ["", "## Synthetische Bilder", "",
          "Die Ordner `fertigung-sichtpruefung`, `fertigung-sortieren` und `gesundheit-auffaellig` enthalten ausschließlich per Code gezeichnete Bilder "
          "(Pillow, numpy, feste Seeds in `scripts/beispiele_bilder.py`). Es gibt keine fremde Vorlage, keine Personen und keine medizinischen Daten.", "",
          "## Texte und Daten", "",
          "- `buero-dokumente/*.txt` und `daten/bestellungen.json`: vollständig erfunden. Keine echten Firmen, Personen, Produkte oder Gesetze.", "",
          "## Audio", "",
          "- `audio/besprechung.mp3`: synthetische Stimme, erzeugt mit ElevenLabs (Modell eleven_v4, Stimme George) aus dem erfundenen Text in "
          "`audio/besprechung.txt`. Prüfe vor einer Weitergabe außerhalb dieses Projekts die Nutzungsbedingungen des verwendeten ElevenLabs-Tarifs.", "",
          "## Messwerte", "",
          "`pruefung.json` hält fest, wie die Beispiele mit denselben Modelldateien wie im Labor abgeschnitten haben. Gemessen wurde auf einem "
          "Entwicklungsrechner, nicht auf dem Jetson."]
    (ZIEL / "QUELLEN.md").write_text("\n".join(z) + "\n", encoding="utf-8")


def validieren(manifest):
    fehler = []
    ids = [u["id"] for u in manifest["usecases"]]
    if len(ids) != len(set(ids)):
        fehler.append("doppelte IDs")
    text = json.dumps(manifest, ensure_ascii=False)
    for zeichen in ("–", "—"):
        if zeichen in text:
            fehler.append("Gedankenstrich %r im Manifest" % zeichen)
    if re.search("[\U0001F000-\U0001FFFF☀-➿]", text):
        fehler.append("Emoji im Manifest")

    def pfade(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ("bild", "datei", "audio", "text_datei", "bestellungen", "quelle_dokument") and isinstance(v, str) and "/" in v and not v.startswith("http"):
                    yield v
                else:
                    yield from pfade(v)
        elif isinstance(o, list):
            for v in o:
                yield from pfade(v)
        elif isinstance(o, str) and re.fullmatch(r"[\w\-]+/[\w\-/]+\.(jpg|txt|json|mp3)", o):
            yield o
    for p in set(pfade(manifest)):
        if not (ZIEL / p).exists():
            fehler.append("Datei fehlt: " + p)
    gesamt = sum(f.stat().st_size for f in ZIEL.rglob("*") if f.is_file())
    if gesamt > MAX_BYTES:
        fehler.append("Ordner zu groß: %.2f MB" % (gesamt / 1048576))
    return fehler, gesamt


SETS_MANIFEST = {}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--modelle", help="Ordner mit mobilenet_embed.onnx und yolox_tiny.onnx: Beispiele nachmessen (braucht cv2)")
    ap.add_argument("--jetson", action="store_true", help="Gegenprobe gegen das Labor unter LABOR_URL (Anlernen und RAG)")
    a = ap.parse_args()

    global SETS_MANIFEST
    ZIEL.mkdir(parents=True, exist_ok=True)
    (ZIEL / "daten").mkdir(exist_ok=True)
    SETS_MANIFEST = sets_schreiben()
    bestellungen = bestellungen_bauen()
    (ZIEL / "daten" / "bestellungen.json").write_text(
        json.dumps({"hinweis": "Frei erfundene Beispieldaten.", "bestellungen": bestellungen}, ensure_ascii=False, indent=1), encoding="utf-8")

    if a.modelle:
        pruef = nachmessen(a.modelle)
    else:
        p = ZIEL / "pruefung.json"
        if not p.exists():
            raise SystemExit("pruefung.json fehlt: einmal mit --modelle <Ordner> aufrufen")
        pruef = json.loads(p.read_text(encoding="utf-8"))

    manifest = manifest_bauen(SETS_MANIFEST, bestellungen, pruef)
    (ZIEL / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    quellen_schreiben()
    fehler, gesamt = validieren(manifest)
    print("manifest.json: %d Use-Cases, Ordner %.2f MB" % (len(manifest["usecases"]), gesamt / 1048576))
    for f in fehler:
        print("FEHLER:", f)
    if a.jetson:
        jetson_pruefen(manifest)
    return 1 if fehler else 0


if __name__ == "__main__":
    sys.exit(main())
