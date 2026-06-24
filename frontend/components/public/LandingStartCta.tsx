import Link from "next/link";
import styles from "./LandingStartCta.module.css";

type LandingStartCtaBase = {
  label: string;
  variant: "primary" | "gold";
  disabled?: boolean;
};

type LandingStartCtaLink = LandingStartCtaBase & {
  href: string;
  onClick?: never;
};

type LandingStartCtaButton = LandingStartCtaBase & {
  href?: never;
  onClick: () => void;
};

type LandingStartCtaProps = LandingStartCtaLink | LandingStartCtaButton;

function ctaClassName(variant: "primary" | "gold") {
  return `${styles.cta} ${variant === "gold" ? styles.gold : styles.primary}`;
}

function CtaContent({ label }: { label: string }) {
  return (
    <>
      <span className={styles.label}>{label}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </>
  );
}

export default function LandingStartCta(props: LandingStartCtaProps) {
  const { label, variant, disabled } = props;
  const className = ctaClassName(variant);

  if (props.onClick) {
    return (
      <button
        type="button"
        className={className}
        disabled={disabled}
        onClick={props.onClick}
      >
        <CtaContent label={label} />
      </button>
    );
  }

  return (
    <Link href={props.href} className={className}>
      <CtaContent label={label} />
    </Link>
  );
}
