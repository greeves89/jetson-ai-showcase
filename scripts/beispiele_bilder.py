"""Zeichnet die synthetischen Beispielbilder (Metallscheiben, Bauteile, Zellen).

Alles per Code mit Pillow und numpy, jeder Aufruf ist von einem Seed abhaengig und liefert
bei gleichem Seed dasselbe Bild. Die Bilder sind 320 x 240 Pixel gross.
Wird von beispiele_bauen.py benutzt und hat keine eigene Kommandozeile.
"""
import math

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

B, H = 320, 240


# ------------------------------------------------------------------ Hilfen
def _hintergrund(rng, ton=None):
    """Strukturierter Untergrund: leichter Verlauf, weiche Flecken, feines Korn, schwache Rillen."""
    if ton is None:
        ton = rng.uniform(95, 125)
    ys, xs = np.mgrid[0:H, 0:B].astype(np.float32)
    w = rng.uniform(0, math.tau)
    verlauf = 1 + 0.18 * (math.cos(w) * (xs / B - 0.5) + math.sin(w) * (ys / H - 0.5))
    flecken = np.asarray(Image.fromarray(rng.integers(0, 255, (12, 16)).astype(np.uint8))
                         .resize((B, H), Image.BICUBIC), np.float32) / 255 - 0.5
    korn = rng.normal(0, 1, (H, B)).astype(np.float32)
    rillen = np.sin(ys * rng.uniform(0.5, 1.2) + rng.uniform(0, 6)) * 0.015
    v = ton * verlauf * (1 + 0.22 * flecken + rillen) + 4.5 * korn
    farbe = np.array([0.98, 1.0, 1.04]) * rng.uniform(0.95, 1.05)
    return np.clip(v[..., None] * farbe, 0, 255)


def _aa_maske(f, rand=1.2):
    """Weicher Rand (Anti-Aliasing) fuer eine Distanzfunktion f (<0 innen, >0 aussen)."""
    return np.clip(0.5 - f / rand, 0, 1)


def _zu_bild(arr, rng, unschaerfe=0.5):
    bild = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    if unschaerfe:
        bild = bild.filter(ImageFilter.GaussianBlur(unschaerfe))
    arr = np.asarray(bild, np.float32) + rng.normal(0, 1.4, (H, B, 3))
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))


