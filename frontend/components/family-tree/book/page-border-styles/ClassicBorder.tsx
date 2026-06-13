import styles from '../Book.module.css';
import type { PageBorderComponent } from './types';

/** Single fine gold double-rule frame. */
const ClassicBorder: PageBorderComponent = ({ children }) => (
  <>
    <div className={`${styles.frame} ${styles.frameClassic}`} aria-hidden />
    {children}
  </>
);

export default ClassicBorder;
