import type { MetadataRoute } from "next";
import { fetchPublishedListingsForSitemap } from "@/lib/supabase-server";

const BASE_URL = "https://toolshub.hazenco.nl";

/**
 * Sitemap voor Google Search Console. Bevat alle statische routes +
 * dynamisch alle published tool-detail pagina's uit Supabase.
 * Beschikbaar op /sitemap.xml zonder configuratie.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${BASE_URL}/catalogus`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${BASE_URL}/creators`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6
    }
  ];

  const listings = await fetchPublishedListingsForSitemap();
  const toolUrls: MetadataRoute.Sitemap = listings.map((row) => ({
    url: `${BASE_URL}/tools/${row.slug}`,
    lastModified: new Date(row.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  return [...staticUrls, ...toolUrls];
}