# ------------------------------------------------------------------ Metallscheiben
def scheibe(seed, fehler=None):
    """Runde Metallscheibe. fehler: None (gut), 'kratzer', 'delle' oder 'kantenbruch'."""
    rng = np.random.default_rng(seed)
    bg = _hintergrund(rng)
    ys, xs = np.mgrid[0:H, 0:B].astype(np.float32)
    R = rng.uniform(84, 100)
    cx = rng.uniform(R + 6, B - R - 6)
    cy = rng.uniform(R + 6, H - R - 6)
    dx, dy = xs - cx, ys - cy
    r = np.hypot(dx, dy)
    wink = np.arctan2(dy, dx)

    licht = rng.uniform(0, math.tau)                       # Lichtrichtung
    hell = rng.uniform(0.85, 1.15)
    rn = r / R
    v = 168 * hell * (0.72 + 0.28 * (1 - rn ** 2))          # radiale Schattierung
    v += 26 * np.cos(wink - licht) * rn                     # seitliche Beleuchtung
    v += 9 * np.sin(r * rng.uniform(0.9, 1.4) + rng.uniform(0, 6) + 3 * np.sin(wink * 3))   # gebuerstete Ringe
    rand_hell = np.exp(-((rn - 0.955) / 0.03) ** 2)         # heller Kantenring
    rand_dunkel = np.exp(-((rn - 0.99) / 0.015) ** 2)
    v += 55 * rand_hell - 70 * rand_dunkel
    nabe = np.exp(-((rn - 0.30) / 0.02) ** 2)               # Rille um das Mittelloch
    v -= 35 * nabe
    farbe = np.array([0.97, 1.0, 1.05])[None, None, :]
    scheibe_rgb = v[..., None] * farbe
    maske = _aa_maske(r - R)
    loch = _aa_maske(r - 0.17 * R)                          # Mittelloch zeigt den Untergrund
    maske = maske * (1 - loch)

    # Schatten der Scheibe auf dem Untergrund
    schatten = _aa_maske(np.hypot(dx - 7, dy - 9) - R * 1.01, 6)
    bg = bg * (1 - 0.28 * schatten[..., None])

    if fehler == "kratzer":
        lage = Image.new("L", (B, H), 0)
        d = ImageDraw.Draw(lage)
        n = int(rng.integers(3, 6))
        wk = rng.uniform(0, math.pi)
        for _ in range(n):
            a = wk + rng.normal(0, 0.35)
            mx = cx + rng.uniform(-0.55, 0.55) * R
            my = cy + rng.uniform(-0.55, 0.55) * R
            ln = rng.uniform(0.7, 1.3) * R
            p0 = (mx - math.cos(a) * ln, my - math.sin(a) * ln)
            p1 = (mx + math.cos(a) * ln, my + math.sin(a) * ln)
            d.line([p0, p1], fill=255, width=int(rng.integers(2, 4)))
        lage = np.asarray(lage.filter(ImageFilter.GaussianBlur(0.6)), np.float32) / 255
        helle = rng.random() > 0.4                              # helle Riefe oder dunkle Furche
        if helle:
            scheibe_rgb = scheibe_rgb * (1 - lage[..., None]) + 245 * lage[..., None]
        else:
            scheibe_rgb = scheibe_rgb * (1 - 0.85 * lage[..., None])
        versatz = np.roll(lage, 2, axis=0)                      # Begleitlinie, damit der Kratzer glaenzt
        scheibe_rgb = scheibe_rgb + (110 if not helle else -70) * versatz[..., None] * (1 - lage[..., None])
    elif fehler == "delle":
        a = rng.uniform(1.2, 1.8) * math.pi              # Delle im oberen Bereich
        dist = rng.uniform(0.4, 0.62) * R
        fx, fy = cx + math.cos(a) * dist, cy + math.sin(a) * dist
        s = rng.uniform(0.3, 0.4) * R
        dd = np.hypot(xs - fx, ys - fy)
        mulde = np.exp(-(dd / s) ** 4)                       # flache Mulde mit steilem Rand
        seite = ((xs - fx) * math.cos(licht) + (ys - fy) * math.sin(licht)) / s
        rand = np.exp(-((dd - s * 1.15) / 3.5) ** 2)                # heller Rand der Mulde
        scheibe_rgb = (scheibe_rgb - (150 * mulde)[..., None] + (70 * mulde * np.clip(seite, -1, 1))[..., None]
                       + (70 * rand)[..., None])
    elif fehler == "kantenbruch":
        a = rng.uniform(0.1, 0.9) * math.pi              # Ausbruch an der unteren Kante
        px, py = cx + math.cos(a) * R * 0.98, cy + math.sin(a) * R * 0.98
        rr = rng.uniform(0.5, 0.65) * R
        ang = np.arctan2(ys - py, xs - px)
        zack = 1 + 0.18 * np.sin(ang * 5 + rng.uniform(0, 6)) + 0.1 * np.sin(ang * 11 + rng.uniform(0, 6))
        abstand = np.hypot(xs - px, ys - py) / zack
        biss = _aa_maske(abstand - rr)                           # 1 innerhalb des Ausbruchs
        kante = np.exp(-((abstand - rr) / 3.0) ** 2) * (r < R)   # heller Bruchrand
        maske = maske * (1 - biss)
        scheibe_rgb = scheibe_rgb + (70 * kante)[..., None]

    bild = bg * (1 - maske[..., None]) + scheibe_rgb * maske[..., None]
    return _zu_bild(bild, rng, 0.55)


# ------------------------------------------------------------------ Bauteile (Schraube, Mutter, Scheibe)
def _stahl(rng):
    return np.array([rng.uniform(150, 200)] * 3) * np.array([0.97, 1.0, 1.05])


