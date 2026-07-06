"use client";

import Link from "next/link";
import { AC } from "@/components/auth/account-theme";
import { useBlogAdmin } from "@/hooks/useBlogAdmin";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import BlogPostAdminCard from "./BlogPostAdminCard";

type Props = {
  variant?: "book" | "landing";
};

export default function BlogAdminSection({ variant = "book" }: Props) {
  const blog = useBlogAdmin();
  const isLanding = variant === "landing";
  const loadingClass = isLanding ? AC.muted : BT.mutedOnDark;
  const errorClass = isLanding
    ? "rounded-lg bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]"
    : BT.errorBg;
  const panelClass = isLanding
    ? `${AC.card} divide-y divide-[#d4c3c1]`
    : `divide-y divide-amber-100 ${BT.panel}`;

  if (blog.loading) {
    return <p className={`text-sm ${loadingClass}`}>{UI.LOADING}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isLanding ? (
          <Link
            href="/system/blog/new"
            className="rounded-xl bg-[#321716] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#4a2a28] active:scale-95"
          >
            {UI.BLOG_ADMIN_CREATE}
          </Link>
        ) : (
          <Link
            href="/system/blog/new"
            className={`${BT.btnBase} ${BT.btnCompact} ${BT.btnGold}`}
          >
            {UI.BLOG_ADMIN_CREATE}
          </Link>
        )}
      </div>

      {blog.error ? <p className={errorClass}>{blog.error}</p> : null}

      {blog.items.length === 0 ? (
        <p className={`text-sm ${loadingClass}`}>{UI.BLOG_ADMIN_EMPTY}</p>
      ) : (
        <ul className={panelClass}>
          {blog.items.map((post) => (
            <BlogPostAdminCard
              key={post.id}
              post={post}
              variant={variant}
              onDelete={blog.remove}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
