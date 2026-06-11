/**
 * Google Analytics 4 helpers — consent management + event tracking.
 *
 * Werkflow:
 *   1. Bezoeker komt op site, geen consent-status in localStorage.
 *   2. CookieBanner toont. Bezoeker klikt Accept of Weigeren.
 *   3. Keuze wordt opgeslagen in localStorage onder CONSENT_KEY.
 *   4. GoogleAnalytics component leest consent → laadt GA4-scripts
 *      alleen wanneer consent = "granted".
 *   5. Vanuit de app kan trackEvent() worden aangeroepen voor
 *      belangrijke acties (WhatsApp-klik, Bekijk demo, etc.).
 *
 * Versie-key (consent-v1) maakt het mogelijk om bij privacy-update
 * iedereen opnieuw te laten consent geven door bv. CONSENT_KEY te
 * bumpen naar "hazenco-consent-v2".
 */

export const GA4_MEASUREMENT_ID = "G-GKRVBX66VT";

/** Domeinen voor cross-domain linker — sessies blijven gekoppeld
 *  als bezoeker tussen hazenco.nl en toolshub.hazenco.nl klikt. */
export const CROSS_DOMAIN_LINKER = ["hazenco.nl", "toolshub.hazenco.nl"];

const CONSENT_KEY = "hazenco-consent-v1";

export type ConsentStatus = "granted" | "denied" | null;

export function getConsent(): ConsentStatus {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  if (value === "granted" || value === "denied") return value;
  return null;
}

export function setConsent(value: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, value);
  // Notify other tabs / components in this tab
  window.dispatchEvent(new CustomEvent("hazenco-consent-change", { detail: value }));
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Stuur een event naar GA4. Veilig om altijd aan te roepen — als gtag
 * niet beschikbaar is (geen consent / nog laden) gebeurt er niets.
 *
 * @example
 *   trackEvent("whatsapp_click", { tool: listing.slug });
 *   trackEvent("bekijk_demo_click", { tool: listing.slug });
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
