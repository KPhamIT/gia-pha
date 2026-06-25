import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import BlogArticle from "@/components/blog/BlogArticle";
import { fetchBlogPost, fetchBlogSlugs } from "@/lib/blog/server-api";
import { blogArticleJsonLd } from "@/lib/blog/json-ld";
import { UI } from "@/lib/constants/ui-strings";
import { getSiteUrl } from "@/lib/site-url";
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
  if (!post) return { title: UI.PAGE_TITLE };

  const url = `${getSiteUrl()}/bai-viet/${post.slug}`;
  return {
    title: `${post.title} | ${UI.PAGE_TITLE}`,
    description: post.metaDescription,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      locale: "vi_VN",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  const jsonLd = blogArticleJsonLd(post);

  return (
    <PublicDocPageShell
      title={post.title}
      subtitle={post.metaDescription}
      backHref="/bai-viet"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
