import { UI } from "@/lib/constants/ui-strings";

const LINKS = [
  { href: "#so-gia-pha", label: UI.SHOP_JUMP_BOOK },
  { href: "#sach-van-khan", label: UI.SHOP_JUMP_PRAYER },
  { href: "#dich-vu-them", label: UI.SHOP_JUMP_SERVICES },
];

/** Nút nhảy nhanh tới từng mục trên trang Dịch vụ. */
export default function ShopJumpLinks() {
  return (
    <div className="flex flex-wrap gap-3">
      {LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="rounded-full border border-white/30 px-4 py-1.5 text-white transition hover:bg-white/10"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
