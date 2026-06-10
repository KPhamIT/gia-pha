import { Handle, Position } from '@xyflow/react';
import { useCallback } from 'react';
import { UI } from '@/lib/constants/ui-strings';

type PersonNodeData = {
  fullName: string;
  avatar?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  isRoot: boolean;
  personId?: number;
  onNodeClick?: (personId: number) => void;
  nodeBgColor?: string;
  nodeTextColor?: string;
};

type FamilyTreeNodeProps = {
  data: PersonNodeData;
  selected?: boolean;
  id?: string;
};

const birthDateFormatter = new Intl.DateTimeFormat('vi-VN');

function formatBirthDate(birthDate?: string | null) {
  if (!birthDate) return UI.BIRTH_DATE_UNKNOWN;
  return birthDateFormatter.format(new Date(birthDate));
}

export default function FamilyTreeNode({ data, selected, id }: FamilyTreeNodeProps) {
  const handleClick = useCallback(() => {
    if (data.onNodeClick && id) {
      const personId = Number(id);
      data.onNodeClick(personId);
    }
  }, [data, id]);

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: data.nodeBgColor ?? '#ffffff',
        color: data.nodeTextColor ?? '#0f172a',
      }}
      className={`cursor-pointer w-full h-full transition-all hover:shadow-lg ${
        selected
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
          : 'border-slate-200 shadow-sm hover:border-blue-300'
      }`}
    >
      <Handle type="source" position={Position.Top} />
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-xs opacity-60">{data.gender || UI.GENDER_UNKNOWN}</p>
        </div>
      </div>
      <div className="mt-3 text-center text-sm opacity-70">{formatBirthDate(data.birthDate)}</div>
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
}
