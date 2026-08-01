import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: isGitHubPages ? "export" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: isGitHubPages,
};

export default nextConfig;
