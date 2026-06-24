"use client";

import BookPageShell from "@/components/ui/BookPageShell";
import CeremonyViewer from "@/components/notifications/CeremonyViewer";
import { UI } from "@/lib/constants/ui-strings";

export default function CeremonyDemoPage() {
  return (
    <BookPageShell
      title={UI.CEREMONY_TITLE}
      subtitle={UI.LANDING_DEMO_HINT}
      backHref="/"
    >
      <CeremonyViewer demo />
    </BookPageShell>
  );
}
