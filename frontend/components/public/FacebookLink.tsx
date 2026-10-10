import { SOCIAL_LINKS } from "@/config/site";
import { UI } from "@/lib/constants/ui-strings";

type FacebookLinkProps = {
  /** Đường kính icon (px). */
  size?: number;
  className?: string;
};

/** Icon Facebook (tròn xanh, chữ f trắng) dẫn tới fanpage — rõ trên cả nền sáng lẫn tối. */
export default function FacebookLink({ size = 32, className = "" }: FacebookLinkProps) {
  return (
    <a
      href={SOCIAL_LINKS.facebook}
      target="_blank"
      rel="noopener"
      aria-label={UI.PUBLIC_FOOTER_FACEBOOK}
      title={UI.PUBLIC_FOOTER_FACEBOOK}
      className={`inline-flex shrink-0 rounded-full transition hover:scale-110 hover:opacity-90 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-hidden
      >
        <circle cx="12" cy="12" r="12" fill="#1877F2" />
        <path
          fill="#fff"
          d="M15.12 15.47 15.65 12h-3.33V9.75c0-.95.47-1.88 1.96-1.88h1.51V4.92s-1.37-.23-2.69-.23c-2.74 0-4.53 1.66-4.53 4.66V12H5.52v3.47h3.05V24a12.1 12.1 0 0 0 3.75 0v-8.53h2.8z"
        />
      </svg>
    </a>
  );
}
