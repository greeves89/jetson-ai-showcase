"""Gemeinsame Schutzfunktionen fuer die Labor-Module (app/lab_*.py).

Die Haupt-App (app.py) hat dieselben Regeln selbst. Neue Module importieren sie von hier:
    from app.sicherheit import origin_ok, begrenzt
"""
import threading
import time
from urllib.parse import urlparse


def origin_ok(headers) -> bool:
    """Zustandsaendernde Endpunkte verlangen einen Origin-Header, der zum Host passt.
    Browser senden ihn bei POST und WebSocket immer. Fehlt er, wird abgelehnt."""
    origin = headers.get("origin")
    host = headers.get("host", "")
    if not origin or not host:
        return False
    try:
        return urlparse(origin).netloc == host
    except Exception:
        return False


_lock = threading.Lock()
_fenster = {}   # (schluessel, kennung) -> Liste von Zeitstempeln


def client_kennung(request) -> str:
    """Kennung des Aufrufers. Hinter Cloudflare steht die echte Adresse in CF-Connecting-IP."""
    h = request.headers
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
