#!/usr/bin/env python3
"""Pruefung der Proxy-Regeln (origin_ok, Besucheradresse) ohne Jetson: python3 tests/proxy_test.py"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ["KL_PROXY_KEY"] = "geheimer-test-schluessel"
from app.sicherheit import client_kennung, origin_ok  # noqa: E402


class Anfrage:
    def __init__(self, headers, host="10.0.0.1"):
        self.headers = headers
        self.client = type("C", (), {"host": host})()


fehler = []


def ok(bedingung, text):
    print(("OK    " if bedingung else "FEHLT ") + text)
    if not bedingung:
        fehler.append(text)


H = "ki-labor-origin.example.com"
O = "https://ki-labor.example.com"
S = "geheimer-test-schluessel"
ok(origin_ok({"origin": f"https://{H}", "host": H}), "Origin gleich Host: erlaubt")
ok(not origin_ok({"host": H}), "ohne Origin: abgelehnt")
ok(not origin_ok({"origin": O, "host": H}), "fremder Origin ohne Proxy-Schluessel: abgelehnt")
ok(not origin_ok({"origin": O, "host": H, "x-forwarded-host": "ki-labor.example.com"}), "X-Forwarded-Host ohne Schluessel: abgelehnt")
ok(not origin_ok({"origin": O, "host": H, "x-forwarded-host": "ki-labor.example.com", "x-kl-proxy": "falsch"}), "falscher Schluessel: abgelehnt")
ok(origin_ok({"origin": O, "host": H, "x-forwarded-host": "ki-labor.example.com", "x-kl-proxy": S}), "Origin gleich X-Forwarded-Host mit Schluessel: erlaubt")
ok(not origin_ok({"origin": "https://boese.example.org", "host": H, "x-forwarded-host": "ki-labor.example.com", "x-kl-proxy": S}), "dritter Origin mit Schluessel: abgelehnt")
ok(client_kennung(Anfrage({"x-real-ip": "203.0.113.7", "x-kl-proxy": S})) == "203.0.113.7", "Besucheradresse aus X-Real-IP mit Schluessel")
ok(client_kennung(Anfrage({"x-real-ip": "203.0.113.7"})) == "10.0.0.1", "X-Real-IP ohne Schluessel wird ignoriert")
ok(client_kennung(Anfrage({"x-real-ip": "1.2.3.4, 5.6.7.8", "x-kl-proxy": S})) == "10.0.0.1", "Liste statt einer Adresse in X-Real-IP wird verworfen")
ok(client_kennung(Anfrage({"x-real-ip": "<script>", "x-kl-proxy": S})) == "10.0.0.1", "Unsinn in X-Real-IP wird verworfen")
ok(client_kennung(Anfrage({"cf-connecting-ip": "198.51.100.2"})) == "10.0.0.1", "mit eingerichtetem Proxy-Schluessel, aber ohne Schluessel in der Anfrage: CF-Connecting-IP wird ignoriert")
ok(client_kennung(Anfrage({"cf-connecting-ip": "198.51.100.2", "x-kl-proxy": "falsch"})) == "10.0.0.1", "falscher Schluessel: CF-Connecting-IP wird ignoriert")
_k = os.environ.pop("KL_PROXY_KEY")
ok(client_kennung(Anfrage({"cf-connecting-ip": "198.51.100.2"})) == "198.51.100.2", "ganz ohne eingerichteten Schluessel (alter Aufbau): Rueckfall auf CF-Connecting-IP")
os.environ["KL_PROXY_KEY"] = _k
from app.sicherheit import begrenzt  # noqa: E402
ok(client_kennung(Anfrage({"x-real-ip": "2001:db8:1:2::1", "x-kl-proxy": S})) == client_kennung(Anfrage({"x-real-ip": "2001:db8:1:2:aaaa:bbbb:cccc:dddd", "x-kl-proxy": S})),
   "IPv6: wechselnde Adressen im selben /64 sind derselbe Absender")
ok(client_kennung(Anfrage({"x-real-ip": "::ffff:203.0.113.5", "x-kl-proxy": S})) == "203.0.113.5", "IPv4-gemappte Adresse zaehlt als IPv4")
ok(client_kennung(Anfrage({"x-real-ip": "::ffff:203.0.113.5", "x-kl-proxy": S})) != client_kennung(Anfrage({"x-real-ip": "::ffff:198.51.100.77", "x-kl-proxy": S})),
   "verschiedene IPv4-gemappte Besucher bleiben getrennt")
gesperrt = [begrenzt(Anfrage({"x-real-ip": "2001:db8:9:9:%x::1" % i, "x-kl-proxy": S}), "rotation-test", 3) for i in range(6)]
ok(gesperrt == [False, False, False, True, True, True], "begrenzt(): Adresswechsel im selben /64 umgeht das Limit nicht")
sys.exit(1 if fehler else 0)
