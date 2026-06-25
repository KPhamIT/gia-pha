"use client";

import Link from "next/link";
import { useBlogAdmin } from "@/hooks/useBlogAdmin";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import BlogPostAdminCard from "./BlogPostAdminCard";

export default function BlogAdminSection() {
  const blog = useBlogAdmin();

  if (blog.loading) {
    return <p className={`text-sm ${BT.mutedOnDark}`}>{UI.LOADING}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link
          href="/system/blog/new"
          className={`${BT.btnBase} ${BT.btnCompact} ${BT.btnGold}`}
        >
          {UI.BLOG_ADMIN_CREATE}
        </Link>
      </div>

      {blog.error ? <p className={BT.errorBg}>{blog.error}</p> : null}

      {blog.items.length === 0 ? (
        <p className={`text-sm ${BT.mutedOnDark}`}>{UI.BLOG_ADMIN_EMPTY}</p>
      ) : (
        <ul className={`divide-y divide-amber-100 ${BT.panel}`}>
          {blog.items.map((post) => (
            <BlogPostAdminCard key={post.id} post={post} onDelete={blog.remove} />
          ))}
        </ul>
      )}
    </div>
  );
}
