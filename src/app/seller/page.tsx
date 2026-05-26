"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Box,
  LifeBuoy,
  Receipt,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wallet
} from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { brancheLabels, formatPrice, productTypeLabels } from "@/lib/marketplace-data";
import { AnimatedNumber } from "@/components/animated-number";
import { PeriodToggle, type Period } from "@/components/period-toggle";
import { UpcomingAppointmentsWidget } from "@/components/upcoming-appointments-widget";
import { AchievementsWidget } from "@/components/achievements-widget";
import type { Branche } from "@/lib/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  } catch {
    return iso;
  }
}

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} u`;
  const days = Math.floor(hours / 24);
  return `${days} d`;
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

export default function SellerDashboardPage() {
  const { state, activeUser } = useMarketplace();
  const data = useSellerData();
  const [period, setPeriod] = useState<Period>("month");
  const [topToolsTab, setTopToolsTab] = useState<"mine" | "marketplace">("mine");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => setSelectedIdx(null), [period]);

  if (activeUser.role !== "seller" || !data.seller) return null;

  const {
    seller,
    revenue,
    totalDownloads,
    totalOrderCount,
    paidOrders,
    openServices,
    pendingListings,
    topListings,
    avgRating,
    revenueChangePct,
    ordersChangePct,
    growthChangePct,
    topCustomers,
    reviewStats,
    brancheBreakdown,
    periodRevenue,
    revenueByPeriod,
    marketplaceTopTools,
    branchePerformance,
    upcomingPayouts,
    paidPayouts,
    pendingPayout
  } = data;

  const periodLabel = {
    today: "vandaag",
    week: "laatste 12 weken",
    month: "laatste 12 maanden",
    year: "laatste 5 jaren"
  }[period];
  const chartData = revenueByPeriod[period];
  const peakChart = Math.max(1, ...chartData.map((d) => d.cents));
  const periodTotal = chartData.reduce((sum, d) => sum + d.cents, 0);
  const yMax = niceMax(peakChart);
  const yTicks = [1, 0.75, 0.5, 0.25, 0].map((m) => yMax * m);

  const startToday = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  const startYesterday = (() => { const d = new Date(startToday); d.setDate(d.getDate() - 1); return d; })();
  const todayPaidOrders = paidOrders.filter(({ order }) => new Date(order.createdAt) >= startToday);
  const todayHighlight = todayPaidOrders.length;
  const todayRevenue = todayPaidOrders.reduce((sum, { item }) => sum + item.priceCents * item.quantity + item.serviceAddOnPriceCents, 0);
  const todayPaidOut = paidPayouts.filter((p) => p.date >= startToday).reduce((s, p) => s + p.net, 0);

  const yesterdayPaidOrders = paidOrders.filter(({ order }) => {
    const d = new Date(order.createdAt);
    return d >= startYesterday && d < startToday;
  });
  const yesterdayOrders = yesterdayPaidOrders.length;
  const yesterdayRevenue = yesterdayPaidOrders.reduce((sum, { item }) => sum + item.priceCents * item.quantity + item.serviceAddOnPriceCents, 0);
  const yesterdayPaidOut = paidPayouts.filter((p) => p.date >= startYesterday && p.date < startToday).reduce((s, p) => s + p.net, 0);

  // Daggemiddelde over de laatste 7 dagen
  const startWeek = (() => { const d = new Date(startToday); d.setDate(d.getDate() - 7); return d; })();
  const last7d = paidOrders.filter(({ order }) => new Date(order.createdAt) >= startWeek);
  const avgOrdersDay = last7d.length / 7;
  const avgRevenueDay = last7d.reduce((sum, { item }) => sum + item.priceCents * item.quantity + item.serviceAddOnPriceCents, 0) / 7;
  const totalPaidOut = paidPayouts.reduce((s, p) => s + p.net, 0);
  const pendingPayoutCents = upcomingPayouts.reduce((s, p) => s + p.net, 0) || pendingPayout;

  // Deze maand stats (vanaf 1ste van de huidige maand)
  const startMonth = (() => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d; })();
  const monthPaidOrders = paidOrders.filter(({ order }) => new Date(order.createdAt) >= startMonth);
  const monthOrders = monthPaidOrders.length;
  const monthRevenue = monthPaidOrders.reduce((sum, { item }) => sum + item.priceCents * item.quantity + item.serviceAddOnPriceCents, 0);

  // Periode stats (omzet/orders/downloads/groei) per geselecteerde periode
  const periodStats = (() => {
    const now = new Date();
    let curStart: Date, prevStart: Date, prevEnd: Date;
    if (period === "today") {
      curStart = new Date(now); curStart.setHours(0, 0, 0, 0);
      prevStart = new Date(curStart); prevStart.setDate(curStart.getDate() - 1);
      prevEnd = new Date(curStart);
    } else if (period === "month") {
      curStart = new Date(now); curStart.setDate(now.getDate() - 30);
      prevStart = new Date(now); prevStart.setDate(now.getDate() - 60);
      prevEnd = new Date(curStart);
    } else {
      curStart = new Date(now); curStart.setDate(now.getDate() - 365);
      prevStart = new Date(now); prevStart.setDate(now.getDate() - 730);
      prevEnd = new Date(curStart);
    }
    let curRev = 0, prevRev = 0;
    const seenCur = new Set<string>();
    for (const { order, item } of paidOrders) {
      const d = new Date(order.createdAt);
      const amt = item.priceCents * item.quantity + item.serviceAddOnPriceCents;
      if (d >= curStart && d <= now) {
        curRev += amt;
        seenCur.add(order.id);
      } else if (d >= prevStart && d < prevEnd) {
        prevRev += amt;
      }
    }
    const curPaid = paidPayouts.filter((p) => p.date >= curStart && p.date <= now).reduce((s, p) => s + p.net, 0);
    const growth = prevRev === 0 ? (curRev > 0 ? 100 : 0) : ((curRev - prevRev) / prevRev) * 100;
    return { revenue: curRev, orders: seenCur.size, paid: curPaid, growth };
  })();

  // Bucket-specifieke stats wanneer een bar in de grafiek is geklikt
  function bucketRange(p: Period, idx: number): { start: Date; end: Date; prevStart: Date; prevEnd: Date } {
    const now = new Date();
    if (p === "today") {
      const start = new Date(now); start.setHours(idx, 0, 0, 0);
      const end = new Date(start); end.setHours(idx + 1, 0, 0, 0);
      const prevStart = new Date(start); prevStart.setDate(prevStart.getDate() - 1);
      const prevEnd = new Date(prevStart); prevEnd.setHours(idx + 1, 0, 0, 0);
      return { start, end, prevStart, prevEnd };
    }
    if (p === "month") {
      const offset = 11 - idx;
      const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1);
      const prevStart = new Date(now.getFullYear(), now.getMonth() - offset - 1, 1);
      const prevEnd = start;
      return { start, end, prevStart, prevEnd };
    }
    const offset = 4 - idx;
    const year = now.getFullYear() - offset;
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const prevStart = new Date(year - 1, 0, 1);
    const prevEnd = start;
    return { start, end, prevStart, prevEnd };
  }

  const activeStats = selectedIdx !== null
    ? (() => {
        const { start, end, prevStart, prevEnd } = bucketRange(period, selectedIdx);
        let curRev = 0, prevRev = 0;
        const seenCur = new Set<string>();
        for (const { order, item } of paidOrders) {
          const d = new Date(order.createdAt);
          const amt = item.priceCents * item.quantity + item.serviceAddOnPriceCents;
          if (d >= start && d < end) {
            curRev += amt;
            seenCur.add(order.id);
          } else if (d >= prevStart && d < prevEnd) {
            prevRev += amt;
          }
        }
        const curPaid = paidPayouts.filter((p) => p.date >= start && p.date < end).reduce((s, p) => s + p.net, 0);
        const growth = prevRev === 0 ? (curRev > 0 ? 100 : 0) : ((curRev - prevRev) / prevRev) * 100;
        return { revenue: curRev, orders: seenCur.size, paid: curPaid, growth };
      })()
    : periodStats;

  const activeBucketLabel = selectedIdx !== null ? chartData[selectedIdx]?.label : null;
  const activeRangeLabel = activeBucketLabel
    ? (period === "today" ? `om ${activeBucketLabel}` : period === "month" ? activeBucketLabel : activeBucketLabel)
    : periodLabel;

  const recentOrders = [...paidOrders]
    .sort((a, b) => +new Date(b.order.createdAt) - +new Date(a.order.createdAt))
    .slice(0, 6);

  return (
    <>
      {/* Welkomsbanner */}
      <div className="seller-welcome">
        <div className="seller-welcome-text">
          <span className="eyebrow"><Sparkles size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Creator workspace</span>
          <h2>{greetingForHour()}, {seller.name.split(" ")[0]}</h2>
          <p>
            {todayHighlight > 0
              ? `Je hebt vandaag al ${todayHighlight} ${todayHighlight === 1 ? "nieuwe order" : "nieuwe orders"} binnen.`
              : "Nog geen nieuwe orders vandaag — je beste tools wachten op een koper."}
            {openServices.length > 0 ? ` ${openServices.length} ${openServices.length === 1 ? "support-aanvraag wacht" : "support-aanvragen wachten"} op je.` : ""}
          </p>
        </div>
      </div>

      {/* Row 1 — Verkoopprestaties chart (links) + KPI cards (rechts, 2x2 grid) */}
      <div className="widget-grid split-2-1">
        <div className="widget" style={{ animationDelay: "0.05s", padding: 22 }}>
          <div className="widget-head" style={{ alignItems: "center" }}>
            <div>
              <h3>Verkoopprestaties <span style={{ color: "var(--green-500)", fontWeight: 700, fontSize: 14 }}>({activeStats.orders} orders {activeBucketLabel ? activeRangeLabel : ""})</span></h3>
            </div>
            <PeriodToggle value={period} onChange={setPeriod} options={["today", "month", "year"]} />
          </div>

          <div className="sales-strip">
            <div className="sales-strip-metric">
              <span>Omzet</span>
              <strong>
                <Wallet size={16} />
                <AnimatedNumber value={activeStats.revenue / 100} duration={700} format={(v) => formatPrice(Math.round(v * 100))} />
              </strong>
            </div>
            <div className="sales-strip-metric">
              <span>Bestellingen</span>
              <strong>
                <ShoppingBag size={16} />
                <AnimatedNumber value={activeStats.orders} duration={700} />
              </strong>
            </div>
            <div className="sales-strip-metric">
              <span>Uitbetaald</span>
              <strong>
                <Wallet size={16} />
                <AnimatedNumber value={activeStats.paid / 100} duration={700} format={(v) => formatPrice(Math.round(v * 100))} />
              </strong>
            </div>
            <div className="sales-strip-metric">
              <span>Groei</span>
              <strong>
                {activeStats.growth >= 0 ? <ArrowUpRight size={16} className="up" /> : <ArrowDownRight size={16} className="down" />}
                <span className={activeStats.growth >= 0 ? "up" : "down"}>
                  <AnimatedNumber value={activeStats.growth} decimals={1} suffix="%" prefix={activeStats.growth >= 0 ? "+" : ""} />
                </span>
              </strong>
            </div>
          </div>

          <div className="revenue-chart-wrap" style={{ marginTop: 6 }}>
            <div className="revenue-y-axis" aria-hidden>
              {yTicks.map((tick) => (
                <span key={tick}>{formatPriceShort(tick)}</span>
              ))}
            </div>
            <div className="revenue-chart-area">
              <div className="revenue-chart" role="img" aria-label={`Omzet ${periodLabel}`}>
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
                  return (
                    <span key={i} className={selectedIdx === i ? "selected" : ""}>
                      {show ? d.label : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="kpi-side-grid">
          <KpiCard
            delay={0.12}
            eyebrow="Orders vandaag"
            icon={<ShoppingBag size={18} />}
            value={<AnimatedNumber value={todayHighlight} />}
            secondary={{ label: "Deze maand", value: <AnimatedNumber value={monthOrders} /> }}
            progress={{
              current: todayHighlight,
              target: Math.max(1, Math.ceil(avgOrdersDay))
            }}
          />
          <KpiCard
            delay={0.18}
            eyebrow="Omzet vandaag"
            icon={<Wallet size={18} />}
            value={<AnimatedNumber value={todayRevenue / 100} duration={1100} format={(v) => formatPrice(Math.round(v * 100))} />}
            secondary={{
              label: "Deze maand",
              value: <AnimatedNumber value={monthRevenue / 100} duration={1100} format={(v) => formatPrice(Math.round(v * 100))} />
            }}
            progress={{
              current: todayRevenue,
              target: Math.max(1, avgRevenueDay)
            }}
          />
          <KpiCard
            delay={0.24}
            eyebrow="Uitbetaald totaal"
            icon={<Wallet size={18} />}
            value={<AnimatedNumber value={totalPaidOut / 100} duration={1300} format={(v) => formatPrice(Math.round(v * 100))} />}
            secondary={{
              label: "Nog uit te betalen",
              value: <AnimatedNumber value={pendingPayoutCents / 100} duration={1300} format={(v) => formatPrice(Math.round(v * 100))} />
            }}
            progress={{
              current: totalPaidOut,
              target: Math.max(1, totalPaidOut + pendingPayoutCents)
            }}
          />
          <KpiCard
            delay={0.3}
            eyebrow="Groei"
            icon={<TrendingUp size={18} />}
            value={<AnimatedNumber value={revenueChangePct} decimals={2} suffix="%" prefix="+" />}
            changePct={growthChangePct}
            progress={{
              current: Math.max(0, revenueChangePct),
              target: 100,
              label: `Doel: 100% groei`
            }}
          />
        </div>
      </div>

      {/* Row 3 — Top tools (mijn + marketplace) */}
      <div className="widget" style={{ marginTop: 18, animationDelay: "0.62s" }}>
        <div className="widget-head" style={{ alignItems: "center" }}>
          <div>
            <span className="eyebrow"><Star size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Best verkocht</span>
            <h3>Top tools</h3>
          </div>
          <div className="seller-period-toggle">
            <button type="button" className={topToolsTab === "mine" ? "active" : ""} onClick={() => setTopToolsTab("mine")}>
              Mijn topsellers
            </button>
            <button type="button" className={topToolsTab === "marketplace" ? "active" : ""} onClick={() => setTopToolsTab("marketplace")}>
              Marketplace topsellers
            </button>
          </div>
        </div>
        <div className="seller-toplist">
          {(topToolsTab === "mine" ? topListings : marketplaceTopTools).slice(0, 5).map((listing, index) => {
            const sellerName = state.sellers.find((s) => s.id === listing.sellerId)?.name ?? "Onbekend";
            return (
              <Link className="seller-toplist-row" key={listing.id} href={`/tools/${listing.slug}`}>
                <span className="seller-toplist-rank">{index + 1}</span>
                <div className="seller-toplist-icon"><Box size={18} /></div>
                <div>
                  <strong>{listing.title}</strong>
                  <small>{productTypeLabels[listing.type]} · {topToolsTab === "marketplace" ? sellerName : `${listing.downloads} downloads`}</small>
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

      {/* Row 4 — Komende afspraken */}
      <UpcomingAppointmentsWidget perspective="seller" />

      <AchievementsWidget />


      {/* Row 5 — Doelgroep + Reviews */}
      <div className="widget-grid split-2-1" style={{ marginTop: 18 }}>
        <div className="widget" style={{ animationDelay: "0.7s" }}>
          <div className="widget-head">
            <div>
              <span className="eyebrow"><Users size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Doelgroep</span>
              <h3>Omzet per branche</h3>
            </div>
            <small style={{ color: "var(--green-500)", fontSize: 12, fontWeight: 700 }}>
              {branchePerformance.length} branches actief
            </small>
          </div>
          {branchePerformance.length ? (
            <BranchePieChart data={branchePerformance} />
          ) : <p style={{ color: "var(--green-500)" }}>Nog geen branche-data.</p>}
        </div>

        <div className="widget" style={{ animationDelay: "0.76s" }}>
          <div className="widget-head">
            <div>
              <span className="eyebrow"><Star size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Reviews</span>
              <h3>Klantfeedback</h3>
            </div>
            <small style={{ color: "#16a34a", fontWeight: 800 }}>{reviewStats.positivePercent.toFixed(0)}% positief</small>
          </div>
          <div className="reviews-snapshot">
            <div className="reviews-snapshot-score">
              <strong>
                <AnimatedNumber value={reviewStats.avg ?? 0} decimals={1} duration={800} />
              </strong>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={13} fill={s <= Math.round(reviewStats.avg ?? 0) ? "currentColor" : "none"} strokeWidth={2} />
                ))}
              </div>
              <small>{reviewStats.total} reviews</small>
            </div>
            <div className="reviews-snapshot-bars">
              {reviewStats.distribution.map((row) => (
                <div className="reviews-snapshot-bar" key={row.star}>
                  <span>{row.star}★</span>
                  <span className="bar"><span style={{ width: `${row.percent}%` }} /></span>
                  <span>{row.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 6 — Transacties tabel met koper info */}
      <div className="widget" style={{ marginTop: 18, animationDelay: "0.82s" }}>
        <div className="widget-head">
          <div>
            <span className="eyebrow"><Receipt size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Transacties</span>
            <h3>Recente verkopen met koperdetails</h3>
          </div>
          <Link className="text-action" href="/seller/orders" style={{ fontSize: 12 }}>Alle bestellingen</Link>
        </div>
        {recentOrders.length ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Bestelling</th>
                <th>Koper</th>
                <th>Tool</th>
                <th>Datum</th>
                <th>Methode</th>
                <th style={{ textAlign: "right" }}>Bedrag</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(({ order, item }) => {
                const buyer = state.users.find((u) => u.id === order.buyerId);
                return (
                  <tr key={`${order.id}-${item.listingId}`}>
                    <td><strong>#{order.id.slice(-6)}</strong></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="customer-avatar" style={{ width: 26, height: 26, fontSize: 11 }}>
                          {(buyer?.name ?? "?").slice(0, 1).toUpperCase()}
                        </span>
                        <div style={{ lineHeight: 1.2 }}>
                          <strong style={{ fontSize: 12.5 }}>{buyer?.name ?? "—"}</strong>
                          <small style={{ display: "block", color: "var(--green-500)", fontSize: 11, fontWeight: 700 }}>
                            {buyer?.company ?? buyer?.email ?? ""}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{item.title}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td><span className="badge soft" style={{ fontSize: 11 }}>Test Pay</span></td>
                    <td className="amount">{formatPrice(item.quantity * item.priceCents + item.serviceAddOnPriceCents)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <p style={{ color: "var(--green-500)" }}>Nog geen verkopen.</p>}
      </div>

      {/* Row 7 — Open support + Payouts */}
      <div className="widget-grid split-2-1" style={{ marginTop: 18 }}>
        <div className="widget" style={{ animationDelay: "0.9s" }}>
          <div className="widget-head">
            <div>
              <span className="eyebrow"><LifeBuoy size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Support</span>
              <h3>Wachtende aanvragen</h3>
            </div>
            <Link className="text-action" href="/seller/services" style={{ fontSize: 12 }}>Alles ({openServices.length})</Link>
          </div>
          {openServices.length ? openServices.slice(0, 4).map((request) => {
            const listing = state.listings.find((item) => item.id === request.listingId);
            const buyer = state.users.find((u) => u.id === request.buyerId);
            return (
              <div className="seller-support-row" key={request.id}>
                <div className="customer-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                  {(buyer?.name ?? "?").slice(0, 1).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{listing?.title ?? "Onbekende tool"}</strong>
                  <p>{request.message}</p>
                  <small>{buyer?.name ?? "Anonieme koper"} · {formatTimeAgo(request.createdAt)}</small>
                </div>
                <span className={`status-badge ${request.status}`}>
                  {request.status === "new" && "Nieuw"}
                  {request.status === "in_progress" && "Bezig"}
                  {request.status === "waiting_for_buyer" && "Wacht"}
                </span>
              </div>
            );
          }) : (
            <p style={{ color: "var(--green-500)" }}>Geen open aanvragen. Alle support is up-to-date.</p>
          )}
        </div>

        <div className="widget" style={{ animationDelay: "0.96s" }}>
          <div className="widget-head">
            <div>
              <span className="eyebrow"><Wallet size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Uitbetalingen</span>
              <h3>Door Hazenco</h3>
            </div>
          </div>
          <div className="payout-summary">
            <div>
              <span className="eyebrow">Komend</span>
              <strong>{formatPrice(upcomingPayouts.reduce((s, p) => s + p.net, 0) || pendingPayout)}</strong>
            </div>
            <div>
              <span className="eyebrow">Uitbetaald</span>
              <strong>{formatPrice(paidPayouts.reduce((s, p) => s + p.net, 0))}</strong>
            </div>
          </div>
          <div className="payout-list">
            {[...upcomingPayouts, ...paidPayouts].slice(0, 4).map((payout) => (
              <div className={`payout-row ${payout.status}`} key={payout.id}>
                <div>
                  <strong>{payout.date.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}</strong>
                  <small>{payout.status === "paid" ? "Uitbetaald" : "Komende uitbetaling"}</small>
                </div>
                <strong className="payout-amount">{formatPrice(payout.net)}</strong>
              </div>
            ))}
            {upcomingPayouts.length === 0 && paidPayouts.length === 0 ? (
              <p style={{ color: "var(--green-500)", fontSize: 13 }}>Nog geen uitbetalingen.</p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

function KpiCard({
  delay,
  eyebrow,
  icon,
  value,
  changePct,
  vsYesterday,
  progress,
  secondary
}: {
  delay: number;
  eyebrow: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  changePct?: number;
  vsYesterday?: { delta: number; format?: (v: number) => string };
  progress?: { current: number; target: number; label?: string };
  secondary?: { label: string; value: React.ReactNode };
}) {
  const up = (changePct ?? 0) >= 0;
  const ydUp = (vsYesterday?.delta ?? 0) >= 0;
  const progressPct = progress ? Math.min(100, (progress.current / Math.max(0.001, progress.target)) * 100) : 0;
  return (
    <div className="widget kpi-mini" style={{ animationDelay: `${delay}s` }}>
      <div className="kpi-mini-head">
        <span className="eyebrow">{eyebrow}</span>
        <span className="kpi-mini-icon">{icon}</span>
      </div>
      <strong className="kpi-mini-value">{value}</strong>
      {secondary ? (
        <div className="kpi-mini-secondary">
          <small>{secondary.label}</small>
          <strong>{secondary.value}</strong>
        </div>
      ) : null}
      {vsYesterday ? (
        <span className={`kpi-mini-pill ${ydUp ? "up" : "down"}`}>
          {ydUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {vsYesterday.format ? vsYesterday.format(Math.abs(vsYesterday.delta)) : Math.abs(vsYesterday.delta).toLocaleString("nl-NL")}
          <small>vs gisteren</small>
        </span>
      ) : null}
      {typeof changePct === "number" ? (
        <span className={`kpi-mini-pill ${up ? "up" : "down"}`}>
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(changePct).toFixed(2)}%
          <small>vorige maand</small>
        </span>
      ) : null}
      {progress ? (
        <div className="kpi-mini-progress">
          <div className="kpi-mini-progress-bar">
            <span style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BranchePieChart({ data }: { data: { branche: string; revenue: number; count: number; percent: number }[] }) {
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
            <path
              key={s.branche}
              d={arcPath(s.startA, s.endA)}
              fill={s.color}
              style={{
                cursor: "pointer",
                transition: "opacity 0.16s ease, transform 0.18s ease",
                transformOrigin: "100px 100px",
                opacity: hoverIdx !== null && hoverIdx !== s.idx ? 0.35 : 1,
                transform: hoverIdx === s.idx ? "scale(1.04)" : "scale(1)"
              }}
              onMouseEnter={() => setHoverIdx(s.idx)}
              onMouseLeave={() => setHoverIdx(null)}
            />
          ))}
        </svg>
        <div className="branche-pie-center">
          {hovered ? (
            <>
              <small>{brancheLabels[hovered.branche as Branche]}</small>
              <strong>{formatPrice(hovered.revenue)}</strong>
              <small className="branche-pie-center-meta">
                {hovered.percent.toFixed(0)}% · {hovered.count} {hovered.count === 1 ? "download" : "downloads"}
              </small>
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
          <button
            type="button"
            className={`branche-pie-row${hoverIdx === s.idx ? " active" : ""}`}
            key={s.branche}
            onMouseEnter={() => setHoverIdx(s.idx)}
            onMouseLeave={() => setHoverIdx(null)}
          >
            <span className="dot" style={{ background: s.color }} />
            <strong>{brancheLabels[s.branche as Branche]}</strong>
            <span className="branche-pie-pct">{s.percent.toFixed(0)}%</span>
          </button>
        ))}
      </div>
    </div>
  );
}

