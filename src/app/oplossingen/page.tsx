import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Shell } from "@/components/shell";
import { listings as mockListings } from "@/lib/marketplace-data";
import { fetchPublishedListings } from "@/lib/supabase-queries";
import { OplossingenList } from "./oplossingen-list";

export const metadata: Metadata = {
  title: "Oplossingen, wat we voor klanten hebben gebouwd",
  description:
    "Productized oplossingen en tools van Hazenco: maatwerk weboplossingen, workflow-automatisering, AI-workflows en eigen Hazenco-tools. Klaar om af te nemen of als startpunt voor iets op maat."
};

export const revalidate = 300; // 5 min cache, content update relatively rarely

// Whitelist van slugs die Hazenco zelf aanbiedt, 5 Hazenco-tools uit
// Supabase + 7 productized services die we in eerdere sessies gemaakt hebben.
// Filter op slug is robuuster dan op sellerId (Supabase gebruikt UUID, mock
// gebruikt string; slug is in beide identiek).
const HAZENCO_SLUGS = new Set([
  // Hazenco eigen tools (uit Supabase)
  "hazenco-price-tool",
  "hazenco-voorraad-tool",
  "hazenco-cep",
  "hazenco-blog-tool",
  "hazenco-product-manager",
  // Productized services (7)
  "website-laten-maken",
  "ai-telefoonassistent",
  "whatsapp-business-chatbot",
  "google-reviews-ai-responder",
  "online-afsprakensysteem",
  "verzending-cross-sell-popup-magento",
  "m2-calculator-tegels-vloeren-magento"
]);

export default async function OplossingenPage() {
  // Supabase eerst, fallback op mock data, zo tonen we ALLE productie-listings
  // (Price Tool, Voorraad, CEP, etc.) als Supabase-connectie werkt, en de
  // service_package-set als 'ie niet werkt (bijv. lokaal zonder env-vars).
  const supabaseListings = await fetchPublishedListings();
  const rawSolutions =
    supabaseListings && supabaseListings.length > 0
      ? supabaseListings
      : mockListings.filter((l) => l.status === "published");
  const solutions = rawSolutions.filter((l) => HAZENCO_SLUGS.has(l.slug));

  return (
    <Shell>
      <section className="hazenco-hero">
        <div className="page">
          <div className="hazenco-hero-inner">
            <p className="eyebrow">Oplossingen</p>
            <h1>Wat we voor klanten hebben gebouwd.</h1>
            <p className="lead">
              Productized oplossingen en tools op basis van onze drie diensten. Klaar om af te nemen, of als
              startpunt voor iets op maat. Alle prijzen zijn indicatief en all-in.
            </p>
            <div className="hazenco-hero-cta">
              <Link href="/contact" className="button">
                Plan een gesprek <ArrowRight size={15} />
              </Link>
              <Link href="/diensten" className="button secondary">
                Bekijk diensten
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page">
        <section className="hazenco-section" style={{ paddingTop: 40 }}>
          <OplossingenList solutions={solutions} />
        </section>

        <section className="hazenco-contact-band">
          <div className="hazenco-contact-inner">
            <h2>Iets anders voor ogen?</h2>
            <p>
              Alles wat je hier ziet is een startpunt, geen keurslijf. Vertel wat je zoekt en we bekijken samen of
              een van deze oplossingen past, of dat we iets op maat bouwen.
            </p>
            <div className="hazenco-contact-cta">
              <Link href="/contact" className="button">
                Plan een gesprek <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
