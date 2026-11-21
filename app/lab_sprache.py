"""Labor "Sprache": echte Token-Zerlegung des laufenden Sprachmodells.

Endpunkt
  POST /api/tokenize   {text} -> {tokens: [{text, id, teil}], anzahl, zeichen, modell, quelle, wortschatz}

Ollama bietet in der eingesetzten Version keinen Tokenizer-Endpunkt. Darum liest dieses Modul das Vokabular
(Tokenliste und Zusammenfuehrungsregeln) direkt aus der GGUF-Datei des Modells, die Ollama ohnehin lokal ablegt,
und baut daraus mit dem Paket `tokenizers` (kommt mit faster-whisper) denselben Byte-Level-BPE-Zerleger, den
Llama 3 benutzt. Es wird nichts heruntergeladen, gespeichert oder geloggt; die Texte der Besucher bleiben im Speicher
dieser einen Anfrage.
"""
import asyncio
import json
import os
import struct
import threading
import time
from pathlib import Path

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

from app.sicherheit import begrenzt, origin_ok

router = APIRouter()

MODELL = os.environ.get("TOKENIZER_MODELL", "llama3.2")
MODELL_TAG = os.environ.get("TOKENIZER_TAG", "3b")
MODELL_NAME = f"{MODELL}:{MODELL_TAG}"
MAX_ZEICHEN = 1000
MAX_BODY = 16384
FEHLER_PAUSE_S = 60            # nach einem Ladefehler nicht bei jeder Anfrage neu versuchen

# Llama-3-Vorzerlegung (wie im tokenizer.json des Modells): Kontraktionen, Woerter mit einem fuehrenden Zeichen,
# Zahlen in Gruppen bis zu drei Ziffern, Satzzeichenfolgen, Zeilenumbrueche, Leerraum.
LLAMA3_MUSTER = (
    r"(?i:'s|'t|'re|'ve|'m|'ll|'d)|[^\r\n\p{L}\p{N}]?\p{L}+|\p{N}{1,3}"
    r"| ?[^\s\p{L}\p{N}]+[\r\n]*|\s*[\r\n]+|\s+(?!\S)|\s+"
)

_sperre = threading.Lock()
_zustand = {"tok": None, "bytes_von": None, "fehler_bis": 0.0, "fehler": None}


# ---------------------------------------------------------------- GGUF lesen
def _modelldatei() -> Path:
    """Pfad der GGUF-Datei des Modells (Umgebungsvariable oder Ollama-Manifest)."""
    explizit = os.environ.get("TOKENIZER_GGUF")
    if explizit:
        return Path(explizit)
    wurzeln = []
    if os.environ.get("OLLAMA_MODELS"):
        wurzeln.append(Path(os.environ["OLLAMA_MODELS"]))
    wurzeln += [Path("/usr/share/ollama/.ollama/models"), Path.home() / ".ollama" / "models"]
    for w in wurzeln:
        manifest = w / "manifests" / "registry.ollama.ai" / "library" / MODELL / MODELL_TAG
        if not manifest.is_file():
            continue
        for ebene in json.loads(manifest.read_text()).get("layers", []):
            if ebene.get("mediaType") == "application/vnd.ollama.image.model":
                blob = w / "blobs" / ebene["digest"].replace(":", "-")
                if blob.is_file():
                    return blob
    raise FileNotFoundError("GGUF-Datei nicht gefunden")


_GROESSE = {0: 1, 1: 1, 2: 2, 3: 2, 4: 4, 5: 4, 6: 4, 7: 1, 10: 8, 11: 8, 12: 8}
_FORMAT = {0: "<B", 1: "<b", 2: "<H", 3: "<h", 4: "<I", 5: "<i", 6: "<f", 7: "<?", 10: "<Q", 11: "<q", 12: "<d"}


def _gguf_lesen(pfad: Path, gewuenscht: set) -> dict:
    """Liest nur die Metadaten-Schluessel in `gewuenscht` (Tokenliste, Merges), alles andere wird uebersprungen."""
    def zahl(f, fmt, n):
        return struct.unpack(fmt, f.read(n))[0]

    def text(f):
        n = zahl(f, "<Q", 8)
        if n > 1 << 24:
            raise ValueError("Zeichenkette zu lang")
        return f.read(n).decode("utf-8", "replace")

    def wert(f, typ, behalten):
        if typ in _FORMAT:
            return zahl(f, _FORMAT[typ], _GROESSE[typ])
        if typ == 8:
            return text(f)
        if typ == 9:
            et, n = zahl(f, "<I", 4), zahl(f, "<Q", 8)
            if et in _GROESSE and not behalten:
                f.seek(_GROESSE[et] * n, 1)
                return None
            if et == 8:
                if behalten:
                    liste = []
                    lese = f.read
                    for _ in range(n):
                        k = struct.unpack("<Q", lese(8))[0]
                        liste.append(lese(k).decode("utf-8", "replace"))
                    return liste
                for _ in range(n):
                    f.seek(zahl(f, "<Q", 8), 1)
                return None
            liste = [wert(f, et, behalten) for _ in range(n)]
            return liste if behalten else None
        raise ValueError("unbekannter GGUF-Typ %d" % typ)

    erg = {}
    with open(pfad, "rb", buffering=1 << 22) as f:
        if f.read(4) != b"GGUF":
            raise ValueError("keine GGUF-Datei")
        version = zahl(f, "<I", 4)
        if version < 2:
            raise ValueError("GGUF-Version nicht unterstuetzt")
        zahl(f, "<Q", 8)                      # Anzahl Tensoren
        anzahl = zahl(f, "<Q", 8)
        for _ in range(anzahl):
            schluessel = text(f)
            typ = zahl(f, "<I", 4)
            v = wert(f, typ, schluessel in gewuenscht)
            if schluessel in gewuenscht:
                erg[schluessel] = v
    return erg


