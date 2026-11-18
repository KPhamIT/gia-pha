import Link from "next/link";
import { UI } from "@/lib/constants/ui-strings";

/** Sau khi bật nhắc giỗ: báo ngày giỗ tới + mời lập gia phả cả gia đình. */
export default function GioReminderDone({
  name,
  nextDate,
  daysUntil,
  onAddAnother,
}: {
  name: string;
  nextDate: string;
  daysUntil: number;
  onAddAnother: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6" role="status">
        <h2 className="font-serif text-xl font-semibold text-emerald-900">{UI.GR_DONE_TITLE(name)}</h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/80">{UI.GR_DONE_BODY(nextDate, daysUntil)}</p>
        <button type="button" onClick={onAddAnother} className="mt-4 text-sm font-semibold text-emerald-800 underline-offset-2 hover:underline">
          + {UI.GR_ADD_ANOTHER}
        </button>
      </div>
      <aside className="rounded-2xl border border-[#d4af37]/30 bg-gradient-to-br from-[#fef3c7]/70 to-white p-6 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-[#4a2c2a]">{UI.GR_UPSELL_TITLE}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#504443]">{UI.GR_UPSELL_BODY}</p>
        <Link
          href="/tao-dong-ho"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#944a00] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7a3d00]"
        >
          {UI.GR_UPSELL_BUTTON}
        </Link>
      </aside>
    </div>
  );
}
