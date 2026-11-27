"""Regeln zum Auswerten von gelesenem Text (Labor "Text auf Papier lesen"), ohne Modell, ohne OpenCV, ohne NumPy.

Hier steht alles, was nach dem Erkennen der Zeichen passiert, damit es sich ohne Kamera und ohne Modell testen laesst
(tests/ocr_regeln_test.py):
  lesereihenfolge   Textkaesten zu Zeilen und Spalten ordnen
  zeilen_bauen      Silbentrennung am Zeilenende zusammenziehen, Absaetze erkennen
  fliesstext        Zeilen eines Absatzes zu Fliesstext verbinden
  fakten            Betraege, Prozent, Datum, Uhrzeit, E-Mail, Telefon, IBAN und Webadressen finden (nur Regeln)
  Stabilisierer     Mehrheitsentscheid je Textkasten ueber mehrere Bilder, damit der Text nicht flackert

Ein Textkasten ist ein Woerterbuch mit "x0", "y0", "x1", "y1" (Bildpunkte der Seite) und "woerter": Liste von
{"t": Text, "s": Sicherheit 0 bis 1, "a": Anfang, "b": Ende} (a und b als Anteil der Kastenbreite).
Datenschutz: Nichts wird gespeichert oder geloggt. Alle Werte leben im Arbeitsspeicher der Verbindung.
"""
import re
from collections import deque

SICHER = 0.85            # ab hier gilt ein Wort als sicher gelesen
UNSICHER = 0.60          # darunter "sehr unsicher"
# Nach diesen Woertern am Zeilenanfang folgt nach einem Bindestrich am Zeilenende KEIN Rest eines Wortes:
# "Ein- und Ausgang", "Vor- oder Nachname" duerfen nicht zu "Einund" werden.
NICHT_ZUSAMMENZIEHEN = {"und", "oder", "bzw", "bzw.", "sowie", "noch", "als", "wie", "bis", "u.", "o."}


def stufe(s):
    """Sicherheit eines Wortes als Klartext: "sicher", "unsicher" oder "sehr unsicher" (immer mit Wort, nie nur Farbe)."""
    return "sicher" if s >= SICHER else ("unsicher" if s >= UNSICHER else "sehr unsicher")


# --------------------------------------------------------------------------- Lesereihenfolge
def _mitte_y(k):
    return (k["y0"] + k["y1"]) / 2.0


def _hoehe(k):
    return max(1.0, k["y1"] - k["y0"])


