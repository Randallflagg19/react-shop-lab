import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://i.imgur.com/**"),
      new URL("https://picsum.photos/**"),
      new URL("https://placehold.co/**"),
    ],
  },
};

export default nextConfig;
