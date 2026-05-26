"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  Database,
  Download,
  ExternalLink,
  FileUp,
  Headphones,
  Heart,
  Mail,
  Megaphone,
  MessageSquare,
  PackageCheck,
  Search,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  UserPlus,
  Users,
  Workflow
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Shell } from "@/components/shell";
import { ProductCard } from "@/components/product-card";
import { SkeletonCard } from "@/components/skeleton";
import { SectionHeading } from "@/components/sections";
import { brancheLabels, formatPrice, useCaseLabels } from "@/lib/marketplace-data";
import { brancheIcons } from "@/lib/branche-icons";
import { useMarketplace } from "@/lib/marketplace-store";
import type { Branche, UseCase } from "@/lib/types";

const useCaseIcons: Partial<Record<UseCase, LucideIcon>> = {
  crm: Users,
  chatbot: MessageSquare,
  ecommerce: ShoppingCart,
  marketing: Megaphone,
  data_integration: Database,
  project_management: ClipboardList,
  email_marketing: Mail,
  analytics: BarChart3,
  lead_generation: UserPlus,
  customer_support: Headphones,
  workflow_automation: Workflow,
  payment_processing: CreditCard,
  social_media: Share2,
  inventory: Boxes
};

const HIGHLIGHTED_USE_CASES: UseCase[] = [
  "workflow_automation",
  "crm",
  "ecommerce",
  "chatbot",
  "marketing",
  "analytics",
  "customer_support",
  "email_marketing"
];

const HIGHLIGHTED_BRANCHES: Branche[] = [
  "retail",
  "horeca",
  "professional_services",
  "marketing_media",
  "ict",
  "financial",
  "healthcare"
];

const SEARCH_SUGGESTIONS = ["n8n facturen", "Bol.com sync", "WhatsApp chatbot", "Stripe dashboard", "Notion CRM"];

