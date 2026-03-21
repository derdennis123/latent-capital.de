import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/ghost",
        destination: "/",
        permanent: false,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
