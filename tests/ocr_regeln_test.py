"""Regeltest der Textauswertung (app/ocr_regeln.py) ohne Modell und ohne Kamera: Betrag, Datum, Uhrzeit, Telefon, E-Mail,
IBAN, Silbentrennung, Lesereihenfolge, Absaetze, Mehrheitsentscheid ueber mehrere Bilder.
Aufruf (aus dem Repo-Wurzelordner, braucht nur Python): python3 tests/ocr_regeln_test.py"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from app import ocr_regeln as R  # noqa: E402

fehler = []


def pruefe(ok, text):
    print(("OK    " if ok else "FEHLT ") + text)
    if not ok:
        fehler.append(text)


def arten(zeilen):
    return [(k["art"], k["wert"]) for k in R.fakten(zeilen)]


# --------------------------------------------------------------------------- Betraege
pruefe(arten(["Gesamtbetrag: 1.234,56 €"]) == [("betrag", "1234.56")], "Betrag mit Tausenderpunkt und Komma")
pruefe(arten(["Summe 12,5 EUR"]) == [("betrag", "12.50")], "Betrag mit einer Nachkommastelle und EUR")
pruefe(arten(["Preis: 7 Euro"]) == [("betrag", "7.00")], "Betrag ohne Cent mit Euro")
pruefe(arten(["Summe € 99,90"]) == [("betrag", "99.90")], "Euro-Zeichen vor dem Betrag")
pruefe(arten(["Menge 1.234 Stück"]) == [], "Zahl ohne Waehrung ist kein Betrag")
pruefe(arten(["Nr. 2026-0815"]) == [], "Rechnungsnummer ist weder Betrag noch Datum noch Telefon")
pruefe(arten(["19 % MwSt"]) == [("prozent", "19")] and arten(["7,5 %"]) == [("prozent", "7.5")], "Prozent")
# --------------------------------------------------------------------------- Datum
pruefe(arten(["Datum: 27.11.2026"]) == [("datum", "2026-11-27")], "Datum mit Punkten")
pruefe(arten(["am 1.2.26"]) == [("datum", "2026-02-01")], "Datum mit zweistelligem Jahr")
pruefe(arten(["am 27. November 2026"]) == [("datum", "2026-11-27")], "Datum mit Monatsname")
pruefe(arten(["gültig bis 2027-01-31"]) == [("datum", "2027-01-31")], "Datum nach ISO")
pruefe(arten(["32.13.2026"]) == [], "unmögliches Datum (Tag 32, Monat 13) wird nicht angezeigt")
pruefe(arten(["Version 1.2.3.4"]) == [], "Versionsnummer ist kein Datum")
# --------------------------------------------------------------------------- Uhrzeit
pruefe(arten(["Abholung um 14:30 Uhr"]) == [("uhrzeit", "14:30")], "Uhrzeit mit Doppelpunkt und Uhr")
pruefe(arten(["ab 9.15 Uhr"]) == [("uhrzeit", "09:15")], "Uhrzeit mit Punkt nur mit Uhr")
pruefe(arten(["um 9 Uhr"]) == [("uhrzeit", "09:00")], "volle Stunde")
pruefe(arten(["Preis 14.30"]) == [], "14.30 ohne Uhr ist keine Uhrzeit")
pruefe(arten(["25:61"]) == [], "25:61 ist keine Uhrzeit")
pruefe(arten(["27.11.2026 14:30"]) == [("datum", "2026-11-27"), ("uhrzeit", "14:30")], "Datum und Uhrzeit nebeneinander")
# --------------------------------------------------------------------------- E-Mail, Telefon, IBAN, Web
pruefe(arten(["E-Mail: kontakt@example.com"]) == [("email", "kontakt@example.com")], "E-Mail")
pruefe(arten(["Telefon: 0511 1234567"]) == [("telefon", "05111234567")], "Telefonnummer mit Leerzeichen")
pruefe(arten(["Tel +49 (0) 30 123456-78"]) == [("telefon", "+4903012345678")], "Telefonnummer mit (0) und Bindestrich")
pruefe(arten(["+49 511 1234567"]) == [("telefon", "+495111234567")], "Telefonnummer mit +49")
pruefe(arten(["Telefon 0511/123 45 67"]) == [("telefon", "05111234567")], "Telefonnummer mit Schrägstrich")
pruefe(arten(["PLZ 30159"]) == [], "Postleitzahl ist keine Telefonnummer")
pruefe(arten(["kontakt@example.com"]) == [("email", "kontakt@example.com")], "E-Mail wird nicht zusätzlich Telefon oder Web")
pruefe(arten(["IBAN: DE89 3704 0044 0532 0130 00"]) == [("iban", "DE89370400440532013000")], "IBAN mit gültiger Prüfziffer")
pruefe(arten(["IBAN: DE00 3704 0044 0532 0130 00"]) == [], "IBAN mit falscher Prüfziffer wird verworfen")
pruefe(arten(["siehe www.example.com/info."]) == [("web", "www.example.com/info")], "Webadresse ohne Schlusspunkt")
pruefe(len(R.fakten(["Datum: 27.11.2026", "Datum: 27.11.2026"])) == 1, "gleicher Wert nur einmal")
karte = R.fakten(["Rechnung am 27.11.2026"])[0]
pruefe(karte["name"] == "Datum" and karte["text"] == "27.11.2026" and karte["zeile"] == 0, "Karte hat Name, Text und Zeile")


# --------------------------------------------------------------------------- Silbentrennung, Absaetze, Reihenfolge
def kasten(x0, y0, x1, y1, *woerter, s=0.95):
    return {"x0": x0, "y0": y0, "x1": x1, "y1": y1, "woerter": [{"t": t, "s": s} for t in woerter]}


def lies(kaesten, breite=1000):
    return R.zeilen_bauen(R.lesereihenfolge(kaesten, breite))


z = lies([kasten(50, 100, 700, 140, "Bitte", "überweise", "inner-"), kasten(50, 150, 400, 190, "halb", "von", "vierzehn")])
pruefe([R.zeilentext(x) for x in z] == ["Bitte überweise innerhalb", "von vierzehn"], "Silbentrennung wird zusammengezogen")
z = lies([kasten(50, 100, 700, 140, "Ein-"), kasten(50, 150, 400, 190, "und", "Ausgang")])
pruefe([R.zeilentext(x) for x in z] == ["Ein-", "und Ausgang"], "Ein- und Ausgang bleibt getrennt")
z = lies([kasten(50, 100, 700, 140, "Wohn-"), kasten(50, 150, 400, 190, "Zimmer")])
pruefe([R.zeilentext(x) for x in z] == ["Wohn-", "Zimmer"], "Bindestrich vor Großbuchstaben bleibt (Wohn-Zimmer)")
z = lies([kasten(50, 100, 700, 140, "inner-"), kasten(50, 260, 400, 300, "halb")])
pruefe([R.zeilentext(x) for x in z] == ["inner-", "halb"], "Absatz zwischen den Zeilen verhindert das Zusammenziehen")
z = lies([kasten(50, 100, 700, 140, "Nummer-"), kasten(50, 150, 400, 190, "2", "folgt")])
pruefe(R.zeilentext(z[0]) == "Nummer-", "Bindestrich vor einer Zahl bleibt")
z = lies([kasten(50, 100, 700, 140, "Wort", "-"), kasten(50, 150, 400, 190, "ende")])
pruefe(R.zeilentext(z[0]) == "Wort -", "alleinstehender Strich wird nicht zusammengezogen")
z = lies([kasten(50, 100, 700, 140, "Beste", "Grüße,", s=0.5), kasten(50, 150, 400, 190, "Anna")])
pruefe(len(z) == 2 and z[0]["woerter"][0]["s"] == 0.5, "Sicherheit der Wörter bleibt erhalten")
z = lies([kasten(50, 100, 300, 140, "Datum:"), kasten(600, 105, 900, 145, "27.11.2026")])
pruefe([R.zeilentext(x) for x in z] == ["Datum: 27.11.2026"], "Bezeichnung und Wert auf einer Zeile")
z = lies([kasten(50, 300, 400, 340, "unten"), kasten(50, 100, 400, 140, "oben")])
pruefe([R.zeilentext(x) for x in z] == ["oben", "unten"], "Zeilen von oben nach unten")
z = lies([kasten(50, 100, 400, 140, "a"), kasten(50, 150, 400, 190, "b"), kasten(50, 400, 400, 440, "c")])
pruefe([x["absatz"] for x in z] == [False, False, True], "Absatz bei grossem Abstand")
text = R.text_aus(z)
pruefe(text == "a\nb\n\nc", "Text hat Zeilenumbrüche und eine Leerzeile vor dem Absatz")
# Fliesstext
z = lies([kasten(50, 100, 950, 140, "Das", "ist", "ein", "langer"), kasten(50, 150, 950, 190, "Satz", "der"), kasten(50, 200, 400, 240, "weitergeht.")])
pruefe(R.fliesstext(z) == "Das ist ein langer Satz der weitergeht.", "Fließtext verbindet volle Zeilen")
z = lies([kasten(50, 100, 400, 140, "Kaffee", "2,50"), kasten(50, 150, 950, 190, "Kuchen", "3,50"), kasten(50, 200, 300, 240, "Tee")])
pruefe(R.fliesstext(z).count("\n") >= 1, "Fließtext lässt kurze Zeilen (Listen) stehen")
# Zwei Spalten
spalten = []
for i in range(5):
    spalten.append(kasten(50, 100 + i * 50, 450, 140 + i * 50, "links%d" % i))
    spalten.append(kasten(550, 100 + i * 50, 950, 140 + i * 50, "rechts%d" % i))
z = lies(spalten)
pruefe([R.zeilentext(x) for x in z][:5] == ["links%d" % i for i in range(5)] and R.zeilentext(z[5]) == "rechts0", "zwei Spalten: erst links, dann rechts")
# Speisekarte mit Preisspalte rechts bleibt zeilenweise
karte_k = []
for i in range(6):
    karte_k.append(kasten(50, 100 + i * 50, 500, 140 + i * 50, "Gericht%d" % i))
    karte_k.append(kasten(800, 100 + i * 50, 950, 140 + i * 50, "%d,50" % (i + 5)))
z = lies(karte_k)
pruefe(R.zeilentext(z[0]) == "Gericht0 5,50" and len(z) == 6, "Preise am rechten Rand bleiben bei ihrer Zeile (keine Spalte)")

# --------------------------------------------------------------------------- Sicherheit in Worten
pruefe(R.stufe(0.95) == "sicher" and R.stufe(0.7) == "unsicher" and R.stufe(0.3) == "sehr unsicher", "Stufen der Sicherheit")
pruefe(R.stufe(R.SICHER) == "sicher" and R.stufe(R.UNSICHER) == "unsicher" and R.stufe(R.UNSICHER - 0.01) == "sehr unsicher", "Grenzwerte der Stufen")


# --------------------------------------------------------------------------- Mehrheitsentscheid
def lesung(*eintraege):
    """eintraege: (x0,y0,x1,y1,text,s) -> Liste von Kaesten fuer den Stabilisierer"""
    return [{"x0": a, "y0": b, "x1": c, "y1": d, "text": t, "s": s, "woerter": [{"t": t, "s": s}]} for a, b, c, d, t, s in eintraege]


st = R.Stabilisierer()
sichtbar, stabil, neu = st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "Rechnung", 0.7)))
pruefe(sichtbar == [] and not stabil, "neue Zeile erscheint erst nach der zweiten Lesung (kein Geisterwort)")
sichtbar, stabil, neu = st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "Rechnung", 0.7)))
pruefe(len(sichtbar) == 1 and not stabil, "nach zwei Lesungen sichtbar, aber noch nicht stabil")
st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "Rechnung", 0.7)))
sichtbar, stabil, neu = st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "Rechnung", 0.7)))
pruefe(stabil and st.stabil_seit >= 1, "nach vier gleichen Lesungen: Text steht stabil")
sichtbar, stabil, neu = st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "Rechnunq", 0.5)))
pruefe(sichtbar[0]["text"] == "Rechnung", "ein einzelner Lesefehler kippt den Text nicht (Mehrheit)")
sichtbar, stabil, neu = st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "Rechnung", 0.7)))
pruefe(sichtbar[0]["text"] == "Rechnung", "nach dem Ausreißer bleibt der Text")
st = R.Stabilisierer()
for _ in range(4):
    sichtbar, stabil, neu = st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "Montag", 0.9)))
for _ in range(5):
    sichtbar, stabil, neu = st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "Dienstag", 0.9)))
pruefe(sichtbar[0]["text"] == "Dienstag", "ändert sich der Text wirklich, folgt die Anzeige nach wenigen Bildern")
st = R.Stabilisierer()
for _ in range(4):
    st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "A", 0.8), (0.1, 0.3, 0.8, 0.35, "B", 0.8), (0.1, 0.5, 0.8, 0.55, "C", 0.8)))
sichtbar, stabil, neu = st.aktualisiere(lesung((0.1, 0.6, 0.8, 0.65, "X", 0.8), (0.1, 0.7, 0.8, 0.75, "Y", 0.8), (0.1, 0.8, 0.8, 0.85, "Z", 0.8)))
pruefe(neu and sichtbar == [], "ganz anderes Blatt: Spuren werden neu begonnen")
st = R.Stabilisierer()
for _ in range(3):
    st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "A", 0.9)))
for _ in range(R.Stabilisierer.MAX_FEHL):
    sichtbar, stabil, neu = st.aktualisiere([])
pruefe(sichtbar == [] and st.spuren == [], "verschwundene Zeile wird nach wenigen Bildern vergessen")
st = R.Stabilisierer()
for _ in range(4):
    st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "A", 0.9)))
sichtbar, stabil, neu = st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "A", 0.9), (0.1, 0.4, 0.8, 0.45, "B", 0.5)))
pruefe(len(sichtbar) == 1 and not stabil, "eine neue, noch unsichere Zeile macht das Bild nicht sofort stabil")
st = R.Stabilisierer()
sichtbar, _, _ = st.aktualisiere(lesung((0.1, 0.1, 0.8, 0.15, "Sehr sicher", 0.95)))
pruefe(len(sichtbar) == 1, "eine sehr sichere Zeile erscheint sofort")

print("\n%d Fehler" % len(fehler))
sys.exit(1 if fehler else 0)
