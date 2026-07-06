import ServicesIcon from "@/components/public/services/ServicesIcon";
import { SERVICES_PAGE_UI } from "@/lib/constants/ui-strings/services-page";

export default function ServicesTrustSection() {
  return (
    <section className="mt-16 rounded-2xl border border-[#ffdcc5]/50 bg-[#FEF3C7]/30 px-8 py-12 text-center">
      <h2 className="mb-4 font-serif text-2xl font-semibold text-[#321716]">
        {SERVICES_PAGE_UI.TRUST_TITLE}
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        {SERVICES_PAGE_UI.TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <ServicesIcon
              name={item.icon}
              size={36}
              className="mb-3 text-[#944a00]"
            />
            <p className="text-sm font-semibold text-[#451A03]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
