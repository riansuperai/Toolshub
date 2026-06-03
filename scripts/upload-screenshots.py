#!/usr/bin/env python3
"""
Hazenco Toolshub — bulk upload screenshots voor één listing.

Uploadt alle .png/.jpg/.jpeg files uit een lokale folder naar de
Supabase Storage bucket `listing-screenshots` onder de path
`<slug>/<bestandsnaam>`, en update vervolgens
`public.listings.screenshot_urls` met de public URLs in volgorde.

Gebruik:
    set SUPABASE_SECRET_KEY=sb_secret_xxxxx
    python scripts/upload-screenshots.py <listing-slug> <lokale-folder>

Voorbeeld:
    set SUPABASE_SECRET_KEY=sb_secret_xxxxx
    python scripts/upload-screenshots.py hazenco-price-tool "C:\\screenshots\\price"

Het script:
  - Sorteert bestanden alfabetisch (gebruik prefixes zoals 01-, 02-,
    03- om de volgorde in de gallery te bepalen).
  - Vervangt bestaande screenshots in de bucket voor diezelfde slug
    (upsert=true).
  - Replace't de hele screenshot_urls array op de listing (geen merge).
  - Heeft je Supabase secret key nodig (bypassed RLS); haal die op via
    Supabase dashboard -> Project Settings -> API Keys -> Secret keys.

Vereisten: alleen `requests` (pip install requests).
"""

import argparse
import mimetypes
import os
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("ERROR: `requests` is niet geïnstalleerd. Run: pip install requests")
    sys.exit(1)


SUPABASE_URL = "https://itqanbhecghinccgyeyf.supabase.co"
BUCKET = "listing-screenshots"
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}


def get_secret_key() -> str:
    key = os.environ.get("SUPABASE_SECRET_KEY")
    if not key:
        print("ERROR: SUPABASE_SECRET_KEY env var is niet gezet.")
        print("")
        print("BELANGRIJK: gebruik de LEGACY service_role JWT key, niet de")
        print("nieuwe sb_secret_ key. De Supabase Storage API verwacht een")
        print("JWT-formaat key (string begint met 'eyJ...').")
        print("")
        print("Haal hem op:")
        print("  Supabase dashboard -> Project Settings -> API Keys")
        print("  -> tab 'Legacy anon, service_role API keys'")
        print("  -> kopieer de 'service_role' key (lange eyJ... JWT)")
        print("")
        print("Set hem voor de sessie:")
        print("  PowerShell: $env:SUPABASE_SECRET_KEY = 'eyJhbGci...'")
        print("  cmd:        set SUPABASE_SECRET_KEY=eyJhbGci...")
        sys.exit(1)
    if not key.startswith("eyJ"):
        print("WARNING: SUPABASE_SECRET_KEY lijkt geen JWT te zijn (zou met")
        print("'eyJ' moeten beginnen). Storage API geeft 'Invalid Compact JWS'")
        print("op de sb_secret_* keys. Gebruik de legacy service_role JWT key.")
        print("")
    else:
        # Decode JWT payload (zonder validatie — alleen om de role te checken)
        try:
            import base64
            import json as _json
            payload_b64 = key.split(".")[1]
            payload_b64 += "=" * (4 - len(payload_b64) % 4)  # padding
            payload = _json.loads(base64.urlsafe_b64decode(payload_b64))
            role = payload.get("role")
            if role != "service_role":
                print(f"ERROR: Deze JWT heeft role='{role}', niet 'service_role'.")
                print("De anon key respecteert RLS dus kan niet uploaden.")
                print("Pak de service_role key uit dezelfde Legacy keys tab")
                print("(de andere JWT eronder).")
                sys.exit(1)
        except Exception:
            pass  # Decode mislukt, laat de API zelf maar klagen
    return key


def list_image_files(folder: Path) -> list[Path]:
    if not folder.is_dir():
        print(f"ERROR: {folder} is geen directory.")
        sys.exit(1)
    files = sorted(
        [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS]
    )
    if not files:
        print(f"ERROR: geen image files (.png/.jpg/.jpeg/.webp) in {folder}")
        sys.exit(1)
    return files


def upload_file(secret_key: str, slug: str, file_path: Path) -> str:
    """Upload een file naar Storage, return public URL."""
    storage_path = f"{slug}/{file_path.name}"
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{storage_path}"
    mime, _ = mimetypes.guess_type(file_path.name)
    mime = mime or "application/octet-stream"

    headers = {
        "Authorization": f"Bearer {secret_key}",
        "Content-Type": mime,
        # upsert=true zodat herhaalde uploads bestaande files overschrijven
        "x-upsert": "true",
    }

    with file_path.open("rb") as f:
        resp = requests.post(upload_url, headers=headers, data=f.read(), timeout=60)

    if not resp.ok:
        print(f"  FAILED {file_path.name}: {resp.status_code} - {resp.text[:200]}")
        sys.exit(1)

    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET}/{storage_path}"
    print(f"  OK {file_path.name} -> {public_url}")
    return public_url


def update_listing_screenshots(secret_key: str, slug: str, urls: list[str]) -> None:
    """PATCH de listing met de nieuwe screenshot_urls array."""
    patch_url = f"{SUPABASE_URL}/rest/v1/listings?slug=eq.{slug}"
    headers = {
        "apikey": secret_key,
        "Authorization": f"Bearer {secret_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    body = {"screenshot_urls": urls}
    resp = requests.patch(patch_url, headers=headers, json=body, timeout=30)

    if not resp.ok:
        print(f"FAILED listing update: {resp.status_code} - {resp.text[:300]}")
        sys.exit(1)

    rows = resp.json()
    if not rows:
        print(f"WARNING: geen listing gevonden met slug='{slug}'. URLs zijn wel geüpload.")
        return

    print(f"Listing '{slug}' bijgewerkt met {len(urls)} screenshots.")


def main():
    parser = argparse.ArgumentParser(
        description="Bulk upload screenshots naar Supabase Storage + update listing."
    )
    parser.add_argument("slug", help="Listing slug, bv. hazenco-price-tool")
    parser.add_argument("folder", help="Lokale folder met de screenshots")
    args = parser.parse_args()

    secret_key = get_secret_key()
    folder = Path(args.folder).resolve()
    files = list_image_files(folder)

    print(f"\nUpload {len(files)} screenshots naar bucket '{BUCKET}/{args.slug}/'...")
    urls = []
    for f in files:
        url = upload_file(secret_key, args.slug, f)
        urls.append(url)

    print(f"\nUpdate listing '{args.slug}' in database...")
    update_listing_screenshots(secret_key, args.slug, urls)

    print("\nKlaar! Refresh de tool-detail pagina om de gallery te zien.")


if __name__ == "__main__":
    main()
