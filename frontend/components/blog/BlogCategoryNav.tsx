import Link from "next/link";
import { BLOG_CATEGORIES } from "@/lib/constants/ui-strings/blog";
import { blogCategoryLabel } from "@/lib/blog/format";
import type { BlogCategory } from "@/lib/blog/types";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

type BlogCategoryNavProps = {
  active?: BlogCategory;
};

export default function BlogCategoryNav({ active }: BlogCategoryNavProps) {
  return (
    <nav
      className="flex flex-wrap gap-2"
      aria-label={UI.BLOG_ALL_CATEGORIES}
    >
      <CategoryLink href="/bai-viet" active={!active}>
        {UI.BLOG_ALL_CATEGORIES}
      </CategoryLink>
      {BLOG_CATEGORIES.map((category) => (
        <CategoryLink
          key={category}
          href={`/bai-viet?category=${category}`}
          active={active === category}
        >
          {blogCategoryLabel(category)}
        </CategoryLink>
      ))}
    </nav>
  );
}

function CategoryLink({
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
      className={
        active
          ? `${BT.btnBase} ${BT.btnSm} ${BT.btnGold}`
          : `${BT.btnBase} ${BT.btnSm} ${BT.btnOutline} border-amber-200/60`
      }
    >
      {children}
    </Link>
  );
}
