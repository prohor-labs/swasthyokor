import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  allowedDevOrigins: ["79.143.185.101"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.ghorerbazar.com",
      },
      {
        protocol: "https",
        hostname: "cdn.prohor.dev",
      },
      {
        protocol: "https",
        hostname: "storage.prohor.dev",
      },
      {
        protocol: "https",
        hostname: "*.storage.prohor.dev",
      },
      {
        protocol: "https",
        hostname: "*.storage.c-6.us-east-2.aws.neon.tech",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
