#!/usr/bin/env python3
"""Test der Warteschlange vor den Sprachmodellen (app/sicherheit.py, app/app.py), ohne Jetson und ohne Ollama.
Aufruf (im Repo-Wurzelverzeichnis):  python3 tests/warteschlange_test.py"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.sicherheit import Belegt, Warteschlange, umgebung_zahl  # noqa: E402

fehler = []


def ok(bedingung, text):
    print(("ok     " if bedingung else "FEHLER ") + text)
    if not bedingung:
        fehler.append(text)


async def einheiten():
    # Zwei Plaetze, zwei Warteplaetze: A und B laufen, C und D warten in Reihenfolge, E ist zu viel
    s = Warteschlange(parallel=2, max_wartend=2, max_warten_s=5)
    reihenfolge = []
    frei = asyncio.Event()

    async def lauf(name, halten):
        async with s.platz(name):
            reihenfolge.append(name)
            if halten:
                await frei.wait()

    a = asyncio.create_task(lauf("A", True)); b = asyncio.create_task(lauf("B", True))
    await asyncio.sleep(0.05)
    ok(s.aktiv == 2 and s.wartend == 0, "zwei Plaetze belegt, niemand wartet")
    ok(s.stand("C")["frei"] is False, "Stand meldet: nicht frei")
    c = asyncio.create_task(lauf("C", False)); await asyncio.sleep(0.02)
    d = asyncio.create_task(lauf("D", False)); await asyncio.sleep(0.02)
    ok(s.wartend == 2 and s.position("C") == 1 and s.position("D") == 2, "C ist Nr. 1, D ist Nr. 2")
    ok(s.position("A") == 0, "wer läuft, hat keine Platznummer")
    ok(s.voll(), "Schlange ist voll")
    try:
        await s.betreten("E")
        ok(False, "E haette abgelehnt werden muessen")
    except Belegt as e:
        ok(e.grund == "voll", "E wird sofort mit Grund 'voll' abgelehnt")
    ok(s.aktiv == 2 and s.wartend == 2, "abgelehntes E veraendert nichts")
    frei.set()
    await asyncio.gather(a, b, c, d)
    ok(reihenfolge == ["A", "B", "C", "D"], "Reihenfolge fair (FIFO): " + "".join(reihenfolge))
    ok(s.aktiv == 0 and s.wartend == 0, "am Ende ist alles frei")

    # Fehler im Lauf gibt den Platz frei
    try:
        async with s.platz("F"):
            raise RuntimeError("Absturz")
    except RuntimeError:
        pass
    ok(s.aktiv == 0, "Platz wird nach einem Fehler freigegeben")

    # Wartezeit abgelaufen
    s2 = Warteschlange(parallel=1, max_wartend=3, max_warten_s=0.1)
    await s2.betreten("X")
    try:
        await s2.betreten("Y")
        ok(False, "Y haette in die Zeitgrenze laufen muessen")
    except Belegt as e:
        ok(e.grund == "zeit", "Y gibt nach der Wartezeit auf (Grund 'zeit')")
    ok(s2.wartend == 0 and s2.aktiv == 1, "Y ist ausgetragen, X laeuft weiter")
    s2.freigeben()

    # Abbruch beim Warten (Besucher schliesst die Seite)
    s3 = Warteschlange(parallel=1, max_wartend=3, max_warten_s=5)
    await s3.betreten("X")
    w = asyncio.create_task(s3.betreten("Z")); await asyncio.sleep(0.02)
    ok(s3.position("Z") == 1, "Z wartet als Nr. 1")
    w.cancel()
    try:
        await w
    except asyncio.CancelledError:
        pass
    ok(s3.wartend == 0 and s3.aktiv == 1, "abgebrochenes Warten wird ausgetragen")
    s3.freigeben()
    ok(s3.aktiv == 0, "danach ist der Platz frei")

    # Umgebungsvariablen
    os.environ["T_ZAHL"] = "abc"
    ok(umgebung_zahl("T_ZAHL", 7) == 7, "ungueltige Umgebungszahl ergibt den Standard")
    os.environ["T_ZAHL"] = "3"
    ok(umgebung_zahl("T_ZAHL", 7) == 3, "gueltige Umgebungszahl wird gelesen")
    os.environ["T_ZAHL"] = "0"
    ok(umgebung_zahl("T_ZAHL", 7) == 7, "Wert unter dem Minimum ergibt den Standard")


def schnittstelle():
    from fastapi.testclient import TestClient
    import app.app as m
    c = TestClient(m.app)
    kopf = {"origin": "http://testserver"}
    r = c.get("/api/warteschlange")
    j = r.json()
    ok(r.status_code == 200 and j["meine_position"] == 0 and j["parallel"] == m.LLM_PARALLEL and j["frei"] is True, "GET /api/warteschlange: frei, Platz 0")
    ok("warteschlange" in c.get("/api/stats").json(), "/api/stats nennt die Belegung")

    # Alles belegt und kein Warteplatz: die drei Sprachmodell-Endpunkte antworten freundlich mit 503
    m._llm = Warteschlange(parallel=1, max_wartend=0)
    m._llm._aktiv = 1
    for pfad, body in (("/api/chat", {"nachricht": "Hallo"}), ("/api/rag/ask", {"frage": "Wie viel?"}), ("/api/agent/ask", {"frage": "Wie viel ist 2+2?"})):
        r = c.post(pfad, json=body, headers=kopf)
        j = r.json()
        ok(r.status_code == 503 and j.get("belegt") is True and r.headers.get("retry-after") == str(m.WIEDERHOLEN_S), pfad + ": 503 mit belegt und Retry-After")
        ok("ausgelastet" in j["fehler"] and "nichts falsch" in j["fehler"], pfad + ": freundlicher Text ohne Schuldzuweisung")
    # Der Origin-Schutz bleibt vor der Warteschlange erhalten
    ok(c.post("/api/chat", json={"nachricht": "Hallo"}).status_code == 403, "ohne Origin weiterhin 403")

    # Warteplatz frei, aber alles belegt: der Strom wartet, bis der Platz kommt, danach laeuft die Antwort durch
    m._llm = Warteschlange(parallel=1, max_wartend=1, max_warten_s=0.2)
    m._llm._aktiv = 1
    r = c.post("/api/chat", json={"nachricht": "Hallo"}, headers=kopf)
    ok(r.status_code == 200 and "ausgelastet" in r.text and r.text.startswith("["), "Wartezeit abgelaufen: Antworttext meldet 'ausgelastet'")
    ok(m._llm.wartend == 0 and m._llm.aktiv == 1, "nach Ablauf ist niemand mehr eingetragen")


asyncio.run(einheiten())
schnittstelle()
print("\n%d Fehler." % len(fehler))
sys.exit(1 if fehler else 0)
