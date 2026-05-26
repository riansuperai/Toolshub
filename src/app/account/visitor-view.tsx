"use client";

import Link from "next/link";
import { CheckCircle2, LogIn } from "lucide-react";
import { Shell } from "@/components/shell";
import { useMarketplace } from "@/lib/marketplace-store";

export function AccountVisitorView() {
  const { setActiveUser } = useMarketplace();
  return (
    <Shell>
      <div className="page">
        <span className="eyebrow">Account</span>
        <h1>Maak gratis een account aan</h1>
        <p className="lead">
          Met een Hazenco-account bewaar je tools, bestel je veilig en behoud je toegang tot je downloads en
          supportaanvragen.
        </p>

        <div className="visitor-card">
          <div className="visitor-card-body">
            <div className="visitor-card-icon"><LogIn size={28} /></div>
            <div>
              <h2>Inloggen of registreren</h2>
              <p>
                Maak gebruik van de demo-account &quot;Nudi Buyer&quot; om alle koper-features te bekijken zonder echt
                te registreren.
              </p>
              <div className="visitor-card-actions">
                <button type="button" className="button" onClick={() => setActiveUser("user_buyer")}>
                  <LogIn size={16} /> Demo: log in als koper
                </button>
                <Link className="button secondary" href="/catalogus">Eerst rondkijken</Link>
              </div>
            </div>
          </div>
          <ul className="trust-list">
            <li><CheckCircle2 size={16} /> Bewaar je favoriete tools in je bibliotheek</li>
            <li><CheckCircle2 size={16} /> Toegang tot bestanden na succesvolle betaling</li>
            <li><CheckCircle2 size={16} /> Laat reviews achter en vraag support aan</li>
            <li><CheckCircle2 size={16} /> Bestelhistorie en facturen op één plek</li>
          </ul>
        </div>
      </div>
    </Shell>
  );
}
