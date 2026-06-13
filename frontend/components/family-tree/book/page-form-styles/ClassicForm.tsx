import { UI } from '@/lib/constants/ui-strings';
import styles from '../../GenealogyBook.module.css';
import BookField from '../BookField';
import RelationsBlock from './RelationsBlock';
import type { PageFormComponent } from './types';

/** Original layout: a two-column header grid then stacked dashed fields. */
const ClassicForm: PageFormComponent = ({ draft, relations, readOnly, onChange }) => (
  <>
    <div className={`${styles.bookGrid} grid grid-cols-2 gap-x-4`}>
      <BookField label={UI.GENDER} value={draft.gender} onChange={(v) => onChange('gender', v)} readOnly={readOnly} />
      <BookField label={UI.BIRTH_DATE} value={draft.birthDate} onChange={(v) => onChange('birthDate', v)} readOnly={readOnly} />
      <BookField label={UI.DEATH_DATE} value={draft.deathDate} onChange={(v) => onChange('deathDate', v)} readOnly={readOnly} />
      <BookField label={UI.BIRTH_PLACE} value={draft.birthPlace} onChange={(v) => onChange('birthPlace', v)} readOnly={readOnly} />
    </div>

    <BookField label={UI.CURRENT_LOCATION} value={draft.currentLocation} onChange={(v) => onChange('currentLocation', v)} readOnly={readOnly} />
    <BookField label={UI.EDUCATION} value={draft.education} onChange={(v) => onChange('education', v)} readOnly={readOnly} />
    <BookField label={UI.OCCUPATION} value={draft.occupation} onChange={(v) => onChange('occupation', v)} readOnly={readOnly} />
    <BookField label={UI.RELIGION} value={draft.religion} onChange={(v) => onChange('religion', v)} readOnly={readOnly} />
    <BookField label={UI.ETHNICITY} value={draft.ethnicity} onChange={(v) => onChange('ethnicity', v)} readOnly={readOnly} />

    <RelationsBlock relations={relations} />

    <BookField label={UI.ACHIEVEMENTS} value={draft.achievements} onChange={(v) => onChange('achievements', v)} multiline readOnly={readOnly} />
    <BookField label={UI.BIOGRAPHY} value={draft.biography} onChange={(v) => onChange('biography', v)} multiline readOnly={readOnly} />
    <BookField label={UI.CEMETERY} value={draft.cemetery} onChange={(v) => onChange('cemetery', v)} readOnly={readOnly} />
    <BookField label={UI.GRAVE_ADDRESS} value={draft.graveAddress} onChange={(v) => onChange('graveAddress', v)} readOnly={readOnly} />
    <BookField label={UI.GRAVE_NOTES} value={draft.graveNotes} onChange={(v) => onChange('graveNotes', v)} multiline readOnly={readOnly} />
  </>
);

export default ClassicForm;
