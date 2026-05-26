"use client";

import { Calendar } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { formatPrice } from "@/lib/marketplace-data";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function SellerOrdersPage() {
  const { activeUser } = useMarketplace();
  const data = useSellerData();

  if (activeUser.role !== "seller" || !data.seller) return null;

  const allOrders = [...data.myOrderItems].sort(
    (a, b) => +new Date(b.order.createdAt) - +new Date(a.order.createdAt)
  );

  return (
    <section className="section-card" style={{ marginTop: 0 }}>
      <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
        <div>
          <span className="eyebrow">Bestellingen</span>
          <h2>Alle verkopen ({allOrders.length})</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ display: "block", color: "var(--green-500)", fontSize: 12, fontWeight: 700 }}>Totaal omzet</span>
          <strong style={{ color: "var(--green-900)", fontSize: 20, fontWeight: 900 }}>{formatPrice(data.revenue)}</strong>
        </div>
      </div>
      {allOrders.length ? allOrders.map(({ order, item }) => (
        <div className="order-card" key={`${order.id}-${item.listingId}`}>
          <div className="order-card-head">
            <div>
              <strong>{item.title}</strong>
              <span className="small">
                <Calendar size={11} style={{ verticalAlign: -1, marginRight: 3 }} />
                {formatDate(order.createdAt)} · #{order.id.slice(-8)}
              </span>
            </div>
            <span className={`status-badge ${order.status}`}>
              {order.status === "paid" && "Betaald"}
              {order.status === "pending" && "In behandeling"}
              {order.status === "failed" && "Mislukt"}
              {order.status === "cancelled" && "Geannuleerd"}
            </span>
          </div>
          <div className="order-card-body">
            <span>{item.quantity} × {formatPrice(item.priceCents)}{item.serviceAddOn ? ` + setup ${formatPrice(item.serviceAddOnPriceCents)}` : ""}</span>
            <strong>{formatPrice(item.quantity * item.priceCents + item.serviceAddOnPriceCents)}</strong>
          </div>
        </div>
      )) : <p>Nog geen verkopen.</p>}
    </section>
  );
}
