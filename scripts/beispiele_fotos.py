#!/usr/bin/env python3
"""Beschafft die freien Beispielfotos fuer das KI-Labor von Wikimedia Commons.

Aufruf:  python3 scripts/beispiele_fotos.py

Was passiert:
  1. Fuer jede Datei der Liste FOTOS wird die Commons-API nach Lizenz und Urheber gefragt.
  2. Nur wenn LicenseShortName "CC0" oder "Public domain" ist, wird das Bild geladen.
     Bei allem anderen wird die Datei uebersprungen und eine Warnung ausgegeben.
  3. Das Bild wird auf hoechstens 960 px Breite verkleinert und als JPEG gespeichert
     (dabei gehen EXIF-Daten wie GPS-Koordinaten verloren).
  4. app/static/beispiele/fotos/meta.json haelt Titel, Urheber, Lizenz und Commons-URL fest.
     Daraus erzeugen beispiele_bauen.py die Datei QUELLEN.md und die Manifest-Eintraege.

Das Ergebnis (Bilder + meta.json) ist eingecheckt. Das Skript muss nur laufen, wenn die
Auswahl geaendert wird. Abhaengigkeiten: Pillow, Python 3 (Standardbibliothek fuer HTTP).
"""
import io
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

ZIEL = Path(__file__).resolve().parent.parent / "app" / "static" / "beispiele" / "fotos"
API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "jetson-ai-showcase-beispiele/1.0 (Lernprojekt, Bildbeschaffung)"}
MAX_BREITE = 960
ERLAUBT = ("cc0", "public domain", "pd")

# datei -> Titel der Commons-Seite. Die Zuordnung zu Use-Cases steht in beispiele_bauen.py.
FOTOS = {
    "logistik-lieferwagen-fahrrad.jpg": "File:Yamato delivery electrick truck, Hino (72411).jpg",
    "logistik-hafenhof-container.jpg": "File:Gfp-loading-dock.jpg",
    "logistik-sattelzug-ladung.jpg": "File:Kenworth truck of the US Air Force.JPEG",
    "logistik-kleintransporter-strasse.jpg": "File:US-type small delivery truck in Tokyo.jpeg",
    "handel-getraenkeregal.jpg": "File:Soft drink shelf.JPG",
    "handel-tassen-tisch.jpg": "File:Enamel cups on a table (Unsplash).jpg",
    "handel-regal-luecken.jpg": "File:Covid - P1630413.jpg",
    "baustelle-metro-pause.jpg": "File:A break for the construction workers at the Rokin at the building site of the "
                                 "future metro station underground; free photo of Amsterdam streets by Fons Heijnsbroek, 2007.jpg",
    "baustelle-halle-montage.jpg": "File:Mockup - Shuttle Mid-Body - JSC (s76-21336).jpg",
    "baustelle-neubau-ferne.jpg": "File:Moscow, new construction on the site of Olimpiysky hall September 2024 04.jpg",
}


def holen(url, versuche=5):
    for i in range(versuche):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
        except Exception as e:                       # 429 (Rate-Limit) u. a.: kurz warten, neu versuchen
            print("  Wiederholung %d: %s" % (i + 1, e), file=sys.stderr)
            time.sleep(4 + 4 * i)
    raise SystemExit("Abbruch: %s nicht ladbar" % url)


def text_ohne_html(s):
    import re
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s or "")).strip()


def main():
    ZIEL.mkdir(parents=True, exist_ok=True)
    meta = {}
    for datei, titel in FOTOS.items():
        q = urllib.parse.urlencode({
            "action": "query", "format": "json", "titles": titel, "prop": "imageinfo",
            "iiprop": "url|extmetadata", "iiurlwidth": MAX_BREITE})
        seite = next(iter(json.loads(holen(API + "?" + q))["query"]["pages"].values()))
        ii = seite["imageinfo"][0]
        m = ii["extmetadata"]
        lizenz = m.get("LicenseShortName", {}).get("value", "")
        if lizenz.strip().lower() not in ERLAUBT:
            print("UEBERSPRUNGEN (Lizenz %r): %s" % (lizenz, titel), file=sys.stderr)
            continue
        roh = holen(ii.get("thumburl") or ii["url"])
        bild = Image.open(io.BytesIO(roh)).convert("RGB")
        if bild.width > MAX_BREITE:
            bild = bild.resize((MAX_BREITE, round(bild.height * MAX_BREITE / bild.width)), Image.LANCZOS)
        bild.save(ZIEL / datei, "JPEG", quality=78, optimize=True)
        meta[datei] = {
            "titel": titel.replace("File:", "", 1),
            "urheber": text_ohne_html(m.get("Artist", {}).get("value", "")) or "unbekannt",
            "lizenz": lizenz,
            "url": ii["descriptionurl"],
        }
        print("ok %-40s %s, %s" % (datei, lizenz, meta[datei]["urheber"][:40]))
        time.sleep(1.5)
    (ZIEL / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    print("%d Fotos, meta.json geschrieben" % len(meta))


if __name__ == "__main__":
    main()
