#!/bin/bash
# Richtet den Autostart als systemd-user-Dienst ein (ueberlebt Reboot, Restart bei Absturz).
set -e
cd "$(dirname "$0")/.."
mkdir -p ~/.config/systemd/user
cp scripts/jetson-showcase.service ~/.config/systemd/user/
systemctl --user daemon-reload
pkill -f "[u]vicorn app.app" 2>/dev/null || true   # evtl. laufende nohup-Instanz weg
sleep 1
systemctl --user enable --now jetson-showcase
loginctl enable-linger "$USER" 2>/dev/null && echo "linger an (Start ohne Login)" || echo "linger-Warnung: ggf. 'sudo loginctl enable-linger $USER' noetig"
sleep 2
systemctl --user --no-pager status jetson-showcase | head -6
