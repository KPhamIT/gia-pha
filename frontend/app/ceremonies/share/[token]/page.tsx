"use client";

import { useParams } from "next/navigation";
import BookPageShell from "@/components/ui/BookPageShell";
import CeremonyViewer from "@/components/notifications/CeremonyViewer";
import { UI } from "@/lib/constants/ui-strings";

export default function PublicCeremonySharePage() {
  const params = useParams();
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <BookPageShell
      title={UI.CEREMONY_TITLE}
      subtitle={UI.CEREMONY_PUBLIC_SUBTITLE}
    >
      {token ? <CeremonyViewer shareToken={token} /> : null}
    </BookPageShell>
  );
}
