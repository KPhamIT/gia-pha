const A4_HEIGHT_MM = 297;
const PRINT_MARGIN_MM = 8;
const PRINTABLE_HEIGHT_MM = A4_HEIGHT_MM - PRINT_MARGIN_MM * 2;

function mmToPx(mm: number): number {
  return (mm * 96) / 25.4;
}

export function fitGenealogyPagesForPrint(
  container: HTMLElement | null,
  scopeSelector = '[data-genealogy-paper]',
): void {
  if (!container) return;

  const maxHeight = mmToPx(PRINTABLE_HEIGHT_MM);
  const papers = container.querySelectorAll<HTMLElement>(scopeSelector);

  papers.forEach((paper) => {
    paper.style.transform = '';
    paper.style.width = '';
    paper.style.marginBottom = '';

    const contentHeight = paper.getBoundingClientRect().height || paper.scrollHeight;
    if (contentHeight <= maxHeight) return;

    const scale = maxHeight / contentHeight;
    paper.style.transform = `scale(${scale})`;
    paper.style.transformOrigin = 'top center';
    paper.style.width = `${100 / scale}%`;
    paper.style.marginBottom = `${contentHeight * (scale - 1)}px`;
  });
}

export function resetGenealogyPrintFit(container: HTMLElement | null): void {
  if (!container) return;

  container.querySelectorAll<HTMLElement>('[data-genealogy-paper]').forEach((paper) => {
    paper.style.transform = '';
    paper.style.width = '';
    paper.style.marginBottom = '';
  });
}
