import type { Metadata } from "next";
import Link from "next/link";
import PublicDocPageShell from "@/components/public/PublicDocPageShell";
import {
  getContactInfo,
  hasContactInfo,
} from "@/lib/constants/contact-info";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";

export const metadata: Metadata = {
  title: `${UI.CONTACT_PAGE_TITLE} | ${UI.PAGE_TITLE}`,
  description: UI.CONTACT_PAGE_SUBTITLE,
};

export default function ContactPage() {
  const info = getContactInfo();
  const hasInfo = hasContactInfo(info);

  return (
    <PublicDocPageShell
      title={UI.CONTACT_PAGE_TITLE}
      subtitle={UI.CONTACT_PAGE_SUBTITLE}
    >
      <p className={`text-sm leading-relaxed ${BT.mutedOnLight}`}>
        {UI.CONTACT_PAGE_INTRO}
      </p>

      {hasInfo ? (
        <ul className={`mt-6 space-y-2 text-sm ${BT.mutedOnLight}`}>
          {info.name ? (
            <li>
              <span className="font-medium text-neutral-800">{UI.CONTACT_NAME}:</span>{" "}
              {info.name}
            </li>
          ) : null}
          {info.phone ? (
            <li>
              <span className="font-medium text-neutral-800">{UI.CONTACT_PHONE}:</span>{" "}
              <a href={`tel:${info.phone.replace(/\s/g, "")}`} className="text-amber-800 underline-offset-2 hover:underline">
                {info.phone}
              </a>
            </li>
          ) : null}
          {info.email ? (
            <li>
              <span className="font-medium text-neutral-800">{UI.CONTACT_EMAIL}:</span>{" "}
              <a href={`mailto:${info.email}`} className="text-amber-800 underline-offset-2 hover:underline">
                {info.email}
              </a>
            </li>
          ) : null}
          {info.note ? (
            <li className="pt-2 text-neutral-600">{info.note}</li>
          ) : null}
        </ul>
      ) : (
        <p className={`mt-6 rounded-lg border border-amber-200/80 bg-amber-50/80 p-4 text-sm ${BT.mutedOnLight}`}>
          {UI.CONTACT_PAGE_EMPTY}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/huong-dan" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnPrimary}`}>
          {UI.LANDING_CTA_GUIDE}
        </Link>
        <Link href="/" className={`${BT.btnBase} ${BT.btnSm} ${BT.btnOutline}`}>
          {UI.CONTACT_PAGE_BACK}
        </Link>
      </div>
    </PublicDocPageShell>
  );
}
