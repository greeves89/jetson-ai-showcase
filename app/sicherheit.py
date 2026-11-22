"""Gemeinsame Schutzfunktionen fuer die Labor-Module (app/lab_*.py).

Die Haupt-App (app.py) hat dieselben Regeln selbst. Neue Module importieren sie von hier:
    from app.sicherheit import origin_ok, begrenzt
"""
import asyncio
import os
import secrets
import threading
import time
from collections import deque
from urllib.parse import urlparse


def umgebung_zahl(name: str, standard: float, minimum: float = 1.0) -> float:
    """Liest eine Zahl aus der Umgebung (z. B. LLM_PARALLEL); ungueltige oder zu kleine Werte ergeben den Standard."""
    try:
        w = float(os.environ.get(name, ""))
        return w if w >= minimum else standard
    except ValueError:
        return standard


def _proxy_echt(headers) -> bool:
    """True, wenn die Anfrage den gemeinsamen Schluessel des eigenen Proxys (KL_PROXY_KEY) im Header X-KL-Proxy traegt."""
    schluessel = os.environ.get("KL_PROXY_KEY", "").strip()
    return bool(schluessel) and secrets.compare_digest(headers.get("x-kl-proxy", ""), schluessel)


def origin_ok(headers) -> bool:
    """Zustandsaendernde Endpunkte verlangen einen Origin-Header, der zum Host passt.
    Browser senden ihn bei POST und WebSocket immer. Fehlt er, wird abgelehnt."""
    origin = headers.get("origin")
    host = headers.get("host", "")
    if not origin or not host:
        return False
    try:
        netloc = urlparse(origin).netloc
        if netloc == host:
            return True
        # Hinter dem eigenen Proxy sieht die App die Transportadresse als Host; der Browser sendet die oeffentliche.
        # Nur akzeptieren, wenn der Proxy sich mit dem gemeinsamen Schluessel ausweist.
        if _proxy_echt(headers):
            return netloc == headers.get("x-forwarded-host", "")
        return False
    except Exception:
        return False


_lock = threading.Lock()
_fenster = {}   # (schluessel, kennung) -> Liste von Zeitstempeln


def client_kennung(request) -> str:
    """Kennung des Aufrufers. Hinter Cloudflare steht die echte Adresse in CF-Connecting-IP."""
    h = request.headers
    if _proxy_echt(h) and h.get("x-real-ip"):
        return h.get("x-real-ip")       # echte Besucheradresse, vom eigenen Proxy gesetzt
    return h.get("cf-connecting-ip") or (request.client.host if request.client else "?")


def begrenzt(request, schluessel: str, maximal: int, fenster_s: float = 60.0) -> bool:
    """True, wenn der Aufrufer sein Limit fuer `schluessel` ueberschritten hat (einfaches Zeitfenster im Speicher)."""
    jetzt = time.time()
    k = (schluessel, client_kennung(request))
    with _lock:
        liste = [t for t in _fenster.get(k, []) if jetzt - t < fenster_s]
        if len(liste) >= maximal:
            _fenster[k] = liste
            return True
        liste.append(jetzt)
        _fenster[k] = liste
        if len(_fenster) > 5000:                       # Speicher begrenzen
            for alt in [x for x, v in _fenster.items() if not v or jetzt - v[-1] > fenster_s][:2500]:
                _fenster.pop(alt, None)
    return False


class Sitzungen:
    """Zustand je Besucher (Cookie kl_s), mit Ablauf und Obergrenze: so teilen sich Besucher keine
    Anlern-Beispiele oder RAG-Texte, und der Speicher waechst nicht unbegrenzt."""

    def __init__(self, ttl_s: float = 1800.0, maximal: int = 200):
        self.ttl_s, self.maximal = ttl_s, maximal
        self._d = {}
        self._l = threading.Lock()

    def holen(self, kennung: str) -> dict:
        jetzt = time.time()
        with self._l:
            for k in [k for k, v in self._d.items() if jetzt - v["zuletzt"] > self.ttl_s]:
                del self._d[k]
            z = self._d.get(kennung)
            if z is None:
                if len(self._d) >= self.maximal:
                    del self._d[min(self._d, key=lambda k: self._d[k]["zuletzt"])]
                z = {"teach": {}, "rag": [], "zuletzt": jetzt}
                self._d[kennung] = z
            z["zuletzt"] = jetzt
            return z