def _shade(poly_mask, rng, grundton, richtung, kontrast=40):
    """Metallischer Verlauf quer zur Richtung eines Teils."""
    ys, xs = np.mgrid[0:H, 0:B].astype(np.float32)
    q = xs * -math.sin(richtung) + ys * math.cos(richtung)       # Position quer zur Achse
    return grundton + kontrast * np.sin(q * 0.12 + rng.uniform(0, 6))


def bauteil(seed, typ):
    """typ: 'schraube', 'mutter' oder 'scheibe'. Beliebige Lage, Drehung, Groesse."""
    rng = np.random.default_rng(seed)
    bg = _hintergrund(rng)
    S = 3                                                       # Uebersampling fuer glatte Kanten
    cx = rng.uniform(95, B - 95)
    cy = rng.uniform(85, H - 85)
    rot = rng.uniform(0, math.tau)
    sk = rng.uniform(0.9, 1.15)
    ton = rng.uniform(165, 215)
    maske_im = Image.new("L", (B * S, H * S), 0)
    d = ImageDraw.Draw(maske_im)
    loch_im = Image.new("L", (B * S, H * S), 0)
    dl = ImageDraw.Draw(loch_im)

    def drehen(pts):
        c, s = math.cos(rot), math.sin(rot)
        return [((cx + (x * c - y * s) * sk) * S, (cy + (x * s + y * c) * sk) * S) for x, y in pts]

    gewinde = Image.new("L", (B * S, H * S), 0)
    dg = ImageDraw.Draw(gewinde)
    if typ == "schraube":
        L = 150
        schaft = [(-L / 2 + 34, -11), (L / 2, -11), (L / 2, 11), (-L / 2 + 34, 11)]
        kopf = [(-L / 2, -26), (-L / 2 + 34, -26), (-L / 2 + 34, 26), (-L / 2, 26)]
        d.polygon(drehen(schaft), fill=255)
        d.polygon(drehen(kopf), fill=255)
        for i in range(0, int(L - 40), 9):                      # Gewinderillen
            x0 = -L / 2 + 38 + i
            dg.line(drehen([(x0, -11), (x0 + 5, 11)]), fill=255, width=3)
        dl.line(drehen([(-L / 2 + 4, 0), (-L / 2 + 30, 0)]), fill=255, width=5)   # Schlitz im Kopf
    elif typ == "mutter":
        Rm = 62
        pts = [(Rm * math.cos(math.pi / 3 * k + math.pi / 6), Rm * math.sin(math.pi / 3 * k + math.pi / 6)) for k in range(6)]
        d.polygon(drehen(pts), fill=255)
        dl.ellipse([(cx - 28 * sk) * S, (cy - 28 * sk) * S, (cx + 28 * sk) * S, (cy + 28 * sk) * S], fill=255)
    else:                                                       # 'scheibe': flacher Ring, kein Sechskant
        Ra = 72
        d.ellipse([(cx - Ra * sk) * S, (cy - Ra * sk) * S, (cx + Ra * sk) * S, (cy + Ra * sk) * S], fill=255)
        dl.ellipse([(cx - 30 * sk) * S, (cy - 30 * sk) * S, (cx + 30 * sk) * S, (cy + 30 * sk) * S], fill=255)

    m = np.asarray(maske_im.resize((B, H), Image.LANCZOS), np.float32) / 255
    loch = np.asarray(loch_im.resize((B, H), Image.LANCZOS), np.float32) / 255
    rillen = np.asarray(gewinde.resize((B, H), Image.LANCZOS), np.float32) / 255
    ys, xs = np.mgrid[0:H, 0:B].astype(np.float32)
    dist = np.hypot(xs - cx, ys - cy)
    kontur = np.asarray(maske_im.filter(ImageFilter.MinFilter(9)).resize((B, H), Image.LANCZOS), np.float32) / 255
    kante = np.clip(m - kontur, 0, 1)                            # Rand des Teils (heller Saum)
    licht = rng.uniform(0, math.tau)
    v = ton + 22 * np.cos(np.arctan2(ys - cy, xs - cx) - licht) * np.clip(dist / 80, 0, 1)
    if typ == "schraube":
        v = v + 16 * np.sin((xs * math.cos(rot) + ys * math.sin(rot)) * 0.09)
    v = v + 40 * kante - 55 * rillen * m
    v = v + 6 * rng.normal(0, 1, (H, B))
    teil = v[..., None] * np.array([0.97, 1.0, 1.05])
    schatten = np.roll(np.roll(m, 6, 0), 5, 1)
    schatten = np.asarray(Image.fromarray((schatten * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4)), np.float32) / 255
    bg = bg * (1 - 0.3 * schatten[..., None])
    m = m * (1 - loch)
    bild = bg * (1 - m[..., None]) + teil * m[..., None]
    return _zu_bild(bild, rng, 0.5)


