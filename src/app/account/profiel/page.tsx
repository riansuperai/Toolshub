"use client";

import { FormEvent, useState } from "react";
import { Building2, Calendar, CheckCircle2, Globe, Mail, MapPin, Phone, Receipt, Save, User, X } from "lucide-react";
import { useMarketplace } from "@/lib/marketplace-store";
import { ActivityTimeline } from "@/components/activity-timeline";
import type { BillingAddress } from "@/lib/types";

function formatDate(iso?: string) {
  if (!iso) return "Onbekend";
  try {
    return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function AccountProfielPage() {
  const { activeUser, updateUser } = useMarketplace();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => ({
    name: activeUser.name,
    email: activeUser.email,
    phone: activeUser.phone ?? "",
    company: activeUser.company ?? "",
    vatNumber: activeUser.vatNumber ?? "",
    language: (activeUser.language ?? "nl") as "nl" | "en",
    newsletter: activeUser.newsletter ?? false,
    street: activeUser.billingAddress?.street ?? "",
    postalCode: activeUser.billingAddress?.postalCode ?? "",
    city: activeUser.billingAddress?.city ?? "",
    country: activeUser.billingAddress?.country ?? "Nederland"
  }));

  if (activeUser.role === "visitor") return null;

  function startEdit() {
    setDraft({
      name: activeUser.name,
      email: activeUser.email,
      phone: activeUser.phone ?? "",
      company: activeUser.company ?? "",
      vatNumber: activeUser.vatNumber ?? "",
      language: (activeUser.language ?? "nl") as "nl" | "en",
      newsletter: activeUser.newsletter ?? false,
      street: activeUser.billingAddress?.street ?? "",
      postalCode: activeUser.billingAddress?.postalCode ?? "",
      city: activeUser.billingAddress?.city ?? "",
      country: activeUser.billingAddress?.country ?? "Nederland"
    });
    setEditing(true);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const billing: BillingAddress | undefined = draft.street || draft.city
      ? {
          street: draft.street,
          postalCode: draft.postalCode,
          city: draft.city,
          country: draft.country
        }
      : undefined;
    updateUser(activeUser.id, {
      name: draft.name,
      email: draft.email,
      phone: draft.phone || undefined,
      company: draft.company || undefined,
      vatNumber: draft.vatNumber || undefined,
      language: draft.language,
      newsletter: draft.newsletter,
      billingAddress: billing
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <section className="section-card" style={{ marginTop: 0 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Profiel bewerken</span>
            <h2>Je gegevens</h2>
          </div>
        </div>
        <form className="form-grid" onSubmit={save}>
          <label className="form-field">
            <span>Volledige naam</span>
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required />
          </label>
          <label className="form-field">
            <span>E-mailadres</span>
            <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} required />
          </label>
          <label className="form-field">
            <span>Telefoon</span>
            <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="+31 6 ..." />
          </label>
          <label className="form-field">
            <span>Bedrijf</span>
            <input value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} placeholder="Bedrijfsnaam (optioneel)" />
          </label>
          <label className="form-field">
            <span>BTW-nummer</span>
            <input value={draft.vatNumber} onChange={(e) => setDraft({ ...draft, vatNumber: e.target.value })} placeholder="NL000000000B01" />
          </label>
          <label className="form-field">
            <span>Taal</span>
            <select value={draft.language} onChange={(e) => setDraft({ ...draft, language: e.target.value as "nl" | "en" })}>
              <option value="nl">Nederlands</option>
              <option value="en">English</option>
            </select>
          </label>
          <div className="form-field full">
            <span style={{ fontWeight: 800, color: "var(--green-900)" }}>Factuuradres</span>
          </div>
          <label className="form-field full">
            <span>Straat + nummer</span>
            <input value={draft.street} onChange={(e) => setDraft({ ...draft, street: e.target.value })} placeholder="Straatnaam 1" />
          </label>
          <label className="form-field">
            <span>Postcode</span>
            <input value={draft.postalCode} onChange={(e) => setDraft({ ...draft, postalCode: e.target.value })} placeholder="0000 AA" />
          </label>
          <label className="form-field">
            <span>Plaats</span>
            <input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
          </label>
          <label className="form-field full">
            <span>Land</span>
            <input value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
          </label>
          <div className="form-field full">
            <label className="checkbox-row" style={{ fontWeight: 700, fontSize: 14, color: "var(--green-700)" }}>
              <input type="checkbox" checked={draft.newsletter} onChange={(e) => setDraft({ ...draft, newsletter: e.target.checked })} />
              Stuur mij de Hazenco nieuwsbrief met nieuwe tools en deals
            </label>
          </div>
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
            <span className="eyebrow">Profiel</span>
            <h2>Jouw gegevens</h2>
          </div>
          <button className="button secondary" type="button" onClick={startEdit}>
            <User size={15} /> Bewerken
          </button>
        </div>

        <div className="profile-hero">
          <div className="profile-avatar">{(activeUser.name || "?").slice(0, 1).toUpperCase()}</div>
          <div>
            <strong style={{ display: "block", color: "var(--green-900)", fontSize: 22, fontWeight: 900 }}>{activeUser.name}</strong>
            <span style={{ display: "block", color: "var(--green-500)", fontSize: 13, marginTop: 2 }}>
              {activeUser.role === "buyer" ? "Koper-account" : activeUser.role} · Lid sinds {formatDate(activeUser.joinedAt)}
            </span>
          </div>
        </div>

        <div className="profile-grid">
          <ProfileItem icon={Mail} label="E-mail" value={activeUser.email} />
          <ProfileItem icon={Phone} label="Telefoon" value={activeUser.phone ?? "—"} />
          <ProfileItem icon={Building2} label="Bedrijf" value={activeUser.company ?? "—"} />
          <ProfileItem icon={Receipt} label="BTW-nummer" value={activeUser.vatNumber ?? "—"} />
          <ProfileItem icon={Globe} label="Voorkeurstaal" value={activeUser.language === "en" ? "English" : "Nederlands"} />
          <ProfileItem icon={Calendar} label="Lid sinds" value={formatDate(activeUser.joinedAt)} />
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow"><MapPin size={11} style={{ verticalAlign: -1, marginRight: 4 }} /> Factuuradres</span>
            <h2>Adres voor facturen</h2>
          </div>
          <button className="button secondary" type="button" onClick={startEdit}>Bewerken</button>
        </div>
        {activeUser.billingAddress ? (
          <div style={{ padding: 16, background: "var(--green-50)", borderRadius: 12, border: "1px solid var(--line)" }}>
            <strong style={{ display: "block", color: "var(--green-900)", fontSize: 15 }}>{activeUser.company ?? activeUser.name}</strong>
            <span style={{ display: "block", color: "var(--green-700)", marginTop: 4, lineHeight: 1.5 }}>
              {activeUser.billingAddress.street}<br />
              {activeUser.billingAddress.postalCode} {activeUser.billingAddress.city}<br />
              {activeUser.billingAddress.country}
            </span>
          </div>
        ) : (
          <p style={{ color: "var(--green-500)" }}>Nog geen factuuradres ingesteld.</p>
        )}
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Voorkeuren</span>
            <h2>Communicatie</h2>
          </div>
        </div>
        <div className="profile-pref">
          <span>{activeUser.newsletter ? <CheckCircle2 size={20} color="#16a34a" /> : <X size={20} color="#94a3b8" />}</span>
          <div>
            <strong>Nieuwsbrief</strong>
            <p>{activeUser.newsletter ? "Je ontvangt updates over nieuwe tools en deals." : "Je staat niet ingeschreven."}</p>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 14 }}>
          <div>
            <span className="eyebrow">Activiteit</span>
            <h2>Jouw recente acties</h2>
          </div>
        </div>
        <ActivityTimeline perspective="buyer" />
      </section>
    </>
  );
}

function ProfileItem({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
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
