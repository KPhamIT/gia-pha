"use client";

import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";
import styles from "./GenealogyBook.module.css";

const iconBtn =
  "grid h-11 w-11 shrink-0 place-items-center rounded-full active:bg-white/10 disabled:opacity-40 md:h-10 md:w-10";

type Props = {
  pageIndex: number;
  totalLeaves: number;
  /** Hiện nút quản lý trang & đổi kiểu (chỉ khi có quyền sửa sổ). */
  canEdit?: boolean;
  onClose?: () => void;
  onToggleStyle: () => void;
  onOpenSearch: () => void;
  onOpenPages: () => void;
  onPrint: () => void;
  onPrintAll: () => void;
};

export default function BookViewerHeader({
  totalLeaves,
  canEdit = false,
  onClose,
  onToggleStyle,
  onOpenSearch,
  onOpenPages,
  onPrint,
  onPrintAll,
}: Props) {
  return (
    <header
      className={`${styles.noPrint} ${styles.bookHeader} flex shrink-0 items-center gap-2 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-6 md:py-4 md:pt-4`}
    >
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full active:bg-white/10 md:h-10 md:w-10"
          aria-label={UI.BACK}
        >
          <Icon
            path="arrowLeft"
            size={22}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold md:text-xl">
          {UI.VIEW_GENEALOGY_BOOK}
        </h1>
        {/* <p className="text-xs text-amber-100/70">{UI.BOOK_TAP_HINT}</p> */}
      </div>
      <div className="flex shrink-0 items-center gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={onOpenSearch}
          className={iconBtn}
          aria-label={UI.BOOK_OPEN_SEARCH}
        >
          <Icon
            path="search"
            size={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
        {canEdit ? (
          <>
            <button
              type="button"
              onClick={onOpenPages}
              className={iconBtn}
              aria-label={UI.BOOK_OPEN_PAGES}
            >
              <Icon
                path="list"
                size={20}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                pointer={false}
              />
            </button>
            <button
              type="button"
              onClick={onToggleStyle}
              className={iconBtn}
              aria-label={UI.BOOK_OPEN_STYLE}
            >
              <Icon
                path="settings"
                size={20}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                pointer={false}
              />
            </button>
          </>
        ) : null}
        <button
          type="button"
          onClick={onPrint}
          className={iconBtn}
          aria-label={UI.BOOK_PRINT_PAGE}
        >
          <Icon
            path="print"
            size={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
        <button
          type="button"
          onClick={onPrintAll}
          disabled={totalLeaves === 0}
          className={iconBtn}
          aria-label={UI.BOOK_PRINT_ALL}
        >
          <Icon
            path="printAll"
            size={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            pointer={false}
          />
        </button>
      </div>
      {/* <span className="shrink-0 text-sm text-amber-100/80">{UI.BOOK_PAGE_OF(pageIndex + 1, totalLeaves)}</span> */}
    </header>
  );
}
