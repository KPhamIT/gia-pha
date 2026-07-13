const A4_HEIGHT_MM = 297;

function mmToPx(mm: number): number {
  return (mm * 96) / 25.4;
}

/**
 * Thu nhỏ trang khi nội dung cao hơn A4.
 * Paper được CSS khóa 297mm + transform:none khi in — hàm này chủ yếu
 * hỗ trợ đo trước print; không co nền khi trang ngắn hơn A4.
 */
export function fitGenealogyPagesForPrint(
  container: HTMLElement | null,
  scopeSelector = "[data-genealogy-paper]",
): void {
  if (!container) return;

  const maxHeight = mmToPx(A4_HEIGHT_MM);
  const papers = container.querySelectorAll<HTMLElement>(scopeSelector);

  papers.forEach((paper) => {
    paper.style.transform = "";
    paper.style.width = "";
    paper.style.marginBottom = "";
    paper.style.transformOrigin = "";

    const contentHeight =
      paper.scrollHeight || paper.getBoundingClientRect().height;
    if (contentHeight <= maxHeight + 1) return;

    const scale = maxHeight / contentHeight;
    paper.style.transformOrigin = "top left";
    paper.style.width = `${100 / scale}%`;
    paper.style.transform = `scale(${scale})`;
    paper.style.marginBottom = `${contentHeight * (scale - 1)}px`;
  });
}

export function resetGenealogyPrintFit(container: HTMLElement | null): void {
  if (!container) return;

  container
    .querySelectorAll<HTMLElement>("[data-genealogy-paper]")
    .forEach((paper) => {
      paper.style.transform = "";
      paper.style.width = "";
      paper.style.marginBottom = "";
      paper.style.transformOrigin = "";
    });
}
