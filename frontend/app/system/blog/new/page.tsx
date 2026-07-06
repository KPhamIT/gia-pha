import type { Metadata } from "next";
import SystemBlogFormPageView from "@/components/system/SystemBlogFormPageView";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.BLOG_ADMIN_CREATE,
  description: UI.BLOG_ADMIN_TAB,
  path: "/system/blog/new",
});

export default function SystemBlogCreatePage() {
  return <SystemBlogFormPageView />;
}
