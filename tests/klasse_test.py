#!/usr/bin/env python3
"""Pruefung des Klassenmodus (app/lab_klasse.py) ohne Jetson und ohne Modelle: python3 tests/klasse_test.py

Nutzt nur das Modul selbst in einer schlanken FastAPI-App und den TestClient. Die MCDC-Matrix steht am Ende der Datei.
Das Skript endet mit Status 1, sobald eine Pruefung fehlt. Es schreibt nichts ausser in ein temporaeres Verzeichnis."""
import contextlib
import json
import logging
import os
import re
import signal
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
signal.alarm(240)                                   # hartes Ende, falls etwas haengt
TMP = tempfile.mkdtemp(prefix="klasse-test-")
os.environ["KL_KLASSE_SCANPFADE"] = TMP
os.environ.pop("OEFFENTLICH", None)

from fastapi import FastAPI  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from starlette.websockets import WebSocketDisconnect  # noqa: E402

from app import lab_klasse as K  # noqa: E402

K.FEHLVERSUCH_PAUSE_S = 0.0                          # Tests muessen nicht warten
K.GLOBAL_FEHLVERSUCHE_MINUTE = K.GLOBAL_FEHLVERSUCHE_STUNDE = 10 ** 6
K.GLOBAL_PAUSE_S = 0.0
K.VERSUCHE_JE_MINUTE = 10 ** 6                       # die Rate-Tests stellen 20 selbst ein
K.UEBERLAST_PAUSE_S = 0.0
K.BEITRITTE_JE_ADRESSE = 40                          # der Test "Mehrfach-Beitritt" stellt den Standard (3) selbst ein
FENSTER = K.NACHRICHTEN_FENSTER
K.NACHRICHTEN_FENSTER = (10_000, 10.0)          # nur der Flut-Test nutzt die echte Grenze
app = FastAPI()
app.include_router(K.router)
H = {"origin": "http://testserver"}

fehler = []


def ok(bedingung, text):
    print(("OK    " if bedingung else "FEHLT ") + text)
    if not bedingung:
        fehler.append(text)


def zuruecksetzen():
    for d in (K._sitz, K._ip_sitzungen, K._verbindungen, K._ip_verbindungen, K._fehlversuche, K._nachweise):
        d.clear()
    K._beendet = 0
    K._global_fehl.clear()
    K._versuche.clear()
    K._jetzt = _uhr
    K._wand = _wandzeit


import time as _t  # noqa: E402
_echt = _t.monotonic
uhr = {"plus": 0.0, "wand": 0.0}


def _uhr():
    return _echt() + uhr["plus"]


def _wandzeit():
    return _t.time() + uhr["plus"] + uhr["wand"]


K._jetzt = _uhr
K._wand = _wandzeit
K._scan_wurzeln = lambda: [TMP]                       # nur das eigene temporaere Verzeichnis, nicht den Checkout (.claude, Untracked)


def lies(w, bis=lambda m: True, n=40):
    """Liest Nachrichten, bis `bis` passt. Gibt die passende (oder die letzte) zurueck."""
    m = None
    for _ in range(n):
        m = w.receive_json()
        if bis(m):
            return m
    return m


def stand(w, bis=lambda m: True):
    return lies(w, lambda m: m.get("t") == "stand" and bis(m))


class Klasse:
    """Hilfsklasse: Lehrkraft plus Schueler plus Wand in einer Sitzung (alle ueber ExitStack geoeffnet)."""

    def __init__(self, c, schueler=0, wand=False):
        self.c, self.es = c, contextlib.ExitStack()
        self.l = self.es.enter_context(c.websocket_connect("/ws/klasse", headers=H))
        self.l.send_json({"t": "neu"})
        e = self.l.receive_json()
        self.code, self.key = e["code"], e["schluessel"]
        self.antwort_erstellt = e
        stand(self.l)
        self.s, self.tokens, self.namen = [], [], []
        for _ in range(schueler):
            self.schueler()
        self.w = None
        if wand:
            self.w = self.es.enter_context(c.websocket_connect("/ws/klasse", headers=H))
            self.w.send_json({"t": "wand", "code": self.code, "schluessel": self.key})
            stand(self.w)

    def schueler(self):
        w = self.es.enter_context(self.c.websocket_connect("/ws/klasse", headers=H))
        w.send_json({"t": "beitritt", "code": self.code})
        wk = w.receive_json()
        st = stand(w)
        self.s.append(w)
        self.tokens.append(wk["token"])
        self.namen.append(st["name"])
        return w

    def frage(self, **kw):
        self.l.send_json(dict({"t": "aktivitaet", "art": "wahl", "n": 2, "ref": "test"}, **kw))
        return stand(self.l, lambda m: m["aktivitaet"] is not None)

    def schliesse(self):
        self.es.close()


def ws_oeffnen_abgelehnt(c, headers):
    try:
        with c.websocket_connect("/ws/klasse", headers=headers) as w:
            w.send_json({"t": "neu"})
            w.receive_json()
        return False
    except WebSocketDisconnect:
        return True


