import { SOCIAL_LINKS } from "@/config/site";
import { UI } from "@/lib/constants/ui-strings";

type BuyButtonProps = {
  /** Mã sản phẩm gửi kèm link m.me (`?ref=`) để biết khách hỏi sản phẩm nào. */
  productRef: string;
  label?: string;
  className?: string;
};

/** Mở Messenger chat với fanpage để đặt mua sách. */
export default function BuyButton({
  productRef,
  label = UI.SHOP_BUY,
  className = "",
}: BuyButtonProps) {
  const href = `${SOCIAL_LINKS.messenger}?ref=${encodeURIComponent(productRef)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      title={UI.SHOP_BUY_HINT}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0866ff] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#0756d6] active:scale-[0.98] ${className}`}
    >
      <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden>
        <path
          fill="currentColor"
          d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.98-.87c.17-.08.36-.09.53-.04.91.25 1.88.38 2.91.38 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46-2.94 4.66a1.5 1.5 0 0 1-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66a1.5 1.5 0 0 1 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63z"
        />
      </svg>
      {label}
    </a>
  );
}
