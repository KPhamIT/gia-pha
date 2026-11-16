"use client";

import { AC } from "@/components/auth/account-theme";
import { UI } from "@/lib/constants/ui-strings";

type Field = { value: string; onChange: (value: string) => void };

/** Bước 1: tên dòng họ (in bìa + Lời mở đầu), quê quán, năm lập phả. */
export function ClanSection({ clanName, clanAddress, establishedYear }: { clanName: Field; clanAddress: Field; establishedYear: Field }) {
  return (
    <section className={`${AC.card} p-5`}>
      <h2 className={AC.sectionTitle}>{UI.BLANK_BOOK_STEP_CLAN}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-[2fr_1fr]">
        <label className="block md:col-span-2">
          <span className={`text-sm font-medium ${AC.muted}`}>{UI.PRINT_BOOKS_CLAN_NAME}</span>
          <input
            id="blank-book-clan"
            value={clanName.value}
            onChange={(e) => clanName.onChange(e.target.value)}
            placeholder={UI.PRINT_BOOKS_CLAN_NAME_PLACEHOLDER}
            maxLength={60}
            className={`${AC.input} mt-1`}
          />
          <span className={`mt-1 block text-xs ${AC.label}`}>{UI.PRINT_BOOKS_CLAN_NAME_HINT}</span>
        </label>
        <label className="block">
          <span className={`text-sm font-medium ${AC.muted}`}>{UI.PRINT_BOOKS_CLAN_ADDRESS}</span>
          <input
            value={clanAddress.value}
            onChange={(e) => clanAddress.onChange(e.target.value)}
            maxLength={120}
            className={`${AC.input} mt-1`}
          />
        </label>
        <label className="block">
          <span className={`text-sm font-medium ${AC.muted}`}>{UI.PRINT_BOOKS_CLAN_YEAR}</span>
          <input
            value={establishedYear.value}
            onChange={(e) => establishedYear.onChange(e.target.value)}
            inputMode="numeric"
            maxLength={20}
            className={`${AC.input} mt-1`}
          />
        </label>
      </div>
    </section>
  );
}

/** Bước 4: email / SĐT nhận file (ít nhất một). */
export function ContactSection({ email, phone }: { email: Field; phone: Field }) {
  return (
    <section className={`${AC.card} p-5`}>
      <h2 className={AC.sectionTitle}>{UI.BLANK_BOOK_STEP_CONTACT}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className={`text-sm font-medium ${AC.muted}`}>{UI.BLANK_BOOK_EMAIL}</span>
          <input
            type="email"
            value={email.value}
            onChange={(e) => email.onChange(e.target.value)}
            autoComplete="email"
            maxLength={254}
            className={`${AC.input} mt-1`}
          />
        </label>
        <label className="block">
          <span className={`text-sm font-medium ${AC.muted}`}>{UI.BLANK_BOOK_PHONE}</span>
          <input
            type="tel"
            value={phone.value}
            onChange={(e) => phone.onChange(e.target.value)}
            autoComplete="tel"
            maxLength={20}
            className={`${AC.input} mt-1`}
          />
        </label>
      </div>
      <p className={`mt-2 text-xs ${AC.label}`}>{UI.BLANK_BOOK_CONTACT_HINT}</p>
    </section>
  );
}
