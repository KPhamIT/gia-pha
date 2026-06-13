'use client';

import { useState } from 'react';
import type { CreateChildFormInput, Person } from '@/components/types/family-tree-types';
import LoadingSpinner from '@/components/icons/LoadingSpinner';
import { UI } from '@/lib/constants/ui-strings';
import { ActionOptions, ConfirmDelete } from './NodeActionViews';
import NodeChildForm from './NodeChildForm';

type NodeActionModalProps = {
  node: Person;
  onClose: () => void;
  onCreateChild: (childData: CreateChildFormInput) => void;
  onDeleteNode: () => void;
  loading?: boolean;
};

type View = 'options' | 'child' | 'confirm';

export default function NodeActionModal({
  node,
  onClose,
  onCreateChild,
  onDeleteNode,
  loading = false,
}: NodeActionModalProps) {
  const [view, setView] = useState<View>('options');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        {loading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/80">
            <LoadingSpinner size={40} label={UI.SAVING} />
          </div>
        ) : null}

        {view === 'confirm' ? (
          <ConfirmDelete node={node} loading={loading} onBack={() => setView('options')} onConfirm={onDeleteNode} />
        ) : view === 'child' ? (
          <NodeChildForm node={node} loading={loading} onBack={() => setView('options')} onCreate={onCreateChild} />
        ) : (
          <ActionOptions
            node={node}
            loading={loading}
            onClose={onClose}
            onAddChild={() => setView('child')}
            onDelete={() => setView('confirm')}
          />
        )}
      </div>
    </div>
  );
}
