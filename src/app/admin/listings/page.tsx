"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, CheckSquare, ClipboardCheck, Eye, ListChecks, Package, Sparkles, Square, XCircle, Zap } from "lucide-react";
import { formatPrice, productTypeLabels } from "@/lib/marketplace-data";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";
import type { ListingStatus } from "@/lib/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function AdminListingsPage() {
  const { state, approveListing, rejectListing, toggleFeatured } = useMarketplace();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<ListingStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggleId(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function bulkApprove() {
    if (!confirm(`${selectedIds.size} listings goedkeuren en publiceren?`)) return;
    const count = selectedIds.size;
    selectedIds.forEach((id) => approveListing(id));
    setSelectedIds(new Set());
    toast.success(`${count} ${count === 1 ? "listing" : "listings"} gepubliceerd`, "Creators krijgen een notificatie.");
  }

  function bulkReject() {
    if (!confirm(`${selectedIds.size} listings afwijzen?`)) return;
    const count = selectedIds.size;
    selectedIds.forEach((id) => rejectListing(id));
    setSelectedIds(new Set());
    toast.info(`${count} ${count === 1 ? "listing" : "listings"} afgewezen`);
  }

  const pendingListings = state.listings.filter((l) => l.status === "pending");
  const publishedListings = state.listings.filter((l) => l.status === "published");

  const newThisWeek = useMemo(() => {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
    return publishedListings.filter((l) => new Date(l.createdAt) >= cutoff);
  }, [publishedListings]);

  const filtered = useMemo(() => {
    return state.listings.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!l.title.toLowerCase().includes(q) && !l.tagline.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [state.listings, statusFilter, query]);

  return (
    <>
      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><ClipboardCheck size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Review-wachtrij</span>
            <h2>In review ({pendingListings.length})</h2>
          </div>
          {selectedIds.size > 0 ? (
            <div className="bulk-bar">
              <small>{selectedIds.size} geselecteerd</small>
              <button type="button" className="button" onClick={bulkApprove}><CheckCircle2 size={13} /> Goedkeuren</button>
              <button type="button" className="button secondary" onClick={bulkReject}><XCircle size={13} /> Afwijzen</button>
              <button type="button" className="button secondary" onClick={() => setSelectedIds(new Set())}>Wissen</button>
            </div>
          ) : pendingListings.length > 0 ? (
            <button type="button" className="button secondary" onClick={() => setSelectedIds(new Set(pendingListings.map((l) => l.id)))}>
              <CheckSquare size={13} /> Selecteer alles
            </button>
          ) : null}
        </div>
        {pendingListings.length ? pendingListings.map((listing) => {
          const seller = state.sellers.find((s) => s.id === listing.sellerId);
          const isSelected = selectedIds.has(listing.id);
          return (
            <div className={`admin-queue-row${isSelected ? " selected" : ""}`} key={listing.id}>
              <button
                type="button"
                className="bulk-checkbox"
                onClick={() => toggleId(listing.id)}
                aria-pressed={isSelected}
                aria-label={isSelected ? "Deselecteer" : "Selecteer"}
              >
                {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
              <div>
                <strong>{listing.title}</strong>
                <span className="small">{seller?.name} · {formatPrice(listing.priceCents)}</span>
                <p>{listing.tagline}</p>
              </div>
              <div className="admin-queue-actions">
                <Link className="button secondary" href={`/tools/${listing.slug}`}><Eye size={14} /> Bekijk</Link>
                <button className="button secondary" type="button" onClick={() => rejectListing(listing.id)}>
                  <XCircle size={14} /> Afwijzen
                </button>
                <button className="button" type="button" onClick={() => approveListing(listing.id)}>
                  <CheckCircle2 size={14} /> Publiceren
                </button>
              </div>
            </div>
          );
        }) : <p style={{ color: "var(--green-500)" }}>Geen openstaande listings.</p>}
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Sparkles size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Vers in catalogus</span>
            <h2>Nieuw deze week ({newThisWeek.length})</h2>
          </div>
        </div>
        {newThisWeek.length ? (
          <div className="seller-toplist">
            {newThisWeek.slice(0, 8).map((listing) => {
              const seller = state.sellers.find((s) => s.id === listing.sellerId);
              return (
                <Link className="seller-toplist-row" key={listing.id} href={`/tools/${listing.slug}`}>
                  <span className="seller-toplist-rank"><Zap size={12} /></span>
                  <div className="seller-toplist-icon"><Package size={18} /></div>
                  <div>
                    <strong>{listing.title}</strong>
                    <small>{seller?.name} · {formatDate(listing.createdAt)}</small>
                  </div>
                  <span className="text-action" style={{ fontSize: 12 }}><Eye size={12} /> Bekijk</span>
                </Link>
              );
            })}
          </div>
        ) : <p style={{ color: "var(--green-500)" }}>Geen nieuwe listings deze week.</p>}
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><BadgeCheck size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Uitgelicht beheer</span>
            <h2>Uitgelichte tools beheren</h2>
          </div>
        </div>
        <div className="featured-list">
          {publishedListings.map((listing) => (
            <div className="featured-list-row" key={listing.id}>
              <div>
                <strong>{listing.title}</strong>
                <span className="small">{listing.downloads} downloads · ⭐ {listing.rating ? listing.rating.toFixed(1) : "—"}</span>
              </div>
              <button
                className={listing.featured ? "button dark" : "button secondary"}
                type="button"
                onClick={() => toggleFeatured(listing.id)}
                style={{ minHeight: 32, padding: "0 12px", fontSize: 12 }}
              >
                {listing.featured ? "Uitgelicht" : "Uitlichten"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Package size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Alle listings ({state.listings.length})</span>
            <h2>Catalogus overzicht</h2>
          </div>
        </div>

        <div className="bookings-toolbar">
          <input
            type="search"
            placeholder="Zoek titel of tagline..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="bookings-status-filter">
            {(["all", "published", "pending", "draft", "rejected"] as const).map((s) => (
              <button key={s} type="button" className={statusFilter === s ? "active" : ""} onClick={() => setStatusFilter(s)}>
                {s === "all" && "Alle"}
                {s === "published" && "Gepubliceerd"}
                {s === "pending" && "In review"}
                {s === "draft" && "Concept"}
                {s === "rejected" && "Afgewezen"}
              </button>
            ))}
          </div>
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Creator</th>
              <th>Type</th>
              <th>Status</th>
              <th>Downloads</th>
              <th style={{ textAlign: "right" }}>Prijs</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--green-500)", padding: 24 }}>Geen resultaten.</td></tr>
            ) : filtered.map((l) => {
              const seller = state.sellers.find((s) => s.id === l.sellerId);
              return (
                <tr key={l.id}>
                  <td>
                    <Link href={`/tools/${l.slug}`} style={{ color: "var(--green-900)", textDecoration: "none" }}>
                      <strong>{l.title}</strong>
                      <small style={{ display: "block", color: "var(--green-500)", fontSize: 11 }}>{l.tagline.slice(0, 60)}</small>
                    </Link>
                  </td>
                  <td>{seller?.name ?? "—"}</td>
                  <td>{productTypeLabels[l.type]}</td>
                  <td><span className={`status-badge ${l.status}`}>
                    {l.status === "published" && "Gepubliceerd"}
                    {l.status === "pending" && "In review"}
                    {l.status === "draft" && "Concept"}
                    {l.status === "rejected" && "Afgewezen"}
                  </span></td>
                  <td>{l.downloads}</td>
                  <td className="amount">{formatPrice(l.priceCents)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><ListChecks size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Catalogusstructuur</span>
            <h2>{state.categories.length} categorieën</h2>
          </div>
        </div>
        <div className="category-grid">
          {state.categories.map((category) => {
            const count = publishedListings.filter((l) => l.categoryId === category.id).length;
            return (
              <div className="category-card" key={category.id} style={{ "--accent": category.accent } as React.CSSProperties}>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                  <span className="badge soft">{category.type}</span>
                  <strong style={{ color: "var(--green-900)" }}>{count} listings</strong>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
