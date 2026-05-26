/** Track per-listing funnel events: view → cart-add → checkout. */

const KEY = "hazenco-funnel-events";

type FunnelEvent = {
  listingId: string;
  kind: "view" | "cart_add" | "checkout";
  at: string;
};

export function loadEvents(): FunnelEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(events: FunnelEvent[]) {
  // Houd alleen laatste 1000 events bij
  const trimmed = events.slice(-1000);
  window.localStorage.setItem(KEY, JSON.stringify(trimmed));
}

export function trackFunnel(listingId: string, kind: FunnelEvent["kind"]) {
  if (typeof window === "undefined") return;
  const events = loadEvents();
  events.push({ listingId, kind, at: new Date().toISOString() });
  save(events);
}

export type FunnelStats = {
  views: number;
  cartAdds: number;
  checkouts: number;
  viewToCartRate: number;
  cartToCheckoutRate: number;
  overallConversion: number;
};

export function getFunnelStats(listingId: string): FunnelStats {
  const events = loadEvents().filter((e) => e.listingId === listingId);
  const views = events.filter((e) => e.kind === "view").length;
  const cartAdds = events.filter((e) => e.kind === "cart_add").length;
  const checkouts = events.filter((e) => e.kind === "checkout").length;
  return {
    views,
    cartAdds,
    checkouts,
    viewToCartRate: views > 0 ? (cartAdds / views) * 100 : 0,
    cartToCheckoutRate: cartAdds > 0 ? (checkouts / cartAdds) * 100 : 0,
    overallConversion: views > 0 ? (checkouts / views) * 100 : 0
  };
}
