import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog/types";
import { blogCategoryLabel, formatBlogDate } from "@/lib/blog/format";
import { UI } from "@/lib/constants/ui-strings";

type BlogRelatedPostsProps = {
  posts: BlogPostSummary[];
  categoryHref: string;
  categoryLabel: string;
};

export default function BlogRelatedPosts({
  posts,
  categoryHref,
  categoryLabel,
}: BlogRelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section
      className="mt-12 border-t border-[#d4c3c1]/50 pt-10"
      aria-labelledby="blog-related-heading"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2
          id="blog-related-heading"
          className="font-serif text-xl font-bold text-[#4a2c2a] md:text-2xl"
        >
          {UI.BLOG_RELATED_TITLE}
        </h2>
        <Link
          href={categoryHref}
          className="text-sm font-semibold text-[#944a00] underline-offset-2 hover:underline"
        >
          {UI.BLOG_CATEGORY_MORE}: {categoryLabel} →
        </Link>
      </div>
      <ul className="grid gap-4 md:grid-cols-3">
        {posts.map((item) => (
          <li key={item.id}>
            <article className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <p className="text-xs text-[#504443]/70">
                <span className="font-semibold uppercase text-[#4a2c2a]/60">
                  {blogCategoryLabel(item.category)}
                </span>
                <span aria-hidden className="mx-1.5">
                  •
                </span>
                <time dateTime={item.publishedAt}>
                  {formatBlogDate(item.publishedAt)}
                </time>
              </p>
              <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-[#4a2c2a]">
                <Link
                  href={`/bai-viet/${item.slug}`}
                  className="transition-colors hover:text-[#d4af37]"
                >
                  {item.title}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-2 flex-1 text-sm text-[#504443]">
                {item.excerpt}
              </p>
              <Link
                href={`/bai-viet/${item.slug}`}
                className="mt-4 inline-flex text-sm font-bold text-[#4a2c2a]"
              >
                {UI.BLOG_READ_MORE} →
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
