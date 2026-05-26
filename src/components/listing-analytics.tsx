"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eye, MousePointerClick, ShoppingBag, Star, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { formatPrice } from "@/lib/marketplace-data";
import { AnimatedNumber } from "@/components/animated-number";
import { PeriodToggle, type Period } from "@/components/period-toggle";
import { getFunnelStats } from "@/lib/funnel-tracking";
import type { Listing } from "@/lib/types";

function niceMax(value: number) {
  if (value <= 0) return 100;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  const niceNormalized = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return niceNormalized * magnitude;
}

function formatPriceShort(cents: number) {
  if (cents === 0) return "€0";
  const euros = cents / 100;
  if (euros >= 1000) return `€${(euros / 1000).toFixed(euros % 1000 === 0 ? 0 : 1)}k`;
  return `€${euros.toFixed(0)}`;
}

const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

export function ListingAnalytics({ listing }: { listing: Listing }) {
  const { state } = useMarketplace();
  const [period, setPeriod] = useState<Period>("month");
  const [funnel, setFunnel] = useState({ views: 0, cartAdds: 0, checkouts: 0, viewToCartRate: 0, cartToCheckoutRate: 0, overallConversion: 0 });

  useEffect(() => setFunnel(getFunnelStats(listing.id)), [listing.id]);

  const paidItems = useMemo(() => {
    const items: { date: Date; amount: number; quantity: number }[] = [];
    for (const order of state.orders) {
      if (order.status !== "paid") continue;
      for (const item of order.items) {
        if (item.listingId !== listing.id) continue;
        items.push({
          date: new Date(order.createdAt),
          amount: item.priceCents * item.quantity + item.serviceAddOnPriceCents,
          quantity: item.quantity
        });
      }
    }
    return items;
  }, [state.orders, listing.id]);

  const chartData = useMemo(() => {
    const now = new Date();
    if (period === "today") {
      const buckets: { label: string; revenue: number; downloads: number }[] = [];
      for (let h = 0; h < 24; h++) buckets.push({ label: `${String(h).padStart(2, "0")}`, revenue: 0, downloads: 0 });
      for (const it of paidItems) {
        if (it.date.getFullYear() === now.getFullYear() && it.date.getMonth() === now.getMonth() && it.date.getDate() === now.getDate()) {
          buckets[it.date.getHours()].revenue += it.amount;
          buckets[it.date.getHours()].downloads += it.quantity;
        }
      }
      return buckets;
    }
    if (period === "month") {
      const buckets: { label: string; revenue: number; downloads: number; key: string }[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({ label: months[d.getMonth()], revenue: 0, downloads: 0, key: `${d.getFullYear()}-${d.getMonth()}` });
      }
      const map = new Map(buckets.map((b) => [b.key, b]));
      for (const it of paidItems) {
        const b = map.get(`${it.date.getFullYear()}-${it.date.getMonth()}`);
        if (b) { b.revenue += it.amount; b.downloads += it.quantity; }
      }
      return buckets;
    }
    const buckets: { label: string; revenue: number; downloads: number; key: string }[] = [];
    for (let i = 4; i >= 0; i--) {
      const y = now.getFullYear() - i;
      buckets.push({ label: y.toString(), revenue: 0, downloads: 0, key: y.toString() });
    }
    const map = new Map(buckets.map((b) => [b.key, b]));
    for (const it of paidItems) {
      const b = map.get(it.date.getFullYear().toString());
      if (b) { b.revenue += it.amount; b.downloads += it.quantity; }
    }
    return buckets;
  }, [paidItems, period]);

  const peak = Math.max(1, ...chartData.map((d) => d.revenue));
  const yMax = niceMax(peak);
  const yTicks = [1, 0.75, 0.5, 0.25, 0].map((m) => yMax * m);

  const totals = useMemo(() => {
    const revenue = chartData.reduce((s, b) => s + b.revenue, 0);
    const downloads = chartData.reduce((s, b) => s + b.downloads, 0);
    // Vergelijken met vorige periode
    const half = Math.floor(chartData.length / 2);
    const recent = chartData.slice(half).reduce((s, b) => s + b.revenue, 0);
    const prev = chartData.slice(0, half).reduce((s, b) => s + b.revenue, 0);
    const trend = prev === 0 ? (recent > 0 ? 100 : 0) : ((recent - prev) / prev) * 100;
    return { revenue, downloads, trend };
  }, [chartData]);

  const reviews = useMemo(
    () => state.reviews.filter((r) => r.listingId === listing.id && r.approved),
    [state.reviews, listing.id]
  );

  const trendUp = totals.trend >= 0;

  return (
    <>
      <div className="listing-analytics-head">
        <div className="listing-analytics-totals">
          <div>
            <span><Wallet size={11} /> Omzet</span>
            <strong><AnimatedNumber value={totals.revenue / 100} duration={700} format={(v) => formatPrice(Math.round(v * 100))} /></strong>
          </div>
          <div>
            <span><Download size={11} /> Downloads</span>
            <strong><AnimatedNumber value={totals.downloads} duration={700} /></strong>
          </div>
          <div>
            <span><ShoppingBag size={11} /> Totaal verkocht</span>
            <strong>{listing.sales}</strong>
          </div>
          <div>
            <span><Star size={11} /> Reviews</span>
            <strong>{listing.rating ? listing.rating.toFixed(1) : "—"} <small style={{ color: "var(--green-500)", fontSize: 11 }}>({reviews.length})</small></strong>
          </div>
        </div>
        <PeriodToggle value={period} onChange={setPeriod} options={["today", "month", "year"]} />
      </div>

      <div className={`listing-analytics-trend ${trendUp ? "up" : "down"}`}>
        {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <strong>{trendUp ? "+" : ""}{totals.trend.toFixed(1)}%</strong>
        <small>vs vorige periode</small>
      </div>

      <div className="revenue-chart-wrap" style={{ marginTop: 14 }}>
        <div className="revenue-y-axis" aria-hidden>
          {yTicks.map((tick) => (<span key={tick}>{formatPriceShort(tick)}</span>))}
        </div>
        <div className="revenue-chart-area">
          <div className="revenue-chart">
            {chartData.map((d, i) => (
              <div
                key={i}
                className={`revenue-bar${d.revenue > 0 ? " filled" : ""}`}
                style={{ height: `${Math.max(4, (d.revenue / yMax) * 100)}%` }}
                title={`${d.label}: ${formatPrice(d.revenue)} · ${d.downloads} downloads`}
              />
            ))}
          </div>
          <div className="revenue-chart-labels">
            {chartData.map((d, i) => {
              const interval = period === "today" ? 4 : 1;
              const show = i === 0 || i === chartData.length - 1 || i % interval === 0;
              return <span key={i}>{show ? d.label : ""}</span>;
            })}
          </div>
        </div>
      </div>

      {funnel.views > 0 ? (
        <div className="listing-funnel">
          <strong style={{ display: "block", fontSize: 13, color: "var(--green-900)", marginBottom: 10 }}>
            Conversie-funnel (laatste sessies)
          </strong>
          <div className="listing-funnel-row">
            <div className="listing-funnel-step">
              <Eye size={16} />
              <strong>{funnel.views}</strong>
              <small>Bekeken</small>
            </div>
            <span className="listing-funnel-arrow">→ <small>{funnel.viewToCartRate.toFixed(0)}%</small></span>
            <div className="listing-funnel-step">
              <MousePointerClick size={16} />
              <strong>{funnel.cartAdds}</strong>
              <small>Toegevoegd</small>
            </div>
            <span className="listing-funnel-arrow">→ <small>{funnel.cartToCheckoutRate.toFixed(0)}%</small></span>
            <div className="listing-funnel-step success">
              <ShoppingBag size={16} />
              <strong>{funnel.checkouts}</strong>
              <small>Gekocht</small>
            </div>
          </div>
          <div className="listing-funnel-summary">
            <strong>{funnel.overallConversion.toFixed(1)}%</strong>
            <small>totale view-to-purchase conversie</small>
          </div>
        </div>
      ) : null}

      {reviews.length > 0 ? (
        <div className="listing-analytics-reviews">
          <strong style={{ display: "block", fontSize: 13, color: "var(--green-900)", marginBottom: 8 }}>
            Recente reviews
          </strong>
          {reviews.slice(0, 3).map((r) => (
            <div className="listing-analytics-review" key={r.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <strong style={{ fontSize: 12.5 }}>{r.buyerName}</strong>
                <span style={{ color: "#f59e0b", display: "inline-flex", alignItems: "center" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={11} fill={s <= r.rating ? "currentColor" : "none"} />
                  ))}
                </span>
              </div>
              <p>{r.comment.length > 140 ? r.comment.slice(0, 140) + "..." : r.comment}</p>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
