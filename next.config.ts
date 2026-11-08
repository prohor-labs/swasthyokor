import type { NextConfig } from "next";

// Dynamically extract hostnames from S3 environment variables
const dynamicRemotePatterns: Array<{
  protocol: "http" | "https";
  hostname: string;
}> = [];

const envEndpoints = [
  process.env.S3_PUBLIC_URL,
  process.env.AWS_ENDPOINT_URL_S3,
].filter(Boolean);

for (const ep of envEndpoints) {
  try {
    const parsed = new URL(ep as string);
    const protocol =
      parsed.protocol === "http:" ? ("http" as const) : ("https" as const);
    dynamicRemotePatterns.push({
      protocol,
      hostname: parsed.hostname,
    });
  } catch {
    // Ignore invalid URLs
  }
}

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
    serverActions: {
      bodySizeLimit: "10mb",
    },
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
      {
        protocol: "https",
        hostname: "*.neon.tech",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      ...dynamicRemotePatterns,
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
