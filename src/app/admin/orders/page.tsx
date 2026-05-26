"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Download, Receipt, RotateCcw, X } from "lucide-react";
import { formatPrice } from "@/lib/marketplace-data";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";
import type { Order, OrderStatus } from "@/lib/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function toCsv(rows: string[][]): string {
  return rows.map((r) =>
    r.map((cell) => {
      const s = String(cell ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")
  ).join("\n");
}

function downloadFile(filename: string, content: string, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AdminOrdersPage() {
  const { state, refundOrder } = useMarketplace();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [refundFor, setRefundFor] = useState<Order | null>(null);

  const paidOrders = state.orders.filter((o) => o.status === "paid");
  const failedOrders = state.orders.filter((o) => o.status === "failed");
  const cancelledOrders = state.orders.filter((o) => o.status === "cancelled");
  const refundedOrders = state.orders.filter((o) => o.status === "refunded");
  const totalOrders = state.orders.length;
  const conversionRate = totalOrders > 0 ? (paidOrders.length / totalOrders) * 100 : 0;
  const totalGmv = paidOrders.reduce((s, o) => s + o.totalCents, 0);
  const refundedTotal = refundedOrders.reduce((s, o) => s + o.totalCents, 0);
  const avgOrderValue = paidOrders.length > 0 ? totalGmv / paidOrders.length : 0;

  const filtered = useMemo(() => {
    const items = state.orders
      .map((o) => ({ order: o, buyer: state.users.find((u) => u.id === o.buyerId) }))
      .filter(({ order, buyer }) => {
        if (statusFilter !== "all" && order.status !== statusFilter) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          if (
            !order.id.toLowerCase().includes(q) &&
            !buyer?.name.toLowerCase().includes(q) &&
            !order.items.some((i) => i.title.toLowerCase().includes(q))
          ) return false;
        }
        return true;
      })
      .sort((a, b) => +new Date(b.order.createdAt) - +new Date(a.order.createdAt));
    return items;
  }, [state.orders, state.users, statusFilter, query]);

  function exportCsv() {
    const header = ["Bestelling-ID", "Datum", "Koper", "E-mail", "Tools", "Status", "Bruto (EUR)"];
    const rows = filtered.map(({ order, buyer }) => [
      order.id,
      new Date(order.createdAt).toISOString(),
      buyer?.name ?? "",
      buyer?.email ?? "",
      order.items.map((i) => `${i.title} x${i.quantity}`).join(" | "),
      order.status,
      (order.totalCents / 100).toFixed(2)
    ]);
    const csv = toCsv([header, ...rows]);
    downloadFile(`hazenco-bestellingen-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  return (
    <>
      <div className="widget" style={{ marginTop: 0, padding: 0 }}>
        <div className="funnel-grid" style={{ padding: 18 }}>
          <div className="funnel-step"><span className="eyebrow">Totaal</span><strong>{totalOrders}</strong><small>100%</small></div>
          <div className="funnel-step success"><span className="eyebrow">Betaald</span><strong>{paidOrders.length}</strong><small>{conversionRate.toFixed(0)}% conversie</small></div>
          <div className="funnel-step warn"><span className="eyebrow">Mislukt</span><strong>{failedOrders.length}</strong><small>Betaalfout</small></div>
          <div className="funnel-step warn"><span className="eyebrow">Geannuleerd</span><strong>{cancelledOrders.length}</strong><small>Door koper</small></div>
          <div className="funnel-step warn"><span className="eyebrow">Refunded</span><strong>{refundedOrders.length}</strong><small>−{formatPrice(refundedTotal)}</small></div>
          <div className="funnel-step accent"><span className="eyebrow">AOV</span><strong>{formatPrice(avgOrderValue)}</strong><small>Gem. orderwaarde</small></div>
        </div>
      </div>

      <section className="section-card" style={{ marginTop: 18 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Receipt size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Transacties</span>
            <h2>Alle bestellingen ({filtered.length})</h2>
          </div>
          <button type="button" className="button secondary" onClick={exportCsv}>
            <Download size={14} /> Exporteer CSV
          </button>
        </div>

        <div className="bookings-toolbar">
          <input type="search" placeholder="Zoek bestelling, koper of tool..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="bookings-status-filter">
            {(["all", "paid", "pending", "failed", "cancelled", "refunded"] as const).map((s) => (
              <button key={s} type="button" className={statusFilter === s ? "active" : ""} onClick={() => setStatusFilter(s)}>
                {s === "all" && "Alle"}
                {s === "paid" && "Betaald"}
                {s === "pending" && "Wacht"}
                {s === "failed" && "Mislukt"}
                {s === "cancelled" && "Geannuleerd"}
                {s === "refunded" && "Refunded"}
              </button>
            ))}
          </div>
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
              <th style={{ textAlign: "right" }}>Acties</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--green-500)", padding: 24 }}>Geen bestellingen gevonden.</td></tr>
            ) : filtered.map(({ order, buyer }) => (
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
                  {order.status === "refunded" && "Refunded"}
                </span></td>
                <td className="amount">{formatPrice(order.totalCents)}</td>
                <td style={{ textAlign: "right" }}>
                  {order.status === "paid" ? (
                    <button type="button" className="button secondary" style={{ minHeight: 28, padding: "0 10px", fontSize: 11 }} onClick={() => setRefundFor(order)}>
                      <RotateCcw size={11} /> Refund
                    </button>
                  ) : <span style={{ opacity: 0.3, fontSize: 12 }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {refundFor ? (
        <RefundModal
          order={refundFor}
          buyer={state.users.find((u) => u.id === refundFor.buyerId)?.name ?? "Onbekend"}
          onClose={() => setRefundFor(null)}
          onConfirm={(reason) => {
            refundOrder(refundFor.id, reason);
            toast.success("Refund verleend", `€${(refundFor.totalCents / 100).toFixed(2)} wordt teruggeboekt naar de koper.`);
            setRefundFor(null);
          }}
        />
      ) : null}
    </>
  );
}

function RefundModal({
  order,
  buyer,
  onClose,
  onConfirm
}: {
  order: Order;
  buyer: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const valid = reason.trim().length >= 5 && confirmed;

  return (
    <div className="changelog-backdrop" onClick={onClose}>
      <div className="refund-modal" onClick={(e) => e.stopPropagation()}>
        <div className="changelog-head">
          <div>
            <span className="eyebrow" style={{ color: "#dc2626" }}><RotateCcw size={11} /> Refund verlenen</span>
            <h2>Bestelling #{order.id.slice(-8)}</h2>
            <small>Koper: {buyer} · Bedrag: {formatPrice(order.totalCents)}</small>
          </div>
          <button type="button" className="composer-icon-btn" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="refund-body">
          <div className="refund-warn">
            <AlertTriangle size={18} />
            <div>
              <strong>Let op — deze actie is permanent</strong>
              <small>Koper verliest downloadrechten, sales-stats van de creator worden teruggedraaid en het bedrag wordt teruggeboekt via Mollie.</small>
            </div>
          </div>

          <div className="refund-order-summary">
            <strong>Te refunden items</strong>
            <ul>
              {order.items.map((item) => (
                <li key={item.listingId}>
                  <span>{item.title} x{item.quantity}</span>
                  <strong>{formatPrice(item.priceCents * item.quantity + item.serviceAddOnPriceCents)}</strong>
                </li>
              ))}
            </ul>
            <div className="refund-total">
              <span>Totaal terug te boeken</span>
              <strong>{formatPrice(order.totalCents)}</strong>
            </div>
          </div>

          <label className="publish-version-field">
            <span>Reden voor refund</span>
            <textarea
              rows={4}
              placeholder="Bijv. tool werkt niet zoals beschreven, koper kon niet downloaden, dubbele aankoop..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <small className="publish-version-hint">Wordt opgeslagen in de audit-log en gemaild naar koper + creator.</small>
          </label>

          <label className="publish-version-checkbox">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
            <span>Ik bevestig dat ik <strong>{formatPrice(order.totalCents)}</strong> wil terugboeken naar {buyer}.</span>
          </label>
        </div>

        <div className="publish-version-foot">
          <button type="button" className="button secondary" onClick={onClose}>Annuleren</button>
          <button type="button" className="button danger" disabled={!valid} onClick={() => onConfirm(reason.trim())}>
            <RotateCcw size={14} /> Refund verlenen
          </button>
        </div>
      </div>
    </div>
  );
}
