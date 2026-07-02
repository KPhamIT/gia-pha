import type { Metadata } from "next";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import BlogPostCard from "@/components/blog/BlogPostCard";
import BlogCategoryNav from "@/components/blog/BlogCategoryNav";
import SeoSchemas from "@/components/seo/SeoSchemas";
import { fetchBlogPosts } from "@/lib/blog/server-api";
import type { BlogCategory } from "@/lib/blog/types";
import { UI } from "@/lib/constants/ui-strings";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: UI.BLOG_LIST_TITLE,
  description: UI.BLOG_LIST_SUBTITLE,
  path: "/bai-viet",
  keywords: ["gia phả", "dòng họ", "SEO", "kiến thức gia phả"],
  pageType: "collection",
});

const VALID_CATEGORIES = new Set<BlogCategory>([
  "BASICS",
  "HOWTO",
  "CULTURE",
  "FAMILY_TREE",
  "ONLINE",
  "SEO",
]);

type BlogListPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { category: rawCategory } = await searchParams;
  const category = VALID_CATEGORIES.has(rawCategory as BlogCategory)
    ? (rawCategory as BlogCategory)
    : undefined;

  const posts = (await fetchBlogPosts(category)) ?? [];

  return (
    <PublicDocPageShell title={UI.BLOG_LIST_TITLE} subtitle={UI.BLOG_LIST_SUBTITLE}>
      <SeoSchemas
        path="/bai-viet"
        title={UI.BLOG_LIST_TITLE}
        description={UI.BLOG_LIST_SUBTITLE}
        pageType="collection"
      />
      <div className="space-y-6">
        <BlogCategoryNav active={category} />
        {posts.length === 0 ? (
          <p className="text-sm text-neutral-600">{UI.BLOG_EMPTY}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </PublicDocPageShell>
  );
}
