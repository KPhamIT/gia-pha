import { UI } from "@/lib/constants/ui-strings";

type Props = {
  guide: readonly { title: string; body: string }[];
  faq: readonly { question: string; answer: string }[];
};

/** Phần hướng dẫn + câu hỏi thường gặp dưới mỗi công cụ. */
export default function ToolGuide({ guide, faq }: Props) {
  return (
    <>
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-[#321716]">
          {UI.TOOL_GUIDE_TITLE}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {guide.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[#e7ddd2] bg-white p-5"
            >
              <h3 className="font-semibold text-[#321716]">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#504443]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-[#321716]">
          {UI.TOOL_FAQ_TITLE}
        </h2>
        <dl className="mt-4 divide-y divide-[#e7ddd2] rounded-xl border border-[#e7ddd2] bg-white">
          {faq.map((item) => (
            <div key={item.question} className="p-5">
              <dt className="font-semibold text-[#321716]">{item.question}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-[#504443]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
