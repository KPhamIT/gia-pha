import { UI } from '@/lib/constants/ui-strings';
import type { PersonDraft } from '@/utils/person-detail-form';

export type FieldType = 'text' | 'date' | 'number' | 'textarea' | 'select';

export type Field = {
  key: keyof PersonDraft;
  label: string;
  type?: FieldType;
  options?: string[];
  min?: number;
  max?: number;
};

export type Section = { title: string; defaultOpen?: boolean; fields: Field[] };

const GENDER_OPTIONS = [UI.GENDER_MALE, UI.GENDER_FEMALE];

export const PERSON_FORM_SECTIONS: Section[] = [
  {
    title: UI.SECTION_BASIC,
    defaultOpen: true,
    fields: [
      { key: 'fullName', label: UI.CHILD_NAME },
      { key: 'gender', label: UI.GENDER, type: 'select', options: GENDER_OPTIONS },
      { key: 'birthDate', label: UI.BIRTH_DATE, type: 'date' },
      { key: 'deathDate', label: UI.DEATH_DATE, type: 'date' },
    ],
  },
  {
    title: UI.SECTION_FAMILY,
    fields: [
      { key: 'generation', label: 'Đời thứ', type: 'number', min: 1, max: 20 },
      { key: 'branch', label: 'Nhánh', type: 'select', options: ['1', '2', '3'] },
    ],
  },
  {
    title: UI.SECTION_LOCATION,
    fields: [
      { key: 'birthPlace', label: UI.BIRTH_PLACE },
      { key: 'currentLocation', label: UI.CURRENT_LOCATION },
    ],
  },
  { title: UI.EDUCATION, fields: [{ key: 'education', label: UI.EDUCATION }] },
  { title: UI.OCCUPATION, fields: [{ key: 'occupation', label: UI.OCCUPATION }] },
  {
    title: `${UI.RELIGION} & ${UI.ETHNICITY}`,
    fields: [
      { key: 'religion', label: UI.RELIGION },
      { key: 'ethnicity', label: UI.ETHNICITY },
    ],
  },
  { title: UI.SECTION_BIOGRAPHY, fields: [{ key: 'biography', label: UI.BIOGRAPHY, type: 'textarea' }] },
  { title: UI.SECTION_ACHIEVEMENTS, fields: [{ key: 'achievements', label: UI.ACHIEVEMENTS, type: 'textarea' }] },
  {
    title: UI.SECTION_GRAVE,
    fields: [
      { key: 'cemetery', label: UI.CEMETERY },
      { key: 'graveAddress', label: UI.GRAVE_ADDRESS },
      { key: 'graveNotes', label: UI.GRAVE_NOTES, type: 'textarea' },
    ],
  },
];
