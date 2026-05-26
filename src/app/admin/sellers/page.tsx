"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CheckSquare, ShieldCheck, Square, Store, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/marketplace-data";
import { useMarketplace } from "@/lib/marketplace-store";

const PLATFORM_FEE = 0.1;

function formatNumber(value: number) {
  return value.toLocaleString("nl-NL");
}

export default function AdminCreatorsPage() {
  const { state, approveSellerApplication, rejectSellerApplication } = useMarketplace();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const pendingApplications = state.sellerApplications.filter((a) => a.status === "pending");
  const paidOrders = state.orders.filter((o) => o.status === "paid");

  function toggleId(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function bulkApprove() {
    if (!confirm(`${selectedIds.size} aanvragen goedkeuren?`)) return;
    selectedIds.forEach((id) => approveSellerApplication(id));
    setSelectedIds(new Set());
  }

  function bulkReject() {
    if (!confirm(`${selectedIds.size} aanvragen afwijzen?`)) return;
    selectedIds.forEach((id) => rejectSellerApplication(id));
    setSelectedIds(new Set());
  }

  const creatorsWithStats = useMemo(() => {
    // Voor uitbetaling/nog-uit-te-betalen: orders ouder dan 30 dagen worden geacht reeds uitbetaald te zijn
    const payoutCutoff = new Date();
    payoutCutoff.setDate(payoutCutoff.getDate() - 30);

    return state.sellers
      .map((seller) => {
        const sellerListings = state.listings.filter((l) => l.sellerId === seller.id && l.status === "published");
        const downloads = sellerListings.reduce((sum, l) => sum + l.downloads, 0);

        let revenue = 0;
        let paidOutNet = 0;
        let pendingNet = 0;
        for (const order of paidOrders) {
          for (const item of order.items) {
            if (item.sellerId !== seller.id) continue;
            const bruto = item.priceCents * item.quantity + item.serviceAddOnPriceCents;
            const net = Math.round(bruto * (1 - PLATFORM_FEE));
            revenue += bruto;
            if (new Date(order.createdAt) < payoutCutoff) {
              paidOutNet += net;
            } else {
              pendingNet += net;
            }
          }
        }
        return { seller, listings: sellerListings.length, revenue, downloads, paidOut: paidOutNet, pending: pendingNet };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [paidOrders, state.listings, state.sellers]);

  return (
    <>
      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><ShieldCheck size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Creator-wachtrij</span>
            <h2>Aanvragen ({pendingApplications.length})</h2>
          </div>
          {selectedIds.size > 0 ? (
            <div className="bulk-bar">
              <small>{selectedIds.size} geselecteerd</small>
              <button type="button" className="button" onClick={bulkApprove}><CheckCircle2 size={13} /> Goedkeuren</button>
              <button type="button" className="button secondary" onClick={bulkReject}><XCircle size={13} /> Afwijzen</button>
              <button type="button" className="button secondary" onClick={() => setSelectedIds(new Set())}>Wissen</button>
            </div>
          ) : pendingApplications.length > 0 ? (
            <button type="button" className="button secondary" onClick={() => setSelectedIds(new Set(pendingApplications.map((a) => a.id)))}>
              <CheckSquare size={13} /> Selecteer alles
            </button>
          ) : null}
        </div>
        {pendingApplications.length ? pendingApplications.map((application) => {
          const isSelected = selectedIds.has(application.id);
          return (
            <div className={`admin-queue-row${isSelected ? " selected" : ""}`} key={application.id}>
              <button
                type="button"
                className="bulk-checkbox"
                onClick={() => toggleId(application.id)}
                aria-pressed={isSelected}
              >
                {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
              <div>
                <strong>{application.name}</strong>
                <span className="small">{application.business}</span>
                <p>{application.experience}</p>
              </div>
              <div className="admin-queue-actions">
                <button className="button secondary" type="button" onClick={() => rejectSellerApplication(application.id)}>
                  <XCircle size={14} /> Afwijzen
                </button>
                <button className="button" type="button" onClick={() => approveSellerApplication(application.id)}>
                  <CheckCircle2 size={14} /> Goedkeuren
                </button>
              </div>
            </div>
          );
        }) : <p style={{ color: "var(--green-500)" }}>Geen openstaande aanvragen.</p>}
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Store size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Alle creators</span>
            <h2>{state.sellers.length} actieve creators</h2>
          </div>
          <small style={{ color: "var(--green-500)", fontSize: 12, fontWeight: 700 }}>Gesorteerd op omzet</small>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Creator</th>
              <th>Specialisatie</th>
              <th>Listings</th>
              <th>Downloads</th>
              <th style={{ textAlign: "right" }}>Omzet</th>
              <th style={{ textAlign: "right" }}>Uitbetaald</th>
              <th style={{ textAlign: "right" }}>Nog uit te betalen</th>
            </tr>
          </thead>
          <tbody>
            {creatorsWithStats.map((entry, idx) => (
              <tr key={entry.seller.id}>
                <td><strong>{idx + 1}</strong></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="customer-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {entry.seller.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div style={{ lineHeight: 1.2 }}>
                      <strong style={{ fontSize: 13 }}>{entry.seller.name}</strong>
                      <small style={{ color: "var(--green-500)", fontSize: 11, display: "block" }}>@{entry.seller.handle}</small>
                    </div>
                  </div>
                </td>
                <td>{entry.seller.specialty}</td>
                <td>{entry.listings}</td>
                <td>{formatNumber(entry.downloads)}</td>
                <td className="amount">{formatPrice(entry.revenue)}</td>
                <td className="amount" style={{ color: "#15803d" }}>{formatPrice(entry.paidOut)}</td>
                <td className="amount" style={{ color: entry.pending > 0 ? "var(--orange-700)" : "var(--green-500)" }}>
                  {formatPrice(entry.pending)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
