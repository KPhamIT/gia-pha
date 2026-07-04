"use client";

import { useParams } from "next/navigation";
import CeremonyHeritageExperience from "@/components/ceremonies/CeremonyHeritageExperience";
import { UI } from "@/lib/constants/ui-strings";

export default function PublicCeremonySharePage() {
  const params = useParams();
  const token = typeof params.token === "string" ? params.token : "";

  if (!token) return null;

  return (
    <CeremonyHeritageExperience
      shareToken={token}
      title={UI.CEREMONY_TITLE}
    />
  );
}
