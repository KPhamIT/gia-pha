import Link from "next/link";
import styles from "./LandingStartCta.module.css";

type LandingStartCtaProps = {
  href: string;
  label: string;
  variant: "primary" | "gold";
};

export default function LandingStartCta({
  href,
  label,
  variant,
}: LandingStartCtaProps) {
  return (
    <Link
      href={href}
      className={`${styles.cta} ${variant === "gold" ? styles.gold : styles.primary}`}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
