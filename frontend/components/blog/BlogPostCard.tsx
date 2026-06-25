import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/types";
import { blogCategoryLabel, formatBlogDate } from "@/lib/blog/format";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

type BlogPostCardProps = {
  post: BlogPostSummary;
};

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="rounded-xl border border-amber-200/60 bg-white p-4 shadow-sm">
      <p className={`text-xs font-medium ${BT.mutedOnLight}`}>
        {blogCategoryLabel(post.category)} · {formatBlogDate(post.publishedAt)}
      </p>
      <h2 className="mt-2 text-base font-semibold text-neutral-900">
        <Link
          href={`/bai-viet/${post.slug}`}
          className="hover:text-amber-900 hover:underline"
        >
          {post.title}
        </Link>
      </h2>
      <p className={`mt-2 line-clamp-3 text-sm leading-relaxed ${BT.mutedOnLight}`}>
        {post.excerpt}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-900"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/bai-viet/${post.slug}`}
        className={`mt-3 inline-block text-sm font-medium text-amber-800 hover:underline`}
      >
        {UI.BLOG_READ_MORE} →
      </Link>
    </article>
  );
}
