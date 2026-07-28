import { UI } from "@/lib/constants/ui-strings";
import { formatDate } from "@/utils/person-relationships";
import { formatGenderLabel } from "@/utils/gender-label";
import bookStyles from "../Book.module.scss";
import { BOOK_PRINT_LINES } from "../book-print-lines";
import RelationsBlock from "./RelationsBlock";
import type { PageFormComponent } from "./types";

function Row({
  label,
  value,
  onChange,
  multiline = false,
  printLines,
  readOnly = false,
  onStartEdit,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
  printLines?: number;
  readOnly?: boolean;
  onStartEdit?: () => void;
}) {
  const empty = !value.trim();
  const lineCount = printLines ?? (multiline ? 3 : undefined);
  const isLong = lineCount != null;

  return (
    <div
      className={`${bookStyles.elegantField} ${isLong ? bookStyles.elegantFieldLong : ""}`}
      data-print-lines={lineCount}
    >
      <span className={bookStyles.elegantLabel}>{label}</span>
      <span
        className={`${bookStyles.elegantValue}${empty ? ` ${bookStyles.elegantValueEmpty}` : ""}`}
      >
        {readOnly ? (
          <span
            className={`${isLong ? bookStyles.elegantValueMultiline : ""} ${onStartEdit ? "cursor-text" : ""}`}
            onClick={onStartEdit}
          >
            {value.trim()}
          </span>
        ) : multiline ? (
          <textarea
            value={value}
            rows={lineCount ?? 2}
            placeholder=""
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={onStartEdit}
          />
        ) : (
          <input
            type="text"
            value={value}
            placeholder=""
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={onStartEdit}
          />
        )}
      </span>
    </div>
  );
}

function PhotoFrame({ src }: { src: string }) {
  return (
    <div className={bookStyles.elegantPhotoFrame} aria-label={UI.BOOK_PHOTO_ALT}>
      {src.trim() ? (
        // Avatar URL may be absolute or relative; next/image domains vary.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={UI.BOOK_PHOTO_ALT} />
      ) : (
        <span className={bookStyles.elegantPhotoPlaceholder}>{UI.BOOK_PHOTO_3X4}</span>
      )}
    </div>
  );
}

/** Refined rows; top block pairs bio fields with a 3×4 portrait frame. */
const ElegantForm: PageFormComponent = ({
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
    <div className={bookStyles.elegantIntro}>
      <div className={bookStyles.elegantIntroFields}>
        <Row
          label={UI.GENDER}
          value={
            readOnly ? formatGenderLabel(draft.gender) : draft.gender
          }
          onChange={(v) => onChange("gender", v)}
          readOnly={readOnly}
          onStartEdit={onStartEdit}
        />
        <Row
          label={UI.BIRTH_DATE}
          value={readOnly ? formatDate(draft.birthDate) : draft.birthDate}
          onChange={(v) => onChange("birthDate", v)}
          readOnly={readOnly}
          onStartEdit={onStartEdit}
        />
        <Row
          label={UI.DEATH_DATE}
          value={readOnly ? formatDate(draft.deathDate) : draft.deathDate}
          onChange={(v) => onChange("deathDate", v)}
          readOnly={readOnly}
          onStartEdit={onStartEdit}
        />
        <Row
          label={UI.EDUCATION}
          value={draft.education}
          onChange={(v) => onChange("education", v)}
          readOnly={readOnly}
          onStartEdit={onStartEdit}
        />
        <Row
          label={UI.OCCUPATION}
          value={draft.occupation}
          onChange={(v) => onChange("occupation", v)}
          readOnly={readOnly}
          onStartEdit={onStartEdit}
        />
      </div>
      <PhotoFrame src={draft.avatar} />
    </div>

    <Row
      label={UI.BIRTH_PLACE}
      value={draft.birthPlace}
      onChange={(v) => onChange("birthPlace", v)}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <Row
      label={locationLabel}
      value={draft.currentLocation}
      onChange={(v) => onChange("currentLocation", v)}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <Row
      label={UI.RELIGION}
      value={draft.religion}
      onChange={(v) => onChange("religion", v)}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <Row
      label={UI.ETHNICITY}
      value={draft.ethnicity}
      onChange={(v) => onChange("ethnicity", v)}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />

    <RelationsBlock relations={relations} variant="elegant" />

    <Row
      label={UI.ACHIEVEMENTS}
      value={draft.achievements}
      onChange={(v) => onChange("achievements", v)}
      multiline
      printLines={BOOK_PRINT_LINES.achievements}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <Row
      label={UI.BIOGRAPHY}
      value={draft.biography}
      onChange={(v) => onChange("biography", v)}
      multiline
      printLines={BOOK_PRINT_LINES.biography}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <Row
      label={UI.CEMETERY}
      value={draft.cemetery}
      onChange={(v) => onChange("cemetery", v)}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <Row
      label={UI.GRAVE_ADDRESS}
      value={draft.graveAddress}
      onChange={(v) => onChange("graveAddress", v)}
      multiline
      printLines={BOOK_PRINT_LINES.graveAddress}
      readOnly={readOnly}
      onStartEdit={onStartEdit}
    />
    <Row
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

export default ElegantForm;
