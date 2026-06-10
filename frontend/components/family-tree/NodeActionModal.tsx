'use client';

import { Person } from '../types/family-tree-types';
import { useState } from 'react';
import Icon from '../icons/Icon';

type NodeActionModalProps = {
  node: Person;
  onClose: () => void;
  onCreateChild: (childData: {
    fullName: string;
    gender: string;
    birthDate: string;
    avatar: string;
    generation?: number;
    branch?: string;
    parentId: number;
  }) => void;
  onDeleteNode: () => void;
  loading?: boolean;
};

export default function NodeActionModal({
  node,
  onClose,
  onCreateChild,
  onDeleteNode,
  loading = false,
}: NodeActionModalProps) {
  const [showChildForm, setShowChildForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [childForm, setChildForm] = useState({
    fullName: '',
    gender: '',
    birthDate: '',
    avatar: '',
  });

  const handleCreateChild = async () => {
    if (!childForm.fullName.trim()) {
      alert('Vui lòng nhập tên con');
      return;
    }

    onCreateChild({
      ...childForm,
      generation: node.generation ? node.generation + 1 : 1,
      branch: node.branch != null ? String(node.branch) : '1',
      parentId: node.id,
    });

    setChildForm({ fullName: '', gender: '', birthDate: '', avatar: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        {showConfirmDelete ? (
          <>
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
                <Icon path="alertTriangle" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Xóa {node.fullName}?</p>
                <p className="text-xs text-slate-500">Hành động này không thể hoàn tác.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="grid place-items-center rounded-2xl border border-slate-300 py-3 text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                disabled={loading}
              >
                <Icon path="arrowLeft" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
              </button>
              <button
                type="button"
                onClick={onDeleteNode}
                className="grid place-items-center rounded-2xl bg-red-600 py-3 text-white transition hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                <Icon path="trash" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
              </button>
            </div>
          </>
        ) : !showChildForm ? (
          <>
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">Tùy chọn cho</p>
                <p className="text-base font-semibold text-slate-900">{node.fullName}</p>
                {node.generation != null && (
                  <p className="text-sm text-slate-500">Đời thứ {node.generation}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon path="close" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowChildForm(true)}
                className="grid place-items-center rounded-2xl bg-green-600 py-3 text-white transition hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                <Icon path="userPlus" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="grid place-items-center rounded-2xl bg-red-50 py-3 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                disabled={loading}
              >
                <Icon path="trash" size={20} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">Thêm con cho</p>
                <p className="text-base font-semibold text-slate-900">{node.fullName}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowChildForm(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <Icon path="close" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tên con
                </label>
                <input
                  type="text"
                  value={childForm.fullName}
                  onChange={(e) => setChildForm({ ...childForm, fullName: e.target.value })}
                  placeholder="Nhập tên"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Giới tính
                </label>
                <select
                  value={childForm.gender}
                  onChange={(e) => setChildForm({ ...childForm, gender: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none"
                  disabled={loading}
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={childForm.birthDate}
                  onChange={(e) => setChildForm({ ...childForm, birthDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowChildForm(false)}
                  className="grid place-items-center rounded-2xl border border-slate-300 py-3 text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  disabled={loading}
                >
                  <Icon path="arrowLeft" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
                </button>
                <button
                  type="button"
                  onClick={handleCreateChild}
                  className="grid place-items-center rounded-2xl bg-green-600 py-3 text-white transition hover:bg-green-700 disabled:opacity-50"
                  disabled={loading}
                >
                  <Icon path="check" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
