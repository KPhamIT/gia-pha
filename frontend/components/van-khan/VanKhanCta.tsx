import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";

/** Gợi ý dùng tính năng điền bài cúng tự động từ gia phả. */
export default function VanKhanCta() {
  return (
    <aside className="mt-10 rounded-2xl border border-[#d4af37]/25 bg-gradient-to-br from-[#fef3c7]/60 to-white p-6 shadow-sm md:p-8">
      <h2 className="font-serif text-xl font-bold text-[#4a2c2a] md:text-2xl">
        {UI.VAN_KHAN_CTA_TITLE}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#504443] md:text-base">
        {UI.VAN_KHAN_CTA_BODY}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/tao-dong-ho"
          className="inline-flex items-center justify-center rounded-xl bg-[#4a2c2a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#321716]"
        >
          {UI.VAN_KHAN_CTA_BUTTON}
        </Link>
        <Link
          href="/huong-dan"
          className="inline-flex items-center justify-center rounded-xl border border-[#d4c3c1] bg-white px-5 py-2.5 text-sm font-semibold text-[#4a2c2a] transition-colors hover:bg-[#fcf9f4]"
        >
          {UI.BLOG_GUIDE_LINK}
        </Link>
      </div>
    </aside>
  );
}
