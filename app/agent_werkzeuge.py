"""Szenario-Werkzeuge fuer den Agenten (Beispiel-Katalog der Business-Use-Cases).

Ein Szenario bringt eigene Werkzeuge und einen eigenen Systemtext mit. Die Daten sind frei erfunden und liegen unter
app/static/beispiele/. Das Modell rechnet nie selbst: Preise, Fristen und Regeln stecken in den Werkzeugen.

    from app import agent_werkzeuge
    agent_werkzeuge.SZENARIEN            # erlaubte Szenario-IDs
    agent_werkzeuge.definitionen(id)     # Werkzeugliste im Ollama-Format
    agent_werkzeuge.system(id)           # Systemtext
    agent_werkzeuge.ausfuehren(id, name, args) -> str oder None, wenn das Werkzeug nicht zum Szenario gehoert
"""
import json
from pathlib import Path

_BEISPIELE = Path(__file__).resolve().parent / "static" / "beispiele"
SZENARIEN = {"service-bestellung"}

_cache = {}


def _daten():
    if "d" not in _cache:
        bestellungen = json.loads((_BEISPIELE / "daten" / "bestellungen.json").read_text(encoding="utf-8"))["bestellungen"]
        manifest = json.loads((_BEISPIELE / "manifest.json").read_text(encoding="utf-8"))
        uc = next(u for u in manifest["usecases"] if u["id"] == "service-bestellung")
        _cache["d"] = ({b["nummer"]: b for b in bestellungen}, uc["daten"])
    return _cache["d"]


def definitionen(szenario):
    if szenario != "service-bestellung":
        return []
    _, daten = _daten()
    return [{"type": "function", "function": {"name": w["name"], "description": w["beschreibung"], "parameters": w["parameter"]}}
            for w in daten["werkzeuge"]]


def system(szenario):
    if szenario != "service-bestellung":
        return None
    _, daten = _daten()
    regeln = " ".join(daten["regeln"].values())
    return ("Du bist ein freundlicher Assistent im Kundenservice eines Online-Händlers. Für jede Auskunft zu Bestellungen, "
            "Preisen oder Stornierungen benutzt du die Werkzeuge. Du rechnest nie selbst und erfindest nichts. Stornieren kannst "
            "du nicht, du kannst nur prüfen, ob es möglich wäre. Zu einem Kunden suchst du mit bestellungen_suchen und liest den Status "
            "in der Liste (zum Beispiel storniert). Antworte in höchstens drei Sätzen auf Deutsch und nenne die "
            "Bestellnummer. Regeln des Händlers: " + regeln)


def _bestellung(nummer):
    b = _daten()[0].get(str(nummer).strip().upper())
    return b


def _bestellstatus(nummer):
    b = _bestellung(nummer)
    if not b:
        return {"fehler": "Bestellung nicht gefunden"}
    return {"nummer": b["nummer"], "status": b["status"], "lieferdatum": b.get("lieferdatum"),
            "lieferdatum_art": b.get("lieferdatum_art"), "tracking": b.get("tracking"), "positionen": b["positionen"]}


def _preis_berechnen(nummer):
    b = _bestellung(nummer)
    if not b:
        return {"fehler": "Bestellung nicht gefunden"}
    zwischen = round(sum(p["menge"] * p["einzelpreis"] for p in b["positionen"]), 2)
    versand = 4.90 if zwischen < 50 else 0.0
    return {"nummer": b["nummer"], "zwischensumme": zwischen, "versandkosten": versand,
            "gesamt": round(zwischen + versand, 2), "waehrung": "EUR"}


def _stornierung_pruefen(nummer):
    b = _bestellung(nummer)
    if not b:
        return {"fehler": "Bestellung nicht gefunden"}
    ok = b["status"] in ("bestellt", "in Bearbeitung")
    grund = ('Status "%s" erlaubt die Stornierung.' % b["status"]) if ok else \
            ('Status "%s" erlaubt keine Stornierung mehr. Ab "versendet" hilft nur eine Rücksendung.' % b["status"])
    return {"nummer": b["nummer"], "status": b["status"], "stornierbar": ok, "grund": grund}


def _bestellungen_suchen(kunde):
    k = str(kunde).strip().upper()
    treffer = [{"nummer": b["nummer"], "datum": b["datum"], "status": b["status"]}
               for b in _daten()[0].values() if k and k in b["kunde"].upper()]
    return {"kunde": kunde, "bestellungen": treffer} if treffer else {"fehler": "Kein Kunde mit diesem Kuerzel gefunden"}


def ausfuehren(szenario, name, args):
    if szenario != "service-bestellung":
        return None
    f = {"bestellstatus": ("nummer", _bestellstatus), "preis_berechnen": ("nummer", _preis_berechnen),
         "stornierung_pruefen": ("nummer", _stornierung_pruefen), "bestellungen_suchen": ("kunde", _bestellungen_suchen)}.get(name)
    if not f:
        return None
    return json.dumps(f[1](args.get(f[0], "")), ensure_ascii=False)
