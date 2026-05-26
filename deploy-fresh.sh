#!/bin/bash
set -e

echo "==================================="
echo "Hazenco Toolshub - Fresh deployment"
echo "==================================="
echo "Gebruik dit alleen als:"
echo "  - normale 'bash deploy.sh' iets vreemds geeft"
echo "  - package.json of Dockerfile is gewijzigd"
echo "  - je een schone build wilt forceren"
echo "Verwachte tijd: ~80 sec (volledige rebuild zonder cache)."
echo ""

cd /opt/hazenco-toolshub

echo "-> Git pull..."
sudo git pull origin main

echo "-> Docker fresh build (no cache) en herstart..."
sudo docker compose down
sudo docker compose build --no-cache
sudo docker compose up -d

echo "-> Wacht tot app opgestart is..."
sleep 15

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
echo "Fresh deployment succesvol!"
echo "https://toolshub.hazenco.nl"
echo "==================================="
