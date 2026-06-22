import type { CeremonyTemplate } from "@/lib/api/modules/ceremonies";
import { UI } from "@/lib/constants/ui-strings";

export const EMPTY_FORM = { name: "", content: "", isDefault: false };
export type FormState = typeof EMPTY_FORM;

/** Either edit an existing template or create one from a prefilled draft. */
export type EditTarget = {
  template: CeremonyTemplate | null;
  initial: FormState;
};

/** Matches {{key}} or {key} variable tokens. */
export const TOKEN_RE = /\{\{\s*([\w.]+)\s*\}\}|\{\s*([\w.]+)\s*\}/g;

/** Tiêu đề nhóm biến (theo prefix của key) bằng tiếng Việt. */
const NS_LABELS: Record<string, string> = {
  person: UI.CEREMONY_TEMPLATE_NS_PERSON,
  organization: UI.CEREMONY_TEMPLATE_NS_ORGANIZATION,
  ceremony: UI.CEREMONY_TEMPLATE_NS_CEREMONY,
  today: UI.CEREMONY_TEMPLATE_NS_TODAY,
  worshipper: UI.CEREMONY_TEMPLATE_NS_WORSHIPPER,
};

export const nsLabel = (ns: string) =>
  NS_LABELS[ns] ?? (ns === "•" ? UI.CEREMONY_TEMPLATE_NS_OTHER : ns);
