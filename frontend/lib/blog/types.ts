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

export type BlogSlugEntry = {
  slug: string;
  updatedAt: string;
  publishedAt: string;
};
