"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { CEREMONY_LINE_HEIGHT } from "@/lib/ceremony/apply-ceremony-font-scale";
import {
  CONTENT_HEIGHT_PX,
  measureCaretLine,
  measureLineCount,
  pageOfLine,
  paginateLines,
  scrollLineIntoView,
} from "./a4-paper-layout";

type Selection = {
  start: number;
  end: number;
  direction: "forward" | "backward" | "none";
};

/**
 * Mỗi trang A4 là một "cửa sổ" (overflow: clip) nhìn vào cùng một nội dung,
 * dịch lên theo dòng bắt đầu của trang. Con trỏ đi quá cửa sổ thì chuyển sang
 * textarea của trang chứa nó, giữ nguyên vùng chọn.
 */
export function useA4Pagination({
  value,
  rootPx,
  title,
  textareaRef,
  scrollerRef,
}: {
  value: string;
  rootPx: number;
  title: string | null;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  scrollerRef: RefObject<HTMLDivElement | null>;
}) {
  const lineHeight = rootPx * CEREMONY_LINE_HEIGHT;
  const mirrorRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const copiesRef = useRef<(HTMLTextAreaElement | null)[]>([]);
  const activeRef = useRef(0);
  const selectionRef = useRef<Selection | null>(null);
  const [metrics, setMetrics] = useState({ totalLines: 1, headingPx: 0 });

  useLayoutEffect(() => {
    const mirror = mirrorRef.current;
    if (!mirror) return;
    const totalLines = measureLineCount(mirror, value, lineHeight);
    const headingPx = headingRef.current?.offsetHeight ?? 0;
    setMetrics((prev) =>
      prev.totalLines === totalLines && prev.headingPx === headingPx
        ? prev
        : { totalLines, headingPx },
    );
  }, [value, lineHeight, title]);

  const pages = useMemo(
    () =>
      paginateLines(
        metrics.totalLines,
        Math.floor((CONTENT_HEIGHT_PX - metrics.headingPx) / lineHeight),
        Math.floor(CONTENT_HEIGHT_PX / lineHeight),
      ),
    [metrics, lineHeight],
  );
  const pagesRef = useRef(pages);

  const activate = useCallback(
    (index: number, focus: boolean) => {
      const el = copiesRef.current[index];
      if (!el) return null;
      activeRef.current = index;
      textareaRef.current = el;
      const sel = selectionRef.current;
      if (focus) {
        el.focus({ preventScroll: true });
        if (sel) el.setSelectionRange(sel.start, sel.end, sel.direction);
      }
      return el;
    },
    [textareaRef],
  );

  // Trang đang soạn bị bỏ (xoá bớt nội dung): chuyển về trang cuối, giữ con trỏ.
  useLayoutEffect(() => {
    pagesRef.current = pages;
    if (activeRef.current < pages.length) return;
    const hadFocus = document.activeElement === document.body;
    activate(pages.length - 1, hadFocus && selectionRef.current != null);
  }, [pages, activate]);

  const syncCaret = useCallback(() => {
    const active = copiesRef.current[activeRef.current];
    const mirror = mirrorRef.current;
    if (!active || !mirror || document.activeElement !== active) return;
    const direction = active.selectionDirection ?? "none";
    selectionRef.current = {
      start: active.selectionStart,
      end: active.selectionEnd,
      direction,
    };
    const caret = direction === "backward" ? active.selectionStart : active.selectionEnd;
    const line = measureCaretLine(mirror, active.value, caret, lineHeight);
    const target = pageOfLine(pagesRef.current, line);
    if (target === activeRef.current) return;
    const next = activate(target, true);
    if (next?.parentElement && scrollerRef.current) {
      scrollLineIntoView(
        scrollerRef.current,
        next.parentElement,
        line - pagesRef.current[target].start,
        lineHeight,
      );
    }
  }, [activate, lineHeight, scrollerRef]);

  useEffect(() => {
    syncCaret();
  }, [value, pages, syncCaret]);

  /** Ref callback chung cho textarea mỗi trang; chỉ số trang lấy từ `data-page`. */
  const registerCopy = useCallback(
    (el: HTMLTextAreaElement | null) => {
      if (!el) return;
      const index = Number(el.dataset.page);
      copiesRef.current[index] = el;
      if (index === activeRef.current) textareaRef.current = el;
      return () => {
        if (copiesRef.current[index] === el) copiesRef.current[index] = null;
      };
    },
    [textareaRef],
  );

  const focusCopy = useCallback(
    (index: number) => {
      activeRef.current = index;
      textareaRef.current = copiesRef.current[index] ?? null;
    },
    [textareaRef],
  );

  const focusActive = useCallback(() => {
    copiesRef.current[activeRef.current]?.focus({ preventScroll: true });
  }, []);

  return {
    lineHeight,
    totalLines: metrics.totalLines,
    pages,
    mirrorRef,
    headingRef,
    registerCopy,
    focusCopy,
    focusActive,
    syncCaret,
  };
}