def _spalten(kaesten, seitenbreite):
    """Teilt in linke und rechte Spalte, wenn in der Seitenmitte eine freie Gasse ueber fast alle Zeilen laeuft.
    Preisspalten am rechten Rand (Speisekarte) sind keine Spalte: Die Gasse muss in der Mitte liegen, auf beiden
    Seiten muss ein spuerbarer Teil des Textes stehen und kaum ein Kasten darf die Gasse queren."""
    if len(kaesten) < 6 or seitenbreite <= 0:
        return [kaesten]
    von, bis = 0.40 * seitenbreite, 0.60 * seitenbreite
    schritt = max(1.0, seitenbreite / 200.0)
    beste, beste_breite, x = None, 0.0, von
    while x < bis:
        quer = [k for k in kaesten if k["x0"] < x < k["x1"]]
        if not quer:
            y = x
            while y < bis and not [k for k in kaesten if k["x0"] < y < k["x1"]]:
                y += schritt
            if y - x > beste_breite:
                beste, beste_breite = (x + y) / 2.0, y - x
            x = y
        x += schritt
    if beste is None or beste_breite < 0.025 * seitenbreite:
        return [kaesten]
    links = [k for k in kaesten if (k["x0"] + k["x1"]) / 2.0 < beste]
    rechts = [k for k in kaesten if (k["x0"] + k["x1"]) / 2.0 >= beste]
    if min(len(links), len(rechts)) < 0.3 * len(kaesten) or min(len(links), len(rechts)) < 3:
        return [kaesten]
    for seite in (links, rechts):                      # Preisspalten und Mengen sind schmal, echte Textspalten breit
        breiten = sorted(k["x1"] - k["x0"] for k in seite)
        if breiten[len(breiten) // 2] < 0.18 * seitenbreite:
            return [kaesten]
    return [links, rechts]


def lesereihenfolge(kaesten, seitenbreite):
    """Gibt Zeilen zurueck (Liste von Listen von Kaesten, jede Zeile von links nach rechts, alle Zeilen von oben nach unten).
    Zwei Spalten werden nacheinander gelesen, erst die linke, dann die rechte."""
    zeilen = []
    for gruppe in _spalten(list(kaesten), seitenbreite):
        aktuell = []
        for k in sorted(gruppe, key=_mitte_y):
            if aktuell:
                z = aktuell[-1]
                y0 = min(c["y0"] for c in z)
                y1 = max(c["y1"] for c in z)
                ueber = min(y1, k["y1"]) - max(y0, k["y0"])
                if ueber > 0.5 * min(y1 - y0, _hoehe(k)):          # liegt auf derselben Zeile
                    z.append(k)
                    continue
            aktuell.append([k])
        zeilen.extend(sorted(z, key=lambda c: c["x0"]) for z in aktuell)
    return zeilen


# --------------------------------------------------------------------------- Zeilen bauen (Silbentrennung, Absaetze)
def _ende_mit_trennstrich(wort):
    return len(wort) >= 3 and wort.endswith("-") and wort[-2].isalpha()


def _anfang_kleinbuchstabe(wort):
    for c in wort:
        if c.isalpha():
            return c.islower()
        if c.isdigit():
            return False
    return False


def zeilen_bauen(zeilen):
    """zeilen: Ausgabe von lesereihenfolge. Gibt Zeilen als Woerterbuecher zurueck:
    {"woerter": [{"t", "s"}], "absatz": bool, "x0", "x1", "y0", "y1", "getrennt": bool}
    Eine Silbentrennung am Zeilenende ("inner-" und "halb von") wird zusammengezogen: Das ganze Wort steht in der
    ersten Zeile, die zweite verliert ihr erstes Wort. Mit dem Bindestrich vor "und" oder "oder" geschieht nichts."""
    aus = []
    for z in zeilen:
        w = []
        for k in z:
            w.extend({"t": x["t"], "s": x["s"]} for x in k["woerter"] if x["t"])
        if not w:
            continue
        aus.append({"woerter": w, "absatz": False, "getrennt": False,
                    "x0": min(k["x0"] for k in z), "x1": max(k["x1"] for k in z),
                    "y0": min(k["y0"] for k in z), "y1": max(k["y1"] for k in z)})
    # Absaetze: groesserer Abstand als eine halbe Zeilenhoehe zwischen Unterkante und der naechsten Oberkante
    hoehen = sorted(z["y1"] - z["y0"] for z in aus)
    mittel = hoehen[len(hoehen) // 2] if hoehen else 0
    for i in range(1, len(aus)):
        if aus[i]["y0"] - aus[i - 1]["y1"] > 0.6 * mittel:
            aus[i]["absatz"] = True
    # Silbentrennung
    for i in range(len(aus) - 1):
        a, b = aus[i], aus[i + 1]
        if b["absatz"] or not a["woerter"] or not b["woerter"]:
            continue
        letztes, erstes = a["woerter"][-1], b["woerter"][0]
        if not _ende_mit_trennstrich(letztes["t"]):
            continue
        if not _anfang_kleinbuchstabe(erstes["t"]) or erstes["t"].lower() in NICHT_ZUSAMMENZIEHEN:
            continue
        # Satzzeichen am Ende des Rests ("halb," bleibt "halb,") gehoeren zum Wort und bleiben bei der zusammengezogenen Zeile
        a["woerter"][-1] = {"t": letztes["t"][:-1] + erstes["t"], "s": min(letztes["s"], erstes["s"])}
        a["getrennt"] = True
        b["woerter"] = b["woerter"][1:]
    ergebnis = [z for z in aus if z["woerter"]]          # eine Zeile, die nur aus dem Rest eines Wortes bestand, entfaellt
    if ergebnis:
        ergebnis[0]["absatz"] = False
    return ergebnis


def zeilentext(z):
    return " ".join(w["t"] for w in z["woerter"])


def text_aus(zeilen):
    """Text mit Zeilenumbruechen, Leerzeile vor jedem Absatz."""
    teile = []
    for i, z in enumerate(zeilen):
        if i and z["absatz"]:
            teile.append("")
        teile.append(zeilentext(z))
    return "\n".join(teile)


def umbrueche_markieren(zeilen):
    """Setzt bei jeder Zeile "weiter": True, wenn die naechste Zeile desselben Absatzes in einem Fliesstext direkt anschliesst.
    Das gilt fuer Zeilen, die fast so breit sind wie die breiteste im Absatz (sie umbrechen nur wegen des Randes).
    Kurze Zeilen (Listenpunkte, Anschriften, Preise) bleiben eigene Zeilen."""
    i = 0
    while i < len(zeilen):
        j = i + 1
        while j < len(zeilen) and not zeilen[j]["absatz"]:
            j += 1
        gruppe = zeilen[i:j]
        breit = max(z["x1"] - z["x0"] for z in gruppe)
        for k, z in enumerate(gruppe):
            z["weiter"] = k < len(gruppe) - 1 and (z["x1"] - z["x0"]) >= 0.85 * breit
        i = j
    return zeilen


def fliesstext(zeilen):
    """Text, in dem die Zeilen mit "weiter" an die naechste anschliessen (Leerzeichen statt Zeilenumbruch)."""
    umbrueche_markieren(zeilen)
    teile = []
    for i, z in enumerate(zeilen):
        t = zeilentext(z)
        if i == 0:
            teile.append(t)
        elif z["absatz"]:
            teile.append("\n\n" + t)
        elif zeilen[i - 1]["weiter"]:
            teile.append(" " + t)
        else:
            teile.append("\n" + t)
    return "".join(teile)


# --------------------------------------------------------------------------- Fakten
_MONATE = {"januar": 1, "februar": 2, "märz": 3, "maerz": 3, "april": 4, "mai": 5, "juni": 6, "juli": 7, "august": 8,
           "september": 9, "oktober": 10, "november": 11, "dezember": 12}
_ZAHL = r"\d{1,3}(?:\.\d{3})+|\d+"
_RE = [
    ("email", re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")),
    ("iban", re.compile(r"\b[A-Z]{2}\d{2}(?:\s?[\dA-Z]{4}){3,7}(?:\s?[\dA-Z]{1,4})?\b")),
    ("web", re.compile(r"\b(?:https?://|www\.)[^\s,;]+[^\s,;.)]", re.I)),
    ("datum_monat", re.compile(r"\b(\d{1,2})\.\s?(Januar|Februar|März|Maerz|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\s(\d{4})\b", re.I)),
    ("datum", re.compile(r"(?<![\d.,])(\d{1,2})\.(\d{1,2})\.(\d{4}|\d{2})(?![\d.,]\d)")),
    ("datum_iso", re.compile(r"(?<![\d.,-])(\d{4})-(\d{2})-(\d{2})(?![\d-])")),
    ("betrag", re.compile(r"(?<![\w.,])(?:(?:€|EUR)\s?(" + _ZAHL + r")(?:,(\d{1,2}))?(?![\d.,]\d)|(" + _ZAHL + r")(?:,(\d{1,2}))?\s?(?:€|EUR\b|Euro\b))")),
    ("prozent", re.compile(r"(?<![\w.,])(\d{1,3}(?:,\d{1,2})?)\s?%")),
    ("uhrzeit", re.compile(r"(?<![\d.:,])([01]?\d|2[0-3])(?::([0-5]\d)(?:\s?Uhr)?|[.]([0-5]\d)\s?Uhr|\s?Uhr)(?![\d:])")),
    ("telefon", re.compile(r"(?<![\w@./-])(?:\+49|0049|0)[\s/()-]*\d{1,5}(?:[\s/()-]*\d{2,}){1,4}(?![\w@])")),
]
ARTEN = {"betrag": "Betrag", "prozent": "Prozent", "datum": "Datum", "uhrzeit": "Uhrzeit", "email": "E-Mail",
         "telefon": "Telefon", "iban": "IBAN", "web": "Webadresse"}


def _datum_ok(t, m, j):
    if j < 100:
        j += 2000
    return 1 <= m <= 12 and 1 <= t <= 31 and 1900 <= j <= 2100


def _telefon_ok(s):
    ziffern = re.sub(r"\D", "", s)
    return 7 <= len(ziffern) <= 15


def _iban_ok(s):
    """Prueft die IBAN mit der Modulo-97-Regel, damit Zufallstreffer (Rechnungsnummern) nicht als IBAN gelten."""
    z = re.sub(r"\s", "", s).upper()
    if not 15 <= len(z) <= 34:
        return False
    z = z[4:] + z[:4]
    try:
        return int("".join(str(int(c, 36)) for c in z)) % 97 == 1
    except ValueError:
        return False


def fakten(zeilen_texte):
    """Sucht in einer Liste von Textzeilen nach Betraegen, Prozenten, Datumsangaben, Uhrzeiten, E-Mail-Adressen,
    Telefonnummern, IBAN und Webadressen. Gibt Karten zurueck: {"art", "name", "text", "wert", "zeile"}.
    "wert" ist die genormte Form (Betrag 1234.56, Datum 2026-11-27, Uhrzeit 14:30). Nur Regeln, kein Lernen:
    Was nicht in eine Regel passt (Datum "Montag", Betrag in Worten), findet das Labor nicht."""
    karten, gesehen = [], set()
    for nr, zeile in enumerate(zeilen_texte):
        rest = zeile
        for art, muster in _RE:
            for m in muster.finditer(rest):
                roh = m.group(0).strip()
                wert = None
                if art == "datum":
                    t, mo, j = int(m.group(1)), int(m.group(2)), int(m.group(3))
                    if not _datum_ok(t, mo, j):
                        continue
                    wert = "%04d-%02d-%02d" % (j + 2000 if j < 100 else j, mo, t)
                    art_ausgabe = "datum"
                elif art == "datum_iso":
                    j, mo, t = int(m.group(1)), int(m.group(2)), int(m.group(3))
                    if not _datum_ok(t, mo, j):
                        continue
                    wert, art_ausgabe = "%04d-%02d-%02d" % (j, mo, t), "datum"
                elif art == "datum_monat":
                    t, mo, j = int(m.group(1)), _MONATE[m.group(2).lower()], int(m.group(3))
                    if not _datum_ok(t, mo, j):
                        continue
                    wert, art_ausgabe = "%04d-%02d-%02d" % (j, mo, t), "datum"
                elif art == "betrag":
                    ganz = m.group(1) or m.group(3)
                    cent = m.group(2) or m.group(4) or "00"
                    wert = ganz.replace(".", "") + "." + (cent + "0")[:2]
                    art_ausgabe = "betrag"
                elif art == "prozent":
                    wert, art_ausgabe = m.group(1).replace(",", "."), "prozent"
                elif art == "uhrzeit":
                    std = int(m.group(1))
                    mi = m.group(2) or m.group(3) or "00"
                    wert, art_ausgabe = "%02d:%s" % (std, mi), "uhrzeit"
                elif art == "telefon":
                    if not _telefon_ok(roh):
                        continue
                    wert, art_ausgabe = re.sub(r"[^\d+]", "", roh), "telefon"
                elif art == "iban":
                    if not _iban_ok(roh):
                        rest = rest[:m.start()] + " " * (m.end() - m.start()) + rest[m.end():]      # auch der Rest ist keine Telefonnummer
                        continue
                    wert, art_ausgabe = re.sub(r"\s", "", roh), "iban"
                else:
                    wert, art_ausgabe = roh, art
                schluessel = (art_ausgabe, wert)
                if schluessel not in gesehen:
                    gesehen.add(schluessel)
                    karten.append({"art": art_ausgabe, "name": ARTEN[art_ausgabe], "text": roh, "wert": wert, "zeile": nr})
                # Treffer aus der Zeile nehmen, damit "27.11.2026" nicht noch als Telefonnummer oder Betrag zaehlt
                rest = rest[:m.start()] + " " * (m.end() - m.start()) + rest[m.end():]
    return karten


# --------------------------------------------------------------------------- Stabilisieren ueber mehrere Bilder
def _iou(a, b):
    x0, y0, x1, y1 = max(a["x0"], b["x0"]), max(a["y0"], b["y0"]), min(a["x1"], b["x1"]), min(a["y1"], b["y1"])
    schnitt = max(0.0, x1 - x0) * max(0.0, y1 - y0)
    uni = (a["x1"] - a["x0"]) * (a["y1"] - a["y0"]) + (b["x1"] - b["x0"]) * (b["y1"] - b["y0"]) - schnitt
    return schnitt / uni if uni > 0 else 0.0


class Spur:
    """Ein Textkasten ueber mehrere Bilder: merkt sich die letzten Lesungen und entscheidet per Mehrheit."""

    def __init__(self, kasten, text, woerter, sicher):
        self.kasten = dict(kasten)
        self.lesungen = deque(maxlen=5)          # (Text, Woerter, Sicherheit, Kasten)
        self.treffer = 0
        self.fehl = 0
        self.serie = 0                           # aufeinanderfolgende Lesungen mit dem heutigen Siegertext
        self.lesungen.append((text, woerter, sicher, dict(kasten)))
        self.treffer = 1
        self.serie = 1
        self.sieger_text = text

    def hinzu(self, kasten, text, woerter, sicher):
        a = 0.5                                  # Kasten glaetten, damit er nicht zittert
        for k in ("x0", "y0", "x1", "y1"):
            self.kasten[k] = a * self.kasten[k] + (1 - a) * kasten[k]
        self.lesungen.append((text, woerter, sicher, dict(kasten)))
        self.treffer += 1
        self.fehl = 0
        neu = self.sieger()[0]
        self.serie = self.serie + 1 if neu == self.sieger_text else 1
        self.sieger_text = neu

    def sieger(self):
        """(Text, Woerter, mittlere Sicherheit, letzter Kasten) der Lesung, die am meisten Gewicht hat.
        Jede Lesung zaehlt mit ihrer Sicherheit, gleich lautende Lesungen addieren sich."""
        gewicht = {}
        for i, (t, w, s, k) in enumerate(self.lesungen):
            g = gewicht.setdefault(t, {"summe": 0.0, "anzahl": 0, "zuletzt": i})
            g["summe"] += s + 0.001 * i
            g["anzahl"] += 1
            g["zuletzt"] = i
        text = max(gewicht, key=lambda t: gewicht[t]["summe"])
        _, w, _, k = self.lesungen[gewicht[text]["zuletzt"]]
        mittel = sum(s for t, _, s, _ in self.lesungen if t == text) / gewicht[text]["anzahl"]
        return text, w, mittel, k

    def sichtbar(self):
        return self.treffer >= 2 or self.sieger()[2] >= 0.9


class Stabilisierer:
    """Haelt die Spuren aller Textkaesten einer Verbindung. aktualisiere() bekommt je Lesung die frischen Kaesten
    (Seitenkoordinaten, auf die Seitengroesse normiert), gibt die stabilen Kaesten und den Zustand zurueck."""
    MAX_FEHL = 3
    STABIL_SERIE = 3

    def __init__(self):
        self.spuren = []
        self.lesungen = 0
        self.stabil_seit = 0                      # Lesungen in Folge, in denen alles stabil war

    def neu(self):
        self.__init__()

    def aktualisiere(self, kaesten):
        """kaesten: Liste von {"x0","y0","x1","y1","woerter","text","s"}. Gibt (sichtbare Kaesten, stabil, neue_szene) zurueck."""
        self.lesungen += 1
        paare = sorted(((_iou(sp.kasten, k), i, j) for i, sp in enumerate(self.spuren) for j, k in enumerate(kaesten)), reverse=True)
        benutzt_s, benutzt_k, treffer = set(), set(), 0
        for iou, i, j in paare:
            if iou < 0.3:
                break
            if i in benutzt_s or j in benutzt_k:
                continue
            benutzt_s.add(i)
            benutzt_k.add(j)
            k = kaesten[j]
            self.spuren[i].hinzu(k, k["text"], k["woerter"], k["s"])
            treffer += 1
        neue_szene = False
        if self.spuren and len(kaesten) >= 3 and treffer < 0.3 * max(len(self.spuren), len(kaesten)):
            neue_szene = True                      # fast nichts passt zum Vorbild: anderes Blatt oder starke Bewegung
            self.spuren = []
            benutzt_s, benutzt_k = set(), set()
        for i, sp in enumerate(self.spuren):
            if i not in benutzt_s:
                sp.fehl += 1
        self.spuren = [sp for sp in self.spuren if sp.fehl < self.MAX_FEHL]
        for j, k in enumerate(kaesten):
            if j not in benutzt_k:
                self.spuren.append(Spur(k, k["text"], k["woerter"], k["s"]))
        sichtbar = [sp for sp in self.spuren if sp.sichtbar() and sp.fehl == 0]
        stabil = bool(sichtbar) and len(sichtbar) == len(self.spuren) and all(sp.serie >= self.STABIL_SERIE for sp in sichtbar)
        self.stabil_seit = self.stabil_seit + 1 if stabil else 0
        out = []
        for sp in sichtbar:
            text, woerter, mittel, kasten = sp.sieger()
            out.append({**{k: sp.kasten[k] for k in ("x0", "y0", "x1", "y1")}, "text": text, "woerter": woerter, "s": mittel})
        return out, stabil, neue_szene
