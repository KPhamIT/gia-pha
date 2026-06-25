import axiosClient from "@/lib/axiosClient";
import { API_ROUTES } from "@/lib/constants/api-routes";
import type {
  BlogPostAdmin,
  BlogPostAdminSummary,
  BlogPostInput,
} from "@/lib/blog/types";

export const blog = {
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
