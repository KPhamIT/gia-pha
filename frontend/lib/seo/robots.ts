import type { Metadata } from "next";

export const DEFAULT_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

export function generateRobots(noIndex?: boolean): Metadata["robots"] {
  if (noIndex) {
    return { index: false, follow: false };
  }
  return DEFAULT_ROBOTS;
}
