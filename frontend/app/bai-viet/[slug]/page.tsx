import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import BlogArticle from "@/components/blog/BlogArticle";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { fetchBlogPost, fetchBlogSlugs } from "@/lib/blog/server-api";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";
import { BT } from "@/lib/constants/ui-theme";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await fetchBlogSlugs();
  return (slugs ?? []).map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return createMetadata({ title: UI.PAGE_TITLE, description: UI.PAGE_DESCRIPTION, path: "/bai-viet" });

  return createMetadata({
    title: post.title,
    description: post.metaDescription,
    path: `/bai-viet/${post.slug}`,
    keywords: post.tags,
    type: "article",
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    pageType: "article",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  return (
    <PublicDocPageShell
      title={post.title}
      subtitle={post.metaDescription}
      backHref="/bai-viet"
    >
      <SeoSchemas
        path={`/bai-viet/${post.slug}`}
        title={post.title}
        headline={post.title}
        description={post.metaDescription}
        pageType="article"
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        keywords={post.tags}
      />
      <div className="space-y-4">
        <Link
          href="/bai-viet"
          className={`inline-block text-sm ${BT.mutedOnLight} hover:text-neutral-800 hover:underline`}
        >
          ← {UI.BLOG_BACK_TO_LIST}
        </Link>
        <BlogArticle post={post} />
      </div>
    </PublicDocPageShell>
  );
}

export const revalidate = 3600;
