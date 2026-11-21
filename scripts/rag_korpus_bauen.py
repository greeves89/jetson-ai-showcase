#!/usr/bin/env python3
"""Erzeugt app/static/daten/rag-korpus.json fuer die RAG-Werkstatt (Bausteine rag-*).

Holt die Embeddings vom Jetson (POST /api/embed), rechnet die 2D-Karte per Hauptkomponentenanalyse (PCA, nur numpy),
misst, welche Frage bei welcher Methode (Stichwort, Vektor, Hybrid) gewinnt, und speichert die Ergebnisse.
Das Skript ist wiederholbar: gleiche Texte und gleiches Modell ergeben dieselbe Datei.

Aufruf (die Adresse des Labors kommt aus der Umgebung, sie steht in keiner Datei):
    export LABOR_URL=https://<jetson>:8443
    python3 scripts/rag_korpus_bauen.py              # schreibt app/static/daten/rag-korpus.json
    python3 scripts/rag_korpus_bauen.py --bericht    # nur messen und ausgeben, nichts schreiben
    python3 scripts/rag_korpus_bauen.py --ohne-rerank   # Rangvorab-Werte des Bewerters nicht neu holen

Alle Texte sind erfunden und neutral. Die Rechenwege (Zerlegen in Woerter, BM25, Rangfusion) muessen mit
app/static/widgets-rag.js uebereinstimmen; der Browsertest prueft das gegen die hier gespeicherten Raenge.
"""
import argparse
import json
import math
import os
import re
import ssl
import sys
import time
import urllib.request
from pathlib import Path

import numpy as np

WURZEL = Path(__file__).resolve().parent.parent
ZIEL = WURZEL / "app" / "static" / "daten" / "rag-korpus.json"

# ------------------------------------------------------------------ Daten
GRUPPEN = {
    "essen": "Essen",
    "verkehr": "Auto und Verkehr",
    "buero": "Büro",
    "wetter": "Wetter",
    "gesundheit": "Gesundheit",
}
SAETZE = [
    ("essen", "Zum Frühstück gibt es Brötchen mit Marmelade."),
    ("essen", "Die Suppe braucht noch etwas Salz."),
    ("essen", "Wir backen am Sonntag einen Apfelkuchen."),
    ("essen", "Der Kaffee ist heute besonders stark."),
    ("essen", "Ich koche gern Nudeln mit Tomatensauce."),
    ("verkehr", "Das Auto steht auf dem Parkplatz vor dem Haus."),
    ("verkehr", "An der Kreuzung ist die Ampel ausgefallen."),
    ("verkehr", "Der Bus fährt alle zehn Minuten."),
    ("verkehr", "Ich muss noch tanken, bevor ich losfahre."),
    ("verkehr", "Auf der Autobahn gibt es einen Stau."),
    ("buero", "Die Besprechung beginnt um zehn Uhr im großen Raum."),
    ("buero", "Bitte schicke mir die Rechnung per Mail."),
    ("buero", "Der Drucker braucht neues Papier."),
    ("buero", "Der Urlaubsantrag liegt bei der Teamleitung."),
    ("buero", "Das Protokoll wird bis morgen verteilt."),
    ("wetter", "Morgen soll es den ganzen Tag regnen."),
    ("wetter", "Am Wochenende wird es sonnig und warm."),
    ("wetter", "Nachts sinkt die Temperatur unter null Grad."),
    ("wetter", "Ein Gewitter zieht von Westen auf."),
    ("wetter", "Der Wind weht heute kräftig."),
    ("gesundheit", "Er hat seit Montag Fieber und Husten."),
    ("gesundheit", "Ich war zur Untersuchung beim Arzt."),
    ("gesundheit", "Die Tabletten nimmst du morgens nach dem Essen."),
    ("gesundheit", "Nach der Operation braucht sie Ruhe."),
    ("gesundheit", "Wir haben einen Termin zur Impfung."),
]

