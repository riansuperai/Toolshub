"use client";

import { FormEvent, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Globe,
  Headphones,
  MapPin,
  Save,
  ShieldCheck,
  Star,
  Store,
  TrendingUp,
  User,
  Wallet,
  X,
  Zap
} from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { useSellerData } from "@/lib/seller-data";
import { ActivityTimeline } from "@/components/activity-timeline";

function formatDate(iso?: string) {
  if (!iso) return "Onbekend";
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function SellerProfielPage() {
  const { activeUser, updateSeller, updateUser } = useMarketplace();
  const data = useSellerData();
  const seller = data.seller;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => ({
    name: seller?.name ?? "",
    specialty: seller?.specialty ?? "",
    bio: seller?.bio ?? "",
    location: seller?.location ?? "",
    responseTime: seller?.responseTime ?? "",
    website: seller?.website ?? "",
    supportEmail: seller?.supportEmail ?? "",
    payoutMethod: seller?.payoutMethod ?? "",
    vatNumber: seller?.vatNumber ?? "",
    phone: activeUser.phone ?? ""
  }));

  if (activeUser.role !== "seller" || !seller) return null;

  function startEdit() {
    setDraft({
      name: seller!.name,
      specialty: seller!.specialty,
      bio: seller!.bio,
      location: seller!.location,
      responseTime: seller!.responseTime,
      website: seller!.website ?? "",
      supportEmail: seller!.supportEmail ?? "",
      payoutMethod: seller!.payoutMethod ?? "",
      vatNumber: seller!.vatNumber ?? "",
      phone: activeUser.phone ?? ""
    });
    setEditing(true);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateSeller(seller!.id, {
      name: draft.name,
      specialty: draft.specialty,
      bio: draft.bio,
      location: draft.location,
      responseTime: draft.responseTime,
      website: draft.website || undefined,
      supportEmail: draft.supportEmail || undefined,
      payoutMethod: draft.payoutMethod || undefined,
      vatNumber: draft.vatNumber || undefined
    });
    if (draft.phone !== (activeUser.phone ?? "")) {
      updateUser(activeUser.id, { phone: draft.phone || undefined });
    }
    setEditing(false);
  }

  if (editing) {
    return (
      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Profiel bewerken</span>
            <h2>Je creatorprofiel</h2>
          </div>
        </div>
        <form className="form-grid" onSubmit={save}>
          <label className="form-field">
            <span>Verkopersnaam</span>
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required />
          </label>
          <label className="form-field">
            <span>Specialisatie</span>
            <input value={draft.specialty} onChange={(e) => setDraft({ ...draft, specialty: e.target.value })} required />
          </label>
          <label className="form-field full">
            <span>Bio</span>
            <textarea value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} required />
          </label>
          <label className="form-field">
            <span>Locatie</span>
            <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
          </label>
          <label className="form-field">
            <span>Response tijd</span>
            <input value={draft.responseTime} onChange={(e) => setDraft({ ...draft, responseTime: e.target.value })} placeholder="Binnen 4 uur" />
          </label>
          <label className="form-field">
            <span>Website</span>
            <input value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} placeholder="https://..." />
          </label>
          <label className="form-field">
            <span>Support e-mail</span>
            <input type="email" value={draft.supportEmail} onChange={(e) => setDraft({ ...draft, supportEmail: e.target.value })} />
          </label>
          <label className="form-field">
            <span>Telefoon</span>
            <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
          </label>
          <label className="form-field">
            <span>BTW-nummer</span>
            <input value={draft.vatNumber} onChange={(e) => setDraft({ ...draft, vatNumber: e.target.value })} />
          </label>
          <label className="form-field full">
            <span>Uitbetalingsmethode</span>
            <input value={draft.payoutMethod} onChange={(e) => setDraft({ ...draft, payoutMethod: e.target.value })} placeholder="SEPA · IBAN" />
          </label>
          <div className="form-field full" style={{ display: "flex", gap: 8 }}>
            <button className="button" type="submit"><Save size={16} /> Opslaan</button>
            <button className="button secondary" type="button" onClick={() => setEditing(false)}>
              <X size={16} /> Annuleren
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <>
      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Creatorprofiel</span>
            <h2>Hoe kopers jou zien</h2>
          </div>
          <button className="button secondary" type="button" onClick={startEdit}>
            <User size={15} /> Bewerken
          </button>
        </div>

        <div className="profile-hero">
          <div className="profile-avatar">{seller.name.slice(0, 1).toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <strong style={{ color: "var(--green-900)", fontSize: 22, fontWeight: 900 }}>{seller.name}</strong>
              {seller.verified ? <span className="status-badge completed"><ShieldCheck size={11} /> Geverifieerd</span> : null}
            </div>
            <span style={{ display: "block", color: "var(--green-500)", fontSize: 13, marginTop: 2 }}>
              @{seller.handle} · {seller.specialty}
            </span>
            <p style={{ margin: "8px 0 0", color: "var(--green-700)", fontSize: 14, lineHeight: 1.55 }}>{seller.bio}</p>
          </div>
        </div>

        <div className="profile-stat-row">
          <div><Star size={14} fill="currentColor" /> <strong>{seller.rating.toFixed(1)}</strong> rating</div>
          <div><TrendingUp size={14} /> <strong>{seller.sales}</strong> verkocht</div>
          <div><Store size={14} /> <strong>{data.publishedListings.length}</strong> live listings</div>
          <div><Zap size={14} /> <strong>{seller.responseTime}</strong></div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Bedrijfsgegevens</span>
            <h2>Contact &amp; locatie</h2>
          </div>
        </div>
        <div className="profile-grid">
          <ProfileItem icon={MapPin} label="Locatie" value={seller.location} />
          <ProfileItem icon={Globe} label="Website" value={seller.website ?? "—"} />
          <ProfileItem icon={Headphones} label="Support e-mail" value={seller.supportEmail ?? "—"} />
          <ProfileItem icon={Calendar} label="Lid sinds" value={formatDate(seller.joinedAt)} />
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><Wallet size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Financieel</span>
            <h2>Uitbetalingen &amp; BTW</h2>
          </div>
        </div>
        <div className="profile-grid">
          <ProfileItem icon={Wallet} label="Uitbetalingsmethode" value={seller.payoutMethod ?? "—"} />
          <ProfileItem icon={CheckCircle2} label="BTW-nummer" value={seller.vatNumber ?? "—"} />
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Activiteit</span>
            <h2>Recente verkopen en publicaties</h2>
          </div>
        </div>
        <ActivityTimeline perspective="creator" />
      </section>
    </>
  );
}

function ProfileItem({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="profile-item">
      <span className="profile-item-icon"><Icon size={14} /></span>
      <div>
        <span className="eyebrow">{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
