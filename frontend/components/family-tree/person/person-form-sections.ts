import { UI } from "@/lib/constants/ui-strings";
import type { PersonDraft } from "@/utils/person-detail-form";

export type FieldType =
  | "text"
  | "date"
  | "number"
  | "textarea"
  | "select"
  | "checkbox";

export type Field = {
  key: keyof PersonDraft;
  label: string;
  type?: FieldType;
  options?: string[];
  min?: number;
  max?: number;
  /** Chỉ hiện khi đã tích "Đã mất". */
  deceasedOnly?: boolean;
};

export type Section = {
  title: string;
  defaultOpen?: boolean;
  fields: Field[];
  /** Ẩn cả section khi chưa tích "Đã mất". */
  deceasedOnly?: boolean;
};

const GENDER_OPTIONS = [UI.GENDER_MALE, UI.GENDER_FEMALE];

export const PERSON_FORM_SECTIONS: Section[] = [
  {
    title: UI.SECTION_BASIC,
    defaultOpen: true,
    fields: [
      { key: "fullName", label: UI.CHILD_NAME },
      {
        key: "gender",
        label: UI.GENDER,
        type: "select",
        options: GENDER_OPTIONS,
      },
      { key: "birthDate", label: UI.BIRTH_DATE, type: "date" },
      { key: "deceased", label: UI.DECEASED_STATUS, type: "checkbox" },
      { key: "deathDate", label: UI.DEATH_DATE, type: "date", deceasedOnly: true },
      {
        key: "deathLunarDay",
        label: UI.DEATH_LUNAR_DAY,
        type: "number",
        min: 1,
        max: 30,
        deceasedOnly: true,
      },
      {
        key: "deathLunarMonth",
        label: UI.DEATH_LUNAR_MONTH,
        type: "number",
        min: 1,
        max: 12,
        deceasedOnly: true,
      },
    ],
  },
  {
    title: UI.SECTION_FAMILY,
    fields: [
      { key: "generation", label: "Đời thứ", type: "number", min: 1, max: 20 },
      {
        key: "branch",
        label: "Nhánh",
        type: "select",
        options: ["1", "2", "3"],
      },
    ],
  },
  {
    title: UI.SECTION_LOCATION,
    fields: [
      { key: "birthPlace", label: UI.BIRTH_PLACE },
      { key: "currentLocation", label: UI.CURRENT_LOCATION },
    ],
  },
  { title: UI.EDUCATION, fields: [{ key: "education", label: UI.EDUCATION }] },
  {
    title: UI.OCCUPATION,
    fields: [{ key: "occupation", label: UI.OCCUPATION }],
  },
  {
    title: `${UI.RELIGION} & ${UI.ETHNICITY}`,
    fields: [
      { key: "religion", label: UI.RELIGION },
      { key: "ethnicity", label: UI.ETHNICITY },
    ],
  },
  {
    title: UI.SECTION_BIOGRAPHY,
    fields: [{ key: "biography", label: UI.BIOGRAPHY, type: "textarea" }],
  },
  {
    title: UI.SECTION_ACHIEVEMENTS,
    fields: [{ key: "achievements", label: UI.ACHIEVEMENTS, type: "textarea" }],
  },
  {
    title: UI.SECTION_GRAVE,
    deceasedOnly: true,
    fields: [
      { key: "cemetery", label: UI.CEMETERY },
      { key: "graveAddress", label: UI.GRAVE_ADDRESS },
      { key: "graveNotes", label: UI.GRAVE_NOTES, type: "textarea" },
    ],
  },
];
