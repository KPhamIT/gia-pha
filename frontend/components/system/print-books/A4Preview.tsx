import type { ReactNode } from "react";
import styles from "./PrintBooks.module.css";

const A4_WIDTH_PX = (210 * 96) / 25.4;

/** Một trang A4 thật (210×297 mm) thu nhỏ về `width` px để xem trước. */
export default function A4Preview({ width, children }: { width: number; children: ReactNode }) {
  return (
    <div className={styles.a4Preview} style={{ width, height: width * (297 / 210) }}>
      <div className={styles.a4PreviewInner} style={{ transform: `scale(${width / A4_WIDTH_PX})` }}>
        {children}
      </div>
    </div>
  );
}
