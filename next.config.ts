import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.clerk.com",
      },
    ],
  },
  experimental: {
    // Enable new Next.js features
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

export default nextConfig;
