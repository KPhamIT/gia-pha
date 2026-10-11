import type { Metadata } from "next";
import Link from "next/link";
import SeoSchemas from "@/components/seo/SeoSchemas";
import ToolPageShell from "@/components/tools/ToolPageShell";
import BuildAgeTool from "@/components/xem-tuoi/BuildAgeTool";
import ScoringExplainer from "@/components/xem-tuoi/ScoringExplainer";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";

const PATH = "/cong-cu/xem-tuoi-lam-nha";

export const metadata: Metadata = createMetadata({
  title: UI.XT_TITLE,
  description: UI.XT_META_DESC,
  path: PATH,
  keywords: [
    "xem tuổi làm nhà",
    "tuổi làm nhà năm 2027",
    "kim lâu hoang ốc tam tai",
    "cách tính tuổi làm nhà",
    "mượn tuổi làm nhà",
  ],
});

export default function BuildAgePage() {
  const breadcrumbs = breadcrumbsFromPath(PATH);
  const faq = UI.XT_FAQ.map((item) => ({ ...item }));

  return (
    <ToolPageShell
      title={UI.XT_TITLE}
      lead={UI.XT_LEAD}
      breadcrumbs={breadcrumbs}
      active="xem-tuoi-lam-nha"
    >
      <SeoSchemas
        path={PATH}
        title={UI.XT_TITLE}
        description={UI.XT_META_DESC}
        breadcrumbs={breadcrumbs}
        faq={faq}
      />
      <div className="mx-auto max-w-4xl">
        <BuildAgeTool />
        <p className="mt-6 text-xs leading-relaxed text-[#827472]">
          {UI.XT_DISCLAIMER}
        </p>

        <ScoringExplainer />

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-[#321716]">
            {UI.XT_GUIDE_TITLE}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {UI.XT_GUIDE.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[#e7ddd2] bg-white p-5"
              >
                <h3 className="font-semibold text-[#321716]">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#504443]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold text-[#321716]">
            {UI.XT_FAQ_TITLE}
          </h2>
          <dl className="mt-4 divide-y divide-[#e7ddd2] rounded-xl border border-[#e7ddd2] bg-white">
            {UI.XT_FAQ.map((item) => (
              <div key={item.question} className="p-5">
                <dt className="font-semibold text-[#321716]">
                  {item.question}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-[#504443]">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 rounded-2xl bg-[#4a2c2a] px-6 py-7 text-white">
          <h2 className="font-serif text-xl font-semibold">
            {UI.XT_RELATED_TITLE}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {UI.XT_RELATED.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex rounded-full border border-white/25 px-4 py-1.5 text-sm transition hover:bg-white/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ToolPageShell>
  );
}
