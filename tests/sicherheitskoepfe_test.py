#!/usr/bin/env python3
"""Sicherheitsköpfe und Doku-Pfade je Betriebsart (FastAPI-TestClient, ohne Jetson).
Jede Betriebsart läuft als eigener Prozess, weil die Umgebungsvariablen beim Import gelesen werden.
Aufruf (Repo-Wurzel):  python3 tests/sicherheitskoepfe_test.py"""
import os
import subprocess
import sys

BASIS = "https://ki-labor.example.com"


def pruefe(modus):
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from fastapi.testclient import TestClient
    import app.app as m
    fehler = []

    def ok(b, t):
        if not b:
            fehler.append(f"[{modus}] {t}")
    oeff = modus == "oeffentlich"
    c = TestClient(m.app, base_url=BASIS if oeff else "https://testserver")
    for pfad in ("/", "/api/warteschlange", "/static/style.css", "/gibt-es-nicht"):
        r = c.get(pfad)
        h = r.headers
        ok(h.get("x-content-type-options") == "nosniff", f"{pfad} nosniff")
        ok(h.get("x-frame-options") == "DENY", f"{pfad} X-Frame-Options")
        ok("frame-ancestors 'none'" in (h.get("content-security-policy") or h.get("content-security-policy-report-only") or ""), f"{pfad} CSP")
        ok(h.get("referrer-policy") == "strict-origin-when-cross-origin", f"{pfad} Referrer-Policy")
        ok("camera=(self)" in h.get("permissions-policy", ""), f"{pfad} Permissions-Policy")
        ok(("strict-transport-security" in h) == oeff, f"{pfad} HSTS nur im öffentlichen Modus")
    ok("no-cache" in c.get("/").headers.get("cache-control", ""), "Seite no-cache")
    if modus == "doku":
        ok(c.get("/openapi.json").status_code == 200, "KL_API_DOKU=1 zeigt /openapi.json")
    else:
        for p in ("/docs", "/redoc", "/openapi.json"):
            ok(c.get(p).status_code == 404, f"{p} ist 404")
    if modus == "bericht":
        h = c.get("/").headers
        ok("content-security-policy-report-only" in h and "content-security-policy" not in h, "KL_CSP=report-only")
    for f in fehler:
        print("FEHLT", f)
    print(f"{modus}: {'OK' if not fehler else 'FEHLER'}")
    return 1 if fehler else 0


if __name__ == "__main__":
    if len(sys.argv) > 1:
        sys.exit(pruefe(sys.argv[1]))
    umgebungen = {"lan": {}, "oeffentlich": {"OEFFENTLICH": "1", "OEFFENTLICHE_URL": BASIS},
                  "doku": {"KL_API_DOKU": "1"}, "bericht": {"KL_CSP": "report-only"}}
    rc = 0
    for modus, env in umgebungen.items():
        e = {k: v for k, v in os.environ.items() if k not in ("OEFFENTLICH", "KL_API_DOKU", "KL_CSP", "OEFFENTLICHE_URL")}
        e.update(env)
        rc |= subprocess.run([sys.executable, os.path.abspath(__file__), modus], env=e, stdout=sys.stdout).returncode
    sys.exit(rc)
