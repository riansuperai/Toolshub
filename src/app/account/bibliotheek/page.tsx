"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Box, ChevronDown, ChevronUp, Download, ExternalLink, History, LifeBuoy, Package, Sparkles, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useAccountData } from "@/lib/account-data";
import { productTypeLabels } from "@/lib/marketplace-data";
import type { Listing, ListingVersion } from "@/lib/types";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

/** Compareert "1.2.3" semver-stijl. Returns -1 / 0 / 1. */
function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

export default function AccountLibraryPage() {
  const { state, activeUser, createServiceRequest } = useMarketplace();
  const { purchasedListings, myOrders } = useAccountData();
  const [changelogFor, setChangelogFor] = useState<Listing | null>(null);

  if (activeUser.role === "visitor") return null;

  // Voor elke listing: welke versie had de koper bij aankoop?
  const purchasedVersions = useMemo(() => {
    const map = new Map<string, string>();
    for (const order of myOrders) {
      if (order.status !== "paid") continue;
      for (const item of order.items) {
        if (item.versionAtPurchase) {
          const current = map.get(item.listingId);
          // Bewaar laatst gekochte versie
          if (!current || compareVersions(item.versionAtPurchase, current) > 0) {
            map.set(item.listingId, item.versionAtPurchase);
          }
        }
      }
    }
    return map;
  }, [myOrders]);

  const updatesAvailable = purchasedListings.filter((l) => {
    const bought = purchasedVersions.get(l.id);
    return bought && compareVersions(l.version, bought) > 0;
  }).length;

  return (
    <>
      {updatesAvailable > 0 ? (
        <section className="section-card library-update-banner" style={{ marginTop: 0, marginBottom: 18 }}>
          <Sparkles size={22} />
          <div>
            <strong>{updatesAvailable} {updatesAvailable === 1 ? "update beschikbaar" : "updates beschikbaar"}</strong>
            <p>Je hebt nieuwe versies van tools die je al hebt gekocht. Download ze gratis hieronder.</p>
          </div>
        </section>
      ) : null}

      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Bibliotheek</span>
            <h2>Ontgrendelde tools ({purchasedListings.length})</h2>
          </div>
          <Link className="text-action" href="/catalogus">Meer tools ontdekken</Link>
        </div>

        {purchasedListings.length ? (
          purchasedListings.map((listing) => {
            const boughtVersion = purchasedVersions.get(listing.id);
            const hasUpdate = boughtVersion && compareVersions(listing.version, boughtVersion) > 0;
            const versionsCount = (listing.versions ?? []).length;

            return (
              <div className={`library-row${hasUpdate ? " has-update" : ""}`} key={listing.id}>
                <div className="library-row-icon"><Box size={26} /></div>
                <div className="library-row-body">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <strong>{listing.title}</strong>
                    <span className="library-version-pill">v{listing.version}</span>
                    {hasUpdate ? (
                      <span className="library-update-pill">
                        <Sparkles size={11} /> Update van v{boughtVersion}
                      </span>
                    ) : boughtVersion ? (
                      <span className="library-version-pill subtle">Up-to-date</span>
                    ) : null}
                  </div>
                  <span className="small">
                    {productTypeLabels[listing.type]} ·{" "}
                    {listing.files.length} {listing.files.length === 1 ? "bestand" : "bestanden"}
                    {versionsCount > 0 ? <> · {versionsCount} {versionsCount === 1 ? "release" : "releases"}</> : null}
                  </span>
                </div>
                <div className="library-row-actions">
                  {versionsCount > 0 ? (
                    <button type="button" className="button secondary" onClick={() => setChangelogFor(listing)}>
                      <History size={14} /> Changelog
                    </button>
                  ) : null}
                  <Link className="button secondary" href={`/tools/${listing.slug}`}>
                    <ExternalLink size={14} /> Open
                  </Link>
                  <button className={`button${hasUpdate ? "" : " secondary"}`} type="button">
                    <Download size={14} /> {hasUpdate ? "Update nu" : "Download"}
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() =>
                      createServiceRequest({
                        listingId: listing.id,
                        sellerId: listing.sellerId,
                        scope: "Support vanuit bibliotheek",
                        message: `Ik heb hulp nodig met ${listing.title}.`
                      })
                    }
                  >
                    <LifeBuoy size={14} /> Support
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <Package size={28} style={{ color: "var(--green-500)" }} />
            <h2>Nog geen aankopen</h2>
            <p>Doorloop de test checkout om downloads te ontgrendelen.</p>
            <Link className="button" href="/catalogus" style={{ marginTop: 12 }}>Tools bekijken</Link>
          </div>
        )}
      </section>

      {changelogFor ? (
        <ChangelogModal listing={changelogFor} onClose={() => setChangelogFor(null)} purchasedVersion={purchasedVersions.get(changelogFor.id)} />
      ) : null}
    </>
  );
}

function ChangelogModal({
  listing,
  onClose,
  purchasedVersion
}: {
  listing: Listing;
  onClose: () => void;
  purchasedVersion?: string;
}) {
  const versions: ListingVersion[] = listing.versions ?? [];
  return (
    <div className="changelog-backdrop" onClick={onClose}>
      <div className="changelog-modal" onClick={(e) => e.stopPropagation()}>
        <div className="changelog-head">
          <div>
            <span className="eyebrow"><History size={11} /> Changelog</span>
            <h2>{listing.title}</h2>
            <small>Huidig: v{listing.version}{purchasedVersion ? ` · Jij hebt v${purchasedVersion}` : ""}</small>
          </div>
          <button type="button" className="composer-icon-btn" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="changelog-body">
          {versions.length === 0 ? (
            <p style={{ color: "var(--green-500)" }}>Geen versie-historie beschikbaar.</p>
          ) : versions.map((v, i) => (
            <ChangelogEntry key={v.version + v.releasedAt} entry={v} isCurrent={i === 0} purchasedVersion={purchasedVersion} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChangelogEntry({ entry, isCurrent, purchasedVersion }: { entry: ListingVersion; isCurrent: boolean; purchasedVersion?: string }) {
  const [open, setOpen] = useState(isCurrent);
  const isYourVersion = purchasedVersion === entry.version;
  return (
    <div className={`changelog-entry${isCurrent ? " current" : ""}${isYourVersion ? " yours" : ""}`}>
      <button type="button" className="changelog-entry-head" onClick={() => setOpen((v) => !v)}>
        <span className="changelog-version">
          v{entry.version}
          {entry.breaking ? <small className="changelog-breaking">BREAKING</small> : null}
          {isCurrent ? <small className="changelog-latest">Laatste</small> : null}
          {isYourVersion ? <small className="changelog-yours-tag">Jouw versie</small> : null}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <small className="changelog-date">{formatDate(entry.releasedAt)}</small>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      {open ? (
        <p className="changelog-text">{entry.changelog}</p>
      ) : null}
    </div>
  );
}
