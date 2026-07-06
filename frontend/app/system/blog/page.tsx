import type { Metadata } from "next";
import SystemBlogPageView from "@/components/system/SystemBlogPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.BLOG_ADMIN_TAB,
  description: UI.SYSTEM_CONSOLE_SUBTITLE,
  path: "/system/blog",
});

export default function SystemBlogPage() {
  return <SystemBlogPageView />;
}
