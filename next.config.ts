import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "**.convex.storage",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Performance: Better image optimization
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache images for 1 year
    formats: ['image/avif', 'image/webp'], // Modern image formats
    unoptimized: false, // Ensure optimization is enabled
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['convex/react', 'convex'], // Tree-shake unused Convex code
  },
  // Enable compression
  compress: true,
  // Reduce runtime JS
  poweredByHeader: false,
  // Enable SWR for API caching
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
