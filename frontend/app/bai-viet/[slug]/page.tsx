import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticle from "@/components/blog/BlogArticle";
import BlogArticleHero from "@/components/blog/BlogArticleHero";
import BlogArticlePageView from "@/components/blog/BlogArticlePageView";
import SeoSchemas from "@/components/seo/SeoSchemas";
import {
  fetchBlogPost,
  fetchBlogPostsPage,
  fetchBlogSlugs,
} from "@/lib/blog/server-api";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";

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
  if (!post) {
    return createMetadata({
      title: UI.PAGE_TITLE,
      description: UI.PAGE_DESCRIPTION,
      path: "/bai-viet",
    });
  }

  return createMetadata({
    title: post.title,
    titleAbsolute: true,
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

  const breadcrumbs = breadcrumbsFromPath(`/bai-viet/${post.slug}`, post.title);

  const relatedResult = await fetchBlogPostsPage({
    category: post.category,
    page: 1,
    limit: 4,
  });
  const relatedPosts = (relatedResult?.items ?? [])
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return (
    <BlogArticlePageView>
      <SeoSchemas
        path={`/bai-viet/${post.slug}`}
        title={post.title}
        headline={post.title}
        description={post.metaDescription}
        pageType="article"
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        keywords={post.tags}
        breadcrumbs={breadcrumbs}
      />
      <article>
        <BlogArticleHero post={post} breadcrumbs={breadcrumbs} />
        <div className="bg-[#fcf9f4] px-4 py-8 md:-mt-6 md:rounded-t-[3rem] md:px-10 md:pb-16 md:pt-12 md:shadow-2xl">
          <BlogArticle post={post} relatedPosts={relatedPosts} />
        </div>
      </article>
    </BlogArticlePageView>
  );
}

export const revalidate = 3600;
