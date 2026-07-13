"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { sheetSizeMm } from "./cover-bleed";
import styles from "./CoverStudio.module.css";

type CoverPreviewProps = {
  bleedMm: number;
  children: ReactNode;
};

/** Scale tờ A4+bleed cho vừa khung xem trước. */
export default function CoverPreview({ bleedMm, children }: CoverPreviewProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);
  const sheet = sheetSizeMm(bleedMm);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const update = () => {
      const pad = 16;
      const availW = Math.max(80, el.clientWidth - pad);
      const availH = Math.max(80, el.clientHeight - pad);
      const mmToPx = 96 / 25.4;
      const sheetW = sheet.width * mmToPx;
      const sheetH = sheet.height * mmToPx;
      const next = Math.min(1, availW / sheetW, availH / sheetH);
      setScale(Number.isFinite(next) ? next : 0.2);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sheet.width, sheet.height]);

  const mmToPx = 96 / 25.4;
  const layoutW = sheet.width * mmToPx * scale;
  const layoutH = sheet.height * mmToPx * scale;

  return (
    <div ref={stageRef} className={styles.previewStage}>
      <div style={{ width: layoutW, height: layoutH }}>
        <div
          className={styles.previewScale}
          style={{
            width: `${sheet.width}mm`,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
