#!/bin/bash
# Spielt die Arbeitskopie auf den Jetson (ohne Tests, Videos-Werkzeuge, Zertifikate, Modelle).
cd "$(dirname "$0")/.."
rsync -az --exclude '.git' --exclude 'certs' --exclude 'app/models' --exclude '__pycache__' \
  --exclude 'videos/node_modules' --exclude 'videos/arbeit' --exclude 'videos/stimme-cache' --exclude 'tests' \
  ./ "${JETSON_HOST:-jetson}:jetson-ai-showcase/" && echo "deploy ok"
