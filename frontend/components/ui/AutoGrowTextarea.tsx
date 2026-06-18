'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, type TextareaHTMLAttributes } from 'react';

type AutoGrowTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Textarea grows with content; page scroll only (no inner scroll). Forwards its ref. */
const AutoGrowTextarea = forwardRef<HTMLTextAreaElement, AutoGrowTextareaProps>(function AutoGrowTextarea(
  { value, onChange, className = '', rows = 1, ...props },
  forwardedRef,
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLTextAreaElement, []);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <textarea
      ref={ref}
      rows={rows}
      value={value}
      onChange={(event) => {
        onChange?.(event);
        requestAnimationFrame(resize);
      }}
      className={className}
      style={{ overflow: 'hidden', resize: 'none' }}
      {...props}
    />
  );
});

export default AutoGrowTextarea;
