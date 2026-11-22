#!/bin/bash
# Richtet den Jetson AI-Showcase ohne sudo ein (pip --user, Cert, Cascade).
set -e
cd "$(dirname "$0")/.."
echo "== pip bootstrap (user) =="
if ! python3 -c "import pip" 2>/dev/null; then
  curl -sS -m 30 -o /tmp/get-pip.py https://bootstrap.pypa.io/get-pip.py
  python3 /tmp/get-pip.py --user
fi
echo "== deps =="
python3 -m pip install --user -q -r requirements.txt
echo "== haar-cascade =="
mkdir -p app/models
if [ ! -f app/models/haarcascade_frontalface_default.xml ]; then
  F=$(find /usr/share /usr/local/share -name haarcascade_frontalface_default.xml 2>/dev/null | head -1 || true)
  if [ -n "$F" ]; then cp "$F" app/models/
  else curl -sS -m 30 -o app/models/haarcascade_frontalface_default.xml \
    https://raw.githubusercontent.com/opencv/opencv/4.8.0/data/haarcascades/haarcascade_frontalface_default.xml; fi
echo "== yunet (robuste Gesichtserkennung) =="
if [ ! -f app/models/face_detection_yunet_2023mar.onnx ]; then
  curl -sS -m 30 -L -o app/models/face_detection_yunet_2023mar.onnx \
    https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx
fi
fi
echo "== yolox (objekterkennung) =="
if [ ! -f app/models/yolox_tiny.onnx ]; then
  curl -sS -m 90 -L -o app/models/yolox_tiny.onnx \
    https://github.com/opencv/opencv_zoo/raw/main/models/object_detection_yolox/object_detection_yolox_2022nov.onnx
fi
echo "== mobilenet (bildmodell anlernen) =="
if [ ! -f app/models/mobilenet_embed.onnx ]; then
  curl -sS -m 90 -L -o app/models/mobilenet_embed.onnx \
    https://github.com/opencv/opencv_zoo/raw/main/models/image_classification_mobilenet/image_classification_mobilenetv2_2022apr.onnx
fi
echo "== whisper (sprache zu text, laedt das Modell vorab in den Huggingface-Cache) =="
python3 -c "from faster_whisper import WhisperModel; WhisperModel('${WHISPER_MODELL:-base}', device='cpu', compute_type='int8')" \
  || echo "Whisper-Modell nicht geladen; es wird beim ersten Gebrauch nachgeladen."
echo "== piper (text zu sprache, laedt die freien deutschen Stimmen vorab, siehe docs/lizenzen.md) =="
PV="${PIPER_VOICE_DIR:-$HOME/.local/share/piper-voices}"
mkdir -p "$PV"
for V in thorsten/medium/de_DE-thorsten-medium; do
  for E in onnx onnx.json; do
    F="$PV/$(basename "$V").$E"
    [ -s "$F" ] || curl -sSL -m 300 --retry 3 -o "$F" "https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE/$V.$E" \
      || { rm -f "$F"; echo "Stimme $(basename "$V") nicht geladen; sie fehlt dann im Labor."; }
  done
done
echo "== cert =="
mkdir -p certs
if [ ! -f certs/key.pem ]; then
  IP=$(hostname -I | awk '{print $1}')
  openssl req -x509 -newkey rsa:2048 -nodes -keyout certs/key.pem -out certs/cert.pem -days 825 \
    -subj "/CN=jetson.local" -addext "subjectAltName=IP:${IP},DNS:jetson.local,DNS:localhost" 2>/dev/null
fi
echo "fertig. Start mit: bash scripts/start.sh"
