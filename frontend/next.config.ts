import type { NextConfig } from "next";
import { BLOG_MERGED_SLUGS } from "./lib/blog/redirects";

const nextConfig: NextConfig = {
  // Blog SSG gọi Nest API (pool DB nhỏ). Giới hạn song song để build không làm API “đơ”.
  experimental: {
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 50,
  },
  async redirects() {
    return Object.entries(BLOG_MERGED_SLUGS).map(([from, to]) => ({
      source: `/bai-viet/${from}`,
      destination: `/bai-viet/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
