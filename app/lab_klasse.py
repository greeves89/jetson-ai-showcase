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
import warnings
import weakref
from collections import deque
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs

from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse

import ipaddress

from app.sicherheit import _proxy_echt, begrenzt, origin_ok, umgebung_zahl

router = APIRouter()

# ---------------------------------------------------------------------------------------------------- Grenzen
CODE_ZEICHEN = "ACDEFGHJKMNPQRTWXYZ346789"       # 25 Zeichen ohne Verwechselbares (0/O, 1/I/L, 2/Z gibt es nur als Z, 5/S, 8/B ...)
CODE_LAENGE = 8                                   # 25^8 = 1,5 * 10^11 Codes, Anzeige in Vierergruppen (ABCD-EFGH)
MAX_SITZUNGEN = int(umgebung_zahl("KL_KLASSE_MAX_SITZUNGEN", 20))
MAX_TEILNEHMER = int(umgebung_zahl("KL_KLASSE_MAX_TEILNEHMER", 40))
MAX_LAUFZEIT_S = umgebung_zahl("KL_KLASSE_MAX_LAUFZEIT_S", 7200, 5)       # 2 Stunden
MAX_RUHE_S = umgebung_zahl("KL_KLASSE_MAX_RUHE_S", 1200, 2)               # 20 Minuten ohne Aktion
MAX_AKTIVITAETEN = 30
MAX_NACHRICHT = 1024                              # Zeichen je WebSocket-Nachricht
MAX_VERBINDUNGEN = int(umgebung_zahl("KL_KLASSE_MAX_VERBINDUNGEN", 500))
MAX_VERB_JE_IP = 60                               # eine Klasse hinter einer Schuladresse: 40 plus Lehrkraft und Wand
MAX_SITZUNGEN_JE_IP = 3
BEITRITTE_JE_ADRESSE = 3                          # Standard; die Lehrkraft kann fuer ein Schulnetz auf 10 oder 40 erhoehen
PREAUTH_JE_IP = 10                                # noch nicht angemeldete Verbindungen je Adresse (eine Klasse hinter einer Adresse tritt oft gleichzeitig bei)
PREAUTH_GESAMT = 200                              # und insgesamt. Jede kann bis ws-max-size (2,1 MB) Speicher belegen: 200 * 2,1 MB = 420 MB Worst Case, siehe docs
PREAUTH_ZEIT_S = 10.0                             # so lange hat eine Verbindung Zeit bis zur ersten gueltigen Nachricht
VERSUCHE_JE_MINUTE = int(umgebung_zahl("KL_KLASSE_VERSUCHE_MINUTE", 20))     # Beitritte und falsche Versuche je Netzbereich und Minute, auch mit richtigem Code
MIN_ANTWORTEN = 3                                 # kleine-Zahlen-Schutz
MIN_FUER_MITTEL = 5                               # Mittelwert und Median erst ab so vielen Antworten, nie bei verdeckten Feldern
FEHLVERSUCHE_JE_IP = 15                           # falsche Codes oder Schluessel je 10 Minuten, danach Sperre
FEHLVERSUCHE_FENSTER_S = 600.0
FEHLVERSUCH_PAUSE_S = 0.8                         # jede falsche Eingabe wird um diese Zeit gebremst
FEHLVERSUCHE_JE_VERBINDUNG = 1                  # nach dem ersten Falschversuch: Bremse, Meldung, Verbindung schliessen
GLOBAL_PAUSE_S = 2.0                              # Bremse fuer falsche Versuche waehrend der globalen Sperre
GLOBAL_FEHLVERSUCHE_MINUTE = int(umgebung_zahl("KL_KLASSE_GLOBAL_MINUTE", 30))     # alle Adressen zusammen
GLOBAL_FEHLVERSUCHE_STUNDE = int(umgebung_zahl("KL_KLASSE_GLOBAL_STUNDE", 300))
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
PRUEF_FRIST_S = 30 * 86400                        # so lange bestaetigt der Dienst die Signatur
ANLAESSE = {"lehrkraft": "Lehrkraft", "zeit": "Höchstdauer 2 Stunden", "ruhe": "Inaktiv (20 Minuten)", "test": "Test"}
ARTEN = ("wahl", "skala", "schaetzung")
REF_MUSTER = re.compile(r"[a-z0-9:_-]{0,48}")                       # immer mit fullmatch (kein "$": das liesse "jn\n" durch)
CODE_MUSTER = re.compile(r"[" + CODE_ZEICHEN + r"]{" + str(CODE_LAENGE) + r"}")
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


