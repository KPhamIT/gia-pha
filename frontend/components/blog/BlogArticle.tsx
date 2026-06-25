import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { blogCategoryLabel, formatBlogDate } from "@/lib/blog/format";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

type BlogArticleProps = {
  post: BlogPost;
};

export default function BlogArticle({ post }: BlogArticleProps) {
  return (
    <article className="space-y-6">
      <header className="space-y-3 border-b border-amber-100 pb-4">
        <p className={`text-xs font-medium ${BT.mutedOnLight}`}>
          {blogCategoryLabel(post.category)}
        </p>
        <h1 className="text-xl font-bold leading-snug text-neutral-900 md:text-2xl">
          {post.title}
        </h1>
        <p className={`text-xs ${BT.mutedOnLight}`}>
          {UI.BLOG_PUBLISHED_AT} {formatBlogDate(post.publishedAt)}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs text-amber-900"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div
        className="blog-prose space-y-4 text-sm leading-relaxed text-neutral-800"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <aside className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
        <h2 className="text-sm font-semibold text-amber-950">
          {UI.BLOG_RELATED_CTA_TITLE}
        </h2>
        <p className={`mt-1 text-sm ${BT.mutedOnLight}`}>{UI.BLOG_RELATED_CTA_BODY}</p>
        <Link
          href="/tao-dong-ho"
          className={`${BT.btnBase} ${BT.btnSm} ${BT.btnGold} mt-3 inline-flex`}
        >
          {UI.BLOG_RELATED_CTA_BUTTON}
        </Link>
      </aside>
    </article>
  );
}
