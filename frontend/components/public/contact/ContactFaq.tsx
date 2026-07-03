"use client";

import { useState } from "react";
import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#faf7f2] py-20">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2 className="text-center font-serif text-3xl font-semibold text-[#321716]">
          {UI.CONTACT_FAQ_TITLE}
        </h2>
        <div className="mt-12 space-y-4">
          {UI.CONTACT_FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-xl border border-[#d4c3c1] bg-white"
              >
                <button
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between p-6 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="pr-4 text-lg font-bold text-[#321716]">
                    {item.question}
                  </span>
                  <Icon
                    path="chevronDown"
                    size={24}
                    pointer={false}
                    className={`shrink-0 text-[#504443] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-[#d4c3c1] px-6 pb-6 pt-4 text-[#504443]">
                    {item.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