def _nicht_eingerichtet() -> bool:
    """Oeffentlich (OEFFENTLICH=1) ohne KL_PROXY_KEY sieht der Dienst hinter dem Tunnel nur eine Adresse, alle Besucher teilten
    sich Sperre und Obergrenzen. Dann laeuft der Klassenmodus nicht, statt still falsch zuzuordnen."""
    return os.environ.get("OEFFENTLICH") == "1" and not os.environ.get("KL_PROXY_KEY", "").strip()


if _nicht_eingerichtet():
    warnings.warn("Klassenmodus nicht eingerichtet: OEFFENTLICH=1, aber KL_PROXY_KEY fehlt. Sitzungen werden abgelehnt. "
                  "Siehe docs/betrieb-sicherheit.md.", RuntimeWarning)


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
                 "log_treffer", "ip_beitritte", "je_ip_max", "__weakref__")

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
        self.ip_beitritte = {}                        # Adress-Kurzhash -> Zahl der Beitritte (nie weniger, auch nach dem Verlassen)
        self.je_ip_max = BEITRITTE_JE_ADRESSE


_sitz = {}              # Register 1: Sitzungskennung (HMAC des Codes) -> Sitzung
_ip_sitzungen = {}      # Register 2: Adress-Kurzhash -> Menge von Sitzungskennungen
_verbindungen = {}      # Register 3: Sitzungskennung -> Zahl offener Verbindungen
class _Vorab:
    """Eine noch nicht angemeldete Verbindung. frei() gibt ihren Platz zurueck (einmal): bei Anmeldung, beim Ende und bevor ein
    Falschversuch gebremst wird, damit schlafende Falschversuche die Vorab-Grenze ehrlicher Besucher nicht fuellen."""
    __slots__ = ("aktiv", "ip")

    def __init__(self, ip):
        self.aktiv, self.ip = True, ip
        _vorab_gesamt[0] += 1
        _vorab_ip[ip] = _vorab_ip.get(ip, 0) + 1

    def frei(self):
        if not self.aktiv:
            return
        self.aktiv = False
        _vorab_gesamt[0] -= 1
        n = _vorab_ip.get(self.ip, 1) - 1
        if n > 0:
            _vorab_ip[self.ip] = n
        else:
            _vorab_ip.pop(self.ip, None)


_vorab_gesamt = [0]     # noch nicht angemeldete Verbindungen insgesamt
_vorab_ip = {}          # und je Adresse
_fehlerlog = logging.getLogger("uvicorn.error")
_ip_verbindungen = {}   # Adress-Kurzhash -> offene Verbindungen
_versuche = {}          # Adress-Kurzhash -> Zeitstempel der Beitritts- und Fehlversuche (gleitendes Fenster, 60 s)
_fehlversuche = {}      # Adress-Kurzhash -> deque von Zeitstempeln
_global_fehl = deque()  # Zeitstempel aller Fehlversuche (ohne Adresse), Obergrenze fuer verteiltes Raten
_nachweise = {}         # Sitzungskennung -> (Protokolltext, Ablaufzeit). Nur Zahlen, Hash und Prueferergebnisse.
_beendet = 0            # seit Start des Dienstes gelöschte Sitzungen
_verb_gesamt = 0
_reaper = {"task": None, "loop": None}
_scan_sperre = asyncio.Semaphore(1)


