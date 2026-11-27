"""Erzeugt ein Testbild fuer das Labor "Text auf Papier lesen": ein Blatt mit deutschem Text (Umlaute, ss, Euro),
das schraeg auf einem dunklen Tisch liegt. Kein echtes Dokument, keine Namen: alles ist ausgedacht.

Aufruf (aus dem Repo-Wurzelordner, braucht numpy, opencv und pillow):
  python3 tests/ocr_bild.py ausgabe.jpg                 Standard: 960 x 720, leicht gedreht und perspektivisch verzerrt
  python3 tests/ocr_bild.py ausgabe.jpg --gerade        Blatt gerade, fuellt das Bild (Gegenprobe ohne Entzerren)
  python3 tests/ocr_bild.py ausgabe.jpg --video v.y4m   zusaetzlich ein 4-Sekunden-Video (15 Bilder/s) mit kleinem Wackeln
Der Sollwert steht in SOLL_ZEILEN (wird von tests/ocr.mjs und den Messungen gelesen)."""
import argparse
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SCHRIFTEN = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Georgia.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]
SCHRIFTEN_FETT = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]

# (Text, fett). Leere Zeile = Absatz. "Inner-" und "halb" zeigen die Silbentrennung am Zeilenende.
ZEILEN = [
    ("Beispielrechnung", True),
    ("Rechnungsnummer: 2026-0815", False),
    ("Datum: 27.11.2026", False),
    ("", False),
    ("Zwei Äpfel, süße Trauben und", False),
    ("Brötchen aus der Bäckerei Nord", False),
    ("Gesamtbetrag: 1.234,56 €", False),
    ("", False),
    ("Bitte überweise den Betrag inner-", False),
    ("halb von vierzehn Tagen.", False),
    ("Telefon: 0511 1234567", False),
    ("E-Mail: kontakt@example.com", False),
    ("Abholung um 14:30 Uhr, Größe 42", False),
]
# Dichter Text fuer --viel (ausgedachter Fliesstext, kleine Schrift, viele Zeilen)
VIEL = [
    "Liebe Nachbarinnen und Nachbarn,", "", "am Samstag, den 12.12.2026 treffen wir uns um",
    "10:00 Uhr im Hof zum gemeinsamen Aufräumen.", "Kaffee und Gebäck stehen bereit, die Kosten",
    "von 25,00 € teilen wir uns.",
    "Wer Handschuhe oder einen Besen hat, bringt sie bitte", "mit. Fragen beantwortet gern der Hausmeister unter",
    "0511 7654321 oder per E-Mail an hof@example.com.", "", "Wichtig: Fahrräder bitte vorher aus dem Hof schieben,",
    "damit der Platz frei ist. Danach grillen wir noch", "ein wenig, Würstchen und Gemüse bringt jeder selbst",
    "mit. Wir freuen uns auf einen schönen Tag mit euch!", "", "Viele Grüße aus dem Erdgeschoss",
]
# Was die Auswertung am Ende mindestens enthalten soll (nach Zusammenziehen der Silbentrennung).
SOLL_ZEILEN = [
    "Beispielrechnung",
    "Rechnungsnummer: 2026-0815",
    "Datum: 27.11.2026",
    "Zwei Äpfel, süße Trauben und",
    "Brötchen aus der Bäckerei Nord",
    "Gesamtbetrag: 1.234,56 €",
    "Bitte überweise den Betrag innerhalb",
    "von vierzehn Tagen.",
    "Telefon: 0511 1234567",
    "E-Mail: kontakt@example.com",
    "Abholung um 14:30 Uhr, Größe 42",
]


def schrift(liste, groesse):
    for p in liste:
        if Path(p).is_file():
            return ImageFont.truetype(p, groesse)
    raise SystemExit("Keine passende Schrift gefunden: " + ", ".join(liste))


def blatt(breite=800, hoehe=900, groesse=44, zeilen=None):
    """Weisses Blatt mit leichtem Papierrauschen und dem Text."""
    rng = np.random.default_rng(7)
    grund = np.clip(244 + rng.integers(-5, 6, (hoehe, breite, 1)), 0, 255).astype(np.uint8) * np.ones((1, 1, 3), np.uint8)
    bild = Image.fromarray(grund)
    z = ImageDraw.Draw(bild)
    normal, fett = schrift(SCHRIFTEN, groesse), schrift(SCHRIFTEN_FETT, int(groesse * 1.15))
    y = 50
    for text, ist_fett in (zeilen or ZEILEN):
        if not text:
            y += int(groesse * 0.7)
            continue
        z.text((50, y), text, font=fett if ist_fett else normal, fill=(25, 25, 30))
        y += int(groesse * 1.45)
    return np.array(bild)[:, :, ::-1].copy()            # BGR


