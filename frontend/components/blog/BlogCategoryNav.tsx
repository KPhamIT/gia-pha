import Link from "next/link";
import { BLOG_CATEGORIES } from "@/lib/constants/ui-strings/blog";
import { blogCategoryLabel } from "@/lib/blog/format";
import type { BlogCategory } from "@/lib/blog/types";
import { UI } from "@/lib/constants/ui-strings";

type BlogCategoryNavProps = {
  active?: BlogCategory;
};

export default function BlogCategoryNav({ active }: BlogCategoryNavProps) {
  return (
    <nav
      className="mb-8 flex flex-wrap gap-3 md:mb-10"
      aria-label={UI.BLOG_ALL_CATEGORIES}
    >
      <CategoryChip href="/bai-viet" active={!active}>
        {UI.BLOG_ALL_CATEGORIES}
      </CategoryChip>
      {BLOG_CATEGORIES.map((category) => (
        <CategoryChip
          key={category}
          href={`/bai-viet?category=${category}`}
          active={active === category}
        >
          {blogCategoryLabel(category)}
        </CategoryChip>
      ))}
    </nav>
  );
}

function CategoryChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
        active
          ? "border border-[#d4af37]/30 bg-[#fef3c7] text-[#4a2c2a] shadow-sm"
          : "border border-gray-200 bg-white text-[#4a2c2a]/70 hover:border-[#d4af37]/50 hover:bg-[#fef3c7]/20"
      }`}
    >
      {children}
    </Link>
  );
}
