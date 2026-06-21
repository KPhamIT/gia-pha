/** Fetch an image and return it as a base64 data URI (for self-contained SVG). */
export async function fetchImageAsDataUri(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Build an inline @font-face rule embedding the woff2 as a data URI. */
export async function buildEmbeddedFontFace(family: string, fileUrl: string): Promise<string | undefined> {
  try {
    const uri = await fetchImageAsDataUri(fileUrl);
    return `@font-face{font-family:"${family}";src:url("${uri}") format("woff2");font-weight:normal;font-style:normal;}`;
  } catch {
    return undefined;
  }
}

/** Serialize a live <svg> element to a self-contained file and trigger a download. */
export function downloadSvgElement(
  svg: SVGSVGElement,
  width: number,
  height: number,
  filename: string,
  fontFaceCss?: string,
): void {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.removeAttribute('style');
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.querySelectorAll('[data-export-ignore]').forEach((el) => el.remove());

  if (fontFaceCss) {
    const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleEl.textContent = fontFaceCss;
    clone.insertBefore(styleEl, clone.firstChild);
  }

  const xml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
