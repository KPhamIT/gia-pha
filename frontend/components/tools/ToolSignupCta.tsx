import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";

/** Lời mời lập gia phả hợp ngữ cảnh từng công cụ; không có nội dung cho công cụ thì không hiện. */
export default function ToolSignupCta({ toolKey }: { toolKey?: string }) {
  const copy = toolKey ? UI.TOOL_SIGNUP[toolKey] : undefined;
  if (!copy) return null;
  return (
    <aside className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#fef3c7]/70 to-white p-6 shadow-sm md:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#944a00]">{UI.TOOL_SIGNUP_FREE}</p>
      <h2 className="mt-2 font-serif text-xl font-bold text-[#4a2c2a] md:text-2xl">{copy.title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#504443] md:text-base">{copy.body}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href="/tao-dong-ho"
          className="inline-flex items-center justify-center rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#7a3d00]"
        >
          {copy.button}
        </Link>
        {copy.secondary ? (
          <Link
            href={copy.secondary.href}
            className="inline-flex items-center justify-center rounded-xl border border-[#d4c3c1] bg-white px-5 py-2.5 text-sm font-semibold text-[#4a2c2a] transition-colors hover:bg-[#fcf9f4]"
          >
            {copy.secondary.label}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
