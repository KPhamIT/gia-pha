import { UI } from "@/lib/constants/ui-strings";
import { formatDate } from "@/utils/person-relationships";
import { formatGenderLabel } from "@/utils/gender-label";
import styles from "../GenealogyBook.module.css";
import BookField from "../BookField";
import { BOOK_PRINT_LINES } from "../book-print-lines";
import RelationsBlock from "./RelationsBlock";
import type { PageFormComponent } from "./types";

/** Original layout: a two-column header grid then stacked dashed fields. */
const ClassicForm: PageFormComponent = ({
  draft,
  relations,
  readOnly,
  onChange,
  onStartEdit,
}) => {
  const showDeceased = draft.deceased === "1";
  const locationLabel = showDeceased
    ? UI.CURRENT_LOCATION_DECEASED
    : UI.CURRENT_LOCATION;

  return (
  <>
    <div className={`${styles.bookGrid} grid grid-cols-2 gap-x-4`}>
      <BookField
        label={UI.GENDER}
        value={
          readOnly ? formatGenderLabel(draft.gender) : draft.gender
        }
        onChange={(v) => onChange("gender", v)}
        readOnly={readOnly}
        onStartEdit={onStartEdit}
      />
      <BookField
        label={UI.BIRTH_DATE}
        value={readOnly ? formatDate(draft.birthDate) : draft.birthDate}
        onChange={(v) => onChange("birthDate", v)}
        readOnly={readOnly}
        onStartEdit={onStartEdit}
      />
      <BookField
        label={UI.DEATH_DATE}
        value={readOnly ? formatDate(draft.deathDate) : draft.deathDate}
        onChange={(v) => onChange("deathDate", v)}
        readOnly={readOnly}
        onStartEdit={onStartEdit}
      />
      <BookField
        label={UI.BIRTH_PLACE}
        value={draft.birthPlace}
        onChange={(v) => onChange("birthPlace", v)}
        readOnly={readOnly}
        onStartEdit={onStartEdit}
      />
    </div>

    <BookField
      label={locationLabel}
      value={draft.currentLocation}
      onChange={(v) => onChange("currentLocation", v)}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <BookField
      label={UI.EDUCATION}
      value={draft.education}
      onChange={(v) => onChange("education", v)}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <BookField
      label={UI.OCCUPATION}
      value={draft.occupation}
      onChange={(v) => onChange("occupation", v)}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <BookField
      label={UI.RELIGION}
      value={draft.religion}
      onChange={(v) => onChange("religion", v)}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <BookField
      label={UI.ETHNICITY}
      value={draft.ethnicity}
      onChange={(v) => onChange("ethnicity", v)}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />

    <RelationsBlock relations={relations} />

    <BookField
      label={UI.ACHIEVEMENTS}
      value={draft.achievements}
      onChange={(v) => onChange("achievements", v)}
      multiline
      printLines={BOOK_PRINT_LINES.achievements}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <BookField
      label={UI.BIOGRAPHY}
      value={draft.biography}
      onChange={(v) => onChange("biography", v)}
      multiline
      printLines={BOOK_PRINT_LINES.biography}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <BookField
      label={UI.CEMETERY}
      value={draft.cemetery}
      onChange={(v) => onChange("cemetery", v)}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <BookField
      label={UI.GRAVE_ADDRESS}
      value={draft.graveAddress}
      onChange={(v) => onChange("graveAddress", v)}
      multiline
      printLines={BOOK_PRINT_LINES.graveAddress}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <BookField
      label={UI.GRAVE_NOTES}
      value={draft.graveNotes}
      onChange={(v) => onChange("graveNotes", v)}
      multiline
      printLines={BOOK_PRINT_LINES.graveNotes}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
  </>
  );
};

export default ClassicForm;
