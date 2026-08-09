import { networkInterfaces } from "node:os";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const activeLanOrigins = Object.values(networkInterfaces())
  .flatMap((addresses) => addresses ?? [])
  .filter((address) => address.family === "IPv4" && !address.internal)
  .map((address) => address.address);

/** @type {import("next").NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", ...activeLanOrigins],
  devIndicators: false,
  output: isGitHubPages ? "export" : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: isGitHubPages,
};

export default nextConfig;
