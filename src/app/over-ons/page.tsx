import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Shell } from "@/components/shell";
import { InfoSidebar } from "@/components/info-sidebar";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Wie zit er achter Hazenco Toolshub? Een team uit Nederland dat digitale tools en diensten bouwt voor het MKB."
};

export default function OverOnsPage() {
  return (
    <Shell>
      <div className="page info-page">
        <div className="info-layout">
          <div className="info-main">
            <h1>Over ons</h1>
            <p className="lead-sm" style={{ color: "var(--green-700)", marginBottom: 24 }}>
              Hazenco Toolshub is de marketplace waar Nederlandse ondernemers
              kant-en-klare digitale tools en diensten vinden — zonder gedoe.
            </p>

        <section className="section-card">
          <h2>Wat we doen</h2>
          <p>
            Wij bouwen en verzamelen automation-tools, AI agents, plugins,
            extensies, themes en servicepakketten die ondernemers in het MKB
            écht tijd besparen. Geen theoretische demo&apos;s — alles in onze
            catalogus is gemaakt door bouwers die zelf met die problemen
            werken.
          </p>
        </section>

        <section className="section-card">
          <h2>Waarom Toolshub</h2>
          <p>
            Het web staat vol met tools, maar betrouwbare info, een werkende
            demo en een vast aanspreekpunt vinden is moeilijk. Wij keuren elke
            tool en service voordat ie live gaat, zodat jij niet maanden
            verspilt aan iets dat uiteindelijk niet doet wat beloofd was.
          </p>
        </section>

        <section className="section-card">
          <h2>De maker</h2>
          <p>
            Toolshub is een initiatief van Hazenco — een Nederlands team dat
            zich specialiseert in automation en webwerk voor het MKB. Meer
            weten over onze diensten?{" "}
            <a
              className="footer-external-link"
              href="https://hazenco.nl"
              target="_blank"
              rel="noopener noreferrer"
            >
              hazenco.nl <ExternalLink size={14} />
            </a>
          </p>
        </section>

        <section className="section-card">
          <h2>Contact</h2>
          <p>
            Vragen, feedback of wil je creator worden? Stuur een bericht via{" "}
            <Link href="/contact">de contactpagina</Link> of bekijk hoe je{" "}
            <Link href="/creators">creator wordt</Link>.
          </p>
        </section>
          </div>
          <InfoSidebar />
        </div>
      </div>
    </Shell>
  );
}
