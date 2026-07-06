import BlogListMobileInfinite from "@/components/blog/BlogListMobileInfinite";
import BlogPostCard from "@/components/blog/BlogPostCard";
import Pagination from "@/components/ui/Pagination";
import type { BlogCategory, BlogPostListResponse } from "@/lib/blog/types";
import { UI } from "@/lib/constants/ui-strings";
import { buildPaginationHref } from "@/lib/pagination/build-href";

type BlogListBoardProps = {
  desktop: BlogPostListResponse;
  mobileInitial: BlogPostListResponse;
  category?: BlogCategory;
};

export default function BlogListBoard({
  desktop,
  mobileInitial,
  category,
}: BlogListBoardProps) {
  if (desktop.total === 0) {
    return <p className="text-sm text-[#504443]">{UI.BLOG_EMPTY}</p>;
  }

  return (
    <>
      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-6">
          {desktop.items.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
        <Pagination
          page={desktop.page}
          totalPages={desktop.totalPages}
          buildHref={(page) =>
            buildPaginationHref("/bai-viet", page, { category })
          }
          className="mt-12"
        />
      </div>
      <div className="md:hidden">
        <BlogListMobileInfinite initial={mobileInitial} category={category} />
      </div>
    </>
  );
}
