"use client";

import { useEffect, useRef } from "react";
import Icon from "@/components/icons/Icon";
import { UI } from "@/lib/constants/ui-strings";

type Props = {
  x: number;
  y: number;
  onBringForward: () => void;
  onSendBackward: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function ExportLayerContextMenu({
  x,
  y,
  onBringForward,
  onSendBackward,
  onDelete,
  onClose,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="pointer-events-auto fixed z-[60] min-w-[11rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
      style={{ left: x, top: y }}
    >
      <button
        type="button"
        onClick={onBringForward}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
      >
        <Icon path="chevronUp" size={16} stroke="#2563eb" pointer={false} />
        {UI.EXPORT_LAYER_BRING_FORWARD}
      </button>
      <button
        type="button"
        onClick={onSendBackward}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
      >
        <Icon path="chevronDown" size={16} stroke="#ea580c" pointer={false} />
        {UI.EXPORT_LAYER_SEND_BACKWARD}
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
      >
        <Icon path="trash" size={16} stroke="currentColor" pointer={false} />
        {UI.EXPORT_LAYER_DELETE_IMAGE}
      </button>
    </div>
  );
}
