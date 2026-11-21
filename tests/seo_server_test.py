#!/usr/bin/env python3
"""Server-Test fuer Adressen, Fragmente, robots.txt, sitemap.xml und Robots-Schutz (ohne Jetson, FastAPI-TestClient).
Beide Betriebsarten laufen als eigener Prozess (die Umgebungsvariablen werden beim Import gelesen).
Aufruf (im Repo-Wurzelverzeichnis):  python3 tests/seo_server_test.py"""
import os
import re
import subprocess
import sys

BASIS = "https://ki-labor.example.com"


def pruefe(modus):
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from fastapi.testclient import TestClient
    import app.app as m
    c = TestClient(m.app)
    oeff = modus == "oeffentlich"
    fehler = []

    def ok(bedingung, text):
        if not bedingung:
            fehler.append(text)

    # Seitenroute
    r = c.get("/rag-embedding")
    t = r.text
    ok(r.status_code == 200, "/rag-embedding 200")
    ok("<title>Vektorisieren und Embeddings · KI-Labor</title>" in t, "Titel")
    ok('<meta name="description" content="' in t, "Beschreibung")
    ok(f'<link rel="canonical" href="{BASIS}/rag-embedding">' in t, "canonical")
    for k in ("og:title", "og:description", "og:type", "og:url", "og:locale"):
        ok(f'property="{k}"' in t, k)
    ok('content="de_DE"' in t, "og:locale de_DE")
    ok('<meta name="author" content="Daniel Alisch">' in t, "Autor")
    ok('"@type": "Article"' in t or '"@type":"Article"' in t, "JSON-LD Article")
    ok("<h1>Vektorisieren und Embeddings</h1>" in t, "h1 im Rohtext")
    ok('<h2 class="abs">' in t, "Abschnitte")
    ok('href="/rag-suche"' in t, "echte Links")
    ok('<nav class="navscroll"' in t and t.count('class="nav" href="/') > 40, "Linkliste der Navigation")
    ok("Ein Projekt von" in t and 'href="https://daniel-alisch.site"' in t, "Fusszeile mit Autor")
    ok("Impressum" not in t and "Datenschutz</a>" not in t, "Rechtslinks nur wenn gesetzt")
    ok("#/" not in t.split("<footer")[0].split("<main")[1], "keine #/-Links im Fragment")
    # Startseite
    s = c.get("/").text
    ok("<h1>KI verstehen, indem du sie ausprobierst</h1>" in s, "Start h1")
    ok('"@type": "WebSite"' in s, "JSON-LD WebSite")
    ok(f'<link rel="canonical" href="{BASIS}/">' in s, "Start canonical")
    ok(c.get("/start", follow_redirects=False).status_code == 301, "/start leitet um")
    ok(c.get("/karte/", follow_redirects=False).headers.get("location") == "/karte", "/id/ leitet um")
    ok(c.get("/anlernen?beispiel=x").status_code == 200, "Abfrage bleibt erlaubt")
    # 404 und Unberuehrtes
    f = c.get("/gibt-es-nicht")
    ok(f.status_code == 404 and "Seite nicht gefunden" in f.text and "noindex" in f.text, "404 mit Oberflaeche und noindex")
    ok(c.get("/api/gibt-es-nicht").status_code == 404 and c.get("/api/gibt-es-nicht").headers["content-type"].startswith("application/json"), "/api/ unberuehrt")
    ok(c.get("/static/app.js").status_code == 200, "/static/ unberuehrt")
    ok(c.get("/constructor").status_code == 404 and c.get("/..%2fapp").status_code == 404, "Pfad nur aus der Allowlist")
    ok(c.get("/", headers={"host": "evil.example"}).status_code == 400, "fremder Host abgelehnt")
    ok(c.get("/", headers={"host": "ki-labor.example.com"}).status_code == 200, "Host aus OEFFENTLICHE_URL erlaubt")
    # robots, sitemap
    rb = c.get("/robots.txt").text
    sm = c.get("/sitemap.xml")
    if oeff:
        ok(r.headers["x-robots-tag"] == "index, follow", "X-Robots-Tag index")
        ok('<meta name="robots" content="index,follow">' in t, "Meta index")
        ok("Disallow: /api/" in rb and "Disallow: /ws/" in rb and "Disallow: /\n" not in rb, "robots erlaubt Seiten")
        ok(f"Sitemap: {BASIS}/sitemap.xml" in rb, "robots verweist auf Sitemap")
        ok(sm.status_code == 200 and f"<loc>{BASIS}/rag-embedding</loc>" in sm.text and f"<loc>{BASIS}/</loc>" in sm.text, "Sitemap listet Seiten")
        ok(sm.text.count("<loc>") == len(re.findall(r'class="nav" href="/', c.get("/").text)), "Sitemap = Navigation")
        ok(c.get("/api/stats").headers.get("x-robots-tag") == "noindex, nofollow", "API noindex")
    else:
        for url in ("/", "/rag-embedding", "/static/app.js", "/api/stats", "/robots.txt", "/gibt-es-nicht"):
            ok("noindex" in c.get(url).headers.get("x-robots-tag", ""), f"X-Robots-Tag noindex auf {url}")
        ok('<meta name="robots" content="noindex,nofollow">' in t, "Meta noindex")
        ok(rb.strip() == "User-agent: *\nDisallow: /", "robots sperrt alles")
        ok(sm.status_code == 404, "Sitemap intern 404")
    print(f"{modus}: {'FEHLER ' + str(fehler) if fehler else 'ok'}")
    return 1 if fehler else 0


if __name__ == "__main__":
    if len(sys.argv) > 1:
        sys.exit(pruefe(sys.argv[1]))
    wurzel = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    rc = 0
    for modus, extra in (("intern", {}), ("oeffentlich", {"OEFFENTLICH": "1"})):
        env = {k: v for k, v in os.environ.items() if k not in ("OEFFENTLICH", "OEFFENTLICHE_URL")}
        env.update(extra, OEFFENTLICHE_URL=BASIS)
        rc |= subprocess.run([sys.executable, __file__, modus], cwd=wurzel, env=env).returncode
    sys.exit(rc)
