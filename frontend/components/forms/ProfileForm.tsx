import { Person } from '../types/family-tree-types';

type ProfileFormProps = {
  profileForm: {
    fullName: string;
    gender: string;
    birthDate: string;
    avatar: string;
  };
  onProfileChange: (field: keyof Omit<Person, 'id' | 'userId'>, value: string) => void;
  onSaveProfile: () => void;
};

export default function ProfileForm({ profileForm, onProfileChange, onSaveProfile }: ProfileFormProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Hồ sơ cá nhân</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          Họ và tên
          <input
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            value={profileForm.fullName}
            onChange={(event) => onProfileChange('fullName', event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Giới tính
          <select
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            value={profileForm.gender}
            onChange={(event) => onProfileChange('gender', event.target.value)}
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
            value={profileForm.birthDate}
            onChange={(event) => onProfileChange('birthDate', event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm text-slate-700">
          Ảnh đại diện URL
          <input
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500"
            value={profileForm.avatar}
            onChange={(event) => onProfileChange('avatar', event.target.value)}
          />
        </label>
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          className="rounded-full bg-green-600 px-6 py-3 text-white transition hover:bg-green-500"
          onClick={onSaveProfile}
        >
          Lưu hồ sơ
        </button>
      </div>
    </div>
  );
}
