import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/types";
import { blogCategoryLabel, formatBlogDate } from "@/lib/blog/format";
import { UI } from "@/lib/constants/ui-strings";

type BlogPostCardProps = {
  post: BlogPostSummary;
};

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl">
      <div>
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
          <span className="font-bold uppercase text-[#4a2c2a]/60">
            {blogCategoryLabel(post.category)}
          </span>
          <span aria-hidden>•</span>
          <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
        </div>
        <h2 className="font-serif text-2xl font-bold leading-tight text-[#4a2c2a]">
          <Link
            href={`/bai-viet/${post.slug}`}
            className="transition-colors hover:text-[#d4af37]"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 line-clamp-3 text-gray-600">{post.excerpt}</p>
      </div>
      <div className="mt-6">
        {post.tags.length > 0 ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded bg-[#fef3c7]/40 px-2 py-1 text-[10px] text-[#4a2c2a]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <Link
          href={`/bai-viet/${post.slug}`}
          className="inline-flex items-center text-sm font-bold text-[#4a2c2a] transition-transform hover:translate-x-1"
        >
          {UI.BLOG_READ_MORE}
          <span className="ml-2" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
