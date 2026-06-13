import styles from '../Book.module.css';
import type { PageBorderComponent } from './types';

/** Two stacked rules with a gap between them. */
const DoubleBorder: PageBorderComponent = ({ children }) => (
  <>
    <div className={`${styles.frame} ${styles.frameDouble}`} aria-hidden />
    {children}
  </>
);

export default DoubleBorder;
