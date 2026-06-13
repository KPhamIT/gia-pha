import styles from '../Book.module.scss';
import type { PageBorderComponent } from './types';

/** Minimal top & bottom accent rules only. */
const ModernBorder: PageBorderComponent = ({ children }) => (
  <>
    <div className={`${styles.frame} ${styles.frameModern}`} aria-hidden />
    {children}
  </>
);

export default ModernBorder;
