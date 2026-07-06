"use client";

import SystemSubpageShell from "@/components/system/SystemSubpageShell";
import BlogAdminSection from "@/components/system/BlogAdminSection";
import { UI } from "@/lib/constants/ui-strings";

export default function SystemBlogPageView() {
  return (
    <SystemSubpageShell
      layoutTitle={UI.BLOG_ADMIN_TAB}
      title={UI.BLOG_ADMIN_TAB}
      subtitle={UI.SYSTEM_CONSOLE_SUBTITLE}
    >
      <BlogAdminSection variant="landing" />
    </SystemSubpageShell>
  );
}
