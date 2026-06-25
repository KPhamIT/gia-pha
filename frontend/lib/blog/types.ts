export type BlogCategory =
  | "BASICS"
  | "HOWTO"
  | "CULTURE"
  | "FAMILY_TREE"
  | "ONLINE"
  | "SEO";

export type BlogPostSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
};

export type BlogPost = BlogPostSummary & {
  content: string;
  metaDescription: string;
};

export type BlogPostAdminSummary = BlogPostSummary & {
  published: boolean;
  metaDescription: string;
};

export type BlogPostAdmin = BlogPost & {
  published: boolean;
};

export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaDescription: string;
  category: BlogCategory;
  tags: string[];
  published: boolean;
  publishedAt?: string;
};

export type BlogSlugEntry = {
  slug: string;
  updatedAt: string;
  publishedAt: string;
};
