"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { getRecentlyViewed } from "@/lib/recently-viewed";
import { formatPrice, productTypeLabels } from "@/lib/marketplace-data";

export function RecentlyViewedStrip() {
  const { state } = useMarketplace();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => setIds(getRecentlyViewed()), []);

  const listings = useMemo(
    () => ids.map((id) => state.listings.find((l) => l.id === id)).filter((l): l is NonNullable<typeof l> => !!l && l.status === "published"),
    [ids, state.listings]
  );

  if (listings.length === 0) return null;

  return (
    <section className="recently-viewed-strip">
      <div className="recently-viewed-head">
        <div>
          <span className="eyebrow"><Clock size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Recent bekeken</span>
          <h3>Pak op waar je bleef</h3>
        </div>
        <Link className="text-action" href="/catalogus">Bekijk catalogus</Link>
      </div>
      <div className="recently-viewed-list">
        {listings.map((l) => {
          const seller = state.sellers.find((s) => s.id === l.sellerId);
          return (
            <Link key={l.id} href={`/tools/${l.slug}`} className="recently-viewed-card">
              <div className="recently-viewed-icon">{l.title.slice(0, 1).toUpperCase()}</div>
              <div className="recently-viewed-body">
                <strong>{l.title}</strong>
                <small>{productTypeLabels[l.type]} · {seller?.name ?? ""}</small>
                <strong className="recently-viewed-price">{formatPrice(l.priceCents)}</strong>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
