"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  CROSS_DOMAIN_LINKER,
  GA4_MEASUREMENT_ID,
  getConsent
} from "@/lib/analytics";

/**
 * Laadt GA4 scripts alleen wanneer bezoeker consent heeft gegeven.
 *
 * - Pre-consent: niets wordt geladen, geen tracking
 * - Post-consent (granted): gtag.js + config worden geinject
 * - Post-consent (denied): niets geladen
 *
 * Cross-domain linker is geconfigureerd zodat sessies tussen
 * hazenco.nl en toolshub.hazenco.nl als één gebruiker tellen.
 */
export function GoogleAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(getConsent() === "granted");

    function onChange(event: Event) {
      const detail = (event as CustomEvent<string>).detail;
      setConsented(detail === "granted");
    }
    window.addEventListener("hazenco-consent-change", onChange);
    return () => window.removeEventListener("hazenco-consent-change", onChange);
  }, []);

  if (!consented) return null;

  const linkerDomains = CROSS_DOMAIN_LINKER.map((d) => `'${d}'`).join(", ");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}', {
            linker: { domains: [${linkerDomains}] },
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}
