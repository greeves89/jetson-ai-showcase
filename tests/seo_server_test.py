#!/usr/bin/env python3
"""Server-Test fuer Adressen, Fragmente, robots.txt, sitemap.xml und Robots-Schutz (ohne Jetson, FastAPI-TestClient).
Beide Betriebsarten laufen als eigener Prozess (die Umgebungsvariablen werden beim Import gelesen).
Aufruf (im Repo-Wurzelverzeichnis):  python3 tests/seo_server_test.py"""
import json
import os
import re
import subprocess
import sys

BASIS = "https://ki-labor.example.com"
INDEXNOW_TEST = "testschluessel-0123456789"   # nur fuer den Test, kein echter Schluessel


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
    ok('"Article"' in t and '"LearningResource"' in t, "JSON-LD Article und LearningResource")
    ok("<h1>Vektorisieren und Embeddings</h1>" in t, "h1 im Rohtext")
    ok('<h2 class="abs">' in t, "Abschnitte")
    ok('href="/rag-suche"' in t, "echte Links")
    ok('<nav class="navscroll"' in t and t.count('class="nav" href="/') > 40, "Linkliste der Navigation")
    ok("Ein Projekt von" in t and 'href="https://daniel-alisch.site"' in t, "Fusszeile mit Autor")
    seite = json.load(open(os.path.join(os.path.dirname(m.__file__), "static", "module.json")))["seite"]
    fuss = t.split("<footer")[1]
    ok(("Impressum</a>" in fuss) == bool(seite.get("impressum_url")) and ("Datenschutz</a>" in fuss) == bool(seite.get("datenschutz_url")), "Rechtslinks nur wenn gesetzt")
    ok("#/" not in t.split("<footer")[0].split("<main")[1], "keine #/-Links im Fragment")
    # Startseite
    s = c.get("/").text
    ok("<h1>KI verstehen, indem du sie ausprobierst</h1>" in s, "Start h1")
    ok('"WebSite"' in s, "JSON-LD WebSite")
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
    # JSON-LD, Open Graph, Beschreibung
    lds = [json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>', t, re.S)]
    ok(len(lds) == 1 and lds[0].get("@context") == "https://schema.org", "JSON-LD parsebar mit @context")
    typen = {x for k in lds[0].get("@graph", []) for x in (k["@type"] if isinstance(k["@type"], list) else [k["@type"]])}
    ok({"Article", "LearningResource", "BreadcrumbList", "VideoObject", "FAQPage"} <= typen, f"JSON-LD Typen der Seite: {sorted(typen)}")
    art = next(k for k in lds[0]["@graph"] if "Article" in (k["@type"] if isinstance(k["@type"], list) else [k["@type"]]))
    # Autor als Entitaet: ein Person-Knoten, alle anderen verweisen per @id darauf
    personen = [k for k in lds[0]["@graph"] if k["@type"] == "Person"]
    pid = "https://daniel-alisch.site/#person"
    ok(len(personen) == 1 and personen[0]["@id"] == pid and personen[0]["name"] == "Daniel Alisch" and personen[0]["url"] == seite["autor_url"], "Person-Knoten mit @id, Name, url")
    ok(personen and personen[0].get("sameAs") == seite.get("autor_profile") and len(seite.get("autor_profile", [])) >= 1, "Person sameAs aus module.json")
    ok(art["isAccessibleForFree"] is True and art["inLanguage"] == "de" and art["author"] == {"@id": pid} and art["publisher"] == {"@id": pid}, "Article: frei, de, Autor und Herausgeber per @id")
    web = next((k for k in lds[0]["@graph"] if k["@type"] == "WebSite"), {})
    ok(web.get("@id") == f"{BASIS}/#website" and web.get("publisher") == {"@id": pid} and web.get("author") == {"@id": pid}, "WebSite mit publisher und author auf jeder Seite")
    ok(art.get("abstract") and art["abstract"] in t, "Article: abstract = Kurzfassung im Rohtext")
    ok(re.search(r'<h1>[^<]+</h1><p class="kurzgesagt"><strong>Kurz gesagt:</strong> [^<]{60,}</p>', t), "Kurzfassung direkt nach dem h1")
    ok(re.fullmatch(r"\d{4}-\d{2}-\d{2}", art["datePublished"]) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", art["dateModified"]), "Article: Datumsangaben")
    ok(art["teaches"] and art["about"] and art["educationalLevel"], "Article: teaches, about, educationalLevel")
    ok(art["image"] == [f"{BASIS}/static/og/wissen-und-rag.png"], "Article: Bild des Bereichs")
    ok("__BASIS__" not in t and f'"{BASIS}/rag-embedding#breadcrumb"' in t, "Basis im JSON-LD ersetzt, Breadcrumb")
    ok(f'<meta property="og:image" content="{BASIS}/static/og/wissen-und-rag.png">' in t, "og:image des Bereichs")
    ok('property="og:image:alt"' in t and 'content="1200"' in t and 'content="630"' in t, "og:image:alt und Maße")
    ok('<meta name="twitter:card" content="summary_large_image">' in t and 'name="twitter:image"' in t, "twitter:card large")
    ok(f'<link rel="alternate" hreflang="de" href="{BASIS}/rag-embedding">' in t, "hreflang de")
    ok(c.get("/static/og/standard.png").headers["content-type"] == "image/png" and f'{BASIS}/static/og/standard.png' in s, "Standardbild auf der Startseite")
    sd = re.search(r'<meta name="description" content="([^"]+)"', t).group(1)
    ok(120 <= len(sd) <= 160, f"description 120 bis 160 Zeichen: {len(sd)}")
    ok(len(re.search(r"<title>([^<]+)</title>", t).group(1)) <= 60, "Titel hoechstens 60 Zeichen")
    ldstart = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S).group(1))["@graph"]
    kurs = next((k for k in ldstart if k["@type"] == "Course"), {})
    ok(kurs.get("provider") == {"@id": pid} and kurs.get("author") == {"@id": pid}, "Course: provider und author per @id")
    ok('<p class="kurzgesagt"><strong>Kurz gesagt:</strong>' in s, "Start: Kurzfassung")
    # Seite "Ueber das Labor"
    u = c.get("/ueber")
    ut = u.text
    ok(u.status_code == 200 and "<h1>Über das KI-Labor</h1>" in ut and "Daniel Alisch" in ut.split("<main")[1], "/ueber mit h1 und Autor")
    ulg = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', ut, re.S).group(1))["@graph"]
    about = next((k for k in ulg if k["@type"] == "AboutPage"), {})
    ok(about.get("@id") == f"{BASIS}/ueber" and about.get("mainEntity") == {"@id": pid} and about.get("isPartOf") == {"@id": f"{BASIS}/#website"}, "/ueber: AboutPage mit Autor als Hauptgegenstand")
    ok(any(k["@type"] == "Person" for k in ulg), "/ueber: Person-Knoten")
    ok('class="nav" href="/ueber"' in s, "/ueber in der Navigation")
    sg = {x for k in json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S).group(1))["@graph"] for x in ([k["@type"]] if isinstance(k["@type"], str) else k["@type"])}
    ok({"WebSite", "Course", "ItemList", "DefinedTermSet", "BreadcrumbList", "CollectionPage"} <= sg, f"JSON-LD der Startseite: {sorted(sg)}")
    ok('rel="preload" as="script" href="/static/content-rag.js?v=' in t, "Vorladen der Inhaltsdateien")
    ok(c.get("/static/app.js?v=1").headers["cache-control"] == "public, max-age=31536000, immutable", "Cache-Control mit Versionsparameter")
    ok(c.get("/static/app.js").headers["cache-control"] == "no-cache", "Cache-Control ohne Versionsparameter")
    ok(c.get("/static/content.js", headers={"accept-encoding": "gzip"}).headers.get("content-encoding") == "gzip", "gzip fuer JavaScript")
    ok(c.get("/api/stats", headers={"accept-encoding": "gzip"}).headers.get("content-encoding") != "gzip", "kein gzip unter /api/")
    ok(c.get("/static/videos/rag-embedding.vtt", headers={"accept-encoding": "gzip"}).status_code in (200, 404), "Untertitel erreichbar")
    lk, lv = c.get("/llms.txt"), c.get("/llms-full.txt")
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
        for bot in ("GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot", "OAI-SearchBot"):
            ok(f"User-agent: {bot}\nAllow: /\nDisallow: /api/\nDisallow: /ws/" in rb, f"robots erlaubt {bot}")
        ok("<lastmod>" in sm.text and sm.text.count("<lastmod>") == sm.text.count("<loc>") and "<image:loc>" in sm.text and "<video:content_loc>" in sm.text, "Sitemap mit lastmod, Bild und Video")
        ok(lk.status_code == 200 and lk.text.startswith("# KI-Labor\n\n> ") and f"({BASIS}/rag-embedding)" in lk.text and "__BASIS__" not in lk.text, "llms.txt")
        ok(lv.status_code == 200 and f"Adresse: {BASIS}/rag-embedding" in lv.text and "Frage: " in lv.text and "# Glossar" in lv.text, "llms-full.txt")
        ok('<link rel="alternate" type="text/plain" href="' + BASIS + '/llms.txt"' in t, "llms.txt-Link im Kopf")
        ok(f"{BASIS}/llms-full.txt" in lk.text, "llms.txt nennt llms-full.txt")
        ok("\n## Optional\n" in lk.text and "Autor und Herausgeber: Daniel Alisch (https://daniel-alisch.site)" in lk.text and "Lizenz der Inhalte:" in lk.text, "llms.txt: Optional, Autor, Lizenz")
        ok(f"- [Über das KI-Labor]({BASIS}/ueber): " in lk.text and "Lizenz der Inhalte:" in lv.text and "Kurz gesagt: " in lv.text, "llms: Ueber-Seite, Lizenz, Kurzfassungen")
        ok(not re.search(r"[–—]", lk.text + lv.text), "llms ohne Gedankenstrich")
        ik = c.get(f"/{INDEXNOW_TEST}.txt")
        ok(ik.status_code == 200 and ik.text == INDEXNOW_TEST and ik.headers["content-type"].startswith("text/plain"), "IndexNow-Schluesseldatei")
        ok(c.get("/falscher-schluessel-123.txt").status_code == 404, "IndexNow: nur der eigene Schluessel")
    else:
        for url in ("/", "/rag-embedding", "/static/app.js", "/api/stats", "/robots.txt", "/gibt-es-nicht"):
            ok("noindex" in c.get(url).headers.get("x-robots-tag", ""), f"X-Robots-Tag noindex auf {url}")
        ok('<meta name="robots" content="noindex,nofollow">' in t, "Meta noindex")
        ok(rb.strip() == "User-agent: *\nDisallow: /", "robots sperrt alles")
        ok(sm.status_code == 404, "Sitemap intern 404")
        ok(lk.status_code == 404 and lv.status_code == 404, "llms.txt intern 404")
        ok("llms.txt" not in t, "kein llms.txt-Link intern")
        ok(c.get(f"/{INDEXNOW_TEST}.txt").status_code == 404, "IndexNow-Schluesseldatei intern 404")
    print(f"{modus}: {'FEHLER ' + str(fehler) if fehler else 'ok'}")
    return 1 if fehler else 0


if __name__ == "__main__":
    if len(sys.argv) > 1:
        sys.exit(pruefe(sys.argv[1]))
    wurzel = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    rc = 0
    for modus, extra in (("intern", {}), ("oeffentlich", {"OEFFENTLICH": "1"})):
        env = {k: v for k, v in os.environ.items() if k not in ("OEFFENTLICH", "OEFFENTLICHE_URL")}
        env.update(extra, OEFFENTLICHE_URL=BASIS, INDEXNOW_KEY=INDEXNOW_TEST)
        rc |= subprocess.run([sys.executable, __file__, modus], cwd=wurzel, env=env).returncode
    sys.exit(rc)