export default function HomePage() {
  const router = useRouter();
  const { state, activeUser } = useMarketplace();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const published = state.listings.filter((listing) => listing.status === "published");

  const topDownloaded = useMemo(
    () => [...published].sort((a, b) => b.downloads - a.downloads).slice(0, 4),
    [published]
  );
  const featured = useMemo(
    () => published.filter((listing) => listing.featured).slice(0, 4),
    [published]
  );
  const newest = useMemo(
    () => [...published].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6),
    [published]
  );

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/catalogus${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  if (activeUser.role === "seller" || activeUser.role === "admin") {
    return <RoleHome role={activeUser.role} />;
  }

  const totalDownloads = published.reduce((sum, item) => sum + item.downloads, 0);
  const totalSales = published.reduce((sum, item) => sum + item.sales, 0);
  const verifiedSellers = state.sellers.filter((s) => s.verified).length;

  return (
    <Shell>
      <div className="page marketplace-home">
        <section className="home-hero">
          <div>
            <span className="home-pill"><span className="dot" /> Hazenco Toolshub</span>
            <h1>
              Vind direct werkende <span className="accent">automation tools</span> voor je proces.
            </h1>
            <p className="lead">
              Workflows, AI agents, plugins, themes en templates van Europese makers.
              Demo voor aankoop, directe download na betaling.
            </p>
            <form className="home-search" onSubmit={submitSearch}>
              <div className="home-search-input">
                <Search size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Zoek op tool, branche of platform (bv. n8n, facturen, horeca)"
                />
              </div>
              <button className="button" type="submit">Zoeken</button>
            </form>
            <div className="home-suggestions">
              <span style={{ color: "rgba(232, 240, 234, 0.7)", fontSize: 12, fontWeight: 700 }}>Populair:</span>
              {SEARCH_SUGGESTIONS.map((suggestion) => (
                <Link key={suggestion} href={`/catalogus?q=${encodeURIComponent(suggestion)}`}>
                  {suggestion}
                </Link>
              ))}
            </div>
          </div>
          <div className="home-hero-stats">
            <div className="home-hero-stat">
              <strong>{published.length}</strong>
              <span>Gepubliceerde tools</span>
            </div>
            <div className="home-hero-stat">
              <strong>{totalDownloads.toLocaleString("nl-NL")}</strong>
              <span>Downloads</span>
            </div>
            <div className="home-hero-stat">
              <strong>{totalSales.toLocaleString("nl-NL")}</strong>
              <span>Verkocht</span>
            </div>
            <div className="home-hero-stat">
              <strong>{verifiedSellers}</strong>
              <span>Geverifieerde creators</span>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-head">
            <div>
              <span className="eyebrow">Wat zoek je?</span>
              <h2>Kies een categorie en start je zoektocht</h2>
              <p>Veelgebruikte use-cases. Klik om de catalogus erop te filteren.</p>
            </div>
            <Link className="text-action" href="/catalogus">Alle categorieën <ArrowRight size={15} /></Link>
          </div>
          <div className="home-tiles">
            {HIGHLIGHTED_USE_CASES.map((useCase) => {
              const Icon = useCaseIcons[useCase] ?? Workflow;
              const count = published.filter((listing) => (listing.useCases ?? []).includes(useCase)).length;
              return (
                <Link key={useCase} className="home-tile" href={`/catalogus?useCase=${useCase}`}>
                  <span className="home-tile-icon"><Icon size={18} /></span>
                  <div>
                    <strong>{useCaseLabels[useCase]}</strong>
                    <span>{count} {count === 1 ? "tool" : "tools"}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-head">
            <div>
              <span className="eyebrow">Branche</span>
              <h2>Werk je in...</h2>
              <p>Tools afgestemd op jouw sector.</p>
            </div>
            <Link className="text-action" href="/catalogus">Alle branches <ArrowRight size={15} /></Link>
          </div>
          <div className="branche-pills">
            {HIGHLIGHTED_BRANCHES.map((branche) => {
              const Icon = brancheIcons[branche];
              return (
                <Link key={branche} href={`/catalogus?branche=${branche}`}>
                  <Icon size={15} />
                  {brancheLabels[branche]}
                </Link>
              );
            })}
          </div>
        </section>

        {!mounted ? (
          <section className="home-section">
            <SectionHeading eyebrow="Nieuw" title="Vers in de marketplace" actionHref="/catalogus?sort=newest" actionLabel="Bekijk nieuwste" />
            <div className="product-grid">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </section>
        ) : null}

        {mounted && newest.length > 0 ? (
          <section className="home-section">
            <SectionHeading
              eyebrow="Nieuw"
              title="Vers in de marketplace"
              actionHref="/catalogus?sort=newest"
              actionLabel="Bekijk nieuwste"
            />
            <div className="product-grid">
              {newest.map((listing) => <ProductCard key={listing.id} listing={listing} />)}
            </div>
          </section>
        ) : null}

        {mounted && featured.length > 0 ? (
          <section className="home-section">
            <SectionHeading
              eyebrow="Hazenco selectie"
              title="Uitgelichte tools voor snelle impact"
              actionHref="/catalogus"
              actionLabel="Bekijk alle uitgelicht"
            />
            <div className="product-grid">
              {featured.map((listing) => <ProductCard key={listing.id} listing={listing} />)}
            </div>
          </section>
        ) : null}

        {mounted && topDownloaded.length > 0 ? (
          <section className="home-section">
            <SectionHeading
              eyebrow="Top downloads"
              title="Wat ondernemers deze week kiezen"
              actionHref="/catalogus?sort=downloads"
              actionLabel="Meer top tools"
            />
            <div className="product-grid">
              {topDownloaded.map((listing) => <ProductCard key={listing.id} listing={listing} />)}
            </div>
          </section>
        ) : null}

        <div className="home-trust">
          <div className="home-trust-item">
            <ShieldCheck size={24} style={{ color: "var(--orange-600)" }} />
            <strong>Geverifieerd</strong>
            <span>Creators en listings worden gecheckt voordat ze live gaan</span>
          </div>
          <div className="home-trust-item">
            <PackageCheck size={24} style={{ color: "var(--orange-600)" }} />
            <strong>Directe levering</strong>
            <span>Bestanden, cloud-toegang of maatwerk service na betaling</span>
          </div>
          <div className="home-trust-item">
            <Star size={24} style={{ color: "var(--orange-600)" }} />
            <strong>Reviews met moderatie</strong>
            <span>Eerlijke ervaringen van Nederlandse mkb-kopers</span>
          </div>
          <div className="home-trust-item">
            <Sparkles size={24} style={{ color: "var(--orange-600)" }} />
            <strong>Test demo voor aankoop</strong>
            <span>Bekijk hoe een tool werkt voordat je 'm in je winkelwagen legt</span>
          </div>
        </div>

        <section className="final-cta">
          <div>
            <span className="eyebrow">Klaar om te starten?</span>
            <h2>Begin met de catalogus of laat onze wizard je gidsen.</h2>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/catalogus"><Sparkles size={17} /> Open catalogus</Link>
            <Link className="button secondary" href="/account">
              <Heart size={16} /> Mijn account
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function RoleHome({ role }: { role: "seller" | "admin" }) {
  const { state, activeUser } = useMarketplace();
  const seller = state.sellers.find((item) => item.id === activeUser.sellerId);
  const sellerListings = state.listings.filter((listing) => listing.sellerId === seller?.id);
  const sellerOrders = state.orders.flatMap((order) =>
    order.items.filter((item) => item.sellerId === seller?.id).map((item) => ({ order, item }))
  );
  const pendingApplications = state.sellerApplications.filter((item) => item.status === "pending");
  const pendingListings = state.listings.filter((listing) => listing.status === "pending");
  const pendingReviews = state.reviews.filter((review) => !review.approved);

  if (role === "seller") {
    const earnings = sellerOrders
      .filter(({ order }) => order.status === "paid")
      .reduce((sum, { item }) => sum + item.priceCents * item.quantity + item.serviceAddOnPriceCents, 0);
    return (
      <Shell>
        <div className="page">
          <span className="eyebrow">Creator werkruimte</span>
          <h1>Welkom terug, {activeUser.name.split(" ")[0]}</h1>
          <p className="lead">Beheer je listings, orders en setup-aanvragen op één plek.</p>
          <div className="account-kpis">
            <div className="account-kpi">
              <div className="account-kpi-icon"><FileUp size={20} /></div>
              <div><span>Listings</span><strong>{sellerListings.length}</strong></div>
            </div>
            <div className="account-kpi">
              <div className="account-kpi-icon"><BarChart3 size={20} /></div>
              <div><span>Orderregels</span><strong>{sellerOrders.length}</strong></div>
            </div>
            <div className="account-kpi">
              <div className="account-kpi-icon"><Download size={20} /></div>
              <div><span>Downloads</span><strong>{sellerListings.reduce((sum, item) => sum + item.downloads, 0)}</strong></div>
            </div>
            <div className="account-kpi">
              <div className="account-kpi-icon"><CreditCard size={20} /></div>
              <div><span>Betaalde omzet</span><strong>{formatPrice(earnings)}</strong></div>
            </div>
          </div>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <Link className="button" href="/seller#new"><FileUp size={17} /> Nieuwe listing</Link>
            <Link className="button secondary" href="/seller"><ExternalLink size={16} /> Naar werkruimte</Link>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="page">
        <span className="eyebrow">Admin werkruimte</span>
        <h1>Welkom terug, {activeUser.name.split(" ")[0]}</h1>
        <p className="lead">Bekijk de wachtrijen voor sellers, listings en reviews.</p>
        <div className="account-kpis">
          <div className="account-kpi">
            <div className="account-kpi-icon"><ShieldCheck size={20} /></div>
            <div><span>Aanvragen creators</span><strong>{pendingApplications.length}</strong></div>
          </div>
          <div className="account-kpi">
            <div className="account-kpi-icon"><ClipboardCheck size={20} /></div>
            <div><span>Listings in afwachting</span><strong>{pendingListings.length}</strong></div>
          </div>
          <div className="account-kpi">
            <div className="account-kpi-icon"><Star size={20} /></div>
            <div><span>Reviews</span><strong>{pendingReviews.length}</strong></div>
          </div>
          <div className="account-kpi">
            <div className="account-kpi-icon"><Store size={20} /></div>
            <div><span>GMV demo</span><strong>{formatPrice(state.orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.totalCents, 0))}</strong></div>
          </div>
        </div>
        <div className="hero-actions" style={{ marginTop: 16 }}>
          <Link className="button" href="/admin"><ShieldCheck size={17} /> Open admin</Link>
        </div>
      </div>
    </Shell>
  );
}
