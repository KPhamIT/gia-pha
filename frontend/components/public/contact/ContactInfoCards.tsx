import type { ReactNode } from "react";
import { getPublicContactDisplay } from "@/lib/constants/contact-info";
import { UI } from "@/lib/constants/ui-strings";
import ContactIcon from "./ContactIcon";

const CARD_CLASS =
  "rounded-xl border border-[#d4c3c1] bg-white p-8 shadow-sm transition-shadow hover:shadow-md";

function ContactCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={CARD_CLASS}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f0ede9] text-[#944a00]">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="font-serif text-2xl font-semibold text-[#321716]">
            {title}
          </h3>
          <div className="mt-2 text-[#504443]">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function ContactInfoCards() {
  const contact = getPublicContactDisplay();

  return (
    <div className="space-y-6">
      <ContactCard icon={<ContactIcon name="location" />} title={UI.CONTACT_CARD_ADDRESS_TITLE}>
        <p>{contact.address}</p>
      </ContactCard>

      <ContactCard icon={<ContactIcon name="phone" />} title={UI.CONTACT_CARD_PHONE_TITLE}>
        <a
          href={`tel:${contact.phone.replace(/\s/g, "")}`}
          className="transition-colors hover:text-[#944a00]"
        >
          {contact.phone}
        </a>
        <p className="mt-1 text-xs font-medium tracking-wide text-[#504443]">
          {UI.CONTACT_CARD_PHONE_NOTE}
        </p>
      </ContactCard>

      <ContactCard icon={<ContactIcon name="mail" />} title={UI.CONTACT_CARD_EMAIL_TITLE}>
        <a
          href={`mailto:${contact.email}`}
          className="block transition-colors hover:text-[#944a00]"
        >
          {contact.email}
        </a>
      </ContactCard>

      <ContactCard icon={<ContactIcon name="schedule" />} title={UI.CONTACT_CARD_HOURS_TITLE}>
        <div className="space-y-1">
          <HoursRow label={UI.CONTACT_CARD_HOURS_WEEKDAY_LABEL} value={UI.CONTACT_CARD_HOURS_WEEKDAY} />
          <HoursRow label={UI.CONTACT_CARD_HOURS_SAT_LABEL} value={UI.CONTACT_CARD_HOURS_SAT} />
          <HoursRow
            label={UI.CONTACT_CARD_HOURS_SUN_LABEL}
            value={UI.CONTACT_CARD_HOURS_SUN}
            valueClassName="font-bold text-[#ba1a1a]"
          />
        </div>
      </ContactCard>
    </div>
  );
}

function HoursRow({
  label,
  value,
  valueClassName = "font-bold",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}