def sitzungs_kennung(request) -> str:
    """Kennung der Sitzung: Cookie kl_s (von der Startseite gesetzt), sonst die Adresse des Aufrufers."""
    c = request.cookies.get("kl_s")
    if c and 16 <= len(c) <= 64 and c.isalnum():
        return c
    return "ip-" + client_kennung(request)


class Belegt(Exception):
    """Die Warteschlange ist voll oder die Wartezeit ist abgelaufen."""

    def __init__(self, grund: str):
        super().__init__(grund)
        self.grund = grund      # "voll" oder "zeit"


class Warteschlange:
    """Faire Warteschlange (FIFO) vor einer knappen Ressource, hier die Sprachmodelle auf dem Jetson.

    - `parallel` Plaetze laufen gleichzeitig, alle weiteren warten der Reihe nach (hoechstens `max_wartend`, hoechstens
      `max_warten_s` Sekunden). Wer nicht mehr hineinpasst, bekommt sofort `Belegt("voll")`.
    - `stand(kennung)` liefert Belegung und die Platznummer dieses Besuchers (1 = naechster), damit die Oberflaeche
      "Du bist Nr. 2" zeigen kann, ohne dass der Antwortstrom selbst etwas Besonderes enthaelt.
    Nutzung:  async with schlange.platz(kennung): ...  (Platz wird auch bei Abbruch und Fehlern freigegeben).
    Gedacht fuer einen Ereignisschleifen-Prozess (uvicorn ohne mehrere Worker)."""

    def __init__(self, parallel: int = 2, max_wartend: int = 6, max_warten_s: float = 90.0):
        self.parallel, self.max_wartend, self.max_warten_s = max(1, int(parallel)), max(0, int(max_wartend)), float(max_warten_s)
        self._aktiv = 0
        self._warteliste = deque()          # (kennung, Future) in Ankunftsreihenfolge

    # --- Auskunft
    @property
    def aktiv(self) -> int:
        return self._aktiv

    @property
    def wartend(self) -> int:
        return len(self._warteliste)

    def voll(self) -> bool:
        """True, wenn ein weiterer Besucher weder einen Platz noch einen Warteplatz bekaeme."""
        return self._aktiv >= self.parallel and len(self._warteliste) >= self.max_wartend

    def position(self, kennung: str) -> int:
        """Platznummer in der Warteliste (1 = als naechster dran), 0 = wartet nicht."""
        for i, (k, f) in enumerate(self._warteliste):
            if k == kennung and not f.done():
                return i + 1
        return 0

    def stand(self, kennung: str = "") -> dict:
        pos = self.position(kennung) if kennung else 0
        return {"aktiv": self._aktiv, "wartend": len(self._warteliste), "parallel": self.parallel,
                "max_wartend": self.max_wartend, "meine_position": pos, "frei": self._aktiv < self.parallel and not self._warteliste}

    # --- Platz belegen und freigeben
    def _weiter(self):
        while self._warteliste and self._aktiv < self.parallel:
            _, f = self._warteliste.popleft()
            if not f.done():
                self._aktiv += 1
                f.set_result(True)

    async def betreten(self, kennung: str) -> None:
        if self._aktiv < self.parallel and not self._warteliste:
            self._aktiv += 1
            return
        if len(self._warteliste) >= self.max_wartend:
            raise Belegt("voll")
        f = asyncio.get_running_loop().create_future()
        eintrag = (kennung, f)
        self._warteliste.append(eintrag)
        try:
            await asyncio.wait_for(asyncio.shield(f), self.max_warten_s)
        except asyncio.TimeoutError:
            if f.done() and not f.cancelled():      # Platz kam im selben Augenblick: behalten
                return
            self._austragen(eintrag, f)
            raise Belegt("zeit")
        except BaseException:                         # Abbruch (Besucher weg): Platz zurueckgeben bzw. austragen
            if f.done() and not f.cancelled():
                self.freigeben()
            else:
                self._austragen(eintrag, f)
            raise

    def _austragen(self, eintrag, f):
        try:
            self._warteliste.remove(eintrag)
        except ValueError:
            pass
        if not f.done():
            f.cancel()

    def freigeben(self) -> None:
        self._aktiv = max(0, self._aktiv - 1)
        self._weiter()

    def platz(self, kennung: str):
        return _Platz(self, kennung)


class _Platz:
    def __init__(self, schlange: Warteschlange, kennung: str):
        self._s, self._k = schlange, kennung

    async def __aenter__(self):
        await self._s.betreten(self._k)
        return self

    async def __aexit__(self, *exc):
        self._s.freigeben()
        return False
