import styles from "../Book.module.scss";
import type { PageBorderComponent } from "./types";

/** Soft rounded frame with a dashed inner rule. */
const CloudBorder: PageBorderComponent = ({ children }) => (
  <>
    <div className={`${styles.frame} ${styles.frameCloud}`} aria-hidden />
    {children}
  </>
);

export default CloudBorder;
