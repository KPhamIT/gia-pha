import { getPublicContactDisplay } from "@/lib/constants/contact-info";
import { UI } from "@/lib/constants/ui-strings";
import ContactIcon from "./ContactIcon";

export default function ContactMapSection() {
  const { address } = getPublicContactDisplay();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <div className="relative h-[400px] overflow-hidden rounded-2xl border border-[#d4c3c1] shadow-sm">
        <div className="absolute inset-0 bg-[#dcdad5] bg-[radial-gradient(circle_at_30%_40%,#ebe8e3_0%,#dcdad5_50%,#c9c6c1_100%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(#827472_1px,transparent_1px),linear-gradient(90deg,#827472_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4 rounded-xl border border-[#321716]/20 bg-white/90 p-6 shadow-2xl backdrop-blur-md">
            <div className="flex h-12 w-12 animate-bounce items-center justify-center rounded-full bg-[#944a00] text-white">
              <ContactIcon name="location" />
            </div>
            <div>
              <p className="font-bold text-[#321716]">{UI.CONTACT_MAP_OFFICE}</p>
              <p className="text-sm text-[#504443]">{address}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
