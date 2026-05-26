"use client";

import { useMemo } from "react";
import { useMarketplace } from "./marketplace-store";

export function useSellerData() {
  const { state, activeUser } = useMarketplace();
  const seller = state.sellers.find((item) => item.id === activeUser.sellerId);

  const myListings = useMemo(
    () => (seller ? state.listings.filter((listing) => listing.sellerId === seller.id) : []),
    [seller, state.listings]
  );

  const publishedListings = useMemo(
    () => myListings.filter((l) => l.status === "published"),
    [myListings]
  );

  const pendingListings = useMemo(
    () => myListings.filter((l) => l.status === "pending"),
    [myListings]
  );

  const draftListings = useMemo(
    () => myListings.filter((l) => l.status === "draft"),
    [myListings]
  );

  const rejectedListings = useMemo(
    () => myListings.filter((l) => l.status === "rejected"),
    [myListings]
  );

  const myOrderItems = useMemo(() => {
    if (!seller) return [];
    return state.orders.flatMap((order) =>
      order.items
        .filter((item) => item.sellerId === seller.id)
        .map((item) => ({ order, item }))
    );
  }, [seller, state.orders]);

  const paidOrders = useMemo(
    () => myOrderItems.filter(({ order }) => order.status === "paid"),
    [myOrderItems]
  );

  const revenue = useMemo(
    () => paidOrders.reduce((sum, { item }) => sum + item.priceCents * item.quantity + item.serviceAddOnPriceCents, 0),
    [paidOrders]
  );

  const setupRevenue = useMemo(
    () => paidOrders.reduce((sum, { item }) => sum + (item.serviceAddOn ? item.serviceAddOnPriceCents : 0), 0),
    [paidOrders]
  );

  const totalDownloads = useMemo(
    () => myListings.reduce((sum, l) => sum + l.downloads, 0),
    [myListings]
  );

  const totalSales = useMemo(
    () => myListings.reduce((sum, l) => sum + l.sales, 0),
    [myListings]
  );

  const avgRating = useMemo(() => {
    const rated = publishedListings.filter((l) => l.rating > 0);
    if (rated.length === 0) return 0;
    return rated.reduce((sum, l) => sum + l.rating, 0) / rated.length;
  }, [publishedListings]);

  const myServices = useMemo(
    () => (seller ? state.serviceRequests.filter((request) => request.sellerId === seller.id) : []),
    [seller, state.serviceRequests]
  );

  const openServices = useMemo(
    () => myServices.filter((s) => s.status !== "completed"),
    [myServices]
  );

  const revenueByDay = useMemo(() => {
    const buckets = new Map<string, number>();
    const days = 30;
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      buckets.set(key, 0);
    }
    for (const { order, item } of paidOrders) {
      const key = order.createdAt.slice(0, 10);
      if (buckets.has(key)) {
        const amount = item.priceCents * item.quantity + item.serviceAddOnPriceCents;
        buckets.set(key, (buckets.get(key) ?? 0) + amount);
      }
    }
    return [...buckets.entries()].map(([date, cents]) => ({ date, cents }));
  }, [paidOrders]);

  const topListings = useMemo(
    () => [...publishedListings].sort((a, b) => b.sales - a.sales).slice(0, 5),
    [publishedListings]
  );

  const totalOrderCount = useMemo(() => {
    const ids = new Set(paidOrders.map(({ order }) => order.id));
    return ids.size;
  }, [paidOrders]);

  const avgOrderValue = useMemo(() => {
    if (totalOrderCount === 0) return 0;
    return revenue / totalOrderCount;
  }, [revenue, totalOrderCount]);

  const repeatBuyerRate = useMemo(() => {
    const buyerOrderCount = new Map<string, number>();
    for (const { order } of paidOrders) {
      buyerOrderCount.set(order.buyerId, (buyerOrderCount.get(order.buyerId) ?? 0) + 1);
    }
    const totalBuyers = buyerOrderCount.size;
    if (totalBuyers === 0) return 0;
    const repeat = [...buyerOrderCount.values()].filter((count) => count > 1).length;
    return (repeat / totalBuyers) * 100;
  }, [paidOrders]);

  const failedRate = useMemo(() => {
    if (!seller) return 0;
    const allOrders = state.orders.filter((order) =>
      order.items.some((item) => item.sellerId === seller.id)
    );
    if (allOrders.length === 0) return 0;
    const failed = allOrders.filter((order) => order.status === "failed" || order.status === "cancelled").length;
    return (failed / allOrders.length) * 100;
  }, [seller, state.orders]);

  const deliveryBreakdown = useMemo(() => {
    const counts: Record<string, number> = { download: 0, cloud: 0, custom: 0 };
    for (const { item } of paidOrders) {
      const listing = state.listings.find((l) => l.id === item.listingId);
      if (!listing) continue;
      for (const mode of listing.deliveryModes) {
        counts[mode] = (counts[mode] ?? 0) + 1;
      }
    }
    const max = Math.max(1, ...Object.values(counts));
    return Object.entries(counts).map(([mode, count]) => ({ mode, count, percent: (count / max) * 100 }));
  }, [paidOrders, state.listings]);

  const typeBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const listing of publishedListings) {
      counts.set(listing.type, (counts.get(listing.type) ?? 0) + listing.sales);
    }
    const max = Math.max(1, ...counts.values());
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([type, sales]) => ({ type, sales, percent: (sales / max) * 100 }));
  }, [publishedListings]);

  const brancheBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const { item } of paidOrders) {
      const listing = state.listings.find((l) => l.id === item.listingId);
      if (!listing) continue;
      for (const branche of listing.branches ?? []) {
        counts.set(branche, (counts.get(branche) ?? 0) + 1);
      }
    }
    const max = Math.max(1, ...counts.values());
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([branche, count]) => ({ branche, count, percent: (count / max) * 100 }));
  }, [paidOrders, state.listings]);

  const branchePerformance = useMemo(() => {
    const map = new Map<string, { revenue: number; count: number }>();
    for (const { item } of paidOrders) {
      const listing = state.listings.find((l) => l.id === item.listingId);
      if (!listing) continue;
      const amount = item.priceCents * item.quantity + item.serviceAddOnPriceCents;
      for (const branche of listing.branches ?? []) {
        const entry = map.get(branche) ?? { revenue: 0, count: 0 };
        entry.revenue += amount;
        entry.count += item.quantity;
        map.set(branche, entry);
      }
    }
    const totalRevenue = [...map.values()].reduce((s, e) => s + e.revenue, 0) || 1;
    return [...map.entries()]
      .map(([branche, { revenue, count }]) => ({
        branche,
        revenue,
        count,
        percent: (revenue / totalRevenue) * 100
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [paidOrders, state.listings]);

  const recentReviews = useMemo(() => {
    const myListingIds = new Set(myListings.map((l) => l.id));
    return state.reviews
      .filter((review) => myListingIds.has(review.listingId) && review.approved)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 5);
  }, [myListings, state.reviews]);

  const pendingPayout = useMemo(() => {
    const platformFee = 0.1;
    return Math.round(revenue * (1 - platformFee));
  }, [revenue]);

  // ---------- Vorige periode (voor % change) ----------
  const previousPeriodRevenue = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 60);
    const end = new Date();
    end.setDate(end.getDate() - 30);
    return paidOrders.reduce((sum, { order, item }) => {
      const d = new Date(order.createdAt);
      if (d >= start && d < end) {
        return sum + item.priceCents * item.quantity + item.serviceAddOnPriceCents;
      }
      return sum;
    }, 0);
  }, [paidOrders]);

  const previousPeriodOrders = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 60);
    const end = new Date();
    end.setDate(end.getDate() - 30);
    const ids = new Set<string>();
    for (const { order } of paidOrders) {
      const d = new Date(order.createdAt);
      if (d >= start && d < end) ids.add(order.id);
    }
    return ids.size;
  }, [paidOrders]);

  const revenueChangePct = useMemo(() => {
    if (previousPeriodRevenue === 0) return revenue > 0 ? 100 : 0;
    return ((revenue - previousPeriodRevenue) / previousPeriodRevenue) * 100;
  }, [revenue, previousPeriodRevenue]);

  const ordersChangePct = useMemo(() => {
    if (previousPeriodOrders === 0) return totalOrderCount > 0 ? 100 : 0;
    return ((totalOrderCount - previousPeriodOrders) / previousPeriodOrders) * 100;
  }, [totalOrderCount, previousPeriodOrders]);

  // Mock previous-period downloads = 92% van current
  const downloadsChangePct = totalDownloads > 0 ? 8.4 : 0;
  const growthChangePct = 4.87;

  // ---------- Sparkline data (laatste 14 dagen revenue) ----------
  const sparkRevenue = useMemo(() => {
    const buckets = new Map<string, number>();
    const days = 14;
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      buckets.set(key, 0);
    }
    for (const { order, item } of paidOrders) {
      const key = order.createdAt.slice(0, 10);
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + item.priceCents * item.quantity + item.serviceAddOnPriceCents);
      }
    }
    return [...buckets.values()];
  }, [paidOrders]);

  // ---------- Top customers ----------
  const topCustomers = useMemo(() => {
    const counts = new Map<string, { spend: number; orders: number }>();
    for (const { order, item } of paidOrders) {
      const entry = counts.get(order.buyerId) ?? { spend: 0, orders: 0 };
      entry.spend += item.priceCents * item.quantity + item.serviceAddOnPriceCents;
      entry.orders += 1;
      counts.set(order.buyerId, entry);
    }
    return [...counts.entries()]
      .map(([userId, stats]) => ({
        user: state.users.find((u) => u.id === userId),
        ...stats
      }))
      .filter((entry) => entry.user)
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 5);
  }, [paidOrders, state.users]);

  // ---------- Inventory status breakdown ----------
  const statusBreakdown = useMemo(() => {
    const total = myListings.length || 1;
    const counts = {
      published: publishedListings.length,
      pending: pendingListings.length,
      rejected: rejectedListings.length,
      draft: draftListings.length
    };
    return [
      { key: "published", label: "Gepubliceerd", count: counts.published, color: "#16a34a", percent: (counts.published / total) * 100 },
      { key: "pending", label: "In review", count: counts.pending, color: "#f59e0b", percent: (counts.pending / total) * 100 },
      { key: "draft", label: "Concept", count: counts.draft, color: "#94a3b8", percent: (counts.draft / total) * 100 },
      { key: "rejected", label: "Afgewezen", count: counts.rejected, color: "#dc2626", percent: (counts.rejected / total) * 100 }
    ];
  }, [myListings.length, publishedListings.length, pendingListings.length, draftListings.length, rejectedListings.length]);

  // ---------- Review stats ----------
  const myListingIds = useMemo(() => new Set(myListings.map((l) => l.id)), [myListings]);
  const myReviews = useMemo(
    () => state.reviews.filter((review) => myListingIds.has(review.listingId) && review.approved),
    [myListingIds, state.reviews]
  );

  const reviewStats = useMemo(() => {
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: myReviews.filter((r) => r.rating === star).length
    }));
    const total = myReviews.length;
    const max = Math.max(1, ...distribution.map((d) => d.count));
    return {
      total,
      avg: avgRating,
      positivePercent: total > 0 ? (distribution.filter((d) => d.star >= 4).reduce((s, d) => s + d.count, 0) / total) * 100 : 0,
      distribution: distribution.map((d) => ({ ...d, percent: (d.count / max) * 100 }))
    };
  }, [myReviews, avgRating]);

  // ---------- Recent activity (events) ----------
  const recentActivity = useMemo(() => {
    type ActivityItem = { id: string; type: "order" | "review" | "support" | "listing"; title: string; subtitle: string; createdAt: string };
    const items: ActivityItem[] = [];
    for (const { order, item } of paidOrders) {
      items.push({
        id: `order_${order.id}_${item.listingId}`,
        type: "order",
        title: `Nieuwe verkoop: ${item.title}`,
        subtitle: `Bestelling #${order.id.slice(-6)}`,
        createdAt: order.createdAt
      });
    }
    for (const review of myReviews) {
      const listing = state.listings.find((l) => l.id === review.listingId);
      items.push({
        id: `review_${review.id}`,
        type: "review",
        title: `${review.rating}★ review op ${listing?.title ?? "tool"}`,
        subtitle: `door ${review.buyerName}`,
        createdAt: review.createdAt
      });
    }
    for (const service of myServices) {
      const listing = state.listings.find((l) => l.id === service.listingId);
      items.push({
        id: `service_${service.id}`,
        type: "support",
        title: `Service-aanvraag: ${listing?.title ?? "tool"}`,
        subtitle: service.scope,
        createdAt: service.createdAt
      });
    }
    for (const listing of myListings) {
      if (listing.status === "published") {
        items.push({
          id: `listing_${listing.id}`,
          type: "listing",
          title: `Listing live: ${listing.title}`,
          subtitle: "Goedgekeurd door admin",
          createdAt: listing.updatedAt
        });
      }
    }
    return items
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 8);
  }, [myListings, myReviews, myServices, paidOrders, state.listings]);

  // ---------- Upcoming / Calendar (mocked from service requests + payouts) ----------
  const upcomingItems = useMemo(() => {
    const items: { id: string; label: string; date: Date; tag: string; tone: "support" | "payout" | "listing" }[] = [];
    const now = new Date();
    for (const service of openServices) {
      const due = new Date(service.createdAt);
      due.setDate(due.getDate() + 3);
      if (due >= now) {
        const listing = state.listings.find((l) => l.id === service.listingId);
        items.push({
          id: `due_${service.id}`,
          label: `Support deadline: ${listing?.title ?? "tool"}`,
          date: due,
          tag: "SLA 3 dagen",
          tone: "support"
        });
      }
    }
    // Mock payout op de 1ste van volgende maand
    const nextPayout = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    items.push({
      id: "payout_next",
      label: `Uitbetaling ${nextPayout.toLocaleDateString("nl-NL", { month: "long" })}`,
      date: nextPayout,
      tag: `${(revenue * 0.9 / 100).toFixed(2)} EUR`,
      tone: "payout"
    });
    for (const listing of pendingListings) {
      const eta = new Date(listing.createdAt);
      eta.setDate(eta.getDate() + 5);
      items.push({
        id: `pending_${listing.id}`,
        label: `Listing-review: ${listing.title}`,
        date: eta,
        tag: "Admin review",
        tone: "listing"
      });
    }
    return items.sort((a, b) => +a.date - +b.date).slice(0, 5);
  }, [openServices, pendingListings, revenue, state.listings]);

  // ---------- Monthly goal ----------
  const monthlyGoalCents = 500000; // €5.000 doel
  const monthRevenue = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return paidOrders.reduce((sum, { order, item }) => {
      const d = new Date(order.createdAt);
      if (d >= start) {
        return sum + item.priceCents * item.quantity + item.serviceAddOnPriceCents;
      }
      return sum;
    }, 0);
  }, [paidOrders]);

  const goalProgress = Math.min(100, (monthRevenue / monthlyGoalCents) * 100);
  const daysLeftInMonth = (() => {
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return last.getDate() - now.getDate();
  })();

  // ---------- Periode revenues (vandaag / week / maand / jaar) ----------
  const periodRevenue = useMemo(() => {
    const now = new Date();
    const startToday = new Date(now); startToday.setHours(0, 0, 0, 0);
    const startWeek = new Date(now); startWeek.setDate(now.getDate() - 7); startWeek.setHours(0, 0, 0, 0);
    const startMonth = new Date(now); startMonth.setDate(now.getDate() - 30); startMonth.setHours(0, 0, 0, 0);
    const startYear = new Date(now); startYear.setDate(now.getDate() - 365); startYear.setHours(0, 0, 0, 0);

    const accum = { today: 0, week: 0, month: 0, year: 0, total: revenue };
    for (const { order, item } of paidOrders) {
      const d = new Date(order.createdAt);
      const amount = item.priceCents * item.quantity + item.serviceAddOnPriceCents;
      if (d >= startToday) accum.today += amount;
      if (d >= startWeek) accum.week += amount;
      if (d >= startMonth) accum.month += amount;
      if (d >= startYear) accum.year += amount;
    }
    return accum;
  }, [paidOrders, revenue]);

  // Chart buckets per periode
  const revenueByPeriod = useMemo(() => {
    const now = new Date();
    function getWeekNumber(date: Date): number {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    }

    // VANDAAG: 24 uur
    const today: { label: string; cents: number }[] = [];
    for (let h = 0; h < 24; h++) today.push({ label: `${h.toString().padStart(2, "0")}:00`, cents: 0 });
    const startDay = new Date(now); startDay.setHours(0, 0, 0, 0);
    for (const { order, item } of paidOrders) {
      const d = new Date(order.createdAt);
      if (d >= startDay) {
        today[d.getHours()].cents += item.priceCents * item.quantity + item.serviceAddOnPriceCents;
      }
    }

    // WEKELIJKS: laatste 12 weken (per week, weeknummer label)
    const week: { label: string; cents: number; key: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i * 7);
      const wk = getWeekNumber(d);
      week.push({ label: `W${wk.toString().padStart(2, "0")}`, cents: 0, key: `${d.getFullYear()}-${wk}` });
    }
    for (const { order, item } of paidOrders) {
      const d = new Date(order.createdAt);
      const wk = getWeekNumber(d);
      const key = `${d.getFullYear()}-${wk}`;
      const bucket = week.find((b) => b.key === key);
      if (bucket) bucket.cents += item.priceCents * item.quantity + item.serviceAddOnPriceCents;
    }

    // MAANDELIJKS: laatste 12 maanden (per maand, maand-naam label)
    const month: { label: string; cents: number; key: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      month.push({
        label: d.toLocaleDateString("nl-NL", { month: "short" }),
        cents: 0,
        key: `${d.getFullYear()}-${d.getMonth()}`
      });
    }
    for (const { order, item } of paidOrders) {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = month.find((b) => b.key === key);
      if (bucket) bucket.cents += item.priceCents * item.quantity + item.serviceAddOnPriceCents;
    }

    // JAARLIJKS: laatste 5 jaren (per jaar)
    const year: { label: string; cents: number; key: string }[] = [];
    for (let i = 4; i >= 0; i--) {
      const y = now.getFullYear() - i;
      year.push({ label: `${y}`, cents: 0, key: `${y}` });
    }
    for (const { order, item } of paidOrders) {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}`;
      const bucket = year.find((b) => b.key === key);
      if (bucket) bucket.cents += item.priceCents * item.quantity + item.serviceAddOnPriceCents;
    }

    return { today, week, month, year };
  }, [paidOrders]);

  // ---------- Order status counts (uit alle seller-related orders) ----------
  const orderStatusCounts = useMemo(() => {
    if (!seller) return { paid: 0, failed: 0, cancelled: 0, pending: 0, inCart: 0 };
    const sellerOrderIds = new Set<string>();
    const statusMap: Record<string, number> = { paid: 0, failed: 0, cancelled: 0, pending: 0 };
    for (const order of state.orders) {
      const hasOurs = order.items.some((item) => item.sellerId === seller.id);
      if (!hasOurs || sellerOrderIds.has(order.id)) continue;
      sellerOrderIds.add(order.id);
      statusMap[order.status] = (statusMap[order.status] ?? 0) + 1;
    }
    // Mock: huidige cart items van onze listings
    const inCart = state.cart.filter((c) => {
      const listing = state.listings.find((l) => l.id === c.listingId);
      return listing?.sellerId === seller.id;
    }).reduce((s, c) => s + c.quantity, 0);
    return { ...statusMap, inCart } as { paid: number; failed: number; cancelled: number; pending: number; inCart: number };
  }, [seller, state.cart, state.listings, state.orders]);

  // ---------- Cross-marketplace top tools (anderen) ----------
  const marketplaceTopTools = useMemo(() => {
    if (!seller) return [];
    return state.listings
      .filter((l) => l.status === "published" && l.sellerId !== seller.id)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [seller, state.listings]);

  // ---------- Mock payout history ----------
  const payoutsHistory = useMemo(() => {
    const now = new Date();
    const platformFee = 0.1;
    // Bouw maandelijkse payout-buckets uit paid orders, per kalendermaand
    const buckets = new Map<string, number>();
    for (const { order, item } of paidOrders) {
      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      const amount = item.priceCents * item.quantity + item.serviceAddOnPriceCents;
      buckets.set(key, (buckets.get(key) ?? 0) + amount);
    }
    const currentKey = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
    const history: { id: string; date: Date; gross: number; net: number; status: "paid" | "pending" }[] = [];
    [...buckets.entries()].forEach(([key, gross]) => {
      const [year, month] = key.split("-").map(Number);
      const isCurrent = key === currentKey;
      const payoutDate = new Date(year, month, 1); // 1e v/d volgende maand
      history.push({
        id: `payout_${key}`,
        date: payoutDate,
        gross,
        net: Math.round(gross * (1 - platformFee)),
        status: isCurrent ? "pending" : payoutDate <= now ? "paid" : "pending"
      });
    });
    return history.sort((a, b) => +b.date - +a.date);
  }, [paidOrders]);

  const upcomingPayouts = useMemo(() => payoutsHistory.filter((p) => p.status === "pending"), [payoutsHistory]);
  const paidPayouts = useMemo(() => payoutsHistory.filter((p) => p.status === "paid"), [payoutsHistory]);

  return {
    seller,
    myListings,
    publishedListings,
    pendingListings,
    draftListings,
    rejectedListings,
    myOrderItems,
    paidOrders,
    revenue,
    setupRevenue,
    totalDownloads,
    totalSales,
    avgRating,
    myServices,
    openServices,
    revenueByDay,
    topListings,
    totalOrderCount,
    avgOrderValue,
    repeatBuyerRate,
    failedRate,
    deliveryBreakdown,
    typeBreakdown,
    brancheBreakdown,
    recentReviews,
    pendingPayout,
    revenueChangePct,
    ordersChangePct,
    downloadsChangePct,
    growthChangePct,
    sparkRevenue,
    topCustomers,
    statusBreakdown,
    reviewStats,
    recentActivity,
    upcomingItems,
    monthRevenue,
    monthlyGoalCents,
    goalProgress,
    daysLeftInMonth,
    periodRevenue,
    revenueByPeriod,
    orderStatusCounts,
    marketplaceTopTools,
    upcomingPayouts,
    paidPayouts,
    branchePerformance
  };
}