def _quell_ip(anfrage) -> str:
    """Adresse des Aufrufers. Forwarded-Header (X-Real-IP) zaehlen NUR, wenn die Anfrage den gemeinsamen Schluessel des eigenen
    Proxys traegt (KL_PROXY_KEY, wie in app/sicherheit.py). Sonst gilt die Adresse der direkten Verbindung. CF-Connecting-IP und
    X-Forwarded-For werden hier nie ausgewertet: ein Besucher koennte sie frei waehlen und so die Sperre umgehen."""
    roh = None
    if _proxy_echt(anfrage.headers):
        roh = anfrage.headers.get("x-real-ip", "").strip()
    if not roh:
        roh = anfrage.client.host if anfrage.client else "?"
    try:
        a = ipaddress.ip_address(roh)
    except ValueError:
        return roh
    if a.version == 6:                                 # IPv6: ein Anschluss hat ein ganzes /64, darum zaehlt der Netzbereich
        return str(ipaddress.ip_network((a, 64), strict=False))
    return str(a)


def _ip_tag(anfrage) -> str:
    return hmac.new(_K_IP, _quell_ip(anfrage).encode(), hashlib.sha256).hexdigest()[:12]


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
    if unter:
        # Ergaenzende Verdeckung: Wer die Gesamtzahl kennt (der Fortschritt war sichtbar), darf ein verdecktes Feld nicht
        # ausrechnen koennen. Darum wird zusaetzlich das kleinste sichtbare Feld verdeckt: Die Differenz ist dann mindestens 4.
        sichtbar = [i for i, c in enumerate(aus) if c > 0]
        if sichtbar:
            aus[min(sichtbar, key=lambda i: (aus[i], i))] = -1
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
        r = {"zellen": zellen, "loesung": None}
        if not unter and gesamt >= MIN_FUER_MITTEL:
            r["mittelwert"] = round(sum(w * c for w, c in a.zaehler.items()) / gesamt, 1)
    else:
        spanne = a.hi - a.lo + 1
        k = min(8, spanne)
        breite = spanne / k
        zellen, unter = _verteilung(list(range(k)), a.zaehler, lambda w: min(k - 1, int((w - a.lo) / breite)))
        grenzen = [round(a.lo + i * breite) for i in range(k)] + [a.hi]
        r = {"zellen": zellen, "grenzen": grenzen, "loesung": a.loesung}
        if not unter and gesamt >= MIN_FUER_MITTEL:
            folge = sorted(w for w, c in a.zaehler.items() for _ in range(c))
            r["median"] = folge[len(folge) // 2] if len(folge) % 2 else (folge[len(folge) // 2 - 1] + folge[len(folge) // 2]) / 2
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
            if not a.zeigen:                               # nur waehrend der Aufgabe, nie neben dem Ergebnis
                akt["antworten"] = len(a.beantwortet)
        if a.zeigen:
            akt["ergebnis"] = _ergebnis(a)
    d = {"t": "stand", "rolle": rolle, "teilnehmer": len(s.teilnehmer), "max_teilnehmer": MAX_TEILNEHMER, "je_adresse": s.je_ip_max,
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
    s.ip_beitritte.clear()
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
            "Sitzung: " + felder["code_hash"],
            "Start (UTC): " + _utc(felder["start"]), "Ende (UTC): " + _utc(felder["ende"]),
            "Prüfbar bis (UTC): " + _utc(felder["ende"] + PRUEF_FRIST_S),
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
    code_hash = hashlib.sha256(nadeln[0]).hexdigest()       # steht als "Sitzung" im Protokoll: die Lehrkraft kann es nachrechnen
    nadeln.append(nadeln[0].lower())
    gruppe = nadeln[0][:4] + b"-" + nadeln[0][4:]
    nadeln += [gruppe, gruppe.lower()]
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
    async with _scan_sperre:                              # immer nur ein Durchlauf, sonst koennten viele Loeschungen den Rechner binden
        treffer, dateien, gelesen, voll = await asyncio.to_thread(_scan, nadeln, _scan_wurzeln())
    del nadeln, code_text
    if treffer:
        p4 = "nicht bestanden"
    else:
        p4 = "bestanden" if voll else "teilweise geprüft"
    p4txt = "Suche nach Code und Sitzungskennung in Dateien und Protokolldateien des Dienstes (%d Dateien, %d KB gelesen)" % (dateien, gelesen // 1024)
    ja = lambda b: "bestanden" if b else "nicht bestanden"           # noqa: E731
    felder = {"code_hash": code_hash, "start": start, "ende": ende, "anlass": ANLAESSE.get(anlass, anlass),
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
    """Eingabe tolerant: Leerzeichen, Bindestriche und Kleinbuchstaben (ABCD-efgh), sonst unveraendert."""
    if isinstance(code, str) and len(code) <= 40:
        return re.sub(r"[\s-]", "", code).upper()
    return code


def _finde(code: str):
    """Sitzungskennung zu einem Code, falls es die Sitzung gibt (sonst None)."""
    code = _norm(code)
    if not isinstance(code, str) or not CODE_MUSTER.fullmatch(code):
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
_ZEIT = re.compile(r"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ")
_PRUEF = re.compile(r"Prüfung (\d+), (.{1,200}): (bestanden|nicht bestanden|teilweise geprüft|nicht geprüft)")


PROTOKOLL_SCHLUESSEL = ("Format", "Sitzung", "Start (UTC)", "Ende (UTC)", "Prüfbar bis (UTC)", "Anlass", "Teilnehmende gelöscht",
                        "Antworten gelöscht", "Aktivitäten gelöscht", "Aktive Sitzungen danach", "Dienstversion", "Schlüsselart",
                        "Schlüsselkennung")


def pruefe_nachweis(roh, code=None) -> dict:
    """Prueft Format und Signatur eines Loeschprotokolls (streng: feste Zeilen, Signatur als letzte Zeile, nichts danach).
    `code` (optional): der Sitzungscode, dessen SHA-256 im Protokoll stehen muss. Speichert nichts."""
    leer = {"format": "ungültig", "signatur": "ungültig", "felder": {}, "pruefungen": [], "alle_bestanden": False}
    if not isinstance(roh, str) or len(roh) > 6000:
        return dict(leer, fehler=["Das Protokoll fehlt oder ist zu lang."])
    text = roh.replace("\r\n", "\n").replace("\r", "\n").strip("\n ") + "\n"
    zeilen = text.split("\n")[:-1]
    fehler, felder, pruefungen = [], {}, []
    if not zeilen or zeilen[0] != "KI-Labor Klassenmodus: Löschprotokoll":
        fehler.append("Die erste Zeile stimmt nicht.")
    sigzeilen = [z for z in zeilen if z.startswith("Signatur: ")]
    if len(sigzeilen) != 1 or not zeilen or zeilen[-1] != sigzeilen[0]:
        fehler.append("Die Signatur muss genau einmal und als letzte Zeile stehen.")
    for z in zeilen[1:]:
        if z.startswith("Signatur: "):
            continue
        m = _PRUEF.fullmatch(z)
        if m:
            pruefungen.append((int(m.group(1)), m.group(2), m.group(3)))
        elif ": " in z:
            k, v = z.split(": ", 1)
            if k in felder or k not in PROTOKOLL_SCHLUESSEL:
                fehler.append("Unbekannte oder doppelte Zeile: " + k[:40])
            felder[k] = v
        else:
            fehler.append("Unbekannte Zeile.")
    # feste Reihenfolge: genau die erwarteten Schluessel, dazwischen die fuenf Pruefungen nach "Aktivitäten gelöscht"
    gesehen = [z.split(": ", 1)[0] for z in zeilen[1:] if not z.startswith(("Signatur: ", "Prüfung "))]
    if gesehen != list(PROTOKOLL_SCHLUESSEL):
        fehler.append("Die Zeilen sind unvollständig oder in falscher Reihenfolge.")
    if felder.get("Format") != FORMAT:
        fehler.append("Unbekanntes Format.")
    if not re.fullmatch(r"[0-9a-f]{64}", felder.get("Sitzung", "")):
        fehler.append("Feld ungültig: Sitzung")
    for k in ("Start (UTC)", "Ende (UTC)", "Prüfbar bis (UTC)"):
        if not _ZEIT.fullmatch(felder.get(k, "")):
            fehler.append("Feld ungültig: " + k)
    if not fehler and not (felder["Start (UTC)"] <= felder["Ende (UTC)"] <= felder["Prüfbar bis (UTC)"]):
        fehler.append("Die Zeiten sind nicht in Reihenfolge.")
    if felder.get("Anlass") not in ANLAESSE.values():
        fehler.append("Feld ungültig: Anlass")
    for k in ("Teilnehmende gelöscht", "Antworten gelöscht", "Aktivitäten gelöscht", "Aktive Sitzungen danach"):
        v = felder.get(k, "")
        if not (v.isascii() and v.isdigit()) or len(v) > 7:
            fehler.append("Feld ungültig: " + k)
    if [n for n, _, _ in pruefungen] != list(range(1, len(pruefungen) + 1)) or len(pruefungen) != 5:
        fehler.append("Es müssen genau fünf Prüfungen in Reihenfolge stehen.")
    if not re.fullmatch(r"[0-9a-f]{8}", felder.get("Schlüsselkennung", "")):
        fehler.append("Feld ungültig: Schlüsselkennung")
    for k in ("Dienstversion", "Schlüsselart"):
        if not felder.get(k) or len(felder[k]) > 120:
            fehler.append("Feld ungültig: " + k)
    sig = sigzeilen[0][len("Signatur: "):] if len(sigzeilen) == 1 else ""
    sig_ok = False
    andere_kennung = False
    if re.fullmatch(r"[0-9a-f]{64}", sig) and text.endswith("Signatur: " + sig + "\n"):
        koerper = text[: -len("Signatur: " + sig + "\n")]
        sig_ok = hmac.compare_digest(_signiere(koerper), sig)
        andere_kennung = felder.get("Schlüsselkennung") != SCHLUESSEL_KENNUNG
    else:
        fehler.append("Feld ungültig: Signatur")
    format_ok = not fehler
    abgelaufen = bool(format_ok and felder["Prüfbar bis (UTC)"] < _utc(_jetzt()))
    antwort = {"format": "gültig" if format_ok else "ungültig", "signatur": "gültig" if sig_ok else "ungültig", "abgelaufen": abgelaufen,
               "fehler": fehler[:8], "alle_bestanden": bool(pruefungen) and all(e == "bestanden" for _, _, e in pruefungen),
               "felder": {k: felder.get(k, "") for k in PROTOKOLL_SCHLUESSEL if k not in ("Format", "Schlüsselkennung")},
               "pruefungen": [{"nr": n, "text": t, "ergebnis": e} for n, t, e in pruefungen]}
    if sig_ok and abgelaufen:
        antwort["signatur"] = "abgelaufen"
    if code is not None and code != "":
        c = _norm(code)
        passt = isinstance(c, str) and hmac.compare_digest(hashlib.sha256(c.encode()).hexdigest(), felder.get("Sitzung", ""))
        antwort["code_passt"] = bool(passt)
    if not sig_ok and format_ok and andere_kennung:
        antwort["hinweis"] = ("Das Protokoll wurde mit einem anderen Schlüssel signiert als dem, den dieser Dienst gerade nutzt. "
                              "Der Dienst wurde seitdem neu gestartet, oder das Protokoll stammt von einem anderen Dienst. "
                              "Die Signatur lässt sich hier nicht mehr prüfen.")
    elif not sig_ok and format_ok:
        antwort["hinweis"] = "Das Protokoll wurde nach der Ausstellung verändert oder ist nicht von diesem Dienst."
    elif abgelaufen:
        antwort["hinweis"] = "Die Prüffrist von 30 Tagen ist abgelaufen. Eine Signatur wird danach nicht mehr bestätigt."
    return antwort


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
    return JSONResponse({"bereit": not _nicht_eingerichtet(), "aktiv": len(_sitz), "max": MAX_SITZUNGEN, "beendet_seit_start": _beendet},
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
    code = daten.get("code") if isinstance(daten, dict) and isinstance(daten.get("code"), str) and len(daten["code"]) <= 20 else None
    return JSONResponse(pruefe_nachweis(text, code), headers={"Cache-Control": "no-store"})


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
<p><label>Code der Sitzung (freiwillig, prüft, ob das Protokoll zu dieser Sitzung gehört): <input name="code" maxlength="20" autocomplete="off" value="%CODE%"></label></p>
<p><button type="submit">Prüfen</button></p></form>
%ERGEBNIS%
<div class="box"><b>Was die Prüfung aussagt.</b> Die Signatur belegt, dass dieser Dienst das Protokoll ausgestellt hat und dass seitdem nichts daran geändert wurde.
Sie belegt nicht allein, dass die Löschung stattgefunden hat: Die Einzelprüfungen im Protokoll hat der Dienst selbst gefahren.
Außerhalb der Anwendung fallen trotzdem Zugriffsdaten an (siehe die Seite zum Klassenmodus).</div>
</main></body></html>"""


def _ergebnis_html(a: dict) -> str:
    e = html.escape
    ok = a["format"] == "gültig" and a["signatur"] == "gültig" and a.get("code_passt", True)
    teile = ['<div class="box"><b class="%s">%s</b>' % ("ok" if ok else "bad",
             "Format und Signatur sind gültig." if ok else "Das Protokoll ist nicht gültig.")]
    teile.append("<p>Format: %s. Signatur: %s.</p>" % (e(a["format"]), e(a["signatur"])))
    if "code_passt" in a:
        teile.append("<p>%s</p>" % ("Der Code gehört zu diesem Protokoll." if a["code_passt"] else "Der Code passt nicht zu diesem Protokoll."))
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
    return HTMLResponse(_SEITE.replace("%TEXT%", "").replace("%CODE%", "").replace("%ERGEBNIS%", ""), headers={"Cache-Control": "no-store"})


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
    formular = parse_qs(roh)
    text = (formular.get("text") or [""])[0]
    code = (formular.get("code") or [""])[0][:20]
    antwort = pruefe_nachweis(text, code)
    return HTMLResponse(_SEITE.replace("%TEXT%", html.escape(text)).replace("%CODE%", html.escape(code, quote=True)).replace("%ERGEBNIS%", _ergebnis_html(antwort)),
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


def _rate_frei(ip: str, verbrauchen: bool = True) -> bool:
    """Gleitendes Fenster je Netzbereich: hoechstens VERSUCHE_JE_MINUTE Beitritte oder falsche Versuche je Minute, auch bei
    GUELTIGEM Code. So bleibt das Raten je Adresse auf diese Rate begrenzt, eine Klasse (40 Kinder in wenigen Minuten) geht durch.
    Lehrer-, Wand- und Wiederverbindungs-Schluessel (128 Bit) sind ausgenommen, solange sie stimmen."""
    jetzt = _jetzt()
    d = _versuche.setdefault(ip, deque())
    while d and jetzt - d[0] > 60:
        d.popleft()
    if len(d) >= VERSUCHE_JE_MINUTE:
        return False
    if verbrauchen:
        d.append(jetzt)
    if len(_versuche) > 5000:
        for k in [k for k, v in _versuche.items() if not v or jetzt - v[-1] > 60][:2500]:
            _versuche.pop(k, None)
    return True


def _global_gesperrt() -> bool:
    """True, wenn alle Adressen zusammen zu viele falsche Codes oder Schluessel geschickt haben (verteiltes Raten).
    Wirkt nur auf falsche Versuche (Verzoegerung, Abbruch der Verbindung), nie auf richtige Codes oder Schluessel."""
    jetzt = _jetzt()
    while _global_fehl and jetzt - _global_fehl[0] > 3600:
        _global_fehl.popleft()
    if len(_global_fehl) >= GLOBAL_FEHLVERSUCHE_STUNDE:
        return True
    return sum(1 for x in _global_fehl if jetzt - x <= 60) >= GLOBAL_FEHLVERSUCHE_MINUTE


def _fehlversuch(ip: str):
    _global_fehl.append(_jetzt())
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
    if not isinstance(ref, str) or not REF_MUSTER.fullmatch(ref):
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
    except (ValueError, RecursionError):                  # kaputtes oder tief verschachteltes JSON
        return None
    return m if isinstance(m, dict) and isinstance(m.get("t"), str) else None


@router.websocket("/ws/klasse")
async def ws_klasse(ws: WebSocket):
    global _verb_gesamt
    if not origin_ok(ws.headers):
        await ws.close(code=1008)
        return
    ip = _ip_tag(ws)
    if (_verb_gesamt >= MAX_VERBINDUNGEN or _ip_verbindungen.get(ip, 0) >= MAX_VERB_JE_IP
            or _vorab_gesamt[0] >= PREAUTH_GESAMT or _vorab_ip.get(ip, 0) >= PREAUTH_JE_IP):
        await ws.close(code=1013)
        return
    await ws.accept()
    _verb_gesamt += 1
    _ip_verbindungen[ip] = _ip_verbindungen.get(ip, 0) + 1
    vorab = _Vorab(ip)
    sid = None
    sender = None
    try:
        try:
            sid, rolle, nr, token = await _anmelden(ws, ip, vorab)
        finally:
            vorab.frei()
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
                elif t == "je_adresse":
                    n = _int(m.get("n"))
                    if n in (3, 10, 40):
                        s = _sitz.get(sid)
                        if s is not None:
                            s.je_ip_max = n
                        del s
                    else:
                        fehler = "Ungültiger Wert."
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
    except (WebSocketDisconnect, asyncio.TimeoutError):
        pass
    except RuntimeError as e:
        # Erwartet: Senden oder Empfangen nach dem Schliessen. Alles andere ist ein Programmfehler: nur die Fehlerklasse
        # ins Dienstprotokoll, nie Inhalte, Codes oder Namen.
        if not re.search(r"close message|disconnect|not connected", str(e), re.I):
            _fehlerlog.error("Klassenmodus: Programmfehler %s", type(e).__name__)
    except Exception as e:                               # noqa: BLE001
        _fehlerlog.error("Klassenmodus: Programmfehler %s", type(e).__name__)
    finally:
        vorab.frei()
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
        try:
            await ws.close(code=1001)                    # auch nach Zeitueberschreitung sauber schliessen
        except Exception:                                # noqa: BLE001  (schon geschlossen)
            pass


async def _anmelden(ws, ip, vorab):
    """Erste Nachricht: neu | lehrer | wand | beitritt | wieder | nachweis. Gibt (sid, rolle, nr, token) oder (None, ..) zurueck."""
    if _nicht_eingerichtet():
        await _fehler(ws, "Der Klassenmodus ist auf diesem Dienst nicht eingerichtet (der Proxy-Schlüssel fehlt). Bitte den Betreiber informieren.", True, 1013)
        return None, None, None, None
    await aufraeumen()
    _reaper_sichern()
    fehler_hier = 0
    frist = time.monotonic() + PREAUTH_ZEIT_S
    for _ in range(8):                                   # vor der Anmeldung nur wenige Nachrichten, kein Dauerbetrieb
        m = await _lesen(ws, max(0.5, frist - time.monotonic()))
        if m is None:
            await _fehler(ws, "Ungültige Nachricht.", True)
            return None, None, None, None
        t = m["t"]
        if t == "neu":
            return await _neu(ws, ip)
        verbraucht = False
        if t in ("beitritt", "nachweis"):
            # Zuerst die Rate, DANN der Code: Auch ein Treffer geht bei zu vielen Versuchen nicht durch.
            verbraucht = True
            if not _rate_frei(ip):
                await asyncio.sleep(GLOBAL_PAUSE_S)
                await _fehler(ws, "Von diesem Anschluss kommen gerade sehr viele Beitrittsversuche. Warte etwa eine Minute und versuche es dann noch einmal.", True, 1013)
                return None, None, None, None
        code = _norm(m.get("code"))
        sid = _finde(code)
        gut = False
        if t == "nachweis":
            nw = _nachweise.get(_sid(code)) if isinstance(code, str) and CODE_MUSTER.fullmatch(code) else None
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
                nr, token, text = _beitreten(sid, ip)
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
        # Falscher Versuch. Sperren (je Adresse und global) treffen NUR falsche Versuche: Ein richtiger Code, Schluessel oder
        # Wiederverbindungs-Schluessel kommt immer durch. Wer gesperrt ist, wird stark gebremst und getrennt.
        gesperrt = _gesperrt(ip)
        glob = _global_gesperrt()
        _fehlversuch(ip)
        if not verbraucht:
            _rate_frei(ip)                                # falsche Schluessel zaehlen ebenfalls gegen die Rate
        fehler_hier += 1
        # Der Vorab-Platz bleibt belegt, bis die Verbindung geschlossen wird (finally in ws_klasse) oder sich anmeldet.
        if gesperrt or glob:
            await asyncio.sleep(GLOBAL_PAUSE_S)
            await _fehler(ws, ("Zu viele falsche Eingaben von diesem Anschluss. Warte etwa zehn Minuten und versuche es dann noch einmal."
                               if gesperrt else
                               "Gerade sind viele falsche Codes eingegangen. Falsche Eingaben werden kurz abgewiesen. Prüfe den Code und versuche es noch einmal."),
                          True, 1013)
            return None, None, None, None
        await asyncio.sleep(FEHLVERSUCH_PAUSE_S)
        if fehler_hier >= FEHLVERSUCHE_JE_VERBINDUNG:
            await _fehler(ws, "Diesen Code gibt es nicht (mehr) oder der Schlüssel stimmt nicht.", True)
            return None, None, None, None
        await _fehler(ws, "Diesen Code gibt es nicht (mehr) oder der Schlüssel stimmt nicht.")
    await _fehler(ws, "Zu viele Versuche. Die Verbindung wird beendet.", True)
    return None, None, None, None


def _beitreten(sid: str, ip: str):
    """Neue Person aufnehmen. Gibt (Nr, Wiederverbindungs-Schluessel, Fehlertext) zurueck."""
    s = _sitz.get(sid)
    if s is None:
        return None, "", "Die Sitzung ist beendet."
    if len(s.teilnehmer) >= MAX_TEILNEHMER:
        return None, "", "Die Sitzung ist voll (höchstens %d Personen)." % MAX_TEILNEHMER
    if s.ip_beitritte.get(ip, 0) >= s.je_ip_max:
        return None, "", ("Von deinem Anschluss sind schon %d Geräte in dieser Sitzung. Sag es deiner Lehrkraft: Sie kann das für ein Schulnetz erhöhen." % s.je_ip_max)
    s.ip_beitritte[ip] = s.ip_beitritte.get(ip, 0) + 1
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
