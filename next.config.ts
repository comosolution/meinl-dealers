import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [new URL("https://meinlcymbals.com/**")],
  },
};

export default nextConfig;
