'use client';

import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';
import BookLeaf, { type BookLeafCtx } from './BookLeaf';
import FlipBackFace from './FlipBackFace';
import { leafKey, type Leaf } from './book-leaves';
import styles from './GenealogyBook.module.css';

const navBtn = `${styles.noPrint} absolute top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/20 text-white backdrop-blur-sm active:bg-black/30 disabled:opacity-30`;

type Flip = { dir: 'next' | 'prev' } | null;

type Props = {
  ctx: BookLeafCtx;
  leaves: Leaf[];
  pageIndex: number;
  totalLeaves: number;
  flip: Flip;
  baseIndex: number;
  frontIndex: number;
  isPrintAllLayout: boolean;
  goToPage: (dir: 'next' | 'prev') => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
};

export default function BookStage({
  ctx,
  leaves,
  pageIndex,
  totalLeaves,
  flip,
  baseIndex,
  frontIndex,
  isPrintAllLayout,
  goToPage,
  onTouchStart,
  onTouchEnd,
}: Props) {
  return (
    <>
      <div className="relative min-h-0 flex-1 px-3 pb-3 md:px-4 md:pb-4" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <button type="button" onClick={() => goToPage('prev')} disabled={pageIndex === 0 || flip !== null} className={`${navBtn} left-1`} aria-label={UI.BOOK_PREV_PAGE}>
          <Icon path="chevronLeft" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>
        <button type="button" onClick={() => goToPage('next')} disabled={pageIndex >= totalLeaves - 1 || flip !== null} className={`${navBtn} right-1`} aria-label={UI.BOOK_NEXT_PAGE}>
          <Icon path="chevronRight" size={22} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
        </button>

        <div className={`${styles.printCurrentArea} ${styles.scene} h-full`}>
          <div className={styles.sheet}>
            <div className={styles.page}>
              {flip ? (
                <BookLeaf index={baseIndex} readOnly ctx={ctx} />
              ) : (
                <BookLeaf index={pageIndex} readOnly={false} live ctx={ctx} />
              )}

              {flip ? (
                <>
                  <div className={styles.flipUnderShade} aria-hidden />
                  <div className={`${styles.flipLeaf} ${flip.dir === 'next' ? styles.flipLeafNext : styles.flipLeafPrev}`} aria-hidden>
                    <div className={styles.flipFace}>
                      <BookLeaf index={frontIndex} readOnly ctx={ctx} />
                    </div>
                    <FlipBackFace settings={ctx.settings} />
                    <div className={styles.flipShadow} />
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.printAllStack} aria-hidden={!isPrintAllLayout} data-print-all-stack>
        {isPrintAllLayout
          ? leaves.map((leaf, index) => (
              <div key={leafKey(leaf)} className={styles.printAllPage}>
                <BookLeaf index={index} readOnly ctx={ctx} />
              </div>
            ))
          : null}
      </div>
    </>
  );
}
