import { AuthResponse } from '../types/family-tree-types';

type FamilyTreeHeaderProps = {
  showApp: boolean;
  user: AuthResponse['user'] | null;
  allowPublicAccess: boolean;
  loading: boolean;
  onLogout: () => void;
  onFacebookLogin: () => void;
};

export default function FamilyTreeHeader({
  showApp,
  user,
  allowPublicAccess,
  loading,
  onLogout,
  onFacebookLogin,
}: FamilyTreeHeaderProps) {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Family Tree App</p>
          <h1 className="mt-2 text-3xl font-semibold">Gia phả React Flow + SVG</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Đăng nhập Facebook, cập nhật hồ sơ, tạo quan hệ và hiển thị cây gia phả bằng biểu đồ SVG.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          {showApp ? (
            <>
              <p className="text-slate-700">
                Xin chào, {user?.email || (allowPublicAccess ? 'Chế độ phát triển công khai' : 'Người dùng Facebook')}
              </p>
              <div className="flex items-center gap-3">
                {allowPublicAccess ? (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800">DEV MODE</span>
                ) : null}
                <button
                  type="button"
                  className="rounded-full bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-700"
                  onClick={onLogout}
                >
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-500"
              onClick={onFacebookLogin}
            >
              {loading ? 'Đang tải...' : 'Đăng nhập bằng Facebook'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
