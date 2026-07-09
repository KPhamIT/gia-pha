import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/types";

type BlogArticleBreadcrumbProps = {
  items: BreadcrumbItem[];
  variant?: "light" | "dark";
};

export default function BlogArticleBreadcrumb({
  items,
  variant = "dark",
}: BlogArticleBreadcrumbProps) {
  const muted =
    variant === "light" ? "text-white/65" : "text-[#504443]/65";
  const link =
    variant === "light"
      ? "text-white/85 underline-offset-2 hover:text-white hover:underline"
      : "text-[#504443] underline-offset-2 hover:text-[#4a2c2a] hover:underline";
  const current =
    variant === "light" ? "text-white/95" : "font-medium text-[#4a2c2a]";

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? (
                <span aria-hidden className={muted}>
                  ›
                </span>
              ) : null}
              {isLast ? (
                <span
                  aria-current="page"
                  className={`${current} line-clamp-1 max-w-[min(100%,20rem)] md:max-w-none`}
                >
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className={link}>
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
