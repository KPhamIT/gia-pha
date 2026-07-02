import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";

export default function LandingBentoSection() {
  return (
    <section className="bg-[#ebe8e3] py-20">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-12 gap-6 px-4 md:px-6">
        <article className="relative col-span-12 h-[360px] overflow-hidden rounded-xl md:col-span-8">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/landing/bento-tree.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#321716]/80 to-transparent p-8">
            <div className="absolute bottom-8">
              <h3 className="font-serif text-3xl font-semibold text-white">{UI.LANDING_BENTO_TREE_TITLE}</h3>
              <p className="mt-2 max-w-2xl text-sm text-[#f3f0eb]">{UI.LANDING_BENTO_TREE_DESC}</p>
            </div>
          </div>
        </article>
        <article className="col-span-12 flex h-[360px] flex-col justify-between rounded-xl border border-[#d4c3c1] bg-white p-8 md:col-span-4">
          <div><h3 className="font-serif text-2xl font-semibold text-[#321716]">{UI.LANDING_BENTO_REMINDER_TITLE}</h3><p className="mt-2 text-sm leading-relaxed text-[#504443]">{UI.LANDING_BENTO_REMINDER_DESC}</p></div>
          <Link href="/ceremonies/upcoming" className="text-sm font-semibold text-[#944a00]">{UI.LANDING_BENTO_MORE} →</Link>
        </article>
        <article className="col-span-12 flex h-[360px] flex-col justify-between rounded-xl bg-[#321716] p-8 text-white md:col-span-4">
          <div><h3 className="font-serif text-2xl font-semibold">{UI.LANDING_BENTO_SECURITY_TITLE}</h3><p className="mt-2 text-sm leading-relaxed text-[#eabcb8]">{UI.LANDING_BENTO_SECURITY_DESC}</p></div>
          <span className="inline-flex w-fit rounded bg-[#4a2c2a] px-3 py-1 text-xs font-semibold">{UI.LANDING_BENTO_SECURITY_BADGE}</span>
        </article>
        <article className="relative col-span-12 h-[360px] overflow-hidden rounded-xl md:col-span-8">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/landing/bento-book.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#321716]/80 to-transparent p-8">
            <div className="absolute bottom-8 right-8 text-right">
              <h3 className="font-serif text-3xl font-semibold text-white">{UI.LANDING_BENTO_ARCHIVE_TITLE}</h3>
              <p className="mt-2 max-w-2xl text-sm text-[#f3f0eb]">{UI.LANDING_BENTO_ARCHIVE_DESC}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
