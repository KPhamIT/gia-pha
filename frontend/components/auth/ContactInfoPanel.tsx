"use client";

import {
  formatContactLines,
  getContactInfo,
  hasContactInfo,
} from "@/lib/constants/contact-info";
import { UI } from "@/lib/constants/ui-strings";
import { AC } from "./account-theme";

type Props = {
  variant?: "book" | "landing";
};

export default function ContactInfoPanel({ variant = "landing" }: Props) {
  const info = getContactInfo();
  if (!hasContactInfo(info)) return null;

  const lines = formatContactLines(info);

  if (variant === "book") {
    return (
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">{UI.CONTACT_INFO_TITLE}</p>
        <p className="mt-1 text-xs text-slate-500">{UI.LOGIN_CONTACT_HINT}</p>
        <ul className="mt-2 space-y-1">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <section className={`${AC.cardMuted} p-5`}>
      <h2 className={AC.sectionTitle}>{UI.CONTACT_INFO_TITLE}</h2>
      <p className={`mt-1 text-xs ${AC.muted}`}>{UI.LOGIN_CONTACT_HINT}</p>
      <ul className={`mt-3 space-y-1.5 text-sm ${AC.muted}`}>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
