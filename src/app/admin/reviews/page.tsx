"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CheckSquare, Square, Star } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function AdminReviewsPage() {
  const { state, approveReview } = useMarketplace();
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
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
    if (!confirm(`${selectedIds.size} reviews goedkeuren?`)) return;
    selectedIds.forEach((id) => approveReview(id));
    setSelectedIds(new Set());
  }

  const pendingReviews = state.reviews.filter((r) => !r.approved);
  const approvedReviews = state.reviews.filter((r) => r.approved);

  const filtered = useMemo(() => {
    let items = state.reviews;
    if (filter === "pending") items = items.filter((r) => !r.approved);
    if (filter === "approved") items = items.filter((r) => r.approved);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((r) => {
        const listing = state.listings.find((l) => l.id === r.listingId);
        return (
          r.buyerName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          (listing?.title.toLowerCase().includes(q) ?? false)
        );
      });
    }
    return items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [state.reviews, state.listings, filter, query]);

  const avgRating = approvedReviews.length > 0
    ? approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length
    : 0;

  return (
    <>
      {/* Stats strip */}
      <div className="widget" style={{ marginTop: 0, padding: 0 }}>
        <div className="funnel-grid" style={{ padding: 18 }}>
          <div className="funnel-step"><span className="eyebrow">Totaal</span><strong>{state.reviews.length}</strong><small>Alle reviews</small></div>
          <div className="funnel-step warn"><span className="eyebrow">In moderatie</span><strong>{pendingReviews.length}</strong><small>Wacht op admin</small></div>
          <div className="funnel-step success"><span className="eyebrow">Live</span><strong>{approvedReviews.length}</strong><small>Goedgekeurd</small></div>
          <div className="funnel-step accent">
            <span className="eyebrow">Gem. rating</span>
            <strong>{avgRating.toFixed(1)} <Star size={16} fill="currentColor" style={{ verticalAlign: -2 }} /></strong>
            <small>Over goedgekeurde</small>
          </div>
        </div>
      </div>

      <section className="section-card" style={{ marginTop: 18 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Star size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Reviewwachtrij</span>
            <h2>Klantfeedback ({filtered.length})</h2>
          </div>
        </div>

        <div className="bookings-toolbar">
          <input type="search" placeholder="Zoek reviewer, tool of comment..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="bookings-status-filter">
            <button type="button" className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>In afwachting ({pendingReviews.length})</button>
            <button type="button" className={filter === "approved" ? "active" : ""} onClick={() => setFilter("approved")}>Goedgekeurd</button>
            <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Alle</button>
          </div>
        </div>

        {selectedIds.size > 0 ? (
          <div className="bulk-bar" style={{ marginBottom: 12 }}>
            <small>{selectedIds.size} geselecteerd</small>
            <button type="button" className="button" onClick={bulkApprove}><CheckCircle2 size={13} /> Goedkeuren</button>
            <button type="button" className="button secondary" onClick={() => setSelectedIds(new Set())}>Wissen</button>
          </div>
        ) : filter === "pending" && pendingReviews.length > 0 ? (
          <button type="button" className="button secondary" style={{ marginBottom: 12 }} onClick={() => setSelectedIds(new Set(pendingReviews.map((r) => r.id)))}>
            <CheckSquare size={13} /> Selecteer alle pending
          </button>
        ) : null}

        {filtered.length === 0 ? <p style={{ color: "var(--green-500)" }}>Geen reviews in deze filter.</p> : filtered.map((review) => {
          const listing = state.listings.find((l) => l.id === review.listingId);
          const isSelected = selectedIds.has(review.id);
          const isPending = !review.approved;
          return (
            <div className={`admin-queue-row${isSelected ? " selected" : ""}`} key={review.id}>
              {isPending ? (
                <button
                  type="button"
                  className="bulk-checkbox"
                  onClick={() => toggleId(review.id)}
                  aria-pressed={isSelected}
                >
                  {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
              ) : null}
              <div>
                <strong>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} style={{ color: "#f59e0b", verticalAlign: -1 }} />
                  ))}
                  {" "}voor {listing?.title ?? "—"}
                </strong>
                <span className="small">door {review.buyerName} · {formatDate(review.createdAt)}</span>
                <p>&quot;{review.comment}&quot;</p>
              </div>
              <div className="admin-queue-actions">
                {!review.approved ? (
                  <button className="button" type="button" onClick={() => approveReview(review.id)}>
                    <CheckCircle2 size={14} /> Goedkeuren
                  </button>
                ) : (
                  <span className="status-badge paid">Goedgekeurd</span>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
