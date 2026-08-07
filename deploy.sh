#!/bin/bash
set -e

echo "==================================="
echo "hazenco.nl - Deployment (cached)"
echo "==================================="
echo "Tip: dit script gebruikt Docker cache (~10-30 sec)."
echo "Voor een volledige rebuild zonder cache: bash deploy-fresh.sh"
echo ""

cd /opt/hazenco-toolshub

echo "-> Git pull..."
sudo git pull origin main

echo "-> Docker build en herstart..."
sudo docker compose build
sudo docker compose up -d

echo "-> Wacht tot app opgestart is..."
sleep 8

echo "-> Health check..."
HTTP_STATUS=$(curl -sL -o /dev/null -w "%{http_code}" \
  http://localhost:5056/health)

if [ "$HTTP_STATUS" = "200" ]; then
  echo "App draait! Status: $HTTP_STATUS"
else
  echo "Health check mislukt! Status: $HTTP_STATUS"
  echo "Logs:"
  sudo docker compose logs --tail=30
  exit 1
fi

echo "-> Nginx reload..."
sudo systemctl reload nginx

echo "==================================="
echo "Deployment succesvol!"
echo "https://hazenco.nl"
echo "==================================="
