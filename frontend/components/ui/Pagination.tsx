import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";

const linkClass =
  "rounded-lg border border-[#4a2c2a]/20 px-4 py-2 text-sm font-medium text-[#4a2c2a] transition-colors hover:bg-[#4a2c2a]/5";
const disabledClass =
  "rounded-lg border border-transparent px-4 py-2 text-sm text-gray-400";

export type PaginationProps = {
  page: number;
  totalPages: number;
  /** Trả về href cho trang `page` (1-based). */
  buildHref: (page: number) => string;
  className?: string;
};

export default function Pagination({
  page,
  totalPages,
  buildHref,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevHref = page > 1 ? buildHref(page - 1) : null;
  const nextHref = page < totalPages ? buildHref(page + 1) : null;
  const label = UI.PAGE_LABEL(page, totalPages);

  return (
    <nav
      className={`flex items-center justify-center gap-4 ${className}`.trim()}
      aria-label={label}
    >
      {prevHref ? (
        <Link href={prevHref} className={linkClass}>
          {UI.PAGE_PREV}
        </Link>
      ) : (
        <span className={disabledClass}>{UI.PAGE_PREV}</span>
      )}
      <span className="text-sm font-medium text-[#504443]">{label}</span>
      {nextHref ? (
        <Link href={nextHref} className={linkClass}>
          {UI.PAGE_NEXT}
        </Link>
      ) : (
        <span className={disabledClass}>{UI.PAGE_NEXT}</span>
      )}
    </nav>
  );
}
