import type { MetadataRoute } from "next";

const BASE_URL = "https://toolshub.hazenco.nl";

/**
 * Robots.txt — laat alle bots toe en wijst hen naar de sitemap.
 * Bezoekbaar op /robots.txt zonder configuratie.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Auth-only routes uitsluiten van indexering wanneer die later komen
        disallow: ["/account", "/seller", "/admin", "/checkout", "/winkelwagen"]
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL
  };
}
