import { supabase } from "./supabase";
import type {
  Branche,
  Category,
  DeliveryMode,
  Listing,
  ListingKind,
  ListingStatus,
  ProductType,
  SellerProfile,
  SellerStatus,
  ServiceCase,
  ServiceIncludedItem,
  ServiceMeta,
  ServicePackagePricing,
  UseCase
} from "./types";

type ListingRow = {
  id: string;
  seller_id: string;
  title: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category_id: string | null;
  type: ProductType;
  use_cases: string[] | null;
  branches: Branche[] | null;
  hero_image_url: string | null;
  screenshot_urls: string[] | null;
  price_cents: number;
  setup_price_cents: number | null;
  status: ListingStatus;
  featured: boolean | null;
  compatibility: string[] | null;
  tags: string[] | null;
  delivery_modes: DeliveryMode[] | null;
  demo_url: string | null;
  demo_screenshots: string[] | null;
  demo_instructions: string | null;
  demo_credentials: Array<{ label: string; value: string }> | null;
  demo_sample_input: string | null;
  downloads: number | null;
  sales: number | null;
  rating: number | null;
  review_count: number | null;
  version: string;
  support_included: string | null;
  created_at: string;
  updated_at: string;
  listing_kind: ListingKind | null;
  for_who: string[] | null;
  included: ServiceIncludedItem[] | null;
  cases: ServiceCase[] | null;
  service_pricing: ServicePackagePricing | null;
  service_meta: ServiceMeta | null;
};

type SellerRow = {
  id: string;
  user_id: string;
  name: string;
  handle: string;
  status: SellerStatus;
  specialty: string | null;
  bio: string | null;
  location: string | null;
  rating: number | null;
  sales: number | null;
  response_time: string | null;
  verified: boolean | null;
  website: string | null;
  support_email: string | null;
  vat_number: string | null;
  payout_method: string | null;
  joined_at: string | null;
  availability: SellerProfile["availability"] | null;
};

type CategoryRow = {
  id: string;
  name: string;
  description: string | null;
  type: ProductType;
  accent: string | null;
};

function mapListing(row: ListingRow): Listing {
  return {
    id: row.id,
    sellerId: row.seller_id,
    title: row.title,
    slug: row.slug,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    categoryId: row.category_id ?? "",
    type: row.type,
    useCases: (row.use_cases ?? []) as UseCase[],
    branches: row.branches ?? [],
    heroImageUrl: row.hero_image_url ?? undefined,
    screenshotUrls: row.screenshot_urls ?? [],
    priceCents: row.price_cents,
    setupPriceCents: row.setup_price_cents ?? 0,
    status: row.status,
    featured: row.featured ?? false,
    compatibility: row.compatibility ?? [],
    tags: row.tags ?? [],
    deliveryModes: row.delivery_modes ?? [],
    files: [],
    demo: {
      url: row.demo_url ?? "",
      screenshots: row.demo_screenshots ?? [],
      instructions: row.demo_instructions ?? "",
      credentials: row.demo_credentials ?? [],
      sampleInput: row.demo_sample_input ?? ""
    },
    downloads: row.downloads ?? 0,
    sales: row.sales ?? 0,
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    version: row.version,
    versions: [],
    plans: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    supportIncluded: row.support_included ?? "",
    listingKind: row.listing_kind ?? undefined,
    forWho: row.for_who ?? undefined,
    included: row.included ?? undefined,
    cases: row.cases ?? undefined,
    servicePricing: row.service_pricing ?? undefined,
    serviceMeta: row.service_meta ?? undefined
  };
}

function mapSeller(row: SellerRow): SellerProfile {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    handle: row.handle,
    status: row.status,
    specialty: row.specialty ?? "",
    bio: row.bio ?? "",
    location: row.location ?? "",
    rating: Number(row.rating ?? 0),
    sales: row.sales ?? 0,
    responseTime: row.response_time ?? "",
    verified: row.verified ?? false,
    website: row.website ?? undefined,
    supportEmail: row.support_email ?? undefined,
    vatNumber: row.vat_number ?? undefined,
    payoutMethod: row.payout_method ?? undefined,
    joinedAt: row.joined_at ?? undefined,
    availability: row.availability ?? undefined
  };
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    type: row.type,
    accent: row.accent ?? "#1A3C2E"
  };
}

export type Catalog = {
  listings: Listing[];
  sellers: SellerProfile[];
  categories: Category[];
};

export async function fetchCatalog(): Promise<Catalog | null> {
  if (!supabase) return null;

  const [listingsRes, sellersRes, categoriesRes] = await Promise.all([
    supabase.from("listings").select("*").eq("status", "published"),
    supabase.from("sellers").select("*"),
    supabase.from("categories").select("*")
  ]);

  if (listingsRes.error || sellersRes.error || categoriesRes.error) {
    console.error("Supabase fetchCatalog error", {
      listings: listingsRes.error,
      sellers: sellersRes.error,
      categories: categoriesRes.error
    });
    return null;
  }

  return {
    listings: (listingsRes.data ?? []).map(mapListing),
    sellers: (sellersRes.data ?? []).map(mapSeller),
    categories: (categoriesRes.data ?? []).map(mapCategory)
  };
}
