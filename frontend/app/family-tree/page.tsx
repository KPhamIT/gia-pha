'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FamilyTreeGraph from '@/components/family-tree/FamilyTreeGraph';
import NodeActionModal from '@/components/family-tree/NodeActionModal';
import { Person } from '@/components/types/family-tree-types';
import FamilyTreeSettings from '@/components/family-tree/FamilyTreeSettings';
import Icon from '@/components/icons/Icon';
import { useFamilyTree } from '@/hooks/useFamilyTree';
import { api } from '@/lib/api';

export default function FamilyTreePage() {
  const router = useRouter();
  const { treeData, loading, error, reload } = useFamilyTree();
  const [selectedNode, setSelectedNode] = useState<Person | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [layoutConfig, setLayoutConfig] = useState({
    horizontalGap: 1,
    verticalStep: 220,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('family-tree-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('family-tree-theme', theme);
  }, [theme]);

  const handleDeleteNode = async () => {
    if (!selectedNode) return;
    try {
      setModalLoading(true);
      await api.person.delete(selectedNode.id);
      setSelectedNode(null);
      await reload();
    } catch (err) {
      alert((err as Error).message || 'Lỗi khi xóa');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCreateChild = async (childData: {
    fullName: string;
    gender: string;
    birthDate: string;
    avatar: string;
    generation?: number;
    branch?: string;
    parentId: number;
  }) => {
    try {
      setModalLoading(true);
      const body = {
        fullName: childData.fullName,
        gender: childData.gender,
        birthDate: childData.birthDate,
        avatar: childData.avatar,
        generation: childData.generation,
        branch: childData.branch ? Number(childData.branch) : 1,
      };

      const created = await api.person.create(body);

      try {
        const allRels = await api.relationship.list();
        const exists = allRels.some(
          (r) =>
            r.type === 'CHILD' &&
            ((r.fromId === childData.parentId && r.toId === created.id) ||
              (r.fromId === created.id && r.toId === childData.parentId)),
        );
        if (!exists) {
          await api.relationship.create({ fromId: created.id, toId: childData.parentId, type: 'CHILD' });
        }
      } catch {
        await api.relationship.create({ fromId: created.id, toId: childData.parentId, type: 'CHILD' });
      }

      await reload();
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Lỗi khi tạo con');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex h-screen w-full items-center justify-center ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`text-lg ${theme === 'dark' ? 'text-slate-100' : 'text-slate-600'}`}>
          Đang tải cây gia đình...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex h-screen w-full items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className={`rounded-lg p-6 text-center ${theme === 'dark' ? 'bg-slate-900 border border-slate-700' : 'bg-red-50'}`}>
          <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>Lỗi</p>
          <p className={`mt-2 ${theme === 'dark' ? 'text-slate-200' : 'text-red-500'}`}>{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className={`flex h-screen w-full items-center justify-center ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`text-lg ${theme === 'dark' ? 'text-slate-100' : 'text-slate-600'}`}>
          Không có dữ liệu cây gia đình
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="fixed right-4 top-4 z-20">
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          className={`grid h-11 w-11 place-items-center rounded-full border shadow-sm transition ${theme === 'dark' ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
          aria-label="Cài đặt layout"
        >
          <Icon
            path="settings"
            pointer
            width={20}
            height={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="h-screen">
        <FamilyTreeGraph
          key={`${treeData.root.id}-${treeData.relationships.length}`}
          treeData={treeData}
          layoutConfig={layoutConfig}
          onNodeClick={(_personId, person) => { setSelectedNode(person); }}
        />
      </div>

      {showSettings ? (
        <FamilyTreeSettings
          layoutConfig={layoutConfig}
          setLayoutConfig={setLayoutConfig}
          theme={theme}
          setTheme={setTheme}
          onClose={() => setShowSettings(false)}
        />
      ) : null}
      {selectedNode && (
        <NodeActionModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onCreateChild={handleCreateChild}
          onDeleteNode={handleDeleteNode}
          loading={modalLoading}
        />
      )}
    </div>
  );
}
