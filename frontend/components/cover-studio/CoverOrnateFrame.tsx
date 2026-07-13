"use client";

import styles from "./CoverFaces.module.scss";

/** Khung vàng kép + góc trang trí dùng chung các mẫu centered / back. */
export default function CoverOrnateFrame() {
  return (
    <>
      <div className={styles.frame} aria-hidden />
      <span
        className={styles.frameCorner}
        style={{ top: 10, left: 10, borderRight: "none", borderBottom: "none" }}
      />
      <span
        className={styles.frameCorner}
        style={{ top: 10, right: 10, borderLeft: "none", borderBottom: "none" }}
      />
      <span
        className={styles.frameCorner}
        style={{ bottom: 10, left: 10, borderRight: "none", borderTop: "none" }}
      />
      <span
        className={styles.frameCorner}
        style={{ bottom: 10, right: 10, borderLeft: "none", borderTop: "none" }}
      />
    </>
  );
}
