import { Person, RelationshipType } from '../types/family-tree-types';

type RelationshipFormProps = {
  persons: Person[];
  currentPersonId: number | null;
  relationTargetId: number | null;
  relationType: RelationshipType;
  onRelationTargetChange: (value: number | null) => void;
  onRelationTypeChange: (value: RelationshipType) => void;
  onCreateRelationship: () => void;
};

export default function RelationshipForm({
  persons,
  currentPersonId,
  relationTargetId,
  relationType,
  onRelationTargetChange,
  onRelationTypeChange,
  onCreateRelationship,
}: RelationshipFormProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Tạo quan hệ</h2>
      <div className="mt-5 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            Chọn thành viên
            <select
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
              value={relationTargetId ?? ''}
              onChange={(event) => onRelationTargetChange(Number(event.target.value) || null)}
            >
              <option value="">Chọn người</option>
              {persons
                .filter((item) => item.id !== currentPersonId)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName}
                  </option>
                ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Loại quan hệ
            <select
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
              value={relationType}
              onChange={(event) => onRelationTypeChange(event.target.value as RelationshipType)}
            >
              <option value="FATHER">Cha</option>
              <option value="MOTHER">Mẹ</option>
              <option value="SPOUSE">Vợ/Chồng</option>
              <option value="CHILD">Con</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-full bg-purple-600 px-6 py-3 text-white transition hover:bg-purple-500"
            onClick={onCreateRelationship}
          >
            Lưu quan hệ
          </button>
        </div>
      </div>
    </div>
  );
}
