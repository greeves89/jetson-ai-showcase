#!/bin/bash
# Startet die Webapp per HTTPS (Webcam braucht sicheren Kontext).
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/bin:$PATH"
exec python3 -m uvicorn app.app:app --host 0.0.0.0 --port 8443 \
  --ssl-keyfile certs/key.pem --ssl-certfile certs/cert.pem
