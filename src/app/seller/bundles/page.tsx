"use client";

import { useMemo, useState } from "react";
import { CheckSquare, Eye, EyeOff, Package, PlusCircle, Square, Trash2, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { formatPrice } from "@/lib/marketplace-data";
import { useToast } from "@/components/toast";
import { EmptyState } from "@/components/empty-state";
import type { Bundle } from "@/lib/types";

export default function SellerBundlesPage() {
  const { state, activeUser, createBundle, updateBundle, deleteBundle } = useMarketplace();
  const data = useSellerData();
  const toast = useToast();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Bundle | null>(null);

  if (activeUser.role !== "seller" || !data.seller) return null;

  const myBundles = (state.bundles ?? []).filter((b) => b.sellerId === data.seller?.id);

  function publishToggle(b: Bundle) {
    updateBundle(b.id, { status: b.status === "published" ? "draft" : "published" });
    toast.success(b.status === "published" ? "Bundle naar concept" : "Bundle gepubliceerd");
  }

  function remove(id: string) {
    if (!confirm("Bundle verwijderen?")) return;
    deleteBundle(id);
    toast.info("Bundle verwijderd");
  }

  return (
    <>
      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Package size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Bundles</span>
            <h2>Verkoop tools als pakket ({myBundles.length})</h2>
          </div>
          <button type="button" className="button" onClick={() => setCreating(true)}>
            <PlusCircle size={14} /> Nieuwe bundle
          </button>
        </div>

        {myBundles.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Nog geen bundles"
            description="Combineer 2 of meer van je tools tot een bundel met korting. Klanten kopen graag pakketten — gemiddeld 35% hogere orderwaarde."
            action={
              <button type="button" className="button" onClick={() => setCreating(true)}>
                <PlusCircle size={14} /> Maak je eerste bundle
              </button>
            }
          />
        ) : (
          <div className="bundle-list">
            {myBundles.map((bundle) => {
              const items = bundle.listingIds
                .map((id) => state.listings.find((l) => l.id === id))
                .filter((l): l is NonNullable<typeof l> => !!l);
              const totalSeparate = items.reduce((s, l) => s + l.priceCents, 0);
              const bundlePrice = Math.round(totalSeparate * (1 - bundle.discountPercent / 100));
              const saved = totalSeparate - bundlePrice;
              return (
                <div key={bundle.id} className="bundle-card">
                  <div className="bundle-card-head">
                    <div>
                      <strong>{bundle.title}</strong>
                      <small>{items.length} tools · {bundle.discountPercent}% korting</small>
                    </div>
                    <span className={`status-badge ${bundle.status === "published" ? "paid" : "new"}`}>
                      {bundle.status === "published" ? "Live" : "Concept"}
                    </span>
                  </div>
                  <p className="bundle-card-desc">{bundle.description || "Geen beschrijving."}</p>
                  <div className="bundle-card-items">
                    {items.map((l) => (
                      <span className="bundle-card-item-pill" key={l.id}>
                        {l.title}
                      </span>
                    ))}
                  </div>
                  <div className="bundle-card-price">
                    <div>
                      <small>Bundel-prijs</small>
                      <strong>{formatPrice(bundlePrice)}</strong>
                    </div>
                    <div>
                      <small>Losse som</small>
                      <strong style={{ textDecoration: "line-through", opacity: 0.6 }}>{formatPrice(totalSeparate)}</strong>
                    </div>
                    <div className="bundle-card-saved">
                      <small>Klant bespaart</small>
                      <strong>{formatPrice(saved)}</strong>
                    </div>
                  </div>
                  <div className="bundle-card-actions">
                    <button type="button" className="button secondary" onClick={() => setEditing(bundle)}>Bewerken</button>
                    <button type="button" className="button secondary" onClick={() => publishToggle(bundle)}>
                      {bundle.status === "published" ? <><EyeOff size={13} /> Op concept</> : <><Eye size={13} /> Publiceren</>}
                    </button>
                    <button type="button" className="button secondary" onClick={() => remove(bundle.id)}>
                      <Trash2 size={13} /> Verwijder
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {(creating || editing) ? (
        <BundleEditor
          bundle={editing ?? undefined}
          availableListings={data.myListings.filter((l) => l.status === "published")}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSave={(input) => {
            if (editing) {
              updateBundle(editing.id, input);
              toast.success("Bundle bijgewerkt");
            } else {
              createBundle(input);
              toast.success("Bundle aangemaakt", "Status staat op concept — publiceer wanneer je klaar bent.");
            }
            setCreating(false);
            setEditing(null);
          }}
        />
      ) : null}
    </>
  );
}

function BundleEditor({
  bundle,
  availableListings,
  onClose,
  onSave
}: {
  bundle?: Bundle;
  availableListings: NonNullable<ReturnType<typeof useSellerData>["myListings"]>;
  onClose: () => void;
  onSave: (input: { title: string; description: string; listingIds: string[]; discountPercent: number }) => void;
}) {
  const [title, setTitle] = useState(bundle?.title ?? "");
  const [description, setDescription] = useState(bundle?.description ?? "");
  const [selected, setSelected] = useState<Set<string>>(new Set(bundle?.listingIds ?? []));
  const [discount, setDiscount] = useState(bundle?.discountPercent ?? 20);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalSeparate = useMemo(() =>
    [...selected].reduce((s, id) => s + (availableListings.find((l) => l.id === id)?.priceCents ?? 0), 0),
    [selected, availableListings]
  );
  const bundlePrice = Math.round(totalSeparate * (1 - discount / 100));
  const valid = title.trim().length >= 3 && selected.size >= 2;

  return (
    <div className="changelog-backdrop" onClick={onClose}>
      <div className="publish-version-modal" onClick={(e) => e.stopPropagation()} style={{ width: "min(720px, 96vw)" }}>
        <div className="changelog-head">
          <div>
            <span className="eyebrow"><Package size={11} /> {bundle ? "Bundle bewerken" : "Nieuwe bundle"}</span>
            <h2>{title || "Naamloos pakket"}</h2>
            <small>Combineer tools voor meer omzet per klant</small>
          </div>
          <button type="button" className="composer-icon-btn" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="publish-version-body">
          <label className="publish-version-field">
            <span>Bundle-naam</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bijv. E-commerce starter pack" />
          </label>

          <label className="publish-version-field">
            <span>Korte beschrijving</span>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Wat krijgt de klant? Wat is het voordeel?" />
          </label>

          <div className="publish-version-field">
            <span>Korting op pakketprijs · <strong style={{ color: "var(--orange-700)" }}>{discount}%</strong></span>
            <input
              type="range"
              min={0}
              max={60}
              step={5}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="bundle-discount-slider"
            />
          </div>

          <div className="publish-version-field">
            <span>Selecteer tools ({selected.size} {selected.size === 1 ? "geselecteerd" : "geselecteerd"})</span>
            <div className="bundle-listing-grid">
              {availableListings.map((l) => {
                const isSelected = selected.has(l.id);
                return (
                  <button
                    type="button"
                    key={l.id}
                    className={`bundle-listing-pick${isSelected ? " selected" : ""}`}
                    onClick={() => toggle(l.id)}
                  >
                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                    <div>
                      <strong>{l.title}</strong>
                      <small>{formatPrice(l.priceCents)}</small>
                    </div>
                  </button>
                );
              })}
            </div>
            {selected.size < 2 ? (
              <small className="publish-version-hint" style={{ color: "#dc2626" }}>Selecteer minimaal 2 tools.</small>
            ) : null}
          </div>

          {selected.size >= 2 ? (
            <div className="bundle-preview-box">
              <div>
                <small>Losse prijzen</small>
                <strong style={{ textDecoration: "line-through", opacity: 0.6 }}>{formatPrice(totalSeparate)}</strong>
              </div>
              <div>
                <small>Bundle-prijs</small>
                <strong style={{ color: "var(--orange-700)", fontSize: 22 }}>{formatPrice(bundlePrice)}</strong>
              </div>
              <div>
                <small>Klant bespaart</small>
                <strong style={{ color: "#15803d" }}>{formatPrice(totalSeparate - bundlePrice)}</strong>
              </div>
            </div>
          ) : null}
        </div>

        <div className="publish-version-foot">
          <button type="button" className="button secondary" onClick={onClose}>Annuleren</button>
          <button
            type="button"
            className="button"
            disabled={!valid}
            onClick={() => onSave({ title: title.trim(), description: description.trim(), listingIds: [...selected], discountPercent: discount })}
          >
            <PlusCircle size={14} /> {bundle ? "Opslaan" : "Bundle aanmaken"}
          </button>
        </div>
      </div>
    </div>
  );
}