def _byte_tabelle():
    """GPT-2-Zuordnung Byte -> sichtbares Unicode-Zeichen (so stehen die Bytes im Vokabular)."""
    bs = list(range(ord("!"), ord("~") + 1)) + list(range(0xA1, 0xAC + 1)) + list(range(0xAE, 0xFF + 1))
    cs = bs[:]
    n = 0
    for b in range(256):
        if b not in bs:
            bs.append(b)
            cs.append(256 + n)
            n += 1
    return {chr(c): b for b, c in zip(bs, cs)}


def _laden():
    """Baut den Zerleger. Blockierend (einige Sekunden beim ersten Mal), laeuft in einem Thread."""
    from tokenizers import Regex, Tokenizer, decoders, pre_tokenizers
    from tokenizers.models import BPE

    daten = _gguf_lesen(_modelldatei(), {"tokenizer.ggml.tokens", "tokenizer.ggml.merges", "tokenizer.ggml.model"})
    tokens = daten.get("tokenizer.ggml.tokens")
    merges = daten.get("tokenizer.ggml.merges")
    if not tokens or not merges or daten.get("tokenizer.ggml.model") != "gpt2":
        raise ValueError("Tokenizer des Modells ist nicht vom erwarteten Typ")
    vokabular = {t: i for i, t in enumerate(tokens)}
    paare = []
    for m in merges:
        a, _, b = m.partition(" ")
        paare.append((a, b))
    tok = Tokenizer(BPE(vokabular, paare, ignore_merges=True))
    tok.pre_tokenizer = pre_tokenizers.Sequence([
        pre_tokenizers.Split(Regex(LLAMA3_MUSTER), behavior="isolated", invert=False),
        pre_tokenizers.ByteLevel(add_prefix_space=False, use_regex=False),
    ])
    tok.decoder = decoders.ByteLevel()
    tabelle = _byte_tabelle()
    token_bytes = []
    for t in tokens:
        try:
            token_bytes.append(bytes(tabelle[c] for c in t))
        except KeyError:                       # Sondertoken wie <|eot_id|>: Text selbst
            token_bytes.append(t.encode("utf-8"))
    return tok, token_bytes


def _zerleger():
    with _sperre:
        if _zustand["tok"] is not None:
            return _zustand["tok"], _zustand["bytes_von"]
        if time.time() < _zustand["fehler_bis"]:
            raise RuntimeError(_zustand["fehler"])
        try:
            tok, tb = _laden()
        except Exception as e:                 # noqa: BLE001
            _zustand["fehler"] = "Der Zerleger konnte nicht geladen werden."
            _zustand["fehler_bis"] = time.time() + FEHLER_PAUSE_S
            print("lab_sprache: Laden fehlgeschlagen:", repr(e))
            raise RuntimeError(_zustand["fehler"])
        _zustand["tok"], _zustand["bytes_von"] = tok, tb
        return tok, tb


def zerlegen(text: str):
    """Gibt die Tokens als Liste von {text, id, teil} zurueck. `teil` ist wahr, wenn ein Token nur ein Bruchstueck
    eines Zeichens ist (zum Beispiel ein Teil eines Emojis) und allein nicht als Text darstellbar."""
    tok, token_bytes = _zerleger()
    ids = tok.encode(text, add_special_tokens=False).ids
    aus = []
    for i in ids:
        roh = token_bytes[i]
        try:
            s, teil = roh.decode("utf-8"), False
        except UnicodeDecodeError:
            s, teil = roh.decode("utf-8", "replace"), True
        aus.append({"text": s, "id": i, "teil": teil})
    return aus


@router.post("/api/tokenize")
async def tokenize_api(request: Request):
    if not origin_ok(request.headers):
        return JSONResponse({"fehler": "Origin"}, status_code=403)
    if begrenzt(request, "tokenize", 240, 60):
        return JSONResponse({"fehler": "Zu viele Anfragen. Warte kurz."}, status_code=429)
    try:
        if int(request.headers.get("content-length") or 0) > MAX_BODY:
            raise ValueError
        roh = await request.body()
        if len(roh) > MAX_BODY:
            raise ValueError
    except ValueError:
        return JSONResponse({"fehler": "Die Anfrage ist zu groß."}, status_code=413)
    try:
        daten = json.loads(roh.decode("utf-8"))
        if not isinstance(daten, dict):
            raise ValueError
    except Exception:
        return JSONResponse({"fehler": "Die Anfrage ist kein gültiges JSON."}, status_code=400)
    text = daten.get("text")
    if not isinstance(text, str):
        return JSONResponse({"fehler": "Schreib zuerst einen Text."}, status_code=400)
    if len(text) > MAX_ZEICHEN:
        return JSONResponse({"fehler": "Der Text ist zu lang. Erlaubt sind höchstens %d Zeichen." % MAX_ZEICHEN},
                            status_code=413)
    if not text:
        return JSONResponse({"tokens": [], "anzahl": 0, "zeichen": 0, "modell": MODELL_NAME, "quelle": "gguf",
                             "wortschatz": len(_zustand["bytes_von"] or [])})
    try:
        tokens = await asyncio.to_thread(zerlegen, text)
    except RuntimeError as e:
        return JSONResponse({"fehler": str(e)}, status_code=503)
    except Exception:                          # noqa: BLE001
        return JSONResponse({"fehler": "Der Text ließ sich nicht zerlegen."}, status_code=500)
    return JSONResponse({"tokens": tokens, "anzahl": len(tokens), "zeichen": len(text), "modell": MODELL_NAME,
                         "quelle": "gguf", "wortschatz": len(_zustand["bytes_von"] or [])})
