#!/bin/bash
# Startet die App losgeloest im Hintergrund (ueberlebt SSH-Logout).
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/bin:$PATH"
pkill -f "[u]vicorn app.app" 2>/dev/null || true   # [u]-Trick: trifft nicht die eigene Shell
sleep 1
nohup python3 -m uvicorn app.app:app --host 0.0.0.0 --port 8443 --ws-max-size 2100000 \
  --ssl-keyfile certs/key.pem --ssl-certfile certs/cert.pem \
  > server.log 2>&1 </dev/null &
echo $! > server.pid
echo "gestartet (PID $(cat server.pid)) auf https://0.0.0.0:8443"
