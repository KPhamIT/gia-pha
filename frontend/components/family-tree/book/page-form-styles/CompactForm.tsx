import { UI } from '@/lib/constants/ui-strings';
import styles from '../GenealogyBook.module.css';
import BookField from '../BookField';
import { BOOK_PRINT_LINES } from '../book-print-lines';
import RelationsBlock from './RelationsBlock';
import type { PageFormComponent } from './types';

/** Dense layout: all short fields packed into two columns to save space. */
const CompactForm: PageFormComponent = ({ draft, relations, readOnly, onChange, onStartEdit }) => (
  <>
    <div className={`${styles.bookGrid} grid grid-cols-2 gap-x-4`}>
      <BookField label={UI.GENDER} value={draft.gender} onChange={(v) => onChange('gender', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
      <BookField label={UI.BIRTH_DATE} value={draft.birthDate} onChange={(v) => onChange('birthDate', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
      <BookField label={UI.DEATH_DATE} value={draft.deathDate} onChange={(v) => onChange('deathDate', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
      <BookField label={UI.BIRTH_PLACE} value={draft.birthPlace} onChange={(v) => onChange('birthPlace', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
      <BookField label={UI.CURRENT_LOCATION} value={draft.currentLocation} onChange={(v) => onChange('currentLocation', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
      <BookField label={UI.EDUCATION} value={draft.education} onChange={(v) => onChange('education', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
      <BookField label={UI.OCCUPATION} value={draft.occupation} onChange={(v) => onChange('occupation', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
      <BookField label={UI.RELIGION} value={draft.religion} onChange={(v) => onChange('religion', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
      <BookField label={UI.ETHNICITY} value={draft.ethnicity} onChange={(v) => onChange('ethnicity', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
      <BookField label={UI.CEMETERY} value={draft.cemetery} onChange={(v) => onChange('cemetery', v)} readOnly={readOnly} onStartEdit={onStartEdit} />
      <BookField label={UI.GRAVE_ADDRESS} value={draft.graveAddress} onChange={(v) => onChange('graveAddress', v)} multiline printLines={BOOK_PRINT_LINES.graveAddress} readOnly={readOnly} onStartEdit={onStartEdit} />
    </div>

    <RelationsBlock relations={relations} />

    <BookField label={UI.ACHIEVEMENTS} value={draft.achievements} onChange={(v) => onChange('achievements', v)} multiline printLines={BOOK_PRINT_LINES.achievements} readOnly={readOnly} onStartEdit={onStartEdit} />
    <BookField label={UI.BIOGRAPHY} value={draft.biography} onChange={(v) => onChange('biography', v)} multiline printLines={BOOK_PRINT_LINES.biography} readOnly={readOnly} onStartEdit={onStartEdit} />
    <BookField label={UI.GRAVE_NOTES} value={draft.graveNotes} onChange={(v) => onChange('graveNotes', v)} multiline printLines={BOOK_PRINT_LINES.graveNotes} readOnly={readOnly} onStartEdit={onStartEdit} />
  </>
);

export default CompactForm;
