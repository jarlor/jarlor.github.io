import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.16.2.49", "127.0.0.1", "localhost"],
  devIndicators: false,
  output: isGitHubPages ? "export" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: isGitHubPages,
  typescript: {
    tsconfigPath: isGitHubPages ? "./tsconfig.pages.json" : "./tsconfig.json",
  },
};

export default nextConfig;
