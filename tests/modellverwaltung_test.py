"""Test der automatischen Modellverwaltung (app/speicher.py: modell_bereit, entladen) gegen ein simuliertes Ollama, ohne Jetson.
Aufruf (aus dem Repo-Wurzelordner, braucht httpx): python3 tests/modellverwaltung_test.py

Geprüft wird:
  1. Vor dem GPU-Laden werden andere GPU-Modelle entladen, CPU-Modelle (size_vram 0) bleiben.
  2. Ein Aufruf ohne GPU (num_gpu 0) entlädt nichts.
  3. Speicherfehler beim Laden: alles wird entladen und es geht in derselben Anfrage eine Stufe tiefer (24, 16, 8, 0), bis es läuft.
  4. Läuft nichts mehr (alle Stufen scheitern), liefert modell_bereit False statt endlos zu laden.
  5. Ein Fehler, der kein Speicherfehler ist (Modell fehlt), senkt die Stufe nicht.
  6. Feste Optionen werden nicht abgesenkt."""
import asyncio
import importlib.util
import json
import sys
from pathlib import Path

import httpx

spec = importlib.util.spec_from_file_location("speicher", Path(__file__).resolve().parent.parent / "app" / "speicher.py")
speicher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(speicher)
speicher.sicherstellen = lambda *a, **k: 9999          # kein echter Cache-Zugriff im Test
speicher.cache_leeren = lambda: (0, 0)

fehler = []


def pruefe(name, ok, info=""):
    print(("ok   " if ok else "FEHLT"), name, info)
    if not ok:
        fehler.append(name)


class FakeOllama:
    def __init__(self, geladen, schaffen_ab_stufe=None, fehlertext="cudaMalloc failed: out of memory", status=500):
        self.geladen = dict(geladen)                 # name -> size_vram
        self.max_gpu = schaffen_ab_stufe             # hoechste GPU-Schichtzahl, die noch laedt (None = alles laedt)
        self.fehlertext, self.status = fehlertext, status
        self.entladen, self.versuche = [], []

    def __call__(self, req):
        pfad = req.url.path
        if pfad == "/api/ps":
            return httpx.Response(200, json={"models": [{"name": n, "size_vram": v} for n, v in self.geladen.items()]})
        d = json.loads(req.content or b"{}")
        if d.get("keep_alive") == 0:
            self.entladen.append(d["model"])
            self.geladen.pop(d["model"], None)
            return httpx.Response(200, json={})
        gpu = d["options"]["num_gpu"]
        self.versuche.append(gpu)
        if self.max_gpu is not None and gpu > self.max_gpu:
            return httpx.Response(self.status, json={"error": self.fehlertext})
        self.geladen[d["model"]] = 0 if gpu == 0 else 1000
        return httpx.Response(200, json={"done": True})


async def lauf(fake, modell="llama3.2:3b", optionen=None):
    speicher._rueckfall.update(stufe=0, seit=0.0)
    speicher._lade_sperre = None
    async with httpx.AsyncClient(transport=httpx.MockTransport(fake)) as c:
        return await speicher.modell_bereit(modell, optionen=optionen, client=c)


# 1 + 2: Entladen
f = FakeOllama({"qwen3:8b": 5000, "nomic-embed-text": 0})
pruefe("1 laedt", asyncio.run(lauf(f)) is True)
pruefe("1 anderes GPU-Modell entladen", f.entladen == ["qwen3:8b"], str(f.entladen))
pruefe("1 CPU-Modell bleibt", "nomic-embed-text" in f.geladen)
f = FakeOllama({"qwen3:8b": 5000})
asyncio.run(lauf(f, optionen={"num_gpu": 0}))
pruefe("2 CPU-Aufruf entlaedt nichts", f.entladen == [], str(f.entladen))

# 3: Stufen
f = FakeOllama({}, schaffen_ab_stufe=8)
pruefe("3 laedt nach Absenken", asyncio.run(lauf(f)) is True)
pruefe("3 Reihenfolge 24, 16, 8", f.versuche == [24, 16, 8], str(f.versuche))
f = FakeOllama({}, schaffen_ab_stufe=0)
pruefe("3 faellt bis CPU zurueck", asyncio.run(lauf(f)) is True and f.versuche == [24, 16, 8, 0], str(f.versuche))

# 4: nichts geht
f = FakeOllama({}, schaffen_ab_stufe=-1)
pruefe("4 gibt auf", asyncio.run(lauf(f)) is False)
pruefe("4 hoechstens 5 Versuche", len(f.versuche) <= 5, str(f.versuche))

# 5: kein Speicherfehler
f = FakeOllama({}, schaffen_ab_stufe=-1, fehlertext="model 'x' not found", status=404)
pruefe("5 Modell fehlt: ein Versuch", asyncio.run(lauf(f)) is False and f.versuche == [24], str(f.versuche))
pruefe("5 Stufe bleibt", speicher._rueckfall["stufe"] == 0)

# 6: feste Optionen
f = FakeOllama({}, schaffen_ab_stufe=-1)
pruefe("6 feste Optionen: ein Versuch", asyncio.run(lauf(f, optionen={"num_gpu": 16})) is False and f.versuche == [16], str(f.versuche))

sys.exit(1 if fehler else 0)
