"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Download,
  Eye,
  History,
  Layers,
  Package,
  PlusCircle,
  Star,
  TrendingUp,
  X
} from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { formatPrice, productTypeLabels } from "@/lib/marketplace-data";
import { ListingAnalytics } from "@/components/listing-analytics";
import type { Listing } from "@/lib/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function SellerListingsPage() {
  const { activeUser, publishListingVersion } = useMarketplace();
  const data = useSellerData();
  const [versionFor, setVersionFor] = useState<Listing | null>(null);
  const [analyticsFor, setAnalyticsFor] = useState<Listing | null>(null);

  if (activeUser.role !== "seller" || !data.seller) return null;

  const sortedListings = [...data.myListings].sort((a, b) => b.sales - a.sales);

  return (
    <>
      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Mijn listings</span>
            <h2>Status, downloads en verkoop ({data.myListings.length})</h2>
          </div>
          <Link className="text-action" href="/seller/new">+ Nieuwe listing</Link>
        </div>
        {data.pendingListings.length > 0 ? (
          <div className="seller-info-banner">
            <Layers size={16} /> <strong>{data.pendingListings.length}</strong> listing{data.pendingListings.length === 1 ? "" : "s"} wachten op admin-review
          </div>
        ) : null}
        {sortedListings.length ? sortedListings.map((listing) => {
          const versionsCount = (listing.versions ?? []).length;
          return (
            <div className="seller-listing-row" key={listing.id}>
              <div className="library-row-icon"><Package size={22} /></div>
              <div className="library-row-body">
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <strong>{listing.title}</strong>
                  <span className="library-version-pill">v{listing.version}</span>
                  {versionsCount > 0 ? (
                    <small style={{ color: "var(--green-500)", fontSize: 11, fontWeight: 700 }}>
                      {versionsCount} {versionsCount === 1 ? "release" : "releases"}
                    </small>
                  ) : null}
                </div>
                <span className="small">{productTypeLabels[listing.type]} · {formatPrice(listing.priceCents)}</span>
              </div>
              <div className="seller-listing-stats">
                <span><Download size={12} /> <strong>{listing.downloads}</strong> downloads</span>
                <span><TrendingUp size={12} /> <strong>{listing.sales}</strong> verkocht</span>
                <span><Star size={12} fill="currentColor" /> <strong>{listing.rating ? listing.rating.toFixed(1) : "—"}</strong></span>
              </div>
              <div className="seller-listing-side-actions">
                <span className={`status-badge ${listing.status === "published" ? "paid" : listing.status === "pending" ? "pending" : listing.status === "rejected" ? "failed" : "new"}`}>
                  {listing.status === "published" && "Gepubliceerd"}
                  {listing.status === "pending" && "In review"}
                  {listing.status === "rejected" && "Afgewezen"}
                  {listing.status === "draft" && "Concept"}
                </span>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button type="button" className="button secondary" style={{ minHeight: 28, padding: "0 10px", fontSize: 11 }} onClick={() => setAnalyticsFor(listing)}>
                    <BarChart3 size={11} /> Analytics
                  </button>
                  <button type="button" className="button secondary" style={{ minHeight: 28, padding: "0 10px", fontSize: 11 }} onClick={() => setVersionFor(listing)}>
                    <PlusCircle size={11} /> Nieuwe versie
                  </button>
                  <Link className="button secondary" href={`/tools/${listing.slug}`} style={{ minHeight: 28, padding: "0 10px", fontSize: 11 }}>
                    <Eye size={11} /> Bekijk
                  </Link>
                </div>
              </div>
            </div>
          );
        }) : <div className="empty-state">Nog geen listings. Maak je eerste tool aan via &quot;Nieuwe listing&quot;.</div>}
      </section>

      {versionFor ? (
        <PublishVersionModal
          listing={versionFor}
          onClose={() => setVersionFor(null)}
          onPublish={(input) => {
            publishListingVersion(versionFor.id, input);
            setVersionFor(null);
          }}
        />
      ) : null}

      {analyticsFor ? (
        <AnalyticsModal listing={analyticsFor} onClose={() => setAnalyticsFor(null)} />
      ) : null}
    </>
  );
}

function bumpVersion(current: string, type: "patch" | "minor" | "major"): string {
  const parts = current.split(".").map((n) => parseInt(n, 10) || 0);
  while (parts.length < 3) parts.push(0);
  if (type === "patch") parts[2]++;
  if (type === "minor") { parts[1]++; parts[2] = 0; }
  if (type === "major") { parts[0]++; parts[1] = 0; parts[2] = 0; }
  return parts.join(".");
}