# Absaetze des Beispielkorpus (Bausteine Suche, Rerank, Test). Gruppe dient dem Filter.
ABSAETZE = [
    ("Technik", "Fehlercode E-4711 bedeutet: Der Filter ist verstopft. Filter reinigen und Gerät neu starten."),
    ("Technik", "Fehlercode E-4712 bedeutet: Der Wassertank ist leer. Tank füllen und Taste Start drücken."),
    ("Technik", "Fehlercode E-4720 bedeutet: Die Heizung ist zu heiß. Gerät ausschalten und zehn Minuten abkühlen lassen."),
    ("Betrieb", "Fahrzeuge dürfen nur auf den gekennzeichneten Flächen des Betriebsgeländes geparkt werden."),
    ("Betrieb", "Besucher melden sich am Empfang an und erhalten einen Ausweis, den sie gut sichtbar tragen."),
    ("Technik", "Die Wartung der Pumpe 3 erfolgt alle sechs Monate. Dabei wird der Dichtungsring ersetzt."),
    ("Technik", "Der Dichtungsring wird vor dem Einbau dünn mit Silikonfett eingerieben."),
    ("Personal", "Urlaub beantragen Mitarbeitende mindestens zwei Wochen vorher bei der Führungskraft."),
    ("Betrieb", "Die Kantine bietet täglich ein vegetarisches Gericht und einen Salat an."),
    ("Technik", "Zum Abschalten der Anlage zuerst den Hauptschalter auf Null stellen und die Druckleitung entlasten."),
    ("Personal", "Wer krank ist, meldet sich bis neun Uhr bei der Führungskraft und reicht ab dem dritten Tag eine Bescheinigung ein."),
    ("Verwaltung", "Für neue Geräte gilt eine Garantie von 24 Monaten ab Kaufdatum. Verschleißteile wie Dichtungen sind ausgenommen."),
    ("Verwaltung", "Lieferungen an Samstagen sind möglich und kosten einen Aufschlag."),
    ("Verwaltung", "Rechnungen werden innerhalb von 14 Tagen nach Eingang bezahlt."),
    ("Technik", "Bei Wasseraustritt zuerst den Strom trennen und die Betriebsleitung rufen. Erst nach deren Freigabe läuft die Anlage wieder an."),
    ("Verwaltung", "Ein Wasserschaden am Gerät wird nicht kostenlos repariert."),
    ("Technik", "Die Pumpe 3 steht im Keller neben dem Heizraum und fördert Kühlwasser zur Anlage."),
    ("Technik", "Der Betriebsdruck der Pumpe 3 liegt bei vier bar. Höhere Werte zeigen eine verstopfte Leitung an."),
    ("Technik", "Die Steuerung Zephyr-2 wird ausschließlich von der Instandhaltung eingestellt."),
    ("Betrieb", "Die Betriebsleitung erreichst du werktags von sieben bis sechzehn Uhr im Büro neben dem Empfang."),
    ("Technik", "Die Steuerung Zephyr-3 im Lager darf jede Schichtleitung einstellen."),
    ("Verwaltung", "Reklamationen müssen innerhalb von 8 Tagen nach Lieferung gemeldet werden."),
    ("Verwaltung", "Skonto von zwei Prozent gibt es bei Zahlung innerhalb von 10 Tagen."),
]

# Fragen: ziel = Indizes der Absaetze, in denen die Antwort steht (leer = Antwort steht nicht im Korpus).
# lehre: kurzer Hinweis fuer die Erklaerung, was die Frage zeigen soll. Die Wirkung wird gemessen, nicht angenommen.
FRAGEN = [
    {"id": "auto", "frage": "Wo darf ich mit dem Wagen parken?", "ziel": [3]},
    {"id": "code", "frage": "Was bedeutet E-4711?", "ziel": [0]},
    {"id": "gewaehr", "frage": "Wie lange gilt die Gewährleistung?", "ziel": [11]},
    {"id": "urlaup", "frage": "Ich möchte Urlaup nehmen", "ziel": [7]},
    {"id": "lieferung", "frage": "Was kostet die Lieferung am Samstag?", "ziel": [12]},
    {"id": "frist", "frage": "Gilt die Frist von 14 Tagen für Rechnungen?", "ziel": [13]},
    {"id": "pumpe", "frage": "Wo steht Pumpe 3?", "ziel": [16]},
    {"id": "wasser", "frage": "Was gilt bei Wasserschäden an Pumpe 3?", "ziel": [14]},
    {"id": "einbau", "frage": "Wie wird der Dichtungsring von Pumpe 3 gewechselt und eingebaut?", "ziel": [5, 6]},
    {"id": "zephyr", "frage": "Wer darf die Zephyr-2 einstellen?", "ziel": [18]},
    {"id": "heizung", "frage": "Wie lange muss ich nach einem Heizungsfehler warten?", "ziel": [2], "nur_rerank": True},
    {"id": "gehalt", "frage": "Wie hoch ist das Gehalt der Geschäftsführung?", "ziel": []},
    {"id": "datenschutz", "frage": "Wer ist der Datenschutzbeauftragte?", "ziel": []},
]

