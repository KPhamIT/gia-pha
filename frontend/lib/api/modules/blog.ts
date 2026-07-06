import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";
import {
  BLOG_MOBILE_PAGE_SIZE,
} from "@/lib/blog/constants";
import type {
  BlogCategory,
  BlogPostAdmin,
  BlogPostAdminSummary,
  BlogPostInput,
  BlogPostListResponse,
} from "@/lib/blog/types";

export const blog = {
  listPublic: (params?: {
    category?: BlogCategory;
    page?: number;
    limit?: number;
  }) =>
    axiosClient
      .get<BlogPostListResponse>(API_ROUTES.BLOG, {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? BLOG_MOBILE_PAGE_SIZE,
          ...(params?.category ? { category: params.category } : {}),
        },
      })
      .then((r) => r.data),
  listAdmin: () =>
    axiosClient
      .get<BlogPostAdminSummary[]>(API_ROUTES.BLOG_ADMIN)
      .then((r) => r.data),
  getAdmin: (id: number) =>
    axiosClient
      .get<BlogPostAdmin>(API_ROUTES.BLOG_ADMIN_POST(id))
      .then((r) => r.data),
  create: (body: BlogPostInput) =>
    axiosClient
      .post<BlogPostAdmin>(API_ROUTES.BLOG_ADMIN, body)
      .then((r) => r.data),
  update: (id: number, body: Partial<BlogPostInput>) =>
    axiosClient
      .patch<BlogPostAdmin>(API_ROUTES.BLOG_ADMIN_POST(id), body)
      .then((r) => r.data),
  remove: (id: number) =>
    axiosClient.delete(API_ROUTES.BLOG_ADMIN_POST(id)).then((r) => r.data),
};
