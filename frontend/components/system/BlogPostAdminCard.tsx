"use client";

import Link from "next/link";
import { useState } from "react";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { BLOG_CATEGORY_LABELS } from "@/lib/constants/ui-strings/blog";
import type { BlogPostAdminSummary } from "@/lib/blog/types";
import { UI } from "@/lib/constants/ui-strings";

type BlogPostAdminCardProps = {
  post: BlogPostAdminSummary;
  onDelete: (id: number) => Promise<void>;
};

export default function BlogPostAdminCard({
  post,
  onDelete,
}: BlogPostAdminCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(UI.BLOG_ADMIN_DELETE_CONFIRM)) return;
    setDeleting(true);
    try {
      await onDelete(post.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <li className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-neutral-900">{post.title}</p>
        <p className="truncate text-xs text-neutral-500">/{post.slug}</p>
        <div className="mt-1 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-900">
            {BLOG_CATEGORY_LABELS[post.category]}
          </span>
          <span
            className={
              post.published
                ? "rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-800"
                : "rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600"
            }
          >
            {post.published ? UI.BLOG_ADMIN_PUBLISHED : UI.BLOG_ADMIN_DRAFT}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <Link href={`/system/blog/${post.id}`}>
          <IconRoundButton
            icon="edit"
            variant="outline"
            label={UI.BLOG_ADMIN_EDIT}
          />
        </Link>
        <IconRoundButton
          icon="trash"
          variant="danger"
          label={UI.BLOG_ADMIN_DELETE}
          loading={deleting}
          onClick={() => void handleDelete()}
        />
      </div>
    </li>
  );
}