HANDBUCH = """# Kaffeevollautomat Modell K

# Inbetriebnahme

Stelle das Gerät auf eine ebene, trockene Fläche. Halte rund um das Gerät mindestens zehn Zentimeter Platz frei.

Fülle den Wassertank mit frischem, kaltem Wasser. Gib niemals Milch oder Kaffee in den Wassertank.

Gib Bohnen in den Bohnenbehälter. Verwende keine karamellisierten oder gewürzten Bohnen, sie verkleben das Mahlwerk.

Stecke den Netzstecker ein und drücke die Taste Ein. Beim ersten Start spült sich das Gerät selbst und braucht dafür etwa eine Minute.

# Reinigung

Reinige das Gerät einmal pro Woche. Zuerst die Brühgruppe entnehmen und unter fließendem Wasser abspülen.

Danach den Tresterbehälter leeren und das Tropfblech reinigen. Trockne alle Teile, bevor du sie wieder einsetzt.

Die Milchdüse spülst du nach jedem Gebrauch mit klarem Wasser. Einmal im Monat reinigst du sie mit einem Reinigungstab.

Die Außenflächen wischst du nur mit einem feuchten, weichen Tuch ab. Scharfe Reiniger zerkratzen das Gehäuse.

# Entkalken

Das Gerät sollte alle drei Monate entkalkt werden, bei hartem Wasser früher.

Verwende nur flüssigen Entkalker, der für Kaffeevollautomaten gedacht ist. Haushaltsessig greift die Dichtungen an.

Leere zuerst den Wassertank und die Tropfschale. Fülle den Entkalker mit Wasser bis zur Markierung in den Tank und starte das Programm Entkalken. Es dauert etwa 25 Minuten und darf nicht unterbrochen werden.

Spüle den Tank danach gründlich aus und fülle ihn mit frischem Wasser. Starte das Programm Spülen, bis der Tank leer ist.

# Fehlermeldungen

Bei einer Störung zeigt das Display einen Code. Die wichtigsten Codes stehen in dieser Tabelle.

Code | Bedeutung | Maßnahme
F-01 | Wassertank leer | Tank füllen
F-02 | Tresterbehälter voll | Behälter leeren
F-07 | Brühgruppe klemmt | Brühgruppe entnehmen und reinigen
F-09 | Bohnenbehälter leer | Bohnen nachfüllen
F-12 | Entkalken nötig | Programm Entkalken starten

Tritt ein Code nach der Maßnahme erneut auf, trenne das Gerät vom Netz und wende dich an den Kundendienst.
"""

HANDBUCH_FRAGEN = [
    {"frage": "Welche Schritte gehören zur Reinigung?",
     "antwort": "Zuerst die Brühgruppe entnehmen und unter fließendem Wasser abspülen. Danach den Tresterbehälter leeren und das Tropfblech reinigen."},
    {"frage": "Wie oft muss entkalkt werden?",
     "antwort": "Das Gerät sollte alle drei Monate entkalkt werden, bei hartem Wasser früher."},
    {"frage": "Was ist bei F-07 zu tun?",
     "antwort": "F-07 | Brühgruppe klemmt | Brühgruppe entnehmen und reinigen"},
]


# ------------------------------------------------------------------ Rechenwege (Spiegel von widgets-rag.js)
STOPP = set("""der die das den dem des ein eine einen einem einer eines und oder aber auch nicht
ist sind war wird werden wurde wurden hat haben bin bist
ich du er sie es wir ihr mein dein sein unser mir dir mich dich
von zu mit bei nach aus auf an in im am um für vor über unter durch
wie was wer wo wann wann welche welcher welches wenn dass als so
darf dürfen kann können muss müssen soll sollen gilt gelten""".split())
WORT = re.compile(r"[a-zäöüß0-9]+(?:-[a-zäöüß0-9]+)*")
K1, B, RRF_K = 1.5, 0.75, 60


def woerter(text):
    return [w for w in WORT.findall(text.lower()) if w not in STOPP]


