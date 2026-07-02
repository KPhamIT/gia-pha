import { buildAbsoluteUrl } from "@/config/site";

export function generateCanonical(path: string): string {
  return buildAbsoluteUrl(path);
}
