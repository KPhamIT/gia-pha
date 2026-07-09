import Link from "next/link";
import type { BlogPost, BlogPostSummary } from "@/lib/blog/types";
import { blogCategoryLabel } from "@/lib/blog/format";
import { UI } from "@/lib/constants/ui-strings";
import BlogRelatedPosts from "./BlogRelatedPosts";

type BlogArticleProps = {
  post: BlogPost;
  relatedPosts?: BlogPostSummary[];
};

export default function BlogArticle({ post, relatedPosts = [] }: BlogArticleProps) {
  const categoryHref = `/bai-viet?category=${post.category}`;
  const categoryLabel = blogCategoryLabel(post.category);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div
        className="blog-prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags.length > 0 ? (
        <footer className="mt-10 border-t border-[#d4c3c1]/40 pt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#4a2c2a]/60">
            {UI.BLOG_TAGS_LABEL}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <span className="rounded-lg bg-[#fef3c7]/50 px-2.5 py-1 text-xs text-[#4a2c2a]">
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        </footer>
      ) : null}

      <aside className="mt-10 rounded-2xl border border-[#d4af37]/25 bg-gradient-to-br from-[#fef3c7]/60 to-white p-6 shadow-sm md:p-8">
        <h2 className="font-serif text-xl font-bold text-[#4a2c2a] md:text-2xl">
          {UI.BLOG_RELATED_CTA_TITLE}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#504443] md:text-base">
          {UI.BLOG_RELATED_CTA_BODY}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/tao-dong-ho"
            className="inline-flex items-center justify-center rounded-xl bg-[#4a2c2a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#321716]"
          >
            {UI.BLOG_RELATED_CTA_BUTTON}
          </Link>
          <Link
            href="/huong-dan"
            className="inline-flex items-center justify-center rounded-xl border border-[#d4c3c1] bg-white px-5 py-2.5 text-sm font-semibold text-[#4a2c2a] transition-colors hover:bg-[#fcf9f4]"
          >
            {UI.BLOG_GUIDE_LINK}
          </Link>
        </div>
      </aside>

      <BlogRelatedPosts
        posts={relatedPosts}
        categoryHref={categoryHref}
        categoryLabel={categoryLabel}
      />

      <p className="mt-10 text-center">
        <Link
          href="/bai-viet"
          className="text-sm font-semibold text-[#944a00] underline-offset-2 hover:underline"
        >
          ← {UI.BLOG_BACK_TO_LIST}
        </Link>
      </p>
    </div>
  );
}
