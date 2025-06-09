import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,  // 👈 this ignores ESLint errors in `next build`
  },
};

export default nextConfig;
