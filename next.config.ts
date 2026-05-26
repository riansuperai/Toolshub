import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  trailingSlash: true,
  turbopack: {
    root: process.cwd()
  }
};

export default nextConfig;
