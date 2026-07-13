import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Blog SSG gọi Nest API (pool DB nhỏ). Giới hạn song song để build không làm API “đơ”.
  experimental: {
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 50,
  },
};

export default nextConfig;
