import { splitCeremonyText } from "@/lib/van-khan/format";

type CeremonyTextProps = {
  content: string;
};

/** Bài khấn giữ nguyên xuống dòng; biến {{...}} hiển thị thành ô trống có nhãn. */
export default function CeremonyText({ content }: CeremonyTextProps) {
  const parts = splitCeremonyText(content.trim());
  return (
    <div className="whitespace-pre-wrap break-words rounded-2xl border border-[#d4af37]/30 bg-[#fffdf7] p-5 font-serif text-[1.0625rem] leading-[1.9] text-[#1c1c19] md:p-8 md:text-lg">
      {parts.map((part, index) =>
        part.kind === "text" ? (
          <span key={index}>{part.value}</span>
        ) : (
          <span
            key={index}
            className="mx-0.5 rounded bg-[#fef3c7] px-1.5 py-0.5 font-sans text-[0.9em] text-[#944a00]"
          >
            [{part.label}]
          </span>
        ),
      )}
    </div>
  );
}
