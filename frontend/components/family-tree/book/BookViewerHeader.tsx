'use client';

import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';
import styles from './GenealogyBook.module.css';

const iconBtn = 'grid h-10 w-10 shrink-0 place-items-center rounded-full active:bg-white/10 disabled:opacity-40';

type Props = {
  pageIndex: number;
  totalLeaves: number;
  saving: boolean;
  onClose: () => void;
  onToggleStyle: () => void;
  onOpenPages: () => void;
  onPrint: () => void;
  onPrintAll: () => void;
};

export default function BookViewerHeader({ totalLeaves, saving, onClose, onToggleStyle, onOpenPages, onPrint, onPrintAll }: Props) {
  return (
    <header className={`${styles.noPrint} flex shrink-0 items-center gap-2 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]`}>
      <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full active:bg-white/10" aria-label={UI.CANCEL}>
        <Icon path="arrowLeft" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold">{UI.VIEW_GENEALOGY_BOOK}</h1>
        {/* <p className="text-xs text-amber-100/70">{UI.BOOK_TAP_HINT}</p> */}
      </div>
      <button type="button" onClick={onOpenPages} className={iconBtn} aria-label={UI.BOOK_OPEN_PAGES}>
        <Icon path="list" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
      </button>
      <button type="button" onClick={onToggleStyle} className={iconBtn} aria-label={UI.BOOK_OPEN_STYLE}>
        <Icon path="settings" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
      </button>
      <button type="button" onClick={onPrint} disabled={saving} className={iconBtn} aria-label={UI.BOOK_PRINT_PAGE}>
        <Icon path="print" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
      </button>
      <button type="button" onClick={onPrintAll} disabled={saving || totalLeaves === 0} className={iconBtn} aria-label={UI.BOOK_PRINT_ALL}>
        <Icon path="printAll" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
      </button>
      {/* <span className="shrink-0 text-sm text-amber-100/80">{UI.BOOK_PAGE_OF(pageIndex + 1, totalLeaves)}</span> */}
    </header>
  );
}
