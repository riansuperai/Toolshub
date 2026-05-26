"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart3,
  Boxes,
  Briefcase,
  Cloud,
  ClipboardEdit,
  ClipboardList,
  CreditCard,
  Database,
  Download,
  Filter,
  Headphones,
  Layers,
  LayoutGrid,
  Mail,
  Megaphone,
  MessageSquare,
  MoreHorizontal,
  PanelLeft,
  PanelTop,
  Search,
  Share2,
  ShoppingCart,
  Sparkles,
  Tag,
  Truck,
  UserPlus,
  Users,
  Workflow,
  Wrench
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Shell } from "@/components/shell";
import { ProductCard } from "@/components/product-card";
import {
  brancheLabels,
  deliveryModeLabels,
  useCaseLabels
} from "@/lib/marketplace-data";
import { brancheIcons } from "@/lib/branche-icons";
import { useMarketplace } from "@/lib/marketplace-store";
import type { Branche, DeliveryMode, Listing, UseCase } from "@/lib/types";
import { FilterPillGroup, type FilterPillOption } from "@/components/filter-pill-group";
import { FilterTileGroup } from "@/components/filter-tile-group";
import { FilterDropdown } from "@/components/filter-dropdown";
import { FilterWizard, type WizardSelection } from "@/components/filter-wizard";

const useCaseIcons: Record<UseCase, LucideIcon> = {
  crm: Users,
  chatbot: MessageSquare,
  ecommerce: ShoppingCart,
  marketing: Megaphone,
  data_integration: Database,
  project_management: ClipboardList,
  email_marketing: Mail,
  social_media: Share2,
  analytics: BarChart3,
  lead_generation: UserPlus,
  customer_support: Headphones,
  workflow_automation: Workflow,
  form_builder: ClipboardEdit,
  payment_processing: CreditCard,
  inventory: Boxes,
  other: MoreHorizontal
};

const deliveryIcons: Record<DeliveryMode, LucideIcon> = {
  download: Download,
  cloud: Cloud,
  custom: Wrench
};

type PriceBucket = "all" | "free" | "lt25" | "25_50" | "50_100" | "gt100";

const priceBuckets: { id: PriceBucket; label: string }[] = [
  { id: "all", label: "Alle prijzen" },
  { id: "free", label: "Gratis" },
  { id: "lt25", label: "< €25" },
  { id: "25_50", label: "€25 – €50" },
  { id: "50_100", label: "€50 – €100" },
  { id: "gt100", label: "> €100" }
];

function bucketForPrice(cents: number): Exclude<PriceBucket, "all"> {
  if (cents === 0) return "free";
  if (cents < 2500) return "lt25";
  if (cents <= 5000) return "25_50";
  if (cents <= 10000) return "50_100";
  return "gt100";
}

type FilterAxis = "branche" | "useCase" | "platform" | "price" | "delivery";

type ActiveFilters = {
  query: string;
  branche: Branche | "all";
  useCase: UseCase | "all";
  platform: string;
  price: PriceBucket;
  delivery: DeliveryMode | "all";
};

