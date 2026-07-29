import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  trailingSlash: true,
  turbopack: {
    root: process.cwd()
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**"
      }
    ]
  },
  async redirects() {
    return [
      // ==================================================================
      // 1. Marketplace-era URLs (oude Toolshub) → nieuwe agency-structuur
      // ==================================================================
      { source: "/tools", destination: "/oplossingen", permanent: true },
      { source: "/tools/:slug", destination: "/oplossingen/:slug", permanent: true },
      { source: "/checkout", destination: "/contact", permanent: true },
      { source: "/creators", destination: "/over-ons", permanent: true },
      { source: "/creators/:handle", destination: "/oplossingen", permanent: true },

      // App-routes voor bezoekers weggehaald — leiden naar contact
      { source: "/account", destination: "/contact", permanent: true },
      { source: "/account/:path*", destination: "/contact", permanent: true },
      { source: "/seller", destination: "/contact", permanent: true },
      { source: "/seller/:path*", destination: "/contact", permanent: true },
      { source: "/admin", destination: "/contact", permanent: true },
      { source: "/admin/:path*", destination: "/contact", permanent: true },
      { source: "/onboarding", destination: "/contact", permanent: true },

      // ==================================================================
      // 2. WordPress-migratie: computerhulp (B2C) → TechPanda
      //
      // KRITIEK: deze redirects draaiden voorheen op de WordPress
      // Redirection-plugin. Die stopt bij de DNS-cutover, dus ze moeten
      // hier staan. TechPanda spiegelt de volledige /computerhulp/ tree,
      // dus een wildcard volstaat (geverifieerd 2026-07-29).
      // ==================================================================
      {
        source: "/computerhulp",
        destination: "https://techpanda.nl/computerhulp/",
        permanent: true
      },
      {
        // Trailing slash in de destination scheelt een extra hop: TechPanda
        // draait ook op trailingSlash en zou anders zelf nog eens 308'en.
        source: "/computerhulp/:path*",
        destination: "https://techpanda.nl/computerhulp/:path*/",
        permanent: true
      },
      // Losse B2C-servicepagina's zonder 1-op-1 equivalent → computerhulp-hub
      {
        source: "/hulp-op-afstand",
        destination: "https://techpanda.nl/computerhulp/",
        permanent: true
      },
      {
        source: "/maak-afspraak-2",
        destination: "https://techpanda.nl/computerhulp/",
        permanent: true
      },
      {
        source: "/tarieven",
        destination: "https://techpanda.nl/computerhulp/",
        permanent: true
      },
      {
        source: "/pricing-plan",
        destination: "https://techpanda.nl/computerhulp/",
        permanent: true
      },

      // ==================================================================
      // 3. WordPress WooCommerce-shop (B2C) → TechPanda catalogus
      // ==================================================================
      { source: "/shop", destination: "https://techpanda.nl/catalogus", permanent: true },
      { source: "/winkel", destination: "https://techpanda.nl/catalogus", permanent: true },
      { source: "/winkelwagen", destination: "https://techpanda.nl/catalogus", permanent: true },
      { source: "/afrekenen", destination: "https://techpanda.nl/catalogus", permanent: true },
      { source: "/mijn-account", destination: "https://techpanda.nl/catalogus", permanent: true },
      { source: "/catalogus", destination: "/oplossingen", permanent: true },

      // ==================================================================
      // 4. WordPress blog-posts + archieven → nieuwe blog
      //
      // De 7 bestaande posts zijn Engelstalige theme-demo content zonder
      // Nederlandse tegenhanger; die bundelen we op de blog-index.
      // ==================================================================
      { source: "/hello-world", destination: "/blog", permanent: true },
      { source: "/art-of-website-design-crafting-engaging-experiences", destination: "/blog", permanent: true },
      { source: "/the-basics-of-blogging-search-engine-optimization", destination: "/blog", permanent: true },
      { source: "/elevating-businesses-to-become-success", destination: "/blog", permanent: true },
      { source: "/optimizing-your-content-for-voice-activated-devices", destination: "/blog", permanent: true },
      { source: "/how-chatbots-can-help-you-drive-more-sales-today", destination: "/blog", permanent: true },
      { source: "/how-to-use-color-theory-to-influence-consumer-behavior", destination: "/blog", permanent: true },
      { source: "/category/:slug", destination: "/blog", permanent: true },
      { source: "/author/:slug", destination: "/over-ons", permanent: true },

      // ==================================================================
      // 5. WordPress theme-demo restanten → home
      // ==================================================================
      { source: "/team", destination: "/over-ons", permanent: true },
      { source: "/team-details", destination: "/over-ons", permanent: true },
      { source: "/testimonials", destination: "/cases", permanent: true },
      { source: "/project", destination: "/cases", permanent: true },
      { source: "/civiele-engineering", destination: "/", permanent: true },
      { source: "/coming-soon", destination: "/", permanent: true },
      { source: "/sample-page", destination: "/", permanent: true },
      { source: "/test-pagina-hazenco", destination: "/", permanent: true },
      { source: "/404-error", destination: "/", permanent: true }
    ];
  }
};

export default nextConfig;
