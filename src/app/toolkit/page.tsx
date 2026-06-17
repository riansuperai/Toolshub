import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Shell } from "@/components/shell";
import { ToolkitIconRender } from "@/components/mini-tool-page";
import { TOOLKIT_REGISTRY } from "@/lib/toolkit-registry";

export const metadata: Metadata = {
  title: "Toolkit",
  description:
    "Gratis browser-tools van Hazenco voor Nederlandse ondernemers — factuur maken, BTW berekenen, IBAN checken en meer. Geen account, alles direct te gebruiken."
};

export default function ToolkitIndexPage() {
  return (
    <Shell>
      <div className="page">
        <span className="eyebrow">Toolkit</span>
        <h1>Snelle tools voor Nederlandse ondernemers.</h1>
        <p className="lead">
          Gratis, direct te gebruiken in je browser. Geen account, geen
          installatie, geen gedoe.
        </p>

        <p className="mini-tool-privacy" style={{ marginTop: 12, marginBottom: 24 }}>
          <Lock size={13} /> Alles draait in je eigen browser. Wij slaan
          geen gegevens op.
        </p>

        <div className="toolkit-grid">
          {TOOLKIT_REGISTRY.map((entry) => {
            const isAvailable = entry.available;
            const inner = (
              <>
                <div className="toolkit-card-icon">
                  <ToolkitIconRender name={entry.iconName} size={24} />
                </div>
                <div className="toolkit-card-body">
                  <div className="toolkit-card-head">
                    <strong>{entry.title}</strong>
                    {!isAvailable ? (
                      <span className="toolkit-card-soon">Binnenkort</span>
                    ) : null}
                  </div>
                  <p>{entry.tagline}</p>
                  {isAvailable ? (
                    <span className="toolkit-card-link">
                      Open tool <ArrowRight size={14} />
                    </span>
                  ) : null}
                </div>
              </>
            );

            if (!isAvailable) {
              return (
                <div key={entry.slug} className="toolkit-card disabled">
                  {inner}
                </div>
              );
            }

            return (
              <Link
                key={entry.slug}
                className="toolkit-card"
                href={`/toolkit/${entry.slug}`}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
