'use client';

import { Person } from '../types/family-tree-types';
import { useState } from 'react';

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
  loading?: boolean;
};

export default function NodeActionModal({
  node,
  onClose,
  onCreateChild,
  loading = false,
}: NodeActionModalProps) {
  const [showChildForm, setShowChildForm] = useState(false);
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
      branch: node.branch || '1',
      parentId: node.id,
    });

    setChildForm({ fullName: '', gender: '', birthDate: '', avatar: '' });
    setShowChildForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        {!showChildForm ? (
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
                ✕
              </button>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setShowChildForm(true)}
                className="rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                Thêm con
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
                ✕
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
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleCreateChild}
                  className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Đang tạo...' : 'Tạo con'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
