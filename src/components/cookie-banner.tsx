"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getConsent, setConsent } from "@/lib/analytics";

/**
 * Bottom-sticky banner die toont totdat bezoeker een keuze heeft
 * gemaakt (Accept / Weigeren). Keuze wordt opgeslagen in localStorage
 * via setConsent(). GoogleAnalytics component reageert daarop.
 *
 * AVG-conform:
 * - Pre-consent: geen tracking (geregeld in GoogleAnalytics component)
 * - Bezoeker kan kiezen
 * - Link naar /privacy met uitleg over wat we tracken
 * - Weigeren staat even prominent als Accept
 */
export function CookieBanner() {
  // null = nog niet bepaald (server side); we tonen pas na hydration
  // om hydration-mismatches te voorkomen.
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (getConsent() === null) {
      setShow(true);
    }
  }, []);

  function handleAccept() {
    setConsent("granted");
    setShow(false);
  }

  function handleDecline() {
    setConsent("denied");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie-toestemming">
      <div className="cookie-banner-inner">
        <div className="cookie-banner-text">
          <strong>We gebruiken cookies</strong>
          <p>
            Om te begrijpen hoe bezoekers onze tools vinden, gebruiken we
            anonieme statistieken via Google Analytics. Geen advertenties,
            geen persoonsgegevens.{" "}
            <Link href="/privacy" className="cookie-banner-link">
              Lees meer
            </Link>
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button
            type="button"
            className="cookie-banner-btn decline"
            onClick={handleDecline}
          >
            Weigeren
          </button>
          <button
            type="button"
            className="cookie-banner-btn accept"
            onClick={handleAccept}
          >
            Accepteren
          </button>
          <button
            type="button"
            className="cookie-banner-close"
            onClick={handleDecline}
            aria-label="Sluiten (gelijk aan Weigeren)"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
