"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  Layers,
  Package,
  Receipt,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Users as UsersIcon,
  Wallet
} from "lucide-react";
import { brancheLabels, formatPrice, productTypeLabels } from "@/lib/marketplace-data";
import { useMarketplace } from "@/lib/marketplace-store";
import { AnimatedNumber } from "@/components/animated-number";
import { PeriodToggle, type Period } from "@/components/period-toggle";
import { UpcomingAppointmentsWidget } from "@/components/upcoming-appointments-widget";
import type { Branche, ProductType } from "@/lib/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function formatNumber(value: number) {
  return value.toLocaleString("nl-NL");
}

function greetingForHour() {
  const h = new Date().getHours();
  if (h < 6) return "Goedenacht";
  if (h < 12) return "Goedemorgen";
  if (h < 18) return "Goedemiddag";
  return "Goedenavond";
}

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

export default function AdminDashboardPage() {
  const { state, activeUser } = useMarketplace();
  const [period, setPeriod] = useState<Period>("month");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const pendingApplications = state.sellerApplications.filter((item) => item.status === "pending");
  const pendingListings = state.listings.filter((item) => item.status === "pending");
  const pendingReviews = state.reviews.filter((item) => !item.approved);
  const publishedListings = state.listings.filter((item) => item.status === "published");
  const paidOrders = state.orders.filter((order) => order.status === "paid");
  const failedOrders = state.orders.filter((order) => order.status === "failed");
  const cancelledOrders = state.orders.filter((order) => order.status === "cancelled");
  const totalOrders = state.orders.length;
  const conversionRate = totalOrders > 0 ? (paidOrders.length / totalOrders) * 100 : 0;
  const refundRate = totalOrders > 0 ? ((failedOrders.length + cancelledOrders.length) / totalOrders) * 100 : 0;

  const totals = useMemo(() => {
    const gmv = paidOrders.reduce((sum, order) => sum + order.totalCents, 0);
    const downloads = publishedListings.reduce((sum, l) => sum + l.downloads, 0);
    const sales = publishedListings.reduce((sum, l) => sum + l.sales, 0);
    return { gmv, downloads, sales };
  }, [paidOrders, publishedListings]);

  const avgOrderValue = paidOrders.length > 0 ? totals.gmv / paidOrders.length : 0;

  const chartData = useMemo(() => {
    const now = new Date();
    if (period === "today") {
      const buckets: { label: string; cents: number }[] = [];
      for (let h = 0; h < 24; h++) buckets.push({ label: `${String(h).padStart(2, "0")}:00`, cents: 0 });
      for (const o of paidOrders) {
        const d = new Date(o.createdAt);
        if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()) {
          buckets[d.getHours()].cents += o.totalCents;
        }
      }
      return buckets;
    }
    if (period === "month") {
      const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
      const buckets: { label: string; cents: number; key: string }[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({ label: months[d.getMonth()], cents: 0, key: `${d.getFullYear()}-${d.getMonth()}` });
      }
      const map = new Map(buckets.map((b) => [b.key, b]));
      for (const o of paidOrders) {
        const d = new Date(o.createdAt);
        const b = map.get(`${d.getFullYear()}-${d.getMonth()}`);
        if (b) b.cents += o.totalCents;
      }
      return buckets;
    }
    const buckets: { label: string; cents: number; key: string }[] = [];
    for (let i = 4; i >= 0; i--) {
      const y = now.getFullYear() - i;
      buckets.push({ label: y.toString(), cents: 0, key: y.toString() });
    }
    const map = new Map(buckets.map((b) => [b.key, b]));
    for (const o of paidOrders) {
      const b = map.get(new Date(o.createdAt).getFullYear().toString());
      if (b) b.cents += o.totalCents;
    }
    return buckets;
  }, [paidOrders, period]);

  const peakChart = Math.max(1, ...chartData.map((d) => d.cents));
  const yMax = niceMax(peakChart);
  const yTicks = [1, 0.75, 0.5, 0.25, 0].map((m) => yMax * m);

  const periodStats = useMemo(() => {
    const now = new Date();
    let curStart: Date;
    if (period === "today") { curStart = new Date(now); curStart.setHours(0, 0, 0, 0); }
    else if (period === "month") { curStart = new Date(now); curStart.setDate(now.getDate() - 30); }
    else { curStart = new Date(now); curStart.setDate(now.getDate() - 365); }
    let curGmv = 0;
    const curOrderIds = new Set<string>();
    for (const o of paidOrders) {
      const d = new Date(o.createdAt);
      if (d >= curStart && d <= now) { curGmv += o.totalCents; curOrderIds.add(o.id); }
    }
    const newSellers = state.sellers.filter((s) => s.joinedAt && new Date(s.joinedAt) >= curStart).length;
    const newListings = state.listings.filter((l) => new Date(l.createdAt) >= curStart && l.status === "published").length;
    return { gmv: curGmv, orders: curOrderIds.size, sellers: newSellers, listings: newListings };
  }, [paidOrders, state.sellers, state.listings, period]);

  function bucketRange(p: Period, idx: number) {
    const now = new Date();
    if (p === "today") {
      const start = new Date(now); start.setHours(idx, 0, 0, 0);
      const end = new Date(start); end.setHours(idx + 1, 0, 0, 0);
      return { start, end };
    }
    if (p === "month") {
      const offset = 11 - idx;
      const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1);
      return { start, end };
    }
    const offset = 4 - idx;
    const year = now.getFullYear() - offset;
    return { start: new Date(year, 0, 1), end: new Date(year + 1, 0, 1) };
  }

  const activeStats = selectedIdx !== null ? (() => {
    const { start, end } = bucketRange(period, selectedIdx);
    let gmv = 0;
    const ids = new Set<string>();
    for (const o of paidOrders) {
      const d = new Date(o.createdAt);
      if (d >= start && d < end) { gmv += o.totalCents; ids.add(o.id); }
    }
    const newSellers = state.sellers.filter((s) => s.joinedAt && new Date(s.joinedAt) >= start && new Date(s.joinedAt) < end).length;
    const newListings = state.listings.filter((l) => {
      const d = new Date(l.createdAt);
      return d >= start && d < end && l.status === "published";
    }).length;
    return { gmv, orders: ids.size, sellers: newSellers, listings: newListings };
  })() : periodStats;

  const branchePie = useMemo(() => {
    const map = new Map<Branche, number>();
    for (const o of paidOrders) {
      for (const item of o.items) {
        const listing = state.listings.find((l) => l.id === item.listingId);
        if (!listing) continue;
        const amount = item.quantity * item.priceCents + item.serviceAddOnPriceCents;
        for (const b of listing.branches ?? []) map.set(b, (map.get(b) ?? 0) + amount);
      }
    }
    const total = [...map.values()].reduce((s, v) => s + v, 0) || 1;
    return [...map.entries()]
      .map(([branche, revenue]) => ({ branche, revenue, percent: (revenue / total) * 100 }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [paidOrders, state.listings]);

  const revenueByType = useMemo(() => {
    const counts = new Map<ProductType, number>();
    for (const order of paidOrders) {
      for (const item of order.items) {
        const listing = state.listings.find((l) => l.id === item.listingId);
        if (!listing) continue;
        const amount = item.quantity * item.priceCents + item.serviceAddOnPriceCents;
        counts.set(listing.type, (counts.get(listing.type) ?? 0) + amount);
      }
    }
    const max = Math.max(1, ...counts.values());
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([type, cents]) => ({ type, cents, percent: (cents / max) * 100 }));
  }, [paidOrders, state.listings]);

  const topSellers = useMemo(() => state.sellers
    .map((seller) => {
      const sellerListings = state.listings.filter((l) => l.sellerId === seller.id && l.status === "published");
      const sellerOrders = paidOrders.flatMap((o) => o.items.filter((i) => i.sellerId === seller.id));
      const revenue = sellerOrders.reduce((sum, item) => sum + item.priceCents * item.quantity + item.serviceAddOnPriceCents, 0);
      const downloads = sellerListings.reduce((sum, l) => sum + l.downloads, 0);
      return { seller, listings: sellerListings.length, revenue, downloads };
    })
    .sort((a, b) => b.revenue - a.revenue), [paidOrders, state.listings, state.sellers]);

  const topListings = useMemo(() => [...publishedListings].sort((a, b) => b.sales - a.sales).slice(0, 5), [publishedListings]);

  const recentOrders = useMemo(() => [...state.orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5), [state.orders]);

  const activeBucketLabel = selectedIdx !== null ? chartData[selectedIdx]?.label : null;
  const periodLabel = period === "today" ? "vandaag" : period === "month" ? "laatste 12 maanden" : "laatste 5 jaren";

  return (
    <>
      {/* Welkomstbanner */}
      <div className="seller-welcome">
        <div className="seller-welcome-text">
          <span className="eyebrow"><Sparkles size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Admin console</span>
          <h2>{greetingForHour()}, {activeUser.name.split(" ")[0]}</h2>
          <p>
            {pendingApplications.length + pendingListings.length + pendingReviews.length > 0
              ? `${pendingApplications.length + pendingListings.length + pendingReviews.length} items wachten op moderatie.`
              : "Alle wachtrijen zijn leeg — de marketplace draait soepel."}
            {" "}GMV deze {period === "today" ? "dag" : period === "month" ? "maand" : "jaar"}: <strong>{formatPrice(activeStats.gmv)}</strong>.
          </p>
        </div>
      </div>

      {/* Row 1 — GMV-grafiek + 4 KPI cards */}
      <div className="widget-grid split-2-1">
        <div className="widget" style={{ animationDelay: "0.05s", padding: 22 }}>
          <div className="widget-head" style={{ alignItems: "center" }}>
            <div>
              <h3>Marketplace GMV <span style={{ color: "var(--green-500)", fontWeight: 700, fontSize: 14 }}>
                ({activeStats.orders} orders {activeBucketLabel ? activeBucketLabel : periodLabel})
              </span></h3>
            </div>
            <PeriodToggle value={period} onChange={(p) => { setPeriod(p); setSelectedIdx(null); }} options={["today", "month", "year"]} />
          </div>

          <div className="sales-strip">
            <div className="sales-strip-metric">
              <span>GMV</span>
              <strong>
                <Wallet size={16} />
                <AnimatedNumber value={activeStats.gmv / 100} duration={700} format={(v) => formatPrice(Math.round(v * 100))} />
              </strong>
            </div>
            <div className="sales-strip-metric">
              <span>Bestellingen</span>
              <strong><ShoppingBag size={16} /><AnimatedNumber value={activeStats.orders} duration={700} /></strong>
            </div>
            <div className="sales-strip-metric">
              <span>Nieuwe creators</span>
              <strong><Store size={16} /><AnimatedNumber value={activeStats.sellers} duration={700} /></strong>
            </div>
            <div className="sales-strip-metric">
              <span>Nieuwe listings</span>
              <strong><Package size={16} /><AnimatedNumber value={activeStats.listings} duration={700} /></strong>
            </div>
          </div>

          <div className="revenue-chart-wrap" style={{ marginTop: 6 }}>
            <div className="revenue-y-axis" aria-hidden>
              {yTicks.map((tick) => (<span key={tick}>{formatPriceShort(tick)}</span>))}
            </div>
            <div className="revenue-chart-area">
              <div className="revenue-chart" role="img" aria-label={`GMV ${periodLabel}`}>
                {chartData.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`revenue-bar${d.cents > 0 ? " filled" : ""}${selectedIdx === i ? " selected" : ""}`}
                    style={{ height: `${Math.max(4, (d.cents / yMax) * 100)}%` }}
                    title={`${d.label}: ${formatPrice(d.cents)}`}
                    onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                    aria-label={`${d.label}: ${formatPrice(d.cents)}`}
                  />
                ))}
              </div>
              <div className="revenue-chart-labels">
                {chartData.map((d, i) => {
                  const interval = period === "today" ? 4 : 1;
                  const show = i === 0 || i === chartData.length - 1 || i % interval === 0;
                  return (<span key={i} className={selectedIdx === i ? "selected" : ""}>{show ? d.label : ""}</span>);
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="kpi-side-grid">
          <KpiCard delay={0.12} eyebrow="Creators" icon={<Store size={18} />}
            value={<AnimatedNumber value={state.sellers.length} />}
            progress={{ current: state.sellers.length, target: Math.max(1, state.sellers.length + pendingApplications.length) }}
            footnote={`${pendingApplications.length} pending`} />
          <KpiCard delay={0.18} eyebrow="Listings live" icon={<Package size={18} />}
            value={<AnimatedNumber value={publishedListings.length} />}
            progress={{ current: publishedListings.length, target: Math.max(1, publishedListings.length + pendingListings.length) }}
            footnote={`${pendingListings.length} in review`} />
          <KpiCard delay={0.24} eyebrow="Totaal GMV" icon={<Wallet size={18} />}
            value={<AnimatedNumber value={totals.gmv / 100} duration={1300} format={(v) => formatPrice(Math.round(v * 100))} />}
            footnote={`${paidOrders.length} betaalde orders`} />
          <KpiCard delay={0.3} eyebrow="Conversie" icon={<TrendingUp size={18} />}
            value={<AnimatedNumber value={conversionRate} decimals={1} suffix="%" />}
            changePct={conversionRate >= 50 ? 5 : -5}
            footnote={`${refundRate.toFixed(1)}% refund rate`} />
        </div>
      </div>

      {/* Funnel-strip */}
      <div className="widget" style={{ marginTop: 18, padding: 0, animationDelay: "0.36s" }}>
        <div className="funnel-grid" style={{ padding: 18 }}>
          <div className="funnel-step">
            <span className="eyebrow">Totaal bestellingen</span><strong>{totalOrders}</strong><small>100%</small>
          </div>
          <div className="funnel-step success">
            <span className="eyebrow">Betaald</span><strong>{paidOrders.length}</strong><small>{conversionRate.toFixed(0)}% conversie</small>
          </div>
          <div className="funnel-step warn">
            <span className="eyebrow">Mislukt</span><strong>{failedOrders.length}</strong><small>Betaalfout</small>
          </div>
          <div className="funnel-step warn">
            <span className="eyebrow">Geannuleerd</span><strong>{cancelledOrders.length}</strong><small>Door koper</small>
          </div>
          <div className="funnel-step accent">
            <span className="eyebrow">Gem. orderwaarde</span><strong>{formatPrice(avgOrderValue)}</strong><small>AOV</small>
          </div>
          <div className="funnel-step accent">
            <span className="eyebrow">Downloads</span><strong>{formatNumber(totals.downloads)}</strong><small>{formatNumber(totals.sales)} verkopen</small>
          </div>
        </div>
      </div>

      {/* Top sellers + Top listings */}
      <div className="widget-grid split-1-1" style={{ marginTop: 18 }}>
        <div className="widget" style={{ animationDelay: "0.42s" }}>
          <div className="widget-head">
            <div>
              <span className="eyebrow"><Store size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Top creators</span>
              <h3>Op omzet</h3>
            </div>
            <Link className="text-action" href="/admin/sellers" style={{ fontSize: 12 }}>Alle creators <ArrowRight size={12} /></Link>
          </div>
          <div className="seller-toplist">
            {topSellers.slice(0, 5).map((entry, index) => (
              <div className="seller-toplist-row" key={entry.seller.id}>
                <span className="seller-toplist-rank">{index + 1}</span>
                <div className="seller-toplist-icon"><Store size={18} /></div>
                <div>
                  <strong>{entry.seller.name}</strong>
                  <small>{entry.listings} listings · {formatNumber(entry.downloads)} downloads</small>
                </div>
                <strong className="seller-toplist-price">{formatPrice(entry.revenue)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="widget" style={{ animationDelay: "0.48s" }}>
          <div className="widget-head">
            <div>
              <span className="eyebrow"><Package size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Top listings</span>
              <h3>Best verkochte tools</h3>
            </div>
            <Link className="text-action" href="/admin/listings" style={{ fontSize: 12 }}>Alle listings <ArrowRight size={12} /></Link>
          </div>
          <div className="seller-toplist">
            {topListings.map((listing, index) => {
              const seller = state.sellers.find((s) => s.id === listing.sellerId);
              return (
                <Link className="seller-toplist-row" key={listing.id} href={`/tools/${listing.slug}`}>
                  <span className="seller-toplist-rank">{index + 1}</span>
                  <div className="seller-toplist-icon"><Package size={18} /></div>
                  <div>
                    <strong>{listing.title}</strong>
                    <small>{seller?.name} · {productTypeLabels[listing.type]}</small>
                  </div>
                  <div className="seller-toplist-meta">
                    <strong>{listing.sales}</strong>
                    <small>verkocht</small>
                  </div>
                  <strong className="seller-toplist-price">{formatPrice(listing.priceCents)}</strong>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Branche pie + Producttype */}
      <div className="widget-grid split-2-1" style={{ marginTop: 18 }}>
        <div className="widget" style={{ animationDelay: "0.54s" }}>
          <div className="widget-head">
            <div>
              <span className="eyebrow"><UsersIcon size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Doelgroep</span>
              <h3>Omzet per branche</h3>
            </div>
            <small style={{ color: "var(--green-500)", fontSize: 12, fontWeight: 700 }}>{branchePie.length} branches actief</small>
          </div>
          {branchePie.length ? <AdminBranchePie data={branchePie} /> : <p style={{ color: "var(--green-500)" }}>Nog geen branche-data.</p>}
        </div>

        <div className="widget" style={{ animationDelay: "0.6s" }}>
          <div className="widget-head">
            <div>
              <span className="eyebrow"><Layers size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Producttype-mix</span>
              <h3>Omzet per type</h3>
            </div>
          </div>
          <div className="branche-chart">
            {revenueByType.length ? revenueByType.map((row) => (
              <div className="branche-chart-row" key={row.type}>
                <span className="branche-chart-label">{productTypeLabels[row.type]}</span>
                <span className="branche-chart-bar"><span style={{ width: `${row.percent}%` }} /></span>
                <span className="branche-chart-count">{formatPrice(row.cents)}</span>
              </div>
            )) : <p>Nog geen omzet.</p>}
          </div>
        </div>
      </div>

      <UpcomingAppointmentsWidget perspective="buyer" />

      {/* Recente orders snapshot */}
      <div className="widget" style={{ marginTop: 18, animationDelay: "0.72s" }}>
        <div className="widget-head">
          <div>
            <span className="eyebrow"><Receipt size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Transacties</span>
            <h3>Laatste 5 bestellingen</h3>
          </div>
          <Link className="text-action" href="/admin/orders" style={{ fontSize: 12 }}>Alle bestellingen <ArrowRight size={12} /></Link>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Bestelling</th>
              <th>Koper</th>
              <th>Tool(s)</th>
              <th>Datum</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Bedrag</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => {
              const buyer = state.users.find((u) => u.id === order.buyerId);
              return (
                <tr key={order.id}>
                  <td><strong>#{order.id.slice(-8)}</strong></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="customer-avatar" style={{ width: 26, height: 26, fontSize: 11 }}>
                        {(buyer?.name ?? "?").slice(0, 1).toUpperCase()}
                      </span>
                      <strong style={{ fontSize: 12.5 }}>{buyer?.name ?? "—"}</strong>
                    </div>
                  </td>
                  <td>{order.items.map((i) => i.title).join(", ")}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td><span className={`status-badge ${order.status}`}>
                    {order.status === "paid" && "Betaald"}
                    {order.status === "pending" && "In behandeling"}
                    {order.status === "failed" && "Mislukt"}
                    {order.status === "cancelled" && "Geannuleerd"}
                  </span></td>
                  <td className="amount">{formatPrice(order.totalCents)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function KpiCard({
  delay, eyebrow, icon, value, changePct, progress, footnote
}: {
  delay: number;
  eyebrow: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  changePct?: number;
  progress?: { current: number; target: number };
  footnote?: string;
}) {
  const up = (changePct ?? 0) >= 0;
  const progressPct = progress ? Math.min(100, (progress.current / Math.max(0.001, progress.target)) * 100) : 0;
  return (
    <div className="widget kpi-mini" style={{ animationDelay: `${delay}s` }}>
      <div className="kpi-mini-head">
        <span className="eyebrow">{eyebrow}</span>
        <span className="kpi-mini-icon">{icon}</span>
      </div>
      <strong className="kpi-mini-value">{value}</strong>
      {typeof changePct === "number" ? (
        <span className={`kpi-mini-pill ${up ? "up" : "down"}`}>
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(changePct).toFixed(1)}%
        </span>
      ) : null}
      {progress ? (
        <div className="kpi-mini-progress">
          <div className="kpi-mini-progress-bar"><span style={{ width: `${progressPct}%` }} /></div>
        </div>
      ) : null}
      {footnote ? <small style={{ color: "var(--green-500)", fontSize: 11, fontWeight: 700, textAlign: "center" }}>{footnote}</small> : null}
    </div>
  );
}

function AdminBranchePie({ data }: { data: { branche: Branche; revenue: number; percent: number }[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const palette = ["#f26b1d", "#3b82f6", "#16a34a", "#fbbf24", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#dc2626", "#a78bfa", "#14b8a6", "#f97316"];
  const totalRevenue = data.reduce((s, r) => s + r.revenue, 0) || 1;
  let cum = 0;
  const segments = data.map((row, i) => {
    const startA = (cum / totalRevenue) * 360;
    cum += row.revenue;
    const endA = (cum / totalRevenue) * 360;
    return { ...row, color: palette[i % palette.length], startA, endA, idx: i };
  });
  const cx = 100, cy = 100, oR = 90, iR = 58;
  function polar(angle: number, r: number) {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function arcPath(startA: number, endA: number) {
    const safeEnd = endA - startA >= 360 ? endA - 0.001 : endA;
    const startOuter = polar(safeEnd, oR);
    const endOuter = polar(startA, oR);
    const startInner = polar(safeEnd, iR);
    const endInner = polar(startA, iR);
    const large = safeEnd - startA > 180 ? 1 : 0;
    return `M ${startOuter.x} ${startOuter.y} A ${oR} ${oR} 0 ${large} 0 ${endOuter.x} ${endOuter.y} L ${endInner.x} ${endInner.y} A ${iR} ${iR} 0 ${large} 1 ${startInner.x} ${startInner.y} Z`;
  }
  const hovered = hoverIdx !== null ? segments[hoverIdx] : null;
  return (
    <div className="branche-pie-widget">
      <div className="branche-pie-svg-wrap">
        <svg viewBox="0 0 200 200" className="branche-pie-svg">
          {segments.map((s) => (
            <path key={s.branche} d={arcPath(s.startA, s.endA)} fill={s.color}
              style={{
                cursor: "pointer", transition: "opacity 0.16s ease, transform 0.18s ease",
                transformOrigin: "100px 100px",
                opacity: hoverIdx !== null && hoverIdx !== s.idx ? 0.35 : 1,
                transform: hoverIdx === s.idx ? "scale(1.04)" : "scale(1)"
              }}
              onMouseEnter={() => setHoverIdx(s.idx)} onMouseLeave={() => setHoverIdx(null)} />
          ))}
        </svg>
        <div className="branche-pie-center">
          {hovered ? (
            <>
              <small>{brancheLabels[hovered.branche]}</small>
              <strong>{formatPrice(hovered.revenue)}</strong>
              <small className="branche-pie-center-meta">{hovered.percent.toFixed(0)}%</small>
            </>
          ) : (
            <>
              <small>TOTAAL</small>
              <strong>{formatPrice(totalRevenue)}</strong>
              <small className="branche-pie-center-meta">{data.length} branches</small>
            </>
          )}
        </div>
      </div>
      <div className="branche-pie-legend">
        {segments.map((s) => (
          <button type="button" className={`branche-pie-row${hoverIdx === s.idx ? " active" : ""}`} key={s.branche}
            onMouseEnter={() => setHoverIdx(s.idx)} onMouseLeave={() => setHoverIdx(null)}>
            <span className="dot" style={{ background: s.color }} />
            <strong>{brancheLabels[s.branche]}</strong>
            <span className="branche-pie-pct">{s.percent.toFixed(0)}%</span>
          </button>
        ))}
      </div>
    </div>
  );
}
