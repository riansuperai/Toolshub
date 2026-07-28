import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Blog — Hazenco",
  description:
    "Praktische artikelen over webdesign, procesautomatisering en AI voor het Nederlandse MKB. Wat werkt, wat niet, en hoe je ermee begint."
};

export default function BlogPage() {
  return (
    <Shell>
      <div className="page">
        <header className="section-hero">
          <p className="eyebrow">Blog</p>
          <h1>Praktische artikelen voor MKB-ondernemers.</h1>
          <p className="lead">
            Geen jargon, geen leadmagnet-trucs. Wat werkt in webdesign, automatisering en AI — en hoe je er zelf mee
            aan de slag kunt.
          </p>
        </header>

        <div className="section-card" style={{ marginTop: 40, padding: 40, textAlign: "center" }}>
          <h2>Blog in aanbouw</h2>
          <p style={{ color: "var(--green-700)", margin: "8px auto 20px", maxWidth: 560 }}>
            De eerste posts komen binnenkort. Ondertussen: neem contact op of bekijk onze diensten.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/diensten" className="button">
              Bekijk diensten <ArrowRight size={15} />
            </Link>
            <Link href="/toolkit" className="button secondary">
              Naar gratis toolkit
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
