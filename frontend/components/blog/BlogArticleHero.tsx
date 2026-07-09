import Link from "next/link";
import type { BlogPost } from "@/lib/blog/types";
import { blogCategoryLabel, formatBlogDate } from "@/lib/blog/format";
import { UI } from "@/lib/constants/ui-strings";
import BlogArticleBreadcrumb from "./BlogArticleBreadcrumb";
import type { BreadcrumbItem } from "@/lib/seo/types";

type BlogArticleHeroProps = {
  post: BlogPost;
  breadcrumbs: BreadcrumbItem[];
};

function MetaRow({ post }: { post: BlogPost }) {
  const showUpdated = post.updatedAt !== post.publishedAt;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/75">
      <time dateTime={post.publishedAt}>
        {UI.BLOG_PUBLISHED_AT} {formatBlogDate(post.publishedAt)}
      </time>
      {showUpdated ? (
        <>
          <span aria-hidden>•</span>
          <time dateTime={post.updatedAt}>
            {UI.BLOG_UPDATED_AT} {formatBlogDate(post.updatedAt)}
          </time>
        </>
      ) : null}
    </div>
  );
}

export default function BlogArticleHero({
  post,
  breadcrumbs,
}: BlogArticleHeroProps) {
  const categoryHref = `/bai-viet?category=${post.category}`;
  const lead = post.excerpt || post.metaDescription;

  return (
    <header className="bg-[#4a2c2a] text-white">
      <div className="px-4 pb-8 pt-20 md:px-10 md:py-12">
        <div className="mb-4 md:mb-6">
          <BlogArticleBreadcrumb items={breadcrumbs} variant="light" />
        </div>
        <Link
          href={categoryHref}
          className="inline-flex rounded-full border border-[#d4af37]/35 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#fef3c7] transition-colors hover:bg-white/15"
        >
          {blogCategoryLabel(post.category)}
        </Link>
        <h1 className="mt-4 font-serif text-2xl font-bold leading-tight tracking-tight md:mt-5 md:text-4xl md:leading-tight">
          {post.title}
        </h1>
        {lead ? (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:mt-5 md:text-lg">
            {lead}
          </p>
        ) : null}
        <div className="mt-5 md:mt-6">
          <MetaRow post={post} />
        </div>
      </div>
    </header>
  );
}
