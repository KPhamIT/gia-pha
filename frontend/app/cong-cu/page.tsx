import type { Metadata } from "next";
import Link from "next/link";
import SeoSchemas from "@/components/seo/SeoSchemas";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";

const PATH = "/cong-cu";

export const metadata: Metadata = createMetadata({
  title: UI.TOOLS_TITLE,
  description: UI.TOOLS_META_DESC,
  path: PATH,
  keywords: ["công cụ gia phả", "xưng hô họ hàng", "xem tuổi làm nhà"],
  pageType: "collection",
});

export default function ToolsPage() {
  const breadcrumbs = breadcrumbsFromPath(PATH);

  return (
    <ToolPageShell title={UI.TOOLS_TITLE} lead={UI.TOOLS_LEAD} breadcrumbs={breadcrumbs}>
      <SeoSchemas
        path={PATH}
        title={UI.TOOLS_TITLE}
        description={UI.TOOLS_META_DESC}
        pageType="collection"
        breadcrumbs={breadcrumbs}
      />
      <ul className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
        {UI.TOOLS_LIST.map((tool) => (
          <li key={tool.key}>
            <Link
              href={tool.href}
              className="group flex h-full flex-col rounded-2xl border border-[#e7ddd2] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c99236] hover:shadow-md"
            >
              <h2 className="font-serif text-xl font-bold text-[#321716]">{tool.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#504443]">{tool.body}</p>
              <span className="mt-4 text-sm font-semibold text-[#944a00] group-hover:underline">
                {UI.TOOLS_OPEN} →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </ToolPageShell>
  );
}
