"use client";

import { useState } from "react";
import type { LayoutConfig } from "@/components/types/family-tree-types";
import { INITIAL_LAYOUT_CONFIG } from "@/lib/settings/parse-user-settings";

export function useLayoutConfig(
  initialConfig: LayoutConfig = INITIAL_LAYOUT_CONFIG,
) {
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(initialConfig);

  return { layoutConfig, setLayoutConfig };
}
