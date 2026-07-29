import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Globe,
  Workflow,
  Sparkles,
  Wrench,
  Calculator,
  Receipt,
  Image as ImageIcon,
  QrCode,
  KeyRound,
  Phone,
  MessageSquare,
  Star,
  Calendar,
  ShoppingBag
} from "lucide-react";
import { Shell } from "@/components/shell";
import { listings as mockListings } from "@/lib/marketplace-data";
import { fetchPublishedListings } from "@/lib/supabase-queries";

export const metadata: Metadata = {
  title: "Hazenco, Wij automatiseren en bouwen wat jouw bedrijf sneller maakt",
  description:
    "Nederlandse B2B-partner voor webdesign, workflow-automatisering en AI-workflows. Klein team, direct contact, done-for-you levering."
};

const diensten = [
  {
    icon: Globe,
    href: "/website-laten-maken",
    title: "Webdesign",
    text:
      "Snelle, conversie-gerichte websites op maat. Hosting, onderhoud en support inbegrepen. Geen bouwers, geen plugin-drama."
  },
  {
    icon: Workflow,
    href: "/workflow-automatisering",
    title: "Workflow-automatisering",
    text:
      "Van handmatig Excel-werk naar systemen die vanzelf lopen. Product-manager, cross-sell popups, calculators, meetbare tijdwinst."
  },
  {
    icon: Sparkles,
    href: "/ai-workflows",
    title: "AI-workflows & integraties",
    text:
      "Slimme agents die met je klanten praten. Telefoonbot, WhatsApp-chatbot, reviews-responder, in jouw toon-of-voice, 24/7 aan."
  }
];

// Oplossingen-teaser: 3 uitgelichte uit de bestaande service_package-listings
const OPLOSSINGEN_HIGHLIGHT = [
  "listing_ai_telefoonassistent",
  "listing_online_afsprakensysteem",
  "listing_magento_tile_calculator"
] as const;

const OPLOSSING_ICONS: Record<string, typeof Phone> = {
  listing_ai_telefoonassistent: Phone,
  listing_whatsapp_business_chatbot: MessageSquare,
  listing_google_reviews_ai_responder: Star,
  listing_online_afsprakensysteem: Calendar,
  listing_magento_cart_popup: ShoppingBag,
  listing_magento_tile_calculator: Calculator
};

const toolkitHighlights = [
  { icon: Receipt, href: "/toolkit/factuur-generator", title: "Factuur generator", meta: "PDF factuur in 2 minuten" },
  { icon: ImageIcon, href: "/toolkit/achtergrond-verwijderen", title: "Achtergrond verwijderen", meta: "AI, in je browser" },
  { icon: QrCode, href: "/toolkit/qr-code-generator", title: "QR-code generator", meta: "Direct downloadbaar" },
  { icon: KeyRound, href: "/toolkit/wachtwoord-generator", title: "Wachtwoord generator", meta: "Sterk & willekeurig" }
];

function formatSubscriptionPrice(cents: number) {
  return `vanaf € ${Math.round(cents / 100)}/mnd`;
}

export const revalidate = 300;

