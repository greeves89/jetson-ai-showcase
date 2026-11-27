"""Klassenmodus: eine Lehrkraft startet eine Sitzung mit Kurzcode, die Klasse macht mit, die Wand zeigt nur Summen.

Datenschutz-Vertrag (Zielgruppe: Kinder ab Klasse 8 in Deutschland, deshalb Datensparsamkeit zuerst)
  - Kein Konto, keine E-Mail, kein Name, kein Freitext. Teilnehmende bekommen ein Zufalls-Pseudonym (Farbe und Tier).
  - Alles nur im Arbeitsspeicher dieses Prozesses. Dieses Modul schreibt keine Datei und ruft weder print noch logging auf.
  - Der Dienst speichert NICHT, wer was gewaehlt hat: je Aktivitaet nur Zaehler je Wert und die Menge der schon
    Antwortenden (damit niemand doppelt zaehlt). Eine Antwort ist endgueltig.
  - Der Code steht nie in einer Adresse (Zugriffsprotokolle), nur im Inhalt von WebSocket-Nachrichten.
  - Die Wand zeigt erst nach "Ergebnis zeigen" Verteilungen, erst ab 3 Antworten, und Felder mit 1 bis 2 Antworten
    nur als "unter 3" (kleine-Zahlen-Schutz).
  - Hoechstens 2 Stunden Laufzeit, hoechstens 20 Minuten ohne Aktion, oder sofort per Knopf. Jede Loeschung erzeugt
    ein signiertes Loeschprotokoll (siehe loesche) mit Selbstpruefung.

Endpunkte
  WS   /ws/klasse                     alle Sitzungsnachrichten (erste Nachricht: neu | lehrer | wand | beitritt | wieder | nachweis)
  GET  /api/klasse/zaehler            oeffentlich: aktive Sitzungen
  POST /api/klasse/nachweis/pruefen   {"text": Protokoll} -> Signatur- und Formatpruefung (nichts wird gespeichert)
  GET/POST /klasse/nachweis           oeffentliche Pruefseite (ohne JavaScript nutzbar)

Disziplin im Code: Ein Sitzungsobjekt wird nie ueber ein await hinweg in einer lokalen Variable gehalten. Nur so kann die
Selbstpruefung nach dem Loeschen belegen, dass nichts mehr darauf zeigt (weakref + Speicherbereinigung).
"""
import asyncio
import gc
import hashlib
import hmac
import html
import json
import logging
import os
import re
import secrets
import time
import weakref
from collections import deque
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs

from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse

from app.sicherheit import begrenzt, client_kennung, origin_ok, umgebung_zahl

router = APIRouter()

# ---------------------------------------------------------------------------------------------------- Grenzen
CODE_ZEICHEN = "ACDEFGHJKMNPQRTWXYZ346789"       # 25 Zeichen ohne Verwechselbares (0/O, 1/I/L, 2/Z gibt es nur als Z, 5/S, 8/B ...)
CODE_LAENGE = 6                                   # 25^6 = 244 Millionen Codes
MAX_SITZUNGEN = int(umgebung_zahl("KL_KLASSE_MAX_SITZUNGEN", 20))
MAX_TEILNEHMER = int(umgebung_zahl("KL_KLASSE_MAX_TEILNEHMER", 40))
MAX_LAUFZEIT_S = umgebung_zahl("KL_KLASSE_MAX_LAUFZEIT_S", 7200, 5)       # 2 Stunden
MAX_RUHE_S = umgebung_zahl("KL_KLASSE_MAX_RUHE_S", 1200, 2)               # 20 Minuten ohne Aktion
MAX_AKTIVITAETEN = 30
MAX_NACHRICHT = 1024                              # Zeichen je WebSocket-Nachricht
MAX_VERBINDUNGEN = int(umgebung_zahl("KL_KLASSE_MAX_VERBINDUNGEN", 500))
MAX_VERB_JE_IP = 60                               # eine Klasse hinter einer Schuladresse: 40 plus Lehrkraft und Wand
MAX_SITZUNGEN_JE_IP = 3
MIN_ANTWORTEN = 3                                 # kleine-Zahlen-Schutz
FEHLVERSUCHE_JE_IP = 15                           # falsche Codes oder Schluessel je 10 Minuten, danach Sperre
FEHLVERSUCHE_FENSTER_S = 600.0
FEHLVERSUCH_PAUSE_S = 0.8                         # jede falsche Eingabe wird um diese Zeit gebremst
FEHLVERSUCHE_JE_VERBINDUNG = 3
ERSTE_NACHRICHT_S = 10.0
LESE_TIMEOUT_S = 90.0                             # die Oberflaeche schickt alle 25 s ein "ping"
NACHRICHTEN_FENSTER = (20, 10.0)                  # 20 Nachrichten je 10 s und Verbindung
NACHWEIS_AUFBEWAHRUNG_S = 3600.0
MAX_NACHWEISE = 100
SCAN_MAX_DATEIEN = 4000
SCAN_MAX_BYTES = 150_000_000
SCAN_MAX_DATEI = 8_000_000
SCAN_ZEIT_S = 4.0
SCAN_AUSLASSEN = {".git", "node_modules", "__pycache__", "static", "models", "certs", ".venv", "venv", "videos", "ausgabe"}
FORMAT = "kl-nachweis/1"
ANLAESSE = {"lehrkraft": "Lehrkraft", "zeit": "Höchstdauer 2 Stunden", "ruhe": "Inaktiv (20 Minuten)", "test": "Test"}
ARTEN = ("wahl", "skala", "schaetzung")
REF_MUSTER = re.compile(r"^[a-z0-9:_-]{0,48}$")
CODE_MUSTER = re.compile(r"^[" + CODE_ZEICHEN + r"]{" + str(CODE_LAENGE) + r"}$")
HEX = re.compile(r"^[0-9a-f]+$")

FARBEN = ("Roter", "Blauer", "Grüner", "Gelber", "Oranger", "Violetter", "Türkiser", "Grauer", "Brauner", "Weißer")
# Tier, Geschlecht (m, f, n): bestimmt die Endung der Farbe (Roter Fuchs, Rote Eule, Rotes Reh)
TIERE = (("Fuchs", "m"), ("Igel", "m"), ("Dachs", "m"), ("Hase", "m"), ("Otter", "m"), ("Luchs", "m"), ("Biber", "m"),
         ("Falke", "m"), ("Specht", "m"), ("Delfin", "m"),
         ("Eule", "f"), ("Katze", "f"), ("Ente", "f"), ("Robbe", "f"), ("Meise", "f"), ("Möwe", "f"), ("Biene", "f"),
         ("Schildkröte", "f"), ("Reh", "n"), ("Eichhörnchen", "n"), ("Murmeltier", "n"), ("Känguru", "n"), ("Faultier", "n"),
         ("Pferd", "n"))