# ------------------------------------------------------------------ Zellen (Mikroskopie-Stil)
def zellen(seed, auffaellig=False):
    """Helle Probe mit vielen kleinen runden Zellen. auffaellig: dunkle Zellhaufen an einer Stelle."""
    rng = np.random.default_rng(seed)
    S = 2
    grund = np.array([rng.uniform(238, 248), rng.uniform(226, 238), rng.uniform(232, 244)])
    ys, xs = np.mgrid[0:H, 0:B].astype(np.float32)
    flecken = np.asarray(Image.fromarray(rng.integers(0, 255, (6, 8)).astype(np.uint8))
                         .resize((B, H), Image.BICUBIC), np.float32) / 255 - 0.5
    bild = grund[None, None, :] * (1 + 0.04 * flecken[..., None])
    # vignettierung wie beim Mikroskop
    vig = 1 - 0.18 * (np.hypot(xs - B / 2, ys - H / 2) / (B / 2)) ** 2
    bild = bild * vig[..., None]

    big = Image.fromarray(np.clip(bild, 0, 255).astype(np.uint8)).resize((B * S, H * S), Image.BICUBIC)
    d = ImageDraw.Draw(big, "RGBA")

    def zelle(x, y, r, kern, kernfarbe, zellfarbe, rand):
        d.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=zellfarbe, outline=rand, width=S)
        kx, ky = x + rng.uniform(-r * 0.25, r * 0.25), y + rng.uniform(-r * 0.25, r * 0.25)
        d.ellipse([(kx - kern) * S, (ky - kern) * S, (kx + kern) * S, (ky + kern) * S], fill=kernfarbe)

    n = int(rng.integers(55, 85))
    # normale Zellen: blass violett/rosa, gleichmaessig verteilt (Mindestabstand grob per Poisson-Auswahl)
    punkte = []
    versuche = 0
    while len(punkte) < n and versuche < 4000:
        versuche += 1
        p = (rng.uniform(8, B - 8), rng.uniform(8, H - 8))
        if all((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 > 15 ** 2 for q in punkte):
            punkte.append(p)
    for x, y in punkte:
        r = rng.uniform(5.5, 8.5)
        ton = rng.uniform(0.0, 1.0)
        zellfarbe = (int(205 - 15 * ton), int(180 - 20 * ton), int(215 - 10 * ton), 255)
        kern = (int(120 - 20 * ton), int(85 - 15 * ton), int(150 - 10 * ton), 255)
        zelle(x, y, r, r * rng.uniform(0.35, 0.5), kern, zellfarbe, (150, 120, 170, 255))

    if auffaellig:
        # Haufen abweichender Zellen: dunkel, groesser, dicht gepackt
        mx = rng.uniform(70, B - 70)
        my = rng.uniform(60, H - 60)
        anzahl = int(rng.integers(12, 19))
        for _ in range(anzahl):
            a = rng.uniform(0, math.tau)
            rad = abs(rng.normal(0, 24))
            x, y = mx + math.cos(a) * rad, my + math.sin(a) * rad
            r = rng.uniform(8, 12)
            zelle(x, y, r, r * rng.uniform(0.55, 0.7), (35, 10, 60, 255), (118, 62, 150, 255), (70, 30, 100, 255))
    bild = np.asarray(big.resize((B, H), Image.LANCZOS), np.float32)
    return _zu_bild(bild, rng, 0.7)