export default async function HomePage() {
  const supabaseListings = await fetchPublishedListings();
  const sourceListings =
    supabaseListings && supabaseListings.length > 0
      ? supabaseListings
      : mockListings.filter((l) => l.status === "published");

  // Uitgelicht: eerst uit onze highlight-lijst, aanvullen tot 3 met eerste
  // beschikbare listings. Deduplicate op id.
  const seen = new Set<string>();
  const oplossingen: typeof sourceListings = [];
  for (const id of OPLOSSINGEN_HIGHLIGHT) {
    const l = sourceListings.find((x) => x.id === id);
    if (l && !seen.has(l.id)) {
      seen.add(l.id);
      oplossingen.push(l);
    }
  }
  for (const l of sourceListings) {
    if (oplossingen.length >= 3) break;
    if (!seen.has(l.id)) {
      seen.add(l.id);
      oplossingen.push(l);
    }
  }

  return (
    <Shell>
      {/* HERO */}
      <section className="hazenco-hero">
        <div className="page">
          <div className="hazenco-hero-inner">
            <p className="eyebrow">Hazenco, B2B partner</p>
            <h1>Wij automatiseren en bouwen<br />wat jouw bedrijf sneller maakt.</h1>
            <p className="lead">
              Custom software, workflow-automatisering en AI-workflows voor het Nederlandse MKB. Klein team, direct
              contact, done-for-you levering, zonder softwarebureau-prijzen.
            </p>
            <div className="hazenco-hero-cta">
              <Link href="/contact" className="button">
                Plan een gesprek van 15 minuten <ArrowRight size={15} />
              </Link>
              <Link href="/diensten" className="button secondary">
                Bekijk diensten
              </Link>
            </div>
            <ul className="hazenco-hero-proof">
              <li>Klein team, direct contact</li>
              <li>Meestal binnen 1 werkdag antwoord</li>
              <li>Reactie op je vraag ≠ verkooppraatje</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="page">
        {/* DIENSTEN-BLOK */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Diensten</p>
            <h2>Drie manieren om je bedrijf sneller te laten lopen</h2>
          </header>
          <div className="hazenco-diensten-grid">
            {diensten.map(({ icon: Icon, href, title, text }) => (
              <Link key={href} href={href} className="hazenco-dienst-card">
                <div className="hazenco-dienst-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="hazenco-dienst-link">
                  Meer weten <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* OPLOSSINGEN-TEASER */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Oplossingen</p>
            <h2>Voorbeelden van wat we hebben gebouwd</h2>
            <p className="hazenco-section-sub">
              Productized oplossingen die je 1-op-1 kunt afnemen, of als startpunt voor iets op maat.
            </p>
          </header>
          <div className="hazenco-oplossingen-grid">
            {oplossingen.map((l) => {
              const Icon = OPLOSSING_ICONS[l.id] ?? Sparkles;
              const monthly = l.servicePricing?.subscription?.priceCentsPerMonth;
              return (
                <article key={l.id} className="hazenco-oplossing-card">
                  {(() => {
                    const thumb = l.heroImageUrl ?? l.screenshotUrls?.[0];
                    if (!thumb) return null;
                    return (
                      <div className="hazenco-oplossing-media">
                        <Image
                          src={thumb}
                          alt={l.title}
                          width={720}
                          height={452}
                          style={{ width: "100%", height: "auto", display: "block" }}
                        />
                      </div>
                    );
                  })()}
                  <div className="hazenco-oplossing-body">
                    <div className="hazenco-oplossing-head">
                      <div className="hazenco-oplossing-icon">
                        <Icon size={16} />
                      </div>
                      <h3>{l.title}</h3>
                    </div>
                    <p>{l.tagline}</p>
                    <div className="hazenco-oplossing-meta">
                      {monthly ? <span className="badge soft">{formatSubscriptionPrice(monthly)}</span> : null}
                      <Link href="/contact" className="hazenco-oplossing-cta">
                        Boek een gesprek <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="hazenco-section-foot">
            <Link href="/diensten" className="button secondary">
              Alle oplossingen <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* TOOLKIT-TEASER */}
        <section className="hazenco-section hazenco-toolkit-band">
          <div className="hazenco-toolkit-inner">
            <div className="hazenco-toolkit-copy">
              <p className="eyebrow">Gratis toolkit</p>
              <h2>Kleine tools die direct werken.<br />Zonder inloggen, in je browser.</h2>
              <p>
                Facturen maken, QR-codes, wachtwoorden, PDF's samenvoegen, achtergronden verwijderen. Elf hands-on
                tools waar we zelf dagelijks mee werken.
              </p>
              <Link href="/toolkit" className="button">
                Naar alle tools <ArrowRight size={15} />
              </Link>
            </div>
            <div className="hazenco-toolkit-grid">
              {toolkitHighlights.map(({ icon: Icon, href, title, meta }) => (
                <Link key={href} href={href} className="hazenco-toolkit-tile">
                  <div className="hazenco-toolkit-tile-icon">
                    <Icon size={18} />
                  </div>
                  <strong>{title}</strong>
                  <small>{meta}</small>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* WAAROM HAZENCO, DOGFOODING */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Waarom Hazenco</p>
            <h2>Wij bouwen wat we ook zelf gebruiken</h2>
            <p className="hazenco-section-sub">
              Geen theoretische adviezen, alles wat we voor klanten bouwen draait ook bij onszelf. Dat is de reden dat
              we weten wat werkt en wat het écht kost om te onderhouden.
            </p>
          </header>
          <div className="hazenco-waarom-grid">
            <article className="hazenco-waarom-card">
              <div className="hazenco-waarom-icon"><Wrench size={22} /></div>
              <h3>TechPanda draait op deze stack</h3>
              <p>
                Onze eigen B2C IT-webshop is gebouwd met dezelfde Next.js + Supabase stack die we voor jou opzetten.
                Als iets bij ons breekt, weten we het als eerste.
              </p>
              <a href="https://techpanda.nl" target="_blank" rel="noreferrer" className="hazenco-waarom-link">
                techpanda.nl <ArrowRight size={13} />
              </a>
            </article>
            <article className="hazenco-waarom-card">
              <div className="hazenco-waarom-icon"><Sparkles size={22} /></div>
              <h3>Deze site is de showcase</h3>
              <p>
                Custom Next.js, geen builder, geen template. Dark mode, mobiel-optimalisatie, sub-100ms pagina-laden.
                Wat je hier ziet is wat je kunt krijgen.
              </p>
              <span className="hazenco-waarom-link muted">Je kijkt er nu naar</span>
            </article>
            <article className="hazenco-waarom-card">
              <div className="hazenco-waarom-icon"><Calculator size={22} /></div>
              <h3>Onze toolkit gebruiken we intern</h3>
              <p>
                De 11 gratis tools zijn ontstaan uit ons eigen dagelijkse werk. Factuur-generator, PDF-samenvoegen,
                achtergrond-verwijderaar, allemaal getest op onze eigen taken voordat ze publiek gingen.
              </p>
              <Link href="/toolkit" className="hazenco-waarom-link">
                Bekijk de toolkit <ArrowRight size={13} />
              </Link>
            </article>
          </div>
        </section>

        {/* BLOG-TEASER */}
        <section className="hazenco-section">
          <header className="hazenco-section-head">
            <p className="eyebrow">Blog</p>
            <h2>Praktische artikelen voor MKB-ondernemers</h2>
            <p className="hazenco-section-sub">
              De eerste posts komen binnenkort. Onderwerpen die op onze lijst staan: hoe je een AI-telefoonbot zonder
              nachtmerrie opzet, wanneer een custom website loont vs. een template, en wat automatisering realistisch
              oplevert in het eerste jaar.
            </p>
          </header>
          <div className="hazenco-section-foot">
            <Link href="/blog" className="button secondary">
              Naar de blog <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* CONTACT-CTA */}
        <section className="hazenco-contact-band">
          <div className="hazenco-contact-inner">
            <h2>Kort gesprek, concrete inschatting.</h2>
            <p>
              Vertel wat je zoekt, dan hoor je binnen 1 werkdag of we een fit zijn en wat het grofweg kost. Geen
              verkoopgesprek, geen verplichtingen.
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