function listingMatchesQuery(listing: Listing, q: string): boolean {
  if (!q) return true;
  return [listing.title, listing.tagline, listing.description, listing.tags.join(" "), listing.compatibility.join(" ")]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

function listingMatches(listing: Listing, filters: ActiveFilters, exclude: FilterAxis | null = null): boolean {
  if (!listingMatchesQuery(listing, filters.query.toLowerCase().trim())) return false;
  if (exclude !== "branche" && filters.branche !== "all" && !(listing.branches ?? []).includes(filters.branche)) return false;
  if (exclude !== "useCase" && filters.useCase !== "all" && !(listing.useCases ?? []).includes(filters.useCase)) return false;
  if (exclude !== "platform" && filters.platform !== "all" && !listing.compatibility.includes(filters.platform)) return false;
  if (exclude !== "price" && filters.price !== "all" && bucketForPrice(listing.priceCents) !== filters.price) return false;
  if (exclude !== "delivery" && filters.delivery !== "all" && !listing.deliveryModes.includes(filters.delivery)) return false;
  return true;
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogFallback() {
  return (
    <Shell>
      <div className="page">
        <span className="eyebrow">Catalogus</span>
        <h1>Catalogus laden.</h1>
        <div className="empty-state">Filters worden klaargezet.</div>
      </div>
    </Shell>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const { state } = useMarketplace();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [branche, setBranche] = useState<Branche | "all">("all");
  const [useCase, setUseCase] = useState<UseCase | "all">("all");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "downloads");
  const [delivery, setDelivery] = useState<DeliveryMode | "all">("all");
  const [platform, setPlatform] = useState<string>("all");
  const [price, setPrice] = useState<PriceBucket>("all");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [layout, setLayout] = useState<"stack" | "sidebar">("stack");
  const [compactSticky, setCompactSticky] = useState(false);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layout !== "stack") {
      setCompactSticky(false);
      return;
    }
    const node = filterPanelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCompactSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-66px 0px 0px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [layout]);

  const filters: ActiveFilters = { query, branche, useCase, platform, price, delivery };

  const published = useMemo(
    () => state.listings.filter((listing) => listing.status === "published"),
    [state.listings]
  );

  function countFor(axis: FilterAxis, predicate: (listing: Listing) => boolean) {
    let n = 0;
    for (const listing of published) {
      if (listingMatches(listing, filters, axis) && predicate(listing)) n += 1;
    }
    return n;
  }

  const filtered = useMemo(() => {
    return [...published]
      .filter((listing) => listingMatches(listing, filters))
      .sort((a, b) => {
        if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "price_low") return a.priceCents - b.priceCents;
        if (sort === "price_high") return b.priceCents - a.priceCents;
        return b.downloads - a.downloads;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [published, query, branche, useCase, platform, price, delivery, sort]);

  const activeFilterCount =
    (branche !== "all" ? 1 : 0) +
    (useCase !== "all" ? 1 : 0) +
    (delivery !== "all" ? 1 : 0) +
    (platform !== "all" ? 1 : 0) +
    (price !== "all" ? 1 : 0) +
    (query ? 1 : 0);

  function resetFilters() {
    setQuery("");
    setBranche("all");
    setUseCase("all");
    setDelivery("all");
    setPlatform("all");
    setPrice("all");
  }

  function applyWizard(selection: WizardSelection) {
    setBranche(selection.branche);
    setUseCase(selection.useCase);
    setPlatform(selection.platform);
    setPrice(selection.price);
    setDelivery(selection.delivery);
  }

  const brancheOptions: FilterPillOption[] = [
    { id: "all", label: "Alle branches", icon: Layers, count: countFor("branche", () => true) },
    ...(Object.entries(brancheLabels) as [Branche, string][]).map(([key, label]) => ({
      id: key,
      label,
      icon: brancheIcons[key],
      count: countFor("branche", (l) => (l.branches ?? []).includes(key))
    }))
  ];

  const typeOptions: FilterPillOption[] = [
    { id: "all", label: "Alle types", icon: LayoutGrid, count: countFor("useCase", () => true) },
    ...(Object.entries(useCaseLabels) as [UseCase, string][]).map(([key, label]) => ({
      id: key,
      label,
      icon: useCaseIcons[key],
      count: countFor("useCase", (l) => (l.useCases ?? []).includes(key))
    }))
  ];

  const priceOptions: FilterPillOption[] = priceBuckets.map((bucket) => ({
    id: bucket.id,
    label: bucket.label,
    count:
      bucket.id === "all"
        ? countFor("price", () => true)
        : countFor("price", (l) => bucketForPrice(l.priceCents) === bucket.id)
  }));

  const deliveryOptions: FilterPillOption[] = [
    { id: "all", label: "Alle leveringen", icon: Truck, count: countFor("delivery", () => true) },
    ...(Object.entries(deliveryModeLabels) as [DeliveryMode, string][]).map(([key, label]) => ({
      id: key,
      label,
      icon: deliveryIcons[key],
      count: countFor("delivery", (l) => l.deliveryModes.includes(key))
    }))
  ];

  const currentSelection: WizardSelection = { branche, useCase, platform, price, delivery };

  const priceLabelMap = Object.fromEntries(priceBuckets.map((b) => [b.id, b.label]));
  const activeChips: { id: string; label: string; remove: () => void }[] = [];
  if (query) activeChips.push({ id: "q", label: `"${query}"`, remove: () => setQuery("") });
  if (branche !== "all") activeChips.push({ id: "branche", label: brancheLabels[branche], remove: () => setBranche("all") });
  if (useCase !== "all") activeChips.push({ id: "useCase", label: useCaseLabels[useCase], remove: () => setUseCase("all") });
  if (price !== "all") activeChips.push({ id: "price", label: priceLabelMap[price] ?? "Prijs", remove: () => setPrice("all") });
  if (delivery !== "all") activeChips.push({ id: "delivery", label: deliveryModeLabels[delivery], remove: () => setDelivery("all") });

  return (
    <Shell>
      <div className="page">
        <span className="eyebrow">Catalogus</span>
        <h1>Vind de juiste digitale tool voor je proces.</h1>
        <p className="lead">Filter op branche, type, prijs en levering. Het aantal naast elke optie laat live zien hoeveel tools je krijgt.</p>

        <div className="layout-switch" role="tablist" aria-label="Filters layout">
          <button
            type="button"
            role="tab"
            aria-selected={layout === "stack"}
            className={layout === "stack" ? "active" : ""}
            onClick={() => setLayout("stack")}
          >
            <PanelTop size={14} /> Filters bovenaan
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={layout === "sidebar"}
            className={layout === "sidebar" ? "active" : ""}
            onClick={() => setLayout("sidebar")}
          >
            <PanelLeft size={14} /> Filters in sidebar
          </button>
        </div>

        <div className={`catalog-layout ${layout}`}>
        <div className="filter-panel" ref={filterPanelRef}>
          <div className="filter-toprow">
            <div className="filter-search">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Zoek op tool, stack of probleem (bv. n8n, facturen, WordPress)"
              />
            </div>
            <button type="button" className="wizard-trigger" onClick={() => setWizardOpen(true)}>
              <Sparkles size={16} /> Wizard
            </button>
          </div>

          <FilterPillGroup
            label="Branche"
            icon={Briefcase}
            options={brancheOptions}
            value={branche}
            onChange={(id) => setBranche(id as Branche | "all")}
          />

          <FilterTileGroup
            label="Type"
            icon={Filter}
            options={typeOptions}
            value={useCase}
            onChange={(id) => setUseCase(id as UseCase | "all")}
            collapsedCount={10}
          />

          <FilterPillGroup
            label="Prijs"
            icon={Tag}
            options={priceOptions}
            value={price}
            onChange={(id) => setPrice(id as PriceBucket)}
          />

          <FilterPillGroup
            label="Levering"
            icon={Truck}
            options={deliveryOptions}
            value={delivery}
            onChange={(id) => setDelivery(id as DeliveryMode | "all")}
          />

          <div className="filter-footer">
            <label className="sort-field">
              Sorteren op
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="downloads">Top downloads</option>
                <option value="newest">Nieuwste</option>
                <option value="rating">Best beoordeeld</option>
                <option value="price_low">Prijs laag-hoog</option>
                <option value="price_high">Prijs hoog-laag</option>
              </select>
            </label>
            {activeFilterCount > 0 ? (
              <button type="button" className="filter-reset" onClick={resetFilters}>
                Wis filters ({activeFilterCount})
              </button>
            ) : null}
          </div>
        </div>

        <div className="results-column">
          <div className="status-row">
            <strong>{filtered.length} tools gevonden</strong>
            <span className="badge soft"><Filter size={14} /> {activeFilterCount} actieve filter{activeFilterCount === 1 ? "" : "s"}</span>
          </div>

          {filtered.length ? (
            <div className="product-grid" style={{ marginTop: 18 }}>
              {filtered.map((listing) => (
                <ProductCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>Geen tools gevonden</h2>
              <p>Pas je filters aan of probeer een bredere zoekterm.</p>
            </div>
          )}
        </div>
        </div>

        <div className={`filter-sticky${compactSticky && layout === "stack" ? " visible" : ""}`}>
          <div className="filter-sticky-inner">
            <div className="filter-sticky-search">
              <Search size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Zoek op tool, stack of probleem"
              />
            </div>
            <div className="filter-sticky-dropdowns">
              <FilterDropdown
                label="Branche"
                icon={Briefcase}
                options={brancheOptions}
                value={branche}
                onChange={(id) => setBranche(id as Branche | "all")}
              />
              <FilterDropdown
                label="Type"
                icon={Filter}
                options={typeOptions}
                value={useCase}
                onChange={(id) => setUseCase(id as UseCase | "all")}
              />
              <FilterDropdown
                label="Prijs"
                icon={Tag}
                options={priceOptions}
                value={price}
                onChange={(id) => setPrice(id as PriceBucket)}
              />
              <FilterDropdown
                label="Levering"
                icon={Truck}
                options={deliveryOptions}
                value={delivery}
                onChange={(id) => setDelivery(id as DeliveryMode | "all")}
              />
            </div>
            <div className="filter-sticky-meta">
              <span className="filter-sticky-count"><strong>{filtered.length}</strong> tools</span>
              {activeChips.length > 0 ? (
                <button type="button" className="filter-reset" onClick={resetFilters}>
                  Wis alles ({activeChips.length})
                </button>
              ) : null}
              <label className="sort-field compact" aria-label="Sorteren">
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="downloads">Top downloads</option>
                  <option value="newest">Nieuwste</option>
                  <option value="rating">Best beoordeeld</option>
                  <option value="price_low">Prijs laag-hoog</option>
                  <option value="price_high">Prijs hoog-laag</option>
                </select>
              </label>
              <button type="button" className="wizard-trigger" onClick={() => setWizardOpen(true)}>
                <Sparkles size={14} /> Wizard
              </button>
            </div>
          </div>
        </div>

        <FilterWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onApply={applyWizard}
          listings={published}
          initial={currentSelection}
        />
      </div>
    </Shell>
  );
}
