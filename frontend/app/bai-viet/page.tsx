import type { Metadata } from "next";
import BlogCategoryNav from "@/components/blog/BlogCategoryNav";
import BlogListBoard from "@/components/blog/BlogListBoard";
import BlogListHero from "@/components/blog/BlogListHero";
import BlogListPageView from "@/components/blog/BlogListPageView";
import SeoSchemas from "@/components/seo/SeoSchemas";
import {
  BLOG_DESKTOP_PAGE_SIZE,
  BLOG_MOBILE_PAGE_SIZE,
} from "@/lib/blog/constants";
import { fetchBlogPostsPage } from "@/lib/blog/server-api";
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
  searchParams: Promise<{ category?: string; page?: string }>;
};

function parsePage(value?: string): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { category: rawCategory, page: rawPage } = await searchParams;
  const category = VALID_CATEGORIES.has(rawCategory as BlogCategory)
    ? (rawCategory as BlogCategory)
    : undefined;
  const desktopPage = parsePage(rawPage);

  const [mobileInitial, desktopResult] = await Promise.all([
    fetchBlogPostsPage({
      category,
      page: 1,
      limit: BLOG_MOBILE_PAGE_SIZE,
    }),
    fetchBlogPostsPage({
      category,
      page: desktopPage,
      limit: BLOG_DESKTOP_PAGE_SIZE,
    }),
  ]);

  const desktopData = desktopResult ?? {
    items: [],
    total: 0,
    page: desktopPage,
    pageSize: BLOG_DESKTOP_PAGE_SIZE,
    totalPages: 1,
  };
  const mobileData = mobileInitial ?? {
    items: [],
    total: 0,
    page: 1,
    pageSize: BLOG_MOBILE_PAGE_SIZE,
    totalPages: 1,
  };

  return (
    <BlogListPageView>
      <SeoSchemas
        path="/bai-viet"
        title={UI.BLOG_LIST_TITLE}
        description={UI.BLOG_LIST_SUBTITLE}
        pageType="collection"
      />
      <BlogListHero />
      <div className="bg-[#fcf9f4] px-4 py-8 md:-mt-6 md:rounded-t-[3rem] md:px-10 md:pb-16 md:pt-12 md:shadow-2xl">
        <p className="mb-6 text-sm italic leading-relaxed text-[#504443] md:hidden">
          {UI.BLOG_LIST_SUBTITLE}
        </p>
        <BlogCategoryNav active={category} />
        <BlogListBoard
          desktop={desktopData}
          mobileInitial={mobileData}
          category={category}
        />
      </div>
    </BlogListPageView>
  );
}
