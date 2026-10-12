"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UI } from "@/lib/constants/ui-strings";
import { applyCeremonyFontScale } from "@/lib/ceremony/apply-ceremony-font-scale";
import A4PaperSheet from "./A4PaperSheet";
import { CONTENT_WIDTH_MM, PAPER_WIDTH_PX } from "./a4-paper-layout";
import {
  applyA4SheetScreenStyle,
  paginateDocument,
  type DocumentPage,
} from "./a4-document-pages";
import { useFitZoom } from "./useFitZoom";

type Props = {
  html: string;
  fontScale: number;
};

type Layout = { height: number; pages: DocumentPage[] };

function prepare(iframe: HTMLIFrameElement | null, fontScale: number) {
  applyCeremonyFontScale(iframe, fontScale);
  applyA4SheetScreenStyle(iframe);
}

/**
 * Xem trước bài cúng trên các tờ A4 giống bản in: mỗi trang là một iframe
 * cùng nội dung, dịch lên tới đoạn của trang đó và cắt theo vùng chữ.
 */
export default function CeremonyA4Pages({ html, fontScale }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLIFrameElement>(null);
  const pageFramesRef = useRef<(HTMLIFrameElement | null)[]>([]);
  const [layout, setLayout] = useState<Layout | null>(null);
  const zoom = useFitZoom(containerRef, PAPER_WIDTH_PX);

  const measure = useCallback(() => {
    const iframe = measureRef.current;
    const doc = iframe?.contentDocument;
    if (!doc?.body) return;
    prepare(iframe, fontScale);
    setLayout(paginateDocument(doc));
  }, [fontScale]);

  useEffect(() => {
    measure();
    pageFramesRef.current.forEach((frame) => prepare(frame, fontScale));
  }, [measure, fontScale]);

  const frameStyle = { width: `${CONTENT_WIDTH_MM}mm`, border: 0 } as const;

  return (
    <div ref={containerRef} className="relative w-full">
      <div aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 h-0 w-0 overflow-hidden">
        <iframe
          ref={measureRef}
          srcDoc={html}
          title={UI.CEREMONY_TITLE}
          tabIndex={-1}
          sandbox="allow-same-origin"
          onLoad={measure}
          style={{ ...frameStyle, height: 0 }}
        />
      </div>
      <div className="mx-auto flex w-fit flex-col items-center gap-6" style={{ zoom }}>
        {(layout?.pages ?? [{ start: 0, end: 0 }]).map((page, index) => (
          <A4PaperSheet key={index}>
            <div style={{ height: page.end - page.start, overflow: "clip" }}>
              {layout ? (
                <iframe
                  ref={(el) => {
                    pageFramesRef.current[index] = el;
                  }}
                  srcDoc={html}
                  title={`${UI.CEREMONY_TITLE} – ${index + 1}`}
                  tabIndex={-1}
                  sandbox="allow-same-origin"
                  onLoad={(e) => prepare(e.currentTarget, fontScale)}
                  className="pointer-events-none relative block bg-transparent"
                  style={{ ...frameStyle, height: layout.height, top: -page.start }}
                />
              ) : null}
            </div>
          </A4PaperSheet>
        ))}
      </div>
    </div>
  );
}
