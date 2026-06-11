import { supabase } from "./supabase";

/** Minimal listing data voor sitemap + metadata generatie (server-side). */
export type ListingMeta = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroImageUrl?: string;
  updatedAt: string;
};

export async function fetchPublishedSlugs(): Promise<string[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("listings")
    .select("slug")
    .eq("status", "published");
  if (error || !data) return [];
  return data.map((row) => row.slug as string);
}

export async function fetchPublishedListingsForSitemap(): Promise<
  Array<{ slug: string; updatedAt: string }>
> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("listings")
    .select("slug, updated_at")
    .eq("status", "published");
  if (error || !data) return [];
  return data.map((row) => ({
    slug: row.slug as string,
    updatedAt: row.updated_at as string
  }));
}

export async function fetchListingMetaBySlug(
  slug: string
): Promise<ListingMeta | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("listings")
    .select("slug, title, tagline, description, hero_image_url, updated_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return {
    slug: data.slug as string,
    title: data.title as string,
    tagline: (data.tagline as string) ?? "",
    description: (data.description as string) ?? "",
    heroImageUrl: (data.hero_image_url as string) ?? undefined,
    updatedAt: data.updated_at as string
  };
}
