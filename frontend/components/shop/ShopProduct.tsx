import type { ReactNode } from "react";
import Image from "next/image";
import { UI } from "@/lib/constants/ui-strings";
import BuyButton from "./BuyButton";

export type ShopProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type ShopProductProps = {
  id: string;
  badge: string;
  title: string;
  description: string;
  features: readonly string[];
  priceNote: string;
  images: ShopProductImage[];
  /** Hình minh hoạ đứng trước ảnh (vd. bìa render trực tiếp). */
  leadMedia?: ReactNode;
  productRef: string;
  /** Nội dung thêm dưới phần mô tả (mẫu bìa, danh sách bài…). */
  children?: ReactNode;
  reverse?: boolean;
};

/** Một sản phẩm: ảnh minh hoạ, mô tả, điểm nổi bật và nút đặt mua. */
export default function ShopProduct({
  id,
  badge,
  title,
  description,
  features,
  priceNote,
  images,
  leadMedia,
  productRef,
  children,
  reverse = false,
}: ShopProductProps) {
  // Một ảnh duy nhất thì hiện to; có bìa đứng trước thì ảnh sau lệch xuống tạo nhịp.
  const single = images.length === 1 && !leadMedia;
  return (
    <section id={id} className="scroll-mt-24 border-b border-[#e7ddd2] px-4 py-10 md:px-10 md:py-14">
      <div
        className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
      >
        <div className="flex items-start justify-center gap-4">
          {leadMedia}
          {images.map((image) => (
            <div
              key={image.src}
              className={`${single ? "w-3/4 max-w-[340px]" : "w-1/2 max-w-[260px]"} overflow-hidden rounded-lg shadow-[0_14px_34px_rgba(50,23,22,0.22)] ring-1 ring-black/5 ${
                single ? "" : "mt-10"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes={single ? "(min-width: 1024px) 340px, 75vw" : "(min-width: 1024px) 260px, 45vw"}
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#944a00]">
            {badge}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-[#321716] md:text-3xl">
            {title}
          </h2>
          <p className="mt-4 leading-relaxed text-[#504443]">{description}</p>
          <ul className="mt-5 space-y-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex gap-3 text-[#3d2b29]">
                <span aria-hidden className="mt-1 text-[#b8893b]">
                  ❖
                </span>
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[#504443]">
            <span className="font-semibold text-[#321716]">{UI.SHOP_PRICE_LABEL}:</span>{" "}
            {priceNote}
          </p>
          <BuyButton productRef={productRef} className="mt-5" />
        </div>
      </div>
      {children ? <div className="mt-10">{children}</div> : null}
    </section>
  );
}
