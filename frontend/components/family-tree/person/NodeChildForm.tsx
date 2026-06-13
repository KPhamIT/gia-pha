'use client';

import { useState } from 'react';
import type { CreateChildFormInput, Person } from '@/components/types/family-tree-types';
import Icon from '@/components/icons/Icon';
import { UI } from '@/lib/constants/ui-strings';
import { ModalHeader, iconBtn } from './NodeActionViews';

const EMPTY_CHILD_FORM = { fullName: '', gender: '', birthDate: '', avatar: '' };
const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:outline-none';
const labelClass = 'mb-1 block text-sm font-semibold text-slate-700';

export default function NodeChildForm({ node, loading, onBack, onCreate }: {
  node: Person;
  loading: boolean;
  onBack: () => void;
  onCreate: (data: CreateChildFormInput) => void;
}) {
  const [form, setForm] = useState(EMPTY_CHILD_FORM);

  const submit = () => {
    if (!form.fullName.trim()) {
      alert(UI.CHILD_NAME_REQUIRED);
      return;
    }
    onCreate({
      ...form,
      generation: node.generation != null ? node.generation + 1 : 1,
      branch: node.branch != null ? String(node.branch) : '1',
      parentId: node.id,
    });
    setForm(EMPTY_CHILD_FORM);
  };

  return (
    <>
      <ModalHeader title={UI.ADD_CHILD_FOR} subtitle={node.fullName} onClose={onBack} />
      <div className="space-y-3">
        <div>
          <label className={labelClass}>{UI.CHILD_NAME}</label>
          <input type="text" value={form.fullName} disabled={loading} placeholder={UI.NAME_PLACEHOLDER}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{UI.GENDER}</label>
          <select value={form.gender} disabled={loading}
            onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputClass}>
            <option value="">{UI.GENDER_PLACEHOLDER}</option>
            <option value={UI.GENDER_MALE}>{UI.GENDER_MALE}</option>
            <option value={UI.GENDER_FEMALE}>{UI.GENDER_FEMALE}</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{UI.BIRTH_DATE}</label>
          <input type="date" value={form.birthDate} disabled={loading}
            onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={onBack} disabled={loading} className={`${iconBtn} border border-slate-300 text-slate-700 hover:bg-slate-50`}>
            <Icon path="arrowLeft" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
          </button>
          <button type="button" onClick={submit} disabled={loading} className={`${iconBtn} bg-green-600 text-white hover:bg-green-700`}>
            <Icon path="check" size={18} fill="none" stroke="currentColor" strokeWidth={2} pointer={false} />
          </button>
        </div>
      </div>
    </>
  );
}
