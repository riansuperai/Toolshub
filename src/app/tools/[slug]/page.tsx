import { listings } from "@/lib/marketplace-data";
import { ToolDetailClient } from "./tool-detail-client";

export function generateStaticParams() {
  return listings.map((listing) => ({
    slug: listing.slug
  }));
}

export default function ToolDetailPage() {
  return <ToolDetailClient />;
}
