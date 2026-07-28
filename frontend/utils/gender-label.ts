import { UI } from "@/lib/constants/ui-strings";

/** Chuẩn hóa gender lưu DB (`male`/`female`/`Nam`/…) → nhãn UI tiếng Việt. */
export function formatGenderLabel(
  gender: string | null | undefined,
): string {
  const raw = (gender ?? "").trim();
  if (!raw) return "";
  const g = raw.toLowerCase();
  if (g === "male" || g === "nam" || g === "m") return UI.GENDER_MALE;
  if (g === "female" || g === "nữ" || g === "nu" || g === "f") {
    return UI.GENDER_FEMALE;
  }
  return raw;
}
