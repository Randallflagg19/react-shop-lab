import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://kmj65yri.eu-central.insforge.app/api/storage/buckets/product-photos/objects/**",
      ),
    ],
  },
};

export default nextConfig;
