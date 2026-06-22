"use client";

import { Toaster } from "sonner";

/** Mobile-first toast host — bottom-center, safe-area aware. */
export default function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      expand={false}
      richColors
      closeButton
      visibleToasts={3}
      toastOptions={{
        classNames: {
          toast: "rounded-2xl border shadow-lg text-sm",
          title: "font-medium",
        },
      }}
      style={{
        bottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    />
  );
}
