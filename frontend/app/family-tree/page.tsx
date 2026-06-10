'use client';

import { useState } from 'react';
import FamilyTreeGraph from '@/components/family-tree/FamilyTreeGraph';
import NodeActionModal from '@/components/family-tree/NodeActionModal';
import FamilyTreeSettings from '@/components/family-tree/FamilyTreeSettings';
import FamilyTreeStatus from '@/components/family-tree/FamilyTreeStatus';
import Icon from '@/components/icons/Icon';
import { useFamilyTree } from '@/hooks/useFamilyTree';
import { useLayoutConfig } from '@/hooks/useLayoutConfig';
import { usePersonActions } from '@/hooks/usePersonActions';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';
import type { UserSettings } from '@/lib/api/modules/settings';
import type { Person, ThemeMode } from '@/components/types/family-tree-types';
import { getPageShellClass } from '@/utils/theme';

export default function FamilyTreePage() {
  const { treeData, loading, error, reload, addPerson, removePerson, addRelationship, removeRelationship } =
    useFamilyTree();
  const { theme, setTheme } = useTheme();
  const { layoutConfig, setLayoutConfig } = useLayoutConfig();

  const { saveSettings, saving: savingSettings, saveError: settingsSaveError, saveSuccess } = useSettings({
    onLoaded: (saved: UserSettings) => {
      if (typeof saved.theme === 'string') setTheme(saved.theme as ThemeMode);
      setLayoutConfig((prev) => ({
        ...prev,
        ...(typeof saved.horizontalGap === 'number' && { horizontalGap: saved.horizontalGap }),
        ...(typeof saved.verticalStep === 'number' && { verticalStep: saved.verticalStep }),
        ...(typeof saved.nodeBgColor === 'string' && { nodeBgColor: saved.nodeBgColor }),
        ...(typeof saved.nodeTextColor === 'string' && { nodeTextColor: saved.nodeTextColor }),
      }));
    },
  });
  const [selectedNode, setSelectedNode] = useState<Person | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const { createChild, deleteNode, loading: modalLoading } = usePersonActions({
    selectedNode,
    setSelectedNode,
    addPerson,
    removePerson,
  });

  if (loading) {
    return <FamilyTreeStatus theme={theme} type="loading" />;
  }

  if (error) {
    return <FamilyTreeStatus theme={theme} type="error" message={error} onRetry={reload} />;
  }

  if (!treeData) {
    return <FamilyTreeStatus theme={theme} type="empty" />;
  }

  return (
    <div className={`min-h-screen ${getPageShellClass(theme)}`}>
      <div className="fixed right-4 top-4 z-20">
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          className={`grid h-11 w-11 place-items-center rounded-full border shadow-sm transition ${
            theme === 'dark'
              ? 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
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
          treeData={treeData}
          layoutConfig={layoutConfig}
          onNodeClick={(_personId, person) => setSelectedNode(person)}
          onPersonAdded={addPerson}
          onRelationshipAdded={addRelationship}
          onRelationshipRemoved={removeRelationship}
        />
      </div>

      {showSettings ? (
        <FamilyTreeSettings
          layoutConfig={layoutConfig}
          setLayoutConfig={setLayoutConfig}
          theme={theme}
          setTheme={setTheme}
          onClose={() => setShowSettings(false)}
          onSave={() => saveSettings({ theme, ...layoutConfig })}
          saving={savingSettings}
          saveSuccess={saveSuccess}
          saveError={settingsSaveError}
        />
      ) : null}

      {selectedNode ? (
        <NodeActionModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onCreateChild={createChild}
          onDeleteNode={deleteNode}
          loading={modalLoading}
        />
      ) : null}
    </div>
  );
}
