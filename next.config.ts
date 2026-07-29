import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  trailingSlash: true,
  turbopack: {
    root: process.cwd()
  },
  async redirects() {
    return [
      // Marketplace-era URLs redirect naar de nieuwe agency-structuur
      { source: "/catalogus", destination: "/oplossingen", permanent: true },
      { source: "/tools", destination: "/oplossingen", permanent: true },
      { source: "/tools/:slug", destination: "/oplossingen/:slug", permanent: true },
      { source: "/winkelwagen", destination: "/oplossingen", permanent: true },
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
      { source: "/onboarding", destination: "/contact", permanent: true }
    ];
  }
};

export default nextConfig;
