import { Person } from '../types/family-tree-types';

type PersonSidebarProps = {
  persons: Person[];
  rootId: number | null;
  onRootChange: (value: number) => void;
};

export default function PersonSidebar({ persons, rootId, onRootChange }: PersonSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Chọn gốc cây</h2>
        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-600">Chọn người để hiển thị cây gia phả quanh người đó.</p>
          <select
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            value={rootId ?? ''}
            onChange={(event) => onRootChange(Number(event.target.value))}
          >
            <option value="">Chọn gốc cây</option>
            {persons.map((item) => (
              <option key={item.id} value={item.id}>
                {item.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Danh sách thành viên</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          {persons.length === 0 ? (
            <p>Chưa có người nào trong hệ thống.</p>
          ) : (
            persons.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-medium">{item.fullName}</p>
                <p className="text-xs text-slate-500">ID: {item.id}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
