import type { PersonRelationships } from "@/components/types/family-tree-types";
import { UI } from "@/lib/constants/ui-strings";
import bookStyles from "../Book.module.scss";
import { displayValue } from "../BookField";
import styles from "../GenealogyBook.module.css";

function relationText(names: { fullName: string }[]): string {
  return names.length ? names.map((p) => p.fullName).join(", ") : "";
}

type RelationRow = { label: string; value: string };

function buildRelationRows(relations: PersonRelationships): RelationRow[] {
  return [
    { label: UI.FATHER, value: relations.father?.fullName ?? "" },
    { label: UI.MOTHER, value: relations.mother?.fullName ?? "" },
    { label: UI.SPOUSE, value: relationText(relations.spouses) },
    { label: UI.CHILDREN, value: relationText(relations.children) },
  ];
}

function RelationValue({ value }: { value: string }) {
  const empty = !value.trim();
  return (
    <span className={empty ? "italic text-slate-400" : "text-slate-800"}>
      {displayValue(value)}
    </span>
  );
}

type Props = {
  relations: PersonRelationships | null;
  variant?: "elegant" | "stacked";
};

/** Read-only relationships summary shared by the form styles. */
export default function RelationsBlock({
  relations,
  variant = "stacked",
}: Props) {
  if (!relations) return null;

  const rows = buildRelationRows(relations);

  if (variant === "elegant") {
    return (
      <div className={`${styles.bookRelations} ${bookStyles.elegantRelations}`}>
        <p className={bookStyles.elegantRelationsHeading}>{UI.RELATIONSHIPS}</p>
        {rows.map((row) => {
          const empty = !row.value.trim();
          return (
            <div key={row.label} className={bookStyles.elegantField}>
              <span className={bookStyles.elegantLabel}>{row.label}</span>
              <span
                className={`${bookStyles.elegantValue} ${empty ? bookStyles.elegantValueEmpty : ""}`}
              >
                {displayValue(row.value)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.bookRelations}>
      <p className={styles.bookRelationsHeading}>{UI.RELATIONSHIPS}</p>
      {rows.map((row) => (
        <div
          key={row.label}
          className={`${styles.bookField} ${styles.bookRelationRow}`}
        >
          <p className={styles.bookFieldLabel}>{row.label}</p>
          <p className={styles.bookFieldValue}>
            <RelationValue value={row.value} />
          </p>
        </div>
      ))}
    </div>
  );
}