def bm25(frage, texte):
    """Gibt die Wertung je Text zurueck (0, wenn kein Frageword vorkommt)."""
    docs = [woerter(t) for t in texte]
    n = len(docs)
    mittel = sum(len(d) for d in docs) / n
    q = list(dict.fromkeys(woerter(frage)))
    out = []
    for d in docs:
        s = 0.0
        for w in q:
            tf = d.count(w)
            if tf == 0:
                continue
            df = sum(1 for x in docs if w in x)
            idf = math.log(1 + (n - df + 0.5) / (df + 0.5))
            s += idf * tf * (K1 + 1) / (tf + K1 * (1 - B + B * len(d) / mittel))
        out.append(s)
    return out


def raenge(werte, nur_positiv=False):
    """Rang je Eintrag (1 = bester). Bei Gleichstand gewinnt der kleinere Index. Eintraege ohne Wertung: None."""
    ordnung = sorted(range(len(werte)), key=lambda i: (-werte[i], i))
    r = [None] * len(werte)
    k = 0
    for i in ordnung:
        if nur_positiv and werte[i] <= 0:
            continue
        k += 1
        r[i] = k
    return r


def hybrid(rs, rv, w=0.5):
    """Gewichtete Rangfusion (RRF). w = Gewicht des Vektors; 0,5 heisst gleich viel."""
    out = []
    for a, b in zip(rs, rv):
        out.append(2 * (1 - w) * (1 / (RRF_K + a) if a else 0) + 2 * w * (1 / (RRF_K + b) if b else 0))
    return out


# ------------------------------------------------------------------ Jetson
def _ctx():
    c = ssl.create_default_context()
    c.check_hostname = False
    c.verify_mode = ssl.CERT_NONE
    return c


def post(basis, pfad, obj, versuche=4, timeout=300):
    daten = json.dumps(obj).encode()
    for v in range(versuche):
        req = urllib.request.Request(basis + pfad, data=daten, headers={"Content-Type": "application/json", "Origin": basis})
        try:
            with urllib.request.urlopen(req, context=_ctx(), timeout=timeout) as r:
                return json.load(r)
        except Exception as e:  # kurze Abbrueche (Neustart durch andere) wiederholen
            if v == versuche - 1:
                raise
            print("  Wiederholung wegen:", repr(e)[:100], file=sys.stderr)
            time.sleep(4)


def einbetten(basis, texte, art=None):
    out = []
    for i in range(0, len(texte), 32):
        d = post(basis, "/api/embed", {"texte": texte[i:i + 32], **({"art": art} if art else {})})
        out.extend(d["vektoren"])
    return np.array(out, dtype=np.float64)


# ------------------------------------------------------------------ Messung
def messen(absatz_v, frage_v, absaetze, fragen):
    """Rang der besten Fundstelle je Methode und die Spitzenwerte."""
    erg = []
    for f, qv in zip(fragen, frage_v):
        texte = [a for _, a in absaetze]
        wb = bm25(f["frage"], texte)
        wv = [float(np.dot(qv, v)) for v in absatz_v]
        rs, rv = raenge(wb, True), raenge(wv)
        wh = hybrid(rs, rv)
        rh = raenge(wh)
        def best(r):
            x = [r[i] for i in f["ziel"] if r[i]]
            return min(x) if x else None
        erg.append({"id": f["id"], "stichwort": best(rs), "vektor": best(rv), "hybrid": best(rh),
                    "bm25_max": round(max(wb), 3), "cos_max": round(max(wv), 3),
                    "rs": rs, "rv": rv, "rh": rh, "wv": wv, "wb": wb, "wh": wh})
    return erg


def bericht(erg, fragen):
    print(f"{'Frage':<12}{'Stichwort':>10}{'Vektor':>8}{'Hybrid':>8}   bm25max cosmax")
    for e, f in zip(erg, fragen):
        if f["ziel"]:
            print(f"{e['id']:<12}{str(e['stichwort']):>10}{str(e['vektor']):>8}{str(e['hybrid']):>8}   {e['bm25_max']:>6} {e['cos_max']:>6}")
        else:
            print(f"{e['id']:<12}{'(ohne Antwort)':>26}   {e['bm25_max']:>6} {e['cos_max']:>6}")


def pca(m, k=2):
    mittel = m.mean(axis=0)
    u, s, vt = np.linalg.svd(m - mittel, full_matrices=False)
    achsen = vt[:k]
    # Vorzeichen festlegen, damit die Datei bei jedem Lauf gleich aussieht
    for i in range(k):
        j = int(np.argmax(np.abs(achsen[i])))
        if achsen[i][j] < 0:
            achsen[i] = -achsen[i]
    return mittel, achsen, (s ** 2 / np.sum(s ** 2))[:k]


