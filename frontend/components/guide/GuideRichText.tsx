/** Renders guide paragraphs with simple **bold** markers. */
export default function GuideRichText({
  text,
  variant = "book",
}: {
  text: string;
  variant?: "book" | "landing";
}) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const strongClass =
    variant === "landing"
      ? "font-semibold text-[#321716]"
      : "font-semibold text-neutral-800";

  return (
    <p>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className={strongClass}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}
