"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BlogPostCard from "@/components/blog/BlogPostCard";
import LoadingSpinner from "@/components/icons/LoadingSpinner";
import { api } from "@/lib/api";
import { BLOG_MOBILE_PAGE_SIZE } from "@/lib/blog/constants";
import type { BlogCategory, BlogPostListResponse } from "@/lib/blog/types";
import { UI } from "@/lib/constants/ui-strings";

type BlogListMobileInfiniteProps = {
  initial: BlogPostListResponse;
  category?: BlogCategory;
};

export default function BlogListMobileInfinite({
  initial,
  category,
}: BlogListMobileInfiniteProps) {
  const [posts, setPosts] = useState(initial.items);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initial.items.length < initial.total);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosts(initial.items);
    setPage(1);
    setHasMore(initial.items.length < initial.total);
  }, [initial]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await api.blog.listPublic({
        category,
        page: nextPage,
        limit: BLOG_MOBILE_PAGE_SIZE,
      });
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        for (const item of result.items) {
          if (!seen.has(item.id)) merged.push(item);
        }
        setHasMore(merged.length < result.total);
        return merged;
      });
      setPage(nextPage);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [category, hasMore, loading, page]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <>
      <div className="grid grid-cols-1 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      {hasMore ? (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {loading ? (
            <LoadingSpinner size={28} label={UI.BLOG_LOADING_MORE} />
          ) : (
            <span className="sr-only">{UI.BLOG_LOADING_MORE}</span>
          )}
        </div>
      ) : null}
    </>
  );
}
