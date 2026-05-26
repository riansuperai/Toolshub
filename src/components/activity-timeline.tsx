"use client";

import { useMemo } from "react";
import { Calendar, MessageSquare, Package, Receipt, Star, TrendingUp, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { formatPrice } from "@/lib/marketplace-data";
import { EmptyState } from "@/components/empty-state";

type TimelineEntry = {
  id: string;
  icon: LucideIcon;
  kind: string;
  title: string;
  meta?: string;
  amount?: number;
  createdAt: string;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("nl-NL", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function formatAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m geleden`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}u geleden`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d geleden`;
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
}

export function ActivityTimeline({ perspective }: { perspective: "buyer" | "creator" }) {
  const { state, activeUser } = useMarketplace();

  const entries = useMemo<TimelineEntry[]>(() => {
    const out: TimelineEntry[] = [];

    if (perspective === "buyer") {
      // Orders
      for (const order of state.orders) {
        if (order.buyerId !== activeUser.id) continue;
        if (order.status === "paid") {
          out.push({
            id: `o_${order.id}`,
            icon: Receipt,
            kind: "order",
            title: `Aankoop: ${order.items.map((i) => i.title).join(", ")}`,
            meta: `#${order.id.slice(-6)}`,
            amount: order.totalCents,
            createdAt: order.createdAt
          });
        } else if (order.status === "refunded") {
          out.push({
            id: `o_r_${order.id}`,
            icon: Wallet,
            kind: "refund",
            title: `Refund verleend voor #${order.id.slice(-6)}`,
            amount: order.totalCents,
            createdAt: order.createdAt
          });
        }
      }
      // Reviews
      for (const review of state.reviews) {
        if (review.buyerId !== activeUser.id) continue;
        const listing = state.listings.find((l) => l.id === review.listingId);
        out.push({
          id: `r_${review.id}`,
          icon: Star,
          kind: "review",
          title: `${review.rating}/5 voor ${listing?.title ?? "tool"}${review.approved ? "" : " (in moderatie)"}`,
          createdAt: review.createdAt
        });
      }
      // Messages
      for (const m of state.serviceMessages ?? []) {
        if (m.sender !== "buyer") continue;
        const req = state.serviceRequests.find((r) => r.id === m.requestId);
        if (req?.buyerId !== activeUser.id) continue;
        const listing = state.listings.find((l) => l.id === req?.listingId);
        out.push({
          id: `m_${m.id}`,
          icon: MessageSquare,
          kind: "message",
          title: `Bericht over ${listing?.title ?? "tool"}: "${m.text.slice(0, 50)}${m.text.length > 50 ? "..." : ""}"`,
          createdAt: m.createdAt
        });
      }
    } else {
      // Creator perspective
      const sellerId = activeUser.sellerId;
      if (!sellerId) return [];
      for (const order of state.orders) {
        if (order.status !== "paid") continue;
        const myItems = order.items.filter((i) => i.sellerId === sellerId);
        if (myItems.length === 0) continue;
        const total = myItems.reduce((s, i) => s + i.priceCents * i.quantity + i.serviceAddOnPriceCents, 0);
        out.push({
          id: `s_${order.id}`,
          icon: TrendingUp,
          kind: "sale",
          title: `Verkoop: ${myItems.map((i) => i.title).join(", ")}`,
          meta: `#${order.id.slice(-6)}`,
          amount: Math.round(total * 0.9),
          createdAt: order.createdAt
        });
      }
      // Listing publicaties
      for (const listing of state.listings) {
        if (listing.sellerId !== sellerId) continue;
        if (listing.status === "published") {
          out.push({
            id: `l_pub_${listing.id}`,
            icon: Package,
            kind: "listing",
            title: `Listing gepubliceerd: ${listing.title}`,
            createdAt: listing.updatedAt
          });
        }
      }
      // Reviews op mijn listings
      for (const review of state.reviews) {
        if (!review.approved) continue;
        const listing = state.listings.find((l) => l.id === review.listingId);
        if (!listing || listing.sellerId !== sellerId) continue;
        out.push({
          id: `rv_${review.id}`,
          icon: Star,
          kind: "review",
          title: `Nieuwe ${review.rating}/5 review op ${listing.title}`,
          createdAt: review.createdAt
        });
      }
      // Appointments
      for (const appt of state.appointments ?? []) {
        if (appt.status !== "approved") continue;
        const req = state.serviceRequests.find((r) => r.id === appt.requestId);
        if (!req || req.sellerId !== sellerId) continue;
        out.push({
          id: `a_${appt.id}`,
          icon: Calendar,
          kind: "appointment",
          title: `Afspraak goedgekeurd · ${appt.note ?? "Support sessie"}`,
          createdAt: appt.createdAt
        });
      }
    }

    return out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 30);
  }, [state, activeUser, perspective]);

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="Nog geen activiteit"
        description={perspective === "buyer" ? "Zodra je tools koopt of reviewt verschijnt het hier." : "Zodra je verkoopt of reviews krijgt verschijnt het hier."}
        size="md"
      />
    );
  }

  return (
    <div className="activity-timeline">
      {entries.map((e) => {
        const Icon = e.icon;
        return (
          <div className={`activity-timeline-entry kind-${e.kind}`} key={e.id}>
            <span className="activity-timeline-icon"><Icon size={14} /></span>
            <div className="activity-timeline-body">
              <strong>{e.title}</strong>
              <small>
                {e.meta ? `${e.meta} · ` : ""}
                {formatAgo(e.createdAt)}
                <span className="activity-timeline-date">{formatDate(e.createdAt)}</span>
              </small>
            </div>
            {typeof e.amount === "number" ? (
              <strong className="activity-timeline-amount">{formatPrice(e.amount)}</strong>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
