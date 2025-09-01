import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      new URL("https://meinlcymbals.com/**"),
      new URL("https://media.meinl.de/**"),
    ],
  },
};

export default nextConfig;
