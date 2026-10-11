"use client";

import { useMemo, useState } from "react";
import { analyzeName, buildContext, suggestNames } from "@/lib/dat-ten/analyze";
import NameCriteria from "./NameCriteria";
import NameInputs, { type NameForm } from "./NameInputs";
import NameSuggestions from "./NameSuggestions";
import NameVerdict from "./NameVerdict";
import NumberCards from "./NumberCards";

const DEFAULT_FORM: NameForm = {
  surname: "Nguyễn",
  middle: "Minh",
  given: "Khôi",
  gender: "m",
  birthDate: `${new Date().getFullYear() + 1}-03-15`,
  middleElement: null,
  givenElement: null,
};

/** Đặt tên con: chấm tên theo phong thủy + thần số học, kèm gợi ý tên hợp mệnh. */
export default function NameTool() {
  const [form, setForm] = useState<NameForm>(DEFAULT_FORM);
  const update = (patch: Partial<NameForm>) =>
    setForm((prev) => ({ ...prev, ...patch }));
  const ctx = useMemo(() => buildContext(form), [form]);
  const analysis = useMemo(() => (ctx ? analyzeName(ctx) : null), [ctx]);
  const suggestions = useMemo(
    () =>
      ctx ? suggestNames(ctx, form.surname, form.middle, form.gender) : [],
    [ctx, form.surname, form.middle, form.gender],
  );

  return (
    <div className="space-y-8">
      <NameInputs form={form} onChange={update} />
      {analysis && ctx ? (
        <>
          <NameVerdict analysis={analysis} />
          <NameCriteria analysis={analysis} />
          <NumberCards ctx={ctx} />
          <NameSuggestions
            element={ctx.menh.element}
            suggestions={suggestions}
            current={form.given}
            onPick={(given) => update({ given, givenElement: null })}
          />
        </>
      ) : null}
    </div>
  );
}
