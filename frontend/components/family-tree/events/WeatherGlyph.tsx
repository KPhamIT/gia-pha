import type { WeatherIconKind } from "@/lib/api/modules/weather";

type Props = {
  kind: WeatherIconKind;
  className?: string;
};

/** Icon thời tiết tối giản (stroke), khớp palette events. */
export function WeatherGlyph({ kind, className = "h-6 w-6" }: Props) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };

  switch (kind) {
    case "clear":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case "partly":
      return (
        <svg {...common}>
          <circle cx="9" cy="10" r="3" />
          <path d="M9 3v1.5M3.5 10H5M5.2 5.2l1 1" />
          <path d="M8 16h9a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.4 1.6A3.2 3.2 0 0 0 8 16z" />
        </svg>
      );
    case "cloudy":
      return (
        <svg {...common}>
          <path d="M7 17h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.6 1.8A3.5 3.5 0 0 0 7 17z" />
        </svg>
      );
    case "fog":
      return (
        <svg {...common}>
          <path d="M4 10h16M5 14h14M7 18h10M6 6h12" />
        </svg>
      );
    case "drizzle":
      return (
        <svg {...common}>
          <path d="M7 13h10a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.5 1.5A3 3 0 0 0 7 13z" />
          <path d="M9 16v2M12 15.5v2M15 16v2" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path d="M7 12h10a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.5 1.5A3 3 0 0 0 7 12z" />
          <path d="M8 15l-1 3M12 14.5l-1 3M16 15l-1 3" />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path d="M12 5v14M7.5 8.5l9 7M16.5 8.5l-9 7" />
        </svg>
      );
    case "storm":
      return (
        <svg {...common}>
          <path d="M7 13h9a3.5 3.5 0 0 0 .3-7 5 5 0 0 0-9.4 1.6A3 3 0 0 0 7 13z" />
          <path d="M11 14l-2 4h3l-1.5 3.5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M7 17h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.6 1.8A3.5 3.5 0 0 0 7 17z" />
        </svg>
      );
  }
}
