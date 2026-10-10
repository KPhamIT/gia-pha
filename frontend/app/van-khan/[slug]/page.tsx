import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SeoSchemas from "@/components/seo/SeoSchemas";
import ContentThumbnail from "@/components/thumbnails/ContentThumbnail";
import CeremonyText from "@/components/van-khan/CeremonyText";
import VanKhanCard from "@/components/van-khan/VanKhanCard";
import VanKhanCta from "@/components/van-khan/VanKhanCta";
import VanKhanHero from "@/components/van-khan/VanKhanHero";
import VanKhanPageView from "@/components/van-khan/VanKhanPageView";
import { formatBlogDate } from "@/lib/blog/format";
import { UI } from "@/lib/constants/ui-strings";
import { breadcrumbsFromPath } from "@/lib/schema/breadcrumb";
import { createMetadata } from "@/lib/seo";
import { thumbnailOgImage } from "@/lib/thumbnails";
import { ceremonyDescription, ceremonyTitle, toParagraphs } from "@/lib/van-khan/format";
import {
  fetchPublicCeremonies,
  fetchPublicCeremony,
  type PublicCeremony,
} from "@/lib/van-khan/server-api";

type VanKhanPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateMetadata({ params }: VanKhanPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await fetchPublicCeremony(slug);
  if (!item) {
    return createMetadata({ title: UI.VAN_KHAN_LIST_TITLE, description: UI.VAN_KHAN_LIST_SUBTITLE, path: "/van-khan" });
  }
  return createMetadata({
    title: ceremonyTitle(item),
    description: ceremonyDescription(item),
    path: `/van-khan/${item.slug}`,
    keywords: item.seoKeywords,
    type: "article",
    updatedAt: item.updatedAt,
    pageType: "article",
    image: thumbnailOgImage("van-khan", item.slug, ceremonyTitle(item)),
  });
}

function TextSection({ title, text }: { title: string; text: string | null }) {
  const paragraphs = toParagraphs(text);
  if (paragraphs.length === 0) return null;
  return (
    <section>
      <h2>{title}</h2>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </section>
  );
}

async function RelatedCeremonies({ current }: { current: PublicCeremony }) {
  const all = (await fetchPublicCeremonies()) ?? [];
  const others = all.filter((item) => item.slug !== current.slug).slice(0, 6);
  if (others.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="font-serif text-xl font-bold text-[#4a2c2a]">{UI.VAN_KHAN_RELATED}</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {others.map((item) => (
          <VanKhanCard key={item.slug} item={item} />
        ))}
      </ul>
    </section>
  );
}

export default async function VanKhanDetailPage({ params }: VanKhanPageProps) {
  const { slug } = await params;
  const item = await fetchPublicCeremony(slug);
  if (!item) notFound();

  const path = `/van-khan/${item.slug}`;
  const title = ceremonyTitle(item);
  const description = ceremonyDescription(item);
  const breadcrumbs = breadcrumbsFromPath(path, title);

  return (
    <VanKhanPageView backHref="/van-khan">
      <SeoSchemas
        path={path}
        title={title}
        headline={title}
        description={description}
        pageType="article"
        updatedAt={item.updatedAt}
        keywords={item.seoKeywords}
        breadcrumbs={breadcrumbs}
      />
      <article>
        <VanKhanHero
          title={title}
          lead={item.seoExcerpt?.trim() || item.intro?.trim() || undefined}
          breadcrumbs={breadcrumbs}
          footer={`${UI.VAN_KHAN_UPDATED_AT} ${formatBlogDate(item.updatedAt)}`}
        />
        <div className="bg-[#fcf9f4] px-4 py-8 md:-mt-6 md:rounded-t-[3rem] md:px-10 md:pb-16 md:pt-12 md:shadow-2xl">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 overflow-hidden rounded-2xl border border-[#d4c3c1]/60 shadow-sm">
              <ContentThumbnail
                kind="van-khan"
                slug={item.slug}
                alt={title}
                priority
                sizes="(min-width: 768px) 768px, 100vw"
              />
            </div>
            <div className="blog-prose">
              <TextSection title={UI.VAN_KHAN_SECTION_MEANING} text={item.meaning} />
              <TextSection title={UI.VAN_KHAN_SECTION_PREPARATION} text={item.preparation} />
              <h2>{UI.VAN_KHAN_SECTION_TEXT}</h2>
              <p>{UI.VAN_KHAN_BLANK_HINT}</p>
            </div>
            <CeremonyText content={item.content} />
            {item.sourceBookTitle ? (
              <p className="mt-4 text-sm italic text-[#827472]">
                {UI.VAN_KHAN_SOURCE} {item.sourceBookTitle}
              </p>
            ) : null}
            <VanKhanCta />
            <RelatedCeremonies current={item} />
            <p className="mt-10 text-center">
              <Link href="/van-khan" className="text-sm font-semibold text-[#944a00] underline-offset-2 hover:underline">
                ← {UI.VAN_KHAN_BACK_TO_LIST}
              </Link>
            </p>
          </div>
        </div>
      </article>
    </VanKhanPageView>
  );
}

export const revalidate = 3600;
