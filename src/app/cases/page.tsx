import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Cases — wat we voor klanten hebben gebouwd",
  description:
    "Voorbeelden van websites, procesautomatisering en AI-workflows die Hazenco heeft geleverd. Van kapsalons tot webshops tot praktijken."
};

export default function CasesPage() {
  return (
    <Shell>
      <div className="page">
        <header className="section-hero">
          <p className="eyebrow">Cases</p>
          <h1>Wat we bouwden. Wat het opleverde.</h1>
          <p className="lead">
            Elke case laat zien: het probleem, de aanpak en de meetbare uitkomst. Geen gepolijste marketing-verhalen —
            eerlijke cijfers.
          </p>
        </header>

        <div className="section-card" style={{ marginTop: 40, padding: 40, textAlign: "center" }}>
          <h2>Cases in aanbouw</h2>
          <p style={{ color: "var(--green-700)", margin: "8px auto 20px", maxWidth: 560 }}>
            We werken aan gedetailleerde case-studies van onze klanten. Ondertussen: bekijk de diensten of neem contact
            op als je wilt weten of we een soortgelijke case hebben gebouwd voor jouw branche.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/diensten" className="button">
              Bekijk diensten <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="button secondary">
              Plan een gesprek
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
