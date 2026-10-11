import { isGoodStar } from "@/lib/phong-thuy/bat-trach";
import type { PlanCell } from "@/lib/phong-thuy/rooms";
import { UI } from "@/lib/constants/ui-strings";

type Info = {
  element: string;
  aspect: string;
  items: readonly string[];
  avoid: string;
};

function Card({
  title,
  info,
  cell,
}: {
  title: string;
  info: Info;
  cell?: PlanCell;
}) {
  const star = cell?.star ?? null;
  const good = star ? isGoodStar(star) : null;
  const cure = star && !good ? UI.VP_STAR_CURE[star] : null;
  return (
    <li
      className={`flex flex-col rounded-2xl border bg-white p-4 shadow-sm ${
        good === null
          ? "border-[#e7ddd2]"
          : good
            ? "border-emerald-200"
            : "border-red-200"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-serif text-lg font-bold text-[#321716]">{title}</h3>
        {star ? (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              good
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {UI.PT_STAR[star].name}
          </span>
        ) : null}
      </div>
      <p className="text-xs text-[#827472]">
        {info.aspect} · {UI.VP_ELEMENT(info.element)}
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#827472]">
        {UI.VP_PLACE}
      </p>
      <ul className="mt-1 flex flex-wrap gap-1.5">
        {info.items.map((item) => (
          <li
            key={item}
            className="rounded-full bg-[#fcf6ea] px-2.5 py-1 text-xs text-[#504443]"
          >
            {item}
          </li>
        ))}
      </ul>
      {cure ? (
        <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-900">
          <span className="font-semibold">{UI.VP_CURE}: </span>
          {cure.join(" · ")}
        </div>
      ) : good ? (
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
          {UI.VP_BOOST}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-[#827472]">
        <span className="font-semibold">{UI.VP_AVOID}: </span>
        {info.avoid}
      </p>
    </li>
  );
}

/** 9 thẻ xếp theo sơ đồ mặt bằng: vật nên đặt theo hành của phương, kèm hóa giải nếu là sao xấu. */
export default function FengShuiObjects({ cells }: { cells: PlanCell[] }) {
  return (
    <section>
      <h2 className="font-serif text-2xl font-bold text-[#321716]">
        {UI.VP_TITLE}
      </h2>
      <p className="mt-1 max-w-3xl text-sm text-[#827472]">{UI.VP_HINT}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cells.map((cell) =>
          cell.dir ? (
            <Card
              key={cell.dir}
              title={UI.PT_DIR[cell.dir]}
              info={UI.VP_DIR[cell.dir]}
              cell={cell}
            />
          ) : (
            <Card key="center" title={UI.VP_CENTER.title} info={UI.VP_CENTER} />
          ),
        )}
      </ul>
    </section>
  );
}
