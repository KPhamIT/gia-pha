import type { Suggestion } from "@/lib/dat-ten/analyze";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  element: string;
  suggestions: Suggestion[];
  current: string;
  onPick: (name: string) => void;
};

/** Chip tên gợi ý, chia hai nhóm: hành sinh mệnh và cùng hành. */
export default function NameSuggestions({
  element,
  suggestions,
  current,
  onPick,
}: Props) {
  const groups = [
    { label: UI.DT_SUGGEST_SINH, items: suggestions.filter((s) => s.sinh) },
    { label: UI.DT_SUGGEST_SAME, items: suggestions.filter((s) => !s.sinh) },
  ];
  return (
    <section>
      <h2 className="font-serif text-2xl font-bold text-[#321716]">
        {UI.DT_SUGGEST_TITLE(element)}
      </h2>
      <p className="mt-1 text-sm text-[#827472]">{UI.DT_SUGGEST_HINT}</p>
      <div className="mt-4 space-y-4 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm">
        {groups.map((g) =>
          g.items.length ? (
            <div key={g.label}>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#827472]">
                {g.label} · {g.items[0].element}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {g.items.map((s) => {
                  const active = s.name === current.trim();
                  return (
                    <li key={s.name}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => onPick(s.name)}
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                          active
                            ? "border-[#944a00] bg-[#944a00] text-white"
                            : "border-[#e7ddd2] bg-[#fdfbf7] text-[#321716] hover:border-[#944a00]"
                        }`}
                      >
                        {s.harmony !== "binh" ? (
                          <span className="mr-1 text-[#c99236]">★</span>
                        ) : null}
                        {s.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null,
        )}
      </div>
    </section>
  );
}
