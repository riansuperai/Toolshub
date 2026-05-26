"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, Sparkles, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";

const DISMISSED_KEY = "hazenco-banner-dismissed";

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warn: AlertTriangle,
  promo: Sparkles
};

export function SiteBanner() {
  const { state } = useMarketplace();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      setDismissed(new Set(JSON.parse(window.localStorage.getItem(DISMISSED_KEY) ?? "[]")));
    } catch {
      // ignore
    }
  }, []);

  const banner = (state.banners ?? []).find((b) => b.active && !dismissed.has(b.id));
  if (!banner) return null;

  const Icon = ICONS[banner.tone] ?? Info;

  function dismiss() {
    const next = new Set(dismissed);
    next.add(banner!.id);
    setDismissed(next);
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify([...next]));
  }

  return (
    <div className={`site-banner tone-${banner.tone}`} role="status">
      <span className="site-banner-icon"><Icon size={15} /></span>
      <p>{banner.message}</p>
      {banner.cta ? (
        <Link href={banner.cta.href} className="site-banner-cta">
          {banner.cta.label} →
        </Link>
      ) : null}
      <button type="button" className="site-banner-close" onClick={dismiss} aria-label="Sluiten">
        <X size={13} />
      </button>
    </div>
  );
}