def tisch(b, h):
    """Dunkler Holztisch aus Verlauf und Rauschen."""
    rng = np.random.default_rng(3)
    y = np.linspace(0, 1, h)[:, None, None]
    grund = (np.array([46, 62, 88], np.float32) * (0.75 + 0.35 * y) * np.ones((h, b, 3), np.float32))
    maserung = cv2.GaussianBlur(rng.normal(0, 14, (h, b, 1)).astype(np.float32), (1, 41), 0)
    return np.clip(grund + maserung[:, :, None], 0, 255).astype(np.uint8)


def szene(b=960, h=720, gerade=False, wackeln=(0.0, 0.0, 0.0), schrift=44, viel=False, drehung=0, dunkel=False, unscharf=0.0):
    """Blatt auf dem Tisch. wackeln = (dx, dy, Drehung in Grad) fuer die Videobilder."""
    quer = drehung in (90, 270)          # Text laeuft senkrecht auf dem hochkant liegenden Blatt: erst querformatig setzen, dann drehen
    sb = blatt(breite=900 if quer else 800, hoehe=800 if quer else 900, groesse=schrift if not viel else min(schrift, 26),
               zeilen=[(t, False) for t in VIEL] if viel else None)
    if drehung:
        sb = np.ascontiguousarray(np.rot90(sb, {90: -1, 180: 2, 270: 1}[drehung]))
    hb, wb = sb.shape[:2]
    quelle = np.float32([[0, 0], [wb, 0], [wb, hb], [0, hb]])
    if gerade:
        ziel = np.float32([[40, 20], [b - 40, 20], [b - 40, h - 20], [40, h - 20]])
    else:    # leicht gedreht und von schraeg oben
        ziel = np.float32([[140, 28], [820, 60], [790, 700], [170, 668]])
    dx, dy, dr = wackeln
    m = cv2.getRotationMatrix2D((b / 2, h / 2), dr, 1.0)
    ziel = cv2.transform(ziel[None], m)[0] + np.float32([dx, dy])
    h_mat = cv2.getPerspectiveTransform(quelle, ziel)
    bild = tisch(b, h)
    maske = cv2.warpPerspective(np.full((hb, wb), 255, np.uint8), h_mat, (b, h))
    warp = cv2.warpPerspective(sb, h_mat, (b, h), flags=cv2.INTER_AREA if gerade else cv2.INTER_LINEAR)
    bild[maske > 0] = warp[maske > 0]
    # etwas Kamera: leichte Unschaerfe und Bildrauschen
    bild = cv2.GaussianBlur(bild, (3, 3), 0.6 + unscharf)
    if dunkel:
        bild = (bild.astype(np.float32) * 0.35 + 8).astype(np.uint8)
    rng = np.random.default_rng(11)
    bild = np.clip(bild.astype(np.int16) + rng.normal(0, 3, bild.shape).astype(np.int16), 0, 255).astype(np.uint8)
    return bild


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ziel")
    ap.add_argument("--gerade", action="store_true")
    ap.add_argument("--video")
    ap.add_argument("--schrift", type=int, default=44)
    ap.add_argument("--viel", action="store_true")
    ap.add_argument("--drehung", type=int, default=0, choices=[0, 90, 180, 270])
    ap.add_argument("--dunkel", action="store_true")
    ap.add_argument("--unscharf", type=float, default=0.0)
    a = ap.parse_args()
    opt = dict(gerade=a.gerade, schrift=a.schrift, viel=a.viel, drehung=a.drehung, dunkel=a.dunkel, unscharf=a.unscharf)
    cv2.imwrite(a.ziel, szene(**opt), [cv2.IMWRITE_JPEG_QUALITY, 90])
    print("Testbild:", a.ziel)
    if a.video:
        ordner = Path(a.video).with_suffix(".bilder")
        ordner.mkdir(exist_ok=True)
        rng = np.random.default_rng(5)
        for i in range(60):
            w = (rng.normal(0, 1.5), rng.normal(0, 1.5), rng.normal(0, 0.25))
            cv2.imwrite(str(ordner / f"b{i:03d}.png"), szene(wackeln=w, **opt))
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-framerate", "15", "-i", str(ordner / "b%03d.png"),
                        "-pix_fmt", "yuv420p", a.video], check=True)
        for f in ordner.glob("*.png"):
            f.unlink()
        ordner.rmdir()
        print("Testvideo:", a.video)


if __name__ == "__main__":
    sys.exit(main())
