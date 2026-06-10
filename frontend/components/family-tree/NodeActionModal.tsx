'use client';

import { useState } from 'react';
import type { CreateChildFormInput, Person } from '../types/family-tree-types';
import Icon from '../icons/Icon';
import { UI } from '@/lib/constants/ui-strings';

const EMPTY_CHILD_FORM = {
  fullName: '',
  gender: '',
  birthDate: '',
  avatar: '',
};

type NodeActionModalProps = {
  node: Person;
  onClose: () => void;
  onCreateChild: (childData: CreateChildFormInput) => void;
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
  const [childForm, setChildForm] = useState(EMPTY_CHILD_FORM);

  const handleCreateChild = () => {
    if (!childForm.fullName.trim()) {
      alert(UI.CHILD_NAME_REQUIRED);
      return;
    }

    onCreateChild({
      ...childForm,
      generation: node.generation != null ? node.generation + 1 : 1,
      branch: node.branch != null ? String(node.branch) : '1',
      parentId: node.id,
    });

    setChildForm(EMPTY_CHILD_FORM);
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
                <p className="text-xs text-slate-500">{UI.DELETE_IRREVERSIBLE}</p>
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
                <p className="text-lg font-semibold text-slate-900">{UI.OPTIONS_FOR}</p>
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
                <p className="text-lg font-semibold text-slate-900">{UI.ADD_CHILD_FOR}</p>
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
                <label className="mb-1 block text-sm font-semibold text-slate-700">{UI.CHILD_NAME}</label>
                <input
                  type="text"
                  value={childForm.fullName}
                  onChange={(event) => setChildForm({ ...childForm, fullName: event.target.value })}
                  placeholder={UI.NAME_PLACEHOLDER}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">{UI.GENDER}</label>
                <select
                  value={childForm.gender}
                  onChange={(event) => setChildForm({ ...childForm, gender: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none"
                  disabled={loading}
                >
                  <option value="">{UI.GENDER_PLACEHOLDER}</option>
                  <option value={UI.GENDER_MALE}>{UI.GENDER_MALE}</option>
                  <option value={UI.GENDER_FEMALE}>{UI.GENDER_FEMALE}</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">{UI.BIRTH_DATE}</label>
                <input
                  type="date"
                  value={childForm.birthDate}
                  onChange={(event) => setChildForm({ ...childForm, birthDate: event.target.value })}
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
