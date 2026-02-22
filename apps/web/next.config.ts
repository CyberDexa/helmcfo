import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@chiefcfo/shared"],
};

export default nextConfig;
