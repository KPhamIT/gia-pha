"use client";

import { type FormEvent, type ReactNode, useState } from "react";
import { getPublicContactDisplay } from "@/lib/constants/contact-info";
import { UI } from "@/lib/constants/ui-strings";
import { notify } from "@/lib/notify";
import ContactIcon from "./ContactIcon";

const INPUT_CLASS =
  "w-full rounded-lg border border-[#d4c3c1] bg-white p-3 outline-none transition-all focus:border-[#321716] focus:ring-2 focus:ring-[#321716]/10";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<string>(UI.CONTACT_FORM_SUBJECT_OPTIONS[0]);
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      notify.error(null, UI.CONTACT_FORM_EMAIL_REQUIRED);
      return;
    }

    const recipient = getPublicContactDisplay().email;
    const mailSubject = encodeURIComponent(`[${subject}] ${name || "Liên hệ Cội Nguồn"}`);
    const body = encodeURIComponent(
      `Họ và tên: ${name}\nEmail: ${email}\nSố điện thoại: ${phone}\nChủ đề: ${subject}\n\n${message}`,
    );
    window.location.href = `mailto:${recipient}?subject=${mailSubject}&body=${body}`;
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#fef3c7] bg-white p-6 shadow-sm md:p-10">
      <h2 className="font-serif text-3xl font-semibold text-[#321716]">
        {UI.CONTACT_FORM_TITLE}
      </h2>
      <form className="mt-8 flex flex-grow flex-col space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField label={UI.CONTACT_FORM_NAME}>
            <input
              type="text"
              className={INPUT_CLASS}
              placeholder={UI.CONTACT_FORM_NAME_PLACEHOLDER}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>
          <FormField label={UI.CONTACT_FORM_EMAIL}>
            <input
              type="email"
              required
              className={INPUT_CLASS}
              placeholder={UI.CONTACT_FORM_EMAIL_PLACEHOLDER}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField label={UI.CONTACT_FORM_PHONE}>
            <input
              type="tel"
              className={INPUT_CLASS}
              placeholder={UI.CONTACT_FORM_PHONE_PLACEHOLDER}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </FormField>
          <FormField label={UI.CONTACT_FORM_SUBJECT}>
            <select
              className={`${INPUT_CLASS} appearance-none`}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {UI.CONTACT_FORM_SUBJECT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label={UI.CONTACT_FORM_MESSAGE}>
          <textarea
            className={`${INPUT_CLASS} resize-none`}
            rows={6}
            placeholder={UI.CONTACT_FORM_MESSAGE_PLACEHOLDER}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </FormField>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#944a00] to-[#592500] py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
        >
          <ContactIcon name="send" size={20} />
          {UI.CONTACT_FORM_SUBMIT}
        </button>
      </form>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[#321716]">{label}</label>
      {children}
    </div>
  );
}
