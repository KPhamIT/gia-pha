import type { Metadata } from "next";
import Link from "next/link";
import KinshipCalculator from "@/components/kinship/KinshipCalculator";
import SeoSchemas from "@/components/seo/SeoSchemas";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";

const PATH = "/cong-cu/xung-ho";

export const metadata: Metadata = createMetadata({
  title: UI.KIN_TITLE,
  description: UI.KIN_META_DESC,
  path: PATH,
  keywords: [
    "cách xưng hô trong họ hàng",
    "xưng hô họ hàng",
    "vợ của chú gọi là gì",
    "chồng của cô gọi là gì",
    "cách gọi họ hàng miền bắc miền nam",
  ],
});

export default function KinshipPage() {
  const breadcrumbs = breadcrumbsFromPath(PATH);
  const faq = UI.KIN_FAQ.map((item) => ({ ...item }));

  return (
    <ToolPageShell
      title={UI.KIN_TITLE}
      lead={UI.KIN_LEAD}
      breadcrumbs={breadcrumbs}
      active="xung-ho"
    >
      <SeoSchemas
        path={PATH}
        title={UI.KIN_TITLE}
        description={UI.KIN_META_DESC}
        breadcrumbs={breadcrumbs}
        faq={faq}
      />
        <div className="mx-auto max-w-3xl">
          <KinshipCalculator />

          <section className="mt-12">
            <h2 className="font-serif text-2xl font-bold text-[#321716]">{UI.KIN_GUIDE_TITLE}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {UI.KIN_GUIDE.map((item) => (
                <div key={item.title} className="rounded-xl border border-[#e7ddd2] bg-white p-5">
                  <h3 className="font-semibold text-[#321716]">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#504443]">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-serif text-2xl font-bold text-[#321716]">{UI.KIN_FAQ_TITLE}</h2>
            <dl className="mt-4 divide-y divide-[#e7ddd2] rounded-xl border border-[#e7ddd2] bg-white">
              {UI.KIN_FAQ.map((item) => (
                <div key={item.question} className="p-5">
                  <dt className="font-semibold text-[#321716]">{item.question}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-[#504443]">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12 rounded-2xl bg-[#4a2c2a] px-6 py-8 text-center text-white">
            <p className="font-serif text-xl font-semibold">{UI.KIN_CTA_TITLE}</p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/80">{UI.KIN_CTA_BODY}</p>
            <Link
              href="/tao-dong-ho"
              className="mt-5 inline-flex rounded-full bg-[#f6d68e] px-6 py-2.5 font-semibold text-[#3a1d0e] transition hover:bg-[#ffe3a6]"
            >
              {UI.KIN_CTA_BUTTON}
            </Link>
          </section>
        </div>
    </ToolPageShell>
  );
}
