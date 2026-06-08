type NewPersonFormProps = {
  newPersonForm: {
    fullName: string;
    gender: string;
    birthDate: string;
    avatar: string;
    generation?: string;
    branch?: string;
  };
  onNewPersonChange: (field: string, value: string) => void;
  onCreatePerson: () => void;
};

export default function NewPersonForm({ newPersonForm, onNewPersonChange, onCreatePerson }: NewPersonFormProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Tạo thành viên mới</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          Họ và tên
          <input
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            value={newPersonForm.fullName}
            onChange={(event) => onNewPersonChange('fullName', event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Giới tính
          <select
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            value={newPersonForm.gender}
            onChange={(event) => onNewPersonChange('gender', event.target.value)}
          >
            <option value="">Chưa chọn</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Ngày sinh
          <input
            type="date"
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            value={newPersonForm.birthDate}
            onChange={(event) => onNewPersonChange('birthDate', event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Ảnh đại diện URL
          <input
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            value={newPersonForm.avatar}
            onChange={(event) => onNewPersonChange('avatar', event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Đời
          <select
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            value={newPersonForm.generation || ''}
            onChange={(event) => onNewPersonChange('generation', event.target.value)}
          >
            <option value="">Chưa chọn</option>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((gen) => (
              <option key={gen} value={gen.toString()}>
                Đời thứ {gen}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Nhánh
          <select
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            value={newPersonForm.branch || ''}
            onChange={(event) => onNewPersonChange('branch', event.target.value)}
          >
            <option value="">Chưa chọn</option>
            <option value="1">Đại Tôn</option>
            <option value="2">Trung Tôn</option>
            <option value="3">Tiểu Tôn</option>
          </select>
        </label>
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          className="rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-500"
          onClick={onCreatePerson}
        >
          Tạo người mới
        </button>
      </div>
    </div>
  );
}
