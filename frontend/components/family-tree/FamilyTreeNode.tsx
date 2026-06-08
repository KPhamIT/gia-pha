import { Handle, Position, useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

type PersonNodeData = {
  fullName: string;
  avatar?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  isRoot: boolean;
  personId?: number;
  onNodeClick?: (personId: number) => void;
};

type FamilyTreeNodeProps = {
  data: PersonNodeData;
  selected?: boolean;
  id?: string;
};

const birthDateFormatter = new Intl.DateTimeFormat('vi-VN');

function formatBirthDate(birthDate?: string | null) {
  if (!birthDate) return 'Chưa có';
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
      className={`cursor-pointer rounded-2xl border-2 bg-white p-4 transition-all hover:shadow-lg ${
        selected
          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
          : 'border-slate-200 shadow-sm hover:border-blue-300'
      }`}
    >
      <Handle type="source" position={Position.Top} />
      <div className="flex items-center justify-center">
        {/* <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-200">
          {data.avatar ? (
            <img src={data.avatar} alt={data.fullName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-slate-600">
              {data.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div> */}
        <div className="text-center">
          <p className="font-semibold text-slate-900">{data.fullName}</p>
          <p className="text-xs text-slate-500">{data.gender || 'Giới tính chưa cập nhật'}</p>
        </div>
      </div>
      <div className="mt-3 text-center text-sm text-slate-600">{formatBirthDate(data.birthDate)}</div>
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
}
