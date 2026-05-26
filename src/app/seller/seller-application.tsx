"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { LogIn } from "lucide-react";
import { Shell } from "@/components/shell";
import { useMarketplace } from "@/lib/marketplace-store";

export function SellerApplicationView() {
  const { activeUser, state, submitSellerApplication, setActiveUser } = useMarketplace();
  const application = state.sellerApplications.find((item) => item.userId === activeUser.id);
  const [business, setBusiness] = useState(application?.business ?? "");
  const [experience, setExperience] = useState(application?.experience ?? "");

  if (activeUser.role === "visitor") {
    return (
      <Shell>
        <div className="page">
          <span className="eyebrow">Voor creators</span>
          <h1>Verkoop je tools op Hazenco</h1>
          <p className="lead">Maak een creator-account aan en upload je workflows, AI agents, plugins of templates.</p>
          <div className="visitor-card">
            <div className="visitor-card-body">
              <div className="visitor-card-icon"><LogIn size={28} /></div>
              <div>
                <h2>Log in om door te gaan</h2>
                <p>Maak gebruik van het demo creator-profiel &quot;Hazenco Studio&quot; om de creator-flow te bekijken.</p>
                <div className="visitor-card-actions">
                  <button type="button" className="button" onClick={() => setActiveUser("user_seller")}>
                    <LogIn size={16} /> Demo: log in als creator
                  </button>
                  <Link className="button secondary" href="/catalogus">Eerst rondkijken</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitSellerApplication({
      name: activeUser.name,
      email: activeUser.email,
      business,
      experience
    });
  }

  return (
    <Shell>
      <div className="page">
        <span className="eyebrow">Creator aanvraag</span>
        <h1>Word geverifieerde creator</h1>
        <p className="lead">Nieuwe creators worden eerst gekeurd. Admin kan je aanvraag in Beheer goedkeuren.</p>
        <div className="detail-layout">
          <form className="section-card stack" style={{ marginTop: 0 }} onSubmit={submit}>
            <label className="form-field">
              <span>Specialisatie</span>
              <input value={business} onChange={(event) => setBusiness(event.target.value)} placeholder="Bijv. n8n workflows voor webshops" required />
            </label>
            <label className="form-field">
              <span>Ervaring</span>
              <textarea value={experience} onChange={(event) => setExperience(event.target.value)} placeholder="Vertel wat je bouwt, voor wie en hoe je support levert" required />
            </label>
            <button className="button" type="submit">Aanvraag indienen</button>
          </form>
          <aside className="summary-card">
            <h2>Status</h2>
            <p>{application ? `Je aanvraag staat op: ${application.status}` : "Nog geen aanvraag ingediend."}</p>
            <Link className="button secondary" href="/admin" style={{ marginTop: 12, width: "100%" }}>Bekijk admin demo</Link>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
