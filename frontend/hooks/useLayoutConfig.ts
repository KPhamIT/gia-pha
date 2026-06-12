'use client';

import { useState } from 'react';
import type { LayoutConfig } from '@/components/types/family-tree-types';

const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  horizontalGap: 15,
  verticalStep: 220,
  nodeWidth: 80,
  nodeHeight: 120,
  nodeBgColor: '#ffffff',
  nodeTextColor: '#0f172a',
};

export function useLayoutConfig(initialConfig: LayoutConfig = DEFAULT_LAYOUT_CONFIG) {
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(initialConfig);

  return { layoutConfig, setLayoutConfig };
}