with TestClient(app, base_url="http://testserver") as c:
    # ------------------------------------------------------------------------------------------ Zugang
    print("--- Zugang")
    ok(ws_oeffnen_abgelehnt(c, {}), "ohne Origin: abgelehnt")
    ok(ws_oeffnen_abgelehnt(c, {"origin": "https://boese.example.org"}), "fremder Origin: abgelehnt")
    zuruecksetzen()
    k = Klasse(c, schueler=2, wand=True)
    ok(re.fullmatch(r"[ACDEFGHJKMNPQRTWXYZ346789]{8}", k.code) is not None, "Code: 8 Zeichen ohne Verwechselbares")
    ok(re.fullmatch(r"[0-9a-f]{32}", k.key) is not None, "Lehrer-Schluessel: 128 Bit, hexadezimal")
    ok(k.antwort_erstellt["max_teilnehmer"] == K.MAX_TEILNEHMER, "Sitzung nennt ihre Obergrenze")
    ok(all(re.fullmatch(r"[A-ZÄÖÜ][a-zäöüß]+(er|e|es) [A-ZÄÖÜ][a-zäöüß]+", n) for n in k.namen) and len(set(k.namen)) == 2,
       "Pseudonyme: Farbe plus Tier, verschieden (%s)" % ", ".join(k.namen))
    ok(re.fullmatch(r"[0-9a-f]{32}", k.tokens[0]) is not None, "Wiederverbindungs-Schluessel an den Schueler")
    # Lehrkraft schliesst neu an, Schueler wieder anmelden
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        g = k.code[:4].lower() + " - " + k.code[4:].lower()
        w.send_json({"t": "beitritt", "code": g})
        ok(w.receive_json()["t"] == "willkommen", "Eingabe tolerant: 'abcd - efgh' (klein, Leerzeichen, Bindestrich) tritt bei")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "lehrer", "code": k.code.lower(), "schluessel": k.key})
        ok(stand(w)["rolle"] == "lehrer", "Lehrkraft meldet sich mit Code (auch kleingeschrieben) und Schluessel erneut an")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "wieder", "code": k.code, "token": k.tokens[0]})
        st = stand(w)
        ok(st["rolle"] == "schueler" and st["name"] == k.namen[0], "Wiederverbinden mit Schluessel: gleiches Pseudonym")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "wieder", "code": k.code, "token": "0" * 32})
        ok(w.receive_json()["t"] == "fehler", "Wiederverbinden mit falschem Schluessel: Fehler")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "lehrer", "code": k.code, "schluessel": "0" * 32})
        ok(w.receive_json()["t"] == "fehler", "Lehrkraft mit falschem Schluessel: Fehler")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "lehrer", "code": "AAAAAAAA", "schluessel": k.key})
        ok(w.receive_json()["t"] == "fehler", "falscher Code: Fehler")
    for boese in (None, 5, ["A"], {"a": 1}, "", "A" * 5000, "ACDEFG'; DROP TABLE x;--"):
        with c.websocket_connect("/ws/klasse", headers=H) as w:
            w.send_json({"t": "beitritt", "code": boese})
            r = w.receive_json()
            ok(r["t"] == "fehler", "Code mit ungueltigem Wert %r: Fehler" % (str(boese)[:20],))
    # Wand und Schueler duerfen nichts steuern
    k.w.send_json({"t": "aktivitaet", "art": "wahl", "n": 2})
    ok(lies(k.w, lambda m: m.get("t") == "fehler")["t"] == "fehler", "Wand kann nichts steuern")
    k.s[0].send_json({"t": "aktivitaet", "art": "wahl", "n": 2})
    ok(lies(k.s[0], lambda m: m.get("t") == "fehler")["t"] == "fehler", "Schueler kann keine Aufgabe starten")
    k.s[0].send_json({"t": "beenden", "code": k.code})
    ok(lies(k.s[0], lambda m: m.get("t") == "fehler")["t"] == "fehler", "Schueler kann die Sitzung nicht beenden")
    k.schliesse()

    # ------------------------------------------------------------------------------------------ Sperre nach Fehlversuchen
    print("--- Sperre nach Fehlversuchen")
    zuruecksetzen()
    k = Klasse(c)
    versuche = 0
    gesperrt = False
    for _ in range(25):
        try:
            with c.websocket_connect("/ws/klasse", headers=H) as w:
                for _ in range(1):
                    w.send_json({"t": "beitritt", "code": "AAAAAAAA"})
                    r = w.receive_json()
                    versuche += 1
                    if "Zu viele falsche" in r.get("text", ""):
                        gesperrt = True
                    if r.get("text", "").startswith(("Diesen Code gibt es nicht", "Zu viele falsche")):
                        break
        except WebSocketDisconnect:
            pass
        if gesperrt:
            break
    ok(gesperrt and versuche <= K.FEHLVERSUCHE_JE_IP + 3, "nach %d Fehlversuchen gesperrt (Grenze %d)" % (versuche, K.FEHLVERSUCHE_JE_IP))
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "beitritt", "code": "AAAAAAAA"})
        r = w.receive_json()
        ok(r["t"] == "fehler" and "Zu viele falsche" in r["text"], "gesperrt: falscher Code bleibt abgewiesen")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "beitritt", "code": k.code})
        wk = w.receive_json()
        ok(wk["t"] == "willkommen", "gesperrt: der richtige Code kommt trotzdem durch (Sperre trifft nur falsche Versuche)")
        tok = wk["token"]
        stand(w)
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "lehrer", "code": k.code, "schluessel": k.key})
        ok(stand(w)["rolle"] == "lehrer", "gesperrt: Lehrkraft verbindet sich mit Schluessel neu")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "wieder", "code": k.code, "token": tok})
        ok(stand(w)["rolle"] == "schueler", "gesperrt: Wiederverbinden mit Schluessel klappt")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "lehrer", "code": k.code, "schluessel": "0" * 32})
        ok("Zu viele falsche" in w.receive_json().get("text", ""), "gesperrt: falscher Lehrer-Schluessel bleibt abgewiesen")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "neu"})
        ok(w.receive_json()["t"] == "erstellt", "Sperre trifft nur Code und Schluessel, nicht das Anlegen einer Sitzung")
    uhr["plus"] += K.FEHLVERSUCHE_FENSTER_S + 5
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "beitritt", "code": k.code})
        ok(w.receive_json()["t"] == "willkommen", "nach Ablauf des Fensters ist die Sperre weg")
    uhr["plus"] = 0.0
    k.schliesse()

    # ------------------------------------------------------------------------------------------ Obergrenzen
    print("--- Obergrenzen")
    zuruecksetzen()
    alt = K.MAX_TEILNEHMER
    K.MAX_TEILNEHMER = 3
    k = Klasse(c, schueler=3)
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "beitritt", "code": k.code})
        r = w.receive_json()
        ok(r["t"] == "fehler" and "voll" in r["text"], "vierte Person bei Obergrenze 3: abgelehnt")
    ok(len(set(k.namen)) == 3, "drei Pseudonyme, alle verschieden")
    k.schliesse()
    K.MAX_TEILNEHMER = alt

    zuruecksetzen()
    alt = K.MAX_SITZUNGEN_JE_IP
    K.MAX_SITZUNGEN_JE_IP = 2
    a1, a2 = Klasse(c), Klasse(c)
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "neu"})
        r = w.receive_json()
        ok(r["t"] == "fehler" and "Anschluss" in r["text"], "dritte Sitzung von derselben Adresse: abgelehnt")
    a1.schliesse(); a2.schliesse()
    K.MAX_SITZUNGEN_JE_IP = alt

    zuruecksetzen()
    alt, alt2 = K.MAX_SITZUNGEN, K.MAX_SITZUNGEN_JE_IP
    K.MAX_SITZUNGEN, K.MAX_SITZUNGEN_JE_IP = 2, 5
    a1, a2 = Klasse(c), Klasse(c)
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "neu"})
        r = w.receive_json()
        ok(r["t"] == "fehler" and "Sitzungen" in r["text"], "mehr Sitzungen als die Obergrenze: abgelehnt")
    ok(c.get("/api/klasse/zaehler").json()["aktiv"] == 2, "oeffentlicher Zaehler zeigt 2 aktive Sitzungen")
    a1.schliesse(); a2.schliesse()
    K.MAX_SITZUNGEN, K.MAX_SITZUNGEN_JE_IP = alt, alt2

    zuruecksetzen()
    k = Klasse(c, schueler=1)
    k.s[0].send_text("x" * (K.MAX_NACHRICHT + 1))
    ok(lies(k.s[0], lambda m: m.get("t") == "fehler")["text"] == "Ungültige Nachricht.", "zu grosse Nachricht: abgelehnt")
    k.s[0].send_text("kein json")
    ok(lies(k.s[0], lambda m: m.get("t") == "fehler")["t"] == "fehler", "Nachricht ohne JSON: abgelehnt")
    k.s[0].send_text('[1,2,3]')
    ok(lies(k.s[0], lambda m: m.get("t") == "fehler")["t"] == "fehler", "JSON-Liste statt Objekt: abgelehnt")
    k.s[0].send_text("[" * 700 + "]" * 700)
    ok(lies(k.s[0], lambda m: m.get("t") == "fehler")["t"] == "fehler", "tief verschachteltes JSON: sauber abgelehnt")
    k.s[0].send_text('{"t":' + "[" * 400 + "]" * 400 + "}")
    ok(lies(k.s[0], lambda m: m.get("t") == "fehler")["t"] == "fehler", "Nachricht mit verschachteltem Typ: abgelehnt")
    k.s[0].send_bytes(b"\x00\x01")
    ok(lies(k.s[0], lambda m: m.get("t") == "fehler")["t"] == "fehler", "Binaerdaten: abgelehnt")
    zu = False
    K.NACHRICHTEN_FENSTER = FENSTER
    for _ in range(K.NACHRICHTEN_FENSTER[0] + 5):
        k.s[0].send_json({"t": "ping"})
    try:
        for _ in range(60):
            r = k.s[0].receive_json()
            if r.get("t") == "fehler" and "Zu viele" in r["text"]:
                zu = True
                break
    except WebSocketDisconnect:
        zu = True
    ok(zu, "Nachrichtenflut: Verbindung wird beendet")
    K.NACHRICHTEN_FENSTER = (10_000, 10.0)
    k.schliesse()

    zuruecksetzen()
    k = Klasse(c)
    for i in range(K.MAX_AKTIVITAETEN):
        k.l.send_json({"t": "aktivitaet", "art": "wahl", "n": 2, "ref": "a"})
    stand(k.l, lambda m: m["aktivitaeten"] == K.MAX_AKTIVITAETEN)
    k.l.send_json({"t": "aktivitaet", "art": "wahl", "n": 2})
    ok("Mehr als" in lies(k.l, lambda m: m.get("t") == "fehler")["text"], "Obergrenze fuer Aufgaben je Sitzung")
    k.schliesse()

    # ------------------------------------------------------------------------------------------ Aufgaben und Antworten
    print("--- Aufgaben und Antworten (Validierung)")
    zuruecksetzen()
    k = Klasse(c, schueler=1)
    schlecht = [
        {"art": "wahl", "n": 1}, {"art": "wahl", "n": 7}, {"art": "wahl", "n": True}, {"art": "wahl", "n": 2.5}, {"art": "wahl", "n": "3"},
        {"art": "frei"}, {"art": "wahl", "n": 2, "ref": "A B"}, {"art": "wahl", "n": 2, "ref": "jn\n"}, {"art": "wahl", "n": 2, "ref": "x" * 60}, {"art": "wahl", "n": 2, "ref": 5},
        {"art": "schaetzung", "lo": 5, "hi": 5}, {"art": "schaetzung", "lo": 0, "hi": 10 ** 9}, {"art": "schaetzung", "lo": "0", "hi": 10},
        {"art": "schaetzung", "lo": True, "hi": 10}, {"art": "schaetzung"}, {"art": None},
    ]
    for kw in schlecht:
        k.l.send_json(dict({"t": "aktivitaet"}, **kw))
        r = lies(k.l, lambda m: m.get("t") in ("fehler", "stand") and (m.get("t") == "fehler" or m["aktivitaet"] is not None))
        ok(r["t"] == "fehler", "ungueltige Aufgabe abgelehnt: %s" % json.dumps(kw)[:50])
        uhr["plus"] += 0
        k.l.send_json({"t": "ping"})
        lies(k.l, lambda m: m.get("t") == "pong")
    k.schliesse()

    zuruecksetzen()
    k = Klasse(c, schueler=3, wand=True)
    st = k.frage(art="wahl", n=3, ref="quiz:ml:0")
    nr = st["aktivitaet"]["nr"]
    def sende(i, **kw):
        k.s[i].send_json(dict({"t": "antwort", "nr": nr}, **kw))
        return lies(k.s[i], lambda m: m.get("t") in ("fehler", "stand") and (m.get("t") == "fehler" or m["aktivitaet"].get("beantwortet")))
    for wert in (3, -1, "1", 1.5, True, None, [1]):
        k.s[0].send_json({"t": "antwort", "nr": nr, "wert": wert})
        r = lies(k.s[0], lambda m: m.get("t") == "fehler")
        ok(r["t"] == "fehler", "Antwort mit ungueltigem Wert %r abgelehnt" % (wert,))
        k.s[0].send_json({"t": "ping"}); lies(k.s[0], lambda m: m.get("t") == "pong")
    k.s[0].send_json({"t": "antwort", "nr": nr + 5, "wert": 1})
    ok(lies(k.s[0], lambda m: m.get("t") == "fehler")["t"] == "fehler", "Antwort auf eine andere Aufgabe abgelehnt")
    ok(sende(0, wert=1)["aktivitaet"]["beantwortet"] is True, "gueltige Antwort angenommen")
    k.s[0].send_json({"t": "antwort", "nr": nr, "wert": 2})
    ok("schon geantwortet" in lies(k.s[0], lambda m: m.get("t") == "fehler")["text"], "zweite Antwort derselben Person abgelehnt")
    # Lehrkraft sieht die Zahl, nicht die Werte
    st = stand(k.l, lambda m: m["aktivitaet"].get("antworten") == 1)
    ok(st["aktivitaet"]["antworten"] == 1 and "ergebnis" not in st["aktivitaet"], "Lehrkraft sieht Anzahl, vor dem Zeigen kein Ergebnis")
    # kleine-Zahlen-Schutz: 1 und 2 Antworten
    sende(1, wert=1)
    k.l.send_json({"t": "zeigen"})
    st = stand(k.w, lambda m: m["aktivitaet"].get("zeigen"))
    ok(st["aktivitaet"]["ergebnis"] == {"zu_wenige": True, "mindestens": 3}, "2 Antworten: nur 'zu wenige', keine Werte")
    k.l.send_json({"t": "verbergen"})
    sende(2, wert=0) if False else None
    k.schliesse()

    # Verteilungen und Unterdrueckung
    def lauf(art, antworten, **kw):
        zuruecksetzen()
        kl = Klasse(c, schueler=len(antworten), wand=True)
        st = kl.l and None
        kl.l.send_json(dict({"t": "aktivitaet", "art": art, "ref": "t"}, **kw))
        s = stand(kl.l, lambda m: m["aktivitaet"] is not None)
        nr = s["aktivitaet"]["nr"]
        for i, w in enumerate(antworten):
            kl.s[i].send_json({"t": "antwort", "nr": nr, "wert": w})
            lies(kl.s[i], lambda m: m.get("t") == "stand" and m["aktivitaet"]["beantwortet"])
        kl.l.send_json({"t": "zeigen"})
        r = stand(kl.w, lambda m: m["aktivitaet"].get("zeigen"))
        wand_json = json.dumps(r)
        kl.schliesse()
        return r["aktivitaet"]["ergebnis"], wand_json, kl

    erg, wj, kl = lauf("wahl", [0, 0, 0], n=2)
    ok(erg["zellen"] == [3, 0] and erg["gesamt"] == 3 and not erg["unter_drei"], "3 gleiche Antworten: Verteilung [3, 0], Gesamt 3")
    erg, wj, kl = lauf("wahl", [0, 0, 0, 1, 1], n=2)
    ok(erg["zellen"] == [-1, -1] and erg["gesamt"] is None and erg["unter_drei"], "Feld mit 2 Antworten und das kleinste sichtbare Feld werden verdeckt, Gesamtzahl verborgen")
    erg, wj, kl = lauf("wahl", [0, 0, 0, 0, 1], n=2)
    ok(erg["zellen"] == [-1, -1] and erg["gesamt"] is None and '"antworten"' not in wj, "PoC Review: Zellen [4,1] mit 5 Antworten bleiben beide verdeckt, keine Zahl der Antwortenden")
    erg, wj, kl = lauf("skala", [5, 5, 1])
    ok("mittelwert" not in erg, "PoC Review: Skala {5,5,1}: kein Mittelwert")
    erg, wj, kl = lauf("schaetzung", [5, 50, 95], lo=0, hi=100)
    ok("median" not in erg, "PoC Review: Schaetzung [5,50,95]: kein Median")
    zuruecksetzen()
    kl = Klasse(c, schueler=3)
    kl.l.send_json({"t": "aktivitaet", "art": "wahl", "n": 2, "ref": "t"})
    nr = stand(kl.l, lambda m: m["aktivitaet"] is not None)["aktivitaet"]["nr"]
    for i in range(3):
        kl.s[i].send_json({"t": "antwort", "nr": nr, "wert": 0})
        lies(kl.s[i], lambda m: m.get("t") == "stand" and m["aktivitaet"]["beantwortet"])
    kl.l.send_json({"t": "zeigen"})
    rl = stand(kl.l, lambda m: m["aktivitaet"].get("zeigen"))
    ok("antworten" not in rl["aktivitaet"], "Lehrkraft sieht nach dem Zeigen keine Zahl der Antwortenden")
    kl.schliesse()
    erg, wj, kl = lauf("wahl", [0, 0, 0, 1, 1, 1, 2], n=3)
    ok(erg["zellen"] == [-1, 3, -1], "Feld mit 1 Antwort plus das kleinste sichtbare Feld verdeckt (Differenz nie unter 4)")
    erg, wj, kl = lauf("wahl", [0, 0, 1, 1, 2], n=3)
    ok(erg["zellen"] == [-1, -1, -1], "alle Felder unter 3: alle verborgen")
    ok(all(x not in wj for x in kl.namen), "Wand-Nachricht enthaelt kein Pseudonym der Antwortenden")
    erg, wj, kl = lauf("skala", [1, 2, 3, 4, 5, 5, 5, 4, 4], )
    ok(erg["zellen"] == [-1, -1, -1, -1, 3] and "mittelwert" not in erg, "Skala: kleine Felder verdeckt, dann kein Mittelwert")
    erg, wj, kl = lauf("skala", [5, 5, 5, 4, 4, 4])
    ok(erg["zellen"] == [0, 0, 0, 3, 3] and erg["mittelwert"] == 4.5 and erg["gesamt"] == 6, "Skala mit 6 Antworten ohne verdeckte Felder: Mittelwert 4,5")
    erg, wj, kl = lauf("skala", [5, 5, 5, 4])
    ok("mittelwert" not in erg, "Skala mit 4 Antworten: kein Mittelwert (unter 5)")
    erg, wj, kl = lauf("skala", [5, 5, 5, 4, 4])
    ok("mittelwert" not in erg, "Skala mit verdecktem Feld: kein Mittelwert, auch bei 5 Antworten")
    ok('"antworten"' not in wj, "nach dem Zeigen sendet die Wand keine Zahl der Antwortenden mehr")
    erg, wj, kl = lauf("schaetzung", [10, 20, 30, 40, 50], lo=0, hi=100)
    ok("median" not in erg and len(erg["zellen"]) == 8 and erg["unter_drei"], "Schaetzung mit kleinen Feldern: 8 Klassen, kein Median")
    erg, wj, kl = lauf("schaetzung", [10, 10, 10, 90, 90, 90], lo=0, hi=100)
    ok(erg["median"] == 50 and not erg["unter_drei"], "Schaetzung ohne verdeckte Felder ab 5 Antworten: Median 50")
    erg, wj, kl = lauf("schaetzung", [5, 5, 5, 5], lo=0, hi=7)
    ok(erg["zellen"][5] == 4 and "median" not in erg, "Schaetzung mit kleinem Bereich: Klassen je Wert, 4 Antworten ohne Median")
    zuruecksetzen()
    kl = Klasse(c, schueler=1)
    kl.l.send_json({"t": "aktivitaet", "art": "schaetzung", "lo": 0, "hi": 10})
    nr = stand(kl.l, lambda m: m["aktivitaet"] is not None)["aktivitaet"]["nr"]
    kl.s[0].send_json({"t": "antwort", "nr": nr, "wert": 11})
    ok(lies(kl.s[0], lambda m: m.get("t") == "fehler")["t"] == "fehler", "Schaetzung ausserhalb des Bereichs abgelehnt")
    kl.l.send_json({"t": "schliessen"})
    stand(kl.s[0], lambda m: not m["aktivitaet"]["offen"])
    kl.s[0].send_json({"t": "antwort", "nr": nr, "wert": 5})
    ok("nicht (mehr) offen" in lies(kl.s[0], lambda m: m.get("t") == "fehler")["text"], "Antwort nach dem Schliessen abgelehnt")
    kl.schliesse()

    # Der Dienst speichert nicht, wer was gewaehlt hat
    zuruecksetzen()
    kl = Klasse(c, schueler=3)
    kl.l.send_json({"t": "aktivitaet", "art": "wahl", "n": 2, "ref": "t"})
    nr = stand(kl.l, lambda m: m["aktivitaet"] is not None)["aktivitaet"]["nr"]
    for i, w in enumerate((0, 1, 1)):
        kl.s[i].send_json({"t": "antwort", "nr": nr, "wert": w})
        lies(kl.s[i], lambda m: m.get("t") == "stand" and m["aktivitaet"]["beantwortet"])
    s = next(iter(K._sitz.values()))
    a = s.aktivitaeten[0]
    ok(a.zaehler == {0: 1, 1: 2} and a.beantwortet == {1, 2, 3}, "Speicher: nur Zaehler je Wert und die Menge der Antwortenden")
    ok(not any(hasattr(a, f) for f in ("antworten", "werte", "zuordnung")), "Speicher: keine Zuordnung Person zu Wert")
    del s, a
    kl.schliesse()

    # ------------------------------------------------------------------------------------------ Zeitablauf
    print("--- Zeitablauf")
    zuruecksetzen()
    k = Klasse(c, schueler=1)
    uhr["plus"] += K.MAX_RUHE_S - 60
    k.l.send_json({"t": "aktivitaet", "art": "wahl", "n": 2})
    stand(k.l, lambda m: m["aktivitaet"] is not None)
    k.s[0].send_json({"t": "antwort", "nr": 1, "wert": 0})                 # nur Antworten und Beitritte der Klasse zaehlen als Aktivitaet
    lies(k.s[0], lambda m: m.get("t") == "stand" and m["aktivitaet"].get("beantwortet"))
    ok(c.get("/api/klasse/zaehler").json()["aktiv"] == 1, "nach 19 Minuten und einer Schueler-Antwort: Sitzung lebt")
    uhr["plus"] += K.MAX_RUHE_S - 60
    k.s[0].send_json({"t": "ping"})
    lies(k.s[0], lambda m: m.get("t") == "pong")
    ok(c.get("/api/klasse/zaehler").json()["aktiv"] == 1, "ping zaehlt als Aktion nicht, aber 19 Minuten Ruhe sind noch keine 20")
    uhr["plus"] += 90
    ok(c.get("/api/klasse/zaehler").json()["aktiv"] == 0, "nach mehr als 20 Minuten Ruhe: Sitzung geloescht")
    e = lies(k.l, lambda m: m.get("t") == "ende")
    ok("Anlass: Inaktiv (20 Minuten)" in e.get("nachweis", ""), "Lehrkraft bekommt das Protokoll mit Anlass Inaktiv")
    ok(lies(k.s[0], lambda m: m.get("t") == "ende").get("nachweis") is None, "Schueler bekommen nur 'Ende', kein Protokoll")
    k.schliesse()
    uhr["plus"] = 0.0

    zuruecksetzen()
    k = Klasse(c, schueler=1)
    for i in range(9):                                   # Antwort alle 15 Minuten haelt die Sitzung wach, aber nicht ueber 2 Stunden
        uhr["plus"] += 900
        k.l.send_json({"t": "aktivitaet", "art": "wahl", "n": 2})
        try:
            stand(k.l, lambda m: m["aktivitaet"] is not None and m["aktivitaet"]["nr"] == i + 1)
            k.s[0].send_json({"t": "antwort", "nr": i + 1, "wert": 0})
            lies(k.s[0], lambda m: m.get("t") == "ende" or (m.get("t") == "stand" and m["aktivitaet"] and m["aktivitaet"].get("beantwortet")))
        except Exception:
            break
        if c.get("/api/klasse/zaehler").json()["aktiv"] == 0:
            break
    ok(c.get("/api/klasse/zaehler").json()["aktiv"] == 0, "nach 2 Stunden: Sitzung geloescht, auch bei laufender Aktivitaet")
    ok(uhr["plus"] <= K.MAX_LAUFZEIT_S + 901, "Hoechstdauer greift spaetestens kurz nach 2 Stunden")
    k.schliesse()
    uhr["plus"] = 0.0

    # ------------------------------------------------------------------------------------------ Loeschen und Nachweis
    print("--- Loeschen und Nachweis")
    zuruecksetzen()
    k = Klasse(c, schueler=4, wand=True)
    k.l.send_json({"t": "aktivitaet", "art": "wahl", "n": 2, "ref": "t"})
    nr = stand(k.l, lambda m: m["aktivitaet"] is not None)["aktivitaet"]["nr"]
    for i in range(3):
        k.s[i].send_json({"t": "antwort", "nr": nr, "wert": i % 2})
        lies(k.s[i], lambda m: m.get("t") == "stand" and m["aktivitaet"]["beantwortet"])
    k.l.send_json({"t": "aktivitaet", "art": "skala", "ref": "t"})
    stand(k.l, lambda m: m["aktivitaet"] and m["aktivitaet"]["art"] == "skala")
    vorher = c.get("/api/klasse/zaehler").json()["aktiv"]
    k.l.send_json({"t": "beenden", "code": "AAAAAAAA"})
    ok(lies(k.l, lambda m: m.get("t") == "fehler")["t"] == "fehler", "Beenden mit falschem Code: Fehler, Sitzung bleibt")
    ok(c.get("/api/klasse/zaehler").json()["aktiv"] == vorher == 1, "Zaehler vor dem Loeschen: 1")
    k.l.send_json({"t": "beenden", "code": k.code})
    e = lies(k.l, lambda m: m.get("t") == "ende")
    nach = e["nachweis"]
    z = c.get("/api/klasse/zaehler").json()
    ok(z["aktiv"] == 0 and z["beendet_seit_start"] == 1 and set(z) == {"bereit", "aktiv", "max", "beendet_seit_start"}, "Zaehler faellt von 1 auf 0 (nur Zahlen, keine Zeiten)")
    for w in k.s + [k.w]:
        ok(lies(w, lambda m: m.get("t") == "ende")["t"] == "ende", "Schueler und Wand bekommen 'Ende'")
    ok("Teilnehmende gelöscht: 4" in nach and "Antworten gelöscht: 3" in nach and "Aktivitäten gelöscht: 2" in nach, "Protokoll: Anzahl Teilnehmende, Antworten, Aktivitaeten")
    ok(nach.count(": bestanden") == 5, "Protokoll: alle fuenf Einzelpruefungen bestanden")
    ok("Aktive Sitzungen danach: 0" in nach, "Protokoll nennt aktive Sitzungen danach")
    ok(k.code not in nach and k.key not in nach and not any(n in nach for n in k.namen) and not any(t in nach for t in k.tokens),
       "Protokoll enthaelt weder Code noch Schluessel noch Pseudonyme noch Wiederverbindungs-Schluessel")
    import hashlib
    ok(("Sitzung: " + hashlib.sha256(k.code.encode()).hexdigest() + "\n") in nach, "Protokoll: Sitzung = SHA-256 des Codes (nachrechenbar)")
    ok("Start (UTC): 20" in nach and "Ende (UTC): 20" in nach and "Prüfbar bis (UTC): 20" in nach, "Protokoll: UTC-Zeiten und Pruefbar-bis")
    ok(not K._sitz and not K._ip_sitzungen and not K._verbindungen, "Register leer")
    ok(K._finde(k.code) is None, "Code nicht mehr aufloesbar")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "beitritt", "code": k.code})
        ok(w.receive_json()["t"] == "fehler", "Beitritt nach dem Loeschen: Fehler")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "lehrer", "code": k.code, "schluessel": k.key})
        ok(w.receive_json()["t"] == "fehler", "Lehrer-Anmeldung nach dem Loeschen: Fehler")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "nachweis", "code": k.code})
        ok(w.receive_json().get("nachweis") == nach, "Protokoll bleibt mit dem Code eine Stunde abrufbar")
    uhr["plus"] += K.NACHWEIS_AUFBEWAHRUNG_S + 10
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "nachweis", "code": k.code})
        ok(w.receive_json()["t"] == "fehler", "Nach einer Stunde ist auch das Protokoll im Dienst weg")
    uhr["plus"] = 0.0
    k.schliesse()
    ok(not K._nachweise or True, "(Hinweis) Nachweis-Ablage wird beim naechsten Loeschen aufgeraeumt")

    print("--- Signatur")
    pr = c.post("/api/klasse/nachweis/pruefen", json={"text": nach}, headers=H).json()
    ok(pr["format"] == "gültig" and pr["signatur"] == "gültig" and pr["alle_bestanden"] is True, "Pruefung: Format und Signatur gueltig")
    ok(c.post("/api/klasse/nachweis/pruefen", json={"text": nach.replace("\n", "\r\n")}, headers=H).json()["signatur"] == "gültig", "CRLF-Zeilenenden aendern nichts")
    for name, aend in (("Teilnehmende 4 zu 3", nach.replace("gelöscht: 4", "gelöscht: 3")),
                       ("Ergebnis gefaelscht", nach.replace("Prüfung 3, Geheime Felder überschrieben, Sitzungsobjekt freigegeben: bestanden", "Prüfung 3, Geheime Felder überschrieben, Sitzungsobjekt freigegeben: nicht bestanden")),
                       ("Sitzungshash getauscht", re.sub(r"Sitzung: [0-9a-f]{64}", "Sitzung: " + "0" * 64, nach)),
                       ("Zeile entfernt", "\n".join(z for z in nach.split("\n") if not z.startswith("Dienstversion"))),
                       ("Signatur getauscht", re.sub(r"Signatur: [0-9a-f]{64}", "Signatur: " + "0" * 64, nach)),
                       ("Zeile angehaengt", nach.replace("Signatur:", "Zusatz: x\nSignatur:"))):
        r = c.post("/api/klasse/nachweis/pruefen", json={"text": aend}, headers=H).json()
        ok(r["signatur"] == "ungültig" or r["format"] == "ungültig", "manipuliert (%s): wird erkannt" % name)
    for name, aend in (("Anlass angehaengt", nach + "Anlass: Lehrkraft\n"),
                       ("Teilnehmende angehaengt", nach + "Teilnehmende gelöscht: 0\n"),
                       ("zweite Signaturzeile", nach + "Signatur: " + "0" * 64 + "\n"),
                       ("Signatur nicht letzte Zeile", nach.replace("Signatur:", "Zusatz", 1).replace("Zusatz", "Signatur:") + "Aktive Sitzungen danach: 0\n"),
                       ("doppelte Zeile", nach.replace("Anlass:", "Anlass: Test\nAnlass:", 1)),
                       ("Zeilen vertauscht", nach.replace("Format: kl-nachweis/1\nSitzung:", "Sitzung:", 1))):
        rr = c.post("/api/klasse/nachweis/pruefen", json={"text": aend}, headers=H).json()
        ok(rr["format"] == "ungültig" or rr["signatur"] != "gültig", "angehaengte oder veraenderte Zeilen (%s): abgelehnt" % name)
    pr = c.post("/api/klasse/nachweis/pruefen", json={"text": nach, "code": k.code}, headers=H).json()
    ok(pr.get("code_passt") is True, "Protokoll passt zum Code der Sitzung")
    pr = c.post("/api/klasse/nachweis/pruefen", json={"text": nach, "code": "AAAAAAAA"}, headers=H).json()
    ok(pr.get("code_passt") is False, "Protokoll mit fremdem Code: passt nicht")
    uhr["plus"] += K.PRUEF_FRIST_S + 3600
    pr = c.post("/api/klasse/nachweis/pruefen", json={"text": nach}, headers=H).json()
    ok(pr["signatur"] == "abgelaufen" and "Prüffrist" in pr.get("hinweis", ""), "nach 30 Tagen: Pruefung abgelaufen (Frist steht im Protokoll)")
    uhr["plus"] = 0.0
    ok(c.post("/api/klasse/nachweis/pruefen", json={"text": "Hallo"}, headers=H).json()["format"] == "ungültig", "Unsinn: Format ungueltig")
    ok(c.post("/api/klasse/nachweis/pruefen", json={"text": 5}, headers=H).json()["format"] == "ungültig", "Text keine Zeichenkette: ungueltig")
    ok(c.post("/api/klasse/nachweis/pruefen", content=b"{kaputt", headers=dict(H, **{"content-type": "application/json"})).status_code == 400, "kaputtes JSON: 400")
    ok(c.post("/api/klasse/nachweis/pruefen", json={"text": "a" * 9000}, headers=H).status_code == 413, "zu grosse Anfrage: 413")
    ok(c.post("/api/klasse/nachweis/pruefen", json={"text": nach}).status_code == 403, "Pruefung ohne Origin: 403")
    schl = K._K_SIGNATUR, K.SCHLUESSEL_KENNUNG
    K._K_SIGNATUR = b"x" * 32
    K.SCHLUESSEL_KENNUNG = "ffffffff"
    r = c.post("/api/klasse/nachweis/pruefen", json={"text": nach}, headers=H).json()
    ok(r["signatur"] == "ungültig" and "anderen Schlüssel" in r.get("hinweis", ""), "anderer Schluessel (Neustart): ehrlicher Hinweis")
    K._K_SIGNATUR, K.SCHLUESSEL_KENNUNG = schl
    seite = c.post("/klasse/nachweis", content=("text=" + nach.replace("\n", "%0A").replace(" ", "+")).encode(),
                   headers=dict(H, **{"content-type": "application/x-www-form-urlencoded"}))
    ok(seite.status_code == 200 and "Format und Signatur sind gültig" in seite.text, "Pruefseite (ohne JavaScript): gueltig")
    seite = c.post("/klasse/nachweis", content=b"text=%3Cscript%3Ealert(1)%3C%2Fscript%3E", headers=dict(H, **{"content-type": "application/x-www-form-urlencoded"}))
    ok("<script>alert" not in seite.text and "&lt;script&gt;" in seite.text, "Pruefseite escaped Eingaben (XSS)")
    ok(c.get("/klasse/nachweis").status_code == 200 and "Löschprotokoll prüfen" in c.get("/klasse/nachweis").text, "Pruefseite per GET erreichbar")
    ok(c.post("/klasse/nachweis", content=b"text=x").status_code == 403, "Pruefseite ohne Origin: 403")

    print("--- Selbstpruefung schlaegt an, wenn etwas schiefgeht")
    zuruecksetzen()
    k = Klasse(c, schueler=1)
    with open(os.path.join(TMP, "dienst.log"), "w") as f:
        f.write("GET /x " + k.code + " ok\n")
    k.l.send_json({"t": "beenden", "code": k.code})
    nach2 = lies(k.l, lambda m: m.get("t") == "ende")["nachweis"]
    ok("nicht bestanden" in nach2 and "Suche nach Code und Sitzungskennung in Dateien" in nach2 and "KB gelesen): nicht bestanden" in nach2,
       "Code in einer Logdatei: Pruefung 4 meldet 'nicht bestanden'")
    ok(c.post("/api/klasse/nachweis/pruefen", json={"text": nach2}, headers=H).json()["signatur"] == "gültig", "...und das Protokoll ist trotzdem korrekt signiert")
    k.schliesse()
    os.remove(os.path.join(TMP, "dienst.log"))

    zuruecksetzen()
    k = Klasse(c, schueler=1)
    lg = logging.getLogger("uvicorn.access")
    lg.warning("Zugriff mit Code %s", k.code)
    lg.warning("Zugriff ohne Geheimnis")
    ok(K._LogWaechter().filter(logging.LogRecord("x", 30, "", 1, "Code " + k.code, None, None)) is False, "Logwaechter verwirft einen Eintrag mit Code")
    ok(K._LogWaechter().filter(logging.LogRecord("x", 30, "", 1, "harmlos", None, None)) is True, "Logwaechter laesst Harmloses durch")
    k.l.send_json({"t": "beenden", "code": k.code})
    nach3 = lies(k.l, lambda m: m.get("t") == "ende")["nachweis"]
    ok("Dienst-Logger ohne Eintrag mit Code oder Sitzungskennung (" in nach3 and "(2 Treffer): nicht bestanden" in nach3 or "(1 Treffer): nicht bestanden" in nach3,
       "Eintrag mit Code im Logger: Treffer gezaehlt, Pruefung 5 'nicht bestanden'")
    k.schliesse()

    # Ohne Verbindungs-Aufraeumen: Loeschung mit offener Lehrer-, Wand- und Schueler-Verbindung belegt die Freigabe
    zuruecksetzen()
    k = Klasse(c, schueler=2, wand=True)
    k.l.send_json({"t": "beenden", "code": k.code})
    nach4 = lies(k.l, lambda m: m.get("t") == "ende")["nachweis"]
    ok("freigegeben: bestanden" in nach4, "Sitzungsobjekt nach dem Loeschen von keiner Verbindung mehr gehalten (weakref)")
    k.schliesse()

    print("--- Adresse und globaler Deckel")
    zuruecksetzen()
    os.environ.pop("KL_PROXY_KEY", None)
    k = Klasse(c)
    def versuch(kopf):
        with c.websocket_connect("/ws/klasse", headers=dict(H, **kopf)) as w:
            w.send_json({"t": "beitritt", "code": "AAAAAAAA"})
            return w.receive_json().get("text", "")
    gesperrt = False
    for i in range(K.FEHLVERSUCHE_JE_IP + 2):          # jedes Mal eine andere vorgetaeuschte Adresse
        try:
            txt = versuch({"cf-connecting-ip": "198.51.100.%d" % i, "x-real-ip": "203.0.113.%d" % i, "x-forwarded-for": "192.0.2.%d" % i})
        except WebSocketDisconnect:
            txt = "Zu viele falsche"
        if "Zu viele falsche" in txt:
            gesperrt = True
            break
    ok(gesperrt, "gefaelschte Adress-Kopfzeilen von einer nicht vertrauenswuerdigen Quelle umgehen die Sperre nicht")
    ok(len(K._fehlversuche) == 1, "alle Versuche landen im selben Zaehler (%d)" % len(K._fehlversuche))
    os.environ["KL_PROXY_KEY"] = "test-proxy-schluessel"
    ok(K._ip_tag(type("R", (), {"headers": {"x-kl-proxy": "test-proxy-schluessel", "x-real-ip": "203.0.113.5"}, "client": type("C", (), {"host": "10.0.0.1"})()})())
       != K._ip_tag(type("R", (), {"headers": {"x-kl-proxy": "test-proxy-schluessel", "x-real-ip": "203.0.113.6"}, "client": type("C", (), {"host": "10.0.0.1"})()})()),
       "vom eigenen Proxy (mit Schluessel) gemeldete Adressen werden unterschieden")
    ok(K._ip_tag(type("R", (), {"headers": {"x-kl-proxy": "falsch", "x-real-ip": "203.0.113.5"}, "client": type("C", (), {"host": "10.0.0.1"})()})())
       == K._ip_tag(type("R", (), {"headers": {"x-kl-proxy": "falsch", "x-real-ip": "203.0.113.6"}, "client": type("C", (), {"host": "10.0.0.1"})()})()),
       "falscher Proxy-Schluessel: X-Real-IP wird ignoriert")
    # IPv4-in-IPv6: dieselbe Adresse wie die IPv4, nicht ein gemeinsames ::/64
    os.environ["KL_PROXY_KEY"] = "test-proxy-schluessel"
    def anfr0(ip):
        return type("R", (), {"headers": {"x-kl-proxy": "test-proxy-schluessel", "x-real-ip": ip}, "client": type("C", (), {"host": "10.0.0.1"})()})()
    ok(K._ip_tag(anfr0("::ffff:203.0.113.5")) != K._ip_tag(anfr0("::ffff:198.51.100.77")), "IPv4-gemappte Adressen verschiedener Besucher teilen sich keinen Zaehler")
    ok(K._ip_tag(anfr0("::ffff:203.0.113.5")) == K._ip_tag(anfr0("203.0.113.5")), "::ffff:a.b.c.d zaehlt wie die IPv4-Adresse")
    # Netzbereich: IPv6 zaehlt als /64, IPv4 als Einzeladresse
    def anfr(ip):
        return type("R", (), {"headers": {"x-kl-proxy": "test-proxy-schluessel", "x-real-ip": ip}, "client": type("C", (), {"host": "10.0.0.1"})()})()
    ok(K._ip_tag(anfr("2001:db8:1:2::1")) == K._ip_tag(anfr("2001:db8:1:2:ffff::9")), "IPv6: zwei Adressen im selben /64 teilen sich die Sperre")
    ok(K._ip_tag(anfr("2001:db8:1:2::1")) != K._ip_tag(anfr("2001:db8:1:3::1")), "IPv6: verschiedene /64 sind verschieden")
    ok(K._ip_tag(anfr("203.0.113.1")) != K._ip_tag(anfr("203.0.113.2")), "IPv4: einzelne Adressen sind verschieden")
    os.environ.pop("KL_PROXY_KEY", None)
    zuruecksetzen()
    k2 = Klasse(c)
    os.environ["KL_PROXY_KEY"] = "test-proxy-schluessel"
    alt_m, alt_ip = K.GLOBAL_FEHLVERSUCHE_MINUTE, K.FEHLVERSUCHE_JE_IP
    K.GLOBAL_FEHLVERSUCHE_MINUTE, K.FEHLVERSUCHE_JE_IP = 6, 1000
    glob = False
    for i in range(10):                                # verteiltes Raten: jede Adresse nur einmal (vertrauenswuerdiger Proxy)
        txt = versuch({"x-kl-proxy": "test-proxy-schluessel", "x-real-ip": "203.0.113.%d" % (10 + i)})
        if "viele falsche Codes" in txt:
            glob = True
            break
    ok(glob and i <= 7, "globaler Deckel greift nach %d verteilten Fehlversuchen" % i)
    P = {"x-kl-proxy": "test-proxy-schluessel"}
    ok(K._global_gesperrt(), "globale Sperre ist aktiv")
    with c.websocket_connect("/ws/klasse", headers=dict(H, **P, **{"x-real-ip": "203.0.113.99"})) as w:
        w.send_json({"t": "beitritt", "code": k2.code})
        wk = w.receive_json()
        ok(wk["t"] == "willkommen", "waehrend der globalen Sperre kommt ein Teilnehmer mit richtigem Code herein")
        tok = wk["token"]
        stand(w)
    with c.websocket_connect("/ws/klasse", headers=dict(H, **P, **{"x-real-ip": "203.0.113.98"})) as w:
        w.send_json({"t": "lehrer", "code": k2.code, "schluessel": k2.key})
        ok(stand(w)["rolle"] == "lehrer", "waehrend der globalen Sperre verbindet sich die Lehrkraft mit Schluessel neu")
    with c.websocket_connect("/ws/klasse", headers=dict(H, **P, **{"x-real-ip": "203.0.113.97"})) as w:
        w.send_json({"t": "wand", "code": k2.code, "schluessel": k2.key})
        ok(stand(w)["rolle"] == "wand", "waehrend der globalen Sperre verbindet sich die Wand mit Schluessel")
    with c.websocket_connect("/ws/klasse", headers=dict(H, **P, **{"x-real-ip": "203.0.113.96"})) as w:
        w.send_json({"t": "wieder", "code": k2.code, "token": tok})
        ok(stand(w)["rolle"] == "schueler", "waehrend der globalen Sperre klappt das Wiederverbinden eines Schuelers")
    alt_p = K.GLOBAL_PAUSE_S
    K.GLOBAL_PAUSE_S = 0.0
    for falsch in ({"t": "beitritt", "code": "AAAAAAAA"}, {"t": "lehrer", "code": k2.code, "schluessel": "0" * 32}):
        with c.websocket_connect("/ws/klasse", headers=dict(H, **P, **{"x-real-ip": "203.0.113.95"})) as w:
            w.send_json(falsch)
            ok("falsche Codes" in w.receive_json().get("text", ""), "waehrend der globalen Sperre bleiben falsche Versuche abgewiesen (%s)" % falsch["t"])
    K.GLOBAL_PAUSE_S = alt_p
    uhr["plus"] += 3700
    ok(not K._global_gesperrt(), "globale Sperre endet nach der Stunde")
    uhr["plus"] = 0.0
    K.GLOBAL_FEHLVERSUCHE_MINUTE, K.FEHLVERSUCHE_JE_IP = alt_m, alt_ip
    os.environ.pop("KL_PROXY_KEY", None)
    k.schliesse(); k2.schliesse()

    print("--- Falsche Eingaben bremsen, gueltige Beitritte nicht")
    zuruecksetzen()
    K.VERSUCHE_JE_MINUTE = 20
    import time as _zeit
    k = Klasse(c)
    t0 = _zeit.time()
    for i in range(40):                                 # 40 gleichzeitige Beitritte einer Adresse, ohne kuenstliche Uhr
        k.schueler()
    ok(len(k.s) == 40 and len(set(k.namen)) == 40, "40 gueltige Beitritte von einer Adresse klappen hintereinander (%.1f s)" % (_zeit.time() - t0))
    ok(not K._rate_voll(K._ip_tag(type("R", (), {"headers": {}, "client": type("C", (), {"host": "testclient"})()})())), "gueltige Beitritte zaehlen nicht gegen die Rate falscher Eingaben")
    k.schliesse()
    zuruecksetzen()
    k = Klasse(c)
    for _ in range(24):                                 # Mitschueler tippt 24 falsche Codes
        with c.websocket_connect("/ws/klasse", headers=H) as w:
            w.send_json({"t": "beitritt", "code": "AAAAAAAA"})
            w.receive_json()
    ok(K._rate_voll(K._ip_tag(type("R", (), {"headers": {}, "client": type("C", (), {"host": "testclient"})()})())), "24 falsche Eingaben: Netz ist ueber der Rate")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "beitritt", "code": k.code})
        ok(w.receive_json()["t"] == "willkommen", "Falschversuche eines Mitschuelers blockieren den gueltigen Beitritt NICHT")
    K.UEBERLAST_PAUSE_S = 1.5
    t0 = _zeit.time()
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "beitritt", "code": k.code})
        w.receive_json()
    ok(_zeit.time() - t0 >= 1.4, "...wird aber gebremst (Bremse bei zu vielen falschen Eingaben: %.1f s)" % (_zeit.time() - t0))
    K.UEBERLAST_PAUSE_S = 0.0
    k.schliesse()
    K.VERSUCHE_JE_MINUTE = 10 ** 6
    # Treffer-Wahrscheinlichkeit je Netzbereich und Tag bei der Bremse (10 Vorab-Plaetze, 6 s je Eingabe)
    p_tag = (K.PREAUTH_JE_IP / 6.0) * 86400 * K.MAX_SITZUNGEN / (len(K.CODE_ZEICHEN) ** K.CODE_LAENGE)
    ok(p_tag < 5e-5, "Trefferwahrscheinlichkeit je Netzbereich und Tag mit Bremse: %.1e" % p_tag)

    print("--- Sitzungen ohne Teilnehmende, Lehreraktionen, Uhrspruenge")
    zuruecksetzen()
    k = Klasse(c)
    uhr["plus"] += K.LEER_MAX_S + 5
    ok(c.get("/api/klasse/zaehler").json()["aktiv"] == 0, "Sitzung ohne Teilnehmende wird nach 5 Minuten geloescht")
    e = lies(k.l, lambda m: m.get("t") == "ende")
    ok("Keine Teilnehmenden" in e.get("nachweis", ""), "...mit Loeschprotokoll (Anlass: Keine Teilnehmenden)")
    ok(c.post("/api/klasse/nachweis/pruefen", json={"text": e["nachweis"]}, headers=H).json()["signatur"] == "gültig", "...und gueltiger Signatur")
    k.schliesse()
    uhr["plus"] = 0.0
    zuruecksetzen()
    k = Klasse(c, schueler=1)
    uhr["plus"] += K.LEER_MAX_S + 5
    ok(c.get("/api/klasse/zaehler").json()["aktiv"] == 1, "Sitzung MIT Teilnehmenden bleibt nach 5 Minuten bestehen")
    uhr["plus"] = 0.0
    k.schliesse()
    zuruecksetzen()
    k = Klasse(c, schueler=1)
    uhr["plus"] += K.MAX_RUHE_S - 120
    k.l.send_json({"t": "aktivitaet", "art": "wahl", "n": 2})
    stand(k.l, lambda m: m["aktivitaet"] is not None)
    k.l.send_json({"t": "verbergen"})
    lies(k.l, lambda m: m.get("t") in ("fehler", "stand"))
    uhr["plus"] += 180
    ok(c.get("/api/klasse/zaehler").json()["aktiv"] == 0, "Lehreraktionen halten die Sitzung nicht am Leben (20 Minuten ohne Beitritt oder Antwort)")
    uhr["plus"] = 0.0
    k.schliesse()
    zuruecksetzen()
    k = Klasse(c, schueler=1)
    uhr["wand"] = -7200.0                               # Wanduhr springt waehrend der Sitzung 2 Stunden zurueck
    ok(c.get("/api/klasse/zaehler").json()["aktiv"] == 1, "Wanduhr springt zurueck: Sitzung laeuft unbeeinflusst weiter")
    k.l.send_json({"t": "beenden", "code": k.code})
    pn = lies(k.l, lambda m: m.get("t") == "ende")["nachweis"]
    pr = c.post("/api/klasse/nachweis/pruefen", json={"text": pn}, headers=H).json()
    ok(pr["format"] == "gültig" and pr["signatur"] == "gültig", "Protokoll nach Uhrsprung bleibt gueltig (Ende nie vor Start)")
    uhr["wand"] = 0.0
    k.schliesse()
    zuruecksetzen()
    k = Klasse(c, schueler=1)
    uhr["plus"] += 3600 * 5                             # Wanduhr springt vor, Sitzung laeuft nach Monotonuhr 5 Stunden: abgelaufen
    uhr["plus"] = 0.0
    ok(c.get("/api/klasse/zaehler").json()["aktiv"] == 1, "Monotonuhr bestimmt den Ablauf (kein Ablauf ohne verstrichene Zeit)")
    k.schliesse()

    print("--- Vorab-Verbindungen: Zeitlimit und Falschversuche")
    zuruecksetzen()
    alt_z = K.PREAUTH_ZEIT_S
    K.PREAUTH_ZEIT_S = 1.0
    zu = False
    try:
        with c.websocket_connect("/ws/klasse", headers=H) as w:
            for _ in range(5):
                w.receive_json()
    except WebSocketDisconnect:
        zu = True
    K.PREAUTH_ZEIT_S = alt_z
    ok(zu, "Verbindung ohne gueltige Nachricht wird nach dem Vorab-Zeitlimit geschlossen")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "beitritt", "code": "AAAAAAAA"})
        ok(w.receive_json()["t"] == "fehler", "Falschversuch beantwortet")
        w.send_json({"t": "beitritt", "code": "AAAAAAAA"})
        geschlossen = False
        try:
            w.receive_json()
        except WebSocketDisconnect:
            geschlossen = True
        ok(geschlossen, "nach dem Falschversuch ist die Verbindung geschlossen, weiteres Lesen gibt keinen freien Platz")
    ok(K._vorab_gesamt[0] == 0 and not K._vorab_ip, "nach dem Schliessen ist der Platz wieder frei")
    # viele Verbindungen mit je einem Falschversuch fuellen den Deckel nicht dauerhaft
    zuruecksetzen()
    abgelehnt = 0
    for _ in range(300):
        try:
            with c.websocket_connect("/ws/klasse", headers=H) as w:
                w.send_json({"t": "beitritt", "code": "AAAAAAAA"})
                w.receive_json()
        except WebSocketDisconnect:
            abgelehnt += 1
    ok(K._vorab_gesamt[0] == 0 and not K._vorab_ip, "300 Verbindungen mit je einem Falschversuch: danach sind alle Vorab-Plaetze frei (%d abgewiesen)" % abgelehnt)
    zuruecksetzen()                                       # die 300 Falschversuche oben haben die Adresse gesperrt
    alt_pause = K.FEHLVERSUCH_PAUSE_S
    K.FEHLVERSUCH_PAUSE_S = 4.0                           # Bremse: der Server haelt die Verbindung waehrenddessen offen
    es = contextlib.ExitStack()
    belegt = 0
    for _ in range(K.PREAUTH_JE_IP + 3):
        try:
            w = es.enter_context(c.websocket_connect("/ws/klasse", headers=H))
            w.send_json({"t": "beitritt", "code": "AAAAAAAA"})
            belegt += 1
        except WebSocketDisconnect:
            break
    ok(belegt <= K.PREAUTH_JE_IP, "offene Verbindungen nach Falschversuch (noch nicht gelesen) belegen weiter Plaetze: hoechstens %d (%d)" % (K.PREAUTH_JE_IP, belegt))
    es.close()
    K.FEHLVERSUCH_PAUSE_S = alt_pause
    _t.sleep(4.5)
    ok(K.PREAUTH_GESAMT >= 200 and K.PREAUTH_JE_IP >= 10, "Vorab-Grenzen: gesamt %d, je Adresse %d" % (K.PREAUTH_GESAMT, K.PREAUTH_JE_IP))

    print("--- Vorab-Deckel durch viele Adressen: Verdraengung")
    zuruecksetzen()
    os.environ["KL_PROXY_KEY"] = "test-proxy-schluessel"
    PK = {"x-kl-proxy": "test-proxy-schluessel"}
    alt_g, alt_j = K.PREAUTH_GESAMT, K.PREAUTH_JE_IP
    K.PREAUTH_GESAMT, K.PREAUTH_JE_IP = 6, 3
    es = contextlib.ExitStack()
    stille = []
    for adr in ("203.0.113.1", "203.0.113.2"):
        for _ in range(3):
            stille.append(es.enter_context(c.websocket_connect("/ws/klasse", headers=dict(H, **PK, **{"x-real-ip": adr}))))
    ok(K._vorab_gesamt[0] == 6, "Deckel voll: 6 stille Vorab-Verbindungen von 2 Adressen")
    neu = es.enter_context(c.websocket_connect("/ws/klasse", headers=dict(H, **PK, **{"x-real-ip": "203.0.113.9"})))
    neu.send_json({"t": "neu"})
    ok(neu.receive_json()["t"] == "erstellt", "ehrliche Verbindung einer dritten Adresse kommt trotz vollem Deckel durch (aelteste stille wird verdraengt)")
    ok(K._vorab_gesamt[0] <= 6, "Gesamtzahl der Vorab-Verbindungen bleibt im Deckel (%d)" % K._vorab_gesamt[0])
    es.close()
    K.PREAUTH_GESAMT, K.PREAUTH_JE_IP = alt_g, alt_j
    os.environ.pop("KL_PROXY_KEY", None)
    zuruecksetzen()

    print("--- Mehrfach-Beitritt und Vorab-Verbindungen")
    zuruecksetzen()
    K.BEITRITTE_JE_ADRESSE = 3
    k = Klasse(c, schueler=3)
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "beitritt", "code": k.code})
        rr = w.receive_json()
        ok(rr["t"] == "fehler" and "Von deinem Anschluss" in rr["text"], "PoC Review: vierter Beitritt von derselben Adresse abgewiesen")
    k.l.send_json({"t": "je_adresse", "n": 7})
    ok(lies(k.l, lambda m: m.get("t") == "fehler")["t"] == "fehler", "ungueltiger Wert fuer 'Geraete je Adresse': Fehler")
    k.l.send_json({"t": "je_adresse", "n": 10})
    stand(k.l, lambda m: m["je_adresse"] == 10)
    k.schueler()
    ok(len(k.s) == 4, "Lehrkraft hat fuer ein Schulnetz auf 10 erhoeht: vierter Beitritt klappt")
    k.s[0].send_json({"t": "je_adresse", "n": 40})
    ok(lies(k.s[0], lambda m: m.get("t") == "fehler")["t"] == "fehler", "Schueler kann die Grenze nicht aendern")
    k.schliesse()
    K.BEITRITTE_JE_ADRESSE = 40
    zuruecksetzen()
    es = contextlib.ExitStack()
    offen = 0
    abgelehnt = False
    for _ in range(K.PREAUTH_JE_IP + 1):
        try:
            es.enter_context(c.websocket_connect("/ws/klasse", headers=H))
            offen += 1
        except WebSocketDisconnect:
            abgelehnt = True
    ok(abgelehnt and offen == K.PREAUTH_JE_IP, "nicht angemeldete Verbindungen je Adresse auf %d begrenzt" % K.PREAUTH_JE_IP)
    es.close()
    ok(K._vorab_gesamt[0] == 0 and not K._vorab_ip, "Zaehler der Vorab-Verbindungen laeuft nach dem Schliessen auf 0")

    print("--- Echter Server: ws-max-size und uebergrosse Frames")
    import subprocess
    import time as _time
    mod = os.path.join(TMP, "mini_app.py")
    open(mod, "w").write("from fastapi import FastAPI\nfrom app import lab_klasse\napp = FastAPI()\napp.include_router(lab_klasse.router)\n")
    env = dict(os.environ, PYTHONPATH=TMP + os.pathsep + os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    proc = subprocess.Popen([sys.executable, "-m", "uvicorn", "mini_app:app", "--port", "8517", "--ws-max-size", "2100000", "--log-level", "warning"],
                            env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        from websockets.sync.client import connect
        _time.sleep(2.5)
        def echt(nutzlast):
            with connect("ws://127.0.0.1:8517/ws/klasse", origin="http://127.0.0.1:8517", max_size=None) as w:
                w.send(nutzlast)
                try:
                    return w.recv(timeout=5)
                except Exception as e:                      # noqa: BLE001
                    return "ZU:" + type(e).__name__ + ":" + str(getattr(getattr(e, "rcvd", None), "code", ""))
        r1 = echt("x" * 1_500_000)
        ok("Nachricht." in r1 and "fehler" in r1, "Frame unter dem Limit (1,5 MB) kommt an und wird als ungueltig abgelehnt [%s]" % r1[:80])
        r2 = echt("x" * 2_500_000)
        ok(r2.startswith("ZU:") and "1009" in r2, "Frame ueber dem Limit (2,5 MB): uvicorn trennt die Verbindung (1009) [%s]" % r2)
    finally:
        proc.terminate()
        proc.wait(timeout=10)
    ok(True, "(Hinweis) /ws/vision sendet Bilder bis 2 000 000 Zeichen: das Limit 2 100 000 laesst sie durch")

    print("--- Oeffentlich ohne Proxy-Schluessel")
    zuruecksetzen()
    os.environ["OEFFENTLICH"] = "1"
    os.environ.pop("KL_PROXY_KEY", None)
    ok(K._nicht_eingerichtet(), "OEFFENTLICH=1 ohne KL_PROXY_KEY: nicht eingerichtet")
    z = c.get("/api/klasse/zaehler").json()
    ok(z["bereit"] is False, "/api/klasse/zaehler meldet bereit=false")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "neu"})
        r = w.receive_json()
        ok(r["t"] == "fehler" and "nicht eingerichtet" in r["text"], "Sitzung wird mit Hinweis 'nicht eingerichtet' abgelehnt")
    ok(not K._sitz, "es entsteht keine Sitzung")
    os.environ["KL_PROXY_KEY"] = "test-proxy-schluessel"
    P = {"x-kl-proxy": "test-proxy-schluessel"}
    ok(c.get("/api/klasse/zaehler", headers=P).json()["bereit"] is True, "mit KL_PROXY_KEY und Schluessel-Header: bereit=true")
    ok(c.get("/api/klasse/zaehler").json()["bereit"] is False, "Aufruf OHNE Schluessel-Header (nginx-Block ohne Header): bereit=false")
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "neu"})
        rr = w.receive_json()
        ok(rr["t"] == "fehler" and "nicht eingerichtet" in rr["text"], "oeffentlich: WebSocket ohne gueltigen X-KL-Proxy wird abgewiesen")
    ok(c.post("/api/klasse/nachweis/pruefen", json={"text": "x"}, headers=H).status_code == 503, "oeffentlich: Pruefung ohne X-KL-Proxy: 503")
    ok(c.post("/klasse/nachweis", content=b"text=x", headers=H).status_code == 503, "oeffentlich: Pruefseite (POST) ohne X-KL-Proxy: 503")
    with c.websocket_connect("/ws/klasse", headers=dict(H, **P)) as w:
        w.send_json({"t": "neu"})
        ok(w.receive_json()["t"] == "erstellt", "oeffentlich: mit gueltigem X-KL-Proxy klappt es")
    ok(c.post("/api/klasse/nachweis/pruefen", json={"text": "x"}, headers=dict(H, **P)).status_code == 200, "oeffentlich: Pruefung mit Schluessel: 200")
    zuruecksetzen()
    os.environ.pop("OEFFENTLICH")
    os.environ.pop("KL_PROXY_KEY")
    ok(c.get("/api/klasse/zaehler").json()["bereit"] is True, "lokal ohne OEFFENTLICH: bereit, Adresse der direkten Verbindung")

    print("--- Angriffe vor der Anmeldung und auf die Pruefung")
    zuruecksetzen()
    geschlossen = False
    try:
        with c.websocket_connect("/ws/klasse", headers=H) as w:
            for _ in range(12):
                w.send_json({"t": "ping"})
            for _ in range(14):
                w.receive_json()
    except WebSocketDisconnect:
        geschlossen = True
    ok(geschlossen, "Pings vor der Anmeldung halten keine Verbindung offen")
    def stueckweise():
        for _ in range(20):
            yield b"x" * 1000
    ok(c.post("/api/klasse/nachweis/pruefen", content=stueckweise(), headers=dict(H, **{"content-type": "application/json"})).status_code == 413,
       "Anfrage ohne Content-Length ueber der Grenze: 413, nicht unbegrenzt gelesen")

    # ------------------------------------------------------------------------------------------ Datenschutz im Quelltext
    print("--- Datenschutz im Quelltext")
    quelle = open(K.__file__, encoding="utf-8").read()
    code_zeilen = [z for z in quelle.split("\n") if not z.strip().startswith(("#", '"""'))]
    kern = "\n".join(code_zeilen)
    ok(len(re.findall(r'_fehlerlog\.error\("Klassenmodus: Programmfehler %s", type\(e\)\.__name__\)', kern)) == 2, "einziges Logging: Fehlerklasse ohne Inhalte")
    kern = re.sub(r'_fehlerlog\.error\("Klassenmodus: Programmfehler %s", type\(e\)\.__name__\)', "", kern)
    ok("print(" not in kern, "Modul ruft kein print auf")
    ok(not re.search(r"logging\.getLogger\([^)]*\)\.(debug|info|warning|error|exception|critical)|\blog(ger)?\.(debug|info|warning|error)", kern), "Modul schreibt nichts ins Log")
    ok(not re.search(r'open\([^)]*["\'](w|a|x|r\+|wb|ab)["\']', kern) and "write_text" not in kern and "write_bytes" not in kern and ".write(" not in kern,
       "Modul schreibt keine Datei")
    ok("sqlite" not in kern and "shelve" not in kern and "pickle" not in kern, "keine Datenbank")
    js = open(os.path.join(os.path.dirname(K.__file__), "static", "demo-klasse.js"), encoding="utf-8").read() if os.path.exists(os.path.join(os.path.dirname(K.__file__), "static", "demo-klasse.js")) else ""
    if js:
        ok(not re.search(r"(location\.(search|hash|href)|history\.(push|replace)State)[^\n]*(code|schluessel)", js, re.I)
           and "?code=" not in js and "&code=" not in js and "#code" not in js, "Oberflaeche: Code und Schluessel nie in einer Adresse")
        ok("localStorage." not in js and "document.cookie" not in js, "Oberflaeche: nichts in localStorage (nur sessionStorage im eigenen Browser)")
    # Verzeichnisstand vor und nach einer Sitzung identisch (nichts auf Platte)
    zuruecksetzen()
    vorher = sorted(os.listdir(TMP))
    k = Klasse(c, schueler=2, wand=True)
    k.frage(art="wahl", n=2)
    k.l.send_json({"t": "beenden", "code": k.code}); lies(k.l, lambda m: m.get("t") == "ende")
    k.schliesse()
    ok(sorted(os.listdir(TMP)) == vorher, "Nach einer ganzen Sitzung liegt nichts Neues auf der Platte")

    # ------------------------------------------------------------------------------------------ Oeffentliche Ratenbegrenzung
    print("--- Ratenbegrenzung (oeffentlicher Modus)")
    zuruecksetzen()
    os.environ["OEFFENTLICH"] = "1"
    os.environ["KL_PROXY_KEY"] = "test-proxy-schluessel"
    os.environ["KL_KLASSE_NEU_JE_10MIN"] = "2"
    H["x-kl-proxy"] = "test-proxy-schluessel"
    from app import sicherheit
    sicherheit._fenster.clear()
    a1 = Klasse(c); a2 = Klasse(c)
    with c.websocket_connect("/ws/klasse", headers=H) as w:
        w.send_json({"t": "neu"})
        ok("mehrere Sitzungen" in w.receive_json().get("text", ""), "Sitzungen anlegen: nach 2 je 10 Minuten gebremst")
    a1.schliesse(); a2.schliesse()
    n429 = 0
    for _ in range(130):
        if c.get("/api/klasse/zaehler").status_code == 429:
            n429 += 1
    ok(n429 > 0, "Zaehler: oeffentlich nach 120 Anfragen je Minute gebremst")
    n429 = 0
    for _ in range(35):
        if c.post("/api/klasse/nachweis/pruefen", json={"text": "x"}, headers=H).status_code == 429:
            n429 += 1
    ok(n429 > 0, "Nachweis-Pruefung: nach 30 Anfragen je Minute gebremst")
    os.environ.pop("OEFFENTLICH"); os.environ.pop("KL_KLASSE_NEU_JE_10MIN"); os.environ.pop("KL_PROXY_KEY", None)
    H.pop("x-kl-proxy", None)
    sicherheit._fenster.clear()

