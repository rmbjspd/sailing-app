import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  // better-sqlite3 is a native Node addon; keep it out of the server bundle.
  serverExternalPackages: ["better-sqlite3"],
  experimental: {
    // React <ViewTransition> integration — page cross-fades on navigation.
    viewTransition: true,
  },
};

export default nextConfig;