# ---------------------------------------------------------------------------------------------------- Schluessel
_QUELLE = os.environ.get("KL_NACHWEIS_SCHLUESSEL", "").strip()
_STAMM = (hashlib.sha256(("kl-klasse-v1:" + _QUELLE).encode()).digest() if len(_QUELLE) >= 16 else secrets.token_bytes(32))
SCHLUESSEL_ART = "dauerhaft (aus der Umgebung des Dienstes)" if len(_QUELLE) >= 16 else "nur bis zum Neustart des Dienstes"
_K_INDEX = hmac.new(_STAMM, b"index", hashlib.sha256).digest()
_K_SIGNATUR = hmac.new(_STAMM, b"signatur", hashlib.sha256).digest()
_K_IP = hmac.new(_STAMM, b"ip", hashlib.sha256).digest()
SCHLUESSEL_KENNUNG = hmac.new(_K_SIGNATUR, b"kennung", hashlib.sha256).hexdigest()[:8]
try:
    _QUELLTEXT_HASH = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()[:12]
except OSError:                                                      # pragma: no cover
    _QUELLTEXT_HASH = "unbekannt"
DIENSTVERSION = "Klassenmodus 1, Programmstand " + _QUELLTEXT_HASH

_jetzt = time.time                                                   # Tests ersetzen die Uhr


# ---------------------------------------------------------------------------------------------------- Zustand
class Signal:
    """Weckruf fuer die Sendeschleifen. Zeigt nie auf die Sitzung, damit nach dem Loeschen nichts daran haengt."""
    __slots__ = ("ev", "beendet", "sid")

    def __init__(self, sid):
        self.ev = asyncio.Event()
        self.beendet = False
        self.sid = sid

    def wecken(self):
        self.ev.set()


class Teilnehmer:
    __slots__ = ("name", "token")

    def __init__(self, name, token):
        self.name, self.token = name, token           # token: bytearray (SHA-256 des Wiederverbindungs-Schluessels)


class Aktivitaet:
    __slots__ = ("nr", "art", "n", "lo", "hi", "ref", "offen", "zeigen", "loesung", "zaehler", "beantwortet")

    def __init__(self, nr, art, n, lo, hi, ref):
        self.nr, self.art, self.n, self.lo, self.hi, self.ref = nr, art, n, lo, hi, ref
        self.offen, self.zeigen, self.loesung = True, False, None
        self.zaehler = {}               # Wert -> Anzahl. Es wird NICHT gespeichert, wer was gewaehlt hat.
        self.beantwortet = set()        # nur Teilnehmer-Nummern, ohne Wert


class Sitzung:
    __slots__ = ("sid", "start", "zuletzt", "code", "lehrer", "ip", "teilnehmer", "aktivitaeten", "signal", "naechste",
                 "log_treffer", "__weakref__")

    def __init__(self, sid, code, lehrer, ip):
        t = _jetzt()
        self.sid, self.start, self.zuletzt = sid, t, t
        self.code = bytearray(code.encode())          # Klartext nur fuer die Selbstpruefung, wird beim Loeschen ueberschrieben
        self.lehrer = bytearray(lehrer)               # SHA-256 des Lehrer-Schluessels
        self.ip = ip                                  # gesalzener Kurzhash der Adresse (nur fuer die Obergrenze je Adresse)
        self.teilnehmer = {}                          # Nr -> Teilnehmer
        self.aktivitaeten = []
        self.signal = Signal(sid)
        self.naechste = 1
        self.log_treffer = 0


_sitz = {}              # Register 1: Sitzungskennung (HMAC des Codes) -> Sitzung
_ip_sitzungen = {}      # Register 2: Adress-Kurzhash -> Menge von Sitzungskennungen
_verbindungen = {}      # Register 3: Sitzungskennung -> Zahl offener Verbindungen
_ip_verbindungen = {}   # Adress-Kurzhash -> offene Verbindungen
_fehlversuche = {}      # Adress-Kurzhash -> deque von Zeitstempeln
_nachweise = {}         # Sitzungskennung -> (Protokolltext, Ablaufzeit). Nur Zahlen, Hash und Prueferergebnisse.
_beendet = 0            # seit Start des Dienstes gelöschte Sitzungen
_verb_gesamt = 0
_reaper = {"task": None, "loop": None}


def _ip_tag(anfrage) -> str:
    return hmac.new(_K_IP, client_kennung(anfrage).encode(), hashlib.sha256).hexdigest()[:12]


def _sid(code: str) -> str:
    return hmac.new(_K_INDEX, ("sitzung:" + code).encode(), hashlib.sha256).hexdigest()[:32]


def _digest(text: str) -> bytes:
    return hashlib.sha256(text.encode()).digest()


def _gleich(a, b) -> bool:
    return hmac.compare_digest(bytes(a), bytes(b))


# ---------------------------------------------------------------------------------------------------- Wächter für Logger
class _LogWaechter(logging.Filter):
    """Kein Logeintrag des Dienstes darf einen laufenden Code oder eine Sitzungskennung enthalten. Der Filter verwirft
    solche Eintraege und zaehlt sie (Pruefung 5 im Loeschprotokoll). Er schreibt selbst nichts."""

    def filter(self, record):
        try:
            text = record.getMessage()
        except Exception:                                            # noqa: BLE001
            return True
        if not _sitz:
            return True
        for s in list(_sitz.values()):
            if bytes(s.code).decode() in text or s.sid in text:
                s.log_treffer += 1
                return False
        return True


_waechter = _LogWaechter()


def _waechter_einhaengen():
    """Haengt den Filter an alle Handler und Logger, die Dienst- und Zugriffsmeldungen schreiben (idempotent)."""
    for name in ("", "uvicorn", "uvicorn.error", "uvicorn.access"):
        lg = logging.getLogger(name)
        if _waechter not in lg.filters:
            lg.addFilter(_waechter)
        for hd in lg.handlers:
            if _waechter not in hd.filters:
                hd.addFilter(_waechter)


_waechter_einhaengen()


# ---------------------------------------------------------------------------------------------------- Pseudonyme, Ergebnisse
def _pseudonym(belegt: set) -> str:
    for _ in range(200):
        farbe = secrets.choice(FARBEN)
        tier, g = secrets.choice(TIERE)
        f = farbe[:-2] + {"m": "er", "f": "e", "n": "es"}[g]       # Roter, Rote, Rotes
        name = f + " " + tier
        if name not in belegt:
            return name
    return "Gast " + str(len(belegt) + 1)


