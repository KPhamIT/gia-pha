'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { fitGenealogyPagesForPrint, resetGenealogyPrintFit } from '@/utils/fit-genealogy-print';
import styles from './GenealogyBook.module.css';

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

/**
 * Handles printing the book: a single fitted current page, or an expanded
 * stack of every page. `onBeforePrintAll` caches unsaved edits first.
 */
export function useGenealogyPrint(onBeforePrintAll: () => void) {
  const viewerRootRef = useRef<HTMLDivElement>(null);
  const [isPrintAllLayout, setIsPrintAllLayout] = useState(false);

  useEffect(() => {
    const resetPrintAll = () => {
      const root = viewerRootRef.current;
      root?.classList.remove(styles.printPreparing);
      resetGenealogyPrintFit(root);
      setIsPrintAllLayout(false);
    };
    window.addEventListener('afterprint', resetPrintAll);
    return () => window.removeEventListener('afterprint', resetPrintAll);
  }, []);

  const triggerPrint = useCallback(async (printAll: boolean) => {
    const root = viewerRootRef.current;
    root?.classList.add(styles.printPreparing);
    await nextFrame();
    if (printAll) {
      resetGenealogyPrintFit(root);
    } else {
      fitGenealogyPagesForPrint(root, `.${styles.printCurrentArea} [data-genealogy-paper]`);
    }
    await nextFrame();
    window.print();
  }, []);

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