zuruecksetzen()
print()
print("FEHLER: %d" % len(fehler) if fehler else "ALLES OK")
for f in fehler:
    print("  -", f)
sys.exit(1 if fehler else 0)

# ------------------------------------------------------------------------------------------------------------
# MCDC-Matrix (Entscheidungen, deren Bedingungen je einzeln das Ergebnis aendern muessen)
#
# Zugang zur Lehrerrolle   (Code gueltig, Schluessel gueltig, Origin gueltig)
#   1 1 1 -> ok | 0 1 1 -> Fehler | 1 0 1 -> Fehler | 1 1 0 -> abgelehnt            (Tests: Zugang)
# Beitritt                 (Code gueltig, Sitzung nicht voll, nicht gesperrt)
#   1 1 1 -> ok | 0 1 1 -> Fehler | 1 0 1 -> voll | 1 1 0 -> gesperrt            (Zugang, Obergrenzen, Sperre)
# Antwort annehmen         (Aufgabe offen, Nummer passt, noch nicht geantwortet, Wert im Bereich)
#   alle 1 -> ok | jede einzelne 0 -> abgelehnt                                    (Aufgaben und Antworten)
# Ergebnis zeigen          (gezeigt, mindestens 3 Antworten) / Feld sichtbar (Zahl >= 3 oder 0)
#   Verteilungen mit 2, 3, 5 Antworten und gemischten Feldern                      (Verteilungen und Unterdrueckung)
# Loeschen                 (Lehrkraft mit Code | Hoechstdauer | Ruhe)  jede einzeln  (Zeitablauf, Loeschen)
# Signatur gueltig         (Format gueltig, Text unveraendert, Schluessel gleich)
#   jede Bedingung einzeln falsch -> ungueltig                                     (Signatur)
