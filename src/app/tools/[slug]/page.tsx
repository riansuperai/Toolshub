import type { Metadata } from "next";
import { listings } from "@/lib/marketplace-data";
import {
  fetchListingMetaBySlug,
  fetchPublishedSlugs
} from "@/lib/supabase-server";
import { ToolDetailClient } from "./tool-detail-client";

type Params = { slug: string };

export async function generateStaticParams() {
  // Combine mock-data slugs (legacy) met live Supabase published slugs.
  // Set-deduplicated zodat dezelfde slug niet dubbel pre-rendered wordt.
  const mockSlugs = listings.map((listing) => listing.slug);
  const supabaseSlugs = await fetchPublishedSlugs();
  const unique = Array.from(new Set([...mockSlugs, ...supabaseSlugs]));
  return unique.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = await fetchListingMetaBySlug(slug);

  if (!meta) {
    // Fallback voor mock-tools die alleen in marketplace-data.ts staan
    const mock = listings.find((l) => l.slug === slug);
    if (!mock) return { title: "Tool niet gevonden" };
    return {
      title: mock.title,
      description: mock.tagline,
      openGraph: {
        title: mock.title,
        description: mock.tagline,
        url: `https://toolshub.hazenco.nl/tools/${slug}`
      }
    };
  }

  // description trimmen voor og:description (zonder markdown rommel)
  const cleanDesc = meta.description
    .replace(/[#*_`>\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

  return {
    title: meta.title,
    description: meta.tagline || cleanDesc,
    openGraph: {
      title: meta.title,
      description: meta.tagline || cleanDesc,
      url: `https://toolshub.hazenco.nl/tools/${slug}`,
      type: "article",
      images: meta.heroImageUrl
        ? [
            {
              url: meta.heroImageUrl,
              width: 1200,
              height: 630,
              alt: meta.title
            }
          ]
        : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.tagline || cleanDesc,
      images: meta.heroImageUrl ? [meta.heroImageUrl] : undefined
    }
  };
}

export default function ToolDetailPage() {
  return <ToolDetailClient />;
}
