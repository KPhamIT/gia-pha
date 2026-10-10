import type { ReactNode } from "react";
import BlogArticleBreadcrumb from "@/components/blog/BlogArticleBreadcrumb";
import type { BreadcrumbItem } from "@/lib/seo/types";

type VanKhanHeroProps = {
  title: string;
  lead?: string;
  breadcrumbs: BreadcrumbItem[];
  footer?: ReactNode;
};

/** Dải tiêu đề tối màu — đồng bộ với hero bài viết. */
export default function VanKhanHero({ title, lead, breadcrumbs, footer }: VanKhanHeroProps) {
  return (
    <header className="bg-[#4a2c2a] text-white">
      <div className="px-4 pb-8 pt-20 md:px-10 md:py-12">
        <div className="mb-4 md:mb-6">
          <BlogArticleBreadcrumb items={breadcrumbs} variant="light" />
        </div>
        <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight md:text-4xl md:leading-tight">
          {title}
        </h1>
        {lead ? (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/80 md:mt-5 md:text-lg">
            {lead}
          </p>
        ) : null}
        {footer ? <div className="mt-5 text-sm text-white/75">{footer}</div> : null}
      </div>
    </header>
  );
}
