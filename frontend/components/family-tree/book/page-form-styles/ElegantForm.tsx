import { UI } from '@/lib/constants/ui-strings';
import bookStyles from '../Book.module.scss';
import { displayValue } from '../BookField';
import RelationsBlock from './RelationsBlock';
import type { PageFormComponent } from './types';

function Row({
  label,
  value,
  onChange,
  multiline = false,
  readOnly = false,
  onStartEdit,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
  readOnly?: boolean;
  onStartEdit?: () => void;
}) {
  const empty = !value.trim();
  return (
    <div className={bookStyles.elegantField}>
      <span className={bookStyles.elegantLabel}>{label}</span>
      <span className={`${bookStyles.elegantValue} ${empty ? bookStyles.elegantValueEmpty : ''}`}>
        {readOnly ? (
          <span className={onStartEdit ? 'cursor-text' : undefined} onClick={onStartEdit}>
            {displayValue(value)}
          </span>
        ) : multiline ? (
          <textarea
            value={value}
            rows={2}
            placeholder={UI.BOOK_EMPTY_FIELD}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={onStartEdit}
          />
        ) : (
          <input
            type="text"
            value={value}
            placeholder={UI.BOOK_EMPTY_FIELD}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={onStartEdit}
          />
        )}
      </span>
    </div>
  );
}

/** Refined single-column rows with label on the left, value on the right. */
const ElegantForm: PageFormComponent = ({ draft, relations, readOnly, onChange, onStartEdit }) => (
  <>
    <Row label={UI.GENDER} value={draft.gender} onChange={(v) => onChange('gender', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.BIRTH_DATE} value={draft.birthDate} onChange={(v) => onChange('birthDate', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.DEATH_DATE} value={draft.deathDate} onChange={(v) => onChange('deathDate', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.BIRTH_PLACE} value={draft.birthPlace} onChange={(v) => onChange('birthPlace', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.CURRENT_LOCATION} value={draft.currentLocation} onChange={(v) => onChange('currentLocation', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.EDUCATION} value={draft.education} onChange={(v) => onChange('education', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.OCCUPATION} value={draft.occupation} onChange={(v) => onChange('occupation', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.RELIGION} value={draft.religion} onChange={(v) => onChange('religion', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.ETHNICITY} value={draft.ethnicity} onChange={(v) => onChange('ethnicity', v)} readOnly={readOnly} onStartEdit={onStartEdit} />

    <RelationsBlock relations={relations} />

    <Row label={UI.ACHIEVEMENTS} value={draft.achievements} onChange={(v) => onChange('achievements', v)} multiline readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.BIOGRAPHY} value={draft.biography} onChange={(v) => onChange('biography', v)} multiline readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.CEMETERY} value={draft.cemetery} onChange={(v) => onChange('cemetery', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.GRAVE_ADDRESS} value={draft.graveAddress} onChange={(v) => onChange('graveAddress', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
    <Row label={UI.GRAVE_NOTES} value={draft.graveNotes} onChange={(v) => onChange('graveNotes', v)} multiline readOnly={readOnly} onStartEdit={onStartEdit} />
  </>
);

export default ElegantForm;
