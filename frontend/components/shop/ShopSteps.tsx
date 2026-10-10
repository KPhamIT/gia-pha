import { UI } from "@/lib/constants/ui-strings";
import BuyButton from "./BuyButton";

/** Các bước đặt sách + ô tư vấn cuối trang. */
export default function ShopSteps() {
  return (
    <section className="px-4 py-10 md:px-10 md:py-14">
      <h2 className="text-center font-serif text-2xl font-bold text-[#321716] md:text-3xl">
        {UI.SHOP_STEPS_TITLE}
      </h2>
      <ol className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {UI.SHOP_STEPS.map((step, i) => (
          <li
            key={step.title}
            className="rounded-xl border border-[#e7ddd2] bg-white p-5 shadow-sm"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#4a2c2a] font-serif text-lg font-bold text-[#f3d9a4]">
              {i + 1}
            </span>
            <p className="mt-3 font-semibold text-[#321716]">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#504443]">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-[#4a2c2a] px-6 py-8 text-center text-white">
        <p className="font-serif text-xl font-semibold">{UI.SHOP_CTA_TITLE}</p>
        <p className="mt-2 text-sm text-white/80">{UI.SHOP_CTA_BODY}</p>
        <BuyButton productRef="tu-van" className="mt-5" />
      </div>
    </section>
  );
}
