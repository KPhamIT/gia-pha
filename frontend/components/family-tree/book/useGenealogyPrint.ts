'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { fitGenealogyPagesForPrint, resetGenealogyPrintFit } from '@/utils/fit-genealogy-print';
import { loadCalligraphyFont } from './calligraphy-font-loader';
import styles from './GenealogyBook.module.css';

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

const PRINT_STACK_SELECTOR = '[data-print-all-stack] [data-genealogy-paper]';
const PRINT_SINGLE_FIT_SELECTOR = '[data-print-single-stack] [data-genealogy-paper]:not([data-genealogy-cover])';

async function waitForPrintStack(root: HTMLElement | null, expectedPages: number): Promise<void> {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const count = root?.querySelectorAll(PRINT_STACK_SELECTOR).length ?? 0;
    if (count >= expectedPages) break;
    await new Promise<void>((resolve) => window.setTimeout(resolve, 32));
  }
  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready;
  }
  await nextFrame();
  await nextFrame();
}

/**
 * Handles printing the book: a single fitted current page, or an expanded
 * stack of every page. `onBeforePrintAll` caches unsaved edits first.
 */
export function useGenealogyPrint(onBeforePrintAll: () => void, pageCount: number, coverFontId: string) {
  const viewerRootRef = useRef<HTMLDivElement>(null);
  const [isPrintAllLayout, setIsPrintAllLayout] = useState(false);

  useEffect(() => {
    const resetPrintAll = () => {
      const root = viewerRootRef.current;
      root?.classList.remove(styles.printPreparing);
      root?.removeAttribute('data-print-root');
      resetGenealogyPrintFit(root);
      setIsPrintAllLayout(false);
    };
    window.addEventListener('afterprint', resetPrintAll);
    return () => window.removeEventListener('afterprint', resetPrintAll);
  }, []);

  const triggerPrint = useCallback(
    async (printAll: boolean) => {
      const root = viewerRootRef.current;
      root?.classList.add(styles.printPreparing);
      root?.setAttribute('data-print-root', 'true');
      await nextFrame();
      await loadCalligraphyFont(coverFontId);

      if (printAll) {
        resetGenealogyPrintFit(root);
        await waitForPrintStack(root, pageCount);
        fitGenealogyPagesForPrint(root, PRINT_STACK_SELECTOR);
      } else {
        resetGenealogyPrintFit(root);
        fitGenealogyPagesForPrint(root, PRINT_SINGLE_FIT_SELECTOR);
      }

      await nextFrame();
      window.print();
    },
    [coverFontId, pageCount],
  );

  const handlePrint = useCallback(() => {
    setIsPrintAllLayout(false);
    void triggerPrint(false);
  }, [triggerPrint]);

  const handlePrintAll = useCallback(async () => {
    onBeforePrintAll();
    flushSync(() => setIsPrintAllLayout(true));
    await nextFrame();
    await triggerPrint(true);
  }, [onBeforePrintAll, triggerPrint]);

  return { viewerRootRef, isPrintAllLayout, handlePrint, handlePrintAll };
}
