import { UI } from "@/lib/constants/ui-strings";

export type ContactInfo = {
  name?: string;
  phone?: string;
  email?: string;
  note?: string;
};

export function getContactInfo(): ContactInfo {
  return {
    name: process.env.NEXT_PUBLIC_CONTACT_NAME?.trim() || undefined,
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || undefined,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || undefined,
    note: process.env.NEXT_PUBLIC_CONTACT_NOTE?.trim() || undefined,
  };
}

export function hasContactInfo(info: ContactInfo = getContactInfo()): boolean {
  return Boolean(info.name || info.phone || info.email || info.note);
}

export function formatContactLines(
  info: ContactInfo = getContactInfo(),
): string[] {
  const lines: string[] = [];
  if (info.name) lines.push(`${UI.CONTACT_NAME}: ${info.name}`);
  if (info.phone) lines.push(`${UI.CONTACT_PHONE}: ${info.phone}`);
  if (info.email) lines.push(`${UI.CONTACT_EMAIL}: ${info.email}`);
  if (info.note) lines.push(`${UI.CONTACT_NOTE}: ${info.note}`);
  return lines;
}

export type PublicContactDisplay = {
  address: string;
  phone: string;
  email: string;
};

/** Thông tin liên hệ công khai — ưu tiên env, fallback footer landing. */
export function getPublicContactDisplay(): PublicContactDisplay {
  const info = getContactInfo();
  return {
    address: UI.LANDING_FOOTER_CONTACT_ADDRESS,
    phone: info.phone || UI.LANDING_FOOTER_CONTACT_PHONE,
    email: info.email || UI.LANDING_FOOTER_CONTACT_EMAIL,
  };
}
