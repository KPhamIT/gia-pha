import { UI } from "@/lib/constants/ui-strings";
import BuyButton from "./BuyButton";
import ServiceImageViewer from "./ServiceImageViewer";

/** Minh hoạ nhập liệu hộ: sổ giấy → cây gia phả. */
function ImportIllustration() {
  return (
    <div className="flex h-full items-center justify-center gap-4 bg-[linear-gradient(160deg,#fcf6ea,#f3e6cc)] px-6 py-10">
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 rotate-[-4deg] rounded-sm bg-[#fffdf7] p-2.5 shadow-md ring-1 ring-[#e3d3b4]">
          {[90, 70, 85, 60, 78, 50].map((w, i) => (
            <div key={i} className="mb-1.5 h-1 rounded bg-[#b9a27c]/60" style={{ width: `${w}%` }} />
          ))}
        </div>
        <span className="text-center text-xs text-[#7a5a3a]">{UI.SHOP_SERVICE_IMPORT_FROM}</span>
      </div>
      <span aria-hidden className="text-2xl text-[#b8893b]">➜</span>
      <div className="flex flex-col items-center gap-2">
        <svg viewBox="0 0 96 80" width={96} height={80} aria-hidden>
          <g stroke="#9c8a7a" strokeWidth={1.5} fill="none">
            <path d="M48 18v10M24 28h48M24 28v12M72 28v12M24 50v8M12 58h24M12 58v6M36 58v6" />
          </g>
          {[
            [40, 4],
            [16, 40],
            [64, 40],
            [4, 64],
            [28, 64],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={16} height={14} rx={2} fill="#c0281c" stroke="#e7b64a" strokeWidth={1} />
          ))}
        </svg>
        <span className="text-xs text-[#7a5a3a]">{UI.SHOP_SERVICE_IMPORT_TO}</span>
      </div>
    </div>
  );
}

/** Dịch vụ thêm: in phả đồ khổ lớn, nhập liệu gia phả hộ. */
export default function ShopServices() {
  return (
    <section id="dich-vu-them" className="scroll-mt-24 border-b border-[#e7ddd2] px-4 py-10 md:px-10 md:py-14">
      <h2 className="font-serif text-2xl font-bold text-[#321716] md:text-3xl">{UI.SHOP_SERVICES_TITLE}</h2>
      <p className="mt-2 text-[#504443]">{UI.SHOP_SERVICES_HINT}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {UI.SHOP_SERVICES.map((service) => (
          <article
            key={service.key}
            className="flex flex-col overflow-hidden rounded-2xl border border-[#e7ddd2] bg-white shadow-sm"
          >
            <div className="h-56 overflow-hidden border-b border-[#efe6da] bg-[#f7f1e6]">
              {service.image ? (
                <ServiceImageViewer
                  serviceKey={service.key}
                  title={service.title}
                  description={service.description}
                  image={service.image}
                  alt={service.imageAlt}
                />
              ) : (
                <ImportIllustration />
              )}
            </div>
            <div className="flex flex-1 flex-col p-5 md:p-6">
              <h3 className="font-serif text-xl font-bold text-[#321716]">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#504443]">{service.description}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {service.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-[#3d2b29]">
                    <span aria-hidden className="text-[#b8893b]">❖</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-[#504443]">
                <span className="font-semibold text-[#321716]">{UI.SHOP_PRICE_LABEL}:</span> {service.price}
              </p>
              <div className="mt-auto pt-5">
                <BuyButton productRef={service.key} label={UI.SHOP_SERVICE_ORDER} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
