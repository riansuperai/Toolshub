"use client";

import { useMemo, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import { formatPrice } from "@/lib/marketplace-data";
import { useMarketplace } from "@/lib/marketplace-store";

export default function AdminKopersPage() {
  const { state } = useMarketplace();
  const [query, setQuery] = useState("");
  const paidOrders = state.orders.filter((o) => o.status === "paid");

  const buyers = useMemo(() => {
    const map = new Map<string, { spend: number; orders: number; lastOrder?: string }>();
    for (const order of paidOrders) {
      const entry = map.get(order.buyerId) ?? { spend: 0, orders: 0 };
      entry.spend += order.totalCents;
      entry.orders += 1;
      if (!entry.lastOrder || new Date(order.createdAt) > new Date(entry.lastOrder)) {
        entry.lastOrder = order.createdAt;
      }
      map.set(order.buyerId, entry);
    }
    const allUsers = state.users.filter((u) => u.role === "buyer");
    const items = allUsers.map((user) => {
      const stats = map.get(user.id) ?? { spend: 0, orders: 0 };
      return { user, ...stats };
    });
    return items.sort((a, b) => b.spend - a.spend);
  }, [paidOrders, state.users]);

  const filtered = useMemo(() => {
    if (!query.trim()) return buyers;
    const q = query.toLowerCase();
    return buyers.filter(({ user }) =>
      user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || (user.company ?? "").toLowerCase().includes(q)
    );
  }, [buyers, query]);

  const activeBuyers = buyers.filter((b) => b.orders > 0).length;
  const totalSpend = buyers.reduce((s, b) => s + b.spend, 0);

  return (
    <>
      <div className="widget" style={{ marginTop: 0, padding: 0 }}>
        <div className="funnel-grid" style={{ padding: 18 }}>
          <div className="funnel-step"><span className="eyebrow">Totaal kopers</span><strong>{buyers.length}</strong><small>Geregistreerd</small></div>
          <div className="funnel-step success"><span className="eyebrow">Actief</span><strong>{activeBuyers}</strong><small>≥ 1 aankoop</small></div>
          <div className="funnel-step accent"><span className="eyebrow">Totale besteding</span><strong>{formatPrice(totalSpend)}</strong><small>Alle kopers</small></div>
          <div className="funnel-step accent">
            <span className="eyebrow">Gem. per koper</span>
            <strong>{activeBuyers > 0 ? formatPrice(totalSpend / activeBuyers) : "€0"}</strong>
            <small>Klant-LTV</small>
          </div>
        </div>
      </div>

      <section className="section-card" style={{ marginTop: 18 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><UsersIcon size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Kopers</span>
            <h2>{filtered.length} kopers</h2>
          </div>
        </div>

        <div className="bookings-toolbar">
          <input type="search" placeholder="Zoek naam, e-mail of bedrijf..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Koper</th>
              <th>Bedrijf</th>
              <th>Bestellingen</th>
              <th>Laatste bestelling</th>
              <th style={{ textAlign: "right" }}>Besteed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--green-500)", padding: 24 }}>Geen kopers gevonden.</td></tr>
            ) : filtered.map(({ user, spend, orders, lastOrder }, idx) => (
              <tr key={user.id}>
                <td><strong>{idx + 1}</strong></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="customer-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {user.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div style={{ lineHeight: 1.2 }}>
                      <strong style={{ fontSize: 13 }}>{user.name}</strong>
                      <small style={{ display: "block", color: "var(--green-500)", fontSize: 11 }}>{user.email}</small>
                    </div>
                  </div>
                </td>
                <td>{user.company ?? "—"}</td>
                <td>{orders}</td>
                <td>{lastOrder ? new Date(lastOrder).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                <td className="amount">{formatPrice(spend)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