def runden(a, n=5):
    return [round(float(x), n) for x in a]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--bericht", action="store_true")
    ap.add_argument("--ohne-rerank", action="store_true")
    ap.add_argument("--art", choices=["keine", "vorsilbe"], default="keine",
                    help="vorsilbe: Fragen und Absaetze mit den Aufgabenkennungen des Modells einbetten")
    a = ap.parse_args()
    basis = os.environ.get("LABOR_URL", "").rstrip("/")
    if not basis:
        sys.exit("LABOR_URL fehlt (Adresse des Labors).")

    absaetze = ABSAETZE
    texte_a = [t for _, t in absaetze]
    art_d, art_f = ("dokument", "frage") if a.art == "vorsilbe" else (None, None)
    print("Embeddings holen ...")
    va = einbetten(basis, texte_a, art_d)
    vf = einbetten(basis, [f["frage"] for f in FRAGEN], art_f)
    erg = messen(va, vf, absaetze, FRAGEN)
    bericht(erg, FRAGEN)
    if a.bericht:
        return

    vs = einbetten(basis, [t for _, t in SAETZE], None)
    mittel, achsen, anteil = pca(vs)
    xy = (vs - mittel) @ achsen.T
    saetze = []
    for (g, t), v, p in zip(SAETZE, vs, xy):
        saetze.append({"text": t, "gruppe": g, "x": round(float(p[0]), 4), "y": round(float(p[1]), 4), "vektor": runden(v)})

    fragen = []
    for f, e, v in zip(FRAGEN, erg, vf):
        fragen.append({"id": f["id"], "frage": f["frage"], "ziel": f["ziel"], "vektor": runden(v),
                       **({"nur_rerank": True} if f.get("nur_rerank") else {}),
                       "erwartet": {"stichwort": e["stichwort"], "vektor": e["vektor"], "hybrid": e["hybrid"],
                                    "rs": e["rs"], "rv": e["rv"], "rh": e["rh"]}})

    rerank = {}
    if not a.ohne_rerank:
        print("Bewerter laufen lassen (alle Absaetze je Frage, dauert einige Minuten) ...")
        for f in FRAGEN:
            if not f["ziel"]:
                continue
            scores, ms = {}, {}
            for i in range(0, len(texte_a), 12):
                teil = list(range(i, min(i + 12, len(texte_a))))
                d = post(basis, "/api/rerank", {"frage": f["frage"], "kandidaten": [texte_a[j] for j in teil]})
                for j, x in zip(teil, d["ergebnisse"]):
                    scores[str(j)], ms[str(j)] = x["score"], x["ms"]
            rerank[f["id"]] = {"scores": scores, "ms": ms, "modell": d["modell"]}
            print("  ", f["id"], "Ziel", f["ziel"], "Werte", [scores[str(j)] for j in f["ziel"]], "Ausreisser oben", sorted(scores.values())[-3:], flush=True)
    elif ZIEL.exists():
        rerank = json.loads(ZIEL.read_text(encoding="utf-8")).get("rerank_vorab", {})

    daten = {
        "modell": "nomic-embed-text", "dimension": int(vs.shape[1]), "vorsilbe": a.art == "vorsilbe",
        "gruppen": [{"id": k, "name": v} for k, v in GRUPPEN.items()],
        "saetze": saetze,
        "karte": {"mittelwert": runden(mittel), "achsen": [runden(x) for x in achsen],
                  "anteil": runden(anteil, 3)},
        "absaetze": [{"gruppe": g, "text": t, "vektor": runden(v)} for (g, t), v in zip(absaetze, va)],
        "fragen": fragen,
        "handbuch": {"text": HANDBUCH, "fragen": HANDBUCH_FRAGEN},
        "rerank_vorab": rerank,
        "konstanten": {"k1": K1, "b": B, "rrf_k": RRF_K},
    }
    ZIEL.parent.mkdir(parents=True, exist_ok=True)
    ZIEL.write_text(json.dumps(daten, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print("geschrieben:", ZIEL, f"{ZIEL.stat().st_size // 1024} KB; Anteil der Achsen {runden(anteil, 3)}")


if __name__ == "__main__":
    main()