def _verteilung(werte: list, zaehler: dict, ordnen):
    """werte: Zellen in fester Reihenfolge; ordnen(w) -> Zelle. Gibt (zellen, unterdrueckt) zurueck."""
    zellen = [0] * len(werte)
    for w, c in zaehler.items():
        zellen[ordnen(w)] += c
    unter = False
    aus = []
    for c in zellen:
        if 0 < c < MIN_ANTWORTEN:
            aus.append(-1)
            unter = True
        else:
            aus.append(c)
    return aus, unter


def _ergebnis(a: Aktivitaet):
    """Aggregierte Sicht fuer Wand und Lehrkraft. Kein Wert ist einer Person zuzuordnen."""
    gesamt = sum(a.zaehler.values())
    if gesamt < MIN_ANTWORTEN:
        return {"zu_wenige": True, "mindestens": MIN_ANTWORTEN}
    if a.art == "wahl":
        zellen, unter = _verteilung(list(range(a.n)), a.zaehler, lambda w: w)
        r = {"zellen": zellen, "loesung": a.loesung}
    elif a.art == "skala":
        zellen, unter = _verteilung(list(range(5)), a.zaehler, lambda w: w - 1)
        mittel = sum(w * c for w, c in a.zaehler.items()) / gesamt
        r = {"zellen": zellen, "mittelwert": round(mittel, 1), "loesung": None}
    else:
        spanne = a.hi - a.lo + 1
        k = min(8, spanne)
        breite = spanne / k
        zellen, unter = _verteilung(list(range(k)), a.zaehler, lambda w: min(k - 1, int((w - a.lo) / breite)))
        folge = sorted(w for w, c in a.zaehler.items() for _ in range(c))
        mitte = folge[len(folge) // 2] if len(folge) % 2 else (folge[len(folge) // 2 - 1] + folge[len(folge) // 2]) / 2
        grenzen = [round(a.lo + i * breite) for i in range(k)] + [a.hi]
        r = {"zellen": zellen, "grenzen": grenzen, "median": mitte, "loesung": a.loesung}
    r["zu_wenige"] = False
    r["gesamt"] = None if unter else gesamt            # sonst liesse sich ein verborgenes Feld ausrechnen
    r["unter_drei"] = unter
    return r


def _aktiv(s: Sitzung):
    return s.aktivitaeten[-1] if s.aktivitaeten else None


def _stand(sid: str, rolle: str, nr):
    """Zustand fuer eine Verbindung. None, wenn die Sitzung nicht mehr existiert."""
    s = _sitz.get(sid)
    if s is None:
        return None
    jetzt = _jetzt()
    a = _aktiv(s)
    akt = None
    if a is not None:
        akt = {"nr": a.nr, "art": a.art, "n": a.n, "lo": a.lo, "hi": a.hi, "ref": a.ref, "offen": a.offen,
               "zeigen": a.zeigen}
        if rolle == "schueler":
            akt["beantwortet"] = nr in a.beantwortet
        else:
            akt["antworten"] = len(a.beantwortet)          # nur die Zahl, nie wer
        if a.zeigen:
            akt["ergebnis"] = _ergebnis(a)
    d = {"t": "stand", "rolle": rolle, "teilnehmer": len(s.teilnehmer), "max_teilnehmer": MAX_TEILNEHMER,
         "rest_s": int(max(0, min(MAX_LAUFZEIT_S - (jetzt - s.start), MAX_RUHE_S - (jetzt - s.zuletzt)))),
         "aktivitaeten": len(s.aktivitaeten), "aktivitaet": akt}
    if rolle == "schueler":
        t = s.teilnehmer.get(nr)
        d["name"] = t.name if t else ""
    else:
        # Namen nur in der Warteansicht (vor der ersten Aufgabe), danach nur noch die Zahl
        d["namen"] = sorted(t.name for t in s.teilnehmer.values()) if a is None else []
    return d


# ---------------------------------------------------------------------------------------------------- Loeschen
def _ueberschreiben(s: Sitzung) -> bool:
    """Ueberschreibt alle geheimen Felder mit Nullen und leert die Container. True, wenn danach alles leer ist."""
    for feld in (s.code, s.lehrer):
        feld[:] = bytes(len(feld))
    for t in s.teilnehmer.values():
        t.token[:] = bytes(len(t.token))
        t.name = ""
    ok = all(b == 0 for b in s.code) and all(b == 0 for b in s.lehrer) and all(
        all(b == 0 for b in t.token) for t in s.teilnehmer.values())
    for a in s.aktivitaeten:
        a.zaehler.clear()
        a.beantwortet.clear()
    s.teilnehmer.clear()
    s.aktivitaeten.clear()
    return ok


def _scan(nadeln, wurzeln):
    """Sucht die Nadeln (bytes) in Dateien unter den Wurzeln. Gibt (treffer, dateien, bytes, vollstaendig) zurueck."""
    ende = time.monotonic() + SCAN_ZEIT_S
    treffer = dateien = gelesen = 0
    voll = True
    maxlen = max(len(n) for n in nadeln)
    for wurzel in wurzeln:
        wurzel = Path(wurzel)
        if wurzel.is_file():
            ziele = [(str(wurzel.parent), [], [wurzel.name])]
            lauf = iter(ziele)
        else:
            lauf = os.walk(wurzel)
        for ordner, unter, namen in lauf:
            unter[:] = [d for d in unter if d not in SCAN_AUSLASSEN]
            for name in namen:
                if dateien >= SCAN_MAX_DATEIEN or gelesen >= SCAN_MAX_BYTES or time.monotonic() > ende:
                    return treffer, dateien, gelesen, False
                pfad = os.path.join(ordner, name)
                try:
                    if os.path.islink(pfad) or not os.path.isfile(pfad):
                        continue
                    if os.path.getsize(pfad) > SCAN_MAX_DATEI:
                        voll = False
                        continue
                    rest = b""
                    with open(pfad, "rb") as f:
                        while True:
                            stueck = f.read(1_000_000)
                            if not stueck:
                                break
                            gelesen += len(stueck)
                            block = rest + stueck
                            if any(n in block for n in nadeln):
                                treffer += 1
                                break
                            rest = block[-(maxlen - 1):] if maxlen > 1 else b""
                    dateien += 1
                except OSError:
                    voll = False
    return treffer, dateien, gelesen, voll


def _scan_wurzeln():
    liste = [Path(__file__).resolve().parent.parent]
    extra = os.environ.get("KL_KLASSE_SCANPFADE", "")
    liste += [Path(p) for p in extra.split(os.pathsep) if p.strip()]
    return liste


def _utc(t: float) -> str:
    return datetime.fromtimestamp(int(t), timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _signiere(text: str) -> str:
    return hmac.new(_K_SIGNATUR, text.encode(), hashlib.sha256).hexdigest()


def _protokoll(felder: dict) -> str:
    kopf = ["KI-Labor Klassenmodus: Löschprotokoll", "Format: " + FORMAT,
            "Sitzung: " + felder["sid"],
            "Start (UTC): " + _utc(felder["start"]), "Ende (UTC): " + _utc(felder["ende"]),
            "Anlass: " + felder["anlass"],
            "Teilnehmende gelöscht: %d" % felder["teilnehmende"],
            "Antworten gelöscht: %d" % felder["antworten"],
            "Aktivitäten gelöscht: %d" % felder["aktivitaeten"]]
    for i, (text, ergebnis) in enumerate(felder["pruefungen"], 1):
        kopf.append("Prüfung %d, %s: %s" % (i, text, ergebnis))
    kopf += ["Aktive Sitzungen danach: %d" % felder["aktiv_danach"],
             "Dienstversion: " + DIENSTVERSION,
             "Schlüsselart: " + SCHLUESSEL_ART,
             "Schlüsselkennung: " + SCHLUESSEL_KENNUNG]
    text = "\n".join(kopf) + "\n"
    return text + "Signatur: " + _signiere(text) + "\n"


async def loesche(sid: str, anlass: str):
    """Loescht eine Sitzung vollstaendig und liefert das signierte Loeschprotokoll (Text). Idempotent."""
    global _beendet
    if sid not in _sitz:
        alt = _nachweise.get(sid)
        return alt[0] if alt else None
    ende = _jetzt()
    s = _sitz.pop(sid)
    nadeln = [bytes(s.code), sid.encode()]
    nadeln.append(nadeln[0].lower())
    code_text = nadeln[0].decode()
    start, zahlen = s.start, (len(s.teilnehmer), sum(sum(a.zaehler.values()) for a in s.aktivitaeten), len(s.aktivitaeten))
    log_treffer, ip, signal = s.log_treffer, s.ip, s.signal
    ueberschrieben = _ueberschreiben(s)
    ref = weakref.ref(s)
    del s
    # Register aufraeumen
    menge = _ip_sitzungen.get(ip)
    if menge is not None:
        menge.discard(sid)
        if not menge:
            _ip_sitzungen.pop(ip, None)
    _verbindungen.pop(sid, None)
    _beendet += 1
    # Selbstpruefung
    await asyncio.sleep(0)                               # die Verbindungs-Aufgaben duerfen ihre Zwischenstaende freigeben
    gc.collect()
    p1 = sid not in _sitz and _finde(code_text) is None
    p2 = (sid not in _sitz and sid not in _verbindungen and not any(sid in m for m in _ip_sitzungen.values()))
    p3 = ueberschrieben and ref() is None
    if ref() is not None:                                # eine Verbindung haelt die Sitzung noch kurz: kurz warten
        for _ in range(10):
            await asyncio.sleep(0.05)
            gc.collect()
            if ref() is None:
                break
        p3 = ueberschrieben and ref() is None
    treffer, dateien, gelesen, voll = await asyncio.to_thread(_scan, nadeln, _scan_wurzeln())
    del nadeln, code_text
    if treffer:
        p4 = "nicht bestanden"
    else:
        p4 = "bestanden" if voll else "teilweise geprüft"
    p4txt = "Suche nach Code und Sitzungskennung in Dateien und Protokolldateien des Dienstes (%d Dateien, %d KB gelesen)" % (dateien, gelesen // 1024)
    ja = lambda b: "bestanden" if b else "nicht bestanden"           # noqa: E731
    felder = {"sid": sid, "start": start, "ende": ende, "anlass": ANLAESSE.get(anlass, anlass),
              "teilnehmende": zahlen[0], "antworten": zahlen[1], "aktivitaeten": zahlen[2],
              "aktiv_danach": len(_sitz),
              "pruefungen": [("Sitzung nicht mehr abrufbar", ja(p1)),
                             ("Sitzungsregister, Adresszähler und Verbindungsliste ohne Eintrag", ja(p2)),
                             ("Geheime Felder überschrieben, Sitzungsobjekt freigegeben", ja(p3)),
                             (p4txt, p4),
                             ("Dienst-Logger ohne Eintrag mit Code oder Sitzungskennung (%d Treffer)" % log_treffer,
                              ja(log_treffer == 0))]}
    text = _protokoll(felder)
    jetzt = _jetzt()
    for k in [k for k, (_, bis) in _nachweise.items() if bis < jetzt]:
        _nachweise.pop(k, None)
    while len(_nachweise) >= MAX_NACHWEISE:
        _nachweise.pop(next(iter(_nachweise)))
    _nachweise[sid] = (text, jetzt + NACHWEIS_AUFBEWAHRUNG_S)
    signal.beendet = True
    signal.wecken()
    return text


def _norm(code):
    """Eingabe tolerant (Leerzeichen, Kleinbuchstaben), sonst unveraendert."""
    return code.strip().upper() if isinstance(code, str) else code


def _finde(code: str):
    """Sitzungskennung zu einem Code, falls es die Sitzung gibt (sonst None)."""
    code = _norm(code)
    if not isinstance(code, str) or not CODE_MUSTER.match(code):
        return None
    sid = _sid(code)
    return sid if sid in _sitz else None


def _faellige():
    jetzt = _jetzt()
    out = []
    for sid, s in list(_sitz.items()):
        if jetzt - s.start > MAX_LAUFZEIT_S:
            out.append((sid, "zeit"))
        elif jetzt - s.zuletzt > MAX_RUHE_S:
            out.append((sid, "ruhe"))
    return out


async def aufraeumen():
    """Loescht abgelaufene Sitzungen. Laeuft bei jedem Zugriff und zusaetzlich alle 20 Sekunden im Hintergrund."""
    for sid, grund in _faellige():
        await loesche(sid, grund)


async def _reaper_lauf():
    while True:
        await asyncio.sleep(20)
        try:
            await aufraeumen()
        except Exception:                                # noqa: BLE001  (der Hintergrundlauf darf nie enden)
            pass


def _reaper_sichern():
    loop = asyncio.get_running_loop()
    t = _reaper["task"]
    if t is None or t.done() or _reaper["loop"] is not loop:
        _reaper["task"], _reaper["loop"] = loop.create_task(_reaper_lauf()), loop


# ---------------------------------------------------------------------------------------------------- Pruefung eines Protokolls
_ZEIT = re.compile(r"^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$")
_PRUEF = re.compile(r"^Prüfung (\d+), (.{1,200}): (bestanden|nicht bestanden|teilweise geprüft|nicht geprüft)$")


def pruefe_nachweis(roh) -> dict:
    """Prueft Format und Signatur eines Loeschprotokolls. Speichert nichts."""
    fehler = []
    if not isinstance(roh, str) or len(roh) > 6000:
        return {"format": "ungültig", "signatur": "ungültig", "fehler": ["Das Protokoll fehlt oder ist zu lang."], "felder": {}}
    text = roh.replace("\r\n", "\n").replace("\r", "\n").strip("\n ") + "\n"
    zeilen = text.split("\n")[:-1]
    felder, pruefungen = {}, []
    if not zeilen or zeilen[0] != "KI-Labor Klassenmodus: Löschprotokoll":
        fehler.append("Die erste Zeile stimmt nicht.")
    for z in zeilen[1:]:
        m = _PRUEF.match(z)
        if m:
            pruefungen.append((int(m.group(1)), m.group(2), m.group(3)))
        elif ": " in z:
            k, v = z.split(": ", 1)
            felder[k] = v
        else:
            fehler.append("Unbekannte Zeile.")
    def zahl(k):
        v = felder.get(k, "")
        if not v.isdigit() or len(v) > 7:
            fehler.append("Feld ungültig: " + k)
    if felder.get("Format") != FORMAT:
        fehler.append("Unbekanntes Format.")
    if not re.fullmatch(r"[0-9a-f]{32}", felder.get("Sitzung", "")):
        fehler.append("Feld ungültig: Sitzung")
    for k in ("Start (UTC)", "Ende (UTC)"):
        if not _ZEIT.match(felder.get(k, "")):
            fehler.append("Feld ungültig: " + k)
    if not fehler and felder["Ende (UTC)"] < felder["Start (UTC)"]:
        fehler.append("Das Ende liegt vor dem Start.")
    if felder.get("Anlass") not in ANLAESSE.values():
        fehler.append("Feld ungültig: Anlass")
    for k in ("Teilnehmende gelöscht", "Antworten gelöscht", "Aktivitäten gelöscht", "Aktive Sitzungen danach"):
        zahl(k)
    if [n for n, _, _ in pruefungen] != list(range(1, len(pruefungen) + 1)) or len(pruefungen) != 5:
        fehler.append("Es müssen genau fünf Prüfungen in Reihenfolge stehen.")
    if not re.fullmatch(r"[0-9a-f]{8}", felder.get("Schlüsselkennung", "")):
        fehler.append("Feld ungültig: Schlüsselkennung")
    for k in ("Dienstversion", "Schlüsselart"):
        if not felder.get(k) or len(felder[k]) > 120:
            fehler.append("Feld ungültig: " + k)
    sig = felder.pop("Signatur", "")
    if not re.fullmatch(r"[0-9a-f]{64}", sig):
        fehler.append("Feld ungültig: Signatur")
        sig_ok = False
        andere_kennung = False
    else:
        koerper = text[: text.rindex("Signatur: ")] if "Signatur: " in text else ""
        sig_ok = bool(koerper) and hmac.compare_digest(_signiere(koerper), sig)
        andere_kennung = felder.get("Schlüsselkennung") != SCHLUESSEL_KENNUNG
    format_ok = not fehler
    antwort = {"format": "gültig" if format_ok else "ungültig", "signatur": "gültig" if sig_ok else "ungültig",
               "fehler": fehler[:8], "alle_bestanden": bool(pruefungen) and all(e == "bestanden" for _, _, e in pruefungen),
               "felder": {k: felder.get(k, "") for k in ("Sitzung", "Start (UTC)", "Ende (UTC)", "Anlass", "Teilnehmende gelöscht",
                                                          "Antworten gelöscht", "Aktivitäten gelöscht", "Dienstversion", "Schlüsselart")},
               "pruefungen": [{"nr": n, "text": t, "ergebnis": e} for n, t, e in pruefungen]}
    if not sig_ok and format_ok and andere_kennung:
        antwort["hinweis"] = ("Das Protokoll wurde mit einem anderen Schlüssel signiert als dem, den dieser Dienst gerade nutzt. "
                              "Der Dienst wurde seitdem neu gestartet, oder das Protokoll stammt von einem anderen Dienst. "
                              "Die Signatur lässt sich hier nicht mehr prüfen.")
    elif not sig_ok and format_ok:
        antwort["hinweis"] = "Das Protokoll wurde nach der Ausstellung verändert oder ist nicht von diesem Dienst."
    return antwort


# ---------------------------------------------------------------------------------------------------- HTTP
async def _koerper(request, grenze=8000):
    """Liest den Body hoechstens bis `grenze` Bytes (auch ohne Content-Length). None, wenn er groesser ist."""
    teile, n = [], 0
    async for stueck in request.stream():
        n += len(stueck)
        if n > grenze:
            return None
        teile.append(stueck)
    return b"".join(teile)


def _roh_oeffentlich():
    return os.environ.get("OEFFENTLICH") == "1"


def _zu_viele(request, name, maximal, fenster=60.0) -> bool:
    return _roh_oeffentlich() and begrenzt(request, name, maximal, fenster)


@router.get("/api/klasse/zaehler")
async def zaehler(request: Request):
    """Oeffentlich: wie viele Sitzungen laufen gerade. Faellt nach dem Loeschen sichtbar zurueck (Beweisbild)."""
    if _zu_viele(request, "klasse-zaehler", 120):
        return JSONResponse({"fehler": "zu viele Anfragen"}, status_code=429)
    await aufraeumen()
    return JSONResponse({"aktiv": len(_sitz), "max": MAX_SITZUNGEN, "beendet_seit_start": _beendet},
                        headers={"Cache-Control": "no-store"})


@router.post("/api/klasse/nachweis/pruefen")
async def nachweis_pruefen(request: Request):
    if not origin_ok(request.headers):
        return JSONResponse({"fehler": "Herkunft nicht erlaubt"}, status_code=403)
    if _zu_viele(request, "klasse-pruefen", 30):
        return JSONResponse({"fehler": "zu viele Anfragen"}, status_code=429)
    roh = await _koerper(request)
    if roh is None:
        return JSONResponse({"fehler": "zu groß"}, status_code=413)
    try:
        daten = json.loads(roh)
    except (ValueError, json.JSONDecodeError):
        return JSONResponse({"fehler": "ungültige Anfrage"}, status_code=400)
    text = daten.get("text") if isinstance(daten, dict) else None
    return JSONResponse(pruefe_nachweis(text), headers={"Cache-Control": "no-store"})


_SEITE = """<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><link rel="icon" href="data:,"><title>Löschprotokoll prüfen</title>
<style>
:root{color-scheme:light dark;--bg:#f7f8fa;--fg:#14202b;--box:#fff;--rand:#c9d2dc;--ok:#0a6b3a;--bad:#a4261c;--link:#0b5cad}
@media (prefers-color-scheme:dark){:root{--bg:#10171e;--fg:#e8eef4;--box:#18222c;--rand:#33424f;--ok:#6fd49b;--bad:#ff8c80;--link:#8ec2ff}}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,sans-serif}
main{max-width:46rem;margin:0 auto;padding:1.5rem 16px 3rem}
textarea{width:100%;min-height:16rem;box-sizing:border-box;font:13px/1.45 ui-monospace,monospace;background:var(--box);color:var(--fg);border:1px solid var(--rand);border-radius:8px;padding:.7rem}
button{font:inherit;padding:.55rem 1.1rem;border-radius:8px;border:1px solid var(--link);background:var(--link);color:#fff;cursor:pointer}
.box{background:var(--box);border:1px solid var(--rand);border-radius:10px;padding:1rem 1.2rem;margin:1rem 0}
.ok{color:var(--ok)}.bad{color:var(--bad)}a{color:var(--link)}
</style></head><body><main>
<p><a href="/klassenmodus">Zurück zum Klassenmodus</a></p>
<h1>Löschprotokoll prüfen</h1>
<p>Füge das Protokoll ein, das die Lehrkraft nach dem Löschen der Sitzung bekommen hat. Der Dienst prüft das Format und die Signatur.
Das Protokoll wird nicht gespeichert und nicht protokolliert.</p>
<form method="post" action="/klasse/nachweis"><textarea name="text" maxlength="6000" aria-label="Löschprotokoll" required>%TEXT%</textarea>
<p><button type="submit">Prüfen</button></p></form>
%ERGEBNIS%
<div class="box"><b>Was die Prüfung aussagt.</b> Die Signatur belegt, dass dieser Dienst das Protokoll ausgestellt hat und dass seitdem nichts daran geändert wurde.
Sie belegt nicht allein, dass die Löschung stattgefunden hat: Die Einzelprüfungen im Protokoll hat der Dienst selbst gefahren.
Außerhalb der Anwendung fallen trotzdem Zugriffsdaten an (siehe die Seite zum Klassenmodus).</div>
</main></body></html>"""


def _ergebnis_html(a: dict) -> str:
    e = html.escape
    ok = a["format"] == "gültig" and a["signatur"] == "gültig"
    teile = ['<div class="box"><b class="%s">%s</b>' % ("ok" if ok else "bad",
             "Format und Signatur sind gültig." if ok else "Das Protokoll ist nicht gültig.")]
    teile.append("<p>Format: %s. Signatur: %s.</p>" % (e(a["format"]), e(a["signatur"])))
    for f in a["fehler"]:
        teile.append('<p class="bad">%s</p>' % e(f))
    if a.get("hinweis"):
        teile.append("<p>%s</p>" % e(a["hinweis"]))
    if a["pruefungen"]:
        teile.append("<ul>" + "".join("<li>%s: %s</li>" % (e(p["text"]), e(p["ergebnis"])) for p in a["pruefungen"]) + "</ul>")
    teile.append("</div>")
    return "".join(teile)


@router.get("/klasse/nachweis", response_class=HTMLResponse)
async def nachweis_seite():
    return HTMLResponse(_SEITE.replace("%TEXT%", "").replace("%ERGEBNIS%", ""), headers={"Cache-Control": "no-store"})


@router.post("/klasse/nachweis", response_class=HTMLResponse)
async def nachweis_pruefen_seite(request: Request):
    if not origin_ok(request.headers):
        return HTMLResponse("Herkunft nicht erlaubt", status_code=403)
    if _zu_viele(request, "klasse-pruefen", 30):
        return HTMLResponse("Zu viele Anfragen. Warte eine Minute.", status_code=429)
    roh = await _koerper(request)
    if roh is None:
        return HTMLResponse("Zu groß", status_code=413)
    roh = roh.decode("utf-8", "replace")
    text = (parse_qs(roh).get("text") or [""])[0]
    antwort = pruefe_nachweis(text)
    return HTMLResponse(_SEITE.replace("%TEXT%", html.escape(text)).replace("%ERGEBNIS%", _ergebnis_html(antwort)),
                        headers={"Cache-Control": "no-store"})


# ---------------------------------------------------------------------------------------------------- WebSocket
def _gesperrt(ip: str) -> bool:
    d = _fehlversuche.get(ip)
    if not d:
        return False
    jetzt = _jetzt()
    while d and jetzt - d[0] > FEHLVERSUCHE_FENSTER_S:
        d.popleft()
    if not d:
        _fehlversuche.pop(ip, None)
        return False
    return len(d) >= FEHLVERSUCHE_JE_IP


def _fehlversuch(ip: str):
    _fehlversuche.setdefault(ip, deque()).append(_jetzt())
    if len(_fehlversuche) > 5000:                          # Speicher begrenzen
        for k in list(_fehlversuche)[:2500]:
            if not _gesperrt(k):
                _fehlversuche.pop(k, None)


def _lehrer_ok(sid: str, schluessel) -> bool:
    s = _sitz.get(sid)
    return bool(s) and isinstance(schluessel, str) and 8 <= len(schluessel) <= 64 and _gleich(s.lehrer, _digest(schluessel))


def _int(x):
    return x if type(x) is int else None


def _aktivitaet_anlegen(sid: str, m: dict):
    """Lehrkraft startet eine Aktivitaet. Gibt einen Fehlertext oder None zurueck."""
    s = _sitz.get(sid)
    if s is None:
        return "Die Sitzung ist beendet."
    art = m.get("art")
    if art not in ARTEN:
        return "Unbekannte Art."
    ref = m.get("ref", "")
    if not isinstance(ref, str) or not REF_MUSTER.match(ref):
        return "Ungültiger Verweis."
    n = lo = hi = 0
    if art == "wahl":
        n = _int(m.get("n"))
        if n is None or not 2 <= n <= 6:
            return "Eine Auswahl braucht 2 bis 6 Möglichkeiten."
    elif art == "skala":
        n = 5
    else:
        lo, hi = _int(m.get("lo")), _int(m.get("hi"))
        if lo is None or hi is None or not -1_000_000 <= lo < hi <= 1_000_000:
            return "Ungültiger Bereich für die Schätzung."
    if len(s.aktivitaeten) >= MAX_AKTIVITAETEN:
        return "Mehr als %d Aufgaben je Sitzung gehen nicht. Beende die Sitzung und starte eine neue." % MAX_AKTIVITAETEN
    a = _aktiv(s)
    if a is not None:
        a.offen = False
    s.aktivitaeten.append(Aktivitaet(s.naechste, art, n, lo, hi, ref))
    s.naechste += 1
    return None


def _antwort(sid: str, nr, m: dict):
    s = _sitz.get(sid)
    a = _aktiv(s) if s else None
    if a is None or not a.offen or _int(m.get("nr")) != a.nr:
        return "Diese Aufgabe ist nicht (mehr) offen."
    if nr in a.beantwortet:
        return "Du hast schon geantwortet."
    w = _int(m.get("wert"))
    if w is None:
        return "Ungültige Antwort."
    if a.art == "wahl" and not 0 <= w < a.n:
        return "Ungültige Antwort."
    if a.art == "skala" and not 1 <= w <= 5:
        return "Ungültige Antwort."
    if a.art == "schaetzung" and not a.lo <= w <= a.hi:
        return "Die Schätzung liegt außerhalb des Bereichs."
    a.zaehler[w] = a.zaehler.get(w, 0) + 1
    a.beantwortet.add(nr)
    s.zuletzt = _jetzt()
    return None


def _steuern(sid: str, m: dict):
    """Aktionen der Lehrkraft: zeigen, schliessen, loesung."""
    s = _sitz.get(sid)
    a = _aktiv(s) if s else None
    if a is None:
        return "Es läuft keine Aufgabe."
    t = m.get("t")
    if t == "zeigen":
        a.offen, a.zeigen = False, True
    elif t == "schliessen":
        a.offen = False
    elif t == "verbergen":
        a.zeigen = False
    elif t == "loesung":
        w = _int(m.get("wert"))
        if w is None or (a.art == "wahl" and not 0 <= w < a.n) or (a.art == "schaetzung" and not a.lo <= w <= a.hi) or a.art == "skala":
            return "Ungültige Lösung."
        a.loesung = w
    return None


async def _senden(ws, sid, rolle, nr):
    """Schickt bei jeder Aenderung den Zustand. Haelt nur Kennung und Weckruf, nie die Sitzung."""
    sig = None
    s = _sitz.get(sid)
    if s is not None:
        sig = s.signal
    del s
    if sig is None:
        return
    try:
        while True:
            await sig.ev.wait()
            if not sig.beendet:
                await asyncio.sleep(0.15)
            sig.ev.clear()
            if sig.beendet:
                nw = _nachweise.get(sid)
                nachricht = {"t": "ende"}
                if nw and rolle == "lehrer":
                    nachricht["nachweis"] = nw[0]
                await ws.send_text(json.dumps(nachricht))
                await ws.close(code=1000)
                return
            stand = _stand(sid, rolle, nr)
            if stand is None:
                return
            await ws.send_text(json.dumps(stand))
    except Exception:                                    # noqa: BLE001  (Verbindung weg)
        return


async def _fehler(ws, text, schliessen=False, code=1008):
    try:
        await ws.send_text(json.dumps({"t": "fehler", "text": text}))
        if schliessen:
            await ws.close(code=code)
    except Exception:                                    # noqa: BLE001
        pass


async def _lesen(ws, timeout):
    """Eine Textnachricht lesen. Zu lange Nachrichten und Binaerdaten werden abgelehnt (None)."""
    roh = await asyncio.wait_for(ws.receive(), timeout)
    if roh.get("type") == "websocket.disconnect":
        raise WebSocketDisconnect(roh.get("code", 1000))
    t = roh.get("text")
    if t is None or len(t) > MAX_NACHRICHT:
        return None
    try:
        m = json.loads(t)
    except ValueError:
        return None
    return m if isinstance(m, dict) and isinstance(m.get("t"), str) else None


@router.websocket("/ws/klasse")
async def ws_klasse(ws: WebSocket):
    global _verb_gesamt
    if not origin_ok(ws.headers):
        await ws.close(code=1008)
        return
    ip = _ip_tag(ws)
    if _verb_gesamt >= MAX_VERBINDUNGEN or _ip_verbindungen.get(ip, 0) >= MAX_VERB_JE_IP:
        await ws.close(code=1013)
        return
    await ws.accept()
    _verb_gesamt += 1
    _ip_verbindungen[ip] = _ip_verbindungen.get(ip, 0) + 1
    sid = None
    sender = None
    try:
        sid, rolle, nr, token = await _anmelden(ws, ip)
        if sid is None:
            return
        _verbindungen[sid] = _verbindungen.get(sid, 0) + 1
        sender = asyncio.create_task(_senden(ws, sid, rolle, nr))
        if rolle == "schueler":
            await ws.send_text(json.dumps({"t": "willkommen", "token": token}))      # Schluessel fuer das Wiederverbinden, nur dieses eine Mal
        sig_stand = _stand(sid, rolle, nr)
        if sig_stand is not None:
            await ws.send_text(json.dumps(sig_stand))
        fenster = deque()
        while not sender.done():
            m = await _lesen(ws, LESE_TIMEOUT_S)
            jetzt = time.monotonic()
            fenster.append(jetzt)
            while fenster and jetzt - fenster[0] > NACHRICHTEN_FENSTER[1]:
                fenster.popleft()
            if len(fenster) > NACHRICHTEN_FENSTER[0]:
                await _fehler(ws, "Zu viele Nachrichten. Die Verbindung wird beendet.", True)
                return
            if m is None:
                await _fehler(ws, "Ungültige Nachricht.")
                continue
            t = m["t"]
            if t == "ping":
                await ws.send_text('{"t":"pong"}')
                continue
            if sid not in _sitz:
                return
            fehler = None
            if rolle == "schueler":
                if t == "antwort":
                    fehler = _antwort(sid, nr, m)
                else:
                    fehler = "Unbekannte Nachricht."
            elif rolle == "lehrer":
                if t == "aktivitaet":
                    fehler = _aktivitaet_anlegen(sid, m)
                elif t in ("zeigen", "schliessen", "verbergen", "loesung"):
                    fehler = _steuern(sid, m)
                elif t == "beenden":
                    code = m.get("code")
                    if not isinstance(code, str) or _finde(code) != sid:
                        fehler = "Der Code stimmt nicht."
                    else:
                        await loesche(sid, "lehrkraft")
                        continue
                else:
                    fehler = "Unbekannte Nachricht."
            else:
                fehler = "Die Wand kann nichts steuern."
            if fehler:
                await _fehler(ws, fehler)
                continue
            s = _sitz.get(sid)
            if s is not None:
                s.zuletzt = _jetzt()
                s.signal.wecken()
            del s
    except (WebSocketDisconnect, asyncio.TimeoutError, RuntimeError):
        pass
    finally:
        if sender is not None:
            sender.cancel()
        if sid is not None:
            n = _verbindungen.get(sid, 0) - 1
            if n > 0 and sid in _sitz:
                _verbindungen[sid] = n
            else:
                _verbindungen.pop(sid, None)
        _verb_gesamt -= 1
        n = _ip_verbindungen.get(ip, 1) - 1
        if n > 0:
            _ip_verbindungen[ip] = n
        else:
            _ip_verbindungen.pop(ip, None)


async def _anmelden(ws, ip):
    """Erste Nachricht: neu | lehrer | wand | beitritt | wieder | nachweis. Gibt (sid, rolle, nr, token) oder (None, ..) zurueck."""
    await aufraeumen()
    _reaper_sichern()
    fehler_hier = 0
    for _ in range(8):                                   # vor der Anmeldung nur wenige Nachrichten, kein Dauerbetrieb
        m = await _lesen(ws, ERSTE_NACHRICHT_S)
        if m is None:
            await _fehler(ws, "Ungültige Nachricht.", True)
            return None, None, None, None
        t = m["t"]
        if t == "neu":
            return await _neu(ws, ip)
        if _gesperrt(ip):
            await _fehler(ws, "Zu viele falsche Eingaben von diesem Anschluss. Warte etwa zehn Minuten und versuche es dann noch einmal.", True, 1013)
            return None, None, None, None
        code = _norm(m.get("code"))
        sid = _finde(code)
        gut = False
        if t == "nachweis":
            nw = _nachweise.get(_sid(code)) if isinstance(code, str) and CODE_MUSTER.match(code) else None
            if nw and nw[1] > _jetzt():
                await ws.send_text(json.dumps({"t": "ende", "nachweis": nw[0]}))
                await ws.close(code=1000)
                return None, None, None, None
        elif t in ("lehrer", "wand"):
            gut = sid is not None and _lehrer_ok(sid, m.get("schluessel"))
            if gut:
                return sid, "lehrer" if t == "lehrer" else "wand", None, None
        elif t == "beitritt":
            if sid is not None:
                nr, token, text = _beitreten(sid)
                if nr is None:
                    await _fehler(ws, text, True, 1013)
                    return None, None, None, None
                return sid, "schueler", nr, token
        elif t == "wieder":
            if sid is not None:
                nr = _wiedererkennen(sid, m.get("token"))
                if nr is not None:
                    return sid, "schueler", nr, None
        else:
            await _fehler(ws, "Unbekannte Nachricht.", True)
            return None, None, None, None
        _fehlversuch(ip)
        fehler_hier += 1
        await asyncio.sleep(FEHLVERSUCH_PAUSE_S)
        if fehler_hier >= FEHLVERSUCHE_JE_VERBINDUNG:
            await _fehler(ws, "Code oder Schlüssel stimmen nicht. Die Verbindung wird beendet.", True)
            return None, None, None, None
        await _fehler(ws, "Diesen Code gibt es nicht (mehr) oder der Schlüssel stimmt nicht.")
    await _fehler(ws, "Zu viele Versuche. Die Verbindung wird beendet.", True)
    return None, None, None, None


def _beitreten(sid: str):
    """Neue Person aufnehmen. Gibt (Nr, Wiederverbindungs-Schluessel, Fehlertext) zurueck."""
    s = _sitz.get(sid)
    if s is None:
        return None, "", "Die Sitzung ist beendet."
    if len(s.teilnehmer) >= MAX_TEILNEHMER:
        return None, "", "Die Sitzung ist voll (höchstens %d Personen)." % MAX_TEILNEHMER
    nr = max(s.teilnehmer, default=0) + 1
    name = _pseudonym({t.name for t in s.teilnehmer.values()})
    token = secrets.token_hex(16)
    s.teilnehmer[nr] = Teilnehmer(name, bytearray(_digest(token)))
    s.zuletzt = _jetzt()
    s.signal.wecken()
    return nr, token, ""


def _wiedererkennen(sid: str, token):
    s = _sitz.get(sid)
    if s is None or not isinstance(token, str) or not 8 <= len(token) <= 64:
        return None
    d = _digest(token)
    for nr, t in s.teilnehmer.items():
        if _gleich(t.token, d):
            return nr
    return None


async def _neu(ws, ip):
    """Lehrkraft legt eine Sitzung an. Antwort: Code und Lehrer-Schluessel (nur dieses eine Mal)."""
    if _roh_oeffentlich() and begrenzt(ws, "klasse-neu", int(umgebung_zahl("KL_KLASSE_NEU_JE_10MIN", 6)), 600):
        await _fehler(ws, "Du hast gerade mehrere Sitzungen angelegt. Warte ein paar Minuten.", True, 1013)
        return None, None, None, None
    if len(_sitz) >= MAX_SITZUNGEN:
        await _fehler(ws, "Gerade laufen so viele Sitzungen, wie der Rechner tragen kann (%d). Versuche es in einigen Minuten noch einmal." % MAX_SITZUNGEN, True, 1013)
        return None, None, None, None
    if len(_ip_sitzungen.get(ip, ())) >= MAX_SITZUNGEN_JE_IP:
        await _fehler(ws, "Von diesem Anschluss laufen schon %d Sitzungen. Beende eine, bevor du eine neue startest." % MAX_SITZUNGEN_JE_IP, True, 1013)
        return None, None, None, None
    for _ in range(50):
        code = "".join(secrets.choice(CODE_ZEICHEN) for _ in range(CODE_LAENGE))
        sid = _sid(code)
        if sid not in _sitz:
            break
    else:                                                          # pragma: no cover
        await _fehler(ws, "Es konnte kein Code erzeugt werden.", True, 1013)
        return None, None, None, None
    schluessel = secrets.token_hex(16)
    _sitz[sid] = Sitzung(sid, code, _digest(schluessel), ip)
    _ip_sitzungen.setdefault(ip, set()).add(sid)
    _waechter_einhaengen()
    await ws.send_text(json.dumps({"t": "erstellt", "code": code, "schluessel": schluessel, "max_teilnehmer": MAX_TEILNEHMER,
                                   "max_laufzeit_s": int(MAX_LAUFZEIT_S), "max_ruhe_s": int(MAX_RUHE_S)}))
    return sid, "lehrer", None, None
