"use client";

import CollapsibleSection, {
  FormField,
  inputClassName,
  textareaClassName,
} from "@/components/ui/CollapsibleSection";
import { BRANCH_OPTIONS } from "@/lib/constants/branches";
import { UI } from "@/lib/constants/ui-strings";
import type { PersonDraft } from "@/utils/person-detail-form";
import { PERSON_FORM_SECTIONS, type Field } from "./person-form-sections";

function FieldControl({
  field,
  value,
  disabled,
  onChange,
}: {
  field: Field;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const common = {
    value,
    disabled,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  };

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={value === "1"}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked ? "1" : "")}
          className="h-5 w-5 cursor-pointer accent-amber-600"
        />
        <span>{UI.DECEASED_CHECKBOX}</span>
      </label>
    );
  }
  if (field.type === "textarea") {
    return <textarea {...common} className={textareaClassName} />;
  }
  if (field.type === "select") {
    const options =
      field.key === "branch"
        ? BRANCH_OPTIONS.map((b) => ({
            value: String(b.value),
            label: b.label,
          }))
        : (field.options?.map((opt) => ({ value: opt, label: opt })) ?? []);

    return (
      <select {...common} className={inputClassName}>
        {field.key === "gender" ? (
          <option value="">{UI.GENDER_PLACEHOLDER}</option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      type={
        field.type === "number"
          ? "number"
          : field.type === "date"
            ? "date"
            : "text"
      }
      min={field.min}
      max={field.max}
      {...common}
      className={inputClassName}
    />
  );
}

type PersonDetailFieldsProps = {
  draft: PersonDraft;
  saving: boolean;
  onChange: (field: keyof PersonDraft, value: string) => void;
};

export default function PersonDetailFields({
  draft,
  saving,
  onChange,
}: PersonDetailFieldsProps) {
  const isDeceased = draft.deceased === "1";

  return (
    <>
      {PERSON_FORM_SECTIONS.filter(
        (section) => !section.deceasedOnly || isDeceased,
      ).map((section) => (
        <CollapsibleSection
          key={section.title}
          title={section.title}
          defaultOpen={section.defaultOpen}
        >
          {section.fields
            .filter((field) => !field.deceasedOnly || isDeceased)
            .map((field) => (
              <FormField key={field.key} label={field.label}>
                <FieldControl
                  field={field}
                  value={draft[field.key]}
                  disabled={saving}
                  onChange={(value) => onChange(field.key, value)}
                />
              </FormField>
            ))}
        </CollapsibleSection>
      ))}
    </>
  );
}