function PublishVersionModal({
  listing,
  onClose,
  onPublish
}: {
  listing: Listing;
  onClose: () => void;
  onPublish: (input: { version: string; changelog: string; breaking?: boolean }) => void;
}) {
  const [bumpType, setBumpType] = useState<"patch" | "minor" | "major">("minor");
  const [version, setVersion] = useState(bumpVersion(listing.version, "minor"));
  const [changelog, setChangelog] = useState("");
  const [breaking, setBreaking] = useState(false);

  function changeBump(t: "patch" | "minor" | "major") {
    setBumpType(t);
    setVersion(bumpVersion(listing.version, t));
    setBreaking(t === "major");
  }

  const valid = /^\d+\.\d+\.\d+$/.test(version) && changelog.trim().length >= 10;
  const versions = listing.versions ?? [];

  return (
    <div className="changelog-backdrop" onClick={onClose}>
      <div className="publish-version-modal" onClick={(e) => e.stopPropagation()}>
        <div className="changelog-head">
          <div>
            <span className="eyebrow"><PlusCircle size={11} /> Nieuwe versie publiceren</span>
            <h2>{listing.title}</h2>
            <small>Huidig: v{listing.version} · Kopers krijgen direct een update-melding</small>
          </div>
          <button type="button" className="composer-icon-btn" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="publish-version-body">
          <div className="version-bump-row">
            <span className="version-bump-label">Wat voor type update?</span>
            <div className="version-bump-pills">
              <button type="button" className={bumpType === "patch" ? "active" : ""} onClick={() => changeBump("patch")}>
                <strong>Patch</strong>
                <small>Bugfix · {bumpVersion(listing.version, "patch")}</small>
              </button>
              <button type="button" className={bumpType === "minor" ? "active" : ""} onClick={() => changeBump("minor")}>
                <strong>Minor</strong>
                <small>Nieuwe features · {bumpVersion(listing.version, "minor")}</small>
              </button>
              <button type="button" className={bumpType === "major" ? "active" : ""} onClick={() => changeBump("major")}>
                <strong>Major</strong>
                <small>Breaking changes · {bumpVersion(listing.version, "major")}</small>
              </button>
            </div>
          </div>

          <label className="publish-version-field">
            <span>Versienummer</span>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.2.3"
            />
          </label>

          <label className="publish-version-field">
            <span>Wat is er veranderd?</span>
            <textarea
              rows={6}
              placeholder="• Nieuwe Slack integratie\n• Performance verbeterd voor grote workflows\n• Bugfix in de webhook handler"
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
            />
            <small className="publish-version-hint">Minimaal 10 tekens · Markdown ondersteund · Wordt getoond aan kopers</small>
          </label>

          <label className="publish-version-checkbox">
            <input type="checkbox" checked={breaking} onChange={(e) => setBreaking(e.target.checked)} />
            <span>Deze update bevat <strong>breaking changes</strong> (kopers moeten configuratie aanpassen)</span>
          </label>

          {breaking ? (
            <div className="publish-version-warn">
              <AlertTriangle size={16} />
              <p>Kopers krijgen een duidelijke waarschuwing. Voeg migration-stappen toe in de changelog.</p>
            </div>
          ) : null}

          {versions.length > 0 ? (
            <div className="publish-version-history">
              <strong><History size={12} style={{ verticalAlign: -2 }} /> Eerdere releases</strong>
              <ul>
                {versions.slice(0, 3).map((v) => (
                  <li key={v.version + v.releasedAt}>
                    <strong>v{v.version}</strong>
                    <small>{formatDate(v.releasedAt)}</small>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="publish-version-foot">
          <button type="button" className="button secondary" onClick={onClose}>Annuleren</button>
          <button
            type="button"
            className="button"
            disabled={!valid}
            onClick={() => onPublish({ version, changelog: changelog.trim(), breaking })}
          >
            <PlusCircle size={14} /> v{version} publiceren
          </button>
        </div>
      </div>
    </div>
  );
}

function AnalyticsModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  return (
    <div className="changelog-backdrop" onClick={onClose}>
      <div className="analytics-modal" onClick={(e) => e.stopPropagation()}>
        <div className="changelog-head">
          <div>
            <span className="eyebrow"><BarChart3 size={11} /> Analytics</span>
            <h2>{listing.title}</h2>
            <small>Performance van deze tool over tijd</small>
          </div>
          <button type="button" className="composer-icon-btn" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="analytics-modal-body">
          <ListingAnalytics listing={listing} />
        </div>
      </div>
    </div>
  );
}
