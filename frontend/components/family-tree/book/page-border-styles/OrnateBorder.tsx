import styles from "../Book.module.scss";
import type { PageBorderComponent } from "./types";

/** Double rule with decorative corner flourishes. */
const OrnateBorder: PageBorderComponent = ({ children }) => (
  <>
    <div className={`${styles.frame} ${styles.frameOrnate}`} aria-hidden>
      <span className={`${styles.frameCorner} ${styles.frameCornerTL}`} />
      <span className={`${styles.frameCorner} ${styles.frameCornerTR}`} />
      <span className={`${styles.frameCorner} ${styles.frameCornerBL}`} />
      <span className={`${styles.frameCorner} ${styles.frameCornerBR}`} />
    </div>
    {children}
  </>
);

export default OrnateBorder;
