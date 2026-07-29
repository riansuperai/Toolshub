import type { MetadataRoute } from "next";
import { listings } from "@/lib/marketplace-data";
import { listBlogPosts } from "@/lib/blog";

const BASE_URL = "https://hazenco.nl";

const TOOLKIT_SLUGS = [
  "factuur-generator",
  "wachtwoord-generator",
  "qr-code-generator",
  "btw-calculator",
  "iban-checker",
  "bruto-netto",
  "pdf-samenvoegen",
  "pdf-splitsen",
  "pdf-comprimeren",
  "afbeelding-comprimeren",
  "achtergrond-verwijderen"
];

/**
 * Sitemap voor Google Search Console. Bevat alle statische publieke
 * routes + oplossingen-detail-pages + alle blog-posts + toolkit-subpages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/diensten`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/website-laten-maken`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/workflow-automatisering`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/ai-workflows`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/oplossingen`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/toolkit`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/cases`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/over-ons`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/veelgestelde-vragen`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/algemene-voorwaarden`, lastModified: now, changeFrequency: "yearly", priority: 0.3 }
  ];

  const toolkitUrls: MetadataRoute.Sitemap = TOOLKIT_SLUGS.map((slug) => ({
    url: `${BASE_URL}/toolkit/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  const oplossingUrls: MetadataRoute.Sitemap = listings
    .filter((l) => l.listingKind === "service")
    .map((l) => ({
      url: `${BASE_URL}/oplossingen/${l.slug}`,
      lastModified: new Date(l.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }));

  const blogPosts = await listBlogPosts();
  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  return [...staticUrls, ...toolkitUrls, ...oplossingUrls, ...blogUrls];
}
