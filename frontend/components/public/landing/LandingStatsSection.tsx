import { UI } from "@/lib/constants/ui-strings";

export default function LandingStatsSection() {
  return (
    <section className="hidden border-y border-[#d4c3c1] bg-[#f6f3ee] py-10 md:block">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-4 text-center md:grid-cols-4 md:px-6">
        {UI.LANDING_STATS_ITEMS.map((item) => (
          <div key={item.label}>
            <p className="font-serif text-3xl font-semibold text-[#321716]">{item.value}</p>
            <p className="mt-1 text-sm text-[#504443]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
