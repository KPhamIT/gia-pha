"use client";

import type { ReactNode, Ref } from "react";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  buttonRef: Ref<HTMLButtonElement>;
  ariaLabel: string;
  hidden: boolean;
  onOpen: () => void;
  children: ReactNode;
};

/** Ô xem trước bấm được: nhấc lên + nghiêng nhẹ, vệt sáng lướt, chữ "Bấm để xem". */
export default function ShowcaseThumb({ buttonRef, ariaLabel, hidden, onOpen, children }: Props) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      aria-label={ariaLabel}
      className="group relative block overflow-hidden rounded-md shadow-[0_8px_20px_rgba(50,23,22,0.28)] ring-1 ring-black/10 transition duration-300 ease-out [transform:perspective(900px)] hover:-translate-y-1.5 hover:shadow-[0_18px_34px_rgba(50,23,22,0.4)] hover:[transform:perspective(900px)_rotateY(-8deg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c99236]"
      // Ẩn ô gốc khi popup đang mở để mục "bay" ra từ đúng chỗ.
      style={{ visibility: hidden ? "hidden" : undefined }}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_35%,rgba(255,246,220,0.55)_50%,transparent_65%)] transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 text-center text-xs font-semibold tracking-wide text-[#f6d68e] transition-transform duration-300 group-hover:translate-y-0"
      >
        {UI.SHOP_COVER_VIEW_HINT}
      </span>
    </button>
  );
}
