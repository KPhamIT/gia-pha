'use client';

import { useRef, type MutableRefObject, type PointerEvent as ReactPointerEvent } from 'react';
import type { ExportBox } from '@/lib/family-tree/tree-export-settings';
import { IMAGE_ASPECT, type DragState, type DraggableId } from './tree-export-svg-utils';

type Options = {
  interactive: boolean;
  onSelect?: (id: DraggableId | null) => void;
  onChange?: (id: DraggableId, patch: Partial<ExportBox>) => void;
};

/** Pointer-driven move/resize for the export overlay's draggable boxes. */
export function useExportSvgDrag(
  svgRef: MutableRefObject<SVGSVGElement | null>,
  { interactive, onSelect, onChange }: Options,
) {
  const dragRef = useRef<DragState | null>(null);

  const toSvgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  };

  const beginDrag = (
    e: ReactPointerEvent,
    id: DraggableId,
    mode: 'move' | 'resize',
    box: { x: number; y: number },
  ) => {
    if (!interactive) return;
    e.stopPropagation();
    e.preventDefault();
    onSelect?.(id);
    const p = toSvgPoint(e.clientX, e.clientY);
    if (!p) return;
    dragRef.current = { id, mode, startX: p.x, startY: p.y, boxX: box.x, boxY: box.y };
    svgRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const p = toSvgPoint(e.clientX, e.clientY);
    if (!p) return;

    if (drag.mode === 'move') {
      if (drag.id === 'coupletRight') {
        onChange?.(drag.id, { y: drag.boxY + (p.y - drag.startY) });
      } else {
        onChange?.(drag.id, { x: drag.boxX + (p.x - drag.startX), y: drag.boxY + (p.y - drag.startY) });
      }
      return;
    }
    // resize (images only): anchor at top-left, lock aspect ratio.
    const aspect = IMAGE_ASPECT[drag.id as 'scroll' | 'dragonLeft' | 'dragonRight'] ?? 1;
    const width = Math.max(40, p.x - drag.boxX);
    onChange?.(drag.id, { width, height: width / aspect });
  };

  const endDrag = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    svgRef.current?.releasePointerCapture(e.pointerId);
  };

  return { beginDrag, handlePointerMove, endDrag };
}
