"use client";

import { Calendar } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useAccountData } from "@/lib/account-data";
import { formatPrice } from "@/lib/marketplace-data";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function AccountOrdersPage() {
  const { activeUser } = useMarketplace();
  const { myOrders } = useAccountData();

  if (activeUser.role === "visitor") return null;

  const sortedOrders = [...myOrders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const totalSpent = myOrders.filter((o) => o.status === "paid").reduce((sum, o) => sum + o.totalCents, 0);

  return (
    <section className="section-card" style={{ marginTop: 0 }}>
      <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
        <div>
          <span className="eyebrow">Bestellingen</span>
          <h2>Betaalgeschiedenis ({myOrders.length})</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ display: "block", color: "var(--green-500)", fontSize: 12, fontWeight: 700 }}>Totaal betaald</span>
          <strong style={{ color: "var(--green-900)", fontSize: 20, fontWeight: 900 }}>{formatPrice(totalSpent)}</strong>
        </div>
      </div>
      {sortedOrders.length ? (
        sortedOrders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-card-head">
              <div>
                <strong>Bestelling #{order.id.slice(-8)}</strong>
                <span className="small">
                  <Calendar size={11} style={{ verticalAlign: -1, marginRight: 3 }} />
                  {formatDate(order.createdAt)} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
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
              <span>{order.items.map((item) => item.title).join(", ")}</span>
              <strong>{formatPrice(order.totalCents)}</strong>
            </div>
          </div>
        ))
      ) : (
        <p>Nog geen orders.</p>
      )}
    </section>
  );
}
