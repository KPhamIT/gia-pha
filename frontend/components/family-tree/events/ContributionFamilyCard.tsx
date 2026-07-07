import { UI } from "@/lib/constants/ui-strings";
import type { Person } from "@/components/types/family-tree-types";
import { CT } from "./contribution-theme";
import { personMeta } from "./event-contribution-utils";
import ContributionMemberRow from "./ContributionMemberRow";

type Group = {
  key: string;
  head: Person | null;
  members: Person[];
};

type Props = {
  group: Group;
  groupPaid: number;
  amountPerPerson: number;
  canEdit: boolean;
  saving: boolean;
  getAmount: (personId: number) => number;
  inputValueFor: (personId: number) => string;
  onToggle: (personId: number) => void;
  onInputChange: (personId: number, value: string) => void;
  onCommit: (personId: number) => void;
};

export default function ContributionFamilyCard({
  group,
  groupPaid,
  amountPerPerson,
  canEdit,
  saving,
  getAmount,
  inputValueFor,
  onToggle,
  onInputChange,
  onCommit,
}: Props) {
  return (
    <section
      className={`overflow-hidden rounded-xl border bg-white shadow-md ${CT.cardBorder}`}
    >
      <header
        className={`flex items-center justify-between gap-2 px-4 py-3 ${CT.cardHeader}`}
      >
        <div className="min-w-0">
          <h3 className={`truncate text-sm font-semibold ${CT.cardTitle}`}>
            {group.head
              ? UI.EVENT_FAMILY_OF(group.head.fullName)
              : UI.EVENT_ROOT_GROUP}
          </h3>
          {group.head ? (
            <p className={`truncate text-xs ${CT.cardMeta}`}>
              {personMeta(group.head)}
            </p>
          ) : null}
        </div>
        <span
          className={`shrink-0 rounded-full border bg-white px-2.5 py-0.5 text-xs font-semibold ${CT.badge}`}
        >
          {groupPaid}/{group.members.length}
        </span>
      </header>
      <ul className="divide-y divide-neutral-100">
        {group.members.map((member) => (
          <ContributionMemberRow
            key={member.id}
            member={member}
            amount={getAmount(member.id)}
            amountPerPerson={amountPerPerson}
            inputValue={inputValueFor(member.id)}
            saving={saving}
            readOnly={!canEdit}
            onToggle={() => onToggle(member.id)}
            onInputChange={(value) => onInputChange(member.id, value)}
            onCommit={() => onCommit(member.id)}
          />
        ))}
      </ul>
    </section>
  );
}
