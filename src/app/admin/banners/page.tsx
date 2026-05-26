"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Info, Megaphone, PlusCircle, Sparkles, Trash2 } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useToast } from "@/components/toast";
import { EmptyState } from "@/components/empty-state";
import type { SiteBanner } from "@/lib/types";

const TONES: { value: SiteBanner["tone"]; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { value: "info", label: "Info", icon: Info },
  { value: "success", label: "Goed nieuws", icon: CheckCircle2 },
  { value: "warn", label: "Waarschuwing", icon: AlertTriangle },
  { value: "promo", label: "Promotie", icon: Sparkles }
];

export default function AdminBannersPage() {
  const { state, upsertBanner, deleteBanner } = useMarketplace();
  const toast = useToast();
  const [editing, setEditing] = useState<SiteBanner | null>(null);

  const banners = state.banners ?? [];

  function newBanner() {
    setEditing({
      id: "",
      message: "",
      cta: undefined,
      tone: "info",
      active: false,
      createdAt: new Date().toISOString()
    });
  }

  function save(data: Omit<SiteBanner, "createdAt">) {
    upsertBanner({ ...data, id: data.id || undefined });
    setEditing(null);
    toast.success(data.id ? "Banner bijgewerkt" : "Banner aangemaakt");
  }

  function toggleActive(b: SiteBanner) {
    upsertBanner({ ...b, active: !b.active });
    toast.success(b.active ? "Banner gedeactiveerd" : "Banner live");
  }

  function remove(id: string) {
    if (!confirm("Banner verwijderen?")) return;
    deleteBanner(id);
    toast.info("Banner verwijderd");
  }

  return (
    <>
      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Megaphone size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Site banners</span>
            <h2>Bovenaan elke pagina ({banners.length})</h2>
          </div>
          <button type="button" className="button" onClick={newBanner}>
            <PlusCircle size={14} /> Nieuwe banner
          </button>
        </div>

        {banners.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="Nog geen banners"
            description="Maak een banner voor sales, onderhoud, aankondigingen of nieuwe features. Eén banner tegelijk actief."
            action={<button type="button" className="button" onClick={newBanner}><PlusCircle size={14} /> Maak banner</button>}
          />
        ) : (
          <div className="banner-list">
            {banners.map((b) => {
              const ToneIcon = TONES.find((t) => t.value === b.tone)?.icon ?? Info;
              return (
                <div className={`banner-list-item tone-${b.tone}`} key={b.id}>
                  <div className="banner-list-preview">
                    <ToneIcon size={14} />
                    <p>{b.message}</p>
                    {b.cta ? <span className="banner-list-cta">{b.cta.label}</span> : null}
                  </div>
                  <div className="banner-list-meta">
                    <span className={`status-badge ${b.active ? "paid" : "new"}`}>{b.active ? "Live" : "Concept"}</span>
                    <button type="button" className="button secondary" onClick={() => setEditing(b)}>Bewerken</button>
                    <button type="button" className="button secondary" onClick={() => toggleActive(b)}>
                      {b.active ? <><EyeOff size={13} /> Pauzeren</> : <><Eye size={13} /> Activeren</>}
                    </button>
                    <button type="button" className="button secondary" onClick={() => remove(b.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {editing ? (
        <BannerEditor banner={editing} onClose={() => setEditing(null)} onSave={save} />
      ) : null}
    </>
  );
}

function BannerEditor({
  banner,
  onClose,
  onSave
}: {
  banner: SiteBanner;
  onClose: () => void;
  onSave: (data: Omit<SiteBanner, "createdAt">) => void;
}) {
  const [message, setMessage] = useState(banner.message);
  const [tone, setTone] = useState<SiteBanner["tone"]>(banner.tone);
  const [ctaLabel, setCtaLabel] = useState(banner.cta?.label ?? "");
  const [ctaHref, setCtaHref] = useState(banner.cta?.href ?? "");
  const [active, setActive] = useState(banner.active);

  const valid = message.trim().length >= 5;

  return (
    <div className="changelog-backdrop" onClick={onClose}>
      <div className="publish-version-modal" onClick={(e) => e.stopPropagation()} style={{ width: "min(580px, 96vw)" }}>
        <div className="changelog-head">
          <div>
            <span className="eyebrow"><Megaphone size={11} /> {banner.id ? "Banner bewerken" : "Nieuwe banner"}</span>
            <h2>Site-breed bericht</h2>
            <small>Verschijnt bovenaan elke pagina · per gebruiker te sluiten</small>
          </div>
          <button type="button" className="composer-icon-btn" onClick={onClose}>×</button>
        </div>

        <div className="publish-version-body">
          <div className="publish-version-field">
            <span>Toon</span>
            <div className="banner-tone-pills">
              {TONES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    type="button"
                    key={t.value}
                    className={`banner-tone-pill tone-${t.value}${tone === t.value ? " active" : ""}`}
                    onClick={() => setTone(t.value)}
                  >
                    <Icon size={13} /> {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="publish-version-field">
            <span>Bericht</span>
            <textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Bijv. Black Friday — 30% korting op alle bundels deze week!" />
          </label>

          <div className="onboarding-grid-2">
            <label className="publish-version-field">
              <span>Knop-tekst (optioneel)</span>
              <input type="text" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Bekijk aanbieding" />
            </label>
            <label className="publish-version-field">
              <span>Link</span>
              <input type="text" value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} placeholder="/catalogus?promo=black-friday" />
            </label>
          </div>

          <label className="publish-version-checkbox">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            <span>Direct activeren (live op de site)</span>
          </label>

          <div className="banner-preview-box">
            <small>Live preview</small>
            <div className={`site-banner tone-${tone}`} style={{ position: "static" }}>
              <span className="site-banner-icon">
                {tone === "info" && <Info size={15} />}
                {tone === "success" && <CheckCircle2 size={15} />}
                {tone === "warn" && <AlertTriangle size={15} />}
                {tone === "promo" && <Sparkles size={15} />}
              </span>
              <p>{message || "Je bericht verschijnt hier..."}</p>
              {ctaLabel && ctaHref ? <span className="site-banner-cta">{ctaLabel} →</span> : null}
            </div>
          </div>
        </div>

        <div className="publish-version-foot">
          <button type="button" className="button secondary" onClick={onClose}>Annuleren</button>
          <button
            type="button"
            className="button"
            disabled={!valid}
            onClick={() => onSave({
              id: banner.id,
              message: message.trim(),
              tone,
              active,
              cta: ctaLabel && ctaHref ? { label: ctaLabel.trim(), href: ctaHref.trim() } : undefined
            })}
          >
            <PlusCircle size={14} /> Opslaan
          </button>
        </div>
      </div>
    </div>
  );
}
