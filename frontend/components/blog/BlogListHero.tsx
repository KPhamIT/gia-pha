import { UI } from "@/lib/constants/ui-strings";

export default function BlogListHero() {
  return (
    <section className="hidden bg-[#4a2c2a] py-12 text-white md:block">
      <div className="px-10">
        <h1 className="font-serif text-4xl font-bold tracking-tight">
          {UI.BLOG_LIST_TITLE}
        </h1>
        <p className="mt-4 max-w-2xl text-lg italic text-white/70">
          {UI.BLOG_LIST_SUBTITLE}
        </p>
      </div>
    </section>
  );
}
