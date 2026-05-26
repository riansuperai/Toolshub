import type { MarketplaceState, UserProfile } from "./types";

export type NotificationKind =
  | "order_paid"          // koper → "Aankoop bevestigd"
  | "new_sale"            // creator → "Nieuwe verkoop"
  | "new_message"         // beiden → "Nieuw bericht van X"
  | "appointment_proposed" // beiden → "Afspraak voorgesteld"
  | "appointment_approved" // beiden → "Afspraak goedgekeurd"
  | "listing_approved"    // creator → "Listing live"
  | "listing_rejected"    // creator → "Listing afgewezen"
  | "review_approved"     // creator → "Nieuwe review goedgekeurd"
  | "refund_issued"       // koper → "Refund verleend"
  | "support_request";    // creator → "Nieuwe support-aanvraag"

export type DerivedNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  link?: string;
  createdAt: string;
};

const LOOKBACK_DAYS = 30;
const READ_KEY = "hazenco-notifications-read";

function withinLookback(iso: string): boolean {
  const cutoff = Date.now() - LOOKBACK_DAYS * 86400_000;
  return new Date(iso).getTime() >= cutoff;
}

/** Reads the set of notification-IDs the user marked as read. */
export function getReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(window.localStorage.getItem(READ_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export function setReadIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(READ_KEY, JSON.stringify([...ids]));
}

/** Derive notifications for the given user from current state. Newest first. */
export function deriveNotifications(state: MarketplaceState, user: UserProfile): DerivedNotification[] {
  const out: DerivedNotification[] = [];
  const isAdmin = user.role === "admin";
  const isCreator = user.role === "seller";

  // === Bestellingen ===
  for (const order of state.orders) {
    if (!withinLookback(order.createdAt)) continue;
    if (order.status === "paid") {
      if (order.buyerId === user.id) {
        out.push({
          id: `order_paid_${order.id}`,
          kind: "order_paid",
          title: "Aankoop bevestigd",
          body: `Je hebt ${order.items.length} ${order.items.length === 1 ? "tool" : "tools"} ontgrendeld.`,
          link: "/account/orders",
          createdAt: order.createdAt
        });
      }
      if (isCreator && user.sellerId) {
        const sellerItems = order.items.filter((i) => i.sellerId === user.sellerId);
        if (sellerItems.length > 0) {
          const totalCents = sellerItems.reduce((s, i) => s + i.priceCents * i.quantity + i.serviceAddOnPriceCents, 0);
          out.push({
            id: `new_sale_${order.id}`,
            kind: "new_sale",
            title: "Nieuwe verkoop",
            body: `${sellerItems[0].title}${sellerItems.length > 1 ? ` +${sellerItems.length - 1}` : ""} · €${(totalCents / 100).toFixed(2)}`,
            link: "/seller/orders",
            createdAt: order.createdAt
          });
        }
      }
    }
    if (order.status === "refunded" && order.buyerId === user.id) {
      out.push({
        id: `refund_${order.id}`,
        kind: "refund_issued",
        title: "Refund verleend",
        body: `Je krijgt €${(order.totalCents / 100).toFixed(2)} terug op je rekening.`,
        link: "/account/orders",
        createdAt: order.createdAt
      });
    }
  }

  // === Berichten ===
  for (const msg of state.serviceMessages ?? []) {
    if (!withinLookback(msg.createdAt)) continue;
    const req = state.serviceRequests.find((r) => r.id === msg.requestId);
    if (!req) continue;
    const receiverId = msg.sender === "buyer" ? req.sellerId : req.buyerId;
    const senderName = msg.sender === "buyer"
      ? state.users.find((u) => u.id === req.buyerId)?.name ?? "Koper"
      : state.sellers.find((s) => s.id === req.sellerId)?.name ?? "Creator";

    const isForMe = (msg.sender === "buyer" && user.sellerId === req.sellerId) ||
                    (msg.sender === "seller" && user.id === req.buyerId);
    if (!isForMe) continue;
    out.push({
      id: `msg_${msg.id}`,
      kind: "new_message",
      title: `Nieuw bericht van ${senderName}`,
      body: msg.text.slice(0, 80),
      link: isCreator ? "/seller/services" : "/account/support",
      createdAt: msg.createdAt
    });
  }

  // === Afspraken ===
  for (const appt of state.appointments ?? []) {
    if (!withinLookback(appt.createdAt)) continue;
    const req = state.serviceRequests.find((r) => r.id === appt.requestId);
    if (!req) continue;
    const isForMe = (appt.proposedBy === "buyer" && user.sellerId === req.sellerId) ||
                    (appt.proposedBy === "seller" && user.id === req.buyerId);
    if (!isForMe) continue;
    const senderName = appt.proposedBy === "buyer"
      ? state.users.find((u) => u.id === req.buyerId)?.name ?? "Koper"
      : state.sellers.find((s) => s.id === req.sellerId)?.name ?? "Creator";
    if (appt.status === "proposed") {
      out.push({
        id: `appt_p_${appt.id}`,
        kind: "appointment_proposed",
        title: "Afspraak voorgesteld",
        body: `${senderName} stelt ${new Date(appt.startsAt).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} voor.`,
        link: isCreator ? "/seller/services" : "/account/support",
        createdAt: appt.createdAt
      });
    }
    if (appt.status === "approved" && appt.proposedBy === (isCreator ? "seller" : "buyer")) {
      // Mijn eigen voorstel werd goedgekeurd
      out.push({
        id: `appt_a_${appt.id}`,
        kind: "appointment_approved",
        title: "Afspraak goedgekeurd",
        body: `Je sessie op ${new Date(appt.startsAt).toLocaleString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} staat vast.`,
        link: isCreator ? "/seller/services" : "/account/support",
        createdAt: appt.createdAt
      });
    }
  }

  // === Listings (alleen creator) ===
  if (isCreator && user.sellerId) {
    for (const listing of state.listings) {
      if (listing.sellerId !== user.sellerId) continue;
      if (!withinLookback(listing.updatedAt)) continue;
      if (listing.status === "published") {
        out.push({
          id: `listing_pub_${listing.id}`,
          kind: "listing_approved",
          title: "Listing gepubliceerd",
          body: `${listing.title} staat nu live in de catalogus.`,
          link: "/seller/listings",
          createdAt: listing.updatedAt
        });
      } else if (listing.status === "rejected") {
        out.push({
          id: `listing_rej_${listing.id}`,
          kind: "listing_rejected",
          title: "Listing afgewezen",
          body: `${listing.title} is afgewezen door admin. Pas de listing aan en dien opnieuw in.`,
          link: "/seller/listings",
          createdAt: listing.updatedAt
        });
      }
    }
  }

  // === Reviews (alleen creator) ===
  if (isCreator && user.sellerId) {
    for (const review of state.reviews) {
      if (!review.approved) continue;
      if (!withinLookback(review.createdAt)) continue;
      const listing = state.listings.find((l) => l.id === review.listingId);
      if (!listing || listing.sellerId !== user.sellerId) continue;
      out.push({
        id: `review_${review.id}`,
        kind: "review_approved",
        title: `Nieuwe review · ${review.rating}/5`,
        body: `${review.buyerName} voor ${listing.title}: "${review.comment.slice(0, 60)}${review.comment.length > 60 ? "..." : ""}"`,
        link: `/tools/${listing.slug}`,
        createdAt: review.createdAt
      });
    }
  }

  // === Service requests (alleen creator) ===
  if (isCreator && user.sellerId) {
    for (const req of state.serviceRequests) {
      if (req.sellerId !== user.sellerId) continue;
      if (req.status !== "new") continue;
      if (!withinLookback(req.createdAt)) continue;
      const buyer = state.users.find((u) => u.id === req.buyerId);
      out.push({
        id: `sr_${req.id}`,
        kind: "support_request",
        title: "Nieuwe support-aanvraag",
        body: `${buyer?.name ?? "Koper"}: ${req.message.slice(0, 60)}${req.message.length > 60 ? "..." : ""}`,
        link: "/seller/services",
        createdAt: req.createdAt
      });
    }
  }

  // === Admin notificaties ===
  if (isAdmin) {
    for (const app of state.sellerApplications) {
      if (app.status !== "pending") continue;
      if (!withinLookback(app.createdAt)) continue;
      out.push({
        id: `app_${app.id}`,
        kind: "support_request",
        title: "Creator-aanvraag wacht",
        body: `${app.name} (${app.business})`,
        link: "/admin/sellers",
        createdAt: app.createdAt
      });
    }
    for (const r of state.reviews.filter((x) => !x.approved)) {
      if (!withinLookback(r.createdAt)) continue;
      out.push({
        id: `revmod_${r.id}`,
        kind: "support_request",
        title: "Review wacht op moderatie",
        body: `${r.buyerName} (${r.rating}/5)`,
        link: "/admin/reviews",
        createdAt: r.createdAt
      });
    }
  }

  return out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}
