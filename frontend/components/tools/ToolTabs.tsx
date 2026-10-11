import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";

type ToolKey = (typeof UI.TOOLS_LIST)[number]["key"];

/** Thanh tab chuyển giữa các công cụ — mỗi tab là một trang riêng (tốt cho SEO). */
export default function ToolTabs({ active }: { active?: ToolKey }) {
  return (
    <nav aria-label={UI.TOOLS_NAV} className="border-b border-[#e7ddd2] bg-[#fcf9f4] px-4 md:px-10">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {UI.TOOLS_LIST.map((tool) => {
          const current = tool.key === active;
          return (
            <li key={tool.key} className="shrink-0">
              <Link
                href={tool.href}
                aria-current={current ? "page" : undefined}
                className={`block border-b-2 px-4 py-3 text-sm font-semibold transition ${
                  current
                    ? "border-[#944a00] text-[#321716]"
                    : "border-transparent text-[#827472] hover:border-[#d4c3c1] hover:text-[#321716]"
                }`}
              >
                {tool.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
